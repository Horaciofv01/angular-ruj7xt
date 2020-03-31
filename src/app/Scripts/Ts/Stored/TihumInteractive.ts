import { ShowTableAnalisisGral } from '../WikiView/step2';
import $ from 'jquery';
import { CesiumGetObjects } from '../../../Balances/Library/m-cesium/Script/mCesiumGetObjects';
import { mIntIndexes, strKeyValues, Commons } from '../Stored/Commons'
import { RankTable } from '../../Ts/Params/Rank';
import { typeCsv, mService } from '../../../Balances/Library/m-cesium/Script/MapiCesium';
import { mSegment, clsLineDatas } from '../WikiView/step1';
import { mLinesLoops_01 } from '../../Ts/WikiView/step1'
import { WikiViewCalculation } from '../../Ts/WikiView/mCalculation'


export class TihumInteractive
{




    showTableAnalisisGral: ShowTableAnalisisGral[];
    SelectedSegmentsAnalisisGral: ShowTableAnalisisGral[][];

    selectKitzvat: boolean;
    bAlltoTihum: boolean = false;
    GetObects: CesiumGetObjects;
    m_IntIndexes: mIntIndexes[] = [];
    firstResults: FirstResultsTihum;
    tableFirstResults: strKeyValues[];

    mRank: number = 1;
    mRankTable: RankTable;

    //1: loop, 0: line
    objectType: number;
    bIsNew: boolean = false;


    constructor ( showTableAnalisisGral: ShowTableAnalisisGral[], GetObects: CesiumGetObjects, objectType: number, bIsNew: boolean )
    {

        this.mRankTable = new RankTable();
        this.firstResults = new FirstResultsTihum();
        this.showTableAnalisisGral = showTableAnalisisGral;
        this.GetObects = GetObects;
        this.selectKitzvat = true;
        this.objectType = objectType;
        this.bIsNew = bIsNew;

    }



    CreateGroupBySelectedKnowedPoints ( mFlag: boolean )
    {
        //let mNewGroup: ShowTableAnalisisGral[] = [];
        //this.SelectedSegmentsAnalisisGral = [];
        this.m_IntIndexes = [];

        let flagPA: boolean = false;
        let flagPB: boolean = false;

        let indexA: number;
        let indexB: number;

        let Counter1: number = 0;
        let Counter2: number = 0;

        if ( this.showTableAnalisisGral.length === 0 )
        {
            $( "#mwaitmediv" ).css( 'display', 'none' );
            return;
        }

        for ( let i = 0; i < this.showTableAnalisisGral.length; i++ )
        {
            if ( flagPA === false && this.GetObects.mObjects.mCsv.find( x => x.nam === this.showTableAnalisisGral[ i ].PA ).bValid )
            {
                flagPA = true;
                indexA = i;
            }

            if ( flagPB === false && this.GetObects.mObjects.mCsv.find( x => x.nam === this.showTableAnalisisGral[ i ].PB ).bValid )
            {
                flagPB = true;
                indexB = i;
            }

            Counter2++;

            if ( flagPA && flagPB )
            {
                Counter1++;
                flagPA = false;
                flagPB = false;
                this.m_IntIndexes.push( new mIntIndexes( indexA, indexB, Counter1, Counter2 ) );
                Counter2 = 0;

            }
        }
        //Go to calculations by way of his.SelectRowToCalculate_01
        this.fillDropDown( this.m_IntIndexes, mFlag );

    }


    // $( "#mwaitmediv" ).css( 'display', 'block' );
    //$( "#cesiumcontainer" ).css( 'display', 'none' );
    // setTimeout( () =>
    // {

    //  $( "#mwaitmediv" ).css( 'display', 'none' );
    //  $( "#cesiumcontainer" ).css( 'display', 'block' );

    // }, 1 );



    fillDropDown ( m_IntIndexes: mIntIndexes[], mFlag: boolean )
    {

        if ( mFlag != true || $( "#selectorSegementGroups" ).val() == "-1" )
        {
            $( "#firstResultTable_html" ).css( 'display', 'none' );
            $( "#selectorSegementGroups" ).empty();
            $( "#selectorSegementGroups" ).append( '<option value="-1">בחר</option>' );

            this.resetTableColor();

            if ( m_IntIndexes.length === 0 )
            {
                $( "#mwaitmediv" ).css( 'display', 'none' );
                return;
            }



            $( "#mwaitmediv" ).css( 'display', 'block' );
            //$( "#cesiumcontainer" ).css( 'display', 'none' );
            for ( let i = 0; i < m_IntIndexes.length; i++ )
            {
                let mCaption = m_IntIndexes[ i ].mIndex3.toString() + " -  קטעים נבחרים = " + m_IntIndexes[ i ].mIndex4.toString();
                let mValue: string = m_IntIndexes[ i ].mIndex1.toString() + "&" + m_IntIndexes[ i ].mIndex2.toString();
                $( "#selectorSegementGroups" ).append( "<option value='" + mValue + "'>" + mCaption.toString() + "</option>" );

                // setTimeout( () =>
                // {
                //  if ( ( i === m_IntIndexes.length - 1 ) )
                //   debugger;




                this.SelectRowToCalculate_01( mValue, false, ( ( i === m_IntIndexes.length - 1 ) ? true : false ), mFlag );
                // }, 1 );
            }

        }

        if ( mFlag == true )//from gravimetrie
        {
            for ( let i = 0; i < m_IntIndexes.length; i++ )
            {
                this.SelectRowToCalculate_01( $( "#selectorSegementGroups" ).val(), false, ( ( i === m_IntIndexes.length - 1 ) ? true : false ), mFlag );
                //   }
            }
        }




    }




    newCheckBoxTry ( item: ShowTableAnalisisGral, isPA: boolean, event: any )
    {
        this.newCheckBoxTry_01( item.PA, item.PB, isPA, event, this.GetObects.mObjects );
    }
    newCheckBoxTry_01 ( PA: string, PB: string, isPA: boolean, event: any, mObjects: mService )
    {

        $( "#mwaitmediv" ).css( 'display', 'block' );
        setTimeout( () =>
        {

            if ( isPA )
            {
                let mIndex = mObjects.mCsv.findIndex( x => x.nam === PA );
                mObjects.mCsv[ mIndex ].bValid = event.srcElement.checked;
                $( ".nCheckToTry_" + PA ).prop( 'checked', event.srcElement.checked )
            }
            else
            {
                if ( PA != PB )
                {
                    let mIndex = mObjects.mCsv.findIndex( x => x.nam === PB );
                    mObjects.mCsv[ mIndex ].bValid = event.srcElement.checked;
                    $( ".nCheckToTry_" + PB ).prop( 'checked', event.srcElement.checked );
                }

            }
            this.CreateGroupBySelectedKnowedPoints( false );

        }, 1 )
    }



    resetTableColor ()
    {
        let mElemets = document.getElementsByName( "showTableAnalisisGral_row" );
        let mFlag: boolean = false;
        for ( let i = 0; i < mElemets.length; i++ )
        {
            if ( mFlag )
                mElemets[ i ].style.backgroundColor = "#d7e5f1";
            else mElemets[ i ].style.backgroundColor = "#fff";

            mFlag = !mFlag;
        }
    }

    SelectRowToCalculate_01 ( mValue: string, bRepaint: boolean, bLast: boolean, mFlag: boolean )
    {
        this.firstResults = new FirstResultsTihum();
        if ( mValue === "-1" )
        {

            this.resetTableColor();
            if ( mFlag != true )
                $( "#firstResultTable_html" ).css( 'display', 'none' );
            return;

        }
        if ( bRepaint )
            this.resetTableColor();

        let index1: number = parseInt( mValue.split( '&' )[ 0 ] );
        let index2: number = parseInt( mValue.split( '&' )[ 1 ] );

        let miniVectorsV: number[] = [];

        for ( let i = index1; i <= index2; i++ )
        {
            if ( bRepaint )
                $( "#showTableAnalisisGral_row_" + ( i ).toString() ).css( 'background-color', 'yellow' );

            this.firstResults.BF_FB += this.showTableAnalisisGral[ i ].BF_FB;

            this.firstResults.EfreshMeasuredHeight += this.showTableAnalisisGral[ i ].HeighDifByRez;
            this.firstResults.EfreshMeasuredHeightOriginal += this.showTableAnalisisGral[ i ].HeighDifByRezOriginal;

            this.firstResults.mDistance += this.showTableAnalisisGral[ i ].Distance;
            miniVectorsV.push( this.showTableAnalisisGral[ i ].Distance );
        }

        this.firstResults.BF_FB = this.firstResults.BF_FB / 1000;
        this.firstResults.EfreshBangalHeight += this.showTableAnalisisGral[ index2 ].heigBangalB - this.showTableAnalisisGral[ index1 ].heigBangalA;
        this.firstResults.vectorIsguira = this.firstResults.EfreshBangalHeight - this.firstResults.EfreshMeasuredHeight;

        this.firstResults.vectorIsguiraOriginal = this.firstResults.EfreshBangalHeight - this.firstResults.EfreshMeasuredHeightOriginal;;


        this.firstResults.WrongedMeasuredHeight = this.firstResults.EfreshMeasuredHeight + this.firstResults.vectorIsguira;

        this.firstResults.Efresh_WrongedMeasuredHeight_EfreshBangalHeight = this.firstResults.WrongedMeasuredHeight - this.firstResults.EfreshBangalHeight;
        this.firstResults.mRank = this.mRank;
        let mRank8Value: number = this.mRankTable.getRankValue( 8, this.mRank );
        if ( mRank8Value != null )
            this.firstResults.maximumDistanceTolerance = mRank8Value.toString();
        else this.firstResults.maximumDistanceTolerance = 'לא מודגר';

        this.firstResults.mTolerance = this.mRankTable.getPermittedLargeByRank( this.objectType, this.firstResults.mDistance, this.mRank );

        if ( bRepaint )
            $( "#firstResultTable_html" ).css( 'display', 'block' );
        else
            if ( mFlag != true )
                $( "#firstResultTable_html" ).css( 'display', 'none' );

        ////////////////////CALCULATE OTHER TABLE ELEMENTS//////////////////////////////

        let commons: Commons = new Commons();

        let mMiniVectors: number[] = commons.CalculateProportions( this.firstResults.vectorIsguira, miniVectorsV );
        let mMiniVectorsOriginal: number[] = commons.CalculateProportions( this.firstResults.vectorIsguiraOriginal, miniVectorsV );
        let mCounter: number = 0;

        for ( let i = index1; i <= index2; i++ )
        {
            if ( i === index1 )
            {
                this.showTableAnalisisGral[ i ].AltitudePA = this.showTableAnalisisGral[ i ].heigBangalA
                if ( this.showTableAnalisisGral[ i ].AltitudePA != null )
                {
                    $( "#showTGral_AltitudePA_" + i.toString() ).html( commons.get10SpacesHtml( this.showTableAnalisisGral[ i ].AltitudePA.toString() ) );
                    $( "#showTGral_AltitudePA_" + i.toString() ).css( 'background-color', '#bce6bc' )
                }
                else
                {
                    $( "#showTGral_AltitudePA_" + i.toString() ).html( '' );
                    $( "#showTGral_AltitudePA_" + i.toString() ).css( 'background-color', '#bce6bc' )
                }

            }
            if ( i === index2 )
            {
                if ( this.showTableAnalisisGral[ i ].heigBangalB != null )
                {
                    this.showTableAnalisisGral[ i ].AltitudePB = this.showTableAnalisisGral[ i ].heigBangalB;
                    $( "#showTGral_AltitudePB_" + i.toString() ).html( commons.get10SpacesHtml( this.showTableAnalisisGral[ i ].AltitudePB.toString() ) );
                    $( "#showTGral_AltitudePB_" + i.toString() ).css( 'background-color', '#bce6bc' );
                }
                else
                {
                    $( "#showTGral_AltitudePB_" + i.toString() ).html( '' );
                    $( "#showTGral_AltitudePB_" + i.toString() ).css( 'background-color', '#bce6bc' )
                }
            }

            this.showTableAnalisisGral[ i ].WVector = mMiniVectors[ mCounter ];
            this.showTableAnalisisGral[ i ].WVectorOriginal = mMiniVectorsOriginal[ mCounter ];


            $( "#showTGral_WVector_" + i.toString() ).html( commons.get10SpacesHtml( this.showTableAnalisisGral[ i ].WVector.toString() ) +
                "<div class='originalDiv'>" + commons.get10SpacesHtml( this.showTableAnalisisGral[ i ].WVectorOriginal.toString() + "</div>" )
            );

            this.showTableAnalisisGral[ i ].HeighDifCalculated = this.showTableAnalisisGral[ i ].HeighDifByRez + mMiniVectors[ mCounter ];
            $( "#showTGral_HeighDifCalculated_" + i.toString() ).html( commons.get10SpacesHtml( this.showTableAnalisisGral[ i ].HeighDifCalculated.toString() ) +
                "<div class='originalDiv'>" + commons.get10SpacesHtml( ( this.showTableAnalisisGral[ i ].HeighDifByRezOriginal + this.showTableAnalisisGral[ i ].WVectorOriginal ).toString() + "</div>" )
            )

            if ( i !== index1 )
            {
                this.showTableAnalisisGral[ i ].AltitudePA = this.showTableAnalisisGral[ i - 1 ].AltitudePB;
                $( "#showTGral_AltitudePA_" + i.toString() ).html( commons.get10SpacesHtml( this.showTableAnalisisGral[ i ].AltitudePA.toString() ) );
                $( "#showTGral_AltitudePA_" + i.toString() ).css( 'background-color', '#ffffff' )
            }
            //Calculating Gova B
            if ( i !== index2 )
            {
                this.showTableAnalisisGral[ i ].AltitudePB = this.showTableAnalisisGral[ i ].AltitudePA + this.showTableAnalisisGral[ i ].HeighDifCalculated;
                $( "#showTGral_AltitudePB_" + i.toString() ).html( commons.get10SpacesHtml( this.showTableAnalisisGral[ i ].AltitudePB.toString() ) );
                $( "#showTGral_AltitudePB_" + i.toString() ).css( 'background-color', '#ffffff' )
            }

            mCounter++;
        }

        this.GenerateTableFirstResults( this.firstResults, this.firstResults.mTolerance );


        if ( bLast )
        {

            $( "#mwaitmediv" ).css( 'display', 'none' );
            // $( "#cesiumcontainer" ).css( 'display', 'block' );
        }

    }

    SelectRowToCalculate ( event: any, bRepaint: boolean )
    {
        this.SelectRowToCalculate_01( event.srcElement.value, true, true, false );
    }

    SetRank ( event: any, arg1: boolean )
    {
        this.mRank = event.srcElement.value;

        setTimeout( () =>
        {
            this.SelectRowToCalculate_01( $( "#selectorSegementGroups" ).val(), true, true, false );
        }, 1 );
    }

    //This was generate cause the 10 space not refresh the data automatically only by refersh the full table
    GenerateTableFirstResults ( firstResults: FirstResultsTihum, mError: number )
    {
        //.RedText{ color: red; font - weight: bold }
        //.GreenText{ color: rgb( 42, 155, 57 ); font - weight: bold }

        this.tableFirstResults = [];
        let mColor: string;
        this.tableFirstResults.push( new strKeyValues( 'הפרש גובה מדוד', firstResults.EfreshMeasuredHeight.toString(), null, null ) );

        this.tableFirstResults.push( new strKeyValues( 'הפרש גובה ידוע', firstResults.EfreshBangalHeight.toString(), null, null ) );

        if ( mError < firstResults.vectorIsguira )
            mColor = 'RedText';
        else mColor = 'GreenText';

        this.tableFirstResults.push( new strKeyValues( 'וקטור אי סגירה מתוקן', firstResults.vectorIsguira.toString(), mColor, null ) );

        if ( mError < firstResults.vectorIsguiraOriginal )
            mColor = 'RedText';
        else mColor = 'GreenText';

        this.tableFirstResults.push( new strKeyValues( 'וקטור אי סגירה מקור', firstResults.vectorIsguiraOriginal.toString(), mColor, null ) );

        this.tableFirstResults.push( new strKeyValues( 'הפרש גובה מדוד מתוקן', firstResults.WrongedMeasuredHeight.toString(), null, null ) );
        this.tableFirstResults.push( new strKeyValues( 'הפרש בין גובה מדוד מתוקן לידוע', firstResults.Efresh_WrongedMeasuredHeight_EfreshBangalHeight.toString(), null, null ) );

        if ( mError < firstResults.BF_FB )
            mColor = 'RedText';
        else mColor = 'GreenText';
        this.tableFirstResults.push( new strKeyValues( 'הפרש בין הלוך לחזור', firstResults.BF_FB.toString(), mColor, null ) );

        this.tableFirstResults.push( new strKeyValues( 'דרגה הנבחרה', firstResults.mRank.toString(), null, null ) );

        if ( firstResults.maximumDistanceTolerance !== 'לא מודגר' )
            if ( parseFloat( firstResults.maximumDistanceTolerance ) < firstResults.mDistance )
                mColor = 'RedText';
            else mColor = 'GreenText';
        else mColor = 'GreenText';


        this.tableFirstResults.push( new strKeyValues( 'מרחק', firstResults.mDistance.toString(), mColor, null ) );
        this.tableFirstResults.push( new strKeyValues( 'חריגה מותרת', firstResults.mTolerance.toString(), null, null ) );
        this.tableFirstResults.push( new strKeyValues( 'אורך קו איזון מקסימלי', firstResults.maximumDistanceTolerance.toString(), null, null ) );

    }


    CalculateTihumTable ()
    {
        $( "#mwaitmediv" ).css( 'display', 'block' );
        setTimeout( () =>
        {
            $( '#Div1_LineChecks01Selector' ).css( 'background-color', 'white' );
            $( '#Div1_LineChecks01Selector1' ).css( 'left', '35px' );

            for ( let i = 0; i < this.GetObects.mObjects.mCsv.length; i++ )
            {
                let mCsv: typeCsv = this.GetObects.mObjects.mCsv[ i ];
                $( ".nCheckToTry_" + mCsv.nam ).prop( 'checked', mCsv.bValid )
            }
            //Go to calculations by way of this.fillDropDown and this.SelectRowToCalculate_01
            this.CreateGroupBySelectedKnowedPoints( false );
        }, 1 )
    }
    BiltiTluiotLaTihum (): boolean
    {
        this.bAlltoTihum = !this.bAlltoTihum;
        if ( this.bAlltoTihum === false )
        {
            $( '#Div1_BiltiTluiotLaTihumSelector' ).css( 'background-color', 'white' );
            $( '#Div1_BiltiTluiotLaTihumSelector1' ).css( 'left', '35px' );
        }
        else
        {
            $( '#Div1_BiltiTluiotLaTihumSelector' ).css( 'background-color', 'yellowgreen' );
            $( '#Div1_BiltiTluiotLaTihumSelector1' ).css( 'left', '1px' );

        }
        return this.bAlltoTihum;
    }

    SelectKitzvat ()
    {
        if ( this.showTableAnalisisGral === null )
        {
            $( "#mDeleteProjectMessageAdvertence" ).css( 'display', 'block' );
            $( "#AdevrtenceMessadeTD" ).html( 'לא בחרו אובייקט' );
            return;

        }



        //This ends in method filldd
        $( "#mwaitmediv" ).css( 'display', 'block' );
        //$( "#cesiumcontainer" ).css( 'display', 'none' );
        ///////////


        setTimeout( () =>
        {



            this.selectKitzvat = !this.selectKitzvat;
            if ( this.selectKitzvat === false )
            {
                //All valid points has true;
                $( '#Div1_LineChecks01Selector' ).css( 'background-color', 'yellowgreen' );
                $( '#Div1_LineChecks01Selector1' ).css( 'left', '1px' );

                let mFirst: string = this.showTableAnalisisGral[ 0 ].PA;
                let mLast: string = this.showTableAnalisisGral[ this.showTableAnalisisGral.length - 1 ].PB;

                for ( let i = 0; i < this.GetObects.mObjects.mCsv.length; i++ )
                {

                    let mCsv: typeCsv = this.GetObects.mObjects.mCsv[ i ];

                    if ( ( mCsv.nam === mFirst || mCsv.nam === mLast ) )
                    {
                        mCsv.bValid = true;
                        $( ".nCheckToTry_" + mCsv.nam ).prop( 'checked', true );
                        continue;
                    }

                    if ( mCsv.heiort != null )
                    {
                        mCsv.bValid = false;
                        $( ".nCheckToTry_" + mCsv.nam ).prop( 'checked', false );
                    }
                    else
                    {
                        mCsv.bValid = false;
                        $( ".nCheckToTry_" + mCsv.nam ).prop( 'checked', false );
                    }
                }
            }
            else
            {

                //Only the corner points has true;
                $( '#Div1_LineChecks01Selector' ).css( 'background-color', 'white' );
                $( '#Div1_LineChecks01Selector1' ).css( 'left', '35px' );

                for ( let i = 0; i < this.GetObects.mObjects.mCsv.length; i++ )
                {
                    let mCsv: typeCsv = this.GetObects.mObjects.mCsv[ i ];
                    // break;
                    if ( mCsv.heiort != null )
                    {
                        mCsv.bValid = true;
                        $( ".nCheckToTry_" + mCsv.nam ).prop( 'checked', true );
                    }
                    else
                    {
                        mCsv.bValid = false;
                        $( ".nCheckToTry_" + mCsv.nam ).prop( 'checked', false );
                    }
                }
            }
            //Go to calculations by way of this.fillDropDown and this.SelectRowToCalculate_01
            this.CreateGroupBySelectedKnowedPoints( false );
        }, 1 );

    }
}

export class SegmentsToTihum
{
    //nType
    //1: net calculated tihum
    //2: selected on map;
    //3: getted from clacultions
    //4: Geted from knowed points.
    PA: string;
    PB: string;
    nType: number;
    msegments: mSegment[];
    id: number;
    perimeter: number;
    closeVector: number;
    segmentsCount: number;
    mArea: number;
    mFiles: string;
    strDescrption: string;
    mIndex: string;
    mUniqueID: number;
    mTypeTotihum: number;


    constructor ( nType: number, msegments: mSegment[], id: number, mCsv: typeCsv[], mIndex: string, mTypeTotihum: number )
    {
        let wikiViewCalculation: WikiViewCalculation = new WikiViewCalculation( mCsv );
        this.nType = nType;

        if ( mTypeTotihum === 0 )
            this.strDescrption = "קו נתגלתה מבחירה ידני";

        if ( mTypeTotihum === 1 )
            this.strDescrption = "לולאה נתגלתה מבחירה ידני";

        if ( mTypeTotihum === 2 )
            this.strDescrption = "לולאה נתגלתה כבלתי תלויה";

        if ( mTypeTotihum === 4 )
            this.strDescrption = "קו נבנה ע''פ נקודות ידועות";

        this.mIndex = mIndex;

        this.msegments = msegments;
        this.id = id;

        let mlinesLoops_01: mLinesLoops_01 = new mLinesLoops_01();
        let mDatas: clsLineDatas = mlinesLoops_01.getLineDatas( msegments );
        this.perimeter = mDatas.perimeter;
        this.segmentsCount = mDatas.mSize;
        this.PA = msegments[ 0 ].lstSegment[ 0 ].PointA;

        this.PB = msegments[ msegments.length - 1 ].lstSegment[ msegments[ msegments.length - 1 ].lstSegment.length - 1 ].PointB;

        if ( this.PA === this.PB )
            this.mArea = wikiViewCalculation.GetPolygonArea( msegments );

        this.closeVector = mDatas.closeVector;
        this.mFiles = mDatas.files;
        this.mTypeTotihum = mTypeTotihum;



    }
}

export class FirstResultsTihum
{

    EfreshMeasuredHeight: number;
    EfreshMeasuredHeightOriginal: number;
    EfreshBangalHeight: number;
    vectorIsguira: number;
    vectorIsguiraOriginal: number;
    WrongedMeasuredHeight: number;
    Efresh_WrongedMeasuredHeight_EfreshBangalHeight: number;
    BF_FB: number;
    mRank: number;
    mTolerance: number;
    maximumDistanceTolerance: string;
    mDistance: number;


    constructor ()
    {
        this.EfreshMeasuredHeight = 0;
        this.EfreshBangalHeight = 0;
        this.vectorIsguira = 0;
        this.WrongedMeasuredHeight = 0;
        this.Efresh_WrongedMeasuredHeight_EfreshBangalHeight = 0;
        this.BF_FB = 0;
        this.mRank = 0;
        this.mTolerance = 0;
        this.maximumDistanceTolerance = '';
        this.mDistance = 0;
        this.vectorIsguiraOriginal = 0;
        this.EfreshMeasuredHeightOriginal = 0;
    }

}

