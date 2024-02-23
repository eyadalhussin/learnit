import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import Frage from "src/app/classes/Frage";

@Injectable({providedIn: 'root'})
export default class QuestionService{
    dummyFrage:Frage = new Frage(999, "", "", "");
    private currentQuestion: BehaviorSubject<Frage> = new BehaviorSubject<Frage>(this.dummyFrage);
    currenQuestion$ = this.currentQuestion.asObservable();
    constructor(){}

    setCurrentQuestion(question: Frage){
        this.currentQuestion.next(question);
    }
}