TainanBusMap
============

# Independent Map Page

View Bus Routes of Tainan City

## Direct Link: 
http://kagami3421.github.io/TainanBusMap

## Instruction:

* Categoried Routes
* Visible/Invisible Bus Stops
* Change direction of route
* Hide/Show route-selected section 

## Library Reference:

* [Leaftlet](http://leafletjs.com/)
* [Leaflet-MarkerCluster](https://github.com/Leaflet/Leaflet.markercluster)
* [Leaflet-OSM](https://github.com/jfirebaugh/leaflet-osm)
* [Bootstrap](http://getbootstrap.com/)
* [BootBox](http://bootboxjs.com/)
* [Bootstrap-Select](http://silviomoreto.github.io/bootstrap-select/)
* [jQuery-BlockUI](http://malsup.com/jquery/block/)

## Data Refrence:

* OpenStreetMap
* [Tainan Bus Dynamic System](http://2384.tainan.gov.tw/TNWeb/Index.jsp?locale=zh_TW&agis=Yes)
* Shing-nan Bus Corporation
* Xin-yin Bus Corporation
* Fu-cheng Bus Corporation

# Inner HTML Map (內嵌式地圖)

## Dependencies:

* Download project zip file (下載專案檔)
* Copy build folder in your web project (Remove TainanBus.min.js , because it isn't necessary)
* 複製build資料夾到你的專案中 (刪除 TainanBus.min.js , 因為沒有用到)

* Add these css dependcies in your HTML <header> section
(You should change the href= path where puts your MarkerCluster css files)

```html
<link rel="stylesheet" href="build/TDivBus.min.css">
<link href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" rel="stylesheet" />
<link href="css/MarkerCluster.css" rel="stylesheet" />
<link href="css/MarkerCluster.Default.css" rel="stylesheet" />
```

* Add these javascript dependcies in your HTML <body> section 
(You should change the src= path where puts your MarkerCluster js files)

```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="js/jquery.blockUI.js"></script>
<script src="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"></script>
<script src="js/leaflet.markercluster.js"></script>
<script src="build/CommonVariable.min.js"></script>
<script src="build/TainanBusRender.min.js"></script>
<script src="build/TainanBusDiv.min.js"></script>
```

## Using Instruction: 

*Add the HTML section you want to display the map in your page

```html
<div id="map" bus-ref="6"></div>
```

* Div Element id *MUST* is map
* The map display route by changing value of *bus-ref* attribute
* (EX. fill Red in bus-ref *bus-ref="Red"* , it will display Red Line Route on the map)
* You can change map size by modifying *map* tag in your css file