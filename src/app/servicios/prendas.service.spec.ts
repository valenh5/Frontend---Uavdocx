import { TestBed } from '@angular/core/testing';

import { PrendasSerice } from './prenda.service';

describe('PrendasService', () => {
  let service: PrendasSerice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrendasSerice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
