import { mService, mSelectedAndAll } from '../../../Balances/Library/m-cesium/Script/MapiCesium';
import { mLinesLoops_01, mSegmentGroups } from './step1';
import { mLinesLoops_02, ObjectTypeBox } from './step2';
import $ from 'jquery';


export class WV_Main
{

    mSelection: mSelectedAndAll;

    m_Main_Step1: mLinesLoops_01;
    firstResults: mSegmentGroups[]
    m_Main_Step2: mLinesLoops_02;
    mIndexLineBoxes: ObjectTypeBox[];


    constructor ( mSelection: mSelectedAndAll )
    {
        this.mSelection = mSelection;
        this.m_Main_Step1 = new mLinesLoops_01();
        this.firstResults = this.m_Main_Step1.m_Main_Step1( mSelection );
        this.m_Main_Step2 = new mLinesLoops_02( this.firstResults );
        this.mIndexLineBoxes = this.m_Main_Step2.m_Main_Step2( true );
    }

    GetMore ( mClass: WV_Main )
    {
        for ( let i = 0; i < 2; i++ )
        {
            mClass.mIndexLineBoxes = mClass.m_Main_Step2.m_Main_Step2( false );
            if ( mClass.m_Main_Step2.Lines.length == 0 )
            {
                $( "#moreresultsDiv" ).css( 'display', 'none' );
                $( "#mFlagresults" ).html( 'true' );
                $( "#butMoreResultsALL" ).css( 'display', 'none' );
                return;
            }
            else
            {
                $( "#moreresultsDiv" ).css( 'display', 'block' );
                $( "#mFlagresults" ).html( 'false' );
                $( "#butMoreResultsALL" ).css( 'display', 'block' );
            }

        }

    }




}



