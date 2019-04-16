import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {ULMReportUrlGeneratorComponent} from './ulm-report-url-generator.component';

describe('ULMReportUrlGeneratorComponent', () => {
  let component: ULMReportUrlGeneratorComponent;
  let fixture: ComponentFixture<ULMReportUrlGeneratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ULMReportUrlGeneratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ULMReportUrlGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
