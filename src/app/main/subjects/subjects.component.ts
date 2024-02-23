import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import Vorlesung from 'src/app/classes/Vorlesung';
import DatabaseService from 'src/services/DatabaseService';
import NavigationService from 'src/services/NavigationService';
import SubjectService from 'src/services/SubjectService';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss']
})
export class SubjectsComponent {

  vorlesungen:Vorlesung[] = [];

  databaseSubscription: Subscription = new Subscription;

  constructor(private databaseService: DatabaseService, private subjectService:SubjectService, private navService: NavigationService){

  }

  ngOnInit(): void {
    this.databaseSubscription = this.databaseService.vorlesungen$.subscribe(erg => {
      this.vorlesungen = erg;
    });
  }

  ngOnDestroy(): void {
    this.databaseSubscription.unsubscribe();
  }

  addNewSubject(subjectForm:NgForm){
    if(subjectForm.valid){
      const newSubjectName = subjectForm.value.subjectName;
      this.databaseService.addNewSubject(newSubjectName);
      subjectForm.reset();
    } else {
      console.log("Form Invalid !!");
    }
  }

  showSubjectQuestions(subject:Vorlesung){
    this.navService.setCurrentNav("Questions");
    this.subjectService.setCurrentSubject(subject);
  }

  addMultipleQuestionsToSubject(){
    //this.databaseService.addMultipleQuestionsToSubjectFromJson("assets/static/2-questions.json", 2);
  }

}
