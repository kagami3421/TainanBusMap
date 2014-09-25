L.OSM = {};

var OSMAPIUrl = "http://api.openstreetmap.org/api/0.6/relation/";
var FullQuery = "/full";

var BusIcon = "Icons/busIcon";
var BusIcon_Ext = ".png";

//Collect All Markers and Lines
var RouteLayers = [];

var currentColorScheme;
var currentBusMarker;
var ColorSchemeCollect = [];

var BusMainRouteLineOptions;
var BusExtendRouteLineOptions;

var BusIconOptions = [];

var IconTemplate = L.Icon.extend({
    options: {
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    }
});

function InitAllIconsOption(value) {
    var tmpIcon = new IconTemplate({
        iconUrl: BusIcon + value + BusIcon_Ext
    });

    BusIconOptions.push(tmpIcon);
}

function InitLeafletOptions(id) {

    currentBusMarker = BusIconOptions[id - 1];

    BusMainRouteLineOptions = {
        color: currentColorScheme.MainLineColor,
        opacity: 1,
        clickable: false
    };

    BusExtendRouteLineOptions = {
        color: currentColorScheme.ExtendLineColor,
        opacity: 1,
        clickable: false
    }
}

function DownloadRouteMaster(id, dir) {


    //Remove all lines and markers
    if (RouteLayers.length > 0) {
        for (var i = 0; i < RouteLayers.length; i++) {
            RouteLayers[i].clearLayers();
        };
    }

    $.ajax({
        url: OSMAPIUrl + id,
        dataType: "xml",
        success: function(xml) {
            currentRouteRelation = new L.OSM.getRoutesInMaster(xml);

            for (var i = 0; i < currentRouteRelation.length; i++) {
                if (currentRouteRelation[i].Direction === dir)
                    RenderRoute(currentRouteRelation[i].Ref, currentRouteRelation[i].Extend);
            };
        }
    });
}

function RenderRoute(id, isExtend) {

    $.ajax({
        url: OSMAPIUrl + id + FullQuery,
        dataType: "xml",
        success: function(xml) {
            //window.alert(map);
            var layer = new L.OSM.DataLayer(xml, isExtend).addTo(map);
            map.fitBounds(layer.getBounds());

            //console.log(isExtend);

            RouteLayers.push(layer);

            //window.alert(RouteLayers.length);
        }
    });
}

L.OSM.DataLayer = L.FeatureGroup.extend({
    options: {
        //areaTags: ['area', 'building', 'leisure', 'tourism', 'ruins', 'historic', 'landuse', 'military', 'natural', 'sport'],
        uninterestingTags: ['source', 'source_ref', 'source:ref', 'history', 'attribution', 'created_by', 'tiger:county', 'tiger:tlid', 'tiger:upload_uuid'],
        styles: {}
    },

    initialize: function(xml, isExtend, options) {
        L.Util.setOptions(this, options);

        //console.log(isExtend);

        L.FeatureGroup.prototype.initialize.call(this);

        if (xml) {
            this.addData(xml, isExtend);
        }
    },

    addData: function(features, isExtend) {

        var MakerClusterOptions = {
            showCoverageOnHover: false,
            maxClusterRadius: 20
        }

        var markers = new L.MarkerClusterGroup(MakerClusterOptions);

        if (!(features instanceof Array)) {
            features = this.buildFeatures(features);
        }

        for (var i = 0; i < features.length; i++) {
            var feature = features[i],
                layer;

            /*if (feature.type === "changeset") {
        layer = L.rectangle(feature.latLngBounds, this.options.styles.changeset);
      } else */
            if (feature.type === "node") {
                //layer = L.circleMarker(feature.latLng, this.options.styles.node);
                //if(this.isBusStop(feature))
                //layer = L.marker(feature.latLng, this.options.styles.node);
                //var busIcon = new BusStopIcon();
                //console.log(CheckEnableBusStop());
                if (this.CheckEnableBusStop()) {

                    var MarkerOption = {
                        icon: currentBusMarker,
                        opacity: 1,
                        zIndexOffset: 1000,
                        title: this.GetBusStopName(feature.tags)
                    }

                    //layer = L.marker(feature.latLng , MarkerOption).bindPopup(this.GetBusStopName(feature.tags));
                    markers.addLayer(L.marker(feature.latLng, MarkerOption).bindPopup(this.GetBusStopName(feature.tags)));
                }
            } else {
                var latLngs = new Array(feature.nodes.length);

                for (var j = 0; j < feature.nodes.length; j++) {
                    latLngs[j] = feature.nodes[j].latLng;
                }

                if (isExtend == false)
                    layer = L.polyline(latLngs, BusMainRouteLineOptions);
                else
                    layer = L.polyline(latLngs, BusExtendRouteLineOptions);
            }

            if (layer !== undefined) {
                layer.addTo(this);
                layer.feature = feature;
            }
        }

        if (markers !== undefined)
            markers.addTo(this);
    },

    buildFeatures: function(xml) {
        var features = [] /* = L.OSM.getChangesets(xml)*/ ,
            nodes = L.OSM.getNodes(xml),
            ways = L.OSM.getWays(xml, nodes),
            relations = L.OSM.getRelations(xml, nodes, ways);

        for (var node_id in nodes) {
            var node = nodes[node_id];
            if (this.isBusStop(node)) {
                features.push(node);
            }
        }

        for (var i = 0; i < ways.length; i++) {
            var way = ways[i];
            features.push(way);
        }

        return features;
    },

    isBusStop: function(node) {
        var bIsBusStop = false;

        for (var key in node.tags) {
            if (node.tags[key] == "bus_stop") {
                bIsBusStop = true;
                break;
            }
        }

        //window.alert(bIsBusStop);

        return bIsBusStop;
    },

    CheckEnableBusStop: function() {

        var checked = false;
        var checkedElement = $("#ShowBusStop:checked");

        if (checkedElement.length > 0)
            checked = true;

        return checked;
    },

    GetBusStopName: function(tags) {
        var Name;

        for (var key in tags) {
            if (key == "name") {
                Name = tags[key];
                break;
            }
            //console.log(key);
        }

        return Name;
    }

});

L.Util.extend(L.OSM, {

    getNodes: function(xml) {
        var result = {};

        var nodes = xml.getElementsByTagName("node");
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i],
                id = node.getAttribute("id");
            result[id] = {
                id: id,
                type: "node",
                latLng: L.latLng(node.getAttribute("lat"),
                    node.getAttribute("lon"),
                    true),
                tags: this.getTags(node)
            };
        }

        return result;
    },

    getWays: function(xml, nodes) {
        var result = [];

        var ways = xml.getElementsByTagName("way");
        for (var i = 0; i < ways.length; i++) {
            var way = ways[i],
                nds = way.getElementsByTagName("nd");

            var way_object = {
                id: way.getAttribute("id"),
                type: "way",
                nodes: new Array(nds.length),
                tags: this.getTags(way)
            };

            for (var j = 0; j < nds.length; j++) {
                way_object.nodes[j] = nodes[nds[j].getAttribute("ref")];
            }

            result.push(way_object);
        }

        return result;
    },

    getRoutesInMaster: function(xml) {
        var results = [];

        var rels = xml.getElementsByTagName("relation");
        for (var i = 0; i < rels.length; i++) {
            //Get all members
            var rel = rels[i];
            var members = rel.getElementsByTagName("member");

            for (var j = 0; j < members.length; j++) {
                if (members[j].getAttribute("type") === "relation") {

                    var ExtendBool = false;
                    var Dir = "forward";

                    switch (members[j].getAttribute("role")) {
                        case "forward":
                            {
                                Dir = true;
                                ExtendBool = false;
                            }
                            break;

                        case "backward":
                            {
                                Dir = false;
                                ExtendBool = false;
                            }
                            break;

                        case "forward_extend":
                            {
                                Dir = true;
                                ExtendBool = true;
                            }
                            break;

                        case "backward_extend":
                            {
                                Dir = false;
                                ExtendBool = true;
                            }
                            break;
                    }

                    var SingleResult = {
                        Ref: members[j].getAttribute("ref"),
                        Extend: ExtendBool,
                        Direction: Dir
                    }

                    results.push(SingleResult);
                }
            }
        }
        
        return results;
    },

    getRelations: function(xml, nodes, ways) {
        var result = [];

        var rels = xml.getElementsByTagName("relation");
        for (var i = 0; i < rels.length; i++) {
            var rel = rels[i],
                members = rel.getElementsByTagName("member");

            var rel_object = {
                id: rel.getAttribute("id"),
                type: "relation",
                members: new Array(members.length),
                tags: this.getTags(rel)
            };

            for (var j = 0; j < members.length; j++) {
                if (members[j].getAttribute("type") === "node")
                    rel_object.members[j] = nodes[members[j].getAttribute("ref")];
                else // relation-way and relation-relation membership not implemented
                    rel_object.members[j] = null;
            }

            result.push(rel_object);
        }

        return result;
    },

    getTags: function(xml) {
        var result = {};

        var tags = xml.getElementsByTagName("tag");
        for (var j = 0; j < tags.length; j++) {
            result[tags[j].getAttribute("k")] = tags[j].getAttribute("v");
        }

        return result;
    }
});
