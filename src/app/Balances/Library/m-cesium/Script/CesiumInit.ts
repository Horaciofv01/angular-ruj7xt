import { ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { MapiCesium, mSelectedAndAll } from './MapiCesium';
import { CesiumGetObjects } from './mCesiumGetObjects';
import { mCesiumSelectedRectangle } from './mCesiumSelectedRectangle';
import { WV_Main } from '../../../../Scripts/Ts/WikiView/WV_Main';



export class CesiumInit
{




    constructor ( private el: ElementRef, private _http: HttpClient, mResult: any )
    {


        var mapiCesium: MapiCesium = new MapiCesium();

        /////////////////////////////INIT CESIUM AND SET VARIABLES//////////////////////////////

        const viewer = new Cesium.Viewer( 'cesiumcontainer', {

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

        var cartographic = new Cesium.Cartographic();
        var cartesian = new Cesium.Cartesian3();
        var camera = viewer.scene.camera;
        var ellipsoid = viewer.scene.mapProjection.ellipsoid;

        var scene = viewer.scene;
        var handler = new Cesium.ScreenSpaceEventHandler( scene.canvas );
        var imageryLayers = viewer.imageryLayers;

        var mPackage: any;

        var pupi: string = "PPPCACO";


        ///////////////////////GET DATAS////////////////////////////////////////////////////////

        // debugger


        let GetObects: CesiumGetObjects = new CesiumGetObjects( this._http, viewer, null );
        GetObects.ngOnInit();

        //Default view : Israel.
        viewer.camera.setView( {
            destination: Cesium.Rectangle.fromDegrees( 33.65749973443918, 29.053539379234657, 36.24918878344927, 34.035736654964985 )
        } );

        let selecting: mCesiumSelectedRectangle = new mCesiumSelectedRectangle( handler, scene, viewer );
        selecting.init( selecting );

        /////////////////////////////////////SJUJIT MAGDELET///////////////////////////////////////////////////////////////////////////////////////////////

        //Zoom the map
        document.getElementById( 'mButZoomToMap' ).addEventListener( 'click', function ()
        {
            //selecting.selectAction = 4: Zoom
            let selecting: mCesiumSelectedRectangle = new mCesiumSelectedRectangle( handler, scene, viewer );
            selecting.selectAction = 4; selecting.flag1 = true; selecting.flag5 = true; selecting.flag6 = false; selecting.flag3 = true;
            selecting.init( selecting );
        } );

        //Select objects
        document.getElementById( 'mButSelectRectangle' ).addEventListener( 'click', function ()
        {
            //
            let selecting: mCesiumSelectedRectangle = new mCesiumSelectedRectangle( handler, scene, viewer );
            //selecting.selectAction = 1: Select segments
            selecting.selectAction = 1; selecting.flag1 = true; selecting.flag5 = true; selecting.flag6 = false; selecting.flag3 = true;
            selecting.init( selecting );
        } );

        //Select objects
        document.getElementById( 'mButDeselectAll' ).addEventListener( 'click', function ()
        {
            //
            let selecting: mCesiumSelectedRectangle = new mCesiumSelectedRectangle( handler, scene, viewer );
            selecting.DeselectAll();
        } );

        //Select objects

        document.getElementById( 'doAnalisisOfSelected' ).addEventListener( 'click', function ()
        {

            let selecting: mCesiumSelectedRectangle = new mCesiumSelectedRectangle( handler, scene, viewer );
            let mSelected: mSelectedAndAll = selecting.GetDatasFromViewer();
            mSelected.mCsvAll = GetObects.mObjects.mCsv;
            mSelected.mRezAll = GetObects.mObjects.mRez;

            let vwmain: WV_Main = new WV_Main( mSelected );
            vwmain.GetMore( vwmain );

            mResult = vwmain.mIndexLineBoxes;


        } );

    }



}