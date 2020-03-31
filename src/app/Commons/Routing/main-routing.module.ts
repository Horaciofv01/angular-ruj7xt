import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';


import { IzunIndexComponent } from '../../Balances/izun-index/izun-index.component'
import { RTKindexComponent } from '../../RTK/rtkindex/rtkindex.component'
import { PageComponent } from '../../Default/Page.component'
import { SelectorComponent } from '../../Balances/selector/selector.component'



const routes: Routes = [

  { path: '', component: PageComponent },
  { path: 'balances', component: IzunIndexComponent },
  { path: 'balances/index', component: IzunIndexComponent },
  { path: 'balances/selector', component: SelectorComponent },
  { path: 'balances/selector/:id', component: SelectorComponent },
  { path: 'rtk', component: RTKindexComponent }

]

@NgModule( {
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot( routes )

  ], exports: [ RouterModule ]

} )
export class MainRoutingModule { }
