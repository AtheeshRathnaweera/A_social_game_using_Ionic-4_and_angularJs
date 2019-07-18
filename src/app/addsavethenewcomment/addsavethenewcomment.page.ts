import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import * as firebase from 'firebase/app';

@Component({
  selector: 'app-addsavethenewcomment',
  templateUrl: './addsavethenewcomment.page.html',
  styleUrls: ['./addsavethenewcomment.page.scss'],
})
export class AddsavethenewcommentPage implements OnInit {

  comment: string

  useremail: string
  username: string
  userProfilePicUrl: string

  displayDate: string

  months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

  constructor(public toastController: ToastController,private fauth:AngularFireAuth,private db:AngularFirestore) {

    var todaydate = new Date();
    
    this.displayDate = todaydate.getFullYear()+" "+this.months[todaydate.getMonth()] +" "+todaydate.getDate()

   }

  ngOnInit() {
    this.getCurrentUserData()
  }

  getCurrentUserData(){
    this.fauth.authState.subscribe((user)=>{
      if(user){
        this.useremail = user.email
      }else{
        //user email not found
      }
    })
  }

  validateTheComment(){

    if(this.comment.trim().length == 0){
      this.showToastMessage("Empty comments can not be saved.")
    }else{
      this.saveTheComment()

    }
   
  }

  saveTheComment(){


    var todaydate = new Date();
    var addedtime = (todaydate.getHours()<10?'0':'')+todaydate.getHours()+" : "+(todaydate.getMinutes()<10?'0':'')+todaydate.getMinutes()+" : "+(todaydate.getSeconds()<10?'0':'')+todaydate.getSeconds()
    var todayUpdatedDate = todaydate.getFullYear()+"-"+(todaydate.getMonth() + 1) +"-"+todaydate.getDate()

    var name : string
    var picUrl : string

    this.db.collection("users").doc(this.useremail).get().forEach((data)=>{
      name = data.get("name")
      picUrl = data.get("profilePicUrl")
   }).then(()=>{

    this.db.collection("posts").doc(todayUpdatedDate).collection("comments").add({
      commenttext: this.comment,
      likes: 0,
      useremail: this.useremail,
      username: name,
      url: picUrl,
      addedtime: addedtime
    }).then(()=>{
      this.updateTheTotalCommentsValue(1,todayUpdatedDate);
      this.comment = ""
      this.updateTheUsersTotalComments(1)
   
     } 
    );

   })
  }

  updateTheUsersTotalComments(val){
    if(val==1){
      this.db.collection("users").doc(this.useremail).update({
        totalComments: firebase.firestore.FieldValue.increment(1)
      }).then(()=>{
        this.showToastMessage("Comment saved successfully!")
      });
    }else{
      this.db.collection("users").doc(this.useremail).update({
        totalComments: firebase.firestore.FieldValue.increment(-1)
      });
    }

  }

  updateTheTotalCommentsValue(val,dateRec){
    //val == 1 ------> add a new comment so increment the value
    if(val==1){
      this.db.collection("posts").doc(dateRec).collection("postdata").doc("data").update({
        totalcomments: firebase.firestore.FieldValue.increment(1)
      });
    }else{
      this.db.collection("posts").doc(dateRec).collection("postdata").doc("data").update({
        totalcomments: firebase.firestore.FieldValue.increment(-1)
      });
    }
   
  }

  async showToastMessage(message){
    const toast = await this.toastController.create({
      message: message,
      showCloseButton: true,
      closeButtonText: "OK"
    });
    toast.present();
  }

}
