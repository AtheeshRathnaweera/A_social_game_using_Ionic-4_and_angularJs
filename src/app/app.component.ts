import { Component } from '@angular/core';

import { Platform} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router,NavigationEnd } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';

import { ToastController } from '@ionic/angular';
import { async } from 'q';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})

export class AppComponent {

  navLinksArray = [];// store route links as the user navigates the app
  currentUrl: string

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private faAuth: AngularFireAuth,
    public toastController: ToastController
  ) {
    this.initializeApp();
   // this.handlingBackButton();
  
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

 /* handlingBackButton() {
    this.router.events.subscribe(event =>{

      this.currentUrl = this.router.url //current url
      this.showToast(this.currentUrl+"  "+this.navLinksArray.length)
    
      if (event instanceof NavigationEnd) {
      
        const isCurrentUrlSaved = this.navLinksArray.find((item) => {return item === this.currentUrl});
      
        if (!isCurrentUrlSaved) this.navLinksArray.push(this.currentUrl);
      
      }// end event if stmt 
      
    }) // end subscribe

    if(this.currentUrl == "/home"){
      this.platform.backButton.unsubscribe()
    }else{
      this.hardwareBackButton();
    }

   
  } */

 /* hardwareBackButton (){
    this.platform.backButton.subscribe(() =>{
    
      if ((this.navLinksArray.length > 1)){
        this.showToast("back button pressed")
       
        this.navLinksArray.pop();
    
        const index = this.navLinksArray.length + 1;
        var url = this.navLinksArray[index];
    
        this.router.navigate([url])
       
      }else{
       this.showToast(this.navLinksArray.length+" array is empty");
      }
    
   })
    


  } */

  showToast = async(num) =>{
    const toast = await this.toastController.create({
      message: num,
      duration: 2000
    });
    toast.present();
  }


}
