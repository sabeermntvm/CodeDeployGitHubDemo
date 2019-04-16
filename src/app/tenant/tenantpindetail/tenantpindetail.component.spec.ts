import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantpindetailComponent } from './tenantpindetail.component';

describe('TenantpindetailComponent', () => {
  let component: TenantpindetailComponent;
  let fixture: ComponentFixture<TenantpindetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenantpindetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantpindetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
