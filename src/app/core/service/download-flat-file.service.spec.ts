import { TestBed } from '@angular/core/testing';

import { DownloadFlatService } from './download-flat-file.service';

describe('ManageRxilService', () => {
  let service: DownloadFlatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadFlatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
