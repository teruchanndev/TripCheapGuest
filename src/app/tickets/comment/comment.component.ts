import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Comment } from 'src/app/modals/comment.model';
import { Customer } from 'src/app/modals/customer.model';
import { AuthService } from 'src/app/services/auth_customer.service';
import { CommentService } from 'src/app/services/comment.service';
import { CustomerService } from 'src/app/services/customer.service';
@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit, OnDestroy {

  comments: Comment[] = [];
  private commentSub: Subscription;
  userIsAuthenticated = false;

  ticketId: string;
  customerId: string;
  infoCustomer: Customer;
  characterAvt: string;
  
  constructor(
    public commentService: CommentService,
    public route: ActivatedRoute,
    public customerService: CustomerService,
    private authService: AuthService,
    private router: Router
  ) {}
  
  
  ngOnInit(): void {
    this.authService.autoAuthCustomer();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.customerId = this.authService.getCustomerId();
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
          this.characterAvt = info.username[0].toUpperCase();
        }
      );
    }
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      console.log(paramMap);
      this.ticketId = paramMap.get('ticketId');

      // this.commentService.getCommentsOfTicket(this.ticketId);
      // this.commentSub = this.commentService.getTicketUpdateListener().subscribe((comments: Comment[]) =>  {
      //   this.comments = comments;
      //   console.log(this.comments);
      // });
    });
  }

  navigateToLogin() {
    localStorage.setItem('ticketId',this.ticketId);
    localStorage.setItem('type', 'detailTicket');
  }

  ngOnDestroy(): void {
    // this.commentSub.unsubscribe();
  }

}
