import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from "@angular/router";
import { UsersService } from './users.service';
import { FirebaseUser } from '../models/firebase-user.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})

export class DashboardService  implements Resolve<FirebaseUser>{
  user: User;

  constructor(public userService: UsersService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot) : Promise<FirebaseUser> {

    let firebaseUser = new FirebaseUser();

    return new Promise((resolve, reject) => {
      this.userService.getCurrentUser()
      .then(res => {
        if(res.providerData[0].providerId == 'password'){
          firebaseUser.uid = res.uid;
          firebaseUser.image = 'user-profile-url.png';
          firebaseUser.name = res.displayName;
          firebaseUser.provider = res.providerData[0].providerId;
          firebaseUser.email = res.providerData[0].email;
          firebaseUser.emailVerified = res.emailVerified;
          firebaseUser.cellphone = res.providerData[0].phoneNumber;
          firebaseUser.creationTime = res.metadata.creationTime;
          firebaseUser.lastSignInTime = res.metadata.lastSignInTime;
          firebaseUser.roles = { client : true};

          this.user = this.setFirebaseUserToUserModel(firebaseUser, "EML");

          return resolve(firebaseUser);
        } else if(res.providerData[0].providerId == "facebook.com"){
          firebaseUser.uid = res.uid;
          firebaseUser.image = res.photoURL;
          firebaseUser.name = res.displayName;
          firebaseUser.provider = res.providerData[0].providerId;
          firebaseUser.email = res.providerData[0].email;
          firebaseUser.emailVerified = res.emailVerified;
          firebaseUser.cellphone = res.providerData[0].phoneNumber;
          firebaseUser.creationTime = res.metadata.creationTime;
          firebaseUser.lastSignInTime = res.metadata.lastSignInTime;
          firebaseUser.referenceNumber = this.generateReferenceNumber(res.providerData[0].email, res.providerData[0].providerId);
          firebaseUser.roles = { client : true};

          this.user = this.setFirebaseUserToUserModel(firebaseUser, "FB");
          
          return resolve(firebaseUser);
        }else if(res.providerData[0].providerId == "google.com"){
          firebaseUser.uid = res.uid;
          firebaseUser.image = res.photoURL;
          firebaseUser.name = res.displayName;
          firebaseUser.provider = res.providerData[0].providerId;
          firebaseUser.email = res.providerData[0].email;
          firebaseUser.emailVerified = res.emailVerified;
          firebaseUser.cellphone = res.providerData[0].phoneNumber;
          firebaseUser.creationTime = res.metadata.creationTime;
          firebaseUser.lastSignInTime = res.metadata.lastSignInTime;
          firebaseUser.referenceNumber = this.generateReferenceNumber(res.providerData[0].email, res.providerData[0].providerId);
          firebaseUser.roles = { client : true};

          this.user = this.setFirebaseUserToUserModel(firebaseUser, "GGL");
          
          return resolve(firebaseUser);
        }else{
          firebaseUser.uid = res.uid;
          firebaseUser.image = res.photoURL;
          firebaseUser.name = res.displayName;
          firebaseUser.provider = res.providerData[0].providerId;
          firebaseUser.email = res.providerData[0].email;
          firebaseUser.emailVerified = res.emailVerified;
          firebaseUser.cellphone = res.providerData[0].phoneNumber;
          firebaseUser.creationTime = res.metadata.creationTime;
          firebaseUser.lastSignInTime = res.metadata.lastSignInTime;
          firebaseUser.referenceNumber = this.generateReferenceNumber(res.providerData[0].email, res.providerData[0].providerId);
          firebaseUser.roles = { client : true};

          this.user = this.setFirebaseUserToUserModel(firebaseUser, res.metadata.provider);
          
          return resolve(firebaseUser);
        }
      }, err => {
        this.router.navigate(['/home']);
        return reject(err);
      })      
    })
  }

  setFirebaseUserToUserModel(firebaseUser: FirebaseUser, providerType: string): User{
    let user = new User();
    
    user.uid = firebaseUser.uid;
    user.image = firebaseUser.image;
    user.name = firebaseUser.name;
    user.provider = firebaseUser.provider;
    user.email = firebaseUser.email;
    user.emailVerified = firebaseUser.emailVerified;
    user.cellphone = firebaseUser.cellphone;
    user.creationTime = firebaseUser.creationTime;
    user.lastSignInTime = firebaseUser.lastSignInTime;
    firebaseUser.referenceNumber = firebaseUser.referenceNumber;
    user.roles = { client: true }
    return user;
  }  

  
  generateReferenceNumber(email: string, providerType: string): string {
    let splitEmail = email.split("@");
    let referenceNumber = splitEmail[0].substring(0, 3).toUpperCase() + providerType.substring(0, 3).toUpperCase() + Math.floor(100 + Math.random() * 500).toString();

    return referenceNumber;
  }
}
