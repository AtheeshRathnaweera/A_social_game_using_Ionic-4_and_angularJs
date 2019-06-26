import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

import * as firebase from 'firebase/app';

import { ToastController } from '@ionic/angular';
import { timer } from 'rxjs';

export class User {
  name: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})


export class RegisterPage {

  public user:User = new User();//Create a new user

  constructor(private afauth:AngularFireAuth,private router: Router,public toastController: ToastController) { }

  async gettindData(){
    var r = await this.afauth.auth.createUserWithEmailAndPassword(
      this.user.email,
      this.user.password
    );
    return r;
  }

  async createTheAccount(){
  
    try {
      console.log("User name: "+this.user.name)
      console.log("User email: "+this.user.email)
      console.log("user password: "+this.user.password)

      var r = await this.afauth.auth.createUserWithEmailAndPassword(
        this.user.email,
        this.user.password
      );

      // *://www.googleapis.com/*
      // *://*.googleapis.com:*/*


      console.log("r: "+r);
      
      if (r) {

        const toast = await this.toastController.create({
          message: 'Account created successfully!',
          duration: 2000
        });
        toast.present();

        console.log("Successfully registered!"+r);
       // this.router.navigateByUrl('/login')
      }

    } catch (err) {
      var errorCode = err.code;
      var errorMessage = err.message;
      console.error("This is the Error occured : "+errorCode+"  "+errorMessage);

      if(errorCode == "auth/invalid-email"){
        const toast = await this.toastController.create({
          message: 'Invalid email address. Please enter a valid email!',
          duration: 2000
        });
        toast.present();
      }else {
        const toast = await this.toastController.create({
          message: 'Error occured! Please try again later!',
          duration: 2000
        });
        toast.present();
      }

      
    }

    

    //do the google log in here
  }


}
