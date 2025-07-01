import { TestBed } from '@angular/core/testing';

import { PrendasService } from './prenda.service';

describe('PrendasService', () => {
  let service: PrendasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrendasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
