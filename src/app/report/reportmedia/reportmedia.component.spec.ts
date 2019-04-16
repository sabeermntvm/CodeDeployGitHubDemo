import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportMediaComponent } from './reportmedia.component';

describe('ReportMediaComponent', () => {
  let component: ReportMediaComponent;
  let fixture: ComponentFixture<ReportMediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportMediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
