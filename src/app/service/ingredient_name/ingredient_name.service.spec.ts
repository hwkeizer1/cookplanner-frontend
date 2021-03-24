import { TestBed } from '@angular/core/testing';

import { IngredientNameService } from './ingredient_name.service';

describe('IngredientNameService', () => {
  let service: IngredientNameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngredientNameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
