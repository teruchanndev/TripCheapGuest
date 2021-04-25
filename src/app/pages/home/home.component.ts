import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/modals/category.model';
import { Ticket } from 'src/app/modals/ticket.model';
import { CategoriesService } from 'src/app/services/categories.service';
import { TicketsService } from 'src/app/services/tickets.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  isShowSearchResult = false;
  tickets: Ticket[] = [];
  ticketShowSearch: Ticket[] = [];
  ticketSpecial: Ticket[] = [];
  categories: Category[] = [];
  city = ['Đà Nẵng', 'Hà Nội', 'Nha Trang', 'TP Hồ Chí Minh', 'Phú Quốc', 'Đà Lạt', 'Hội An', 'Vũng Tàu', 'SaPa', 'Huế'];
  srcImage = ['../../../assets/images/đanang.webp', '../../../assets/images/hanoi.webp', '../../../assets/images/nhatrang.webp',
  '../../../assets/images/tpHCM.webp', '../../../assets/images/phuquoc.webp', '../../../assets/images/đalat.webp',
  '../../../assets/images/hoian.webp', '../../../assets/images/vungtau.webp', '../../../assets/images/sapa.webp', '../../../assets/images/hue.webp'];
  private categorySub: Subscription;
  private ticketSub: Subscription;
  constructor(
    public ticketsService: TicketsService,
    public categoryService: CategoriesService,
    private router: Router
  ) { }

  ngOnInit(): void {
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
  }

}
