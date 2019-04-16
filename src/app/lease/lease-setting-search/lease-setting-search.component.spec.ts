import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaseSettingSearchComponent } from './lease-setting-search.component';

describe('LeaseSettingSearchComponent', () => {
  let component: LeaseSettingSearchComponent;
  let fixture: ComponentFixture<LeaseSettingSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaseSettingSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaseSettingSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
