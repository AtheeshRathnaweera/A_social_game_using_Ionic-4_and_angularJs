import { Component, OnInit } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';

export class profileData {
  name: string;
  email: string;
  password: string;
  since: string;
  totalComments: string;
}

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.page.html',
  styleUrls: ['./userprofile.page.scss'],
})

export class UserprofilePage implements OnInit {

  public profile:profileData = new profileData();//Create a new profile data object

  constructor(private fauth:AngularFireAuth) { 

    var todayDate = new Date().toISOString().slice(0,10);

    this.profile.name = "atheesh_27"
    this.profile.since = todayDate
    this.profile.totalComments = String(54)
  }

  ngOnInit() {
  }

  logout() {
    this.fauth.auth.signOut();
  }

  getUserDataFromTheDatabase(){
    //get the user data from users segment in db
  }



}
