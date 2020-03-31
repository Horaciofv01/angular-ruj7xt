import { Component, OnInit, ANALYZE_FOR_ENTRY_COMPONENTS } from '@angular/core';
import { MapiCesium, mSelectedAndAll, typeCsv, mService, typeRez, mProject } from '../Library/m-cesium/Script/MapiCesium'

import { Router, ActivatedRoute } from '@angular/router';

import { ElementRef } from '@angular/core';
import { mCesiumSelectedRectangle } from '../Library/m-cesium/Script/mCesiumSelectedRectangle'     //   '../.././Script/mCesiumSelectedRectangle';
import { CesiumGetObjects } from '../Library/m-cesium/Script/mCesiumGetObjects';
import { HttpClient, HttpParams } from '@angular/common/http'
import { WV_Main } from '../../Scripts/Ts/WikiView/WV_Main';
import { ObjectTypeBox, ShowOnFirstTable, ShowTableAnalisisGral, JustSelectedIndex } from '../../Scripts/Ts/WikiView/step2';
import { mSegment } from '../../Scripts/Ts/WikiView/step1';
import $ from 'jquery';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';
import { Projects, m2Points, mVertices } from '../../Scripts/Ts/Stored/Commons';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { mConfig } from '../../Commons/mConfig';
import { WikiViewCalculation } from '../../Scripts/Ts/WikiView/mCalculation'
import { SolveLoopsNets_Main1, SolveLoosFirstData } from '../../Scripts/Ts/SolveLoops/SolveLoopsNets_Main1'
import { SolveLoopsNets_Main3 } from '../../Scripts/Ts/SolveLoops/SolveLoopsNets_Main3'
import { HeightCalculation, TablePointHeights } from '../../Scripts/Ts/Stored/HeightCalculation_Main1'
import { mLinesLoops_01 } from '../../Scripts/Ts/WikiView/step1';
import { TihumInteractive, SegmentsToTihum } from '../../Scripts/Ts/Stored/TihumInteractive';
import { mGravimetria } from '../../Scripts/Ts/Stored/Gravimetria'
import { Commons } from '../../Scripts/Ts/Stored/Commons';
import { BalancesSelector_UI } from '../Library/Script/BalancesSelector_UI';
import { CreateForms } from '../../Scripts/Ts/Stored/CreateForms'
import { BL } from '../../Scripts/Ts/Stored/BL'
import { CheckRank, RankTitlesTable } from '../../Scripts/Ts/Stored/CheckRank';

@Component( {
  selector: 'app-selector',
  templateUrl: './selector.component.html'

} )
export class SelectorComponent implements OnInit
{

  constructor ( private el: ElementRef, private _http: HttpClient, private router: Router, private routerAct: ActivatedRoute ) { }


  viewer: any;
  scene: any;
  handler: any;

  GetObects: CesiumGetObjects;

  AllLines: ObjectTypeBox;
  AllLoops: ObjectTypeBox;


  showLinesOnFirstTable: ShowOnFirstTable[] = [];
  showLoopsOnFirstTable: ShowOnFirstTable[] = [];
  showLinesOnFirstTable_filtered: ShowOnFirstTable[] = [];
  showLoopsNetsOnFirstTable: ShowOnFirstTable[] = [];
  showPointsOnFirstTable: typeCsv[] = [];
  showTableAnalisisGral: ShowTableAnalisisGral[] = [];
  showTableAnalisisGral_Filtered: ShowTableAnalisisGral[] = [];
  justSelectedIndex: JustSelectedIndex[] = [];

  vwmain: WV_Main;
  myControl = new FormControl();
  AllProjects: Projects[] = [];
  AllProjectFiltered: Observable<Projects[]>;

  mCounterCSV: number;
  mCounterREZ: number;
  mconfig: mConfig = new mConfig();

  projid: string = "0";

  //0: Line ; 1: loop ; 2 : net
  objectType: number = 0;

  wikiViewCalculation: WikiViewCalculation;

  LoopsNetSegmentArray: mSegment[][] = [];
  solveLoosFirstData: SolveLoosFirstData = new SolveLoosFirstData();


  AllLoopsOnNetSegments: mSegment[][] = [];
  AllLoopsAndLinesSegments: mSegment[][] = [];

  heightCalculation: HeightCalculation;
  mVertices: mVertices[] = [];
  mKnowedPoints: typeCsv[] = [];

  mKnowedNETPoints: typeCsv[] = [];
  mKnowedNETPoints_filterd: typeCsv[] = [];



  solveLoopsNets_Main3: SolveLoopsNets_Main3;

  tihumInteractive: TihumInteractive;

  gravFactor: number;
  mgrav: mGravimetria;

  //Bilti tluiot
  mNumberLoops: number = 0;
  commons: Commons;
  mInterval: any;
  bSearchingLoop: boolean = false;

  //
  segmentsToTihum: SegmentsToTihum[] = [];
  segmentsToTihum_order: number = 0;

  mUI: BalancesSelector_UI = new BalancesSelector_UI();

  mUniqueIDToObject: number = 0;
  bBiltiTluia: boolean;
  mAlltoTihum: boolean = false;

  currentMindex: string;
  bL: BL;

  ////////////////////////////////////////////////////////
  checkRank: CheckRank;
  //////////////////////////////////////////////////////////
  ngOnInit ()
  {
    if ( this.projid == "0" )
      this.SetProjectsSelectorControl();

    /////////////////////////////INIT CESIUM AND SET VARIABLES//////////////////////////////
    if ( this.viewer == null )
    {
      this.viewer = new Cesium.Viewer( 'cesiumcontainer', {

        sceneMode: Cesium.SceneMode.SCENE2D,
        imageryProvider: Cesium.createTileMapServiceImageryProvider( {
          //Offline cesium resources
          url: Cesium.buildModuleUrl( 'Assets/Textures/NaturalEarthII' )
        } ),
        baseLayerPicker: false,
        geocoder: false,
        animation: false,
        timeline: false,
        shadows: true,
        infoBox: false,
        fullscreenButton: false,
        navigationInstructionsInitiallyVisible: false

      } );


    }
    this.scene = this.viewer.scene;
    this.handler = new Cesium.ScreenSpaceEventHandler( this.scene.canvas );



    this.bL = new BL( this._http, this.routerAct );
    this.bL.Permissions( 1 );


    $( "#mwaitmediv" ).css( 'display', 'block' );
    this.GetObects = new CesiumGetObjects( this._http, this.viewer, this.routerAct );
    this.GetObects.mInit = this.projid;
    this.GetObects.ngOnInit();

    this.checkRank = new CheckRank( this._http, null, this.routerAct, null );

    if ( this.projid != "0" )
    {
      this.changeSelectorProjectView( true );
    }
    else this.changeSelectorProjectView( false );


    // else
    //  this.GetObects.GetSelectedProject( mid );

    //Default view : Israel.
    this.viewer.camera.setView( {
      destination: Cesium.Rectangle.fromDegrees( 33.65749973443918, 29.053539379234657, 36.24918878344927, 34.035736654964985 )
    } );

    //Setting for doing marks
    let selecting: mCesiumSelectedRectangle = new mCesiumSelectedRectangle( this.handler, this.scene, this.viewer );
    selecting.init( selecting );

    //Painting baloon
    $( "#rtkSequence2" ).html();
    $( "#rtkSequence2" ).removeClass( "circleSequence" ).addClass( "circleV" ).html( '' ).css( 'cursor', 'pointer' )


    //On the top cause get oblects to screen
    this.solveLoopsNets_Main3 = new SolveLoopsNets_Main3();

    //This was putted here cause the first data are readed as nulls and doing bug.
    this.tihumInteractive = new TihumInteractive( null, null, this.objectType, false );


    this.gravFactor = 0.0424;
    this.mgrav = new mGravimetria( null, null, this.gravFactor );


    this.commons = new Commons();
    this.mUI.AllHeights = [];


  }

  RefreshPage ()
  {
    setTimeout( () =>
    {
      this.showLinesOnFirstTable = [];
      this.showLoopsOnFirstTable = [];
      this.showPointsOnFirstTable = [];
      this.showTableAnalisisGral = [];
      this.justSelectedIndex = [];
      this.ngOnInit();

      $( "#mDetailsRankHTML" ).html( '</br>ללא רשימות</br></br>' )
      $( "#checkRanktitle" ).html( 'לא בחרו קטע' )
      $( "#tabsCheckFilesDiv" ).css( 'height', '50px' )
      $( "#tabsCheckFilesDiv" ).html( 'רענן בקרת חומר' )

    }, 1 )


  }


  ClearTihumArray ()
  {
    this.segmentsToTihum = this.mUI.ClearTihumArray( this.segmentsToTihum, this.tihumInteractive.bAlltoTihum );
  }

  /////////////////////////////////////SJUJIT MAGDELET///////////////////////////////////////////////////////////////////////////////////////////////
  mButZoomToMap ()
  {
    let selecting: mCesiumSelectedRectangle = new mCesiumSelectedRectangle( this.handler, this.scene, this.viewer );
    selecting.selectAction = 4; selecting.flag1 = true; selecting.flag5 = true; selecting.flag6 = false; selecting.flag3 = true;
    selecting.init( selecting );
  }
  mButDeselectAll ()
  {
    this.mUI.mButDeselectAll( this.handler, this.scene, this.viewer, this.showLoopsNetsOnFirstTable,
      this.showLinesOnFirstTable, this.showLoopsOnFirstTable, this.showPointsOnFirstTable, this.showTableAnalisisGral


    )

  }




  //belongs to button: ניתוח בחירה
  doAnalisisOfSelected ( bGetAll: boolean )
  {

    this.bL.Permissions( 2 );
    $( "#mwaitmediv" ).css( 'display', 'block' );

    //$( "#cesiumcontainer" ).css( 'display', 'none' );
    setTimeout( () =>
    {
      let selecting: mCesiumSelectedRectangle = new mCesiumSelectedRectangle( this.handler, this.scene, this.viewer );
      //Reading selected ceisum datas
      let mSelected: mSelectedAndAll = selecting.GetDatasFromViewer();

      if ( bGetAll )
      {
        let mapicesium: MapiCesium = new MapiCesium();
        for ( let q = 0; q < this.viewer.entities._entities._array.length; q++ )
        {
          if ( this.viewer.entities._entities._array[ q ]._mType === mapicesium.mTypePoint )
            this.viewer.entities._entities._array[ q ].point.color = Cesium.Color.AQUA;

          if ( this.viewer.entities._entities._array[ q ]._mType === mapicesium.mTypeLine )
            this.viewer.entities._entities._array[ q ].polyline.material = Cesium.Color.AQUA;
        }
        if ( this.GetObects.mObjects != undefined )
        {
          mSelected.mCsvSelected = this.GetObects.mObjects.mCsv;
          mSelected.mRezSelected = this.GetObects.mObjects.mRez
        }
      }




      //Getting the complette list of objets
      mSelected.mCsvAll = this.GetObects.mObjects.mCsv;
      mSelected.mRezAll = this.GetObects.mObjects.mRez;

      this.heightCalculation = new HeightCalculation();
      this.mKnowedNETPoints_filterd = this.mKnowedNETPoints = this.heightCalculation.getKnowedPoints( this.GetObects.mObjects.mCsv, this.mVertices );

      this.vwmain = new WV_Main( mSelected );
      this.vwmain.GetMore( this.vwmain );
      //End on fill loops
      $( "#mwaitmediv" ).css( 'display', 'none' );
      //$( "#cesiumcontainer" ).css( 'display', 'block' );
      this.DoGraphics( this.vwmain.mIndexLineBoxes, this.vwmain.mSelection );
      ///////////////////////////////////////////////////////////
      this.heightCalculation = new HeightCalculation();
      this.mKnowedPoints = this.GetObects.mObjects.mCsv.filter( x => x.heiort != null );

      //////////////////////////
      let pFactor: number = 1;

      let solveLoopsNets: SolveLoopsNets_Main1 = new SolveLoopsNets_Main1();
      this.solveLoosFirstData = solveLoopsNets.Main_1( this.GetObects.mObjects.mCsv, this.GetObects.mObjects.mRez, this.GetSegemtnArray( this.GetObects.mObjects.mRez ), this.mVertices );
      this.mNumberLoops = this.solveLoosFirstData.n_loops;

      if ( this.showLoopsNetsOnFirstTable.length >= this.mNumberLoops )
      {
        $( "#butMoreResultsLoopsNET" ).css( 'display', 'none' );
      }
      else
      {
        $( "#butMoreResultsLoopsNET" ).css( 'display', 'block' );
      }



    }, 1 )






  }


  setObjectType ( mType: number )
  {
    this.objectType = mType;
  }

  //cant moove
  getMoreObjects ()
  {

    $( "#mwaitmediv" ).css( 'display', 'block' );
    $( "#mFlagresults" ).html( 'true' );
    setTimeout( () =>
    {
      this.vwmain.GetMore( this.vwmain );
      this.DoGraphics( this.vwmain.mIndexLineBoxes, this.vwmain.mSelection );

      if ( this.showLoopsNetsOnFirstTable.length >= this.mNumberLoops )
      {
        $( "#butMoreResultsLoopsNET" ).css( 'display', 'none' );
      }
      else
      {
        $( "#butMoreResultsLoopsNET" ).css( 'display', 'block' );
      }
    } )
  }
  //nType 0: Get All; 
  //nType 1 : all Net Loops
  mClickButton ( nType: number )
  {

    this.mInterval = setInterval( () =>
    {
      $( "#mwaitmediv" ).css( 'display', 'block' );
      if ( nType === 0 )
        if ( $( "#mFlagresults" ).html() == 'true' )
        {
          clearInterval( this.mInterval );
          $( "#mwaitmediv" ).css( 'display', 'none' );
          return;
        }

      if ( nType === 1 )
      {
        this.bSearchingLoop = true;
        if ( this.showLoopsNetsOnFirstTable.length >= this.mNumberLoops )
        {
          $( "#butMoreResultsLoopsNET" ).css( 'display', 'none' )
          clearInterval( this.mInterval );
          $( "#mwaitmediv" ).css( 'display', 'none' );
          this.bSearchingLoop = false;
          return;
        }

      } else
      {
        this.bSearchingLoop = false;
      }

      if ( $( "#mFlagresults" ).html() == 'false' )
      {
        let melement: HTMLElement = document.getElementById( "butMoreResults" ) as HTMLElement;
        melement.click();
      }
    }, 10 )
  }


  DoGraphics ( mIndexLineBoxes: ObjectTypeBox[], mSelection: mSelectedAndAll ): void
  {
    this.AllLines = this.getLines( mIndexLineBoxes );
    this.AllLoops = this.getLoops( mIndexLineBoxes );
    this.DoTablesForLines( this.AllLines );
    this.DoTablesForLoops( this.AllLoops );
    this.heightCalculation = new HeightCalculation();
  }



  mSelectedRow: string = "yellowRow";





  GetNetLoops ()
  {
    this.AllLoopsOnNetSegments = [];
    this.LoopsNetSegmentArray = [];
    this.showLoopsNetsOnFirstTable = [];

    let m2Segments: m2Points[] = [];
    //Running all the loops by perimeter order
    for ( let z = 0; z < this.showLoopsOnFirstTable.length; z++ )
    {
      //Getting one
      let mIndexes: string[] = this.showLoopsOnFirstTable[ z ].mIndex.split( '_' );
      let i: number = parseInt( mIndexes[ 0 ] );
      let j: number = parseInt( mIndexes[ 1 ] );
      let k: number = parseInt( mIndexes[ 2 ] );
      let m: number = parseInt( mIndexes[ 3 ] );
      let mObjectsOnTable: ObjectTypeBox;
      mObjectsOnTable = this.getLoops( this.vwmain.mIndexLineBoxes );
      //Getting the loops and check if all the sides belongs to list
      let mTempoLoop: mSegment[] = mObjectsOnTable.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ];

      //Checking it has a no convex format 
      if ( !this.CheckIsConvexFomat( mTempoLoop ) )
        continue;

      if ( this.bCheckLoopInArray( m2Segments, mTempoLoop ) )
        continue;


      for ( let n = 0; n < mTempoLoop.length; n++ )
      {
        let mTempoSegment = mObjectsOnTable.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ][ n ];

        for ( let h = 0; h < mTempoSegment.lstSegment.length; h++ )
        {
          if ( !this.bCheckIfExistantOn2Points( mTempoSegment.lstSegment[ h ], m2Segments ) )
          {
            //Insering all the sides in the list
            m2Segments.push( new m2Points( mTempoSegment.lstSegment[ h ].PointA, mTempoSegment.lstSegment[ h ].PointB ) );
            this.LoopsNetSegmentArray.push( mTempoLoop );
          }
        }
      }      ///////

      //SHOWING LOOPS NET.
      //Getting the segments
      this.AllLoopsOnNetSegments.push( mTempoLoop );
      //Getting the loops for show on table
      this.showLoopsNetsOnFirstTable.push( this.showLoopsOnFirstTable[ z ] );
    }


    this.FillDistinctedVertices( this.AllLoopsOnNetSegments );


  }
  FillDistinctedVertices_OnLoopsNet ( AllLoopsOnNetSegments: mSegment[][] )
  {
    this.mUI.FillDistinctedVertices_OnLoopsNet( AllLoopsOnNetSegments, this.mVertices );
  }
  FillDistinctedVertices ( AllLoopsOnNetSegments: mSegment[][] )
  {
    this.mUI.FillDistinctedVertices( AllLoopsOnNetSegments, this.mVertices, this.GetObects.mObjects.mCsv )
  }
  CheckIsConvexFomat ( mTempoLoop: mSegment[] )
  {
    return this.mUI.CheckIsConvexFomat( mTempoLoop );
  }
  bCheckLoopInArray ( m2Segments: m2Points[], Line: mSegment[] ): boolean
  {
    return this.mUI.bCheckLoopInArray( m2Segments, Line );
  }
  bCheckIfExistantOn2Points ( mTempo: mSegment, m2Segments: m2Points[] ): boolean
  {
    return this.mUI.bCheckIfExistantOn2Points( mTempo, m2Segments );
  }
  getLoops ( mIndexLineBoxes: ObjectTypeBox[] ): ObjectTypeBox
  {
    return this.commons.getLoops( mIndexLineBoxes );
  }
  getLines ( mIndexLineBoxes: ObjectTypeBox[] )
  {
    return this.commons.getLines( mIndexLineBoxes );
  }


  mButSelectRectangle ()
  {
    let selecting: mCesiumSelectedRectangle = new mCesiumSelectedRectangle( this.handler, this.scene, this.viewer );
    selecting.selectAction = 1; selecting.flag1 = true; selecting.flag5 = true; selecting.flag6 = false; selecting.flag3 = true;
    selecting.init( selecting );
  }

  mSelectorTab ( mID: string )
  {
    this.mUI.mSelectorTab( mID, this.objectType, this.bBiltiTluia );
  }


  mSelectorTab_01 ( mID: string )
  {


    document.getElementById( 'tabsCheckFilesDiv' ).style.height = document.getElementById( 'tabsTihumMutneAnalisis' ).style.height = document.getElementById( 'tabsSelectKnowedPoints' ).style.height = document.getElementById( 'tabsLinesTabGralAnalisis' ).style.height = "50px";

    document.getElementById( 'CheckFilesDiv' ).style.display = document.getElementById( 'TihumMutneAnalisis' ).style.display = document.getElementById( 'SelectKnowedPoints' ).style.display = document.getElementById( 'LinesTabGralAnalisis' ).style.display = "none";
    document.getElementById( mID ).style.display = "block";
    document.getElementById( "tabs" + mID ).style.height = "65px";




    if ( mID === "CheckFilesDiv" )
    {
      this.checkRank = new CheckRank( this._http, null, this.routerAct, this.GetObects.mObjects.mRez );
      return;
    }


  }



  ShowSelectedObject ( mItem: ShowOnFirstTable, nType: number, bWithZoom: boolean )
  {


    let selecting: mCesiumSelectedRectangle = new mCesiumSelectedRectangle( this.handler, this.scene, this.viewer );
    selecting.DeselectAll();

    let mIndexes: string[] = mItem.mIndex.split( '_' )

    let i: number = parseInt( mIndexes[ 0 ] );
    let j: number = parseInt( mIndexes[ 1 ] );
    let k: number = parseInt( mIndexes[ 2 ] );
    let m: number = parseInt( mIndexes[ 3 ] );

    this.showTableAnalisisGral = [];
    let mObjectsOnTable: ObjectTypeBox;
    if ( nType === 1 )
      mObjectsOnTable = this.getLoops( this.vwmain.mIndexLineBoxes );
    if ( nType === 0 )
      mObjectsOnTable = this.getLines( this.vwmain.mIndexLineBoxes );

    let mOrder: number = 0;

    //Calculating Close Vector
    let mCloseAt: number = 0;
    let mPerimeter: number = 0;

    let mapiCesium: MapiCesium = new MapiCesium();
    let mResult = [];
    for ( let n = 0; n < mObjectsOnTable.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ].length; n++ )
    {
      for ( let o = 0; o < mObjectsOnTable.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ][ n ].lstSegment.length; o++ )
      {
        //Getting all pointA
        let mTempo: mSegment = mObjectsOnTable.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ][ n ].lstSegment[ o ];
        if ( bWithZoom )
        {

          let mRes: typeCsv = mapiCesium.GetDataPointFromCSV( this.GetObects.mObjects, mTempo.PointA );
          let mCoo: number[] = mapiCesium.proj4From2039_to_WGS84( mRes.x, mRes.y, mRes.heiort );

          mResult.push( mCoo[ 0 ] );
          mResult.push( mCoo[ 1 ] );
          mResult.push( mCoo[ 2 ] );
        }
        this.PaintSelectedSegment( mTempo.PointA, mTempo.PointB );

      }
      //Getting last point B

      let totalLenght: number = mObjectsOnTable.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ][ n ].lstSegment.length - 1;
      let mTempo: mSegment = mObjectsOnTable.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ][ n ].lstSegment[ totalLenght ];


      if ( bWithZoom )
      {

        let mRes: typeCsv = mapiCesium.GetDataPointFromCSV( this.GetObects.mObjects, mTempo.PointB );
        let mCoo: number[] = mapiCesium.proj4From2039_to_WGS84( mRes.x, mRes.y, mRes.heiort );
        mResult.push( mCoo[ 0 ] );
        mResult.push( mCoo[ 1 ] );
        mResult.push( mCoo[ 2 ] );
      }
    }
    if ( bWithZoom )
    {
      this.mCesiumFlyToArray( mResult );
    }


  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  DeleteTihumListed ( id: number, mIndex: string )
  {
    this.mUI.DeleteTihumListed( id, mIndex, this.segmentsToTihum );
  }
  AddNewSegmentToSelected ( mIndex: string, event: any )
  {
    this.mUI.AddNewSegmentToSelected( mIndex, event, this.segmentsToTihum, this.segmentsToTihum_order,
      this.commons, this.mUniqueIDToObject, this.vwmain, this.objectType, this.GetObects.mObjects, this.bBiltiTluia );

  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  ShowLine ( item: mSegment[], bWithZoom: boolean )
  {
    this.mUI.ShowLine( item, bWithZoom, this.handler, this.scene, this.viewer, this.GetObects );
  }
  showSegment ( item: ShowTableAnalisisGral, bWithZoom: boolean )
  {
    this.mUI.showSegment( item, bWithZoom, this.handler, this.scene, this.viewer );
  }
  DeselectAll ()
  {
    let selecting: mCesiumSelectedRectangle = new mCesiumSelectedRectangle( this.handler, this.scene, this.viewer );
    selecting.DeselectAll();
  }

  ShowSegmentByName ( PA: string, PB: string, bWithZoom: boolean )
  {
    this.mUI.ShowSegmentByName( PA, PB, bWithZoom, this.viewer );
  }
  PaintSelectedSegment ( PA: string, PB: string ): any
  {
    this.mUI.PaintSelectedSegment( PA, PB, this.viewer );
  }
  showPoint_01 ( mPointData: typeCsv, bWithZoom: boolean )
  {
    this.mUI.showPoint_01( mPointData, bWithZoom, this.GetObects.mObjects, this.handler, this.scene, this.viewer );
  }
  showPoint ( mItem: typeCsv, bWithZoom: boolean )
  {
    this.showPointByName( mItem.nam, bWithZoom );
  }
  showPointByName ( mName: string, bWithZoom: boolean ) 
  {
    this.mUI.showPointByName( mName, bWithZoom, this.handler, this.scene, this.viewer,
      this.GetObects.mObjects );
  }
  classRow: string;
  SelectRow01 ( mName: string, item: ShowOnFirstTable )
  {
    this.mUI.SelectRow01( mName, item );
  }

  SelectRow02 ( mName: string, item: typeCsv )
  {
    this.mUI.SelectRow02( mName, item );
  }

  SelectRow03 ( mName: string, itemId: number )
  {
    this.mUI.SelectRow03( mName, itemId );
  }

  newCheckBoxTry ( item: ShowTableAnalisisGral, isPA: boolean, event: any )
  {
    this.mgrav = new mGravimetria( this.showPointsOnFirstTable, this.showTableAnalisisGral, this.gravFactor );
    this.tihumInteractive.showTableAnalisisGral = this.showTableAnalisisGral;
    this.tihumInteractive.newCheckBoxTry( item, isPA, event );
  }

  //Cant moove
  newCheckBoxTry_01 ( PA: string, PB: string, isPA: boolean, event: any )
  {
    this.mgrav = new mGravimetria( this.showPointsOnFirstTable, this.showTableAnalisisGral, this.gravFactor );
    this.tihumInteractive.showTableAnalisisGral = this.showTableAnalisisGral;
    this.tihumInteractive.newCheckBoxTry_01( PA, PB, isPA, event, this.GetObects.mObjects );
  }


  newCheckBoxTryLoopsNet ( item: typeCsv, isPA: boolean, event: any )
  {
    this.mUI.newCheckBoxTryLoopsNet( item, isPA, event, this.GetObects.mObjects );
  }

  //Cant moove
  ClearAllCheckBox ( event: any )
  {
    let mElemets = document.getElementsByName( "nCheckToTry" );
    for ( let i = 0; i < mElemets.length; i++ )
      eval( "mElemets[i].checked = event.srcElement.checked;" );

    for ( let i = 0; i < this.GetObects.mObjects.mCsv.length; i++ )
    {
      if ( event.srcElement.checked == false )
        this.GetObects.mObjects.mCsv[ i ].bValid = false;
      else
      {
        if ( this.GetObects.mObjects.mCsv[ i ].heiort != null )
          this.GetObects.mObjects.mCsv[ i ].bValid = true;
      }
    }

    if ( event.srcElement.checked === false && this.showTableAnalisisGral.length > 0 )
    {
      let mIndex: number = this.GetObects.mObjects.mCsv.findIndex( x => x.nam === this.showTableAnalisisGral[ 0 ].PA );
      this.GetObects.mObjects.mCsv[ mIndex ].bValid = true;

    }


    if ( this.showTableAnalisisGral.length > 0 )
    {
      let PA: string = this.showTableAnalisisGral[ 0 ].PA;
      this.newCheckBoxTry_01( PA, PA, true, event );
    }

  }

  mCesiumFlyToArray = function ( mArr )
  {
    this.mUI.mCesiumFlyToArray( mArr, this.viewer.camera )
  }

  //////////////////////////////////////////////////////////////////CONTROL SELECT PROJECT//////////////////////////////////////////////////////////////////////

  SetProjectsSelectorControl ()
  {
    let obs = this._http.get<Projects[]>( this.mconfig.mUrl + "/api/GetProjectList" )
      .subscribe( ( res ) =>
      {
        this.AllProjects = res;

      } );
  }
  private _filter ( strdescription: string ): Projects[]
  {
    const filterValue = strdescription.toLowerCase();
    return this.AllProjects.filter( option => option.strdescription.toLowerCase().indexOf( filterValue ) === 0 );
  }

  //Get other project
  FillToNew ( event: MatAutocompleteSelectedEvent )
  {
    this.projid = event.option.id.split( '_' )[ 1 ];
    this.RefreshPage();
  }

  fillAutocomplete ( bFlag: boolean )
  {
    if ( bFlag )
    {
      this.AllProjectFiltered = this.myControl.valueChanges
        .pipe(
          startWith( '' ),
          map( value => typeof value === 'string' ? value : value.strdescription ),
          map( strdescription => strdescription ? this._filter( strdescription ) : this.AllProjects.slice() )
        );
    } else
    {
      this.AllProjectFiltered = this.myControl.valueChanges
        .pipe(
          startWith( '' ),
          map( value => typeof value === 'string' ? value : value.strdescription ),
          map( strdescription => strdescription ? this._filter( strdescription ) : [].slice() )
        );
    }
  }



  //////////////////////MANAGE PROJECT/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Saves project CSV and REZ by order
  UpdateProject ()
  {
    this.bL.Permissions( 4 );
    $( "#mwaitmediv" ).css( 'display', 'block' );
    this.mCounterCSV = this.mCounterREZ = 0;

    //let params = new HttpParams().set( 'mJsonProject', this.GetMjsonProject() ).set( 'mJsonCSV', JSON.stringify( this.showPointsOnFirstTable ) ).set( 'mJsonREZ', this.GetResToSave() );
    let params = new HttpParams().set( 'mJsonProject', this.GetMjsonProjectUpdate() );
    let obs = this._http.get<number>( this.mconfig.mUrl + "/mMethods/UpdateProject", { params: params } )
      .subscribe( ( res ) =>
      {
        let newID: number = res;
        this.insertREZ( parseInt( this.projid ) );
        this.myControl.setValue( eval( 'this.myControl._pendingValue' ) )

        let mIndex: number = this.AllProjects.findIndex( x => x.id == parseInt( this.projid ) );

        this.AllProjects[ mIndex ].strdescription = eval( 'this.myControl._pendingValue' );
        this.fillAutocomplete( true );
      } );

  }


  //Saves project CSV and REZ by order
  SaveNewProject ()
  {
    this.bL.Permissions( 3 );
    if ( $( "#newProjectNameTxt" ).val() == '' )
    {
      $( "#mDeleteProjectMessageAdvertence" ).css( 'display', 'block' );
      $( "#AdevrtenceMessadeTD" ).html( 'שם הפרויקט חובה' );
      return;
    }

    if ( this.showTableAnalisisGral.length == 0 )
    {
      $( "#mDeleteProjectMessageAdvertence" ).css( 'display', 'block' );
      $( "#AdevrtenceMessadeTD" ).html( 'לא בחרו אובייקט' );
      return;
    }

    $( "#mwaitmediv" ).css( 'display', 'block' );
    this.mCounterCSV = this.mCounterREZ = 0;

    let params = new HttpParams().set( 'mJsonProject', this.GetMjsonProject() );
    let obs = this._http.get<number>( this.mconfig.mUrl + "/mMethods/InsertNewProject", { params: params } )
      .subscribe( ( res ) =>
      {
        let newID: number = res;
        this.AllProjects.push( new Projects( newID, 1, $( "#newProjectNameTxt" ).val(), 'comment', null, null, null, null, this.objectType ) );
        this.myControl.reset();
        $( "#newProjectNameTxt" ).val( '' );
        this.projid = newID.toString();
        this.insertREZ( newID );

      } );

  }
  insertREZ ( newID: number )
  {
    let params = new HttpParams().set( 'mJsonREZ', this.GetResToSave() ).set( "prjid", newID.toString() );

    let obs = this._http.get<void>( this.mconfig.mUrl + "/mMethods/InsertNewRes", { params: params } )
      .subscribe( ( res ) =>
      {
        this.mCounterREZ++;
        if ( this.mCounterREZ >= this.showTableAnalisisGral.length || this.mCounterREZ >= 10000 )
        {
          this.insertCSV( newID );
          return;
        }
        //Recursion
        this.insertREZ( newID );
      } );
  }

  insertCSV ( newID: number )
  {
    this.mUI.insertCSV( this._http, this.mconfig, this.showPointsOnFirstTable, this.mCounterREZ, this.mCounterCSV, newID );
  }
  GetMjsonProject (): string
  {
    return this.mUI.GetMjsonProject( this.objectType );
  }
  GetMjsonProjectUpdate (): string
  {
    return this.mUI.GetMjsonProjectUpdate( this.projid, this.objectType );
  }
  GetCSVToSave (): string
  {
    return this.mUI.GetCSVToSave( this.showPointsOnFirstTable, this.mCounterCSV );
  }
  GetResToSave (): string
  {
    return this.mUI.GetResToSave( this.showTableAnalisisGral, this.GetObects.mObjects, this.mCounterREZ );
  }

  //Cant to send to mui
  changeSelectorProjectView ( mFlag: boolean )
  {

    if ( mFlag )
    {
      this.fillAutocomplete( true );
      $( "#mSelectorNewProjectDiv_Exists" ).css( 'display', 'inline-table' );
      $( "#mSelectorNewProjectDiv_New" ).css( 'display', 'none' );
    } else
    {
      $( "#mSelectorNewProjectDiv_Exists" ).css( 'display', 'none' );
      $( "#mSelectorNewProjectDiv_New" ).css( 'display', 'inline-table' );


    }


  }
  /////////////////////////////DELETE PROJECT//////////////////////////////////////////////////////////////////////////////////

  //Cant to send to mui
  DeleteProject ()
  {

    this.bL.Permissions( 5 );
    $( "#mDeleteProjectMessage" ).css( 'display', 'none' );
    $( "#divLoopNet" ).css( 'display', 'none' );
    $( "#mwaitmediv" ).css( 'display', 'block' );
    let params = new HttpParams().set( "prjid", this.projid );
    let obs = this._http.get<void>( this.mconfig.mUrl + "/mMethods/DeleteProject", { params: params } )
      .subscribe( ( res ) =>
      {
        let mIndex = this.AllProjects.findIndex( x => x.id == parseInt( this.projid ) );
        this.AllProjects.splice( mIndex, 1 );
        this.fillAutocomplete( true );
        this.myControl.setValue( null );
        $( "#mwaitmediv" ).css( 'display', 'none' );
        this.mButDeselectAll();
        this.viewer.entities.removeAll();
        this.projid = "0";
      } );
  }
  CancelDelete ()
  {
    this.mUI.CancelDelete();
  }
  ShowDeleteMessage ()
  {
    $( "#mDeleteProjectMessage" ).css( 'display', 'block' );
  }

  ////////////////////CalculateLoopsNET

  UpdateAditionalSegments ()
  {

    this.segmentsToTihum = this.mUI.UpdateAditionalSegments( this.solveLoosFirstData, this.GetObects.mObjects, this.mVertices,
      this.AllLoopsAndLinesSegments, this.segmentsToTihum, this.segmentsToTihum_order
    );

  }



  CalculateLoopsNET ()
  {
    //Hay que sumarle restarle los loops aca
    //this.AllLoopsOnNetSegments=[]

    this.mUI.CalculateLoopsNET( this.GetObects.mObjects, this.mVertices,
      this.solveLoosFirstData, this.solveLoopsNets_Main3, this.segmentsToTihum )




  }

  GetSegemtnArray ( allRez: typeRez[] ): mSegment[]
  {
    return this.mUI.GetSegemtnArray( allRez )
  }

  FilterLine ( event: any )
  {
    this.showLinesOnFirstTable_filtered = this.showLinesOnFirstTable.filter( x => x.mPA.toLowerCase().indexOf( event.srcElement.value.toLowerCase() ) != -1 || x.mPB.toLowerCase().indexOf( event.srcElement.value.toLowerCase() ) != -1 );
  }


  filterLoopsNet ( event: any )
  {
    if ( event.srcElement.value === '' )
    {
      this.mKnowedNETPoints_filterd = this.mKnowedNETPoints;
      return;
    }
    this.mKnowedNETPoints_filterd = this.mKnowedNETPoints.filter( x => x.nam.toLowerCase().indexOf( event.srcElement.value.toLowerCase() ) !== -1 );
  }

  loopNetSubTabs ( mIndex: number )
  {
    this.mUI.loopNetSubTabs( mIndex )
  }

  //<div class="mTabsGrey"( click ) = "loopNetSubTabs(this,1)" > כללי < /div>
  // border: solid 1px silver; height: 40px;background-color: white;line-height: 40px
  DoTablesForLines ( AllLines: ObjectTypeBox ): void
  {
    this.showLinesOnFirstTable = [];

    if ( AllLines == undefined )
      return;
    let mOrder: number = 0;
    for ( let i = 0; i < AllLines.objectBoxArray.length; i++ )
    {
      for ( let j = 0; j < AllLines.objectBoxArray[ i ].HeighDiffBoxIndexArray.length; j++ )
      {
        for ( let k = 0; k < AllLines.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray.length; k++ )
        {
          let HasKnowedPoint: boolean = false;
          for ( let m = 0; m < AllLines.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray.length; m++ )
          {
            let last: number = AllLines.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ].length - 1;
            let Pa: string = AllLines.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ][ 0 ].PointA;
            let Pb: string = AllLines.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ][ last ].PointB;

            ////////////////Filter only the has knowed point/////////////////////////////////////////

            //Not Write loops
            if ( Pa === Pb )
              continue;


            if ( this.GetObects.mObjects.mCsv.findIndex( x => x.heiort != null && x.nam === Pa ) != -1 )
              HasKnowedPoint = true;

            if ( this.GetObects.mObjects.mCsv.findIndex( x => x.heiort != null && x.nam === Pb ) != -1 )
              HasKnowedPoint = true;


            /////////////////////////////////////////////////////////////////////////////////////////////////////////////

            //Calculating Close Vector
            let mCloseAt: number = 0;
            let mPerimeter: number = 0;
            let mSegmentNumber: number = 0;

            for ( let n = 0; n < AllLines.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ].length; n++ )
            {

              for ( let o = 0; o < AllLines.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ][ n ].lstSegment.length; o++ )
              {
                mCloseAt += AllLines.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ][ n ].lstSegment[ o ].HeighDifference;
                mPerimeter += AllLines.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ][ n ].lstSegment[ o ].Distance;
                mSegmentNumber++;
              }
            }
            this.mUniqueIDToObject++;
            let strIndex: string = i.toString() + "_" + j.toString() + "_" + k.toString() + "_" + m.toString() + "_" + mOrder.toString() + "_" + this.mUniqueIDToObject.toString();

            mOrder++;
            let item: ShowOnFirstTable;
            if ( mOrder === 1 && this.objectType === 0 )
            {

              this.mUniqueIDToObject++;
              item = new ShowOnFirstTable( [], Pa, Pb, mCloseAt, mPerimeter, mSegmentNumber, strIndex, mOrder, 'yellowRow', null, true, AllLines.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ], this.mUniqueIDToObject )

              ///Adding to the extracted list
              let mTempoSegment = AllLines.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ];
              let mTempoArray: mSegment[] = [];
              for ( let h = 0; h < mTempoSegment.length; h++ )
              {
                for ( let p = 0; p < mTempoSegment[ h ].lstSegment.length; p++ )         
                {
                  mTempoArray.push( mTempoSegment[ h ].lstSegment[ p ] )
                }
              }
              this.AllLoopsAndLinesSegments.push( mTempoArray );
            }
            else
            {
              this.mUniqueIDToObject++;
              item = new ShowOnFirstTable( [], Pa, Pb, mCloseAt, mPerimeter, mSegmentNumber, strIndex, mOrder, '', null, true, AllLines.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ], this.mUniqueIDToObject )
              ///Adding to the extracted list
              let mTempoSegment = AllLines.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ];
              let mTempoArray: mSegment[] = [];
              for ( let h = 0; h < mTempoSegment.length; h++ )
              {
                for ( let p = 0; p < mTempoSegment[ h ].lstSegment.length; p++ )         
                {
                  mTempoArray.push( mTempoSegment[ h ].lstSegment[ p ] )
                }
              }
              this.AllLoopsAndLinesSegments.push( mTempoArray );
            }
            if ( HasKnowedPoint )
              this.showLinesOnFirstTable.push( item );
          }
        }
      }
    }

    this.showLinesOnFirstTable.sort( function ( a, b ) { return a.mPerimeter - b.mPerimeter } );

    //if ( this.showLinesOnFirstTable.length > 300 )
    //  this.showLinesOnFirstTable.splice( 300, this.showLinesOnFirstTable.length - 300 );

    let GetKnowed: typeCsv[] = this.GetObects.mObjects.mCsv.filter( x => x.heiort != null );


    // if ( this.showLinesOnFirstTable.length > 200 )
    this.showLinesOnFirstTable_filtered = this.showLinesOnFirstTable;//.splice( 200, this.showLinesOnFirstTable.length );
    //else this.showLinesOnFirstTable_filtered = this.showLinesOnFirstTable;



  }


  DoTablesForLoops ( AllLoops: ObjectTypeBox )
  {
    // if ( this.bSearchingLoop === true )
    //   return;
    this.wikiViewCalculation = new WikiViewCalculation( this.GetObects.mObjects.mCsv );
    this.showLoopsOnFirstTable = [];
    let mOrder: number = 0;
    if ( AllLoops == undefined )
      return;

    for ( let i = 0; i < AllLoops.objectBoxArray.length; i++ )
    {
      for ( let j = 0; j < AllLoops.objectBoxArray[ i ].HeighDiffBoxIndexArray.length; j++ )
      {
        for ( let k = 0; k < AllLoops.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray.length; k++ )
        {
          for ( let m = 0; m < AllLoops.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray.length; m++ )
          {
            //AllLoops.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ] = this.commons.ReBuildLoopByKnowedPoint( AllLoops.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ], this.GetObects.mObjects.mCsv );

            let last: number = AllLoops.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ].length - 1;

            if ( last == -1 )
              continue;

            let Pa: string = AllLoops.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ][ 0 ].PointA;
            let Pb: string = AllLoops.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ][ last ].PointB;

            //Calculating Close Vector
            let mCloseAt: number = 0;
            let mPerimeter: number = 0;
            let mSegmentNumber: number = 0;

            for ( let l = 0; l < AllLoops.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ].length; l++ )
            {
              mPerimeter = mSegmentNumber = mCloseAt = 0;

              for ( let n = 0; n < AllLoops.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ].length; n++ )
              {
                for ( let o = 0; o < AllLoops.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ][ n ].lstSegment.length; o++ )
                {
                  mCloseAt += AllLoops.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ][ n ].lstSegment[ o ].HeighDifference;
                  mPerimeter += AllLoops.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ][ n ].lstSegment[ o ].Distance;
                  mSegmentNumber++;
                }
              }
            }
            this.mUniqueIDToObject++;
            let strIndex: string = i.toString() + "_" + j.toString() + "_" + k.toString() + "_" + m.toString() + "_" + this.mUniqueIDToObject.toString();

            mOrder++;
            let item: ShowOnFirstTable;
            if ( mOrder === 1 && this.objectType === 1 )
            {
              this.mUniqueIDToObject++;
              item = new ShowOnFirstTable( [], Pa, Pb, mCloseAt, mPerimeter, mSegmentNumber, strIndex, mOrder, 'yellowRow', this.wikiViewCalculation.GetPolygonArea( AllLoops.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ] ), true, AllLoops.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ], this.mUniqueIDToObject );


              ///Adding to the extracted list
              let mTempoSegment = AllLoops.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ];
              let mTempoArray: mSegment[] = [];
              for ( let h = 0; h < mTempoSegment.length; h++ )
              {
                for ( let p = 0; p < mTempoSegment[ h ].lstSegment.length; p++ )         
                {
                  mTempoArray.push( mTempoSegment[ h ].lstSegment[ p ] )
                }
              }
              this.AllLoopsAndLinesSegments.push( mTempoArray );
            }
            else
            {
              this.mUniqueIDToObject++;
              item = new ShowOnFirstTable( [], Pa, Pb, mCloseAt, mPerimeter, mSegmentNumber, strIndex, mOrder, '', this.wikiViewCalculation.GetPolygonArea( AllLoops.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ] ), true, AllLoops.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ], this.mUniqueIDToObject );


              ///Adding to the extracted list
              let mTempoSegment = AllLoops.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ];
              let mTempoArray: mSegment[] = [];
              for ( let h = 0; h < mTempoSegment.length; h++ )
              {
                for ( let p = 0; p < mTempoSegment[ h ].lstSegment.length; p++ )         
                {
                  mTempoArray.push( mTempoSegment[ h ].lstSegment[ p ] )
                }
              }
              this.AllLoopsAndLinesSegments.push( mTempoArray );
            }
            this.showLoopsOnFirstTable.push( item );
          }
        }
      }
    }

    this.showLoopsOnFirstTable = this.showLoopsOnFirstTable.sort( function ( a, b ) { return a.mArea - b.mArea } );

    this.GetNetLoops();
  }



  GetSegmentByIndex ( mItem: string, nType: number ): mSegment[]
  {
    return this.mUI.GetSegmentByIndex( mItem, nType, this.vwmain );
  }


  mViewGeneralAnalisisForNET ()
  {
    let mItem: ShowOnFirstTable[] = [];

    let mOrder: number = 0;
    for ( let i = 0; i < this.segmentsToTihum.length; i++ )
    {
      this.segmentsToTihum[ i ].msegments = this.commons.ReBuildLoopByKnowedPoint( this.segmentsToTihum[ i ].msegments, this.GetObects.mObjects.mCsv );
      for ( let j = 0; j < this.segmentsToTihum[ i ].msegments.length; j++ )
      {
        for ( let k = 0; k < this.segmentsToTihum[ i ].msegments[ j ].lstSegment.length; k++ )
        {
          mOrder++;

          let heigBangalA: number = this.GetObects.mObjects.mCsv.find( x => x.nam === mTempo.PointA ).heiort;
          let heigBangalB: number = this.GetObects.mObjects.mCsv.find( x => x.nam === mTempo.PointB ).heiort;


          let mProd: number = 1;
          let mRez: typeRez = this.GetObects.mObjects.mRez.find( x => x.pa === mTempo.PointA && x.pb === mTempo.PointB );
          if ( mRez == undefined )
          {
            mRez = this.GetObects.mObjects.mRez.find( x => x.pa === mTempo.PointB && x.pb === mTempo.PointA );
            mProd = -1;
          }

          let mTempo: mSegment = this.segmentsToTihum[ i ].msegments[ j ].lstSegment[ k ];
          this.showTableAnalisisGral.push( new ShowTableAnalisisGral(
            mOrder,
            mTempo.PointA,
            mTempo.PointB,
            mTempo.HeighDifference,
            ( ( heigBangalA == null || heigBangalB == null ) ? null : ( heigBangalB - heigBangalA ) ),
            mTempo.Distance,
            null,
            null,
            ( mRez.bf * mProd ),
            false,
            true, null, null, null, null, heigBangalA, heigBangalB, null ) );
        }
      }
    }
  }

  //Showing on table nType:1 loops, 0 : lines
  mViewGeneralAnalisis ( mItem: string, nType: number, bNew: boolean, bReverse: boolean )
  {
    this.currentMindex = mItem;
    let mlinesLoops_01: mLinesLoops_01 = new mLinesLoops_01();

    $( "#mContainer01" ).css( 'display', 'block' );
    if ( this.objectType === 1 || this.objectType === 0 )
    {
      let mIndexes: string[] = mItem.split( '_' );
      let i: number = parseInt( mIndexes[ 0 ] );
      let j: number = parseInt( mIndexes[ 1 ] );
      let k: number = parseInt( mIndexes[ 2 ] );
      let m: number = parseInt( mIndexes[ 3 ] );

      if ( bNew != false )
      {
        this.showTableAnalisisGral = [];
        this.showPointsOnFirstTable = [];
      }

      let mObjectsOnTable: ObjectTypeBox;
      if ( nType === 1 )
        mObjectsOnTable = this.commons.getLoops( this.vwmain.mIndexLineBoxes );
      if ( nType === 0 )
        mObjectsOnTable = this.commons.getLines( this.vwmain.mIndexLineBoxes );

      let mOrder: number = 0;

      //Calculating Close Vector
      let mCloseAt: number = 0;
      let mPerimeter: number = 0;

      let checkPoints: string[] = [];

      if ( bReverse )
        mObjectsOnTable.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ] =
          mlinesLoops_01.ReverseLine( mObjectsOnTable.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ] );

      for ( let n = 0; n < mObjectsOnTable.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ].length; n++ )
      {
        if ( nType === 1 || nType === 2 )
        {
          mObjectsOnTable.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ] =
            this.commons.ReBuildLoopByKnowedPoint( mObjectsOnTable.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ], this.GetObects.mObjects.mCsv );
        }

        for ( let o = 0; o < mObjectsOnTable.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ][ n ].lstSegment.length; o++ )
        {

          let mTempo: mSegment = mObjectsOnTable.objectBoxArray[ i ].HeighDiffBoxIndexArray[ j ].segmentIndexArray[ k ].ObjectArray[ m ][ n ].lstSegment[ o ];

          mCloseAt += mTempo.HeighDifference;
          mPerimeter += mTempo.Distance;


          let heigBangalA: number = null;
          let heigBangalB: number = null;

          if ( this.GetObects.mObjects.mCsv.find( x => x.nam === mTempo.PointB ) == null || this.GetObects.mObjects.mCsv.find( x => x.nam === mTempo.PointA ) == null )
            continue;

          mOrder++;

          heigBangalA = this.GetObects.mObjects.mCsv.find( x => x.nam === mTempo.PointA ).heiort;
          heigBangalB = this.GetObects.mObjects.mCsv.find( x => x.nam === mTempo.PointB ).heiort;

          let mProd: number = 1;
          let mRez: typeRez = this.GetObects.mObjects.mRez.find( x => x.pa === mTempo.PointA && x.pb === mTempo.PointB );
          if ( mRez == undefined )
          {
            mRez = this.GetObects.mObjects.mRez.find( x => x.pa === mTempo.PointB && x.pb === mTempo.PointA );
            mProd = -1;
          }

          this.showTableAnalisisGral.push( new ShowTableAnalisisGral(
            mOrder,
            mTempo.PointA,
            mTempo.PointB,
            mTempo.HeighDifference,
            ( ( heigBangalA == null || heigBangalB == null ) ? null : ( heigBangalB - heigBangalA ) ),
            mTempo.Distance,
            null,
            null,
            ( mRez.bf * mProd ),
            false,
            true, null, null, null, null, heigBangalA, heigBangalB, null ) );

          //Getting all point belonged to lines/loops
          if ( checkPoints.findIndex( x => x === mTempo.PointA ) == -1 )
          {
            this.showPointsOnFirstTable.push( this.GetObects.mObjects.mCsv.filter( x => x.nam === mTempo.PointA )[ 0 ] );
            checkPoints.push( mTempo.PointA );
          }
          if ( checkPoints.findIndex( x => x === mTempo.PointB ) == -1 )
          {
            this.showPointsOnFirstTable.push( this.GetObects.mObjects.mCsv.filter( x => x.nam === mTempo.PointB )[ 0 ] );
            checkPoints.push( mTempo.PointB );
          }
        }
      }
    }

    this.tihumInteractive = new TihumInteractive( this.showTableAnalisisGral, this.GetObects, this.objectType, true );
    this.tihumInteractive.CalculateTihumTable();
    this.mgrav = new mGravimetria( this.showPointsOnFirstTable, this.showTableAnalisisGral, this.gravFactor );

    setTimeout( () =>
    {
      $( "#mwaitmediv" ).css( 'display', 'none' );
    }, 10 )
  }

  SelectKitzvat ()
  {
    this.mgrav = new mGravimetria( this.showPointsOnFirstTable, this.showTableAnalisisGral, this.gravFactor );
    this.tihumInteractive.SelectKitzvat();
  }

  BiltiTluiotLaTihum ()
  {
    this.mUI.BiltiTluiotLaTihum( this.mSelectorTab_01, this.tihumInteractive, this.showLoopsNetsOnFirstTable, this.segmentsToTihum_order, this.segmentsToTihum
      , this.objectType, this.GetObects.mObjects );
  }



  SelectRowToCalculate ( event: any )
  {
    this.tihumInteractive.SelectRowToCalculate( event, true );
  }
  SelectRank ( event: any )
  {
    this.mUI.SelectRank( event, this.tihumInteractive, this.checkRank, this._http );
  }

  findSameSegemntOnTihum ( msegment: mSegment[] ): number
  {
    return this.mUI.findSameSegemntOnTihum( msegment, this.segmentsToTihum );
  }
  FillGhAndOCab ()
  {
    this.mgrav = new mGravimetria( this.showPointsOnFirstTable, this.showTableAnalisisGral, this.gravFactor )
  }

  resetGravValue ( event: any )
  {
    this.gravFactor = event.srcElement.value;
  }

  CalculateHeighBeforCalculations (): TablePointHeights[]
  {
    return this.mUI.CalculateHeighBeforCalculations( this.GetObects.mObjects.mRez, this.GetObects.mObjects.mCsv );
  }

  GoAndBack ( mGo: boolean )
  {
    this.mUI.GoAndBackmGo( this.mgrav, mGo, this.tihumInteractive, this.showTableAnalisisGral, this.showPointsOnFirstTable, this.GetObects )
  }


  getRezFileByshowTable ()
  {
    let createForm: CreateForms = new CreateForms( this._http, this.routerAct, this.commons.resumeSegments( this.commons.GetSegmentFormView( this.showTableAnalisisGral ) ), this.GetObects.mObjects.mRez, this.showTableAnalisisGral )
    createForm.InsertRezLine( true, false, false, true );
  }

  GetFA0File ( byAlphabet: boolean )
  {
    let createForm: CreateForms = new CreateForms( this._http, this.routerAct, this.commons.resumeSegments( this.commons.GetSegmentFormView( this.showTableAnalisisGral ) ), this.GetObects.mObjects.mRez, this.showTableAnalisisGral )
    createForm.InsertRezLine( false, true, false, byAlphabet );
  }

  ReverseSelected ()
  {
    this.mViewGeneralAnalisis( this.currentMindex, this.objectType, true, true );
  }
  getRezAllLines ()
  {
    let createForm: CreateForms = new CreateForms( this._http, null, null, null, null );
    createForm.GetRezAll();
  }


  tabsCheckfiles ( nIndex: number )
  {
    this.mUI.tabsCheckfiles( nIndex );
  }

  getRankDetailsTable ( item: RankTitlesTable )
  {
    this.mUI.getRankDetailsTable( item, this.checkRank );
  }
}






