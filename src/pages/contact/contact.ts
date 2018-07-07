import { Component } from '@angular/core';
import { NavController, AlertController, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as $ from "jquery";


@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  list : Observable<any>
  image : any;
  verified = false;
  
  constructor(public navCtrl: NavController, private db : AngularFireDatabase, public toast : ToastController , public auth : AngularFireAuth, public alert : AlertController) {
   let email = auth.auth.currentUser.email;
   this.list =  db.list("vote",ref => ref.orderByChild("email").equalTo(email)).snapshotChanges();
   
   auth.authState.subscribe( res=> {
      
   if(res != undefined){
     
    db.list("users",ref => ref.orderByChild("email").equalTo(res.email)).valueChanges().forEach(data => {
      this.image = data[0]["image"];
      this.verified = data[0]['verified']
    });
    
    
   }

  
  });

  }


  delete(key){

   let alert = this.alert.create({
     subTitle:"Delete this vote?",
     buttons:['cancle',{text:"delete",handler: done=>{
      this.db.list("vote").remove(key);
         }}]
   });

   alert.present();

  }

  showEdit(text,key){
  $(".edit-dialog").css("display","flex");
  $("textarea").val(text);
  $("#mykey").val(key);
  }


  edit(text,key){
    $(".edit-dialog").css("display","none");
    this.db.list("vote").update(key,{
    text:text
    }).then( ()=> {
      var toast = this.toast.create({
        message:"Your vote has been edited",
        duration:2000
      });
      toast.present();
    })

    

  }

  cancle(){
    $(".edit-dialog").css("display","none");
  }


  logout(){
    var alert = this.alert.create({
      subTitle:"Logout from your account?",
      buttons:['cancle',{text:'logout',handler: out=> {
        this.auth.auth.signOut();
        
      }}]
    });
    alert.present();
  }

}
