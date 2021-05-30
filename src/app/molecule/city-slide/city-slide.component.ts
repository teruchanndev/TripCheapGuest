import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-city-slide',
  templateUrl: './city-slide.component.html',
  styleUrls: ['./city-slide.component.css']
})
export class CitySlideComponent implements OnInit {

  @Input() cities;
  @Input() idList;

  constructor() { }

  ngOnInit(): void {
  }

  scrollRight() {
    document.getElementById(this.idList).scrollLeft += 270;
  }

  scrollLeft() {
    document.getElementById(this.idList).scrollLeft -= 270;
  }

}
