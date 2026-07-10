"use strict";(()=>{var Kp=Object.create;var vs=Object.defineProperty;var Jp=Object.getOwnPropertyDescriptor;var Fp=Object.getOwnPropertyNames;var kp=Object.getPrototypeOf,Wp=Object.prototype.hasOwnProperty;var me=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports),Tn=(t,e)=>{for(var l in e)vs(t,l,{get:e[l],enumerable:!0})},Pp=(t,e,l,a)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of Fp(e))!Wp.call(t,i)&&i!==l&&vs(t,i,{get:()=>e[i],enumerable:!(a=Jp(e,i))||a.enumerable});return t};var gt=(t,e,l)=>(l=t!=null?Kp(kp(t)):{},Pp(e||!t||!t.__esModule?vs(l,"default",{value:t,enumerable:!0}):l,t));var Po=me(tt=>{"use strict";function Ss(t,e){var l=t.length;t.push(e);t:for(;0<l;){var a=l-1>>>1,i=t[a];if(0<Gn(i,e))t[a]=e,t[l]=i,l=a;else break t}}function he(t){return t.length===0?null:t[0]}function zn(t){if(t.length===0)return null;var e=t[0],l=t.pop();if(l!==e){t[0]=l;t:for(var a=0,i=t.length,n=i>>>1;a<n;){var u=2*(a+1)-1,s=t[u],r=u+1,o=t[r];if(0>Gn(s,l))r<i&&0>Gn(o,s)?(t[a]=o,t[r]=l,a=r):(t[a]=s,t[u]=l,a=u);else if(r<i&&0>Gn(o,l))t[a]=o,t[r]=l,a=r;else break t}}return e}function Gn(t,e){var l=t.sortIndex-e.sortIndex;return l!==0?l:t.id-e.id}tt.unstable_now=void 0;typeof performance=="object"&&typeof performance.now=="function"?(jo=performance,tt.unstable_now=function(){return jo.now()}):(gs=Date,Qo=gs.now(),tt.unstable_now=function(){return gs.now()-Qo});var jo,gs,Qo,Ce=[],ll=[],$p=1,$t=null,Gt=3,Es=!1,oi=!1,fi=!1,xs=!1,Ko=typeof setTimeout=="function"?setTimeout:null,Jo=typeof clearTimeout=="function"?clearTimeout:null,Zo=typeof setImmediate<"u"?setImmediate:null;function An(t){for(var e=he(ll);e!==null;){if(e.callback===null)zn(ll);else if(e.startTime<=t)zn(ll),e.sortIndex=e.expirationTime,Ss(Ce,e);else break;e=he(ll)}}function Ts(t){if(fi=!1,An(t),!oi)if(he(Ce)!==null)oi=!0,oa||(oa=!0,ca());else{var e=he(ll);e!==null&&Gs(Ts,e.startTime-t)}}var oa=!1,di=-1,Fo=5,ko=-1;function Wo(){return xs?!0:!(tt.unstable_now()-ko<Fo)}function bs(){if(xs=!1,oa){var t=tt.unstable_now();ko=t;var e=!0;try{t:{oi=!1,fi&&(fi=!1,Jo(di),di=-1),Es=!0;var l=Gt;try{e:{for(An(t),$t=he(Ce);$t!==null&&!($t.expirationTime>t&&Wo());){var a=$t.callback;if(typeof a=="function"){$t.callback=null,Gt=$t.priorityLevel;var i=a($t.expirationTime<=t);if(t=tt.unstable_now(),typeof i=="function"){$t.callback=i,An(t),e=!0;break e}$t===he(Ce)&&zn(Ce),An(t)}else zn(Ce);$t=he(Ce)}if($t!==null)e=!0;else{var n=he(ll);n!==null&&Gs(Ts,n.startTime-t),e=!1}}break t}finally{$t=null,Gt=l,Es=!1}e=void 0}}finally{e?ca():oa=!1}}}var ca;typeof Zo=="function"?ca=function(){Zo(bs)}:typeof MessageChannel<"u"?(Ms=new MessageChannel,Vo=Ms.port2,Ms.port1.onmessage=bs,ca=function(){Vo.postMessage(null)}):ca=function(){Ko(bs,0)};var Ms,Vo;function Gs(t,e){di=Ko(function(){t(tt.unstable_now())},e)}tt.unstable_IdlePriority=5;tt.unstable_ImmediatePriority=1;tt.unstable_LowPriority=4;tt.unstable_NormalPriority=3;tt.unstable_Profiling=null;tt.unstable_UserBlockingPriority=2;tt.unstable_cancelCallback=function(t){t.callback=null};tt.unstable_forceFrameRate=function(t){0>t||125<t?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):Fo=0<t?Math.floor(1e3/t):5};tt.unstable_getCurrentPriorityLevel=function(){return Gt};tt.unstable_next=function(t){switch(Gt){case 1:case 2:case 3:var e=3;break;default:e=Gt}var l=Gt;Gt=e;try{return t()}finally{Gt=l}};tt.unstable_requestPaint=function(){xs=!0};tt.unstable_runWithPriority=function(t,e){switch(t){case 1:case 2:case 3:case 4:case 5:break;default:t=3}var l=Gt;Gt=t;try{return e()}finally{Gt=l}};tt.unstable_scheduleCallback=function(t,e,l){var a=tt.unstable_now();switch(typeof l=="object"&&l!==null?(l=l.delay,l=typeof l=="number"&&0<l?a+l:a):l=a,t){case 1:var i=-1;break;case 2:i=250;break;case 5:i=1073741823;break;case 4:i=1e4;break;default:i=5e3}return i=l+i,t={id:$p++,callback:e,priorityLevel:t,startTime:l,expirationTime:i,sortIndex:-1},l>a?(t.sortIndex=l,Ss(ll,t),he(Ce)===null&&t===he(ll)&&(fi?(Jo(di),di=-1):fi=!0,Gs(Ts,l-a))):(t.sortIndex=i,Ss(Ce,t),oi||Es||(oi=!0,oa||(oa=!0,ca()))),t};tt.unstable_shouldYield=Wo;tt.unstable_wrapCallback=function(t){var e=Gt;return function(){var l=Gt;Gt=e;try{return t.apply(this,arguments)}finally{Gt=l}}}});var Io=me((Bg,$o)=>{"use strict";$o.exports=Po()});var ff=me(D=>{"use strict";var Cs=Symbol.for("react.transitional.element"),Ip=Symbol.for("react.portal"),t0=Symbol.for("react.fragment"),e0=Symbol.for("react.strict_mode"),l0=Symbol.for("react.profiler"),a0=Symbol.for("react.consumer"),i0=Symbol.for("react.context"),n0=Symbol.for("react.forward_ref"),u0=Symbol.for("react.suspense"),s0=Symbol.for("react.memo"),nf=Symbol.for("react.lazy"),r0=Symbol.for("react.activity"),tf=Symbol.iterator;function c0(t){return t===null||typeof t!="object"?null:(t=tf&&t[tf]||t["@@iterator"],typeof t=="function"?t:null)}var uf={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},sf=Object.assign,rf={};function da(t,e,l){this.props=t,this.context=e,this.refs=rf,this.updater=l||uf}da.prototype.isReactComponent={};da.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};da.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function cf(){}cf.prototype=da.prototype;function _s(t,e,l){this.props=t,this.context=e,this.refs=rf,this.updater=l||uf}var Rs=_s.prototype=new cf;Rs.constructor=_s;sf(Rs,da.prototype);Rs.isPureReactComponent=!0;var ef=Array.isArray;function zs(){}var W={H:null,A:null,T:null,S:null},of=Object.prototype.hasOwnProperty;function Ds(t,e,l){var a=l.ref;return{$$typeof:Cs,type:t,key:e,ref:a!==void 0?a:null,props:l}}function o0(t,e){return Ds(t.type,e,t.props)}function Os(t){return typeof t=="object"&&t!==null&&t.$$typeof===Cs}function f0(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(l){return e[l]})}var lf=/\/+/g;function As(t,e){return typeof t=="object"&&t!==null&&t.key!=null?f0(""+t.key):e.toString(36)}function d0(t){switch(t.status){case"fulfilled":return t.value;case"rejected":throw t.reason;default:switch(typeof t.status=="string"?t.then(zs,zs):(t.status="pending",t.then(function(e){t.status==="pending"&&(t.status="fulfilled",t.value=e)},function(e){t.status==="pending"&&(t.status="rejected",t.reason=e)})),t.status){case"fulfilled":return t.value;case"rejected":throw t.reason}}throw t}function fa(t,e,l,a,i){var n=typeof t;(n==="undefined"||n==="boolean")&&(t=null);var u=!1;if(t===null)u=!0;else switch(n){case"bigint":case"string":case"number":u=!0;break;case"object":switch(t.$$typeof){case Cs:case Ip:u=!0;break;case nf:return u=t._init,fa(u(t._payload),e,l,a,i)}}if(u)return i=i(t),u=a===""?"."+As(t,0):a,ef(i)?(l="",u!=null&&(l=u.replace(lf,"$&/")+"/"),fa(i,e,l,"",function(o){return o})):i!=null&&(Os(i)&&(i=o0(i,l+(i.key==null||t&&t.key===i.key?"":(""+i.key).replace(lf,"$&/")+"/")+u)),e.push(i)),1;u=0;var s=a===""?".":a+":";if(ef(t))for(var r=0;r<t.length;r++)a=t[r],n=s+As(a,r),u+=fa(a,e,l,n,i);else if(r=c0(t),typeof r=="function")for(t=r.call(t),r=0;!(a=t.next()).done;)a=a.value,n=s+As(a,r++),u+=fa(a,e,l,n,i);else if(n==="object"){if(typeof t.then=="function")return fa(d0(t),e,l,a,i);throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.")}return u}function Cn(t,e,l){if(t==null)return t;var a=[],i=0;return fa(t,a,"","",function(n){return e.call(l,n,i++)}),a}function m0(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(l){(t._status===0||t._status===-1)&&(t._status=1,t._result=l)},function(l){(t._status===0||t._status===-1)&&(t._status=2,t._result=l)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var af=typeof reportError=="function"?reportError:function(t){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var e=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof t=="object"&&t!==null&&typeof t.message=="string"?String(t.message):String(t),error:t});if(!window.dispatchEvent(e))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",t);return}console.error(t)},h0={map:Cn,forEach:function(t,e,l){Cn(t,function(){e.apply(this,arguments)},l)},count:function(t){var e=0;return Cn(t,function(){e++}),e},toArray:function(t){return Cn(t,function(e){return e})||[]},only:function(t){if(!Os(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};D.Activity=r0;D.Children=h0;D.Component=da;D.Fragment=t0;D.Profiler=l0;D.PureComponent=_s;D.StrictMode=e0;D.Suspense=u0;D.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=W;D.__COMPILER_RUNTIME={__proto__:null,c:function(t){return W.H.useMemoCache(t)}};D.cache=function(t){return function(){return t.apply(null,arguments)}};D.cacheSignal=function(){return null};D.cloneElement=function(t,e,l){if(t==null)throw Error("The argument must be a React element, but you passed "+t+".");var a=sf({},t.props),i=t.key;if(e!=null)for(n in e.key!==void 0&&(i=""+e.key),e)!of.call(e,n)||n==="key"||n==="__self"||n==="__source"||n==="ref"&&e.ref===void 0||(a[n]=e[n]);var n=arguments.length-2;if(n===1)a.children=l;else if(1<n){for(var u=Array(n),s=0;s<n;s++)u[s]=arguments[s+2];a.children=u}return Ds(t.type,i,a)};D.createContext=function(t){return t={$$typeof:i0,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null},t.Provider=t,t.Consumer={$$typeof:a0,_context:t},t};D.createElement=function(t,e,l){var a,i={},n=null;if(e!=null)for(a in e.key!==void 0&&(n=""+e.key),e)of.call(e,a)&&a!=="key"&&a!=="__self"&&a!=="__source"&&(i[a]=e[a]);var u=arguments.length-2;if(u===1)i.children=l;else if(1<u){for(var s=Array(u),r=0;r<u;r++)s[r]=arguments[r+2];i.children=s}if(t&&t.defaultProps)for(a in u=t.defaultProps,u)i[a]===void 0&&(i[a]=u[a]);return Ds(t,n,i)};D.createRef=function(){return{current:null}};D.forwardRef=function(t){return{$$typeof:n0,render:t}};D.isValidElement=Os;D.lazy=function(t){return{$$typeof:nf,_payload:{_status:-1,_result:t},_init:m0}};D.memo=function(t,e){return{$$typeof:s0,type:t,compare:e===void 0?null:e}};D.startTransition=function(t){var e=W.T,l={};W.T=l;try{var a=t(),i=W.S;i!==null&&i(l,a),typeof a=="object"&&a!==null&&typeof a.then=="function"&&a.then(zs,af)}catch(n){af(n)}finally{e!==null&&l.types!==null&&(e.types=l.types),W.T=e}};D.unstable_useCacheRefresh=function(){return W.H.useCacheRefresh()};D.use=function(t){return W.H.use(t)};D.useActionState=function(t,e,l){return W.H.useActionState(t,e,l)};D.useCallback=function(t,e){return W.H.useCallback(t,e)};D.useContext=function(t){return W.H.useContext(t)};D.useDebugValue=function(){};D.useDeferredValue=function(t,e){return W.H.useDeferredValue(t,e)};D.useEffect=function(t,e){return W.H.useEffect(t,e)};D.useEffectEvent=function(t){return W.H.useEffectEvent(t)};D.useId=function(){return W.H.useId()};D.useImperativeHandle=function(t,e,l){return W.H.useImperativeHandle(t,e,l)};D.useInsertionEffect=function(t,e){return W.H.useInsertionEffect(t,e)};D.useLayoutEffect=function(t,e){return W.H.useLayoutEffect(t,e)};D.useMemo=function(t,e){return W.H.useMemo(t,e)};D.useOptimistic=function(t,e){return W.H.useOptimistic(t,e)};D.useReducer=function(t,e,l){return W.H.useReducer(t,e,l)};D.useRef=function(t){return W.H.useRef(t)};D.useState=function(t){return W.H.useState(t)};D.useSyncExternalStore=function(t,e,l){return W.H.useSyncExternalStore(t,e,l)};D.useTransition=function(){return W.H.useTransition()};D.version="19.2.7"});var Yl=me((qg,df)=>{"use strict";df.exports=ff()});var hf=me(Ct=>{"use strict";var y0=Yl();function mf(t){var e="https://react.dev/errors/"+t;if(1<arguments.length){e+="?args[]="+encodeURIComponent(arguments[1]);for(var l=2;l<arguments.length;l++)e+="&args[]="+encodeURIComponent(arguments[l])}return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function al(){}var zt={d:{f:al,r:function(){throw Error(mf(522))},D:al,C:al,L:al,m:al,X:al,S:al,M:al},p:0,findDOMNode:null},p0=Symbol.for("react.portal");function v0(t,e,l){var a=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:p0,key:a==null?null:""+a,children:t,containerInfo:e,implementation:l}}var mi=y0.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function _n(t,e){if(t==="font")return"";if(typeof e=="string")return e==="use-credentials"?e:""}Ct.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=zt;Ct.createPortal=function(t,e){var l=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)throw Error(mf(299));return v0(t,e,null,l)};Ct.flushSync=function(t){var e=mi.T,l=zt.p;try{if(mi.T=null,zt.p=2,t)return t()}finally{mi.T=e,zt.p=l,zt.d.f()}};Ct.preconnect=function(t,e){typeof t=="string"&&(e?(e=e.crossOrigin,e=typeof e=="string"?e==="use-credentials"?e:"":void 0):e=null,zt.d.C(t,e))};Ct.prefetchDNS=function(t){typeof t=="string"&&zt.d.D(t)};Ct.preinit=function(t,e){if(typeof t=="string"&&e&&typeof e.as=="string"){var l=e.as,a=_n(l,e.crossOrigin),i=typeof e.integrity=="string"?e.integrity:void 0,n=typeof e.fetchPriority=="string"?e.fetchPriority:void 0;l==="style"?zt.d.S(t,typeof e.precedence=="string"?e.precedence:void 0,{crossOrigin:a,integrity:i,fetchPriority:n}):l==="script"&&zt.d.X(t,{crossOrigin:a,integrity:i,fetchPriority:n,nonce:typeof e.nonce=="string"?e.nonce:void 0})}};Ct.preinitModule=function(t,e){if(typeof t=="string")if(typeof e=="object"&&e!==null){if(e.as==null||e.as==="script"){var l=_n(e.as,e.crossOrigin);zt.d.M(t,{crossOrigin:l,integrity:typeof e.integrity=="string"?e.integrity:void 0,nonce:typeof e.nonce=="string"?e.nonce:void 0})}}else e==null&&zt.d.M(t)};Ct.preload=function(t,e){if(typeof t=="string"&&typeof e=="object"&&e!==null&&typeof e.as=="string"){var l=e.as,a=_n(l,e.crossOrigin);zt.d.L(t,l,{crossOrigin:a,integrity:typeof e.integrity=="string"?e.integrity:void 0,nonce:typeof e.nonce=="string"?e.nonce:void 0,type:typeof e.type=="string"?e.type:void 0,fetchPriority:typeof e.fetchPriority=="string"?e.fetchPriority:void 0,referrerPolicy:typeof e.referrerPolicy=="string"?e.referrerPolicy:void 0,imageSrcSet:typeof e.imageSrcSet=="string"?e.imageSrcSet:void 0,imageSizes:typeof e.imageSizes=="string"?e.imageSizes:void 0,media:typeof e.media=="string"?e.media:void 0})}};Ct.preloadModule=function(t,e){if(typeof t=="string")if(e){var l=_n(e.as,e.crossOrigin);zt.d.m(t,{as:typeof e.as=="string"&&e.as!=="script"?e.as:void 0,crossOrigin:l,integrity:typeof e.integrity=="string"?e.integrity:void 0})}else zt.d.m(t)};Ct.requestFormReset=function(t){zt.d.r(t)};Ct.unstable_batchedUpdates=function(t,e){return t(e)};Ct.useFormState=function(t,e,l){return mi.H.useFormState(t,e,l)};Ct.useFormStatus=function(){return mi.H.useHostTransitionStatus()};Ct.version="19.2.7"});var vf=me((wg,pf)=>{"use strict";function yf(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(yf)}catch(t){console.error(t)}}yf(),pf.exports=hf()});var _y=me(ts=>{"use strict";var ht=Io(),Qd=Yl(),g0=vf();function g(t){var e="https://react.dev/errors/"+t;if(1<arguments.length){e+="?args[]="+encodeURIComponent(arguments[1]);for(var l=2;l<arguments.length;l++)e+="&args[]="+encodeURIComponent(arguments[l])}return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function Zd(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function Ii(t){var e=t,l=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,(e.flags&4098)!==0&&(l=e.return),t=e.return;while(t)}return e.tag===3?l:null}function Vd(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function Kd(t){if(t.tag===31){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function gf(t){if(Ii(t)!==t)throw Error(g(188))}function b0(t){var e=t.alternate;if(!e){if(e=Ii(t),e===null)throw Error(g(188));return e!==t?null:t}for(var l=t,a=e;;){var i=l.return;if(i===null)break;var n=i.alternate;if(n===null){if(a=i.return,a!==null){l=a;continue}break}if(i.child===n.child){for(n=i.child;n;){if(n===l)return gf(i),t;if(n===a)return gf(i),e;n=n.sibling}throw Error(g(188))}if(l.return!==a.return)l=i,a=n;else{for(var u=!1,s=i.child;s;){if(s===l){u=!0,l=i,a=n;break}if(s===a){u=!0,a=i,l=n;break}s=s.sibling}if(!u){for(s=n.child;s;){if(s===l){u=!0,l=n,a=i;break}if(s===a){u=!0,a=n,l=i;break}s=s.sibling}if(!u)throw Error(g(189))}}if(l.alternate!==a)throw Error(g(190))}if(l.tag!==3)throw Error(g(188));return l.stateNode.current===l?t:e}function Jd(t){var e=t.tag;if(e===5||e===26||e===27||e===6)return t;for(t=t.child;t!==null;){if(e=Jd(t),e!==null)return e;t=t.sibling}return null}var I=Object.assign,M0=Symbol.for("react.element"),Rn=Symbol.for("react.transitional.element"),Si=Symbol.for("react.portal"),ga=Symbol.for("react.fragment"),Fd=Symbol.for("react.strict_mode"),dr=Symbol.for("react.profiler"),kd=Symbol.for("react.consumer"),Be=Symbol.for("react.context"),sc=Symbol.for("react.forward_ref"),mr=Symbol.for("react.suspense"),hr=Symbol.for("react.suspense_list"),rc=Symbol.for("react.memo"),il=Symbol.for("react.lazy"),yr=Symbol.for("react.activity"),S0=Symbol.for("react.memo_cache_sentinel"),bf=Symbol.iterator;function hi(t){return t===null||typeof t!="object"?null:(t=bf&&t[bf]||t["@@iterator"],typeof t=="function"?t:null)}var E0=Symbol.for("react.client.reference");function pr(t){if(t==null)return null;if(typeof t=="function")return t.$$typeof===E0?null:t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case ga:return"Fragment";case dr:return"Profiler";case Fd:return"StrictMode";case mr:return"Suspense";case hr:return"SuspenseList";case yr:return"Activity"}if(typeof t=="object")switch(t.$$typeof){case Si:return"Portal";case Be:return t.displayName||"Context";case kd:return(t._context.displayName||"Context")+".Consumer";case sc:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case rc:return e=t.displayName||null,e!==null?e:pr(t.type)||"Memo";case il:e=t._payload,t=t._init;try{return pr(t(e))}catch{}}return null}var Ei=Array.isArray,z=Qd.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,X=g0.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,Ql={pending:!1,data:null,method:null,action:null},vr=[],ba=-1;function be(t){return{current:t}}function vt(t){0>ba||(t.current=vr[ba],vr[ba]=null,ba--)}function k(t,e){ba++,vr[ba]=t.current,t.current=e}var ge=be(null),Li=be(null),yl=be(null),cu=be(null);function ou(t,e){switch(k(yl,e),k(Li,t),k(ge,null),e.nodeType){case 9:case 11:t=(t=e.documentElement)&&(t=t.namespaceURI)?Ad(t):0;break;default:if(t=e.tagName,e=e.namespaceURI)e=Ad(e),t=yy(e,t);else switch(t){case"svg":t=1;break;case"math":t=2;break;default:t=0}}vt(ge),k(ge,t)}function Ya(){vt(ge),vt(Li),vt(yl)}function gr(t){t.memoizedState!==null&&k(cu,t);var e=ge.current,l=yy(e,t.type);e!==l&&(k(Li,t),k(ge,l))}function fu(t){Li.current===t&&(vt(ge),vt(Li)),cu.current===t&&(vt(cu),Wi._currentValue=Ql)}var Ns,Mf;function Ll(t){if(Ns===void 0)try{throw Error()}catch(l){var e=l.stack.trim().match(/\n( *(at )?)/);Ns=e&&e[1]||"",Mf=-1<l.stack.indexOf(`
    at`)?" (<anonymous>)":-1<l.stack.indexOf("@")?"@unknown:0:0":""}return`
`+Ns+t+Mf}var Hs=!1;function Us(t,e){if(!t||Hs)return"";Hs=!0;var l=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var a={DetermineComponentFrameRoot:function(){try{if(e){var p=function(){throw Error()};if(Object.defineProperty(p.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(p,[])}catch(y){var d=y}Reflect.construct(t,[],p)}else{try{p.call()}catch(y){d=y}t.call(p.prototype)}}else{try{throw Error()}catch(y){d=y}(p=t())&&typeof p.catch=="function"&&p.catch(function(){})}}catch(y){if(y&&d&&typeof y.stack=="string")return[y.stack,d.stack]}return[null,null]}};a.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var i=Object.getOwnPropertyDescriptor(a.DetermineComponentFrameRoot,"name");i&&i.configurable&&Object.defineProperty(a.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var n=a.DetermineComponentFrameRoot(),u=n[0],s=n[1];if(u&&s){var r=u.split(`
`),o=s.split(`
`);for(i=a=0;a<r.length&&!r[a].includes("DetermineComponentFrameRoot");)a++;for(;i<o.length&&!o[i].includes("DetermineComponentFrameRoot");)i++;if(a===r.length||i===o.length)for(a=r.length-1,i=o.length-1;1<=a&&0<=i&&r[a]!==o[i];)i--;for(;1<=a&&0<=i;a--,i--)if(r[a]!==o[i]){if(a!==1||i!==1)do if(a--,i--,0>i||r[a]!==o[i]){var h=`
`+r[a].replace(" at new "," at ");return t.displayName&&h.includes("<anonymous>")&&(h=h.replace("<anonymous>",t.displayName)),h}while(1<=a&&0<=i);break}}}finally{Hs=!1,Error.prepareStackTrace=l}return(l=t?t.displayName||t.name:"")?Ll(l):""}function x0(t,e){switch(t.tag){case 26:case 27:case 5:return Ll(t.type);case 16:return Ll("Lazy");case 13:return t.child!==e&&e!==null?Ll("Suspense Fallback"):Ll("Suspense");case 19:return Ll("SuspenseList");case 0:case 15:return Us(t.type,!1);case 11:return Us(t.type.render,!1);case 1:return Us(t.type,!0);case 31:return Ll("Activity");default:return""}}function Sf(t){try{var e="",l=null;do e+=x0(t,l),l=t,t=t.return;while(t);return e}catch(a){return`
Error generating stack: `+a.message+`
`+a.stack}}var br=Object.prototype.hasOwnProperty,cc=ht.unstable_scheduleCallback,Bs=ht.unstable_cancelCallback,T0=ht.unstable_shouldYield,G0=ht.unstable_requestPaint,jt=ht.unstable_now,A0=ht.unstable_getCurrentPriorityLevel,Wd=ht.unstable_ImmediatePriority,Pd=ht.unstable_UserBlockingPriority,du=ht.unstable_NormalPriority,z0=ht.unstable_LowPriority,$d=ht.unstable_IdlePriority,C0=ht.log,_0=ht.unstable_setDisableYieldValue,tn=null,Qt=null;function ol(t){if(typeof C0=="function"&&_0(t),Qt&&typeof Qt.setStrictMode=="function")try{Qt.setStrictMode(tn,t)}catch{}}var Zt=Math.clz32?Math.clz32:O0,R0=Math.log,D0=Math.LN2;function O0(t){return t>>>=0,t===0?32:31-(R0(t)/D0|0)|0}var Dn=256,On=262144,Nn=4194304;function wl(t){var e=t&42;if(e!==0)return e;switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return t&261888;case 262144:case 524288:case 1048576:case 2097152:return t&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return t&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return t}}function qu(t,e,l){var a=t.pendingLanes;if(a===0)return 0;var i=0,n=t.suspendedLanes,u=t.pingedLanes;t=t.warmLanes;var s=a&134217727;return s!==0?(a=s&~n,a!==0?i=wl(a):(u&=s,u!==0?i=wl(u):l||(l=s&~t,l!==0&&(i=wl(l))))):(s=a&~n,s!==0?i=wl(s):u!==0?i=wl(u):l||(l=a&~t,l!==0&&(i=wl(l)))),i===0?0:e!==0&&e!==i&&(e&n)===0&&(n=i&-i,l=e&-e,n>=l||n===32&&(l&4194048)!==0)?e:i}function en(t,e){return(t.pendingLanes&~(t.suspendedLanes&~t.pingedLanes)&e)===0}function N0(t,e){switch(t){case 1:case 2:case 4:case 8:case 64:return e+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Id(){var t=Nn;return Nn<<=1,(Nn&62914560)===0&&(Nn=4194304),t}function Ys(t){for(var e=[],l=0;31>l;l++)e.push(t);return e}function ln(t,e){t.pendingLanes|=e,e!==268435456&&(t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0)}function H0(t,e,l,a,i,n){var u=t.pendingLanes;t.pendingLanes=l,t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0,t.expiredLanes&=l,t.entangledLanes&=l,t.errorRecoveryDisabledLanes&=l,t.shellSuspendCounter=0;var s=t.entanglements,r=t.expirationTimes,o=t.hiddenUpdates;for(l=u&~l;0<l;){var h=31-Zt(l),p=1<<h;s[h]=0,r[h]=-1;var d=o[h];if(d!==null)for(o[h]=null,h=0;h<d.length;h++){var y=d[h];y!==null&&(y.lane&=-536870913)}l&=~p}a!==0&&tm(t,a,0),n!==0&&i===0&&t.tag!==0&&(t.suspendedLanes|=n&~(u&~e))}function tm(t,e,l){t.pendingLanes|=e,t.suspendedLanes&=~e;var a=31-Zt(e);t.entangledLanes|=e,t.entanglements[a]=t.entanglements[a]|1073741824|l&261930}function em(t,e){var l=t.entangledLanes|=e;for(t=t.entanglements;l;){var a=31-Zt(l),i=1<<a;i&e|t[a]&e&&(t[a]|=e),l&=~i}}function lm(t,e){var l=e&-e;return l=(l&42)!==0?1:oc(l),(l&(t.suspendedLanes|e))!==0?0:l}function oc(t){switch(t){case 2:t=1;break;case 8:t=4;break;case 32:t=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:t=128;break;case 268435456:t=134217728;break;default:t=0}return t}function fc(t){return t&=-t,2<t?8<t?(t&134217727)!==0?32:268435456:8:2}function am(){var t=X.p;return t!==0?t:(t=window.event,t===void 0?32:Ay(t.type))}function Ef(t,e){var l=X.p;try{return X.p=t,e()}finally{X.p=l}}var Cl=Math.random().toString(36).slice(2),Mt="__reactFiber$"+Cl,Ut="__reactProps$"+Cl,Fa="__reactContainer$"+Cl,Mr="__reactEvents$"+Cl,U0="__reactListeners$"+Cl,B0="__reactHandles$"+Cl,xf="__reactResources$"+Cl,an="__reactMarker$"+Cl;function dc(t){delete t[Mt],delete t[Ut],delete t[Mr],delete t[U0],delete t[B0]}function Ma(t){var e=t[Mt];if(e)return e;for(var l=t.parentNode;l;){if(e=l[Fa]||l[Mt]){if(l=e.alternate,e.child!==null||l!==null&&l.child!==null)for(t=Dd(t);t!==null;){if(l=t[Mt])return l;t=Dd(t)}return e}t=l,l=t.parentNode}return null}function ka(t){if(t=t[Mt]||t[Fa]){var e=t.tag;if(e===5||e===6||e===13||e===31||e===26||e===27||e===3)return t}return null}function xi(t){var e=t.tag;if(e===5||e===26||e===27||e===6)return t.stateNode;throw Error(g(33))}function Ra(t){var e=t[xf];return e||(e=t[xf]={hoistableStyles:new Map,hoistableScripts:new Map}),e}function pt(t){t[an]=!0}var im=new Set,nm={};function Il(t,e){qa(t,e),qa(t+"Capture",e)}function qa(t,e){for(nm[t]=e,t=0;t<e.length;t++)im.add(e[t])}var Y0=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),Tf={},Gf={};function q0(t){return br.call(Gf,t)?!0:br.call(Tf,t)?!1:Y0.test(t)?Gf[t]=!0:(Tf[t]=!0,!1)}function Fn(t,e,l){if(q0(e))if(l===null)t.removeAttribute(e);else{switch(typeof l){case"undefined":case"function":case"symbol":t.removeAttribute(e);return;case"boolean":var a=e.toLowerCase().slice(0,5);if(a!=="data-"&&a!=="aria-"){t.removeAttribute(e);return}}t.setAttribute(e,""+l)}}function Hn(t,e,l){if(l===null)t.removeAttribute(e);else{switch(typeof l){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(e);return}t.setAttribute(e,""+l)}}function _e(t,e,l,a){if(a===null)t.removeAttribute(l);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(l);return}t.setAttributeNS(e,l,""+a)}}function te(t){switch(typeof t){case"bigint":case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function um(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function L0(t,e,l){var a=Object.getOwnPropertyDescriptor(t.constructor.prototype,e);if(!t.hasOwnProperty(e)&&typeof a<"u"&&typeof a.get=="function"&&typeof a.set=="function"){var i=a.get,n=a.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return i.call(this)},set:function(u){l=""+u,n.call(this,u)}}),Object.defineProperty(t,e,{enumerable:a.enumerable}),{getValue:function(){return l},setValue:function(u){l=""+u},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function Sr(t){if(!t._valueTracker){var e=um(t)?"checked":"value";t._valueTracker=L0(t,e,""+t[e])}}function sm(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var l=e.getValue(),a="";return t&&(a=um(t)?t.checked?"true":"false":t.value),t=a,t!==l?(e.setValue(t),!0):!1}function mu(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}var w0=/[\n"\\]/g;function ae(t){return t.replace(w0,function(e){return"\\"+e.charCodeAt(0).toString(16)+" "})}function Er(t,e,l,a,i,n,u,s){t.name="",u!=null&&typeof u!="function"&&typeof u!="symbol"&&typeof u!="boolean"?t.type=u:t.removeAttribute("type"),e!=null?u==="number"?(e===0&&t.value===""||t.value!=e)&&(t.value=""+te(e)):t.value!==""+te(e)&&(t.value=""+te(e)):u!=="submit"&&u!=="reset"||t.removeAttribute("value"),e!=null?xr(t,u,te(e)):l!=null?xr(t,u,te(l)):a!=null&&t.removeAttribute("value"),i==null&&n!=null&&(t.defaultChecked=!!n),i!=null&&(t.checked=i&&typeof i!="function"&&typeof i!="symbol"),s!=null&&typeof s!="function"&&typeof s!="symbol"&&typeof s!="boolean"?t.name=""+te(s):t.removeAttribute("name")}function rm(t,e,l,a,i,n,u,s){if(n!=null&&typeof n!="function"&&typeof n!="symbol"&&typeof n!="boolean"&&(t.type=n),e!=null||l!=null){if(!(n!=="submit"&&n!=="reset"||e!=null)){Sr(t);return}l=l!=null?""+te(l):"",e=e!=null?""+te(e):l,s||e===t.value||(t.value=e),t.defaultValue=e}a=a??i,a=typeof a!="function"&&typeof a!="symbol"&&!!a,t.checked=s?t.checked:!!a,t.defaultChecked=!!a,u!=null&&typeof u!="function"&&typeof u!="symbol"&&typeof u!="boolean"&&(t.name=u),Sr(t)}function xr(t,e,l){e==="number"&&mu(t.ownerDocument)===t||t.defaultValue===""+l||(t.defaultValue=""+l)}function Da(t,e,l,a){if(t=t.options,e){e={};for(var i=0;i<l.length;i++)e["$"+l[i]]=!0;for(l=0;l<t.length;l++)i=e.hasOwnProperty("$"+t[l].value),t[l].selected!==i&&(t[l].selected=i),i&&a&&(t[l].defaultSelected=!0)}else{for(l=""+te(l),e=null,i=0;i<t.length;i++){if(t[i].value===l){t[i].selected=!0,a&&(t[i].defaultSelected=!0);return}e!==null||t[i].disabled||(e=t[i])}e!==null&&(e.selected=!0)}}function cm(t,e,l){if(e!=null&&(e=""+te(e),e!==t.value&&(t.value=e),l==null)){t.defaultValue!==e&&(t.defaultValue=e);return}t.defaultValue=l!=null?""+te(l):""}function om(t,e,l,a){if(e==null){if(a!=null){if(l!=null)throw Error(g(92));if(Ei(a)){if(1<a.length)throw Error(g(93));a=a[0]}l=a}l==null&&(l=""),e=l}l=te(e),t.defaultValue=l,a=t.textContent,a===l&&a!==""&&a!==null&&(t.value=a),Sr(t)}function La(t,e){if(e){var l=t.firstChild;if(l&&l===t.lastChild&&l.nodeType===3){l.nodeValue=e;return}}t.textContent=e}var X0=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function Af(t,e,l){var a=e.indexOf("--")===0;l==null||typeof l=="boolean"||l===""?a?t.setProperty(e,""):e==="float"?t.cssFloat="":t[e]="":a?t.setProperty(e,l):typeof l!="number"||l===0||X0.has(e)?e==="float"?t.cssFloat=l:t[e]=(""+l).trim():t[e]=l+"px"}function fm(t,e,l){if(e!=null&&typeof e!="object")throw Error(g(62));if(t=t.style,l!=null){for(var a in l)!l.hasOwnProperty(a)||e!=null&&e.hasOwnProperty(a)||(a.indexOf("--")===0?t.setProperty(a,""):a==="float"?t.cssFloat="":t[a]="");for(var i in e)a=e[i],e.hasOwnProperty(i)&&l[i]!==a&&Af(t,i,a)}else for(var n in e)e.hasOwnProperty(n)&&Af(t,n,e[n])}function mc(t){if(t.indexOf("-")===-1)return!1;switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var j0=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),Q0=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function kn(t){return Q0.test(""+t)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":t}function Ye(){}var Tr=null;function hc(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var Sa=null,Oa=null;function zf(t){var e=ka(t);if(e&&(t=e.stateNode)){var l=t[Ut]||null;t:switch(t=e.stateNode,e.type){case"input":if(Er(t,l.value,l.defaultValue,l.defaultValue,l.checked,l.defaultChecked,l.type,l.name),e=l.name,l.type==="radio"&&e!=null){for(l=t;l.parentNode;)l=l.parentNode;for(l=l.querySelectorAll('input[name="'+ae(""+e)+'"][type="radio"]'),e=0;e<l.length;e++){var a=l[e];if(a!==t&&a.form===t.form){var i=a[Ut]||null;if(!i)throw Error(g(90));Er(a,i.value,i.defaultValue,i.defaultValue,i.checked,i.defaultChecked,i.type,i.name)}}for(e=0;e<l.length;e++)a=l[e],a.form===t.form&&sm(a)}break t;case"textarea":cm(t,l.value,l.defaultValue);break t;case"select":e=l.value,e!=null&&Da(t,!!l.multiple,e,!1)}}}var qs=!1;function dm(t,e,l){if(qs)return t(e,l);qs=!0;try{var a=t(e);return a}finally{if(qs=!1,(Sa!==null||Oa!==null)&&(Wu(),Sa&&(e=Sa,t=Oa,Oa=Sa=null,zf(e),t)))for(e=0;e<t.length;e++)zf(t[e])}}function wi(t,e){var l=t.stateNode;if(l===null)return null;var a=l[Ut]||null;if(a===null)return null;l=a[e];t:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(a=!a.disabled)||(t=t.type,a=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!a;break t;default:t=!1}if(t)return null;if(l&&typeof l!="function")throw Error(g(231,e,typeof l));return l}var je=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Gr=!1;if(je)try{ma={},Object.defineProperty(ma,"passive",{get:function(){Gr=!0}}),window.addEventListener("test",ma,ma),window.removeEventListener("test",ma,ma)}catch{Gr=!1}var ma,fl=null,yc=null,Wn=null;function mm(){if(Wn)return Wn;var t,e=yc,l=e.length,a,i="value"in fl?fl.value:fl.textContent,n=i.length;for(t=0;t<l&&e[t]===i[t];t++);var u=l-t;for(a=1;a<=u&&e[l-a]===i[n-a];a++);return Wn=i.slice(t,1<a?1-a:void 0)}function Pn(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function Un(){return!0}function Cf(){return!1}function Bt(t){function e(l,a,i,n,u){this._reactName=l,this._targetInst=i,this.type=a,this.nativeEvent=n,this.target=u,this.currentTarget=null;for(var s in t)t.hasOwnProperty(s)&&(l=t[s],this[s]=l?l(n):n[s]);return this.isDefaultPrevented=(n.defaultPrevented!=null?n.defaultPrevented:n.returnValue===!1)?Un:Cf,this.isPropagationStopped=Cf,this}return I(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var l=this.nativeEvent;l&&(l.preventDefault?l.preventDefault():typeof l.returnValue!="unknown"&&(l.returnValue=!1),this.isDefaultPrevented=Un)},stopPropagation:function(){var l=this.nativeEvent;l&&(l.stopPropagation?l.stopPropagation():typeof l.cancelBubble!="unknown"&&(l.cancelBubble=!0),this.isPropagationStopped=Un)},persist:function(){},isPersistent:Un}),e}var ta={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Lu=Bt(ta),nn=I({},ta,{view:0,detail:0}),Z0=Bt(nn),Ls,ws,yi,wu=I({},nn,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:pc,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==yi&&(yi&&t.type==="mousemove"?(Ls=t.screenX-yi.screenX,ws=t.screenY-yi.screenY):ws=Ls=0,yi=t),Ls)},movementY:function(t){return"movementY"in t?t.movementY:ws}}),_f=Bt(wu),V0=I({},wu,{dataTransfer:0}),K0=Bt(V0),J0=I({},nn,{relatedTarget:0}),Xs=Bt(J0),F0=I({},ta,{animationName:0,elapsedTime:0,pseudoElement:0}),k0=Bt(F0),W0=I({},ta,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),P0=Bt(W0),$0=I({},ta,{data:0}),Rf=Bt($0),I0={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},tv={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},ev={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function lv(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=ev[t])?!!e[t]:!1}function pc(){return lv}var av=I({},nn,{key:function(t){if(t.key){var e=I0[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=Pn(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?tv[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:pc,charCode:function(t){return t.type==="keypress"?Pn(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?Pn(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),iv=Bt(av),nv=I({},wu,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Df=Bt(nv),uv=I({},nn,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:pc}),sv=Bt(uv),rv=I({},ta,{propertyName:0,elapsedTime:0,pseudoElement:0}),cv=Bt(rv),ov=I({},wu,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),fv=Bt(ov),dv=I({},ta,{newState:0,oldState:0}),mv=Bt(dv),hv=[9,13,27,32],vc=je&&"CompositionEvent"in window,Ai=null;je&&"documentMode"in document&&(Ai=document.documentMode);var yv=je&&"TextEvent"in window&&!Ai,hm=je&&(!vc||Ai&&8<Ai&&11>=Ai),Of=" ",Nf=!1;function ym(t,e){switch(t){case"keyup":return hv.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function pm(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var Ea=!1;function pv(t,e){switch(t){case"compositionend":return pm(e);case"keypress":return e.which!==32?null:(Nf=!0,Of);case"textInput":return t=e.data,t===Of&&Nf?null:t;default:return null}}function vv(t,e){if(Ea)return t==="compositionend"||!vc&&ym(t,e)?(t=mm(),Wn=yc=fl=null,Ea=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return hm&&e.locale!=="ko"?null:e.data;default:return null}}var gv={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Hf(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!gv[t.type]:e==="textarea"}function vm(t,e,l,a){Sa?Oa?Oa.push(a):Oa=[a]:Sa=a,e=Du(e,"onChange"),0<e.length&&(l=new Lu("onChange","change",null,l,a),t.push({event:l,listeners:e}))}var zi=null,Xi=null;function bv(t){dy(t,0)}function Xu(t){var e=xi(t);if(sm(e))return t}function Uf(t,e){if(t==="change")return e}var gm=!1;je&&(je?(Yn="oninput"in document,Yn||(js=document.createElement("div"),js.setAttribute("oninput","return;"),Yn=typeof js.oninput=="function"),Bn=Yn):Bn=!1,gm=Bn&&(!document.documentMode||9<document.documentMode));var Bn,Yn,js;function Bf(){zi&&(zi.detachEvent("onpropertychange",bm),Xi=zi=null)}function bm(t){if(t.propertyName==="value"&&Xu(Xi)){var e=[];vm(e,Xi,t,hc(t)),dm(bv,e)}}function Mv(t,e,l){t==="focusin"?(Bf(),zi=e,Xi=l,zi.attachEvent("onpropertychange",bm)):t==="focusout"&&Bf()}function Sv(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return Xu(Xi)}function Ev(t,e){if(t==="click")return Xu(e)}function xv(t,e){if(t==="input"||t==="change")return Xu(e)}function Tv(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var Kt=typeof Object.is=="function"?Object.is:Tv;function ji(t,e){if(Kt(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var l=Object.keys(t),a=Object.keys(e);if(l.length!==a.length)return!1;for(a=0;a<l.length;a++){var i=l[a];if(!br.call(e,i)||!Kt(t[i],e[i]))return!1}return!0}function Yf(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function qf(t,e){var l=Yf(t);t=0;for(var a;l;){if(l.nodeType===3){if(a=t+l.textContent.length,t<=e&&a>=e)return{node:l,offset:e-t};t=a}t:{for(;l;){if(l.nextSibling){l=l.nextSibling;break t}l=l.parentNode}l=void 0}l=Yf(l)}}function Mm(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?Mm(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function Sm(t){t=t!=null&&t.ownerDocument!=null&&t.ownerDocument.defaultView!=null?t.ownerDocument.defaultView:window;for(var e=mu(t.document);e instanceof t.HTMLIFrameElement;){try{var l=typeof e.contentWindow.location.href=="string"}catch{l=!1}if(l)t=e.contentWindow;else break;e=mu(t.document)}return e}function gc(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}var Gv=je&&"documentMode"in document&&11>=document.documentMode,xa=null,Ar=null,Ci=null,zr=!1;function Lf(t,e,l){var a=l.window===l?l.document:l.nodeType===9?l:l.ownerDocument;zr||xa==null||xa!==mu(a)||(a=xa,"selectionStart"in a&&gc(a)?a={start:a.selectionStart,end:a.selectionEnd}:(a=(a.ownerDocument&&a.ownerDocument.defaultView||window).getSelection(),a={anchorNode:a.anchorNode,anchorOffset:a.anchorOffset,focusNode:a.focusNode,focusOffset:a.focusOffset}),Ci&&ji(Ci,a)||(Ci=a,a=Du(Ar,"onSelect"),0<a.length&&(e=new Lu("onSelect","select",null,e,l),t.push({event:e,listeners:a}),e.target=xa)))}function ql(t,e){var l={};return l[t.toLowerCase()]=e.toLowerCase(),l["Webkit"+t]="webkit"+e,l["Moz"+t]="moz"+e,l}var Ta={animationend:ql("Animation","AnimationEnd"),animationiteration:ql("Animation","AnimationIteration"),animationstart:ql("Animation","AnimationStart"),transitionrun:ql("Transition","TransitionRun"),transitionstart:ql("Transition","TransitionStart"),transitioncancel:ql("Transition","TransitionCancel"),transitionend:ql("Transition","TransitionEnd")},Qs={},Em={};je&&(Em=document.createElement("div").style,"AnimationEvent"in window||(delete Ta.animationend.animation,delete Ta.animationiteration.animation,delete Ta.animationstart.animation),"TransitionEvent"in window||delete Ta.transitionend.transition);function ea(t){if(Qs[t])return Qs[t];if(!Ta[t])return t;var e=Ta[t],l;for(l in e)if(e.hasOwnProperty(l)&&l in Em)return Qs[t]=e[l];return t}var xm=ea("animationend"),Tm=ea("animationiteration"),Gm=ea("animationstart"),Av=ea("transitionrun"),zv=ea("transitionstart"),Cv=ea("transitioncancel"),Am=ea("transitionend"),zm=new Map,Cr="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");Cr.push("scrollEnd");function de(t,e){zm.set(t,e),Il(e,[t])}var hu=typeof reportError=="function"?reportError:function(t){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var e=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof t=="object"&&t!==null&&typeof t.message=="string"?String(t.message):String(t),error:t});if(!window.dispatchEvent(e))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",t);return}console.error(t)},It=[],Ga=0,bc=0;function ju(){for(var t=Ga,e=bc=Ga=0;e<t;){var l=It[e];It[e++]=null;var a=It[e];It[e++]=null;var i=It[e];It[e++]=null;var n=It[e];if(It[e++]=null,a!==null&&i!==null){var u=a.pending;u===null?i.next=i:(i.next=u.next,u.next=i),a.pending=i}n!==0&&Cm(l,i,n)}}function Qu(t,e,l,a){It[Ga++]=t,It[Ga++]=e,It[Ga++]=l,It[Ga++]=a,bc|=a,t.lanes|=a,t=t.alternate,t!==null&&(t.lanes|=a)}function Mc(t,e,l,a){return Qu(t,e,l,a),yu(t)}function la(t,e){return Qu(t,null,null,e),yu(t)}function Cm(t,e,l){t.lanes|=l;var a=t.alternate;a!==null&&(a.lanes|=l);for(var i=!1,n=t.return;n!==null;)n.childLanes|=l,a=n.alternate,a!==null&&(a.childLanes|=l),n.tag===22&&(t=n.stateNode,t===null||t._visibility&1||(i=!0)),t=n,n=n.return;return t.tag===3?(n=t.stateNode,i&&e!==null&&(i=31-Zt(l),t=n.hiddenUpdates,a=t[i],a===null?t[i]=[e]:a.push(e),e.lane=l|536870912),n):null}function yu(t){if(50<Yi)throw Yi=0,kr=null,Error(g(185));for(var e=t.return;e!==null;)t=e,e=t.return;return t.tag===3?t.stateNode:null}var Aa={};function _v(t,e,l,a){this.tag=t,this.key=l,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=a,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function wt(t,e,l,a){return new _v(t,e,l,a)}function Sc(t){return t=t.prototype,!(!t||!t.isReactComponent)}function Le(t,e){var l=t.alternate;return l===null?(l=wt(t.tag,e,t.key,t.mode),l.elementType=t.elementType,l.type=t.type,l.stateNode=t.stateNode,l.alternate=t,t.alternate=l):(l.pendingProps=e,l.type=t.type,l.flags=0,l.subtreeFlags=0,l.deletions=null),l.flags=t.flags&65011712,l.childLanes=t.childLanes,l.lanes=t.lanes,l.child=t.child,l.memoizedProps=t.memoizedProps,l.memoizedState=t.memoizedState,l.updateQueue=t.updateQueue,e=t.dependencies,l.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},l.sibling=t.sibling,l.index=t.index,l.ref=t.ref,l.refCleanup=t.refCleanup,l}function _m(t,e){t.flags&=65011714;var l=t.alternate;return l===null?(t.childLanes=0,t.lanes=e,t.child=null,t.subtreeFlags=0,t.memoizedProps=null,t.memoizedState=null,t.updateQueue=null,t.dependencies=null,t.stateNode=null):(t.childLanes=l.childLanes,t.lanes=l.lanes,t.child=l.child,t.subtreeFlags=0,t.deletions=null,t.memoizedProps=l.memoizedProps,t.memoizedState=l.memoizedState,t.updateQueue=l.updateQueue,t.type=l.type,e=l.dependencies,t.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),t}function $n(t,e,l,a,i,n){var u=0;if(a=t,typeof t=="function")Sc(t)&&(u=1);else if(typeof t=="string")u=O1(t,l,ge.current)?26:t==="html"||t==="head"||t==="body"?27:5;else t:switch(t){case yr:return t=wt(31,l,e,i),t.elementType=yr,t.lanes=n,t;case ga:return Zl(l.children,i,n,e);case Fd:u=8,i|=24;break;case dr:return t=wt(12,l,e,i|2),t.elementType=dr,t.lanes=n,t;case mr:return t=wt(13,l,e,i),t.elementType=mr,t.lanes=n,t;case hr:return t=wt(19,l,e,i),t.elementType=hr,t.lanes=n,t;default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case Be:u=10;break t;case kd:u=9;break t;case sc:u=11;break t;case rc:u=14;break t;case il:u=16,a=null;break t}u=29,l=Error(g(130,t===null?"null":typeof t,"")),a=null}return e=wt(u,l,e,i),e.elementType=t,e.type=a,e.lanes=n,e}function Zl(t,e,l,a){return t=wt(7,t,a,e),t.lanes=l,t}function Zs(t,e,l){return t=wt(6,t,null,e),t.lanes=l,t}function Rm(t){var e=wt(18,null,null,0);return e.stateNode=t,e}function Vs(t,e,l){return e=wt(4,t.children!==null?t.children:[],t.key,e),e.lanes=l,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}var wf=new WeakMap;function ie(t,e){if(typeof t=="object"&&t!==null){var l=wf.get(t);return l!==void 0?l:(e={value:t,source:e,stack:Sf(e)},wf.set(t,e),e)}return{value:t,source:e,stack:Sf(e)}}var za=[],Ca=0,pu=null,Qi=0,ee=[],le=0,Tl=null,ye=1,pe="";function He(t,e){za[Ca++]=Qi,za[Ca++]=pu,pu=t,Qi=e}function Dm(t,e,l){ee[le++]=ye,ee[le++]=pe,ee[le++]=Tl,Tl=t;var a=ye;t=pe;var i=32-Zt(a)-1;a&=~(1<<i),l+=1;var n=32-Zt(e)+i;if(30<n){var u=i-i%5;n=(a&(1<<u)-1).toString(32),a>>=u,i-=u,ye=1<<32-Zt(e)+i|l<<i|a,pe=n+t}else ye=1<<n|l<<i|a,pe=t}function Ec(t){t.return!==null&&(He(t,1),Dm(t,1,0))}function xc(t){for(;t===pu;)pu=za[--Ca],za[Ca]=null,Qi=za[--Ca],za[Ca]=null;for(;t===Tl;)Tl=ee[--le],ee[le]=null,pe=ee[--le],ee[le]=null,ye=ee[--le],ee[le]=null}function Om(t,e){ee[le++]=ye,ee[le++]=pe,ee[le++]=Tl,ye=e.id,pe=e.overflow,Tl=t}var St=null,$=null,L=!1,pl=null,ne=!1,_r=Error(g(519));function Gl(t){var e=Error(g(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw Zi(ie(e,t)),_r}function Xf(t){var e=t.stateNode,l=t.type,a=t.memoizedProps;switch(e[Mt]=t,e[Ut]=a,l){case"dialog":B("cancel",e),B("close",e);break;case"iframe":case"object":case"embed":B("load",e);break;case"video":case"audio":for(l=0;l<Fi.length;l++)B(Fi[l],e);break;case"source":B("error",e);break;case"img":case"image":case"link":B("error",e),B("load",e);break;case"details":B("toggle",e);break;case"input":B("invalid",e),rm(e,a.value,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name,!0);break;case"select":B("invalid",e);break;case"textarea":B("invalid",e),om(e,a.value,a.defaultValue,a.children)}l=a.children,typeof l!="string"&&typeof l!="number"&&typeof l!="bigint"||e.textContent===""+l||a.suppressHydrationWarning===!0||hy(e.textContent,l)?(a.popover!=null&&(B("beforetoggle",e),B("toggle",e)),a.onScroll!=null&&B("scroll",e),a.onScrollEnd!=null&&B("scrollend",e),a.onClick!=null&&(e.onclick=Ye),e=!0):e=!1,e||Gl(t,!0)}function jf(t){for(St=t.return;St;)switch(St.tag){case 5:case 31:case 13:ne=!1;return;case 27:case 3:ne=!0;return;default:St=St.return}}function ha(t){if(t!==St)return!1;if(!L)return jf(t),L=!0,!1;var e=t.tag,l;if((l=e!==3&&e!==27)&&((l=e===5)&&(l=t.type,l=!(l!=="form"&&l!=="button")||tc(t.type,t.memoizedProps)),l=!l),l&&$&&Gl(t),jf(t),e===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(g(317));$=Rd(t)}else if(e===31){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(g(317));$=Rd(t)}else e===27?(e=$,_l(t.type)?(t=ic,ic=null,$=t):$=e):$=St?se(t.stateNode.nextSibling):null;return!0}function Fl(){$=St=null,L=!1}function Ks(){var t=pl;return t!==null&&(Nt===null?Nt=t:Nt.push.apply(Nt,t),pl=null),t}function Zi(t){pl===null?pl=[t]:pl.push(t)}var Rr=be(null),aa=null,qe=null;function ul(t,e,l){k(Rr,e._currentValue),e._currentValue=l}function we(t){t._currentValue=Rr.current,vt(Rr)}function Dr(t,e,l){for(;t!==null;){var a=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,a!==null&&(a.childLanes|=e)):a!==null&&(a.childLanes&e)!==e&&(a.childLanes|=e),t===l)break;t=t.return}}function Or(t,e,l,a){var i=t.child;for(i!==null&&(i.return=t);i!==null;){var n=i.dependencies;if(n!==null){var u=i.child;n=n.firstContext;t:for(;n!==null;){var s=n;n=i;for(var r=0;r<e.length;r++)if(s.context===e[r]){n.lanes|=l,s=n.alternate,s!==null&&(s.lanes|=l),Dr(n.return,l,t),a||(u=null);break t}n=s.next}}else if(i.tag===18){if(u=i.return,u===null)throw Error(g(341));u.lanes|=l,n=u.alternate,n!==null&&(n.lanes|=l),Dr(u,l,t),u=null}else u=i.child;if(u!==null)u.return=i;else for(u=i;u!==null;){if(u===t){u=null;break}if(i=u.sibling,i!==null){i.return=u.return,u=i;break}u=u.return}i=u}}function Wa(t,e,l,a){t=null;for(var i=e,n=!1;i!==null;){if(!n){if((i.flags&524288)!==0)n=!0;else if((i.flags&262144)!==0)break}if(i.tag===10){var u=i.alternate;if(u===null)throw Error(g(387));if(u=u.memoizedProps,u!==null){var s=i.type;Kt(i.pendingProps.value,u.value)||(t!==null?t.push(s):t=[s])}}else if(i===cu.current){if(u=i.alternate,u===null)throw Error(g(387));u.memoizedState.memoizedState!==i.memoizedState.memoizedState&&(t!==null?t.push(Wi):t=[Wi])}i=i.return}t!==null&&Or(e,t,l,a),e.flags|=262144}function vu(t){for(t=t.firstContext;t!==null;){if(!Kt(t.context._currentValue,t.memoizedValue))return!0;t=t.next}return!1}function kl(t){aa=t,qe=null,t=t.dependencies,t!==null&&(t.firstContext=null)}function Et(t){return Nm(aa,t)}function qn(t,e){return aa===null&&kl(t),Nm(t,e)}function Nm(t,e){var l=e._currentValue;if(e={context:e,memoizedValue:l,next:null},qe===null){if(t===null)throw Error(g(308));qe=e,t.dependencies={lanes:0,firstContext:e},t.flags|=524288}else qe=qe.next=e;return l}var Rv=typeof AbortController<"u"?AbortController:function(){var t=[],e=this.signal={aborted:!1,addEventListener:function(l,a){t.push(a)}};this.abort=function(){e.aborted=!0,t.forEach(function(l){return l()})}},Dv=ht.unstable_scheduleCallback,Ov=ht.unstable_NormalPriority,ct={$$typeof:Be,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Tc(){return{controller:new Rv,data:new Map,refCount:0}}function un(t){t.refCount--,t.refCount===0&&Dv(Ov,function(){t.controller.abort()})}var _i=null,Nr=0,wa=0,Na=null;function Nv(t,e){if(_i===null){var l=_i=[];Nr=0,wa=kc(),Na={status:"pending",value:void 0,then:function(a){l.push(a)}}}return Nr++,e.then(Qf,Qf),e}function Qf(){if(--Nr===0&&_i!==null){Na!==null&&(Na.status="fulfilled");var t=_i;_i=null,wa=0,Na=null;for(var e=0;e<t.length;e++)(0,t[e])()}}function Hv(t,e){var l=[],a={status:"pending",value:null,reason:null,then:function(i){l.push(i)}};return t.then(function(){a.status="fulfilled",a.value=e;for(var i=0;i<l.length;i++)(0,l[i])(e)},function(i){for(a.status="rejected",a.reason=i,i=0;i<l.length;i++)(0,l[i])(void 0)}),a}var Zf=z.S;z.S=function(t,e){Jh=jt(),typeof e=="object"&&e!==null&&typeof e.then=="function"&&Nv(t,e),Zf!==null&&Zf(t,e)};var Vl=be(null);function Gc(){var t=Vl.current;return t!==null?t:F.pooledCache}function In(t,e){e===null?k(Vl,Vl.current):k(Vl,e.pool)}function Hm(){var t=Gc();return t===null?null:{parent:ct._currentValue,pool:t}}var Pa=Error(g(460)),Ac=Error(g(474)),Zu=Error(g(542)),gu={then:function(){}};function Vf(t){return t=t.status,t==="fulfilled"||t==="rejected"}function Um(t,e,l){switch(l=t[l],l===void 0?t.push(e):l!==e&&(e.then(Ye,Ye),e=l),e.status){case"fulfilled":return e.value;case"rejected":throw t=e.reason,Jf(t),t;default:if(typeof e.status=="string")e.then(Ye,Ye);else{if(t=F,t!==null&&100<t.shellSuspendCounter)throw Error(g(482));t=e,t.status="pending",t.then(function(a){if(e.status==="pending"){var i=e;i.status="fulfilled",i.value=a}},function(a){if(e.status==="pending"){var i=e;i.status="rejected",i.reason=a}})}switch(e.status){case"fulfilled":return e.value;case"rejected":throw t=e.reason,Jf(t),t}throw Kl=e,Pa}}function Xl(t){try{var e=t._init;return e(t._payload)}catch(l){throw l!==null&&typeof l=="object"&&typeof l.then=="function"?(Kl=l,Pa):l}}var Kl=null;function Kf(){if(Kl===null)throw Error(g(459));var t=Kl;return Kl=null,t}function Jf(t){if(t===Pa||t===Zu)throw Error(g(483))}var Ha=null,Vi=0;function Ln(t){var e=Vi;return Vi+=1,Ha===null&&(Ha=[]),Um(Ha,t,e)}function pi(t,e){e=e.props.ref,t.ref=e!==void 0?e:null}function wn(t,e){throw e.$$typeof===M0?Error(g(525)):(t=Object.prototype.toString.call(e),Error(g(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)))}function Bm(t){function e(f,c){if(t){var m=f.deletions;m===null?(f.deletions=[c],f.flags|=16):m.push(c)}}function l(f,c){if(!t)return null;for(;c!==null;)e(f,c),c=c.sibling;return null}function a(f){for(var c=new Map;f!==null;)f.key!==null?c.set(f.key,f):c.set(f.index,f),f=f.sibling;return c}function i(f,c){return f=Le(f,c),f.index=0,f.sibling=null,f}function n(f,c,m){return f.index=m,t?(m=f.alternate,m!==null?(m=m.index,m<c?(f.flags|=67108866,c):m):(f.flags|=67108866,c)):(f.flags|=1048576,c)}function u(f){return t&&f.alternate===null&&(f.flags|=67108866),f}function s(f,c,m,v){return c===null||c.tag!==6?(c=Zs(m,f.mode,v),c.return=f,c):(c=i(c,m),c.return=f,c)}function r(f,c,m,v){var T=m.type;return T===ga?h(f,c,m.props.children,v,m.key):c!==null&&(c.elementType===T||typeof T=="object"&&T!==null&&T.$$typeof===il&&Xl(T)===c.type)?(c=i(c,m.props),pi(c,m),c.return=f,c):(c=$n(m.type,m.key,m.props,null,f.mode,v),pi(c,m),c.return=f,c)}function o(f,c,m,v){return c===null||c.tag!==4||c.stateNode.containerInfo!==m.containerInfo||c.stateNode.implementation!==m.implementation?(c=Vs(m,f.mode,v),c.return=f,c):(c=i(c,m.children||[]),c.return=f,c)}function h(f,c,m,v,T){return c===null||c.tag!==7?(c=Zl(m,f.mode,v,T),c.return=f,c):(c=i(c,m),c.return=f,c)}function p(f,c,m){if(typeof c=="string"&&c!==""||typeof c=="number"||typeof c=="bigint")return c=Zs(""+c,f.mode,m),c.return=f,c;if(typeof c=="object"&&c!==null){switch(c.$$typeof){case Rn:return m=$n(c.type,c.key,c.props,null,f.mode,m),pi(m,c),m.return=f,m;case Si:return c=Vs(c,f.mode,m),c.return=f,c;case il:return c=Xl(c),p(f,c,m)}if(Ei(c)||hi(c))return c=Zl(c,f.mode,m,null),c.return=f,c;if(typeof c.then=="function")return p(f,Ln(c),m);if(c.$$typeof===Be)return p(f,qn(f,c),m);wn(f,c)}return null}function d(f,c,m,v){var T=c!==null?c.key:null;if(typeof m=="string"&&m!==""||typeof m=="number"||typeof m=="bigint")return T!==null?null:s(f,c,""+m,v);if(typeof m=="object"&&m!==null){switch(m.$$typeof){case Rn:return m.key===T?r(f,c,m,v):null;case Si:return m.key===T?o(f,c,m,v):null;case il:return m=Xl(m),d(f,c,m,v)}if(Ei(m)||hi(m))return T!==null?null:h(f,c,m,v,null);if(typeof m.then=="function")return d(f,c,Ln(m),v);if(m.$$typeof===Be)return d(f,c,qn(f,m),v);wn(f,m)}return null}function y(f,c,m,v,T){if(typeof v=="string"&&v!==""||typeof v=="number"||typeof v=="bigint")return f=f.get(m)||null,s(c,f,""+v,T);if(typeof v=="object"&&v!==null){switch(v.$$typeof){case Rn:return f=f.get(v.key===null?m:v.key)||null,r(c,f,v,T);case Si:return f=f.get(v.key===null?m:v.key)||null,o(c,f,v,T);case il:return v=Xl(v),y(f,c,m,v,T)}if(Ei(v)||hi(v))return f=f.get(m)||null,h(c,f,v,T,null);if(typeof v.then=="function")return y(f,c,m,Ln(v),T);if(v.$$typeof===Be)return y(f,c,m,qn(c,v),T);wn(c,v)}return null}function M(f,c,m,v){for(var T=null,H=null,E=c,R=c=0,b=null;E!==null&&R<m.length;R++){E.index>R?(b=E,E=null):b=E.sibling;var C=d(f,E,m[R],v);if(C===null){E===null&&(E=b);break}t&&E&&C.alternate===null&&e(f,E),c=n(C,c,R),H===null?T=C:H.sibling=C,H=C,E=b}if(R===m.length)return l(f,E),L&&He(f,R),T;if(E===null){for(;R<m.length;R++)E=p(f,m[R],v),E!==null&&(c=n(E,c,R),H===null?T=E:H.sibling=E,H=E);return L&&He(f,R),T}for(E=a(E);R<m.length;R++)b=y(E,f,R,m[R],v),b!==null&&(t&&b.alternate!==null&&E.delete(b.key===null?R:b.key),c=n(b,c,R),H===null?T=b:H.sibling=b,H=b);return t&&E.forEach(function(Tt){return e(f,Tt)}),L&&He(f,R),T}function x(f,c,m,v){if(m==null)throw Error(g(151));for(var T=null,H=null,E=c,R=c=0,b=null,C=m.next();E!==null&&!C.done;R++,C=m.next()){E.index>R?(b=E,E=null):b=E.sibling;var Tt=d(f,E,C.value,v);if(Tt===null){E===null&&(E=b);break}t&&E&&Tt.alternate===null&&e(f,E),c=n(Tt,c,R),H===null?T=Tt:H.sibling=Tt,H=Tt,E=b}if(C.done)return l(f,E),L&&He(f,R),T;if(E===null){for(;!C.done;R++,C=m.next())C=p(f,C.value,v),C!==null&&(c=n(C,c,R),H===null?T=C:H.sibling=C,H=C);return L&&He(f,R),T}for(E=a(E);!C.done;R++,C=m.next())C=y(E,f,R,C.value,v),C!==null&&(t&&C.alternate!==null&&E.delete(C.key===null?R:C.key),c=n(C,c,R),H===null?T=C:H.sibling=C,H=C);return t&&E.forEach(function(Pt){return e(f,Pt)}),L&&He(f,R),T}function U(f,c,m,v){if(typeof m=="object"&&m!==null&&m.type===ga&&m.key===null&&(m=m.props.children),typeof m=="object"&&m!==null){switch(m.$$typeof){case Rn:t:{for(var T=m.key;c!==null;){if(c.key===T){if(T=m.type,T===ga){if(c.tag===7){l(f,c.sibling),v=i(c,m.props.children),v.return=f,f=v;break t}}else if(c.elementType===T||typeof T=="object"&&T!==null&&T.$$typeof===il&&Xl(T)===c.type){l(f,c.sibling),v=i(c,m.props),pi(v,m),v.return=f,f=v;break t}l(f,c);break}else e(f,c);c=c.sibling}m.type===ga?(v=Zl(m.props.children,f.mode,v,m.key),v.return=f,f=v):(v=$n(m.type,m.key,m.props,null,f.mode,v),pi(v,m),v.return=f,f=v)}return u(f);case Si:t:{for(T=m.key;c!==null;){if(c.key===T)if(c.tag===4&&c.stateNode.containerInfo===m.containerInfo&&c.stateNode.implementation===m.implementation){l(f,c.sibling),v=i(c,m.children||[]),v.return=f,f=v;break t}else{l(f,c);break}else e(f,c);c=c.sibling}v=Vs(m,f.mode,v),v.return=f,f=v}return u(f);case il:return m=Xl(m),U(f,c,m,v)}if(Ei(m))return M(f,c,m,v);if(hi(m)){if(T=hi(m),typeof T!="function")throw Error(g(150));return m=T.call(m),x(f,c,m,v)}if(typeof m.then=="function")return U(f,c,Ln(m),v);if(m.$$typeof===Be)return U(f,c,qn(f,m),v);wn(f,m)}return typeof m=="string"&&m!==""||typeof m=="number"||typeof m=="bigint"?(m=""+m,c!==null&&c.tag===6?(l(f,c.sibling),v=i(c,m),v.return=f,f=v):(l(f,c),v=Zs(m,f.mode,v),v.return=f,f=v),u(f)):l(f,c)}return function(f,c,m,v){try{Vi=0;var T=U(f,c,m,v);return Ha=null,T}catch(E){if(E===Pa||E===Zu)throw E;var H=wt(29,E,null,f.mode);return H.lanes=v,H.return=f,H}}}var Wl=Bm(!0),Ym=Bm(!1),nl=!1;function zc(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Hr(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,callbacks:null})}function vl(t){return{lane:t,tag:0,payload:null,callback:null,next:null}}function gl(t,e,l){var a=t.updateQueue;if(a===null)return null;if(a=a.shared,(w&2)!==0){var i=a.pending;return i===null?e.next=e:(e.next=i.next,i.next=e),a.pending=e,e=yu(t),Cm(t,null,l),e}return Qu(t,a,e,l),yu(t)}function Ri(t,e,l){if(e=e.updateQueue,e!==null&&(e=e.shared,(l&4194048)!==0)){var a=e.lanes;a&=t.pendingLanes,l|=a,e.lanes=l,em(t,l)}}function Js(t,e){var l=t.updateQueue,a=t.alternate;if(a!==null&&(a=a.updateQueue,l===a)){var i=null,n=null;if(l=l.firstBaseUpdate,l!==null){do{var u={lane:l.lane,tag:l.tag,payload:l.payload,callback:null,next:null};n===null?i=n=u:n=n.next=u,l=l.next}while(l!==null);n===null?i=n=e:n=n.next=e}else i=n=e;l={baseState:a.baseState,firstBaseUpdate:i,lastBaseUpdate:n,shared:a.shared,callbacks:a.callbacks},t.updateQueue=l;return}t=l.lastBaseUpdate,t===null?l.firstBaseUpdate=e:t.next=e,l.lastBaseUpdate=e}var Ur=!1;function Di(){if(Ur){var t=Na;if(t!==null)throw t}}function Oi(t,e,l,a){Ur=!1;var i=t.updateQueue;nl=!1;var n=i.firstBaseUpdate,u=i.lastBaseUpdate,s=i.shared.pending;if(s!==null){i.shared.pending=null;var r=s,o=r.next;r.next=null,u===null?n=o:u.next=o,u=r;var h=t.alternate;h!==null&&(h=h.updateQueue,s=h.lastBaseUpdate,s!==u&&(s===null?h.firstBaseUpdate=o:s.next=o,h.lastBaseUpdate=r))}if(n!==null){var p=i.baseState;u=0,h=o=r=null,s=n;do{var d=s.lane&-536870913,y=d!==s.lane;if(y?(q&d)===d:(a&d)===d){d!==0&&d===wa&&(Ur=!0),h!==null&&(h=h.next={lane:0,tag:s.tag,payload:s.payload,callback:null,next:null});t:{var M=t,x=s;d=e;var U=l;switch(x.tag){case 1:if(M=x.payload,typeof M=="function"){p=M.call(U,p,d);break t}p=M;break t;case 3:M.flags=M.flags&-65537|128;case 0:if(M=x.payload,d=typeof M=="function"?M.call(U,p,d):M,d==null)break t;p=I({},p,d);break t;case 2:nl=!0}}d=s.callback,d!==null&&(t.flags|=64,y&&(t.flags|=8192),y=i.callbacks,y===null?i.callbacks=[d]:y.push(d))}else y={lane:d,tag:s.tag,payload:s.payload,callback:s.callback,next:null},h===null?(o=h=y,r=p):h=h.next=y,u|=d;if(s=s.next,s===null){if(s=i.shared.pending,s===null)break;y=s,s=y.next,y.next=null,i.lastBaseUpdate=y,i.shared.pending=null}}while(!0);h===null&&(r=p),i.baseState=r,i.firstBaseUpdate=o,i.lastBaseUpdate=h,n===null&&(i.shared.lanes=0),zl|=u,t.lanes=u,t.memoizedState=p}}function qm(t,e){if(typeof t!="function")throw Error(g(191,t));t.call(e)}function Lm(t,e){var l=t.callbacks;if(l!==null)for(t.callbacks=null,t=0;t<l.length;t++)qm(l[t],e)}var Xa=be(null),bu=be(0);function Ff(t,e){t=Ke,k(bu,t),k(Xa,e),Ke=t|e.baseLanes}function Br(){k(bu,Ke),k(Xa,Xa.current)}function Cc(){Ke=bu.current,vt(Xa),vt(bu)}var Jt=be(null),ue=null;function sl(t){var e=t.alternate;k(nt,nt.current&1),k(Jt,t),ue===null&&(e===null||Xa.current!==null||e.memoizedState!==null)&&(ue=t)}function Yr(t){k(nt,nt.current),k(Jt,t),ue===null&&(ue=t)}function wm(t){t.tag===22?(k(nt,nt.current),k(Jt,t),ue===null&&(ue=t)):rl(t)}function rl(){k(nt,nt.current),k(Jt,Jt.current)}function Lt(t){vt(Jt),ue===t&&(ue=null),vt(nt)}var nt=be(0);function Mu(t){for(var e=t;e!==null;){if(e.tag===13){var l=e.memoizedState;if(l!==null&&(l=l.dehydrated,l===null||lc(l)||ac(l)))return e}else if(e.tag===19&&(e.memoizedProps.revealOrder==="forwards"||e.memoizedProps.revealOrder==="backwards"||e.memoizedProps.revealOrder==="unstable_legacy-backwards"||e.memoizedProps.revealOrder==="together")){if((e.flags&128)!==0)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var Qe=0,O=null,J=null,st=null,Su=!1,Ua=!1,Pl=!1,Eu=0,Ki=0,Ba=null,Uv=0;function lt(){throw Error(g(321))}function _c(t,e){if(e===null)return!1;for(var l=0;l<e.length&&l<t.length;l++)if(!Kt(t[l],e[l]))return!1;return!0}function Rc(t,e,l,a,i,n){return Qe=n,O=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,z.H=t===null||t.memoizedState===null?vh:Xc,Pl=!1,n=l(a,i),Pl=!1,Ua&&(n=jm(e,l,a,i)),Xm(t),n}function Xm(t){z.H=Ji;var e=J!==null&&J.next!==null;if(Qe=0,st=J=O=null,Su=!1,Ki=0,Ba=null,e)throw Error(g(300));t===null||ot||(t=t.dependencies,t!==null&&vu(t)&&(ot=!0))}function jm(t,e,l,a){O=t;var i=0;do{if(Ua&&(Ba=null),Ki=0,Ua=!1,25<=i)throw Error(g(301));if(i+=1,st=J=null,t.updateQueue!=null){var n=t.updateQueue;n.lastEffect=null,n.events=null,n.stores=null,n.memoCache!=null&&(n.memoCache.index=0)}z.H=gh,n=e(l,a)}while(Ua);return n}function Bv(){var t=z.H,e=t.useState()[0];return e=typeof e.then=="function"?sn(e):e,t=t.useState()[0],(J!==null?J.memoizedState:null)!==t&&(O.flags|=1024),e}function Dc(){var t=Eu!==0;return Eu=0,t}function Oc(t,e,l){e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~l}function Nc(t){if(Su){for(t=t.memoizedState;t!==null;){var e=t.queue;e!==null&&(e.pending=null),t=t.next}Su=!1}Qe=0,st=J=O=null,Ua=!1,Ki=Eu=0,Ba=null}function _t(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return st===null?O.memoizedState=st=t:st=st.next=t,st}function ut(){if(J===null){var t=O.alternate;t=t!==null?t.memoizedState:null}else t=J.next;var e=st===null?O.memoizedState:st.next;if(e!==null)st=e,J=t;else{if(t===null)throw O.alternate===null?Error(g(467)):Error(g(310));J=t,t={memoizedState:J.memoizedState,baseState:J.baseState,baseQueue:J.baseQueue,queue:J.queue,next:null},st===null?O.memoizedState=st=t:st=st.next=t}return st}function Vu(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function sn(t){var e=Ki;return Ki+=1,Ba===null&&(Ba=[]),t=Um(Ba,t,e),e=O,(st===null?e.memoizedState:st.next)===null&&(e=e.alternate,z.H=e===null||e.memoizedState===null?vh:Xc),t}function Ku(t){if(t!==null&&typeof t=="object"){if(typeof t.then=="function")return sn(t);if(t.$$typeof===Be)return Et(t)}throw Error(g(438,String(t)))}function Hc(t){var e=null,l=O.updateQueue;if(l!==null&&(e=l.memoCache),e==null){var a=O.alternate;a!==null&&(a=a.updateQueue,a!==null&&(a=a.memoCache,a!=null&&(e={data:a.data.map(function(i){return i.slice()}),index:0})))}if(e==null&&(e={data:[],index:0}),l===null&&(l=Vu(),O.updateQueue=l),l.memoCache=e,l=e.data[e.index],l===void 0)for(l=e.data[e.index]=Array(t),a=0;a<t;a++)l[a]=S0;return e.index++,l}function Ze(t,e){return typeof e=="function"?e(t):e}function tu(t){var e=ut();return Uc(e,J,t)}function Uc(t,e,l){var a=t.queue;if(a===null)throw Error(g(311));a.lastRenderedReducer=l;var i=t.baseQueue,n=a.pending;if(n!==null){if(i!==null){var u=i.next;i.next=n.next,n.next=u}e.baseQueue=i=n,a.pending=null}if(n=t.baseState,i===null)t.memoizedState=n;else{e=i.next;var s=u=null,r=null,o=e,h=!1;do{var p=o.lane&-536870913;if(p!==o.lane?(q&p)===p:(Qe&p)===p){var d=o.revertLane;if(d===0)r!==null&&(r=r.next={lane:0,revertLane:0,gesture:null,action:o.action,hasEagerState:o.hasEagerState,eagerState:o.eagerState,next:null}),p===wa&&(h=!0);else if((Qe&d)===d){o=o.next,d===wa&&(h=!0);continue}else p={lane:0,revertLane:o.revertLane,gesture:null,action:o.action,hasEagerState:o.hasEagerState,eagerState:o.eagerState,next:null},r===null?(s=r=p,u=n):r=r.next=p,O.lanes|=d,zl|=d;p=o.action,Pl&&l(n,p),n=o.hasEagerState?o.eagerState:l(n,p)}else d={lane:p,revertLane:o.revertLane,gesture:o.gesture,action:o.action,hasEagerState:o.hasEagerState,eagerState:o.eagerState,next:null},r===null?(s=r=d,u=n):r=r.next=d,O.lanes|=p,zl|=p;o=o.next}while(o!==null&&o!==e);if(r===null?u=n:r.next=s,!Kt(n,t.memoizedState)&&(ot=!0,h&&(l=Na,l!==null)))throw l;t.memoizedState=n,t.baseState=u,t.baseQueue=r,a.lastRenderedState=n}return i===null&&(a.lanes=0),[t.memoizedState,a.dispatch]}function Fs(t){var e=ut(),l=e.queue;if(l===null)throw Error(g(311));l.lastRenderedReducer=t;var a=l.dispatch,i=l.pending,n=e.memoizedState;if(i!==null){l.pending=null;var u=i=i.next;do n=t(n,u.action),u=u.next;while(u!==i);Kt(n,e.memoizedState)||(ot=!0),e.memoizedState=n,e.baseQueue===null&&(e.baseState=n),l.lastRenderedState=n}return[n,a]}function Qm(t,e,l){var a=O,i=ut(),n=L;if(n){if(l===void 0)throw Error(g(407));l=l()}else l=e();var u=!Kt((J||i).memoizedState,l);if(u&&(i.memoizedState=l,ot=!0),i=i.queue,Bc(Km.bind(null,a,i,t),[t]),i.getSnapshot!==e||u||st!==null&&st.memoizedState.tag&1){if(a.flags|=2048,ja(9,{destroy:void 0},Vm.bind(null,a,i,l,e),null),F===null)throw Error(g(349));n||(Qe&127)!==0||Zm(a,e,l)}return l}function Zm(t,e,l){t.flags|=16384,t={getSnapshot:e,value:l},e=O.updateQueue,e===null?(e=Vu(),O.updateQueue=e,e.stores=[t]):(l=e.stores,l===null?e.stores=[t]:l.push(t))}function Vm(t,e,l,a){e.value=l,e.getSnapshot=a,Jm(e)&&Fm(t)}function Km(t,e,l){return l(function(){Jm(e)&&Fm(t)})}function Jm(t){var e=t.getSnapshot;t=t.value;try{var l=e();return!Kt(t,l)}catch{return!0}}function Fm(t){var e=la(t,2);e!==null&&Ht(e,t,2)}function qr(t){var e=_t();if(typeof t=="function"){var l=t;if(t=l(),Pl){ol(!0);try{l()}finally{ol(!1)}}}return e.memoizedState=e.baseState=t,e.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ze,lastRenderedState:t},e}function km(t,e,l,a){return t.baseState=l,Uc(t,J,typeof a=="function"?a:Ze)}function Yv(t,e,l,a,i){if(Fu(t))throw Error(g(485));if(t=e.action,t!==null){var n={payload:i,action:t,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(u){n.listeners.push(u)}};z.T!==null?l(!0):n.isTransition=!1,a(n),l=e.pending,l===null?(n.next=e.pending=n,Wm(e,n)):(n.next=l.next,e.pending=l.next=n)}}function Wm(t,e){var l=e.action,a=e.payload,i=t.state;if(e.isTransition){var n=z.T,u={};z.T=u;try{var s=l(i,a),r=z.S;r!==null&&r(u,s),kf(t,e,s)}catch(o){Lr(t,e,o)}finally{n!==null&&u.types!==null&&(n.types=u.types),z.T=n}}else try{n=l(i,a),kf(t,e,n)}catch(o){Lr(t,e,o)}}function kf(t,e,l){l!==null&&typeof l=="object"&&typeof l.then=="function"?l.then(function(a){Wf(t,e,a)},function(a){return Lr(t,e,a)}):Wf(t,e,l)}function Wf(t,e,l){e.status="fulfilled",e.value=l,Pm(e),t.state=l,e=t.pending,e!==null&&(l=e.next,l===e?t.pending=null:(l=l.next,e.next=l,Wm(t,l)))}function Lr(t,e,l){var a=t.pending;if(t.pending=null,a!==null){a=a.next;do e.status="rejected",e.reason=l,Pm(e),e=e.next;while(e!==a)}t.action=null}function Pm(t){t=t.listeners;for(var e=0;e<t.length;e++)(0,t[e])()}function $m(t,e){return e}function Pf(t,e){if(L){var l=F.formState;if(l!==null){t:{var a=O;if(L){if($){e:{for(var i=$,n=ne;i.nodeType!==8;){if(!n){i=null;break e}if(i=se(i.nextSibling),i===null){i=null;break e}}n=i.data,i=n==="F!"||n==="F"?i:null}if(i){$=se(i.nextSibling),a=i.data==="F!";break t}}Gl(a)}a=!1}a&&(e=l[0])}}return l=_t(),l.memoizedState=l.baseState=e,a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:$m,lastRenderedState:e},l.queue=a,l=hh.bind(null,O,a),a.dispatch=l,a=qr(!1),n=wc.bind(null,O,!1,a.queue),a=_t(),i={state:e,dispatch:null,action:t,pending:null},a.queue=i,l=Yv.bind(null,O,i,n,l),i.dispatch=l,a.memoizedState=t,[e,l,!1]}function $f(t){var e=ut();return Im(e,J,t)}function Im(t,e,l){if(e=Uc(t,e,$m)[0],t=tu(Ze)[0],typeof e=="object"&&e!==null&&typeof e.then=="function")try{var a=sn(e)}catch(u){throw u===Pa?Zu:u}else a=e;e=ut();var i=e.queue,n=i.dispatch;return l!==e.memoizedState&&(O.flags|=2048,ja(9,{destroy:void 0},qv.bind(null,i,l),null)),[a,n,t]}function qv(t,e){t.action=e}function If(t){var e=ut(),l=J;if(l!==null)return Im(e,l,t);ut(),e=e.memoizedState,l=ut();var a=l.queue.dispatch;return l.memoizedState=t,[e,a,!1]}function ja(t,e,l,a){return t={tag:t,create:l,deps:a,inst:e,next:null},e=O.updateQueue,e===null&&(e=Vu(),O.updateQueue=e),l=e.lastEffect,l===null?e.lastEffect=t.next=t:(a=l.next,l.next=t,t.next=a,e.lastEffect=t),t}function th(){return ut().memoizedState}function eu(t,e,l,a){var i=_t();O.flags|=t,i.memoizedState=ja(1|e,{destroy:void 0},l,a===void 0?null:a)}function Ju(t,e,l,a){var i=ut();a=a===void 0?null:a;var n=i.memoizedState.inst;J!==null&&a!==null&&_c(a,J.memoizedState.deps)?i.memoizedState=ja(e,n,l,a):(O.flags|=t,i.memoizedState=ja(1|e,n,l,a))}function td(t,e){eu(8390656,8,t,e)}function Bc(t,e){Ju(2048,8,t,e)}function Lv(t){O.flags|=4;var e=O.updateQueue;if(e===null)e=Vu(),O.updateQueue=e,e.events=[t];else{var l=e.events;l===null?e.events=[t]:l.push(t)}}function eh(t){var e=ut().memoizedState;return Lv({ref:e,nextImpl:t}),function(){if((w&2)!==0)throw Error(g(440));return e.impl.apply(void 0,arguments)}}function lh(t,e){return Ju(4,2,t,e)}function ah(t,e){return Ju(4,4,t,e)}function ih(t,e){if(typeof e=="function"){t=t();var l=e(t);return function(){typeof l=="function"?l():e(null)}}if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function nh(t,e,l){l=l!=null?l.concat([t]):null,Ju(4,4,ih.bind(null,e,t),l)}function Yc(){}function uh(t,e){var l=ut();e=e===void 0?null:e;var a=l.memoizedState;return e!==null&&_c(e,a[1])?a[0]:(l.memoizedState=[t,e],t)}function sh(t,e){var l=ut();e=e===void 0?null:e;var a=l.memoizedState;if(e!==null&&_c(e,a[1]))return a[0];if(a=t(),Pl){ol(!0);try{t()}finally{ol(!1)}}return l.memoizedState=[a,e],a}function qc(t,e,l){return l===void 0||(Qe&1073741824)!==0&&(q&261930)===0?t.memoizedState=e:(t.memoizedState=l,t=kh(),O.lanes|=t,zl|=t,l)}function rh(t,e,l,a){return Kt(l,e)?l:Xa.current!==null?(t=qc(t,l,a),Kt(t,e)||(ot=!0),t):(Qe&42)===0||(Qe&1073741824)!==0&&(q&261930)===0?(ot=!0,t.memoizedState=l):(t=kh(),O.lanes|=t,zl|=t,e)}function ch(t,e,l,a,i){var n=X.p;X.p=n!==0&&8>n?n:8;var u=z.T,s={};z.T=s,wc(t,!1,e,l);try{var r=i(),o=z.S;if(o!==null&&o(s,r),r!==null&&typeof r=="object"&&typeof r.then=="function"){var h=Hv(r,a);Ni(t,e,h,Vt(t))}else Ni(t,e,a,Vt(t))}catch(p){Ni(t,e,{then:function(){},status:"rejected",reason:p},Vt())}finally{X.p=n,u!==null&&s.types!==null&&(u.types=s.types),z.T=u}}function wv(){}function wr(t,e,l,a){if(t.tag!==5)throw Error(g(476));var i=oh(t).queue;ch(t,i,e,Ql,l===null?wv:function(){return fh(t),l(a)})}function oh(t){var e=t.memoizedState;if(e!==null)return e;e={memoizedState:Ql,baseState:Ql,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ze,lastRenderedState:Ql},next:null};var l={};return e.next={memoizedState:l,baseState:l,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ze,lastRenderedState:l},next:null},t.memoizedState=e,t=t.alternate,t!==null&&(t.memoizedState=e),e}function fh(t){var e=oh(t);e.next===null&&(e=t.alternate.memoizedState),Ni(t,e.next.queue,{},Vt())}function Lc(){return Et(Wi)}function dh(){return ut().memoizedState}function mh(){return ut().memoizedState}function Xv(t){for(var e=t.return;e!==null;){switch(e.tag){case 24:case 3:var l=Vt();t=vl(l);var a=gl(e,t,l);a!==null&&(Ht(a,e,l),Ri(a,e,l)),e={cache:Tc()},t.payload=e;return}e=e.return}}function jv(t,e,l){var a=Vt();l={lane:a,revertLane:0,gesture:null,action:l,hasEagerState:!1,eagerState:null,next:null},Fu(t)?yh(e,l):(l=Mc(t,e,l,a),l!==null&&(Ht(l,t,a),ph(l,e,a)))}function hh(t,e,l){var a=Vt();Ni(t,e,l,a)}function Ni(t,e,l,a){var i={lane:a,revertLane:0,gesture:null,action:l,hasEagerState:!1,eagerState:null,next:null};if(Fu(t))yh(e,i);else{var n=t.alternate;if(t.lanes===0&&(n===null||n.lanes===0)&&(n=e.lastRenderedReducer,n!==null))try{var u=e.lastRenderedState,s=n(u,l);if(i.hasEagerState=!0,i.eagerState=s,Kt(s,u))return Qu(t,e,i,0),F===null&&ju(),!1}catch{}if(l=Mc(t,e,i,a),l!==null)return Ht(l,t,a),ph(l,e,a),!0}return!1}function wc(t,e,l,a){if(a={lane:2,revertLane:kc(),gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null},Fu(t)){if(e)throw Error(g(479))}else e=Mc(t,l,a,2),e!==null&&Ht(e,t,2)}function Fu(t){var e=t.alternate;return t===O||e!==null&&e===O}function yh(t,e){Ua=Su=!0;var l=t.pending;l===null?e.next=e:(e.next=l.next,l.next=e),t.pending=e}function ph(t,e,l){if((l&4194048)!==0){var a=e.lanes;a&=t.pendingLanes,l|=a,e.lanes=l,em(t,l)}}var Ji={readContext:Et,use:Ku,useCallback:lt,useContext:lt,useEffect:lt,useImperativeHandle:lt,useLayoutEffect:lt,useInsertionEffect:lt,useMemo:lt,useReducer:lt,useRef:lt,useState:lt,useDebugValue:lt,useDeferredValue:lt,useTransition:lt,useSyncExternalStore:lt,useId:lt,useHostTransitionStatus:lt,useFormState:lt,useActionState:lt,useOptimistic:lt,useMemoCache:lt,useCacheRefresh:lt};Ji.useEffectEvent=lt;var vh={readContext:Et,use:Ku,useCallback:function(t,e){return _t().memoizedState=[t,e===void 0?null:e],t},useContext:Et,useEffect:td,useImperativeHandle:function(t,e,l){l=l!=null?l.concat([t]):null,eu(4194308,4,ih.bind(null,e,t),l)},useLayoutEffect:function(t,e){return eu(4194308,4,t,e)},useInsertionEffect:function(t,e){eu(4,2,t,e)},useMemo:function(t,e){var l=_t();e=e===void 0?null:e;var a=t();if(Pl){ol(!0);try{t()}finally{ol(!1)}}return l.memoizedState=[a,e],a},useReducer:function(t,e,l){var a=_t();if(l!==void 0){var i=l(e);if(Pl){ol(!0);try{l(e)}finally{ol(!1)}}}else i=e;return a.memoizedState=a.baseState=i,t={pending:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:i},a.queue=t,t=t.dispatch=jv.bind(null,O,t),[a.memoizedState,t]},useRef:function(t){var e=_t();return t={current:t},e.memoizedState=t},useState:function(t){t=qr(t);var e=t.queue,l=hh.bind(null,O,e);return e.dispatch=l,[t.memoizedState,l]},useDebugValue:Yc,useDeferredValue:function(t,e){var l=_t();return qc(l,t,e)},useTransition:function(){var t=qr(!1);return t=ch.bind(null,O,t.queue,!0,!1),_t().memoizedState=t,[!1,t]},useSyncExternalStore:function(t,e,l){var a=O,i=_t();if(L){if(l===void 0)throw Error(g(407));l=l()}else{if(l=e(),F===null)throw Error(g(349));(q&127)!==0||Zm(a,e,l)}i.memoizedState=l;var n={value:l,getSnapshot:e};return i.queue=n,td(Km.bind(null,a,n,t),[t]),a.flags|=2048,ja(9,{destroy:void 0},Vm.bind(null,a,n,l,e),null),l},useId:function(){var t=_t(),e=F.identifierPrefix;if(L){var l=pe,a=ye;l=(a&~(1<<32-Zt(a)-1)).toString(32)+l,e="_"+e+"R_"+l,l=Eu++,0<l&&(e+="H"+l.toString(32)),e+="_"}else l=Uv++,e="_"+e+"r_"+l.toString(32)+"_";return t.memoizedState=e},useHostTransitionStatus:Lc,useFormState:Pf,useActionState:Pf,useOptimistic:function(t){var e=_t();e.memoizedState=e.baseState=t;var l={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return e.queue=l,e=wc.bind(null,O,!0,l),l.dispatch=e,[t,e]},useMemoCache:Hc,useCacheRefresh:function(){return _t().memoizedState=Xv.bind(null,O)},useEffectEvent:function(t){var e=_t(),l={impl:t};return e.memoizedState=l,function(){if((w&2)!==0)throw Error(g(440));return l.impl.apply(void 0,arguments)}}},Xc={readContext:Et,use:Ku,useCallback:uh,useContext:Et,useEffect:Bc,useImperativeHandle:nh,useInsertionEffect:lh,useLayoutEffect:ah,useMemo:sh,useReducer:tu,useRef:th,useState:function(){return tu(Ze)},useDebugValue:Yc,useDeferredValue:function(t,e){var l=ut();return rh(l,J.memoizedState,t,e)},useTransition:function(){var t=tu(Ze)[0],e=ut().memoizedState;return[typeof t=="boolean"?t:sn(t),e]},useSyncExternalStore:Qm,useId:dh,useHostTransitionStatus:Lc,useFormState:$f,useActionState:$f,useOptimistic:function(t,e){var l=ut();return km(l,J,t,e)},useMemoCache:Hc,useCacheRefresh:mh};Xc.useEffectEvent=eh;var gh={readContext:Et,use:Ku,useCallback:uh,useContext:Et,useEffect:Bc,useImperativeHandle:nh,useInsertionEffect:lh,useLayoutEffect:ah,useMemo:sh,useReducer:Fs,useRef:th,useState:function(){return Fs(Ze)},useDebugValue:Yc,useDeferredValue:function(t,e){var l=ut();return J===null?qc(l,t,e):rh(l,J.memoizedState,t,e)},useTransition:function(){var t=Fs(Ze)[0],e=ut().memoizedState;return[typeof t=="boolean"?t:sn(t),e]},useSyncExternalStore:Qm,useId:dh,useHostTransitionStatus:Lc,useFormState:If,useActionState:If,useOptimistic:function(t,e){var l=ut();return J!==null?km(l,J,t,e):(l.baseState=t,[t,l.queue.dispatch])},useMemoCache:Hc,useCacheRefresh:mh};gh.useEffectEvent=eh;function ks(t,e,l,a){e=t.memoizedState,l=l(a,e),l=l==null?e:I({},e,l),t.memoizedState=l,t.lanes===0&&(t.updateQueue.baseState=l)}var Xr={enqueueSetState:function(t,e,l){t=t._reactInternals;var a=Vt(),i=vl(a);i.payload=e,l!=null&&(i.callback=l),e=gl(t,i,a),e!==null&&(Ht(e,t,a),Ri(e,t,a))},enqueueReplaceState:function(t,e,l){t=t._reactInternals;var a=Vt(),i=vl(a);i.tag=1,i.payload=e,l!=null&&(i.callback=l),e=gl(t,i,a),e!==null&&(Ht(e,t,a),Ri(e,t,a))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var l=Vt(),a=vl(l);a.tag=2,e!=null&&(a.callback=e),e=gl(t,a,l),e!==null&&(Ht(e,t,l),Ri(e,t,l))}};function ed(t,e,l,a,i,n,u){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(a,n,u):e.prototype&&e.prototype.isPureReactComponent?!ji(l,a)||!ji(i,n):!0}function ld(t,e,l,a){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(l,a),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(l,a),e.state!==t&&Xr.enqueueReplaceState(e,e.state,null)}function $l(t,e){var l=e;if("ref"in e){l={};for(var a in e)a!=="ref"&&(l[a]=e[a])}if(t=t.defaultProps){l===e&&(l=I({},l));for(var i in t)l[i]===void 0&&(l[i]=t[i])}return l}function bh(t){hu(t)}function Mh(t){console.error(t)}function Sh(t){hu(t)}function xu(t,e){try{var l=t.onUncaughtError;l(e.value,{componentStack:e.stack})}catch(a){setTimeout(function(){throw a})}}function ad(t,e,l){try{var a=t.onCaughtError;a(l.value,{componentStack:l.stack,errorBoundary:e.tag===1?e.stateNode:null})}catch(i){setTimeout(function(){throw i})}}function jr(t,e,l){return l=vl(l),l.tag=3,l.payload={element:null},l.callback=function(){xu(t,e)},l}function Eh(t){return t=vl(t),t.tag=3,t}function xh(t,e,l,a){var i=l.type.getDerivedStateFromError;if(typeof i=="function"){var n=a.value;t.payload=function(){return i(n)},t.callback=function(){ad(e,l,a)}}var u=l.stateNode;u!==null&&typeof u.componentDidCatch=="function"&&(t.callback=function(){ad(e,l,a),typeof i!="function"&&(bl===null?bl=new Set([this]):bl.add(this));var s=a.stack;this.componentDidCatch(a.value,{componentStack:s!==null?s:""})})}function Qv(t,e,l,a,i){if(l.flags|=32768,a!==null&&typeof a=="object"&&typeof a.then=="function"){if(e=l.alternate,e!==null&&Wa(e,l,i,!0),l=Jt.current,l!==null){switch(l.tag){case 31:case 13:return ue===null?Cu():l.alternate===null&&at===0&&(at=3),l.flags&=-257,l.flags|=65536,l.lanes=i,a===gu?l.flags|=16384:(e=l.updateQueue,e===null?l.updateQueue=new Set([a]):e.add(a),ur(t,a,i)),!1;case 22:return l.flags|=65536,a===gu?l.flags|=16384:(e=l.updateQueue,e===null?(e={transitions:null,markerInstances:null,retryQueue:new Set([a])},l.updateQueue=e):(l=e.retryQueue,l===null?e.retryQueue=new Set([a]):l.add(a)),ur(t,a,i)),!1}throw Error(g(435,l.tag))}return ur(t,a,i),Cu(),!1}if(L)return e=Jt.current,e!==null?((e.flags&65536)===0&&(e.flags|=256),e.flags|=65536,e.lanes=i,a!==_r&&(t=Error(g(422),{cause:a}),Zi(ie(t,l)))):(a!==_r&&(e=Error(g(423),{cause:a}),Zi(ie(e,l))),t=t.current.alternate,t.flags|=65536,i&=-i,t.lanes|=i,a=ie(a,l),i=jr(t.stateNode,a,i),Js(t,i),at!==4&&(at=2)),!1;var n=Error(g(520),{cause:a});if(n=ie(n,l),Bi===null?Bi=[n]:Bi.push(n),at!==4&&(at=2),e===null)return!0;a=ie(a,l),l=e;do{switch(l.tag){case 3:return l.flags|=65536,t=i&-i,l.lanes|=t,t=jr(l.stateNode,a,t),Js(l,t),!1;case 1:if(e=l.type,n=l.stateNode,(l.flags&128)===0&&(typeof e.getDerivedStateFromError=="function"||n!==null&&typeof n.componentDidCatch=="function"&&(bl===null||!bl.has(n))))return l.flags|=65536,i&=-i,l.lanes|=i,i=Eh(i),xh(i,t,l,a),Js(l,i),!1}l=l.return}while(l!==null);return!1}var jc=Error(g(461)),ot=!1;function bt(t,e,l,a){e.child=t===null?Ym(e,null,l,a):Wl(e,t.child,l,a)}function id(t,e,l,a,i){l=l.render;var n=e.ref;if("ref"in a){var u={};for(var s in a)s!=="ref"&&(u[s]=a[s])}else u=a;return kl(e),a=Rc(t,e,l,u,n,i),s=Dc(),t!==null&&!ot?(Oc(t,e,i),Ve(t,e,i)):(L&&s&&Ec(e),e.flags|=1,bt(t,e,a,i),e.child)}function nd(t,e,l,a,i){if(t===null){var n=l.type;return typeof n=="function"&&!Sc(n)&&n.defaultProps===void 0&&l.compare===null?(e.tag=15,e.type=n,Th(t,e,n,a,i)):(t=$n(l.type,null,a,e,e.mode,i),t.ref=e.ref,t.return=e,e.child=t)}if(n=t.child,!Qc(t,i)){var u=n.memoizedProps;if(l=l.compare,l=l!==null?l:ji,l(u,a)&&t.ref===e.ref)return Ve(t,e,i)}return e.flags|=1,t=Le(n,a),t.ref=e.ref,t.return=e,e.child=t}function Th(t,e,l,a,i){if(t!==null){var n=t.memoizedProps;if(ji(n,a)&&t.ref===e.ref)if(ot=!1,e.pendingProps=a=n,Qc(t,i))(t.flags&131072)!==0&&(ot=!0);else return e.lanes=t.lanes,Ve(t,e,i)}return Qr(t,e,l,a,i)}function Gh(t,e,l,a){var i=a.children,n=t!==null?t.memoizedState:null;if(t===null&&e.stateNode===null&&(e.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),a.mode==="hidden"){if((e.flags&128)!==0){if(n=n!==null?n.baseLanes|l:l,t!==null){for(a=e.child=t.child,i=0;a!==null;)i=i|a.lanes|a.childLanes,a=a.sibling;a=i&~n}else a=0,e.child=null;return ud(t,e,n,l,a)}if((l&536870912)!==0)e.memoizedState={baseLanes:0,cachePool:null},t!==null&&In(e,n!==null?n.cachePool:null),n!==null?Ff(e,n):Br(),wm(e);else return a=e.lanes=536870912,ud(t,e,n!==null?n.baseLanes|l:l,l,a)}else n!==null?(In(e,n.cachePool),Ff(e,n),rl(e),e.memoizedState=null):(t!==null&&In(e,null),Br(),rl(e));return bt(t,e,i,l),e.child}function Ti(t,e){return t!==null&&t.tag===22||e.stateNode!==null||(e.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),e.sibling}function ud(t,e,l,a,i){var n=Gc();return n=n===null?null:{parent:ct._currentValue,pool:n},e.memoizedState={baseLanes:l,cachePool:n},t!==null&&In(e,null),Br(),wm(e),t!==null&&Wa(t,e,a,!0),e.childLanes=i,null}function lu(t,e){return e=Tu({mode:e.mode,children:e.children},t.mode),e.ref=t.ref,t.child=e,e.return=t,e}function sd(t,e,l){return Wl(e,t.child,null,l),t=lu(e,e.pendingProps),t.flags|=2,Lt(e),e.memoizedState=null,t}function Zv(t,e,l){var a=e.pendingProps,i=(e.flags&128)!==0;if(e.flags&=-129,t===null){if(L){if(a.mode==="hidden")return t=lu(e,a),e.lanes=536870912,Ti(null,t);if(Yr(e),(t=$)?(t=vy(t,ne),t=t!==null&&t.data==="&"?t:null,t!==null&&(e.memoizedState={dehydrated:t,treeContext:Tl!==null?{id:ye,overflow:pe}:null,retryLane:536870912,hydrationErrors:null},l=Rm(t),l.return=e,e.child=l,St=e,$=null)):t=null,t===null)throw Gl(e);return e.lanes=536870912,null}return lu(e,a)}var n=t.memoizedState;if(n!==null){var u=n.dehydrated;if(Yr(e),i)if(e.flags&256)e.flags&=-257,e=sd(t,e,l);else if(e.memoizedState!==null)e.child=t.child,e.flags|=128,e=null;else throw Error(g(558));else if(ot||Wa(t,e,l,!1),i=(l&t.childLanes)!==0,ot||i){if(a=F,a!==null&&(u=lm(a,l),u!==0&&u!==n.retryLane))throw n.retryLane=u,la(t,u),Ht(a,t,u),jc;Cu(),e=sd(t,e,l)}else t=n.treeContext,$=se(u.nextSibling),St=e,L=!0,pl=null,ne=!1,t!==null&&Om(e,t),e=lu(e,a),e.flags|=4096;return e}return t=Le(t.child,{mode:a.mode,children:a.children}),t.ref=e.ref,e.child=t,t.return=e,t}function au(t,e){var l=e.ref;if(l===null)t!==null&&t.ref!==null&&(e.flags|=4194816);else{if(typeof l!="function"&&typeof l!="object")throw Error(g(284));(t===null||t.ref!==l)&&(e.flags|=4194816)}}function Qr(t,e,l,a,i){return kl(e),l=Rc(t,e,l,a,void 0,i),a=Dc(),t!==null&&!ot?(Oc(t,e,i),Ve(t,e,i)):(L&&a&&Ec(e),e.flags|=1,bt(t,e,l,i),e.child)}function rd(t,e,l,a,i,n){return kl(e),e.updateQueue=null,l=jm(e,a,l,i),Xm(t),a=Dc(),t!==null&&!ot?(Oc(t,e,n),Ve(t,e,n)):(L&&a&&Ec(e),e.flags|=1,bt(t,e,l,n),e.child)}function cd(t,e,l,a,i){if(kl(e),e.stateNode===null){var n=Aa,u=l.contextType;typeof u=="object"&&u!==null&&(n=Et(u)),n=new l(a,n),e.memoizedState=n.state!==null&&n.state!==void 0?n.state:null,n.updater=Xr,e.stateNode=n,n._reactInternals=e,n=e.stateNode,n.props=a,n.state=e.memoizedState,n.refs={},zc(e),u=l.contextType,n.context=typeof u=="object"&&u!==null?Et(u):Aa,n.state=e.memoizedState,u=l.getDerivedStateFromProps,typeof u=="function"&&(ks(e,l,u,a),n.state=e.memoizedState),typeof l.getDerivedStateFromProps=="function"||typeof n.getSnapshotBeforeUpdate=="function"||typeof n.UNSAFE_componentWillMount!="function"&&typeof n.componentWillMount!="function"||(u=n.state,typeof n.componentWillMount=="function"&&n.componentWillMount(),typeof n.UNSAFE_componentWillMount=="function"&&n.UNSAFE_componentWillMount(),u!==n.state&&Xr.enqueueReplaceState(n,n.state,null),Oi(e,a,n,i),Di(),n.state=e.memoizedState),typeof n.componentDidMount=="function"&&(e.flags|=4194308),a=!0}else if(t===null){n=e.stateNode;var s=e.memoizedProps,r=$l(l,s);n.props=r;var o=n.context,h=l.contextType;u=Aa,typeof h=="object"&&h!==null&&(u=Et(h));var p=l.getDerivedStateFromProps;h=typeof p=="function"||typeof n.getSnapshotBeforeUpdate=="function",s=e.pendingProps!==s,h||typeof n.UNSAFE_componentWillReceiveProps!="function"&&typeof n.componentWillReceiveProps!="function"||(s||o!==u)&&ld(e,n,a,u),nl=!1;var d=e.memoizedState;n.state=d,Oi(e,a,n,i),Di(),o=e.memoizedState,s||d!==o||nl?(typeof p=="function"&&(ks(e,l,p,a),o=e.memoizedState),(r=nl||ed(e,l,r,a,d,o,u))?(h||typeof n.UNSAFE_componentWillMount!="function"&&typeof n.componentWillMount!="function"||(typeof n.componentWillMount=="function"&&n.componentWillMount(),typeof n.UNSAFE_componentWillMount=="function"&&n.UNSAFE_componentWillMount()),typeof n.componentDidMount=="function"&&(e.flags|=4194308)):(typeof n.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=a,e.memoizedState=o),n.props=a,n.state=o,n.context=u,a=r):(typeof n.componentDidMount=="function"&&(e.flags|=4194308),a=!1)}else{n=e.stateNode,Hr(t,e),u=e.memoizedProps,h=$l(l,u),n.props=h,p=e.pendingProps,d=n.context,o=l.contextType,r=Aa,typeof o=="object"&&o!==null&&(r=Et(o)),s=l.getDerivedStateFromProps,(o=typeof s=="function"||typeof n.getSnapshotBeforeUpdate=="function")||typeof n.UNSAFE_componentWillReceiveProps!="function"&&typeof n.componentWillReceiveProps!="function"||(u!==p||d!==r)&&ld(e,n,a,r),nl=!1,d=e.memoizedState,n.state=d,Oi(e,a,n,i),Di();var y=e.memoizedState;u!==p||d!==y||nl||t!==null&&t.dependencies!==null&&vu(t.dependencies)?(typeof s=="function"&&(ks(e,l,s,a),y=e.memoizedState),(h=nl||ed(e,l,h,a,d,y,r)||t!==null&&t.dependencies!==null&&vu(t.dependencies))?(o||typeof n.UNSAFE_componentWillUpdate!="function"&&typeof n.componentWillUpdate!="function"||(typeof n.componentWillUpdate=="function"&&n.componentWillUpdate(a,y,r),typeof n.UNSAFE_componentWillUpdate=="function"&&n.UNSAFE_componentWillUpdate(a,y,r)),typeof n.componentDidUpdate=="function"&&(e.flags|=4),typeof n.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof n.componentDidUpdate!="function"||u===t.memoizedProps&&d===t.memoizedState||(e.flags|=4),typeof n.getSnapshotBeforeUpdate!="function"||u===t.memoizedProps&&d===t.memoizedState||(e.flags|=1024),e.memoizedProps=a,e.memoizedState=y),n.props=a,n.state=y,n.context=r,a=h):(typeof n.componentDidUpdate!="function"||u===t.memoizedProps&&d===t.memoizedState||(e.flags|=4),typeof n.getSnapshotBeforeUpdate!="function"||u===t.memoizedProps&&d===t.memoizedState||(e.flags|=1024),a=!1)}return n=a,au(t,e),a=(e.flags&128)!==0,n||a?(n=e.stateNode,l=a&&typeof l.getDerivedStateFromError!="function"?null:n.render(),e.flags|=1,t!==null&&a?(e.child=Wl(e,t.child,null,i),e.child=Wl(e,null,l,i)):bt(t,e,l,i),e.memoizedState=n.state,t=e.child):t=Ve(t,e,i),t}function od(t,e,l,a){return Fl(),e.flags|=256,bt(t,e,l,a),e.child}var Ws={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Ps(t){return{baseLanes:t,cachePool:Hm()}}function $s(t,e,l){return t=t!==null?t.childLanes&~l:0,e&&(t|=Xt),t}function Ah(t,e,l){var a=e.pendingProps,i=!1,n=(e.flags&128)!==0,u;if((u=n)||(u=t!==null&&t.memoizedState===null?!1:(nt.current&2)!==0),u&&(i=!0,e.flags&=-129),u=(e.flags&32)!==0,e.flags&=-33,t===null){if(L){if(i?sl(e):rl(e),(t=$)?(t=vy(t,ne),t=t!==null&&t.data!=="&"?t:null,t!==null&&(e.memoizedState={dehydrated:t,treeContext:Tl!==null?{id:ye,overflow:pe}:null,retryLane:536870912,hydrationErrors:null},l=Rm(t),l.return=e,e.child=l,St=e,$=null)):t=null,t===null)throw Gl(e);return ac(t)?e.lanes=32:e.lanes=536870912,null}var s=a.children;return a=a.fallback,i?(rl(e),i=e.mode,s=Tu({mode:"hidden",children:s},i),a=Zl(a,i,l,null),s.return=e,a.return=e,s.sibling=a,e.child=s,a=e.child,a.memoizedState=Ps(l),a.childLanes=$s(t,u,l),e.memoizedState=Ws,Ti(null,a)):(sl(e),Zr(e,s))}var r=t.memoizedState;if(r!==null&&(s=r.dehydrated,s!==null)){if(n)e.flags&256?(sl(e),e.flags&=-257,e=Is(t,e,l)):e.memoizedState!==null?(rl(e),e.child=t.child,e.flags|=128,e=null):(rl(e),s=a.fallback,i=e.mode,a=Tu({mode:"visible",children:a.children},i),s=Zl(s,i,l,null),s.flags|=2,a.return=e,s.return=e,a.sibling=s,e.child=a,Wl(e,t.child,null,l),a=e.child,a.memoizedState=Ps(l),a.childLanes=$s(t,u,l),e.memoizedState=Ws,e=Ti(null,a));else if(sl(e),ac(s)){if(u=s.nextSibling&&s.nextSibling.dataset,u)var o=u.dgst;u=o,a=Error(g(419)),a.stack="",a.digest=u,Zi({value:a,source:null,stack:null}),e=Is(t,e,l)}else if(ot||Wa(t,e,l,!1),u=(l&t.childLanes)!==0,ot||u){if(u=F,u!==null&&(a=lm(u,l),a!==0&&a!==r.retryLane))throw r.retryLane=a,la(t,a),Ht(u,t,a),jc;lc(s)||Cu(),e=Is(t,e,l)}else lc(s)?(e.flags|=192,e.child=t.child,e=null):(t=r.treeContext,$=se(s.nextSibling),St=e,L=!0,pl=null,ne=!1,t!==null&&Om(e,t),e=Zr(e,a.children),e.flags|=4096);return e}return i?(rl(e),s=a.fallback,i=e.mode,r=t.child,o=r.sibling,a=Le(r,{mode:"hidden",children:a.children}),a.subtreeFlags=r.subtreeFlags&65011712,o!==null?s=Le(o,s):(s=Zl(s,i,l,null),s.flags|=2),s.return=e,a.return=e,a.sibling=s,e.child=a,Ti(null,a),a=e.child,s=t.child.memoizedState,s===null?s=Ps(l):(i=s.cachePool,i!==null?(r=ct._currentValue,i=i.parent!==r?{parent:r,pool:r}:i):i=Hm(),s={baseLanes:s.baseLanes|l,cachePool:i}),a.memoizedState=s,a.childLanes=$s(t,u,l),e.memoizedState=Ws,Ti(t.child,a)):(sl(e),l=t.child,t=l.sibling,l=Le(l,{mode:"visible",children:a.children}),l.return=e,l.sibling=null,t!==null&&(u=e.deletions,u===null?(e.deletions=[t],e.flags|=16):u.push(t)),e.child=l,e.memoizedState=null,l)}function Zr(t,e){return e=Tu({mode:"visible",children:e},t.mode),e.return=t,t.child=e}function Tu(t,e){return t=wt(22,t,null,e),t.lanes=0,t}function Is(t,e,l){return Wl(e,t.child,null,l),t=Zr(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function fd(t,e,l){t.lanes|=e;var a=t.alternate;a!==null&&(a.lanes|=e),Dr(t.return,e,l)}function tr(t,e,l,a,i,n){var u=t.memoizedState;u===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:a,tail:l,tailMode:i,treeForkCount:n}:(u.isBackwards=e,u.rendering=null,u.renderingStartTime=0,u.last=a,u.tail=l,u.tailMode=i,u.treeForkCount=n)}function zh(t,e,l){var a=e.pendingProps,i=a.revealOrder,n=a.tail;a=a.children;var u=nt.current,s=(u&2)!==0;if(s?(u=u&1|2,e.flags|=128):u&=1,k(nt,u),bt(t,e,a,l),a=L?Qi:0,!s&&t!==null&&(t.flags&128)!==0)t:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&fd(t,l,e);else if(t.tag===19)fd(t,l,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break t;for(;t.sibling===null;){if(t.return===null||t.return===e)break t;t=t.return}t.sibling.return=t.return,t=t.sibling}switch(i){case"forwards":for(l=e.child,i=null;l!==null;)t=l.alternate,t!==null&&Mu(t)===null&&(i=l),l=l.sibling;l=i,l===null?(i=e.child,e.child=null):(i=l.sibling,l.sibling=null),tr(e,!1,i,l,n,a);break;case"backwards":case"unstable_legacy-backwards":for(l=null,i=e.child,e.child=null;i!==null;){if(t=i.alternate,t!==null&&Mu(t)===null){e.child=i;break}t=i.sibling,i.sibling=l,l=i,i=t}tr(e,!0,l,null,n,a);break;case"together":tr(e,!1,null,null,void 0,a);break;default:e.memoizedState=null}return e.child}function Ve(t,e,l){if(t!==null&&(e.dependencies=t.dependencies),zl|=e.lanes,(l&e.childLanes)===0)if(t!==null){if(Wa(t,e,l,!1),(l&e.childLanes)===0)return null}else return null;if(t!==null&&e.child!==t.child)throw Error(g(153));if(e.child!==null){for(t=e.child,l=Le(t,t.pendingProps),e.child=l,l.return=e;t.sibling!==null;)t=t.sibling,l=l.sibling=Le(t,t.pendingProps),l.return=e;l.sibling=null}return e.child}function Qc(t,e){return(t.lanes&e)!==0?!0:(t=t.dependencies,!!(t!==null&&vu(t)))}function Vv(t,e,l){switch(e.tag){case 3:ou(e,e.stateNode.containerInfo),ul(e,ct,t.memoizedState.cache),Fl();break;case 27:case 5:gr(e);break;case 4:ou(e,e.stateNode.containerInfo);break;case 10:ul(e,e.type,e.memoizedProps.value);break;case 31:if(e.memoizedState!==null)return e.flags|=128,Yr(e),null;break;case 13:var a=e.memoizedState;if(a!==null)return a.dehydrated!==null?(sl(e),e.flags|=128,null):(l&e.child.childLanes)!==0?Ah(t,e,l):(sl(e),t=Ve(t,e,l),t!==null?t.sibling:null);sl(e);break;case 19:var i=(t.flags&128)!==0;if(a=(l&e.childLanes)!==0,a||(Wa(t,e,l,!1),a=(l&e.childLanes)!==0),i){if(a)return zh(t,e,l);e.flags|=128}if(i=e.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),k(nt,nt.current),a)break;return null;case 22:return e.lanes=0,Gh(t,e,l,e.pendingProps);case 24:ul(e,ct,t.memoizedState.cache)}return Ve(t,e,l)}function Ch(t,e,l){if(t!==null)if(t.memoizedProps!==e.pendingProps)ot=!0;else{if(!Qc(t,l)&&(e.flags&128)===0)return ot=!1,Vv(t,e,l);ot=(t.flags&131072)!==0}else ot=!1,L&&(e.flags&1048576)!==0&&Dm(e,Qi,e.index);switch(e.lanes=0,e.tag){case 16:t:{var a=e.pendingProps;if(t=Xl(e.elementType),e.type=t,typeof t=="function")Sc(t)?(a=$l(t,a),e.tag=1,e=cd(null,e,t,a,l)):(e.tag=0,e=Qr(null,e,t,a,l));else{if(t!=null){var i=t.$$typeof;if(i===sc){e.tag=11,e=id(null,e,t,a,l);break t}else if(i===rc){e.tag=14,e=nd(null,e,t,a,l);break t}}throw e=pr(t)||t,Error(g(306,e,""))}}return e;case 0:return Qr(t,e,e.type,e.pendingProps,l);case 1:return a=e.type,i=$l(a,e.pendingProps),cd(t,e,a,i,l);case 3:t:{if(ou(e,e.stateNode.containerInfo),t===null)throw Error(g(387));a=e.pendingProps;var n=e.memoizedState;i=n.element,Hr(t,e),Oi(e,a,null,l);var u=e.memoizedState;if(a=u.cache,ul(e,ct,a),a!==n.cache&&Or(e,[ct],l,!0),Di(),a=u.element,n.isDehydrated)if(n={element:a,isDehydrated:!1,cache:u.cache},e.updateQueue.baseState=n,e.memoizedState=n,e.flags&256){e=od(t,e,a,l);break t}else if(a!==i){i=ie(Error(g(424)),e),Zi(i),e=od(t,e,a,l);break t}else for(t=e.stateNode.containerInfo,t.nodeType===9?t=t.body:t=t.nodeName==="HTML"?t.ownerDocument.body:t,$=se(t.firstChild),St=e,L=!0,pl=null,ne=!0,l=Ym(e,null,a,l),e.child=l;l;)l.flags=l.flags&-3|4096,l=l.sibling;else{if(Fl(),a===i){e=Ve(t,e,l);break t}bt(t,e,a,l)}e=e.child}return e;case 26:return au(t,e),t===null?(l=Nd(e.type,null,e.pendingProps,null))?e.memoizedState=l:L||(l=e.type,t=e.pendingProps,a=Ou(yl.current).createElement(l),a[Mt]=e,a[Ut]=t,xt(a,l,t),pt(a),e.stateNode=a):e.memoizedState=Nd(e.type,t.memoizedProps,e.pendingProps,t.memoizedState),null;case 27:return gr(e),t===null&&L&&(a=e.stateNode=gy(e.type,e.pendingProps,yl.current),St=e,ne=!0,i=$,_l(e.type)?(ic=i,$=se(a.firstChild)):$=i),bt(t,e,e.pendingProps.children,l),au(t,e),t===null&&(e.flags|=4194304),e.child;case 5:return t===null&&L&&((i=a=$)&&(a=b1(a,e.type,e.pendingProps,ne),a!==null?(e.stateNode=a,St=e,$=se(a.firstChild),ne=!1,i=!0):i=!1),i||Gl(e)),gr(e),i=e.type,n=e.pendingProps,u=t!==null?t.memoizedProps:null,a=n.children,tc(i,n)?a=null:u!==null&&tc(i,u)&&(e.flags|=32),e.memoizedState!==null&&(i=Rc(t,e,Bv,null,null,l),Wi._currentValue=i),au(t,e),bt(t,e,a,l),e.child;case 6:return t===null&&L&&((t=l=$)&&(l=M1(l,e.pendingProps,ne),l!==null?(e.stateNode=l,St=e,$=null,t=!0):t=!1),t||Gl(e)),null;case 13:return Ah(t,e,l);case 4:return ou(e,e.stateNode.containerInfo),a=e.pendingProps,t===null?e.child=Wl(e,null,a,l):bt(t,e,a,l),e.child;case 11:return id(t,e,e.type,e.pendingProps,l);case 7:return bt(t,e,e.pendingProps,l),e.child;case 8:return bt(t,e,e.pendingProps.children,l),e.child;case 12:return bt(t,e,e.pendingProps.children,l),e.child;case 10:return a=e.pendingProps,ul(e,e.type,a.value),bt(t,e,a.children,l),e.child;case 9:return i=e.type._context,a=e.pendingProps.children,kl(e),i=Et(i),a=a(i),e.flags|=1,bt(t,e,a,l),e.child;case 14:return nd(t,e,e.type,e.pendingProps,l);case 15:return Th(t,e,e.type,e.pendingProps,l);case 19:return zh(t,e,l);case 31:return Zv(t,e,l);case 22:return Gh(t,e,l,e.pendingProps);case 24:return kl(e),a=Et(ct),t===null?(i=Gc(),i===null&&(i=F,n=Tc(),i.pooledCache=n,n.refCount++,n!==null&&(i.pooledCacheLanes|=l),i=n),e.memoizedState={parent:a,cache:i},zc(e),ul(e,ct,i)):((t.lanes&l)!==0&&(Hr(t,e),Oi(e,null,null,l),Di()),i=t.memoizedState,n=e.memoizedState,i.parent!==a?(i={parent:a,cache:a},e.memoizedState=i,e.lanes===0&&(e.memoizedState=e.updateQueue.baseState=i),ul(e,ct,a)):(a=n.cache,ul(e,ct,a),a!==i.cache&&Or(e,[ct],l,!0))),bt(t,e,e.pendingProps.children,l),e.child;case 29:throw e.pendingProps}throw Error(g(156,e.tag))}function Re(t){t.flags|=4}function er(t,e,l,a,i){if((e=(t.mode&32)!==0)&&(e=!1),e){if(t.flags|=16777216,(i&335544128)===i)if(t.stateNode.complete)t.flags|=8192;else if($h())t.flags|=8192;else throw Kl=gu,Ac}else t.flags&=-16777217}function dd(t,e){if(e.type!=="stylesheet"||(e.state.loading&4)!==0)t.flags&=-16777217;else if(t.flags|=16777216,!Sy(e))if($h())t.flags|=8192;else throw Kl=gu,Ac}function Xn(t,e){e!==null&&(t.flags|=4),t.flags&16384&&(e=t.tag!==22?Id():536870912,t.lanes|=e,Qa|=e)}function vi(t,e){if(!L)switch(t.tailMode){case"hidden":e=t.tail;for(var l=null;e!==null;)e.alternate!==null&&(l=e),e=e.sibling;l===null?t.tail=null:l.sibling=null;break;case"collapsed":l=t.tail;for(var a=null;l!==null;)l.alternate!==null&&(a=l),l=l.sibling;a===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:a.sibling=null}}function P(t){var e=t.alternate!==null&&t.alternate.child===t.child,l=0,a=0;if(e)for(var i=t.child;i!==null;)l|=i.lanes|i.childLanes,a|=i.subtreeFlags&65011712,a|=i.flags&65011712,i.return=t,i=i.sibling;else for(i=t.child;i!==null;)l|=i.lanes|i.childLanes,a|=i.subtreeFlags,a|=i.flags,i.return=t,i=i.sibling;return t.subtreeFlags|=a,t.childLanes=l,e}function Kv(t,e,l){var a=e.pendingProps;switch(xc(e),e.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return P(e),null;case 1:return P(e),null;case 3:return l=e.stateNode,a=null,t!==null&&(a=t.memoizedState.cache),e.memoizedState.cache!==a&&(e.flags|=2048),we(ct),Ya(),l.pendingContext&&(l.context=l.pendingContext,l.pendingContext=null),(t===null||t.child===null)&&(ha(e)?Re(e):t===null||t.memoizedState.isDehydrated&&(e.flags&256)===0||(e.flags|=1024,Ks())),P(e),null;case 26:var i=e.type,n=e.memoizedState;return t===null?(Re(e),n!==null?(P(e),dd(e,n)):(P(e),er(e,i,null,a,l))):n?n!==t.memoizedState?(Re(e),P(e),dd(e,n)):(P(e),e.flags&=-16777217):(t=t.memoizedProps,t!==a&&Re(e),P(e),er(e,i,t,a,l)),null;case 27:if(fu(e),l=yl.current,i=e.type,t!==null&&e.stateNode!=null)t.memoizedProps!==a&&Re(e);else{if(!a){if(e.stateNode===null)throw Error(g(166));return P(e),null}t=ge.current,ha(e)?Xf(e,t):(t=gy(i,a,l),e.stateNode=t,Re(e))}return P(e),null;case 5:if(fu(e),i=e.type,t!==null&&e.stateNode!=null)t.memoizedProps!==a&&Re(e);else{if(!a){if(e.stateNode===null)throw Error(g(166));return P(e),null}if(n=ge.current,ha(e))Xf(e,n);else{var u=Ou(yl.current);switch(n){case 1:n=u.createElementNS("http://www.w3.org/2000/svg",i);break;case 2:n=u.createElementNS("http://www.w3.org/1998/Math/MathML",i);break;default:switch(i){case"svg":n=u.createElementNS("http://www.w3.org/2000/svg",i);break;case"math":n=u.createElementNS("http://www.w3.org/1998/Math/MathML",i);break;case"script":n=u.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild);break;case"select":n=typeof a.is=="string"?u.createElement("select",{is:a.is}):u.createElement("select"),a.multiple?n.multiple=!0:a.size&&(n.size=a.size);break;default:n=typeof a.is=="string"?u.createElement(i,{is:a.is}):u.createElement(i)}}n[Mt]=e,n[Ut]=a;t:for(u=e.child;u!==null;){if(u.tag===5||u.tag===6)n.appendChild(u.stateNode);else if(u.tag!==4&&u.tag!==27&&u.child!==null){u.child.return=u,u=u.child;continue}if(u===e)break t;for(;u.sibling===null;){if(u.return===null||u.return===e)break t;u=u.return}u.sibling.return=u.return,u=u.sibling}e.stateNode=n;t:switch(xt(n,i,a),i){case"button":case"input":case"select":case"textarea":a=!!a.autoFocus;break t;case"img":a=!0;break t;default:a=!1}a&&Re(e)}}return P(e),er(e,e.type,t===null?null:t.memoizedProps,e.pendingProps,l),null;case 6:if(t&&e.stateNode!=null)t.memoizedProps!==a&&Re(e);else{if(typeof a!="string"&&e.stateNode===null)throw Error(g(166));if(t=yl.current,ha(e)){if(t=e.stateNode,l=e.memoizedProps,a=null,i=St,i!==null)switch(i.tag){case 27:case 5:a=i.memoizedProps}t[Mt]=e,t=!!(t.nodeValue===l||a!==null&&a.suppressHydrationWarning===!0||hy(t.nodeValue,l)),t||Gl(e,!0)}else t=Ou(t).createTextNode(a),t[Mt]=e,e.stateNode=t}return P(e),null;case 31:if(l=e.memoizedState,t===null||t.memoizedState!==null){if(a=ha(e),l!==null){if(t===null){if(!a)throw Error(g(318));if(t=e.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(g(557));t[Mt]=e}else Fl(),(e.flags&128)===0&&(e.memoizedState=null),e.flags|=4;P(e),t=!1}else l=Ks(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=l),t=!0;if(!t)return e.flags&256?(Lt(e),e):(Lt(e),null);if((e.flags&128)!==0)throw Error(g(558))}return P(e),null;case 13:if(a=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(i=ha(e),a!==null&&a.dehydrated!==null){if(t===null){if(!i)throw Error(g(318));if(i=e.memoizedState,i=i!==null?i.dehydrated:null,!i)throw Error(g(317));i[Mt]=e}else Fl(),(e.flags&128)===0&&(e.memoizedState=null),e.flags|=4;P(e),i=!1}else i=Ks(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=i),i=!0;if(!i)return e.flags&256?(Lt(e),e):(Lt(e),null)}return Lt(e),(e.flags&128)!==0?(e.lanes=l,e):(l=a!==null,t=t!==null&&t.memoizedState!==null,l&&(a=e.child,i=null,a.alternate!==null&&a.alternate.memoizedState!==null&&a.alternate.memoizedState.cachePool!==null&&(i=a.alternate.memoizedState.cachePool.pool),n=null,a.memoizedState!==null&&a.memoizedState.cachePool!==null&&(n=a.memoizedState.cachePool.pool),n!==i&&(a.flags|=2048)),l!==t&&l&&(e.child.flags|=8192),Xn(e,e.updateQueue),P(e),null);case 4:return Ya(),t===null&&Wc(e.stateNode.containerInfo),P(e),null;case 10:return we(e.type),P(e),null;case 19:if(vt(nt),a=e.memoizedState,a===null)return P(e),null;if(i=(e.flags&128)!==0,n=a.rendering,n===null)if(i)vi(a,!1);else{if(at!==0||t!==null&&(t.flags&128)!==0)for(t=e.child;t!==null;){if(n=Mu(t),n!==null){for(e.flags|=128,vi(a,!1),t=n.updateQueue,e.updateQueue=t,Xn(e,t),e.subtreeFlags=0,t=l,l=e.child;l!==null;)_m(l,t),l=l.sibling;return k(nt,nt.current&1|2),L&&He(e,a.treeForkCount),e.child}t=t.sibling}a.tail!==null&&jt()>Au&&(e.flags|=128,i=!0,vi(a,!1),e.lanes=4194304)}else{if(!i)if(t=Mu(n),t!==null){if(e.flags|=128,i=!0,t=t.updateQueue,e.updateQueue=t,Xn(e,t),vi(a,!0),a.tail===null&&a.tailMode==="hidden"&&!n.alternate&&!L)return P(e),null}else 2*jt()-a.renderingStartTime>Au&&l!==536870912&&(e.flags|=128,i=!0,vi(a,!1),e.lanes=4194304);a.isBackwards?(n.sibling=e.child,e.child=n):(t=a.last,t!==null?t.sibling=n:e.child=n,a.last=n)}return a.tail!==null?(t=a.tail,a.rendering=t,a.tail=t.sibling,a.renderingStartTime=jt(),t.sibling=null,l=nt.current,k(nt,i?l&1|2:l&1),L&&He(e,a.treeForkCount),t):(P(e),null);case 22:case 23:return Lt(e),Cc(),a=e.memoizedState!==null,t!==null?t.memoizedState!==null!==a&&(e.flags|=8192):a&&(e.flags|=8192),a?(l&536870912)!==0&&(e.flags&128)===0&&(P(e),e.subtreeFlags&6&&(e.flags|=8192)):P(e),l=e.updateQueue,l!==null&&Xn(e,l.retryQueue),l=null,t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(l=t.memoizedState.cachePool.pool),a=null,e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),a!==l&&(e.flags|=2048),t!==null&&vt(Vl),null;case 24:return l=null,t!==null&&(l=t.memoizedState.cache),e.memoizedState.cache!==l&&(e.flags|=2048),we(ct),P(e),null;case 25:return null;case 30:return null}throw Error(g(156,e.tag))}function Jv(t,e){switch(xc(e),e.tag){case 1:return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return we(ct),Ya(),t=e.flags,(t&65536)!==0&&(t&128)===0?(e.flags=t&-65537|128,e):null;case 26:case 27:case 5:return fu(e),null;case 31:if(e.memoizedState!==null){if(Lt(e),e.alternate===null)throw Error(g(340));Fl()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 13:if(Lt(e),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(g(340));Fl()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return vt(nt),null;case 4:return Ya(),null;case 10:return we(e.type),null;case 22:case 23:return Lt(e),Cc(),t!==null&&vt(Vl),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 24:return we(ct),null;case 25:return null;default:return null}}function _h(t,e){switch(xc(e),e.tag){case 3:we(ct),Ya();break;case 26:case 27:case 5:fu(e);break;case 4:Ya();break;case 31:e.memoizedState!==null&&Lt(e);break;case 13:Lt(e);break;case 19:vt(nt);break;case 10:we(e.type);break;case 22:case 23:Lt(e),Cc(),t!==null&&vt(Vl);break;case 24:we(ct)}}function rn(t,e){try{var l=e.updateQueue,a=l!==null?l.lastEffect:null;if(a!==null){var i=a.next;l=i;do{if((l.tag&t)===t){a=void 0;var n=l.create,u=l.inst;a=n(),u.destroy=a}l=l.next}while(l!==i)}}catch(s){Z(e,e.return,s)}}function Al(t,e,l){try{var a=e.updateQueue,i=a!==null?a.lastEffect:null;if(i!==null){var n=i.next;a=n;do{if((a.tag&t)===t){var u=a.inst,s=u.destroy;if(s!==void 0){u.destroy=void 0,i=e;var r=l,o=s;try{o()}catch(h){Z(i,r,h)}}}a=a.next}while(a!==n)}}catch(h){Z(e,e.return,h)}}function Rh(t){var e=t.updateQueue;if(e!==null){var l=t.stateNode;try{Lm(e,l)}catch(a){Z(t,t.return,a)}}}function Dh(t,e,l){l.props=$l(t.type,t.memoizedProps),l.state=t.memoizedState;try{l.componentWillUnmount()}catch(a){Z(t,e,a)}}function Hi(t,e){try{var l=t.ref;if(l!==null){switch(t.tag){case 26:case 27:case 5:var a=t.stateNode;break;case 30:a=t.stateNode;break;default:a=t.stateNode}typeof l=="function"?t.refCleanup=l(a):l.current=a}}catch(i){Z(t,e,i)}}function ve(t,e){var l=t.ref,a=t.refCleanup;if(l!==null)if(typeof a=="function")try{a()}catch(i){Z(t,e,i)}finally{t.refCleanup=null,t=t.alternate,t!=null&&(t.refCleanup=null)}else if(typeof l=="function")try{l(null)}catch(i){Z(t,e,i)}else l.current=null}function Oh(t){var e=t.type,l=t.memoizedProps,a=t.stateNode;try{t:switch(e){case"button":case"input":case"select":case"textarea":l.autoFocus&&a.focus();break t;case"img":l.src?a.src=l.src:l.srcSet&&(a.srcset=l.srcSet)}}catch(i){Z(t,t.return,i)}}function lr(t,e,l){try{var a=t.stateNode;m1(a,t.type,l,e),a[Ut]=e}catch(i){Z(t,t.return,i)}}function Nh(t){return t.tag===5||t.tag===3||t.tag===26||t.tag===27&&_l(t.type)||t.tag===4}function ar(t){t:for(;;){for(;t.sibling===null;){if(t.return===null||Nh(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.tag===27&&_l(t.type)||t.flags&2||t.child===null||t.tag===4)continue t;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function Vr(t,e,l){var a=t.tag;if(a===5||a===6)t=t.stateNode,e?(l.nodeType===9?l.body:l.nodeName==="HTML"?l.ownerDocument.body:l).insertBefore(t,e):(e=l.nodeType===9?l.body:l.nodeName==="HTML"?l.ownerDocument.body:l,e.appendChild(t),l=l._reactRootContainer,l!=null||e.onclick!==null||(e.onclick=Ye));else if(a!==4&&(a===27&&_l(t.type)&&(l=t.stateNode,e=null),t=t.child,t!==null))for(Vr(t,e,l),t=t.sibling;t!==null;)Vr(t,e,l),t=t.sibling}function Gu(t,e,l){var a=t.tag;if(a===5||a===6)t=t.stateNode,e?l.insertBefore(t,e):l.appendChild(t);else if(a!==4&&(a===27&&_l(t.type)&&(l=t.stateNode),t=t.child,t!==null))for(Gu(t,e,l),t=t.sibling;t!==null;)Gu(t,e,l),t=t.sibling}function Hh(t){var e=t.stateNode,l=t.memoizedProps;try{for(var a=t.type,i=e.attributes;i.length;)e.removeAttributeNode(i[0]);xt(e,a,l),e[Mt]=t,e[Ut]=l}catch(n){Z(t,t.return,n)}}var Ue=!1,rt=!1,ir=!1,md=typeof WeakSet=="function"?WeakSet:Set,yt=null;function Fv(t,e){if(t=t.containerInfo,$r=Bu,t=Sm(t),gc(t)){if("selectionStart"in t)var l={start:t.selectionStart,end:t.selectionEnd};else t:{l=(l=t.ownerDocument)&&l.defaultView||window;var a=l.getSelection&&l.getSelection();if(a&&a.rangeCount!==0){l=a.anchorNode;var i=a.anchorOffset,n=a.focusNode;a=a.focusOffset;try{l.nodeType,n.nodeType}catch{l=null;break t}var u=0,s=-1,r=-1,o=0,h=0,p=t,d=null;e:for(;;){for(var y;p!==l||i!==0&&p.nodeType!==3||(s=u+i),p!==n||a!==0&&p.nodeType!==3||(r=u+a),p.nodeType===3&&(u+=p.nodeValue.length),(y=p.firstChild)!==null;)d=p,p=y;for(;;){if(p===t)break e;if(d===l&&++o===i&&(s=u),d===n&&++h===a&&(r=u),(y=p.nextSibling)!==null)break;p=d,d=p.parentNode}p=y}l=s===-1||r===-1?null:{start:s,end:r}}else l=null}l=l||{start:0,end:0}}else l=null;for(Ir={focusedElem:t,selectionRange:l},Bu=!1,yt=e;yt!==null;)if(e=yt,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,yt=t;else for(;yt!==null;){switch(e=yt,n=e.alternate,t=e.flags,e.tag){case 0:if((t&4)!==0&&(t=e.updateQueue,t=t!==null?t.events:null,t!==null))for(l=0;l<t.length;l++)i=t[l],i.ref.impl=i.nextImpl;break;case 11:case 15:break;case 1:if((t&1024)!==0&&n!==null){t=void 0,l=e,i=n.memoizedProps,n=n.memoizedState,a=l.stateNode;try{var M=$l(l.type,i);t=a.getSnapshotBeforeUpdate(M,n),a.__reactInternalSnapshotBeforeUpdate=t}catch(x){Z(l,l.return,x)}}break;case 3:if((t&1024)!==0){if(t=e.stateNode.containerInfo,l=t.nodeType,l===9)ec(t);else if(l===1)switch(t.nodeName){case"HEAD":case"HTML":case"BODY":ec(t);break;default:t.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((t&1024)!==0)throw Error(g(163))}if(t=e.sibling,t!==null){t.return=e.return,yt=t;break}yt=e.return}}function Uh(t,e,l){var a=l.flags;switch(l.tag){case 0:case 11:case 15:Oe(t,l),a&4&&rn(5,l);break;case 1:if(Oe(t,l),a&4)if(t=l.stateNode,e===null)try{t.componentDidMount()}catch(u){Z(l,l.return,u)}else{var i=$l(l.type,e.memoizedProps);e=e.memoizedState;try{t.componentDidUpdate(i,e,t.__reactInternalSnapshotBeforeUpdate)}catch(u){Z(l,l.return,u)}}a&64&&Rh(l),a&512&&Hi(l,l.return);break;case 3:if(Oe(t,l),a&64&&(t=l.updateQueue,t!==null)){if(e=null,l.child!==null)switch(l.child.tag){case 27:case 5:e=l.child.stateNode;break;case 1:e=l.child.stateNode}try{Lm(t,e)}catch(u){Z(l,l.return,u)}}break;case 27:e===null&&a&4&&Hh(l);case 26:case 5:Oe(t,l),e===null&&a&4&&Oh(l),a&512&&Hi(l,l.return);break;case 12:Oe(t,l);break;case 31:Oe(t,l),a&4&&qh(t,l);break;case 13:Oe(t,l),a&4&&Lh(t,l),a&64&&(t=l.memoizedState,t!==null&&(t=t.dehydrated,t!==null&&(l=a1.bind(null,l),S1(t,l))));break;case 22:if(a=l.memoizedState!==null||Ue,!a){e=e!==null&&e.memoizedState!==null||rt,i=Ue;var n=rt;Ue=a,(rt=e)&&!n?Ne(t,l,(l.subtreeFlags&8772)!==0):Oe(t,l),Ue=i,rt=n}break;case 30:break;default:Oe(t,l)}}function Bh(t){var e=t.alternate;e!==null&&(t.alternate=null,Bh(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&dc(e)),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}var et=null,Ot=!1;function De(t,e,l){for(l=l.child;l!==null;)Yh(t,e,l),l=l.sibling}function Yh(t,e,l){if(Qt&&typeof Qt.onCommitFiberUnmount=="function")try{Qt.onCommitFiberUnmount(tn,l)}catch{}switch(l.tag){case 26:rt||ve(l,e),De(t,e,l),l.memoizedState?l.memoizedState.count--:l.stateNode&&(l=l.stateNode,l.parentNode.removeChild(l));break;case 27:rt||ve(l,e);var a=et,i=Ot;_l(l.type)&&(et=l.stateNode,Ot=!1),De(t,e,l),qi(l.stateNode),et=a,Ot=i;break;case 5:rt||ve(l,e);case 6:if(a=et,i=Ot,et=null,De(t,e,l),et=a,Ot=i,et!==null)if(Ot)try{(et.nodeType===9?et.body:et.nodeName==="HTML"?et.ownerDocument.body:et).removeChild(l.stateNode)}catch(n){Z(l,e,n)}else try{et.removeChild(l.stateNode)}catch(n){Z(l,e,n)}break;case 18:et!==null&&(Ot?(t=et,Cd(t.nodeType===9?t.body:t.nodeName==="HTML"?t.ownerDocument.body:t,l.stateNode),Ja(t)):Cd(et,l.stateNode));break;case 4:a=et,i=Ot,et=l.stateNode.containerInfo,Ot=!0,De(t,e,l),et=a,Ot=i;break;case 0:case 11:case 14:case 15:Al(2,l,e),rt||Al(4,l,e),De(t,e,l);break;case 1:rt||(ve(l,e),a=l.stateNode,typeof a.componentWillUnmount=="function"&&Dh(l,e,a)),De(t,e,l);break;case 21:De(t,e,l);break;case 22:rt=(a=rt)||l.memoizedState!==null,De(t,e,l),rt=a;break;default:De(t,e,l)}}function qh(t,e){if(e.memoizedState===null&&(t=e.alternate,t!==null&&(t=t.memoizedState,t!==null))){t=t.dehydrated;try{Ja(t)}catch(l){Z(e,e.return,l)}}}function Lh(t,e){if(e.memoizedState===null&&(t=e.alternate,t!==null&&(t=t.memoizedState,t!==null&&(t=t.dehydrated,t!==null))))try{Ja(t)}catch(l){Z(e,e.return,l)}}function kv(t){switch(t.tag){case 31:case 13:case 19:var e=t.stateNode;return e===null&&(e=t.stateNode=new md),e;case 22:return t=t.stateNode,e=t._retryCache,e===null&&(e=t._retryCache=new md),e;default:throw Error(g(435,t.tag))}}function jn(t,e){var l=kv(t);e.forEach(function(a){if(!l.has(a)){l.add(a);var i=i1.bind(null,t,a);a.then(i,i)}})}function Rt(t,e){var l=e.deletions;if(l!==null)for(var a=0;a<l.length;a++){var i=l[a],n=t,u=e,s=u;t:for(;s!==null;){switch(s.tag){case 27:if(_l(s.type)){et=s.stateNode,Ot=!1;break t}break;case 5:et=s.stateNode,Ot=!1;break t;case 3:case 4:et=s.stateNode.containerInfo,Ot=!0;break t}s=s.return}if(et===null)throw Error(g(160));Yh(n,u,i),et=null,Ot=!1,n=i.alternate,n!==null&&(n.return=null),i.return=null}if(e.subtreeFlags&13886)for(e=e.child;e!==null;)wh(e,t),e=e.sibling}var fe=null;function wh(t,e){var l=t.alternate,a=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:Rt(e,t),Dt(t),a&4&&(Al(3,t,t.return),rn(3,t),Al(5,t,t.return));break;case 1:Rt(e,t),Dt(t),a&512&&(rt||l===null||ve(l,l.return)),a&64&&Ue&&(t=t.updateQueue,t!==null&&(a=t.callbacks,a!==null&&(l=t.shared.hiddenCallbacks,t.shared.hiddenCallbacks=l===null?a:l.concat(a))));break;case 26:var i=fe;if(Rt(e,t),Dt(t),a&512&&(rt||l===null||ve(l,l.return)),a&4){var n=l!==null?l.memoizedState:null;if(a=t.memoizedState,l===null)if(a===null)if(t.stateNode===null){t:{a=t.type,l=t.memoizedProps,i=i.ownerDocument||i;e:switch(a){case"title":n=i.getElementsByTagName("title")[0],(!n||n[an]||n[Mt]||n.namespaceURI==="http://www.w3.org/2000/svg"||n.hasAttribute("itemprop"))&&(n=i.createElement(a),i.head.insertBefore(n,i.querySelector("head > title"))),xt(n,a,l),n[Mt]=t,pt(n),a=n;break t;case"link":var u=Ud("link","href",i).get(a+(l.href||""));if(u){for(var s=0;s<u.length;s++)if(n=u[s],n.getAttribute("href")===(l.href==null||l.href===""?null:l.href)&&n.getAttribute("rel")===(l.rel==null?null:l.rel)&&n.getAttribute("title")===(l.title==null?null:l.title)&&n.getAttribute("crossorigin")===(l.crossOrigin==null?null:l.crossOrigin)){u.splice(s,1);break e}}n=i.createElement(a),xt(n,a,l),i.head.appendChild(n);break;case"meta":if(u=Ud("meta","content",i).get(a+(l.content||""))){for(s=0;s<u.length;s++)if(n=u[s],n.getAttribute("content")===(l.content==null?null:""+l.content)&&n.getAttribute("name")===(l.name==null?null:l.name)&&n.getAttribute("property")===(l.property==null?null:l.property)&&n.getAttribute("http-equiv")===(l.httpEquiv==null?null:l.httpEquiv)&&n.getAttribute("charset")===(l.charSet==null?null:l.charSet)){u.splice(s,1);break e}}n=i.createElement(a),xt(n,a,l),i.head.appendChild(n);break;default:throw Error(g(468,a))}n[Mt]=t,pt(n),a=n}t.stateNode=a}else Bd(i,t.type,t.stateNode);else t.stateNode=Hd(i,a,t.memoizedProps);else n!==a?(n===null?l.stateNode!==null&&(l=l.stateNode,l.parentNode.removeChild(l)):n.count--,a===null?Bd(i,t.type,t.stateNode):Hd(i,a,t.memoizedProps)):a===null&&t.stateNode!==null&&lr(t,t.memoizedProps,l.memoizedProps)}break;case 27:Rt(e,t),Dt(t),a&512&&(rt||l===null||ve(l,l.return)),l!==null&&a&4&&lr(t,t.memoizedProps,l.memoizedProps);break;case 5:if(Rt(e,t),Dt(t),a&512&&(rt||l===null||ve(l,l.return)),t.flags&32){i=t.stateNode;try{La(i,"")}catch(M){Z(t,t.return,M)}}a&4&&t.stateNode!=null&&(i=t.memoizedProps,lr(t,i,l!==null?l.memoizedProps:i)),a&1024&&(ir=!0);break;case 6:if(Rt(e,t),Dt(t),a&4){if(t.stateNode===null)throw Error(g(162));a=t.memoizedProps,l=t.stateNode;try{l.nodeValue=a}catch(M){Z(t,t.return,M)}}break;case 3:if(uu=null,i=fe,fe=Nu(e.containerInfo),Rt(e,t),fe=i,Dt(t),a&4&&l!==null&&l.memoizedState.isDehydrated)try{Ja(e.containerInfo)}catch(M){Z(t,t.return,M)}ir&&(ir=!1,Xh(t));break;case 4:a=fe,fe=Nu(t.stateNode.containerInfo),Rt(e,t),Dt(t),fe=a;break;case 12:Rt(e,t),Dt(t);break;case 31:Rt(e,t),Dt(t),a&4&&(a=t.updateQueue,a!==null&&(t.updateQueue=null,jn(t,a)));break;case 13:Rt(e,t),Dt(t),t.child.flags&8192&&t.memoizedState!==null!=(l!==null&&l.memoizedState!==null)&&(ku=jt()),a&4&&(a=t.updateQueue,a!==null&&(t.updateQueue=null,jn(t,a)));break;case 22:i=t.memoizedState!==null;var r=l!==null&&l.memoizedState!==null,o=Ue,h=rt;if(Ue=o||i,rt=h||r,Rt(e,t),rt=h,Ue=o,Dt(t),a&8192)t:for(e=t.stateNode,e._visibility=i?e._visibility&-2:e._visibility|1,i&&(l===null||r||Ue||rt||jl(t)),l=null,e=t;;){if(e.tag===5||e.tag===26){if(l===null){r=l=e;try{if(n=r.stateNode,i)u=n.style,typeof u.setProperty=="function"?u.setProperty("display","none","important"):u.display="none";else{s=r.stateNode;var p=r.memoizedProps.style,d=p!=null&&p.hasOwnProperty("display")?p.display:null;s.style.display=d==null||typeof d=="boolean"?"":(""+d).trim()}}catch(M){Z(r,r.return,M)}}}else if(e.tag===6){if(l===null){r=e;try{r.stateNode.nodeValue=i?"":r.memoizedProps}catch(M){Z(r,r.return,M)}}}else if(e.tag===18){if(l===null){r=e;try{var y=r.stateNode;i?_d(y,!0):_d(r.stateNode,!1)}catch(M){Z(r,r.return,M)}}}else if((e.tag!==22&&e.tag!==23||e.memoizedState===null||e===t)&&e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break t;for(;e.sibling===null;){if(e.return===null||e.return===t)break t;l===e&&(l=null),e=e.return}l===e&&(l=null),e.sibling.return=e.return,e=e.sibling}a&4&&(a=t.updateQueue,a!==null&&(l=a.retryQueue,l!==null&&(a.retryQueue=null,jn(t,l))));break;case 19:Rt(e,t),Dt(t),a&4&&(a=t.updateQueue,a!==null&&(t.updateQueue=null,jn(t,a)));break;case 30:break;case 21:break;default:Rt(e,t),Dt(t)}}function Dt(t){var e=t.flags;if(e&2){try{for(var l,a=t.return;a!==null;){if(Nh(a)){l=a;break}a=a.return}if(l==null)throw Error(g(160));switch(l.tag){case 27:var i=l.stateNode,n=ar(t);Gu(t,n,i);break;case 5:var u=l.stateNode;l.flags&32&&(La(u,""),l.flags&=-33);var s=ar(t);Gu(t,s,u);break;case 3:case 4:var r=l.stateNode.containerInfo,o=ar(t);Vr(t,o,r);break;default:throw Error(g(161))}}catch(h){Z(t,t.return,h)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function Xh(t){if(t.subtreeFlags&1024)for(t=t.child;t!==null;){var e=t;Xh(e),e.tag===5&&e.flags&1024&&e.stateNode.reset(),t=t.sibling}}function Oe(t,e){if(e.subtreeFlags&8772)for(e=e.child;e!==null;)Uh(t,e.alternate,e),e=e.sibling}function jl(t){for(t=t.child;t!==null;){var e=t;switch(e.tag){case 0:case 11:case 14:case 15:Al(4,e,e.return),jl(e);break;case 1:ve(e,e.return);var l=e.stateNode;typeof l.componentWillUnmount=="function"&&Dh(e,e.return,l),jl(e);break;case 27:qi(e.stateNode);case 26:case 5:ve(e,e.return),jl(e);break;case 22:e.memoizedState===null&&jl(e);break;case 30:jl(e);break;default:jl(e)}t=t.sibling}}function Ne(t,e,l){for(l=l&&(e.subtreeFlags&8772)!==0,e=e.child;e!==null;){var a=e.alternate,i=t,n=e,u=n.flags;switch(n.tag){case 0:case 11:case 15:Ne(i,n,l),rn(4,n);break;case 1:if(Ne(i,n,l),a=n,i=a.stateNode,typeof i.componentDidMount=="function")try{i.componentDidMount()}catch(o){Z(a,a.return,o)}if(a=n,i=a.updateQueue,i!==null){var s=a.stateNode;try{var r=i.shared.hiddenCallbacks;if(r!==null)for(i.shared.hiddenCallbacks=null,i=0;i<r.length;i++)qm(r[i],s)}catch(o){Z(a,a.return,o)}}l&&u&64&&Rh(n),Hi(n,n.return);break;case 27:Hh(n);case 26:case 5:Ne(i,n,l),l&&a===null&&u&4&&Oh(n),Hi(n,n.return);break;case 12:Ne(i,n,l);break;case 31:Ne(i,n,l),l&&u&4&&qh(i,n);break;case 13:Ne(i,n,l),l&&u&4&&Lh(i,n);break;case 22:n.memoizedState===null&&Ne(i,n,l),Hi(n,n.return);break;case 30:break;default:Ne(i,n,l)}e=e.sibling}}function Zc(t,e){var l=null;t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(l=t.memoizedState.cachePool.pool),t=null,e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(t=e.memoizedState.cachePool.pool),t!==l&&(t!=null&&t.refCount++,l!=null&&un(l))}function Vc(t,e){t=null,e.alternate!==null&&(t=e.alternate.memoizedState.cache),e=e.memoizedState.cache,e!==t&&(e.refCount++,t!=null&&un(t))}function oe(t,e,l,a){if(e.subtreeFlags&10256)for(e=e.child;e!==null;)jh(t,e,l,a),e=e.sibling}function jh(t,e,l,a){var i=e.flags;switch(e.tag){case 0:case 11:case 15:oe(t,e,l,a),i&2048&&rn(9,e);break;case 1:oe(t,e,l,a);break;case 3:oe(t,e,l,a),i&2048&&(t=null,e.alternate!==null&&(t=e.alternate.memoizedState.cache),e=e.memoizedState.cache,e!==t&&(e.refCount++,t!=null&&un(t)));break;case 12:if(i&2048){oe(t,e,l,a),t=e.stateNode;try{var n=e.memoizedProps,u=n.id,s=n.onPostCommit;typeof s=="function"&&s(u,e.alternate===null?"mount":"update",t.passiveEffectDuration,-0)}catch(r){Z(e,e.return,r)}}else oe(t,e,l,a);break;case 31:oe(t,e,l,a);break;case 13:oe(t,e,l,a);break;case 23:break;case 22:n=e.stateNode,u=e.alternate,e.memoizedState!==null?n._visibility&2?oe(t,e,l,a):Ui(t,e):n._visibility&2?oe(t,e,l,a):(n._visibility|=2,pa(t,e,l,a,(e.subtreeFlags&10256)!==0||!1)),i&2048&&Zc(u,e);break;case 24:oe(t,e,l,a),i&2048&&Vc(e.alternate,e);break;default:oe(t,e,l,a)}}function pa(t,e,l,a,i){for(i=i&&((e.subtreeFlags&10256)!==0||!1),e=e.child;e!==null;){var n=t,u=e,s=l,r=a,o=u.flags;switch(u.tag){case 0:case 11:case 15:pa(n,u,s,r,i),rn(8,u);break;case 23:break;case 22:var h=u.stateNode;u.memoizedState!==null?h._visibility&2?pa(n,u,s,r,i):Ui(n,u):(h._visibility|=2,pa(n,u,s,r,i)),i&&o&2048&&Zc(u.alternate,u);break;case 24:pa(n,u,s,r,i),i&&o&2048&&Vc(u.alternate,u);break;default:pa(n,u,s,r,i)}e=e.sibling}}function Ui(t,e){if(e.subtreeFlags&10256)for(e=e.child;e!==null;){var l=t,a=e,i=a.flags;switch(a.tag){case 22:Ui(l,a),i&2048&&Zc(a.alternate,a);break;case 24:Ui(l,a),i&2048&&Vc(a.alternate,a);break;default:Ui(l,a)}e=e.sibling}}var Gi=8192;function ya(t,e,l){if(t.subtreeFlags&Gi)for(t=t.child;t!==null;)Qh(t,e,l),t=t.sibling}function Qh(t,e,l){switch(t.tag){case 26:ya(t,e,l),t.flags&Gi&&t.memoizedState!==null&&N1(l,fe,t.memoizedState,t.memoizedProps);break;case 5:ya(t,e,l);break;case 3:case 4:var a=fe;fe=Nu(t.stateNode.containerInfo),ya(t,e,l),fe=a;break;case 22:t.memoizedState===null&&(a=t.alternate,a!==null&&a.memoizedState!==null?(a=Gi,Gi=16777216,ya(t,e,l),Gi=a):ya(t,e,l));break;default:ya(t,e,l)}}function Zh(t){var e=t.alternate;if(e!==null&&(t=e.child,t!==null)){e.child=null;do e=t.sibling,t.sibling=null,t=e;while(t!==null)}}function gi(t){var e=t.deletions;if((t.flags&16)!==0){if(e!==null)for(var l=0;l<e.length;l++){var a=e[l];yt=a,Kh(a,t)}Zh(t)}if(t.subtreeFlags&10256)for(t=t.child;t!==null;)Vh(t),t=t.sibling}function Vh(t){switch(t.tag){case 0:case 11:case 15:gi(t),t.flags&2048&&Al(9,t,t.return);break;case 3:gi(t);break;case 12:gi(t);break;case 22:var e=t.stateNode;t.memoizedState!==null&&e._visibility&2&&(t.return===null||t.return.tag!==13)?(e._visibility&=-3,iu(t)):gi(t);break;default:gi(t)}}function iu(t){var e=t.deletions;if((t.flags&16)!==0){if(e!==null)for(var l=0;l<e.length;l++){var a=e[l];yt=a,Kh(a,t)}Zh(t)}for(t=t.child;t!==null;){switch(e=t,e.tag){case 0:case 11:case 15:Al(8,e,e.return),iu(e);break;case 22:l=e.stateNode,l._visibility&2&&(l._visibility&=-3,iu(e));break;default:iu(e)}t=t.sibling}}function Kh(t,e){for(;yt!==null;){var l=yt;switch(l.tag){case 0:case 11:case 15:Al(8,l,e);break;case 23:case 22:if(l.memoizedState!==null&&l.memoizedState.cachePool!==null){var a=l.memoizedState.cachePool.pool;a!=null&&a.refCount++}break;case 24:un(l.memoizedState.cache)}if(a=l.child,a!==null)a.return=l,yt=a;else t:for(l=t;yt!==null;){a=yt;var i=a.sibling,n=a.return;if(Bh(a),a===l){yt=null;break t}if(i!==null){i.return=n,yt=i;break t}yt=n}}}var Wv={getCacheForType:function(t){var e=Et(ct),l=e.data.get(t);return l===void 0&&(l=t(),e.data.set(t,l)),l},cacheSignal:function(){return Et(ct).controller.signal}},Pv=typeof WeakMap=="function"?WeakMap:Map,w=0,F=null,Y=null,q=0,Q=0,qt=null,dl=!1,$a=!1,Kc=!1,Ke=0,at=0,zl=0,Jl=0,Jc=0,Xt=0,Qa=0,Bi=null,Nt=null,Kr=!1,ku=0,Jh=0,Au=1/0,zu=null,bl=null,mt=0,Ml=null,Za=null,Xe=0,Jr=0,Fr=null,Fh=null,Yi=0,kr=null;function Vt(){return(w&2)!==0&&q!==0?q&-q:z.T!==null?kc():am()}function kh(){if(Xt===0)if((q&536870912)===0||L){var t=On;On<<=1,(On&3932160)===0&&(On=262144),Xt=t}else Xt=536870912;return t=Jt.current,t!==null&&(t.flags|=32),Xt}function Ht(t,e,l){(t===F&&(Q===2||Q===9)||t.cancelPendingCommit!==null)&&(Va(t,0),ml(t,q,Xt,!1)),ln(t,l),((w&2)===0||t!==F)&&(t===F&&((w&2)===0&&(Jl|=l),at===4&&ml(t,q,Xt,!1)),Me(t))}function Wh(t,e,l){if((w&6)!==0)throw Error(g(327));var a=!l&&(e&127)===0&&(e&t.expiredLanes)===0||en(t,e),i=a?t1(t,e):nr(t,e,!0),n=a;do{if(i===0){$a&&!a&&ml(t,e,0,!1);break}else{if(l=t.current.alternate,n&&!$v(l)){i=nr(t,e,!1),n=!1;continue}if(i===2){if(n=e,t.errorRecoveryDisabledLanes&n)var u=0;else u=t.pendingLanes&-536870913,u=u!==0?u:u&536870912?536870912:0;if(u!==0){e=u;t:{var s=t;i=Bi;var r=s.current.memoizedState.isDehydrated;if(r&&(Va(s,u).flags|=256),u=nr(s,u,!1),u!==2){if(Kc&&!r){s.errorRecoveryDisabledLanes|=n,Jl|=n,i=4;break t}n=Nt,Nt=i,n!==null&&(Nt===null?Nt=n:Nt.push.apply(Nt,n))}i=u}if(n=!1,i!==2)continue}}if(i===1){Va(t,0),ml(t,e,0,!0);break}t:{switch(a=t,n=i,n){case 0:case 1:throw Error(g(345));case 4:if((e&4194048)!==e)break;case 6:ml(a,e,Xt,!dl);break t;case 2:Nt=null;break;case 3:case 5:break;default:throw Error(g(329))}if((e&62914560)===e&&(i=ku+300-jt(),10<i)){if(ml(a,e,Xt,!dl),qu(a,0,!0)!==0)break t;Xe=e,a.timeoutHandle=py(hd.bind(null,a,l,Nt,zu,Kr,e,Xt,Jl,Qa,dl,n,"Throttled",-0,0),i);break t}hd(a,l,Nt,zu,Kr,e,Xt,Jl,Qa,dl,n,null,-0,0)}}break}while(!0);Me(t)}function hd(t,e,l,a,i,n,u,s,r,o,h,p,d,y){if(t.timeoutHandle=-1,p=e.subtreeFlags,p&8192||(p&16785408)===16785408){p={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:Ye},Qh(e,n,p);var M=(n&62914560)===n?ku-jt():(n&4194048)===n?Jh-jt():0;if(M=H1(p,M),M!==null){Xe=n,t.cancelPendingCommit=M(pd.bind(null,t,e,n,l,a,i,u,s,r,h,p,null,d,y)),ml(t,n,u,!o);return}}pd(t,e,n,l,a,i,u,s,r)}function $v(t){for(var e=t;;){var l=e.tag;if((l===0||l===11||l===15)&&e.flags&16384&&(l=e.updateQueue,l!==null&&(l=l.stores,l!==null)))for(var a=0;a<l.length;a++){var i=l[a],n=i.getSnapshot;i=i.value;try{if(!Kt(n(),i))return!1}catch{return!1}}if(l=e.child,e.subtreeFlags&16384&&l!==null)l.return=e,e=l;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function ml(t,e,l,a){e&=~Jc,e&=~Jl,t.suspendedLanes|=e,t.pingedLanes&=~e,a&&(t.warmLanes|=e),a=t.expirationTimes;for(var i=e;0<i;){var n=31-Zt(i),u=1<<n;a[n]=-1,i&=~u}l!==0&&tm(t,l,e)}function Wu(){return(w&6)===0?(cn(0,!1),!1):!0}function Fc(){if(Y!==null){if(Q===0)var t=Y.return;else t=Y,qe=aa=null,Nc(t),Ha=null,Vi=0,t=Y;for(;t!==null;)_h(t.alternate,t),t=t.return;Y=null}}function Va(t,e){var l=t.timeoutHandle;l!==-1&&(t.timeoutHandle=-1,p1(l)),l=t.cancelPendingCommit,l!==null&&(t.cancelPendingCommit=null,l()),Xe=0,Fc(),F=t,Y=l=Le(t.current,null),q=e,Q=0,qt=null,dl=!1,$a=en(t,e),Kc=!1,Qa=Xt=Jc=Jl=zl=at=0,Nt=Bi=null,Kr=!1,(e&8)!==0&&(e|=e&32);var a=t.entangledLanes;if(a!==0)for(t=t.entanglements,a&=e;0<a;){var i=31-Zt(a),n=1<<i;e|=t[i],a&=~n}return Ke=e,ju(),l}function Ph(t,e){O=null,z.H=Ji,e===Pa||e===Zu?(e=Kf(),Q=3):e===Ac?(e=Kf(),Q=4):Q=e===jc?8:e!==null&&typeof e=="object"&&typeof e.then=="function"?6:1,qt=e,Y===null&&(at=1,xu(t,ie(e,t.current)))}function $h(){var t=Jt.current;return t===null?!0:(q&4194048)===q?ue===null:(q&62914560)===q||(q&536870912)!==0?t===ue:!1}function Ih(){var t=z.H;return z.H=Ji,t===null?Ji:t}function ty(){var t=z.A;return z.A=Wv,t}function Cu(){at=4,dl||(q&4194048)!==q&&Jt.current!==null||($a=!0),(zl&134217727)===0&&(Jl&134217727)===0||F===null||ml(F,q,Xt,!1)}function nr(t,e,l){var a=w;w|=2;var i=Ih(),n=ty();(F!==t||q!==e)&&(zu=null,Va(t,e)),e=!1;var u=at;t:do try{if(Q!==0&&Y!==null){var s=Y,r=qt;switch(Q){case 8:Fc(),u=6;break t;case 3:case 2:case 9:case 6:Jt.current===null&&(e=!0);var o=Q;if(Q=0,qt=null,_a(t,s,r,o),l&&$a){u=0;break t}break;default:o=Q,Q=0,qt=null,_a(t,s,r,o)}}Iv(),u=at;break}catch(h){Ph(t,h)}while(!0);return e&&t.shellSuspendCounter++,qe=aa=null,w=a,z.H=i,z.A=n,Y===null&&(F=null,q=0,ju()),u}function Iv(){for(;Y!==null;)ey(Y)}function t1(t,e){var l=w;w|=2;var a=Ih(),i=ty();F!==t||q!==e?(zu=null,Au=jt()+500,Va(t,e)):$a=en(t,e);t:do try{if(Q!==0&&Y!==null){e=Y;var n=qt;e:switch(Q){case 1:Q=0,qt=null,_a(t,e,n,1);break;case 2:case 9:if(Vf(n)){Q=0,qt=null,yd(e);break}e=function(){Q!==2&&Q!==9||F!==t||(Q=7),Me(t)},n.then(e,e);break t;case 3:Q=7;break t;case 4:Q=5;break t;case 7:Vf(n)?(Q=0,qt=null,yd(e)):(Q=0,qt=null,_a(t,e,n,7));break;case 5:var u=null;switch(Y.tag){case 26:u=Y.memoizedState;case 5:case 27:var s=Y;if(u?Sy(u):s.stateNode.complete){Q=0,qt=null;var r=s.sibling;if(r!==null)Y=r;else{var o=s.return;o!==null?(Y=o,Pu(o)):Y=null}break e}}Q=0,qt=null,_a(t,e,n,5);break;case 6:Q=0,qt=null,_a(t,e,n,6);break;case 8:Fc(),at=6;break t;default:throw Error(g(462))}}e1();break}catch(h){Ph(t,h)}while(!0);return qe=aa=null,z.H=a,z.A=i,w=l,Y!==null?0:(F=null,q=0,ju(),at)}function e1(){for(;Y!==null&&!T0();)ey(Y)}function ey(t){var e=Ch(t.alternate,t,Ke);t.memoizedProps=t.pendingProps,e===null?Pu(t):Y=e}function yd(t){var e=t,l=e.alternate;switch(e.tag){case 15:case 0:e=rd(l,e,e.pendingProps,e.type,void 0,q);break;case 11:e=rd(l,e,e.pendingProps,e.type.render,e.ref,q);break;case 5:Nc(e);default:_h(l,e),e=Y=_m(e,Ke),e=Ch(l,e,Ke)}t.memoizedProps=t.pendingProps,e===null?Pu(t):Y=e}function _a(t,e,l,a){qe=aa=null,Nc(e),Ha=null,Vi=0;var i=e.return;try{if(Qv(t,i,e,l,q)){at=1,xu(t,ie(l,t.current)),Y=null;return}}catch(n){if(i!==null)throw Y=i,n;at=1,xu(t,ie(l,t.current)),Y=null;return}e.flags&32768?(L||a===1?t=!0:$a||(q&536870912)!==0?t=!1:(dl=t=!0,(a===2||a===9||a===3||a===6)&&(a=Jt.current,a!==null&&a.tag===13&&(a.flags|=16384))),ly(e,t)):Pu(e)}function Pu(t){var e=t;do{if((e.flags&32768)!==0){ly(e,dl);return}t=e.return;var l=Kv(e.alternate,e,Ke);if(l!==null){Y=l;return}if(e=e.sibling,e!==null){Y=e;return}Y=e=t}while(e!==null);at===0&&(at=5)}function ly(t,e){do{var l=Jv(t.alternate,t);if(l!==null){l.flags&=32767,Y=l;return}if(l=t.return,l!==null&&(l.flags|=32768,l.subtreeFlags=0,l.deletions=null),!e&&(t=t.sibling,t!==null)){Y=t;return}Y=t=l}while(t!==null);at=6,Y=null}function pd(t,e,l,a,i,n,u,s,r){t.cancelPendingCommit=null;do $u();while(mt!==0);if((w&6)!==0)throw Error(g(327));if(e!==null){if(e===t.current)throw Error(g(177));if(n=e.lanes|e.childLanes,n|=bc,H0(t,l,n,u,s,r),t===F&&(Y=F=null,q=0),Za=e,Ml=t,Xe=l,Jr=n,Fr=i,Fh=a,(e.subtreeFlags&10256)!==0||(e.flags&10256)!==0?(t.callbackNode=null,t.callbackPriority=0,n1(du,function(){return sy(),null})):(t.callbackNode=null,t.callbackPriority=0),a=(e.flags&13878)!==0,(e.subtreeFlags&13878)!==0||a){a=z.T,z.T=null,i=X.p,X.p=2,u=w,w|=4;try{Fv(t,e,l)}finally{w=u,X.p=i,z.T=a}}mt=1,ay(),iy(),ny()}}function ay(){if(mt===1){mt=0;var t=Ml,e=Za,l=(e.flags&13878)!==0;if((e.subtreeFlags&13878)!==0||l){l=z.T,z.T=null;var a=X.p;X.p=2;var i=w;w|=4;try{wh(e,t);var n=Ir,u=Sm(t.containerInfo),s=n.focusedElem,r=n.selectionRange;if(u!==s&&s&&s.ownerDocument&&Mm(s.ownerDocument.documentElement,s)){if(r!==null&&gc(s)){var o=r.start,h=r.end;if(h===void 0&&(h=o),"selectionStart"in s)s.selectionStart=o,s.selectionEnd=Math.min(h,s.value.length);else{var p=s.ownerDocument||document,d=p&&p.defaultView||window;if(d.getSelection){var y=d.getSelection(),M=s.textContent.length,x=Math.min(r.start,M),U=r.end===void 0?x:Math.min(r.end,M);!y.extend&&x>U&&(u=U,U=x,x=u);var f=qf(s,x),c=qf(s,U);if(f&&c&&(y.rangeCount!==1||y.anchorNode!==f.node||y.anchorOffset!==f.offset||y.focusNode!==c.node||y.focusOffset!==c.offset)){var m=p.createRange();m.setStart(f.node,f.offset),y.removeAllRanges(),x>U?(y.addRange(m),y.extend(c.node,c.offset)):(m.setEnd(c.node,c.offset),y.addRange(m))}}}}for(p=[],y=s;y=y.parentNode;)y.nodeType===1&&p.push({element:y,left:y.scrollLeft,top:y.scrollTop});for(typeof s.focus=="function"&&s.focus(),s=0;s<p.length;s++){var v=p[s];v.element.scrollLeft=v.left,v.element.scrollTop=v.top}}Bu=!!$r,Ir=$r=null}finally{w=i,X.p=a,z.T=l}}t.current=e,mt=2}}function iy(){if(mt===2){mt=0;var t=Ml,e=Za,l=(e.flags&8772)!==0;if((e.subtreeFlags&8772)!==0||l){l=z.T,z.T=null;var a=X.p;X.p=2;var i=w;w|=4;try{Uh(t,e.alternate,e)}finally{w=i,X.p=a,z.T=l}}mt=3}}function ny(){if(mt===4||mt===3){mt=0,G0();var t=Ml,e=Za,l=Xe,a=Fh;(e.subtreeFlags&10256)!==0||(e.flags&10256)!==0?mt=5:(mt=0,Za=Ml=null,uy(t,t.pendingLanes));var i=t.pendingLanes;if(i===0&&(bl=null),fc(l),e=e.stateNode,Qt&&typeof Qt.onCommitFiberRoot=="function")try{Qt.onCommitFiberRoot(tn,e,void 0,(e.current.flags&128)===128)}catch{}if(a!==null){e=z.T,i=X.p,X.p=2,z.T=null;try{for(var n=t.onRecoverableError,u=0;u<a.length;u++){var s=a[u];n(s.value,{componentStack:s.stack})}}finally{z.T=e,X.p=i}}(Xe&3)!==0&&$u(),Me(t),i=t.pendingLanes,(l&261930)!==0&&(i&42)!==0?t===kr?Yi++:(Yi=0,kr=t):Yi=0,cn(0,!1)}}function uy(t,e){(t.pooledCacheLanes&=e)===0&&(e=t.pooledCache,e!=null&&(t.pooledCache=null,un(e)))}function $u(){return ay(),iy(),ny(),sy()}function sy(){if(mt!==5)return!1;var t=Ml,e=Jr;Jr=0;var l=fc(Xe),a=z.T,i=X.p;try{X.p=32>l?32:l,z.T=null,l=Fr,Fr=null;var n=Ml,u=Xe;if(mt=0,Za=Ml=null,Xe=0,(w&6)!==0)throw Error(g(331));var s=w;if(w|=4,Vh(n.current),jh(n,n.current,u,l),w=s,cn(0,!1),Qt&&typeof Qt.onPostCommitFiberRoot=="function")try{Qt.onPostCommitFiberRoot(tn,n)}catch{}return!0}finally{X.p=i,z.T=a,uy(t,e)}}function vd(t,e,l){e=ie(l,e),e=jr(t.stateNode,e,2),t=gl(t,e,2),t!==null&&(ln(t,2),Me(t))}function Z(t,e,l){if(t.tag===3)vd(t,t,l);else for(;e!==null;){if(e.tag===3){vd(e,t,l);break}else if(e.tag===1){var a=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof a.componentDidCatch=="function"&&(bl===null||!bl.has(a))){t=ie(l,t),l=Eh(2),a=gl(e,l,2),a!==null&&(xh(l,a,e,t),ln(a,2),Me(a));break}}e=e.return}}function ur(t,e,l){var a=t.pingCache;if(a===null){a=t.pingCache=new Pv;var i=new Set;a.set(e,i)}else i=a.get(e),i===void 0&&(i=new Set,a.set(e,i));i.has(l)||(Kc=!0,i.add(l),t=l1.bind(null,t,e,l),e.then(t,t))}function l1(t,e,l){var a=t.pingCache;a!==null&&a.delete(e),t.pingedLanes|=t.suspendedLanes&l,t.warmLanes&=~l,F===t&&(q&l)===l&&(at===4||at===3&&(q&62914560)===q&&300>jt()-ku?(w&2)===0&&Va(t,0):Jc|=l,Qa===q&&(Qa=0)),Me(t)}function ry(t,e){e===0&&(e=Id()),t=la(t,e),t!==null&&(ln(t,e),Me(t))}function a1(t){var e=t.memoizedState,l=0;e!==null&&(l=e.retryLane),ry(t,l)}function i1(t,e){var l=0;switch(t.tag){case 31:case 13:var a=t.stateNode,i=t.memoizedState;i!==null&&(l=i.retryLane);break;case 19:a=t.stateNode;break;case 22:a=t.stateNode._retryCache;break;default:throw Error(g(314))}a!==null&&a.delete(e),ry(t,l)}function n1(t,e){return cc(t,e)}var _u=null,va=null,Wr=!1,Ru=!1,sr=!1,hl=0;function Me(t){t!==va&&t.next===null&&(va===null?_u=va=t:va=va.next=t),Ru=!0,Wr||(Wr=!0,s1())}function cn(t,e){if(!sr&&Ru){sr=!0;do for(var l=!1,a=_u;a!==null;){if(!e)if(t!==0){var i=a.pendingLanes;if(i===0)var n=0;else{var u=a.suspendedLanes,s=a.pingedLanes;n=(1<<31-Zt(42|t)+1)-1,n&=i&~(u&~s),n=n&201326741?n&201326741|1:n?n|2:0}n!==0&&(l=!0,gd(a,n))}else n=q,n=qu(a,a===F?n:0,a.cancelPendingCommit!==null||a.timeoutHandle!==-1),(n&3)===0||en(a,n)||(l=!0,gd(a,n));a=a.next}while(l);sr=!1}}function u1(){cy()}function cy(){Ru=Wr=!1;var t=0;hl!==0&&y1()&&(t=hl);for(var e=jt(),l=null,a=_u;a!==null;){var i=a.next,n=oy(a,e);n===0?(a.next=null,l===null?_u=i:l.next=i,i===null&&(va=l)):(l=a,(t!==0||(n&3)!==0)&&(Ru=!0)),a=i}mt!==0&&mt!==5||cn(t,!1),hl!==0&&(hl=0)}function oy(t,e){for(var l=t.suspendedLanes,a=t.pingedLanes,i=t.expirationTimes,n=t.pendingLanes&-62914561;0<n;){var u=31-Zt(n),s=1<<u,r=i[u];r===-1?((s&l)===0||(s&a)!==0)&&(i[u]=N0(s,e)):r<=e&&(t.expiredLanes|=s),n&=~s}if(e=F,l=q,l=qu(t,t===e?l:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),a=t.callbackNode,l===0||t===e&&(Q===2||Q===9)||t.cancelPendingCommit!==null)return a!==null&&a!==null&&Bs(a),t.callbackNode=null,t.callbackPriority=0;if((l&3)===0||en(t,l)){if(e=l&-l,e===t.callbackPriority)return e;switch(a!==null&&Bs(a),fc(l)){case 2:case 8:l=Pd;break;case 32:l=du;break;case 268435456:l=$d;break;default:l=du}return a=fy.bind(null,t),l=cc(l,a),t.callbackPriority=e,t.callbackNode=l,e}return a!==null&&a!==null&&Bs(a),t.callbackPriority=2,t.callbackNode=null,2}function fy(t,e){if(mt!==0&&mt!==5)return t.callbackNode=null,t.callbackPriority=0,null;var l=t.callbackNode;if($u()&&t.callbackNode!==l)return null;var a=q;return a=qu(t,t===F?a:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),a===0?null:(Wh(t,a,e),oy(t,jt()),t.callbackNode!=null&&t.callbackNode===l?fy.bind(null,t):null)}function gd(t,e){if($u())return null;Wh(t,e,!0)}function s1(){v1(function(){(w&6)!==0?cc(Wd,u1):cy()})}function kc(){if(hl===0){var t=wa;t===0&&(t=Dn,Dn<<=1,(Dn&261888)===0&&(Dn=256)),hl=t}return hl}function bd(t){return t==null||typeof t=="symbol"||typeof t=="boolean"?null:typeof t=="function"?t:kn(""+t)}function Md(t,e){var l=e.ownerDocument.createElement("input");return l.name=e.name,l.value=e.value,t.id&&l.setAttribute("form",t.id),e.parentNode.insertBefore(l,e),t=new FormData(t),l.parentNode.removeChild(l),t}function r1(t,e,l,a,i){if(e==="submit"&&l&&l.stateNode===i){var n=bd((i[Ut]||null).action),u=a.submitter;u&&(e=(e=u[Ut]||null)?bd(e.formAction):u.getAttribute("formAction"),e!==null&&(n=e,u=null));var s=new Lu("action","action",null,a,i);t.push({event:s,listeners:[{instance:null,listener:function(){if(a.defaultPrevented){if(hl!==0){var r=u?Md(i,u):new FormData(i);wr(l,{pending:!0,data:r,method:i.method,action:n},null,r)}}else typeof n=="function"&&(s.preventDefault(),r=u?Md(i,u):new FormData(i),wr(l,{pending:!0,data:r,method:i.method,action:n},n,r))},currentTarget:i}]})}}for(Qn=0;Qn<Cr.length;Qn++)Zn=Cr[Qn],Sd=Zn.toLowerCase(),Ed=Zn[0].toUpperCase()+Zn.slice(1),de(Sd,"on"+Ed);var Zn,Sd,Ed,Qn;de(xm,"onAnimationEnd");de(Tm,"onAnimationIteration");de(Gm,"onAnimationStart");de("dblclick","onDoubleClick");de("focusin","onFocus");de("focusout","onBlur");de(Av,"onTransitionRun");de(zv,"onTransitionStart");de(Cv,"onTransitionCancel");de(Am,"onTransitionEnd");qa("onMouseEnter",["mouseout","mouseover"]);qa("onMouseLeave",["mouseout","mouseover"]);qa("onPointerEnter",["pointerout","pointerover"]);qa("onPointerLeave",["pointerout","pointerover"]);Il("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Il("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Il("onBeforeInput",["compositionend","keypress","textInput","paste"]);Il("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Il("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Il("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Fi="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),c1=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Fi));function dy(t,e){e=(e&4)!==0;for(var l=0;l<t.length;l++){var a=t[l],i=a.event;a=a.listeners;t:{var n=void 0;if(e)for(var u=a.length-1;0<=u;u--){var s=a[u],r=s.instance,o=s.currentTarget;if(s=s.listener,r!==n&&i.isPropagationStopped())break t;n=s,i.currentTarget=o;try{n(i)}catch(h){hu(h)}i.currentTarget=null,n=r}else for(u=0;u<a.length;u++){if(s=a[u],r=s.instance,o=s.currentTarget,s=s.listener,r!==n&&i.isPropagationStopped())break t;n=s,i.currentTarget=o;try{n(i)}catch(h){hu(h)}i.currentTarget=null,n=r}}}}function B(t,e){var l=e[Mr];l===void 0&&(l=e[Mr]=new Set);var a=t+"__bubble";l.has(a)||(my(e,t,2,!1),l.add(a))}function rr(t,e,l){var a=0;e&&(a|=4),my(l,t,a,e)}var Vn="_reactListening"+Math.random().toString(36).slice(2);function Wc(t){if(!t[Vn]){t[Vn]=!0,im.forEach(function(l){l!=="selectionchange"&&(c1.has(l)||rr(l,!1,t),rr(l,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[Vn]||(e[Vn]=!0,rr("selectionchange",!1,e))}}function my(t,e,l,a){switch(Ay(e)){case 2:var i=Y1;break;case 8:i=q1;break;default:i=to}l=i.bind(null,e,l,t),i=void 0,!Gr||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(i=!0),a?i!==void 0?t.addEventListener(e,l,{capture:!0,passive:i}):t.addEventListener(e,l,!0):i!==void 0?t.addEventListener(e,l,{passive:i}):t.addEventListener(e,l,!1)}function cr(t,e,l,a,i){var n=a;if((e&1)===0&&(e&2)===0&&a!==null)t:for(;;){if(a===null)return;var u=a.tag;if(u===3||u===4){var s=a.stateNode.containerInfo;if(s===i)break;if(u===4)for(u=a.return;u!==null;){var r=u.tag;if((r===3||r===4)&&u.stateNode.containerInfo===i)return;u=u.return}for(;s!==null;){if(u=Ma(s),u===null)return;if(r=u.tag,r===5||r===6||r===26||r===27){a=n=u;continue t}s=s.parentNode}}a=a.return}dm(function(){var o=n,h=hc(l),p=[];t:{var d=zm.get(t);if(d!==void 0){var y=Lu,M=t;switch(t){case"keypress":if(Pn(l)===0)break t;case"keydown":case"keyup":y=iv;break;case"focusin":M="focus",y=Xs;break;case"focusout":M="blur",y=Xs;break;case"beforeblur":case"afterblur":y=Xs;break;case"click":if(l.button===2)break t;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":y=_f;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":y=K0;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":y=sv;break;case xm:case Tm:case Gm:y=k0;break;case Am:y=cv;break;case"scroll":case"scrollend":y=Z0;break;case"wheel":y=fv;break;case"copy":case"cut":case"paste":y=P0;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":y=Df;break;case"toggle":case"beforetoggle":y=mv}var x=(e&4)!==0,U=!x&&(t==="scroll"||t==="scrollend"),f=x?d!==null?d+"Capture":null:d;x=[];for(var c=o,m;c!==null;){var v=c;if(m=v.stateNode,v=v.tag,v!==5&&v!==26&&v!==27||m===null||f===null||(v=wi(c,f),v!=null&&x.push(ki(c,v,m))),U)break;c=c.return}0<x.length&&(d=new y(d,M,null,l,h),p.push({event:d,listeners:x}))}}if((e&7)===0){t:{if(d=t==="mouseover"||t==="pointerover",y=t==="mouseout"||t==="pointerout",d&&l!==Tr&&(M=l.relatedTarget||l.fromElement)&&(Ma(M)||M[Fa]))break t;if((y||d)&&(d=h.window===h?h:(d=h.ownerDocument)?d.defaultView||d.parentWindow:window,y?(M=l.relatedTarget||l.toElement,y=o,M=M?Ma(M):null,M!==null&&(U=Ii(M),x=M.tag,M!==U||x!==5&&x!==27&&x!==6)&&(M=null)):(y=null,M=o),y!==M)){if(x=_f,v="onMouseLeave",f="onMouseEnter",c="mouse",(t==="pointerout"||t==="pointerover")&&(x=Df,v="onPointerLeave",f="onPointerEnter",c="pointer"),U=y==null?d:xi(y),m=M==null?d:xi(M),d=new x(v,c+"leave",y,l,h),d.target=U,d.relatedTarget=m,v=null,Ma(h)===o&&(x=new x(f,c+"enter",M,l,h),x.target=m,x.relatedTarget=U,v=x),U=v,y&&M)e:{for(x=o1,f=y,c=M,m=0,v=f;v;v=x(v))m++;v=0;for(var T=c;T;T=x(T))v++;for(;0<m-v;)f=x(f),m--;for(;0<v-m;)c=x(c),v--;for(;m--;){if(f===c||c!==null&&f===c.alternate){x=f;break e}f=x(f),c=x(c)}x=null}else x=null;y!==null&&xd(p,d,y,x,!1),M!==null&&U!==null&&xd(p,U,M,x,!0)}}t:{if(d=o?xi(o):window,y=d.nodeName&&d.nodeName.toLowerCase(),y==="select"||y==="input"&&d.type==="file")var H=Uf;else if(Hf(d))if(gm)H=xv;else{H=Sv;var E=Mv}else y=d.nodeName,!y||y.toLowerCase()!=="input"||d.type!=="checkbox"&&d.type!=="radio"?o&&mc(o.elementType)&&(H=Uf):H=Ev;if(H&&(H=H(t,o))){vm(p,H,l,h);break t}E&&E(t,d,o),t==="focusout"&&o&&d.type==="number"&&o.memoizedProps.value!=null&&xr(d,"number",d.value)}switch(E=o?xi(o):window,t){case"focusin":(Hf(E)||E.contentEditable==="true")&&(xa=E,Ar=o,Ci=null);break;case"focusout":Ci=Ar=xa=null;break;case"mousedown":zr=!0;break;case"contextmenu":case"mouseup":case"dragend":zr=!1,Lf(p,l,h);break;case"selectionchange":if(Gv)break;case"keydown":case"keyup":Lf(p,l,h)}var R;if(vc)t:{switch(t){case"compositionstart":var b="onCompositionStart";break t;case"compositionend":b="onCompositionEnd";break t;case"compositionupdate":b="onCompositionUpdate";break t}b=void 0}else Ea?ym(t,l)&&(b="onCompositionEnd"):t==="keydown"&&l.keyCode===229&&(b="onCompositionStart");b&&(hm&&l.locale!=="ko"&&(Ea||b!=="onCompositionStart"?b==="onCompositionEnd"&&Ea&&(R=mm()):(fl=h,yc="value"in fl?fl.value:fl.textContent,Ea=!0)),E=Du(o,b),0<E.length&&(b=new Rf(b,t,null,l,h),p.push({event:b,listeners:E}),R?b.data=R:(R=pm(l),R!==null&&(b.data=R)))),(R=yv?pv(t,l):vv(t,l))&&(b=Du(o,"onBeforeInput"),0<b.length&&(E=new Rf("onBeforeInput","beforeinput",null,l,h),p.push({event:E,listeners:b}),E.data=R)),r1(p,t,o,l,h)}dy(p,e)})}function ki(t,e,l){return{instance:t,listener:e,currentTarget:l}}function Du(t,e){for(var l=e+"Capture",a=[];t!==null;){var i=t,n=i.stateNode;if(i=i.tag,i!==5&&i!==26&&i!==27||n===null||(i=wi(t,l),i!=null&&a.unshift(ki(t,i,n)),i=wi(t,e),i!=null&&a.push(ki(t,i,n))),t.tag===3)return a;t=t.return}return[]}function o1(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5&&t.tag!==27);return t||null}function xd(t,e,l,a,i){for(var n=e._reactName,u=[];l!==null&&l!==a;){var s=l,r=s.alternate,o=s.stateNode;if(s=s.tag,r!==null&&r===a)break;s!==5&&s!==26&&s!==27||o===null||(r=o,i?(o=wi(l,n),o!=null&&u.unshift(ki(l,o,r))):i||(o=wi(l,n),o!=null&&u.push(ki(l,o,r)))),l=l.return}u.length!==0&&t.push({event:e,listeners:u})}var f1=/\r\n?/g,d1=/\u0000|\uFFFD/g;function Td(t){return(typeof t=="string"?t:""+t).replace(f1,`
`).replace(d1,"")}function hy(t,e){return e=Td(e),Td(t)===e}function K(t,e,l,a,i,n){switch(l){case"children":typeof a=="string"?e==="body"||e==="textarea"&&a===""||La(t,a):(typeof a=="number"||typeof a=="bigint")&&e!=="body"&&La(t,""+a);break;case"className":Hn(t,"class",a);break;case"tabIndex":Hn(t,"tabindex",a);break;case"dir":case"role":case"viewBox":case"width":case"height":Hn(t,l,a);break;case"style":fm(t,a,n);break;case"data":if(e!=="object"){Hn(t,"data",a);break}case"src":case"href":if(a===""&&(e!=="a"||l!=="href")){t.removeAttribute(l);break}if(a==null||typeof a=="function"||typeof a=="symbol"||typeof a=="boolean"){t.removeAttribute(l);break}a=kn(""+a),t.setAttribute(l,a);break;case"action":case"formAction":if(typeof a=="function"){t.setAttribute(l,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof n=="function"&&(l==="formAction"?(e!=="input"&&K(t,e,"name",i.name,i,null),K(t,e,"formEncType",i.formEncType,i,null),K(t,e,"formMethod",i.formMethod,i,null),K(t,e,"formTarget",i.formTarget,i,null)):(K(t,e,"encType",i.encType,i,null),K(t,e,"method",i.method,i,null),K(t,e,"target",i.target,i,null)));if(a==null||typeof a=="symbol"||typeof a=="boolean"){t.removeAttribute(l);break}a=kn(""+a),t.setAttribute(l,a);break;case"onClick":a!=null&&(t.onclick=Ye);break;case"onScroll":a!=null&&B("scroll",t);break;case"onScrollEnd":a!=null&&B("scrollend",t);break;case"dangerouslySetInnerHTML":if(a!=null){if(typeof a!="object"||!("__html"in a))throw Error(g(61));if(l=a.__html,l!=null){if(i.children!=null)throw Error(g(60));t.innerHTML=l}}break;case"multiple":t.multiple=a&&typeof a!="function"&&typeof a!="symbol";break;case"muted":t.muted=a&&typeof a!="function"&&typeof a!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(a==null||typeof a=="function"||typeof a=="boolean"||typeof a=="symbol"){t.removeAttribute("xlink:href");break}l=kn(""+a),t.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",l);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":a!=null&&typeof a!="function"&&typeof a!="symbol"?t.setAttribute(l,""+a):t.removeAttribute(l);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":a&&typeof a!="function"&&typeof a!="symbol"?t.setAttribute(l,""):t.removeAttribute(l);break;case"capture":case"download":a===!0?t.setAttribute(l,""):a!==!1&&a!=null&&typeof a!="function"&&typeof a!="symbol"?t.setAttribute(l,a):t.removeAttribute(l);break;case"cols":case"rows":case"size":case"span":a!=null&&typeof a!="function"&&typeof a!="symbol"&&!isNaN(a)&&1<=a?t.setAttribute(l,a):t.removeAttribute(l);break;case"rowSpan":case"start":a==null||typeof a=="function"||typeof a=="symbol"||isNaN(a)?t.removeAttribute(l):t.setAttribute(l,a);break;case"popover":B("beforetoggle",t),B("toggle",t),Fn(t,"popover",a);break;case"xlinkActuate":_e(t,"http://www.w3.org/1999/xlink","xlink:actuate",a);break;case"xlinkArcrole":_e(t,"http://www.w3.org/1999/xlink","xlink:arcrole",a);break;case"xlinkRole":_e(t,"http://www.w3.org/1999/xlink","xlink:role",a);break;case"xlinkShow":_e(t,"http://www.w3.org/1999/xlink","xlink:show",a);break;case"xlinkTitle":_e(t,"http://www.w3.org/1999/xlink","xlink:title",a);break;case"xlinkType":_e(t,"http://www.w3.org/1999/xlink","xlink:type",a);break;case"xmlBase":_e(t,"http://www.w3.org/XML/1998/namespace","xml:base",a);break;case"xmlLang":_e(t,"http://www.w3.org/XML/1998/namespace","xml:lang",a);break;case"xmlSpace":_e(t,"http://www.w3.org/XML/1998/namespace","xml:space",a);break;case"is":Fn(t,"is",a);break;case"innerText":case"textContent":break;default:(!(2<l.length)||l[0]!=="o"&&l[0]!=="O"||l[1]!=="n"&&l[1]!=="N")&&(l=j0.get(l)||l,Fn(t,l,a))}}function Pr(t,e,l,a,i,n){switch(l){case"style":fm(t,a,n);break;case"dangerouslySetInnerHTML":if(a!=null){if(typeof a!="object"||!("__html"in a))throw Error(g(61));if(l=a.__html,l!=null){if(i.children!=null)throw Error(g(60));t.innerHTML=l}}break;case"children":typeof a=="string"?La(t,a):(typeof a=="number"||typeof a=="bigint")&&La(t,""+a);break;case"onScroll":a!=null&&B("scroll",t);break;case"onScrollEnd":a!=null&&B("scrollend",t);break;case"onClick":a!=null&&(t.onclick=Ye);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!nm.hasOwnProperty(l))t:{if(l[0]==="o"&&l[1]==="n"&&(i=l.endsWith("Capture"),e=l.slice(2,i?l.length-7:void 0),n=t[Ut]||null,n=n!=null?n[l]:null,typeof n=="function"&&t.removeEventListener(e,n,i),typeof a=="function")){typeof n!="function"&&n!==null&&(l in t?t[l]=null:t.hasAttribute(l)&&t.removeAttribute(l)),t.addEventListener(e,a,i);break t}l in t?t[l]=a:a===!0?t.setAttribute(l,""):Fn(t,l,a)}}}function xt(t,e,l){switch(e){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":B("error",t),B("load",t);var a=!1,i=!1,n;for(n in l)if(l.hasOwnProperty(n)){var u=l[n];if(u!=null)switch(n){case"src":a=!0;break;case"srcSet":i=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(g(137,e));default:K(t,e,n,u,l,null)}}i&&K(t,e,"srcSet",l.srcSet,l,null),a&&K(t,e,"src",l.src,l,null);return;case"input":B("invalid",t);var s=n=u=i=null,r=null,o=null;for(a in l)if(l.hasOwnProperty(a)){var h=l[a];if(h!=null)switch(a){case"name":i=h;break;case"type":u=h;break;case"checked":r=h;break;case"defaultChecked":o=h;break;case"value":n=h;break;case"defaultValue":s=h;break;case"children":case"dangerouslySetInnerHTML":if(h!=null)throw Error(g(137,e));break;default:K(t,e,a,h,l,null)}}rm(t,n,s,r,o,u,i,!1);return;case"select":B("invalid",t),a=u=n=null;for(i in l)if(l.hasOwnProperty(i)&&(s=l[i],s!=null))switch(i){case"value":n=s;break;case"defaultValue":u=s;break;case"multiple":a=s;default:K(t,e,i,s,l,null)}e=n,l=u,t.multiple=!!a,e!=null?Da(t,!!a,e,!1):l!=null&&Da(t,!!a,l,!0);return;case"textarea":B("invalid",t),n=i=a=null;for(u in l)if(l.hasOwnProperty(u)&&(s=l[u],s!=null))switch(u){case"value":a=s;break;case"defaultValue":i=s;break;case"children":n=s;break;case"dangerouslySetInnerHTML":if(s!=null)throw Error(g(91));break;default:K(t,e,u,s,l,null)}om(t,a,i,n);return;case"option":for(r in l)l.hasOwnProperty(r)&&(a=l[r],a!=null)&&(r==="selected"?t.selected=a&&typeof a!="function"&&typeof a!="symbol":K(t,e,r,a,l,null));return;case"dialog":B("beforetoggle",t),B("toggle",t),B("cancel",t),B("close",t);break;case"iframe":case"object":B("load",t);break;case"video":case"audio":for(a=0;a<Fi.length;a++)B(Fi[a],t);break;case"image":B("error",t),B("load",t);break;case"details":B("toggle",t);break;case"embed":case"source":case"link":B("error",t),B("load",t);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(o in l)if(l.hasOwnProperty(o)&&(a=l[o],a!=null))switch(o){case"children":case"dangerouslySetInnerHTML":throw Error(g(137,e));default:K(t,e,o,a,l,null)}return;default:if(mc(e)){for(h in l)l.hasOwnProperty(h)&&(a=l[h],a!==void 0&&Pr(t,e,h,a,l,void 0));return}}for(s in l)l.hasOwnProperty(s)&&(a=l[s],a!=null&&K(t,e,s,a,l,null))}function m1(t,e,l,a){switch(e){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var i=null,n=null,u=null,s=null,r=null,o=null,h=null;for(y in l){var p=l[y];if(l.hasOwnProperty(y)&&p!=null)switch(y){case"checked":break;case"value":break;case"defaultValue":r=p;default:a.hasOwnProperty(y)||K(t,e,y,null,a,p)}}for(var d in a){var y=a[d];if(p=l[d],a.hasOwnProperty(d)&&(y!=null||p!=null))switch(d){case"type":n=y;break;case"name":i=y;break;case"checked":o=y;break;case"defaultChecked":h=y;break;case"value":u=y;break;case"defaultValue":s=y;break;case"children":case"dangerouslySetInnerHTML":if(y!=null)throw Error(g(137,e));break;default:y!==p&&K(t,e,d,y,a,p)}}Er(t,u,s,r,o,h,n,i);return;case"select":y=u=s=d=null;for(n in l)if(r=l[n],l.hasOwnProperty(n)&&r!=null)switch(n){case"value":break;case"multiple":y=r;default:a.hasOwnProperty(n)||K(t,e,n,null,a,r)}for(i in a)if(n=a[i],r=l[i],a.hasOwnProperty(i)&&(n!=null||r!=null))switch(i){case"value":d=n;break;case"defaultValue":s=n;break;case"multiple":u=n;default:n!==r&&K(t,e,i,n,a,r)}e=s,l=u,a=y,d!=null?Da(t,!!l,d,!1):!!a!=!!l&&(e!=null?Da(t,!!l,e,!0):Da(t,!!l,l?[]:"",!1));return;case"textarea":y=d=null;for(s in l)if(i=l[s],l.hasOwnProperty(s)&&i!=null&&!a.hasOwnProperty(s))switch(s){case"value":break;case"children":break;default:K(t,e,s,null,a,i)}for(u in a)if(i=a[u],n=l[u],a.hasOwnProperty(u)&&(i!=null||n!=null))switch(u){case"value":d=i;break;case"defaultValue":y=i;break;case"children":break;case"dangerouslySetInnerHTML":if(i!=null)throw Error(g(91));break;default:i!==n&&K(t,e,u,i,a,n)}cm(t,d,y);return;case"option":for(var M in l)d=l[M],l.hasOwnProperty(M)&&d!=null&&!a.hasOwnProperty(M)&&(M==="selected"?t.selected=!1:K(t,e,M,null,a,d));for(r in a)d=a[r],y=l[r],a.hasOwnProperty(r)&&d!==y&&(d!=null||y!=null)&&(r==="selected"?t.selected=d&&typeof d!="function"&&typeof d!="symbol":K(t,e,r,d,a,y));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var x in l)d=l[x],l.hasOwnProperty(x)&&d!=null&&!a.hasOwnProperty(x)&&K(t,e,x,null,a,d);for(o in a)if(d=a[o],y=l[o],a.hasOwnProperty(o)&&d!==y&&(d!=null||y!=null))switch(o){case"children":case"dangerouslySetInnerHTML":if(d!=null)throw Error(g(137,e));break;default:K(t,e,o,d,a,y)}return;default:if(mc(e)){for(var U in l)d=l[U],l.hasOwnProperty(U)&&d!==void 0&&!a.hasOwnProperty(U)&&Pr(t,e,U,void 0,a,d);for(h in a)d=a[h],y=l[h],!a.hasOwnProperty(h)||d===y||d===void 0&&y===void 0||Pr(t,e,h,d,a,y);return}}for(var f in l)d=l[f],l.hasOwnProperty(f)&&d!=null&&!a.hasOwnProperty(f)&&K(t,e,f,null,a,d);for(p in a)d=a[p],y=l[p],!a.hasOwnProperty(p)||d===y||d==null&&y==null||K(t,e,p,d,a,y)}function Gd(t){switch(t){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function h1(){if(typeof performance.getEntriesByType=="function"){for(var t=0,e=0,l=performance.getEntriesByType("resource"),a=0;a<l.length;a++){var i=l[a],n=i.transferSize,u=i.initiatorType,s=i.duration;if(n&&s&&Gd(u)){for(u=0,s=i.responseEnd,a+=1;a<l.length;a++){var r=l[a],o=r.startTime;if(o>s)break;var h=r.transferSize,p=r.initiatorType;h&&Gd(p)&&(r=r.responseEnd,u+=h*(r<s?1:(s-o)/(r-o)))}if(--a,e+=8*(n+u)/(i.duration/1e3),t++,10<t)break}}if(0<t)return e/t/1e6}return navigator.connection&&(t=navigator.connection.downlink,typeof t=="number")?t:5}var $r=null,Ir=null;function Ou(t){return t.nodeType===9?t:t.ownerDocument}function Ad(t){switch(t){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function yy(t,e){if(t===0)switch(e){case"svg":return 1;case"math":return 2;default:return 0}return t===1&&e==="foreignObject"?0:t}function tc(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.children=="bigint"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var or=null;function y1(){var t=window.event;return t&&t.type==="popstate"?t===or?!1:(or=t,!0):(or=null,!1)}var py=typeof setTimeout=="function"?setTimeout:void 0,p1=typeof clearTimeout=="function"?clearTimeout:void 0,zd=typeof Promise=="function"?Promise:void 0,v1=typeof queueMicrotask=="function"?queueMicrotask:typeof zd<"u"?function(t){return zd.resolve(null).then(t).catch(g1)}:py;function g1(t){setTimeout(function(){throw t})}function _l(t){return t==="head"}function Cd(t,e){var l=e,a=0;do{var i=l.nextSibling;if(t.removeChild(l),i&&i.nodeType===8)if(l=i.data,l==="/$"||l==="/&"){if(a===0){t.removeChild(i),Ja(e);return}a--}else if(l==="$"||l==="$?"||l==="$~"||l==="$!"||l==="&")a++;else if(l==="html")qi(t.ownerDocument.documentElement);else if(l==="head"){l=t.ownerDocument.head,qi(l);for(var n=l.firstChild;n;){var u=n.nextSibling,s=n.nodeName;n[an]||s==="SCRIPT"||s==="STYLE"||s==="LINK"&&n.rel.toLowerCase()==="stylesheet"||l.removeChild(n),n=u}}else l==="body"&&qi(t.ownerDocument.body);l=i}while(l);Ja(e)}function _d(t,e){var l=t;t=0;do{var a=l.nextSibling;if(l.nodeType===1?e?(l._stashedDisplay=l.style.display,l.style.display="none"):(l.style.display=l._stashedDisplay||"",l.getAttribute("style")===""&&l.removeAttribute("style")):l.nodeType===3&&(e?(l._stashedText=l.nodeValue,l.nodeValue=""):l.nodeValue=l._stashedText||""),a&&a.nodeType===8)if(l=a.data,l==="/$"){if(t===0)break;t--}else l!=="$"&&l!=="$?"&&l!=="$~"&&l!=="$!"||t++;l=a}while(l)}function ec(t){var e=t.firstChild;for(e&&e.nodeType===10&&(e=e.nextSibling);e;){var l=e;switch(e=e.nextSibling,l.nodeName){case"HTML":case"HEAD":case"BODY":ec(l),dc(l);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(l.rel.toLowerCase()==="stylesheet")continue}t.removeChild(l)}}function b1(t,e,l,a){for(;t.nodeType===1;){var i=l;if(t.nodeName.toLowerCase()!==e.toLowerCase()){if(!a&&(t.nodeName!=="INPUT"||t.type!=="hidden"))break}else if(a){if(!t[an])switch(e){case"meta":if(!t.hasAttribute("itemprop"))break;return t;case"link":if(n=t.getAttribute("rel"),n==="stylesheet"&&t.hasAttribute("data-precedence"))break;if(n!==i.rel||t.getAttribute("href")!==(i.href==null||i.href===""?null:i.href)||t.getAttribute("crossorigin")!==(i.crossOrigin==null?null:i.crossOrigin)||t.getAttribute("title")!==(i.title==null?null:i.title))break;return t;case"style":if(t.hasAttribute("data-precedence"))break;return t;case"script":if(n=t.getAttribute("src"),(n!==(i.src==null?null:i.src)||t.getAttribute("type")!==(i.type==null?null:i.type)||t.getAttribute("crossorigin")!==(i.crossOrigin==null?null:i.crossOrigin))&&n&&t.hasAttribute("async")&&!t.hasAttribute("itemprop"))break;return t;default:return t}}else if(e==="input"&&t.type==="hidden"){var n=i.name==null?null:""+i.name;if(i.type==="hidden"&&t.getAttribute("name")===n)return t}else return t;if(t=se(t.nextSibling),t===null)break}return null}function M1(t,e,l){if(e==="")return null;for(;t.nodeType!==3;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!l||(t=se(t.nextSibling),t===null))return null;return t}function vy(t,e){for(;t.nodeType!==8;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!e||(t=se(t.nextSibling),t===null))return null;return t}function lc(t){return t.data==="$?"||t.data==="$~"}function ac(t){return t.data==="$!"||t.data==="$?"&&t.ownerDocument.readyState!=="loading"}function S1(t,e){var l=t.ownerDocument;if(t.data==="$~")t._reactRetry=e;else if(t.data!=="$?"||l.readyState!=="loading")e();else{var a=function(){e(),l.removeEventListener("DOMContentLoaded",a)};l.addEventListener("DOMContentLoaded",a),t._reactRetry=a}}function se(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?"||e==="$~"||e==="&"||e==="F!"||e==="F")break;if(e==="/$"||e==="/&")return null}}return t}var ic=null;function Rd(t){t=t.nextSibling;for(var e=0;t;){if(t.nodeType===8){var l=t.data;if(l==="/$"||l==="/&"){if(e===0)return se(t.nextSibling);e--}else l!=="$"&&l!=="$!"&&l!=="$?"&&l!=="$~"&&l!=="&"||e++}t=t.nextSibling}return null}function Dd(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var l=t.data;if(l==="$"||l==="$!"||l==="$?"||l==="$~"||l==="&"){if(e===0)return t;e--}else l!=="/$"&&l!=="/&"||e++}t=t.previousSibling}return null}function gy(t,e,l){switch(e=Ou(l),t){case"html":if(t=e.documentElement,!t)throw Error(g(452));return t;case"head":if(t=e.head,!t)throw Error(g(453));return t;case"body":if(t=e.body,!t)throw Error(g(454));return t;default:throw Error(g(451))}}function qi(t){for(var e=t.attributes;e.length;)t.removeAttributeNode(e[0]);dc(t)}var re=new Map,Od=new Set;function Nu(t){return typeof t.getRootNode=="function"?t.getRootNode():t.nodeType===9?t:t.ownerDocument}var Je=X.d;X.d={f:E1,r:x1,D:T1,C:G1,L:A1,m:z1,X:_1,S:C1,M:R1};function E1(){var t=Je.f(),e=Wu();return t||e}function x1(t){var e=ka(t);e!==null&&e.tag===5&&e.type==="form"?fh(e):Je.r(t)}var Ia=typeof document>"u"?null:document;function by(t,e,l){var a=Ia;if(a&&typeof e=="string"&&e){var i=ae(e);i='link[rel="'+t+'"][href="'+i+'"]',typeof l=="string"&&(i+='[crossorigin="'+l+'"]'),Od.has(i)||(Od.add(i),t={rel:t,crossOrigin:l,href:e},a.querySelector(i)===null&&(e=a.createElement("link"),xt(e,"link",t),pt(e),a.head.appendChild(e)))}}function T1(t){Je.D(t),by("dns-prefetch",t,null)}function G1(t,e){Je.C(t,e),by("preconnect",t,e)}function A1(t,e,l){Je.L(t,e,l);var a=Ia;if(a&&t&&e){var i='link[rel="preload"][as="'+ae(e)+'"]';e==="image"&&l&&l.imageSrcSet?(i+='[imagesrcset="'+ae(l.imageSrcSet)+'"]',typeof l.imageSizes=="string"&&(i+='[imagesizes="'+ae(l.imageSizes)+'"]')):i+='[href="'+ae(t)+'"]';var n=i;switch(e){case"style":n=Ka(t);break;case"script":n=ti(t)}re.has(n)||(t=I({rel:"preload",href:e==="image"&&l&&l.imageSrcSet?void 0:t,as:e},l),re.set(n,t),a.querySelector(i)!==null||e==="style"&&a.querySelector(on(n))||e==="script"&&a.querySelector(fn(n))||(e=a.createElement("link"),xt(e,"link",t),pt(e),a.head.appendChild(e)))}}function z1(t,e){Je.m(t,e);var l=Ia;if(l&&t){var a=e&&typeof e.as=="string"?e.as:"script",i='link[rel="modulepreload"][as="'+ae(a)+'"][href="'+ae(t)+'"]',n=i;switch(a){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":n=ti(t)}if(!re.has(n)&&(t=I({rel:"modulepreload",href:t},e),re.set(n,t),l.querySelector(i)===null)){switch(a){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(l.querySelector(fn(n)))return}a=l.createElement("link"),xt(a,"link",t),pt(a),l.head.appendChild(a)}}}function C1(t,e,l){Je.S(t,e,l);var a=Ia;if(a&&t){var i=Ra(a).hoistableStyles,n=Ka(t);e=e||"default";var u=i.get(n);if(!u){var s={loading:0,preload:null};if(u=a.querySelector(on(n)))s.loading=5;else{t=I({rel:"stylesheet",href:t,"data-precedence":e},l),(l=re.get(n))&&Pc(t,l);var r=u=a.createElement("link");pt(r),xt(r,"link",t),r._p=new Promise(function(o,h){r.onload=o,r.onerror=h}),r.addEventListener("load",function(){s.loading|=1}),r.addEventListener("error",function(){s.loading|=2}),s.loading|=4,nu(u,e,a)}u={type:"stylesheet",instance:u,count:1,state:s},i.set(n,u)}}}function _1(t,e){Je.X(t,e);var l=Ia;if(l&&t){var a=Ra(l).hoistableScripts,i=ti(t),n=a.get(i);n||(n=l.querySelector(fn(i)),n||(t=I({src:t,async:!0},e),(e=re.get(i))&&$c(t,e),n=l.createElement("script"),pt(n),xt(n,"link",t),l.head.appendChild(n)),n={type:"script",instance:n,count:1,state:null},a.set(i,n))}}function R1(t,e){Je.M(t,e);var l=Ia;if(l&&t){var a=Ra(l).hoistableScripts,i=ti(t),n=a.get(i);n||(n=l.querySelector(fn(i)),n||(t=I({src:t,async:!0,type:"module"},e),(e=re.get(i))&&$c(t,e),n=l.createElement("script"),pt(n),xt(n,"link",t),l.head.appendChild(n)),n={type:"script",instance:n,count:1,state:null},a.set(i,n))}}function Nd(t,e,l,a){var i=(i=yl.current)?Nu(i):null;if(!i)throw Error(g(446));switch(t){case"meta":case"title":return null;case"style":return typeof l.precedence=="string"&&typeof l.href=="string"?(e=Ka(l.href),l=Ra(i).hoistableStyles,a=l.get(e),a||(a={type:"style",instance:null,count:0,state:null},l.set(e,a)),a):{type:"void",instance:null,count:0,state:null};case"link":if(l.rel==="stylesheet"&&typeof l.href=="string"&&typeof l.precedence=="string"){t=Ka(l.href);var n=Ra(i).hoistableStyles,u=n.get(t);if(u||(i=i.ownerDocument||i,u={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},n.set(t,u),(n=i.querySelector(on(t)))&&!n._p&&(u.instance=n,u.state.loading=5),re.has(t)||(l={rel:"preload",as:"style",href:l.href,crossOrigin:l.crossOrigin,integrity:l.integrity,media:l.media,hrefLang:l.hrefLang,referrerPolicy:l.referrerPolicy},re.set(t,l),n||D1(i,t,l,u.state))),e&&a===null)throw Error(g(528,""));return u}if(e&&a!==null)throw Error(g(529,""));return null;case"script":return e=l.async,l=l.src,typeof l=="string"&&e&&typeof e!="function"&&typeof e!="symbol"?(e=ti(l),l=Ra(i).hoistableScripts,a=l.get(e),a||(a={type:"script",instance:null,count:0,state:null},l.set(e,a)),a):{type:"void",instance:null,count:0,state:null};default:throw Error(g(444,t))}}function Ka(t){return'href="'+ae(t)+'"'}function on(t){return'link[rel="stylesheet"]['+t+"]"}function My(t){return I({},t,{"data-precedence":t.precedence,precedence:null})}function D1(t,e,l,a){t.querySelector('link[rel="preload"][as="style"]['+e+"]")?a.loading=1:(e=t.createElement("link"),a.preload=e,e.addEventListener("load",function(){return a.loading|=1}),e.addEventListener("error",function(){return a.loading|=2}),xt(e,"link",l),pt(e),t.head.appendChild(e))}function ti(t){return'[src="'+ae(t)+'"]'}function fn(t){return"script[async]"+t}function Hd(t,e,l){if(e.count++,e.instance===null)switch(e.type){case"style":var a=t.querySelector('style[data-href~="'+ae(l.href)+'"]');if(a)return e.instance=a,pt(a),a;var i=I({},l,{"data-href":l.href,"data-precedence":l.precedence,href:null,precedence:null});return a=(t.ownerDocument||t).createElement("style"),pt(a),xt(a,"style",i),nu(a,l.precedence,t),e.instance=a;case"stylesheet":i=Ka(l.href);var n=t.querySelector(on(i));if(n)return e.state.loading|=4,e.instance=n,pt(n),n;a=My(l),(i=re.get(i))&&Pc(a,i),n=(t.ownerDocument||t).createElement("link"),pt(n);var u=n;return u._p=new Promise(function(s,r){u.onload=s,u.onerror=r}),xt(n,"link",a),e.state.loading|=4,nu(n,l.precedence,t),e.instance=n;case"script":return n=ti(l.src),(i=t.querySelector(fn(n)))?(e.instance=i,pt(i),i):(a=l,(i=re.get(n))&&(a=I({},l),$c(a,i)),t=t.ownerDocument||t,i=t.createElement("script"),pt(i),xt(i,"link",a),t.head.appendChild(i),e.instance=i);case"void":return null;default:throw Error(g(443,e.type))}else e.type==="stylesheet"&&(e.state.loading&4)===0&&(a=e.instance,e.state.loading|=4,nu(a,l.precedence,t));return e.instance}function nu(t,e,l){for(var a=l.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),i=a.length?a[a.length-1]:null,n=i,u=0;u<a.length;u++){var s=a[u];if(s.dataset.precedence===e)n=s;else if(n!==i)break}n?n.parentNode.insertBefore(t,n.nextSibling):(e=l.nodeType===9?l.head:l,e.insertBefore(t,e.firstChild))}function Pc(t,e){t.crossOrigin==null&&(t.crossOrigin=e.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=e.referrerPolicy),t.title==null&&(t.title=e.title)}function $c(t,e){t.crossOrigin==null&&(t.crossOrigin=e.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=e.referrerPolicy),t.integrity==null&&(t.integrity=e.integrity)}var uu=null;function Ud(t,e,l){if(uu===null){var a=new Map,i=uu=new Map;i.set(l,a)}else i=uu,a=i.get(l),a||(a=new Map,i.set(l,a));if(a.has(t))return a;for(a.set(t,null),l=l.getElementsByTagName(t),i=0;i<l.length;i++){var n=l[i];if(!(n[an]||n[Mt]||t==="link"&&n.getAttribute("rel")==="stylesheet")&&n.namespaceURI!=="http://www.w3.org/2000/svg"){var u=n.getAttribute(e)||"";u=t+u;var s=a.get(u);s?s.push(n):a.set(u,[n])}}return a}function Bd(t,e,l){t=t.ownerDocument||t,t.head.insertBefore(l,e==="title"?t.querySelector("head > title"):null)}function O1(t,e,l){if(l===1||e.itemProp!=null)return!1;switch(t){case"meta":case"title":return!0;case"style":if(typeof e.precedence!="string"||typeof e.href!="string"||e.href==="")break;return!0;case"link":if(typeof e.rel!="string"||typeof e.href!="string"||e.href===""||e.onLoad||e.onError)break;return e.rel==="stylesheet"?(t=e.disabled,typeof e.precedence=="string"&&t==null):!0;case"script":if(e.async&&typeof e.async!="function"&&typeof e.async!="symbol"&&!e.onLoad&&!e.onError&&e.src&&typeof e.src=="string")return!0}return!1}function Sy(t){return!(t.type==="stylesheet"&&(t.state.loading&3)===0)}function N1(t,e,l,a){if(l.type==="stylesheet"&&(typeof a.media!="string"||matchMedia(a.media).matches!==!1)&&(l.state.loading&4)===0){if(l.instance===null){var i=Ka(a.href),n=e.querySelector(on(i));if(n){e=n._p,e!==null&&typeof e=="object"&&typeof e.then=="function"&&(t.count++,t=Hu.bind(t),e.then(t,t)),l.state.loading|=4,l.instance=n,pt(n);return}n=e.ownerDocument||e,a=My(a),(i=re.get(i))&&Pc(a,i),n=n.createElement("link"),pt(n);var u=n;u._p=new Promise(function(s,r){u.onload=s,u.onerror=r}),xt(n,"link",a),l.instance=n}t.stylesheets===null&&(t.stylesheets=new Map),t.stylesheets.set(l,e),(e=l.state.preload)&&(l.state.loading&3)===0&&(t.count++,l=Hu.bind(t),e.addEventListener("load",l),e.addEventListener("error",l))}}var fr=0;function H1(t,e){return t.stylesheets&&t.count===0&&su(t,t.stylesheets),0<t.count||0<t.imgCount?function(l){var a=setTimeout(function(){if(t.stylesheets&&su(t,t.stylesheets),t.unsuspend){var n=t.unsuspend;t.unsuspend=null,n()}},6e4+e);0<t.imgBytes&&fr===0&&(fr=62500*h1());var i=setTimeout(function(){if(t.waitingForImages=!1,t.count===0&&(t.stylesheets&&su(t,t.stylesheets),t.unsuspend)){var n=t.unsuspend;t.unsuspend=null,n()}},(t.imgBytes>fr?50:800)+e);return t.unsuspend=l,function(){t.unsuspend=null,clearTimeout(a),clearTimeout(i)}}:null}function Hu(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)su(this,this.stylesheets);else if(this.unsuspend){var t=this.unsuspend;this.unsuspend=null,t()}}}var Uu=null;function su(t,e){t.stylesheets=null,t.unsuspend!==null&&(t.count++,Uu=new Map,e.forEach(U1,t),Uu=null,Hu.call(t))}function U1(t,e){if(!(e.state.loading&4)){var l=Uu.get(t);if(l)var a=l.get(null);else{l=new Map,Uu.set(t,l);for(var i=t.querySelectorAll("link[data-precedence],style[data-precedence]"),n=0;n<i.length;n++){var u=i[n];(u.nodeName==="LINK"||u.getAttribute("media")!=="not all")&&(l.set(u.dataset.precedence,u),a=u)}a&&l.set(null,a)}i=e.instance,u=i.getAttribute("data-precedence"),n=l.get(u)||a,n===a&&l.set(null,i),l.set(u,i),this.count++,a=Hu.bind(this),i.addEventListener("load",a),i.addEventListener("error",a),n?n.parentNode.insertBefore(i,n.nextSibling):(t=t.nodeType===9?t.head:t,t.insertBefore(i,t.firstChild)),e.state.loading|=4}}var Wi={$$typeof:Be,Provider:null,Consumer:null,_currentValue:Ql,_currentValue2:Ql,_threadCount:0};function B1(t,e,l,a,i,n,u,s,r){this.tag=1,this.containerInfo=t,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=Ys(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Ys(0),this.hiddenUpdates=Ys(null),this.identifierPrefix=a,this.onUncaughtError=i,this.onCaughtError=n,this.onRecoverableError=u,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=r,this.incompleteTransitions=new Map}function Ey(t,e,l,a,i,n,u,s,r,o,h,p){return t=new B1(t,e,l,u,r,o,h,p,s),e=1,n===!0&&(e|=24),n=wt(3,null,null,e),t.current=n,n.stateNode=t,e=Tc(),e.refCount++,t.pooledCache=e,e.refCount++,n.memoizedState={element:a,isDehydrated:l,cache:e},zc(n),t}function xy(t){return t?(t=Aa,t):Aa}function Ty(t,e,l,a,i,n){i=xy(i),a.context===null?a.context=i:a.pendingContext=i,a=vl(e),a.payload={element:l},n=n===void 0?null:n,n!==null&&(a.callback=n),l=gl(t,a,e),l!==null&&(Ht(l,t,e),Ri(l,t,e))}function Yd(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var l=t.retryLane;t.retryLane=l!==0&&l<e?l:e}}function Ic(t,e){Yd(t,e),(t=t.alternate)&&Yd(t,e)}function Gy(t){if(t.tag===13||t.tag===31){var e=la(t,67108864);e!==null&&Ht(e,t,67108864),Ic(t,67108864)}}function qd(t){if(t.tag===13||t.tag===31){var e=Vt();e=oc(e);var l=la(t,e);l!==null&&Ht(l,t,e),Ic(t,e)}}var Bu=!0;function Y1(t,e,l,a){var i=z.T;z.T=null;var n=X.p;try{X.p=2,to(t,e,l,a)}finally{X.p=n,z.T=i}}function q1(t,e,l,a){var i=z.T;z.T=null;var n=X.p;try{X.p=8,to(t,e,l,a)}finally{X.p=n,z.T=i}}function to(t,e,l,a){if(Bu){var i=nc(a);if(i===null)cr(t,e,a,Yu,l),Ld(t,a);else if(w1(i,t,e,l,a))a.stopPropagation();else if(Ld(t,a),e&4&&-1<L1.indexOf(t)){for(;i!==null;){var n=ka(i);if(n!==null)switch(n.tag){case 3:if(n=n.stateNode,n.current.memoizedState.isDehydrated){var u=wl(n.pendingLanes);if(u!==0){var s=n;for(s.pendingLanes|=2,s.entangledLanes|=2;u;){var r=1<<31-Zt(u);s.entanglements[1]|=r,u&=~r}Me(n),(w&6)===0&&(Au=jt()+500,cn(0,!1))}}break;case 31:case 13:s=la(n,2),s!==null&&Ht(s,n,2),Wu(),Ic(n,2)}if(n=nc(a),n===null&&cr(t,e,a,Yu,l),n===i)break;i=n}i!==null&&a.stopPropagation()}else cr(t,e,a,null,l)}}function nc(t){return t=hc(t),eo(t)}var Yu=null;function eo(t){if(Yu=null,t=Ma(t),t!==null){var e=Ii(t);if(e===null)t=null;else{var l=e.tag;if(l===13){if(t=Vd(e),t!==null)return t;t=null}else if(l===31){if(t=Kd(e),t!==null)return t;t=null}else if(l===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null)}}return Yu=t,null}function Ay(t){switch(t){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(A0()){case Wd:return 2;case Pd:return 8;case du:case z0:return 32;case $d:return 268435456;default:return 32}default:return 32}}var uc=!1,Sl=null,El=null,xl=null,Pi=new Map,$i=new Map,cl=[],L1="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function Ld(t,e){switch(t){case"focusin":case"focusout":Sl=null;break;case"dragenter":case"dragleave":El=null;break;case"mouseover":case"mouseout":xl=null;break;case"pointerover":case"pointerout":Pi.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":$i.delete(e.pointerId)}}function bi(t,e,l,a,i,n){return t===null||t.nativeEvent!==n?(t={blockedOn:e,domEventName:l,eventSystemFlags:a,nativeEvent:n,targetContainers:[i]},e!==null&&(e=ka(e),e!==null&&Gy(e)),t):(t.eventSystemFlags|=a,e=t.targetContainers,i!==null&&e.indexOf(i)===-1&&e.push(i),t)}function w1(t,e,l,a,i){switch(e){case"focusin":return Sl=bi(Sl,t,e,l,a,i),!0;case"dragenter":return El=bi(El,t,e,l,a,i),!0;case"mouseover":return xl=bi(xl,t,e,l,a,i),!0;case"pointerover":var n=i.pointerId;return Pi.set(n,bi(Pi.get(n)||null,t,e,l,a,i)),!0;case"gotpointercapture":return n=i.pointerId,$i.set(n,bi($i.get(n)||null,t,e,l,a,i)),!0}return!1}function zy(t){var e=Ma(t.target);if(e!==null){var l=Ii(e);if(l!==null){if(e=l.tag,e===13){if(e=Vd(l),e!==null){t.blockedOn=e,Ef(t.priority,function(){qd(l)});return}}else if(e===31){if(e=Kd(l),e!==null){t.blockedOn=e,Ef(t.priority,function(){qd(l)});return}}else if(e===3&&l.stateNode.current.memoizedState.isDehydrated){t.blockedOn=l.tag===3?l.stateNode.containerInfo:null;return}}}t.blockedOn=null}function ru(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var l=nc(t.nativeEvent);if(l===null){l=t.nativeEvent;var a=new l.constructor(l.type,l);Tr=a,l.target.dispatchEvent(a),Tr=null}else return e=ka(l),e!==null&&Gy(e),t.blockedOn=l,!1;e.shift()}return!0}function wd(t,e,l){ru(t)&&l.delete(e)}function X1(){uc=!1,Sl!==null&&ru(Sl)&&(Sl=null),El!==null&&ru(El)&&(El=null),xl!==null&&ru(xl)&&(xl=null),Pi.forEach(wd),$i.forEach(wd)}function Kn(t,e){t.blockedOn===e&&(t.blockedOn=null,uc||(uc=!0,ht.unstable_scheduleCallback(ht.unstable_NormalPriority,X1)))}var Jn=null;function Xd(t){Jn!==t&&(Jn=t,ht.unstable_scheduleCallback(ht.unstable_NormalPriority,function(){Jn===t&&(Jn=null);for(var e=0;e<t.length;e+=3){var l=t[e],a=t[e+1],i=t[e+2];if(typeof a!="function"){if(eo(a||l)===null)continue;break}var n=ka(l);n!==null&&(t.splice(e,3),e-=3,wr(n,{pending:!0,data:i,method:l.method,action:a},a,i))}}))}function Ja(t){function e(r){return Kn(r,t)}Sl!==null&&Kn(Sl,t),El!==null&&Kn(El,t),xl!==null&&Kn(xl,t),Pi.forEach(e),$i.forEach(e);for(var l=0;l<cl.length;l++){var a=cl[l];a.blockedOn===t&&(a.blockedOn=null)}for(;0<cl.length&&(l=cl[0],l.blockedOn===null);)zy(l),l.blockedOn===null&&cl.shift();if(l=(t.ownerDocument||t).$$reactFormReplay,l!=null)for(a=0;a<l.length;a+=3){var i=l[a],n=l[a+1],u=i[Ut]||null;if(typeof n=="function")u||Xd(l);else if(u){var s=null;if(n&&n.hasAttribute("formAction")){if(i=n,u=n[Ut]||null)s=u.formAction;else if(eo(i)!==null)continue}else s=u.action;typeof s=="function"?l[a+1]=s:(l.splice(a,3),a-=3),Xd(l)}}}function Cy(){function t(n){n.canIntercept&&n.info==="react-transition"&&n.intercept({handler:function(){return new Promise(function(u){return i=u})},focusReset:"manual",scroll:"manual"})}function e(){i!==null&&(i(),i=null),a||setTimeout(l,20)}function l(){if(!a&&!navigation.transition){var n=navigation.currentEntry;n&&n.url!=null&&navigation.navigate(n.url,{state:n.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var a=!1,i=null;return navigation.addEventListener("navigate",t),navigation.addEventListener("navigatesuccess",e),navigation.addEventListener("navigateerror",e),setTimeout(l,100),function(){a=!0,navigation.removeEventListener("navigate",t),navigation.removeEventListener("navigatesuccess",e),navigation.removeEventListener("navigateerror",e),i!==null&&(i(),i=null)}}}function lo(t){this._internalRoot=t}Iu.prototype.render=lo.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(g(409));var l=e.current,a=Vt();Ty(l,a,t,e,null,null)};Iu.prototype.unmount=lo.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;Ty(t.current,2,null,t,null,null),Wu(),e[Fa]=null}};function Iu(t){this._internalRoot=t}Iu.prototype.unstable_scheduleHydration=function(t){if(t){var e=am();t={blockedOn:null,target:t,priority:e};for(var l=0;l<cl.length&&e!==0&&e<cl[l].priority;l++);cl.splice(l,0,t),l===0&&zy(t)}};var jd=Qd.version;if(jd!=="19.2.7")throw Error(g(527,jd,"19.2.7"));X.findDOMNode=function(t){var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(g(188)):(t=Object.keys(t).join(","),Error(g(268,t)));return t=b0(e),t=t!==null?Jd(t):null,t=t===null?null:t.stateNode,t};var j1={bundleType:0,version:"19.2.7",rendererPackageName:"react-dom",currentDispatcherRef:z,reconcilerVersion:"19.2.7"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&(Mi=__REACT_DEVTOOLS_GLOBAL_HOOK__,!Mi.isDisabled&&Mi.supportsFiber))try{tn=Mi.inject(j1),Qt=Mi}catch{}var Mi;ts.createRoot=function(t,e){if(!Zd(t))throw Error(g(299));var l=!1,a="",i=bh,n=Mh,u=Sh;return e!=null&&(e.unstable_strictMode===!0&&(l=!0),e.identifierPrefix!==void 0&&(a=e.identifierPrefix),e.onUncaughtError!==void 0&&(i=e.onUncaughtError),e.onCaughtError!==void 0&&(n=e.onCaughtError),e.onRecoverableError!==void 0&&(u=e.onRecoverableError)),e=Ey(t,1,!1,null,null,l,a,null,i,n,u,Cy),t[Fa]=e.current,Wc(t),new lo(e)};ts.hydrateRoot=function(t,e,l){if(!Zd(t))throw Error(g(299));var a=!1,i="",n=bh,u=Mh,s=Sh,r=null;return l!=null&&(l.unstable_strictMode===!0&&(a=!0),l.identifierPrefix!==void 0&&(i=l.identifierPrefix),l.onUncaughtError!==void 0&&(n=l.onUncaughtError),l.onCaughtError!==void 0&&(u=l.onCaughtError),l.onRecoverableError!==void 0&&(s=l.onRecoverableError),l.formState!==void 0&&(r=l.formState)),e=Ey(t,1,!0,e,l??null,a,i,r,n,u,s,Cy),e.context=xy(null),l=e.current,a=Vt(),a=oc(a),i=vl(a),i.callback=null,gl(l,i,a),l=a,e.current.lanes=l,ln(e,l),Me(e),t[Fa]=e.current,Wc(t),new Iu(e)};ts.version="19.2.7"});var Oy=me((jg,Dy)=>{"use strict";function Ry(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Ry)}catch(t){console.error(t)}}Ry(),Dy.exports=_y()});var Uy=me(ls=>{"use strict";var Q1=Symbol.for("react.transitional.element"),Z1=Symbol.for("react.fragment");function Hy(t,e,l){var a=null;if(l!==void 0&&(a=""+l),e.key!==void 0&&(a=""+e.key),"key"in e){l={};for(var i in e)i!=="key"&&(l[i]=e[i])}else l=e;return e=l.ref,{$$typeof:Q1,type:t,key:a,ref:e!==void 0?e:null,props:l}}ls.Fragment=Z1;ls.jsx=Hy;ls.jsxs=Hy});var Ft=me((Vg,By)=>{"use strict";By.exports=Uy()});var Zp=gt(Oy(),1);var Kg=gt(Yl(),1),j=gt(Yl(),1);function Ny(t){return`${t.x}:${t.y}`}var es=class{activeTiles=new Map;visitedTiles=new Set;paintMode=null;begin(e){return this.visitedTiles.clear(),this.paintMode=this.activeTiles.has(Ny(e))?"release":"press",this.apply(e)}move(e){return this.paintMode?this.apply(e):[]}end(){this.paintMode=null,this.visitedTiles.clear()}reset(){this.end(),this.activeTiles.clear()}keys(){return[...this.activeTiles.keys()]}apply(e){let l=Ny(e);if(!this.paintMode||this.visitedTiles.has(l))return[];this.visitedTiles.add(l);let a=this.paintMode==="press";return a?this.activeTiles.set(l,e):this.activeTiles.delete(l),[{...e,pressed:a}]}};var S=gt(Ft(),1),ao=gt(Yl(),1),V1={ready:"Listo",waiting:"En espera",starting:"Preparados",running:"En juego",paused:"En pausa",finished:"Terminado"};function K1(t){return V1[t]??t}var qy=(0,j.createContext)({paused:!1});function Ly({paused:t,children:e}){return(0,S.jsx)(qy.Provider,{value:{paused:t},children:e})}function Rl({title:t,phase:e,variant:l="default",children:a}){let n=(0,j.useContext)(qy).paused,u=n?"paused":e;return(0,S.jsxs)("section",{className:`ml-display-shell ml-tv-display ml-tv-display-${l}${n?" is-paused":""}`,"aria-label":`Pantalla de ${t}`,"data-paused":n||void 0,children:[(0,S.jsxs)("header",{className:"ml-display-header ml-tv-header",children:[(0,S.jsxs)("div",{className:"ml-tv-brand","aria-hidden":"true",children:[(0,S.jsx)("span",{className:"ml-tv-brand-mark"}),(0,S.jsxs)("span",{className:"ml-tv-brand-name",children:[(0,S.jsx)("b",{children:"Motion"}),(0,S.jsx)("b",{children:"Levels"})]})]}),(0,S.jsxs)("div",{className:"ml-tv-title",children:[(0,S.jsx)("span",{className:"ml-display-label",children:"Juego"}),(0,S.jsx)("h1",{children:t})]}),(0,S.jsx)("span",{className:`ml-status-pill ml-status-${u}`,children:K1(u)})]}),(0,S.jsx)("div",{className:"ml-display-content",children:a})]})}function ei({snapshot:t}){if(t.phase!=="waiting"&&t.phase!=="starting")return null;let e=t.readyPlayers??0,l=Math.max(t.requiredPlayers??t.playerCount,1),a=t.phase==="starting",i=Math.max(1,Math.ceil((t.countdownMillis??0)/1e3));return(0,S.jsxs)("section",{"aria-label":a?"El juego est\xE1 a punto de empezar":"Esperando jugadores",className:`ml-player-ready-overlay is-${t.phase}`,children:[(0,S.jsxs)("div",{className:"ml-player-ready-pulse","aria-hidden":"true",children:[(0,S.jsx)("i",{}),(0,S.jsx)("i",{}),(0,S.jsx)("i",{})]}),(0,S.jsx)("span",{children:a?"Todos listos":"Esperando jugadores"}),(0,S.jsx)("strong",{children:a?i:`${e}/${l}`}),(0,S.jsx)("b",{children:a?"El juego est\xE1 a punto de empezar":"Entra y permanece en la zona iluminada"})]})}function ft({label:t,value:e,tone:l="cyan",className:a=""}){return(0,S.jsxs)("article",{className:`ml-metric ml-metric-${l} ${a}`.trim(),children:[(0,S.jsx)("span",{className:"ml-metric-label",children:t}),(0,S.jsx)("strong",{className:"ml-metric-value",children:e})]})}function li({className:t="",lives:e,maxLives:l}){let a=Math.max(0,Math.trunc(l)),i=Math.min(a,Math.max(0,Math.trunc(e))),n=(0,j.useRef)(i),u=(0,j.useRef)(0),[s,r]=(0,j.useState)(null);return(0,j.useEffect)(()=>{let o=n.current;if(n.current=i,o===i)return;u.current+=1;let h={from:o,id:u.current,to:i};r(h);let p=window.setTimeout(()=>{r(d=>d?.id===h.id?null:d)},1100);return()=>window.clearTimeout(p)},[i]),(0,S.jsx)("div",{"aria-label":`${i} de ${a} vidas restantes`,className:`ml-lives-meter ${t}`.trim(),role:"img",children:Array.from({length:a},(o,h)=>{let p=h<i,y=s&&h>=Math.min(s.from,s.to)&&h<Math.max(s.from,s.to)?s.to>s.from?"is-regained":"is-losing":"";return(0,S.jsx)("span",{"aria-hidden":"true",className:`ml-life-heart ${p?"is-remaining":"is-lost"} ${y}`.trim(),"data-life-change":y||void 0,"data-life-state":p?"remaining":"lost",style:{"--ml-heart-index":h},children:(0,S.jsx)("span",{className:"ml-life-heart-glyph",children:"\u2665"})},h)})})}function Dl({children:t,columns:e=3,className:l=""}){return(0,S.jsx)("section",{className:`ml-metric-row ${l}`.trim(),style:{"--ml-metric-columns":e},children:t})}function wy({left:t,right:e,target:l,centerLabel:a,centerValue:i,centerCaption:n="",className:u=""}){return(0,S.jsxs)("section",{className:`ml-versus-scoreboard ${u}`.trim(),"aria-label":"Marcador",children:[(0,S.jsx)(Yy,{player:t,side:"red",target:l}),(0,S.jsxs)("article",{className:"ml-versus-center",children:[(0,S.jsx)("span",{children:a}),(0,S.jsx)("strong",{children:i}),n?(0,S.jsx)("b",{children:n}):null]}),(0,S.jsx)(Yy,{player:e,side:"blue",target:l})]})}function Yy({player:t,side:e,target:l}){let a=Math.max(0,Math.min(1,t.score/Math.max(l,1)));return(0,S.jsxs)("article",{className:`ml-player-score-panel ml-player-score-${e}`,style:{"--ml-player":t.color,"--ml-player-rgb":F1(t.color),"--ml-score-progress":a},children:[(0,S.jsxs)("div",{className:"ml-player-score-head",children:[(0,S.jsx)("span",{children:t.label}),(0,S.jsxs)("b",{children:[t.score,"/",l]})]}),(0,S.jsx)("strong",{children:t.score}),(0,S.jsx)("div",{className:"ml-player-score-track","aria-hidden":"true",children:(0,S.jsx)("i",{})})]})}function Xy({rounds:t,totalRounds:e,activeRound:l,activeLabel:a="Ronda actual",activeCaption:i="Punto en curso",fallbackLabel:n="Pendiente",className:u=""}){let s=Math.max(t.length,e??0,1),r=new Map(t.map(c=>[c.index,c])),o=Array.from({length:s},(c,m)=>{let v=m+1;return r.get(v)??{index:v,winnerLabel:n,hits:0}}),h=t.length<s?t.length+1:null,p=l===void 0?h:l,d=p??Math.max(t.length,1),y=12,M=Math.min(Math.max(0,d-Math.ceil(y/2)),Math.max(0,s-y)),x=o.slice(M,M+y),U=s>x.length?`Rondas ${x[0]?.index}-${x.at(-1)?.index} de ${s}`:"Historial del partido",f={"--ml-round-count":x.length,"--ml-round-progress":`${Math.min(1,t.length/s)*100}%`};return(0,S.jsxs)("section",{className:`ml-round-strip ${u}`.trim(),"aria-label":"Rondas",style:f,children:[(0,S.jsxs)("div",{className:"ml-round-strip-head",children:[(0,S.jsxs)("div",{className:"ml-round-strip-title",children:[(0,S.jsx)("span",{children:"Rondas"}),(0,S.jsx)("small",{children:U})]}),(0,S.jsxs)("div",{className:"ml-round-strip-count","aria-label":`${t.length} de ${s} rondas jugadas`,children:[(0,S.jsx)("strong",{children:t.length}),(0,S.jsxs)("span",{children:["de ",s]})]})]}),(0,S.jsx)("div",{className:"ml-round-progress","aria-hidden":"true",children:(0,S.jsx)("i",{})}),(0,S.jsx)("div",{className:"ml-round-list",children:x.map(c=>{let m=c.winnerIndex===0||c.winnerIndex===1,v=!m&&c.index===p,T=c.winnerIndex===0?"is-red":c.winnerIndex===1?"is-blue":v?"is-current":"is-pending",H=c.hits??0;return(0,S.jsxs)("article",{className:`ml-round-card ${T}`,children:[(0,S.jsxs)("div",{className:"ml-round-card-head",children:[(0,S.jsxs)("span",{children:["R",c.index]}),(0,S.jsx)("i",{"aria-hidden":"true"})]}),(0,S.jsx)("strong",{children:m?c.winnerLabel||n:v?a:n}),m?(0,S.jsxs)("b",{children:[H," ",H===1?"golpe":"golpes"]}):null,v?(0,S.jsx)("b",{children:i}):null]},c.index)})})]})}function ai({frame:t,label:e="Vista del suelo",className:l=""}){return(0,S.jsxs)("section",{className:`ml-frame-preview-panel ${l}`.trim(),children:[(0,S.jsx)("span",{children:e}),(0,S.jsx)(J1,{frame:t})]})}function J1({frame:t,interactive:e=!1,inputResetKey:l,onTilePress:a,onTileRelease:i,className:n=""}){let u=(0,j.useRef)(null),s=(0,j.useRef)(null),r=(0,j.useRef)(new es),o=(0,j.useRef)(l),[h,p]=(0,j.useState)(()=>new Set),d={"--ml-floor-cols":t.width,"--ml-floor-rows":t.height},y=`ml-floor-preview ${e?"ml-floor-interactive":""} ${n}`.trim(),M=(0,j.useCallback)(()=>{let b=document.activeElement;b instanceof HTMLElement&&u.current?.contains(b)&&b.blur()},[]),x=(0,j.useCallback)((b,C)=>{let Pt=document.elementFromPoint(b,C)?.closest("[data-tile-x][data-tile-y]");return!Pt||!u.current?.contains(Pt)?null:{x:Number(Pt.dataset.tileX),y:Number(Pt.dataset.tileY)}},[]),U=(0,j.useCallback)(b=>{if(b.length!==0){for(let C of b)C.pressed?a?.(C.x,C.y):i?.(C.x,C.y);p(new Set(r.current.keys()))}},[a,i]),f=(0,j.useCallback)(b=>{!b||Number.isNaN(b.x)||Number.isNaN(b.y)||U(r.current.begin(b))},[U]),c=(0,j.useCallback)(b=>{!b||Number.isNaN(b.x)||Number.isNaN(b.y)||U(r.current.move(b))},[U]),m=(0,j.useCallback)(()=>{r.current.reset(),p(new Set)},[]);(0,j.useEffect)(()=>{Object.is(o.current,l)||(o.current=l,m())},[m,l]),(0,j.useEffect)(()=>{e||m()},[m,e]),(0,j.useEffect)(()=>{if(!e)return;let b=()=>{s.current=null,r.current.end()},C=()=>{document.hidden&&b()};return window.addEventListener("blur",b),window.addEventListener("pointercancel",b),window.addEventListener("pointerup",b),document.addEventListener("visibilitychange",C),()=>{window.removeEventListener("blur",b),window.removeEventListener("pointercancel",b),window.removeEventListener("pointerup",b),document.removeEventListener("visibilitychange",C)}},[e]);let v=(0,j.useCallback)(b=>{!e||b.button!==0||(b.preventDefault(),M(),s.current=b.pointerId,u.current?.setPointerCapture(b.pointerId),f(x(b.clientX,b.clientY)))},[f,M,e,x]),T=(0,j.useCallback)(b=>{!e||s.current!==b.pointerId||(b.preventDefault(),c(x(b.clientX,b.clientY)))},[c,e,x]),H=(0,j.useCallback)(b=>{!e||s.current!==b.pointerId||(s.current=null,r.current.end(),M(),u.current?.hasPointerCapture(b.pointerId)&&u.current.releasePointerCapture(b.pointerId))},[M,e]),E=(0,j.useCallback)(()=>{s.current=null,r.current.end(),M()},[M]),R=(0,j.useCallback)(b=>{U(r.current.begin(b)),r.current.end()},[U]);return(0,S.jsx)("div",{className:y,onLostPointerCapture:E,onPointerCancel:H,onPointerDown:v,onPointerMove:T,onPointerUp:H,ref:u,style:d,role:"grid","aria-label":"Vista del suelo",children:t.cells.map(b=>{let C={backgroundColor:b.color,gridColumnStart:b.x+1,gridRowStart:b.y+1},Tt=`${b.x}-${b.y}`,Pt=h.has(`${b.x}:${b.y}`),Xo={className:"ml-floor-tile",style:C,"data-tile-x":b.x,"data-tile-y":b.y,"data-color":b.color,"data-active":Pt?"true":void 0};return e?(0,ao.createElement)("button",{...Xo,"aria-label":`Baldosa ${b.x}, ${b.y}`,"aria-pressed":Pt,key:Tt,onClick:Vp=>{Vp.detail===0&&R(b)},type:"button"}):(0,ao.createElement)("span",{...Xo,"aria-hidden":"true",key:Tt})})})}function F1(t){let e=t.replace("#","").trim(),l=e.length===3?e.split("").map(i=>i+i).join(""):e.padEnd(6,"0").slice(0,6),a=Number.parseInt(l,16);return Number.isFinite(a)?`${a>>16&255}, ${a>>8&255}, ${a&255}`:"255, 255, 255"}var yo={};Tn(yo,{PlayerDisplay:()=>Wy,ballColor:()=>fo,brickColors:()=>ho,createGame:()=>yn,finishedFrame:()=>ap,finishedSnapshot:()=>ip,initEvents:()=>tp,manifest:()=>xe,paddleColor:()=>mo,runningFrame:()=>ep,runningSnapshot:()=>lp});function io(t,e){let l=e.centerX??(t.width-1)/2,a=e.centerY??(t.height-1)/2,i=Math.max(0,e.radius),n=Math.max(0,e.thickness??1);jy(t,e.color,(u,s)=>{let r=Qy(u,s,l,a);return{distance:r,phase:Math.abs(r-i),selected:Math.abs(r-i)<=n}},0)}function dn(t,e){let l=e.centerX??(t.width-1)/2,a=e.centerY??(t.height-1)/2,i=Math.max(1,Math.floor(e.period??7)),n=Math.min(i,Math.max(1,Math.floor(e.bandWidth??2))),u=Math.floor(e.step);jy(t,e.color,(s,r)=>{let o=Math.floor(Qy(s,r,l,a)),h=k1(o+u,i);return{distance:o,phase:h,selected:h<n}},u)}function jy(t,e,l,a){for(let i=0;i<t.height;i+=1)for(let n=0;n<t.width;n+=1){let u=l(n,i);if(!u.selected)continue;let s=typeof e=="function"?e({distance:u.distance,phase:u.phase,step:a,x:n,y:i}):e;s&&(t.cells[i*t.width+n]={x:n,y:i,color:s})}}function Qy(t,e,l,a){return Math.abs(t-l)+Math.abs(e-a)}function k1(t,e){return(t%e+e)%e}var G=16,_=32,W1=137,P1=0,$1=4294967295,Zy=G*_,I1=2e3,tg=650,eg=["easy","medium","hard","expert"],lg=50,Pg=1e3/lg;function Ky(t,e){return Number.isInteger(t)&&Number.isInteger(e)&&t>=0&&t<G&&e>=0&&e<_}function ce(t,e){return{seed:ag(t.seed),playerCount:ig(t.playerCount,e),players:Array.isArray(t.players)?t.players:[],durationMillis:Vy(t.durationMillis,e.defaultDurationMillis),nowMillis:Vy(t.nowMillis,0),difficulty:sg(t.difficulty,e),options:rg(t.options,e)}}function ag(t){let e=typeof t=="number"&&Number.isFinite(t)?Math.trunc(t):W1;return it(e,P1,$1)}function ig(t,e){let l=typeof t=="number"&&Number.isFinite(t)?Math.round(t):ng(e);return e.players.allowAny===!0&&l===0?0:it(l,e.players.min,e.players.max)}function ng(t){return t.players.allowAny?0:t.players.min}function Vy(t,e){return typeof t=="number"&&Number.isFinite(t)?Math.max(0,t):e}function ug(t){let e=t.config?.difficulty?.options;return e?.length?[...e]:[...eg]}function sg(t,e){let l=ug(e),a=e.config?.difficulty?.default,i=a&&l.includes(a)?a:l.includes("medium")?"medium":l[0]??"medium";return t&&l.includes(t)?t:i}function rg(t,e){let l=t??{};return Object.fromEntries((e.config?.vars??[]).map(a=>[a.key,Jy(a,l[a.key])]))}function Jy(t,e){if(t.type==="bool")return e===!0||e==="true"?!0:e===!1||e==="false"?!1:t.default;if(t.type==="enum"){let u=String(e??t.default);return t.options.some(r=>r.value===u)?u:t.default}let l=typeof e=="number"&&Number.isFinite(e)?e:typeof e=="string"&&e.trim()!==""?Number(e):Number.NaN,a=Number.isFinite(l)?l:t.default,i=t.type==="int"?Math.round(a):a;return it(i,t.min??-1/0,t.max??1/0)}function hn(t,e){return Jy(e,t[e.key])}function Se(t="#05070a"){let e=[];for(let l=0;l<_;l+=1)for(let a=0;a<G;a+=1)e.push({x:a,y:l,color:t});return{width:G,height:_,cells:e}}function A(t,e,l,a){Ky(e,l)&&(t.cells[l*t.width+e]={x:e,y:l,color:a})}function V(t,e,l,a,i,n){for(let u=l;u<l+i;u+=1)for(let s=e;s<e+a;s+=1)A(t,s,u,n)}function N(t,e,l){return{cue:t,message:e.trimEnd().replace(/\.+$/u,""),atMillis:l}}function Ee(t){let e=t>>>0;return e===0&&(e=1),{next(){return e=Math.imul(e,1664525)+1013904223>>>0,e/4294967296},int(l){if(!Number.isFinite(l)||l<=0)throw new Error("maxExclusive must be greater than zero");return Math.floor(this.next()*l)},range(l,a){if(a<l)throw new Error("maxInclusive must be greater than or equal to minInclusive");return l+this.int(a-l+1)}}}function ii(t,e=[]){let l=["#35d7ff","#ff3bd7","#ffe176","#5fff9e"];return Array.from({length:t},(a,i)=>({index:i,label:e[i]?.label||e[i]?.name||`Player ${i+1}`,color:e[i]?.color||l[i%l.length]||l[0],score:0,lives:-1}))}function it(t,e,l){return Math.min(l,Math.max(e,t))}function as(t,e={}){if(!Number.isInteger(t)||t<1)throw new Error("player ready zone count must be a positive integer");let l=it(Math.round(e.minX??0),0,G-1),a=it(Math.round(e.maxX??G-1),l,G-1),i=it(Math.round(e.minY??0),0,_-1),u=it(Math.round(e.maxY??_-1),i,_-1)-i+1;if(t>u)throw new Error("player ready zone count cannot exceed the available floor rows");return Array.from({length:t},(s,r)=>({minX:l,maxX:a,minY:i+Math.floor(u*r/t),maxY:i+Math.floor(u*(r+1)/t)-1}))}function Ol(t,e,l=0){return new uo(t,e,l)}function so(t){return Fy(t.mode==="player-ready"?t.countdownMillis:void 0,I1)}function mn(t){return Number.isFinite(t)?Math.max(0,t):0}var uo=class{constructor(e,l,a){this.policy=e;this.zones=l;if(e.mode==="player-ready"&&l.length===0)throw new Error("player-ready games require at least one presence zone");this.countdownDuration=so(e),this.releaseGraceMillis=Fy(e.mode==="player-ready"?e.releaseGraceMillis:void 0,tg),this.zoneHeld=Array.from({length:l.length},()=>0),this.zoneGraceUntil=Array.from({length:l.length},()=>0),this.phase=e.mode==="immediate"?"running":"waiting";for(let i=0;i<_;i+=1)for(let n=0;n<G;n+=1)this.tileZones[i*G+n]=l.findIndex(u=>cg(n,i,u));this.reset(a)}policy;zones;countdownDuration;releaseGraceMillis;tileZones=new Int16Array(Zy).fill(-1);tileHeld=new Uint8Array(Zy);zoneHeld;zoneGraceUntil;phase;startAtMillis=0;reset(e=0){return this.tileHeld.fill(0),this.zoneHeld.fill(0),this.zoneGraceUntil.fill(0),this.phase=this.policy.mode==="immediate"?"running":"waiting",this.startAtMillis=mn(e),this.state(e)}update(e){if(!Ky(e.x,e.y))return this.tick(e.atMillis);let l=e.y*G+e.x,a=this.tileZones[l]??-1,i=this.tileHeld[l]===1;return a>=0&&i!==e.pressed&&(this.tileHeld[l]=e.pressed?1:0,e.pressed?(this.zoneHeld[a]=(this.zoneHeld[a]??0)+1,this.zoneGraceUntil[a]=0):(this.zoneHeld[a]=Math.max(0,(this.zoneHeld[a]??0)-1),this.zoneHeld[a]===0&&(this.zoneGraceUntil[a]=mn(e.atMillis)+this.releaseGraceMillis))),this.tick(e.atMillis)}tick(e){if(this.policy.mode==="immediate"||this.phase==="running")return"none";let l=mn(e),a=this.readyPlayerCount(l)===this.zones.length;return this.phase==="waiting"&&a?(this.phase="starting",this.startAtMillis=l+this.countdownDuration,"players-ready"):this.phase==="starting"&&!a?(this.phase="waiting",this.startAtMillis=0,"players-left"):this.phase==="starting"&&l>=this.startAtMillis?(this.phase="running","started"):"none"}state(e){let l=mn(e);return{phase:this.phase,readyPlayers:this.readyPlayerCount(l),requiredPlayers:this.zones.length,countdownMillis:this.phase==="starting"?Math.max(0,this.startAtMillis-l):0}}zoneReady(e,l){let a=this.zoneGraceUntil[e]??0;return(this.zoneHeld[e]??0)>0||a>0&&a>=mn(l)}readyPlayerCount(e){return this.zones.reduce((l,a,i)=>l+Number(this.zoneReady(i,e)),0)}};function Fy(t,e){return t!==void 0&&Number.isFinite(t)&&t>0?t:e}function cg(t,e,l){return t>=l.minX&&t<=l.maxX&&e>=l.minY&&e<=l.maxY}function ro(t){return`#${no(t.r)}${no(t.g)}${no(t.b)}`}function is(t,e){return{r:it(Math.round(t.r*e/100),0,255),g:it(Math.round(t.g*e/100),0,255),b:it(Math.round(t.b*e/100),0,255)}}function ky(t,e){return{r:it(t.r+e.r,0,255),g:it(t.g+e.g,0,255),b:it(t.b+e.b,0,255)}}function no(t){return it(Math.round(t),0,255).toString(16).padStart(2,"0")}function Fe(t){let e=Math.max(0,Math.ceil(t)),l=Math.ceil(e/1e3),a=Math.floor(l/60),i=l%60;return`${a}:${i.toString().padStart(2,"0")}`}var kt=gt(Ft(),1);function Wy({snapshot:t,frame:e}){let l=t.phase==="ready"?"Pisa abajo para mover y lanzar":t.lastEventMessage||"Rompe todos los bloques",a=t.success?"green":t.phase==="finished"?"red":t.phase==="ready"?"yellow":"cyan";return(0,kt.jsx)(Rl,{title:t.label,phase:t.phase,children:(0,kt.jsxs)("div",{className:"ml-solo-display arkanoid-display",children:[(0,kt.jsx)(ei,{snapshot:t}),(0,kt.jsxs)("div",{className:"ml-solo-summary",children:[(0,kt.jsxs)(Dl,{columns:3,className:"ml-solo-number-row",children:[(0,kt.jsx)(ft,{label:"Bloques",tone:"pink",value:`${t.score}/${t.totalBricks}`}),(0,kt.jsx)(ft,{label:"Vidas",tone:"neutral",value:(0,kt.jsx)(li,{lives:t.lives,maxLives:t.maxLives})}),(0,kt.jsx)(ft,{label:"Tiempo",tone:"yellow",value:Fe(t.elapsedMillis)})]}),(0,kt.jsx)(ft,{className:"ml-solo-message",label:"Estado",tone:a,value:l})]}),e?(0,kt.jsx)(ai,{className:"ml-solo-floor",frame:e,label:"Juego en el suelo"}):null]})})}var xe={id:"arkanoid",label:"Arkanoid",description:"Single-player floor Arkanoid with step-controlled paddle movement and deterministic brick physics.",availability:{development:!0,production:!0},catalog:{category:"individual",color:"#ff9f45",durationLabel:"Sin l\xEDmite",modeLabel:"Arkanoid",audioLabel:"Efectos",rules:["Pisa la zona inferior para mover la pala","Rompe todos los bloques sin perder la pelota"]},players:{allowAny:!0,min:1,max:1},start:{mode:"player-ready"},config:{difficulty:{default:"medium",options:["easy","medium","hard","expert"]}},defaultDurationMillis:0,display:{entry:"./display"},preview:{seed:137,playerCount:1,difficulty:"medium",actions:[{atMillis:100,type:"press",x:7,y:30},{atMillis:2150,type:"release",x:7,y:30},{atMillis:2250,type:"press",x:9,y:30},{atMillis:2450,type:"release",x:9,y:30}],captureStartMillis:2200,frameCount:18,frameIntervalMillis:120},tags:["arcade","single-player","typescript"]};var fo="#ffffff",mo="#35d7ff",ho=["#ff3151","#ff8a2a","#ffd45f","#74e58d"],og="#ff3151",fg="#03070c",dg="#06101d",mg="#145cff",hg="#37101a",yg="#ff3151",Te="#74e58d",Py=["#9ddfff","#4b91b8","#21445b"],pg=4,$y=2,vg=3,ia=5,Nl=29,Hl=24,co=3,gg=12;function yn(t){return new oo(t)}var oo=class{ball={x:7,y:Nl-1,dx:1,dy:-1};ballMoves=0;ballTrail=[];bricks=[];config;lastControlX=7;lastEvent=N("none","Listo",0);lastMoveMillis=0;lives=co;nowMillis=0;paddleX=Math.floor((G-ia)/2);phase="ready";players=[];rng;readyGate;score=0;startedAtMillis=0;constructor(e){this.config=ce(e,xe),this.rng=Ee(this.config.seed),this.readyGate=Ol(xe.start,[{minX:0,maxX:G-1,minY:Hl,maxY:_-1}],this.config.nowMillis),this.resetState(this.config.nowMillis)}init(e){return this.nowMillis=e,this.readyGate.reset(e),this.phase="waiting",this.attachBall(),this.lastEvent=N("ready","Esperando jugador abajo",e),[this.lastEvent]}press(e){return this.nowMillis=e.atMillis,e.y<Hl||e.y>=_?[]:(e.pressed&&this.movePaddle(e.x),this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update(e),e.atMillis):this.phase==="ready"&&e.pressed?this.launchBall(e.atMillis):[])}release(e){return this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update({...e,pressed:!1}),e.atMillis):[]}tick(e){if(this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting")return this.applyReadyTransition(this.readyGate.tick(e.atMillis),e.atMillis);if(this.phase!=="running")return[];let l=[],a=Iy(this.config.difficulty);for(let i=0;i<gg&&!(e.atMillis-this.lastMoveMillis<a);i+=1){this.lastMoveMillis+=a;let n=this.moveBall(this.lastMoveMillis);if(n&&l.push(n),this.phase!=="running")break}return this.recordEvents(l)}render(){let e=Se(fg);V(e,0,Hl,G,_-Hl,dg),V(e,0,_-1,G,1,hg);for(let l of this.bricks)l.alive&&V(e,l.x,l.y,l.width,1,l.color);return(this.phase==="waiting"||this.phase==="starting")&&this.drawPlayerStart(e),this.phase==="finished"&&this.score===this.bricks.length&&Mg(e),this.ballTrail.forEach((l,a)=>{let i=Py[a];i&&A(e,l.x,l.y,i)}),(this.phase!=="finished"||this.lives>0)&&A(e,this.ball.x,this.ball.y,fo),V(e,this.paddleX,Nl,ia,1,this.phase==="finished"&&this.lives===0?yg:mo),A(e,this.lastControlX,_-1,mg),e}snapshot(){let e=this.bricksRemaining(),l=this.readyGate.state(this.nowMillis);return{currentGame:xe.id,label:xe.label,phase:this.phase,playerCount:this.config.playerCount,players:this.players,score:this.score,lives:this.lives,maxLives:co,elapsedMillis:Math.max(0,this.nowMillis-this.startedAtMillis),remainingMillis:0,activeTargets:e,success:e===0,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?l.countdownMillis:0,readyPlayers:l.readyPlayers,requiredPlayers:l.requiredPlayers,matchTarget:this.bricks.length,ball:{...this.ball},ballMoves:this.ballMoves,ballSpeed:1e3/Iy(this.config.difficulty),bricksRemaining:e,launched:this.phase==="running",paddleWidth:ia,paddleX:this.paddleX,totalBricks:this.bricks.length}}reset(e={}){this.config=ce({...this.config,...e},xe),this.rng=Ee(this.config.seed),this.resetState(this.config.nowMillis)}applyReadyTransition(e,l){return e==="players-ready"?(this.phase="starting",this.lastEvent=N("ready","Jugador listo",l),[this.lastEvent]):e==="players-left"?(this.phase="waiting",this.lastEvent=N("ready","Vuelve a la zona iluminada",l),[this.lastEvent]):e==="started"?this.launchBall(l):[]}launchBall(e){let l=this.phase==="waiting"||this.phase==="starting";return this.phase="running",l&&(this.startedAtMillis=e),this.ball={x:this.paddleCenter(),y:Nl-1,dx:this.rng.next()<.5?-1:1,dy:-1},this.ballTrail=[],this.lastMoveMillis=e,this.lastEvent=N("start","Pelota en juego",e),[this.lastEvent]}attachBall(){this.ball={x:this.paddleCenter(),y:Nl-1,dx:this.ball.dx,dy:-1},this.ballTrail=[]}brickAt(e,l){return this.bricks.find(a=>a.alive&&a.y===l&&e>=a.x&&e<a.x+a.width)}bricksRemaining(){return this.bricks.reduce((e,l)=>e+Number(l.alive),0)}commitBall(e){this.ballTrail=[{x:this.ball.x,y:this.ball.y},...this.ballTrail].slice(0,Py.length),this.ball=e,this.ballMoves+=1}loseLife(e){return this.lives-=1,this.players=this.scoredPlayers(),this.ballTrail=[],this.lives<=0?(this.phase="finished",N("fail","Sin vidas",e)):(this.phase="ready",this.attachBall(),N("fail","Vida perdida, pisa abajo para lanzar",e))}moveBall(e){let l=this.ball.dx,a=this.ball.dy,i=this.ball.x+l,n=this.ball.y+a;(i<0||i>=G)&&(l=l===1?-1:1,i=this.ball.x+l),n<1&&(a=1,n=this.ball.y+a);let u=this.brickAt(i,n);if(u)return u.alive=!1,this.score+=1,this.players=this.scoredPlayers(),this.ball={...this.ball,dx:l,dy:a===1?-1:1},this.ballMoves+=1,this.bricksRemaining()===0?(this.phase="finished",N("win","Muro completado",e)):N("hit",`Bloque ${this.score} de ${this.bricks.length}`,e);if(a>0&&n===Nl&&i>=this.paddleX&&i<this.paddleX+ia){let s=i-this.paddleCenter();return s<0?l=-1:s>0?l=1:l=this.rng.next()<.5?-1:1,Math.abs(s)===1&&this.rng.next()<.35&&(l=l===1?-1:1),this.commitBall({x:i,y:Nl-1,dx:l,dy:-1}),N("coin","Rebote",e)}if(n>=_)return this.loseLife(e);this.commitBall({x:i,y:n,dx:l,dy:a})}movePaddle(e){let l=Math.floor(ia/2),a=it(Math.round(e),l,G-1-l);this.paddleX=a-l,this.lastControlX=it(Math.round(e),0,G-1),(this.phase==="ready"||this.phase==="waiting"||this.phase==="starting")&&this.attachBall()}drawPlayerStart(e){if(this.phase==="waiting"){let a=Hl+Math.floor(this.nowMillis/150)%(_-Hl);for(let i=Hl;i<_;i+=1)for(let n=0;n<G;n+=1)(i===a||n===0||n===G-1)&&A(e,n,i,i===a?"#35d7ff":"#0b4260");return}let l=Math.floor(this.nowMillis/125)%4;for(let a=0;a<_;a+=1)for(let i=0;i<G;i+=1)(Math.abs(i-this.paddleCenter())+Math.abs(a-Nl)+l)%6===0&&A(e,i,a,a>=Hl?"#ffe176":"#176783")}paddleCenter(){return this.paddleX+Math.floor(ia/2)}recordEvents(e){let l=e.at(-1);return l&&(this.lastEvent=l),e}resetState(e){this.bricks=bg(),this.lives=co,this.nowMillis=e,this.startedAtMillis=e,this.lastMoveMillis=e,this.paddleX=Math.floor((G-ia)/2),this.lastControlX=this.paddleCenter(),this.readyGate.reset(e),this.phase="waiting",this.score=0,this.ballMoves=0,this.ball={x:this.paddleCenter(),y:Nl-1,dx:1,dy:-1},this.ballTrail=[],this.players=this.scoredPlayers(),this.lastEvent=N("ready","Esperando jugador abajo",e)}scoredPlayers(){return ii(this.config.playerCount,this.config.players).map(e=>({...e,lives:this.lives,score:this.score}))}};function bg(){let t=[],e=0;for(let l=0;l<pg;l+=1)for(let a=0;a<G;a+=$y)t.push({alive:!0,color:ho[l]??og,id:e,width:$y,x:a,y:vg+l}),e+=1;return t}function Mg(t){V(t,2,13,G-4,1,Te),V(t,2,19,G-4,1,Te),V(t,2,13,1,7,Te),V(t,G-3,13,1,7,Te),A(t,5,16,Te),A(t,6,17,Te),A(t,7,18,Te),A(t,8,17,Te),A(t,9,16,Te),A(t,10,15,Te)}function Iy(t){switch(t){case"easy":return 240;case"hard":return 150;case"expert":return 120;default:return 190}}var ni=yn({playerCount:1,difficulty:"medium"}),tp=ni.init(0);ni.press({x:7,y:30,pressed:!0,atMillis:100});ni.tick({atMillis:2100});ni.tick({atMillis:3300});var ep=ni.render(),lp=ni.snapshot(),ns=yn({playerCount:1,difficulty:"easy"});ns.init(0);Sg(ns);var ap=ns.render(),ip=ns.snapshot();function Sg(t){t.press({x:7,y:30,pressed:!0,atMillis:50}),t.tick({atMillis:2050});let e=2100;for(let l=0;l<24e3&&t.snapshot().phase!=="finished";l+=1){let a=t.snapshot();t.press({x:a.ball.x,y:30,pressed:!0,atMillis:e}),t.tick({atMillis:e}),e+=50}}var Eo={};Tn(Eo,{PlayerDisplay:()=>np,createGame:()=>si,damagedFrame:()=>pp,damagedSnapshot:()=>vp,hazardColor:()=>us,helloWorldCelebrationMillis:()=>gn,helloWorldHazards:()=>bn,helloWorldStartingLives:()=>vn,helloWorldTargetScore:()=>ui,helloWorldTargets:()=>ss,idleColor:()=>bo,initEvents:()=>sp,losingFrame:()=>Mp,losingSnapshot:()=>Sp,manifest:()=>Ge,runningFrame:()=>mp,runningSnapshot:()=>hp,startingFrame:()=>op,startingSnapshot:()=>fp,targetColor:()=>pn,trailColor:()=>go,waitingFrame:()=>rp,waitingSnapshot:()=>cp,winningFrame:()=>gp,winningSnapshot:()=>bp});var At=gt(Ft(),1);function np({snapshot:t,frame:e}){let l=t.matchTarget??5,a=t.phase==="finished",i=a?t.success?"is-result-win":"is-result-lose":"",n=t.success?"green":t.lastEventCue==="fail"?"red":"cyan",u=Math.max(1,Math.ceil(t.celebrationMillis/1e3)),s=a?(0,At.jsxs)("span",{className:"hello-world-result-copy",children:[(0,At.jsx)("span",{children:t.success?"\xA1Ganaste!":t.lastEventMessage}),(0,At.jsxs)("small",{children:["Reinicio en ",u]})]}):t.lastEventMessage||"Verde suma, rojo resta una vida";return(0,At.jsx)(Rl,{title:t.label,phase:t.phase,children:(0,At.jsxs)("div",{className:`ml-solo-display hello-world-display ${i}`.trim(),children:[(0,At.jsx)(ei,{snapshot:t}),(0,At.jsxs)("div",{className:"ml-solo-summary",children:[(0,At.jsxs)(Dl,{columns:3,className:"ml-solo-number-row",children:[(0,At.jsx)(ft,{label:"Meta",tone:"green",value:`${t.score}/${l}`}),(0,At.jsx)(ft,{label:"Vidas",tone:"red",value:(0,At.jsx)(li,{lives:t.lives,maxLives:t.maxLives})}),(0,At.jsx)(ft,{label:"Tiempo",tone:"yellow",value:Fe(t.remainingMillis)})]}),(0,At.jsx)(ft,{className:"ml-solo-message",label:a?t.success?"Victoria":"Fin de la partida":"Estado",tone:n,value:s})]}),e?(0,At.jsx)(ai,{className:"ml-solo-floor",frame:e,label:"Recorrido en el suelo"}):null]})})}var Ge={id:"hello-world",label:"Hola Mundo",description:"Sigue los objetivos verdes y evita las baldosas rojas.",availability:{development:!0,production:!1},catalog:{category:"individual",color:"#35d7ff",durationLabel:"30s",modeLabel:"Demostraci\xF3n",audioLabel:"Efectos",rules:["Sigue los objetivos verdes","Evita las baldosas rojas"]},players:{allowAny:!0,min:1,max:1},start:{mode:"player-ready"},defaultDurationMillis:3e4,display:{entry:"./display"},preview:{seed:2024,playerCount:1,actions:[{atMillis:100,type:"press",x:8,y:16},{atMillis:2150,type:"release",x:8,y:16},{atMillis:2300,type:"press",x:4,y:4},{atMillis:2320,type:"release",x:4,y:4}],captureStartMillis:2200,frameCount:18,frameIntervalMillis:120},tags:["example","ci","typescript"]};var pn="#7ee787",us="#ff2036",go="#1f6feb",bo="#05070a",ui=5,vn=3,gn=5e3,po=[{x:3,y:5},{x:12,y:5},{x:8,y:16},{x:3,y:26},{x:12,y:26}],up=[{x:12,y:15},{x:4,y:15},{x:8,y:28}];function si(t){return new vo(t)}var vo=class{config;finishedAtMillis;hazardsHit=0;lastEvent=N("none","Listo",0);lives=vn;nowMillis=0;phase="ready";players;readyGate;score=0;startedAtMillis=0;constructor(e){this.config=ce(e,Ge),this.readyGate=Ol(Ge.start,as(1),this.config.nowMillis),this.players=this.scoredPlayers()}init(e){return this.resetState(e),[this.lastEvent]}press(e){if(this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting")return this.applyReadyTransition(this.readyGate.update(e),e.atMillis);if(this.phase!=="running"||!e.pressed)return[];let l=this.currentHazard();if(l&&e.x===l.x&&e.y===l.y)return this.loseLife(e.atMillis);let a=this.currentTarget();return!a||e.x!==a.x||e.y!==a.y?[]:(this.score+=1,this.players=this.scoredPlayers(),this.score>=ui?this.finishGame(!0,"\xA1Hola Mundo!",e.atMillis):(this.lastEvent=N("hit",`Hola ${this.score}`,e.atMillis),[this.lastEvent]))}release(e){return this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update({...e,pressed:!1}),e.atMillis):[]}tick(e){if(this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting")return this.applyReadyTransition(this.readyGate.tick(e.atMillis),e.atMillis);if(this.phase==="finished"){let l=this.finishedAtMillis??e.atMillis;return e.atMillis-l<gn?[]:(this.resetState(e.atMillis),[this.lastEvent])}return this.phase!=="running"||this.remainingMillis()>0?[]:this.finishGame(!1,"Tiempo agotado",e.atMillis)}render(){let e=Se(bo);if(this.phase==="waiting"||this.phase==="starting")return this.drawPlayerStart(e),e;for(let i of po.slice(0,this.score))A(e,i.x,i.y,go);if(this.phase==="finished")return this.drawResultAnimation(e),e;let l=this.currentTarget();l&&(V(e,l.x-1,l.y-1,3,3,pn),A(e,l.x,l.y,"#ffffff"));let a=this.currentHazard();return a&&A(e,a.x,a.y,us),e}snapshot(){let e=this.readyGate.state(this.nowMillis);return{currentGame:Ge.id,label:Ge.label,phase:this.phase,playerCount:this.config.playerCount,players:this.players,score:this.score,lives:this.lives,maxLives:vn,elapsedMillis:this.elapsedMillis(),remainingMillis:this.remainingMillis(),activeTargets:this.phase==="running"?+!!this.currentTarget()+ +!!this.currentHazard():0,success:this.phase==="finished"&&this.score>=ui,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?e.countdownMillis:0,readyPlayers:e.readyPlayers,requiredPlayers:e.requiredPlayers,matchTarget:ui,celebrationDurationMillis:gn,celebrationMillis:this.celebrationMillis(),hazard:this.phase==="running"?this.currentHazard():void 0}}reset(e={}){this.config=ce({...this.config,...e},Ge),this.resetState(this.config.nowMillis)}applyReadyTransition(e,l){return e==="players-ready"?(this.phase="starting",this.lastEvent=N("ready","Jugador listo",l),[this.lastEvent]):e==="players-left"?(this.phase="waiting",this.lastEvent=N("ready","Vuelve a la zona iluminada",l),[this.lastEvent]):e==="started"?(this.phase="running",this.startedAtMillis=l,this.lastEvent=N("start","Verde suma, rojo resta una vida",l),[this.lastEvent]):[]}celebrationMillis(){return this.phase!=="finished"||this.finishedAtMillis===void 0?0:Math.max(0,gn-(this.nowMillis-this.finishedAtMillis))}currentHazard(){return up[this.hazardsHit]}currentTarget(){return po[this.score]}drawPlayerStart(e){let l=Math.floor(G/2),a=Math.floor(_/2),i=Math.floor(this.nowMillis/(this.phase==="starting"?110:180)),n=this.phase==="starting"?"#ffe176":pn,u=this.phase==="starting"?2+i%10:3+i%4;io(e,{centerX:l,centerY:a,color:n,radius:u})}drawResultAnimation(e){let l=Math.floor((this.nowMillis-(this.finishedAtMillis??this.nowMillis))/140);if(this.score>=ui){dn(e,{color:({x:i,y:n})=>(i+n+l)%3===0?"#ffffff":pn,step:l});return}for(let i=0;i<_;i+=1)for(let n=0;n<G;n+=1)((n+i+l)%8<=1||(n-i-l+64)%11===0)&&A(e,n,i,(n+l)%4===0?"#ff8090":us)}elapsedMillis(){if(this.phase==="waiting"||this.phase==="starting")return 0;let e=this.phase==="finished"&&this.finishedAtMillis!==void 0?this.finishedAtMillis:this.nowMillis;return Math.max(0,e-this.startedAtMillis)}finishGame(e,l,a){return this.phase="finished",this.finishedAtMillis=a,this.lastEvent=N(e?"win":"fail",l,a),[this.lastEvent]}loseLife(e){return this.lives-=1,this.hazardsHit+=1,this.lives<=0?this.finishGame(!1,"Sin vidas",e):(this.lastEvent=N("fail",`Vida perdida, quedan ${this.lives}`,e),[this.lastEvent])}remainingMillis(){return Math.max(0,this.config.durationMillis-this.elapsedMillis())}resetState(e){this.readyGate.reset(e),this.finishedAtMillis=void 0,this.hazardsHit=0,this.lastEvent=N("ready","Esperando jugador",e),this.lives=vn,this.nowMillis=e,this.phase="waiting",this.score=0,this.startedAtMillis=e,this.players=this.scoredPlayers()}scoredPlayers(){return ii(this.config.playerCount,this.config.players).map(e=>({...e,score:this.score}))}};function bn(){return up.map(t=>({...t}))}function ss(){return po.map(t=>({...t}))}var Mo=si({seed:2024,playerCount:1,durationMillis:3e4}),sp=Mo.init(0),rp=Mo.render(),cp=Mo.snapshot(),Mn=si({seed:2024,playerCount:1,durationMillis:3e4});Mn.init(0);Mn.press({x:8,y:16,pressed:!0,atMillis:100});Mn.tick({atMillis:1100});var op=Mn.render(),fp=Mn.snapshot(),dp=os(),mp=dp.render(),hp=dp.snapshot(),So=os(),yp=bn()[0];if(!yp)throw new Error("Hola Mundo requires at least one hazard fixture.");So.press({...yp,pressed:!0,atMillis:2200});var pp=So.render(),vp=So.snapshot(),rs=os();ss().forEach((t,e)=>{rs.press({...t,pressed:!0,atMillis:2200+e*100})});rs.tick({atMillis:4100});var gp=rs.render(),bp=rs.snapshot(),cs=os();bn().forEach((t,e)=>{cs.press({...t,pressed:!0,atMillis:2200+e*100})});cs.tick({atMillis:4100});var Mp=cs.render(),Sp=cs.snapshot();function os(){let t=si({seed:2024,playerCount:1,durationMillis:3e4});return t.init(0),t.press({x:8,y:16,pressed:!0,atMillis:100}),t.tick({atMillis:2100}),t}var Oo={};Tn(Oo,{PlayerDisplay:()=>Ep,createGame:()=>ua,damagedFrame:()=>Rp,damagedSnapshot:()=>Dp,failedFrame:()=>Hp,failedSnapshot:()=>Up,finishedFrame:()=>Op,finishedSnapshot:()=>Np,gameWinAnimationMillis:()=>fs,initEvents:()=>zp,manifest:()=>Ae,meteorCoreColor:()=>_o,meteorDifficultyProfile:()=>Gp,meteorImpactColor:()=>ds,meteorImpactVisibleMillis:()=>zo,meteorWarningColor:()=>Co,playerFootprintColor:()=>Ro,runningFrame:()=>Cp,runningSnapshot:()=>_p,startingLives:()=>Sn});var Wt=gt(Ft(),1);function Ep({snapshot:t,frame:e}){let l=t.phase==="finished"?t.success?"\xA1Tormenta superada!":"La tormenta te alcanz\xF3":t.lastEventMessage||"Esquiva las zonas rojas",a=t.success?"green":t.lives===0?"red":"cyan";return(0,Wt.jsx)(Rl,{title:t.label,phase:t.phase,children:(0,Wt.jsxs)("div",{className:"ml-solo-display meteor-dodge-display",children:[(0,Wt.jsx)(ei,{snapshot:t}),(0,Wt.jsxs)("div",{className:"ml-solo-summary",children:[(0,Wt.jsxs)(Dl,{columns:3,className:"ml-solo-number-row",children:[(0,Wt.jsx)(ft,{label:"Esquivados",tone:"cyan",value:t.dodgedMeteors}),(0,Wt.jsx)(ft,{label:"Vidas",tone:"neutral",value:(0,Wt.jsx)(li,{lives:t.lives,maxLives:t.maxLives})}),(0,Wt.jsx)(ft,{label:"Tiempo",tone:"yellow",value:Fe(t.remainingMillis)})]}),(0,Wt.jsx)(ft,{className:"ml-solo-message",label:"Estado",tone:a,value:l})]}),e?(0,Wt.jsx)(ai,{className:"ml-solo-floor",frame:e,label:"Tormenta en el suelo"}):null]})})}var Ae={id:"meteor-dodge",label:"Lluvia de meteoritos",description:"Cooperative survival game: dodge telegraphed meteor impacts until the storm passes.",availability:{development:!0,production:!1},catalog:{category:"team",color:"#b987ff",durationLabel:"45s",modeLabel:"Supervivencia",audioLabel:"Efectos",rules:["Esquiva las zonas marcadas","Sobrevive hasta que termine la tormenta"]},players:{allowAny:!0,min:1,max:1},start:{mode:"player-ready",releaseGraceMillis:750},config:{difficulty:{default:"medium",options:["easy","medium","hard","expert"]}},defaultDurationMillis:45e3,display:{entry:"./display"},preview:{seed:137,playerCount:1,difficulty:"medium",actions:[{atMillis:100,type:"press",x:8,y:16},{atMillis:2150,type:"release",x:8,y:16}],captureStartMillis:2200,frameCount:18,frameIntervalMillis:120},tags:["arcade","cooperative","survival","typescript"]};var Sn=3,fs=3e3,zo=450,Co="#ff5a36",_o="#ffe176",ds="#ffffff",Ro="#35d7ff",xo="#02050b",Eg="#050d19",xg="#145cff",Tg="#35d7ff",Gg="#ffe176",To=["#35d7ff","#5fff9e","#ffe176","#ff3bd7","#ffffff"],Go=["#ff3151","#7b1428","#2a0710"],Ag=1e3,zg=350,Cg=64,na={minX:4,maxX:11,minY:12,maxY:19},Do={intervalMillis:1550,largeMeteorEvery:5,radius:1,warningMillis:1350},Tp={easy:{intervalMillis:1900,largeMeteorEvery:0,radius:1,warningMillis:1650},medium:Do,hard:{intervalMillis:1200,largeMeteorEvery:3,radius:1,warningMillis:1050},expert:{intervalMillis:900,largeMeteorEvery:1,radius:2,warningMillis:800}};function ua(t){return new Ao(t)}var Ao=class{config;dodgedMeteors=0;finishedAtMillis=0;lastDamageMillis=Number.NEGATIVE_INFINITY;lastEvent=N("none","Listos para la tormenta",0);lives=Sn;meteors=[];nextMeteorId=1;nextMeteorMillis=0;nowMillis=0;occupiedTiles=new Set;phase="ready";players=[];readyGate;rng;startedAtMillis=0;success=!1;constructor(e){this.config=ce(e,Ae),this.rng=Ee(this.config.seed),this.readyGate=Ol(Ae.start,[na],this.config.nowMillis),this.resetState(this.config.nowMillis)}init(e){return this.resetState(e),this.phase="waiting",this.lastEvent=N("ready","Entra en la zona azul",e),[this.lastEvent]}press(e){return this.nowMillis=e.atMillis,this.updateOccupiedTile(e.x,e.y,e.pressed),this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update(e),e.atMillis):[]}release(e){return this.nowMillis=e.atMillis,this.updateOccupiedTile(e.x,e.y,!1),this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update({...e,pressed:!1}),e.atMillis):[]}tick(e){if(this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting")return this.applyReadyTransition(this.readyGate.tick(e.atMillis),e.atMillis);if(this.phase!=="running")return[];let l=[];this.spawnDueMeteors(e.atMillis);for(let a of this.meteors){if(a.result!=="pending"||e.atMillis<a.impactAtMillis)continue;if(!this.meteorContainsOccupiedTile(a)){a.result="dodged",this.dodgedMeteors+=1;continue}if(a.impactAtMillis-this.lastDamageMillis<Ag){a.result="protected";continue}if(a.result="hit",this.lastDamageMillis=a.impactAtMillis,this.lives=Math.max(0,this.lives-1),this.lives===0){l.push(this.finish(!1,a.impactAtMillis));break}l.push(N("miss","\xA1Impacto! Mu\xE9vete",a.impactAtMillis))}return this.meteors=this.meteors.filter(a=>a.clearAtMillis>e.atMillis),this.phase==="running"&&this.remainingMillis()===0&&l.push(this.finish(!0,e.atMillis)),this.recordEvents(l)}render(){let e=Se(xo);if(this.drawBackground(e),this.phase==="waiting"||this.phase==="starting")return this.drawPlayerStart(e),e;if(this.phase==="finished")return this.success?this.drawWinAnimation(e):this.drawFailAnimation(e),e;for(let l of this.occupiedTiles){let[a,i]=xp(l);A(e,a,i,Ro)}for(let l of this.meteors)this.drawMeteor(e,l);return e}snapshot(){let e=this.readyGate.state(this.nowMillis),l=this.success&&this.phase==="finished"?Math.max(0,Math.min(fs,this.nowMillis-this.finishedAtMillis)):0;return{currentGame:Ae.id,label:Ae.label,phase:this.phase,playerCount:this.config.playerCount,players:this.players.map(a=>({...a,lives:this.lives,score:this.dodgedMeteors})),score:this.dodgedMeteors,lives:this.lives,maxLives:Sn,elapsedMillis:this.elapsedMillis(),remainingMillis:this.remainingMillis(),activeTargets:this.meteors.filter(a=>a.result==="pending").length,success:this.success,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?e.countdownMillis:0,readyPlayers:e.readyPlayers,requiredPlayers:e.requiredPlayers,celebrating:this.success&&this.phase==="finished"&&l<fs,celebrationMillis:l,dodgedMeteors:this.dodgedMeteors,meteors:this.meteors.map(a=>({...a})),stormDurationMillis:this.config.durationMillis}}reset(e={}){this.config=ce({...this.config,...e},Ae),this.rng=Ee(this.config.seed),this.resetState(this.config.nowMillis),this.phase="waiting"}applyReadyTransition(e,l){return e==="players-ready"?(this.phase="starting",this.lastEvent=N("ready","Zona lista",l),[this.lastEvent]):e==="players-left"?(this.phase="waiting",this.lastEvent=N("ready","Vuelve a la zona azul",l),[this.lastEvent]):e==="started"?(this.phase="running",this.startedAtMillis=l,this.nextMeteorMillis=l+zg,this.lastEvent=N("start","Esquiva las zonas rojas",l),[this.lastEvent]):[]}difficultyProfile(){return Tp[this.config.difficulty]??Do}drawBackground(e){for(let l=3;l<_;l+=4)V(e,0,l,G,1,Eg)}drawFailAnimation(e){let l=Math.floor((this.nowMillis-this.finishedAtMillis)/180)%Go.length,a=Go[l]??Go[0];for(let i=0;i<_;i+=1){let n=Math.floor(i*G/_);V(e,n-1,i,3,1,a),V(e,G-n-2,i,3,1,a)}}drawMeteor(e,l){if(l.result==="pending"){let s=Math.floor((this.nowMillis-l.spawnedAtMillis)/160)%2===0,r=l.radius*2+1,o=s?Co:"#6c1b19";V(e,l.x-l.radius,l.y-l.radius,r,r,o),l.radius>0&&V(e,l.x-l.radius+1,l.y-l.radius+1,r-2,r-2,xo),A(e,l.x,l.y,_o);return}let a=Math.max(0,this.nowMillis-l.impactAtMillis),i=Math.min(2,Math.floor(a/130)),n=l.radius+i,u=a<140?ds:l.result==="hit"?"#ff3151":"#ff8a2a";V(e,l.x-n,l.y-n,n*2+1,n*2+1,u),A(e,l.x,l.y,ds)}drawPlayerStart(e){let l=Math.floor(this.nowMillis/(this.phase==="starting"?100:190)),a=this.phase==="starting"?Gg:l%2===0?Tg:xg,i=this.phase==="starting"?l%3:l%2,n=na.minX+i,u=na.minY+i,s=na.maxX-na.minX+1-i*2,r=na.maxY-na.minY+1-i*2;V(e,n,u,s,r,a),s>2&&r>2&&V(e,n+1,u+1,s-2,r-2,xo),A(e,7,15,"#ffffff"),A(e,8,16,"#ffffff")}drawWinAnimation(e){let l=Math.floor(Math.max(0,this.nowMillis-this.finishedAtMillis)/120);dn(e,{color:({distance:a})=>To[(a+l)%To.length]??To[0],step:l})}elapsedMillis(){if(this.phase==="waiting"||this.phase==="starting"||this.phase==="ready")return 0;let e=this.phase==="finished"?this.finishedAtMillis:this.nowMillis;return Math.max(0,e-this.startedAtMillis)}finish(e,l){this.phase="finished",this.success=e,this.finishedAtMillis=l;let a=N(e?"win":"fail",e?"Tormenta superada":"Sin vidas",l);return this.lastEvent=a,a}meteorContainsOccupiedTile(e){for(let l of this.occupiedTiles){let[a,i]=xp(l);if(Math.abs(a-e.x)<=e.radius&&Math.abs(i-e.y)<=e.radius)return!0}return!1}recordEvents(e){let l=e.at(-1);return l&&(this.lastEvent=l),e}remainingMillis(){return Math.max(0,this.config.durationMillis-this.elapsedMillis())}resetState(e){this.readyGate.reset(e),this.rng=Ee(this.config.seed),this.dodgedMeteors=0,this.finishedAtMillis=0,this.lastDamageMillis=Number.NEGATIVE_INFINITY,this.lives=Sn,this.meteors=[],this.nextMeteorId=1,this.nextMeteorMillis=0,this.nowMillis=e,this.occupiedTiles.clear(),this.players=ii(this.config.playerCount,this.config.players),this.startedAtMillis=e,this.success=!1}spawnDueMeteors(e){let l=this.difficultyProfile(),a=0;for(;this.nextMeteorMillis>0&&this.nextMeteorMillis<=e&&a<Cg;){let i=this.nextMeteorId,u=l.largeMeteorEvery>0&&i%l.largeMeteorEvery===0?Math.min(2,l.radius+1):l.radius,s=this.nextMeteorMillis+l.warningMillis;this.meteors.push({clearAtMillis:s+zo,id:i,impactAtMillis:s,radius:u,result:"pending",spawnedAtMillis:this.nextMeteorMillis,x:this.rng.range(u,G-u-1),y:this.rng.range(u,_-u-1)}),this.nextMeteorId+=1,this.nextMeteorMillis+=l.intervalMillis,a+=1}}updateOccupiedTile(e,l,a){if(e<0||e>=G||l<0||l>=_)return;let i=`${e},${l}`;a?this.occupiedTiles.add(i):this.occupiedTiles.delete(i)}};function Gp(t){return{...Tp[t]??Do}}function xp(t){let[e="0",l="0"]=t.split(",");return[Number(e),Number(l)]}var ri=ua({playerCount:1,difficulty:"medium",seed:137}),zp=ri.init(0);ms(ri);ri.release({x:8,y:16,pressed:!1,atMillis:2150});ri.tick({atMillis:4e3});var Cp=ri.render(),_p=ri.snapshot(),En=ua({playerCount:1,difficulty:"easy",seed:137});En.init(0);ms(En);Bp(En,2450);var Rp=En.render(),Dp=En.snapshot(),sa=ua({playerCount:1,difficulty:"medium",durationMillis:4e3,seed:137});sa.init(0);ms(sa);sa.release({x:8,y:16,pressed:!1,atMillis:2150});sa.tick({atMillis:6100});sa.tick({atMillis:7e3});var Op=sa.render(),Np=sa.snapshot(),xn=ua({playerCount:1,difficulty:"easy",seed:137});xn.init(0);ms(xn);var Ap=2450;for(let t=0;t<3;t+=1)Ap=Bp(xn,Ap)+1050;var Hp=xn.render(),Up=xn.snapshot();function ms(t){t.press({x:8,y:16,pressed:!0,atMillis:100}),t.tick({atMillis:2100})}function Bp(t,e){t.release({x:8,y:16,pressed:!1,atMillis:e}),t.tick({atMillis:e});let l=t.snapshot().meteors.find(a=>a.result==="pending");return l?(t.press({x:l.x,y:l.y,pressed:!0,atMillis:l.impactAtMillis-1}),t.tick({atMillis:l.impactAtMillis}),t.release({x:l.x,y:l.y,pressed:!1,atMillis:l.impactAtMillis+1}),l.impactAtMillis+1):e}var qo={};Tn(qo,{PlayerDisplay:()=>Yp,ballColor:()=>ra,blueColor:()=>el,createGame:()=>wp,finishedSnapshot:()=>jp,manifest:()=>Yt,pingPongConfigVars:()=>Ul,redColor:()=>tl,runningFrame:()=>Xp,runningSnapshot:()=>Yo,waitingSnapshot:()=>Bo});var dt=gt(Ft(),1);function No(t){return{"--ping-pong-ball-x":`${3.5+t.y/31*93}%`,"--ping-pong-ball-y":`${18+t.x/15*64}%`}}function Yp({snapshot:t}){let[e,l]=t.players,a=e??{label:"Rojo",score:0,color:"#ff1c28"},i=l??{label:"Azul",score:0,color:"#145cff"},n=Math.max(t.matchTarget,1),u=n*2-1,s=t.phase==="starting"?"Empieza en":"Objetivo",r=t.phase==="starting"?Fe(t.countdownMillis):n,o=t.phase==="starting"?"preparados":"puntos para ganar",h=t.phase==="finished"?"\xDAltimo peloteo":"Peloteo",p=t.phase==="finished"&&t.lastRoundHits>0?t.lastRoundHits:t.roundHits,d=t.lastRoundWinner||"-",y=d===a.label?"red":d===i.label?"blue":"neutral",M=t.phase==="waiting"||t.phase==="starting",x=Math.min(u,t.rounds.length+(t.phase==="running"||t.phase==="starting"?1:0)),U=M?"Listos":"Ronda",f=M?`${t.activeTargets}/2`:`${x}/${u}`,c=t.phase==="running",m=t.phase==="finished"?null:Math.min(u,t.rounds.length+1),v=t.pointScorer===0?"red":t.pointScorer===1?"blue":"none",T=t.winnerIndex===0?"red":t.winnerIndex===1?"blue":"none",H=["ping-pong-display","ml-versus-display",`is-phase-${t.phase}`,t.pointFlashMillis>0?`is-scoring-${v}`:"",t.phase==="finished"?`is-winner-${T}`:""].filter(Boolean).join(" "),E=t.pointScorer===0?a.label:i.label,R=t.winnerIndex===0?a.label:i.label,b=t.phase==="waiting"?`${t.activeTargets}/2 en posici\xF3n`:t.phase==="starting"?"Preparados":t.phase==="finished"?`Victoria ${R}`:t.pointFlashMillis>0?`Punto ${E}`:t.roundHits>0?`${t.roundHits} ${t.roundHits===1?"golpe":"golpes"}`:"Saque",C=t.impact?No(t.impact):void 0;return(0,dt.jsx)(Rl,{title:t.label,phase:t.phase,variant:"versus",children:(0,dt.jsxs)("div",{className:H,style:{"--ping-pong-rally-pace":t.rallyPace},children:[(0,dt.jsx)(wy,{className:"ping-pong-scoreboard",left:a,right:i,target:n,centerLabel:s,centerValue:r,centerCaption:o}),(0,dt.jsxs)("section",{"aria-label":`Trayectoria de la pelota: ${b}`,className:"ping-pong-rally-lane",children:[(0,dt.jsx)("span",{className:"ping-pong-rally-team is-red",children:"Rojo"}),(0,dt.jsx)("span",{className:"ping-pong-rally-team is-blue",children:"Azul"}),(0,dt.jsx)("span",{className:"ping-pong-rally-net","aria-hidden":"true"}),(0,dt.jsx)("span",{className:"ping-pong-rally-scan","aria-hidden":"true"}),t.ballTrail.map((Tt,Pt)=>(0,dt.jsx)("i",{"aria-hidden":"true",className:"ping-pong-ball-trail",style:{...No(Tt),"--ping-pong-trail-index":Pt}},`${Pt}-${Tt.x}-${Tt.y}`)),(0,dt.jsx)("i",{"aria-hidden":"true",className:"ping-pong-ball",style:No(t.ball)}),t.impact?(0,dt.jsx)("i",{"aria-hidden":"true",className:`ping-pong-impact is-${t.impact.team===0?"red":"blue"}`,style:C},t.motionEventId):null,(0,dt.jsx)("strong",{className:"ping-pong-rally-caption",children:b},`caption-${t.motionEventId}`)]}),(0,dt.jsxs)(Dl,{columns:4,className:"ping-pong-metrics",children:[(0,dt.jsx)(ft,{className:"ping-pong-rally-metric",label:h,tone:"cyan",value:p}),(0,dt.jsx)(ft,{className:"ping-pong-progress-metric",label:U,tone:M?"green":"yellow",value:f}),(0,dt.jsx)(ft,{className:"ping-pong-last-metric",label:"\xDAltimo",tone:y,value:d}),(0,dt.jsx)(ft,{className:"ping-pong-time-metric",label:"Tiempo",tone:"amber",value:Fe(t.elapsedMillis)})]}),(0,dt.jsx)(Xy,{className:"ping-pong-rounds",activeCaption:c?"Punto en curso":"Por comenzar",activeLabel:c?"En juego":"Siguiente",activeRound:m,rounds:t.rounds,totalRounds:u})]})})}var Ul={pointsToWin:{key:"points_to_win",label:"Points to win",playerFacing:!0,description:"The first team to reach this score wins. A match can last up to twice this value minus one rounds.",type:"int",default:5,min:1,max:21,step:1},initialBallSpeed:{key:"initial_ball_speed",label:"Initial ball speed (tiles/s)",playerFacing:!1,description:"The ball's starting speed in floor tiles per second on Easy. Medium, Hard, and Expert apply the difficulty multiplier curve to this value.",type:"float",default:5.75,min:3,max:10,step:.25},returnSpeedMultiplier:{key:"return_speed_multiplier",label:"Speed multiplier per return",playerFacing:!1,description:"The ball accelerates after every successful paddle return. Difficulty scales the increase above 1x, with a safety cap at 2.5 times the starting speed.",type:"float",default:1.035,min:1,max:1.1,step:.005},difficultyMultiplier:{key:"difficulty_multiplier",label:"Difficulty multiplier step",playerFacing:!1,description:"Easy uses 1x, Medium uses one step, Hard uses the step squared, and Expert uses the step cubed. It affects both starting speed and return acceleration.",type:"float",default:1.2,min:1,max:1.35,step:.05}},Yt={id:"ping-pong",label:"Ping Pong",description:"Two-player arcade ping pong for red and blue halves of the Motion Levels floor.",availability:{development:!0,production:!0},catalog:{category:"versus",color:"#145cff",durationLabel:"A 5 puntos",modeLabel:"Rojo contra azul",audioLabel:"M\xFAsica + efectos",rules:["Un equipo ocupa la mitad roja y otro la azul","Devuelve la pelota pisando la zona iluminada"]},players:{allowAny:!0,min:2,max:2},start:{mode:"player-ready",releaseGraceMillis:1e3},config:{difficulty:{default:"medium",options:["easy","medium","hard","expert"]},vars:Object.values(Ul)},defaultDurationMillis:0,display:{entry:"./display"},preview:{seed:137,playerCount:2,difficulty:"medium",options:{points_to_win:5},actions:[{atMillis:100,type:"press",x:7,y:3},{atMillis:100,type:"press",x:7,y:28}],captureStartMillis:2200,frameCount:18,frameIntervalMillis:120},tags:["arcade","two-player","typescript"]};var tl="#ff1c28",el="#145cff",ra="#ffffff",_g="#05070a",ke={r:255,g:28,b:40},We={r:20,g:92,b:255},ci={r:255,g:255,b:255},qp=900,Ho=3e3,hs=2,ys=29,Pe=5,Bl=Math.floor(G/2),$e=Math.floor(_/2),Rg=2.5;function wp(t){return new Uo(t)}var Uo=class{config;rng;players;winningScore;speed;startedAtMillis=0;nowMillis=0;readyGate;lastStepMillis=0;pauseUntilMillis=0;finishAtMillis=0;currentIntervalMillis=140;hitCount=0;redPaddleX=0;bluePaddleX=0;ball={x:Bl,y:$e,dx:1,dy:1};ballTrail=[];teamScore=[0,0];rounds=[];lastRoundHits=0;lastRoundWinner="";phase="waiting";success=!1;scorer=-1;winner=-1;pointAtMillis=0;lastImpactAtMillis=0;lastImpact=null;motionEventId=0;lastEvent=N("none","Listo",0);constructor(e){this.config=ce(e,Yt),this.rng=Ee(this.config.seed),this.readyGate=Ol(Yt.start,as(2),this.config.nowMillis),this.winningScore=this.readWinningScore(),this.players=this.createPlayers(),this.speed=Lp(this.config),this.resetGame(this.config.nowMillis)}init(e){return this.startedAtMillis=e,this.nowMillis=e,this.resetGame(e),this.lastEvent=N("ready","Ping Pong espera rojo y azul",e),[this.lastEvent]}press(e){this.nowMillis=e.atMillis;let l=this.readyGate.update(e);return e.pressed&&this.movePaddle(e.x,e.y),this.recordEvents(this.updatePhase(e.atMillis,l))}release(e){this.nowMillis=e.atMillis;let l=this.readyGate.update({...e,pressed:!1});return this.recordEvents(this.updatePhase(e.atMillis,l))}tick(e){this.nowMillis=e.atMillis;let l=this.updatePhase(e.atMillis,this.readyGate.tick(e.atMillis));if(this.phase!=="running"||e.atMillis<this.pauseUntilMillis)return this.recordEvents(l);for(let a=0;a<8&&!(e.atMillis-this.lastStepMillis<this.currentIntervalMillis);a+=1){this.lastStepMillis+=this.currentIntervalMillis;let i=this.moveBall(this.lastStepMillis);if(i&&l.push(i),this.phase!=="running"||this.lastStepMillis<this.pauseUntilMillis)break}return this.recordEvents(l)}render(){let e=Se(_g);return this.phase==="waiting"?(this.drawWaiting(e),e):this.phase==="starting"?(this.drawReady(e),e):this.phase==="finished"?(this.drawWin(e),e):(this.drawArena(e),this.drawScore(e),this.nowMillis<this.pauseUntilMillis?this.drawScoreFlash(e):(this.drawBallTrail(e),this.drawImpact(e),this.drawPaddles(e),this.drawBallGlow(e),A(e,this.ball.x,this.ball.y,ra)),e)}snapshot(){this.recordEvents(this.updatePhase(this.nowMillis));let e=this.readyGate.state(this.nowMillis),l=this.phase==="starting"?e.countdownMillis:0,a=this.phase==="finished"&&this.nowMillis<this.finishAtMillis+Ho?this.finishAtMillis+Ho-this.nowMillis:0;return{currentGame:Yt.id,label:Yt.label,phase:this.phase,playerCount:this.config.playerCount,players:[{index:0,label:this.labelForTeam(0),color:tl,score:this.teamScore[0],lives:-1},{index:1,label:this.labelForTeam(1),color:el,score:this.teamScore[1],lives:-1}],score:this.teamScore[0]+this.teamScore[1],lives:-1,elapsedMillis:Math.max(0,this.nowMillis-this.startedAtMillis),remainingMillis:a,activeTargets:this.activeHalves(this.nowMillis),success:this.success,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:l,readyPlayers:e.readyPlayers,requiredPlayers:e.requiredPlayers,matchTarget:this.winningScore,roundHits:this.hitCount,lastRoundHits:this.lastRoundHits,lastRoundWinner:this.lastRoundWinner,rounds:this.rounds,ball:{...this.ball},ballTrail:this.ballTrail.map(i=>({...i})),rallyPace:this.speed.initialMillis===this.speed.minimumMillis?1:it((this.speed.initialMillis-this.currentIntervalMillis)/(this.speed.initialMillis-this.speed.minimumMillis),0,1),pointScorer:this.scorer,pointFlashMillis:Math.max(0,this.pauseUntilMillis-this.nowMillis),winnerIndex:this.winner,impact:this.lastImpact&&this.nowMillis-this.lastImpactAtMillis<480?{...this.lastImpact,remainingMillis:480-(this.nowMillis-this.lastImpactAtMillis)}:null,motionEventId:this.motionEventId,initialBallSpeed:this.speed.initialTilesPerSecond,ballSpeed:1e3/this.currentIntervalMillis,returnSpeedMultiplier:this.speed.hitMultiplier,difficultySpeedFactor:this.speed.difficultyFactor}}reset(e={}){this.config=ce({...this.config,...e},Yt),this.rng=Ee(this.config.seed),this.winningScore=this.readWinningScore(),this.players=this.createPlayers(),this.speed=Lp(this.config),this.motionEventId=0,this.resetGame(this.config.nowMillis),this.lastEvent=N("none","Listo",this.config.nowMillis)}createPlayers(){return[{index:0,label:"Rojo",color:tl,score:0,lives:-1},{index:1,label:"Azul",color:el,score:0,lives:-1}]}readWinningScore(){return hn(this.config.options,Ul.pointsToWin)}resetGame(e){this.readyGate.reset(e),this.teamScore=[0,0],this.rounds=[],this.lastRoundHits=0,this.lastRoundWinner="",this.redPaddleX=Math.floor((G-Pe)/2),this.bluePaddleX=this.redPaddleX,this.phase="waiting",this.success=!1,this.scorer=-1,this.winner=-1,this.pointAtMillis=0,this.lastImpactAtMillis=0,this.lastImpact=null,this.motionEventId+=1,this.startedAtMillis=e,this.finishAtMillis=0,this.resetBall(),this.lastEvent=N("none","Esperando a rojo arriba y azul abajo",e)}updatePhase(e,l=this.readyGate.tick(e)){return this.phase==="finished"?e-this.finishAtMillis>=Ho?(this.resetGame(e),[N("ready","Nueva partida",e)]):[]:l==="players-ready"?(this.phase="starting",this.motionEventId+=1,[N("start","Rojo y azul listos",e)]):l==="players-left"?(this.phase="waiting",this.motionEventId+=1,[N("ready","Vuelve a las zonas roja y azul",e)]):l==="started"?(this.phase="running",this.startedAtMillis=e,this.lastStepMillis=e,this.serve(),this.motionEventId+=1,[N("start","La pelota esta en juego",e)]):[]}movePaddle(e,l){let i=it(Math.round(e),Math.floor(Pe/2),G-1-Math.floor(Pe/2))-Math.floor(Pe/2);l<_/2?this.redPaddleX=i:this.bluePaddleX=i}moveBall(e){let l=this.ball.x+this.ball.dx,a=this.ball.y+this.ball.dy;if(l<0&&(l=0,this.ball.dx=1),l>=G&&(l=G-1,this.ball.dx=-1),this.ball.dy<0&&a===hs&&l>=this.redPaddleX&&l<this.redPaddleX+Pe)return this.reflectFromPaddle(l,this.redPaddleX),this.commitBall({...this.ball,x:l,y:hs+1,dy:1}),this.recordImpact(0,l,hs),this.accelerate(),N("coin","Rojo devuelve",e);if(this.ball.dy>0&&a===ys&&l>=this.bluePaddleX&&l<this.bluePaddleX+Pe)return this.reflectFromPaddle(l,this.bluePaddleX),this.commitBall({...this.ball,x:l,y:ys-1,dy:-1}),this.recordImpact(1,l,ys),this.accelerate(),N("coin","Azul devuelve",e);if(a<0)return this.scorePoint(1,e),N("score","Punto para azul",e);if(a>=_)return this.scorePoint(0,e),N("score","Punto para rojo",e);this.commitBall({...this.ball,x:l,y:a})}scorePoint(e,l){if(this.teamScore[e]+=1,this.scorer=e,this.pointAtMillis=l,this.motionEventId+=1,this.recordRound(e),this.teamScore[e]>=this.winningScore){this.phase="finished",this.success=e===1,this.winner=e,this.finishAtMillis=l;return}this.resetBall(),this.pauseUntilMillis=l+qp,this.lastStepMillis=this.pauseUntilMillis}recordRound(e){this.lastRoundHits=this.hitCount,this.lastRoundWinner=this.labelForTeam(e),this.rounds=[...this.rounds,{index:this.rounds.length+1,winnerIndex:e,winnerLabel:this.lastRoundWinner,hits:this.lastRoundHits}]}resetBall(){this.ball={...this.ball,x:Bl,y:$e},this.ballTrail=[],this.currentIntervalMillis=this.speed.initialMillis,this.hitCount=0,this.pauseUntilMillis=0,this.serve()}serve(){this.ball={x:Bl,y:$e,dy:this.rng.int(2)===0?-1:1,dx:this.rng.int(2)===0?-1:1}}reflectFromPaddle(e,l){let a=l+Math.floor(Pe/2);e<a?this.ball.dx=-1:e>a?this.ball.dx=1:this.ball.dx=this.rng.int(2)===0?-1:1}accelerate(){this.hitCount+=1,this.currentIntervalMillis=Math.max(this.speed.minimumMillis,this.currentIntervalMillis/this.speed.hitMultiplier)}commitBall(e){this.ballTrail=[{x:this.ball.x,y:this.ball.y},...this.ballTrail.filter(l=>l.x!==this.ball.x||l.y!==this.ball.y)].slice(0,5),this.ball=e}recordImpact(e,l,a){this.lastImpact={team:e,x:l,y:a},this.lastImpactAtMillis=this.nowMillis,this.motionEventId+=1}drawWaiting(e){let l=this.halfReady(0,this.nowMillis),a=this.halfReady(1,this.nowMillis);this.drawWaitingHalf(e,0,l),this.drawWaitingHalf(e,1,a),l?this.drawSoftBar(e,3,5,10,ke):this.drawBreathingOutline(e,0,ke),a?this.drawSoftBar(e,3,24,10,We):this.drawBreathingOutline(e,1,We)}drawReady(e){let l=so(Yt.start),a=Math.max(0,l-this.readyGate.state(this.nowMillis).countdownMillis),n=it(a/l,0,1)*(_*.7),u=.5+Math.sin(a/86)*.5;for(let s=0;s<_;s+=1)for(let r=0;r<G;r+=1){let o=Math.abs(r-Bl)+Math.abs(s-$e),h=s>=_/2?We:ke,p=Math.abs(o-n),d=Math.max(0,1-p/3.2),y=7+(Math.sin(r*.82+s*.38-a/120)+1)*4;d>0?A(e,r,s,ze(h,28+d*74,d*24)):o<n&&A(e,r,s,Ie(h,y+u*10))}this.drawCenterLine(e,18+u*20),this.drawBallGlow(e),A(e,Bl,$e,ra)}drawScoreFlash(e){let l=this.scorer===1?We:ke,a=Math.max(0,this.nowMillis-this.pointAtMillis),i=it(a/qp,0,1),n=this.scorer===0?_-1:0,u=i*(_+8);for(let s=0;s<_;s+=1)for(let r=0;r<G;r+=1){let o=Math.hypot((r-Bl)*1.35,s-n),h=Math.max(0,1-Math.abs(o-u)/3.4),p=Math.sin(r*12.13+s*7.71+a/38)>.9?1:0,d=1-i;h>0?A(e,r,s,ze(l,28+h*82,h*34)):p>0&&d>.18&&A(e,r,s,ze(l,22+d*44,d*12))}this.drawCenterLine(e,12+(1-i)*24),this.drawPaddles(e)}drawWin(e){let l=this.winner===1?We:ke,a=Math.max(0,this.nowMillis-this.finishAtMillis),i=a/92,n=.5+Math.sin(a/110)*.5;for(let s=0;s<_;s+=1)for(let r=0;r<G;r+=1){let h=((this.winner===0?_-1-s:s)+r*.72-i+_*4)%11,p=Math.sin(r*17.17+s*11.31+a/55);h<3.8?A(e,r,s,ze(l,38+(3.8-h)*15+n*12,12+n*18)):p>.91&&A(e,r,s,ze(l,48,32))}let u=64+n*26;V(e,Bl-1,$e-1,3,3,Ie(ci,u)),A(e,Bl,$e,ra)}drawArena(e){let l=this.nowMillis/185;for(let a=1;a<_-1;a+=1){let i=a<_/2?ke:We;for(let n=0;n<G;n+=1){let u=(Math.sin(n*.78+a*.31-l)+1)*.5,s=(n+a)%3===0?4:0;A(e,n,a,Ie(i,4+u*7+s))}}this.drawCenterLine(e,18+(Math.sin(this.nowMillis/140)+1)*5)}drawCenterLine(e,l){for(let a=0;a<G;a+=1)(a+Math.floor(this.nowMillis/120))%3===0&&(A(e,a,$e-1,ze(ci,l,0)),A(e,a,$e,ze(ci,l*.72,0)))}drawBallTrail(e){this.ballTrail.forEach((l,a)=>{let i=Math.max(10,46-a*8);A(e,l.x,l.y,Ie(ci,i))})}drawBallGlow(e){let l=20+(Math.sin(this.nowMillis/70)+1)*7;for(let[a,i]of[[-1,0],[1,0],[0,-1],[0,1]])A(e,this.ball.x+a,this.ball.y+i,Ie(ci,l))}drawImpact(e){if(!this.lastImpact)return;let l=this.nowMillis-this.lastImpactAtMillis;if(l<0||l>=480)return;let a=l/480,i=1+a*5.5,n=this.lastImpact.team===0?ke:We;for(let u=Math.max(0,this.lastImpact.y-7);u<=Math.min(_-1,this.lastImpact.y+7);u+=1)for(let s=Math.max(0,this.lastImpact.x-7);s<=Math.min(G-1,this.lastImpact.x+7);s+=1){let r=Math.hypot(s-this.lastImpact.x,u-this.lastImpact.y),o=Math.max(0,1-Math.abs(r-i)/1.45);o>0&&A(e,s,u,ze(n,30+o*52,o*28*(1-a)))}}drawBreathingOutline(e,l,a){let i=(this.nowMillis/900+l*.5)%1,n=.5-Math.cos(i*Math.PI*2)*.5,u=Math.round(1+n*2),s=l===0?3+u:21-u,r=48+n*48;this.drawOutline(e,u,s,G-u*2,8,Ie(a,r))}drawScore(e){for(let l=0;l<this.teamScore[0]&&l<G;l+=1)A(e,l,0,tl);for(let l=0;l<this.teamScore[1]&&l<G;l+=1)A(e,l,_-1,el)}drawPaddles(e){this.drawPaddle(e,this.redPaddleX,hs,ke),this.drawPaddle(e,this.bluePaddleX,ys,We)}drawWaitingHalf(e,l,a){let i=l===1?_/2:0,n=l===1?We:ke,u=Math.floor(this.nowMillis/120)%10;for(let s=i;s<i+_/2;s+=1)for(let r=0;r<G;r+=1){let o=0;a?o=18+(r+s+u)%6*6:(r+s+u)%7===0&&(o=22),o>0&&A(e,r,s,Ie(n,o))}}drawSoftBar(e,l,a,i,n){let u=Math.floor(this.nowMillis/100)%6;for(let s=0;s<i;s+=1){let r=s===u||s===i-1-u?112:58+s*4;A(e,l+s,a,Ie(n,r)),A(e,l+s,a+1,ze(n,r-8,10)),A(e,l+s,a+2,Ie(n,Math.max(18,r-28)))}}drawPaddle(e,l,a,i){for(let n=0;n<Pe;n+=1){let u=n===Math.floor(Pe/2)?118:74;A(e,l+n,a,ze(i,u,18))}}drawOutline(e,l,a,i,n,u){let s=Math.max(2,Math.round(i)),r=Math.max(2,Math.round(n));V(e,l,a,s,1,u),V(e,l,a+r-1,s,1,u),V(e,l,a,1,r,u),V(e,l+s-1,a,1,r,u)}halfReady(e,l){return this.readyGate.zoneReady(e,l)}activeHalves(e){return this.readyGate.state(e).readyPlayers}labelForTeam(e){return this.players[e]?.label||(e===0?"Rojo":"Azul")}recordEvents(e){let l=e.at(-1);return l&&(this.lastEvent=l),e}};function Lp(t){let e=hn(t.options,Ul.initialBallSpeed),l=hn(t.options,Ul.returnSpeedMultiplier),i=hn(t.options,Ul.difficultyMultiplier)**Dg(t.difficulty),n=e*i,u=1+(l-1)*i,s=n*Rg;return{difficultyFactor:i,hitMultiplier:u,initialTilesPerSecond:n,initialMillis:1e3/n,minimumMillis:1e3/s}}function Dg(t){switch(t){case"medium":return 1;case"hard":return 2;case"expert":return 3;default:return 0}}function Ie(t,e){return ro(is(t,e))}function ze(t,e,l){return ro(ky(is(t,e),is(ci,l)))}var Xp=(()=>{let t=Se("#05070a");return V(t,5,2,5,1,tl),V(t,6,29,5,1,el),A(t,8,16,ra),t})(),Bo={currentGame:Yt.id,label:Yt.label,phase:"waiting",playerCount:2,players:[{index:0,label:"Rojo",color:tl,score:0,lives:-1},{index:1,label:"Azul",color:el,score:0,lives:-1}],score:0,lives:-1,elapsedMillis:0,remainingMillis:0,activeTargets:0,success:!1,lastEventCue:"ready",lastEventMessage:"Ping Pong espera rojo y azul",countdownMillis:0,readyPlayers:0,requiredPlayers:2,matchTarget:5,roundHits:0,lastRoundHits:0,lastRoundWinner:"",rounds:[],ball:{x:8,y:16,dx:1,dy:1},ballTrail:[],rallyPace:0,pointScorer:-1,pointFlashMillis:0,winnerIndex:-1,impact:null,motionEventId:1,initialBallSpeed:6.9,ballSpeed:6.9,returnSpeedMultiplier:1.042,difficultySpeedFactor:1.2},Yo={...Bo,phase:"running",readyPlayers:2,elapsedMillis:8200,activeTargets:2,lastEventCue:"coin",lastEventMessage:"Azul devuelve",roundHits:3,ball:{x:11,y:21,dx:1,dy:1},ballTrail:[{x:10,y:20},{x:9,y:19},{x:8,y:18}],rallyPace:.1935,ballSpeed:7.8064,impact:{team:1,x:10,y:29,remainingMillis:180},motionEventId:4},jp={...Yo,phase:"finished",score:5,remainingMillis:2400,success:!0,lastEventCue:"score",lastEventMessage:"Punto para azul",players:[{index:0,label:"Rojo",color:tl,score:2,lives:-1},{index:1,label:"Azul",color:el,score:3,lives:-1}],lastRoundHits:2,lastRoundWinner:"Azul",pointScorer:1,winnerIndex:1,motionEventId:8,rounds:[{index:1,winnerIndex:0,winnerLabel:"Rojo",hits:1},{index:2,winnerIndex:1,winnerLabel:"Azul",hits:2}]};var Lo=new Map([[xe.id,yo],[Ge.id,Eo],[Ae.id,Oo],[Yt.id,qo]]),lM=[...Lo.values()].map(t=>t.manifest).sort((t,e)=>t.id.localeCompare(e.id));var wo=gt(Ft(),1),ps=new WeakMap;function Qp(t,e){let l=Lo.get(e.gameId);if(!l?.PlayerDisplay)throw new Error(`no player display registered for ${e.gameId}`);let a=ps.get(t);a||(a={root:(0,Zp.createRoot)(t),input:e},ps.set(t,a)),a.input=e;let i=l.PlayerDisplay;a.root.render((0,wo.jsx)(Ly,{paused:e.paused===!0,children:(0,wo.jsx)(i,{snapshot:e.snapshot,frame:e.frame})}))}function Og(t){ps.get(t)?.root.unmount(),ps.delete(t)}function Ng(){if(document.getElementById("motion-levels-games-display-styles"))return;let t=document.createElement("style");t.id="motion-levels-games-display-styles",t.textContent=`/*
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
`,document.head.append(t)}Ng();window.MotionLevelsGamesDisplay={revision:"191949ee0aba993b8049aa8908b2698fc1da00f6",mount:Qp,update:Qp,unmount:Og};})();
