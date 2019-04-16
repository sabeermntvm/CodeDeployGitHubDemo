import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPropertyTransactionsComponent } from './view-property-transactions.component';

describe('ViewPropertyTransactionsComponent', () => {
  let component: ViewPropertyTransactionsComponent;
  let fixture: ComponentFixture<ViewPropertyTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPropertyTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPropertyTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
