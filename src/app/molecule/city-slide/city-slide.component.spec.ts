import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitySlideComponent } from './city-slide.component';

describe('CitySlideComponent', () => {
  let component: CitySlideComponent;
  let fixture: ComponentFixture<CitySlideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CitySlideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CitySlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
