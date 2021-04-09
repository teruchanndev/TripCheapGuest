import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Ticket } from 'src/app/modals/ticket.model';
import { TicketsService } from 'src/app/services/tickets.service';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.css']
})
export class TicketDetailComponent implements OnInit {

  ticket: Ticket;
  private ticketId: string;
  imageObject: Array<Object> = [];
  constructor(
    public ticketsService: TicketsService,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      console.log(paramMap);
      this.ticketId = paramMap.get('ticketId');
      this.ticketsService.getTicket(this.ticketId).subscribe(ticketData => {
        this.ticket = {
          id: ticketData._id,
          title: ticketData.title,
          content: ticketData.content,
          status: ticketData.status,
          price: ticketData.price,
          city: ticketData.city,
          category: ticketData.category,
          categoryService: ticketData.categoryService,
          percent: ticketData.percent,
          price_reduce: ticketData.price_reduce,
          quantity: ticketData.quantity,
          address: ticketData.address,
          services: ticketData.services,
          imagePath: ticketData.imagePath
        };
        for (let i = 0; i < this.ticket.imagePath.length; i++) {
          this.imageObject[i] = {
            image : this.ticket.imagePath[i],
            thumbImage: this.ticket.imagePath[i]
          };
        }
        console.log(this.imageObject);
        console.log(this.ticket);
      });
    });
  }
}


