import { Component, Input, OnInit } from '@angular/core';
import { Rated } from 'src/app/modals/rated.model';
import { RatedService } from 'src/app/services/rated.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {

  @Input() width;
  @Input() height;
  // @Input() point;
  @Input() ticketId;

  isRated: Array<boolean> = [false, false, false, false, false];
  rated: Rated;
  constructor(
    public rateService: RatedService,
  ) { }

  ngOnInit(): void {

    this.rateService.getRated(this.ticketId).subscribe(res => {
      if(res.rated == null) {
        this.checkStarIsRate(0);
      } else {
        this.rated = res.rated as Rated;
        this.checkStarIsRate(this.rated.pointRated);
      }
    });
  }

  checkStarIsRate(point) {
    if(point > 4){
      this.isRated = [true, true, true, true, true];
    }
    else if(point > 0 && point <= 1) {
      this.isRated = [true, false, false, false, false];
    }
    else if(point > 1 && point <= 2) {
      this.isRated = [true, true, false, false, false];
    }
    else if(point > 2 && point <= 3) {
      this.isRated = [true, true, true, false, false];
    }
    else if(point > 3 && point <= 4) {
      this.isRated = [true, true, true, true, false];
    }
  }

}
