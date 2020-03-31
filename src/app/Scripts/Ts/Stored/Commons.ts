import { ObjectTypeBox, ShowTableAnalisisGral } from '../WikiView/step2';
import { mSegment, mLinesLoops_01, clsLineDatas } from '../WikiView/step1';
import { typeCsv } from '../../../Balances/Library/m-cesium/Script/MapiCesium';

export class Commons
{

    _x: string = '×';

    constructor () { }


    resumeSegments ( msegment: mSegment[] ): ResumeSegments
    {

        let mlinesLoops_01: mLinesLoops_01 = new mLinesLoops_01();
        let mSeg: mSegment[] = [];
        for ( let i = 0; i < msegment.length; i++ )
        {
            for ( let j = 0; j < msegment[ i ].lstSegment.length; j++ )
            {
                mSeg.push( msegment[ i ].lstSegment[ j ] );
            }
        }
        return new ResumeSegments( mSeg, mlinesLoops_01.getLineDatas( msegment ) );
    }

    getLoops ( mIndexLineBoxes: ObjectTypeBox[] ): ObjectTypeBox
    {
        return mIndexLineBoxes[ mIndexLineBoxes.findIndex( x => x.objectTypeIndex == 1 ) ];
    }
    getLines ( mIndexLineBoxes: ObjectTypeBox[] )
    {
        return mIndexLineBoxes[ mIndexLineBoxes.findIndex( x => x.objectTypeIndex == 0 ) ];
    }

    public CalculateProportions ( mTotalValue: number, mPortions: number[] ): number[]
    {
        let res: number[] = [];

        if ( mPortions.length === 0 )
            return res;

        let mSum: number = mPortions.reduce( ( acc, x ) => acc + x );

        for ( let i = 0; i < mPortions.length; i++ )
            res.push( mPortions[ i ] * mTotalValue / mSum );

        return res;
    }


    space10_Array_DeltaHeight ( mImput: string ): string[]
    {

        //mImput = '123456.78901'


        let mResult: string[] = [];
        let mSign: string = "+";
        let mImputDouble: number;

        if ( mImput == null || mImput == undefined || mImput == '' || parseFloat( mImput ) == NaN )
        {
            for ( let i = 0; i < 12; i++ )
                mResult[ i ] = " ";

            return mResult;
        }

        mImputDouble = parseFloat( mImput );

        if ( mImputDouble < 0 )
            mSign = "-"

        mImputDouble = Math.abs( mImputDouble );

        let mTempo: string = mImputDouble.toFixed( 5 ) + "#";//simbol to replaces





        mTempo = mTempo.replace( ".00000#", ".00" );
        mTempo = mTempo.replace( ".0000#", ".00" );
        mTempo = mTempo.replace( ".000#", ".00" );
        mTempo = mTempo.replace( "00#", " " );


        mTempo = mTempo.replace( "#", " " );

        //Quit the last zeros
        mImputDouble = parseFloat( mImputDouble.toString() );

        if ( mTempo.indexOf( '.' ) == -1 )
            mTempo = "       " + mTempo + ".00          ";
        else mTempo = "       " + mTempo + "          ";

        let mLenght: number = mTempo.split( '.' )[ 0 ].length;

        let mCount: number = 0;
        for ( let i = 5; i >= 0; i-- )
        {
            mResult[ i ] = mTempo.split( '.' )[ 0 ].substring( mLenght - mCount - 1, mLenght - mCount );
            mCount++;
        }

        mResult[ 6 ] = ".";

        for ( let i = 7; i <= 11; i++ )
        {
            if ( i == 15 && mTempo.split( '.' )[ 1 ].substring( i - 7, i - 6 ) !== " " )
            {
                let mNum: number = parseInt( mTempo.split( '.' )[ 1 ].substring( i - 7, i - 6 ) );
                if ( mNum >= 5 )
                    mNum++;
                mResult[ i ] = mNum.toString();
                continue;
            }

            mResult[ i ] = mTempo.split( '.' )[ 1 ].substring( i - 7, i - 6 );
        }
        mResult[ 12 ] = mSign;
        return mResult;

    }


    spaces10_Array ( mImput: string ): string[]
    {
        let mResult: string[] = this.space10_Array_DeltaHeight( mImput );

        if ( ( mResult[ 7 ] === " " ) || ( mResult[ 7 ] === "0" && mResult[ 8 ] === "0" && mResult[ 9 ] === " " ) )
            for ( let i = 6; i <= 11; i++ )
            {
                mResult[ i ] = " ";
            }
        return mResult;


    }


    get10SpacesHtml ( minput: string ): string
    {

        if ( minput == '' || parseFloat( minput ) == NaN )
            return "";

        let mResult: string[] = this.spaces10_Array( minput );

        let mConcat: string = "<div class='spaces10'><div>"
        mConcat = mConcat.concat( '<div><div>' + mResult[ 12 ] + '</div></div>' );

        for ( let i = 0; i <= 5; i++ )
            mConcat = mConcat.concat( '<div><div>' + mResult[ i ] + '</div></div>' );

        mConcat = mConcat.concat( '<div style="width: 5px"><div>.</div></div>' );

        for ( let i = 7; i <= 11; i++ )
            mConcat = mConcat.concat( '<div><div>' + mResult[ i ] + '</div></div>' );

        mConcat = mConcat.concat( '</div></div>' );

        return mConcat;
    }


    GetSegmentFormView ( showTableAnalisisGral: ShowTableAnalisisGral[] ): mSegment[]
    {
        let msegment: mSegment[] = [];
        for ( let i = 0; i < showTableAnalisisGral.length; i++ )
        {
            let tempo: ShowTableAnalisisGral = showTableAnalisisGral[ i ];
            msegment.push( new mSegment( tempo.PA, tempo.PB, tempo.HeighDifByRez, tempo.Distance, null, i, 0, 0, 0, null, null, null, null, null, [], null ) );
        }

        let mlines: mLinesLoops_01 = new mLinesLoops_01();
        let mDatas = mlines.getLineDatas( msegment )
        let mres: mSegment = new mSegment(
            msegment[ 0 ].PointA,
            msegment[ msegment.length - 1 ].PointB,
            mDatas.closeVector,
            mDatas.perimeter,
            mDatas.files,
            null, null, null, null, null, null, null, null, null, msegment, null );

        let mres1: mSegment[] = [];
        mres1.push( mres );
        return mres1;
    }
    ReBuildLoopByKnowedPoint ( msegment: mSegment[], mCsv: typeCsv[] ): mSegment[]
    {
        let mRes: mSegment[] = [];

        let mFlag: boolean = true;
        let i = 0;
        //2 times.
        for ( let mIndex = 0; mIndex < msegment.length * 2; mIndex++ )
        {
            for ( let j = 0; j < msegment[ i ].lstSegment.length; j++ )
            {
                if ( mFlag )
                {
                    let mTempo = mCsv.find( x => x.nam === msegment[ i ].lstSegment[ j ].PointA );
                    if ( mTempo.heiort !== null && mTempo.bValid )
                    {
                        if ( i === 0 && j === 0 )
                            return msegment;

                        mFlag = false;
                    }


                }
                if ( !mFlag )
                {
                    msegment[ i ].lstSegment[ j ].lstSegment = [];
                    mRes.push( msegment[ i ].lstSegment[ j ] );

                    if ( mRes[ 0 ].PointA === mRes[ mRes.length - 1 ].PointB )
                        break;
                }
            }

            i++;
            if ( i >= msegment.length )
                i = 0;



            if ( mRes.length > 0 )
                if ( mRes[ 0 ].PointA === mRes[ mRes.length - 1 ].PointB )
                    break;
        }

        if ( mFlag )
            return msegment;

        let mReturn: mSegment[] = [];

        let mlinesLoops_01: mLinesLoops_01 = new mLinesLoops_01();
        let mData: clsLineDatas = mlinesLoops_01.getLineDatas( mRes );

        mReturn.push( new mSegment(
            mRes[ 0 ].PointA,
            mRes[ mRes.length - 1 ].PointB,
            mData.closeVector,
            mData.perimeter,
            mData.files,
            1, 0, 0, 0, null, null, null, null, null, mRes, null
        ) );


        return mReturn;


    }

}



export class mTitles
{
    id: number;
    mTitle: string;
    mSubTitle: string;

    constructor ( id: number, mTitle: string, mSubTitle: string )
    {
        this.id = id;
        this.mTitle = mTitle;
        this.mSubTitle = mSubTitle;

    }
}



export class mOutputFiles
{
    mCsvGravimetria: string[];
    mRezDatRaw: string[];
    mCsvPointData: string[];
    mRezResult: string[];
    mASC: string[]
    constructor ()
    {
        this.mCsvGravimetria = [];
        this.mRezDatRaw = [];
        this.mCsvPointData = [];
        this.mRezResult = [];
        this.mASC = [];

    }
}



export class Res_content
{
    id: number;
    projectid: number;
    res_id: number;
    point_a: string;
    point_b: string;
    height_difference: number;
    distance: number;
    num_across: number;
    difference_between_bf: number;
    date_measured: Date;
    name_file: string;
    strcomment: string;
    savedby: string;
    constructor () { }
}

export class GravimetryDB
{
    PrjID: number;
    pointName: string;
    _x: number;
    _y: number;
    _z: number;
    _g: number;
    dtime: Date;
    isInterpolated: boolean

    constructor ( PrjID: number, pointName: string, _x: number, _y: number, _z: number, _g: number, dtime: Date, isInterpolated: boolean )
    {
        this.PrjID = PrjID;
        this.pointName = pointName;
        this._x = _x;
        this._y = _y;
        this._z = _z;
        this._g = _g;
        this.dtime = dtime;
        this.isInterpolated = isInterpolated;
    }
}


export class m2Points
{
    PA: string;
    PB: string;
    constructor ( PA: string, PB: string )
    {
        this.PA = PA;
        this.PB = PB;
    }
}

export class Projects
{
    id: number;
    surveyorid: number;
    strdescription: string;
    strcomment: string;
    savecheckyear: Date;
    measurementtypeid: number;
    startmeasuredata: Date;
    endmeasuredata: Date;
    objecttype: number;

    constructor ( id: number, surveyorid: number, strdescription: string, strcomment: string, savecheckyear: Date, measurementtypeid: number, startmeasuredata: Date, endmeasuredata: Date, objecttype: number )
    {
        this.id = id;
        this.surveyorid = surveyorid;
        this.strdescription = strdescription;
        this.strcomment = strcomment;
        this.savecheckyear = savecheckyear;
        this.measurementtypeid = measurementtypeid;
        this.startmeasuredata = startmeasuredata;
        this.endmeasuredata = endmeasuredata;
        this.objecttype = objecttype;
    }
}

export class dbDatas
{
    currentProject: Projects;
    gravimetryDB: GravimetryDB[];
    res_content: Res_content[];

    constructor ( currentProject: Projects, gravimetryDB: GravimetryDB[], res_content: Res_content[] )
    {
        this.currentProject = currentProject;
        this.gravimetryDB = gravimetryDB;
        this.res_content = res_content;
    }
}
export class RezFile
{
    mOrder: number;
    Point_A: string;
    Point_B: string;
    Height_Difference: number;
    Distance: number;
    Num_Across: number;
    Difference_Between_BF: number;
    Date_Measured: string;
    Name_File: string;

    constructor ( mOrder: number, Point_A: string, Point_B: string, Height_Difference, Distance: number, Num_Across: number, Difference_Between_BF: number, Date_Measured: string, Name_File: string )
    {
        this.mOrder = mOrder;
        this.Point_A = Point_A;
        this.Point_B = Point_B;
        this.Height_Difference = Height_Difference;
        this.Distance = Distance;
        this.Num_Across = Num_Across;
        this.Difference_Between_BF = Difference_Between_BF;
        this.Date_Measured = Date_Measured;
        this.Name_File = Name_File;
    }
}

export class mVertices
{
    name: string;
    constructor ( name: string )
    {
        this.name = name;
    }
}

export class mIntIndexes
{
    mIndex1: number;
    mIndex2: number;
    mIndex3: number;
    mIndex4: number;

    constructor ( mIndex1: number, mIndex2: number, mIndex3: number, mIndex4: number )
    {
        this.mIndex1 = mIndex1;
        this.mIndex2 = mIndex2;
        this.mIndex3 = mIndex3;
        this.mIndex4 = mIndex4;
    }

}

export class strKeyValues
{
    mKey1: string;
    mKey2: string;
    mKey3: string;
    mKey4: string;

    constructor ( mKey1: string, mKey2: string, mKey3: string, mKey4: string )
    {
        this.mKey1 = mKey1;
        this.mKey2 = mKey2;
        this.mKey3 = mKey3;
        this.mKey4 = mKey4;
    }

}

export class ResumeSegments
{
    msegment: mSegment[] = [];
    clslineDatas: clsLineDatas;

    constructor ( msegment: mSegment[], clslineDatas: clsLineDatas )
    {
        this.msegment = msegment;
        this.clslineDatas = clslineDatas;
    }

}
















