import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router,NavigationExtras } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { ModalController } from '@ionic/angular';
import { enableDebugTools } from '@angular/platform-browser';

export class userComment {
  name: string;
  comment: string;
  email: string;
  url: string;

}

interface comment {
  commenttext: string;
  likes: number;
  useremail: string;
  username: string;
  url: string;
  votelist: string[];
  votecode: number[];
}

export class singleComment{
  commenttext: string;
  likes: number;
  useremail: string;
  username: string;
  url: string;
  votelist: string[];
  votecode: number[];
}

@Component({
  selector: 'app-addacomment',
  templateUrl: './addacomment.page.html',
  styleUrls: ['./addacomment.page.scss'],
})

export class AddacommentPage{
  

  public userComment:userComment = new userComment();//Create a new usercomment

  private commentDoc: AngularFirestoreDocument<comment>;
  commentDataObservable : Observable<comment>

  todayDate: string //store todaydate

  //comments: singleComment[]

  commentsString: Array<string>

  comments//store the data that will receive from the home page

  userExist : boolean
  voteCode: number

  upVoteBtnColor: string
  downVoteBtnColor: string

  constructor(public modalController: ModalController,public toastController: ToastController,private router: Router,private fauth:AngularFireAuth,private db:AngularFirestore) {
    this.upVoteBtnColor = "#696969"
    this.downVoteBtnColor = "#696969"
    this.getCurrentUserData()

    var todaydate = new Date();
    this.todayDate = todaydate.getFullYear()+"-"+(todaydate.getMonth() + 1) +"-"+todaydate.getDate()


   // this.getAllTheComments()
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
    var addedtime = (todaydate.getHours()<10?'0':'')+todaydate.getHours()+" : "+(todaydate.getMinutes()<10?'0':'')+todaydate.getMinutes()+" : "+(todaydate.getSeconds()<10?'0':'')+todaydate.getSeconds()

    this.db.collection("users").doc(this.userComment.email).get().forEach((data)=>{
      this.userComment.name = data.get("name")
      this.userComment.url = data.get("profilePicUrl")
   }).then(()=>{

    this.db.collection("posts").doc(this.todayDate).collection("comments").add({
      commenttext: this.userComment.comment,
      likes: 0,
      useremail: this.userComment.email,
      username: this.userComment.name,
      url: this.userComment.url,
      addedtime: addedtime
    }).then(()=>{
      this.updateTheTotalCommentsValue(1,this.todayDate);
      this.userComment.comment = ""
      this.updateTheUsersTotalComments(1)
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

  updateTheUsersTotalComments(val){
    if(val==1){
      this.db.collection("users").doc(this.userComment.email).update({
        totalComments: firebase.firestore.FieldValue.increment(1)
      });
    }else{
      this.db.collection("users").doc(this.userComment.email).update({
        totalComments: firebase.firestore.FieldValue.increment(-1)
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

  addANewCommentPage(){

    this.modalController.dismiss({//dismiss the modal for go to the new 
      'dismissed': true
    }).then(()=>{
      this.router.navigate(['addsavethenewcomment'])
    });

  }



  viewTheStory(commentId,email){

    let navigationExtras: NavigationExtras = {
      queryParams: {
          commentId: commentId,
          useremail: this.userComment.email,
          commentatorEmail: email
      }
    }

    this.modalController.dismiss({//dismiss the modal for go to the new page
      'dismissed': true
    }).then(()=>{
      this.router.navigate(['viewthestory'],navigationExtras)
    });
    

  }





}




