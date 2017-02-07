/// <reference path="../typings/globals/rickshaw/index.d.ts" />
import {NgModule, Component, OnChanges, ElementRef, Input, ViewEncapsulation, HostListener} from '@angular/core';
declare const Rickshaw: any;

@Component({
    selector: 'rickshaw',
    template: ``,
    encapsulation: ViewEncapsulation.None,
    styles: [
        `
      rickshaw {
        display: block;
        width: 100%;
      }
    `
    ]
})

export class rickshaw implements OnChanges {
    @Input() options: any;
    @Input() series: any;
    @Input() features: any;
    @Input() renderer: any;
    public el: any;
    public graph: any;
    private settings: any;
    private mainEl: any;
    private graphEl: any;
    private legendEl: any;
    private previewEl: any;
    private xAxis: any;
    private yAxis: any;

    constructor(private elementRef: ElementRef) {
        this.el = elementRef.nativeElement;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.redraw();
    }

    ngOnChanges($changes) {
        let self = this;
        self.updateConfiguration(); // options
        // updateData() // series
        // updateConfiguration() // features
    }

    redraw() {
        this.graph.configure({
            width: this.el.clientWidth,
            height: this.el.clientHeight
        });

        this.graph && this.graph.setSize();
        this.graph && this.graph.render();
    }

    _splice(args) {
        let data = args.data;
        let series = args.series;

        if (!args.series) {
            return data;
        }

        series.forEach(function (s) {
            let seriesKey = s.key || s.name;
            if (!seriesKey) {
                throw "series needs a key or a name";
            }

            data.forEach(function (d) {
                let dataKey = d.key || d.name;
                if (!dataKey) {
                    throw "data needs a key or a name";
                }
                if (seriesKey == dataKey) {
                    let properties = ['color', 'name', 'data'];
                    properties.forEach(function (p) {
                        if (d[p]) {
                            s[p] = d[p];
                        }
                    });
                }
            });
        });
    }

    updateData() {
        debugger;
        if (this.graph && this.settings) {
            this._splice({data: this.series, series: this.settings.series});
            this.redraw();
        }
    }

    updateConfiguration() {
        if (!this.graph) {
            this.mainEl = this.el; // need check
            this.graphEl = document.createElement('div');
            this.mainEl.append(this.graphEl);

            this.settings = this.options;
            this.settings.element = this.graphEl;
            this.settings.series = this.series;

            this.graph = new Rickshaw.Graph(this.settings);
        }
        else {
            if (this.options) {
                for (let key in this.options) {
                    if (this.options.hasOwnProperty(key)) {
                        this.settings[key] = this.options[key];
                        console.log(key + '=' + this.options[key]);
                    }
                }
                this.settings.element = this.graphEl;
            }

            this.graph.configure(this.settings);
        }

        if (this.features) {
            if (this.features.hover) {
                let hoverConfig: any = {
                    graph: this.graph
                };
                hoverConfig.xFormatter = this.features.hover.xFormatter;
                hoverConfig.yFormatter = this.features.hover.yFormatter;
                hoverConfig.formatter = this.features.hover.formatter;
                let hoverDetail = new Rickshaw.Graph.HoverDetail(hoverConfig);
            }

            if (this.features.palette) {
                let palette = new Rickshaw.Color.Palette({scheme: this.features.palette});
                for (let i = 0; i < this.settings.series.length; i++) {
                    this.settings.series[i].color = palette.color();
                }
            }
        }

        if (this.renderer) {
            this.graph.setRenderer(this.renderer);
        }

        this.redraw();

        if (this.features) {
            if (this.features.xAxis) {
                if (!this.xAxis) {
                    let xAxisConfig: any = {
                        graph: this.graph
                    };
                    if (this.features.xAxis.timeUnit) {
                        let time = new Rickshaw.Fixtures.Time();
                        xAxisConfig.timeUnit = time.unit(this.features.xAxis.timeUnit);
                    }
                    if (this.features.xAxis.tickFormat) {
                        xAxisConfig.tickFormat = this.features.xAxis.tickFormat;
                    }
                    if (this.features.xAxis.ticksTreatment) {
                        xAxisConfig.ticksTreatment = this.features.xAxis.ticksTreatment;
                    }
                    if (this.features.xAxis.time) {
                        if (this.features.xAxis.time.local) {
                            xAxisConfig.timeFixture = new Rickshaw.Fixtures.Time.Local();
                        }
                        this.xAxis = new Rickshaw.Graph.Axis.Time(xAxisConfig);
                    }
                    else {
                        this.xAxis = new Rickshaw.Graph.Axis.X(xAxisConfig);
                    }
                    this.xAxis.render();
                }
                else {
                    // Update xAxis if Rickshaw allows it in future.
                }
            }
            else {
                // Remove xAxis if Rickshaw allows it in future.
            }

            if (this.features.yAxis) {
                let yAxisConfig: any = {
                    graph: this.graph
                };
                if (this.features.yAxis.tickFormat) {
                    let tickFormat = this.features.yAxis.tickFormat;
                    if (typeof tickFormat === 'string') {
                        yAxisConfig.tickFormat = Rickshaw.Fixtures.Number[tickFormat];
                    } else {
                        yAxisConfig.tickFormat = tickFormat;
                    }
                }
                if (!this.yAxis) {
                    this.yAxis = new Rickshaw.Graph.Axis.Y(yAxisConfig);
                    this.yAxis.render();
                }
                else {
                    // Update yAxis if Rickshaw allows it in future.
                }
            }
            else {
                // Remove yAxis if Rickshaw allows it in future.
            }

            if (this.features.legend) {
                if (!this.legendEl) {
                    this.legendEl = '';
                    this.mainEl.append(this.legendEl);

                    let legend = new Rickshaw.Graph.Legend({
                        graph: this.graph,
                        element: this.legendEl
                    });
                    if (this.features.legend.toggle) {
                        let shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
                            graph: this.graph,
                            legend: legend
                        });
                    }
                    if (this.features.legend.highlight) {
                        let highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
                            graph: this.graph,
                            legend: legend
                        });
                    }
                }
            }
            else {
                if (this.legendEl) {
                    this.legendEl.remove();
                    this.legendEl = null;
                }
            }

            if (this.features.preview) {
                if (!this.previewEl) {
                    this.previewEl = '';
                    this.mainEl.append(this.previewEl);

                    new Rickshaw.Graph.RangeSlider.Preview({
                        graph: this.graph,
                        element: this.previewEl
                    });
                }
            }
            else {
                if (this.previewEl) {
                    this.previewEl.remove();
                    this.previewEl = null;
                }
            }
        }
    }
}

@NgModule({
    declarations: [
        rickshaw
    ],
    imports: [],
    exports: [
        rickshaw
    ],
})
export class RickshawModule {

}
