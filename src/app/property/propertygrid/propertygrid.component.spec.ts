import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertygridComponent } from './propertygrid.component';

describe('PropertygridComponent', () => {
  let component: PropertygridComponent;
  let fixture: ComponentFixture<PropertygridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertygridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertygridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
