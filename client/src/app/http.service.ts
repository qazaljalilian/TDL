import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class HttpService {

  constructor(private http: Http) { }

  getData() {
    return this.http.get('http://localhost:3000/todos');
  }
  postData(text){
    return this.http.post("http://localhost:3000/todos",{text:text});
  }
  deleteData(id){
    return this.http.delete("http://localhost:3000/todos/"+ id);
  }
  editData(id,text){
    return this.http.patch("http://localhost:3000/todos/"+ id , {text:text});

  }
}
