import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantgridComponent } from './tenantgrid.component';

describe('TenantgridComponent', () => {
  let component: TenantgridComponent;
  let fixture: ComponentFixture<TenantgridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenantgridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
