import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UlmReportEditComponent } from './ulm-report-edit.component';

describe('UlmReportEditComponent', () => {
  let component: UlmReportEditComponent;
  let fixture: ComponentFixture<UlmReportEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UlmReportEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UlmReportEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
