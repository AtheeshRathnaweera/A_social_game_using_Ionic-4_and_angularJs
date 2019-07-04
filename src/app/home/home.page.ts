import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

import * as firebase from '@angular/fire';
import { FirebaseAuth } from '@angular/fire';

import { AddacommentPage } from '../addacomment/addacomment.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  userEmail:string

  constructor(public toastController: ToastController,private router: Router,private fauth:AngularFireAuth,public modalController: ModalController) {
      this.getCurrentUserEmail()
  }

  async presentModal() {
    
    const modal = await this.modalController.create({
      component: AddacommentPage
    });

    return await modal.present();
  }

  async seeProfile(){
    //go to the user profile
    this.router.navigate(['userprofile'])
  }

 async getCurrentUserEmail(){
  
  this.fauth.authState.subscribe(user=>{//check whether user is log in or not
    if(user){
      //get user email
      this.userEmail= user.email
    }else{
      //user email not found
      this.fauth.auth.signOut();//log out and log in again for get the email
    }
  })

  }

}
