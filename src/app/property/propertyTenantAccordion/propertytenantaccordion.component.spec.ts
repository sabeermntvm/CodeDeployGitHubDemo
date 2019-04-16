import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertytenantAccordionComponent } from './propertytenantaccordion.component';

describe('PropertytenantAccordionComponent', () => {
  let component: PropertytenantAccordionComponent;
  let fixture: ComponentFixture<PropertytenantAccordionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertytenantAccordionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertytenantAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
