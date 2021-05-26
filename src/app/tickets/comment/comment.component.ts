import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Comment } from 'src/app/modals/comment.model';
import { Customer } from 'src/app/modals/customer.model';
import { Ticket } from 'src/app/modals/ticket.model';
import { AuthService } from 'src/app/services/auth_customer.service';
import { CommentService } from 'src/app/services/comment.service';
import { CustomerService } from 'src/app/services/customer.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit, OnDestroy {

  @Input() ticket: Ticket;

  comments: Comment[] = [];
  private commentSub: Subscription;
  userIsAuthenticated = false;

  ticketId: string;
  customerId: string;
  infoCustomer: Customer;
  characterAvt: string;
  isLikeComment = [];
  countLikeComments = [];
  enterMessage = "";

  
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
    // get user
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
    // get comment
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.ticketId = paramMap.get('ticketId');
      this.commentService.getCommentsOfTicket(this.ticketId);
      this.commentSub = this.commentService.getCommentUpdateListener()
        .subscribe((comments: Comment[]) =>  {
        this.comments = comments;
        comments.forEach( el =>{
          this.isLikeComment.push(el.isMyLike);
          this.countLikeComments.push(el.likeCount);
        })
        console.log('comment get: ',comments);
      });
    });
  }

  formatDate(date) {
    var d = new Date(date);
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    var minutescovert = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutescovert + ' ' + ampm;

    return d.getDay() + '/' + d.getMonth() + '/' + d.getFullYear()
      + ' (' + strTime + ')';
  }


  navigateToLogin() {
    localStorage.setItem('ticketId',this.ticketId);
    localStorage.setItem('type', 'detailTicket');
  }

  onSaveComment(mes) {
    var dateNow = new Date();
    var comment : Comment = {
      id: '',
      idUser: this.customerId,
      idTicket: this.ticketId,
      idCreator: this.ticket.creator,
      username: this.infoCustomer.username,
      message: mes,
      images: [''],
      rating: 0,
      likeCount: 0,
      isMyLike: false,
      created_at: dateNow.toString()
    }
    console.log('comment: ', comment);
    this.commentService.addComment(
      this.customerId,
      this.ticketId,
      this.ticket.creator,
      mes,
      this.infoCustomer.username,
      [''],
      0,
      0,
      false
    ).then((value) => {
      Swal.fire({
        title: 'Đã gửi bình luận của bạn!',
        icon: 'success'
      }).then(() => {
        this.comments.push(comment);
        this.countLikeComments.push(0);
        this.isLikeComment.push(false);
      });
    })
  }

  likeComment(count, i) {
    let Ilike = false;
    if(this.isLikeComment[i]) {
      this.countLikeComments[i] = count - 1;
      Ilike = false;
    } else {
      this.countLikeComments[i] = count + 1;
      Ilike = true;
    }
    this.isLikeComment[i] = !this.isLikeComment[i];
    this.commentService.updateIsLike(
      this.comments[i].id,
      this.countLikeComments[i],
      Ilike
    ).then((value : any) => {
      console.log(value);
    })

  }

  ngOnDestroy(): void {
    this.commentSub.unsubscribe();
  }

}
