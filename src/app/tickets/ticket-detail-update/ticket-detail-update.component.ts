import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Cart } from 'src/app/modals/cart.model';
import { Ticket } from 'src/app/modals/ticket.model';
import { AuthService } from 'src/app/services/auth_customer.service';
import { TicketsService } from 'src/app/services/tickets.service';
import {DateAdapter} from '@angular/material/core';
import {
  MatDateRangeSelectionStrategy,
  DateRange,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
} from '@angular/material/datepicker';
import { CartsService } from 'src/app/services/cart.service';
import { ServiceSelect } from 'src/app/modals/serviceSelect.model';

@Injectable()
export class FiveDayRangeSelectionStrategy<D> implements MatDateRangeSelectionStrategy<D> {
  constructor(private _dateAdapter: DateAdapter<D>) {}

  selectionFinished(date: D | null): DateRange<D> {
    return this._createFiveDayRange(date);
  }

  createPreview(activeDate: D | null): DateRange<D> {
    return this._createFiveDayRange(activeDate);
  }

  private _createFiveDayRange(date: D | null): DateRange<D> {
    if (date) {
      const start = this._dateAdapter.addCalendarDays(date, -2);
      const end = this._dateAdapter.addCalendarDays(date, 2);
      return new DateRange<D>(start, end);
    }
    return new DateRange<D>(null, null);
  }
}

@Component({
  selector: 'app-ticket-detail-update',
  templateUrl: './ticket-detail-update.component.html',
  styleUrls: ['./ticket-detail-update.component.css'],
  providers: [{
    provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
    useClass: FiveDayRangeSelectionStrategy
  }]
})
export class TicketDetailUpdateComponent implements OnInit {

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  form: FormGroup;

  ticket: Ticket;
  private idCart: string;
  private idTicket: string;
  nameServiceSelect: string;
  imageObject: Array<Object> = [];
  cart: Cart;
  showInfoServiceItem = false;
  index = 0;
  dateStartChoose: string;
  dateEndChoose: string;
  customerId: string;

  listItemService: Array<ServiceSelect> = [];
  private authListenerSubs: Subscription;
  customerIsAuthenticated = false;


  constructor(
    public ticketsService: TicketsService,
    public cartService: CartsService,
    public route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.autoAuthCustomer();
    this.form = new FormGroup({
      quantity: new FormControl(),
      dateStart: new FormControl(),
      dateEnd: new FormControl()
    });

    this.customerIsAuthenticated = this.authService.getIsAuth();
    this.customerId = this.authService.getCustomerId();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.customerIsAuthenticated = isAuthenticated;
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.idCart = paramMap.get('idCart');
      this.cartService.getOneCart(this.idCart).subscribe( cartData => {
        this.cart = {
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
        this.idTicket = cartData.idTicket;
        this.nameServiceSelect = cartData.itemService[0].name;
        console.log(this.nameServiceSelect);
      });

      // const app = this;
      setTimeout(() => {
        this.ticketsService.getTicket(this.idTicket)
          .subscribe(ticketData => {
            this.ticket = {
              id: ticketData._id,
              title: ticketData.title,
              content: ticketData.content,
              status: ticketData.status,
              price: ticketData.price,
              city: ticketData.city,
              category: ticketData.category,
              categoryService: ticketData.categoryService,
              percent: ticketData.percent,
              price_reduce: ticketData.price_reduce,
              quantity: ticketData.quantity,
              address: ticketData.address,
              services: ticketData.services,
              imagePath: ticketData.imagePath,
              creator: ticketData.creator
          };
          console.log(this.ticket);
          for (let i = 0; i < this.ticket.imagePath.length; i++) {
            this.imageObject[i] = {
              image : this.ticket.imagePath[i],
              thumbImage: this.ticket.imagePath[i]
            };
          }
          // const len = Object.keys(this.ticket.services[0]).length;
          for (let i = 0; i < this.ticket.services.length ; i++) {
            if (this.ticket.services[i].name === this.nameServiceSelect) {
              console.log(this.ticket.services[i].name);
              this.index = i;
            }
          }
          console.log('index: ' + this.index);
          this.setValue(this.index);
          this.showInfoService(this.index);
          // tslint:disable-next-line:max-line-length
          const dateStartCover = this.cart.dateStart.split('/')[1] + '/' + this.cart.dateStart.split('/')[0] + '/' + this.cart.dateStart.split('/')[2];
          // tslint:disable-next-line:max-line-length
          const dateEndCover = this.cart.dateEnd.split('/')[1] + '/' + this.cart.dateEnd.split('/')[0] + '/' + this.cart.dateEnd.split('/')[2];
          console.log(dateStartCover);

          const dateSt = new Date(dateStartCover);
          const dateSp = new Date(dateEndCover);
          console.log(dateSp);
          console.log(this.cart.dateStart);
          this.form.setValue({
            quantity: '',
            dateStart: dateSt,
            dateEnd: dateSp
          });
        });

      }, 2000);
    });
  }


  formatDate(date) {
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
  }

  setValue(index) {
    // const lenService = Object.keys(this.ticket.services[0][this.index].itemService).length;
    for (let i = 0; i < this.ticket.services[this.index].itemService.length; i++) {
      this.listItemService[i] = {
        name: this.ticket.services[this.index].name,
        itemServiceName: this.ticket.services[this.index].itemService[i].name,
        itemServicePrice: this.ticket.services[this.index].itemService[i].price,
        quantity: this.cart.itemService[i].quantity
      };
    }
  }
  showInfoService(index) {
    this.index = index;
    this.listItemService = [];
    this.dateStartChoose = '';
    this.dateEndChoose = '';
    this.showInfoServiceItem = true;

    // const lenService = Object.keys(this.ticket.services[0][this.index].itemService).length;
    for (let i = 0; i < this.ticket.services[index].itemService.length; i++) {
      this.listItemService[i] = {
        name: this.ticket.services[index].name,
        itemServiceName: this.ticket.services[index].itemService[i].name,
        // tslint:disable-next-line:radix
        itemServicePrice: this.ticket.services[index].itemService[i].price,
        quantity: 0
      };
    }
  }

  getDate() {
    this.dateStartChoose = this.formatDate(this.form.value.dateStart);
    this.dateEndChoose = this.formatDate(this.form.value.dateEnd);
  }

  AddCart() {
    if (!this.customerIsAuthenticated) {
      this.router.navigate(['/signup']);
   } else {
    this.cart = {
      id: this.cart.id,
      nameTicket: this.ticket.title,
      imageTicket: this.ticket.imagePath[0],
      itemService: this.listItemService.filter(item => item.quantity > 0 ),
      dateStart: this.dateStartChoose,
      dateEnd: this.dateEndChoose,
      idTicket: this.ticket.id,
      idCreator: this.ticket.creator,
      idCustomer: this.customerId
      };
    console.log(this.cart);
    const cartData = this.cartService.updateCart(
      this.cart.id,
      this.cart.nameTicket,
      this.cart.imageTicket,
      this.cart.dateStart,
      this.cart.dateEnd,
      this.cart.idTicket,
      this.cart.idCreator,
      this.cart.idCustomer,
      this.cart.itemService
    );

      // console.log(this.cart);
    }
  }


  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }
}
