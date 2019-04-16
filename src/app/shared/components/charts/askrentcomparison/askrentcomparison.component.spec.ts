import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AskrentcomparisonComponent } from './askrentcomparison.component';

describe('AskrentcomparisonComponent', () => {
  let component: AskrentcomparisonComponent;
  let fixture: ComponentFixture<AskrentcomparisonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AskrentcomparisonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AskrentcomparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
