import { TestBed } from '@angular/core/testing';

import { LunchofdayService } from './lunchofday.service';

import { HttpClientModule } from '@angular/common/http';

describe('LunchofdayService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule
    ]
  }));

  it('should be created', () => {
    const service: LunchofdayService = TestBed.get(LunchofdayService);
    expect(service).toBeTruthy();
  });
});
