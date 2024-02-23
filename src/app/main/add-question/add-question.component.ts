import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import Frage from 'src/app/classes/Frage';
import Vorlesung from 'src/app/classes/Vorlesung';
import DatabaseService from 'src/services/DatabaseService';
import NavigationService from 'src/services/NavigationService';
import SubjectService from 'src/services/SubjectService';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent {
  private subjectSubscription = new Subscription;

  currentSubject: Vorlesung;

  constructor(private navService:NavigationService, private subjectService:SubjectService, private databaseService:DatabaseService){
    this.currentSubject = subjectService.dummyVorlesung;
  }

  ngOnInit(): void {
    this.subjectSubscription = this.subjectService.currentSubject$.subscribe(erg => {
      this.currentSubject = erg;
    })
  }

  ngOnDestroy(): void {
    this.subjectSubscription.unsubscribe();
  }

  addQuestion(questionForm:NgForm){
    if(questionForm.valid){
      const id = this.currentSubject.fragen.length+1;
      const beschreibung = questionForm.value.beschreibung;
      const frage = questionForm.value.frage;
      const antwort = questionForm.value.antwort;
      const newQuestion = new Frage(id, beschreibung, frage, antwort);
      this.databaseService.addNewQuestionToSubject(this.currentSubject, newQuestion).
      then(() => {
        this.backToQuestionView();
      })
      .catch(error => {
        console.log(error.message);
      });
    }
    else {
      console.log("Form invalid !!!!");
    }
  }

  backToQuestionView():void{
    this.navService.setCurrentNav("Questions");
  }
  
}
