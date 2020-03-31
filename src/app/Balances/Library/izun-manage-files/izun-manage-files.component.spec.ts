import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IzunManageFilesComponent } from './izun-manage-files.component';

describe('IzunManageFilesComponent', () => {
  let component: IzunManageFilesComponent;
  let fixture: ComponentFixture<IzunManageFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IzunManageFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IzunManageFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
