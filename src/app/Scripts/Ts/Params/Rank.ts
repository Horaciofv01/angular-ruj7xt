export class RankRows
{
    id: number;
    strDescription: string;
    rankTerms: RankTerms[];

    constructor ()
    {
        this.rankTerms = [];
    }

}

export class RankTerms
{
    mRank: number;
    mValue: number;

    constructor ( mRank: number, mValue: number )
    {
        this.mRank = mRank;
        this.mValue = mValue;
    }
}




export class RankTable
{

    rankRows: RankRows[] = [];

    constructor ()
    {

        let mRankTerms = new RankRows();
        mRankTerms.id = 8;
        mRankTerms.strDescription = "	אורך קו יזון מקסימלי (ק''מ)";
        mRankTerms.rankTerms.push( new RankTerms( 1, null ) );
        mRankTerms.rankTerms.push( new RankTerms( 2, 60000 ) );
        mRankTerms.rankTerms.push( new RankTerms( 3, 25000 ) );
        mRankTerms.rankTerms.push( new RankTerms( 4, 10000 ) );
        mRankTerms.rankTerms.push( new RankTerms( 5, 4000 ) );
        this.rankRows.push( mRankTerms );

    }


    getRankValue ( id: number, rank: number )
    {
        return this.rankRows.find( x => x.id === id ).rankTerms.find( f => f.mRank == rank ).mValue;
    }


    getPermittedLargeByRank ( objectType: number, mLarge: number, mRank: number ): number    
    {
        mLarge = mLarge / 1000;
        if ( objectType === 1 || objectType === 2 )//Loop
        {

            if ( mRank == 1 )
                return 2 * Math.sqrt( mLarge ) / 1000;

            if ( mRank == 2 )
                return 3 * Math.sqrt( mLarge ) / 1000;

            if ( mRank == 3 )
                return 10 * Math.sqrt( mLarge ) / 1000;

            if ( mRank == 4 )
                return 20 * Math.sqrt( mLarge ) / 1000;

            if ( mRank == 5 )
                return 40 * Math.sqrt( mLarge ) / 1000;

        }
        if ( objectType === 0 )//line
        {
            if ( mRank == 1 )
                return 2 * Math.sqrt( mLarge ) / 1000;

            if ( mRank == 2 )
                return 1 * Math.sqrt( mLarge ) / 1000;

            if ( mRank == 3 )
                return 15 * Math.sqrt( mLarge ) / 1000;

            if ( mRank == 4 )
                return 30 * Math.sqrt( mLarge ) / 1000;

            if ( mRank == 5 )
                return 60 * Math.sqrt( mLarge ) / 1000;
        }
    }
}