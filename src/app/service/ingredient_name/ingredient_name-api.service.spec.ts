import { TestBed } from '@angular/core/testing';

import { IngredientNameApiService } from './ingredient_name-api.service';

describe('IngredientNameService', () => {
  let service: IngredientNameApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngredientNameApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
