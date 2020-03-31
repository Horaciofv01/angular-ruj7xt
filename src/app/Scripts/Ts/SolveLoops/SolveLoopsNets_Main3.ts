import * as math from 'mathjs';
import { RezFile } from '../Stored/Commons'
import { typeCsv, typeRez } from '../../../Balances/Library/m-cesium/Script/MapiCesium'
import { mSegment } from '../../../Scripts/Ts/WikiView/step1';
import { TableDeltaHeights, HeightCalculation, TablePointHeights } from '../../../Scripts/Ts/Stored/HeightCalculation_Main1'
import { SegmentsToTihum } from '../Stored/TihumInteractive';
import { SolveLoopsNets_Main1 } from './SolveLoopsNets_Main1';
import $ from 'jquery';




export class SolveLoopsNets_Main3
{
    matrixB: number[][] = [];
    matrixL_b: number[][] = [];
    matrixW: number[][];
    matrixSigma: number[][];
    matrixP: number[][];
    matrixM: number[][];
    matrixV: number[][];
    matrixL_a: number[][] = [];
    matrixBNotKNowedPoints: number[][] = [];
    matrixResults: number[][] = [];
    matrixViewResults: number[][] = [];
    sigmaPosteriori: number;
    calculatedDelta: TableDeltaHeights[] = [];
    calculatedHeight: TablePointHeights[] = [];
    RezFile: RezFile[];

    Main_3 ( AllRezFile: typeRez[], segmentToTihum: SegmentsToTihum[], mAllCsv: typeCsv[], pFactor: number,
        f_r: number, mTableHeight: TablePointHeights[], selectorMatrixSigma: string )
    {

        try
        {
            this.RezFile = this.GetRez( AllRezFile, this.FilterSegementsByType( segmentToTihum, [ 1, 2, 3, 4 ] ) )
            let allPartnerObjects: mSegment[][] = this.FilterSegementsByType( segmentToTihum, [ 1 ] );
            let additionalSegmants: mSegment[][] = this.FilterSegementsByType( segmentToTihum, [ 3, 4 ] );

            //allPartnerObjects: mSegment[][], additionalSegmants: mSegment[][],
            //Create matriz B
            this.matrixB = this.CreateMatrizB( this.RezFile, allPartnerObjects, additionalSegmants );
            //Create Matrix L
            this.matrixL_b = this.CreateMatrixL( this.RezFile );
            //Create Matrix W
            let tempoW: any = math.multiply( math.matrix( this.matrixB ), math.matrix( this.matrixL_b ) )
            this.matrixW = tempoW._data;
            this.FixMatrixW( allPartnerObjects.length, additionalSegmants, mAllCsv );

            //Create Matriz Sigma
            this.matrixSigma = this.CreateMatrixSigma( this.RezFile, selectorMatrixSigma );

            //Create Matriz P
            this.matrixP = this.CreateMatrixP( pFactor )
            //Create Matrix M
            this.matrixM = this.CreateMatrixM();
            //Create Matrix V
            this.matrixV = this.CreateMAtrixV();
            //Create Matrix L
            this.matrixL_a = this.CreateMatrixL_a();

            this.calculatedDelta = this.FillCalculatedHeight( this.matrixL_a, this.RezFile );

            let heightCalculation: HeightCalculation = new HeightCalculation();
            // heightCalculation.Main_1( this.calculatedDelta, mTableHeight );
            //this.calculatedHeight = heightCalculation.mTableHeight;

            this.calculatedHeight = heightCalculation.Main_4( this.calculatedDelta, mAllCsv );




            this.sigmaPosteriori = Math.sqrt( this.GetSigmaPosteriori( f_r ) );
        }
        catch ( Error )
        {


            $( "#mDeleteProjectMessageAdvertence" ).css( 'display', 'block' );
            $( "#AdevrtenceMessadeTD" ).html( Error + '<br/> נא לנסות אחרת' );
            $( "#mwaitmediv" ).css( 'display', 'none' );

        }

    }
    FilterSegementsByType ( segmentToTihum: SegmentsToTihum[], nTypes: number[] ): mSegment[][]
    {
        let mRow: mSegment[] = [];
        let mRes: mSegment[][] = [];
        for ( let i = 0; i < nTypes.length; i++ )
        {
            let mTihumByType: SegmentsToTihum[] = segmentToTihum.filter( x => x.nType === nTypes[ i ] );
            for ( let j = 0; j < mTihumByType.length; j++ )
            {
                mRow = [];
                for ( let k = 0; k < mTihumByType[ j ].msegments.length; k++ )
                {
                    mRow.push( mTihumByType[ j ].msegments[ k ] );
                }
                mRes.push( mRow );
            }
        }

        return mRes;


    }


    private GetRez ( AllRezFile: typeRez[], AllSegemnts: mSegment[][] ): RezFile[]
    {
        let mRes: RezFile[] = [];
        let solveLoopsNets_Main1: SolveLoopsNets_Main1 = new SolveLoopsNets_Main1();
        let mAllSegemnts: mSegment[] = [];

        for ( let i = 0; i < AllSegemnts.length; i++ )
        {
            let msegment1: mSegment[] = AllSegemnts[ i ];
            for ( let j = 0; j < msegment1.length; j++ )
            {
                let msegment2: mSegment = msegment1[ j ];
                for ( let k = 0; k < msegment2.lstSegment.length; k++ )
                {
                    mAllSegemnts.push( msegment2.lstSegment[ k ] );
                }
            }
        }

        return solveLoopsNets_Main1.doRezFile( AllRezFile, mAllSegemnts );
    }


    private FillCalculatedHeight ( matrixL_a: number[][], RezFile: RezFile[] ): TableDeltaHeights[]
    {
        let mres: TableDeltaHeights[] = [];
        for ( let i = 0; i < RezFile.length; i++ )
            mres.push( new TableDeltaHeights( RezFile[ i ].Point_A, RezFile[ i ].Point_B, matrixL_a[ i ][ 0 ], null, null ) )

        return mres;

    }






    private GetSigmaPosteriori ( f_r: number ): number
    {
        let vTransp = math.transpose( this.matrixV );
        let res: any = math.multiply( math.matrix( vTransp ), math.matrix( this.matrixP ) );
        res = math.multiply( res, math.matrix( this.matrixV ) );
        res = math.multiply( res, ( 1 / f_r ) );
        return res._data;
    }

    createNew ()
    {
        //=INDEX(K3:L15,MATCH(D176:D185,K3:K15,0),2)+MMULT(F176:S185,L123:L136)

    }


    CreateViewResults (): number[][]
    {
        let res: number[][] = [];
        return res;

    }
    private CreateMatrixResults (): number[][]
    {
        let res: any = math.multiply( math.matrix(), math.matrix() )
        return res._data;
    }
    private CreateMatrixL_a (): number[][]
    {
        let res: any = math.add( math.matrix( this.matrixL_b ), math.matrix( this.matrixV ) );
        return res._data;
    }
    private CreateMAtrixV (): number[][]
    {
        //=-MMULT(MMULT(MMULT(MINVERSE(P),TRANSPOSE(B)),MINVERSE(M)),w)

        //MINVERSE(P)
        let mPMinus1: any = math.inv( this.matrixP );
        //TRANSPOSE(B)
        let bTransp = math.transpose( this.matrixB );
        //MINVERSE( M )
        let mInv: any;

        mInv = math.inv( this.matrixM );



        let res: any = math.multiply( mPMinus1, bTransp )
        res = math.multiply( res, mInv );
        res = math.multiply( res, math.matrix( this.matrixW ) );
        res = math.multiply( -1, res );

        return res._data;
    }
    private CreateMatrixM (): number[][]
    {
        let mRes: any = math.multiply(
            math.multiply( math.matrix( this.matrixB ),
                math.inv( this.matrixP ) ),
            math.transpose( this.matrixB ) )
        return mRes._data;
    }
    private CreateMatrixP ( pFactor: number ): number[][]
    {
        let mMath: any = math.multiply( pFactor, math.inv( math.matrix( this.matrixSigma ) ) );
        return mMath._data;
    }



    private CreateMatrixSigma ( RezFile: RezFile[], selectorMatrixSigma: string ): number[][]
    {
        //Create empty result;
        let mResult: number[][] = [];

        //Loop for all segments
        for ( let i = 0; i < RezFile.length; i++ )
        {
            //Getting row
            //mResult.push( this.GetSigmaBFRow( RezFile, i ) );
            if ( selectorMatrixSigma === "0" )
                mResult.push( this.GetSigmaDistanceRow( RezFile, i ) );

            if ( selectorMatrixSigma === "1" )
                mResult.push( this.GetSigmaBFRow( RezFile, i ) );
        }
        //return
        return mResult;
    }


    private GetSigmaDistanceRow ( RezFile: RezFile[], i: number ): number[]
    {
        let mRow: number[] = [];
        for ( let j = 0; j < RezFile.length; j++ )
        {
            if ( j != i )
                mRow.push( 0 );
            else mRow.push( RezFile[ j ].Distance );
        }

        return mRow;

    }



    private GetSigmaBFRow ( RezFile: RezFile[], i: number ): number[]
    {
        let mRow: number[] = [];
        for ( let j = 0; j < RezFile.length; j++ )
        {
            if ( j != i )
                mRow.push( 0 );
            else
            {
                if ( RezFile[ j ].Difference_Between_BF === 0 )
                    RezFile[ j ].Difference_Between_BF = 0.001;

                mRow.push( Math.pow( ( RezFile[ j ].Difference_Between_BF / 1000 ), 2 ) )
            }
        }

        return mRow;

    }





    private CreateMatrixSigmaByAccr ( RezFile: RezFile[] ): number[][]
    {
        //Create empty result;
        let mResult: number[][] = [];

        //Loop for all segments
        for ( let i = 0; i < RezFile.length; i++ )
        {
            //Getting row
            mResult.push( this.GetSigmaAcrRow( RezFile, i ) );
        }
        //return
        return mResult;
    }


    private GetSigmaAcrRow ( RezFile: RezFile[], i: number ): number[]
    {
        let mRow: number[] = [];
        for ( let j = 0; j < RezFile.length; j++ )
        {
            if ( j != i )
                mRow.push( 0 );
            else mRow.push( Math.pow( ( 5 * Math.sqrt( 2 * RezFile[ j ].Num_Across ) / 1000 ), 2 ) );
        }

        return mRow;

    }
    private FixMatrixW ( mlength: number, additionalSegmants: mSegment[][], mAllCsv: typeCsv[] )
    {
        let mCounter: number = 0;
        for ( let i = mlength; i < this.matrixW.length; i++ )
        {
            let mSum: number = this.GetHeigth( additionalSegmants[ mCounter ], mAllCsv );
            let mStore: number = this.matrixW[ i ][ 0 ];
            this.matrixW[ i ][ 0 ] = mSum + mStore;
            mCounter++;
        }
    }
    private GetHeigth ( arg0: mSegment[], mAllCsv: typeCsv[] ): number
    {
        return mAllCsv.find( x => x.nam === arg0[ 0 ].PointA ).heiort - mAllCsv.find( x => x.nam === arg0[ arg0.length - 1 ].PointB ).heiort;
    }



    private CreateMatrixL ( RezFile: RezFile[] ): number[][]
    {
        let mRes: number[][] = [];

        for ( let i = 0; i < RezFile.length; i++ )
        {
            let mRow: number[] = [];
            mRow.push( RezFile[ i ].Height_Difference );
            mRes.push( mRow )
        }
        return mRes;
    }

    //Create Matriz Bits (0110001100110)
    private CreateMatrizB ( RezFile: RezFile[], allPartnerObjects: mSegment[][], additionalSegmants: mSegment[][] ): number[][]
    {
        let mMatrixB: number[][] = [];

        //Go for all the loops lines addeds
        for ( let i = 0; i < allPartnerObjects.length; i++ )
        {
            let mTempo: mSegment[] = [];
            for ( let a = 0; a < allPartnerObjects[ i ].length; a++ )
                for ( let j = 0; j < allPartnerObjects[ i ][ a ].lstSegment.length; j++ )
                {
                    mTempo.push( allPartnerObjects[ i ][ a ].lstSegment[ j ] );
                }
            //Create a row that belong to partner objetc(loops , or aditional line)
            mMatrixB.push( this.CreateRowForB( mTempo, RezFile ) );
        }
        for ( let i = 0; i < additionalSegmants.length; i++ )
        {
            //Create a row that belong to partner objetc(loops , or aditional line)
            mMatrixB.push( this.CreateRowForB( additionalSegmants[ i ], RezFile ) );
        }
        return mMatrixB;
    }
    private CreateRowForB ( mPartner: mSegment[], RezFile: RezFile[] ): number[]
    {
        //Create e single row empty
        let row: number[] = [];
        //run for each segments
        for ( let i = 0; i < RezFile.length; i++ )
        {
            //get the bit belong and push to row  
            row.push( this.GetBelongingToSegment( RezFile[ i ], mPartner ) );
        }

        return row;

    }
    private GetBelongingToSegment ( arg0: RezFile, mPartner: mSegment[] ): number
    {


        //GO
        if ( mPartner.findIndex( x => x.PointA === arg0.Point_A && x.PointB === arg0.Point_B ) != -1 )
            return 1;
        //BACK
        if ( mPartner.findIndex( x => x.PointB === arg0.Point_A && x.PointA === arg0.Point_B ) != -1 )
            return -1;
        //default
        return 0;
    }

    //Getting the Segments Array



}

export class clsCalculatedHeights
{
    mPointA: string;
    mPointB: string;
    mHeight: number;

    constructor ( mPointA: string, mPointB: string, mHeight: number )
    {
        this.mPointA = mPointA;
        this.mPointB = mPointB;
        this.mHeight = mHeight;
    }
}