import { Component, Input, OnInit } from '@angular/core';
import { City } from 'src/app/modals/city.model';
import { CitiesService } from 'src/app/services/cities.service';

@Component({
  selector: 'app-city-slide',
  templateUrl: './city-slide.component.html',
  styleUrls: ['./city-slide.component.css']
})
export class CitySlideComponent implements OnInit {

  // @Input() cities;
  @Input() idList;
  cities: City[] = [];

  constructor(
    public citiesService: CitiesService,
  ) { }

  async ngOnInit(): Promise<void> {
    //get city 
    await this.citiesService.getCities().then(value => {
      this.cities = value as City[];
    });
  }

  scrollRight() {
    document.getElementById(this.idList).scrollLeft += 270;
  }

  scrollLeft() {
    document.getElementById(this.idList).scrollLeft -= 270;
  }

}
