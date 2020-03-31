import { Commons, mVertices, Projects, m2Points } from '../../../Scripts/Ts/Stored/Commons';

import { WV_Main } from '../../../Scripts/Ts/WikiView/WV_Main';


import { ObjectTypeBox, ShowOnFirstTable, ShowTableAnalisisGral } from '../../../Scripts/Ts/WikiView/step2';
import { mSegment, mLinesLoops_01 } from '../../../Scripts/Ts/WikiView/step1';
import { mCesiumSelectedRectangle } from '../m-cesium/Script/mCesiumSelectedRectangle';
import { MapiCesium, typeCsv, mService, typeRez, mSelectedAndAll, mProject } from '../m-cesium/Script/MapiCesium';
import { ManageObjectcs } from '../m-cesium/Script/ManageObjects';
import { CesiumGetObjects } from '../m-cesium/Script/mCesiumGetObjects';
import { SegmentsToTihum, TihumInteractive } from '../../../Scripts/Ts/Stored/TihumInteractive';
import $ from 'jquery';
import { CheckRank, RankTitlesTable } from '../../../Scripts/Ts/Stored/CheckRank';
import { TablePointHeights, TableDeltaHeights, HeightCalculation } from '../../../Scripts/Ts/Stored/HeightCalculation_Main1';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { SolveLoosFirstData, SolveLoopsNets_Main1 } from '../../../Scripts/Ts/SolveLoops/SolveLoopsNets_Main1';
import { mGravimetria } from '../../../Scripts/Ts/Stored/Gravimetria';
import { SolveLoopsNets_Main2 } from '../../../Scripts/Ts/SolveLoops/SolveLoopsNets_Main2';
import { Observable, fromEventPattern } from 'rxjs';
import { map, startWith, timeout } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { mConfig } from '../../../Commons/mConfig';

export class BalancesSelector_UI
{
    bCheckIfExistantOn2Points ( mTempo: mSegment, m2Segments: m2Points[] ): boolean
    {
        if ( m2Segments.findIndex( x => ( x.PA === mTempo.PointA && x.PB === mTempo.PointB ) || ( x.PB === mTempo.PointA && x.PA === mTempo.PointB ) ) != -1 )
            return true;//exists

        return false;//not exists
    }
    bCheckLoopInArray ( m2Segments: m2Points[], Line: mSegment[] ): boolean
    {
        if ( m2Segments.length === 0 )
            return false;

        for ( let i = 0; i < Line.length; i++ )
        {
            for ( let j = 0; j < Line[ i ].lstSegment.length; j++ )
            {
                if ( !this.bCheckIfExistantOn2Points( Line[ i ].lstSegment[ j ], m2Segments ) )
                {
                    //Theres a not existance side shoulg go
                    return false;
                }
            }
        }

        //All sedies exists, so it's go out
        return true;
    }
    DeleteTihumListed ( id: number, mIndex: string, segmentsToTihum: SegmentsToTihum[] )
    {

        let ind: number = segmentsToTihum.findIndex( x => x.id === id );
        if ( ind !== -1 )
        {
            segmentsToTihum.splice( ind, 1 );

            $( ".div_AddDeleteTotihum_" + mIndex.toString() ).css( 'background-color', '#5cb85c' ).html( '+' )

        }
    }
    AddNewSegmentToSelected ( mIndex: string, event: any, segmentsToTihum: SegmentsToTihum[], segmentsToTihum_order: number, commons: Commons, mUniqueIDToObject: number, vwmain: WV_Main, objectType: number, mObjects: mService, bBiltiTluia: boolean )
    {
        let msegment: mSegment[] = this.GetSegmentByIndex( mIndex, objectType, vwmain );
        if ( event.srcElement.innerHTML.indexOf( '+' ) !== -1 )
        {
            let mLstIndex = this.findSameSegemntOnTihum( msegment, segmentsToTihum );
            if ( mLstIndex !== -1 )
            {
                $( "#mDeleteProjectMessageAdvertence" ).css( 'display', 'block' );
                $( "#AdevrtenceMessadeTD" ).html( 'סגמנת כבר קיים ברשימה' );
                $( "#mwaitmediv" ).css( 'display', 'none' );
                return;
            }

            $( ".div_AddDeleteTotihum_" + mIndex.toString() ).css( 'background-color', '#d9534f' ).html( this.commons._x )


            segmentsToTihum_order++;
            mUniqueIDToObject++;
            segmentsToTihum.push( new SegmentsToTihum( objectType, msegment, segmentsToTihum_order, mObjects.mCsv, mIndex, ( ( bBiltiTluia ) ? 2 : 1 ) ) );

        } else
        {
            let mIndex1 = this.findSameSegemntOnTihum( msegment, segmentsToTihum );
            $( ".div_AddDeleteTotihum_" + mIndex.toString() ).css( 'background-color', '#5cb85c' ).html( '+' );
            if ( mIndex1 !== -1 )
                segmentsToTihum.splice( mIndex1, 1 );
        }
    }



    showSegment ( item: ShowTableAnalisisGral, bWithZoom: boolean, handler: any, scene: any, viewer: any )
    {
        let selecting: mCesiumSelectedRectangle = new mCesiumSelectedRectangle( handler, scene, viewer );
        selecting.DeselectAll();
        this.ShowSegmentByName( item.PA, item.PB, bWithZoom, viewer );
    }
    PaintSelectedSegment ( PA: string, PB: string, viewer: any )
    {
        let mapiCesium: MapiCesium = new MapiCesium();
        let manageObjectcs: ManageObjectcs = new ManageObjectcs( viewer );
        let mEntitie: any = manageObjectcs.GetEntitieByName( PA, PB, mapiCesium.mTypeLine, viewer );

        if ( mEntitie == null )
            return;

        mEntitie.polyline.material.color = Cesium.Color.DEEPPINK;

        mEntitie = manageObjectcs.GetEntitieByName( PA, PB, mapiCesium.mTypePoint, viewer );
        mEntitie.point.color = Cesium.Color.DEEPPINK;
    }
    showPoint_01 ( mPointData: typeCsv, bWithZoom: boolean, mObjects: mService, handler: any, scene: any, viewer: any )
    {
        let mItem: typeCsv = mObjects.mCsv.find( x => x.nam === mPointData.nam );
        if ( mItem != null )
            this.showPointByName( mItem.nam, bWithZoom, handler, scene, viewer, mObjects )
    }

    showPointByName ( mName: string, bWithZoom: boolean, handler: any, scene: any, viewer: any, mObjects: mService )
    {
        let selecting: mCesiumSelectedRectangle = new mCesiumSelectedRectangle( handler, scene, viewer );
        selecting.DeselectAll();

        let mapiCesium: MapiCesium = new MapiCesium();
        let manageObjectcs: ManageObjectcs = new ManageObjectcs( viewer );
        let mEntitie = manageObjectcs.GetEntitieByName( mName, null, mapiCesium.mTypePoint, viewer );
        mEntitie.point.color = Cesium.Color.DEEPPINK;

        if ( bWithZoom )
        {
            let mRes: typeCsv = mapiCesium.GetDataPointFromCSV( mObjects, mName );
            let mCoo: number[] = mapiCesium.proj4From2039_to_WGS84( mRes.x, mRes.y, mRes.heiort );
            const mRectangle: number = 0.03;

            let mResult: number[] = [];
            mResult.push( mCoo[ 0 ] - mRectangle );
            mResult.push( mCoo[ 1 ] - mRectangle );
            mResult.push( mCoo[ 2 ] );
            mResult.push( mCoo[ 0 ] + mRectangle );
            mResult.push( mCoo[ 1 ] + mRectangle );
            mResult.push( mCoo[ 2 ] );

            let mfly: string[] = [];
            mfly.push( ( mCoo[ 0 ] - mRectangle ).toString() );
            mfly.push( ( mCoo[ 1 ] - mRectangle ).toString() );
            mfly.push( ( mCoo[ 2 ] ).toString() );
            mfly.push( ( mCoo[ 0 ] + mRectangle ).toString() );
            mfly.push( ( mCoo[ 1 ] + mRectangle ).toString() );
            mfly.push( ( mCoo[ 2 ] ).toString() );

            this.mCesiumFlyToArray( mfly, viewer.camera );
        }
    }


    SelectRow01 ( mName: string, item: ShowOnFirstTable )
    {
        var mRows = document.getElementsByName( mName );
        let mFlag: boolean = true;
        for ( let i = 0; i < mRows.length; i++ )
        {
            //#d7e5f1
            if ( mFlag )
                mRows[ i ].style.backgroundColor = '#ffffff';
            else
            {
                if ( mName === 'linesRows' )
                    mRows[ i ].style.backgroundColor = '#d7e5f1';

                if ( mName === 'loopsRows' )
                    mRows[ i ].style.backgroundColor = '#c7ddc7';


                if ( mName === 'pointRows' )
                    mRows[ i ].style.backgroundColor = '#f0e0cb';

                if ( mName === 'LoopsNETRows' )
                {
                    mRows[ i ].style.backgroundColor = '#f3e9e8';
                }



            }
            mFlag = !mFlag;
        }

        $( "." + mName + "_" + item.mPA + "_" + item.mPB + "_" + item.mOrder ).css( 'backgroundColor', 'yellow' );

    }
    SelectRow02 ( mName: string, item: typeCsv )
    {
        var mRows = document.getElementsByName( mName );
        let mFlag: boolean = true;
        for ( let i = 0; i < mRows.length; i++ )
        {
            //#d7e5f1
            if ( mFlag )
                mRows[ i ].style.backgroundColor = 'white';
            else
            {
                if ( mName === 'pointRows' )
                    mRows[ i ].style.backgroundColor = '#f0e0cb';

            }
            mFlag = !mFlag;
        }

        $( "." + mName + "_" + item.nam ).css( 'backgroundColor', 'yellow' );
    }
    SelectRow03 ( mName: string, itemId: number )
    {
        $( "#mDetailsRankHTML" ).html( '</br>ללא רשימות</br></br>' );
        $( "#checkRanktitle" ).html( 'לא בחרו קטע' );

        var mRows = document.getElementsByName( mName );
        let mFlag: boolean = true;
        for ( let i = 0; i < mRows.length; i++ )
        {
            //#d7e5f1
            if ( mFlag )
                mRows[ i ].style.backgroundColor = 'white';
            else
            {
                if ( mName === 'RankTableRed' )
                    mRows[ i ].style.backgroundColor = '#f3e9e8';


                if ( mName === 'RankTableGreen' )
                    mRows[ i ].style.backgroundColor = '#c7ddc7';

            }
            mFlag = !mFlag;
        }

        $( "." + mName + "_" + itemId.toString() ).css( 'backgroundColor', 'yellow' );
    }
    newCheckBoxTryLoopsNet ( item: typeCsv, isPA: boolean, event: any, mObjects: mService )
    {
        $( "#divLoopNet" ).css( 'display', 'none' );
        if ( isPA )
        {
            let mIndex = mObjects.mCsv.findIndex( x => x.nam === item.nam );
            mObjects.mCsv[ mIndex ].bValid = event.srcElement.checked;
            $( ".nCheckToTry_" + item.nam ).prop( 'checked', event.srcElement.checked )
        }
    }

    insertCSV ( _http: HttpClient, mconfig: mConfig, showPointsOnFirstTable: typeCsv[], mCounterREZ: number, mCounterCSV: number, newID: number )
    {
        let params = new HttpParams().set( 'mJsonCSV', this.GetCSVToSave( showPointsOnFirstTable, mCounterCSV ) ).set( "prjid", newID.toString() )

        let obs = _http.get<void>( mconfig.mUrl + "/mMethods/InsertNewCSV", { params: params } )
            .subscribe( ( res ) =>
            {
                mCounterCSV++;

                if ( mCounterCSV >= showPointsOnFirstTable.length || mCounterREZ > 10000 )
                {
                    $( "#mwaitmediv" ).css( 'display', 'none' );
                    return;
                }
                this.insertCSV( _http, mconfig, showPointsOnFirstTable, mCounterREZ, mCounterCSV, newID );
            } );
    }


    GetMjsonProject ( objectType: number ): string
    {
        let mpro: mProject = new mProject();
        mpro.strdescription = $( "#newProjectNameTxt" ).val();
        mpro.objecttype = objectType;
        return JSON.stringify( mpro );
    }
    GetMjsonProjectUpdate ( projid: string, objectType: number ): string
    {
        let mpro: mProject = new mProject();
        mpro.strdescription = eval( 'this.myControl._pendingValue' );
        mpro.objecttype = objectType;

        mpro.id = parseInt( projid );
        return JSON.stringify( mpro );
    }

    GetCSVToSave ( showPointsOnFirstTable: typeCsv[], mCounterCSV: number ): string
    {
        let mcsvrow: typeCsv = new typeCsv();

        mcsvrow.dra = showPointsOnFirstTable[ mCounterCSV ].dra;
        mcsvrow.gga = showPointsOnFirstTable[ mCounterCSV ].gga;
        mcsvrow.heiort = showPointsOnFirstTable[ mCounterCSV ].heiort;
        mcsvrow.nam = showPointsOnFirstTable[ mCounterCSV ].nam;
        mcsvrow.x = showPointsOnFirstTable[ mCounterCSV ].x;
        mcsvrow.y = showPointsOnFirstTable[ mCounterCSV ].y;

        return JSON.stringify( mcsvrow );
    }
    GetResToSave ( showTableAnalisisGral: ShowTableAnalisisGral[], mObjects: mService, mCounterREZ: number ): string
    {
        let mrezrow: typeRez = new typeRez();
        mrezrow.pa = showTableAnalisisGral[ mCounterREZ ].PA;
        mrezrow.pb = showTableAnalisisGral[ mCounterREZ ].PB;

        let nReverse: number = 1;
        let mrez: typeRez = mObjects.mRez.find( x => x.pa === mrezrow.pa || x.pb === mrezrow.pb )
        if ( mrez == null )
        {
            mrez = mObjects.mRez.find( x => x.pb === mrezrow.pa || x.pa === mrezrow.pb )
            nReverse = -1;
        }
        mrezrow.hei = showTableAnalisisGral[ mCounterREZ ].HeighDifByRez;
        mrezrow.dis = showTableAnalisisGral[ mCounterREZ ].Distance;
        mrezrow.acr = mrez.acr;
        mrezrow.bf = mrez.bf;
        mrezrow.fil = mrez.fil;
        return JSON.stringify( mrezrow );
    }

    mButDeselectAll ( handler: any, scene: any, viewer: any, showLoopsNetsOnFirstTable: ShowOnFirstTable[], showLinesOnFirstTable: ShowOnFirstTable[], showLoopsOnFirstTable: ShowOnFirstTable[], showPointsOnFirstTable: typeCsv[], showTableAnalisisGral: ShowTableAnalisisGral[] )
    {
        let selecting: mCesiumSelectedRectangle = new mCesiumSelectedRectangle( handler, scene, viewer );
        selecting.DeselectAll();
        showLoopsNetsOnFirstTable = [];
        showLinesOnFirstTable = [];
        showLoopsOnFirstTable = [];
        showPointsOnFirstTable = [];
        showTableAnalisisGral = [];
        $( "#divLoopNet" ).css( 'display', 'none' );
    }

    _filter ( strdescription: string, AllProjects: Projects[] ): Projects[]
    {
        const filterValue = strdescription.toLowerCase();
        return AllProjects.filter( option => option.strdescription.toLowerCase().indexOf( filterValue ) === 0 );
    }


    fillAutocomplete ( bFlag: boolean, AllProjectFiltered: Observable<Projects[]>, myControl: FormControl, AllProjects: Projects[] )
    {
        if ( bFlag )
        {
            AllProjectFiltered = myControl.valueChanges
                .pipe(
                    startWith( '' ),
                    map( value => typeof value === 'string' ? value : value.strdescription ),
                    map( strdescription => strdescription ? this._filter( strdescription, AllProjects ) : AllProjects.slice() )
                );
        } else
        {
            AllProjectFiltered = myControl.valueChanges
                .pipe(
                    startWith( '' ),
                    map( value => typeof value === 'string' ? value : value.strdescription ),
                    map( strdescription => strdescription ? this._filter( strdescription, AllProjects ) : [].slice() )
                );
        }
    }

    CancelDelete ()
    {
        $( "#mDeleteProjectMessage" ).css( 'display', 'none' );
        $( "#mDeleteProjectMessageAdvertence" ).css( 'display', 'none' );
        $( "#divLoopNet" ).css( 'display', 'none' );
    }
    CalculateLoopsNET ( mObjects: mService, mVertices: mVertices[], solveLoosFirstData: SolveLoosFirstData, solveLoopsNets_Main3: import( "../../../Scripts/Ts/SolveLoops/SolveLoopsNets_Main3" ).SolveLoopsNets_Main3, segmentsToTihum: SegmentsToTihum[] )
    {
        $( "#mwaitmediv" ).css( 'display', 'block' );
        $( "#divLoopNet" ).css( 'display', 'none' );
        // $( "#cesiumcontainer" ).css( 'display', 'none' );
        setTimeout( () =>
        {
            let pFactor: number = 1;

            let solveLoopsNets: SolveLoopsNets_Main1 = new SolveLoopsNets_Main1();
            solveLoosFirstData = solveLoopsNets.Main_1( mObjects.mCsv, mObjects.mRez, this.GetSegemtnArray( mObjects.mRez ), mVertices );

            solveLoopsNets_Main3.Main_3( mObjects.mRez, segmentsToTihum, mObjects.mCsv, pFactor, solveLoosFirstData.f_r, solveLoosFirstData.tableHeight, $( "#selectorMatrixSigma" ).val() );

            console.log( solveLoopsNets_Main3 );

            $( "#divLoopNet" ).css( 'display', 'block' );
            $( "#mwaitmediv" ).css( 'display', 'none' );

        }, 100 )
    }


    UpdateAditionalSegments ( solveLoosFirstData: SolveLoosFirstData, mObjects: mService, mVertices: mVertices[], AllLoopsAndLinesSegments: mSegment[][], segmentsToTihum: SegmentsToTihum[], segmentsToTihum_order: number ): SegmentsToTihum[]
    {
        let solveLoopsNets: SolveLoopsNets_Main1 = new SolveLoopsNets_Main1();
        solveLoosFirstData = solveLoopsNets.Main_1( mObjects.mCsv, mObjects.mRez, this.GetSegemtnArray( mObjects.mRez ), mVertices );
        let solveLoopsNets_Main2: SolveLoopsNets_Main2 = new SolveLoopsNets_Main2();
        let additionalSegmants = solveLoopsNets_Main2.Main_2( solveLoosFirstData, AllLoopsAndLinesSegments );

        segmentsToTihum = segmentsToTihum.filter( x => x.nType != 4 );

        for ( let i = 0; i < additionalSegmants.length; i++ )
        {
            segmentsToTihum_order++;
            segmentsToTihum.push( new SegmentsToTihum(
                4, additionalSegmants[ i ], segmentsToTihum_order, mObjects.mCsv, segmentsToTihum_order.toString(), 4
            ) )
        }
        return segmentsToTihum;
    }

    loopNetSubTabs ( mIndex: number )
    {
        $( '.mTabsGrey' ).css( 'height', '40px' ).css( 'border', 'solid 1px #d2d2e2' ).css( 'border-bottom', 'solid 1px #e1effb' ).css( 'line-height', '40px' ).css( 'background-color', '#e1effb' ).css( 'margin-bottom', '0px' ).css( 'color', '#5b5b9c' );
        $( "#tabsLoosNetResults" + mIndex ).css( 'height', '60px' ).css( 'line-height', '60px' ).css( 'background-color', '#3f8bca' ).css( 'margin-bottom', '0px' ).css( 'color', '#eaeaea' ).css( 'border-bottom', '#3f8bca' );
        document.getElementById( "divLoopsResultsTabs_1" ).style.display = document.getElementById( "divLoopsResultsTabs_2" ).style.display = document.getElementById( "divLoopsResultsTabs_3" ).style.display = document.getElementById( "divLoopsResultsTabs_4" ).style.display = document.getElementById( "divLoopsResultsTabs_5" ).style.display = "none";
        document.getElementById( "divLoopsResultsTabs_" + mIndex ).style.display = "block";
    }
    getRankDetailsTable ( item: RankTitlesTable, checkRank: CheckRank )
    {
        $( "#checkRanktitle" ).html( "לא בחרו קטע" );
        $( "#checkRanktitle" ).html( "קטע: " + item.PointA + " / " + item.PointB );
        checkRank.FillDetalis( item );
    }
    tabsCheckfiles ( nIndex: number )
    {
        $( "#TabsCheckFilesList1" ).css( 'display', 'none' );
        $( "#TabsCheckFilesList2" ).css( 'display', 'none' );
        $( "#tabsCheckfiles2" ).css( 'height', '50px' );
        $( "#tabsCheckfiles1" ).css( 'height', '50px' );
        $( "#tabsCheckfiles" + nIndex.toString() ).css( 'height', '65px' );
        $( "#TabsCheckFilesList" + nIndex.toString() ).css( 'display', 'block' );
    }



    AllHeights: TablePointHeights[] = [];
    GoAndBackmGo ( mgrav: mGravimetria, mGo: boolean, tihumInteractive: TihumInteractive, showTableAnalisisGral: ShowTableAnalisisGral[], showPointsOnFirstTable: typeCsv[], GetObects: CesiumGetObjects )
    {
        $( "#mwaitmediv" ).css( 'display', 'block' );
        setTimeout( () =>
        {
            if ( this.AllHeights.length === 0 )
                this.AllHeights = this.CalculateHeighBeforCalculations( GetObects.mObjects.mRez, GetObects.mObjects.mCsv );

            mgrav.FillGhAndOCab_Main( this.AllHeights );



            let mEvent: number = mgrav.GoAndBack( mGo );

            //Sum OCab
            if ( mEvent === 1 )
            {
                mgrav.AddOCabToKnowedHeight( true );
                tihumInteractive.CreateGroupBySelectedKnowedPoints( true );
            }
            //Rest OCab
            if ( mEvent === 3 )
            {
                mgrav.AddOCabToKnowedHeight( false );
                tihumInteractive.CreateGroupBySelectedKnowedPoints( true );
            }
            if ( mEvent === 3 && mgrav.mCounter === 0 )
            {
                for ( let i = 0; i < showTableAnalisisGral.length; i++ )
                {
                    showTableAnalisisGral[ i ].OCab = null;
                    $( "#showTGral_Ocab_" + i.toString() ).html( '' );
                }
                for ( let i = 0; i < showPointsOnFirstTable.length; i++ )
                {
                    $( "#pointRows_Gh_" + showPointsOnFirstTable[ i ].nam ).html( '' );
                    showPointsOnFirstTable[ i ].Gh = null;
                }
            }
            $( "#mwaitmediv" ).css( 'display', 'none' );
        }, 100 );
    }


    GetSegemtnArray ( allRez: typeRez[] ): mSegment[]
    {
        let mRes: mSegment[] = [];
        for ( let i = 0; i < allRez.length; i++ )
        {

            let mSeg: mSegment = new mSegment( allRez[ i ].pa, allRez[ i ].pb, allRez[ i ].hei, allRez[ i ].dis, allRez[ i ].fil, i, null, null, null, null, null, null, null, null, null, null );
            let mlinesLoops_01: mLinesLoops_01 = new mLinesLoops_01();
            mSeg.lstSegment = [];
            mSeg.lstSegment.push( mlinesLoops_01.ReplySegment( mSeg ) );
            mRes.push( mSeg );
        }

        return mRes;
    }







    ClearTihumArray ( segmentsToTihum: SegmentsToTihum[], bAlltoTihum: boolean ): SegmentsToTihum[]
    {
        for ( let i = 0; i < segmentsToTihum.length; i++ )
        {
            $( ".div_AddDeleteTotihum_" + segmentsToTihum[ i ].mIndex.toString() ).css( 'background-color', '#5cb85c' ).html( '+' )
        }

        segmentsToTihum = [];

        $( '#Div1_BiltiTluiotLaTihumSelector' ).css( 'background-color', 'white' );
        $( '#Div1_BiltiTluiotLaTihumSelector1' ).css( 'left', '35px' );
        bAlltoTihum = false;
        return segmentsToTihum;
    }
    mSelectorTab_01 ( mID: string, checkRank: CheckRank, _http: HttpClient, arg3: null, routerAct: ActivatedRoute, mRez: typeRez[] )
    {
        document.getElementById( 'tabsCheckFilesDiv' ).style.height = document.getElementById( 'tabsTihumMutneAnalisis' ).style.height = document.getElementById( 'tabsSelectKnowedPoints' ).style.height = document.getElementById( 'tabsLinesTabGralAnalisis' ).style.height = "50px";

        document.getElementById( 'CheckFilesDiv' ).style.display = document.getElementById( 'TihumMutneAnalisis' ).style.display = document.getElementById( 'SelectKnowedPoints' ).style.display = document.getElementById( 'LinesTabGralAnalisis' ).style.display = "none";
        document.getElementById( mID ).style.display = "block";
        document.getElementById( "tabs" + mID ).style.height = "65px";

        if ( mID === "CheckFilesDiv" )
        {
            checkRank = new CheckRank( _http, null, routerAct, mRez );
        }
    }
    commons: Commons;
    constructor (

    )
    {
        this.commons = new Commons();
    }

    GetSegmentByIndex ( mItem: string, nType: number, vwmain: WV_Main ): mSegment[]
    {

        let mObjectsOnTable: ObjectTypeBox;
        let mIndexes: string[] = mItem.split( '_' );
        let i: number = parseInt( mIndexes[ 0 ] );
        let j: number = parseInt( mIndexes[ 1 ] );
        let k: number = parseInt( mIndexes[ 2 ] );
        let m: number = parseInt( mIndexes[ 3 ] );

        if ( nType === 1 || nType === 2 )
            mObjectsOnTable = this.commons.getLoops( vwmain.mIndexLineBoxes );
        if ( nType === 0 )
            mObjectsOnTable = this.commons.getLines( vwmain.mIndexLineBoxes );

        return mObjectsOnTable.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ];

    }


    SelectRank ( event: any, tihumInteractive: TihumInteractive, checkRank: CheckRank, _http: HttpClient )
    {
        tihumInteractive.SetRank( event, true );
        checkRank.mWrite( _http );
        $( "#mDetailsRankHTML" ).html( '</br>ללא רשימות</br></br>' )
        $( "#checkRanktitle" ).html( 'לא בחרו קטע' )
    }

    mSelectorTab ( mID: string, objectType: number, bBiltiTluia: boolean )
    {


        document.getElementById( "tabsDataFilesView" ).style.height =
            document.getElementById( 'tabsLoopsNETView' ).style.height =
            document.getElementById( 'tabsLinesTabView' ).style.height =
            document.getElementById( 'tabsLoopsTabView' ).style.height =
            document.getElementById( 'tabsPointsTabView' ).style.height = "50px";

        document.getElementById( 'DataFilesView' ).style.display =
            document.getElementById( 'LoopsNETView' ).style.display =
            document.getElementById( 'LinesTabView' ).style.display =
            document.getElementById( 'LoopsTabView' ).style.display =
            document.getElementById( 'PointsTabView' ).style.display = "none";

        document.getElementById( mID ).style.display = "block";
        document.getElementById( "tabs" + mID ).style.height = "65px";

        if ( mID === "LoopsNETView" )
        {
            bBiltiTluia = true;
            //$( "#mwaitmediv" ).css( 'display', 'block' );
            //$( "#cesiumcontainer" ).css( 'display', 'none' );

            objectType = 1;//loop net


        }
        else
        {
            bBiltiTluia = false;
        }

        if ( mID === "LinesTabView" )
        {
            objectType = 0;//line
        }
        if ( mID === "LoopsTabView" )
        {
            objectType = 1;//loop
        }
    }
    CheckIsConvexFomat ( mTempoLoop: mSegment[] )
    {
        let mPoints: string[] = [];
        for ( let i = 0; i < mTempoLoop.length; i++ )
            for ( let j = 0; j < mTempoLoop[ i ].lstSegment.length; j++ )
            {
                mPoints.push( mTempoLoop[ i ].lstSegment[ j ].PointA );
                mPoints.push( mTempoLoop[ i ].lstSegment[ j ].PointB );
            }

        for ( let i = 0; i < mPoints.length; i++ )
            if ( mPoints.filter( x => x === mPoints[ i ] ).length > 2 )
                return false;//Not br added on bilti tluiot

        return true;
    }

    FillDistinctedVertices ( AllLoopsOnNetSegments: mSegment[][], mVertices1: mVertices[], mCsv: typeCsv[] )
    {
        mVertices1 = [];
        for ( let k = 0; k < mCsv.length; k++ )
        {
            if ( mVertices1.findIndex( x => x.name === mCsv[ k ].nam ) == -1 )
                mVertices1.push( new mVertices( mCsv[ k ].nam ) );
        }
    }
    FillDistinctedVertices_OnLoopsNet ( AllLoopsOnNetSegments: mSegment[][], mVertices1: mVertices[] )
    {

        mVertices1 = [];
        for ( let i = 0; i < AllLoopsOnNetSegments.length; i++ )
            for ( let j = 0; j < AllLoopsOnNetSegments[ i ].length; j++ )
            {

                for ( let k = 0; k < AllLoopsOnNetSegments[ i ][ j ].lstSegment.length; k++ )
                {
                    if ( mVertices1.findIndex( x => x.name === AllLoopsOnNetSegments[ i ][ j ].lstSegment[ k ].PointA ) == -1 )
                        mVertices1.push( new mVertices( AllLoopsOnNetSegments[ i ][ j ].lstSegment[ k ].PointA ) )

                    if ( mVertices1.findIndex( x => x.name === AllLoopsOnNetSegments[ i ][ j ].lstSegment[ k ].PointB ) == -1 )
                        mVertices1.push( new mVertices( AllLoopsOnNetSegments[ i ][ j ].lstSegment[ k ].PointB ) )
                }
            }
    }

    CalculateHeighBeforCalculations ( mRez: typeRez[], mCsv: typeCsv[] ): TablePointHeights[]
    {
        let heightBeforeCalc: TableDeltaHeights[] = [];

        for ( let i = 0; i < mRez.length; i++ )
        {
            let tempo: typeRez = mRez[ i ];
            heightBeforeCalc.push( new TableDeltaHeights(
                tempo.pa,
                tempo.pb,
                tempo.hei,
                null,//not necesary yet
                null//not necesary yet
            ) )
        }

        let calc: HeightCalculation = new HeightCalculation();
        return calc.Main_4( heightBeforeCalc, mCsv );
    }

    BiltiTluiotLaTihum ( mSelectorTab_01: ( mID: string ) => void, tihumInteractive: TihumInteractive, showLoopsNetsOnFirstTable: ShowOnFirstTable[], segmentsToTihum_order: number, segmentsToTihum: SegmentsToTihum[], objectType: number, mObjects: mService )
    {
        $( "#mContainer01" ).css( 'display', 'block' );
        $( "#divLoopNet" ).css( 'display', 'block' );
        this.mSelectorTab_01( 'TihumMutneAnalisis', null, null, null, null, null );

        let mAlltoTihum: boolean = tihumInteractive.BiltiTluiotLaTihum();
        if ( mAlltoTihum )
        {
            for ( let i = 0; i < showLoopsNetsOnFirstTable.length; i++ )
            {
                let mLstIndex = this.findSameSegemntOnTihum( showLoopsNetsOnFirstTable[ i ].mSegments, segmentsToTihum );
                if ( mLstIndex === -1 )
                {
                    segmentsToTihum_order++;
                    segmentsToTihum.push( new SegmentsToTihum( objectType, showLoopsNetsOnFirstTable[ i ].mSegments, segmentsToTihum_order, mObjects.mCsv, showLoopsNetsOnFirstTable[ i ].mIndex, 2 ) );
                    $( ".div_AddDeleteTotihum_" + showLoopsNetsOnFirstTable[ i ].mIndex.toString() ).css( 'background-color', '#d9534f' ).html( this.commons._x )
                }
            }
        } else
        {
            let mfilter: SegmentsToTihum[] = segmentsToTihum.filter( x => x.mTypeTotihum === 2 );
            for ( let i = 0; i < mfilter.length; i++ )
                $( ".div_AddDeleteTotihum_" + mfilter[ i ].mIndex.toString() ).css( 'background-color', '#5cb85c' ).html( "+" );

            segmentsToTihum = segmentsToTihum.filter( x => x.mTypeTotihum !== 2 );
        }
    }


    ShowSegmentByName ( PA: string, PB: string, bWithZoom: boolean, viewer: any )
    {
        let mapiCesium: MapiCesium = new MapiCesium();
        let manageObjectcs: ManageObjectcs = new ManageObjectcs( viewer );
        let mEntitie: any = manageObjectcs.GetEntitieByName( PA, PB, mapiCesium.mTypeLine, viewer );

        if ( mEntitie == null )
            return;

        mEntitie.polyline.material.color = Cesium.Color.DEEPPINK;

        if ( bWithZoom )
            viewer.flyTo( mEntitie );

        mEntitie = manageObjectcs.GetEntitieByName( PA, null, mapiCesium.mTypePoint, viewer );
        mEntitie.point.color = Cesium.Color.DEEPPINK;
        mEntitie = manageObjectcs.GetEntitieByName( PB, null, mapiCesium.mTypePoint, viewer );
        mEntitie.point.color = Cesium.Color.DEEPPINK;
    }

    findSameSegemntOnTihum ( msegment: mSegment[], segmentsToTihum: SegmentsToTihum[] ): number
    {
        let mlinesLoops_01: mLinesLoops_01 = new mLinesLoops_01();
        for ( let i = 0; i < segmentsToTihum.length; i++ )
            if ( mlinesLoops_01.bIsTheSameLine( msegment, segmentsToTihum[ i ].msegments ) )
                return i;

        return - 1;
    }


    mCesiumFlyToArray ( mArr: string[], viewerCamera: any )
    {
        // return;

        var mMinX = 9999999999;
        var mMinY = 9999999999;
        var mMaxX = -9999999999;
        var mMaxY = -9999999999;
        for ( var i = 0; i < mArr.length; i += 3 )
        {

            if ( parseFloat( mArr[ i ] ) < mMinX )
                mMinX = parseFloat( mArr[ i ] );

            if ( parseFloat( mArr[ i + 1 ] ) < mMinY )
                mMinY = parseFloat( mArr[ i + 1 ] );

            if ( parseFloat( mArr[ i ] ) > mMaxX )
                mMaxX = parseFloat( mArr[ i ] );

            if ( parseFloat( mArr[ i + 1 ] ) > mMaxY )
                mMaxY = parseFloat( mArr[ i + 1 ] );

        }

        let x10Avg = Math.abs( ( mMinX - mMaxX ) / 10 );
        let y10Avg = Math.abs( ( mMinY - mMaxY ) / 10 );

        mMinX -= x10Avg;
        mMaxX += x10Avg;
        mMinY -= y10Avg;
        mMaxY += x10Avg;

        viewerCamera.flyTo( {
            destination: Cesium.Rectangle.fromDegrees( mMinX, mMinY, mMaxX, mMaxY )
        } )

        //this.viewer.camera.setView( {
        //   destination: Cesium.Rectangle.fromDegrees( mMinX, mMinY, mMaxX, mMaxY )
        // } );

    }

    ShowLine ( item: mSegment[], bWithZoom: boolean, handler: any, scene: any, viewer: any, GetObects: CesiumGetObjects )
    {

        let selecting: mCesiumSelectedRectangle = new mCesiumSelectedRectangle( handler, scene, viewer );
        selecting.DeselectAll();
        //Add point A to list
        let mapiCesium: MapiCesium = new MapiCesium();
        let mResult = [];

        if ( bWithZoom )
        {
            let mRes: typeCsv = mapiCesium.GetDataPointFromCSV( GetObects.mObjects, item[ 0 ].lstSegment[ 0 ].PointA );
            let mCoo: number[] = mapiCesium.proj4From2039_to_WGS84( mRes.x, mRes.y, mRes.heiort );
            mResult.push( mCoo[ 0 ] );
            mResult.push( mCoo[ 1 ] );
            mResult.push( 0 );
        }
        for ( let i = 0; i < item.length; i++ )
        {
            for ( let j = 0; j < item[ i ].lstSegment.length; j++ )
            {
                //Paint the segments
                this.ShowSegmentByName( item[ i ].lstSegment[ j ].PointA, item[ i ].lstSegment[ j ].PointB, false, viewer );

                if ( bWithZoom )
                {
                    let mRes: typeCsv = mapiCesium.GetDataPointFromCSV( GetObects.mObjects, item[ i ].lstSegment[ j ].PointB );
                    let mCoo: number[] = mapiCesium.proj4From2039_to_WGS84( mRes.x, mRes.y, mRes.heiort );
                    mResult.push( mCoo[ 0 ] );
                    mResult.push( mCoo[ 1 ] );
                    mResult.push( 0 );
                }
            }
        }

        if ( bWithZoom )
        {
            this.mCesiumFlyToArray( mResult, viewer.camera );
        }

    }





}