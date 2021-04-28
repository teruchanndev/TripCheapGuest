import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Customer } from 'src/app/modals/customer.model';
import { AuthService } from 'src/app/services/auth_customer.service';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-detail-info',
  templateUrl: './detail-info.component.html',
  styleUrls: ['./detail-info.component.css']
})
export class DetailInfoComponent implements OnInit {

  private authListenerSubs: Subscription;
  private customerListenerSubs: Subscription;

  userIsAuthenticated = false;
  customerId: string;
  username: string;
  infoCustomer: Customer;
  characterAvt: string;

  isChange = false;
  isDisabled = true;
  formInfo: FormGroup;



  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private authService: AuthService,
    public customerService: CustomerService,
    private router: Router,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.formInfo = new FormGroup({
      username: new FormControl(null, {
        validators: [Validators.required]
      }),
      fullName: new FormControl(null, {
        validators: [Validators.required]
      }),
      phoneNumber: new FormControl(null, {
        validators: [Validators.required]
      }),
      email: new FormControl(null, {
        validators: [Validators.required]
      }),
      address: new FormControl(null, {
      }),
    });

    this.authService.autoAuthCustomer();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.customerId = this.authService.getCustomerId();
    this.username = this.authService.getUsername();

    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
    });

    this.customerService.getInfoCustomer().then(
      (inforData) => {
        var info = inforData as Customer;
        this.infoCustomer = {
          username: info.username,
          email: info.email,
          phoneNumber: info.phoneNumber,
          fullName: info.fullName,
          address: info.address
        };
        this.characterAvt = info.username[0].toUpperCase();

        this.formInfo.setValue({
          username: this.infoCustomer.username,
          fullName: this.infoCustomer.fullName,
          phoneNumber: this.infoCustomer.phoneNumber,
          email: this.infoCustomer.email,
          address: this.infoCustomer.address
        });
        this.formInfo.disable();
      });

  }

  isEnableForm() {
    this.isChange = true;
    this.formInfo.enable();
  }

  isDisableForm() {
    this.formInfo.setValue({
      username: this.infoCustomer.username,
      fullName: this.infoCustomer.fullName,
      phoneNumber: this.infoCustomer.phoneNumber,
      email: this.infoCustomer.email,
      address: this.infoCustomer.address
    });
    this.isChange = false;
    this.formInfo.disable();
  }

  updateInfo()  {
    console.log(this.formInfo.value);
    this.customerService.updateInfo(
      this.formInfo.value.email,
      this.formInfo.value.phoneNumber.toString(),
      this.formInfo.value.fullName,
      this.formInfo.value.address,
      this.formInfo.value.username
    );

    this._document.defaultView.location.reload();
  }

}
