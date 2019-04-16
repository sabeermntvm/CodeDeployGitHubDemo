import { Component, OnInit, Input } from '@angular/core';
import { Suite } from '../../../core/models/suite';

@Component({
  selector: 'app-view-suite',
  templateUrl: './view-suite.component.html',
  styleUrls: ['./view-suite.component.scss']
})
export class ViewSuiteComponent implements OnInit {

  @Input()
  suite: Suite;
  @Input()
  isIndustrial: boolean;
  suiteSelected: Suite;
  constructor() { }

  ngOnInit() {
    
    this.suiteSelected = this.suite;
  }
  public Industrial(): boolean {

    return this.isIndustrial;
    }

}
