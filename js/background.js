(function() {
  var PlatformCookie, PlatformExtension,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  PlatformCookie = this.PlatformCookie;

  PlatformExtension = (function() {
    PlatformExtension.prototype.host = window.host;

    PlatformExtension.prototype.version = chrome.app.getDetails().version;

    PlatformExtension.prototype.pollLength = 20;

    PlatformExtension.prototype.splashUrl = 'https://www.getharvest.com/harvest-for-chrome-installed';

    function PlatformExtension() {
      this.installed = bind(this.installed, this);
      this.stopPolling = bind(this.stopPolling, this);
      this.getTimerStatus = bind(this.getTimerStatus, this);
      this.handleHeaders = bind(this.handleHeaders, this);
      this.handleMessage = bind(this.handleMessage, this);
      window.addEventListener("online", this.getTimerStatus);
      window.addEventListener("offline", this.stopPolling);
      document.addEventListener("login:change", this.getTimerStatus);
      new PlatformCookie();
      chrome.runtime.onMessage.addListener(this.handleMessage);
      chrome.runtime.onInstalled.addListener(this.installed);
      chrome.webRequest.onHeadersReceived.addListener(this.handleHeaders, {
        urls: ['https://github.com/*'],
        types: ['main_frame']
      }, ['blocking', 'responseHeaders']);
    }

    PlatformExtension.prototype.handleMessage = function(message, sender, respond) {
      switch (message != null ? message.type : void 0) {
        case 'getHost':
          return respond(this.host);
        case 'getHostIfEnabled':
          if (message != null ? message.featureFlag : void 0) {
            fetch(this.host + "/platform/feature_enabled.json?name=" + message.featureFlag, {
              credentials: "include"
            }).then((function(_this) {
              return function(response) {
                if (!response.ok) {
                  return;
                }
                return response.json().then(function(data) {
                  return respond(data.enabled ? _this.host : false);
                });
              };
            })(this));
            return true;
          }
          break;
        case 'timer:started':
          return this.setRunningTimerIcon(true);
        case 'timer:stopped':
          return this.setRunningTimerIcon(false);
      }
    };

    PlatformExtension.prototype.handleHeaders = function(arg) {
      var header, i, len, responseHeaders;
      responseHeaders = arg.responseHeaders;
      for (i = 0, len = responseHeaders.length; i < len; i++) {
        header = responseHeaders[i];
        this.handleHeader(header);
      }
      return {
        responseHeaders: responseHeaders
      };
    };

    PlatformExtension.prototype.handleHeader = function(header) {
      var ref;
      if (!this.isCSPHeader(header)) {
        return;
      }
      return header.value = ((ref = header.value) != null ? ref : '').replace(/(child|connect|script|style|img|frame)-src/ig, function(match) {
        return match + " " + (this.host.replace("platform", "*")) + " https://*.getharvest.com http://*.getharvest.dev";
      });
    };

    PlatformExtension.prototype.isCSPHeader = function(header) {
      return /^content-security-policy$/i.test(header.name);
    };

    PlatformExtension.prototype.getTimerStatus = function() {
      var xhr;
      clearTimeout(this.pendingPoll);
      if (!navigator.onLine) {
        return;
      }
      xhr = new XMLHttpRequest;
      xhr.onload = (function(_this) {
        return function() {
          if (xhr.status === 401) {
            _this.stopPolling();
            _this.setRunningTimerIcon(false);
          } else {
            _this.pendingPoll = setTimeout(_this.getTimerStatus, _this.pollLength * 1000);
          }
          if (xhr.status === 200) {
            return _this.setRunningTimerIcon(((function() {
              try {
                return JSON.parse(xhr.responseText);
              } catch (_error) {}
            })()) != null);
          }
        };
      })(this);
      xhr.onerror = (function(_this) {
        return function() {
          return _this.pendingPoll = setTimeout(_this.getTimerStatus, _this.pollLength * 1000);
        };
      })(this);
      xhr.open('get', this.host + "/platform/last_running_timer.json");
      xhr.withCredentials = true;
      xhr.setRequestHeader("X-HarvestChromeExt", this.version);
      return xhr.send();
    };

    PlatformExtension.prototype.stopPolling = function() {
      return clearTimeout(this.pendingPoll);
    };

    PlatformExtension.prototype.setRunningTimerIcon = function(running) {
      var state;
      state = running ? "on" : "off";
      chrome.browserAction.setIcon({
        path: {
          "19": "images/h-toolbar-" + state + "@19px.png",
          "38": "images/h-toolbar-" + state + "@38px.png"
        }
      });
      return chrome.browserAction.setTitle({
        title: running ? "View the running Harvest timer" : "Start a Harvest timer"
      });
    };

    PlatformExtension.prototype.installed = function(arg) {
      var previousVersion, reason;
      reason = arg.reason, previousVersion = arg.previousVersion;
      switch (reason) {
        case 'install':
          return chrome.tabs.create({
            url: this.splashUrl + "?version=" + this.version
          });
        case 'update':
          return console.log("Upgrade notice: " + previousVersion + " upgraded to " + this.version);
      }
    };

    return PlatformExtension;

  })();

  new PlatformExtension();

}).call(this);
