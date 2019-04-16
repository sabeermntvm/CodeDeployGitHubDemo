import { Component, OnInit,Input } from '@angular/core';
import * as global from '../../../../config/globals';

@Component({
  selector: 'app-stackedbarchart',
  templateUrl: './stackedbarchart.component.html',
  styleUrls: ['./stackedbarchart.component.css']
})
export class StackedbarchartComponent implements OnInit {

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
    this.chartColor = { domain: [global.COLOR_BLUE, global.COLOR_ORANGE] };
  }

}
