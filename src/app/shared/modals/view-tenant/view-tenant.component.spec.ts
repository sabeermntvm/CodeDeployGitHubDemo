import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTenantComponent } from './view-tenant.component';

describe('ViewTenantComponent', () => {
  let component: ViewTenantComponent;
  let fixture: ComponentFixture<ViewTenantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTenantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
