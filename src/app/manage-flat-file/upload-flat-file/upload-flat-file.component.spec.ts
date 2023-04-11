import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFlatFileComponent } from './upload-flat-file.component';

describe('UploadFlatFileComponent', () => {
  let component: UploadFlatFileComponent;
  let fixture: ComponentFixture<UploadFlatFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadFlatFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadFlatFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
