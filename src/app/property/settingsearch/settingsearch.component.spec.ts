import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsearchComponent } from './settingsearch.component';

describe('SettingsearchComponent', () => {
  let component: SettingsearchComponent;
  let fixture: ComponentFixture<SettingsearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
