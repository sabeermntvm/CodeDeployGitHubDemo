import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VacantsummarycomparisonComponent } from './vacantsummarycomparison.component';

describe('VacantsummarycomparisonComponent', () => {
  let component: VacantsummarycomparisonComponent;
  let fixture: ComponentFixture<VacantsummarycomparisonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VacantsummarycomparisonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VacantsummarycomparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
