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
}

export class singleComment{
  id: string;
  addedtime: string;
  commenttext: string;
  likes: number;
  useremail: string;
}

@Component({
  selector: 'app-addacomment',
  templateUrl: './addacomment.page.html',
  styleUrls: ['./addacomment.page.scss'],
})

export class AddacommentPage {

  public userComment:userComment = new userComment();//Create a new usercomment

  todayDate: string //store todaydate

  comments: singleComment[]

  commentsString: Array<string>

  constructor(public toastController: ToastController,private router: Router,private fauth:AngularFireAuth,private db:AngularFirestore) {
    this.getCurrentUserData()

    var todaydate = new Date();
    this.todayDate = todaydate.getFullYear()+"-"+(todaydate.getMonth() + 1) +"-"+todaydate.getDate()

    this.getAllTheComments()
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
    var currentTime = todaydate.getHours()+" : "+todaydate.getMinutes()+" : "+todaydate.getSeconds()

    this.db.collection("posts").doc(this.todayDate).collection("comments").add({
      addedtime: currentTime,
      commenttext: this.userComment.comment,
      likes: 0,
      useremail: this.userComment.email
    }).then(()=>{
      this.updateTheTotalCommentsValue(1,this.todayDate);
     } 
    );
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
      duration: 4000
    });
    toast.present();
  }

  getAllTheComments(){


    this.db.collection("posts").doc(this.todayDate).collection("comments").get().forEach((docData)=>{

      docData.forEach((d)=>{
        
        //var comment: singleComment = new singleComment()
        //this.comments = this.comments.concat(data.data())

        
        this.commentsString.push(d.get("useremail"))
      
      })
      
    })

    this.showToastMessage(this.commentsString)




   

    

    
  }

}
