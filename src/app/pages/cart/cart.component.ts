import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Cart } from 'src/app/modals/cart.model';
import { ServiceSelect } from 'src/app/modals/serviceSelect.model';
import { AuthService } from 'src/app/services/auth_customer.service';
import { CartsService } from 'src/app/services/cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

export class CartComponent implements OnInit, OnDestroy {

  private authListenerSubs: Subscription;
  private cartListenerSubs: Subscription;
  userIsAuthenticated = false;
  customerId: string;
  username: string;
  countCart = 0;
  carts: Array<Cart> = [];
  itemExpired: Array<Cart> = [];
  itemStill: Array<Cart> = [];
  countServiceSelect = 0;
  priceTotal = 0;

  priceItemStill: Array<number> = [];
  priceItemExpired: Array<number> = [];

  allComplete: Array<boolean> = [];

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private authService: AuthService,
    private router: Router,
    public route: ActivatedRoute,
    public cartService: CartsService
  ) { }

  setAll(completed: boolean) {
    if (completed) {
      for (let i = 0; i < this.allComplete.length ; i++) {
        this.allComplete[i] = true;
        this.priceTotal += this.priceItemStill[i];
      }
      this.countServiceSelect = this.allComplete.length;
    } else {
      for (let i = 0; i < this.allComplete.length ; i++) {
        this.allComplete[i] = false;
        this.priceTotal -= this.priceItemStill[i];
      }
      this.countServiceSelect = 0;
      this.priceTotal = 0;
    }
  }

  setSome(completed: boolean, i) {
    if (completed) {
      this.allComplete[i] = true;
      this.countServiceSelect++;
      this.priceTotal += this.priceItemStill[i];
    } else {
      this.allComplete[i] = false;
      this.countServiceSelect--;
      this.priceTotal -= this.priceItemStill[i];
    }
  }

  checkCompareDate(date1): Number {
    const dateCheck = date1.split('/');
    const dateNow = new Date();
    console.log('check: ' + dateNow.getDate());
    if (dateCheck[2] > dateNow.getFullYear()) { return 1; } else if (dateCheck[2] < dateNow.getFullYear()) { return -1; } else {
      if (dateCheck[1] > dateNow.getMonth() + 1) { return 1; } else if (dateCheck[1] < dateNow.getMonth() + 1) {return -1; } else {
        if (dateCheck[0] > dateNow.getDate()) {return 1; } else if (dateCheck[0] < dateNow.getDate()) { return -1; } else { return 0; }
      }
    }
  }

  ngOnInit(): void {
    this.authService.autoAuthCustomer();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.customerId = this.authService.getCustomerId();
    this.username = this.authService.getUsername();

    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
    });
    this.cartService.getCountCart().subscribe(
      countData => {
        this.countCart = countData.countCart;
    });

    this.cartService.getCarts();
    this.cartListenerSubs = this.cartService.getCartUpdateListener()
      .subscribe((cart: Cart[]) => {
        this.carts = cart;
        this.carts.sort(function(b, a) {
          const x = a.dateEnd.split('/');
          const y = b.dateEnd.split('/');
          if (x[2] > y[2]) { return 1; } else if (x[2] < y[2]) { return -1; } else {
            if (x[1] > y[1]) { return 1; } else if (x[1] < y[1]) {return -1; } else {
              if (x[0] > y[0]) {return 1; } else if (x[0] < y[0]) { return -1; } else { return 0; }
            }
          }
        });

        // set value in cart
        this.itemExpired = this.carts.filter(item => this.checkCompareDate(item.dateEnd) === -1);
        this.itemStill = this.carts.filter(item => this.checkCompareDate(item.dateEnd) > -1);

        // set init input check false
        for (let i = 0; i < this.itemStill.length; i++) {
          this.allComplete[i] = false;
        }

        // set price in cart still
        for (let i = 0; i < this.itemStill.length; i++) {
          let sum = 0;
          for (let j = 0; j < this.itemStill[i].itemService.length; j++) {
            // tslint:disable-next-line:radix
            sum += parseInt(this.itemStill[i].itemService[j].itemServicePrice) * this.itemStill[i].itemService[j].quantity;
          }
          this.priceItemStill[i] = sum;
        }
        console.log('priceItemStill: ', this.priceItemStill);

        // set price in cart expired
        for (let i = 0; i < this.itemExpired.length; i++) {
          let sum = 0;
          for (let j = 0; j < this.itemExpired[i].itemService.length; j++) {
            // tslint:disable-next-line:radix
            sum += parseInt(this.itemExpired[i].itemService[j].itemServicePrice) * this.itemExpired[i].itemService[j].quantity;
          }
          this.priceItemExpired[i] = sum;
        }
        console.log('priceItemExpired: ', this.priceItemExpired);

    });


  }

  addQuantity(indexItemStill, indexItemService) {

    const quantity = this.itemStill[indexItemStill].itemService[indexItemService].quantity;
    console.log(quantity);
    if (quantity === 0) {
     // console.log(this.priceItemStill[indexItemStill]);
      const priceItem = this.priceItemStill[indexItemStill] * quantity;
      this.itemStill[indexItemStill].itemService[indexItemService].quantity += 1;
     // console.log(this.priceItemStill[indexItemStill]);
      this.priceItemStill[indexItemStill] += priceItem;
      this.updateCart(indexItemStill);
      if (this.priceTotal !== 0) {
        this.priceTotal += priceItem;
      }
    } else {
      const priceItem = this.priceItemStill[indexItemStill] / quantity;
      this.itemStill[indexItemStill].itemService[indexItemService].quantity += 1;
      this.priceItemStill[indexItemStill] += priceItem;
      this.updateCart(indexItemStill);
      if (this.priceTotal !== 0) {
        this.priceTotal += priceItem;
      }
    }

  }

  subtractQuantity(indexItemStill, indexItemService) {
    const quantity = this.itemStill[indexItemStill].itemService[indexItemService].quantity;

    if (quantity === 0) {
      const priceItem = this.priceItemStill[indexItemStill] * quantity;
      this.itemStill[indexItemStill].itemService[indexItemService].quantity -= 1;
      this.priceItemStill[indexItemStill] -= priceItem;
      this.updateCart(indexItemStill);
      if (this.priceTotal !== 0) {
        this.priceTotal -= priceItem;
      }
    } else {
      const priceItem = this.priceItemStill[indexItemStill] / quantity;
      this.itemStill[indexItemStill].itemService[indexItemService].quantity -= 1;
      this.priceItemStill[indexItemStill] -= priceItem;
      this.updateCart(indexItemStill);
      if (this.priceTotal !== 0) {
        this.priceTotal -= priceItem;
      }
    }
  }

  deleteServiceExpired() {
    const arrId: Array<string> = [];
    for (const item of this.itemExpired) {
      arrId.push(item.id);
    }
    // if (arrId.length > 0) {
      Swal.fire({
        title: 'Xóa hết những đơn hàng hết hạn?',
        icon: 'question',
        showCancelButton: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.cartService.deleteCart(arrId).subscribe((res) => {
            Swal.fire({
              title: 'Đã xóa tất cả những đơn hàng đã chọn',
              icon: 'success'
            }).then(() => {
              this._document.defaultView.location.reload();
            });
          });
        } else {}
      });
    // } else {
    //   Swal.fire({
    //     title: 'Bạn chưa lựa chọn đơn hàng nào!',
    //     icon: 'error'
    //   });
    // }


  }

  deleteServiceIsSelected() {
    const arrId: Array<string> = [];
    for (let i = 0; i < this.allComplete.length ; i++) {
      if (this.allComplete[i] === true) {
        arrId.push(this.itemStill[i].id);
      }
    }
    if (arrId.length > 0) {
      Swal.fire({
        title: 'Xóa hết những đơn hàng đã chọn?',
        icon: 'question',
        showCancelButton: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.cartService.deleteCart(arrId).subscribe((res) => {
            Swal.fire({
              title: 'Đã xóa tất cả những đơn hàng đã chọn',
              icon: 'success'
            }).then(() => {
              this._document.defaultView.location.reload();
            });
          });
        } else {}
      });
    } else {
      Swal.fire({
        title: 'Bạn chưa lựa chọn đơn hàng nào!',
        icon: 'error'
      });
    }

    // this.cartService.deleteCart(arrId);
  }

  deleteOne(id: string) {
    const arrId: Array<string> = [id];
    // this.cartService.deleteCart(arrId);
    Swal.fire({
      title: 'Xóa đơn hàng?',
      icon: 'question',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.deleteCart(arrId).subscribe((res) => {
          Swal.fire({
            title: 'Đã xóa đơn hàng đã chọn',
            icon: 'success'
          }).then(() => {
            this._document.defaultView.location.reload();
          });
        });
      } else {}
    });
  }

  updateCart(index) {
    // console.log(this.carts[index]);
    const cartData = this.cartService.updateCart(
      this.carts[index].id,
      this.carts[index].nameTicket,
      this.carts[index].imageTicket,
      this.carts[index].dateStart,
      this.carts[index].dateEnd,
      this.carts[index].idTicket,
      this.carts[index].idCreator,
      this.carts[index].idCustomer,
      this.carts[index].itemService
    );
  }

  payCart() {
    const arrId: Array<string> = [];
    for (let i = 0; i < this.allComplete.length ; i++) {
      if (this.allComplete[i] === true) {
        arrId.push(this.itemStill[i].id);
      }
    }
    if (arrId.length > 0) {
      Swal.fire({
        title: 'Bạn muốn thanh toán những đơn hàng đã chọn?',
        icon: 'question'}).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['pay', arrId.join()]);
          } else {}
        });
    } else {
      Swal.fire({
        title: 'Bạn chưa lựa chọn đơn hàng nào để thanh toán!',
        icon: 'error'
      });
    }
    // console.log(arrId.join());

  }



  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
    this.cartListenerSubs.unsubscribe();
  }

}
