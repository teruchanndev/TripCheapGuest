import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Cart } from 'src/app/modals/cart.model';
import { AuthService } from 'src/app/services/auth_customer.service';
import { CartsService } from 'src/app/services/cart.service';

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

  constructor(
    public cartService: CartsService,
    public route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {

    this.formInfo = this._formBuilder.group({
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required]
    });
    this.formPay = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
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
  }

}
