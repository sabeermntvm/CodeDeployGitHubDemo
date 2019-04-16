import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertymapComponent } from './propertymap.component';

describe('PropertymapComponent', () => {
  let component: PropertymapComponent;
  let fixture: ComponentFixture<PropertymapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertymapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertymapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
