import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactiongalleryComponent } from './transactiongallery.component';

describe('TransactiongalleryComponent', () => {
  let component: TransactiongalleryComponent;
  let fixture: ComponentFixture<TransactiongalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactiongalleryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactiongalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
