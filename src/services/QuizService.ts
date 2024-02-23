import { Injectable } from "@angular/core";
import Vorlesung from "src/app/classes/Vorlesung";

@Injectable({providedIn: "root"})
export default class QuizService{
    private shuffleMode:boolean = false;
    private vorlesungen: Vorlesung[] = [];

    setSubjects(vorlesungen: Vorlesung[]){
        this.vorlesungen = vorlesungen;
    }

    getSubjects(): Vorlesung[]{
        return this.vorlesungen;
    }

    setShuffleMode(mode:boolean){
        this.shuffleMode = mode;
    }

    getShuffleMode():boolean{
        return this.shuffleMode;
    }
}