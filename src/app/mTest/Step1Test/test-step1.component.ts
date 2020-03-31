import { Component, OnInit } from '@angular/core';
import { mLinesLoops_01, mSegmentGroups } from '../../Scripts/Ts/WikiView/step1';
import { mLinesLoops_02, ObjectTypeBox } from '../../Scripts/Ts/WikiView/step2';


@Component( {
    selector: 'test-step1component',
    templateUrl: './test-step1.component.html',
    styleUrls: [ './test-step1.component.css' ]
} )
export class Teststep1Component implements OnInit
{
    m: any;



    constructor ()
    {
    }





    ngOnInit ()
    {

        let m_Main_Step1 = new mLinesLoops_01();
        let firstResults: mSegmentGroups[] = m_Main_Step1.m_Main_Step1( null );

        let m_Main_Step2 = new mLinesLoops_02( firstResults );
        let mIndexLineBoxes: ObjectTypeBox[] = m_Main_Step2.m_Main_Step2( true );

        //Pseudo recursion
        for ( let i = 0; i < 999999; i++ )
        {
            mIndexLineBoxes = m_Main_Step2.m_Main_Step2( false );
            //when  m_Main_Step2.Lines.Lenght == 0 : the last possible combination just was analized.
            if ( m_Main_Step2.Lines.length == 0 )
                break;
        }

    }
}