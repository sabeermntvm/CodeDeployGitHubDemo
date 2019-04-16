import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertytenantdetailComponent } from './propertytenantdetail.component';

describe('PropertytenantdetailComponent', () => {
  let component: PropertytenantdetailComponent;
  let fixture: ComponentFixture<PropertytenantdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertytenantdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertytenantdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
