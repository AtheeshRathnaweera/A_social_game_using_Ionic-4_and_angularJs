import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { Platform} from '@ionic/angular';


import { AddacommentPage } from '../addacomment/addacomment.page';

interface postData{
  date: string;
  likes: number;
  totalcomments: number;
  url: string;
  likedlist: string;

}

interface likedList{
  postlist: string;
}

export class singleComment{
  id: string;
  commenttext: string;
  likes: number;
  useremail: string;
  username: string;
  url: string;
}



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  userEmail:string
  likeBtnName: string
 // likedList: Array<string>
  todayDate: string
  likedOrNot: boolean

  private postDataDoc: AngularFirestoreDocument<postData>;
  receivedPostData : Observable<postData>

  private likedPostsDoc: AngularFirestoreDocument<likedList>;
 // receivedLikedList: Observable<likedList>

  topComment: singleComment = new singleComment()

  comments = [] //store all the comments

  topCommentImage = "hidden"

  commentButtonLabel : string 
  modalReady : boolean

  likeBtnColor: string


  constructor( private platform: Platform,public toastController: ToastController,private router: Router,private fauth:AngularFireAuth,public modalController: ModalController,private db:AngularFirestore) {
  
    this.topComment.commenttext = "No comments yet"
    this.commentButtonLabel = "Preparing comments ..."
    this.modalReady = false

   
    this.getCurrentUserEmail()

   

   // this.getAllTheComments()
   
  }



  async presentModal() {

    if(this.modalReady){
      const modal = await this.modalController.create({
        component: AddacommentPage,
        componentProps: {//passing the values from parent to modal class
          comments: this.comments
        }
      });
  
      return await modal.present();
    }else{
      this.showToastMessage("Comment section is still preparing...")

    }
    
    
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
        var todaydate = new Date();
        this.todayDate = todaydate.getFullYear()+"-"+(todaydate.getMonth() + 1) +"-"+todaydate.getDate()
      
        this.postDataDoc = this.db.collection("posts").doc(this.todayDate).collection("postdata").doc<postData>("data");

        this.receivedPostData = this.postDataDoc.valueChanges();

        this.likedPostsDoc = this.db.collection("users").doc(user.email).collection("likedposts").doc("liked");
      
        this.likedPostsDoc.valueChanges().forEach((datas)=>{
          var recList = datas.postlist

          

          if(recList.includes(this.todayDate)){
            //this.showToastMessage("list:  "+recList+" likes: "+this.numberOfLikes+" index: "+recList.indexOf(this.todayDate))
            this.likedOrNot = true
            this.likeBtnName = "heart"
            this.likeBtnColor = "#bc1e1b"
           

          }else{
           // this.showToastMessage("list:  " +recList+"  likes: "+this.numberOfLikes+" index: "+recList.indexOf(this.todayDate))
            this.likedOrNot = false
            this.likeBtnName = "heart-empty"
            this.likeBtnColor = "#212121"
          
          }
          
        })

        this.getAllTheComments().then(()=>{
            this.commentButtonLabel = "Add a comment"
            this.modalReady = true
        })

      }else{
      //user email not found
        this.fauth.auth.signOut();//log out and log in again for get the email
      }
    })

  }

  async showToastMessage(message){
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  async likeThePost(){

    if(this.likedOrNot){
      //already have liked

      this.likedOrNot = false
      this.updateLikesAmount(0)
      this.updateTheLikedListOfTheUser(0)

    }else{

      this.likedOrNot = true
      this.updateLikesAmount(1)
      this.updateTheLikedListOfTheUser(1)
  
    }
  

  }

  updateLikesAmount(type){

    if(type == 1){

      this.db.collection("posts").doc(this.todayDate).collection("postdata").doc("data").update({//Used the email as the id
        likes: firebase.firestore.FieldValue.increment(1)
  
      }).then(function() {
       this.showToastMessage('updated successfully')
  
      }).catch(function(error) {
        console.error("Error adding document: ", error);
        this.showToastMessage('Error occured when liking the post!',error.message)
      });

    }else{
      
      this.db.collection("posts").doc(this.todayDate).collection("postdata").doc("data").update({//Used the email as the id
        likes: firebase.firestore.FieldValue.increment(-1)

      }).then(function() {
        this.showToastMessage('updated successfully')

      }).catch(function(error) {
        console.error("Error adding document: ", error);
        this.showToastMessage('Error occured when liking the post!',error.message)
      });
    }




  }

  updateTheLikedListOfTheUser(val){

   // val == 1 ---------> for add a value
   // val == 0 ---------> for remove a value

   if(val == 1){
     //add today date to the list
    this.db.collection("users").doc(this.userEmail).collection("likedposts").doc("liked").update({
      postlist: firebase.firestore.FieldValue.arrayUnion(this.todayDate)
    });

   }else{
    // remove today date form the list
    this.db.collection("users").doc(this.userEmail).collection("likedposts").doc("liked").update({
      postlist: firebase.firestore.FieldValue.arrayRemove(this.todayDate)
    });

   }

  
  }

  async getAllTheComments(){

    await this.db.collection("posts").doc(this.todayDate).collection("comments").get().forEach((docData)=>{

      docData.forEach((d)=>{
        
        const comment: singleComment = new singleComment()

        comment.id = d.id
        comment.commenttext = d.get("commenttext")
        comment.likes = d.get("likes")
        comment.useremail = d.get("useremail")
        comment.username = d.get("username")
        comment.url = d.get("url")

        this.comments.push(comment)
      
      })

      this.showToastMessage("total comments : "+ this.comments.length )

    })

    
   
  }

  

  getTheHighestRatedComment(){

  }

}
