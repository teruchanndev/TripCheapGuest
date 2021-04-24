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
  categories: Category[] = [];
  city = ['Đà Nẵng', 'Hà Nội', 'Nha Trang', 'TP Hồ Chí Minh', 'Phú Quốc', 'Đà Lạt', 'Hội An', 'Vũng Tàu', 'SaPa', 'Huế'];
  private categorySub: Subscription;
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
  }

  scollLeft() {
    // document.getElementById('list-city').style.backgroundColor = "red";
    const x = document.getElementById('list-city').scrollLeft = 200;
    console.log(x);
  }

  searchResult() {
    document.getElementById('input-search').click();
  }


  navigateCity(nameCity) {
    let city = nameCity;
    this.router.navigate(['city/' + city]);
  }

  ngOnDestroy(): void {
    this.categorySub.unsubscribe();
  }

}
