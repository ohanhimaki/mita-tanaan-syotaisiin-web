import { TestBed } from '@angular/core/testing';

import { LunchofdayTmpService } from './lunchofday-tmp.service';
import { HttpClientModule } from '@angular/common/http';

describe('LunchofdayTmpService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule
    ]
  }));

  it('should be created', () => {
    const service: LunchofdayTmpService = TestBed.get(LunchofdayTmpService);
    expect(service).toBeTruthy();
  });
});
