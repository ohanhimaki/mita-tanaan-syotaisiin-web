import { TestBed } from '@angular/core/testing';

import { AdminService } from './admin.service';
import { HttpModule } from '@angular/http';

describe('AdminService', () => {
  beforeEach(() => TestBed.configureTestingModule({

    imports: [
      HttpModule
    ]

  }));

  it('should be created', () => {
    const service: AdminService = TestBed.get(AdminService);
    expect(service).toBeTruthy();
  });
});
