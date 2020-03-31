import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CesiumTestComponent } from './cesium-test.component';

describe('CesiumTestComponent', () => {
  let component: CesiumTestComponent;
  let fixture: ComponentFixture<CesiumTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CesiumTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CesiumTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
