var AllRoutesJsonUrl = "LocalData/AllBusRoutes";

var RouteDownloadManager;

$(document).ready(function() {
    var DivElement = $('#map');

    if (DivElement === undefined || DivElement.attr('bus-ref') === undefined) {
        window.alert("找不到地圖Div或編號不存在!");
        return;
    } else {
        CreateBusMap(DivElement.attr('bus-ref'));
    }
});

function CreateBusMap(id) {

    RouteDownloadManager = new L.TainanBus.RenderManager();

    map = L.map('map').setView([23.1852, 120.4287], 11);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: MapAttribution
    }).addTo(map);

    GetRouteByCode(id);
}

function GetRouteByCode(code) {

    var ColorSchemeCollect = [];

    $.getJSON(categoryJsonUrl + routeJsonExtension, function(data) {
        $.each(data, function(i, item) {
            RouteDownloadManager.InitStopIconOption(item.categoryIndex);
            //Save Color Setting
            var ColorScheme = {
                MainLineColor: item.categoryLineColor,
                ExtendLineColor: item.categoryLineColor2
            }
            ColorSchemeCollect.push(ColorScheme);
        });

        var currentCategory;
    	var currentRelationID;
    	var currentColorScheme = {};

        $.getJSON(AllRoutesJsonUrl + routeJsonExtension, function(data) {
            $.each(data, function(i, item) {
                if (code == item.RouteCodeName) {
                    currentCategory = item.RouteCategory;
                    currentRelationID = item.RouteOSMRelation;
                }
            });

            currentColorScheme = ColorSchemeCollect[currentCategory - 1];

    		RouteDownloadManager.InitLeafletOption(currentCategory, currentColorScheme);

    		map.addControl(new L.BusDirControl(currentRelationID));

    		//Event Binding
    		$('input[name="direction"]:radio').change(function() {
            	SetSelectDirection2(currentRelationID);
        	});
        });
    });
}

L.BusDirControl = L.Control.extend({
    options: {
        position: 'topright'
    },

    initialize: function(id, options) {
        L.Util.setOptions(this, options);

        this._busRelationID = id;
    },

    onAdd: function(map) {
        var ForwardOption = '<input type="radio" name="direction" value="forward" checked>往程<br/>';
        var BackwardOption = '<input type="radio" name="direction" value="backward">返程';

        var OptionContainer = L.DomUtil.create('div','dir');
        $(OptionContainer).append(ForwardOption, BackwardOption);

        SetSelectDirection2(this._busRelationID);

        return OptionContainer;
    },

    onRemove: function(map) {

    }
});

function SetSelectDirection2(id) {
    var dir = $('input[name="dirctions"]:checked').val();

    //console.log('Test');

    if (dir == "forward")
        RouteDownloadManager.DownloadRouteMaster(id, true);
    else
        RouteDownloadManager.DownloadRouteMaster(id, false);
}
