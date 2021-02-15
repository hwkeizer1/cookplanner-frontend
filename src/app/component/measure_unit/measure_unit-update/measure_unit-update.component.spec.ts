import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasureUnitUpdateComponent } from './measure_unit-update.component';

describe('MeasureUnitUpdateComponent', () => {
  let component: MeasureUnitUpdateComponent;
  let fixture: ComponentFixture<MeasureUnitUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeasureUnitUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasureUnitUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
