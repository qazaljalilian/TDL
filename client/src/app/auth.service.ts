import { HttpService } from "./http.service";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthService {
    loggedIn = false;

    constructor(private httpService: HttpService) { }

    isAuthenticate() {
        return this.httpService.isLogin()
    }


    login() {
        this.loggedIn = true;
    }
    logout() {
        this.loggedIn = false;
    }



}


