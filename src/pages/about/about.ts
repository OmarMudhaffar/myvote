import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../login/login';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController,public auth : AngularFireAuth) {


    auth.authState.subscribe( res=> {
      if(res == null){
        navCtrl.setRoot(LoginPage);
        navCtrl.goToRoot;
      }
       
      if(res != null){
        if(!res.emailVerified){
          navCtrl.setRoot(LoginPage);
        navCtrl.goToRoot;
        }

        if(res.emailVerified){
          navCtrl.setRoot(TabsPage);
          navCtrl.goToRoot;
        }

      }

    });

  }

}
