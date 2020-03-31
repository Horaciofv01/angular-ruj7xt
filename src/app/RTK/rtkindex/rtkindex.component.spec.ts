import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RTKindexComponent } from './rtkindex.component';

describe('RTKindexComponent', () => {
  let component: RTKindexComponent;
  let fixture: ComponentFixture<RTKindexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RTKindexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RTKindexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
