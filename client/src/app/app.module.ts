import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from "@angular/router";
import { AppComponent } from './app.component';
import { HttpService } from './http.service';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth-guard.service';
import { AuthService } from './auth.service';


const appRoutes: Routes = [ 
  {path:'', canActivate:[AuthGuard],component:HomeComponent},
  { path: 'login', component: LoginComponent },
];
@NgModule({
  declarations: [
    LoginComponent,
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [HttpService, AuthService,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
