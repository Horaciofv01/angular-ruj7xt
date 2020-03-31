import { mConfig } from '../../../Commons/mConfig';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import $ from 'jquery';
import { typeRez } from '../../../Balances/Library/m-cesium/Script/MapiCesium';

export class CheckRank
{
    mconfig: mConfig = new mConfig();
    mRankResults: clsBuildRez[] = [];
    mTypeRez: typeRez[];
    rankTable0: RankTitlesTable[] = [];
    rankTable1: RankTitlesTable[] = [];

    ok: number;
    nOk: number;

    constructor ( private _http: HttpClient, viewer: any, private route: ActivatedRoute, mTypeRez: typeRez[] )
    {
        if ( mTypeRez == null )
            return;

        this.mTypeRez = mTypeRez;
        this.getDetailsByRank( _http );
    }

    private getDetailsByRank ( _http: HttpClient )
    {
        $( "#mwaitmediv" ).css( 'display', 'block' );
        let mQueryString: string = this.mconfig.mUrl + "/api/GetRankDetails";
        let params: HttpParams = new HttpParams().set( 'mSelectedRank', $( "#selectorRank" ).val() );
        let obs = _http.get<clsBuildRez[]>( mQueryString, { params: params } )
            .subscribe( ( res ) =>
            {
                this.mRankResults = res;
                this.GetListAllSegments();
                $( "#mwaitmediv" ).css( 'display', 'none' );
            } );
    }

    GetListAllSegments ()
    {
        this.rankTable1 = [];
        this.rankTable0 = [];

        if ( this.mRankResults.length === 0 )
            return;
        let mCounter = 0;
        for ( let i = 0; i < this.mTypeRez.length; i++ )
        {

            console.log( i.toString() + "////" + this.mTypeRez.length );

            if ( i === 79 )
                debugger;

            if (
                ( this.rankTable1.findIndex( x => ( x.PointA === this.mTypeRez[ i ].pa && x.PointB === this.mTypeRez[ i ].pb ) ||
                    ( x.PointB === this.mTypeRez[ i ].pa && x.PointA === this.mTypeRez[ i ].pb ) ) !== -1 ) ||

                ( this.rankTable0.findIndex( x => ( x.PointA === this.mTypeRez[ i ].pa && x.PointB === this.mTypeRez[ i ].pb ) ||
                    ( x.PointB === this.mTypeRez[ i ].pa && x.PointA === this.mTypeRez[ i ].pb ) ) !== -1 )
            ) continue;

            let row: RankTitlesTable = new RankTitlesTable();

            row.PointA = this.mTypeRez[ i ].pa;
            row.PointB = this.mTypeRez[ i ].pb;

            row.mExceptions = this.GetExceptionsNumber( row.PointA, row.PointB );

            if ( row.mExceptions === 0 )
            {
                mCounter++;
                row.id = mCounter;
                this.rankTable0.push( row );
                row.intType = 0;
            }

            if ( row.mExceptions > 0 )
            {
                mCounter++;
                row.id = mCounter;
                this.rankTable1.push( row );
                row.intType = 1;
            }
        }
    }
    GetExceptionsNumber ( PointA: string, PointB: string ): number
    {
        let mNumber = 0;
        let mTempo = this.mRankResults.filter(
            ( x => x.Point_A === PointA && x.Point_B === PointB ) ||
            ( x => x.Point_B === PointA && x.Point_A === PointB )
        );


        for ( let i = 0; i < mTempo.length; i++ )
        {
            if ( mTempo[ i ].SelectedRankError_1 != null )
                mNumber++;

            if ( mTempo[ i ].SelectedRankError_2 != null )
                mNumber++;

            if ( mTempo[ i ].SelectedRankError_3 != null )
                mNumber++;

            if ( mTempo[ i ].SelectedRankError_4 != null )
                mNumber++;

            if ( mTempo[ i ].SelectedRankError_5 != null )
                mNumber++;

            if ( mTempo[ i ].SelectedRankError_6 != null )
                mNumber++;

            if ( mTempo[ i ].SelectedRankError_7 != null )
                mNumber++;

            if ( mTempo[ i ].SelectedRankError_8 != null )
                mNumber++;

            if ( mTempo[ i ].SelectedRankError_9 != null )
                mNumber++;

            if ( mTempo[ i ].SelectedRankError_10 != null )
                mNumber++;

            if ( mTempo[ i ].SelectedRankError_11 != null )
                mNumber++;

            if ( mTempo[ i ].SelectedRankError_12 != null )
                mNumber++;

            if ( mTempo[ i ].SelectedRankError_13 != null )
                mNumber++;

            if ( mTempo[ i ].SelectedRankError_14 != null )
                mNumber++;

        }


        return mNumber;

    }


    FillDetalis ( item: RankTitlesTable )
    {
        let mHtml = "";


        let mNumber = 0;
        let mTempo = this.mRankResults.filter(
            ( x => x.Point_A === item.PointA && x.Point_B === item.PointB ) ||
            ( x => x.Point_B === item.PointA && x.Point_A === item.PointB )
        );


        for ( let i = 0; i < mTempo.length; i++ )
        {
            if ( mTempo[ i ].SelectedRankError_1 != null )
                mHtml = mHtml.concat( '</br>' + mTempo[ i ].SelectedRankError_1 );

            if ( mTempo[ i ].SelectedRankError_2 != null )
                mHtml = mHtml.concat( '</br>' + mTempo[ i ].SelectedRankError_2 );

            if ( mTempo[ i ].SelectedRankError_3 != null )
                mHtml = mHtml.concat( '</br>' + mTempo[ i ].SelectedRankError_3 );

            if ( mTempo[ i ].SelectedRankError_4 != null )
                mHtml = mHtml.concat( '</br>' + mTempo[ i ].SelectedRankError_4 );

            if ( mTempo[ i ].SelectedRankError_5 != null )
                mHtml = mHtml.concat( '</br>' + mTempo[ i ].SelectedRankError_5 );

            if ( mTempo[ i ].SelectedRankError_6 != null )
                mHtml = mHtml.concat( '</br>' + mTempo[ i ].SelectedRankError_6 );

            if ( mTempo[ i ].SelectedRankError_7 != null )
                mHtml = mHtml.concat( '</br>' + mTempo[ i ].SelectedRankError_7 );

            if ( mTempo[ i ].SelectedRankError_8 != null )
                mHtml = mHtml.concat( '</br>' + mTempo[ i ].SelectedRankError_8 );

            if ( mTempo[ i ].SelectedRankError_9 != null )
                mHtml = mHtml.concat( '</br>' + mTempo[ i ].SelectedRankError_9 );

            if ( mTempo[ i ].SelectedRankError_10 != null )
                mHtml = mHtml.concat( '</br>' + mTempo[ i ].SelectedRankError_10 );

            if ( mTempo[ i ].SelectedRankError_11 != null )
                mHtml = mHtml.concat( '</br>' + mTempo[ i ].SelectedRankError_11 );

            if ( mTempo[ i ].SelectedRankError_12 != null )
                mHtml = mHtml.concat( '</br>' + mTempo[ i ].SelectedRankError_12 );

            if ( mTempo[ i ].SelectedRankError_13 != null )
                mHtml = mHtml.concat( '</br>' + mTempo[ i ].SelectedRankError_13 );

            if ( mTempo[ i ].SelectedRankError_14 != null )
                mHtml = mHtml.concat( '</br>' + mTempo[ i ].SelectedRankError_14 );

        }
        mHtml = mHtml.concat( '</br></br></br>' );
        $( "#mDetailsRankHTML" ).html( mHtml )


    }

    mWrite ( _http: HttpClient )
    {
        this.getDetailsByRank( _http );
    }


}

export class clsBuildRez
{
    Point_A: string;
    Point_B: string;
    Height_Difference: string;
    Distance: string;
    Difference_Between_BF: string;
    Date_Measured: Date;
    Name_File: string;
    HighDifferenceByFile: number
    isOK: boolean;
    Num_Across: string;
    Crashes: any;
    InitialHeigh: string;
    DistanceDifferences: number
    DistanceDifferences_FirstError: string;
    Crashes_FirstError: string;
    DateError: string;
    distance40mtsError: string;
    CentrateMaesureToolError: string;
    MeasureToolBFLess2mtsError: string;
    TemperaturesBFError: string;
    MeasureToolBFMoreThan5cmError: string;
    DistanceDifferenceLess2MathSqrtLargeError: string;
    HeighViewLineGreatFrom05mtsError: string;
    DatasIncludeMilimetersError: string;
    Difference_Between_BFError: string;
    HorizontLessThan50Error: string;
    Accurance040Error: string;
    RepeatLineInFiles: string;
    mRank: number;
    point2TimesError: string;
    HeighViewLineMoreThan05: string;
    ErrorFromSelectedRank: string;
    bCheckedBySelectedRank: boolean;
    SelectedRank: string;
    SelectedRankError_1: string;
    SelectedRankError_2: string;
    SelectedRankError_3: string;
    SelectedRankError_4: string;
    SelectedRankError_5: string;
    SelectedRankError_6: string;
    SelectedRankError_7: string;
    SelectedRankError_8: string;
    SelectedRankError_9: string;
    SelectedRankError_10: string;
    SelectedRankError_11: string;
    SelectedRankError_12: string;
    SelectedRankError_13: string;
    SelectedRankError_14: string;
}

export class RankTitlesTable
{

    //1: OK 2 : not OK
    id: number;
    intType: number;
    PointA: string;
    PointB: string;
    mExceptions: number;


    constructor () { }

    //  constructor ( intType: number, PointA: string, PointB: string, mExceptions: number )
    //  {
    //      this.intType = intType;
    //      this.PointA = PointA;
    //     this.PointB = PointB;
    //    this.mExceptions = mExceptions;
    //  }

}

