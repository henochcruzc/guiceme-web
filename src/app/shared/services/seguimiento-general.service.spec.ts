import { TestBed } from '@angular/core/testing';

import { SeguimientoGeneralService } from './seguimiento-general.service';

describe('SeguimientoGeneralService', () => {
  let service: SeguimientoGeneralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeguimientoGeneralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
