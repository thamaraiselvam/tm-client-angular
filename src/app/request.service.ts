import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { User } from './user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  url: string;
  endPoint = 'http://localhost:3000';
  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {

  }

  getToken() {
    return {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${this.auth.get('token')}`,
      })
    };
  }

  login(email: string, password: string): Observable<any> {
    this.url = `${this.endPoint}/user/login`;
    // const loginCredentials: User = { email: email, password: password };
    return this.http.post(this.url, { email: email, password: password }, {})
          .pipe(
            catchError(this.handleError)
          );
  }

  resetPassword(email: string): Observable<any> {
    this.url = `${this.endPoint}/user/reset-password`;
    // const loginCredentials: User = { email: email, password: password };
    return this.http.post(this.url, { email: email }, {})
          .pipe(
            catchError(this.handleError)
          );
  }

  logout(): Observable<any> {
    this.url = `${this.endPoint}/user/logout`;
    // const loginCredentials: User = { email: email, password: password };
    return this.http.post(this.url, {}, this.getToken())
          .pipe(
            catchError(this.handleError)
          );
  }

  register(firstName: string, lastName: string, email: string, password: string, contactNumber: string): Observable<any> {
    this.url = `${this.endPoint}/user/register`;
    // const loginCredentials: User = { email: email, password: password };
    return this.http.post(this.url, {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            contactNumber: contactNumber
          }, {})
          .pipe(
            catchError(this.handleError)
          );
  }

  updateUser(firstName: string, lastName: string, email: string, contactNumber: string): Observable<any> {
    this.url = `${this.endPoint}/user/update`;
    // const loginCredentials: User = { email: email, password: password };
    return this.http.put(this.url, {
            firstName: firstName,
            lastName: lastName,
            email: email,
            contactNumber: contactNumber
          }, this.getToken())
          .pipe(
            catchError(this.handleError)
          );
  }

  addTask(
    name: string,
    startDate: string,
    endDate: string,
    actualHours: string,
    estimatedHours: string,
    attachments: string
  ): Observable<any> {
    this.url = `${this.endPoint}/task/add`;
    // const loginCredentials: User = { email: email, password: password };
    return this.http.post(this.url, {
            name: name,
            startDate: startDate,
            endDate: endDate,
            actualHours: actualHours,
            estimatedHours: estimatedHours,
            attachments: attachments
          }, this.getToken())
          .pipe(
            catchError(this.handleError)
          );
  }

  updateTask(
    taskId: string,
    name: string,
    startDate: string,
    endDate: string,
    actualHours: string,
    estimatedHours: string,
    status: string,
    attachments: string
  ): Observable<any> {
    this.url = `${this.endPoint}/task/update`;
    return this.http.put(this.url, {
            taskId: taskId,
            name: name,
            startDate: startDate,
            endDate: endDate,
            actualHours: actualHours,
            estimatedHours: estimatedHours,
            status: status,
            attachments: attachments
          }, this.getToken())
          .pipe(
            catchError(this.handleError)
          );
  }

  listTask() {
    this.url = `${this.endPoint}/task/list`;

    return this.http.get(this.url, this.getToken())
    .pipe(
      catchError(this.handleError)
    );
  }

  deleteTask(taskId) {
    this.url = `${this.endPoint}/task/delete`;

    return this.http.post(this.url, {taskId: taskId}, this.getToken())
    .pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
      return throwError(error.error.message);
    }
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      // console.error(
      //   `Backend returned code ${error.status}, ` +
      //   `body was: ${error.error}`);
        return throwError(error.error);
  }

}
