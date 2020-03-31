import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ManageObjectcs } from './ManageObjects';
import { mService, typeCsv, typeRez, MapiCesium } from '../../m-cesium/Script/MapiCesium';
import { ActivatedRoute } from '@angular/router'
import $ from 'jquery';
import { mConfig } from '../../../../Commons/mConfig';
import { HeightCalculation, TableDeltaHeights, TablePointHeights } from '../../../../Scripts/Ts/Stored/HeightCalculation_Main1';

@Component( {
    //selector: 'TestAPi-component',
    //templateUrl: './TestAPi.component.html',
    //styleUrls: [ './TestAPi.component.css' ]
} )
export class CesiumGetObjects implements OnInit
{

    viewer: any;
    mMessageNull: string;
    mTempo: string = "הנקודות הבאות לא נמצאו במאגר: ";
    prjid: number;
    mconfig: mConfig = new mConfig();
    mInit: string;
    mTableDeltaHeights: TableDeltaHeights[];
    mTablePointHeights: TablePointHeights[];

    constructor ( private _http: HttpClient, viewer: any, private route: ActivatedRoute )
    {
        this.viewer = viewer;
    }
    mObjects: mService;
    ngOnInit () 
    {

        if ( this.mInit === "0" )
            this.GetDefaultProject();
        else this.GetSelectedProject( this.mInit );



        let imageryLayers = this.viewer.imageryLayers;
        //imageryLayers.addImageryProvider( this.CreateGeoserverLayer8082( true, "Raster2018:All_50_01_4326", "" ) );
        imageryLayers.addImageryProvider( new Cesium.GridImageryProvider() );
        imageryLayers.addImageryProvider( this.CreateGeoserverLayer8081( true, "WorkSpace_publish:GvulotShifut", "" ) );





    }

    CreateGeoserverLayer8081 = function ( bTiled, name, mViewParams )
    {

        if ( mViewParams == undefined )
            mViewParams = '';

        if ( bTiled == false )
        {
            return new Cesium.WebMapServiceImageryProvider( {
                url: 'http://qpersonalmap:8081/geoserver/WorkSpace_publish/wms',
                exceptions: 'application/vnd.ogc.se_inimage',
                layers: name,
                tiled: true,
                parameters: {
                    transparent: true,
                    format: 'image/png',
                    viewparams: mViewParams
                }

            } )
        }
        if ( bTiled == true )
        {

            return new Cesium.WebMapTileServiceImageryProvider( {
                url: 'http://qpersonalmap:8081/geoserver/gwc/service/wmts',
                tileMatrixSetID: 'EPSG:4326',
                tileMatrixLabels: [ 'EPSG:4326:0', 'EPSG:4326:1', 'EPSG:4326:2', 'EPSG:4326:3', 'EPSG:4326:4', 'EPSG:4326:5', 'EPSG:4326:6', 'EPSG:4326:7', 'EPSG:4326:8', 'EPSG:4326:9', 'EPSG:4326:10', 'EPSG:4326:11', 'EPSG:4326:12', 'EPSG:4326:13', 'EPSG:4326:14', 'EPSG:4326:15', 'EPSG:4326:16', 'EPSG:4326:17', 'EPSG:4326:18', 'EPSG:4326:19', 'EPSG:4326:20', 'EPSG:4326:21' ],
                layer: name,
                style: '',
                tilingScheme: new Cesium.GeographicTilingScheme(),
                format: 'image/png',
                parameters: {
                    viewparams: mViewParams
                }
            } )
        }
    }

    CreateGeoserverLayer8082 = function ( bTiled, name, mViewParams )
    {

        if ( mViewParams == undefined )
            mViewParams = '';

        if ( bTiled == false )
        {
            return new Cesium.WebMapServiceImageryProvider( {
                url: 'http://qpersonalmap:8082/geoserver/Raster2018/wms',
                exceptions: 'application/vnd.ogc.se_inimage',
                layers: name,
                tiled: true,
                parameters: {
                    transparent: true,
                    format: 'image/png',
                    viewparams: mViewParams
                }

            } )
        }
        if ( bTiled == true )
        {
            //Raster2018%3AAll_50_1
            return new Cesium.WebMapTileServiceImageryProvider( {
                url: 'http://qpersonalmap:8082/geoserver/gwc/service/wmts',
                tileMatrixSetID: 'EPSG:4326',
                tileMatrixLabels: [ 'EPSG:4326:0', 'EPSG:4326:1', 'EPSG:4326:2', 'EPSG:4326:3', 'EPSG:4326:4', 'EPSG:4326:5', 'EPSG:4326:6', 'EPSG:4326:7', 'EPSG:4326:8', 'EPSG:4326:9', 'EPSG:4326:10', 'EPSG:4326:11', 'EPSG:4326:12', 'EPSG:4326:13', 'EPSG:4326:14', 'EPSG:4326:15', 'EPSG:4326:16', 'EPSG:4326:17', 'EPSG:4326:18', 'EPSG:4326:19', 'EPSG:4326:20', 'EPSG:4326:21' ],

                layer: name,
                style: '',
                tilingScheme: new Cesium.GeographicTilingScheme(),
                format: 'image/png',
                parameters: {
                    viewparams: mViewParams
                }
            } )
        }
    }

    GetDefaultProject ()
    {

        let mQueryString: string = this.mconfig.mUrl + "/api/ReadFiles?withCsv=false&withCoordinates=true&withGgal=true";

        let obs = this._http.get<mService>( mQueryString )
            .subscribe( ( res ) =>
            {
                this.mObjects = res;
                // let rrrrr = res.mCsv.find( x => x.nam === '3239B' );
                this.DoWork();
                $( "#mwaitmediv" ).css( 'display', 'none' );
            } );

    }


    GetSelectedProject ( prjid: string )
    {
        $( "#mwaitmediv" ).css( 'display', 'block' );
        const id: string = this.route.snapshot.paramMap.get( 'id' );
        let mQueryString: string = this.mconfig.mUrl + "/api/getFromDB/" + prjid;

        let obs = this._http.get<mService>( mQueryString )
            .subscribe( ( res ) =>
            {
                this.mObjects = res;
                $( "#mwaitmediv" ).css( 'display', 'none' );
                this.DoWork();

                this.SelectAll();

                $( "#doAnalisisOfSelected" ).focus();

                if ( res.projectData.objecttype === 0 )
                {
                    let melement: HTMLElement = document.getElementById( "tabsLinesTabView" ) as HTMLElement;
                    melement.click();
                }
                if ( res.projectData.objecttype === 1 )
                {
                    let melement: HTMLElement = document.getElementById( "tabsLoopsTabView" ) as HTMLElement;
                    melement.click();
                }
                if ( res.projectData.objecttype === 2 )
                {
                    let melement: HTMLElement = document.getElementById( "tabsLoopsNETView" ) as HTMLElement;
                    melement.click();
                }
                let melement: HTMLElement = document.getElementById( "doAnalisisOfSelected" ) as HTMLElement;
                melement.click();

            } );
    }
    SelectAll ()
    {
        //Further: do this when the points and lines are createds
        let mapicesium: MapiCesium = new MapiCesium();
        for ( let q = 0; q < this.viewer.entities._entities._array.length; q++ )
        {
            if ( this.viewer.entities._entities._array[ q ]._mType === mapicesium.mTypePoint )
                this.viewer.entities._entities._array[ q ].point.color = Cesium.Color.AQUA;

            if ( this.viewer.entities._entities._array[ q ]._mType === mapicesium.mTypeLine )
                this.viewer.entities._entities._array[ q ].polyline.material = Cesium.Color.AQUA;
        }


    }

    DoWork ()
    {
        this.viewer.entities.removeAll();


        this.UpdateAproxheight();

        this.DrawSegments( this.viewer );
        //Adding Labes and points
        this.DrawLabelsAndPoints( this.viewer );
        //Adding segments

        this.viewer.zoomTo( this.viewer.entities );
    }
    UpdateAproxheight ()
    {
        //Calculate Delta Height
        this.mTableDeltaHeights = [];
        this.mTablePointHeights = [];
        let knowedPoints: typeCsv[] = this.mObjects.mCsv.filter( x => x.heiort != null );
        for ( let i = 0; i < this.mObjects.mRez.length; i++ )
        {
            let tempoA: typeCsv = knowedPoints.find( x => x.nam === this.mObjects.mRez[ i ].pa );
            if ( tempoA == undefined )
            {
                this.mTableDeltaHeights.push( new TableDeltaHeights( this.mObjects.mRez[ i ].pa, this.mObjects.mRez[ i ].pb, this.mObjects.mRez[ i ].hei, null, null ) );
                continue;
            }

            let tempoHeightA: number = tempoA.heiort;
            let tempoHeightB: number = tempoHeightA + this.mObjects.mRez[ i ].hei;

            if ( tempoHeightA != null && tempoHeightB == null )
                tempoHeightB = tempoHeightA + this.mObjects.mRez[ i ].hei

            if ( tempoHeightA == null && tempoHeightB != null )
                tempoHeightA = tempoHeightB - this.mObjects.mRez[ i ].hei

            this.mTableDeltaHeights.push( new TableDeltaHeights( this.mObjects.mRez[ i ].pa, this.mObjects.mRez[ i ].pb, this.mObjects.mRez[ i ].hei, tempoHeightA, tempoHeightB ) );
        }
        let mHeightCalculation: HeightCalculation = new HeightCalculation();
        this.mTablePointHeights = mHeightCalculation.Main_4( this.mTableDeltaHeights, this.mObjects.mCsv );

        for ( let i = 0; i < this.mTablePointHeights.length; i++ )
        {

            if ( this.mObjects.mCsv[ this.mObjects.mCsv.findIndex( x => x.nam === this.mTablePointHeights[ i ].Point ) ] == undefined )
                continue;

            this.mObjects.mCsv[ this.mObjects.mCsv.findIndex( x => x.nam === this.mTablePointHeights[ i ].Point ) ].heightAprox = this.mTablePointHeights[ i ].mHeight;
        }


    }

    DrawSegments ( viewer: any )
    {

        let mRepeated: string[] = [];

        this.mMessageNull = this.mTempo;
        let mObjectsClass: ManageObjectcs = new ManageObjectcs( viewer );
        for ( let i = 0; i < this.mObjects.mRez.length; i++ )
        {

            let mCsvData_PA: typeCsv = this.GetDataPointFromCSV( this.mObjects, this.mObjects.mRez[ i ].pa );
            let mCsvData_PB: typeCsv = this.GetDataPointFromCSV( this.mObjects, this.mObjects.mRez[ i ].pb );

            if ( mCsvData_PA == null )
            {
                if ( mRepeated.findIndex( x => x === this.mObjects.mRez[ i ].pa ) === - 1 )
                    mRepeated.push( this.mObjects.mRez[ i ].pa );
                continue;
            }


            if ( mCsvData_PB == null )
            {

                if ( mRepeated.findIndex( x => x === this.mObjects.mRez[ i ].pa ) === - 1 )
                    mRepeated.push( this.mObjects.mRez[ i ].pa );
                continue;
            }




            var mArrLine: number[] = [];
            mArrLine.push( mCsvData_PA.x );
            mArrLine.push( mCsvData_PA.y );
            mArrLine.push( mCsvData_PA.heightAprox );
            mArrLine.push( mCsvData_PB.x );
            mArrLine.push( mCsvData_PB.y );
            mArrLine.push( mCsvData_PB.heightAprox );

            mObjectsClass.CreateSegment( mArrLine, '1', mCsvData_PA.nam, mCsvData_PB.nam, false, this.mObjects.mRez[ i ] );
            // mObjectsClass.CreateLabel( this.mObjects.mCsv[ i ].nam, this.mObjects.mCsv[ i ].x, this.mObjects.mCsv[ i ].y, this.mObjects.mCsv[ i ].heightAprox, 1, false, this.mObjects.mCsv[ i ] );

        }





        if ( mRepeated.length === 0 )
        {
            $( "#mMessageNull" ).html( '' );
        }
        else
        {
            this.mMessageNull = this.mTempo;
            for ( let i = 0; i < mRepeated.length; i++ )
            {
                this.mMessageNull = this.mMessageNull.concat( mRepeated[ i ] );
                if ( i != mRepeated.length - 1 )
                    this.mMessageNull = this.mMessageNull.concat( "; " );
            }
            $( "#mMessageNull" ).html( this.mMessageNull );
        }




    }
    DrawLabelsAndPoints ( viewer: any )
    {
        let mObjectsClass: ManageObjectcs = new ManageObjectcs( viewer );
        //this.mObjects.mCsv[0].X
        for ( let i = 0; i < this.mObjects.mCsv.length; i++ )
        {
            mObjectsClass.CreateLabel( this.mObjects.mCsv[ i ].nam, this.mObjects.mCsv[ i ].x, this.mObjects.mCsv[ i ].y, this.mObjects.mCsv[ i ].heightAprox, 1, false, this.mObjects.mCsv[ i ] );
        }
    }

    GetRezData ( mObjects: mService, mPointA: string, mPointB: string ): typeRez
    {
        //get go
        for ( let i = 0; i < mObjects.mRez.length; i++ )
        {
            if ( mObjects.mRez[ i ].pa === mPointA && mObjects.mRez[ i ].pb === mPointB )
                return mObjects.mRez[ i ];
        }

        //Get Back
        for ( let i = 0; i < mObjects.mRez.length; i++ )
        {
            if ( mObjects.mRez[ i ].pa === mPointB && mObjects.mRez[ i ].pb === mPointA )
            {
                mObjects.mRez[ i ].hei = mObjects.mRez[ i ].hei * ( -1 );
                return mObjects.mRez[ i ];
            }
        }

        return null;
    }

    GetDataPointFromCSV ( mObjects: mService, mPoint: string ): typeCsv
    {
        let mapiCesium: MapiCesium = new MapiCesium();
        return mapiCesium.GetDataPointFromCSV( mObjects, mPoint );
    }

}

