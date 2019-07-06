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
        this.todayDate = todaydate.getFullYear()+"-"+(todaydate.getMonth() + 1) +"-"+todaydate.getDay()
      
        this.postDataDoc = this.db.collection("posts").doc(this.todayDate).collection("postdata").doc<postData>("data");
        this.receivedPostData = this.postDataDoc.valueChanges();

        this.likedPostsDoc = this.db.collection("users").doc(user.email).collection("likedposts").doc<likedList>("liked");
        this.receivedLikedList = this.likedPostsDoc.valueChanges();
     
        this.receivedLikedList.forEach((data)=>{//Create an array using received string
          this.showToastMessage(" inside the foreach " +data.postlist)
          this.listArray = data.postlist.split(",")
          
         // this.showToastMessage(" "+this.todayDate+"  "+this.listArray  )

          if(this.listArray.includes(this.todayDate)){
            this.showToastMessage("exists in the liked list "+this.todayDate)
            this.likedOrNot = true
            this.likeBtnName = "heart"
    
          }else{
            this.showToastMessage("Not exists in the liked list " +this.todayDate)
            this.likedOrNot = false
            this.likeBtnName = "heart-empty"
          }
        });

     
 

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

 /* async getLikedPostList(dateOfThePost){//getting the liked post list of the user
    this.likedPostsDoc = this.db.collection("users").doc(this.userEmail).collection("likedposts").doc<likedList>("liked");
    this.receivedLikedList = this.likedPostsDoc.valueChanges();

    var listArray = []

    this.receivedLikedList.forEach((data)=>{//Create an array using received string
      this.likedListArray = data.postlist.split(",")
    })

    if(this.likedListArray.includes(dateOfThePost)){
      this.showToastMessage("exists in the liked list")
      this.likedOrNot = true
      this.likeBtnName = "heart"

    }else{
      this.showToastMessage("Not exists in the liked list")
      this.likedOrNot = false
      this.likeBtnName = "heart-empty"
    }

  }*/

  async likeThePost(){

    if(this.likedOrNot){
     
      this.likeBtnName = "heart-empty"
      this.likedOrNot = false
      var index = this.listArray.indexOf(this.todayDate)
      this.listArray.splice(index,1)
      this.showToastMessage("Like button pressed  "+this.listArray)

    }else{
      
      this.likeBtnName = "heart"
      this.likedOrNot = true
      this.listArray.push(this.todayDate)
      this.showToastMessage("Like button pressed  "+this.listArray)
    }

    //update the database
    this.db.collection("users").doc(this.userEmail).collection("likedposts").doc("liked").update({//Used the email as the id
      postlist: this.listArray.toString()

    }).then(function() {
     this.showToastMessage('updated successfully')

    }).catch(function(error) {
      console.error("Error adding document: ", error);
      this.showToastMessage('Error occured when like the post!',error.message)
    });

  }

}
