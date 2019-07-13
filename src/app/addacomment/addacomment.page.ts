import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
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

  comments//store the data

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
   var addedtime = todaydate.getHours()+" : "+todaydate.getMinutes()+" : "+todaydate.getSeconds()


    this.db.collection("users").doc(this.userComment.email).get().forEach((data)=>{
      this.userComment.name = data.get("name")
      this.userComment.url = data.get("profilePicUrl")
   }).then(()=>{

    var vote = {
        email: this.userComment.email,
        vote: 0
    }

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

    
    
    //this.commentsLikeHolder.
  
  }

  viewTheStory(commentId){

    this.showToastMessage("view the story"+commentId)

    this.modalController.dismiss({//dismiss the modal for go to the new 
      'dismissed': true
    }).then(()=>{
      this.router.navigate(['viewthestory'])
    });
    //

  }

  voting(type,recPostId){

    this.checkExist(recPostId).then(()=>{
      if(this.userExist){
      
        if((type == 1 && this.voteCode == -1) || (type == -1 && this.voteCode == 1)){
          //delete the doc
          this.updateTheLikesAmountOfTheComment(recPostId,type).then(()=>{
            this.deleteTheDoc(recPostId)
          })
         
        }else{
          //do nothing
        }

      }else{
        this.updateTheLikesAmountOfTheComment(recPostId,type).then(()=>{
          this.createTheVotedDoc(type,recPostId)
        })
       
      }
     
    })

  }

  async updateTheLikesAmountOfTheComment(postId,voteVal){
    await this.db.collection("posts").doc(this.todayDate).collection("comments").doc(postId).update({
      likes : firebase.firestore.FieldValue.increment(voteVal)
    })

  }


  createTheVotedDoc(voteType,postId){
    this.db.collection("posts").doc(this.todayDate).collection("comments").doc(postId)
                .collection("votedlist").doc(this.userComment.email).set({
                  vote: voteType
                })
   }

  

  deleteTheDoc(postId){
    this.db.collection("posts").doc(this.todayDate).collection("comments").doc(postId)
                .collection("votedlist").doc(this.userComment.email).delete()
  }



  async checkExist(postId){
    await this.db.collection("posts").doc(this.todayDate).collection("comments").doc(postId)
                .collection("votedlist").doc(this.userComment.email).get().forEach((data)=>{
                  if(data.exists){
                    this.userExist = true
                    this.voteCode = data.get("vote")
                  }else{
                    this.userExist = false
                  }
                })

  }



}




