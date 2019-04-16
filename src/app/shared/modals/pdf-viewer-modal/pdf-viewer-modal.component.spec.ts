import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfViewerModalComponent } from './pdf-viewer-modal.component';

describe('PdfViewerModalComponent', () => {
  let component: PdfViewerModalComponent;
  let fixture: ComponentFixture<PdfViewerModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfViewerModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfViewerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
