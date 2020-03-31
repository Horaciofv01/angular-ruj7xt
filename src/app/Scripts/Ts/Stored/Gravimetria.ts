import { typeCsv } from '../../../Balances/Library/m-cesium/Script/MapiCesium';
import { ShowTableAnalisisGral } from '../WikiView/step2';
import $ from 'jquery';
import { Commons } from '../../Ts/Stored/Commons'
import { TablePointHeights } from './HeightCalculation_Main1';

export class mGravimetria
{


    private title1: string = "חשב :" + "OCab & Gh";
    private title2: string = "תקן גובה מדוד וחשב בחזרה";
    title: string = "תקן גובה מדוד וחשב בחזרה";
    mCounter: number = 0;
    mStep: number = 0;

    showPointsOnFirstTable: typeCsv[];
    showTableAnalisisGral: ShowTableAnalisisGral[];
    gravFactor: number;
    commons: Commons = new Commons();


    constructor ( showPointsOnFirstTable: typeCsv[], showTableAnalisisGral: ShowTableAnalisisGral[], gravFactor: number )
    {
        this.showTableAnalisisGral = showTableAnalisisGral;
        this.gravFactor = gravFactor;
        this.showPointsOnFirstTable = showPointsOnFirstTable;
        this.title = this.title1;
        this.mCounter = 0;
        this.mStep = 0;
    }


    FillGhAndOCab_Main ( heightBeforeCalc: TablePointHeights[] )
    {
        //Fill Gh in table pioints
        this.FillGH( heightBeforeCalc );
        //Fill OCAB
        debugger;//Intentionally: Temporary debugger for checks.
        this.FillOCab_V3( heightBeforeCalc );//Version 3
    }

    //Fill Gh in table pioints
    FillGH ( heightBeforeCalc: TablePointHeights[] )
    {
        for ( let i = 0; i < this.showPointsOnFirstTable.length; i++ )
        {
            //HeighDifCalculated: Gova mejushevet
            let Hp = heightBeforeCalc.find( x => x.Point === this.showPointsOnFirstTable[ i ].nam ).mHeight;
            let tempo: ShowTableAnalisisGral = this.showTableAnalisisGral.find( x => x.PA === this.showPointsOnFirstTable[ i ].nam );
            if ( tempo == undefined )
                tempo = this.showTableAnalisisGral.find( x => x.PB === this.showPointsOnFirstTable[ i ].nam );

            this.showPointsOnFirstTable[ i ].Gh = this.showPointsOnFirstTable[ i ].gga + ( ( ( Hp >= 0 ) ? 0.0424 : 0.1543 ) * Hp );

            //Writting on UI table: (10 spaces not runs as new)
            $( "#pointRows_Gh_" + this.showPointsOnFirstTable[ i ].nam ).html( this.commons.get10SpacesHtml( this.showPointsOnFirstTable[ i ].Gh.toString() ) );

        }

    }

    //Fill OCAB
    FillOCab_V1 ( heightBeforeCalc: TablePointHeights[] )//איליה
    {
        for ( let i = 0; i < this.showTableAnalisisGral.length; i++ )
        {
            let Ga: number = this.showPointsOnFirstTable.find( x => x.nam === this.showPointsOnFirstTable[ i ].nam ).Gh;
            let Gb: number = this.showPointsOnFirstTable.find( x => x.nam === this.showPointsOnFirstTable[ i ].nam ).Gh;
            let mSum1: number = ( ( Ga - Gb ) / Gb ) * this.showTableAnalisisGral[ i ].AltitudePA;

            let mSum2: number = this.Sumatory( this.showTableAnalisisGral, this.showPointsOnFirstTable, Gb, this.showTableAnalisisGral[ i ].HeighDifCalculated )
            this.showTableAnalisisGral[ i ].OCab = mSum1 + mSum2;

            //Writting on UI table: (10 spaces not runs as new)
            $( "#showTGral_Ocab_" + i.toString() ).html( this.commons.get10SpacesHtml( this.showTableAnalisisGral[ i ].OCab.toString() ) );
        }
    }

    FillOCab_V2 ( heightBeforeCalc: TablePointHeights[] )//חזי
    {
        //OCAB=(1/GB)*(HA*(GA-GB)+((GGALA+GGALB)/2-GB)* (HB +  (HA * -1)))
        for ( let i = 0; i < this.showTableAnalisisGral.length; i++ )
        {
            let PA: string = this.showTableAnalisisGral[ i ].PA;
            let PB: string = this.showTableAnalisisGral[ i ].PB;

            let tempoA: typeCsv = this.showPointsOnFirstTable.find( x => x.nam === PA );
            let tempoB: typeCsv = this.showPointsOnFirstTable.find( x => x.nam === PB );

            let Ga: number = tempoA.Gh;
            let Gb: number = tempoB.Gh;

            let GgalA: number = tempoA.gga;
            let GgalB: number = tempoB.gga;

            let HA = heightBeforeCalc.find( x => x.Point === PA ).mHeight;
            let HB = heightBeforeCalc.find( x => x.Point === PB ).mHeight;
            let mRes: number = 1 / Gb * ( HA * ( Ga - Gb ) + ( ( GgalA + GgalB ) / 2 - Gb ) * ( HB + ( HA * ( -1 ) ) ) );
            this.showTableAnalisisGral[ i ].OCab = mRes;
            $( "#showTGral_Ocab_" + i.toString() ).html( this.commons.get10SpacesHtml( this.showTableAnalisisGral[ i ].OCab.toString() ) );
        }
    }

    FillOCab_V3 ( heightBeforeCalc: TablePointHeights[] )//Latest
    {
        //OCAB=(1/GB)*(HA*(GA-GB)+((GGALA+GGALB)/2-GB)* (HB +  (HA * -1)))
        for ( let i = 0; i < this.showTableAnalisisGral.length; i++ )
        {
            let PA: string = this.showTableAnalisisGral[ i ].PA;
            let PB: string = this.showTableAnalisisGral[ i ].PB;

            let tempoA: typeCsv = this.showPointsOnFirstTable.find( x => x.nam === PA );
            let tempoB: typeCsv = this.showPointsOnFirstTable.find( x => x.nam === PB );

            let Ga: number = tempoA.Gh;
            let Gb: number = tempoB.Gh;

            let GgalA: number = tempoA.gga;
            let GgalB: number = tempoB.gga;

            let HA = heightBeforeCalc.find( x => x.Point === PA ).mHeight;
            let HB = heightBeforeCalc.find( x => x.Point === PB ).mHeight;

            //let mRes: number = 1 / Gb * ( HA * ( Ga - Gb ) + ( ( Ga + Gb ) / 2 - Gb ) * ( HB + ( HA * ( -1 ) ) ) );
            let mRes: number = 1 / Gb * ( HA * ( Ga - Gb ) + ( ( Ga + Gb ) / 2 - Gb ) * ( HB + ( HA * ( -1 ) ) ) );
            this.showTableAnalisisGral[ i ].OCab = mRes;
            $( "#showTGral_Ocab_" + i.toString() ).html( this.commons.get10SpacesHtml( this.showTableAnalisisGral[ i ].OCab.toString() ) );
        }
    }



    Sumatory ( showTableAnalisisGral: ShowTableAnalisisGral[], showPointsOnFirstTable: typeCsv[], Gb: number, HeighDifCalculated: number ): number
    {
        let mSum: number = 0;
        for ( let i = 0; i < showTableAnalisisGral.length; i++ )
        {
            let Gi: number = this.showPointsOnFirstTable.find( x => x.nam === this.showPointsOnFirstTable[ i ].nam ).Gh;
            mSum += ( ( Gi - Gb ) / Gb ) * HeighDifCalculated;
        }

        return mSum;
    }



    GoAndBack ( bGo: boolean ): number
    {
        let mRet: number = -1;

        if ( bGo )
        {
            this.mStep = 0;
            this.mCounter++;
            this.title = this.title1;
            mRet = 1;
        }

        if ( !bGo )
        {
            this.mStep = 1;
            this.mCounter--;
            this.title = this.title2;
            mRet = 3;
        }

        if ( this.mCounter > 0 )
            $( "#buttonGravimetryGO" ).css( 'color', 'blue' );
        if ( this.mCounter === 0 )
        {
            $( "#buttonGravimetryGO" ).css( 'color', 'red' );
            return 3;
        }

        return mRet;

    }

    AddOCabToKnowedHeight ( bSum: boolean )
    {
        for ( let i = 0; i < this.showTableAnalisisGral.length; i++ )
        {
            if ( bSum )
                this.showTableAnalisisGral[ i ].HeighDifByRez -= this.showTableAnalisisGral[ i ].OCab;
            else this.showTableAnalisisGral[ i ].HeighDifByRez += this.showTableAnalisisGral[ i ].OCab;
            //Writting on UI table: (10 spaces not runs as new)
            $( "#showTGral_HeighDifByRez_" + i.toString() ).html( this.commons.get10SpacesHtml( this.showTableAnalisisGral[ i ].HeighDifByRez.toString() )

                + "<div class= 'originalDiv'>" + this.commons.get10SpacesHtml( this.showTableAnalisisGral[ i ].HeighDifByRezOriginal.toString() + '</div>' )

            );
        }
    }

}

export class GravimetriaGoAndBackUI
{
    title: string;
    mStep: number;
    mCounter: number;

    constructor ( title: string, mStep: number, mCounter: number )
    {
        this.title = title;
        this.mStep = mStep;
        this.mCounter = mCounter;
    }

}