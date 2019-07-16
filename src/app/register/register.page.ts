import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

//import * as firebase from 'firebase/app';

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

  constructor(private afauth:AngularFireAuth,private router: Router,private db: AngularFirestore,public toastController: ToastController) { }

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

        var todayDate = new Date().toISOString().slice(0,10);

        this.db.collection("users").doc(this.user.email).set({//Used the email as the id
          name: this.user.name,
          email: this.user.email.toLowerCase(),//lowercase the email for avoid login failures ||| emails are not case sensitive
          password: this.user.password,
          profilePicUrl: "https://yt3.ggpht.com/-MVZBfegWiSw/AAAAAAAAAAI/AAAAAAAAAAA/i5EjUPXxSe4/s900-c-k-no-mo-rj-c0xffffff/photo.jpg",
          since: todayDate,
          totalComments: 0

        }).catch(function(error) {
          console.error("Error adding document: ", error);

          this.showToastMessage('Error occured when saving data!',error.message)
        });

        this.db.collection("users").doc(this.user.email).collection("likedposts").doc("liked").set({
          postlist: []
         }).then(function(){
          this.showToastMessage("likedposts list created")
          this.router.navigateByUrl('/login')
         });

      }

    } catch (err) {
      var errorCode = err.code;
      var errorMessage = err.message;
      console.error("This is the Error occured : "+errorCode+"  "+errorMessage);

      if(errorCode == "auth/invalid-email"){
        this.showToastMessage('Invalid email address. Please enter a valid email!',null)
      }else {
        this.showToastMessage('Error occured! Please try again later!',errorCode)
      }

      
    }

    //do the google log in here
  }

  async showToastMessage(message, errorMsg){
    const toast = await this.toastController.create({
      message: 'Error occured! Please try again later!'+errorMsg,
      duration: 2000
    });
    toast.present();


  }




}
