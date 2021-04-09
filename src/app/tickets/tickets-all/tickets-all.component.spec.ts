import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsAllComponent } from './tickets-all.component';

describe('TicketsAllComponent', () => {
  let component: TicketsAllComponent;
  let fixture: ComponentFixture<TicketsAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketsAllComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
