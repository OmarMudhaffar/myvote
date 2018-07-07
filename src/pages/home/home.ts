import { Component } from '@angular/core';
import { NavController, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as $ from "jquery";
import { AngularFireStorage } from 'angularfire2/storage';
import * as firebase from 'firebase/app';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { AboutPage } from '../about/about';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {



  public Fbref : any;

  list : Observable<any>;
  
  image = "omar"
  name = "omar"
  verified = false;

  loggedin= false;  
    mySelectedPhoto;
    loading;
    currentPhoto ;
    imgSource;

  constructor(public navCtrl: NavController,private camera:Camera, public toast : ToastController, public storeg : AngularFireStorage , public load : LoadingController, public alert : AlertController, public modle : ModalController, public db : AngularFireDatabase, public auth : AngularFireAuth,public loadingCtrl:LoadingController) {
    

    

    this.list = db.list("vote").snapshotChanges();

    auth.authState.subscribe( res=> {
      if(res != null){ 
      db.list("users",ref => ref.orderByChild("email").equalTo(res.email)).valueChanges().forEach(data => {
        this.image = data[0]["image"];
        this.name = data[0]["name"];
        this.verified = data[0]['verified']
      });
    }
      
    });
    

  }


  showAdd(){
    $(".edit-dialog").css("display","flex");
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

  add(text){


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
       name:this.name,
       verified:this.verified
     }).then( ()=> {
      $(".edit-dialog").css("display","none");
       var toast = this.toast.create({
         message:"Your vote has been posted",
         duration:3000
       });
       toast.present();
  
     });
  
  
    }

    
  cancle(){
    $(".edit-dialog").css("display","none");
  }


  showToast(text){
    var toast = this.toast.create({
      message:text,
      duration:3000
    });
    toast.present();
  }
  
  setLike(key,likenum,disnum,lovenum){

    let email = this.auth.auth.currentUser.email;


   var db = this.db.list("votestatus/"+key,ref => ref.orderByChild("email").equalTo(email)).snapshotChanges();
   var sub = db.subscribe(data => {

      if(data[0] == undefined){
        this.db.list("votestatus/"+key).push({
          email:email,
          key:key,
          like:true,
          dis:false,
          love:false
        }).then( ()=> {
          this.db.list("vote").update(key,{
            like:likenum +1
          })
        });

        sub.unsubscribe();

        this.showToast("You liked this post");

      }

      if(data[0] != undefined){

        let emaildata = data[0].payload.val()['email'];
        var like = data[0].payload.val()['like'];
        var dis = data[0].payload.val()['dis'];
        var love = data[0].payload.val()['love'];
        var keydata = data[0].payload.val()['key'];

        if(emaildata == email && key == keydata && like == false && dis == false && love == false){
          this.db.list("votestatus/"+key).update(data[0].payload.key,{

            like:true

          }).then( ()=> {

            this.db.list("vote").update(key,{
              like:likenum +1
            });

            sub.unsubscribe();

            this.showToast("You liked this post");

          });
        }

        // another

        if(emaildata == email && key == keydata && like == true  && dis == false && love == false){
          this.db.list("votestatus/"+key).update(data[0].payload.key,{

            like:false

          }).then( ()=> {

            this.db.list("vote").update(key,{
              like:likenum -1
            });

            sub.unsubscribe();

            this.showToast("Your vote has been removed");

          });
        }

        // another 

        
        if(emaildata == email && key == keydata && like == false  && dis == true && love == false){
          this.db.list("votestatus/"+key).update(data[0].payload.key,{

            like:true,
            dis:false

          }).then( ()=> {

            this.db.list("vote").update(key,{
              dis:disnum -1
            }).then( ()=> {

              this.db.list("vote").update(key,{
                like:likenum +1
              })

            });

            sub.unsubscribe();

            this.showToast("You liked this post");

          });
        }

        // another 

        if(emaildata == email && key == keydata && like == false  && dis == false && love == true){
          this.db.list("votestatus/"+key).update(data[0].payload.key,{

            like:true,
            love:false

          }).then( ()=> {

            this.db.list("vote").update(key,{
              love:lovenum -1
            }).then( ()=> {

              this.db.list("vote").update(key,{
                like:likenum +1
              })

            });

            sub.unsubscribe();

            this.showToast("You liked this post");

          });
        }

      }

    });


  }


  // set dis like 

  setDis(key,likenum,disnum,lovenum){

    let email = this.auth.auth.currentUser.email;


   var db = this.db.list("votestatus/"+key,ref => ref.orderByChild("email").equalTo(email)).snapshotChanges();
   var sub = db.subscribe(data => {

      if(data[0] == undefined){
        this.db.list("votestatus/"+key).push({
          email:email,
          key:key,
          like:false,
          dis:true,
          love:false
        }).then( ()=> {
          this.db.list("vote").update(key,{
            dis:disnum +1
          })
        });

        sub.unsubscribe();

        this.showToast("You dislike this post");

      }

      if(data[0] != undefined){

        let emaildata = data[0].payload.val()['email'];
        var like = data[0].payload.val()['like'];
        var dis = data[0].payload.val()['dis'];
        var love = data[0].payload.val()['love'];
        var keydata = data[0].payload.val()['key'];

        if(emaildata == email && key == keydata && like == false && dis == false && love == false){
          this.db.list("votestatus/"+key).update(data[0].payload.key,{

            dis:true

          }).then( ()=> {

            this.db.list("vote").update(key,{
              dis:disnum +1
            });

            sub.unsubscribe();

            this.showToast("You dislike this post");

          });
        }

        // another

        if(emaildata == email && key == keydata && like == false  && dis == true && love == false){
          this.db.list("votestatus/"+key).update(data[0].payload.key,{

            dis:false

          }).then( ()=> {

            this.db.list("vote").update(key,{
              dis:disnum -1
            });

            sub.unsubscribe();

            this.showToast("Your vote has been removed");

          });
        }

        // another 

        
        if(emaildata == email && key == keydata && like == true  && dis == false && love == false){
          this.db.list("votestatus/"+key).update(data[0].payload.key,{

            like:false,
            dis:true

          }).then( ()=> {

            this.db.list("vote").update(key,{
              like:likenum -1
            }).then( ()=> {

              this.db.list("vote").update(key,{
                dis:disnum +1
              })

            });

            sub.unsubscribe();

            this.showToast("You dislike this post");

          });
        }

        // another 

        if(emaildata == email && key == keydata && like == false  && dis == false && love == true){
          this.db.list("votestatus/"+key).update(data[0].payload.key,{

            dis:true,
            love:false

          }).then( ()=> {

            this.db.list("vote").update(key,{
              love:lovenum -1
            }).then( ()=> {

              this.db.list("vote").update(key,{
                dis:disnum +1
              })

            });

            sub.unsubscribe();

            this.showToast("You dislike this post");

          });
        }

      }

    });


  }


  // set love 


  setLove(key,likenum,disnum,lovenum){

    let email = this.auth.auth.currentUser.email;


   var db = this.db.list("votestatus/"+key,ref => ref.orderByChild("email").equalTo(email)).snapshotChanges();
   var sub = db.subscribe(data => {

      if(data[0] == undefined){
        this.db.list("votestatus/"+key).push({
          email:email,
          key:key,
          like:false,
          dis:false,
          love:true
        }).then( ()=> {
          this.db.list("vote").update(key,{
            love:lovenum +1
          })
        });

        sub.unsubscribe();

        this.showToast("You loved this post");

      }

      if(data[0] != undefined){

        let emaildata = data[0].payload.val()['email'];
        var like = data[0].payload.val()['like'];
        var dis = data[0].payload.val()['dis'];
        var love = data[0].payload.val()['love'];
        var keydata = data[0].payload.val()['key'];

        if(emaildata == email && key == keydata && like == false && dis == false && love == false){
          this.db.list("votestatus/"+key).update(data[0].payload.key,{

            love:true

          }).then( ()=> {

            this.db.list("vote").update(key,{
              love:lovenum +1
            });

            sub.unsubscribe();

            this.showToast("You loved this post");

          });
        }

        // another

        if(emaildata == email && key == keydata && like == false  && dis == false && love == true){
          this.db.list("votestatus/"+key).update(data[0].payload.key,{

            love:false

          }).then( ()=> {

            this.db.list("vote").update(key,{
              love:lovenum -1
            });

            sub.unsubscribe();

            this.showToast("Your vote has been removed");

          });
        }

        // another 

        
        if(emaildata == email && key == keydata && like == true  && dis == false && love == false){
          this.db.list("votestatus/"+key).update(data[0].payload.key,{

            like:false,
            love:true

          }).then( ()=> {

            this.db.list("vote").update(key,{
              like:likenum -1
            }).then( ()=> {

              this.db.list("vote").update(key,{
                love:lovenum +1
              })

            });

            sub.unsubscribe();

            this.showToast("You loved this post");

          });
        }

        // another 

        if(emaildata == email && key == keydata && like == false  && dis == true && love == false){
          this.db.list("votestatus/"+key).update(data[0].payload.key,{

            dis:false,
            love:true

          }).then( ()=> {

            this.db.list("vote").update(key,{
              dis:disnum -1
            }).then( ()=> {

              this.db.list("vote").update(key,{
                love:lovenum +1
              })

            });

            sub.unsubscribe();

            this.showToast("You loved this post");

          });
        }

      }

    });


  }


  
takePhoto(){
  const options: CameraOptions = {
    targetHeight:200,
    targetWidth:200,
    destinationType : this.camera.DestinationType.DATA_URL,
    encodingType:this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType:this.camera.PictureSourceType.PHOTOLIBRARY
  }
  
  this.camera.getPicture(options).then((imageData) =>{
      this.loading = this.loadingCtrl.create({
          content: "Update photo wait ..."
           });
    this.loading.present();
  this.mySelectedPhoto = this.dataURLtoBlob('data:image/jpeg;base64,'+imageData);
      this.upload();
          
          },(err)=>{
      console.log(err);
          });
  
  
  }
  
      
      
  dataURLtoBlob(myURL){
      let binary = atob(myURL.split(',')[1]);
  let array = [];
  for (let i = 0 ; i < binary.length;i++){
      array.push(binary.charCodeAt(i));
  }
      return new Blob([new Uint8Array(array)],{type:'image/jpeg'});
  }    
      
      
  upload(){
  if(this.mySelectedPhoto){
      var uploadTask = firebase.storage().ref().child('images/'+this.auth.auth.currentUser.email+".jpg");
      var put = uploadTask.put(this.mySelectedPhoto);
      put.then(this.onSuccess,this.onErrors);

      var sub = this.db.list("users",ref => ref.orderByChild("email").equalTo(this.auth.auth.currentUser.email)).snapshotChanges().subscribe(data => {

        uploadTask.getDownloadURL().then(url =>{
          
          
          this.db.list("users").update(data[0].payload.key,{
            image:url
          }).then( ()=> {
            
 
            var cont = this.db.list("vote",ref => ref.orderByChild("email").equalTo(this.auth.auth.currentUser.email)).snapshotChanges().subscribe(vdata => {

              vdata.forEach(vimgs => {

                this.db.list("vote").update(vimgs.key,{
                  image:url,
                }).then( ()=> {cont.unsubscribe()})

              });

            });

          })

      
          
        });


      });
      
      
  }
  }    
      
  onSuccess=(snapshot)=>{
      this.currentPhoto = snapshot.downloadURL;

      this.loading.dismiss();
  } 
      
  onErrors=(error)=>{

      this.loading.dismiss();


  }   
      
  getMyURL(){
      firebase.storage().ref().child('images/'+this.auth.auth.currentUser.email+".jpg").getDownloadURL().then((url)=>{
          this.imgSource = url;
          
          })
  }
      
      
      
      
   
}