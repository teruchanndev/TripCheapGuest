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
  categories: Category[] = [];
  srcCategory = ['../../../assets/icon/location.svg', '../../../assets/icon/ticket.svg', '../../../assets/icon/sunset.svg',
  '../../../assets/icon/sunbed.svg', '../../../assets/icon/baggage.svg' ];
  private categorySub: Subscription;
  private ticketSub: Subscription;
  private citySub: Subscription;
  constructor(
    public ticketsService: TicketsService,
    public categoryService: CategoriesService,
    public citiesService: CitiesService,
    private router: Router,
    @Inject(DOCUMENT) private _document: Document,
  ) { }

  ngOnInit(): void {
    // this._document.defaultView.location.reload();
    this.categoryService.getCategories();
    this.categorySub = this.categoryService.getCategoryUpdateListener()
      .subscribe((category: Category[]) => {
        this.categories = category;
      });
    this.ticketsService.getAll();
    this.ticketSub = this.ticketsService.getTicketUpdateListener()
      .subscribe((ticket: Ticket[]) => {
        this.tickets = ticket;
        for (let i = 0; i < 3; i++) {
          this.ticketShowSearch.push(ticket[i]);
        }
        for (let i = 0; i < 9; i++) {
          this.ticketSpecial.push(ticket[i]);
        }
      });
    this.citiesService.getCities();
    this.citySub = this.citiesService.getCityUpdateListener()
      .subscribe((city: City[]) => {
        this.city = city;
      });
  }
  scollLeft() {
    // document.getElementById('list-city').style.backgroundColor = "red";
    const x = document.getElementById('list-city').scrollLeft += 200;
    console.log(x);
  }

  searchResult() {
    if (this.isShowSearchResult) {
      this.isShowSearchResult = false;
    } else { this.isShowSearchResult = true; }

  }

  detailCategory(nameCategory) {
    this.router.navigate(['category/' + nameCategory]);
  }

  detailTicket(ticketId) {
    this.router.navigate(['detail/' + ticketId]);
  }

  navigateCity(nameCity) {
    const city = nameCity;
    this.router.navigate(['city/' + city]);
  }

  onEnter(textSearch) {
    // alert(textSearch);
    this.router.navigate(['search/' + textSearch]);
  }

  ngOnDestroy(): void {
    this.categorySub.unsubscribe();
    this.ticketSub.unsubscribe();
    this.citySub.unsubscribe();
  }

}
