import { TestBed } from '@angular/core/testing';

import { TagApiService } from './tag-api.service';

describe('TagService', () => {
  let service: TagApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TagApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
