import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsCityComponent } from './tickets-city.component';

describe('TicketsAllComponent', () => {
  let component: TicketsCityComponent;
  let fixture: ComponentFixture<TicketsCityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketsCityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
