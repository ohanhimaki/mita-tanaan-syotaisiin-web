import { TestBed } from '@angular/core/testing';

import { LunchListService } from './lunch-list.service';

describe('LunchListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LunchListService = TestBed.get(LunchListService);
    expect(service).toBeTruthy();
  });
});
