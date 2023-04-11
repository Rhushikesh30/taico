import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/service/auth.service';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent 
  extends UnsubscribeOnDestroyAdapter
  implements OnInit 
  {
  loginForm: FormGroup;
  submitted = false;  
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: [
        '',
        [Validators.required]
      ]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';
    var username =this.f.username.value
    if (this.loginForm.invalid) {
      this.error = 'username not valid !';
      this.submitted = false;
      return;
    } else {
      this.subs.sink = this.authService
        .resetPassword(username)
        .subscribe(
          (res) => {
            const token =res['token']
            if (res) {
              if (res['token']==='user does not exist'){
                this.error = res['token'];
                this.submitted = false;
              }else{
                this.authService.setCodeToken(res['token']);
                this.router.navigate(['/authentication/new-password'],{ state: {username,token}});
              }
            } else {
              this.error = 'Invalid Login';
              this.submitted = false;
            }
          },
          (error) => {
            this.error = error;
            this.submitted = false;
          }
        );
        console.log("hello");
    }


  }
}

