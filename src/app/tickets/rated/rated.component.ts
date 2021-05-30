import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from 'src/app/modals/customer.model';
import { AuthService } from 'src/app/services/auth_customer.service';
import { CustomerService } from 'src/app/services/customer.service';
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
  @Input() idCustomer;

  userIsAuthenticated = false;
  infoCustomer: Customer;
  rated: Rated;
  isRated: Array<boolean> = [false, false, false, false, false];
  isUsedRated = false;
  isShowFormRate = false;
  star_image = ["star", "star", "star", "star", "star"];
  isSelectRated = -1;
  countRated = 0;
  constructor(
    public rateService: RatedService,
    public route: ActivatedRoute,
    private router: Router,
    public customerService: CustomerService,
    private authService: AuthService,
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

    // get User
    this.authService.autoAuthCustomer();
    this.userIsAuthenticated = this.authService.getIsAuth();

    if(this.userIsAuthenticated) {
      this.customerService.getInfoCustomer().then(
        (infoData) => {
          // tslint:disable-next-line:prefer-const
          let info = infoData as Customer;
          this.infoCustomer = {
            username: info.username,
            email: info.email,
            phoneNumber: info.phoneNumber,
            fullName: info.fullName,
            address: info.address
          };
        }
      );
    }

    // get rate
    this.rateService.getRated(this.ticketId).subscribe(res => {
      
      if(res.rated == null) {
        this.rateService.createRated(
          this.ticketId,
          this.creatorId,
          0,
          0,
          []
        ).then(value => {
          this.rated = value as Rated;
          this.countRated = this.rated.countRated;
          // console.log('this.rated 1: ', this.rated);
        })
      } else {
        this.rated = res.rated as Rated;
        this.checkStarIsRate(this.rated.pointRated);
        this.countRated = this.rated.countRated;
        let isUsed = this.rated.listUserRated.find(x => x.idUser == this.idCustomer);
        if(isUsed) {
          this.isUsedRated = true;
        }
        // console.log('this.rated 2: ', this.rated);
      }
    });
  }

  openRated() {
    if(!this.userIsAuthenticated) {
      Swal.fire({
        title: 'Vui lòng đăng nhập để đánh giá vé!',
        icon: 'info',
        showCancelButton: true,
      }).then((value) => {
        if(value.isConfirmed) {
          localStorage.setItem('ticketId',this.ticketId);
          localStorage.setItem('type', 'detailTicket');
          this.router.navigate(['/login']);
        }
      })
    } else {
      this.isShowFormRate = true;
    }
    
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

  selectRated(rating) {
    this.isSelectRated = rating;
    for(let i = 0; i < 5; i++) {
      if( i <= rating) {
        this.star_image[i] = "star-action";
      } else {
        this.star_image[i] = "star";
      }
    }
  }

  sendFeedback(rating, feedback) {
    var dateNow = new Date();
    this.rateService.addRatedByUser(
      this.ticketId,
      this.idCustomer,
      this.infoCustomer.username,
      rating + 1,
      feedback,
      dateNow.toString()
    ).then((value) => {
      if(value) {
        Swal.fire({
          title: 'Bạn đã đánh giá thành công!',
          icon: 'success',
          showConfirmButton: false
        }).then(() => {
          this.ngOnInit();
        });
      }
    });
  }

}
