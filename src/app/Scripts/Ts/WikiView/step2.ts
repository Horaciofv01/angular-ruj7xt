import { mLinesLoops_01, mSegmentGroups, mSegment, clsLineDatas } from './step1';

export class mLinesLoops_02
{

    //Finnaly class with loops and lines
    mIndexLineBoxes: ObjectTypeBox[] = [];
    //Group by perimeter in proportion to:
    IndexforPerimeter: number = 100;
    //Group by hrigh diference in proportion to:
    IndexForHeightDiff: number = 10;
    //Group bysegment number in proportion to:
    indexForNumSegment: number = 1;
    secondResults: [];
    mCounter01: number = 0;
    //Group of segments that be analized to get lines and loops
    Lines: mSegment[][] = [];
    orderStored: number = 0;
    mLinesLoops_01: mLinesLoops_01;

    //firstResults: comes from step1 in a external main method.
    constructor ( firstResults: mSegmentGroups[] )
    {
        this.mLinesLoops_01 = new mLinesLoops_01();
        //Equalized to the last class
        this.mLinesLoops_01.firstResults = firstResults;
    }

    // Fills the analized object: this.Lines and  this.mLinesLoops_01.mIndexBoxes
    PushSidesInList = function ()
    {


        //var chack = this.mLinesLoops_01.mIndexBoxes;

        for ( let i = 0; i < this.mLinesLoops_01.firstResults.length; i++ )
        {

            let t = this.mLinesLoops_01.firstResults[ i ];

            //Has Loop?
            if ( t.PointA === t.PointB && t.lstSegment.length >= 3 )
            {
                //BINGO!!! Founded a loop
                let mNewLoop = [];
                mNewLoop.push( t );
                this.PushObjectIntoList( mNewLoop, 1 );
            }

            let mNew0 = new mSegment( t.PointA, t.PointB, t.HeighDifference, t.Distance, t.Files, i, 0, 0, 0, 3, false, false, false, false, t.lstSegment, t.clsSecundDatas );
            //mFlag3 => t.mOrder: Order stored at mLinesLoops_01.firstResults to get the original line.
            this.mLinesLoops_01.mArrSegments.push( mNew0 );

            //Add lines segemts as single lines
            let mNew2 = new mSegment( t.PointA, t.PointB, t.HeighDifference, t.Distance, t.Files, i, 0, 0, 0, 3, false, false, false, false, t.lstSegment, t.clsSecundDatas );
            let mArrLines: mSegment[] = [];
            mArrLines.push( mNew2 );
            this.Lines.push( mArrLines );

            //push to Index boxes:
            let mNew1 = new mSegment( t.PointA, t.PointB, t.HeighDifference, t.Distance, t.Files, i, 0, 0, 0, 3, false, false, false, false, t.lstSegment, t.clsSecundDatas );
            this.mLinesLoops_01.InsertOnIndexBoxesIndex_Go_Back( mNew1 )
        }



    }

    //Check for replies by single line in a line array or a line group in a array line groups.
    //false dont push
    bCheckObjectForNotReply = function ( objectIndex: number, mObjectsArray: segmentNumberBox[], mFixObject: mSegment[] ): boolean
    {

        let mObjects = [];
        for ( let i = 0; i < mObjectsArray.length; i++ )
        {
            mObjects.push( mObjectsArray[ i ].ObjectArray[ 0 ] );
        }

        //Case of single lines 
        if ( objectIndex == 0 )
        {
            return this.CheckLineReply( objectIndex, mObjects, mFixObject )
        }
        //Case of single Loops
        if ( objectIndex == 1 )
        {

            return this.CheckLoopReply( objectIndex, mObjects, mFixObject )
        }
        return true;
    }

    CheckLineReply = function ( objectIndex: number, mObjectsArray: mSegment[][], mFixObject: mSegment[] ): boolean
    {
        for ( let i = 0; i < mObjectsArray.length; i++ )
        {
            if ( this.mLinesLoops_01.bIsTheSameLine( mObjectsArray[ i ], mFixObject ) == true )            //no inserta
                return true;
        }
        //si inserta
        return false;
    }
    CheckLoopReply = function ( objectIndex: number, mObjectsArray: mSegment[][], mFixObject: mSegment[] ): boolean
    {
        for ( let i = 0; i < mObjectsArray.length; i++ )
        {
            if ( this.mLinesLoops_01.bIsTheSameLoop( mObjectsArray[ i ], mFixObject ) )
            {
                //no inserta
                return true;
            }
        }
        //si inserta
        return false;
    }
    //Object should be Loop or line.
    PushObjectIntoList = function ( mObject: mSegment[], objectTypeIndex: number ): []
    {
        if ( mObject == null )
            return;


        let mFixedObject: mSegment[] = this.mLinesLoops_01.ReplyLine( mObject );

        //Quit not cornered lines
        if ( objectTypeIndex == 0 )
        {
            if ( !this.mLinesLoops_01.isCorneredLine( mFixedObject ) )
            {
                return [];
            }
        }



        if ( objectTypeIndex == 1 )
        {
            mFixedObject = this.mLinesLoops_01.ReplyLine( this.CutTaleToLoop( mFixedObject ) );
        }

        let mDatas: clsLineDatas;
        //0: Line; 1 : Loop (singles)
        if ( objectTypeIndex == 0 || objectTypeIndex == 1 )
            mDatas = this.mLinesLoops_01.getLineDatas( mFixedObject );

        //1: Lines Group; 2 : Loops Group (singles)
        if ( objectTypeIndex == 2 || objectTypeIndex == 3 )
            mDatas = this.mLinesLoops_01.getGroupLineDatas( mFixedObject );

        let objectIndex = this.AddObjectByType( objectTypeIndex );

        //Getting the index by peimeter for insrt or add to a list
        let mPerimIndex = this.CheckOrAddPerimIndex( mDatas.perimeter, objectIndex );

        //Getting the Height difference by peimeter for insrt or add to a list
        let mHeightDiffIndex = this.CheckOrAddHeightDiffIndex( mDatas.closeVector, mPerimIndex, objectIndex );

        return this.CheckOrAddSegmentNumIndex( ( mFixedObject.length ), mHeightDiffIndex, mPerimIndex, objectIndex, mFixedObject );
    }

    AddObjectByType = function ( objectTypeIndex: number ): number
    {
        for ( let i = 0; i < this.mIndexLineBoxes.length; i++ )
        {
            if ( this.mIndexLineBoxes[ i ].objectTypeIndex == objectTypeIndex )
                return i;
        }

        this.mIndexLineBoxes.push( new ObjectTypeBox( objectTypeIndex, [] ) );
        return ( this.mIndexLineBoxes.length - 1 );
    }

    CheckOrAddPerimIndex = function ( mIndex: string, objectTypeIndex: number ): number
    {
        let mPerimIndex = Math.floor( Math.abs( parseFloat( mIndex ) / this.IndexforPerimeter ) );

        for ( let i = 0; i < this.mIndexLineBoxes[ objectTypeIndex ].objectBoxArray.length; i++ )
        {
            if ( this.mIndexLineBoxes[ objectTypeIndex ].objectBoxArray[ i ].perimeterIndex == mPerimIndex )
                return i;
        }
        //Adding a new index to BOX
        this.mIndexLineBoxes[ objectTypeIndex ].objectBoxArray.push( new PerimeterBox( mPerimIndex, [] ) );
        return ( this.mIndexLineBoxes[ objectTypeIndex ].objectBoxArray.length - 1 );
    }

    CheckOrAddHeightDiffIndex = function ( mValue: string, mPerimIndex: number, objectIndex: number ): number
    {

        let mHeighDifIndex = Math.floor( Math.abs( parseFloat( mValue ) / this.IndexForHeightDiff ) );

        for ( let i = 0; i < this.mIndexLineBoxes[ objectIndex ].objectBoxArray[ mPerimIndex ].HeighDiffBoxIndexArray.length; i++ )
        {
            if ( this.mIndexLineBoxes[ objectIndex ].objectBoxArray[ mPerimIndex ].HeighDiffBoxIndexArray[ i ].heighDiffIndex == mHeighDifIndex )
                return i;
        }
        //Adding a new index to BOX
        this.mIndexLineBoxes[ objectIndex ].objectBoxArray[ mPerimIndex ].HeighDiffBoxIndexArray.push( new HeighDiffBox( mHeighDifIndex, [] ) );
        return ( this.mIndexLineBoxes[ objectIndex ].objectBoxArray[ mPerimIndex ].HeighDiffBoxIndexArray.length - 1 );
    }

    //last step before to insert a new line.
    CheckOrAddSegmentNumIndex = function ( mIndex: string, mHeightDiffIndex: number, mPerimIndex: number, objectIndex: number, mObject: mSegment[] ): object[]
    {
        //The return data: index 0: the current index just added or eistent line. Index 1: true:the object already exists and not has added,
        let mResult = [];

        let mFixObject = [];

        //Separate cases Line/loop: types 0/1 or lineGroups or loopsgroups 2/3
        //Single line or loops case.
        if ( objectIndex == 0 || objectIndex == 1 )
        {
            for ( let i = 0; i < mObject.length; i++ )
            {
                mObject[ i ].lstSegment = this.mLinesLoops_01.OrderSegemtList( mObject[ i ].lstSegment, mObject[ i ].PointA, mObject[ i ].PointB );
            }
            mFixObject.push( this.mLinesLoops_01.ReplyLine( mObject ) );
        }
        //Groups line or loops case.
        if ( objectIndex == 2 || objectIndex == 3 )
        {
            for ( let i = 0; i < mObject.length; i++ )
            {
                mFixObject.push( this.mLinesLoops_01.ReplyLine( mObject[ i ] ) );
            }
        }
        //in singles: segments group.
        //in groups: Line groups
        let mSegementNumDifIndex = Math.floor( parseFloat( mIndex ) / this.indexForNumSegment );

        for ( let i = 0; i < this.mIndexLineBoxes[ objectIndex ].objectBoxArray[ mPerimIndex ].HeighDiffBoxIndexArray[ mHeightDiffIndex ].length; i++ )
        {

            if ( this.mIndexLineBoxes[ objectIndex ].objectBoxArray[ mPerimIndex ].HeighDiffBoxIndexArray[ mHeightDiffIndex ].segmentIndexArray[ i ].segmentIndex == mSegementNumDifIndex )
            {

                let mObjectsArray1 = this.mIndexLineBoxes[ objectIndex ].objectBoxArray[ mPerimIndex ].HeighDiffBoxIndexArray[ mHeightDiffIndex ].segmentIndexArray;

                //Case of replied object: Dont to push.
                if ( !this.bCheckObjectForNotReply( this.mIndexLineBoxes[ objectIndex ].objectTypeIndex, mObjectsArray1, mObject ) )
                {
                    mResult = [];
                    mResult.push( i );
                    //Not added cause already exists
                    mResult.push( true );
                    return mResult;
                }

                this.mIndexLineBoxes[ objectIndex ].objectBoxArray[ mPerimIndex ].HeighDiffBoxIndexArray[ mHeightDiffIndex ].segmentIndexArray.push( new this.segmentNumberBox( mSegementNumDifIndex, mFixObject ) );
                mResult = [];
                mResult.push( i );
                //added cause already not exists
                mResult.push( false );
                return mResult;
            }
        }

        //Viewing by separate the arraylist where the loops line must to be added.
        let mObjectsArray2 = this.mIndexLineBoxes[ objectIndex ].objectBoxArray[ mPerimIndex ].HeighDiffBoxIndexArray[ mHeightDiffIndex ].segmentIndexArray;

        if ( !this.bCheckObjectForNotReply( this.mIndexLineBoxes[ objectIndex ].objectTypeIndex, mObjectsArray2, mObject ) )
        {
            //BINGO!!! Adding action to ARRAYLIST as finnaly
            this.mIndexLineBoxes[ objectIndex ].objectBoxArray[ mPerimIndex ].HeighDiffBoxIndexArray[ mHeightDiffIndex ].segmentIndexArray.push( new segmentNumberBox( mSegementNumDifIndex, mFixObject ) );

            //Adding a new indes next of a insert
            mResult.push( this.mIndexLineBoxes[ objectIndex ].objectBoxArray[ mPerimIndex ].HeighDiffBoxIndexArray[ mHeightDiffIndex ].segmentIndexArray.length - 1 );
            mResult = [];
            //added cause already not exists
            mResult.push( false );
            return mResult;
        }

        mResult = [];
        mResult.push( this.mIndexLineBoxes[ objectIndex ].objectBoxArray[ mPerimIndex ].HeighDiffBoxIndexArray[ mHeightDiffIndex ].segmentIndexArray.length - 1 );
        //not added cause already exists
        mResult.push( true );
        return mResult;
    }


    //Adding and multiply the lines
    AddSegmentToPointB = function ( mLine: mSegment[] ): mSegment[]
    {
        let mSegment = mLine[ mLine.length - 1 ];

        //Children left array
        let mChildsIndex = this.mLinesLoops_01.SearchChildIndexesForSegment( mSegment );

        //no childs
        if ( mChildsIndex == null )
        {
            mChildsIndex = [];
        }
        //new array that ve added the current line and and all he's childs
        let mReturn = []
        let mAddsCounted = 0;

        for ( let i = 0; i < mChildsIndex.length; i++ )
        {

            //Reply the segment
            let newSegment = this.mLinesLoops_01.ReplySegment( this.mLinesLoops_01.mIndexBoxes[ mChildsIndex[ i ].i ].wordArray[ mChildsIndex[ i ].j ].mSegmentsArray[ mChildsIndex[ i ].q ] );
            let newSegment1 = this.mLinesLoops_01.ReplySegment( newSegment );


            //Reply the line
            let mReplyLine = this.mLinesLoops_01.ReplyLine( mLine );
            let mReplyLine1 = this.mLinesLoops_01.ReplyLine( mReplyLine );

            //if a segment is just contained: the line loops
            //if ( this.mLinesLoops_01.bSegmentJustContained( mReplyLine, newSegment ) )
            if ( this.mLinesLoops_01.bLineJustContainPoint( mReplyLine, newSegment ) )           
            {
                if ( !this.mLinesLoops_01.bSegmentJustContained( mReplyLine, newSegment ) )
                    mReplyLine.push( newSegment );

                //BINGO!... FOUNDED A LOOP
                //mReplyLine.push(newSegment);
                if ( this.mLinesLoops_01.getSegmentTotalLength( mReplyLine ) <= 2 )
                    continue;

                //Adding a new loop to a list: further the tale ill be cutting
                this.PushObjectIntoList( mReplyLine, 1 )
                //Adding the total line
                this.PushObjectIntoList( this.AvoidLineToBackToSelf( mReplyLine ), 0 );

            }
            else
            {
                //push a lonelly child.
                mReplyLine1.push( newSegment1 );
                mAddsCounted++;
                //push the line with a new child into a return array
                mReturn.push( mReplyLine1 )
            }
        }
        return mReturn;
    }

    //Avoid to touch the last point when fomed a 9.
    AvoidLineToBackToSelf = function ( mLine: mSegment[] )
    {
        let mReplyLine: mSegment[] = this.mLinesLoops_01.ReplyLine( mLine );
        //return mReplyLine;






        ///Must to create a peace of sub line.

        if ( this.CountHwManyPoints( mLine, mLine[ 0 ].lstSegment[ 0 ].PointA ) === 3 )
        {

            mReplyLine.shift();

            let mNewQueta: mSegment[] = [];




            for ( let i = mLine[ 0 ].lstSegment.length; i >= 1; i-- )
            {
                if ( mLine[ 0 ].lstSegment[ i ] == undefined )
                {
                    continue;
                }


                let mSegment1: mSegment = this.mLinesLoops_01.ReplySegment( mLine[ 0 ].lstSegment[ i ] );
                mSegment1.lstSegment = [];
                mSegment1.lstSegment.push( this.mLinesLoops_01.ReplySegment( mLine[ 0 ].lstSegment[ i ] ) )
                mReplyLine.unshift( mSegment1 );
            }

            //mNewQueta = mNewQueta.reverse();




        }

        let mTempo: mSegment = mLine[ mLine.length - 1 ].lstSegment[ mLine[ mLine.length - 1 ].lstSegment.length - 1 ];
        if ( this.CountHwManyPoints( mLine, mTempo.PointB ) === 3 )
        {

            mReplyLine.pop();

            let mNewQueta: mSegment[] = [];

            for ( let i = 0; i < mLine[ mLine.length - 1 ].lstSegment.length - 1; i++ )
            {

                let mSegment1: mSegment = this.mLinesLoops_01.ReplySegment( mLine[ mLine.length - 1 ].lstSegment[ i ] );
                mSegment1.lstSegment = [];
                mSegment1.lstSegment.push( this.mLinesLoops_01.ReplySegment( mLine[ mLine.length - 1 ].lstSegment[ i ] ) )


                mReplyLine.push( mSegment1 );
            }



        }

        return mReplyLine;
    }

    CountHwManyPoints ( mLine: mSegment[], mPoint: string ): number
    {
        let mCounter = 0;
        for ( let i = 0; i < mLine.length; i++ )
        {
            for ( let j = 0; j < mLine[ i ].lstSegment.length; j++ )
            {
                if ( mLine[ i ].lstSegment[ j ].PointA === mPoint )
                    mCounter++;

                if ( mLine[ i ].lstSegment[ j ].PointB === mPoint )
                    mCounter++;

            }

        }

        return mCounter;
    }



    //Push Quit the not loops containing segements to avoid a "9" and get a "0"
    CutTaleToLoop_01 = function ( mLine: mSegment[], newSegment: mSegment ): mSegment[]
    {
        let mresult = [];

        //Copy the line to avoid references changes
        let mReplyLine: mSegment[] = this.mLinesLoops_01.ReplyLine( mLine );
        if ( mLine[ mLine.length - 1 ].PointB == newSegment.PointA )
        {
            mReplyLine.push( newSegment );
        }
        //Adding a new segment to the reply line
        else mReplyLine.push( this.mLinesLoops_01.ReverseSegment( newSegment ) )

        for ( let i = mReplyLine.length - 1; i >= 0; i-- )
        {
            if ( i < mLine.length - 1 )
            {
                if ( this.mLinesLoops_01.bSameSegment( newSegment, mLine[ i ] ) )
                {
                    if ( mresult[ 0 ].PointA == mresult[ mresult.length - 1 ].PointB )
                        return mresult;

                    if ( mresult[ 1 ].PointA == mresult[ mresult.length - 1 ].PointB )
                    {
                        mresult.splice( 0, 1 );
                        return mresult;
                    }
                }
            }
            mresult.push( this.mLinesLoops_01.ReverseSegment( mReplyLine[ i ] ) );
        }
        return null;
    }



    CutTaleToLoop = function ( mLine: mSegment[] ): mSegment[]
    {

        //Case of  not tale
        if ( mLine[ 0 ].PointA === mLine[ mLine.length - 1 ].PointB )
            return mLine;


        //Check the first segment has patner on point A into a loop
        //yes: Quit it!
        //999999: pseudo recursion.
        for ( let i = 0; i < 999999; i++ )
        {
            if ( this.QuitOneSegmentAsTale( mLine ) === false )
                break;
        }

        return mLine;

    }

    QuitOneSegmentAsTale = function ( mLine: mSegment[] ): boolean
    {
        let hasQuited: boolean = false;
        for ( let i = 0; i < mLine.length; i++ )
        {
            if ( this.GetLoopPartnerQtty( mLine, mLine[ i ].PointA ) == 1 )
            {
                mLine.splice( i, 1 );
                return true;
            }
        }
        for ( let i = 0; i < mLine.length; i++ )
        {
            if ( this.GetLoopPartnerQtty( mLine, mLine[ i ].PointB ) == 1 )
            {
                mLine.splice( i, 1 );
                return true;
            }
        }

        return false;

    }

    //Need to be = 2 one as A second as B to by a loop partner
    //if = 1: the segment must to be deleted its a tale
    GetLoopPartnerQtty ( mLine: mSegment[], mPoint: string ): number
    {

        let mQtty: number = 0;

        for ( let i = 0; i < mLine.length; i++ )
        {
            if ( mPoint === mLine[ i ].PointA || mPoint === mLine[ i ].PointB )
                mQtty++;
        }
        return mQtty

    }

    DoLoop = function (): mSegment[][]
    {

        let noChildsAtB: mSegment[][] = [];
        let Counts: number = 0;
        //Pseudo recursion
        for ( let i = 0; i < 9999999; i++ )
        {////NEED TO BE 9999999

            Counts++;
            //Exit when all the lines hasnt child at the point b
            if ( this.Lines.length == 0 )
            {
                break;
            }

            //Reply the first line.
            let mLine = this.mLinesLoops_01.ReplyLine( this.Lines[ 0 ] );

            this.Lines.splice( 0, 1 );



            let bIsIllia: boolean = true;
            if ( bIsIllia )
            {
                if ( this.Lines.length > 40 )//Max Rank
                {
                    continue;
                }
                if ( this.getDistance( mLine ) > 400000 && this.Lines.length > 20 )//Max Rank
                {
                    continue;
                }
            }
            else
            {
                if ( this.Lines.length > 50 )//Max Rank
                {
                    continue;
                }
                if ( this.getDistance( mLine ) > 250000 )//Max Rank
                {
                    continue;
                }
            }



            if ( this.Lines.length > 50 )//Max Rank
            {
                continue;
            }
            if ( this.getDistance( mLine ) > 250000 )//Max Rank
            {
                continue;
            }


            //Deleteing the first line

            //Get array whit the childerd lines
            let mChildLines = this.AddSegmentToPointB( mLine );

            //No childs...
            if ( mChildLines.length == 0 )
            {
                Counts++;
                if ( Counts > 200 )
                    return noChildsAtB;
                //The finnaly result of a method.
                //Rversed to be further added childs to point a.
                noChildsAtB.push( this.mLinesLoops_01.ReplyLine( mLine ) );
            }
            else
            {
                //Adding just added childs lines.
                for ( let i = 0; i < mChildLines.length; i++ )
                {
                    this.Lines.unshift( this.mLinesLoops_01.ReplyLine( mChildLines[ i ] ) )

                }
            }

        } //end loop 9999999

        return noChildsAtB;

    }
    getDistance ( mLine: mSegment[] )
    {
        let mDistance: number = 0;
        for ( let i = 0; i < mLine.length; i++ )
            for ( let j = 0; j < mLine[ i ].lstSegment.length; j++ )
                mDistance += mLine[ i ].lstSegment[ j ].Distance;

        return mDistance;
    }

    GetLinesFromStart = function ()
    {

        //Adding segments to the left

        let noChildsAtB: mSegment[][] = this.DoLoop();

        //this.Lines=[]NOOO
        //Adding reverse line to add childs at the other side.
        for ( let i = 0; i < noChildsAtB.length; i++ )
        {

            let reverse = this.mLinesLoops_01.ReverseLine( noChildsAtB[ i ] );
            this.Lines.unshift( reverse );
        }
        /////this.mIndexLineBoxes[0].objectBoxArray = [];?????
        noChildsAtB = this.DoLoop();

        if ( this.Lines.length == 0 )
        {
            ////////$("#startButton").css('display', 'none');
            ///////$('#endButtonGif').css('display', 'none');
            ////////$("#endButton").css('display', 'none');
            //////$("#Div1Lenght").html('');
            ////////clearInterval(mUi.mTimeout);
            ///////this.InsertBackgroundLines();
        } else
        {
            ////////////// $("#Div1Lenght").html("סיום ב0: " + this.Lines.length);
        }

        return noChildsAtB;
    }

    //Adding results to this.mIndexLineBoxes (the finnaly result)
    AddToClass = function ()
    {    ////Adding lines



        for ( let i = 0; i < this.secondResults.length; i++ )
        {

            this.PushObjectIntoList( this.secondResults[ i ], 0 );
        }
    }

    //Fixes to show:
    //1- Putting the index by order.
    FixResults = function ()
    {
        //1- Putting the index by order.
        for ( let i = 0; i < this.mIndexLineBoxes.length; i++ )
        {

            for ( let j = 0; j < this.mIndexLineBoxes[ i ].objectBoxArray.length; j++ )
            {
                this.mIndexLineBoxes[ i ].objectBoxArray[ j ].HeighDiffBoxIndexArray = this.mIndexLineBoxes[ i ].objectBoxArray[ j ].HeighDiffBoxIndexArray.sort( function ( a, b ) { return a.heighDiffIndex - b.heighDiffIndex } );

                for ( let q = 0; q < this.mIndexLineBoxes[ i ].objectBoxArray[ j ].HeighDiffBoxIndexArray.length; q++ )
                {
                    this.mIndexLineBoxes[ i ].objectBoxArray[ j ].HeighDiffBoxIndexArray[ q ].segmentIndexArray = this.mIndexLineBoxes[ i ].objectBoxArray[ j ].HeighDiffBoxIndexArray[ q ].segmentIndexArray.sort( function ( a, b ) { return a.segmentNumber - b.segmentNumber } );
                }
            }
            this.mIndexLineBoxes[ i ].objectBoxArray = this.mIndexLineBoxes[ i ].objectBoxArray.sort( function ( a, b ) { return a.perimeterIndex - b.perimeterIndex } );

        }
    }



    Process_1 = function ()
    {
        this.firstResults = [];
        this.mCounter01 = 0;
        for ( let i = 0; i < this.mLinesLoops_01.mArrSegments.length; i++ )
        {

            let mLine = this.mLinesLoops_01.GetLinesFromStart( this.mLinesLoops_01.mArrSegments[ i ] );
            if ( mLine != null )
            {

                this.mCounter01++;
                this.firstResults.push(
                    new this.mLinesLoops_01.mSegmentGroups( this.mLinesLoops_01.ReplyLine( mLine ),
                        mLine[ 0 ].PointA,
                        mLine[ mLine.length - 1 ].PointB,
                        0,
                        0,
                        mLine.length,
                        this.mLinesLoops_01.mCounter01 )
                );
            }
        }
    }

    HasPoint = function ( mLine: mSegment[][], PointName: string ): boolean
    {
        for ( let i = 0; i < mLine.length; i++ )
        {
            for ( let j = 0; j < mLine[ i ].length; j++ )
            {
                if ( mLine[ i ][ j ].PointA == PointName || mLine[ i ][ j ].PointB == PointName )
                    return true;
            }
        }

        for ( let i = 0; i < mLine.length; i++ )
        {
            for ( let j = 0; j < mLine[ i ].length; j++ )
            {
                for ( let q = 0; q < mLine[ i ][ j ].lstSegment.length; q++ )
                {
                    if ( mLine[ i ][ j ].lstSegment[ i ].PointA == PointName || mLine[ i ][ j ].lstSegment[ i ].PointA == PointName )
                        return true;
                }
            }
        }



        return false;
    }


    //isFirst: if not is a continue to calculating more results
    m_Main_Step2 = function ( isFirst: boolean ): ObjectTypeBox[]
    {

        // Fills the analized object: this.Lines and  this.mLinesLoops_01.mIndexBoxes
        if ( isFirst )
            this.PushSidesInList();


        //with function doloop.
        this.secondResults = this.GetLinesFromStart();

        //Adding results to this.mIndexLineBoxes (the finnaly result)
        this.AddToClass( this.secondResults );

        //Sort the list
        this.FixResults();

        return this.mIndexLineBoxes;

    }
}


export class ObjectTypeBox
{

    objectTypeIndex: number;
    objectBoxArray: PerimeterBox[]
    constructor ( objectTypeIndex: number, objectBoxArray: PerimeterBox[] )
    {

        this.objectTypeIndex = objectTypeIndex;
        this.objectBoxArray = objectBoxArray;

    }
}

//First box: Perimeter (Math Flour 100);
export class PerimeterBox
{
    perimeterIndex: number;
    HeighDiffBoxIndexArray: HeighDiffBox[];

    constructor ( perimeterIndex: number, HeighDiffBoxIndexArray: HeighDiffBox[] )
    {
        this.perimeterIndex = perimeterIndex;
        this.HeighDiffBoxIndexArray = HeighDiffBoxIndexArray;
    }
}

//Second Box: Height Difference (Math Flour 10)
export class HeighDiffBox
{

    heighDiffIndex: number;
    segmentIndexArray: segmentNumberBox[];

    constructor ( heighDiffIndex: number, segmentIndexArray: segmentNumberBox[] )
    {
        this.heighDiffIndex = heighDiffIndex;
        this.segmentIndexArray = segmentIndexArray;
    }

}

//Thirt Box: Segement Number
export class segmentNumberBox
{

    segmentIndex: number;
    ObjectArray: mSegment[][];

    constructor ( segmentIndex: number, ObjectArray: mSegment[][] )
    {
        this.segmentIndex = segmentIndex;
        this.ObjectArray = ObjectArray;
    }

}

//////////////////////////END LINE LOOPS BOXES/////////////////
export class mBoxIndex
{

    i: number;
    j: number;
    q: number;
    k: number;
    m: number;
    n: number;
    o: number;


    constructor ( i: number, j: number, q: number, k: number, m: number, n: number, o: number )
    {
        this.i = i;
        this.j = j;
        this.q = q;
        this.m = m;
        this.n = n;
        this.o = o;
    }
}

export class ShowOnFirstTable
{

    mCoordinates: number[];
    mPA: string;
    mPB: string;
    mCloseAt: number;
    mPerimeter: number;
    segmentNum: number;
    mIndex: string;
    mOrder: number;
    mClass: string;
    mArea: number;
    bValid: boolean;
    mSegments: mSegment[];
    uniqueIndex: number

    constructor ( mCoordinates: number[], mPA: string, mPB: string, mCloseAt: number, mPerimeter: number, segmentNum: number, mIndex: string, mOrder: number, mClass: string, mArea: number, bValid: boolean, mSegments: mSegment[], uniqueIndex: number )
    {
        this.mCoordinates = mCoordinates;
        this.mPA = mPA;
        this.mPB = mPB;
        this.mCloseAt = mCloseAt;
        this.mPerimeter = mPerimeter;
        this.segmentNum = segmentNum;
        this.mIndex = mIndex;
        this.mOrder = mOrder;
        this.mClass = mClass;
        this.mArea = mArea;
        this.bValid = bValid;
        this.mSegments = mSegments;
        this.uniqueIndex = uniqueIndex;
    }
}



export class ShowTableAnalisisGral
{
    mOrder: number;
    PA: string;
    PB: string;
    HeighDifByRez: number;
    HeighDifByBangal: number;
    Distance: number;
    Rank: number;
    Tolerance: number;
    BF_FB: number;
    Flag1: boolean;
    Flag2: boolean;
    HeighDifCalculated: number;
    WVector: number;
    AltitudePA: number;
    AltitudePB: number;
    heigBangalA: number;
    heigBangalB: number;

    //selected by screen
    PAValid: boolean;
    PBValid: boolean;
    OCab: number;

    WVectorOriginal: number;
    HeighDifByRezOriginal: number;



    constructor ( mOrder: number, PA: string, PB: string, HeighDifByRez: number,
        HeighDifByBangal: number, Distance: number, Rank: number, Tolerance: number, BF_FB: number,
        Flag1: boolean, Flag2: boolean, HeighDifCalculated: number, WVector: number, AltitudePA: number, AltitudePB: number,
        heigBangalA: number, heigBangalB: number, OCab: number )
    {
        this.PA = PA;
        this.PB = PB;
        this.HeighDifByRez = HeighDifByRez;
        this.HeighDifByBangal = HeighDifByBangal;
        this.Distance = Distance;
        this.Rank = Rank;
        this.Tolerance = Tolerance;
        this.BF_FB = BF_FB;
        this.Flag1 = Flag1;
        this.Flag2 = Flag2;
        this.HeighDifCalculated = HeighDifCalculated;
        this.WVector = WVector;
        this.AltitudePA = AltitudePA;
        this.AltitudePB = AltitudePB;
        this.mOrder = mOrder;
        this.heigBangalA = heigBangalA;
        this.heigBangalB = heigBangalB;
        this.OCab = OCab;
        let mNum: number = this.HeighDifByRez;
        this.HeighDifByRezOriginal = mNum;
    }




}

export class JustSelectedIndex
{
    i: number;
    j: number;
    k: number;
    l: number;
    m: number;
    n: number;
    o: number;

    constructor ( i: number, j: number, k: number, l: number, m: number, n: number, o: number )
    {
        this.i = i;
        this.j = j;
        this.k = k;
        this.l = l;
        this.m = m;
        this.n = n;
        this.o = o;
    }
}













