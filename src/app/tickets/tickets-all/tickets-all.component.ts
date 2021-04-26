import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { element } from 'protractor';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/modals/category.model';
import { City } from 'src/app/modals/city.model';
import { Ticket } from 'src/app/modals/ticket.model';
import { CategoriesService } from 'src/app/services/categories.service';
import { CitiesService } from 'src/app/services/cities.service';
import { TicketsService } from 'src/app/services/tickets.service';

@Component({
  selector: 'app-tickets-all',
  templateUrl: './tickets-all.component.html',
  styleUrls: ['./tickets-all.component.css']
})
export class TicketsAllComponent implements OnInit, OnDestroy {

  tickets: Ticket[] = [];
  categories: Category[] = [];
  currentItemsToShow = [];
  checkSelect: Array<boolean> = [];
  city: City[] = [];
  ischeckAll = true;
  private ticketsSub: Subscription;
  private categorySub: Subscription;
  private citySub: Subscription;
  nameCity: string;
  imageCity: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(
    public ticketsService: TicketsService,
    private router: Router,
    public categoryService: CategoriesService,
    public citiesService: CitiesService,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    var tickets = new Promise((resolve, reject) => {
      this.route.paramMap.subscribe((paramMap: ParamMap) => {
        this.nameCity = paramMap.get('city');
        this.ticketsService.getTicketOfCity(this.nameCity);
        this.ticketsSub = this.ticketsService.getTicketUpdateListener()
          .subscribe((ticket: Ticket[]) => {
            resolve(ticket);
          });
      });
    });
    var categories = new Promise((resolve, reject) => {
      this.categoryService.getCategories();
      this.categorySub = this.categoryService.getCategoryUpdateListener()
        .subscribe((category: Category[]) => {
          resolve(category);
        });
    });

    var city = new Promise((resolve, reject) => {
      this.citiesService.getCities();
      this.citySub = this.citiesService.getCityUpdateListener()
        .subscribe((city: City[]) => {
          resolve(city);
        });
    });

    Promise.all([tickets, categories, city]).then(values => {
      console.log(values);
      this.currentItemsToShow = values[0] as Array<Ticket>;
      this.tickets = values[0] as Array<Ticket>;
      this.categories = values[1] as Array<Category>;
        for (let i = 0; i < this.categories.length; i++) {
          this.checkSelect[i] = false;
        }
      this.city = values[2] as Array<City>;
        for (let i = 0; i < this.city.length; i++) {
          this.checkSelect[i] = false;
        }
      this.imageCity = this.city.filter(element => element.name === this.nameCity)[0].image;
    }); 
  }

  detailTicket(ticketId) {
    this.router.navigate(['detail/' + ticketId]);
  }

  onPageChange($event) {
    this.currentItemsToShow =  this.tickets.slice($event.pageIndex * $event.pageSize,
                              $event.pageIndex * $event.pageSize + $event.pageSize);
  }

  checkCategory(index) {
    if (!this.checkSelect[index]) {
      this.checkSelect[index] = true;
    } else { this.checkSelect[index] = false; }

    for (const item of this.checkSelect) {
      if (item) {this.ischeckAll = false; break; } else {
        this.ischeckAll = true; }
    }
    if (!this.ischeckAll) {
      this.currentItemsToShow = [];
      for (let i = 0; i < this.checkSelect.length; i++) {
        if (this.checkSelect[i]) {
          const category = this.categories[i].name;
          console.log(category);
          this.currentItemsToShow = this.currentItemsToShow.concat(this.tickets.filter(element => element.category === category));
        }
      }
    } else {
      this.checkAll();
    }

  }

  checkAll() {
    this.currentItemsToShow = this.tickets;
  }

  ngOnDestroy(): void {
    this.ticketsSub.unsubscribe();
    this.categorySub.unsubscribe();
    this.citySub.unsubscribe();
  }

}
