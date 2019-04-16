import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UlmReportGridComponent } from './ulm-report-grid.component';

describe('UlmReportGridComponent', () => {
  let component: UlmReportGridComponent;
  let fixture: ComponentFixture<UlmReportGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UlmReportGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UlmReportGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
