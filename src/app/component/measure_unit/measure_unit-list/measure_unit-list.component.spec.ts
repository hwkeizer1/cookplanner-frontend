import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasureUnitListComponent } from './measure_unit-list.component';

describe('MeasureUnitListComponent', () => {
  let component: MeasureUnitListComponent;
  let fixture: ComponentFixture<MeasureUnitListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeasureUnitListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasureUnitListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
