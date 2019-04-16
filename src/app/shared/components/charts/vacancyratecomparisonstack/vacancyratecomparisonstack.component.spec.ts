import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VacancyratecomparisonstackComponent } from './vacancyratecomparisonstack.component';

describe('VacancyratecomparisonstackComponent', () => {
  let component: VacancyratecomparisonstackComponent;
  let fixture: ComponentFixture<VacancyratecomparisonstackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VacancyratecomparisonstackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VacancyratecomparisonstackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
