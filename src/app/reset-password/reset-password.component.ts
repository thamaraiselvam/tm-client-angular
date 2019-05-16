import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { RequestService } from '../request.service';
import { MatSnackBar } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router,
    private request: RequestService,
    public snackBar: MatSnackBar
  ) {}

  email = new FormControl('', [Validators.required, Validators.email]);

  getErrorMessage(input: string) {
    if (input === 'email') {
      return this.email.hasError('required') ? 'You must enter a value' : this.email.hasError('email') ? 'Not a valid email' : '';
    }
  }

  reset(email: string) {
    this.request.resetPassword(email)
      .subscribe(
        (response) => {
          if (response.status === 'success') {
            this.snackBar.open(response.message, 'OK', {
              duration: 2000,
            });
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
