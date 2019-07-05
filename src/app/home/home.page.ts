import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable } from 'rxjs';

import { AddacommentPage } from '../addacomment/addacomment.page';

interface postData{
  date: string;
  likes: number;
  totalcomments: number;
  url: string;
  likedlist: string;

}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  userEmail:string
  likeBtnName: string
  likedList: Array<string>

  private postDataDoc: AngularFirestoreDocument<postData>;
  receivedPostData : Observable<postData>


  constructor(public toastController: ToastController,private router: Router,private fauth:AngularFireAuth,public modalController: ModalController,private db:AngularFirestore) {
      this.getCurrentUserEmail()
      this.likeBtnName = "heart-empty"
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
  
  this.fauth.authState.subscribe(user=>{//check whether user is log in or not and get todays post data
    if(user){
      //get user email
      this.userEmail= user.email

      //get today post data as well
      var todayDate = new Date().toISOString().slice(0,10);

      this.postDataDoc = this.db.collection("posts").doc(todayDate).collection("postdata").doc<postData>("data");
      this.receivedPostData = this.postDataDoc.valueChanges();

      this.receivedPostData.forEach((data)=>{
        var receivedlist = data.likedlist
        
      })

      

    }else{
      //user email not found
      this.fauth.auth.signOut();//log out and log in again for get the email
    }
  })

  }

  async showToastMessage(message){
    const toast = await this.toastController.create({
      message: 'Data : '+message,
      duration: 2000
    });
    toast.present();


  }



}
