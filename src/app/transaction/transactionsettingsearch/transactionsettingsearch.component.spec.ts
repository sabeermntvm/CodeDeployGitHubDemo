import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsettingsearchComponent } from './transactionsettingsearch.component';

describe('TransactionsettingsearchComponent', () => {
  let component: TransactionsettingsearchComponent;
  let fixture: ComponentFixture<TransactionsettingsearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionsettingsearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsettingsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
