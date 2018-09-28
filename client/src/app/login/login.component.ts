import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
username:string;
password:string;
  constructor(private httpService: HttpService,private router:Router,private authService:AuthService) { }

  ngOnInit() {
  }
  login(){
    this.httpService.login(this.username,this.password)
    .subscribe(
      (data) => {
        this.authService.login()
          this.router.navigate(['/']);
      });
  }
  register(){
    this.httpService.register(this.username,this.password)
    .subscribe(
      (data) => {
        this.authService.login()

          this.router.navigate(['/']);
      
      });
  }

}
