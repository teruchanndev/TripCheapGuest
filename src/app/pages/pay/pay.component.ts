import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators  } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Cart } from 'src/app/modals/cart.model';
import { AuthService } from 'src/app/services/auth_customer.service';
import { CartsService } from 'src/app/services/cart.service';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { OrdersService } from 'src/app/services/order.service';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent implements OnInit {

  private authListenerSubs: Subscription;
  customerIsAuthenticated = false;
  customerId: string;

  formInfo: FormGroup;
  formPay: FormGroup;
  isEditable = false;

  carts: Array<Cart> = [];
  priceItemStill: Array<number> = [];
  pricePay = 0;
  cartItem: Cart;
  isCaptcha = false;

  isOrderVerify = false;

  public recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  public sent: boolean;
  busy = true;
  phone_number: number = 0;
  paySelect: string;
  pays: string[] = ['Đổi vé và thanh toán tại quầy vé', 'Thanh toán qua thẻ'];

  constructor(
    public customerService: CustomerService,
    public cartService: CartsService,
    public route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private _formBuilder: FormBuilder,
    public orderService: OrdersService
  ) { 
    var firebaseConfig = {
      apiKey: "AIzaSyBHSbfbd6EehQhbJqGE62tP_MuJRS5k5Qo",
      authDomain: "tripcheap-8237d.firebaseapp.com",
      projectId: "tripcheap-8237d",
      storageBucket: "tripcheap-8237d.appspot.com",
      messagingSenderId: "617218389657",
      appId: "1:617218389657:web:6d61275b14d0da3779ea08",
      measurementId: "G-11DWV0S1DV"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }

  ngOnInit(): void {

    
    this.formInfo = new FormGroup({
      fullName: new FormControl(null, {
        validators: [Validators.required]
      }),
      address: new FormControl(null, {
        validators: [Validators.required]
      }),
      email: new FormControl(null, {
        validators: [Validators.required]
      }),
      phone_number: new FormControl(null, {
      }),
    });

    this.formPay = new FormGroup({
      phone_number: new FormControl(null, {
      }),
      captcha: new FormControl(null, {
      })
    });
    this.authService.autoAuthCustomer();
    this.customerIsAuthenticated = this.authService.getIsAuth();
    this.customerId = this.authService.getCustomerId();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.customerIsAuthenticated = isAuthenticated;
      });
      this.route.paramMap.subscribe((paramMap: ParamMap) => {
        const index = 0;
        for (const item of paramMap.get('idCart').split(',')) {
          this.cartService.getOneCart(item).subscribe( cartData => {
            console.log(cartData);
            this.cartItem = {
              id: cartData._id,
              nameTicket: cartData.nameTicket ,
              imageTicket: cartData.imageTicket ,
              dateStart: cartData.dateStart ,
              dateEnd: cartData.dateEnd ,
              idTicket: cartData.idTicket ,
              idCreator: cartData.idCreator ,
              idCustomer: cartData.idCustomer ,
              itemService: cartData.itemService
            };
            this.carts.push(this.cartItem);
            let sum = 0;
            for (let j = 0; j < this.cartItem.itemService.length; j++) {
              // tslint:disable-next-line:radix
              sum += parseInt(this.cartItem.itemService[j].itemServicePrice) * this.cartItem.itemService[j].quantity;
            }
            this.priceItemStill.push(sum);
            this.pricePay += sum;
          });

        }

      });
      this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');

  }

  payComplete() {
    for(let item of this.carts) {
      this.orderService.addOrder(
        item.nameTicket,
        item.imageTicket,
        item.dateStart,
        item.dateEnd,
        item.idTicket,
        item.idCreator,
        item.idCustomer,
        item.itemService,
        this.paySelect
      );
    }
    this.customerService.updateInfo(
      this.formInfo.value.email,
      this.formInfo.value.phone_number.toString(),
      this.formInfo.value.fullName,
      this.formInfo.value.address
    )
     
  }

  onVerify() {
    this.busy = false;
    var applicationVerifier = new firebase.auth.RecaptchaVerifier(
      'recaptcha-container');
    const phoneNumberString = '+' + this.formInfo.value.phone_number.toString();

      var provider = new firebase.auth.PhoneAuthProvider();
      provider.verifyPhoneNumber(phoneNumberString, applicationVerifier)
          .then((verificationId) => {
            this.isCaptcha = true;
            // var verificationCode = this.sendCaptcha(this.formPay.value.captcha).toString();
            var verificationCode = window.prompt('Please enter the verification ' +
                'code that was sent to your mobile device.');
            console.log(verificationCode);
            return firebase.auth.PhoneAuthProvider.credential(verificationId,
              verificationCode);
          })
          .then(function(phoneCredential) {
            this.isOrderVerify = true;
            return firebase.auth().signInWithCredential(phoneCredential);
          }).catch( (error) => {
            
          })
  };


}