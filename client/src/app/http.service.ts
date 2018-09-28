import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class HttpService {

  constructor(private http: Http) { }

  getData() {
    return this.http.get('http://localhost:3000/todos',{withCredentials: true});
  }
  postData(text){
    return this.http.post("http://localhost:3000/todos",{text:text},{withCredentials: true});
  }
  deleteData(id){
    return this.http.delete("http://localhost:3000/todos/"+ id,{withCredentials: true});
  }
  editData(id,text){
    return this.http.patch("http://localhost:3000/todos/"+ id , {text:text},{withCredentials: true});
  }
  register(username,password){
    return this.http.post("http://localhost:3000/users" , {email:username,password:password},{withCredentials: true});
  }
  login(username,password){
    return this.http.post("http://localhost:3000/users/login" ,{email:username,password:password},{withCredentials: true});
  }
}
