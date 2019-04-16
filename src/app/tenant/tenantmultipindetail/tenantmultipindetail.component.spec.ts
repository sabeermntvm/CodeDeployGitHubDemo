import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantmultipindetailComponent } from './tenantmultipindetail.component';

describe('TenantmultipindetailComponent', () => {
  let component: TenantmultipindetailComponent;
  let fixture: ComponentFixture<TenantmultipindetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenantmultipindetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantmultipindetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
