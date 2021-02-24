import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientNameUpdateComponent } from './ingredient-name-update.component';

describe('IngredientNameUpdateComponent', () => {
  let component: IngredientNameUpdateComponent;
  let fixture: ComponentFixture<IngredientNameUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngredientNameUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientNameUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
