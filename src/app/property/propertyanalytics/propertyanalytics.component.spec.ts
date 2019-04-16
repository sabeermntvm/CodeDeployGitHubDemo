import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyanalyticsComponent } from './propertyanalytics.component';

describe('PropertyanalyticsComponent', () => {
  let component: PropertyanalyticsComponent;
  let fixture: ComponentFixture<PropertyanalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyanalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyanalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
