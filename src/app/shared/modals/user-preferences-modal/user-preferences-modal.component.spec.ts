import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {UserPreferencesModalComponent} from './user-preferences-modal.component';

describe('UserPreferencesModalComponent', () => {
  let component: UserPreferencesModalComponent;
  let fixture: ComponentFixture<UserPreferencesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPreferencesModalComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPreferencesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
