import { typeCsv } from '../../../Balances/Library/m-cesium/Script/MapiCesium';
import { mVertices, RezFile } from './Commons';


export class HeightCalculation
{

    mTableDelta: TableDeltaHeights[] = [];
    mTableHeight: TablePointHeights[] = [];
    //Methos to get the table with the values

    getVertices ( rezFile: RezFile[] ): mVertices[]
    {
        let mvertices: mVertices[] = [];
        for ( let i = 0; i < rezFile.length; i++ )
        {
            //if ( mvertices.indexOf( x => x === rezFile[ i ].Point_A || x === rezFile[ i ].Point_B ) != -1 )
            if ( mvertices.findIndex( x => x.name === rezFile[ i ].Point_A ) === -1 )
                mvertices.push( new mVertices( rezFile[ i ].Point_A ) );

            if ( mvertices.findIndex( x => x.name === rezFile[ i ].Point_B ) === -1 )
                mvertices.push( new mVertices( rezFile[ i ].Point_B ) );
        }

        return mvertices;
    }

    getKnowedPoints ( mCsvAll: typeCsv[], mvertices: mVertices[] )
    {
        let mKnowedPoints: typeCsv[] = mCsvAll.filter( x => x.heiort != null );


        let mRes: typeCsv[] = [];

        for ( let i = 0; i < mKnowedPoints.length; i++ )
        {
            if ( mRes.findIndex( x => x.nam === mKnowedPoints[ i ].nam ) === -1 )
                mRes.push( mKnowedPoints[ i ] )
        }

        return mRes;


    }





    CreateKnowedPointsNet ( mDistinctedvertices: mVertices[], mCsvAll: typeCsv[] ): typeCsv[]
    {

        let allKnowedPoints: typeCsv[] = mCsvAll.filter( x => x.heiort != null );
        let result: typeCsv[] = [];
        for ( let i = 0; i < mDistinctedvertices.length; i++ )
        {
            result.push( mCsvAll.find( x => x.nam === mDistinctedvertices[ i ].name ) );
        }
        return result;

    }


    Main_1 ( mTableDelta: TableDeltaHeights[], mTableHeight: TablePointHeights[] ) 
    {
        this.mTableDelta = mTableDelta;
        this.mTableHeight = mTableHeight;
        console.log( this.mTableHeight );

        //Pseudorecursion: To avoid non stop loop case
        for ( let i = 0; i < this.mTableHeight.length * 10000; i++ )
        {
            //Exit when all the height has been filled
            if ( this.mTableHeight.findIndex( x => x.mHeight == null ) == -1 )
                break;
            //Pseudorecursion: Fill him self .
            this.mTableHeight = this.CalculateHeigh_GO( this.mTableHeight );
        }

    }

    Main_4 ( mTableDelta: TableDeltaHeights[], mCsvAll: typeCsv[] ): TablePointHeights[]
    {
        //Pseudorecursion

        //First fill the respectives 
        mTableDelta = this.FillTableHeights( mTableDelta, mCsvAll.filter( x => x.heiort != null && x.bValid === true ) );
        //Second fill all
        mTableDelta = this.FilleHimself( mTableDelta );
        //Fill table heights
        return this.fillTableHeight01( mTableDelta );
    }

    private fillTableHeight01 ( mTableDelta: TableDeltaHeights[] ): TablePointHeights[]
    {
        let res: TablePointHeights[] = [];

        for ( let i = 0; i < mTableDelta.length; i++ )
        {
            if ( res.findIndex( x => x.Point === mTableDelta[ i ].PointA ) === -1 )
                res.push( new TablePointHeights( mTableDelta[ i ].PointA, mTableDelta[ i ].HPointA ) );
            if ( res.findIndex( x => x.Point === mTableDelta[ i ].PointB ) === -1 )
                res.push( new TablePointHeights( mTableDelta[ i ].PointB, mTableDelta[ i ].HPointB ) );

        }

        return res;

    }



    private FilleHimself ( mTableDelta: TableDeltaHeights[] ): TableDeltaHeights[]
    {

        for ( let i = 0; i < 10000; i++ )
        {
            mTableDelta = this.FillTableHeights( mTableDelta, null );

            if ( mTableDelta.findIndex( x => x.HPointA === null || x.HPointB === null ) === -1 )
                break;
        }

        return mTableDelta



    }


    private FillTableHeights ( mTableDelta: TableDeltaHeights[], mKnowed: typeCsv[] ): TableDeltaHeights[]
    {

        if ( mKnowed === null )
        {
            mKnowed = [];
            for ( let i = 0; i < mTableDelta.length; i++ )
            {
                if ( mTableDelta[ i ].HPointA !== null && mKnowed.findIndex( x => x.nam === mTableDelta[ i ].PointA ) === -1 )
                {
                    let mNew: typeCsv = new typeCsv();
                    mNew.heiort = mTableDelta[ i ].HPointA;
                    mNew.nam = mTableDelta[ i ].PointA;
                    mKnowed.push( mNew );
                }

                if ( mTableDelta[ i ].HPointB !== null && mKnowed.findIndex( x => x.nam === mTableDelta[ i ].PointB ) === -1 )
                {
                    let mNew: typeCsv = new typeCsv();
                    mNew = new typeCsv();
                    mNew.heiort = mTableDelta[ i ].HPointB;
                    mNew.nam = mTableDelta[ i ].PointB;
                    mKnowed.push( mNew );

                }
            }
        }


        for ( let j = 0; j < mKnowed.length; j++ )
        {
            let mName = mKnowed[ j ].nam;

            //Fill all the deltot
            for ( let i = 0; i < mTableDelta.length; i++ )
            {

                /////////////////////A TO B/////////////////////////////


                if ( mTableDelta[ i ].PointA === mName )
                {
                    //Fill himself
                    mTableDelta[ i ].HPointA = mKnowed[ j ].heiort;

                    //Fill hes partner
                    if ( mTableDelta[ i ].HPointB === null )
                        mTableDelta[ i ].HPointB = mTableDelta[ i ].HPointA + mTableDelta[ i ].HeighDiff;


                    for ( let k = 0; k < mTableDelta.length; k++ )
                    {
                        //Fill All Himselfes as A
                        if ( mTableDelta[ k ].PointA === mTableDelta[ i ].PointA && mTableDelta[ k ].HPointA === null )
                            mTableDelta[ k ].HPointA = mTableDelta[ i ].HPointA;

                        //Fill All Himselfes as B
                        if ( mTableDelta[ k ].PointB === mTableDelta[ i ].PointA && mTableDelta[ k ].HPointB === null )
                            mTableDelta[ k ].HPointB = mTableDelta[ i ].HPointA;

                        //Fill All Partners as A
                        if ( mTableDelta[ k ].PointA === mTableDelta[ i ].PointB && mTableDelta[ k ].HPointA === null )
                            mTableDelta[ k ].HPointA = mTableDelta[ i ].HPointB;

                        //Fill  All Partners as B
                        if ( mTableDelta[ k ].PointB === mTableDelta[ i ].PointB && mTableDelta[ k ].HPointB === null )
                            mTableDelta[ k ].HPointB = mTableDelta[ i ].HPointB;
                    }
                }

                //////////////////B TO A //////////////////////////////////

                if ( mTableDelta[ i ].PointB === mName )
                {
                    //Fill himself
                    mTableDelta[ i ].HPointB = mKnowed[ j ].heiort;

                    //Fill hes partner
                    if ( mTableDelta[ i ].HPointA === null )
                        mTableDelta[ i ].HPointA = mTableDelta[ i ].HPointB - mTableDelta[ i ].HeighDiff;


                    for ( let k = 0; k < mTableDelta.length; k++ )
                    {
                        //Fill All Himselfes as B
                        if ( mTableDelta[ k ].PointB === mTableDelta[ i ].PointB && mTableDelta[ k ].HPointB === null )
                            mTableDelta[ k ].HPointB = mTableDelta[ i ].HPointB;

                        //Fill All Himselfes as A
                        if ( mTableDelta[ k ].PointA === mTableDelta[ i ].PointB && mTableDelta[ k ].HPointA === null )
                            mTableDelta[ k ].HPointA = mTableDelta[ i ].HPointB;

                        //Fill All Partners as A
                        if ( mTableDelta[ k ].PointA === mTableDelta[ i ].PointA && mTableDelta[ k ].HPointA === null )
                            mTableDelta[ k ].HPointA = mTableDelta[ i ].HPointA;

                        //Fill  All Partners as B
                        if ( mTableDelta[ k ].PointB === mTableDelta[ i ].PointA && mTableDelta[ k ].HPointB === null )
                            mTableDelta[ k ].HPointB = mTableDelta[ i ].HPointA;
                    }
                }

            }
        }
        return mTableDelta;
    }






    //Method to calculate the heighs on go
    private CalculateHeigh_GO ( mTable: TablePointHeights[] ): TablePointHeights[]
    {
        //
        let mres: TablePointHeights[] = [];

        //Fill to nes to avoid references confuse data.
        for ( let i = 0; i < mTable.length; i++ )
            mres.push( new TablePointHeights( mTable[ i ].Point, mTable[ i ].mHeight ) );



        for ( let i = 0; i < this.mTableDelta.length; i++ )
        {
            let mPA = mres.findIndex( x => x.Point === this.mTableDelta[ i ].PointA );
            if ( mres[ mPA ].mHeight != null ) 
            {
                //PointA Has Height
                //Check if he's partner B Has height  ( b = this.mTableDelta[ i ].PointB)
                let mPB = mres.findIndex( x => x.Point === this.mTableDelta[ i ].PointB );
                if ( mres[ mPB ].mHeight == null )
                {
                    //PointB Hasn't Height
                    //Adding height to point b
                    mres[ mPB ].mHeight = mres[ mPA ].mHeight + this.mTableDelta[ i ].HeighDiff;
                    continue;
                }
            }
        }
        //Reversing the table delta with hes values
        this.mTableDelta.reverse();
        for ( let i = 0; i < this.mTableDelta.length; i++ )
        {
            this.mTableDelta[ i ] = new TableDeltaHeights( this.mTableDelta[ i ].PointB, this.mTableDelta[ i ].PointA, ( -1 * this.mTableDelta[ i ].HeighDiff ), null, null );
        }

        return mres;//.filter( x => x.mHeight != null );
    }


}

export class TableDeltaHeights
{
    PointA: string;
    PointB: string;
    HeighDiff: number;
    HPointA: number;
    HPointB: number;

    constructor ( PointA: string, PointB: string, HeighDiff: number, HPointA: number, HPointB: number )
    {
        this.PointA = PointA;
        this.PointB = PointB;
        this.HeighDiff = HeighDiff;
        this.HPointA = HPointA;
        this.HPointB = HPointB;
    }
}

export class TablePointHeights
{
    Point: string;
    mHeight: number;


    constructor ( Point: string, mHeight: number )
    {
        this.Point = Point;
        this.mHeight = mHeight;

    }
}