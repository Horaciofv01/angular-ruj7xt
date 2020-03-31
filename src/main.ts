import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

//if ( environment.production )
//{
if ( window.location.hostname.toLowerCase() === 'qpersonalmap' )
{
  //enableProdMode();
}


//enableProdMode();

Cesium.buildModuleUrl.setBaseUrl( '/assets/cesium/' );
platformBrowserDynamic().bootstrapModule( AppModule )
  .catch( err => console.error( err ) );
