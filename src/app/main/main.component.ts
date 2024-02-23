import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import DatabaseService from 'src/services/DatabaseService';
import NavigationService from 'src/services/NavigationService';
import Vorlesung from '../classes/Vorlesung';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  currentNav:string = "";

  navSubscrition:Subscription = new Subscription();


  constructor(private navigationService:NavigationService, private databaseService:DatabaseService){

  }

  ngOnInit(): void {
    this.navSubscrition = this.navigationService.$currentNav.subscribe(erg => {
      this.currentNav = erg;
    })
  }


}
