import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map-side-bar',
  templateUrl: './map-side-bar.component.html',
  styleUrls: ['./map-side-bar.component.css']
})
export class MapSideBarComponent implements OnInit {
  items:Array<string> = ['Vienna', 'Vilnius', 'Warsaw', 'Wrocław',
  'Zagreb', 'Zaragoza', 'Łódź'];
  value : any[];
  constructor() { }

  ngOnInit() {
  }

}
