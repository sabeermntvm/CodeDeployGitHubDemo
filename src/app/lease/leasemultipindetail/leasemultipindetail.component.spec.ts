import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeasemultipindetailComponent } from './leasemultipindetail.component';

describe('LeasemultipindetailComponent', () => {
  let component: LeasemultipindetailComponent;
  let fixture: ComponentFixture<LeasemultipindetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeasemultipindetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeasemultipindetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
