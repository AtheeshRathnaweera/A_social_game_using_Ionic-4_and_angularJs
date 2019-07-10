import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';

export class userComment {
  name: string;
  comment: string;
  email: string;
  url: string;

}

export class singleComment{
  id: string;
  commenttext: string;
  likes: number;
  useremail: string;
  username: string;
}

@Component({
  selector: 'app-addacomment',
  templateUrl: './addacomment.page.html',
  styleUrls: ['./addacomment.page.scss'],
})

export class AddacommentPage implements OnInit {
  

  public userComment:userComment = new userComment();//Create a new usercomment

  todayDate: string //store todaydate

  //comments: singleComment[]

  commentsString: Array<string>

  comments//store the data



  constructor(public toastController: ToastController,private router: Router,private fauth:AngularFireAuth,private db:AngularFirestore) {
    this.getCurrentUserData()

    var todaydate = new Date();
    this.todayDate = todaydate.getFullYear()+"-"+(todaydate.getMonth() + 1) +"-"+todaydate.getDate()

   // this.getAllTheComments()
  }

  ngOnInit() {
    this.showToastMessage(`${this.comments.length}`+"  "+`${this.comments[0]}`)
  }

  validateTheComment(){

    if(this.userComment.comment.trim().length == 0){
      this.showToastMessage("Invalid comment   "+this.userComment.comment)
    }else{
     // this.showToastMessage("Valid comment   "+this.userComment.comment)
      this.addTheComment()
      //store the comment in firestore

    }
   
  }

  getCurrentUserData(){
    this.fauth.authState.subscribe((user)=>{
      if(user){
        this.userComment.email = user.email
      }else{
        //user email not found
      }
    })
  }

  addTheComment(){
    var todaydate = new Date();
   // var todayDate = todaydate.getFullYear()+"-"+(todaydate.getMonth() + 1) +"-"+todaydate.getDate()


    this.db.collection("users").doc(this.userComment.email).get().forEach((data)=>{
      this.userComment.name = data.get("name")
      this.userComment.url = data.get("profilePicUrl")
   }).then(()=>{

    this.db.collection("posts").doc(this.todayDate).collection("comments").add({
      commenttext: this.userComment.comment,
      likes: 0,
      useremail: this.userComment.email,
      username: this.userComment.name,
      url: this.userComment.url
    }).then(()=>{
      this.updateTheTotalCommentsValue(1,this.todayDate);
      this.userComment.comment = ""
     } 
    );

   })
  
    

   

 
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
      message: 'Data : '+message,
      duration: 3000
    });
    toast.present();
  }

  getTheNumberOfLikesOfThePost(recId){
    return recId
  }

  voting(type,recData){
    if(type == 1){
        //upvote

    }else{
      //downvote

    }

    this.showToastMessage(recData)
    

  }



}

