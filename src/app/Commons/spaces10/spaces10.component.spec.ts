import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Spaces10Component } from './spaces10.component';

describe('Spaces10Component', () => {
  let component: Spaces10Component;
  let fixture: ComponentFixture<Spaces10Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Spaces10Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Spaces10Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
