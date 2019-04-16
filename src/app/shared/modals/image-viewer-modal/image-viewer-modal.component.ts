import { Component, OnInit, Input, OnDestroy, NgZone, Output, EventEmitter } from '@angular/core';
import pageSettings from '../../../config/page-settings';

@Component({
    selector: 'app-image-viewer-modal',
    templateUrl: './image-viewer-modal.component.html',
    styleUrls: ['./image-viewer-modal.component.scss']
})
export class ImageViewerComponent implements OnInit {


    pageSettings;
    @Input() galleryOptions;
    @Input() galleryImages;
    @Input() name;
    fullscreen:boolean=false;

    constructor() {

    }

    ngOnInit() {
    }
    previewOpen($event){
        this.fullscreen=true;
        this.pageSettings = pageSettings;
        pageSettings.pageEmpty = true;
      }
      
      previewClose($event){
        this.fullscreen=false;
        pageSettings.pageEmpty = false;
      }
}