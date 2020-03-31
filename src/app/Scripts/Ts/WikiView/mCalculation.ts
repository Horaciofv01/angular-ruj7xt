
import * as geolib from 'geolib';
import { GeolibInputCoordinates } from 'geolib/es/types';
import { mSegment } from '../WikiView/step1';
import { typeCsv } from '../../../Balances/Library/m-cesium/Script/MapiCesium'
import { MapiCesium } from '../../../Balances/Library/m-cesium/Script/MapiCesium'

export class WikiViewCalculation
{

    mAllCSv: typeCsv[];

    constructor ( mAllCSv: typeCsv[] )
    {
        this.mAllCSv = mAllCSv;
    }

    getJsonForPoint ( mPoint: number[] ): GeolibInputCoordinates
    {
        return { "latitude": mPoint[ 0 ], "longitude": mPoint[ 1 ] };
    }

    getJsonForPolygon ( mPoint: number[] ): GeolibInputCoordinates[]
    {
        let mRes: GeolibInputCoordinates[] = [];
        for ( let i = 0; i < mPoint.length; i += 2 )
        {
            mRes.push( { "latitude": mPoint[ i ], "longitude": mPoint[ i + 1 ] } );
        }
        return mRes;
    }
    getArrayForPolygon ( mPoint: number[] ): GeolibInputCoordinates[]
    {

        let mapicesium: MapiCesium = new MapiCesium();

        let mRes: GeolibInputCoordinates[] = [];
        for ( let i = 0; i < mPoint.length; i += 2 )
        {
            let mpointWGS: number[] = mapicesium.proj4From2039_to_WGS84( mPoint[ i ], mPoint[ i + 1 ], 0 );
            mRes.push( [ mpointWGS[ 0 ], mpointWGS[ 1 ] ] );
        }
        return mRes;
    }



    getBelonging ( mPoint: number[], mPolygon: number[] )
    {
        return geolib.isPointInPolygon( this.getJsonForPoint( mPoint ), this.getJsonForPolygon( mPolygon ) );
    }



    getOverlaps ( mPolygon1: mSegment[], mPolygon2: mSegment[] )
    {
        let poly2Coord: number[] = this.getPolygonCoordinates( mPolygon2 );
        for ( let i = 0; i < mPolygon1.length; i++ )
        {
            if ( this.getBelonging( this.GetCoordinates( mPolygon1[ i ].PointA ), poly2Coord ) )
            {
                return true;
            }
        }
        return false;
    }

    getPolygonCoordinates ( mPolygon: mSegment[] ): number[]
    {
        let mRes: number[] = [];
        for ( let i = 0; i < mPolygon.length; i++ )
        {
            for ( let j = 0; j < mPolygon[ i ].lstSegment.length; j++ )
            {
                let mTempo: number[] = this.GetCoordinates( mPolygon[ i ].lstSegment[ j ].PointA );
                if ( mTempo === null )
                    continue;

                mRes.push( mTempo[ 0 ] );
                mRes.push( mTempo[ 1 ] );
            }
        }
        return mRes;
    }
    GetCoordinates ( PointA: string ): number[]
    {
        let mRes: number[] = [];
        let mRow: typeCsv = this.mAllCSv.find( x => x.nam === PointA );
        if ( mRow === undefined )
            return null;
        if ( mRow.x == null || mRow.y == null )
            return null;
        mRes.push( mRow.x );
        mRes.push( mRow.y );
        return mRes;
    }
    GetPolygonArea ( mPolygon: mSegment[] ): number
    {
        return Math.floor( geolib.getAreaOfPolygon( this.getArrayForPolygon( this.getPolygonCoordinates( mPolygon ) ) ) / 100 )
    }
}

export class LoopsNet
{
    mLoop: mSegment[];
    mArea: number;
}