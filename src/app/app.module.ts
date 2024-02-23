import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MainComponent } from './main/main.component';
import { SubjectsComponent } from './main/subjects/subjects.component';
import { QuizComponent } from './main/quiz/quiz.component';
import { QuestionsComponent } from './main/questions/questions.component';
import { EditQuestionComponent } from './main/edit-question/edit-question.component';
import { AddQuestionComponent } from './main/add-question/add-question.component';
import { QuizStartedComponent } from './main/quiz-started/quiz-started.component';

import { initializeApp } from "firebase/app";
import { FormsModule } from '@angular/forms';

const firebaseConfig = {
  apiKey: "AIzaSyDlEUN1ME9po909G8vqG3FehbS18SNPZ1s",
  authDomain: "eva-lernapp.firebaseapp.com",
  projectId: "eva-lernapp",
  storageBucket: "eva-lernapp.appspot.com",
  messagingSenderId: "267360033338",
  appId: "1:267360033338:web:597fdf57bbebf33622b303",
  measurementId: "G-S63JGHG4SN"
};

initializeApp(firebaseConfig);


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MainComponent,
    SubjectsComponent,
    QuizComponent,
    QuestionsComponent,
    EditQuestionComponent,
    AddQuestionComponent,
    QuizStartedComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
