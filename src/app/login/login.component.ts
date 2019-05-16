import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { RequestService } from '../request.service';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router,
    private request: RequestService,
    public snackBar: MatSnackBar
  ) {}

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  getErrorMessage(input: string) {
    if (input === 'email') {
      return this.email.hasError('required') ? 'You must enter a value' : this.email.hasError('email') ? 'Not a valid email' : '';
    }

    return this.password.hasError('required') ? 'You must enter a value' : '';
  }

  login(email: string, password: string) {
    this.request.login(email, password)
      .subscribe(
        (response) => {
          if (response.status === 'success') {
            this.snackBar.open('Logged in Successfully.', 'OK', {
              duration: 2000,
            });
            this.auth.login(response.userInfo);
            this.router.navigate(['user/dashboard']);
          }
        },
        (error) => {
          const err = error.message ? error.message : 'Something went wrong';
          this.snackBar.open(err, 'OK', {
            duration: 5000,
          });
        }
      );
  }

  ngOnInit() {
  }

}
