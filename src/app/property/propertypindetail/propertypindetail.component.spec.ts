import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyPinDetailComponent } from './propertypindetail.component';

describe('PropertyPinDetailComponent', () => {
  let component: PropertyPinDetailComponent;
  let fixture: ComponentFixture<PropertyPinDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyPinDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyPinDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
