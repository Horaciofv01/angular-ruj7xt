import { Component, OnInit, Input } from '@angular/core';

@Component( {
    selector: 'Logos-component',
    templateUrl: './Logos.component.html'
} )
export class LogosComponent implements OnInit
{


    @Input() mSubTitle: string;
    @Input() mTitle: string;

    constructor ()
    {

    }

    ngOnInit ()
    {
        document.getElementById( "mTitle" ).innerHTML = this.mTitle;
        document.getElementById( "mSubTitle" ).innerHTML = this.mSubTitle;

        if ( this.mTitle == '' && this.mSubTitle == '' )
            document.getElementById( "mPageTitles" ).style.display = "none";

    }
}



