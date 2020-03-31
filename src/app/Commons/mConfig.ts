export class mConfig
{
    mUrl: string = "http://localhost:28386";
    //mUrl: string = "http://qpersonalmap:8061";///api/ReadFiles?withCsv=false&withCoordinates=true&withGgal=true
    //mRunServer = "ng serve --host horacio-v --port  8040";
    constructor ()
    {
        if ( window.location.hostname.toLowerCase() === 'qpersonalmap' )
        {
            this.mUrl = 'http://qpersonalmap:8061';
        }
        if ( window.location.hostname.toLowerCase() === 'horacio-v' )
        {
            this.mUrl = 'http://localhost:28386';
        }

    }

}