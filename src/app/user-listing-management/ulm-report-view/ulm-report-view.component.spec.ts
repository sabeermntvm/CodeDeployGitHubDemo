import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UlmReportViewComponent } from './ulm-report-view.component';

describe('UlmReportViewComponent', () => {
  let component: UlmReportViewComponent;
  let fixture: ComponentFixture<UlmReportViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UlmReportViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UlmReportViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
