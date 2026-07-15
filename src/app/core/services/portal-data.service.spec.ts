import { TestBed } from '@angular/core/testing';

import { PortalDataService } from './portal-data.service';

describe('PortalDataService', () => {
  let service: PortalDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortalDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
