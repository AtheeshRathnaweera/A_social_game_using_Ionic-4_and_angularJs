import { Component } from '@angular/core';

import { Platform, AngularDelegate } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private faAuth: AngularFireAuth
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.faAuth.authState.subscribe(state=>{//check whether user is log in or not
        if(state){
          this.router.navigate(['home'])//go to the home page if logged in
        }else{
          this.router.navigate(['login'])//go to the login page else
        }
      })


    });

  }
}
