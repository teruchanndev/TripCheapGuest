import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketSlideComponent } from './ticket-slide.component';

describe('TicketSlideComponent', () => {
  let component: TicketSlideComponent;
  let fixture: ComponentFixture<TicketSlideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketSlideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
