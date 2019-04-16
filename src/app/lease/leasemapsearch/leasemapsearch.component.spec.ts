import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeasemapsearchComponent } from './leasemapsearch.component';

describe('LeasemapsearchComponent', () => {
  let component: LeasemapsearchComponent;
  let fixture: ComponentFixture<LeasemapsearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeasemapsearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeasemapsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
