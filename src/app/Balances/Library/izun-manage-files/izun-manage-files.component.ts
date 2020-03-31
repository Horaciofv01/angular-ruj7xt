import { Component, OnInit } from '@angular/core';
import $ from 'jquery';
import { HttpClient, HttpParams } from '@angular/common/http';
import { mOutputFiles } from '../../../Scripts/Ts/Stored/Commons';
import { mConfig } from '../../../Commons/mConfig'

@Component( {
  selector: 'app-izun-manage-files',
  templateUrl: './izun-manage-files.component.html',
  styleUrls: [ './izun-manage-files.component.css' ]
} )
export class IzunManageFilesComponent implements OnInit
{

  constructor ( private _http: HttpClient ) { }
  mResults: mOutputFiles = new mOutputFiles();
  showCsvGravTimer: boolean = false;
  showCsvCoordTimer: boolean = false;
  showCsvButton: boolean = false;
  mID: string = '';
  mconfig: mConfig = new mConfig();

  ngOnInit ()
  {
    this.fillList( 1 );
  }
  mUploadFiles ()
  {
    $( '#mUploadForm' ).submit();
    this.fillList( 0 );


  }


  fillList ( mFlag: number )
  {
    let params: HttpParams = new HttpParams().set( "mFlag", mFlag.toString() );
    let obs = this._http.get<mOutputFiles>( this.mconfig.mUrl + "/api/UploadFileManage/GetUploadedFileList", { params: params } )
      .subscribe( ( res ) =>
      {
        this.mResults = res;
        if ( this.mResults == undefined )
          this.mResults = new mOutputFiles();
        else
        {
          if ( this.mResults.mRezDatRaw.length === 0 )
            this.showCsvButton = false;
          else this.showCsvButton = true;

        }

        // debugger
        //  if ( document.getElementById( "refreshMapButton" ) !== null )
        // {
        // let melement: HTMLElement = document.getElementById( "refreshMapButton" ) as HTMLElement;
        //melement.click();
        // }



      } );
  }

  DeleteFile ( mFlag: number, mFileName: string )
  {
    let params: HttpParams = new HttpParams().set( "mFlag", mFlag.toString() ).set( "mFileName", mFileName );
    let obs = this._http.get<void>( this.mconfig.mUrl + "/api/UploadFileManage/DeleteFile", { params: params } )
      .subscribe( ( res ) =>
      {
        this.fillList( 1 );
      } );

  }

  ClearAll ()
  {
    let params: HttpParams = new HttpParams();
    let obs = this._http.get<void>( this.mconfig.mUrl + "/api/UploadFileManage/ClearAll", { params: params } )
      .subscribe( ( res ) =>
      {
        this.mResults = new mOutputFiles();
        this.showCsvGravTimer = this.showCsvCoordTimer = this.showCsvButton = false;
      } );

  }

  LoadCSVGravimetria ()
  {
    //showCsvGravTimer: boolean = false;
    //showCsvCoordTimer: boolean = false;

    this.showCsvGravTimer = true;

    let params: HttpParams = new HttpParams();
    let obs = this._http.get<any>( this.mconfig.mUrl + "/mMethods/CreateCSVWithGravimetria", { params: params } )
      .subscribe( ( res ) =>
      {
        this.showCsvGravTimer = false;
        this.fillList( 1 );
        this.mID = res[ 0 ].mres;
        window.open( this.mconfig.mUrl + "/Files/Calculation/" + this.mID + "/CSV/PointDatas/PointDatas.csv" )
      } );
  }
  LoadCSVStored ( item: string )
  {

    let params: HttpParams = new HttpParams();
    let obs = this._http.get<any>( this.mconfig.mUrl + "/mMethods/GetID", { params: params } )
      .subscribe( ( res ) =>
      {
        this.mID = res[ 0 ].mres;
        window.open( this.mconfig.mUrl + "/Files/Calculation/" + this.mID + "/CSV/PointDatas/" + item );
      } );


  }

  refreshMap ()
  {

    // debugger
    if ( document.getElementById( "refreshMapButton" ) !== null )
    {
      let melement: HTMLElement = document.getElementById( "refreshMapButton" ) as HTMLElement;
      melement.click();
    }
  }


}




