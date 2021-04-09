import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Ticket } from 'src/app/modals/ticket.model';
import { TicketsService } from 'src/app/services/tickets.service';

@Component({
  selector: 'app-tickets-all',
  templateUrl: './tickets-all.component.html',
  styleUrls: ['./tickets-all.component.css']
})
export class TicketsAllComponent implements OnInit, OnDestroy {

  tickets: Ticket[] = [];
  private ticketsSub: Subscription;

  constructor(
    public ticketsService: TicketsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.ticketsService.getAll();
    this.ticketsSub = this.ticketsService.getTicketUpdateListener()
      .subscribe((ticket: Ticket[]) => {
        this.tickets = ticket;
        console.log('get ticket: ' + ticket);
      });
  }
  detailTicket(ticketId) {
    this.router.navigate(['detail/' + ticketId]);
  }

  ngOnDestroy(): void {
    this.ticketsSub.unsubscribe();
  }

}
