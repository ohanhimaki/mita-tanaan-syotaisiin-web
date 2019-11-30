import { TestBed } from '@angular/core/testing';

import { LunchListService } from './lunch-list.service';
import { HttpModule } from '@angular/http';

describe('LunchListService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpModule
    ]
  }));

  it('should be created', () => {
    const service: LunchListService = TestBed.get(LunchListService);
    expect(service).toBeTruthy();
  });
});
