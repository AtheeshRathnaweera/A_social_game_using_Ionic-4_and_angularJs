import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';

import * as firebase from 'firebase/app';

export class User {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  public user:User = new User();//Create a new user

  constructor(private router: Router,private afauth:AngularFireAuth) { }

  login(){
    this.router.navigate(['register'])

  }

  signIn(){
    this.router.navigate(['register'])
  }



}
