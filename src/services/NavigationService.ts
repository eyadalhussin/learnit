import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({providedIn: 'root'})
export default class NavigationService{
    private navSubject:BehaviorSubject<string> = new BehaviorSubject<string>('Subjects');
    $currentNav = this.navSubject.asObservable();; 

    constructor(){}

    setCurrentNav(nav:string){
        this.navSubject.next(nav);
    }


}