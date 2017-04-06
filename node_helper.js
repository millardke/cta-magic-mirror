const request = require("request");
const _ = require("underscore");
const NodeHelper = require("node_helper");
const moment = require("moment");

module.exports = NodeHelper.create({
	baseUrl: "http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx",

	start: function() {
		console.log("Starting module: " + this.name);
	},

	socketNotificationReceived: function(notification, payload) {
        if(notification === "CTA_ARRIVALS"){
            this.config = payload;
            this.getData();
            setInterval(() => {
                this.getData();
            }, this.config.updateInterval);
        }
    },

    getData: function() {
        var data = [];

        for(var i = 0; i < this.config.stpid.length; i++) {
            var url = this.baseUrl + "?key=" + this.config.apikey;

            if(this.config.mapid) {
                url += "&mapid=" + this.config.mapid;
            }
            
            url += "&stpid=" + this.config.stpid[i];

            if(this.config.max) {
                url += "&max=" + this.config.max;
            }

            url += "&outputType=JSON";

            request(url, (error, response, body) => {
                if (response.statusCode === 200) {
                    var parse = JSON.parse(body);
                    
                    if(typeof parse.ctatt !== undefined) {
                        var alteredData = this.handleData(parse.ctatt.eta);
                        data = _.union(data, alteredData);
                        this.sendData(data);
                    } else {
                        console.log("No CTA data");
                    }
                } else {
                    console.log("Error getting CTA data " + response.statusCode);
                }
            });
        }
    },

    handleData: function(data) {
        var arrivals = [];

        if(data) {
            for(var index = 0; index < data.length; index++) {                
                var arrival = data[index];

                var diff = moment.duration(moment().diff(arrival.arrT));
                var minutes = Math.ceil(diff.asMinutes()) * -1;
                
                if(minutes >= 5) {
                    arrivals.push({
                        rt: arrival.rt,
                        staNm: arrival.staNm,
                        stpDe: arrival.stpDe,
                        arrT: arrival.arrT
                    });
                }
            }
        }

        return arrivals;
    },

    sendData: function(data) {
 		this.sendSocketNotification("CTA_ARRIVALS", data);
    }
});