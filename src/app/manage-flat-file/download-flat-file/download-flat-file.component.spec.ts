import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadFlatFileComponent } from './download-flat-file.component';

describe('DownloadFlatFileComponent', () => {
  let component: DownloadFlatFileComponent;
  let fixture: ComponentFixture<DownloadFlatFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadFlatFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadFlatFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
