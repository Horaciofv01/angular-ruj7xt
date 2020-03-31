import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IzunIndexComponent } from './izun-index.component';

describe('IzunIndexComponent', () => {
  let component: IzunIndexComponent;
  let fixture: ComponentFixture<IzunIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IzunIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IzunIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
