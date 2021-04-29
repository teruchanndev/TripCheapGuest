import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsCategoryComponent } from './tickets-category.component';

describe('TicketsCategoryComponent', () => {
  let component: TicketsCategoryComponent;
  let fixture: ComponentFixture<TicketsCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketsCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
