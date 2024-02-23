import { Component } from '@angular/core';
import Vorlesung from 'src/app/classes/Vorlesung';
import DatabaseService from 'src/services/DatabaseService';
import NavigationService from 'src/services/NavigationService';
import QuizService from 'src/services/QuizService';
import SubjectService from 'src/services/SubjectService';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent {
  shuffle:boolean = true;
  subjects:Vorlesung[] = [];
  checkedSubjects:number[] = [];

  constructor(private databaseService: DatabaseService, private quizService:QuizService, private navService:NavigationService){

  }

  ngOnInit(): void {
    this.subjects = this.databaseService.getCurrentSubjects();
    this.subjects.forEach(() => {
      this.checkedSubjects.push(0);
    });
  }

  toggleShuffle(){
    this.shuffle = !this.shuffle;
  }

  checkSubject(index:number){
    this.checkedSubjects[index] == 0 ? this.checkedSubjects[index] = 1 : this.checkedSubjects[index] = 0;
  }

  startQuiz(){
    let vorlesungenChecked:boolean = false;
    const vorlesungen: Vorlesung[] = [];
    for(let i = 0; i < this.subjects.length; i++){
      if(this.checkedSubjects[i] == 1){
        vorlesungen.push(this.subjects[i]);
        vorlesungenChecked = true;
      }
    }
    if(!vorlesungenChecked) return;
    this.quizService.setSubjects(vorlesungen);
    this.quizService.setShuffleMode(this.shuffle);
    this.navService.setCurrentNav('Quiz Started');
  }

}
