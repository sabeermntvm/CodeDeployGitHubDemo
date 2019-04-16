import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertygalleryComponent } from './propertygallery.component';

describe('PropertygalleryComponent', () => {
  let component: PropertygalleryComponent;
  let fixture: ComponentFixture<PropertygalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertygalleryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertygalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
