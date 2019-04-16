import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionmultipindetailComponent } from './transactionmultipindetail.component';

describe('TransactionmultipindetailComponent', () => {
  let component: TransactionmultipindetailComponent;
  let fixture: ComponentFixture<TransactionmultipindetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionmultipindetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionmultipindetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
