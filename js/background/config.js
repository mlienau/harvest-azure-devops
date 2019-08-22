
/*
  To change which server is used, edit local storage for the extension
  and set the "host" key.

  To open Dev Tools for the extension, go to chrome://extensions (enable
  developer mode if not already enabled) and you'll see a link to launch dev
  tools.
 */

(function() {
  var defaultHost, savedHost;

  defaultHost = "https://platform.harvestapp.com";

  savedHost = localStorage.getItem("host");

  this.host = (savedHost || defaultHost).replace(/\/$/, "");

  localStorage.setItem("host", this.host);

  chrome.browserAction.setBadgeText({
    text: this.host === defaultHost ? "" : this.host.match(/\.dev/i) ? "local" : "stage"
  });

}).call(this);
