"use strict";(()=>{var Py=Object.create;var Ms=Object.defineProperty;var $y=Object.getOwnPropertyDescriptor;var Iy=Object.getOwnPropertyNames;var t0=Object.getPrototypeOf,e0=Object.prototype.hasOwnProperty;var me=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports),An=(t,e)=>{for(var l in e)Ms(t,l,{get:e[l],enumerable:!0})},l0=(t,e,l,a)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of Iy(e))!e0.call(t,i)&&i!==l&&Ms(t,i,{get:()=>e[i],enumerable:!(a=$y(e,i))||a.enumerable});return t};var mt=(t,e,l)=>(l=t!=null?Py(t0(t)):{},l0(e||!t||!t.__esModule?Ms(l,"default",{value:t,enumerable:!0}):l,t));var tf=me(I=>{"use strict";function Ts(t,e){var l=t.length;t.push(e);t:for(;0<l;){var a=l-1>>>1,i=t[a];if(0<zn(i,e))t[a]=e,t[l]=i,l=a;else break t}}function he(t){return t.length===0?null:t[0]}function Rn(t){if(t.length===0)return null;var e=t[0],l=t.pop();if(l!==e){t[0]=l;t:for(var a=0,i=t.length,n=i>>>1;a<n;){var u=2*(a+1)-1,s=t[u],r=u+1,o=t[r];if(0>zn(s,l))r<i&&0>zn(o,s)?(t[a]=o,t[r]=l,a=r):(t[a]=s,t[u]=l,a=u);else if(r<i&&0>zn(o,l))t[a]=o,t[r]=l,a=r;else break t}}return e}function zn(t,e){var l=t.sortIndex-e.sortIndex;return l!==0?l:t.id-e.id}I.unstable_now=void 0;typeof performance=="object"&&typeof performance.now=="function"?(Zo=performance,I.unstable_now=function(){return Zo.now()}):(Ss=Date,Ko=Ss.now(),I.unstable_now=function(){return Ss.now()-Ko});var Zo,Ss,Ko,ze=[],ll=[],a0=1,Pt=null,Gt=3,Gs=!1,mi=!1,hi=!1,Cs=!1,ko=typeof setTimeout=="function"?setTimeout:null,Wo=typeof clearTimeout=="function"?clearTimeout:null,Jo=typeof setImmediate<"u"?setImmediate:null;function _n(t){for(var e=he(ll);e!==null;){if(e.callback===null)Rn(ll);else if(e.startTime<=t)Rn(ll),e.sortIndex=e.expirationTime,Ts(ze,e);else break;e=he(ll)}}function As(t){if(hi=!1,_n(t),!mi)if(he(ze)!==null)mi=!0,ma||(ma=!0,da());else{var e=he(ll);e!==null&&zs(As,e.startTime-t)}}var ma=!1,pi=-1,Po=5,$o=-1;function Io(){return Cs?!0:!(I.unstable_now()-$o<Po)}function Es(){if(Cs=!1,ma){var t=I.unstable_now();$o=t;var e=!0;try{t:{mi=!1,hi&&(hi=!1,Wo(pi),pi=-1),Gs=!0;var l=Gt;try{e:{for(_n(t),Pt=he(ze);Pt!==null&&!(Pt.expirationTime>t&&Io());){var a=Pt.callback;if(typeof a=="function"){Pt.callback=null,Gt=Pt.priorityLevel;var i=a(Pt.expirationTime<=t);if(t=I.unstable_now(),typeof i=="function"){Pt.callback=i,_n(t),e=!0;break e}Pt===he(ze)&&Rn(ze),_n(t)}else Rn(ze);Pt=he(ze)}if(Pt!==null)e=!0;else{var n=he(ll);n!==null&&zs(As,n.startTime-t),e=!1}}break t}finally{Pt=null,Gt=l,Gs=!1}e=void 0}}finally{e?da():ma=!1}}}var da;typeof Jo=="function"?da=function(){Jo(Es)}:typeof MessageChannel<"u"?(xs=new MessageChannel,Fo=xs.port2,xs.port1.onmessage=Es,da=function(){Fo.postMessage(null)}):da=function(){ko(Es,0)};var xs,Fo;function zs(t,e){pi=ko(function(){t(I.unstable_now())},e)}I.unstable_IdlePriority=5;I.unstable_ImmediatePriority=1;I.unstable_LowPriority=4;I.unstable_NormalPriority=3;I.unstable_Profiling=null;I.unstable_UserBlockingPriority=2;I.unstable_cancelCallback=function(t){t.callback=null};I.unstable_forceFrameRate=function(t){0>t||125<t?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):Po=0<t?Math.floor(1e3/t):5};I.unstable_getCurrentPriorityLevel=function(){return Gt};I.unstable_next=function(t){switch(Gt){case 1:case 2:case 3:var e=3;break;default:e=Gt}var l=Gt;Gt=e;try{return t()}finally{Gt=l}};I.unstable_requestPaint=function(){Cs=!0};I.unstable_runWithPriority=function(t,e){switch(t){case 1:case 2:case 3:case 4:case 5:break;default:t=3}var l=Gt;Gt=t;try{return e()}finally{Gt=l}};I.unstable_scheduleCallback=function(t,e,l){var a=I.unstable_now();switch(typeof l=="object"&&l!==null?(l=l.delay,l=typeof l=="number"&&0<l?a+l:a):l=a,t){case 1:var i=-1;break;case 2:i=250;break;case 5:i=1073741823;break;case 4:i=1e4;break;default:i=5e3}return i=l+i,t={id:a0++,callback:e,priorityLevel:t,startTime:l,expirationTime:i,sortIndex:-1},l>a?(t.sortIndex=l,Ts(ll,t),he(ze)===null&&t===he(ll)&&(hi?(Wo(pi),pi=-1):hi=!0,zs(As,l-a))):(t.sortIndex=i,Ts(ze,t),mi||Gs||(mi=!0,ma||(ma=!0,da()))),t};I.unstable_shouldYield=Io;I.unstable_wrapCallback=function(t){var e=Gt;return function(){var l=Gt;Gt=e;try{return t.apply(this,arguments)}finally{Gt=l}}}});var lf=me((jg,ef)=>{"use strict";ef.exports=tf()});var hf=me(D=>{"use strict";var Ds=Symbol.for("react.transitional.element"),i0=Symbol.for("react.portal"),n0=Symbol.for("react.fragment"),u0=Symbol.for("react.strict_mode"),s0=Symbol.for("react.profiler"),r0=Symbol.for("react.consumer"),c0=Symbol.for("react.context"),o0=Symbol.for("react.forward_ref"),f0=Symbol.for("react.suspense"),d0=Symbol.for("react.memo"),rf=Symbol.for("react.lazy"),m0=Symbol.for("react.activity"),af=Symbol.iterator;function h0(t){return t===null||typeof t!="object"?null:(t=af&&t[af]||t["@@iterator"],typeof t=="function"?t:null)}var cf={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},of=Object.assign,ff={};function pa(t,e,l){this.props=t,this.context=e,this.refs=ff,this.updater=l||cf}pa.prototype.isReactComponent={};pa.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};pa.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function df(){}df.prototype=pa.prototype;function Os(t,e,l){this.props=t,this.context=e,this.refs=ff,this.updater=l||cf}var Ns=Os.prototype=new df;Ns.constructor=Os;of(Ns,pa.prototype);Ns.isPureReactComponent=!0;var nf=Array.isArray;function Rs(){}var k={H:null,A:null,T:null,S:null},mf=Object.prototype.hasOwnProperty;function Hs(t,e,l){var a=l.ref;return{$$typeof:Ds,type:t,key:e,ref:a!==void 0?a:null,props:l}}function p0(t,e){return Hs(t.type,e,t.props)}function Us(t){return typeof t=="object"&&t!==null&&t.$$typeof===Ds}function y0(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(l){return e[l]})}var uf=/\/+/g;function _s(t,e){return typeof t=="object"&&t!==null&&t.key!=null?y0(""+t.key):e.toString(36)}function v0(t){switch(t.status){case"fulfilled":return t.value;case"rejected":throw t.reason;default:switch(typeof t.status=="string"?t.then(Rs,Rs):(t.status="pending",t.then(function(e){t.status==="pending"&&(t.status="fulfilled",t.value=e)},function(e){t.status==="pending"&&(t.status="rejected",t.reason=e)})),t.status){case"fulfilled":return t.value;case"rejected":throw t.reason}}throw t}function ha(t,e,l,a,i){var n=typeof t;(n==="undefined"||n==="boolean")&&(t=null);var u=!1;if(t===null)u=!0;else switch(n){case"bigint":case"string":case"number":u=!0;break;case"object":switch(t.$$typeof){case Ds:case i0:u=!0;break;case rf:return u=t._init,ha(u(t._payload),e,l,a,i)}}if(u)return i=i(t),u=a===""?"."+_s(t,0):a,nf(i)?(l="",u!=null&&(l=u.replace(uf,"$&/")+"/"),ha(i,e,l,"",function(o){return o})):i!=null&&(Us(i)&&(i=p0(i,l+(i.key==null||t&&t.key===i.key?"":(""+i.key).replace(uf,"$&/")+"/")+u)),e.push(i)),1;u=0;var s=a===""?".":a+":";if(nf(t))for(var r=0;r<t.length;r++)a=t[r],n=s+_s(a,r),u+=ha(a,e,l,n,i);else if(r=h0(t),typeof r=="function")for(t=r.call(t),r=0;!(a=t.next()).done;)a=a.value,n=s+_s(a,r++),u+=ha(a,e,l,n,i);else if(n==="object"){if(typeof t.then=="function")return ha(v0(t),e,l,a,i);throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.")}return u}function Dn(t,e,l){if(t==null)return t;var a=[],i=0;return ha(t,a,"","",function(n){return e.call(l,n,i++)}),a}function g0(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(l){(t._status===0||t._status===-1)&&(t._status=1,t._result=l)},function(l){(t._status===0||t._status===-1)&&(t._status=2,t._result=l)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var sf=typeof reportError=="function"?reportError:function(t){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var e=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof t=="object"&&t!==null&&typeof t.message=="string"?String(t.message):String(t),error:t});if(!window.dispatchEvent(e))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",t);return}console.error(t)},b0={map:Dn,forEach:function(t,e,l){Dn(t,function(){e.apply(this,arguments)},l)},count:function(t){var e=0;return Dn(t,function(){e++}),e},toArray:function(t){return Dn(t,function(e){return e})||[]},only:function(t){if(!Us(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};D.Activity=m0;D.Children=b0;D.Component=pa;D.Fragment=n0;D.Profiler=s0;D.PureComponent=Os;D.StrictMode=u0;D.Suspense=f0;D.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=k;D.__COMPILER_RUNTIME={__proto__:null,c:function(t){return k.H.useMemoCache(t)}};D.cache=function(t){return function(){return t.apply(null,arguments)}};D.cacheSignal=function(){return null};D.cloneElement=function(t,e,l){if(t==null)throw Error("The argument must be a React element, but you passed "+t+".");var a=of({},t.props),i=t.key;if(e!=null)for(n in e.key!==void 0&&(i=""+e.key),e)!mf.call(e,n)||n==="key"||n==="__self"||n==="__source"||n==="ref"&&e.ref===void 0||(a[n]=e[n]);var n=arguments.length-2;if(n===1)a.children=l;else if(1<n){for(var u=Array(n),s=0;s<n;s++)u[s]=arguments[s+2];a.children=u}return Hs(t.type,i,a)};D.createContext=function(t){return t={$$typeof:c0,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null},t.Provider=t,t.Consumer={$$typeof:r0,_context:t},t};D.createElement=function(t,e,l){var a,i={},n=null;if(e!=null)for(a in e.key!==void 0&&(n=""+e.key),e)mf.call(e,a)&&a!=="key"&&a!=="__self"&&a!=="__source"&&(i[a]=e[a]);var u=arguments.length-2;if(u===1)i.children=l;else if(1<u){for(var s=Array(u),r=0;r<u;r++)s[r]=arguments[r+2];i.children=s}if(t&&t.defaultProps)for(a in u=t.defaultProps,u)i[a]===void 0&&(i[a]=u[a]);return Hs(t,n,i)};D.createRef=function(){return{current:null}};D.forwardRef=function(t){return{$$typeof:o0,render:t}};D.isValidElement=Us;D.lazy=function(t){return{$$typeof:rf,_payload:{_status:-1,_result:t},_init:g0}};D.memo=function(t,e){return{$$typeof:d0,type:t,compare:e===void 0?null:e}};D.startTransition=function(t){var e=k.T,l={};k.T=l;try{var a=t(),i=k.S;i!==null&&i(l,a),typeof a=="object"&&a!==null&&typeof a.then=="function"&&a.then(Rs,sf)}catch(n){sf(n)}finally{e!==null&&l.types!==null&&(e.types=l.types),k.T=e}};D.unstable_useCacheRefresh=function(){return k.H.useCacheRefresh()};D.use=function(t){return k.H.use(t)};D.useActionState=function(t,e,l){return k.H.useActionState(t,e,l)};D.useCallback=function(t,e){return k.H.useCallback(t,e)};D.useContext=function(t){return k.H.useContext(t)};D.useDebugValue=function(){};D.useDeferredValue=function(t,e){return k.H.useDeferredValue(t,e)};D.useEffect=function(t,e){return k.H.useEffect(t,e)};D.useEffectEvent=function(t){return k.H.useEffectEvent(t)};D.useId=function(){return k.H.useId()};D.useImperativeHandle=function(t,e,l){return k.H.useImperativeHandle(t,e,l)};D.useInsertionEffect=function(t,e){return k.H.useInsertionEffect(t,e)};D.useLayoutEffect=function(t,e){return k.H.useLayoutEffect(t,e)};D.useMemo=function(t,e){return k.H.useMemo(t,e)};D.useOptimistic=function(t,e){return k.H.useOptimistic(t,e)};D.useReducer=function(t,e,l){return k.H.useReducer(t,e,l)};D.useRef=function(t){return k.H.useRef(t)};D.useState=function(t){return k.H.useState(t)};D.useSyncExternalStore=function(t,e,l){return k.H.useSyncExternalStore(t,e,l)};D.useTransition=function(){return k.H.useTransition()};D.version="19.2.7"});var Yl=me((Qg,pf)=>{"use strict";pf.exports=hf()});var vf=me(zt=>{"use strict";var M0=Yl();function yf(t){var e="https://react.dev/errors/"+t;if(1<arguments.length){e+="?args[]="+encodeURIComponent(arguments[1]);for(var l=2;l<arguments.length;l++)e+="&args[]="+encodeURIComponent(arguments[l])}return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function al(){}var At={d:{f:al,r:function(){throw Error(yf(522))},D:al,C:al,L:al,m:al,X:al,S:al,M:al},p:0,findDOMNode:null},S0=Symbol.for("react.portal");function E0(t,e,l){var a=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:S0,key:a==null?null:""+a,children:t,containerInfo:e,implementation:l}}var yi=M0.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function On(t,e){if(t==="font")return"";if(typeof e=="string")return e==="use-credentials"?e:""}zt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=At;zt.createPortal=function(t,e){var l=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)throw Error(yf(299));return E0(t,e,null,l)};zt.flushSync=function(t){var e=yi.T,l=At.p;try{if(yi.T=null,At.p=2,t)return t()}finally{yi.T=e,At.p=l,At.d.f()}};zt.preconnect=function(t,e){typeof t=="string"&&(e?(e=e.crossOrigin,e=typeof e=="string"?e==="use-credentials"?e:"":void 0):e=null,At.d.C(t,e))};zt.prefetchDNS=function(t){typeof t=="string"&&At.d.D(t)};zt.preinit=function(t,e){if(typeof t=="string"&&e&&typeof e.as=="string"){var l=e.as,a=On(l,e.crossOrigin),i=typeof e.integrity=="string"?e.integrity:void 0,n=typeof e.fetchPriority=="string"?e.fetchPriority:void 0;l==="style"?At.d.S(t,typeof e.precedence=="string"?e.precedence:void 0,{crossOrigin:a,integrity:i,fetchPriority:n}):l==="script"&&At.d.X(t,{crossOrigin:a,integrity:i,fetchPriority:n,nonce:typeof e.nonce=="string"?e.nonce:void 0})}};zt.preinitModule=function(t,e){if(typeof t=="string")if(typeof e=="object"&&e!==null){if(e.as==null||e.as==="script"){var l=On(e.as,e.crossOrigin);At.d.M(t,{crossOrigin:l,integrity:typeof e.integrity=="string"?e.integrity:void 0,nonce:typeof e.nonce=="string"?e.nonce:void 0})}}else e==null&&At.d.M(t)};zt.preload=function(t,e){if(typeof t=="string"&&typeof e=="object"&&e!==null&&typeof e.as=="string"){var l=e.as,a=On(l,e.crossOrigin);At.d.L(t,l,{crossOrigin:a,integrity:typeof e.integrity=="string"?e.integrity:void 0,nonce:typeof e.nonce=="string"?e.nonce:void 0,type:typeof e.type=="string"?e.type:void 0,fetchPriority:typeof e.fetchPriority=="string"?e.fetchPriority:void 0,referrerPolicy:typeof e.referrerPolicy=="string"?e.referrerPolicy:void 0,imageSrcSet:typeof e.imageSrcSet=="string"?e.imageSrcSet:void 0,imageSizes:typeof e.imageSizes=="string"?e.imageSizes:void 0,media:typeof e.media=="string"?e.media:void 0})}};zt.preloadModule=function(t,e){if(typeof t=="string")if(e){var l=On(e.as,e.crossOrigin);At.d.m(t,{as:typeof e.as=="string"&&e.as!=="script"?e.as:void 0,crossOrigin:l,integrity:typeof e.integrity=="string"?e.integrity:void 0})}else At.d.m(t)};zt.requestFormReset=function(t){At.d.r(t)};zt.unstable_batchedUpdates=function(t,e){return t(e)};zt.useFormState=function(t,e,l){return yi.H.useFormState(t,e,l)};zt.useFormStatus=function(){return yi.H.useHostTransitionStatus()};zt.version="19.2.7"});var Mf=me((Kg,bf)=>{"use strict";function gf(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(gf)}catch(t){console.error(t)}}gf(),bf.exports=vf()});var Op=me(as=>{"use strict";var pt=lf(),Kd=Yl(),x0=Mf();function g(t){var e="https://react.dev/errors/"+t;if(1<arguments.length){e+="?args[]="+encodeURIComponent(arguments[1]);for(var l=2;l<arguments.length;l++)e+="&args[]="+encodeURIComponent(arguments[l])}return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function Jd(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function ln(t){var e=t,l=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,(e.flags&4098)!==0&&(l=e.return),t=e.return;while(t)}return e.tag===3?l:null}function Fd(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function kd(t){if(t.tag===31){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function Sf(t){if(ln(t)!==t)throw Error(g(188))}function T0(t){var e=t.alternate;if(!e){if(e=ln(t),e===null)throw Error(g(188));return e!==t?null:t}for(var l=t,a=e;;){var i=l.return;if(i===null)break;var n=i.alternate;if(n===null){if(a=i.return,a!==null){l=a;continue}break}if(i.child===n.child){for(n=i.child;n;){if(n===l)return Sf(i),t;if(n===a)return Sf(i),e;n=n.sibling}throw Error(g(188))}if(l.return!==a.return)l=i,a=n;else{for(var u=!1,s=i.child;s;){if(s===l){u=!0,l=i,a=n;break}if(s===a){u=!0,a=i,l=n;break}s=s.sibling}if(!u){for(s=n.child;s;){if(s===l){u=!0,l=n,a=i;break}if(s===a){u=!0,a=n,l=i;break}s=s.sibling}if(!u)throw Error(g(189))}}if(l.alternate!==a)throw Error(g(190))}if(l.tag!==3)throw Error(g(188));return l.stateNode.current===l?t:e}function Wd(t){var e=t.tag;if(e===5||e===26||e===27||e===6)return t;for(t=t.child;t!==null;){if(e=Wd(t),e!==null)return e;t=t.sibling}return null}var $=Object.assign,G0=Symbol.for("react.element"),Nn=Symbol.for("react.transitional.element"),Ti=Symbol.for("react.portal"),Sa=Symbol.for("react.fragment"),Pd=Symbol.for("react.strict_mode"),pr=Symbol.for("react.profiler"),$d=Symbol.for("react.consumer"),Be=Symbol.for("react.context"),oc=Symbol.for("react.forward_ref"),yr=Symbol.for("react.suspense"),vr=Symbol.for("react.suspense_list"),fc=Symbol.for("react.memo"),il=Symbol.for("react.lazy"),gr=Symbol.for("react.activity"),C0=Symbol.for("react.memo_cache_sentinel"),Ef=Symbol.iterator;function vi(t){return t===null||typeof t!="object"?null:(t=Ef&&t[Ef]||t["@@iterator"],typeof t=="function"?t:null)}var A0=Symbol.for("react.client.reference");function br(t){if(t==null)return null;if(typeof t=="function")return t.$$typeof===A0?null:t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case Sa:return"Fragment";case pr:return"Profiler";case Pd:return"StrictMode";case yr:return"Suspense";case vr:return"SuspenseList";case gr:return"Activity"}if(typeof t=="object")switch(t.$$typeof){case Ti:return"Portal";case Be:return t.displayName||"Context";case $d:return(t._context.displayName||"Context")+".Consumer";case oc:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case fc:return e=t.displayName||null,e!==null?e:br(t.type)||"Memo";case il:e=t._payload,t=t._init;try{return br(t(e))}catch{}}return null}var Gi=Array.isArray,A=Kd.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,X=x0.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,Vl={pending:!1,data:null,method:null,action:null},Mr=[],Ea=-1;function be(t){return{current:t}}function bt(t){0>Ea||(t.current=Mr[Ea],Mr[Ea]=null,Ea--)}function F(t,e){Ea++,Mr[Ea]=t.current,t.current=e}var ge=be(null),ji=be(null),pl=be(null),du=be(null);function mu(t,e){switch(F(pl,e),F(ji,t),F(ge,null),e.nodeType){case 9:case 11:t=(t=e.documentElement)&&(t=t.namespaceURI)?_d(t):0;break;default:if(t=e.tagName,e=e.namespaceURI)e=_d(e),t=gp(e,t);else switch(t){case"svg":t=1;break;case"math":t=2;break;default:t=0}}bt(ge),F(ge,t)}function La(){bt(ge),bt(ji),bt(pl)}function Sr(t){t.memoizedState!==null&&F(du,t);var e=ge.current,l=gp(e,t.type);e!==l&&(F(ji,t),F(ge,l))}function hu(t){ji.current===t&&(bt(ge),bt(ji)),du.current===t&&(bt(du),Ii._currentValue=Vl)}var Bs,xf;function ql(t){if(Bs===void 0)try{throw Error()}catch(l){var e=l.stack.trim().match(/\n( *(at )?)/);Bs=e&&e[1]||"",xf=-1<l.stack.indexOf(`
    at`)?" (<anonymous>)":-1<l.stack.indexOf("@")?"@unknown:0:0":""}return`
`+Bs+t+xf}var Ys=!1;function ws(t,e){if(!t||Ys)return"";Ys=!0;var l=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var a={DetermineComponentFrameRoot:function(){try{if(e){var y=function(){throw Error()};if(Object.defineProperty(y.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(y,[])}catch(p){var d=p}Reflect.construct(t,[],y)}else{try{y.call()}catch(p){d=p}t.call(y.prototype)}}else{try{throw Error()}catch(p){d=p}(y=t())&&typeof y.catch=="function"&&y.catch(function(){})}}catch(p){if(p&&d&&typeof p.stack=="string")return[p.stack,d.stack]}return[null,null]}};a.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var i=Object.getOwnPropertyDescriptor(a.DetermineComponentFrameRoot,"name");i&&i.configurable&&Object.defineProperty(a.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var n=a.DetermineComponentFrameRoot(),u=n[0],s=n[1];if(u&&s){var r=u.split(`
`),o=s.split(`
`);for(i=a=0;a<r.length&&!r[a].includes("DetermineComponentFrameRoot");)a++;for(;i<o.length&&!o[i].includes("DetermineComponentFrameRoot");)i++;if(a===r.length||i===o.length)for(a=r.length-1,i=o.length-1;1<=a&&0<=i&&r[a]!==o[i];)i--;for(;1<=a&&0<=i;a--,i--)if(r[a]!==o[i]){if(a!==1||i!==1)do if(a--,i--,0>i||r[a]!==o[i]){var h=`
`+r[a].replace(" at new "," at ");return t.displayName&&h.includes("<anonymous>")&&(h=h.replace("<anonymous>",t.displayName)),h}while(1<=a&&0<=i);break}}}finally{Ys=!1,Error.prepareStackTrace=l}return(l=t?t.displayName||t.name:"")?ql(l):""}function z0(t,e){switch(t.tag){case 26:case 27:case 5:return ql(t.type);case 16:return ql("Lazy");case 13:return t.child!==e&&e!==null?ql("Suspense Fallback"):ql("Suspense");case 19:return ql("SuspenseList");case 0:case 15:return ws(t.type,!1);case 11:return ws(t.type.render,!1);case 1:return ws(t.type,!0);case 31:return ql("Activity");default:return""}}function Tf(t){try{var e="",l=null;do e+=z0(t,l),l=t,t=t.return;while(t);return e}catch(a){return`
Error generating stack: `+a.message+`
`+a.stack}}var Er=Object.prototype.hasOwnProperty,dc=pt.unstable_scheduleCallback,qs=pt.unstable_cancelCallback,_0=pt.unstable_shouldYield,R0=pt.unstable_requestPaint,Vt=pt.unstable_now,D0=pt.unstable_getCurrentPriorityLevel,Id=pt.unstable_ImmediatePriority,tm=pt.unstable_UserBlockingPriority,pu=pt.unstable_NormalPriority,O0=pt.unstable_LowPriority,em=pt.unstable_IdlePriority,N0=pt.log,H0=pt.unstable_setDisableYieldValue,an=null,Qt=null;function ol(t){if(typeof N0=="function"&&H0(t),Qt&&typeof Qt.setStrictMode=="function")try{Qt.setStrictMode(an,t)}catch{}}var Zt=Math.clz32?Math.clz32:Y0,U0=Math.log,B0=Math.LN2;function Y0(t){return t>>>=0,t===0?32:31-(U0(t)/B0|0)|0}var Hn=256,Un=262144,Bn=4194304;function Ll(t){var e=t&42;if(e!==0)return e;switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return t&261888;case 262144:case 524288:case 1048576:case 2097152:return t&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return t&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return t}}function Xu(t,e,l){var a=t.pendingLanes;if(a===0)return 0;var i=0,n=t.suspendedLanes,u=t.pingedLanes;t=t.warmLanes;var s=a&134217727;return s!==0?(a=s&~n,a!==0?i=Ll(a):(u&=s,u!==0?i=Ll(u):l||(l=s&~t,l!==0&&(i=Ll(l))))):(s=a&~n,s!==0?i=Ll(s):u!==0?i=Ll(u):l||(l=a&~t,l!==0&&(i=Ll(l)))),i===0?0:e!==0&&e!==i&&(e&n)===0&&(n=i&-i,l=e&-e,n>=l||n===32&&(l&4194048)!==0)?e:i}function nn(t,e){return(t.pendingLanes&~(t.suspendedLanes&~t.pingedLanes)&e)===0}function w0(t,e){switch(t){case 1:case 2:case 4:case 8:case 64:return e+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function lm(){var t=Bn;return Bn<<=1,(Bn&62914560)===0&&(Bn=4194304),t}function Ls(t){for(var e=[],l=0;31>l;l++)e.push(t);return e}function un(t,e){t.pendingLanes|=e,e!==268435456&&(t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0)}function q0(t,e,l,a,i,n){var u=t.pendingLanes;t.pendingLanes=l,t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0,t.expiredLanes&=l,t.entangledLanes&=l,t.errorRecoveryDisabledLanes&=l,t.shellSuspendCounter=0;var s=t.entanglements,r=t.expirationTimes,o=t.hiddenUpdates;for(l=u&~l;0<l;){var h=31-Zt(l),y=1<<h;s[h]=0,r[h]=-1;var d=o[h];if(d!==null)for(o[h]=null,h=0;h<d.length;h++){var p=d[h];p!==null&&(p.lane&=-536870913)}l&=~y}a!==0&&am(t,a,0),n!==0&&i===0&&t.tag!==0&&(t.suspendedLanes|=n&~(u&~e))}function am(t,e,l){t.pendingLanes|=e,t.suspendedLanes&=~e;var a=31-Zt(e);t.entangledLanes|=e,t.entanglements[a]=t.entanglements[a]|1073741824|l&261930}function im(t,e){var l=t.entangledLanes|=e;for(t=t.entanglements;l;){var a=31-Zt(l),i=1<<a;i&e|t[a]&e&&(t[a]|=e),l&=~i}}function nm(t,e){var l=e&-e;return l=(l&42)!==0?1:mc(l),(l&(t.suspendedLanes|e))!==0?0:l}function mc(t){switch(t){case 2:t=1;break;case 8:t=4;break;case 32:t=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:t=128;break;case 268435456:t=134217728;break;default:t=0}return t}function hc(t){return t&=-t,2<t?8<t?(t&134217727)!==0?32:268435456:8:2}function um(){var t=X.p;return t!==0?t:(t=window.event,t===void 0?32:_p(t.type))}function Gf(t,e){var l=X.p;try{return X.p=t,e()}finally{X.p=l}}var zl=Math.random().toString(36).slice(2),St="__reactFiber$"+zl,Bt="__reactProps$"+zl,Pa="__reactContainer$"+zl,xr="__reactEvents$"+zl,L0="__reactListeners$"+zl,X0="__reactHandles$"+zl,Cf="__reactResources$"+zl,sn="__reactMarker$"+zl;function pc(t){delete t[St],delete t[Bt],delete t[xr],delete t[L0],delete t[X0]}function xa(t){var e=t[St];if(e)return e;for(var l=t.parentNode;l;){if(e=l[Pa]||l[St]){if(l=e.alternate,e.child!==null||l!==null&&l.child!==null)for(t=Hd(t);t!==null;){if(l=t[St])return l;t=Hd(t)}return e}t=l,l=t.parentNode}return null}function $a(t){if(t=t[St]||t[Pa]){var e=t.tag;if(e===5||e===6||e===13||e===31||e===26||e===27||e===3)return t}return null}function Ci(t){var e=t.tag;if(e===5||e===26||e===27||e===6)return t.stateNode;throw Error(g(33))}function Na(t){var e=t[Cf];return e||(e=t[Cf]={hoistableStyles:new Map,hoistableScripts:new Map}),e}function gt(t){t[sn]=!0}var sm=new Set,rm={};function Il(t,e){Xa(t,e),Xa(t+"Capture",e)}function Xa(t,e){for(rm[t]=e,t=0;t<e.length;t++)sm.add(e[t])}var j0=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),Af={},zf={};function V0(t){return Er.call(zf,t)?!0:Er.call(Af,t)?!1:j0.test(t)?zf[t]=!0:(Af[t]=!0,!1)}function Pn(t,e,l){if(V0(e))if(l===null)t.removeAttribute(e);else{switch(typeof l){case"undefined":case"function":case"symbol":t.removeAttribute(e);return;case"boolean":var a=e.toLowerCase().slice(0,5);if(a!=="data-"&&a!=="aria-"){t.removeAttribute(e);return}}t.setAttribute(e,""+l)}}function Yn(t,e,l){if(l===null)t.removeAttribute(e);else{switch(typeof l){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(e);return}t.setAttribute(e,""+l)}}function _e(t,e,l,a){if(a===null)t.removeAttribute(l);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(l);return}t.setAttributeNS(e,l,""+a)}}function It(t){switch(typeof t){case"bigint":case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function cm(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function Q0(t,e,l){var a=Object.getOwnPropertyDescriptor(t.constructor.prototype,e);if(!t.hasOwnProperty(e)&&typeof a<"u"&&typeof a.get=="function"&&typeof a.set=="function"){var i=a.get,n=a.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return i.call(this)},set:function(u){l=""+u,n.call(this,u)}}),Object.defineProperty(t,e,{enumerable:a.enumerable}),{getValue:function(){return l},setValue:function(u){l=""+u},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function Tr(t){if(!t._valueTracker){var e=cm(t)?"checked":"value";t._valueTracker=Q0(t,e,""+t[e])}}function om(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var l=e.getValue(),a="";return t&&(a=cm(t)?t.checked?"true":"false":t.value),t=a,t!==l?(e.setValue(t),!0):!1}function yu(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}var Z0=/[\n"\\]/g;function le(t){return t.replace(Z0,function(e){return"\\"+e.charCodeAt(0).toString(16)+" "})}function Gr(t,e,l,a,i,n,u,s){t.name="",u!=null&&typeof u!="function"&&typeof u!="symbol"&&typeof u!="boolean"?t.type=u:t.removeAttribute("type"),e!=null?u==="number"?(e===0&&t.value===""||t.value!=e)&&(t.value=""+It(e)):t.value!==""+It(e)&&(t.value=""+It(e)):u!=="submit"&&u!=="reset"||t.removeAttribute("value"),e!=null?Cr(t,u,It(e)):l!=null?Cr(t,u,It(l)):a!=null&&t.removeAttribute("value"),i==null&&n!=null&&(t.defaultChecked=!!n),i!=null&&(t.checked=i&&typeof i!="function"&&typeof i!="symbol"),s!=null&&typeof s!="function"&&typeof s!="symbol"&&typeof s!="boolean"?t.name=""+It(s):t.removeAttribute("name")}function fm(t,e,l,a,i,n,u,s){if(n!=null&&typeof n!="function"&&typeof n!="symbol"&&typeof n!="boolean"&&(t.type=n),e!=null||l!=null){if(!(n!=="submit"&&n!=="reset"||e!=null)){Tr(t);return}l=l!=null?""+It(l):"",e=e!=null?""+It(e):l,s||e===t.value||(t.value=e),t.defaultValue=e}a=a??i,a=typeof a!="function"&&typeof a!="symbol"&&!!a,t.checked=s?t.checked:!!a,t.defaultChecked=!!a,u!=null&&typeof u!="function"&&typeof u!="symbol"&&typeof u!="boolean"&&(t.name=u),Tr(t)}function Cr(t,e,l){e==="number"&&yu(t.ownerDocument)===t||t.defaultValue===""+l||(t.defaultValue=""+l)}function Ha(t,e,l,a){if(t=t.options,e){e={};for(var i=0;i<l.length;i++)e["$"+l[i]]=!0;for(l=0;l<t.length;l++)i=e.hasOwnProperty("$"+t[l].value),t[l].selected!==i&&(t[l].selected=i),i&&a&&(t[l].defaultSelected=!0)}else{for(l=""+It(l),e=null,i=0;i<t.length;i++){if(t[i].value===l){t[i].selected=!0,a&&(t[i].defaultSelected=!0);return}e!==null||t[i].disabled||(e=t[i])}e!==null&&(e.selected=!0)}}function dm(t,e,l){if(e!=null&&(e=""+It(e),e!==t.value&&(t.value=e),l==null)){t.defaultValue!==e&&(t.defaultValue=e);return}t.defaultValue=l!=null?""+It(l):""}function mm(t,e,l,a){if(e==null){if(a!=null){if(l!=null)throw Error(g(92));if(Gi(a)){if(1<a.length)throw Error(g(93));a=a[0]}l=a}l==null&&(l=""),e=l}l=It(e),t.defaultValue=l,a=t.textContent,a===l&&a!==""&&a!==null&&(t.value=a),Tr(t)}function ja(t,e){if(e){var l=t.firstChild;if(l&&l===t.lastChild&&l.nodeType===3){l.nodeValue=e;return}}t.textContent=e}var K0=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function _f(t,e,l){var a=e.indexOf("--")===0;l==null||typeof l=="boolean"||l===""?a?t.setProperty(e,""):e==="float"?t.cssFloat="":t[e]="":a?t.setProperty(e,l):typeof l!="number"||l===0||K0.has(e)?e==="float"?t.cssFloat=l:t[e]=(""+l).trim():t[e]=l+"px"}function hm(t,e,l){if(e!=null&&typeof e!="object")throw Error(g(62));if(t=t.style,l!=null){for(var a in l)!l.hasOwnProperty(a)||e!=null&&e.hasOwnProperty(a)||(a.indexOf("--")===0?t.setProperty(a,""):a==="float"?t.cssFloat="":t[a]="");for(var i in e)a=e[i],e.hasOwnProperty(i)&&l[i]!==a&&_f(t,i,a)}else for(var n in e)e.hasOwnProperty(n)&&_f(t,n,e[n])}function yc(t){if(t.indexOf("-")===-1)return!1;switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var J0=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),F0=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function $n(t){return F0.test(""+t)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":t}function Ye(){}var Ar=null;function vc(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var Ta=null,Ua=null;function Rf(t){var e=$a(t);if(e&&(t=e.stateNode)){var l=t[Bt]||null;t:switch(t=e.stateNode,e.type){case"input":if(Gr(t,l.value,l.defaultValue,l.defaultValue,l.checked,l.defaultChecked,l.type,l.name),e=l.name,l.type==="radio"&&e!=null){for(l=t;l.parentNode;)l=l.parentNode;for(l=l.querySelectorAll('input[name="'+le(""+e)+'"][type="radio"]'),e=0;e<l.length;e++){var a=l[e];if(a!==t&&a.form===t.form){var i=a[Bt]||null;if(!i)throw Error(g(90));Gr(a,i.value,i.defaultValue,i.defaultValue,i.checked,i.defaultChecked,i.type,i.name)}}for(e=0;e<l.length;e++)a=l[e],a.form===t.form&&om(a)}break t;case"textarea":dm(t,l.value,l.defaultValue);break t;case"select":e=l.value,e!=null&&Ha(t,!!l.multiple,e,!1)}}}var Xs=!1;function pm(t,e,l){if(Xs)return t(e,l);Xs=!0;try{var a=t(e);return a}finally{if(Xs=!1,(Ta!==null||Ua!==null)&&(Iu(),Ta&&(e=Ta,t=Ua,Ua=Ta=null,Rf(e),t)))for(e=0;e<t.length;e++)Rf(t[e])}}function Vi(t,e){var l=t.stateNode;if(l===null)return null;var a=l[Bt]||null;if(a===null)return null;l=a[e];t:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(a=!a.disabled)||(t=t.type,a=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!a;break t;default:t=!1}if(t)return null;if(l&&typeof l!="function")throw Error(g(231,e,typeof l));return l}var je=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),zr=!1;if(je)try{ya={},Object.defineProperty(ya,"passive",{get:function(){zr=!0}}),window.addEventListener("test",ya,ya),window.removeEventListener("test",ya,ya)}catch{zr=!1}var ya,fl=null,gc=null,In=null;function ym(){if(In)return In;var t,e=gc,l=e.length,a,i="value"in fl?fl.value:fl.textContent,n=i.length;for(t=0;t<l&&e[t]===i[t];t++);var u=l-t;for(a=1;a<=u&&e[l-a]===i[n-a];a++);return In=i.slice(t,1<a?1-a:void 0)}function tu(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function wn(){return!0}function Df(){return!1}function Yt(t){function e(l,a,i,n,u){this._reactName=l,this._targetInst=i,this.type=a,this.nativeEvent=n,this.target=u,this.currentTarget=null;for(var s in t)t.hasOwnProperty(s)&&(l=t[s],this[s]=l?l(n):n[s]);return this.isDefaultPrevented=(n.defaultPrevented!=null?n.defaultPrevented:n.returnValue===!1)?wn:Df,this.isPropagationStopped=Df,this}return $(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var l=this.nativeEvent;l&&(l.preventDefault?l.preventDefault():typeof l.returnValue!="unknown"&&(l.returnValue=!1),this.isDefaultPrevented=wn)},stopPropagation:function(){var l=this.nativeEvent;l&&(l.stopPropagation?l.stopPropagation():typeof l.cancelBubble!="unknown"&&(l.cancelBubble=!0),this.isPropagationStopped=wn)},persist:function(){},isPersistent:wn}),e}var ta={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},ju=Yt(ta),rn=$({},ta,{view:0,detail:0}),k0=Yt(rn),js,Vs,gi,Vu=$({},rn,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:bc,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==gi&&(gi&&t.type==="mousemove"?(js=t.screenX-gi.screenX,Vs=t.screenY-gi.screenY):Vs=js=0,gi=t),js)},movementY:function(t){return"movementY"in t?t.movementY:Vs}}),Of=Yt(Vu),W0=$({},Vu,{dataTransfer:0}),P0=Yt(W0),$0=$({},rn,{relatedTarget:0}),Qs=Yt($0),I0=$({},ta,{animationName:0,elapsedTime:0,pseudoElement:0}),tv=Yt(I0),ev=$({},ta,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),lv=Yt(ev),av=$({},ta,{data:0}),Nf=Yt(av),iv={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},nv={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},uv={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function sv(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=uv[t])?!!e[t]:!1}function bc(){return sv}var rv=$({},rn,{key:function(t){if(t.key){var e=iv[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=tu(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?nv[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:bc,charCode:function(t){return t.type==="keypress"?tu(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?tu(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),cv=Yt(rv),ov=$({},Vu,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Hf=Yt(ov),fv=$({},rn,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:bc}),dv=Yt(fv),mv=$({},ta,{propertyName:0,elapsedTime:0,pseudoElement:0}),hv=Yt(mv),pv=$({},Vu,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),yv=Yt(pv),vv=$({},ta,{newState:0,oldState:0}),gv=Yt(vv),bv=[9,13,27,32],Mc=je&&"CompositionEvent"in window,_i=null;je&&"documentMode"in document&&(_i=document.documentMode);var Mv=je&&"TextEvent"in window&&!_i,vm=je&&(!Mc||_i&&8<_i&&11>=_i),Uf=" ",Bf=!1;function gm(t,e){switch(t){case"keyup":return bv.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function bm(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var Ga=!1;function Sv(t,e){switch(t){case"compositionend":return bm(e);case"keypress":return e.which!==32?null:(Bf=!0,Uf);case"textInput":return t=e.data,t===Uf&&Bf?null:t;default:return null}}function Ev(t,e){if(Ga)return t==="compositionend"||!Mc&&gm(t,e)?(t=ym(),In=gc=fl=null,Ga=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return vm&&e.locale!=="ko"?null:e.data;default:return null}}var xv={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Yf(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!xv[t.type]:e==="textarea"}function Mm(t,e,l,a){Ta?Ua?Ua.push(a):Ua=[a]:Ta=a,e=Hu(e,"onChange"),0<e.length&&(l=new ju("onChange","change",null,l,a),t.push({event:l,listeners:e}))}var Ri=null,Qi=null;function Tv(t){pp(t,0)}function Qu(t){var e=Ci(t);if(om(e))return t}function wf(t,e){if(t==="change")return e}var Sm=!1;je&&(je?(Ln="oninput"in document,Ln||(Zs=document.createElement("div"),Zs.setAttribute("oninput","return;"),Ln=typeof Zs.oninput=="function"),qn=Ln):qn=!1,Sm=qn&&(!document.documentMode||9<document.documentMode));var qn,Ln,Zs;function qf(){Ri&&(Ri.detachEvent("onpropertychange",Em),Qi=Ri=null)}function Em(t){if(t.propertyName==="value"&&Qu(Qi)){var e=[];Mm(e,Qi,t,vc(t)),pm(Tv,e)}}function Gv(t,e,l){t==="focusin"?(qf(),Ri=e,Qi=l,Ri.attachEvent("onpropertychange",Em)):t==="focusout"&&qf()}function Cv(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return Qu(Qi)}function Av(t,e){if(t==="click")return Qu(e)}function zv(t,e){if(t==="input"||t==="change")return Qu(e)}function _v(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var Jt=typeof Object.is=="function"?Object.is:_v;function Zi(t,e){if(Jt(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var l=Object.keys(t),a=Object.keys(e);if(l.length!==a.length)return!1;for(a=0;a<l.length;a++){var i=l[a];if(!Er.call(e,i)||!Jt(t[i],e[i]))return!1}return!0}function Lf(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function Xf(t,e){var l=Lf(t);t=0;for(var a;l;){if(l.nodeType===3){if(a=t+l.textContent.length,t<=e&&a>=e)return{node:l,offset:e-t};t=a}t:{for(;l;){if(l.nextSibling){l=l.nextSibling;break t}l=l.parentNode}l=void 0}l=Lf(l)}}function xm(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?xm(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function Tm(t){t=t!=null&&t.ownerDocument!=null&&t.ownerDocument.defaultView!=null?t.ownerDocument.defaultView:window;for(var e=yu(t.document);e instanceof t.HTMLIFrameElement;){try{var l=typeof e.contentWindow.location.href=="string"}catch{l=!1}if(l)t=e.contentWindow;else break;e=yu(t.document)}return e}function Sc(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}var Rv=je&&"documentMode"in document&&11>=document.documentMode,Ca=null,_r=null,Di=null,Rr=!1;function jf(t,e,l){var a=l.window===l?l.document:l.nodeType===9?l:l.ownerDocument;Rr||Ca==null||Ca!==yu(a)||(a=Ca,"selectionStart"in a&&Sc(a)?a={start:a.selectionStart,end:a.selectionEnd}:(a=(a.ownerDocument&&a.ownerDocument.defaultView||window).getSelection(),a={anchorNode:a.anchorNode,anchorOffset:a.anchorOffset,focusNode:a.focusNode,focusOffset:a.focusOffset}),Di&&Zi(Di,a)||(Di=a,a=Hu(_r,"onSelect"),0<a.length&&(e=new ju("onSelect","select",null,e,l),t.push({event:e,listeners:a}),e.target=Ca)))}function wl(t,e){var l={};return l[t.toLowerCase()]=e.toLowerCase(),l["Webkit"+t]="webkit"+e,l["Moz"+t]="moz"+e,l}var Aa={animationend:wl("Animation","AnimationEnd"),animationiteration:wl("Animation","AnimationIteration"),animationstart:wl("Animation","AnimationStart"),transitionrun:wl("Transition","TransitionRun"),transitionstart:wl("Transition","TransitionStart"),transitioncancel:wl("Transition","TransitionCancel"),transitionend:wl("Transition","TransitionEnd")},Ks={},Gm={};je&&(Gm=document.createElement("div").style,"AnimationEvent"in window||(delete Aa.animationend.animation,delete Aa.animationiteration.animation,delete Aa.animationstart.animation),"TransitionEvent"in window||delete Aa.transitionend.transition);function ea(t){if(Ks[t])return Ks[t];if(!Aa[t])return t;var e=Aa[t],l;for(l in e)if(e.hasOwnProperty(l)&&l in Gm)return Ks[t]=e[l];return t}var Cm=ea("animationend"),Am=ea("animationiteration"),zm=ea("animationstart"),Dv=ea("transitionrun"),Ov=ea("transitionstart"),Nv=ea("transitioncancel"),_m=ea("transitionend"),Rm=new Map,Dr="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");Dr.push("scrollEnd");function fe(t,e){Rm.set(t,e),Il(e,[t])}var vu=typeof reportError=="function"?reportError:function(t){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var e=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof t=="object"&&t!==null&&typeof t.message=="string"?String(t.message):String(t),error:t});if(!window.dispatchEvent(e))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",t);return}console.error(t)},$t=[],za=0,Ec=0;function Zu(){for(var t=za,e=Ec=za=0;e<t;){var l=$t[e];$t[e++]=null;var a=$t[e];$t[e++]=null;var i=$t[e];$t[e++]=null;var n=$t[e];if($t[e++]=null,a!==null&&i!==null){var u=a.pending;u===null?i.next=i:(i.next=u.next,u.next=i),a.pending=i}n!==0&&Dm(l,i,n)}}function Ku(t,e,l,a){$t[za++]=t,$t[za++]=e,$t[za++]=l,$t[za++]=a,Ec|=a,t.lanes|=a,t=t.alternate,t!==null&&(t.lanes|=a)}function xc(t,e,l,a){return Ku(t,e,l,a),gu(t)}function la(t,e){return Ku(t,null,null,e),gu(t)}function Dm(t,e,l){t.lanes|=l;var a=t.alternate;a!==null&&(a.lanes|=l);for(var i=!1,n=t.return;n!==null;)n.childLanes|=l,a=n.alternate,a!==null&&(a.childLanes|=l),n.tag===22&&(t=n.stateNode,t===null||t._visibility&1||(i=!0)),t=n,n=n.return;return t.tag===3?(n=t.stateNode,i&&e!==null&&(i=31-Zt(l),t=n.hiddenUpdates,a=t[i],a===null?t[i]=[e]:a.push(e),e.lane=l|536870912),n):null}function gu(t){if(50<Li)throw Li=0,$r=null,Error(g(185));for(var e=t.return;e!==null;)t=e,e=t.return;return t.tag===3?t.stateNode:null}var _a={};function Hv(t,e,l,a){this.tag=t,this.key=l,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=a,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Xt(t,e,l,a){return new Hv(t,e,l,a)}function Tc(t){return t=t.prototype,!(!t||!t.isReactComponent)}function qe(t,e){var l=t.alternate;return l===null?(l=Xt(t.tag,e,t.key,t.mode),l.elementType=t.elementType,l.type=t.type,l.stateNode=t.stateNode,l.alternate=t,t.alternate=l):(l.pendingProps=e,l.type=t.type,l.flags=0,l.subtreeFlags=0,l.deletions=null),l.flags=t.flags&65011712,l.childLanes=t.childLanes,l.lanes=t.lanes,l.child=t.child,l.memoizedProps=t.memoizedProps,l.memoizedState=t.memoizedState,l.updateQueue=t.updateQueue,e=t.dependencies,l.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},l.sibling=t.sibling,l.index=t.index,l.ref=t.ref,l.refCleanup=t.refCleanup,l}function Om(t,e){t.flags&=65011714;var l=t.alternate;return l===null?(t.childLanes=0,t.lanes=e,t.child=null,t.subtreeFlags=0,t.memoizedProps=null,t.memoizedState=null,t.updateQueue=null,t.dependencies=null,t.stateNode=null):(t.childLanes=l.childLanes,t.lanes=l.lanes,t.child=l.child,t.subtreeFlags=0,t.deletions=null,t.memoizedProps=l.memoizedProps,t.memoizedState=l.memoizedState,t.updateQueue=l.updateQueue,t.type=l.type,e=l.dependencies,t.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),t}function eu(t,e,l,a,i,n){var u=0;if(a=t,typeof t=="function")Tc(t)&&(u=1);else if(typeof t=="string")u=Y1(t,l,ge.current)?26:t==="html"||t==="head"||t==="body"?27:5;else t:switch(t){case gr:return t=Xt(31,l,e,i),t.elementType=gr,t.lanes=n,t;case Sa:return Ql(l.children,i,n,e);case Pd:u=8,i|=24;break;case pr:return t=Xt(12,l,e,i|2),t.elementType=pr,t.lanes=n,t;case yr:return t=Xt(13,l,e,i),t.elementType=yr,t.lanes=n,t;case vr:return t=Xt(19,l,e,i),t.elementType=vr,t.lanes=n,t;default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case Be:u=10;break t;case $d:u=9;break t;case oc:u=11;break t;case fc:u=14;break t;case il:u=16,a=null;break t}u=29,l=Error(g(130,t===null?"null":typeof t,"")),a=null}return e=Xt(u,l,e,i),e.elementType=t,e.type=a,e.lanes=n,e}function Ql(t,e,l,a){return t=Xt(7,t,a,e),t.lanes=l,t}function Js(t,e,l){return t=Xt(6,t,null,e),t.lanes=l,t}function Nm(t){var e=Xt(18,null,null,0);return e.stateNode=t,e}function Fs(t,e,l){return e=Xt(4,t.children!==null?t.children:[],t.key,e),e.lanes=l,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}var Vf=new WeakMap;function ae(t,e){if(typeof t=="object"&&t!==null){var l=Vf.get(t);return l!==void 0?l:(e={value:t,source:e,stack:Tf(e)},Vf.set(t,e),e)}return{value:t,source:e,stack:Tf(e)}}var Ra=[],Da=0,bu=null,Ki=0,te=[],ee=0,Tl=null,pe=1,ye="";function He(t,e){Ra[Da++]=Ki,Ra[Da++]=bu,bu=t,Ki=e}function Hm(t,e,l){te[ee++]=pe,te[ee++]=ye,te[ee++]=Tl,Tl=t;var a=pe;t=ye;var i=32-Zt(a)-1;a&=~(1<<i),l+=1;var n=32-Zt(e)+i;if(30<n){var u=i-i%5;n=(a&(1<<u)-1).toString(32),a>>=u,i-=u,pe=1<<32-Zt(e)+i|l<<i|a,ye=n+t}else pe=1<<n|l<<i|a,ye=t}function Gc(t){t.return!==null&&(He(t,1),Hm(t,1,0))}function Cc(t){for(;t===bu;)bu=Ra[--Da],Ra[Da]=null,Ki=Ra[--Da],Ra[Da]=null;for(;t===Tl;)Tl=te[--ee],te[ee]=null,ye=te[--ee],te[ee]=null,pe=te[--ee],te[ee]=null}function Um(t,e){te[ee++]=pe,te[ee++]=ye,te[ee++]=Tl,pe=e.id,ye=e.overflow,Tl=t}var Et=null,P=null,q=!1,yl=null,ie=!1,Or=Error(g(519));function Gl(t){var e=Error(g(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw Ji(ae(e,t)),Or}function Qf(t){var e=t.stateNode,l=t.type,a=t.memoizedProps;switch(e[St]=t,e[Bt]=a,l){case"dialog":B("cancel",e),B("close",e);break;case"iframe":case"object":case"embed":B("load",e);break;case"video":case"audio":for(l=0;l<Pi.length;l++)B(Pi[l],e);break;case"source":B("error",e);break;case"img":case"image":case"link":B("error",e),B("load",e);break;case"details":B("toggle",e);break;case"input":B("invalid",e),fm(e,a.value,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name,!0);break;case"select":B("invalid",e);break;case"textarea":B("invalid",e),mm(e,a.value,a.defaultValue,a.children)}l=a.children,typeof l!="string"&&typeof l!="number"&&typeof l!="bigint"||e.textContent===""+l||a.suppressHydrationWarning===!0||vp(e.textContent,l)?(a.popover!=null&&(B("beforetoggle",e),B("toggle",e)),a.onScroll!=null&&B("scroll",e),a.onScrollEnd!=null&&B("scrollend",e),a.onClick!=null&&(e.onclick=Ye),e=!0):e=!1,e||Gl(t,!0)}function Zf(t){for(Et=t.return;Et;)switch(Et.tag){case 5:case 31:case 13:ie=!1;return;case 27:case 3:ie=!0;return;default:Et=Et.return}}function va(t){if(t!==Et)return!1;if(!q)return Zf(t),q=!0,!1;var e=t.tag,l;if((l=e!==3&&e!==27)&&((l=e===5)&&(l=t.type,l=!(l!=="form"&&l!=="button")||ac(t.type,t.memoizedProps)),l=!l),l&&P&&Gl(t),Zf(t),e===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(g(317));P=Nd(t)}else if(e===31){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(g(317));P=Nd(t)}else e===27?(e=P,_l(t.type)?(t=sc,sc=null,P=t):P=e):P=Et?ue(t.stateNode.nextSibling):null;return!0}function Fl(){P=Et=null,q=!1}function ks(){var t=yl;return t!==null&&(Ht===null?Ht=t:Ht.push.apply(Ht,t),yl=null),t}function Ji(t){yl===null?yl=[t]:yl.push(t)}var Nr=be(null),aa=null,we=null;function ul(t,e,l){F(Nr,e._currentValue),e._currentValue=l}function Le(t){t._currentValue=Nr.current,bt(Nr)}function Hr(t,e,l){for(;t!==null;){var a=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,a!==null&&(a.childLanes|=e)):a!==null&&(a.childLanes&e)!==e&&(a.childLanes|=e),t===l)break;t=t.return}}function Ur(t,e,l,a){var i=t.child;for(i!==null&&(i.return=t);i!==null;){var n=i.dependencies;if(n!==null){var u=i.child;n=n.firstContext;t:for(;n!==null;){var s=n;n=i;for(var r=0;r<e.length;r++)if(s.context===e[r]){n.lanes|=l,s=n.alternate,s!==null&&(s.lanes|=l),Hr(n.return,l,t),a||(u=null);break t}n=s.next}}else if(i.tag===18){if(u=i.return,u===null)throw Error(g(341));u.lanes|=l,n=u.alternate,n!==null&&(n.lanes|=l),Hr(u,l,t),u=null}else u=i.child;if(u!==null)u.return=i;else for(u=i;u!==null;){if(u===t){u=null;break}if(i=u.sibling,i!==null){i.return=u.return,u=i;break}u=u.return}i=u}}function Ia(t,e,l,a){t=null;for(var i=e,n=!1;i!==null;){if(!n){if((i.flags&524288)!==0)n=!0;else if((i.flags&262144)!==0)break}if(i.tag===10){var u=i.alternate;if(u===null)throw Error(g(387));if(u=u.memoizedProps,u!==null){var s=i.type;Jt(i.pendingProps.value,u.value)||(t!==null?t.push(s):t=[s])}}else if(i===du.current){if(u=i.alternate,u===null)throw Error(g(387));u.memoizedState.memoizedState!==i.memoizedState.memoizedState&&(t!==null?t.push(Ii):t=[Ii])}i=i.return}t!==null&&Ur(e,t,l,a),e.flags|=262144}function Mu(t){for(t=t.firstContext;t!==null;){if(!Jt(t.context._currentValue,t.memoizedValue))return!0;t=t.next}return!1}function kl(t){aa=t,we=null,t=t.dependencies,t!==null&&(t.firstContext=null)}function xt(t){return Bm(aa,t)}function Xn(t,e){return aa===null&&kl(t),Bm(t,e)}function Bm(t,e){var l=e._currentValue;if(e={context:e,memoizedValue:l,next:null},we===null){if(t===null)throw Error(g(308));we=e,t.dependencies={lanes:0,firstContext:e},t.flags|=524288}else we=we.next=e;return l}var Uv=typeof AbortController<"u"?AbortController:function(){var t=[],e=this.signal={aborted:!1,addEventListener:function(l,a){t.push(a)}};this.abort=function(){e.aborted=!0,t.forEach(function(l){return l()})}},Bv=pt.unstable_scheduleCallback,Yv=pt.unstable_NormalPriority,ct={$$typeof:Be,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Ac(){return{controller:new Uv,data:new Map,refCount:0}}function cn(t){t.refCount--,t.refCount===0&&Bv(Yv,function(){t.controller.abort()})}var Oi=null,Br=0,Va=0,Ba=null;function wv(t,e){if(Oi===null){var l=Oi=[];Br=0,Va=$c(),Ba={status:"pending",value:void 0,then:function(a){l.push(a)}}}return Br++,e.then(Kf,Kf),e}function Kf(){if(--Br===0&&Oi!==null){Ba!==null&&(Ba.status="fulfilled");var t=Oi;Oi=null,Va=0,Ba=null;for(var e=0;e<t.length;e++)(0,t[e])()}}function qv(t,e){var l=[],a={status:"pending",value:null,reason:null,then:function(i){l.push(i)}};return t.then(function(){a.status="fulfilled",a.value=e;for(var i=0;i<l.length;i++)(0,l[i])(e)},function(i){for(a.status="rejected",a.reason=i,i=0;i<l.length;i++)(0,l[i])(void 0)}),a}var Jf=A.S;A.S=function(t,e){Wh=Vt(),typeof e=="object"&&e!==null&&typeof e.then=="function"&&wv(t,e),Jf!==null&&Jf(t,e)};var Zl=be(null);function zc(){var t=Zl.current;return t!==null?t:J.pooledCache}function lu(t,e){e===null?F(Zl,Zl.current):F(Zl,e.pool)}function Ym(){var t=zc();return t===null?null:{parent:ct._currentValue,pool:t}}var ti=Error(g(460)),_c=Error(g(474)),Ju=Error(g(542)),Su={then:function(){}};function Ff(t){return t=t.status,t==="fulfilled"||t==="rejected"}function wm(t,e,l){switch(l=t[l],l===void 0?t.push(e):l!==e&&(e.then(Ye,Ye),e=l),e.status){case"fulfilled":return e.value;case"rejected":throw t=e.reason,Wf(t),t;default:if(typeof e.status=="string")e.then(Ye,Ye);else{if(t=J,t!==null&&100<t.shellSuspendCounter)throw Error(g(482));t=e,t.status="pending",t.then(function(a){if(e.status==="pending"){var i=e;i.status="fulfilled",i.value=a}},function(a){if(e.status==="pending"){var i=e;i.status="rejected",i.reason=a}})}switch(e.status){case"fulfilled":return e.value;case"rejected":throw t=e.reason,Wf(t),t}throw Kl=e,ti}}function Xl(t){try{var e=t._init;return e(t._payload)}catch(l){throw l!==null&&typeof l=="object"&&typeof l.then=="function"?(Kl=l,ti):l}}var Kl=null;function kf(){if(Kl===null)throw Error(g(459));var t=Kl;return Kl=null,t}function Wf(t){if(t===ti||t===Ju)throw Error(g(483))}var Ya=null,Fi=0;function jn(t){var e=Fi;return Fi+=1,Ya===null&&(Ya=[]),wm(Ya,t,e)}function bi(t,e){e=e.props.ref,t.ref=e!==void 0?e:null}function Vn(t,e){throw e.$$typeof===G0?Error(g(525)):(t=Object.prototype.toString.call(e),Error(g(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)))}function qm(t){function e(f,c){if(t){var m=f.deletions;m===null?(f.deletions=[c],f.flags|=16):m.push(c)}}function l(f,c){if(!t)return null;for(;c!==null;)e(f,c),c=c.sibling;return null}function a(f){for(var c=new Map;f!==null;)f.key!==null?c.set(f.key,f):c.set(f.index,f),f=f.sibling;return c}function i(f,c){return f=qe(f,c),f.index=0,f.sibling=null,f}function n(f,c,m){return f.index=m,t?(m=f.alternate,m!==null?(m=m.index,m<c?(f.flags|=67108866,c):m):(f.flags|=67108866,c)):(f.flags|=1048576,c)}function u(f){return t&&f.alternate===null&&(f.flags|=67108866),f}function s(f,c,m,v){return c===null||c.tag!==6?(c=Js(m,f.mode,v),c.return=f,c):(c=i(c,m),c.return=f,c)}function r(f,c,m,v){var T=m.type;return T===Sa?h(f,c,m.props.children,v,m.key):c!==null&&(c.elementType===T||typeof T=="object"&&T!==null&&T.$$typeof===il&&Xl(T)===c.type)?(c=i(c,m.props),bi(c,m),c.return=f,c):(c=eu(m.type,m.key,m.props,null,f.mode,v),bi(c,m),c.return=f,c)}function o(f,c,m,v){return c===null||c.tag!==4||c.stateNode.containerInfo!==m.containerInfo||c.stateNode.implementation!==m.implementation?(c=Fs(m,f.mode,v),c.return=f,c):(c=i(c,m.children||[]),c.return=f,c)}function h(f,c,m,v,T){return c===null||c.tag!==7?(c=Ql(m,f.mode,v,T),c.return=f,c):(c=i(c,m),c.return=f,c)}function y(f,c,m){if(typeof c=="string"&&c!==""||typeof c=="number"||typeof c=="bigint")return c=Js(""+c,f.mode,m),c.return=f,c;if(typeof c=="object"&&c!==null){switch(c.$$typeof){case Nn:return m=eu(c.type,c.key,c.props,null,f.mode,m),bi(m,c),m.return=f,m;case Ti:return c=Fs(c,f.mode,m),c.return=f,c;case il:return c=Xl(c),y(f,c,m)}if(Gi(c)||vi(c))return c=Ql(c,f.mode,m,null),c.return=f,c;if(typeof c.then=="function")return y(f,jn(c),m);if(c.$$typeof===Be)return y(f,Xn(f,c),m);Vn(f,c)}return null}function d(f,c,m,v){var T=c!==null?c.key:null;if(typeof m=="string"&&m!==""||typeof m=="number"||typeof m=="bigint")return T!==null?null:s(f,c,""+m,v);if(typeof m=="object"&&m!==null){switch(m.$$typeof){case Nn:return m.key===T?r(f,c,m,v):null;case Ti:return m.key===T?o(f,c,m,v):null;case il:return m=Xl(m),d(f,c,m,v)}if(Gi(m)||vi(m))return T!==null?null:h(f,c,m,v,null);if(typeof m.then=="function")return d(f,c,jn(m),v);if(m.$$typeof===Be)return d(f,c,Xn(f,m),v);Vn(f,m)}return null}function p(f,c,m,v,T){if(typeof v=="string"&&v!==""||typeof v=="number"||typeof v=="bigint")return f=f.get(m)||null,s(c,f,""+v,T);if(typeof v=="object"&&v!==null){switch(v.$$typeof){case Nn:return f=f.get(v.key===null?m:v.key)||null,r(c,f,v,T);case Ti:return f=f.get(v.key===null?m:v.key)||null,o(c,f,v,T);case il:return v=Xl(v),p(f,c,m,v,T)}if(Gi(v)||vi(v))return f=f.get(m)||null,h(c,f,v,T,null);if(typeof v.then=="function")return p(f,c,m,jn(v),T);if(v.$$typeof===Be)return p(f,c,m,Xn(c,v),T);Vn(c,v)}return null}function M(f,c,m,v){for(var T=null,H=null,E=c,R=c=0,b=null;E!==null&&R<m.length;R++){E.index>R?(b=E,E=null):b=E.sibling;var z=d(f,E,m[R],v);if(z===null){E===null&&(E=b);break}t&&E&&z.alternate===null&&e(f,E),c=n(z,c,R),H===null?T=z:H.sibling=z,H=z,E=b}if(R===m.length)return l(f,E),q&&He(f,R),T;if(E===null){for(;R<m.length;R++)E=y(f,m[R],v),E!==null&&(c=n(E,c,R),H===null?T=E:H.sibling=E,H=E);return q&&He(f,R),T}for(E=a(E);R<m.length;R++)b=p(E,f,R,m[R],v),b!==null&&(t&&b.alternate!==null&&E.delete(b.key===null?R:b.key),c=n(b,c,R),H===null?T=b:H.sibling=b,H=b);return t&&E.forEach(function(yt){return e(f,yt)}),q&&He(f,R),T}function S(f,c,m,v){if(m==null)throw Error(g(151));for(var T=null,H=null,E=c,R=c=0,b=null,z=m.next();E!==null&&!z.done;R++,z=m.next()){E.index>R?(b=E,E=null):b=E.sibling;var yt=d(f,E,z.value,v);if(yt===null){E===null&&(E=b);break}t&&E&&yt.alternate===null&&e(f,E),c=n(yt,c,R),H===null?T=yt:H.sibling=yt,H=yt,E=b}if(z.done)return l(f,E),q&&He(f,R),T;if(E===null){for(;!z.done;R++,z=m.next())z=y(f,z.value,v),z!==null&&(c=n(z,c,R),H===null?T=z:H.sibling=z,H=z);return q&&He(f,R),T}for(E=a(E);!z.done;R++,z=m.next())z=p(E,f,R,z.value,v),z!==null&&(t&&z.alternate!==null&&E.delete(z.key===null?R:z.key),c=n(z,c,R),H===null?T=z:H.sibling=z,H=z);return t&&E.forEach(function(fa){return e(f,fa)}),q&&He(f,R),T}function U(f,c,m,v){if(typeof m=="object"&&m!==null&&m.type===Sa&&m.key===null&&(m=m.props.children),typeof m=="object"&&m!==null){switch(m.$$typeof){case Nn:t:{for(var T=m.key;c!==null;){if(c.key===T){if(T=m.type,T===Sa){if(c.tag===7){l(f,c.sibling),v=i(c,m.props.children),v.return=f,f=v;break t}}else if(c.elementType===T||typeof T=="object"&&T!==null&&T.$$typeof===il&&Xl(T)===c.type){l(f,c.sibling),v=i(c,m.props),bi(v,m),v.return=f,f=v;break t}l(f,c);break}else e(f,c);c=c.sibling}m.type===Sa?(v=Ql(m.props.children,f.mode,v,m.key),v.return=f,f=v):(v=eu(m.type,m.key,m.props,null,f.mode,v),bi(v,m),v.return=f,f=v)}return u(f);case Ti:t:{for(T=m.key;c!==null;){if(c.key===T)if(c.tag===4&&c.stateNode.containerInfo===m.containerInfo&&c.stateNode.implementation===m.implementation){l(f,c.sibling),v=i(c,m.children||[]),v.return=f,f=v;break t}else{l(f,c);break}else e(f,c);c=c.sibling}v=Fs(m,f.mode,v),v.return=f,f=v}return u(f);case il:return m=Xl(m),U(f,c,m,v)}if(Gi(m))return M(f,c,m,v);if(vi(m)){if(T=vi(m),typeof T!="function")throw Error(g(150));return m=T.call(m),S(f,c,m,v)}if(typeof m.then=="function")return U(f,c,jn(m),v);if(m.$$typeof===Be)return U(f,c,Xn(f,m),v);Vn(f,m)}return typeof m=="string"&&m!==""||typeof m=="number"||typeof m=="bigint"?(m=""+m,c!==null&&c.tag===6?(l(f,c.sibling),v=i(c,m),v.return=f,f=v):(l(f,c),v=Js(m,f.mode,v),v.return=f,f=v),u(f)):l(f,c)}return function(f,c,m,v){try{Fi=0;var T=U(f,c,m,v);return Ya=null,T}catch(E){if(E===ti||E===Ju)throw E;var H=Xt(29,E,null,f.mode);return H.lanes=v,H.return=f,H}}}var Wl=qm(!0),Lm=qm(!1),nl=!1;function Rc(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Yr(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,callbacks:null})}function vl(t){return{lane:t,tag:0,payload:null,callback:null,next:null}}function gl(t,e,l){var a=t.updateQueue;if(a===null)return null;if(a=a.shared,(L&2)!==0){var i=a.pending;return i===null?e.next=e:(e.next=i.next,i.next=e),a.pending=e,e=gu(t),Dm(t,null,l),e}return Ku(t,a,e,l),gu(t)}function Ni(t,e,l){if(e=e.updateQueue,e!==null&&(e=e.shared,(l&4194048)!==0)){var a=e.lanes;a&=t.pendingLanes,l|=a,e.lanes=l,im(t,l)}}function Ws(t,e){var l=t.updateQueue,a=t.alternate;if(a!==null&&(a=a.updateQueue,l===a)){var i=null,n=null;if(l=l.firstBaseUpdate,l!==null){do{var u={lane:l.lane,tag:l.tag,payload:l.payload,callback:null,next:null};n===null?i=n=u:n=n.next=u,l=l.next}while(l!==null);n===null?i=n=e:n=n.next=e}else i=n=e;l={baseState:a.baseState,firstBaseUpdate:i,lastBaseUpdate:n,shared:a.shared,callbacks:a.callbacks},t.updateQueue=l;return}t=l.lastBaseUpdate,t===null?l.firstBaseUpdate=e:t.next=e,l.lastBaseUpdate=e}var wr=!1;function Hi(){if(wr){var t=Ba;if(t!==null)throw t}}function Ui(t,e,l,a){wr=!1;var i=t.updateQueue;nl=!1;var n=i.firstBaseUpdate,u=i.lastBaseUpdate,s=i.shared.pending;if(s!==null){i.shared.pending=null;var r=s,o=r.next;r.next=null,u===null?n=o:u.next=o,u=r;var h=t.alternate;h!==null&&(h=h.updateQueue,s=h.lastBaseUpdate,s!==u&&(s===null?h.firstBaseUpdate=o:s.next=o,h.lastBaseUpdate=r))}if(n!==null){var y=i.baseState;u=0,h=o=r=null,s=n;do{var d=s.lane&-536870913,p=d!==s.lane;if(p?(w&d)===d:(a&d)===d){d!==0&&d===Va&&(wr=!0),h!==null&&(h=h.next={lane:0,tag:s.tag,payload:s.payload,callback:null,next:null});t:{var M=t,S=s;d=e;var U=l;switch(S.tag){case 1:if(M=S.payload,typeof M=="function"){y=M.call(U,y,d);break t}y=M;break t;case 3:M.flags=M.flags&-65537|128;case 0:if(M=S.payload,d=typeof M=="function"?M.call(U,y,d):M,d==null)break t;y=$({},y,d);break t;case 2:nl=!0}}d=s.callback,d!==null&&(t.flags|=64,p&&(t.flags|=8192),p=i.callbacks,p===null?i.callbacks=[d]:p.push(d))}else p={lane:d,tag:s.tag,payload:s.payload,callback:s.callback,next:null},h===null?(o=h=p,r=y):h=h.next=p,u|=d;if(s=s.next,s===null){if(s=i.shared.pending,s===null)break;p=s,s=p.next,p.next=null,i.lastBaseUpdate=p,i.shared.pending=null}}while(!0);h===null&&(r=y),i.baseState=r,i.firstBaseUpdate=o,i.lastBaseUpdate=h,n===null&&(i.shared.lanes=0),Al|=u,t.lanes=u,t.memoizedState=y}}function Xm(t,e){if(typeof t!="function")throw Error(g(191,t));t.call(e)}function jm(t,e){var l=t.callbacks;if(l!==null)for(t.callbacks=null,t=0;t<l.length;t++)Xm(l[t],e)}var Qa=be(null),Eu=be(0);function Pf(t,e){t=Ke,F(Eu,t),F(Qa,e),Ke=t|e.baseLanes}function qr(){F(Eu,Ke),F(Qa,Qa.current)}function Dc(){Ke=Eu.current,bt(Qa),bt(Eu)}var Ft=be(null),ne=null;function sl(t){var e=t.alternate;F(nt,nt.current&1),F(Ft,t),ne===null&&(e===null||Qa.current!==null||e.memoizedState!==null)&&(ne=t)}function Lr(t){F(nt,nt.current),F(Ft,t),ne===null&&(ne=t)}function Vm(t){t.tag===22?(F(nt,nt.current),F(Ft,t),ne===null&&(ne=t)):rl(t)}function rl(){F(nt,nt.current),F(Ft,Ft.current)}function Lt(t){bt(Ft),ne===t&&(ne=null),bt(nt)}var nt=be(0);function xu(t){for(var e=t;e!==null;){if(e.tag===13){var l=e.memoizedState;if(l!==null&&(l=l.dehydrated,l===null||nc(l)||uc(l)))return e}else if(e.tag===19&&(e.memoizedProps.revealOrder==="forwards"||e.memoizedProps.revealOrder==="backwards"||e.memoizedProps.revealOrder==="unstable_legacy-backwards"||e.memoizedProps.revealOrder==="together")){if((e.flags&128)!==0)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var Ve=0,O=null,K=null,st=null,Tu=!1,wa=!1,Pl=!1,Gu=0,ki=0,qa=null,Lv=0;function lt(){throw Error(g(321))}function Oc(t,e){if(e===null)return!1;for(var l=0;l<e.length&&l<t.length;l++)if(!Jt(t[l],e[l]))return!1;return!0}function Nc(t,e,l,a,i,n){return Ve=n,O=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,A.H=t===null||t.memoizedState===null?Mh:Qc,Pl=!1,n=l(a,i),Pl=!1,wa&&(n=Zm(e,l,a,i)),Qm(t),n}function Qm(t){A.H=Wi;var e=K!==null&&K.next!==null;if(Ve=0,st=K=O=null,Tu=!1,ki=0,qa=null,e)throw Error(g(300));t===null||ot||(t=t.dependencies,t!==null&&Mu(t)&&(ot=!0))}function Zm(t,e,l,a){O=t;var i=0;do{if(wa&&(qa=null),ki=0,wa=!1,25<=i)throw Error(g(301));if(i+=1,st=K=null,t.updateQueue!=null){var n=t.updateQueue;n.lastEffect=null,n.events=null,n.stores=null,n.memoCache!=null&&(n.memoCache.index=0)}A.H=Sh,n=e(l,a)}while(wa);return n}function Xv(){var t=A.H,e=t.useState()[0];return e=typeof e.then=="function"?on(e):e,t=t.useState()[0],(K!==null?K.memoizedState:null)!==t&&(O.flags|=1024),e}function Hc(){var t=Gu!==0;return Gu=0,t}function Uc(t,e,l){e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~l}function Bc(t){if(Tu){for(t=t.memoizedState;t!==null;){var e=t.queue;e!==null&&(e.pending=null),t=t.next}Tu=!1}Ve=0,st=K=O=null,wa=!1,ki=Gu=0,qa=null}function _t(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return st===null?O.memoizedState=st=t:st=st.next=t,st}function ut(){if(K===null){var t=O.alternate;t=t!==null?t.memoizedState:null}else t=K.next;var e=st===null?O.memoizedState:st.next;if(e!==null)st=e,K=t;else{if(t===null)throw O.alternate===null?Error(g(467)):Error(g(310));K=t,t={memoizedState:K.memoizedState,baseState:K.baseState,baseQueue:K.baseQueue,queue:K.queue,next:null},st===null?O.memoizedState=st=t:st=st.next=t}return st}function Fu(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function on(t){var e=ki;return ki+=1,qa===null&&(qa=[]),t=wm(qa,t,e),e=O,(st===null?e.memoizedState:st.next)===null&&(e=e.alternate,A.H=e===null||e.memoizedState===null?Mh:Qc),t}function ku(t){if(t!==null&&typeof t=="object"){if(typeof t.then=="function")return on(t);if(t.$$typeof===Be)return xt(t)}throw Error(g(438,String(t)))}function Yc(t){var e=null,l=O.updateQueue;if(l!==null&&(e=l.memoCache),e==null){var a=O.alternate;a!==null&&(a=a.updateQueue,a!==null&&(a=a.memoCache,a!=null&&(e={data:a.data.map(function(i){return i.slice()}),index:0})))}if(e==null&&(e={data:[],index:0}),l===null&&(l=Fu(),O.updateQueue=l),l.memoCache=e,l=e.data[e.index],l===void 0)for(l=e.data[e.index]=Array(t),a=0;a<t;a++)l[a]=C0;return e.index++,l}function Qe(t,e){return typeof e=="function"?e(t):e}function au(t){var e=ut();return wc(e,K,t)}function wc(t,e,l){var a=t.queue;if(a===null)throw Error(g(311));a.lastRenderedReducer=l;var i=t.baseQueue,n=a.pending;if(n!==null){if(i!==null){var u=i.next;i.next=n.next,n.next=u}e.baseQueue=i=n,a.pending=null}if(n=t.baseState,i===null)t.memoizedState=n;else{e=i.next;var s=u=null,r=null,o=e,h=!1;do{var y=o.lane&-536870913;if(y!==o.lane?(w&y)===y:(Ve&y)===y){var d=o.revertLane;if(d===0)r!==null&&(r=r.next={lane:0,revertLane:0,gesture:null,action:o.action,hasEagerState:o.hasEagerState,eagerState:o.eagerState,next:null}),y===Va&&(h=!0);else if((Ve&d)===d){o=o.next,d===Va&&(h=!0);continue}else y={lane:0,revertLane:o.revertLane,gesture:null,action:o.action,hasEagerState:o.hasEagerState,eagerState:o.eagerState,next:null},r===null?(s=r=y,u=n):r=r.next=y,O.lanes|=d,Al|=d;y=o.action,Pl&&l(n,y),n=o.hasEagerState?o.eagerState:l(n,y)}else d={lane:y,revertLane:o.revertLane,gesture:o.gesture,action:o.action,hasEagerState:o.hasEagerState,eagerState:o.eagerState,next:null},r===null?(s=r=d,u=n):r=r.next=d,O.lanes|=y,Al|=y;o=o.next}while(o!==null&&o!==e);if(r===null?u=n:r.next=s,!Jt(n,t.memoizedState)&&(ot=!0,h&&(l=Ba,l!==null)))throw l;t.memoizedState=n,t.baseState=u,t.baseQueue=r,a.lastRenderedState=n}return i===null&&(a.lanes=0),[t.memoizedState,a.dispatch]}function Ps(t){var e=ut(),l=e.queue;if(l===null)throw Error(g(311));l.lastRenderedReducer=t;var a=l.dispatch,i=l.pending,n=e.memoizedState;if(i!==null){l.pending=null;var u=i=i.next;do n=t(n,u.action),u=u.next;while(u!==i);Jt(n,e.memoizedState)||(ot=!0),e.memoizedState=n,e.baseQueue===null&&(e.baseState=n),l.lastRenderedState=n}return[n,a]}function Km(t,e,l){var a=O,i=ut(),n=q;if(n){if(l===void 0)throw Error(g(407));l=l()}else l=e();var u=!Jt((K||i).memoizedState,l);if(u&&(i.memoizedState=l,ot=!0),i=i.queue,qc(km.bind(null,a,i,t),[t]),i.getSnapshot!==e||u||st!==null&&st.memoizedState.tag&1){if(a.flags|=2048,Za(9,{destroy:void 0},Fm.bind(null,a,i,l,e),null),J===null)throw Error(g(349));n||(Ve&127)!==0||Jm(a,e,l)}return l}function Jm(t,e,l){t.flags|=16384,t={getSnapshot:e,value:l},e=O.updateQueue,e===null?(e=Fu(),O.updateQueue=e,e.stores=[t]):(l=e.stores,l===null?e.stores=[t]:l.push(t))}function Fm(t,e,l,a){e.value=l,e.getSnapshot=a,Wm(e)&&Pm(t)}function km(t,e,l){return l(function(){Wm(e)&&Pm(t)})}function Wm(t){var e=t.getSnapshot;t=t.value;try{var l=e();return!Jt(t,l)}catch{return!0}}function Pm(t){var e=la(t,2);e!==null&&Ut(e,t,2)}function Xr(t){var e=_t();if(typeof t=="function"){var l=t;if(t=l(),Pl){ol(!0);try{l()}finally{ol(!1)}}}return e.memoizedState=e.baseState=t,e.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Qe,lastRenderedState:t},e}function $m(t,e,l,a){return t.baseState=l,wc(t,K,typeof a=="function"?a:Qe)}function jv(t,e,l,a,i){if(Pu(t))throw Error(g(485));if(t=e.action,t!==null){var n={payload:i,action:t,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(u){n.listeners.push(u)}};A.T!==null?l(!0):n.isTransition=!1,a(n),l=e.pending,l===null?(n.next=e.pending=n,Im(e,n)):(n.next=l.next,e.pending=l.next=n)}}function Im(t,e){var l=e.action,a=e.payload,i=t.state;if(e.isTransition){var n=A.T,u={};A.T=u;try{var s=l(i,a),r=A.S;r!==null&&r(u,s),$f(t,e,s)}catch(o){jr(t,e,o)}finally{n!==null&&u.types!==null&&(n.types=u.types),A.T=n}}else try{n=l(i,a),$f(t,e,n)}catch(o){jr(t,e,o)}}function $f(t,e,l){l!==null&&typeof l=="object"&&typeof l.then=="function"?l.then(function(a){If(t,e,a)},function(a){return jr(t,e,a)}):If(t,e,l)}function If(t,e,l){e.status="fulfilled",e.value=l,th(e),t.state=l,e=t.pending,e!==null&&(l=e.next,l===e?t.pending=null:(l=l.next,e.next=l,Im(t,l)))}function jr(t,e,l){var a=t.pending;if(t.pending=null,a!==null){a=a.next;do e.status="rejected",e.reason=l,th(e),e=e.next;while(e!==a)}t.action=null}function th(t){t=t.listeners;for(var e=0;e<t.length;e++)(0,t[e])()}function eh(t,e){return e}function td(t,e){if(q){var l=J.formState;if(l!==null){t:{var a=O;if(q){if(P){e:{for(var i=P,n=ie;i.nodeType!==8;){if(!n){i=null;break e}if(i=ue(i.nextSibling),i===null){i=null;break e}}n=i.data,i=n==="F!"||n==="F"?i:null}if(i){P=ue(i.nextSibling),a=i.data==="F!";break t}}Gl(a)}a=!1}a&&(e=l[0])}}return l=_t(),l.memoizedState=l.baseState=e,a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:eh,lastRenderedState:e},l.queue=a,l=vh.bind(null,O,a),a.dispatch=l,a=Xr(!1),n=Vc.bind(null,O,!1,a.queue),a=_t(),i={state:e,dispatch:null,action:t,pending:null},a.queue=i,l=jv.bind(null,O,i,n,l),i.dispatch=l,a.memoizedState=t,[e,l,!1]}function ed(t){var e=ut();return lh(e,K,t)}function lh(t,e,l){if(e=wc(t,e,eh)[0],t=au(Qe)[0],typeof e=="object"&&e!==null&&typeof e.then=="function")try{var a=on(e)}catch(u){throw u===ti?Ju:u}else a=e;e=ut();var i=e.queue,n=i.dispatch;return l!==e.memoizedState&&(O.flags|=2048,Za(9,{destroy:void 0},Vv.bind(null,i,l),null)),[a,n,t]}function Vv(t,e){t.action=e}function ld(t){var e=ut(),l=K;if(l!==null)return lh(e,l,t);ut(),e=e.memoizedState,l=ut();var a=l.queue.dispatch;return l.memoizedState=t,[e,a,!1]}function Za(t,e,l,a){return t={tag:t,create:l,deps:a,inst:e,next:null},e=O.updateQueue,e===null&&(e=Fu(),O.updateQueue=e),l=e.lastEffect,l===null?e.lastEffect=t.next=t:(a=l.next,l.next=t,t.next=a,e.lastEffect=t),t}function ah(){return ut().memoizedState}function iu(t,e,l,a){var i=_t();O.flags|=t,i.memoizedState=Za(1|e,{destroy:void 0},l,a===void 0?null:a)}function Wu(t,e,l,a){var i=ut();a=a===void 0?null:a;var n=i.memoizedState.inst;K!==null&&a!==null&&Oc(a,K.memoizedState.deps)?i.memoizedState=Za(e,n,l,a):(O.flags|=t,i.memoizedState=Za(1|e,n,l,a))}function ad(t,e){iu(8390656,8,t,e)}function qc(t,e){Wu(2048,8,t,e)}function Qv(t){O.flags|=4;var e=O.updateQueue;if(e===null)e=Fu(),O.updateQueue=e,e.events=[t];else{var l=e.events;l===null?e.events=[t]:l.push(t)}}function ih(t){var e=ut().memoizedState;return Qv({ref:e,nextImpl:t}),function(){if((L&2)!==0)throw Error(g(440));return e.impl.apply(void 0,arguments)}}function nh(t,e){return Wu(4,2,t,e)}function uh(t,e){return Wu(4,4,t,e)}function sh(t,e){if(typeof e=="function"){t=t();var l=e(t);return function(){typeof l=="function"?l():e(null)}}if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function rh(t,e,l){l=l!=null?l.concat([t]):null,Wu(4,4,sh.bind(null,e,t),l)}function Lc(){}function ch(t,e){var l=ut();e=e===void 0?null:e;var a=l.memoizedState;return e!==null&&Oc(e,a[1])?a[0]:(l.memoizedState=[t,e],t)}function oh(t,e){var l=ut();e=e===void 0?null:e;var a=l.memoizedState;if(e!==null&&Oc(e,a[1]))return a[0];if(a=t(),Pl){ol(!0);try{t()}finally{ol(!1)}}return l.memoizedState=[a,e],a}function Xc(t,e,l){return l===void 0||(Ve&1073741824)!==0&&(w&261930)===0?t.memoizedState=e:(t.memoizedState=l,t=$h(),O.lanes|=t,Al|=t,l)}function fh(t,e,l,a){return Jt(l,e)?l:Qa.current!==null?(t=Xc(t,l,a),Jt(t,e)||(ot=!0),t):(Ve&42)===0||(Ve&1073741824)!==0&&(w&261930)===0?(ot=!0,t.memoizedState=l):(t=$h(),O.lanes|=t,Al|=t,e)}function dh(t,e,l,a,i){var n=X.p;X.p=n!==0&&8>n?n:8;var u=A.T,s={};A.T=s,Vc(t,!1,e,l);try{var r=i(),o=A.S;if(o!==null&&o(s,r),r!==null&&typeof r=="object"&&typeof r.then=="function"){var h=qv(r,a);Bi(t,e,h,Kt(t))}else Bi(t,e,a,Kt(t))}catch(y){Bi(t,e,{then:function(){},status:"rejected",reason:y},Kt())}finally{X.p=n,u!==null&&s.types!==null&&(u.types=s.types),A.T=u}}function Zv(){}function Vr(t,e,l,a){if(t.tag!==5)throw Error(g(476));var i=mh(t).queue;dh(t,i,e,Vl,l===null?Zv:function(){return hh(t),l(a)})}function mh(t){var e=t.memoizedState;if(e!==null)return e;e={memoizedState:Vl,baseState:Vl,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Qe,lastRenderedState:Vl},next:null};var l={};return e.next={memoizedState:l,baseState:l,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Qe,lastRenderedState:l},next:null},t.memoizedState=e,t=t.alternate,t!==null&&(t.memoizedState=e),e}function hh(t){var e=mh(t);e.next===null&&(e=t.alternate.memoizedState),Bi(t,e.next.queue,{},Kt())}function jc(){return xt(Ii)}function ph(){return ut().memoizedState}function yh(){return ut().memoizedState}function Kv(t){for(var e=t.return;e!==null;){switch(e.tag){case 24:case 3:var l=Kt();t=vl(l);var a=gl(e,t,l);a!==null&&(Ut(a,e,l),Ni(a,e,l)),e={cache:Ac()},t.payload=e;return}e=e.return}}function Jv(t,e,l){var a=Kt();l={lane:a,revertLane:0,gesture:null,action:l,hasEagerState:!1,eagerState:null,next:null},Pu(t)?gh(e,l):(l=xc(t,e,l,a),l!==null&&(Ut(l,t,a),bh(l,e,a)))}function vh(t,e,l){var a=Kt();Bi(t,e,l,a)}function Bi(t,e,l,a){var i={lane:a,revertLane:0,gesture:null,action:l,hasEagerState:!1,eagerState:null,next:null};if(Pu(t))gh(e,i);else{var n=t.alternate;if(t.lanes===0&&(n===null||n.lanes===0)&&(n=e.lastRenderedReducer,n!==null))try{var u=e.lastRenderedState,s=n(u,l);if(i.hasEagerState=!0,i.eagerState=s,Jt(s,u))return Ku(t,e,i,0),J===null&&Zu(),!1}catch{}if(l=xc(t,e,i,a),l!==null)return Ut(l,t,a),bh(l,e,a),!0}return!1}function Vc(t,e,l,a){if(a={lane:2,revertLane:$c(),gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null},Pu(t)){if(e)throw Error(g(479))}else e=xc(t,l,a,2),e!==null&&Ut(e,t,2)}function Pu(t){var e=t.alternate;return t===O||e!==null&&e===O}function gh(t,e){wa=Tu=!0;var l=t.pending;l===null?e.next=e:(e.next=l.next,l.next=e),t.pending=e}function bh(t,e,l){if((l&4194048)!==0){var a=e.lanes;a&=t.pendingLanes,l|=a,e.lanes=l,im(t,l)}}var Wi={readContext:xt,use:ku,useCallback:lt,useContext:lt,useEffect:lt,useImperativeHandle:lt,useLayoutEffect:lt,useInsertionEffect:lt,useMemo:lt,useReducer:lt,useRef:lt,useState:lt,useDebugValue:lt,useDeferredValue:lt,useTransition:lt,useSyncExternalStore:lt,useId:lt,useHostTransitionStatus:lt,useFormState:lt,useActionState:lt,useOptimistic:lt,useMemoCache:lt,useCacheRefresh:lt};Wi.useEffectEvent=lt;var Mh={readContext:xt,use:ku,useCallback:function(t,e){return _t().memoizedState=[t,e===void 0?null:e],t},useContext:xt,useEffect:ad,useImperativeHandle:function(t,e,l){l=l!=null?l.concat([t]):null,iu(4194308,4,sh.bind(null,e,t),l)},useLayoutEffect:function(t,e){return iu(4194308,4,t,e)},useInsertionEffect:function(t,e){iu(4,2,t,e)},useMemo:function(t,e){var l=_t();e=e===void 0?null:e;var a=t();if(Pl){ol(!0);try{t()}finally{ol(!1)}}return l.memoizedState=[a,e],a},useReducer:function(t,e,l){var a=_t();if(l!==void 0){var i=l(e);if(Pl){ol(!0);try{l(e)}finally{ol(!1)}}}else i=e;return a.memoizedState=a.baseState=i,t={pending:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:i},a.queue=t,t=t.dispatch=Jv.bind(null,O,t),[a.memoizedState,t]},useRef:function(t){var e=_t();return t={current:t},e.memoizedState=t},useState:function(t){t=Xr(t);var e=t.queue,l=vh.bind(null,O,e);return e.dispatch=l,[t.memoizedState,l]},useDebugValue:Lc,useDeferredValue:function(t,e){var l=_t();return Xc(l,t,e)},useTransition:function(){var t=Xr(!1);return t=dh.bind(null,O,t.queue,!0,!1),_t().memoizedState=t,[!1,t]},useSyncExternalStore:function(t,e,l){var a=O,i=_t();if(q){if(l===void 0)throw Error(g(407));l=l()}else{if(l=e(),J===null)throw Error(g(349));(w&127)!==0||Jm(a,e,l)}i.memoizedState=l;var n={value:l,getSnapshot:e};return i.queue=n,ad(km.bind(null,a,n,t),[t]),a.flags|=2048,Za(9,{destroy:void 0},Fm.bind(null,a,n,l,e),null),l},useId:function(){var t=_t(),e=J.identifierPrefix;if(q){var l=ye,a=pe;l=(a&~(1<<32-Zt(a)-1)).toString(32)+l,e="_"+e+"R_"+l,l=Gu++,0<l&&(e+="H"+l.toString(32)),e+="_"}else l=Lv++,e="_"+e+"r_"+l.toString(32)+"_";return t.memoizedState=e},useHostTransitionStatus:jc,useFormState:td,useActionState:td,useOptimistic:function(t){var e=_t();e.memoizedState=e.baseState=t;var l={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return e.queue=l,e=Vc.bind(null,O,!0,l),l.dispatch=e,[t,e]},useMemoCache:Yc,useCacheRefresh:function(){return _t().memoizedState=Kv.bind(null,O)},useEffectEvent:function(t){var e=_t(),l={impl:t};return e.memoizedState=l,function(){if((L&2)!==0)throw Error(g(440));return l.impl.apply(void 0,arguments)}}},Qc={readContext:xt,use:ku,useCallback:ch,useContext:xt,useEffect:qc,useImperativeHandle:rh,useInsertionEffect:nh,useLayoutEffect:uh,useMemo:oh,useReducer:au,useRef:ah,useState:function(){return au(Qe)},useDebugValue:Lc,useDeferredValue:function(t,e){var l=ut();return fh(l,K.memoizedState,t,e)},useTransition:function(){var t=au(Qe)[0],e=ut().memoizedState;return[typeof t=="boolean"?t:on(t),e]},useSyncExternalStore:Km,useId:ph,useHostTransitionStatus:jc,useFormState:ed,useActionState:ed,useOptimistic:function(t,e){var l=ut();return $m(l,K,t,e)},useMemoCache:Yc,useCacheRefresh:yh};Qc.useEffectEvent=ih;var Sh={readContext:xt,use:ku,useCallback:ch,useContext:xt,useEffect:qc,useImperativeHandle:rh,useInsertionEffect:nh,useLayoutEffect:uh,useMemo:oh,useReducer:Ps,useRef:ah,useState:function(){return Ps(Qe)},useDebugValue:Lc,useDeferredValue:function(t,e){var l=ut();return K===null?Xc(l,t,e):fh(l,K.memoizedState,t,e)},useTransition:function(){var t=Ps(Qe)[0],e=ut().memoizedState;return[typeof t=="boolean"?t:on(t),e]},useSyncExternalStore:Km,useId:ph,useHostTransitionStatus:jc,useFormState:ld,useActionState:ld,useOptimistic:function(t,e){var l=ut();return K!==null?$m(l,K,t,e):(l.baseState=t,[t,l.queue.dispatch])},useMemoCache:Yc,useCacheRefresh:yh};Sh.useEffectEvent=ih;function $s(t,e,l,a){e=t.memoizedState,l=l(a,e),l=l==null?e:$({},e,l),t.memoizedState=l,t.lanes===0&&(t.updateQueue.baseState=l)}var Qr={enqueueSetState:function(t,e,l){t=t._reactInternals;var a=Kt(),i=vl(a);i.payload=e,l!=null&&(i.callback=l),e=gl(t,i,a),e!==null&&(Ut(e,t,a),Ni(e,t,a))},enqueueReplaceState:function(t,e,l){t=t._reactInternals;var a=Kt(),i=vl(a);i.tag=1,i.payload=e,l!=null&&(i.callback=l),e=gl(t,i,a),e!==null&&(Ut(e,t,a),Ni(e,t,a))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var l=Kt(),a=vl(l);a.tag=2,e!=null&&(a.callback=e),e=gl(t,a,l),e!==null&&(Ut(e,t,l),Ni(e,t,l))}};function id(t,e,l,a,i,n,u){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(a,n,u):e.prototype&&e.prototype.isPureReactComponent?!Zi(l,a)||!Zi(i,n):!0}function nd(t,e,l,a){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(l,a),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(l,a),e.state!==t&&Qr.enqueueReplaceState(e,e.state,null)}function $l(t,e){var l=e;if("ref"in e){l={};for(var a in e)a!=="ref"&&(l[a]=e[a])}if(t=t.defaultProps){l===e&&(l=$({},l));for(var i in t)l[i]===void 0&&(l[i]=t[i])}return l}function Eh(t){vu(t)}function xh(t){console.error(t)}function Th(t){vu(t)}function Cu(t,e){try{var l=t.onUncaughtError;l(e.value,{componentStack:e.stack})}catch(a){setTimeout(function(){throw a})}}function ud(t,e,l){try{var a=t.onCaughtError;a(l.value,{componentStack:l.stack,errorBoundary:e.tag===1?e.stateNode:null})}catch(i){setTimeout(function(){throw i})}}function Zr(t,e,l){return l=vl(l),l.tag=3,l.payload={element:null},l.callback=function(){Cu(t,e)},l}function Gh(t){return t=vl(t),t.tag=3,t}function Ch(t,e,l,a){var i=l.type.getDerivedStateFromError;if(typeof i=="function"){var n=a.value;t.payload=function(){return i(n)},t.callback=function(){ud(e,l,a)}}var u=l.stateNode;u!==null&&typeof u.componentDidCatch=="function"&&(t.callback=function(){ud(e,l,a),typeof i!="function"&&(bl===null?bl=new Set([this]):bl.add(this));var s=a.stack;this.componentDidCatch(a.value,{componentStack:s!==null?s:""})})}function Fv(t,e,l,a,i){if(l.flags|=32768,a!==null&&typeof a=="object"&&typeof a.then=="function"){if(e=l.alternate,e!==null&&Ia(e,l,i,!0),l=Ft.current,l!==null){switch(l.tag){case 31:case 13:return ne===null?Du():l.alternate===null&&at===0&&(at=3),l.flags&=-257,l.flags|=65536,l.lanes=i,a===Su?l.flags|=16384:(e=l.updateQueue,e===null?l.updateQueue=new Set([a]):e.add(a),cr(t,a,i)),!1;case 22:return l.flags|=65536,a===Su?l.flags|=16384:(e=l.updateQueue,e===null?(e={transitions:null,markerInstances:null,retryQueue:new Set([a])},l.updateQueue=e):(l=e.retryQueue,l===null?e.retryQueue=new Set([a]):l.add(a)),cr(t,a,i)),!1}throw Error(g(435,l.tag))}return cr(t,a,i),Du(),!1}if(q)return e=Ft.current,e!==null?((e.flags&65536)===0&&(e.flags|=256),e.flags|=65536,e.lanes=i,a!==Or&&(t=Error(g(422),{cause:a}),Ji(ae(t,l)))):(a!==Or&&(e=Error(g(423),{cause:a}),Ji(ae(e,l))),t=t.current.alternate,t.flags|=65536,i&=-i,t.lanes|=i,a=ae(a,l),i=Zr(t.stateNode,a,i),Ws(t,i),at!==4&&(at=2)),!1;var n=Error(g(520),{cause:a});if(n=ae(n,l),qi===null?qi=[n]:qi.push(n),at!==4&&(at=2),e===null)return!0;a=ae(a,l),l=e;do{switch(l.tag){case 3:return l.flags|=65536,t=i&-i,l.lanes|=t,t=Zr(l.stateNode,a,t),Ws(l,t),!1;case 1:if(e=l.type,n=l.stateNode,(l.flags&128)===0&&(typeof e.getDerivedStateFromError=="function"||n!==null&&typeof n.componentDidCatch=="function"&&(bl===null||!bl.has(n))))return l.flags|=65536,i&=-i,l.lanes|=i,i=Gh(i),Ch(i,t,l,a),Ws(l,i),!1}l=l.return}while(l!==null);return!1}var Zc=Error(g(461)),ot=!1;function Mt(t,e,l,a){e.child=t===null?Lm(e,null,l,a):Wl(e,t.child,l,a)}function sd(t,e,l,a,i){l=l.render;var n=e.ref;if("ref"in a){var u={};for(var s in a)s!=="ref"&&(u[s]=a[s])}else u=a;return kl(e),a=Nc(t,e,l,u,n,i),s=Hc(),t!==null&&!ot?(Uc(t,e,i),Ze(t,e,i)):(q&&s&&Gc(e),e.flags|=1,Mt(t,e,a,i),e.child)}function rd(t,e,l,a,i){if(t===null){var n=l.type;return typeof n=="function"&&!Tc(n)&&n.defaultProps===void 0&&l.compare===null?(e.tag=15,e.type=n,Ah(t,e,n,a,i)):(t=eu(l.type,null,a,e,e.mode,i),t.ref=e.ref,t.return=e,e.child=t)}if(n=t.child,!Kc(t,i)){var u=n.memoizedProps;if(l=l.compare,l=l!==null?l:Zi,l(u,a)&&t.ref===e.ref)return Ze(t,e,i)}return e.flags|=1,t=qe(n,a),t.ref=e.ref,t.return=e,e.child=t}function Ah(t,e,l,a,i){if(t!==null){var n=t.memoizedProps;if(Zi(n,a)&&t.ref===e.ref)if(ot=!1,e.pendingProps=a=n,Kc(t,i))(t.flags&131072)!==0&&(ot=!0);else return e.lanes=t.lanes,Ze(t,e,i)}return Kr(t,e,l,a,i)}function zh(t,e,l,a){var i=a.children,n=t!==null?t.memoizedState:null;if(t===null&&e.stateNode===null&&(e.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),a.mode==="hidden"){if((e.flags&128)!==0){if(n=n!==null?n.baseLanes|l:l,t!==null){for(a=e.child=t.child,i=0;a!==null;)i=i|a.lanes|a.childLanes,a=a.sibling;a=i&~n}else a=0,e.child=null;return cd(t,e,n,l,a)}if((l&536870912)!==0)e.memoizedState={baseLanes:0,cachePool:null},t!==null&&lu(e,n!==null?n.cachePool:null),n!==null?Pf(e,n):qr(),Vm(e);else return a=e.lanes=536870912,cd(t,e,n!==null?n.baseLanes|l:l,l,a)}else n!==null?(lu(e,n.cachePool),Pf(e,n),rl(e),e.memoizedState=null):(t!==null&&lu(e,null),qr(),rl(e));return Mt(t,e,i,l),e.child}function Ai(t,e){return t!==null&&t.tag===22||e.stateNode!==null||(e.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),e.sibling}function cd(t,e,l,a,i){var n=zc();return n=n===null?null:{parent:ct._currentValue,pool:n},e.memoizedState={baseLanes:l,cachePool:n},t!==null&&lu(e,null),qr(),Vm(e),t!==null&&Ia(t,e,a,!0),e.childLanes=i,null}function nu(t,e){return e=Au({mode:e.mode,children:e.children},t.mode),e.ref=t.ref,t.child=e,e.return=t,e}function od(t,e,l){return Wl(e,t.child,null,l),t=nu(e,e.pendingProps),t.flags|=2,Lt(e),e.memoizedState=null,t}function kv(t,e,l){var a=e.pendingProps,i=(e.flags&128)!==0;if(e.flags&=-129,t===null){if(q){if(a.mode==="hidden")return t=nu(e,a),e.lanes=536870912,Ai(null,t);if(Lr(e),(t=P)?(t=Mp(t,ie),t=t!==null&&t.data==="&"?t:null,t!==null&&(e.memoizedState={dehydrated:t,treeContext:Tl!==null?{id:pe,overflow:ye}:null,retryLane:536870912,hydrationErrors:null},l=Nm(t),l.return=e,e.child=l,Et=e,P=null)):t=null,t===null)throw Gl(e);return e.lanes=536870912,null}return nu(e,a)}var n=t.memoizedState;if(n!==null){var u=n.dehydrated;if(Lr(e),i)if(e.flags&256)e.flags&=-257,e=od(t,e,l);else if(e.memoizedState!==null)e.child=t.child,e.flags|=128,e=null;else throw Error(g(558));else if(ot||Ia(t,e,l,!1),i=(l&t.childLanes)!==0,ot||i){if(a=J,a!==null&&(u=nm(a,l),u!==0&&u!==n.retryLane))throw n.retryLane=u,la(t,u),Ut(a,t,u),Zc;Du(),e=od(t,e,l)}else t=n.treeContext,P=ue(u.nextSibling),Et=e,q=!0,yl=null,ie=!1,t!==null&&Um(e,t),e=nu(e,a),e.flags|=4096;return e}return t=qe(t.child,{mode:a.mode,children:a.children}),t.ref=e.ref,e.child=t,t.return=e,t}function uu(t,e){var l=e.ref;if(l===null)t!==null&&t.ref!==null&&(e.flags|=4194816);else{if(typeof l!="function"&&typeof l!="object")throw Error(g(284));(t===null||t.ref!==l)&&(e.flags|=4194816)}}function Kr(t,e,l,a,i){return kl(e),l=Nc(t,e,l,a,void 0,i),a=Hc(),t!==null&&!ot?(Uc(t,e,i),Ze(t,e,i)):(q&&a&&Gc(e),e.flags|=1,Mt(t,e,l,i),e.child)}function fd(t,e,l,a,i,n){return kl(e),e.updateQueue=null,l=Zm(e,a,l,i),Qm(t),a=Hc(),t!==null&&!ot?(Uc(t,e,n),Ze(t,e,n)):(q&&a&&Gc(e),e.flags|=1,Mt(t,e,l,n),e.child)}function dd(t,e,l,a,i){if(kl(e),e.stateNode===null){var n=_a,u=l.contextType;typeof u=="object"&&u!==null&&(n=xt(u)),n=new l(a,n),e.memoizedState=n.state!==null&&n.state!==void 0?n.state:null,n.updater=Qr,e.stateNode=n,n._reactInternals=e,n=e.stateNode,n.props=a,n.state=e.memoizedState,n.refs={},Rc(e),u=l.contextType,n.context=typeof u=="object"&&u!==null?xt(u):_a,n.state=e.memoizedState,u=l.getDerivedStateFromProps,typeof u=="function"&&($s(e,l,u,a),n.state=e.memoizedState),typeof l.getDerivedStateFromProps=="function"||typeof n.getSnapshotBeforeUpdate=="function"||typeof n.UNSAFE_componentWillMount!="function"&&typeof n.componentWillMount!="function"||(u=n.state,typeof n.componentWillMount=="function"&&n.componentWillMount(),typeof n.UNSAFE_componentWillMount=="function"&&n.UNSAFE_componentWillMount(),u!==n.state&&Qr.enqueueReplaceState(n,n.state,null),Ui(e,a,n,i),Hi(),n.state=e.memoizedState),typeof n.componentDidMount=="function"&&(e.flags|=4194308),a=!0}else if(t===null){n=e.stateNode;var s=e.memoizedProps,r=$l(l,s);n.props=r;var o=n.context,h=l.contextType;u=_a,typeof h=="object"&&h!==null&&(u=xt(h));var y=l.getDerivedStateFromProps;h=typeof y=="function"||typeof n.getSnapshotBeforeUpdate=="function",s=e.pendingProps!==s,h||typeof n.UNSAFE_componentWillReceiveProps!="function"&&typeof n.componentWillReceiveProps!="function"||(s||o!==u)&&nd(e,n,a,u),nl=!1;var d=e.memoizedState;n.state=d,Ui(e,a,n,i),Hi(),o=e.memoizedState,s||d!==o||nl?(typeof y=="function"&&($s(e,l,y,a),o=e.memoizedState),(r=nl||id(e,l,r,a,d,o,u))?(h||typeof n.UNSAFE_componentWillMount!="function"&&typeof n.componentWillMount!="function"||(typeof n.componentWillMount=="function"&&n.componentWillMount(),typeof n.UNSAFE_componentWillMount=="function"&&n.UNSAFE_componentWillMount()),typeof n.componentDidMount=="function"&&(e.flags|=4194308)):(typeof n.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=a,e.memoizedState=o),n.props=a,n.state=o,n.context=u,a=r):(typeof n.componentDidMount=="function"&&(e.flags|=4194308),a=!1)}else{n=e.stateNode,Yr(t,e),u=e.memoizedProps,h=$l(l,u),n.props=h,y=e.pendingProps,d=n.context,o=l.contextType,r=_a,typeof o=="object"&&o!==null&&(r=xt(o)),s=l.getDerivedStateFromProps,(o=typeof s=="function"||typeof n.getSnapshotBeforeUpdate=="function")||typeof n.UNSAFE_componentWillReceiveProps!="function"&&typeof n.componentWillReceiveProps!="function"||(u!==y||d!==r)&&nd(e,n,a,r),nl=!1,d=e.memoizedState,n.state=d,Ui(e,a,n,i),Hi();var p=e.memoizedState;u!==y||d!==p||nl||t!==null&&t.dependencies!==null&&Mu(t.dependencies)?(typeof s=="function"&&($s(e,l,s,a),p=e.memoizedState),(h=nl||id(e,l,h,a,d,p,r)||t!==null&&t.dependencies!==null&&Mu(t.dependencies))?(o||typeof n.UNSAFE_componentWillUpdate!="function"&&typeof n.componentWillUpdate!="function"||(typeof n.componentWillUpdate=="function"&&n.componentWillUpdate(a,p,r),typeof n.UNSAFE_componentWillUpdate=="function"&&n.UNSAFE_componentWillUpdate(a,p,r)),typeof n.componentDidUpdate=="function"&&(e.flags|=4),typeof n.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof n.componentDidUpdate!="function"||u===t.memoizedProps&&d===t.memoizedState||(e.flags|=4),typeof n.getSnapshotBeforeUpdate!="function"||u===t.memoizedProps&&d===t.memoizedState||(e.flags|=1024),e.memoizedProps=a,e.memoizedState=p),n.props=a,n.state=p,n.context=r,a=h):(typeof n.componentDidUpdate!="function"||u===t.memoizedProps&&d===t.memoizedState||(e.flags|=4),typeof n.getSnapshotBeforeUpdate!="function"||u===t.memoizedProps&&d===t.memoizedState||(e.flags|=1024),a=!1)}return n=a,uu(t,e),a=(e.flags&128)!==0,n||a?(n=e.stateNode,l=a&&typeof l.getDerivedStateFromError!="function"?null:n.render(),e.flags|=1,t!==null&&a?(e.child=Wl(e,t.child,null,i),e.child=Wl(e,null,l,i)):Mt(t,e,l,i),e.memoizedState=n.state,t=e.child):t=Ze(t,e,i),t}function md(t,e,l,a){return Fl(),e.flags|=256,Mt(t,e,l,a),e.child}var Is={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function tr(t){return{baseLanes:t,cachePool:Ym()}}function er(t,e,l){return t=t!==null?t.childLanes&~l:0,e&&(t|=jt),t}function _h(t,e,l){var a=e.pendingProps,i=!1,n=(e.flags&128)!==0,u;if((u=n)||(u=t!==null&&t.memoizedState===null?!1:(nt.current&2)!==0),u&&(i=!0,e.flags&=-129),u=(e.flags&32)!==0,e.flags&=-33,t===null){if(q){if(i?sl(e):rl(e),(t=P)?(t=Mp(t,ie),t=t!==null&&t.data!=="&"?t:null,t!==null&&(e.memoizedState={dehydrated:t,treeContext:Tl!==null?{id:pe,overflow:ye}:null,retryLane:536870912,hydrationErrors:null},l=Nm(t),l.return=e,e.child=l,Et=e,P=null)):t=null,t===null)throw Gl(e);return uc(t)?e.lanes=32:e.lanes=536870912,null}var s=a.children;return a=a.fallback,i?(rl(e),i=e.mode,s=Au({mode:"hidden",children:s},i),a=Ql(a,i,l,null),s.return=e,a.return=e,s.sibling=a,e.child=s,a=e.child,a.memoizedState=tr(l),a.childLanes=er(t,u,l),e.memoizedState=Is,Ai(null,a)):(sl(e),Jr(e,s))}var r=t.memoizedState;if(r!==null&&(s=r.dehydrated,s!==null)){if(n)e.flags&256?(sl(e),e.flags&=-257,e=lr(t,e,l)):e.memoizedState!==null?(rl(e),e.child=t.child,e.flags|=128,e=null):(rl(e),s=a.fallback,i=e.mode,a=Au({mode:"visible",children:a.children},i),s=Ql(s,i,l,null),s.flags|=2,a.return=e,s.return=e,a.sibling=s,e.child=a,Wl(e,t.child,null,l),a=e.child,a.memoizedState=tr(l),a.childLanes=er(t,u,l),e.memoizedState=Is,e=Ai(null,a));else if(sl(e),uc(s)){if(u=s.nextSibling&&s.nextSibling.dataset,u)var o=u.dgst;u=o,a=Error(g(419)),a.stack="",a.digest=u,Ji({value:a,source:null,stack:null}),e=lr(t,e,l)}else if(ot||Ia(t,e,l,!1),u=(l&t.childLanes)!==0,ot||u){if(u=J,u!==null&&(a=nm(u,l),a!==0&&a!==r.retryLane))throw r.retryLane=a,la(t,a),Ut(u,t,a),Zc;nc(s)||Du(),e=lr(t,e,l)}else nc(s)?(e.flags|=192,e.child=t.child,e=null):(t=r.treeContext,P=ue(s.nextSibling),Et=e,q=!0,yl=null,ie=!1,t!==null&&Um(e,t),e=Jr(e,a.children),e.flags|=4096);return e}return i?(rl(e),s=a.fallback,i=e.mode,r=t.child,o=r.sibling,a=qe(r,{mode:"hidden",children:a.children}),a.subtreeFlags=r.subtreeFlags&65011712,o!==null?s=qe(o,s):(s=Ql(s,i,l,null),s.flags|=2),s.return=e,a.return=e,a.sibling=s,e.child=a,Ai(null,a),a=e.child,s=t.child.memoizedState,s===null?s=tr(l):(i=s.cachePool,i!==null?(r=ct._currentValue,i=i.parent!==r?{parent:r,pool:r}:i):i=Ym(),s={baseLanes:s.baseLanes|l,cachePool:i}),a.memoizedState=s,a.childLanes=er(t,u,l),e.memoizedState=Is,Ai(t.child,a)):(sl(e),l=t.child,t=l.sibling,l=qe(l,{mode:"visible",children:a.children}),l.return=e,l.sibling=null,t!==null&&(u=e.deletions,u===null?(e.deletions=[t],e.flags|=16):u.push(t)),e.child=l,e.memoizedState=null,l)}function Jr(t,e){return e=Au({mode:"visible",children:e},t.mode),e.return=t,t.child=e}function Au(t,e){return t=Xt(22,t,null,e),t.lanes=0,t}function lr(t,e,l){return Wl(e,t.child,null,l),t=Jr(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function hd(t,e,l){t.lanes|=e;var a=t.alternate;a!==null&&(a.lanes|=e),Hr(t.return,e,l)}function ar(t,e,l,a,i,n){var u=t.memoizedState;u===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:a,tail:l,tailMode:i,treeForkCount:n}:(u.isBackwards=e,u.rendering=null,u.renderingStartTime=0,u.last=a,u.tail=l,u.tailMode=i,u.treeForkCount=n)}function Rh(t,e,l){var a=e.pendingProps,i=a.revealOrder,n=a.tail;a=a.children;var u=nt.current,s=(u&2)!==0;if(s?(u=u&1|2,e.flags|=128):u&=1,F(nt,u),Mt(t,e,a,l),a=q?Ki:0,!s&&t!==null&&(t.flags&128)!==0)t:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&hd(t,l,e);else if(t.tag===19)hd(t,l,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break t;for(;t.sibling===null;){if(t.return===null||t.return===e)break t;t=t.return}t.sibling.return=t.return,t=t.sibling}switch(i){case"forwards":for(l=e.child,i=null;l!==null;)t=l.alternate,t!==null&&xu(t)===null&&(i=l),l=l.sibling;l=i,l===null?(i=e.child,e.child=null):(i=l.sibling,l.sibling=null),ar(e,!1,i,l,n,a);break;case"backwards":case"unstable_legacy-backwards":for(l=null,i=e.child,e.child=null;i!==null;){if(t=i.alternate,t!==null&&xu(t)===null){e.child=i;break}t=i.sibling,i.sibling=l,l=i,i=t}ar(e,!0,l,null,n,a);break;case"together":ar(e,!1,null,null,void 0,a);break;default:e.memoizedState=null}return e.child}function Ze(t,e,l){if(t!==null&&(e.dependencies=t.dependencies),Al|=e.lanes,(l&e.childLanes)===0)if(t!==null){if(Ia(t,e,l,!1),(l&e.childLanes)===0)return null}else return null;if(t!==null&&e.child!==t.child)throw Error(g(153));if(e.child!==null){for(t=e.child,l=qe(t,t.pendingProps),e.child=l,l.return=e;t.sibling!==null;)t=t.sibling,l=l.sibling=qe(t,t.pendingProps),l.return=e;l.sibling=null}return e.child}function Kc(t,e){return(t.lanes&e)!==0?!0:(t=t.dependencies,!!(t!==null&&Mu(t)))}function Wv(t,e,l){switch(e.tag){case 3:mu(e,e.stateNode.containerInfo),ul(e,ct,t.memoizedState.cache),Fl();break;case 27:case 5:Sr(e);break;case 4:mu(e,e.stateNode.containerInfo);break;case 10:ul(e,e.type,e.memoizedProps.value);break;case 31:if(e.memoizedState!==null)return e.flags|=128,Lr(e),null;break;case 13:var a=e.memoizedState;if(a!==null)return a.dehydrated!==null?(sl(e),e.flags|=128,null):(l&e.child.childLanes)!==0?_h(t,e,l):(sl(e),t=Ze(t,e,l),t!==null?t.sibling:null);sl(e);break;case 19:var i=(t.flags&128)!==0;if(a=(l&e.childLanes)!==0,a||(Ia(t,e,l,!1),a=(l&e.childLanes)!==0),i){if(a)return Rh(t,e,l);e.flags|=128}if(i=e.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),F(nt,nt.current),a)break;return null;case 22:return e.lanes=0,zh(t,e,l,e.pendingProps);case 24:ul(e,ct,t.memoizedState.cache)}return Ze(t,e,l)}function Dh(t,e,l){if(t!==null)if(t.memoizedProps!==e.pendingProps)ot=!0;else{if(!Kc(t,l)&&(e.flags&128)===0)return ot=!1,Wv(t,e,l);ot=(t.flags&131072)!==0}else ot=!1,q&&(e.flags&1048576)!==0&&Hm(e,Ki,e.index);switch(e.lanes=0,e.tag){case 16:t:{var a=e.pendingProps;if(t=Xl(e.elementType),e.type=t,typeof t=="function")Tc(t)?(a=$l(t,a),e.tag=1,e=dd(null,e,t,a,l)):(e.tag=0,e=Kr(null,e,t,a,l));else{if(t!=null){var i=t.$$typeof;if(i===oc){e.tag=11,e=sd(null,e,t,a,l);break t}else if(i===fc){e.tag=14,e=rd(null,e,t,a,l);break t}}throw e=br(t)||t,Error(g(306,e,""))}}return e;case 0:return Kr(t,e,e.type,e.pendingProps,l);case 1:return a=e.type,i=$l(a,e.pendingProps),dd(t,e,a,i,l);case 3:t:{if(mu(e,e.stateNode.containerInfo),t===null)throw Error(g(387));a=e.pendingProps;var n=e.memoizedState;i=n.element,Yr(t,e),Ui(e,a,null,l);var u=e.memoizedState;if(a=u.cache,ul(e,ct,a),a!==n.cache&&Ur(e,[ct],l,!0),Hi(),a=u.element,n.isDehydrated)if(n={element:a,isDehydrated:!1,cache:u.cache},e.updateQueue.baseState=n,e.memoizedState=n,e.flags&256){e=md(t,e,a,l);break t}else if(a!==i){i=ae(Error(g(424)),e),Ji(i),e=md(t,e,a,l);break t}else for(t=e.stateNode.containerInfo,t.nodeType===9?t=t.body:t=t.nodeName==="HTML"?t.ownerDocument.body:t,P=ue(t.firstChild),Et=e,q=!0,yl=null,ie=!0,l=Lm(e,null,a,l),e.child=l;l;)l.flags=l.flags&-3|4096,l=l.sibling;else{if(Fl(),a===i){e=Ze(t,e,l);break t}Mt(t,e,a,l)}e=e.child}return e;case 26:return uu(t,e),t===null?(l=Bd(e.type,null,e.pendingProps,null))?e.memoizedState=l:q||(l=e.type,t=e.pendingProps,a=Uu(pl.current).createElement(l),a[St]=e,a[Bt]=t,Tt(a,l,t),gt(a),e.stateNode=a):e.memoizedState=Bd(e.type,t.memoizedProps,e.pendingProps,t.memoizedState),null;case 27:return Sr(e),t===null&&q&&(a=e.stateNode=Sp(e.type,e.pendingProps,pl.current),Et=e,ie=!0,i=P,_l(e.type)?(sc=i,P=ue(a.firstChild)):P=i),Mt(t,e,e.pendingProps.children,l),uu(t,e),t===null&&(e.flags|=4194304),e.child;case 5:return t===null&&q&&((i=a=P)&&(a=T1(a,e.type,e.pendingProps,ie),a!==null?(e.stateNode=a,Et=e,P=ue(a.firstChild),ie=!1,i=!0):i=!1),i||Gl(e)),Sr(e),i=e.type,n=e.pendingProps,u=t!==null?t.memoizedProps:null,a=n.children,ac(i,n)?a=null:u!==null&&ac(i,u)&&(e.flags|=32),e.memoizedState!==null&&(i=Nc(t,e,Xv,null,null,l),Ii._currentValue=i),uu(t,e),Mt(t,e,a,l),e.child;case 6:return t===null&&q&&((t=l=P)&&(l=G1(l,e.pendingProps,ie),l!==null?(e.stateNode=l,Et=e,P=null,t=!0):t=!1),t||Gl(e)),null;case 13:return _h(t,e,l);case 4:return mu(e,e.stateNode.containerInfo),a=e.pendingProps,t===null?e.child=Wl(e,null,a,l):Mt(t,e,a,l),e.child;case 11:return sd(t,e,e.type,e.pendingProps,l);case 7:return Mt(t,e,e.pendingProps,l),e.child;case 8:return Mt(t,e,e.pendingProps.children,l),e.child;case 12:return Mt(t,e,e.pendingProps.children,l),e.child;case 10:return a=e.pendingProps,ul(e,e.type,a.value),Mt(t,e,a.children,l),e.child;case 9:return i=e.type._context,a=e.pendingProps.children,kl(e),i=xt(i),a=a(i),e.flags|=1,Mt(t,e,a,l),e.child;case 14:return rd(t,e,e.type,e.pendingProps,l);case 15:return Ah(t,e,e.type,e.pendingProps,l);case 19:return Rh(t,e,l);case 31:return kv(t,e,l);case 22:return zh(t,e,l,e.pendingProps);case 24:return kl(e),a=xt(ct),t===null?(i=zc(),i===null&&(i=J,n=Ac(),i.pooledCache=n,n.refCount++,n!==null&&(i.pooledCacheLanes|=l),i=n),e.memoizedState={parent:a,cache:i},Rc(e),ul(e,ct,i)):((t.lanes&l)!==0&&(Yr(t,e),Ui(e,null,null,l),Hi()),i=t.memoizedState,n=e.memoizedState,i.parent!==a?(i={parent:a,cache:a},e.memoizedState=i,e.lanes===0&&(e.memoizedState=e.updateQueue.baseState=i),ul(e,ct,a)):(a=n.cache,ul(e,ct,a),a!==i.cache&&Ur(e,[ct],l,!0))),Mt(t,e,e.pendingProps.children,l),e.child;case 29:throw e.pendingProps}throw Error(g(156,e.tag))}function Re(t){t.flags|=4}function ir(t,e,l,a,i){if((e=(t.mode&32)!==0)&&(e=!1),e){if(t.flags|=16777216,(i&335544128)===i)if(t.stateNode.complete)t.flags|=8192;else if(ep())t.flags|=8192;else throw Kl=Su,_c}else t.flags&=-16777217}function pd(t,e){if(e.type!=="stylesheet"||(e.state.loading&4)!==0)t.flags&=-16777217;else if(t.flags|=16777216,!Tp(e))if(ep())t.flags|=8192;else throw Kl=Su,_c}function Qn(t,e){e!==null&&(t.flags|=4),t.flags&16384&&(e=t.tag!==22?lm():536870912,t.lanes|=e,Ka|=e)}function Mi(t,e){if(!q)switch(t.tailMode){case"hidden":e=t.tail;for(var l=null;e!==null;)e.alternate!==null&&(l=e),e=e.sibling;l===null?t.tail=null:l.sibling=null;break;case"collapsed":l=t.tail;for(var a=null;l!==null;)l.alternate!==null&&(a=l),l=l.sibling;a===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:a.sibling=null}}function W(t){var e=t.alternate!==null&&t.alternate.child===t.child,l=0,a=0;if(e)for(var i=t.child;i!==null;)l|=i.lanes|i.childLanes,a|=i.subtreeFlags&65011712,a|=i.flags&65011712,i.return=t,i=i.sibling;else for(i=t.child;i!==null;)l|=i.lanes|i.childLanes,a|=i.subtreeFlags,a|=i.flags,i.return=t,i=i.sibling;return t.subtreeFlags|=a,t.childLanes=l,e}function Pv(t,e,l){var a=e.pendingProps;switch(Cc(e),e.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return W(e),null;case 1:return W(e),null;case 3:return l=e.stateNode,a=null,t!==null&&(a=t.memoizedState.cache),e.memoizedState.cache!==a&&(e.flags|=2048),Le(ct),La(),l.pendingContext&&(l.context=l.pendingContext,l.pendingContext=null),(t===null||t.child===null)&&(va(e)?Re(e):t===null||t.memoizedState.isDehydrated&&(e.flags&256)===0||(e.flags|=1024,ks())),W(e),null;case 26:var i=e.type,n=e.memoizedState;return t===null?(Re(e),n!==null?(W(e),pd(e,n)):(W(e),ir(e,i,null,a,l))):n?n!==t.memoizedState?(Re(e),W(e),pd(e,n)):(W(e),e.flags&=-16777217):(t=t.memoizedProps,t!==a&&Re(e),W(e),ir(e,i,t,a,l)),null;case 27:if(hu(e),l=pl.current,i=e.type,t!==null&&e.stateNode!=null)t.memoizedProps!==a&&Re(e);else{if(!a){if(e.stateNode===null)throw Error(g(166));return W(e),null}t=ge.current,va(e)?Qf(e,t):(t=Sp(i,a,l),e.stateNode=t,Re(e))}return W(e),null;case 5:if(hu(e),i=e.type,t!==null&&e.stateNode!=null)t.memoizedProps!==a&&Re(e);else{if(!a){if(e.stateNode===null)throw Error(g(166));return W(e),null}if(n=ge.current,va(e))Qf(e,n);else{var u=Uu(pl.current);switch(n){case 1:n=u.createElementNS("http://www.w3.org/2000/svg",i);break;case 2:n=u.createElementNS("http://www.w3.org/1998/Math/MathML",i);break;default:switch(i){case"svg":n=u.createElementNS("http://www.w3.org/2000/svg",i);break;case"math":n=u.createElementNS("http://www.w3.org/1998/Math/MathML",i);break;case"script":n=u.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild);break;case"select":n=typeof a.is=="string"?u.createElement("select",{is:a.is}):u.createElement("select"),a.multiple?n.multiple=!0:a.size&&(n.size=a.size);break;default:n=typeof a.is=="string"?u.createElement(i,{is:a.is}):u.createElement(i)}}n[St]=e,n[Bt]=a;t:for(u=e.child;u!==null;){if(u.tag===5||u.tag===6)n.appendChild(u.stateNode);else if(u.tag!==4&&u.tag!==27&&u.child!==null){u.child.return=u,u=u.child;continue}if(u===e)break t;for(;u.sibling===null;){if(u.return===null||u.return===e)break t;u=u.return}u.sibling.return=u.return,u=u.sibling}e.stateNode=n;t:switch(Tt(n,i,a),i){case"button":case"input":case"select":case"textarea":a=!!a.autoFocus;break t;case"img":a=!0;break t;default:a=!1}a&&Re(e)}}return W(e),ir(e,e.type,t===null?null:t.memoizedProps,e.pendingProps,l),null;case 6:if(t&&e.stateNode!=null)t.memoizedProps!==a&&Re(e);else{if(typeof a!="string"&&e.stateNode===null)throw Error(g(166));if(t=pl.current,va(e)){if(t=e.stateNode,l=e.memoizedProps,a=null,i=Et,i!==null)switch(i.tag){case 27:case 5:a=i.memoizedProps}t[St]=e,t=!!(t.nodeValue===l||a!==null&&a.suppressHydrationWarning===!0||vp(t.nodeValue,l)),t||Gl(e,!0)}else t=Uu(t).createTextNode(a),t[St]=e,e.stateNode=t}return W(e),null;case 31:if(l=e.memoizedState,t===null||t.memoizedState!==null){if(a=va(e),l!==null){if(t===null){if(!a)throw Error(g(318));if(t=e.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(g(557));t[St]=e}else Fl(),(e.flags&128)===0&&(e.memoizedState=null),e.flags|=4;W(e),t=!1}else l=ks(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=l),t=!0;if(!t)return e.flags&256?(Lt(e),e):(Lt(e),null);if((e.flags&128)!==0)throw Error(g(558))}return W(e),null;case 13:if(a=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(i=va(e),a!==null&&a.dehydrated!==null){if(t===null){if(!i)throw Error(g(318));if(i=e.memoizedState,i=i!==null?i.dehydrated:null,!i)throw Error(g(317));i[St]=e}else Fl(),(e.flags&128)===0&&(e.memoizedState=null),e.flags|=4;W(e),i=!1}else i=ks(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=i),i=!0;if(!i)return e.flags&256?(Lt(e),e):(Lt(e),null)}return Lt(e),(e.flags&128)!==0?(e.lanes=l,e):(l=a!==null,t=t!==null&&t.memoizedState!==null,l&&(a=e.child,i=null,a.alternate!==null&&a.alternate.memoizedState!==null&&a.alternate.memoizedState.cachePool!==null&&(i=a.alternate.memoizedState.cachePool.pool),n=null,a.memoizedState!==null&&a.memoizedState.cachePool!==null&&(n=a.memoizedState.cachePool.pool),n!==i&&(a.flags|=2048)),l!==t&&l&&(e.child.flags|=8192),Qn(e,e.updateQueue),W(e),null);case 4:return La(),t===null&&Ic(e.stateNode.containerInfo),W(e),null;case 10:return Le(e.type),W(e),null;case 19:if(bt(nt),a=e.memoizedState,a===null)return W(e),null;if(i=(e.flags&128)!==0,n=a.rendering,n===null)if(i)Mi(a,!1);else{if(at!==0||t!==null&&(t.flags&128)!==0)for(t=e.child;t!==null;){if(n=xu(t),n!==null){for(e.flags|=128,Mi(a,!1),t=n.updateQueue,e.updateQueue=t,Qn(e,t),e.subtreeFlags=0,t=l,l=e.child;l!==null;)Om(l,t),l=l.sibling;return F(nt,nt.current&1|2),q&&He(e,a.treeForkCount),e.child}t=t.sibling}a.tail!==null&&Vt()>_u&&(e.flags|=128,i=!0,Mi(a,!1),e.lanes=4194304)}else{if(!i)if(t=xu(n),t!==null){if(e.flags|=128,i=!0,t=t.updateQueue,e.updateQueue=t,Qn(e,t),Mi(a,!0),a.tail===null&&a.tailMode==="hidden"&&!n.alternate&&!q)return W(e),null}else 2*Vt()-a.renderingStartTime>_u&&l!==536870912&&(e.flags|=128,i=!0,Mi(a,!1),e.lanes=4194304);a.isBackwards?(n.sibling=e.child,e.child=n):(t=a.last,t!==null?t.sibling=n:e.child=n,a.last=n)}return a.tail!==null?(t=a.tail,a.rendering=t,a.tail=t.sibling,a.renderingStartTime=Vt(),t.sibling=null,l=nt.current,F(nt,i?l&1|2:l&1),q&&He(e,a.treeForkCount),t):(W(e),null);case 22:case 23:return Lt(e),Dc(),a=e.memoizedState!==null,t!==null?t.memoizedState!==null!==a&&(e.flags|=8192):a&&(e.flags|=8192),a?(l&536870912)!==0&&(e.flags&128)===0&&(W(e),e.subtreeFlags&6&&(e.flags|=8192)):W(e),l=e.updateQueue,l!==null&&Qn(e,l.retryQueue),l=null,t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(l=t.memoizedState.cachePool.pool),a=null,e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),a!==l&&(e.flags|=2048),t!==null&&bt(Zl),null;case 24:return l=null,t!==null&&(l=t.memoizedState.cache),e.memoizedState.cache!==l&&(e.flags|=2048),Le(ct),W(e),null;case 25:return null;case 30:return null}throw Error(g(156,e.tag))}function $v(t,e){switch(Cc(e),e.tag){case 1:return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return Le(ct),La(),t=e.flags,(t&65536)!==0&&(t&128)===0?(e.flags=t&-65537|128,e):null;case 26:case 27:case 5:return hu(e),null;case 31:if(e.memoizedState!==null){if(Lt(e),e.alternate===null)throw Error(g(340));Fl()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 13:if(Lt(e),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(g(340));Fl()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return bt(nt),null;case 4:return La(),null;case 10:return Le(e.type),null;case 22:case 23:return Lt(e),Dc(),t!==null&&bt(Zl),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 24:return Le(ct),null;case 25:return null;default:return null}}function Oh(t,e){switch(Cc(e),e.tag){case 3:Le(ct),La();break;case 26:case 27:case 5:hu(e);break;case 4:La();break;case 31:e.memoizedState!==null&&Lt(e);break;case 13:Lt(e);break;case 19:bt(nt);break;case 10:Le(e.type);break;case 22:case 23:Lt(e),Dc(),t!==null&&bt(Zl);break;case 24:Le(ct)}}function fn(t,e){try{var l=e.updateQueue,a=l!==null?l.lastEffect:null;if(a!==null){var i=a.next;l=i;do{if((l.tag&t)===t){a=void 0;var n=l.create,u=l.inst;a=n(),u.destroy=a}l=l.next}while(l!==i)}}catch(s){V(e,e.return,s)}}function Cl(t,e,l){try{var a=e.updateQueue,i=a!==null?a.lastEffect:null;if(i!==null){var n=i.next;a=n;do{if((a.tag&t)===t){var u=a.inst,s=u.destroy;if(s!==void 0){u.destroy=void 0,i=e;var r=l,o=s;try{o()}catch(h){V(i,r,h)}}}a=a.next}while(a!==n)}}catch(h){V(e,e.return,h)}}function Nh(t){var e=t.updateQueue;if(e!==null){var l=t.stateNode;try{jm(e,l)}catch(a){V(t,t.return,a)}}}function Hh(t,e,l){l.props=$l(t.type,t.memoizedProps),l.state=t.memoizedState;try{l.componentWillUnmount()}catch(a){V(t,e,a)}}function Yi(t,e){try{var l=t.ref;if(l!==null){switch(t.tag){case 26:case 27:case 5:var a=t.stateNode;break;case 30:a=t.stateNode;break;default:a=t.stateNode}typeof l=="function"?t.refCleanup=l(a):l.current=a}}catch(i){V(t,e,i)}}function ve(t,e){var l=t.ref,a=t.refCleanup;if(l!==null)if(typeof a=="function")try{a()}catch(i){V(t,e,i)}finally{t.refCleanup=null,t=t.alternate,t!=null&&(t.refCleanup=null)}else if(typeof l=="function")try{l(null)}catch(i){V(t,e,i)}else l.current=null}function Uh(t){var e=t.type,l=t.memoizedProps,a=t.stateNode;try{t:switch(e){case"button":case"input":case"select":case"textarea":l.autoFocus&&a.focus();break t;case"img":l.src?a.src=l.src:l.srcSet&&(a.srcset=l.srcSet)}}catch(i){V(t,t.return,i)}}function nr(t,e,l){try{var a=t.stateNode;g1(a,t.type,l,e),a[Bt]=e}catch(i){V(t,t.return,i)}}function Bh(t){return t.tag===5||t.tag===3||t.tag===26||t.tag===27&&_l(t.type)||t.tag===4}function ur(t){t:for(;;){for(;t.sibling===null;){if(t.return===null||Bh(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.tag===27&&_l(t.type)||t.flags&2||t.child===null||t.tag===4)continue t;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function Fr(t,e,l){var a=t.tag;if(a===5||a===6)t=t.stateNode,e?(l.nodeType===9?l.body:l.nodeName==="HTML"?l.ownerDocument.body:l).insertBefore(t,e):(e=l.nodeType===9?l.body:l.nodeName==="HTML"?l.ownerDocument.body:l,e.appendChild(t),l=l._reactRootContainer,l!=null||e.onclick!==null||(e.onclick=Ye));else if(a!==4&&(a===27&&_l(t.type)&&(l=t.stateNode,e=null),t=t.child,t!==null))for(Fr(t,e,l),t=t.sibling;t!==null;)Fr(t,e,l),t=t.sibling}function zu(t,e,l){var a=t.tag;if(a===5||a===6)t=t.stateNode,e?l.insertBefore(t,e):l.appendChild(t);else if(a!==4&&(a===27&&_l(t.type)&&(l=t.stateNode),t=t.child,t!==null))for(zu(t,e,l),t=t.sibling;t!==null;)zu(t,e,l),t=t.sibling}function Yh(t){var e=t.stateNode,l=t.memoizedProps;try{for(var a=t.type,i=e.attributes;i.length;)e.removeAttributeNode(i[0]);Tt(e,a,l),e[St]=t,e[Bt]=l}catch(n){V(t,t.return,n)}}var Ue=!1,rt=!1,sr=!1,yd=typeof WeakSet=="function"?WeakSet:Set,vt=null;function Iv(t,e){if(t=t.containerInfo,ec=qu,t=Tm(t),Sc(t)){if("selectionStart"in t)var l={start:t.selectionStart,end:t.selectionEnd};else t:{l=(l=t.ownerDocument)&&l.defaultView||window;var a=l.getSelection&&l.getSelection();if(a&&a.rangeCount!==0){l=a.anchorNode;var i=a.anchorOffset,n=a.focusNode;a=a.focusOffset;try{l.nodeType,n.nodeType}catch{l=null;break t}var u=0,s=-1,r=-1,o=0,h=0,y=t,d=null;e:for(;;){for(var p;y!==l||i!==0&&y.nodeType!==3||(s=u+i),y!==n||a!==0&&y.nodeType!==3||(r=u+a),y.nodeType===3&&(u+=y.nodeValue.length),(p=y.firstChild)!==null;)d=y,y=p;for(;;){if(y===t)break e;if(d===l&&++o===i&&(s=u),d===n&&++h===a&&(r=u),(p=y.nextSibling)!==null)break;y=d,d=y.parentNode}y=p}l=s===-1||r===-1?null:{start:s,end:r}}else l=null}l=l||{start:0,end:0}}else l=null;for(lc={focusedElem:t,selectionRange:l},qu=!1,vt=e;vt!==null;)if(e=vt,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,vt=t;else for(;vt!==null;){switch(e=vt,n=e.alternate,t=e.flags,e.tag){case 0:if((t&4)!==0&&(t=e.updateQueue,t=t!==null?t.events:null,t!==null))for(l=0;l<t.length;l++)i=t[l],i.ref.impl=i.nextImpl;break;case 11:case 15:break;case 1:if((t&1024)!==0&&n!==null){t=void 0,l=e,i=n.memoizedProps,n=n.memoizedState,a=l.stateNode;try{var M=$l(l.type,i);t=a.getSnapshotBeforeUpdate(M,n),a.__reactInternalSnapshotBeforeUpdate=t}catch(S){V(l,l.return,S)}}break;case 3:if((t&1024)!==0){if(t=e.stateNode.containerInfo,l=t.nodeType,l===9)ic(t);else if(l===1)switch(t.nodeName){case"HEAD":case"HTML":case"BODY":ic(t);break;default:t.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((t&1024)!==0)throw Error(g(163))}if(t=e.sibling,t!==null){t.return=e.return,vt=t;break}vt=e.return}}function wh(t,e,l){var a=l.flags;switch(l.tag){case 0:case 11:case 15:Oe(t,l),a&4&&fn(5,l);break;case 1:if(Oe(t,l),a&4)if(t=l.stateNode,e===null)try{t.componentDidMount()}catch(u){V(l,l.return,u)}else{var i=$l(l.type,e.memoizedProps);e=e.memoizedState;try{t.componentDidUpdate(i,e,t.__reactInternalSnapshotBeforeUpdate)}catch(u){V(l,l.return,u)}}a&64&&Nh(l),a&512&&Yi(l,l.return);break;case 3:if(Oe(t,l),a&64&&(t=l.updateQueue,t!==null)){if(e=null,l.child!==null)switch(l.child.tag){case 27:case 5:e=l.child.stateNode;break;case 1:e=l.child.stateNode}try{jm(t,e)}catch(u){V(l,l.return,u)}}break;case 27:e===null&&a&4&&Yh(l);case 26:case 5:Oe(t,l),e===null&&a&4&&Uh(l),a&512&&Yi(l,l.return);break;case 12:Oe(t,l);break;case 31:Oe(t,l),a&4&&Xh(t,l);break;case 13:Oe(t,l),a&4&&jh(t,l),a&64&&(t=l.memoizedState,t!==null&&(t=t.dehydrated,t!==null&&(l=r1.bind(null,l),C1(t,l))));break;case 22:if(a=l.memoizedState!==null||Ue,!a){e=e!==null&&e.memoizedState!==null||rt,i=Ue;var n=rt;Ue=a,(rt=e)&&!n?Ne(t,l,(l.subtreeFlags&8772)!==0):Oe(t,l),Ue=i,rt=n}break;case 30:break;default:Oe(t,l)}}function qh(t){var e=t.alternate;e!==null&&(t.alternate=null,qh(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&pc(e)),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}var tt=null,Nt=!1;function De(t,e,l){for(l=l.child;l!==null;)Lh(t,e,l),l=l.sibling}function Lh(t,e,l){if(Qt&&typeof Qt.onCommitFiberUnmount=="function")try{Qt.onCommitFiberUnmount(an,l)}catch{}switch(l.tag){case 26:rt||ve(l,e),De(t,e,l),l.memoizedState?l.memoizedState.count--:l.stateNode&&(l=l.stateNode,l.parentNode.removeChild(l));break;case 27:rt||ve(l,e);var a=tt,i=Nt;_l(l.type)&&(tt=l.stateNode,Nt=!1),De(t,e,l),Xi(l.stateNode),tt=a,Nt=i;break;case 5:rt||ve(l,e);case 6:if(a=tt,i=Nt,tt=null,De(t,e,l),tt=a,Nt=i,tt!==null)if(Nt)try{(tt.nodeType===9?tt.body:tt.nodeName==="HTML"?tt.ownerDocument.body:tt).removeChild(l.stateNode)}catch(n){V(l,e,n)}else try{tt.removeChild(l.stateNode)}catch(n){V(l,e,n)}break;case 18:tt!==null&&(Nt?(t=tt,Dd(t.nodeType===9?t.body:t.nodeName==="HTML"?t.ownerDocument.body:t,l.stateNode),Wa(t)):Dd(tt,l.stateNode));break;case 4:a=tt,i=Nt,tt=l.stateNode.containerInfo,Nt=!0,De(t,e,l),tt=a,Nt=i;break;case 0:case 11:case 14:case 15:Cl(2,l,e),rt||Cl(4,l,e),De(t,e,l);break;case 1:rt||(ve(l,e),a=l.stateNode,typeof a.componentWillUnmount=="function"&&Hh(l,e,a)),De(t,e,l);break;case 21:De(t,e,l);break;case 22:rt=(a=rt)||l.memoizedState!==null,De(t,e,l),rt=a;break;default:De(t,e,l)}}function Xh(t,e){if(e.memoizedState===null&&(t=e.alternate,t!==null&&(t=t.memoizedState,t!==null))){t=t.dehydrated;try{Wa(t)}catch(l){V(e,e.return,l)}}}function jh(t,e){if(e.memoizedState===null&&(t=e.alternate,t!==null&&(t=t.memoizedState,t!==null&&(t=t.dehydrated,t!==null))))try{Wa(t)}catch(l){V(e,e.return,l)}}function t1(t){switch(t.tag){case 31:case 13:case 19:var e=t.stateNode;return e===null&&(e=t.stateNode=new yd),e;case 22:return t=t.stateNode,e=t._retryCache,e===null&&(e=t._retryCache=new yd),e;default:throw Error(g(435,t.tag))}}function Zn(t,e){var l=t1(t);e.forEach(function(a){if(!l.has(a)){l.add(a);var i=c1.bind(null,t,a);a.then(i,i)}})}function Dt(t,e){var l=e.deletions;if(l!==null)for(var a=0;a<l.length;a++){var i=l[a],n=t,u=e,s=u;t:for(;s!==null;){switch(s.tag){case 27:if(_l(s.type)){tt=s.stateNode,Nt=!1;break t}break;case 5:tt=s.stateNode,Nt=!1;break t;case 3:case 4:tt=s.stateNode.containerInfo,Nt=!0;break t}s=s.return}if(tt===null)throw Error(g(160));Lh(n,u,i),tt=null,Nt=!1,n=i.alternate,n!==null&&(n.return=null),i.return=null}if(e.subtreeFlags&13886)for(e=e.child;e!==null;)Vh(e,t),e=e.sibling}var oe=null;function Vh(t,e){var l=t.alternate,a=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:Dt(e,t),Ot(t),a&4&&(Cl(3,t,t.return),fn(3,t),Cl(5,t,t.return));break;case 1:Dt(e,t),Ot(t),a&512&&(rt||l===null||ve(l,l.return)),a&64&&Ue&&(t=t.updateQueue,t!==null&&(a=t.callbacks,a!==null&&(l=t.shared.hiddenCallbacks,t.shared.hiddenCallbacks=l===null?a:l.concat(a))));break;case 26:var i=oe;if(Dt(e,t),Ot(t),a&512&&(rt||l===null||ve(l,l.return)),a&4){var n=l!==null?l.memoizedState:null;if(a=t.memoizedState,l===null)if(a===null)if(t.stateNode===null){t:{a=t.type,l=t.memoizedProps,i=i.ownerDocument||i;e:switch(a){case"title":n=i.getElementsByTagName("title")[0],(!n||n[sn]||n[St]||n.namespaceURI==="http://www.w3.org/2000/svg"||n.hasAttribute("itemprop"))&&(n=i.createElement(a),i.head.insertBefore(n,i.querySelector("head > title"))),Tt(n,a,l),n[St]=t,gt(n),a=n;break t;case"link":var u=wd("link","href",i).get(a+(l.href||""));if(u){for(var s=0;s<u.length;s++)if(n=u[s],n.getAttribute("href")===(l.href==null||l.href===""?null:l.href)&&n.getAttribute("rel")===(l.rel==null?null:l.rel)&&n.getAttribute("title")===(l.title==null?null:l.title)&&n.getAttribute("crossorigin")===(l.crossOrigin==null?null:l.crossOrigin)){u.splice(s,1);break e}}n=i.createElement(a),Tt(n,a,l),i.head.appendChild(n);break;case"meta":if(u=wd("meta","content",i).get(a+(l.content||""))){for(s=0;s<u.length;s++)if(n=u[s],n.getAttribute("content")===(l.content==null?null:""+l.content)&&n.getAttribute("name")===(l.name==null?null:l.name)&&n.getAttribute("property")===(l.property==null?null:l.property)&&n.getAttribute("http-equiv")===(l.httpEquiv==null?null:l.httpEquiv)&&n.getAttribute("charset")===(l.charSet==null?null:l.charSet)){u.splice(s,1);break e}}n=i.createElement(a),Tt(n,a,l),i.head.appendChild(n);break;default:throw Error(g(468,a))}n[St]=t,gt(n),a=n}t.stateNode=a}else qd(i,t.type,t.stateNode);else t.stateNode=Yd(i,a,t.memoizedProps);else n!==a?(n===null?l.stateNode!==null&&(l=l.stateNode,l.parentNode.removeChild(l)):n.count--,a===null?qd(i,t.type,t.stateNode):Yd(i,a,t.memoizedProps)):a===null&&t.stateNode!==null&&nr(t,t.memoizedProps,l.memoizedProps)}break;case 27:Dt(e,t),Ot(t),a&512&&(rt||l===null||ve(l,l.return)),l!==null&&a&4&&nr(t,t.memoizedProps,l.memoizedProps);break;case 5:if(Dt(e,t),Ot(t),a&512&&(rt||l===null||ve(l,l.return)),t.flags&32){i=t.stateNode;try{ja(i,"")}catch(M){V(t,t.return,M)}}a&4&&t.stateNode!=null&&(i=t.memoizedProps,nr(t,i,l!==null?l.memoizedProps:i)),a&1024&&(sr=!0);break;case 6:if(Dt(e,t),Ot(t),a&4){if(t.stateNode===null)throw Error(g(162));a=t.memoizedProps,l=t.stateNode;try{l.nodeValue=a}catch(M){V(t,t.return,M)}}break;case 3:if(cu=null,i=oe,oe=Bu(e.containerInfo),Dt(e,t),oe=i,Ot(t),a&4&&l!==null&&l.memoizedState.isDehydrated)try{Wa(e.containerInfo)}catch(M){V(t,t.return,M)}sr&&(sr=!1,Qh(t));break;case 4:a=oe,oe=Bu(t.stateNode.containerInfo),Dt(e,t),Ot(t),oe=a;break;case 12:Dt(e,t),Ot(t);break;case 31:Dt(e,t),Ot(t),a&4&&(a=t.updateQueue,a!==null&&(t.updateQueue=null,Zn(t,a)));break;case 13:Dt(e,t),Ot(t),t.child.flags&8192&&t.memoizedState!==null!=(l!==null&&l.memoizedState!==null)&&($u=Vt()),a&4&&(a=t.updateQueue,a!==null&&(t.updateQueue=null,Zn(t,a)));break;case 22:i=t.memoizedState!==null;var r=l!==null&&l.memoizedState!==null,o=Ue,h=rt;if(Ue=o||i,rt=h||r,Dt(e,t),rt=h,Ue=o,Ot(t),a&8192)t:for(e=t.stateNode,e._visibility=i?e._visibility&-2:e._visibility|1,i&&(l===null||r||Ue||rt||jl(t)),l=null,e=t;;){if(e.tag===5||e.tag===26){if(l===null){r=l=e;try{if(n=r.stateNode,i)u=n.style,typeof u.setProperty=="function"?u.setProperty("display","none","important"):u.display="none";else{s=r.stateNode;var y=r.memoizedProps.style,d=y!=null&&y.hasOwnProperty("display")?y.display:null;s.style.display=d==null||typeof d=="boolean"?"":(""+d).trim()}}catch(M){V(r,r.return,M)}}}else if(e.tag===6){if(l===null){r=e;try{r.stateNode.nodeValue=i?"":r.memoizedProps}catch(M){V(r,r.return,M)}}}else if(e.tag===18){if(l===null){r=e;try{var p=r.stateNode;i?Od(p,!0):Od(r.stateNode,!1)}catch(M){V(r,r.return,M)}}}else if((e.tag!==22&&e.tag!==23||e.memoizedState===null||e===t)&&e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break t;for(;e.sibling===null;){if(e.return===null||e.return===t)break t;l===e&&(l=null),e=e.return}l===e&&(l=null),e.sibling.return=e.return,e=e.sibling}a&4&&(a=t.updateQueue,a!==null&&(l=a.retryQueue,l!==null&&(a.retryQueue=null,Zn(t,l))));break;case 19:Dt(e,t),Ot(t),a&4&&(a=t.updateQueue,a!==null&&(t.updateQueue=null,Zn(t,a)));break;case 30:break;case 21:break;default:Dt(e,t),Ot(t)}}function Ot(t){var e=t.flags;if(e&2){try{for(var l,a=t.return;a!==null;){if(Bh(a)){l=a;break}a=a.return}if(l==null)throw Error(g(160));switch(l.tag){case 27:var i=l.stateNode,n=ur(t);zu(t,n,i);break;case 5:var u=l.stateNode;l.flags&32&&(ja(u,""),l.flags&=-33);var s=ur(t);zu(t,s,u);break;case 3:case 4:var r=l.stateNode.containerInfo,o=ur(t);Fr(t,o,r);break;default:throw Error(g(161))}}catch(h){V(t,t.return,h)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function Qh(t){if(t.subtreeFlags&1024)for(t=t.child;t!==null;){var e=t;Qh(e),e.tag===5&&e.flags&1024&&e.stateNode.reset(),t=t.sibling}}function Oe(t,e){if(e.subtreeFlags&8772)for(e=e.child;e!==null;)wh(t,e.alternate,e),e=e.sibling}function jl(t){for(t=t.child;t!==null;){var e=t;switch(e.tag){case 0:case 11:case 14:case 15:Cl(4,e,e.return),jl(e);break;case 1:ve(e,e.return);var l=e.stateNode;typeof l.componentWillUnmount=="function"&&Hh(e,e.return,l),jl(e);break;case 27:Xi(e.stateNode);case 26:case 5:ve(e,e.return),jl(e);break;case 22:e.memoizedState===null&&jl(e);break;case 30:jl(e);break;default:jl(e)}t=t.sibling}}function Ne(t,e,l){for(l=l&&(e.subtreeFlags&8772)!==0,e=e.child;e!==null;){var a=e.alternate,i=t,n=e,u=n.flags;switch(n.tag){case 0:case 11:case 15:Ne(i,n,l),fn(4,n);break;case 1:if(Ne(i,n,l),a=n,i=a.stateNode,typeof i.componentDidMount=="function")try{i.componentDidMount()}catch(o){V(a,a.return,o)}if(a=n,i=a.updateQueue,i!==null){var s=a.stateNode;try{var r=i.shared.hiddenCallbacks;if(r!==null)for(i.shared.hiddenCallbacks=null,i=0;i<r.length;i++)Xm(r[i],s)}catch(o){V(a,a.return,o)}}l&&u&64&&Nh(n),Yi(n,n.return);break;case 27:Yh(n);case 26:case 5:Ne(i,n,l),l&&a===null&&u&4&&Uh(n),Yi(n,n.return);break;case 12:Ne(i,n,l);break;case 31:Ne(i,n,l),l&&u&4&&Xh(i,n);break;case 13:Ne(i,n,l),l&&u&4&&jh(i,n);break;case 22:n.memoizedState===null&&Ne(i,n,l),Yi(n,n.return);break;case 30:break;default:Ne(i,n,l)}e=e.sibling}}function Jc(t,e){var l=null;t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(l=t.memoizedState.cachePool.pool),t=null,e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(t=e.memoizedState.cachePool.pool),t!==l&&(t!=null&&t.refCount++,l!=null&&cn(l))}function Fc(t,e){t=null,e.alternate!==null&&(t=e.alternate.memoizedState.cache),e=e.memoizedState.cache,e!==t&&(e.refCount++,t!=null&&cn(t))}function ce(t,e,l,a){if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Zh(t,e,l,a),e=e.sibling}function Zh(t,e,l,a){var i=e.flags;switch(e.tag){case 0:case 11:case 15:ce(t,e,l,a),i&2048&&fn(9,e);break;case 1:ce(t,e,l,a);break;case 3:ce(t,e,l,a),i&2048&&(t=null,e.alternate!==null&&(t=e.alternate.memoizedState.cache),e=e.memoizedState.cache,e!==t&&(e.refCount++,t!=null&&cn(t)));break;case 12:if(i&2048){ce(t,e,l,a),t=e.stateNode;try{var n=e.memoizedProps,u=n.id,s=n.onPostCommit;typeof s=="function"&&s(u,e.alternate===null?"mount":"update",t.passiveEffectDuration,-0)}catch(r){V(e,e.return,r)}}else ce(t,e,l,a);break;case 31:ce(t,e,l,a);break;case 13:ce(t,e,l,a);break;case 23:break;case 22:n=e.stateNode,u=e.alternate,e.memoizedState!==null?n._visibility&2?ce(t,e,l,a):wi(t,e):n._visibility&2?ce(t,e,l,a):(n._visibility|=2,ba(t,e,l,a,(e.subtreeFlags&10256)!==0||!1)),i&2048&&Jc(u,e);break;case 24:ce(t,e,l,a),i&2048&&Fc(e.alternate,e);break;default:ce(t,e,l,a)}}function ba(t,e,l,a,i){for(i=i&&((e.subtreeFlags&10256)!==0||!1),e=e.child;e!==null;){var n=t,u=e,s=l,r=a,o=u.flags;switch(u.tag){case 0:case 11:case 15:ba(n,u,s,r,i),fn(8,u);break;case 23:break;case 22:var h=u.stateNode;u.memoizedState!==null?h._visibility&2?ba(n,u,s,r,i):wi(n,u):(h._visibility|=2,ba(n,u,s,r,i)),i&&o&2048&&Jc(u.alternate,u);break;case 24:ba(n,u,s,r,i),i&&o&2048&&Fc(u.alternate,u);break;default:ba(n,u,s,r,i)}e=e.sibling}}function wi(t,e){if(e.subtreeFlags&10256)for(e=e.child;e!==null;){var l=t,a=e,i=a.flags;switch(a.tag){case 22:wi(l,a),i&2048&&Jc(a.alternate,a);break;case 24:wi(l,a),i&2048&&Fc(a.alternate,a);break;default:wi(l,a)}e=e.sibling}}var zi=8192;function ga(t,e,l){if(t.subtreeFlags&zi)for(t=t.child;t!==null;)Kh(t,e,l),t=t.sibling}function Kh(t,e,l){switch(t.tag){case 26:ga(t,e,l),t.flags&zi&&t.memoizedState!==null&&w1(l,oe,t.memoizedState,t.memoizedProps);break;case 5:ga(t,e,l);break;case 3:case 4:var a=oe;oe=Bu(t.stateNode.containerInfo),ga(t,e,l),oe=a;break;case 22:t.memoizedState===null&&(a=t.alternate,a!==null&&a.memoizedState!==null?(a=zi,zi=16777216,ga(t,e,l),zi=a):ga(t,e,l));break;default:ga(t,e,l)}}function Jh(t){var e=t.alternate;if(e!==null&&(t=e.child,t!==null)){e.child=null;do e=t.sibling,t.sibling=null,t=e;while(t!==null)}}function Si(t){var e=t.deletions;if((t.flags&16)!==0){if(e!==null)for(var l=0;l<e.length;l++){var a=e[l];vt=a,kh(a,t)}Jh(t)}if(t.subtreeFlags&10256)for(t=t.child;t!==null;)Fh(t),t=t.sibling}function Fh(t){switch(t.tag){case 0:case 11:case 15:Si(t),t.flags&2048&&Cl(9,t,t.return);break;case 3:Si(t);break;case 12:Si(t);break;case 22:var e=t.stateNode;t.memoizedState!==null&&e._visibility&2&&(t.return===null||t.return.tag!==13)?(e._visibility&=-3,su(t)):Si(t);break;default:Si(t)}}function su(t){var e=t.deletions;if((t.flags&16)!==0){if(e!==null)for(var l=0;l<e.length;l++){var a=e[l];vt=a,kh(a,t)}Jh(t)}for(t=t.child;t!==null;){switch(e=t,e.tag){case 0:case 11:case 15:Cl(8,e,e.return),su(e);break;case 22:l=e.stateNode,l._visibility&2&&(l._visibility&=-3,su(e));break;default:su(e)}t=t.sibling}}function kh(t,e){for(;vt!==null;){var l=vt;switch(l.tag){case 0:case 11:case 15:Cl(8,l,e);break;case 23:case 22:if(l.memoizedState!==null&&l.memoizedState.cachePool!==null){var a=l.memoizedState.cachePool.pool;a!=null&&a.refCount++}break;case 24:cn(l.memoizedState.cache)}if(a=l.child,a!==null)a.return=l,vt=a;else t:for(l=t;vt!==null;){a=vt;var i=a.sibling,n=a.return;if(qh(a),a===l){vt=null;break t}if(i!==null){i.return=n,vt=i;break t}vt=n}}}var e1={getCacheForType:function(t){var e=xt(ct),l=e.data.get(t);return l===void 0&&(l=t(),e.data.set(t,l)),l},cacheSignal:function(){return xt(ct).controller.signal}},l1=typeof WeakMap=="function"?WeakMap:Map,L=0,J=null,Y=null,w=0,j=0,qt=null,dl=!1,ei=!1,kc=!1,Ke=0,at=0,Al=0,Jl=0,Wc=0,jt=0,Ka=0,qi=null,Ht=null,kr=!1,$u=0,Wh=0,_u=1/0,Ru=null,bl=null,ht=0,Ml=null,Ja=null,Xe=0,Wr=0,Pr=null,Ph=null,Li=0,$r=null;function Kt(){return(L&2)!==0&&w!==0?w&-w:A.T!==null?$c():um()}function $h(){if(jt===0)if((w&536870912)===0||q){var t=Un;Un<<=1,(Un&3932160)===0&&(Un=262144),jt=t}else jt=536870912;return t=Ft.current,t!==null&&(t.flags|=32),jt}function Ut(t,e,l){(t===J&&(j===2||j===9)||t.cancelPendingCommit!==null)&&(Fa(t,0),ml(t,w,jt,!1)),un(t,l),((L&2)===0||t!==J)&&(t===J&&((L&2)===0&&(Jl|=l),at===4&&ml(t,w,jt,!1)),Me(t))}function Ih(t,e,l){if((L&6)!==0)throw Error(g(327));var a=!l&&(e&127)===0&&(e&t.expiredLanes)===0||nn(t,e),i=a?n1(t,e):rr(t,e,!0),n=a;do{if(i===0){ei&&!a&&ml(t,e,0,!1);break}else{if(l=t.current.alternate,n&&!a1(l)){i=rr(t,e,!1),n=!1;continue}if(i===2){if(n=e,t.errorRecoveryDisabledLanes&n)var u=0;else u=t.pendingLanes&-536870913,u=u!==0?u:u&536870912?536870912:0;if(u!==0){e=u;t:{var s=t;i=qi;var r=s.current.memoizedState.isDehydrated;if(r&&(Fa(s,u).flags|=256),u=rr(s,u,!1),u!==2){if(kc&&!r){s.errorRecoveryDisabledLanes|=n,Jl|=n,i=4;break t}n=Ht,Ht=i,n!==null&&(Ht===null?Ht=n:Ht.push.apply(Ht,n))}i=u}if(n=!1,i!==2)continue}}if(i===1){Fa(t,0),ml(t,e,0,!0);break}t:{switch(a=t,n=i,n){case 0:case 1:throw Error(g(345));case 4:if((e&4194048)!==e)break;case 6:ml(a,e,jt,!dl);break t;case 2:Ht=null;break;case 3:case 5:break;default:throw Error(g(329))}if((e&62914560)===e&&(i=$u+300-Vt(),10<i)){if(ml(a,e,jt,!dl),Xu(a,0,!0)!==0)break t;Xe=e,a.timeoutHandle=bp(vd.bind(null,a,l,Ht,Ru,kr,e,jt,Jl,Ka,dl,n,"Throttled",-0,0),i);break t}vd(a,l,Ht,Ru,kr,e,jt,Jl,Ka,dl,n,null,-0,0)}}break}while(!0);Me(t)}function vd(t,e,l,a,i,n,u,s,r,o,h,y,d,p){if(t.timeoutHandle=-1,y=e.subtreeFlags,y&8192||(y&16785408)===16785408){y={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:Ye},Kh(e,n,y);var M=(n&62914560)===n?$u-Vt():(n&4194048)===n?Wh-Vt():0;if(M=q1(y,M),M!==null){Xe=n,t.cancelPendingCommit=M(bd.bind(null,t,e,n,l,a,i,u,s,r,h,y,null,d,p)),ml(t,n,u,!o);return}}bd(t,e,n,l,a,i,u,s,r)}function a1(t){for(var e=t;;){var l=e.tag;if((l===0||l===11||l===15)&&e.flags&16384&&(l=e.updateQueue,l!==null&&(l=l.stores,l!==null)))for(var a=0;a<l.length;a++){var i=l[a],n=i.getSnapshot;i=i.value;try{if(!Jt(n(),i))return!1}catch{return!1}}if(l=e.child,e.subtreeFlags&16384&&l!==null)l.return=e,e=l;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function ml(t,e,l,a){e&=~Wc,e&=~Jl,t.suspendedLanes|=e,t.pingedLanes&=~e,a&&(t.warmLanes|=e),a=t.expirationTimes;for(var i=e;0<i;){var n=31-Zt(i),u=1<<n;a[n]=-1,i&=~u}l!==0&&am(t,l,e)}function Iu(){return(L&6)===0?(dn(0,!1),!1):!0}function Pc(){if(Y!==null){if(j===0)var t=Y.return;else t=Y,we=aa=null,Bc(t),Ya=null,Fi=0,t=Y;for(;t!==null;)Oh(t.alternate,t),t=t.return;Y=null}}function Fa(t,e){var l=t.timeoutHandle;l!==-1&&(t.timeoutHandle=-1,S1(l)),l=t.cancelPendingCommit,l!==null&&(t.cancelPendingCommit=null,l()),Xe=0,Pc(),J=t,Y=l=qe(t.current,null),w=e,j=0,qt=null,dl=!1,ei=nn(t,e),kc=!1,Ka=jt=Wc=Jl=Al=at=0,Ht=qi=null,kr=!1,(e&8)!==0&&(e|=e&32);var a=t.entangledLanes;if(a!==0)for(t=t.entanglements,a&=e;0<a;){var i=31-Zt(a),n=1<<i;e|=t[i],a&=~n}return Ke=e,Zu(),l}function tp(t,e){O=null,A.H=Wi,e===ti||e===Ju?(e=kf(),j=3):e===_c?(e=kf(),j=4):j=e===Zc?8:e!==null&&typeof e=="object"&&typeof e.then=="function"?6:1,qt=e,Y===null&&(at=1,Cu(t,ae(e,t.current)))}function ep(){var t=Ft.current;return t===null?!0:(w&4194048)===w?ne===null:(w&62914560)===w||(w&536870912)!==0?t===ne:!1}function lp(){var t=A.H;return A.H=Wi,t===null?Wi:t}function ap(){var t=A.A;return A.A=e1,t}function Du(){at=4,dl||(w&4194048)!==w&&Ft.current!==null||(ei=!0),(Al&134217727)===0&&(Jl&134217727)===0||J===null||ml(J,w,jt,!1)}function rr(t,e,l){var a=L;L|=2;var i=lp(),n=ap();(J!==t||w!==e)&&(Ru=null,Fa(t,e)),e=!1;var u=at;t:do try{if(j!==0&&Y!==null){var s=Y,r=qt;switch(j){case 8:Pc(),u=6;break t;case 3:case 2:case 9:case 6:Ft.current===null&&(e=!0);var o=j;if(j=0,qt=null,Oa(t,s,r,o),l&&ei){u=0;break t}break;default:o=j,j=0,qt=null,Oa(t,s,r,o)}}i1(),u=at;break}catch(h){tp(t,h)}while(!0);return e&&t.shellSuspendCounter++,we=aa=null,L=a,A.H=i,A.A=n,Y===null&&(J=null,w=0,Zu()),u}function i1(){for(;Y!==null;)ip(Y)}function n1(t,e){var l=L;L|=2;var a=lp(),i=ap();J!==t||w!==e?(Ru=null,_u=Vt()+500,Fa(t,e)):ei=nn(t,e);t:do try{if(j!==0&&Y!==null){e=Y;var n=qt;e:switch(j){case 1:j=0,qt=null,Oa(t,e,n,1);break;case 2:case 9:if(Ff(n)){j=0,qt=null,gd(e);break}e=function(){j!==2&&j!==9||J!==t||(j=7),Me(t)},n.then(e,e);break t;case 3:j=7;break t;case 4:j=5;break t;case 7:Ff(n)?(j=0,qt=null,gd(e)):(j=0,qt=null,Oa(t,e,n,7));break;case 5:var u=null;switch(Y.tag){case 26:u=Y.memoizedState;case 5:case 27:var s=Y;if(u?Tp(u):s.stateNode.complete){j=0,qt=null;var r=s.sibling;if(r!==null)Y=r;else{var o=s.return;o!==null?(Y=o,ts(o)):Y=null}break e}}j=0,qt=null,Oa(t,e,n,5);break;case 6:j=0,qt=null,Oa(t,e,n,6);break;case 8:Pc(),at=6;break t;default:throw Error(g(462))}}u1();break}catch(h){tp(t,h)}while(!0);return we=aa=null,A.H=a,A.A=i,L=l,Y!==null?0:(J=null,w=0,Zu(),at)}function u1(){for(;Y!==null&&!_0();)ip(Y)}function ip(t){var e=Dh(t.alternate,t,Ke);t.memoizedProps=t.pendingProps,e===null?ts(t):Y=e}function gd(t){var e=t,l=e.alternate;switch(e.tag){case 15:case 0:e=fd(l,e,e.pendingProps,e.type,void 0,w);break;case 11:e=fd(l,e,e.pendingProps,e.type.render,e.ref,w);break;case 5:Bc(e);default:Oh(l,e),e=Y=Om(e,Ke),e=Dh(l,e,Ke)}t.memoizedProps=t.pendingProps,e===null?ts(t):Y=e}function Oa(t,e,l,a){we=aa=null,Bc(e),Ya=null,Fi=0;var i=e.return;try{if(Fv(t,i,e,l,w)){at=1,Cu(t,ae(l,t.current)),Y=null;return}}catch(n){if(i!==null)throw Y=i,n;at=1,Cu(t,ae(l,t.current)),Y=null;return}e.flags&32768?(q||a===1?t=!0:ei||(w&536870912)!==0?t=!1:(dl=t=!0,(a===2||a===9||a===3||a===6)&&(a=Ft.current,a!==null&&a.tag===13&&(a.flags|=16384))),np(e,t)):ts(e)}function ts(t){var e=t;do{if((e.flags&32768)!==0){np(e,dl);return}t=e.return;var l=Pv(e.alternate,e,Ke);if(l!==null){Y=l;return}if(e=e.sibling,e!==null){Y=e;return}Y=e=t}while(e!==null);at===0&&(at=5)}function np(t,e){do{var l=$v(t.alternate,t);if(l!==null){l.flags&=32767,Y=l;return}if(l=t.return,l!==null&&(l.flags|=32768,l.subtreeFlags=0,l.deletions=null),!e&&(t=t.sibling,t!==null)){Y=t;return}Y=t=l}while(t!==null);at=6,Y=null}function bd(t,e,l,a,i,n,u,s,r){t.cancelPendingCommit=null;do es();while(ht!==0);if((L&6)!==0)throw Error(g(327));if(e!==null){if(e===t.current)throw Error(g(177));if(n=e.lanes|e.childLanes,n|=Ec,q0(t,l,n,u,s,r),t===J&&(Y=J=null,w=0),Ja=e,Ml=t,Xe=l,Wr=n,Pr=i,Ph=a,(e.subtreeFlags&10256)!==0||(e.flags&10256)!==0?(t.callbackNode=null,t.callbackPriority=0,o1(pu,function(){return op(),null})):(t.callbackNode=null,t.callbackPriority=0),a=(e.flags&13878)!==0,(e.subtreeFlags&13878)!==0||a){a=A.T,A.T=null,i=X.p,X.p=2,u=L,L|=4;try{Iv(t,e,l)}finally{L=u,X.p=i,A.T=a}}ht=1,up(),sp(),rp()}}function up(){if(ht===1){ht=0;var t=Ml,e=Ja,l=(e.flags&13878)!==0;if((e.subtreeFlags&13878)!==0||l){l=A.T,A.T=null;var a=X.p;X.p=2;var i=L;L|=4;try{Vh(e,t);var n=lc,u=Tm(t.containerInfo),s=n.focusedElem,r=n.selectionRange;if(u!==s&&s&&s.ownerDocument&&xm(s.ownerDocument.documentElement,s)){if(r!==null&&Sc(s)){var o=r.start,h=r.end;if(h===void 0&&(h=o),"selectionStart"in s)s.selectionStart=o,s.selectionEnd=Math.min(h,s.value.length);else{var y=s.ownerDocument||document,d=y&&y.defaultView||window;if(d.getSelection){var p=d.getSelection(),M=s.textContent.length,S=Math.min(r.start,M),U=r.end===void 0?S:Math.min(r.end,M);!p.extend&&S>U&&(u=U,U=S,S=u);var f=Xf(s,S),c=Xf(s,U);if(f&&c&&(p.rangeCount!==1||p.anchorNode!==f.node||p.anchorOffset!==f.offset||p.focusNode!==c.node||p.focusOffset!==c.offset)){var m=y.createRange();m.setStart(f.node,f.offset),p.removeAllRanges(),S>U?(p.addRange(m),p.extend(c.node,c.offset)):(m.setEnd(c.node,c.offset),p.addRange(m))}}}}for(y=[],p=s;p=p.parentNode;)p.nodeType===1&&y.push({element:p,left:p.scrollLeft,top:p.scrollTop});for(typeof s.focus=="function"&&s.focus(),s=0;s<y.length;s++){var v=y[s];v.element.scrollLeft=v.left,v.element.scrollTop=v.top}}qu=!!ec,lc=ec=null}finally{L=i,X.p=a,A.T=l}}t.current=e,ht=2}}function sp(){if(ht===2){ht=0;var t=Ml,e=Ja,l=(e.flags&8772)!==0;if((e.subtreeFlags&8772)!==0||l){l=A.T,A.T=null;var a=X.p;X.p=2;var i=L;L|=4;try{wh(t,e.alternate,e)}finally{L=i,X.p=a,A.T=l}}ht=3}}function rp(){if(ht===4||ht===3){ht=0,R0();var t=Ml,e=Ja,l=Xe,a=Ph;(e.subtreeFlags&10256)!==0||(e.flags&10256)!==0?ht=5:(ht=0,Ja=Ml=null,cp(t,t.pendingLanes));var i=t.pendingLanes;if(i===0&&(bl=null),hc(l),e=e.stateNode,Qt&&typeof Qt.onCommitFiberRoot=="function")try{Qt.onCommitFiberRoot(an,e,void 0,(e.current.flags&128)===128)}catch{}if(a!==null){e=A.T,i=X.p,X.p=2,A.T=null;try{for(var n=t.onRecoverableError,u=0;u<a.length;u++){var s=a[u];n(s.value,{componentStack:s.stack})}}finally{A.T=e,X.p=i}}(Xe&3)!==0&&es(),Me(t),i=t.pendingLanes,(l&261930)!==0&&(i&42)!==0?t===$r?Li++:(Li=0,$r=t):Li=0,dn(0,!1)}}function cp(t,e){(t.pooledCacheLanes&=e)===0&&(e=t.pooledCache,e!=null&&(t.pooledCache=null,cn(e)))}function es(){return up(),sp(),rp(),op()}function op(){if(ht!==5)return!1;var t=Ml,e=Wr;Wr=0;var l=hc(Xe),a=A.T,i=X.p;try{X.p=32>l?32:l,A.T=null,l=Pr,Pr=null;var n=Ml,u=Xe;if(ht=0,Ja=Ml=null,Xe=0,(L&6)!==0)throw Error(g(331));var s=L;if(L|=4,Fh(n.current),Zh(n,n.current,u,l),L=s,dn(0,!1),Qt&&typeof Qt.onPostCommitFiberRoot=="function")try{Qt.onPostCommitFiberRoot(an,n)}catch{}return!0}finally{X.p=i,A.T=a,cp(t,e)}}function Md(t,e,l){e=ae(l,e),e=Zr(t.stateNode,e,2),t=gl(t,e,2),t!==null&&(un(t,2),Me(t))}function V(t,e,l){if(t.tag===3)Md(t,t,l);else for(;e!==null;){if(e.tag===3){Md(e,t,l);break}else if(e.tag===1){var a=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof a.componentDidCatch=="function"&&(bl===null||!bl.has(a))){t=ae(l,t),l=Gh(2),a=gl(e,l,2),a!==null&&(Ch(l,a,e,t),un(a,2),Me(a));break}}e=e.return}}function cr(t,e,l){var a=t.pingCache;if(a===null){a=t.pingCache=new l1;var i=new Set;a.set(e,i)}else i=a.get(e),i===void 0&&(i=new Set,a.set(e,i));i.has(l)||(kc=!0,i.add(l),t=s1.bind(null,t,e,l),e.then(t,t))}function s1(t,e,l){var a=t.pingCache;a!==null&&a.delete(e),t.pingedLanes|=t.suspendedLanes&l,t.warmLanes&=~l,J===t&&(w&l)===l&&(at===4||at===3&&(w&62914560)===w&&300>Vt()-$u?(L&2)===0&&Fa(t,0):Wc|=l,Ka===w&&(Ka=0)),Me(t)}function fp(t,e){e===0&&(e=lm()),t=la(t,e),t!==null&&(un(t,e),Me(t))}function r1(t){var e=t.memoizedState,l=0;e!==null&&(l=e.retryLane),fp(t,l)}function c1(t,e){var l=0;switch(t.tag){case 31:case 13:var a=t.stateNode,i=t.memoizedState;i!==null&&(l=i.retryLane);break;case 19:a=t.stateNode;break;case 22:a=t.stateNode._retryCache;break;default:throw Error(g(314))}a!==null&&a.delete(e),fp(t,l)}function o1(t,e){return dc(t,e)}var Ou=null,Ma=null,Ir=!1,Nu=!1,or=!1,hl=0;function Me(t){t!==Ma&&t.next===null&&(Ma===null?Ou=Ma=t:Ma=Ma.next=t),Nu=!0,Ir||(Ir=!0,d1())}function dn(t,e){if(!or&&Nu){or=!0;do for(var l=!1,a=Ou;a!==null;){if(!e)if(t!==0){var i=a.pendingLanes;if(i===0)var n=0;else{var u=a.suspendedLanes,s=a.pingedLanes;n=(1<<31-Zt(42|t)+1)-1,n&=i&~(u&~s),n=n&201326741?n&201326741|1:n?n|2:0}n!==0&&(l=!0,Sd(a,n))}else n=w,n=Xu(a,a===J?n:0,a.cancelPendingCommit!==null||a.timeoutHandle!==-1),(n&3)===0||nn(a,n)||(l=!0,Sd(a,n));a=a.next}while(l);or=!1}}function f1(){dp()}function dp(){Nu=Ir=!1;var t=0;hl!==0&&M1()&&(t=hl);for(var e=Vt(),l=null,a=Ou;a!==null;){var i=a.next,n=mp(a,e);n===0?(a.next=null,l===null?Ou=i:l.next=i,i===null&&(Ma=l)):(l=a,(t!==0||(n&3)!==0)&&(Nu=!0)),a=i}ht!==0&&ht!==5||dn(t,!1),hl!==0&&(hl=0)}function mp(t,e){for(var l=t.suspendedLanes,a=t.pingedLanes,i=t.expirationTimes,n=t.pendingLanes&-62914561;0<n;){var u=31-Zt(n),s=1<<u,r=i[u];r===-1?((s&l)===0||(s&a)!==0)&&(i[u]=w0(s,e)):r<=e&&(t.expiredLanes|=s),n&=~s}if(e=J,l=w,l=Xu(t,t===e?l:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),a=t.callbackNode,l===0||t===e&&(j===2||j===9)||t.cancelPendingCommit!==null)return a!==null&&a!==null&&qs(a),t.callbackNode=null,t.callbackPriority=0;if((l&3)===0||nn(t,l)){if(e=l&-l,e===t.callbackPriority)return e;switch(a!==null&&qs(a),hc(l)){case 2:case 8:l=tm;break;case 32:l=pu;break;case 268435456:l=em;break;default:l=pu}return a=hp.bind(null,t),l=dc(l,a),t.callbackPriority=e,t.callbackNode=l,e}return a!==null&&a!==null&&qs(a),t.callbackPriority=2,t.callbackNode=null,2}function hp(t,e){if(ht!==0&&ht!==5)return t.callbackNode=null,t.callbackPriority=0,null;var l=t.callbackNode;if(es()&&t.callbackNode!==l)return null;var a=w;return a=Xu(t,t===J?a:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),a===0?null:(Ih(t,a,e),mp(t,Vt()),t.callbackNode!=null&&t.callbackNode===l?hp.bind(null,t):null)}function Sd(t,e){if(es())return null;Ih(t,e,!0)}function d1(){E1(function(){(L&6)!==0?dc(Id,f1):dp()})}function $c(){if(hl===0){var t=Va;t===0&&(t=Hn,Hn<<=1,(Hn&261888)===0&&(Hn=256)),hl=t}return hl}function Ed(t){return t==null||typeof t=="symbol"||typeof t=="boolean"?null:typeof t=="function"?t:$n(""+t)}function xd(t,e){var l=e.ownerDocument.createElement("input");return l.name=e.name,l.value=e.value,t.id&&l.setAttribute("form",t.id),e.parentNode.insertBefore(l,e),t=new FormData(t),l.parentNode.removeChild(l),t}function m1(t,e,l,a,i){if(e==="submit"&&l&&l.stateNode===i){var n=Ed((i[Bt]||null).action),u=a.submitter;u&&(e=(e=u[Bt]||null)?Ed(e.formAction):u.getAttribute("formAction"),e!==null&&(n=e,u=null));var s=new ju("action","action",null,a,i);t.push({event:s,listeners:[{instance:null,listener:function(){if(a.defaultPrevented){if(hl!==0){var r=u?xd(i,u):new FormData(i);Vr(l,{pending:!0,data:r,method:i.method,action:n},null,r)}}else typeof n=="function"&&(s.preventDefault(),r=u?xd(i,u):new FormData(i),Vr(l,{pending:!0,data:r,method:i.method,action:n},n,r))},currentTarget:i}]})}}for(Kn=0;Kn<Dr.length;Kn++)Jn=Dr[Kn],Td=Jn.toLowerCase(),Gd=Jn[0].toUpperCase()+Jn.slice(1),fe(Td,"on"+Gd);var Jn,Td,Gd,Kn;fe(Cm,"onAnimationEnd");fe(Am,"onAnimationIteration");fe(zm,"onAnimationStart");fe("dblclick","onDoubleClick");fe("focusin","onFocus");fe("focusout","onBlur");fe(Dv,"onTransitionRun");fe(Ov,"onTransitionStart");fe(Nv,"onTransitionCancel");fe(_m,"onTransitionEnd");Xa("onMouseEnter",["mouseout","mouseover"]);Xa("onMouseLeave",["mouseout","mouseover"]);Xa("onPointerEnter",["pointerout","pointerover"]);Xa("onPointerLeave",["pointerout","pointerover"]);Il("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Il("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Il("onBeforeInput",["compositionend","keypress","textInput","paste"]);Il("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Il("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Il("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Pi="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),h1=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Pi));function pp(t,e){e=(e&4)!==0;for(var l=0;l<t.length;l++){var a=t[l],i=a.event;a=a.listeners;t:{var n=void 0;if(e)for(var u=a.length-1;0<=u;u--){var s=a[u],r=s.instance,o=s.currentTarget;if(s=s.listener,r!==n&&i.isPropagationStopped())break t;n=s,i.currentTarget=o;try{n(i)}catch(h){vu(h)}i.currentTarget=null,n=r}else for(u=0;u<a.length;u++){if(s=a[u],r=s.instance,o=s.currentTarget,s=s.listener,r!==n&&i.isPropagationStopped())break t;n=s,i.currentTarget=o;try{n(i)}catch(h){vu(h)}i.currentTarget=null,n=r}}}}function B(t,e){var l=e[xr];l===void 0&&(l=e[xr]=new Set);var a=t+"__bubble";l.has(a)||(yp(e,t,2,!1),l.add(a))}function fr(t,e,l){var a=0;e&&(a|=4),yp(l,t,a,e)}var Fn="_reactListening"+Math.random().toString(36).slice(2);function Ic(t){if(!t[Fn]){t[Fn]=!0,sm.forEach(function(l){l!=="selectionchange"&&(h1.has(l)||fr(l,!1,t),fr(l,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[Fn]||(e[Fn]=!0,fr("selectionchange",!1,e))}}function yp(t,e,l,a){switch(_p(e)){case 2:var i=j1;break;case 8:i=V1;break;default:i=ao}l=i.bind(null,e,l,t),i=void 0,!zr||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(i=!0),a?i!==void 0?t.addEventListener(e,l,{capture:!0,passive:i}):t.addEventListener(e,l,!0):i!==void 0?t.addEventListener(e,l,{passive:i}):t.addEventListener(e,l,!1)}function dr(t,e,l,a,i){var n=a;if((e&1)===0&&(e&2)===0&&a!==null)t:for(;;){if(a===null)return;var u=a.tag;if(u===3||u===4){var s=a.stateNode.containerInfo;if(s===i)break;if(u===4)for(u=a.return;u!==null;){var r=u.tag;if((r===3||r===4)&&u.stateNode.containerInfo===i)return;u=u.return}for(;s!==null;){if(u=xa(s),u===null)return;if(r=u.tag,r===5||r===6||r===26||r===27){a=n=u;continue t}s=s.parentNode}}a=a.return}pm(function(){var o=n,h=vc(l),y=[];t:{var d=Rm.get(t);if(d!==void 0){var p=ju,M=t;switch(t){case"keypress":if(tu(l)===0)break t;case"keydown":case"keyup":p=cv;break;case"focusin":M="focus",p=Qs;break;case"focusout":M="blur",p=Qs;break;case"beforeblur":case"afterblur":p=Qs;break;case"click":if(l.button===2)break t;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":p=Of;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":p=P0;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":p=dv;break;case Cm:case Am:case zm:p=tv;break;case _m:p=hv;break;case"scroll":case"scrollend":p=k0;break;case"wheel":p=yv;break;case"copy":case"cut":case"paste":p=lv;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":p=Hf;break;case"toggle":case"beforetoggle":p=gv}var S=(e&4)!==0,U=!S&&(t==="scroll"||t==="scrollend"),f=S?d!==null?d+"Capture":null:d;S=[];for(var c=o,m;c!==null;){var v=c;if(m=v.stateNode,v=v.tag,v!==5&&v!==26&&v!==27||m===null||f===null||(v=Vi(c,f),v!=null&&S.push($i(c,v,m))),U)break;c=c.return}0<S.length&&(d=new p(d,M,null,l,h),y.push({event:d,listeners:S}))}}if((e&7)===0){t:{if(d=t==="mouseover"||t==="pointerover",p=t==="mouseout"||t==="pointerout",d&&l!==Ar&&(M=l.relatedTarget||l.fromElement)&&(xa(M)||M[Pa]))break t;if((p||d)&&(d=h.window===h?h:(d=h.ownerDocument)?d.defaultView||d.parentWindow:window,p?(M=l.relatedTarget||l.toElement,p=o,M=M?xa(M):null,M!==null&&(U=ln(M),S=M.tag,M!==U||S!==5&&S!==27&&S!==6)&&(M=null)):(p=null,M=o),p!==M)){if(S=Of,v="onMouseLeave",f="onMouseEnter",c="mouse",(t==="pointerout"||t==="pointerover")&&(S=Hf,v="onPointerLeave",f="onPointerEnter",c="pointer"),U=p==null?d:Ci(p),m=M==null?d:Ci(M),d=new S(v,c+"leave",p,l,h),d.target=U,d.relatedTarget=m,v=null,xa(h)===o&&(S=new S(f,c+"enter",M,l,h),S.target=m,S.relatedTarget=U,v=S),U=v,p&&M)e:{for(S=p1,f=p,c=M,m=0,v=f;v;v=S(v))m++;v=0;for(var T=c;T;T=S(T))v++;for(;0<m-v;)f=S(f),m--;for(;0<v-m;)c=S(c),v--;for(;m--;){if(f===c||c!==null&&f===c.alternate){S=f;break e}f=S(f),c=S(c)}S=null}else S=null;p!==null&&Cd(y,d,p,S,!1),M!==null&&U!==null&&Cd(y,U,M,S,!0)}}t:{if(d=o?Ci(o):window,p=d.nodeName&&d.nodeName.toLowerCase(),p==="select"||p==="input"&&d.type==="file")var H=wf;else if(Yf(d))if(Sm)H=zv;else{H=Cv;var E=Gv}else p=d.nodeName,!p||p.toLowerCase()!=="input"||d.type!=="checkbox"&&d.type!=="radio"?o&&yc(o.elementType)&&(H=wf):H=Av;if(H&&(H=H(t,o))){Mm(y,H,l,h);break t}E&&E(t,d,o),t==="focusout"&&o&&d.type==="number"&&o.memoizedProps.value!=null&&Cr(d,"number",d.value)}switch(E=o?Ci(o):window,t){case"focusin":(Yf(E)||E.contentEditable==="true")&&(Ca=E,_r=o,Di=null);break;case"focusout":Di=_r=Ca=null;break;case"mousedown":Rr=!0;break;case"contextmenu":case"mouseup":case"dragend":Rr=!1,jf(y,l,h);break;case"selectionchange":if(Rv)break;case"keydown":case"keyup":jf(y,l,h)}var R;if(Mc)t:{switch(t){case"compositionstart":var b="onCompositionStart";break t;case"compositionend":b="onCompositionEnd";break t;case"compositionupdate":b="onCompositionUpdate";break t}b=void 0}else Ga?gm(t,l)&&(b="onCompositionEnd"):t==="keydown"&&l.keyCode===229&&(b="onCompositionStart");b&&(vm&&l.locale!=="ko"&&(Ga||b!=="onCompositionStart"?b==="onCompositionEnd"&&Ga&&(R=ym()):(fl=h,gc="value"in fl?fl.value:fl.textContent,Ga=!0)),E=Hu(o,b),0<E.length&&(b=new Nf(b,t,null,l,h),y.push({event:b,listeners:E}),R?b.data=R:(R=bm(l),R!==null&&(b.data=R)))),(R=Mv?Sv(t,l):Ev(t,l))&&(b=Hu(o,"onBeforeInput"),0<b.length&&(E=new Nf("onBeforeInput","beforeinput",null,l,h),y.push({event:E,listeners:b}),E.data=R)),m1(y,t,o,l,h)}pp(y,e)})}function $i(t,e,l){return{instance:t,listener:e,currentTarget:l}}function Hu(t,e){for(var l=e+"Capture",a=[];t!==null;){var i=t,n=i.stateNode;if(i=i.tag,i!==5&&i!==26&&i!==27||n===null||(i=Vi(t,l),i!=null&&a.unshift($i(t,i,n)),i=Vi(t,e),i!=null&&a.push($i(t,i,n))),t.tag===3)return a;t=t.return}return[]}function p1(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5&&t.tag!==27);return t||null}function Cd(t,e,l,a,i){for(var n=e._reactName,u=[];l!==null&&l!==a;){var s=l,r=s.alternate,o=s.stateNode;if(s=s.tag,r!==null&&r===a)break;s!==5&&s!==26&&s!==27||o===null||(r=o,i?(o=Vi(l,n),o!=null&&u.unshift($i(l,o,r))):i||(o=Vi(l,n),o!=null&&u.push($i(l,o,r)))),l=l.return}u.length!==0&&t.push({event:e,listeners:u})}var y1=/\r\n?/g,v1=/\u0000|\uFFFD/g;function Ad(t){return(typeof t=="string"?t:""+t).replace(y1,`
`).replace(v1,"")}function vp(t,e){return e=Ad(e),Ad(t)===e}function Z(t,e,l,a,i,n){switch(l){case"children":typeof a=="string"?e==="body"||e==="textarea"&&a===""||ja(t,a):(typeof a=="number"||typeof a=="bigint")&&e!=="body"&&ja(t,""+a);break;case"className":Yn(t,"class",a);break;case"tabIndex":Yn(t,"tabindex",a);break;case"dir":case"role":case"viewBox":case"width":case"height":Yn(t,l,a);break;case"style":hm(t,a,n);break;case"data":if(e!=="object"){Yn(t,"data",a);break}case"src":case"href":if(a===""&&(e!=="a"||l!=="href")){t.removeAttribute(l);break}if(a==null||typeof a=="function"||typeof a=="symbol"||typeof a=="boolean"){t.removeAttribute(l);break}a=$n(""+a),t.setAttribute(l,a);break;case"action":case"formAction":if(typeof a=="function"){t.setAttribute(l,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof n=="function"&&(l==="formAction"?(e!=="input"&&Z(t,e,"name",i.name,i,null),Z(t,e,"formEncType",i.formEncType,i,null),Z(t,e,"formMethod",i.formMethod,i,null),Z(t,e,"formTarget",i.formTarget,i,null)):(Z(t,e,"encType",i.encType,i,null),Z(t,e,"method",i.method,i,null),Z(t,e,"target",i.target,i,null)));if(a==null||typeof a=="symbol"||typeof a=="boolean"){t.removeAttribute(l);break}a=$n(""+a),t.setAttribute(l,a);break;case"onClick":a!=null&&(t.onclick=Ye);break;case"onScroll":a!=null&&B("scroll",t);break;case"onScrollEnd":a!=null&&B("scrollend",t);break;case"dangerouslySetInnerHTML":if(a!=null){if(typeof a!="object"||!("__html"in a))throw Error(g(61));if(l=a.__html,l!=null){if(i.children!=null)throw Error(g(60));t.innerHTML=l}}break;case"multiple":t.multiple=a&&typeof a!="function"&&typeof a!="symbol";break;case"muted":t.muted=a&&typeof a!="function"&&typeof a!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(a==null||typeof a=="function"||typeof a=="boolean"||typeof a=="symbol"){t.removeAttribute("xlink:href");break}l=$n(""+a),t.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",l);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":a!=null&&typeof a!="function"&&typeof a!="symbol"?t.setAttribute(l,""+a):t.removeAttribute(l);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":a&&typeof a!="function"&&typeof a!="symbol"?t.setAttribute(l,""):t.removeAttribute(l);break;case"capture":case"download":a===!0?t.setAttribute(l,""):a!==!1&&a!=null&&typeof a!="function"&&typeof a!="symbol"?t.setAttribute(l,a):t.removeAttribute(l);break;case"cols":case"rows":case"size":case"span":a!=null&&typeof a!="function"&&typeof a!="symbol"&&!isNaN(a)&&1<=a?t.setAttribute(l,a):t.removeAttribute(l);break;case"rowSpan":case"start":a==null||typeof a=="function"||typeof a=="symbol"||isNaN(a)?t.removeAttribute(l):t.setAttribute(l,a);break;case"popover":B("beforetoggle",t),B("toggle",t),Pn(t,"popover",a);break;case"xlinkActuate":_e(t,"http://www.w3.org/1999/xlink","xlink:actuate",a);break;case"xlinkArcrole":_e(t,"http://www.w3.org/1999/xlink","xlink:arcrole",a);break;case"xlinkRole":_e(t,"http://www.w3.org/1999/xlink","xlink:role",a);break;case"xlinkShow":_e(t,"http://www.w3.org/1999/xlink","xlink:show",a);break;case"xlinkTitle":_e(t,"http://www.w3.org/1999/xlink","xlink:title",a);break;case"xlinkType":_e(t,"http://www.w3.org/1999/xlink","xlink:type",a);break;case"xmlBase":_e(t,"http://www.w3.org/XML/1998/namespace","xml:base",a);break;case"xmlLang":_e(t,"http://www.w3.org/XML/1998/namespace","xml:lang",a);break;case"xmlSpace":_e(t,"http://www.w3.org/XML/1998/namespace","xml:space",a);break;case"is":Pn(t,"is",a);break;case"innerText":case"textContent":break;default:(!(2<l.length)||l[0]!=="o"&&l[0]!=="O"||l[1]!=="n"&&l[1]!=="N")&&(l=J0.get(l)||l,Pn(t,l,a))}}function tc(t,e,l,a,i,n){switch(l){case"style":hm(t,a,n);break;case"dangerouslySetInnerHTML":if(a!=null){if(typeof a!="object"||!("__html"in a))throw Error(g(61));if(l=a.__html,l!=null){if(i.children!=null)throw Error(g(60));t.innerHTML=l}}break;case"children":typeof a=="string"?ja(t,a):(typeof a=="number"||typeof a=="bigint")&&ja(t,""+a);break;case"onScroll":a!=null&&B("scroll",t);break;case"onScrollEnd":a!=null&&B("scrollend",t);break;case"onClick":a!=null&&(t.onclick=Ye);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!rm.hasOwnProperty(l))t:{if(l[0]==="o"&&l[1]==="n"&&(i=l.endsWith("Capture"),e=l.slice(2,i?l.length-7:void 0),n=t[Bt]||null,n=n!=null?n[l]:null,typeof n=="function"&&t.removeEventListener(e,n,i),typeof a=="function")){typeof n!="function"&&n!==null&&(l in t?t[l]=null:t.hasAttribute(l)&&t.removeAttribute(l)),t.addEventListener(e,a,i);break t}l in t?t[l]=a:a===!0?t.setAttribute(l,""):Pn(t,l,a)}}}function Tt(t,e,l){switch(e){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":B("error",t),B("load",t);var a=!1,i=!1,n;for(n in l)if(l.hasOwnProperty(n)){var u=l[n];if(u!=null)switch(n){case"src":a=!0;break;case"srcSet":i=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(g(137,e));default:Z(t,e,n,u,l,null)}}i&&Z(t,e,"srcSet",l.srcSet,l,null),a&&Z(t,e,"src",l.src,l,null);return;case"input":B("invalid",t);var s=n=u=i=null,r=null,o=null;for(a in l)if(l.hasOwnProperty(a)){var h=l[a];if(h!=null)switch(a){case"name":i=h;break;case"type":u=h;break;case"checked":r=h;break;case"defaultChecked":o=h;break;case"value":n=h;break;case"defaultValue":s=h;break;case"children":case"dangerouslySetInnerHTML":if(h!=null)throw Error(g(137,e));break;default:Z(t,e,a,h,l,null)}}fm(t,n,s,r,o,u,i,!1);return;case"select":B("invalid",t),a=u=n=null;for(i in l)if(l.hasOwnProperty(i)&&(s=l[i],s!=null))switch(i){case"value":n=s;break;case"defaultValue":u=s;break;case"multiple":a=s;default:Z(t,e,i,s,l,null)}e=n,l=u,t.multiple=!!a,e!=null?Ha(t,!!a,e,!1):l!=null&&Ha(t,!!a,l,!0);return;case"textarea":B("invalid",t),n=i=a=null;for(u in l)if(l.hasOwnProperty(u)&&(s=l[u],s!=null))switch(u){case"value":a=s;break;case"defaultValue":i=s;break;case"children":n=s;break;case"dangerouslySetInnerHTML":if(s!=null)throw Error(g(91));break;default:Z(t,e,u,s,l,null)}mm(t,a,i,n);return;case"option":for(r in l)l.hasOwnProperty(r)&&(a=l[r],a!=null)&&(r==="selected"?t.selected=a&&typeof a!="function"&&typeof a!="symbol":Z(t,e,r,a,l,null));return;case"dialog":B("beforetoggle",t),B("toggle",t),B("cancel",t),B("close",t);break;case"iframe":case"object":B("load",t);break;case"video":case"audio":for(a=0;a<Pi.length;a++)B(Pi[a],t);break;case"image":B("error",t),B("load",t);break;case"details":B("toggle",t);break;case"embed":case"source":case"link":B("error",t),B("load",t);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(o in l)if(l.hasOwnProperty(o)&&(a=l[o],a!=null))switch(o){case"children":case"dangerouslySetInnerHTML":throw Error(g(137,e));default:Z(t,e,o,a,l,null)}return;default:if(yc(e)){for(h in l)l.hasOwnProperty(h)&&(a=l[h],a!==void 0&&tc(t,e,h,a,l,void 0));return}}for(s in l)l.hasOwnProperty(s)&&(a=l[s],a!=null&&Z(t,e,s,a,l,null))}function g1(t,e,l,a){switch(e){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var i=null,n=null,u=null,s=null,r=null,o=null,h=null;for(p in l){var y=l[p];if(l.hasOwnProperty(p)&&y!=null)switch(p){case"checked":break;case"value":break;case"defaultValue":r=y;default:a.hasOwnProperty(p)||Z(t,e,p,null,a,y)}}for(var d in a){var p=a[d];if(y=l[d],a.hasOwnProperty(d)&&(p!=null||y!=null))switch(d){case"type":n=p;break;case"name":i=p;break;case"checked":o=p;break;case"defaultChecked":h=p;break;case"value":u=p;break;case"defaultValue":s=p;break;case"children":case"dangerouslySetInnerHTML":if(p!=null)throw Error(g(137,e));break;default:p!==y&&Z(t,e,d,p,a,y)}}Gr(t,u,s,r,o,h,n,i);return;case"select":p=u=s=d=null;for(n in l)if(r=l[n],l.hasOwnProperty(n)&&r!=null)switch(n){case"value":break;case"multiple":p=r;default:a.hasOwnProperty(n)||Z(t,e,n,null,a,r)}for(i in a)if(n=a[i],r=l[i],a.hasOwnProperty(i)&&(n!=null||r!=null))switch(i){case"value":d=n;break;case"defaultValue":s=n;break;case"multiple":u=n;default:n!==r&&Z(t,e,i,n,a,r)}e=s,l=u,a=p,d!=null?Ha(t,!!l,d,!1):!!a!=!!l&&(e!=null?Ha(t,!!l,e,!0):Ha(t,!!l,l?[]:"",!1));return;case"textarea":p=d=null;for(s in l)if(i=l[s],l.hasOwnProperty(s)&&i!=null&&!a.hasOwnProperty(s))switch(s){case"value":break;case"children":break;default:Z(t,e,s,null,a,i)}for(u in a)if(i=a[u],n=l[u],a.hasOwnProperty(u)&&(i!=null||n!=null))switch(u){case"value":d=i;break;case"defaultValue":p=i;break;case"children":break;case"dangerouslySetInnerHTML":if(i!=null)throw Error(g(91));break;default:i!==n&&Z(t,e,u,i,a,n)}dm(t,d,p);return;case"option":for(var M in l)d=l[M],l.hasOwnProperty(M)&&d!=null&&!a.hasOwnProperty(M)&&(M==="selected"?t.selected=!1:Z(t,e,M,null,a,d));for(r in a)d=a[r],p=l[r],a.hasOwnProperty(r)&&d!==p&&(d!=null||p!=null)&&(r==="selected"?t.selected=d&&typeof d!="function"&&typeof d!="symbol":Z(t,e,r,d,a,p));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var S in l)d=l[S],l.hasOwnProperty(S)&&d!=null&&!a.hasOwnProperty(S)&&Z(t,e,S,null,a,d);for(o in a)if(d=a[o],p=l[o],a.hasOwnProperty(o)&&d!==p&&(d!=null||p!=null))switch(o){case"children":case"dangerouslySetInnerHTML":if(d!=null)throw Error(g(137,e));break;default:Z(t,e,o,d,a,p)}return;default:if(yc(e)){for(var U in l)d=l[U],l.hasOwnProperty(U)&&d!==void 0&&!a.hasOwnProperty(U)&&tc(t,e,U,void 0,a,d);for(h in a)d=a[h],p=l[h],!a.hasOwnProperty(h)||d===p||d===void 0&&p===void 0||tc(t,e,h,d,a,p);return}}for(var f in l)d=l[f],l.hasOwnProperty(f)&&d!=null&&!a.hasOwnProperty(f)&&Z(t,e,f,null,a,d);for(y in a)d=a[y],p=l[y],!a.hasOwnProperty(y)||d===p||d==null&&p==null||Z(t,e,y,d,a,p)}function zd(t){switch(t){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function b1(){if(typeof performance.getEntriesByType=="function"){for(var t=0,e=0,l=performance.getEntriesByType("resource"),a=0;a<l.length;a++){var i=l[a],n=i.transferSize,u=i.initiatorType,s=i.duration;if(n&&s&&zd(u)){for(u=0,s=i.responseEnd,a+=1;a<l.length;a++){var r=l[a],o=r.startTime;if(o>s)break;var h=r.transferSize,y=r.initiatorType;h&&zd(y)&&(r=r.responseEnd,u+=h*(r<s?1:(s-o)/(r-o)))}if(--a,e+=8*(n+u)/(i.duration/1e3),t++,10<t)break}}if(0<t)return e/t/1e6}return navigator.connection&&(t=navigator.connection.downlink,typeof t=="number")?t:5}var ec=null,lc=null;function Uu(t){return t.nodeType===9?t:t.ownerDocument}function _d(t){switch(t){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function gp(t,e){if(t===0)switch(e){case"svg":return 1;case"math":return 2;default:return 0}return t===1&&e==="foreignObject"?0:t}function ac(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.children=="bigint"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var mr=null;function M1(){var t=window.event;return t&&t.type==="popstate"?t===mr?!1:(mr=t,!0):(mr=null,!1)}var bp=typeof setTimeout=="function"?setTimeout:void 0,S1=typeof clearTimeout=="function"?clearTimeout:void 0,Rd=typeof Promise=="function"?Promise:void 0,E1=typeof queueMicrotask=="function"?queueMicrotask:typeof Rd<"u"?function(t){return Rd.resolve(null).then(t).catch(x1)}:bp;function x1(t){setTimeout(function(){throw t})}function _l(t){return t==="head"}function Dd(t,e){var l=e,a=0;do{var i=l.nextSibling;if(t.removeChild(l),i&&i.nodeType===8)if(l=i.data,l==="/$"||l==="/&"){if(a===0){t.removeChild(i),Wa(e);return}a--}else if(l==="$"||l==="$?"||l==="$~"||l==="$!"||l==="&")a++;else if(l==="html")Xi(t.ownerDocument.documentElement);else if(l==="head"){l=t.ownerDocument.head,Xi(l);for(var n=l.firstChild;n;){var u=n.nextSibling,s=n.nodeName;n[sn]||s==="SCRIPT"||s==="STYLE"||s==="LINK"&&n.rel.toLowerCase()==="stylesheet"||l.removeChild(n),n=u}}else l==="body"&&Xi(t.ownerDocument.body);l=i}while(l);Wa(e)}function Od(t,e){var l=t;t=0;do{var a=l.nextSibling;if(l.nodeType===1?e?(l._stashedDisplay=l.style.display,l.style.display="none"):(l.style.display=l._stashedDisplay||"",l.getAttribute("style")===""&&l.removeAttribute("style")):l.nodeType===3&&(e?(l._stashedText=l.nodeValue,l.nodeValue=""):l.nodeValue=l._stashedText||""),a&&a.nodeType===8)if(l=a.data,l==="/$"){if(t===0)break;t--}else l!=="$"&&l!=="$?"&&l!=="$~"&&l!=="$!"||t++;l=a}while(l)}function ic(t){var e=t.firstChild;for(e&&e.nodeType===10&&(e=e.nextSibling);e;){var l=e;switch(e=e.nextSibling,l.nodeName){case"HTML":case"HEAD":case"BODY":ic(l),pc(l);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(l.rel.toLowerCase()==="stylesheet")continue}t.removeChild(l)}}function T1(t,e,l,a){for(;t.nodeType===1;){var i=l;if(t.nodeName.toLowerCase()!==e.toLowerCase()){if(!a&&(t.nodeName!=="INPUT"||t.type!=="hidden"))break}else if(a){if(!t[sn])switch(e){case"meta":if(!t.hasAttribute("itemprop"))break;return t;case"link":if(n=t.getAttribute("rel"),n==="stylesheet"&&t.hasAttribute("data-precedence"))break;if(n!==i.rel||t.getAttribute("href")!==(i.href==null||i.href===""?null:i.href)||t.getAttribute("crossorigin")!==(i.crossOrigin==null?null:i.crossOrigin)||t.getAttribute("title")!==(i.title==null?null:i.title))break;return t;case"style":if(t.hasAttribute("data-precedence"))break;return t;case"script":if(n=t.getAttribute("src"),(n!==(i.src==null?null:i.src)||t.getAttribute("type")!==(i.type==null?null:i.type)||t.getAttribute("crossorigin")!==(i.crossOrigin==null?null:i.crossOrigin))&&n&&t.hasAttribute("async")&&!t.hasAttribute("itemprop"))break;return t;default:return t}}else if(e==="input"&&t.type==="hidden"){var n=i.name==null?null:""+i.name;if(i.type==="hidden"&&t.getAttribute("name")===n)return t}else return t;if(t=ue(t.nextSibling),t===null)break}return null}function G1(t,e,l){if(e==="")return null;for(;t.nodeType!==3;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!l||(t=ue(t.nextSibling),t===null))return null;return t}function Mp(t,e){for(;t.nodeType!==8;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!e||(t=ue(t.nextSibling),t===null))return null;return t}function nc(t){return t.data==="$?"||t.data==="$~"}function uc(t){return t.data==="$!"||t.data==="$?"&&t.ownerDocument.readyState!=="loading"}function C1(t,e){var l=t.ownerDocument;if(t.data==="$~")t._reactRetry=e;else if(t.data!=="$?"||l.readyState!=="loading")e();else{var a=function(){e(),l.removeEventListener("DOMContentLoaded",a)};l.addEventListener("DOMContentLoaded",a),t._reactRetry=a}}function ue(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?"||e==="$~"||e==="&"||e==="F!"||e==="F")break;if(e==="/$"||e==="/&")return null}}return t}var sc=null;function Nd(t){t=t.nextSibling;for(var e=0;t;){if(t.nodeType===8){var l=t.data;if(l==="/$"||l==="/&"){if(e===0)return ue(t.nextSibling);e--}else l!=="$"&&l!=="$!"&&l!=="$?"&&l!=="$~"&&l!=="&"||e++}t=t.nextSibling}return null}function Hd(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var l=t.data;if(l==="$"||l==="$!"||l==="$?"||l==="$~"||l==="&"){if(e===0)return t;e--}else l!=="/$"&&l!=="/&"||e++}t=t.previousSibling}return null}function Sp(t,e,l){switch(e=Uu(l),t){case"html":if(t=e.documentElement,!t)throw Error(g(452));return t;case"head":if(t=e.head,!t)throw Error(g(453));return t;case"body":if(t=e.body,!t)throw Error(g(454));return t;default:throw Error(g(451))}}function Xi(t){for(var e=t.attributes;e.length;)t.removeAttributeNode(e[0]);pc(t)}var se=new Map,Ud=new Set;function Bu(t){return typeof t.getRootNode=="function"?t.getRootNode():t.nodeType===9?t:t.ownerDocument}var Je=X.d;X.d={f:A1,r:z1,D:_1,C:R1,L:D1,m:O1,X:H1,S:N1,M:U1};function A1(){var t=Je.f(),e=Iu();return t||e}function z1(t){var e=$a(t);e!==null&&e.tag===5&&e.type==="form"?hh(e):Je.r(t)}var li=typeof document>"u"?null:document;function Ep(t,e,l){var a=li;if(a&&typeof e=="string"&&e){var i=le(e);i='link[rel="'+t+'"][href="'+i+'"]',typeof l=="string"&&(i+='[crossorigin="'+l+'"]'),Ud.has(i)||(Ud.add(i),t={rel:t,crossOrigin:l,href:e},a.querySelector(i)===null&&(e=a.createElement("link"),Tt(e,"link",t),gt(e),a.head.appendChild(e)))}}function _1(t){Je.D(t),Ep("dns-prefetch",t,null)}function R1(t,e){Je.C(t,e),Ep("preconnect",t,e)}function D1(t,e,l){Je.L(t,e,l);var a=li;if(a&&t&&e){var i='link[rel="preload"][as="'+le(e)+'"]';e==="image"&&l&&l.imageSrcSet?(i+='[imagesrcset="'+le(l.imageSrcSet)+'"]',typeof l.imageSizes=="string"&&(i+='[imagesizes="'+le(l.imageSizes)+'"]')):i+='[href="'+le(t)+'"]';var n=i;switch(e){case"style":n=ka(t);break;case"script":n=ai(t)}se.has(n)||(t=$({rel:"preload",href:e==="image"&&l&&l.imageSrcSet?void 0:t,as:e},l),se.set(n,t),a.querySelector(i)!==null||e==="style"&&a.querySelector(mn(n))||e==="script"&&a.querySelector(hn(n))||(e=a.createElement("link"),Tt(e,"link",t),gt(e),a.head.appendChild(e)))}}function O1(t,e){Je.m(t,e);var l=li;if(l&&t){var a=e&&typeof e.as=="string"?e.as:"script",i='link[rel="modulepreload"][as="'+le(a)+'"][href="'+le(t)+'"]',n=i;switch(a){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":n=ai(t)}if(!se.has(n)&&(t=$({rel:"modulepreload",href:t},e),se.set(n,t),l.querySelector(i)===null)){switch(a){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(l.querySelector(hn(n)))return}a=l.createElement("link"),Tt(a,"link",t),gt(a),l.head.appendChild(a)}}}function N1(t,e,l){Je.S(t,e,l);var a=li;if(a&&t){var i=Na(a).hoistableStyles,n=ka(t);e=e||"default";var u=i.get(n);if(!u){var s={loading:0,preload:null};if(u=a.querySelector(mn(n)))s.loading=5;else{t=$({rel:"stylesheet",href:t,"data-precedence":e},l),(l=se.get(n))&&to(t,l);var r=u=a.createElement("link");gt(r),Tt(r,"link",t),r._p=new Promise(function(o,h){r.onload=o,r.onerror=h}),r.addEventListener("load",function(){s.loading|=1}),r.addEventListener("error",function(){s.loading|=2}),s.loading|=4,ru(u,e,a)}u={type:"stylesheet",instance:u,count:1,state:s},i.set(n,u)}}}function H1(t,e){Je.X(t,e);var l=li;if(l&&t){var a=Na(l).hoistableScripts,i=ai(t),n=a.get(i);n||(n=l.querySelector(hn(i)),n||(t=$({src:t,async:!0},e),(e=se.get(i))&&eo(t,e),n=l.createElement("script"),gt(n),Tt(n,"link",t),l.head.appendChild(n)),n={type:"script",instance:n,count:1,state:null},a.set(i,n))}}function U1(t,e){Je.M(t,e);var l=li;if(l&&t){var a=Na(l).hoistableScripts,i=ai(t),n=a.get(i);n||(n=l.querySelector(hn(i)),n||(t=$({src:t,async:!0,type:"module"},e),(e=se.get(i))&&eo(t,e),n=l.createElement("script"),gt(n),Tt(n,"link",t),l.head.appendChild(n)),n={type:"script",instance:n,count:1,state:null},a.set(i,n))}}function Bd(t,e,l,a){var i=(i=pl.current)?Bu(i):null;if(!i)throw Error(g(446));switch(t){case"meta":case"title":return null;case"style":return typeof l.precedence=="string"&&typeof l.href=="string"?(e=ka(l.href),l=Na(i).hoistableStyles,a=l.get(e),a||(a={type:"style",instance:null,count:0,state:null},l.set(e,a)),a):{type:"void",instance:null,count:0,state:null};case"link":if(l.rel==="stylesheet"&&typeof l.href=="string"&&typeof l.precedence=="string"){t=ka(l.href);var n=Na(i).hoistableStyles,u=n.get(t);if(u||(i=i.ownerDocument||i,u={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},n.set(t,u),(n=i.querySelector(mn(t)))&&!n._p&&(u.instance=n,u.state.loading=5),se.has(t)||(l={rel:"preload",as:"style",href:l.href,crossOrigin:l.crossOrigin,integrity:l.integrity,media:l.media,hrefLang:l.hrefLang,referrerPolicy:l.referrerPolicy},se.set(t,l),n||B1(i,t,l,u.state))),e&&a===null)throw Error(g(528,""));return u}if(e&&a!==null)throw Error(g(529,""));return null;case"script":return e=l.async,l=l.src,typeof l=="string"&&e&&typeof e!="function"&&typeof e!="symbol"?(e=ai(l),l=Na(i).hoistableScripts,a=l.get(e),a||(a={type:"script",instance:null,count:0,state:null},l.set(e,a)),a):{type:"void",instance:null,count:0,state:null};default:throw Error(g(444,t))}}function ka(t){return'href="'+le(t)+'"'}function mn(t){return'link[rel="stylesheet"]['+t+"]"}function xp(t){return $({},t,{"data-precedence":t.precedence,precedence:null})}function B1(t,e,l,a){t.querySelector('link[rel="preload"][as="style"]['+e+"]")?a.loading=1:(e=t.createElement("link"),a.preload=e,e.addEventListener("load",function(){return a.loading|=1}),e.addEventListener("error",function(){return a.loading|=2}),Tt(e,"link",l),gt(e),t.head.appendChild(e))}function ai(t){return'[src="'+le(t)+'"]'}function hn(t){return"script[async]"+t}function Yd(t,e,l){if(e.count++,e.instance===null)switch(e.type){case"style":var a=t.querySelector('style[data-href~="'+le(l.href)+'"]');if(a)return e.instance=a,gt(a),a;var i=$({},l,{"data-href":l.href,"data-precedence":l.precedence,href:null,precedence:null});return a=(t.ownerDocument||t).createElement("style"),gt(a),Tt(a,"style",i),ru(a,l.precedence,t),e.instance=a;case"stylesheet":i=ka(l.href);var n=t.querySelector(mn(i));if(n)return e.state.loading|=4,e.instance=n,gt(n),n;a=xp(l),(i=se.get(i))&&to(a,i),n=(t.ownerDocument||t).createElement("link"),gt(n);var u=n;return u._p=new Promise(function(s,r){u.onload=s,u.onerror=r}),Tt(n,"link",a),e.state.loading|=4,ru(n,l.precedence,t),e.instance=n;case"script":return n=ai(l.src),(i=t.querySelector(hn(n)))?(e.instance=i,gt(i),i):(a=l,(i=se.get(n))&&(a=$({},l),eo(a,i)),t=t.ownerDocument||t,i=t.createElement("script"),gt(i),Tt(i,"link",a),t.head.appendChild(i),e.instance=i);case"void":return null;default:throw Error(g(443,e.type))}else e.type==="stylesheet"&&(e.state.loading&4)===0&&(a=e.instance,e.state.loading|=4,ru(a,l.precedence,t));return e.instance}function ru(t,e,l){for(var a=l.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),i=a.length?a[a.length-1]:null,n=i,u=0;u<a.length;u++){var s=a[u];if(s.dataset.precedence===e)n=s;else if(n!==i)break}n?n.parentNode.insertBefore(t,n.nextSibling):(e=l.nodeType===9?l.head:l,e.insertBefore(t,e.firstChild))}function to(t,e){t.crossOrigin==null&&(t.crossOrigin=e.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=e.referrerPolicy),t.title==null&&(t.title=e.title)}function eo(t,e){t.crossOrigin==null&&(t.crossOrigin=e.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=e.referrerPolicy),t.integrity==null&&(t.integrity=e.integrity)}var cu=null;function wd(t,e,l){if(cu===null){var a=new Map,i=cu=new Map;i.set(l,a)}else i=cu,a=i.get(l),a||(a=new Map,i.set(l,a));if(a.has(t))return a;for(a.set(t,null),l=l.getElementsByTagName(t),i=0;i<l.length;i++){var n=l[i];if(!(n[sn]||n[St]||t==="link"&&n.getAttribute("rel")==="stylesheet")&&n.namespaceURI!=="http://www.w3.org/2000/svg"){var u=n.getAttribute(e)||"";u=t+u;var s=a.get(u);s?s.push(n):a.set(u,[n])}}return a}function qd(t,e,l){t=t.ownerDocument||t,t.head.insertBefore(l,e==="title"?t.querySelector("head > title"):null)}function Y1(t,e,l){if(l===1||e.itemProp!=null)return!1;switch(t){case"meta":case"title":return!0;case"style":if(typeof e.precedence!="string"||typeof e.href!="string"||e.href==="")break;return!0;case"link":if(typeof e.rel!="string"||typeof e.href!="string"||e.href===""||e.onLoad||e.onError)break;return e.rel==="stylesheet"?(t=e.disabled,typeof e.precedence=="string"&&t==null):!0;case"script":if(e.async&&typeof e.async!="function"&&typeof e.async!="symbol"&&!e.onLoad&&!e.onError&&e.src&&typeof e.src=="string")return!0}return!1}function Tp(t){return!(t.type==="stylesheet"&&(t.state.loading&3)===0)}function w1(t,e,l,a){if(l.type==="stylesheet"&&(typeof a.media!="string"||matchMedia(a.media).matches!==!1)&&(l.state.loading&4)===0){if(l.instance===null){var i=ka(a.href),n=e.querySelector(mn(i));if(n){e=n._p,e!==null&&typeof e=="object"&&typeof e.then=="function"&&(t.count++,t=Yu.bind(t),e.then(t,t)),l.state.loading|=4,l.instance=n,gt(n);return}n=e.ownerDocument||e,a=xp(a),(i=se.get(i))&&to(a,i),n=n.createElement("link"),gt(n);var u=n;u._p=new Promise(function(s,r){u.onload=s,u.onerror=r}),Tt(n,"link",a),l.instance=n}t.stylesheets===null&&(t.stylesheets=new Map),t.stylesheets.set(l,e),(e=l.state.preload)&&(l.state.loading&3)===0&&(t.count++,l=Yu.bind(t),e.addEventListener("load",l),e.addEventListener("error",l))}}var hr=0;function q1(t,e){return t.stylesheets&&t.count===0&&ou(t,t.stylesheets),0<t.count||0<t.imgCount?function(l){var a=setTimeout(function(){if(t.stylesheets&&ou(t,t.stylesheets),t.unsuspend){var n=t.unsuspend;t.unsuspend=null,n()}},6e4+e);0<t.imgBytes&&hr===0&&(hr=62500*b1());var i=setTimeout(function(){if(t.waitingForImages=!1,t.count===0&&(t.stylesheets&&ou(t,t.stylesheets),t.unsuspend)){var n=t.unsuspend;t.unsuspend=null,n()}},(t.imgBytes>hr?50:800)+e);return t.unsuspend=l,function(){t.unsuspend=null,clearTimeout(a),clearTimeout(i)}}:null}function Yu(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)ou(this,this.stylesheets);else if(this.unsuspend){var t=this.unsuspend;this.unsuspend=null,t()}}}var wu=null;function ou(t,e){t.stylesheets=null,t.unsuspend!==null&&(t.count++,wu=new Map,e.forEach(L1,t),wu=null,Yu.call(t))}function L1(t,e){if(!(e.state.loading&4)){var l=wu.get(t);if(l)var a=l.get(null);else{l=new Map,wu.set(t,l);for(var i=t.querySelectorAll("link[data-precedence],style[data-precedence]"),n=0;n<i.length;n++){var u=i[n];(u.nodeName==="LINK"||u.getAttribute("media")!=="not all")&&(l.set(u.dataset.precedence,u),a=u)}a&&l.set(null,a)}i=e.instance,u=i.getAttribute("data-precedence"),n=l.get(u)||a,n===a&&l.set(null,i),l.set(u,i),this.count++,a=Yu.bind(this),i.addEventListener("load",a),i.addEventListener("error",a),n?n.parentNode.insertBefore(i,n.nextSibling):(t=t.nodeType===9?t.head:t,t.insertBefore(i,t.firstChild)),e.state.loading|=4}}var Ii={$$typeof:Be,Provider:null,Consumer:null,_currentValue:Vl,_currentValue2:Vl,_threadCount:0};function X1(t,e,l,a,i,n,u,s,r){this.tag=1,this.containerInfo=t,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=Ls(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Ls(0),this.hiddenUpdates=Ls(null),this.identifierPrefix=a,this.onUncaughtError=i,this.onCaughtError=n,this.onRecoverableError=u,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=r,this.incompleteTransitions=new Map}function Gp(t,e,l,a,i,n,u,s,r,o,h,y){return t=new X1(t,e,l,u,r,o,h,y,s),e=1,n===!0&&(e|=24),n=Xt(3,null,null,e),t.current=n,n.stateNode=t,e=Ac(),e.refCount++,t.pooledCache=e,e.refCount++,n.memoizedState={element:a,isDehydrated:l,cache:e},Rc(n),t}function Cp(t){return t?(t=_a,t):_a}function Ap(t,e,l,a,i,n){i=Cp(i),a.context===null?a.context=i:a.pendingContext=i,a=vl(e),a.payload={element:l},n=n===void 0?null:n,n!==null&&(a.callback=n),l=gl(t,a,e),l!==null&&(Ut(l,t,e),Ni(l,t,e))}function Ld(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var l=t.retryLane;t.retryLane=l!==0&&l<e?l:e}}function lo(t,e){Ld(t,e),(t=t.alternate)&&Ld(t,e)}function zp(t){if(t.tag===13||t.tag===31){var e=la(t,67108864);e!==null&&Ut(e,t,67108864),lo(t,67108864)}}function Xd(t){if(t.tag===13||t.tag===31){var e=Kt();e=mc(e);var l=la(t,e);l!==null&&Ut(l,t,e),lo(t,e)}}var qu=!0;function j1(t,e,l,a){var i=A.T;A.T=null;var n=X.p;try{X.p=2,ao(t,e,l,a)}finally{X.p=n,A.T=i}}function V1(t,e,l,a){var i=A.T;A.T=null;var n=X.p;try{X.p=8,ao(t,e,l,a)}finally{X.p=n,A.T=i}}function ao(t,e,l,a){if(qu){var i=rc(a);if(i===null)dr(t,e,a,Lu,l),jd(t,a);else if(Z1(i,t,e,l,a))a.stopPropagation();else if(jd(t,a),e&4&&-1<Q1.indexOf(t)){for(;i!==null;){var n=$a(i);if(n!==null)switch(n.tag){case 3:if(n=n.stateNode,n.current.memoizedState.isDehydrated){var u=Ll(n.pendingLanes);if(u!==0){var s=n;for(s.pendingLanes|=2,s.entangledLanes|=2;u;){var r=1<<31-Zt(u);s.entanglements[1]|=r,u&=~r}Me(n),(L&6)===0&&(_u=Vt()+500,dn(0,!1))}}break;case 31:case 13:s=la(n,2),s!==null&&Ut(s,n,2),Iu(),lo(n,2)}if(n=rc(a),n===null&&dr(t,e,a,Lu,l),n===i)break;i=n}i!==null&&a.stopPropagation()}else dr(t,e,a,null,l)}}function rc(t){return t=vc(t),io(t)}var Lu=null;function io(t){if(Lu=null,t=xa(t),t!==null){var e=ln(t);if(e===null)t=null;else{var l=e.tag;if(l===13){if(t=Fd(e),t!==null)return t;t=null}else if(l===31){if(t=kd(e),t!==null)return t;t=null}else if(l===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null)}}return Lu=t,null}function _p(t){switch(t){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(D0()){case Id:return 2;case tm:return 8;case pu:case O0:return 32;case em:return 268435456;default:return 32}default:return 32}}var cc=!1,Sl=null,El=null,xl=null,tn=new Map,en=new Map,cl=[],Q1="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function jd(t,e){switch(t){case"focusin":case"focusout":Sl=null;break;case"dragenter":case"dragleave":El=null;break;case"mouseover":case"mouseout":xl=null;break;case"pointerover":case"pointerout":tn.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":en.delete(e.pointerId)}}function Ei(t,e,l,a,i,n){return t===null||t.nativeEvent!==n?(t={blockedOn:e,domEventName:l,eventSystemFlags:a,nativeEvent:n,targetContainers:[i]},e!==null&&(e=$a(e),e!==null&&zp(e)),t):(t.eventSystemFlags|=a,e=t.targetContainers,i!==null&&e.indexOf(i)===-1&&e.push(i),t)}function Z1(t,e,l,a,i){switch(e){case"focusin":return Sl=Ei(Sl,t,e,l,a,i),!0;case"dragenter":return El=Ei(El,t,e,l,a,i),!0;case"mouseover":return xl=Ei(xl,t,e,l,a,i),!0;case"pointerover":var n=i.pointerId;return tn.set(n,Ei(tn.get(n)||null,t,e,l,a,i)),!0;case"gotpointercapture":return n=i.pointerId,en.set(n,Ei(en.get(n)||null,t,e,l,a,i)),!0}return!1}function Rp(t){var e=xa(t.target);if(e!==null){var l=ln(e);if(l!==null){if(e=l.tag,e===13){if(e=Fd(l),e!==null){t.blockedOn=e,Gf(t.priority,function(){Xd(l)});return}}else if(e===31){if(e=kd(l),e!==null){t.blockedOn=e,Gf(t.priority,function(){Xd(l)});return}}else if(e===3&&l.stateNode.current.memoizedState.isDehydrated){t.blockedOn=l.tag===3?l.stateNode.containerInfo:null;return}}}t.blockedOn=null}function fu(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var l=rc(t.nativeEvent);if(l===null){l=t.nativeEvent;var a=new l.constructor(l.type,l);Ar=a,l.target.dispatchEvent(a),Ar=null}else return e=$a(l),e!==null&&zp(e),t.blockedOn=l,!1;e.shift()}return!0}function Vd(t,e,l){fu(t)&&l.delete(e)}function K1(){cc=!1,Sl!==null&&fu(Sl)&&(Sl=null),El!==null&&fu(El)&&(El=null),xl!==null&&fu(xl)&&(xl=null),tn.forEach(Vd),en.forEach(Vd)}function kn(t,e){t.blockedOn===e&&(t.blockedOn=null,cc||(cc=!0,pt.unstable_scheduleCallback(pt.unstable_NormalPriority,K1)))}var Wn=null;function Qd(t){Wn!==t&&(Wn=t,pt.unstable_scheduleCallback(pt.unstable_NormalPriority,function(){Wn===t&&(Wn=null);for(var e=0;e<t.length;e+=3){var l=t[e],a=t[e+1],i=t[e+2];if(typeof a!="function"){if(io(a||l)===null)continue;break}var n=$a(l);n!==null&&(t.splice(e,3),e-=3,Vr(n,{pending:!0,data:i,method:l.method,action:a},a,i))}}))}function Wa(t){function e(r){return kn(r,t)}Sl!==null&&kn(Sl,t),El!==null&&kn(El,t),xl!==null&&kn(xl,t),tn.forEach(e),en.forEach(e);for(var l=0;l<cl.length;l++){var a=cl[l];a.blockedOn===t&&(a.blockedOn=null)}for(;0<cl.length&&(l=cl[0],l.blockedOn===null);)Rp(l),l.blockedOn===null&&cl.shift();if(l=(t.ownerDocument||t).$$reactFormReplay,l!=null)for(a=0;a<l.length;a+=3){var i=l[a],n=l[a+1],u=i[Bt]||null;if(typeof n=="function")u||Qd(l);else if(u){var s=null;if(n&&n.hasAttribute("formAction")){if(i=n,u=n[Bt]||null)s=u.formAction;else if(io(i)!==null)continue}else s=u.action;typeof s=="function"?l[a+1]=s:(l.splice(a,3),a-=3),Qd(l)}}}function Dp(){function t(n){n.canIntercept&&n.info==="react-transition"&&n.intercept({handler:function(){return new Promise(function(u){return i=u})},focusReset:"manual",scroll:"manual"})}function e(){i!==null&&(i(),i=null),a||setTimeout(l,20)}function l(){if(!a&&!navigation.transition){var n=navigation.currentEntry;n&&n.url!=null&&navigation.navigate(n.url,{state:n.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var a=!1,i=null;return navigation.addEventListener("navigate",t),navigation.addEventListener("navigatesuccess",e),navigation.addEventListener("navigateerror",e),setTimeout(l,100),function(){a=!0,navigation.removeEventListener("navigate",t),navigation.removeEventListener("navigatesuccess",e),navigation.removeEventListener("navigateerror",e),i!==null&&(i(),i=null)}}}function no(t){this._internalRoot=t}ls.prototype.render=no.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(g(409));var l=e.current,a=Kt();Ap(l,a,t,e,null,null)};ls.prototype.unmount=no.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;Ap(t.current,2,null,t,null,null),Iu(),e[Pa]=null}};function ls(t){this._internalRoot=t}ls.prototype.unstable_scheduleHydration=function(t){if(t){var e=um();t={blockedOn:null,target:t,priority:e};for(var l=0;l<cl.length&&e!==0&&e<cl[l].priority;l++);cl.splice(l,0,t),l===0&&Rp(t)}};var Zd=Kd.version;if(Zd!=="19.2.7")throw Error(g(527,Zd,"19.2.7"));X.findDOMNode=function(t){var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(g(188)):(t=Object.keys(t).join(","),Error(g(268,t)));return t=T0(e),t=t!==null?Wd(t):null,t=t===null?null:t.stateNode,t};var J1={bundleType:0,version:"19.2.7",rendererPackageName:"react-dom",currentDispatcherRef:A,reconcilerVersion:"19.2.7"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&(xi=__REACT_DEVTOOLS_GLOBAL_HOOK__,!xi.isDisabled&&xi.supportsFiber))try{an=xi.inject(J1),Qt=xi}catch{}var xi;as.createRoot=function(t,e){if(!Jd(t))throw Error(g(299));var l=!1,a="",i=Eh,n=xh,u=Th;return e!=null&&(e.unstable_strictMode===!0&&(l=!0),e.identifierPrefix!==void 0&&(a=e.identifierPrefix),e.onUncaughtError!==void 0&&(i=e.onUncaughtError),e.onCaughtError!==void 0&&(n=e.onCaughtError),e.onRecoverableError!==void 0&&(u=e.onRecoverableError)),e=Gp(t,1,!1,null,null,l,a,null,i,n,u,Dp),t[Pa]=e.current,Ic(t),new no(e)};as.hydrateRoot=function(t,e,l){if(!Jd(t))throw Error(g(299));var a=!1,i="",n=Eh,u=xh,s=Th,r=null;return l!=null&&(l.unstable_strictMode===!0&&(a=!0),l.identifierPrefix!==void 0&&(i=l.identifierPrefix),l.onUncaughtError!==void 0&&(n=l.onUncaughtError),l.onCaughtError!==void 0&&(u=l.onCaughtError),l.onRecoverableError!==void 0&&(s=l.onRecoverableError),l.formState!==void 0&&(r=l.formState)),e=Gp(t,1,!0,e,l??null,a,i,r,n,u,s,Dp),e.context=Cp(null),l=e.current,a=Kt(),a=mc(a),i=vl(a),i.callback=null,gl(l,i,a),l=a,e.current.lanes=l,un(e,l),Me(e),t[Pa]=e.current,Ic(t),new ls(e)};as.version="19.2.7"});var Up=me((Fg,Hp)=>{"use strict";function Np(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Np)}catch(t){console.error(t)}}Np(),Hp.exports=Op()});var qp=me(ns=>{"use strict";var k1=Symbol.for("react.transitional.element"),W1=Symbol.for("react.fragment");function wp(t,e,l){var a=null;if(l!==void 0&&(a=""+l),e.key!==void 0&&(a=""+e.key),"key"in e){l={};for(var i in e)i!=="key"&&(l[i]=e[i])}else l=e;return e=l.ref,{$$typeof:k1,type:t,key:a,ref:e!==void 0?e:null,props:l}}ns.Fragment=W1;ns.jsx=wp;ns.jsxs=wp});var Rt=me((Pg,Lp)=>{"use strict";Lp.exports=qp()});var ky=mt(Up(),1);var de=mt(Yl(),1);var et=mt(Yl(),1);function Bp(t){return`${t.x}:${t.y}`}function Yp(t,e,l,a,i){return a<1||i<1||l.width<=0||l.height<=0||t<l.left||e<l.top||t>=l.left+l.width||e>=l.top+l.height?null:{x:Math.min(a-1,Math.floor((t-l.left)/l.width*a)),y:Math.min(i-1,Math.floor((e-l.top)/l.height*i))}}var is=class{activeTiles=new Map;visitedTiles=new Set;lastTile=null;paintMode=null;begin(e){return this.visitedTiles.clear(),this.paintMode=this.activeTiles.has(Bp(e))?"release":"press",this.lastTile=e,this.apply(e)}move(e){if(!this.paintMode)return[];let l=F1(this.lastTile??e,e).flatMap(a=>this.apply(a));return this.lastTile=e,l}end(){this.lastTile=null,this.paintMode=null,this.visitedTiles.clear()}reset(){this.end(),this.activeTiles.clear()}keys(){return[...this.activeTiles.keys()]}apply(e){let l=Bp(e);if(!this.paintMode||this.visitedTiles.has(l))return[];this.visitedTiles.add(l);let a=this.paintMode==="press";return a?this.activeTiles.set(l,e):this.activeTiles.delete(l),[{...e,pressed:a}]}};function F1(t,e){let l=[],a=t.x,i=t.y,n=Math.abs(e.x-t.x),u=t.x<e.x?1:-1,s=-Math.abs(e.y-t.y),r=t.y<e.y?1:-1,o=n+s;for(;;){if(l.push({x:a,y:i}),a===e.x&&i===e.y)return l;let h=o*2;h>=s&&(o+=s,a+=u),h<=n&&(o+=n,i+=r)}}var ii=mt(Rt(),1),uo=mt(Yl(),1);function ia({frame:t,label:e="Vista del suelo",className:l=""}){return(0,ii.jsxs)("section",{className:`ml-frame-preview-panel ${l}`.trim(),children:[(0,ii.jsx)("span",{children:e}),(0,ii.jsx)(Xp,{frame:t})]})}function Xp({frame:t,interactive:e=!1,inputResetKey:l,onTilePress:a,onTileRelease:i,className:n=""}){let u=(0,et.useRef)(null),s=(0,et.useRef)(null),r=(0,et.useRef)(new is),o=(0,et.useRef)(l),[h,y]=(0,et.useState)(()=>new Set),d={"--ml-floor-cols":t.width,"--ml-floor-rows":t.height},p=`ml-floor-preview ${e?"ml-floor-interactive":""} ${n}`.trim(),M=(0,et.useCallback)(()=>{let b=document.activeElement;b instanceof HTMLElement&&u.current?.contains(b)&&b.blur()},[]),S=(0,et.useCallback)((b,z)=>{let yt=u.current;return yt?Yp(b,z,yt.getBoundingClientRect(),t.width,t.height):null},[t.height,t.width]),U=(0,et.useCallback)(b=>{if(b.length!==0){for(let z of b)z.pressed?a?.(z.x,z.y):i?.(z.x,z.y);y(new Set(r.current.keys()))}},[a,i]),f=(0,et.useCallback)(b=>{!b||Number.isNaN(b.x)||Number.isNaN(b.y)||U(r.current.begin(b))},[U]),c=(0,et.useCallback)(b=>{!b||Number.isNaN(b.x)||Number.isNaN(b.y)||U(r.current.move(b))},[U]),m=(0,et.useCallback)(()=>{r.current.reset(),y(new Set)},[]);(0,et.useEffect)(()=>{Object.is(o.current,l)||(o.current=l,m())},[m,l]),(0,et.useEffect)(()=>{e||m()},[m,e]),(0,et.useEffect)(()=>{if(!e)return;let b=()=>{s.current=null,r.current.end()},z=()=>{document.hidden&&b()};return window.addEventListener("blur",b),window.addEventListener("pointercancel",b),window.addEventListener("pointerup",b),document.addEventListener("visibilitychange",z),()=>{window.removeEventListener("blur",b),window.removeEventListener("pointercancel",b),window.removeEventListener("pointerup",b),document.removeEventListener("visibilitychange",z)}},[e]);let v=(0,et.useCallback)(b=>{!e||b.button!==0||(b.preventDefault(),M(),s.current=b.pointerId,u.current?.setPointerCapture(b.pointerId),f(S(b.clientX,b.clientY)))},[f,M,e,S]),T=(0,et.useCallback)(b=>{!e||s.current!==b.pointerId||(b.preventDefault(),c(S(b.clientX,b.clientY)))},[c,e,S]),H=(0,et.useCallback)(b=>{!e||s.current!==b.pointerId||(c(S(b.clientX,b.clientY)),s.current=null,r.current.end(),M(),u.current?.hasPointerCapture(b.pointerId)&&u.current.releasePointerCapture(b.pointerId))},[M,c,e,S]),E=(0,et.useCallback)(()=>{s.current=null,r.current.end(),M()},[M]),R=(0,et.useCallback)(b=>{U(r.current.begin(b)),r.current.end()},[U]);return(0,ii.jsx)("div",{className:p,onLostPointerCapture:E,onPointerCancel:H,onPointerDown:v,onPointerMove:T,onPointerUp:H,ref:u,style:d,role:"grid","aria-label":"Vista del suelo",children:t.cells.map(b=>{let z={backgroundColor:b.color,gridColumnStart:b.x+1,gridRowStart:b.y+1},yt=`${b.x}-${b.y}`,fa=h.has(`${b.x}:${b.y}`),Qo={className:"ml-floor-tile",style:z,"data-tile-x":b.x,"data-tile-y":b.y,"data-color":b.color};return e?(0,uo.createElement)("button",{...Qo,"aria-label":`Baldosa ${b.x}, ${b.y}`,"aria-pressed":fa,key:yt,onClick:Wy=>{Wy.detail===0&&R(b)},type:"button"}):(0,uo.createElement)("span",{...Qo,"aria-hidden":"true",key:yt})})})}var x=mt(Rt(),1),P1={ready:"Listo",waiting:"En espera",starting:"Preparados",running:"En juego",paused:"En pausa",finished:"Terminado"};function $1(t){return P1[t]??t}var Vp=(0,de.createContext)({paused:!1});function Qp({paused:t,children:e}){return(0,x.jsx)(Vp.Provider,{value:{paused:t},children:e})}function Rl({title:t,phase:e,variant:l="default",children:a}){let n=(0,de.useContext)(Vp).paused,u=n?"paused":e;return(0,x.jsxs)("section",{className:`ml-display-shell ml-tv-display ml-tv-display-${l}${n?" is-paused":""}`,"aria-label":`Pantalla de ${t}`,"data-paused":n||void 0,children:[(0,x.jsxs)("header",{className:"ml-display-header ml-tv-header",children:[(0,x.jsxs)("div",{className:"ml-tv-brand","aria-hidden":"true",children:[(0,x.jsx)("span",{className:"ml-tv-brand-mark"}),(0,x.jsxs)("span",{className:"ml-tv-brand-name",children:[(0,x.jsx)("b",{children:"Motion"}),(0,x.jsx)("b",{children:"Levels"})]})]}),(0,x.jsxs)("div",{className:"ml-tv-title",children:[(0,x.jsx)("span",{className:"ml-display-label",children:"Juego"}),(0,x.jsx)("h1",{children:t})]}),(0,x.jsx)("span",{className:`ml-status-pill ml-status-${u}`,children:$1(u)})]}),(0,x.jsx)("div",{className:"ml-display-content",children:a})]})}function ni({snapshot:t}){if(t.phase!=="waiting"&&t.phase!=="starting")return null;let e=t.readyPlayers??0,l=Math.max(t.requiredPlayers??t.playerCount,1),a=t.phase==="starting",i=Math.max(1,Math.ceil((t.countdownMillis??0)/1e3));return(0,x.jsxs)("section",{"aria-label":a?"El juego est\xE1 a punto de empezar":"Esperando jugadores",className:`ml-player-ready-overlay is-${t.phase}`,children:[(0,x.jsxs)("div",{className:"ml-player-ready-pulse","aria-hidden":"true",children:[(0,x.jsx)("i",{}),(0,x.jsx)("i",{}),(0,x.jsx)("i",{})]}),(0,x.jsx)("span",{children:a?"Todos listos":"Esperando jugadores"}),(0,x.jsx)("strong",{children:a?i:`${e}/${l}`}),(0,x.jsx)("b",{children:a?"El juego est\xE1 a punto de empezar":"Entra y permanece en la zona iluminada"})]})}function ft({label:t,value:e,tone:l="cyan",className:a=""}){return(0,x.jsxs)("article",{className:`ml-metric ml-metric-${l} ${a}`.trim(),children:[(0,x.jsx)("span",{className:"ml-metric-label",children:t}),(0,x.jsx)("strong",{className:"ml-metric-value",children:e})]})}function ui({className:t="",lives:e,maxLives:l}){let a=Math.max(0,Math.trunc(l)),i=Math.min(a,Math.max(0,Math.trunc(e))),n=(0,de.useRef)(i),u=(0,de.useRef)(0),[s,r]=(0,de.useState)(null);return(0,de.useEffect)(()=>{let o=n.current;if(n.current=i,o===i)return;u.current+=1;let h={from:o,id:u.current,to:i};r(h);let y=window.setTimeout(()=>{r(d=>d?.id===h.id?null:d)},1100);return()=>window.clearTimeout(y)},[i]),(0,x.jsx)("div",{"aria-label":`${i} de ${a} vidas restantes`,className:`ml-lives-meter ${t}`.trim(),role:"img",children:Array.from({length:a},(o,h)=>{let y=h<i,p=s&&h>=Math.min(s.from,s.to)&&h<Math.max(s.from,s.to)?s.to>s.from?"is-regained":"is-losing":"";return(0,x.jsx)("span",{"aria-hidden":"true",className:`ml-life-heart ${y?"is-remaining":"is-lost"} ${p}`.trim(),"data-life-change":p||void 0,"data-life-state":y?"remaining":"lost",style:{"--ml-heart-index":h},children:(0,x.jsx)("span",{className:"ml-life-heart-glyph",children:"\u2665"})},h)})})}function Dl({children:t,columns:e=3,className:l=""}){return(0,x.jsx)("section",{className:`ml-metric-row ${l}`.trim(),style:{"--ml-metric-columns":e},children:t})}function Zp({left:t,right:e,target:l,centerLabel:a,centerValue:i,centerCaption:n="",className:u=""}){return(0,x.jsxs)("section",{className:`ml-versus-scoreboard ${u}`.trim(),"aria-label":"Marcador",children:[(0,x.jsx)(jp,{player:t,side:"red",target:l}),(0,x.jsxs)("article",{className:"ml-versus-center",children:[(0,x.jsx)("span",{children:a}),(0,x.jsx)("strong",{children:i}),n?(0,x.jsx)("b",{children:n}):null]}),(0,x.jsx)(jp,{player:e,side:"blue",target:l})]})}function jp({player:t,side:e,target:l}){let a=Math.max(0,Math.min(1,t.score/Math.max(l,1)));return(0,x.jsxs)("article",{className:`ml-player-score-panel ml-player-score-${e}`,style:{"--ml-player":t.color,"--ml-player-rgb":I1(t.color),"--ml-score-progress":a},children:[(0,x.jsxs)("div",{className:"ml-player-score-head",children:[(0,x.jsx)("span",{children:t.label}),(0,x.jsxs)("b",{children:[t.score,"/",l]})]}),(0,x.jsx)("strong",{children:t.score}),(0,x.jsx)("div",{className:"ml-player-score-track","aria-hidden":"true",children:(0,x.jsx)("i",{})})]})}function Kp({rounds:t,totalRounds:e,activeRound:l,activeLabel:a="Ronda actual",activeCaption:i="Punto en curso",fallbackLabel:n="Pendiente",className:u=""}){let s=Math.max(t.length,e??0,1),r=new Map(t.map(c=>[c.index,c])),o=Array.from({length:s},(c,m)=>{let v=m+1;return r.get(v)??{index:v,winnerLabel:n,hits:0}}),h=t.length<s?t.length+1:null,y=l===void 0?h:l,d=y??Math.max(t.length,1),p=12,M=Math.min(Math.max(0,d-Math.ceil(p/2)),Math.max(0,s-p)),S=o.slice(M,M+p),U=s>S.length?`Rondas ${S[0]?.index}-${S.at(-1)?.index} de ${s}`:"Historial del partido",f={"--ml-round-count":S.length,"--ml-round-progress":`${Math.min(1,t.length/s)*100}%`};return(0,x.jsxs)("section",{className:`ml-round-strip ${u}`.trim(),"aria-label":"Rondas",style:f,children:[(0,x.jsxs)("div",{className:"ml-round-strip-head",children:[(0,x.jsxs)("div",{className:"ml-round-strip-title",children:[(0,x.jsx)("span",{children:"Rondas"}),(0,x.jsx)("small",{children:U})]}),(0,x.jsxs)("div",{className:"ml-round-strip-count","aria-label":`${t.length} de ${s} rondas jugadas`,children:[(0,x.jsx)("strong",{children:t.length}),(0,x.jsxs)("span",{children:["de ",s]})]})]}),(0,x.jsx)("div",{className:"ml-round-progress","aria-hidden":"true",children:(0,x.jsx)("i",{})}),(0,x.jsx)("div",{className:"ml-round-list",children:S.map(c=>{let m=c.winnerIndex===0||c.winnerIndex===1,v=!m&&c.index===y,T=c.winnerIndex===0?"is-red":c.winnerIndex===1?"is-blue":v?"is-current":"is-pending",H=c.hits??0;return(0,x.jsxs)("article",{className:`ml-round-card ${T}`,children:[(0,x.jsxs)("div",{className:"ml-round-card-head",children:[(0,x.jsxs)("span",{children:["R",c.index]}),(0,x.jsx)("i",{"aria-hidden":"true"})]}),(0,x.jsx)("strong",{children:m?c.winnerLabel||n:v?a:n}),m?(0,x.jsxs)("b",{children:[H," ",H===1?"golpe":"golpes"]}):null,v?(0,x.jsx)("b",{children:i}):null]},c.index)})})]})}function I1(t){let e=t.replace("#","").trim(),l=e.length===3?e.split("").map(i=>i+i).join(""):e.padEnd(6,"0").slice(0,6),a=Number.parseInt(l,16);return Number.isFinite(a)?`${a>>16&255}, ${a>>8&255}, ${a&255}`:"255, 255, 255"}var go={};An(go,{PlayerDisplay:()=>ey,arkanoidConfigVars:()=>vn,ballColor:()=>po,brickColors:()=>vo,createGame:()=>gn,finishedFrame:()=>ry,finishedSnapshot:()=>cy,initEvents:()=>ny,manifest:()=>xe,paddleColor:()=>yo,runningFrame:()=>uy,runningSnapshot:()=>sy});function so(t,e){let l=e.centerX??(t.width-1)/2,a=e.centerY??(t.height-1)/2,i=Math.max(0,e.radius),n=Math.max(0,e.thickness??1);Jp(t,e.color,(u,s)=>{let r=Fp(u,s,l,a);return{distance:r,phase:Math.abs(r-i),selected:Math.abs(r-i)<=n}},0)}function pn(t,e){let l=e.centerX??(t.width-1)/2,a=e.centerY??(t.height-1)/2,i=Math.max(1,Math.floor(e.period??7)),n=Math.min(i,Math.max(1,Math.floor(e.bandWidth??2))),u=Math.floor(e.step);Jp(t,e.color,(s,r)=>{let o=Math.floor(Fp(s,r,l,a)),h=tg(o+u,i);return{distance:o,phase:h,selected:h<n}},u)}function Jp(t,e,l,a){for(let i=0;i<t.height;i+=1)for(let n=0;n<t.width;n+=1){let u=l(n,i);if(!u.selected)continue;let s=typeof e=="function"?e({distance:u.distance,phase:u.phase,step:a,x:n,y:i}):e;s&&(t.cells[i*t.width+n]={x:n,y:i,color:s})}}function Fp(t,e,l,a){return Math.abs(t-l)+Math.abs(e-a)}function tg(t,e){return(t%e+e)%e}var G=16,_=32,eg=137,lg=0,ag=4294967295,kp=G*_,ig=2e3,ng=650,ug=["easy","medium","hard","expert"],sg=50,ib=1e3/sg;function Pp(t,e){return Number.isInteger(t)&&Number.isInteger(e)&&t>=0&&t<G&&e>=0&&e<_}function re(t,e){return{seed:rg(t.seed),playerCount:cg(t.playerCount,e),players:Array.isArray(t.players)?t.players:[],durationMillis:Wp(t.durationMillis,e.defaultDurationMillis),nowMillis:Wp(t.nowMillis,0),difficulty:dg(t.difficulty,e),options:mg(t.options,e)}}function rg(t){let e=typeof t=="number"&&Number.isFinite(t)?Math.trunc(t):eg;return it(e,lg,ag)}function cg(t,e){let l=typeof t=="number"&&Number.isFinite(t)?Math.round(t):og(e);return e.players.allowAny===!0&&l===0?0:it(l,e.players.min,e.players.max)}function og(t){return t.players.allowAny?0:t.players.min}function Wp(t,e){return typeof t=="number"&&Number.isFinite(t)?Math.max(0,t):e}function fg(t){let e=t.config?.difficulty?.options;return e?.length?[...e]:[...ug]}function dg(t,e){let l=fg(e),a=e.config?.difficulty?.default,i=a&&l.includes(a)?a:l.includes("medium")?"medium":l[0]??"medium";return t&&l.includes(t)?t:i}function mg(t,e){let l=t??{};return Object.fromEntries((e.config?.vars??[]).map(a=>[a.key,$p(a,l[a.key])]))}function $p(t,e){if(t.type==="bool")return e===!0||e==="true"?!0:e===!1||e==="false"?!1:t.default;if(t.type==="enum"){let u=String(e??t.default);return t.options.some(r=>r.value===u)?u:t.default}let l=typeof e=="number"&&Number.isFinite(e)?e:typeof e=="string"&&e.trim()!==""?Number(e):Number.NaN,a=Number.isFinite(l)?l:t.default,i=t.type==="int"?Math.round(a):a;return it(i,t.min??-1/0,t.max??1/0)}function na(t,e){return $p(e,t[e.key])}function Se(t="#05070a"){let e=[];for(let l=0;l<_;l+=1)for(let a=0;a<G;a+=1)e.push({x:a,y:l,color:t});return{width:G,height:_,cells:e}}function C(t,e,l,a){Pp(e,l)&&(t.cells[l*t.width+e]={x:e,y:l,color:a})}function Q(t,e,l,a,i,n){for(let u=l;u<l+i;u+=1)for(let s=e;s<e+a;s+=1)C(t,s,u,n)}function N(t,e,l){return{cue:t,message:e.trimEnd().replace(/\.+$/u,""),atMillis:l}}function Ee(t){let e=t>>>0;return e===0&&(e=1),{next(){return e=Math.imul(e,1664525)+1013904223>>>0,e/4294967296},int(l){if(!Number.isFinite(l)||l<=0)throw new Error("maxExclusive must be greater than zero");return Math.floor(this.next()*l)},range(l,a){if(a<l)throw new Error("maxInclusive must be greater than or equal to minInclusive");return l+this.int(a-l+1)}}}function si(t,e=[]){let l=["#35d7ff","#ff3bd7","#ffe176","#5fff9e"];return Array.from({length:t},(a,i)=>({index:i,label:e[i]?.label||e[i]?.name||`Player ${i+1}`,color:e[i]?.color||l[i%l.length]||l[0],score:0,lives:-1}))}function it(t,e,l){return Math.min(l,Math.max(e,t))}function us(t,e={}){if(!Number.isInteger(t)||t<1)throw new Error("player ready zone count must be a positive integer");let l=it(Math.round(e.minX??0),0,G-1),a=it(Math.round(e.maxX??G-1),l,G-1),i=it(Math.round(e.minY??0),0,_-1),u=it(Math.round(e.maxY??_-1),i,_-1)-i+1;if(t>u)throw new Error("player ready zone count cannot exceed the available floor rows");return Array.from({length:t},(s,r)=>({minX:l,maxX:a,minY:i+Math.floor(u*r/t),maxY:i+Math.floor(u*(r+1)/t)-1}))}function Ol(t,e,l=0){return new co(t,e,l)}function oo(t){return Ip(t.mode==="player-ready"?t.countdownMillis:void 0,ig)}function yn(t){return Number.isFinite(t)?Math.max(0,t):0}var co=class{constructor(e,l,a){this.policy=e;this.zones=l;if(e.mode==="player-ready"&&l.length===0)throw new Error("player-ready games require at least one presence zone");this.countdownDuration=oo(e),this.releaseGraceMillis=Ip(e.mode==="player-ready"?e.releaseGraceMillis:void 0,ng),this.zoneHeld=Array.from({length:l.length},()=>0),this.zoneGraceUntil=Array.from({length:l.length},()=>0),this.phase=e.mode==="immediate"?"running":"waiting";for(let i=0;i<_;i+=1)for(let n=0;n<G;n+=1)this.tileZones[i*G+n]=l.findIndex(u=>hg(n,i,u));this.reset(a)}policy;zones;countdownDuration;releaseGraceMillis;tileZones=new Int16Array(kp).fill(-1);tileHeld=new Uint8Array(kp);zoneHeld;zoneGraceUntil;phase;startAtMillis=0;reset(e=0){return this.tileHeld.fill(0),this.zoneHeld.fill(0),this.zoneGraceUntil.fill(0),this.phase=this.policy.mode==="immediate"?"running":"waiting",this.startAtMillis=yn(e),this.state(e)}update(e){if(!Pp(e.x,e.y))return this.tick(e.atMillis);let l=e.y*G+e.x,a=this.tileZones[l]??-1,i=this.tileHeld[l]===1;return a>=0&&i!==e.pressed&&(this.tileHeld[l]=e.pressed?1:0,e.pressed?(this.zoneHeld[a]=(this.zoneHeld[a]??0)+1,this.zoneGraceUntil[a]=0):(this.zoneHeld[a]=Math.max(0,(this.zoneHeld[a]??0)-1),this.zoneHeld[a]===0&&(this.zoneGraceUntil[a]=yn(e.atMillis)+this.releaseGraceMillis))),this.tick(e.atMillis)}tick(e){if(this.policy.mode==="immediate"||this.phase==="running")return"none";let l=yn(e),a=this.readyPlayerCount(l)===this.zones.length;return this.phase==="waiting"&&a?(this.phase="starting",this.startAtMillis=l+this.countdownDuration,"players-ready"):this.phase==="starting"&&!a?(this.phase="waiting",this.startAtMillis=0,"players-left"):this.phase==="starting"&&l>=this.startAtMillis?(this.phase="running","started"):"none"}state(e){let l=yn(e);return{phase:this.phase,readyPlayers:this.readyPlayerCount(l),requiredPlayers:this.zones.length,countdownMillis:this.phase==="starting"?Math.max(0,this.startAtMillis-l):0}}zoneReady(e,l){let a=this.zoneGraceUntil[e]??0;return(this.zoneHeld[e]??0)>0||a>0&&a>=yn(l)}readyPlayerCount(e){return this.zones.reduce((l,a,i)=>l+Number(this.zoneReady(i,e)),0)}};function Ip(t,e){return t!==void 0&&Number.isFinite(t)&&t>0?t:e}function hg(t,e,l){return t>=l.minX&&t<=l.maxX&&e>=l.minY&&e<=l.maxY}function fo(t){return`#${ro(t.r)}${ro(t.g)}${ro(t.b)}`}function ss(t,e){return{r:it(Math.round(t.r*e/100),0,255),g:it(Math.round(t.g*e/100),0,255),b:it(Math.round(t.b*e/100),0,255)}}function ty(t,e){return{r:it(t.r+e.r,0,255),g:it(t.g+e.g,0,255),b:it(t.b+e.b,0,255)}}function ro(t){return it(Math.round(t),0,255).toString(16).padStart(2,"0")}function Fe(t){let e=Math.max(0,Math.ceil(t)),l=Math.ceil(e/1e3),a=Math.floor(l/60),i=l%60;return`${a}:${i.toString().padStart(2,"0")}`}var kt=mt(Rt(),1);function ey({snapshot:t,frame:e}){let l=t.phase==="ready"?"Pisa abajo para mover y lanzar":t.lastEventMessage||"Rompe todos los bloques",a=t.success?"green":t.phase==="finished"?"red":t.phase==="ready"?"yellow":"cyan";return(0,kt.jsx)(Rl,{title:t.label,phase:t.phase,children:(0,kt.jsxs)("div",{className:"ml-solo-display arkanoid-display",children:[(0,kt.jsx)(ni,{snapshot:t}),(0,kt.jsxs)("div",{className:"ml-solo-summary",children:[(0,kt.jsxs)(Dl,{columns:3,className:"ml-solo-number-row",children:[(0,kt.jsx)(ft,{label:"Bloques",tone:"pink",value:`${t.score}/${t.totalBricks}`}),(0,kt.jsx)(ft,{label:"Vidas",tone:"neutral",value:(0,kt.jsx)(ui,{lives:t.lives,maxLives:t.maxLives})}),(0,kt.jsx)(ft,{label:"Tiempo",tone:"yellow",value:Fe(t.elapsedMillis)})]}),(0,kt.jsx)(ft,{className:"ml-solo-message",label:"Estado",tone:a,value:l})]}),e?(0,kt.jsx)(ia,{className:"ml-solo-floor",frame:e,label:"Juego en el suelo"}):null]})})}var vn={ballSpeed:{key:"ball_speed",label:"Ball speed (tiles/s)",playerFacing:!0,description:"Base ball speed on Easy. Higher difficulties multiply this value.",type:"float",default:4.25,min:2,max:8,step:.25}},xe={id:"arkanoid",label:"Arkanoid",description:"Single-player floor Arkanoid with step-controlled paddle movement and deterministic brick physics.",availability:{development:!0,production:!0},catalog:{category:"individual",color:"#ff9f45",durationLabel:"Sin l\xEDmite",modeLabel:"Arkanoid",audioLabel:"Efectos",rules:["Pisa la zona inferior para mover la pala","Rompe todos los bloques sin perder la pelota"]},players:{allowAny:!0,min:1,max:1},start:{mode:"player-ready"},config:{difficulty:{default:"medium",options:["easy","medium","hard","expert"]},vars:Object.values(vn)},defaultDurationMillis:0,display:{entry:"./display"},preview:{seed:137,playerCount:1,difficulty:"medium",actions:[{atMillis:100,type:"press",x:7,y:30},{atMillis:2150,type:"release",x:7,y:30},{atMillis:2250,type:"press",x:9,y:30},{atMillis:2450,type:"release",x:9,y:30}],captureStartMillis:2200,frameCount:18,frameIntervalMillis:120},tags:["arcade","single-player","typescript"]};var po="#ffffff",yo="#35d7ff",vo=["#ff3151","#ff8a2a","#ffd45f","#74e58d"],pg="#ff3151",yg="#03070c",vg="#06101d",gg="#145cff",bg="#37101a",Mg="#ff3151",Te="#74e58d",ly=["#9ddfff","#4b91b8","#21445b"],Sg=4,ay=2,Eg=3,ua=5,Nl=29,Hl=24,mo=3,xg=12;function gn(t){return new ho(t)}var ho=class{ball={x:7,y:Nl-1,dx:1,dy:-1};ballMoves=0;ballTrail=[];bricks=[];config;lastControlX=7;lastEvent=N("none","Listo",0);lastMoveMillis=0;lives=mo;nowMillis=0;paddleX=Math.floor((G-ua)/2);phase="ready";players=[];rng;readyGate;score=0;startedAtMillis=0;constructor(e){this.config=re(e,xe),this.rng=Ee(this.config.seed),this.readyGate=Ol(xe.start,[{minX:0,maxX:G-1,minY:Hl,maxY:_-1}],this.config.nowMillis),this.resetState(this.config.nowMillis)}init(e){return this.nowMillis=e,this.readyGate.reset(e),this.phase="waiting",this.attachBall(),this.lastEvent=N("ready","Esperando jugador abajo",e),[this.lastEvent]}press(e){return this.nowMillis=e.atMillis,e.y<Hl||e.y>=_?[]:(e.pressed&&this.movePaddle(e.x),this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update(e),e.atMillis):this.phase==="ready"&&e.pressed?this.launchBall(e.atMillis):[])}release(e){return this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update({...e,pressed:!1}),e.atMillis):[]}tick(e){if(this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting")return this.applyReadyTransition(this.readyGate.tick(e.atMillis),e.atMillis);if(this.phase!=="running")return[];let l=[],a=1e3/iy(this.config);for(let i=0;i<xg&&!(e.atMillis-this.lastMoveMillis<a);i+=1){this.lastMoveMillis+=a;let n=this.moveBall(this.lastMoveMillis);if(n&&l.push(n),this.phase!=="running")break}return this.recordEvents(l)}render(){let e=Se(yg);Q(e,0,Hl,G,_-Hl,vg),Q(e,0,_-1,G,1,bg);for(let l of this.bricks)l.alive&&Q(e,l.x,l.y,l.width,1,l.color);return(this.phase==="waiting"||this.phase==="starting")&&this.drawPlayerStart(e),this.phase==="finished"&&this.score===this.bricks.length&&Gg(e),this.ballTrail.forEach((l,a)=>{let i=ly[a];i&&C(e,l.x,l.y,i)}),(this.phase!=="finished"||this.lives>0)&&C(e,this.ball.x,this.ball.y,po),Q(e,this.paddleX,Nl,ua,1,this.phase==="finished"&&this.lives===0?Mg:yo),C(e,this.lastControlX,_-1,gg),e}snapshot(){let e=this.bricksRemaining(),l=this.readyGate.state(this.nowMillis);return{currentGame:xe.id,label:xe.label,phase:this.phase,playerCount:this.config.playerCount,players:this.players,score:this.score,lives:this.lives,maxLives:mo,elapsedMillis:Math.max(0,this.nowMillis-this.startedAtMillis),remainingMillis:0,activeTargets:e,success:e===0,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?l.countdownMillis:0,readyPlayers:l.readyPlayers,requiredPlayers:l.requiredPlayers,matchTarget:this.bricks.length,ball:{...this.ball},ballMoves:this.ballMoves,ballSpeed:iy(this.config),bricksRemaining:e,launched:this.phase==="running",paddleWidth:ua,paddleX:this.paddleX,totalBricks:this.bricks.length}}reset(e={}){this.config=re({...this.config,...e},xe),this.rng=Ee(this.config.seed),this.resetState(this.config.nowMillis)}applyReadyTransition(e,l){return e==="players-ready"?(this.phase="starting",this.lastEvent=N("ready","Jugador listo",l),[this.lastEvent]):e==="players-left"?(this.phase="waiting",this.lastEvent=N("ready","Vuelve a la zona iluminada",l),[this.lastEvent]):e==="started"?this.launchBall(l):[]}launchBall(e){let l=this.phase==="waiting"||this.phase==="starting";return this.phase="running",l&&(this.startedAtMillis=e),this.ball={x:this.paddleCenter(),y:Nl-1,dx:this.rng.next()<.5?-1:1,dy:-1},this.ballTrail=[],this.lastMoveMillis=e,this.lastEvent=N("start","Pelota en juego",e),[this.lastEvent]}attachBall(){this.ball={x:this.paddleCenter(),y:Nl-1,dx:this.ball.dx,dy:-1},this.ballTrail=[]}brickAt(e,l){return this.bricks.find(a=>a.alive&&a.y===l&&e>=a.x&&e<a.x+a.width)}bricksRemaining(){return this.bricks.reduce((e,l)=>e+Number(l.alive),0)}commitBall(e){this.ballTrail=[{x:this.ball.x,y:this.ball.y},...this.ballTrail].slice(0,ly.length),this.ball=e,this.ballMoves+=1}loseLife(e){return this.lives-=1,this.players=this.scoredPlayers(),this.ballTrail=[],this.lives<=0?(this.phase="finished",N("fail","Sin vidas",e)):(this.phase="ready",this.attachBall(),N("fail","Vida perdida, pisa abajo para lanzar",e))}moveBall(e){let l=this.ball.dx,a=this.ball.dy,i=this.ball.x+l,n=this.ball.y+a;(i<0||i>=G)&&(l=l===1?-1:1,i=this.ball.x+l),n<1&&(a=1,n=this.ball.y+a);let u=this.brickAt(i,n);if(u)return u.alive=!1,this.score+=1,this.players=this.scoredPlayers(),this.ball={...this.ball,dx:l,dy:a===1?-1:1},this.ballMoves+=1,this.bricksRemaining()===0?(this.phase="finished",N("win","Muro completado",e)):N("hit",`Bloque ${this.score} de ${this.bricks.length}`,e);if(a>0&&n===Nl&&i>=this.paddleX&&i<this.paddleX+ua){let s=i-this.paddleCenter();return s<0?l=-1:s>0?l=1:l=this.rng.next()<.5?-1:1,Math.abs(s)===1&&this.rng.next()<.35&&(l=l===1?-1:1),this.commitBall({x:i,y:Nl-1,dx:l,dy:-1}),N("coin","Rebote",e)}if(n>=_)return this.loseLife(e);this.commitBall({x:i,y:n,dx:l,dy:a})}movePaddle(e){let l=Math.floor(ua/2),a=it(Math.round(e),l,G-1-l);this.paddleX=a-l,this.lastControlX=it(Math.round(e),0,G-1),(this.phase==="ready"||this.phase==="waiting"||this.phase==="starting")&&this.attachBall()}drawPlayerStart(e){if(this.phase==="waiting"){let a=Hl+Math.floor(this.nowMillis/150)%(_-Hl);for(let i=Hl;i<_;i+=1)for(let n=0;n<G;n+=1)(i===a||n===0||n===G-1)&&C(e,n,i,i===a?"#35d7ff":"#0b4260");return}let l=Math.floor(this.nowMillis/125)%4;for(let a=0;a<_;a+=1)for(let i=0;i<G;i+=1)(Math.abs(i-this.paddleCenter())+Math.abs(a-Nl)+l)%6===0&&C(e,i,a,a>=Hl?"#ffe176":"#176783")}paddleCenter(){return this.paddleX+Math.floor(ua/2)}recordEvents(e){let l=e.at(-1);return l&&(this.lastEvent=l),e}resetState(e){this.bricks=Tg(),this.lives=mo,this.nowMillis=e,this.startedAtMillis=e,this.lastMoveMillis=e,this.paddleX=Math.floor((G-ua)/2),this.lastControlX=this.paddleCenter(),this.readyGate.reset(e),this.phase="waiting",this.score=0,this.ballMoves=0,this.ball={x:this.paddleCenter(),y:Nl-1,dx:1,dy:-1},this.ballTrail=[],this.players=this.scoredPlayers(),this.lastEvent=N("ready","Esperando jugador abajo",e)}scoredPlayers(){return si(this.config.playerCount,this.config.players).map(e=>({...e,lives:this.lives,score:this.score}))}};function Tg(){let t=[],e=0;for(let l=0;l<Sg;l+=1)for(let a=0;a<G;a+=ay)t.push({alive:!0,color:vo[l]??pg,id:e,width:ay,x:a,y:Eg+l}),e+=1;return t}function Gg(t){Q(t,2,13,G-4,1,Te),Q(t,2,19,G-4,1,Te),Q(t,2,13,1,7,Te),Q(t,G-3,13,1,7,Te),C(t,5,16,Te),C(t,6,17,Te),C(t,7,18,Te),C(t,8,17,Te),C(t,9,16,Te),C(t,10,15,Te)}function iy(t){return na(t.options,vn.ballSpeed)*Cg(t.difficulty)}function Cg(t){switch(t){case"medium":return 1.25;case"hard":return 1.6;case"expert":return 2;default:return 1}}var ri=gn({playerCount:1,difficulty:"medium"}),ny=ri.init(0);ri.press({x:7,y:30,pressed:!0,atMillis:100});ri.tick({atMillis:2100});ri.tick({atMillis:3300});var uy=ri.render(),sy=ri.snapshot(),rs=gn({playerCount:1,difficulty:"easy"});rs.init(0);Ag(rs);var ry=rs.render(),cy=rs.snapshot();function Ag(t){t.press({x:7,y:30,pressed:!0,atMillis:50}),t.tick({atMillis:2050});let e=2100;for(let l=0;l<24e3&&t.snapshot().phase!=="finished";l+=1){let a=t.snapshot();t.press({x:a.ball.x,y:30,pressed:!0,atMillis:e}),t.tick({atMillis:e}),e+=50}}var Go={};An(Go,{PlayerDisplay:()=>oy,createGame:()=>oi,damagedFrame:()=>Sy,damagedSnapshot:()=>Ey,hazardColor:()=>cs,helloWorldCelebrationMillis:()=>Sn,helloWorldHazards:()=>En,helloWorldStartingLives:()=>Mn,helloWorldTargetScore:()=>ci,helloWorldTargets:()=>os,idleColor:()=>Eo,initEvents:()=>dy,losingFrame:()=>Gy,losingSnapshot:()=>Cy,manifest:()=>Ge,runningFrame:()=>gy,runningSnapshot:()=>by,startingFrame:()=>py,startingSnapshot:()=>yy,targetColor:()=>bn,trailColor:()=>So,waitingFrame:()=>my,waitingSnapshot:()=>hy,winningFrame:()=>xy,winningSnapshot:()=>Ty});var Ct=mt(Rt(),1);function oy({snapshot:t,frame:e}){let l=t.matchTarget??5,a=t.phase==="finished",i=a?t.success?"is-result-win":"is-result-lose":"",n=t.success?"green":t.lastEventCue==="fail"?"red":"cyan",u=Math.max(1,Math.ceil(t.celebrationMillis/1e3)),s=a?(0,Ct.jsxs)("span",{className:"hello-world-result-copy",children:[(0,Ct.jsx)("span",{children:t.success?"\xA1Ganaste!":t.lastEventMessage}),(0,Ct.jsxs)("small",{children:["Reinicio en ",u]})]}):t.lastEventMessage||"Verde suma, rojo resta una vida";return(0,Ct.jsx)(Rl,{title:t.label,phase:t.phase,children:(0,Ct.jsxs)("div",{className:`ml-solo-display hello-world-display ${i}`.trim(),children:[(0,Ct.jsx)(ni,{snapshot:t}),(0,Ct.jsxs)("div",{className:"ml-solo-summary",children:[(0,Ct.jsxs)(Dl,{columns:3,className:"ml-solo-number-row",children:[(0,Ct.jsx)(ft,{label:"Meta",tone:"green",value:`${t.score}/${l}`}),(0,Ct.jsx)(ft,{label:"Vidas",tone:"red",value:(0,Ct.jsx)(ui,{lives:t.lives,maxLives:t.maxLives})}),(0,Ct.jsx)(ft,{label:"Tiempo",tone:"yellow",value:Fe(t.remainingMillis)})]}),(0,Ct.jsx)(ft,{className:"ml-solo-message",label:a?t.success?"Victoria":"Fin de la partida":"Estado",tone:n,value:s})]}),e?(0,Ct.jsx)(ia,{className:"ml-solo-floor",frame:e,label:"Recorrido en el suelo"}):null]})})}var Ge={id:"hello-world",label:"Hola Mundo",description:"Sigue los objetivos verdes y evita las baldosas rojas.",availability:{development:!0,production:!1},catalog:{category:"individual",color:"#35d7ff",durationLabel:"30s",modeLabel:"Demostraci\xF3n",audioLabel:"Efectos",rules:["Sigue los objetivos verdes","Evita las baldosas rojas"]},players:{allowAny:!0,min:1,max:1},start:{mode:"player-ready"},defaultDurationMillis:3e4,display:{entry:"./display"},preview:{seed:2024,playerCount:1,actions:[{atMillis:100,type:"press",x:8,y:16},{atMillis:2150,type:"release",x:8,y:16},{atMillis:2300,type:"press",x:4,y:4},{atMillis:2320,type:"release",x:4,y:4}],captureStartMillis:2200,frameCount:18,frameIntervalMillis:120},tags:["example","ci","typescript"]};var bn="#7ee787",cs="#ff2036",So="#1f6feb",Eo="#05070a",ci=5,Mn=3,Sn=5e3,bo=[{x:3,y:5},{x:12,y:5},{x:8,y:16},{x:3,y:26},{x:12,y:26}],fy=[{x:12,y:15},{x:4,y:15},{x:8,y:28}];function oi(t){return new Mo(t)}var Mo=class{config;finishedAtMillis;hazardsHit=0;lastEvent=N("none","Listo",0);lives=Mn;nowMillis=0;phase="ready";players;readyGate;score=0;startedAtMillis=0;constructor(e){this.config=re(e,Ge),this.readyGate=Ol(Ge.start,us(1),this.config.nowMillis),this.players=this.scoredPlayers()}init(e){return this.resetState(e),[this.lastEvent]}press(e){if(this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting")return this.applyReadyTransition(this.readyGate.update(e),e.atMillis);if(this.phase!=="running"||!e.pressed)return[];let l=this.currentHazard();if(l&&e.x===l.x&&e.y===l.y)return this.loseLife(e.atMillis);let a=this.currentTarget();return!a||e.x!==a.x||e.y!==a.y?[]:(this.score+=1,this.players=this.scoredPlayers(),this.score>=ci?this.finishGame(!0,"\xA1Hola Mundo!",e.atMillis):(this.lastEvent=N("hit",`Hola ${this.score}`,e.atMillis),[this.lastEvent]))}release(e){return this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update({...e,pressed:!1}),e.atMillis):[]}tick(e){if(this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting")return this.applyReadyTransition(this.readyGate.tick(e.atMillis),e.atMillis);if(this.phase==="finished"){let l=this.finishedAtMillis??e.atMillis;return e.atMillis-l<Sn?[]:(this.resetState(e.atMillis),[this.lastEvent])}return this.phase!=="running"||this.remainingMillis()>0?[]:this.finishGame(!1,"Tiempo agotado",e.atMillis)}render(){let e=Se(Eo);if(this.phase==="waiting"||this.phase==="starting")return this.drawPlayerStart(e),e;for(let i of bo.slice(0,this.score))C(e,i.x,i.y,So);if(this.phase==="finished")return this.drawResultAnimation(e),e;let l=this.currentTarget();l&&(Q(e,l.x-1,l.y-1,3,3,bn),C(e,l.x,l.y,"#ffffff"));let a=this.currentHazard();return a&&C(e,a.x,a.y,cs),e}snapshot(){let e=this.readyGate.state(this.nowMillis);return{currentGame:Ge.id,label:Ge.label,phase:this.phase,playerCount:this.config.playerCount,players:this.players,score:this.score,lives:this.lives,maxLives:Mn,elapsedMillis:this.elapsedMillis(),remainingMillis:this.remainingMillis(),activeTargets:this.phase==="running"?+!!this.currentTarget()+ +!!this.currentHazard():0,success:this.phase==="finished"&&this.score>=ci,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?e.countdownMillis:0,readyPlayers:e.readyPlayers,requiredPlayers:e.requiredPlayers,matchTarget:ci,celebrationDurationMillis:Sn,celebrationMillis:this.celebrationMillis(),hazard:this.phase==="running"?this.currentHazard():void 0}}reset(e={}){this.config=re({...this.config,...e},Ge),this.resetState(this.config.nowMillis)}applyReadyTransition(e,l){return e==="players-ready"?(this.phase="starting",this.lastEvent=N("ready","Jugador listo",l),[this.lastEvent]):e==="players-left"?(this.phase="waiting",this.lastEvent=N("ready","Vuelve a la zona iluminada",l),[this.lastEvent]):e==="started"?(this.phase="running",this.startedAtMillis=l,this.lastEvent=N("start","Verde suma, rojo resta una vida",l),[this.lastEvent]):[]}celebrationMillis(){return this.phase!=="finished"||this.finishedAtMillis===void 0?0:Math.max(0,Sn-(this.nowMillis-this.finishedAtMillis))}currentHazard(){return fy[this.hazardsHit]}currentTarget(){return bo[this.score]}drawPlayerStart(e){let l=Math.floor(G/2),a=Math.floor(_/2),i=Math.floor(this.nowMillis/(this.phase==="starting"?110:180)),n=this.phase==="starting"?"#ffe176":bn,u=this.phase==="starting"?2+i%10:3+i%4;so(e,{centerX:l,centerY:a,color:n,radius:u})}drawResultAnimation(e){let l=Math.floor((this.nowMillis-(this.finishedAtMillis??this.nowMillis))/140);if(this.score>=ci){pn(e,{color:({x:i,y:n})=>(i+n+l)%3===0?"#ffffff":bn,step:l});return}for(let i=0;i<_;i+=1)for(let n=0;n<G;n+=1)((n+i+l)%8<=1||(n-i-l+64)%11===0)&&C(e,n,i,(n+l)%4===0?"#ff8090":cs)}elapsedMillis(){if(this.phase==="waiting"||this.phase==="starting")return 0;let e=this.phase==="finished"&&this.finishedAtMillis!==void 0?this.finishedAtMillis:this.nowMillis;return Math.max(0,e-this.startedAtMillis)}finishGame(e,l,a){return this.phase="finished",this.finishedAtMillis=a,this.lastEvent=N(e?"win":"fail",l,a),[this.lastEvent]}loseLife(e){return this.lives-=1,this.hazardsHit+=1,this.lives<=0?this.finishGame(!1,"Sin vidas",e):(this.lastEvent=N("fail",`Vida perdida, quedan ${this.lives}`,e),[this.lastEvent])}remainingMillis(){return Math.max(0,this.config.durationMillis-this.elapsedMillis())}resetState(e){this.readyGate.reset(e),this.finishedAtMillis=void 0,this.hazardsHit=0,this.lastEvent=N("ready","Esperando jugador",e),this.lives=Mn,this.nowMillis=e,this.phase="waiting",this.score=0,this.startedAtMillis=e,this.players=this.scoredPlayers()}scoredPlayers(){return si(this.config.playerCount,this.config.players).map(e=>({...e,score:this.score}))}};function En(){return fy.map(t=>({...t}))}function os(){return bo.map(t=>({...t}))}var xo=oi({seed:2024,playerCount:1,durationMillis:3e4}),dy=xo.init(0),my=xo.render(),hy=xo.snapshot(),xn=oi({seed:2024,playerCount:1,durationMillis:3e4});xn.init(0);xn.press({x:8,y:16,pressed:!0,atMillis:100});xn.tick({atMillis:1100});var py=xn.render(),yy=xn.snapshot(),vy=ms(),gy=vy.render(),by=vy.snapshot(),To=ms(),My=En()[0];if(!My)throw new Error("Hola Mundo requires at least one hazard fixture.");To.press({...My,pressed:!0,atMillis:2200});var Sy=To.render(),Ey=To.snapshot(),fs=ms();os().forEach((t,e)=>{fs.press({...t,pressed:!0,atMillis:2200+e*100})});fs.tick({atMillis:4100});var xy=fs.render(),Ty=fs.snapshot(),ds=ms();En().forEach((t,e)=>{ds.press({...t,pressed:!0,atMillis:2200+e*100})});ds.tick({atMillis:4100});var Gy=ds.render(),Cy=ds.snapshot();function ms(){let t=oi({seed:2024,playerCount:1,durationMillis:3e4});return t.init(0),t.press({x:8,y:16,pressed:!0,atMillis:100}),t.tick({atMillis:2100}),t}var Uo={};An(Uo,{PlayerDisplay:()=>Ay,createGame:()=>ra,damagedFrame:()=>Uy,damagedSnapshot:()=>By,failedFrame:()=>qy,failedSnapshot:()=>Ly,finishedFrame:()=>Yy,finishedSnapshot:()=>wy,gameWinAnimationMillis:()=>hs,initEvents:()=>Oy,manifest:()=>Ce,meteorCoreColor:()=>Oo,meteorDifficultyProfile:()=>Ry,meteorImpactColor:()=>ps,meteorImpactVisibleMillis:()=>Ro,meteorWarningColor:()=>Do,playerFootprintColor:()=>No,runningFrame:()=>Ny,runningSnapshot:()=>Hy,startingLives:()=>Tn});var Wt=mt(Rt(),1);function Ay({snapshot:t,frame:e}){let l=t.phase==="finished"?t.success?"\xA1Tormenta superada!":"La tormenta te alcanz\xF3":t.lastEventMessage||"Esquiva las zonas rojas",a=t.success?"green":t.lives===0?"red":"cyan";return(0,Wt.jsx)(Rl,{title:t.label,phase:t.phase,children:(0,Wt.jsxs)("div",{className:"ml-solo-display meteor-dodge-display",children:[(0,Wt.jsx)(ni,{snapshot:t}),(0,Wt.jsxs)("div",{className:"ml-solo-summary",children:[(0,Wt.jsxs)(Dl,{columns:3,className:"ml-solo-number-row",children:[(0,Wt.jsx)(ft,{label:"Esquivados",tone:"cyan",value:t.dodgedMeteors}),(0,Wt.jsx)(ft,{label:"Vidas",tone:"neutral",value:(0,Wt.jsx)(ui,{lives:t.lives,maxLives:t.maxLives})}),(0,Wt.jsx)(ft,{label:"Tiempo",tone:"yellow",value:Fe(t.remainingMillis)})]}),(0,Wt.jsx)(ft,{className:"ml-solo-message",label:"Estado",tone:a,value:l})]}),e?(0,Wt.jsx)(ia,{className:"ml-solo-floor",frame:e,label:"Tormenta en el suelo"}):null]})})}var Ce={id:"meteor-dodge",label:"Lluvia de meteoritos",description:"Cooperative survival game: dodge telegraphed meteor impacts until the storm passes.",availability:{development:!0,production:!1},catalog:{category:"team",color:"#b987ff",durationLabel:"45s",modeLabel:"Supervivencia",audioLabel:"Efectos",rules:["Esquiva las zonas marcadas","Sobrevive hasta que termine la tormenta"]},players:{allowAny:!0,min:1,max:1},start:{mode:"player-ready",releaseGraceMillis:750},config:{difficulty:{default:"medium",options:["easy","medium","hard","expert"]}},defaultDurationMillis:45e3,display:{entry:"./display"},preview:{seed:137,playerCount:1,difficulty:"medium",actions:[{atMillis:100,type:"press",x:8,y:16},{atMillis:2150,type:"release",x:8,y:16}],captureStartMillis:2200,frameCount:18,frameIntervalMillis:120},tags:["arcade","cooperative","survival","typescript"]};var Tn=3,hs=3e3,Ro=450,Do="#ff5a36",Oo="#ffe176",ps="#ffffff",No="#35d7ff",Co="#02050b",zg="#050d19",_g="#145cff",Rg="#35d7ff",Dg="#ffe176",Ao=["#35d7ff","#5fff9e","#ffe176","#ff3bd7","#ffffff"],zo=["#ff3151","#7b1428","#2a0710"],Og=1e3,Ng=350,Hg=64,sa={minX:4,maxX:11,minY:12,maxY:19},Ho={intervalMillis:1550,largeMeteorEvery:5,radius:1,warningMillis:1350},_y={easy:{intervalMillis:1900,largeMeteorEvery:0,radius:1,warningMillis:1650},medium:Ho,hard:{intervalMillis:1200,largeMeteorEvery:3,radius:1,warningMillis:1050},expert:{intervalMillis:900,largeMeteorEvery:1,radius:2,warningMillis:800}};function ra(t){return new _o(t)}var _o=class{config;dodgedMeteors=0;finishedAtMillis=0;lastDamageMillis=Number.NEGATIVE_INFINITY;lastEvent=N("none","Listos para la tormenta",0);lives=Tn;meteors=[];nextMeteorId=1;nextMeteorMillis=0;nowMillis=0;occupiedTiles=new Set;phase="ready";players=[];readyGate;rng;startedAtMillis=0;success=!1;constructor(e){this.config=re(e,Ce),this.rng=Ee(this.config.seed),this.readyGate=Ol(Ce.start,[sa],this.config.nowMillis),this.resetState(this.config.nowMillis)}init(e){return this.resetState(e),this.phase="waiting",this.lastEvent=N("ready","Entra en la zona azul",e),[this.lastEvent]}press(e){return this.nowMillis=e.atMillis,this.updateOccupiedTile(e.x,e.y,e.pressed),this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update(e),e.atMillis):[]}release(e){return this.nowMillis=e.atMillis,this.updateOccupiedTile(e.x,e.y,!1),this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update({...e,pressed:!1}),e.atMillis):[]}tick(e){if(this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting")return this.applyReadyTransition(this.readyGate.tick(e.atMillis),e.atMillis);if(this.phase!=="running")return[];let l=[];this.spawnDueMeteors(e.atMillis);for(let a of this.meteors){if(a.result!=="pending"||e.atMillis<a.impactAtMillis)continue;if(!this.meteorContainsOccupiedTile(a)){a.result="dodged",this.dodgedMeteors+=1;continue}if(a.impactAtMillis-this.lastDamageMillis<Og){a.result="protected";continue}if(a.result="hit",this.lastDamageMillis=a.impactAtMillis,this.lives=Math.max(0,this.lives-1),this.lives===0){l.push(this.finish(!1,a.impactAtMillis));break}l.push(N("miss","\xA1Impacto! Mu\xE9vete",a.impactAtMillis))}return this.meteors=this.meteors.filter(a=>a.clearAtMillis>e.atMillis),this.phase==="running"&&this.remainingMillis()===0&&l.push(this.finish(!0,e.atMillis)),this.recordEvents(l)}render(){let e=Se(Co);if(this.drawBackground(e),this.phase==="waiting"||this.phase==="starting")return this.drawPlayerStart(e),e;if(this.phase==="finished")return this.success?this.drawWinAnimation(e):this.drawFailAnimation(e),e;for(let l of this.occupiedTiles){let[a,i]=zy(l);C(e,a,i,No)}for(let l of this.meteors)this.drawMeteor(e,l);return e}snapshot(){let e=this.readyGate.state(this.nowMillis),l=this.success&&this.phase==="finished"?Math.max(0,Math.min(hs,this.nowMillis-this.finishedAtMillis)):0;return{currentGame:Ce.id,label:Ce.label,phase:this.phase,playerCount:this.config.playerCount,players:this.players.map(a=>({...a,lives:this.lives,score:this.dodgedMeteors})),score:this.dodgedMeteors,lives:this.lives,maxLives:Tn,elapsedMillis:this.elapsedMillis(),remainingMillis:this.remainingMillis(),activeTargets:this.meteors.filter(a=>a.result==="pending").length,success:this.success,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?e.countdownMillis:0,readyPlayers:e.readyPlayers,requiredPlayers:e.requiredPlayers,celebrating:this.success&&this.phase==="finished"&&l<hs,celebrationMillis:l,dodgedMeteors:this.dodgedMeteors,meteors:this.meteors.map(a=>({...a})),stormDurationMillis:this.config.durationMillis}}reset(e={}){this.config=re({...this.config,...e},Ce),this.rng=Ee(this.config.seed),this.resetState(this.config.nowMillis),this.phase="waiting"}applyReadyTransition(e,l){return e==="players-ready"?(this.phase="starting",this.lastEvent=N("ready","Zona lista",l),[this.lastEvent]):e==="players-left"?(this.phase="waiting",this.lastEvent=N("ready","Vuelve a la zona azul",l),[this.lastEvent]):e==="started"?(this.phase="running",this.startedAtMillis=l,this.nextMeteorMillis=l+Ng,this.lastEvent=N("start","Esquiva las zonas rojas",l),[this.lastEvent]):[]}difficultyProfile(){return _y[this.config.difficulty]??Ho}drawBackground(e){for(let l=3;l<_;l+=4)Q(e,0,l,G,1,zg)}drawFailAnimation(e){let l=Math.floor((this.nowMillis-this.finishedAtMillis)/180)%zo.length,a=zo[l]??zo[0];for(let i=0;i<_;i+=1){let n=Math.floor(i*G/_);Q(e,n-1,i,3,1,a),Q(e,G-n-2,i,3,1,a)}}drawMeteor(e,l){if(l.result==="pending"){let s=Math.floor((this.nowMillis-l.spawnedAtMillis)/160)%2===0,r=l.radius*2+1,o=s?Do:"#6c1b19";Q(e,l.x-l.radius,l.y-l.radius,r,r,o),l.radius>0&&Q(e,l.x-l.radius+1,l.y-l.radius+1,r-2,r-2,Co),C(e,l.x,l.y,Oo);return}let a=Math.max(0,this.nowMillis-l.impactAtMillis),i=Math.min(2,Math.floor(a/130)),n=l.radius+i,u=a<140?ps:l.result==="hit"?"#ff3151":"#ff8a2a";Q(e,l.x-n,l.y-n,n*2+1,n*2+1,u),C(e,l.x,l.y,ps)}drawPlayerStart(e){let l=Math.floor(this.nowMillis/(this.phase==="starting"?100:190)),a=this.phase==="starting"?Dg:l%2===0?Rg:_g,i=this.phase==="starting"?l%3:l%2,n=sa.minX+i,u=sa.minY+i,s=sa.maxX-sa.minX+1-i*2,r=sa.maxY-sa.minY+1-i*2;Q(e,n,u,s,r,a),s>2&&r>2&&Q(e,n+1,u+1,s-2,r-2,Co),C(e,7,15,"#ffffff"),C(e,8,16,"#ffffff")}drawWinAnimation(e){let l=Math.floor(Math.max(0,this.nowMillis-this.finishedAtMillis)/120);pn(e,{color:({distance:a})=>Ao[(a+l)%Ao.length]??Ao[0],step:l})}elapsedMillis(){if(this.phase==="waiting"||this.phase==="starting"||this.phase==="ready")return 0;let e=this.phase==="finished"?this.finishedAtMillis:this.nowMillis;return Math.max(0,e-this.startedAtMillis)}finish(e,l){this.phase="finished",this.success=e,this.finishedAtMillis=l;let a=N(e?"win":"fail",e?"Tormenta superada":"Sin vidas",l);return this.lastEvent=a,a}meteorContainsOccupiedTile(e){for(let l of this.occupiedTiles){let[a,i]=zy(l);if(Math.abs(a-e.x)<=e.radius&&Math.abs(i-e.y)<=e.radius)return!0}return!1}recordEvents(e){let l=e.at(-1);return l&&(this.lastEvent=l),e}remainingMillis(){return Math.max(0,this.config.durationMillis-this.elapsedMillis())}resetState(e){this.readyGate.reset(e),this.rng=Ee(this.config.seed),this.dodgedMeteors=0,this.finishedAtMillis=0,this.lastDamageMillis=Number.NEGATIVE_INFINITY,this.lives=Tn,this.meteors=[],this.nextMeteorId=1,this.nextMeteorMillis=0,this.nowMillis=e,this.occupiedTiles.clear(),this.players=si(this.config.playerCount,this.config.players),this.startedAtMillis=e,this.success=!1}spawnDueMeteors(e){let l=this.difficultyProfile(),a=0;for(;this.nextMeteorMillis>0&&this.nextMeteorMillis<=e&&a<Hg;){let i=this.nextMeteorId,u=l.largeMeteorEvery>0&&i%l.largeMeteorEvery===0?Math.min(2,l.radius+1):l.radius,s=this.nextMeteorMillis+l.warningMillis;this.meteors.push({clearAtMillis:s+Ro,id:i,impactAtMillis:s,radius:u,result:"pending",spawnedAtMillis:this.nextMeteorMillis,x:this.rng.range(u,G-u-1),y:this.rng.range(u,_-u-1)}),this.nextMeteorId+=1,this.nextMeteorMillis+=l.intervalMillis,a+=1}}updateOccupiedTile(e,l,a){if(e<0||e>=G||l<0||l>=_)return;let i=`${e},${l}`;a?this.occupiedTiles.add(i):this.occupiedTiles.delete(i)}};function Ry(t){return{..._y[t]??Ho}}function zy(t){let[e="0",l="0"]=t.split(",");return[Number(e),Number(l)]}var fi=ra({playerCount:1,difficulty:"medium",seed:137}),Oy=fi.init(0);ys(fi);fi.release({x:8,y:16,pressed:!1,atMillis:2150});fi.tick({atMillis:4e3});var Ny=fi.render(),Hy=fi.snapshot(),Gn=ra({playerCount:1,difficulty:"easy",seed:137});Gn.init(0);ys(Gn);Xy(Gn,2450);var Uy=Gn.render(),By=Gn.snapshot(),ca=ra({playerCount:1,difficulty:"medium",durationMillis:4e3,seed:137});ca.init(0);ys(ca);ca.release({x:8,y:16,pressed:!1,atMillis:2150});ca.tick({atMillis:6100});ca.tick({atMillis:7e3});var Yy=ca.render(),wy=ca.snapshot(),Cn=ra({playerCount:1,difficulty:"easy",seed:137});Cn.init(0);ys(Cn);var Dy=2450;for(let t=0;t<3;t+=1)Dy=Xy(Cn,Dy)+1050;var qy=Cn.render(),Ly=Cn.snapshot();function ys(t){t.press({x:8,y:16,pressed:!0,atMillis:100}),t.tick({atMillis:2100})}function Xy(t,e){t.release({x:8,y:16,pressed:!1,atMillis:e}),t.tick({atMillis:e});let l=t.snapshot().meteors.find(a=>a.result==="pending");return l?(t.press({x:l.x,y:l.y,pressed:!0,atMillis:l.impactAtMillis-1}),t.tick({atMillis:l.impactAtMillis}),t.release({x:l.x,y:l.y,pressed:!1,atMillis:l.impactAtMillis+1}),l.impactAtMillis+1):e}var Xo={};An(Xo,{PlayerDisplay:()=>jy,ballColor:()=>oa,blueColor:()=>el,createGame:()=>Zy,finishedSnapshot:()=>Jy,manifest:()=>wt,pingPongConfigVars:()=>Ul,redColor:()=>tl,runningFrame:()=>Ky,runningSnapshot:()=>Lo,waitingSnapshot:()=>qo});var dt=mt(Rt(),1);function Bo(t){return{"--ping-pong-ball-x":`${3.5+t.y/31*93}%`,"--ping-pong-ball-y":`${18+t.x/15*64}%`}}function jy({snapshot:t}){let[e,l]=t.players,a=e??{label:"Rojo",score:0,color:"#ff1c28"},i=l??{label:"Azul",score:0,color:"#145cff"},n=Math.max(t.matchTarget,1),u=n*2-1,s=t.phase==="starting"?"Empieza en":"Objetivo",r=t.phase==="starting"?Fe(t.countdownMillis):n,o=t.phase==="starting"?"preparados":"puntos para ganar",h=t.phase==="finished"?"\xDAltimo peloteo":"Peloteo",y=t.phase==="finished"&&t.lastRoundHits>0?t.lastRoundHits:t.roundHits,d=t.lastRoundWinner||"-",p=d===a.label?"red":d===i.label?"blue":"neutral",M=t.phase==="waiting"||t.phase==="starting",S=Math.min(u,t.rounds.length+(t.phase==="running"||t.phase==="starting"?1:0)),U=M?"Listos":"Ronda",f=M?`${t.activeTargets}/2`:`${S}/${u}`,c=t.phase==="running",m=t.phase==="finished"?null:Math.min(u,t.rounds.length+1),v=t.pointScorer===0?"red":t.pointScorer===1?"blue":"none",T=t.winnerIndex===0?"red":t.winnerIndex===1?"blue":"none",H=["ping-pong-display","ml-versus-display",`is-phase-${t.phase}`,t.pointFlashMillis>0?`is-scoring-${v}`:"",t.phase==="finished"?`is-winner-${T}`:""].filter(Boolean).join(" "),E=t.pointScorer===0?a.label:i.label,R=t.winnerIndex===0?a.label:i.label,b=t.phase==="waiting"?`${t.activeTargets}/2 en posici\xF3n`:t.phase==="starting"?"Preparados":t.phase==="finished"?`Victoria ${R}`:t.pointFlashMillis>0?`Punto ${E}`:t.roundHits>0?`${t.roundHits} ${t.roundHits===1?"golpe":"golpes"}`:"Saque",z=t.impact?Bo(t.impact):void 0;return(0,dt.jsx)(Rl,{title:t.label,phase:t.phase,variant:"versus",children:(0,dt.jsxs)("div",{className:H,style:{"--ping-pong-rally-pace":t.rallyPace},children:[(0,dt.jsx)(Zp,{className:"ping-pong-scoreboard",left:a,right:i,target:n,centerLabel:s,centerValue:r,centerCaption:o}),(0,dt.jsxs)("section",{"aria-label":`Trayectoria de la pelota: ${b}`,className:"ping-pong-rally-lane",children:[(0,dt.jsx)("span",{className:"ping-pong-rally-team is-red",children:"Rojo"}),(0,dt.jsx)("span",{className:"ping-pong-rally-team is-blue",children:"Azul"}),(0,dt.jsx)("span",{className:"ping-pong-rally-net","aria-hidden":"true"}),(0,dt.jsx)("span",{className:"ping-pong-rally-scan","aria-hidden":"true"}),t.ballTrail.map((yt,fa)=>(0,dt.jsx)("i",{"aria-hidden":"true",className:"ping-pong-ball-trail",style:{...Bo(yt),"--ping-pong-trail-index":fa}},`${fa}-${yt.x}-${yt.y}`)),(0,dt.jsx)("i",{"aria-hidden":"true",className:"ping-pong-ball",style:Bo(t.ball)}),t.impact?(0,dt.jsx)("i",{"aria-hidden":"true",className:`ping-pong-impact is-${t.impact.team===0?"red":"blue"}`,style:z},t.motionEventId):null,(0,dt.jsx)("strong",{className:"ping-pong-rally-caption",children:b},`caption-${t.motionEventId}`)]}),(0,dt.jsxs)(Dl,{columns:4,className:"ping-pong-metrics",children:[(0,dt.jsx)(ft,{className:"ping-pong-rally-metric",label:h,tone:"cyan",value:y}),(0,dt.jsx)(ft,{className:"ping-pong-progress-metric",label:U,tone:M?"green":"yellow",value:f}),(0,dt.jsx)(ft,{className:"ping-pong-last-metric",label:"\xDAltimo",tone:p,value:d}),(0,dt.jsx)(ft,{className:"ping-pong-time-metric",label:"Tiempo",tone:"amber",value:Fe(t.elapsedMillis)})]}),(0,dt.jsx)(Kp,{className:"ping-pong-rounds",activeCaption:c?"Punto en curso":"Por comenzar",activeLabel:c?"En juego":"Siguiente",activeRound:m,rounds:t.rounds,totalRounds:u})]})})}var Ul={pointsToWin:{key:"points_to_win",label:"Points to win",playerFacing:!0,description:"The first team to reach this score wins. A match can last up to twice this value minus one rounds.",type:"int",default:5,min:1,max:21,step:1},initialBallSpeed:{key:"initial_ball_speed",label:"Initial ball speed (tiles/s)",playerFacing:!1,description:"The ball's starting speed in floor tiles per second on Easy. Medium, Hard, and Expert apply the difficulty multiplier curve to this value.",type:"float",default:5.75,min:3,max:10,step:.25},returnSpeedMultiplier:{key:"return_speed_multiplier",label:"Speed multiplier per return",playerFacing:!1,description:"The ball accelerates after every successful paddle return. Difficulty scales the increase above 1x, with a safety cap at 2.5 times the starting speed.",type:"float",default:1.035,min:1,max:1.1,step:.005},difficultyMultiplier:{key:"difficulty_multiplier",label:"Difficulty multiplier step",playerFacing:!1,description:"Easy uses 1x, Medium uses one step, Hard uses the step squared, and Expert uses the step cubed. It affects both starting speed and return acceleration.",type:"float",default:1.2,min:1,max:1.35,step:.05}},wt={id:"ping-pong",label:"Ping Pong",description:"Two-player arcade ping pong for red and blue halves of the Motion Levels floor.",availability:{development:!0,production:!0},catalog:{category:"versus",color:"#145cff",durationLabel:"A 5 puntos",modeLabel:"Rojo contra azul",audioLabel:"M\xFAsica + efectos",rules:["Un equipo ocupa la mitad roja y otro la azul","Devuelve la pelota pisando la zona iluminada"]},players:{allowAny:!0,min:2,max:2},start:{mode:"player-ready",releaseGraceMillis:1e3},config:{difficulty:{default:"medium",options:["easy","medium","hard","expert"]},vars:Object.values(Ul)},defaultDurationMillis:0,display:{entry:"./display"},preview:{seed:137,playerCount:2,difficulty:"medium",options:{points_to_win:5},actions:[{atMillis:100,type:"press",x:7,y:3},{atMillis:100,type:"press",x:7,y:28}],captureStartMillis:2200,frameCount:18,frameIntervalMillis:120},tags:["arcade","two-player","typescript"]};var tl="#ff1c28",el="#145cff",oa="#ffffff",Ug="#05070a",ke={r:255,g:28,b:40},We={r:20,g:92,b:255},di={r:255,g:255,b:255},Vy=900,Yo=3e3,vs=2,gs=29,Pe=5,Bl=Math.floor(G/2),$e=Math.floor(_/2),Bg=2.5;function Zy(t){return new wo(t)}var wo=class{config;rng;players;winningScore;speed;startedAtMillis=0;nowMillis=0;readyGate;lastStepMillis=0;pauseUntilMillis=0;finishAtMillis=0;currentIntervalMillis=140;hitCount=0;redPaddleX=0;bluePaddleX=0;ball={x:Bl,y:$e,dx:1,dy:1};ballTrail=[];teamScore=[0,0];rounds=[];lastRoundHits=0;lastRoundWinner="";phase="waiting";success=!1;scorer=-1;winner=-1;pointAtMillis=0;lastImpactAtMillis=0;lastImpact=null;motionEventId=0;lastEvent=N("none","Listo",0);constructor(e){this.config=re(e,wt),this.rng=Ee(this.config.seed),this.readyGate=Ol(wt.start,us(2),this.config.nowMillis),this.winningScore=this.readWinningScore(),this.players=this.createPlayers(),this.speed=Qy(this.config),this.resetGame(this.config.nowMillis)}init(e){return this.startedAtMillis=e,this.nowMillis=e,this.resetGame(e),this.lastEvent=N("ready","Ping Pong espera rojo y azul",e),[this.lastEvent]}press(e){this.nowMillis=e.atMillis;let l=this.readyGate.update(e);return e.pressed&&this.movePaddle(e.x,e.y),this.recordEvents(this.updatePhase(e.atMillis,l))}release(e){this.nowMillis=e.atMillis;let l=this.readyGate.update({...e,pressed:!1});return this.recordEvents(this.updatePhase(e.atMillis,l))}tick(e){this.nowMillis=e.atMillis;let l=this.updatePhase(e.atMillis,this.readyGate.tick(e.atMillis));if(this.phase!=="running"||e.atMillis<this.pauseUntilMillis)return this.recordEvents(l);for(let a=0;a<8&&!(e.atMillis-this.lastStepMillis<this.currentIntervalMillis);a+=1){this.lastStepMillis+=this.currentIntervalMillis;let i=this.moveBall(this.lastStepMillis);if(i&&l.push(i),this.phase!=="running"||this.lastStepMillis<this.pauseUntilMillis)break}return this.recordEvents(l)}render(){let e=Se(Ug);return this.phase==="waiting"?(this.drawWaiting(e),e):this.phase==="starting"?(this.drawReady(e),e):this.phase==="finished"?(this.drawWin(e),e):(this.drawArena(e),this.drawScore(e),this.nowMillis<this.pauseUntilMillis?this.drawScoreFlash(e):(this.drawBallTrail(e),this.drawImpact(e),this.drawPaddles(e),this.drawBallGlow(e),C(e,this.ball.x,this.ball.y,oa)),e)}snapshot(){this.recordEvents(this.updatePhase(this.nowMillis));let e=this.readyGate.state(this.nowMillis),l=this.phase==="starting"?e.countdownMillis:0,a=this.phase==="finished"&&this.nowMillis<this.finishAtMillis+Yo?this.finishAtMillis+Yo-this.nowMillis:0;return{currentGame:wt.id,label:wt.label,phase:this.phase,playerCount:this.config.playerCount,players:[{index:0,label:this.labelForTeam(0),color:tl,score:this.teamScore[0],lives:-1},{index:1,label:this.labelForTeam(1),color:el,score:this.teamScore[1],lives:-1}],score:this.teamScore[0]+this.teamScore[1],lives:-1,elapsedMillis:Math.max(0,this.nowMillis-this.startedAtMillis),remainingMillis:a,activeTargets:this.activeHalves(this.nowMillis),success:this.success,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:l,readyPlayers:e.readyPlayers,requiredPlayers:e.requiredPlayers,matchTarget:this.winningScore,roundHits:this.hitCount,lastRoundHits:this.lastRoundHits,lastRoundWinner:this.lastRoundWinner,rounds:this.rounds,ball:{...this.ball},ballTrail:this.ballTrail.map(i=>({...i})),rallyPace:this.speed.initialMillis===this.speed.minimumMillis?1:it((this.speed.initialMillis-this.currentIntervalMillis)/(this.speed.initialMillis-this.speed.minimumMillis),0,1),pointScorer:this.scorer,pointFlashMillis:Math.max(0,this.pauseUntilMillis-this.nowMillis),winnerIndex:this.winner,impact:this.lastImpact&&this.nowMillis-this.lastImpactAtMillis<480?{...this.lastImpact,remainingMillis:480-(this.nowMillis-this.lastImpactAtMillis)}:null,motionEventId:this.motionEventId,initialBallSpeed:this.speed.initialTilesPerSecond,ballSpeed:1e3/this.currentIntervalMillis,returnSpeedMultiplier:this.speed.hitMultiplier,difficultySpeedFactor:this.speed.difficultyFactor}}reset(e={}){this.config=re({...this.config,...e},wt),this.rng=Ee(this.config.seed),this.winningScore=this.readWinningScore(),this.players=this.createPlayers(),this.speed=Qy(this.config),this.motionEventId=0,this.resetGame(this.config.nowMillis),this.lastEvent=N("none","Listo",this.config.nowMillis)}createPlayers(){return[{index:0,label:"Rojo",color:tl,score:0,lives:-1},{index:1,label:"Azul",color:el,score:0,lives:-1}]}readWinningScore(){return na(this.config.options,Ul.pointsToWin)}resetGame(e){this.readyGate.reset(e),this.teamScore=[0,0],this.rounds=[],this.lastRoundHits=0,this.lastRoundWinner="",this.redPaddleX=Math.floor((G-Pe)/2),this.bluePaddleX=this.redPaddleX,this.phase="waiting",this.success=!1,this.scorer=-1,this.winner=-1,this.pointAtMillis=0,this.lastImpactAtMillis=0,this.lastImpact=null,this.motionEventId+=1,this.startedAtMillis=e,this.finishAtMillis=0,this.resetBall(),this.lastEvent=N("none","Esperando a rojo arriba y azul abajo",e)}updatePhase(e,l=this.readyGate.tick(e)){return this.phase==="finished"?e-this.finishAtMillis>=Yo?(this.resetGame(e),[N("ready","Nueva partida",e)]):[]:l==="players-ready"?(this.phase="starting",this.motionEventId+=1,[N("start","Rojo y azul listos",e)]):l==="players-left"?(this.phase="waiting",this.motionEventId+=1,[N("ready","Vuelve a las zonas roja y azul",e)]):l==="started"?(this.phase="running",this.startedAtMillis=e,this.lastStepMillis=e,this.serve(),this.motionEventId+=1,[N("start","La pelota esta en juego",e)]):[]}movePaddle(e,l){let i=it(Math.round(e),Math.floor(Pe/2),G-1-Math.floor(Pe/2))-Math.floor(Pe/2);l<_/2?this.redPaddleX=i:this.bluePaddleX=i}moveBall(e){let l=this.ball.x+this.ball.dx,a=this.ball.y+this.ball.dy;if(l<0&&(l=0,this.ball.dx=1),l>=G&&(l=G-1,this.ball.dx=-1),this.ball.dy<0&&a===vs&&l>=this.redPaddleX&&l<this.redPaddleX+Pe)return this.reflectFromPaddle(l,this.redPaddleX),this.commitBall({...this.ball,x:l,y:vs+1,dy:1}),this.recordImpact(0,l,vs),this.accelerate(),N("coin","Rojo devuelve",e);if(this.ball.dy>0&&a===gs&&l>=this.bluePaddleX&&l<this.bluePaddleX+Pe)return this.reflectFromPaddle(l,this.bluePaddleX),this.commitBall({...this.ball,x:l,y:gs-1,dy:-1}),this.recordImpact(1,l,gs),this.accelerate(),N("coin","Azul devuelve",e);if(a<0)return this.scorePoint(1,e),N("score","Punto para azul",e);if(a>=_)return this.scorePoint(0,e),N("score","Punto para rojo",e);this.commitBall({...this.ball,x:l,y:a})}scorePoint(e,l){if(this.teamScore[e]+=1,this.scorer=e,this.pointAtMillis=l,this.motionEventId+=1,this.recordRound(e),this.teamScore[e]>=this.winningScore){this.phase="finished",this.success=e===1,this.winner=e,this.finishAtMillis=l;return}this.resetBall(),this.pauseUntilMillis=l+Vy,this.lastStepMillis=this.pauseUntilMillis}recordRound(e){this.lastRoundHits=this.hitCount,this.lastRoundWinner=this.labelForTeam(e),this.rounds=[...this.rounds,{index:this.rounds.length+1,winnerIndex:e,winnerLabel:this.lastRoundWinner,hits:this.lastRoundHits}]}resetBall(){this.ball={...this.ball,x:Bl,y:$e},this.ballTrail=[],this.currentIntervalMillis=this.speed.initialMillis,this.hitCount=0,this.pauseUntilMillis=0,this.serve()}serve(){this.ball={x:Bl,y:$e,dy:this.rng.int(2)===0?-1:1,dx:this.rng.int(2)===0?-1:1}}reflectFromPaddle(e,l){let a=l+Math.floor(Pe/2);e<a?this.ball.dx=-1:e>a?this.ball.dx=1:this.ball.dx=this.rng.int(2)===0?-1:1}accelerate(){this.hitCount+=1,this.currentIntervalMillis=Math.max(this.speed.minimumMillis,this.currentIntervalMillis/this.speed.hitMultiplier)}commitBall(e){this.ballTrail=[{x:this.ball.x,y:this.ball.y},...this.ballTrail.filter(l=>l.x!==this.ball.x||l.y!==this.ball.y)].slice(0,5),this.ball=e}recordImpact(e,l,a){this.lastImpact={team:e,x:l,y:a},this.lastImpactAtMillis=this.nowMillis,this.motionEventId+=1}drawWaiting(e){let l=this.halfReady(0,this.nowMillis),a=this.halfReady(1,this.nowMillis);this.drawWaitingHalf(e,0,l),this.drawWaitingHalf(e,1,a),l?this.drawSoftBar(e,3,5,10,ke):this.drawBreathingOutline(e,0,ke),a?this.drawSoftBar(e,3,24,10,We):this.drawBreathingOutline(e,1,We)}drawReady(e){let l=oo(wt.start),a=Math.max(0,l-this.readyGate.state(this.nowMillis).countdownMillis),n=it(a/l,0,1)*(_*.7),u=.5+Math.sin(a/86)*.5;for(let s=0;s<_;s+=1)for(let r=0;r<G;r+=1){let o=Math.abs(r-Bl)+Math.abs(s-$e),h=s>=_/2?We:ke,y=Math.abs(o-n),d=Math.max(0,1-y/3.2),p=7+(Math.sin(r*.82+s*.38-a/120)+1)*4;d>0?C(e,r,s,Ae(h,28+d*74,d*24)):o<n&&C(e,r,s,Ie(h,p+u*10))}this.drawCenterLine(e,18+u*20),this.drawBallGlow(e),C(e,Bl,$e,oa)}drawScoreFlash(e){let l=this.scorer===1?We:ke,a=Math.max(0,this.nowMillis-this.pointAtMillis),i=it(a/Vy,0,1),n=this.scorer===0?_-1:0,u=i*(_+8);for(let s=0;s<_;s+=1)for(let r=0;r<G;r+=1){let o=Math.hypot((r-Bl)*1.35,s-n),h=Math.max(0,1-Math.abs(o-u)/3.4),y=Math.sin(r*12.13+s*7.71+a/38)>.9?1:0,d=1-i;h>0?C(e,r,s,Ae(l,28+h*82,h*34)):y>0&&d>.18&&C(e,r,s,Ae(l,22+d*44,d*12))}this.drawCenterLine(e,12+(1-i)*24),this.drawPaddles(e)}drawWin(e){let l=this.winner===1?We:ke,a=Math.max(0,this.nowMillis-this.finishAtMillis),i=a/92,n=.5+Math.sin(a/110)*.5;for(let s=0;s<_;s+=1)for(let r=0;r<G;r+=1){let h=((this.winner===0?_-1-s:s)+r*.72-i+_*4)%11,y=Math.sin(r*17.17+s*11.31+a/55);h<3.8?C(e,r,s,Ae(l,38+(3.8-h)*15+n*12,12+n*18)):y>.91&&C(e,r,s,Ae(l,48,32))}let u=64+n*26;Q(e,Bl-1,$e-1,3,3,Ie(di,u)),C(e,Bl,$e,oa)}drawArena(e){let l=this.nowMillis/185;for(let a=1;a<_-1;a+=1){let i=a<_/2?ke:We;for(let n=0;n<G;n+=1){let u=(Math.sin(n*.78+a*.31-l)+1)*.5,s=(n+a)%3===0?4:0;C(e,n,a,Ie(i,4+u*7+s))}}this.drawCenterLine(e,18+(Math.sin(this.nowMillis/140)+1)*5)}drawCenterLine(e,l){for(let a=0;a<G;a+=1)(a+Math.floor(this.nowMillis/120))%3===0&&(C(e,a,$e-1,Ae(di,l,0)),C(e,a,$e,Ae(di,l*.72,0)))}drawBallTrail(e){this.ballTrail.forEach((l,a)=>{let i=Math.max(10,46-a*8);C(e,l.x,l.y,Ie(di,i))})}drawBallGlow(e){let l=20+(Math.sin(this.nowMillis/70)+1)*7;for(let[a,i]of[[-1,0],[1,0],[0,-1],[0,1]])C(e,this.ball.x+a,this.ball.y+i,Ie(di,l))}drawImpact(e){if(!this.lastImpact)return;let l=this.nowMillis-this.lastImpactAtMillis;if(l<0||l>=480)return;let a=l/480,i=1+a*5.5,n=this.lastImpact.team===0?ke:We;for(let u=Math.max(0,this.lastImpact.y-7);u<=Math.min(_-1,this.lastImpact.y+7);u+=1)for(let s=Math.max(0,this.lastImpact.x-7);s<=Math.min(G-1,this.lastImpact.x+7);s+=1){let r=Math.hypot(s-this.lastImpact.x,u-this.lastImpact.y),o=Math.max(0,1-Math.abs(r-i)/1.45);o>0&&C(e,s,u,Ae(n,30+o*52,o*28*(1-a)))}}drawBreathingOutline(e,l,a){let i=(this.nowMillis/900+l*.5)%1,n=.5-Math.cos(i*Math.PI*2)*.5,u=Math.round(1+n*2),s=l===0?3+u:21-u,r=48+n*48;this.drawOutline(e,u,s,G-u*2,8,Ie(a,r))}drawScore(e){for(let l=0;l<this.teamScore[0]&&l<G;l+=1)C(e,l,0,tl);for(let l=0;l<this.teamScore[1]&&l<G;l+=1)C(e,l,_-1,el)}drawPaddles(e){this.drawPaddle(e,this.redPaddleX,vs,ke),this.drawPaddle(e,this.bluePaddleX,gs,We)}drawWaitingHalf(e,l,a){let i=l===1?_/2:0,n=l===1?We:ke,u=Math.floor(this.nowMillis/120)%10;for(let s=i;s<i+_/2;s+=1)for(let r=0;r<G;r+=1){let o=0;a?o=18+(r+s+u)%6*6:(r+s+u)%7===0&&(o=22),o>0&&C(e,r,s,Ie(n,o))}}drawSoftBar(e,l,a,i,n){let u=Math.floor(this.nowMillis/100)%6;for(let s=0;s<i;s+=1){let r=s===u||s===i-1-u?112:58+s*4;C(e,l+s,a,Ie(n,r)),C(e,l+s,a+1,Ae(n,r-8,10)),C(e,l+s,a+2,Ie(n,Math.max(18,r-28)))}}drawPaddle(e,l,a,i){for(let n=0;n<Pe;n+=1){let u=n===Math.floor(Pe/2)?118:74;C(e,l+n,a,Ae(i,u,18))}}drawOutline(e,l,a,i,n,u){let s=Math.max(2,Math.round(i)),r=Math.max(2,Math.round(n));Q(e,l,a,s,1,u),Q(e,l,a+r-1,s,1,u),Q(e,l,a,1,r,u),Q(e,l+s-1,a,1,r,u)}halfReady(e,l){return this.readyGate.zoneReady(e,l)}activeHalves(e){return this.readyGate.state(e).readyPlayers}labelForTeam(e){return this.players[e]?.label||(e===0?"Rojo":"Azul")}recordEvents(e){let l=e.at(-1);return l&&(this.lastEvent=l),e}};function Qy(t){let e=na(t.options,Ul.initialBallSpeed),l=na(t.options,Ul.returnSpeedMultiplier),i=na(t.options,Ul.difficultyMultiplier)**Yg(t.difficulty),n=e*i,u=1+(l-1)*i,s=n*Bg;return{difficultyFactor:i,hitMultiplier:u,initialTilesPerSecond:n,initialMillis:1e3/n,minimumMillis:1e3/s}}function Yg(t){switch(t){case"medium":return 1;case"hard":return 2;case"expert":return 3;default:return 0}}function Ie(t,e){return fo(ss(t,e))}function Ae(t,e,l){return fo(ty(ss(t,e),ss(di,l)))}var Ky=(()=>{let t=Se("#05070a");return Q(t,5,2,5,1,tl),Q(t,6,29,5,1,el),C(t,8,16,oa),t})(),qo={currentGame:wt.id,label:wt.label,phase:"waiting",playerCount:2,players:[{index:0,label:"Rojo",color:tl,score:0,lives:-1},{index:1,label:"Azul",color:el,score:0,lives:-1}],score:0,lives:-1,elapsedMillis:0,remainingMillis:0,activeTargets:0,success:!1,lastEventCue:"ready",lastEventMessage:"Ping Pong espera rojo y azul",countdownMillis:0,readyPlayers:0,requiredPlayers:2,matchTarget:5,roundHits:0,lastRoundHits:0,lastRoundWinner:"",rounds:[],ball:{x:8,y:16,dx:1,dy:1},ballTrail:[],rallyPace:0,pointScorer:-1,pointFlashMillis:0,winnerIndex:-1,impact:null,motionEventId:1,initialBallSpeed:6.9,ballSpeed:6.9,returnSpeedMultiplier:1.042,difficultySpeedFactor:1.2},Lo={...qo,phase:"running",readyPlayers:2,elapsedMillis:8200,activeTargets:2,lastEventCue:"coin",lastEventMessage:"Azul devuelve",roundHits:3,ball:{x:11,y:21,dx:1,dy:1},ballTrail:[{x:10,y:20},{x:9,y:19},{x:8,y:18}],rallyPace:.1935,ballSpeed:7.8064,impact:{team:1,x:10,y:29,remainingMillis:180},motionEventId:4},Jy={...Lo,phase:"finished",score:5,remainingMillis:2400,success:!0,lastEventCue:"score",lastEventMessage:"Punto para azul",players:[{index:0,label:"Rojo",color:tl,score:2,lives:-1},{index:1,label:"Azul",color:el,score:3,lives:-1}],lastRoundHits:2,lastRoundWinner:"Azul",pointScorer:1,winnerIndex:1,motionEventId:8,rounds:[{index:1,winnerIndex:0,winnerLabel:"Rojo",hits:1},{index:2,winnerIndex:1,winnerLabel:"Azul",hits:2}]};var jo=new Map([[xe.id,go],[Ge.id,Go],[Ce.id,Uo],[wt.id,Xo]]),cM=[...jo.values()].map(t=>t.manifest).sort((t,e)=>t.id.localeCompare(e.id));var Vo=mt(Rt(),1),bs=new WeakMap;function Fy(t,e){let l=jo.get(e.gameId);if(!l?.PlayerDisplay)throw new Error(`no player display registered for ${e.gameId}`);let a=bs.get(t);a||(a={root:(0,ky.createRoot)(t),input:e},bs.set(t,a)),a.input=e;let i=l.PlayerDisplay;a.root.render((0,Vo.jsx)(Qp,{paused:e.paused===!0,children:(0,Vo.jsx)(i,{snapshot:e.snapshot,frame:e.frame})}))}function wg(t){bs.get(t)?.root.unmount(),bs.delete(t)}function qg(){if(document.getElementById("motion-levels-games-display-styles"))return;let t=document.createElement("style");t.id="motion-levels-games-display-styles",t.textContent=`/*
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
`,document.head.append(t)}qg();window.MotionLevelsGamesDisplay={revision:"7e742a65e280af51ef5eecff4459be2c81893f89",mount:Fy,update:Fy,unmount:wg};})();
