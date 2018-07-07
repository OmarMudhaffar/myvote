import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

/**
 * Generated class for the AddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add',
  templateUrl: 'add.html',
})
export class AddPage {

  image = "omar"
  name = "omar"

  constructor(public navCtrl: NavController, public load : LoadingController, public toast : ToastController ,public navParams: NavParams, private db : AngularFireDatabase, public auth : AngularFireAuth) {
    var email = this.auth.auth.currentUser.email;
    var dbs = db.list("users",ref => ref.orderByChild("email").equalTo(email)).valueChanges().forEach(data => {
      this.image = data[0]["image"];
      this.name = data[0]["name"];
    });
    
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPage');
  }

  add(text){

  var load = this.load.create({
    content:"posting ...",
  });

  load.present();

   var date = new Date();
   var year = date.getFullYear();
   var mo = date.getMonth();
   var day = date.getDay();
   var fulldate = year + "/" + mo + "/" + day;


   this.db.list("vote").push({
     text:text,
     year:fulldate,
     like:0,
     dis:0,
     love:0,
     email:this.auth.auth.currentUser.email,
     image:this.image,
     name:this.name
   }).then( ()=> {
     load.dismiss();
     var toast = this.toast.create({
       message:"Your vote has been posted",
       duration:3000
     });
     toast.present();
     this.navCtrl.pop();
   });


  }

}
