import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Ticket } from 'src/app/modals/ticket.model';
import { TicketsService } from 'src/app/services/tickets.service';

@Component({
  selector: 'app-page-search',
  templateUrl: './page-search.component.html',
  styleUrls: ['./page-search.component.css']
})
export class PageSearchComponent implements OnInit, OnDestroy {

  tickets: Ticket[] = [];
  textSearch;

  private ticketsSub: Subscription;

  constructor(
    public ticketsService: TicketsService,
    private router: Router,
    public route: ActivatedRoute
  ) { }


  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.textSearch = paramMap.get('search');
      this.ticketsService.getTicketOfSearch(this.textSearch);
      this.ticketsSub = this.ticketsService.getTicketUpdateListener()
        .subscribe((ticket: Ticket[]) => {
          this.tickets = ticket;
        });
    });
  }

  detailTicket(ticketId) {
    this.router.navigate(['detail/' + ticketId]);
  }

  ngOnDestroy(): void {
    this.ticketsSub.unsubscribe();
  }

}
