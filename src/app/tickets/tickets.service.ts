import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Router } from '@angular/router';

import { Ticket } from './ticket.model';
import { map } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class TicketsService {
  private tickets: Ticket[] = [];
  private ticketsUpdated = new Subject<Ticket[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getTickets() {
    this.http
      .get<{ message: string; ticket: any }>('http://localhost:3000/api/tickets')
      .pipe(
        map(ticketData => {
          return ticketData.ticket.map(ticket => {
            return {
              id: ticket._id,
              title: ticket.title,
              content: ticket.content,
              status: ticket.status,
              price: ticket.price,
              price_reduce: ticket.price_reduce,
              percent: ticket.percent,
              category: ticket.category,
              categoryService: ticket.categoryService,
              city: ticket.city
            };
          });
        })
      )
      .subscribe(transformedTickets => {
        this.tickets = transformedTickets;
        this.ticketsUpdated.next([...this.tickets]);
      });
  }

  getTicketUpdateListener() {
    return this.ticketsUpdated.asObservable();
  }

  getTicket(id: string) {
    return this.http.get<{
        _id: string;
        title: string;
        content: string;
        status: string;
        price: number;
        price_reduce: number;
        percent: number;
        category: string;
        categoryService: string;
        city: string;
      }>(
      'http://localhost:3000/api/tickets/' + id
    );
  }

  addTicket(
    title: string,
    content: string,
    status: string,
    price: number,
    price_reduce: number,
    percent: number,
    category: string,
    categoryService: string,
    city: string) {

    const ticket: Ticket = {
      id: null,
      title: title,
      content: content,
      status: status,
      price: price,
      price_reduce: price_reduce,
      percent: percent,
      category: category,
      categoryService: categoryService,
      city: city };

    this.http
      .post<{ message: string; ticketId: string }>('http://localhost:3000/api/tickets', ticket)
      .subscribe(responseData => {
        const id = responseData.ticketId;
        ticket.id = id;
        this.tickets.push(ticket);
        this.ticketsUpdated.next([...this.tickets]);
        this.router.navigate(['/']);
      });
      return ticket;
  }

  updateTickets(id: string, title: string,
    content: string,
    status: string,
    price: number,
    price_reduce: number,
    percent: number,
    category: string,
    categoryService: string,
    city: string) {

    const ticket: Ticket = {
      id: id,
      title: title,
      content: content,
      status: status,
      price: price,
      price_reduce: price_reduce,
      percent: percent,
      category: category,
      categoryService: categoryService,
      city: city };

    this.http
      .put('http://localhost:3000/api/tickets/' + id, ticket)
      .subscribe(response => {
        const updateTickets = [...this.tickets];
        const oldTicketIndex = updateTickets.findIndex(p => p.id === ticket.id);
        updateTickets[oldTicketIndex] = ticket;
        this.tickets = updateTickets;
        this.ticketsUpdated.next([...this.tickets]);
        this.router.navigate(['/']);
      });
  }

  deleteTicket(ticketId: string) {
    this.http
      .delete('http://localhost:3000/api/tickets/' + ticketId)
      .subscribe(() => {
        const updatedTickets = this.tickets.filter(ticket => ticket.id !== ticketId);
        this.tickets = updatedTickets;
        this.ticketsUpdated.next([...this.tickets]);
      });
  }
}