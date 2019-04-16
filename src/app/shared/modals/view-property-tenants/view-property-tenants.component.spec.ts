import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPropertyTenantsComponent } from './view-property-tenants.component';

describe('ViewPropertyTenantsComponent', () => {
  let component: ViewPropertyTenantsComponent;
  let fixture: ComponentFixture<ViewPropertyTenantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPropertyTenantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPropertyTenantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
