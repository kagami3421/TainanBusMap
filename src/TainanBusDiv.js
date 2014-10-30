var AllRoutesJsonUrl = "LocalData/AllBusRoutes";

var RouteDownloadManager;

var DivString = '#map';

var DirControl;
var ColorSchemeCollect = [];
var RouteElements = [];

//var currentRelation;

$(document).ready(function() {
    var DivElement = $(DivString);

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

    if(id.search(",") === -1)
        GetRouteByCode(id , false);
    else
        GetRouteByCode(id , true);
}

function GetRouteByCode(code , isMulti) {

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

        if(isMulti === true)
            var eachIdCode = code.split(",");
        else{
            var eachIdCode = [];
            eachIdCode.push(code);
        }

        $.getJSON(AllRoutesJsonUrl + routeJsonExtension, function(data) {
            //Get Data from assigned codes
            for(var j = 0 ; j < eachIdCode.length ; ++j){
                $.each(data, function(i, item) {
                    if (eachIdCode[j] == item.RouteCodeName) {

                        //console.log(item.RouteOSMRelation);
                        var Element = {
                            Category: item.RouteCategory,
                            RelationID: item.RouteOSMRelation,
                            Name: item.RouteName
                        }

                        RouteElements.push(Element);
                        return false;
                    }
                });
            }

            if (eachIdCode.length !== RouteElements.length) {
                window.alert("編號有誤!");
            }
            else {
                map.addControl(new L.BusSelectRouteControl(RouteElements));

                //console.log(RouteElements);

                if(DirControl === undefined){
                    DirControl = new L.BusDirControl();
                    map.addControl(DirControl);
                }

                if(isMulti === false){
                    $('.selRoute').css('visibility', 'hidden');
                    $('#selr').css('visibility', 'hidden');
                }

                SetSelectRoute();

                //Event Binding
                $('#selr').change(function(){
                    SetSelectRoute();
                });

                $('input[name="direction"]:radio').change(function() {
                    SetSelectDir();
                });
            }
        });
    });
}

function SetSelectRoute() {
    var SelectedElement = $("#selr option:selected").attr('value');

    //console.log(SelectedElement);

    var SelectedElementArray = SelectedElement.split(",");

    currentScheme = ColorSchemeCollect[SelectedElementArray[0] - 1];

    RouteDownloadManager.InitLeafletOption(SelectedElementArray[0], currentScheme);

    if(DirControl !== undefined)
        DirControl.RefreshRelationID(SelectedElementArray[1]);

    //currentRelation = SelectedElementArray[1];

    SetSelectDir();
}

function SetSelectDir() {
    var dir = $('input[name="dirctions"]:checked').val();

    if (dir == "forward")
        RouteDownloadManager.DownloadRouteMaster(DirControl._busRelationID, true, DivString);
    else
        RouteDownloadManager.DownloadRouteMaster(DirControl._busRelationID, false, DivString);
}

L.BusDirControl = L.Control.extend({
    options: {
        position: 'topright'
    },

    initialize: function(options) {
        L.Util.setOptions(this, options);

        this._busRelationID = 0;
    },

    onAdd: function(map) {
        var ForwardOption = '<input type="radio" name="direction" value="forward" checked>往程<br/>';
        var BackwardOption = '<input type="radio" name="direction" value="backward">返程';

        var OptionContainer = L.DomUtil.create('div', 'dir');
        $(OptionContainer).append(ForwardOption, BackwardOption);

        //SetSelectDir(this._busRelationID);

        return OptionContainer;
    },

    onRemove: function(map) {

    },

    RefreshRelationID: function(NewId){
        this._busRelationID = NewId;
    }
});

L.BusSelectRouteControl = L.Control.extend({
    options: {
        position: 'topleft'
    },

    initialize: function(ids, options) {
        L.Util.setOptions(this, options);

        this._RouteElements = ids;
    },

    onAdd:function(map){
        var SelectElement = '<select id="selr">';
        var SelectElementEnd = '</select>';

        var options = "";

        for(var i = 0 ; i < this._RouteElements.length ; i++){
            var optionE = '<option label="'+ this._RouteElements[i].Name +'" value="'+ this._RouteElements[i].Category + ',' + this._RouteElements[i].RelationID +'">'+ this._RouteElements[i].Name +'</option>';

            //console.log(optionE);

            options += optionE;
        }

        var OptionContainer = L.DomUtil.create('div', 'selRoute');
        $(OptionContainer).append(SelectElement + options + SelectElementEnd);

        //SetSelectRoute();

        return OptionContainer;
    },

    onRemove: function(map) {

    }
});