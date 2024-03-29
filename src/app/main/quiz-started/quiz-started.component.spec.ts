import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizStartedComponent } from './quiz-started.component';

describe('QuizStartedComponent', () => {
  let component: QuizStartedComponent;
  let fixture: ComponentFixture<QuizStartedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuizStartedComponent]
    });
    fixture = TestBed.createComponent(QuizStartedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
