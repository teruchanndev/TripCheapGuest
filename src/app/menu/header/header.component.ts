import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/modals/user.model';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth_customer.service';
// import { AuthService } from '../../services/auth.service';
import { MenuService } from '../../services/menu.service';
import { CartsService } from 'src/app/services/cart.service';
import { Cart } from 'src/app/modals/cart.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private authListenerSubs: Subscription;
  private cartListenerSubs: Subscription;
  userIsAuthenticated = false;
  valueSidebar = false;

  isExpanded = true;
  showSubmenu = false;
  isShowing = false;
  showSubSubMenu = false;
  customerId: string;
  username: string;
  countCart = 0;
  user: User;
  cart: Cart[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    public route: ActivatedRoute,
    public cartService: CartsService
    ) {}


  ngOnInit(): void {
    this.authService.autoAuthCustomer();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.customerId = this.authService.getCustomerId();
    this.username = this.authService.getUsername();

    // console.log(this.customerId);
    // console.log(this.username);
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
    });

    if(this.userIsAuthenticated) {
      this.cartService.getCountCart().subscribe(
        countData => {
          this.countCart = countData.countCart;
      });
  
      this.cartService.getCarts();
      this.cartListenerSubs = this.cartService.getCartUpdateListener()
        .subscribe((cart: Cart[]) => {
          this.cart = cart;
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
    if(this.userIsAuthenticated) {
      this.router.navigate(['/cart']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  showChild(childPath) {
    this.router.navigate(['home', childPath]);
  }

  ngOnDestroy(): void {
    if(this.userIsAuthenticated) {
      this.authListenerSubs.unsubscribe();
      this.cartListenerSubs.unsubscribe();
    }
    
  }
}
