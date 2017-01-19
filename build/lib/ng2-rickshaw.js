"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var rickshaw = (function () {
    function rickshaw(elementRef) {
        this.elementRef = elementRef;
        this.el = elementRef.nativeElement;
    }
    rickshaw.prototype.onResize = function (event) {
        this.redraw();
    };
    rickshaw.prototype.ngOnChanges = function ($changes) {
        var self = this;
        self.updateConfiguration();
    };
    rickshaw.prototype.redraw = function () {
        this.graph && this.graph.setSize();
        this.graph && this.graph.render();
    };
    rickshaw.prototype._splice = function (args) {
        var data = args.data;
        var series = args.series;
        if (!args.series) {
            return data;
        }
        series.forEach(function (s) {
            var seriesKey = s.key || s.name;
            if (!seriesKey) {
                throw "series needs a key or a name";
            }
            data.forEach(function (d) {
                var dataKey = d.key || d.name;
                if (!dataKey) {
                    throw "data needs a key or a name";
                }
                if (seriesKey == dataKey) {
                    var properties = ['color', 'name', 'data'];
                    properties.forEach(function (p) {
                        if (d[p]) {
                            s[p] = d[p];
                        }
                    });
                }
            });
        });
    };
    rickshaw.prototype.updateData = function () {
        debugger;
        if (this.graph && this.settings) {
            this._splice({ data: this.series, series: this.settings.series });
            this.redraw();
        }
    };
    rickshaw.prototype.updateConfiguration = function () {
        if (!this.graph) {
            this.mainEl = this.el;
            this.graphEl = document.createElement('div');
            this.mainEl.append(this.graphEl);
            this.settings = this.options;
            this.settings.element = this.graphEl;
            this.settings.series = this.series;
            this.graph = new Rickshaw.Graph(this.settings);
        }
        else {
            if (this.options) {
                for (var key in this.options) {
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
                var hoverConfig = {
                    graph: this.graph
                };
                hoverConfig.xFormatter = this.features.hover.xFormatter;
                hoverConfig.yFormatter = this.features.hover.yFormatter;
                hoverConfig.formatter = this.features.hover.formatter;
                var hoverDetail = new Rickshaw.Graph.HoverDetail(hoverConfig);
            }
            if (this.features.palette) {
                var palette = new Rickshaw.Color.Palette({ scheme: this.features.palette });
                for (var i = 0; i < this.settings.series.length; i++) {
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
                    var xAxisConfig = {
                        graph: this.graph
                    };
                    if (this.features.xAxis.timeUnit) {
                        var time = new Rickshaw.Fixtures.Time();
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
                }
            }
            else {
            }
            if (this.features.yAxis) {
                var yAxisConfig = {
                    graph: this.graph
                };
                if (this.features.yAxis.tickFormat) {
                    var tickFormat = this.features.yAxis.tickFormat;
                    if (typeof tickFormat === 'string') {
                        yAxisConfig.tickFormat = Rickshaw.Fixtures.Number[tickFormat];
                    }
                    else {
                        yAxisConfig.tickFormat = tickFormat;
                    }
                }
                if (!this.yAxis) {
                    this.yAxis = new Rickshaw.Graph.Axis.Y(yAxisConfig);
                    this.yAxis.render();
                }
                else {
                }
            }
            else {
            }
            if (this.features.legend) {
                if (!this.legendEl) {
                    this.legendEl = '';
                    this.mainEl.append(this.legendEl);
                    var legend = new Rickshaw.Graph.Legend({
                        graph: this.graph,
                        element: this.legendEl
                    });
                    if (this.features.legend.toggle) {
                        var shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
                            graph: this.graph,
                            legend: legend
                        });
                    }
                    if (this.features.legend.highlight) {
                        var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
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
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], rickshaw.prototype, "options", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], rickshaw.prototype, "series", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], rickshaw.prototype, "features", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], rickshaw.prototype, "renderer", void 0);
    __decorate([
        core_1.HostListener('window:resize', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], rickshaw.prototype, "onResize", null);
    rickshaw = __decorate([
        core_1.Component({
            selector: 'rickshaw',
            template: "",
            encapsulation: core_1.ViewEncapsulation.None,
            styles: [
                "\n      rickshaw {\n        display: block;\n        width: 100%;\n      }\n    "
            ]
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], rickshaw);
    return rickshaw;
}());
exports.rickshaw = rickshaw;
var RickshawModule = (function () {
    function RickshawModule() {
    }
    RickshawModule = __decorate([
        core_1.NgModule({
            declarations: [
                rickshaw
            ],
            imports: [],
            exports: [
                rickshaw
            ],
        }), 
        __metadata('design:paramtypes', [])
    ], RickshawModule);
    return RickshawModule;
}());
exports.RickshawModule = RickshawModule;
