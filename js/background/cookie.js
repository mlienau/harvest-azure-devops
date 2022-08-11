// var PlatformCookie;

export default class PlatformCookie {
    host = window.host; //"https://dev.azure.com"; //window.host;
    lastCookie = null;
    cookie_name = 'platform_user_id';

    constructor() {
        console.log("PlatformCookie ctor");
        (chrome ?? browser).cookies.onChanged.addListener(this.parseCookieChange);
        this.getCookie();
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
        return document.dispatchEvent(new CustomEvent("login:change"));
    };
}

// (function () {
//     var bind = function (fn, me) { return function () { return fn.apply(me, arguments); }; };

//     this.PlatformCookie = PlatformCookie = (function () {
//         console.log("PlatformCookie ctor")
//         PlatformCookie.prototype.host = window.host;

//         PlatformCookie.prototype.lastCookie = null;

//         PlatformCookie.prototype.cookie_name = 'platform_user_id';

//         function PlatformCookie() {
//             this.parseCookie = bind(this.parseCookie, this);
//             this.parseCookieChange = bind(this.parseCookieChange, this);
//             (chrome ?? browser).cookies.onChanged.addListener(this.parseCookieChange);
//             this.getCookie();
//         }

//         PlatformCookie.prototype.domain = function () {
//             return new URL(this.host).hostname.match(/\.[^\.]+\.[^\.]+$/)[0];
//         };

//         PlatformCookie.prototype.parseCookieChange = function (arg) {
//             var cause, cookie, removed;
//             cause = arg.cause, cookie = arg.cookie, removed = arg.removed;
//             if (cookie.name !== this.cookie_name || cookie.domain !== this.domain()) {
//                 return;
//             }
//             if (removed && cause !== "overwrite") {
//                 this.lastCookie = null;
//                 return this.updatedCookie();
//             } else if (cookie.value !== this.lastCookie) {
//                 this.lastCookie = cookie.value;
//                 return this.updatedCookie();
//             }
//         };

//         PlatformCookie.prototype.getCookie = function () {
//             return (chrome ?? browser).cookies.get({
//                 url: this.host,
//                 name: this.cookie_name
//             }, this.parseCookie);
//         };

//         PlatformCookie.prototype.parseCookie = function (cookie) {
//             if ((cookie != null ? cookie.value : void 0) !== this.lastCookie) {
//                 this.lastCookie = cookie != null ? cookie.value : void 0;
//                 return this.updatedCookie();
//             }
//         };

//         PlatformCookie.prototype.updatedCookie = function () {
//             return document.dispatchEvent(new CustomEvent("login:change"));
//         };

//         return PlatformCookie;

//     })();

// }).call(this);

// export default PlatformCookie;