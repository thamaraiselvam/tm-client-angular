import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  title = 'Welcome to Task Manager';
  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    if (auth.isAuthenticated(false)) {
      this.router.navigate(['user/dashboard']);
    }
  }
}
