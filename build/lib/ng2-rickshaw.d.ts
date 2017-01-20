/// <reference path="../../typings/globals/rickshaw/index.d.ts" />
import { OnChanges, ElementRef } from '@angular/core';
export declare class rickshaw implements OnChanges {
    private elementRef;
    options: any;
    series: any;
    features: any;
    renderer: any;
    private el;
    private graph;
    private settings;
    private mainEl;
    private graphEl;
    private legendEl;
    private previewEl;
    private xAxis;
    private yAxis;
    constructor(elementRef: ElementRef);
    onResize(event: any): void;
    ngOnChanges($changes: any): void;
    redraw(): void;
    _splice(args: any): any;
    updateData(): void;
    updateConfiguration(): void;
}
export declare class RickshawModule {
}
