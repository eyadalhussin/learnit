import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import Frage from 'src/app/classes/Frage';
import DatabaseService from 'src/services/DatabaseService';
import NavigationService from 'src/services/NavigationService';
import QuestionService from 'src/services/QuestionService';
import SubjectService from 'src/services/SubjectService';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.scss']
})
export class EditQuestionComponent {

  updateState:string = 'Aktualisieren';
  updating:boolean = false;
  deletingQuestion:boolean = false;

  currentQuestion:Frage;

  questionSubscription = new Subscription();

  constructor(private questionService:QuestionService, private navigationService:NavigationService, private databaseService:DatabaseService, private subjectService: SubjectService){
    this.currentQuestion = this.questionService.dummyFrage;
  }

  ngOnInit(): void {
    this.questionSubscription = this.questionService.currenQuestion$.subscribe(erg => this.currentQuestion = erg); 
  }

  ngOnDestroy(): void {
    this.questionSubscription.unsubscribe();
  }

  navigateBackToQuestions(){
    this.navigationService.setCurrentNav('Questions');
  }

  updateQuestion(beschreibungFeld:HTMLTextAreaElement, frageFeld:HTMLTextAreaElement, antwortFeld:HTMLTextAreaElement){
    if(this.updating) return;
    this.updating = true;
    this.updateState = "Wird aktualisiert...";
    const vorlesung = this.subjectService.getCurrentSubject();
    const updatedQuestion = new Frage(this.currentQuestion.id ,beschreibungFeld.value, frageFeld.value, antwortFeld.value);
    this.databaseService.updateQuestion(updatedQuestion, vorlesung)
    .then(() => {
      this.updateState = 'Erfolgreich aktualisiert';
      setTimeout(() => {
        this.updateState = 'Aktualisieren';
        this.updating = false;
      },2000);
    })
    .catch((error) => {
      this.updateState = 'Error';
      console.log(error);
    });
  }

  deleteQuestion(){
    const currentSubject = this.subjectService.getCurrentSubject();
    this.databaseService.deleteQuestionBySubject(this.currentQuestion, currentSubject)
    .then(() => {
      this.navigateBackToQuestions();
    })
    .catch(error => {
      console.log(error.message);
      
    })
  }
}
