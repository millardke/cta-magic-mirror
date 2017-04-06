/* Custom Module */

/* Magic Mirror
 * Module: CTA
 *
 * By Kevin Millard
 * MIT Licensed.
 */

 Module.register("ctatrain", {
 	defaults: {
 		apiBase: "http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx",
 		animationSpeed: 1000,
 		initialLoadDelay: 2500,
 		updateInterval : 60 * 1000 * 600
 	},

 	getScripts: function() {
        return ["moment.js"];
    },

 	getStyles: function() {
 		return ["ctatrain.css"];
 	},

 	start: function() {
 		Log.info("Starting modulessss: " + this.name);
 		moment.locale(config.language);

 		setInterval(() => {
 			this.updateDom(300);
 		}, this.config.updateInterval);

 		this.sendSocketNotification("CTA_ARRIVALS", this.config);
 	},

 	socketNotificationReceived: function (notification, payload) {
        if (notification === "CTA_ARRIVALS") {
            this.arrivals = payload;
            this.loaded = true;
            this.updateDom(300);
        }
    },

 	getDom: function() {
 		Log.info('getdom');
 		var wrapper = document.createElement("div");

 		if(this.config.apikey === "") {
 			wrapper.innerHTML = "Please register your api key in the config for module: " + this.name + ".";
 			wrapper.className = "dimmed light small";
 			return wrapper;
 		}

 		if(!this.loaded) {
 			wrapper.innerHTML = this.translate('LOADING');
 			wrapper.className = "dimmed light small";
 			return wrapper;
 		}

 		var table = document.createElement("div");
 		table.className = "small table";

 		for(var index in this.arrivals) {
 			var arrival = this.arrivals[index];

 			var row = document.createElement("div");
            row.className = "row";
 			table.appendChild(row);

 			var stationName = document.createElement("div");
 			stationName.className = "name " + arrival.rt + "-line";
 			stationName.innerHTML = arrival.staNm;
 			row.appendChild(stationName);

 			var stationArrival = document.createElement("div");
 			stationArrival.className = "arrival";
 			stationArrival.innerHTML = arrival.stpDe + " in " + moment().to(arrival.arrT);
 			
            row.appendChild(stationArrival);
 		}

 		return table;
 	}
 });