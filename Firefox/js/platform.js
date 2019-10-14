! function() {
    function e(t, n, r) {
        function i(a, l) {
            if (!n[a]) {
                if (!t[a]) {
                    var d = "function" == typeof require && require;
                    if (!l && d) return d(a, !0);
                    if (o) return o(a, !0);
                    var s = new Error("Cannot find module '" + a + "'");
                    throw s.code = "MODULE_NOT_FOUND", s
                }
                var u = n[a] = {
                    exports: {}
                };
                t[a][0].call(u.exports, function(e) {
                    return i(t[a][1][e] || e)
                }, u, u.exports, e, t, n, r)
            }
            return n[a].exports
        }
        for (var o = "function" == typeof require && require, a = 0; a < r.length; a++) i(r[a]);
        return i
    }
    return e
}()({
    1: [function(e) {
        var t;
        null == window.postMessage ? "undefined" != typeof console && null !== console && console.warn("Harvest Platform is disabled.\nTo start and stop timers, cross-domain messaging must be supported\nby your browser.") : window.XMLHttpRequest && "withCredentials" in new XMLHttpRequest ? null != self.HarvestPlatform ? self.HarvestPlatform.findTimers() : (t = e("./platform/base"), self.HarvestPlatform = new t({
            stylesheet: ".harvest-timer-icon,.harvest-timer.styled{border:0;font:inherit;font-size:0;line-height:1;margin:0;padding:0;vertical-align:top}.harvest-timer-icon{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAOCAYAAAA1%2BNx%2BAAACsElEQVR4AX1TA4weYRDds23btm3bVpza1tneug0bVEHtsLZt2%2B2Pvrnsf93sYZKXnU%2FvjZbh2%2Fr16%2BWAKAHkmGmswlbemwcvYOr7VlZWcg4ODuu9vLzYgIAA1t%2FffxS%2B%2FFT3pVKpPEAm4SACFIVRU5RhnO8MhKelpbVVVla2wQ%2BlvUki9uB8K%2FJ%2F%2F%2FxxG7gF3x2wZPhGEfv6%2Bg6QUGRk5ELyIcA2NDSwjY2N%2FWVlZfNxFgLocVFLxSLRJxL69OblXolY%2FJmLXoz9Dx9fv9iFMzdAa1wkMTFxKDMzc31CQsL69PT0ZWUwCBCWlJaWDmdkZPRWVVWly%2FoBoq%2FS%2F3YRGOZwDvgl%2Bvvn9a0zp2rH%2BkEliImJGaqoqGDr6%2BvDhHUuLCwMKS8vH8D5ksHBQUsqCycgAWom6UuFRCL58vXj%2ByOzohxMmODg4AVhYWHrUfNxckUVlVX8R0lJScHIpB8lq%2F309tUeCptPTguBSDmV6%2Bntq82Mp6fnUE5OTjMdCAX4htKtKikp6aLo%2F%2Fz6eV1AKBXe%2F%2F3j%2B9k%2Fv389YdDU9Ui%2FGY%2Fl%2BAJCEQzAGpRrkMjw%2BDo%2BcnwBociv79%2FOYwC%2BMIGBgQNoYDd6Yc4X4P9gdIZSdhYVFfXSI0T2DL0w5AvwfzA6Q5YPkO1bBj9TfXFx8fqZM2c2yUQQqRLIlGTkKE9jUFAQiz7UQmA7ET66frFdJnLp%2BH4Vgoz84bULrWi0CHe3MG5ubuoYw35kQXNPIkEtLS1uzc3NbuSDvAl9YlNTU%2FswCBrg1sPjsdnnRFy76rOcCOSDvA3nYuAT7ugzZEjfChETwXr8D10QnIvJmYvsuhD5eo7cmlcSP4AIpH%2F%2F%2FH727sWTHQTyaY8782cETVRHabLQ8BYqWW5uLoH8bOxpTDLvesBq4CEgM%2FLXjEcO%2Bwce9gB1iAwqCgAAAABJRU5ErkJggg%3D%3D) no-repeat 0 0;display:inline-block;height:14px;width:12px}@media (-webkit-min-device-pixel-ratio: 1.25), (min-resolution: 1.25dppx), (min-resolution: 120dpi){.harvest-timer-icon{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAcCAYAAAAnbDzKAAAFUElEQVR42sVYf0jcZRyemoJgo1VE7I8yCYmYh2M0ZpnFYtDYIkiFunPeqZG%2FN38QmJ7p6elheGLqiCBtFffH2LBgDKvtSNjCIlfbuSajdRne2sJwltWmp749z%2FF95eXred4PYy883Ov7fj7P%2B3ne9%2F287%2Ft1y90uptT4N0Ih5gHKyspEKMTKLzYod1uAnOU4IlYBmyYmim2yF9gHxIeyizro3NzcBGKTBcjgH7SkJ5cCZai%2FqIpA%2FX7gKeAg8IoUwDrb2EebcAS4gJNA0v8g4IHpqxNj13%2B6cuH1HfdV4O8DxtT47fjdr09YKUDfrtk%2BtF7wO4GlmpoaUVtbeyovL29VhMViyQDsgBsYlwJY19rstNlgW%2BwElgBxw3vV81r6vV0vb487anw0vnzgsNE2ce7M6Rnf1OTczM0pKYB1trGPNoqQ3UCcXkCmyWSaa2lpEURdXd3ZwsLCZxHYCCDKy8tFY2Oj6OzsFF1dXaK%2Fv59gnW3sow1td68jIJMxyeC8P1688ebBrC8%2BPzYwtbTkF%2BGUm1PXLg82lnXK1ViTSxCQ0dzcPCNFcDUqKipER0cHgw0LtK2srHRASEIQERlL%2FsVVEX%2FNzgjvpe%2FE33OzIpJy%2Bbx7RMulvWtmqqCgYAdm844UAUGit7fXh%2BAGATNgAFIIrW7W%2BqZVIU1NTVyNJF0ePN5f9aptWZly1PnjAwYBM2AAUgitbtb6pvWrwVwip%2BSX%2B90FCKvVKtra2rg9PHa7%2FVB%2Bfn6cLpEN6t8Qm%2B10Ood0q%2BFSgr8HMP06eelb3YR6gENAnE6sQbd62cCQ6kgucpJbBm8EhM1mEz09PX4EfxwrkCpJQglgqaqqSoSQVgTvlyLAZdQCSv%2Fyo4EPlPH9wHFAz68XoIpIBFrpK0nISW4Gnwz4kLxyBp3RHqPYgs6%2Bvj7JQ87kw0%2BnvnT7n%2FlbigBntBcZfaUNOY8889gBCrAUFRVx5jnoGJAWpQBypWELkoNc5LScG%2F7kvdWpX1wYx09aDALSyCHtyM1Bh%2Bvr6%2BWsWcN8FxmIYDalpaVWh8Mh%2BU5cvzb5vRxw8c7t1nCeEtxGQFB%2Bckg7XI7jFOBtb2%2BXA%2BbEKIB8OQ0NDZLP%2B%2B%2F8nzNywPnZP16IVQA5pB25OeBCd3e3HHBbJC%2FTdQRsQ1JLvoWV5eXVxDv2dvUT4QgItZXIIfvJHRCAxNtUASUlJUEFOEz7no9VADn0AryKgJxYH3PcQooAL5Ju9SIafretCVtj63q%2BON9DJjF9ySH5yB1IYmULWTdBgFXZQidWVlY%2BlQP%2B4D79GYLYE%2B0pRF9ySDtwn%2BSAFiWJx5CAMR2jADkknwXjEIFy6%2Ffffu4y738LgewC4sMVQFv60Jcc0o7cgYsMx6hPnt04Ap1boivkcuIYJQe5yJmMQQifHPHKN6NntFflc8DDG3HShrb0oa8SvI%2FcASNcZEbtIiP8uIxaEUxiBIEnAvShr%2BQxKjNrVBJv%2BeJXI6dKntxazveMFly69nWWSLDONq3PRFv60FcRAH6l4Np3yVVAUvOdPwRh2WEEnw3Qlj70JYcryPZwCaX8MnHh649tNe9wZkOBNrRVfckVLJAkPMBGpAiAz%2BppJOQg%2BsyAAUghWNfa2Ecb2ko%2FciQFEZAEjABCec%2FMej3j592u9z88esTUVr3nkWqCdbaxjzaqj8axhl9upQQ8hR2qCDyVA8HxucGvs%2BLiYoJ1trGPNtKevgkhTpkEwCGiL%2FQlf%2BiCj5IsBOIGRJigbVYE%2F8zKAtwRBE5b8EdY8F2QicDswCjgUQL2sE3ry4yQVv%2B9bAdGAY%2FuY2dU6wvJ%2Fx9wGoTBA3GsgAAAAABJRU5ErkJggg%3D%3D) no-repeat 0 0;background-size:24px 14px}}.harvest-timer.styled{background-color:#fafafa;background-image:-webkit-gradient(linear, left top, left bottom, from(#fff), to(#eee));background-image:linear-gradient(#fff, #eee);border:1px solid #bbb;border-radius:2px;cursor:pointer;display:inline-block;height:14px;padding:2px 3px;width:12px;-webkit-font-smoothing:antialiased}.harvest-timer.styled:hover{background-color:#f0f0f0;background-image:-webkit-gradient(linear, left top, left bottom, from(#f8f8f8), to(#e8e8e8));background-image:linear-gradient(#f8f8f8, #e8e8e8)}.harvest-timer.styled:active{background:#eee;-webkit-box-shadow:inset 0 1px 4px rgba(0,0,0,0.1);box-shadow:inset 0 1px 4px rgba(0,0,0,0.1)}.harvest-timer.styled.running{background-color:#1385e5;background-image:-webkit-gradient(linear, left top, left bottom, from(#53b2fc), to(#1385e5));background-image:linear-gradient(#53b2fc, #1385e5);border-color:#075fa9}.harvest-timer.styled.running:hover{background-color:#0e7add;background-image:-webkit-gradient(linear, left top, left bottom, from(#49a4fd), to(#0e7add));background-image:linear-gradient(#49a4fd, #0e7add)}.harvest-timer.styled.running:active{background:#1385e5;-webkit-box-shadow:inset 0 1px 5px rgba(0,0,0,0.2);box-shadow:inset 0 1px 5px rgba(0,0,0,0.2)}.harvest-timer.styled.running>.harvest-timer-icon{background-position:-12px 0px}#harvest-iframe{background:white;border:none;border-radius:6px;-webkit-box-shadow:0 6px 12px rgba(0,0,0,0.2),0 0 0 1px rgba(0,0,0,0.1);box-shadow:0 6px 12px rgba(0,0,0,0.2),0 0 0 1px rgba(0,0,0,0.1);height:300px;left:50%;margin:0;margin-left:-250px;overflow:hidden;padding:0;position:absolute;top:0;-webkit-transition:height 150ms;transition:height 150ms;width:500px}@media (min-height: 400px){#harvest-iframe{top:10%}}@media (min-height: 550px){#harvest-iframe{top:20%}}.harvest-overlay{background:rgba(0,0,0,0.6);height:100%;left:0;opacity:1;overflow:scroll;position:fixed;top:0;width:100%;z-index:9998}\n"
        })) : "undefined" != typeof console && null !== console && console.warn("Harvest Platform is disabled.\nTo check for running timers, xhr requests with credentials must be\nsupported by your browser.")
    }, {
        "./platform/base": 2
    }],
    2: [function(e, t) {
        var n, r, i, o, a, l, d, s, u, c, p, g, m, f = function(e, t) {
            return function() {
                return e.apply(t, arguments)
            }
        };
        n = e("./light_box"), l = new n, s = window.__harvestTestOrigin || "https://platform.harvestapp.com", (g = document.createElement("iframe")).hidden = !0, g.src = s + "/platform/worker", document.body.appendChild(g), (m = document.getElementById("harvest-messaging")) || ((m = document.createElement("div")).id = "harvest-messaging", m.hidden = !0, document.body.appendChild(m)), u = function(e) {
            var t, n;
            return function() {
                var r;
                for (t in r = [], e) null != (n = e[t]) && r.push(t + "=" + encodeURIComponent(n));
                return r
            }().join("&")
        }, r = function() {
            return window._harvestPlatformConfig || { applicationName: 'Azure DevOps' }
        }, o = function(e) {
            var t, n, r, i, o;
            for (t = {}, n = 0, i = (o = ["account", "item", "group", "default", "skip-styling"]).length; n < i; n++) t[r = o[n]] = a(e, r);
            return null == t.group && (t.group = a(e, "project")), t.permalink = e.getAttribute("data-permalink"), t
        }, a = function(e, t) {
            var n;
            return null != (null != (n = function() {
                var n;
                try {
                    return JSON.parse(null != (n = e.getAttribute("data-" + t)) ? n : "null")
                } catch (r) {}
            }()) ? n.id : void 0) && (n.id = "" + n.id), n
        }, c = function(e) {
            var t, n, r, i, a, l, d, s, u, c, p;
            for (p = [], i = 0, l = (d = document.querySelectorAll(".harvest-timer")).length; i < l; i++) n = d[i], r = (s = o(n)).group, a = s.item, null == e || (null != r ? r.id : void 0) !== (null != (u = e.group) ? u.id : void 0) || (null != a ? a.id : void 0) !== (null != (c = e.item) ? c.id : void 0) ? (n.classList.remove("running"), p.push(function() {
                var e, r, i, o;
                for (o = [], e = 0, r = (i = n.children).length; e < r; e++) t = i[e], o.push(t.classList.remove("running"));
                return o
            }())) : (n.classList.add("running"), p.push(function() {
                var e, r, i, o;
                for (o = [], e = 0, r = (i = n.children).length; e < r; e++) t = i[e], o.push(t.classList.add("running"));
                return o
            }()));
            return p
        }, p = function() {
            return c(null)
        }, i = function(e, t) {
            return null != e && null != t && (null != t.account && (e = e.replace("%ACCOUNT_ID%", t.account.id)), null != t.group && (e = e.replace("%PROJECT_ID%", t.group.id)), null != t.group && (e = e.replace("%GROUP_ID%", t.group.id)), null != t.item && (e = e.replace("%ITEM_ID%", t.item.id))), e
        }, d = function(e, t) {
            return null != window.jQuery ? window.jQuery(m).bind(e, t) : m.addEventListener(e, t)
        }, window.addEventListener("message", function(e) {
            var t, n, r, i, o, a, d, s, u;
            switch (s = (a = null != (t = e.data) ? t : {}).type, u = a.value, i = a.group_id, o = a.item_id, s) {
                case "frame:close":
                    return l.close();
                case "frame:resize":
                    return l.adjustHeight(u);
                case "timer:started":
                    return c({
                        group: {
                            id: i
                        },
                        item: {
                            id: o
                        }
                    });
                case "timer:stopped":
                    return p();
                case "timer:update":
                    return null != (null != u ? u.external_reference : void 0) ? (r = (d = u.external_reference).external_id, n = d.external_group_id, c({
                        group: {
                            id: n
                        },
                        item: {
                            id: r
                        }
                    })) : p()
            }
        }), t.exports = function() {
            function e(e) {
                var t, n;
                this.stylesheet = e.stylesheet, this.findTimers = f(this.findTimers, this), this.addTimers = f(this.addTimers, this), n = document.createElement("style"), document.head.appendChild(n), n.appendChild(document.createTextNode(this.stylesheet)), d("harvest-event:timers:add", this.addTimers), d("harvest-event:timers:chrome:add", this.findTimers), this.findTimers(), m.setAttribute("data-ready", !0), (t = document.createEvent("CustomEvent")).initCustomEvent("harvest-event:ready", !0, !0, {}), (document.body || m).dispatchEvent(t)
            }
            return e.prototype.addTimers = function(e) {
                var t, n, r, i;
                if (null != (null != (t = e.element || (null != (n = e.originalEvent) && null != (r = n.detail) ? r.element : void 0) || (null != (i = e.detail) ? i.element : void 0)) ? t.jquery : void 0) && (t = t.get(0)), t) return this.findTimer(t)
            }, e.prototype.findTimers = function() {
                var e, t, n, r, i, o;
                for (o = ".harvest-timer:not([data-listening])", i = [], n = 0, r = (t = document.querySelectorAll(o)).length; n < r; n++) e = t[n], i.push(this.findTimer(e));
                return i
            }, e.prototype.findTimer = function(e) {
                var t, n;
                return t = e.getAttribute("data-skip-styling"), r().skipStyling || e.classList.contains("styled") || null != t && !1 !== t && "false" !== t || (e.innerHTML = "<span class='harvest-timer-icon'></span>", e.classList.add("styled")), e.addEventListener("click", (n = this, function(t) {
                    return t.stopPropagation(), n.openIframe(o(e))
                })), e.setAttribute("data-listening", !0)
            }, e.prototype.openIframe = function(e) {
                var t, n, o, a, d, c, p, g;
                return t = {
                    app_name: r().applicationName,
                    service: e.service || window.location.hostname,
                    permalink: e.permalink || i(r().permalink, e),
                    external_account_id: null != (n = e.account) ? n.id : void 0,
                    external_group_id: null != (o = e.group) ? o.id : void 0,
                    external_group_name: null != (a = e.group) ? a.name : void 0,
                    external_item_id: null != (d = e.item) ? d.id : void 0,
                    external_item_name: null != (c = e.item) ? c.name : void 0,
                    default_project_code: null != (p = e["default"]) ? p.project_code : void 0,
                    default_project_name: null != (g = e["default"]) ? g.project_name : void 0
                }, l.open(s + "/platform/timer?" + u(t))
            }, e
        }()
    }, {
        "./light_box": 3
    }],
    3: [function(e, t) {
        t.exports = function() {
            function e() {
                var e;
                this.el = document.createElement("div"), this.el.className = "harvest-overlay", this.iframe = document.createElement("iframe"), this.iframe.id = "harvest-iframe", this.el.appendChild(this.iframe), this.el.addEventListener("click", (e = this, function() {
                    return e.close()
                })), document.addEventListener("keyup", function(e) {
                    return function(t) {
                        if (27 === t.which) return e.close()
                    }
                }(this))
            }
            return e.prototype.open = function(e) {
                return this.iframe.src = e, document.body.appendChild(this.el)
            }, e.prototype.adjustHeight = function(e) {
                return this.iframe.style.height = e + "px"
            }, e.prototype.close = function() {
                var e;
                return null != (e = this.el.parentNode) ? e.removeChild(this.el) : void 0
            }, e
        }()
    }, {}]
}, {}, [1]);