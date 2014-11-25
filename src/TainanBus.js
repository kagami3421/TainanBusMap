//Resource Paths
var routeJsonUrl = "LocalData/BusRoute";

var currentSelectedRoute; // Current Selected Route Number
var currentColorScheme;
var ColorSchemeCollect = [];

var RouteDownloadManager;

var RelatimeQueryUrl = "http://www.2384.com.tw/qrcode/vstop";

$(document).ready(function() {

    map = L.map('map').setView([23.1852, 120.4287], 11);

    $('select').selectpicker();

    //Render Map
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: MapAttribution
    }).addTo(map);

    //ShowOptions
    InitCategories();

    $('#SelectCategory').change(function() {
        ChangeCategory();
    });

    $('#SelectRoute').change(function() {
        SetSelectedRoute();
    });

    $('input[name="dirctions"]:radio').change(function() {
        SetSelectDirection();
        //console.log("Change!");
    });

    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
});

//Function Section-----------------------
function InitCategories() {
    RouteDownloadManager = new L.TainanBus.RenderManager();

    $.getJSON(categoryJsonUrl + routeJsonExtension, function(data) {

        var categoryList = $("#SelectCategory").empty();

        $.each(data, function(i, item) {
            //window.alert(item.categoryName);
            categoryList.append($('<option></option>').text(item.categoryName).attr('value', item.categoryIndex));

            //window.alert(RouteColorSettings["LineColor"]);
            RouteDownloadManager.InitStopIconOption(item.categoryIndex);
            //Save Color Setting
            var ColorScheme = {
                MainLineColor: item.categoryLineColor,
                ExtendLineColor: item.categoryLineColor2
            }
            ColorSchemeCollect.push(ColorScheme);
        });

        $('#SelectCategory').selectpicker('refresh');

        //Init Default Route List
        SetRoutesList(1);
    });
}

function ChangeCategory() {
    var SelectedId = $("#SelectCategory option:selected").attr('value');
    if (SelectedId !== undefined) {
        //window.alert("Coming!");
        SetRoutesList(SelectedId);
    }
}

function SetRoutesList(id) {
    var routeList = $("#SelectRoute").empty();

    currentColorScheme = ColorSchemeCollect[id - 1];

    //console.log(currentLineColor);

    //Change Color
    RouteDownloadManager.InitLeafletOption(id, currentColorScheme);

    $.getJSON(routeJsonUrl + id + routeJsonExtension, function(data) {
        $.each(data, function(i, item) {
            routeList.append($('<option></option>').text(item.RouteName).attr('value', item.RouteOSMRelation).attr('label', item.RouteFromTo));
        });

        $('#SelectRoute').selectpicker('refresh');

        SetSelectedRoute();
    });
}

function SetSelectedRoute() {
    var description = $("#RouteDes").empty();
    var SelectedRoute;
    //window.alert($("#SelectRoute option:selected").attr('label'));
    SelectedRoute = $("#SelectRoute option:selected").attr('label');

    currentSelectedRoute = $("#SelectRoute option:selected").attr('value');

    if (SelectedRoute !== undefined && description !== undefined) {
        description.text(SelectedRoute);
        //window.alert(SelectedRouteID);
        SetSelectDirection();
    }
}

function SetSelectDirection() {
    var dir = $('input[name="dirctions"]:checked').val();

    if (dir == "forward")
        RouteDownloadManager.DownloadRouteMaster(currentSelectedRoute, true, null);
    else
        RouteDownloadManager.DownloadRouteMaster(currentSelectedRoute, false, null);
}

function QueryRealtimeBus(stopCode) {

    window.alert("無法使用!");
    /*if (stopCode === 0)
        window.alert("無站牌號碼!");
    else {
        $.ajax({
            url: RelatimeQueryUrl,
            dataType: "html",
            data: {
                code: stopCode
            },
            success: function(html) {
                bootbox.dialog({
                    title: "11",
                    message: $("table[border*='0']").html()
                });
            },
            error: function() {

            }
        })
    }*/
}
