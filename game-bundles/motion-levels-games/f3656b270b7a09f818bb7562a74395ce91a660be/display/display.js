"use strict";(()=>{var U0=Object.create;var qs=Object.defineProperty;var B0=Object.getOwnPropertyDescriptor;var Y0=Object.getOwnPropertyNames;var L0=Object.getPrototypeOf,q0=Object.prototype.hasOwnProperty;var Mt=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),zi=(e,t)=>{for(var l in t)qs(e,l,{get:t[l],enumerable:!0})},X0=(e,t,l,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of Y0(t))!q0.call(e,i)&&i!==l&&qs(e,i,{get:()=>t[i],enumerable:!(a=B0(t,i))||a.enumerable});return e};var ue=(e,t,l)=>(l=e!=null?U0(L0(e)):{},X0(t||!e||!e.__esModule?qs(l,"default",{value:e,enumerable:!0}):l,e));var Af=Mt(te=>{"use strict";function Vs(e,t){var l=e.length;e.push(t);e:for(;0<l;){var a=l-1>>>1,i=e[a];if(0<Qn(i,t))e[a]=t,e[l]=i,l=a;else break e}}function St(e){return e.length===0?null:e[0]}function Fn(e){if(e.length===0)return null;var t=e[0],l=e.pop();if(l!==t){e[0]=l;e:for(var a=0,i=e.length,n=i>>>1;a<n;){var u=2*(a+1)-1,s=e[u],r=u+1,c=e[r];if(0>Qn(s,l))r<i&&0>Qn(c,s)?(e[a]=c,e[r]=l,a=r):(e[a]=s,e[u]=l,a=u);else if(r<i&&0>Qn(c,l))e[a]=c,e[r]=l,a=r;else break e}}return t}function Qn(e,t){var l=e.sortIndex-t.sortIndex;return l!==0?l:e.id-t.id}te.unstable_now=void 0;typeof performance=="object"&&typeof performance.now=="function"?(vf=performance,te.unstable_now=function(){return vf.now()}):(Xs=Date,bf=Xs.now(),te.unstable_now=function(){return Xs.now()-bf});var vf,Xs,bf,Bt=[],cl=[],j0=1,tt=null,Ae=3,Qs=!1,Ri=!1,_i=!1,Ks=!1,Ef=typeof setTimeout=="function"?setTimeout:null,xf=typeof clearTimeout=="function"?clearTimeout:null,Mf=typeof setImmediate<"u"?setImmediate:null;function Kn(e){for(var t=St(cl);t!==null;){if(t.callback===null)Fn(cl);else if(t.startTime<=e)Fn(cl),t.sortIndex=t.expirationTime,Vs(Bt,t);else break;t=St(cl)}}function Fs(e){if(_i=!1,Kn(e),!Ri)if(St(Bt)!==null)Ri=!0,xa||(xa=!0,Ea());else{var t=St(cl);t!==null&&Js(Fs,t.startTime-e)}}var xa=!1,Di=-1,Tf=5,Cf=-1;function Gf(){return Ks?!0:!(te.unstable_now()-Cf<Tf)}function js(){if(Ks=!1,xa){var e=te.unstable_now();Cf=e;var t=!0;try{e:{Ri=!1,_i&&(_i=!1,xf(Di),Di=-1),Qs=!0;var l=Ae;try{t:{for(Kn(e),tt=St(Bt);tt!==null&&!(tt.expirationTime>e&&Gf());){var a=tt.callback;if(typeof a=="function"){tt.callback=null,Ae=tt.priorityLevel;var i=a(tt.expirationTime<=e);if(e=te.unstable_now(),typeof i=="function"){tt.callback=i,Kn(e),t=!0;break t}tt===St(Bt)&&Fn(Bt),Kn(e)}else Fn(Bt);tt=St(Bt)}if(tt!==null)t=!0;else{var n=St(cl);n!==null&&Js(Fs,n.startTime-e),t=!1}}break e}finally{tt=null,Ae=l,Qs=!1}t=void 0}}finally{t?Ea():xa=!1}}}var Ea;typeof Mf=="function"?Ea=function(){Mf(js)}:typeof MessageChannel<"u"?(Zs=new MessageChannel,Sf=Zs.port2,Zs.port1.onmessage=js,Ea=function(){Sf.postMessage(null)}):Ea=function(){Ef(js,0)};var Zs,Sf;function Js(e,t){Di=Ef(function(){e(te.unstable_now())},t)}te.unstable_IdlePriority=5;te.unstable_ImmediatePriority=1;te.unstable_LowPriority=4;te.unstable_NormalPriority=3;te.unstable_Profiling=null;te.unstable_UserBlockingPriority=2;te.unstable_cancelCallback=function(e){e.callback=null};te.unstable_forceFrameRate=function(e){0>e||125<e?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):Tf=0<e?Math.floor(1e3/e):5};te.unstable_getCurrentPriorityLevel=function(){return Ae};te.unstable_next=function(e){switch(Ae){case 1:case 2:case 3:var t=3;break;default:t=Ae}var l=Ae;Ae=t;try{return e()}finally{Ae=l}};te.unstable_requestPaint=function(){Ks=!0};te.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var l=Ae;Ae=e;try{return t()}finally{Ae=l}};te.unstable_scheduleCallback=function(e,t,l){var a=te.unstable_now();switch(typeof l=="object"&&l!==null?(l=l.delay,l=typeof l=="number"&&0<l?a+l:a):l=a,e){case 1:var i=-1;break;case 2:i=250;break;case 5:i=1073741823;break;case 4:i=1e4;break;default:i=5e3}return i=l+i,e={id:j0++,callback:t,priorityLevel:e,startTime:l,expirationTime:i,sortIndex:-1},l>a?(e.sortIndex=l,Vs(cl,e),St(Bt)===null&&e===St(cl)&&(_i?(xf(Di),Di=-1):_i=!0,Js(Fs,l-a))):(e.sortIndex=i,Vs(Bt,e),Ri||Qs||(Ri=!0,xa||(xa=!0,Ea()))),e};te.unstable_shouldYield=Gf;te.unstable_wrapCallback=function(e){var t=Ae;return function(){var l=Ae;Ae=t;try{return e.apply(this,arguments)}finally{Ae=l}}}});var Rf=Mt((Bb,zf)=>{"use strict";zf.exports=Af()});var qf=Mt(O=>{"use strict";var Ws=Symbol.for("react.transitional.element"),Z0=Symbol.for("react.portal"),V0=Symbol.for("react.fragment"),Q0=Symbol.for("react.strict_mode"),K0=Symbol.for("react.profiler"),F0=Symbol.for("react.consumer"),J0=Symbol.for("react.context"),P0=Symbol.for("react.forward_ref"),k0=Symbol.for("react.suspense"),W0=Symbol.for("react.memo"),Hf=Symbol.for("react.lazy"),$0=Symbol.for("react.activity"),_f=Symbol.iterator;function I0(e){return e===null||typeof e!="object"?null:(e=_f&&e[_f]||e["@@iterator"],typeof e=="function"?e:null)}var wf={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Uf=Object.assign,Bf={};function Ca(e,t,l){this.props=e,this.context=t,this.refs=Bf,this.updater=l||wf}Ca.prototype.isReactComponent={};Ca.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};Ca.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function Yf(){}Yf.prototype=Ca.prototype;function $s(e,t,l){this.props=e,this.context=t,this.refs=Bf,this.updater=l||wf}var Is=$s.prototype=new Yf;Is.constructor=$s;Uf(Is,Ca.prototype);Is.isPureReactComponent=!0;var Df=Array.isArray;function ks(){}var W={H:null,A:null,T:null,S:null},Lf=Object.prototype.hasOwnProperty;function er(e,t,l){var a=l.ref;return{$$typeof:Ws,type:e,key:t,ref:a!==void 0?a:null,props:l}}function eg(e,t){return er(e.type,t,e.props)}function tr(e){return typeof e=="object"&&e!==null&&e.$$typeof===Ws}function tg(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(l){return t[l]})}var Of=/\/+/g;function Ps(e,t){return typeof e=="object"&&e!==null&&e.key!=null?tg(""+e.key):t.toString(36)}function lg(e){switch(e.status){case"fulfilled":return e.value;case"rejected":throw e.reason;default:switch(typeof e.status=="string"?e.then(ks,ks):(e.status="pending",e.then(function(t){e.status==="pending"&&(e.status="fulfilled",e.value=t)},function(t){e.status==="pending"&&(e.status="rejected",e.reason=t)})),e.status){case"fulfilled":return e.value;case"rejected":throw e.reason}}throw e}function Ta(e,t,l,a,i){var n=typeof e;(n==="undefined"||n==="boolean")&&(e=null);var u=!1;if(e===null)u=!0;else switch(n){case"bigint":case"string":case"number":u=!0;break;case"object":switch(e.$$typeof){case Ws:case Z0:u=!0;break;case Hf:return u=e._init,Ta(u(e._payload),t,l,a,i)}}if(u)return i=i(e),u=a===""?"."+Ps(e,0):a,Df(i)?(l="",u!=null&&(l=u.replace(Of,"$&/")+"/"),Ta(i,t,l,"",function(c){return c})):i!=null&&(tr(i)&&(i=eg(i,l+(i.key==null||e&&e.key===i.key?"":(""+i.key).replace(Of,"$&/")+"/")+u)),t.push(i)),1;u=0;var s=a===""?".":a+":";if(Df(e))for(var r=0;r<e.length;r++)a=e[r],n=s+Ps(a,r),u+=Ta(a,t,l,n,i);else if(r=I0(e),typeof r=="function")for(e=r.call(e),r=0;!(a=e.next()).done;)a=a.value,n=s+Ps(a,r++),u+=Ta(a,t,l,n,i);else if(n==="object"){if(typeof e.then=="function")return Ta(lg(e),t,l,a,i);throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.")}return u}function Jn(e,t,l){if(e==null)return e;var a=[],i=0;return Ta(e,a,"","",function(n){return t.call(l,n,i++)}),a}function ag(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(l){(e._status===0||e._status===-1)&&(e._status=1,e._result=l)},function(l){(e._status===0||e._status===-1)&&(e._status=2,e._result=l)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var Nf=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},ig={map:Jn,forEach:function(e,t,l){Jn(e,function(){t.apply(this,arguments)},l)},count:function(e){var t=0;return Jn(e,function(){t++}),t},toArray:function(e){return Jn(e,function(t){return t})||[]},only:function(e){if(!tr(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};O.Activity=$0;O.Children=ig;O.Component=Ca;O.Fragment=V0;O.Profiler=K0;O.PureComponent=$s;O.StrictMode=Q0;O.Suspense=k0;O.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=W;O.__COMPILER_RUNTIME={__proto__:null,c:function(e){return W.H.useMemoCache(e)}};O.cache=function(e){return function(){return e.apply(null,arguments)}};O.cacheSignal=function(){return null};O.cloneElement=function(e,t,l){if(e==null)throw Error("The argument must be a React element, but you passed "+e+".");var a=Uf({},e.props),i=e.key;if(t!=null)for(n in t.key!==void 0&&(i=""+t.key),t)!Lf.call(t,n)||n==="key"||n==="__self"||n==="__source"||n==="ref"&&t.ref===void 0||(a[n]=t[n]);var n=arguments.length-2;if(n===1)a.children=l;else if(1<n){for(var u=Array(n),s=0;s<n;s++)u[s]=arguments[s+2];a.children=u}return er(e.type,i,a)};O.createContext=function(e){return e={$$typeof:J0,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:F0,_context:e},e};O.createElement=function(e,t,l){var a,i={},n=null;if(t!=null)for(a in t.key!==void 0&&(n=""+t.key),t)Lf.call(t,a)&&a!=="key"&&a!=="__self"&&a!=="__source"&&(i[a]=t[a]);var u=arguments.length-2;if(u===1)i.children=l;else if(1<u){for(var s=Array(u),r=0;r<u;r++)s[r]=arguments[r+2];i.children=s}if(e&&e.defaultProps)for(a in u=e.defaultProps,u)i[a]===void 0&&(i[a]=u[a]);return er(e,n,i)};O.createRef=function(){return{current:null}};O.forwardRef=function(e){return{$$typeof:P0,render:e}};O.isValidElement=tr;O.lazy=function(e){return{$$typeof:Hf,_payload:{_status:-1,_result:e},_init:ag}};O.memo=function(e,t){return{$$typeof:W0,type:e,compare:t===void 0?null:t}};O.startTransition=function(e){var t=W.T,l={};W.T=l;try{var a=e(),i=W.S;i!==null&&i(l,a),typeof a=="object"&&a!==null&&typeof a.then=="function"&&a.then(ks,Nf)}catch(n){Nf(n)}finally{t!==null&&l.types!==null&&(t.types=l.types),W.T=t}};O.unstable_useCacheRefresh=function(){return W.H.useCacheRefresh()};O.use=function(e){return W.H.use(e)};O.useActionState=function(e,t,l){return W.H.useActionState(e,t,l)};O.useCallback=function(e,t){return W.H.useCallback(e,t)};O.useContext=function(e){return W.H.useContext(e)};O.useDebugValue=function(){};O.useDeferredValue=function(e,t){return W.H.useDeferredValue(e,t)};O.useEffect=function(e,t){return W.H.useEffect(e,t)};O.useEffectEvent=function(e){return W.H.useEffectEvent(e)};O.useId=function(){return W.H.useId()};O.useImperativeHandle=function(e,t,l){return W.H.useImperativeHandle(e,t,l)};O.useInsertionEffect=function(e,t){return W.H.useInsertionEffect(e,t)};O.useLayoutEffect=function(e,t){return W.H.useLayoutEffect(e,t)};O.useMemo=function(e,t){return W.H.useMemo(e,t)};O.useOptimistic=function(e,t){return W.H.useOptimistic(e,t)};O.useReducer=function(e,t,l){return W.H.useReducer(e,t,l)};O.useRef=function(e){return W.H.useRef(e)};O.useState=function(e){return W.H.useState(e)};O.useSyncExternalStore=function(e,t,l){return W.H.useSyncExternalStore(e,t,l)};O.useTransition=function(){return W.H.useTransition()};O.version="19.2.7"});var Ql=Mt((Lb,Xf)=>{"use strict";Xf.exports=qf()});var Zf=Mt(_e=>{"use strict";var ng=Ql();function jf(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var l=2;l<arguments.length;l++)t+="&args[]="+encodeURIComponent(arguments[l])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function fl(){}var Re={d:{f:fl,r:function(){throw Error(jf(522))},D:fl,C:fl,L:fl,m:fl,X:fl,S:fl,M:fl},p:0,findDOMNode:null},ug=Symbol.for("react.portal");function sg(e,t,l){var a=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:ug,key:a==null?null:""+a,children:e,containerInfo:t,implementation:l}}var Oi=ng.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function Pn(e,t){if(e==="font")return"";if(typeof t=="string")return t==="use-credentials"?t:""}_e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=Re;_e.createPortal=function(e,t){var l=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)throw Error(jf(299));return sg(e,t,null,l)};_e.flushSync=function(e){var t=Oi.T,l=Re.p;try{if(Oi.T=null,Re.p=2,e)return e()}finally{Oi.T=t,Re.p=l,Re.d.f()}};_e.preconnect=function(e,t){typeof e=="string"&&(t?(t=t.crossOrigin,t=typeof t=="string"?t==="use-credentials"?t:"":void 0):t=null,Re.d.C(e,t))};_e.prefetchDNS=function(e){typeof e=="string"&&Re.d.D(e)};_e.preinit=function(e,t){if(typeof e=="string"&&t&&typeof t.as=="string"){var l=t.as,a=Pn(l,t.crossOrigin),i=typeof t.integrity=="string"?t.integrity:void 0,n=typeof t.fetchPriority=="string"?t.fetchPriority:void 0;l==="style"?Re.d.S(e,typeof t.precedence=="string"?t.precedence:void 0,{crossOrigin:a,integrity:i,fetchPriority:n}):l==="script"&&Re.d.X(e,{crossOrigin:a,integrity:i,fetchPriority:n,nonce:typeof t.nonce=="string"?t.nonce:void 0})}};_e.preinitModule=function(e,t){if(typeof e=="string")if(typeof t=="object"&&t!==null){if(t.as==null||t.as==="script"){var l=Pn(t.as,t.crossOrigin);Re.d.M(e,{crossOrigin:l,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0})}}else t==null&&Re.d.M(e)};_e.preload=function(e,t){if(typeof e=="string"&&typeof t=="object"&&t!==null&&typeof t.as=="string"){var l=t.as,a=Pn(l,t.crossOrigin);Re.d.L(e,l,{crossOrigin:a,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0,type:typeof t.type=="string"?t.type:void 0,fetchPriority:typeof t.fetchPriority=="string"?t.fetchPriority:void 0,referrerPolicy:typeof t.referrerPolicy=="string"?t.referrerPolicy:void 0,imageSrcSet:typeof t.imageSrcSet=="string"?t.imageSrcSet:void 0,imageSizes:typeof t.imageSizes=="string"?t.imageSizes:void 0,media:typeof t.media=="string"?t.media:void 0})}};_e.preloadModule=function(e,t){if(typeof e=="string")if(t){var l=Pn(t.as,t.crossOrigin);Re.d.m(e,{as:typeof t.as=="string"&&t.as!=="script"?t.as:void 0,crossOrigin:l,integrity:typeof t.integrity=="string"?t.integrity:void 0})}else Re.d.m(e)};_e.requestFormReset=function(e){Re.d.r(e)};_e.unstable_batchedUpdates=function(e,t){return e(t)};_e.useFormState=function(e,t,l){return Oi.H.useFormState(e,t,l)};_e.useFormStatus=function(){return Oi.H.useHostTransitionStatus()};_e.version="19.2.7"});var Kf=Mt((Xb,Qf)=>{"use strict";function Vf(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Vf)}catch(e){console.error(e)}}Vf(),Qf.exports=Zf()});var iy=Mt(Ms=>{"use strict";var ye=Rf(),vm=Ql(),rg=Kf();function v(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var l=2;l<arguments.length;l++)t+="&args[]="+encodeURIComponent(arguments[l])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function bm(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function bn(e){var t=e,l=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(l=t.return),e=t.return;while(e)}return t.tag===3?l:null}function Mm(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Sm(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Ff(e){if(bn(e)!==e)throw Error(v(188))}function og(e){var t=e.alternate;if(!t){if(t=bn(e),t===null)throw Error(v(188));return t!==e?null:e}for(var l=e,a=t;;){var i=l.return;if(i===null)break;var n=i.alternate;if(n===null){if(a=i.return,a!==null){l=a;continue}break}if(i.child===n.child){for(n=i.child;n;){if(n===l)return Ff(i),e;if(n===a)return Ff(i),t;n=n.sibling}throw Error(v(188))}if(l.return!==a.return)l=i,a=n;else{for(var u=!1,s=i.child;s;){if(s===l){u=!0,l=i,a=n;break}if(s===a){u=!0,a=i,l=n;break}s=s.sibling}if(!u){for(s=n.child;s;){if(s===l){u=!0,l=n,a=i;break}if(s===a){u=!0,a=n,l=i;break}s=s.sibling}if(!u)throw Error(v(189))}}if(l.alternate!==a)throw Error(v(190))}if(l.tag!==3)throw Error(v(188));return l.stateNode.current===l?e:t}function Em(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=Em(e),t!==null)return t;e=e.sibling}return null}var ee=Object.assign,cg=Symbol.for("react.element"),kn=Symbol.for("react.transitional.element"),qi=Symbol.for("react.portal"),Da=Symbol.for("react.fragment"),xm=Symbol.for("react.strict_mode"),wr=Symbol.for("react.profiler"),Tm=Symbol.for("react.consumer"),Qt=Symbol.for("react.context"),Do=Symbol.for("react.forward_ref"),Ur=Symbol.for("react.suspense"),Br=Symbol.for("react.suspense_list"),Oo=Symbol.for("react.memo"),dl=Symbol.for("react.lazy"),Yr=Symbol.for("react.activity"),fg=Symbol.for("react.memo_cache_sentinel"),Jf=Symbol.iterator;function Ni(e){return e===null||typeof e!="object"?null:(e=Jf&&e[Jf]||e["@@iterator"],typeof e=="function"?e:null)}var dg=Symbol.for("react.client.reference");function Lr(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===dg?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case Da:return"Fragment";case wr:return"Profiler";case xm:return"StrictMode";case Ur:return"Suspense";case Br:return"SuspenseList";case Yr:return"Activity"}if(typeof e=="object")switch(e.$$typeof){case qi:return"Portal";case Qt:return e.displayName||"Context";case Tm:return(e._context.displayName||"Context")+".Consumer";case Do:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Oo:return t=e.displayName||null,t!==null?t:Lr(e.type)||"Memo";case dl:t=e._payload,e=e._init;try{return Lr(e(t))}catch{}}return null}var Xi=Array.isArray,R=vm.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,j=rg.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,Wl={pending:!1,data:null,method:null,action:null},qr=[],Oa=-1;function Gt(e){return{current:e}}function Me(e){0>Oa||(e.current=qr[Oa],qr[Oa]=null,Oa--)}function P(e,t){Oa++,qr[Oa]=e.current,e.current=t}var Ct=Gt(null),nn=Gt(null),xl=Gt(null),Ru=Gt(null);function _u(e,t){switch(P(xl,t),P(nn,e),P(Ct,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?tm(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=tm(t),e=Vp(t,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}Me(Ct),P(Ct,e)}function ka(){Me(Ct),Me(nn),Me(xl)}function Xr(e){e.memoizedState!==null&&P(Ru,e);var t=Ct.current,l=Vp(t,e.type);t!==l&&(P(nn,e),P(Ct,l))}function Du(e){nn.current===e&&(Me(Ct),Me(nn)),Ru.current===e&&(Me(Ru),yn._currentValue=Wl)}var lr,Pf;function Fl(e){if(lr===void 0)try{throw Error()}catch(l){var t=l.stack.trim().match(/\n( *(at )?)/);lr=t&&t[1]||"",Pf=-1<l.stack.indexOf(`
    at`)?" (<anonymous>)":-1<l.stack.indexOf("@")?"@unknown:0:0":""}return`
`+lr+e+Pf}var ar=!1;function ir(e,t){if(!e||ar)return"";ar=!0;var l=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var a={DetermineComponentFrameRoot:function(){try{if(t){var y=function(){throw Error()};if(Object.defineProperty(y.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(y,[])}catch(p){var m=p}Reflect.construct(e,[],y)}else{try{y.call()}catch(p){m=p}e.call(y.prototype)}}else{try{throw Error()}catch(p){m=p}(y=e())&&typeof y.catch=="function"&&y.catch(function(){})}}catch(p){if(p&&m&&typeof p.stack=="string")return[p.stack,m.stack]}return[null,null]}};a.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var i=Object.getOwnPropertyDescriptor(a.DetermineComponentFrameRoot,"name");i&&i.configurable&&Object.defineProperty(a.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var n=a.DetermineComponentFrameRoot(),u=n[0],s=n[1];if(u&&s){var r=u.split(`
`),c=s.split(`
`);for(i=a=0;a<r.length&&!r[a].includes("DetermineComponentFrameRoot");)a++;for(;i<c.length&&!c[i].includes("DetermineComponentFrameRoot");)i++;if(a===r.length||i===c.length)for(a=r.length-1,i=c.length-1;1<=a&&0<=i&&r[a]!==c[i];)i--;for(;1<=a&&0<=i;a--,i--)if(r[a]!==c[i]){if(a!==1||i!==1)do if(a--,i--,0>i||r[a]!==c[i]){var f=`
`+r[a].replace(" at new "," at ");return e.displayName&&f.includes("<anonymous>")&&(f=f.replace("<anonymous>",e.displayName)),f}while(1<=a&&0<=i);break}}}finally{ar=!1,Error.prepareStackTrace=l}return(l=e?e.displayName||e.name:"")?Fl(l):""}function mg(e,t){switch(e.tag){case 26:case 27:case 5:return Fl(e.type);case 16:return Fl("Lazy");case 13:return e.child!==t&&t!==null?Fl("Suspense Fallback"):Fl("Suspense");case 19:return Fl("SuspenseList");case 0:case 15:return ir(e.type,!1);case 11:return ir(e.type.render,!1);case 1:return ir(e.type,!0);case 31:return Fl("Activity");default:return""}}function kf(e){try{var t="",l=null;do t+=mg(e,l),l=e,e=e.return;while(e);return t}catch(a){return`
Error generating stack: `+a.message+`
`+a.stack}}var jr=Object.prototype.hasOwnProperty,No=ye.unstable_scheduleCallback,nr=ye.unstable_cancelCallback,hg=ye.unstable_shouldYield,pg=ye.unstable_requestPaint,Qe=ye.unstable_now,yg=ye.unstable_getCurrentPriorityLevel,Cm=ye.unstable_ImmediatePriority,Gm=ye.unstable_UserBlockingPriority,Ou=ye.unstable_NormalPriority,gg=ye.unstable_LowPriority,Am=ye.unstable_IdlePriority,vg=ye.log,bg=ye.unstable_setDisableYieldValue,Mn=null,Ke=null;function vl(e){if(typeof vg=="function"&&bg(e),Ke&&typeof Ke.setStrictMode=="function")try{Ke.setStrictMode(Mn,e)}catch{}}var Fe=Math.clz32?Math.clz32:Eg,Mg=Math.log,Sg=Math.LN2;function Eg(e){return e>>>=0,e===0?32:31-(Mg(e)/Sg|0)|0}var Wn=256,$n=262144,In=4194304;function Jl(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function is(e,t,l){var a=e.pendingLanes;if(a===0)return 0;var i=0,n=e.suspendedLanes,u=e.pingedLanes;e=e.warmLanes;var s=a&134217727;return s!==0?(a=s&~n,a!==0?i=Jl(a):(u&=s,u!==0?i=Jl(u):l||(l=s&~e,l!==0&&(i=Jl(l))))):(s=a&~n,s!==0?i=Jl(s):u!==0?i=Jl(u):l||(l=a&~e,l!==0&&(i=Jl(l)))),i===0?0:t!==0&&t!==i&&(t&n)===0&&(n=i&-i,l=t&-t,n>=l||n===32&&(l&4194048)!==0)?t:i}function Sn(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function xg(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function zm(){var e=In;return In<<=1,(In&62914560)===0&&(In=4194304),e}function ur(e){for(var t=[],l=0;31>l;l++)t.push(e);return t}function En(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function Tg(e,t,l,a,i,n){var u=e.pendingLanes;e.pendingLanes=l,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=l,e.entangledLanes&=l,e.errorRecoveryDisabledLanes&=l,e.shellSuspendCounter=0;var s=e.entanglements,r=e.expirationTimes,c=e.hiddenUpdates;for(l=u&~l;0<l;){var f=31-Fe(l),y=1<<f;s[f]=0,r[f]=-1;var m=c[f];if(m!==null)for(c[f]=null,f=0;f<m.length;f++){var p=m[f];p!==null&&(p.lane&=-536870913)}l&=~y}a!==0&&Rm(e,a,0),n!==0&&i===0&&e.tag!==0&&(e.suspendedLanes|=n&~(u&~t))}function Rm(e,t,l){e.pendingLanes|=t,e.suspendedLanes&=~t;var a=31-Fe(t);e.entangledLanes|=t,e.entanglements[a]=e.entanglements[a]|1073741824|l&261930}function _m(e,t){var l=e.entangledLanes|=t;for(e=e.entanglements;l;){var a=31-Fe(l),i=1<<a;i&t|e[a]&t&&(e[a]|=t),l&=~i}}function Dm(e,t){var l=t&-t;return l=(l&42)!==0?1:Ho(l),(l&(e.suspendedLanes|t))!==0?0:l}function Ho(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function wo(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function Om(){var e=j.p;return e!==0?e:(e=window.event,e===void 0?32:ty(e.type))}function Wf(e,t){var l=j.p;try{return j.p=e,t()}finally{j.p=l}}var Ul=Math.random().toString(36).slice(2),Ee="__reactFiber$"+Ul,Ye="__reactProps$"+Ul,si="__reactContainer$"+Ul,Zr="__reactEvents$"+Ul,Cg="__reactListeners$"+Ul,Gg="__reactHandles$"+Ul,$f="__reactResources$"+Ul,xn="__reactMarker$"+Ul;function Uo(e){delete e[Ee],delete e[Ye],delete e[Zr],delete e[Cg],delete e[Gg]}function Na(e){var t=e[Ee];if(t)return t;for(var l=e.parentNode;l;){if(t=l[si]||l[Ee]){if(l=t.alternate,t.child!==null||l!==null&&l.child!==null)for(e=um(e);e!==null;){if(l=e[Ee])return l;e=um(e)}return t}e=l,l=e.parentNode}return null}function ri(e){if(e=e[Ee]||e[si]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function ji(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(v(33))}function Za(e){var t=e[$f];return t||(t=e[$f]={hoistableStyles:new Map,hoistableScripts:new Map}),t}function be(e){e[xn]=!0}var Nm=new Set,Hm={};function sa(e,t){Wa(e,t),Wa(e+"Capture",t)}function Wa(e,t){for(Hm[e]=t,e=0;e<t.length;e++)Nm.add(t[e])}var Ag=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),If={},ed={};function zg(e){return jr.call(ed,e)?!0:jr.call(If,e)?!1:Ag.test(e)?ed[e]=!0:(If[e]=!0,!1)}function hu(e,t,l){if(zg(t))if(l===null)e.removeAttribute(t);else{switch(typeof l){case"undefined":case"function":case"symbol":e.removeAttribute(t);return;case"boolean":var a=t.toLowerCase().slice(0,5);if(a!=="data-"&&a!=="aria-"){e.removeAttribute(t);return}}e.setAttribute(t,""+l)}}function eu(e,t,l){if(l===null)e.removeAttribute(t);else{switch(typeof l){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(t);return}e.setAttribute(t,""+l)}}function Yt(e,t,l,a){if(a===null)e.removeAttribute(l);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(l);return}e.setAttributeNS(t,l,""+a)}}function at(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function wm(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Rg(e,t,l){var a=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&typeof a<"u"&&typeof a.get=="function"&&typeof a.set=="function"){var i=a.get,n=a.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return i.call(this)},set:function(u){l=""+u,n.call(this,u)}}),Object.defineProperty(e,t,{enumerable:a.enumerable}),{getValue:function(){return l},setValue:function(u){l=""+u},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Vr(e){if(!e._valueTracker){var t=wm(e)?"checked":"value";e._valueTracker=Rg(e,t,""+e[t])}}function Um(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var l=t.getValue(),a="";return e&&(a=wm(e)?e.checked?"true":"false":e.value),e=a,e!==l?(t.setValue(e),!0):!1}function Nu(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}var _g=/[\n"\\]/g;function ut(e){return e.replace(_g,function(t){return"\\"+t.charCodeAt(0).toString(16)+" "})}function Qr(e,t,l,a,i,n,u,s){e.name="",u!=null&&typeof u!="function"&&typeof u!="symbol"&&typeof u!="boolean"?e.type=u:e.removeAttribute("type"),t!=null?u==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+at(t)):e.value!==""+at(t)&&(e.value=""+at(t)):u!=="submit"&&u!=="reset"||e.removeAttribute("value"),t!=null?Kr(e,u,at(t)):l!=null?Kr(e,u,at(l)):a!=null&&e.removeAttribute("value"),i==null&&n!=null&&(e.defaultChecked=!!n),i!=null&&(e.checked=i&&typeof i!="function"&&typeof i!="symbol"),s!=null&&typeof s!="function"&&typeof s!="symbol"&&typeof s!="boolean"?e.name=""+at(s):e.removeAttribute("name")}function Bm(e,t,l,a,i,n,u,s){if(n!=null&&typeof n!="function"&&typeof n!="symbol"&&typeof n!="boolean"&&(e.type=n),t!=null||l!=null){if(!(n!=="submit"&&n!=="reset"||t!=null)){Vr(e);return}l=l!=null?""+at(l):"",t=t!=null?""+at(t):l,s||t===e.value||(e.value=t),e.defaultValue=t}a=a??i,a=typeof a!="function"&&typeof a!="symbol"&&!!a,e.checked=s?e.checked:!!a,e.defaultChecked=!!a,u!=null&&typeof u!="function"&&typeof u!="symbol"&&typeof u!="boolean"&&(e.name=u),Vr(e)}function Kr(e,t,l){t==="number"&&Nu(e.ownerDocument)===e||e.defaultValue===""+l||(e.defaultValue=""+l)}function Va(e,t,l,a){if(e=e.options,t){t={};for(var i=0;i<l.length;i++)t["$"+l[i]]=!0;for(l=0;l<e.length;l++)i=t.hasOwnProperty("$"+e[l].value),e[l].selected!==i&&(e[l].selected=i),i&&a&&(e[l].defaultSelected=!0)}else{for(l=""+at(l),t=null,i=0;i<e.length;i++){if(e[i].value===l){e[i].selected=!0,a&&(e[i].defaultSelected=!0);return}t!==null||e[i].disabled||(t=e[i])}t!==null&&(t.selected=!0)}}function Ym(e,t,l){if(t!=null&&(t=""+at(t),t!==e.value&&(e.value=t),l==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=l!=null?""+at(l):""}function Lm(e,t,l,a){if(t==null){if(a!=null){if(l!=null)throw Error(v(92));if(Xi(a)){if(1<a.length)throw Error(v(93));a=a[0]}l=a}l==null&&(l=""),t=l}l=at(t),e.defaultValue=l,a=e.textContent,a===l&&a!==""&&a!==null&&(e.value=a),Vr(e)}function $a(e,t){if(t){var l=e.firstChild;if(l&&l===e.lastChild&&l.nodeType===3){l.nodeValue=t;return}}e.textContent=t}var Dg=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function td(e,t,l){var a=t.indexOf("--")===0;l==null||typeof l=="boolean"||l===""?a?e.setProperty(t,""):t==="float"?e.cssFloat="":e[t]="":a?e.setProperty(t,l):typeof l!="number"||l===0||Dg.has(t)?t==="float"?e.cssFloat=l:e[t]=(""+l).trim():e[t]=l+"px"}function qm(e,t,l){if(t!=null&&typeof t!="object")throw Error(v(62));if(e=e.style,l!=null){for(var a in l)!l.hasOwnProperty(a)||t!=null&&t.hasOwnProperty(a)||(a.indexOf("--")===0?e.setProperty(a,""):a==="float"?e.cssFloat="":e[a]="");for(var i in t)a=t[i],t.hasOwnProperty(i)&&l[i]!==a&&td(e,i,a)}else for(var n in t)t.hasOwnProperty(n)&&td(e,n,t[n])}function Bo(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Og=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),Ng=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function pu(e){return Ng.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function Kt(){}var Fr=null;function Yo(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Ha=null,Qa=null;function ld(e){var t=ri(e);if(t&&(e=t.stateNode)){var l=e[Ye]||null;e:switch(e=t.stateNode,t.type){case"input":if(Qr(e,l.value,l.defaultValue,l.defaultValue,l.checked,l.defaultChecked,l.type,l.name),t=l.name,l.type==="radio"&&t!=null){for(l=e;l.parentNode;)l=l.parentNode;for(l=l.querySelectorAll('input[name="'+ut(""+t)+'"][type="radio"]'),t=0;t<l.length;t++){var a=l[t];if(a!==e&&a.form===e.form){var i=a[Ye]||null;if(!i)throw Error(v(90));Qr(a,i.value,i.defaultValue,i.defaultValue,i.checked,i.defaultChecked,i.type,i.name)}}for(t=0;t<l.length;t++)a=l[t],a.form===e.form&&Um(a)}break e;case"textarea":Ym(e,l.value,l.defaultValue);break e;case"select":t=l.value,t!=null&&Va(e,!!l.multiple,t,!1)}}}var sr=!1;function Xm(e,t,l){if(sr)return e(t,l);sr=!0;try{var a=e(t);return a}finally{if(sr=!1,(Ha!==null||Qa!==null)&&(ys(),Ha&&(t=Ha,e=Qa,Qa=Ha=null,ld(t),e)))for(t=0;t<e.length;t++)ld(e[t])}}function un(e,t){var l=e.stateNode;if(l===null)return null;var a=l[Ye]||null;if(a===null)return null;l=a[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(a=!a.disabled)||(e=e.type,a=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!a;break e;default:e=!1}if(e)return null;if(l&&typeof l!="function")throw Error(v(231,t,typeof l));return l}var Wt=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Jr=!1;if(Wt)try{Ga={},Object.defineProperty(Ga,"passive",{get:function(){Jr=!0}}),window.addEventListener("test",Ga,Ga),window.removeEventListener("test",Ga,Ga)}catch{Jr=!1}var Ga,bl=null,Lo=null,yu=null;function jm(){if(yu)return yu;var e,t=Lo,l=t.length,a,i="value"in bl?bl.value:bl.textContent,n=i.length;for(e=0;e<l&&t[e]===i[e];e++);var u=l-e;for(a=1;a<=u&&t[l-a]===i[n-a];a++);return yu=i.slice(e,1<a?1-a:void 0)}function gu(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function tu(){return!0}function ad(){return!1}function Le(e){function t(l,a,i,n,u){this._reactName=l,this._targetInst=i,this.type=a,this.nativeEvent=n,this.target=u,this.currentTarget=null;for(var s in e)e.hasOwnProperty(s)&&(l=e[s],this[s]=l?l(n):n[s]);return this.isDefaultPrevented=(n.defaultPrevented!=null?n.defaultPrevented:n.returnValue===!1)?tu:ad,this.isPropagationStopped=ad,this}return ee(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var l=this.nativeEvent;l&&(l.preventDefault?l.preventDefault():typeof l.returnValue!="unknown"&&(l.returnValue=!1),this.isDefaultPrevented=tu)},stopPropagation:function(){var l=this.nativeEvent;l&&(l.stopPropagation?l.stopPropagation():typeof l.cancelBubble!="unknown"&&(l.cancelBubble=!0),this.isPropagationStopped=tu)},persist:function(){},isPersistent:tu}),t}var ra={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},ns=Le(ra),Tn=ee({},ra,{view:0,detail:0}),Hg=Le(Tn),rr,or,Hi,us=ee({},Tn,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:qo,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Hi&&(Hi&&e.type==="mousemove"?(rr=e.screenX-Hi.screenX,or=e.screenY-Hi.screenY):or=rr=0,Hi=e),rr)},movementY:function(e){return"movementY"in e?e.movementY:or}}),id=Le(us),wg=ee({},us,{dataTransfer:0}),Ug=Le(wg),Bg=ee({},Tn,{relatedTarget:0}),cr=Le(Bg),Yg=ee({},ra,{animationName:0,elapsedTime:0,pseudoElement:0}),Lg=Le(Yg),qg=ee({},ra,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Xg=Le(qg),jg=ee({},ra,{data:0}),nd=Le(jg),Zg={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Vg={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Qg={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Kg(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Qg[e])?!!t[e]:!1}function qo(){return Kg}var Fg=ee({},Tn,{key:function(e){if(e.key){var t=Zg[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=gu(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Vg[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:qo,charCode:function(e){return e.type==="keypress"?gu(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?gu(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Jg=Le(Fg),Pg=ee({},us,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),ud=Le(Pg),kg=ee({},Tn,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:qo}),Wg=Le(kg),$g=ee({},ra,{propertyName:0,elapsedTime:0,pseudoElement:0}),Ig=Le($g),ev=ee({},us,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),tv=Le(ev),lv=ee({},ra,{newState:0,oldState:0}),av=Le(lv),iv=[9,13,27,32],Xo=Wt&&"CompositionEvent"in window,Qi=null;Wt&&"documentMode"in document&&(Qi=document.documentMode);var nv=Wt&&"TextEvent"in window&&!Qi,Zm=Wt&&(!Xo||Qi&&8<Qi&&11>=Qi),sd=" ",rd=!1;function Vm(e,t){switch(e){case"keyup":return iv.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Qm(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var wa=!1;function uv(e,t){switch(e){case"compositionend":return Qm(t);case"keypress":return t.which!==32?null:(rd=!0,sd);case"textInput":return e=t.data,e===sd&&rd?null:e;default:return null}}function sv(e,t){if(wa)return e==="compositionend"||!Xo&&Vm(e,t)?(e=jm(),yu=Lo=bl=null,wa=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Zm&&t.locale!=="ko"?null:t.data;default:return null}}var rv={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function od(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!rv[e.type]:t==="textarea"}function Km(e,t,l,a){Ha?Qa?Qa.push(a):Qa=[a]:Ha=a,t=Wu(t,"onChange"),0<t.length&&(l=new ns("onChange","change",null,l,a),e.push({event:l,listeners:t}))}var Ki=null,sn=null;function ov(e){Xp(e,0)}function ss(e){var t=ji(e);if(Um(t))return e}function cd(e,t){if(e==="change")return t}var Fm=!1;Wt&&(Wt?(au="oninput"in document,au||(fr=document.createElement("div"),fr.setAttribute("oninput","return;"),au=typeof fr.oninput=="function"),lu=au):lu=!1,Fm=lu&&(!document.documentMode||9<document.documentMode));var lu,au,fr;function fd(){Ki&&(Ki.detachEvent("onpropertychange",Jm),sn=Ki=null)}function Jm(e){if(e.propertyName==="value"&&ss(sn)){var t=[];Km(t,sn,e,Yo(e)),Xm(ov,t)}}function cv(e,t,l){e==="focusin"?(fd(),Ki=t,sn=l,Ki.attachEvent("onpropertychange",Jm)):e==="focusout"&&fd()}function fv(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return ss(sn)}function dv(e,t){if(e==="click")return ss(t)}function mv(e,t){if(e==="input"||e==="change")return ss(t)}function hv(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Pe=typeof Object.is=="function"?Object.is:hv;function rn(e,t){if(Pe(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var l=Object.keys(e),a=Object.keys(t);if(l.length!==a.length)return!1;for(a=0;a<l.length;a++){var i=l[a];if(!jr.call(t,i)||!Pe(e[i],t[i]))return!1}return!0}function dd(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function md(e,t){var l=dd(e);e=0;for(var a;l;){if(l.nodeType===3){if(a=e+l.textContent.length,e<=t&&a>=t)return{node:l,offset:t-e};e=a}e:{for(;l;){if(l.nextSibling){l=l.nextSibling;break e}l=l.parentNode}l=void 0}l=dd(l)}}function Pm(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Pm(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function km(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=Nu(e.document);t instanceof e.HTMLIFrameElement;){try{var l=typeof t.contentWindow.location.href=="string"}catch{l=!1}if(l)e=t.contentWindow;else break;t=Nu(e.document)}return t}function jo(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}var pv=Wt&&"documentMode"in document&&11>=document.documentMode,Ua=null,Pr=null,Fi=null,kr=!1;function hd(e,t,l){var a=l.window===l?l.document:l.nodeType===9?l:l.ownerDocument;kr||Ua==null||Ua!==Nu(a)||(a=Ua,"selectionStart"in a&&jo(a)?a={start:a.selectionStart,end:a.selectionEnd}:(a=(a.ownerDocument&&a.ownerDocument.defaultView||window).getSelection(),a={anchorNode:a.anchorNode,anchorOffset:a.anchorOffset,focusNode:a.focusNode,focusOffset:a.focusOffset}),Fi&&rn(Fi,a)||(Fi=a,a=Wu(Pr,"onSelect"),0<a.length&&(t=new ns("onSelect","select",null,t,l),e.push({event:t,listeners:a}),t.target=Ua)))}function Kl(e,t){var l={};return l[e.toLowerCase()]=t.toLowerCase(),l["Webkit"+e]="webkit"+t,l["Moz"+e]="moz"+t,l}var Ba={animationend:Kl("Animation","AnimationEnd"),animationiteration:Kl("Animation","AnimationIteration"),animationstart:Kl("Animation","AnimationStart"),transitionrun:Kl("Transition","TransitionRun"),transitionstart:Kl("Transition","TransitionStart"),transitioncancel:Kl("Transition","TransitionCancel"),transitionend:Kl("Transition","TransitionEnd")},dr={},Wm={};Wt&&(Wm=document.createElement("div").style,"AnimationEvent"in window||(delete Ba.animationend.animation,delete Ba.animationiteration.animation,delete Ba.animationstart.animation),"TransitionEvent"in window||delete Ba.transitionend.transition);function oa(e){if(dr[e])return dr[e];if(!Ba[e])return e;var t=Ba[e],l;for(l in t)if(t.hasOwnProperty(l)&&l in Wm)return dr[e]=t[l];return e}var $m=oa("animationend"),Im=oa("animationiteration"),eh=oa("animationstart"),yv=oa("transitionrun"),gv=oa("transitionstart"),vv=oa("transitioncancel"),th=oa("transitionend"),lh=new Map,Wr="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");Wr.push("scrollEnd");function pt(e,t){lh.set(e,t),sa(t,[e])}var Hu=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},lt=[],Ya=0,Zo=0;function rs(){for(var e=Ya,t=Zo=Ya=0;t<e;){var l=lt[t];lt[t++]=null;var a=lt[t];lt[t++]=null;var i=lt[t];lt[t++]=null;var n=lt[t];if(lt[t++]=null,a!==null&&i!==null){var u=a.pending;u===null?i.next=i:(i.next=u.next,u.next=i),a.pending=i}n!==0&&ah(l,i,n)}}function os(e,t,l,a){lt[Ya++]=e,lt[Ya++]=t,lt[Ya++]=l,lt[Ya++]=a,Zo|=a,e.lanes|=a,e=e.alternate,e!==null&&(e.lanes|=a)}function Vo(e,t,l,a){return os(e,t,l,a),wu(e)}function ca(e,t){return os(e,null,null,t),wu(e)}function ah(e,t,l){e.lanes|=l;var a=e.alternate;a!==null&&(a.lanes|=l);for(var i=!1,n=e.return;n!==null;)n.childLanes|=l,a=n.alternate,a!==null&&(a.childLanes|=l),n.tag===22&&(e=n.stateNode,e===null||e._visibility&1||(i=!0)),e=n,n=n.return;return e.tag===3?(n=e.stateNode,i&&t!==null&&(i=31-Fe(l),e=n.hiddenUpdates,a=e[i],a===null?e[i]=[t]:a.push(t),t.lane=l|536870912),n):null}function wu(e){if(50<ln)throw ln=0,bo=null,Error(v(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var La={};function bv(e,t,l,a){this.tag=e,this.key=l,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=a,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Ze(e,t,l,a){return new bv(e,t,l,a)}function Qo(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Jt(e,t){var l=e.alternate;return l===null?(l=Ze(e.tag,t,e.key,e.mode),l.elementType=e.elementType,l.type=e.type,l.stateNode=e.stateNode,l.alternate=e,e.alternate=l):(l.pendingProps=t,l.type=e.type,l.flags=0,l.subtreeFlags=0,l.deletions=null),l.flags=e.flags&65011712,l.childLanes=e.childLanes,l.lanes=e.lanes,l.child=e.child,l.memoizedProps=e.memoizedProps,l.memoizedState=e.memoizedState,l.updateQueue=e.updateQueue,t=e.dependencies,l.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},l.sibling=e.sibling,l.index=e.index,l.ref=e.ref,l.refCleanup=e.refCleanup,l}function ih(e,t){e.flags&=65011714;var l=e.alternate;return l===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=l.childLanes,e.lanes=l.lanes,e.child=l.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=l.memoizedProps,e.memoizedState=l.memoizedState,e.updateQueue=l.updateQueue,e.type=l.type,t=l.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function vu(e,t,l,a,i,n){var u=0;if(a=e,typeof e=="function")Qo(e)&&(u=1);else if(typeof e=="string")u=E1(e,l,Ct.current)?26:e==="html"||e==="head"||e==="body"?27:5;else e:switch(e){case Yr:return e=Ze(31,l,t,i),e.elementType=Yr,e.lanes=n,e;case Da:return $l(l.children,i,n,t);case xm:u=8,i|=24;break;case wr:return e=Ze(12,l,t,i|2),e.elementType=wr,e.lanes=n,e;case Ur:return e=Ze(13,l,t,i),e.elementType=Ur,e.lanes=n,e;case Br:return e=Ze(19,l,t,i),e.elementType=Br,e.lanes=n,e;default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case Qt:u=10;break e;case Tm:u=9;break e;case Do:u=11;break e;case Oo:u=14;break e;case dl:u=16,a=null;break e}u=29,l=Error(v(130,e===null?"null":typeof e,"")),a=null}return t=Ze(u,l,t,i),t.elementType=e,t.type=a,t.lanes=n,t}function $l(e,t,l,a){return e=Ze(7,e,a,t),e.lanes=l,e}function mr(e,t,l){return e=Ze(6,e,null,t),e.lanes=l,e}function nh(e){var t=Ze(18,null,null,0);return t.stateNode=e,t}function hr(e,t,l){return t=Ze(4,e.children!==null?e.children:[],e.key,t),t.lanes=l,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var pd=new WeakMap;function st(e,t){if(typeof e=="object"&&e!==null){var l=pd.get(e);return l!==void 0?l:(t={value:e,source:t,stack:kf(t)},pd.set(e,t),t)}return{value:e,source:t,stack:kf(t)}}var qa=[],Xa=0,Uu=null,on=0,it=[],nt=0,Ol=null,Et=1,xt="";function Zt(e,t){qa[Xa++]=on,qa[Xa++]=Uu,Uu=e,on=t}function uh(e,t,l){it[nt++]=Et,it[nt++]=xt,it[nt++]=Ol,Ol=e;var a=Et;e=xt;var i=32-Fe(a)-1;a&=~(1<<i),l+=1;var n=32-Fe(t)+i;if(30<n){var u=i-i%5;n=(a&(1<<u)-1).toString(32),a>>=u,i-=u,Et=1<<32-Fe(t)+i|l<<i|a,xt=n+e}else Et=1<<n|l<<i|a,xt=e}function Ko(e){e.return!==null&&(Zt(e,1),uh(e,1,0))}function Fo(e){for(;e===Uu;)Uu=qa[--Xa],qa[Xa]=null,on=qa[--Xa],qa[Xa]=null;for(;e===Ol;)Ol=it[--nt],it[nt]=null,xt=it[--nt],it[nt]=null,Et=it[--nt],it[nt]=null}function sh(e,t){it[nt++]=Et,it[nt++]=xt,it[nt++]=Ol,Et=t.id,xt=t.overflow,Ol=e}var xe=null,I=null,q=!1,Tl=null,rt=!1,$r=Error(v(519));function Nl(e){var t=Error(v(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw cn(st(t,e)),$r}function yd(e){var t=e.stateNode,l=e.type,a=e.memoizedProps;switch(t[Ee]=e,t[Ye]=a,l){case"dialog":U("cancel",t),U("close",t);break;case"iframe":case"object":case"embed":U("load",t);break;case"video":case"audio":for(l=0;l<hn.length;l++)U(hn[l],t);break;case"source":U("error",t);break;case"img":case"image":case"link":U("error",t),U("load",t);break;case"details":U("toggle",t);break;case"input":U("invalid",t),Bm(t,a.value,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name,!0);break;case"select":U("invalid",t);break;case"textarea":U("invalid",t),Lm(t,a.value,a.defaultValue,a.children)}l=a.children,typeof l!="string"&&typeof l!="number"&&typeof l!="bigint"||t.textContent===""+l||a.suppressHydrationWarning===!0||Zp(t.textContent,l)?(a.popover!=null&&(U("beforetoggle",t),U("toggle",t)),a.onScroll!=null&&U("scroll",t),a.onScrollEnd!=null&&U("scrollend",t),a.onClick!=null&&(t.onclick=Kt),t=!0):t=!1,t||Nl(e,!0)}function gd(e){for(xe=e.return;xe;)switch(xe.tag){case 5:case 31:case 13:rt=!1;return;case 27:case 3:rt=!0;return;default:xe=xe.return}}function Aa(e){if(e!==xe)return!1;if(!q)return gd(e),q=!0,!1;var t=e.tag,l;if((l=t!==3&&t!==27)&&((l=t===5)&&(l=e.type,l=!(l!=="form"&&l!=="button")||To(e.type,e.memoizedProps)),l=!l),l&&I&&Nl(e),gd(e),t===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(v(317));I=nm(e)}else if(t===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(v(317));I=nm(e)}else t===27?(t=I,Bl(e.type)?(e=zo,zo=null,I=e):I=t):I=xe?ct(e.stateNode.nextSibling):null;return!0}function la(){I=xe=null,q=!1}function pr(){var e=Tl;return e!==null&&(Ue===null?Ue=e:Ue.push.apply(Ue,e),Tl=null),e}function cn(e){Tl===null?Tl=[e]:Tl.push(e)}var Ir=Gt(null),fa=null,Ft=null;function hl(e,t,l){P(Ir,t._currentValue),t._currentValue=l}function Pt(e){e._currentValue=Ir.current,Me(Ir)}function eo(e,t,l){for(;e!==null;){var a=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,a!==null&&(a.childLanes|=t)):a!==null&&(a.childLanes&t)!==t&&(a.childLanes|=t),e===l)break;e=e.return}}function to(e,t,l,a){var i=e.child;for(i!==null&&(i.return=e);i!==null;){var n=i.dependencies;if(n!==null){var u=i.child;n=n.firstContext;e:for(;n!==null;){var s=n;n=i;for(var r=0;r<t.length;r++)if(s.context===t[r]){n.lanes|=l,s=n.alternate,s!==null&&(s.lanes|=l),eo(n.return,l,e),a||(u=null);break e}n=s.next}}else if(i.tag===18){if(u=i.return,u===null)throw Error(v(341));u.lanes|=l,n=u.alternate,n!==null&&(n.lanes|=l),eo(u,l,e),u=null}else u=i.child;if(u!==null)u.return=i;else for(u=i;u!==null;){if(u===e){u=null;break}if(i=u.sibling,i!==null){i.return=u.return,u=i;break}u=u.return}i=u}}function oi(e,t,l,a){e=null;for(var i=t,n=!1;i!==null;){if(!n){if((i.flags&524288)!==0)n=!0;else if((i.flags&262144)!==0)break}if(i.tag===10){var u=i.alternate;if(u===null)throw Error(v(387));if(u=u.memoizedProps,u!==null){var s=i.type;Pe(i.pendingProps.value,u.value)||(e!==null?e.push(s):e=[s])}}else if(i===Ru.current){if(u=i.alternate,u===null)throw Error(v(387));u.memoizedState.memoizedState!==i.memoizedState.memoizedState&&(e!==null?e.push(yn):e=[yn])}i=i.return}e!==null&&to(t,e,l,a),t.flags|=262144}function Bu(e){for(e=e.firstContext;e!==null;){if(!Pe(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function aa(e){fa=e,Ft=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function Te(e){return rh(fa,e)}function iu(e,t){return fa===null&&aa(e),rh(e,t)}function rh(e,t){var l=t._currentValue;if(t={context:t,memoizedValue:l,next:null},Ft===null){if(e===null)throw Error(v(308));Ft=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else Ft=Ft.next=t;return l}var Mv=typeof AbortController<"u"?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(l,a){e.push(a)}};this.abort=function(){t.aborted=!0,e.forEach(function(l){return l()})}},Sv=ye.unstable_scheduleCallback,Ev=ye.unstable_NormalPriority,fe={$$typeof:Qt,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Jo(){return{controller:new Mv,data:new Map,refCount:0}}function Cn(e){e.refCount--,e.refCount===0&&Sv(Ev,function(){e.controller.abort()})}var Ji=null,lo=0,Ia=0,Ka=null;function xv(e,t){if(Ji===null){var l=Ji=[];lo=0,Ia=bc(),Ka={status:"pending",value:void 0,then:function(a){l.push(a)}}}return lo++,t.then(vd,vd),t}function vd(){if(--lo===0&&Ji!==null){Ka!==null&&(Ka.status="fulfilled");var e=Ji;Ji=null,Ia=0,Ka=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function Tv(e,t){var l=[],a={status:"pending",value:null,reason:null,then:function(i){l.push(i)}};return e.then(function(){a.status="fulfilled",a.value=t;for(var i=0;i<l.length;i++)(0,l[i])(t)},function(i){for(a.status="rejected",a.reason=i,i=0;i<l.length;i++)(0,l[i])(void 0)}),a}var bd=R.S;R.S=function(e,t){Ep=Qe(),typeof t=="object"&&t!==null&&typeof t.then=="function"&&xv(e,t),bd!==null&&bd(e,t)};var Il=Gt(null);function Po(){var e=Il.current;return e!==null?e:J.pooledCache}function bu(e,t){t===null?P(Il,Il.current):P(Il,t.pool)}function oh(){var e=Po();return e===null?null:{parent:fe._currentValue,pool:e}}var ci=Error(v(460)),ko=Error(v(474)),cs=Error(v(542)),Yu={then:function(){}};function Md(e){return e=e.status,e==="fulfilled"||e==="rejected"}function ch(e,t,l){switch(l=e[l],l===void 0?e.push(t):l!==t&&(t.then(Kt,Kt),t=l),t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,Ed(e),e;default:if(typeof t.status=="string")t.then(Kt,Kt);else{if(e=J,e!==null&&100<e.shellSuspendCounter)throw Error(v(482));e=t,e.status="pending",e.then(function(a){if(t.status==="pending"){var i=t;i.status="fulfilled",i.value=a}},function(a){if(t.status==="pending"){var i=t;i.status="rejected",i.reason=a}})}switch(t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,Ed(e),e}throw ea=t,ci}}function Pl(e){try{var t=e._init;return t(e._payload)}catch(l){throw l!==null&&typeof l=="object"&&typeof l.then=="function"?(ea=l,ci):l}}var ea=null;function Sd(){if(ea===null)throw Error(v(459));var e=ea;return ea=null,e}function Ed(e){if(e===ci||e===cs)throw Error(v(483))}var Fa=null,fn=0;function nu(e){var t=fn;return fn+=1,Fa===null&&(Fa=[]),ch(Fa,e,t)}function wi(e,t){t=t.props.ref,e.ref=t!==void 0?t:null}function uu(e,t){throw t.$$typeof===cg?Error(v(525)):(e=Object.prototype.toString.call(t),Error(v(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)))}function fh(e){function t(d,o){if(e){var h=d.deletions;h===null?(d.deletions=[o],d.flags|=16):h.push(o)}}function l(d,o){if(!e)return null;for(;o!==null;)t(d,o),o=o.sibling;return null}function a(d){for(var o=new Map;d!==null;)d.key!==null?o.set(d.key,d):o.set(d.index,d),d=d.sibling;return o}function i(d,o){return d=Jt(d,o),d.index=0,d.sibling=null,d}function n(d,o,h){return d.index=h,e?(h=d.alternate,h!==null?(h=h.index,h<o?(d.flags|=67108866,o):h):(d.flags|=67108866,o)):(d.flags|=1048576,o)}function u(d){return e&&d.alternate===null&&(d.flags|=67108866),d}function s(d,o,h,g){return o===null||o.tag!==6?(o=mr(h,d.mode,g),o.return=d,o):(o=i(o,h),o.return=d,o)}function r(d,o,h,g){var C=h.type;return C===Da?f(d,o,h.props.children,g,h.key):o!==null&&(o.elementType===C||typeof C=="object"&&C!==null&&C.$$typeof===dl&&Pl(C)===o.type)?(o=i(o,h.props),wi(o,h),o.return=d,o):(o=vu(h.type,h.key,h.props,null,d.mode,g),wi(o,h),o.return=d,o)}function c(d,o,h,g){return o===null||o.tag!==4||o.stateNode.containerInfo!==h.containerInfo||o.stateNode.implementation!==h.implementation?(o=hr(h,d.mode,g),o.return=d,o):(o=i(o,h.children||[]),o.return=d,o)}function f(d,o,h,g,C){return o===null||o.tag!==7?(o=$l(h,d.mode,g,C),o.return=d,o):(o=i(o,h),o.return=d,o)}function y(d,o,h){if(typeof o=="string"&&o!==""||typeof o=="number"||typeof o=="bigint")return o=mr(""+o,d.mode,h),o.return=d,o;if(typeof o=="object"&&o!==null){switch(o.$$typeof){case kn:return h=vu(o.type,o.key,o.props,null,d.mode,h),wi(h,o),h.return=d,h;case qi:return o=hr(o,d.mode,h),o.return=d,o;case dl:return o=Pl(o),y(d,o,h)}if(Xi(o)||Ni(o))return o=$l(o,d.mode,h,null),o.return=d,o;if(typeof o.then=="function")return y(d,nu(o),h);if(o.$$typeof===Qt)return y(d,iu(d,o),h);uu(d,o)}return null}function m(d,o,h,g){var C=o!==null?o.key:null;if(typeof h=="string"&&h!==""||typeof h=="number"||typeof h=="bigint")return C!==null?null:s(d,o,""+h,g);if(typeof h=="object"&&h!==null){switch(h.$$typeof){case kn:return h.key===C?r(d,o,h,g):null;case qi:return h.key===C?c(d,o,h,g):null;case dl:return h=Pl(h),m(d,o,h,g)}if(Xi(h)||Ni(h))return C!==null?null:f(d,o,h,g,null);if(typeof h.then=="function")return m(d,o,nu(h),g);if(h.$$typeof===Qt)return m(d,o,iu(d,h),g);uu(d,h)}return null}function p(d,o,h,g,C){if(typeof g=="string"&&g!==""||typeof g=="number"||typeof g=="bigint")return d=d.get(h)||null,s(o,d,""+g,C);if(typeof g=="object"&&g!==null){switch(g.$$typeof){case kn:return d=d.get(g.key===null?h:g.key)||null,r(o,d,g,C);case qi:return d=d.get(g.key===null?h:g.key)||null,c(o,d,g,C);case dl:return g=Pl(g),p(d,o,h,g,C)}if(Xi(g)||Ni(g))return d=d.get(h)||null,f(o,d,g,C,null);if(typeof g.then=="function")return p(d,o,h,nu(g),C);if(g.$$typeof===Qt)return p(d,o,h,iu(o,g),C);uu(o,g)}return null}function M(d,o,h,g){for(var C=null,H=null,x=o,D=o=0,b=null;x!==null&&D<h.length;D++){x.index>D?(b=x,x=null):b=x.sibling;var _=m(d,x,h[D],g);if(_===null){x===null&&(x=b);break}e&&x&&_.alternate===null&&t(d,x),o=n(_,o,D),H===null?C=_:H.sibling=_,H=_,x=b}if(D===h.length)return l(d,x),q&&Zt(d,D),C;if(x===null){for(;D<h.length;D++)x=y(d,h[D],g),x!==null&&(o=n(x,o,D),H===null?C=x:H.sibling=x,H=x);return q&&Zt(d,D),C}for(x=a(x);D<h.length;D++)b=p(x,d,D,h[D],g),b!==null&&(e&&b.alternate!==null&&x.delete(b.key===null?D:b.key),o=n(b,o,D),H===null?C=b:H.sibling=b,H=b);return e&&x.forEach(function(ge){return t(d,ge)}),q&&Zt(d,D),C}function E(d,o,h,g){if(h==null)throw Error(v(151));for(var C=null,H=null,x=o,D=o=0,b=null,_=h.next();x!==null&&!_.done;D++,_=h.next()){x.index>D?(b=x,x=null):b=x.sibling;var ge=m(d,x,_.value,g);if(ge===null){x===null&&(x=b);break}e&&x&&ge.alternate===null&&t(d,x),o=n(ge,o,D),H===null?C=ge:H.sibling=ge,H=ge,x=b}if(_.done)return l(d,x),q&&Zt(d,D),C;if(x===null){for(;!_.done;D++,_=h.next())_=y(d,_.value,g),_!==null&&(o=n(_,o,D),H===null?C=_:H.sibling=_,H=_);return q&&Zt(d,D),C}for(x=a(x);!_.done;D++,_=h.next())_=p(x,d,D,_.value,g),_!==null&&(e&&_.alternate!==null&&x.delete(_.key===null?D:_.key),o=n(_,o,D),H===null?C=_:H.sibling=_,H=_);return e&&x.forEach(function(Sa){return t(d,Sa)}),q&&Zt(d,D),C}function w(d,o,h,g){if(typeof h=="object"&&h!==null&&h.type===Da&&h.key===null&&(h=h.props.children),typeof h=="object"&&h!==null){switch(h.$$typeof){case kn:e:{for(var C=h.key;o!==null;){if(o.key===C){if(C=h.type,C===Da){if(o.tag===7){l(d,o.sibling),g=i(o,h.props.children),g.return=d,d=g;break e}}else if(o.elementType===C||typeof C=="object"&&C!==null&&C.$$typeof===dl&&Pl(C)===o.type){l(d,o.sibling),g=i(o,h.props),wi(g,h),g.return=d,d=g;break e}l(d,o);break}else t(d,o);o=o.sibling}h.type===Da?(g=$l(h.props.children,d.mode,g,h.key),g.return=d,d=g):(g=vu(h.type,h.key,h.props,null,d.mode,g),wi(g,h),g.return=d,d=g)}return u(d);case qi:e:{for(C=h.key;o!==null;){if(o.key===C)if(o.tag===4&&o.stateNode.containerInfo===h.containerInfo&&o.stateNode.implementation===h.implementation){l(d,o.sibling),g=i(o,h.children||[]),g.return=d,d=g;break e}else{l(d,o);break}else t(d,o);o=o.sibling}g=hr(h,d.mode,g),g.return=d,d=g}return u(d);case dl:return h=Pl(h),w(d,o,h,g)}if(Xi(h))return M(d,o,h,g);if(Ni(h)){if(C=Ni(h),typeof C!="function")throw Error(v(150));return h=C.call(h),E(d,o,h,g)}if(typeof h.then=="function")return w(d,o,nu(h),g);if(h.$$typeof===Qt)return w(d,o,iu(d,h),g);uu(d,h)}return typeof h=="string"&&h!==""||typeof h=="number"||typeof h=="bigint"?(h=""+h,o!==null&&o.tag===6?(l(d,o.sibling),g=i(o,h),g.return=d,d=g):(l(d,o),g=mr(h,d.mode,g),g.return=d,d=g),u(d)):l(d,o)}return function(d,o,h,g){try{fn=0;var C=w(d,o,h,g);return Fa=null,C}catch(x){if(x===ci||x===cs)throw x;var H=Ze(29,x,null,d.mode);return H.lanes=g,H.return=d,H}}}var ia=fh(!0),dh=fh(!1),ml=!1;function Wo(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function ao(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function Cl(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function Gl(e,t,l){var a=e.updateQueue;if(a===null)return null;if(a=a.shared,(X&2)!==0){var i=a.pending;return i===null?t.next=t:(t.next=i.next,i.next=t),a.pending=t,t=wu(e),ah(e,null,l),t}return os(e,a,t,l),wu(e)}function Pi(e,t,l){if(t=t.updateQueue,t!==null&&(t=t.shared,(l&4194048)!==0)){var a=t.lanes;a&=e.pendingLanes,l|=a,t.lanes=l,_m(e,l)}}function yr(e,t){var l=e.updateQueue,a=e.alternate;if(a!==null&&(a=a.updateQueue,l===a)){var i=null,n=null;if(l=l.firstBaseUpdate,l!==null){do{var u={lane:l.lane,tag:l.tag,payload:l.payload,callback:null,next:null};n===null?i=n=u:n=n.next=u,l=l.next}while(l!==null);n===null?i=n=t:n=n.next=t}else i=n=t;l={baseState:a.baseState,firstBaseUpdate:i,lastBaseUpdate:n,shared:a.shared,callbacks:a.callbacks},e.updateQueue=l;return}e=l.lastBaseUpdate,e===null?l.firstBaseUpdate=t:e.next=t,l.lastBaseUpdate=t}var io=!1;function ki(){if(io){var e=Ka;if(e!==null)throw e}}function Wi(e,t,l,a){io=!1;var i=e.updateQueue;ml=!1;var n=i.firstBaseUpdate,u=i.lastBaseUpdate,s=i.shared.pending;if(s!==null){i.shared.pending=null;var r=s,c=r.next;r.next=null,u===null?n=c:u.next=c,u=r;var f=e.alternate;f!==null&&(f=f.updateQueue,s=f.lastBaseUpdate,s!==u&&(s===null?f.firstBaseUpdate=c:s.next=c,f.lastBaseUpdate=r))}if(n!==null){var y=i.baseState;u=0,f=c=r=null,s=n;do{var m=s.lane&-536870913,p=m!==s.lane;if(p?(Y&m)===m:(a&m)===m){m!==0&&m===Ia&&(io=!0),f!==null&&(f=f.next={lane:0,tag:s.tag,payload:s.payload,callback:null,next:null});e:{var M=e,E=s;m=t;var w=l;switch(E.tag){case 1:if(M=E.payload,typeof M=="function"){y=M.call(w,y,m);break e}y=M;break e;case 3:M.flags=M.flags&-65537|128;case 0:if(M=E.payload,m=typeof M=="function"?M.call(w,y,m):M,m==null)break e;y=ee({},y,m);break e;case 2:ml=!0}}m=s.callback,m!==null&&(e.flags|=64,p&&(e.flags|=8192),p=i.callbacks,p===null?i.callbacks=[m]:p.push(m))}else p={lane:m,tag:s.tag,payload:s.payload,callback:s.callback,next:null},f===null?(c=f=p,r=y):f=f.next=p,u|=m;if(s=s.next,s===null){if(s=i.shared.pending,s===null)break;p=s,s=p.next,p.next=null,i.lastBaseUpdate=p,i.shared.pending=null}}while(!0);f===null&&(r=y),i.baseState=r,i.firstBaseUpdate=c,i.lastBaseUpdate=f,n===null&&(i.shared.lanes=0),wl|=u,e.lanes=u,e.memoizedState=y}}function mh(e,t){if(typeof e!="function")throw Error(v(191,e));e.call(t)}function hh(e,t){var l=e.callbacks;if(l!==null)for(e.callbacks=null,e=0;e<l.length;e++)mh(l[e],t)}var ei=Gt(null),Lu=Gt(0);function xd(e,t){e=tl,P(Lu,e),P(ei,t),tl=e|t.baseLanes}function no(){P(Lu,tl),P(ei,ei.current)}function $o(){tl=Lu.current,Me(ei),Me(Lu)}var ke=Gt(null),ot=null;function pl(e){var t=e.alternate;P(se,se.current&1),P(ke,e),ot===null&&(t===null||ei.current!==null||t.memoizedState!==null)&&(ot=e)}function uo(e){P(se,se.current),P(ke,e),ot===null&&(ot=e)}function ph(e){e.tag===22?(P(se,se.current),P(ke,e),ot===null&&(ot=e)):yl(e)}function yl(){P(se,se.current),P(ke,ke.current)}function je(e){Me(ke),ot===e&&(ot=null),Me(se)}var se=Gt(0);function qu(e){for(var t=e;t!==null;){if(t.tag===13){var l=t.memoizedState;if(l!==null&&(l=l.dehydrated,l===null||Go(l)||Ao(l)))return t}else if(t.tag===19&&(t.memoizedProps.revealOrder==="forwards"||t.memoizedProps.revealOrder==="backwards"||t.memoizedProps.revealOrder==="unstable_legacy-backwards"||t.memoizedProps.revealOrder==="together")){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var $t=0,N=null,F=null,oe=null,Xu=!1,Ja=!1,na=!1,ju=0,dn=0,Pa=null,Cv=0;function ie(){throw Error(v(321))}function Io(e,t){if(t===null)return!1;for(var l=0;l<t.length&&l<e.length;l++)if(!Pe(e[l],t[l]))return!1;return!0}function ec(e,t,l,a,i,n){return $t=n,N=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,R.H=e===null||e.memoizedState===null?Kh:fc,na=!1,n=l(a,i),na=!1,Ja&&(n=gh(t,l,a,i)),yh(e),n}function yh(e){R.H=mn;var t=F!==null&&F.next!==null;if($t=0,oe=F=N=null,Xu=!1,dn=0,Pa=null,t)throw Error(v(300));e===null||de||(e=e.dependencies,e!==null&&Bu(e)&&(de=!0))}function gh(e,t,l,a){N=e;var i=0;do{if(Ja&&(Pa=null),dn=0,Ja=!1,25<=i)throw Error(v(301));if(i+=1,oe=F=null,e.updateQueue!=null){var n=e.updateQueue;n.lastEffect=null,n.events=null,n.stores=null,n.memoCache!=null&&(n.memoCache.index=0)}R.H=Fh,n=t(l,a)}while(Ja);return n}function Gv(){var e=R.H,t=e.useState()[0];return t=typeof t.then=="function"?Gn(t):t,e=e.useState()[0],(F!==null?F.memoizedState:null)!==e&&(N.flags|=1024),t}function tc(){var e=ju!==0;return ju=0,e}function lc(e,t,l){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~l}function ac(e){if(Xu){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}Xu=!1}$t=0,oe=F=N=null,Ja=!1,dn=ju=0,Pa=null}function De(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return oe===null?N.memoizedState=oe=e:oe=oe.next=e,oe}function re(){if(F===null){var e=N.alternate;e=e!==null?e.memoizedState:null}else e=F.next;var t=oe===null?N.memoizedState:oe.next;if(t!==null)oe=t,F=e;else{if(e===null)throw N.alternate===null?Error(v(467)):Error(v(310));F=e,e={memoizedState:F.memoizedState,baseState:F.baseState,baseQueue:F.baseQueue,queue:F.queue,next:null},oe===null?N.memoizedState=oe=e:oe=oe.next=e}return oe}function fs(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Gn(e){var t=dn;return dn+=1,Pa===null&&(Pa=[]),e=ch(Pa,e,t),t=N,(oe===null?t.memoizedState:oe.next)===null&&(t=t.alternate,R.H=t===null||t.memoizedState===null?Kh:fc),e}function ds(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return Gn(e);if(e.$$typeof===Qt)return Te(e)}throw Error(v(438,String(e)))}function ic(e){var t=null,l=N.updateQueue;if(l!==null&&(t=l.memoCache),t==null){var a=N.alternate;a!==null&&(a=a.updateQueue,a!==null&&(a=a.memoCache,a!=null&&(t={data:a.data.map(function(i){return i.slice()}),index:0})))}if(t==null&&(t={data:[],index:0}),l===null&&(l=fs(),N.updateQueue=l),l.memoCache=t,l=t.data[t.index],l===void 0)for(l=t.data[t.index]=Array(e),a=0;a<e;a++)l[a]=fg;return t.index++,l}function It(e,t){return typeof t=="function"?t(e):t}function Mu(e){var t=re();return nc(t,F,e)}function nc(e,t,l){var a=e.queue;if(a===null)throw Error(v(311));a.lastRenderedReducer=l;var i=e.baseQueue,n=a.pending;if(n!==null){if(i!==null){var u=i.next;i.next=n.next,n.next=u}t.baseQueue=i=n,a.pending=null}if(n=e.baseState,i===null)e.memoizedState=n;else{t=i.next;var s=u=null,r=null,c=t,f=!1;do{var y=c.lane&-536870913;if(y!==c.lane?(Y&y)===y:($t&y)===y){var m=c.revertLane;if(m===0)r!==null&&(r=r.next={lane:0,revertLane:0,gesture:null,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),y===Ia&&(f=!0);else if(($t&m)===m){c=c.next,m===Ia&&(f=!0);continue}else y={lane:0,revertLane:c.revertLane,gesture:null,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null},r===null?(s=r=y,u=n):r=r.next=y,N.lanes|=m,wl|=m;y=c.action,na&&l(n,y),n=c.hasEagerState?c.eagerState:l(n,y)}else m={lane:y,revertLane:c.revertLane,gesture:c.gesture,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null},r===null?(s=r=m,u=n):r=r.next=m,N.lanes|=y,wl|=y;c=c.next}while(c!==null&&c!==t);if(r===null?u=n:r.next=s,!Pe(n,e.memoizedState)&&(de=!0,f&&(l=Ka,l!==null)))throw l;e.memoizedState=n,e.baseState=u,e.baseQueue=r,a.lastRenderedState=n}return i===null&&(a.lanes=0),[e.memoizedState,a.dispatch]}function gr(e){var t=re(),l=t.queue;if(l===null)throw Error(v(311));l.lastRenderedReducer=e;var a=l.dispatch,i=l.pending,n=t.memoizedState;if(i!==null){l.pending=null;var u=i=i.next;do n=e(n,u.action),u=u.next;while(u!==i);Pe(n,t.memoizedState)||(de=!0),t.memoizedState=n,t.baseQueue===null&&(t.baseState=n),l.lastRenderedState=n}return[n,a]}function vh(e,t,l){var a=N,i=re(),n=q;if(n){if(l===void 0)throw Error(v(407));l=l()}else l=t();var u=!Pe((F||i).memoizedState,l);if(u&&(i.memoizedState=l,de=!0),i=i.queue,uc(Sh.bind(null,a,i,e),[e]),i.getSnapshot!==t||u||oe!==null&&oe.memoizedState.tag&1){if(a.flags|=2048,ti(9,{destroy:void 0},Mh.bind(null,a,i,l,t),null),J===null)throw Error(v(349));n||($t&127)!==0||bh(a,t,l)}return l}function bh(e,t,l){e.flags|=16384,e={getSnapshot:t,value:l},t=N.updateQueue,t===null?(t=fs(),N.updateQueue=t,t.stores=[e]):(l=t.stores,l===null?t.stores=[e]:l.push(e))}function Mh(e,t,l,a){t.value=l,t.getSnapshot=a,Eh(t)&&xh(e)}function Sh(e,t,l){return l(function(){Eh(t)&&xh(e)})}function Eh(e){var t=e.getSnapshot;e=e.value;try{var l=t();return!Pe(e,l)}catch{return!0}}function xh(e){var t=ca(e,2);t!==null&&Be(t,e,2)}function so(e){var t=De();if(typeof e=="function"){var l=e;if(e=l(),na){vl(!0);try{l()}finally{vl(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:It,lastRenderedState:e},t}function Th(e,t,l,a){return e.baseState=l,nc(e,F,typeof a=="function"?a:It)}function Av(e,t,l,a,i){if(hs(e))throw Error(v(485));if(e=t.action,e!==null){var n={payload:i,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(u){n.listeners.push(u)}};R.T!==null?l(!0):n.isTransition=!1,a(n),l=t.pending,l===null?(n.next=t.pending=n,Ch(t,n)):(n.next=l.next,t.pending=l.next=n)}}function Ch(e,t){var l=t.action,a=t.payload,i=e.state;if(t.isTransition){var n=R.T,u={};R.T=u;try{var s=l(i,a),r=R.S;r!==null&&r(u,s),Td(e,t,s)}catch(c){ro(e,t,c)}finally{n!==null&&u.types!==null&&(n.types=u.types),R.T=n}}else try{n=l(i,a),Td(e,t,n)}catch(c){ro(e,t,c)}}function Td(e,t,l){l!==null&&typeof l=="object"&&typeof l.then=="function"?l.then(function(a){Cd(e,t,a)},function(a){return ro(e,t,a)}):Cd(e,t,l)}function Cd(e,t,l){t.status="fulfilled",t.value=l,Gh(t),e.state=l,t=e.pending,t!==null&&(l=t.next,l===t?e.pending=null:(l=l.next,t.next=l,Ch(e,l)))}function ro(e,t,l){var a=e.pending;if(e.pending=null,a!==null){a=a.next;do t.status="rejected",t.reason=l,Gh(t),t=t.next;while(t!==a)}e.action=null}function Gh(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function Ah(e,t){return t}function Gd(e,t){if(q){var l=J.formState;if(l!==null){e:{var a=N;if(q){if(I){t:{for(var i=I,n=rt;i.nodeType!==8;){if(!n){i=null;break t}if(i=ct(i.nextSibling),i===null){i=null;break t}}n=i.data,i=n==="F!"||n==="F"?i:null}if(i){I=ct(i.nextSibling),a=i.data==="F!";break e}}Nl(a)}a=!1}a&&(t=l[0])}}return l=De(),l.memoizedState=l.baseState=t,a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Ah,lastRenderedState:t},l.queue=a,l=Zh.bind(null,N,a),a.dispatch=l,a=so(!1),n=cc.bind(null,N,!1,a.queue),a=De(),i={state:t,dispatch:null,action:e,pending:null},a.queue=i,l=Av.bind(null,N,i,n,l),i.dispatch=l,a.memoizedState=e,[t,l,!1]}function Ad(e){var t=re();return zh(t,F,e)}function zh(e,t,l){if(t=nc(e,t,Ah)[0],e=Mu(It)[0],typeof t=="object"&&t!==null&&typeof t.then=="function")try{var a=Gn(t)}catch(u){throw u===ci?cs:u}else a=t;t=re();var i=t.queue,n=i.dispatch;return l!==t.memoizedState&&(N.flags|=2048,ti(9,{destroy:void 0},zv.bind(null,i,l),null)),[a,n,e]}function zv(e,t){e.action=t}function zd(e){var t=re(),l=F;if(l!==null)return zh(t,l,e);re(),t=t.memoizedState,l=re();var a=l.queue.dispatch;return l.memoizedState=e,[t,a,!1]}function ti(e,t,l,a){return e={tag:e,create:l,deps:a,inst:t,next:null},t=N.updateQueue,t===null&&(t=fs(),N.updateQueue=t),l=t.lastEffect,l===null?t.lastEffect=e.next=e:(a=l.next,l.next=e,e.next=a,t.lastEffect=e),e}function Rh(){return re().memoizedState}function Su(e,t,l,a){var i=De();N.flags|=e,i.memoizedState=ti(1|t,{destroy:void 0},l,a===void 0?null:a)}function ms(e,t,l,a){var i=re();a=a===void 0?null:a;var n=i.memoizedState.inst;F!==null&&a!==null&&Io(a,F.memoizedState.deps)?i.memoizedState=ti(t,n,l,a):(N.flags|=e,i.memoizedState=ti(1|t,n,l,a))}function Rd(e,t){Su(8390656,8,e,t)}function uc(e,t){ms(2048,8,e,t)}function Rv(e){N.flags|=4;var t=N.updateQueue;if(t===null)t=fs(),N.updateQueue=t,t.events=[e];else{var l=t.events;l===null?t.events=[e]:l.push(e)}}function _h(e){var t=re().memoizedState;return Rv({ref:t,nextImpl:e}),function(){if((X&2)!==0)throw Error(v(440));return t.impl.apply(void 0,arguments)}}function Dh(e,t){return ms(4,2,e,t)}function Oh(e,t){return ms(4,4,e,t)}function Nh(e,t){if(typeof t=="function"){e=e();var l=t(e);return function(){typeof l=="function"?l():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Hh(e,t,l){l=l!=null?l.concat([e]):null,ms(4,4,Nh.bind(null,t,e),l)}function sc(){}function wh(e,t){var l=re();t=t===void 0?null:t;var a=l.memoizedState;return t!==null&&Io(t,a[1])?a[0]:(l.memoizedState=[e,t],e)}function Uh(e,t){var l=re();t=t===void 0?null:t;var a=l.memoizedState;if(t!==null&&Io(t,a[1]))return a[0];if(a=e(),na){vl(!0);try{e()}finally{vl(!1)}}return l.memoizedState=[a,t],a}function rc(e,t,l){return l===void 0||($t&1073741824)!==0&&(Y&261930)===0?e.memoizedState=t:(e.memoizedState=l,e=Tp(),N.lanes|=e,wl|=e,l)}function Bh(e,t,l,a){return Pe(l,t)?l:ei.current!==null?(e=rc(e,l,a),Pe(e,t)||(de=!0),e):($t&42)===0||($t&1073741824)!==0&&(Y&261930)===0?(de=!0,e.memoizedState=l):(e=Tp(),N.lanes|=e,wl|=e,t)}function Yh(e,t,l,a,i){var n=j.p;j.p=n!==0&&8>n?n:8;var u=R.T,s={};R.T=s,cc(e,!1,t,l);try{var r=i(),c=R.S;if(c!==null&&c(s,r),r!==null&&typeof r=="object"&&typeof r.then=="function"){var f=Tv(r,a);$i(e,t,f,Je(e))}else $i(e,t,a,Je(e))}catch(y){$i(e,t,{then:function(){},status:"rejected",reason:y},Je())}finally{j.p=n,u!==null&&s.types!==null&&(u.types=s.types),R.T=u}}function _v(){}function oo(e,t,l,a){if(e.tag!==5)throw Error(v(476));var i=Lh(e).queue;Yh(e,i,t,Wl,l===null?_v:function(){return qh(e),l(a)})}function Lh(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:Wl,baseState:Wl,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:It,lastRenderedState:Wl},next:null};var l={};return t.next={memoizedState:l,baseState:l,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:It,lastRenderedState:l},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function qh(e){var t=Lh(e);t.next===null&&(t=e.alternate.memoizedState),$i(e,t.next.queue,{},Je())}function oc(){return Te(yn)}function Xh(){return re().memoizedState}function jh(){return re().memoizedState}function Dv(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var l=Je();e=Cl(l);var a=Gl(t,e,l);a!==null&&(Be(a,t,l),Pi(a,t,l)),t={cache:Jo()},e.payload=t;return}t=t.return}}function Ov(e,t,l){var a=Je();l={lane:a,revertLane:0,gesture:null,action:l,hasEagerState:!1,eagerState:null,next:null},hs(e)?Vh(t,l):(l=Vo(e,t,l,a),l!==null&&(Be(l,e,a),Qh(l,t,a)))}function Zh(e,t,l){var a=Je();$i(e,t,l,a)}function $i(e,t,l,a){var i={lane:a,revertLane:0,gesture:null,action:l,hasEagerState:!1,eagerState:null,next:null};if(hs(e))Vh(t,i);else{var n=e.alternate;if(e.lanes===0&&(n===null||n.lanes===0)&&(n=t.lastRenderedReducer,n!==null))try{var u=t.lastRenderedState,s=n(u,l);if(i.hasEagerState=!0,i.eagerState=s,Pe(s,u))return os(e,t,i,0),J===null&&rs(),!1}catch{}if(l=Vo(e,t,i,a),l!==null)return Be(l,e,a),Qh(l,t,a),!0}return!1}function cc(e,t,l,a){if(a={lane:2,revertLane:bc(),gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null},hs(e)){if(t)throw Error(v(479))}else t=Vo(e,l,a,2),t!==null&&Be(t,e,2)}function hs(e){var t=e.alternate;return e===N||t!==null&&t===N}function Vh(e,t){Ja=Xu=!0;var l=e.pending;l===null?t.next=t:(t.next=l.next,l.next=t),e.pending=t}function Qh(e,t,l){if((l&4194048)!==0){var a=t.lanes;a&=e.pendingLanes,l|=a,t.lanes=l,_m(e,l)}}var mn={readContext:Te,use:ds,useCallback:ie,useContext:ie,useEffect:ie,useImperativeHandle:ie,useLayoutEffect:ie,useInsertionEffect:ie,useMemo:ie,useReducer:ie,useRef:ie,useState:ie,useDebugValue:ie,useDeferredValue:ie,useTransition:ie,useSyncExternalStore:ie,useId:ie,useHostTransitionStatus:ie,useFormState:ie,useActionState:ie,useOptimistic:ie,useMemoCache:ie,useCacheRefresh:ie};mn.useEffectEvent=ie;var Kh={readContext:Te,use:ds,useCallback:function(e,t){return De().memoizedState=[e,t===void 0?null:t],e},useContext:Te,useEffect:Rd,useImperativeHandle:function(e,t,l){l=l!=null?l.concat([e]):null,Su(4194308,4,Nh.bind(null,t,e),l)},useLayoutEffect:function(e,t){return Su(4194308,4,e,t)},useInsertionEffect:function(e,t){Su(4,2,e,t)},useMemo:function(e,t){var l=De();t=t===void 0?null:t;var a=e();if(na){vl(!0);try{e()}finally{vl(!1)}}return l.memoizedState=[a,t],a},useReducer:function(e,t,l){var a=De();if(l!==void 0){var i=l(t);if(na){vl(!0);try{l(t)}finally{vl(!1)}}}else i=t;return a.memoizedState=a.baseState=i,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:i},a.queue=e,e=e.dispatch=Ov.bind(null,N,e),[a.memoizedState,e]},useRef:function(e){var t=De();return e={current:e},t.memoizedState=e},useState:function(e){e=so(e);var t=e.queue,l=Zh.bind(null,N,t);return t.dispatch=l,[e.memoizedState,l]},useDebugValue:sc,useDeferredValue:function(e,t){var l=De();return rc(l,e,t)},useTransition:function(){var e=so(!1);return e=Yh.bind(null,N,e.queue,!0,!1),De().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,l){var a=N,i=De();if(q){if(l===void 0)throw Error(v(407));l=l()}else{if(l=t(),J===null)throw Error(v(349));(Y&127)!==0||bh(a,t,l)}i.memoizedState=l;var n={value:l,getSnapshot:t};return i.queue=n,Rd(Sh.bind(null,a,n,e),[e]),a.flags|=2048,ti(9,{destroy:void 0},Mh.bind(null,a,n,l,t),null),l},useId:function(){var e=De(),t=J.identifierPrefix;if(q){var l=xt,a=Et;l=(a&~(1<<32-Fe(a)-1)).toString(32)+l,t="_"+t+"R_"+l,l=ju++,0<l&&(t+="H"+l.toString(32)),t+="_"}else l=Cv++,t="_"+t+"r_"+l.toString(32)+"_";return e.memoizedState=t},useHostTransitionStatus:oc,useFormState:Gd,useActionState:Gd,useOptimistic:function(e){var t=De();t.memoizedState=t.baseState=e;var l={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=l,t=cc.bind(null,N,!0,l),l.dispatch=t,[e,t]},useMemoCache:ic,useCacheRefresh:function(){return De().memoizedState=Dv.bind(null,N)},useEffectEvent:function(e){var t=De(),l={impl:e};return t.memoizedState=l,function(){if((X&2)!==0)throw Error(v(440));return l.impl.apply(void 0,arguments)}}},fc={readContext:Te,use:ds,useCallback:wh,useContext:Te,useEffect:uc,useImperativeHandle:Hh,useInsertionEffect:Dh,useLayoutEffect:Oh,useMemo:Uh,useReducer:Mu,useRef:Rh,useState:function(){return Mu(It)},useDebugValue:sc,useDeferredValue:function(e,t){var l=re();return Bh(l,F.memoizedState,e,t)},useTransition:function(){var e=Mu(It)[0],t=re().memoizedState;return[typeof e=="boolean"?e:Gn(e),t]},useSyncExternalStore:vh,useId:Xh,useHostTransitionStatus:oc,useFormState:Ad,useActionState:Ad,useOptimistic:function(e,t){var l=re();return Th(l,F,e,t)},useMemoCache:ic,useCacheRefresh:jh};fc.useEffectEvent=_h;var Fh={readContext:Te,use:ds,useCallback:wh,useContext:Te,useEffect:uc,useImperativeHandle:Hh,useInsertionEffect:Dh,useLayoutEffect:Oh,useMemo:Uh,useReducer:gr,useRef:Rh,useState:function(){return gr(It)},useDebugValue:sc,useDeferredValue:function(e,t){var l=re();return F===null?rc(l,e,t):Bh(l,F.memoizedState,e,t)},useTransition:function(){var e=gr(It)[0],t=re().memoizedState;return[typeof e=="boolean"?e:Gn(e),t]},useSyncExternalStore:vh,useId:Xh,useHostTransitionStatus:oc,useFormState:zd,useActionState:zd,useOptimistic:function(e,t){var l=re();return F!==null?Th(l,F,e,t):(l.baseState=e,[e,l.queue.dispatch])},useMemoCache:ic,useCacheRefresh:jh};Fh.useEffectEvent=_h;function vr(e,t,l,a){t=e.memoizedState,l=l(a,t),l=l==null?t:ee({},t,l),e.memoizedState=l,e.lanes===0&&(e.updateQueue.baseState=l)}var co={enqueueSetState:function(e,t,l){e=e._reactInternals;var a=Je(),i=Cl(a);i.payload=t,l!=null&&(i.callback=l),t=Gl(e,i,a),t!==null&&(Be(t,e,a),Pi(t,e,a))},enqueueReplaceState:function(e,t,l){e=e._reactInternals;var a=Je(),i=Cl(a);i.tag=1,i.payload=t,l!=null&&(i.callback=l),t=Gl(e,i,a),t!==null&&(Be(t,e,a),Pi(t,e,a))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var l=Je(),a=Cl(l);a.tag=2,t!=null&&(a.callback=t),t=Gl(e,a,l),t!==null&&(Be(t,e,l),Pi(t,e,l))}};function _d(e,t,l,a,i,n,u){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(a,n,u):t.prototype&&t.prototype.isPureReactComponent?!rn(l,a)||!rn(i,n):!0}function Dd(e,t,l,a){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(l,a),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(l,a),t.state!==e&&co.enqueueReplaceState(t,t.state,null)}function ua(e,t){var l=t;if("ref"in t){l={};for(var a in t)a!=="ref"&&(l[a]=t[a])}if(e=e.defaultProps){l===t&&(l=ee({},l));for(var i in e)l[i]===void 0&&(l[i]=e[i])}return l}function Jh(e){Hu(e)}function Ph(e){console.error(e)}function kh(e){Hu(e)}function Zu(e,t){try{var l=e.onUncaughtError;l(t.value,{componentStack:t.stack})}catch(a){setTimeout(function(){throw a})}}function Od(e,t,l){try{var a=e.onCaughtError;a(l.value,{componentStack:l.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(i){setTimeout(function(){throw i})}}function fo(e,t,l){return l=Cl(l),l.tag=3,l.payload={element:null},l.callback=function(){Zu(e,t)},l}function Wh(e){return e=Cl(e),e.tag=3,e}function $h(e,t,l,a){var i=l.type.getDerivedStateFromError;if(typeof i=="function"){var n=a.value;e.payload=function(){return i(n)},e.callback=function(){Od(t,l,a)}}var u=l.stateNode;u!==null&&typeof u.componentDidCatch=="function"&&(e.callback=function(){Od(t,l,a),typeof i!="function"&&(Al===null?Al=new Set([this]):Al.add(this));var s=a.stack;this.componentDidCatch(a.value,{componentStack:s!==null?s:""})})}function Nv(e,t,l,a,i){if(l.flags|=32768,a!==null&&typeof a=="object"&&typeof a.then=="function"){if(t=l.alternate,t!==null&&oi(t,l,i,!0),l=ke.current,l!==null){switch(l.tag){case 31:case 13:return ot===null?Ju():l.alternate===null&&ne===0&&(ne=3),l.flags&=-257,l.flags|=65536,l.lanes=i,a===Yu?l.flags|=16384:(t=l.updateQueue,t===null?l.updateQueue=new Set([a]):t.add(a),Rr(e,a,i)),!1;case 22:return l.flags|=65536,a===Yu?l.flags|=16384:(t=l.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([a])},l.updateQueue=t):(l=t.retryQueue,l===null?t.retryQueue=new Set([a]):l.add(a)),Rr(e,a,i)),!1}throw Error(v(435,l.tag))}return Rr(e,a,i),Ju(),!1}if(q)return t=ke.current,t!==null?((t.flags&65536)===0&&(t.flags|=256),t.flags|=65536,t.lanes=i,a!==$r&&(e=Error(v(422),{cause:a}),cn(st(e,l)))):(a!==$r&&(t=Error(v(423),{cause:a}),cn(st(t,l))),e=e.current.alternate,e.flags|=65536,i&=-i,e.lanes|=i,a=st(a,l),i=fo(e.stateNode,a,i),yr(e,i),ne!==4&&(ne=2)),!1;var n=Error(v(520),{cause:a});if(n=st(n,l),tn===null?tn=[n]:tn.push(n),ne!==4&&(ne=2),t===null)return!0;a=st(a,l),l=t;do{switch(l.tag){case 3:return l.flags|=65536,e=i&-i,l.lanes|=e,e=fo(l.stateNode,a,e),yr(l,e),!1;case 1:if(t=l.type,n=l.stateNode,(l.flags&128)===0&&(typeof t.getDerivedStateFromError=="function"||n!==null&&typeof n.componentDidCatch=="function"&&(Al===null||!Al.has(n))))return l.flags|=65536,i&=-i,l.lanes|=i,i=Wh(i),$h(i,e,l,a),yr(l,i),!1}l=l.return}while(l!==null);return!1}var dc=Error(v(461)),de=!1;function Se(e,t,l,a){t.child=e===null?dh(t,null,l,a):ia(t,e.child,l,a)}function Nd(e,t,l,a,i){l=l.render;var n=t.ref;if("ref"in a){var u={};for(var s in a)s!=="ref"&&(u[s]=a[s])}else u=a;return aa(t),a=ec(e,t,l,u,n,i),s=tc(),e!==null&&!de?(lc(e,t,i),el(e,t,i)):(q&&s&&Ko(t),t.flags|=1,Se(e,t,a,i),t.child)}function Hd(e,t,l,a,i){if(e===null){var n=l.type;return typeof n=="function"&&!Qo(n)&&n.defaultProps===void 0&&l.compare===null?(t.tag=15,t.type=n,Ih(e,t,n,a,i)):(e=vu(l.type,null,a,t,t.mode,i),e.ref=t.ref,e.return=t,t.child=e)}if(n=e.child,!mc(e,i)){var u=n.memoizedProps;if(l=l.compare,l=l!==null?l:rn,l(u,a)&&e.ref===t.ref)return el(e,t,i)}return t.flags|=1,e=Jt(n,a),e.ref=t.ref,e.return=t,t.child=e}function Ih(e,t,l,a,i){if(e!==null){var n=e.memoizedProps;if(rn(n,a)&&e.ref===t.ref)if(de=!1,t.pendingProps=a=n,mc(e,i))(e.flags&131072)!==0&&(de=!0);else return t.lanes=e.lanes,el(e,t,i)}return mo(e,t,l,a,i)}function ep(e,t,l,a){var i=a.children,n=e!==null?e.memoizedState:null;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),a.mode==="hidden"){if((t.flags&128)!==0){if(n=n!==null?n.baseLanes|l:l,e!==null){for(a=t.child=e.child,i=0;a!==null;)i=i|a.lanes|a.childLanes,a=a.sibling;a=i&~n}else a=0,t.child=null;return wd(e,t,n,l,a)}if((l&536870912)!==0)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&bu(t,n!==null?n.cachePool:null),n!==null?xd(t,n):no(),ph(t);else return a=t.lanes=536870912,wd(e,t,n!==null?n.baseLanes|l:l,l,a)}else n!==null?(bu(t,n.cachePool),xd(t,n),yl(t),t.memoizedState=null):(e!==null&&bu(t,null),no(),yl(t));return Se(e,t,i,l),t.child}function Zi(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function wd(e,t,l,a,i){var n=Po();return n=n===null?null:{parent:fe._currentValue,pool:n},t.memoizedState={baseLanes:l,cachePool:n},e!==null&&bu(t,null),no(),ph(t),e!==null&&oi(e,t,a,!0),t.childLanes=i,null}function Eu(e,t){return t=Vu({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function Ud(e,t,l){return ia(t,e.child,null,l),e=Eu(t,t.pendingProps),e.flags|=2,je(t),t.memoizedState=null,e}function Hv(e,t,l){var a=t.pendingProps,i=(t.flags&128)!==0;if(t.flags&=-129,e===null){if(q){if(a.mode==="hidden")return e=Eu(t,a),t.lanes=536870912,Zi(null,e);if(uo(t),(e=I)?(e=Kp(e,rt),e=e!==null&&e.data==="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Ol!==null?{id:Et,overflow:xt}:null,retryLane:536870912,hydrationErrors:null},l=nh(e),l.return=t,t.child=l,xe=t,I=null)):e=null,e===null)throw Nl(t);return t.lanes=536870912,null}return Eu(t,a)}var n=e.memoizedState;if(n!==null){var u=n.dehydrated;if(uo(t),i)if(t.flags&256)t.flags&=-257,t=Ud(e,t,l);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(v(558));else if(de||oi(e,t,l,!1),i=(l&e.childLanes)!==0,de||i){if(a=J,a!==null&&(u=Dm(a,l),u!==0&&u!==n.retryLane))throw n.retryLane=u,ca(e,u),Be(a,e,u),dc;Ju(),t=Ud(e,t,l)}else e=n.treeContext,I=ct(u.nextSibling),xe=t,q=!0,Tl=null,rt=!1,e!==null&&sh(t,e),t=Eu(t,a),t.flags|=4096;return t}return e=Jt(e.child,{mode:a.mode,children:a.children}),e.ref=t.ref,t.child=e,e.return=t,e}function xu(e,t){var l=t.ref;if(l===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof l!="function"&&typeof l!="object")throw Error(v(284));(e===null||e.ref!==l)&&(t.flags|=4194816)}}function mo(e,t,l,a,i){return aa(t),l=ec(e,t,l,a,void 0,i),a=tc(),e!==null&&!de?(lc(e,t,i),el(e,t,i)):(q&&a&&Ko(t),t.flags|=1,Se(e,t,l,i),t.child)}function Bd(e,t,l,a,i,n){return aa(t),t.updateQueue=null,l=gh(t,a,l,i),yh(e),a=tc(),e!==null&&!de?(lc(e,t,n),el(e,t,n)):(q&&a&&Ko(t),t.flags|=1,Se(e,t,l,n),t.child)}function Yd(e,t,l,a,i){if(aa(t),t.stateNode===null){var n=La,u=l.contextType;typeof u=="object"&&u!==null&&(n=Te(u)),n=new l(a,n),t.memoizedState=n.state!==null&&n.state!==void 0?n.state:null,n.updater=co,t.stateNode=n,n._reactInternals=t,n=t.stateNode,n.props=a,n.state=t.memoizedState,n.refs={},Wo(t),u=l.contextType,n.context=typeof u=="object"&&u!==null?Te(u):La,n.state=t.memoizedState,u=l.getDerivedStateFromProps,typeof u=="function"&&(vr(t,l,u,a),n.state=t.memoizedState),typeof l.getDerivedStateFromProps=="function"||typeof n.getSnapshotBeforeUpdate=="function"||typeof n.UNSAFE_componentWillMount!="function"&&typeof n.componentWillMount!="function"||(u=n.state,typeof n.componentWillMount=="function"&&n.componentWillMount(),typeof n.UNSAFE_componentWillMount=="function"&&n.UNSAFE_componentWillMount(),u!==n.state&&co.enqueueReplaceState(n,n.state,null),Wi(t,a,n,i),ki(),n.state=t.memoizedState),typeof n.componentDidMount=="function"&&(t.flags|=4194308),a=!0}else if(e===null){n=t.stateNode;var s=t.memoizedProps,r=ua(l,s);n.props=r;var c=n.context,f=l.contextType;u=La,typeof f=="object"&&f!==null&&(u=Te(f));var y=l.getDerivedStateFromProps;f=typeof y=="function"||typeof n.getSnapshotBeforeUpdate=="function",s=t.pendingProps!==s,f||typeof n.UNSAFE_componentWillReceiveProps!="function"&&typeof n.componentWillReceiveProps!="function"||(s||c!==u)&&Dd(t,n,a,u),ml=!1;var m=t.memoizedState;n.state=m,Wi(t,a,n,i),ki(),c=t.memoizedState,s||m!==c||ml?(typeof y=="function"&&(vr(t,l,y,a),c=t.memoizedState),(r=ml||_d(t,l,r,a,m,c,u))?(f||typeof n.UNSAFE_componentWillMount!="function"&&typeof n.componentWillMount!="function"||(typeof n.componentWillMount=="function"&&n.componentWillMount(),typeof n.UNSAFE_componentWillMount=="function"&&n.UNSAFE_componentWillMount()),typeof n.componentDidMount=="function"&&(t.flags|=4194308)):(typeof n.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=a,t.memoizedState=c),n.props=a,n.state=c,n.context=u,a=r):(typeof n.componentDidMount=="function"&&(t.flags|=4194308),a=!1)}else{n=t.stateNode,ao(e,t),u=t.memoizedProps,f=ua(l,u),n.props=f,y=t.pendingProps,m=n.context,c=l.contextType,r=La,typeof c=="object"&&c!==null&&(r=Te(c)),s=l.getDerivedStateFromProps,(c=typeof s=="function"||typeof n.getSnapshotBeforeUpdate=="function")||typeof n.UNSAFE_componentWillReceiveProps!="function"&&typeof n.componentWillReceiveProps!="function"||(u!==y||m!==r)&&Dd(t,n,a,r),ml=!1,m=t.memoizedState,n.state=m,Wi(t,a,n,i),ki();var p=t.memoizedState;u!==y||m!==p||ml||e!==null&&e.dependencies!==null&&Bu(e.dependencies)?(typeof s=="function"&&(vr(t,l,s,a),p=t.memoizedState),(f=ml||_d(t,l,f,a,m,p,r)||e!==null&&e.dependencies!==null&&Bu(e.dependencies))?(c||typeof n.UNSAFE_componentWillUpdate!="function"&&typeof n.componentWillUpdate!="function"||(typeof n.componentWillUpdate=="function"&&n.componentWillUpdate(a,p,r),typeof n.UNSAFE_componentWillUpdate=="function"&&n.UNSAFE_componentWillUpdate(a,p,r)),typeof n.componentDidUpdate=="function"&&(t.flags|=4),typeof n.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof n.componentDidUpdate!="function"||u===e.memoizedProps&&m===e.memoizedState||(t.flags|=4),typeof n.getSnapshotBeforeUpdate!="function"||u===e.memoizedProps&&m===e.memoizedState||(t.flags|=1024),t.memoizedProps=a,t.memoizedState=p),n.props=a,n.state=p,n.context=r,a=f):(typeof n.componentDidUpdate!="function"||u===e.memoizedProps&&m===e.memoizedState||(t.flags|=4),typeof n.getSnapshotBeforeUpdate!="function"||u===e.memoizedProps&&m===e.memoizedState||(t.flags|=1024),a=!1)}return n=a,xu(e,t),a=(t.flags&128)!==0,n||a?(n=t.stateNode,l=a&&typeof l.getDerivedStateFromError!="function"?null:n.render(),t.flags|=1,e!==null&&a?(t.child=ia(t,e.child,null,i),t.child=ia(t,null,l,i)):Se(e,t,l,i),t.memoizedState=n.state,e=t.child):e=el(e,t,i),e}function Ld(e,t,l,a){return la(),t.flags|=256,Se(e,t,l,a),t.child}var br={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Mr(e){return{baseLanes:e,cachePool:oh()}}function Sr(e,t,l){return e=e!==null?e.childLanes&~l:0,t&&(e|=Ve),e}function tp(e,t,l){var a=t.pendingProps,i=!1,n=(t.flags&128)!==0,u;if((u=n)||(u=e!==null&&e.memoizedState===null?!1:(se.current&2)!==0),u&&(i=!0,t.flags&=-129),u=(t.flags&32)!==0,t.flags&=-33,e===null){if(q){if(i?pl(t):yl(t),(e=I)?(e=Kp(e,rt),e=e!==null&&e.data!=="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Ol!==null?{id:Et,overflow:xt}:null,retryLane:536870912,hydrationErrors:null},l=nh(e),l.return=t,t.child=l,xe=t,I=null)):e=null,e===null)throw Nl(t);return Ao(e)?t.lanes=32:t.lanes=536870912,null}var s=a.children;return a=a.fallback,i?(yl(t),i=t.mode,s=Vu({mode:"hidden",children:s},i),a=$l(a,i,l,null),s.return=t,a.return=t,s.sibling=a,t.child=s,a=t.child,a.memoizedState=Mr(l),a.childLanes=Sr(e,u,l),t.memoizedState=br,Zi(null,a)):(pl(t),ho(t,s))}var r=e.memoizedState;if(r!==null&&(s=r.dehydrated,s!==null)){if(n)t.flags&256?(pl(t),t.flags&=-257,t=Er(e,t,l)):t.memoizedState!==null?(yl(t),t.child=e.child,t.flags|=128,t=null):(yl(t),s=a.fallback,i=t.mode,a=Vu({mode:"visible",children:a.children},i),s=$l(s,i,l,null),s.flags|=2,a.return=t,s.return=t,a.sibling=s,t.child=a,ia(t,e.child,null,l),a=t.child,a.memoizedState=Mr(l),a.childLanes=Sr(e,u,l),t.memoizedState=br,t=Zi(null,a));else if(pl(t),Ao(s)){if(u=s.nextSibling&&s.nextSibling.dataset,u)var c=u.dgst;u=c,a=Error(v(419)),a.stack="",a.digest=u,cn({value:a,source:null,stack:null}),t=Er(e,t,l)}else if(de||oi(e,t,l,!1),u=(l&e.childLanes)!==0,de||u){if(u=J,u!==null&&(a=Dm(u,l),a!==0&&a!==r.retryLane))throw r.retryLane=a,ca(e,a),Be(u,e,a),dc;Go(s)||Ju(),t=Er(e,t,l)}else Go(s)?(t.flags|=192,t.child=e.child,t=null):(e=r.treeContext,I=ct(s.nextSibling),xe=t,q=!0,Tl=null,rt=!1,e!==null&&sh(t,e),t=ho(t,a.children),t.flags|=4096);return t}return i?(yl(t),s=a.fallback,i=t.mode,r=e.child,c=r.sibling,a=Jt(r,{mode:"hidden",children:a.children}),a.subtreeFlags=r.subtreeFlags&65011712,c!==null?s=Jt(c,s):(s=$l(s,i,l,null),s.flags|=2),s.return=t,a.return=t,a.sibling=s,t.child=a,Zi(null,a),a=t.child,s=e.child.memoizedState,s===null?s=Mr(l):(i=s.cachePool,i!==null?(r=fe._currentValue,i=i.parent!==r?{parent:r,pool:r}:i):i=oh(),s={baseLanes:s.baseLanes|l,cachePool:i}),a.memoizedState=s,a.childLanes=Sr(e,u,l),t.memoizedState=br,Zi(e.child,a)):(pl(t),l=e.child,e=l.sibling,l=Jt(l,{mode:"visible",children:a.children}),l.return=t,l.sibling=null,e!==null&&(u=t.deletions,u===null?(t.deletions=[e],t.flags|=16):u.push(e)),t.child=l,t.memoizedState=null,l)}function ho(e,t){return t=Vu({mode:"visible",children:t},e.mode),t.return=e,e.child=t}function Vu(e,t){return e=Ze(22,e,null,t),e.lanes=0,e}function Er(e,t,l){return ia(t,e.child,null,l),e=ho(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function qd(e,t,l){e.lanes|=t;var a=e.alternate;a!==null&&(a.lanes|=t),eo(e.return,t,l)}function xr(e,t,l,a,i,n){var u=e.memoizedState;u===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:a,tail:l,tailMode:i,treeForkCount:n}:(u.isBackwards=t,u.rendering=null,u.renderingStartTime=0,u.last=a,u.tail=l,u.tailMode=i,u.treeForkCount=n)}function lp(e,t,l){var a=t.pendingProps,i=a.revealOrder,n=a.tail;a=a.children;var u=se.current,s=(u&2)!==0;if(s?(u=u&1|2,t.flags|=128):u&=1,P(se,u),Se(e,t,a,l),a=q?on:0,!s&&e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&qd(e,l,t);else if(e.tag===19)qd(e,l,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(i){case"forwards":for(l=t.child,i=null;l!==null;)e=l.alternate,e!==null&&qu(e)===null&&(i=l),l=l.sibling;l=i,l===null?(i=t.child,t.child=null):(i=l.sibling,l.sibling=null),xr(t,!1,i,l,n,a);break;case"backwards":case"unstable_legacy-backwards":for(l=null,i=t.child,t.child=null;i!==null;){if(e=i.alternate,e!==null&&qu(e)===null){t.child=i;break}e=i.sibling,i.sibling=l,l=i,i=e}xr(t,!0,l,null,n,a);break;case"together":xr(t,!1,null,null,void 0,a);break;default:t.memoizedState=null}return t.child}function el(e,t,l){if(e!==null&&(t.dependencies=e.dependencies),wl|=t.lanes,(l&t.childLanes)===0)if(e!==null){if(oi(e,t,l,!1),(l&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error(v(153));if(t.child!==null){for(e=t.child,l=Jt(e,e.pendingProps),t.child=l,l.return=t;e.sibling!==null;)e=e.sibling,l=l.sibling=Jt(e,e.pendingProps),l.return=t;l.sibling=null}return t.child}function mc(e,t){return(e.lanes&t)!==0?!0:(e=e.dependencies,!!(e!==null&&Bu(e)))}function wv(e,t,l){switch(t.tag){case 3:_u(t,t.stateNode.containerInfo),hl(t,fe,e.memoizedState.cache),la();break;case 27:case 5:Xr(t);break;case 4:_u(t,t.stateNode.containerInfo);break;case 10:hl(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,uo(t),null;break;case 13:var a=t.memoizedState;if(a!==null)return a.dehydrated!==null?(pl(t),t.flags|=128,null):(l&t.child.childLanes)!==0?tp(e,t,l):(pl(t),e=el(e,t,l),e!==null?e.sibling:null);pl(t);break;case 19:var i=(e.flags&128)!==0;if(a=(l&t.childLanes)!==0,a||(oi(e,t,l,!1),a=(l&t.childLanes)!==0),i){if(a)return lp(e,t,l);t.flags|=128}if(i=t.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),P(se,se.current),a)break;return null;case 22:return t.lanes=0,ep(e,t,l,t.pendingProps);case 24:hl(t,fe,e.memoizedState.cache)}return el(e,t,l)}function ap(e,t,l){if(e!==null)if(e.memoizedProps!==t.pendingProps)de=!0;else{if(!mc(e,l)&&(t.flags&128)===0)return de=!1,wv(e,t,l);de=(e.flags&131072)!==0}else de=!1,q&&(t.flags&1048576)!==0&&uh(t,on,t.index);switch(t.lanes=0,t.tag){case 16:e:{var a=t.pendingProps;if(e=Pl(t.elementType),t.type=e,typeof e=="function")Qo(e)?(a=ua(e,a),t.tag=1,t=Yd(null,t,e,a,l)):(t.tag=0,t=mo(null,t,e,a,l));else{if(e!=null){var i=e.$$typeof;if(i===Do){t.tag=11,t=Nd(null,t,e,a,l);break e}else if(i===Oo){t.tag=14,t=Hd(null,t,e,a,l);break e}}throw t=Lr(e)||e,Error(v(306,t,""))}}return t;case 0:return mo(e,t,t.type,t.pendingProps,l);case 1:return a=t.type,i=ua(a,t.pendingProps),Yd(e,t,a,i,l);case 3:e:{if(_u(t,t.stateNode.containerInfo),e===null)throw Error(v(387));a=t.pendingProps;var n=t.memoizedState;i=n.element,ao(e,t),Wi(t,a,null,l);var u=t.memoizedState;if(a=u.cache,hl(t,fe,a),a!==n.cache&&to(t,[fe],l,!0),ki(),a=u.element,n.isDehydrated)if(n={element:a,isDehydrated:!1,cache:u.cache},t.updateQueue.baseState=n,t.memoizedState=n,t.flags&256){t=Ld(e,t,a,l);break e}else if(a!==i){i=st(Error(v(424)),t),cn(i),t=Ld(e,t,a,l);break e}else for(e=t.stateNode.containerInfo,e.nodeType===9?e=e.body:e=e.nodeName==="HTML"?e.ownerDocument.body:e,I=ct(e.firstChild),xe=t,q=!0,Tl=null,rt=!0,l=dh(t,null,a,l),t.child=l;l;)l.flags=l.flags&-3|4096,l=l.sibling;else{if(la(),a===i){t=el(e,t,l);break e}Se(e,t,a,l)}t=t.child}return t;case 26:return xu(e,t),e===null?(l=rm(t.type,null,t.pendingProps,null))?t.memoizedState=l:q||(l=t.type,e=t.pendingProps,a=$u(xl.current).createElement(l),a[Ee]=t,a[Ye]=e,Ce(a,l,e),be(a),t.stateNode=a):t.memoizedState=rm(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return Xr(t),e===null&&q&&(a=t.stateNode=Fp(t.type,t.pendingProps,xl.current),xe=t,rt=!0,i=I,Bl(t.type)?(zo=i,I=ct(a.firstChild)):I=i),Se(e,t,t.pendingProps.children,l),xu(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&q&&((i=a=I)&&(a=o1(a,t.type,t.pendingProps,rt),a!==null?(t.stateNode=a,xe=t,I=ct(a.firstChild),rt=!1,i=!0):i=!1),i||Nl(t)),Xr(t),i=t.type,n=t.pendingProps,u=e!==null?e.memoizedProps:null,a=n.children,To(i,n)?a=null:u!==null&&To(i,u)&&(t.flags|=32),t.memoizedState!==null&&(i=ec(e,t,Gv,null,null,l),yn._currentValue=i),xu(e,t),Se(e,t,a,l),t.child;case 6:return e===null&&q&&((e=l=I)&&(l=c1(l,t.pendingProps,rt),l!==null?(t.stateNode=l,xe=t,I=null,e=!0):e=!1),e||Nl(t)),null;case 13:return tp(e,t,l);case 4:return _u(t,t.stateNode.containerInfo),a=t.pendingProps,e===null?t.child=ia(t,null,a,l):Se(e,t,a,l),t.child;case 11:return Nd(e,t,t.type,t.pendingProps,l);case 7:return Se(e,t,t.pendingProps,l),t.child;case 8:return Se(e,t,t.pendingProps.children,l),t.child;case 12:return Se(e,t,t.pendingProps.children,l),t.child;case 10:return a=t.pendingProps,hl(t,t.type,a.value),Se(e,t,a.children,l),t.child;case 9:return i=t.type._context,a=t.pendingProps.children,aa(t),i=Te(i),a=a(i),t.flags|=1,Se(e,t,a,l),t.child;case 14:return Hd(e,t,t.type,t.pendingProps,l);case 15:return Ih(e,t,t.type,t.pendingProps,l);case 19:return lp(e,t,l);case 31:return Hv(e,t,l);case 22:return ep(e,t,l,t.pendingProps);case 24:return aa(t),a=Te(fe),e===null?(i=Po(),i===null&&(i=J,n=Jo(),i.pooledCache=n,n.refCount++,n!==null&&(i.pooledCacheLanes|=l),i=n),t.memoizedState={parent:a,cache:i},Wo(t),hl(t,fe,i)):((e.lanes&l)!==0&&(ao(e,t),Wi(t,null,null,l),ki()),i=e.memoizedState,n=t.memoizedState,i.parent!==a?(i={parent:a,cache:a},t.memoizedState=i,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=i),hl(t,fe,a)):(a=n.cache,hl(t,fe,a),a!==i.cache&&to(t,[fe],l,!0))),Se(e,t,t.pendingProps.children,l),t.child;case 29:throw t.pendingProps}throw Error(v(156,t.tag))}function Lt(e){e.flags|=4}function Tr(e,t,l,a,i){if((t=(e.mode&32)!==0)&&(t=!1),t){if(e.flags|=16777216,(i&335544128)===i)if(e.stateNode.complete)e.flags|=8192;else if(Ap())e.flags|=8192;else throw ea=Yu,ko}else e.flags&=-16777217}function Xd(e,t){if(t.type!=="stylesheet"||(t.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!kp(t))if(Ap())e.flags|=8192;else throw ea=Yu,ko}function su(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag!==22?zm():536870912,e.lanes|=t,li|=t)}function Ui(e,t){if(!q)switch(e.tailMode){case"hidden":t=e.tail;for(var l=null;t!==null;)t.alternate!==null&&(l=t),t=t.sibling;l===null?e.tail=null:l.sibling=null;break;case"collapsed":l=e.tail;for(var a=null;l!==null;)l.alternate!==null&&(a=l),l=l.sibling;a===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:a.sibling=null}}function $(e){var t=e.alternate!==null&&e.alternate.child===e.child,l=0,a=0;if(t)for(var i=e.child;i!==null;)l|=i.lanes|i.childLanes,a|=i.subtreeFlags&65011712,a|=i.flags&65011712,i.return=e,i=i.sibling;else for(i=e.child;i!==null;)l|=i.lanes|i.childLanes,a|=i.subtreeFlags,a|=i.flags,i.return=e,i=i.sibling;return e.subtreeFlags|=a,e.childLanes=l,t}function Uv(e,t,l){var a=t.pendingProps;switch(Fo(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return $(t),null;case 1:return $(t),null;case 3:return l=t.stateNode,a=null,e!==null&&(a=e.memoizedState.cache),t.memoizedState.cache!==a&&(t.flags|=2048),Pt(fe),ka(),l.pendingContext&&(l.context=l.pendingContext,l.pendingContext=null),(e===null||e.child===null)&&(Aa(t)?Lt(t):e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,pr())),$(t),null;case 26:var i=t.type,n=t.memoizedState;return e===null?(Lt(t),n!==null?($(t),Xd(t,n)):($(t),Tr(t,i,null,a,l))):n?n!==e.memoizedState?(Lt(t),$(t),Xd(t,n)):($(t),t.flags&=-16777217):(e=e.memoizedProps,e!==a&&Lt(t),$(t),Tr(t,i,e,a,l)),null;case 27:if(Du(t),l=xl.current,i=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==a&&Lt(t);else{if(!a){if(t.stateNode===null)throw Error(v(166));return $(t),null}e=Ct.current,Aa(t)?yd(t,e):(e=Fp(i,a,l),t.stateNode=e,Lt(t))}return $(t),null;case 5:if(Du(t),i=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==a&&Lt(t);else{if(!a){if(t.stateNode===null)throw Error(v(166));return $(t),null}if(n=Ct.current,Aa(t))yd(t,n);else{var u=$u(xl.current);switch(n){case 1:n=u.createElementNS("http://www.w3.org/2000/svg",i);break;case 2:n=u.createElementNS("http://www.w3.org/1998/Math/MathML",i);break;default:switch(i){case"svg":n=u.createElementNS("http://www.w3.org/2000/svg",i);break;case"math":n=u.createElementNS("http://www.w3.org/1998/Math/MathML",i);break;case"script":n=u.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild);break;case"select":n=typeof a.is=="string"?u.createElement("select",{is:a.is}):u.createElement("select"),a.multiple?n.multiple=!0:a.size&&(n.size=a.size);break;default:n=typeof a.is=="string"?u.createElement(i,{is:a.is}):u.createElement(i)}}n[Ee]=t,n[Ye]=a;e:for(u=t.child;u!==null;){if(u.tag===5||u.tag===6)n.appendChild(u.stateNode);else if(u.tag!==4&&u.tag!==27&&u.child!==null){u.child.return=u,u=u.child;continue}if(u===t)break e;for(;u.sibling===null;){if(u.return===null||u.return===t)break e;u=u.return}u.sibling.return=u.return,u=u.sibling}t.stateNode=n;e:switch(Ce(n,i,a),i){case"button":case"input":case"select":case"textarea":a=!!a.autoFocus;break e;case"img":a=!0;break e;default:a=!1}a&&Lt(t)}}return $(t),Tr(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,l),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==a&&Lt(t);else{if(typeof a!="string"&&t.stateNode===null)throw Error(v(166));if(e=xl.current,Aa(t)){if(e=t.stateNode,l=t.memoizedProps,a=null,i=xe,i!==null)switch(i.tag){case 27:case 5:a=i.memoizedProps}e[Ee]=t,e=!!(e.nodeValue===l||a!==null&&a.suppressHydrationWarning===!0||Zp(e.nodeValue,l)),e||Nl(t,!0)}else e=$u(e).createTextNode(a),e[Ee]=t,t.stateNode=e}return $(t),null;case 31:if(l=t.memoizedState,e===null||e.memoizedState!==null){if(a=Aa(t),l!==null){if(e===null){if(!a)throw Error(v(318));if(e=t.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(v(557));e[Ee]=t}else la(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;$(t),e=!1}else l=pr(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=l),e=!0;if(!e)return t.flags&256?(je(t),t):(je(t),null);if((t.flags&128)!==0)throw Error(v(558))}return $(t),null;case 13:if(a=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(i=Aa(t),a!==null&&a.dehydrated!==null){if(e===null){if(!i)throw Error(v(318));if(i=t.memoizedState,i=i!==null?i.dehydrated:null,!i)throw Error(v(317));i[Ee]=t}else la(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;$(t),i=!1}else i=pr(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=i),i=!0;if(!i)return t.flags&256?(je(t),t):(je(t),null)}return je(t),(t.flags&128)!==0?(t.lanes=l,t):(l=a!==null,e=e!==null&&e.memoizedState!==null,l&&(a=t.child,i=null,a.alternate!==null&&a.alternate.memoizedState!==null&&a.alternate.memoizedState.cachePool!==null&&(i=a.alternate.memoizedState.cachePool.pool),n=null,a.memoizedState!==null&&a.memoizedState.cachePool!==null&&(n=a.memoizedState.cachePool.pool),n!==i&&(a.flags|=2048)),l!==e&&l&&(t.child.flags|=8192),su(t,t.updateQueue),$(t),null);case 4:return ka(),e===null&&Mc(t.stateNode.containerInfo),$(t),null;case 10:return Pt(t.type),$(t),null;case 19:if(Me(se),a=t.memoizedState,a===null)return $(t),null;if(i=(t.flags&128)!==0,n=a.rendering,n===null)if(i)Ui(a,!1);else{if(ne!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(n=qu(e),n!==null){for(t.flags|=128,Ui(a,!1),e=n.updateQueue,t.updateQueue=e,su(t,e),t.subtreeFlags=0,e=l,l=t.child;l!==null;)ih(l,e),l=l.sibling;return P(se,se.current&1|2),q&&Zt(t,a.treeForkCount),t.child}e=e.sibling}a.tail!==null&&Qe()>Ku&&(t.flags|=128,i=!0,Ui(a,!1),t.lanes=4194304)}else{if(!i)if(e=qu(n),e!==null){if(t.flags|=128,i=!0,e=e.updateQueue,t.updateQueue=e,su(t,e),Ui(a,!0),a.tail===null&&a.tailMode==="hidden"&&!n.alternate&&!q)return $(t),null}else 2*Qe()-a.renderingStartTime>Ku&&l!==536870912&&(t.flags|=128,i=!0,Ui(a,!1),t.lanes=4194304);a.isBackwards?(n.sibling=t.child,t.child=n):(e=a.last,e!==null?e.sibling=n:t.child=n,a.last=n)}return a.tail!==null?(e=a.tail,a.rendering=e,a.tail=e.sibling,a.renderingStartTime=Qe(),e.sibling=null,l=se.current,P(se,i?l&1|2:l&1),q&&Zt(t,a.treeForkCount),e):($(t),null);case 22:case 23:return je(t),$o(),a=t.memoizedState!==null,e!==null?e.memoizedState!==null!==a&&(t.flags|=8192):a&&(t.flags|=8192),a?(l&536870912)!==0&&(t.flags&128)===0&&($(t),t.subtreeFlags&6&&(t.flags|=8192)):$(t),l=t.updateQueue,l!==null&&su(t,l.retryQueue),l=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(l=e.memoizedState.cachePool.pool),a=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(a=t.memoizedState.cachePool.pool),a!==l&&(t.flags|=2048),e!==null&&Me(Il),null;case 24:return l=null,e!==null&&(l=e.memoizedState.cache),t.memoizedState.cache!==l&&(t.flags|=2048),Pt(fe),$(t),null;case 25:return null;case 30:return null}throw Error(v(156,t.tag))}function Bv(e,t){switch(Fo(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Pt(fe),ka(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return Du(t),null;case 31:if(t.memoizedState!==null){if(je(t),t.alternate===null)throw Error(v(340));la()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(je(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(v(340));la()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return Me(se),null;case 4:return ka(),null;case 10:return Pt(t.type),null;case 22:case 23:return je(t),$o(),e!==null&&Me(Il),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return Pt(fe),null;case 25:return null;default:return null}}function ip(e,t){switch(Fo(t),t.tag){case 3:Pt(fe),ka();break;case 26:case 27:case 5:Du(t);break;case 4:ka();break;case 31:t.memoizedState!==null&&je(t);break;case 13:je(t);break;case 19:Me(se);break;case 10:Pt(t.type);break;case 22:case 23:je(t),$o(),e!==null&&Me(Il);break;case 24:Pt(fe)}}function An(e,t){try{var l=t.updateQueue,a=l!==null?l.lastEffect:null;if(a!==null){var i=a.next;l=i;do{if((l.tag&e)===e){a=void 0;var n=l.create,u=l.inst;a=n(),u.destroy=a}l=l.next}while(l!==i)}}catch(s){V(t,t.return,s)}}function Hl(e,t,l){try{var a=t.updateQueue,i=a!==null?a.lastEffect:null;if(i!==null){var n=i.next;a=n;do{if((a.tag&e)===e){var u=a.inst,s=u.destroy;if(s!==void 0){u.destroy=void 0,i=t;var r=l,c=s;try{c()}catch(f){V(i,r,f)}}}a=a.next}while(a!==n)}}catch(f){V(t,t.return,f)}}function np(e){var t=e.updateQueue;if(t!==null){var l=e.stateNode;try{hh(t,l)}catch(a){V(e,e.return,a)}}}function up(e,t,l){l.props=ua(e.type,e.memoizedProps),l.state=e.memoizedState;try{l.componentWillUnmount()}catch(a){V(e,t,a)}}function Ii(e,t){try{var l=e.ref;if(l!==null){switch(e.tag){case 26:case 27:case 5:var a=e.stateNode;break;case 30:a=e.stateNode;break;default:a=e.stateNode}typeof l=="function"?e.refCleanup=l(a):l.current=a}}catch(i){V(e,t,i)}}function Tt(e,t){var l=e.ref,a=e.refCleanup;if(l!==null)if(typeof a=="function")try{a()}catch(i){V(e,t,i)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof l=="function")try{l(null)}catch(i){V(e,t,i)}else l.current=null}function sp(e){var t=e.type,l=e.memoizedProps,a=e.stateNode;try{e:switch(t){case"button":case"input":case"select":case"textarea":l.autoFocus&&a.focus();break e;case"img":l.src?a.src=l.src:l.srcSet&&(a.srcset=l.srcSet)}}catch(i){V(e,e.return,i)}}function Cr(e,t,l){try{var a=e.stateNode;a1(a,e.type,l,t),a[Ye]=t}catch(i){V(e,e.return,i)}}function rp(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Bl(e.type)||e.tag===4}function Gr(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||rp(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Bl(e.type)||e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function po(e,t,l){var a=e.tag;if(a===5||a===6)e=e.stateNode,t?(l.nodeType===9?l.body:l.nodeName==="HTML"?l.ownerDocument.body:l).insertBefore(e,t):(t=l.nodeType===9?l.body:l.nodeName==="HTML"?l.ownerDocument.body:l,t.appendChild(e),l=l._reactRootContainer,l!=null||t.onclick!==null||(t.onclick=Kt));else if(a!==4&&(a===27&&Bl(e.type)&&(l=e.stateNode,t=null),e=e.child,e!==null))for(po(e,t,l),e=e.sibling;e!==null;)po(e,t,l),e=e.sibling}function Qu(e,t,l){var a=e.tag;if(a===5||a===6)e=e.stateNode,t?l.insertBefore(e,t):l.appendChild(e);else if(a!==4&&(a===27&&Bl(e.type)&&(l=e.stateNode),e=e.child,e!==null))for(Qu(e,t,l),e=e.sibling;e!==null;)Qu(e,t,l),e=e.sibling}function op(e){var t=e.stateNode,l=e.memoizedProps;try{for(var a=e.type,i=t.attributes;i.length;)t.removeAttributeNode(i[0]);Ce(t,a,l),t[Ee]=e,t[Ye]=l}catch(n){V(e,e.return,n)}}var Vt=!1,ce=!1,Ar=!1,jd=typeof WeakSet=="function"?WeakSet:Set,ve=null;function Yv(e,t){if(e=e.containerInfo,Eo=ls,e=km(e),jo(e)){if("selectionStart"in e)var l={start:e.selectionStart,end:e.selectionEnd};else e:{l=(l=e.ownerDocument)&&l.defaultView||window;var a=l.getSelection&&l.getSelection();if(a&&a.rangeCount!==0){l=a.anchorNode;var i=a.anchorOffset,n=a.focusNode;a=a.focusOffset;try{l.nodeType,n.nodeType}catch{l=null;break e}var u=0,s=-1,r=-1,c=0,f=0,y=e,m=null;t:for(;;){for(var p;y!==l||i!==0&&y.nodeType!==3||(s=u+i),y!==n||a!==0&&y.nodeType!==3||(r=u+a),y.nodeType===3&&(u+=y.nodeValue.length),(p=y.firstChild)!==null;)m=y,y=p;for(;;){if(y===e)break t;if(m===l&&++c===i&&(s=u),m===n&&++f===a&&(r=u),(p=y.nextSibling)!==null)break;y=m,m=y.parentNode}y=p}l=s===-1||r===-1?null:{start:s,end:r}}else l=null}l=l||{start:0,end:0}}else l=null;for(xo={focusedElem:e,selectionRange:l},ls=!1,ve=t;ve!==null;)if(t=ve,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,ve=e;else for(;ve!==null;){switch(t=ve,n=t.alternate,e=t.flags,t.tag){case 0:if((e&4)!==0&&(e=t.updateQueue,e=e!==null?e.events:null,e!==null))for(l=0;l<e.length;l++)i=e[l],i.ref.impl=i.nextImpl;break;case 11:case 15:break;case 1:if((e&1024)!==0&&n!==null){e=void 0,l=t,i=n.memoizedProps,n=n.memoizedState,a=l.stateNode;try{var M=ua(l.type,i);e=a.getSnapshotBeforeUpdate(M,n),a.__reactInternalSnapshotBeforeUpdate=e}catch(E){V(l,l.return,E)}}break;case 3:if((e&1024)!==0){if(e=t.stateNode.containerInfo,l=e.nodeType,l===9)Co(e);else if(l===1)switch(e.nodeName){case"HEAD":case"HTML":case"BODY":Co(e);break;default:e.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((e&1024)!==0)throw Error(v(163))}if(e=t.sibling,e!==null){e.return=t.return,ve=e;break}ve=t.return}}function cp(e,t,l){var a=l.flags;switch(l.tag){case 0:case 11:case 15:Xt(e,l),a&4&&An(5,l);break;case 1:if(Xt(e,l),a&4)if(e=l.stateNode,t===null)try{e.componentDidMount()}catch(u){V(l,l.return,u)}else{var i=ua(l.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(i,t,e.__reactInternalSnapshotBeforeUpdate)}catch(u){V(l,l.return,u)}}a&64&&np(l),a&512&&Ii(l,l.return);break;case 3:if(Xt(e,l),a&64&&(e=l.updateQueue,e!==null)){if(t=null,l.child!==null)switch(l.child.tag){case 27:case 5:t=l.child.stateNode;break;case 1:t=l.child.stateNode}try{hh(e,t)}catch(u){V(l,l.return,u)}}break;case 27:t===null&&a&4&&op(l);case 26:case 5:Xt(e,l),t===null&&a&4&&sp(l),a&512&&Ii(l,l.return);break;case 12:Xt(e,l);break;case 31:Xt(e,l),a&4&&mp(e,l);break;case 13:Xt(e,l),a&4&&hp(e,l),a&64&&(e=l.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(l=Fv.bind(null,l),f1(e,l))));break;case 22:if(a=l.memoizedState!==null||Vt,!a){t=t!==null&&t.memoizedState!==null||ce,i=Vt;var n=ce;Vt=a,(ce=t)&&!n?jt(e,l,(l.subtreeFlags&8772)!==0):Xt(e,l),Vt=i,ce=n}break;case 30:break;default:Xt(e,l)}}function fp(e){var t=e.alternate;t!==null&&(e.alternate=null,fp(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&Uo(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var le=null,we=!1;function qt(e,t,l){for(l=l.child;l!==null;)dp(e,t,l),l=l.sibling}function dp(e,t,l){if(Ke&&typeof Ke.onCommitFiberUnmount=="function")try{Ke.onCommitFiberUnmount(Mn,l)}catch{}switch(l.tag){case 26:ce||Tt(l,t),qt(e,t,l),l.memoizedState?l.memoizedState.count--:l.stateNode&&(l=l.stateNode,l.parentNode.removeChild(l));break;case 27:ce||Tt(l,t);var a=le,i=we;Bl(l.type)&&(le=l.stateNode,we=!1),qt(e,t,l),an(l.stateNode),le=a,we=i;break;case 5:ce||Tt(l,t);case 6:if(a=le,i=we,le=null,qt(e,t,l),le=a,we=i,le!==null)if(we)try{(le.nodeType===9?le.body:le.nodeName==="HTML"?le.ownerDocument.body:le).removeChild(l.stateNode)}catch(n){V(l,t,n)}else try{le.removeChild(l.stateNode)}catch(n){V(l,t,n)}break;case 18:le!==null&&(we?(e=le,am(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,l.stateNode),ui(e)):am(le,l.stateNode));break;case 4:a=le,i=we,le=l.stateNode.containerInfo,we=!0,qt(e,t,l),le=a,we=i;break;case 0:case 11:case 14:case 15:Hl(2,l,t),ce||Hl(4,l,t),qt(e,t,l);break;case 1:ce||(Tt(l,t),a=l.stateNode,typeof a.componentWillUnmount=="function"&&up(l,t,a)),qt(e,t,l);break;case 21:qt(e,t,l);break;case 22:ce=(a=ce)||l.memoizedState!==null,qt(e,t,l),ce=a;break;default:qt(e,t,l)}}function mp(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{ui(e)}catch(l){V(t,t.return,l)}}}function hp(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{ui(e)}catch(l){V(t,t.return,l)}}function Lv(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new jd),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new jd),t;default:throw Error(v(435,e.tag))}}function ru(e,t){var l=Lv(e);t.forEach(function(a){if(!l.has(a)){l.add(a);var i=Jv.bind(null,e,a);a.then(i,i)}})}function Ne(e,t){var l=t.deletions;if(l!==null)for(var a=0;a<l.length;a++){var i=l[a],n=e,u=t,s=u;e:for(;s!==null;){switch(s.tag){case 27:if(Bl(s.type)){le=s.stateNode,we=!1;break e}break;case 5:le=s.stateNode,we=!1;break e;case 3:case 4:le=s.stateNode.containerInfo,we=!0;break e}s=s.return}if(le===null)throw Error(v(160));dp(n,u,i),le=null,we=!1,n=i.alternate,n!==null&&(n.return=null),i.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)pp(t,e),t=t.sibling}var ht=null;function pp(e,t){var l=e.alternate,a=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:Ne(t,e),He(e),a&4&&(Hl(3,e,e.return),An(3,e),Hl(5,e,e.return));break;case 1:Ne(t,e),He(e),a&512&&(ce||l===null||Tt(l,l.return)),a&64&&Vt&&(e=e.updateQueue,e!==null&&(a=e.callbacks,a!==null&&(l=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=l===null?a:l.concat(a))));break;case 26:var i=ht;if(Ne(t,e),He(e),a&512&&(ce||l===null||Tt(l,l.return)),a&4){var n=l!==null?l.memoizedState:null;if(a=e.memoizedState,l===null)if(a===null)if(e.stateNode===null){e:{a=e.type,l=e.memoizedProps,i=i.ownerDocument||i;t:switch(a){case"title":n=i.getElementsByTagName("title")[0],(!n||n[xn]||n[Ee]||n.namespaceURI==="http://www.w3.org/2000/svg"||n.hasAttribute("itemprop"))&&(n=i.createElement(a),i.head.insertBefore(n,i.querySelector("head > title"))),Ce(n,a,l),n[Ee]=e,be(n),a=n;break e;case"link":var u=cm("link","href",i).get(a+(l.href||""));if(u){for(var s=0;s<u.length;s++)if(n=u[s],n.getAttribute("href")===(l.href==null||l.href===""?null:l.href)&&n.getAttribute("rel")===(l.rel==null?null:l.rel)&&n.getAttribute("title")===(l.title==null?null:l.title)&&n.getAttribute("crossorigin")===(l.crossOrigin==null?null:l.crossOrigin)){u.splice(s,1);break t}}n=i.createElement(a),Ce(n,a,l),i.head.appendChild(n);break;case"meta":if(u=cm("meta","content",i).get(a+(l.content||""))){for(s=0;s<u.length;s++)if(n=u[s],n.getAttribute("content")===(l.content==null?null:""+l.content)&&n.getAttribute("name")===(l.name==null?null:l.name)&&n.getAttribute("property")===(l.property==null?null:l.property)&&n.getAttribute("http-equiv")===(l.httpEquiv==null?null:l.httpEquiv)&&n.getAttribute("charset")===(l.charSet==null?null:l.charSet)){u.splice(s,1);break t}}n=i.createElement(a),Ce(n,a,l),i.head.appendChild(n);break;default:throw Error(v(468,a))}n[Ee]=e,be(n),a=n}e.stateNode=a}else fm(i,e.type,e.stateNode);else e.stateNode=om(i,a,e.memoizedProps);else n!==a?(n===null?l.stateNode!==null&&(l=l.stateNode,l.parentNode.removeChild(l)):n.count--,a===null?fm(i,e.type,e.stateNode):om(i,a,e.memoizedProps)):a===null&&e.stateNode!==null&&Cr(e,e.memoizedProps,l.memoizedProps)}break;case 27:Ne(t,e),He(e),a&512&&(ce||l===null||Tt(l,l.return)),l!==null&&a&4&&Cr(e,e.memoizedProps,l.memoizedProps);break;case 5:if(Ne(t,e),He(e),a&512&&(ce||l===null||Tt(l,l.return)),e.flags&32){i=e.stateNode;try{$a(i,"")}catch(M){V(e,e.return,M)}}a&4&&e.stateNode!=null&&(i=e.memoizedProps,Cr(e,i,l!==null?l.memoizedProps:i)),a&1024&&(Ar=!0);break;case 6:if(Ne(t,e),He(e),a&4){if(e.stateNode===null)throw Error(v(162));a=e.memoizedProps,l=e.stateNode;try{l.nodeValue=a}catch(M){V(e,e.return,M)}}break;case 3:if(Gu=null,i=ht,ht=Iu(t.containerInfo),Ne(t,e),ht=i,He(e),a&4&&l!==null&&l.memoizedState.isDehydrated)try{ui(t.containerInfo)}catch(M){V(e,e.return,M)}Ar&&(Ar=!1,yp(e));break;case 4:a=ht,ht=Iu(e.stateNode.containerInfo),Ne(t,e),He(e),ht=a;break;case 12:Ne(t,e),He(e);break;case 31:Ne(t,e),He(e),a&4&&(a=e.updateQueue,a!==null&&(e.updateQueue=null,ru(e,a)));break;case 13:Ne(t,e),He(e),e.child.flags&8192&&e.memoizedState!==null!=(l!==null&&l.memoizedState!==null)&&(ps=Qe()),a&4&&(a=e.updateQueue,a!==null&&(e.updateQueue=null,ru(e,a)));break;case 22:i=e.memoizedState!==null;var r=l!==null&&l.memoizedState!==null,c=Vt,f=ce;if(Vt=c||i,ce=f||r,Ne(t,e),ce=f,Vt=c,He(e),a&8192)e:for(t=e.stateNode,t._visibility=i?t._visibility&-2:t._visibility|1,i&&(l===null||r||Vt||ce||kl(e)),l=null,t=e;;){if(t.tag===5||t.tag===26){if(l===null){r=l=t;try{if(n=r.stateNode,i)u=n.style,typeof u.setProperty=="function"?u.setProperty("display","none","important"):u.display="none";else{s=r.stateNode;var y=r.memoizedProps.style,m=y!=null&&y.hasOwnProperty("display")?y.display:null;s.style.display=m==null||typeof m=="boolean"?"":(""+m).trim()}}catch(M){V(r,r.return,M)}}}else if(t.tag===6){if(l===null){r=t;try{r.stateNode.nodeValue=i?"":r.memoizedProps}catch(M){V(r,r.return,M)}}}else if(t.tag===18){if(l===null){r=t;try{var p=r.stateNode;i?im(p,!0):im(r.stateNode,!1)}catch(M){V(r,r.return,M)}}}else if((t.tag!==22&&t.tag!==23||t.memoizedState===null||t===e)&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;l===t&&(l=null),t=t.return}l===t&&(l=null),t.sibling.return=t.return,t=t.sibling}a&4&&(a=e.updateQueue,a!==null&&(l=a.retryQueue,l!==null&&(a.retryQueue=null,ru(e,l))));break;case 19:Ne(t,e),He(e),a&4&&(a=e.updateQueue,a!==null&&(e.updateQueue=null,ru(e,a)));break;case 30:break;case 21:break;default:Ne(t,e),He(e)}}function He(e){var t=e.flags;if(t&2){try{for(var l,a=e.return;a!==null;){if(rp(a)){l=a;break}a=a.return}if(l==null)throw Error(v(160));switch(l.tag){case 27:var i=l.stateNode,n=Gr(e);Qu(e,n,i);break;case 5:var u=l.stateNode;l.flags&32&&($a(u,""),l.flags&=-33);var s=Gr(e);Qu(e,s,u);break;case 3:case 4:var r=l.stateNode.containerInfo,c=Gr(e);po(e,c,r);break;default:throw Error(v(161))}}catch(f){V(e,e.return,f)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function yp(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;yp(t),t.tag===5&&t.flags&1024&&t.stateNode.reset(),e=e.sibling}}function Xt(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)cp(e,t.alternate,t),t=t.sibling}function kl(e){for(e=e.child;e!==null;){var t=e;switch(t.tag){case 0:case 11:case 14:case 15:Hl(4,t,t.return),kl(t);break;case 1:Tt(t,t.return);var l=t.stateNode;typeof l.componentWillUnmount=="function"&&up(t,t.return,l),kl(t);break;case 27:an(t.stateNode);case 26:case 5:Tt(t,t.return),kl(t);break;case 22:t.memoizedState===null&&kl(t);break;case 30:kl(t);break;default:kl(t)}e=e.sibling}}function jt(e,t,l){for(l=l&&(t.subtreeFlags&8772)!==0,t=t.child;t!==null;){var a=t.alternate,i=e,n=t,u=n.flags;switch(n.tag){case 0:case 11:case 15:jt(i,n,l),An(4,n);break;case 1:if(jt(i,n,l),a=n,i=a.stateNode,typeof i.componentDidMount=="function")try{i.componentDidMount()}catch(c){V(a,a.return,c)}if(a=n,i=a.updateQueue,i!==null){var s=a.stateNode;try{var r=i.shared.hiddenCallbacks;if(r!==null)for(i.shared.hiddenCallbacks=null,i=0;i<r.length;i++)mh(r[i],s)}catch(c){V(a,a.return,c)}}l&&u&64&&np(n),Ii(n,n.return);break;case 27:op(n);case 26:case 5:jt(i,n,l),l&&a===null&&u&4&&sp(n),Ii(n,n.return);break;case 12:jt(i,n,l);break;case 31:jt(i,n,l),l&&u&4&&mp(i,n);break;case 13:jt(i,n,l),l&&u&4&&hp(i,n);break;case 22:n.memoizedState===null&&jt(i,n,l),Ii(n,n.return);break;case 30:break;default:jt(i,n,l)}t=t.sibling}}function hc(e,t){var l=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(l=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==l&&(e!=null&&e.refCount++,l!=null&&Cn(l))}function pc(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&Cn(e))}function mt(e,t,l,a){if(t.subtreeFlags&10256)for(t=t.child;t!==null;)gp(e,t,l,a),t=t.sibling}function gp(e,t,l,a){var i=t.flags;switch(t.tag){case 0:case 11:case 15:mt(e,t,l,a),i&2048&&An(9,t);break;case 1:mt(e,t,l,a);break;case 3:mt(e,t,l,a),i&2048&&(e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&Cn(e)));break;case 12:if(i&2048){mt(e,t,l,a),e=t.stateNode;try{var n=t.memoizedProps,u=n.id,s=n.onPostCommit;typeof s=="function"&&s(u,t.alternate===null?"mount":"update",e.passiveEffectDuration,-0)}catch(r){V(t,t.return,r)}}else mt(e,t,l,a);break;case 31:mt(e,t,l,a);break;case 13:mt(e,t,l,a);break;case 23:break;case 22:n=t.stateNode,u=t.alternate,t.memoizedState!==null?n._visibility&2?mt(e,t,l,a):en(e,t):n._visibility&2?mt(e,t,l,a):(n._visibility|=2,Ra(e,t,l,a,(t.subtreeFlags&10256)!==0||!1)),i&2048&&hc(u,t);break;case 24:mt(e,t,l,a),i&2048&&pc(t.alternate,t);break;default:mt(e,t,l,a)}}function Ra(e,t,l,a,i){for(i=i&&((t.subtreeFlags&10256)!==0||!1),t=t.child;t!==null;){var n=e,u=t,s=l,r=a,c=u.flags;switch(u.tag){case 0:case 11:case 15:Ra(n,u,s,r,i),An(8,u);break;case 23:break;case 22:var f=u.stateNode;u.memoizedState!==null?f._visibility&2?Ra(n,u,s,r,i):en(n,u):(f._visibility|=2,Ra(n,u,s,r,i)),i&&c&2048&&hc(u.alternate,u);break;case 24:Ra(n,u,s,r,i),i&&c&2048&&pc(u.alternate,u);break;default:Ra(n,u,s,r,i)}t=t.sibling}}function en(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var l=e,a=t,i=a.flags;switch(a.tag){case 22:en(l,a),i&2048&&hc(a.alternate,a);break;case 24:en(l,a),i&2048&&pc(a.alternate,a);break;default:en(l,a)}t=t.sibling}}var Vi=8192;function za(e,t,l){if(e.subtreeFlags&Vi)for(e=e.child;e!==null;)vp(e,t,l),e=e.sibling}function vp(e,t,l){switch(e.tag){case 26:za(e,t,l),e.flags&Vi&&e.memoizedState!==null&&x1(l,ht,e.memoizedState,e.memoizedProps);break;case 5:za(e,t,l);break;case 3:case 4:var a=ht;ht=Iu(e.stateNode.containerInfo),za(e,t,l),ht=a;break;case 22:e.memoizedState===null&&(a=e.alternate,a!==null&&a.memoizedState!==null?(a=Vi,Vi=16777216,za(e,t,l),Vi=a):za(e,t,l));break;default:za(e,t,l)}}function bp(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function Bi(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var l=0;l<t.length;l++){var a=t[l];ve=a,Sp(a,e)}bp(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Mp(e),e=e.sibling}function Mp(e){switch(e.tag){case 0:case 11:case 15:Bi(e),e.flags&2048&&Hl(9,e,e.return);break;case 3:Bi(e);break;case 12:Bi(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,Tu(e)):Bi(e);break;default:Bi(e)}}function Tu(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var l=0;l<t.length;l++){var a=t[l];ve=a,Sp(a,e)}bp(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:Hl(8,t,t.return),Tu(t);break;case 22:l=t.stateNode,l._visibility&2&&(l._visibility&=-3,Tu(t));break;default:Tu(t)}e=e.sibling}}function Sp(e,t){for(;ve!==null;){var l=ve;switch(l.tag){case 0:case 11:case 15:Hl(8,l,t);break;case 23:case 22:if(l.memoizedState!==null&&l.memoizedState.cachePool!==null){var a=l.memoizedState.cachePool.pool;a!=null&&a.refCount++}break;case 24:Cn(l.memoizedState.cache)}if(a=l.child,a!==null)a.return=l,ve=a;else e:for(l=e;ve!==null;){a=ve;var i=a.sibling,n=a.return;if(fp(a),a===l){ve=null;break e}if(i!==null){i.return=n,ve=i;break e}ve=n}}}var qv={getCacheForType:function(e){var t=Te(fe),l=t.data.get(e);return l===void 0&&(l=e(),t.data.set(e,l)),l},cacheSignal:function(){return Te(fe).controller.signal}},Xv=typeof WeakMap=="function"?WeakMap:Map,X=0,J=null,B=null,Y=0,Z=0,Xe=null,Ml=!1,fi=!1,yc=!1,tl=0,ne=0,wl=0,ta=0,gc=0,Ve=0,li=0,tn=null,Ue=null,yo=!1,ps=0,Ep=0,Ku=1/0,Fu=null,Al=null,pe=0,zl=null,ai=null,kt=0,go=0,vo=null,xp=null,ln=0,bo=null;function Je(){return(X&2)!==0&&Y!==0?Y&-Y:R.T!==null?bc():Om()}function Tp(){if(Ve===0)if((Y&536870912)===0||q){var e=$n;$n<<=1,($n&3932160)===0&&($n=262144),Ve=e}else Ve=536870912;return e=ke.current,e!==null&&(e.flags|=32),Ve}function Be(e,t,l){(e===J&&(Z===2||Z===9)||e.cancelPendingCommit!==null)&&(ii(e,0),Sl(e,Y,Ve,!1)),En(e,l),((X&2)===0||e!==J)&&(e===J&&((X&2)===0&&(ta|=l),ne===4&&Sl(e,Y,Ve,!1)),At(e))}function Cp(e,t,l){if((X&6)!==0)throw Error(v(327));var a=!l&&(t&127)===0&&(t&e.expiredLanes)===0||Sn(e,t),i=a?Vv(e,t):zr(e,t,!0),n=a;do{if(i===0){fi&&!a&&Sl(e,t,0,!1);break}else{if(l=e.current.alternate,n&&!jv(l)){i=zr(e,t,!1),n=!1;continue}if(i===2){if(n=t,e.errorRecoveryDisabledLanes&n)var u=0;else u=e.pendingLanes&-536870913,u=u!==0?u:u&536870912?536870912:0;if(u!==0){t=u;e:{var s=e;i=tn;var r=s.current.memoizedState.isDehydrated;if(r&&(ii(s,u).flags|=256),u=zr(s,u,!1),u!==2){if(yc&&!r){s.errorRecoveryDisabledLanes|=n,ta|=n,i=4;break e}n=Ue,Ue=i,n!==null&&(Ue===null?Ue=n:Ue.push.apply(Ue,n))}i=u}if(n=!1,i!==2)continue}}if(i===1){ii(e,0),Sl(e,t,0,!0);break}e:{switch(a=e,n=i,n){case 0:case 1:throw Error(v(345));case 4:if((t&4194048)!==t)break;case 6:Sl(a,t,Ve,!Ml);break e;case 2:Ue=null;break;case 3:case 5:break;default:throw Error(v(329))}if((t&62914560)===t&&(i=ps+300-Qe(),10<i)){if(Sl(a,t,Ve,!Ml),is(a,0,!0)!==0)break e;kt=t,a.timeoutHandle=Qp(Zd.bind(null,a,l,Ue,Fu,yo,t,Ve,ta,li,Ml,n,"Throttled",-0,0),i);break e}Zd(a,l,Ue,Fu,yo,t,Ve,ta,li,Ml,n,null,-0,0)}}break}while(!0);At(e)}function Zd(e,t,l,a,i,n,u,s,r,c,f,y,m,p){if(e.timeoutHandle=-1,y=t.subtreeFlags,y&8192||(y&16785408)===16785408){y={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:Kt},vp(t,n,y);var M=(n&62914560)===n?ps-Qe():(n&4194048)===n?Ep-Qe():0;if(M=T1(y,M),M!==null){kt=n,e.cancelPendingCommit=M(Qd.bind(null,e,t,n,l,a,i,u,s,r,f,y,null,m,p)),Sl(e,n,u,!c);return}}Qd(e,t,n,l,a,i,u,s,r)}function jv(e){for(var t=e;;){var l=t.tag;if((l===0||l===11||l===15)&&t.flags&16384&&(l=t.updateQueue,l!==null&&(l=l.stores,l!==null)))for(var a=0;a<l.length;a++){var i=l[a],n=i.getSnapshot;i=i.value;try{if(!Pe(n(),i))return!1}catch{return!1}}if(l=t.child,t.subtreeFlags&16384&&l!==null)l.return=t,t=l;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Sl(e,t,l,a){t&=~gc,t&=~ta,e.suspendedLanes|=t,e.pingedLanes&=~t,a&&(e.warmLanes|=t),a=e.expirationTimes;for(var i=t;0<i;){var n=31-Fe(i),u=1<<n;a[n]=-1,i&=~u}l!==0&&Rm(e,l,t)}function ys(){return(X&6)===0?(zn(0,!1),!1):!0}function vc(){if(B!==null){if(Z===0)var e=B.return;else e=B,Ft=fa=null,ac(e),Fa=null,fn=0,e=B;for(;e!==null;)ip(e.alternate,e),e=e.return;B=null}}function ii(e,t){var l=e.timeoutHandle;l!==-1&&(e.timeoutHandle=-1,u1(l)),l=e.cancelPendingCommit,l!==null&&(e.cancelPendingCommit=null,l()),kt=0,vc(),J=e,B=l=Jt(e.current,null),Y=t,Z=0,Xe=null,Ml=!1,fi=Sn(e,t),yc=!1,li=Ve=gc=ta=wl=ne=0,Ue=tn=null,yo=!1,(t&8)!==0&&(t|=t&32);var a=e.entangledLanes;if(a!==0)for(e=e.entanglements,a&=t;0<a;){var i=31-Fe(a),n=1<<i;t|=e[i],a&=~n}return tl=t,rs(),l}function Gp(e,t){N=null,R.H=mn,t===ci||t===cs?(t=Sd(),Z=3):t===ko?(t=Sd(),Z=4):Z=t===dc?8:t!==null&&typeof t=="object"&&typeof t.then=="function"?6:1,Xe=t,B===null&&(ne=1,Zu(e,st(t,e.current)))}function Ap(){var e=ke.current;return e===null?!0:(Y&4194048)===Y?ot===null:(Y&62914560)===Y||(Y&536870912)!==0?e===ot:!1}function zp(){var e=R.H;return R.H=mn,e===null?mn:e}function Rp(){var e=R.A;return R.A=qv,e}function Ju(){ne=4,Ml||(Y&4194048)!==Y&&ke.current!==null||(fi=!0),(wl&134217727)===0&&(ta&134217727)===0||J===null||Sl(J,Y,Ve,!1)}function zr(e,t,l){var a=X;X|=2;var i=zp(),n=Rp();(J!==e||Y!==t)&&(Fu=null,ii(e,t)),t=!1;var u=ne;e:do try{if(Z!==0&&B!==null){var s=B,r=Xe;switch(Z){case 8:vc(),u=6;break e;case 3:case 2:case 9:case 6:ke.current===null&&(t=!0);var c=Z;if(Z=0,Xe=null,ja(e,s,r,c),l&&fi){u=0;break e}break;default:c=Z,Z=0,Xe=null,ja(e,s,r,c)}}Zv(),u=ne;break}catch(f){Gp(e,f)}while(!0);return t&&e.shellSuspendCounter++,Ft=fa=null,X=a,R.H=i,R.A=n,B===null&&(J=null,Y=0,rs()),u}function Zv(){for(;B!==null;)_p(B)}function Vv(e,t){var l=X;X|=2;var a=zp(),i=Rp();J!==e||Y!==t?(Fu=null,Ku=Qe()+500,ii(e,t)):fi=Sn(e,t);e:do try{if(Z!==0&&B!==null){t=B;var n=Xe;t:switch(Z){case 1:Z=0,Xe=null,ja(e,t,n,1);break;case 2:case 9:if(Md(n)){Z=0,Xe=null,Vd(t);break}t=function(){Z!==2&&Z!==9||J!==e||(Z=7),At(e)},n.then(t,t);break e;case 3:Z=7;break e;case 4:Z=5;break e;case 7:Md(n)?(Z=0,Xe=null,Vd(t)):(Z=0,Xe=null,ja(e,t,n,7));break;case 5:var u=null;switch(B.tag){case 26:u=B.memoizedState;case 5:case 27:var s=B;if(u?kp(u):s.stateNode.complete){Z=0,Xe=null;var r=s.sibling;if(r!==null)B=r;else{var c=s.return;c!==null?(B=c,gs(c)):B=null}break t}}Z=0,Xe=null,ja(e,t,n,5);break;case 6:Z=0,Xe=null,ja(e,t,n,6);break;case 8:vc(),ne=6;break e;default:throw Error(v(462))}}Qv();break}catch(f){Gp(e,f)}while(!0);return Ft=fa=null,R.H=a,R.A=i,X=l,B!==null?0:(J=null,Y=0,rs(),ne)}function Qv(){for(;B!==null&&!hg();)_p(B)}function _p(e){var t=ap(e.alternate,e,tl);e.memoizedProps=e.pendingProps,t===null?gs(e):B=t}function Vd(e){var t=e,l=t.alternate;switch(t.tag){case 15:case 0:t=Bd(l,t,t.pendingProps,t.type,void 0,Y);break;case 11:t=Bd(l,t,t.pendingProps,t.type.render,t.ref,Y);break;case 5:ac(t);default:ip(l,t),t=B=ih(t,tl),t=ap(l,t,tl)}e.memoizedProps=e.pendingProps,t===null?gs(e):B=t}function ja(e,t,l,a){Ft=fa=null,ac(t),Fa=null,fn=0;var i=t.return;try{if(Nv(e,i,t,l,Y)){ne=1,Zu(e,st(l,e.current)),B=null;return}}catch(n){if(i!==null)throw B=i,n;ne=1,Zu(e,st(l,e.current)),B=null;return}t.flags&32768?(q||a===1?e=!0:fi||(Y&536870912)!==0?e=!1:(Ml=e=!0,(a===2||a===9||a===3||a===6)&&(a=ke.current,a!==null&&a.tag===13&&(a.flags|=16384))),Dp(t,e)):gs(t)}function gs(e){var t=e;do{if((t.flags&32768)!==0){Dp(t,Ml);return}e=t.return;var l=Uv(t.alternate,t,tl);if(l!==null){B=l;return}if(t=t.sibling,t!==null){B=t;return}B=t=e}while(t!==null);ne===0&&(ne=5)}function Dp(e,t){do{var l=Bv(e.alternate,e);if(l!==null){l.flags&=32767,B=l;return}if(l=e.return,l!==null&&(l.flags|=32768,l.subtreeFlags=0,l.deletions=null),!t&&(e=e.sibling,e!==null)){B=e;return}B=e=l}while(e!==null);ne=6,B=null}function Qd(e,t,l,a,i,n,u,s,r){e.cancelPendingCommit=null;do vs();while(pe!==0);if((X&6)!==0)throw Error(v(327));if(t!==null){if(t===e.current)throw Error(v(177));if(n=t.lanes|t.childLanes,n|=Zo,Tg(e,l,n,u,s,r),e===J&&(B=J=null,Y=0),ai=t,zl=e,kt=l,go=n,vo=i,xp=a,(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?(e.callbackNode=null,e.callbackPriority=0,Pv(Ou,function(){return Up(),null})):(e.callbackNode=null,e.callbackPriority=0),a=(t.flags&13878)!==0,(t.subtreeFlags&13878)!==0||a){a=R.T,R.T=null,i=j.p,j.p=2,u=X,X|=4;try{Yv(e,t,l)}finally{X=u,j.p=i,R.T=a}}pe=1,Op(),Np(),Hp()}}function Op(){if(pe===1){pe=0;var e=zl,t=ai,l=(t.flags&13878)!==0;if((t.subtreeFlags&13878)!==0||l){l=R.T,R.T=null;var a=j.p;j.p=2;var i=X;X|=4;try{pp(t,e);var n=xo,u=km(e.containerInfo),s=n.focusedElem,r=n.selectionRange;if(u!==s&&s&&s.ownerDocument&&Pm(s.ownerDocument.documentElement,s)){if(r!==null&&jo(s)){var c=r.start,f=r.end;if(f===void 0&&(f=c),"selectionStart"in s)s.selectionStart=c,s.selectionEnd=Math.min(f,s.value.length);else{var y=s.ownerDocument||document,m=y&&y.defaultView||window;if(m.getSelection){var p=m.getSelection(),M=s.textContent.length,E=Math.min(r.start,M),w=r.end===void 0?E:Math.min(r.end,M);!p.extend&&E>w&&(u=w,w=E,E=u);var d=md(s,E),o=md(s,w);if(d&&o&&(p.rangeCount!==1||p.anchorNode!==d.node||p.anchorOffset!==d.offset||p.focusNode!==o.node||p.focusOffset!==o.offset)){var h=y.createRange();h.setStart(d.node,d.offset),p.removeAllRanges(),E>w?(p.addRange(h),p.extend(o.node,o.offset)):(h.setEnd(o.node,o.offset),p.addRange(h))}}}}for(y=[],p=s;p=p.parentNode;)p.nodeType===1&&y.push({element:p,left:p.scrollLeft,top:p.scrollTop});for(typeof s.focus=="function"&&s.focus(),s=0;s<y.length;s++){var g=y[s];g.element.scrollLeft=g.left,g.element.scrollTop=g.top}}ls=!!Eo,xo=Eo=null}finally{X=i,j.p=a,R.T=l}}e.current=t,pe=2}}function Np(){if(pe===2){pe=0;var e=zl,t=ai,l=(t.flags&8772)!==0;if((t.subtreeFlags&8772)!==0||l){l=R.T,R.T=null;var a=j.p;j.p=2;var i=X;X|=4;try{cp(e,t.alternate,t)}finally{X=i,j.p=a,R.T=l}}pe=3}}function Hp(){if(pe===4||pe===3){pe=0,pg();var e=zl,t=ai,l=kt,a=xp;(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?pe=5:(pe=0,ai=zl=null,wp(e,e.pendingLanes));var i=e.pendingLanes;if(i===0&&(Al=null),wo(l),t=t.stateNode,Ke&&typeof Ke.onCommitFiberRoot=="function")try{Ke.onCommitFiberRoot(Mn,t,void 0,(t.current.flags&128)===128)}catch{}if(a!==null){t=R.T,i=j.p,j.p=2,R.T=null;try{for(var n=e.onRecoverableError,u=0;u<a.length;u++){var s=a[u];n(s.value,{componentStack:s.stack})}}finally{R.T=t,j.p=i}}(kt&3)!==0&&vs(),At(e),i=e.pendingLanes,(l&261930)!==0&&(i&42)!==0?e===bo?ln++:(ln=0,bo=e):ln=0,zn(0,!1)}}function wp(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,Cn(t)))}function vs(){return Op(),Np(),Hp(),Up()}function Up(){if(pe!==5)return!1;var e=zl,t=go;go=0;var l=wo(kt),a=R.T,i=j.p;try{j.p=32>l?32:l,R.T=null,l=vo,vo=null;var n=zl,u=kt;if(pe=0,ai=zl=null,kt=0,(X&6)!==0)throw Error(v(331));var s=X;if(X|=4,Mp(n.current),gp(n,n.current,u,l),X=s,zn(0,!1),Ke&&typeof Ke.onPostCommitFiberRoot=="function")try{Ke.onPostCommitFiberRoot(Mn,n)}catch{}return!0}finally{j.p=i,R.T=a,wp(e,t)}}function Kd(e,t,l){t=st(l,t),t=fo(e.stateNode,t,2),e=Gl(e,t,2),e!==null&&(En(e,2),At(e))}function V(e,t,l){if(e.tag===3)Kd(e,e,l);else for(;t!==null;){if(t.tag===3){Kd(t,e,l);break}else if(t.tag===1){var a=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof a.componentDidCatch=="function"&&(Al===null||!Al.has(a))){e=st(l,e),l=Wh(2),a=Gl(t,l,2),a!==null&&($h(l,a,t,e),En(a,2),At(a));break}}t=t.return}}function Rr(e,t,l){var a=e.pingCache;if(a===null){a=e.pingCache=new Xv;var i=new Set;a.set(t,i)}else i=a.get(t),i===void 0&&(i=new Set,a.set(t,i));i.has(l)||(yc=!0,i.add(l),e=Kv.bind(null,e,t,l),t.then(e,e))}function Kv(e,t,l){var a=e.pingCache;a!==null&&a.delete(t),e.pingedLanes|=e.suspendedLanes&l,e.warmLanes&=~l,J===e&&(Y&l)===l&&(ne===4||ne===3&&(Y&62914560)===Y&&300>Qe()-ps?(X&2)===0&&ii(e,0):gc|=l,li===Y&&(li=0)),At(e)}function Bp(e,t){t===0&&(t=zm()),e=ca(e,t),e!==null&&(En(e,t),At(e))}function Fv(e){var t=e.memoizedState,l=0;t!==null&&(l=t.retryLane),Bp(e,l)}function Jv(e,t){var l=0;switch(e.tag){case 31:case 13:var a=e.stateNode,i=e.memoizedState;i!==null&&(l=i.retryLane);break;case 19:a=e.stateNode;break;case 22:a=e.stateNode._retryCache;break;default:throw Error(v(314))}a!==null&&a.delete(t),Bp(e,l)}function Pv(e,t){return No(e,t)}var Pu=null,_a=null,Mo=!1,ku=!1,_r=!1,El=0;function At(e){e!==_a&&e.next===null&&(_a===null?Pu=_a=e:_a=_a.next=e),ku=!0,Mo||(Mo=!0,Wv())}function zn(e,t){if(!_r&&ku){_r=!0;do for(var l=!1,a=Pu;a!==null;){if(!t)if(e!==0){var i=a.pendingLanes;if(i===0)var n=0;else{var u=a.suspendedLanes,s=a.pingedLanes;n=(1<<31-Fe(42|e)+1)-1,n&=i&~(u&~s),n=n&201326741?n&201326741|1:n?n|2:0}n!==0&&(l=!0,Fd(a,n))}else n=Y,n=is(a,a===J?n:0,a.cancelPendingCommit!==null||a.timeoutHandle!==-1),(n&3)===0||Sn(a,n)||(l=!0,Fd(a,n));a=a.next}while(l);_r=!1}}function kv(){Yp()}function Yp(){ku=Mo=!1;var e=0;El!==0&&n1()&&(e=El);for(var t=Qe(),l=null,a=Pu;a!==null;){var i=a.next,n=Lp(a,t);n===0?(a.next=null,l===null?Pu=i:l.next=i,i===null&&(_a=l)):(l=a,(e!==0||(n&3)!==0)&&(ku=!0)),a=i}pe!==0&&pe!==5||zn(e,!1),El!==0&&(El=0)}function Lp(e,t){for(var l=e.suspendedLanes,a=e.pingedLanes,i=e.expirationTimes,n=e.pendingLanes&-62914561;0<n;){var u=31-Fe(n),s=1<<u,r=i[u];r===-1?((s&l)===0||(s&a)!==0)&&(i[u]=xg(s,t)):r<=t&&(e.expiredLanes|=s),n&=~s}if(t=J,l=Y,l=is(e,e===t?l:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),a=e.callbackNode,l===0||e===t&&(Z===2||Z===9)||e.cancelPendingCommit!==null)return a!==null&&a!==null&&nr(a),e.callbackNode=null,e.callbackPriority=0;if((l&3)===0||Sn(e,l)){if(t=l&-l,t===e.callbackPriority)return t;switch(a!==null&&nr(a),wo(l)){case 2:case 8:l=Gm;break;case 32:l=Ou;break;case 268435456:l=Am;break;default:l=Ou}return a=qp.bind(null,e),l=No(l,a),e.callbackPriority=t,e.callbackNode=l,t}return a!==null&&a!==null&&nr(a),e.callbackPriority=2,e.callbackNode=null,2}function qp(e,t){if(pe!==0&&pe!==5)return e.callbackNode=null,e.callbackPriority=0,null;var l=e.callbackNode;if(vs()&&e.callbackNode!==l)return null;var a=Y;return a=is(e,e===J?a:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),a===0?null:(Cp(e,a,t),Lp(e,Qe()),e.callbackNode!=null&&e.callbackNode===l?qp.bind(null,e):null)}function Fd(e,t){if(vs())return null;Cp(e,t,!0)}function Wv(){s1(function(){(X&6)!==0?No(Cm,kv):Yp()})}function bc(){if(El===0){var e=Ia;e===0&&(e=Wn,Wn<<=1,(Wn&261888)===0&&(Wn=256)),El=e}return El}function Jd(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:pu(""+e)}function Pd(e,t){var l=t.ownerDocument.createElement("input");return l.name=t.name,l.value=t.value,e.id&&l.setAttribute("form",e.id),t.parentNode.insertBefore(l,t),e=new FormData(e),l.parentNode.removeChild(l),e}function $v(e,t,l,a,i){if(t==="submit"&&l&&l.stateNode===i){var n=Jd((i[Ye]||null).action),u=a.submitter;u&&(t=(t=u[Ye]||null)?Jd(t.formAction):u.getAttribute("formAction"),t!==null&&(n=t,u=null));var s=new ns("action","action",null,a,i);e.push({event:s,listeners:[{instance:null,listener:function(){if(a.defaultPrevented){if(El!==0){var r=u?Pd(i,u):new FormData(i);oo(l,{pending:!0,data:r,method:i.method,action:n},null,r)}}else typeof n=="function"&&(s.preventDefault(),r=u?Pd(i,u):new FormData(i),oo(l,{pending:!0,data:r,method:i.method,action:n},n,r))},currentTarget:i}]})}}for(ou=0;ou<Wr.length;ou++)cu=Wr[ou],kd=cu.toLowerCase(),Wd=cu[0].toUpperCase()+cu.slice(1),pt(kd,"on"+Wd);var cu,kd,Wd,ou;pt($m,"onAnimationEnd");pt(Im,"onAnimationIteration");pt(eh,"onAnimationStart");pt("dblclick","onDoubleClick");pt("focusin","onFocus");pt("focusout","onBlur");pt(yv,"onTransitionRun");pt(gv,"onTransitionStart");pt(vv,"onTransitionCancel");pt(th,"onTransitionEnd");Wa("onMouseEnter",["mouseout","mouseover"]);Wa("onMouseLeave",["mouseout","mouseover"]);Wa("onPointerEnter",["pointerout","pointerover"]);Wa("onPointerLeave",["pointerout","pointerover"]);sa("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));sa("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));sa("onBeforeInput",["compositionend","keypress","textInput","paste"]);sa("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));sa("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));sa("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var hn="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Iv=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(hn));function Xp(e,t){t=(t&4)!==0;for(var l=0;l<e.length;l++){var a=e[l],i=a.event;a=a.listeners;e:{var n=void 0;if(t)for(var u=a.length-1;0<=u;u--){var s=a[u],r=s.instance,c=s.currentTarget;if(s=s.listener,r!==n&&i.isPropagationStopped())break e;n=s,i.currentTarget=c;try{n(i)}catch(f){Hu(f)}i.currentTarget=null,n=r}else for(u=0;u<a.length;u++){if(s=a[u],r=s.instance,c=s.currentTarget,s=s.listener,r!==n&&i.isPropagationStopped())break e;n=s,i.currentTarget=c;try{n(i)}catch(f){Hu(f)}i.currentTarget=null,n=r}}}}function U(e,t){var l=t[Zr];l===void 0&&(l=t[Zr]=new Set);var a=e+"__bubble";l.has(a)||(jp(t,e,2,!1),l.add(a))}function Dr(e,t,l){var a=0;t&&(a|=4),jp(l,e,a,t)}var fu="_reactListening"+Math.random().toString(36).slice(2);function Mc(e){if(!e[fu]){e[fu]=!0,Nm.forEach(function(l){l!=="selectionchange"&&(Iv.has(l)||Dr(l,!1,e),Dr(l,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[fu]||(t[fu]=!0,Dr("selectionchange",!1,t))}}function jp(e,t,l,a){switch(ty(t)){case 2:var i=A1;break;case 8:i=z1;break;default:i=Tc}l=i.bind(null,t,l,e),i=void 0,!Jr||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(i=!0),a?i!==void 0?e.addEventListener(t,l,{capture:!0,passive:i}):e.addEventListener(t,l,!0):i!==void 0?e.addEventListener(t,l,{passive:i}):e.addEventListener(t,l,!1)}function Or(e,t,l,a,i){var n=a;if((t&1)===0&&(t&2)===0&&a!==null)e:for(;;){if(a===null)return;var u=a.tag;if(u===3||u===4){var s=a.stateNode.containerInfo;if(s===i)break;if(u===4)for(u=a.return;u!==null;){var r=u.tag;if((r===3||r===4)&&u.stateNode.containerInfo===i)return;u=u.return}for(;s!==null;){if(u=Na(s),u===null)return;if(r=u.tag,r===5||r===6||r===26||r===27){a=n=u;continue e}s=s.parentNode}}a=a.return}Xm(function(){var c=n,f=Yo(l),y=[];e:{var m=lh.get(e);if(m!==void 0){var p=ns,M=e;switch(e){case"keypress":if(gu(l)===0)break e;case"keydown":case"keyup":p=Jg;break;case"focusin":M="focus",p=cr;break;case"focusout":M="blur",p=cr;break;case"beforeblur":case"afterblur":p=cr;break;case"click":if(l.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":p=id;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":p=Ug;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":p=Wg;break;case $m:case Im:case eh:p=Lg;break;case th:p=Ig;break;case"scroll":case"scrollend":p=Hg;break;case"wheel":p=tv;break;case"copy":case"cut":case"paste":p=Xg;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":p=ud;break;case"toggle":case"beforetoggle":p=av}var E=(t&4)!==0,w=!E&&(e==="scroll"||e==="scrollend"),d=E?m!==null?m+"Capture":null:m;E=[];for(var o=c,h;o!==null;){var g=o;if(h=g.stateNode,g=g.tag,g!==5&&g!==26&&g!==27||h===null||d===null||(g=un(o,d),g!=null&&E.push(pn(o,g,h))),w)break;o=o.return}0<E.length&&(m=new p(m,M,null,l,f),y.push({event:m,listeners:E}))}}if((t&7)===0){e:{if(m=e==="mouseover"||e==="pointerover",p=e==="mouseout"||e==="pointerout",m&&l!==Fr&&(M=l.relatedTarget||l.fromElement)&&(Na(M)||M[si]))break e;if((p||m)&&(m=f.window===f?f:(m=f.ownerDocument)?m.defaultView||m.parentWindow:window,p?(M=l.relatedTarget||l.toElement,p=c,M=M?Na(M):null,M!==null&&(w=bn(M),E=M.tag,M!==w||E!==5&&E!==27&&E!==6)&&(M=null)):(p=null,M=c),p!==M)){if(E=id,g="onMouseLeave",d="onMouseEnter",o="mouse",(e==="pointerout"||e==="pointerover")&&(E=ud,g="onPointerLeave",d="onPointerEnter",o="pointer"),w=p==null?m:ji(p),h=M==null?m:ji(M),m=new E(g,o+"leave",p,l,f),m.target=w,m.relatedTarget=h,g=null,Na(f)===c&&(E=new E(d,o+"enter",M,l,f),E.target=h,E.relatedTarget=w,g=E),w=g,p&&M)t:{for(E=e1,d=p,o=M,h=0,g=d;g;g=E(g))h++;g=0;for(var C=o;C;C=E(C))g++;for(;0<h-g;)d=E(d),h--;for(;0<g-h;)o=E(o),g--;for(;h--;){if(d===o||o!==null&&d===o.alternate){E=d;break t}d=E(d),o=E(o)}E=null}else E=null;p!==null&&$d(y,m,p,E,!1),M!==null&&w!==null&&$d(y,w,M,E,!0)}}e:{if(m=c?ji(c):window,p=m.nodeName&&m.nodeName.toLowerCase(),p==="select"||p==="input"&&m.type==="file")var H=cd;else if(od(m))if(Fm)H=mv;else{H=fv;var x=cv}else p=m.nodeName,!p||p.toLowerCase()!=="input"||m.type!=="checkbox"&&m.type!=="radio"?c&&Bo(c.elementType)&&(H=cd):H=dv;if(H&&(H=H(e,c))){Km(y,H,l,f);break e}x&&x(e,m,c),e==="focusout"&&c&&m.type==="number"&&c.memoizedProps.value!=null&&Kr(m,"number",m.value)}switch(x=c?ji(c):window,e){case"focusin":(od(x)||x.contentEditable==="true")&&(Ua=x,Pr=c,Fi=null);break;case"focusout":Fi=Pr=Ua=null;break;case"mousedown":kr=!0;break;case"contextmenu":case"mouseup":case"dragend":kr=!1,hd(y,l,f);break;case"selectionchange":if(pv)break;case"keydown":case"keyup":hd(y,l,f)}var D;if(Xo)e:{switch(e){case"compositionstart":var b="onCompositionStart";break e;case"compositionend":b="onCompositionEnd";break e;case"compositionupdate":b="onCompositionUpdate";break e}b=void 0}else wa?Vm(e,l)&&(b="onCompositionEnd"):e==="keydown"&&l.keyCode===229&&(b="onCompositionStart");b&&(Zm&&l.locale!=="ko"&&(wa||b!=="onCompositionStart"?b==="onCompositionEnd"&&wa&&(D=jm()):(bl=f,Lo="value"in bl?bl.value:bl.textContent,wa=!0)),x=Wu(c,b),0<x.length&&(b=new nd(b,e,null,l,f),y.push({event:b,listeners:x}),D?b.data=D:(D=Qm(l),D!==null&&(b.data=D)))),(D=nv?uv(e,l):sv(e,l))&&(b=Wu(c,"onBeforeInput"),0<b.length&&(x=new nd("onBeforeInput","beforeinput",null,l,f),y.push({event:x,listeners:b}),x.data=D)),$v(y,e,c,l,f)}Xp(y,t)})}function pn(e,t,l){return{instance:e,listener:t,currentTarget:l}}function Wu(e,t){for(var l=t+"Capture",a=[];e!==null;){var i=e,n=i.stateNode;if(i=i.tag,i!==5&&i!==26&&i!==27||n===null||(i=un(e,l),i!=null&&a.unshift(pn(e,i,n)),i=un(e,t),i!=null&&a.push(pn(e,i,n))),e.tag===3)return a;e=e.return}return[]}function e1(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function $d(e,t,l,a,i){for(var n=t._reactName,u=[];l!==null&&l!==a;){var s=l,r=s.alternate,c=s.stateNode;if(s=s.tag,r!==null&&r===a)break;s!==5&&s!==26&&s!==27||c===null||(r=c,i?(c=un(l,n),c!=null&&u.unshift(pn(l,c,r))):i||(c=un(l,n),c!=null&&u.push(pn(l,c,r)))),l=l.return}u.length!==0&&e.push({event:t,listeners:u})}var t1=/\r\n?/g,l1=/\u0000|\uFFFD/g;function Id(e){return(typeof e=="string"?e:""+e).replace(t1,`
`).replace(l1,"")}function Zp(e,t){return t=Id(t),Id(e)===t}function K(e,t,l,a,i,n){switch(l){case"children":typeof a=="string"?t==="body"||t==="textarea"&&a===""||$a(e,a):(typeof a=="number"||typeof a=="bigint")&&t!=="body"&&$a(e,""+a);break;case"className":eu(e,"class",a);break;case"tabIndex":eu(e,"tabindex",a);break;case"dir":case"role":case"viewBox":case"width":case"height":eu(e,l,a);break;case"style":qm(e,a,n);break;case"data":if(t!=="object"){eu(e,"data",a);break}case"src":case"href":if(a===""&&(t!=="a"||l!=="href")){e.removeAttribute(l);break}if(a==null||typeof a=="function"||typeof a=="symbol"||typeof a=="boolean"){e.removeAttribute(l);break}a=pu(""+a),e.setAttribute(l,a);break;case"action":case"formAction":if(typeof a=="function"){e.setAttribute(l,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof n=="function"&&(l==="formAction"?(t!=="input"&&K(e,t,"name",i.name,i,null),K(e,t,"formEncType",i.formEncType,i,null),K(e,t,"formMethod",i.formMethod,i,null),K(e,t,"formTarget",i.formTarget,i,null)):(K(e,t,"encType",i.encType,i,null),K(e,t,"method",i.method,i,null),K(e,t,"target",i.target,i,null)));if(a==null||typeof a=="symbol"||typeof a=="boolean"){e.removeAttribute(l);break}a=pu(""+a),e.setAttribute(l,a);break;case"onClick":a!=null&&(e.onclick=Kt);break;case"onScroll":a!=null&&U("scroll",e);break;case"onScrollEnd":a!=null&&U("scrollend",e);break;case"dangerouslySetInnerHTML":if(a!=null){if(typeof a!="object"||!("__html"in a))throw Error(v(61));if(l=a.__html,l!=null){if(i.children!=null)throw Error(v(60));e.innerHTML=l}}break;case"multiple":e.multiple=a&&typeof a!="function"&&typeof a!="symbol";break;case"muted":e.muted=a&&typeof a!="function"&&typeof a!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(a==null||typeof a=="function"||typeof a=="boolean"||typeof a=="symbol"){e.removeAttribute("xlink:href");break}l=pu(""+a),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",l);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":a!=null&&typeof a!="function"&&typeof a!="symbol"?e.setAttribute(l,""+a):e.removeAttribute(l);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":a&&typeof a!="function"&&typeof a!="symbol"?e.setAttribute(l,""):e.removeAttribute(l);break;case"capture":case"download":a===!0?e.setAttribute(l,""):a!==!1&&a!=null&&typeof a!="function"&&typeof a!="symbol"?e.setAttribute(l,a):e.removeAttribute(l);break;case"cols":case"rows":case"size":case"span":a!=null&&typeof a!="function"&&typeof a!="symbol"&&!isNaN(a)&&1<=a?e.setAttribute(l,a):e.removeAttribute(l);break;case"rowSpan":case"start":a==null||typeof a=="function"||typeof a=="symbol"||isNaN(a)?e.removeAttribute(l):e.setAttribute(l,a);break;case"popover":U("beforetoggle",e),U("toggle",e),hu(e,"popover",a);break;case"xlinkActuate":Yt(e,"http://www.w3.org/1999/xlink","xlink:actuate",a);break;case"xlinkArcrole":Yt(e,"http://www.w3.org/1999/xlink","xlink:arcrole",a);break;case"xlinkRole":Yt(e,"http://www.w3.org/1999/xlink","xlink:role",a);break;case"xlinkShow":Yt(e,"http://www.w3.org/1999/xlink","xlink:show",a);break;case"xlinkTitle":Yt(e,"http://www.w3.org/1999/xlink","xlink:title",a);break;case"xlinkType":Yt(e,"http://www.w3.org/1999/xlink","xlink:type",a);break;case"xmlBase":Yt(e,"http://www.w3.org/XML/1998/namespace","xml:base",a);break;case"xmlLang":Yt(e,"http://www.w3.org/XML/1998/namespace","xml:lang",a);break;case"xmlSpace":Yt(e,"http://www.w3.org/XML/1998/namespace","xml:space",a);break;case"is":hu(e,"is",a);break;case"innerText":case"textContent":break;default:(!(2<l.length)||l[0]!=="o"&&l[0]!=="O"||l[1]!=="n"&&l[1]!=="N")&&(l=Og.get(l)||l,hu(e,l,a))}}function So(e,t,l,a,i,n){switch(l){case"style":qm(e,a,n);break;case"dangerouslySetInnerHTML":if(a!=null){if(typeof a!="object"||!("__html"in a))throw Error(v(61));if(l=a.__html,l!=null){if(i.children!=null)throw Error(v(60));e.innerHTML=l}}break;case"children":typeof a=="string"?$a(e,a):(typeof a=="number"||typeof a=="bigint")&&$a(e,""+a);break;case"onScroll":a!=null&&U("scroll",e);break;case"onScrollEnd":a!=null&&U("scrollend",e);break;case"onClick":a!=null&&(e.onclick=Kt);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!Hm.hasOwnProperty(l))e:{if(l[0]==="o"&&l[1]==="n"&&(i=l.endsWith("Capture"),t=l.slice(2,i?l.length-7:void 0),n=e[Ye]||null,n=n!=null?n[l]:null,typeof n=="function"&&e.removeEventListener(t,n,i),typeof a=="function")){typeof n!="function"&&n!==null&&(l in e?e[l]=null:e.hasAttribute(l)&&e.removeAttribute(l)),e.addEventListener(t,a,i);break e}l in e?e[l]=a:a===!0?e.setAttribute(l,""):hu(e,l,a)}}}function Ce(e,t,l){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":U("error",e),U("load",e);var a=!1,i=!1,n;for(n in l)if(l.hasOwnProperty(n)){var u=l[n];if(u!=null)switch(n){case"src":a=!0;break;case"srcSet":i=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(v(137,t));default:K(e,t,n,u,l,null)}}i&&K(e,t,"srcSet",l.srcSet,l,null),a&&K(e,t,"src",l.src,l,null);return;case"input":U("invalid",e);var s=n=u=i=null,r=null,c=null;for(a in l)if(l.hasOwnProperty(a)){var f=l[a];if(f!=null)switch(a){case"name":i=f;break;case"type":u=f;break;case"checked":r=f;break;case"defaultChecked":c=f;break;case"value":n=f;break;case"defaultValue":s=f;break;case"children":case"dangerouslySetInnerHTML":if(f!=null)throw Error(v(137,t));break;default:K(e,t,a,f,l,null)}}Bm(e,n,s,r,c,u,i,!1);return;case"select":U("invalid",e),a=u=n=null;for(i in l)if(l.hasOwnProperty(i)&&(s=l[i],s!=null))switch(i){case"value":n=s;break;case"defaultValue":u=s;break;case"multiple":a=s;default:K(e,t,i,s,l,null)}t=n,l=u,e.multiple=!!a,t!=null?Va(e,!!a,t,!1):l!=null&&Va(e,!!a,l,!0);return;case"textarea":U("invalid",e),n=i=a=null;for(u in l)if(l.hasOwnProperty(u)&&(s=l[u],s!=null))switch(u){case"value":a=s;break;case"defaultValue":i=s;break;case"children":n=s;break;case"dangerouslySetInnerHTML":if(s!=null)throw Error(v(91));break;default:K(e,t,u,s,l,null)}Lm(e,a,i,n);return;case"option":for(r in l)l.hasOwnProperty(r)&&(a=l[r],a!=null)&&(r==="selected"?e.selected=a&&typeof a!="function"&&typeof a!="symbol":K(e,t,r,a,l,null));return;case"dialog":U("beforetoggle",e),U("toggle",e),U("cancel",e),U("close",e);break;case"iframe":case"object":U("load",e);break;case"video":case"audio":for(a=0;a<hn.length;a++)U(hn[a],e);break;case"image":U("error",e),U("load",e);break;case"details":U("toggle",e);break;case"embed":case"source":case"link":U("error",e),U("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(c in l)if(l.hasOwnProperty(c)&&(a=l[c],a!=null))switch(c){case"children":case"dangerouslySetInnerHTML":throw Error(v(137,t));default:K(e,t,c,a,l,null)}return;default:if(Bo(t)){for(f in l)l.hasOwnProperty(f)&&(a=l[f],a!==void 0&&So(e,t,f,a,l,void 0));return}}for(s in l)l.hasOwnProperty(s)&&(a=l[s],a!=null&&K(e,t,s,a,l,null))}function a1(e,t,l,a){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var i=null,n=null,u=null,s=null,r=null,c=null,f=null;for(p in l){var y=l[p];if(l.hasOwnProperty(p)&&y!=null)switch(p){case"checked":break;case"value":break;case"defaultValue":r=y;default:a.hasOwnProperty(p)||K(e,t,p,null,a,y)}}for(var m in a){var p=a[m];if(y=l[m],a.hasOwnProperty(m)&&(p!=null||y!=null))switch(m){case"type":n=p;break;case"name":i=p;break;case"checked":c=p;break;case"defaultChecked":f=p;break;case"value":u=p;break;case"defaultValue":s=p;break;case"children":case"dangerouslySetInnerHTML":if(p!=null)throw Error(v(137,t));break;default:p!==y&&K(e,t,m,p,a,y)}}Qr(e,u,s,r,c,f,n,i);return;case"select":p=u=s=m=null;for(n in l)if(r=l[n],l.hasOwnProperty(n)&&r!=null)switch(n){case"value":break;case"multiple":p=r;default:a.hasOwnProperty(n)||K(e,t,n,null,a,r)}for(i in a)if(n=a[i],r=l[i],a.hasOwnProperty(i)&&(n!=null||r!=null))switch(i){case"value":m=n;break;case"defaultValue":s=n;break;case"multiple":u=n;default:n!==r&&K(e,t,i,n,a,r)}t=s,l=u,a=p,m!=null?Va(e,!!l,m,!1):!!a!=!!l&&(t!=null?Va(e,!!l,t,!0):Va(e,!!l,l?[]:"",!1));return;case"textarea":p=m=null;for(s in l)if(i=l[s],l.hasOwnProperty(s)&&i!=null&&!a.hasOwnProperty(s))switch(s){case"value":break;case"children":break;default:K(e,t,s,null,a,i)}for(u in a)if(i=a[u],n=l[u],a.hasOwnProperty(u)&&(i!=null||n!=null))switch(u){case"value":m=i;break;case"defaultValue":p=i;break;case"children":break;case"dangerouslySetInnerHTML":if(i!=null)throw Error(v(91));break;default:i!==n&&K(e,t,u,i,a,n)}Ym(e,m,p);return;case"option":for(var M in l)m=l[M],l.hasOwnProperty(M)&&m!=null&&!a.hasOwnProperty(M)&&(M==="selected"?e.selected=!1:K(e,t,M,null,a,m));for(r in a)m=a[r],p=l[r],a.hasOwnProperty(r)&&m!==p&&(m!=null||p!=null)&&(r==="selected"?e.selected=m&&typeof m!="function"&&typeof m!="symbol":K(e,t,r,m,a,p));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var E in l)m=l[E],l.hasOwnProperty(E)&&m!=null&&!a.hasOwnProperty(E)&&K(e,t,E,null,a,m);for(c in a)if(m=a[c],p=l[c],a.hasOwnProperty(c)&&m!==p&&(m!=null||p!=null))switch(c){case"children":case"dangerouslySetInnerHTML":if(m!=null)throw Error(v(137,t));break;default:K(e,t,c,m,a,p)}return;default:if(Bo(t)){for(var w in l)m=l[w],l.hasOwnProperty(w)&&m!==void 0&&!a.hasOwnProperty(w)&&So(e,t,w,void 0,a,m);for(f in a)m=a[f],p=l[f],!a.hasOwnProperty(f)||m===p||m===void 0&&p===void 0||So(e,t,f,m,a,p);return}}for(var d in l)m=l[d],l.hasOwnProperty(d)&&m!=null&&!a.hasOwnProperty(d)&&K(e,t,d,null,a,m);for(y in a)m=a[y],p=l[y],!a.hasOwnProperty(y)||m===p||m==null&&p==null||K(e,t,y,m,a,p)}function em(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function i1(){if(typeof performance.getEntriesByType=="function"){for(var e=0,t=0,l=performance.getEntriesByType("resource"),a=0;a<l.length;a++){var i=l[a],n=i.transferSize,u=i.initiatorType,s=i.duration;if(n&&s&&em(u)){for(u=0,s=i.responseEnd,a+=1;a<l.length;a++){var r=l[a],c=r.startTime;if(c>s)break;var f=r.transferSize,y=r.initiatorType;f&&em(y)&&(r=r.responseEnd,u+=f*(r<s?1:(s-c)/(r-c)))}if(--a,t+=8*(n+u)/(i.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var Eo=null,xo=null;function $u(e){return e.nodeType===9?e:e.ownerDocument}function tm(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function Vp(e,t){if(e===0)switch(t){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&t==="foreignObject"?0:e}function To(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.children=="bigint"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Nr=null;function n1(){var e=window.event;return e&&e.type==="popstate"?e===Nr?!1:(Nr=e,!0):(Nr=null,!1)}var Qp=typeof setTimeout=="function"?setTimeout:void 0,u1=typeof clearTimeout=="function"?clearTimeout:void 0,lm=typeof Promise=="function"?Promise:void 0,s1=typeof queueMicrotask=="function"?queueMicrotask:typeof lm<"u"?function(e){return lm.resolve(null).then(e).catch(r1)}:Qp;function r1(e){setTimeout(function(){throw e})}function Bl(e){return e==="head"}function am(e,t){var l=t,a=0;do{var i=l.nextSibling;if(e.removeChild(l),i&&i.nodeType===8)if(l=i.data,l==="/$"||l==="/&"){if(a===0){e.removeChild(i),ui(t);return}a--}else if(l==="$"||l==="$?"||l==="$~"||l==="$!"||l==="&")a++;else if(l==="html")an(e.ownerDocument.documentElement);else if(l==="head"){l=e.ownerDocument.head,an(l);for(var n=l.firstChild;n;){var u=n.nextSibling,s=n.nodeName;n[xn]||s==="SCRIPT"||s==="STYLE"||s==="LINK"&&n.rel.toLowerCase()==="stylesheet"||l.removeChild(n),n=u}}else l==="body"&&an(e.ownerDocument.body);l=i}while(l);ui(t)}function im(e,t){var l=e;e=0;do{var a=l.nextSibling;if(l.nodeType===1?t?(l._stashedDisplay=l.style.display,l.style.display="none"):(l.style.display=l._stashedDisplay||"",l.getAttribute("style")===""&&l.removeAttribute("style")):l.nodeType===3&&(t?(l._stashedText=l.nodeValue,l.nodeValue=""):l.nodeValue=l._stashedText||""),a&&a.nodeType===8)if(l=a.data,l==="/$"){if(e===0)break;e--}else l!=="$"&&l!=="$?"&&l!=="$~"&&l!=="$!"||e++;l=a}while(l)}function Co(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var l=t;switch(t=t.nextSibling,l.nodeName){case"HTML":case"HEAD":case"BODY":Co(l),Uo(l);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(l.rel.toLowerCase()==="stylesheet")continue}e.removeChild(l)}}function o1(e,t,l,a){for(;e.nodeType===1;){var i=l;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!a&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(a){if(!e[xn])switch(t){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(n=e.getAttribute("rel"),n==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(n!==i.rel||e.getAttribute("href")!==(i.href==null||i.href===""?null:i.href)||e.getAttribute("crossorigin")!==(i.crossOrigin==null?null:i.crossOrigin)||e.getAttribute("title")!==(i.title==null?null:i.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(n=e.getAttribute("src"),(n!==(i.src==null?null:i.src)||e.getAttribute("type")!==(i.type==null?null:i.type)||e.getAttribute("crossorigin")!==(i.crossOrigin==null?null:i.crossOrigin))&&n&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(t==="input"&&e.type==="hidden"){var n=i.name==null?null:""+i.name;if(i.type==="hidden"&&e.getAttribute("name")===n)return e}else return e;if(e=ct(e.nextSibling),e===null)break}return null}function c1(e,t,l){if(t==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!l||(e=ct(e.nextSibling),e===null))return null;return e}function Kp(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!t||(e=ct(e.nextSibling),e===null))return null;return e}function Go(e){return e.data==="$?"||e.data==="$~"}function Ao(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function f1(e,t){var l=e.ownerDocument;if(e.data==="$~")e._reactRetry=t;else if(e.data!=="$?"||l.readyState!=="loading")t();else{var a=function(){t(),l.removeEventListener("DOMContentLoaded",a)};l.addEventListener("DOMContentLoaded",a),e._reactRetry=a}}function ct(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?"||t==="$~"||t==="&"||t==="F!"||t==="F")break;if(t==="/$"||t==="/&")return null}}return e}var zo=null;function nm(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var l=e.data;if(l==="/$"||l==="/&"){if(t===0)return ct(e.nextSibling);t--}else l!=="$"&&l!=="$!"&&l!=="$?"&&l!=="$~"&&l!=="&"||t++}e=e.nextSibling}return null}function um(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var l=e.data;if(l==="$"||l==="$!"||l==="$?"||l==="$~"||l==="&"){if(t===0)return e;t--}else l!=="/$"&&l!=="/&"||t++}e=e.previousSibling}return null}function Fp(e,t,l){switch(t=$u(l),e){case"html":if(e=t.documentElement,!e)throw Error(v(452));return e;case"head":if(e=t.head,!e)throw Error(v(453));return e;case"body":if(e=t.body,!e)throw Error(v(454));return e;default:throw Error(v(451))}}function an(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);Uo(e)}var ft=new Map,sm=new Set;function Iu(e){return typeof e.getRootNode=="function"?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var ll=j.d;j.d={f:d1,r:m1,D:h1,C:p1,L:y1,m:g1,X:b1,S:v1,M:M1};function d1(){var e=ll.f(),t=ys();return e||t}function m1(e){var t=ri(e);t!==null&&t.tag===5&&t.type==="form"?qh(t):ll.r(e)}var di=typeof document>"u"?null:document;function Jp(e,t,l){var a=di;if(a&&typeof t=="string"&&t){var i=ut(t);i='link[rel="'+e+'"][href="'+i+'"]',typeof l=="string"&&(i+='[crossorigin="'+l+'"]'),sm.has(i)||(sm.add(i),e={rel:e,crossOrigin:l,href:t},a.querySelector(i)===null&&(t=a.createElement("link"),Ce(t,"link",e),be(t),a.head.appendChild(t)))}}function h1(e){ll.D(e),Jp("dns-prefetch",e,null)}function p1(e,t){ll.C(e,t),Jp("preconnect",e,t)}function y1(e,t,l){ll.L(e,t,l);var a=di;if(a&&e&&t){var i='link[rel="preload"][as="'+ut(t)+'"]';t==="image"&&l&&l.imageSrcSet?(i+='[imagesrcset="'+ut(l.imageSrcSet)+'"]',typeof l.imageSizes=="string"&&(i+='[imagesizes="'+ut(l.imageSizes)+'"]')):i+='[href="'+ut(e)+'"]';var n=i;switch(t){case"style":n=ni(e);break;case"script":n=mi(e)}ft.has(n)||(e=ee({rel:"preload",href:t==="image"&&l&&l.imageSrcSet?void 0:e,as:t},l),ft.set(n,e),a.querySelector(i)!==null||t==="style"&&a.querySelector(Rn(n))||t==="script"&&a.querySelector(_n(n))||(t=a.createElement("link"),Ce(t,"link",e),be(t),a.head.appendChild(t)))}}function g1(e,t){ll.m(e,t);var l=di;if(l&&e){var a=t&&typeof t.as=="string"?t.as:"script",i='link[rel="modulepreload"][as="'+ut(a)+'"][href="'+ut(e)+'"]',n=i;switch(a){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":n=mi(e)}if(!ft.has(n)&&(e=ee({rel:"modulepreload",href:e},t),ft.set(n,e),l.querySelector(i)===null)){switch(a){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(l.querySelector(_n(n)))return}a=l.createElement("link"),Ce(a,"link",e),be(a),l.head.appendChild(a)}}}function v1(e,t,l){ll.S(e,t,l);var a=di;if(a&&e){var i=Za(a).hoistableStyles,n=ni(e);t=t||"default";var u=i.get(n);if(!u){var s={loading:0,preload:null};if(u=a.querySelector(Rn(n)))s.loading=5;else{e=ee({rel:"stylesheet",href:e,"data-precedence":t},l),(l=ft.get(n))&&Sc(e,l);var r=u=a.createElement("link");be(r),Ce(r,"link",e),r._p=new Promise(function(c,f){r.onload=c,r.onerror=f}),r.addEventListener("load",function(){s.loading|=1}),r.addEventListener("error",function(){s.loading|=2}),s.loading|=4,Cu(u,t,a)}u={type:"stylesheet",instance:u,count:1,state:s},i.set(n,u)}}}function b1(e,t){ll.X(e,t);var l=di;if(l&&e){var a=Za(l).hoistableScripts,i=mi(e),n=a.get(i);n||(n=l.querySelector(_n(i)),n||(e=ee({src:e,async:!0},t),(t=ft.get(i))&&Ec(e,t),n=l.createElement("script"),be(n),Ce(n,"link",e),l.head.appendChild(n)),n={type:"script",instance:n,count:1,state:null},a.set(i,n))}}function M1(e,t){ll.M(e,t);var l=di;if(l&&e){var a=Za(l).hoistableScripts,i=mi(e),n=a.get(i);n||(n=l.querySelector(_n(i)),n||(e=ee({src:e,async:!0,type:"module"},t),(t=ft.get(i))&&Ec(e,t),n=l.createElement("script"),be(n),Ce(n,"link",e),l.head.appendChild(n)),n={type:"script",instance:n,count:1,state:null},a.set(i,n))}}function rm(e,t,l,a){var i=(i=xl.current)?Iu(i):null;if(!i)throw Error(v(446));switch(e){case"meta":case"title":return null;case"style":return typeof l.precedence=="string"&&typeof l.href=="string"?(t=ni(l.href),l=Za(i).hoistableStyles,a=l.get(t),a||(a={type:"style",instance:null,count:0,state:null},l.set(t,a)),a):{type:"void",instance:null,count:0,state:null};case"link":if(l.rel==="stylesheet"&&typeof l.href=="string"&&typeof l.precedence=="string"){e=ni(l.href);var n=Za(i).hoistableStyles,u=n.get(e);if(u||(i=i.ownerDocument||i,u={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},n.set(e,u),(n=i.querySelector(Rn(e)))&&!n._p&&(u.instance=n,u.state.loading=5),ft.has(e)||(l={rel:"preload",as:"style",href:l.href,crossOrigin:l.crossOrigin,integrity:l.integrity,media:l.media,hrefLang:l.hrefLang,referrerPolicy:l.referrerPolicy},ft.set(e,l),n||S1(i,e,l,u.state))),t&&a===null)throw Error(v(528,""));return u}if(t&&a!==null)throw Error(v(529,""));return null;case"script":return t=l.async,l=l.src,typeof l=="string"&&t&&typeof t!="function"&&typeof t!="symbol"?(t=mi(l),l=Za(i).hoistableScripts,a=l.get(t),a||(a={type:"script",instance:null,count:0,state:null},l.set(t,a)),a):{type:"void",instance:null,count:0,state:null};default:throw Error(v(444,e))}}function ni(e){return'href="'+ut(e)+'"'}function Rn(e){return'link[rel="stylesheet"]['+e+"]"}function Pp(e){return ee({},e,{"data-precedence":e.precedence,precedence:null})}function S1(e,t,l,a){e.querySelector('link[rel="preload"][as="style"]['+t+"]")?a.loading=1:(t=e.createElement("link"),a.preload=t,t.addEventListener("load",function(){return a.loading|=1}),t.addEventListener("error",function(){return a.loading|=2}),Ce(t,"link",l),be(t),e.head.appendChild(t))}function mi(e){return'[src="'+ut(e)+'"]'}function _n(e){return"script[async]"+e}function om(e,t,l){if(t.count++,t.instance===null)switch(t.type){case"style":var a=e.querySelector('style[data-href~="'+ut(l.href)+'"]');if(a)return t.instance=a,be(a),a;var i=ee({},l,{"data-href":l.href,"data-precedence":l.precedence,href:null,precedence:null});return a=(e.ownerDocument||e).createElement("style"),be(a),Ce(a,"style",i),Cu(a,l.precedence,e),t.instance=a;case"stylesheet":i=ni(l.href);var n=e.querySelector(Rn(i));if(n)return t.state.loading|=4,t.instance=n,be(n),n;a=Pp(l),(i=ft.get(i))&&Sc(a,i),n=(e.ownerDocument||e).createElement("link"),be(n);var u=n;return u._p=new Promise(function(s,r){u.onload=s,u.onerror=r}),Ce(n,"link",a),t.state.loading|=4,Cu(n,l.precedence,e),t.instance=n;case"script":return n=mi(l.src),(i=e.querySelector(_n(n)))?(t.instance=i,be(i),i):(a=l,(i=ft.get(n))&&(a=ee({},l),Ec(a,i)),e=e.ownerDocument||e,i=e.createElement("script"),be(i),Ce(i,"link",a),e.head.appendChild(i),t.instance=i);case"void":return null;default:throw Error(v(443,t.type))}else t.type==="stylesheet"&&(t.state.loading&4)===0&&(a=t.instance,t.state.loading|=4,Cu(a,l.precedence,e));return t.instance}function Cu(e,t,l){for(var a=l.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),i=a.length?a[a.length-1]:null,n=i,u=0;u<a.length;u++){var s=a[u];if(s.dataset.precedence===t)n=s;else if(n!==i)break}n?n.parentNode.insertBefore(e,n.nextSibling):(t=l.nodeType===9?l.head:l,t.insertBefore(e,t.firstChild))}function Sc(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.title==null&&(e.title=t.title)}function Ec(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.integrity==null&&(e.integrity=t.integrity)}var Gu=null;function cm(e,t,l){if(Gu===null){var a=new Map,i=Gu=new Map;i.set(l,a)}else i=Gu,a=i.get(l),a||(a=new Map,i.set(l,a));if(a.has(e))return a;for(a.set(e,null),l=l.getElementsByTagName(e),i=0;i<l.length;i++){var n=l[i];if(!(n[xn]||n[Ee]||e==="link"&&n.getAttribute("rel")==="stylesheet")&&n.namespaceURI!=="http://www.w3.org/2000/svg"){var u=n.getAttribute(t)||"";u=e+u;var s=a.get(u);s?s.push(n):a.set(u,[n])}}return a}function fm(e,t,l){e=e.ownerDocument||e,e.head.insertBefore(l,t==="title"?e.querySelector("head > title"):null)}function E1(e,t,l){if(l===1||t.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof t.precedence!="string"||typeof t.href!="string"||t.href==="")break;return!0;case"link":if(typeof t.rel!="string"||typeof t.href!="string"||t.href===""||t.onLoad||t.onError)break;return t.rel==="stylesheet"?(e=t.disabled,typeof t.precedence=="string"&&e==null):!0;case"script":if(t.async&&typeof t.async!="function"&&typeof t.async!="symbol"&&!t.onLoad&&!t.onError&&t.src&&typeof t.src=="string")return!0}return!1}function kp(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function x1(e,t,l,a){if(l.type==="stylesheet"&&(typeof a.media!="string"||matchMedia(a.media).matches!==!1)&&(l.state.loading&4)===0){if(l.instance===null){var i=ni(a.href),n=t.querySelector(Rn(i));if(n){t=n._p,t!==null&&typeof t=="object"&&typeof t.then=="function"&&(e.count++,e=es.bind(e),t.then(e,e)),l.state.loading|=4,l.instance=n,be(n);return}n=t.ownerDocument||t,a=Pp(a),(i=ft.get(i))&&Sc(a,i),n=n.createElement("link"),be(n);var u=n;u._p=new Promise(function(s,r){u.onload=s,u.onerror=r}),Ce(n,"link",a),l.instance=n}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(l,t),(t=l.state.preload)&&(l.state.loading&3)===0&&(e.count++,l=es.bind(e),t.addEventListener("load",l),t.addEventListener("error",l))}}var Hr=0;function T1(e,t){return e.stylesheets&&e.count===0&&Au(e,e.stylesheets),0<e.count||0<e.imgCount?function(l){var a=setTimeout(function(){if(e.stylesheets&&Au(e,e.stylesheets),e.unsuspend){var n=e.unsuspend;e.unsuspend=null,n()}},6e4+t);0<e.imgBytes&&Hr===0&&(Hr=62500*i1());var i=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&Au(e,e.stylesheets),e.unsuspend)){var n=e.unsuspend;e.unsuspend=null,n()}},(e.imgBytes>Hr?50:800)+t);return e.unsuspend=l,function(){e.unsuspend=null,clearTimeout(a),clearTimeout(i)}}:null}function es(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)Au(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var ts=null;function Au(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,ts=new Map,t.forEach(C1,e),ts=null,es.call(e))}function C1(e,t){if(!(t.state.loading&4)){var l=ts.get(e);if(l)var a=l.get(null);else{l=new Map,ts.set(e,l);for(var i=e.querySelectorAll("link[data-precedence],style[data-precedence]"),n=0;n<i.length;n++){var u=i[n];(u.nodeName==="LINK"||u.getAttribute("media")!=="not all")&&(l.set(u.dataset.precedence,u),a=u)}a&&l.set(null,a)}i=t.instance,u=i.getAttribute("data-precedence"),n=l.get(u)||a,n===a&&l.set(null,i),l.set(u,i),this.count++,a=es.bind(this),i.addEventListener("load",a),i.addEventListener("error",a),n?n.parentNode.insertBefore(i,n.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(i,e.firstChild)),t.state.loading|=4}}var yn={$$typeof:Qt,Provider:null,Consumer:null,_currentValue:Wl,_currentValue2:Wl,_threadCount:0};function G1(e,t,l,a,i,n,u,s,r){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=ur(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=ur(0),this.hiddenUpdates=ur(null),this.identifierPrefix=a,this.onUncaughtError=i,this.onCaughtError=n,this.onRecoverableError=u,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=r,this.incompleteTransitions=new Map}function Wp(e,t,l,a,i,n,u,s,r,c,f,y){return e=new G1(e,t,l,u,r,c,f,y,s),t=1,n===!0&&(t|=24),n=Ze(3,null,null,t),e.current=n,n.stateNode=e,t=Jo(),t.refCount++,e.pooledCache=t,t.refCount++,n.memoizedState={element:a,isDehydrated:l,cache:t},Wo(n),e}function $p(e){return e?(e=La,e):La}function Ip(e,t,l,a,i,n){i=$p(i),a.context===null?a.context=i:a.pendingContext=i,a=Cl(t),a.payload={element:l},n=n===void 0?null:n,n!==null&&(a.callback=n),l=Gl(e,a,t),l!==null&&(Be(l,e,t),Pi(l,e,t))}function dm(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var l=e.retryLane;e.retryLane=l!==0&&l<t?l:t}}function xc(e,t){dm(e,t),(e=e.alternate)&&dm(e,t)}function ey(e){if(e.tag===13||e.tag===31){var t=ca(e,67108864);t!==null&&Be(t,e,67108864),xc(e,67108864)}}function mm(e){if(e.tag===13||e.tag===31){var t=Je();t=Ho(t);var l=ca(e,t);l!==null&&Be(l,e,t),xc(e,t)}}var ls=!0;function A1(e,t,l,a){var i=R.T;R.T=null;var n=j.p;try{j.p=2,Tc(e,t,l,a)}finally{j.p=n,R.T=i}}function z1(e,t,l,a){var i=R.T;R.T=null;var n=j.p;try{j.p=8,Tc(e,t,l,a)}finally{j.p=n,R.T=i}}function Tc(e,t,l,a){if(ls){var i=Ro(a);if(i===null)Or(e,t,a,as,l),hm(e,a);else if(_1(i,e,t,l,a))a.stopPropagation();else if(hm(e,a),t&4&&-1<R1.indexOf(e)){for(;i!==null;){var n=ri(i);if(n!==null)switch(n.tag){case 3:if(n=n.stateNode,n.current.memoizedState.isDehydrated){var u=Jl(n.pendingLanes);if(u!==0){var s=n;for(s.pendingLanes|=2,s.entangledLanes|=2;u;){var r=1<<31-Fe(u);s.entanglements[1]|=r,u&=~r}At(n),(X&6)===0&&(Ku=Qe()+500,zn(0,!1))}}break;case 31:case 13:s=ca(n,2),s!==null&&Be(s,n,2),ys(),xc(n,2)}if(n=Ro(a),n===null&&Or(e,t,a,as,l),n===i)break;i=n}i!==null&&a.stopPropagation()}else Or(e,t,a,null,l)}}function Ro(e){return e=Yo(e),Cc(e)}var as=null;function Cc(e){if(as=null,e=Na(e),e!==null){var t=bn(e);if(t===null)e=null;else{var l=t.tag;if(l===13){if(e=Mm(t),e!==null)return e;e=null}else if(l===31){if(e=Sm(t),e!==null)return e;e=null}else if(l===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return as=e,null}function ty(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(yg()){case Cm:return 2;case Gm:return 8;case Ou:case gg:return 32;case Am:return 268435456;default:return 32}default:return 32}}var _o=!1,Rl=null,_l=null,Dl=null,gn=new Map,vn=new Map,gl=[],R1="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function hm(e,t){switch(e){case"focusin":case"focusout":Rl=null;break;case"dragenter":case"dragleave":_l=null;break;case"mouseover":case"mouseout":Dl=null;break;case"pointerover":case"pointerout":gn.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":vn.delete(t.pointerId)}}function Yi(e,t,l,a,i,n){return e===null||e.nativeEvent!==n?(e={blockedOn:t,domEventName:l,eventSystemFlags:a,nativeEvent:n,targetContainers:[i]},t!==null&&(t=ri(t),t!==null&&ey(t)),e):(e.eventSystemFlags|=a,t=e.targetContainers,i!==null&&t.indexOf(i)===-1&&t.push(i),e)}function _1(e,t,l,a,i){switch(t){case"focusin":return Rl=Yi(Rl,e,t,l,a,i),!0;case"dragenter":return _l=Yi(_l,e,t,l,a,i),!0;case"mouseover":return Dl=Yi(Dl,e,t,l,a,i),!0;case"pointerover":var n=i.pointerId;return gn.set(n,Yi(gn.get(n)||null,e,t,l,a,i)),!0;case"gotpointercapture":return n=i.pointerId,vn.set(n,Yi(vn.get(n)||null,e,t,l,a,i)),!0}return!1}function ly(e){var t=Na(e.target);if(t!==null){var l=bn(t);if(l!==null){if(t=l.tag,t===13){if(t=Mm(l),t!==null){e.blockedOn=t,Wf(e.priority,function(){mm(l)});return}}else if(t===31){if(t=Sm(l),t!==null){e.blockedOn=t,Wf(e.priority,function(){mm(l)});return}}else if(t===3&&l.stateNode.current.memoizedState.isDehydrated){e.blockedOn=l.tag===3?l.stateNode.containerInfo:null;return}}}e.blockedOn=null}function zu(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var l=Ro(e.nativeEvent);if(l===null){l=e.nativeEvent;var a=new l.constructor(l.type,l);Fr=a,l.target.dispatchEvent(a),Fr=null}else return t=ri(l),t!==null&&ey(t),e.blockedOn=l,!1;t.shift()}return!0}function pm(e,t,l){zu(e)&&l.delete(t)}function D1(){_o=!1,Rl!==null&&zu(Rl)&&(Rl=null),_l!==null&&zu(_l)&&(_l=null),Dl!==null&&zu(Dl)&&(Dl=null),gn.forEach(pm),vn.forEach(pm)}function du(e,t){e.blockedOn===t&&(e.blockedOn=null,_o||(_o=!0,ye.unstable_scheduleCallback(ye.unstable_NormalPriority,D1)))}var mu=null;function ym(e){mu!==e&&(mu=e,ye.unstable_scheduleCallback(ye.unstable_NormalPriority,function(){mu===e&&(mu=null);for(var t=0;t<e.length;t+=3){var l=e[t],a=e[t+1],i=e[t+2];if(typeof a!="function"){if(Cc(a||l)===null)continue;break}var n=ri(l);n!==null&&(e.splice(t,3),t-=3,oo(n,{pending:!0,data:i,method:l.method,action:a},a,i))}}))}function ui(e){function t(r){return du(r,e)}Rl!==null&&du(Rl,e),_l!==null&&du(_l,e),Dl!==null&&du(Dl,e),gn.forEach(t),vn.forEach(t);for(var l=0;l<gl.length;l++){var a=gl[l];a.blockedOn===e&&(a.blockedOn=null)}for(;0<gl.length&&(l=gl[0],l.blockedOn===null);)ly(l),l.blockedOn===null&&gl.shift();if(l=(e.ownerDocument||e).$$reactFormReplay,l!=null)for(a=0;a<l.length;a+=3){var i=l[a],n=l[a+1],u=i[Ye]||null;if(typeof n=="function")u||ym(l);else if(u){var s=null;if(n&&n.hasAttribute("formAction")){if(i=n,u=n[Ye]||null)s=u.formAction;else if(Cc(i)!==null)continue}else s=u.action;typeof s=="function"?l[a+1]=s:(l.splice(a,3),a-=3),ym(l)}}}function ay(){function e(n){n.canIntercept&&n.info==="react-transition"&&n.intercept({handler:function(){return new Promise(function(u){return i=u})},focusReset:"manual",scroll:"manual"})}function t(){i!==null&&(i(),i=null),a||setTimeout(l,20)}function l(){if(!a&&!navigation.transition){var n=navigation.currentEntry;n&&n.url!=null&&navigation.navigate(n.url,{state:n.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var a=!1,i=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",t),navigation.addEventListener("navigateerror",t),setTimeout(l,100),function(){a=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",t),navigation.removeEventListener("navigateerror",t),i!==null&&(i(),i=null)}}}function Gc(e){this._internalRoot=e}bs.prototype.render=Gc.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(v(409));var l=t.current,a=Je();Ip(l,a,e,t,null,null)};bs.prototype.unmount=Gc.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Ip(e.current,2,null,e,null,null),ys(),t[si]=null}};function bs(e){this._internalRoot=e}bs.prototype.unstable_scheduleHydration=function(e){if(e){var t=Om();e={blockedOn:null,target:e,priority:t};for(var l=0;l<gl.length&&t!==0&&t<gl[l].priority;l++);gl.splice(l,0,e),l===0&&ly(e)}};var gm=vm.version;if(gm!=="19.2.7")throw Error(v(527,gm,"19.2.7"));j.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(v(188)):(e=Object.keys(e).join(","),Error(v(268,e)));return e=og(t),e=e!==null?Em(e):null,e=e===null?null:e.stateNode,e};var O1={bundleType:0,version:"19.2.7",rendererPackageName:"react-dom",currentDispatcherRef:R,reconcilerVersion:"19.2.7"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&(Li=__REACT_DEVTOOLS_GLOBAL_HOOK__,!Li.isDisabled&&Li.supportsFiber))try{Mn=Li.inject(O1),Ke=Li}catch{}var Li;Ms.createRoot=function(e,t){if(!bm(e))throw Error(v(299));var l=!1,a="",i=Jh,n=Ph,u=kh;return t!=null&&(t.unstable_strictMode===!0&&(l=!0),t.identifierPrefix!==void 0&&(a=t.identifierPrefix),t.onUncaughtError!==void 0&&(i=t.onUncaughtError),t.onCaughtError!==void 0&&(n=t.onCaughtError),t.onRecoverableError!==void 0&&(u=t.onRecoverableError)),t=Wp(e,1,!1,null,null,l,a,null,i,n,u,ay),e[si]=t.current,Mc(e),new Gc(t)};Ms.hydrateRoot=function(e,t,l){if(!bm(e))throw Error(v(299));var a=!1,i="",n=Jh,u=Ph,s=kh,r=null;return l!=null&&(l.unstable_strictMode===!0&&(a=!0),l.identifierPrefix!==void 0&&(i=l.identifierPrefix),l.onUncaughtError!==void 0&&(n=l.onUncaughtError),l.onCaughtError!==void 0&&(u=l.onCaughtError),l.onRecoverableError!==void 0&&(s=l.onRecoverableError),l.formState!==void 0&&(r=l.formState)),t=Wp(e,1,!0,t,l??null,a,i,r,n,u,s,ay),t.context=$p(null),l=t.current,a=Je(),a=Ho(a),i=Cl(a),i.callback=null,Gl(l,i,a),l=a,t.current.lanes=l,En(t,l),At(t),e[si]=t.current,Mc(e),new bs(t)};Ms.version="19.2.7"});var sy=Mt((Zb,uy)=>{"use strict";function ny(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(ny)}catch(e){console.error(e)}}ny(),uy.exports=iy()});var fy=Mt(Es=>{"use strict";var H1=Symbol.for("react.transitional.element"),w1=Symbol.for("react.fragment");function cy(e,t,l){var a=null;if(l!==void 0&&(a=""+l),t.key!==void 0&&(a=""+t.key),"key"in t){l={};for(var i in t)i!=="key"&&(l[i]=t[i])}else l=t;return t=l.ref,{$$typeof:H1,type:e,key:a,ref:t!==void 0?t:null,props:l}}Es.Fragment=w1;Es.jsx=cy;Es.jsxs=cy});var Ge=Mt((Kb,dy)=>{"use strict";dy.exports=fy()});var H0=ue(sy(),1);var yt=ue(Ql(),1);var ae=ue(Ql(),1);function ry(e){return`${e.x}:${e.y}`}function oy(e,t,l,a,i){return a<1||i<1||l.width<=0||l.height<=0||e<l.left||t<l.top||e>=l.left+l.width||t>=l.top+l.height?null:{x:Math.min(a-1,Math.floor((e-l.left)/l.width*a)),y:Math.min(i-1,Math.floor((t-l.top)/l.height*i))}}var Ss=class{activeTiles=new Map;visitedTiles=new Set;lastTile=null;paintMode=null;begin(t){return this.visitedTiles.clear(),this.paintMode=this.activeTiles.has(ry(t))?"release":"press",this.lastTile=t,this.apply(t)}move(t){if(!this.paintMode)return[];let l=N1(this.lastTile??t,t).flatMap(a=>this.apply(a));return this.lastTile=t,l}end(){this.lastTile=null,this.paintMode=null,this.visitedTiles.clear()}reset(){this.end(),this.activeTiles.clear()}keys(){return[...this.activeTiles.keys()]}apply(t){let l=ry(t);if(!this.paintMode||this.visitedTiles.has(l))return[];this.visitedTiles.add(l);let a=this.paintMode==="press";return a?this.activeTiles.set(l,t):this.activeTiles.delete(l),[{...t,pressed:a}]}};function N1(e,t){let l=[],a=e.x,i=e.y,n=Math.abs(t.x-e.x),u=e.x<t.x?1:-1,s=-Math.abs(t.y-e.y),r=e.y<t.y?1:-1,c=n+s;for(;;){if(l.push({x:a,y:i}),a===t.x&&i===t.y)return l;let f=c*2;f>=s&&(c+=s,a+=u),f<=n&&(c+=n,i+=r)}}var hi=ue(Ge(),1),Ac=ue(Ql(),1);function da({frame:e,label:t="Vista del suelo",className:l=""}){return(0,hi.jsxs)("section",{className:`ml-frame-preview-panel ${l}`.trim(),children:[(0,hi.jsx)("span",{children:t}),(0,hi.jsx)(my,{frame:e})]})}function my({frame:e,interactive:t=!1,inputResetKey:l,onTilePress:a,onTileRelease:i,className:n=""}){let u=(0,ae.useRef)(null),s=(0,ae.useRef)(null),r=(0,ae.useRef)(new Ss),c=(0,ae.useRef)(l),[f,y]=(0,ae.useState)(()=>new Set),m={"--ml-floor-cols":e.width,"--ml-floor-rows":e.height},p=`ml-floor-preview ${t?"ml-floor-interactive":""} ${n}`.trim(),M=(0,ae.useCallback)(()=>{let b=document.activeElement;b instanceof HTMLElement&&u.current?.contains(b)&&b.blur()},[]),E=(0,ae.useCallback)((b,_)=>{let ge=u.current;return ge?oy(b,_,ge.getBoundingClientRect(),e.width,e.height):null},[e.height,e.width]),w=(0,ae.useCallback)(b=>{if(b.length!==0){for(let _ of b)_.pressed?a?.(_.x,_.y):i?.(_.x,_.y);y(new Set(r.current.keys()))}},[a,i]),d=(0,ae.useCallback)(b=>{!b||Number.isNaN(b.x)||Number.isNaN(b.y)||w(r.current.begin(b))},[w]),o=(0,ae.useCallback)(b=>{!b||Number.isNaN(b.x)||Number.isNaN(b.y)||w(r.current.move(b))},[w]),h=(0,ae.useCallback)(()=>{r.current.reset(),y(new Set)},[]);(0,ae.useEffect)(()=>{Object.is(c.current,l)||(c.current=l,h())},[h,l]),(0,ae.useEffect)(()=>{t||h()},[h,t]),(0,ae.useEffect)(()=>{if(!t)return;let b=()=>{s.current=null,r.current.end()},_=()=>{document.hidden&&b()};return window.addEventListener("blur",b),window.addEventListener("pointercancel",b),window.addEventListener("pointerup",b),document.addEventListener("visibilitychange",_),()=>{window.removeEventListener("blur",b),window.removeEventListener("pointercancel",b),window.removeEventListener("pointerup",b),document.removeEventListener("visibilitychange",_)}},[t]);let g=(0,ae.useCallback)(b=>{!t||b.button!==0||(b.preventDefault(),M(),s.current=b.pointerId,u.current?.setPointerCapture(b.pointerId),d(E(b.clientX,b.clientY)))},[d,M,t,E]),C=(0,ae.useCallback)(b=>{!t||s.current!==b.pointerId||(b.preventDefault(),o(E(b.clientX,b.clientY)))},[o,t,E]),H=(0,ae.useCallback)(b=>{!t||s.current!==b.pointerId||(o(E(b.clientX,b.clientY)),s.current=null,r.current.end(),M(),u.current?.hasPointerCapture(b.pointerId)&&u.current.releasePointerCapture(b.pointerId))},[M,o,t,E]),x=(0,ae.useCallback)(()=>{s.current=null,r.current.end(),M()},[M]),D=(0,ae.useCallback)(b=>{w(r.current.begin(b)),r.current.end()},[w]);return(0,hi.jsx)("div",{className:p,onLostPointerCapture:x,onPointerCancel:H,onPointerDown:g,onPointerMove:C,onPointerUp:H,ref:u,style:m,role:"grid","aria-label":"Vista del suelo",children:e.cells.map(b=>{let _={backgroundColor:b.color,gridColumnStart:b.x+1,gridRowStart:b.y+1},ge=`${b.x}-${b.y}`,Sa=f.has(`${b.x}:${b.y}`),gf={className:"ml-floor-tile",style:_,"data-tile-x":b.x,"data-tile-y":b.y,"data-color":b.color};return t?(0,Ac.createElement)("button",{...gf,"aria-label":`Baldosa ${b.x}, ${b.y}`,"aria-pressed":Sa,key:ge,onClick:w0=>{w0.detail===0&&D(b)},type:"button"}):(0,Ac.createElement)("span",{...gf,"aria-hidden":"true",key:ge})})})}var T=ue(Ge(),1),U1={ready:"Listo",waiting:"En espera",starting:"Preparados",running:"En juego",paused:"En pausa",finished:"Terminado"};function B1(e){return U1[e]??e}var py=(0,yt.createContext)({paused:!1});function yy({paused:e,children:t}){return(0,T.jsx)(py.Provider,{value:{paused:e},children:t})}function zt({title:e,phase:t,variant:l="default",children:a}){let n=(0,yt.useContext)(py).paused,u=n?"paused":t;return(0,T.jsxs)("section",{className:`ml-display-shell ml-tv-display ml-tv-display-${l}${n?" is-paused":""}`,"aria-label":`Pantalla de ${e}`,"data-paused":n||void 0,children:[(0,T.jsxs)("header",{className:"ml-display-header ml-tv-header",children:[(0,T.jsxs)("div",{className:"ml-tv-brand","aria-hidden":"true",children:[(0,T.jsx)("span",{className:"ml-tv-brand-mark"}),(0,T.jsxs)("span",{className:"ml-tv-brand-name",children:[(0,T.jsx)("b",{children:"Motion"}),(0,T.jsx)("b",{children:"Levels"})]})]}),(0,T.jsxs)("div",{className:"ml-tv-title",children:[(0,T.jsx)("span",{className:"ml-display-label",children:"Juego"}),(0,T.jsx)("h1",{children:e})]}),(0,T.jsx)("span",{className:`ml-status-pill ml-status-${u}`,children:B1(u)})]}),(0,T.jsx)("div",{className:"ml-display-content",children:a})]})}function pi({snapshot:e}){if(e.phase!=="waiting"&&e.phase!=="starting")return null;let t=e.readyPlayers??0,l=Math.max(e.requiredPlayers??e.playerCount,1),a=e.phase==="starting",i=Math.max(1,Math.ceil((e.countdownMillis??0)/1e3));return(0,T.jsxs)("section",{"aria-label":a?"El juego est\xE1 a punto de empezar":"Esperando jugadores",className:`ml-player-ready-overlay is-${e.phase}`,children:[(0,T.jsxs)("div",{className:"ml-player-ready-pulse","aria-hidden":"true",children:[(0,T.jsx)("i",{}),(0,T.jsx)("i",{}),(0,T.jsx)("i",{})]}),(0,T.jsx)("span",{children:a?"Todos listos":"Esperando jugadores"}),(0,T.jsx)("strong",{children:a?i:`${t}/${l}`}),(0,T.jsx)("b",{children:a?"El juego est\xE1 a punto de empezar":"Entra y permanece en la zona iluminada"})]})}function me({label:e,value:t,tone:l="cyan",className:a=""}){return(0,T.jsxs)("article",{className:`ml-metric ml-metric-${l} ${a}`.trim(),children:[(0,T.jsx)("span",{className:"ml-metric-label",children:e}),(0,T.jsx)("strong",{className:"ml-metric-value",children:t})]})}function yi({className:e="",lives:t,maxLives:l}){let a=Math.max(0,Math.trunc(l)),i=Math.min(a,Math.max(0,Math.trunc(t))),n=(0,yt.useRef)(i),u=(0,yt.useRef)(0),[s,r]=(0,yt.useState)(null);return(0,yt.useEffect)(()=>{let c=n.current;if(n.current=i,c===i)return;u.current+=1;let f={from:c,id:u.current,to:i};r(f);let y=window.setTimeout(()=>{r(m=>m?.id===f.id?null:m)},1100);return()=>window.clearTimeout(y)},[i]),(0,T.jsx)("div",{"aria-label":`${i} de ${a} vidas restantes`,className:`ml-lives-meter ${e}`.trim(),role:"img",children:Array.from({length:a},(c,f)=>{let y=f<i,p=s&&f>=Math.min(s.from,s.to)&&f<Math.max(s.from,s.to)?s.to>s.from?"is-regained":"is-losing":"";return(0,T.jsx)("span",{"aria-hidden":"true",className:`ml-life-heart ${y?"is-remaining":"is-lost"} ${p}`.trim(),"data-life-change":p||void 0,"data-life-state":y?"remaining":"lost",style:{"--ml-heart-index":f},children:(0,T.jsx)("span",{className:"ml-life-heart-glyph",children:"\u2665"})},f)})})}function Yl({children:e,columns:t=3,className:l=""}){return(0,T.jsx)("section",{className:`ml-metric-row ${l}`.trim(),style:{"--ml-metric-columns":t},children:e})}function gy({left:e,right:t,target:l,centerLabel:a,centerValue:i,centerCaption:n="",className:u=""}){return(0,T.jsxs)("section",{className:`ml-versus-scoreboard ${u}`.trim(),"aria-label":"Marcador",children:[(0,T.jsx)(hy,{player:e,side:"red",target:l}),(0,T.jsxs)("article",{className:"ml-versus-center",children:[(0,T.jsx)("span",{children:a}),(0,T.jsx)("strong",{children:i}),n?(0,T.jsx)("b",{children:n}):null]}),(0,T.jsx)(hy,{player:t,side:"blue",target:l})]})}function hy({player:e,side:t,target:l}){let a=Math.max(0,Math.min(1,e.score/Math.max(l,1)));return(0,T.jsxs)("article",{className:`ml-player-score-panel ml-player-score-${t}`,style:{"--ml-player":e.color,"--ml-player-rgb":Y1(e.color),"--ml-score-progress":a},children:[(0,T.jsxs)("div",{className:"ml-player-score-head",children:[(0,T.jsx)("span",{children:e.label}),(0,T.jsxs)("b",{children:[e.score,"/",l]})]}),(0,T.jsx)("strong",{children:e.score}),(0,T.jsx)("div",{className:"ml-player-score-track","aria-hidden":"true",children:(0,T.jsx)("i",{})})]})}function vy({rounds:e,totalRounds:t,activeRound:l,activeLabel:a="Ronda actual",activeCaption:i="Punto en curso",fallbackLabel:n="Pendiente",className:u=""}){let s=Math.max(e.length,t??0,1),r=new Map(e.map(o=>[o.index,o])),c=Array.from({length:s},(o,h)=>{let g=h+1;return r.get(g)??{index:g,winnerLabel:n,hits:0}}),f=e.length<s?e.length+1:null,y=l===void 0?f:l,m=y??Math.max(e.length,1),p=12,M=Math.min(Math.max(0,m-Math.ceil(p/2)),Math.max(0,s-p)),E=c.slice(M,M+p),w=s>E.length?`Rondas ${E[0]?.index}-${E.at(-1)?.index} de ${s}`:"Historial del partido",d={"--ml-round-count":E.length,"--ml-round-progress":`${Math.min(1,e.length/s)*100}%`};return(0,T.jsxs)("section",{className:`ml-round-strip ${u}`.trim(),"aria-label":"Rondas",style:d,children:[(0,T.jsxs)("div",{className:"ml-round-strip-head",children:[(0,T.jsxs)("div",{className:"ml-round-strip-title",children:[(0,T.jsx)("span",{children:"Rondas"}),(0,T.jsx)("small",{children:w})]}),(0,T.jsxs)("div",{className:"ml-round-strip-count","aria-label":`${e.length} de ${s} rondas jugadas`,children:[(0,T.jsx)("strong",{children:e.length}),(0,T.jsxs)("span",{children:["de ",s]})]})]}),(0,T.jsx)("div",{className:"ml-round-progress","aria-hidden":"true",children:(0,T.jsx)("i",{})}),(0,T.jsx)("div",{className:"ml-round-list",children:E.map(o=>{let h=o.winnerIndex===0||o.winnerIndex===1,g=!h&&o.index===y,C=o.winnerIndex===0?"is-red":o.winnerIndex===1?"is-blue":g?"is-current":"is-pending",H=o.hits??0;return(0,T.jsxs)("article",{className:`ml-round-card ${C}`,children:[(0,T.jsxs)("div",{className:"ml-round-card-head",children:[(0,T.jsxs)("span",{children:["R",o.index]}),(0,T.jsx)("i",{"aria-hidden":"true"})]}),(0,T.jsx)("strong",{children:h?o.winnerLabel||n:g?a:n}),h?(0,T.jsxs)("b",{children:[H," ",H===1?"golpe":"golpes"]}):null,g?(0,T.jsx)("b",{children:i}):null]},o.index)})})]})}function Y1(e){let t=e.replace("#","").trim(),l=t.length===3?t.split("").map(i=>i+i).join(""):t.padEnd(6,"0").slice(0,6),a=Number.parseInt(l,16);return Number.isFinite(a)?`${a>>16&255}, ${a>>8&255}, ${a&255}`:"255, 255, 255"}var Uc={};zi(Uc,{PlayerDisplay:()=>Ty,arkanoidConfigVars:()=>Nn,ballColor:()=>Nc,brickColors:()=>wc,createGame:()=>Hn,finishedFrame:()=>Dy,finishedSnapshot:()=>Oy,initEvents:()=>zy,manifest:()=>Dt,paddleColor:()=>Hc,runningFrame:()=>Ry,runningSnapshot:()=>_y});function gi(e,t){let l=t.centerX??(e.width-1)/2,a=t.centerY??(e.height-1)/2,i=Math.max(0,t.radius),n=Math.max(0,t.thickness??1);by(e,t.color,(u,s)=>{let r=My(u,s,l,a);return{distance:r,phase:Math.abs(r-i),selected:Math.abs(r-i)<=n}},0)}function Ll(e,t){let l=t.centerX??(e.width-1)/2,a=t.centerY??(e.height-1)/2,i=Math.max(1,Math.floor(t.period??7)),n=Math.min(i,Math.max(1,Math.floor(t.bandWidth??2))),u=Math.floor(t.step);by(e,t.color,(s,r)=>{let c=Math.floor(My(s,r,l,a)),f=L1(c+u,i);return{distance:c,phase:f,selected:f<n}},u)}function by(e,t,l,a){for(let i=0;i<e.height;i+=1)for(let n=0;n<e.width;n+=1){let u=l(n,i);if(!u.selected)continue;let s=typeof t=="function"?t({distance:u.distance,phase:u.phase,step:a,x:n,y:i}):t;s&&(e.cells[i*e.width+n]={x:n,y:i,color:s})}}function My(e,t,l,a){return Math.abs(e-l)+Math.abs(t-a)}function L1(e,t){return(e%t+t)%t}var S=16,z=32,q1=137,X1=0,j1=4294967295,gt=S*z,Z1=2e3,V1=650,Q1=["easy","medium","hard","expert"],K1=50,Ib=1e3/K1;function ma(e,t){return Number.isInteger(e)&&Number.isInteger(t)&&e>=0&&e<S&&t>=0&&t<z}function Oe(e,t){return{seed:F1(e.seed),playerCount:J1(e.playerCount,t),players:Array.isArray(e.players)?e.players:[],durationMillis:Sy(e.durationMillis,t.defaultDurationMillis),nowMillis:Sy(e.nowMillis,0),difficulty:W1(e.difficulty,t),options:$1(e.options,t)}}function F1(e){let t=typeof e=="number"&&Number.isFinite(e)?Math.trunc(e):q1;return k(t,X1,j1)}function J1(e,t){let l=typeof e=="number"&&Number.isFinite(e)?Math.round(e):P1(t);return t.players.allowAny===!0&&l===0?0:k(l,t.players.min,t.players.max)}function P1(e){return e.players.allowAny?0:e.players.min}function Sy(e,t){return typeof e=="number"&&Number.isFinite(e)?Math.max(0,e):t}function k1(e){let t=e.config?.difficulty?.options;return t?.length?[...t]:[...Q1]}function W1(e,t){let l=k1(t),a=t.config?.difficulty?.default,i=a&&l.includes(a)?a:l.includes("medium")?"medium":l[0]??"medium";return e&&l.includes(e)?e:i}function $1(e,t){let l=e??{};return Object.fromEntries((t.config?.vars??[]).map(a=>[a.key,Ey(a,l[a.key])]))}function Ey(e,t){if(e.type==="bool")return t===!0||t==="true"?!0:t===!1||t==="false"?!1:e.default;if(e.type==="enum"){let u=String(t??e.default);return e.options.some(r=>r.value===u)?u:e.default}let l=typeof t=="number"&&Number.isFinite(t)?t:typeof t=="string"&&t.trim()!==""?Number(t):Number.NaN,a=Number.isFinite(l)?l:e.default,i=e.type==="int"?Math.round(a):a;return k(i,e.min??-1/0,e.max??1/0)}function Rt(e,t){return Ey(t,e[t.key])}function dt(e="#05070a"){let t=[];for(let l=0;l<z;l+=1)for(let a=0;a<S;a+=1)t.push({x:a,y:l,color:e});return{width:S,height:z,cells:t}}function G(e,t,l,a){ma(t,l)&&(e.cells[l*e.width+t]={x:t,y:l,color:a})}function Q(e,t,l,a,i,n){for(let u=l;u<l+i;u+=1)for(let s=t;s<t+a;s+=1)G(e,s,u,n)}function A(e,t,l){return{cue:e,message:t.trimEnd().replace(/\.+$/u,""),atMillis:l}}function We(e){let t=e>>>0;return t===0&&(t=1),{next(){return t=Math.imul(t,1664525)+1013904223>>>0,t/4294967296},int(l){if(!Number.isFinite(l)||l<=0)throw new Error("maxExclusive must be greater than zero");return Math.floor(this.next()*l)},range(l,a){if(a<l)throw new Error("maxInclusive must be greater than or equal to minInclusive");return l+this.int(a-l+1)}}}function vi(e,t=[]){let l=["#35d7ff","#ff3bd7","#ffe176","#5fff9e"];return Array.from({length:e},(a,i)=>({index:i,label:t[i]?.label||t[i]?.name||`Player ${i+1}`,color:t[i]?.color||l[i%l.length]||l[0],score:0,lives:-1}))}function k(e,t,l){return Math.min(l,Math.max(t,e))}function xs(e,t={}){if(!Number.isInteger(e)||e<1)throw new Error("player ready zone count must be a positive integer");let l=k(Math.round(t.minX??0),0,S-1),a=k(Math.round(t.maxX??S-1),l,S-1),i=k(Math.round(t.minY??0),0,z-1),u=k(Math.round(t.maxY??z-1),i,z-1)-i+1;if(e>u)throw new Error("player ready zone count cannot exceed the available floor rows");return Array.from({length:e},(s,r)=>({minX:l,maxX:a,minY:i+Math.floor(u*r/e),maxY:i+Math.floor(u*(r+1)/e)-1}))}function vt(e,t,l=0){return new Rc(e,t,l)}function _c(e){return xy(e.mode==="player-ready"?e.countdownMillis:void 0,Z1)}function Dn(e){return Number.isFinite(e)?Math.max(0,e):0}var Rc=class{constructor(t,l,a){this.policy=t;this.zones=l;if(t.mode==="player-ready"&&l.length===0)throw new Error("player-ready games require at least one presence zone");this.countdownDuration=_c(t),this.releaseGraceMillis=xy(t.mode==="player-ready"?t.releaseGraceMillis:void 0,V1),this.zoneHeld=Array.from({length:l.length},()=>0),this.zoneGraceUntil=Array.from({length:l.length},()=>0),this.phase=t.mode==="immediate"?"running":"waiting";for(let i=0;i<z;i+=1)for(let n=0;n<S;n+=1)this.tileZones[i*S+n]=l.findIndex(u=>I1(n,i,u));this.reset(a)}policy;zones;countdownDuration;releaseGraceMillis;tileZones=new Int16Array(gt).fill(-1);tileHeld=new Uint8Array(gt);zoneHeld;zoneGraceUntil;phase;startAtMillis=0;reset(t=0){return this.tileHeld.fill(0),this.zoneHeld.fill(0),this.zoneGraceUntil.fill(0),this.phase=this.policy.mode==="immediate"?"running":"waiting",this.startAtMillis=Dn(t),this.state(t)}update(t){if(!ma(t.x,t.y))return this.tick(t.atMillis);let l=t.y*S+t.x,a=this.tileZones[l]??-1,i=this.tileHeld[l]===1;return a>=0&&i!==t.pressed&&(this.tileHeld[l]=t.pressed?1:0,t.pressed?(this.zoneHeld[a]=(this.zoneHeld[a]??0)+1,this.zoneGraceUntil[a]=0):(this.zoneHeld[a]=Math.max(0,(this.zoneHeld[a]??0)-1),this.zoneHeld[a]===0&&(this.zoneGraceUntil[a]=Dn(t.atMillis)+this.releaseGraceMillis))),this.tick(t.atMillis)}tick(t){if(this.policy.mode==="immediate"||this.phase==="running")return"none";let l=Dn(t),a=this.readyPlayerCount(l)===this.zones.length;return this.phase==="waiting"&&a?(this.phase="starting",this.startAtMillis=l+this.countdownDuration,"players-ready"):this.phase==="starting"&&!a?(this.phase="waiting",this.startAtMillis=0,"players-left"):this.phase==="starting"&&l>=this.startAtMillis?(this.phase="running","started"):"none"}state(t){let l=Dn(t);return{phase:this.phase,readyPlayers:this.readyPlayerCount(l),requiredPlayers:this.zones.length,countdownMillis:this.phase==="starting"?Math.max(0,this.startAtMillis-l):0}}zoneReady(t,l){let a=this.zoneGraceUntil[t]??0;return(this.zoneHeld[t]??0)>0||a>0&&a>=Dn(l)}readyPlayerCount(t){return this.zones.reduce((l,a,i)=>l+Number(this.zoneReady(i,t)),0)}};function xy(e,t){return e!==void 0&&Number.isFinite(e)&&e>0?e:t}function I1(e,t,l){return e>=l.minX&&e<=l.maxX&&t>=l.minY&&t<=l.maxY}function ha(e){return`#${zc(e.r)}${zc(e.g)}${zc(e.b)}`}function _t(e,t){return{r:k(Math.round(e.r*t/100),0,255),g:k(Math.round(e.g*t/100),0,255),b:k(Math.round(e.b*t/100),0,255)}}function On(e,t){return{r:k(e.r+t.r,0,255),g:k(e.g+t.g,0,255),b:k(e.b+t.b,0,255)}}function zc(e){return k(Math.round(e),0,255).toString(16).padStart(2,"0")}function bt(e){let t=Math.max(0,Math.ceil(e)),l=Math.ceil(t/1e3),a=Math.floor(l/60),i=l%60;return`${a}:${i.toString().padStart(2,"0")}`}var $e=ue(Ge(),1);function Ty({snapshot:e,frame:t}){let l=e.phase==="ready"?"Pisa abajo para mover y lanzar":e.lastEventMessage||"Rompe todos los bloques",a=e.success?"green":e.phase==="finished"?"red":e.phase==="ready"?"yellow":"cyan";return(0,$e.jsx)(zt,{title:e.label,phase:e.phase,children:(0,$e.jsxs)("div",{className:"ml-solo-display arkanoid-display",children:[(0,$e.jsx)(pi,{snapshot:e}),(0,$e.jsxs)("div",{className:"ml-solo-summary",children:[(0,$e.jsxs)(Yl,{columns:3,className:"ml-solo-number-row",children:[(0,$e.jsx)(me,{label:"Bloques",tone:"pink",value:`${e.score}/${e.totalBricks}`}),(0,$e.jsx)(me,{label:"Vidas",tone:"neutral",value:(0,$e.jsx)(yi,{lives:e.lives,maxLives:e.maxLives})}),(0,$e.jsx)(me,{label:"Tiempo",tone:"yellow",value:bt(e.elapsedMillis)})]}),(0,$e.jsx)(me,{className:"ml-solo-message",label:"Estado",tone:a,value:l})]}),t?(0,$e.jsx)(da,{className:"ml-solo-floor",frame:t,label:"Juego en el suelo"}):null]})})}var Nn={ballSpeed:{key:"ball_speed",label:"Ball speed (tiles/s)",playerFacing:!0,description:"Base ball speed on Easy. Higher difficulties multiply this value.",type:"float",default:4.25,min:2,max:8,step:.25}},Dt={id:"arkanoid",label:"Arkanoid",description:"Single-player floor Arkanoid with step-controlled paddle movement and deterministic brick physics.",availability:{development:!0,production:!0},catalog:{category:"individual",color:"#ff9f45",durationLabel:"Sin l\xEDmite",modeLabel:"Arkanoid",audioLabel:"Efectos",rules:["Pisa la zona inferior para mover la pala","Rompe todos los bloques sin perder la pelota"]},players:{allowAny:!0,min:1,max:1},start:{mode:"player-ready"},config:{difficulty:{default:"medium",options:["easy","medium","hard","expert"]},vars:Object.values(Nn)},defaultDurationMillis:0,display:{entry:"./display"},preview:{seed:137,playerCount:1,difficulty:"medium",actions:[{atMillis:100,type:"press",x:7,y:30},{atMillis:2150,type:"release",x:7,y:30},{atMillis:2250,type:"press",x:9,y:30},{atMillis:2450,type:"release",x:9,y:30}],captureStartMillis:2200,frameCount:18,frameIntervalMillis:120},tags:["arcade","single-player","typescript"]};var Nc="#ffffff",Hc="#35d7ff",wc=["#ff3151","#ff8a2a","#ffd45f","#74e58d"],eb="#ff3151",tb="#03070c",lb="#06101d",ab="#145cff",ib="#37101a",nb="#ff3151",Ot="#74e58d",Cy=["#9ddfff","#4b91b8","#21445b"],ub=4,Gy=2,sb=3,pa=5,ql=29,Xl=24,Dc=3,rb=12;function Hn(e){return new Oc(e)}var Oc=class{ball={x:7,y:ql-1,dx:1,dy:-1};ballMoves=0;ballTrail=[];bricks=[];config;lastControlX=7;lastEvent=A("none","Listo",0);lastMoveMillis=0;lives=Dc;nowMillis=0;paddleX=Math.floor((S-pa)/2);phase="ready";players=[];rng;readyGate;score=0;startedAtMillis=0;constructor(t){this.config=Oe(t,Dt),this.rng=We(this.config.seed),this.readyGate=vt(Dt.start,[{minX:0,maxX:S-1,minY:Xl,maxY:z-1}],this.config.nowMillis),this.resetState(this.config.nowMillis)}init(t){return this.nowMillis=t,this.readyGate.reset(t),this.phase="waiting",this.attachBall(),this.lastEvent=A("ready","Esperando jugador abajo",t),[this.lastEvent]}press(t){return this.nowMillis=t.atMillis,t.y<Xl||t.y>=z?[]:(t.pressed&&this.movePaddle(t.x),this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update(t),t.atMillis):this.phase==="ready"&&t.pressed?this.launchBall(t.atMillis):[])}release(t){return this.nowMillis=t.atMillis,this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update({...t,pressed:!1}),t.atMillis):[]}tick(t){if(this.nowMillis=t.atMillis,this.phase==="waiting"||this.phase==="starting")return this.applyReadyTransition(this.readyGate.tick(t.atMillis),t.atMillis);if(this.phase!=="running")return[];let l=[],a=1e3/Ay(this.config);for(let i=0;i<rb&&!(t.atMillis-this.lastMoveMillis<a);i+=1){this.lastMoveMillis+=a;let n=this.moveBall(this.lastMoveMillis);if(n&&l.push(n),this.phase!=="running")break}return this.recordEvents(l)}render(){let t=dt(tb);Q(t,0,Xl,S,z-Xl,lb),Q(t,0,z-1,S,1,ib);for(let l of this.bricks)l.alive&&Q(t,l.x,l.y,l.width,1,l.color);return(this.phase==="waiting"||this.phase==="starting")&&this.drawPlayerStart(t),this.phase==="finished"&&this.score===this.bricks.length&&cb(t),this.ballTrail.forEach((l,a)=>{let i=Cy[a];i&&G(t,l.x,l.y,i)}),(this.phase!=="finished"||this.lives>0)&&G(t,this.ball.x,this.ball.y,Nc),Q(t,this.paddleX,ql,pa,1,this.phase==="finished"&&this.lives===0?nb:Hc),G(t,this.lastControlX,z-1,ab),t}snapshot(){let t=this.bricksRemaining(),l=this.readyGate.state(this.nowMillis);return{currentGame:Dt.id,label:Dt.label,phase:this.phase,playerCount:this.config.playerCount,players:this.players,score:this.score,lives:this.lives,maxLives:Dc,elapsedMillis:Math.max(0,this.nowMillis-this.startedAtMillis),remainingMillis:0,activeTargets:t,success:t===0,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?l.countdownMillis:0,readyPlayers:l.readyPlayers,requiredPlayers:l.requiredPlayers,matchTarget:this.bricks.length,ball:{...this.ball},ballMoves:this.ballMoves,ballSpeed:Ay(this.config),bricksRemaining:t,launched:this.phase==="running",paddleWidth:pa,paddleX:this.paddleX,totalBricks:this.bricks.length}}reset(t={}){this.config=Oe({...this.config,...t},Dt),this.rng=We(this.config.seed),this.resetState(this.config.nowMillis)}applyReadyTransition(t,l){return t==="players-ready"?(this.phase="starting",this.lastEvent=A("ready","Jugador listo",l),[this.lastEvent]):t==="players-left"?(this.phase="waiting",this.lastEvent=A("ready","Vuelve a la zona iluminada",l),[this.lastEvent]):t==="started"?this.launchBall(l):[]}launchBall(t){let l=this.phase==="waiting"||this.phase==="starting";return this.phase="running",l&&(this.startedAtMillis=t),this.ball={x:this.paddleCenter(),y:ql-1,dx:this.rng.next()<.5?-1:1,dy:-1},this.ballTrail=[],this.lastMoveMillis=t,this.lastEvent=A("start","Pelota en juego",t),[this.lastEvent]}attachBall(){this.ball={x:this.paddleCenter(),y:ql-1,dx:this.ball.dx,dy:-1},this.ballTrail=[]}brickAt(t,l){return this.bricks.find(a=>a.alive&&a.y===l&&t>=a.x&&t<a.x+a.width)}bricksRemaining(){return this.bricks.reduce((t,l)=>t+Number(l.alive),0)}commitBall(t){this.ballTrail=[{x:this.ball.x,y:this.ball.y},...this.ballTrail].slice(0,Cy.length),this.ball=t,this.ballMoves+=1}loseLife(t){return this.lives-=1,this.players=this.scoredPlayers(),this.ballTrail=[],this.lives<=0?(this.phase="finished",A("fail","Sin vidas",t)):(this.phase="ready",this.attachBall(),A("fail","Vida perdida, pisa abajo para lanzar",t))}moveBall(t){let l=this.ball.dx,a=this.ball.dy,i=this.ball.x+l,n=this.ball.y+a;(i<0||i>=S)&&(l=l===1?-1:1,i=this.ball.x+l),n<1&&(a=1,n=this.ball.y+a);let u=this.brickAt(i,n);if(u)return u.alive=!1,this.score+=1,this.players=this.scoredPlayers(),this.ball={...this.ball,dx:l,dy:a===1?-1:1},this.ballMoves+=1,this.bricksRemaining()===0?(this.phase="finished",A("win","Muro completado",t)):A("hit",`Bloque ${this.score} de ${this.bricks.length}`,t);if(a>0&&n===ql&&i>=this.paddleX&&i<this.paddleX+pa){let s=i-this.paddleCenter();return s<0?l=-1:s>0?l=1:l=this.rng.next()<.5?-1:1,Math.abs(s)===1&&this.rng.next()<.35&&(l=l===1?-1:1),this.commitBall({x:i,y:ql-1,dx:l,dy:-1}),A("coin","Rebote",t)}if(n>=z)return this.loseLife(t);this.commitBall({x:i,y:n,dx:l,dy:a})}movePaddle(t){let l=Math.floor(pa/2),a=k(Math.round(t),l,S-1-l);this.paddleX=a-l,this.lastControlX=k(Math.round(t),0,S-1),(this.phase==="ready"||this.phase==="waiting"||this.phase==="starting")&&this.attachBall()}drawPlayerStart(t){if(this.phase==="waiting"){let a=Xl+Math.floor(this.nowMillis/150)%(z-Xl);for(let i=Xl;i<z;i+=1)for(let n=0;n<S;n+=1)(i===a||n===0||n===S-1)&&G(t,n,i,i===a?"#35d7ff":"#0b4260");return}let l=Math.floor(this.nowMillis/125)%4;for(let a=0;a<z;a+=1)for(let i=0;i<S;i+=1)(Math.abs(i-this.paddleCenter())+Math.abs(a-ql)+l)%6===0&&G(t,i,a,a>=Xl?"#ffe176":"#176783")}paddleCenter(){return this.paddleX+Math.floor(pa/2)}recordEvents(t){let l=t.at(-1);return l&&(this.lastEvent=l),t}resetState(t){this.bricks=ob(),this.lives=Dc,this.nowMillis=t,this.startedAtMillis=t,this.lastMoveMillis=t,this.paddleX=Math.floor((S-pa)/2),this.lastControlX=this.paddleCenter(),this.readyGate.reset(t),this.phase="waiting",this.score=0,this.ballMoves=0,this.ball={x:this.paddleCenter(),y:ql-1,dx:1,dy:-1},this.ballTrail=[],this.players=this.scoredPlayers(),this.lastEvent=A("ready","Esperando jugador abajo",t)}scoredPlayers(){return vi(this.config.playerCount,this.config.players).map(t=>({...t,lives:this.lives,score:this.score}))}};function ob(){let e=[],t=0;for(let l=0;l<ub;l+=1)for(let a=0;a<S;a+=Gy)e.push({alive:!0,color:wc[l]??eb,id:t,width:Gy,x:a,y:sb+l}),t+=1;return e}function cb(e){Q(e,2,13,S-4,1,Ot),Q(e,2,19,S-4,1,Ot),Q(e,2,13,1,7,Ot),Q(e,S-3,13,1,7,Ot),G(e,5,16,Ot),G(e,6,17,Ot),G(e,7,18,Ot),G(e,8,17,Ot),G(e,9,16,Ot),G(e,10,15,Ot)}function Ay(e){return Rt(e.options,Nn.ballSpeed)*fb(e.difficulty)}function fb(e){switch(e){case"medium":return 1.25;case"hard":return 1.6;case"expert":return 2;default:return 1}}var bi=Hn({playerCount:1,difficulty:"medium"}),zy=bi.init(0);bi.press({x:7,y:30,pressed:!0,atMillis:100});bi.tick({atMillis:2100});bi.tick({atMillis:3300});var Ry=bi.render(),_y=bi.snapshot(),Ts=Hn({playerCount:1,difficulty:"easy"});Ts.init(0);db(Ts);var Dy=Ts.render(),Oy=Ts.snapshot();function db(e){e.press({x:7,y:30,pressed:!0,atMillis:50}),e.tick({atMillis:2050});let t=2100;for(let l=0;l<24e3&&e.snapshot().phase!=="finished";l+=1){let a=e.snapshot();e.press({x:a.ball.x,y:30,pressed:!0,atMillis:t}),e.tick({atMillis:t}),t+=50}}var Vc={};zi(Vc,{PlayerDisplay:()=>Ny,createGame:()=>jl,crowdedRunningFrame:()=>Vy,crowdedRunningSnapshot:()=>Qy,dueloConfigVars:()=>Mi,dueloPlayerPalette:()=>Nt,dueloReadyZones:()=>Gs,finishedFrame:()=>Ky,finishedSnapshot:()=>Fy,manifest:()=>Ie,runningFrame:()=>jy,runningSnapshot:()=>Zy,startingFrame:()=>qy,startingSnapshot:()=>Xy,waitingFrame:()=>Yy,waitingSnapshot:()=>Ly,winAnimationMillis:()=>Cs});var L=ue(Ge(),1);function Ny({snapshot:e}){let t=e.playerCount<=4?2:e.playerCount<=6?3:4,l=Math.max(1,Math.ceil(e.countdownMillis/1e3)),a=Math.max(1,Math.ceil(e.remainingMillis/1e3)),i=new Set(e.readyPlayerIndices),n=hb(e,l,a),u={"--duelo-grid-columns":t,"--duelo-player-count":e.playerCount,"--duelo-winner":e.winnerIndex>=0?e.playerProgress[e.winnerIndex]?.color??"#ffffff":"#ffffff","--duelo-winner-rgb":e.winnerIndex>=0?Hy(e.playerProgress[e.winnerIndex]?.color??"#ffffff"):"255, 255, 255"};return(0,L.jsx)(zt,{title:e.label,phase:e.phase,children:(0,L.jsxs)("div",{className:`duelo-display is-phase-${e.phase} is-player-count-${e.playerCount}`,style:u,children:[(0,L.jsxs)("section",{className:"duelo-hero","aria-label":n.title,children:[(0,L.jsxs)("div",{className:"duelo-hero-copy",children:[(0,L.jsx)("span",{children:n.eyebrow}),(0,L.jsx)("strong",{children:n.title}),(0,L.jsx)("b",{children:n.caption})]}),(0,L.jsxs)("div",{className:"duelo-hero-metrics",children:[(0,L.jsx)(Bc,{label:"Tiempo",value:bt(e.elapsedMillis)}),(0,L.jsx)(Bc,{label:"Restantes",value:e.remainingTargets}),(0,L.jsx)(Bc,{label:"Densidad",value:`${e.fillPercent}%`})]})]}),(0,L.jsx)("section",{className:"duelo-player-grid","aria-label":"Progreso de jugadores",children:e.playerProgress.map(s=>(0,L.jsx)(mb,{leader:e.leaderIndex===s.index,phase:e.phase,player:s,ready:i.has(s.index),recent:e.recentClaim?.playerIndex===s.index,winner:e.winnerIndex===s.index},s.index))}),(0,L.jsxs)("footer",{className:"duelo-event-rail",children:[(0,L.jsx)("span",{children:e.phase==="waiting"?"Preparaci\xF3n":e.phase==="finished"?"Resultado":"\xDAltimo evento"}),(0,L.jsx)("strong",{children:e.lastEventMessage||"Listo"},e.motionEventId),(0,L.jsx)("b",{children:e.phase==="finished"?`Nueva partida en ${a}`:`${e.claimedTargets}/${e.totalTargets} reclamadas`})]})]})})}function mb({leader:e,phase:t,player:l,ready:a,recent:i,winner:n}){let u=t==="waiting"?a?"Listo":"Entra en tu zona":t==="starting"?"Preparado":n?"Ganador":e?"L\xEDder":"En carrera",s={"--duelo-player":l.color,"--duelo-player-rgb":Hy(l.color),"--duelo-progress":l.progress},r=l.label.length>28?" is-extra-long":l.label.length>18?" is-long":"";return(0,L.jsxs)("article",{className:["duelo-player-card",a?"is-ready":"",e?"is-leader":"",i?"is-recent":"",n?"is-winner":""].filter(Boolean).join(" "),style:s,children:[(0,L.jsxs)("header",{children:[(0,L.jsx)("i",{"aria-hidden":"true"}),(0,L.jsx)("span",{className:`duelo-player-name${r}`,children:l.label}),(0,L.jsx)("b",{children:u})]}),(0,L.jsxs)("div",{className:"duelo-player-score",children:[(0,L.jsx)("strong",{children:l.remaining}),(0,L.jsx)("span",{children:"baldosas restantes"}),i?(0,L.jsx)("em",{children:"+1"},`${l.index}-${l.claimed}`):null]}),(0,L.jsx)("div",{className:"duelo-player-track","aria-hidden":"true",children:(0,L.jsx)("i",{})}),(0,L.jsxs)("footer",{children:[(0,L.jsx)("span",{children:"Reclamadas"}),(0,L.jsxs)("strong",{children:[l.claimed,"/",l.target]})]})]})}function Bc({label:e,value:t}){return(0,L.jsxs)("article",{className:"duelo-hero-metric",children:[(0,L.jsx)("span",{children:e}),(0,L.jsx)("strong",{children:t})]})}function hb(e,t,l){return e.phase==="waiting"?{eyebrow:`Listos ${e.readyPlayers}/${e.requiredPlayers}`,title:"Busca tu color",caption:"Cada jugador entra y permanece en su zona iluminada"}:e.phase==="starting"?{eyebrow:"Todos listos",title:String(t),caption:"El duelo est\xE1 a punto de empezar"}:e.phase==="finished"?{eyebrow:"Victoria",title:`\xA1Gana ${e.winnerLabel}!`,caption:`Nueva partida en ${l}`}:{eyebrow:e.leaderIndex>=0?`Lidera ${e.leaderLabel}`:"Empate",title:"Reclama tu color",caption:"Pisa todas tus baldosas antes que los dem\xE1s"}}function Hy(e){return/^#[0-9a-f]{6}$/i.test(e)?[1,3,5].map(t=>Number.parseInt(e.slice(t,t+2),16)).join(", "):"255, 255, 255"}var Mi={baseFillPercent:{key:"base_fill_percent",label:"Base floor coverage (%)",playerFacing:!1,description:"The percentage of floor tiles assigned as targets on Medium difficulty.",type:"int",default:60,min:30,max:75,step:5},hardFillMultiplier:{key:"hard_fill_multiplier",label:"Hard coverage multiplier",playerFacing:!1,description:"Hard difficulty multiplies the base floor coverage by this value, capped at the full floor.",type:"float",default:1.5,min:1,max:1.8,step:.05}},Ie={id:"duelo",label:"Duelo",description:"A fast 2\u20138 player race to claim every tile of your color before anyone else.",availability:{development:!0,production:!0},catalog:{category:"versus",color:"#ff5268",durationLabel:"Sin l\xEDmite",modeLabel:"Carrera de colores",audioLabel:"M\xFAsica + efectos",rules:["Cada jugador ocupa la zona de inicio de su color","Pisa todas las baldosas de tu color antes que los dem\xE1s"]},players:{allowAny:!1,min:2,max:8},start:{mode:"player-ready",countdownMillis:3e3,releaseGraceMillis:1e3},config:{difficulty:{default:"medium",options:["medium","hard"]},vars:Object.values(Mi)},defaultDurationMillis:0,display:{entry:"./display"},preview:{seed:137,playerCount:4,difficulty:"medium",actions:[{atMillis:100,type:"press",x:1,y:1},{atMillis:100,type:"press",x:14,y:30},{atMillis:100,type:"press",x:1,y:30},{atMillis:100,type:"press",x:14,y:1}],captureStartMillis:3200,frameCount:18,frameIntervalMillis:120},tags:["competitive","multiplayer","color-race","typescript"]};var Si=4,pb=18,wy=420,Yc=700,Cs=5e3,yb="#03060b",qc={r:255,g:255,b:255},Nt=["#ff3048","#24d9ff","#42e879","#ff4fd8","#376bff","#ffd84d","#a66cff","#ff8a3d"];function jl(e){return new Lc(e)}function Gs(e){let t=k(Math.round(e),Ie.players.min,Ie.players.max),l=S-Si,a=z-Si,i=Math.floor((S-Si)/2),n=Math.floor((z-Si)/2);return(t===2?[[0,n],[l,n]]:t===3?[[0,0],[l,0],[i,a]]:[[0,0],[l,a],[0,a],[l,0],[0,n],[l,n],[i,0],[i,a]].slice(0,t)).map(([s=0,r=0])=>({minX:s,maxX:s+Si-1,minY:r,maxY:r+Si-1}))}var Lc=class{claimed=new Uint8Array(gt);claimedAt=new Float64Array(gt);claims=[];config;fillPercent=60;finishAtMillis=0;lastEvent=A("none","Listo",0);motionEventId=0;nowMillis=0;owners=new Int16Array(gt).fill(-1);phase="waiting";players=[];readyGate;readyZones=[];recentClaim=null;rng;startedAtMillis=0;targets=[];winnerIndex=-1;constructor(t){this.config=Oe(t,Ie),this.rng=We(this.config.seed),this.readyZones=Gs(this.config.playerCount),this.readyGate=vt(Ie.start,this.readyZones,this.config.nowMillis),this.resetGame(this.config.nowMillis)}init(t){return this.resetGame(t),this.lastEvent=A("ready",this.waitingMessage(),t),[this.lastEvent]}press(t){if(this.nowMillis=t.atMillis,this.phase==="waiting"||this.phase==="starting")return this.recordEvents(this.applyReadyTransition(this.readyGate.update(t),t.atMillis));if(this.phase!=="running"||!t.pressed||!ma(t.x,t.y))return[];let l=this.claimTile(t.x,t.y,t.atMillis);return this.recordEvents(l?[l]:[])}release(t){return this.nowMillis=t.atMillis,this.phase==="waiting"||this.phase==="starting"?this.recordEvents(this.applyReadyTransition(this.readyGate.update({...t,pressed:!1}),t.atMillis)):[]}tick(t){return this.nowMillis=t.atMillis,this.phase==="waiting"||this.phase==="starting"?this.recordEvents(this.applyReadyTransition(this.readyGate.tick(t.atMillis),t.atMillis)):this.phase==="finished"&&t.atMillis-this.finishAtMillis>=Cs?(this.resetGame(t.atMillis),this.recordEvents([A("ready","Nuevo duelo",t.atMillis)])):[]}render(){let t=dt(yb);return this.phase==="waiting"?this.drawWaiting(t):this.phase==="starting"?this.drawStarting(t):this.phase==="running"?this.drawBoard(t):this.drawVictory(t),t}snapshot(){let t=this.readyGate.state(this.nowMillis),l=this.playerProgress(),a=l.reduce((f,y)=>!f||y.progress>f.progress||y.progress===f.progress&&y.index<f.index?y:f,void 0),i=a&&l.filter(f=>f.progress===a.progress).length===1?a:void 0,n=this.claims.reduce((f,y)=>f+y,0),u=this.targets.reduce((f,y)=>f+y,0),s=this.players[this.winnerIndex],r=this.phase==="finished"?this.finishAtMillis:this.nowMillis,c=this.recentClaim?this.nowMillis-this.recentClaim.atMillis:Number.POSITIVE_INFINITY;return{currentGame:Ie.id,label:Ie.label,phase:this.phase,playerCount:this.config.playerCount,players:this.players.map((f,y)=>({...f,score:this.claims[y]??0})),score:Math.max(0,...this.claims),lives:-1,elapsedMillis:this.phase==="waiting"||this.phase==="starting"?0:Math.max(0,r-this.startedAtMillis),remainingMillis:this.phase==="finished"?Math.max(0,this.finishAtMillis+Cs-this.nowMillis):0,activeTargets:u-n,success:this.winnerIndex>=0,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?t.countdownMillis:0,readyPlayers:t.readyPlayers,requiredPlayers:t.requiredPlayers,matchTarget:Math.max(0,...this.targets),claimedTargets:n,fillPercent:this.fillPercent,leaderIndex:i?.index??-1,leaderLabel:i?.label??"-",motionEventId:this.motionEventId,playerProgress:l,readyPlayerIndices:this.players.filter((f,y)=>this.readyGate.zoneReady(y,this.nowMillis)).map(f=>f.index),recentClaim:this.recentClaim&&c<Yc?{playerIndex:this.recentClaim.playerIndex,remainingMillis:Yc-c,x:this.recentClaim.x,y:this.recentClaim.y}:null,remainingTargets:u-n,totalTargets:u,winnerIndex:this.winnerIndex,winnerLabel:s?.label??""}}reset(t={}){this.config=Oe({...this.config,...t},Ie),this.readyZones=Gs(this.config.playerCount),this.readyGate=vt(Ie.start,this.readyZones,this.config.nowMillis),this.resetGame(this.config.nowMillis),this.lastEvent=A("ready",this.waitingMessage(),this.config.nowMillis)}playerReadyZones(){return this.readyZones.map(t=>({...t}))}targetOwner(t,l){return ma(t,l)?this.owners[l*S+t]??-1:-1}resetGame(t){this.nowMillis=t,this.startedAtMillis=t,this.finishAtMillis=0,this.phase="waiting",this.winnerIndex=-1,this.motionEventId=1,this.recentClaim=null,this.claimed.fill(0),this.claimedAt.fill(0),this.readyGate.reset(t),this.players=this.createPlayers(),this.fillPercent=this.readFillPercent(),this.rng=We(this.config.seed);let l=gb(this.config.playerCount,this.fillPercent,this.rng);this.owners=l.owners,this.targets=l.targets,this.claims=Array.from({length:this.config.playerCount},()=>0),this.lastEvent=A("ready",this.waitingMessage(),t)}createPlayers(){return Array.from({length:this.config.playerCount},(t,l)=>{let a=this.config.players[l],i=Nt[l]??Nt[0],n=a?.color,u=n&&/^#[0-9a-f]{6}$/i.test(n)?n:i,s=String(a?.label||a?.name||`Jugador ${l+1}`).trim();return{index:l,label:s||`Jugador ${l+1}`,color:u,score:0,lives:-1}})}readFillPercent(){let t=Rt(this.config.options,Mi.baseFillPercent);if(this.config.difficulty!=="hard")return Math.round(t);let l=Rt(this.config.options,Mi.hardFillMultiplier);return Math.round(k(t*l,1,100))}applyReadyTransition(t,l){return t==="players-ready"?(this.phase="starting",this.motionEventId+=1,[A("start","Todos en posici\xF3n",l)]):t==="players-left"?(this.phase="waiting",this.motionEventId+=1,[A("ready","Vuelve a tu zona iluminada",l)]):t==="started"?(this.phase="running",this.startedAtMillis=l,this.motionEventId+=1,[A("start","Reclama todas las baldosas de tu color",l)]):[]}claimTile(t,l,a){let i=l*S+t,n=this.owners[i]??-1;if(n<0||n>=this.players.length||this.claimed[i]===1)return;this.claimed[i]=1,this.claimedAt[i]=a,this.claims[n]=(this.claims[n]??0)+1,this.recentClaim={atMillis:a,playerIndex:n,x:t,y:l},this.motionEventId+=1;let u=Math.max(0,(this.targets[n]??0)-(this.claims[n]??0)),s=this.players[n]?.label??`Jugador ${n+1}`;return u===0?(this.phase="finished",this.finishAtMillis=a,this.winnerIndex=n,A("win",`${s} gana el duelo`,a)):A("coin",`${s}: ${u} por reclamar`,a)}recordEvents(t){let l=t.at(-1);return l&&(this.lastEvent=l),t}waitingMessage(){return`Duelo espera a ${this.config.playerCount} jugadores`}playerProgress(){return this.players.map((t,l)=>{let a=this.targets[l]??0,i=this.claims[l]??0;return{claimed:i,color:t.color,index:l,label:t.label,progress:a>0?i/a:0,remaining:Math.max(0,a-i),target:a}})}drawWaiting(t){let l=.5+.5*Math.sin(this.nowMillis/310);this.readyZones.forEach((a,i)=>{let n=this.readyGate.zoneReady(i,this.nowMillis);this.drawReadyZone(t,a,this.players[i]?.color??Nt[0],n,l)}),gi(t,{color:"#13263a",radius:2+Math.floor(this.nowMillis/180)%20,thickness:.35})}drawStarting(t){let l=Math.floor(this.nowMillis/110);Ll(t,{bandWidth:2,period:8,step:l,color:({distance:a})=>{let i=this.players[Math.floor(a)%this.players.length];return wn(i?.color??Nt[0],58)}}),this.readyZones.forEach((a,i)=>{this.drawReadyZone(t,a,this.players[i]?.color??Nt[0],!0,1)})}drawReadyZone(t,l,a,i,n){for(let u=l.minY;u<=l.maxY;u+=1)for(let s=l.minX;s<=l.maxX;s+=1){let r=s===l.minX||s===l.maxX||u===l.minY||u===l.maxY,c=i?r?100:78:r?26+n*24:12+n*12;G(t,s,u,wn(a,c))}}drawBoard(t){let l=this.playerProgress();for(let a=0;a<gt;a+=1){let i=this.owners[a]??-1;if(i<0)continue;let n=a%S,u=Math.floor(a/S),s=this.players[i]?.color??Nt[0];if(this.claimed[a]===1){let f=this.nowMillis-(this.claimedAt[a]??0);if(f<wy){let y=1-f/wy;G(t,n,u,Sb(s,35+y*65))}else G(t,n,u,wn(s,12));continue}let r=(l[i]?.progress??0)>=.88?16:0,c=.5+.5*Math.sin(this.nowMillis/360+n*.74+u*.18+i);G(t,n,u,wn(s,58+r+c*24))}if(this.recentClaim&&this.nowMillis-this.recentClaim.atMillis<Yc){let a=this.players[this.recentClaim.playerIndex]?.color??Nt[0],i=1+Math.floor((this.nowMillis-this.recentClaim.atMillis)/160);gi(t,{centerX:this.recentClaim.x,centerY:this.recentClaim.y,color:wn(a,44),radius:i,thickness:.25})}}drawVictory(t){let l=this.players[this.winnerIndex]?.color??Nt[0],a=Xc(l),i=Math.max(0,this.nowMillis-this.finishAtMillis);for(let n=0;n<z;n+=1)for(let u=0;u<S;u+=1){let s=.5+.5*Math.sin(i/170+u*.58+n*.19),r=On(_t(a,48+s*42),_t(qc,s*16));G(t,u,n,ha(r))}Ll(t,{bandWidth:2,period:9,step:Math.floor(i/90),color:"#ffffff"})}};function gb(e,t,l){let a=Math.round(gt*t/100),i=Math.max(1,Math.floor(a/e)),n=Array.from({length:e},()=>i),u=new Int16Array(gt).fill(-1),s=Number.POSITIVE_INFINITY;for(let r=0;r<pb;r+=1){let c=vb(n,l),f=bb(c);f<s&&(s=f,u=c)}return{owners:u,targets:n}}function vb(e,t){let l=new Int16Array(gt).fill(-1),a=Array.from({length:e.length},()=>0),i=Array.from({length:gt},(n,u)=>u);for(let n=i.length-1;n>0;n-=1){let u=t.int(n+1);[i[n],i[u]]=[i[u]??0,i[n]??0]}for(let n of i){let u=n%S,s=Math.floor(n/S),r=-1,c=Number.POSITIVE_INFINITY;for(let f=0;f<e.length;f+=1){let y=e[f]??0;if((a[f]??0)>=y)continue;let m=Uy(l,u,s,f),p=Mb(l,u,s,f),M=By(m)+p*.12+(a[f]??0)/Math.max(y,1)*.2+t.next()*1.35;M<c&&(c=M,r=f)}r>=0&&(l[n]=r,a[r]=(a[r]??0)+1)}return l}function bb(e){let t=0;for(let l=0;l<z;l+=1){let a=-2,i=0;for(let n=0;n<S;n+=1){let u=e[l*S+n]??-1;if(u>=0){let s=Uy(e,n,l,u);t+=By(s)+(s>=3?6:0)}u===a&&u>=0?i+=1:(a=u,i=1),a>=0&&i>5&&(t+=(i-5)*7)}}for(let l=0;l<S;l+=1){let a=-2,i=0;for(let n=0;n<z;n+=1){let u=e[n*S+l]??-1;u===a&&u>=0?i+=1:(a=u,i=1),a>=0&&i>5&&(t+=(i-5)*7)}}return t}function Uy(e,t,l,a){return[[t-1,l],[t+1,l],[t,l-1],[t,l+1]].filter(([i=-1,n=-1])=>ma(i,n)&&e[n*S+i]===a).length}function Mb(e,t,l,a){return[[t-1,l-1],[t+1,l-1],[t-1,l+1],[t+1,l+1]].filter(([i=-1,n=-1])=>ma(i,n)&&e[n*S+i]===a).length}function By(e){return e===0?.85:e===1?0:e===2?.45:4.5}function Xc(e){return/^#[0-9a-f]{6}$/i.test(e)?{r:Number.parseInt(e.slice(1,3),16),g:Number.parseInt(e.slice(3,5),16),b:Number.parseInt(e.slice(5,7),16)}:qc}function wn(e,t){return ha(_t(Xc(e),t))}function Sb(e,t){let l=k(t,0,100);return ha(On(_t(Xc(e),100-l),_t(qc,l)))}var As=[{name:"Rojo",color:"#ff3048"},{name:"Cian",color:"#24d9ff"}],jc=jl({playerCount:2,players:As,seed:137,difficulty:"medium"});jc.init(0);var Yy=jc.render(),Ly=jc.snapshot(),Un=jl({playerCount:2,players:As,seed:137,difficulty:"hard"});Un.init(0);Jy(Un,100);Un.tick({atMillis:1100});var qy=Un.render(),Xy=Un.snapshot(),ya=jl({playerCount:2,players:As,seed:137,difficulty:"hard"});ya.init(0);Zc(ya);zs(ya,0,8,3200);zs(ya,1,5,3400);ya.tick({atMillis:18700});var jy=ya.render(),Zy=ya.snapshot(),Eb=[{name:"Alejandra del Equipo Rel\xE1mpago",color:"#ff3048"},{name:"Bruno",color:"#24d9ff"},{name:"Carolina",color:"#42e879"},{name:"Diego",color:"#ff4fd8"},{name:"Elena",color:"#376bff"},{name:"Fernando",color:"#ffd84d"},{name:"Gabriela",color:"#a66cff"},{name:"Hugo",color:"#ff8a3d"}],Ei=jl({playerCount:8,players:Eb,seed:2026,difficulty:"medium"});Ei.init(0);Zc(Ei);for(let e=0;e<8;e+=1)zs(Ei,e,e+1,3200+e*50);Ei.tick({atMillis:48230});var Vy=Ei.render(),Qy=Ei.snapshot(),xi=jl({playerCount:2,players:As,seed:137,difficulty:"medium",options:{base_fill_percent:30}});xi.init(0);Zc(xi);zs(xi,1,Number.POSITIVE_INFINITY,3200);xi.tick({atMillis:4200});var Ky=xi.render(),Fy=xi.snapshot();function Jy(e,t){e.playerReadyZones().forEach(l=>{e.press({x:l.minX,y:l.minY,pressed:!0,atMillis:t})})}function Zc(e){Jy(e,100),e.tick({atMillis:3100})}function zs(e,t,l,a){let i=0;for(let n=0;n<32&&i<l;n+=1)for(let u=0;u<16&&i<l;u+=1)e.targetOwner(u,n)===t&&(e.press({x:u,y:n,pressed:!0,atMillis:a+i}),i+=1)}var Wc={};zi(Wc,{PlayerDisplay:()=>Py,createGame:()=>Ci,damagedFrame:()=>u0,damagedSnapshot:()=>s0,hazardColor:()=>Rs,helloWorldCelebrationMillis:()=>Ln,helloWorldHazards:()=>qn,helloWorldStartingLives:()=>Yn,helloWorldTargetScore:()=>Ti,helloWorldTargets:()=>_s,idleColor:()=>Jc,initEvents:()=>Wy,losingFrame:()=>c0,losingSnapshot:()=>f0,manifest:()=>Ht,runningFrame:()=>a0,runningSnapshot:()=>i0,startingFrame:()=>e0,startingSnapshot:()=>t0,targetColor:()=>Bn,trailColor:()=>Fc,waitingFrame:()=>$y,waitingSnapshot:()=>Iy,winningFrame:()=>r0,winningSnapshot:()=>o0});var ze=ue(Ge(),1);function Py({snapshot:e,frame:t}){let l=e.matchTarget??5,a=e.phase==="finished",i=a?e.success?"is-result-win":"is-result-lose":"",n=e.success?"green":e.lastEventCue==="fail"?"red":"cyan",u=Math.max(1,Math.ceil(e.celebrationMillis/1e3)),s=a?(0,ze.jsxs)("span",{className:"hello-world-result-copy",children:[(0,ze.jsx)("span",{children:e.success?"\xA1Ganaste!":e.lastEventMessage}),(0,ze.jsxs)("small",{children:["Reinicio en ",u]})]}):e.lastEventMessage||"Verde suma, rojo resta una vida";return(0,ze.jsx)(zt,{title:e.label,phase:e.phase,children:(0,ze.jsxs)("div",{className:`ml-solo-display hello-world-display ${i}`.trim(),children:[(0,ze.jsx)(pi,{snapshot:e}),(0,ze.jsxs)("div",{className:"ml-solo-summary",children:[(0,ze.jsxs)(Yl,{columns:3,className:"ml-solo-number-row",children:[(0,ze.jsx)(me,{label:"Meta",tone:"green",value:`${e.score}/${l}`}),(0,ze.jsx)(me,{label:"Vidas",tone:"red",value:(0,ze.jsx)(yi,{lives:e.lives,maxLives:e.maxLives})}),(0,ze.jsx)(me,{label:"Tiempo",tone:"yellow",value:bt(e.remainingMillis)})]}),(0,ze.jsx)(me,{className:"ml-solo-message",label:a?e.success?"Victoria":"Fin de la partida":"Estado",tone:n,value:s})]}),t?(0,ze.jsx)(da,{className:"ml-solo-floor",frame:t,label:"Recorrido en el suelo"}):null]})})}var Ht={id:"hello-world",label:"Hola Mundo",description:"Sigue los objetivos verdes y evita las baldosas rojas.",availability:{development:!0,production:!1},catalog:{category:"individual",color:"#35d7ff",durationLabel:"30s",modeLabel:"Demostraci\xF3n",audioLabel:"Efectos",rules:["Sigue los objetivos verdes","Evita las baldosas rojas"]},players:{allowAny:!0,min:1,max:1},start:{mode:"player-ready"},defaultDurationMillis:3e4,display:{entry:"./display"},preview:{seed:2024,playerCount:1,actions:[{atMillis:100,type:"press",x:8,y:16},{atMillis:2150,type:"release",x:8,y:16},{atMillis:2300,type:"press",x:4,y:4},{atMillis:2320,type:"release",x:4,y:4}],captureStartMillis:2200,frameCount:18,frameIntervalMillis:120},tags:["example","ci","typescript"]};var Bn="#7ee787",Rs="#ff2036",Fc="#1f6feb",Jc="#05070a",Ti=5,Yn=3,Ln=5e3,Qc=[{x:3,y:5},{x:12,y:5},{x:8,y:16},{x:3,y:26},{x:12,y:26}],ky=[{x:12,y:15},{x:4,y:15},{x:8,y:28}];function Ci(e){return new Kc(e)}var Kc=class{config;finishedAtMillis;hazardsHit=0;lastEvent=A("none","Listo",0);lives=Yn;nowMillis=0;phase="ready";players;readyGate;score=0;startedAtMillis=0;constructor(t){this.config=Oe(t,Ht),this.readyGate=vt(Ht.start,xs(1),this.config.nowMillis),this.players=this.scoredPlayers()}init(t){return this.resetState(t),[this.lastEvent]}press(t){if(this.nowMillis=t.atMillis,this.phase==="waiting"||this.phase==="starting")return this.applyReadyTransition(this.readyGate.update(t),t.atMillis);if(this.phase!=="running"||!t.pressed)return[];let l=this.currentHazard();if(l&&t.x===l.x&&t.y===l.y)return this.loseLife(t.atMillis);let a=this.currentTarget();return!a||t.x!==a.x||t.y!==a.y?[]:(this.score+=1,this.players=this.scoredPlayers(),this.score>=Ti?this.finishGame(!0,"\xA1Hola Mundo!",t.atMillis):(this.lastEvent=A("hit",`Hola ${this.score}`,t.atMillis),[this.lastEvent]))}release(t){return this.nowMillis=t.atMillis,this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update({...t,pressed:!1}),t.atMillis):[]}tick(t){if(this.nowMillis=t.atMillis,this.phase==="waiting"||this.phase==="starting")return this.applyReadyTransition(this.readyGate.tick(t.atMillis),t.atMillis);if(this.phase==="finished"){let l=this.finishedAtMillis??t.atMillis;return t.atMillis-l<Ln?[]:(this.resetState(t.atMillis),[this.lastEvent])}return this.phase!=="running"||this.remainingMillis()>0?[]:this.finishGame(!1,"Tiempo agotado",t.atMillis)}render(){let t=dt(Jc);if(this.phase==="waiting"||this.phase==="starting")return this.drawPlayerStart(t),t;for(let i of Qc.slice(0,this.score))G(t,i.x,i.y,Fc);if(this.phase==="finished")return this.drawResultAnimation(t),t;let l=this.currentTarget();l&&(Q(t,l.x-1,l.y-1,3,3,Bn),G(t,l.x,l.y,"#ffffff"));let a=this.currentHazard();return a&&G(t,a.x,a.y,Rs),t}snapshot(){let t=this.readyGate.state(this.nowMillis);return{currentGame:Ht.id,label:Ht.label,phase:this.phase,playerCount:this.config.playerCount,players:this.players,score:this.score,lives:this.lives,maxLives:Yn,elapsedMillis:this.elapsedMillis(),remainingMillis:this.remainingMillis(),activeTargets:this.phase==="running"?+!!this.currentTarget()+ +!!this.currentHazard():0,success:this.phase==="finished"&&this.score>=Ti,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?t.countdownMillis:0,readyPlayers:t.readyPlayers,requiredPlayers:t.requiredPlayers,matchTarget:Ti,celebrationDurationMillis:Ln,celebrationMillis:this.celebrationMillis(),hazard:this.phase==="running"?this.currentHazard():void 0}}reset(t={}){this.config=Oe({...this.config,...t},Ht),this.resetState(this.config.nowMillis)}applyReadyTransition(t,l){return t==="players-ready"?(this.phase="starting",this.lastEvent=A("ready","Jugador listo",l),[this.lastEvent]):t==="players-left"?(this.phase="waiting",this.lastEvent=A("ready","Vuelve a la zona iluminada",l),[this.lastEvent]):t==="started"?(this.phase="running",this.startedAtMillis=l,this.lastEvent=A("start","Verde suma, rojo resta una vida",l),[this.lastEvent]):[]}celebrationMillis(){return this.phase!=="finished"||this.finishedAtMillis===void 0?0:Math.max(0,Ln-(this.nowMillis-this.finishedAtMillis))}currentHazard(){return ky[this.hazardsHit]}currentTarget(){return Qc[this.score]}drawPlayerStart(t){let l=Math.floor(S/2),a=Math.floor(z/2),i=Math.floor(this.nowMillis/(this.phase==="starting"?110:180)),n=this.phase==="starting"?"#ffe176":Bn,u=this.phase==="starting"?2+i%10:3+i%4;gi(t,{centerX:l,centerY:a,color:n,radius:u})}drawResultAnimation(t){let l=Math.floor((this.nowMillis-(this.finishedAtMillis??this.nowMillis))/140);if(this.score>=Ti){Ll(t,{color:({x:i,y:n})=>(i+n+l)%3===0?"#ffffff":Bn,step:l});return}for(let i=0;i<z;i+=1)for(let n=0;n<S;n+=1)((n+i+l)%8<=1||(n-i-l+64)%11===0)&&G(t,n,i,(n+l)%4===0?"#ff8090":Rs)}elapsedMillis(){if(this.phase==="waiting"||this.phase==="starting")return 0;let t=this.phase==="finished"&&this.finishedAtMillis!==void 0?this.finishedAtMillis:this.nowMillis;return Math.max(0,t-this.startedAtMillis)}finishGame(t,l,a){return this.phase="finished",this.finishedAtMillis=a,this.lastEvent=A(t?"win":"fail",l,a),[this.lastEvent]}loseLife(t){return this.lives-=1,this.hazardsHit+=1,this.lives<=0?this.finishGame(!1,"Sin vidas",t):(this.lastEvent=A("fail",`Vida perdida, quedan ${this.lives}`,t),[this.lastEvent])}remainingMillis(){return Math.max(0,this.config.durationMillis-this.elapsedMillis())}resetState(t){this.readyGate.reset(t),this.finishedAtMillis=void 0,this.hazardsHit=0,this.lastEvent=A("ready","Esperando jugador",t),this.lives=Yn,this.nowMillis=t,this.phase="waiting",this.score=0,this.startedAtMillis=t,this.players=this.scoredPlayers()}scoredPlayers(){return vi(this.config.playerCount,this.config.players).map(t=>({...t,score:this.score}))}};function qn(){return ky.map(e=>({...e}))}function _s(){return Qc.map(e=>({...e}))}var Pc=Ci({seed:2024,playerCount:1,durationMillis:3e4}),Wy=Pc.init(0),$y=Pc.render(),Iy=Pc.snapshot(),Xn=Ci({seed:2024,playerCount:1,durationMillis:3e4});Xn.init(0);Xn.press({x:8,y:16,pressed:!0,atMillis:100});Xn.tick({atMillis:1100});var e0=Xn.render(),t0=Xn.snapshot(),l0=Ns(),a0=l0.render(),i0=l0.snapshot(),kc=Ns(),n0=qn()[0];if(!n0)throw new Error("Hola Mundo requires at least one hazard fixture.");kc.press({...n0,pressed:!0,atMillis:2200});var u0=kc.render(),s0=kc.snapshot(),Ds=Ns();_s().forEach((e,t)=>{Ds.press({...e,pressed:!0,atMillis:2200+t*100})});Ds.tick({atMillis:4100});var r0=Ds.render(),o0=Ds.snapshot(),Os=Ns();qn().forEach((e,t)=>{Os.press({...e,pressed:!0,atMillis:2200+t*100})});Os.tick({atMillis:4100});var c0=Os.render(),f0=Os.snapshot();function Ns(){let e=Ci({seed:2024,playerCount:1,durationMillis:3e4});return e.init(0),e.press({x:8,y:16,pressed:!0,atMillis:100}),e.tick({atMillis:2100}),e}var rf={};zi(rf,{PlayerDisplay:()=>d0,createGame:()=>va,damagedFrame:()=>M0,damagedSnapshot:()=>S0,failedFrame:()=>T0,failedSnapshot:()=>C0,finishedFrame:()=>E0,finishedSnapshot:()=>x0,gameWinAnimationMillis:()=>Hs,initEvents:()=>g0,manifest:()=>wt,meteorCoreColor:()=>nf,meteorDifficultyProfile:()=>p0,meteorImpactColor:()=>ws,meteorImpactVisibleMillis:()=>lf,meteorWarningColor:()=>af,playerFootprintColor:()=>uf,runningFrame:()=>v0,runningSnapshot:()=>b0,startingLives:()=>jn});var et=ue(Ge(),1);function d0({snapshot:e,frame:t}){let l=e.phase==="finished"?e.success?"\xA1Tormenta superada!":"La tormenta te alcanz\xF3":e.lastEventMessage||"Esquiva las zonas rojas",a=e.success?"green":e.lives===0?"red":"cyan";return(0,et.jsx)(zt,{title:e.label,phase:e.phase,children:(0,et.jsxs)("div",{className:"ml-solo-display meteor-dodge-display",children:[(0,et.jsx)(pi,{snapshot:e}),(0,et.jsxs)("div",{className:"ml-solo-summary",children:[(0,et.jsxs)(Yl,{columns:3,className:"ml-solo-number-row",children:[(0,et.jsx)(me,{label:"Esquivados",tone:"cyan",value:e.dodgedMeteors}),(0,et.jsx)(me,{label:"Vidas",tone:"neutral",value:(0,et.jsx)(yi,{lives:e.lives,maxLives:e.maxLives})}),(0,et.jsx)(me,{label:"Tiempo",tone:"yellow",value:bt(e.remainingMillis)})]}),(0,et.jsx)(me,{className:"ml-solo-message",label:"Estado",tone:a,value:l})]}),t?(0,et.jsx)(da,{className:"ml-solo-floor",frame:t,label:"Tormenta en el suelo"}):null]})})}var wt={id:"meteor-dodge",label:"Lluvia de meteoritos",description:"Cooperative survival game: dodge telegraphed meteor impacts until the storm passes.",availability:{development:!0,production:!1},catalog:{category:"team",color:"#b987ff",durationLabel:"45s",modeLabel:"Supervivencia",audioLabel:"Efectos",rules:["Esquiva las zonas marcadas","Sobrevive hasta que termine la tormenta"]},players:{allowAny:!0,min:1,max:1},start:{mode:"player-ready",releaseGraceMillis:750},config:{difficulty:{default:"medium",options:["easy","medium","hard","expert"]}},defaultDurationMillis:45e3,display:{entry:"./display"},preview:{seed:137,playerCount:1,difficulty:"medium",actions:[{atMillis:100,type:"press",x:8,y:16},{atMillis:2150,type:"release",x:8,y:16}],captureStartMillis:2200,frameCount:18,frameIntervalMillis:120},tags:["arcade","cooperative","survival","typescript"]};var jn=3,Hs=3e3,lf=450,af="#ff5a36",nf="#ffe176",ws="#ffffff",uf="#35d7ff",$c="#02050b",xb="#050d19",Tb="#145cff",Cb="#35d7ff",Gb="#ffe176",Ic=["#35d7ff","#5fff9e","#ffe176","#ff3bd7","#ffffff"],ef=["#ff3151","#7b1428","#2a0710"],Ab=1e3,zb=350,Rb=64,ga={minX:4,maxX:11,minY:12,maxY:19},sf={intervalMillis:1550,largeMeteorEvery:5,radius:1,warningMillis:1350},h0={easy:{intervalMillis:1900,largeMeteorEvery:0,radius:1,warningMillis:1650},medium:sf,hard:{intervalMillis:1200,largeMeteorEvery:3,radius:1,warningMillis:1050},expert:{intervalMillis:900,largeMeteorEvery:1,radius:2,warningMillis:800}};function va(e){return new tf(e)}var tf=class{config;dodgedMeteors=0;finishedAtMillis=0;lastDamageMillis=Number.NEGATIVE_INFINITY;lastEvent=A("none","Listos para la tormenta",0);lives=jn;meteors=[];nextMeteorId=1;nextMeteorMillis=0;nowMillis=0;occupiedTiles=new Set;phase="ready";players=[];readyGate;rng;startedAtMillis=0;success=!1;constructor(t){this.config=Oe(t,wt),this.rng=We(this.config.seed),this.readyGate=vt(wt.start,[ga],this.config.nowMillis),this.resetState(this.config.nowMillis)}init(t){return this.resetState(t),this.phase="waiting",this.lastEvent=A("ready","Entra en la zona azul",t),[this.lastEvent]}press(t){return this.nowMillis=t.atMillis,this.updateOccupiedTile(t.x,t.y,t.pressed),this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update(t),t.atMillis):[]}release(t){return this.nowMillis=t.atMillis,this.updateOccupiedTile(t.x,t.y,!1),this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update({...t,pressed:!1}),t.atMillis):[]}tick(t){if(this.nowMillis=t.atMillis,this.phase==="waiting"||this.phase==="starting")return this.applyReadyTransition(this.readyGate.tick(t.atMillis),t.atMillis);if(this.phase!=="running")return[];let l=[];this.spawnDueMeteors(t.atMillis);for(let a of this.meteors){if(a.result!=="pending"||t.atMillis<a.impactAtMillis)continue;if(!this.meteorContainsOccupiedTile(a)){a.result="dodged",this.dodgedMeteors+=1;continue}if(a.impactAtMillis-this.lastDamageMillis<Ab){a.result="protected";continue}if(a.result="hit",this.lastDamageMillis=a.impactAtMillis,this.lives=Math.max(0,this.lives-1),this.lives===0){l.push(this.finish(!1,a.impactAtMillis));break}l.push(A("miss","\xA1Impacto! Mu\xE9vete",a.impactAtMillis))}return this.meteors=this.meteors.filter(a=>a.clearAtMillis>t.atMillis),this.phase==="running"&&this.remainingMillis()===0&&l.push(this.finish(!0,t.atMillis)),this.recordEvents(l)}render(){let t=dt($c);if(this.drawBackground(t),this.phase==="waiting"||this.phase==="starting")return this.drawPlayerStart(t),t;if(this.phase==="finished")return this.success?this.drawWinAnimation(t):this.drawFailAnimation(t),t;for(let l of this.occupiedTiles){let[a,i]=m0(l);G(t,a,i,uf)}for(let l of this.meteors)this.drawMeteor(t,l);return t}snapshot(){let t=this.readyGate.state(this.nowMillis),l=this.success&&this.phase==="finished"?Math.max(0,Math.min(Hs,this.nowMillis-this.finishedAtMillis)):0;return{currentGame:wt.id,label:wt.label,phase:this.phase,playerCount:this.config.playerCount,players:this.players.map(a=>({...a,lives:this.lives,score:this.dodgedMeteors})),score:this.dodgedMeteors,lives:this.lives,maxLives:jn,elapsedMillis:this.elapsedMillis(),remainingMillis:this.remainingMillis(),activeTargets:this.meteors.filter(a=>a.result==="pending").length,success:this.success,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?t.countdownMillis:0,readyPlayers:t.readyPlayers,requiredPlayers:t.requiredPlayers,celebrating:this.success&&this.phase==="finished"&&l<Hs,celebrationMillis:l,dodgedMeteors:this.dodgedMeteors,meteors:this.meteors.map(a=>({...a})),stormDurationMillis:this.config.durationMillis}}reset(t={}){this.config=Oe({...this.config,...t},wt),this.rng=We(this.config.seed),this.resetState(this.config.nowMillis),this.phase="waiting"}applyReadyTransition(t,l){return t==="players-ready"?(this.phase="starting",this.lastEvent=A("ready","Zona lista",l),[this.lastEvent]):t==="players-left"?(this.phase="waiting",this.lastEvent=A("ready","Vuelve a la zona azul",l),[this.lastEvent]):t==="started"?(this.phase="running",this.startedAtMillis=l,this.nextMeteorMillis=l+zb,this.lastEvent=A("start","Esquiva las zonas rojas",l),[this.lastEvent]):[]}difficultyProfile(){return h0[this.config.difficulty]??sf}drawBackground(t){for(let l=3;l<z;l+=4)Q(t,0,l,S,1,xb)}drawFailAnimation(t){let l=Math.floor((this.nowMillis-this.finishedAtMillis)/180)%ef.length,a=ef[l]??ef[0];for(let i=0;i<z;i+=1){let n=Math.floor(i*S/z);Q(t,n-1,i,3,1,a),Q(t,S-n-2,i,3,1,a)}}drawMeteor(t,l){if(l.result==="pending"){let s=Math.floor((this.nowMillis-l.spawnedAtMillis)/160)%2===0,r=l.radius*2+1,c=s?af:"#6c1b19";Q(t,l.x-l.radius,l.y-l.radius,r,r,c),l.radius>0&&Q(t,l.x-l.radius+1,l.y-l.radius+1,r-2,r-2,$c),G(t,l.x,l.y,nf);return}let a=Math.max(0,this.nowMillis-l.impactAtMillis),i=Math.min(2,Math.floor(a/130)),n=l.radius+i,u=a<140?ws:l.result==="hit"?"#ff3151":"#ff8a2a";Q(t,l.x-n,l.y-n,n*2+1,n*2+1,u),G(t,l.x,l.y,ws)}drawPlayerStart(t){let l=Math.floor(this.nowMillis/(this.phase==="starting"?100:190)),a=this.phase==="starting"?Gb:l%2===0?Cb:Tb,i=this.phase==="starting"?l%3:l%2,n=ga.minX+i,u=ga.minY+i,s=ga.maxX-ga.minX+1-i*2,r=ga.maxY-ga.minY+1-i*2;Q(t,n,u,s,r,a),s>2&&r>2&&Q(t,n+1,u+1,s-2,r-2,$c),G(t,7,15,"#ffffff"),G(t,8,16,"#ffffff")}drawWinAnimation(t){let l=Math.floor(Math.max(0,this.nowMillis-this.finishedAtMillis)/120);Ll(t,{color:({distance:a})=>Ic[(a+l)%Ic.length]??Ic[0],step:l})}elapsedMillis(){if(this.phase==="waiting"||this.phase==="starting"||this.phase==="ready")return 0;let t=this.phase==="finished"?this.finishedAtMillis:this.nowMillis;return Math.max(0,t-this.startedAtMillis)}finish(t,l){this.phase="finished",this.success=t,this.finishedAtMillis=l;let a=A(t?"win":"fail",t?"Tormenta superada":"Sin vidas",l);return this.lastEvent=a,a}meteorContainsOccupiedTile(t){for(let l of this.occupiedTiles){let[a,i]=m0(l);if(Math.abs(a-t.x)<=t.radius&&Math.abs(i-t.y)<=t.radius)return!0}return!1}recordEvents(t){let l=t.at(-1);return l&&(this.lastEvent=l),t}remainingMillis(){return Math.max(0,this.config.durationMillis-this.elapsedMillis())}resetState(t){this.readyGate.reset(t),this.rng=We(this.config.seed),this.dodgedMeteors=0,this.finishedAtMillis=0,this.lastDamageMillis=Number.NEGATIVE_INFINITY,this.lives=jn,this.meteors=[],this.nextMeteorId=1,this.nextMeteorMillis=0,this.nowMillis=t,this.occupiedTiles.clear(),this.players=vi(this.config.playerCount,this.config.players),this.startedAtMillis=t,this.success=!1}spawnDueMeteors(t){let l=this.difficultyProfile(),a=0;for(;this.nextMeteorMillis>0&&this.nextMeteorMillis<=t&&a<Rb;){let i=this.nextMeteorId,u=l.largeMeteorEvery>0&&i%l.largeMeteorEvery===0?Math.min(2,l.radius+1):l.radius,s=this.nextMeteorMillis+l.warningMillis;this.meteors.push({clearAtMillis:s+lf,id:i,impactAtMillis:s,radius:u,result:"pending",spawnedAtMillis:this.nextMeteorMillis,x:this.rng.range(u,S-u-1),y:this.rng.range(u,z-u-1)}),this.nextMeteorId+=1,this.nextMeteorMillis+=l.intervalMillis,a+=1}}updateOccupiedTile(t,l,a){if(t<0||t>=S||l<0||l>=z)return;let i=`${t},${l}`;a?this.occupiedTiles.add(i):this.occupiedTiles.delete(i)}};function p0(e){return{...h0[e]??sf}}function m0(e){let[t="0",l="0"]=e.split(",");return[Number(t),Number(l)]}var Gi=va({playerCount:1,difficulty:"medium",seed:137}),g0=Gi.init(0);Us(Gi);Gi.release({x:8,y:16,pressed:!1,atMillis:2150});Gi.tick({atMillis:4e3});var v0=Gi.render(),b0=Gi.snapshot(),Zn=va({playerCount:1,difficulty:"easy",seed:137});Zn.init(0);Us(Zn);G0(Zn,2450);var M0=Zn.render(),S0=Zn.snapshot(),ba=va({playerCount:1,difficulty:"medium",durationMillis:4e3,seed:137});ba.init(0);Us(ba);ba.release({x:8,y:16,pressed:!1,atMillis:2150});ba.tick({atMillis:6100});ba.tick({atMillis:7e3});var E0=ba.render(),x0=ba.snapshot(),Vn=va({playerCount:1,difficulty:"easy",seed:137});Vn.init(0);Us(Vn);var y0=2450;for(let e=0;e<3;e+=1)y0=G0(Vn,y0)+1050;var T0=Vn.render(),C0=Vn.snapshot();function Us(e){e.press({x:8,y:16,pressed:!0,atMillis:100}),e.tick({atMillis:2100})}function G0(e,t){e.release({x:8,y:16,pressed:!1,atMillis:t}),e.tick({atMillis:t});let l=e.snapshot().meteors.find(a=>a.result==="pending");return l?(e.press({x:l.x,y:l.y,pressed:!0,atMillis:l.impactAtMillis-1}),e.tick({atMillis:l.impactAtMillis}),e.release({x:l.x,y:l.y,pressed:!1,atMillis:l.impactAtMillis+1}),l.impactAtMillis+1):t}var hf={};zi(hf,{PlayerDisplay:()=>A0,ballColor:()=>Ma,blueColor:()=>ol,createGame:()=>_0,finishedSnapshot:()=>O0,manifest:()=>qe,pingPongConfigVars:()=>Zl,redColor:()=>rl,runningFrame:()=>D0,runningSnapshot:()=>mf,waitingSnapshot:()=>df});var he=ue(Ge(),1);function of(e){return{"--ping-pong-ball-x":`${3.5+e.y/31*93}%`,"--ping-pong-ball-y":`${18+e.x/15*64}%`}}function A0({snapshot:e}){let[t,l]=e.players,a=t??{label:"Rojo",score:0,color:"#ff1c28"},i=l??{label:"Azul",score:0,color:"#145cff"},n=Math.max(e.matchTarget,1),u=n*2-1,s=e.phase==="starting"?"Empieza en":"Objetivo",r=e.phase==="starting"?bt(e.countdownMillis):n,c=e.phase==="starting"?"preparados":"puntos para ganar",f=e.phase==="finished"?"\xDAltimo peloteo":"Peloteo",y=e.phase==="finished"&&e.lastRoundHits>0?e.lastRoundHits:e.roundHits,m=e.lastRoundWinner||"-",p=m===a.label?"red":m===i.label?"blue":"neutral",M=e.phase==="waiting"||e.phase==="starting",E=Math.min(u,e.rounds.length+(e.phase==="running"||e.phase==="starting"?1:0)),w=M?"Listos":"Ronda",d=M?`${e.activeTargets}/2`:`${E}/${u}`,o=e.phase==="running",h=e.phase==="finished"?null:Math.min(u,e.rounds.length+1),g=e.pointScorer===0?"red":e.pointScorer===1?"blue":"none",C=e.winnerIndex===0?"red":e.winnerIndex===1?"blue":"none",H=["ping-pong-display","ml-versus-display",`is-phase-${e.phase}`,e.pointFlashMillis>0?`is-scoring-${g}`:"",e.phase==="finished"?`is-winner-${C}`:""].filter(Boolean).join(" "),x=e.pointScorer===0?a.label:i.label,D=e.winnerIndex===0?a.label:i.label,b=e.phase==="waiting"?`${e.activeTargets}/2 en posici\xF3n`:e.phase==="starting"?"Preparados":e.phase==="finished"?`Victoria ${D}`:e.pointFlashMillis>0?`Punto ${x}`:e.roundHits>0?`${e.roundHits} ${e.roundHits===1?"golpe":"golpes"}`:"Saque",_=e.impact?of(e.impact):void 0;return(0,he.jsx)(zt,{title:e.label,phase:e.phase,variant:"versus",children:(0,he.jsxs)("div",{className:H,style:{"--ping-pong-rally-pace":e.rallyPace},children:[(0,he.jsx)(gy,{className:"ping-pong-scoreboard",left:a,right:i,target:n,centerLabel:s,centerValue:r,centerCaption:c}),(0,he.jsxs)("section",{"aria-label":`Trayectoria de la pelota: ${b}`,className:"ping-pong-rally-lane",children:[(0,he.jsx)("span",{className:"ping-pong-rally-team is-red",children:"Rojo"}),(0,he.jsx)("span",{className:"ping-pong-rally-team is-blue",children:"Azul"}),(0,he.jsx)("span",{className:"ping-pong-rally-net","aria-hidden":"true"}),(0,he.jsx)("span",{className:"ping-pong-rally-scan","aria-hidden":"true"}),e.ballTrail.map((ge,Sa)=>(0,he.jsx)("i",{"aria-hidden":"true",className:"ping-pong-ball-trail",style:{...of(ge),"--ping-pong-trail-index":Sa}},`${Sa}-${ge.x}-${ge.y}`)),(0,he.jsx)("i",{"aria-hidden":"true",className:"ping-pong-ball",style:of(e.ball)}),e.impact?(0,he.jsx)("i",{"aria-hidden":"true",className:`ping-pong-impact is-${e.impact.team===0?"red":"blue"}`,style:_},e.motionEventId):null,(0,he.jsx)("strong",{className:"ping-pong-rally-caption",children:b},`caption-${e.motionEventId}`)]}),(0,he.jsxs)(Yl,{columns:4,className:"ping-pong-metrics",children:[(0,he.jsx)(me,{className:"ping-pong-rally-metric",label:f,tone:"cyan",value:y}),(0,he.jsx)(me,{className:"ping-pong-progress-metric",label:w,tone:M?"green":"yellow",value:d}),(0,he.jsx)(me,{className:"ping-pong-last-metric",label:"\xDAltimo",tone:p,value:m}),(0,he.jsx)(me,{className:"ping-pong-time-metric",label:"Tiempo",tone:"amber",value:bt(e.elapsedMillis)})]}),(0,he.jsx)(vy,{className:"ping-pong-rounds",activeCaption:o?"Punto en curso":"Por comenzar",activeLabel:o?"En juego":"Siguiente",activeRound:h,rounds:e.rounds,totalRounds:u})]})})}var Zl={pointsToWin:{key:"points_to_win",label:"Points to win",playerFacing:!0,description:"The first team to reach this score wins. A match can last up to twice this value minus one rounds.",type:"int",default:5,min:1,max:21,step:1},initialBallSpeed:{key:"initial_ball_speed",label:"Initial ball speed (tiles/s)",playerFacing:!1,description:"The ball's starting speed in floor tiles per second on Easy. Medium, Hard, and Expert apply the difficulty multiplier curve to this value.",type:"float",default:5.75,min:3,max:10,step:.25},returnSpeedMultiplier:{key:"return_speed_multiplier",label:"Speed multiplier per return",playerFacing:!1,description:"The ball accelerates after every successful paddle return. Difficulty scales the increase above 1x, with a safety cap at 2.5 times the starting speed.",type:"float",default:1.035,min:1,max:1.1,step:.005},difficultyMultiplier:{key:"difficulty_multiplier",label:"Difficulty multiplier step",playerFacing:!1,description:"Easy uses 1x, Medium uses one step, Hard uses the step squared, and Expert uses the step cubed. It affects both starting speed and return acceleration.",type:"float",default:1.2,min:1,max:1.35,step:.05}},qe={id:"ping-pong",label:"Ping Pong",description:"Two-player arcade ping pong for red and blue halves of the Motion Levels floor.",availability:{development:!0,production:!0},catalog:{category:"versus",color:"#145cff",durationLabel:"A 5 puntos",modeLabel:"Rojo contra azul",audioLabel:"M\xFAsica + efectos",rules:["Un equipo ocupa la mitad roja y otro la azul","Devuelve la pelota pisando la zona iluminada"]},players:{allowAny:!0,min:2,max:2},start:{mode:"player-ready",releaseGraceMillis:1e3},config:{difficulty:{default:"medium",options:["easy","medium","hard","expert"]},vars:Object.values(Zl)},defaultDurationMillis:0,display:{entry:"./display"},preview:{seed:137,playerCount:2,difficulty:"medium",options:{points_to_win:5},actions:[{atMillis:100,type:"press",x:7,y:3},{atMillis:100,type:"press",x:7,y:28}],captureStartMillis:2200,frameCount:18,frameIntervalMillis:120},tags:["arcade","two-player","typescript"]};var rl="#ff1c28",ol="#145cff",Ma="#ffffff",_b="#05070a",al={r:255,g:28,b:40},il={r:20,g:92,b:255},Ai={r:255,g:255,b:255},z0=900,cf=3e3,Bs=2,Ys=29,nl=5,Vl=Math.floor(S/2),ul=Math.floor(z/2),Db=2.5;function _0(e){return new ff(e)}var ff=class{config;rng;players;winningScore;speed;startedAtMillis=0;nowMillis=0;readyGate;lastStepMillis=0;pauseUntilMillis=0;finishAtMillis=0;currentIntervalMillis=140;hitCount=0;redPaddleX=0;bluePaddleX=0;ball={x:Vl,y:ul,dx:1,dy:1};ballTrail=[];teamScore=[0,0];rounds=[];lastRoundHits=0;lastRoundWinner="";phase="waiting";success=!1;scorer=-1;winner=-1;pointAtMillis=0;lastImpactAtMillis=0;lastImpact=null;motionEventId=0;lastEvent=A("none","Listo",0);constructor(t){this.config=Oe(t,qe),this.rng=We(this.config.seed),this.readyGate=vt(qe.start,xs(2),this.config.nowMillis),this.winningScore=this.readWinningScore(),this.players=this.createPlayers(),this.speed=R0(this.config),this.resetGame(this.config.nowMillis)}init(t){return this.startedAtMillis=t,this.nowMillis=t,this.resetGame(t),this.lastEvent=A("ready","Ping Pong espera rojo y azul",t),[this.lastEvent]}press(t){this.nowMillis=t.atMillis;let l=this.readyGate.update(t);return t.pressed&&this.movePaddle(t.x,t.y),this.recordEvents(this.updatePhase(t.atMillis,l))}release(t){this.nowMillis=t.atMillis;let l=this.readyGate.update({...t,pressed:!1});return this.recordEvents(this.updatePhase(t.atMillis,l))}tick(t){this.nowMillis=t.atMillis;let l=this.updatePhase(t.atMillis,this.readyGate.tick(t.atMillis));if(this.phase!=="running"||t.atMillis<this.pauseUntilMillis)return this.recordEvents(l);for(let a=0;a<8&&!(t.atMillis-this.lastStepMillis<this.currentIntervalMillis);a+=1){this.lastStepMillis+=this.currentIntervalMillis;let i=this.moveBall(this.lastStepMillis);if(i&&l.push(i),this.phase!=="running"||this.lastStepMillis<this.pauseUntilMillis)break}return this.recordEvents(l)}render(){let t=dt(_b);return this.phase==="waiting"?(this.drawWaiting(t),t):this.phase==="starting"?(this.drawReady(t),t):this.phase==="finished"?(this.drawWin(t),t):(this.drawArena(t),this.drawScore(t),this.nowMillis<this.pauseUntilMillis?this.drawScoreFlash(t):(this.drawBallTrail(t),this.drawImpact(t),this.drawPaddles(t),this.drawBallGlow(t),G(t,this.ball.x,this.ball.y,Ma)),t)}snapshot(){this.recordEvents(this.updatePhase(this.nowMillis));let t=this.readyGate.state(this.nowMillis),l=this.phase==="starting"?t.countdownMillis:0,a=this.phase==="finished"&&this.nowMillis<this.finishAtMillis+cf?this.finishAtMillis+cf-this.nowMillis:0;return{currentGame:qe.id,label:qe.label,phase:this.phase,playerCount:this.config.playerCount,players:[{index:0,label:this.labelForTeam(0),color:rl,score:this.teamScore[0],lives:-1},{index:1,label:this.labelForTeam(1),color:ol,score:this.teamScore[1],lives:-1}],score:this.teamScore[0]+this.teamScore[1],lives:-1,elapsedMillis:Math.max(0,this.nowMillis-this.startedAtMillis),remainingMillis:a,activeTargets:this.activeHalves(this.nowMillis),success:this.success,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:l,readyPlayers:t.readyPlayers,requiredPlayers:t.requiredPlayers,matchTarget:this.winningScore,roundHits:this.hitCount,lastRoundHits:this.lastRoundHits,lastRoundWinner:this.lastRoundWinner,rounds:this.rounds,ball:{...this.ball},ballTrail:this.ballTrail.map(i=>({...i})),rallyPace:this.speed.initialMillis===this.speed.minimumMillis?1:k((this.speed.initialMillis-this.currentIntervalMillis)/(this.speed.initialMillis-this.speed.minimumMillis),0,1),pointScorer:this.scorer,pointFlashMillis:Math.max(0,this.pauseUntilMillis-this.nowMillis),winnerIndex:this.winner,impact:this.lastImpact&&this.nowMillis-this.lastImpactAtMillis<480?{...this.lastImpact,remainingMillis:480-(this.nowMillis-this.lastImpactAtMillis)}:null,motionEventId:this.motionEventId,initialBallSpeed:this.speed.initialTilesPerSecond,ballSpeed:1e3/this.currentIntervalMillis,returnSpeedMultiplier:this.speed.hitMultiplier,difficultySpeedFactor:this.speed.difficultyFactor}}reset(t={}){this.config=Oe({...this.config,...t},qe),this.rng=We(this.config.seed),this.winningScore=this.readWinningScore(),this.players=this.createPlayers(),this.speed=R0(this.config),this.motionEventId=0,this.resetGame(this.config.nowMillis),this.lastEvent=A("none","Listo",this.config.nowMillis)}createPlayers(){return[{index:0,label:"Rojo",color:rl,score:0,lives:-1},{index:1,label:"Azul",color:ol,score:0,lives:-1}]}readWinningScore(){return Rt(this.config.options,Zl.pointsToWin)}resetGame(t){this.readyGate.reset(t),this.teamScore=[0,0],this.rounds=[],this.lastRoundHits=0,this.lastRoundWinner="",this.redPaddleX=Math.floor((S-nl)/2),this.bluePaddleX=this.redPaddleX,this.phase="waiting",this.success=!1,this.scorer=-1,this.winner=-1,this.pointAtMillis=0,this.lastImpactAtMillis=0,this.lastImpact=null,this.motionEventId+=1,this.startedAtMillis=t,this.finishAtMillis=0,this.resetBall(),this.lastEvent=A("none","Esperando a rojo arriba y azul abajo",t)}updatePhase(t,l=this.readyGate.tick(t)){return this.phase==="finished"?t-this.finishAtMillis>=cf?(this.resetGame(t),[A("ready","Nueva partida",t)]):[]:l==="players-ready"?(this.phase="starting",this.motionEventId+=1,[A("start","Rojo y azul listos",t)]):l==="players-left"?(this.phase="waiting",this.motionEventId+=1,[A("ready","Vuelve a las zonas roja y azul",t)]):l==="started"?(this.phase="running",this.startedAtMillis=t,this.lastStepMillis=t,this.serve(),this.motionEventId+=1,[A("start","La pelota esta en juego",t)]):[]}movePaddle(t,l){let i=k(Math.round(t),Math.floor(nl/2),S-1-Math.floor(nl/2))-Math.floor(nl/2);l<z/2?this.redPaddleX=i:this.bluePaddleX=i}moveBall(t){let l=this.ball.x+this.ball.dx,a=this.ball.y+this.ball.dy;if(l<0&&(l=0,this.ball.dx=1),l>=S&&(l=S-1,this.ball.dx=-1),this.ball.dy<0&&a===Bs&&l>=this.redPaddleX&&l<this.redPaddleX+nl)return this.reflectFromPaddle(l,this.redPaddleX),this.commitBall({...this.ball,x:l,y:Bs+1,dy:1}),this.recordImpact(0,l,Bs),this.accelerate(),A("coin","Rojo devuelve",t);if(this.ball.dy>0&&a===Ys&&l>=this.bluePaddleX&&l<this.bluePaddleX+nl)return this.reflectFromPaddle(l,this.bluePaddleX),this.commitBall({...this.ball,x:l,y:Ys-1,dy:-1}),this.recordImpact(1,l,Ys),this.accelerate(),A("coin","Azul devuelve",t);if(a<0)return this.scorePoint(1,t),A("score","Punto para azul",t);if(a>=z)return this.scorePoint(0,t),A("score","Punto para rojo",t);this.commitBall({...this.ball,x:l,y:a})}scorePoint(t,l){if(this.teamScore[t]+=1,this.scorer=t,this.pointAtMillis=l,this.motionEventId+=1,this.recordRound(t),this.teamScore[t]>=this.winningScore){this.phase="finished",this.success=t===1,this.winner=t,this.finishAtMillis=l;return}this.resetBall(),this.pauseUntilMillis=l+z0,this.lastStepMillis=this.pauseUntilMillis}recordRound(t){this.lastRoundHits=this.hitCount,this.lastRoundWinner=this.labelForTeam(t),this.rounds=[...this.rounds,{index:this.rounds.length+1,winnerIndex:t,winnerLabel:this.lastRoundWinner,hits:this.lastRoundHits}]}resetBall(){this.ball={...this.ball,x:Vl,y:ul},this.ballTrail=[],this.currentIntervalMillis=this.speed.initialMillis,this.hitCount=0,this.pauseUntilMillis=0,this.serve()}serve(){this.ball={x:Vl,y:ul,dy:this.rng.int(2)===0?-1:1,dx:this.rng.int(2)===0?-1:1}}reflectFromPaddle(t,l){let a=l+Math.floor(nl/2);t<a?this.ball.dx=-1:t>a?this.ball.dx=1:this.ball.dx=this.rng.int(2)===0?-1:1}accelerate(){this.hitCount+=1,this.currentIntervalMillis=Math.max(this.speed.minimumMillis,this.currentIntervalMillis/this.speed.hitMultiplier)}commitBall(t){this.ballTrail=[{x:this.ball.x,y:this.ball.y},...this.ballTrail.filter(l=>l.x!==this.ball.x||l.y!==this.ball.y)].slice(0,5),this.ball=t}recordImpact(t,l,a){this.lastImpact={team:t,x:l,y:a},this.lastImpactAtMillis=this.nowMillis,this.motionEventId+=1}drawWaiting(t){let l=this.halfReady(0,this.nowMillis),a=this.halfReady(1,this.nowMillis);this.drawWaitingHalf(t,0,l),this.drawWaitingHalf(t,1,a),l?this.drawSoftBar(t,3,5,10,al):this.drawBreathingOutline(t,0,al),a?this.drawSoftBar(t,3,24,10,il):this.drawBreathingOutline(t,1,il)}drawReady(t){let l=_c(qe.start),a=Math.max(0,l-this.readyGate.state(this.nowMillis).countdownMillis),n=k(a/l,0,1)*(z*.7),u=.5+Math.sin(a/86)*.5;for(let s=0;s<z;s+=1)for(let r=0;r<S;r+=1){let c=Math.abs(r-Vl)+Math.abs(s-ul),f=s>=z/2?il:al,y=Math.abs(c-n),m=Math.max(0,1-y/3.2),p=7+(Math.sin(r*.82+s*.38-a/120)+1)*4;m>0?G(t,r,s,Ut(f,28+m*74,m*24)):c<n&&G(t,r,s,sl(f,p+u*10))}this.drawCenterLine(t,18+u*20),this.drawBallGlow(t),G(t,Vl,ul,Ma)}drawScoreFlash(t){let l=this.scorer===1?il:al,a=Math.max(0,this.nowMillis-this.pointAtMillis),i=k(a/z0,0,1),n=this.scorer===0?z-1:0,u=i*(z+8);for(let s=0;s<z;s+=1)for(let r=0;r<S;r+=1){let c=Math.hypot((r-Vl)*1.35,s-n),f=Math.max(0,1-Math.abs(c-u)/3.4),y=Math.sin(r*12.13+s*7.71+a/38)>.9?1:0,m=1-i;f>0?G(t,r,s,Ut(l,28+f*82,f*34)):y>0&&m>.18&&G(t,r,s,Ut(l,22+m*44,m*12))}this.drawCenterLine(t,12+(1-i)*24),this.drawPaddles(t)}drawWin(t){let l=this.winner===1?il:al,a=Math.max(0,this.nowMillis-this.finishAtMillis),i=a/92,n=.5+Math.sin(a/110)*.5;for(let s=0;s<z;s+=1)for(let r=0;r<S;r+=1){let f=((this.winner===0?z-1-s:s)+r*.72-i+z*4)%11,y=Math.sin(r*17.17+s*11.31+a/55);f<3.8?G(t,r,s,Ut(l,38+(3.8-f)*15+n*12,12+n*18)):y>.91&&G(t,r,s,Ut(l,48,32))}let u=64+n*26;Q(t,Vl-1,ul-1,3,3,sl(Ai,u)),G(t,Vl,ul,Ma)}drawArena(t){let l=this.nowMillis/185;for(let a=1;a<z-1;a+=1){let i=a<z/2?al:il;for(let n=0;n<S;n+=1){let u=(Math.sin(n*.78+a*.31-l)+1)*.5,s=(n+a)%3===0?4:0;G(t,n,a,sl(i,4+u*7+s))}}this.drawCenterLine(t,18+(Math.sin(this.nowMillis/140)+1)*5)}drawCenterLine(t,l){for(let a=0;a<S;a+=1)(a+Math.floor(this.nowMillis/120))%3===0&&(G(t,a,ul-1,Ut(Ai,l,0)),G(t,a,ul,Ut(Ai,l*.72,0)))}drawBallTrail(t){this.ballTrail.forEach((l,a)=>{let i=Math.max(10,46-a*8);G(t,l.x,l.y,sl(Ai,i))})}drawBallGlow(t){let l=20+(Math.sin(this.nowMillis/70)+1)*7;for(let[a,i]of[[-1,0],[1,0],[0,-1],[0,1]])G(t,this.ball.x+a,this.ball.y+i,sl(Ai,l))}drawImpact(t){if(!this.lastImpact)return;let l=this.nowMillis-this.lastImpactAtMillis;if(l<0||l>=480)return;let a=l/480,i=1+a*5.5,n=this.lastImpact.team===0?al:il;for(let u=Math.max(0,this.lastImpact.y-7);u<=Math.min(z-1,this.lastImpact.y+7);u+=1)for(let s=Math.max(0,this.lastImpact.x-7);s<=Math.min(S-1,this.lastImpact.x+7);s+=1){let r=Math.hypot(s-this.lastImpact.x,u-this.lastImpact.y),c=Math.max(0,1-Math.abs(r-i)/1.45);c>0&&G(t,s,u,Ut(n,30+c*52,c*28*(1-a)))}}drawBreathingOutline(t,l,a){let i=(this.nowMillis/900+l*.5)%1,n=.5-Math.cos(i*Math.PI*2)*.5,u=Math.round(1+n*2),s=l===0?3+u:21-u,r=48+n*48;this.drawOutline(t,u,s,S-u*2,8,sl(a,r))}drawScore(t){for(let l=0;l<this.teamScore[0]&&l<S;l+=1)G(t,l,0,rl);for(let l=0;l<this.teamScore[1]&&l<S;l+=1)G(t,l,z-1,ol)}drawPaddles(t){this.drawPaddle(t,this.redPaddleX,Bs,al),this.drawPaddle(t,this.bluePaddleX,Ys,il)}drawWaitingHalf(t,l,a){let i=l===1?z/2:0,n=l===1?il:al,u=Math.floor(this.nowMillis/120)%10;for(let s=i;s<i+z/2;s+=1)for(let r=0;r<S;r+=1){let c=0;a?c=18+(r+s+u)%6*6:(r+s+u)%7===0&&(c=22),c>0&&G(t,r,s,sl(n,c))}}drawSoftBar(t,l,a,i,n){let u=Math.floor(this.nowMillis/100)%6;for(let s=0;s<i;s+=1){let r=s===u||s===i-1-u?112:58+s*4;G(t,l+s,a,sl(n,r)),G(t,l+s,a+1,Ut(n,r-8,10)),G(t,l+s,a+2,sl(n,Math.max(18,r-28)))}}drawPaddle(t,l,a,i){for(let n=0;n<nl;n+=1){let u=n===Math.floor(nl/2)?118:74;G(t,l+n,a,Ut(i,u,18))}}drawOutline(t,l,a,i,n,u){let s=Math.max(2,Math.round(i)),r=Math.max(2,Math.round(n));Q(t,l,a,s,1,u),Q(t,l,a+r-1,s,1,u),Q(t,l,a,1,r,u),Q(t,l+s-1,a,1,r,u)}halfReady(t,l){return this.readyGate.zoneReady(t,l)}activeHalves(t){return this.readyGate.state(t).readyPlayers}labelForTeam(t){return this.players[t]?.label||(t===0?"Rojo":"Azul")}recordEvents(t){let l=t.at(-1);return l&&(this.lastEvent=l),t}};function R0(e){let t=Rt(e.options,Zl.initialBallSpeed),l=Rt(e.options,Zl.returnSpeedMultiplier),i=Rt(e.options,Zl.difficultyMultiplier)**Ob(e.difficulty),n=t*i,u=1+(l-1)*i,s=n*Db;return{difficultyFactor:i,hitMultiplier:u,initialTilesPerSecond:n,initialMillis:1e3/n,minimumMillis:1e3/s}}function Ob(e){switch(e){case"medium":return 1;case"hard":return 2;case"expert":return 3;default:return 0}}function sl(e,t){return ha(_t(e,t))}function Ut(e,t,l){return ha(On(_t(e,t),_t(Ai,l)))}var D0=(()=>{let e=dt("#05070a");return Q(e,5,2,5,1,rl),Q(e,6,29,5,1,ol),G(e,8,16,Ma),e})(),df={currentGame:qe.id,label:qe.label,phase:"waiting",playerCount:2,players:[{index:0,label:"Rojo",color:rl,score:0,lives:-1},{index:1,label:"Azul",color:ol,score:0,lives:-1}],score:0,lives:-1,elapsedMillis:0,remainingMillis:0,activeTargets:0,success:!1,lastEventCue:"ready",lastEventMessage:"Ping Pong espera rojo y azul",countdownMillis:0,readyPlayers:0,requiredPlayers:2,matchTarget:5,roundHits:0,lastRoundHits:0,lastRoundWinner:"",rounds:[],ball:{x:8,y:16,dx:1,dy:1},ballTrail:[],rallyPace:0,pointScorer:-1,pointFlashMillis:0,winnerIndex:-1,impact:null,motionEventId:1,initialBallSpeed:6.9,ballSpeed:6.9,returnSpeedMultiplier:1.042,difficultySpeedFactor:1.2},mf={...df,phase:"running",readyPlayers:2,elapsedMillis:8200,activeTargets:2,lastEventCue:"coin",lastEventMessage:"Azul devuelve",roundHits:3,ball:{x:11,y:21,dx:1,dy:1},ballTrail:[{x:10,y:20},{x:9,y:19},{x:8,y:18}],rallyPace:.1935,ballSpeed:7.8064,impact:{team:1,x:10,y:29,remainingMillis:180},motionEventId:4},O0={...mf,phase:"finished",score:5,remainingMillis:2400,success:!0,lastEventCue:"score",lastEventMessage:"Punto para azul",players:[{index:0,label:"Rojo",color:rl,score:2,lives:-1},{index:1,label:"Azul",color:ol,score:3,lives:-1}],lastRoundHits:2,lastRoundWinner:"Azul",pointScorer:1,winnerIndex:1,motionEventId:8,rounds:[{index:1,winnerIndex:0,winnerLabel:"Rojo",hits:1},{index:2,winnerIndex:1,winnerLabel:"Azul",hits:2}]};var pf=new Map([[Dt.id,Uc],[Ie.id,Vc],[Ht.id,Wc],[wt.id,rf],[qe.id,hf]]),vS=[...pf.values()].map(e=>e.manifest).sort((e,t)=>e.id.localeCompare(t.id));var yf=ue(Ge(),1),Ls=new WeakMap;function N0(e,t){let l=pf.get(t.gameId);if(!l?.PlayerDisplay)throw new Error(`no player display registered for ${t.gameId}`);let a=Ls.get(e);a||(a={root:(0,H0.createRoot)(e),input:t},Ls.set(e,a)),a.input=t;let i=l.PlayerDisplay;a.root.render((0,yf.jsx)(yy,{paused:t.paused===!0,children:(0,yf.jsx)(i,{snapshot:t.snapshot,frame:t.frame})}))}function Nb(e){Ls.get(e)?.root.unmount(),Ls.delete(e)}function Hb(){if(document.getElementById("motion-levels-games-display-styles"))return;let e=document.createElement("style");e.id="motion-levels-games-display-styles",e.textContent=`/*
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
`,document.head.append(e)}Hb();window.MotionLevelsGamesDisplay={revision:"f3656b270b7a09f818bb7562a74395ce91a660be",mount:N0,update:N0,unmount:Nb};})();
