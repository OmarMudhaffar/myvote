import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import * as $ from "jquery";
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import {  AngularFireDatabase } from 'angularfire2/database';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public load : LoadingController, private auth : AngularFireAuth, public toast : ToastController, private db : AngularFireDatabase) {


  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }


  signuppage(){
   $(".loginpage .inputs").fadeOut(20,function(){

    $('.one').removeClass("active");
    $(".two").addClass("active");
    $(".signup-page .inputs").fadeIn();

   });
  }

  loginpage(){
    $(".signup-page .inputs").fadeOut(20, function(){
      $('.two').removeClass("active");
      $(".one").addClass("active");
      $(".loginpage .inputs").fadeIn();
    });
  }

  login(email,pass){

  if(email.length > 0 && pass.length > 0) {

  var load = this.load.create({
  content:"Login in ..."
  });

  load.present();

  this.auth.auth.signInWithEmailAndPassword(email,pass).then( ()=> {

    load.dismiss();
  
    if(!this.auth.auth.currentUser.emailVerified){
      $("input").val("");
      var toast = this.toast.create({
        message:"Please active your email",
        duration:3000
      });
      toast.present();
    }

    if(this.auth.auth.currentUser.emailVerified){
    
      this.navCtrl.setRoot(TabsPage);
      this.navCtrl.goToRoot;
    
    }

  }).catch( err=> {
    load.dismiss();
    var toast = this.toast.create({
      message:err.message,
      duration:3000,
    });


    toast.present();

  })

  }

  }

  // register

  register(email,name:any,pass){


    if(email.length > 0 && pass.length > 0 && name.length > 0) {


      var load = this.load.create({
        content:"Register please waite ..."
        });
      
        load.present();

        
      var db = this.db.list("users",ref => ref.orderByChild("name").equalTo(name.toLowerCase())).snapshotChanges();
      var sub = db.subscribe(userche => {

      if(userche[0] == undefined){

        this.auth.auth.createUserWithEmailAndPassword(email,pass).then( ()=> {

          $("input").val("");

          
          $("input").val().toLowerCase();

          console.log(name);
  
          this.db.list("users").push({
            email:email,
            name:name,
            image:"https://firebasestorage.googleapis.com/v0/b/vote-b1894.appspot.com/o/11906329_960233084022564_1448528159_a.jpg?alt=media&token=dd943fc8-1538-4ad5-88dd-a4db29fa069d",
            verified:false
          })
  
        load.dismiss();
  
          var user = this.auth.auth.currentUser;
          user.sendEmailVerification().then( ()=> {
            var toast = this.toast.create({
              message:"Activation link have been sent to your email",
              duration:3000
            });
            toast.present();
          });
  
  }).catch( err=> {
    var toast = this.toast.create({
      message:err.message,
      duration:3000
    });
    toast.present();
  })

  sub.unsubscribe();

      }

      if(userche[0] != undefined){
        load.dismiss();
        var toast = this.toast.create({
          message:"username is already taken",
          duration:3000
        });
        toast.present();
      }

      sub.unsubscribe();

      });



}

  }


    

}
