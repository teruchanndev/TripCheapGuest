import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RatedService } from 'src/app/services/rated.service';
import Swal from 'sweetalert2';
import { Rated } from '../../modals/rated.model';
@Component({
  selector: 'app-rated',
  templateUrl: './rated.component.html',
  styleUrls: ['./rated.component.css']
})
export class RatedComponent implements OnInit {

  @Input() ticketId;
  @Input() creatorId;
  rated: Rated;
  isRated: Array<boolean> = [false, false, false, false, false];
  isShowFormRate = false;
  star_image = ["star", "star", "star", "star", "star"];
  constructor(
    public rateService: RatedService,
    public route: ActivatedRoute,
    private router: Router
  ) { }

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

  ngOnInit(): void {
    // get rate
    this.rateService.getRated(this.ticketId).subscribe(res => {
      // console.log('value check: ', res);
      if(res.rated.idTicket == '') {
        this.rateService.createRated(
          this.ticketId,
          this.creatorId,
          0,
          0,
          []
        ).then(value => {
          this.rated = value as Rated;
          console.log('this.rated 1: ', this.rated);
        })
      } else {
        this.rated = res.rated as Rated;
        this.checkStarIsRate(this.rated.pointRated);
        console.log('this.rated 2: ', this.rated);
      }
    });
  }

  onRate() {
    this.isShowFormRate = true;
  }

  hoverStar(index) {

    for(let i = 0; i < 5; i++) {
      if( i <= index) {
        this.star_image[i] = "star-action";
      } else {
        this.star_image[i] = "star";
      }
    }
  }

  leaveStar() {
    this.star_image = ["star", "star", "star", "star", "star"];
  }

}
