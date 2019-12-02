import { TestBed } from '@angular/core/testing';

import { LunchofdayService } from './lunchofday.service';

describe('LunchofdayService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LunchofdayService = TestBed.get(LunchofdayService);
    expect(service).toBeTruthy();
  });
});
