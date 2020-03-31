import { MapiCesium, typeRez, typeCsv, mSelectedAndAll } from './MapiCesium';
import { ManageObjectcs } from './ManageObjects'



export class mCesiumSelectedRectangle
{

    /////Flags to set the action type of the selector rectangle
    flag1: boolean = false;
    flag2: boolean = false;
    flag3: boolean = false;
    flag4: boolean = false;
    flag5: boolean = false;
    flag6: boolean = false;
    /////////////////////////////////////////////////////////////
    MapPosx: number = 0;
    MapPosy: number = 0;
    MapPosInitx: number = 0;
    MapPosInity: number = 0;
    ////////////////////////////////////////////////////////////
    north: number = 0;
    sout: number = 0;
    east: number = 0;
    west: number = 0;
    ///////////////////////////////////////////////////////////////
    westNorth = [];
    westSouth = [];
    eastNorth = [];
    eastSouth = [];
    //////////////////////////////////////////////////////////////   
    longitudeString: number = 0;
    latitudeString: number = 0;
    ///////////////////////////////////////////////////////////

    posx: number = 0;
    posy: number = 0;
    initx: number = 0;
    inity: number = 0;
    mEntities = [];

    //////////////////////////////////////////////////////////////////////////

    selectAction: number = null; //0:segment +;1:select segment -; 2 point +; 3 point -; 4: Zoom

    //////////////////////////////////////////////////////////////////////

    handler: any;
    scene: any;
    viewer: any;

    ///////////////////////////////////////////////////////////////////////

    divSelector1: any;
    divSelector2: any;
    divSelector3: any;
    divSelector4: any;
    SelectedRectangle: any;
    selectedPointListEntitties = [];
    SelectedSegemntsArray: typeRez[] = [];
    SelectedPointsArray: typeCsv[] = [];

    ////////////////////////////////////////////////////////////////////

    mapiCesium: MapiCesium = new MapiCesium();

    constructor ( handler: any, scene: any, viewer: any )
    {
        this.handler = handler;
        this.scene = scene;
        this.viewer = viewer;
        this.mapiCesium = new MapiCesium();

        //this.handler.removeInputAction( Cesium.ScreenSpaceEventType.LEFT_CLICK );
        //this.handler.removeInputAction( Cesium.ScreenSpaceEventType.RIGHT_CLICK );
        this.handler.removeInputAction( Cesium.ScreenSpaceEventType.MOUSE_MOVE );
        this.SelectedSegemntsArray = [];
        this.SelectedPointsArray = [];
    }

    init ( mClass: mCesiumSelectedRectangle )
    {
        mClass.posx = mClass.posy = mClass.initx = mClass.inity = 0;

        //4 green sides of rectangle
        mClass.divSelector1 = document.getElementById( "divSelector1" );
        mClass.divSelector2 = document.getElementById( "divSelector2" );
        mClass.divSelector3 = document.getElementById( "divSelector3" );
        mClass.divSelector4 = document.getElementById( "divSelector4" );

        //Happens when clicking right mouse
        this.handler.setInputAction( function ( mousedown )
        {
            if ( mClass.flag1 != true )
                return;

            //starting to create e new selection box;
            //mLabel1.innerHTML = "IN A WAY";
            mClass.divSelector1.style.display = mClass.divSelector2.style.display = mClass.divSelector3.style.display = mClass.divSelector4.style.display = "block";

            mClass.initx = mousedown.position.x;
            mClass.inity = mousedown.position.y;

            //Storing current coordinates on mousedown position
            mClass.MapPosInitx = mClass.longitudeString;
            mClass.MapPosInity = mClass.latitudeString;

            mClass.divSelector4.style.left = mClass.divSelector3.style.left = mClass.divSelector1.style.left = mClass.divSelector2.style.left = mClass.initx + 'px';
            mClass.divSelector4.style.top = mClass.divSelector3.style.top = mClass.divSelector1.style.top = mClass.divSelector2.style.top = mClass.inity + 'px';

            mClass.flag2 = true;

            mClass.tiltMap( false )

        }, Cesium.ScreenSpaceEventType.LEFT_DOWN );



        /////////////////////MOOVE MOUSE//////////////////////////

        this.handler.setInputAction( function ( movement )
        {

            ///////////////////////////////////////////GET WGS POSITION///////////////////////////////////////

            var cartesian = mClass.viewer.camera.pickEllipsoid( movement.endPosition, mClass.scene.globe.ellipsoid );

            ////////////////////////WRITTING THE COORDENATES ON LABEL//////////////
            let mapiCesium: MapiCesium = new MapiCesium();

            if ( cartesian )
            {
                let cartographic = Cesium.Cartographic.fromCartesian( cartesian );
                let longitudeString = Cesium.Math.toDegrees( cartographic.longitude )//.toFixed(2);
                let latitudeString = Cesium.Math.toDegrees( cartographic.latitude )//.toFixed(2);
                mapiCesium.mMousePosition = mapiCesium.proj4FromWGS84_to_2039( longitudeString, latitudeString, 0 );
                document.getElementById( 'hud01' ).innerHTML = " X: " + mapiCesium.mMousePosition[ 0 ].toFixed( 0 ) + " Y: " + mapiCesium.mMousePosition[ 1 ].toFixed( 0 );//  +" Z: " + m_MapiToolBar.currentAltitudeMeter;

            }
            /////////////////////////////////////SETTING TH RECTANGLE////////////////////////
            if ( cartesian )
            {
                let cartographic = Cesium.Cartographic.fromCartesian( cartesian );
                mClass.longitudeString = Cesium.Math.toDegrees( cartographic.longitude )//.toFixed(2);
                mClass.latitudeString = Cesium.Math.toDegrees( cartographic.latitude )//.toFixed(2);
            }
            //////////////////////////////////RECTANGLE SELECTION/////////////////////////////////////
            if ( mClass.flag1 != true )
                return

            if ( mClass.flag2 != true )
                return;

            mClass.flag3 = true;

            //Code necesary to make a rectangle
            mClass.posx = movement.endPosition.x;
            mClass.posy = movement.endPosition.y;
            mClass.divSelector1.style.width = Math.abs( mClass.posx - mClass.initx ) + 2 + 'px';
            mClass.divSelector3.style.width = ( Math.abs( mClass.posx - mClass.initx ) + 2 ) + 'px';
            mClass.divSelector1.style.left = mClass.posx - mClass.initx < 0 ? mClass.posx + 'px' : mClass.initx + 'px';
            mClass.divSelector2.style.height = Math.abs( mClass.posy - mClass.inity ) + 2 + 'px';
            mClass.divSelector4.style.height = ( Math.abs( mClass.posy - mClass.inity ) + 2 ) + 'px';
            mClass.divSelector2.style.top = mClass.posy - mClass.inity < 0 ? mClass.posy + 'px' : mClass.inity + 'px';
            mClass.divSelector3.style.left = mClass.divSelector1.style.left;
            mClass.divSelector3.style.top = mClass.posy + 'px'
            mClass.divSelector4.style.top = mClass.divSelector2.style.top;
            mClass.divSelector4.style.left = mClass.posx + 'px';

        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE );



        /////////////////////////////////////////////////////////////////////////////////////////////////////
        //Just maked selection (Mouse UP)
        this.handler.setInputAction( function ( mousedown )
        {

            let mapicesium: MapiCesium = new MapiCesium();

            if ( mClass.flag3 != true )
                return;

            //un tilt the map
            mClass.tiltMap( true )
            //Reseting parameters
            mClass.flag1 = mClass.flag2 = mClass.flag3 = false;

            //Storing current coordinates on mouseup position
            mClass.MapPosx = mClass.longitudeString;
            mClass.MapPosy = mClass.latitudeString;

            //Reseting parameters
            mClass.posx = mClass.posy = mClass.initx = mClass.inity = 0;

            mClass.divSelector1.style.display = mClass.divSelector2.style.display = mClass.divSelector3.style.display = mClass.divSelector4.style.display = "none";
            mClass.divSelector1.style.width = mClass.divSelector3.style.width = mClass.divSelector2.style.height = mClass.divSelector4.style.height = "0px";

            let x1 = mClass.MapPosInitx;
            let x2 = mClass.MapPosx;
            let y1 = mClass.MapPosInity;
            let y2 = mClass.MapPosy;

            //Comparing to set the rectangle corners as geographic boxes
            mClass.west = ( ( x1 < x2 ) ? x1 : x2 );
            mClass.east = ( ( x1 > x2 ) ? x1 : x2 );
            mClass.sout = ( ( y1 < y2 ) ? y1 : y2 );
            mClass.north = ( ( y1 > y2 ) ? y1 : y2 );

            //mLabel1.innerHTML = "Selected Box= [" + SelectedRectangle.west + "," + SelectedRectangle.sout + "] [" + SelectedRectangle.east + "," + SelectedRectangle.north + "]";
            //console.log( SelectedRectangle.west + "," + SelectedRectangle.sout + "," + SelectedRectangle.east + "," + SelectedRectangle.north );
            //case fly to camera
            if ( mClass.flag5 == true && mClass.selectAction == 4 )
            {
                mClass.viewer.camera.flyTo( {
                    destination: Cesium.Rectangle.fromDegrees( mClass.west, mClass.sout, mClass.east, mClass.north )
                } )
                mClass.flag5 = false;
            }

            //Case select segments
            if ( mClass.flag5 == true && mClass.selectAction == 1 )
            {
                mClass.selectedPointListEntitties = [];

                mClass.mEntities = [];
                let mRectangle: number[] = [];

                let rect1 = mapicesium.proj4FromWGS84_to_2039( mClass.west, mClass.sout, 0 );
                let rect2 = mapicesium.proj4FromWGS84_to_2039( mClass.east, mClass.north, 0 );

                mRectangle.push( rect1[ 0 ] );
                mRectangle.push( rect1[ 1 ] );
                mRectangle.push( rect2[ 0 ] );
                mRectangle.push( rect2[ 1 ] );

                //Fixing segemts data details table
                //MapiCesium.AfterTableSegments();
                //WHEN THE ENTITTIES WAS ADDED THE POINTS WAS AT THE FIRST

                //Selecting objkectrs: first getting the points
                for ( let q = 0; q < mClass.viewer.entities._entities._array.length; q++ )
                {
                    if ( mClass.viewer.entities._entities._array[ q ]._mType === mapicesium.mTypePoint )
                    {
                        let mPoint: number[] = [];

                        mPoint.push( mClass.viewer.entities._entities._array[ q ]._mObject.x );
                        mPoint.push( mClass.viewer.entities._entities._array[ q ]._mObject.y );

                        if ( mClass.SelectedRectangle2DIntersec( mRectangle, mPoint ) )
                        {
                            mClass.selectedPointListEntitties.push( mClass.viewer.entities._entities._array[ q ]._mObject.nam );
                            mClass.viewer.entities._entities._array[ q ].point.color = Cesium.Color.AQUA;
                        }
                    }

                }

                //Second getting the segments by the points
                for ( let q = 0; q < mClass.viewer.entities._entities._array.length; q++ )
                {
                    if ( mClass.viewer.entities._entities._array[ q ]._mType === mapicesium.mTypeLine )
                    {
                        let mPointA = mClass.viewer.entities._entities._array[ q ]._mPointA;
                        let mPointB = mClass.viewer.entities._entities._array[ q ]._mPointB;

                        //Thre's not selecteds by map. There's selected after point selection.
                        if ( mClass.selectedPointListEntitties.findIndex( x => x == mPointA ) != -1 ||
                            mClass.selectedPointListEntitties.findIndex( x => x == mPointB ) != -1 )
                            mClass.viewer.entities._entities._array[ q ].polyline.material = Cesium.Color.AQUA;


                    }
                }
                mClass.flag6 = false;
            }


        }, Cesium.ScreenSpaceEventType.LEFT_UP );

        //////////////////////////////////////////////////////////////////////////////////

        //this.handler.removeInputAction( Cesium.ScreenSpaceEventType.LEFT_CLICK );
        //Setting actions an click left ADD A OBJETC
        this.handler.setInputAction( function ( click )
        {
            //drill pick picked all the entitites that mouse can to click in a lonely one click.
            let mapiCesium: MapiCesium = new MapiCesium();
            var pickedObject = mClass.scene.drillPick( click.position );

            for ( let q = 0; q < pickedObject.length; q++ )
            {
                //Picked a line
                if ( pickedObject[ q ].id._mType === mapiCesium.mTypeLine )
                {
                    //Add a new segemnt to list
                    mClass.AddToSelectedSegments(

                        pickedObject[ q ].id._mPointA,
                        pickedObject[ q ].id._mPointB
                    )
                }

                if ( pickedObject[ q ].id._mType === mapiCesium.mTypePoint )
                {
                    //Add a new segemnt to list
                    mClass.AddToSelectedPoints(
                        pickedObject[ q ].id._text
                    )
                }
            }




        }, Cesium.ScreenSpaceEventType.LEFT_CLICK );

        //Setting actions an click tight QUIT A OBJETC
        this.handler.setInputAction( function ( click )
        {
            //drill pick picked all the entitites that mouse can to click in a lonely one click.

            let mapiCesium: MapiCesium = new MapiCesium();
            var pickedObject = mClass.scene.drillPick( click.position );

            for ( let q = 0; q < pickedObject.length; q++ )
            {
                //Picked a line
                if ( pickedObject[ q ].id._mType === mapiCesium.mTypeLine )
                {
                    //Add a new segemnt to list
                    mClass.DeselectSegment(

                        pickedObject[ q ].id._mPointA,
                        pickedObject[ q ].id._mPointB
                    )
                }

                //Picked a Point
                if ( pickedObject[ q ].id._mType === mapiCesium.mTypePoint )
                {

                    //Add a new segemnt to list
                    mClass.DeselectPoint(
                        pickedObject[ q ].id._text
                    )
                }
            }




        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK );


    }


    DeselectAll ()
    {

        let mapicesium: MapiCesium = new MapiCesium();
        for ( let q = 0; q < this.viewer.entities._entities._array.length; q++ )
        {
            if ( this.viewer.entities._entities._array[ q ]._mType === mapicesium.mTypePoint )
            {
                this.viewer.entities._entities._array[ q ].point.color = Cesium.Color.WHITE;
            }
            if ( this.viewer.entities._entities._array[ q ]._mType === mapicesium.mTypeLine )
            {
                this.viewer.entities._entities._array[ q ].polyline.material = Cesium.Color.WHITE.withAlpha( 0.6 );
            }
        }

    }


    //////////////////////////////////////////////////Selected Arraylist Segements/////////////////////////////////////////////////////////////

    AddToSelectedSegments ( PA: string, PB: string ): boolean
    {

        let man: ManageObjectcs = new ManageObjectcs( this.viewer );
        let mapiCesium: MapiCesium = new MapiCesium();

        let mEntitye = man.GetEntitieByName( PA, PB, mapiCesium.mTypeLine, this.viewer );
        if ( mEntitye != null )
        {
            mEntitye.polyline.material = Cesium.Color.AQUA;
            return true;
        }
        return false;

    }

    AddToSelectedPoints ( text: string ): boolean
    {

        let man: ManageObjectcs = new ManageObjectcs( this.viewer );
        let mapiCesium: MapiCesium = new MapiCesium();

        let mEntitye = man.GetEntitieByName( text, null, mapiCesium.mTypePoint, this.viewer );
        if ( mEntitye != null )
        {
            mEntitye.point.color = Cesium.Color.AQUA;
            return true;
        }
        return false;

    }


    backTheLabelsToFront ()
    {

        let mapicesium: MapiCesium = new MapiCesium();
        let mLenth = this.viewer.entities._entities._array.length;
        for ( let a = 0; a < mLenth; a++ )
        {
            if ( this.viewer.entities._entities._array[ a ]._mType === mapicesium.mTypeLabel )
            {

                this.viewer.entities._entities._array[ a ].color = Cesium.Color.BLUE;
            }
        }

    }


    //Readin cesium datas
    GetDatasFromViewer (): mSelectedAndAll
    {
        let mResult: mSelectedAndAll = new mSelectedAndAll();


        let mapicesium: MapiCesium = new MapiCesium();
        let mLenth = this.viewer.entities._entities._array.length;

        for ( let a = 0; a < mLenth; a++ )
        {
            /////////////////////////////////////////////////////Check for lines////////////////////////////////////////////////////
            if ( this.viewer.entities._entities._array[ a ]._mType === mapicesium.mTypeLine )
            {
                if ( this.viewer.entities._entities._array[ a ].polyline == undefined )
                    continue;
                if (

                    //Color: aqua alpha 1


                    this.viewer.entities._entities._array[ a ].polyline.material.color._value.red === 0 &&
                    this.viewer.entities._entities._array[ a ].polyline.material.color._value.green === 1 &&
                    this.viewer.entities._entities._array[ a ].polyline.material.color._value.blue === 1 &&
                    this.viewer.entities._entities._array[ a ].polyline.material.color._value.alpha === 1

                )
                {
                    mResult.mRezSelected.push( this.viewer.entities._entities._array[ a ]._mObject );
                }
            }
            if ( this.viewer.entities._entities._array[ a ]._mType === mapicesium.mTypePoint )
            {

                if ( this.viewer.entities._entities._array[ a ].point == undefined )
                    continue;

                if (
                    //Color: aqua alpha 1
                    this.viewer.entities._entities._array[ a ].point.color._value.red === 0 &&
                    this.viewer.entities._entities._array[ a ].point.color._value.green === 1 &&
                    this.viewer.entities._entities._array[ a ].point.color._value.blue === 1 &&
                    this.viewer.entities._entities._array[ a ].point.color._value.alpha === 1
                )
                {
                    mResult.mCsvSelected.push( this.viewer.entities._entities._array[ a ]._mObject );
                }
            }
        }

        return mResult;
    }




    DeselectSegment ( PA: string, PB: string ): boolean
    {

        let man: ManageObjectcs = new ManageObjectcs( this.viewer );
        let mapiCesium: MapiCesium = new MapiCesium();

        let mEntitye = man.GetEntitieByName( PA, PB, mapiCesium.mTypeLine, this.viewer );
        if ( mEntitye != null )
        {
            mEntitye.polyline.material = Cesium.Color.WHITE.withAlpha( 0.6 );
            return true;
        }
        return false;
    }

    DeselectPoint ( mtext: string ): boolean
    {
        let man: ManageObjectcs = new ManageObjectcs( this.viewer );
        let mapiCesium: MapiCesium = new MapiCesium();

        let mEntitye = man.GetEntitieByName( mtext, null, mapiCesium.mTypePoint, this.viewer );
        if ( mEntitye != null )
        {
            mEntitye.point.color = Cesium.Color.WHITE;
            return true;
        }
        return false;

    }







    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////










    tiltMap = function ( mBool: boolean )
    {

        this.scene.screenSpaceCameraController.enableZoom = mBool;
        this.scene.screenSpaceCameraController.enableRotate = mBool;
        this.scene.screenSpaceCameraController.enableTranslate = mBool;
        this.scene.screenSpaceCameraController.enableTilt = mBool;
        this.scene.screenSpaceCameraController.enableLook = mBool;

    }

    ///mSelect_WSEN : ArraList. Index 0: West; Index 1: South; Index 2: East; Index 3: North.
    //mPoint: x,y
    SelectedRectangle2DIntersec = function ( mSelect_WSEN: number[], mPoint: number[] ): boolean
    {
        if (
            ( mSelect_WSEN[ 3 ] > mPoint[ 1 ] && mSelect_WSEN[ 1 ] < mPoint[ 1 ] ) &&
            ( mSelect_WSEN[ 2 ] > mPoint[ 0 ] && mSelect_WSEN[ 0 ] < mPoint[ 0 ] )
        )
            return true
        else
        {
            return false;
        }
    }




}