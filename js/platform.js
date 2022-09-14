// Taken from https://platform.harvestapp.com/assets/platform.js
// As of manifest v3 extension cannot use remotely hosted code. Bundle this file into the app.
// DEBUG: if this stops working we may need to update the contents of this file.

var N="platform.harvestapp.com";var I="https";var b={},x=I||"https",A=`${x}://${N}`;(function(){let T,y,h,L,P,C,_,E,O,S,w,v,o;return y=class{constructor(){this.el=document.createElement("div"),this.el.className="harvest-overlay",this.iframe=document.createElement("iframe"),this.iframe.id="harvest-iframe",this.el.appendChild(this.iframe),this.el.addEventListener("click",e=>this.close()),document.addEventListener("keyup",({which:e})=>{if(e===27)return this.close()})}open(e){return this.iframe.src=e,document.body.appendChild(this.el)}adjustHeight(e){return this.iframe.style.height=`${e}px`}close(){let e;return(e=this.el.parentNode)!=null?e.removeChild(this.el):void 0}},_=new y,v=document.createElement("iframe"),v.hidden=!0,v.src=`${A}/platform/worker`,document.body.appendChild(v),(o=document.getElementById("harvest-messaging"))||(o=document.createElement("div"),o.id="harvest-messaging",o.hidden=!0,document.body.appendChild(o)),O=function(n){let e,t;return function(){let r;r=[];for(e in n)t=n[e],t!=null&&r.push(`${e}=${encodeURIComponent(t)}`);return r}().join("&")},h=function(){return window._harvestPlatformConfig?window._harvestPlatformConfig:JSON.parse(document.querySelector("script[data-platform-config]").dataset.platformConfig)},P=function(n){let e,t,r,i,s;for(e={},s=["account","item","group","default","skip-styling"],t=0,i=s.length;t<i;t++)r=s[t],e[r]=C(n,r);return e.group==null&&(e.group=C(n,"project")),e.permalink=n.getAttribute("data-permalink"),e},C=function(n,e){let t;return t=function(){let r;try{return JSON.parse((r=n.getAttribute(`data-${e}`))!=null?r:"null")}catch(i){}}(),(t!=null?t.id:void 0)!=null&&(t.id=""+t.id),t},S=function(n){let e,t,r,i,s,u,c,f,m,g;for(c=document.querySelectorAll(".harvest-timer"),g=[],i=0,u=c.length;i<u;i++)t=c[i],{group:r,item:s}=P(t),n==null||(r!=null?r.id:void 0)!==((f=n.group)!=null?f.id:void 0)||(s!=null?s.id:void 0)!==((m=n.item)!=null?m.id:void 0)?(t.classList.remove("running"),g.push(function(){let l,p,d,a;for(d=t.children,a=[],l=0,p=d.length;l<p;l++)e=d[l],a.push(e.classList.remove("running"));return a}())):(t.classList.add("running"),g.push(function(){let l,p,d,a;for(d=t.children,a=[],l=0,p=d.length;l<p;l++)e=d[l],a.push(e.classList.add("running"));return a}()));return g},w=function(){return S(null)},L=function(n,e){return n!=null&&e!=null&&(e.account!=null&&(n=n.replace("%ACCOUNT_ID%",e.account.id)),e.group!=null&&(n=n.replace("%PROJECT_ID%",e.group.id)),e.group!=null&&(n=n.replace("%GROUP_ID%",e.group.id)),e.item!=null&&(n=n.replace("%ITEM_ID%",e.item.id))),n},E=function(n,e){return window.jQuery!=null?window.jQuery(o).bind(n,e):o.addEventListener(n,e)},window.addEventListener("message",function(n){if(n.origin!==A)return;let e=n.data,t,r,i,s;switch({type:i,value:s}=e??{},i){case"frame:close":return _.close();case"frame:resize":return _.adjustHeight(s);case"timer:started":return{id:t,group_id:r}=s.external_reference,S({group:{id:r},item:{id:t}});case"timer:stopped":return w()}}),T=class{constructor({stylesheet:e}){let t,r;this.addTimers=this.addTimers.bind(this),this.findTimers=this.findTimers.bind(this),this.stylesheet=e,r=document.createElement("style"),document.head.appendChild(r),r.appendChild(document.createTextNode(this.stylesheet)),E("harvest-event:timers:add",this.addTimers),E("harvest-event:timers:chrome:add",this.findTimers),this.findTimers(),o.setAttribute("data-ready",!0),t=document.createEvent("CustomEvent"),t.initCustomEvent("harvest-event:ready",!0,!0,{}),(document.body||o).dispatchEvent(t)}addTimers(e){let t,r,i,s;if(t=e.element||((r=e.originalEvent)!=null&&(i=r.detail)!=null?i.element:void 0)||((s=e.detail)!=null?s.element:void 0),(t!=null?t.jquery:void 0)!=null&&(t=t.get(0)),t)return this.findTimer(t)}findTimers(){let e,t,r,i,s,u;for(u=".harvest-timer:not([data-listening])",t=document.querySelectorAll(u),s=[],r=0,i=t.length;r<i;r++)e=t[r],s.push(this.findTimer(e));return s}findTimer(e){let t,r;return t=e.getAttribute("data-skip-styling"),r=h().skipStyling||e.classList.contains("styled")||t!=null&&t!==!1&&t!=="false",r||e.classList.add("styled"),e.addEventListener("click",i=>(i.stopPropagation(),this.openIframe(P(e)))),e.setAttribute("data-listening",!0)}openIframe(e){let t,r,i,s,u,c,f,m;return t={app_name:h().applicationName,service:e.service||window.location.hostname,permalink:e.permalink||L(h().permalink,e),external_account_id:(r=e.account)!=null?r.id:void 0,external_group_id:(i=e.group)!=null?i.id:void 0,external_group_name:(s=e.group)!=null?s.name:void 0,external_item_id:(u=e.item)!=null?u.id:void 0,external_item_name:(c=e.item)!=null?c.name:void 0,default_project_code:(f=e.default)!=null?f.project_code:void 0,default_project_name:(m=e.default)!=null?m.project_name:void 0},_.open(`${A}/platform/timer?${O(t)}`)}},window.postMessage==null?typeof console!="undefined"&&console!==null?console.warn(`Harvest Platform is disabled.
To start and stop timers, cross-domain messaging must be supported
by your browser.`):void 0:!window.XMLHttpRequest||!("withCredentials"in new XMLHttpRequest)?typeof console!="undefined"&&console!==null?console.warn(`Harvest Platform is disabled.
To check for running timers, xhr requests with credentials must be
supported by your browser.`):void 0:self.HarvestPlatform!=null?self.HarvestPlatform.findTimers():self.HarvestPlatform=new T({stylesheet:`.harvest-timer.styled{-webkit-font-smoothing:antialiased;background-image:linear-gradient(#fff,#eee);border:1px solid #bbb;border-radius:2px;color:#222;cursor:pointer;display:inline-block;font:inherit;font-size:0;height:12px;line-height:1;margin:0;padding:3px;position:relative;vertical-align:top;width:12px}.harvest-timer.styled:hover{background-image:linear-gradient(#f8f8f8,#e8e8e8)}.harvest-timer.styled:active{background:#eee;box-shadow:inset 0 1px 4px rgba(0,0,0,.1)}.harvest-timer.styled::after{background:url(//platform.harvestapp.com/img/icon-timer.dzg2GEgNRsgn.svg) 50% 50% no-repeat;content:"";display:inline-block;font:inherit;height:100%;left:0;margin:0;padding:0;position:absolute;top:0;width:100%}.harvest-timer.styled.running{background-image:linear-gradient(#53b2fc,#1385e5);border-color:#075fa9;color:#fff}.harvest-timer.styled.running:hover{background-image:linear-gradient(#49a4fd,#0e7add)}.harvest-timer.styled.running:active{background:#1385e5;box-shadow:inset 0 1px 5px rgba(0,0,0,.2)}#harvest-iframe{background:white;border:none;border-radius:6px;box-shadow:0 6px 12px rgba(0,0,0,.2),0 0 0 1px rgba(0,0,0,.1);height:300px;left:50%;margin:0;margin-left:-250px;overflow:hidden;padding:0;position:absolute;top:0;transition:height 150ms;width:500px}@media (min-height: 400px){#harvest-iframe{top:10%}}@media (min-height: 550px){#harvest-iframe{top:20%}}.harvest-overlay{background:rgba(0,0,0,.6);height:100%;left:0;opacity:1;overflow:scroll;position:fixed;top:0;width:100%;z-index:9998}

`})})();