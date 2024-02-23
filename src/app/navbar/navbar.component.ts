import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import NavigationService from 'src/services/NavigationService';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  currentNav: string = "";

  navSubscrition: Subscription = new Subscription();


  constructor(private navigationService: NavigationService) {

  }

  ngOnInit(): void {
    this.navSubscrition = this.navigationService.$currentNav.subscribe(erg => {
      this.currentNav = erg;
    })
  }

  setNav(nav:string){
    this.navigationService.setCurrentNav(nav);
  }

}
