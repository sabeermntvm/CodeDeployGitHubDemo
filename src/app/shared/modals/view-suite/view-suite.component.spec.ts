import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSuiteComponent } from './view-suite.component';

describe('ViewSuiteComponent', () => {
  let component: ViewSuiteComponent;
  let fixture: ComponentFixture<ViewSuiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSuiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSuiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
