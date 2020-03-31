import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { mConfig } from '../../../Commons/mConfig';

export class BL
{
    mconfig: mConfig = new mConfig();
    constructor ( private _http: HttpClient, private route: ActivatedRoute ) { }


    Permissions ( typeID: number ): void
    {

        let mQueryString: string = this.mconfig.mUrl + "/mMethods/Permissions";
        let params: HttpParams = new HttpParams().set( 'typeID', typeID.toString() );
        params
        this._http.get<any>( mQueryString, { params: params } )
            .subscribe( ( res ) =>
            {
            } );


    }




}