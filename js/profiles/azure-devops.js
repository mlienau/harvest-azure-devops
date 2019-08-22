(function () {
    var AzureDevOpsProfile, injectScript,
        bind = function (fn, me) { return function () { return fn.apply(me, arguments); }; };

    injectScript = function (opts) {
        var name, ph, script, value;
        script = document.createElement("script");
        switch (typeof opts) {
            case "object":
                for (name in opts) {
                    value = opts[name];
                    script[name] = value;
                }
                break;
            case "string":
                script.innerHTML = opts;
        }
        ph = document.getElementsByTagName("script")[0];
        return ph.parentNode.insertBefore(script, ph);
    };

    AzureDevOpsProfile = (function () {
        function AzureDevOpsProfile(host1) {
            this.host = host1;
            this.addTimerIfOnIssue = bind(this.addTimerIfOnIssue, this);
            this.handleMutations = bind(this.handleMutations, this);
            this.listen();
            this.infect();

            var style = document.createElement("style");
            style.setAttribute("type", "text/css");
            style.innerHTML = ".harvest-overlay { z-index: 999999 !important; }";
            document.head.appendChild(style);
        }

        AzureDevOpsProfile.prototype.platformConfig = function () {
            return {
                applicationName: "Azure DevOps"
            };
        };

        AzureDevOpsProfile.prototype.listen = function () {
            document.body.addEventListener("harvest-event:ready", this.addTimerIfOnIssue);
            this.headerButton = this.createButton();
            this.headerButton.classList.add('btn-sm');
            return new MutationObserver(this.handleMutations).observe(document.body, {
                childList: true,
                subtree: true
            });
        };

        AzureDevOpsProfile.prototype.handleMutations = function (mutations) {
            var i, len, results;
            results = [];
            for (i = 0, len = mutations.length; i < len; i++) {
                // wait for work item form caption to be added
                if (mutations[i].addedNodes 
                    && mutations[i].addedNodes[0] 
                    && mutations[i].addedNodes[0].className === "info-text-wrapper"
                    && mutations[i].addedNodes[0].children[1]
                    && mutations[i].addedNodes[0].children[1].className === "caption") {
                    console.log('%cFOUND CAPTION', 'background: #f36c00; color: #ffffff;');
                    results.push((function () {
                        var results1 = [];
                        results1.push(this.addTimerIfOnIssue());
                        return results1;
                    }).call(this));
                    return results;
                }
            }

            return results;
        };

        AzureDevOpsProfile.prototype.infect = function () {
            injectScript("window._harvestPlatformConfig = " + (JSON.stringify(this.platformConfig())) + ";");
            injectScript({
                src: this.host + "/assets/platform.js",
                async: true
            });
            return document.addEventListener('pjax:end', this.addTimerIfOnIssue);
        };

        AzureDevOpsProfile.prototype.addTimerIfOnIssue = function () {
            var workItemNode = document.querySelector(".work-item-form");
            if (!workItemNode) {
                return;
            }
            
            const buttonAlreadyExists = !!workItemNode.querySelector(".harvest-timer");
            if (buttonAlreadyExists) {
                return;
            }

            // var account = ;
            var group = decodeURIComponent(location.pathname.split('/')[1]);
            var caption = workItemNode.querySelector("a.caption");
            var parts = caption.href.split("/");
            var itemId = parts[parts.length - 1];
            return this.addTimer({
                item: {
                    id: itemId,
                    name: "#" + itemId + ": " + (this.issueTitle(workItemNode))
                },
                group: {
                    id: group,
                    name: group
                },
                // account: {
                //     id: account
                // }
            });
        };

        AzureDevOpsProfile.prototype.issueTitle = function (workItemNode) {
            var input = workItemNode.querySelector("input[type='text']");
            if (input == null) {
                return void 0;
            }

            return input.value;
        };

        AzureDevOpsProfile.prototype.addTimer = function (data) {
            var el, i, len, name, permalink, ref;
            for (name in data) {
                this.headerButton.dataset[name] = JSON.stringify(data[name]);
            }
            account = data.account, group = data.group, item = data.item;
            var caption = document.querySelector("a.caption");
            var permalink = caption.href;
            this.headerButton.removeAttribute('data-listening');
            this.headerButton.setAttribute('data-permalink', permalink);
            ref = document.querySelectorAll('.harvest-timer');
            for (i = 0, len = ref.length; i < len; i++) {
                el = ref[i];
                if (el !== this.headerButton) {
                    el.remove();
                }
            }
            if (caption != null) {
                caption.parentElement.appendChild(this.headerButton);
            }
            return this.notifyPlatformOfNewTimers();
        };

        AzureDevOpsProfile.prototype.createButton = function () {
            var button;
            button = document.createElement("button");
            button.type = "button";
            button.style = "background: #f36c00; border: none; color: #ffffff; cursor: pointer;";
            button.type = "button";
            button.classList.add('harvest-timer', 'btn');
            button.setAttribute("data-skip-styling", "true");
            button.innerHTML = "<svg style=\"fill: #ffffff; vertical-align: sub;\" aria-hidden=\"true\" class=\"octicon octicon-clock\" height=\"16\" role=\"img\" version=\"1.1\" viewBox=\"0 0 14 16\" width=\"14\"><path d=\"M8 8h3v2H7c-0.55 0-1-0.45-1-1V4h2v4z m-1-5.7c3.14 0 5.7 2.56 5.7 5.7S10.14 13.7 7 13.7 1.3 11.14 1.3 8s2.56-5.7 5.7-5.7m0-1.3C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7S10.86 1 7 1z\"></path></svg>\nTrack time";
            return button;
        };

        AzureDevOpsProfile.prototype.notifyPlatformOfNewTimers = function () {
            var evt, ref;
            evt = new CustomEvent("harvest-event:timers:chrome:add");
            return (ref = document.querySelector("#harvest-messaging")) != null ? ref.dispatchEvent(evt) : void 0;
        };

        return AzureDevOpsProfile;
    })();

    chrome.runtime.sendMessage({ type: "getHost" }, function (host) {
        return new AzureDevOpsProfile(host);
    });
}).call(this);
