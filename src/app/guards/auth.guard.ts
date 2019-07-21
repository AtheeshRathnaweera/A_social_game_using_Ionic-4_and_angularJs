import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { UserLoggedInService } from '../api/user-logged-in.service';
import { AngularFireAuth } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{
  //this is used to display the login screen by validating whether the user logged in or not
  //loggedin ----> login screen cannot be seen
  //loggedout ---> login screen can be seen
  //important for avoid to go to the login screen from the home screen

  result: boolean

  constructor(private userService:UserLoggedInService,private faAuth: AngularFireAuth){

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
 
    // Get the current authentication state from a Service!
    this.faAuth.authState.subscribe(state=>{//check whether user is log in or not and then return the result
      if(state){
        this.result = false
      }else{
        this.result =  true
      }
    }).closed

    return this.result
  }
  
}
