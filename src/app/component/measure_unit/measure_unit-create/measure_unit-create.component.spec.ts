import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasureUnitCreateComponent } from './measure_unit-create.component';

describe('MeasureUnitCreateComponent', () => {
  let component: MeasureUnitCreateComponent;
  let fixture: ComponentFixture<MeasureUnitCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeasureUnitCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasureUnitCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
