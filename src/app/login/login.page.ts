import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';

import * as firebase from 'firebase/app';
import { ToastController } from '@ionic/angular';

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

  constructor(private router: Router,private afAuth:AngularFireAuth,public toastController: ToastController) { }

  signIn(){
    this.router.navigate(['register'])
  }

  validateTheEmail =async()=>{
    console.log("validate email started.")
    if(this.user.email == null || this.user.email.length < 7){
      const toast = await this.toastController.create({
        message: 'Invalid email address. Please insert a valid email.!',
        duration: 2000
      });
      toast.present();
      console.log("returned false")
      return false;
    }else{
      console.log("returned true")
      return true;
    }
  }

  async login() {

    console.log(this.user.email+"  "+this.user.password)

    if(this.user.email == null || this.user.email.length < 7){
      //email is not valid show the toast
      const toast = await this.toastController.create({
        message: 'Invalid email address. Please insert a valid email.!',
        duration: 2000
      });
      toast.present();
      console.log("returned false")
      
    }else{
      //email is okay
      try {
        var r = await this.afAuth.auth.signInWithEmailAndPassword(
          this.user.email,
          this.user.password
        );
        if (r) {
          console.log("Successfully logged in!");
          this.router.navigate(["home"])
        }
  
      } catch (err) {
        var errorCode = err.code;
        var errorMessage = err.message;
        console.error("This is the Error occured : "+errorCode+"  "+errorMessage);
  
        const toast = await this.toastController.create({
          message: 'Error occured! Check your email and password again!',
          duration: 2000
        });
        toast.present();
      
      }
    }
    
  }


}
