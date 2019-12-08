import { TestBed } from '@angular/core/testing';

import { LunchofdayTmpService } from './lunchofday-tmp.service';

describe('LunchofdayTmpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LunchofdayTmpService = TestBed.get(LunchofdayTmpService);
    expect(service).toBeTruthy();
  });
});
