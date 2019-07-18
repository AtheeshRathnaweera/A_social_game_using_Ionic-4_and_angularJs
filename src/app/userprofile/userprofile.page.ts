import { Component, OnInit } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import * as firebase from 'firebase/app';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { PopoverController } from '@ionic/angular';

import { Platform} from '@ionic/angular';

//import { PopoverComponent } from '../../component/popover/popover.component';



interface profileData {
  name: string;
  email: string;
  password: string;
  profilePicUrl: string;
  since: string;
  totalComments: number;
}

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.page.html',
  styleUrls: ['./userprofile.page.scss'],
})

export class UserprofilePage implements OnInit{

  currentUserEmail: string//use for store user email
  private dataDoc: AngularFirestoreDocument<profileData>;
  userDataSet : Observable<profileData>

  badgeNumber :number

  badgeColors = ["#00B2EE","#00868B","#00C78C","#008B00","#FF4500"]
  badgeTitles = ["Beginner","Learner","Enthusiastic","Writer","Creator"]

  currentPopOver = null

  constructor(private platform: Platform,private fauth:AngularFireAuth,private db:AngularFirestore,private toastController:ToastController,private popoverController: PopoverController) { 
    
    this.getCurrentUserEmail()
  }

  ngOnInit(){
   
  }

  logout() {
    this.fauth.auth.signOut();
  }

  /*async presentPopover(ev: any) {
    this.showToastMessage("show pop over method.")
    const popover = await this.popoverController.create({
      component: ChangeProfilePicComponent,
      event: ev,
      translucent: true
    });
    this.currentPopOver = popover;
    return await popover.present();
  }*/

  async dismissPopover() {
    if (this.currentPopOver) {
      this.currentPopOver.dismiss().then(() => { this.currentPopOver = null; });
    }
  }

  getCurrentUserEmail(){
  
    this.fauth.authState.subscribe(user=>{//check whether user is log in or not
      if(user){
        //get user email
        
        this.dataDoc = this.db.collection("users").doc<profileData>(user.email);
        this.userDataSet = this.dataDoc.valueChanges();

        this.userDataSet.forEach((data)=>{
         // this.commentsAmount = data.totalComments
          this.setTheBadge(data.totalComments)
          
        })

      }else{
        //user email not found
        this.showToastMessage("You have not loggedin.Please log in now")
        this.fauth.auth.signOut();//log out and log in again for get the email
      }
    })
  
  }

  async showToastMessage(message){
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  setTheBadge(commentsAmount){
    
    if(commentsAmount < 10){
      this.badgeNumber = 0
    }else if(commentsAmount < 30){
      this.badgeNumber = 1
    }else if(commentsAmount < 50){
      this.badgeNumber = 2
    }else if(commentsAmount < 70){
      this.badgeNumber = 3
    }else{
      this.badgeNumber = 4
    }

   // this.showToastMessage(commentsAmount+" badge num : "+this.badgeNumber)


  }

 



}
