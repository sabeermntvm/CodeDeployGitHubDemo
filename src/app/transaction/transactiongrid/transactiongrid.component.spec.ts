import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactiongridComponent } from './transactiongrid.component';

describe('TransactiongridComponent', () => {
  let component: TransactiongridComponent;
  let fixture: ComponentFixture<TransactiongridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactiongridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactiongridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
