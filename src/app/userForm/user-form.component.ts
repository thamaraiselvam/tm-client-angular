import { Component, OnInit, Directive } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { RequestService } from '../request.service';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';


@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})


export class UserFormComponent implements OnInit {
  isUpdate: Boolean = false;
  firstName: any;
  lastName: any;
  email: any;
  password: any;
  contactNumber: any;
  firstNameInput = '';
  lastNameInput = '';
  emailInput = '';
  passwordInput = '';
  contactNumberInput = '';
  isFileSelected;
  userInfo: any;
  public uploader: FileUploader;

  constructor(
    private auth: AuthService,
    private request: RequestService,
    public snackBar: MatSnackBar,
    private router:  Router,
    private activeRoute:  ActivatedRoute
  ) {
    console.log(activeRoute.snapshot.data.edit);
    if (!activeRoute.snapshot.data.edit) {
      this.showRegisterForm();
    }
  }

  public hasBaseDropZoneOver: Boolean = false;
  public hasAnotherDropZoneOver: Boolean = false;

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }


  showRegisterForm() {
    this.isUpdate = false;

    this.uploader = new FileUploader({
      url: 'http://localhost:3000/user/register',
      method: 'POST',
    });

    this.firstName = new FormControl('', [Validators.required]);
    this.lastName = new FormControl('', [Validators.required]);
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', [Validators.required, Validators.minLength(4)]);
    this.contactNumber = new FormControl('', [Validators.required]);
  }

  showUpdateForm() {
    this.isUpdate = true;

    this.uploader = new FileUploader({
      url: 'http://localhost:3000/user/update',
      method: 'PUT',
      authTokenHeader: 'Authorization',
      authToken: `Bearer ${this.auth.get('token')}`,
    });

    this.userInfo = localStorage.getItem('currentUser');
    this.userInfo = JSON.parse(this.userInfo);

    console.log(this.userInfo);

    this.firstName = new FormControl('', [Validators.required]);
    this.lastName = new FormControl('', [Validators.required]);
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.contactNumber = new FormControl('', [Validators.required]);

    this.firstNameInput = this.userInfo.firstName;
    this.lastNameInput = this.userInfo.lastName;
    this.emailInput = this.userInfo.email;
    this.passwordInput = this.userInfo.password;
    this.contactNumberInput = this.userInfo.contactNumber;
  }

  getErrorMessage(input: string) {
    switch (input) {
      case 'firstName':
        return this.firstName.hasError('required') ? 'You must enter a value' : '';
      case 'lastName':
        return this.lastName.hasError('required') ? 'You must enter a value' : '';
      case 'email':
        return this.email.hasError('required') ? 'You must enter a email' : this.email.hasError('email') ? 'Not a valid email' : '';
      case 'password':
        return this.password.hasError('required') ? 'You must enter a value' : '';
      case 'contactNumber':
        return this.contactNumber.hasError('required') ? 'You must enter a value' : '';
    }
  }

  previewImage() {

  }

  register() {
    if (this.isFileSelected) {

      this.uploader.onAfterAddingFile = f => { if (this.uploader.queue.length > 1) { this.uploader.queue.splice(0, 1); } };

      this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
        form.append('firstName' , this.firstNameInput);
        form.append('lastName' , this.lastNameInput);
        form.append('email' , this.emailInput);
        form.append('password' , this.passwordInput);
        form.append('contactNumber' , this.contactNumberInput);
      };

      this.uploader.uploadAll();
      this.uploader.onSuccessItem = (item: any, response: any, status: number, headers: any): any => {
        if (response) {
          console.log('response', response);
          this.snackBar.open('Registered Successfully and Activation Link Sent to your email.', 'OK', {
            duration: 10000,
          });
        }
      };

      this.uploader.onErrorItem = (item: any, response: any, status: number, headers: any): any => {
        if (response) {
          console.log(response);
          response = JSON.parse(response);
          this.snackBar.open(response.message, 'OK', {
            duration: 10000,
          });
        }
      };
    } else {
      this.request.register(this.firstNameInput, this.lastNameInput, this.emailInput, this.passwordInput, this.contactNumberInput)
        .subscribe(
          (response) => {
            if (response.status === 'success') {
              this.snackBar.open('Registered Successfully and Activation Link Sent to your email.', 'OK', {
                duration: 10000,
              });
            }
          },
          (error) => {
            console.log(error);
            this.snackBar.open(error.message, 'OK', {
              duration: 10000,
            });
          }
      );
    }
  }

  update() {

    if (this.isFileSelected) {

      this.uploader.onAfterAddingFile = f => { if (this.uploader.queue.length > 1) { this.uploader.queue.splice(0, 1); } };

      this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
        form.append('firstName' , this.firstNameInput);
        form.append('lastName' , this.lastNameInput);
        form.append('email' , this.emailInput);
        form.append('contactNumber' , this.contactNumberInput);
      };

      this.uploader.uploadAll();
      this.uploader.onSuccessItem = (item: any, response: any, status: number, headers: any): any => {
        if (response) {
          console.log('response' + JSON.stringify(response));
          response = JSON.parse(response);
          this.snackBar.open('New changes updated successfully', 'OK', {
            duration: 3000,
          });
          this.auth.login(response.userInfo);
          this.router.navigate(['user/dashboard']);
        }
      };

      this.uploader.onErrorItem = (item: any, response: any, status: number, headers: any): any => {
        if (response) {
          console.log(response);
          response = JSON.parse(response);
          this.snackBar.open(response.message, 'OK', {
            duration: 10000,
          });
        }
      };

    } else {

      this.request.updateUser(this.firstNameInput, this.lastNameInput, this.emailInput, this.contactNumberInput)
        .subscribe(
          (response) => {
            if (response.status === 'success') {
              this.snackBar.open('New changes updated successfully', 'OK', {
                duration: 3000,
              });
              this.auth.login(response.userInfo);
              this.router.navigate(['user/dashboard']);
            }
          },
          (error) => {
            this.snackBar.open(error.message, 'OK', {
              duration: 10000,
            });
          }
        );
    }

 return ;

  }

  updateFile(file: HTMLInputElement) {
    this.isFileSelected = file.value ? true : false;

  }

  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      if (this.activeRoute.snapshot.data.edit) {
          this.showUpdateForm();
        } else {
          this.showRegisterForm();
        }
    });
  }

}
