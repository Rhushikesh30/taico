import { Router } from '@angular/router';
import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/core/service/auth.service';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  
})
export class SigninComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  error = '';
  hide = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      password_encrypted: ['']
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';
    if (this.loginForm.invalid) {
      this.error = 'Username and Password not valid !';
      this.submitted = false;
      return;
    } else {
      let self=this
      this.authService.code(this.f.username.value, this.f.password.value).subscribe({
        next(res) {
          if (res) {
            if (res['token']==='Incorrect Username or Password!!!'){
              self.error = res['token']
              self.submitted = false;
            }else{
              self.authService.sessionSet(res)
              self.router.navigate(['/dashboard/main']).then(() => {window.location.reload();});
            }
          } else {
            self.error = 'Invalid Login';
            self.submitted = false;
          }

        },
        error(err) {
          self.error = "The server service is currently stopped.Please try again later or contact support for assistance"
          self.submitted = false;
        },
      })
      // this.subs.sink = this.authService
      //   .code(this.f.username.value, this.f.password.value)
      //   .subscribe(
      //     (res) => {
      //       console.log()
      //       if (res) {
      //         if (res['token']==='Incorrect Username or Password!!!'){
      //           this.error = res['token']
      //           this.submitted = false;
      //         }else{
      //           this.authService.sessionSet(res)
      //           this.router.navigate(['/dashboard/main']).then(() => {window.location.reload();});
      //         }
      //       } else {
      //         this.error = 'Invalid Login';
      //         this.submitted = false;
      //       }
      //     },
      //     (error) => {
      //       this.error = error;
      //       this.submitted = false;
      //     }
      //   );
    }
  }
}

