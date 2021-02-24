import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientNameListComponent } from './ingredient-name-list.component';

describe('IngredientNameListComponent', () => {
  let component: IngredientNameListComponent;
  let fixture: ComponentFixture<IngredientNameListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngredientNameListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientNameListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
