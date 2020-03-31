import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { CesiumTestDirective } from './mTest/mCesium/cesium-test.directive';
import { CesiumTestComponent } from './mTest/mCesium/cesium-test/cesium-test.component';
import { Teststep1Component } from './mTest/Step1Test/test-step1.component';
import { PageComponent } from './Default/Page.component';
import { LogosComponent } from './Commons/Titles/logos/Logos.component';
import { MainRoutingModule } from '../app/Commons/Routing/main-routing.module';
import { RTKindexComponent } from './RTK/rtkindex/rtkindex.component';
import { IzunIndexComponent } from './Balances/izun-index/izun-index.component';
import { BalonsComponent } from './Commons/balons/balons.component';
import { IzunManageFilesComponent } from './Balances/Library/izun-manage-files/izun-manage-files.component';
import { IzunDefaultFooterComponent } from './Balances/Library/izun-default-footer/izun-default-footer.component';
import { SelectorComponent } from './Balances/selector/selector.component';
import { Spaces10Component } from './Commons/spaces10/spaces10.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule, MatInputModule, MatOptionModule } from '@angular/material';


import { WaitmeComponent } from './Commons/waitme/waitme.component';

@NgModule( {



  declarations: [
    WaitmeComponent,
    AppComponent,
    CesiumTestDirective,
    CesiumTestComponent,
    Teststep1Component,
    PageComponent,
    LogosComponent,
    RTKindexComponent,
    IzunIndexComponent,
    BalonsComponent,
    IzunManageFilesComponent,
    IzunDefaultFooterComponent,
    SelectorComponent,
    Spaces10Component

  ],
  imports: [

    BrowserModule,
    HttpClientModule,
    FormsModule,
    MainRoutingModule,

    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule

  ],

  providers: [],
  bootstrap: [ AppComponent ]
} )
export class AppModule { }
