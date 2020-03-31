var mSite={}


mSite.RowSelected01( mName, this )
{
    var mRows=document.getElementsByName( mName );
    for ( let i=0;i<mRows.length;i++ ) {
        mRows[ i ].style.backgroundColor="#ff0000"
    }
    this.style.backgroundColor="#ff00ff"

}