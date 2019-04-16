import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VacancyratecomparisonComponent } from './vacancyratecomparison.component';

describe('VacancyratecomparisonComponent', () => {
  let component: VacancyratecomparisonComponent;
  let fixture: ComponentFixture<VacancyratecomparisonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VacancyratecomparisonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VacancyratecomparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
