import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Order } from 'src/app/modals/order.model';
import { AuthService } from 'src/app/services/auth_customer.service';
import { OrdersService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  private authListenerSubs: Subscription;
  private orderListenerSubs: Subscription;

  userIsAuthenticated = false;
  customerId: string;
  username: string;

  orders: Array<Order> = [];

  constructor(
    private authService: AuthService,
    public orderService: OrdersService,
    private router: Router,
    public route: ActivatedRoute,
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

    this.orderService.getOrderOfCustomer();
    this.orderListenerSubs = this.orderService.getOrderUpdateListener()
      .subscribe((order: Order[]) => {
        this.orders = order;
      });
  }

}
