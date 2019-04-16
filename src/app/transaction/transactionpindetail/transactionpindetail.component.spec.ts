import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionpindetailComponent } from './transactionpindetail.component';

describe('TransactionpindetailComponent', () => {
  let component: TransactionpindetailComponent;
  let fixture: ComponentFixture<TransactionpindetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionpindetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionpindetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
