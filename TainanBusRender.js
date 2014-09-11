L.OSM = {};

var OSMAPIUrl = "http://api.openstreetmap.org/api/0.6/relation/";
var FullQuery = "/full";

var RouteLayers = [];

var currentLineColor;
var currentNodeColor;

var RouteColorSettings = {
	LineColor : [],
	NodeColor : []
}

var BusRouteLineOptions;
var BusStopNodeOptions;

function InitLeafletOptions(){

	BusRouteLineOptions = {
	color : currentLineColor,
	opacity : 1,
	clickable : false
	};

	BusStopNodeOptions = {
	color : currentNodeColor,
	opacity : 1
	};
}

function DownloadRouteMaster(id){


	//Remove all lines and markers
	if(RouteLayers.length > 0){
		for (var i = 0; i < RouteLayers.length; i++) {
			RouteLayers[i].clearLayers();
		};
	}

	$.ajax({
  		url: OSMAPIUrl + id,
  		dataType: "xml",
  		success: function (xml) {
    		var relations = new L.OSM.getRouteMaster(xml);
    		
    		for (var i = 0; i < relations.length; i++) {
    			//window.alert(relations[i]);
    			RenderRoute(relations[i]);
    		};

    		//window.alert(RouteLayers.length);
  		}
	});
}

function RenderRoute(id){

	$.ajax({
  		url: OSMAPIUrl + id + FullQuery,
  		dataType: "xml",
  		success: function (xml) {
  			//window.alert(map);
    		var layer = new L.OSM.DataLayer(xml).addTo(map);
    		map.fitBounds(layer.getBounds());

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

  initialize: function (xml, options) {
    L.Util.setOptions(this, options);

    L.FeatureGroup.prototype.initialize.call(this);

    if (xml) {
      this.addData(xml);
    }
  },

  addData: function (features) {
    if (!(features instanceof Array)) {
      features = this.buildFeatures(features);
    }

    for (var i = 0; i < features.length; i++) {
      var feature = features[i], layer;

      /*if (feature.type === "changeset") {
        layer = L.rectangle(feature.latLngBounds, this.options.styles.changeset);
      } else */
      if (feature.type === "node") {
        //layer = L.circleMarker(feature.latLng, this.options.styles.node);
        //if(this.isBusStop(feature))
        	//layer = L.marker(feature.latLng, this.options.styles.node);
        	//var busIcon = new BusStopIcon();
        	//console.log(CheckEnableBusStop());
        	if(this.CheckEnableBusStop())
        		layer = L.circleMarker(feature.latLng , BusStopNodeOptions);
      } 
      else
      {
        var latLngs = new Array(feature.nodes.length);

        for (var j = 0; j < feature.nodes.length; j++) {
          latLngs[j] = feature.nodes[j].latLng;
        }

        /*if (this.isWayArea(feature)) {
          latLngs.pop(); // Remove last == first.
          layer = L.polygon(latLngs, this.options.styles.area);
        } 
        else {*/
          layer = L.polyline(latLngs, BusRouteLineOptions);
        //}
      }

      if(layer !== undefined){
      		layer.addTo(this);
      	layer.feature = feature;
      }
    }
  },

  buildFeatures: function (xml) {
    var features = []/* = L.OSM.getChangesets(xml)*/,
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

  /*isWayArea: function (way) {
    if (way.nodes[0] != way.nodes[way.nodes.length - 1]) {
      return false;
    }

    for (var key in way.tags) {
      if (~this.options.areaTags.indexOf(key)) {
        return true;
      }
    }

    return false;
  },*/

  isBusStop:function (node) {
  	var bIsBusStop = false;

  	for(var key in node.tags){
  		if(node.tags[key] == "bus_stop"){
  			bIsBusStop = true;
  			break;
  		}
  	}

  	//window.alert(bIsBusStop);

  	return bIsBusStop;
  },

  CheckEnableBusStop:function (){

	var checked = false;
	var checkedElement = $("#ShowBusStop:checked");

	if(checkedElement.length > 0)
		checked = true;

	return checked;
  }

  /*interestingNode: function (node, ways, relations) {
    var used = false;

    for (var i = 0; i < ways.length; i++) {
      if (ways[i].nodes.indexOf(node) >= 0) {
        used = true;
        break;
      }
    }

    if (!used) {
      return true;
    }

    for (var i = 0; i < relations.length; i++) {
      if (relations[i].members.indexOf(node) >= 0)
        return true;
    }

    for (var key in node.tags) {
      if (this.options.uninterestingTags.indexOf(key) < 0) {
        return true;
      }
    }

    return false;
  }*/
});

L.Util.extend(L.OSM, {
  /*getChangesets: function (xml) {
    var result = [];

    var nodes = xml.getElementsByTagName("changeset");
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i], id = node.getAttribute("id");
      result.push({
        id: id,
        type: "changeset",
        latLngBounds: L.latLngBounds(
          [node.getAttribute("min_lat"), node.getAttribute("min_lon")],
          [node.getAttribute("max_lat"), node.getAttribute("max_lon")]),
        tags: this.getTags(node)
      });
    }

    return result;
  },*/

  getNodes: function (xml) {
    var result = {};

    var nodes = xml.getElementsByTagName("node");
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i], id = node.getAttribute("id");
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

  getWays: function (xml, nodes) {
    var result = [];

    var ways = xml.getElementsByTagName("way");
    for (var i = 0; i < ways.length; i++) {
      var way = ways[i], nds = way.getElementsByTagName("nd");

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
  
  getRouteMaster : function (xml){
  	var result = [];

  	var rels = xml.getElementsByTagName("relation");
  	for (var i = 0; i < rels.length; i++) {
      //Get all members
      var rel = rels[i];
      var members = rel.getElementsByTagName("member");

      for (var j = 0; j < members.length; j++) {
        if (members[j].getAttribute("type") === "relation")
          var singleRouteRef = members[j].getAttribute("ref");

      	  result.push(singleRouteRef);
      }
    }

    return result;
  },

  getRelations: function (xml, nodes, ways) {
    var result = [];

    var rels = xml.getElementsByTagName("relation");
    for (var i = 0; i < rels.length; i++) {
      var rel = rels[i], members = rel.getElementsByTagName("member");

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

  getTags: function (xml) {
    var result = {};

    var tags = xml.getElementsByTagName("tag");
    for (var j = 0; j < tags.length; j++) {
      result[tags[j].getAttribute("k")] = tags[j].getAttribute("v");
    }

    return result;
  }
});