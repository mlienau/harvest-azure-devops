(function() {
  var canBeClosed, setRunningTimerIcon, shouldClose, waitUntilChromeAutofocuses;

  canBeClosed = true;

  shouldClose = false;

  window.addEventListener("load", (function(_this) {
    return function() {
      var iframe;
      iframe = document.querySelector("iframe");
      waitUntilChromeAutofocuses(iframe);
      iframe.src = _this.host + "/platform/timer?service=chrome.google.com";
      return iframe.addEventListener("load", function() {
        return iframe.classList.add("is-loaded");
      });
    };
  })(this));

  window.addEventListener("message", function(e) {
    var iframe, isRunning, matches, message, ref;
    iframe = document.querySelector("iframe");
    message = e.data;
    if (message.type === "frame:close") {
      if (canBeClosed) {
        return window.close();
      } else {
        return shouldClose = true;
      }
    } else if (message.type === "frame:resize") {
      return iframe.style.height = message.value + "px";
    } else if (matches = (ref = message.type) != null ? ref.match(/timer:(started|stopped)/) : void 0) {
      isRunning = matches[1] === "started";
      return setRunningTimerIcon(isRunning);
    }
  });

  setRunningTimerIcon = function(isRunning) {
    var options, state;
    state = isRunning ? "on" : "off";
    canBeClosed = false;
    options = {
      path: {
        "19": "images/h-toolbar-" + state + "@19px.png",
        "38": "images/h-toolbar-" + state + "@38px.png"
      }
    };
    chrome.browserAction.setIcon(options, function() {
      if (shouldClose) {
        return window.close();
      }
    });
    return chrome.browserAction.setTitle({
      title: isRunning ? "View the running Harvest timer" : "Start a Harvest timer"
    });
  };

  waitUntilChromeAutofocuses = function(element) {
    return element.getBoundingClientRect().width;
  };

}).call(this);
