import { Component, OnInit } from '@angular/core';
import { mConfig  } from '../Commons/mConfig';



@Component( {
    selector: 'Page-component',
    templateUrl: './Page.component.html'
} )
export class PageComponent implements OnInit
{


mconfig : mConfig;
    constructor ()
    {

    }

    ngOnInit ()
    {
this.mconfig = new mConfig();

    }
}