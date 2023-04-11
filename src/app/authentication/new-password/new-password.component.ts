import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/service/auth.service';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import Swal from "sweetalert2";

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})


export class NewPasswordComponent 
  extends UnsubscribeOnDestroyAdapter
  implements OnInit 
  {
  newPasswordForm: FormGroup;
  submitted:boolean = false;
  PasswordHide:boolean = true;
  confirmPasswordHide:boolean = true;
  error = '';  
  code_token : string;
  RouterForgottenPasswordToken :string=null;
  RouterForgottenPasswordUsername :string=null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { 
    super();
  }

  ngOnInit(): void {
    this.newPasswordForm = this.formBuilder.group({
      password: ['',[Validators.required]],
      confirmpassword: ['',[Validators.required]],
      token: ['',[Validators.required]]
    });  
    
    this.code_token = this.authService.getCodeToken()
  }

  get f() {
    return this.newPasswordForm.controls;
  }

  onSubmit() {
    this.submitted = true;   
    this.error = '' 
    var password = this.f.password.value
    var token = this.f.token.value
 
    var confirmpassword = this.f.confirmpassword.value
    var userData:any={
      'password':password,
      'token': token
    }

    if (this.newPasswordForm.invalid) {
      this.error = 'Password not valid !';
      this.submitted = false;
      return;
    } else if(password==confirmpassword){

      this.subs.sink = this.authService
      .updatePassword(userData).subscribe((res) => {
            if (res) {
              this.authService.isLoggedOut()
              Swal.fire({
                title: 'Password has been updated Successfully',
                icon: 'success',
                showConfirmButton: false
              });
              this.router.navigate(['']).then(() => {
                setTimeout(function() {window.location.reload()});
              });
            } else {
              this.error = 'Invalid Password';
              this.submitted = false;
            }
          },
          (error) => {
            this.error = error;
            this.submitted = false;
          }
        );
    } else{
      this.error = 'Password Not Match';    
      this.submitted = false;  
    }
  }

}
