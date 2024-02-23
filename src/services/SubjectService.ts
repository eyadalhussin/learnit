import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import Vorlesung from "src/app/classes/Vorlesung";

@Injectable({providedIn: 'root'})
export default class SubjectService{
    dummyVorlesung:Vorlesung = new Vorlesung(999, "", []);
    private currentSubject: BehaviorSubject<Vorlesung> = new BehaviorSubject<Vorlesung>(this.dummyVorlesung);
    currentSubject$ = this.currentSubject.asObservable();

    constructor(){}

    setCurrentSubject(subject: Vorlesung){
        this.currentSubject.next(subject);
    }

    getCurrentSubject():Vorlesung{
        return this.currentSubject.getValue();
    }

}