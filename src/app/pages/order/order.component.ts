import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Customer } from 'src/app/modals/customer.model';
import { Order } from 'src/app/modals/order.model';
import { AuthService } from 'src/app/services/auth_customer.service';
import { CustomerService } from 'src/app/services/customer.service';
import { OrdersService } from 'src/app/services/order.service';

export interface ArrayOrder {
  orders: Order;
  price: string;
  dayLeft: number;
}

export interface ArrayOrderTotal {
  label: string;
  arrOrders: Array<ArrayOrder>;
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit, OnDestroy {

  private authListenerSubs: Subscription;
  private orderListenerSubs: Subscription;
  private customerListenerSubs: Subscription;

  userIsAuthenticated = false;
  customerId: string;
  username: string;
  infoCustomer: Customer;
  characterAvt: string;

  ArrOrders: Array<ArrayOrder> = [];
  ordersNotUseExpired: Array<ArrayOrder> = []; // order chưa sử dụng nhưng hết hạn (time)
  ordersNotUse: Array<ArrayOrder> = []; // order chưa sử dụng
  ordersCancel: Array<ArrayOrder> = []; // order đã hủy

  ArrayOrderTotal: Array<ArrayOrderTotal> = [];
  labels = ['Đơn đã thanh toán', 'Đơn hết hạn', 'Đơn đã hủy', 'Đơn đã hoàn thành'];
  listTabValue = [];


  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private authService: AuthService,
    public orderService: OrdersService,
    public customerService: CustomerService,
    private router: Router,
    public route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.authService.autoAuthCustomer();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.customerId = this.authService.getCustomerId();
    // this.username = this.authService.getUsername();

    new Promise((resolve, reject) => {
      this.customerService.getInfoCustomer().subscribe(
        inforData => {
          // this.infoCustomer = {
          //   username: inforData.username,
          //   email: inforData.email,
          //   phoneNumber: inforData.phoneNumber,
          //   fullName: inforData.fullName,
          //   address: inforData.address
          // };
          this.characterAvt = inforData.username[0].toUpperCase();
          resolve(inforData);
        });
    }).then((inforData: any) => {
      console.log(inforData);
      this.infoCustomer = {
            username: inforData.username,
            email: inforData.email,
            phoneNumber: inforData.phoneNumber,
            fullName: inforData.fullName,
            address: inforData.address
          };
    });



    // this.customerService.getInfoCustomer().subscribe(
    //   inforData => {
    //     this.infoCustomer = {
    //       username: inforData.username,
    //       email: inforData.email,
    //       phoneNumber: inforData.phoneNumber,
    //       fullName: inforData.fullName,
    //       address: inforData.address
    //     };
    //     this.characterAvt = inforData.username[0].toUpperCase();
    //   });

    this.orderService.getOrders();
    this.orderListenerSubs = this.orderService.getOrderUpdateListener()
      .subscribe((order: Order[]) => {
        console.log(order);
        // cal price total
        for (let i = 0; i < order.length ; i++) {
          let sum = 0;
          for (let j = 0; j < order[i].itemService.length; j++) {
            // tslint:disable-next-line:radix
            sum += parseInt(order[i].itemService[j].itemServicePrice) * order[i].itemService[j].quantity;
          }
          this.ArrOrders[i] = {
            orders: order[i],
            price: sum.toLocaleString('en-us', {minimumFractionDigits: 0}),
            dayLeft: this.calDaysLeft(order[i].dateEnd)
          };
        }
        this.ArrOrders.sort((a, b) => {
          return a.dayLeft - b.dayLeft;
        });

        // tslint:disable-next-line:max-line-length
        this.listTabValue.push(
          this.ArrOrders.filter(element => !element.orders.status && !element.orders.isCancel && element.dayLeft >= 0)); // đang sử dụng
        this.listTabValue.push(
          this.ArrOrders.filter(element => element.orders.status && element.dayLeft < 0)); // hết hạn
        this.listTabValue.push(
          this.ArrOrders.filter(element => element.orders.isCancel)); // đã hủy
        this.listTabValue.push(
          this.ArrOrders.filter(element => element.orders.isSuccess)); // đã hoàn thành


        for (let i = 0; i < 4; i++) {
          this.ArrayOrderTotal[i] = {
            label: this.labels[i],
            arrOrders: this.listTabValue[i]
          };
        }
      });
  }

  checkCompareDate(date1): Number {
    const dateCheck = date1.split('/');
    const dateNow = new Date();
    // console.log('check: ' + dateNow.getDate());
    if (dateCheck[2] > dateNow.getFullYear()) { return 1; } else if (dateCheck[2] < dateNow.getFullYear()) { return -1; } else {
      if (dateCheck[1] > dateNow.getMonth() + 1) { return 1; } else if (dateCheck[1] < dateNow.getMonth() + 1) {return -1; } else {
        if (dateCheck[0] > dateNow.getDate()) {return 1; } else if (dateCheck[0] < dateNow.getDate()) { return -1; } else { return 0; }
      }
    }
  }

  // tính ngày hết hạn
  calDaysLeft(date): number {
    const part = date.split('/');
    const d = new Date(part[2] + '-' + part[1] + '-' + part[0]);
    const dateNow = new Date();
    d.setHours(0);
    d.setMinutes(0, 0, 0);
    dateNow.setHours(0);
    dateNow.setMinutes(0, 0, 0);
    const dated = d.getTime() - dateNow.getTime();
    const x = dated / (24 * 60 * 60 * 1000);
    return parseInt(x.toString(), 10);
  }


  cancelOrder(id) {
    this.orderService.updateIsCancelOrder(id, false, true).then((data) => {
      this._document.defaultView.location.reload();
    });
  }

  returnOrder(id) {
    this.orderService.updateIsCancelOrder(id, false, false).then((data) => {
      this._document.defaultView.location.reload();
    });
  }

  navigateSetting() {
    this.router.navigate(['setting']);
  }


  ngOnDestroy(): void {
    this.orderListenerSubs.unsubscribe();
  }
}
