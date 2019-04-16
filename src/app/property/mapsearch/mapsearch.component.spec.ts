import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsearchComponent } from './mapsearch.component';

describe('MapsearchComponent', () => {
  let component: MapsearchComponent;
  let fixture: ComponentFixture<MapsearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapsearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
