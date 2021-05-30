import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {

  @Input() city;
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  navigateCity(nameCity) {
    const city = nameCity;
    this.router.navigate(['city/' + city]);
  }

}
