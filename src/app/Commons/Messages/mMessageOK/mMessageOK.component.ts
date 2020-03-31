import { Component, OnInit } from '@angular/core';
import Fill from 'ol/style/Fill';

@Component({
selector: 'mMessageOK-component',
templateUrl: './mMessageOK.component.html',
styleUrls: ['./mMessageOK.component.css']
})
export class MmessageokComponent implements OnInit {


    mTitle:string = "הודעה מס1";
    mMesage: string = "BLA BLA BLA";
    mSrc:string = "info1.png";
    divName: string = 'mMessageSayOK';
    showDiv:boolean = !true;
    newMark: string;

    
constructor(
    
) {
}

ngOnInit(){

    

}





}