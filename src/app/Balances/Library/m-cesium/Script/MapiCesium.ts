import proj4 from 'proj4';

export class MapiCesium
{

    Proj2039: string = 'PROJCS["Israel / Israeli TM Grid",GEOGCS["Israel", DATUM["Israel", SPHEROID["GRS 1980",6378137,298.257222101, AUTHORITY["EPSG","7019"]],TOWGS84[-48,55,52,0,0,0,0], AUTHORITY["EPSG","6141"]], PRIMEM["Greenwich",0, AUTHORITY["EPSG","8901"]], UNIT["degree",0.01745329251994328, AUTHORITY["EPSG","9122"]], AUTHORITY["EPSG","4141"]], UNIT["metre",1, AUTHORITY["EPSG","9001"]],PROJECTION["Transverse_Mercator"], PARAMETER["latitude_of_origin",31.73439361111111],PARAMETER["central_meridian",35.20451694444445],PARAMETER["scale_factor",1.0000067],PARAMETER["false_easting",219529.584], PARAMETER["false_northing",626907.39], AUTHORITY["EPSG","2039"], AXIS["Easting",EAST], AXIS["Northing",NORTH]]';
    ProjWGS84: string = 'GEOGCS["WGS 84", DATUM["WGS_1984", SPHEROID["WGS 84",6378137,298.257223563, AUTHORITY["EPSG","7030"]], AUTHORITY["EPSG","6326"]], PRIMEM["Greenwich",0, AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433, AUTHORITY["EPSG","9122"]], AUTHORITY["EPSG","4326"]]';
    mCenterPosition: any = null;
    mMousePosition: any = null;
    mTypeLine: string = 'm_polyline';
    mTypeLabel: string = 'm_label';
    mTypePoint: string = 'm_point';
    mTypeHalo: string = 'm_halo';


    static SetSegmentAction ( arg0: number )
    {
        // throw new Error( "Method not implemented." );
    }
    static AddTableSegmentToToobar ( _point1: any, _point2: any, _HeighDiff: any, _Distance: any, _id: any )
    {
        // throw new Error( "Method not implemented." );
    }
    static arrSelectedSegments: any;
    static CheckExistance ( mNewID: any, arg1: boolean ): boolean
    {
        // throw new Error( "Method not implemented." );
        return false;
    }

    proj4From2039_to_WGS84 ( x: number, y: number, z: number ): number[]
    {
        return proj4( this.Proj2039, this.ProjWGS84, [ x, y, z ] );
    }
    proj4FromWGS84_to_2039 ( x: number, y: number, z: number ): number[]
    {
        return proj4( this.ProjWGS84, this.Proj2039, [ x, y, z ] );
    }

    GetDataPointFromCSV ( mObjects: mService, mPoint: string ): typeCsv
    {
        return mObjects.mCsv.find( x => x.nam === mPoint );
    }


}

export class typePoint
{

    _x: number;
    _y: number;
    _z: number;
    mName: string;
    HeOrt: number;

    constructor ( _x: number, _y: number, _z: number, mName: string, HeOrt: number )
    {
        this._x = _x;
        this._y = _y;
        this._z = _z;
        this.mName = mName;
        this.HeOrt = HeOrt;
    }


}

export class typeSegment
{
    PointA: string;
    PointB: string;
    Distance: number;
    HeighDifference: number;
    OrtogDiference: number;

    constructor ( PointA: string, PointB: string, Distance: number, HeighDifference: number, OrtogDiference: number )
    {
        this.PointA = PointA;
        this.PointB = PointB;
        this.Distance = Distance;
        this.HeighDifference = HeighDifference;
        this.OrtogDiference = OrtogDiference;
    }

}

export class typeRez
{

    acr: number;
    bf: number;
    dat: string;
    dis: number;
    fil: string;
    hei: number
    pa: string;
    pb: string;
    heightPA: number;
    heightPB: number;
}




export class typeCsv
{
    dra: number;
    gga: number;
    heiort: number;
    nam: string;
    x: number;
    y: number;
    bValid: boolean;
    Gh: number;
    heightAprox: number;

}


export class mProject
{
    id: number;
    surveyorid: number;
    strdescription: string;
    strcomment: string;
    measurementtypeid: number;
    startmeasuredata: Date;
    endmeasuredata: Date;
    objecttype: number;

}


export class mService
{
    projectData: mProject;
    mRez: typeRez[];
    mCsv: typeCsv[];


    constructor ()
    {        // {
        this.mCsv = [];
        this.mRez = [];
    }
}


export class mSelectedAndAll
{

    mRezSelected: typeRez[];
    mCsvSelected: typeCsv[];

    mRezAll: typeRez[];
    mCsvAll: typeCsv[];

    constructor ()
    {
        // {
        this.mCsvAll = [];
        this.mCsvSelected = [];

        this.mRezAll = [];
        this.mRezSelected = [];
    }
}