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

        this.db.collection("users").add({
          name: this.user.name,
          email: this.user.email,
          password: this.user.password,
          profilePicUrl: "http://i.huffpost.com/gadgets/slideshows/257333/slide_257333_1650510_free.jpg",
          joinedDate: todayDate

        }).then(function(docRef) {
          console.log("Document written with ID: ", docRef.id);
          this.router.navigateByUrl('/login')

        }).catch(function(error) {
          console.error("Error adding document: ", error);
          const toast = this.toastController.create({
            message: 'Error occured when saving data!'+error.message,
            duration: 2000
          });
          toast.present();
        });

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
          message: 'Error occured! Please try again later!'+errorCode,
          duration: 2000
        });
        toast.present();
      }

      
    }

    //do the google log in here
  }


}
