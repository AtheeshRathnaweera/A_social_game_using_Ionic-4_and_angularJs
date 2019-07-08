import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';


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

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  userEmail:string
  likeBtnName: string
  likedList: Array<string>
  todayDate: string
  likedOrNot: boolean

  listArray: string[]

  receivedList //store the received array from  the firestore
  numberOfLikes: number //store the amount of likes

  private postDataDoc: AngularFirestoreDocument<postData>;
  receivedPostData : Observable<postData>

  private likedPostsDoc: AngularFirestoreDocument<likedList>;
  receivedLikedList: Observable<likedList>


  constructor(public toastController: ToastController,private router: Router,private fauth:AngularFireAuth,public modalController: ModalController,private db:AngularFirestore) {
  
    this.getCurrentUserEmail()
   
    //<ion-icon name="heart"></ion-icon>
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
        var todaydate = new Date();
        this.todayDate = todaydate.getFullYear()+"-"+(todaydate.getMonth() + 1) +"-"+todaydate.getDate()
      
        this.postDataDoc = this.db.collection("posts").doc(this.todayDate).collection("postdata").doc<postData>("data");

        this.receivedPostData = this.postDataDoc.valueChanges();

        this.receivedPostData.forEach((data)=>{
            this.numberOfLikes = data.likes
        })

        this.likedPostsDoc = this.db.collection("users").doc(user.email).collection("likedposts").doc("liked");
      
        this.likedPostsDoc.valueChanges().forEach((datas)=>{
          var recList = datas.postlist

          if(recList.includes(this.todayDate)){
            //this.showToastMessage("list:  "+recList+" likes: "+this.numberOfLikes+" index: "+recList.indexOf(this.todayDate))
            this.likedOrNot = true
            this.likeBtnName = "heart"

          }else{
           // this.showToastMessage("list:  " +recList+"  likes: "+this.numberOfLikes+" index: "+recList.indexOf(this.todayDate))
            this.likedOrNot = false
            this.likeBtnName = "heart-empty"
          }
          
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
      duration: 4000
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

}
