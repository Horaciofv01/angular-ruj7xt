import { mSegment } from '../WikiView/step1';
import { typeRez } from '../../../Balances/Library/m-cesium/Script/MapiCesium';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ResumeSegments } from '../../Ts/Stored/Commons'
import { mConfig } from '../../../Commons/mConfig'
import { ShowTableAnalisisGral } from '../WikiView/step2';
import { getMatFormFieldPlaceholderConflictError } from '@angular/material';

export class CreateForms
{

    resumeSegments: ResumeSegments;
    mRes: typeRez[];
    mconfig: mConfig;
    counterRez: number;
    showTableAnalisisGral: ShowTableAnalisisGral[] = [];

    constructor ( private _http: HttpClient, private route: ActivatedRoute,
        resumeSegments: ResumeSegments, mRes: typeRez[], showTableAnalisisGral: ShowTableAnalisisGral[] )
    {
        this.resumeSegments = resumeSegments;
        this.mRes = mRes;
        this.mconfig = new mConfig();
        this.counterRez = 0;
        this.showTableAnalisisGral = showTableAnalisisGral;
    }




    private GetNextRow (): string
    {


        let mReverse: boolean = false;
        let tempo: typeRez = new typeRez();
        if ( this.resumeSegments.msegment[ this.counterRez ] != undefined )
        {
            tempo = this.mRes.find( x => x.pa === this.resumeSegments.msegment[ this.counterRez ].PointA && x.pb === this.resumeSegments.msegment[ this.counterRez ].PointB );

            if ( tempo == undefined )
            {
                tempo = this.mRes.find( x => x.pb === this.resumeSegments.msegment[ this.counterRez ].PointA && x.pa === this.resumeSegments.msegment[ this.counterRez ].PointB );
            }

        }

        let mRezRow: typeRez = new typeRez()

        mRezRow.pa = ( ( !mReverse ) ? this.resumeSegments.msegment[ this.counterRez ].PointA : this.resumeSegments.msegment[ this.counterRez ].PointB );
        mRezRow.pb = ( ( !mReverse ) ? this.resumeSegments.msegment[ this.counterRez ].PointB : this.resumeSegments.msegment[ this.counterRez ].PointA );
        mRezRow.hei = ( ( !mReverse ) ? this.resumeSegments.msegment[ this.counterRez ].HeighDifference : this.resumeSegments.msegment[ this.counterRez ].HeighDifference * -1 );
        mRezRow.dis = this.resumeSegments.msegment[ this.counterRez ].Distance;
        mRezRow.acr = tempo.acr;
        mRezRow.bf = tempo.bf;
        mRezRow.dat = tempo.dat;
        mRezRow.fil = tempo.fil;
        if ( this.showTableAnalisisGral.find( x => x.PA === mRezRow.pa ) != undefined )
        {
            mRezRow.heightPA = this.showTableAnalisisGral.find( x => x.PA === mRezRow.pa ).AltitudePA;
            mRezRow.heightPB = this.showTableAnalisisGral.find( x => x.PB === mRezRow.pb ).AltitudePB;
        }


        return JSON.stringify( mRezRow );
    }


    InsertRezLine ( bOnlyRez: boolean, bWithFA0: boolean, bWithFA1: boolean, byAlphabet: boolean )
    {
        let params = new HttpParams().set( 'mJsonREZ', this.GetNextRow() ).set( 'mFlag', ( ( this.counterRez === 0 ) ? 0 : ( this.counterRez > this.resumeSegments.msegment.length - 1 ) ? -1 : 1 ).toString() );
        let obs = this._http.get<any>( this.mconfig.mUrl + "/mMethods/CreateAndLoadRezFile", { params: params } )
            .subscribe( ( res ) =>
            {
                this.counterRez++;
                if ( this.counterRez >= this.resumeSegments.msegment.length )
                {
                    if ( bOnlyRez )
                    {
                        window.open( this.mconfig.mUrl + "/Files/Calculation/" + res[ 0 ].mres + "/Finnaly/mRez.rez" );
                        return;
                    }
                    if ( bWithFA0 )
                    {

                        this.getCurrentFA0File( byAlphabet );
                        return;
                    }

                }
                this.InsertRezLine( bOnlyRez, bWithFA0, bWithFA1, byAlphabet );
            } );

    }
    getCurrentFA0File ( byAlphabet: boolean )
    {

        let params = new HttpParams().set( 'byAlphabet', byAlphabet.toString() );
        this._http.get<any>( this.mconfig.mUrl + "/mMethods/GetFAO", { params: params } )
            .subscribe( ( res ) =>
            {
                window.open( this.mconfig.mUrl + "/Files/Calculation/" + res[ 0 ].mres + "/Finnaly/mFAO.rez" );
            } );
    }

    GetRezAll ()
    {
        this._http.get<any>( this.mconfig.mUrl + "/mMethods/getUserFolder" )
            .subscribe( ( res ) =>
            {
                window.open( this.mconfig.mUrl + "/Files/Calculation/" + res[ 0 ].mres + "/Finnaly/WikiRez.rez" );
            } );


    }





}
