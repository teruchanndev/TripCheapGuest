import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Cart } from 'src/app/modals/cart.model';
import { Ticket } from 'src/app/modals/ticket.model';
import { AuthService } from 'src/app/services/auth_customer.service';
import { TicketsService } from 'src/app/services/tickets.service';
import { StringLiteralLike } from 'typescript';
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
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.css'],
  providers: [{
    provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
    useClass: FiveDayRangeSelectionStrategy
  }]
})
export class TicketDetailComponent implements OnInit, OnDestroy {

  ticket: Ticket;
  private ticketId: string;
  imageObject: Array<Object> = [];
  cart: Cart;
  showInfoServiceItem = false;
  index = 0;
  dateStartChoose: string;
  dateEndChoose: string;
  customerId: string;

  listItemService: Array<ServiceSelect> = [];
 

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  form: FormGroup;



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
      console.log(paramMap);
      this.ticketId = paramMap.get('ticketId');
      this.ticketsService.getTicket(this.ticketId).subscribe(ticketData => {
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
        for (let i = 0; i < this.ticket.imagePath.length; i++) {
          this.imageObject[i] = {
            image : this.ticket.imagePath[i],
            thumbImage: this.ticket.imagePath[i]
          };
        }
      });
    });
  }

  formatDate(date) {
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
  }

  showInfoService(index) {
    this.index = index;
    this.listItemService = [];
    this.dateStartChoose = '';
    this.dateEndChoose = '';
    this.showInfoServiceItem = true;

    const lenService = Object.keys(this.ticket.services[0][this.index].itemService).length;
    for (let i = 0; i < lenService; i++) {
      this.listItemService[i] = {
        name: this.ticket.services[0][this.index].name,
        itemServiceName: this.ticket.services[0][this.index].itemService[i].name,
        itemServicePrice: this.ticket.services[0][this.index].itemService[i].price,
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
      id: null,
      nameTicket: this.ticket.title,
      imageTicket: this.ticket.imagePath[0],
      itemService: this.listItemService.filter(item => item.quantity > 0 ),
      dateStart: this.dateStartChoose,
      dateEnd: this.dateEndChoose,
      idTicket: this.ticket.id,
      idCreator: this.ticket.creator,
      idCustomer: this.customerId
      };
    const cartData = this.cartService.addCart(
      this.cart.nameTicket,
      this.cart.imageTicket,
      this.cart.dateStart,
      this.cart.dateEnd,
      this.cart.idTicket,
      this.cart.idCreator,
      this.cart.idCustomer,
      this.cart.itemService
    );

      console.log(this.cart);
    }
  }


  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

}


