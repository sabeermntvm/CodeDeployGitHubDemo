import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeasegridComponent } from './leasegrid.component';

describe('LeasegridComponent', () => {
  let component: LeasegridComponent;
  let fixture: ComponentFixture<LeasegridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeasegridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeasegridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
