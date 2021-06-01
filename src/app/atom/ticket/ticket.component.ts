import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit {

  @Input() ticket;
  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    // console.log('ticket.id app-ticket:', this.ticket._id);
  }

  detailTicket(ticketId) {
    this.router.navigate(['detail/' + ticketId]);
  }

}
