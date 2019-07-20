import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserLoggedInService {

  result: boolean

  constructor(private faAuth: AngularFireAuth) { }

  async checkLoggedIn(){
    
    await this.faAuth.authState.subscribe(state=>{//check whether user is log in or not and then return the result
      if(state){
        this.result = true
      }else{
        this.result =  false
      }
    })

    return this.result

  }
}


