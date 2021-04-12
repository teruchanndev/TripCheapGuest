import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailUpdateComponent } from './ticket-detail-update.component';

describe('TicketDetailUpdateComponent', () => {
  let component: TicketDetailUpdateComponent;
  let fixture: ComponentFixture<TicketDetailUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketDetailUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
