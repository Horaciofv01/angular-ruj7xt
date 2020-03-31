import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalonsComponent } from './balons.component';

describe('BalonsComponent', () => {
  let component: BalonsComponent;
  let fixture: ComponentFixture<BalonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
