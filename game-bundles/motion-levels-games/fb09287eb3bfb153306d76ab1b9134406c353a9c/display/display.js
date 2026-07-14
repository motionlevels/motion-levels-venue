"use strict";(()=>{var eM=Object.create;var Gu=Object.defineProperty;var tM=Object.getOwnPropertyDescriptor;var aM=Object.getOwnPropertyNames;var iM=Object.getPrototypeOf,lM=Object.prototype.hasOwnProperty;var Wt=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports),Je=(t,e)=>{for(var a in e)Gu(t,a,{get:e[a],enumerable:!0})},nM=(t,e,a,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let l of aM(e))!lM.call(t,l)&&l!==a&&Gu(t,l,{get:()=>e[l],enumerable:!(i=tM(e,l))||i.enumerable});return t};var F=(t,e,a)=>(a=t!=null?eM(iM(t)):{},nM(e||!t||!t.__esModule?Gu(a,"default",{value:t,enumerable:!0}):a,t));var Ih=Wt(me=>{"use strict";function Ru(t,e){var a=t.length;t.push(e);e:for(;0<a;){var i=a-1>>>1,l=t[i];if(0<or(l,e))t[i]=e,t[a]=l,a=i;else break e}}function $t(t){return t.length===0?null:t[0]}function cr(t){if(t.length===0)return null;var e=t[0],a=t.pop();if(a!==e){t[0]=a;e:for(var i=0,l=t.length,n=l>>>1;i<n;){var s=2*(i+1)-1,r=t[s],o=s+1,u=t[o];if(0>or(r,a))o<l&&0>or(u,r)?(t[i]=u,t[o]=a,i=o):(t[i]=r,t[s]=a,i=s);else if(o<l&&0>or(u,a))t[i]=u,t[o]=a,i=o;else break e}}return e}function or(t,e){var a=t.sortIndex-e.sortIndex;return a!==0?a:t.id-e.id}me.unstable_now=void 0;typeof performance=="object"&&typeof performance.now=="function"?(Uh=performance,me.unstable_now=function(){return Uh.now()}):(Cu=Date,Bh=Cu.now(),me.unstable_now=function(){return Cu.now()-Bh});var Uh,Cu,Bh,ba=[],ai=[],sM=1,wt=null,Ve=3,Au=!1,Dn=!1,On=!1,zu=!1,Xh=typeof setTimeout=="function"?setTimeout:null,qh=typeof clearTimeout=="function"?clearTimeout:null,Fh=typeof setImmediate<"u"?setImmediate:null;function ur(t){for(var e=$t(ai);e!==null;){if(e.callback===null)cr(ai);else if(e.startTime<=t)cr(ai),e.sortIndex=e.expirationTime,Ru(ba,e);else break;e=$t(ai)}}function Pu(t){if(On=!1,ur(t),!Dn)if($t(ba)!==null)Dn=!0,bl||(bl=!0,vl());else{var e=$t(ai);e!==null&&_u(Pu,e.startTime-t)}}var bl=!1,Hn=-1,jh=5,Vh=-1;function Zh(){return zu?!0:!(me.unstable_now()-Vh<jh)}function Tu(){if(zu=!1,bl){var t=me.unstable_now();Vh=t;var e=!0;try{e:{Dn=!1,On&&(On=!1,qh(Hn),Hn=-1),Au=!0;var a=Ve;try{t:{for(ur(t),wt=$t(ba);wt!==null&&!(wt.expirationTime>t&&Zh());){var i=wt.callback;if(typeof i=="function"){wt.callback=null,Ve=wt.priorityLevel;var l=i(wt.expirationTime<=t);if(t=me.unstable_now(),typeof l=="function"){wt.callback=l,ur(t),e=!0;break t}wt===$t(ba)&&cr(ba),ur(t)}else cr(ba);wt=$t(ba)}if(wt!==null)e=!0;else{var n=$t(ai);n!==null&&_u(Pu,n.startTime-t),e=!1}}break e}finally{wt=null,Ve=a,Au=!1}e=void 0}}finally{e?vl():bl=!1}}}var vl;typeof Fh=="function"?vl=function(){Fh(Tu)}:typeof MessageChannel<"u"?(wu=new MessageChannel,Yh=wu.port2,wu.port1.onmessage=Tu,vl=function(){Yh.postMessage(null)}):vl=function(){Xh(Tu,0)};var wu,Yh;function _u(t,e){Hn=Xh(function(){t(me.unstable_now())},e)}me.unstable_IdlePriority=5;me.unstable_ImmediatePriority=1;me.unstable_LowPriority=4;me.unstable_NormalPriority=3;me.unstable_Profiling=null;me.unstable_UserBlockingPriority=2;me.unstable_cancelCallback=function(t){t.callback=null};me.unstable_forceFrameRate=function(t){0>t||125<t?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):jh=0<t?Math.floor(1e3/t):5};me.unstable_getCurrentPriorityLevel=function(){return Ve};me.unstable_next=function(t){switch(Ve){case 1:case 2:case 3:var e=3;break;default:e=Ve}var a=Ve;Ve=e;try{return t()}finally{Ve=a}};me.unstable_requestPaint=function(){zu=!0};me.unstable_runWithPriority=function(t,e){switch(t){case 1:case 2:case 3:case 4:case 5:break;default:t=3}var a=Ve;Ve=t;try{return e()}finally{Ve=a}};me.unstable_scheduleCallback=function(t,e,a){var i=me.unstable_now();switch(typeof a=="object"&&a!==null?(a=a.delay,a=typeof a=="number"&&0<a?i+a:i):a=i,t){case 1:var l=-1;break;case 2:l=250;break;case 5:l=1073741823;break;case 4:l=1e4;break;default:l=5e3}return l=a+l,t={id:sM++,callback:e,priorityLevel:t,startTime:a,expirationTime:l,sortIndex:-1},a>i?(t.sortIndex=a,Ru(ai,t),$t(ba)===null&&t===$t(ai)&&(On?(qh(Hn),Hn=-1):On=!0,_u(Pu,a-i))):(t.sortIndex=l,Ru(ba,t),Dn||Au||(Dn=!0,bl||(bl=!0,vl()))),t};me.unstable_shouldYield=Zh;me.unstable_wrapCallback=function(t){var e=Ve;return function(){var a=Ve;Ve=e;try{return t.apply(this,arguments)}finally{Ve=a}}}});var kh=Wt((OE,Qh)=>{"use strict";Qh.exports=Ih()});var sm=Wt(O=>{"use strict";var Ou=Symbol.for("react.transitional.element"),rM=Symbol.for("react.portal"),oM=Symbol.for("react.fragment"),uM=Symbol.for("react.strict_mode"),cM=Symbol.for("react.profiler"),dM=Symbol.for("react.consumer"),fM=Symbol.for("react.context"),hM=Symbol.for("react.forward_ref"),mM=Symbol.for("react.suspense"),pM=Symbol.for("react.memo"),em=Symbol.for("react.lazy"),yM=Symbol.for("react.activity"),Kh=Symbol.iterator;function gM(t){return t===null||typeof t!="object"?null:(t=Kh&&t[Kh]||t["@@iterator"],typeof t=="function"?t:null)}var tm={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},am=Object.assign,im={};function xl(t,e,a){this.props=t,this.context=e,this.refs=im,this.updater=a||tm}xl.prototype.isReactComponent={};xl.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};xl.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function lm(){}lm.prototype=xl.prototype;function Hu(t,e,a){this.props=t,this.context=e,this.refs=im,this.updater=a||tm}var Lu=Hu.prototype=new lm;Lu.constructor=Hu;am(Lu,xl.prototype);Lu.isPureReactComponent=!0;var Jh=Array.isArray;function Du(){}var ce={H:null,A:null,T:null,S:null},nm=Object.prototype.hasOwnProperty;function Uu(t,e,a){var i=a.ref;return{$$typeof:Ou,type:t,key:e,ref:i!==void 0?i:null,props:a}}function vM(t,e){return Uu(t.type,e,t.props)}function Bu(t){return typeof t=="object"&&t!==null&&t.$$typeof===Ou}function bM(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(a){return e[a]})}var Wh=/\/+/g;function Nu(t,e){return typeof t=="object"&&t!==null&&t.key!=null?bM(""+t.key):e.toString(36)}function MM(t){switch(t.status){case"fulfilled":return t.value;case"rejected":throw t.reason;default:switch(typeof t.status=="string"?t.then(Du,Du):(t.status="pending",t.then(function(e){t.status==="pending"&&(t.status="fulfilled",t.value=e)},function(e){t.status==="pending"&&(t.status="rejected",t.reason=e)})),t.status){case"fulfilled":return t.value;case"rejected":throw t.reason}}throw t}function Ml(t,e,a,i,l){var n=typeof t;(n==="undefined"||n==="boolean")&&(t=null);var s=!1;if(t===null)s=!0;else switch(n){case"bigint":case"string":case"number":s=!0;break;case"object":switch(t.$$typeof){case Ou:case rM:s=!0;break;case em:return s=t._init,Ml(s(t._payload),e,a,i,l)}}if(s)return l=l(t),s=i===""?"."+Nu(t,0):i,Jh(l)?(a="",s!=null&&(a=s.replace(Wh,"$&/")+"/"),Ml(l,e,a,"",function(u){return u})):l!=null&&(Bu(l)&&(l=vM(l,a+(l.key==null||t&&t.key===l.key?"":(""+l.key).replace(Wh,"$&/")+"/")+s)),e.push(l)),1;s=0;var r=i===""?".":i+":";if(Jh(t))for(var o=0;o<t.length;o++)i=t[o],n=r+Nu(i,o),s+=Ml(i,e,a,n,l);else if(o=gM(t),typeof o=="function")for(t=o.call(t),o=0;!(i=t.next()).done;)i=i.value,n=r+Nu(i,o++),s+=Ml(i,e,a,n,l);else if(n==="object"){if(typeof t.then=="function")return Ml(MM(t),e,a,i,l);throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.")}return s}function dr(t,e,a){if(t==null)return t;var i=[],l=0;return Ml(t,i,"","",function(n){return e.call(a,n,l++)}),i}function xM(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(a){(t._status===0||t._status===-1)&&(t._status=1,t._result=a)},function(a){(t._status===0||t._status===-1)&&(t._status=2,t._result=a)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var $h=typeof reportError=="function"?reportError:function(t){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var e=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof t=="object"&&t!==null&&typeof t.message=="string"?String(t.message):String(t),error:t});if(!window.dispatchEvent(e))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",t);return}console.error(t)},SM={map:dr,forEach:function(t,e,a){dr(t,function(){e.apply(this,arguments)},a)},count:function(t){var e=0;return dr(t,function(){e++}),e},toArray:function(t){return dr(t,function(e){return e})||[]},only:function(t){if(!Bu(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};O.Activity=yM;O.Children=SM;O.Component=xl;O.Fragment=oM;O.Profiler=cM;O.PureComponent=Hu;O.StrictMode=uM;O.Suspense=mM;O.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=ce;O.__COMPILER_RUNTIME={__proto__:null,c:function(t){return ce.H.useMemoCache(t)}};O.cache=function(t){return function(){return t.apply(null,arguments)}};O.cacheSignal=function(){return null};O.cloneElement=function(t,e,a){if(t==null)throw Error("The argument must be a React element, but you passed "+t+".");var i=am({},t.props),l=t.key;if(e!=null)for(n in e.key!==void 0&&(l=""+e.key),e)!nm.call(e,n)||n==="key"||n==="__self"||n==="__source"||n==="ref"&&e.ref===void 0||(i[n]=e[n]);var n=arguments.length-2;if(n===1)i.children=a;else if(1<n){for(var s=Array(n),r=0;r<n;r++)s[r]=arguments[r+2];i.children=s}return Uu(t.type,l,i)};O.createContext=function(t){return t={$$typeof:fM,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null},t.Provider=t,t.Consumer={$$typeof:dM,_context:t},t};O.createElement=function(t,e,a){var i,l={},n=null;if(e!=null)for(i in e.key!==void 0&&(n=""+e.key),e)nm.call(e,i)&&i!=="key"&&i!=="__self"&&i!=="__source"&&(l[i]=e[i]);var s=arguments.length-2;if(s===1)l.children=a;else if(1<s){for(var r=Array(s),o=0;o<s;o++)r[o]=arguments[o+2];l.children=r}if(t&&t.defaultProps)for(i in s=t.defaultProps,s)l[i]===void 0&&(l[i]=s[i]);return Uu(t,n,l)};O.createRef=function(){return{current:null}};O.forwardRef=function(t){return{$$typeof:hM,render:t}};O.isValidElement=Bu;O.lazy=function(t){return{$$typeof:em,_payload:{_status:-1,_result:t},_init:xM}};O.memo=function(t,e){return{$$typeof:pM,type:t,compare:e===void 0?null:e}};O.startTransition=function(t){var e=ce.T,a={};ce.T=a;try{var i=t(),l=ce.S;l!==null&&l(a,i),typeof i=="object"&&i!==null&&typeof i.then=="function"&&i.then(Du,$h)}catch(n){$h(n)}finally{e!==null&&a.types!==null&&(e.types=a.types),ce.T=e}};O.unstable_useCacheRefresh=function(){return ce.H.useCacheRefresh()};O.use=function(t){return ce.H.use(t)};O.useActionState=function(t,e,a){return ce.H.useActionState(t,e,a)};O.useCallback=function(t,e){return ce.H.useCallback(t,e)};O.useContext=function(t){return ce.H.useContext(t)};O.useDebugValue=function(){};O.useDeferredValue=function(t,e){return ce.H.useDeferredValue(t,e)};O.useEffect=function(t,e){return ce.H.useEffect(t,e)};O.useEffectEvent=function(t){return ce.H.useEffectEvent(t)};O.useId=function(){return ce.H.useId()};O.useImperativeHandle=function(t,e,a){return ce.H.useImperativeHandle(t,e,a)};O.useInsertionEffect=function(t,e){return ce.H.useInsertionEffect(t,e)};O.useLayoutEffect=function(t,e){return ce.H.useLayoutEffect(t,e)};O.useMemo=function(t,e){return ce.H.useMemo(t,e)};O.useOptimistic=function(t,e){return ce.H.useOptimistic(t,e)};O.useReducer=function(t,e,a){return ce.H.useReducer(t,e,a)};O.useRef=function(t){return ce.H.useRef(t)};O.useState=function(t){return ce.H.useState(t)};O.useSyncExternalStore=function(t,e,a){return ce.H.useSyncExternalStore(t,e,a)};O.useTransition=function(){return ce.H.useTransition()};O.version="19.2.7"});var Fi=Wt((LE,rm)=>{"use strict";rm.exports=sm()});var um=Wt(ke=>{"use strict";var EM=Fi();function om(t){var e="https://react.dev/errors/"+t;if(1<arguments.length){e+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)e+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function ii(){}var Qe={d:{f:ii,r:function(){throw Error(om(522))},D:ii,C:ii,L:ii,m:ii,X:ii,S:ii,M:ii},p:0,findDOMNode:null},GM=Symbol.for("react.portal");function CM(t,e,a){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:GM,key:i==null?null:""+i,children:t,containerInfo:e,implementation:a}}var Ln=EM.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function fr(t,e){if(t==="font")return"";if(typeof e=="string")return e==="use-credentials"?e:""}ke.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=Qe;ke.createPortal=function(t,e){var a=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)throw Error(om(299));return CM(t,e,null,a)};ke.flushSync=function(t){var e=Ln.T,a=Qe.p;try{if(Ln.T=null,Qe.p=2,t)return t()}finally{Ln.T=e,Qe.p=a,Qe.d.f()}};ke.preconnect=function(t,e){typeof t=="string"&&(e?(e=e.crossOrigin,e=typeof e=="string"?e==="use-credentials"?e:"":void 0):e=null,Qe.d.C(t,e))};ke.prefetchDNS=function(t){typeof t=="string"&&Qe.d.D(t)};ke.preinit=function(t,e){if(typeof t=="string"&&e&&typeof e.as=="string"){var a=e.as,i=fr(a,e.crossOrigin),l=typeof e.integrity=="string"?e.integrity:void 0,n=typeof e.fetchPriority=="string"?e.fetchPriority:void 0;a==="style"?Qe.d.S(t,typeof e.precedence=="string"?e.precedence:void 0,{crossOrigin:i,integrity:l,fetchPriority:n}):a==="script"&&Qe.d.X(t,{crossOrigin:i,integrity:l,fetchPriority:n,nonce:typeof e.nonce=="string"?e.nonce:void 0})}};ke.preinitModule=function(t,e){if(typeof t=="string")if(typeof e=="object"&&e!==null){if(e.as==null||e.as==="script"){var a=fr(e.as,e.crossOrigin);Qe.d.M(t,{crossOrigin:a,integrity:typeof e.integrity=="string"?e.integrity:void 0,nonce:typeof e.nonce=="string"?e.nonce:void 0})}}else e==null&&Qe.d.M(t)};ke.preload=function(t,e){if(typeof t=="string"&&typeof e=="object"&&e!==null&&typeof e.as=="string"){var a=e.as,i=fr(a,e.crossOrigin);Qe.d.L(t,a,{crossOrigin:i,integrity:typeof e.integrity=="string"?e.integrity:void 0,nonce:typeof e.nonce=="string"?e.nonce:void 0,type:typeof e.type=="string"?e.type:void 0,fetchPriority:typeof e.fetchPriority=="string"?e.fetchPriority:void 0,referrerPolicy:typeof e.referrerPolicy=="string"?e.referrerPolicy:void 0,imageSrcSet:typeof e.imageSrcSet=="string"?e.imageSrcSet:void 0,imageSizes:typeof e.imageSizes=="string"?e.imageSizes:void 0,media:typeof e.media=="string"?e.media:void 0})}};ke.preloadModule=function(t,e){if(typeof t=="string")if(e){var a=fr(e.as,e.crossOrigin);Qe.d.m(t,{as:typeof e.as=="string"&&e.as!=="script"?e.as:void 0,crossOrigin:a,integrity:typeof e.integrity=="string"?e.integrity:void 0})}else Qe.d.m(t)};ke.requestFormReset=function(t){Qe.d.r(t)};ke.unstable_batchedUpdates=function(t,e){return t(e)};ke.useFormState=function(t,e,a){return Ln.H.useFormState(t,e,a)};ke.useFormStatus=function(){return Ln.H.useHostTransitionStatus()};ke.version="19.2.7"});var fm=Wt((BE,dm)=>{"use strict";function cm(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(cm)}catch(t){console.error(t)}}cm(),dm.exports=um()});var G0=Wt(Uo=>{"use strict";var _e=kh(),Up=Fi(),TM=fm();function S(t){var e="https://react.dev/errors/"+t;if(1<arguments.length){e+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)e+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function Bp(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function Es(t){var e=t,a=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,(e.flags&4098)!==0&&(a=e.return),t=e.return;while(t)}return e.tag===3?a:null}function Fp(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function Yp(t){if(t.tag===31){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function hm(t){if(Es(t)!==t)throw Error(S(188))}function wM(t){var e=t.alternate;if(!e){if(e=Es(t),e===null)throw Error(S(188));return e!==t?null:t}for(var a=t,i=e;;){var l=a.return;if(l===null)break;var n=l.alternate;if(n===null){if(i=l.return,i!==null){a=i;continue}break}if(l.child===n.child){for(n=l.child;n;){if(n===a)return hm(l),t;if(n===i)return hm(l),e;n=n.sibling}throw Error(S(188))}if(a.return!==i.return)a=l,i=n;else{for(var s=!1,r=l.child;r;){if(r===a){s=!0,a=l,i=n;break}if(r===i){s=!0,i=l,a=n;break}r=r.sibling}if(!s){for(r=n.child;r;){if(r===a){s=!0,a=n,i=l;break}if(r===i){s=!0,i=n,a=l;break}r=r.sibling}if(!s)throw Error(S(189))}}if(a.alternate!==i)throw Error(S(190))}if(a.tag!==3)throw Error(S(188));return a.stateNode.current===a?t:e}function Xp(t){var e=t.tag;if(e===5||e===26||e===27||e===6)return t;for(t=t.child;t!==null;){if(e=Xp(t),e!==null)return e;t=t.sibling}return null}var he=Object.assign,RM=Symbol.for("react.element"),hr=Symbol.for("react.transitional.element"),Vn=Symbol.for("react.portal"),wl=Symbol.for("react.fragment"),qp=Symbol.for("react.strict_mode"),bc=Symbol.for("react.profiler"),jp=Symbol.for("react.consumer"),wa=Symbol.for("react.context"),md=Symbol.for("react.forward_ref"),Mc=Symbol.for("react.suspense"),xc=Symbol.for("react.suspense_list"),pd=Symbol.for("react.memo"),li=Symbol.for("react.lazy"),Sc=Symbol.for("react.activity"),AM=Symbol.for("react.memo_cache_sentinel"),mm=Symbol.iterator;function Un(t){return t===null||typeof t!="object"?null:(t=mm&&t[mm]||t["@@iterator"],typeof t=="function"?t:null)}var zM=Symbol.for("react.client.reference");function Ec(t){if(t==null)return null;if(typeof t=="function")return t.$$typeof===zM?null:t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case wl:return"Fragment";case bc:return"Profiler";case qp:return"StrictMode";case Mc:return"Suspense";case xc:return"SuspenseList";case Sc:return"Activity"}if(typeof t=="object")switch(t.$$typeof){case Vn:return"Portal";case wa:return t.displayName||"Context";case jp:return(t._context.displayName||"Context")+".Consumer";case md:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case pd:return e=t.displayName||null,e!==null?e:Ec(t.type)||"Memo";case li:e=t._payload,t=t._init;try{return Ec(t(e))}catch{}}return null}var Zn=Array.isArray,_=Up.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,te=TM.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,Zi={pending:!1,data:null,method:null,action:null},Gc=[],Rl=-1;function la(t){return{current:t}}function He(t){0>Rl||(t.current=Gc[Rl],Gc[Rl]=null,Rl--)}function ue(t,e){Rl++,Gc[Rl]=t.current,t.current=e}var ia=la(null),us=la(null),pi=la(null),Zr=la(null);function Ir(t,e){switch(ue(pi,e),ue(us,t),ue(ia,null),e.nodeType){case 9:case 11:t=(t=e.documentElement)&&(t=t.namespaceURI)?xp(t):0;break;default:if(t=e.tagName,e=e.namespaceURI)e=xp(e),t=c0(e,t);else switch(t){case"svg":t=1;break;case"math":t=2;break;default:t=0}}He(ia),ue(ia,t)}function Zl(){He(ia),He(us),He(pi)}function Cc(t){t.memoizedState!==null&&ue(Zr,t);var e=ia.current,a=c0(e,t.type);e!==a&&(ue(us,t),ue(ia,a))}function Qr(t){us.current===t&&(He(ia),He(us)),Zr.current===t&&(He(Zr),Ms._currentValue=Zi)}var Fu,pm;function Xi(t){if(Fu===void 0)try{throw Error()}catch(a){var e=a.stack.trim().match(/\n( *(at )?)/);Fu=e&&e[1]||"",pm=-1<a.stack.indexOf(`
    at`)?" (<anonymous>)":-1<a.stack.indexOf("@")?"@unknown:0:0":""}return`
`+Fu+t+pm}var Yu=!1;function Xu(t,e){if(!t||Yu)return"";Yu=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var i={DetermineComponentFrameRoot:function(){try{if(e){var p=function(){throw Error()};if(Object.defineProperty(p.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(p,[])}catch(y){var f=y}Reflect.construct(t,[],p)}else{try{p.call()}catch(y){f=y}t.call(p.prototype)}}else{try{throw Error()}catch(y){f=y}(p=t())&&typeof p.catch=="function"&&p.catch(function(){})}}catch(y){if(y&&f&&typeof y.stack=="string")return[y.stack,f.stack]}return[null,null]}};i.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var l=Object.getOwnPropertyDescriptor(i.DetermineComponentFrameRoot,"name");l&&l.configurable&&Object.defineProperty(i.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var n=i.DetermineComponentFrameRoot(),s=n[0],r=n[1];if(s&&r){var o=s.split(`
`),u=r.split(`
`);for(l=i=0;i<o.length&&!o[i].includes("DetermineComponentFrameRoot");)i++;for(;l<u.length&&!u[l].includes("DetermineComponentFrameRoot");)l++;if(i===o.length||l===u.length)for(i=o.length-1,l=u.length-1;1<=i&&0<=l&&o[i]!==u[l];)l--;for(;1<=i&&0<=l;i--,l--)if(o[i]!==u[l]){if(i!==1||l!==1)do if(i--,l--,0>l||o[i]!==u[l]){var d=`
`+o[i].replace(" at new "," at ");return t.displayName&&d.includes("<anonymous>")&&(d=d.replace("<anonymous>",t.displayName)),d}while(1<=i&&0<=l);break}}}finally{Yu=!1,Error.prepareStackTrace=a}return(a=t?t.displayName||t.name:"")?Xi(a):""}function PM(t,e){switch(t.tag){case 26:case 27:case 5:return Xi(t.type);case 16:return Xi("Lazy");case 13:return t.child!==e&&e!==null?Xi("Suspense Fallback"):Xi("Suspense");case 19:return Xi("SuspenseList");case 0:case 15:return Xu(t.type,!1);case 11:return Xu(t.type.render,!1);case 1:return Xu(t.type,!0);case 31:return Xi("Activity");default:return""}}function ym(t){try{var e="",a=null;do e+=PM(t,a),a=t,t=t.return;while(t);return e}catch(i){return`
Error generating stack: `+i.message+`
`+i.stack}}var Tc=Object.prototype.hasOwnProperty,yd=_e.unstable_scheduleCallback,qu=_e.unstable_cancelCallback,_M=_e.unstable_shouldYield,NM=_e.unstable_requestPaint,ht=_e.unstable_now,DM=_e.unstable_getCurrentPriorityLevel,Vp=_e.unstable_ImmediatePriority,Zp=_e.unstable_UserBlockingPriority,kr=_e.unstable_NormalPriority,OM=_e.unstable_LowPriority,Ip=_e.unstable_IdlePriority,HM=_e.log,LM=_e.unstable_setDisableYieldValue,Gs=null,mt=null;function ci(t){if(typeof HM=="function"&&LM(t),mt&&typeof mt.setStrictMode=="function")try{mt.setStrictMode(Gs,t)}catch{}}var pt=Math.clz32?Math.clz32:FM,UM=Math.log,BM=Math.LN2;function FM(t){return t>>>=0,t===0?32:31-(UM(t)/BM|0)|0}var mr=256,pr=262144,yr=4194304;function qi(t){var e=t&42;if(e!==0)return e;switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return t&261888;case 262144:case 524288:case 1048576:case 2097152:return t&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return t&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return t}}function So(t,e,a){var i=t.pendingLanes;if(i===0)return 0;var l=0,n=t.suspendedLanes,s=t.pingedLanes;t=t.warmLanes;var r=i&134217727;return r!==0?(i=r&~n,i!==0?l=qi(i):(s&=r,s!==0?l=qi(s):a||(a=r&~t,a!==0&&(l=qi(a))))):(r=i&~n,r!==0?l=qi(r):s!==0?l=qi(s):a||(a=i&~t,a!==0&&(l=qi(a)))),l===0?0:e!==0&&e!==l&&(e&n)===0&&(n=l&-l,a=e&-e,n>=a||n===32&&(a&4194048)!==0)?e:l}function Cs(t,e){return(t.pendingLanes&~(t.suspendedLanes&~t.pingedLanes)&e)===0}function YM(t,e){switch(t){case 1:case 2:case 4:case 8:case 64:return e+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Qp(){var t=yr;return yr<<=1,(yr&62914560)===0&&(yr=4194304),t}function ju(t){for(var e=[],a=0;31>a;a++)e.push(t);return e}function Ts(t,e){t.pendingLanes|=e,e!==268435456&&(t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0)}function XM(t,e,a,i,l,n){var s=t.pendingLanes;t.pendingLanes=a,t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0,t.expiredLanes&=a,t.entangledLanes&=a,t.errorRecoveryDisabledLanes&=a,t.shellSuspendCounter=0;var r=t.entanglements,o=t.expirationTimes,u=t.hiddenUpdates;for(a=s&~a;0<a;){var d=31-pt(a),p=1<<d;r[d]=0,o[d]=-1;var f=u[d];if(f!==null)for(u[d]=null,d=0;d<f.length;d++){var y=f[d];y!==null&&(y.lane&=-536870913)}a&=~p}i!==0&&kp(t,i,0),n!==0&&l===0&&t.tag!==0&&(t.suspendedLanes|=n&~(s&~e))}function kp(t,e,a){t.pendingLanes|=e,t.suspendedLanes&=~e;var i=31-pt(e);t.entangledLanes|=e,t.entanglements[i]=t.entanglements[i]|1073741824|a&261930}function Kp(t,e){var a=t.entangledLanes|=e;for(t=t.entanglements;a;){var i=31-pt(a),l=1<<i;l&e|t[i]&e&&(t[i]|=e),a&=~l}}function Jp(t,e){var a=e&-e;return a=(a&42)!==0?1:gd(a),(a&(t.suspendedLanes|e))!==0?0:a}function gd(t){switch(t){case 2:t=1;break;case 8:t=4;break;case 32:t=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:t=128;break;case 268435456:t=134217728;break;default:t=0}return t}function vd(t){return t&=-t,2<t?8<t?(t&134217727)!==0?32:268435456:8:2}function Wp(){var t=te.p;return t!==0?t:(t=window.event,t===void 0?32:x0(t.type))}function gm(t,e){var a=te.p;try{return te.p=t,e()}finally{te.p=a}}var Ri=Math.random().toString(36).slice(2),Be="__reactFiber$"+Ri,it="__reactProps$"+Ri,ln="__reactContainer$"+Ri,wc="__reactEvents$"+Ri,qM="__reactListeners$"+Ri,jM="__reactHandles$"+Ri,vm="__reactResources$"+Ri,ws="__reactMarker$"+Ri;function bd(t){delete t[Be],delete t[it],delete t[wc],delete t[qM],delete t[jM]}function Al(t){var e=t[Be];if(e)return e;for(var a=t.parentNode;a;){if(e=a[ln]||a[Be]){if(a=e.alternate,e.child!==null||a!==null&&a.child!==null)for(t=Tp(t);t!==null;){if(a=t[Be])return a;t=Tp(t)}return e}t=a,a=t.parentNode}return null}function nn(t){if(t=t[Be]||t[ln]){var e=t.tag;if(e===5||e===6||e===13||e===31||e===26||e===27||e===3)return t}return null}function In(t){var e=t.tag;if(e===5||e===26||e===27||e===6)return t.stateNode;throw Error(S(33))}function Bl(t){var e=t[vm];return e||(e=t[vm]={hoistableStyles:new Map,hoistableScripts:new Map}),e}function Oe(t){t[ws]=!0}var $p=new Set,ey={};function al(t,e){Il(t,e),Il(t+"Capture",e)}function Il(t,e){for(ey[t]=e,t=0;t<e.length;t++)$p.add(e[t])}var VM=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),bm={},Mm={};function ZM(t){return Tc.call(Mm,t)?!0:Tc.call(bm,t)?!1:VM.test(t)?Mm[t]=!0:(bm[t]=!0,!1)}function Pr(t,e,a){if(ZM(e))if(a===null)t.removeAttribute(e);else{switch(typeof a){case"undefined":case"function":case"symbol":t.removeAttribute(e);return;case"boolean":var i=e.toLowerCase().slice(0,5);if(i!=="data-"&&i!=="aria-"){t.removeAttribute(e);return}}t.setAttribute(e,""+a)}}function gr(t,e,a){if(a===null)t.removeAttribute(e);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(e);return}t.setAttribute(e,""+a)}}function Ma(t,e,a,i){if(i===null)t.removeAttribute(a);else{switch(typeof i){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(a);return}t.setAttributeNS(e,a,""+i)}}function At(t){switch(typeof t){case"bigint":case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function ty(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function IM(t,e,a){var i=Object.getOwnPropertyDescriptor(t.constructor.prototype,e);if(!t.hasOwnProperty(e)&&typeof i<"u"&&typeof i.get=="function"&&typeof i.set=="function"){var l=i.get,n=i.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return l.call(this)},set:function(s){a=""+s,n.call(this,s)}}),Object.defineProperty(t,e,{enumerable:i.enumerable}),{getValue:function(){return a},setValue:function(s){a=""+s},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function Rc(t){if(!t._valueTracker){var e=ty(t)?"checked":"value";t._valueTracker=IM(t,e,""+t[e])}}function ay(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var a=e.getValue(),i="";return t&&(i=ty(t)?t.checked?"true":"false":t.value),t=i,t!==a?(e.setValue(t),!0):!1}function Kr(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}var QM=/[\n"\\]/g;function _t(t){return t.replace(QM,function(e){return"\\"+e.charCodeAt(0).toString(16)+" "})}function Ac(t,e,a,i,l,n,s,r){t.name="",s!=null&&typeof s!="function"&&typeof s!="symbol"&&typeof s!="boolean"?t.type=s:t.removeAttribute("type"),e!=null?s==="number"?(e===0&&t.value===""||t.value!=e)&&(t.value=""+At(e)):t.value!==""+At(e)&&(t.value=""+At(e)):s!=="submit"&&s!=="reset"||t.removeAttribute("value"),e!=null?zc(t,s,At(e)):a!=null?zc(t,s,At(a)):i!=null&&t.removeAttribute("value"),l==null&&n!=null&&(t.defaultChecked=!!n),l!=null&&(t.checked=l&&typeof l!="function"&&typeof l!="symbol"),r!=null&&typeof r!="function"&&typeof r!="symbol"&&typeof r!="boolean"?t.name=""+At(r):t.removeAttribute("name")}function iy(t,e,a,i,l,n,s,r){if(n!=null&&typeof n!="function"&&typeof n!="symbol"&&typeof n!="boolean"&&(t.type=n),e!=null||a!=null){if(!(n!=="submit"&&n!=="reset"||e!=null)){Rc(t);return}a=a!=null?""+At(a):"",e=e!=null?""+At(e):a,r||e===t.value||(t.value=e),t.defaultValue=e}i=i??l,i=typeof i!="function"&&typeof i!="symbol"&&!!i,t.checked=r?t.checked:!!i,t.defaultChecked=!!i,s!=null&&typeof s!="function"&&typeof s!="symbol"&&typeof s!="boolean"&&(t.name=s),Rc(t)}function zc(t,e,a){e==="number"&&Kr(t.ownerDocument)===t||t.defaultValue===""+a||(t.defaultValue=""+a)}function Fl(t,e,a,i){if(t=t.options,e){e={};for(var l=0;l<a.length;l++)e["$"+a[l]]=!0;for(a=0;a<t.length;a++)l=e.hasOwnProperty("$"+t[a].value),t[a].selected!==l&&(t[a].selected=l),l&&i&&(t[a].defaultSelected=!0)}else{for(a=""+At(a),e=null,l=0;l<t.length;l++){if(t[l].value===a){t[l].selected=!0,i&&(t[l].defaultSelected=!0);return}e!==null||t[l].disabled||(e=t[l])}e!==null&&(e.selected=!0)}}function ly(t,e,a){if(e!=null&&(e=""+At(e),e!==t.value&&(t.value=e),a==null)){t.defaultValue!==e&&(t.defaultValue=e);return}t.defaultValue=a!=null?""+At(a):""}function ny(t,e,a,i){if(e==null){if(i!=null){if(a!=null)throw Error(S(92));if(Zn(i)){if(1<i.length)throw Error(S(93));i=i[0]}a=i}a==null&&(a=""),e=a}a=At(e),t.defaultValue=a,i=t.textContent,i===a&&i!==""&&i!==null&&(t.value=i),Rc(t)}function Ql(t,e){if(e){var a=t.firstChild;if(a&&a===t.lastChild&&a.nodeType===3){a.nodeValue=e;return}}t.textContent=e}var kM=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function xm(t,e,a){var i=e.indexOf("--")===0;a==null||typeof a=="boolean"||a===""?i?t.setProperty(e,""):e==="float"?t.cssFloat="":t[e]="":i?t.setProperty(e,a):typeof a!="number"||a===0||kM.has(e)?e==="float"?t.cssFloat=a:t[e]=(""+a).trim():t[e]=a+"px"}function sy(t,e,a){if(e!=null&&typeof e!="object")throw Error(S(62));if(t=t.style,a!=null){for(var i in a)!a.hasOwnProperty(i)||e!=null&&e.hasOwnProperty(i)||(i.indexOf("--")===0?t.setProperty(i,""):i==="float"?t.cssFloat="":t[i]="");for(var l in e)i=e[l],e.hasOwnProperty(l)&&a[l]!==i&&xm(t,l,i)}else for(var n in e)e.hasOwnProperty(n)&&xm(t,n,e[n])}function Md(t){if(t.indexOf("-")===-1)return!1;switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var KM=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),JM=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function _r(t){return JM.test(""+t)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":t}function Ra(){}var Pc=null;function xd(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var zl=null,Yl=null;function Sm(t){var e=nn(t);if(e&&(t=e.stateNode)){var a=t[it]||null;e:switch(t=e.stateNode,e.type){case"input":if(Ac(t,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name),e=a.name,a.type==="radio"&&e!=null){for(a=t;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll('input[name="'+_t(""+e)+'"][type="radio"]'),e=0;e<a.length;e++){var i=a[e];if(i!==t&&i.form===t.form){var l=i[it]||null;if(!l)throw Error(S(90));Ac(i,l.value,l.defaultValue,l.defaultValue,l.checked,l.defaultChecked,l.type,l.name)}}for(e=0;e<a.length;e++)i=a[e],i.form===t.form&&ay(i)}break e;case"textarea":ly(t,a.value,a.defaultValue);break e;case"select":e=a.value,e!=null&&Fl(t,!!a.multiple,e,!1)}}}var Vu=!1;function ry(t,e,a){if(Vu)return t(e,a);Vu=!0;try{var i=t(e);return i}finally{if(Vu=!1,(zl!==null||Yl!==null)&&(Do(),zl&&(e=zl,t=Yl,Yl=zl=null,Sm(e),t)))for(e=0;e<t.length;e++)Sm(t[e])}}function cs(t,e){var a=t.stateNode;if(a===null)return null;var i=a[it]||null;if(i===null)return null;a=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(t=t.type,i=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!i;break e;default:t=!1}if(t)return null;if(a&&typeof a!="function")throw Error(S(231,e,typeof a));return a}var Na=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),_c=!1;if(Na)try{Sl={},Object.defineProperty(Sl,"passive",{get:function(){_c=!0}}),window.addEventListener("test",Sl,Sl),window.removeEventListener("test",Sl,Sl)}catch{_c=!1}var Sl,di=null,Sd=null,Nr=null;function oy(){if(Nr)return Nr;var t,e=Sd,a=e.length,i,l="value"in di?di.value:di.textContent,n=l.length;for(t=0;t<a&&e[t]===l[t];t++);var s=a-t;for(i=1;i<=s&&e[a-i]===l[n-i];i++);return Nr=l.slice(t,1<i?1-i:void 0)}function Dr(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function vr(){return!0}function Em(){return!1}function lt(t){function e(a,i,l,n,s){this._reactName=a,this._targetInst=l,this.type=i,this.nativeEvent=n,this.target=s,this.currentTarget=null;for(var r in t)t.hasOwnProperty(r)&&(a=t[r],this[r]=a?a(n):n[r]);return this.isDefaultPrevented=(n.defaultPrevented!=null?n.defaultPrevented:n.returnValue===!1)?vr:Em,this.isPropagationStopped=Em,this}return he(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=vr)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=vr)},persist:function(){},isPersistent:vr}),e}var il={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Eo=lt(il),Rs=he({},il,{view:0,detail:0}),WM=lt(Rs),Zu,Iu,Bn,Go=he({},Rs,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Ed,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==Bn&&(Bn&&t.type==="mousemove"?(Zu=t.screenX-Bn.screenX,Iu=t.screenY-Bn.screenY):Iu=Zu=0,Bn=t),Zu)},movementY:function(t){return"movementY"in t?t.movementY:Iu}}),Gm=lt(Go),$M=he({},Go,{dataTransfer:0}),ex=lt($M),tx=he({},Rs,{relatedTarget:0}),Qu=lt(tx),ax=he({},il,{animationName:0,elapsedTime:0,pseudoElement:0}),ix=lt(ax),lx=he({},il,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),nx=lt(lx),sx=he({},il,{data:0}),Cm=lt(sx),rx={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},ox={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},ux={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function cx(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=ux[t])?!!e[t]:!1}function Ed(){return cx}var dx=he({},Rs,{key:function(t){if(t.key){var e=rx[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=Dr(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?ox[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Ed,charCode:function(t){return t.type==="keypress"?Dr(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?Dr(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),fx=lt(dx),hx=he({},Go,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Tm=lt(hx),mx=he({},Rs,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Ed}),px=lt(mx),yx=he({},il,{propertyName:0,elapsedTime:0,pseudoElement:0}),gx=lt(yx),vx=he({},Go,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),bx=lt(vx),Mx=he({},il,{newState:0,oldState:0}),xx=lt(Mx),Sx=[9,13,27,32],Gd=Na&&"CompositionEvent"in window,Kn=null;Na&&"documentMode"in document&&(Kn=document.documentMode);var Ex=Na&&"TextEvent"in window&&!Kn,uy=Na&&(!Gd||Kn&&8<Kn&&11>=Kn),wm=" ",Rm=!1;function cy(t,e){switch(t){case"keyup":return Sx.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function dy(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var Pl=!1;function Gx(t,e){switch(t){case"compositionend":return dy(e);case"keypress":return e.which!==32?null:(Rm=!0,wm);case"textInput":return t=e.data,t===wm&&Rm?null:t;default:return null}}function Cx(t,e){if(Pl)return t==="compositionend"||!Gd&&cy(t,e)?(t=oy(),Nr=Sd=di=null,Pl=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return uy&&e.locale!=="ko"?null:e.data;default:return null}}var Tx={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Am(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!Tx[t.type]:e==="textarea"}function fy(t,e,a,i){zl?Yl?Yl.push(i):Yl=[i]:zl=i,e=po(e,"onChange"),0<e.length&&(a=new Eo("onChange","change",null,a,i),t.push({event:a,listeners:e}))}var Jn=null,ds=null;function wx(t){r0(t,0)}function Co(t){var e=In(t);if(ay(e))return t}function zm(t,e){if(t==="change")return e}var hy=!1;Na&&(Na?(Mr="oninput"in document,Mr||(ku=document.createElement("div"),ku.setAttribute("oninput","return;"),Mr=typeof ku.oninput=="function"),br=Mr):br=!1,hy=br&&(!document.documentMode||9<document.documentMode));var br,Mr,ku;function Pm(){Jn&&(Jn.detachEvent("onpropertychange",my),ds=Jn=null)}function my(t){if(t.propertyName==="value"&&Co(ds)){var e=[];fy(e,ds,t,xd(t)),ry(wx,e)}}function Rx(t,e,a){t==="focusin"?(Pm(),Jn=e,ds=a,Jn.attachEvent("onpropertychange",my)):t==="focusout"&&Pm()}function Ax(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return Co(ds)}function zx(t,e){if(t==="click")return Co(e)}function Px(t,e){if(t==="input"||t==="change")return Co(e)}function _x(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var gt=typeof Object.is=="function"?Object.is:_x;function fs(t,e){if(gt(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var a=Object.keys(t),i=Object.keys(e);if(a.length!==i.length)return!1;for(i=0;i<a.length;i++){var l=a[i];if(!Tc.call(e,l)||!gt(t[l],e[l]))return!1}return!0}function _m(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function Nm(t,e){var a=_m(t);t=0;for(var i;a;){if(a.nodeType===3){if(i=t+a.textContent.length,t<=e&&i>=e)return{node:a,offset:e-t};t=i}e:{for(;a;){if(a.nextSibling){a=a.nextSibling;break e}a=a.parentNode}a=void 0}a=_m(a)}}function py(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?py(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function yy(t){t=t!=null&&t.ownerDocument!=null&&t.ownerDocument.defaultView!=null?t.ownerDocument.defaultView:window;for(var e=Kr(t.document);e instanceof t.HTMLIFrameElement;){try{var a=typeof e.contentWindow.location.href=="string"}catch{a=!1}if(a)t=e.contentWindow;else break;e=Kr(t.document)}return e}function Cd(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}var Nx=Na&&"documentMode"in document&&11>=document.documentMode,_l=null,Nc=null,Wn=null,Dc=!1;function Dm(t,e,a){var i=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;Dc||_l==null||_l!==Kr(i)||(i=_l,"selectionStart"in i&&Cd(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),Wn&&fs(Wn,i)||(Wn=i,i=po(Nc,"onSelect"),0<i.length&&(e=new Eo("onSelect","select",null,e,a),t.push({event:e,listeners:i}),e.target=_l)))}function Yi(t,e){var a={};return a[t.toLowerCase()]=e.toLowerCase(),a["Webkit"+t]="webkit"+e,a["Moz"+t]="moz"+e,a}var Nl={animationend:Yi("Animation","AnimationEnd"),animationiteration:Yi("Animation","AnimationIteration"),animationstart:Yi("Animation","AnimationStart"),transitionrun:Yi("Transition","TransitionRun"),transitionstart:Yi("Transition","TransitionStart"),transitioncancel:Yi("Transition","TransitionCancel"),transitionend:Yi("Transition","TransitionEnd")},Ku={},gy={};Na&&(gy=document.createElement("div").style,"AnimationEvent"in window||(delete Nl.animationend.animation,delete Nl.animationiteration.animation,delete Nl.animationstart.animation),"TransitionEvent"in window||delete Nl.transitionend.transition);function ll(t){if(Ku[t])return Ku[t];if(!Nl[t])return t;var e=Nl[t],a;for(a in e)if(e.hasOwnProperty(a)&&a in gy)return Ku[t]=e[a];return t}var vy=ll("animationend"),by=ll("animationiteration"),My=ll("animationstart"),Dx=ll("transitionrun"),Ox=ll("transitionstart"),Hx=ll("transitioncancel"),xy=ll("transitionend"),Sy=new Map,Oc="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");Oc.push("scrollEnd");function jt(t,e){Sy.set(t,e),al(e,[t])}var Jr=typeof reportError=="function"?reportError:function(t){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var e=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof t=="object"&&t!==null&&typeof t.message=="string"?String(t.message):String(t),error:t});if(!window.dispatchEvent(e))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",t);return}console.error(t)},Rt=[],Dl=0,Td=0;function To(){for(var t=Dl,e=Td=Dl=0;e<t;){var a=Rt[e];Rt[e++]=null;var i=Rt[e];Rt[e++]=null;var l=Rt[e];Rt[e++]=null;var n=Rt[e];if(Rt[e++]=null,i!==null&&l!==null){var s=i.pending;s===null?l.next=l:(l.next=s.next,s.next=l),i.pending=l}n!==0&&Ey(a,l,n)}}function wo(t,e,a,i){Rt[Dl++]=t,Rt[Dl++]=e,Rt[Dl++]=a,Rt[Dl++]=i,Td|=i,t.lanes|=i,t=t.alternate,t!==null&&(t.lanes|=i)}function wd(t,e,a,i){return wo(t,e,a,i),Wr(t)}function nl(t,e){return wo(t,null,null,e),Wr(t)}function Ey(t,e,a){t.lanes|=a;var i=t.alternate;i!==null&&(i.lanes|=a);for(var l=!1,n=t.return;n!==null;)n.childLanes|=a,i=n.alternate,i!==null&&(i.childLanes|=a),n.tag===22&&(t=n.stateNode,t===null||t._visibility&1||(l=!0)),t=n,n=n.return;return t.tag===3?(n=t.stateNode,l&&e!==null&&(l=31-pt(a),t=n.hiddenUpdates,i=t[l],i===null?t[l]=[e]:i.push(e),e.lane=a|536870912),n):null}function Wr(t){if(50<rs)throw rs=0,ad=null,Error(S(185));for(var e=t.return;e!==null;)t=e,e=t.return;return t.tag===3?t.stateNode:null}var Ol={};function Lx(t,e,a,i){this.tag=t,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function dt(t,e,a,i){return new Lx(t,e,a,i)}function Rd(t){return t=t.prototype,!(!t||!t.isReactComponent)}function za(t,e){var a=t.alternate;return a===null?(a=dt(t.tag,e,t.key,t.mode),a.elementType=t.elementType,a.type=t.type,a.stateNode=t.stateNode,a.alternate=t,t.alternate=a):(a.pendingProps=e,a.type=t.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=t.flags&65011712,a.childLanes=t.childLanes,a.lanes=t.lanes,a.child=t.child,a.memoizedProps=t.memoizedProps,a.memoizedState=t.memoizedState,a.updateQueue=t.updateQueue,e=t.dependencies,a.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},a.sibling=t.sibling,a.index=t.index,a.ref=t.ref,a.refCleanup=t.refCleanup,a}function Gy(t,e){t.flags&=65011714;var a=t.alternate;return a===null?(t.childLanes=0,t.lanes=e,t.child=null,t.subtreeFlags=0,t.memoizedProps=null,t.memoizedState=null,t.updateQueue=null,t.dependencies=null,t.stateNode=null):(t.childLanes=a.childLanes,t.lanes=a.lanes,t.child=a.child,t.subtreeFlags=0,t.deletions=null,t.memoizedProps=a.memoizedProps,t.memoizedState=a.memoizedState,t.updateQueue=a.updateQueue,t.type=a.type,e=a.dependencies,t.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),t}function Or(t,e,a,i,l,n){var s=0;if(i=t,typeof t=="function")Rd(t)&&(s=1);else if(typeof t=="string")s=FS(t,a,ia.current)?26:t==="html"||t==="head"||t==="body"?27:5;else e:switch(t){case Sc:return t=dt(31,a,e,l),t.elementType=Sc,t.lanes=n,t;case wl:return Ii(a.children,l,n,e);case qp:s=8,l|=24;break;case bc:return t=dt(12,a,e,l|2),t.elementType=bc,t.lanes=n,t;case Mc:return t=dt(13,a,e,l),t.elementType=Mc,t.lanes=n,t;case xc:return t=dt(19,a,e,l),t.elementType=xc,t.lanes=n,t;default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case wa:s=10;break e;case jp:s=9;break e;case md:s=11;break e;case pd:s=14;break e;case li:s=16,i=null;break e}s=29,a=Error(S(130,t===null?"null":typeof t,"")),i=null}return e=dt(s,a,e,l),e.elementType=t,e.type=i,e.lanes=n,e}function Ii(t,e,a,i){return t=dt(7,t,i,e),t.lanes=a,t}function Ju(t,e,a){return t=dt(6,t,null,e),t.lanes=a,t}function Cy(t){var e=dt(18,null,null,0);return e.stateNode=t,e}function Wu(t,e,a){return e=dt(4,t.children!==null?t.children:[],t.key,e),e.lanes=a,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}var Om=new WeakMap;function Nt(t,e){if(typeof t=="object"&&t!==null){var a=Om.get(t);return a!==void 0?a:(e={value:t,source:e,stack:ym(e)},Om.set(t,e),e)}return{value:t,source:e,stack:ym(e)}}var Hl=[],Ll=0,$r=null,hs=0,zt=[],Pt=0,Gi=null,ea=1,ta="";function Ca(t,e){Hl[Ll++]=hs,Hl[Ll++]=$r,$r=t,hs=e}function Ty(t,e,a){zt[Pt++]=ea,zt[Pt++]=ta,zt[Pt++]=Gi,Gi=t;var i=ea;t=ta;var l=32-pt(i)-1;i&=~(1<<l),a+=1;var n=32-pt(e)+l;if(30<n){var s=l-l%5;n=(i&(1<<s)-1).toString(32),i>>=s,l-=s,ea=1<<32-pt(e)+l|a<<l|i,ta=n+t}else ea=1<<n|a<<l|i,ta=t}function Ad(t){t.return!==null&&(Ca(t,1),Ty(t,1,0))}function zd(t){for(;t===$r;)$r=Hl[--Ll],Hl[Ll]=null,hs=Hl[--Ll],Hl[Ll]=null;for(;t===Gi;)Gi=zt[--Pt],zt[Pt]=null,ta=zt[--Pt],zt[Pt]=null,ea=zt[--Pt],zt[Pt]=null}function wy(t,e){zt[Pt++]=ea,zt[Pt++]=ta,zt[Pt++]=Gi,ea=e.id,ta=e.overflow,Gi=t}var Fe=null,fe=null,I=!1,yi=null,Dt=!1,Hc=Error(S(519));function Ci(t){var e=Error(S(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw ms(Nt(e,t)),Hc}function Hm(t){var e=t.stateNode,a=t.type,i=t.memoizedProps;switch(e[Be]=t,e[it]=i,a){case"dialog":Y("cancel",e),Y("close",e);break;case"iframe":case"object":case"embed":Y("load",e);break;case"video":case"audio":for(a=0;a<vs.length;a++)Y(vs[a],e);break;case"source":Y("error",e);break;case"img":case"image":case"link":Y("error",e),Y("load",e);break;case"details":Y("toggle",e);break;case"input":Y("invalid",e),iy(e,i.value,i.defaultValue,i.checked,i.defaultChecked,i.type,i.name,!0);break;case"select":Y("invalid",e);break;case"textarea":Y("invalid",e),ny(e,i.value,i.defaultValue,i.children)}a=i.children,typeof a!="string"&&typeof a!="number"&&typeof a!="bigint"||e.textContent===""+a||i.suppressHydrationWarning===!0||u0(e.textContent,a)?(i.popover!=null&&(Y("beforetoggle",e),Y("toggle",e)),i.onScroll!=null&&Y("scroll",e),i.onScrollEnd!=null&&Y("scrollend",e),i.onClick!=null&&(e.onclick=Ra),e=!0):e=!1,e||Ci(t,!0)}function Lm(t){for(Fe=t.return;Fe;)switch(Fe.tag){case 5:case 31:case 13:Dt=!1;return;case 27:case 3:Dt=!0;return;default:Fe=Fe.return}}function El(t){if(t!==Fe)return!1;if(!I)return Lm(t),I=!0,!1;var e=t.tag,a;if((a=e!==3&&e!==27)&&((a=e===5)&&(a=t.type,a=!(a!=="form"&&a!=="button")||rd(t.type,t.memoizedProps)),a=!a),a&&fe&&Ci(t),Lm(t),e===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(S(317));fe=Cp(t)}else if(e===31){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(S(317));fe=Cp(t)}else e===27?(e=fe,Ai(t.type)?(t=dd,dd=null,fe=t):fe=e):fe=Fe?Ht(t.stateNode.nextSibling):null;return!0}function Ji(){fe=Fe=null,I=!1}function $u(){var t=yi;return t!==null&&(tt===null?tt=t:tt.push.apply(tt,t),yi=null),t}function ms(t){yi===null?yi=[t]:yi.push(t)}var Lc=la(null),sl=null,Aa=null;function si(t,e,a){ue(Lc,e._currentValue),e._currentValue=a}function Pa(t){t._currentValue=Lc.current,He(Lc)}function Uc(t,e,a){for(;t!==null;){var i=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),t===a)break;t=t.return}}function Bc(t,e,a,i){var l=t.child;for(l!==null&&(l.return=t);l!==null;){var n=l.dependencies;if(n!==null){var s=l.child;n=n.firstContext;e:for(;n!==null;){var r=n;n=l;for(var o=0;o<e.length;o++)if(r.context===e[o]){n.lanes|=a,r=n.alternate,r!==null&&(r.lanes|=a),Uc(n.return,a,t),i||(s=null);break e}n=r.next}}else if(l.tag===18){if(s=l.return,s===null)throw Error(S(341));s.lanes|=a,n=s.alternate,n!==null&&(n.lanes|=a),Uc(s,a,t),s=null}else s=l.child;if(s!==null)s.return=l;else for(s=l;s!==null;){if(s===t){s=null;break}if(l=s.sibling,l!==null){l.return=s.return,s=l;break}s=s.return}l=s}}function sn(t,e,a,i){t=null;for(var l=e,n=!1;l!==null;){if(!n){if((l.flags&524288)!==0)n=!0;else if((l.flags&262144)!==0)break}if(l.tag===10){var s=l.alternate;if(s===null)throw Error(S(387));if(s=s.memoizedProps,s!==null){var r=l.type;gt(l.pendingProps.value,s.value)||(t!==null?t.push(r):t=[r])}}else if(l===Zr.current){if(s=l.alternate,s===null)throw Error(S(387));s.memoizedState.memoizedState!==l.memoizedState.memoizedState&&(t!==null?t.push(Ms):t=[Ms])}l=l.return}t!==null&&Bc(e,t,a,i),e.flags|=262144}function eo(t){for(t=t.firstContext;t!==null;){if(!gt(t.context._currentValue,t.memoizedValue))return!0;t=t.next}return!1}function Wi(t){sl=t,Aa=null,t=t.dependencies,t!==null&&(t.firstContext=null)}function Ye(t){return Ry(sl,t)}function xr(t,e){return sl===null&&Wi(t),Ry(t,e)}function Ry(t,e){var a=e._currentValue;if(e={context:e,memoizedValue:a,next:null},Aa===null){if(t===null)throw Error(S(308));Aa=e,t.dependencies={lanes:0,firstContext:e},t.flags|=524288}else Aa=Aa.next=e;return a}var Ux=typeof AbortController<"u"?AbortController:function(){var t=[],e=this.signal={aborted:!1,addEventListener:function(a,i){t.push(i)}};this.abort=function(){e.aborted=!0,t.forEach(function(a){return a()})}},Bx=_e.unstable_scheduleCallback,Fx=_e.unstable_NormalPriority,Te={$$typeof:wa,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Pd(){return{controller:new Ux,data:new Map,refCount:0}}function As(t){t.refCount--,t.refCount===0&&Bx(Fx,function(){t.controller.abort()})}var $n=null,Fc=0,kl=0,Xl=null;function Yx(t,e){if($n===null){var a=$n=[];Fc=0,kl=af(),Xl={status:"pending",value:void 0,then:function(i){a.push(i)}}}return Fc++,e.then(Um,Um),e}function Um(){if(--Fc===0&&$n!==null){Xl!==null&&(Xl.status="fulfilled");var t=$n;$n=null,kl=0,Xl=null;for(var e=0;e<t.length;e++)(0,t[e])()}}function Xx(t,e){var a=[],i={status:"pending",value:null,reason:null,then:function(l){a.push(l)}};return t.then(function(){i.status="fulfilled",i.value=e;for(var l=0;l<a.length;l++)(0,a[l])(e)},function(l){for(i.status="rejected",i.reason=l,l=0;l<a.length;l++)(0,a[l])(void 0)}),i}var Bm=_.S;_.S=function(t,e){Xg=ht(),typeof e=="object"&&e!==null&&typeof e.then=="function"&&Yx(t,e),Bm!==null&&Bm(t,e)};var Qi=la(null);function _d(){var t=Qi.current;return t!==null?t:re.pooledCache}function Hr(t,e){e===null?ue(Qi,Qi.current):ue(Qi,e.pool)}function Ay(){var t=_d();return t===null?null:{parent:Te._currentValue,pool:t}}var rn=Error(S(460)),Nd=Error(S(474)),Ro=Error(S(542)),to={then:function(){}};function Fm(t){return t=t.status,t==="fulfilled"||t==="rejected"}function zy(t,e,a){switch(a=t[a],a===void 0?t.push(e):a!==e&&(e.then(Ra,Ra),e=a),e.status){case"fulfilled":return e.value;case"rejected":throw t=e.reason,Xm(t),t;default:if(typeof e.status=="string")e.then(Ra,Ra);else{if(t=re,t!==null&&100<t.shellSuspendCounter)throw Error(S(482));t=e,t.status="pending",t.then(function(i){if(e.status==="pending"){var l=e;l.status="fulfilled",l.value=i}},function(i){if(e.status==="pending"){var l=e;l.status="rejected",l.reason=i}})}switch(e.status){case"fulfilled":return e.value;case"rejected":throw t=e.reason,Xm(t),t}throw ki=e,rn}}function ji(t){try{var e=t._init;return e(t._payload)}catch(a){throw a!==null&&typeof a=="object"&&typeof a.then=="function"?(ki=a,rn):a}}var ki=null;function Ym(){if(ki===null)throw Error(S(459));var t=ki;return ki=null,t}function Xm(t){if(t===rn||t===Ro)throw Error(S(483))}var ql=null,ps=0;function Sr(t){var e=ps;return ps+=1,ql===null&&(ql=[]),zy(ql,t,e)}function Fn(t,e){e=e.props.ref,t.ref=e!==void 0?e:null}function Er(t,e){throw e.$$typeof===RM?Error(S(525)):(t=Object.prototype.toString.call(e),Error(S(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)))}function Py(t){function e(h,c){if(t){var m=h.deletions;m===null?(h.deletions=[c],h.flags|=16):m.push(c)}}function a(h,c){if(!t)return null;for(;c!==null;)e(h,c),c=c.sibling;return null}function i(h){for(var c=new Map;h!==null;)h.key!==null?c.set(h.key,h):c.set(h.index,h),h=h.sibling;return c}function l(h,c){return h=za(h,c),h.index=0,h.sibling=null,h}function n(h,c,m){return h.index=m,t?(m=h.alternate,m!==null?(m=m.index,m<c?(h.flags|=67108866,c):m):(h.flags|=67108866,c)):(h.flags|=1048576,c)}function s(h){return t&&h.alternate===null&&(h.flags|=67108866),h}function r(h,c,m,v){return c===null||c.tag!==6?(c=Ju(m,h.mode,v),c.return=h,c):(c=l(c,m),c.return=h,c)}function o(h,c,m,v){var w=m.type;return w===wl?d(h,c,m.props.children,v,m.key):c!==null&&(c.elementType===w||typeof w=="object"&&w!==null&&w.$$typeof===li&&ji(w)===c.type)?(c=l(c,m.props),Fn(c,m),c.return=h,c):(c=Or(m.type,m.key,m.props,null,h.mode,v),Fn(c,m),c.return=h,c)}function u(h,c,m,v){return c===null||c.tag!==4||c.stateNode.containerInfo!==m.containerInfo||c.stateNode.implementation!==m.implementation?(c=Wu(m,h.mode,v),c.return=h,c):(c=l(c,m.children||[]),c.return=h,c)}function d(h,c,m,v,w){return c===null||c.tag!==7?(c=Ii(m,h.mode,v,w),c.return=h,c):(c=l(c,m),c.return=h,c)}function p(h,c,m){if(typeof c=="string"&&c!==""||typeof c=="number"||typeof c=="bigint")return c=Ju(""+c,h.mode,m),c.return=h,c;if(typeof c=="object"&&c!==null){switch(c.$$typeof){case hr:return m=Or(c.type,c.key,c.props,null,h.mode,m),Fn(m,c),m.return=h,m;case Vn:return c=Wu(c,h.mode,m),c.return=h,c;case li:return c=ji(c),p(h,c,m)}if(Zn(c)||Un(c))return c=Ii(c,h.mode,m,null),c.return=h,c;if(typeof c.then=="function")return p(h,Sr(c),m);if(c.$$typeof===wa)return p(h,xr(h,c),m);Er(h,c)}return null}function f(h,c,m,v){var w=c!==null?c.key:null;if(typeof m=="string"&&m!==""||typeof m=="number"||typeof m=="bigint")return w!==null?null:r(h,c,""+m,v);if(typeof m=="object"&&m!==null){switch(m.$$typeof){case hr:return m.key===w?o(h,c,m,v):null;case Vn:return m.key===w?u(h,c,m,v):null;case li:return m=ji(m),f(h,c,m,v)}if(Zn(m)||Un(m))return w!==null?null:d(h,c,m,v,null);if(typeof m.then=="function")return f(h,c,Sr(m),v);if(m.$$typeof===wa)return f(h,c,xr(h,m),v);Er(h,m)}return null}function y(h,c,m,v,w){if(typeof v=="string"&&v!==""||typeof v=="number"||typeof v=="bigint")return h=h.get(m)||null,r(c,h,""+v,w);if(typeof v=="object"&&v!==null){switch(v.$$typeof){case hr:return h=h.get(v.key===null?m:v.key)||null,o(c,h,v,w);case Vn:return h=h.get(v.key===null?m:v.key)||null,u(c,h,v,w);case li:return v=ji(v),y(h,c,m,v,w)}if(Zn(v)||Un(v))return h=h.get(m)||null,d(c,h,v,w,null);if(typeof v.then=="function")return y(h,c,m,Sr(v),w);if(v.$$typeof===wa)return y(h,c,m,xr(c,v),w);Er(c,v)}return null}function G(h,c,m,v){for(var w=null,L=null,T=c,N=c=0,E=null;T!==null&&N<m.length;N++){T.index>N?(E=T,T=null):E=T.sibling;var P=f(h,T,m[N],v);if(P===null){T===null&&(T=E);break}t&&T&&P.alternate===null&&e(h,T),c=n(P,c,N),L===null?w=P:L.sibling=P,L=P,T=E}if(N===m.length)return a(h,T),I&&Ca(h,N),w;if(T===null){for(;N<m.length;N++)T=p(h,m[N],v),T!==null&&(c=n(T,c,N),L===null?w=T:L.sibling=T,L=T);return I&&Ca(h,N),w}for(T=i(T);N<m.length;N++)E=y(T,h,N,m[N],v),E!==null&&(t&&E.alternate!==null&&T.delete(E.key===null?N:E.key),c=n(E,c,N),L===null?w=E:L.sibling=E,L=E);return t&&T.forEach(function(ge){return e(h,ge)}),I&&Ca(h,N),w}function C(h,c,m,v){if(m==null)throw Error(S(151));for(var w=null,L=null,T=c,N=c=0,E=null,P=m.next();T!==null&&!P.done;N++,P=m.next()){T.index>N?(E=T,T=null):E=T.sibling;var ge=f(h,T,P.value,v);if(ge===null){T===null&&(T=E);break}t&&T&&ge.alternate===null&&e(h,T),c=n(ge,c,N),L===null?w=ge:L.sibling=ge,L=ge,T=E}if(P.done)return a(h,T),I&&Ca(h,N),w;if(T===null){for(;!P.done;N++,P=m.next())P=p(h,P.value,v),P!==null&&(c=n(P,c,N),L===null?w=P:L.sibling=P,L=P);return I&&Ca(h,N),w}for(T=i(T);!P.done;N++,P=m.next())P=y(T,h,N,P.value,v),P!==null&&(t&&P.alternate!==null&&T.delete(P.key===null?N:P.key),c=n(P,c,N),L===null?w=P:L.sibling=P,L=P);return t&&T.forEach(function(va){return e(h,va)}),I&&Ca(h,N),w}function D(h,c,m,v){if(typeof m=="object"&&m!==null&&m.type===wl&&m.key===null&&(m=m.props.children),typeof m=="object"&&m!==null){switch(m.$$typeof){case hr:e:{for(var w=m.key;c!==null;){if(c.key===w){if(w=m.type,w===wl){if(c.tag===7){a(h,c.sibling),v=l(c,m.props.children),v.return=h,h=v;break e}}else if(c.elementType===w||typeof w=="object"&&w!==null&&w.$$typeof===li&&ji(w)===c.type){a(h,c.sibling),v=l(c,m.props),Fn(v,m),v.return=h,h=v;break e}a(h,c);break}else e(h,c);c=c.sibling}m.type===wl?(v=Ii(m.props.children,h.mode,v,m.key),v.return=h,h=v):(v=Or(m.type,m.key,m.props,null,h.mode,v),Fn(v,m),v.return=h,h=v)}return s(h);case Vn:e:{for(w=m.key;c!==null;){if(c.key===w)if(c.tag===4&&c.stateNode.containerInfo===m.containerInfo&&c.stateNode.implementation===m.implementation){a(h,c.sibling),v=l(c,m.children||[]),v.return=h,h=v;break e}else{a(h,c);break}else e(h,c);c=c.sibling}v=Wu(m,h.mode,v),v.return=h,h=v}return s(h);case li:return m=ji(m),D(h,c,m,v)}if(Zn(m))return G(h,c,m,v);if(Un(m)){if(w=Un(m),typeof w!="function")throw Error(S(150));return m=w.call(m),C(h,c,m,v)}if(typeof m.then=="function")return D(h,c,Sr(m),v);if(m.$$typeof===wa)return D(h,c,xr(h,m),v);Er(h,m)}return typeof m=="string"&&m!==""||typeof m=="number"||typeof m=="bigint"?(m=""+m,c!==null&&c.tag===6?(a(h,c.sibling),v=l(c,m),v.return=h,h=v):(a(h,c),v=Ju(m,h.mode,v),v.return=h,h=v),s(h)):a(h,c)}return function(h,c,m,v){try{ps=0;var w=D(h,c,m,v);return ql=null,w}catch(T){if(T===rn||T===Ro)throw T;var L=dt(29,T,null,h.mode);return L.lanes=v,L.return=h,L}}}var $i=Py(!0),_y=Py(!1),ni=!1;function Dd(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Yc(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,callbacks:null})}function gi(t){return{lane:t,tag:0,payload:null,callback:null,next:null}}function vi(t,e,a){var i=t.updateQueue;if(i===null)return null;if(i=i.shared,(ee&2)!==0){var l=i.pending;return l===null?e.next=e:(e.next=l.next,l.next=e),i.pending=e,e=Wr(t),Ey(t,null,a),e}return wo(t,i,e,a),Wr(t)}function es(t,e,a){if(e=e.updateQueue,e!==null&&(e=e.shared,(a&4194048)!==0)){var i=e.lanes;i&=t.pendingLanes,a|=i,e.lanes=a,Kp(t,a)}}function ec(t,e){var a=t.updateQueue,i=t.alternate;if(i!==null&&(i=i.updateQueue,a===i)){var l=null,n=null;if(a=a.firstBaseUpdate,a!==null){do{var s={lane:a.lane,tag:a.tag,payload:a.payload,callback:null,next:null};n===null?l=n=s:n=n.next=s,a=a.next}while(a!==null);n===null?l=n=e:n=n.next=e}else l=n=e;a={baseState:i.baseState,firstBaseUpdate:l,lastBaseUpdate:n,shared:i.shared,callbacks:i.callbacks},t.updateQueue=a;return}t=a.lastBaseUpdate,t===null?a.firstBaseUpdate=e:t.next=e,a.lastBaseUpdate=e}var Xc=!1;function ts(){if(Xc){var t=Xl;if(t!==null)throw t}}function as(t,e,a,i){Xc=!1;var l=t.updateQueue;ni=!1;var n=l.firstBaseUpdate,s=l.lastBaseUpdate,r=l.shared.pending;if(r!==null){l.shared.pending=null;var o=r,u=o.next;o.next=null,s===null?n=u:s.next=u,s=o;var d=t.alternate;d!==null&&(d=d.updateQueue,r=d.lastBaseUpdate,r!==s&&(r===null?d.firstBaseUpdate=u:r.next=u,d.lastBaseUpdate=o))}if(n!==null){var p=l.baseState;s=0,d=u=o=null,r=n;do{var f=r.lane&-536870913,y=f!==r.lane;if(y?(q&f)===f:(i&f)===f){f!==0&&f===kl&&(Xc=!0),d!==null&&(d=d.next={lane:0,tag:r.tag,payload:r.payload,callback:null,next:null});e:{var G=t,C=r;f=e;var D=a;switch(C.tag){case 1:if(G=C.payload,typeof G=="function"){p=G.call(D,p,f);break e}p=G;break e;case 3:G.flags=G.flags&-65537|128;case 0:if(G=C.payload,f=typeof G=="function"?G.call(D,p,f):G,f==null)break e;p=he({},p,f);break e;case 2:ni=!0}}f=r.callback,f!==null&&(t.flags|=64,y&&(t.flags|=8192),y=l.callbacks,y===null?l.callbacks=[f]:y.push(f))}else y={lane:f,tag:r.tag,payload:r.payload,callback:r.callback,next:null},d===null?(u=d=y,o=p):d=d.next=y,s|=f;if(r=r.next,r===null){if(r=l.shared.pending,r===null)break;y=r,r=y.next,y.next=null,l.lastBaseUpdate=y,l.shared.pending=null}}while(!0);d===null&&(o=p),l.baseState=o,l.firstBaseUpdate=u,l.lastBaseUpdate=d,n===null&&(l.shared.lanes=0),wi|=s,t.lanes=s,t.memoizedState=p}}function Ny(t,e){if(typeof t!="function")throw Error(S(191,t));t.call(e)}function Dy(t,e){var a=t.callbacks;if(a!==null)for(t.callbacks=null,t=0;t<a.length;t++)Ny(a[t],e)}var Kl=la(null),ao=la(0);function qm(t,e){t=La,ue(ao,t),ue(Kl,e),La=t|e.baseLanes}function qc(){ue(ao,La),ue(Kl,Kl.current)}function Od(){La=ao.current,He(Kl),He(ao)}var vt=la(null),Ot=null;function ri(t){var e=t.alternate;ue(xe,xe.current&1),ue(vt,t),Ot===null&&(e===null||Kl.current!==null||e.memoizedState!==null)&&(Ot=t)}function jc(t){ue(xe,xe.current),ue(vt,t),Ot===null&&(Ot=t)}function Oy(t){t.tag===22?(ue(xe,xe.current),ue(vt,t),Ot===null&&(Ot=t)):oi(t)}function oi(){ue(xe,xe.current),ue(vt,vt.current)}function ct(t){He(vt),Ot===t&&(Ot=null),He(xe)}var xe=la(0);function io(t){for(var e=t;e!==null;){if(e.tag===13){var a=e.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||ud(a)||cd(a)))return e}else if(e.tag===19&&(e.memoizedProps.revealOrder==="forwards"||e.memoizedProps.revealOrder==="backwards"||e.memoizedProps.revealOrder==="unstable_legacy-backwards"||e.memoizedProps.revealOrder==="together")){if((e.flags&128)!==0)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var Da=0,U=null,ne=null,Ge=null,lo=!1,jl=!1,el=!1,no=0,ys=0,Vl=null,qx=0;function ve(){throw Error(S(321))}function Hd(t,e){if(e===null)return!1;for(var a=0;a<e.length&&a<t.length;a++)if(!gt(t[a],e[a]))return!1;return!0}function Ld(t,e,a,i,l,n){return Da=n,U=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,_.H=t===null||t.memoizedState===null?fg:Qd,el=!1,n=a(i,l),el=!1,jl&&(n=Ly(e,a,i,l)),Hy(t),n}function Hy(t){_.H=gs;var e=ne!==null&&ne.next!==null;if(Da=0,Ge=ne=U=null,lo=!1,ys=0,Vl=null,e)throw Error(S(300));t===null||we||(t=t.dependencies,t!==null&&eo(t)&&(we=!0))}function Ly(t,e,a,i){U=t;var l=0;do{if(jl&&(Vl=null),ys=0,jl=!1,25<=l)throw Error(S(301));if(l+=1,Ge=ne=null,t.updateQueue!=null){var n=t.updateQueue;n.lastEffect=null,n.events=null,n.stores=null,n.memoCache!=null&&(n.memoCache.index=0)}_.H=hg,n=e(a,i)}while(jl);return n}function jx(){var t=_.H,e=t.useState()[0];return e=typeof e.then=="function"?zs(e):e,t=t.useState()[0],(ne!==null?ne.memoizedState:null)!==t&&(U.flags|=1024),e}function Ud(){var t=no!==0;return no=0,t}function Bd(t,e,a){e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~a}function Fd(t){if(lo){for(t=t.memoizedState;t!==null;){var e=t.queue;e!==null&&(e.pending=null),t=t.next}lo=!1}Da=0,Ge=ne=U=null,jl=!1,ys=no=0,Vl=null}function Ke(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Ge===null?U.memoizedState=Ge=t:Ge=Ge.next=t,Ge}function Se(){if(ne===null){var t=U.alternate;t=t!==null?t.memoizedState:null}else t=ne.next;var e=Ge===null?U.memoizedState:Ge.next;if(e!==null)Ge=e,ne=t;else{if(t===null)throw U.alternate===null?Error(S(467)):Error(S(310));ne=t,t={memoizedState:ne.memoizedState,baseState:ne.baseState,baseQueue:ne.baseQueue,queue:ne.queue,next:null},Ge===null?U.memoizedState=Ge=t:Ge=Ge.next=t}return Ge}function Ao(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function zs(t){var e=ys;return ys+=1,Vl===null&&(Vl=[]),t=zy(Vl,t,e),e=U,(Ge===null?e.memoizedState:Ge.next)===null&&(e=e.alternate,_.H=e===null||e.memoizedState===null?fg:Qd),t}function zo(t){if(t!==null&&typeof t=="object"){if(typeof t.then=="function")return zs(t);if(t.$$typeof===wa)return Ye(t)}throw Error(S(438,String(t)))}function Yd(t){var e=null,a=U.updateQueue;if(a!==null&&(e=a.memoCache),e==null){var i=U.alternate;i!==null&&(i=i.updateQueue,i!==null&&(i=i.memoCache,i!=null&&(e={data:i.data.map(function(l){return l.slice()}),index:0})))}if(e==null&&(e={data:[],index:0}),a===null&&(a=Ao(),U.updateQueue=a),a.memoCache=e,a=e.data[e.index],a===void 0)for(a=e.data[e.index]=Array(t),i=0;i<t;i++)a[i]=AM;return e.index++,a}function Oa(t,e){return typeof e=="function"?e(t):e}function Lr(t){var e=Se();return Xd(e,ne,t)}function Xd(t,e,a){var i=t.queue;if(i===null)throw Error(S(311));i.lastRenderedReducer=a;var l=t.baseQueue,n=i.pending;if(n!==null){if(l!==null){var s=l.next;l.next=n.next,n.next=s}e.baseQueue=l=n,i.pending=null}if(n=t.baseState,l===null)t.memoizedState=n;else{e=l.next;var r=s=null,o=null,u=e,d=!1;do{var p=u.lane&-536870913;if(p!==u.lane?(q&p)===p:(Da&p)===p){var f=u.revertLane;if(f===0)o!==null&&(o=o.next={lane:0,revertLane:0,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),p===kl&&(d=!0);else if((Da&f)===f){u=u.next,f===kl&&(d=!0);continue}else p={lane:0,revertLane:u.revertLane,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},o===null?(r=o=p,s=n):o=o.next=p,U.lanes|=f,wi|=f;p=u.action,el&&a(n,p),n=u.hasEagerState?u.eagerState:a(n,p)}else f={lane:p,revertLane:u.revertLane,gesture:u.gesture,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},o===null?(r=o=f,s=n):o=o.next=f,U.lanes|=p,wi|=p;u=u.next}while(u!==null&&u!==e);if(o===null?s=n:o.next=r,!gt(n,t.memoizedState)&&(we=!0,d&&(a=Xl,a!==null)))throw a;t.memoizedState=n,t.baseState=s,t.baseQueue=o,i.lastRenderedState=n}return l===null&&(i.lanes=0),[t.memoizedState,i.dispatch]}function tc(t){var e=Se(),a=e.queue;if(a===null)throw Error(S(311));a.lastRenderedReducer=t;var i=a.dispatch,l=a.pending,n=e.memoizedState;if(l!==null){a.pending=null;var s=l=l.next;do n=t(n,s.action),s=s.next;while(s!==l);gt(n,e.memoizedState)||(we=!0),e.memoizedState=n,e.baseQueue===null&&(e.baseState=n),a.lastRenderedState=n}return[n,i]}function Uy(t,e,a){var i=U,l=Se(),n=I;if(n){if(a===void 0)throw Error(S(407));a=a()}else a=e();var s=!gt((ne||l).memoizedState,a);if(s&&(l.memoizedState=a,we=!0),l=l.queue,qd(Yy.bind(null,i,l,t),[t]),l.getSnapshot!==e||s||Ge!==null&&Ge.memoizedState.tag&1){if(i.flags|=2048,Jl(9,{destroy:void 0},Fy.bind(null,i,l,a,e),null),re===null)throw Error(S(349));n||(Da&127)!==0||By(i,e,a)}return a}function By(t,e,a){t.flags|=16384,t={getSnapshot:e,value:a},e=U.updateQueue,e===null?(e=Ao(),U.updateQueue=e,e.stores=[t]):(a=e.stores,a===null?e.stores=[t]:a.push(t))}function Fy(t,e,a,i){e.value=a,e.getSnapshot=i,Xy(e)&&qy(t)}function Yy(t,e,a){return a(function(){Xy(e)&&qy(t)})}function Xy(t){var e=t.getSnapshot;t=t.value;try{var a=e();return!gt(t,a)}catch{return!0}}function qy(t){var e=nl(t,2);e!==null&&at(e,t,2)}function Vc(t){var e=Ke();if(typeof t=="function"){var a=t;if(t=a(),el){ci(!0);try{a()}finally{ci(!1)}}}return e.memoizedState=e.baseState=t,e.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Oa,lastRenderedState:t},e}function jy(t,e,a,i){return t.baseState=a,Xd(t,ne,typeof i=="function"?i:Oa)}function Vx(t,e,a,i,l){if(_o(t))throw Error(S(485));if(t=e.action,t!==null){var n={payload:l,action:t,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(s){n.listeners.push(s)}};_.T!==null?a(!0):n.isTransition=!1,i(n),a=e.pending,a===null?(n.next=e.pending=n,Vy(e,n)):(n.next=a.next,e.pending=a.next=n)}}function Vy(t,e){var a=e.action,i=e.payload,l=t.state;if(e.isTransition){var n=_.T,s={};_.T=s;try{var r=a(l,i),o=_.S;o!==null&&o(s,r),jm(t,e,r)}catch(u){Zc(t,e,u)}finally{n!==null&&s.types!==null&&(n.types=s.types),_.T=n}}else try{n=a(l,i),jm(t,e,n)}catch(u){Zc(t,e,u)}}function jm(t,e,a){a!==null&&typeof a=="object"&&typeof a.then=="function"?a.then(function(i){Vm(t,e,i)},function(i){return Zc(t,e,i)}):Vm(t,e,a)}function Vm(t,e,a){e.status="fulfilled",e.value=a,Zy(e),t.state=a,e=t.pending,e!==null&&(a=e.next,a===e?t.pending=null:(a=a.next,e.next=a,Vy(t,a)))}function Zc(t,e,a){var i=t.pending;if(t.pending=null,i!==null){i=i.next;do e.status="rejected",e.reason=a,Zy(e),e=e.next;while(e!==i)}t.action=null}function Zy(t){t=t.listeners;for(var e=0;e<t.length;e++)(0,t[e])()}function Iy(t,e){return e}function Zm(t,e){if(I){var a=re.formState;if(a!==null){e:{var i=U;if(I){if(fe){t:{for(var l=fe,n=Dt;l.nodeType!==8;){if(!n){l=null;break t}if(l=Ht(l.nextSibling),l===null){l=null;break t}}n=l.data,l=n==="F!"||n==="F"?l:null}if(l){fe=Ht(l.nextSibling),i=l.data==="F!";break e}}Ci(i)}i=!1}i&&(e=a[0])}}return a=Ke(),a.memoizedState=a.baseState=e,i={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Iy,lastRenderedState:e},a.queue=i,a=ug.bind(null,U,i),i.dispatch=a,i=Vc(!1),n=Id.bind(null,U,!1,i.queue),i=Ke(),l={state:e,dispatch:null,action:t,pending:null},i.queue=l,a=Vx.bind(null,U,l,n,a),l.dispatch=a,i.memoizedState=t,[e,a,!1]}function Im(t){var e=Se();return Qy(e,ne,t)}function Qy(t,e,a){if(e=Xd(t,e,Iy)[0],t=Lr(Oa)[0],typeof e=="object"&&e!==null&&typeof e.then=="function")try{var i=zs(e)}catch(s){throw s===rn?Ro:s}else i=e;e=Se();var l=e.queue,n=l.dispatch;return a!==e.memoizedState&&(U.flags|=2048,Jl(9,{destroy:void 0},Zx.bind(null,l,a),null)),[i,n,t]}function Zx(t,e){t.action=e}function Qm(t){var e=Se(),a=ne;if(a!==null)return Qy(e,a,t);Se(),e=e.memoizedState,a=Se();var i=a.queue.dispatch;return a.memoizedState=t,[e,i,!1]}function Jl(t,e,a,i){return t={tag:t,create:a,deps:i,inst:e,next:null},e=U.updateQueue,e===null&&(e=Ao(),U.updateQueue=e),a=e.lastEffect,a===null?e.lastEffect=t.next=t:(i=a.next,a.next=t,t.next=i,e.lastEffect=t),t}function ky(){return Se().memoizedState}function Ur(t,e,a,i){var l=Ke();U.flags|=t,l.memoizedState=Jl(1|e,{destroy:void 0},a,i===void 0?null:i)}function Po(t,e,a,i){var l=Se();i=i===void 0?null:i;var n=l.memoizedState.inst;ne!==null&&i!==null&&Hd(i,ne.memoizedState.deps)?l.memoizedState=Jl(e,n,a,i):(U.flags|=t,l.memoizedState=Jl(1|e,n,a,i))}function km(t,e){Ur(8390656,8,t,e)}function qd(t,e){Po(2048,8,t,e)}function Ix(t){U.flags|=4;var e=U.updateQueue;if(e===null)e=Ao(),U.updateQueue=e,e.events=[t];else{var a=e.events;a===null?e.events=[t]:a.push(t)}}function Ky(t){var e=Se().memoizedState;return Ix({ref:e,nextImpl:t}),function(){if((ee&2)!==0)throw Error(S(440));return e.impl.apply(void 0,arguments)}}function Jy(t,e){return Po(4,2,t,e)}function Wy(t,e){return Po(4,4,t,e)}function $y(t,e){if(typeof e=="function"){t=t();var a=e(t);return function(){typeof a=="function"?a():e(null)}}if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function eg(t,e,a){a=a!=null?a.concat([t]):null,Po(4,4,$y.bind(null,e,t),a)}function jd(){}function tg(t,e){var a=Se();e=e===void 0?null:e;var i=a.memoizedState;return e!==null&&Hd(e,i[1])?i[0]:(a.memoizedState=[t,e],t)}function ag(t,e){var a=Se();e=e===void 0?null:e;var i=a.memoizedState;if(e!==null&&Hd(e,i[1]))return i[0];if(i=t(),el){ci(!0);try{t()}finally{ci(!1)}}return a.memoizedState=[i,e],i}function Vd(t,e,a){return a===void 0||(Da&1073741824)!==0&&(q&261930)===0?t.memoizedState=e:(t.memoizedState=a,t=jg(),U.lanes|=t,wi|=t,a)}function ig(t,e,a,i){return gt(a,e)?a:Kl.current!==null?(t=Vd(t,a,i),gt(t,e)||(we=!0),t):(Da&42)===0||(Da&1073741824)!==0&&(q&261930)===0?(we=!0,t.memoizedState=a):(t=jg(),U.lanes|=t,wi|=t,e)}function lg(t,e,a,i,l){var n=te.p;te.p=n!==0&&8>n?n:8;var s=_.T,r={};_.T=r,Id(t,!1,e,a);try{var o=l(),u=_.S;if(u!==null&&u(r,o),o!==null&&typeof o=="object"&&typeof o.then=="function"){var d=Xx(o,i);is(t,e,d,yt(t))}else is(t,e,i,yt(t))}catch(p){is(t,e,{then:function(){},status:"rejected",reason:p},yt())}finally{te.p=n,s!==null&&r.types!==null&&(s.types=r.types),_.T=s}}function Qx(){}function Ic(t,e,a,i){if(t.tag!==5)throw Error(S(476));var l=ng(t).queue;lg(t,l,e,Zi,a===null?Qx:function(){return sg(t),a(i)})}function ng(t){var e=t.memoizedState;if(e!==null)return e;e={memoizedState:Zi,baseState:Zi,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Oa,lastRenderedState:Zi},next:null};var a={};return e.next={memoizedState:a,baseState:a,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Oa,lastRenderedState:a},next:null},t.memoizedState=e,t=t.alternate,t!==null&&(t.memoizedState=e),e}function sg(t){var e=ng(t);e.next===null&&(e=t.alternate.memoizedState),is(t,e.next.queue,{},yt())}function Zd(){return Ye(Ms)}function rg(){return Se().memoizedState}function og(){return Se().memoizedState}function kx(t){for(var e=t.return;e!==null;){switch(e.tag){case 24:case 3:var a=yt();t=gi(a);var i=vi(e,t,a);i!==null&&(at(i,e,a),es(i,e,a)),e={cache:Pd()},t.payload=e;return}e=e.return}}function Kx(t,e,a){var i=yt();a={lane:i,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null},_o(t)?cg(e,a):(a=wd(t,e,a,i),a!==null&&(at(a,t,i),dg(a,e,i)))}function ug(t,e,a){var i=yt();is(t,e,a,i)}function is(t,e,a,i){var l={lane:i,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null};if(_o(t))cg(e,l);else{var n=t.alternate;if(t.lanes===0&&(n===null||n.lanes===0)&&(n=e.lastRenderedReducer,n!==null))try{var s=e.lastRenderedState,r=n(s,a);if(l.hasEagerState=!0,l.eagerState=r,gt(r,s))return wo(t,e,l,0),re===null&&To(),!1}catch{}if(a=wd(t,e,l,i),a!==null)return at(a,t,i),dg(a,e,i),!0}return!1}function Id(t,e,a,i){if(i={lane:2,revertLane:af(),gesture:null,action:i,hasEagerState:!1,eagerState:null,next:null},_o(t)){if(e)throw Error(S(479))}else e=wd(t,a,i,2),e!==null&&at(e,t,2)}function _o(t){var e=t.alternate;return t===U||e!==null&&e===U}function cg(t,e){jl=lo=!0;var a=t.pending;a===null?e.next=e:(e.next=a.next,a.next=e),t.pending=e}function dg(t,e,a){if((a&4194048)!==0){var i=e.lanes;i&=t.pendingLanes,a|=i,e.lanes=a,Kp(t,a)}}var gs={readContext:Ye,use:zo,useCallback:ve,useContext:ve,useEffect:ve,useImperativeHandle:ve,useLayoutEffect:ve,useInsertionEffect:ve,useMemo:ve,useReducer:ve,useRef:ve,useState:ve,useDebugValue:ve,useDeferredValue:ve,useTransition:ve,useSyncExternalStore:ve,useId:ve,useHostTransitionStatus:ve,useFormState:ve,useActionState:ve,useOptimistic:ve,useMemoCache:ve,useCacheRefresh:ve};gs.useEffectEvent=ve;var fg={readContext:Ye,use:zo,useCallback:function(t,e){return Ke().memoizedState=[t,e===void 0?null:e],t},useContext:Ye,useEffect:km,useImperativeHandle:function(t,e,a){a=a!=null?a.concat([t]):null,Ur(4194308,4,$y.bind(null,e,t),a)},useLayoutEffect:function(t,e){return Ur(4194308,4,t,e)},useInsertionEffect:function(t,e){Ur(4,2,t,e)},useMemo:function(t,e){var a=Ke();e=e===void 0?null:e;var i=t();if(el){ci(!0);try{t()}finally{ci(!1)}}return a.memoizedState=[i,e],i},useReducer:function(t,e,a){var i=Ke();if(a!==void 0){var l=a(e);if(el){ci(!0);try{a(e)}finally{ci(!1)}}}else l=e;return i.memoizedState=i.baseState=l,t={pending:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:l},i.queue=t,t=t.dispatch=Kx.bind(null,U,t),[i.memoizedState,t]},useRef:function(t){var e=Ke();return t={current:t},e.memoizedState=t},useState:function(t){t=Vc(t);var e=t.queue,a=ug.bind(null,U,e);return e.dispatch=a,[t.memoizedState,a]},useDebugValue:jd,useDeferredValue:function(t,e){var a=Ke();return Vd(a,t,e)},useTransition:function(){var t=Vc(!1);return t=lg.bind(null,U,t.queue,!0,!1),Ke().memoizedState=t,[!1,t]},useSyncExternalStore:function(t,e,a){var i=U,l=Ke();if(I){if(a===void 0)throw Error(S(407));a=a()}else{if(a=e(),re===null)throw Error(S(349));(q&127)!==0||By(i,e,a)}l.memoizedState=a;var n={value:a,getSnapshot:e};return l.queue=n,km(Yy.bind(null,i,n,t),[t]),i.flags|=2048,Jl(9,{destroy:void 0},Fy.bind(null,i,n,a,e),null),a},useId:function(){var t=Ke(),e=re.identifierPrefix;if(I){var a=ta,i=ea;a=(i&~(1<<32-pt(i)-1)).toString(32)+a,e="_"+e+"R_"+a,a=no++,0<a&&(e+="H"+a.toString(32)),e+="_"}else a=qx++,e="_"+e+"r_"+a.toString(32)+"_";return t.memoizedState=e},useHostTransitionStatus:Zd,useFormState:Zm,useActionState:Zm,useOptimistic:function(t){var e=Ke();e.memoizedState=e.baseState=t;var a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return e.queue=a,e=Id.bind(null,U,!0,a),a.dispatch=e,[t,e]},useMemoCache:Yd,useCacheRefresh:function(){return Ke().memoizedState=kx.bind(null,U)},useEffectEvent:function(t){var e=Ke(),a={impl:t};return e.memoizedState=a,function(){if((ee&2)!==0)throw Error(S(440));return a.impl.apply(void 0,arguments)}}},Qd={readContext:Ye,use:zo,useCallback:tg,useContext:Ye,useEffect:qd,useImperativeHandle:eg,useInsertionEffect:Jy,useLayoutEffect:Wy,useMemo:ag,useReducer:Lr,useRef:ky,useState:function(){return Lr(Oa)},useDebugValue:jd,useDeferredValue:function(t,e){var a=Se();return ig(a,ne.memoizedState,t,e)},useTransition:function(){var t=Lr(Oa)[0],e=Se().memoizedState;return[typeof t=="boolean"?t:zs(t),e]},useSyncExternalStore:Uy,useId:rg,useHostTransitionStatus:Zd,useFormState:Im,useActionState:Im,useOptimistic:function(t,e){var a=Se();return jy(a,ne,t,e)},useMemoCache:Yd,useCacheRefresh:og};Qd.useEffectEvent=Ky;var hg={readContext:Ye,use:zo,useCallback:tg,useContext:Ye,useEffect:qd,useImperativeHandle:eg,useInsertionEffect:Jy,useLayoutEffect:Wy,useMemo:ag,useReducer:tc,useRef:ky,useState:function(){return tc(Oa)},useDebugValue:jd,useDeferredValue:function(t,e){var a=Se();return ne===null?Vd(a,t,e):ig(a,ne.memoizedState,t,e)},useTransition:function(){var t=tc(Oa)[0],e=Se().memoizedState;return[typeof t=="boolean"?t:zs(t),e]},useSyncExternalStore:Uy,useId:rg,useHostTransitionStatus:Zd,useFormState:Qm,useActionState:Qm,useOptimistic:function(t,e){var a=Se();return ne!==null?jy(a,ne,t,e):(a.baseState=t,[t,a.queue.dispatch])},useMemoCache:Yd,useCacheRefresh:og};hg.useEffectEvent=Ky;function ac(t,e,a,i){e=t.memoizedState,a=a(i,e),a=a==null?e:he({},e,a),t.memoizedState=a,t.lanes===0&&(t.updateQueue.baseState=a)}var Qc={enqueueSetState:function(t,e,a){t=t._reactInternals;var i=yt(),l=gi(i);l.payload=e,a!=null&&(l.callback=a),e=vi(t,l,i),e!==null&&(at(e,t,i),es(e,t,i))},enqueueReplaceState:function(t,e,a){t=t._reactInternals;var i=yt(),l=gi(i);l.tag=1,l.payload=e,a!=null&&(l.callback=a),e=vi(t,l,i),e!==null&&(at(e,t,i),es(e,t,i))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var a=yt(),i=gi(a);i.tag=2,e!=null&&(i.callback=e),e=vi(t,i,a),e!==null&&(at(e,t,a),es(e,t,a))}};function Km(t,e,a,i,l,n,s){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(i,n,s):e.prototype&&e.prototype.isPureReactComponent?!fs(a,i)||!fs(l,n):!0}function Jm(t,e,a,i){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(a,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(a,i),e.state!==t&&Qc.enqueueReplaceState(e,e.state,null)}function tl(t,e){var a=e;if("ref"in e){a={};for(var i in e)i!=="ref"&&(a[i]=e[i])}if(t=t.defaultProps){a===e&&(a=he({},a));for(var l in t)a[l]===void 0&&(a[l]=t[l])}return a}function mg(t){Jr(t)}function pg(t){console.error(t)}function yg(t){Jr(t)}function so(t,e){try{var a=t.onUncaughtError;a(e.value,{componentStack:e.stack})}catch(i){setTimeout(function(){throw i})}}function Wm(t,e,a){try{var i=t.onCaughtError;i(a.value,{componentStack:a.stack,errorBoundary:e.tag===1?e.stateNode:null})}catch(l){setTimeout(function(){throw l})}}function kc(t,e,a){return a=gi(a),a.tag=3,a.payload={element:null},a.callback=function(){so(t,e)},a}function gg(t){return t=gi(t),t.tag=3,t}function vg(t,e,a,i){var l=a.type.getDerivedStateFromError;if(typeof l=="function"){var n=i.value;t.payload=function(){return l(n)},t.callback=function(){Wm(e,a,i)}}var s=a.stateNode;s!==null&&typeof s.componentDidCatch=="function"&&(t.callback=function(){Wm(e,a,i),typeof l!="function"&&(bi===null?bi=new Set([this]):bi.add(this));var r=i.stack;this.componentDidCatch(i.value,{componentStack:r!==null?r:""})})}function Jx(t,e,a,i,l){if(a.flags|=32768,i!==null&&typeof i=="object"&&typeof i.then=="function"){if(e=a.alternate,e!==null&&sn(e,a,l,!0),a=vt.current,a!==null){switch(a.tag){case 31:case 13:return Ot===null?fo():a.alternate===null&&be===0&&(be=3),a.flags&=-257,a.flags|=65536,a.lanes=l,i===to?a.flags|=16384:(e=a.updateQueue,e===null?a.updateQueue=new Set([i]):e.add(i),hc(t,i,l)),!1;case 22:return a.flags|=65536,i===to?a.flags|=16384:(e=a.updateQueue,e===null?(e={transitions:null,markerInstances:null,retryQueue:new Set([i])},a.updateQueue=e):(a=e.retryQueue,a===null?e.retryQueue=new Set([i]):a.add(i)),hc(t,i,l)),!1}throw Error(S(435,a.tag))}return hc(t,i,l),fo(),!1}if(I)return e=vt.current,e!==null?((e.flags&65536)===0&&(e.flags|=256),e.flags|=65536,e.lanes=l,i!==Hc&&(t=Error(S(422),{cause:i}),ms(Nt(t,a)))):(i!==Hc&&(e=Error(S(423),{cause:i}),ms(Nt(e,a))),t=t.current.alternate,t.flags|=65536,l&=-l,t.lanes|=l,i=Nt(i,a),l=kc(t.stateNode,i,l),ec(t,l),be!==4&&(be=2)),!1;var n=Error(S(520),{cause:i});if(n=Nt(n,a),ss===null?ss=[n]:ss.push(n),be!==4&&(be=2),e===null)return!0;i=Nt(i,a),a=e;do{switch(a.tag){case 3:return a.flags|=65536,t=l&-l,a.lanes|=t,t=kc(a.stateNode,i,t),ec(a,t),!1;case 1:if(e=a.type,n=a.stateNode,(a.flags&128)===0&&(typeof e.getDerivedStateFromError=="function"||n!==null&&typeof n.componentDidCatch=="function"&&(bi===null||!bi.has(n))))return a.flags|=65536,l&=-l,a.lanes|=l,l=gg(l),vg(l,t,a,i),ec(a,l),!1}a=a.return}while(a!==null);return!1}var kd=Error(S(461)),we=!1;function Ue(t,e,a,i){e.child=t===null?_y(e,null,a,i):$i(e,t.child,a,i)}function $m(t,e,a,i,l){a=a.render;var n=e.ref;if("ref"in i){var s={};for(var r in i)r!=="ref"&&(s[r]=i[r])}else s=i;return Wi(e),i=Ld(t,e,a,s,n,l),r=Ud(),t!==null&&!we?(Bd(t,e,l),Ha(t,e,l)):(I&&r&&Ad(e),e.flags|=1,Ue(t,e,i,l),e.child)}function ep(t,e,a,i,l){if(t===null){var n=a.type;return typeof n=="function"&&!Rd(n)&&n.defaultProps===void 0&&a.compare===null?(e.tag=15,e.type=n,bg(t,e,n,i,l)):(t=Or(a.type,null,i,e,e.mode,l),t.ref=e.ref,t.return=e,e.child=t)}if(n=t.child,!Kd(t,l)){var s=n.memoizedProps;if(a=a.compare,a=a!==null?a:fs,a(s,i)&&t.ref===e.ref)return Ha(t,e,l)}return e.flags|=1,t=za(n,i),t.ref=e.ref,t.return=e,e.child=t}function bg(t,e,a,i,l){if(t!==null){var n=t.memoizedProps;if(fs(n,i)&&t.ref===e.ref)if(we=!1,e.pendingProps=i=n,Kd(t,l))(t.flags&131072)!==0&&(we=!0);else return e.lanes=t.lanes,Ha(t,e,l)}return Kc(t,e,a,i,l)}function Mg(t,e,a,i){var l=i.children,n=t!==null?t.memoizedState:null;if(t===null&&e.stateNode===null&&(e.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),i.mode==="hidden"){if((e.flags&128)!==0){if(n=n!==null?n.baseLanes|a:a,t!==null){for(i=e.child=t.child,l=0;i!==null;)l=l|i.lanes|i.childLanes,i=i.sibling;i=l&~n}else i=0,e.child=null;return tp(t,e,n,a,i)}if((a&536870912)!==0)e.memoizedState={baseLanes:0,cachePool:null},t!==null&&Hr(e,n!==null?n.cachePool:null),n!==null?qm(e,n):qc(),Oy(e);else return i=e.lanes=536870912,tp(t,e,n!==null?n.baseLanes|a:a,a,i)}else n!==null?(Hr(e,n.cachePool),qm(e,n),oi(e),e.memoizedState=null):(t!==null&&Hr(e,null),qc(),oi(e));return Ue(t,e,l,a),e.child}function Qn(t,e){return t!==null&&t.tag===22||e.stateNode!==null||(e.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),e.sibling}function tp(t,e,a,i,l){var n=_d();return n=n===null?null:{parent:Te._currentValue,pool:n},e.memoizedState={baseLanes:a,cachePool:n},t!==null&&Hr(e,null),qc(),Oy(e),t!==null&&sn(t,e,i,!0),e.childLanes=l,null}function Br(t,e){return e=ro({mode:e.mode,children:e.children},t.mode),e.ref=t.ref,t.child=e,e.return=t,e}function ap(t,e,a){return $i(e,t.child,null,a),t=Br(e,e.pendingProps),t.flags|=2,ct(e),e.memoizedState=null,t}function Wx(t,e,a){var i=e.pendingProps,l=(e.flags&128)!==0;if(e.flags&=-129,t===null){if(I){if(i.mode==="hidden")return t=Br(e,i),e.lanes=536870912,Qn(null,t);if(jc(e),(t=fe)?(t=f0(t,Dt),t=t!==null&&t.data==="&"?t:null,t!==null&&(e.memoizedState={dehydrated:t,treeContext:Gi!==null?{id:ea,overflow:ta}:null,retryLane:536870912,hydrationErrors:null},a=Cy(t),a.return=e,e.child=a,Fe=e,fe=null)):t=null,t===null)throw Ci(e);return e.lanes=536870912,null}return Br(e,i)}var n=t.memoizedState;if(n!==null){var s=n.dehydrated;if(jc(e),l)if(e.flags&256)e.flags&=-257,e=ap(t,e,a);else if(e.memoizedState!==null)e.child=t.child,e.flags|=128,e=null;else throw Error(S(558));else if(we||sn(t,e,a,!1),l=(a&t.childLanes)!==0,we||l){if(i=re,i!==null&&(s=Jp(i,a),s!==0&&s!==n.retryLane))throw n.retryLane=s,nl(t,s),at(i,t,s),kd;fo(),e=ap(t,e,a)}else t=n.treeContext,fe=Ht(s.nextSibling),Fe=e,I=!0,yi=null,Dt=!1,t!==null&&wy(e,t),e=Br(e,i),e.flags|=4096;return e}return t=za(t.child,{mode:i.mode,children:i.children}),t.ref=e.ref,e.child=t,t.return=e,t}function Fr(t,e){var a=e.ref;if(a===null)t!==null&&t.ref!==null&&(e.flags|=4194816);else{if(typeof a!="function"&&typeof a!="object")throw Error(S(284));(t===null||t.ref!==a)&&(e.flags|=4194816)}}function Kc(t,e,a,i,l){return Wi(e),a=Ld(t,e,a,i,void 0,l),i=Ud(),t!==null&&!we?(Bd(t,e,l),Ha(t,e,l)):(I&&i&&Ad(e),e.flags|=1,Ue(t,e,a,l),e.child)}function ip(t,e,a,i,l,n){return Wi(e),e.updateQueue=null,a=Ly(e,i,a,l),Hy(t),i=Ud(),t!==null&&!we?(Bd(t,e,n),Ha(t,e,n)):(I&&i&&Ad(e),e.flags|=1,Ue(t,e,a,n),e.child)}function lp(t,e,a,i,l){if(Wi(e),e.stateNode===null){var n=Ol,s=a.contextType;typeof s=="object"&&s!==null&&(n=Ye(s)),n=new a(i,n),e.memoizedState=n.state!==null&&n.state!==void 0?n.state:null,n.updater=Qc,e.stateNode=n,n._reactInternals=e,n=e.stateNode,n.props=i,n.state=e.memoizedState,n.refs={},Dd(e),s=a.contextType,n.context=typeof s=="object"&&s!==null?Ye(s):Ol,n.state=e.memoizedState,s=a.getDerivedStateFromProps,typeof s=="function"&&(ac(e,a,s,i),n.state=e.memoizedState),typeof a.getDerivedStateFromProps=="function"||typeof n.getSnapshotBeforeUpdate=="function"||typeof n.UNSAFE_componentWillMount!="function"&&typeof n.componentWillMount!="function"||(s=n.state,typeof n.componentWillMount=="function"&&n.componentWillMount(),typeof n.UNSAFE_componentWillMount=="function"&&n.UNSAFE_componentWillMount(),s!==n.state&&Qc.enqueueReplaceState(n,n.state,null),as(e,i,n,l),ts(),n.state=e.memoizedState),typeof n.componentDidMount=="function"&&(e.flags|=4194308),i=!0}else if(t===null){n=e.stateNode;var r=e.memoizedProps,o=tl(a,r);n.props=o;var u=n.context,d=a.contextType;s=Ol,typeof d=="object"&&d!==null&&(s=Ye(d));var p=a.getDerivedStateFromProps;d=typeof p=="function"||typeof n.getSnapshotBeforeUpdate=="function",r=e.pendingProps!==r,d||typeof n.UNSAFE_componentWillReceiveProps!="function"&&typeof n.componentWillReceiveProps!="function"||(r||u!==s)&&Jm(e,n,i,s),ni=!1;var f=e.memoizedState;n.state=f,as(e,i,n,l),ts(),u=e.memoizedState,r||f!==u||ni?(typeof p=="function"&&(ac(e,a,p,i),u=e.memoizedState),(o=ni||Km(e,a,o,i,f,u,s))?(d||typeof n.UNSAFE_componentWillMount!="function"&&typeof n.componentWillMount!="function"||(typeof n.componentWillMount=="function"&&n.componentWillMount(),typeof n.UNSAFE_componentWillMount=="function"&&n.UNSAFE_componentWillMount()),typeof n.componentDidMount=="function"&&(e.flags|=4194308)):(typeof n.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=u),n.props=i,n.state=u,n.context=s,i=o):(typeof n.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{n=e.stateNode,Yc(t,e),s=e.memoizedProps,d=tl(a,s),n.props=d,p=e.pendingProps,f=n.context,u=a.contextType,o=Ol,typeof u=="object"&&u!==null&&(o=Ye(u)),r=a.getDerivedStateFromProps,(u=typeof r=="function"||typeof n.getSnapshotBeforeUpdate=="function")||typeof n.UNSAFE_componentWillReceiveProps!="function"&&typeof n.componentWillReceiveProps!="function"||(s!==p||f!==o)&&Jm(e,n,i,o),ni=!1,f=e.memoizedState,n.state=f,as(e,i,n,l),ts();var y=e.memoizedState;s!==p||f!==y||ni||t!==null&&t.dependencies!==null&&eo(t.dependencies)?(typeof r=="function"&&(ac(e,a,r,i),y=e.memoizedState),(d=ni||Km(e,a,d,i,f,y,o)||t!==null&&t.dependencies!==null&&eo(t.dependencies))?(u||typeof n.UNSAFE_componentWillUpdate!="function"&&typeof n.componentWillUpdate!="function"||(typeof n.componentWillUpdate=="function"&&n.componentWillUpdate(i,y,o),typeof n.UNSAFE_componentWillUpdate=="function"&&n.UNSAFE_componentWillUpdate(i,y,o)),typeof n.componentDidUpdate=="function"&&(e.flags|=4),typeof n.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof n.componentDidUpdate!="function"||s===t.memoizedProps&&f===t.memoizedState||(e.flags|=4),typeof n.getSnapshotBeforeUpdate!="function"||s===t.memoizedProps&&f===t.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=y),n.props=i,n.state=y,n.context=o,i=d):(typeof n.componentDidUpdate!="function"||s===t.memoizedProps&&f===t.memoizedState||(e.flags|=4),typeof n.getSnapshotBeforeUpdate!="function"||s===t.memoizedProps&&f===t.memoizedState||(e.flags|=1024),i=!1)}return n=i,Fr(t,e),i=(e.flags&128)!==0,n||i?(n=e.stateNode,a=i&&typeof a.getDerivedStateFromError!="function"?null:n.render(),e.flags|=1,t!==null&&i?(e.child=$i(e,t.child,null,l),e.child=$i(e,null,a,l)):Ue(t,e,a,l),e.memoizedState=n.state,t=e.child):t=Ha(t,e,l),t}function np(t,e,a,i){return Ji(),e.flags|=256,Ue(t,e,a,i),e.child}var ic={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function lc(t){return{baseLanes:t,cachePool:Ay()}}function nc(t,e,a){return t=t!==null?t.childLanes&~a:0,e&&(t|=ft),t}function xg(t,e,a){var i=e.pendingProps,l=!1,n=(e.flags&128)!==0,s;if((s=n)||(s=t!==null&&t.memoizedState===null?!1:(xe.current&2)!==0),s&&(l=!0,e.flags&=-129),s=(e.flags&32)!==0,e.flags&=-33,t===null){if(I){if(l?ri(e):oi(e),(t=fe)?(t=f0(t,Dt),t=t!==null&&t.data!=="&"?t:null,t!==null&&(e.memoizedState={dehydrated:t,treeContext:Gi!==null?{id:ea,overflow:ta}:null,retryLane:536870912,hydrationErrors:null},a=Cy(t),a.return=e,e.child=a,Fe=e,fe=null)):t=null,t===null)throw Ci(e);return cd(t)?e.lanes=32:e.lanes=536870912,null}var r=i.children;return i=i.fallback,l?(oi(e),l=e.mode,r=ro({mode:"hidden",children:r},l),i=Ii(i,l,a,null),r.return=e,i.return=e,r.sibling=i,e.child=r,i=e.child,i.memoizedState=lc(a),i.childLanes=nc(t,s,a),e.memoizedState=ic,Qn(null,i)):(ri(e),Jc(e,r))}var o=t.memoizedState;if(o!==null&&(r=o.dehydrated,r!==null)){if(n)e.flags&256?(ri(e),e.flags&=-257,e=sc(t,e,a)):e.memoizedState!==null?(oi(e),e.child=t.child,e.flags|=128,e=null):(oi(e),r=i.fallback,l=e.mode,i=ro({mode:"visible",children:i.children},l),r=Ii(r,l,a,null),r.flags|=2,i.return=e,r.return=e,i.sibling=r,e.child=i,$i(e,t.child,null,a),i=e.child,i.memoizedState=lc(a),i.childLanes=nc(t,s,a),e.memoizedState=ic,e=Qn(null,i));else if(ri(e),cd(r)){if(s=r.nextSibling&&r.nextSibling.dataset,s)var u=s.dgst;s=u,i=Error(S(419)),i.stack="",i.digest=s,ms({value:i,source:null,stack:null}),e=sc(t,e,a)}else if(we||sn(t,e,a,!1),s=(a&t.childLanes)!==0,we||s){if(s=re,s!==null&&(i=Jp(s,a),i!==0&&i!==o.retryLane))throw o.retryLane=i,nl(t,i),at(s,t,i),kd;ud(r)||fo(),e=sc(t,e,a)}else ud(r)?(e.flags|=192,e.child=t.child,e=null):(t=o.treeContext,fe=Ht(r.nextSibling),Fe=e,I=!0,yi=null,Dt=!1,t!==null&&wy(e,t),e=Jc(e,i.children),e.flags|=4096);return e}return l?(oi(e),r=i.fallback,l=e.mode,o=t.child,u=o.sibling,i=za(o,{mode:"hidden",children:i.children}),i.subtreeFlags=o.subtreeFlags&65011712,u!==null?r=za(u,r):(r=Ii(r,l,a,null),r.flags|=2),r.return=e,i.return=e,i.sibling=r,e.child=i,Qn(null,i),i=e.child,r=t.child.memoizedState,r===null?r=lc(a):(l=r.cachePool,l!==null?(o=Te._currentValue,l=l.parent!==o?{parent:o,pool:o}:l):l=Ay(),r={baseLanes:r.baseLanes|a,cachePool:l}),i.memoizedState=r,i.childLanes=nc(t,s,a),e.memoizedState=ic,Qn(t.child,i)):(ri(e),a=t.child,t=a.sibling,a=za(a,{mode:"visible",children:i.children}),a.return=e,a.sibling=null,t!==null&&(s=e.deletions,s===null?(e.deletions=[t],e.flags|=16):s.push(t)),e.child=a,e.memoizedState=null,a)}function Jc(t,e){return e=ro({mode:"visible",children:e},t.mode),e.return=t,t.child=e}function ro(t,e){return t=dt(22,t,null,e),t.lanes=0,t}function sc(t,e,a){return $i(e,t.child,null,a),t=Jc(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function sp(t,e,a){t.lanes|=e;var i=t.alternate;i!==null&&(i.lanes|=e),Uc(t.return,e,a)}function rc(t,e,a,i,l,n){var s=t.memoizedState;s===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:a,tailMode:l,treeForkCount:n}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=i,s.tail=a,s.tailMode=l,s.treeForkCount=n)}function Sg(t,e,a){var i=e.pendingProps,l=i.revealOrder,n=i.tail;i=i.children;var s=xe.current,r=(s&2)!==0;if(r?(s=s&1|2,e.flags|=128):s&=1,ue(xe,s),Ue(t,e,i,a),i=I?hs:0,!r&&t!==null&&(t.flags&128)!==0)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&sp(t,a,e);else if(t.tag===19)sp(t,a,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}switch(l){case"forwards":for(a=e.child,l=null;a!==null;)t=a.alternate,t!==null&&io(t)===null&&(l=a),a=a.sibling;a=l,a===null?(l=e.child,e.child=null):(l=a.sibling,a.sibling=null),rc(e,!1,l,a,n,i);break;case"backwards":case"unstable_legacy-backwards":for(a=null,l=e.child,e.child=null;l!==null;){if(t=l.alternate,t!==null&&io(t)===null){e.child=l;break}t=l.sibling,l.sibling=a,a=l,l=t}rc(e,!0,a,null,n,i);break;case"together":rc(e,!1,null,null,void 0,i);break;default:e.memoizedState=null}return e.child}function Ha(t,e,a){if(t!==null&&(e.dependencies=t.dependencies),wi|=e.lanes,(a&e.childLanes)===0)if(t!==null){if(sn(t,e,a,!1),(a&e.childLanes)===0)return null}else return null;if(t!==null&&e.child!==t.child)throw Error(S(153));if(e.child!==null){for(t=e.child,a=za(t,t.pendingProps),e.child=a,a.return=e;t.sibling!==null;)t=t.sibling,a=a.sibling=za(t,t.pendingProps),a.return=e;a.sibling=null}return e.child}function Kd(t,e){return(t.lanes&e)!==0?!0:(t=t.dependencies,!!(t!==null&&eo(t)))}function $x(t,e,a){switch(e.tag){case 3:Ir(e,e.stateNode.containerInfo),si(e,Te,t.memoizedState.cache),Ji();break;case 27:case 5:Cc(e);break;case 4:Ir(e,e.stateNode.containerInfo);break;case 10:si(e,e.type,e.memoizedProps.value);break;case 31:if(e.memoizedState!==null)return e.flags|=128,jc(e),null;break;case 13:var i=e.memoizedState;if(i!==null)return i.dehydrated!==null?(ri(e),e.flags|=128,null):(a&e.child.childLanes)!==0?xg(t,e,a):(ri(e),t=Ha(t,e,a),t!==null?t.sibling:null);ri(e);break;case 19:var l=(t.flags&128)!==0;if(i=(a&e.childLanes)!==0,i||(sn(t,e,a,!1),i=(a&e.childLanes)!==0),l){if(i)return Sg(t,e,a);e.flags|=128}if(l=e.memoizedState,l!==null&&(l.rendering=null,l.tail=null,l.lastEffect=null),ue(xe,xe.current),i)break;return null;case 22:return e.lanes=0,Mg(t,e,a,e.pendingProps);case 24:si(e,Te,t.memoizedState.cache)}return Ha(t,e,a)}function Eg(t,e,a){if(t!==null)if(t.memoizedProps!==e.pendingProps)we=!0;else{if(!Kd(t,a)&&(e.flags&128)===0)return we=!1,$x(t,e,a);we=(t.flags&131072)!==0}else we=!1,I&&(e.flags&1048576)!==0&&Ty(e,hs,e.index);switch(e.lanes=0,e.tag){case 16:e:{var i=e.pendingProps;if(t=ji(e.elementType),e.type=t,typeof t=="function")Rd(t)?(i=tl(t,i),e.tag=1,e=lp(null,e,t,i,a)):(e.tag=0,e=Kc(null,e,t,i,a));else{if(t!=null){var l=t.$$typeof;if(l===md){e.tag=11,e=$m(null,e,t,i,a);break e}else if(l===pd){e.tag=14,e=ep(null,e,t,i,a);break e}}throw e=Ec(t)||t,Error(S(306,e,""))}}return e;case 0:return Kc(t,e,e.type,e.pendingProps,a);case 1:return i=e.type,l=tl(i,e.pendingProps),lp(t,e,i,l,a);case 3:e:{if(Ir(e,e.stateNode.containerInfo),t===null)throw Error(S(387));i=e.pendingProps;var n=e.memoizedState;l=n.element,Yc(t,e),as(e,i,null,a);var s=e.memoizedState;if(i=s.cache,si(e,Te,i),i!==n.cache&&Bc(e,[Te],a,!0),ts(),i=s.element,n.isDehydrated)if(n={element:i,isDehydrated:!1,cache:s.cache},e.updateQueue.baseState=n,e.memoizedState=n,e.flags&256){e=np(t,e,i,a);break e}else if(i!==l){l=Nt(Error(S(424)),e),ms(l),e=np(t,e,i,a);break e}else for(t=e.stateNode.containerInfo,t.nodeType===9?t=t.body:t=t.nodeName==="HTML"?t.ownerDocument.body:t,fe=Ht(t.firstChild),Fe=e,I=!0,yi=null,Dt=!0,a=_y(e,null,i,a),e.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling;else{if(Ji(),i===l){e=Ha(t,e,a);break e}Ue(t,e,i,a)}e=e.child}return e;case 26:return Fr(t,e),t===null?(a=Rp(e.type,null,e.pendingProps,null))?e.memoizedState=a:I||(a=e.type,t=e.pendingProps,i=yo(pi.current).createElement(a),i[Be]=e,i[it]=t,Xe(i,a,t),Oe(i),e.stateNode=i):e.memoizedState=Rp(e.type,t.memoizedProps,e.pendingProps,t.memoizedState),null;case 27:return Cc(e),t===null&&I&&(i=e.stateNode=h0(e.type,e.pendingProps,pi.current),Fe=e,Dt=!0,l=fe,Ai(e.type)?(dd=l,fe=Ht(i.firstChild)):fe=l),Ue(t,e,e.pendingProps.children,a),Fr(t,e),t===null&&(e.flags|=4194304),e.child;case 5:return t===null&&I&&((l=i=fe)&&(i=wS(i,e.type,e.pendingProps,Dt),i!==null?(e.stateNode=i,Fe=e,fe=Ht(i.firstChild),Dt=!1,l=!0):l=!1),l||Ci(e)),Cc(e),l=e.type,n=e.pendingProps,s=t!==null?t.memoizedProps:null,i=n.children,rd(l,n)?i=null:s!==null&&rd(l,s)&&(e.flags|=32),e.memoizedState!==null&&(l=Ld(t,e,jx,null,null,a),Ms._currentValue=l),Fr(t,e),Ue(t,e,i,a),e.child;case 6:return t===null&&I&&((t=a=fe)&&(a=RS(a,e.pendingProps,Dt),a!==null?(e.stateNode=a,Fe=e,fe=null,t=!0):t=!1),t||Ci(e)),null;case 13:return xg(t,e,a);case 4:return Ir(e,e.stateNode.containerInfo),i=e.pendingProps,t===null?e.child=$i(e,null,i,a):Ue(t,e,i,a),e.child;case 11:return $m(t,e,e.type,e.pendingProps,a);case 7:return Ue(t,e,e.pendingProps,a),e.child;case 8:return Ue(t,e,e.pendingProps.children,a),e.child;case 12:return Ue(t,e,e.pendingProps.children,a),e.child;case 10:return i=e.pendingProps,si(e,e.type,i.value),Ue(t,e,i.children,a),e.child;case 9:return l=e.type._context,i=e.pendingProps.children,Wi(e),l=Ye(l),i=i(l),e.flags|=1,Ue(t,e,i,a),e.child;case 14:return ep(t,e,e.type,e.pendingProps,a);case 15:return bg(t,e,e.type,e.pendingProps,a);case 19:return Sg(t,e,a);case 31:return Wx(t,e,a);case 22:return Mg(t,e,a,e.pendingProps);case 24:return Wi(e),i=Ye(Te),t===null?(l=_d(),l===null&&(l=re,n=Pd(),l.pooledCache=n,n.refCount++,n!==null&&(l.pooledCacheLanes|=a),l=n),e.memoizedState={parent:i,cache:l},Dd(e),si(e,Te,l)):((t.lanes&a)!==0&&(Yc(t,e),as(e,null,null,a),ts()),l=t.memoizedState,n=e.memoizedState,l.parent!==i?(l={parent:i,cache:i},e.memoizedState=l,e.lanes===0&&(e.memoizedState=e.updateQueue.baseState=l),si(e,Te,i)):(i=n.cache,si(e,Te,i),i!==l.cache&&Bc(e,[Te],a,!0))),Ue(t,e,e.pendingProps.children,a),e.child;case 29:throw e.pendingProps}throw Error(S(156,e.tag))}function xa(t){t.flags|=4}function oc(t,e,a,i,l){if((e=(t.mode&32)!==0)&&(e=!1),e){if(t.flags|=16777216,(l&335544128)===l)if(t.stateNode.complete)t.flags|=8192;else if(Ig())t.flags|=8192;else throw ki=to,Nd}else t.flags&=-16777217}function rp(t,e){if(e.type!=="stylesheet"||(e.state.loading&4)!==0)t.flags&=-16777217;else if(t.flags|=16777216,!y0(e))if(Ig())t.flags|=8192;else throw ki=to,Nd}function Gr(t,e){e!==null&&(t.flags|=4),t.flags&16384&&(e=t.tag!==22?Qp():536870912,t.lanes|=e,Wl|=e)}function Yn(t,e){if(!I)switch(t.tailMode){case"hidden":e=t.tail;for(var a=null;e!==null;)e.alternate!==null&&(a=e),e=e.sibling;a===null?t.tail=null:a.sibling=null;break;case"collapsed":a=t.tail;for(var i=null;a!==null;)a.alternate!==null&&(i=a),a=a.sibling;i===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:i.sibling=null}}function de(t){var e=t.alternate!==null&&t.alternate.child===t.child,a=0,i=0;if(e)for(var l=t.child;l!==null;)a|=l.lanes|l.childLanes,i|=l.subtreeFlags&65011712,i|=l.flags&65011712,l.return=t,l=l.sibling;else for(l=t.child;l!==null;)a|=l.lanes|l.childLanes,i|=l.subtreeFlags,i|=l.flags,l.return=t,l=l.sibling;return t.subtreeFlags|=i,t.childLanes=a,e}function eS(t,e,a){var i=e.pendingProps;switch(zd(e),e.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return de(e),null;case 1:return de(e),null;case 3:return a=e.stateNode,i=null,t!==null&&(i=t.memoizedState.cache),e.memoizedState.cache!==i&&(e.flags|=2048),Pa(Te),Zl(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(t===null||t.child===null)&&(El(e)?xa(e):t===null||t.memoizedState.isDehydrated&&(e.flags&256)===0||(e.flags|=1024,$u())),de(e),null;case 26:var l=e.type,n=e.memoizedState;return t===null?(xa(e),n!==null?(de(e),rp(e,n)):(de(e),oc(e,l,null,i,a))):n?n!==t.memoizedState?(xa(e),de(e),rp(e,n)):(de(e),e.flags&=-16777217):(t=t.memoizedProps,t!==i&&xa(e),de(e),oc(e,l,t,i,a)),null;case 27:if(Qr(e),a=pi.current,l=e.type,t!==null&&e.stateNode!=null)t.memoizedProps!==i&&xa(e);else{if(!i){if(e.stateNode===null)throw Error(S(166));return de(e),null}t=ia.current,El(e)?Hm(e,t):(t=h0(l,i,a),e.stateNode=t,xa(e))}return de(e),null;case 5:if(Qr(e),l=e.type,t!==null&&e.stateNode!=null)t.memoizedProps!==i&&xa(e);else{if(!i){if(e.stateNode===null)throw Error(S(166));return de(e),null}if(n=ia.current,El(e))Hm(e,n);else{var s=yo(pi.current);switch(n){case 1:n=s.createElementNS("http://www.w3.org/2000/svg",l);break;case 2:n=s.createElementNS("http://www.w3.org/1998/Math/MathML",l);break;default:switch(l){case"svg":n=s.createElementNS("http://www.w3.org/2000/svg",l);break;case"math":n=s.createElementNS("http://www.w3.org/1998/Math/MathML",l);break;case"script":n=s.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild);break;case"select":n=typeof i.is=="string"?s.createElement("select",{is:i.is}):s.createElement("select"),i.multiple?n.multiple=!0:i.size&&(n.size=i.size);break;default:n=typeof i.is=="string"?s.createElement(l,{is:i.is}):s.createElement(l)}}n[Be]=e,n[it]=i;e:for(s=e.child;s!==null;){if(s.tag===5||s.tag===6)n.appendChild(s.stateNode);else if(s.tag!==4&&s.tag!==27&&s.child!==null){s.child.return=s,s=s.child;continue}if(s===e)break e;for(;s.sibling===null;){if(s.return===null||s.return===e)break e;s=s.return}s.sibling.return=s.return,s=s.sibling}e.stateNode=n;e:switch(Xe(n,l,i),l){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}i&&xa(e)}}return de(e),oc(e,e.type,t===null?null:t.memoizedProps,e.pendingProps,a),null;case 6:if(t&&e.stateNode!=null)t.memoizedProps!==i&&xa(e);else{if(typeof i!="string"&&e.stateNode===null)throw Error(S(166));if(t=pi.current,El(e)){if(t=e.stateNode,a=e.memoizedProps,i=null,l=Fe,l!==null)switch(l.tag){case 27:case 5:i=l.memoizedProps}t[Be]=e,t=!!(t.nodeValue===a||i!==null&&i.suppressHydrationWarning===!0||u0(t.nodeValue,a)),t||Ci(e,!0)}else t=yo(t).createTextNode(i),t[Be]=e,e.stateNode=t}return de(e),null;case 31:if(a=e.memoizedState,t===null||t.memoizedState!==null){if(i=El(e),a!==null){if(t===null){if(!i)throw Error(S(318));if(t=e.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(S(557));t[Be]=e}else Ji(),(e.flags&128)===0&&(e.memoizedState=null),e.flags|=4;de(e),t=!1}else a=$u(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=a),t=!0;if(!t)return e.flags&256?(ct(e),e):(ct(e),null);if((e.flags&128)!==0)throw Error(S(558))}return de(e),null;case 13:if(i=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(l=El(e),i!==null&&i.dehydrated!==null){if(t===null){if(!l)throw Error(S(318));if(l=e.memoizedState,l=l!==null?l.dehydrated:null,!l)throw Error(S(317));l[Be]=e}else Ji(),(e.flags&128)===0&&(e.memoizedState=null),e.flags|=4;de(e),l=!1}else l=$u(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=l),l=!0;if(!l)return e.flags&256?(ct(e),e):(ct(e),null)}return ct(e),(e.flags&128)!==0?(e.lanes=a,e):(a=i!==null,t=t!==null&&t.memoizedState!==null,a&&(i=e.child,l=null,i.alternate!==null&&i.alternate.memoizedState!==null&&i.alternate.memoizedState.cachePool!==null&&(l=i.alternate.memoizedState.cachePool.pool),n=null,i.memoizedState!==null&&i.memoizedState.cachePool!==null&&(n=i.memoizedState.cachePool.pool),n!==l&&(i.flags|=2048)),a!==t&&a&&(e.child.flags|=8192),Gr(e,e.updateQueue),de(e),null);case 4:return Zl(),t===null&&lf(e.stateNode.containerInfo),de(e),null;case 10:return Pa(e.type),de(e),null;case 19:if(He(xe),i=e.memoizedState,i===null)return de(e),null;if(l=(e.flags&128)!==0,n=i.rendering,n===null)if(l)Yn(i,!1);else{if(be!==0||t!==null&&(t.flags&128)!==0)for(t=e.child;t!==null;){if(n=io(t),n!==null){for(e.flags|=128,Yn(i,!1),t=n.updateQueue,e.updateQueue=t,Gr(e,t),e.subtreeFlags=0,t=a,a=e.child;a!==null;)Gy(a,t),a=a.sibling;return ue(xe,xe.current&1|2),I&&Ca(e,i.treeForkCount),e.child}t=t.sibling}i.tail!==null&&ht()>uo&&(e.flags|=128,l=!0,Yn(i,!1),e.lanes=4194304)}else{if(!l)if(t=io(n),t!==null){if(e.flags|=128,l=!0,t=t.updateQueue,e.updateQueue=t,Gr(e,t),Yn(i,!0),i.tail===null&&i.tailMode==="hidden"&&!n.alternate&&!I)return de(e),null}else 2*ht()-i.renderingStartTime>uo&&a!==536870912&&(e.flags|=128,l=!0,Yn(i,!1),e.lanes=4194304);i.isBackwards?(n.sibling=e.child,e.child=n):(t=i.last,t!==null?t.sibling=n:e.child=n,i.last=n)}return i.tail!==null?(t=i.tail,i.rendering=t,i.tail=t.sibling,i.renderingStartTime=ht(),t.sibling=null,a=xe.current,ue(xe,l?a&1|2:a&1),I&&Ca(e,i.treeForkCount),t):(de(e),null);case 22:case 23:return ct(e),Od(),i=e.memoizedState!==null,t!==null?t.memoizedState!==null!==i&&(e.flags|=8192):i&&(e.flags|=8192),i?(a&536870912)!==0&&(e.flags&128)===0&&(de(e),e.subtreeFlags&6&&(e.flags|=8192)):de(e),a=e.updateQueue,a!==null&&Gr(e,a.retryQueue),a=null,t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(a=t.memoizedState.cachePool.pool),i=null,e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(i=e.memoizedState.cachePool.pool),i!==a&&(e.flags|=2048),t!==null&&He(Qi),null;case 24:return a=null,t!==null&&(a=t.memoizedState.cache),e.memoizedState.cache!==a&&(e.flags|=2048),Pa(Te),de(e),null;case 25:return null;case 30:return null}throw Error(S(156,e.tag))}function tS(t,e){switch(zd(e),e.tag){case 1:return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return Pa(Te),Zl(),t=e.flags,(t&65536)!==0&&(t&128)===0?(e.flags=t&-65537|128,e):null;case 26:case 27:case 5:return Qr(e),null;case 31:if(e.memoizedState!==null){if(ct(e),e.alternate===null)throw Error(S(340));Ji()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 13:if(ct(e),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(S(340));Ji()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return He(xe),null;case 4:return Zl(),null;case 10:return Pa(e.type),null;case 22:case 23:return ct(e),Od(),t!==null&&He(Qi),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 24:return Pa(Te),null;case 25:return null;default:return null}}function Gg(t,e){switch(zd(e),e.tag){case 3:Pa(Te),Zl();break;case 26:case 27:case 5:Qr(e);break;case 4:Zl();break;case 31:e.memoizedState!==null&&ct(e);break;case 13:ct(e);break;case 19:He(xe);break;case 10:Pa(e.type);break;case 22:case 23:ct(e),Od(),t!==null&&He(Qi);break;case 24:Pa(Te)}}function Ps(t,e){try{var a=e.updateQueue,i=a!==null?a.lastEffect:null;if(i!==null){var l=i.next;a=l;do{if((a.tag&t)===t){i=void 0;var n=a.create,s=a.inst;i=n(),s.destroy=i}a=a.next}while(a!==l)}}catch(r){ie(e,e.return,r)}}function Ti(t,e,a){try{var i=e.updateQueue,l=i!==null?i.lastEffect:null;if(l!==null){var n=l.next;i=n;do{if((i.tag&t)===t){var s=i.inst,r=s.destroy;if(r!==void 0){s.destroy=void 0,l=e;var o=a,u=r;try{u()}catch(d){ie(l,o,d)}}}i=i.next}while(i!==n)}}catch(d){ie(e,e.return,d)}}function Cg(t){var e=t.updateQueue;if(e!==null){var a=t.stateNode;try{Dy(e,a)}catch(i){ie(t,t.return,i)}}}function Tg(t,e,a){a.props=tl(t.type,t.memoizedProps),a.state=t.memoizedState;try{a.componentWillUnmount()}catch(i){ie(t,e,i)}}function ls(t,e){try{var a=t.ref;if(a!==null){switch(t.tag){case 26:case 27:case 5:var i=t.stateNode;break;case 30:i=t.stateNode;break;default:i=t.stateNode}typeof a=="function"?t.refCleanup=a(i):a.current=i}}catch(l){ie(t,e,l)}}function aa(t,e){var a=t.ref,i=t.refCleanup;if(a!==null)if(typeof i=="function")try{i()}catch(l){ie(t,e,l)}finally{t.refCleanup=null,t=t.alternate,t!=null&&(t.refCleanup=null)}else if(typeof a=="function")try{a(null)}catch(l){ie(t,e,l)}else a.current=null}function wg(t){var e=t.type,a=t.memoizedProps,i=t.stateNode;try{e:switch(e){case"button":case"input":case"select":case"textarea":a.autoFocus&&i.focus();break e;case"img":a.src?i.src=a.src:a.srcSet&&(i.srcset=a.srcSet)}}catch(l){ie(t,t.return,l)}}function uc(t,e,a){try{var i=t.stateNode;xS(i,t.type,a,e),i[it]=e}catch(l){ie(t,t.return,l)}}function Rg(t){return t.tag===5||t.tag===3||t.tag===26||t.tag===27&&Ai(t.type)||t.tag===4}function cc(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||Rg(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.tag===27&&Ai(t.type)||t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function Wc(t,e,a){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?(a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a).insertBefore(t,e):(e=a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a,e.appendChild(t),a=a._reactRootContainer,a!=null||e.onclick!==null||(e.onclick=Ra));else if(i!==4&&(i===27&&Ai(t.type)&&(a=t.stateNode,e=null),t=t.child,t!==null))for(Wc(t,e,a),t=t.sibling;t!==null;)Wc(t,e,a),t=t.sibling}function oo(t,e,a){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?a.insertBefore(t,e):a.appendChild(t);else if(i!==4&&(i===27&&Ai(t.type)&&(a=t.stateNode),t=t.child,t!==null))for(oo(t,e,a),t=t.sibling;t!==null;)oo(t,e,a),t=t.sibling}function Ag(t){var e=t.stateNode,a=t.memoizedProps;try{for(var i=t.type,l=e.attributes;l.length;)e.removeAttributeNode(l[0]);Xe(e,i,a),e[Be]=t,e[it]=a}catch(n){ie(t,t.return,n)}}var Ta=!1,Ce=!1,dc=!1,op=typeof WeakSet=="function"?WeakSet:Set,De=null;function aS(t,e){if(t=t.containerInfo,nd=Mo,t=yy(t),Cd(t)){if("selectionStart"in t)var a={start:t.selectionStart,end:t.selectionEnd};else e:{a=(a=t.ownerDocument)&&a.defaultView||window;var i=a.getSelection&&a.getSelection();if(i&&i.rangeCount!==0){a=i.anchorNode;var l=i.anchorOffset,n=i.focusNode;i=i.focusOffset;try{a.nodeType,n.nodeType}catch{a=null;break e}var s=0,r=-1,o=-1,u=0,d=0,p=t,f=null;t:for(;;){for(var y;p!==a||l!==0&&p.nodeType!==3||(r=s+l),p!==n||i!==0&&p.nodeType!==3||(o=s+i),p.nodeType===3&&(s+=p.nodeValue.length),(y=p.firstChild)!==null;)f=p,p=y;for(;;){if(p===t)break t;if(f===a&&++u===l&&(r=s),f===n&&++d===i&&(o=s),(y=p.nextSibling)!==null)break;p=f,f=p.parentNode}p=y}a=r===-1||o===-1?null:{start:r,end:o}}else a=null}a=a||{start:0,end:0}}else a=null;for(sd={focusedElem:t,selectionRange:a},Mo=!1,De=e;De!==null;)if(e=De,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,De=t;else for(;De!==null;){switch(e=De,n=e.alternate,t=e.flags,e.tag){case 0:if((t&4)!==0&&(t=e.updateQueue,t=t!==null?t.events:null,t!==null))for(a=0;a<t.length;a++)l=t[a],l.ref.impl=l.nextImpl;break;case 11:case 15:break;case 1:if((t&1024)!==0&&n!==null){t=void 0,a=e,l=n.memoizedProps,n=n.memoizedState,i=a.stateNode;try{var G=tl(a.type,l);t=i.getSnapshotBeforeUpdate(G,n),i.__reactInternalSnapshotBeforeUpdate=t}catch(C){ie(a,a.return,C)}}break;case 3:if((t&1024)!==0){if(t=e.stateNode.containerInfo,a=t.nodeType,a===9)od(t);else if(a===1)switch(t.nodeName){case"HEAD":case"HTML":case"BODY":od(t);break;default:t.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((t&1024)!==0)throw Error(S(163))}if(t=e.sibling,t!==null){t.return=e.return,De=t;break}De=e.return}}function zg(t,e,a){var i=a.flags;switch(a.tag){case 0:case 11:case 15:Ea(t,a),i&4&&Ps(5,a);break;case 1:if(Ea(t,a),i&4)if(t=a.stateNode,e===null)try{t.componentDidMount()}catch(s){ie(a,a.return,s)}else{var l=tl(a.type,e.memoizedProps);e=e.memoizedState;try{t.componentDidUpdate(l,e,t.__reactInternalSnapshotBeforeUpdate)}catch(s){ie(a,a.return,s)}}i&64&&Cg(a),i&512&&ls(a,a.return);break;case 3:if(Ea(t,a),i&64&&(t=a.updateQueue,t!==null)){if(e=null,a.child!==null)switch(a.child.tag){case 27:case 5:e=a.child.stateNode;break;case 1:e=a.child.stateNode}try{Dy(t,e)}catch(s){ie(a,a.return,s)}}break;case 27:e===null&&i&4&&Ag(a);case 26:case 5:Ea(t,a),e===null&&i&4&&wg(a),i&512&&ls(a,a.return);break;case 12:Ea(t,a);break;case 31:Ea(t,a),i&4&&Ng(t,a);break;case 13:Ea(t,a),i&4&&Dg(t,a),i&64&&(t=a.memoizedState,t!==null&&(t=t.dehydrated,t!==null&&(a=dS.bind(null,a),AS(t,a))));break;case 22:if(i=a.memoizedState!==null||Ta,!i){e=e!==null&&e.memoizedState!==null||Ce,l=Ta;var n=Ce;Ta=i,(Ce=e)&&!n?Ga(t,a,(a.subtreeFlags&8772)!==0):Ea(t,a),Ta=l,Ce=n}break;case 30:break;default:Ea(t,a)}}function Pg(t){var e=t.alternate;e!==null&&(t.alternate=null,Pg(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&bd(e)),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}var pe=null,et=!1;function Sa(t,e,a){for(a=a.child;a!==null;)_g(t,e,a),a=a.sibling}function _g(t,e,a){if(mt&&typeof mt.onCommitFiberUnmount=="function")try{mt.onCommitFiberUnmount(Gs,a)}catch{}switch(a.tag){case 26:Ce||aa(a,e),Sa(t,e,a),a.memoizedState?a.memoizedState.count--:a.stateNode&&(a=a.stateNode,a.parentNode.removeChild(a));break;case 27:Ce||aa(a,e);var i=pe,l=et;Ai(a.type)&&(pe=a.stateNode,et=!1),Sa(t,e,a),os(a.stateNode),pe=i,et=l;break;case 5:Ce||aa(a,e);case 6:if(i=pe,l=et,pe=null,Sa(t,e,a),pe=i,et=l,pe!==null)if(et)try{(pe.nodeType===9?pe.body:pe.nodeName==="HTML"?pe.ownerDocument.body:pe).removeChild(a.stateNode)}catch(n){ie(a,e,n)}else try{pe.removeChild(a.stateNode)}catch(n){ie(a,e,n)}break;case 18:pe!==null&&(et?(t=pe,Ep(t.nodeType===9?t.body:t.nodeName==="HTML"?t.ownerDocument.body:t,a.stateNode),an(t)):Ep(pe,a.stateNode));break;case 4:i=pe,l=et,pe=a.stateNode.containerInfo,et=!0,Sa(t,e,a),pe=i,et=l;break;case 0:case 11:case 14:case 15:Ti(2,a,e),Ce||Ti(4,a,e),Sa(t,e,a);break;case 1:Ce||(aa(a,e),i=a.stateNode,typeof i.componentWillUnmount=="function"&&Tg(a,e,i)),Sa(t,e,a);break;case 21:Sa(t,e,a);break;case 22:Ce=(i=Ce)||a.memoizedState!==null,Sa(t,e,a),Ce=i;break;default:Sa(t,e,a)}}function Ng(t,e){if(e.memoizedState===null&&(t=e.alternate,t!==null&&(t=t.memoizedState,t!==null))){t=t.dehydrated;try{an(t)}catch(a){ie(e,e.return,a)}}}function Dg(t,e){if(e.memoizedState===null&&(t=e.alternate,t!==null&&(t=t.memoizedState,t!==null&&(t=t.dehydrated,t!==null))))try{an(t)}catch(a){ie(e,e.return,a)}}function iS(t){switch(t.tag){case 31:case 13:case 19:var e=t.stateNode;return e===null&&(e=t.stateNode=new op),e;case 22:return t=t.stateNode,e=t._retryCache,e===null&&(e=t._retryCache=new op),e;default:throw Error(S(435,t.tag))}}function Cr(t,e){var a=iS(t);e.forEach(function(i){if(!a.has(i)){a.add(i);var l=fS.bind(null,t,i);i.then(l,l)}})}function We(t,e){var a=e.deletions;if(a!==null)for(var i=0;i<a.length;i++){var l=a[i],n=t,s=e,r=s;e:for(;r!==null;){switch(r.tag){case 27:if(Ai(r.type)){pe=r.stateNode,et=!1;break e}break;case 5:pe=r.stateNode,et=!1;break e;case 3:case 4:pe=r.stateNode.containerInfo,et=!0;break e}r=r.return}if(pe===null)throw Error(S(160));_g(n,s,l),pe=null,et=!1,n=l.alternate,n!==null&&(n.return=null),l.return=null}if(e.subtreeFlags&13886)for(e=e.child;e!==null;)Og(e,t),e=e.sibling}var qt=null;function Og(t,e){var a=t.alternate,i=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:We(e,t),$e(t),i&4&&(Ti(3,t,t.return),Ps(3,t),Ti(5,t,t.return));break;case 1:We(e,t),$e(t),i&512&&(Ce||a===null||aa(a,a.return)),i&64&&Ta&&(t=t.updateQueue,t!==null&&(i=t.callbacks,i!==null&&(a=t.shared.hiddenCallbacks,t.shared.hiddenCallbacks=a===null?i:a.concat(i))));break;case 26:var l=qt;if(We(e,t),$e(t),i&512&&(Ce||a===null||aa(a,a.return)),i&4){var n=a!==null?a.memoizedState:null;if(i=t.memoizedState,a===null)if(i===null)if(t.stateNode===null){e:{i=t.type,a=t.memoizedProps,l=l.ownerDocument||l;t:switch(i){case"title":n=l.getElementsByTagName("title")[0],(!n||n[ws]||n[Be]||n.namespaceURI==="http://www.w3.org/2000/svg"||n.hasAttribute("itemprop"))&&(n=l.createElement(i),l.head.insertBefore(n,l.querySelector("head > title"))),Xe(n,i,a),n[Be]=t,Oe(n),i=n;break e;case"link":var s=zp("link","href",l).get(i+(a.href||""));if(s){for(var r=0;r<s.length;r++)if(n=s[r],n.getAttribute("href")===(a.href==null||a.href===""?null:a.href)&&n.getAttribute("rel")===(a.rel==null?null:a.rel)&&n.getAttribute("title")===(a.title==null?null:a.title)&&n.getAttribute("crossorigin")===(a.crossOrigin==null?null:a.crossOrigin)){s.splice(r,1);break t}}n=l.createElement(i),Xe(n,i,a),l.head.appendChild(n);break;case"meta":if(s=zp("meta","content",l).get(i+(a.content||""))){for(r=0;r<s.length;r++)if(n=s[r],n.getAttribute("content")===(a.content==null?null:""+a.content)&&n.getAttribute("name")===(a.name==null?null:a.name)&&n.getAttribute("property")===(a.property==null?null:a.property)&&n.getAttribute("http-equiv")===(a.httpEquiv==null?null:a.httpEquiv)&&n.getAttribute("charset")===(a.charSet==null?null:a.charSet)){s.splice(r,1);break t}}n=l.createElement(i),Xe(n,i,a),l.head.appendChild(n);break;default:throw Error(S(468,i))}n[Be]=t,Oe(n),i=n}t.stateNode=i}else Pp(l,t.type,t.stateNode);else t.stateNode=Ap(l,i,t.memoizedProps);else n!==i?(n===null?a.stateNode!==null&&(a=a.stateNode,a.parentNode.removeChild(a)):n.count--,i===null?Pp(l,t.type,t.stateNode):Ap(l,i,t.memoizedProps)):i===null&&t.stateNode!==null&&uc(t,t.memoizedProps,a.memoizedProps)}break;case 27:We(e,t),$e(t),i&512&&(Ce||a===null||aa(a,a.return)),a!==null&&i&4&&uc(t,t.memoizedProps,a.memoizedProps);break;case 5:if(We(e,t),$e(t),i&512&&(Ce||a===null||aa(a,a.return)),t.flags&32){l=t.stateNode;try{Ql(l,"")}catch(G){ie(t,t.return,G)}}i&4&&t.stateNode!=null&&(l=t.memoizedProps,uc(t,l,a!==null?a.memoizedProps:l)),i&1024&&(dc=!0);break;case 6:if(We(e,t),$e(t),i&4){if(t.stateNode===null)throw Error(S(162));i=t.memoizedProps,a=t.stateNode;try{a.nodeValue=i}catch(G){ie(t,t.return,G)}}break;case 3:if(qr=null,l=qt,qt=go(e.containerInfo),We(e,t),qt=l,$e(t),i&4&&a!==null&&a.memoizedState.isDehydrated)try{an(e.containerInfo)}catch(G){ie(t,t.return,G)}dc&&(dc=!1,Hg(t));break;case 4:i=qt,qt=go(t.stateNode.containerInfo),We(e,t),$e(t),qt=i;break;case 12:We(e,t),$e(t);break;case 31:We(e,t),$e(t),i&4&&(i=t.updateQueue,i!==null&&(t.updateQueue=null,Cr(t,i)));break;case 13:We(e,t),$e(t),t.child.flags&8192&&t.memoizedState!==null!=(a!==null&&a.memoizedState!==null)&&(No=ht()),i&4&&(i=t.updateQueue,i!==null&&(t.updateQueue=null,Cr(t,i)));break;case 22:l=t.memoizedState!==null;var o=a!==null&&a.memoizedState!==null,u=Ta,d=Ce;if(Ta=u||l,Ce=d||o,We(e,t),Ce=d,Ta=u,$e(t),i&8192)e:for(e=t.stateNode,e._visibility=l?e._visibility&-2:e._visibility|1,l&&(a===null||o||Ta||Ce||Vi(t)),a=null,e=t;;){if(e.tag===5||e.tag===26){if(a===null){o=a=e;try{if(n=o.stateNode,l)s=n.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none";else{r=o.stateNode;var p=o.memoizedProps.style,f=p!=null&&p.hasOwnProperty("display")?p.display:null;r.style.display=f==null||typeof f=="boolean"?"":(""+f).trim()}}catch(G){ie(o,o.return,G)}}}else if(e.tag===6){if(a===null){o=e;try{o.stateNode.nodeValue=l?"":o.memoizedProps}catch(G){ie(o,o.return,G)}}}else if(e.tag===18){if(a===null){o=e;try{var y=o.stateNode;l?Gp(y,!0):Gp(o.stateNode,!1)}catch(G){ie(o,o.return,G)}}}else if((e.tag!==22&&e.tag!==23||e.memoizedState===null||e===t)&&e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;a===e&&(a=null),e=e.return}a===e&&(a=null),e.sibling.return=e.return,e=e.sibling}i&4&&(i=t.updateQueue,i!==null&&(a=i.retryQueue,a!==null&&(i.retryQueue=null,Cr(t,a))));break;case 19:We(e,t),$e(t),i&4&&(i=t.updateQueue,i!==null&&(t.updateQueue=null,Cr(t,i)));break;case 30:break;case 21:break;default:We(e,t),$e(t)}}function $e(t){var e=t.flags;if(e&2){try{for(var a,i=t.return;i!==null;){if(Rg(i)){a=i;break}i=i.return}if(a==null)throw Error(S(160));switch(a.tag){case 27:var l=a.stateNode,n=cc(t);oo(t,n,l);break;case 5:var s=a.stateNode;a.flags&32&&(Ql(s,""),a.flags&=-33);var r=cc(t);oo(t,r,s);break;case 3:case 4:var o=a.stateNode.containerInfo,u=cc(t);Wc(t,u,o);break;default:throw Error(S(161))}}catch(d){ie(t,t.return,d)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function Hg(t){if(t.subtreeFlags&1024)for(t=t.child;t!==null;){var e=t;Hg(e),e.tag===5&&e.flags&1024&&e.stateNode.reset(),t=t.sibling}}function Ea(t,e){if(e.subtreeFlags&8772)for(e=e.child;e!==null;)zg(t,e.alternate,e),e=e.sibling}function Vi(t){for(t=t.child;t!==null;){var e=t;switch(e.tag){case 0:case 11:case 14:case 15:Ti(4,e,e.return),Vi(e);break;case 1:aa(e,e.return);var a=e.stateNode;typeof a.componentWillUnmount=="function"&&Tg(e,e.return,a),Vi(e);break;case 27:os(e.stateNode);case 26:case 5:aa(e,e.return),Vi(e);break;case 22:e.memoizedState===null&&Vi(e);break;case 30:Vi(e);break;default:Vi(e)}t=t.sibling}}function Ga(t,e,a){for(a=a&&(e.subtreeFlags&8772)!==0,e=e.child;e!==null;){var i=e.alternate,l=t,n=e,s=n.flags;switch(n.tag){case 0:case 11:case 15:Ga(l,n,a),Ps(4,n);break;case 1:if(Ga(l,n,a),i=n,l=i.stateNode,typeof l.componentDidMount=="function")try{l.componentDidMount()}catch(u){ie(i,i.return,u)}if(i=n,l=i.updateQueue,l!==null){var r=i.stateNode;try{var o=l.shared.hiddenCallbacks;if(o!==null)for(l.shared.hiddenCallbacks=null,l=0;l<o.length;l++)Ny(o[l],r)}catch(u){ie(i,i.return,u)}}a&&s&64&&Cg(n),ls(n,n.return);break;case 27:Ag(n);case 26:case 5:Ga(l,n,a),a&&i===null&&s&4&&wg(n),ls(n,n.return);break;case 12:Ga(l,n,a);break;case 31:Ga(l,n,a),a&&s&4&&Ng(l,n);break;case 13:Ga(l,n,a),a&&s&4&&Dg(l,n);break;case 22:n.memoizedState===null&&Ga(l,n,a),ls(n,n.return);break;case 30:break;default:Ga(l,n,a)}e=e.sibling}}function Jd(t,e){var a=null;t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(a=t.memoizedState.cachePool.pool),t=null,e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(t=e.memoizedState.cachePool.pool),t!==a&&(t!=null&&t.refCount++,a!=null&&As(a))}function Wd(t,e){t=null,e.alternate!==null&&(t=e.alternate.memoizedState.cache),e=e.memoizedState.cache,e!==t&&(e.refCount++,t!=null&&As(t))}function Xt(t,e,a,i){if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Lg(t,e,a,i),e=e.sibling}function Lg(t,e,a,i){var l=e.flags;switch(e.tag){case 0:case 11:case 15:Xt(t,e,a,i),l&2048&&Ps(9,e);break;case 1:Xt(t,e,a,i);break;case 3:Xt(t,e,a,i),l&2048&&(t=null,e.alternate!==null&&(t=e.alternate.memoizedState.cache),e=e.memoizedState.cache,e!==t&&(e.refCount++,t!=null&&As(t)));break;case 12:if(l&2048){Xt(t,e,a,i),t=e.stateNode;try{var n=e.memoizedProps,s=n.id,r=n.onPostCommit;typeof r=="function"&&r(s,e.alternate===null?"mount":"update",t.passiveEffectDuration,-0)}catch(o){ie(e,e.return,o)}}else Xt(t,e,a,i);break;case 31:Xt(t,e,a,i);break;case 13:Xt(t,e,a,i);break;case 23:break;case 22:n=e.stateNode,s=e.alternate,e.memoizedState!==null?n._visibility&2?Xt(t,e,a,i):ns(t,e):n._visibility&2?Xt(t,e,a,i):(n._visibility|=2,Cl(t,e,a,i,(e.subtreeFlags&10256)!==0||!1)),l&2048&&Jd(s,e);break;case 24:Xt(t,e,a,i),l&2048&&Wd(e.alternate,e);break;default:Xt(t,e,a,i)}}function Cl(t,e,a,i,l){for(l=l&&((e.subtreeFlags&10256)!==0||!1),e=e.child;e!==null;){var n=t,s=e,r=a,o=i,u=s.flags;switch(s.tag){case 0:case 11:case 15:Cl(n,s,r,o,l),Ps(8,s);break;case 23:break;case 22:var d=s.stateNode;s.memoizedState!==null?d._visibility&2?Cl(n,s,r,o,l):ns(n,s):(d._visibility|=2,Cl(n,s,r,o,l)),l&&u&2048&&Jd(s.alternate,s);break;case 24:Cl(n,s,r,o,l),l&&u&2048&&Wd(s.alternate,s);break;default:Cl(n,s,r,o,l)}e=e.sibling}}function ns(t,e){if(e.subtreeFlags&10256)for(e=e.child;e!==null;){var a=t,i=e,l=i.flags;switch(i.tag){case 22:ns(a,i),l&2048&&Jd(i.alternate,i);break;case 24:ns(a,i),l&2048&&Wd(i.alternate,i);break;default:ns(a,i)}e=e.sibling}}var kn=8192;function Gl(t,e,a){if(t.subtreeFlags&kn)for(t=t.child;t!==null;)Ug(t,e,a),t=t.sibling}function Ug(t,e,a){switch(t.tag){case 26:Gl(t,e,a),t.flags&kn&&t.memoizedState!==null&&YS(a,qt,t.memoizedState,t.memoizedProps);break;case 5:Gl(t,e,a);break;case 3:case 4:var i=qt;qt=go(t.stateNode.containerInfo),Gl(t,e,a),qt=i;break;case 22:t.memoizedState===null&&(i=t.alternate,i!==null&&i.memoizedState!==null?(i=kn,kn=16777216,Gl(t,e,a),kn=i):Gl(t,e,a));break;default:Gl(t,e,a)}}function Bg(t){var e=t.alternate;if(e!==null&&(t=e.child,t!==null)){e.child=null;do e=t.sibling,t.sibling=null,t=e;while(t!==null)}}function Xn(t){var e=t.deletions;if((t.flags&16)!==0){if(e!==null)for(var a=0;a<e.length;a++){var i=e[a];De=i,Yg(i,t)}Bg(t)}if(t.subtreeFlags&10256)for(t=t.child;t!==null;)Fg(t),t=t.sibling}function Fg(t){switch(t.tag){case 0:case 11:case 15:Xn(t),t.flags&2048&&Ti(9,t,t.return);break;case 3:Xn(t);break;case 12:Xn(t);break;case 22:var e=t.stateNode;t.memoizedState!==null&&e._visibility&2&&(t.return===null||t.return.tag!==13)?(e._visibility&=-3,Yr(t)):Xn(t);break;default:Xn(t)}}function Yr(t){var e=t.deletions;if((t.flags&16)!==0){if(e!==null)for(var a=0;a<e.length;a++){var i=e[a];De=i,Yg(i,t)}Bg(t)}for(t=t.child;t!==null;){switch(e=t,e.tag){case 0:case 11:case 15:Ti(8,e,e.return),Yr(e);break;case 22:a=e.stateNode,a._visibility&2&&(a._visibility&=-3,Yr(e));break;default:Yr(e)}t=t.sibling}}function Yg(t,e){for(;De!==null;){var a=De;switch(a.tag){case 0:case 11:case 15:Ti(8,a,e);break;case 23:case 22:if(a.memoizedState!==null&&a.memoizedState.cachePool!==null){var i=a.memoizedState.cachePool.pool;i!=null&&i.refCount++}break;case 24:As(a.memoizedState.cache)}if(i=a.child,i!==null)i.return=a,De=i;else e:for(a=t;De!==null;){i=De;var l=i.sibling,n=i.return;if(Pg(i),i===a){De=null;break e}if(l!==null){l.return=n,De=l;break e}De=n}}}var lS={getCacheForType:function(t){var e=Ye(Te),a=e.data.get(t);return a===void 0&&(a=t(),e.data.set(t,a)),a},cacheSignal:function(){return Ye(Te).controller.signal}},nS=typeof WeakMap=="function"?WeakMap:Map,ee=0,re=null,X=null,q=0,ae=0,ut=null,fi=!1,on=!1,$d=!1,La=0,be=0,wi=0,Ki=0,ef=0,ft=0,Wl=0,ss=null,tt=null,$c=!1,No=0,Xg=0,uo=1/0,co=null,bi=null,Pe=0,Mi=null,$l=null,_a=0,ed=0,td=null,qg=null,rs=0,ad=null;function yt(){return(ee&2)!==0&&q!==0?q&-q:_.T!==null?af():Wp()}function jg(){if(ft===0)if((q&536870912)===0||I){var t=pr;pr<<=1,(pr&3932160)===0&&(pr=262144),ft=t}else ft=536870912;return t=vt.current,t!==null&&(t.flags|=32),ft}function at(t,e,a){(t===re&&(ae===2||ae===9)||t.cancelPendingCommit!==null)&&(en(t,0),hi(t,q,ft,!1)),Ts(t,a),((ee&2)===0||t!==re)&&(t===re&&((ee&2)===0&&(Ki|=a),be===4&&hi(t,q,ft,!1)),na(t))}function Vg(t,e,a){if((ee&6)!==0)throw Error(S(327));var i=!a&&(e&127)===0&&(e&t.expiredLanes)===0||Cs(t,e),l=i?oS(t,e):fc(t,e,!0),n=i;do{if(l===0){on&&!i&&hi(t,e,0,!1);break}else{if(a=t.current.alternate,n&&!sS(a)){l=fc(t,e,!1),n=!1;continue}if(l===2){if(n=e,t.errorRecoveryDisabledLanes&n)var s=0;else s=t.pendingLanes&-536870913,s=s!==0?s:s&536870912?536870912:0;if(s!==0){e=s;e:{var r=t;l=ss;var o=r.current.memoizedState.isDehydrated;if(o&&(en(r,s).flags|=256),s=fc(r,s,!1),s!==2){if($d&&!o){r.errorRecoveryDisabledLanes|=n,Ki|=n,l=4;break e}n=tt,tt=l,n!==null&&(tt===null?tt=n:tt.push.apply(tt,n))}l=s}if(n=!1,l!==2)continue}}if(l===1){en(t,0),hi(t,e,0,!0);break}e:{switch(i=t,n=l,n){case 0:case 1:throw Error(S(345));case 4:if((e&4194048)!==e)break;case 6:hi(i,e,ft,!fi);break e;case 2:tt=null;break;case 3:case 5:break;default:throw Error(S(329))}if((e&62914560)===e&&(l=No+300-ht(),10<l)){if(hi(i,e,ft,!fi),So(i,0,!0)!==0)break e;_a=e,i.timeoutHandle=d0(up.bind(null,i,a,tt,co,$c,e,ft,Ki,Wl,fi,n,"Throttled",-0,0),l);break e}up(i,a,tt,co,$c,e,ft,Ki,Wl,fi,n,null,-0,0)}}break}while(!0);na(t)}function up(t,e,a,i,l,n,s,r,o,u,d,p,f,y){if(t.timeoutHandle=-1,p=e.subtreeFlags,p&8192||(p&16785408)===16785408){p={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:Ra},Ug(e,n,p);var G=(n&62914560)===n?No-ht():(n&4194048)===n?Xg-ht():0;if(G=XS(p,G),G!==null){_a=n,t.cancelPendingCommit=G(dp.bind(null,t,e,n,a,i,l,s,r,o,d,p,null,f,y)),hi(t,n,s,!u);return}}dp(t,e,n,a,i,l,s,r,o)}function sS(t){for(var e=t;;){var a=e.tag;if((a===0||a===11||a===15)&&e.flags&16384&&(a=e.updateQueue,a!==null&&(a=a.stores,a!==null)))for(var i=0;i<a.length;i++){var l=a[i],n=l.getSnapshot;l=l.value;try{if(!gt(n(),l))return!1}catch{return!1}}if(a=e.child,e.subtreeFlags&16384&&a!==null)a.return=e,e=a;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function hi(t,e,a,i){e&=~ef,e&=~Ki,t.suspendedLanes|=e,t.pingedLanes&=~e,i&&(t.warmLanes|=e),i=t.expirationTimes;for(var l=e;0<l;){var n=31-pt(l),s=1<<n;i[n]=-1,l&=~s}a!==0&&kp(t,a,e)}function Do(){return(ee&6)===0?(_s(0,!1),!1):!0}function tf(){if(X!==null){if(ae===0)var t=X.return;else t=X,Aa=sl=null,Fd(t),ql=null,ps=0,t=X;for(;t!==null;)Gg(t.alternate,t),t=t.return;X=null}}function en(t,e){var a=t.timeoutHandle;a!==-1&&(t.timeoutHandle=-1,GS(a)),a=t.cancelPendingCommit,a!==null&&(t.cancelPendingCommit=null,a()),_a=0,tf(),re=t,X=a=za(t.current,null),q=e,ae=0,ut=null,fi=!1,on=Cs(t,e),$d=!1,Wl=ft=ef=Ki=wi=be=0,tt=ss=null,$c=!1,(e&8)!==0&&(e|=e&32);var i=t.entangledLanes;if(i!==0)for(t=t.entanglements,i&=e;0<i;){var l=31-pt(i),n=1<<l;e|=t[l],i&=~n}return La=e,To(),a}function Zg(t,e){U=null,_.H=gs,e===rn||e===Ro?(e=Ym(),ae=3):e===Nd?(e=Ym(),ae=4):ae=e===kd?8:e!==null&&typeof e=="object"&&typeof e.then=="function"?6:1,ut=e,X===null&&(be=1,so(t,Nt(e,t.current)))}function Ig(){var t=vt.current;return t===null?!0:(q&4194048)===q?Ot===null:(q&62914560)===q||(q&536870912)!==0?t===Ot:!1}function Qg(){var t=_.H;return _.H=gs,t===null?gs:t}function kg(){var t=_.A;return _.A=lS,t}function fo(){be=4,fi||(q&4194048)!==q&&vt.current!==null||(on=!0),(wi&134217727)===0&&(Ki&134217727)===0||re===null||hi(re,q,ft,!1)}function fc(t,e,a){var i=ee;ee|=2;var l=Qg(),n=kg();(re!==t||q!==e)&&(co=null,en(t,e)),e=!1;var s=be;e:do try{if(ae!==0&&X!==null){var r=X,o=ut;switch(ae){case 8:tf(),s=6;break e;case 3:case 2:case 9:case 6:vt.current===null&&(e=!0);var u=ae;if(ae=0,ut=null,Ul(t,r,o,u),a&&on){s=0;break e}break;default:u=ae,ae=0,ut=null,Ul(t,r,o,u)}}rS(),s=be;break}catch(d){Zg(t,d)}while(!0);return e&&t.shellSuspendCounter++,Aa=sl=null,ee=i,_.H=l,_.A=n,X===null&&(re=null,q=0,To()),s}function rS(){for(;X!==null;)Kg(X)}function oS(t,e){var a=ee;ee|=2;var i=Qg(),l=kg();re!==t||q!==e?(co=null,uo=ht()+500,en(t,e)):on=Cs(t,e);e:do try{if(ae!==0&&X!==null){e=X;var n=ut;t:switch(ae){case 1:ae=0,ut=null,Ul(t,e,n,1);break;case 2:case 9:if(Fm(n)){ae=0,ut=null,cp(e);break}e=function(){ae!==2&&ae!==9||re!==t||(ae=7),na(t)},n.then(e,e);break e;case 3:ae=7;break e;case 4:ae=5;break e;case 7:Fm(n)?(ae=0,ut=null,cp(e)):(ae=0,ut=null,Ul(t,e,n,7));break;case 5:var s=null;switch(X.tag){case 26:s=X.memoizedState;case 5:case 27:var r=X;if(s?y0(s):r.stateNode.complete){ae=0,ut=null;var o=r.sibling;if(o!==null)X=o;else{var u=r.return;u!==null?(X=u,Oo(u)):X=null}break t}}ae=0,ut=null,Ul(t,e,n,5);break;case 6:ae=0,ut=null,Ul(t,e,n,6);break;case 8:tf(),be=6;break e;default:throw Error(S(462))}}uS();break}catch(d){Zg(t,d)}while(!0);return Aa=sl=null,_.H=i,_.A=l,ee=a,X!==null?0:(re=null,q=0,To(),be)}function uS(){for(;X!==null&&!_M();)Kg(X)}function Kg(t){var e=Eg(t.alternate,t,La);t.memoizedProps=t.pendingProps,e===null?Oo(t):X=e}function cp(t){var e=t,a=e.alternate;switch(e.tag){case 15:case 0:e=ip(a,e,e.pendingProps,e.type,void 0,q);break;case 11:e=ip(a,e,e.pendingProps,e.type.render,e.ref,q);break;case 5:Fd(e);default:Gg(a,e),e=X=Gy(e,La),e=Eg(a,e,La)}t.memoizedProps=t.pendingProps,e===null?Oo(t):X=e}function Ul(t,e,a,i){Aa=sl=null,Fd(e),ql=null,ps=0;var l=e.return;try{if(Jx(t,l,e,a,q)){be=1,so(t,Nt(a,t.current)),X=null;return}}catch(n){if(l!==null)throw X=l,n;be=1,so(t,Nt(a,t.current)),X=null;return}e.flags&32768?(I||i===1?t=!0:on||(q&536870912)!==0?t=!1:(fi=t=!0,(i===2||i===9||i===3||i===6)&&(i=vt.current,i!==null&&i.tag===13&&(i.flags|=16384))),Jg(e,t)):Oo(e)}function Oo(t){var e=t;do{if((e.flags&32768)!==0){Jg(e,fi);return}t=e.return;var a=eS(e.alternate,e,La);if(a!==null){X=a;return}if(e=e.sibling,e!==null){X=e;return}X=e=t}while(e!==null);be===0&&(be=5)}function Jg(t,e){do{var a=tS(t.alternate,t);if(a!==null){a.flags&=32767,X=a;return}if(a=t.return,a!==null&&(a.flags|=32768,a.subtreeFlags=0,a.deletions=null),!e&&(t=t.sibling,t!==null)){X=t;return}X=t=a}while(t!==null);be=6,X=null}function dp(t,e,a,i,l,n,s,r,o){t.cancelPendingCommit=null;do Ho();while(Pe!==0);if((ee&6)!==0)throw Error(S(327));if(e!==null){if(e===t.current)throw Error(S(177));if(n=e.lanes|e.childLanes,n|=Td,XM(t,a,n,s,r,o),t===re&&(X=re=null,q=0),$l=e,Mi=t,_a=a,ed=n,td=l,qg=i,(e.subtreeFlags&10256)!==0||(e.flags&10256)!==0?(t.callbackNode=null,t.callbackPriority=0,hS(kr,function(){return a0(),null})):(t.callbackNode=null,t.callbackPriority=0),i=(e.flags&13878)!==0,(e.subtreeFlags&13878)!==0||i){i=_.T,_.T=null,l=te.p,te.p=2,s=ee,ee|=4;try{aS(t,e,a)}finally{ee=s,te.p=l,_.T=i}}Pe=1,Wg(),$g(),e0()}}function Wg(){if(Pe===1){Pe=0;var t=Mi,e=$l,a=(e.flags&13878)!==0;if((e.subtreeFlags&13878)!==0||a){a=_.T,_.T=null;var i=te.p;te.p=2;var l=ee;ee|=4;try{Og(e,t);var n=sd,s=yy(t.containerInfo),r=n.focusedElem,o=n.selectionRange;if(s!==r&&r&&r.ownerDocument&&py(r.ownerDocument.documentElement,r)){if(o!==null&&Cd(r)){var u=o.start,d=o.end;if(d===void 0&&(d=u),"selectionStart"in r)r.selectionStart=u,r.selectionEnd=Math.min(d,r.value.length);else{var p=r.ownerDocument||document,f=p&&p.defaultView||window;if(f.getSelection){var y=f.getSelection(),G=r.textContent.length,C=Math.min(o.start,G),D=o.end===void 0?C:Math.min(o.end,G);!y.extend&&C>D&&(s=D,D=C,C=s);var h=Nm(r,C),c=Nm(r,D);if(h&&c&&(y.rangeCount!==1||y.anchorNode!==h.node||y.anchorOffset!==h.offset||y.focusNode!==c.node||y.focusOffset!==c.offset)){var m=p.createRange();m.setStart(h.node,h.offset),y.removeAllRanges(),C>D?(y.addRange(m),y.extend(c.node,c.offset)):(m.setEnd(c.node,c.offset),y.addRange(m))}}}}for(p=[],y=r;y=y.parentNode;)y.nodeType===1&&p.push({element:y,left:y.scrollLeft,top:y.scrollTop});for(typeof r.focus=="function"&&r.focus(),r=0;r<p.length;r++){var v=p[r];v.element.scrollLeft=v.left,v.element.scrollTop=v.top}}Mo=!!nd,sd=nd=null}finally{ee=l,te.p=i,_.T=a}}t.current=e,Pe=2}}function $g(){if(Pe===2){Pe=0;var t=Mi,e=$l,a=(e.flags&8772)!==0;if((e.subtreeFlags&8772)!==0||a){a=_.T,_.T=null;var i=te.p;te.p=2;var l=ee;ee|=4;try{zg(t,e.alternate,e)}finally{ee=l,te.p=i,_.T=a}}Pe=3}}function e0(){if(Pe===4||Pe===3){Pe=0,NM();var t=Mi,e=$l,a=_a,i=qg;(e.subtreeFlags&10256)!==0||(e.flags&10256)!==0?Pe=5:(Pe=0,$l=Mi=null,t0(t,t.pendingLanes));var l=t.pendingLanes;if(l===0&&(bi=null),vd(a),e=e.stateNode,mt&&typeof mt.onCommitFiberRoot=="function")try{mt.onCommitFiberRoot(Gs,e,void 0,(e.current.flags&128)===128)}catch{}if(i!==null){e=_.T,l=te.p,te.p=2,_.T=null;try{for(var n=t.onRecoverableError,s=0;s<i.length;s++){var r=i[s];n(r.value,{componentStack:r.stack})}}finally{_.T=e,te.p=l}}(_a&3)!==0&&Ho(),na(t),l=t.pendingLanes,(a&261930)!==0&&(l&42)!==0?t===ad?rs++:(rs=0,ad=t):rs=0,_s(0,!1)}}function t0(t,e){(t.pooledCacheLanes&=e)===0&&(e=t.pooledCache,e!=null&&(t.pooledCache=null,As(e)))}function Ho(){return Wg(),$g(),e0(),a0()}function a0(){if(Pe!==5)return!1;var t=Mi,e=ed;ed=0;var a=vd(_a),i=_.T,l=te.p;try{te.p=32>a?32:a,_.T=null,a=td,td=null;var n=Mi,s=_a;if(Pe=0,$l=Mi=null,_a=0,(ee&6)!==0)throw Error(S(331));var r=ee;if(ee|=4,Fg(n.current),Lg(n,n.current,s,a),ee=r,_s(0,!1),mt&&typeof mt.onPostCommitFiberRoot=="function")try{mt.onPostCommitFiberRoot(Gs,n)}catch{}return!0}finally{te.p=l,_.T=i,t0(t,e)}}function fp(t,e,a){e=Nt(a,e),e=kc(t.stateNode,e,2),t=vi(t,e,2),t!==null&&(Ts(t,2),na(t))}function ie(t,e,a){if(t.tag===3)fp(t,t,a);else for(;e!==null;){if(e.tag===3){fp(e,t,a);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(bi===null||!bi.has(i))){t=Nt(a,t),a=gg(2),i=vi(e,a,2),i!==null&&(vg(a,i,e,t),Ts(i,2),na(i));break}}e=e.return}}function hc(t,e,a){var i=t.pingCache;if(i===null){i=t.pingCache=new nS;var l=new Set;i.set(e,l)}else l=i.get(e),l===void 0&&(l=new Set,i.set(e,l));l.has(a)||($d=!0,l.add(a),t=cS.bind(null,t,e,a),e.then(t,t))}function cS(t,e,a){var i=t.pingCache;i!==null&&i.delete(e),t.pingedLanes|=t.suspendedLanes&a,t.warmLanes&=~a,re===t&&(q&a)===a&&(be===4||be===3&&(q&62914560)===q&&300>ht()-No?(ee&2)===0&&en(t,0):ef|=a,Wl===q&&(Wl=0)),na(t)}function i0(t,e){e===0&&(e=Qp()),t=nl(t,e),t!==null&&(Ts(t,e),na(t))}function dS(t){var e=t.memoizedState,a=0;e!==null&&(a=e.retryLane),i0(t,a)}function fS(t,e){var a=0;switch(t.tag){case 31:case 13:var i=t.stateNode,l=t.memoizedState;l!==null&&(a=l.retryLane);break;case 19:i=t.stateNode;break;case 22:i=t.stateNode._retryCache;break;default:throw Error(S(314))}i!==null&&i.delete(e),i0(t,a)}function hS(t,e){return yd(t,e)}var ho=null,Tl=null,id=!1,mo=!1,mc=!1,mi=0;function na(t){t!==Tl&&t.next===null&&(Tl===null?ho=Tl=t:Tl=Tl.next=t),mo=!0,id||(id=!0,pS())}function _s(t,e){if(!mc&&mo){mc=!0;do for(var a=!1,i=ho;i!==null;){if(!e)if(t!==0){var l=i.pendingLanes;if(l===0)var n=0;else{var s=i.suspendedLanes,r=i.pingedLanes;n=(1<<31-pt(42|t)+1)-1,n&=l&~(s&~r),n=n&201326741?n&201326741|1:n?n|2:0}n!==0&&(a=!0,hp(i,n))}else n=q,n=So(i,i===re?n:0,i.cancelPendingCommit!==null||i.timeoutHandle!==-1),(n&3)===0||Cs(i,n)||(a=!0,hp(i,n));i=i.next}while(a);mc=!1}}function mS(){l0()}function l0(){mo=id=!1;var t=0;mi!==0&&ES()&&(t=mi);for(var e=ht(),a=null,i=ho;i!==null;){var l=i.next,n=n0(i,e);n===0?(i.next=null,a===null?ho=l:a.next=l,l===null&&(Tl=a)):(a=i,(t!==0||(n&3)!==0)&&(mo=!0)),i=l}Pe!==0&&Pe!==5||_s(t,!1),mi!==0&&(mi=0)}function n0(t,e){for(var a=t.suspendedLanes,i=t.pingedLanes,l=t.expirationTimes,n=t.pendingLanes&-62914561;0<n;){var s=31-pt(n),r=1<<s,o=l[s];o===-1?((r&a)===0||(r&i)!==0)&&(l[s]=YM(r,e)):o<=e&&(t.expiredLanes|=r),n&=~r}if(e=re,a=q,a=So(t,t===e?a:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),i=t.callbackNode,a===0||t===e&&(ae===2||ae===9)||t.cancelPendingCommit!==null)return i!==null&&i!==null&&qu(i),t.callbackNode=null,t.callbackPriority=0;if((a&3)===0||Cs(t,a)){if(e=a&-a,e===t.callbackPriority)return e;switch(i!==null&&qu(i),vd(a)){case 2:case 8:a=Zp;break;case 32:a=kr;break;case 268435456:a=Ip;break;default:a=kr}return i=s0.bind(null,t),a=yd(a,i),t.callbackPriority=e,t.callbackNode=a,e}return i!==null&&i!==null&&qu(i),t.callbackPriority=2,t.callbackNode=null,2}function s0(t,e){if(Pe!==0&&Pe!==5)return t.callbackNode=null,t.callbackPriority=0,null;var a=t.callbackNode;if(Ho()&&t.callbackNode!==a)return null;var i=q;return i=So(t,t===re?i:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),i===0?null:(Vg(t,i,e),n0(t,ht()),t.callbackNode!=null&&t.callbackNode===a?s0.bind(null,t):null)}function hp(t,e){if(Ho())return null;Vg(t,e,!0)}function pS(){CS(function(){(ee&6)!==0?yd(Vp,mS):l0()})}function af(){if(mi===0){var t=kl;t===0&&(t=mr,mr<<=1,(mr&261888)===0&&(mr=256)),mi=t}return mi}function mp(t){return t==null||typeof t=="symbol"||typeof t=="boolean"?null:typeof t=="function"?t:_r(""+t)}function pp(t,e){var a=e.ownerDocument.createElement("input");return a.name=e.name,a.value=e.value,t.id&&a.setAttribute("form",t.id),e.parentNode.insertBefore(a,e),t=new FormData(t),a.parentNode.removeChild(a),t}function yS(t,e,a,i,l){if(e==="submit"&&a&&a.stateNode===l){var n=mp((l[it]||null).action),s=i.submitter;s&&(e=(e=s[it]||null)?mp(e.formAction):s.getAttribute("formAction"),e!==null&&(n=e,s=null));var r=new Eo("action","action",null,i,l);t.push({event:r,listeners:[{instance:null,listener:function(){if(i.defaultPrevented){if(mi!==0){var o=s?pp(l,s):new FormData(l);Ic(a,{pending:!0,data:o,method:l.method,action:n},null,o)}}else typeof n=="function"&&(r.preventDefault(),o=s?pp(l,s):new FormData(l),Ic(a,{pending:!0,data:o,method:l.method,action:n},n,o))},currentTarget:l}]})}}for(Tr=0;Tr<Oc.length;Tr++)wr=Oc[Tr],yp=wr.toLowerCase(),gp=wr[0].toUpperCase()+wr.slice(1),jt(yp,"on"+gp);var wr,yp,gp,Tr;jt(vy,"onAnimationEnd");jt(by,"onAnimationIteration");jt(My,"onAnimationStart");jt("dblclick","onDoubleClick");jt("focusin","onFocus");jt("focusout","onBlur");jt(Dx,"onTransitionRun");jt(Ox,"onTransitionStart");jt(Hx,"onTransitionCancel");jt(xy,"onTransitionEnd");Il("onMouseEnter",["mouseout","mouseover"]);Il("onMouseLeave",["mouseout","mouseover"]);Il("onPointerEnter",["pointerout","pointerover"]);Il("onPointerLeave",["pointerout","pointerover"]);al("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));al("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));al("onBeforeInput",["compositionend","keypress","textInput","paste"]);al("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));al("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));al("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var vs="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),gS=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(vs));function r0(t,e){e=(e&4)!==0;for(var a=0;a<t.length;a++){var i=t[a],l=i.event;i=i.listeners;e:{var n=void 0;if(e)for(var s=i.length-1;0<=s;s--){var r=i[s],o=r.instance,u=r.currentTarget;if(r=r.listener,o!==n&&l.isPropagationStopped())break e;n=r,l.currentTarget=u;try{n(l)}catch(d){Jr(d)}l.currentTarget=null,n=o}else for(s=0;s<i.length;s++){if(r=i[s],o=r.instance,u=r.currentTarget,r=r.listener,o!==n&&l.isPropagationStopped())break e;n=r,l.currentTarget=u;try{n(l)}catch(d){Jr(d)}l.currentTarget=null,n=o}}}}function Y(t,e){var a=e[wc];a===void 0&&(a=e[wc]=new Set);var i=t+"__bubble";a.has(i)||(o0(e,t,2,!1),a.add(i))}function pc(t,e,a){var i=0;e&&(i|=4),o0(a,t,i,e)}var Rr="_reactListening"+Math.random().toString(36).slice(2);function lf(t){if(!t[Rr]){t[Rr]=!0,$p.forEach(function(a){a!=="selectionchange"&&(gS.has(a)||pc(a,!1,t),pc(a,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[Rr]||(e[Rr]=!0,pc("selectionchange",!1,e))}}function o0(t,e,a,i){switch(x0(e)){case 2:var l=VS;break;case 8:l=ZS;break;default:l=of}a=l.bind(null,e,a,t),l=void 0,!_c||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(l=!0),i?l!==void 0?t.addEventListener(e,a,{capture:!0,passive:l}):t.addEventListener(e,a,!0):l!==void 0?t.addEventListener(e,a,{passive:l}):t.addEventListener(e,a,!1)}function yc(t,e,a,i,l){var n=i;if((e&1)===0&&(e&2)===0&&i!==null)e:for(;;){if(i===null)return;var s=i.tag;if(s===3||s===4){var r=i.stateNode.containerInfo;if(r===l)break;if(s===4)for(s=i.return;s!==null;){var o=s.tag;if((o===3||o===4)&&s.stateNode.containerInfo===l)return;s=s.return}for(;r!==null;){if(s=Al(r),s===null)return;if(o=s.tag,o===5||o===6||o===26||o===27){i=n=s;continue e}r=r.parentNode}}i=i.return}ry(function(){var u=n,d=xd(a),p=[];e:{var f=Sy.get(t);if(f!==void 0){var y=Eo,G=t;switch(t){case"keypress":if(Dr(a)===0)break e;case"keydown":case"keyup":y=fx;break;case"focusin":G="focus",y=Qu;break;case"focusout":G="blur",y=Qu;break;case"beforeblur":case"afterblur":y=Qu;break;case"click":if(a.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":y=Gm;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":y=ex;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":y=px;break;case vy:case by:case My:y=ix;break;case xy:y=gx;break;case"scroll":case"scrollend":y=WM;break;case"wheel":y=bx;break;case"copy":case"cut":case"paste":y=nx;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":y=Tm;break;case"toggle":case"beforetoggle":y=xx}var C=(e&4)!==0,D=!C&&(t==="scroll"||t==="scrollend"),h=C?f!==null?f+"Capture":null:f;C=[];for(var c=u,m;c!==null;){var v=c;if(m=v.stateNode,v=v.tag,v!==5&&v!==26&&v!==27||m===null||h===null||(v=cs(c,h),v!=null&&C.push(bs(c,v,m))),D)break;c=c.return}0<C.length&&(f=new y(f,G,null,a,d),p.push({event:f,listeners:C}))}}if((e&7)===0){e:{if(f=t==="mouseover"||t==="pointerover",y=t==="mouseout"||t==="pointerout",f&&a!==Pc&&(G=a.relatedTarget||a.fromElement)&&(Al(G)||G[ln]))break e;if((y||f)&&(f=d.window===d?d:(f=d.ownerDocument)?f.defaultView||f.parentWindow:window,y?(G=a.relatedTarget||a.toElement,y=u,G=G?Al(G):null,G!==null&&(D=Es(G),C=G.tag,G!==D||C!==5&&C!==27&&C!==6)&&(G=null)):(y=null,G=u),y!==G)){if(C=Gm,v="onMouseLeave",h="onMouseEnter",c="mouse",(t==="pointerout"||t==="pointerover")&&(C=Tm,v="onPointerLeave",h="onPointerEnter",c="pointer"),D=y==null?f:In(y),m=G==null?f:In(G),f=new C(v,c+"leave",y,a,d),f.target=D,f.relatedTarget=m,v=null,Al(d)===u&&(C=new C(h,c+"enter",G,a,d),C.target=m,C.relatedTarget=D,v=C),D=v,y&&G)t:{for(C=vS,h=y,c=G,m=0,v=h;v;v=C(v))m++;v=0;for(var w=c;w;w=C(w))v++;for(;0<m-v;)h=C(h),m--;for(;0<v-m;)c=C(c),v--;for(;m--;){if(h===c||c!==null&&h===c.alternate){C=h;break t}h=C(h),c=C(c)}C=null}else C=null;y!==null&&vp(p,f,y,C,!1),G!==null&&D!==null&&vp(p,D,G,C,!0)}}e:{if(f=u?In(u):window,y=f.nodeName&&f.nodeName.toLowerCase(),y==="select"||y==="input"&&f.type==="file")var L=zm;else if(Am(f))if(hy)L=Px;else{L=Ax;var T=Rx}else y=f.nodeName,!y||y.toLowerCase()!=="input"||f.type!=="checkbox"&&f.type!=="radio"?u&&Md(u.elementType)&&(L=zm):L=zx;if(L&&(L=L(t,u))){fy(p,L,a,d);break e}T&&T(t,f,u),t==="focusout"&&u&&f.type==="number"&&u.memoizedProps.value!=null&&zc(f,"number",f.value)}switch(T=u?In(u):window,t){case"focusin":(Am(T)||T.contentEditable==="true")&&(_l=T,Nc=u,Wn=null);break;case"focusout":Wn=Nc=_l=null;break;case"mousedown":Dc=!0;break;case"contextmenu":case"mouseup":case"dragend":Dc=!1,Dm(p,a,d);break;case"selectionchange":if(Nx)break;case"keydown":case"keyup":Dm(p,a,d)}var N;if(Gd)e:{switch(t){case"compositionstart":var E="onCompositionStart";break e;case"compositionend":E="onCompositionEnd";break e;case"compositionupdate":E="onCompositionUpdate";break e}E=void 0}else Pl?cy(t,a)&&(E="onCompositionEnd"):t==="keydown"&&a.keyCode===229&&(E="onCompositionStart");E&&(uy&&a.locale!=="ko"&&(Pl||E!=="onCompositionStart"?E==="onCompositionEnd"&&Pl&&(N=oy()):(di=d,Sd="value"in di?di.value:di.textContent,Pl=!0)),T=po(u,E),0<T.length&&(E=new Cm(E,t,null,a,d),p.push({event:E,listeners:T}),N?E.data=N:(N=dy(a),N!==null&&(E.data=N)))),(N=Ex?Gx(t,a):Cx(t,a))&&(E=po(u,"onBeforeInput"),0<E.length&&(T=new Cm("onBeforeInput","beforeinput",null,a,d),p.push({event:T,listeners:E}),T.data=N)),yS(p,t,u,a,d)}r0(p,e)})}function bs(t,e,a){return{instance:t,listener:e,currentTarget:a}}function po(t,e){for(var a=e+"Capture",i=[];t!==null;){var l=t,n=l.stateNode;if(l=l.tag,l!==5&&l!==26&&l!==27||n===null||(l=cs(t,a),l!=null&&i.unshift(bs(t,l,n)),l=cs(t,e),l!=null&&i.push(bs(t,l,n))),t.tag===3)return i;t=t.return}return[]}function vS(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5&&t.tag!==27);return t||null}function vp(t,e,a,i,l){for(var n=e._reactName,s=[];a!==null&&a!==i;){var r=a,o=r.alternate,u=r.stateNode;if(r=r.tag,o!==null&&o===i)break;r!==5&&r!==26&&r!==27||u===null||(o=u,l?(u=cs(a,n),u!=null&&s.unshift(bs(a,u,o))):l||(u=cs(a,n),u!=null&&s.push(bs(a,u,o)))),a=a.return}s.length!==0&&t.push({event:e,listeners:s})}var bS=/\r\n?/g,MS=/\u0000|\uFFFD/g;function bp(t){return(typeof t=="string"?t:""+t).replace(bS,`
`).replace(MS,"")}function u0(t,e){return e=bp(e),bp(t)===e}function le(t,e,a,i,l,n){switch(a){case"children":typeof i=="string"?e==="body"||e==="textarea"&&i===""||Ql(t,i):(typeof i=="number"||typeof i=="bigint")&&e!=="body"&&Ql(t,""+i);break;case"className":gr(t,"class",i);break;case"tabIndex":gr(t,"tabindex",i);break;case"dir":case"role":case"viewBox":case"width":case"height":gr(t,a,i);break;case"style":sy(t,i,n);break;case"data":if(e!=="object"){gr(t,"data",i);break}case"src":case"href":if(i===""&&(e!=="a"||a!=="href")){t.removeAttribute(a);break}if(i==null||typeof i=="function"||typeof i=="symbol"||typeof i=="boolean"){t.removeAttribute(a);break}i=_r(""+i),t.setAttribute(a,i);break;case"action":case"formAction":if(typeof i=="function"){t.setAttribute(a,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof n=="function"&&(a==="formAction"?(e!=="input"&&le(t,e,"name",l.name,l,null),le(t,e,"formEncType",l.formEncType,l,null),le(t,e,"formMethod",l.formMethod,l,null),le(t,e,"formTarget",l.formTarget,l,null)):(le(t,e,"encType",l.encType,l,null),le(t,e,"method",l.method,l,null),le(t,e,"target",l.target,l,null)));if(i==null||typeof i=="symbol"||typeof i=="boolean"){t.removeAttribute(a);break}i=_r(""+i),t.setAttribute(a,i);break;case"onClick":i!=null&&(t.onclick=Ra);break;case"onScroll":i!=null&&Y("scroll",t);break;case"onScrollEnd":i!=null&&Y("scrollend",t);break;case"dangerouslySetInnerHTML":if(i!=null){if(typeof i!="object"||!("__html"in i))throw Error(S(61));if(a=i.__html,a!=null){if(l.children!=null)throw Error(S(60));t.innerHTML=a}}break;case"multiple":t.multiple=i&&typeof i!="function"&&typeof i!="symbol";break;case"muted":t.muted=i&&typeof i!="function"&&typeof i!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(i==null||typeof i=="function"||typeof i=="boolean"||typeof i=="symbol"){t.removeAttribute("xlink:href");break}a=_r(""+i),t.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",a);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":i!=null&&typeof i!="function"&&typeof i!="symbol"?t.setAttribute(a,""+i):t.removeAttribute(a);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":i&&typeof i!="function"&&typeof i!="symbol"?t.setAttribute(a,""):t.removeAttribute(a);break;case"capture":case"download":i===!0?t.setAttribute(a,""):i!==!1&&i!=null&&typeof i!="function"&&typeof i!="symbol"?t.setAttribute(a,i):t.removeAttribute(a);break;case"cols":case"rows":case"size":case"span":i!=null&&typeof i!="function"&&typeof i!="symbol"&&!isNaN(i)&&1<=i?t.setAttribute(a,i):t.removeAttribute(a);break;case"rowSpan":case"start":i==null||typeof i=="function"||typeof i=="symbol"||isNaN(i)?t.removeAttribute(a):t.setAttribute(a,i);break;case"popover":Y("beforetoggle",t),Y("toggle",t),Pr(t,"popover",i);break;case"xlinkActuate":Ma(t,"http://www.w3.org/1999/xlink","xlink:actuate",i);break;case"xlinkArcrole":Ma(t,"http://www.w3.org/1999/xlink","xlink:arcrole",i);break;case"xlinkRole":Ma(t,"http://www.w3.org/1999/xlink","xlink:role",i);break;case"xlinkShow":Ma(t,"http://www.w3.org/1999/xlink","xlink:show",i);break;case"xlinkTitle":Ma(t,"http://www.w3.org/1999/xlink","xlink:title",i);break;case"xlinkType":Ma(t,"http://www.w3.org/1999/xlink","xlink:type",i);break;case"xmlBase":Ma(t,"http://www.w3.org/XML/1998/namespace","xml:base",i);break;case"xmlLang":Ma(t,"http://www.w3.org/XML/1998/namespace","xml:lang",i);break;case"xmlSpace":Ma(t,"http://www.w3.org/XML/1998/namespace","xml:space",i);break;case"is":Pr(t,"is",i);break;case"innerText":case"textContent":break;default:(!(2<a.length)||a[0]!=="o"&&a[0]!=="O"||a[1]!=="n"&&a[1]!=="N")&&(a=KM.get(a)||a,Pr(t,a,i))}}function ld(t,e,a,i,l,n){switch(a){case"style":sy(t,i,n);break;case"dangerouslySetInnerHTML":if(i!=null){if(typeof i!="object"||!("__html"in i))throw Error(S(61));if(a=i.__html,a!=null){if(l.children!=null)throw Error(S(60));t.innerHTML=a}}break;case"children":typeof i=="string"?Ql(t,i):(typeof i=="number"||typeof i=="bigint")&&Ql(t,""+i);break;case"onScroll":i!=null&&Y("scroll",t);break;case"onScrollEnd":i!=null&&Y("scrollend",t);break;case"onClick":i!=null&&(t.onclick=Ra);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!ey.hasOwnProperty(a))e:{if(a[0]==="o"&&a[1]==="n"&&(l=a.endsWith("Capture"),e=a.slice(2,l?a.length-7:void 0),n=t[it]||null,n=n!=null?n[a]:null,typeof n=="function"&&t.removeEventListener(e,n,l),typeof i=="function")){typeof n!="function"&&n!==null&&(a in t?t[a]=null:t.hasAttribute(a)&&t.removeAttribute(a)),t.addEventListener(e,i,l);break e}a in t?t[a]=i:i===!0?t.setAttribute(a,""):Pr(t,a,i)}}}function Xe(t,e,a){switch(e){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":Y("error",t),Y("load",t);var i=!1,l=!1,n;for(n in a)if(a.hasOwnProperty(n)){var s=a[n];if(s!=null)switch(n){case"src":i=!0;break;case"srcSet":l=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(S(137,e));default:le(t,e,n,s,a,null)}}l&&le(t,e,"srcSet",a.srcSet,a,null),i&&le(t,e,"src",a.src,a,null);return;case"input":Y("invalid",t);var r=n=s=l=null,o=null,u=null;for(i in a)if(a.hasOwnProperty(i)){var d=a[i];if(d!=null)switch(i){case"name":l=d;break;case"type":s=d;break;case"checked":o=d;break;case"defaultChecked":u=d;break;case"value":n=d;break;case"defaultValue":r=d;break;case"children":case"dangerouslySetInnerHTML":if(d!=null)throw Error(S(137,e));break;default:le(t,e,i,d,a,null)}}iy(t,n,r,o,u,s,l,!1);return;case"select":Y("invalid",t),i=s=n=null;for(l in a)if(a.hasOwnProperty(l)&&(r=a[l],r!=null))switch(l){case"value":n=r;break;case"defaultValue":s=r;break;case"multiple":i=r;default:le(t,e,l,r,a,null)}e=n,a=s,t.multiple=!!i,e!=null?Fl(t,!!i,e,!1):a!=null&&Fl(t,!!i,a,!0);return;case"textarea":Y("invalid",t),n=l=i=null;for(s in a)if(a.hasOwnProperty(s)&&(r=a[s],r!=null))switch(s){case"value":i=r;break;case"defaultValue":l=r;break;case"children":n=r;break;case"dangerouslySetInnerHTML":if(r!=null)throw Error(S(91));break;default:le(t,e,s,r,a,null)}ny(t,i,l,n);return;case"option":for(o in a)a.hasOwnProperty(o)&&(i=a[o],i!=null)&&(o==="selected"?t.selected=i&&typeof i!="function"&&typeof i!="symbol":le(t,e,o,i,a,null));return;case"dialog":Y("beforetoggle",t),Y("toggle",t),Y("cancel",t),Y("close",t);break;case"iframe":case"object":Y("load",t);break;case"video":case"audio":for(i=0;i<vs.length;i++)Y(vs[i],t);break;case"image":Y("error",t),Y("load",t);break;case"details":Y("toggle",t);break;case"embed":case"source":case"link":Y("error",t),Y("load",t);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(u in a)if(a.hasOwnProperty(u)&&(i=a[u],i!=null))switch(u){case"children":case"dangerouslySetInnerHTML":throw Error(S(137,e));default:le(t,e,u,i,a,null)}return;default:if(Md(e)){for(d in a)a.hasOwnProperty(d)&&(i=a[d],i!==void 0&&ld(t,e,d,i,a,void 0));return}}for(r in a)a.hasOwnProperty(r)&&(i=a[r],i!=null&&le(t,e,r,i,a,null))}function xS(t,e,a,i){switch(e){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var l=null,n=null,s=null,r=null,o=null,u=null,d=null;for(y in a){var p=a[y];if(a.hasOwnProperty(y)&&p!=null)switch(y){case"checked":break;case"value":break;case"defaultValue":o=p;default:i.hasOwnProperty(y)||le(t,e,y,null,i,p)}}for(var f in i){var y=i[f];if(p=a[f],i.hasOwnProperty(f)&&(y!=null||p!=null))switch(f){case"type":n=y;break;case"name":l=y;break;case"checked":u=y;break;case"defaultChecked":d=y;break;case"value":s=y;break;case"defaultValue":r=y;break;case"children":case"dangerouslySetInnerHTML":if(y!=null)throw Error(S(137,e));break;default:y!==p&&le(t,e,f,y,i,p)}}Ac(t,s,r,o,u,d,n,l);return;case"select":y=s=r=f=null;for(n in a)if(o=a[n],a.hasOwnProperty(n)&&o!=null)switch(n){case"value":break;case"multiple":y=o;default:i.hasOwnProperty(n)||le(t,e,n,null,i,o)}for(l in i)if(n=i[l],o=a[l],i.hasOwnProperty(l)&&(n!=null||o!=null))switch(l){case"value":f=n;break;case"defaultValue":r=n;break;case"multiple":s=n;default:n!==o&&le(t,e,l,n,i,o)}e=r,a=s,i=y,f!=null?Fl(t,!!a,f,!1):!!i!=!!a&&(e!=null?Fl(t,!!a,e,!0):Fl(t,!!a,a?[]:"",!1));return;case"textarea":y=f=null;for(r in a)if(l=a[r],a.hasOwnProperty(r)&&l!=null&&!i.hasOwnProperty(r))switch(r){case"value":break;case"children":break;default:le(t,e,r,null,i,l)}for(s in i)if(l=i[s],n=a[s],i.hasOwnProperty(s)&&(l!=null||n!=null))switch(s){case"value":f=l;break;case"defaultValue":y=l;break;case"children":break;case"dangerouslySetInnerHTML":if(l!=null)throw Error(S(91));break;default:l!==n&&le(t,e,s,l,i,n)}ly(t,f,y);return;case"option":for(var G in a)f=a[G],a.hasOwnProperty(G)&&f!=null&&!i.hasOwnProperty(G)&&(G==="selected"?t.selected=!1:le(t,e,G,null,i,f));for(o in i)f=i[o],y=a[o],i.hasOwnProperty(o)&&f!==y&&(f!=null||y!=null)&&(o==="selected"?t.selected=f&&typeof f!="function"&&typeof f!="symbol":le(t,e,o,f,i,y));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var C in a)f=a[C],a.hasOwnProperty(C)&&f!=null&&!i.hasOwnProperty(C)&&le(t,e,C,null,i,f);for(u in i)if(f=i[u],y=a[u],i.hasOwnProperty(u)&&f!==y&&(f!=null||y!=null))switch(u){case"children":case"dangerouslySetInnerHTML":if(f!=null)throw Error(S(137,e));break;default:le(t,e,u,f,i,y)}return;default:if(Md(e)){for(var D in a)f=a[D],a.hasOwnProperty(D)&&f!==void 0&&!i.hasOwnProperty(D)&&ld(t,e,D,void 0,i,f);for(d in i)f=i[d],y=a[d],!i.hasOwnProperty(d)||f===y||f===void 0&&y===void 0||ld(t,e,d,f,i,y);return}}for(var h in a)f=a[h],a.hasOwnProperty(h)&&f!=null&&!i.hasOwnProperty(h)&&le(t,e,h,null,i,f);for(p in i)f=i[p],y=a[p],!i.hasOwnProperty(p)||f===y||f==null&&y==null||le(t,e,p,f,i,y)}function Mp(t){switch(t){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function SS(){if(typeof performance.getEntriesByType=="function"){for(var t=0,e=0,a=performance.getEntriesByType("resource"),i=0;i<a.length;i++){var l=a[i],n=l.transferSize,s=l.initiatorType,r=l.duration;if(n&&r&&Mp(s)){for(s=0,r=l.responseEnd,i+=1;i<a.length;i++){var o=a[i],u=o.startTime;if(u>r)break;var d=o.transferSize,p=o.initiatorType;d&&Mp(p)&&(o=o.responseEnd,s+=d*(o<r?1:(r-u)/(o-u)))}if(--i,e+=8*(n+s)/(l.duration/1e3),t++,10<t)break}}if(0<t)return e/t/1e6}return navigator.connection&&(t=navigator.connection.downlink,typeof t=="number")?t:5}var nd=null,sd=null;function yo(t){return t.nodeType===9?t:t.ownerDocument}function xp(t){switch(t){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function c0(t,e){if(t===0)switch(e){case"svg":return 1;case"math":return 2;default:return 0}return t===1&&e==="foreignObject"?0:t}function rd(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.children=="bigint"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var gc=null;function ES(){var t=window.event;return t&&t.type==="popstate"?t===gc?!1:(gc=t,!0):(gc=null,!1)}var d0=typeof setTimeout=="function"?setTimeout:void 0,GS=typeof clearTimeout=="function"?clearTimeout:void 0,Sp=typeof Promise=="function"?Promise:void 0,CS=typeof queueMicrotask=="function"?queueMicrotask:typeof Sp<"u"?function(t){return Sp.resolve(null).then(t).catch(TS)}:d0;function TS(t){setTimeout(function(){throw t})}function Ai(t){return t==="head"}function Ep(t,e){var a=e,i=0;do{var l=a.nextSibling;if(t.removeChild(a),l&&l.nodeType===8)if(a=l.data,a==="/$"||a==="/&"){if(i===0){t.removeChild(l),an(e);return}i--}else if(a==="$"||a==="$?"||a==="$~"||a==="$!"||a==="&")i++;else if(a==="html")os(t.ownerDocument.documentElement);else if(a==="head"){a=t.ownerDocument.head,os(a);for(var n=a.firstChild;n;){var s=n.nextSibling,r=n.nodeName;n[ws]||r==="SCRIPT"||r==="STYLE"||r==="LINK"&&n.rel.toLowerCase()==="stylesheet"||a.removeChild(n),n=s}}else a==="body"&&os(t.ownerDocument.body);a=l}while(a);an(e)}function Gp(t,e){var a=t;t=0;do{var i=a.nextSibling;if(a.nodeType===1?e?(a._stashedDisplay=a.style.display,a.style.display="none"):(a.style.display=a._stashedDisplay||"",a.getAttribute("style")===""&&a.removeAttribute("style")):a.nodeType===3&&(e?(a._stashedText=a.nodeValue,a.nodeValue=""):a.nodeValue=a._stashedText||""),i&&i.nodeType===8)if(a=i.data,a==="/$"){if(t===0)break;t--}else a!=="$"&&a!=="$?"&&a!=="$~"&&a!=="$!"||t++;a=i}while(a)}function od(t){var e=t.firstChild;for(e&&e.nodeType===10&&(e=e.nextSibling);e;){var a=e;switch(e=e.nextSibling,a.nodeName){case"HTML":case"HEAD":case"BODY":od(a),bd(a);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(a.rel.toLowerCase()==="stylesheet")continue}t.removeChild(a)}}function wS(t,e,a,i){for(;t.nodeType===1;){var l=a;if(t.nodeName.toLowerCase()!==e.toLowerCase()){if(!i&&(t.nodeName!=="INPUT"||t.type!=="hidden"))break}else if(i){if(!t[ws])switch(e){case"meta":if(!t.hasAttribute("itemprop"))break;return t;case"link":if(n=t.getAttribute("rel"),n==="stylesheet"&&t.hasAttribute("data-precedence"))break;if(n!==l.rel||t.getAttribute("href")!==(l.href==null||l.href===""?null:l.href)||t.getAttribute("crossorigin")!==(l.crossOrigin==null?null:l.crossOrigin)||t.getAttribute("title")!==(l.title==null?null:l.title))break;return t;case"style":if(t.hasAttribute("data-precedence"))break;return t;case"script":if(n=t.getAttribute("src"),(n!==(l.src==null?null:l.src)||t.getAttribute("type")!==(l.type==null?null:l.type)||t.getAttribute("crossorigin")!==(l.crossOrigin==null?null:l.crossOrigin))&&n&&t.hasAttribute("async")&&!t.hasAttribute("itemprop"))break;return t;default:return t}}else if(e==="input"&&t.type==="hidden"){var n=l.name==null?null:""+l.name;if(l.type==="hidden"&&t.getAttribute("name")===n)return t}else return t;if(t=Ht(t.nextSibling),t===null)break}return null}function RS(t,e,a){if(e==="")return null;for(;t.nodeType!==3;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!a||(t=Ht(t.nextSibling),t===null))return null;return t}function f0(t,e){for(;t.nodeType!==8;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!e||(t=Ht(t.nextSibling),t===null))return null;return t}function ud(t){return t.data==="$?"||t.data==="$~"}function cd(t){return t.data==="$!"||t.data==="$?"&&t.ownerDocument.readyState!=="loading"}function AS(t,e){var a=t.ownerDocument;if(t.data==="$~")t._reactRetry=e;else if(t.data!=="$?"||a.readyState!=="loading")e();else{var i=function(){e(),a.removeEventListener("DOMContentLoaded",i)};a.addEventListener("DOMContentLoaded",i),t._reactRetry=i}}function Ht(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?"||e==="$~"||e==="&"||e==="F!"||e==="F")break;if(e==="/$"||e==="/&")return null}}return t}var dd=null;function Cp(t){t=t.nextSibling;for(var e=0;t;){if(t.nodeType===8){var a=t.data;if(a==="/$"||a==="/&"){if(e===0)return Ht(t.nextSibling);e--}else a!=="$"&&a!=="$!"&&a!=="$?"&&a!=="$~"&&a!=="&"||e++}t=t.nextSibling}return null}function Tp(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var a=t.data;if(a==="$"||a==="$!"||a==="$?"||a==="$~"||a==="&"){if(e===0)return t;e--}else a!=="/$"&&a!=="/&"||e++}t=t.previousSibling}return null}function h0(t,e,a){switch(e=yo(a),t){case"html":if(t=e.documentElement,!t)throw Error(S(452));return t;case"head":if(t=e.head,!t)throw Error(S(453));return t;case"body":if(t=e.body,!t)throw Error(S(454));return t;default:throw Error(S(451))}}function os(t){for(var e=t.attributes;e.length;)t.removeAttributeNode(e[0]);bd(t)}var Lt=new Map,wp=new Set;function go(t){return typeof t.getRootNode=="function"?t.getRootNode():t.nodeType===9?t:t.ownerDocument}var Ua=te.d;te.d={f:zS,r:PS,D:_S,C:NS,L:DS,m:OS,X:LS,S:HS,M:US};function zS(){var t=Ua.f(),e=Do();return t||e}function PS(t){var e=nn(t);e!==null&&e.tag===5&&e.type==="form"?sg(e):Ua.r(t)}var un=typeof document>"u"?null:document;function m0(t,e,a){var i=un;if(i&&typeof e=="string"&&e){var l=_t(e);l='link[rel="'+t+'"][href="'+l+'"]',typeof a=="string"&&(l+='[crossorigin="'+a+'"]'),wp.has(l)||(wp.add(l),t={rel:t,crossOrigin:a,href:e},i.querySelector(l)===null&&(e=i.createElement("link"),Xe(e,"link",t),Oe(e),i.head.appendChild(e)))}}function _S(t){Ua.D(t),m0("dns-prefetch",t,null)}function NS(t,e){Ua.C(t,e),m0("preconnect",t,e)}function DS(t,e,a){Ua.L(t,e,a);var i=un;if(i&&t&&e){var l='link[rel="preload"][as="'+_t(e)+'"]';e==="image"&&a&&a.imageSrcSet?(l+='[imagesrcset="'+_t(a.imageSrcSet)+'"]',typeof a.imageSizes=="string"&&(l+='[imagesizes="'+_t(a.imageSizes)+'"]')):l+='[href="'+_t(t)+'"]';var n=l;switch(e){case"style":n=tn(t);break;case"script":n=cn(t)}Lt.has(n)||(t=he({rel:"preload",href:e==="image"&&a&&a.imageSrcSet?void 0:t,as:e},a),Lt.set(n,t),i.querySelector(l)!==null||e==="style"&&i.querySelector(Ns(n))||e==="script"&&i.querySelector(Ds(n))||(e=i.createElement("link"),Xe(e,"link",t),Oe(e),i.head.appendChild(e)))}}function OS(t,e){Ua.m(t,e);var a=un;if(a&&t){var i=e&&typeof e.as=="string"?e.as:"script",l='link[rel="modulepreload"][as="'+_t(i)+'"][href="'+_t(t)+'"]',n=l;switch(i){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":n=cn(t)}if(!Lt.has(n)&&(t=he({rel:"modulepreload",href:t},e),Lt.set(n,t),a.querySelector(l)===null)){switch(i){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(a.querySelector(Ds(n)))return}i=a.createElement("link"),Xe(i,"link",t),Oe(i),a.head.appendChild(i)}}}function HS(t,e,a){Ua.S(t,e,a);var i=un;if(i&&t){var l=Bl(i).hoistableStyles,n=tn(t);e=e||"default";var s=l.get(n);if(!s){var r={loading:0,preload:null};if(s=i.querySelector(Ns(n)))r.loading=5;else{t=he({rel:"stylesheet",href:t,"data-precedence":e},a),(a=Lt.get(n))&&nf(t,a);var o=s=i.createElement("link");Oe(o),Xe(o,"link",t),o._p=new Promise(function(u,d){o.onload=u,o.onerror=d}),o.addEventListener("load",function(){r.loading|=1}),o.addEventListener("error",function(){r.loading|=2}),r.loading|=4,Xr(s,e,i)}s={type:"stylesheet",instance:s,count:1,state:r},l.set(n,s)}}}function LS(t,e){Ua.X(t,e);var a=un;if(a&&t){var i=Bl(a).hoistableScripts,l=cn(t),n=i.get(l);n||(n=a.querySelector(Ds(l)),n||(t=he({src:t,async:!0},e),(e=Lt.get(l))&&sf(t,e),n=a.createElement("script"),Oe(n),Xe(n,"link",t),a.head.appendChild(n)),n={type:"script",instance:n,count:1,state:null},i.set(l,n))}}function US(t,e){Ua.M(t,e);var a=un;if(a&&t){var i=Bl(a).hoistableScripts,l=cn(t),n=i.get(l);n||(n=a.querySelector(Ds(l)),n||(t=he({src:t,async:!0,type:"module"},e),(e=Lt.get(l))&&sf(t,e),n=a.createElement("script"),Oe(n),Xe(n,"link",t),a.head.appendChild(n)),n={type:"script",instance:n,count:1,state:null},i.set(l,n))}}function Rp(t,e,a,i){var l=(l=pi.current)?go(l):null;if(!l)throw Error(S(446));switch(t){case"meta":case"title":return null;case"style":return typeof a.precedence=="string"&&typeof a.href=="string"?(e=tn(a.href),a=Bl(l).hoistableStyles,i=a.get(e),i||(i={type:"style",instance:null,count:0,state:null},a.set(e,i)),i):{type:"void",instance:null,count:0,state:null};case"link":if(a.rel==="stylesheet"&&typeof a.href=="string"&&typeof a.precedence=="string"){t=tn(a.href);var n=Bl(l).hoistableStyles,s=n.get(t);if(s||(l=l.ownerDocument||l,s={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},n.set(t,s),(n=l.querySelector(Ns(t)))&&!n._p&&(s.instance=n,s.state.loading=5),Lt.has(t)||(a={rel:"preload",as:"style",href:a.href,crossOrigin:a.crossOrigin,integrity:a.integrity,media:a.media,hrefLang:a.hrefLang,referrerPolicy:a.referrerPolicy},Lt.set(t,a),n||BS(l,t,a,s.state))),e&&i===null)throw Error(S(528,""));return s}if(e&&i!==null)throw Error(S(529,""));return null;case"script":return e=a.async,a=a.src,typeof a=="string"&&e&&typeof e!="function"&&typeof e!="symbol"?(e=cn(a),a=Bl(l).hoistableScripts,i=a.get(e),i||(i={type:"script",instance:null,count:0,state:null},a.set(e,i)),i):{type:"void",instance:null,count:0,state:null};default:throw Error(S(444,t))}}function tn(t){return'href="'+_t(t)+'"'}function Ns(t){return'link[rel="stylesheet"]['+t+"]"}function p0(t){return he({},t,{"data-precedence":t.precedence,precedence:null})}function BS(t,e,a,i){t.querySelector('link[rel="preload"][as="style"]['+e+"]")?i.loading=1:(e=t.createElement("link"),i.preload=e,e.addEventListener("load",function(){return i.loading|=1}),e.addEventListener("error",function(){return i.loading|=2}),Xe(e,"link",a),Oe(e),t.head.appendChild(e))}function cn(t){return'[src="'+_t(t)+'"]'}function Ds(t){return"script[async]"+t}function Ap(t,e,a){if(e.count++,e.instance===null)switch(e.type){case"style":var i=t.querySelector('style[data-href~="'+_t(a.href)+'"]');if(i)return e.instance=i,Oe(i),i;var l=he({},a,{"data-href":a.href,"data-precedence":a.precedence,href:null,precedence:null});return i=(t.ownerDocument||t).createElement("style"),Oe(i),Xe(i,"style",l),Xr(i,a.precedence,t),e.instance=i;case"stylesheet":l=tn(a.href);var n=t.querySelector(Ns(l));if(n)return e.state.loading|=4,e.instance=n,Oe(n),n;i=p0(a),(l=Lt.get(l))&&nf(i,l),n=(t.ownerDocument||t).createElement("link"),Oe(n);var s=n;return s._p=new Promise(function(r,o){s.onload=r,s.onerror=o}),Xe(n,"link",i),e.state.loading|=4,Xr(n,a.precedence,t),e.instance=n;case"script":return n=cn(a.src),(l=t.querySelector(Ds(n)))?(e.instance=l,Oe(l),l):(i=a,(l=Lt.get(n))&&(i=he({},a),sf(i,l)),t=t.ownerDocument||t,l=t.createElement("script"),Oe(l),Xe(l,"link",i),t.head.appendChild(l),e.instance=l);case"void":return null;default:throw Error(S(443,e.type))}else e.type==="stylesheet"&&(e.state.loading&4)===0&&(i=e.instance,e.state.loading|=4,Xr(i,a.precedence,t));return e.instance}function Xr(t,e,a){for(var i=a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),l=i.length?i[i.length-1]:null,n=l,s=0;s<i.length;s++){var r=i[s];if(r.dataset.precedence===e)n=r;else if(n!==l)break}n?n.parentNode.insertBefore(t,n.nextSibling):(e=a.nodeType===9?a.head:a,e.insertBefore(t,e.firstChild))}function nf(t,e){t.crossOrigin==null&&(t.crossOrigin=e.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=e.referrerPolicy),t.title==null&&(t.title=e.title)}function sf(t,e){t.crossOrigin==null&&(t.crossOrigin=e.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=e.referrerPolicy),t.integrity==null&&(t.integrity=e.integrity)}var qr=null;function zp(t,e,a){if(qr===null){var i=new Map,l=qr=new Map;l.set(a,i)}else l=qr,i=l.get(a),i||(i=new Map,l.set(a,i));if(i.has(t))return i;for(i.set(t,null),a=a.getElementsByTagName(t),l=0;l<a.length;l++){var n=a[l];if(!(n[ws]||n[Be]||t==="link"&&n.getAttribute("rel")==="stylesheet")&&n.namespaceURI!=="http://www.w3.org/2000/svg"){var s=n.getAttribute(e)||"";s=t+s;var r=i.get(s);r?r.push(n):i.set(s,[n])}}return i}function Pp(t,e,a){t=t.ownerDocument||t,t.head.insertBefore(a,e==="title"?t.querySelector("head > title"):null)}function FS(t,e,a){if(a===1||e.itemProp!=null)return!1;switch(t){case"meta":case"title":return!0;case"style":if(typeof e.precedence!="string"||typeof e.href!="string"||e.href==="")break;return!0;case"link":if(typeof e.rel!="string"||typeof e.href!="string"||e.href===""||e.onLoad||e.onError)break;return e.rel==="stylesheet"?(t=e.disabled,typeof e.precedence=="string"&&t==null):!0;case"script":if(e.async&&typeof e.async!="function"&&typeof e.async!="symbol"&&!e.onLoad&&!e.onError&&e.src&&typeof e.src=="string")return!0}return!1}function y0(t){return!(t.type==="stylesheet"&&(t.state.loading&3)===0)}function YS(t,e,a,i){if(a.type==="stylesheet"&&(typeof i.media!="string"||matchMedia(i.media).matches!==!1)&&(a.state.loading&4)===0){if(a.instance===null){var l=tn(i.href),n=e.querySelector(Ns(l));if(n){e=n._p,e!==null&&typeof e=="object"&&typeof e.then=="function"&&(t.count++,t=vo.bind(t),e.then(t,t)),a.state.loading|=4,a.instance=n,Oe(n);return}n=e.ownerDocument||e,i=p0(i),(l=Lt.get(l))&&nf(i,l),n=n.createElement("link"),Oe(n);var s=n;s._p=new Promise(function(r,o){s.onload=r,s.onerror=o}),Xe(n,"link",i),a.instance=n}t.stylesheets===null&&(t.stylesheets=new Map),t.stylesheets.set(a,e),(e=a.state.preload)&&(a.state.loading&3)===0&&(t.count++,a=vo.bind(t),e.addEventListener("load",a),e.addEventListener("error",a))}}var vc=0;function XS(t,e){return t.stylesheets&&t.count===0&&jr(t,t.stylesheets),0<t.count||0<t.imgCount?function(a){var i=setTimeout(function(){if(t.stylesheets&&jr(t,t.stylesheets),t.unsuspend){var n=t.unsuspend;t.unsuspend=null,n()}},6e4+e);0<t.imgBytes&&vc===0&&(vc=62500*SS());var l=setTimeout(function(){if(t.waitingForImages=!1,t.count===0&&(t.stylesheets&&jr(t,t.stylesheets),t.unsuspend)){var n=t.unsuspend;t.unsuspend=null,n()}},(t.imgBytes>vc?50:800)+e);return t.unsuspend=a,function(){t.unsuspend=null,clearTimeout(i),clearTimeout(l)}}:null}function vo(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)jr(this,this.stylesheets);else if(this.unsuspend){var t=this.unsuspend;this.unsuspend=null,t()}}}var bo=null;function jr(t,e){t.stylesheets=null,t.unsuspend!==null&&(t.count++,bo=new Map,e.forEach(qS,t),bo=null,vo.call(t))}function qS(t,e){if(!(e.state.loading&4)){var a=bo.get(t);if(a)var i=a.get(null);else{a=new Map,bo.set(t,a);for(var l=t.querySelectorAll("link[data-precedence],style[data-precedence]"),n=0;n<l.length;n++){var s=l[n];(s.nodeName==="LINK"||s.getAttribute("media")!=="not all")&&(a.set(s.dataset.precedence,s),i=s)}i&&a.set(null,i)}l=e.instance,s=l.getAttribute("data-precedence"),n=a.get(s)||i,n===i&&a.set(null,l),a.set(s,l),this.count++,i=vo.bind(this),l.addEventListener("load",i),l.addEventListener("error",i),n?n.parentNode.insertBefore(l,n.nextSibling):(t=t.nodeType===9?t.head:t,t.insertBefore(l,t.firstChild)),e.state.loading|=4}}var Ms={$$typeof:wa,Provider:null,Consumer:null,_currentValue:Zi,_currentValue2:Zi,_threadCount:0};function jS(t,e,a,i,l,n,s,r,o){this.tag=1,this.containerInfo=t,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=ju(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=ju(0),this.hiddenUpdates=ju(null),this.identifierPrefix=i,this.onUncaughtError=l,this.onCaughtError=n,this.onRecoverableError=s,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=o,this.incompleteTransitions=new Map}function g0(t,e,a,i,l,n,s,r,o,u,d,p){return t=new jS(t,e,a,s,o,u,d,p,r),e=1,n===!0&&(e|=24),n=dt(3,null,null,e),t.current=n,n.stateNode=t,e=Pd(),e.refCount++,t.pooledCache=e,e.refCount++,n.memoizedState={element:i,isDehydrated:a,cache:e},Dd(n),t}function v0(t){return t?(t=Ol,t):Ol}function b0(t,e,a,i,l,n){l=v0(l),i.context===null?i.context=l:i.pendingContext=l,i=gi(e),i.payload={element:a},n=n===void 0?null:n,n!==null&&(i.callback=n),a=vi(t,i,e),a!==null&&(at(a,t,e),es(a,t,e))}function _p(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var a=t.retryLane;t.retryLane=a!==0&&a<e?a:e}}function rf(t,e){_p(t,e),(t=t.alternate)&&_p(t,e)}function M0(t){if(t.tag===13||t.tag===31){var e=nl(t,67108864);e!==null&&at(e,t,67108864),rf(t,67108864)}}function Np(t){if(t.tag===13||t.tag===31){var e=yt();e=gd(e);var a=nl(t,e);a!==null&&at(a,t,e),rf(t,e)}}var Mo=!0;function VS(t,e,a,i){var l=_.T;_.T=null;var n=te.p;try{te.p=2,of(t,e,a,i)}finally{te.p=n,_.T=l}}function ZS(t,e,a,i){var l=_.T;_.T=null;var n=te.p;try{te.p=8,of(t,e,a,i)}finally{te.p=n,_.T=l}}function of(t,e,a,i){if(Mo){var l=fd(i);if(l===null)yc(t,e,i,xo,a),Dp(t,i);else if(QS(l,t,e,a,i))i.stopPropagation();else if(Dp(t,i),e&4&&-1<IS.indexOf(t)){for(;l!==null;){var n=nn(l);if(n!==null)switch(n.tag){case 3:if(n=n.stateNode,n.current.memoizedState.isDehydrated){var s=qi(n.pendingLanes);if(s!==0){var r=n;for(r.pendingLanes|=2,r.entangledLanes|=2;s;){var o=1<<31-pt(s);r.entanglements[1]|=o,s&=~o}na(n),(ee&6)===0&&(uo=ht()+500,_s(0,!1))}}break;case 31:case 13:r=nl(n,2),r!==null&&at(r,n,2),Do(),rf(n,2)}if(n=fd(i),n===null&&yc(t,e,i,xo,a),n===l)break;l=n}l!==null&&i.stopPropagation()}else yc(t,e,i,null,a)}}function fd(t){return t=xd(t),uf(t)}var xo=null;function uf(t){if(xo=null,t=Al(t),t!==null){var e=Es(t);if(e===null)t=null;else{var a=e.tag;if(a===13){if(t=Fp(e),t!==null)return t;t=null}else if(a===31){if(t=Yp(e),t!==null)return t;t=null}else if(a===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null)}}return xo=t,null}function x0(t){switch(t){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(DM()){case Vp:return 2;case Zp:return 8;case kr:case OM:return 32;case Ip:return 268435456;default:return 32}default:return 32}}var hd=!1,xi=null,Si=null,Ei=null,xs=new Map,Ss=new Map,ui=[],IS="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function Dp(t,e){switch(t){case"focusin":case"focusout":xi=null;break;case"dragenter":case"dragleave":Si=null;break;case"mouseover":case"mouseout":Ei=null;break;case"pointerover":case"pointerout":xs.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":Ss.delete(e.pointerId)}}function qn(t,e,a,i,l,n){return t===null||t.nativeEvent!==n?(t={blockedOn:e,domEventName:a,eventSystemFlags:i,nativeEvent:n,targetContainers:[l]},e!==null&&(e=nn(e),e!==null&&M0(e)),t):(t.eventSystemFlags|=i,e=t.targetContainers,l!==null&&e.indexOf(l)===-1&&e.push(l),t)}function QS(t,e,a,i,l){switch(e){case"focusin":return xi=qn(xi,t,e,a,i,l),!0;case"dragenter":return Si=qn(Si,t,e,a,i,l),!0;case"mouseover":return Ei=qn(Ei,t,e,a,i,l),!0;case"pointerover":var n=l.pointerId;return xs.set(n,qn(xs.get(n)||null,t,e,a,i,l)),!0;case"gotpointercapture":return n=l.pointerId,Ss.set(n,qn(Ss.get(n)||null,t,e,a,i,l)),!0}return!1}function S0(t){var e=Al(t.target);if(e!==null){var a=Es(e);if(a!==null){if(e=a.tag,e===13){if(e=Fp(a),e!==null){t.blockedOn=e,gm(t.priority,function(){Np(a)});return}}else if(e===31){if(e=Yp(a),e!==null){t.blockedOn=e,gm(t.priority,function(){Np(a)});return}}else if(e===3&&a.stateNode.current.memoizedState.isDehydrated){t.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}t.blockedOn=null}function Vr(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var a=fd(t.nativeEvent);if(a===null){a=t.nativeEvent;var i=new a.constructor(a.type,a);Pc=i,a.target.dispatchEvent(i),Pc=null}else return e=nn(a),e!==null&&M0(e),t.blockedOn=a,!1;e.shift()}return!0}function Op(t,e,a){Vr(t)&&a.delete(e)}function kS(){hd=!1,xi!==null&&Vr(xi)&&(xi=null),Si!==null&&Vr(Si)&&(Si=null),Ei!==null&&Vr(Ei)&&(Ei=null),xs.forEach(Op),Ss.forEach(Op)}function Ar(t,e){t.blockedOn===e&&(t.blockedOn=null,hd||(hd=!0,_e.unstable_scheduleCallback(_e.unstable_NormalPriority,kS)))}var zr=null;function Hp(t){zr!==t&&(zr=t,_e.unstable_scheduleCallback(_e.unstable_NormalPriority,function(){zr===t&&(zr=null);for(var e=0;e<t.length;e+=3){var a=t[e],i=t[e+1],l=t[e+2];if(typeof i!="function"){if(uf(i||a)===null)continue;break}var n=nn(a);n!==null&&(t.splice(e,3),e-=3,Ic(n,{pending:!0,data:l,method:a.method,action:i},i,l))}}))}function an(t){function e(o){return Ar(o,t)}xi!==null&&Ar(xi,t),Si!==null&&Ar(Si,t),Ei!==null&&Ar(Ei,t),xs.forEach(e),Ss.forEach(e);for(var a=0;a<ui.length;a++){var i=ui[a];i.blockedOn===t&&(i.blockedOn=null)}for(;0<ui.length&&(a=ui[0],a.blockedOn===null);)S0(a),a.blockedOn===null&&ui.shift();if(a=(t.ownerDocument||t).$$reactFormReplay,a!=null)for(i=0;i<a.length;i+=3){var l=a[i],n=a[i+1],s=l[it]||null;if(typeof n=="function")s||Hp(a);else if(s){var r=null;if(n&&n.hasAttribute("formAction")){if(l=n,s=n[it]||null)r=s.formAction;else if(uf(l)!==null)continue}else r=s.action;typeof r=="function"?a[i+1]=r:(a.splice(i,3),i-=3),Hp(a)}}}function E0(){function t(n){n.canIntercept&&n.info==="react-transition"&&n.intercept({handler:function(){return new Promise(function(s){return l=s})},focusReset:"manual",scroll:"manual"})}function e(){l!==null&&(l(),l=null),i||setTimeout(a,20)}function a(){if(!i&&!navigation.transition){var n=navigation.currentEntry;n&&n.url!=null&&navigation.navigate(n.url,{state:n.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var i=!1,l=null;return navigation.addEventListener("navigate",t),navigation.addEventListener("navigatesuccess",e),navigation.addEventListener("navigateerror",e),setTimeout(a,100),function(){i=!0,navigation.removeEventListener("navigate",t),navigation.removeEventListener("navigatesuccess",e),navigation.removeEventListener("navigateerror",e),l!==null&&(l(),l=null)}}}function cf(t){this._internalRoot=t}Lo.prototype.render=cf.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(S(409));var a=e.current,i=yt();b0(a,i,t,e,null,null)};Lo.prototype.unmount=cf.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;b0(t.current,2,null,t,null,null),Do(),e[ln]=null}};function Lo(t){this._internalRoot=t}Lo.prototype.unstable_scheduleHydration=function(t){if(t){var e=Wp();t={blockedOn:null,target:t,priority:e};for(var a=0;a<ui.length&&e!==0&&e<ui[a].priority;a++);ui.splice(a,0,t),a===0&&S0(t)}};var Lp=Up.version;if(Lp!=="19.2.7")throw Error(S(527,Lp,"19.2.7"));te.findDOMNode=function(t){var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(S(188)):(t=Object.keys(t).join(","),Error(S(268,t)));return t=wM(e),t=t!==null?Xp(t):null,t=t===null?null:t.stateNode,t};var KS={bundleType:0,version:"19.2.7",rendererPackageName:"react-dom",currentDispatcherRef:_,reconcilerVersion:"19.2.7"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&(jn=__REACT_DEVTOOLS_GLOBAL_HOOK__,!jn.isDisabled&&jn.supportsFiber))try{Gs=jn.inject(KS),mt=jn}catch{}var jn;Uo.createRoot=function(t,e){if(!Bp(t))throw Error(S(299));var a=!1,i="",l=mg,n=pg,s=yg;return e!=null&&(e.unstable_strictMode===!0&&(a=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onUncaughtError!==void 0&&(l=e.onUncaughtError),e.onCaughtError!==void 0&&(n=e.onCaughtError),e.onRecoverableError!==void 0&&(s=e.onRecoverableError)),e=g0(t,1,!1,null,null,a,i,null,l,n,s,E0),t[ln]=e.current,lf(t),new cf(e)};Uo.hydrateRoot=function(t,e,a){if(!Bp(t))throw Error(S(299));var i=!1,l="",n=mg,s=pg,r=yg,o=null;return a!=null&&(a.unstable_strictMode===!0&&(i=!0),a.identifierPrefix!==void 0&&(l=a.identifierPrefix),a.onUncaughtError!==void 0&&(n=a.onUncaughtError),a.onCaughtError!==void 0&&(s=a.onCaughtError),a.onRecoverableError!==void 0&&(r=a.onRecoverableError),a.formState!==void 0&&(o=a.formState)),e=g0(t,1,!0,e,a??null,i,l,o,n,s,r,E0),e.context=v0(null),a=e.current,i=yt(),i=gd(i),l=gi(i),l.callback=null,vi(a,l,i),a=i,e.current.lanes=a,Ts(e,a),na(e),t[ln]=e.current,lf(t),new Lo(e)};Uo.version="19.2.7"});var w0=Wt((YE,T0)=>{"use strict";function C0(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(C0)}catch(t){console.error(t)}}C0(),T0.exports=G0()});var P0=Wt(Fo=>{"use strict";var WS=Symbol.for("react.transitional.element"),$S=Symbol.for("react.fragment");function z0(t,e,a){var i=null;if(a!==void 0&&(i=""+a),e.key!==void 0&&(i=""+e.key),"key"in e){a={};for(var l in e)l!=="key"&&(a[l]=e[l])}else a=e;return e=a.ref,{$$typeof:WS,type:t,key:i,ref:e!==void 0?e:null,props:a}}Fo.Fragment=$S;Fo.jsx=z0;Fo.jsxs=z0});var Q=Wt((jE,_0)=>{"use strict";_0.exports=P0()});var Wb=F(w0(),1);var Vt=F(Fi(),1);var ye=F(Fi(),1);function R0(t){return`${t.x}:${t.y}`}function A0(t,e,a,i,l){return i<1||l<1||a.width<=0||a.height<=0||t<a.left||e<a.top||t>=a.left+a.width||e>=a.top+a.height?null:{x:Math.min(i-1,Math.floor((t-a.left)/a.width*i)),y:Math.min(l-1,Math.floor((e-a.top)/a.height*l))}}var Bo=class{activeTiles=new Map;visitedTiles=new Set;lastTile=null;paintMode=null;begin(e){return this.visitedTiles.clear(),this.paintMode=this.activeTiles.has(R0(e))?"release":"press",this.lastTile=e,this.apply(e)}move(e){if(!this.paintMode)return[];let a=JS(this.lastTile??e,e).flatMap(i=>this.apply(i));return this.lastTile=e,a}end(){this.lastTile=null,this.paintMode=null,this.visitedTiles.clear()}reset(){this.end(),this.activeTiles.clear()}keys(){return[...this.activeTiles.keys()]}apply(e){let a=R0(e);if(!this.paintMode||this.visitedTiles.has(a))return[];this.visitedTiles.add(a);let i=this.paintMode==="press";return i?this.activeTiles.set(a,e):this.activeTiles.delete(a),[{...e,pressed:i}]}};function JS(t,e){let a=[],i=t.x,l=t.y,n=Math.abs(e.x-t.x),s=t.x<e.x?1:-1,r=-Math.abs(e.y-t.y),o=t.y<e.y?1:-1,u=n+r;for(;;){if(a.push({x:i,y:l}),i===e.x&&l===e.y)return a;let d=u*2;d>=r&&(u+=r,i+=s),d<=n&&(u+=n,l+=o)}}var dn=F(Q(),1),df=F(Fi(),1);function qe({frame:t,label:e="Vista del suelo",className:a=""}){return(0,dn.jsxs)("section",{className:`ml-frame-preview-panel ${a}`.trim(),children:[(0,dn.jsx)("span",{children:e}),(0,dn.jsx)(N0,{frame:t})]})}function N0({frame:t,interactive:e=!1,inputResetKey:a,onTilePress:i,onTileRelease:l,className:n=""}){let s=(0,ye.useRef)(null),r=(0,ye.useRef)(null),o=(0,ye.useRef)(new Bo),u=(0,ye.useRef)(a),[d,p]=(0,ye.useState)(()=>new Set),f={"--ml-floor-cols":t.width,"--ml-floor-rows":t.height},y=`ml-floor-preview ${e?"ml-floor-interactive":""} ${n}`.trim(),G=(0,ye.useCallback)(()=>{let E=document.activeElement;E instanceof HTMLElement&&s.current?.contains(E)&&E.blur()},[]),C=(0,ye.useCallback)((E,P)=>{let ge=s.current;return ge?A0(E,P,ge.getBoundingClientRect(),t.width,t.height):null},[t.height,t.width]),D=(0,ye.useCallback)(E=>{if(E.length!==0){for(let P of E)P.pressed?i?.(P.x,P.y):l?.(P.x,P.y);p(new Set(o.current.keys()))}},[i,l]),h=(0,ye.useCallback)(E=>{!E||Number.isNaN(E.x)||Number.isNaN(E.y)||D(o.current.begin(E))},[D]),c=(0,ye.useCallback)(E=>{!E||Number.isNaN(E.x)||Number.isNaN(E.y)||D(o.current.move(E))},[D]),m=(0,ye.useCallback)(()=>{o.current.reset(),p(new Set)},[]);(0,ye.useEffect)(()=>{Object.is(u.current,a)||(u.current=a,m())},[m,a]),(0,ye.useEffect)(()=>{e||m()},[m,e]),(0,ye.useEffect)(()=>{if(!e)return;let E=()=>{r.current=null,o.current.end()},P=()=>{document.hidden&&E()};return window.addEventListener("blur",E),window.addEventListener("pointercancel",E),window.addEventListener("pointerup",E),document.addEventListener("visibilitychange",P),()=>{window.removeEventListener("blur",E),window.removeEventListener("pointercancel",E),window.removeEventListener("pointerup",E),document.removeEventListener("visibilitychange",P)}},[e]);let v=(0,ye.useCallback)(E=>{!e||E.button!==0||(E.preventDefault(),G(),r.current=E.pointerId,s.current?.setPointerCapture(E.pointerId),h(C(E.clientX,E.clientY)))},[h,G,e,C]),w=(0,ye.useCallback)(E=>{!e||r.current!==E.pointerId||(E.preventDefault(),c(C(E.clientX,E.clientY)))},[c,e,C]),L=(0,ye.useCallback)(E=>{!e||r.current!==E.pointerId||(c(C(E.clientX,E.clientY)),r.current=null,o.current.end(),G(),s.current?.hasPointerCapture(E.pointerId)&&s.current.releasePointerCapture(E.pointerId))},[G,c,e,C]),T=(0,ye.useCallback)(()=>{r.current=null,o.current.end(),G()},[G]),N=(0,ye.useCallback)(E=>{D(o.current.begin(E)),o.current.end()},[D]);return(0,dn.jsx)("div",{className:y,onLostPointerCapture:T,onPointerCancel:L,onPointerDown:v,onPointerMove:w,onPointerUp:L,ref:s,style:f,role:"grid","aria-label":"Vista del suelo",children:t.cells.map(E=>{let P={backgroundColor:E.color,gridColumnStart:E.x+1,gridRowStart:E.y+1},ge=`${E.x}-${E.y}`,va=d.has(`${E.x}:${E.y}`),Lh={className:"ml-floor-tile",style:P,"data-tile-x":E.x,"data-tile-y":E.y,"data-color":E.color};return e?(0,df.createElement)("button",{...Lh,"aria-label":`Baldosa ${E.x}, ${E.y}`,"aria-pressed":va,key:ge,onClick:$b=>{$b.detail===0&&N(E)},type:"button"}):(0,df.createElement)("span",{...Lh,"aria-hidden":"true",key:ge})})})}var R=F(Q(),1),e2={ready:"Listo",waiting:"En espera",starting:"Preparados",running:"En juego",paused:"En pausa",finished:"Terminado"};function t2(t){return e2[t]??t}var O0=(0,Vt.createContext)({paused:!1});function H0({paused:t,children:e}){return(0,R.jsx)(O0.Provider,{value:{paused:t},children:e})}function se({title:t,phase:e,variant:a="default",children:i}){let n=(0,Vt.useContext)(O0).paused,s=n?"paused":e;return(0,R.jsxs)("section",{className:`ml-display-shell ml-tv-display ml-tv-display-${a}${n?" is-paused":""}`,"aria-label":`Pantalla de ${t}`,"data-paused":n||void 0,children:[(0,R.jsxs)("header",{className:"ml-display-header ml-tv-header",children:[(0,R.jsxs)("div",{className:"ml-tv-brand","aria-hidden":"true",children:[(0,R.jsx)("span",{className:"ml-tv-brand-mark"}),(0,R.jsxs)("span",{className:"ml-tv-brand-name",children:[(0,R.jsx)("b",{children:"Motion"}),(0,R.jsx)("b",{children:"Levels"})]})]}),(0,R.jsxs)("div",{className:"ml-tv-title",children:[(0,R.jsx)("span",{className:"ml-display-label",children:"Juego"}),(0,R.jsx)("h1",{children:t})]}),(0,R.jsx)("span",{className:`ml-status-pill ml-status-${s}`,children:t2(s)})]}),(0,R.jsx)("div",{className:"ml-display-content",children:i})]})}function Le({snapshot:t}){if(t.phase!=="waiting"&&t.phase!=="starting")return null;let e=t.readyPlayers??0,a=Math.max(t.requiredPlayers??t.playerCount,1),i=t.phase==="starting",l=Math.max(1,Math.ceil((t.countdownMillis??0)/1e3));return(0,R.jsxs)("section",{"aria-label":i?"El juego est\xE1 a punto de empezar":"Esperando jugadores",className:`ml-player-ready-overlay is-${t.phase}`,children:[(0,R.jsxs)("div",{className:"ml-player-ready-pulse","aria-hidden":"true",children:[(0,R.jsx)("i",{}),(0,R.jsx)("i",{}),(0,R.jsx)("i",{})]}),(0,R.jsx)("span",{children:i?"Todos listos":"Esperando jugadores"}),(0,R.jsx)("strong",{children:i?l:`${e}/${a}`}),(0,R.jsx)("b",{children:i?"El juego est\xE1 a punto de empezar":"Entra y permanece en la zona iluminada"})]})}function A({label:t,value:e,tone:a="cyan",className:i=""}){return(0,R.jsxs)("article",{className:`ml-metric ml-metric-${a} ${i}`.trim(),children:[(0,R.jsx)("span",{className:"ml-metric-label",children:t}),(0,R.jsx)("strong",{className:"ml-metric-value",children:e})]})}function Ut({className:t="",lives:e,maxLives:a}){let i=Math.max(0,Math.trunc(a)),l=Math.min(i,Math.max(0,Math.trunc(e))),n=(0,Vt.useRef)(l),s=(0,Vt.useRef)(0),[r,o]=(0,Vt.useState)(null);return(0,Vt.useEffect)(()=>{let u=n.current;if(n.current=l,u===l)return;s.current+=1;let d={from:u,id:s.current,to:l};o(d);let p=window.setTimeout(()=>{o(f=>f?.id===d.id?null:f)},1100);return()=>window.clearTimeout(p)},[l]),(0,R.jsx)("div",{"aria-label":`${l} de ${i} vidas restantes`,className:`ml-lives-meter ${t}`.trim(),role:"img",children:Array.from({length:i},(u,d)=>{let p=d<l,y=r&&d>=Math.min(r.from,r.to)&&d<Math.max(r.from,r.to)?r.to>r.from?"is-regained":"is-losing":"";return(0,R.jsx)("span",{"aria-hidden":"true",className:`ml-life-heart ${p?"is-remaining":"is-lost"} ${y}`.trim(),"data-life-change":y||void 0,"data-life-state":p?"remaining":"lost",style:{"--ml-heart-index":d},children:(0,R.jsx)("span",{className:"ml-life-heart-glyph",children:"\u2665"})},d)})})}function Me({children:t,columns:e=3,className:a=""}){return(0,R.jsx)("section",{className:`ml-metric-row ${a}`.trim(),style:{"--ml-metric-columns":e},children:t})}function fn({left:t,right:e,target:a,centerLabel:i,centerValue:l,centerCaption:n="",className:s=""}){return(0,R.jsxs)("section",{className:`ml-versus-scoreboard ${s}`.trim(),"aria-label":"Marcador",children:[(0,R.jsx)(D0,{player:t,side:"red",target:a}),(0,R.jsxs)("article",{className:"ml-versus-center",children:[(0,R.jsx)("span",{children:i}),(0,R.jsx)("strong",{children:l}),n?(0,R.jsx)("b",{children:n}):null]}),(0,R.jsx)(D0,{player:e,side:"blue",target:a})]})}function D0({player:t,side:e,target:a}){let i=Math.max(0,Math.min(1,t.score/Math.max(a,1)));return(0,R.jsxs)("article",{className:`ml-player-score-panel ml-player-score-${e}`,style:{"--ml-player":t.color,"--ml-player-rgb":a2(t.color),"--ml-score-progress":i},children:[(0,R.jsxs)("div",{className:"ml-player-score-head",children:[(0,R.jsx)("span",{children:t.label}),(0,R.jsxs)("b",{children:[t.score,"/",a]})]}),(0,R.jsx)("strong",{children:t.score}),(0,R.jsx)("div",{className:"ml-player-score-track","aria-hidden":"true",children:(0,R.jsx)("i",{})})]})}function hn({rounds:t,totalRounds:e,activeRound:a,activeLabel:i="Ronda actual",activeCaption:l="Punto en curso",fallbackLabel:n="Pendiente",className:s=""}){let r=Math.max(t.length,e??0,1),o=new Map(t.map(c=>[c.index,c])),u=Array.from({length:r},(c,m)=>{let v=m+1;return o.get(v)??{index:v,winnerLabel:n,hits:0}}),d=t.length<r?t.length+1:null,p=a===void 0?d:a,f=p??Math.max(t.length,1),y=12,G=Math.min(Math.max(0,f-Math.ceil(y/2)),Math.max(0,r-y)),C=u.slice(G,G+y),D=r>C.length?`Rondas ${C[0]?.index}-${C.at(-1)?.index} de ${r}`:"Historial del partido",h={"--ml-round-count":C.length,"--ml-round-progress":`${Math.min(1,t.length/r)*100}%`};return(0,R.jsxs)("section",{className:`ml-round-strip ${s}`.trim(),"aria-label":"Rondas",style:h,children:[(0,R.jsxs)("div",{className:"ml-round-strip-head",children:[(0,R.jsxs)("div",{className:"ml-round-strip-title",children:[(0,R.jsx)("span",{children:"Rondas"}),(0,R.jsx)("small",{children:D})]}),(0,R.jsxs)("div",{className:"ml-round-strip-count","aria-label":`${t.length} de ${r} rondas jugadas`,children:[(0,R.jsx)("strong",{children:t.length}),(0,R.jsxs)("span",{children:["de ",r]})]})]}),(0,R.jsx)("div",{className:"ml-round-progress","aria-hidden":"true",children:(0,R.jsx)("i",{})}),(0,R.jsx)("div",{className:"ml-round-list",children:C.map(c=>{let m=c.winnerIndex===0||c.winnerIndex===1,v=!m&&c.index===p,w=c.winnerIndex===0?"is-red":c.winnerIndex===1?"is-blue":v?"is-current":"is-pending",L=c.hits??0;return(0,R.jsxs)("article",{className:`ml-round-card ${w}`,children:[(0,R.jsxs)("div",{className:"ml-round-card-head",children:[(0,R.jsxs)("span",{children:["R",c.index]}),(0,R.jsx)("i",{"aria-hidden":"true"})]}),(0,R.jsx)("strong",{children:m?c.winnerLabel||n:v?i:n}),m?(0,R.jsxs)("b",{children:[L," ",L===1?"golpe":"golpes"]}):null,v?(0,R.jsx)("b",{children:l}):null]},c.index)})})]})}function a2(t){let e=t.replace("#","").trim(),a=e.length===3?e.split("").map(l=>l+l).join(""):e.padEnd(6,"0").slice(0,6),i=Number.parseInt(a,16);return Number.isFinite(i)?`${i>>16&255}, ${i>>8&255}, ${i&255}`:"255, 255, 255"}var bf={};Je(bf,{PlayerDisplay:()=>X0,arkanoidConfigVars:()=>Ls,ballColor:()=>yf,brickColors:()=>vf,createGame:()=>Us,finishedFrame:()=>k0,finishedSnapshot:()=>K0,initEvents:()=>Z0,manifest:()=>oa,paddleColor:()=>gf,runningFrame:()=>I0,runningSnapshot:()=>Q0});function Ze(t,e){let a=e.centerX??(t.width-1)/2,i=e.centerY??(t.height-1)/2,l=Math.max(0,e.radius),n=Math.max(0,e.thickness??1);L0(t,e.color,(s,r)=>{let o=U0(s,r,a,i);return{distance:o,phase:Math.abs(o-l),selected:Math.abs(o-l)<=n}},0)}function Ne(t,e){let a=e.centerX??(t.width-1)/2,i=e.centerY??(t.height-1)/2,l=Math.max(1,Math.floor(e.period??7)),n=Math.min(l,Math.max(1,Math.floor(e.bandWidth??2))),s=Math.floor(e.step);L0(t,e.color,(r,o)=>{let u=Math.floor(U0(r,o,a,i)),d=i2(u+s,l);return{distance:u,phase:d,selected:d<n}},s)}function L0(t,e,a,i){for(let l=0;l<t.height;l+=1)for(let n=0;n<t.width;n+=1){let s=a(n,l);if(!s.selected)continue;let r=typeof e=="function"?e({distance:s.distance,phase:s.phase,step:i,x:n,y:l}):e;r&&(t.cells[l*t.width+n]={x:n,y:l,color:r})}}function U0(t,e,a,i){return Math.abs(t-a)+Math.abs(e-i)}function i2(t,e){return(t%e+e)%e}var x=16,M=32,l2=137,n2=0,s2=4294967295,Zt=x*M,r2=2e3,o2=650,u2=["easy","medium","hard","expert"],c2=50,JE=1e3/c2;function sa(t,e){return Number.isInteger(t)&&Number.isInteger(e)&&t>=0&&t<x&&e>=0&&e<M}function B(t,e){return{seed:d2(t.seed),playerCount:f2(t.playerCount,e),players:Array.isArray(t.players)?t.players:[],durationMillis:B0(t.durationMillis,e.defaultDurationMillis),nowMillis:B0(t.nowMillis,0),difficulty:p2(t.difficulty,e),options:y2(t.options,e)}}function d2(t){let e=typeof t=="number"&&Number.isFinite(t)?Math.trunc(t):l2;return H(e,n2,s2)}function f2(t,e){let a=typeof t=="number"&&Number.isFinite(t)?Math.round(t):h2(e);return e.players.allowAny===!0&&a===0?0:H(a,e.players.min,e.players.max)}function h2(t){return t.players.allowAny?0:t.players.min}function B0(t,e){return typeof t=="number"&&Number.isFinite(t)?Math.max(0,t):e}function m2(t){let e=t.config?.difficulty?.options;return e?.length?[...e]:[...u2]}function p2(t,e){let a=m2(e),i=e.config?.difficulty?.default,l=i&&a.includes(i)?i:a.includes("medium")?"medium":a[0]??"medium";return t&&a.includes(t)?t:l}function y2(t,e){let a=t??{};return Object.fromEntries((e.config?.vars??[]).map(i=>[i.key,F0(i,a[i.key])]))}function F0(t,e){if(t.type==="bool")return e===!0||e==="true"?!0:e===!1||e==="false"?!1:t.default;if(t.type==="enum"){let s=String(e??t.default);return t.options.some(o=>o.value===s)?s:t.default}let a=typeof e=="number"&&Number.isFinite(e)?e:typeof e=="string"&&e.trim()!==""?Number(e):Number.NaN,i=Number.isFinite(a)?a:t.default,l=t.type==="int"?Math.round(i):i;return H(l,t.min??-1/0,t.max??1/0)}function je(t,e){return F0(e,t[e.key])}function J(t="#05070a"){let e=[];for(let a=0;a<M;a+=1)for(let i=0;i<x;i+=1)e.push({x:i,y:a,color:t});return{width:x,height:M,cells:e}}function b(t,e,a,i){sa(e,a)&&(t.cells[a*t.width+e]={x:e,y:a,color:i})}function z(t,e,a,i,l,n){for(let s=a;s<a+l;s+=1)for(let r=e;r<e+i;r+=1)b(t,r,s,n)}function g(t,e,a){return{cue:t,message:e.trimEnd().replace(/\.+$/u,""),atMillis:a}}function j(t){let e=t>>>0;return e===0&&(e=1),{next(){return e=Math.imul(e,1664525)+1013904223>>>0,e/4294967296},int(a){if(!Number.isFinite(a)||a<=0)throw new Error("maxExclusive must be greater than zero");return Math.floor(this.next()*a)},range(a,i){if(i<a)throw new Error("maxInclusive must be greater than or equal to minInclusive");return a+this.int(i-a+1)}}}function Ee(t,e=[]){let a=["#35d7ff","#ff3bd7","#ffe176","#5fff9e"];return Array.from({length:t},(i,l)=>({index:l,label:e[l]?.label||e[l]?.name||`Player ${l+1}`,color:e[l]?.color||a[l%a.length]||a[0],score:0,lives:-1}))}function H(t,e,a){return Math.min(a,Math.max(e,t))}function mn(t,e={}){if(!Number.isInteger(t)||t<1)throw new Error("player ready zone count must be a positive integer");let a=H(Math.round(e.minX??0),0,x-1),i=H(Math.round(e.maxX??x-1),a,x-1),l=H(Math.round(e.minY??0),0,M-1),s=H(Math.round(e.maxY??M-1),l,M-1)-l+1;if(t>s)throw new Error("player ready zone count cannot exceed the available floor rows");return Array.from({length:t},(r,o)=>({minX:a,maxX:i,minY:l+Math.floor(s*o/t),maxY:l+Math.floor(s*(o+1)/t)-1}))}function W(t,e,a=0){return new hf(t,e,a)}function Hs(t){return Y0(t.mode==="player-ready"?t.countdownMillis:void 0,r2)}function Os(t){return Number.isFinite(t)?Math.max(0,t):0}var hf=class{constructor(e,a,i){this.policy=e;this.zones=a;if(e.mode==="player-ready"&&a.length===0)throw new Error("player-ready games require at least one presence zone");this.countdownDuration=Hs(e),this.releaseGraceMillis=Y0(e.mode==="player-ready"?e.releaseGraceMillis:void 0,o2),this.zoneHeld=Array.from({length:a.length},()=>0),this.zoneGraceUntil=Array.from({length:a.length},()=>0),this.phase=e.mode==="immediate"?"running":"waiting";for(let l=0;l<M;l+=1)for(let n=0;n<x;n+=1)this.tileZones[l*x+n]=a.findIndex(s=>g2(n,l,s));this.reset(i)}policy;zones;countdownDuration;releaseGraceMillis;tileZones=new Int16Array(Zt).fill(-1);tileHeld=new Uint8Array(Zt);zoneHeld;zoneGraceUntil;phase;startAtMillis=0;reset(e=0){return this.tileHeld.fill(0),this.zoneHeld.fill(0),this.zoneGraceUntil.fill(0),this.phase=this.policy.mode==="immediate"?"running":"waiting",this.startAtMillis=Os(e),this.state(e)}update(e){if(!sa(e.x,e.y))return this.tick(e.atMillis);let a=e.y*x+e.x,i=this.tileZones[a]??-1,l=this.tileHeld[a]===1;return i>=0&&l!==e.pressed&&(this.tileHeld[a]=e.pressed?1:0,e.pressed?(this.zoneHeld[i]=(this.zoneHeld[i]??0)+1,this.zoneGraceUntil[i]=0):(this.zoneHeld[i]=Math.max(0,(this.zoneHeld[i]??0)-1),this.zoneHeld[i]===0&&(this.zoneGraceUntil[i]=Os(e.atMillis)+this.releaseGraceMillis))),this.tick(e.atMillis)}tick(e){if(this.policy.mode==="immediate"||this.phase==="running")return"none";let a=Os(e),i=this.readyPlayerCount(a)===this.zones.length;return this.phase==="waiting"&&i?(this.phase="starting",this.startAtMillis=a+this.countdownDuration,"players-ready"):this.phase==="starting"&&!i?(this.phase="waiting",this.startAtMillis=0,"players-left"):this.phase==="starting"&&a>=this.startAtMillis?(this.phase="running","started"):"none"}state(e){let a=Os(e);return{phase:this.phase,readyPlayers:this.readyPlayerCount(a),requiredPlayers:this.zones.length,countdownMillis:this.phase==="starting"?Math.max(0,this.startAtMillis-a):0}}zoneReady(e,a){let i=this.zoneGraceUntil[e]??0;return(this.zoneHeld[e]??0)>0||i>0&&i>=Os(a)}readyPlayerCount(e){return this.zones.reduce((a,i,l)=>a+Number(this.zoneReady(l,e)),0)}};function Y0(t,e){return t!==void 0&&Number.isFinite(t)&&t>0?t:e}function g2(t,e,a){return t>=a.minX&&t<=a.maxX&&e>=a.minY&&e<=a.maxY}function ra(t){return`#${ff(t.r)}${ff(t.g)}${ff(t.b)}`}function nt(t,e){return{r:H(Math.round(t.r*e/100),0,255),g:H(Math.round(t.g*e/100),0,255),b:H(Math.round(t.b*e/100),0,255)}}function rl(t,e){return{r:H(t.r+e.r,0,255),g:H(t.g+e.g,0,255),b:H(t.b+e.b,0,255)}}function ff(t){return H(Math.round(t),0,255).toString(16).padStart(2,"0")}function $(t){let e=Math.max(0,Math.ceil(t)),a=Math.ceil(e/1e3),i=Math.floor(a/60),l=a%60;return`${i}:${l.toString().padStart(2,"0")}`}var bt=F(Q(),1);function X0({snapshot:t,frame:e}){let a=t.phase==="ready"?"Pisa abajo para mover y lanzar":t.lastEventMessage||"Rompe todos los bloques",i=t.success?"green":t.phase==="finished"?"red":t.phase==="ready"?"yellow":"cyan";return(0,bt.jsx)(se,{title:t.label,phase:t.phase,children:(0,bt.jsxs)("div",{className:"ml-solo-display arkanoid-display",children:[(0,bt.jsx)(Le,{snapshot:t}),(0,bt.jsxs)("div",{className:"ml-solo-summary",children:[(0,bt.jsxs)(Me,{columns:3,className:"ml-solo-number-row",children:[(0,bt.jsx)(A,{label:"Bloques",tone:"pink",value:`${t.score}/${t.totalBricks}`}),(0,bt.jsx)(A,{label:"Vidas",tone:"neutral",value:(0,bt.jsx)(Ut,{lives:t.lives,maxLives:t.maxLives})}),(0,bt.jsx)(A,{label:"Tiempo",tone:"yellow",value:$(t.elapsedMillis)})]}),(0,bt.jsx)(A,{className:"ml-solo-message",label:"Estado",tone:i,value:a})]}),e?(0,bt.jsx)(qe,{className:"ml-solo-floor",frame:e,label:"Juego en el suelo"}):null]})})}var Ls={ballSpeed:{key:"ball_speed",label:"Ball speed (tiles/s)",playerFacing:!0,description:"Base ball speed on Easy. Higher difficulties multiply this value.",type:"float",default:4.25,min:2,max:8,step:.25}},oa={id:"arkanoid",label:"Arkanoid",description:"Single-player floor Arkanoid with step-controlled paddle movement and deterministic brick physics.",availability:{development:!0,production:!0},catalog:{category:"individual",color:"#ff9f45",durationLabel:"Sin l\xEDmite",modeLabel:"Arkanoid",audioLabel:"Efectos",rules:["Pisa la zona inferior para mover la pala","Rompe todos los bloques sin perder la pelota"]},players:{allowAny:!0,min:1,max:1},start:{mode:"player-ready"},config:{difficulty:{default:"medium",options:["easy","medium","hard","expert"]},vars:Object.values(Ls)},defaultDurationMillis:0,display:{entry:"./display"},preview:{seed:137,playerCount:1,difficulty:"medium",actions:[{atMillis:100,type:"press",x:7,y:30},{atMillis:2150,type:"release",x:7,y:30},{atMillis:2250,type:"press",x:9,y:30},{atMillis:2450,type:"release",x:9,y:30}],captureStartMillis:2200,frameCount:18,frameIntervalMillis:120},tags:["arcade","single-player","typescript"]};var yf="#ffffff",gf="#35d7ff",vf=["#ff3151","#ff8a2a","#ffd45f","#74e58d"],v2="#ff3151",b2="#03070c",M2="#06101d",x2="#145cff",S2="#37101a",E2="#ff3151",ua="#74e58d",q0=["#9ddfff","#4b91b8","#21445b"],G2=4,j0=2,C2=3,ol=5,zi=29,Pi=24,mf=3,T2=12;function Us(t){return new pf(t)}var pf=class{ball={x:7,y:zi-1,dx:1,dy:-1};ballMoves=0;ballTrail=[];bricks=[];config;lastControlX=7;lastEvent=g("none","Listo",0);lastMoveMillis=0;lives=mf;nowMillis=0;paddleX=Math.floor((x-ol)/2);phase="ready";players=[];rng;readyGate;score=0;startedAtMillis=0;constructor(e){this.config=B(e,oa),this.rng=j(this.config.seed),this.readyGate=W(oa.start,[{minX:0,maxX:x-1,minY:Pi,maxY:M-1}],this.config.nowMillis),this.resetState(this.config.nowMillis)}init(e){return this.nowMillis=e,this.readyGate.reset(e),this.phase="waiting",this.attachBall(),this.lastEvent=g("ready","Esperando jugador abajo",e),[this.lastEvent]}press(e){return this.nowMillis=e.atMillis,e.y<Pi||e.y>=M?[]:(e.pressed&&this.movePaddle(e.x),this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update(e),e.atMillis):this.phase==="ready"&&e.pressed?this.launchBall(e.atMillis):[])}release(e){return this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update({...e,pressed:!1}),e.atMillis):[]}tick(e){if(this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting")return this.applyReadyTransition(this.readyGate.tick(e.atMillis),e.atMillis);if(this.phase!=="running")return[];let a=[],i=1e3/V0(this.config);for(let l=0;l<T2&&!(e.atMillis-this.lastMoveMillis<i);l+=1){this.lastMoveMillis+=i;let n=this.moveBall(this.lastMoveMillis);if(n&&a.push(n),this.phase!=="running")break}return this.recordEvents(a)}render(){let e=J(b2);z(e,0,Pi,x,M-Pi,M2),z(e,0,M-1,x,1,S2);for(let a of this.bricks)a.alive&&z(e,a.x,a.y,a.width,1,a.color);return(this.phase==="waiting"||this.phase==="starting")&&this.drawPlayerStart(e),this.phase==="finished"&&this.score===this.bricks.length&&R2(e),this.ballTrail.forEach((a,i)=>{let l=q0[i];l&&b(e,a.x,a.y,l)}),(this.phase!=="finished"||this.lives>0)&&b(e,this.ball.x,this.ball.y,yf),z(e,this.paddleX,zi,ol,1,this.phase==="finished"&&this.lives===0?E2:gf),b(e,this.lastControlX,M-1,x2),e}snapshot(){let e=this.bricksRemaining(),a=this.readyGate.state(this.nowMillis);return{currentGame:oa.id,label:oa.label,phase:this.phase,playerCount:this.config.playerCount,players:this.players,score:this.score,lives:this.lives,maxLives:mf,elapsedMillis:Math.max(0,this.nowMillis-this.startedAtMillis),remainingMillis:0,activeTargets:e,success:e===0,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?a.countdownMillis:0,readyPlayers:a.readyPlayers,requiredPlayers:a.requiredPlayers,matchTarget:this.bricks.length,ball:{...this.ball},ballMoves:this.ballMoves,ballSpeed:V0(this.config),bricksRemaining:e,launched:this.phase==="running",paddleWidth:ol,paddleX:this.paddleX,totalBricks:this.bricks.length}}reset(e={}){this.config=B({...this.config,...e},oa),this.rng=j(this.config.seed),this.resetState(this.config.nowMillis)}applyReadyTransition(e,a){return e==="players-ready"?(this.phase="starting",this.lastEvent=g("ready","Jugador listo",a),[this.lastEvent]):e==="players-left"?(this.phase="waiting",this.lastEvent=g("ready","Vuelve a la zona iluminada",a),[this.lastEvent]):e==="started"?this.launchBall(a):[]}launchBall(e){let a=this.phase==="waiting"||this.phase==="starting";return this.phase="running",a&&(this.startedAtMillis=e),this.ball={x:this.paddleCenter(),y:zi-1,dx:this.rng.next()<.5?-1:1,dy:-1},this.ballTrail=[],this.lastMoveMillis=e,this.lastEvent=g("start","Pelota en juego",e),[this.lastEvent]}attachBall(){this.ball={x:this.paddleCenter(),y:zi-1,dx:this.ball.dx,dy:-1},this.ballTrail=[]}brickAt(e,a){return this.bricks.find(i=>i.alive&&i.y===a&&e>=i.x&&e<i.x+i.width)}bricksRemaining(){return this.bricks.reduce((e,a)=>e+Number(a.alive),0)}commitBall(e){this.ballTrail=[{x:this.ball.x,y:this.ball.y},...this.ballTrail].slice(0,q0.length),this.ball=e,this.ballMoves+=1}loseLife(e){return this.lives-=1,this.players=this.scoredPlayers(),this.ballTrail=[],this.lives<=0?(this.phase="finished",g("fail","Sin vidas",e)):(this.phase="ready",this.attachBall(),g("fail","Vida perdida, pisa abajo para lanzar",e))}moveBall(e){let a=this.ball.dx,i=this.ball.dy,l=this.ball.x+a,n=this.ball.y+i;(l<0||l>=x)&&(a=a===1?-1:1,l=this.ball.x+a),n<1&&(i=1,n=this.ball.y+i);let s=this.brickAt(l,n);if(s)return s.alive=!1,this.score+=1,this.players=this.scoredPlayers(),this.ball={...this.ball,dx:a,dy:i===1?-1:1},this.ballMoves+=1,this.bricksRemaining()===0?(this.phase="finished",g("win","Muro completado",e)):g("hit",`Bloque ${this.score} de ${this.bricks.length}`,e);if(i>0&&n===zi&&l>=this.paddleX&&l<this.paddleX+ol){let r=l-this.paddleCenter();return r<0?a=-1:r>0?a=1:a=this.rng.next()<.5?-1:1,Math.abs(r)===1&&this.rng.next()<.35&&(a=a===1?-1:1),this.commitBall({x:l,y:zi-1,dx:a,dy:-1}),g("coin","Rebote",e)}if(n>=M)return this.loseLife(e);this.commitBall({x:l,y:n,dx:a,dy:i})}movePaddle(e){let a=Math.floor(ol/2),i=H(Math.round(e),a,x-1-a);this.paddleX=i-a,this.lastControlX=H(Math.round(e),0,x-1),(this.phase==="ready"||this.phase==="waiting"||this.phase==="starting")&&this.attachBall()}drawPlayerStart(e){if(this.phase==="waiting"){let i=Pi+Math.floor(this.nowMillis/150)%(M-Pi);for(let l=Pi;l<M;l+=1)for(let n=0;n<x;n+=1)(l===i||n===0||n===x-1)&&b(e,n,l,l===i?"#35d7ff":"#0b4260");return}let a=Math.floor(this.nowMillis/125)%4;for(let i=0;i<M;i+=1)for(let l=0;l<x;l+=1)(Math.abs(l-this.paddleCenter())+Math.abs(i-zi)+a)%6===0&&b(e,l,i,i>=Pi?"#ffe176":"#176783")}paddleCenter(){return this.paddleX+Math.floor(ol/2)}recordEvents(e){let a=e.at(-1);return a&&(this.lastEvent=a),e}resetState(e){this.bricks=w2(),this.lives=mf,this.nowMillis=e,this.startedAtMillis=e,this.lastMoveMillis=e,this.paddleX=Math.floor((x-ol)/2),this.lastControlX=this.paddleCenter(),this.readyGate.reset(e),this.phase="waiting",this.score=0,this.ballMoves=0,this.ball={x:this.paddleCenter(),y:zi-1,dx:1,dy:-1},this.ballTrail=[],this.players=this.scoredPlayers(),this.lastEvent=g("ready","Esperando jugador abajo",e)}scoredPlayers(){return Ee(this.config.playerCount,this.config.players).map(e=>({...e,lives:this.lives,score:this.score}))}};function w2(){let t=[],e=0;for(let a=0;a<G2;a+=1)for(let i=0;i<x;i+=j0)t.push({alive:!0,color:vf[a]??v2,id:e,width:j0,x:i,y:C2+a}),e+=1;return t}function R2(t){z(t,2,13,x-4,1,ua),z(t,2,19,x-4,1,ua),z(t,2,13,1,7,ua),z(t,x-3,13,1,7,ua),b(t,5,16,ua),b(t,6,17,ua),b(t,7,18,ua),b(t,8,17,ua),b(t,9,16,ua),b(t,10,15,ua)}function V0(t){return je(t.options,Ls.ballSpeed)*A2(t.difficulty)}function A2(t){switch(t){case"medium":return 1.25;case"hard":return 1.6;case"expert":return 2;default:return 1}}var pn=Us({playerCount:1,difficulty:"medium"}),Z0=pn.init(0);pn.press({x:7,y:30,pressed:!0,atMillis:100});pn.tick({atMillis:2100});pn.tick({atMillis:3300});var I0=pn.render(),Q0=pn.snapshot(),Yo=Us({playerCount:1,difficulty:"easy"});Yo.init(0);z2(Yo);var k0=Yo.render(),K0=Yo.snapshot();function z2(t){t.press({x:7,y:30,pressed:!0,atMillis:50}),t.tick({atMillis:2050});let e=2100;for(let a=0;a<24e3&&t.snapshot().phase!=="finished";a+=1){let i=t.snapshot();t.press({x:i.ball.x,y:30,pressed:!0,atMillis:e}),t.tick({atMillis:e}),e+=50}}var Tf={};Je(Tf,{PlayerDisplay:()=>J0,createGame:()=>_i,crowdedRunningFrame:()=>uv,crowdedRunningSnapshot:()=>cv,dueloConfigVars:()=>yn,dueloPlayerPalette:()=>Ba,dueloReadyZones:()=>jo,finishedFrame:()=>dv,finishedSnapshot:()=>fv,manifest:()=>Mt,runningFrame:()=>rv,runningSnapshot:()=>ov,startingFrame:()=>nv,startingSnapshot:()=>sv,waitingFrame:()=>iv,waitingSnapshot:()=>lv,winAnimationMillis:()=>qo});var V=F(Q(),1);function J0({snapshot:t}){let e=t.playerCount<=4?2:t.playerCount<=6?3:4,a=Math.max(1,Math.ceil(t.countdownMillis/1e3)),i=Math.max(1,Math.ceil(t.remainingMillis/1e3)),l=new Set(t.readyPlayerIndices),n=_2(t,a,i),s={"--duelo-grid-columns":e,"--duelo-player-count":t.playerCount,"--duelo-winner":t.winnerIndex>=0?t.playerProgress[t.winnerIndex]?.color??"#ffffff":"#ffffff","--duelo-winner-rgb":t.winnerIndex>=0?W0(t.playerProgress[t.winnerIndex]?.color??"#ffffff"):"255, 255, 255"};return(0,V.jsx)(se,{title:t.label,phase:t.phase,children:(0,V.jsxs)("div",{className:`duelo-display is-phase-${t.phase} is-player-count-${t.playerCount}`,style:s,children:[(0,V.jsxs)("section",{className:"duelo-hero","aria-label":n.title,children:[(0,V.jsxs)("div",{className:"duelo-hero-copy",children:[(0,V.jsx)("span",{children:n.eyebrow}),(0,V.jsx)("strong",{children:n.title}),(0,V.jsx)("b",{children:n.caption})]}),(0,V.jsxs)("div",{className:"duelo-hero-metrics",children:[(0,V.jsx)(Mf,{label:"Tiempo",value:$(t.elapsedMillis)}),(0,V.jsx)(Mf,{label:"Restantes",value:t.remainingTargets}),(0,V.jsx)(Mf,{label:"Densidad",value:`${t.fillPercent}%`})]})]}),(0,V.jsx)("section",{className:"duelo-player-grid","aria-label":"Progreso de jugadores",children:t.playerProgress.map(r=>(0,V.jsx)(P2,{leader:t.leaderIndex===r.index,phase:t.phase,player:r,ready:l.has(r.index),recent:t.recentClaim?.playerIndex===r.index,winner:t.winnerIndex===r.index},r.index))}),(0,V.jsxs)("footer",{className:"duelo-event-rail",children:[(0,V.jsx)("span",{children:t.phase==="waiting"?"Preparaci\xF3n":t.phase==="finished"?"Resultado":"\xDAltimo evento"}),(0,V.jsx)("strong",{children:t.lastEventMessage||"Listo"},t.motionEventId),(0,V.jsx)("b",{children:t.phase==="finished"?`Nueva partida en ${i}`:`${t.claimedTargets}/${t.totalTargets} reclamadas`})]})]})})}function P2({leader:t,phase:e,player:a,ready:i,recent:l,winner:n}){let s=e==="waiting"?i?"Listo":"Entra en tu zona":e==="starting"?"Preparado":n?"Ganador":t?"L\xEDder":"En carrera",r={"--duelo-player":a.color,"--duelo-player-rgb":W0(a.color),"--duelo-progress":a.progress},o=a.label.length>28?" is-extra-long":a.label.length>18?" is-long":"";return(0,V.jsxs)("article",{className:["duelo-player-card",i?"is-ready":"",t?"is-leader":"",l?"is-recent":"",n?"is-winner":""].filter(Boolean).join(" "),style:r,children:[(0,V.jsxs)("header",{children:[(0,V.jsx)("i",{"aria-hidden":"true"}),(0,V.jsx)("span",{className:`duelo-player-name${o}`,children:a.label}),(0,V.jsx)("b",{children:s})]}),(0,V.jsxs)("div",{className:"duelo-player-score",children:[(0,V.jsx)("strong",{children:a.remaining}),(0,V.jsx)("span",{children:"baldosas restantes"}),l?(0,V.jsx)("em",{children:"+1"},`${a.index}-${a.claimed}`):null]}),(0,V.jsx)("div",{className:"duelo-player-track","aria-hidden":"true",children:(0,V.jsx)("i",{})}),(0,V.jsxs)("footer",{children:[(0,V.jsx)("span",{children:"Reclamadas"}),(0,V.jsxs)("strong",{children:[a.claimed,"/",a.target]})]})]})}function Mf({label:t,value:e}){return(0,V.jsxs)("article",{className:"duelo-hero-metric",children:[(0,V.jsx)("span",{children:t}),(0,V.jsx)("strong",{children:e})]})}function _2(t,e,a){return t.phase==="waiting"?{eyebrow:`Listos ${t.readyPlayers}/${t.requiredPlayers}`,title:"Busca tu color",caption:"Cada jugador entra y permanece en su zona iluminada"}:t.phase==="starting"?{eyebrow:"Todos listos",title:String(e),caption:"El duelo est\xE1 a punto de empezar"}:t.phase==="finished"?{eyebrow:"Victoria",title:`\xA1Gana ${t.winnerLabel}!`,caption:`Nueva partida en ${a}`}:{eyebrow:t.leaderIndex>=0?`Lidera ${t.leaderLabel}`:"Empate",title:"Reclama tu color",caption:"Pisa todas tus baldosas antes que los dem\xE1s"}}function W0(t){return/^#[0-9a-f]{6}$/i.test(t)?[1,3,5].map(e=>Number.parseInt(t.slice(e,e+2),16)).join(", "):"255, 255, 255"}var yn={baseFillPercent:{key:"base_fill_percent",label:"Base floor coverage (%)",playerFacing:!1,description:"The percentage of floor tiles assigned as targets on Medium difficulty.",type:"int",default:60,min:30,max:75,step:5},hardFillMultiplier:{key:"hard_fill_multiplier",label:"Hard coverage multiplier",playerFacing:!1,description:"Hard difficulty multiplies the base floor coverage by this value, capped at the full floor.",type:"float",default:1.5,min:1,max:1.8,step:.05}},Mt={id:"duelo",label:"Duelo",description:"A fast 2\u20138 player race to claim every tile of your color before anyone else.",availability:{development:!0,production:!0},catalog:{category:"versus",color:"#ff5268",durationLabel:"Sin l\xEDmite",modeLabel:"Carrera de colores",audioLabel:"M\xFAsica + efectos",rules:["Cada jugador ocupa la zona de inicio de su color","Pisa todas las baldosas de tu color antes que los dem\xE1s"]},players:{allowAny:!1,min:2,max:8},start:{mode:"player-ready",countdownMillis:3e3,releaseGraceMillis:2e3},config:{difficulty:{default:"medium",options:["medium","hard"]},vars:Object.values(yn)},defaultDurationMillis:0,display:{entry:"./display"},preview:{seed:137,playerCount:4,difficulty:"medium",actions:[{atMillis:100,type:"press",x:1,y:1},{atMillis:100,type:"press",x:14,y:30},{atMillis:100,type:"press",x:1,y:30},{atMillis:100,type:"press",x:14,y:1}],captureStartMillis:3200,frameCount:18,frameIntervalMillis:120},tags:["competitive","multiplayer","color-race","typescript"]};var gn=4,N2=18,$0=420,ev=700,qo=5e3,D2="#03060b",Sf={r:255,g:255,b:255},Ba=["#ff3048","#24d9ff","#42e879","#ff4fd8","#376bff","#ffd84d","#a66cff","#ff8a3d"];function _i(t){return new xf(t)}function jo(t){let e=H(Math.round(t),Mt.players.min,Mt.players.max),a=x-gn,i=M-gn,l=Math.floor((x-gn)/2),n=Math.floor((M-gn)/2);return(e===2?[[0,n],[a,n]]:e===3?[[0,0],[a,0],[l,i]]:[[0,0],[a,i],[0,i],[a,0],[0,n],[a,n],[l,0],[l,i]].slice(0,e)).map(([r=0,o=0])=>({minX:r,maxX:r+gn-1,minY:o,maxY:o+gn-1}))}var xf=class{claimed=new Uint8Array(Zt);claimedAt=new Float64Array(Zt);claims=[];config;fillPercent=60;finishAtMillis=0;lastEvent=g("none","Listo",0);motionEventId=0;nowMillis=0;owners=new Int16Array(Zt).fill(-1);phase="waiting";players=[];readyGate;readyZones=[];recentClaim=null;rng;startedAtMillis=0;targets=[];winnerIndex=-1;constructor(e){this.config=B(e,Mt),this.rng=j(this.config.seed),this.readyZones=jo(this.config.playerCount),this.readyGate=W(Mt.start,this.readyZones,this.config.nowMillis),this.resetGame(this.config.nowMillis)}init(e){return this.resetGame(e),this.lastEvent=g("ready",this.waitingMessage(),e),[this.lastEvent]}press(e){if(this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting")return this.recordEvents(this.applyReadyTransition(this.readyGate.update(e),e.atMillis));if(this.phase!=="running"||!e.pressed||!sa(e.x,e.y))return[];let a=this.claimTile(e.x,e.y,e.atMillis);return this.recordEvents(a?[a]:[])}release(e){return this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting"?this.recordEvents(this.applyReadyTransition(this.readyGate.update({...e,pressed:!1}),e.atMillis)):[]}tick(e){return this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting"?this.recordEvents(this.applyReadyTransition(this.readyGate.tick(e.atMillis),e.atMillis)):this.phase==="finished"&&e.atMillis-this.finishAtMillis>=qo?(this.resetGame(e.atMillis),this.recordEvents([g("ready","Nuevo duelo",e.atMillis)])):[]}render(){let e=J(D2);return this.phase==="waiting"?this.drawWaiting(e):this.phase==="starting"?this.drawStarting(e):this.phase==="running"?this.drawBoard(e):this.drawVictory(e),e}snapshot(){let e=this.readyGate.state(this.nowMillis),a=this.playerProgress(),i=a.reduce((d,p)=>!d||p.progress>d.progress||p.progress===d.progress&&p.index<d.index?p:d,void 0),l=i&&a.filter(d=>d.progress===i.progress).length===1?i:void 0,n=this.claims.reduce((d,p)=>d+p,0),s=this.targets.reduce((d,p)=>d+p,0),r=this.players[this.winnerIndex],o=this.phase==="finished"?this.finishAtMillis:this.nowMillis,u=this.recentClaim?this.nowMillis-this.recentClaim.atMillis:Number.POSITIVE_INFINITY;return{currentGame:Mt.id,label:Mt.label,phase:this.phase,playerCount:this.config.playerCount,players:this.players.map((d,p)=>({...d,score:this.claims[p]??0})),score:Math.max(0,...this.claims),lives:-1,elapsedMillis:this.phase==="waiting"||this.phase==="starting"?0:Math.max(0,o-this.startedAtMillis),remainingMillis:this.phase==="finished"?Math.max(0,this.finishAtMillis+qo-this.nowMillis):0,activeTargets:s-n,success:this.winnerIndex>=0,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?e.countdownMillis:0,readyPlayers:e.readyPlayers,requiredPlayers:e.requiredPlayers,matchTarget:Math.max(0,...this.targets),claimedTargets:n,fillPercent:this.fillPercent,leaderIndex:l?.index??-1,leaderLabel:l?.label??"-",motionEventId:this.motionEventId,playerProgress:a,readyPlayerIndices:this.players.filter((d,p)=>this.readyGate.zoneReady(p,this.nowMillis)).map(d=>d.index),recentClaim:this.recentClaim&&u<ev?{playerIndex:this.recentClaim.playerIndex,remainingMillis:ev-u,x:this.recentClaim.x,y:this.recentClaim.y}:null,remainingTargets:s-n,totalTargets:s,winnerIndex:this.winnerIndex,winnerLabel:r?.label??""}}reset(e={}){this.config=B({...this.config,...e},Mt),this.readyZones=jo(this.config.playerCount),this.readyGate=W(Mt.start,this.readyZones,this.config.nowMillis),this.resetGame(this.config.nowMillis),this.lastEvent=g("ready",this.waitingMessage(),this.config.nowMillis)}playerReadyZones(){return this.readyZones.map(e=>({...e}))}targetOwner(e,a){return sa(e,a)?this.owners[a*x+e]??-1:-1}resetGame(e){this.nowMillis=e,this.startedAtMillis=e,this.finishAtMillis=0,this.phase="waiting",this.winnerIndex=-1,this.motionEventId=1,this.recentClaim=null,this.claimed.fill(0),this.claimedAt.fill(0),this.readyGate.reset(e),this.players=this.createPlayers(),this.fillPercent=this.readFillPercent(),this.rng=j(this.config.seed);let a=O2(this.config.playerCount,this.fillPercent,this.rng);this.owners=a.owners,this.targets=a.targets,this.claims=Array.from({length:this.config.playerCount},()=>0),this.lastEvent=g("ready",this.waitingMessage(),e)}createPlayers(){return Array.from({length:this.config.playerCount},(e,a)=>{let i=this.config.players[a],l=Ba[a]??Ba[0],n=i?.color,s=n&&/^#[0-9a-f]{6}$/i.test(n)?n:l,r=String(i?.label||i?.name||`Jugador ${a+1}`).trim();return{index:a,label:r||`Jugador ${a+1}`,color:s,score:0,lives:-1}})}readFillPercent(){let e=je(this.config.options,yn.baseFillPercent);if(this.config.difficulty!=="hard")return Math.round(e);let a=je(this.config.options,yn.hardFillMultiplier);return Math.round(H(e*a,1,100))}applyReadyTransition(e,a){return e==="players-ready"?(this.phase="starting",this.motionEventId+=1,[g("start","Todos en posici\xF3n",a)]):e==="players-left"?(this.phase="waiting",this.motionEventId+=1,[g("ready","Vuelve a tu zona iluminada",a)]):e==="started"?(this.phase="running",this.startedAtMillis=a,this.motionEventId+=1,[g("start","Reclama todas las baldosas de tu color",a)]):[]}claimTile(e,a,i){let l=a*x+e,n=this.owners[l]??-1;if(n<0||n>=this.players.length||this.claimed[l]===1)return;this.claimed[l]=1,this.claimedAt[l]=i,this.claims[n]=(this.claims[n]??0)+1,this.recentClaim={atMillis:i,playerIndex:n,x:e,y:a},this.motionEventId+=1;let s=Math.max(0,(this.targets[n]??0)-(this.claims[n]??0)),r=this.players[n]?.label??`Jugador ${n+1}`;return s===0?(this.phase="finished",this.finishAtMillis=i,this.winnerIndex=n,g("win",`${r} gana el duelo`,i)):g("coin",`${r}: ${s} por reclamar`,i)}recordEvents(e){let a=e.at(-1);return a&&(this.lastEvent=a),e}waitingMessage(){return`Duelo espera a ${this.config.playerCount} jugadores`}playerProgress(){return this.players.map((e,a)=>{let i=this.targets[a]??0,l=this.claims[a]??0;return{claimed:l,color:e.color,index:a,label:e.label,progress:i>0?l/i:0,remaining:Math.max(0,i-l),target:i}})}drawWaiting(e){let a=.5+.5*Math.sin(this.nowMillis/310);this.readyZones.forEach((i,l)=>{let n=this.readyGate.zoneReady(l,this.nowMillis);this.drawReadyZone(e,i,this.players[l]?.color??Ba[0],n,a)}),Ze(e,{color:"#13263a",radius:2+Math.floor(this.nowMillis/180)%20,thickness:.35})}drawStarting(e){let a=Math.floor(this.nowMillis/110);Ne(e,{bandWidth:2,period:8,step:a,color:({distance:i})=>{let l=this.players[Math.floor(i)%this.players.length];return Xo(l?.color??Ba[0],58)}}),this.readyZones.forEach((i,l)=>{this.drawReadyZone(e,i,this.players[l]?.color??Ba[0],!0,1)})}drawReadyZone(e,a,i,l,n){for(let s=a.minY;s<=a.maxY;s+=1)for(let r=a.minX;r<=a.maxX;r+=1){let o=r===a.minX||r===a.maxX||s===a.minY||s===a.maxY,u=l?o?100:78:o?26+n*24:12+n*12;b(e,r,s,Xo(i,u))}}drawBoard(e){let a=this.playerProgress();for(let i=0;i<Zt;i+=1){let l=this.owners[i]??-1;if(l<0)continue;let n=i%x,s=Math.floor(i/x),r=this.players[l]?.color??Ba[0];if(this.claimed[i]===1){let d=this.nowMillis-(this.claimedAt[i]??0);if(d<$0){let p=1-d/$0;b(e,n,s,B2(r,35+p*65))}else b(e,n,s,Xo(r,12));continue}let o=(a[l]?.progress??0)>=.88?16:0,u=.5+.5*Math.sin(this.nowMillis/360+n*.74+s*.18+l);b(e,n,s,Xo(r,58+o+u*24))}}drawVictory(e){let a=this.players[this.winnerIndex]?.color??Ba[0],i=Ef(a),l=Math.max(0,this.nowMillis-this.finishAtMillis);for(let n=0;n<M;n+=1)for(let s=0;s<x;s+=1){let r=.5+.5*Math.sin(l/170+s*.58+n*.19),o=rl(nt(i,48+r*42),nt(Sf,r*16));b(e,s,n,ra(o))}Ne(e,{bandWidth:2,period:9,step:Math.floor(l/90),color:"#ffffff"})}};function O2(t,e,a){let i=Math.round(Zt*e/100),l=Math.max(1,Math.floor(i/t)),n=Array.from({length:t},()=>l),s=new Int16Array(Zt).fill(-1),r=Number.POSITIVE_INFINITY;for(let o=0;o<N2;o+=1){let u=H2(n,a),d=L2(u);d<r&&(r=d,s=u)}return{owners:s,targets:n}}function H2(t,e){let a=new Int16Array(Zt).fill(-1),i=Array.from({length:t.length},()=>0),l=Array.from({length:Zt},(n,s)=>s);for(let n=l.length-1;n>0;n-=1){let s=e.int(n+1);[l[n],l[s]]=[l[s]??0,l[n]??0]}for(let n of l){let s=n%x,r=Math.floor(n/x),o=-1,u=Number.POSITIVE_INFINITY;for(let d=0;d<t.length;d+=1){let p=t[d]??0;if((i[d]??0)>=p)continue;let f=tv(a,s,r,d),y=U2(a,s,r,d),G=av(f)+y*.12+(i[d]??0)/Math.max(p,1)*.2+e.next()*1.35;G<u&&(u=G,o=d)}o>=0&&(a[n]=o,i[o]=(i[o]??0)+1)}return a}function L2(t){let e=0;for(let a=0;a<M;a+=1){let i=-2,l=0;for(let n=0;n<x;n+=1){let s=t[a*x+n]??-1;if(s>=0){let r=tv(t,n,a,s);e+=av(r)+(r>=3?6:0)}s===i&&s>=0?l+=1:(i=s,l=1),i>=0&&l>5&&(e+=(l-5)*7)}}for(let a=0;a<x;a+=1){let i=-2,l=0;for(let n=0;n<M;n+=1){let s=t[n*x+a]??-1;s===i&&s>=0?l+=1:(i=s,l=1),i>=0&&l>5&&(e+=(l-5)*7)}}return e}function tv(t,e,a,i){return[[e-1,a],[e+1,a],[e,a-1],[e,a+1]].filter(([l=-1,n=-1])=>sa(l,n)&&t[n*x+l]===i).length}function U2(t,e,a,i){return[[e-1,a-1],[e+1,a-1],[e-1,a+1],[e+1,a+1]].filter(([l=-1,n=-1])=>sa(l,n)&&t[n*x+l]===i).length}function av(t){return t===0?.85:t===1?0:t===2?.45:4.5}function Ef(t){return/^#[0-9a-f]{6}$/i.test(t)?{r:Number.parseInt(t.slice(1,3),16),g:Number.parseInt(t.slice(3,5),16),b:Number.parseInt(t.slice(5,7),16)}:Sf}function Xo(t,e){return ra(nt(Ef(t),e))}function B2(t,e){let a=H(e,0,100);return ra(rl(nt(Ef(t),100-a),nt(Sf,a)))}var Vo=[{name:"Rojo",color:"#ff3048"},{name:"Cian",color:"#24d9ff"}],Gf=_i({playerCount:2,players:Vo,seed:137,difficulty:"medium"});Gf.init(0);var iv=Gf.render(),lv=Gf.snapshot(),Bs=_i({playerCount:2,players:Vo,seed:137,difficulty:"hard"});Bs.init(0);hv(Bs,100);Bs.tick({atMillis:1100});var nv=Bs.render(),sv=Bs.snapshot(),ul=_i({playerCount:2,players:Vo,seed:137,difficulty:"hard"});ul.init(0);Cf(ul);Zo(ul,0,8,3200);Zo(ul,1,5,3400);ul.tick({atMillis:18700});var rv=ul.render(),ov=ul.snapshot(),F2=[{name:"Alejandra del Equipo Rel\xE1mpago",color:"#ff3048"},{name:"Bruno",color:"#24d9ff"},{name:"Carolina",color:"#42e879"},{name:"Diego",color:"#ff4fd8"},{name:"Elena",color:"#376bff"},{name:"Fernando",color:"#ffd84d"},{name:"Gabriela",color:"#a66cff"},{name:"Hugo",color:"#ff8a3d"}],vn=_i({playerCount:8,players:F2,seed:2026,difficulty:"medium"});vn.init(0);Cf(vn);for(let t=0;t<8;t+=1)Zo(vn,t,t+1,3200+t*50);vn.tick({atMillis:48230});var uv=vn.render(),cv=vn.snapshot(),bn=_i({playerCount:2,players:Vo,seed:137,difficulty:"medium",options:{base_fill_percent:30}});bn.init(0);Cf(bn);Zo(bn,1,Number.POSITIVE_INFINITY,3200);bn.tick({atMillis:4200});var dv=bn.render(),fv=bn.snapshot();function hv(t,e){t.playerReadyZones().forEach(a=>{t.press({x:a.minX,y:a.minY,pressed:!0,atMillis:e})})}function Cf(t){hv(t,100),t.tick({atMillis:3100})}function Zo(t,e,a,i){let l=0;for(let n=0;n<32&&l<a;n+=1)for(let s=0;s<16&&l<a;s+=1)t.targetOwner(s,n)===e&&(t.press({x:s,y:n,pressed:!0,atMillis:i+l}),l+=1)}var Nf={};Je(Nf,{PlayerDisplay:()=>mv,createGame:()=>xn,damagedFrame:()=>Cv,damagedSnapshot:()=>Tv,hazardColor:()=>Io,helloWorldCelebrationMillis:()=>Xs,helloWorldHazards:()=>qs,helloWorldStartingLives:()=>Ys,helloWorldTargetScore:()=>Mn,helloWorldTargets:()=>Qo,idleColor:()=>zf,initEvents:()=>yv,losingFrame:()=>Av,losingSnapshot:()=>zv,manifest:()=>ca,runningFrame:()=>Sv,runningSnapshot:()=>Ev,startingFrame:()=>bv,startingSnapshot:()=>Mv,targetColor:()=>Fs,trailColor:()=>Af,waitingFrame:()=>gv,waitingSnapshot:()=>vv,winningFrame:()=>wv,winningSnapshot:()=>Rv});var Ie=F(Q(),1);function mv({snapshot:t,frame:e}){let a=t.matchTarget??5,i=t.phase==="finished",l=i?t.success?"is-result-win":"is-result-lose":"",n=t.success?"green":t.lastEventCue==="fail"?"red":"cyan",s=Math.max(1,Math.ceil(t.celebrationMillis/1e3)),r=i?(0,Ie.jsxs)("span",{className:"hello-world-result-copy",children:[(0,Ie.jsx)("span",{children:t.success?"\xA1Ganaste!":t.lastEventMessage}),(0,Ie.jsxs)("small",{children:["Reinicio en ",s]})]}):t.lastEventMessage||"Verde suma, rojo resta una vida";return(0,Ie.jsx)(se,{title:t.label,phase:t.phase,children:(0,Ie.jsxs)("div",{className:`ml-solo-display hello-world-display ${l}`.trim(),children:[(0,Ie.jsx)(Le,{snapshot:t}),(0,Ie.jsxs)("div",{className:"ml-solo-summary",children:[(0,Ie.jsxs)(Me,{columns:3,className:"ml-solo-number-row",children:[(0,Ie.jsx)(A,{label:"Meta",tone:"green",value:`${t.score}/${a}`}),(0,Ie.jsx)(A,{label:"Vidas",tone:"red",value:(0,Ie.jsx)(Ut,{lives:t.lives,maxLives:t.maxLives})}),(0,Ie.jsx)(A,{label:"Tiempo",tone:"yellow",value:$(t.remainingMillis)})]}),(0,Ie.jsx)(A,{className:"ml-solo-message",label:i?t.success?"Victoria":"Fin de la partida":"Estado",tone:n,value:r})]}),e?(0,Ie.jsx)(qe,{className:"ml-solo-floor",frame:e,label:"Recorrido en el suelo"}):null]})})}var ca={id:"hello-world",label:"Hola Mundo",description:"Sigue los objetivos verdes y evita las baldosas rojas.",availability:{development:!0,production:!1},catalog:{category:"individual",color:"#35d7ff",durationLabel:"30s",modeLabel:"Demostraci\xF3n",audioLabel:"Efectos",rules:["Sigue los objetivos verdes","Evita las baldosas rojas"]},players:{allowAny:!0,min:1,max:1},start:{mode:"player-ready"},defaultDurationMillis:3e4,display:{entry:"./display"},preview:{seed:2024,playerCount:1,actions:[{atMillis:100,type:"press",x:8,y:16},{atMillis:2150,type:"release",x:8,y:16},{atMillis:2300,type:"press",x:4,y:4},{atMillis:2320,type:"release",x:4,y:4}],captureStartMillis:2200,frameCount:18,frameIntervalMillis:120},tags:["example","ci","typescript"]};var Fs="#7ee787",Io="#ff2036",Af="#1f6feb",zf="#05070a",Mn=5,Ys=3,Xs=5e3,wf=[{x:3,y:5},{x:12,y:5},{x:8,y:16},{x:3,y:26},{x:12,y:26}],pv=[{x:12,y:15},{x:4,y:15},{x:8,y:28}];function xn(t){return new Rf(t)}var Rf=class{config;finishedAtMillis;hazardsHit=0;lastEvent=g("none","Listo",0);lives=Ys;nowMillis=0;phase="ready";players;readyGate;score=0;startedAtMillis=0;constructor(e){this.config=B(e,ca),this.readyGate=W(ca.start,mn(1),this.config.nowMillis),this.players=this.scoredPlayers()}init(e){return this.resetState(e),[this.lastEvent]}press(e){if(this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting")return this.applyReadyTransition(this.readyGate.update(e),e.atMillis);if(this.phase!=="running"||!e.pressed)return[];let a=this.currentHazard();if(a&&e.x===a.x&&e.y===a.y)return this.loseLife(e.atMillis);let i=this.currentTarget();return!i||e.x!==i.x||e.y!==i.y?[]:(this.score+=1,this.players=this.scoredPlayers(),this.score>=Mn?this.finishGame(!0,"\xA1Hola Mundo!",e.atMillis):(this.lastEvent=g("hit",`Hola ${this.score}`,e.atMillis),[this.lastEvent]))}release(e){return this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update({...e,pressed:!1}),e.atMillis):[]}tick(e){if(this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting")return this.applyReadyTransition(this.readyGate.tick(e.atMillis),e.atMillis);if(this.phase==="finished"){let a=this.finishedAtMillis??e.atMillis;return e.atMillis-a<Xs?[]:(this.resetState(e.atMillis),[this.lastEvent])}return this.phase!=="running"||this.remainingMillis()>0?[]:this.finishGame(!1,"Tiempo agotado",e.atMillis)}render(){let e=J(zf);if(this.phase==="waiting"||this.phase==="starting")return this.drawPlayerStart(e),e;for(let l of wf.slice(0,this.score))b(e,l.x,l.y,Af);if(this.phase==="finished")return this.drawResultAnimation(e),e;let a=this.currentTarget();a&&(z(e,a.x-1,a.y-1,3,3,Fs),b(e,a.x,a.y,"#ffffff"));let i=this.currentHazard();return i&&b(e,i.x,i.y,Io),e}snapshot(){let e=this.readyGate.state(this.nowMillis);return{currentGame:ca.id,label:ca.label,phase:this.phase,playerCount:this.config.playerCount,players:this.players,score:this.score,lives:this.lives,maxLives:Ys,elapsedMillis:this.elapsedMillis(),remainingMillis:this.remainingMillis(),activeTargets:this.phase==="running"?+!!this.currentTarget()+ +!!this.currentHazard():0,success:this.phase==="finished"&&this.score>=Mn,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?e.countdownMillis:0,readyPlayers:e.readyPlayers,requiredPlayers:e.requiredPlayers,matchTarget:Mn,celebrationDurationMillis:Xs,celebrationMillis:this.celebrationMillis(),hazard:this.phase==="running"?this.currentHazard():void 0}}reset(e={}){this.config=B({...this.config,...e},ca),this.resetState(this.config.nowMillis)}applyReadyTransition(e,a){return e==="players-ready"?(this.phase="starting",this.lastEvent=g("ready","Jugador listo",a),[this.lastEvent]):e==="players-left"?(this.phase="waiting",this.lastEvent=g("ready","Vuelve a la zona iluminada",a),[this.lastEvent]):e==="started"?(this.phase="running",this.startedAtMillis=a,this.lastEvent=g("start","Verde suma, rojo resta una vida",a),[this.lastEvent]):[]}celebrationMillis(){return this.phase!=="finished"||this.finishedAtMillis===void 0?0:Math.max(0,Xs-(this.nowMillis-this.finishedAtMillis))}currentHazard(){return pv[this.hazardsHit]}currentTarget(){return wf[this.score]}drawPlayerStart(e){let a=Math.floor(x/2),i=Math.floor(M/2),l=Math.floor(this.nowMillis/(this.phase==="starting"?110:180)),n=this.phase==="starting"?"#ffe176":Fs,s=this.phase==="starting"?2+l%10:3+l%4;Ze(e,{centerX:a,centerY:i,color:n,radius:s})}drawResultAnimation(e){let a=Math.floor((this.nowMillis-(this.finishedAtMillis??this.nowMillis))/140);if(this.score>=Mn){Ne(e,{color:({x:l,y:n})=>(l+n+a)%3===0?"#ffffff":Fs,step:a});return}for(let l=0;l<M;l+=1)for(let n=0;n<x;n+=1)((n+l+a)%8<=1||(n-l-a+64)%11===0)&&b(e,n,l,(n+a)%4===0?"#ff8090":Io)}elapsedMillis(){if(this.phase==="waiting"||this.phase==="starting")return 0;let e=this.phase==="finished"&&this.finishedAtMillis!==void 0?this.finishedAtMillis:this.nowMillis;return Math.max(0,e-this.startedAtMillis)}finishGame(e,a,i){return this.phase="finished",this.finishedAtMillis=i,this.lastEvent=g(e?"win":"fail",a,i),[this.lastEvent]}loseLife(e){return this.lives-=1,this.hazardsHit+=1,this.lives<=0?this.finishGame(!1,"Sin vidas",e):(this.lastEvent=g("fail",`Vida perdida, quedan ${this.lives}`,e),[this.lastEvent])}remainingMillis(){return Math.max(0,this.config.durationMillis-this.elapsedMillis())}resetState(e){this.readyGate.reset(e),this.finishedAtMillis=void 0,this.hazardsHit=0,this.lastEvent=g("ready","Esperando jugador",e),this.lives=Ys,this.nowMillis=e,this.phase="waiting",this.score=0,this.startedAtMillis=e,this.players=this.scoredPlayers()}scoredPlayers(){return Ee(this.config.playerCount,this.config.players).map(e=>({...e,score:this.score}))}};function qs(){return pv.map(t=>({...t}))}function Qo(){return wf.map(t=>({...t}))}var Pf=xn({seed:2024,playerCount:1,durationMillis:3e4}),yv=Pf.init(0),gv=Pf.render(),vv=Pf.snapshot(),js=xn({seed:2024,playerCount:1,durationMillis:3e4});js.init(0);js.press({x:8,y:16,pressed:!0,atMillis:100});js.tick({atMillis:1100});var bv=js.render(),Mv=js.snapshot(),xv=Jo(),Sv=xv.render(),Ev=xv.snapshot(),_f=Jo(),Gv=qs()[0];if(!Gv)throw new Error("Hola Mundo requires at least one hazard fixture.");_f.press({...Gv,pressed:!0,atMillis:2200});var Cv=_f.render(),Tv=_f.snapshot(),ko=Jo();Qo().forEach((t,e)=>{ko.press({...t,pressed:!0,atMillis:2200+e*100})});ko.tick({atMillis:4100});var wv=ko.render(),Rv=ko.snapshot(),Ko=Jo();qs().forEach((t,e)=>{Ko.press({...t,pressed:!0,atMillis:2200+e*100})});Ko.tick({atMillis:4100});var Av=Ko.render(),zv=Ko.snapshot();function Jo(){let t=xn({seed:2024,playerCount:1,durationMillis:3e4});return t.init(0),t.press({x:8,y:16,pressed:!0,atMillis:100}),t.tick({atMillis:2100}),t}var Hf={};Je(Hf,{PlayerDisplay:()=>Pv,createGame:()=>eu,damagedFrame:()=>Lv,damagedSnapshot:()=>Uv,initEvents:()=>_v,lavaCelebrationMillis:()=>$o,lavaDamageImmunityMillis:()=>Of,lavaStartingLives:()=>Vs,manifest:()=>da,runningFrame:()=>Ov,runningSnapshot:()=>Hv,startingSnapshot:()=>Dv,waitingSnapshot:()=>Nv});var xt=F(Q(),1);function Pv({snapshot:t,frame:e}){return(0,xt.jsx)(se,{title:t.label,phase:t.phase,children:(0,xt.jsxs)("div",{className:"ml-solo-display",children:[(0,xt.jsx)(Le,{snapshot:t}),(0,xt.jsxs)("div",{className:"ml-solo-summary",children:[(0,xt.jsxs)(Me,{columns:3,className:"ml-solo-number-row",children:[(0,xt.jsx)(A,{label:"Plataformas",tone:"green",value:t.score}),(0,xt.jsx)(A,{label:"Tiempo",tone:"cyan",value:$(t.remainingMillis)}),(0,xt.jsx)(A,{label:"Vidas",tone:"red",value:(0,xt.jsx)(Ut,{lives:t.lives,maxLives:t.maxLives})})]}),(0,xt.jsx)(A,{className:"ml-solo-message",label:"Equipo",tone:t.success?"green":t.lives===0?"red":"yellow",value:t.lastEventMessage||"Pisa solo las plataformas verdes"})]}),e?(0,xt.jsx)(qe,{className:"ml-solo-floor",frame:e,label:"Lava en el suelo"}):null]})})}var da={id:"lava",label:"El suelo es lava",description:"Moveos en equipo, evitad la lava y conquistad plataformas seguras durante un minuto.",availability:{development:!0,production:!0},catalog:{category:"team",color:"#ff5268",durationLabel:"60s",modeLabel:"Plataformas",audioLabel:"M\xFAsica + efectos",rules:["Espera en la zona azul","Pisa las plataformas verdes","Evita la lava roja durante un minuto"]},players:{allowAny:!0,min:1,max:6},start:{mode:"player-ready",releaseGraceMillis:1500},defaultDurationMillis:6e4,config:{difficulty:{options:["easy","medium","hard","expert"],default:"medium"}},display:{entry:"./display"},preview:{seed:137,playerCount:0,difficulty:"medium",actions:[{atMillis:100,type:"press",x:8,y:16}],captureStartMillis:4e3,frameCount:24,frameIntervalMillis:120},tags:["lava","cooperativo","typescript"]};var Vs=3,$o=5e3,Of=1e3,Wo={easy:{speed:2,width:4,height:3,spawnMillis:2400},medium:{speed:2.6,width:3,height:3,spawnMillis:2e3},hard:{speed:3.2,width:3,height:2,spawnMillis:1650},expert:{speed:4,width:2,height:2,spawnMillis:1350}};function eu(t){return new Df(t)}var Df=class{config;finishedAtMillis;lastDamageAtMillis=Number.NEGATIVE_INFINITY;lastEvent=g("none","Listo",0);lives=Vs;nextPlatformId=1;nextSpawnAtMillis=0;nowMillis=0;phase="ready";platforms=[];players;readyGate;rng;score=0;startedAtMillis=0;constructor(e){this.config=B(e,da),this.readyGate=W(da.start,[{minX:5,maxX:10,minY:13,maxY:18}],this.config.nowMillis),this.rng=j(this.config.seed),this.players=this.scoredPlayers()}init(e){return this.resetState(e),[this.lastEvent]}press(e){if(this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting")return this.applyReadyTransition(this.readyGate.update(e),e.atMillis);if(this.phase!=="running"||!e.pressed)return[];this.advancePlatforms(e.atMillis);let a=this.visiblePlatforms().find(i=>Y2(e,i));return a?(this.platforms=this.platforms.filter(i=>i.id!==a.id),this.score+=1,this.players=this.scoredPlayers(),this.lastEvent=g("coin",`Plataforma ${this.score}`,e.atMillis),[this.lastEvent]):e.atMillis-this.lastDamageAtMillis<Of?[]:(this.lastDamageAtMillis=e.atMillis,this.lives-=1,this.players=this.scoredPlayers(),this.lives<=0?this.finish(!1,"La lava os ha alcanzado",e.atMillis):(this.lastEvent=g("damage",`Vida perdida, quedan ${this.lives}`,e.atMillis),[this.lastEvent]))}release(e){return this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update({...e,pressed:!1}),e.atMillis):[]}tick(e){return this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.tick(e.atMillis),e.atMillis):this.phase==="finished"?e.atMillis-(this.finishedAtMillis??e.atMillis)>=$o?(this.resetState(e.atMillis),[this.lastEvent]):[]:(this.advancePlatforms(e.atMillis),this.phase==="running"&&this.remainingMillis()===0?this.finish(!0,`${this.score} plataformas seguras`,e.atMillis):[])}render(){let e=J("#8e0b1d");if(this.phase==="waiting"||this.phase==="starting"){let i=Math.floor(this.nowMillis/(this.phase==="starting"?100:180));return Ze(e,{centerX:8,centerY:16,radius:2+i%8,color:this.phase==="starting"?"#ffe176":"#22d3ee"}),e}let a=Math.floor(this.nowMillis/160);for(let i=0;i<M;i+=1)for(let l=0;l<x;l+=1)b(e,l,i,(l*5+i+a)%13<3?"#ff5a1f":"#b20d21");for(let i of this.visiblePlatforms())z(e,i.x,i.y,i.width,i.height,"#39e77d");return this.phase==="finished"&&Ne(e,{color:this.lives>0?"#39e77d":"#ff334e",step:Math.floor((this.nowMillis-(this.finishedAtMillis??this.nowMillis))/140)}),e}snapshot(){let e=this.readyGate.state(this.nowMillis);return{currentGame:da.id,label:da.label,phase:this.phase,playerCount:this.config.playerCount,players:this.players,score:this.score,lives:this.lives,maxLives:Vs,elapsedMillis:this.elapsedMillis(),remainingMillis:this.remainingMillis(),activeTargets:this.phase==="running"?this.visiblePlatforms().length:0,success:this.phase==="finished"&&this.lives>0,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?e.countdownMillis:0,readyPlayers:e.readyPlayers,requiredPlayers:e.requiredPlayers,safePlatforms:this.visiblePlatforms(),celebrationMillis:this.phase==="finished"?Math.max(0,$o-(this.nowMillis-(this.finishedAtMillis??this.nowMillis))):0}}reset(e={}){this.config=B({...this.config,...e},da),this.resetState(this.config.nowMillis)}advancePlatforms(e){if(this.phase!=="running")return;let a=Wo[this.config.difficulty]??Wo.medium;for(;e>=this.nextSpawnAtMillis;)this.platforms.push({id:this.nextPlatformId++,bornMillis:this.nextSpawnAtMillis,width:a.width,height:a.height,x:this.rng.range(0,x-a.width)}),this.nextSpawnAtMillis+=a.spawnMillis;this.platforms=this.platforms.filter(i=>this.platformY(i)<M)}applyReadyTransition(e,a){if(e==="players-ready")this.phase="starting",this.lastEvent=g("ready","Equipo listo",a);else if(e==="players-left")this.phase="waiting",this.lastEvent=g("ready","Vuelve a la zona azul",a);else if(e==="started")this.phase="running",this.startedAtMillis=a,this.nextSpawnAtMillis=a,this.advancePlatforms(a),this.lastEvent=g("start","Pisa solo las plataformas verdes",a);else return[];return[this.lastEvent]}elapsedMillis(){return this.phase==="waiting"||this.phase==="starting"?0:Math.max(0,(this.finishedAtMillis??this.nowMillis)-this.startedAtMillis)}finish(e,a,i){return this.phase="finished",this.finishedAtMillis=i,this.lastEvent=g(e?"win":"fail",a,i),[this.lastEvent]}platformY(e){let a=(Wo[this.config.difficulty]??Wo.medium).speed;return Math.floor((this.nowMillis-e.bornMillis)*a/1e3)-e.height}remainingMillis(){return Math.max(0,this.config.durationMillis-this.elapsedMillis())}resetState(e){this.readyGate.reset(e),this.finishedAtMillis=void 0,this.lastDamageAtMillis=Number.NEGATIVE_INFINITY,this.lastEvent=g("ready","Espera en la zona azul",e),this.lives=Vs,this.nextPlatformId=1,this.nextSpawnAtMillis=e,this.nowMillis=e,this.phase="waiting",this.platforms=[],this.rng=j(this.config.seed),this.score=0,this.startedAtMillis=e,this.players=this.scoredPlayers()}scoredPlayers(){return Ee(this.config.playerCount,this.config.players).map(e=>({...e,score:this.score,lives:this.lives}))}visiblePlatforms(){return this.platforms.map(e=>({id:e.id,x:e.x,y:this.platformY(e),width:e.width,height:e.height})).filter(e=>e.y+e.height>0&&e.y<M)}};function Y2(t,e){return t.x>=e.x&&t.x<e.x+e.width&&t.y>=e.y&&t.y<e.y+e.height}var It=eu({playerCount:0,seed:137,difficulty:"medium"}),_v=It.init(0),Nv=It.snapshot();It.press({x:8,y:16,pressed:!0,atMillis:100});var Dv=It.snapshot();It.tick({atMillis:2100});It.tick({atMillis:4e3});var Ov=It.render(),Hv=It.snapshot();It.press({x:0,y:31,pressed:!0,atMillis:4100});var Lv=It.render(),Uv=It.snapshot();var Xf={};Je(Xf,{PlayerDisplay:()=>Bv,createGame:()=>tu,failedFrame:()=>t1,failedSnapshot:()=>a1,finishedFrame:()=>i1,finishedSnapshot:()=>l1,laneLayout:()=>Uf,manifest:()=>Qt,memorizingFrame:()=>Jv,memorizingSnapshot:()=>Wv,recallingFrame:()=>$v,recallingSnapshot:()=>e1,startingFrame:()=>Qv,startingSnapshot:()=>kv,waitingFrame:()=>Vv,waitingSnapshot:()=>Zv});var k=F(Q(),1);function Bv({snapshot:t}){let e=Math.max(1,Math.ceil((t.countdownMillis??0)/1e3)),a=q2(t,e);return(0,k.jsx)(se,{title:t.label,phase:t.phase,children:(0,k.jsxs)("div",{className:`memory-challenge-display is-phase-${t.phase} is-stage-${t.memoryStage}`,children:[(0,k.jsxs)("section",{className:"memory-challenge-hero",children:[(0,k.jsxs)("div",{children:[(0,k.jsx)("span",{children:a.eyebrow}),(0,k.jsx)("strong",{children:a.title}),(0,k.jsx)("b",{children:a.caption})]}),(0,k.jsxs)("article",{children:[(0,k.jsx)("span",{children:"Tiempo"}),(0,k.jsx)("strong",{children:$(t.remainingMillis)})]}),(0,k.jsxs)("article",{children:[(0,k.jsx)("span",{children:"Mejor camino"}),(0,k.jsx)("strong",{children:t.score})]})]}),(0,k.jsx)("section",{className:"memory-challenge-players",style:{"--memory-columns":t.playerCount},children:t.playerProgress.map(i=>(0,k.jsx)(X2,{player:i,ready:t.readyPlayerIndices.includes(i.index),winner:t.winnerIndex===i.index},i.index))}),(0,k.jsxs)("footer",{className:"memory-challenge-event",children:[(0,k.jsx)("span",{children:t.phase==="finished"?"Resultado":"\xDAltimo evento"}),(0,k.jsx)("strong",{children:t.lastEventMessage},t.motionEventId),(0,k.jsx)("b",{children:t.phase==="running"?j2(t):`${t.readyPlayers}/${t.requiredPlayers} listos`})]})]})})}function X2({player:t,ready:e,winner:a}){let i=t.pathLength===0?0:t.bestProgress/t.pathLength,l={"--memory-player":t.color,"--memory-player-rgb":V2(t.color),"--memory-progress":i},n=a?"Ganador":t.status==="failed"?"Vuelve al inicio":t.status==="memorizing"?"Memoriza":e?"Listo":"En carrera";return(0,k.jsxs)("article",{className:`memory-challenge-player is-${t.status}${a?" is-winner":""}`,style:l,children:[(0,k.jsxs)("header",{children:[(0,k.jsx)("i",{}),(0,k.jsx)("strong",{children:t.label}),(0,k.jsx)("b",{children:n})]}),(0,k.jsxs)("div",{className:"memory-challenge-score",children:[(0,k.jsx)("strong",{children:t.bestProgress}),(0,k.jsxs)("span",{children:["de ",t.pathLength," baldosas"]})]}),(0,k.jsx)("div",{className:"memory-challenge-track",children:(0,k.jsx)("i",{})}),(0,k.jsxs)("footer",{children:[(0,k.jsx)("span",{children:"Avance actual"}),(0,k.jsxs)("strong",{children:[Math.round(i*100),"%"]})]})]})}function q2(t,e){return t.phase==="waiting"?{eyebrow:`Listos ${t.readyPlayers}/${t.requiredPlayers}`,title:"Busca tu salida",caption:"Cada jugador ocupa la zona iluminada de su calle"}:t.phase==="starting"?{eyebrow:"Todos listos",title:String(e),caption:"Mira bien: tu camino aparecer\xE1 enseguida"}:t.phase==="finished"?t.winnerIndex>=0?{eyebrow:"Camino completado",title:`\xA1Gana ${t.winnerLabel}!`,caption:"La ruta vencedora vuelve a iluminarse"}:{eyebrow:"Tiempo agotado",title:"La lava gana",caption:"Nueva carrera en unos segundos"}:t.memoryStage==="memorize"?{eyebrow:`Oculto en ${$(t.stageMillis)}`,title:"Memoriza tu camino",caption:"Sigue el color desde tu salida hasta el final"}:{eyebrow:"Camino oculto",title:"Avanza de memoria",caption:"Si fallas, vuelve a tu salida para ver la ruta otra vez"}}function j2(t){return t.memoryStage==="memorize"?`Se oculta en ${$(t.stageMillis)}`:"Camino oculto"}function V2(t){return/^#[0-9a-f]{6}$/i.test(t)?[1,3,5].map(e=>Number.parseInt(t.slice(e,e+2),16)).join(", "):"255, 255, 255"}var Qt={id:"memory-challenge",label:"Reto de memoria",description:"Memoriza un camino oculto en tu calle y rec\xF3rrelo antes que los dem\xE1s sin pisar la lava.",availability:{development:!0,production:!0},catalog:{category:"team",color:"#005af8",durationLabel:"90 s",modeLabel:"Camino oculto",audioLabel:"M\xFAsica + efectos",rules:["Cada jugador ocupa la salida de su calle","Memoriza el camino iluminado antes de que desaparezca","Si pisas la lava, vuelve a tu salida para intentarlo otra vez"]},players:{allowAny:!1,min:1,max:4},start:{mode:"player-ready",releaseGraceMillis:1200},defaultDurationMillis:9e4,display:{entry:"./display"},preview:{seed:137,playerCount:2,actions:[{atMillis:100,type:"press",x:3,y:0},{atMillis:100,type:"press",x:11,y:0}],captureStartMillis:2200,frameCount:18,frameIntervalMillis:120},tags:["memory","race","multiplayer","typescript"]};var Z2=2800,I2=1500,Fv=4e3,qv=2,Q2="#120301",k2="#8f1a08",Yv="#ff6b22",Xv="#ffffff";function tu(t){return new Lf(t)}var Lf=class{config;rng;lanes=[];readyZones=[];readyGate;players=[];phase="waiting";memoryStage="memorize";nowMillis=0;startedAtMillis=0;stageEndsAtMillis=0;finishAtMillis=0;winnerIndex=-1;motionEventId=0;lastEvent=g("none","Listo",0);constructor(e){this.config=B(e,Qt),this.rng=j(this.config.seed),this.rebuildBoard(),this.readyGate=W(Qt.start,this.readyZones,this.config.nowMillis),this.resetState(this.config.nowMillis)}init(e){return this.resetState(e),this.lastEvent=g("ready","Busca tu salida iluminada",e),[this.lastEvent]}press(e){if(this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting")return this.record(this.applyReadyTransition(this.readyGate.update(e),e.atMillis));if(this.phase!=="running"||!e.pressed)return[];let a=this.playerForPoint(e.x,e.y);if(a<0)return[];let i=this.players[a];if(!i)return[];if(i.status==="failed")return this.contains(this.readyZones[a],e.x,e.y)?(i.status="memorizing",i.progress=0,i.revealUntilMillis=e.atMillis+I2,this.motionEventId+=1,this.record([g("start",`${i.label} vuelve a memorizar`,e.atMillis)])):[];if(i.status==="finished"||this.memoryStage==="memorize")return[];let l=i.path[i.progress];if(l?.x===e.x&&l.y===e.y){if(i.progress+=1,i.bestProgress=Math.max(i.bestProgress,i.progress),i.status="recalling",this.motionEventId+=1,i.progress>=i.pathLength)return this.finishWin(a,e.atMillis);let n=i.progress===1||i.progress%5===0?"coin":"hit";return this.record([g(n,`${i.label}: ${i.progress} de ${i.pathLength}`,e.atMillis)])}return i.path.slice(0,i.progress).some(n=>n.x===e.x&&n.y===e.y)?[]:(i.status="failed",i.progress=0,i.revealUntilMillis=0,this.motionEventId+=1,this.record([g("damage",`${i.label} pis\xF3 la lava`,e.atMillis)]))}release(e){return this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting"?this.record(this.applyReadyTransition(this.readyGate.update({...e,pressed:!1}),e.atMillis)):[]}tick(e){if(this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting")return this.record(this.applyReadyTransition(this.readyGate.tick(e.atMillis),e.atMillis));if(this.phase==="finished")return e.atMillis-this.finishAtMillis>=Fv?(this.resetState(e.atMillis),this.record([g("ready","Nueva carrera de memoria",e.atMillis)])):[];if(this.memoryStage==="memorize"&&e.atMillis>=this.stageEndsAtMillis){this.memoryStage="recall";for(let a of this.players)a.status="recalling";return this.motionEventId+=1,this.record([g("start","Los caminos se han ocultado",e.atMillis)])}return this.remainingMillis()<=0?this.finishLoss(e.atMillis):[]}render(){let e=J("#05070a");if(this.drawLava(e),this.drawLaneBorders(e),this.phase==="waiting"||this.phase==="starting")return this.drawReadiness(e),e;if(this.phase==="finished")return this.drawFinished(e),e;for(let a of this.players){this.drawStart(e,a);let i=this.memoryStage==="memorize"||a.status==="failed"||this.nowMillis<a.revealUntilMillis;a.path.forEach((n,s)=>{(s<a.progress||i)&&b(e,n.x,n.y,a.status==="failed"?Yv:a.color)});let l=a.path[a.progress];l&&a.status==="recalling"&&!i&&Math.floor(this.nowMillis/220)%2===0&&b(e,l.x,l.y,"#211008")}return e}snapshot(){let e=this.readyGate.state(this.nowMillis),a=this.readyZones.flatMap((l,n)=>this.readyGate.zoneReady(n,this.nowMillis)?[n]:[]),i=Math.max(0,...this.players.map(l=>l.bestProgress));return{currentGame:Qt.id,label:Qt.label,phase:this.phase,playerCount:this.config.playerCount,players:this.players.map(l=>({index:l.index,label:l.label,color:l.color,score:l.bestProgress,lives:-1})),score:i,lives:-1,elapsedMillis:this.elapsedMillis(),remainingMillis:this.phase==="finished"?Math.max(0,this.finishAtMillis+Fv-this.nowMillis):this.remainingMillis(),activeTargets:this.phase==="running"?this.players.filter(l=>l.status!=="finished").length:0,success:this.winnerIndex>=0,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?e.countdownMillis:0,readyPlayers:e.readyPlayers,requiredPlayers:e.requiredPlayers,matchTarget:Math.max(0,...this.players.map(l=>l.pathLength)),memoryStage:this.memoryStage,stageMillis:this.memoryStage==="memorize"?Math.max(0,this.stageEndsAtMillis-this.nowMillis):0,winnerIndex:this.winnerIndex,winnerLabel:this.players[this.winnerIndex]?.label??"",playerProgress:this.players.map(({revealUntilMillis:l,path:n,...s})=>({...s})),paths:this.players.map(l=>l.path.map(n=>({...n}))),readyPlayerIndices:a,motionEventId:this.motionEventId}}reset(e={}){this.config=B({...this.config,...e},Qt),this.rng=j(this.config.seed),this.rebuildBoard(),this.readyGate=W(Qt.start,this.readyZones,this.config.nowMillis),this.resetState(this.config.nowMillis)}pathForPlayer(e){return this.players[e]?.path.map(a=>({...a}))??[]}playerReadyZones(){return this.readyZones.map(e=>({...e}))}rebuildBoard(){this.lanes=Uf(this.config.playerCount),this.readyZones=this.lanes.map(a=>{let i=Math.min(4,a.width),l=a.x+Math.floor((a.width-i)/2);return{minX:l,maxX:l+i-1,minY:0,maxY:qv-1}});let e=Ee(this.config.playerCount,this.config.players);this.players=e.map((a,i)=>{let l=K2(this.rng,this.lanes[i],this.readyZones[i]),n=a.label===`Player ${i+1}`?`Jugador ${i+1}`:a.label;return{index:i,label:n,color:a.color,progress:0,bestProgress:0,pathLength:l.length,status:"memorizing",path:l,revealUntilMillis:0}})}resetState(e){this.rng=j(this.config.seed),this.rebuildBoard(),this.readyGate.reset(e),this.phase="waiting",this.memoryStage="memorize",this.nowMillis=e,this.startedAtMillis=e,this.stageEndsAtMillis=0,this.finishAtMillis=0,this.winnerIndex=-1,this.motionEventId=0,this.lastEvent=g("ready","Busca tu salida iluminada",e)}applyReadyTransition(e,a){return e==="players-ready"?(this.phase="starting",this.motionEventId+=1,[g("ready","Todos los jugadores listos",a)]):e==="players-left"?(this.phase="waiting",this.motionEventId+=1,[g("ready","Vuelve a tu salida",a)]):e==="started"?(this.phase="running",this.memoryStage="memorize",this.startedAtMillis=a,this.stageEndsAtMillis=a+Z2,this.players.forEach(i=>{i.status="memorizing"}),this.motionEventId+=1,[g("start","Memoriza tu camino",a)]):[]}finishWin(e,a){let i=this.players[e];return i.status="finished",this.phase="finished",this.memoryStage="game-win",this.winnerIndex=e,this.finishAtMillis=a,this.motionEventId+=1,this.record([g("win",`\xA1${i.label} completa el camino!`,a)])}finishLoss(e){return this.phase="finished",this.memoryStage="game-loss",this.finishAtMillis=e,this.motionEventId+=1,this.record([g("fail","Se acab\xF3 el tiempo",e)])}elapsedMillis(){return this.phase==="waiting"||this.phase==="starting"?0:Math.max(0,this.nowMillis-this.startedAtMillis)}remainingMillis(){return Math.max(0,this.config.durationMillis-this.elapsedMillis())}playerForPoint(e,a){return this.lanes.findIndex(i=>e>=i.x&&e<i.x+i.width&&a>=0&&a<M)}contains(e,a,i){return!!(e&&a>=e.minX&&a<=e.maxX&&i>=e.minY&&i<=e.maxY)}record(e){let a=e.at(-1);return a&&(this.lastEvent=a),e}drawLava(e){let a=Math.floor(this.nowMillis/140);for(let i=0;i<M;i+=1)for(let l=0;l<x;l+=1)(l*5+i*3+a)%13<2?b(e,l,i,k2):(l+i+a)%4===0&&b(e,l,i,Q2)}drawLaneBorders(e){for(let a of this.lanes.slice(1))for(let i=0;i<M;i+=1)b(e,a.x-1,i,"#2b2f3a")}drawReadiness(e){this.players.forEach((a,i)=>{let l=this.readyGate.zoneReady(i,this.nowMillis),n=this.readyZones[i];for(let s=n.minY;s<=n.maxY;s+=1)for(let r=n.minX;r<=n.maxX;r+=1){let o=(r+s+Math.floor(this.nowMillis/130))%4;(l||o<2)&&b(e,r,s,l?Xv:a.color)}this.phase==="starting"&&a.path.forEach((s,r)=>{(r+Math.floor(this.nowMillis/90))%5<3&&b(e,s.x,s.y,a.color)})})}drawStart(e,a){let i=this.readyZones[a.index];for(let l=i.minY;l<=i.maxY;l+=1)for(let n=i.minX;n<=i.maxX;n+=1)b(e,n,l,a.color)}drawFinished(e){let a=Math.floor((this.nowMillis-this.finishAtMillis)/90);if(this.winnerIndex<0){for(let l=0;l<M;l+=1)for(let n=0;n<x;n+=1)(n+l+a)%5<2&&b(e,n,l,Yv);return}let i=this.players[this.winnerIndex];for(let l=0;l<M;l+=1)for(let n=0;n<x;n+=1){let s=this.lanes[this.winnerIndex];n>=s.x&&n<s.x+s.width&&(n+l+a)%4<3&&b(e,n,l,i.color)}i.path.forEach((l,n)=>b(e,l.x,l.y,(n+a)%i.pathLength===0?Xv:i.color))}};function Uf(t){let e=H(Math.trunc(t),1,4);return e===1?[{x:0,width:x}]:e===2?[{x:0,width:8},{x:8,width:8}]:e===3?[{x:0,width:4},{x:6,width:4},{x:12,width:4}]:Array.from({length:4},(a,i)=>({x:i*4,width:4}))}function K2(t,e,a){let i=[],l=a.minX+t.int(a.maxX-a.minX+1),n=3+t.int(4);for(let s=qv;s<M;s+=1){if(i.push({x:l,y:s}),n-=1,n>0||s>=M-2)continue;let r=t.int(2)===0?-1:1,o=H(l+r,e.x,e.x+e.width-1);o!==l&&(l=o,i.push({x:l,y:s})),n=3+t.int(5)}return i}var J2=[{name:"Verde",color:"#42e879"},{name:"Cian",color:"#24d9ff"}];function Sn(t){let e=tu({playerCount:2,players:J2,seed:137});return e.init(0),t!=="waiting"&&W2(e,100),(t==="memorize"||t==="recall")&&e.tick({atMillis:2200}),t==="recall"&&e.tick({atMillis:5100}),e}var jv=Sn("waiting"),Vv=jv.render(),Zv=jv.snapshot(),Iv=Sn("starting"),Qv=Iv.render(),kv=Iv.snapshot(),Kv=Sn("memorize"),Jv=Kv.render(),Wv=Kv.snapshot(),Bf=Sn("recall");n1(Bf,0,7,5200);var $v=Bf.render(),e1=Bf.snapshot(),Ff=Sn("recall");Ff.press({x:7,y:31,pressed:!0,atMillis:5200});var t1=Ff.render(),a1=Ff.snapshot(),Yf=Sn("recall");n1(Yf,0,Number.POSITIVE_INFINITY,5200);var i1=Yf.render(),l1=Yf.snapshot();function W2(t,e){for(let a of t.playerReadyZones())t.press({x:a.minX,y:a.minY,pressed:!0,atMillis:e})}function n1(t,e,a,i){t.pathForPlayer(e).slice(0,a).forEach((l,n)=>t.press({...l,pressed:!0,atMillis:i+n}))}var Zf={};Je(Zf,{PlayerDisplay:()=>s1,createGame:()=>lu,initEvents:()=>r1,manifest:()=>fa,memoriaV2GameWinMillis:()=>Vf,memoriaV2MemorizeMillis:()=>iu,memoriaV2RoundWinMillis:()=>jf,memoriaV2StartingLives:()=>En,memoriaV2TotalLevels:()=>au,memorizeFrame:()=>c1,memorizeSnapshot:()=>d1,memoryTargetsForLevel:()=>Zs,roundWinFrame:()=>m1,roundWinSnapshot:()=>p1,runningFrame:()=>f1,runningSnapshot:()=>h1,startingSnapshot:()=>u1,waitingSnapshot:()=>o1});var St=F(Q(),1);function s1({snapshot:t,frame:e}){let a=t.memoryStage==="memorize"?`Memoriza \xB7 ${$(t.stageMillis)}`:t.lastEventMessage;return(0,St.jsx)(se,{title:t.label,phase:t.phase,children:(0,St.jsxs)("div",{className:"ml-solo-display",children:[(0,St.jsx)(Le,{snapshot:t}),(0,St.jsxs)("div",{className:"ml-solo-summary",children:[(0,St.jsxs)(Me,{columns:3,className:"ml-solo-number-row",children:[(0,St.jsx)(A,{label:"Nivel",tone:"blue",value:`${t.level}/${t.totalLevels}`}),(0,St.jsx)(A,{label:"Aciertos",tone:"green",value:`${t.claimedTargets}/${t.totalTargets}`}),(0,St.jsx)(A,{label:"Vidas",tone:"red",value:(0,St.jsx)(Ut,{lives:t.lives,maxLives:t.maxLives})})]}),(0,St.jsx)(A,{className:"ml-solo-message",label:"Memoria",tone:t.success?"green":t.memoryStage==="game-loss"?"red":"yellow",value:a})]}),e?(0,St.jsx)(qe,{className:"ml-solo-floor",frame:e,label:"Figura en el suelo"}):null]})})}var fa={id:"memoria-v2",label:"Memoria v2",description:"Memoriza y reconstruye figuras cada vez m\xE1s complejas durante veinte niveles.",availability:{development:!0,production:!0},catalog:{category:"team",color:"#22d3ee",durationLabel:"20 niveles",modeLabel:"Memoria progresiva",audioLabel:"M\xFAsica + efectos",rules:["Memoriza la figura azul","Reconstr\xFAyela cuando desaparezca","Cada nivel permite tres errores"]},players:{allowAny:!0,min:1,max:8},start:{mode:"player-ready",releaseGraceMillis:1500},defaultDurationMillis:36e4,display:{entry:"./display"},preview:{seed:137,playerCount:0,actions:[{atMillis:100,type:"press",x:8,y:16}],captureStartMillis:2300,frameCount:24,frameIntervalMillis:120},tags:["memoria","cooperativo","typescript"]};var au=20,En=3,iu=5e3,jf=2200,Vf=5e3;function lu(t){return new qf(t)}function Zs(t,e){let a=j(t+e*2654435769>>>0),i=Math.min(20,4+Math.floor((e-1)/2)),l=[],n=new Set;for(;l.length<i;){let s={x:a.int(16),y:4+a.int(24)},r=`${s.x},${s.y}`;n.has(r)||(n.add(r),l.push(s))}return l}var qf=class{claimed=new Set;config;lastEvent=g("none","Listo",0);level=1;lives=En;nowMillis=0;phase="ready";players;readyGate;stage="memorize";stageEndsAtMillis=0;startedAtMillis=0;targets=[];constructor(e){this.config=B(e,fa),this.readyGate=W(fa.start,[{minX:5,maxX:10,minY:13,maxY:18}],this.config.nowMillis),this.targets=Zs(this.config.seed,this.level),this.players=this.scoredPlayers()}init(e){return this.resetState(e),[this.lastEvent]}press(e){if(this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting")return this.applyReadyTransition(this.readyGate.update(e),e.atMillis);if(this.phase!=="running"||this.stage!=="recall"||!e.pressed)return[];let a=`${e.x},${e.y}`;return this.targets.some(i=>i.x===e.x&&i.y===e.y)?this.claimed.has(a)?[]:(this.claimed.add(a),this.players=this.scoredPlayers(),this.claimed.size===this.targets.length?this.completeLevel(e.atMillis):(this.lastEvent=g("hit",`Acierto ${this.claimed.size} de ${this.targets.length}`,e.atMillis),[this.lastEvent])):(this.lives-=1,this.players=this.scoredPlayers(),this.lives<=0?this.finish(!1,"Sin vidas",e.atMillis):(this.lastEvent=g("damage",`Error, quedan ${this.lives} vidas`,e.atMillis),[this.lastEvent]))}release(e){return this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update({...e,pressed:!1}),e.atMillis):[]}tick(e){return this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.tick(e.atMillis),e.atMillis):this.phase==="finished"?e.atMillis>=this.stageEndsAtMillis?(this.resetState(e.atMillis),[this.lastEvent]):[]:this.stage==="memorize"&&e.atMillis>=this.stageEndsAtMillis?(this.stage="recall",this.lastEvent=g("start","Reconstruye la figura",e.atMillis),[this.lastEvent]):this.stage==="round-win"&&e.atMillis>=this.stageEndsAtMillis?(this.level+=1,this.lives=En,this.claimed.clear(),this.targets=Zs(this.config.seed,this.level),this.stage="memorize",this.stageEndsAtMillis=e.atMillis+iu,this.lastEvent=g("ready",`Memoriza el nivel ${this.level}`,e.atMillis),this.players=this.scoredPlayers(),[this.lastEvent]):[]}render(){let e=J("#020712");if(this.phase==="waiting"||this.phase==="starting"){let a=Math.floor(this.nowMillis/(this.phase==="starting"?100:180));return Ze(e,{centerX:8,centerY:16,radius:2+a%8,color:this.phase==="starting"?"#ffe176":"#22d3ee"}),e}if(this.stage==="memorize")for(let a of this.targets)b(e,a.x,a.y,"#22d3ee");else if(this.stage==="recall")for(let a of this.targets)this.claimed.has(`${a.x},${a.y}`)&&b(e,a.x,a.y,"#35e77a");else{let a=this.stage==="game-loss"?"#ff334e":this.stage==="round-win"?"#ffe176":"#35e77a";Ne(e,{color:a,step:Math.floor((this.stageEndsAtMillis-this.nowMillis)/140)})}return e}snapshot(){let e=this.readyGate.state(this.nowMillis);return{currentGame:fa.id,label:fa.label,phase:this.phase,playerCount:this.config.playerCount,players:this.players,score:this.claimed.size,lives:this.lives,maxLives:En,elapsedMillis:this.elapsedMillis(),remainingMillis:this.stage==="memorize"?Math.max(0,this.stageEndsAtMillis-this.nowMillis):0,activeTargets:this.stage==="recall"?this.targets.length-this.claimed.size:0,success:this.phase==="finished"&&this.stage==="game-win",lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?e.countdownMillis:0,readyPlayers:e.readyPlayers,requiredPlayers:e.requiredPlayers,matchTarget:this.targets.length,level:this.level,totalLevels:au,memoryStage:this.stage,claimedTargets:this.claimed.size,totalTargets:this.targets.length,targets:this.targets.map(a=>({...a})),stageMillis:Math.max(0,this.stageEndsAtMillis-this.nowMillis)}}reset(e={}){this.config=B({...this.config,...e},fa),this.resetState(this.config.nowMillis)}applyReadyTransition(e,a){if(e==="players-ready")this.phase="starting",this.lastEvent=g("ready","Jugador listo",a);else if(e==="players-left")this.phase="waiting",this.lastEvent=g("ready","Vuelve al centro",a);else if(e==="started")this.phase="running",this.stage="memorize",this.stageEndsAtMillis=a+iu,this.startedAtMillis=a,this.lastEvent=g("start","Memoriza la figura azul",a);else return[];return[this.lastEvent]}completeLevel(e){return this.level>=au?this.finish(!0,"Memoria completada",e):(this.stage="round-win",this.stageEndsAtMillis=e+jf,this.lastEvent=g("win",`Nivel ${this.level} completado`,e),[this.lastEvent])}elapsedMillis(){return this.phase==="waiting"||this.phase==="starting"?0:Math.max(0,this.nowMillis-this.startedAtMillis)}finish(e,a,i){return this.phase="finished",this.stage=e?"game-win":"game-loss",this.stageEndsAtMillis=i+Vf,this.lastEvent=g(e?"win":"fail",a,i),[this.lastEvent]}resetState(e){this.readyGate.reset(e),this.claimed.clear(),this.level=1,this.lives=En,this.nowMillis=e,this.phase="waiting",this.stage="memorize",this.stageEndsAtMillis=0,this.startedAtMillis=e,this.targets=Zs(this.config.seed,this.level),this.lastEvent=g("ready","Espera en la zona central",e),this.players=this.scoredPlayers()}scoredPlayers(){return Ee(this.config.playerCount,this.config.players).map(e=>({...e,score:this.level-1,lives:this.lives}))}};var st=lu({playerCount:0,seed:137}),r1=st.init(0),o1=st.snapshot();st.press({x:8,y:16,pressed:!0,atMillis:100});var u1=st.snapshot();st.tick({atMillis:2100});var c1=st.render(),d1=st.snapshot();st.tick({atMillis:7100});var f1=st.render(),h1=st.snapshot();for(let t of st.snapshot().targets)st.press({...t,pressed:!0,atMillis:7200});var m1=st.render(),p1=st.snapshot();var ah={};Je(ah,{PlayerDisplay:()=>y1,createGame:()=>dl,damagedFrame:()=>G1,damagedSnapshot:()=>C1,failedFrame:()=>R1,failedSnapshot:()=>A1,finishedFrame:()=>T1,finishedSnapshot:()=>w1,gameWinAnimationMillis:()=>nu,initEvents:()=>x1,manifest:()=>ha,meteorCoreColor:()=>$f,meteorDifficultyProfile:()=>b1,meteorImpactColor:()=>su,meteorImpactVisibleMillis:()=>Jf,meteorWarningColor:()=>Wf,playerFootprintColor:()=>eh,runningFrame:()=>S1,runningSnapshot:()=>E1,startingLives:()=>Is});var Et=F(Q(),1);function y1({snapshot:t,frame:e}){let a=t.phase==="finished"?t.success?"\xA1Tormenta superada!":"La tormenta te alcanz\xF3":t.lastEventMessage||"Esquiva las zonas rojas",i=t.success?"green":t.lives===0?"red":"cyan";return(0,Et.jsx)(se,{title:t.label,phase:t.phase,children:(0,Et.jsxs)("div",{className:"ml-solo-display meteor-dodge-display",children:[(0,Et.jsx)(Le,{snapshot:t}),(0,Et.jsxs)("div",{className:"ml-solo-summary",children:[(0,Et.jsxs)(Me,{columns:3,className:"ml-solo-number-row",children:[(0,Et.jsx)(A,{label:"Esquivados",tone:"cyan",value:t.dodgedMeteors}),(0,Et.jsx)(A,{label:"Vidas",tone:"neutral",value:(0,Et.jsx)(Ut,{lives:t.lives,maxLives:t.maxLives})}),(0,Et.jsx)(A,{label:"Tiempo",tone:"yellow",value:$(t.remainingMillis)})]}),(0,Et.jsx)(A,{className:"ml-solo-message",label:"Estado",tone:i,value:a})]}),e?(0,Et.jsx)(qe,{className:"ml-solo-floor",frame:e,label:"Tormenta en el suelo"}):null]})})}var ha={id:"meteor-dodge",label:"Lluvia de meteoritos",description:"Cooperative survival game: dodge telegraphed meteor impacts until the storm passes.",availability:{development:!0,production:!1},catalog:{category:"team",color:"#b987ff",durationLabel:"45s",modeLabel:"Supervivencia",audioLabel:"Efectos",rules:["Esquiva las zonas marcadas","Sobrevive hasta que termine la tormenta"]},players:{allowAny:!0,min:1,max:1},start:{mode:"player-ready",releaseGraceMillis:750},config:{difficulty:{default:"medium",options:["easy","medium","hard","expert"]}},defaultDurationMillis:45e3,display:{entry:"./display"},preview:{seed:137,playerCount:1,difficulty:"medium",actions:[{atMillis:100,type:"press",x:8,y:16},{atMillis:2150,type:"release",x:8,y:16}],captureStartMillis:2200,frameCount:18,frameIntervalMillis:120},tags:["arcade","cooperative","survival","typescript"]};var Is=3,nu=3e3,Jf=450,Wf="#ff5a36",$f="#ffe176",su="#ffffff",eh="#35d7ff",If="#02050b",$2="#050d19",eE="#145cff",tE="#35d7ff",aE="#ffe176",Qf=["#35d7ff","#5fff9e","#ffe176","#ff3bd7","#ffffff"],kf=["#ff3151","#7b1428","#2a0710"],iE=1e3,lE=350,nE=64,cl={minX:4,maxX:11,minY:12,maxY:19},th={intervalMillis:1550,largeMeteorEvery:5,radius:1,warningMillis:1350},v1={easy:{intervalMillis:1900,largeMeteorEvery:0,radius:1,warningMillis:1650},medium:th,hard:{intervalMillis:1200,largeMeteorEvery:3,radius:1,warningMillis:1050},expert:{intervalMillis:900,largeMeteorEvery:1,radius:2,warningMillis:800}};function dl(t){return new Kf(t)}var Kf=class{config;dodgedMeteors=0;finishedAtMillis=0;lastDamageMillis=Number.NEGATIVE_INFINITY;lastEvent=g("none","Listos para la tormenta",0);lives=Is;meteors=[];nextMeteorId=1;nextMeteorMillis=0;nowMillis=0;occupiedTiles=new Set;phase="ready";players=[];readyGate;rng;startedAtMillis=0;success=!1;constructor(e){this.config=B(e,ha),this.rng=j(this.config.seed),this.readyGate=W(ha.start,[cl],this.config.nowMillis),this.resetState(this.config.nowMillis)}init(e){return this.resetState(e),this.phase="waiting",this.lastEvent=g("ready","Entra en la zona azul",e),[this.lastEvent]}press(e){return this.nowMillis=e.atMillis,this.updateOccupiedTile(e.x,e.y,e.pressed),this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update(e),e.atMillis):[]}release(e){return this.nowMillis=e.atMillis,this.updateOccupiedTile(e.x,e.y,!1),this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update({...e,pressed:!1}),e.atMillis):[]}tick(e){if(this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting")return this.applyReadyTransition(this.readyGate.tick(e.atMillis),e.atMillis);if(this.phase!=="running")return[];let a=[];this.spawnDueMeteors(e.atMillis);for(let i of this.meteors){if(i.result!=="pending"||e.atMillis<i.impactAtMillis)continue;if(!this.meteorContainsOccupiedTile(i)){i.result="dodged",this.dodgedMeteors+=1;continue}if(i.impactAtMillis-this.lastDamageMillis<iE){i.result="protected";continue}if(i.result="hit",this.lastDamageMillis=i.impactAtMillis,this.lives=Math.max(0,this.lives-1),this.lives===0){a.push(this.finish(!1,i.impactAtMillis));break}a.push(g("miss","\xA1Impacto! Mu\xE9vete",i.impactAtMillis))}return this.meteors=this.meteors.filter(i=>i.clearAtMillis>e.atMillis),this.phase==="running"&&this.remainingMillis()===0&&a.push(this.finish(!0,e.atMillis)),this.recordEvents(a)}render(){let e=J(If);if(this.drawBackground(e),this.phase==="waiting"||this.phase==="starting")return this.drawPlayerStart(e),e;if(this.phase==="finished")return this.success?this.drawWinAnimation(e):this.drawFailAnimation(e),e;for(let a of this.occupiedTiles){let[i,l]=g1(a);b(e,i,l,eh)}for(let a of this.meteors)this.drawMeteor(e,a);return e}snapshot(){let e=this.readyGate.state(this.nowMillis),a=this.success&&this.phase==="finished"?Math.max(0,Math.min(nu,this.nowMillis-this.finishedAtMillis)):0;return{currentGame:ha.id,label:ha.label,phase:this.phase,playerCount:this.config.playerCount,players:this.players.map(i=>({...i,lives:this.lives,score:this.dodgedMeteors})),score:this.dodgedMeteors,lives:this.lives,maxLives:Is,elapsedMillis:this.elapsedMillis(),remainingMillis:this.remainingMillis(),activeTargets:this.meteors.filter(i=>i.result==="pending").length,success:this.success,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?e.countdownMillis:0,readyPlayers:e.readyPlayers,requiredPlayers:e.requiredPlayers,celebrating:this.success&&this.phase==="finished"&&a<nu,celebrationMillis:a,dodgedMeteors:this.dodgedMeteors,meteors:this.meteors.map(i=>({...i})),stormDurationMillis:this.config.durationMillis}}reset(e={}){this.config=B({...this.config,...e},ha),this.rng=j(this.config.seed),this.resetState(this.config.nowMillis),this.phase="waiting"}applyReadyTransition(e,a){return e==="players-ready"?(this.phase="starting",this.lastEvent=g("ready","Zona lista",a),[this.lastEvent]):e==="players-left"?(this.phase="waiting",this.lastEvent=g("ready","Vuelve a la zona azul",a),[this.lastEvent]):e==="started"?(this.phase="running",this.startedAtMillis=a,this.nextMeteorMillis=a+lE,this.lastEvent=g("start","Esquiva las zonas rojas",a),[this.lastEvent]):[]}difficultyProfile(){return v1[this.config.difficulty]??th}drawBackground(e){for(let a=3;a<M;a+=4)z(e,0,a,x,1,$2)}drawFailAnimation(e){let a=Math.floor((this.nowMillis-this.finishedAtMillis)/180)%kf.length,i=kf[a]??kf[0];for(let l=0;l<M;l+=1){let n=Math.floor(l*x/M);z(e,n-1,l,3,1,i),z(e,x-n-2,l,3,1,i)}}drawMeteor(e,a){if(a.result==="pending"){let r=Math.floor((this.nowMillis-a.spawnedAtMillis)/160)%2===0,o=a.radius*2+1,u=r?Wf:"#6c1b19";z(e,a.x-a.radius,a.y-a.radius,o,o,u),a.radius>0&&z(e,a.x-a.radius+1,a.y-a.radius+1,o-2,o-2,If),b(e,a.x,a.y,$f);return}let i=Math.max(0,this.nowMillis-a.impactAtMillis),l=Math.min(2,Math.floor(i/130)),n=a.radius+l,s=i<140?su:a.result==="hit"?"#ff3151":"#ff8a2a";z(e,a.x-n,a.y-n,n*2+1,n*2+1,s),b(e,a.x,a.y,su)}drawPlayerStart(e){let a=Math.floor(this.nowMillis/(this.phase==="starting"?100:190)),i=this.phase==="starting"?aE:a%2===0?tE:eE,l=this.phase==="starting"?a%3:a%2,n=cl.minX+l,s=cl.minY+l,r=cl.maxX-cl.minX+1-l*2,o=cl.maxY-cl.minY+1-l*2;z(e,n,s,r,o,i),r>2&&o>2&&z(e,n+1,s+1,r-2,o-2,If),b(e,7,15,"#ffffff"),b(e,8,16,"#ffffff")}drawWinAnimation(e){let a=Math.floor(Math.max(0,this.nowMillis-this.finishedAtMillis)/120);Ne(e,{color:({distance:i})=>Qf[(i+a)%Qf.length]??Qf[0],step:a})}elapsedMillis(){if(this.phase==="waiting"||this.phase==="starting"||this.phase==="ready")return 0;let e=this.phase==="finished"?this.finishedAtMillis:this.nowMillis;return Math.max(0,e-this.startedAtMillis)}finish(e,a){this.phase="finished",this.success=e,this.finishedAtMillis=a;let i=g(e?"win":"fail",e?"Tormenta superada":"Sin vidas",a);return this.lastEvent=i,i}meteorContainsOccupiedTile(e){for(let a of this.occupiedTiles){let[i,l]=g1(a);if(Math.abs(i-e.x)<=e.radius&&Math.abs(l-e.y)<=e.radius)return!0}return!1}recordEvents(e){let a=e.at(-1);return a&&(this.lastEvent=a),e}remainingMillis(){return Math.max(0,this.config.durationMillis-this.elapsedMillis())}resetState(e){this.readyGate.reset(e),this.rng=j(this.config.seed),this.dodgedMeteors=0,this.finishedAtMillis=0,this.lastDamageMillis=Number.NEGATIVE_INFINITY,this.lives=Is,this.meteors=[],this.nextMeteorId=1,this.nextMeteorMillis=0,this.nowMillis=e,this.occupiedTiles.clear(),this.players=Ee(this.config.playerCount,this.config.players),this.startedAtMillis=e,this.success=!1}spawnDueMeteors(e){let a=this.difficultyProfile(),i=0;for(;this.nextMeteorMillis>0&&this.nextMeteorMillis<=e&&i<nE;){let l=this.nextMeteorId,s=a.largeMeteorEvery>0&&l%a.largeMeteorEvery===0?Math.min(2,a.radius+1):a.radius,r=this.nextMeteorMillis+a.warningMillis;this.meteors.push({clearAtMillis:r+Jf,id:l,impactAtMillis:r,radius:s,result:"pending",spawnedAtMillis:this.nextMeteorMillis,x:this.rng.range(s,x-s-1),y:this.rng.range(s,M-s-1)}),this.nextMeteorId+=1,this.nextMeteorMillis+=a.intervalMillis,i+=1}}updateOccupiedTile(e,a,i){if(e<0||e>=x||a<0||a>=M)return;let l=`${e},${a}`;i?this.occupiedTiles.add(l):this.occupiedTiles.delete(l)}};function b1(t){return{...v1[t]??th}}function g1(t){let[e="0",a="0"]=t.split(",");return[Number(e),Number(a)]}var Gn=dl({playerCount:1,difficulty:"medium",seed:137}),x1=Gn.init(0);ru(Gn);Gn.release({x:8,y:16,pressed:!1,atMillis:2150});Gn.tick({atMillis:4e3});var S1=Gn.render(),E1=Gn.snapshot(),Qs=dl({playerCount:1,difficulty:"easy",seed:137});Qs.init(0);ru(Qs);z1(Qs,2450);var G1=Qs.render(),C1=Qs.snapshot(),fl=dl({playerCount:1,difficulty:"medium",durationMillis:4e3,seed:137});fl.init(0);ru(fl);fl.release({x:8,y:16,pressed:!1,atMillis:2150});fl.tick({atMillis:6100});fl.tick({atMillis:7e3});var T1=fl.render(),w1=fl.snapshot(),ks=dl({playerCount:1,difficulty:"easy",seed:137});ks.init(0);ru(ks);var M1=2450;for(let t=0;t<3;t+=1)M1=z1(ks,M1)+1050;var R1=ks.render(),A1=ks.snapshot();function ru(t){t.press({x:8,y:16,pressed:!0,atMillis:100}),t.tick({atMillis:2100})}function z1(t,e){t.release({x:8,y:16,pressed:!1,atMillis:e}),t.tick({atMillis:e});let a=t.snapshot().meteors.find(i=>i.result==="pending");return a?(t.press({x:a.x,y:a.y,pressed:!0,atMillis:a.impactAtMillis-1}),t.tick({atMillis:a.impactAtMillis}),t.release({x:a.x,y:a.y,pressed:!1,atMillis:a.impactAtMillis+1}),a.impactAtMillis+1):e}var lh={};Je(lh,{PlayerDisplay:()=>P1,createGame:()=>uu,finishedFrame:()=>U1,finishedSnapshot:()=>B1,initEvents:()=>N1,manifest:()=>Ft,patronesCelebrationMillis:()=>ou,patternTargets:()=>Cn,runningFrame:()=>H1,runningSnapshot:()=>L1,startingSnapshot:()=>O1,waitingSnapshot:()=>D1});var Bt=F(Q(),1);function P1({snapshot:t,frame:e}){return(0,Bt.jsx)(se,{title:t.label,phase:t.phase,children:(0,Bt.jsxs)("div",{className:"ml-solo-display",children:[(0,Bt.jsx)(Le,{snapshot:t}),(0,Bt.jsxs)("div",{className:"ml-solo-summary",children:[(0,Bt.jsxs)(Me,{columns:3,className:"ml-solo-number-row",children:[(0,Bt.jsx)(A,{label:"Aciertos",tone:"green",value:t.claimedTargets}),(0,Bt.jsx)(A,{label:"Objetivos",tone:"blue",value:t.totalTargets}),(0,Bt.jsx)(A,{label:"Tiempo",tone:"cyan",value:$(t.remainingMillis)})]}),(0,Bt.jsx)(A,{className:"ml-solo-message",label:"Patr\xF3n",tone:t.success?"green":"yellow",value:t.lastEventMessage||"Reconstruye el patr\xF3n azul"})]}),e?(0,Bt.jsx)(qe,{className:"ml-solo-floor",frame:e,label:"Patr\xF3n en el suelo"}):null]})})}var Ft={id:"patrones",label:"Patrones",description:"Reconstruye patrones azules sin pisar baldosas incorrectas.",availability:{development:!0,production:!0},catalog:{category:"team",color:"#176bff",durationLabel:"45s",modeLabel:"Reconstrucci\xF3n",audioLabel:"M\xFAsica + efectos",rules:["Memoriza el patr\xF3n azul","Pisa cada objetivo una vez","Evita las dem\xE1s baldosas"]},players:{allowAny:!0,min:1,max:1},start:{mode:"player-ready"},defaultDurationMillis:45e3,config:{difficulty:{options:["easy","medium","hard"],default:"medium"}},display:{entry:"./display"},preview:{seed:137,playerCount:0,difficulty:"medium",actions:[{atMillis:100,type:"press",x:8,y:16}],captureStartMillis:2300,frameCount:24,frameIntervalMillis:120},tags:["patrones","memoria","typescript"]};var ou=5e3,_1={easy:[{x:7,y:11},{x:8,y:11},{x:6,y:12},{x:9,y:12},{x:5,y:13},{x:10,y:13},{x:7,y:14},{x:8,y:14}],medium:[{x:7,y:8},{x:8,y:8},{x:6,y:10},{x:9,y:10},{x:5,y:12},{x:10,y:12},{x:6,y:14},{x:9,y:14},{x:7,y:16},{x:8,y:16},{x:7,y:18},{x:8,y:18}],hard:[{x:7,y:7},{x:8,y:7},{x:5,y:9},{x:10,y:9},{x:4,y:12},{x:11,y:12},{x:6,y:13},{x:9,y:13},{x:5,y:16},{x:10,y:16},{x:7,y:17},{x:8,y:17},{x:6,y:20},{x:9,y:20},{x:7,y:22},{x:8,y:22}]};function Cn(t="medium"){return(_1[t]??_1.medium??[]).map(e=>({...e}))}function uu(t){return new ih(t)}var ih=class{claimed=new Set;config;finishedAtMillis;lastEvent=g("none","Listo",0);nowMillis=0;phase="ready";players;readyGate;startedAtMillis=0;success=!1;targets;constructor(e){this.config=B(e,Ft),this.readyGate=W(Ft.start,[{minX:5,maxX:10,minY:13,maxY:18}],this.config.nowMillis),this.targets=Cn(this.config.difficulty),this.players=this.scoredPlayers()}init(e){return this.resetState(e),[this.lastEvent]}press(e){if(this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting")return this.applyReadyTransition(this.readyGate.update(e),e.atMillis);if(this.phase!=="running"||!e.pressed)return[];let a=`${e.x},${e.y}`;return this.targets.some(i=>i.x===e.x&&i.y===e.y)?this.claimed.has(a)?[]:(this.claimed.add(a),this.players=this.scoredPlayers(),this.claimed.size===this.targets.length?this.finish(!0,"Patr\xF3n completado",e.atMillis):(this.lastEvent=g("hit",`Acierto ${this.claimed.size} de ${this.targets.length}`,e.atMillis),[this.lastEvent])):this.finish(!1,"Baldosa incorrecta",e.atMillis)}release(e){return this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update({...e,pressed:!1}),e.atMillis):[]}tick(e){return this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.tick(e.atMillis),e.atMillis):this.phase==="finished"?e.atMillis-(this.finishedAtMillis??e.atMillis)>=ou?(this.resetState(e.atMillis),[this.lastEvent]):[]:this.phase==="running"&&this.remainingMillis()===0?this.finish(!1,"Tiempo agotado",e.atMillis):[]}render(){let e=J("#030712");if(this.phase==="waiting"||this.phase==="starting"){let a=Math.floor(this.nowMillis/(this.phase==="starting"?100:180));return Ze(e,{centerX:8,centerY:16,radius:2+a%8,color:this.phase==="starting"?"#ffe176":"#176bff"}),e}for(let a of this.targets)b(e,a.x,a.y,this.claimed.has(`${a.x},${a.y}`)?"#35e77a":"#176bff");return this.phase==="finished"&&Ne(e,{color:this.success?"#35e77a":"#ff334e",step:Math.floor((this.nowMillis-(this.finishedAtMillis??this.nowMillis))/140)}),e}snapshot(){let e=this.readyGate.state(this.nowMillis);return{currentGame:Ft.id,label:Ft.label,phase:this.phase,playerCount:this.config.playerCount,players:this.players,score:this.claimed.size,lives:-1,elapsedMillis:this.elapsedMillis(),remainingMillis:this.remainingMillis(),activeTargets:this.phase==="running"?this.targets.length-this.claimed.size:0,success:this.phase==="finished"&&this.success,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?e.countdownMillis:0,readyPlayers:e.readyPlayers,requiredPlayers:e.requiredPlayers,matchTarget:this.targets.length,claimedTargets:this.claimed.size,totalTargets:this.targets.length,celebrationMillis:this.phase==="finished"?Math.max(0,ou-(this.nowMillis-(this.finishedAtMillis??this.nowMillis))):0}}reset(e={}){this.config=B({...this.config,...e},Ft),this.targets=Cn(this.config.difficulty),this.resetState(this.config.nowMillis)}applyReadyTransition(e,a){if(e==="players-ready")this.phase="starting",this.lastEvent=g("ready","Jugador listo",a);else if(e==="players-left")this.phase="waiting",this.lastEvent=g("ready","Vuelve al centro",a);else if(e==="started")this.phase="running",this.startedAtMillis=a,this.lastEvent=g("start","Reconstruye el patr\xF3n azul",a);else return[];return[this.lastEvent]}elapsedMillis(){return this.phase==="waiting"||this.phase==="starting"?0:Math.max(0,(this.finishedAtMillis??this.nowMillis)-this.startedAtMillis)}finish(e,a,i){return this.phase="finished",this.success=e,this.finishedAtMillis=i,this.lastEvent=g(e?"win":"fail",a,i),[this.lastEvent]}remainingMillis(){return Math.max(0,this.config.durationMillis-this.elapsedMillis())}resetState(e){this.readyGate.reset(e),this.claimed.clear(),this.finishedAtMillis=void 0,this.lastEvent=g("ready","Espera en la zona central",e),this.nowMillis=e,this.phase="waiting",this.startedAtMillis=e,this.success=!1,this.players=this.scoredPlayers()}scoredPlayers(){return Ee(this.config.playerCount,this.config.players).map(e=>({...e,score:this.claimed.size}))}};var ma=uu({playerCount:0,difficulty:"medium",durationMillis:Ft.defaultDurationMillis}),N1=ma.init(0),D1=ma.snapshot();ma.press({x:8,y:16,pressed:!0,atMillis:100});var O1=ma.snapshot();ma.tick({atMillis:2100});var H1=ma.render(),L1=ma.snapshot();Cn("medium").forEach((t,e)=>ma.press({...t,pressed:!0,atMillis:2200+e*10}));var U1=ma.render(),B1=ma.snapshot();var ch={};Je(ch,{PlayerDisplay:()=>F1,ballColor:()=>hl,blueColor:()=>Za,createGame:()=>q1,finishedSnapshot:()=>V1,manifest:()=>rt,pingPongConfigVars:()=>Ni,redColor:()=>Va,runningFrame:()=>j1,runningSnapshot:()=>uh,waitingSnapshot:()=>oh});var Re=F(Q(),1);function nh(t){return{"--ping-pong-ball-x":`${3.5+t.y/31*93}%`,"--ping-pong-ball-y":`${18+t.x/15*64}%`}}function F1({snapshot:t}){let[e,a]=t.players,i=e??{label:"Rojo",score:0,color:"#ff1c28"},l=a??{label:"Azul",score:0,color:"#145cff"},n=Math.max(t.matchTarget,1),s=n*2-1,r=t.phase==="starting"?"Empieza en":"Objetivo",o=t.phase==="starting"?$(t.countdownMillis):n,u=t.phase==="starting"?"preparados":"puntos para ganar",d=t.phase==="finished"?"\xDAltimo peloteo":"Peloteo",p=t.phase==="finished"&&t.lastRoundHits>0?t.lastRoundHits:t.roundHits,f=t.lastRoundWinner||"-",y=f===i.label?"red":f===l.label?"blue":"neutral",G=t.phase==="waiting"||t.phase==="starting",C=Math.min(s,t.rounds.length+(t.phase==="running"||t.phase==="starting"?1:0)),D=G?"Listos":"Ronda",h=G?`${t.activeTargets}/2`:`${C}/${s}`,c=t.phase==="running",m=t.phase==="finished"?null:Math.min(s,t.rounds.length+1),v=t.pointScorer===0?"red":t.pointScorer===1?"blue":"none",w=t.winnerIndex===0?"red":t.winnerIndex===1?"blue":"none",L=["ping-pong-display","ml-versus-display",`is-phase-${t.phase}`,t.pointFlashMillis>0?`is-scoring-${v}`:"",t.phase==="finished"?`is-winner-${w}`:""].filter(Boolean).join(" "),T=t.pointScorer===0?i.label:l.label,N=t.winnerIndex===0?i.label:l.label,E=t.phase==="waiting"?`${t.activeTargets}/2 en posici\xF3n`:t.phase==="starting"?"Preparados":t.phase==="finished"?`Victoria ${N}`:t.pointFlashMillis>0?`Punto ${T}`:t.roundHits>0?`${t.roundHits} ${t.roundHits===1?"golpe":"golpes"}`:"Saque",P=t.impact?nh(t.impact):void 0;return(0,Re.jsx)(se,{title:t.label,phase:t.phase,variant:"versus",children:(0,Re.jsxs)("div",{className:L,style:{"--ping-pong-rally-pace":t.rallyPace},children:[(0,Re.jsx)(fn,{className:"ping-pong-scoreboard",left:i,right:l,target:n,centerLabel:r,centerValue:o,centerCaption:u}),(0,Re.jsxs)("section",{"aria-label":`Trayectoria de la pelota: ${E}`,className:"ping-pong-rally-lane",children:[(0,Re.jsx)("span",{className:"ping-pong-rally-team is-red",children:"Rojo"}),(0,Re.jsx)("span",{className:"ping-pong-rally-team is-blue",children:"Azul"}),(0,Re.jsx)("span",{className:"ping-pong-rally-net","aria-hidden":"true"}),(0,Re.jsx)("span",{className:"ping-pong-rally-scan","aria-hidden":"true"}),t.ballTrail.map((ge,va)=>(0,Re.jsx)("i",{"aria-hidden":"true",className:"ping-pong-ball-trail",style:{...nh(ge),"--ping-pong-trail-index":va}},`${va}-${ge.x}-${ge.y}`)),(0,Re.jsx)("i",{"aria-hidden":"true",className:"ping-pong-ball",style:nh(t.ball)}),t.impact?(0,Re.jsx)("i",{"aria-hidden":"true",className:`ping-pong-impact is-${t.impact.team===0?"red":"blue"}`,style:P},t.motionEventId):null,(0,Re.jsx)("strong",{className:"ping-pong-rally-caption",children:E},`caption-${t.motionEventId}`)]}),(0,Re.jsxs)(Me,{columns:4,className:"ping-pong-metrics",children:[(0,Re.jsx)(A,{className:"ping-pong-rally-metric",label:d,tone:"cyan",value:p}),(0,Re.jsx)(A,{className:"ping-pong-progress-metric",label:D,tone:G?"green":"yellow",value:h}),(0,Re.jsx)(A,{className:"ping-pong-last-metric",label:"\xDAltimo",tone:y,value:f}),(0,Re.jsx)(A,{className:"ping-pong-time-metric",label:"Tiempo",tone:"amber",value:$(t.elapsedMillis)})]}),(0,Re.jsx)(hn,{className:"ping-pong-rounds",activeCaption:c?"Punto en curso":"Por comenzar",activeLabel:c?"En juego":"Siguiente",activeRound:m,rounds:t.rounds,totalRounds:s})]})})}var Ni={pointsToWin:{key:"points_to_win",label:"Points to win",playerFacing:!0,description:"The first team to reach this score wins. A match can last up to twice this value minus one rounds.",type:"int",default:5,min:1,max:21,step:1},initialBallSpeed:{key:"initial_ball_speed",label:"Initial ball speed (tiles/s)",playerFacing:!1,description:"The ball's starting speed in floor tiles per second on Easy. Medium, Hard, and Expert apply the difficulty multiplier curve to this value.",type:"float",default:5.75,min:3,max:10,step:.25},returnSpeedMultiplier:{key:"return_speed_multiplier",label:"Speed multiplier per return",playerFacing:!1,description:"The ball accelerates after every successful paddle return. Difficulty scales the increase above 1x, with a safety cap at 2.5 times the starting speed.",type:"float",default:1.035,min:1,max:1.1,step:.005},difficultyMultiplier:{key:"difficulty_multiplier",label:"Difficulty multiplier step",playerFacing:!1,description:"Easy uses 1x, Medium uses one step, Hard uses the step squared, and Expert uses the step cubed. It affects both starting speed and return acceleration.",type:"float",default:1.2,min:1,max:1.35,step:.05}},rt={id:"ping-pong",label:"Ping Pong",description:"Two-player arcade ping pong for red and blue halves of the Motion Levels floor.",availability:{development:!0,production:!0},catalog:{category:"versus",color:"#145cff",durationLabel:"A 5 puntos",modeLabel:"Rojo contra azul",audioLabel:"M\xFAsica + efectos",rules:["Un equipo ocupa la mitad roja y otro la azul","Devuelve la pelota pisando la zona iluminada"]},players:{allowAny:!0,min:2,max:2},start:{mode:"player-ready",releaseGraceMillis:1e3},config:{difficulty:{default:"medium",options:["easy","medium","hard","expert"]},vars:Object.values(Ni)},defaultDurationMillis:0,display:{entry:"./display"},preview:{seed:137,playerCount:2,difficulty:"medium",options:{points_to_win:5},actions:[{atMillis:100,type:"press",x:7,y:3},{atMillis:100,type:"press",x:7,y:28}],captureStartMillis:2200,frameCount:18,frameIntervalMillis:120},tags:["arcade","two-player","typescript"]};var Va="#ff1c28",Za="#145cff",hl="#ffffff",sE="#05070a",Fa={r:255,g:28,b:40},Ya={r:20,g:92,b:255},Tn={r:255,g:255,b:255},Y1=900,sh=3e3,cu=2,du=29,Xa=5,Di=Math.floor(x/2),qa=Math.floor(M/2),rE=2.5;function q1(t){return new rh(t)}var rh=class{config;rng;players;winningScore;speed;startedAtMillis=0;nowMillis=0;readyGate;lastStepMillis=0;pauseUntilMillis=0;finishAtMillis=0;currentIntervalMillis=140;hitCount=0;redPaddleX=0;bluePaddleX=0;ball={x:Di,y:qa,dx:1,dy:1};ballTrail=[];teamScore=[0,0];rounds=[];lastRoundHits=0;lastRoundWinner="";phase="waiting";success=!1;scorer=-1;winner=-1;pointAtMillis=0;lastImpactAtMillis=0;lastImpact=null;motionEventId=0;lastEvent=g("none","Listo",0);constructor(e){this.config=B(e,rt),this.rng=j(this.config.seed),this.readyGate=W(rt.start,mn(2),this.config.nowMillis),this.winningScore=this.readWinningScore(),this.players=this.createPlayers(),this.speed=X1(this.config),this.resetGame(this.config.nowMillis)}init(e){return this.startedAtMillis=e,this.nowMillis=e,this.resetGame(e),this.lastEvent=g("ready","Ping Pong espera rojo y azul",e),[this.lastEvent]}press(e){this.nowMillis=e.atMillis;let a=this.readyGate.update(e);return e.pressed&&this.movePaddle(e.x,e.y),this.recordEvents(this.updatePhase(e.atMillis,a))}release(e){this.nowMillis=e.atMillis;let a=this.readyGate.update({...e,pressed:!1});return this.recordEvents(this.updatePhase(e.atMillis,a))}tick(e){this.nowMillis=e.atMillis;let a=this.updatePhase(e.atMillis,this.readyGate.tick(e.atMillis));if(this.phase!=="running"||e.atMillis<this.pauseUntilMillis)return this.recordEvents(a);for(let i=0;i<8&&!(e.atMillis-this.lastStepMillis<this.currentIntervalMillis);i+=1){this.lastStepMillis+=this.currentIntervalMillis;let l=this.moveBall(this.lastStepMillis);if(l&&a.push(l),this.phase!=="running"||this.lastStepMillis<this.pauseUntilMillis)break}return this.recordEvents(a)}render(){let e=J(sE);return this.phase==="waiting"?(this.drawWaiting(e),e):this.phase==="starting"?(this.drawReady(e),e):this.phase==="finished"?(this.drawWin(e),e):(this.drawArena(e),this.drawScore(e),this.nowMillis<this.pauseUntilMillis?this.drawScoreFlash(e):(this.drawBallTrail(e),this.drawImpact(e),this.drawPaddles(e),this.drawBallGlow(e),b(e,this.ball.x,this.ball.y,hl)),e)}snapshot(){this.recordEvents(this.updatePhase(this.nowMillis));let e=this.readyGate.state(this.nowMillis),a=this.phase==="starting"?e.countdownMillis:0,i=this.phase==="finished"&&this.nowMillis<this.finishAtMillis+sh?this.finishAtMillis+sh-this.nowMillis:0;return{currentGame:rt.id,label:rt.label,phase:this.phase,playerCount:this.config.playerCount,players:[{index:0,label:this.labelForTeam(0),color:Va,score:this.teamScore[0],lives:-1},{index:1,label:this.labelForTeam(1),color:Za,score:this.teamScore[1],lives:-1}],score:this.teamScore[0]+this.teamScore[1],lives:-1,elapsedMillis:Math.max(0,this.nowMillis-this.startedAtMillis),remainingMillis:i,activeTargets:this.activeHalves(this.nowMillis),success:this.success,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:a,readyPlayers:e.readyPlayers,requiredPlayers:e.requiredPlayers,matchTarget:this.winningScore,roundHits:this.hitCount,lastRoundHits:this.lastRoundHits,lastRoundWinner:this.lastRoundWinner,rounds:this.rounds,ball:{...this.ball},ballTrail:this.ballTrail.map(l=>({...l})),rallyPace:this.speed.initialMillis===this.speed.minimumMillis?1:H((this.speed.initialMillis-this.currentIntervalMillis)/(this.speed.initialMillis-this.speed.minimumMillis),0,1),pointScorer:this.scorer,pointFlashMillis:Math.max(0,this.pauseUntilMillis-this.nowMillis),winnerIndex:this.winner,impact:this.lastImpact&&this.nowMillis-this.lastImpactAtMillis<480?{...this.lastImpact,remainingMillis:480-(this.nowMillis-this.lastImpactAtMillis)}:null,motionEventId:this.motionEventId,initialBallSpeed:this.speed.initialTilesPerSecond,ballSpeed:1e3/this.currentIntervalMillis,returnSpeedMultiplier:this.speed.hitMultiplier,difficultySpeedFactor:this.speed.difficultyFactor}}reset(e={}){this.config=B({...this.config,...e},rt),this.rng=j(this.config.seed),this.winningScore=this.readWinningScore(),this.players=this.createPlayers(),this.speed=X1(this.config),this.motionEventId=0,this.resetGame(this.config.nowMillis),this.lastEvent=g("none","Listo",this.config.nowMillis)}createPlayers(){return[{index:0,label:"Rojo",color:Va,score:0,lives:-1},{index:1,label:"Azul",color:Za,score:0,lives:-1}]}readWinningScore(){return je(this.config.options,Ni.pointsToWin)}resetGame(e){this.readyGate.reset(e),this.teamScore=[0,0],this.rounds=[],this.lastRoundHits=0,this.lastRoundWinner="",this.redPaddleX=Math.floor((x-Xa)/2),this.bluePaddleX=this.redPaddleX,this.phase="waiting",this.success=!1,this.scorer=-1,this.winner=-1,this.pointAtMillis=0,this.lastImpactAtMillis=0,this.lastImpact=null,this.motionEventId+=1,this.startedAtMillis=e,this.finishAtMillis=0,this.resetBall(),this.lastEvent=g("none","Esperando a rojo arriba y azul abajo",e)}updatePhase(e,a=this.readyGate.tick(e)){return this.phase==="finished"?e-this.finishAtMillis>=sh?(this.resetGame(e),[g("ready","Nueva partida",e)]):[]:a==="players-ready"?(this.phase="starting",this.motionEventId+=1,[g("start","Rojo y azul listos",e)]):a==="players-left"?(this.phase="waiting",this.motionEventId+=1,[g("ready","Vuelve a las zonas roja y azul",e)]):a==="started"?(this.phase="running",this.startedAtMillis=e,this.lastStepMillis=e,this.serve(),this.motionEventId+=1,[g("start","La pelota esta en juego",e)]):[]}movePaddle(e,a){let l=H(Math.round(e),Math.floor(Xa/2),x-1-Math.floor(Xa/2))-Math.floor(Xa/2);a<M/2?this.redPaddleX=l:this.bluePaddleX=l}moveBall(e){let a=this.ball.x+this.ball.dx,i=this.ball.y+this.ball.dy;if(a<0&&(a=0,this.ball.dx=1),a>=x&&(a=x-1,this.ball.dx=-1),this.ball.dy<0&&i===cu&&a>=this.redPaddleX&&a<this.redPaddleX+Xa)return this.reflectFromPaddle(a,this.redPaddleX),this.commitBall({...this.ball,x:a,y:cu+1,dy:1}),this.recordImpact(0,a,cu),this.accelerate(),g("coin","Rojo devuelve",e);if(this.ball.dy>0&&i===du&&a>=this.bluePaddleX&&a<this.bluePaddleX+Xa)return this.reflectFromPaddle(a,this.bluePaddleX),this.commitBall({...this.ball,x:a,y:du-1,dy:-1}),this.recordImpact(1,a,du),this.accelerate(),g("coin","Azul devuelve",e);if(i<0)return this.scorePoint(1,e),g("score","Punto para azul",e);if(i>=M)return this.scorePoint(0,e),g("score","Punto para rojo",e);this.commitBall({...this.ball,x:a,y:i})}scorePoint(e,a){if(this.teamScore[e]+=1,this.scorer=e,this.pointAtMillis=a,this.motionEventId+=1,this.recordRound(e),this.teamScore[e]>=this.winningScore){this.phase="finished",this.success=e===1,this.winner=e,this.finishAtMillis=a;return}this.resetBall(),this.pauseUntilMillis=a+Y1,this.lastStepMillis=this.pauseUntilMillis}recordRound(e){this.lastRoundHits=this.hitCount,this.lastRoundWinner=this.labelForTeam(e),this.rounds=[...this.rounds,{index:this.rounds.length+1,winnerIndex:e,winnerLabel:this.lastRoundWinner,hits:this.lastRoundHits}]}resetBall(){this.ball={...this.ball,x:Di,y:qa},this.ballTrail=[],this.currentIntervalMillis=this.speed.initialMillis,this.hitCount=0,this.pauseUntilMillis=0,this.serve()}serve(){this.ball={x:Di,y:qa,dy:this.rng.int(2)===0?-1:1,dx:this.rng.int(2)===0?-1:1}}reflectFromPaddle(e,a){let i=a+Math.floor(Xa/2);e<i?this.ball.dx=-1:e>i?this.ball.dx=1:this.ball.dx=this.rng.int(2)===0?-1:1}accelerate(){this.hitCount+=1,this.currentIntervalMillis=Math.max(this.speed.minimumMillis,this.currentIntervalMillis/this.speed.hitMultiplier)}commitBall(e){this.ballTrail=[{x:this.ball.x,y:this.ball.y},...this.ballTrail.filter(a=>a.x!==this.ball.x||a.y!==this.ball.y)].slice(0,5),this.ball=e}recordImpact(e,a,i){this.lastImpact={team:e,x:a,y:i},this.lastImpactAtMillis=this.nowMillis,this.motionEventId+=1}drawWaiting(e){let a=this.halfReady(0,this.nowMillis),i=this.halfReady(1,this.nowMillis);this.drawWaitingHalf(e,0,a),this.drawWaitingHalf(e,1,i),a?this.drawSoftBar(e,3,5,10,Fa):this.drawBreathingOutline(e,0,Fa),i?this.drawSoftBar(e,3,24,10,Ya):this.drawBreathingOutline(e,1,Ya)}drawReady(e){let a=Hs(rt.start),i=Math.max(0,a-this.readyGate.state(this.nowMillis).countdownMillis),n=H(i/a,0,1)*(M*.7),s=.5+Math.sin(i/86)*.5;for(let r=0;r<M;r+=1)for(let o=0;o<x;o+=1){let u=Math.abs(o-Di)+Math.abs(r-qa),d=r>=M/2?Ya:Fa,p=Math.abs(u-n),f=Math.max(0,1-p/3.2),y=7+(Math.sin(o*.82+r*.38-i/120)+1)*4;f>0?b(e,o,r,pa(d,28+f*74,f*24)):u<n&&b(e,o,r,ja(d,y+s*10))}this.drawCenterLine(e,18+s*20),this.drawBallGlow(e),b(e,Di,qa,hl)}drawScoreFlash(e){let a=this.scorer===1?Ya:Fa,i=Math.max(0,this.nowMillis-this.pointAtMillis),l=H(i/Y1,0,1),n=this.scorer===0?M-1:0,s=l*(M+8);for(let r=0;r<M;r+=1)for(let o=0;o<x;o+=1){let u=Math.hypot((o-Di)*1.35,r-n),d=Math.max(0,1-Math.abs(u-s)/3.4),p=Math.sin(o*12.13+r*7.71+i/38)>.9?1:0,f=1-l;d>0?b(e,o,r,pa(a,28+d*82,d*34)):p>0&&f>.18&&b(e,o,r,pa(a,22+f*44,f*12))}this.drawCenterLine(e,12+(1-l)*24),this.drawPaddles(e)}drawWin(e){let a=this.winner===1?Ya:Fa,i=Math.max(0,this.nowMillis-this.finishAtMillis),l=i/92,n=.5+Math.sin(i/110)*.5;for(let r=0;r<M;r+=1)for(let o=0;o<x;o+=1){let d=((this.winner===0?M-1-r:r)+o*.72-l+M*4)%11,p=Math.sin(o*17.17+r*11.31+i/55);d<3.8?b(e,o,r,pa(a,38+(3.8-d)*15+n*12,12+n*18)):p>.91&&b(e,o,r,pa(a,48,32))}let s=64+n*26;z(e,Di-1,qa-1,3,3,ja(Tn,s)),b(e,Di,qa,hl)}drawArena(e){let a=this.nowMillis/185;for(let i=1;i<M-1;i+=1){let l=i<M/2?Fa:Ya;for(let n=0;n<x;n+=1){let s=(Math.sin(n*.78+i*.31-a)+1)*.5,r=(n+i)%3===0?4:0;b(e,n,i,ja(l,4+s*7+r))}}this.drawCenterLine(e,18+(Math.sin(this.nowMillis/140)+1)*5)}drawCenterLine(e,a){for(let i=0;i<x;i+=1)(i+Math.floor(this.nowMillis/120))%3===0&&(b(e,i,qa-1,pa(Tn,a,0)),b(e,i,qa,pa(Tn,a*.72,0)))}drawBallTrail(e){this.ballTrail.forEach((a,i)=>{let l=Math.max(10,46-i*8);b(e,a.x,a.y,ja(Tn,l))})}drawBallGlow(e){let a=20+(Math.sin(this.nowMillis/70)+1)*7;for(let[i,l]of[[-1,0],[1,0],[0,-1],[0,1]])b(e,this.ball.x+i,this.ball.y+l,ja(Tn,a))}drawImpact(e){if(!this.lastImpact)return;let a=this.nowMillis-this.lastImpactAtMillis;if(a<0||a>=480)return;let i=a/480,l=1+i*5.5,n=this.lastImpact.team===0?Fa:Ya;for(let s=Math.max(0,this.lastImpact.y-7);s<=Math.min(M-1,this.lastImpact.y+7);s+=1)for(let r=Math.max(0,this.lastImpact.x-7);r<=Math.min(x-1,this.lastImpact.x+7);r+=1){let o=Math.hypot(r-this.lastImpact.x,s-this.lastImpact.y),u=Math.max(0,1-Math.abs(o-l)/1.45);u>0&&b(e,r,s,pa(n,30+u*52,u*28*(1-i)))}}drawBreathingOutline(e,a,i){let l=(this.nowMillis/900+a*.5)%1,n=.5-Math.cos(l*Math.PI*2)*.5,s=Math.round(1+n*2),r=a===0?3+s:21-s,o=48+n*48;this.drawOutline(e,s,r,x-s*2,8,ja(i,o))}drawScore(e){for(let a=0;a<this.teamScore[0]&&a<x;a+=1)b(e,a,0,Va);for(let a=0;a<this.teamScore[1]&&a<x;a+=1)b(e,a,M-1,Za)}drawPaddles(e){this.drawPaddle(e,this.redPaddleX,cu,Fa),this.drawPaddle(e,this.bluePaddleX,du,Ya)}drawWaitingHalf(e,a,i){let l=a===1?M/2:0,n=a===1?Ya:Fa,s=Math.floor(this.nowMillis/120)%10;for(let r=l;r<l+M/2;r+=1)for(let o=0;o<x;o+=1){let u=0;i?u=18+(o+r+s)%6*6:(o+r+s)%7===0&&(u=22),u>0&&b(e,o,r,ja(n,u))}}drawSoftBar(e,a,i,l,n){let s=Math.floor(this.nowMillis/100)%6;for(let r=0;r<l;r+=1){let o=r===s||r===l-1-s?112:58+r*4;b(e,a+r,i,ja(n,o)),b(e,a+r,i+1,pa(n,o-8,10)),b(e,a+r,i+2,ja(n,Math.max(18,o-28)))}}drawPaddle(e,a,i,l){for(let n=0;n<Xa;n+=1){let s=n===Math.floor(Xa/2)?118:74;b(e,a+n,i,pa(l,s,18))}}drawOutline(e,a,i,l,n,s){let r=Math.max(2,Math.round(l)),o=Math.max(2,Math.round(n));z(e,a,i,r,1,s),z(e,a,i+o-1,r,1,s),z(e,a,i,1,o,s),z(e,a+r-1,i,1,o,s)}halfReady(e,a){return this.readyGate.zoneReady(e,a)}activeHalves(e){return this.readyGate.state(e).readyPlayers}labelForTeam(e){return this.players[e]?.label||(e===0?"Rojo":"Azul")}recordEvents(e){let a=e.at(-1);return a&&(this.lastEvent=a),e}};function X1(t){let e=je(t.options,Ni.initialBallSpeed),a=je(t.options,Ni.returnSpeedMultiplier),l=je(t.options,Ni.difficultyMultiplier)**oE(t.difficulty),n=e*l,s=1+(a-1)*l,r=n*rE;return{difficultyFactor:l,hitMultiplier:s,initialTilesPerSecond:n,initialMillis:1e3/n,minimumMillis:1e3/r}}function oE(t){switch(t){case"medium":return 1;case"hard":return 2;case"expert":return 3;default:return 0}}function ja(t,e){return ra(nt(t,e))}function pa(t,e,a){return ra(rl(nt(t,e),nt(Tn,a)))}var j1=(()=>{let t=J("#05070a");return z(t,5,2,5,1,Va),z(t,6,29,5,1,Za),b(t,8,16,hl),t})(),oh={currentGame:rt.id,label:rt.label,phase:"waiting",playerCount:2,players:[{index:0,label:"Rojo",color:Va,score:0,lives:-1},{index:1,label:"Azul",color:Za,score:0,lives:-1}],score:0,lives:-1,elapsedMillis:0,remainingMillis:0,activeTargets:0,success:!1,lastEventCue:"ready",lastEventMessage:"Ping Pong espera rojo y azul",countdownMillis:0,readyPlayers:0,requiredPlayers:2,matchTarget:5,roundHits:0,lastRoundHits:0,lastRoundWinner:"",rounds:[],ball:{x:8,y:16,dx:1,dy:1},ballTrail:[],rallyPace:0,pointScorer:-1,pointFlashMillis:0,winnerIndex:-1,impact:null,motionEventId:1,initialBallSpeed:6.9,ballSpeed:6.9,returnSpeedMultiplier:1.042,difficultySpeedFactor:1.2},uh={...oh,phase:"running",readyPlayers:2,elapsedMillis:8200,activeTargets:2,lastEventCue:"coin",lastEventMessage:"Azul devuelve",roundHits:3,ball:{x:11,y:21,dx:1,dy:1},ballTrail:[{x:10,y:20},{x:9,y:19},{x:8,y:18}],rallyPace:.1935,ballSpeed:7.8064,impact:{team:1,x:10,y:29,remainingMillis:180},motionEventId:4},V1={...uh,phase:"finished",score:5,remainingMillis:2400,success:!0,lastEventCue:"score",lastEventMessage:"Punto para azul",players:[{index:0,label:"Rojo",color:Va,score:2,lives:-1},{index:1,label:"Azul",color:Za,score:3,lives:-1}],lastRoundHits:2,lastRoundWinner:"Azul",pointScorer:1,winnerIndex:1,motionEventId:8,rounds:[{index:1,winnerIndex:0,winnerLabel:"Rojo",hits:1},{index:2,winnerIndex:1,winnerLabel:"Azul",hits:2}]};var yh={};Je(yh,{PlayerDisplay:()=>Z1,ballColor:()=>ml,blueColor:()=>$a,createGame:()=>k1,finishedSnapshot:()=>J1,manifest:()=>ot,pingPongV2ConfigVars:()=>Oi,redColor:()=>Wa,runningFrame:()=>K1,runningSnapshot:()=>ph,waitingSnapshot:()=>mh});var Ae=F(Q(),1);function dh(t){return{"--ping-pong-ball-x":`${3.5+t.y/31*93}%`,"--ping-pong-ball-y":`${18+t.x/15*64}%`}}function Z1({snapshot:t}){let[e,a]=t.players,i=e??{label:"Rojo",score:0,color:"#ff1c28"},l=a??{label:"Azul",score:0,color:"#145cff"},n=Math.max(t.matchTarget,1),s=n*2-1,r=t.phase==="starting"?"Empieza en":"Objetivo",o=t.phase==="starting"?$(t.countdownMillis):n,u=t.phase==="starting"?"preparados":"puntos para ganar",d=t.phase==="finished"?"\xDAltimo peloteo":"Peloteo",p=t.phase==="finished"&&t.lastRoundHits>0?t.lastRoundHits:t.roundHits,f=t.lastRoundWinner||"-",y=f===i.label?"red":f===l.label?"blue":"neutral",G=t.phase==="waiting"||t.phase==="starting",C=Math.min(s,t.rounds.length+(t.phase==="running"||t.phase==="starting"?1:0)),D=G?"Listos":"Ronda",h=G?`${t.activeTargets}/2`:`${C}/${s}`,c=t.phase==="running",m=t.phase==="finished"?null:Math.min(s,t.rounds.length+1),v=t.pointScorer===0?"red":t.pointScorer===1?"blue":"none",w=t.winnerIndex===0?"red":t.winnerIndex===1?"blue":"none",L=["ping-pong-display","ml-versus-display",`is-phase-${t.phase}`,t.pointFlashMillis>0?`is-scoring-${v}`:"",t.phase==="finished"?`is-winner-${w}`:""].filter(Boolean).join(" "),T=t.pointScorer===0?i.label:l.label,N=t.winnerIndex===0?i.label:l.label,E=t.phase==="waiting"?`${t.activeTargets}/2 en posici\xF3n`:t.phase==="starting"?"Preparados":t.phase==="finished"?`Victoria ${N}`:t.pointFlashMillis>0?`Punto ${T}`:t.roundHits>0?`${t.roundHits} ${t.roundHits===1?"golpe":"golpes"}`:"Saque",P=t.impact?dh(t.impact):void 0;return(0,Ae.jsx)(se,{title:t.label,phase:t.phase,variant:"versus",children:(0,Ae.jsxs)("div",{className:L,style:{"--ping-pong-rally-pace":t.rallyPace},children:[(0,Ae.jsx)(fn,{className:"ping-pong-scoreboard",left:i,right:l,target:n,centerLabel:r,centerValue:o,centerCaption:u}),(0,Ae.jsxs)("section",{"aria-label":`Trayectoria de la pelota: ${E}`,className:"ping-pong-rally-lane",children:[(0,Ae.jsx)("span",{className:"ping-pong-rally-team is-red",children:"Rojo"}),(0,Ae.jsx)("span",{className:"ping-pong-rally-team is-blue",children:"Azul"}),(0,Ae.jsx)("span",{className:"ping-pong-rally-net","aria-hidden":"true"}),(0,Ae.jsx)("span",{className:"ping-pong-rally-scan","aria-hidden":"true"}),t.ballTrail.map((ge,va)=>(0,Ae.jsx)("i",{"aria-hidden":"true",className:"ping-pong-ball-trail",style:{...dh(ge),"--ping-pong-trail-index":va}},`${va}-${ge.x}-${ge.y}`)),(0,Ae.jsx)("i",{"aria-hidden":"true",className:"ping-pong-ball",style:dh(t.ball)}),t.impact?(0,Ae.jsx)("i",{"aria-hidden":"true",className:`ping-pong-impact is-${t.impact.team===0?"red":"blue"}`,style:P},t.motionEventId):null,(0,Ae.jsx)("strong",{className:"ping-pong-rally-caption",children:E},`caption-${t.motionEventId}`)]}),(0,Ae.jsxs)(Me,{columns:4,className:"ping-pong-metrics",children:[(0,Ae.jsx)(A,{className:"ping-pong-rally-metric",label:d,tone:"cyan",value:p}),(0,Ae.jsx)(A,{className:"ping-pong-progress-metric",label:D,tone:G?"green":"yellow",value:h}),(0,Ae.jsx)(A,{className:"ping-pong-last-metric",label:"\xDAltimo",tone:y,value:f}),(0,Ae.jsx)(A,{className:"ping-pong-time-metric",label:"Tiempo",tone:"amber",value:$(t.elapsedMillis)})]}),(0,Ae.jsx)(hn,{className:"ping-pong-rounds",activeCaption:c?"Punto en curso":"Por comenzar",activeLabel:c?"En juego":"Siguiente",activeRound:m,rounds:t.rounds,totalRounds:s})]})})}var Oi={pointsToWin:{key:"points_to_win",label:"Points to win",playerFacing:!0,description:"The first team to reach this score wins.",type:"int",default:5,min:1,max:21,step:1},initialBallSpeed:{key:"initial_ball_speed",label:"Initial ball speed (tiles/s)",playerFacing:!1,description:"Starting ball speed on Easy before applying the difficulty curve.",type:"float",default:5.75,min:3,max:10,step:.25},returnSpeedMultiplier:{key:"return_speed_multiplier",label:"Speed multiplier per return",playerFacing:!1,description:"Rally acceleration after each successful paddle return.",type:"float",default:1.035,min:1,max:1.1,step:.005},difficultyMultiplier:{key:"difficulty_multiplier",label:"Difficulty multiplier step",playerFacing:!1,description:"Per-level multiplier for starting speed and return acceleration.",type:"float",default:1.2,min:1,max:1.35,step:.05}},ot={id:"ping-pong-v2",label:"Ping Pong v2",description:"La versi\xF3n competitiva de Ping Pong: peloteos acelerados y partidas al mejor de cinco puntos.",availability:{development:!0,production:!0},catalog:{category:"versus",color:"#145cff",durationLabel:"A 5 puntos",modeLabel:"Rojo contra azul",audioLabel:"M\xFAsica + efectos",rules:["Un equipo ocupa la mitad roja y otro la azul","Mueve la pala pisando tu mitad","Cada devoluci\xF3n acelera la pelota"]},players:{allowAny:!0,min:2,max:2},start:{mode:"player-ready",releaseGraceMillis:1e3},config:{difficulty:{default:"medium",options:["easy","medium","hard","expert"]},vars:Object.values(Oi)},defaultDurationMillis:0,display:{entry:"./display"},preview:{seed:202,playerCount:2,difficulty:"medium",options:{points_to_win:5},actions:[{atMillis:100,type:"press",x:7,y:3},{atMillis:100,type:"press",x:7,y:28}],captureStartMillis:2200,frameCount:18,frameIntervalMillis:120},tags:["arcade","versus","typescript","v2"]};var Wa="#ff1c28",$a="#145cff",ml="#ffffff",uE="#05070a",Ia={r:255,g:28,b:40},Qa={r:20,g:92,b:255},wn={r:255,g:255,b:255},I1=900,fh=3e3,fu=2,hu=29,ka=5,Hi=Math.floor(x/2),Ka=Math.floor(M/2),cE=2.5;function k1(t){return new hh(t)}var hh=class{config;rng;players;winningScore;speed;startedAtMillis=0;nowMillis=0;readyGate;lastStepMillis=0;pauseUntilMillis=0;finishAtMillis=0;currentIntervalMillis=140;hitCount=0;redPaddleX=0;bluePaddleX=0;ball={x:Hi,y:Ka,dx:1,dy:1};ballTrail=[];teamScore=[0,0];rounds=[];lastRoundHits=0;lastRoundWinner="";phase="waiting";success=!1;scorer=-1;winner=-1;pointAtMillis=0;lastImpactAtMillis=0;lastImpact=null;motionEventId=0;lastEvent=g("none","Listo",0);constructor(e){this.config=B(e,ot),this.rng=j(this.config.seed),this.readyGate=W(ot.start,mn(2),this.config.nowMillis),this.winningScore=this.readWinningScore(),this.players=this.createPlayers(),this.speed=Q1(this.config),this.resetGame(this.config.nowMillis)}init(e){return this.startedAtMillis=e,this.nowMillis=e,this.resetGame(e),this.lastEvent=g("ready","Ping Pong espera rojo y azul",e),[this.lastEvent]}press(e){this.nowMillis=e.atMillis;let a=this.readyGate.update(e);return e.pressed&&this.movePaddle(e.x,e.y),this.recordEvents(this.updatePhase(e.atMillis,a))}release(e){this.nowMillis=e.atMillis;let a=this.readyGate.update({...e,pressed:!1});return this.recordEvents(this.updatePhase(e.atMillis,a))}tick(e){this.nowMillis=e.atMillis;let a=this.updatePhase(e.atMillis,this.readyGate.tick(e.atMillis));if(this.phase!=="running"||e.atMillis<this.pauseUntilMillis)return this.recordEvents(a);for(let i=0;i<8&&!(e.atMillis-this.lastStepMillis<this.currentIntervalMillis);i+=1){this.lastStepMillis+=this.currentIntervalMillis;let l=this.moveBall(this.lastStepMillis);if(l&&a.push(l),this.phase!=="running"||this.lastStepMillis<this.pauseUntilMillis)break}return this.recordEvents(a)}render(){let e=J(uE);return this.phase==="waiting"?(this.drawWaiting(e),e):this.phase==="starting"?(this.drawReady(e),e):this.phase==="finished"?(this.drawWin(e),e):(this.drawArena(e),this.drawScore(e),this.nowMillis<this.pauseUntilMillis?this.drawScoreFlash(e):(this.drawBallTrail(e),this.drawImpact(e),this.drawPaddles(e),this.drawBallGlow(e),b(e,this.ball.x,this.ball.y,ml)),e)}snapshot(){this.recordEvents(this.updatePhase(this.nowMillis));let e=this.readyGate.state(this.nowMillis),a=this.phase==="starting"?e.countdownMillis:0,i=this.phase==="finished"&&this.nowMillis<this.finishAtMillis+fh?this.finishAtMillis+fh-this.nowMillis:0;return{currentGame:ot.id,label:ot.label,phase:this.phase,playerCount:this.config.playerCount,players:[{index:0,label:this.labelForTeam(0),color:Wa,score:this.teamScore[0],lives:-1},{index:1,label:this.labelForTeam(1),color:$a,score:this.teamScore[1],lives:-1}],score:this.teamScore[0]+this.teamScore[1],lives:-1,elapsedMillis:Math.max(0,this.nowMillis-this.startedAtMillis),remainingMillis:i,activeTargets:this.activeHalves(this.nowMillis),success:this.success,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:a,readyPlayers:e.readyPlayers,requiredPlayers:e.requiredPlayers,matchTarget:this.winningScore,roundHits:this.hitCount,lastRoundHits:this.lastRoundHits,lastRoundWinner:this.lastRoundWinner,rounds:this.rounds,ball:{...this.ball},ballTrail:this.ballTrail.map(l=>({...l})),rallyPace:this.speed.initialMillis===this.speed.minimumMillis?1:H((this.speed.initialMillis-this.currentIntervalMillis)/(this.speed.initialMillis-this.speed.minimumMillis),0,1),pointScorer:this.scorer,pointFlashMillis:Math.max(0,this.pauseUntilMillis-this.nowMillis),winnerIndex:this.winner,impact:this.lastImpact&&this.nowMillis-this.lastImpactAtMillis<480?{...this.lastImpact,remainingMillis:480-(this.nowMillis-this.lastImpactAtMillis)}:null,motionEventId:this.motionEventId,initialBallSpeed:this.speed.initialTilesPerSecond,ballSpeed:1e3/this.currentIntervalMillis,returnSpeedMultiplier:this.speed.hitMultiplier,difficultySpeedFactor:this.speed.difficultyFactor}}reset(e={}){this.config=B({...this.config,...e},ot),this.rng=j(this.config.seed),this.winningScore=this.readWinningScore(),this.players=this.createPlayers(),this.speed=Q1(this.config),this.motionEventId=0,this.resetGame(this.config.nowMillis),this.lastEvent=g("none","Listo",this.config.nowMillis)}createPlayers(){return[{index:0,label:"Rojo",color:Wa,score:0,lives:-1},{index:1,label:"Azul",color:$a,score:0,lives:-1}]}readWinningScore(){return je(this.config.options,Oi.pointsToWin)}resetGame(e){this.readyGate.reset(e),this.teamScore=[0,0],this.rounds=[],this.lastRoundHits=0,this.lastRoundWinner="",this.redPaddleX=Math.floor((x-ka)/2),this.bluePaddleX=this.redPaddleX,this.phase="waiting",this.success=!1,this.scorer=-1,this.winner=-1,this.pointAtMillis=0,this.lastImpactAtMillis=0,this.lastImpact=null,this.motionEventId+=1,this.startedAtMillis=e,this.finishAtMillis=0,this.resetBall(),this.lastEvent=g("none","Esperando a rojo arriba y azul abajo",e)}updatePhase(e,a=this.readyGate.tick(e)){return this.phase==="finished"?e-this.finishAtMillis>=fh?(this.resetGame(e),[g("ready","Nueva partida",e)]):[]:a==="players-ready"?(this.phase="starting",this.motionEventId+=1,[g("start","Rojo y azul listos",e)]):a==="players-left"?(this.phase="waiting",this.motionEventId+=1,[g("ready","Vuelve a las zonas roja y azul",e)]):a==="started"?(this.phase="running",this.startedAtMillis=e,this.lastStepMillis=e,this.serve(),this.motionEventId+=1,[g("start","La pelota esta en juego",e)]):[]}movePaddle(e,a){let l=H(Math.round(e),Math.floor(ka/2),x-1-Math.floor(ka/2))-Math.floor(ka/2);a<M/2?this.redPaddleX=l:this.bluePaddleX=l}moveBall(e){let a=this.ball.x+this.ball.dx,i=this.ball.y+this.ball.dy;if(a<0&&(a=0,this.ball.dx=1),a>=x&&(a=x-1,this.ball.dx=-1),this.ball.dy<0&&i===fu&&a>=this.redPaddleX&&a<this.redPaddleX+ka)return this.reflectFromPaddle(a,this.redPaddleX),this.commitBall({...this.ball,x:a,y:fu+1,dy:1}),this.recordImpact(0,a,fu),this.accelerate(),g("coin","Rojo devuelve",e);if(this.ball.dy>0&&i===hu&&a>=this.bluePaddleX&&a<this.bluePaddleX+ka)return this.reflectFromPaddle(a,this.bluePaddleX),this.commitBall({...this.ball,x:a,y:hu-1,dy:-1}),this.recordImpact(1,a,hu),this.accelerate(),g("coin","Azul devuelve",e);if(i<0)return this.scorePoint(1,e),g("score","Punto para azul",e);if(i>=M)return this.scorePoint(0,e),g("score","Punto para rojo",e);this.commitBall({...this.ball,x:a,y:i})}scorePoint(e,a){if(this.teamScore[e]+=1,this.scorer=e,this.pointAtMillis=a,this.motionEventId+=1,this.recordRound(e),this.teamScore[e]>=this.winningScore){this.phase="finished",this.success=e===1,this.winner=e,this.finishAtMillis=a;return}this.resetBall(),this.pauseUntilMillis=a+I1,this.lastStepMillis=this.pauseUntilMillis}recordRound(e){this.lastRoundHits=this.hitCount,this.lastRoundWinner=this.labelForTeam(e),this.rounds=[...this.rounds,{index:this.rounds.length+1,winnerIndex:e,winnerLabel:this.lastRoundWinner,hits:this.lastRoundHits}]}resetBall(){this.ball={...this.ball,x:Hi,y:Ka},this.ballTrail=[],this.currentIntervalMillis=this.speed.initialMillis,this.hitCount=0,this.pauseUntilMillis=0,this.serve()}serve(){this.ball={x:Hi,y:Ka,dy:this.rng.int(2)===0?-1:1,dx:this.rng.int(2)===0?-1:1}}reflectFromPaddle(e,a){let i=a+Math.floor(ka/2);e<i?this.ball.dx=-1:e>i?this.ball.dx=1:this.ball.dx=this.rng.int(2)===0?-1:1}accelerate(){this.hitCount+=1,this.currentIntervalMillis=Math.max(this.speed.minimumMillis,this.currentIntervalMillis/this.speed.hitMultiplier)}commitBall(e){this.ballTrail=[{x:this.ball.x,y:this.ball.y},...this.ballTrail.filter(a=>a.x!==this.ball.x||a.y!==this.ball.y)].slice(0,5),this.ball=e}recordImpact(e,a,i){this.lastImpact={team:e,x:a,y:i},this.lastImpactAtMillis=this.nowMillis,this.motionEventId+=1}drawWaiting(e){let a=this.halfReady(0,this.nowMillis),i=this.halfReady(1,this.nowMillis);this.drawWaitingHalf(e,0,a),this.drawWaitingHalf(e,1,i),a?this.drawSoftBar(e,3,5,10,Ia):this.drawBreathingOutline(e,0,Ia),i?this.drawSoftBar(e,3,24,10,Qa):this.drawBreathingOutline(e,1,Qa)}drawReady(e){let a=Hs(ot.start),i=Math.max(0,a-this.readyGate.state(this.nowMillis).countdownMillis),n=H(i/a,0,1)*(M*.7),s=.5+Math.sin(i/86)*.5;for(let r=0;r<M;r+=1)for(let o=0;o<x;o+=1){let u=Math.abs(o-Hi)+Math.abs(r-Ka),d=r>=M/2?Qa:Ia,p=Math.abs(u-n),f=Math.max(0,1-p/3.2),y=7+(Math.sin(o*.82+r*.38-i/120)+1)*4;f>0?b(e,o,r,ya(d,28+f*74,f*24)):u<n&&b(e,o,r,Ja(d,y+s*10))}this.drawCenterLine(e,18+s*20),this.drawBallGlow(e),b(e,Hi,Ka,ml)}drawScoreFlash(e){let a=this.scorer===1?Qa:Ia,i=Math.max(0,this.nowMillis-this.pointAtMillis),l=H(i/I1,0,1),n=this.scorer===0?M-1:0,s=l*(M+8);for(let r=0;r<M;r+=1)for(let o=0;o<x;o+=1){let u=Math.hypot((o-Hi)*1.35,r-n),d=Math.max(0,1-Math.abs(u-s)/3.4),p=Math.sin(o*12.13+r*7.71+i/38)>.9?1:0,f=1-l;d>0?b(e,o,r,ya(a,28+d*82,d*34)):p>0&&f>.18&&b(e,o,r,ya(a,22+f*44,f*12))}this.drawCenterLine(e,12+(1-l)*24),this.drawPaddles(e)}drawWin(e){let a=this.winner===1?Qa:Ia,i=Math.max(0,this.nowMillis-this.finishAtMillis),l=i/92,n=.5+Math.sin(i/110)*.5;for(let r=0;r<M;r+=1)for(let o=0;o<x;o+=1){let d=((this.winner===0?M-1-r:r)+o*.72-l+M*4)%11,p=Math.sin(o*17.17+r*11.31+i/55);d<3.8?b(e,o,r,ya(a,38+(3.8-d)*15+n*12,12+n*18)):p>.91&&b(e,o,r,ya(a,48,32))}let s=64+n*26;z(e,Hi-1,Ka-1,3,3,Ja(wn,s)),b(e,Hi,Ka,ml)}drawArena(e){let a=this.nowMillis/185;for(let i=1;i<M-1;i+=1){let l=i<M/2?Ia:Qa;for(let n=0;n<x;n+=1){let s=(Math.sin(n*.78+i*.31-a)+1)*.5,r=(n+i)%3===0?4:0;b(e,n,i,Ja(l,4+s*7+r))}}this.drawCenterLine(e,18+(Math.sin(this.nowMillis/140)+1)*5)}drawCenterLine(e,a){for(let i=0;i<x;i+=1)(i+Math.floor(this.nowMillis/120))%3===0&&(b(e,i,Ka-1,ya(wn,a,0)),b(e,i,Ka,ya(wn,a*.72,0)))}drawBallTrail(e){this.ballTrail.forEach((a,i)=>{let l=Math.max(10,46-i*8);b(e,a.x,a.y,Ja(wn,l))})}drawBallGlow(e){let a=20+(Math.sin(this.nowMillis/70)+1)*7;for(let[i,l]of[[-1,0],[1,0],[0,-1],[0,1]])b(e,this.ball.x+i,this.ball.y+l,Ja(wn,a))}drawImpact(e){if(!this.lastImpact)return;let a=this.nowMillis-this.lastImpactAtMillis;if(a<0||a>=480)return;let i=a/480,l=1+i*5.5,n=this.lastImpact.team===0?Ia:Qa;for(let s=Math.max(0,this.lastImpact.y-7);s<=Math.min(M-1,this.lastImpact.y+7);s+=1)for(let r=Math.max(0,this.lastImpact.x-7);r<=Math.min(x-1,this.lastImpact.x+7);r+=1){let o=Math.hypot(r-this.lastImpact.x,s-this.lastImpact.y),u=Math.max(0,1-Math.abs(o-l)/1.45);u>0&&b(e,r,s,ya(n,30+u*52,u*28*(1-i)))}}drawBreathingOutline(e,a,i){let l=(this.nowMillis/900+a*.5)%1,n=.5-Math.cos(l*Math.PI*2)*.5,s=Math.round(1+n*2),r=a===0?3+s:21-s,o=48+n*48;this.drawOutline(e,s,r,x-s*2,8,Ja(i,o))}drawScore(e){for(let a=0;a<this.teamScore[0]&&a<x;a+=1)b(e,a,0,Wa);for(let a=0;a<this.teamScore[1]&&a<x;a+=1)b(e,a,M-1,$a)}drawPaddles(e){this.drawPaddle(e,this.redPaddleX,fu,Ia),this.drawPaddle(e,this.bluePaddleX,hu,Qa)}drawWaitingHalf(e,a,i){let l=a===1?M/2:0,n=a===1?Qa:Ia,s=Math.floor(this.nowMillis/120)%10;for(let r=l;r<l+M/2;r+=1)for(let o=0;o<x;o+=1){let u=0;i?u=18+(o+r+s)%6*6:(o+r+s)%7===0&&(u=22),u>0&&b(e,o,r,Ja(n,u))}}drawSoftBar(e,a,i,l,n){let s=Math.floor(this.nowMillis/100)%6;for(let r=0;r<l;r+=1){let o=r===s||r===l-1-s?112:58+r*4;b(e,a+r,i,Ja(n,o)),b(e,a+r,i+1,ya(n,o-8,10)),b(e,a+r,i+2,Ja(n,Math.max(18,o-28)))}}drawPaddle(e,a,i,l){for(let n=0;n<ka;n+=1){let s=n===Math.floor(ka/2)?118:74;b(e,a+n,i,ya(l,s,18))}}drawOutline(e,a,i,l,n,s){let r=Math.max(2,Math.round(l)),o=Math.max(2,Math.round(n));z(e,a,i,r,1,s),z(e,a,i+o-1,r,1,s),z(e,a,i,1,o,s),z(e,a+r-1,i,1,o,s)}halfReady(e,a){return this.readyGate.zoneReady(e,a)}activeHalves(e){return this.readyGate.state(e).readyPlayers}labelForTeam(e){return this.players[e]?.label||(e===0?"Rojo":"Azul")}recordEvents(e){let a=e.at(-1);return a&&(this.lastEvent=a),e}};function Q1(t){let e=je(t.options,Oi.initialBallSpeed),a=je(t.options,Oi.returnSpeedMultiplier),l=je(t.options,Oi.difficultyMultiplier)**dE(t.difficulty),n=e*l,s=1+(a-1)*l,r=n*cE;return{difficultyFactor:l,hitMultiplier:s,initialTilesPerSecond:n,initialMillis:1e3/n,minimumMillis:1e3/r}}function dE(t){switch(t){case"medium":return 1;case"hard":return 2;case"expert":return 3;default:return 0}}function Ja(t,e){return ra(nt(t,e))}function ya(t,e,a){return ra(rl(nt(t,e),nt(wn,a)))}var K1=(()=>{let t=J("#05070a");return z(t,5,2,5,1,Wa),z(t,6,29,5,1,$a),b(t,8,16,ml),t})(),mh={currentGame:ot.id,label:ot.label,phase:"waiting",playerCount:2,players:[{index:0,label:"Rojo",color:Wa,score:0,lives:-1},{index:1,label:"Azul",color:$a,score:0,lives:-1}],score:0,lives:-1,elapsedMillis:0,remainingMillis:0,activeTargets:0,success:!1,lastEventCue:"ready",lastEventMessage:"Ping Pong espera rojo y azul",countdownMillis:0,readyPlayers:0,requiredPlayers:2,matchTarget:5,roundHits:0,lastRoundHits:0,lastRoundWinner:"",rounds:[],ball:{x:8,y:16,dx:1,dy:1},ballTrail:[],rallyPace:0,pointScorer:-1,pointFlashMillis:0,winnerIndex:-1,impact:null,motionEventId:1,initialBallSpeed:6.9,ballSpeed:6.9,returnSpeedMultiplier:1.042,difficultySpeedFactor:1.2},ph={...mh,phase:"running",readyPlayers:2,elapsedMillis:8200,activeTargets:2,lastEventCue:"coin",lastEventMessage:"Azul devuelve",roundHits:3,ball:{x:11,y:21,dx:1,dy:1},ballTrail:[{x:10,y:20},{x:9,y:19},{x:8,y:18}],rallyPace:.1935,ballSpeed:7.8064,impact:{team:1,x:10,y:29,remainingMillis:180},motionEventId:4},J1={...ph,phase:"finished",score:5,remainingMillis:2400,success:!0,lastEventCue:"score",lastEventMessage:"Punto para azul",players:[{index:0,label:"Rojo",color:Wa,score:2,lives:-1},{index:1,label:"Azul",color:$a,score:3,lives:-1}],lastRoundHits:2,lastRoundWinner:"Azul",pointScorer:1,winnerIndex:1,motionEventId:8,rounds:[{index:1,winnerIndex:0,winnerLabel:"Rojo",hits:1},{index:2,winnerIndex:1,winnerLabel:"Azul",hits:2}]};var bh={};Je(bh,{PlayerDisplay:()=>W1,createGame:()=>pu,finishedFrame:()=>rb,finishedSnapshot:()=>ob,initEvents:()=>tb,manifest:()=>Yt,runningFrame:()=>nb,runningSnapshot:()=>sb,saltosCelebrationMillis:()=>mu,saltosStartingLives:()=>Ks,startingSnapshot:()=>lb,waitingFrame:()=>ab,waitingSnapshot:()=>ib});var Gt=F(Q(),1);function W1({snapshot:t,frame:e}){return(0,Gt.jsx)(se,{title:t.label,phase:t.phase,children:(0,Gt.jsxs)("div",{className:"ml-solo-display",children:[(0,Gt.jsx)(Le,{snapshot:t}),(0,Gt.jsxs)("div",{className:"ml-solo-summary",children:[(0,Gt.jsxs)(Me,{columns:3,className:"ml-solo-number-row",children:[(0,Gt.jsx)(A,{label:"Saltos",tone:"green",value:t.score}),(0,Gt.jsx)(A,{label:"Tiempo",tone:"cyan",value:$(t.remainingMillis)}),(0,Gt.jsx)(A,{label:"Vida",tone:"red",value:(0,Gt.jsx)(Ut,{lives:t.lives,maxLives:t.maxLives})})]}),(0,Gt.jsx)(A,{className:"ml-solo-message",label:"Objetivo",tone:t.success?"green":"yellow",value:t.lastEventMessage||"Salta del azul al verde"})]}),e?(0,Gt.jsx)(qe,{className:"ml-solo-floor",frame:e,label:"Juego en el suelo"}):null]})})}var Yt={id:"saltos",label:"Saltos",description:"Salta entre plataformas seguras sin tocar la lava durante un minuto.",availability:{development:!0,production:!0},catalog:{category:"individual",color:"#ff9f45",durationLabel:"60s",modeLabel:"Saltos",audioLabel:"M\xFAsica + efectos",rules:["Espera en la plataforma azul","Salta a la plataforma verde","No pises la lava"]},players:{allowAny:!0,min:1,max:1},start:{mode:"player-ready"},defaultDurationMillis:6e4,config:{difficulty:{options:["easy","medium","hard"],default:"medium"}},display:{entry:"./display"},preview:{seed:137,playerCount:0,actions:[{atMillis:100,type:"press",x:8,y:4}],captureStartMillis:2300,frameCount:24,frameIntervalMillis:120},tags:["saltos","lava","typescript"]};var mu=5e3,Ks=1,gh={x:7,y:3},Li=3;function pu(t){return new vh(t)}var vh=class{config;current=gh;finishedAtMillis;lastEvent=g("none","Listo",0);lives=Ks;nowMillis=0;phase="ready";players;readyGate;rng;score=0;startedAtMillis=0;target=gh;constructor(e){this.config=B(e,Yt),this.readyGate=W(Yt.start,[{minX:5,maxX:10,minY:0,maxY:7}],this.config.nowMillis),this.rng=j(this.config.seed),this.players=this.scoredPlayers(),this.target=this.nextTarget(this.current)}init(e){return this.resetState(e),[this.lastEvent]}press(e){return this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update(e),e.atMillis):this.phase!=="running"||!e.pressed?[]:$1(e,this.current)?[]:$1(e,this.target)?(this.current=this.target,this.score+=1,this.players=this.scoredPlayers(),this.target=this.nextTarget(this.current),this.lastEvent=g("coin",`Salto ${this.score}`,e.atMillis),[this.lastEvent]):(this.lives=0,this.finish(!1,"Has pisado lava",e.atMillis))}release(e){return this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update({...e,pressed:!1}),e.atMillis):[]}tick(e){return this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.tick(e.atMillis),e.atMillis):this.phase==="finished"?e.atMillis-(this.finishedAtMillis??e.atMillis)>=mu?(this.resetState(e.atMillis),[this.lastEvent]):[]:this.phase==="running"&&this.remainingMillis()===0?this.finish(!0,`${this.score} saltos completados`,e.atMillis):[]}render(){let e=J("#170408");if(this.phase==="waiting"||this.phase==="starting"){let a=Math.floor(this.nowMillis/(this.phase==="starting"?100:180));return Ze(e,{centerX:8,centerY:4,radius:2+a%5,color:this.phase==="starting"?"#ffe176":"#1677ff"}),e}return this.paintLava(e),z(e,this.current.x,this.current.y,Li,Li,"#1677ff"),this.phase==="running"?(z(e,this.target.x,this.target.y,Li,Li,"#38e86b"),b(e,this.target.x+1,this.target.y+1,"#ffffff")):Ne(e,{color:this.lives>0?"#38e86b":"#ff263d",step:Math.floor((this.nowMillis-(this.finishedAtMillis??this.nowMillis))/140)}),e}snapshot(){let e=this.readyGate.state(this.nowMillis);return{currentGame:Yt.id,label:Yt.label,phase:this.phase,playerCount:this.config.playerCount,players:this.players,score:this.score,lives:this.lives,maxLives:Ks,elapsedMillis:this.elapsedMillis(),remainingMillis:this.remainingMillis(),activeTargets:this.phase==="running"?1:0,success:this.phase==="finished"&&this.lives>0,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?e.countdownMillis:0,readyPlayers:e.readyPlayers,requiredPlayers:e.requiredPlayers,currentPlatform:{...this.current},targetPlatform:this.phase==="running"?{...this.target}:void 0,celebrationMillis:this.phase==="finished"?Math.max(0,mu-(this.nowMillis-(this.finishedAtMillis??this.nowMillis))):0}}reset(e={}){this.config=B({...this.config,...e},Yt),this.resetState(this.config.nowMillis)}applyReadyTransition(e,a){if(e==="players-ready")this.phase="starting",this.lastEvent=g("ready","Jugador listo",a);else if(e==="players-left")this.phase="waiting",this.lastEvent=g("ready","Vuelve a la plataforma azul",a);else if(e==="started")this.phase="running",this.startedAtMillis=a,this.lastEvent=g("start","Salta del azul al verde",a);else return[];return[this.lastEvent]}elapsedMillis(){if(this.phase==="waiting"||this.phase==="starting")return 0;let e=this.finishedAtMillis??this.nowMillis;return Math.max(0,e-this.startedAtMillis)}finish(e,a,i){return this.phase="finished",this.finishedAtMillis=i,this.lastEvent=g(e?"win":"damage",a,i),[this.lastEvent]}nextTarget(e){for(let a=0;a<20;a+=1){let i={x:this.rng.range(0,x-Li),y:this.rng.range(0,M-Li)};if(Math.abs(i.x-e.x)+Math.abs(i.y-e.y)>=7)return i}return{x:e.x<8?12:1,y:e.y<16?25:3}}paintLava(e){let a=Math.floor(this.nowMillis/180);for(let i=0;i<M;i+=1)for(let l=0;l<x;l+=1)b(e,l,i,(l*3+i+a)%11<2?"#ff5a1f":"#b20d21")}resetState(e){this.readyGate.reset(e),this.rng=j(this.config.seed),this.current={...gh},this.target=this.nextTarget(this.current),this.finishedAtMillis=void 0,this.lastEvent=g("ready","Espera en la plataforma azul",e),this.lives=Ks,this.nowMillis=e,this.phase="waiting",this.score=0,this.startedAtMillis=e,this.players=this.scoredPlayers()}remainingMillis(){return Math.max(0,this.config.durationMillis-this.elapsedMillis())}scoredPlayers(){return Ee(this.config.playerCount,this.config.players).map(e=>({...e,score:this.score,lives:this.lives}))}};function $1(t,e){return t.x>=e.x&&t.x<e.x+Li&&t.y>=e.y&&t.y<e.y+Li}var Ct=pu({playerCount:0,durationMillis:Yt.defaultDurationMillis,seed:137}),tb=Ct.init(0),ab=Ct.render(),ib=Ct.snapshot();Ct.press({x:8,y:4,pressed:!0,atMillis:100});var lb=Ct.snapshot();Ct.tick({atMillis:2100});var nb=Ct.render(),sb=Ct.snapshot(),eb=Ct.snapshot().targetPlatform;eb&&Ct.press({...eb,pressed:!0,atMillis:2200});Ct.tick({atMillis:62100});var rb=Ct.render(),ob=Ct.snapshot();var Th={};Je(Th,{PlayerDisplay:()=>ub,blueColor:()=>Ws,blueFieldColor:()=>er,blueFieldFirstRow:()=>An,centerLineColor:()=>tr,createGame:()=>Ui,finishedFrame:()=>Mb,finishedSnapshot:()=>xb,gameWinAnimationMillis:()=>Rn,initEvents:()=>db,knotColor:()=>pl,manifest:()=>kt,onBlueTilePressed:()=>ti,onRedTilePressed:()=>gl,redColor:()=>Js,redFieldColor:()=>$s,redFieldLastRow:()=>lr,ropeColor:()=>xh,ropeLimit:()=>ei,roundTransitionMillis:()=>cb,roundWinAnimationMillis:()=>zn,roundWinFrame:()=>vb,roundWinSnapshot:()=>bb,roundsToWin:()=>Sh,runningFrame:()=>yb,runningSnapshot:()=>gb,startingFrame:()=>mb,startingSnapshot:()=>pb,teamForTile:()=>ir,teamLabel:()=>yl,tiraSogaReadyZones:()=>yu,totalRounds:()=>ar,waitingFrame:()=>fb,waitingSnapshot:()=>hb});var oe=F(Q(),1),fE=`
.tira-soga-display {
  display: grid;
  gap: 18px;
  grid-template-rows: minmax(220px, .72fr) minmax(150px, .42fr) 108px minmax(210px, .54fr);
  min-height: 0;
  position: relative;
}
.tira-soga-scoreboard .ml-player-score-panel > strong { font-size: clamp(132px, 9vw, 190px); }
.tira-soga-scoreboard .ml-versus-center strong { font-size: clamp(64px, 4.6vw, 92px); }
.tira-soga-arena {
  align-items: stretch;
  background: linear-gradient(90deg, rgba(255,28,40,.17), rgba(7,10,17,.92) 31%, rgba(7,10,17,.92) 69%, rgba(20,92,255,.2));
  border: 1px solid rgba(255,255,255,.2);
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr) 150px;
  min-height: 0;
  overflow: hidden;
  position: relative;
}
.tira-soga-team {
  align-content: center;
  display: grid;
  font-size: 28px;
  font-weight: 950;
  letter-spacing: .1em;
  text-align: center;
  text-transform: uppercase;
}
.tira-soga-team.is-red { background: rgba(255,28,40,.2); color: #ff7b84; }
.tira-soga-team.is-blue { background: rgba(20,92,255,.22); color: #79a0ff; }
.tira-soga-track {
  align-self: center;
  height: 78px;
  margin: 0 42px;
  position: relative;
}
.tira-soga-rope {
  background: repeating-linear-gradient(105deg, #8d571d 0 8px, #f4c56a 8px 16px, #b87527 16px 24px);
  box-shadow: 0 0 24px rgba(244,197,106,.32);
  height: 18px;
  left: 0;
  position: absolute;
  right: 0;
  top: 30px;
}
.tira-soga-center {
  background: rgba(255,255,255,.65);
  bottom: 2px;
  left: 50%;
  position: absolute;
  top: 2px;
  width: 2px;
}
.tira-soga-knot {
  background: #fff7d6;
  border: 6px solid #d99331;
  border-radius: 50%;
  box-shadow: 0 0 0 7px rgba(255,159,28,.16), 0 0 30px rgba(255,247,214,.8);
  height: 42px;
  left: var(--tira-soga-rope-x);
  position: absolute;
  top: 18px;
  transform: translateX(-50%);
  transition: left 160ms cubic-bezier(.2,.9,.2,1);
  width: 42px;
  z-index: 2;
}
.tira-soga-caption {
  bottom: 8px;
  color: #fff;
  font-size: 25px;
  font-weight: 950;
  left: 190px;
  letter-spacing: .04em;
  position: absolute;
  right: 190px;
  text-align: center;
  text-shadow: 0 2px 12px #000;
}
.tira-soga-result {
  align-content: center;
  background: rgba(3,6,12,.88);
  display: grid;
  inset: 0;
  justify-items: center;
  position: absolute;
  z-index: 4;
}
.tira-soga-result strong { color: #fff; font-size: 54px; line-height: 1; }
.tira-soga-result span { color: #f4c56a; font-size: 21px; font-weight: 900; margin-top: 10px; text-transform: uppercase; }
.tira-soga-display.is-phase-waiting .tira-soga-knot {
  animation: tira-soga-waiting 1.25s ease-in-out infinite;
}
.tira-soga-display.is-phase-starting .tira-soga-rope {
  animation: tira-soga-starting .36s linear infinite;
}
.tira-soga-result.is-round-win {
  animation: tira-soga-round-win .52s ease-in-out infinite alternate;
  background: rgba(3,6,12,.82);
}
.tira-soga-result.is-game-win {
  animation: tira-soga-game-win .8s ease-in-out infinite alternate;
  background: linear-gradient(110deg, rgba(3,6,12,.9), rgba(244,197,106,.24), rgba(3,6,12,.9));
  background-size: 220% 100%;
}
.tira-soga-result.is-game-win strong { font-size: 68px; }
@keyframes tira-soga-waiting {
  0%, 100% { box-shadow: 0 0 0 5px rgba(255,159,28,.12), 0 0 18px rgba(255,247,214,.5); }
  50% { box-shadow: 0 0 0 12px rgba(255,159,28,.25), 0 0 38px rgba(255,247,214,.95); }
}
@keyframes tira-soga-starting {
  from { background-position: 0 0; }
  to { background-position: 24px 0; }
}
@keyframes tira-soga-round-win {
  from { box-shadow: inset 0 0 35px rgba(244,197,106,.2); }
  to { box-shadow: inset 0 0 90px rgba(244,197,106,.58); }
}
@keyframes tira-soga-game-win {
  from { background-position: 0 0; }
  to { background-position: 100% 0; }
}
@media (prefers-reduced-motion: reduce) {
  .tira-soga-display .tira-soga-knot,
  .tira-soga-display .tira-soga-rope,
  .tira-soga-display .tira-soga-result {
    animation: none !important;
    transition: none !important;
  }
}
.tira-soga-metrics .ml-metric { padding-block: 20px; }
.tira-soga-metrics .ml-metric-value { font-size: 52px; }
.tira-soga-rounds {
  gap: 8px;
  grid-template-rows: auto 5px minmax(76px, 1fr);
  padding: 14px 18px 16px;
}
.tira-soga-rounds .ml-round-strip-title { gap: 4px; }
.tira-soga-rounds .ml-round-strip-title > span { font-size: 20px; }
.tira-soga-rounds .ml-round-strip-title small { font-size: 13px; }
.tira-soga-rounds .ml-round-strip-count strong { font-size: 36px; }
.tira-soga-rounds .ml-round-strip-count span { font-size: 15px; }
.tira-soga-rounds .ml-round-card {
  align-content: start;
  gap: 5px;
  padding: 9px 12px 12px;
}
.tira-soga-rounds .ml-round-card-head span { font-size: 14px; }
.tira-soga-rounds .ml-round-card strong {
  font-size: 21px;
  line-height: 1.05;
}
.tira-soga-rounds .ml-round-card b {
  font-size: 12px;
  line-height: 1.15;
  white-space: normal;
}
`;function ub({snapshot:t}){let[e,a]=t.players,i=e??{label:"Rojo",score:0,color:"#ff1c28"},l=a??{label:"Azul",score:0,color:"#145cff"},n=t.currentRound??1,s=t.totalRounds??5,r=t.pressesPerAdvance??1,o=t.ropePosition??0,u=t.ropeLimit??6,d=t.rounds??[],p=50+o/Math.max(u,1)*43,f=t.winnerIndex===0?"Rojo":"Azul",y=t.roundWinnerIndex===0?"Rojo":"Azul",G=t.phase!=="finished"&&t.roundWinnerIndex!==-1,C=t.phase==="waiting"||t.phase==="starting",D=t.phase==="waiting"?"Listos":t.phase==="starting"?"Empieza en":"Ronda",h=t.phase==="waiting"?`${t.readyPlayers??0}/${t.requiredPlayers??2}`:t.phase==="starting"?$(t.countdownMillis??0):`${n}/${s}`,c=C?t.phase==="waiting"?"en posici\xF3n":"preparados":`${t.difficultyLabel??"Medio"} \xB7 ${r} ${r===1?"pisada":"pisadas"} por avance`,m=t.phase==="finished"?`Victoria ${f}`:G?`Ronda para ${y.toLowerCase()}`:o===0?"\xA1Pisad vuestro campo para tirar!":o<0?"Rojo toma ventaja":"Azul toma ventaja";return(0,oe.jsx)(se,{title:t.label,phase:t.phase,variant:"versus",children:(0,oe.jsxs)("div",{className:`tira-soga-display is-phase-${t.phase}`,style:{"--tira-soga-rope-x":`${p}%`},children:[(0,oe.jsx)("style",{children:fE}),(0,oe.jsx)(Le,{snapshot:t}),(0,oe.jsx)(fn,{className:"tira-soga-scoreboard",left:i,right:l,target:t.matchTarget??3,centerLabel:D,centerValue:h,centerCaption:c}),(0,oe.jsxs)("section",{className:"tira-soga-arena","aria-label":`Posici\xF3n de la soga: ${o}`,children:[(0,oe.jsx)("span",{className:"tira-soga-team is-red",children:"Rojo"}),(0,oe.jsxs)("div",{className:"tira-soga-track","aria-hidden":"true",children:[(0,oe.jsx)("i",{className:"tira-soga-rope"}),(0,oe.jsx)("i",{className:"tira-soga-center"}),(0,oe.jsx)("i",{className:"tira-soga-knot"})]}),(0,oe.jsx)("span",{className:"tira-soga-team is-blue",children:"Azul"}),(0,oe.jsx)("strong",{className:"tira-soga-caption",children:m}),t.phase==="finished"?(0,oe.jsxs)("div",{className:"tira-soga-result is-game-win",children:[(0,oe.jsxs)("strong",{children:["\xA1Gana ",f,"!"]}),(0,oe.jsxs)("span",{children:["Resultado final ",i.score," \u2013 ",l.score]})]}):G?(0,oe.jsxs)("div",{className:"tira-soga-result is-round-win",children:[(0,oe.jsxs)("strong",{children:["Ronda para ",y]}),(0,oe.jsx)("span",{children:"Siguiente ronda en breve"})]}):null]}),(0,oe.jsxs)(Me,{columns:4,className:"tira-soga-metrics",children:[(0,oe.jsx)(A,{label:"Pisadas rojas",tone:"red",value:t.redPresses??0}),(0,oe.jsx)(A,{label:"Avance rojo",tone:"amber",value:`${t.redProgress??0}/${r}`}),(0,oe.jsx)(A,{label:"Avance azul",tone:"cyan",value:`${t.blueProgress??0}/${r}`}),(0,oe.jsx)(A,{label:"Pisadas azules",tone:"blue",value:t.bluePresses??0})]}),(0,oe.jsx)(hn,{className:"tira-soga-rounds",activeCaption:"Soga en juego",activeLabel:"En juego",activeRound:t.phase==="finished"?null:n,rounds:d,totalRounds:s})]})})}var kt={id:"tira-soga",label:"Tira-Soga",description:"Five-round team tug of war driven by rapid presses on the red and blue floor halves.",availability:{development:!0,production:!1},catalog:{category:"versus",color:"#ff9f1c",durationLabel:"Sin l\xEDmite",modeLabel:"Tira y afloja",audioLabel:"Efectos",rules:["Rojo ocupa la mitad superior y azul la inferior","Pisa r\xE1pidamente tu campo para arrastrar la soga","Gana tres de las cinco rondas"]},players:{allowAny:!0,min:2,max:2},start:{mode:"player-ready",countdownMillis:3e3,releaseGraceMillis:2e3},config:{difficulty:{default:"medium",options:["easy","medium","hard"]}},defaultDurationMillis:0,display:{entry:"./display"},preview:{seed:137,playerCount:2,difficulty:"medium",actions:[{atMillis:100,type:"press",x:4,y:8},{atMillis:100,type:"press",x:11,y:24}],captureStartMillis:3200,frameCount:18,frameIntervalMillis:120},tags:["competitive","teams","two-player","typescript"]};var Js="#ff1c28",Ws="#145cff",$s="#720c17",er="#0b3189",tr="#ff9f1c",xh="#f4c56a",pl="#fff7d6",ar=5,Sh=3,ei=6,zn=1800,Rn=5e3,cb=zn,lr=14,An=17,hE={easy:1,medium:2,hard:3},mE={easy:"F\xE1cil",medium:"Medio",hard:"Dif\xEDcil"};function Ui(t){return new Mh(t)}function yu(){return[{minX:0,maxX:x-1,minY:0,maxY:lr},{minX:0,maxX:x-1,minY:An,maxY:M-1}]}var Mh=class{config;phase="waiting";startedAtMillis=0;nowMillis=0;ropePosition=0;teamScore=[0,0];teamPresses=[0,0];teamProgress=[0,0];rounds=[];roundWinnerIndex=-1;winnerIndex=-1;roundWonAtMillis=0;roundPauseUntilMillis=0;finishAtMillis=0;motionEventId=0;readyZones=yu();readyGate;heldTiles=Array.from({length:x*M},()=>!1);flashUntil=Array.from({length:x*M},()=>0);lastEvent=g("none","Listos para tirar",0);constructor(e){this.config=B(e,kt),this.readyGate=W(kt.start,this.readyZones,this.config.nowMillis),this.resetMatch(this.config.nowMillis)}init(e){return this.resetMatch(e),this.lastEvent=g("ready","Tira-Soga espera a rojo y azul",e),[this.lastEvent]}press(e){this.nowMillis=e.atMillis;let a=this.readyGate.update(e);if(this.phase==="waiting"||this.phase==="starting")return this.recordEvents(this.applyReadyTransition(a,e.atMillis));if(!e.pressed||this.phase!=="running"||this.roundWinnerIndex!==-1)return[];let i=this.tileIndex(e.x,e.y),l=ir(e.x,e.y);if(i===-1||l===-1||this.heldTiles[i])return[];this.heldTiles[i]=!0,this.flashUntil[i]=e.atMillis+220,this.teamPresses[l]+=1,this.teamProgress[l]+=1;let n=this.pressesPerAdvance();return this.teamProgress[l]<n?this.recordEvents([g("hit",`${yl(l)} suma ${this.teamProgress[l]} de ${n}`,e.atMillis)]):(this.teamProgress[l]=0,this.ropePosition+=l===0?-1:1,Math.abs(this.ropePosition)>=ei?this.recordEvents([this.finishRound(l,e.atMillis)]):this.recordEvents([g("hit",`${yl(l)} tira de la soga`,e.atMillis)]))}release(e){this.nowMillis=e.atMillis;let a=this.tileIndex(e.x,e.y);a!==-1&&(this.heldTiles[a]=!1);let i=this.readyGate.update({...e,pressed:!1});return this.phase==="waiting"||this.phase==="starting"?this.recordEvents(this.applyReadyTransition(i,e.atMillis)):[]}tick(e){this.nowMillis=e.atMillis;let a=this.updateLifecycle(e.atMillis,this.readyGate.tick(e.atMillis));return this.phase==="running"&&this.roundWinnerIndex!==-1&&e.atMillis>=this.roundPauseUntilMillis&&(this.startNextRound(),a.push(g("start",`Ronda ${this.currentRound()}: \xA1a tirar!`,e.atMillis))),this.recordEvents(a)}render(){let e=J("#05070a");return this.phase==="waiting"?(this.drawWaiting(e),e):this.phase==="starting"?(this.drawStarting(e),e):this.phase==="finished"?(this.drawGameWin(e),e):(this.drawArena(e),this.roundWinnerIndex!==-1&&this.drawRoundWin(e),e)}snapshot(){let e=this.readyGate.state(this.nowMillis),a=this.scoredPlayers(),i=Math.max(0,this.roundPauseUntilMillis-this.nowMillis),l=this.phase==="finished"?Math.max(0,this.finishAtMillis+Rn-this.nowMillis):0;return{currentGame:kt.id,label:kt.label,phase:this.phase,playerCount:this.config.playerCount,players:a,score:Math.max(...this.teamScore),lives:-1,elapsedMillis:this.phase==="waiting"||this.phase==="starting"?0:Math.max(0,(this.phase==="finished"?this.finishAtMillis:this.nowMillis)-this.startedAtMillis),remainingMillis:l||i,activeTargets:this.phase==="running"&&this.roundWinnerIndex===-1?2:0,success:this.phase==="finished",lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?e.countdownMillis:0,readyPlayers:e.readyPlayers,requiredPlayers:e.requiredPlayers,matchTarget:Sh,roundHits:this.teamPresses[0]+this.teamPresses[1],lastRoundHits:this.rounds.at(-1)?.hits??0,lastRoundWinner:this.rounds.at(-1)?.winnerLabel??"",difficulty:this.config.difficulty,difficultyLabel:mE[this.config.difficulty]??"Medio",pressesPerAdvance:this.pressesPerAdvance(),ropePosition:this.ropePosition,ropeLimit:ei,redPresses:this.teamPresses[0],bluePresses:this.teamPresses[1],redProgress:this.teamProgress[0],blueProgress:this.teamProgress[1],currentRound:this.currentRound(),totalRounds:ar,rounds:this.rounds.map(n=>({...n})),roundWinnerIndex:this.roundWinnerIndex,roundTransitionMillis:i,winnerIndex:this.winnerIndex,motionEventId:this.motionEventId}}reset(e={}){this.config=B({...this.config,...e,options:{...this.config.options,...e.options}},kt),this.readyZones=yu(),this.readyGate=W(kt.start,this.readyZones,this.config.nowMillis),this.resetMatch(this.config.nowMillis),this.lastEvent=g("ready","Tira-Soga espera a rojo y azul",this.config.nowMillis)}playerReadyZones(){return this.readyZones.map(e=>({...e}))}updateLifecycle(e,a){return this.phase==="finished"?e-this.finishAtMillis>=Rn?(this.resetMatch(e),[g("ready","Nueva partida",e)]):[]:this.applyReadyTransition(a,e)}applyReadyTransition(e,a){return e==="players-ready"?(this.phase="starting",this.motionEventId+=1,[g("start","Rojo y azul listos",a)]):e==="players-left"?(this.phase="waiting",this.motionEventId+=1,[g("ready","Vuelve a tu campo iluminado",a)]):e==="started"?(this.phase="running",this.startedAtMillis=a,this.motionEventId+=1,[g("start","Ronda 1: \xA1a tirar!",a)]):[]}finishRound(e,a){let i=this.currentRound(),l=this.teamPresses[0]+this.teamPresses[1];return this.teamScore[e]+=1,this.roundWinnerIndex=e,this.roundWonAtMillis=a,this.rounds.push({index:i,winnerIndex:e,winnerLabel:yl(e),hits:l}),this.motionEventId+=1,this.rounds.length>=ar?(this.phase="finished",this.finishAtMillis=a,this.winnerIndex=this.teamScore[0]>this.teamScore[1]?0:1,g("win",`${yl(this.winnerIndex)} gana Tira-Soga`,a)):(this.roundPauseUntilMillis=a+zn,g("hit",`Ronda ${i} para ${yl(e).toLowerCase()}`,a))}startNextRound(){this.ropePosition=0,this.teamPresses=[0,0],this.teamProgress=[0,0],this.roundWinnerIndex=-1,this.roundWonAtMillis=0,this.roundPauseUntilMillis=0,this.heldTiles.fill(!1),this.flashUntil.fill(0),this.motionEventId+=1}resetMatch(e){this.readyGate.reset(e),this.phase="waiting",this.startedAtMillis=e,this.nowMillis=e,this.ropePosition=0,this.teamScore=[0,0],this.teamPresses=[0,0],this.teamProgress=[0,0],this.rounds=[],this.roundWinnerIndex=-1,this.winnerIndex=-1,this.roundWonAtMillis=0,this.roundPauseUntilMillis=0,this.finishAtMillis=0,this.heldTiles.fill(!1),this.flashUntil.fill(0),this.motionEventId=0,this.motionEventId+=1}currentRound(){return Math.min(ar,this.rounds.length+(this.roundWinnerIndex===-1?1:0))}pressesPerAdvance(){return hE[this.config.difficulty]??2}ropeTileY(e=this.ropePosition){let a=(e+ei)/(ei*2);return Math.round(a*(M-1))}scoredPlayers(){return[{index:0,label:"Rojo",color:Js,score:this.teamScore[0],lives:-1},{index:1,label:"Azul",color:Ws,score:this.teamScore[1],lives:-1}]}tileIndex(e,a){return!Number.isInteger(e)||!Number.isInteger(a)||!sa(e,a)?-1:a*x+e}recordEvents(e){let a=e.at(-1);return a&&(this.lastEvent=a),e}drawWaiting(e){this.drawBaseFields(e,"#410912","#071f5a");let a=Math.floor(this.nowMillis/180);for(let i=0;i<M;i+=1){let l=ir(0,i);l===-1||(i+a)%5!==0||z(e,0,i,x,1,l===0?$s:er)}this.drawRope(e,0)}drawStarting(e){this.drawBaseFields(e,$s,er),Ne(e,{bandWidth:2,period:7,step:Math.floor(this.nowMillis/90),color:({y:a})=>a<M/2?"#ff7b84":"#79a0ff"}),this.drawRope(e,0)}drawArena(e){let a=this.roundWinnerIndex;this.drawBaseFields(e,a===0?Js:$s,a===1?Ws:er),this.drawRope(e,this.ropePosition);for(let i=0;i<this.flashUntil.length;i+=1){if((this.flashUntil[i]??0)<=this.nowMillis)continue;let l=i%x,n=Math.floor(i/x),s=ir(l,n);s!==-1&&b(e,l,n,s===0?"#ff8a92":"#73a0ff")}}drawRoundWin(e){let a=this.roundWinnerIndex;if(a===-1)return;let i=Math.max(0,this.nowMillis-this.roundWonAtMillis),l=a===0?0:M-1;Ze(e,{centerX:(x-1)/2,centerY:l,color:pl,radius:i/80%24,thickness:1.4}),Ze(e,{centerX:(x-1)/2,centerY:l,color:tr,radius:(i/80+7)%24,thickness:1})}drawGameWin(e){let a=this.winnerIndex===0?Js:Ws;z(e,0,0,x,M,a);let i=Math.max(0,this.nowMillis-this.finishAtMillis);Ne(e,{bandWidth:2,period:9,step:Math.floor(i/80),color:tr});for(let l=0;l<M;l+=1)for(let n=0;n<x;n+=1)(n*17+l*11+Math.floor(i/120))%37===0&&b(e,n,l,pl)}drawBaseFields(e,a,i){z(e,0,0,x,lr+1,a),z(e,0,An,x,M-An,i),z(e,0,15,x,2,tr)}drawRope(e,a){z(e,7,0,2,M,xh);let i=this.ropeTileY(a);z(e,5,i,6,1,pl),i>0&&z(e,7,i-1,2,1,pl),i<M-1&&z(e,7,i+1,2,1,pl)}};function ir(t,e){return!Number.isInteger(t)||!Number.isInteger(e)||!sa(t,e)?-1:e<=lr?0:e>=An?1:-1}function yl(t){return t===0?"Rojo":"Azul"}function gl(t,e,a=4,i=8){let l=t.press({x:a,y:i,pressed:!0,atMillis:e});return t.release({x:a,y:i,pressed:!1,atMillis:e+1}),l}function ti(t,e,a=11,i=24){let l=t.press({x:a,y:i,pressed:!0,atMillis:e});return t.release({x:a,y:i,pressed:!1,atMillis:e+1}),l}var Gh=Ui({playerCount:2,difficulty:"medium"}),db=Gh.init(0),fb=Gh.render(),hb=Gh.snapshot(),nr=Ui({playerCount:2,difficulty:"hard"});nr.init(0);Sb(nr,100);nr.tick({atMillis:1100});var mb=nr.render(),pb=nr.snapshot(),Kt=Ui({playerCount:2,difficulty:"medium"});Kt.init(0);Ch(Kt);gl(Kt,3200);gl(Kt,3300);ti(Kt,3400);ti(Kt,3500);ti(Kt,3600);ti(Kt,3700);ti(Kt,3800);var yb=Kt.render(),gb=Kt.snapshot(),_n=Ui({playerCount:2,difficulty:"easy"});_n.init(0);Ch(_n);var Eh=3200;for(let t=0;t<ei;t+=1)gl(_n,Eh),Eh+=30;_n.tick({atMillis:Eh+500});var vb=_n.render(),bb=_n.snapshot(),Nn=Ui({playerCount:2,difficulty:"easy"});Nn.init(0);Ch(Nn);var Pn=3200;function pE(t,e){for(let a=0;a<ei;a+=1)e===0?gl(t,Pn):ti(t,Pn),Pn+=30;t.snapshot().phase!=="finished"&&(Pn+=zn,t.tick({atMillis:Pn}))}for(let t of[0,1,0,1,0])pE(Nn,t);Nn.tick({atMillis:Pn+Math.floor(Rn/3)});var Mb=Nn.render(),xb=Nn.snapshot();function Sb(t,e){for(let a of t.playerReadyZones())t.press({x:a.minX+2,y:a.minY+2,pressed:!0,atMillis:e})}function Ch(t){Sb(t,100),t.tick({atMillis:3100});for(let e of t.playerReadyZones())t.release({x:e.minX+2,y:e.minY+2,pressed:!1,atMillis:3101})}var Ph={};Je(Ph,{PlayerDisplay:()=>Gb,createGame:()=>vu,manifest:()=>ga,runningFrame:()=>Db,runningSnapshot:()=>Ob,startingFrame:()=>_b,startingSnapshot:()=>Nb,tetrisConfigVars:()=>sr,waitingFrame:()=>Ab,waitingSnapshot:()=>zb});var K=F(Q(),1);function Gb({snapshot:t,frame:e}){let a=gE(t);return(0,K.jsx)(se,{title:t.label,phase:t.phase,children:(0,K.jsxs)("div",{className:`tetris-display is-${t.result}`,children:[(0,K.jsx)(Le,{snapshot:t}),(0,K.jsxs)("section",{className:"tetris-summary",children:[(0,K.jsxs)("div",{className:"tetris-callout",children:[(0,K.jsx)("span",{children:a.eyebrow}),(0,K.jsx)("strong",{children:a.title}),(0,K.jsx)("b",{children:a.caption})]}),(0,K.jsxs)(Me,{columns:4,className:"tetris-metrics",children:[(0,K.jsx)(A,{label:"Puntos",tone:"cyan",value:t.score}),(0,K.jsx)(A,{label:"L\xEDneas",tone:"yellow",value:`${t.lines}/${t.linesTarget}`}),(0,K.jsx)(A,{label:"Nivel",tone:"magenta",value:t.level}),(0,K.jsx)(A,{label:"Tiempo",tone:"amber",value:$(t.elapsedMillis)})]})]}),(0,K.jsxs)("section",{className:"tetris-main",children:[e?(0,K.jsx)(qe,{className:"tetris-floor",frame:e,label:"Pista de Tetris"}):null,(0,K.jsxs)("aside",{className:"tetris-side",children:[(0,K.jsx)(Eb,{label:"Pieza activa",piece:t.activePiece}),(0,K.jsx)(Eb,{label:"Siguiente",piece:t.nextPiece}),(0,K.jsxs)("article",{className:"tetris-controls",children:[(0,K.jsx)("span",{children:"Control f\xEDsico"}),(0,K.jsx)("strong",{children:"\u2190 Rotar \xB7 Guiar \xB7 Rotar \u2192"}),(0,K.jsx)("b",{children:"Baja al fondo para soltar"})]})]})]}),(0,K.jsxs)("footer",{className:"tetris-event",children:[(0,K.jsx)("span",{children:t.result==="line-clear"?"\xA1L\xEDnea!":"\xDAltimo evento"}),(0,K.jsx)("strong",{children:t.lastEventMessage},t.motionEventId),(0,K.jsx)("b",{children:vE(t)})]})]})})}function Eb({label:t,piece:e}){return(0,K.jsxs)("article",{className:"tetris-piece-card",style:{"--tetris-piece":e.color},children:[(0,K.jsx)("span",{children:t}),(0,K.jsx)("div",{children:e.cells.map(([a,i],l)=>(0,K.jsx)("i",{style:{gridColumn:a+1,gridRow:i+1}},l))}),(0,K.jsx)("strong",{children:yE[e.shape]??"Pieza"})]})}var yE=["I","O","T","S","Z","J","L"];function gE(t){return t.result==="game-win"?{eyebrow:"Objetivo completado",title:"\xA1Tetris superado!",caption:`${t.lines} l\xEDneas y ${t.score} puntos`}:t.result==="game-loss"?{eyebrow:"Fin de partida",title:"Las piezas llegaron arriba",caption:"La pista se reinicia en unos segundos"}:t.result==="line-clear"?{eyebrow:"L\xEDnea eliminada",title:`+${t.lastClearCount===4?800:t.lastClearCount*100}`,caption:"La pista baja y el nivel contin\xFAa"}:{eyebrow:`Nivel ${t.level}`,title:"Gu\xEDa la pieza",caption:"Usa todo el suelo para mover, rotar y soltar"}}function vE(t){return t.phase==="finished"?`${t.lines} ${t.lines===1?"l\xEDnea total":"l\xEDneas totales"}`:t.lastClearCount>0?`${t.lastClearCount} ${t.lastClearCount===1?"l\xEDnea":"l\xEDneas"}`:`Objetivo ${t.linesTarget}`}var sr={linesToWin:{key:"lines_to_win",label:"L\xEDneas para ganar",playerFacing:!0,description:"L\xEDneas que hay que eliminar para activar la celebraci\xF3n final.",type:"int",default:10,min:1,max:40,step:1}},ga={id:"tetris",label:"Tetris",description:"Gu\xEDa, rota y deja caer piezas f\xEDsicas en una pista cl\xE1sica de diez columnas.",availability:{development:!0,production:!0},catalog:{category:"arcade",color:"#36d9ff",durationLabel:"Sin l\xEDmite",modeLabel:"Tetris cl\xE1sico",audioLabel:"M\xFAsica + efectos",rules:["Pisa una columna para guiar la pieza","Pisa las diagonales junto a tu gu\xEDa para rotar","Baja hasta el fondo para soltar la pieza y completa l\xEDneas"]},players:{allowAny:!0,min:1,max:4},start:{mode:"player-ready",releaseGraceMillis:1500},config:{difficulty:{default:"medium",options:["easy","medium","hard"]},vars:Object.values(sr)},defaultDurationMillis:0,display:{entry:"./display"},preview:{seed:137,playerCount:1,difficulty:"medium",options:{lines_to_win:10},actions:[{atMillis:100,type:"press",x:8,y:29}],captureStartMillis:2200,frameCount:18,frameIntervalMillis:120},tags:["arcade","puzzle","classic","typescript"]};var ze=3,Tt=10,Cb=4e3,bE=180,ME=["#36d9ff","#ffd166","#ff52c8","#34c759","#ff7a1a","#0a84ff","#ff3b30"],Tb=[0,100,300,500,800],wh=[[[[0,0],[1,0],[2,0],[3,0]],[[0,0],[0,1],[0,2],[0,3]],[[0,0],[1,0],[2,0],[3,0]],[[0,0],[0,1],[0,2],[0,3]]],[[[0,0],[1,0],[0,1],[1,1]],[[0,0],[1,0],[0,1],[1,1]],[[0,0],[1,0],[0,1],[1,1]],[[0,0],[1,0],[0,1],[1,1]]],[[[1,0],[0,1],[1,1],[2,1]],[[0,0],[0,1],[1,1],[0,2]],[[0,0],[1,0],[2,0],[1,1]],[[1,0],[0,1],[1,1],[1,2]]],[[[1,0],[2,0],[0,1],[1,1]],[[0,0],[0,1],[1,1],[1,2]],[[1,0],[2,0],[0,1],[1,1]],[[0,0],[0,1],[1,1],[1,2]]],[[[0,0],[1,0],[1,1],[2,1]],[[1,0],[0,1],[1,1],[0,2]],[[0,0],[1,0],[1,1],[2,1]],[[1,0],[0,1],[1,1],[0,2]]],[[[0,0],[0,1],[1,1],[2,1]],[[0,0],[1,0],[0,1],[0,2]],[[0,0],[1,0],[2,0],[2,1]],[[1,0],[1,1],[0,2],[1,2]]],[[[2,0],[0,1],[1,1],[2,1]],[[0,0],[0,1],[0,2],[1,2]],[[0,0],[1,0],[2,0],[0,1]],[[0,0],[1,0],[1,1],[1,2]]]];function vu(t){return new Rh(t)}var Rh=class{config;rng;readyGate;board=[];active;next;phase="waiting";result="playing";nowMillis=0;startedAtMillis=0;lastFallMillis=0;lastRotateMillis=-1e3;finishAtMillis=0;lastClearMillis=0;lastClearCount=0;score=0;lines=0;level=1;guideX=ze+5;guideY=M-1;motionEventId=0;players=Ee(1);lastEvent=g("none","Listo",0);constructor(e){this.config=B(e,ga),this.rng=j(this.config.seed),this.readyGate=W(ga.start,[{minX:5,maxX:10,minY:28,maxY:31}],this.config.nowMillis),this.resetState(this.config.nowMillis)}init(e){return this.resetState(e),this.lastEvent=g("ready","Entra en la zona de control",e),[this.lastEvent]}press(e){if(this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting")return this.record(this.applyReady(this.readyGate.update(e),e.atMillis));if(this.phase!=="running"||!e.pressed)return[];if(e.y===this.guideY-1&&e.x===this.guideX-1)return this.rotate(-1,e.atMillis);if(e.y===this.guideY-1&&e.x===this.guideX+1)return this.rotate(1,e.atMillis);if(e.x<ze||e.x>=ze+Tt)return[];this.guideX=H(e.x,ze+1,ze+Tt-2),this.guideY=H(e.y,1,M-1);let a=H(e.x-Math.floor(rr(this.active)/2),ze,ze+Tt-rr(this.active));return this.collides(this.active,a,this.active.y,this.active.rotation)||(this.active.x=a),e.y>=M-2?this.hardDrop(e.atMillis):[]}release(e){return this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting"?this.record(this.applyReady(this.readyGate.update({...e,pressed:!1}),e.atMillis)):[]}tick(e){if(this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting")return this.record(this.applyReady(this.readyGate.tick(e.atMillis),e.atMillis));if(this.phase==="finished")return e.atMillis-this.finishAtMillis>=Cb?(this.resetState(e.atMillis),this.record([g("ready","Nueva partida",e.atMillis)])):[];this.result==="line-clear"&&e.atMillis-this.lastClearMillis>=550&&(this.result="playing");let a=xE(this.level,this.config.difficulty,this.guideY>this.active.y+5),i=0;for(;e.atMillis-this.lastFallMillis>=a&&i<4&&this.phase==="running";){if(this.collides(this.active,this.active.x,this.active.y+1,this.active.rotation))return this.lockPiece(e.atMillis);this.active.y+=1,this.lastFallMillis+=a,i+=1}return[]}render(){let e=J("#05070a");for(let a=0;a<M;a+=1){b(e,ze-1,a,this.phase==="finished"?"#67151f":"#06131a"),b(e,ze+Tt,a,this.phase==="finished"?"#67151f":"#06131a");for(let i=0;i<Tt;i+=1)b(e,ze+i,a,this.board[a]?.[i]??"#020609")}if(this.phase==="waiting"||this.phase==="starting")return this.drawReady(e),e;if(this.phase==="finished")return this.drawFinish(e),e;if(this.drawPiece(e,this.ghostPiece(),"#17404a"),this.drawPiece(e,this.active,this.active.color),this.board[this.guideY]?.[this.guideX-ze]===null&&b(e,this.guideX,this.guideY,"#12303a"),b(e,this.guideX-1,this.guideY-1,"#7a1f61"),b(e,this.guideX+1,this.guideY-1,"#7a5f1f"),this.lastClearCount>0&&this.nowMillis-this.lastClearMillis<350)for(let a=ze;a<ze+Tt;a+=1)b(e,a,M-1,"#ffffff");for(let a=M-Math.min(M,this.lines);a<M;a+=1)b(e,0,a,"#ffd166"),b(e,x-1,a,"#36d9ff");return e}snapshot(){let e=this.readyGate.state(this.nowMillis),a=this.players[0];return{currentGame:ga.id,label:ga.label,phase:this.phase,playerCount:this.config.playerCount,players:[{index:0,label:a.label,color:a.color,score:this.score,lives:-1}],score:this.score,lives:-1,elapsedMillis:this.phase==="waiting"||this.phase==="starting"?0:Math.max(0,this.nowMillis-this.startedAtMillis),remainingMillis:this.phase==="finished"?Math.max(0,this.finishAtMillis+Cb-this.nowMillis):0,activeTargets:this.phase==="running"?1:0,success:this.result==="game-win",lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?e.countdownMillis:0,readyPlayers:e.readyPlayers,requiredPlayers:e.requiredPlayers,result:this.result,lines:this.lines,level:this.level,linesTarget:this.linesToWin(),winnerLabel:a.label,activePiece:wb(this.active),nextPiece:wb(this.next),board:this.board.map(i=>[...i]),guideX:this.guideX,guideY:this.guideY,lastClearCount:this.lastClearCount,lineFlashMillis:Math.max(0,this.lastClearMillis+550-this.nowMillis),motionEventId:this.motionEventId}}reset(e={}){this.config=B({...this.config,...e},ga),this.rng=j(this.config.seed),this.readyGate.reset(this.config.nowMillis),this.resetState(this.config.nowMillis)}resetState(e){this.rng=j(this.config.seed),this.readyGate.reset(e),this.board=Array.from({length:M},()=>Array(Tt).fill(null)),this.active=this.randomPiece(),this.next=this.randomPiece(),this.phase="waiting",this.result="playing",this.nowMillis=e,this.startedAtMillis=e,this.lastFallMillis=e,this.finishAtMillis=0,this.lastClearMillis=0,this.lastClearCount=0,this.lastRotateMillis=-1e3,this.score=0,this.lines=0,this.level=1,this.guideX=ze+5,this.guideY=M-1,this.motionEventId=0;let i=Ee(Math.max(1,this.config.playerCount),this.config.players)[0];this.players=[{...i,label:i.label==="Player 1"?"Jugador":i.label}],this.lastEvent=g("ready","Entra en la zona de control",e)}applyReady(e,a){return e==="players-ready"?(this.phase="starting",this.motionEventId+=1,[g("ready","Control preparado",a)]):e==="players-left"?(this.phase="waiting",this.motionEventId+=1,[g("ready","Vuelve a la zona de control",a)]):e==="started"?(this.phase="running",this.startedAtMillis=a,this.lastFallMillis=a,this.motionEventId+=1,[g("start","Tetris en marcha",a)]):[]}randomPiece(){let e=this.rng.int(wh.length),a={shape:e,rotation:0,x:0,y:0,color:ME[e]};return a.x=ze+Math.floor((Tt-rr(a))/2),a}rotate(e,a){if(a-this.lastRotateMillis<bE)return[];let i=(this.active.rotation+e+4)%4;for(let l of[0,-1,1,-2,2])if(!this.collides(this.active,this.active.x+l,this.active.y,i))return this.active.x+=l,this.active.rotation=i,this.lastRotateMillis=a,this.motionEventId+=1,this.record([g("tick",e<0?"Rotaci\xF3n izquierda":"Rotaci\xF3n derecha",a)]);return[]}hardDrop(e){for(;!this.collides(this.active,this.active.x,this.active.y+1,this.active.rotation);)this.active.y+=1;return this.lockPiece(e)}lockPiece(e){for(let[i,l]of gu(this.active)){let n=this.active.x+i-ze,s=this.active.y+l;s>=0&&s<M&&n>=0&&n<Tt&&(this.board[s][n]=this.active.color)}let a=this.clearLines();return this.lastClearCount=a,a>0&&(this.lastClearMillis=e,this.lines+=a,this.level=Math.floor(this.lines/10)+1,this.score+=(Tb[a]??0)*this.level,this.result="line-clear",this.motionEventId+=1,this.lines>=this.linesToWin())?this.finish(!0,e):(this.active=this.next,this.active.x=ze+Math.floor((Tt-rr(this.active))/2),this.active.y=0,this.next=this.randomPiece(),this.guideX=this.active.x+Math.floor(rr(this.active)/2),this.guideY=M-1,this.lastFallMillis=e,this.collides(this.active,this.active.x,this.active.y,this.active.rotation)?this.finish(!1,e):a>0?this.record([g("win",`${a===1?"L\xEDnea":`${a} l\xEDneas`} +${(Tb[a]??0)*this.level}`,e)]):[])}clearLines(){let e=0;for(let a=M-1;a>=0;a-=1)this.board[a].every(Boolean)&&(this.board.splice(a,1),this.board.unshift(Array(Tt).fill(null)),e+=1,a+=1);return e}finish(e,a){this.phase="finished",this.result=e?"game-win":"game-loss",this.finishAtMillis=a,this.motionEventId+=1;let i=this.linesToWin();return this.record([g(e?"win":"fail",e?`\xA1Objetivo de ${i} ${i===1?"l\xEDnea completado":"l\xEDneas completado"}!`:"Las piezas llegaron arriba",a)])}collides(e,a,i,l){return(wh[e.shape]?.[l]??[]).some(([n,s])=>{let r=a+n-ze,o=i+s;return r<0||r>=Tt||o>=M||o>=0&&this.board[o]?.[r]!==null})}ghostPiece(){let e={...this.active};for(;!this.collides(e,e.x,e.y+1,e.rotation);)e.y+=1;return e}drawPiece(e,a,i){for(let[l,n]of gu(a))b(e,a.x+l,a.y+n,i)}drawReady(e){let a=this.readyGate.zoneReady(0,this.nowMillis);for(let i=28;i<32;i+=1)for(let l=5;l<=10;l+=1)(a||(l+i+Math.floor(this.nowMillis/110))%4<2)&&b(e,l,i,a?"#ffffff":"#36d9ff")}drawFinish(e){let a=Math.floor((this.nowMillis-this.finishAtMillis)/90),i=this.result==="game-win"?"#36d9ff":"#ff3b30";for(let l=0;l<M;l+=1)for(let n=ze;n<ze+Tt;n+=1)(n+l+a)%5<2&&b(e,n,l,i)}linesToWin(){return je(this.config.options,sr.linesToWin)}record(e){let a=e.at(-1);return a&&(this.lastEvent=a),e}};function gu(t){return wh[t.shape]?.[t.rotation]??[]}function rr(t){let e=gu(t).map(([a])=>a);return Math.max(...e)-Math.min(...e)+1}function wb(t){return{shape:t.shape,rotation:t.rotation,x:t.x,y:t.y,color:t.color,cells:gu(t).map(e=>[...e])}}function xE(t,e,a){let i=Math.max(100,720-(t-1)*45);return Math.max(70,i*(e==="easy"?1.25:e==="hard"?.78:1)/(a?3:1))}function Ah(t){let e=vu({playerCount:1,seed:137});return e.init(0),t!=="waiting"&&e.press({x:8,y:29,pressed:!0,atMillis:100}),t==="running"&&e.tick({atMillis:2200}),e}var Rb=Ah("waiting"),Ab=Rb.render(),zb=Rb.snapshot(),Pb=Ah("starting"),_b=Pb.render(),Nb=Pb.snapshot(),zh=Ah("running");zh.press({x:5,y:31,pressed:!0,atMillis:2300});var Db=zh.render(),Ob=zh.snapshot();var Dh={};Je(Dh,{PlayerDisplay:()=>Hb,createGame:()=>Mu,finishedFrame:()=>kb,finishedSnapshot:()=>Kb,manifest:()=>Jt,readyZonesForPlayers:()=>bu,runningFrame:()=>Zb,runningSnapshot:()=>Ib,startingFrame:()=>jb,startingSnapshot:()=>Vb,waitingFrame:()=>Yb,waitingSnapshot:()=>Xb});var Z=F(Q(),1);function Hb({snapshot:t}){let e=t.playerCount<=4?2:t.playerCount<=6?3:4,a=t.playerProgress.reduce((l,n)=>n.score>(t.playerProgress[l]?.score??-1)?n.index:l,0),i=EE(t);return(0,Z.jsx)(se,{title:t.label,phase:t.phase,children:(0,Z.jsxs)("div",{className:`duelo-display whack-display is-phase-${t.phase}`,style:{"--duelo-grid-columns":e},children:[(0,Z.jsxs)("section",{className:"duelo-hero",children:[(0,Z.jsxs)("div",{className:"duelo-hero-copy",children:[(0,Z.jsx)("span",{children:i.eyebrow}),(0,Z.jsx)("strong",{children:i.title}),(0,Z.jsx)("b",{children:i.caption})]}),(0,Z.jsxs)("div",{className:"duelo-hero-metrics",children:[(0,Z.jsx)(_h,{label:"Tiempo",value:$(t.remainingMillis)}),(0,Z.jsx)(_h,{label:"Topos",value:t.activeTargets}),(0,Z.jsx)(_h,{label:"Puntos",value:t.score})]})]}),(0,Z.jsx)("section",{className:"duelo-player-grid","aria-label":"Puntuaci\xF3n de jugadores",children:t.playerProgress.map(l=>(0,Z.jsx)(SE,{player:l,leader:a===l.index,ready:t.readyPlayerIndices.includes(l.index),winner:t.winnerIndex===l.index},l.index))}),(0,Z.jsxs)("footer",{className:"duelo-event-rail",children:[(0,Z.jsx)("span",{children:t.phase==="finished"?"Resultado":"\xDAltimo evento"}),(0,Z.jsx)("strong",{children:t.lastEventMessage},t.motionEventId),(0,Z.jsx)("b",{children:t.phase==="running"?`${t.activeTargets} objetivos activos`:`${t.readyPlayers}/${t.requiredPlayers} listos`})]})]})})}function SE({player:t,leader:e,ready:a,winner:i}){let l={"--duelo-player":t.color,"--duelo-player-rgb":GE(t.color),"--duelo-progress":Math.min(1,t.score/100)},n=i?"Ganador":e&&t.score>0?"L\xEDder":a?"Listo":"Busca tu color";return(0,Z.jsxs)("article",{className:`duelo-player-card${i?" is-winner":""}${e?" is-leader":""}`,style:l,children:[(0,Z.jsxs)("header",{children:[(0,Z.jsx)("i",{}),(0,Z.jsx)("span",{className:"duelo-player-name",children:t.label}),(0,Z.jsx)("b",{children:n})]}),(0,Z.jsxs)("div",{className:"duelo-player-score",children:[(0,Z.jsx)("strong",{children:t.score}),(0,Z.jsx)("span",{children:"puntos"}),t.lastPoints>0?(0,Z.jsxs)("em",{children:["+",t.lastPoints]},`${t.index}-${t.hits}`):null]}),(0,Z.jsx)("div",{className:"duelo-player-track",children:(0,Z.jsx)("i",{})}),(0,Z.jsxs)("footer",{children:[(0,Z.jsx)("span",{children:"Topos atrapados"}),(0,Z.jsx)("strong",{children:t.hits})]})]})}function _h({label:t,value:e}){return(0,Z.jsxs)("article",{className:"duelo-hero-metric",children:[(0,Z.jsx)("span",{children:t}),(0,Z.jsx)("strong",{children:e})]})}function EE(t){return t.phase==="waiting"?{eyebrow:`Listos ${t.readyPlayers}/${t.requiredPlayers}`,title:"Busca tu plataforma",caption:"Cada jugador permanece sobre su color"}:t.phase==="starting"?{eyebrow:"Todos listos",title:String(Math.max(1,Math.ceil((t.countdownMillis??0)/1e3))),caption:"Los topos est\xE1n a punto de aparecer"}:t.phase==="finished"?{eyebrow:"Tiempo",title:`\xA1Gana ${t.winnerLabel}!`,caption:"M\xE1s velocidad, m\xE1s puntos"}:{eyebrow:"Todos contra todos",title:"\xA1Atrapa los topos!",caption:"Corre hacia los cuadrados de colores antes de que se apaguen"}}function GE(t){return/^#[0-9a-f]{6}$/i.test(t)?[1,3,5].map(e=>Number.parseInt(t.slice(e,e+2),16)).join(", "):"255, 255, 255"}var Jt={id:"whack-a-mole",label:"Atrapa al topo",description:"Persigue objetivos de colores por todo el suelo y atr\xE1palos antes de que se apaguen.",availability:{development:!0,production:!0},catalog:{category:"versus",color:"#36d9ff",durationLabel:"60 s",modeLabel:"Todos contra todos",audioLabel:"M\xFAsica + efectos",rules:["Cada jugador ocupa su plataforma de salida","Pisa los objetivos de tu color antes de que desaparezcan","Cuanto m\xE1s r\xE1pido llegues, m\xE1s puntos ganas"]},players:{allowAny:!1,min:1,max:8},start:{mode:"player-ready",releaseGraceMillis:1200},config:{difficulty:{default:"medium",options:["easy","medium"]}},defaultDurationMillis:6e4,display:{entry:"./display"},preview:{seed:404,playerCount:4,difficulty:"medium",actions:[{atMillis:100,type:"press",x:0,y:0},{atMillis:100,type:"press",x:12,y:28},{atMillis:100,type:"press",x:0,y:28},{atMillis:100,type:"press",x:12,y:0}],captureStartMillis:2300,frameCount:18,frameIntervalMillis:120},tags:["arcade","reaction","multiplayer","typescript"]};var Bi=2,Lb=4e3,CE=500,Ub=3400,TE=2300;function Mu(t){return new Nh(t)}var Nh=class{config;rng;readyZones;readyGate;players=[];targets=[];lastPositions=[];catchUp=[];hitFlash=[];phase="waiting";nowMillis=0;startedAtMillis=0;finishAtMillis=0;winnerIndex=-1;motionEventId=0;lastEvent=g("none","Listo",0);constructor(e){this.config=B(e,Jt),this.rng=j(this.config.seed),this.readyZones=bu(this.config.playerCount),this.readyGate=W(Jt.start,this.readyZones,this.config.nowMillis),this.resetState(this.config.nowMillis)}init(e){return this.resetState(e),this.lastEvent=g("ready","Busca tu plataforma de color",e),[this.lastEvent]}press(e){if(this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting")return this.record(this.applyReady(this.readyGate.update(e),e.atMillis));if(this.phase!=="running"||!e.pressed)return[];let a=this.targets.findIndex(s=>e.atMillis<s.deadlineMillis&&wE(s,e.x,e.y));if(a<0)return this.record([g("miss","No hab\xEDa ning\xFAn topo ah\xED",e.atMillis)]);let i=this.targets[a],l=this.players[i.playerIndex],n=RE(i,e.atMillis);l.score+=n,l.hits+=1,l.lastPoints=n;for(let s=0;s<Bi;s+=1)for(let r=0;r<Bi;r+=1)this.hitFlash.push({x:i.x+r,y:i.y+s,untilMillis:e.atMillis+CE,color:l.color});return this.lastPositions[i.playerIndex]={x:i.x,y:i.y},this.targets.splice(a,1),this.spawnTarget(i.playerIndex,e.atMillis),this.motionEventId+=1,this.record([g("hit",`${l.label} +${n}`,e.atMillis)])}release(e){return this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting"?this.record(this.applyReady(this.readyGate.update({...e,pressed:!1}),e.atMillis)):[]}tick(e){if(this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting")return this.record(this.applyReady(this.readyGate.tick(e.atMillis),e.atMillis));if(this.phase==="finished")return e.atMillis-this.finishAtMillis>=Lb?(this.resetState(e.atMillis),this.record([g("ready","Nueva caza",e.atMillis)])):[];this.hitFlash=this.hitFlash.filter(i=>i.untilMillis>e.atMillis);let a=this.targets.filter(i=>e.atMillis>=i.deadlineMillis);for(let i of a)this.catchUp[i.playerIndex]=!0,this.targets=this.targets.filter(l=>l!==i),this.spawnTarget(i.playerIndex,e.atMillis);return this.remainingMillis()<=0?this.finish(e.atMillis):[]}render(){let e=J("#05070a");if(this.phase==="waiting"||this.phase==="starting")return this.drawReadiness(e),e;if(this.phase==="finished")return this.drawFinish(e),e;for(let a of this.targets){let i=this.players[a.playerIndex],l=H((a.deadlineMillis-this.nowMillis)/Math.max(1,a.deadlineMillis-a.bornMillis),.16,1),n=AE(i.color,l);for(let s=0;s<Bi;s+=1)for(let r=0;r<Bi;r+=1)b(e,a.x+r,a.y+s,n)}for(let a of this.hitFlash)b(e,a.x,a.y,"#ffffff");return e}snapshot(){let e=this.readyGate.state(this.nowMillis);return{currentGame:Jt.id,label:Jt.label,phase:this.phase,playerCount:this.config.playerCount,players:this.players.map(a=>({index:a.index,label:a.label,color:a.color,score:a.score,lives:-1})),score:this.players.reduce((a,i)=>a+i.score,0),lives:-1,elapsedMillis:this.elapsedMillis(),remainingMillis:this.phase==="finished"?Math.max(0,this.finishAtMillis+Lb-this.nowMillis):this.remainingMillis(),activeTargets:this.targets.length,success:this.phase==="finished",lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?e.countdownMillis:0,readyPlayers:e.readyPlayers,requiredPlayers:e.requiredPlayers,targets:this.targets.map(a=>({...a,remainingMillis:Math.max(0,a.deadlineMillis-this.nowMillis)})),playerProgress:this.players.map(a=>({...a})),readyPlayerIndices:this.readyZones.flatMap((a,i)=>this.readyGate.zoneReady(i,this.nowMillis)?[i]:[]),winnerIndex:this.winnerIndex,winnerLabel:this.players[this.winnerIndex]?.label??"",motionEventId:this.motionEventId}}reset(e={}){this.config=B({...this.config,...e},Jt),this.rng=j(this.config.seed),this.readyZones=bu(this.config.playerCount),this.readyGate=W(Jt.start,this.readyZones,this.config.nowMillis),this.resetState(this.config.nowMillis)}playerReadyZones(){return this.readyZones.map(e=>({...e}))}resetState(e){this.rng=j(this.config.seed),this.readyGate.reset(e);let a=Ee(this.config.playerCount,this.config.players);this.players=a.map((i,l)=>({index:l,label:i.label===`Player ${l+1}`?`Jugador ${l+1}`:i.label,color:i.color,score:0,hits:0,lastPoints:0})),this.targets=[],this.lastPositions=[],this.catchUp=[],this.hitFlash=[],this.phase="waiting",this.nowMillis=e,this.startedAtMillis=e,this.finishAtMillis=0,this.winnerIndex=-1,this.motionEventId=0,this.lastEvent=g("ready","Busca tu plataforma de color",e)}applyReady(e,a){return e==="players-ready"?(this.phase="starting",this.motionEventId+=1,[g("ready","Todos listos para cazar",a)]):e==="players-left"?(this.phase="waiting",this.motionEventId+=1,[g("ready","Vuelve a tu plataforma",a)]):e==="started"?(this.phase="running",this.startedAtMillis=a,this.targets=[],this.players.forEach((i,l)=>this.spawnTarget(l,a)),this.motionEventId+=1,[g("start","\xA1Atrapa los topos de colores!",a)]):[]}spawnTarget(e,a){let i={x:this.rng.int(x-1),y:this.rng.int(M-1)};for(let s=0;s<200;s+=1){let r={x:this.rng.int(x-Bi+1),y:this.rng.int(M-Bi+1)},o=this.lastPositions[e],u=o?(r.x-o.x)**2+(r.y-o.y)**2:64;if(this.targets.every(p=>Math.abs(r.x-p.x)>=4||Math.abs(r.y-p.y)>=4)&&u>=25&&u<=225){i=r;break}}let l=this.targetInterval(),n=this.catchUp[e]?2e3:0;this.catchUp[e]=!1,this.targets.push({playerIndex:e,...i,bornMillis:a,deadlineMillis:a+l+1e3+n})}targetInterval(){let e=H(this.elapsedMillis()/this.config.durationMillis,0,1),a=Ub-1e3,i=Ub-TE,l=this.config.difficulty==="easy"?1.18:1;return(a-e*i)*l}finish(e){return this.phase="finished",this.finishAtMillis=e,this.targets=[],this.winnerIndex=this.players.reduce((a,i,l)=>i.score>(this.players[a]?.score??-1)?l:a,0),this.motionEventId+=1,this.record([g("win",`\xA1Gana ${this.players[this.winnerIndex]?.label}!`,e)])}elapsedMillis(){return this.phase==="waiting"||this.phase==="starting"?0:Math.max(0,this.nowMillis-this.startedAtMillis)}remainingMillis(){return Math.max(0,this.config.durationMillis-this.elapsedMillis())}record(e){let a=e.at(-1);return a&&(this.lastEvent=a),e}drawReadiness(e){this.players.forEach((a,i)=>{let l=this.readyZones[i],n=this.readyGate.zoneReady(i,this.nowMillis);for(let s=l.minY;s<=l.maxY;s+=1)for(let r=l.minX;r<=l.maxX;r+=1)(n||(r+s+Math.floor(this.nowMillis/120))%4<2)&&b(e,r,s,n?"#ffffff":a.color)})}drawFinish(e){let a=this.players[this.winnerIndex],i=Math.floor((this.nowMillis-this.finishAtMillis)/90);for(let l=0;l<M;l+=1)for(let n=0;n<x;n+=1)(n*2+l+i)%7<3&&b(e,n,l,a?.color??"#36d9ff")}};function bu(t){return[[0,0],[12,28],[0,28],[12,0],[0,14],[12,14],[6,0],[6,28]].slice(0,H(Math.trunc(t),1,8)).map(([a=0,i=0])=>({minX:a,maxX:a+3,minY:i,maxY:i+3}))}function wE(t,e,a){return e>=t.x&&e<t.x+Bi&&a>=t.y&&a<t.y+Bi}function RE(t,e){let a=Math.max(1,t.deadlineMillis-t.bornMillis);return 4+Math.ceil(H((t.deadlineMillis-e)/a,0,1)*8)}function AE(t,e){let a=t.replace("#","");return`#${[0,2,4].map(l=>Math.round(Number.parseInt(a.slice(l,l+2),16)*e).toString(16).padStart(2,"0")).join("")}`}function xu(t){let e=Mu({playerCount:4,seed:404,durationMillis:t==="finished"?3e3:6e4});return e.init(0),t!=="waiting"&&zE(e),(t==="running"||t==="finished")&&e.tick({atMillis:2200}),t==="finished"&&e.tick({atMillis:5300}),e}var Fb=xu("waiting"),Yb=Fb.render(),Xb=Fb.snapshot(),qb=xu("starting"),jb=qb.render(),Vb=qb.snapshot(),Su=xu("running"),Bb=Su.snapshot().targets[1];Su.press({x:Bb.x,y:Bb.y,pressed:!0,atMillis:2300});var Zb=Su.render(),Ib=Su.snapshot(),Qb=xu("finished"),kb=Qb.render(),Kb=Qb.snapshot();function zE(t){t.playerReadyZones().forEach(e=>t.press({x:e.minX,y:e.minY,pressed:!0,atMillis:100}))}var Oh=new Map([[oa.id,bf],[Mt.id,Tf],[ca.id,Nf],[da.id,Hf],[Qt.id,Xf],[fa.id,Zf],[ha.id,ah],[Ft.id,lh],[rt.id,ch],[ot.id,yh],[Yt.id,bh],[ga.id,Ph],[kt.id,Th],[Jt.id,Dh]]),Dw=[...Oh.values()].map(t=>t.manifest).sort((t,e)=>t.id.localeCompare(e.id));var Hh=F(Q(),1),Eu=new WeakMap;function Jb(t,e){let a=Oh.get(e.gameId);if(!a?.PlayerDisplay)throw new Error(`no player display registered for ${e.gameId}`);let i=Eu.get(t);i||(i={root:(0,Wb.createRoot)(t),input:e},Eu.set(t,i)),i.input=e;let l=a.PlayerDisplay;i.root.render((0,Hh.jsx)(H0,{paused:e.paused===!0,children:(0,Hh.jsx)(l,{snapshot:e.snapshot,frame:e.frame})}))}function PE(t){Eu.get(t)?.root.unmount(),Eu.delete(t)}function _E(){if(document.getElementById("motion-levels-games-display-styles"))return;let t=document.createElement("style");t.id="motion-levels-games-display-styles",t.textContent=`/*
 * Player-display styles. Never truncate player-facing text mid-word: no
 * \`text-overflow: ellipsis\` + \`white-space: nowrap\` on labels/values a player
 * reads. Size text to fit and wrap on whole words instead. See AGENTS.md
 * "Player Display Layout".
 */
:root {
  color-scheme: dark;
  --ml-bg: #03050a;
  --ml-panel: rgba(255, 255, 255, 0.055);
  --ml-panel-strong: rgba(255, 255, 255, 0.075);
  --ml-border: rgba(139, 148, 158, 0.24);
  --ml-text: #f0f3f6;
  --ml-muted: #9aa7b7;
  --ml-cyan: #36d9ff;
  --ml-blue: #2f73ff;
  --ml-pink: #d2a8ff;
  --ml-yellow: #ffe176;
  --ml-green: #7ee787;
  --ml-red: #ff364a;
  --ml-magenta: #d85cff;
  --ml-amber: #ffcf5a;
  --ml-header-side-width: 360px;
}

.ml-display-shell {
  background:
    radial-gradient(circle at 18% 26%, rgba(255, 28, 40, 0.16), transparent 32%),
    radial-gradient(circle at 82% 68%, rgba(20, 92, 255, 0.2), transparent 34%),
    linear-gradient(145deg, #03050a 0%, #080b13 52%, #03050a 100%);
  color: var(--ml-text);
  display: grid;
  font-family:
    -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text",
    "Segoe UI", ui-sans-serif, system-ui, sans-serif;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 22px;
  height: 100%;
  min-width: 0;
  overflow: hidden;
  padding: 24px 36px 30px;
  pointer-events: none;
  user-select: none;
  width: 100%;
  -webkit-user-select: none;
}

.ml-tv-display * {
  user-select: none;
  -webkit-user-select: none;
}

/* Native captures freeze presentation-only CSS motion at a complete frame.
 * Game-state animation still advances between captures, which keeps generated
 * player-display media deterministic without serializing half-entered text. */
[data-native-capture="true"] .ml-display-shell *,
[data-native-capture="true"] .ml-display-shell *::before,
[data-native-capture="true"] .ml-display-shell *::after {
  animation: none !important;
  transition: none !important;
}

.ml-display-header {
  align-items: center;
  display: grid;
  gap: 28px;
  grid-template-columns: var(--ml-header-side-width) minmax(0, 1fr) var(--ml-header-side-width);
  min-height: 92px;
}

.ml-tv-brand,
.ml-status-pill {
  min-height: 76px;
  min-width: 0;
  width: 100%;
}

.ml-tv-brand {
  align-items: center;
  background:
    linear-gradient(180deg, rgba(20, 219, 255, 0.075), rgba(15, 20, 34, 0.18)),
    rgba(8, 20, 34, 0.68);
  border: 1px solid rgba(54, 217, 255, 0.24);
  clip-path: polygon(0 0, 96% 0, 100% 50%, 96% 100%, 0 100%);
  display: flex;
  gap: 14px;
  padding: 10px 22px;
}

.ml-tv-brand-mark {
  background: url("./assets/motion-levels-icon.png") center / contain no-repeat;
  filter:
    drop-shadow(0 8px 14px rgba(0, 0, 0, 0.48))
    drop-shadow(0 0 14px rgba(54, 217, 255, 0.34));
  flex: 0 0 auto;
  display: block;
  height: 54px;
  width: 54px;
}

.ml-tv-brand-name {
  color: #ffffff;
  display: grid;
  font-size: 20px;
  font-weight: 950;
  gap: 1px;
  letter-spacing: 0.08em;
  line-height: 0.9;
  min-width: 0;
  text-shadow: 0 0 18px rgba(54, 217, 255, 0.28);
  text-transform: uppercase;
}

.ml-tv-brand-name b {
  font: inherit;
  min-width: 0;
  overflow-wrap: break-word;
  white-space: normal;
}

.ml-tv-title {
  background:
    linear-gradient(90deg, rgba(255, 28, 40, 0.12), transparent 42%, rgba(20, 92, 255, 0.14)),
    rgba(8, 12, 22, 0.74);
  border: 1px solid rgba(255, 255, 255, 0.28);
  box-shadow:
    0 0 44px -26px rgba(54, 217, 255, 0.82),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  clip-path: polygon(4% 0, 96% 0, 100% 28%, 100% 72%, 96% 100%, 4% 100%, 0 72%, 0 28%);
  min-width: 0;
  padding: 17px 32px 19px;
  text-align: center;
}

.ml-display-label {
  color: var(--ml-cyan);
  display: block;
  font-size: 19px;
  font-weight: 950;
  letter-spacing: 0.14em;
  line-height: 1;
  margin-bottom: 10px;
  text-transform: uppercase;
}

.ml-display-header h1 {
  color: #ffffff;
  font-size: clamp(54px, 3.75vw, 74px);
  font-weight: 950;
  letter-spacing: 0;
  line-height: 0.94;
  margin: 0;
  overflow-wrap: anywhere;
  text-shadow: 0 0 30px rgba(54, 217, 255, 0.25);
}

.ml-status-pill {
  align-items: center;
  align-self: center;
  background:
    linear-gradient(135deg, rgba(20, 219, 255, 0.11), rgba(15, 20, 34, 0.2)),
    rgba(8, 20, 34, 0.68);
  border: 1px solid rgba(54, 217, 255, 0.52);
  clip-path: polygon(4% 0, 100% 0, 100% 100%, 4% 100%, 0 50%);
  color: #dce8f8;
  display: inline-flex;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 20px;
  font-weight: 900;
  gap: 14px;
  justify-content: center;
  justify-self: stretch;
  padding: 10px 22px;
  text-align: center;
  text-transform: uppercase;
}

.ml-status-pill::before {
  background: var(--ml-cyan);
  border-radius: 50%;
  box-shadow: 0 0 18px rgba(54, 217, 255, 0.78);
  content: "";
  flex: 0 0 auto;
  height: 10px;
  width: 10px;
}

.ml-status-waiting::before {
  animation: ml-status-breathe 1.35s ease-in-out infinite;
}

.ml-status-starting {
  border-color: rgba(255, 225, 118, 0.5);
  color: var(--ml-yellow);
}

.ml-status-starting::before {
  animation: ml-status-countdown 0.52s ease-in-out infinite;
  background: var(--ml-yellow);
  box-shadow: 0 0 22px rgba(255, 225, 118, 0.9);
}

.ml-status-running {
  border-color: rgba(126, 231, 135, 0.38);
  color: var(--ml-green);
}

.ml-status-running::before {
  background: var(--ml-green);
  box-shadow: 0 0 18px rgba(126, 231, 135, 0.76);
}

.ml-status-paused {
  background:
    linear-gradient(135deg, rgba(255, 225, 118, 0.12), rgba(15, 20, 34, 0.2)),
    rgba(24, 20, 10, 0.72);
  border-color: rgba(255, 225, 118, 0.5);
  color: var(--ml-yellow);
}

.ml-status-paused::before {
  animation: ml-status-breathe 1.8s ease-in-out infinite;
  background: var(--ml-yellow);
  box-shadow: 0 0 18px rgba(255, 225, 118, 0.72);
}

.ml-status-finished {
  border-color: rgba(255, 207, 90, 0.44);
  color: var(--ml-amber);
}

.ml-status-finished::before {
  background: var(--ml-amber);
  box-shadow: 0 0 18px rgba(255, 207, 90, 0.76);
}

.ml-display-content {
  display: grid;
  min-height: 0;
}

.ml-metric {
  background:
    linear-gradient(180deg, rgba(20, 219, 255, 0.075), rgba(15, 20, 34, 0.16)),
    rgba(6, 9, 16, 0.82);
  border: 1px solid rgba(54, 217, 255, 0.22);
  box-shadow:
    0 20px 58px -34px rgba(0, 0, 0, 0.86),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  clip-path: polygon(4% 0, 100% 0, 96% 100%, 0 100%);
  display: grid;
  gap: 10px;
  min-width: 0;
  overflow: hidden;
  padding: 20px 28px;
}

.ml-metric-label {
  color: rgba(255, 255, 255, 0.72);
  display: block;
  font-size: 19px;
  font-weight: 950;
  letter-spacing: 0.14em;
  line-height: 1;
  text-transform: uppercase;
}

.ml-metric-value {
  color: var(--ml-text);
  display: block;
  font-size: 70px;
  font-variant-numeric: tabular-nums;
  font-weight: 950;
  letter-spacing: 0;
  line-height: 0.95;
  overflow-wrap: break-word;
  text-shadow: none;
  white-space: normal;
}

.ml-metric-row {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(var(--ml-metric-columns), minmax(0, 1fr));
  min-height: 0;
}

.ml-metric-amber .ml-metric-value {
  color: var(--ml-amber);
}

.ml-metric-blue .ml-metric-value {
  color: var(--ml-blue);
}

.ml-metric-cyan .ml-metric-value {
  color: var(--ml-cyan);
}

.ml-metric-pink .ml-metric-value {
  color: var(--ml-pink);
}

.ml-metric-red .ml-metric-value {
  color: var(--ml-red);
}

.ml-metric-magenta .ml-metric-value {
  color: var(--ml-magenta);
}

.ml-metric-yellow .ml-metric-value {
  color: var(--ml-yellow);
}

.ml-metric-green .ml-metric-value {
  color: var(--ml-green);
}

.ml-metric-neutral .ml-metric-value {
  color: var(--ml-text);
  text-shadow: none;
}

.ml-lives-meter {
  align-items: center;
  display: flex;
  gap: 16px;
  min-height: 78px;
}

.ml-life-heart {
  display: inline-flex;
  font-size: 72px;
  line-height: 1;
  transform-origin: 50% 58%;
}

.ml-life-heart.is-remaining {
  color: #ff2036;
  filter: drop-shadow(0 0 14px rgba(255, 31, 52, 0.42));
}

.ml-life-heart.is-lost {
  color: #566171;
  filter: none;
  opacity: 0.62;
}

.ml-life-heart-glyph {
  animation: ml-heart-pulse 3.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  animation-delay: calc(var(--ml-heart-index, 0) * 180ms);
  display: inline-block;
  transform-origin: 50% 58%;
}

.ml-life-heart.is-lost .ml-life-heart-glyph {
  animation: none;
}

.ml-life-heart.is-losing {
  animation: ml-life-lost 900ms cubic-bezier(0.22, 1, 0.36, 1);
}

.ml-life-heart.is-regained {
  animation: ml-life-regained 1s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes ml-heart-pulse {
  0%,
  100% {
    filter: brightness(0.96);
    transform: scale(1);
  }

  42% {
    filter: brightness(1.12);
    transform: scale(1.065);
  }

  56% {
    filter: brightness(1.04);
    transform: scale(1.025);
  }
}

@keyframes ml-life-lost {
  0% {
    filter: brightness(1.35);
    opacity: 1;
    transform: scale(1);
  }

  24% {
    filter: brightness(1.65);
    transform: rotate(-5deg) scale(1.18);
  }

  58% {
    filter: grayscale(0.5);
    opacity: 0.34;
    transform: rotate(4deg) scale(0.72);
  }

  100% {
    filter: grayscale(1);
    opacity: 0.62;
    transform: scale(1);
  }
}

@keyframes ml-life-regained {
  0% {
    filter: brightness(1.8);
    opacity: 0.3;
    transform: scale(0.52);
  }

  42% {
    filter: brightness(1.55);
    opacity: 1;
    transform: scale(1.32);
  }

  70% {
    filter: brightness(1.16);
    transform: scale(0.92);
  }

  100% {
    filter: brightness(1);
    opacity: 1;
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ml-life-heart,
  .ml-life-heart-glyph {
    animation: none;
  }
}

.ml-versus-scoreboard {
  display: grid;
  gap: 22px;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 0.36fr) minmax(0, 1fr);
  min-height: 0;
}

.ml-player-score-panel {
  background:
    radial-gradient(80% 120% at 18% 8%, rgba(var(--ml-player-rgb), 0.34), transparent 58%),
    linear-gradient(180deg, rgba(var(--ml-player-rgb), 0.08), rgba(5, 8, 15, 0.18)),
    rgba(4, 8, 16, 0.86);
  border: 1px solid rgba(var(--ml-player-rgb), 0.58);
  box-shadow:
    0 26px 74px -32px rgba(0, 0, 0, 0.9),
    0 0 54px -24px rgba(var(--ml-player-rgb), 0.74),
    inset 0 1px 0 rgba(255, 255, 255, 0.09);
  display: grid;
  gap: 20px;
  grid-template-rows: auto minmax(0, 1fr) auto;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
  padding: 30px 36px;
}

.ml-player-score-red {
  clip-path: polygon(0 0, 96% 0, 100% 8%, 100% 100%, 0 100%);
}

.ml-player-score-blue {
  clip-path: polygon(4% 0, 100% 0, 100% 100%, 0 100%, 0 8%);
}

.ml-player-score-head {
  align-items: center;
  display: flex;
  gap: 20px;
  justify-content: space-between;
  min-width: 0;
}

.ml-player-score-head span {
  color: #ffffff;
  font-size: 38px;
  font-weight: 950;
  line-height: 1;
  min-width: 0;
  overflow-wrap: break-word;
  white-space: normal;
}

.ml-player-score-head b {
  color: var(--ml-player);
  flex: 0 0 auto;
  font-size: 22px;
  font-weight: 950;
  letter-spacing: 0.14em;
}

.ml-player-score-panel > strong {
  align-self: center;
  color: #ffffff;
  font-size: clamp(152px, 11vw, 230px);
  font-variant-numeric: tabular-nums;
  font-weight: 950;
  letter-spacing: 0;
  line-height: 0.8;
  text-shadow:
    0 0 0.04em var(--ml-player),
    0 0 0.22em rgba(var(--ml-player-rgb), 0.68);
}

.ml-player-score-blue > strong {
  text-align: right;
}

.ml-player-score-track {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(var(--ml-player-rgb), 0.32);
  height: 18px;
  overflow: hidden;
}

.ml-player-score-track i {
  background: linear-gradient(90deg, var(--ml-player), rgba(255, 255, 255, 0.95));
  box-shadow: 0 0 24px rgba(var(--ml-player-rgb), 0.72);
  display: block;
  height: 100%;
  width: calc(var(--ml-score-progress, 0) * 100%);
}

.ml-versus-center {
  align-content: center;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)),
    rgba(6, 9, 16, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.22);
  clip-path: polygon(10% 0, 90% 0, 100% 12%, 100% 88%, 90% 100%, 10% 100%, 0 88%, 0 12%);
  display: grid;
  gap: 14px;
  justify-items: center;
  min-width: 0;
  padding: 28px 24px;
  text-align: center;
}

.ml-versus-center span,
.ml-versus-center b,
.ml-round-card b {
  color: rgba(255, 255, 255, 0.72);
  font-size: 20px;
  font-weight: 950;
  letter-spacing: 0.14em;
  line-height: 1;
  text-transform: uppercase;
}

.ml-versus-center strong {
  color: #ffffff;
  font-size: clamp(96px, 6.8vw, 134px);
  font-variant-numeric: tabular-nums;
  font-weight: 950;
  letter-spacing: 0;
  line-height: 0.84;
  text-shadow:
    -0.04em 0 0 rgba(255, 28, 40, 0.52),
    0.04em 0 0 rgba(20, 92, 255, 0.56),
    0 0 34px rgba(255, 255, 255, 0.24);
}

.ml-round-strip {
  background:
    radial-gradient(60% 130% at 0% 50%, rgba(255, 28, 40, 0.12), transparent 70%),
    radial-gradient(60% 130% at 100% 50%, rgba(20, 92, 255, 0.14), transparent 70%),
    linear-gradient(180deg, rgba(13, 19, 31, 0.94), rgba(4, 7, 13, 0.94));
  border: 1px solid rgba(107, 153, 198, 0.28);
  box-shadow:
    0 24px 64px -36px rgba(0, 0, 0, 0.92),
    inset 0 1px 0 rgba(255, 255, 255, 0.065);
  display: grid;
  gap: 13px;
  grid-template-rows: auto 6px minmax(0, 1fr);
  min-height: 0;
  overflow: hidden;
  padding: 20px 24px 22px;
  position: relative;
}

.ml-round-strip::before {
  background: linear-gradient(90deg, var(--ml-red), var(--ml-cyan) 50%, var(--ml-blue));
  content: "";
  height: 2px;
  inset: 0 0 auto;
  opacity: 0.72;
  position: absolute;
}

.ml-round-strip-head {
  align-items: center;
  display: flex;
  gap: 20px;
  justify-content: space-between;
}

.ml-round-strip-title {
  display: grid;
  gap: 6px;
}

.ml-round-strip-title > span {
  color: #ffffff;
  font-size: 22px;
  font-weight: 950;
  letter-spacing: 0.14em;
  line-height: 1;
  text-transform: uppercase;
}

.ml-round-strip-title small {
  color: var(--ml-muted);
  font-size: 14px;
  font-weight: 750;
  letter-spacing: 0.04em;
  line-height: 1;
}

.ml-round-strip-count {
  align-items: baseline;
  display: flex;
  gap: 8px;
}

.ml-round-strip-count strong {
  color: #ffffff;
  font-size: 42px;
  font-variant-numeric: tabular-nums;
  font-weight: 950;
  line-height: 0.86;
}

.ml-round-strip-count span {
  color: var(--ml-muted);
  font-size: 17px;
  font-weight: 850;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.ml-round-progress {
  background: rgba(255, 255, 255, 0.075);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.ml-round-progress i {
  background: linear-gradient(90deg, var(--ml-red), var(--ml-cyan) 52%, var(--ml-blue));
  box-shadow: 0 0 18px rgba(54, 217, 255, 0.52);
  display: block;
  height: 100%;
  width: var(--ml-round-progress);
}

.ml-round-list {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(var(--ml-round-count), minmax(0, 1fr));
  min-height: 0;
}

.ml-round-card {
  align-content: center;
  background:
    linear-gradient(160deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.018)),
    rgba(5, 9, 16, 0.84);
  border: 1px solid rgba(147, 166, 192, 0.2);
  border-radius: 3px;
  display: grid;
  gap: 10px;
  min-width: 0;
  overflow: hidden;
  padding: 14px;
  position: relative;
}

.ml-round-card::after {
  background: rgba(255, 255, 255, 0.16);
  bottom: 0;
  content: "";
  height: 3px;
  left: 0;
  position: absolute;
  right: 0;
}

.ml-round-card-head {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.ml-round-card-head span {
  color: rgba(255, 255, 255, 0.74);
  font-size: 16px;
  font-variant-numeric: tabular-nums;
  font-weight: 950;
  letter-spacing: 0.1em;
  line-height: 1;
}

.ml-round-card-head i {
  background: rgba(255, 255, 255, 0.26);
  border-radius: 50%;
  display: block;
  height: 7px;
  width: 7px;
}

.ml-round-card.is-red {
  background: linear-gradient(155deg, rgba(255, 28, 40, 0.28), rgba(8, 10, 18, 0.88) 70%);
  border-color: rgba(255, 54, 74, 0.54);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.ml-round-card.is-red::after,
.ml-round-card.is-red .ml-round-card-head i {
  background: var(--ml-red);
  box-shadow: 0 0 14px rgba(255, 54, 74, 0.66);
}

.ml-round-card.is-blue {
  background: linear-gradient(155deg, rgba(20, 92, 255, 0.32), rgba(8, 10, 18, 0.88) 70%);
  border-color: rgba(47, 115, 255, 0.62);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.ml-round-card.is-blue::after,
.ml-round-card.is-blue .ml-round-card-head i {
  background: var(--ml-blue);
  box-shadow: 0 0 14px rgba(47, 115, 255, 0.72);
}

.ml-round-card.is-current {
  background:
    linear-gradient(135deg, rgba(255, 28, 40, 0.13), rgba(54, 217, 255, 0.11) 50%, rgba(20, 92, 255, 0.16)),
    rgba(8, 13, 22, 0.94);
  border-color: rgba(54, 217, 255, 0.72);
  box-shadow:
    0 0 28px -10px rgba(54, 217, 255, 0.58),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.ml-round-card.is-current::after {
  background: linear-gradient(90deg, var(--ml-red), var(--ml-cyan), var(--ml-blue));
}

.ml-round-card.is-current .ml-round-card-head i {
  background: var(--ml-cyan);
  box-shadow: 0 0 16px rgba(54, 217, 255, 0.84);
}

.ml-round-card.is-pending {
  opacity: 0.48;
}

.ml-round-card strong {
  color: #ffffff;
  font-size: clamp(17px, 1.2vw, 23px);
  font-weight: 900;
  letter-spacing: 0;
  line-height: 1.08;
  min-width: 0;
  overflow-wrap: break-word;
  white-space: normal;
}

.ml-round-card b {
  color: var(--ml-muted);
  font-size: 13px;
  letter-spacing: 0.06em;
}

.ml-round-card.is-current strong {
  color: #ffffff;
  text-shadow: 0 0 18px rgba(54, 217, 255, 0.28);
}

.ml-versus-display {
  display: grid;
  gap: 22px;
  grid-template-rows: minmax(280px, 0.94fr) minmax(128px, 0.34fr) minmax(210px, 0.5fr);
  min-height: 0;
}

.ml-versus-display .ml-versus-scoreboard {
  min-height: 0;
}

.ml-versus-display .ml-metric-row {
  min-height: 128px;
}

.ml-versus-display .ml-metric-value {
  font-size: 60px;
}

/* Duelo is a 2\u20138 player free-for-all. Its roster never reorders: players can
 * keep tracking the same color and screen position throughout the race. */
.duelo-display {
  display: grid;
  gap: 16px;
  grid-template-rows: 164px minmax(0, 1fr) 86px;
  isolation: isolate;
  min-height: 0;
  position: relative;
}

.duelo-hero {
  align-items: stretch;
  background:
    radial-gradient(90% 180% at 10% 50%, rgba(255, 82, 104, 0.16), transparent 62%),
    linear-gradient(100deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.018)),
    rgba(5, 9, 17, 0.9);
  border: 1px solid rgba(127, 170, 210, 0.3);
  box-shadow:
    0 22px 60px -38px rgba(0, 0, 0, 0.94),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  clip-path: polygon(1.2% 0, 100% 0, 98.8% 100%, 0 100%);
  display: grid;
  gap: 26px;
  grid-template-columns: minmax(0, 1.35fr) minmax(520px, 0.9fr);
  min-height: 0;
  overflow: hidden;
  padding: 22px 34px;
  position: relative;
}

.duelo-hero::before {
  background: linear-gradient(90deg, #ff3048, #24d9ff, #42e879, #ff4fd8, #376bff, #ffd84d, #a66cff, #ff8a3d);
  bottom: 0;
  box-shadow: 0 0 22px rgba(54, 217, 255, 0.42);
  content: "";
  height: 3px;
  inset-inline: 0;
  position: absolute;
}

.duelo-hero-copy {
  align-content: center;
  display: grid;
  gap: 7px;
  min-width: 0;
}

.duelo-hero-copy > span,
.duelo-hero-copy > b,
.duelo-hero-metric > span,
.duelo-player-card header b,
.duelo-player-card footer span,
.duelo-event-rail > span,
.duelo-event-rail > b {
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.duelo-hero-copy > span {
  color: var(--ml-cyan);
  font-size: 17px;
  line-height: 1;
}

.duelo-hero-copy > strong {
  color: #ffffff;
  font-size: clamp(50px, 3.7vw, 72px);
  font-weight: 950;
  letter-spacing: -0.035em;
  line-height: 0.92;
  overflow-wrap: break-word;
  text-shadow: 0 0 30px rgba(54, 217, 255, 0.2);
  white-space: normal;
}

.duelo-hero-copy > b {
  color: rgba(232, 240, 249, 0.74);
  font-size: 17px;
  letter-spacing: 0.025em;
  line-height: 1.2;
  overflow-wrap: break-word;
  text-transform: none;
  white-space: normal;
}

.duelo-hero-metrics {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  min-width: 0;
}

.duelo-hero-metric {
  align-content: center;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(151, 178, 205, 0.2);
  display: grid;
  gap: 10px;
  justify-items: center;
  min-width: 0;
  padding: 14px;
  text-align: center;
}

.duelo-hero-metric > span {
  color: var(--ml-muted);
  font-size: 14px;
  line-height: 1;
}

.duelo-hero-metric > strong {
  color: #ffffff;
  font-size: clamp(34px, 2.45vw, 48px);
  font-variant-numeric: tabular-nums;
  font-weight: 950;
  line-height: 0.9;
  overflow-wrap: break-word;
  white-space: normal;
}

.duelo-player-grid {
  display: grid;
  gap: 14px;
  grid-auto-rows: minmax(0, 1fr);
  grid-template-columns: repeat(var(--duelo-grid-columns), minmax(0, 1fr));
  min-height: 0;
}

.duelo-player-card {
  --duelo-card-value-size: 92px;
  background:
    radial-gradient(100% 130% at 8% 0%, rgba(var(--duelo-player-rgb), 0.27), transparent 58%),
    linear-gradient(150deg, rgba(var(--duelo-player-rgb), 0.09), rgba(5, 9, 17, 0.88) 65%),
    rgba(5, 9, 17, 0.92);
  border: 1px solid rgba(var(--duelo-player-rgb), 0.52);
  box-shadow:
    0 18px 54px -36px rgba(0, 0, 0, 0.92),
    0 0 34px -24px rgba(var(--duelo-player-rgb), 0.7),
    inset 0 1px 0 rgba(255, 255, 255, 0.075);
  display: grid;
  gap: 10px;
  grid-template-rows: auto minmax(0, 1fr) 12px auto;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
  padding: 18px 22px 16px;
  position: relative;
  transition:
    border-color 300ms ease,
    filter 360ms ease,
    opacity 360ms ease,
    transform 420ms cubic-bezier(0.16, 1, 0.3, 1);
}

.duelo-display.is-player-count-2 .duelo-player-card {
  --duelo-card-value-size: 180px;
  gap: 18px;
  padding: 28px 34px 24px;
}

.duelo-display.is-player-count-3 .duelo-player-card,
.duelo-display.is-player-count-4 .duelo-player-card {
  --duelo-card-value-size: 124px;
}

.duelo-player-card::after {
  background: var(--duelo-player);
  bottom: 0;
  box-shadow: 0 0 18px rgba(var(--duelo-player-rgb), 0.75);
  content: "";
  height: 4px;
  inset-inline: 0;
  position: absolute;
}

.duelo-player-card header {
  align-items: start;
  display: grid;
  gap: 12px;
  grid-template-columns: 12px minmax(0, 1fr) auto;
  min-width: 0;
}

.duelo-player-card header > i {
  background: var(--duelo-player);
  border-radius: 2px;
  box-shadow: 0 0 18px rgba(var(--duelo-player-rgb), 0.82);
  display: block;
  height: 12px;
  margin-top: 7px;
  width: 12px;
}

.duelo-player-name {
  color: #ffffff;
  font-size: 28px;
  font-weight: 950;
  letter-spacing: -0.02em;
  line-height: 1.02;
  min-width: 0;
  overflow-wrap: break-word;
  white-space: normal;
}

.duelo-player-name.is-long {
  font-size: 23px;
  line-height: 1.06;
}

.duelo-player-name.is-extra-long {
  font-size: 19px;
  line-height: 1.08;
}

.duelo-display.is-player-count-2 .duelo-player-name {
  font-size: 40px;
}

.duelo-display.is-player-count-2 .duelo-player-name.is-long {
  font-size: 32px;
}

.duelo-display.is-player-count-2 .duelo-player-name.is-extra-long {
  font-size: 26px;
}

.duelo-player-card header b {
  color: var(--duelo-player);
  font-size: 13px;
  line-height: 1.15;
  max-width: 130px;
  overflow-wrap: break-word;
  text-align: right;
  white-space: normal;
}

.duelo-player-score {
  align-content: center;
  align-items: baseline;
  display: flex;
  gap: 14px;
  min-height: 0;
  min-width: 0;
  position: relative;
}

.duelo-player-score > strong {
  color: #ffffff;
  font-size: var(--duelo-card-value-size);
  font-variant-numeric: tabular-nums;
  font-weight: 950;
  letter-spacing: -0.06em;
  line-height: 0.78;
  text-shadow:
    0 0 0.035em var(--duelo-player),
    0 0 0.2em rgba(var(--duelo-player-rgb), 0.52);
}

.duelo-player-score > span {
  color: rgba(231, 239, 248, 0.7);
  font-size: 17px;
  font-weight: 850;
  line-height: 1.08;
  max-width: 120px;
  overflow-wrap: break-word;
  white-space: normal;
}

.duelo-player-score > em {
  animation: dueloClaimPlus 700ms cubic-bezier(0.16, 1, 0.3, 1) both;
  color: var(--duelo-player);
  font-size: 42px;
  font-style: normal;
  font-weight: 950;
  inset: 8px 8px auto auto;
  position: absolute;
  text-shadow: 0 0 18px rgba(var(--duelo-player-rgb), 0.82);
}

.duelo-player-track {
  background: rgba(255, 255, 255, 0.075);
  border: 1px solid rgba(var(--duelo-player-rgb), 0.3);
  overflow: hidden;
}

.duelo-player-track > i {
  background: linear-gradient(90deg, var(--duelo-player), rgba(255, 255, 255, 0.92));
  box-shadow: 0 0 18px rgba(var(--duelo-player-rgb), 0.72);
  display: block;
  height: 100%;
  transition: width 460ms cubic-bezier(0.16, 1, 0.3, 1);
  width: calc(var(--duelo-progress) * 100%);
}

.duelo-player-card footer {
  align-items: baseline;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  min-width: 0;
}

.duelo-player-card footer span {
  color: var(--ml-muted);
  font-size: 13px;
}

.duelo-player-card footer strong {
  color: var(--duelo-player);
  font-size: 24px;
  font-variant-numeric: tabular-nums;
  font-weight: 950;
  line-height: 1;
}

.duelo-player-card.is-leader {
  border-color: rgba(var(--duelo-player-rgb), 0.92);
  box-shadow:
    0 20px 58px -34px rgba(0, 0, 0, 0.94),
    0 0 46px -18px rgba(var(--duelo-player-rgb), 0.86),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.duelo-display.is-phase-waiting .duelo-player-card:not(.is-ready) {
  filter: saturate(0.68) brightness(0.72);
  opacity: 0.72;
}

.duelo-display.is-phase-waiting .duelo-player-card.is-ready,
.duelo-display.is-phase-starting .duelo-player-card {
  border-color: rgba(var(--duelo-player-rgb), 0.88);
  filter: brightness(1.08) saturate(1.12);
}

.duelo-player-card.is-recent {
  animation: dueloCardClaim 620ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.duelo-display.is-phase-starting .duelo-hero-copy > strong {
  animation: dueloCountdown 700ms ease-in-out infinite alternate;
  color: var(--ml-yellow);
  font-size: 112px;
  line-height: 0.72;
  text-shadow: 0 0 36px rgba(255, 225, 118, 0.68);
}

.duelo-display.is-phase-finished .duelo-hero {
  border-color: rgba(var(--duelo-winner-rgb), 0.72);
  box-shadow:
    0 0 50px -18px rgba(var(--duelo-winner-rgb), 0.7),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.duelo-display.is-phase-finished .duelo-hero-copy > span,
.duelo-display.is-phase-finished .duelo-hero-copy > strong {
  color: var(--duelo-winner);
}

.duelo-display.is-phase-finished .duelo-hero-copy > strong {
  animation: dueloWinnerTitle 900ms ease-in-out infinite alternate;
  font-size: clamp(44px, 3.25vw, 64px);
  text-shadow: 0 0 34px rgba(var(--duelo-winner-rgb), 0.66);
}

.duelo-display.is-phase-finished .duelo-player-card:not(.is-winner) {
  filter: grayscale(0.35) brightness(0.58);
  opacity: 0.58;
  transform: scale(0.985);
}

.duelo-display.is-phase-finished .duelo-player-card.is-winner {
  animation: dueloWinnerCard 900ms ease-in-out infinite alternate;
  border-color: rgba(var(--duelo-player-rgb), 0.98);
  filter: brightness(1.18) saturate(1.18);
  transform: scale(1.012);
}

.duelo-event-rail {
  align-items: center;
  background:
    linear-gradient(90deg, rgba(255, 82, 104, 0.1), rgba(6, 11, 20, 0.92) 26%, rgba(6, 11, 20, 0.92) 74%, rgba(36, 217, 255, 0.1)),
    rgba(5, 9, 17, 0.94);
  border: 1px solid rgba(123, 160, 198, 0.28);
  display: grid;
  gap: 22px;
  grid-template-columns: 170px minmax(0, 1fr) auto;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
  padding: 14px 24px;
}

.duelo-event-rail > span,
.duelo-event-rail > b {
  color: var(--ml-muted);
  font-size: 14px;
  line-height: 1.1;
}

.duelo-event-rail > strong {
  animation: dueloEventIn 420ms cubic-bezier(0.16, 1, 0.3, 1) both;
  color: #ffffff;
  font-size: 26px;
  font-weight: 900;
  line-height: 1.1;
  min-width: 0;
  overflow-wrap: break-word;
  white-space: normal;
}

.duelo-event-rail > b {
  color: var(--ml-cyan);
  max-width: 280px;
  overflow-wrap: break-word;
  text-align: right;
  white-space: normal;
}

@keyframes dueloClaimPlus {
  0% { opacity: 0; transform: translateY(18px) scale(0.55); }
  35% { opacity: 1; transform: translateY(-4px) scale(1.2); }
  100% { opacity: 0; transform: translateY(-28px) scale(0.92); }
}

@keyframes dueloCardClaim {
  0% { filter: brightness(1); transform: scale(1); }
  34% { filter: brightness(1.34) saturate(1.22); transform: scale(1.018); }
  100% { filter: brightness(1); transform: scale(1); }
}

@keyframes dueloCountdown {
  from { filter: brightness(0.9); transform: scale(0.92); }
  to { filter: brightness(1.2); transform: scale(1.06); }
}

@keyframes dueloWinnerTitle {
  from { filter: brightness(0.98); transform: translateX(-2px) scale(0.99); }
  to { filter: brightness(1.2); transform: translateX(2px) scale(1.025); }
}

@keyframes dueloWinnerCard {
  from { box-shadow: 0 0 30px -18px rgba(var(--duelo-player-rgb), 0.7); }
  to { box-shadow: 0 0 58px -10px rgba(var(--duelo-player-rgb), 0.94); }
}

@keyframes dueloEventIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .duelo-display *,
  .duelo-display *::before,
  .duelo-display *::after {
    animation: none !important;
    transition: none !important;
  }
}

/* Ping Pong turns the live deterministic game state into a coordinated motion
 * system. All selectors are namespaced so other versus displays stay neutral. */
.ping-pong-display {
  gap: 18px;
  grid-template-rows: minmax(250px, 0.88fr) 96px minmax(112px, 0.3fr) minmax(190px, 0.46fr);
  isolation: isolate;
  position: relative;
}

.ping-pong-scoreboard,
.ping-pong-metrics,
.ping-pong-rounds {
  position: relative;
  z-index: 2;
}

.ping-pong-scoreboard .ml-player-score-panel {
  position: relative;
  transition:
    border-color 320ms ease,
    box-shadow 420ms ease,
    filter 320ms ease,
    opacity 320ms ease,
    transform 420ms cubic-bezier(0.2, 0.85, 0.2, 1);
}

.ping-pong-scoreboard .ml-player-score-panel::before {
  background: linear-gradient(
    100deg,
    transparent 0%,
    rgba(var(--ml-player-rgb), 0.02) 30%,
    rgba(var(--ml-player-rgb), 0.3) 49%,
    rgba(255, 255, 255, 0.16) 51%,
    transparent 72%
  );
  content: "";
  inset: 0;
  pointer-events: none;
  position: absolute;
  transform: translateX(-135%);
}

.ping-pong-display.is-phase-running .ping-pong-scoreboard .ml-player-score-panel::before {
  animation: pingPongPanelSweep calc(2.8s - var(--ping-pong-rally-pace) * 1s) linear infinite;
}

.ping-pong-scoreboard .ml-player-score-panel > strong {
  transition:
    color 220ms ease,
    filter 280ms ease,
    text-shadow 320ms ease,
    transform 440ms cubic-bezier(0.16, 1, 0.3, 1);
}

.ping-pong-scoreboard .ml-player-score-track i {
  transition: width 560ms cubic-bezier(0.16, 1, 0.3, 1);
}

.ping-pong-display.is-phase-starting .ml-versus-center {
  animation: pingPongCenterCharge 800ms ease-in-out infinite alternate;
}

.ping-pong-display.is-phase-starting .ml-versus-center strong {
  animation: pingPongCountdown 620ms cubic-bezier(0.16, 1, 0.3, 1) infinite alternate;
  font-size: clamp(68px, 4.4vw, 86px);
  letter-spacing: -0.06em;
  white-space: nowrap;
}

.ping-pong-display.is-scoring-red .ml-player-score-red,
.ping-pong-display.is-scoring-blue .ml-player-score-blue {
  filter: brightness(1.18) saturate(1.22);
  transform: scale(1.012);
}

.ping-pong-display.is-scoring-red .ml-player-score-red > strong,
.ping-pong-display.is-scoring-blue .ml-player-score-blue > strong {
  animation: pingPongScorePop 720ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.ping-pong-display.is-winner-red .ml-player-score-red,
.ping-pong-display.is-winner-blue .ml-player-score-blue {
  animation: pingPongWinnerPanel 900ms ease-in-out infinite alternate;
  filter: brightness(1.16) saturate(1.16);
  transform: scale(1.012);
}

.ping-pong-display.is-winner-red .ml-player-score-blue,
.ping-pong-display.is-winner-blue .ml-player-score-red {
  filter: saturate(0.62) brightness(0.72);
  opacity: 0.68;
  transform: scale(0.985);
}

.ping-pong-rally-lane {
  align-items: center;
  background:
    radial-gradient(circle at 3% 50%, rgba(255, 28, 40, 0.42), transparent 24%),
    radial-gradient(circle at 97% 50%, rgba(20, 92, 255, 0.48), transparent 24%),
    linear-gradient(90deg, rgba(255, 28, 40, 0.1), rgba(7, 12, 22, 0.94) 32%, rgba(7, 12, 22, 0.94) 68%, rgba(20, 92, 255, 0.13)),
    rgba(4, 8, 15, 0.96);
  border: 1px solid rgba(111, 158, 204, 0.34);
  box-shadow:
    0 18px 48px -32px rgba(0, 0, 0, 0.92),
    inset 0 1px 0 rgba(255, 255, 255, 0.075),
    inset 0 0 34px rgba(54, 217, 255, 0.035);
  clip-path: polygon(1.2% 0, 98.8% 0, 100% 50%, 98.8% 100%, 1.2% 100%, 0 50%);
  display: flex;
  justify-content: center;
  min-height: 0;
  overflow: hidden;
  position: relative;
  z-index: 3;
}

.ping-pong-rally-lane::before {
  background:
    repeating-linear-gradient(90deg, transparent 0 47px, rgba(255, 255, 255, 0.045) 47px 48px),
    repeating-linear-gradient(0deg, transparent 0 23px, rgba(255, 255, 255, 0.04) 23px 24px);
  content: "";
  inset: 0;
  opacity: 0.72;
  position: absolute;
}

.ping-pong-rally-lane::after {
  background: linear-gradient(90deg, var(--ml-red), rgba(255, 255, 255, 0.72), var(--ml-blue));
  bottom: 0;
  box-shadow: 0 0 16px rgba(54, 217, 255, 0.45);
  content: "";
  height: 2px;
  left: 2.2%;
  position: absolute;
  right: 2.2%;
}

.ping-pong-rally-team {
  color: rgba(255, 255, 255, 0.76);
  font-size: 16px;
  font-weight: 950;
  letter-spacing: 0.13em;
  position: absolute;
  text-transform: uppercase;
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;
}

.ping-pong-rally-team.is-red {
  color: #ff8190;
  left: 34px;
  text-shadow: 0 0 18px rgba(255, 28, 40, 0.72);
}

.ping-pong-rally-team.is-blue {
  color: #8db4ff;
  right: 34px;
  text-shadow: 0 0 18px rgba(20, 92, 255, 0.78);
}

.ping-pong-rally-net {
  background: repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.7) 0 5px, transparent 5px 10px);
  box-shadow: 0 0 16px rgba(255, 255, 255, 0.26);
  height: 68%;
  left: 50%;
  opacity: 0.52;
  position: absolute;
  top: 16%;
  width: 2px;
  z-index: 2;
}

.ping-pong-rally-scan {
  animation: pingPongLaneScan calc(2.1s - var(--ping-pong-rally-pace) * 0.75s) linear infinite;
  background: linear-gradient(90deg, transparent, rgba(54, 217, 255, 0.08), rgba(255, 255, 255, 0.2), transparent);
  filter: blur(1px);
  inset: 0 auto 0 -30%;
  position: absolute;
  transform: skewX(-18deg);
  width: 28%;
  z-index: 1;
}

.ping-pong-ball,
.ping-pong-ball-trail,
.ping-pong-impact {
  left: var(--ping-pong-ball-x);
  pointer-events: none;
  position: absolute;
  top: var(--ping-pong-ball-y);
}

.ping-pong-ball {
  background: #ffffff;
  border: 3px solid rgba(255, 255, 255, 0.92);
  border-radius: 50%;
  box-shadow:
    0 0 8px #ffffff,
    0 0 22px rgba(54, 217, 255, 0.98),
    0 0 46px rgba(54, 217, 255, 0.52);
  height: 19px;
  transform: translate(-50%, -50%);
  transition:
    left 105ms linear,
    top 105ms linear,
    opacity 180ms ease;
  width: 19px;
  z-index: 8;
}

.ping-pong-ball-trail {
  background: rgba(225, 248, 255, 0.92);
  border-radius: 50%;
  box-shadow: 0 0 14px rgba(54, 217, 255, 0.78);
  height: calc(12px - var(--ping-pong-trail-index) * 1.3px);
  opacity: calc(0.38 - var(--ping-pong-trail-index) * 0.055);
  transform: translate(-50%, -50%);
  transition:
    left 105ms linear,
    top 105ms linear;
  width: calc(12px - var(--ping-pong-trail-index) * 1.3px);
  z-index: 6;
}

.ping-pong-impact {
  border: 3px solid var(--ping-pong-impact-color);
  border-radius: 50%;
  box-shadow:
    0 0 18px var(--ping-pong-impact-color),
    inset 0 0 18px var(--ping-pong-impact-color);
  height: 32px;
  transform: translate(-50%, -50%);
  width: 32px;
  z-index: 7;
}

.ping-pong-impact.is-red {
  --ping-pong-impact-color: rgba(255, 54, 74, 0.86);
  animation: pingPongImpactRed 480ms cubic-bezier(0.1, 0.72, 0.2, 1) both;
}

.ping-pong-impact.is-blue {
  --ping-pong-impact-color: rgba(47, 115, 255, 0.92);
  animation: pingPongImpactBlue 480ms cubic-bezier(0.1, 0.72, 0.2, 1) both;
}

.ping-pong-rally-caption {
  animation: pingPongCaptionIn 440ms cubic-bezier(0.16, 1, 0.3, 1) both;
  background: rgba(3, 8, 15, 0.84);
  border: 1px solid rgba(54, 217, 255, 0.34);
  box-shadow:
    0 0 24px rgba(54, 217, 255, 0.11),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  color: #f5fbff;
  font-size: 17px;
  font-weight: 950;
  letter-spacing: 0.12em;
  line-height: 1;
  max-width: 42%;
  overflow-wrap: break-word;
  padding: 9px 20px;
  text-align: center;
  text-transform: uppercase;
  white-space: normal;
  z-index: 10;
}

.ping-pong-display.is-phase-waiting .ping-pong-ball,
.ping-pong-display.is-phase-starting .ping-pong-ball {
  left: 50%;
  top: 50%;
}

.ping-pong-display.is-phase-waiting .ping-pong-ball {
  animation: pingPongStandbyBall 1.4s ease-in-out infinite;
}

.ping-pong-display.is-phase-starting .ping-pong-ball {
  animation: pingPongServeCharge 520ms ease-in-out infinite alternate;
}

.ping-pong-display.is-phase-waiting .ping-pong-ball-trail,
.ping-pong-display.is-phase-starting .ping-pong-ball-trail,
.ping-pong-display.is-phase-finished .ping-pong-ball-trail {
  display: none;
}

.ping-pong-display.is-phase-finished .ping-pong-ball {
  animation: pingPongVictoryBall 760ms cubic-bezier(0.16, 1, 0.3, 1) infinite alternate;
  left: 50%;
  top: 50%;
}

.ping-pong-display.is-scoring-red .ping-pong-ball {
  animation: pingPongPointRed 720ms cubic-bezier(0.12, 0.8, 0.2, 1) both;
}

.ping-pong-display.is-scoring-blue .ping-pong-ball {
  animation: pingPongPointBlue 720ms cubic-bezier(0.12, 0.8, 0.2, 1) both;
}

.ping-pong-display.is-scoring-red .ping-pong-rally-lane {
  animation: pingPongLaneRed 720ms ease-out both;
}

.ping-pong-display.is-scoring-blue .ping-pong-rally-lane {
  animation: pingPongLaneBlue 720ms ease-out both;
}

.ping-pong-metrics .ml-metric {
  transition:
    border-color 280ms ease,
    box-shadow 320ms ease,
    filter 280ms ease,
    transform 320ms ease;
}

.ping-pong-display.is-phase-running .ping-pong-rally-metric .ml-metric-value {
  animation: pingPongRallyValue calc(1.15s - var(--ping-pong-rally-pace) * 0.42s) ease-in-out infinite alternate;
}

.ping-pong-display.is-scoring-red .ping-pong-last-metric,
.ping-pong-display.is-scoring-blue .ping-pong-last-metric {
  animation: pingPongMetricReveal 580ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.ping-pong-rounds .ml-round-progress i {
  background-size: 220% 100%;
  transition: width 540ms cubic-bezier(0.16, 1, 0.3, 1);
}

.ping-pong-display.is-phase-running .ping-pong-rounds .ml-round-progress i {
  animation: pingPongProgressFlow 1.8s linear infinite;
}

.ping-pong-display.is-phase-running .ping-pong-rounds .ml-round-card.is-current {
  animation: pingPongCurrentRound 1.4s ease-in-out infinite alternate;
}

@keyframes pingPongPanelSweep {
  0%, 14% { transform: translateX(-135%); }
  62%, 100% { transform: translateX(135%); }
}

@keyframes pingPongCenterCharge {
  from { box-shadow: 0 0 22px -10px rgba(54, 217, 255, 0.28), inset 0 0 0 rgba(255, 255, 255, 0); }
  to { box-shadow: 0 0 44px -10px rgba(54, 217, 255, 0.64), inset 0 0 30px rgba(255, 255, 255, 0.055); }
}

@keyframes pingPongCountdown {
  from { filter: brightness(0.9); transform: scale(0.92); }
  to { filter: brightness(1.18); transform: scale(1.04); }
}

@keyframes pingPongScorePop {
  0% { filter: brightness(1); transform: scale(0.72); }
  48% { filter: brightness(1.46); transform: scale(1.14); }
  100% { filter: brightness(1.08); transform: scale(1); }
}

@keyframes pingPongWinnerPanel {
  from { box-shadow: 0 22px 70px -28px rgba(var(--ml-player-rgb), 0.48), inset 0 1px 0 rgba(255, 255, 255, 0.1); }
  to { box-shadow: 0 24px 84px -18px rgba(var(--ml-player-rgb), 0.92), inset 0 0 42px rgba(var(--ml-player-rgb), 0.12); }
}

@keyframes pingPongLaneScan {
  from { left: -30%; }
  to { left: 112%; }
}

@keyframes pingPongImpactRed {
  0% { opacity: 1; transform: translate(-50%, -50%) scale(0.35); }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(3.2); }
}

@keyframes pingPongImpactBlue {
  0% { opacity: 1; transform: translate(-50%, -50%) scale(0.35); }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(3.2); }
}

@keyframes pingPongCaptionIn {
  from { opacity: 0; transform: translateY(9px) scale(0.94); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes pingPongStandbyBall {
  0%, 100% { box-shadow: 0 0 8px #fff, 0 0 18px rgba(54, 217, 255, 0.68); opacity: 0.65; transform: translate(-50%, -50%) scale(0.78); }
  50% { box-shadow: 0 0 10px #fff, 0 0 36px rgba(54, 217, 255, 1); opacity: 1; transform: translate(-50%, -50%) scale(1.12); }
}

@keyframes pingPongServeCharge {
  from { box-shadow: 0 0 8px #fff, -22px 0 30px rgba(255, 28, 40, 0.6), 22px 0 30px rgba(20, 92, 255, 0.66); transform: translate(-50%, -50%) scale(0.82); }
  to { box-shadow: 0 0 14px #fff, -36px 0 44px rgba(255, 28, 40, 0.88), 36px 0 44px rgba(20, 92, 255, 0.92); transform: translate(-50%, -50%) scale(1.22); }
}

@keyframes pingPongVictoryBall {
  from { box-shadow: 0 0 10px #fff, 0 0 30px rgba(255, 207, 90, 0.68); transform: translate(-50%, -50%) rotate(-12deg) scale(1); }
  to { box-shadow: 0 0 18px #fff, 0 0 58px rgba(255, 207, 90, 1); transform: translate(-50%, -50%) rotate(12deg) scale(1.48); }
}

@keyframes pingPongPointRed {
  0% { left: var(--ping-pong-ball-x); opacity: 1; transform: translate(-50%, -50%) scale(1); }
  44% { left: 4%; opacity: 1; transform: translate(-50%, -50%) scale(1.42); }
  100% { left: 4%; opacity: 0; transform: translate(-50%, -50%) scale(2.8); }
}

@keyframes pingPongPointBlue {
  0% { left: var(--ping-pong-ball-x); opacity: 1; transform: translate(-50%, -50%) scale(1); }
  44% { left: 96%; opacity: 1; transform: translate(-50%, -50%) scale(1.42); }
  100% { left: 96%; opacity: 0; transform: translate(-50%, -50%) scale(2.8); }
}

@keyframes pingPongLaneRed {
  0% { border-color: rgba(111, 158, 204, 0.34); box-shadow: inset 0 0 0 rgba(255, 28, 40, 0); }
  38% { border-color: rgba(255, 54, 74, 0.92); box-shadow: inset 120px 0 120px -60px rgba(255, 28, 40, 0.58); }
  100% { border-color: rgba(111, 158, 204, 0.34); box-shadow: inset 0 0 0 rgba(255, 28, 40, 0); }
}

@keyframes pingPongLaneBlue {
  0% { border-color: rgba(111, 158, 204, 0.34); box-shadow: inset 0 0 0 rgba(20, 92, 255, 0); }
  38% { border-color: rgba(47, 115, 255, 0.96); box-shadow: inset -120px 0 120px -60px rgba(20, 92, 255, 0.66); }
  100% { border-color: rgba(111, 158, 204, 0.34); box-shadow: inset 0 0 0 rgba(20, 92, 255, 0); }
}

@keyframes pingPongRallyValue {
  from { filter: brightness(0.96); text-shadow: 0 0 10px rgba(54, 217, 255, 0.18); transform: translateY(1px); }
  to { filter: brightness(1.18); text-shadow: 0 0 24px rgba(54, 217, 255, 0.52); transform: translateY(-2px); }
}

@keyframes pingPongMetricReveal {
  from { filter: brightness(1.6); transform: translateY(8px) scale(0.97); }
  to { filter: brightness(1); transform: translateY(0) scale(1); }
}

@keyframes pingPongProgressFlow {
  from { background-position: 100% 0; }
  to { background-position: -120% 0; }
}

@keyframes pingPongCurrentRound {
  from { filter: brightness(0.94); transform: translateY(0); }
  to { filter: brightness(1.12); transform: translateY(-2px); }
}

@media (prefers-reduced-motion: reduce) {
  .ping-pong-display *,
  .ping-pong-display *::before,
  .ping-pong-display *::after,
  .ml-player-ready-overlay *,
  .ml-player-ready-overlay *::before,
  .ml-player-ready-overlay *::after,
  .ml-status-pill::before {
    animation-delay: 0s !important;
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 1ms !important;
  }
}

.memory-challenge-display {
  display: grid;
  gap: 18px;
  grid-template-rows: 190px minmax(0, 1fr) 74px;
  min-height: 0;
}

.memory-challenge-hero {
  align-items: stretch;
  background: linear-gradient(110deg, rgba(0, 90, 248, 0.22), rgba(7, 12, 22, 0.96) 55%, rgba(255, 90, 20, 0.12));
  border: 1px solid rgba(54, 217, 255, 0.34);
  clip-path: polygon(1.3% 0, 100% 0, 98.7% 100%, 0 100%);
  display: grid;
  gap: 18px;
  grid-template-columns: minmax(0, 1fr) 250px 250px;
  padding: 24px 30px;
}

.memory-challenge-hero > div { display: grid; align-content: center; gap: 8px; min-width: 0; }
.memory-challenge-hero > div span,
.memory-challenge-hero article span { color: var(--ml-cyan); font-size: 17px; font-weight: 950; letter-spacing: 0.12em; text-transform: uppercase; }
.memory-challenge-hero > div strong { color: #fff; font-size: clamp(42px, 3.3vw, 64px); line-height: 0.98; overflow-wrap: break-word; }
.memory-challenge-hero > div b { color: #b8c6d8; font-size: 19px; overflow-wrap: break-word; }
.memory-challenge-hero article { align-content: center; background: rgba(3, 8, 16, 0.72); border: 1px solid rgba(111, 158, 204, 0.26); display: grid; gap: 8px; padding: 18px 22px; }
.memory-challenge-hero article strong { color: var(--ml-amber); font-size: 58px; line-height: 1; }

.memory-challenge-players { display: grid; gap: 16px; grid-template-columns: repeat(var(--memory-columns), minmax(0, 1fr)); min-height: 0; }
.memory-challenge-player { --memory-player: #fff; --memory-player-rgb: 255,255,255; background: linear-gradient(160deg, rgba(var(--memory-player-rgb), 0.2), rgba(4, 8, 15, 0.96) 62%); border: 1px solid rgba(var(--memory-player-rgb), 0.66); box-shadow: inset 0 0 42px rgba(var(--memory-player-rgb), 0.06); display: grid; grid-template-rows: auto minmax(0, 1fr) 14px auto; min-width: 0; padding: 22px; }
.memory-challenge-player header { align-items: center; display: grid; gap: 10px; grid-template-columns: 12px minmax(0, 1fr) auto; }
.memory-challenge-player header i { background: var(--memory-player); border-radius: 50%; box-shadow: 0 0 18px var(--memory-player); height: 10px; width: 10px; }
.memory-challenge-player header strong { color: #fff; font-size: clamp(22px, 1.7vw, 34px); overflow-wrap: break-word; }
.memory-challenge-player header b { color: var(--memory-player); font-size: 14px; text-align: right; text-transform: uppercase; }
.memory-challenge-score { align-content: center; display: grid; gap: 4px; }
.memory-challenge-score strong { color: #fff; font-size: clamp(74px, 7vw, 128px); line-height: 0.9; text-shadow: 0 0 30px rgba(var(--memory-player-rgb), 0.55); }
.memory-challenge-score span { color: #aab7c8; font-size: 18px; }
.memory-challenge-track { background: rgba(255,255,255,0.08); border: 1px solid rgba(var(--memory-player-rgb), 0.26); overflow: hidden; }
.memory-challenge-track i { background: linear-gradient(90deg, var(--memory-player), #fff); display: block; height: 100%; width: calc(var(--memory-progress) * 100%); }
.memory-challenge-player footer { display: flex; justify-content: space-between; padding-top: 14px; color: #9eabbd; font-size: 16px; }
.memory-challenge-player footer strong { color: var(--memory-player); font-size: 22px; }
.memory-challenge-player.is-failed { border-color: #ff6b22; filter: saturate(0.8); }
.memory-challenge-player.is-failed header b { color: #ff9b55; }
.memory-challenge-player.is-winner { box-shadow: 0 0 60px rgba(var(--memory-player-rgb), 0.5), inset 0 0 50px rgba(var(--memory-player-rgb), 0.18); transform: translateY(-5px); }

.memory-challenge-event { align-items: center; background: rgba(5, 12, 22, 0.9); border: 1px solid rgba(54, 217, 255, 0.28); display: grid; gap: 22px; grid-template-columns: 180px minmax(0, 1fr) auto; padding: 14px 24px; }
.memory-challenge-event span { color: var(--ml-cyan); font-size: 15px; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase; }
.memory-challenge-event strong { color: #fff; font-size: 24px; overflow-wrap: break-word; }
.memory-challenge-event b { color: var(--ml-amber); font-size: 18px; text-align: right; }

.tetris-display { display: grid; gap: 18px; grid-template-rows: 174px minmax(0, 1fr) 72px; min-height: 0; }
.tetris-summary { display: grid; gap: 18px; grid-template-columns: minmax(360px, 0.8fr) minmax(0, 1.2fr); }
.tetris-callout { align-content: center; background: linear-gradient(115deg, rgba(54,217,255,.2), rgba(255,82,200,.08)), rgba(4,9,16,.92); border: 1px solid rgba(54,217,255,.38); display: grid; gap: 7px; padding: 22px 28px; }
.tetris-callout span { color: var(--ml-cyan); font-size: 16px; font-weight: 950; letter-spacing: .12em; text-transform: uppercase; }
.tetris-callout strong { color: #fff; font-size: clamp(38px, 3vw, 58px); line-height: .96; overflow-wrap: break-word; }
.tetris-callout b { color: #aebacd; font-size: 18px; overflow-wrap: break-word; }
.tetris-metrics .ml-metric { min-height: 0; }
.tetris-main { display: grid; gap: 18px; grid-template-columns: minmax(0, 1fr) 390px; min-height: 0; }
.tetris-floor { min-height: 0; }
.tetris-side { display: grid; gap: 14px; grid-template-columns: 1fr 1fr; grid-template-rows: minmax(0, 1fr) 110px; }
.tetris-piece-card { --tetris-piece: #36d9ff; align-content: start; background: rgba(5,11,20,.92); border: 1px solid color-mix(in srgb, var(--tetris-piece) 60%, transparent); display: grid; gap: 14px; padding: 18px; }
.tetris-piece-card > span { color: #aab7c8; font-size: 15px; font-weight: 900; letter-spacing: .1em; text-transform: uppercase; }
.tetris-piece-card > div { align-self: center; display: grid; grid-auto-columns: 32px; grid-auto-rows: 32px; justify-content: center; min-height: 128px; }
.tetris-piece-card i { background: var(--tetris-piece); border: 1px solid rgba(255,255,255,.5); box-shadow: 0 0 18px color-mix(in srgb, var(--tetris-piece) 55%, transparent); }
.tetris-piece-card strong { color: var(--tetris-piece); font-size: 34px; text-align: center; }
.tetris-controls { align-content: center; background: rgba(8,16,28,.94); border: 1px solid rgba(255,209,102,.3); display: grid; gap: 5px; grid-column: 1 / -1; padding: 14px 18px; text-align: center; }
.tetris-controls span { color: var(--ml-amber); font-size: 13px; font-weight: 900; letter-spacing: .1em; text-transform: uppercase; }
.tetris-controls strong { color: #fff; font-size: 18px; }
.tetris-controls b { color: #aab7c8; font-size: 14px; }
.tetris-event { align-items: center; background: rgba(5,12,22,.94); border: 1px solid rgba(54,217,255,.3); display: grid; gap: 18px; grid-template-columns: 170px minmax(0, 1fr) auto; padding: 13px 22px; }
.tetris-event span { color: var(--ml-cyan); font-size: 14px; font-weight: 900; letter-spacing: .1em; text-transform: uppercase; }
.tetris-event strong { color: #fff; font-size: 23px; overflow-wrap: break-word; }
.tetris-event b { color: var(--ml-amber); font-size: 18px; }
.tetris-display.is-line-clear .tetris-callout { border-color: var(--ml-yellow); box-shadow: inset 0 0 36px rgba(255,225,118,.12); }
.tetris-display.is-game-win .tetris-callout { border-color: var(--ml-cyan); box-shadow: 0 0 48px rgba(54,217,255,.3); }
.tetris-display.is-game-loss .tetris-callout { border-color: var(--ml-red); background: rgba(60,4,12,.68); }

@media (prefers-reduced-motion: reduce) {
  .memory-challenge-display *,
  .memory-challenge-display *::before,
  .memory-challenge-display *::after { animation: none !important; transition: none !important; }
  .tetris-display *, .tetris-display *::before, .tetris-display *::after { animation: none !important; transition: none !important; }
}

.ml-solo-display {
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(0, 1fr) 410px;
  min-height: 0;
  position: relative;
}

.ml-player-ready-overlay {
  align-content: center;
  background:
    radial-gradient(circle at 50% 46%, rgba(54, 217, 255, 0.19), transparent 34%),
    linear-gradient(135deg, rgba(5, 12, 23, 0.98), rgba(4, 7, 14, 0.96));
  border: 1px solid rgba(54, 217, 255, 0.42);
  box-shadow:
    inset 0 0 90px rgba(54, 217, 255, 0.06),
    0 0 64px rgba(54, 217, 255, 0.11);
  clip-path: polygon(2% 0, 98% 0, 100% 4%, 100% 96%, 98% 100%, 2% 100%, 0 96%, 0 4%);
  display: grid;
  gap: 18px;
  inset: 0;
  justify-items: center;
  padding: 44px;
  position: absolute;
  text-align: center;
  z-index: 5;
}

.ml-player-ready-overlay > span {
  color: var(--ml-cyan);
  font-size: 28px;
  font-weight: 950;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.ml-player-ready-overlay > strong {
  color: #ffffff;
  font-size: clamp(112px, 10vw, 190px);
  font-variant-numeric: tabular-nums;
  font-weight: 950;
  letter-spacing: -0.05em;
  line-height: 0.85;
  text-shadow: 0 0 46px rgba(54, 217, 255, 0.48);
}

.ml-player-ready-overlay > b {
  color: rgba(240, 243, 246, 0.82);
  font-size: 30px;
  font-weight: 800;
  max-width: 820px;
  overflow-wrap: break-word;
  white-space: normal;
}

.ml-player-ready-pulse {
  height: 132px;
  position: relative;
  width: 132px;
}

.ml-player-ready-pulse i {
  animation: ml-ready-ring 1.8s ease-out infinite;
  border: 5px solid rgba(54, 217, 255, 0.82);
  border-radius: 50%;
  inset: 0;
  position: absolute;
}

.ml-player-ready-pulse i:nth-child(2) {
  animation-delay: 0.36s;
}

.ml-player-ready-pulse i:nth-child(3) {
  animation-delay: 0.72s;
}

.ml-player-ready-overlay.is-starting {
  background:
    radial-gradient(circle at 50% 45%, rgba(255, 225, 118, 0.2), transparent 36%),
    linear-gradient(135deg, rgba(15, 15, 19, 0.98), rgba(4, 7, 14, 0.96));
  border-color: rgba(255, 225, 118, 0.58);
}

.ml-player-ready-overlay.is-starting > span {
  color: var(--ml-yellow);
}

.ml-player-ready-overlay.is-starting > strong {
  animation: ml-ready-number 0.7s ease-in-out infinite;
  color: var(--ml-yellow);
  text-shadow: 0 0 54px rgba(255, 225, 118, 0.48);
}

.ml-player-ready-overlay.is-starting .ml-player-ready-pulse i {
  animation-duration: 0.9s;
  border-color: rgba(255, 225, 118, 0.88);
}

@keyframes ml-status-breathe {
  0%, 100% { opacity: 0.45; transform: scale(0.78); }
  50% { opacity: 1; transform: scale(1.18); }
}

@keyframes ml-status-countdown {
  0%, 100% { opacity: 0.58; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.28); }
}

@keyframes ml-ready-ring {
  0% { opacity: 0; transform: scale(0.22); }
  26% { opacity: 0.9; }
  100% { opacity: 0; transform: scale(1); }
}

@keyframes ml-ready-number {
  0%, 100% { opacity: 0.75; transform: scale(0.94); }
  50% { opacity: 1; transform: scale(1.04); }
}

.ml-solo-summary {
  display: grid;
  gap: 22px;
  grid-template-rows: minmax(250px, 0.72fr) minmax(300px, 1fr);
  min-height: 0;
}

.ml-solo-number-row {
  min-height: 0;
}

.ml-solo-number-row .ml-metric {
  align-content: center;
  gap: 18px;
  padding: 30px 34px;
}

.ml-solo-number-row .ml-metric-label {
  font-size: clamp(24px, 1.55vw, 30px);
}

.ml-solo-number-row .ml-metric-value {
  font-size: clamp(136px, 8.2vw, 164px);
  line-height: 0.88;
}

.ml-solo-number-row .ml-lives-meter {
  gap: 14px;
  min-height: 124px;
}

.ml-solo-number-row .ml-life-heart {
  font-size: clamp(116px, 6.8vw, 136px);
}

.ml-solo-message {
  align-content: center;
  border-color: rgba(54, 217, 255, 0.36);
  padding: 34px 40px;
}

.ml-solo-message .ml-metric-label {
  color: var(--ml-cyan);
}

.ml-solo-message .ml-metric-value {
  font-size: clamp(62px, 4.7vw, 92px);
  line-height: 1.02;
  text-shadow: 0 0 32px rgba(54, 217, 255, 0.18);
}

.hello-world-result-copy {
  align-items: start;
  display: grid;
  gap: 14px;
}

.hello-world-result-copy > span {
  line-height: 0.94;
}

.hello-world-result-copy small {
  color: var(--ml-muted);
  font-size: clamp(26px, 1.8vw, 34px);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hello-world-display.is-result-win .ml-solo-message {
  animation: helloWorldWinGlow 1.25s ease-in-out infinite;
  border-color: rgba(126, 231, 135, 0.76);
}

.hello-world-display.is-result-lose .ml-solo-message {
  animation: helloWorldLosePulse 900ms ease-in-out infinite;
  border-color: rgba(255, 32, 54, 0.72);
}

.hello-world-display.is-result-win .hello-world-result-copy,
.hello-world-display.is-result-lose .hello-world-result-copy {
  animation: helloWorldResultEnter 720ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.hello-world-display.is-result-win .ml-solo-number-row .ml-metric {
  box-shadow: inset 0 0 52px rgba(126, 231, 135, 0.08);
}

.hello-world-display.is-result-lose .ml-solo-number-row .ml-metric {
  box-shadow: inset 0 0 52px rgba(255, 32, 54, 0.07);
}

@keyframes helloWorldWinGlow {
  0%,
  100% {
    box-shadow: inset 0 0 38px rgba(126, 231, 135, 0.08), 0 0 32px rgba(126, 231, 135, 0.08);
    transform: scale(1);
  }

  50% {
    box-shadow: inset 0 0 72px rgba(126, 231, 135, 0.18), 0 0 54px rgba(126, 231, 135, 0.18);
    transform: scale(1.008);
  }
}

@keyframes helloWorldLosePulse {
  0%,
  100% {
    box-shadow: inset 0 0 34px rgba(255, 32, 54, 0.07), 0 0 26px rgba(255, 32, 54, 0.08);
    filter: brightness(0.92);
  }

  50% {
    box-shadow: inset 0 0 68px rgba(255, 32, 54, 0.18), 0 0 48px rgba(255, 32, 54, 0.16);
    filter: brightness(1.12);
  }
}

@keyframes helloWorldResultEnter {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.94);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hello-world-display.is-result-win .ml-solo-message,
  .hello-world-display.is-result-lose .ml-solo-message,
  .hello-world-display .hello-world-result-copy {
    animation: none;
  }
}

.ml-frame-preview-panel {
  display: grid;
  gap: 16px;
  justify-items: center;
  min-height: 0;
}

.ml-solo-floor {
  align-content: center;
  background:
    radial-gradient(circle at 50% 48%, rgba(54, 217, 255, 0.11), transparent 62%),
    rgba(5, 8, 15, 0.82);
  border: 1px solid rgba(54, 217, 255, 0.24);
  box-shadow:
    0 24px 66px -34px rgba(0, 0, 0, 0.88),
    inset 0 1px 0 rgba(255, 255, 255, 0.07);
  clip-path: polygon(7% 0, 100% 0, 100% 100%, 7% 100%, 0 94%, 0 6%);
  padding: 30px 26px 34px;
}

.ml-solo-floor > span {
  color: rgba(255, 255, 255, 0.78);
  font-size: 20px;
}

.ml-frame-preview-panel.ml-solo-floor .ml-floor-preview {
  border-color: rgba(54, 217, 255, 0.36);
  box-shadow:
    0 20px 48px rgba(0, 0, 0, 0.48),
    0 0 36px rgba(54, 217, 255, 0.12);
  height: 720px;
  width: 360px;
}

.ml-frame-preview-panel > span {
  color: var(--ml-muted);
  font-size: 18px;
  font-weight: 950;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.ml-frame-preview-panel .ml-floor-preview {
  height: 360px;
  width: 190px;
}

.ml-floor-preview {
  aspect-ratio: var(--ml-floor-cols) / var(--ml-floor-rows);
  background: #02060b;
  border: 1px solid rgba(91, 143, 189, 0.24);
  border-radius: 0;
  display: grid;
  gap: 2px;
  grid-template-columns: repeat(var(--ml-floor-cols), minmax(0, 1fr));
  grid-template-rows: repeat(var(--ml-floor-rows), minmax(0, 1fr));
  overflow: hidden;
  padding: 6px;
}

.ml-floor-tile {
  aspect-ratio: 1;
  border: 0;
  border-radius: 0;
  display: block;
  min-height: 0;
  min-width: 0;
  padding: 0;
}

.ml-floor-interactive .ml-floor-tile {
  cursor: pointer;
  transition:
    filter 120ms ease,
    transform 120ms ease;
}

.ml-floor-interactive .ml-floor-tile:focus-visible {
  outline: 2px solid rgba(54, 217, 255, 0.9);
  outline-offset: -2px;
  z-index: 1;
}

@media (hover: hover) and (pointer: fine) {
  .ml-floor-interactive .ml-floor-tile:hover {
    filter: brightness(1.45);
    outline: 1px solid rgba(255, 255, 255, 0.62);
    transform: scale(1.08);
    z-index: 1;
  }
}

@media (max-width: 680px) {
  .ml-display-header h1 {
    font-size: 32px;
  }

  .ml-metric-value {
    font-size: 38px;
  }

  .ml-life-heart {
    font-size: 56px;
  }
}
`,document.head.append(t)}_E();window.MotionLevelsGamesDisplay={revision:"fb09287eb3bfb153306d76ab1b9134406c353a9c",mount:Jb,update:Jb,unmount:PE};})();
