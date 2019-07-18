import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';

import { Observable, ObservableLike } from 'rxjs';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import * as firebase from 'firebase/app';

//import { Keyboard } from '@ionic-native/keyboard';

interface userComment{
      commenttext: string;
      likes: number;
      useremail: string;
      username: string;
      url: string;
     // addedtime: string;
}

interface voteCodeData{
  vote: number;
}

@Component({
  selector: 'app-viewthestory',
  templateUrl: './viewthestory.page.html',
  styleUrls: ['./viewthestory.page.scss']
})

export class ViewthestoryPage implements OnInit {

  private commentDataDoc: AngularFirestoreDocument<userComment>;
  commentData : Observable<userComment>

  voteCodeObs : Observable<voteCodeData>

  todayDate : string //store today date
  commentId: string //store received comment id

  userEmail: string 
  commentatorEmail: string
  userExist: boolean
  voteCode: number

  upVoteBtnColor: string
  downVoteBtnColor: string

  comment: string

  editAccess : boolean 

  constructor(private route: ActivatedRoute,private toastController: ToastController,private db:AngularFirestore) { 
    //this.keyBoardOpenOrNot()//Set keyboard listner
  
    
  }

  

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.commentId = params.commentId
      this.userEmail = params.useremail
      this.commentatorEmail = params.commentatorEmail
      
    });

   
 
    this.getCommentDataObservable()
    this.checkUserExistencyInVotedList()

  }

  saveChanges(){

    this.commentDataDoc.update({
      commenttext: this.comment
    }).then(()=>{
      this.showToastMessage("Updated successfully!")
    }).catch(()=>{
      this.showToastMessage("Error occured. Please try again later.")
    })

  }

  deleteTheComment(){
   // this.commentDataDoc.delete()

  }

 getCommentDataObservable(){

    if(this.userEmail == this.commentatorEmail){
      this.editAccess = true
    }else{
      this.editAccess = false
    }
    var todaydate = new Date();
    this.todayDate = todaydate.getFullYear()+"-"+(todaydate.getMonth() + 1) +"-"+todaydate.getDate()

    //this.showToastMessage("methdo started   "+this.commentId+"  "+this.todayDate)
    this.commentDataDoc = this.db.collection("posts").doc(this.todayDate).collection("comments").doc<userComment>(this.commentId)
    this.commentData= this.commentDataDoc.valueChanges();


  }

  async showToastMessage(message){
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  voting(voteType){

      if(this.userExist){

        if((voteType == 1 && this.voteCode == -1) || (voteType == -1 && this.voteCode == 1)){
          //remove the user from voted list
          this.userExist = false
          this.voteCode = 0
          this.updateTheLikesAmountOfTheComment(voteType).then(()=>{
            this.removeTheUserFromVotedList()
          })

          this.setTheVotingButtonColors()
         
        }else{
          //do nothing
        }

      }else{
          this.userExist = true
          this.voteCode = voteType
          this.updateTheLikesAmountOfTheComment(voteType).then(()=>{
            this.createTheVotedDoc(voteType)
          })

          this.setTheVotingButtonColors()

      }
 
  }

  createTheVotedDoc(voteType){
    this.db.collection("posts").doc(this.todayDate).collection("comments").doc(this.commentId)
                .collection("votedlist").doc(this.userEmail).set({
                  vote: voteType
                })
   }

  removeTheUserFromVotedList(){
    this.db.collection("posts").doc(this.todayDate).collection("comments").doc(this.commentId)
                .collection("votedlist").doc(this.userEmail).delete()
  }

  async updateTheLikesAmountOfTheComment(voteType){
    await this.db.collection("posts").doc(this.todayDate).collection("comments").doc(this.commentId).update({
      likes : firebase.firestore.FieldValue.increment(voteType)
    })

  }

  keyBoardOpenOrNot(){
   /* if(this.Keyboard.isVisible){
      this.showToastMessage("keyboard is visible")
    }else{
      this.showToastMessage("Keyboard is not visible")
    }*/
  }

  checkUserExistencyInVotedList(){
    this.db.collection("posts").doc(this.todayDate).collection("comments").doc(this.commentId).collection("votedlist").doc(this.userEmail).get().forEach((data)=>{
      if(data.exists){
        this.userExist = true
        this.voteCode = data.get("vote")
        this.showToastMessage("user exist in voted list"+this.userExist +"   "+this.voteCode+"  "+this.userEmail)
      }else{
        this.userExist = false
        this.voteCode = 0
        this.showToastMessage("user not exist "+this.userExist+"  "+this.voteCode+"  "+this.userEmail)
        
      }
    }).then(()=>{
      this.setTheVotingButtonColors()
    })

    //this.voteCodeObs = this.db.collection("posts").doc(this.todayDate).collection("comments").doc(this.commentId)
    //.collection("votedlist").doc<voteCodeData>(this.userEmail).valueChanges()



  }

  setTheVotingButtonColors(){
    if(this.voteCode == 1){
      this.upVoteBtnColor = "#FFD700"
      this.downVoteBtnColor = "#ffffff"
    }else if(this.voteCode == -1){
      this.upVoteBtnColor = "#ffffff"
      this.downVoteBtnColor = "#FFD700"
    }else{
      this.upVoteBtnColor = "#ffffff"
      this.downVoteBtnColor = "#ffffff"
    }

  }

  auto_grow(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight)+"px";
}

}
