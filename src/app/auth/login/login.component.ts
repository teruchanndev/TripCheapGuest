import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth_customer.service';
import { RouterModule } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private authStatusSub: Subscription;
  constructor(
    @Inject(DOCUMENT) private _document: Document,
    public authService: AuthService) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
      }, error => {
      }
    );
  }

  onLogin(form: NgForm) {
    if (form.invalid) { return; }
    this.authService.login(form.value.email, form.value.password);
    // this._document.defaultView.location.reload();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

}
