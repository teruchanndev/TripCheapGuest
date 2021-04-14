import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/modals/category.model';
import { Ticket } from 'src/app/modals/ticket.model';
import { CategoriesService } from 'src/app/services/categories.service';
import { TicketsService } from 'src/app/services/tickets.service';

@Component({
  selector: 'app-tickets-all',
  templateUrl: './tickets-all.component.html',
  styleUrls: ['./tickets-all.component.css']
})
export class TicketsAllComponent implements OnInit, OnDestroy {

  tickets: Ticket[] = [];
  categories: Category[] = [];
  private ticketsSub: Subscription;
  private categorySub: Subscription;
  nameCity: string;
  constructor(
    public ticketsService: TicketsService,
    private router: Router,
    public categoryService: CategoriesService,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.nameCity = paramMap.get('city');
      this.ticketsService.getTicketOfCity(this.nameCity);
      this.ticketsSub = this.ticketsService.getTicketUpdateListener()
        .subscribe((ticket: Ticket[]) => {
          this.tickets = ticket;
        });
    });
    this.categoryService.getCategories();
    this.categorySub = this.categoryService.getCategoryUpdateListener()
      .subscribe((category: Category[]) => {
        this.categories = category;
      });
  }
  detailTicket(ticketId) {
    this.router.navigate(['detail/' + ticketId]);
  }

  ngOnDestroy(): void {
    this.ticketsSub.unsubscribe();
    this.categorySub.unsubscribe();
  }

}
