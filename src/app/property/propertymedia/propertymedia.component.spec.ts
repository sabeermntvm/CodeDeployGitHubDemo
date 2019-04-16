import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertymediaComponent } from './propertymedia.component';

describe('PropertymediaComponent', () => {
  let component: PropertymediaComponent;
  let fixture: ComponentFixture<PropertymediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertymediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertymediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
