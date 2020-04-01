import { Component, OnInit, Input } from '@angular/core';
import { mConfig  } from '../../mConfig';


@Component( {
    selector: 'Logos-component',
    templateUrl: './Logos.component.html'
} )
export class LogosComponent implements OnInit
{


    @Input() mSubTitle: string;
    @Input() mTitle: string;

    mconfig : mConfig;

    constructor ()
    {

    }

    ngOnInit ()
    {
        document.getElementById( "mTitle" ).innerHTML = this.mTitle;
        document.getElementById( "mSubTitle" ).innerHTML = this.mSubTitle;

        if ( this.mTitle == '' && this.mSubTitle == '' )
            document.getElementById( "mPageTitles" ).style.display = "none";


        this.mconfig = new mConfig();

    }
}



