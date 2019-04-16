import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionmapsearchComponent } from './transactionmapsearch.component';

describe('TransactionmapsearchComponent', () => {
  let component: TransactionmapsearchComponent;
  let fixture: ComponentFixture<TransactionmapsearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionmapsearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionmapsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
