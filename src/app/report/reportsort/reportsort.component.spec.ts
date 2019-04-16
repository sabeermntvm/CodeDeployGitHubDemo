import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSortComponent } from './reportsort.component';

describe('ReportSortComponent', () => {
  let component: ReportSortComponent;
  let fixture: ComponentFixture<ReportSortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportSortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
