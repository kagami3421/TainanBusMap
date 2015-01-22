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

## 前置作業:

* 下載專案檔
* 複製build資料夾到你的專案中 (刪除 TainanBus.min.js , 因為沒有用到)
* 複製LocalData資料夾到你的專案中 (除了 AllBusRoutes.json 、 MainCategory.json 以外 , 其他刪除)
* 複製js資料夾到你的專案中 (刪除 bootbox.min.js , 因為沒有用到)
* 複製css資料夾到你的專案中

* 新增以下HTML片段到header元素內：

```html
<link href="build/TDivbus.min.css" rel="stylesheet" />
<link href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" rel="stylesheet" />
<link href="css/MarkerCluster.css" rel="stylesheet" />
<link href="css/MarkerCluster.Default.css" rel="stylesheet" />
```

* 新增以下HTML片段到body元素尾端：

```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
<script src="js/jquery.blockUI.js"></script>
<script src="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"></script>
<script src="js/leaflet.markercluster.js"></script>
<script src="build/CommonVariable.min.js"></script>
<script src="build/TainanBusRender.min.js"></script>
<script src="build/TainanBusDiv.min.js"></script>
```

## 使用方法: 

* 新增此Div元素到你想要顯示地圖的HTML片段之間：

```html
<div id="map" bus-ref="6"></div>
```

* Div 元素名稱 **必須是map**
* 會根據你在bus-ref填入的值來顯示相對應的路線，多路線請中間間隔逗號
* (EX. 填入 **bus-ref="Red"** , 就會顯示紅幹線在地圖上;填入 **bus-ref="Blue,5"** , 就會顯示選單讓使用者選擇顯示藍幹線或市區5路)
* 你可以藉由CSS標籤去控制map元素的大小(Ex. #map)