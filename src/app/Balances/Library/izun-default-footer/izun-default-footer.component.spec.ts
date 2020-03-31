import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IzunDefaultFooterComponent } from './izun-default-footer.component';

describe('IzunDefaultFooterComponent', () => {
  let component: IzunDefaultFooterComponent;
  let fixture: ComponentFixture<IzunDefaultFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IzunDefaultFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IzunDefaultFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
