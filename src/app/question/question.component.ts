import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { QuestionService } from '../service/question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
 name:string="";
 questionlist:any = [];
 public current:number = 0;
 points:number = 0;
 counter=60;
 correctAnswer:number=0;
 inCorrectAnswer:number=0;
 interval$:any;
 progress:string="0";
 isQuizCompleted : boolean = false;
  constructor(public questionService : QuestionService) { }

  ngOnInit(): void {
   this.startCounter();
    this.name = localStorage.getItem('name')!;
    this.getAllQuestion();
  }
 
  getAllQuestion(){
    this.questionService.getQuestionJson().subscribe(res=>{
this.questionlist = res;
      console.log(this.questionlist)


    })
  }
nextQuestion(){
this.current++;
}

previousQuestion(){
this.current--;
}

answer(current:number,option:any){
  if(current === this.questionlist.questions.length){
this.isQuizCompleted = true;
this.stopCounter();
  }else{
    this.isQuizCompleted = false;
  }
if(option.correct){
  setTimeout(() => {
    this.points = this.points + 10;
    this.correctAnswer++;
    this.current++;
    this.getprogressPercent();  
  }, 1000);
  
}else{

setTimeout(() => {
  this.current++;
this.inCorrectAnswer++;
this.resetCounter();
this.getprogressPercent();
}, 1000);
this.points-=10;
}
}

startCounter(){
this.interval$ = interval(1000).subscribe(val=>{
  this.counter--;
  if(this.counter===0){
    this.current++;
    this.points-=10;
    this.counter=60;
  }
  
})
setTimeout(() => {
  this.interval$.unsubscribe();
}, 600000);
}

stopCounter(){
this.interval$.unsubscribe();
this.counter=0;
}

resetCounter(){
  this.stopCounter();
  this.counter=60;
  this.startCounter();
}
resetQuiz(){
  this.resetCounter();
  this.getAllQuestion();
  this.points=0;
  this.counter=60;
  this.current=0;
  this.progress="0"

}

getprogressPercent(){
  this.progress = ((this.current/this.questionlist.questions.length)*100).toString();
  return this.progress;
}

}
