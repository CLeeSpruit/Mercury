import { TestBed, inject } from '@angular/core/testing';

import { TfsService } from './tfs.service';

describe('TfsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TfsService]
    });
  });

  it('should be created', inject([TfsService], (service: TfsService) => {
    expect(service).toBeTruthy();
  }));
});
