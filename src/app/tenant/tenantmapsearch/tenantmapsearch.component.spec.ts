import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantmapsearchComponent } from './tenantmapsearch.component';

describe('TenantmapsearchComponent', () => {
  let component: TenantmapsearchComponent;
  let fixture: ComponentFixture<TenantmapsearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenantmapsearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantmapsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
