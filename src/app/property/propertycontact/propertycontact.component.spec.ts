import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertycontactComponent } from './propertycontact.component';

describe('PropertycontactComponent', () => {
  let component: PropertycontactComponent;
  let fixture: ComponentFixture<PropertycontactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertycontactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertycontactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
