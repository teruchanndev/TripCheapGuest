import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
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
import { QRCodeModule, QRCodeComponent } from 'angularx-qrcode';
import html2canvas from 'html2canvas';
import { Customer } from 'src/app/modals/customer.model';
import Swal from 'sweetalert2';
import { resolve } from '@angular/compiler-cli/src/ngtsc/file_system';
import { DOCUMENT } from '@angular/common';
import { TicketsService } from 'src/app/services/tickets.service';

export interface QuantityTicket {
  id: string,
  quantity: number
}

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent implements OnInit {

  @ViewChild('qrcode') qrcode: QRCodeComponent;
  @ViewChild('canvas') canvas: ElementRef;

  private authListenerSubs: Subscription;
  customerIsAuthenticated = false;
  customerId: string;
  infoCustomer: Customer;

  formInfo: FormGroup;
  formPay: FormGroup;
  isEditable = false;

  email: Email;

  quantityItemInTicket: Array<QuantityTicket> = [];
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
  qrcodeContent: string;

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    public customerService: CustomerService,
    public cartService: CartsService,
    public route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private _formBuilder: FormBuilder,
    public orderService: OrdersService,
    public emailService: EmailService,
    public ticketService: TicketsService
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

      this.customerService.getInfoCustomer().then(
        // var info = inforData
        (inforData) => {
          const info = inforData as Customer;
          this.infoCustomer = {
            username: info.username,
            email: info.email,
            phoneNumber: info.phoneNumber,
            fullName: info.fullName,
            address: info.address
          };

          this.formInfo.setValue({
            fullName: this.infoCustomer.fullName,
            phone_number: this.infoCustomer.phoneNumber,
            email: this.infoCustomer.email,
            address: this.infoCustomer.address
          });
        });

      this.route.paramMap.subscribe((paramMap: ParamMap) => {
        let index = 0;
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

            this.qrcodeContent = this.cartItem.id;
            let sum = 0;
            let quantity = 0;
            for (let j = 0; j < this.cartItem.itemService.length; j++) {
              // tslint:disable-next-line:radix
              sum += parseInt(this.cartItem.itemService[j].itemServicePrice) * this.cartItem.itemService[j].quantity;
              quantity += this.cartItem.itemService[j].quantity;
            }
            this.quantityItemInTicket.push( {
              id: cartData.idTicket,
              quantity: quantity
            });
            this.priceItemStill.push(sum);
            this.pricePay += sum;
          });
          
        }
        console.log(this.quantityItemInTicket);
      });
      this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');

  }


  payComplete() {
    // for(const item of this.quantityItemInTicket) {
    //   this.ticketService.ticketUpdateQuantity(item.id, item.quantity).then(() => {});
    // }
    const idCart = [];
    new Promise((resolve) => {
      for (const item of this.carts) {
        idCart.push(item.id);
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
          false,
          false,
          false
        ).then(() => {
        });
      }
      resolve(idCart);
    }).then((result) => {
      this.cartService.deleteCart(idCart)
        .subscribe(() => {
          this.customerService.updateInfo(
            this.formInfo.value.email,
            this.formInfo.value.phone_number.toString(),
            this.formInfo.value.fullName,
            this.formInfo.value.address,
            this.infoCustomer.username
          ).then(() => {
            for(const item of this.quantityItemInTicket) {
              this.ticketService.ticketUpdateQuantity(item.id, item.quantity).then(() => {});
            }
          })
          .then(() => {
            Swal.fire({
              title: 'Bạn đã mua hàng!',
              icon: 'success'}).then(() => {
                this.router.navigate(['order']);
              });
          }).catch(() => {
            Swal.fire({
              title: 'Thanh toán không thành công!',
              icon: 'error'}).then(() => {
                this.router.navigate(['cart']);
              });
          });
      });
    });
  }

  onVerify() {
    this.busy = false;

    let applicationVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    const phoneNumberString = '+' + this.formInfo.value.phone_number.toString();

      let provider = new firebase.auth.PhoneAuthProvider();
      provider.verifyPhoneNumber(phoneNumberString, applicationVerifier)
        .then(async (verificationId) => {
          this.isCaptcha = true;
          // var verificationCode = this.sendCaptcha(this.formPay.value.captcha).toString();
          // tslint:disable-next-line:prefer-const
          // Swal.fire({
          //   title: 'Nhập mã xác nhận nhận từ số điện thoại:' + this.formInfo.value.phone_number,
          //   input: 'number',

          // })
          const { value: number } = await Swal.fire({
            title: 'Nhập mã xác nhận nhận từ số điện thoại: +' + this.formInfo.value.phone_number,
            input: 'text',
            inputPlaceholder: 'Nhập mã tại đây'
          });

          if(number) {
            return firebase.auth.PhoneAuthProvider.credential(verificationId, number);
          }
        })
        .then(function(phoneCredential) {
          this.isOrderVerify = true;
          console.log(phoneCredential);
          Swal.fire({
            title: 'Đã xác nhận số điện thoại thành công!',
            icon: 'success'
          }).then(() => {
            // this.isOrderVerify = true;
            return firebase.auth().signInWithCredential(phoneCredential);
          });
          
        }).catch( (error) => {
          Swal.fire({
            title: 'Bạn đã nhập sai mã xác nhận! Xem lại số điện thoại!',
            icon: 'error'
          }).then(() => {
            this.busy = true;
            this._document.defaultView.location.reload();
          })

        });
  }


}
