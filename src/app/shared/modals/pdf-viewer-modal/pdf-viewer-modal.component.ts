import { Component, OnInit, Input, OnDestroy, NgZone, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pdf-viewer-modal',
  templateUrl: './pdf-viewer-modal.component.html',
  styleUrls: ['./pdf-viewer-modal.component.scss']
})
export class PdfViewerModalComponent implements OnInit {
 pdfSrc:string;
 spinnerStatus:boolean = true;
  @Input() PdfUrl: string;
  @Output() onClose = new EventEmitter();


  constructor() { }

  ngOnInit() {
    this.pdfSrc = this.PdfUrl;
  }
  downloadFile() {
    window.open(this.PdfUrl);
  }
  callBackFn(pdf:any) {
     this.spinnerStatus = false;
 }
}
