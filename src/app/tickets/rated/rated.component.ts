import { Component, Input, OnInit } from '@angular/core';
import { Rated } from '../../modals/rated.model';
@Component({
  selector: 'app-rated',
  templateUrl: './rated.component.html',
  styleUrls: ['./rated.component.css']
})
export class RatedComponent implements OnInit {

  @Input() ticketId;
  constructor() { }

  ngOnInit(): void {
  }

}
