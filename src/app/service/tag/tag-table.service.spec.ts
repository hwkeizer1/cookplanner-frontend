import { TestBed } from '@angular/core/testing';

import { TagTableService } from './tag-table.service';

describe('TagTableService', () => {
  let service: TagTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TagTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
