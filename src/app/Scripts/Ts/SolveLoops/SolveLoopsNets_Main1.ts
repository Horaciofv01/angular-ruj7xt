import * as math from 'mathjs';
import { RezFile } from '../Stored/Commons'
import { typeCsv, typeRez } from '../../../Balances/Library/m-cesium/Script/MapiCesium'
import { mSegment } from '../../../Scripts/Ts/WikiView/step1';
import { TablePointHeights } from '../../../Scripts/Ts/Stored/HeightCalculation_Main1'
import { mVertices } from '../Stored/Commons'
import { HeightCalculation } from '../Stored/HeightCalculation_Main1';

export class SolveLoopsNets_Main1
{
    solveLoosFirstData: SolveLoosFirstData = new SolveLoosFirstData();

    private getVertices ( rezFile: RezFile[] ): mVertices[]
    {
        let heightCalculation: HeightCalculation = new HeightCalculation();
        return heightCalculation.getVertices( rezFile );
    }

    private getSegments ( rezFile: RezFile[] ): RezFile[]
    {
        let msegments: RezFile[] = [];
        for ( let i = 0; i < rezFile.length; i++ )
        {
            //if ( mvertices.indexOf( x => x === rezFile[ i ].Point_A || x === rezFile[ i ].Point_B ) != -1 )
            if ( msegments.findIndex( x => ( x.Point_A === rezFile[ i ].Point_A && x.Point_B === rezFile[ i ].Point_B ) || ( x.Point_B === rezFile[ i ].Point_A && x.Point_A === rezFile[ i ].Point_B ) ) === -1 )
                msegments.push( rezFile[ i ] );
        }

        return msegments;
    }


    private getKnowedPoints ( mCsvAll: typeCsv[], mvertices: mVertices[] )
    {

        let heightCalculation: HeightCalculation = new HeightCalculation();
        return heightCalculation.getKnowedPoints( mCsvAll, mvertices );

    }


    public doRezFile ( mRezAll: typeRez[], msegment: mSegment[] ): RezFile[]
    {
        let rezfile: RezFile[] = [];
        let mOrder: number = 0;

        for ( let j = 0; j < msegment.length; j++ )
        {

            if ( rezfile.findIndex( x =>
                ( x.Point_A === msegment[ j ].PointA && x.Point_B === msegment[ j ].PointB ) ||
                ( x.Point_B === msegment[ j ].PointA && x.Point_A === msegment[ j ].PointB )
            ) != -1 ) continue;

            let mres: typeRez = this.GetREZByPointAB( mRezAll, msegment[ j ] );


            if ( mres == null || msegment[ j ] == null )
                continue;

            mOrder += 1;

            rezfile.push( new RezFile(
                mOrder,
                msegment[ j ].PointA,
                msegment[ j ].PointB,
                msegment[ j ].HeighDifference,
                msegment[ j ].Distance,
                mres.acr,
                mres.bf,
                mres.dat,
                mres.fil ) );


        }

        return rezfile;
    }
    private GetREZByPointAB ( mRezAll: typeRez[], msegment: mSegment ): typeRez
    {
        let res: typeRez[] = [];
        res = mRezAll.filter( x => x.pa === msegment.PointA && x.pb === msegment.PointB );
        if ( res.length > 0 )
            return res[ 0 ];

        res = mRezAll.filter( x => x.pb === msegment.PointA && x.pa === msegment.PointB );
        if ( res.length > 0 )
        {
            res[ 0 ].hei *= -1;
            return res[ 0 ];
        }
        return null;
    }
    Main_1 ( mCsvAll: typeCsv[], mAllRes: typeRez[], msegment: mSegment[], mvertices: mVertices[] ): SolveLoosFirstData
    {
        let rezFile: RezFile[] = this.doRezFile( mAllRes, msegment );
        let mDistinctedvertices: mVertices[] = this.getVertices( rezFile );
        let mDistinctedSegemnts: RezFile[] = this.getSegments( rezFile );
        let knowedPoints: typeCsv[] = this.getKnowedPoints( mCsvAll, mDistinctedvertices );

        this.solveLoosFirstData.knowedPoints = knowedPoints;
        this.solveLoosFirstData.n_vertices = mDistinctedvertices.length;
        //this.solveLoosFirstData.mKnowedPointsLoopsNet = this.CreateKnowedPointsNet( mDistinctedvertices, mCsvAll );
        this.solveLoosFirstData.n_edges = mDistinctedSegemnts.length;
        this.solveLoosFirstData.n_loops = 1 + this.solveLoosFirstData.n_edges - this.solveLoosFirstData.n_vertices;

        this.solveLoosFirstData.n_conditions = this.solveLoosFirstData.n_loops + ( ( knowedPoints.length - 1 <= 0 ) ? 0 : ( knowedPoints.length - 1 ) );
        this.solveLoosFirstData.n_BM = knowedPoints.length;
        this.solveLoosFirstData.rezFile = rezFile;
        this.solveLoosFirstData.f_r = this.solveLoosFirstData.n_loops + knowedPoints.length - 1;
        this.solveLoosFirstData.tableHeight = this.CreateTableHeights( mDistinctedvertices, this.solveLoosFirstData.knowedPoints );

        return this.solveLoosFirstData;
    }




    private CreateTableHeights ( mDistinctedvertices: mVertices[], knowedPoints: typeCsv[] ): TablePointHeights[]
    {
        let res: TablePointHeights[] = [];

        for ( let i = 0; i < knowedPoints.length; i++ )
        {
            if ( res.findIndex( x => x.Point === knowedPoints[ i ].nam ) == -1 )
                res.push( new TablePointHeights( knowedPoints[ i ].nam, knowedPoints[ i ].heiort ) );

        }
        for ( let i = 0; i < mDistinctedvertices.length; i++ )
        {
            if ( res.findIndex( x => x.Point === mDistinctedvertices[ i ].name ) == -1 )
                res.push( new TablePointHeights( mDistinctedvertices[ i ].name, null ) );

        }
        return res;

    }


    GetSegmentArrayByIndex ( loopsNetSegmentArray: mSegment[][] ): mSegment[]
    {
        let msegments: mSegment[] = [];

        for ( let i = 0; i < loopsNetSegmentArray.length; i++ )
        {
            for ( let j = 0; j < loopsNetSegmentArray[ i ].length; j++ )
            {
                for ( let k = 0; k < loopsNetSegmentArray[ i ][ j ].lstSegment.length; k++ )
                {
                    msegments.push( loopsNetSegmentArray[ i ][ j ].lstSegment[ k ] );
                }
            }

        }
        return msegments;
    }









}


class mNetLoopsKnowedPoints
{
    name: string;
    ortoHeight: number;
    constructor ( name: string, ortoHeight: number )
    {
        this.name = name;
        this.ortoHeight = ortoHeight;
    }
}

export class SolveLoosFirstData
{
    n_vertices: number;
    n_edges: number;
    n_loops: number;
    n_BM: number;
    n_conditions: number;
    sigma_apriori: 1;
    sigma_aposteriori: number;
    rezFile: RezFile[];
    knowedPoints: typeCsv[];
    f_r: number;
    tableHeight: TablePointHeights[];
    mKnowedPointsLoopsNet: typeCsv[] = [];
    //////


    constructor ()
    {

    }
}

