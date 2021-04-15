import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators  } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Cart } from 'src/app/modals/cart.model';
import { AuthService } from 'src/app/services/auth_customer.service';
import { CartsService } from 'src/app/services/cart.service';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { OrdersService } from 'src/app/services/order.service';
import { CustomerService } from 'src/app/services/customer.service';
import { Email } from 'src/app/modals/email.model';
import { EmailService } from 'src/app/services/email.service';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels, QrcodeComponent } from '@techiediaries/ngx-qrcode';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent implements OnInit {

  @ViewChild('qrcode') qrcode: QrcodeComponent;
  @ViewChild('canvas') canvas: ElementRef;

  private authListenerSubs: Subscription;
  customerIsAuthenticated = false;
  customerId: string;

  formInfo: FormGroup;
  formPay: FormGroup;
  isEditable = false;

  email: Email;

  carts: Array<Cart> = [];
  priceItemStill: Array<number> = [];
  pricePay = 0;
  cartItem: Cart;
  isCaptcha = false;

  isOrderVerify = false;

  public recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  public sent: boolean;
  busy = true;
  phone_number = 0;
  paySelect: string;
  pays: string[] = ['Đổi vé và thanh toán tại quầy vé', 'Thanh toán qua thẻ'];

  constructor(
    public customerService: CustomerService,
    public cartService: CartsService,
    public route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private _formBuilder: FormBuilder,
    public orderService: OrdersService,
    public emailService: EmailService
  ) {
    const firebaseConfig = {
      apiKey: 'AIzaSyCRuIhPpUBprXRGjIeAUDtenTQybLzrSlQ',
      authDomain: 'tripcheap-2f380.firebaseapp.com',
      projectId: 'tripcheap-2f380',
      storageBucket: 'tripcheap-2f380.appspot.com',
      messagingSenderId: '1065925393783',
      appId: '1:1065925393783:web:16cab53808805f86d1f572',
      measurementId: 'G-DZCP9SE5GQ'
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

  // tslint:disable-next-line:member-ordering
  testQR;
  // tslint:disable-next-line:member-ordering
  elementType = NgxQrcodeElementTypes.IMG;
  // tslint:disable-next-line:member-ordering
  errorCorrectionLevel = NgxQrcodeErrorCorrectionLevels.MEDIUM;

  sendEmail(qrcode) {

    const arr = [];
    for (const item of this.carts) {
      for (const itemS of item.itemService) {
       arr.push(
         `<tr>
            <td>` + item.nameTicket + `</td>
            <td>` + itemS.name + `</td>
            <td>` + item.dateStart + ` - ` + item.dateEnd + `</td>
            <td>` + itemS.itemServiceName + `</td>
            <td>` + itemS.quantity + `</td>
          </tr>`);
      }
    }
    const str = '<table>' + arr.join('') + '</table>';

    this.testQR = str;

    // console.log(this.qrcode.qrcElement);
    // html2canvas(this.qrcode.qrcElement.nativeElement).then(canvas => {
    //   this.canvas.nativeElement.src = canvas.toDataURL();
    //   this.canvas.nativeElement.href = canvas.toDataURL("image/png");
    // });


    const html =
    `<div>Quét mã QR để lấy vé:</div>`
    + str +
    `<img src = "http://192.168.0.47/images/lwlid7jn0quxuonwabzk.webp-1617979039092.webp">`
    + this.qrcode.qrcElement.nativeElement.innerHTML +
    `<ngx-qrcode
      [elementType]="` + NgxQrcodeElementTypes.IMG + `"
      [errorCorrectionLevel]="` + NgxQrcodeErrorCorrectionLevels.MEDIUM + `"
      [value]="` + str + `"></ngx-qrcode>`;

    this.emailService.sendEmail(
      this.formInfo.value.email,
      'tripcheap.pay@gmail.com',
      'Thông tin thanh toán - TripCheap',
      'this is email form TripCheap team.',
      html
    );
  }


  payComplete() {
    const idCart = [];
    for (const item of this.carts) {
      this.orderService.addOrder(
        item.nameTicket,
        item.imageTicket,
        item.dateStart,
        item.dateEnd,
        item.idTicket,
        item.idCreator,
        item.idCustomer,
        item.itemService,
        this.paySelect,
        false,
        false
      );
      idCart.push(item.id);
    }
    this.cartService.deleteCart(idCart);
    this.customerService.updateInfo(
      this.formInfo.value.email,
      this.formInfo.value.phone_number.toString(),
      this.formInfo.value.fullName,
      this.formInfo.value.address
    );

  }

  onVerify() {
    this.busy = false;
    // tslint:disable-next-line:prefer-const
    let applicationVerifier = new firebase.auth.RecaptchaVerifier(
      'recaptcha-container');
    const phoneNumberString = '+' + this.formInfo.value.phone_number.toString();

      // tslint:disable-next-line:prefer-const
      let provider = new firebase.auth.PhoneAuthProvider();
      provider.verifyPhoneNumber(phoneNumberString, applicationVerifier)
          .then((verificationId) => {
            this.isCaptcha = true;
            // var verificationCode = this.sendCaptcha(this.formPay.value.captcha).toString();
            // tslint:disable-next-line:prefer-const
            let verificationCode = window.prompt('Please enter the verification ' +
                'code that was sent to your mobile device.');
            console.log(verificationCode);
            return firebase.auth.PhoneAuthProvider.credential(verificationId,
              verificationCode);
          })
          .then(function(phoneCredential) {
            this.isOrderVerify = true;
            return firebase.auth().signInWithCredential(phoneCredential);
          }).catch( (error) => {

          });
  }


}
