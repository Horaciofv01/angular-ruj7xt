import { mService, typeCsv, typeRez, mSelectedAndAll } from '../../../Balances/Library/m-cesium/Script/MapiCesium';
import { throwToolbarMixedModesError } from '@angular/material';

export class mLinesLoops_01
{


    mSegment: mSegment;
    mArrSegmentsbyGroups: [];
    mSegmentIndex: mSegmentIndex;
    mArrSegments: mSegment[] = [];
    mNumBox: mNumBox[] = [];
    mWordBox: mWordBox[] = [];
    mIndexBoxes: mNumBox[] = [];
    mCounter01: number = 0;
    firstResults: mSegmentGroups[];


    constructor ()
    {
        this.mSegment = null;
        this.mArrSegmentsbyGroups = [];
        this.mSegment = null;
        this.mNumBox = [];
        this.mWordBox = [];
        this.mNumBox = [];
        this.mCounter01 = 0;
        this.firstResults = [];
    }


    GetFirstNumAndLastWord ( mVar: any ): string[]
    {



        if ( mVar == undefined )
            return [ ' ', ' ' ];

        //single word case
        if ( mVar.length == 1 )
            if ( isNaN( mVar ) )
                return [ ' ', mVar ]
            else return [ mVar, ' ' ];
        else
        {
            //word and word case
            if ( !isNaN( mVar.substring( 0, 1 ) ) && isNaN( mVar.substring( mVar.length - 1, mVar.length ) ) )
                return [ mVar.substring( 0, 1 ), mVar.substring( mVar.length - 1, mVar.length ) ];
            //word and number case
            if ( isNaN( mVar.substring( 0, 1 ) ) && !isNaN( mVar.substring( mVar.length - 1, mVar.length ) ) )
                return [ mVar.substring( mVar.length - 1, mVar.length ), mVar.substring( 0, 1 ) ];
            //words lonelly
            if ( !isNaN( mVar.substring( 0, 1 ) ) && !isNaN( mVar.substring( mVar.length - 1, mVar.length ) ) )
                return [ mVar.substring( 0, 1 ), ' ' ];
            //numbers lonelly
            if ( isNaN( mVar.substring( 0, 1 ) ) && isNaN( mVar.substring( mVar.length - 1, mVar.length ) ) )
                return [ ' ', mVar.substring( 0, 1 ) ];
        }
        //nothing case.
        return [ ' ', ' ' ];

    }

    // Reverse line AB to BA and chang height differences (width the lstSegments into)
    ReverseSegment ( mSeg: mSegment ): mSegment
    {

        let mLst = []
        if ( mSeg.lstSegment != [] )
            mLst = this.OrderSegemtList( mSeg.lstSegment, mSeg.PointB, mSeg.PointA );

        return new mSegment( mSeg.PointB, mSeg.PointA, ( ( -1 ) * mSeg.HeighDifference ), mSeg.Distance, mSeg.FileName,
            mSeg.Order, mSeg.CoordX, mSeg.CoordY, mSeg.CoordZ, mSeg.nSource, mSeg.bReaded_1, mSeg.mFlag3, mSeg.mFlag4, mSeg.mFlag5, mLst, mSeg.clsSecundDatas )
    }


    //Reverse line AB to BA and chang height differences and coordenates
    ReverseLine ( mLine: mSegment[] ): mSegment[]
    {

        var mReturn = [];
        for ( var i = mLine.length - 1; i >= 0; i-- )
        {
            mReturn.push( this.ReverseSegment( mLine[ i ] ) );
        }

        return mReturn;
    }

    //Reverse line AB to BA and chang height differences and coordenates
    ReverseLineNoList ( mLine: mSegment[] ): mSegment[]
    {

        var mReturn = [];
        for ( let i = mLine.length - 1; i >= 0; i-- )
        {
            mLine[ i ].lstSegment = [];
            mReturn.push( this.ReverseSegment( mLine[ i ] ) );
        }
        return mReturn;
    }


    //Reply line to avoid reference objects error.
    ReplySegment ( mSeg: mSegment ): mSegment
    {

        let mLst = this.OrderSegemtList( mSeg.lstSegment, mSeg.PointA, mSeg.PointB );

        return new mSegment( mSeg.PointA, mSeg.PointB, mSeg.HeighDifference, mSeg.Distance, mSeg.FileName,
            mSeg.Order, mSeg.CoordX, mSeg.CoordY, mSeg.CoordZ, mSeg.nSource, mSeg.bReaded_1, mSeg.mFlag3, mSeg.mFlag4, mSeg.mFlag5, mLst, mSeg.clsSecundDatas );
    }

    FixSegment ( mSeg: mSegment ): mSegment
    {
        if ( mSeg.lstSegment == undefined )
            mSeg.lstSegment = [];

        if ( mSeg.lstSegment.length == 0 )
            mSeg.lstSegment = [];

        for ( let i = 0; i < mSeg.lstSegment.length; i++ )
        {
            if ( mSeg.lstSegment[ i ].constructor.name != "mSegment" )
            {
                mSeg.lstSegment.splice( i, 1 );
                return mSeg;
            }
        }
    }

    //Reply line to avoid reference objects error.
    ReplyLine ( mLine: mSegment[] ): mSegment[]
    {

        var mReturn = [];

        for ( let i = 0; i < mLine.length; i++ )
        {
            let mSegment = mLine[ i ];
            mReturn.push( this.ReplySegment( mSegment )
            )
        }

        return mReturn;
    }


    MarkFlag1AsReadedByIndex ( i: number, j: number, q: number ): void
    {

        //Setting as false nSource
        this.mIndexBoxes[ i ].wordArray[ j ].mSegmentsArray[ q ].mFlag3 = true;

        let A_Reverse: string = this.mIndexBoxes[ i ].wordArray[ j ].mSegmentsArray[ q ].PointB;
        let B_Reverse: string = this.mIndexBoxes[ i ].wordArray[ j ].mSegmentsArray[ q ].PointA;

        let indexes: mSegmentIndex = this.SearchSegmentIndex( A_Reverse, B_Reverse );

        if ( indexes == null )
        {
            return;
        }



        this.mIndexBoxes[ indexes.i ].wordArray[ indexes.j ].mSegmentsArray[ indexes.q ].mFlag3 = true;


    }

    //Set to false the flag1 on child and he's reverse
    MarkFlag1AsReadedByPointsNames ( pointA: string, pointB: string ): void
    {

        //Getting the index of the point
        let mChildsIndex = this.SearchSegmentIndex( pointA, pointB );
        //Setting as false nSource
        this.mIndexBoxes[ mChildsIndex.i ].wordArray[ mChildsIndex.j ].mSegmentsArray[ mChildsIndex.q ].nSource = true;
        //Reversing
        mChildsIndex = this.SearchSegmentIndex( pointB, pointA );

        if ( mChildsIndex == null )
        {
            this.SearchSegmentIndex( pointB, pointA );
            return;
        }

        //Seeting nSource as true
        this.mIndexBoxes[ mChildsIndex.i ].wordArray[ mChildsIndex.j ].mSegmentsArray[ mChildsIndex.q ].nSource = true;


    }


    getSegmentTotalLength ( mLine: mSegment[] ): number
    {
        let mCounter: number = 0;
        for ( let i = 0; i < mLine.length; i++ )
        {
            mCounter += mLine[ i ].lstSegment.length;
        }
        return mCounter;

    }

    bLineJustContainPoint ( mLine: mSegment[], msegment: mSegment ): boolean
    {

        let PB: string = msegment.PointB;
        for ( let i = 0; i < mLine.length; i++ )
        {
            for ( let j = 0; j < mLine[ i ].lstSegment.length; j++ )
            {
                if ( mLine[ i ].lstSegment[ j ].PointA === PB || mLine[ i ].lstSegment[ j ].PointB === PB )
                    return true;
            }
        }

        return false;

    }




    bSameSegmentOrContained ( mSegA: mSegment, mSegB: mSegment ): boolean
    {

        //////////////////CASE LENGHT == 0 BOTH
        if ( mSegA.lstSegment.length === 0 && mSegB.lstSegment.length === 0 )
        {

            if (
                ( mSegA.PointA === mSegB.PointA && mSegA.PointB === mSegB.PointB ) ||
                ( mSegA.PointB === mSegB.PointA && mSegA.PointA === mSegB.PointB )
            ) return true;


            return false;
        }


        ///////////////////////////////////////////////////////
        if ( mSegA.lstSegment.length === 0 && mSegB.lstSegment.length > 0 )
        {

            for ( let i = 0; i < mSegB.lstSegment.length; i++ )
            {

                if (
                    ( mSegA.PointA === mSegB.lstSegment[ i ].PointA && mSegA.PointB === mSegB.lstSegment[ i ].PointB ) ||
                    ( mSegA.PointB === mSegB.lstSegment[ i ].PointA && mSegA.PointA === mSegB.lstSegment[ i ].PointB )
                ) return true;

            }
            return false;
        }

        //////////////////////////////////////////////////////////

        if ( mSegA.lstSegment.length > 0 && mSegB.lstSegment.length == 0 )
        {

            for ( let i = 0; i < mSegA.lstSegment.length; i++ )
            {

                if (
                    ( mSegA.lstSegment[ i ].PointA == mSegB.PointA && mSegA.lstSegment[ i ].PointB == mSegB.PointB ) ||
                    ( mSegA.lstSegment[ i ].PointB == mSegB.PointA && mSegA.lstSegment[ i ].PointA == mSegB.PointB )
                ) return true;

            }
            return false;
        }




        let newSegmentB = this.ReplySegment( mSegB )

        //getting the conatined segment
        let minLenght = mSegA.lstSegment.length;
        if ( minLenght > mSegB.lstSegment.length )
            minLenght = mSegB.lstSegment.length;


        for ( let i = 0; i < minLenght; i++ )
        {
            if ( mSegA.lstSegment[ i ].PointA != newSegmentB.lstSegment[ i ].PointA )
            {
                newSegmentB = this.ReverseSegment( newSegmentB );
                break;
            }
        }

        //Comparing one by one.
        for ( let i = 0; i < minLenght; i++ )
        {
            if ( mSegA.lstSegment[ i ].PointA != newSegmentB.lstSegment[ i ].PointA )
                return false;

            if ( mSegA.lstSegment[ i ].PointB != newSegmentB.lstSegment[ i ].PointB )
                return false;
        }
        //No exceptions: The segemts are the same
        return true;
    }

    bSegmentJustContained ( mLine: mSegment[], mSegment: mSegment ): boolean
    {

        let allSegments = [];

        for ( let i = 0; i < mLine.length; i++ )
        {

            if ( this.bSameSegment( mLine[ i ], mSegment ) )
                return true;
        }

        for ( let i = 0; i < mLine.length; i++ )
        {
            for ( let j = 0; j < mLine[ i ].lstSegment.length; j++ )
            {
                if ( this.bSameSegment( mLine[ i ].lstSegment[ j ], mSegment ) )
                    return true;
            }
        }
        return false;
    }

    //Version 2
    bSameSegmentOrContained_01 ( mSegA: mSegment, mSegB: mSegment ): boolean
    {
        let minLenght = mSegA.lstSegment.length;
        let newSegmentB = this.ReplySegment( mSegB );

        if ( minLenght > mSegB.lstSegment.length )
            minLenght = mSegB.lstSegment.length;

        var mCount = 0
        for ( var i = 0; i < minLenght; i++ )
        {
            for ( var j = 0; j < minLenght; j++ )
            {
                if (
                    ( mSegA.lstSegment[ i ].PointA == newSegmentB.lstSegment[ j ].PointA && mSegA.lstSegment[ i ].PointB == newSegmentB.lstSegment[ j ].PointB ) ||
                    ( mSegA.lstSegment[ i ].PointB == newSegmentB.lstSegment[ j ].PointA && mSegA.lstSegment[ i ].PointA == newSegmentB.lstSegment[ j ].PointB )
                )
                {
                    mCount++;
                    break;
                }
            }

            if ( mCount == minLenght )
                return true;
        }

        return false;


    }

    bSameSegment ( mSegA: mSegment, mSegB: mSegment ): boolean
    {

        return this.bSameSegmentOrContained( mSegA, mSegB );

    }

    bIsTheSameLine ( mLine1: mSegment[], mLine2: mSegment[] ): boolean
    {


        if ( mLine1.length != mLine2.length )
            return false;
        let mCheck = false;

        if ( this.bSameSegment( mLine1[ 0 ], mLine2[ 0 ] ) && this.bSameSegment( mLine1[ mLine1.length - 1 ], mLine2[ mLine1.length - 1 ] ) )
            mCheck = true;

        if ( this.bSameSegment( mLine1[ 0 ], mLine2[ mLine1.length - 1 ] ) && this.bSameSegment( mLine1[ mLine1.length - 1 ], mLine2[ 0 ] ) )
        {
            mLine2 = this.ReverseLine( mLine2 );
            mCheck = true;
        }

        if ( mCheck === false )
            return false;

        for ( let i = 0; i < mLine1.length; i++ )
        {

            if ( !this.bSameSegment( mLine2[ i ], mLine1[ i ] ) )
                return false;

        }
        return true;
    }

    bIsTheSameLoop ( mLine1: mSegment[], mLine2: mSegment[] ): boolean
    {

        for ( let i = 0; i < mLine1.length; i++ )
        {
            if ( !this.bSegmentJustContained( mLine2, mLine1[ i ] ) )
                return false;
        }
        return true;
    }

    OrderSegemtListgetFirst ( mListSegments: mSegment[], pointA: string ): mSegment
    {
        let mIndex = -1;
        for ( let i = 0; i < mListSegments.length; i++ )
        {
            //Segment goes
            if ( mListSegments[ i ].PointA == pointA )
            {
                return mListSegments[ i ];
            }
            //Segement Backs
            if ( mListSegments[ i ].PointB == pointA )
            {
                return this.ReverseSegment( mListSegments[ i ] );
            }
        }
    }

    OrderSegemtListgetNext ( mListSegments: mSegment[], pointA: string, pointB: string ): mSegment
    {


        var mIndex = -1;
        for ( var i = 0; i < mListSegments.length; i++ )
        {


            //Segement GO
            if ( mListSegments[ i ].PointA === pointA && mListSegments[ i ].PointB === pointA )
            {
                return mListSegments[ i ];
            }
            //Segement BACK
            if ( mListSegments[ i ].PointA === pointB && mListSegments[ i ].PointB === pointB )
            {
                return this.ReverseSegment( mListSegments[ i ] );
            }
            //Segement GO
            if ( mListSegments[ i ].PointA === pointA && mListSegments[ i ].PointB === pointB )
            {
                return mListSegments[ i ];
            }
            //Segement BACK
            if ( mListSegments[ i ].PointA === pointB && mListSegments[ i ].PointB === pointA )
            {
                return this.ReverseSegment( mListSegments[ i ] );
            }
        }
    }

    OrderSegemtList ( mListSegments: mSegment[], pointA: string, pointB: string ): mSegment[]
    {

        if ( mListSegments == undefined || pointA == undefined )
            return [];

        if ( mListSegments.length == 0 )
            return [];

        let mRes = [];
        let mFirstSegment = this.OrderSegemtListgetFirst( mListSegments, pointA );


        if ( pointA === pointB )
            return this.ReverseLineNoList( mListSegments );

        if ( pointA === mListSegments[ 0 ].PointA )
            return mListSegments;


        if ( pointA == mListSegments[ mListSegments.length - 1 ].PointB )
            return this.ReverseLineNoList( mListSegments );


        return mListSegments;

    }

    PushSegemntIntoList ( PointA: string, PointB: string, HeighDifference: number, Distance: number, FileName: string, Order: number, CoordX: number, CoordY: number, CoordZ: number, nSource: any, bReaded_1: any, mFlag3: any, mFlag4: any, mFlag5: any, lstSegment: mSegment[] ): void
    {
        let mSeg = new mSegment( PointA, PointB, HeighDifference, Distance, FileName, Order, CoordX, CoordY, CoordZ, nSource, bReaded_1, mFlag3, mFlag4, mFlag5, lstSegment, null );
        let mArr = [];
        mArr.push( mSeg );
        this.mArrSegments.push( new mSegment( PointA, PointB, HeighDifference, Distance, FileName, Order, CoordX, CoordY, CoordZ, nSource, bReaded_1, mFlag3, mFlag4, mFlag5, mArr, null ) );
    }

    //returns true when the line stands from pointA no chids and pointb no childs or not loop at the corner
    isCorneredLine ( mLine45: mSegment[] ): boolean
    {
        //return true;
        let mLine1 = this.ReplyLine( mLine45 );

        let mLine3 = this.ReplyLine( mLine45 );
        let mLine4 = this.ReplyLine( mLine3 );
        let mLine2 = this.ReverseLine( mLine4 );

        let chek1 = this.isCornerPoint( mLine1 );
        let chek2 = this.isCornerPoint( mLine2 );

        if ( chek1 && chek2 )
            return true;

        return false;

    }

    isCornerPoint ( mLine: mSegment[] ): boolean
    {

        //Searching if the the point has childs
        //No Childs is a corner
        //returns true.

        let last_Segment = mLine[ mLine.length - 1 ].lstSegment[ mLine[ mLine.length - 1 ].lstSegment.length - 1 ];
        let lastB = last_Segment.PointB;
        let lastA = last_Segment.PointA;


        if ( this.SearchChildIndexesForSegment( last_Segment ).length == 0 )
            return true;

        //searching is the point has containded into the line
        //is contained: returns true
        let mArray = [];

        for ( let s = 0; s < mLine.length - 1; s++ )
        {

            if ( mLine[ s ].lstSegment.length == 0 )
            {
                if ( mLine[ s ].PointB === lastB || mLine[ s ].PointA === lastB )
                    return true;
            }

            for ( let j = 0; j < mLine[ s ].lstSegment.length; j++ )
            {
                if ( mLine[ s ].lstSegment[ j ].PointB === lastB )
                    return true;

                if ( mLine[ s ].lstSegment[ j ].PointA === lastB )
                    return true;
            }
        }

        //not contained and has child return false: the point is not a corner and the line must to be out.
        return false;
    }

    FillBlancs ( mLine: mSegment[] ): void
    {

        let mReturn = this.ReplyLine( mLine )
        let mArr = []

        //2 times to get corners also
        for ( let s = 0; s < mLine.length; s++ )
        {
            for ( let j = 0; j < mLine[ s ].lstSegment.length; j++ )
            {

                mArr.push( mLine[ s ].lstSegment[ j ] );
            }
        }
        let mCurrent = 0;
        let mLast = 0;
        let mWronIndex = [];
        let ArrIndex = [];

        //run al arraylit
        //Getting the current coordinate

        let mCheck = null;
        for ( let i = 0; i < mArr.length; i++ )
        {

            ///////mCheck = mUi.getCoordinate(mArr[i].PointA);

            //Has coordinate
            if ( mCheck != null )
            {

                if ( ArrIndex.length == 0 )
                {
                    mCurrent = mCheck
                }

                if ( ArrIndex.length > 0 )
                {
                    mLast = mCheck
                    ////////this.FillCoordenates(mArr, ArrIndex, mCurrent, mLast);
                    ArrIndex = [];
                }
            }
            else
            {//No coordinates
                //Getting the first and the second of null cordinate
                ArrIndex.push( i );
            }

        }
    }


    CheckPointsCoordinates ( mLine: mSegment[] ): string
    {

        var mPoints = "";
        let mCheck: string;
        for ( var i = 0; i < mLine.length; i++ )
        {

            /////////// let mCheck = mUi.getCoordinate(mLine[i].PointA);
            if ( mCheck == null )
            {
                mPoints = mPoints.concat( mLine[ i ].PointA ) + "; "
            }
        }

        //////////////mCheck = mUi.getCoordinate(mLine[mLine.length - 1].PointB);
        if ( mCheck == null )
        {
            mPoints = mPoints.concat( mLine[ mLine.length - 1 ].PointB ) + "; "
        }
        return mPoints.substring( 0, mPoints.length - 2 );

    }



    FillCoordenates ( mLine: mSegment[], ArrIndex: number[], mCurrent: any, mLast: any ): VideoFacingModeEnum
    {


        if ( mLast._z == '' ) mLast._z = 0;
        if ( isNaN( mLast._z ) ) mLast._z = 0;
        if ( mCurrent._z == '' ) mCurrent._z = 0;
        if ( isNaN( mCurrent._z ) ) mCurrent._z = 0;

        if ( ArrIndex.length == 0 )
            return;

        let mDiferenceX = ( parseFloat( mLast._x ) - parseFloat( mCurrent._x ) ) / ArrIndex.length;
        let mDiferenceY = ( parseFloat( mLast._y ) - parseFloat( mCurrent._y ) ) / ArrIndex.length;
        let mDiferenceZ = ( parseFloat( mLast._z ) - parseFloat( mCurrent._z ) ) / ArrIndex.length;

        let mCount = 0.5
        for ( let i = ArrIndex[ 0 ]; i <= ArrIndex[ ArrIndex.length - 1 ]; i++ )
        {

            let mX = parseFloat( mCurrent._x ) + ( mDiferenceX * mCount );

            if ( isNaN( mX ) )
                return;

            let mY = parseFloat( mCurrent._y ) + ( mDiferenceY * mCount );

            if ( isNaN( mY ) )
                return;

            let mZ = parseFloat( mCurrent._z ) + ( mDiferenceZ * mCount );

            if ( isNaN( mZ ) )
                return;

            this.InsertNewCoordinate( mLine[ i ].PointA, mX, mY, mZ );

            mCount++;
        }

    }

    //Inserting coordinates into the line
    InsertNewCoordinate ( PointA: string, mX: number, mY: number, mZ: number ): void
    {
        //////////////////////////////////
        //  mUi.mCoordinates.push({
        //      "OT_NEKUDA": PointA,
        //      "MISPAR_NEKUDA": "",
        //      "Y_Wronged": mY,
        //      "X_Wronged": mX,
        //       "ROWNUM": "-1",
        //       "CODE_NEKUDA": "-1",
        //      "GOVA_ORT": mZ,
        //      "CODE_SUG_RESHET": "-1",
        //      "SHEM_DARGA_GOVA": "-1",
        //       "isDb": "0"
        //  });

    }

    //Development requerimets are vixual studio 2010 sometimes give error from map, find or filter.
    CheckOnArray ( mArr: any[], mValue: any ): boolean
    {

        for ( let i = 0; i < mArr.length; i++ )
        {
            if ( mArr[ i ] == mValue )
                return true;
        }
        return false;
    }


    CalculateGovaByPoint ( mLine: mSegment[], mPoinName: string, mGova: number )
    {

        //First setting the first point to height
        ///////////////////mUi.setCoordinateGova(mPoinName, mGova);
        let mNewGova = mGova;
        let mFlag = false;
        for ( let i = 0; i < mLine.length; i++ )
        {

            for ( let j = 0; j < mLine[ i ].lstSegment.length; j++ )
            {

                if ( mLine[ i ].lstSegment[ j ].PointA === mPoinName || mFlag == true )
                {
                    mFlag = true;
                    mNewGova += mLine[ i ].lstSegment[ j ].HeighDifference;
                    /////////////// mUi.setCoordinateGova(mLine[i].lstSegment[j].PointB, mNewGova);

                }

            }
        }


        mNewGova = mGova;
        mFlag = false;
        for ( let i = 0; i < mLine.length; i++ )
        {

            for ( let j = 0; j < mLine[ i ].lstSegment.length; j++ )
            {

                if ( mLine[ i ].lstSegment[ j ].PointA === mPoinName || mFlag === true )
                {
                    mFlag = true;
                    mNewGova += mLine[ i ].lstSegment[ j ].HeighDifference;
                    /////////////mUi.setCoordinateGova(mLine[i].lstSegment[j].PointB, mNewGova);

                }

            }
        }
        //Checks all points A
        if ( mFlag == false )
        {
            for ( let i = 0; i < mLine.length; i++ )
            {

                for ( let j = 0; j < mLine[ i ].lstSegment.length; j++ )
                {

                    ////////////////let tempo = mUi.getCoordinate(mLine[i].lstSegment[j].PointA);
                    let tempo: any = null;
                    if ( tempo != null && !isNaN( tempo._z.toString() ) )
                    {
                        this.CalculateGovaByPoint( mLine, mLine[ i ].lstSegment[ j ].PointA, tempo._z );
                        return;
                    }
                }
            }
        }




        //Check last point B
        if ( mFlag == false )
        {
            /////////////var tempo = mUi.getCoordinate(mLine[mLine.length - 1].lstSegment[mLine[mLine.length - 1].lstSegment.length - 1].PointB);
            let tempo: any = null;
            if ( tempo != null && !isNaN( tempo._z.toString() ) )
            {
                this.CalculateGovaByPoint( mLine, mLine[ mLine.length - 1 ].lstSegment[ mLine.length - 1 ].PointB, tempo._z );
                return;

            }
        }
    }






    PushSidesInList ( mService: mSelectedAndAll )
    {
        let mCounter = 0;
        let mArr = [];
        let mSeg = null;


        for ( let i = 0; i < mService.mRezSelected.length; i++ )
        {
            let mPointDataA: typeCsv = this.GetDatasFromPoint( mService.mCsvAll, mService.mRezSelected[ i ].pa );
            let mPointDataB: typeCsv = this.GetDatasFromPoint( mService.mCsvAll, mService.mRezSelected[ i ].pb );


            if ( mPointDataA == null || mPointDataB == null )
            {
                mPointDataA = this.GetDatasFromPoint( mService.mCsvAll, mService.mRezSelected[ i ].pa );
                mSeg = new mSegment( mService.mRezSelected[ i ].pa, mService.mRezSelected[ i ].pb, -1, -1, '', i, 0, 0, 0, false, ( mCounter++ ), false, false, false, [], [] ); mArr = []; mArr.push( mSeg );
                this.mArrSegments.push( new mSegment( mService.mRezSelected[ i ].pa, mService.mRezSelected[ i ].pb, -1, -1, '', i, 0, 0, 0, false, ( mCounter++ ), false, false, false, mArr, [] ) );
                continue;
            }


            mSeg = new mSegment( mPointDataA.nam, mPointDataB.nam, mService.mRezSelected[ i ].hei, mService.mRezSelected[ i ].dis, mService.mRezSelected[ i ].fil, i, 0, 0, 0, false, ( mCounter++ ), false, false, false, [], [] ); mArr = []; mArr.push( mSeg );
            this.mArrSegments.push( new mSegment( mPointDataA.nam, mPointDataB.nam, mService.mRezSelected[ i ].hei, mService.mRezSelected[ i ].dis, mService.mRezSelected[ i ].fil, i, 0, 0, 0, false, ( mCounter++ ), false, false, false, mArr, [] ) );
        }
    }

    GetDatasFromPoint ( mcsv: typeCsv[], pointName: string ): typeCsv
    {
        return mcsv.find( x => x.nam === pointName );

    }




    InsertOnIndexBoxesIndex_Go_Back ( mSeg: mSegment ): void
    {
        let mReply1 = this.ReplySegment( mSeg );
        let mReply2 = this.ReplySegment( mSeg );
        let mReply3 = this.ReplySegment( mReply2 );

        this.InsertOnIndexBoxesIndex( mReply2 );
        this.InsertOnIndexBoxesIndex( this.ReverseSegment( mReply3 ) );



    }

    //Insertying to this.mIndexBoxes segments.
    InsertOnIndexBoxesIndex ( mSeg: mSegment ): void
    {

        let mNewSegment = this.ReplySegment( mSeg );


        let mIndex = this.GetFirstNumAndLastWord( mNewSegment.PointA );
        let mlstSegment = [];
        mlstSegment.push( mNewSegment );

        let mIndexNum = -1;
        let mIndexWord = -1;


        //On hasnt num inserting num and word
        if ( this.mIndexBoxes.findIndex( x => x.num == mIndex[ 0 ] ) == -1 )
        {
            this.mIndexBoxes.push( new mNumBox( mIndex[ 0 ], [] ) );
        }

        mIndexNum = this.mIndexBoxes.findIndex( x => x.num === mIndex[ 0 ] );

        if ( this.mIndexBoxes[ mIndexNum ].wordArray.findIndex( x => x.word == mIndex[ 1 ] ) == -1 )
        {
            this.mIndexBoxes[ mIndexNum ].wordArray.push( new mWordBox( mIndex[ 1 ], [] ) );

        }

        mIndexWord = this.mIndexBoxes[ mIndexNum ].wordArray.findIndex( x => x.word == mIndex[ 1 ] );

        if ( !this.BelongToIndexBoxesList( mIndexNum, mIndexWord, mNewSegment ) )
            this.mIndexBoxes[ mIndexNum ].wordArray[ mIndexWord ].mSegmentsArray.push( mNewSegment );

    }

    BelongToIndexBoxesList ( i: number, j: number, mNewSegment: mSegment ): boolean
    {

        if ( this.mIndexBoxes[ i ].wordArray[ j ].mSegmentsArray.length === 0 )
            return;


        for ( let k = 0; k < this.mIndexBoxes[ i ].wordArray[ j ].mSegmentsArray.length; k++ )
        {

            //Checking Points.
            if (

                ( ( this.mIndexBoxes[ i ].wordArray[ j ].mSegmentsArray[ k ].PointA === mNewSegment.PointA &&
                    this.mIndexBoxes[ i ].wordArray[ j ].mSegmentsArray[ k ].PointB === mNewSegment.PointB ) ||
                    ( this.mIndexBoxes[ i ].wordArray[ j ].mSegmentsArray[ k ].PointB === mNewSegment.PointA &&
                        this.mIndexBoxes[ i ].wordArray[ j ].mSegmentsArray[ k ].PointA === mNewSegment.PointB ) )
            )
            {

            } else return false;


            //Checking lstSegemtns
            if ( this.mIndexBoxes[ i ].wordArray[ j ].mSegmentsArray[ k ].lstSegment.length !== mNewSegment.lstSegment.length )
                return false;

            if ( this.bIsTheSameLine( this.mIndexBoxes[ i ].wordArray[ j ].mSegmentsArray[ k ].lstSegment, mNewSegment.lstSegment ) )
                return false;
        }
        return true;
    }




    SearchChildIndexes ( PointA: string, PointB: string, mSegment: mSegment ): mSegmentIndex[]
    {

        //Get the indexed to a wiki search
        let mIndexB = this.GetFirstNumAndLastWord( PointB )
        let mSearchResults = [];
        //Flags to break and to advises.
        let break1 = false;
        let break3 = false;

        //looping all the class.
        for ( let i = 0; i < this.mIndexBoxes.length; i++ )
        {
            //Getting the first index: the first number.
            if ( this.mIndexBoxes[ i ].num == mIndexB[ 0 ] )
            {
                break1 = true;
                let break2 = false;
                //Searching on the selected number index.
                for ( let j = 0; j < this.mIndexBoxes[ i ].wordArray.length; j++ )
                {
                    //Getting the second index: the last word.
                    if ( this.mIndexBoxes[ i ].wordArray[ j ].word == mIndexB[ 1 ] )
                    {
                        break2 = true;
                        break3 = false;
                        //Searching into the 2 indexes the segment that continue with the current segment
                        for ( let q = 0; q < this.mIndexBoxes[ i ].wordArray[ j ].mSegmentsArray.length; q++ )
                        {

                            //The just getted segments was nulled to be further deleted from list
                            if ( this.mIndexBoxes[ i ].wordArray[ j ].mSegmentsArray[ q ] == null )
                                continue;
                            //BINGO! we found a child or partner
                            if ( this.mIndexBoxes[ i ].wordArray[ j ].mSegmentsArray[ q ].PointA === PointB )
                            {
                                //Flaging we just found.
                                break3 = true;
                                //Avoiding to bring as partner the same segment

                                if ( this.mIndexBoxes[ i ].wordArray[ j ].mSegmentsArray[ q ].PointA === PointB &&
                                    this.mIndexBoxes[ i ].wordArray[ j ].mSegmentsArray[ q ].PointB === PointA )
                                    continue;

                                mSearchResults.push( new mSegmentIndex( i, j, q ) );

                            }
                        }
                        if ( break3 )
                            break;
                    }
                    if ( break2 )
                        break;
                }
            }
            if ( break1 )
                break;
        }
        if ( break3 )
        {
            if ( mSearchResults.length == 0 )
                return [];

            return mSearchResults;
        }
        return [];
    }

    ////////////////////////////



    PushSegmentsToList (): void
    {

        for ( let i = 0; i < this.mArrSegments.length; i++ )
        {
            this.InsertOnIndexBoxesIndex_Go_Back( this.mArrSegments[ i ] );

        }
        let mres = this.mIndexBoxes;


    }



    //The target it to simplify the points sistem
    //to retunr a set of continues segments
    AddSegmentToPointB ( mLine: mSegment[] ): mSegment[]
    {

        //Set the line to new
        let mReplyLine = this.ReplyLine( mLine );




        //Getting the last segment
        let mSegment = mReplyLine[ mReplyLine.length - 1 ];

        //    let mIndex = this.SearchChildIndexesForSegment(mSegment);
        //    
        //    if (this.mIndexBoxes[mIndex.i].wordArray[mIndex.j].mSegmentsArray[mIndex.q].mFlag3 == true) {
        //        return mLine;
        //    }

        //Children left array
        let mChildsIndex = this.SearchChildIndexesForSegment( mSegment );

        if ( mChildsIndex.length == 0 )
            return mReplyLine;

        //ATENTION TO THIS!!!!!!!
        //Only getting the segment with no nodes
        //it's OK
        if ( mChildsIndex.length != 1 )
            return mReplyLine;

        for ( let z = 0; z < mChildsIndex.length; z++ )
        {

            if ( this.mIndexBoxes[ mChildsIndex[ z ].i ].wordArray[ mChildsIndex[ z ].j ].mSegmentsArray[ mChildsIndex[ z ].q ].mFlag3 == true )
            {
                continue;
            }

            //BINGO!!! FOUNDED A LOOP
            if ( this.bSegmentJustContained( mReplyLine, this.mIndexBoxes[ mChildsIndex[ z ].i ].wordArray[ mChildsIndex[ z ].j ].mSegmentsArray[ mChildsIndex[ z ].q ] ) )
                return mReplyLine;

            //Adding a child to RelpyLine: the original.
            mReplyLine.push( this.ReplySegment( this.mIndexBoxes[ mChildsIndex[ z ].i ].wordArray[ mChildsIndex[ z ].j ].mSegmentsArray[ mChildsIndex[ z ].q ] ) );
            //Marking go and back as readed.(true)
            this.MarkFlag1AsReadedByIndex( mChildsIndex[ z ].i, mChildsIndex[ z ].j, mChildsIndex[ z ].q )

            break;

        }

        return mReplyLine;
    }

    DoLoop ( mLine: mSegment[] ): mSegment[]
    {

        //Pseudo recursion
        for ( let i = 0; i < 999999; i++ )
        {
            let mLength = mLine.length;
            //Adding one segment to point b of a SINGLE LINE.
            mLine = this.AddSegmentToPointB( mLine );
            //No childs added
            if ( mLength == mLine.length )
            {
                break;
            }
        }

        return mLine;

    }

    //Making groups of loops:
    //from extrem to shared point
    //mSegment: gives from this.mArrSegments
    GetLinesFromStart ( mSegment: mSegment ): mSegment[]
    {

        let mLine = [];
        //Segment index in this.mIndexBoxes
        let mIndex = this.SearchSegmentIndex( mSegment.PointA, mSegment.PointB );

        //nSource flag marked in next 2 steps
        if ( this.mIndexBoxes[ mIndex.i ].wordArray[ mIndex.j ].mSegmentsArray[ mIndex.q ].nSource == true )
        {
            return;
        }

        if ( this.mIndexBoxes[ mIndex.i ].wordArray[ mIndex.j ].mSegmentsArray[ mIndex.q ].mFlag3 == true )
        {
            return;
        }


        //Adding to mLine a single segment
        mLine.push( this.ReplySegment( mSegment ) );

        //Flaggin to avoid to back// mark nSource as true the back and go
        this.MarkFlag1AsReadedByPointsNames( mSegment.PointA, mSegment.PointB );

        //Adding segment PointB GO
        mLine = this.DoLoop( mLine );

        //Reversing
        mLine = this.ReverseLine( mLine );

        //Adding segment PointB reverse   
        mLine = this.DoLoop( mLine );

        return mLine;


    }




    getCorners (): void
    {
        let mCorners = [];

        for ( let i = 0; i < this.mIndexBoxes.length; i++ )
        {
            for ( let j = 0; j < this.mIndexBoxes[ i ].wordArray.length; j++ )
            {
                for ( let k = 0; k < this.mIndexBoxes[ i ].wordArray[ j ].mSegmentsArray.length; k++ )
                {

                    let mLenght = this.SearchChildIndexesForSegment( this.mIndexBoxes[ i ].wordArray[ j ].mSegmentsArray[ k ] );
                    if ( mLenght.length == 1 )
                        mCorners.push( this.ReplySegment( this.mIndexBoxes[ i ].wordArray[ j ].mSegmentsArray[ k ] ) )
                }
            }
        }
    }



    //COnvert all the segemnts in a reduced group of them
    Process_1 (): void
    {

        //this.firstResults = [];
        this.mCounter01 = 0;

        let mCorners = [];
        ///Starting with the no cornered points
        for ( let i = 0; i < this.mIndexBoxes.length; i++ )
        {
            for ( let j = 0; j < this.mIndexBoxes[ i ].wordArray.length; j++ )
            {
                for ( let k = 0; k < this.mIndexBoxes[ i ].wordArray[ j ].mSegmentsArray.length; k++ )
                {
                    let mLenght = this.SearchChildIndexesForSegment( this.mIndexBoxes[ i ].wordArray[ j ].mSegmentsArray[ k ] );
                    if ( mLenght.length == 0 )
                        this.RunOnSegment( this.ReplySegment( this.mIndexBoxes[ i ].wordArray[ j ].mSegmentsArray[ k ] ) )
                }
            }
        }


        for ( let i = 0; i < this.mIndexBoxes.length; i++ )
        {
            for ( let j = 0; j < this.mIndexBoxes[ i ].wordArray.length; j++ )
            {
                for ( let k = 0; k < this.mIndexBoxes[ i ].wordArray[ j ].mSegmentsArray.length; k++ )
                {

                    let mLenght = this.SearchChildIndexesForSegment( this.mIndexBoxes[ i ].wordArray[ j ].mSegmentsArray[ k ] );
                    if ( mLenght.length != 0 )
                        this.RunOnSegment( this.ReplySegment( this.mIndexBoxes[ i ].wordArray[ j ].mSegmentsArray[ k ] ) )
                }
            }
        }



    }


    RunOnSegment ( mSegment: mSegment ): void
    {

        let mLine = this.GetLinesFromStart( mSegment );

        if ( mLine != null )
        {

            let mLineDatas: clsLineDatas = this.getLineDatas( mLine );
            /////////////////

            this.mCounter01++;
            this.firstResults.push(
                new mSegmentGroups(
                    this.OrderSegemtList( this.ReplyLine( mLine ), mLine[ 0 ].PointA, mLine[ 0 ].PointB ),
                    mLine[ 0 ].PointA,
                    mLine[ mLine.length - 1 ].PointB,
                    mLineDatas.closeVector, //distance
                    mLineDatas.perimeter, //distance
                    mLine.length,
                    this.mCounter01,
                    mLineDatas.files
                )
            );
        }





    }





    ////////////////////////////

    //Search segment in this.mIndexBoxes.
    //Return array of childs segments.
    //Delete the just getted child
    //Flag1: Getted first time.
    SearchChildIndexesForSegment ( mSegment ): mSegmentIndex[]
    {

        let PointA = mSegment.PointA;
        let PointB = mSegment.PointB;

        //Get the indexed to a wiki search
        let mIndexB = this.GetFirstNumAndLastWord( PointB )
        let mSearchResults = [];
        //Flags to break and to advises.
        let break1 = false;
        let break3 = false;

        //looping all the class.
        for ( let i = 0; i < this.mIndexBoxes.length; i++ )
        {
            //Getting the first index: the first number.
            if ( this.mIndexBoxes[ i ].num == mIndexB[ 0 ] )
            {
                break1 = true;
                let break2 = false;
                //Searching on the selected number index.
                for ( let j = 0; j < this.mIndexBoxes[ i ].wordArray.length; j++ )
                {
                    //Getting the second index: the last word.
                    if ( this.mIndexBoxes[ i ].wordArray[ j ].word == mIndexB[ 1 ] )
                    {
                        break2 = true;
                        break3 = false;
                        //Searching into the 2 indexes the segment that continue with the current segment
                        for ( let q = 0; q < this.mIndexBoxes[ i ].wordArray[ j ].mSegmentsArray.length; q++ )
                        {

                            //The just getted segments was nulled to be further deleted from list
                            if ( this.mIndexBoxes[ i ].wordArray[ j ].mSegmentsArray[ q ] == null )
                                continue;
                            //Bingo! we found a child or partner
                            if ( this.mIndexBoxes[ i ].wordArray[ j ].mSegmentsArray[ q ].PointA == PointB )
                            {
                                //Flaging we just found.
                                break3 = true;

                                //Avoiding to bring as partner the same segment
                                if ( this.bSameSegmentOrContained(
                                    this.mIndexBoxes[ i ].wordArray[ j ].mSegmentsArray[ q ],
                                    mSegment
                                ) ) continue;


                                if ( !this.BelongToList( mSearchResults, i, j, q ) )
                                    mSearchResults.push( new mSegmentIndex( i, j, q ) );

                            }
                        }
                        if ( break3 )
                            break;
                    }
                    if ( break2 )
                        break;
                }
            }
            if ( break1 )
                break;
        }
        if ( break3 )
        {

            if ( mSearchResults.length == 0 )
                return [];

            return mSearchResults;

        }
        return [];

    }








    ////////////////////////////




    BelongToList ( mSearchResults: mSegmentIndex[], i: number, j: number, q: number ): boolean
    {
        for ( let k = 0; k < mSearchResults.length; k++ )
        {
            let mSegmentList = this.mIndexBoxes[ mSearchResults[ k ].i ].wordArray[ mSearchResults[ k ].j ].mSegmentsArray[ mSearchResults[ k ].q ];
            let mCandidat = this.mIndexBoxes[ i ].wordArray[ j ].mSegmentsArray[ q ];

            if ( this.bSameSegment( mSegmentList, mCandidat ) )
                return true;
        }
        return false;
    }



    //Get a index of a self segemnt (not a child).
    SearchSegmentIndex ( PointA, PointB )
    {

        //Get the indexed to a wiki search
        let mIndexA = this.GetFirstNumAndLastWord( PointA )
        let mSearchResults = [];
        //Flags to break and to advises.
        let break1 = false;
        let break3 = false;

        //looping all the class.
        for ( let i = 0; i < this.mIndexBoxes.length; i++ )
        {
            //Getting the first index: the first number.
            if ( this.mIndexBoxes[ i ].num === mIndexA[ 0 ] )
            {
                break1 = true;
                let break2 = false;
                //Searching on the selected number index.
                for ( let j = 0; j < this.mIndexBoxes[ i ].wordArray.length; j++ )
                {
                    //Getting the second index: the last word.
                    if ( this.mIndexBoxes[ i ].wordArray[ j ].word == mIndexA[ 1 ] )
                    {
                        break2 = true;
                        break3 = false;
                        //Searching into the 2 indexes the segment that continue with the current segment
                        for ( let q = 0; q < this.mIndexBoxes[ i ].wordArray[ j ].mSegmentsArray.length; q++ )
                        {

                            //The just getted segments was nulled to be further deleted from list
                            if ( this.mIndexBoxes[ i ].wordArray[ j ].mSegmentsArray[ q ] == null )
                                continue;
                            //Bingo! we found a child or partner

                            //Avoiding to bring as partner the same segment
                            if ( this.mIndexBoxes[ i ].wordArray[ j ].mSegmentsArray[ q ].PointA === PointA &&
                                this.mIndexBoxes[ i ].wordArray[ j ].mSegmentsArray[ q ].PointB === PointB )
                            {
                                return new mSegmentIndex( i, j, q );
                            }
                        }
                        if ( break3 )
                            break;
                    }
                    if ( break2 )
                        break;
                }
            }
            if ( break1 )
                break;
        }
        if ( break3 )
        {
            return null;

            return null;
        }

        return null;
    }




    getLineDatas ( mLine: mSegment[] ): clsLineDatas
    {


        let Perimeter: number = 0;
        let HeighDifference: number = 0;
        let File = [];
        let mAllLenght = 0;
        for ( let i = 0; i < mLine.length; i++ )
        {
            try
            {
                Perimeter += mLine[ i ].Distance;
            } catch ( Error ) { }
            try
            {
                HeighDifference += mLine[ i ].HeighDifference;
            } catch ( Error ) { }

            if ( File.findIndex( res => res == mLine[ i ].FileName ) == -1 )
                File.push( mLine[ i ].FileName );


            if ( mLine[ i ].lstSegment.length == 0 )
                mAllLenght++;
            else
                mAllLenght += mLine[ i ].lstSegment.length;
        }



        //let mRet = [];
        //mRet.push( HeighDifference );
        //mRet.push( Perimeter );
        // mRet.push( File.join() );
        //mRet.push( mAllLenght );

        return new clsLineDatas( HeighDifference, Perimeter, File.join(), mAllLenght );

    }






    ///result[0] : Distance;result[1] : mSegment.HeighDifference
    getGroupLineDatas ( mGroupLines ): clsLineDatas
    {

        var Distance = 0;
        let HeighDifference = 0;
        let File = [];

        for ( var i = 0; i < mGroupLines.length; i++ )
        {
            let res: clsLineDatas = this.getLineDatas( mGroupLines[ i ] );
            Distance += res.perimeter;
            HeighDifference += res.closeVector;
            File.push( res.files );
        }
        return new clsLineDatas( HeighDifference, Distance, File.join(), null )

    }



    testMe: string[] = [];
    pushPush ( mVar: string ): void
    {

        this.testMe.push( mVar );
    }

    otra ()
    {
        this.pushPush( 'eeee' );
    }

    m_Main_Step1 ( mService: mSelectedAndAll ): mSegmentGroups[]
    {
        //Putting sides in a simple list from data as welcome at lobby.
        //At: : mLinesLoops_01.mArrSegments
        this.PushSidesInList( mService );

        this.PushSegmentsToList();
        //Creating segments by group to simplify the loops and lines searches
        //mLinesLoops_01.firstResults: results of all step1 calculations
        this.Process_1();

        //Final result of step one: segments as groups.
        return this.firstResults;
    }
}










export class mSegment
{
    Distance: number;
    HeighDifference: number
    PointA: string;
    PointB: string;
    FileName: string;
    //Order from server
    Order: number;
    CoordX: number;
    CoordY: number;
    CoordZ: number;
    nSource: any;
    bReaded_1: any;
    mFlag3: any;
    mFlag4: any;
    mFlag5: any;
    lstSegment: mSegment[];
    clsSecundDatas: any;

    public constructor ( PointA: string, PointB: string, HeighDifference: number, Distance: number, FileName: string, Order: number, CoordX: number, CoordY: number, CoordZ: number, nSource: any, bReaded_1: any, mFlag3: any, mFlag4: any, mFlag5: any, lstSegment: mSegment[], clsSecundDatas: any )
    {
        this.Distance = Distance;
        this.HeighDifference = HeighDifference;
        this.PointA = PointA;
        this.PointB = PointB;
        this.FileName = FileName;
        this.Order = Order;
        this.CoordX = CoordX;
        this.CoordY = CoordY;
        this.CoordZ = CoordZ;
        this.nSource = nSource;
        this.bReaded_1 = bReaded_1;
        this.mFlag3 = mFlag3;
        this.mFlag4 = mFlag4;
        this.mFlag5 = mFlag5;
        this.lstSegment = lstSegment;
        this.clsSecundDatas = clsSecundDatas;

    }



}


export class mSegmentGroups
{

    lstSegment: mSegment[];
    Distance: number;
    HeighDifference: number;
    PointA: string;
    PointB: string;
    mSize: number;
    mOrder: number;
    Files: string;
    clsSecundDatas: any;

    constructor ( lstSegment: mSegment[], PointA: string, PointB: string, HeighDifference: number, Distance: number, mSize: number, mOrder: number, Files: string )
    {
        this.lstSegment = lstSegment;
        this.Distance = Distance;
        this.HeighDifference = HeighDifference;
        this.PointA = PointA;
        this.PointB = PointB;
        this.mSize = mSize;
        this.mOrder = mOrder;
        this.Files = Files;
    }


}
class clsSecundDatas
{
    mAny: any;
    constructor ( mAny: any )
    {
        this.mAny = mAny;
    }
}

export class mSegmentIndex
{
    i: number;
    j: number;
    q: number;

    constructor ( i: number, j: number, q: number )
    {
        this.i = i;
        this.j = j;
        this.q = q;
    }
}




export class mNumBox
{
    num: string;
    wordArray: mWordBox[];

    constructor ( num: string, wordArray: mWordBox[] )
    {
        this.num = num;
        this.wordArray = wordArray;
    }
}

export class mWordBox
{
    word: string;
    mSegmentsArray: mSegment[]
    constructor ( word: string, mSegmentsArray: mSegment[] )
    {
        this.word = word;
        this.mSegmentsArray = mSegmentsArray;
    }
}

export class clsLineDatas
{
    closeVector: number;
    perimeter: number;
    files: string;
    mSize: number;

    constructor (
        closeVector: number,
        perimeter: number,
        files: string,
        mSize: number
    )
    {
        this.closeVector = closeVector;
        this.files = files;
        this.mSize = mSize;
        this.perimeter = perimeter;
    }




}





