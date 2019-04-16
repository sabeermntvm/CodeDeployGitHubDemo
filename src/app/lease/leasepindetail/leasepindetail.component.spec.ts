import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeasepindetailComponent } from './leasepindetail.component';

describe('LeasepindetailComponent', () => {
  let component: LeasepindetailComponent;
  let fixture: ComponentFixture<LeasepindetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeasepindetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeasepindetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
