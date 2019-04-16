import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapSideBarComponent } from './map-side-bar.component';

describe('MapSideBarComponent', () => {
  let component: MapSideBarComponent;
  let fixture: ComponentFixture<MapSideBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapSideBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
