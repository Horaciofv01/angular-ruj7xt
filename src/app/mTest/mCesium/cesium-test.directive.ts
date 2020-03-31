import { Directive, ElementRef } from '@angular/core';

@Directive( {
  selector: '[appCesiumTest]'
} )
export class CesiumTestDirective
{


  constructor ( private el: ElementRef ) { }
  ngOnInit ()
  {
    const viewer = new Cesium.Viewer( this.el.nativeElement );







  }
}
