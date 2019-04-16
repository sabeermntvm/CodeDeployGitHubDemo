import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeasegalleryComponent } from './leasegallery.component';

describe('LeasegalleryComponent', () => {
  let component: LeasegalleryComponent;
  let fixture: ComponentFixture<LeasegalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeasegalleryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeasegalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
