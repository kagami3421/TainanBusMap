//Resource Paths
var categoryJsonUrl = "LocalData/MainCategory";
var routeJsonUrl = "LocalData/BusRoute";
var routeJsonExtension = ".json";

var map = L.map('map').setView([23.1852, 120.4287], 11);

var currentRouteRelation; // Current Selected Route Array
var currentSelectedRoute; // Current Selected Route Number

var RouteDownloadManager;

$(document).ready(function() {

    $('select').selectpicker();

    //Render Map
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
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
            RouteDownloadManager.InitAllIconsOption(item.categoryIndex);
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
    RouteDownloadManager.InitLeafletOptions(id);

    $.getJSON(routeJsonUrl + id + routeJsonExtension, function(data) {
        $.each(data, function(i, item) {
            if (L.Browser.webkit || L.Browser.ie)
                routeList.append($('<option></option>').text(item.RouteFromTo).attr('value', item.RouteOSMRelation).attr('label', item.RouteName));
            else
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
    if (L.Browser.webkit || L.Browser.ie)
        SelectedRoute = $("#SelectRoute option:selected").text();
    else
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
        RouteDownloadManager.DownloadRouteMaster(currentSelectedRoute, true);
    else
        RouteDownloadManager.DownloadRouteMaster(currentSelectedRoute, false);
}
