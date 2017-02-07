# ng2-rickshaw

Angular2 component for rickshaw. It has similar technique as [angular-rickshaw](https://github.com/ngyewch/angular-rickshaw) for angular 1, but designed for angular 2 and without extra features (like extended mode) you won't need.

## Demos

Online demos:

Updating...

## Install

    npm install d3 rickshaw ng2-rickshaw
    
it requires `angular2`, `d3` and `rickshaw` as dependencies. Tested with the current `@angular` version `2.2.1`.
    
## Basic usage

### Simple bar chart
Note: `d3` and `rickshaw` should be also included in your project bundle.

Simple line chart:
    
```js
import {Component, OnInit, ViewChild} from '@angular/core';
declare const Rickshaw: any, d3: any;
import {rickshaw} from 'ng2-rickshaw';

@Component({
  selector: 'main',
  template: `
    <div>
      <rickshaw
          #widgetrickshaw
          [options]="widget.options"
          [series]="widget.series"
          [features]="widget.features"
        ></rickshaw>
    </div>
  `
})

export class Main implements OnInit{
  @ViewChild('widgetrickshaw') _widgetRickshaw: rickshaw;
  widget5 = {
      options: {
        renderer: 'bar'
      },
      series: [
        {
          data: [
            {
              x: 0,
              y: 10
            }, {
              x: 1,
              y: 8
            }, {
              x: 2,
              y: 5
            }, {
              x: 3,
              y: 9
            }, {
              x: 4,
              y: 5
            }, {
              x: 5,
              y: 8
            }, {
              x: 6,
              y: 10
            }],
          color: '#e95555'
        },
        {
          data: [
            {
              x: 0,
              y: 0
            }, {
              x: 1,
              y: 2
            }, {
              x: 2,
              y: 5
            }, {
              x: 3,
              y: 1
            }, {
              x: 4,
              y: 5
            }, {
              x: 5,
              y: 2
            }, {
              x: 6,
              y: 0
            }],
          color: '#e6e6e6'
        }
      ],
      features: {},
      renderer: Rickshaw.Class.create(Rickshaw.Graph.Renderer.Bar, {
        barWidth: function (series) {
          return 7;
        }
      })
    };
}
```    

## Tests

    npm test

## License
MIT
