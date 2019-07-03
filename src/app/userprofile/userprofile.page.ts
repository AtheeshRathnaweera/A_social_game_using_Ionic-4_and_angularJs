import { Component, OnInit } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import * as firebase from 'firebase/app';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';

interface profileData {
  name: string;
  email: string;
  password: string;
  profilePicUrl: string;
  since: string;
  totalComments: string;
}

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.page.html',
  styleUrls: ['./userprofile.page.scss'],
})

export class UserprofilePage {

  currentUserEmail: string//use for store user email
  private dataDoc: AngularFirestoreDocument<profileData>;
  userDataSet : Observable<profileData>

  constructor(private fauth:AngularFireAuth,private db:AngularFirestore,private toastController:ToastController) { 

    this.getCurrentUserEmail()
    
  }

  logout() {
    this.fauth.auth.signOut();
  }

  async getCurrentUserEmail(){
  
    this.fauth.authState.subscribe(user=>{//check whether user is log in or not
      if(user){
        //get user email
        this.dataDoc = this.db.collection("users").doc<profileData>(user.email);
        this.userDataSet = this.dataDoc.valueChanges();

      }else{
        //user email not found
        this.showToastMessage("You have not loggedin.Please log in now",null)
        this.fauth.auth.signOut();//log out and log in again for get the email
      }
    })
  
  }

  async showToastMessage(message, errorMsg){
    const toast = await this.toastController.create({
      message: message+" "+errorMsg,
      duration: 2000
    });
    toast.present();
  }



}
