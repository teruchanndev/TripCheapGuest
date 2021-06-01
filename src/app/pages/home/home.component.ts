import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/modals/category.model';
import { City } from 'src/app/modals/city.model';
import { Ticket } from 'src/app/modals/ticket.model';
import { CategoriesService } from 'src/app/services/categories.service';
import { CitiesService } from 'src/app/services/cities.service';
import { TicketsService } from 'src/app/services/tickets.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  isShowSearchResult = false;
  tickets: Ticket[] = [];
  city: City[] = [];
  ticketShowSearch: Ticket[] = [];
  ticketSpecial: Ticket[] = [];
  ticketHightRating: Ticket[] = [];
  categories: Category[] = [];
  srcCategory = [
    '../../../assets/icon/location.svg', 
    '../../../assets/icon/ticket.svg', 
    '../../../assets/icon/sunset.svg',
    '../../../assets/icon/sunbed.svg', 
    '../../../assets/icon/baggage.svg' ];

  private categorySub: Subscription;
  private ticketSub: Subscription;
  constructor(
    public ticketsService: TicketsService,
    public categoryService: CategoriesService,
    public citiesService: CitiesService,
    private router: Router,
    @Inject(DOCUMENT) private _document: Document,
  ) { }

  async ngOnInit(): Promise<void> {

    // get category
    const categories = new Promise((resolve) => {
      this.categoryService.getCategories();
      this.categorySub = this.categoryService.getCategoryUpdateListener()
        .subscribe((category: Category[]) => {
          resolve(category);
        });
    });

    const cities = new Promise((resolve) => {
      this.citiesService.getCities().then(res => {
        resolve(res);
      })
    });
    
    // get ticket service
    const tickets = new Promise((resolve) => {
      this.ticketsService.getAll();
      this.ticketSub = this.ticketsService.getTicketUpdateListener()
        .subscribe((ticket: Ticket[]) => {
          resolve(ticket);
        });
    });
    
    // get ticket hight rating
    const ticketHightRate = new Promise((resolve) => {
      this.ticketsService.getTicketHightRating(5).then(ticketsHightRate => {
        resolve(ticketsHightRate);
      })
    });


    Promise.all([categories, tickets, ticketHightRate, cities]).then((res) => {
      this.categories = res[0] as Category[];
      this.tickets = res[1] as Ticket[];
      for (let i = 0; i < 3; i++) {
        this.ticketShowSearch.push(this.tickets[i]);
      }
      for (let i = 0; i < 9; i++) {
        this.ticketSpecial.push(this.tickets[i]);
      }
      this.ticketHightRating = res[2] as Ticket[];
      this.city = res[3] as City[];
    });
    ;
    
    
  }

  searchResult() {
    if (this.isShowSearchResult) {
      this.isShowSearchResult = false;
    } else { this.isShowSearchResult = true; }

  }

  detailCategory(nameCategory) {
    this.router.navigate(['category/' + nameCategory]);
  }
  navigateCity(nameCity) {
    this.router.navigate(['city/' + nameCity]);
  }

  detailTicket(ticketId) {
    this.router.navigate(['detail/' + ticketId]);
  }
  onEnter(textSearch) {
    // alert(textSearch);
    this.router.navigate(['search/' + textSearch]);
  }

  ngOnDestroy(): void {
    this.categorySub.unsubscribe();
    this.ticketSub.unsubscribe();
  }

}
