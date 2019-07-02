import { Component, OnInit } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.page.html',
  styleUrls: ['./userprofile.page.scss'],
})
export class UserprofilePage implements OnInit {

  constructor(private fauth:AngularFireAuth) { }

  ngOnInit() {
  }

  logout() {
    this.fauth.auth.signOut();
  }

}
