import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../service/authentication.service';
import { NotificationService } from '../../../service/notification.service';
import { UsersService } from '../../../service/users.service';

import { Router, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  agree = false;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { 
    this.createForm();
    this.registerForm.setErrors({ invalid: true });
   }

   createForm(): void {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')]],
      retypePassword:['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(2), Validators.pattern('[A-Z][a-z ]*')]],
      surname: ['', [Validators.required, Validators.minLength(2), Validators.pattern('[A-Z][a-z ]*')]],
      idNumber: '',
      passportNumber: '',
      agreedToTerms: this.agree
    });
  }

  agreeToConditions(value: any){
   
    this.agree = value.currentTarget.checked;
  }

  facebookLogin(){
    this.authenticationService.doFacebookAuth(this.agree)
    .then(res => {
      this.router.navigate(['dashboard']);
    }, err => console.log(err));
  }

  googleLogin(){
    if(this.agree){
      this.authenticationService.doGoogleAuth(this.agree)
      .then(res => {
        this.router.navigate(['dashboard']);
      }, err => console.log(err));
    }else{
      Swal.fire({
        type: 'warning',
        title: 'Please agree to the terms and conditions'
      });
    }
  }

  tryRegister(value){
    if(this.agree){
      if(this.emailContains(value.email, 'hotmail') || this.emailContains(value.email, 'yahoo')){
        this.authenticationService.doRegister(value)
        .then(res => {
          this.errorMessage = "";
          this.successMessage = "Your account has been created";
        }, err => {
          Swal.fire("Sorry!!!", err.message, "error");
          console.log(err);
          this.errorMessage = err.message;
          this.successMessage = "";
        });
      }else{
        Swal.fire({
          type: "warning",
          title: "Please use a hotmail.com or yahoo.com",
          text: "The email you're using might prevent us from sending you a validation email because it might be on a private server."
        });
      }    
    }else{
      Swal.fire({
        type: 'warning',
        title: 'Please agree to the terms and conditions'
      });
    }
  }

  getEmailAddress(email: any): void{
    let emailValue = email.target.value;
    if (this.emailContains(emailValue, "gmail")) {
      Swal.fire({
        type: "warning",
        title: "Please use the Google Plus button",
        text: "It looks like you are registering with a gmail account. Please register using the Google+ button."
      });
    } 
  }

  emailContains(emailValue: string, findEmail: string): boolean{
    return emailValue.indexOf(findEmail) > -1;
  }

  ngOnInit() {
  }
}
