import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
 
})
export class HomeComponent implements OnInit {
  text: string;
  todos: [any];
  constructor(private httpService: HttpService) { }

  ngOnInit() {
    this.httpService.getData()
    .subscribe(
      (data) => {
        this.todos = data.json().todos
      });
  }

  delete(id,i){
    this.httpService.deleteData(id)
    .subscribe(
      (data) => {
        this.todos.splice(i,1);
      });
  }



patch(id,i){
  this.httpService.editData(id,this.text)
    .subscribe(
      (data) => {
        console.log(data.json());
        this.todos[i]=data.json().todo;
      });
}


  addToList() {
    this.httpService.postData(this.text)
      .subscribe(
        (data) => {
          console.log(data.json())
          this.todos.push( data.json())
        });
  }
  fetchList() {
    this.httpService.getData()
      .subscribe(
        (data) => {
          this.todos = data.json().todos
        });
  }
}

