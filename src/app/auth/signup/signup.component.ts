import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth_customer.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  private authStatusSub: Subscription;
  constructor(public authService: AuthService) { }


  ngOnInit() {
  }

  onSignUp(form: NgForm) {
    if (form.invalid) { return; }
    this.authService.createCustomer(form.value.email, form.value.password, form.value.username);
  }

  ngOnDestroy(): void {
    // this.authStatusSub.unsubscribe();
  }


}
