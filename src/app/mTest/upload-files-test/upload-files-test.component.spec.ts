import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFilesTestComponent } from './upload-files-test.component';

describe('UploadFilesTestComponent', () => {
  let component: UploadFilesTestComponent;
  let fixture: ComponentFixture<UploadFilesTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadFilesTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFilesTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
