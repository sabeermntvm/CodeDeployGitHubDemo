import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AskrentcomparisonweightedComponent } from './askrentcomparisonweighted.component';

describe('AskrentcomparisonweightedComponent', () => {
  let component: AskrentcomparisonweightedComponent;
  let fixture: ComponentFixture<AskrentcomparisonweightedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AskrentcomparisonweightedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AskrentcomparisonweightedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
