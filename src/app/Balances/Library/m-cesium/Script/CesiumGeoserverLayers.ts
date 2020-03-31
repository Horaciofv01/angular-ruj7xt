export class CesiumGeoserverLayers
{
    gridsetName: string = 'EPSG:4326';
    gridNames: string[] = [ 'EPSG:4326:0', 'EPSG:4326:1', 'EPSG:4326:2', 'EPSG:4326:3', 'EPSG:4326:4', 'EPSG:4326:5', 'EPSG:4326:6', 'EPSG:4326:7', 'EPSG:4326:8', 'EPSG:4326:9', 'EPSG:4326:10', 'EPSG:4326:11', 'EPSG:4326:12', 'EPSG:4326:13', 'EPSG:4326:14', 'EPSG:4326:15', 'EPSG:4326:16', 'EPSG:4326:17', 'EPSG:4326:18', 'EPSG:4326:19', 'EPSG:4326:20', 'EPSG:4326:21' ];


    CreateGeoserverLayer8081 = function ( bTiled: boolean, name: string, mViewParams: string )
    {

        if ( mViewParams == undefined )
            mViewParams = '';

        if ( bTiled == false )
        {
            return new Cesium.WebMapServiceImageryProvider( {
                url: 'http://qpersonalmap:8081/geoserver/WorkSpace_publish/wms',
                exceptions: 'application/vnd.ogc.se_inimage',
                layers: name,
                tiled: true,
                parameters: {
                    transparent: true,
                    format: 'image/png',
                    viewparams: mViewParams
                }

            } )
        }
        if ( bTiled == true )
        {

            return new Cesium.WebMapTileServiceImageryProvider( {
                url: 'http://qpersonalmap:8081/geoserver/gwc/service/wmts',
                tileMatrixSetID: this.gridsetName,
                tileMatrixLabels: this.gridNames,
                layer: name,
                style: '',
                tilingScheme: new Cesium.GeographicTilingScheme(),
                format: 'image/png',
                parameters: {
                    viewparams: mViewParams
                }
            } )
        }
    }

}