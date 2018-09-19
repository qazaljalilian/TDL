import { Component, OnInit } from '@angular/core';
import { HttpService } from './http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
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
  delete(id){
    this.httpService.deleteData(id)
    .subscribe(
      (data) => {
        console.log(data.json());
      });
  }



patch(id){
  this.httpService.editData(id,this.text)
    .subscribe(
      (data) => {
        console.log(data.json());
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
