import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Cart } from 'src/app/modals/cart.modal';
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
  cart: Cart[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    public route: ActivatedRoute,
    public cartService: CartsService
  ) { }

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
        this.cart = cart;
    });

  }


  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
    this.cartListenerSubs.unsubscribe();
  }

}
