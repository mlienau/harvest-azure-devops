export default class PlatformCookie {
    host = "https://dev.azure.com"; //window.host;
    lastCookie = null;
    cookie_name = 'platform_user_id';

    constructor(callback) {
        (chrome ?? browser).cookies.onChanged.addListener(this.parseCookieChange);
        this.getCookie();
        this.callback = callback;
    }

    domain = () => {
        // return new URL(this.host).hostname.match(/\.[^\.]+\.[^\.]+$/)[0];
        return new URL("https://dev.azure.com").hostname.match(/\.[^\.]+\.[^\.]+$/)[0];
    };

    parseCookieChange = (arg) => {
        var cause, cookie, removed;
        cause = arg.cause, cookie = arg.cookie, removed = arg.removed;
        if (cookie.name !== this.cookie_name || cookie.domain !== this.domain()) {
            return;
        }
        if (removed && cause !== "overwrite") {
            this.lastCookie = null;
            return this.updatedCookie();
        } else if (cookie.value !== this.lastCookie) {
            this.lastCookie = cookie.value;
            return this.updatedCookie();
        }
    };
    
    getCookie = () => {
        return (chrome ?? browser).cookies.get({
            url: this.host,
            name: this.cookie_name
        }, this.parseCookie);
    };

    parseCookie = (cookie) => {
        if ((cookie != null ? cookie.value : void 0) !== this.lastCookie) {
            this.lastCookie = cookie != null ? cookie.value : void 0;
            return this.updatedCookie();
        }
    };

    updatedCookie = () => {
        this.callback();
        // return document.dispatchEvent(new CustomEvent("login:change"));
    };
}