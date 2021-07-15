import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth_customer.service';
import { CartsService } from 'src/app/services/cart.service';
import { Cart } from 'src/app/modals/cart.model';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private authListenerSubs: Subscription;
  private cartListenerSubs: Subscription;
  userIsAuthenticated = false;

  customerId: string;
  username: string;
  countCart = 0;
  cart: Cart[] = [];
  characterAvt: string;

  isShowCart = false;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    public route: ActivatedRoute,
    public cartService: CartsService,
    public customerService: CustomerService
    ) {}


  ngOnInit(): void {
    this.authService.autoAuthCustomer();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.customerId = this.authService.getCustomerId();
    this.isLoading = this.authService.isLoading;
    console.log('this.isLoading ',this.isLoading);

    if(this.isLoading) {
      console.log('this.isLoading ngOnInit ',this.isLoading);
      this.ngOnInit();
    }

    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
    });

    if (this.userIsAuthenticated) {
      this.characterAvt = localStorage.getItem("customerName")[0].toUpperCase();
      this.username = localStorage.getItem("customerName");
    }

    if (this.userIsAuthenticated) {
      const countCart = new Promise((resolve) => {
        this.cartService.getCountCart().subscribe(
          countData => {
            resolve(countData.countCart);
        });
      });

      const cartList = new Promise((resolve) => {
        this.cartService.getCarts();
        this.cartListenerSubs = this.cartService.getCartUpdateListener()
          .subscribe((cart: Cart[]) => {
            resolve(cart);
        });
      });
      
      Promise.all([countCart, cartList]).then((values) => {
        console.log('value',values);
        this.countCart = values[0] as number;
        this.cart = values[1] as Cart[];
      });
    } else {
      this.countCart = 0;
      this.cart = [];
    }
  }

  onLogout() {
    this.authService.logout();
  }

  navigateCart() {
    if (this.userIsAuthenticated) {
      this.router.navigate(['/cart']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  showCart($event) {
    this.isShowCart = $event.type === 'mouseover' ? true : false;
  }

  ngOnDestroy(): void {
    if (this.userIsAuthenticated) {
      this.authListenerSubs.unsubscribe();
      this.cartListenerSubs.unsubscribe();
    }

  }
}
