import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Cart } from 'src/app/modals/cart.modal';
import { Ticket } from 'src/app/modals/ticket.model';
import { AuthService } from 'src/app/services/auth_customer.service';
import { TicketsService } from 'src/app/services/tickets.service';
import { StringLiteralLike } from 'typescript';


@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.css']
})
export class TicketDetailComponent implements OnInit, OnDestroy {

  ticket: Ticket;
  private ticketId: string;
  imageObject: Array<Object> = [];
  productSelect: Array<Cart> = [];
  showInfoServiceItem = false;
  index = 0;
  quantity = 0;

  private authListenerSubs: Subscription;
  customerIsAuthenticated = false;


  constructor(
    public ticketsService: TicketsService,
    public route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
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
        }
        // console.log(this.imageObject);
        // console.log(this.ticket);
      });
    });
  }

  showInfoService(index) {
    this.index = index;
    this.showInfoServiceItem = true;
  }

  AddCart() {
    if (!this.customerIsAuthenticated) {
      this.router.navigate(['/signup']);
    }
  }


  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

}


