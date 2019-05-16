import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatInputModule,
  MatSelectModule,
  MatDatepickerModule,
  MatCardModule,
  MatNativeDateModule,
  MatDividerModule,
  MatSidenavModule,
  MatButtonModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatIconModule,
  MatDialogModule,
} from '@angular/material';


import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { LoginComponent } from './login/login.component';
import { UserFormComponent } from './userForm/user-form.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TaskComponent } from './task/task.component';
import * as moment from 'moment';
import { FileUploadModule } from 'ng2-file-upload';
import { ResetPasswordComponent } from './reset-password/reset-password.component';



const appRoutes: Routes = [
  { path: 'user/login', component: LoginComponent },
  { path: 'user/register', component: UserFormComponent , data: {edit: false}},
  { path: 'user/dashboard', component: DashboardComponent },
  { path: 'user/profile/edit', component: UserFormComponent, data: {edit: true} },
  { path: 'task/add', component: TaskComponent, data: {edit: false}},
  { path: 'user/reset-password', component: ResetPasswordComponent, data: {edit: false}},
  { path: 'task/edit/:taskId', component: TaskComponent, data: {edit: true}},
  { path: '', component: HomeComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    LoginComponent,
    UserFormComponent,
    HomeComponent,
    DashboardComponent,
    TaskComponent,
    ResetPasswordComponent
  ],
  exports: [
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
    ),
    BrowserModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatCardModule,
    MatDividerModule,
    MatSidenavModule,
    MatButtonModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatIconModule,
    HttpClientModule,
    FileUploadModule,
  ],
  providers: [{ provide: 'moment', useValue: moment }],
  bootstrap: [AppComponent]
})
export class AppModule { }
