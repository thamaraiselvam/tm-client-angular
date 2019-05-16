import { Component, DoCheck } from '@angular/core';
import { AuthService } from '../auth.service';
import { RequestService } from '../request.service';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements DoCheck {

  title = 'Task Manager v1.0';
  isAuthenticated: Boolean;

  constructor(
    private auth: AuthService,
    private request: RequestService
  ) {
    this.isAuthenticated = this.auth.isAuthenticated();
  }

  ngDoCheck() {
    this.isAuthenticated = this.auth.isAuthenticated(false);
  }

  logout() {
    this.request.logout().subscribe(
      (response) => {
        console.log('response', response);
      },
      (error) => {
        console.log('response', error);
      }
    );
    this.auth.logout();
    this.auth.isAuthenticated();
  }

}
