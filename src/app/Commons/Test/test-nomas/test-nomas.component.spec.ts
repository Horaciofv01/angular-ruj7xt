import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestNomasComponent } from './test-nomas.component';

describe('TestNomasComponent', () => {
  let component: TestNomasComponent;
  let fixture: ComponentFixture<TestNomasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestNomasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestNomasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
