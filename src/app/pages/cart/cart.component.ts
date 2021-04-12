import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Cart } from 'src/app/modals/cart.model';
import { ServiceSelect } from 'src/app/modals/serviceSelect.model';
import { AuthService } from 'src/app/services/auth_customer.service';
import { CartsService } from 'src/app/services/cart.service';


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
    private authService: AuthService,
    private router: Router,
    public route: ActivatedRoute,
    public cartService: CartsService
  ) { }

  setAll(completed: boolean) {
    if(completed) {
      for(let i = 0; i < this.allComplete.length ; i++) {
        this.allComplete[i] = true;
        this.priceTotal += this.priceItemStill[i];
      }
      this.countServiceSelect = this.allComplete.length;
    } else {
      for(let i = 0; i < this.allComplete.length ; i++) {
        this.allComplete[i] = false;
        this.priceTotal -= this.priceItemStill[i];
      }
      this.countServiceSelect = 0;
    }
  }

  setSome(completed: boolean, i) {
    if(completed) {
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
    let dateCheck = date1.split('/');
    const dateNow = new Date();
    console.log('check: ' + dateNow.getDate());
    if(dateCheck[2] > dateNow.getFullYear()) { return 1;} 
    else if(dateCheck[2] < dateNow.getFullYear()) { return -1;}
    else {
      if(dateCheck[1] > dateNow.getMonth() + 1) { return 1;} 
      else if(dateCheck[1] < dateNow.getMonth() + 1) {return -1;}
      else {
        if(dateCheck[0] > dateNow.getDate()) {return 1;}
        else if(dateCheck[0]<dateNow.getDate()) { return -1;}
        else return 0;
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
        this.carts.sort(function(b,a){
          let x = a.dateEnd.split('/');
          let y = b.dateEnd.split('/');
          if(x[2] > y[2]) { return 1;} 
          else if(x[2] < y[2]) { return -1;}
          else {
            if(x[1] > y[1]) { return 1;} 
            else if(x[1] < y[1]) {return -1;}
            else {
              if(x[0] > y[0]) {return 1;}
              else if(x[0]<y[0]) { return -1;}
              else return 0;
            }
          }
        });

        //set value in cart
        this.itemExpired = this.carts.filter(item => this.checkCompareDate(item.dateEnd) === -1);
        this.itemStill = this.carts.filter(item => this.checkCompareDate(item.dateEnd) > -1);

        //set init input check false
        for(let i = 0; i < this.itemStill.length;i++) {
          this.allComplete[i] = false;
        }

        //set price in cart still
        for(let i = 0;i< this.itemStill.length; i++) {
          let sum = 0;
          for(let j = 0; j < this.itemStill[i].itemService.length; j++) {
            sum += parseInt(this.itemStill[i].itemService[j].itemServicePrice)*this.itemStill[i].itemService[j].quantity;
          }
          this.priceItemStill[i] = sum;
        };

        //set price in cart expired
        for(let i = 0;i< this.itemExpired.length; i++) {
          let sum = 0;
          for(let j = 0; j < this.itemExpired[i].itemService.length; j++) {
            sum += parseInt(this.itemExpired[i].itemService[j].itemServicePrice)*this.itemExpired[i].itemService[j].quantity;
          }
          this.priceItemExpired[i] = sum;
        };

    });
    

  }

  addQuantity(indexItemStill, indexItemService) {
    
    let quantity = this.itemStill[indexItemStill].itemService[indexItemService].quantity;
    let priceItem = this.priceItemStill[indexItemStill]/quantity;

    this.itemStill[indexItemStill].itemService[indexItemService].quantity += 1;
    this.priceItemStill[indexItemStill] += priceItem;
    if(this.priceTotal !== 0) {
      this.priceTotal += priceItem;
    }
  }

  subtractQuantity(indexItemStill, indexItemService) {
    let quantity = this.itemStill[indexItemStill].itemService[indexItemService].quantity;
    let priceItem = this.priceItemStill[indexItemStill]/quantity;

    this.itemStill[indexItemStill].itemService[indexItemService].quantity -= 1;
    this.priceItemStill[indexItemStill] -= priceItem;
    if(this.priceTotal !== 0) {
      this.priceTotal -= priceItem;
    }
  }

  deleteServiceExpired() {
    let arrId: Array<string> = [];
    for(let item of this.itemExpired) {
      arrId.push(item.id);
    }
    this.cartService.deleteCart(arrId);
  }

  deleteServiceIsSelected() {
    let arrId: Array<string> = [];
    for(let i = 0; i< this.allComplete.length ; i++) {
      if(this.allComplete[i] === true) {
        arrId.push(this.itemStill[i].id);
      }
    }
    this.cartService.deleteCart(arrId);
  }

  deleteOne(id: string) {
    let arrId: Array<string> = [id];
    this.cartService.deleteCart(arrId);
  }



  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
    this.cartListenerSubs.unsubscribe();
  }

}
