import { Component, OnInit, Input } from '@angular/core';
import { Commons } from '../../Scripts/Ts/Stored/Commons'

@Component( {
  selector: 'app-spaces10',
  templateUrl: './spaces10.component.html'

} )
export class Spaces10Component implements OnInit
{

  constructor () { }

  @Input() mImput: string;


  mResult: string[] = [];


  ngOnInit ()
  {



    let commons: Commons = new Commons();
    this.mResult = commons.spaces10_Array( this.mImput );

  }
}
