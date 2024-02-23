import { Component } from '@angular/core';
import Frage from 'src/app/classes/Frage';
import Vorlesung from 'src/app/classes/Vorlesung';
import QuizService from 'src/services/QuizService';

@Component({
  selector: 'app-quiz-started',
  templateUrl: './quiz-started.component.html',
  styleUrls: ['./quiz-started.component.scss']
})
export class QuizStartedComponent {
  progress:number = 1;
  answerShowed:boolean = false;
  questions:Frage[] = [];
  subjects:Vorlesung[] = [];
  currentQuestion:Frage = new Frage(999,"", "", "");
  currentQuestionIndex:number = 0;

  constructor(private quizService: QuizService){}

  ngOnInit(): void {
    this.initQuestions();
    this.currentQuestion = this.questions[0];
  }

  toggleAnswer(){
    this.answerShowed = !this.answerShowed;
  }

  initQuestions(){
    this.subjects = this.quizService.getSubjects();
    const shuffleMode = this.quizService.getShuffleMode();
    this.subjects.forEach((subject:Vorlesung) => {
      subject.fragen.forEach((frage:Frage) => {
        this.questions.push(frage);
      })
    })
    if(shuffleMode){
      this.shuffleQuestions();
    }
  }

  shuffleQuestions() {
    // Eine Kopie des ursprünglichen Arrays erstellen, um die Originalreihenfolge zu bewahren
    const shuffledQuestions = [...this.questions];
    
    for (let i = shuffledQuestions.length - 1; i > 0; i--) {
      // Ein zufälliges Element bis zum aktuellen Element auswählen
      const j = Math.floor(Math.random() * (i + 1));
      
      // Das aktuelle Element mit dem zufällig ausgewählten Element tauschen
      [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
    }
  
    // Das gemischte Array zuweisen
    this.questions = shuffledQuestions;
  }

  nextQuestion(){
    if(this.currentQuestionIndex < this.questions.length - 1){
      this.answerShowed = false;
      this.currentQuestion = this.questions[++this.currentQuestionIndex];
      this.updateProgress();
    }
  }
  
  prevQuestion(){
    if(this.currentQuestionIndex > 0){
      this.answerShowed = false;
      this.currentQuestion = this.questions[--this.currentQuestionIndex];
      this.updateProgress();
    }
  }

  updateProgress(){
    this.progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
  }

  // shuffleQuestions(){
  //   const shuffledQuestions = [];
  //   let count = this.questions.length;
  //   const randoms:number[] = [];
  //   while(count > 1){
  //     let random = Math.floor(Math.random() * count);;
  //     do{
  //       random = Math.floor(Math.random() * count);
  //     } while(randoms.includes(random));
  //     randoms.push(random);
  //     shuffledQuestions.push(this.questions[random]);
  //     count--;
  //   }
  //   console.log("Count Questions before shuffle " + this.questions.length);
  //   this.questions = shuffledQuestions;
  //   console.log("Count Questions after shuffle " + this.questions.length);
  // }

}
