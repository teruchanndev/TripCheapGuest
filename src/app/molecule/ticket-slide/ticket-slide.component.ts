import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ticket-slide',
  templateUrl: './ticket-slide.component.html',
  styleUrls: ['./ticket-slide.component.css']
})
export class TicketSlideComponent implements OnInit {

  @Input() tickets;
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
