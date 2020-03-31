
import { MapiCesium, typePoint, typeSegment, typeCsv, typeRez, mService } from './MapiCesium';


export class ManageObjectcs
{
    viewer: any;

    mapiCesium: MapiCesium = new MapiCesium();

    constructor ( viewer: any )
    {
        this.viewer = viewer;
    }

    CreateSegment = function ( mArrLine: number[], mID: string, mPointA: string, mPointB: string, withGova0: boolean, mRezObject: typeRez )
    {

        //not repeateds
        if ( this.GetEntitieByName( mPointA, mPointB, this.mapiCesium.mTypeLine, this.viewer ) != null )
            return;


        let mapicesium: MapiCesium = new MapiCesium();
        let m2039_pointA: number[] = mapicesium.proj4From2039_to_WGS84( mArrLine[ 0 ], mArrLine[ 1 ], mArrLine[ 2 ] )
        let m2039_pointB: number[] = mapicesium.proj4From2039_to_WGS84( mArrLine[ 3 ], mArrLine[ 4 ], mArrLine[ 5 ] )

        m2039_pointA[ 2 ] = mArrLine[ 2 ];
        m2039_pointB[ 2 ] = mArrLine[ 5 ];
        //Not undefined coordinates
        if ( m2039_pointA[ 0 ] == undefined || m2039_pointA[ 1 ] == undefined || m2039_pointA[ 2 ] == undefined ||
            m2039_pointB[ 0 ] == undefined || m2039_pointB[ 1 ] == undefined || m2039_pointB[ 2 ] == undefined )
            return;

        mArrLine = [];
        mArrLine.push( m2039_pointA[ 0 ] );
        mArrLine.push( m2039_pointA[ 1 ] );
        mArrLine.push( m2039_pointA[ 2 ] );
        mArrLine.push( m2039_pointB[ 0 ] );
        mArrLine.push( m2039_pointB[ 1 ] );
        mArrLine.push( m2039_pointB[ 2 ] );

        this.viewer.entities.add( {
            mType: mapicesium.mTypeLine,
            mPointA: mPointA,
            mPointB: mPointB,
            mObject: mRezObject,
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights( mArrLine ),
                width: 6,
                material: Cesium.Color.WHITE.withAlpha( 0.6 )
            }
        } );

        //alert( this.viewer.entities._entities._array.length );

    }

    CreateLabel = function ( mCaption: string, mX: number, mY: number, mZ: number, intIcon: number, withGova0: boolean, mCsvObject: typeCsv )
    {
        this.mMessageNull = this.mTempo;

        let mapicesium: MapiCesium = new MapiCesium();
        //No repeated
        if ( this.GetEntitieByName( mCaption, null, mapicesium.mTypeLabel, this.viewer ) != null )
            return;

        if ( withGova0 || mZ == undefined )
            mZ = 0;

        let m2039: number[] = mapicesium.proj4From2039_to_WGS84( mX, mY, mZ )

        mX = m2039[ 0 ];
        mY = m2039[ 1 ];


        //2 times purpose
        if ( withGova0 || mZ == undefined )
            mZ = 0;

        //No undefined coordinates
        if ( mX == undefined || mY == undefined || mZ == undefined )
            return;

        let labelColor: any;
        let labelHalo: any;

        if ( mCsvObject.heiort != undefined && mCsvObject.heiort != null )
            labelColor = Cesium.Color.CHARTREUSE;
        else
            labelColor = Cesium.Color.CORAL;




        this.viewer.entities.add( {
            position: Cesium.Cartesian3.fromDegrees( mX, mY, mZ + 1 ),
            mType: mapicesium.mTypeLabel,
            label: {
                text: mCaption,
                font: '18px Arial',
                fillColor: Cesium.Color.LIGHTSLATEGREY,
                backgroundColor: Cesium.Color.WHITE.withAlpha( 0.5 ),
                //Setting at the side of the point
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                horizontalOrigin: Cesium.HorizontalOrigin.RIGHT,
                pixelOffset: new Cesium.Cartesian2( 10, -15 )
            }
        } );

        //Adding Halo
        this.viewer.entities.add( {
            mType: mapicesium.mTypeHalo,
            text: mCaption,
            mObject: mCsvObject,
            position: Cesium.Cartesian3.fromDegrees( mX, mY, mZ ),
            point: {
                color: labelColor,
                pixelSize: 24
            }
        } );

        //Coordinates getted from DB
        if ( intIcon == 1 )
        {
            this.viewer.entities.add( {
                mType: mapicesium.mTypePoint,
                text: mCaption,
                mObject: mCsvObject,
                position: Cesium.Cartesian3.fromDegrees( mX, mY, mZ ),
                point: {
                    color: Cesium.Color.WHITE,
                    pixelSize: 15
                }
            } );
        }





        //Case of not DB getted coordinates point
        if ( intIcon == 0 )
        {
            this.viewer.entities.add( {
                mType: mapicesium.mTypePoint,
                text: mCaption,
                mObject: mCsvObject,
                position: Cesium.Cartesian3.fromDegrees( mX, mY, mZ ),
                billboard: { image: '../Pictures/CesiumPoint.png' }
            } );
        }

    }



    GetEntitieByName = function ( mPointA: string, mPointB: string, mType: string, viewer: any ): any
    {
        let mapicesium: MapiCesium = new MapiCesium();
        let mLenth = this.viewer.entities._entities._array.length;
        for ( let a = 0; a < mLenth; a++ )
        {

            //mType: our sign
            if ( viewer.entities._entities._array[ a ]._mType == undefined )
                continue;

            ///////////////////////Check for lines////////////////////////////////////////////////////

            if ( viewer.entities._entities._array[ a ]._mType === mType )
            {
                if (
                    ( ( viewer.entities._entities._array[ a ]._mPointA === mPointA ) && ( viewer.entities._entities._array[ a ]._mPointB === mPointB ) ) ||
                    ( ( viewer.entities._entities._array[ a ]._mPointB === mPointA ) && ( viewer.entities._entities._array[ a ]._mPointA === mPointB ) )
                ) return viewer.entities._entities._array[ a ];
            }

            ///////////////////////////////Check for Label///////////////////////////////////////////////////

            if ( viewer.entities._entities._array[ a ]._mType === mType )
            {
                if ( viewer.entities._entities._array[ a ]._text === mPointA )
                    return viewer.entities._entities._array[ a ];
            }

            ///////////////////////////////Check for Point///////////////////////////////////////////////////

            if ( viewer.entities._entities._array[ a ]._mType === mType )
            {
                if ( viewer.entities._entities._array[ a ]._text === mPointA )
                    return viewer.entities._entities._array[ a ];
            }
        }
        return null;
    }



}