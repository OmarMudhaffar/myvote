import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../login/login';
import { NavController, AlertController } from 'ionic-angular';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;

  constructor(public auth : AngularFireAuth,public navCtrl: NavController) {


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
      }

    });

  }
}
