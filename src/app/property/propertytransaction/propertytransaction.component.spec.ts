import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertytransactionComponent } from './propertytransaction.component';

describe('PropertytransactionComponent', () => {
  let component: PropertytransactionComponent;
  let fixture: ComponentFixture<PropertytransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertytransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertytransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
