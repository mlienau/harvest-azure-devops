import PlatformCookie from "./js/background/cookie.js";

(function() {
  var PlatformExtension,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  PlatformExtension = (function() {
    PlatformExtension.prototype.host = "platform.harvestapp.com"; // "dev.azure.com" // window.host;

    PlatformExtension.prototype.version = (chrome ?? browser).runtime.getManifest().version;

    PlatformExtension.prototype.pollLength = 20;

    function PlatformExtension() {
      this.installed = bind(this.installed, this);
      this.stopPolling = bind(this.stopPolling, this);
      this.getTimerStatus = bind(this.getTimerStatus, this);
      this.handleHeaders = bind(this.handleHeaders, this);
      this.handleMessage = bind(this.handleMessage, this);
      this.cookie = new PlatformCookie();

      (chrome ?? browser).runtime.onMessage.addListener(this.handleMessage);
      (chrome ?? browser).runtime.onInstalled.addListener(this.installed);
      (chrome ?? browser).webRequest.onCompleted.addListener(() => {
        const url = "https://dev.azure.com/*/_boards/*";
        (chrome ?? browser).tabs.query({ url }, (tabs) => {
            setTimeout(() => {
                for (const tab of tabs) {
                    (chrome ?? browser).tabs.sendMessage(tab.id, { type: "work_items_loaded" });
                }
            },50);
        });
      }, {
        urls: [
          'https://dev.azure.com/*/_apis/wit/workItemsBatch',
          'https://dev.azure.com/*/_apis/work/boards/boardparents*',
        ]
      })
    }

    PlatformExtension.prototype.handleMessage = function(message, _sender, respond) {
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
        case 'window:online':
          return this.getTimerStatus();
        case 'window:offline':
          return this.stopPolling();
        case 'login:change':
          return this.getTimerStatus();
      }
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
      const state = running ? "on" : "off";
      (chrome ?? browser).action.setIcon({
        path: {
          "19": "images/h-toolbar-" + state + "@19px.png",
          "38": "images/h-toolbar-" + state + "@38px.png"
        }
      });
      return (chrome ?? browser).action.setTitle({
        title: running ? "View the running Harvest timer" : "Start a Harvest timer"
      });
    };

    PlatformExtension.prototype.installed = function(arg) {
      switch (arg.reason) {
        case 'install':
          return (chrome ?? browser).tabs.create({
            url: `https://www.getharvest.com/harvest-for-chrome-installed?version=${this.version}`
          });
        case 'update':
          return console.log(`Upgrade notice: ${arg.previousVersion} upgraded to ${this.version}`);
      }
    };

    return PlatformExtension;

  })();

  new PlatformExtension();
//   chrome.contextMenus.create({
//       id: 'foo',
//       title: 'first',
//       contexts: ['action']
//     })
    
//     function contextClick(info, tab) {
//       const { menuItemId } = info
    
//       if (menuItemId === 'foo') {
//         // do something
//       }
//     }
    
//     chrome.contextMenus.onClicked.addListener(contextClick)

}).call(this);