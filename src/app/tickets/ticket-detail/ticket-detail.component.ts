import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Cart } from 'src/app/modals/cart.modal';
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

export class ServiceSelect {
  name: string;
  itemServiceName: string;
  itemServicePrice: number;
  quantity: number;
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
  productSelect: Array<Cart> = [];
  showInfoServiceItem = false;
  index = 0;
  quantity = 0;

  listItemService: Array<ServiceSelect> = [];

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  form : FormGroup;


  private authListenerSubs: Subscription;
  customerIsAuthenticated = false;


  constructor(
    public ticketsService: TicketsService,
    public route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      quantity: new FormControl()
    });

    this.customerIsAuthenticated = this.authService.getIsAuth();
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
        };

        //insert value in listItemService 
        // const lenService = Object.keys(this.ticket.services[0]).length;
        // let lenList = 0;
        // for(let i = 0; i < lenService; i++) {
        //   for(let j = 0; j < this.ticket.services[0][i].itemService.length; j ++) {
        //     lenList ++;
        //     this.listItemService[lenList] = {
        //       name: this.ticket.services[0][i].name,
        //       itemServiceName: this.ticket.services[0][i].itemService[j].name,
        //       itemServicePrice: this.ticket.services[0][i].itemService[j].price,
        //       quantity: 0
        //     }
        //   } 
        // }

      });
    });
  }

  formatDate(date) {
    return date.getDate() + '/' + date.getMonth() + 1 + '/' + date.getFullYear();
  }

  showInfoService(index) {
    this.index = index;
    this.listItemService = [];
    this.showInfoServiceItem = true;

    const lenService = Object.keys(this.ticket.services[0][this.index].itemService).length;
    for(let i = 0; i < lenService; i++) {
      this.listItemService[i] = {
        name: this.ticket.services[0][this.index].name,
        itemServiceName: this.ticket.services[0][this.index].itemService[i].name,
        itemServicePrice: this.ticket.services[0][this.index].itemService[i].price,
        quantity: 0
      }
    }
  }

  AddCart() {
    if (!this.customerIsAuthenticated) {
      this.router.navigate(['/signup']);
   } else {
      console.log(this.listItemService);
    }
  }


  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

}


