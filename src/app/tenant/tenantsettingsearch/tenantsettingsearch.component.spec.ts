import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantsettingsearchComponent } from './tenantsettingsearch.component';

describe('TenantsettingsearchComponent', () => {
  let component: TenantsettingsearchComponent;
  let fixture: ComponentFixture<TenantsettingsearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenantsettingsearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantsettingsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
