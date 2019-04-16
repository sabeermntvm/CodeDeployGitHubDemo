import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertytenantComponent } from './propertytenant.component';

describe('PropertytenantComponent', () => {
  let component: PropertytenantComponent;
  let fixture: ComponentFixture<PropertytenantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertytenantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertytenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
