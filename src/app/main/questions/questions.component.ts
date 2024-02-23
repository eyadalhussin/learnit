import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import Frage from 'src/app/classes/Frage';
import Vorlesung from 'src/app/classes/Vorlesung';
import NavigationService from 'src/services/NavigationService';
import QuestionService from 'src/services/QuestionService';
import SubjectService from 'src/services/SubjectService';


@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent {

  private subjectSubscription = new Subscription();

  currentSubject: Vorlesung;

  constructor(private subjectService:SubjectService, private navService:NavigationService, private questionService: QuestionService){
    this.currentSubject = this.subjectService.dummyVorlesung;
  }

  ngOnInit(): void {
    this.subjectSubscription = this.subjectService.currentSubject$.subscribe(erg => {
      this.currentSubject = erg;
      this.currentSubject.fragen.sort((a,b) => a.id - b.id);
    });
  
  }

  ngOnDestroy(): void {
    this.subjectSubscription.unsubscribe();
  }

  navigateTo(nav:string){
    this.navService.setCurrentNav(nav);
  }

  editQuestion(question: Frage){
    this.navService.setCurrentNav("Edit Question");
    this.questionService.setCurrentQuestion(question);
  }

}
