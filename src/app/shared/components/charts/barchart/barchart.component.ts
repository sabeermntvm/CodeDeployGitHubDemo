import { Component, OnInit, Input } from '@angular/core';
import * as global from '../../../../config/globals';
import 'd3';
import 'nvd3';

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.css']
})
export class BarchartComponent implements OnInit {

  chartColor;
  barChartData;
  barChartOptions;

  @Input() customColors : any = [];
  @Input() BarChartDataInput : any;
  @Input() xAxisLabel : string = "";
  @Input() yAxisLabel : string = "";
  @Input() chartHeader : string = "";
 
  constructor() { }

  ngOnInit() {
    this.chartColor = { domain: [global.COLOR_BLUE, global.COLOR_GREEN, global.COLOR_PURPLE, global.COLOR_BLACK] };
  }
}
