(function () {
    var AzureDevOpsProfile, injectScript,
        bind = function (fn, me) { return function () { return fn.apply(me, arguments); }; };
    const harvestTileContainerClassName = "tile-harvest-container";

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

        const portalHost = document.querySelector(".bolt-portal-host");
        AzureDevOpsProfile.prototype.handleMutations = function (mutations) {
            var i, len, results;
            results = [];
            for (i = 0, len = mutations.length; i < len; i++) {
                const addedNodes = mutations[i]?.addedNodes[0];
                if (!addedNodes) {
                    continue;
                }

                // console.log("addedNodes", addedNodes);

                // wait for work item form caption to be added
                if (addedNodes.className === "info-text-wrapper"
                    && addedNodes.children?.[1]?.className === "caption") {
                    console.log('%cFOUND CAPTION', 'background: #f36c00; color: #ffffff;');
                    results.push((function () {
                        var results1 = [];
                        results1.push(this.addTimerIfOnIssue());
                        return results1;
                    }).call(this));
                    // return results;
                }

                // if (addedNodes.className?.includes("bolt-menu-portal")) {
                //     console.log("addednodes", addedNodes);
                // }
                if (addedNodes?.innerHTML?.includes("Copy full SHA")) {
                    console.log("copy full sha!", addedNodes?.innerHTML);
                }

                if (addedNodes?.className?.includes("bolt-table-row")) {
                    console.log("bolt-table-row", addedNodes);
                }

                // if (addedNodes?.classList?.contains("repos-commits-table")) {
                //     console.group("Commits TOP Level")
                //     console.log("table", addedNodes);
                //     const commitNodes = Array.from(addedNodes.querySelectorAll("tbody a.bolt-table-row"));
                //     console.log("commits", commitNodes);
                //     // this.addTimerButtonToCommitRow(commitNodes);
                //     console.groupEnd();
                // }

                for (let j = 0; j < mutations[i].addedNodes.length; j++) {
                    const element = mutations[i].addedNodes[j];
                    
                    // Board Tiles
                    if (element.className?.includes("board-tile")) {
                        if (element.querySelector("." + harvestTileContainerClassName)) {
                            console.log(".board-tile harvest container already exists");
                            continue;
                        }

                        results.push((() => {
                            var results1 = [];
                            results1.push(this.addTimerToTile(element));
                            return results1;
                        }).call(this));
                    }

                    // Commit List Items
                    if (element.tagName === "a"
                        && element.classList?.contains("bolt-table-row")
                        && (element.href ?? "").includes("/commit/")
                    ) {
                        results.push((() => {
                            var results1 = [];
                            results1.push(this.addTimerButtonToCommitRow(element));
                            return results1;
                        }).call(this));
                    }

                    // if (element.classList?.contains("repos-commits-table")) {
                    //     console.log("2. repos-commits-table", element);
                    //     console.log("2. table items", element.querySelectorAll("tbody a.bolt-table-row"));
                    // }

                    // if (element.tagName === "a" && element.className?.includes("bolt-table-row")) {
                    //     console.log("3. commit", element);
                    //     console.log("3. commit href", location.href);;
                    // }
                }
            }

            console.log("results.length", results.length);
            if (results.length > 0) {
                this.notifyPlatformOfNewTimers();
            }

            return results;
        };

        AzureDevOpsProfile.prototype.infect = function () {
            injectScript("window._harvestPlatformConfig = " + (JSON.stringify(this.platformConfig())) + ";");
            injectScript({
                src: this.host + "/assets/platform.js",
                async: true
            });

            document.addEventListener("click", function(e) {
                if (e.target?.className !== "harvest-copy-button") {
                    return;
                }

                const isPlainText = e.target.hasAttribute("data-harvest-plain-text-copy");
                const content = e.target.parentElement.parentElement;;
                console.log("content", content);
                console.log("isPlainText", isPlainText);
                const workItemId = content.querySelector(".id")?.innerText;
                const clickableTitle = content.querySelector(".clickable-title-link");
                const workItemName = clickableTitle?.innerText;

                const textPlain = `#${workItemId} - ${workItemName}`;
                function copyToClipboard(str) {
                    /** @param {ClipboardEvent} e */
                    function listener(e) {
                        e.clipboardData.setData("text/html", str);
                        e.clipboardData.setData("text/plain", textPlain);
                        e.preventDefault();
                    }
                    document.addEventListener("copy", listener);
                    document.execCommand("copy");
                    document.removeEventListener("copy", listener);
                }

                if (isPlainText) {
                    navigator.clipboard.writeText(textPlain);
                } else {
                    const { href }  = clickableTitle;
                    copyToClipboard(`<a href="${href}">#${workItemId}</a> - ${workItemName}`);
                }

                // copyToClipboard();

                e.target.innerHTML = "Copied!";
                e.target.disabled = true;
                e.target.style.cursor = "default";
                setTimeout(() => {
                    e.target.innerHTML = `<span class="bowtie-icon bowtie-${isPlainText ? "edit-copy" : "link"}" style="pointer-events: none;"></span>`;
                    e.target.disabled = false;
                    e.target.style.cursor = "pointer";
                }, 500);
            });

            const commits = document.querySelectorAll(".repos-commits-table tbody a.bolt-table-row");
            console.log("commits", commits);
            Array.from(commits).forEach(node => this.addTimerButtonToCommitRow(node));

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

            var caption = workItemNode.querySelector("a.caption");
            if (!caption) {
                return;
            }

            var parts = caption.href.split("/");
            var itemId = parts[parts.length - 1];
            return this.addTimer({
                id: itemId,
                name: `#${itemId}: ${workItemNode.querySelector("input[type='text']")?.value}`
            });
        };

        AzureDevOpsProfile.prototype.addTimerToTile = function (boardTile) {
            // console.log(addedNodes);
            const content = boardTile?.querySelector(".board-tile-content");
            if (!content) {
                console.log("DID NOT FIND BOARD TILE CONTENT");
                return;
            }

            if (content.querySelector("." + harvestTileContainerClassName)) {
                console.log("harvest container already exists");
                return;
            }

            const harvestTileContainer = document.createElement("div");
            function addCopyButton(isPlainText) {
                const copyButton = document.createElement("button");
                copyButton.className = "harvest-copy-button";
                if (isPlainText) {
                    copyButton.setAttribute("data-harvest-plain-text-copy", "true");
                }

                copyButton.style.padding = "5px";
                copyButton.style.backgroundColor = "transparent";
                copyButton.style.border = "1px solid rgb(96, 94, 92)";
                copyButton.style.cursor = "pointer";
                copyButton.style.marginRight = "5px";

                const icon = document.createElement("span");
                icon.className = `bowtie-icon bowtie-${isPlainText ? "edit-copy" : "link"}`;
                icon.style.pointerEvents = "none"; // This prevents the icon from being the target of the click event
                copyButton.appendChild(icon);

                harvestTileContainer.appendChild(copyButton);
            }

            harvestTileContainer.className = harvestTileContainerClassName;
            harvestTileContainer.style.padding = "5px";
            harvestTileContainer.style.textAlign = "right";
            // harvestTileContainer.style.backgroundColor = "#f36c00";

            addCopyButton(false);
            // addCopyButton(true);

            const timerButton = document.createElement("button");
            timerButton.style.padding = "5px";
            timerButton.style.backgroundColor = "transparent";
            timerButton.style.backgroundImage = "none";
            timerButton.style.border = "1px solid rgb(96, 94, 92)";
            timerButton.style.cursor = "pointer";
            timerButton.style.height = "28px";
            timerButton.style.width = "auto";
            timerButton.className = "harvest-timer";
            timerButton.innerHTML = '<span class="fabric-icon ms-Icon--Clock"></span>';
            // timerButton.dataset.
            
            timerButton.setAttribute("data-skip-styling", "true");

            const workItemId = content.querySelector(".id")?.innerText;
            const clickableTitle = content.querySelector(".clickable-title-link");
            const workItemName = clickableTitle?.innerText;
            timerButton.setAttribute("data-item", JSON.stringify({
                id: workItemId,
                name: `#${workItemId}: ${workItemName}`
            }));
            timerButton.setAttribute("data-permalink", content.querySelector(".clickable-title-link")?.href);
            
            var group = decodeURIComponent(location.pathname.split('/')[1]);
            timerButton.setAttribute("data-group", JSON.stringify({
                id: group,
                name: group
            }));

            harvestTileContainer.appendChild(timerButton);

            content.appendChild(harvestTileContainer);
        };

        /**
         * @param {{id: string, name: string;}} data 
         * @returns 
         */
        AzureDevOpsProfile.prototype.addTimer = function (data) {
            var el, i, len, permalink, ref;
            addMetaData(this.headerButton, data);
            account = data.account, group = data.group, item = data.item;
            var caption = document.querySelector("a.caption");
            var permalink = caption.href;
            this.headerButton.removeAttribute('data-listening');
            this.headerButton.setAttribute('data-permalink', permalink);
            ref = document.querySelectorAll('.harvest-timer.big-harvest-button');
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

        /**
         * 
         * @param {HTMLElement} element 
         * @param {{id: string, name: string}} item 
         */
        function addMetaData(element, item) {
            element.dataset["item"] = JSON.stringify(item);
            var group = decodeURIComponent(location.pathname.split('/')[1]);
            element.dataset["group"] = JSON.stringify({ id: group, name: group });
        }

        AzureDevOpsProfile.prototype.createButton = function () {
            var button = document.createElement("button");
            button.type = "button";
            button.style = "background: #f36c00; border: none; color: #ffffff; cursor: pointer;";
            button.type = "button";
            button.classList.add('harvest-timer', 'btn', 'big-harvest-button');
            button.setAttribute("data-skip-styling", "true");
            button.innerHTML = "<svg style=\"fill: #ffffff; vertical-align: sub;\" aria-hidden=\"true\" class=\"octicon octicon-clock\" height=\"16\" role=\"img\" version=\"1.1\" viewBox=\"0 0 14 16\" width=\"14\"><path d=\"M8 8h3v2H7c-0.55 0-1-0.45-1-1V4h2v4z m-1-5.7c3.14 0 5.7 2.56 5.7 5.7S10.14 13.7 7 13.7 1.3 11.14 1.3 8s2.56-5.7 5.7-5.7m0-1.3C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7S10.86 1 7 1z\"></path></svg>\nTrack time";
            return button;
        };

        AzureDevOpsProfile.prototype.createSmallButton = function () {
            var button = document.createElement("button");
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

        AzureDevOpsProfile.prototype.addTimerButtonToCommitRow = function (row) {
            const sideActionCell = row.querySelector(".bolt-table-cell-side-action");
            const spacerCell = row.querySelector(".bolt-table-spacer-cell");
            spacerCell.style.overflow = "visible";

            const commitButton = document.createElement("button");
            commitButton.type = "button";
            commitButton.innerHTML = `<span class="fabric-icon ms-Icon--Clock"></span>`;
            commitButton.classList.add("harvest-timer", "commit-timer");
            commitButton.setAttribute("data-skip-styling", "true");
            commitButton.style.backgroundColor = "#f36c00";
            commitButton.style.color = "#ffffff";
            commitButton.style.padding = ".25rem";
            commitButton.style.border = "none";
            commitButton.style.cursor = "pointer";
            commitButton.style.marginLeft = "3px";
            commitButton.style.borderRadius = "2px";

            const commitText = row.querySelector(".commit-title").innerText ?? "";
            const itemData = { name: commitText };
            if (typeof commitText === "string") {
                const workItemMatch =  commitText.match(/#\d+/);
                if (workItemMatch?.length > 0) {
                    const workItemId = workItemMatch[0].substring(1);
                    itemData["id"] = workItemId
                    const [, org, project] = location.pathname.split("/");
                    const permalink = `${location.origin}/${org}/${project}/_workitems/edit/${workItemId}`;
                    commitButton.setAttribute('data-permalink', permalink);
                }
            }

            addMetaData(commitButton, itemData);

            commitButton.addEventListener("click", function(e) {
                e.preventDefault();
            });

            spacerCell?.appendChild(commitButton);
        };

        return AzureDevOpsProfile;
    })();

    chrome.runtime.sendMessage({ type: "getHost" }, function (host) {
        return new AzureDevOpsProfile(host);
    });
}).call(this);
