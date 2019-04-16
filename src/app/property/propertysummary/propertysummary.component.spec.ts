import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertysummaryComponent } from './propertysummary.component';

describe('PropertysummaryComponent', () => {
  let component: PropertysummaryComponent;
  let fixture: ComponentFixture<PropertysummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertysummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertysummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
