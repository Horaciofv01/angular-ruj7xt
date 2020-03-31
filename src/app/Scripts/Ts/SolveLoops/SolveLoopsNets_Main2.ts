import { mSegment, mLinesLoops_01 } from '../WikiView/step1';
import { SolveLoosFirstData } from './SolveLoopsNets_Main1';
import { typeCsv } from '../../../Balances/Library/m-cesium/Script/MapiCesium';



export class SolveLoopsNets_Main2
{
    Main_2 ( firstResults: SolveLoosFirstData, mAllLoopsAndLines: mSegment[][] ): mSegment[][]
    {
        let mAditionalLines: get2KnowedPoints[] = this.GetPointPartner( firstResults );
        return this.GetSegmentFromStores( mAllLoopsAndLines, mAditionalLines );
    }

    //Getting array of lines with the points but not SIDE TO SIDE.
    GetSegmentFromStores ( mAllLoopsAndLines: mSegment[][], mAditionalLines: get2KnowedPoints[] ): mSegment[][]
    {
        //Segment withoput to cut the not usefully segements.
        let mAditinalSegments: mSegment[][] = [];

        //Runing the 2 points as partners
        for ( let i = 0; i < mAditionalLines.length; i++ )
        {
            //Founded the first line.
            //Serach on lines
            let mLine: mSegment[] = this.GetTheLineWith2Points( mAditionalLines[ i ].PointA, mAditionalLines[ i ].PointB, mAllLoopsAndLines )
            if ( mLine != null )
            {

                mAditinalSegments.push( this.CutLineByKnowedPoints( mAditionalLines[ i ].PointA, mAditionalLines[ i ].PointB, mLine, true ) );
                //if found... GO
                continue;
            }
        }

        return mAditinalSegments;
    }
    private GetTheLineWith2Points ( PointA: string, PointB: string, mAllLoopsLines: mSegment[][] ): any
    {
        for ( let i = 0; i < mAllLoopsLines.length; i++ )
        {
            let mCounter: number = 0;
            let mCorner: string;
            //Search for corner
            let mIndex1: number = mAllLoopsLines[ i ].findIndex( x => x.PointA === PointA );
            if ( mIndex1 !== -1 && ( mIndex1 === 0 || mIndex1 === mAllLoopsLines[ i ].length - 1 ) )
            {

                if ( mCorner !== PointA )
                {
                    mCorner = PointA;
                    mCounter++;
                }

            }

            mIndex1 = mAllLoopsLines[ i ].findIndex( x => x.PointB === PointA );
            if ( mIndex1 !== -1 && ( mIndex1 === 0 || mIndex1 === ( mAllLoopsLines[ i ].length - 1 ) ) )
            {
                if ( mCorner !== PointA )
                {
                    mCorner = PointA;
                    mCounter++;
                }
            }

            mIndex1 = mAllLoopsLines[ i ].findIndex( x => x.PointA === PointB );
            if ( mIndex1 !== -1 && ( mIndex1 === 0 || mIndex1 === ( mAllLoopsLines[ i ].length - 1 ) ) )
            {
                if ( mCorner !== PointB )
                {
                    mCorner = PointB;
                    mCounter++;
                }
            }

            mIndex1 = mAllLoopsLines[ i ].findIndex( x => x.PointB === PointB );
            if ( mIndex1 !== -1 && ( mIndex1 === 0 || mIndex1 === ( mAllLoopsLines[ i ].length - 1 ) ) )
            {
                if ( mCorner !== PointB )
                {
                    mCorner = PointB;
                    mCounter++;
                }
            }


            if ( mCounter == 2 )
            {
                return mAllLoopsLines[ i ];
            }


            if ( mCorner != PointA && mAllLoopsLines[ i ].findIndex(
                ( x => x.PointA === PointA ) || ( x => x.PointB === PointA ) ) != -1 )
            {
                mCounter++
                if ( mCounter == 2 )
                {
                    return mAllLoopsLines[ i ];
                }
            }
            if ( mCorner != PointB && mAllLoopsLines[ i ].findIndex(
                ( x => x.PointA === PointB ) || ( x => x.PointB === PointB ) ) != -1 )
            {
                mCounter++
                if ( mCounter == 2 )
                {
                    return mAllLoopsLines[ i ];
                }
            }
        }
        return null;
    }
    private CutLineByKnowedPoints ( PointA: string, PointB: string, msegment: mSegment[], bGoBack: boolean ): mSegment[]
    {
        let mlinesLoops_01: mLinesLoops_01 = new mLinesLoops_01();
        let msegment0: mSegment[] = mlinesLoops_01.ReplyLine( msegment );
        let mNewsegment: mSegment[] = [];
        let mFlagA = false
        let mFlagB = false
        for ( let i = 0; i < msegment0.length; i++ )
        {

            msegment0[ i ].lstSegment = [];
            msegment0[ i ].lstSegment.push( mlinesLoops_01.ReplySegment( msegment0[ i ] ) );


            if ( msegment0[ i ].PointA === PointA ) mFlagA = true;

            if ( mFlagA ) mNewsegment.push( msegment0[ i ] );


            if ( msegment0[ i ].PointB === PointB ) mFlagB = true;                //mNewsegment.push( msegment[ i ] );


            if ( mFlagB && mFlagA )
            {
                if ( mNewsegment != undefined )
                    return mNewsegment;
            }
        }



        let msegment1: mSegment[] = mlinesLoops_01.ReverseLine( msegment );
        mNewsegment = [];
        mFlagA = false
        mFlagB = false
        for ( let i = 0; i < msegment1.length; i++ )
        {

            if ( msegment1[ i ].PointA === PointA ) mFlagA = true;


            msegment1[ i ].lstSegment = [];
            msegment1[ i ].lstSegment.push( mlinesLoops_01.ReplySegment( msegment1[ i ] ) );

            if ( mFlagA ) mNewsegment.push( msegment1[ i ] );


            if ( msegment1[ i ].PointB === PointB ) mFlagB = true;                //mNewsegment.push( msegment[ i ] );


            if ( mFlagB && mFlagA )
            {
                if ( mNewsegment != undefined )
                    return mNewsegment;
            }
        }

        return null;

    }










    private GetPointPartner ( firstResults: SolveLoosFirstData ): get2KnowedPoints[]
    {
        let mAditionalLines: get2KnowedPoints[] = [];
        let mValidPoints: typeCsv[] = firstResults.knowedPoints.filter( x => x.bValid === true );
        for ( let i = 0; i < mValidPoints.length - 1; i += 1 )
        {
            mAditionalLines.push( new get2KnowedPoints( mValidPoints[ i ].nam, mValidPoints[ i + 1 ].nam ) );
        }
        return mAditionalLines;
    }


}

class get2KnowedPoints
{
    PointA: string;
    PointB: string;
    constructor ( PointA: string, PointB: string )
    {
        this.PointA = PointA;
        this.PointB = PointB;
    }
}