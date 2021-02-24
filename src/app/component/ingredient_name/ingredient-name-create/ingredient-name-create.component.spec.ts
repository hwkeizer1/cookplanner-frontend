import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientNameCreateComponent } from './ingredient-name-create.component';

describe('IngredientNameCreateComponent', () => {
  let component: IngredientNameCreateComponent;
  let fixture: ComponentFixture<IngredientNameCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngredientNameCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientNameCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
