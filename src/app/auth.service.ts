import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  login(response) {
    localStorage.setItem('currentUser', JSON.stringify(response));
  }

  get(key) {
    let userInfo: any = localStorage.getItem('currentUser');

    if (!userInfo) {
      return '';
    }

    userInfo = JSON.parse(userInfo);

    return (userInfo && (key in userInfo)) ? userInfo[key] : '';
  }

  logout() {
    localStorage.removeItem('currentUser');
  }

  isAuthenticated(redirect = true): Boolean {
    const token = this.get('token');

    console.log('token', token);

    if (!token && redirect) {
      this.router.navigate(['user/login']);
    }

    return (token) ? true : false;
  }
}
