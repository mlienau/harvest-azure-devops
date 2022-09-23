import PlatformCookie from "./js/background/cookie.js";

(function () {
    class PlatformExtension {
        host = "platform.harvestapp.com"; // "dev.azure.com" // window.host;
        isOnline = true;
        pollLength = 20;
        version = (chrome ?? browser).runtime.getManifest().version;

        constructor() {
            (chrome ?? browser).runtime.onMessage.addListener(this.handleMessage);
            (chrome ?? browser).runtime.onInstalled.addListener(this.installed);
            (chrome ?? browser).webRequest.onCompleted.addListener(() => {
                const url = "https://dev.azure.com/*/_boards/*";
                (chrome ?? browser).tabs.query({ url }, (tabs) => {
                    setTimeout(() => {
                        for (const tab of tabs) {
                            (chrome ?? browser).tabs.sendMessage(tab.id, { type: "work_items_loaded" });
                        }
                    }, 50);
                });
            }, {
                urls: [
                    'https://dev.azure.com/*/_apis/wit/workItemsBatch',
                    'https://dev.azure.com/*/_apis/work/boards/boardparents*',
                ]
            });

            this.cookie = new PlatformCookie(this.getTimerStatus);
        }

        handleMessage = (message, _sender, respond) => {
            switch (message?.type) {
                case 'getHost':
                    return respond(this.host);
                case 'timer:started':
                    return this.setRunningTimerIcon(true);
                case 'timer:stopped':
                    return this.setRunningTimerIcon(false);
                case 'window:online':
                    this.isOnline = true;
                    return this.getTimerStatus();
                case 'window:offline':
                    this.isOnline = false;
                    return this.stopPolling();
                case 'login:change':
                    return this.getTimerStatus();
            }
        };

        isCSPHeader(header) {
            return /^content-security-policy$/i.test(header.name);
        };

        getTimerStatus = () => {
            clearTimeout(this.pendingPoll);
            if (!this.isOnline) {
                return;
            }

            fetch(`https://${this.host}/platform/last_running_timer.json`, {
                credentials: 'include'
            })
            .then(r => r.json())
            .then(r => {
                console.log("RESPONSE", r);
            })
            .catch((e) => {
                // console.error(e);
                this.pendingPoll = setTimeout(this.getTimerStatus, this.pollLength * 1000);
            })

            // const xhr = new XMLHttpRequest();
            // xhr.onload = () => {
            //     console.log("XHR onload", xhr);
            //     if (xhr.status === 401) {
            //         this.stopPolling();
            //         this.setRunningTimerIcon(false);
            //     } else {
            //         this.pendingPoll = setTimeout(this.getTimerStatus, this.pollLength * 1000);
            //     }

            //     if (xhr.status === 200) {
            //         return this.setRunningTimerIcon(((function () {
            //             try {
            //                 return JSON.parse(xhr.responseText);
            //             } catch (_error) { }
            //         })()) != null);
            //     }
            // };
            // xhr.onerror = () => {
            //     this.pendingPoll = setTimeout(this.getTimerStatus, this.pollLength * 1000);
            // };
            // xhr.open('get', `${this.host}/platform/last_running_timer.json`);
            // xhr.withCredentials = true;
            // xhr.setRequestHeader("X-HarvestChromeExt", this.version);
            // return xhr.send();
        };

        stopPolling = () => {
            return clearTimeout(this.pendingPoll);
        };

        setRunningTimerIcon(running) {
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
        }

        installed = (arg) => {
            switch (arg.reason) {
                case 'install':
                    return (chrome ?? browser).tabs.create({
                        url: `https://www.getharvest.com/harvest-for-chrome-installed?version=${this.version}`
                    });
                case 'update':
                    return console.log(`Upgrade notice: ${arg.previousVersion} upgraded to ${this.version}`);
            }
        }
    };

    new PlatformExtension();

}).call(this);