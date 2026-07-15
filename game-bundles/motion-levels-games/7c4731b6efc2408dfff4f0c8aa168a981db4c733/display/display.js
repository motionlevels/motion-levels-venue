"use strict";(()=>{var wM=Object.create;var Nu=Object.defineProperty;var RM=Object.getOwnPropertyDescriptor;var AM=Object.getOwnPropertyNames;var zM=Object.getPrototypeOf,PM=Object.prototype.hasOwnProperty;var $t=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports),Qe=(t,e)=>{for(var i in e)Nu(t,i,{get:e[i],enumerable:!0})},_M=(t,e,i,a)=>{if(e&&typeof e=="object"||typeof e=="function")for(let l of AM(e))!PM.call(t,l)&&l!==i&&Nu(t,l,{get:()=>e[l],enumerable:!(a=RM(e,l))||a.enumerable});return t};var Y=(t,e,i)=>(i=t!=null?wM(zM(t)):{},_M(e||!t||!t.__esModule?Nu(i,"default",{value:t,enumerable:!0}):i,t));var rm=$t(me=>{"use strict";function Lu(t,e){var i=t.length;t.push(e);e:for(;0<i;){var a=i-1>>>1,l=t[a];if(0<yr(l,e))t[a]=e,t[i]=l,i=a;else break e}}function ei(t){return t.length===0?null:t[0]}function vr(t){if(t.length===0)return null;var e=t[0],i=t.pop();if(i!==e){t[0]=i;e:for(var a=0,l=t.length,n=l>>>1;a<n;){var s=2*(a+1)-1,r=t[s],o=s+1,u=t[o];if(0>yr(r,i))o<l&&0>yr(u,r)?(t[a]=u,t[o]=i,a=o):(t[a]=r,t[s]=i,a=s);else if(o<l&&0>yr(u,i))t[a]=u,t[o]=i,a=o;else break e}}return e}function yr(t,e){var i=t.sortIndex-e.sortIndex;return i!==0?i:t.id-e.id}me.unstable_now=void 0;typeof performance=="object"&&typeof performance.now=="function"?(Wh=performance,me.unstable_now=function(){return Wh.now()}):(Du=Date,$h=Du.now(),me.unstable_now=function(){return Du.now()-$h});var Wh,Du,$h,xi=[],la=[],NM=1,At=null,Ze=3,Bu=!1,Yn=!1,Fn=!1,Uu=!1,im=typeof setTimeout=="function"?setTimeout:null,am=typeof clearTimeout=="function"?clearTimeout:null,em=typeof setImmediate<"u"?setImmediate:null;function gr(t){for(var e=ei(la);e!==null;){if(e.callback===null)vr(la);else if(e.startTime<=t)vr(la),e.sortIndex=e.expirationTime,Lu(xi,e);else break;e=ei(la)}}function Yu(t){if(Fn=!1,gr(t),!Yn)if(ei(xi)!==null)Yn=!0,Sl||(Sl=!0,xl());else{var e=ei(la);e!==null&&Fu(Yu,e.startTime-t)}}var Sl=!1,Xn=-1,lm=5,nm=-1;function sm(){return Uu?!0:!(me.unstable_now()-nm<lm)}function Ou(){if(Uu=!1,Sl){var t=me.unstable_now();nm=t;var e=!0;try{e:{Yn=!1,Fn&&(Fn=!1,am(Xn),Xn=-1),Bu=!0;var i=Ze;try{t:{for(gr(t),At=ei(xi);At!==null&&!(At.expirationTime>t&&sm());){var a=At.callback;if(typeof a=="function"){At.callback=null,Ze=At.priorityLevel;var l=a(At.expirationTime<=t);if(t=me.unstable_now(),typeof l=="function"){At.callback=l,gr(t),e=!0;break t}At===ei(xi)&&vr(xi),gr(t)}else vr(xi);At=ei(xi)}if(At!==null)e=!0;else{var n=ei(la);n!==null&&Fu(Yu,n.startTime-t),e=!1}}break e}finally{At=null,Ze=i,Bu=!1}e=void 0}}finally{e?xl():Sl=!1}}}var xl;typeof em=="function"?xl=function(){em(Ou)}:typeof MessageChannel<"u"?(Hu=new MessageChannel,tm=Hu.port2,Hu.port1.onmessage=Ou,xl=function(){tm.postMessage(null)}):xl=function(){im(Ou,0)};var Hu,tm;function Fu(t,e){Xn=im(function(){t(me.unstable_now())},e)}me.unstable_IdlePriority=5;me.unstable_ImmediatePriority=1;me.unstable_LowPriority=4;me.unstable_NormalPriority=3;me.unstable_Profiling=null;me.unstable_UserBlockingPriority=2;me.unstable_cancelCallback=function(t){t.callback=null};me.unstable_forceFrameRate=function(t){0>t||125<t?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):lm=0<t?Math.floor(1e3/t):5};me.unstable_getCurrentPriorityLevel=function(){return Ze};me.unstable_next=function(t){switch(Ze){case 1:case 2:case 3:var e=3;break;default:e=Ze}var i=Ze;Ze=e;try{return t()}finally{Ze=i}};me.unstable_requestPaint=function(){Uu=!0};me.unstable_runWithPriority=function(t,e){switch(t){case 1:case 2:case 3:case 4:case 5:break;default:t=3}var i=Ze;Ze=t;try{return e()}finally{Ze=i}};me.unstable_scheduleCallback=function(t,e,i){var a=me.unstable_now();switch(typeof i=="object"&&i!==null?(i=i.delay,i=typeof i=="number"&&0<i?a+i:a):i=a,t){case 1:var l=-1;break;case 2:l=250;break;case 5:l=1073741823;break;case 4:l=1e4;break;default:l=5e3}return l=i+l,t={id:NM++,callback:e,priorityLevel:t,startTime:i,expirationTime:l,sortIndex:-1},i>a?(t.sortIndex=i,Lu(la,t),ei(xi)===null&&t===ei(la)&&(Fn?(am(Xn),Xn=-1):Fn=!0,Fu(Yu,i-a))):(t.sortIndex=l,Lu(xi,t),Yn||Bu||(Yn=!0,Sl||(Sl=!0,xl()))),t};me.unstable_shouldYield=sm;me.unstable_wrapCallback=function(t){var e=Ze;return function(){var i=Ze;Ze=e;try{return t.apply(this,arguments)}finally{Ze=i}}}});var um=$t((pG,om)=>{"use strict";om.exports=rm()});var Mm=$t(H=>{"use strict";var ju=Symbol.for("react.transitional.element"),DM=Symbol.for("react.portal"),OM=Symbol.for("react.fragment"),HM=Symbol.for("react.strict_mode"),LM=Symbol.for("react.profiler"),BM=Symbol.for("react.consumer"),UM=Symbol.for("react.context"),YM=Symbol.for("react.forward_ref"),FM=Symbol.for("react.suspense"),XM=Symbol.for("react.memo"),mm=Symbol.for("react.lazy"),qM=Symbol.for("react.activity"),cm=Symbol.iterator;function jM(t){return t===null||typeof t!="object"?null:(t=cm&&t[cm]||t["@@iterator"],typeof t=="function"?t:null)}var pm={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},ym=Object.assign,gm={};function Gl(t,e,i){this.props=t,this.context=e,this.refs=gm,this.updater=i||pm}Gl.prototype.isReactComponent={};Gl.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};Gl.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function vm(){}vm.prototype=Gl.prototype;function Vu(t,e,i){this.props=t,this.context=e,this.refs=gm,this.updater=i||pm}var Zu=Vu.prototype=new vm;Zu.constructor=Vu;ym(Zu,Gl.prototype);Zu.isPureReactComponent=!0;var dm=Array.isArray;function qu(){}var ce={H:null,A:null,T:null,S:null},bm=Object.prototype.hasOwnProperty;function Iu(t,e,i){var a=i.ref;return{$$typeof:ju,type:t,key:e,ref:a!==void 0?a:null,props:i}}function VM(t,e){return Iu(t.type,e,t.props)}function Qu(t){return typeof t=="object"&&t!==null&&t.$$typeof===ju}function ZM(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(i){return e[i]})}var fm=/\/+/g;function Xu(t,e){return typeof t=="object"&&t!==null&&t.key!=null?ZM(""+t.key):e.toString(36)}function IM(t){switch(t.status){case"fulfilled":return t.value;case"rejected":throw t.reason;default:switch(typeof t.status=="string"?t.then(qu,qu):(t.status="pending",t.then(function(e){t.status==="pending"&&(t.status="fulfilled",t.value=e)},function(e){t.status==="pending"&&(t.status="rejected",t.reason=e)})),t.status){case"fulfilled":return t.value;case"rejected":throw t.reason}}throw t}function El(t,e,i,a,l){var n=typeof t;(n==="undefined"||n==="boolean")&&(t=null);var s=!1;if(t===null)s=!0;else switch(n){case"bigint":case"string":case"number":s=!0;break;case"object":switch(t.$$typeof){case ju:case DM:s=!0;break;case mm:return s=t._init,El(s(t._payload),e,i,a,l)}}if(s)return l=l(t),s=a===""?"."+Xu(t,0):a,dm(l)?(i="",s!=null&&(i=s.replace(fm,"$&/")+"/"),El(l,e,i,"",function(u){return u})):l!=null&&(Qu(l)&&(l=VM(l,i+(l.key==null||t&&t.key===l.key?"":(""+l.key).replace(fm,"$&/")+"/")+s)),e.push(l)),1;s=0;var r=a===""?".":a+":";if(dm(t))for(var o=0;o<t.length;o++)a=t[o],n=r+Xu(a,o),s+=El(a,e,i,n,l);else if(o=jM(t),typeof o=="function")for(t=o.call(t),o=0;!(a=t.next()).done;)a=a.value,n=r+Xu(a,o++),s+=El(a,e,i,n,l);else if(n==="object"){if(typeof t.then=="function")return El(IM(t),e,i,a,l);throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.")}return s}function br(t,e,i){if(t==null)return t;var a=[],l=0;return El(t,a,"","",function(n){return e.call(i,n,l++)}),a}function QM(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(i){(t._status===0||t._status===-1)&&(t._status=1,t._result=i)},function(i){(t._status===0||t._status===-1)&&(t._status=2,t._result=i)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var hm=typeof reportError=="function"?reportError:function(t){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var e=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof t=="object"&&t!==null&&typeof t.message=="string"?String(t.message):String(t),error:t});if(!window.dispatchEvent(e))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",t);return}console.error(t)},kM={map:br,forEach:function(t,e,i){br(t,function(){e.apply(this,arguments)},i)},count:function(t){var e=0;return br(t,function(){e++}),e},toArray:function(t){return br(t,function(e){return e})||[]},only:function(t){if(!Qu(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};H.Activity=qM;H.Children=kM;H.Component=Gl;H.Fragment=OM;H.Profiler=LM;H.PureComponent=Vu;H.StrictMode=HM;H.Suspense=FM;H.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=ce;H.__COMPILER_RUNTIME={__proto__:null,c:function(t){return ce.H.useMemoCache(t)}};H.cache=function(t){return function(){return t.apply(null,arguments)}};H.cacheSignal=function(){return null};H.cloneElement=function(t,e,i){if(t==null)throw Error("The argument must be a React element, but you passed "+t+".");var a=ym({},t.props),l=t.key;if(e!=null)for(n in e.key!==void 0&&(l=""+e.key),e)!bm.call(e,n)||n==="key"||n==="__self"||n==="__source"||n==="ref"&&e.ref===void 0||(a[n]=e[n]);var n=arguments.length-2;if(n===1)a.children=i;else if(1<n){for(var s=Array(n),r=0;r<n;r++)s[r]=arguments[r+2];a.children=s}return Iu(t.type,l,a)};H.createContext=function(t){return t={$$typeof:UM,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null},t.Provider=t,t.Consumer={$$typeof:BM,_context:t},t};H.createElement=function(t,e,i){var a,l={},n=null;if(e!=null)for(a in e.key!==void 0&&(n=""+e.key),e)bm.call(e,a)&&a!=="key"&&a!=="__self"&&a!=="__source"&&(l[a]=e[a]);var s=arguments.length-2;if(s===1)l.children=i;else if(1<s){for(var r=Array(s),o=0;o<s;o++)r[o]=arguments[o+2];l.children=r}if(t&&t.defaultProps)for(a in s=t.defaultProps,s)l[a]===void 0&&(l[a]=s[a]);return Iu(t,n,l)};H.createRef=function(){return{current:null}};H.forwardRef=function(t){return{$$typeof:YM,render:t}};H.isValidElement=Qu;H.lazy=function(t){return{$$typeof:mm,_payload:{_status:-1,_result:t},_init:QM}};H.memo=function(t,e){return{$$typeof:XM,type:t,compare:e===void 0?null:e}};H.startTransition=function(t){var e=ce.T,i={};ce.T=i;try{var a=t(),l=ce.S;l!==null&&l(i,a),typeof a=="object"&&a!==null&&typeof a.then=="function"&&a.then(qu,hm)}catch(n){hm(n)}finally{e!==null&&i.types!==null&&(e.types=i.types),ce.T=e}};H.unstable_useCacheRefresh=function(){return ce.H.useCacheRefresh()};H.use=function(t){return ce.H.use(t)};H.useActionState=function(t,e,i){return ce.H.useActionState(t,e,i)};H.useCallback=function(t,e){return ce.H.useCallback(t,e)};H.useContext=function(t){return ce.H.useContext(t)};H.useDebugValue=function(){};H.useDeferredValue=function(t,e){return ce.H.useDeferredValue(t,e)};H.useEffect=function(t,e){return ce.H.useEffect(t,e)};H.useEffectEvent=function(t){return ce.H.useEffectEvent(t)};H.useId=function(){return ce.H.useId()};H.useImperativeHandle=function(t,e,i){return ce.H.useImperativeHandle(t,e,i)};H.useInsertionEffect=function(t,e){return ce.H.useInsertionEffect(t,e)};H.useLayoutEffect=function(t,e){return ce.H.useLayoutEffect(t,e)};H.useMemo=function(t,e){return ce.H.useMemo(t,e)};H.useOptimistic=function(t,e){return ce.H.useOptimistic(t,e)};H.useReducer=function(t,e,i){return ce.H.useReducer(t,e,i)};H.useRef=function(t){return ce.H.useRef(t)};H.useState=function(t){return ce.H.useState(t)};H.useSyncExternalStore=function(t,e,i){return ce.H.useSyncExternalStore(t,e,i)};H.useTransition=function(){return ce.H.useTransition()};H.version="19.2.7"});var qa=$t((gG,xm)=>{"use strict";xm.exports=Mm()});var Em=$t(Ke=>{"use strict";var KM=qa();function Sm(t){var e="https://react.dev/errors/"+t;if(1<arguments.length){e+="?args[]="+encodeURIComponent(arguments[1]);for(var i=2;i<arguments.length;i++)e+="&args[]="+encodeURIComponent(arguments[i])}return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function na(){}var ke={d:{f:na,r:function(){throw Error(Sm(522))},D:na,C:na,L:na,m:na,X:na,S:na,M:na},p:0,findDOMNode:null},JM=Symbol.for("react.portal");function WM(t,e,i){var a=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:JM,key:a==null?null:""+a,children:t,containerInfo:e,implementation:i}}var qn=KM.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function Mr(t,e){if(t==="font")return"";if(typeof e=="string")return e==="use-credentials"?e:""}Ke.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=ke;Ke.createPortal=function(t,e){var i=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)throw Error(Sm(299));return WM(t,e,null,i)};Ke.flushSync=function(t){var e=qn.T,i=ke.p;try{if(qn.T=null,ke.p=2,t)return t()}finally{qn.T=e,ke.p=i,ke.d.f()}};Ke.preconnect=function(t,e){typeof t=="string"&&(e?(e=e.crossOrigin,e=typeof e=="string"?e==="use-credentials"?e:"":void 0):e=null,ke.d.C(t,e))};Ke.prefetchDNS=function(t){typeof t=="string"&&ke.d.D(t)};Ke.preinit=function(t,e){if(typeof t=="string"&&e&&typeof e.as=="string"){var i=e.as,a=Mr(i,e.crossOrigin),l=typeof e.integrity=="string"?e.integrity:void 0,n=typeof e.fetchPriority=="string"?e.fetchPriority:void 0;i==="style"?ke.d.S(t,typeof e.precedence=="string"?e.precedence:void 0,{crossOrigin:a,integrity:l,fetchPriority:n}):i==="script"&&ke.d.X(t,{crossOrigin:a,integrity:l,fetchPriority:n,nonce:typeof e.nonce=="string"?e.nonce:void 0})}};Ke.preinitModule=function(t,e){if(typeof t=="string")if(typeof e=="object"&&e!==null){if(e.as==null||e.as==="script"){var i=Mr(e.as,e.crossOrigin);ke.d.M(t,{crossOrigin:i,integrity:typeof e.integrity=="string"?e.integrity:void 0,nonce:typeof e.nonce=="string"?e.nonce:void 0})}}else e==null&&ke.d.M(t)};Ke.preload=function(t,e){if(typeof t=="string"&&typeof e=="object"&&e!==null&&typeof e.as=="string"){var i=e.as,a=Mr(i,e.crossOrigin);ke.d.L(t,i,{crossOrigin:a,integrity:typeof e.integrity=="string"?e.integrity:void 0,nonce:typeof e.nonce=="string"?e.nonce:void 0,type:typeof e.type=="string"?e.type:void 0,fetchPriority:typeof e.fetchPriority=="string"?e.fetchPriority:void 0,referrerPolicy:typeof e.referrerPolicy=="string"?e.referrerPolicy:void 0,imageSrcSet:typeof e.imageSrcSet=="string"?e.imageSrcSet:void 0,imageSizes:typeof e.imageSizes=="string"?e.imageSizes:void 0,media:typeof e.media=="string"?e.media:void 0})}};Ke.preloadModule=function(t,e){if(typeof t=="string")if(e){var i=Mr(e.as,e.crossOrigin);ke.d.m(t,{as:typeof e.as=="string"&&e.as!=="script"?e.as:void 0,crossOrigin:i,integrity:typeof e.integrity=="string"?e.integrity:void 0})}else ke.d.m(t)};Ke.requestFormReset=function(t){ke.d.r(t)};Ke.unstable_batchedUpdates=function(t,e){return t(e)};Ke.useFormState=function(t,e,i){return qn.H.useFormState(t,e,i)};Ke.useFormStatus=function(){return qn.H.useHostTransitionStatus()};Ke.version="19.2.7"});var Tm=$t((bG,Cm)=>{"use strict";function Gm(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Gm)}catch(t){console.error(t)}}Gm(),Cm.exports=Em()});var B0=$t(Zo=>{"use strict";var De=um(),Wp=qa(),$M=Tm();function S(t){var e="https://react.dev/errors/"+t;if(1<arguments.length){e+="?args[]="+encodeURIComponent(arguments[1]);for(var i=2;i<arguments.length;i++)e+="&args[]="+encodeURIComponent(arguments[i])}return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function $p(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function As(t){var e=t,i=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,(e.flags&4098)!==0&&(i=e.return),t=e.return;while(t)}return e.tag===3?i:null}function ey(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function ty(t){if(t.tag===31){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function wm(t){if(As(t)!==t)throw Error(S(188))}function ex(t){var e=t.alternate;if(!e){if(e=As(t),e===null)throw Error(S(188));return e!==t?null:t}for(var i=t,a=e;;){var l=i.return;if(l===null)break;var n=l.alternate;if(n===null){if(a=l.return,a!==null){i=a;continue}break}if(l.child===n.child){for(n=l.child;n;){if(n===i)return wm(l),t;if(n===a)return wm(l),e;n=n.sibling}throw Error(S(188))}if(i.return!==a.return)i=l,a=n;else{for(var s=!1,r=l.child;r;){if(r===i){s=!0,i=l,a=n;break}if(r===a){s=!0,a=l,i=n;break}r=r.sibling}if(!s){for(r=n.child;r;){if(r===i){s=!0,i=n,a=l;break}if(r===a){s=!0,a=n,i=l;break}r=r.sibling}if(!s)throw Error(S(189))}}if(i.alternate!==a)throw Error(S(190))}if(i.tag!==3)throw Error(S(188));return i.stateNode.current===i?t:e}function iy(t){var e=t.tag;if(e===5||e===26||e===27||e===6)return t;for(t=t.child;t!==null;){if(e=iy(t),e!==null)return e;t=t.sibling}return null}var he=Object.assign,tx=Symbol.for("react.element"),xr=Symbol.for("react.transitional.element"),Jn=Symbol.for("react.portal"),zl=Symbol.for("react.fragment"),ay=Symbol.for("react.strict_mode"),Rc=Symbol.for("react.profiler"),ly=Symbol.for("react.consumer"),Ai=Symbol.for("react.context"),Ed=Symbol.for("react.forward_ref"),Ac=Symbol.for("react.suspense"),zc=Symbol.for("react.suspense_list"),Gd=Symbol.for("react.memo"),sa=Symbol.for("react.lazy"),Pc=Symbol.for("react.activity"),ix=Symbol.for("react.memo_cache_sentinel"),Rm=Symbol.iterator;function jn(t){return t===null||typeof t!="object"?null:(t=Rm&&t[Rm]||t["@@iterator"],typeof t=="function"?t:null)}var ax=Symbol.for("react.client.reference");function _c(t){if(t==null)return null;if(typeof t=="function")return t.$$typeof===ax?null:t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case zl:return"Fragment";case Rc:return"Profiler";case ay:return"StrictMode";case Ac:return"Suspense";case zc:return"SuspenseList";case Pc:return"Activity"}if(typeof t=="object")switch(t.$$typeof){case Jn:return"Portal";case Ai:return t.displayName||"Context";case ly:return(t._context.displayName||"Context")+".Consumer";case Ed:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case Gd:return e=t.displayName||null,e!==null?e:_c(t.type)||"Memo";case sa:e=t._payload,t=t._init;try{return _c(t(e))}catch{}}return null}var Wn=Array.isArray,_=Wp.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,te=$M.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,ka={pending:!1,data:null,method:null,action:null},Nc=[],Pl=-1;function ni(t){return{current:t}}function Be(t){0>Pl||(t.current=Nc[Pl],Nc[Pl]=null,Pl--)}function ue(t,e){Pl++,Nc[Pl]=t.current,t.current=e}var li=ni(null),ps=ni(null),ga=ni(null),eo=ni(null);function to(t,e){switch(ue(ga,e),ue(ps,t),ue(li,null),e.nodeType){case 9:case 11:t=(t=e.documentElement)&&(t=t.namespaceURI)?Op(t):0;break;default:if(t=e.tagName,e=e.namespaceURI)e=Op(e),t=G0(e,t);else switch(t){case"svg":t=1;break;case"math":t=2;break;default:t=0}}Be(li),ue(li,t)}function kl(){Be(li),Be(ps),Be(ga)}function Dc(t){t.memoizedState!==null&&ue(eo,t);var e=li.current,i=G0(e,t.type);e!==i&&(ue(ps,t),ue(li,i))}function io(t){ps.current===t&&(Be(li),Be(ps)),eo.current===t&&(Be(eo),Ts._currentValue=ka)}var ku,Am;function Va(t){if(ku===void 0)try{throw Error()}catch(i){var e=i.stack.trim().match(/\n( *(at )?)/);ku=e&&e[1]||"",Am=-1<i.stack.indexOf(`
    at`)?" (<anonymous>)":-1<i.stack.indexOf("@")?"@unknown:0:0":""}return`
`+ku+t+Am}var Ku=!1;function Ju(t,e){if(!t||Ku)return"";Ku=!0;var i=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var a={DetermineComponentFrameRoot:function(){try{if(e){var p=function(){throw Error()};if(Object.defineProperty(p.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(p,[])}catch(y){var f=y}Reflect.construct(t,[],p)}else{try{p.call()}catch(y){f=y}t.call(p.prototype)}}else{try{throw Error()}catch(y){f=y}(p=t())&&typeof p.catch=="function"&&p.catch(function(){})}}catch(y){if(y&&f&&typeof y.stack=="string")return[y.stack,f.stack]}return[null,null]}};a.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var l=Object.getOwnPropertyDescriptor(a.DetermineComponentFrameRoot,"name");l&&l.configurable&&Object.defineProperty(a.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var n=a.DetermineComponentFrameRoot(),s=n[0],r=n[1];if(s&&r){var o=s.split(`
`),u=r.split(`
`);for(l=a=0;a<o.length&&!o[a].includes("DetermineComponentFrameRoot");)a++;for(;l<u.length&&!u[l].includes("DetermineComponentFrameRoot");)l++;if(a===o.length||l===u.length)for(a=o.length-1,l=u.length-1;1<=a&&0<=l&&o[a]!==u[l];)l--;for(;1<=a&&0<=l;a--,l--)if(o[a]!==u[l]){if(a!==1||l!==1)do if(a--,l--,0>l||o[a]!==u[l]){var d=`
`+o[a].replace(" at new "," at ");return t.displayName&&d.includes("<anonymous>")&&(d=d.replace("<anonymous>",t.displayName)),d}while(1<=a&&0<=l);break}}}finally{Ku=!1,Error.prepareStackTrace=i}return(i=t?t.displayName||t.name:"")?Va(i):""}function lx(t,e){switch(t.tag){case 26:case 27:case 5:return Va(t.type);case 16:return Va("Lazy");case 13:return t.child!==e&&e!==null?Va("Suspense Fallback"):Va("Suspense");case 19:return Va("SuspenseList");case 0:case 15:return Ju(t.type,!1);case 11:return Ju(t.type.render,!1);case 1:return Ju(t.type,!0);case 31:return Va("Activity");default:return""}}function zm(t){try{var e="",i=null;do e+=lx(t,i),i=t,t=t.return;while(t);return e}catch(a){return`
Error generating stack: `+a.message+`
`+a.stack}}var Oc=Object.prototype.hasOwnProperty,Cd=De.unstable_scheduleCallback,Wu=De.unstable_cancelCallback,nx=De.unstable_shouldYield,sx=De.unstable_requestPaint,mt=De.unstable_now,rx=De.unstable_getCurrentPriorityLevel,ny=De.unstable_ImmediatePriority,sy=De.unstable_UserBlockingPriority,ao=De.unstable_NormalPriority,ox=De.unstable_LowPriority,ry=De.unstable_IdlePriority,ux=De.log,cx=De.unstable_setDisableYieldValue,zs=null,pt=null;function fa(t){if(typeof ux=="function"&&cx(t),pt&&typeof pt.setStrictMode=="function")try{pt.setStrictMode(zs,t)}catch{}}var yt=Math.clz32?Math.clz32:hx,dx=Math.log,fx=Math.LN2;function hx(t){return t>>>=0,t===0?32:31-(dx(t)/fx|0)|0}var Sr=256,Er=262144,Gr=4194304;function Za(t){var e=t&42;if(e!==0)return e;switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return t&261888;case 262144:case 524288:case 1048576:case 2097152:return t&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return t&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return t}}function zo(t,e,i){var a=t.pendingLanes;if(a===0)return 0;var l=0,n=t.suspendedLanes,s=t.pingedLanes;t=t.warmLanes;var r=a&134217727;return r!==0?(a=r&~n,a!==0?l=Za(a):(s&=r,s!==0?l=Za(s):i||(i=r&~t,i!==0&&(l=Za(i))))):(r=a&~n,r!==0?l=Za(r):s!==0?l=Za(s):i||(i=a&~t,i!==0&&(l=Za(i)))),l===0?0:e!==0&&e!==l&&(e&n)===0&&(n=l&-l,i=e&-e,n>=i||n===32&&(i&4194048)!==0)?e:l}function Ps(t,e){return(t.pendingLanes&~(t.suspendedLanes&~t.pingedLanes)&e)===0}function mx(t,e){switch(t){case 1:case 2:case 4:case 8:case 64:return e+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function oy(){var t=Gr;return Gr<<=1,(Gr&62914560)===0&&(Gr=4194304),t}function $u(t){for(var e=[],i=0;31>i;i++)e.push(t);return e}function _s(t,e){t.pendingLanes|=e,e!==268435456&&(t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0)}function px(t,e,i,a,l,n){var s=t.pendingLanes;t.pendingLanes=i,t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0,t.expiredLanes&=i,t.entangledLanes&=i,t.errorRecoveryDisabledLanes&=i,t.shellSuspendCounter=0;var r=t.entanglements,o=t.expirationTimes,u=t.hiddenUpdates;for(i=s&~i;0<i;){var d=31-yt(i),p=1<<d;r[d]=0,o[d]=-1;var f=u[d];if(f!==null)for(u[d]=null,d=0;d<f.length;d++){var y=f[d];y!==null&&(y.lane&=-536870913)}i&=~p}a!==0&&uy(t,a,0),n!==0&&l===0&&t.tag!==0&&(t.suspendedLanes|=n&~(s&~e))}function uy(t,e,i){t.pendingLanes|=e,t.suspendedLanes&=~e;var a=31-yt(e);t.entangledLanes|=e,t.entanglements[a]=t.entanglements[a]|1073741824|i&261930}function cy(t,e){var i=t.entangledLanes|=e;for(t=t.entanglements;i;){var a=31-yt(i),l=1<<a;l&e|t[a]&e&&(t[a]|=e),i&=~l}}function dy(t,e){var i=e&-e;return i=(i&42)!==0?1:Td(i),(i&(t.suspendedLanes|e))!==0?0:i}function Td(t){switch(t){case 2:t=1;break;case 8:t=4;break;case 32:t=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:t=128;break;case 268435456:t=134217728;break;default:t=0}return t}function wd(t){return t&=-t,2<t?8<t?(t&134217727)!==0?32:268435456:8:2}function fy(){var t=te.p;return t!==0?t:(t=window.event,t===void 0?32:O0(t.type))}function Pm(t,e){var i=te.p;try{return te.p=t,e()}finally{te.p=i}}var za=Math.random().toString(36).slice(2),Fe="__reactFiber$"+za,at="__reactProps$"+za,rn="__reactContainer$"+za,Hc="__reactEvents$"+za,yx="__reactListeners$"+za,gx="__reactHandles$"+za,_m="__reactResources$"+za,Ns="__reactMarker$"+za;function Rd(t){delete t[Fe],delete t[at],delete t[Hc],delete t[yx],delete t[gx]}function _l(t){var e=t[Fe];if(e)return e;for(var i=t.parentNode;i;){if(e=i[rn]||i[Fe]){if(i=e.alternate,e.child!==null||i!==null&&i.child!==null)for(t=Yp(t);t!==null;){if(i=t[Fe])return i;t=Yp(t)}return e}t=i,i=t.parentNode}return null}function on(t){if(t=t[Fe]||t[rn]){var e=t.tag;if(e===5||e===6||e===13||e===31||e===26||e===27||e===3)return t}return null}function $n(t){var e=t.tag;if(e===5||e===26||e===27||e===6)return t.stateNode;throw Error(S(33))}function Xl(t){var e=t[_m];return e||(e=t[_m]={hoistableStyles:new Map,hoistableScripts:new Map}),e}function Le(t){t[Ns]=!0}var hy=new Set,my={};function nl(t,e){Kl(t,e),Kl(t+"Capture",e)}function Kl(t,e){for(my[t]=e,t=0;t<e.length;t++)hy.add(e[t])}var vx=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),Nm={},Dm={};function bx(t){return Oc.call(Dm,t)?!0:Oc.call(Nm,t)?!1:vx.test(t)?Dm[t]=!0:(Nm[t]=!0,!1)}function Ur(t,e,i){if(bx(e))if(i===null)t.removeAttribute(e);else{switch(typeof i){case"undefined":case"function":case"symbol":t.removeAttribute(e);return;case"boolean":var a=e.toLowerCase().slice(0,5);if(a!=="data-"&&a!=="aria-"){t.removeAttribute(e);return}}t.setAttribute(e,""+i)}}function Cr(t,e,i){if(i===null)t.removeAttribute(e);else{switch(typeof i){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(e);return}t.setAttribute(e,""+i)}}function Si(t,e,i,a){if(a===null)t.removeAttribute(i);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(i);return}t.setAttributeNS(e,i,""+a)}}function Pt(t){switch(typeof t){case"bigint":case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function py(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function Mx(t,e,i){var a=Object.getOwnPropertyDescriptor(t.constructor.prototype,e);if(!t.hasOwnProperty(e)&&typeof a<"u"&&typeof a.get=="function"&&typeof a.set=="function"){var l=a.get,n=a.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return l.call(this)},set:function(s){i=""+s,n.call(this,s)}}),Object.defineProperty(t,e,{enumerable:a.enumerable}),{getValue:function(){return i},setValue:function(s){i=""+s},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function Lc(t){if(!t._valueTracker){var e=py(t)?"checked":"value";t._valueTracker=Mx(t,e,""+t[e])}}function yy(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var i=e.getValue(),a="";return t&&(a=py(t)?t.checked?"true":"false":t.value),t=a,t!==i?(e.setValue(t),!0):!1}function lo(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}var xx=/[\n"\\]/g;function Dt(t){return t.replace(xx,function(e){return"\\"+e.charCodeAt(0).toString(16)+" "})}function Bc(t,e,i,a,l,n,s,r){t.name="",s!=null&&typeof s!="function"&&typeof s!="symbol"&&typeof s!="boolean"?t.type=s:t.removeAttribute("type"),e!=null?s==="number"?(e===0&&t.value===""||t.value!=e)&&(t.value=""+Pt(e)):t.value!==""+Pt(e)&&(t.value=""+Pt(e)):s!=="submit"&&s!=="reset"||t.removeAttribute("value"),e!=null?Uc(t,s,Pt(e)):i!=null?Uc(t,s,Pt(i)):a!=null&&t.removeAttribute("value"),l==null&&n!=null&&(t.defaultChecked=!!n),l!=null&&(t.checked=l&&typeof l!="function"&&typeof l!="symbol"),r!=null&&typeof r!="function"&&typeof r!="symbol"&&typeof r!="boolean"?t.name=""+Pt(r):t.removeAttribute("name")}function gy(t,e,i,a,l,n,s,r){if(n!=null&&typeof n!="function"&&typeof n!="symbol"&&typeof n!="boolean"&&(t.type=n),e!=null||i!=null){if(!(n!=="submit"&&n!=="reset"||e!=null)){Lc(t);return}i=i!=null?""+Pt(i):"",e=e!=null?""+Pt(e):i,r||e===t.value||(t.value=e),t.defaultValue=e}a=a??l,a=typeof a!="function"&&typeof a!="symbol"&&!!a,t.checked=r?t.checked:!!a,t.defaultChecked=!!a,s!=null&&typeof s!="function"&&typeof s!="symbol"&&typeof s!="boolean"&&(t.name=s),Lc(t)}function Uc(t,e,i){e==="number"&&lo(t.ownerDocument)===t||t.defaultValue===""+i||(t.defaultValue=""+i)}function ql(t,e,i,a){if(t=t.options,e){e={};for(var l=0;l<i.length;l++)e["$"+i[l]]=!0;for(i=0;i<t.length;i++)l=e.hasOwnProperty("$"+t[i].value),t[i].selected!==l&&(t[i].selected=l),l&&a&&(t[i].defaultSelected=!0)}else{for(i=""+Pt(i),e=null,l=0;l<t.length;l++){if(t[l].value===i){t[l].selected=!0,a&&(t[l].defaultSelected=!0);return}e!==null||t[l].disabled||(e=t[l])}e!==null&&(e.selected=!0)}}function vy(t,e,i){if(e!=null&&(e=""+Pt(e),e!==t.value&&(t.value=e),i==null)){t.defaultValue!==e&&(t.defaultValue=e);return}t.defaultValue=i!=null?""+Pt(i):""}function by(t,e,i,a){if(e==null){if(a!=null){if(i!=null)throw Error(S(92));if(Wn(a)){if(1<a.length)throw Error(S(93));a=a[0]}i=a}i==null&&(i=""),e=i}i=Pt(e),t.defaultValue=i,a=t.textContent,a===i&&a!==""&&a!==null&&(t.value=a),Lc(t)}function Jl(t,e){if(e){var i=t.firstChild;if(i&&i===t.lastChild&&i.nodeType===3){i.nodeValue=e;return}}t.textContent=e}var Sx=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function Om(t,e,i){var a=e.indexOf("--")===0;i==null||typeof i=="boolean"||i===""?a?t.setProperty(e,""):e==="float"?t.cssFloat="":t[e]="":a?t.setProperty(e,i):typeof i!="number"||i===0||Sx.has(e)?e==="float"?t.cssFloat=i:t[e]=(""+i).trim():t[e]=i+"px"}function My(t,e,i){if(e!=null&&typeof e!="object")throw Error(S(62));if(t=t.style,i!=null){for(var a in i)!i.hasOwnProperty(a)||e!=null&&e.hasOwnProperty(a)||(a.indexOf("--")===0?t.setProperty(a,""):a==="float"?t.cssFloat="":t[a]="");for(var l in e)a=e[l],e.hasOwnProperty(l)&&i[l]!==a&&Om(t,l,a)}else for(var n in e)e.hasOwnProperty(n)&&Om(t,n,e[n])}function Ad(t){if(t.indexOf("-")===-1)return!1;switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Ex=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),Gx=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Yr(t){return Gx.test(""+t)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":t}function zi(){}var Yc=null;function zd(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var Nl=null,jl=null;function Hm(t){var e=on(t);if(e&&(t=e.stateNode)){var i=t[at]||null;e:switch(t=e.stateNode,e.type){case"input":if(Bc(t,i.value,i.defaultValue,i.defaultValue,i.checked,i.defaultChecked,i.type,i.name),e=i.name,i.type==="radio"&&e!=null){for(i=t;i.parentNode;)i=i.parentNode;for(i=i.querySelectorAll('input[name="'+Dt(""+e)+'"][type="radio"]'),e=0;e<i.length;e++){var a=i[e];if(a!==t&&a.form===t.form){var l=a[at]||null;if(!l)throw Error(S(90));Bc(a,l.value,l.defaultValue,l.defaultValue,l.checked,l.defaultChecked,l.type,l.name)}}for(e=0;e<i.length;e++)a=i[e],a.form===t.form&&yy(a)}break e;case"textarea":vy(t,i.value,i.defaultValue);break e;case"select":e=i.value,e!=null&&ql(t,!!i.multiple,e,!1)}}}var ec=!1;function xy(t,e,i){if(ec)return t(e,i);ec=!0;try{var a=t(e);return a}finally{if(ec=!1,(Nl!==null||jl!==null)&&(Xo(),Nl&&(e=Nl,t=jl,jl=Nl=null,Hm(e),t)))for(e=0;e<t.length;e++)Hm(t[e])}}function ys(t,e){var i=t.stateNode;if(i===null)return null;var a=i[at]||null;if(a===null)return null;i=a[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(a=!a.disabled)||(t=t.type,a=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!a;break e;default:t=!1}if(t)return null;if(i&&typeof i!="function")throw Error(S(231,e,typeof i));return i}var Oi=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Fc=!1;if(Oi)try{Cl={},Object.defineProperty(Cl,"passive",{get:function(){Fc=!0}}),window.addEventListener("test",Cl,Cl),window.removeEventListener("test",Cl,Cl)}catch{Fc=!1}var Cl,ha=null,Pd=null,Fr=null;function Sy(){if(Fr)return Fr;var t,e=Pd,i=e.length,a,l="value"in ha?ha.value:ha.textContent,n=l.length;for(t=0;t<i&&e[t]===l[t];t++);var s=i-t;for(a=1;a<=s&&e[i-a]===l[n-a];a++);return Fr=l.slice(t,1<a?1-a:void 0)}function Xr(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function Tr(){return!0}function Lm(){return!1}function lt(t){function e(i,a,l,n,s){this._reactName=i,this._targetInst=l,this.type=a,this.nativeEvent=n,this.target=s,this.currentTarget=null;for(var r in t)t.hasOwnProperty(r)&&(i=t[r],this[r]=i?i(n):n[r]);return this.isDefaultPrevented=(n.defaultPrevented!=null?n.defaultPrevented:n.returnValue===!1)?Tr:Lm,this.isPropagationStopped=Lm,this}return he(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var i=this.nativeEvent;i&&(i.preventDefault?i.preventDefault():typeof i.returnValue!="unknown"&&(i.returnValue=!1),this.isDefaultPrevented=Tr)},stopPropagation:function(){var i=this.nativeEvent;i&&(i.stopPropagation?i.stopPropagation():typeof i.cancelBubble!="unknown"&&(i.cancelBubble=!0),this.isPropagationStopped=Tr)},persist:function(){},isPersistent:Tr}),e}var sl={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Po=lt(sl),Ds=he({},sl,{view:0,detail:0}),Cx=lt(Ds),tc,ic,Vn,_o=he({},Ds,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:_d,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==Vn&&(Vn&&t.type==="mousemove"?(tc=t.screenX-Vn.screenX,ic=t.screenY-Vn.screenY):ic=tc=0,Vn=t),tc)},movementY:function(t){return"movementY"in t?t.movementY:ic}}),Bm=lt(_o),Tx=he({},_o,{dataTransfer:0}),wx=lt(Tx),Rx=he({},Ds,{relatedTarget:0}),ac=lt(Rx),Ax=he({},sl,{animationName:0,elapsedTime:0,pseudoElement:0}),zx=lt(Ax),Px=he({},sl,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),_x=lt(Px),Nx=he({},sl,{data:0}),Um=lt(Nx),Dx={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Ox={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Hx={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Lx(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=Hx[t])?!!e[t]:!1}function _d(){return Lx}var Bx=he({},Ds,{key:function(t){if(t.key){var e=Dx[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=Xr(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?Ox[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:_d,charCode:function(t){return t.type==="keypress"?Xr(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?Xr(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),Ux=lt(Bx),Yx=he({},_o,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Ym=lt(Yx),Fx=he({},Ds,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:_d}),Xx=lt(Fx),qx=he({},sl,{propertyName:0,elapsedTime:0,pseudoElement:0}),jx=lt(qx),Vx=he({},_o,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),Zx=lt(Vx),Ix=he({},sl,{newState:0,oldState:0}),Qx=lt(Ix),kx=[9,13,27,32],Nd=Oi&&"CompositionEvent"in window,is=null;Oi&&"documentMode"in document&&(is=document.documentMode);var Kx=Oi&&"TextEvent"in window&&!is,Ey=Oi&&(!Nd||is&&8<is&&11>=is),Fm=" ",Xm=!1;function Gy(t,e){switch(t){case"keyup":return kx.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Cy(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var Dl=!1;function Jx(t,e){switch(t){case"compositionend":return Cy(e);case"keypress":return e.which!==32?null:(Xm=!0,Fm);case"textInput":return t=e.data,t===Fm&&Xm?null:t;default:return null}}function Wx(t,e){if(Dl)return t==="compositionend"||!Nd&&Gy(t,e)?(t=Sy(),Fr=Pd=ha=null,Dl=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return Ey&&e.locale!=="ko"?null:e.data;default:return null}}var $x={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function qm(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!$x[t.type]:e==="textarea"}function Ty(t,e,i,a){Nl?jl?jl.push(a):jl=[a]:Nl=a,e=Eo(e,"onChange"),0<e.length&&(i=new Po("onChange","change",null,i,a),t.push({event:i,listeners:e}))}var as=null,gs=null;function eS(t){x0(t,0)}function No(t){var e=$n(t);if(yy(e))return t}function jm(t,e){if(t==="change")return e}var wy=!1;Oi&&(Oi?(Rr="oninput"in document,Rr||(lc=document.createElement("div"),lc.setAttribute("oninput","return;"),Rr=typeof lc.oninput=="function"),wr=Rr):wr=!1,wy=wr&&(!document.documentMode||9<document.documentMode));var wr,Rr,lc;function Vm(){as&&(as.detachEvent("onpropertychange",Ry),gs=as=null)}function Ry(t){if(t.propertyName==="value"&&No(gs)){var e=[];Ty(e,gs,t,zd(t)),xy(eS,e)}}function tS(t,e,i){t==="focusin"?(Vm(),as=e,gs=i,as.attachEvent("onpropertychange",Ry)):t==="focusout"&&Vm()}function iS(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return No(gs)}function aS(t,e){if(t==="click")return No(e)}function lS(t,e){if(t==="input"||t==="change")return No(e)}function nS(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var vt=typeof Object.is=="function"?Object.is:nS;function vs(t,e){if(vt(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var i=Object.keys(t),a=Object.keys(e);if(i.length!==a.length)return!1;for(a=0;a<i.length;a++){var l=i[a];if(!Oc.call(e,l)||!vt(t[l],e[l]))return!1}return!0}function Zm(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function Im(t,e){var i=Zm(t);t=0;for(var a;i;){if(i.nodeType===3){if(a=t+i.textContent.length,t<=e&&a>=e)return{node:i,offset:e-t};t=a}e:{for(;i;){if(i.nextSibling){i=i.nextSibling;break e}i=i.parentNode}i=void 0}i=Zm(i)}}function Ay(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?Ay(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function zy(t){t=t!=null&&t.ownerDocument!=null&&t.ownerDocument.defaultView!=null?t.ownerDocument.defaultView:window;for(var e=lo(t.document);e instanceof t.HTMLIFrameElement;){try{var i=typeof e.contentWindow.location.href=="string"}catch{i=!1}if(i)t=e.contentWindow;else break;e=lo(t.document)}return e}function Dd(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}var sS=Oi&&"documentMode"in document&&11>=document.documentMode,Ol=null,Xc=null,ls=null,qc=!1;function Qm(t,e,i){var a=i.window===i?i.document:i.nodeType===9?i:i.ownerDocument;qc||Ol==null||Ol!==lo(a)||(a=Ol,"selectionStart"in a&&Dd(a)?a={start:a.selectionStart,end:a.selectionEnd}:(a=(a.ownerDocument&&a.ownerDocument.defaultView||window).getSelection(),a={anchorNode:a.anchorNode,anchorOffset:a.anchorOffset,focusNode:a.focusNode,focusOffset:a.focusOffset}),ls&&vs(ls,a)||(ls=a,a=Eo(Xc,"onSelect"),0<a.length&&(e=new Po("onSelect","select",null,e,i),t.push({event:e,listeners:a}),e.target=Ol)))}function ja(t,e){var i={};return i[t.toLowerCase()]=e.toLowerCase(),i["Webkit"+t]="webkit"+e,i["Moz"+t]="moz"+e,i}var Hl={animationend:ja("Animation","AnimationEnd"),animationiteration:ja("Animation","AnimationIteration"),animationstart:ja("Animation","AnimationStart"),transitionrun:ja("Transition","TransitionRun"),transitionstart:ja("Transition","TransitionStart"),transitioncancel:ja("Transition","TransitionCancel"),transitionend:ja("Transition","TransitionEnd")},nc={},Py={};Oi&&(Py=document.createElement("div").style,"AnimationEvent"in window||(delete Hl.animationend.animation,delete Hl.animationiteration.animation,delete Hl.animationstart.animation),"TransitionEvent"in window||delete Hl.transitionend.transition);function rl(t){if(nc[t])return nc[t];if(!Hl[t])return t;var e=Hl[t],i;for(i in e)if(e.hasOwnProperty(i)&&i in Py)return nc[t]=e[i];return t}var _y=rl("animationend"),Ny=rl("animationiteration"),Dy=rl("animationstart"),rS=rl("transitionrun"),oS=rl("transitionstart"),uS=rl("transitioncancel"),Oy=rl("transitionend"),Hy=new Map,jc="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");jc.push("scrollEnd");function Vt(t,e){Hy.set(t,e),nl(e,[t])}var no=typeof reportError=="function"?reportError:function(t){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var e=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof t=="object"&&t!==null&&typeof t.message=="string"?String(t.message):String(t),error:t});if(!window.dispatchEvent(e))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",t);return}console.error(t)},zt=[],Ll=0,Od=0;function Do(){for(var t=Ll,e=Od=Ll=0;e<t;){var i=zt[e];zt[e++]=null;var a=zt[e];zt[e++]=null;var l=zt[e];zt[e++]=null;var n=zt[e];if(zt[e++]=null,a!==null&&l!==null){var s=a.pending;s===null?l.next=l:(l.next=s.next,s.next=l),a.pending=l}n!==0&&Ly(i,l,n)}}function Oo(t,e,i,a){zt[Ll++]=t,zt[Ll++]=e,zt[Ll++]=i,zt[Ll++]=a,Od|=a,t.lanes|=a,t=t.alternate,t!==null&&(t.lanes|=a)}function Hd(t,e,i,a){return Oo(t,e,i,a),so(t)}function ol(t,e){return Oo(t,null,null,e),so(t)}function Ly(t,e,i){t.lanes|=i;var a=t.alternate;a!==null&&(a.lanes|=i);for(var l=!1,n=t.return;n!==null;)n.childLanes|=i,a=n.alternate,a!==null&&(a.childLanes|=i),n.tag===22&&(t=n.stateNode,t===null||t._visibility&1||(l=!0)),t=n,n=n.return;return t.tag===3?(n=t.stateNode,l&&e!==null&&(l=31-yt(i),t=n.hiddenUpdates,a=t[l],a===null?t[l]=[e]:a.push(e),e.lane=i|536870912),n):null}function so(t){if(50<hs)throw hs=0,dd=null,Error(S(185));for(var e=t.return;e!==null;)t=e,e=t.return;return t.tag===3?t.stateNode:null}var Bl={};function cS(t,e,i,a){this.tag=t,this.key=i,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=a,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function ft(t,e,i,a){return new cS(t,e,i,a)}function Ld(t){return t=t.prototype,!(!t||!t.isReactComponent)}function _i(t,e){var i=t.alternate;return i===null?(i=ft(t.tag,e,t.key,t.mode),i.elementType=t.elementType,i.type=t.type,i.stateNode=t.stateNode,i.alternate=t,t.alternate=i):(i.pendingProps=e,i.type=t.type,i.flags=0,i.subtreeFlags=0,i.deletions=null),i.flags=t.flags&65011712,i.childLanes=t.childLanes,i.lanes=t.lanes,i.child=t.child,i.memoizedProps=t.memoizedProps,i.memoizedState=t.memoizedState,i.updateQueue=t.updateQueue,e=t.dependencies,i.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},i.sibling=t.sibling,i.index=t.index,i.ref=t.ref,i.refCleanup=t.refCleanup,i}function By(t,e){t.flags&=65011714;var i=t.alternate;return i===null?(t.childLanes=0,t.lanes=e,t.child=null,t.subtreeFlags=0,t.memoizedProps=null,t.memoizedState=null,t.updateQueue=null,t.dependencies=null,t.stateNode=null):(t.childLanes=i.childLanes,t.lanes=i.lanes,t.child=i.child,t.subtreeFlags=0,t.deletions=null,t.memoizedProps=i.memoizedProps,t.memoizedState=i.memoizedState,t.updateQueue=i.updateQueue,t.type=i.type,e=i.dependencies,t.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),t}function qr(t,e,i,a,l,n){var s=0;if(a=t,typeof t=="function")Ld(t)&&(s=1);else if(typeof t=="string")s=h2(t,i,li.current)?26:t==="html"||t==="head"||t==="body"?27:5;else e:switch(t){case Pc:return t=ft(31,i,e,l),t.elementType=Pc,t.lanes=n,t;case zl:return Ka(i.children,l,n,e);case ay:s=8,l|=24;break;case Rc:return t=ft(12,i,e,l|2),t.elementType=Rc,t.lanes=n,t;case Ac:return t=ft(13,i,e,l),t.elementType=Ac,t.lanes=n,t;case zc:return t=ft(19,i,e,l),t.elementType=zc,t.lanes=n,t;default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case Ai:s=10;break e;case ly:s=9;break e;case Ed:s=11;break e;case Gd:s=14;break e;case sa:s=16,a=null;break e}s=29,i=Error(S(130,t===null?"null":typeof t,"")),a=null}return e=ft(s,i,e,l),e.elementType=t,e.type=a,e.lanes=n,e}function Ka(t,e,i,a){return t=ft(7,t,a,e),t.lanes=i,t}function sc(t,e,i){return t=ft(6,t,null,e),t.lanes=i,t}function Uy(t){var e=ft(18,null,null,0);return e.stateNode=t,e}function rc(t,e,i){return e=ft(4,t.children!==null?t.children:[],t.key,e),e.lanes=i,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}var km=new WeakMap;function Ot(t,e){if(typeof t=="object"&&t!==null){var i=km.get(t);return i!==void 0?i:(e={value:t,source:e,stack:zm(e)},km.set(t,e),e)}return{value:t,source:e,stack:zm(e)}}var Ul=[],Yl=0,ro=null,bs=0,_t=[],Nt=0,Ta=null,ti=1,ii="";function wi(t,e){Ul[Yl++]=bs,Ul[Yl++]=ro,ro=t,bs=e}function Yy(t,e,i){_t[Nt++]=ti,_t[Nt++]=ii,_t[Nt++]=Ta,Ta=t;var a=ti;t=ii;var l=32-yt(a)-1;a&=~(1<<l),i+=1;var n=32-yt(e)+l;if(30<n){var s=l-l%5;n=(a&(1<<s)-1).toString(32),a>>=s,l-=s,ti=1<<32-yt(e)+l|i<<l|a,ii=n+t}else ti=1<<n|i<<l|a,ii=t}function Bd(t){t.return!==null&&(wi(t,1),Yy(t,1,0))}function Ud(t){for(;t===ro;)ro=Ul[--Yl],Ul[Yl]=null,bs=Ul[--Yl],Ul[Yl]=null;for(;t===Ta;)Ta=_t[--Nt],_t[Nt]=null,ii=_t[--Nt],_t[Nt]=null,ti=_t[--Nt],_t[Nt]=null}function Fy(t,e){_t[Nt++]=ti,_t[Nt++]=ii,_t[Nt++]=Ta,ti=e.id,ii=e.overflow,Ta=t}var Xe=null,fe=null,Q=!1,va=null,Ht=!1,Vc=Error(S(519));function wa(t){var e=Error(S(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw Ms(Ot(e,t)),Vc}function Km(t){var e=t.stateNode,i=t.type,a=t.memoizedProps;switch(e[Fe]=t,e[at]=a,i){case"dialog":F("cancel",e),F("close",e);break;case"iframe":case"object":case"embed":F("load",e);break;case"video":case"audio":for(i=0;i<Gs.length;i++)F(Gs[i],e);break;case"source":F("error",e);break;case"img":case"image":case"link":F("error",e),F("load",e);break;case"details":F("toggle",e);break;case"input":F("invalid",e),gy(e,a.value,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name,!0);break;case"select":F("invalid",e);break;case"textarea":F("invalid",e),by(e,a.value,a.defaultValue,a.children)}i=a.children,typeof i!="string"&&typeof i!="number"&&typeof i!="bigint"||e.textContent===""+i||a.suppressHydrationWarning===!0||E0(e.textContent,i)?(a.popover!=null&&(F("beforetoggle",e),F("toggle",e)),a.onScroll!=null&&F("scroll",e),a.onScrollEnd!=null&&F("scrollend",e),a.onClick!=null&&(e.onclick=zi),e=!0):e=!1,e||wa(t,!0)}function Jm(t){for(Xe=t.return;Xe;)switch(Xe.tag){case 5:case 31:case 13:Ht=!1;return;case 27:case 3:Ht=!0;return;default:Xe=Xe.return}}function Tl(t){if(t!==Xe)return!1;if(!Q)return Jm(t),Q=!0,!1;var e=t.tag,i;if((i=e!==3&&e!==27)&&((i=e===5)&&(i=t.type,i=!(i!=="form"&&i!=="button")||yd(t.type,t.memoizedProps)),i=!i),i&&fe&&wa(t),Jm(t),e===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(S(317));fe=Up(t)}else if(e===31){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(S(317));fe=Up(t)}else e===27?(e=fe,Pa(t.type)?(t=Md,Md=null,fe=t):fe=e):fe=Xe?Bt(t.stateNode.nextSibling):null;return!0}function el(){fe=Xe=null,Q=!1}function oc(){var t=va;return t!==null&&(tt===null?tt=t:tt.push.apply(tt,t),va=null),t}function Ms(t){va===null?va=[t]:va.push(t)}var Zc=ni(null),ul=null,Pi=null;function oa(t,e,i){ue(Zc,e._currentValue),e._currentValue=i}function Ni(t){t._currentValue=Zc.current,Be(Zc)}function Ic(t,e,i){for(;t!==null;){var a=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,a!==null&&(a.childLanes|=e)):a!==null&&(a.childLanes&e)!==e&&(a.childLanes|=e),t===i)break;t=t.return}}function Qc(t,e,i,a){var l=t.child;for(l!==null&&(l.return=t);l!==null;){var n=l.dependencies;if(n!==null){var s=l.child;n=n.firstContext;e:for(;n!==null;){var r=n;n=l;for(var o=0;o<e.length;o++)if(r.context===e[o]){n.lanes|=i,r=n.alternate,r!==null&&(r.lanes|=i),Ic(n.return,i,t),a||(s=null);break e}n=r.next}}else if(l.tag===18){if(s=l.return,s===null)throw Error(S(341));s.lanes|=i,n=s.alternate,n!==null&&(n.lanes|=i),Ic(s,i,t),s=null}else s=l.child;if(s!==null)s.return=l;else for(s=l;s!==null;){if(s===t){s=null;break}if(l=s.sibling,l!==null){l.return=s.return,s=l;break}s=s.return}l=s}}function un(t,e,i,a){t=null;for(var l=e,n=!1;l!==null;){if(!n){if((l.flags&524288)!==0)n=!0;else if((l.flags&262144)!==0)break}if(l.tag===10){var s=l.alternate;if(s===null)throw Error(S(387));if(s=s.memoizedProps,s!==null){var r=l.type;vt(l.pendingProps.value,s.value)||(t!==null?t.push(r):t=[r])}}else if(l===eo.current){if(s=l.alternate,s===null)throw Error(S(387));s.memoizedState.memoizedState!==l.memoizedState.memoizedState&&(t!==null?t.push(Ts):t=[Ts])}l=l.return}t!==null&&Qc(e,t,i,a),e.flags|=262144}function oo(t){for(t=t.firstContext;t!==null;){if(!vt(t.context._currentValue,t.memoizedValue))return!0;t=t.next}return!1}function tl(t){ul=t,Pi=null,t=t.dependencies,t!==null&&(t.firstContext=null)}function qe(t){return Xy(ul,t)}function Ar(t,e){return ul===null&&tl(t),Xy(t,e)}function Xy(t,e){var i=e._currentValue;if(e={context:e,memoizedValue:i,next:null},Pi===null){if(t===null)throw Error(S(308));Pi=e,t.dependencies={lanes:0,firstContext:e},t.flags|=524288}else Pi=Pi.next=e;return i}var dS=typeof AbortController<"u"?AbortController:function(){var t=[],e=this.signal={aborted:!1,addEventListener:function(i,a){t.push(a)}};this.abort=function(){e.aborted=!0,t.forEach(function(i){return i()})}},fS=De.unstable_scheduleCallback,hS=De.unstable_NormalPriority,we={$$typeof:Ai,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Yd(){return{controller:new dS,data:new Map,refCount:0}}function Os(t){t.refCount--,t.refCount===0&&fS(hS,function(){t.controller.abort()})}var ns=null,kc=0,Wl=0,Vl=null;function mS(t,e){if(ns===null){var i=ns=[];kc=0,Wl=ff(),Vl={status:"pending",value:void 0,then:function(a){i.push(a)}}}return kc++,e.then(Wm,Wm),e}function Wm(){if(--kc===0&&ns!==null){Vl!==null&&(Vl.status="fulfilled");var t=ns;ns=null,Wl=0,Vl=null;for(var e=0;e<t.length;e++)(0,t[e])()}}function pS(t,e){var i=[],a={status:"pending",value:null,reason:null,then:function(l){i.push(l)}};return t.then(function(){a.status="fulfilled",a.value=e;for(var l=0;l<i.length;l++)(0,i[l])(e)},function(l){for(a.status="rejected",a.reason=l,l=0;l<i.length;l++)(0,i[l])(void 0)}),a}var $m=_.S;_.S=function(t,e){i0=mt(),typeof e=="object"&&e!==null&&typeof e.then=="function"&&mS(t,e),$m!==null&&$m(t,e)};var Ja=ni(null);function Fd(){var t=Ja.current;return t!==null?t:re.pooledCache}function jr(t,e){e===null?ue(Ja,Ja.current):ue(Ja,e.pool)}function qy(){var t=Fd();return t===null?null:{parent:we._currentValue,pool:t}}var cn=Error(S(460)),Xd=Error(S(474)),Ho=Error(S(542)),uo={then:function(){}};function ep(t){return t=t.status,t==="fulfilled"||t==="rejected"}function jy(t,e,i){switch(i=t[i],i===void 0?t.push(e):i!==e&&(e.then(zi,zi),e=i),e.status){case"fulfilled":return e.value;case"rejected":throw t=e.reason,ip(t),t;default:if(typeof e.status=="string")e.then(zi,zi);else{if(t=re,t!==null&&100<t.shellSuspendCounter)throw Error(S(482));t=e,t.status="pending",t.then(function(a){if(e.status==="pending"){var l=e;l.status="fulfilled",l.value=a}},function(a){if(e.status==="pending"){var l=e;l.status="rejected",l.reason=a}})}switch(e.status){case"fulfilled":return e.value;case"rejected":throw t=e.reason,ip(t),t}throw Wa=e,cn}}function Ia(t){try{var e=t._init;return e(t._payload)}catch(i){throw i!==null&&typeof i=="object"&&typeof i.then=="function"?(Wa=i,cn):i}}var Wa=null;function tp(){if(Wa===null)throw Error(S(459));var t=Wa;return Wa=null,t}function ip(t){if(t===cn||t===Ho)throw Error(S(483))}var Zl=null,xs=0;function zr(t){var e=xs;return xs+=1,Zl===null&&(Zl=[]),jy(Zl,t,e)}function Zn(t,e){e=e.props.ref,t.ref=e!==void 0?e:null}function Pr(t,e){throw e.$$typeof===tx?Error(S(525)):(t=Object.prototype.toString.call(e),Error(S(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)))}function Vy(t){function e(h,c){if(t){var m=h.deletions;m===null?(h.deletions=[c],h.flags|=16):m.push(c)}}function i(h,c){if(!t)return null;for(;c!==null;)e(h,c),c=c.sibling;return null}function a(h){for(var c=new Map;h!==null;)h.key!==null?c.set(h.key,h):c.set(h.index,h),h=h.sibling;return c}function l(h,c){return h=_i(h,c),h.index=0,h.sibling=null,h}function n(h,c,m){return h.index=m,t?(m=h.alternate,m!==null?(m=m.index,m<c?(h.flags|=67108866,c):m):(h.flags|=67108866,c)):(h.flags|=1048576,c)}function s(h){return t&&h.alternate===null&&(h.flags|=67108866),h}function r(h,c,m,v){return c===null||c.tag!==6?(c=sc(m,h.mode,v),c.return=h,c):(c=l(c,m),c.return=h,c)}function o(h,c,m,v){var w=m.type;return w===zl?d(h,c,m.props.children,v,m.key):c!==null&&(c.elementType===w||typeof w=="object"&&w!==null&&w.$$typeof===sa&&Ia(w)===c.type)?(c=l(c,m.props),Zn(c,m),c.return=h,c):(c=qr(m.type,m.key,m.props,null,h.mode,v),Zn(c,m),c.return=h,c)}function u(h,c,m,v){return c===null||c.tag!==4||c.stateNode.containerInfo!==m.containerInfo||c.stateNode.implementation!==m.implementation?(c=rc(m,h.mode,v),c.return=h,c):(c=l(c,m.children||[]),c.return=h,c)}function d(h,c,m,v,w){return c===null||c.tag!==7?(c=Ka(m,h.mode,v,w),c.return=h,c):(c=l(c,m),c.return=h,c)}function p(h,c,m){if(typeof c=="string"&&c!==""||typeof c=="number"||typeof c=="bigint")return c=sc(""+c,h.mode,m),c.return=h,c;if(typeof c=="object"&&c!==null){switch(c.$$typeof){case xr:return m=qr(c.type,c.key,c.props,null,h.mode,m),Zn(m,c),m.return=h,m;case Jn:return c=rc(c,h.mode,m),c.return=h,c;case sa:return c=Ia(c),p(h,c,m)}if(Wn(c)||jn(c))return c=Ka(c,h.mode,m,null),c.return=h,c;if(typeof c.then=="function")return p(h,zr(c),m);if(c.$$typeof===Ai)return p(h,Ar(h,c),m);Pr(h,c)}return null}function f(h,c,m,v){var w=c!==null?c.key:null;if(typeof m=="string"&&m!==""||typeof m=="number"||typeof m=="bigint")return w!==null?null:r(h,c,""+m,v);if(typeof m=="object"&&m!==null){switch(m.$$typeof){case xr:return m.key===w?o(h,c,m,v):null;case Jn:return m.key===w?u(h,c,m,v):null;case sa:return m=Ia(m),f(h,c,m,v)}if(Wn(m)||jn(m))return w!==null?null:d(h,c,m,v,null);if(typeof m.then=="function")return f(h,c,zr(m),v);if(m.$$typeof===Ai)return f(h,c,Ar(h,m),v);Pr(h,m)}return null}function y(h,c,m,v,w){if(typeof v=="string"&&v!==""||typeof v=="number"||typeof v=="bigint")return h=h.get(m)||null,r(c,h,""+v,w);if(typeof v=="object"&&v!==null){switch(v.$$typeof){case xr:return h=h.get(v.key===null?m:v.key)||null,o(c,h,v,w);case Jn:return h=h.get(v.key===null?m:v.key)||null,u(c,h,v,w);case sa:return v=Ia(v),y(h,c,m,v,w)}if(Wn(v)||jn(v))return h=h.get(m)||null,d(c,h,v,w,null);if(typeof v.then=="function")return y(h,c,m,zr(v),w);if(v.$$typeof===Ai)return y(h,c,m,Ar(c,v),w);Pr(c,v)}return null}function G(h,c,m,v){for(var w=null,B=null,T=c,N=c=0,E=null;T!==null&&N<m.length;N++){T.index>N?(E=T,T=null):E=T.sibling;var P=f(h,T,m[N],v);if(P===null){T===null&&(T=E);break}t&&T&&P.alternate===null&&e(h,T),c=n(P,c,N),B===null?w=P:B.sibling=P,B=P,T=E}if(N===m.length)return i(h,T),Q&&wi(h,N),w;if(T===null){for(;N<m.length;N++)T=p(h,m[N],v),T!==null&&(c=n(T,c,N),B===null?w=T:B.sibling=T,B=T);return Q&&wi(h,N),w}for(T=a(T);N<m.length;N++)E=y(T,h,N,m[N],v),E!==null&&(t&&E.alternate!==null&&T.delete(E.key===null?N:E.key),c=n(E,c,N),B===null?w=E:B.sibling=E,B=E);return t&&T.forEach(function(be){return e(h,be)}),Q&&wi(h,N),w}function C(h,c,m,v){if(m==null)throw Error(S(151));for(var w=null,B=null,T=c,N=c=0,E=null,P=m.next();T!==null&&!P.done;N++,P=m.next()){T.index>N?(E=T,T=null):E=T.sibling;var be=f(h,T,P.value,v);if(be===null){T===null&&(T=E);break}t&&T&&be.alternate===null&&e(h,T),c=n(be,c,N),B===null?w=be:B.sibling=be,B=be,T=E}if(P.done)return i(h,T),Q&&wi(h,N),w;if(T===null){for(;!P.done;N++,P=m.next())P=p(h,P.value,v),P!==null&&(c=n(P,c,N),B===null?w=P:B.sibling=P,B=P);return Q&&wi(h,N),w}for(T=a(T);!P.done;N++,P=m.next())P=y(T,h,N,P.value,v),P!==null&&(t&&P.alternate!==null&&T.delete(P.key===null?N:P.key),c=n(P,c,N),B===null?w=P:B.sibling=P,B=P);return t&&T.forEach(function(Mi){return e(h,Mi)}),Q&&wi(h,N),w}function O(h,c,m,v){if(typeof m=="object"&&m!==null&&m.type===zl&&m.key===null&&(m=m.props.children),typeof m=="object"&&m!==null){switch(m.$$typeof){case xr:e:{for(var w=m.key;c!==null;){if(c.key===w){if(w=m.type,w===zl){if(c.tag===7){i(h,c.sibling),v=l(c,m.props.children),v.return=h,h=v;break e}}else if(c.elementType===w||typeof w=="object"&&w!==null&&w.$$typeof===sa&&Ia(w)===c.type){i(h,c.sibling),v=l(c,m.props),Zn(v,m),v.return=h,h=v;break e}i(h,c);break}else e(h,c);c=c.sibling}m.type===zl?(v=Ka(m.props.children,h.mode,v,m.key),v.return=h,h=v):(v=qr(m.type,m.key,m.props,null,h.mode,v),Zn(v,m),v.return=h,h=v)}return s(h);case Jn:e:{for(w=m.key;c!==null;){if(c.key===w)if(c.tag===4&&c.stateNode.containerInfo===m.containerInfo&&c.stateNode.implementation===m.implementation){i(h,c.sibling),v=l(c,m.children||[]),v.return=h,h=v;break e}else{i(h,c);break}else e(h,c);c=c.sibling}v=rc(m,h.mode,v),v.return=h,h=v}return s(h);case sa:return m=Ia(m),O(h,c,m,v)}if(Wn(m))return G(h,c,m,v);if(jn(m)){if(w=jn(m),typeof w!="function")throw Error(S(150));return m=w.call(m),C(h,c,m,v)}if(typeof m.then=="function")return O(h,c,zr(m),v);if(m.$$typeof===Ai)return O(h,c,Ar(h,m),v);Pr(h,m)}return typeof m=="string"&&m!==""||typeof m=="number"||typeof m=="bigint"?(m=""+m,c!==null&&c.tag===6?(i(h,c.sibling),v=l(c,m),v.return=h,h=v):(i(h,c),v=sc(m,h.mode,v),v.return=h,h=v),s(h)):i(h,c)}return function(h,c,m,v){try{xs=0;var w=O(h,c,m,v);return Zl=null,w}catch(T){if(T===cn||T===Ho)throw T;var B=ft(29,T,null,h.mode);return B.lanes=v,B.return=h,B}}}var il=Vy(!0),Zy=Vy(!1),ra=!1;function qd(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Kc(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,callbacks:null})}function ba(t){return{lane:t,tag:0,payload:null,callback:null,next:null}}function Ma(t,e,i){var a=t.updateQueue;if(a===null)return null;if(a=a.shared,(ee&2)!==0){var l=a.pending;return l===null?e.next=e:(e.next=l.next,l.next=e),a.pending=e,e=so(t),Ly(t,null,i),e}return Oo(t,a,e,i),so(t)}function ss(t,e,i){if(e=e.updateQueue,e!==null&&(e=e.shared,(i&4194048)!==0)){var a=e.lanes;a&=t.pendingLanes,i|=a,e.lanes=i,cy(t,i)}}function uc(t,e){var i=t.updateQueue,a=t.alternate;if(a!==null&&(a=a.updateQueue,i===a)){var l=null,n=null;if(i=i.firstBaseUpdate,i!==null){do{var s={lane:i.lane,tag:i.tag,payload:i.payload,callback:null,next:null};n===null?l=n=s:n=n.next=s,i=i.next}while(i!==null);n===null?l=n=e:n=n.next=e}else l=n=e;i={baseState:a.baseState,firstBaseUpdate:l,lastBaseUpdate:n,shared:a.shared,callbacks:a.callbacks},t.updateQueue=i;return}t=i.lastBaseUpdate,t===null?i.firstBaseUpdate=e:t.next=e,i.lastBaseUpdate=e}var Jc=!1;function rs(){if(Jc){var t=Vl;if(t!==null)throw t}}function os(t,e,i,a){Jc=!1;var l=t.updateQueue;ra=!1;var n=l.firstBaseUpdate,s=l.lastBaseUpdate,r=l.shared.pending;if(r!==null){l.shared.pending=null;var o=r,u=o.next;o.next=null,s===null?n=u:s.next=u,s=o;var d=t.alternate;d!==null&&(d=d.updateQueue,r=d.lastBaseUpdate,r!==s&&(r===null?d.firstBaseUpdate=u:r.next=u,d.lastBaseUpdate=o))}if(n!==null){var p=l.baseState;s=0,d=u=o=null,r=n;do{var f=r.lane&-536870913,y=f!==r.lane;if(y?(j&f)===f:(a&f)===f){f!==0&&f===Wl&&(Jc=!0),d!==null&&(d=d.next={lane:0,tag:r.tag,payload:r.payload,callback:null,next:null});e:{var G=t,C=r;f=e;var O=i;switch(C.tag){case 1:if(G=C.payload,typeof G=="function"){p=G.call(O,p,f);break e}p=G;break e;case 3:G.flags=G.flags&-65537|128;case 0:if(G=C.payload,f=typeof G=="function"?G.call(O,p,f):G,f==null)break e;p=he({},p,f);break e;case 2:ra=!0}}f=r.callback,f!==null&&(t.flags|=64,y&&(t.flags|=8192),y=l.callbacks,y===null?l.callbacks=[f]:y.push(f))}else y={lane:f,tag:r.tag,payload:r.payload,callback:r.callback,next:null},d===null?(u=d=y,o=p):d=d.next=y,s|=f;if(r=r.next,r===null){if(r=l.shared.pending,r===null)break;y=r,r=y.next,y.next=null,l.lastBaseUpdate=y,l.shared.pending=null}}while(!0);d===null&&(o=p),l.baseState=o,l.firstBaseUpdate=u,l.lastBaseUpdate=d,n===null&&(l.shared.lanes=0),Aa|=s,t.lanes=s,t.memoizedState=p}}function Iy(t,e){if(typeof t!="function")throw Error(S(191,t));t.call(e)}function Qy(t,e){var i=t.callbacks;if(i!==null)for(t.callbacks=null,t=0;t<i.length;t++)Iy(i[t],e)}var $l=ni(null),co=ni(0);function ap(t,e){t=Ui,ue(co,t),ue($l,e),Ui=t|e.baseLanes}function Wc(){ue(co,Ui),ue($l,$l.current)}function jd(){Ui=co.current,Be($l),Be(co)}var bt=ni(null),Lt=null;function ua(t){var e=t.alternate;ue(Se,Se.current&1),ue(bt,t),Lt===null&&(e===null||$l.current!==null||e.memoizedState!==null)&&(Lt=t)}function $c(t){ue(Se,Se.current),ue(bt,t),Lt===null&&(Lt=t)}function ky(t){t.tag===22?(ue(Se,Se.current),ue(bt,t),Lt===null&&(Lt=t)):ca(t)}function ca(){ue(Se,Se.current),ue(bt,bt.current)}function dt(t){Be(bt),Lt===t&&(Lt=null),Be(Se)}var Se=ni(0);function fo(t){for(var e=t;e!==null;){if(e.tag===13){var i=e.memoizedState;if(i!==null&&(i=i.dehydrated,i===null||vd(i)||bd(i)))return e}else if(e.tag===19&&(e.memoizedProps.revealOrder==="forwards"||e.memoizedProps.revealOrder==="backwards"||e.memoizedProps.revealOrder==="unstable_legacy-backwards"||e.memoizedProps.revealOrder==="together")){if((e.flags&128)!==0)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var Hi=0,U=null,se=null,Ce=null,ho=!1,Il=!1,al=!1,mo=0,Ss=0,Ql=null,yS=0;function Me(){throw Error(S(321))}function Vd(t,e){if(e===null)return!1;for(var i=0;i<e.length&&i<t.length;i++)if(!vt(t[i],e[i]))return!1;return!0}function Zd(t,e,i,a,l,n){return Hi=n,U=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,_.H=t===null||t.memoizedState===null?Tg:lf,al=!1,n=i(a,l),al=!1,Il&&(n=Jy(e,i,a,l)),Ky(t),n}function Ky(t){_.H=Es;var e=se!==null&&se.next!==null;if(Hi=0,Ce=se=U=null,ho=!1,Ss=0,Ql=null,e)throw Error(S(300));t===null||Re||(t=t.dependencies,t!==null&&oo(t)&&(Re=!0))}function Jy(t,e,i,a){U=t;var l=0;do{if(Il&&(Ql=null),Ss=0,Il=!1,25<=l)throw Error(S(301));if(l+=1,Ce=se=null,t.updateQueue!=null){var n=t.updateQueue;n.lastEffect=null,n.events=null,n.stores=null,n.memoCache!=null&&(n.memoCache.index=0)}_.H=wg,n=e(i,a)}while(Il);return n}function gS(){var t=_.H,e=t.useState()[0];return e=typeof e.then=="function"?Hs(e):e,t=t.useState()[0],(se!==null?se.memoizedState:null)!==t&&(U.flags|=1024),e}function Id(){var t=mo!==0;return mo=0,t}function Qd(t,e,i){e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~i}function kd(t){if(ho){for(t=t.memoizedState;t!==null;){var e=t.queue;e!==null&&(e.pending=null),t=t.next}ho=!1}Hi=0,Ce=se=U=null,Il=!1,Ss=mo=0,Ql=null}function Je(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Ce===null?U.memoizedState=Ce=t:Ce=Ce.next=t,Ce}function Ee(){if(se===null){var t=U.alternate;t=t!==null?t.memoizedState:null}else t=se.next;var e=Ce===null?U.memoizedState:Ce.next;if(e!==null)Ce=e,se=t;else{if(t===null)throw U.alternate===null?Error(S(467)):Error(S(310));se=t,t={memoizedState:se.memoizedState,baseState:se.baseState,baseQueue:se.baseQueue,queue:se.queue,next:null},Ce===null?U.memoizedState=Ce=t:Ce=Ce.next=t}return Ce}function Lo(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Hs(t){var e=Ss;return Ss+=1,Ql===null&&(Ql=[]),t=jy(Ql,t,e),e=U,(Ce===null?e.memoizedState:Ce.next)===null&&(e=e.alternate,_.H=e===null||e.memoizedState===null?Tg:lf),t}function Bo(t){if(t!==null&&typeof t=="object"){if(typeof t.then=="function")return Hs(t);if(t.$$typeof===Ai)return qe(t)}throw Error(S(438,String(t)))}function Kd(t){var e=null,i=U.updateQueue;if(i!==null&&(e=i.memoCache),e==null){var a=U.alternate;a!==null&&(a=a.updateQueue,a!==null&&(a=a.memoCache,a!=null&&(e={data:a.data.map(function(l){return l.slice()}),index:0})))}if(e==null&&(e={data:[],index:0}),i===null&&(i=Lo(),U.updateQueue=i),i.memoCache=e,i=e.data[e.index],i===void 0)for(i=e.data[e.index]=Array(t),a=0;a<t;a++)i[a]=ix;return e.index++,i}function Li(t,e){return typeof e=="function"?e(t):e}function Vr(t){var e=Ee();return Jd(e,se,t)}function Jd(t,e,i){var a=t.queue;if(a===null)throw Error(S(311));a.lastRenderedReducer=i;var l=t.baseQueue,n=a.pending;if(n!==null){if(l!==null){var s=l.next;l.next=n.next,n.next=s}e.baseQueue=l=n,a.pending=null}if(n=t.baseState,l===null)t.memoizedState=n;else{e=l.next;var r=s=null,o=null,u=e,d=!1;do{var p=u.lane&-536870913;if(p!==u.lane?(j&p)===p:(Hi&p)===p){var f=u.revertLane;if(f===0)o!==null&&(o=o.next={lane:0,revertLane:0,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),p===Wl&&(d=!0);else if((Hi&f)===f){u=u.next,f===Wl&&(d=!0);continue}else p={lane:0,revertLane:u.revertLane,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},o===null?(r=o=p,s=n):o=o.next=p,U.lanes|=f,Aa|=f;p=u.action,al&&i(n,p),n=u.hasEagerState?u.eagerState:i(n,p)}else f={lane:p,revertLane:u.revertLane,gesture:u.gesture,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},o===null?(r=o=f,s=n):o=o.next=f,U.lanes|=p,Aa|=p;u=u.next}while(u!==null&&u!==e);if(o===null?s=n:o.next=r,!vt(n,t.memoizedState)&&(Re=!0,d&&(i=Vl,i!==null)))throw i;t.memoizedState=n,t.baseState=s,t.baseQueue=o,a.lastRenderedState=n}return l===null&&(a.lanes=0),[t.memoizedState,a.dispatch]}function cc(t){var e=Ee(),i=e.queue;if(i===null)throw Error(S(311));i.lastRenderedReducer=t;var a=i.dispatch,l=i.pending,n=e.memoizedState;if(l!==null){i.pending=null;var s=l=l.next;do n=t(n,s.action),s=s.next;while(s!==l);vt(n,e.memoizedState)||(Re=!0),e.memoizedState=n,e.baseQueue===null&&(e.baseState=n),i.lastRenderedState=n}return[n,a]}function Wy(t,e,i){var a=U,l=Ee(),n=Q;if(n){if(i===void 0)throw Error(S(407));i=i()}else i=e();var s=!vt((se||l).memoizedState,i);if(s&&(l.memoizedState=i,Re=!0),l=l.queue,Wd(tg.bind(null,a,l,t),[t]),l.getSnapshot!==e||s||Ce!==null&&Ce.memoizedState.tag&1){if(a.flags|=2048,en(9,{destroy:void 0},eg.bind(null,a,l,i,e),null),re===null)throw Error(S(349));n||(Hi&127)!==0||$y(a,e,i)}return i}function $y(t,e,i){t.flags|=16384,t={getSnapshot:e,value:i},e=U.updateQueue,e===null?(e=Lo(),U.updateQueue=e,e.stores=[t]):(i=e.stores,i===null?e.stores=[t]:i.push(t))}function eg(t,e,i,a){e.value=i,e.getSnapshot=a,ig(e)&&ag(t)}function tg(t,e,i){return i(function(){ig(e)&&ag(t)})}function ig(t){var e=t.getSnapshot;t=t.value;try{var i=e();return!vt(t,i)}catch{return!0}}function ag(t){var e=ol(t,2);e!==null&&it(e,t,2)}function ed(t){var e=Je();if(typeof t=="function"){var i=t;if(t=i(),al){fa(!0);try{i()}finally{fa(!1)}}}return e.memoizedState=e.baseState=t,e.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Li,lastRenderedState:t},e}function lg(t,e,i,a){return t.baseState=i,Jd(t,se,typeof a=="function"?a:Li)}function vS(t,e,i,a,l){if(Yo(t))throw Error(S(485));if(t=e.action,t!==null){var n={payload:l,action:t,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(s){n.listeners.push(s)}};_.T!==null?i(!0):n.isTransition=!1,a(n),i=e.pending,i===null?(n.next=e.pending=n,ng(e,n)):(n.next=i.next,e.pending=i.next=n)}}function ng(t,e){var i=e.action,a=e.payload,l=t.state;if(e.isTransition){var n=_.T,s={};_.T=s;try{var r=i(l,a),o=_.S;o!==null&&o(s,r),lp(t,e,r)}catch(u){td(t,e,u)}finally{n!==null&&s.types!==null&&(n.types=s.types),_.T=n}}else try{n=i(l,a),lp(t,e,n)}catch(u){td(t,e,u)}}function lp(t,e,i){i!==null&&typeof i=="object"&&typeof i.then=="function"?i.then(function(a){np(t,e,a)},function(a){return td(t,e,a)}):np(t,e,i)}function np(t,e,i){e.status="fulfilled",e.value=i,sg(e),t.state=i,e=t.pending,e!==null&&(i=e.next,i===e?t.pending=null:(i=i.next,e.next=i,ng(t,i)))}function td(t,e,i){var a=t.pending;if(t.pending=null,a!==null){a=a.next;do e.status="rejected",e.reason=i,sg(e),e=e.next;while(e!==a)}t.action=null}function sg(t){t=t.listeners;for(var e=0;e<t.length;e++)(0,t[e])()}function rg(t,e){return e}function sp(t,e){if(Q){var i=re.formState;if(i!==null){e:{var a=U;if(Q){if(fe){t:{for(var l=fe,n=Ht;l.nodeType!==8;){if(!n){l=null;break t}if(l=Bt(l.nextSibling),l===null){l=null;break t}}n=l.data,l=n==="F!"||n==="F"?l:null}if(l){fe=Bt(l.nextSibling),a=l.data==="F!";break e}}wa(a)}a=!1}a&&(e=i[0])}}return i=Je(),i.memoizedState=i.baseState=e,a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:rg,lastRenderedState:e},i.queue=a,i=Eg.bind(null,U,a),a.dispatch=i,a=ed(!1),n=af.bind(null,U,!1,a.queue),a=Je(),l={state:e,dispatch:null,action:t,pending:null},a.queue=l,i=vS.bind(null,U,l,n,i),l.dispatch=i,a.memoizedState=t,[e,i,!1]}function rp(t){var e=Ee();return og(e,se,t)}function og(t,e,i){if(e=Jd(t,e,rg)[0],t=Vr(Li)[0],typeof e=="object"&&e!==null&&typeof e.then=="function")try{var a=Hs(e)}catch(s){throw s===cn?Ho:s}else a=e;e=Ee();var l=e.queue,n=l.dispatch;return i!==e.memoizedState&&(U.flags|=2048,en(9,{destroy:void 0},bS.bind(null,l,i),null)),[a,n,t]}function bS(t,e){t.action=e}function op(t){var e=Ee(),i=se;if(i!==null)return og(e,i,t);Ee(),e=e.memoizedState,i=Ee();var a=i.queue.dispatch;return i.memoizedState=t,[e,a,!1]}function en(t,e,i,a){return t={tag:t,create:i,deps:a,inst:e,next:null},e=U.updateQueue,e===null&&(e=Lo(),U.updateQueue=e),i=e.lastEffect,i===null?e.lastEffect=t.next=t:(a=i.next,i.next=t,t.next=a,e.lastEffect=t),t}function ug(){return Ee().memoizedState}function Zr(t,e,i,a){var l=Je();U.flags|=t,l.memoizedState=en(1|e,{destroy:void 0},i,a===void 0?null:a)}function Uo(t,e,i,a){var l=Ee();a=a===void 0?null:a;var n=l.memoizedState.inst;se!==null&&a!==null&&Vd(a,se.memoizedState.deps)?l.memoizedState=en(e,n,i,a):(U.flags|=t,l.memoizedState=en(1|e,n,i,a))}function up(t,e){Zr(8390656,8,t,e)}function Wd(t,e){Uo(2048,8,t,e)}function MS(t){U.flags|=4;var e=U.updateQueue;if(e===null)e=Lo(),U.updateQueue=e,e.events=[t];else{var i=e.events;i===null?e.events=[t]:i.push(t)}}function cg(t){var e=Ee().memoizedState;return MS({ref:e,nextImpl:t}),function(){if((ee&2)!==0)throw Error(S(440));return e.impl.apply(void 0,arguments)}}function dg(t,e){return Uo(4,2,t,e)}function fg(t,e){return Uo(4,4,t,e)}function hg(t,e){if(typeof e=="function"){t=t();var i=e(t);return function(){typeof i=="function"?i():e(null)}}if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function mg(t,e,i){i=i!=null?i.concat([t]):null,Uo(4,4,hg.bind(null,e,t),i)}function $d(){}function pg(t,e){var i=Ee();e=e===void 0?null:e;var a=i.memoizedState;return e!==null&&Vd(e,a[1])?a[0]:(i.memoizedState=[t,e],t)}function yg(t,e){var i=Ee();e=e===void 0?null:e;var a=i.memoizedState;if(e!==null&&Vd(e,a[1]))return a[0];if(a=t(),al){fa(!0);try{t()}finally{fa(!1)}}return i.memoizedState=[a,e],a}function ef(t,e,i){return i===void 0||(Hi&1073741824)!==0&&(j&261930)===0?t.memoizedState=e:(t.memoizedState=i,t=l0(),U.lanes|=t,Aa|=t,i)}function gg(t,e,i,a){return vt(i,e)?i:$l.current!==null?(t=ef(t,i,a),vt(t,e)||(Re=!0),t):(Hi&42)===0||(Hi&1073741824)!==0&&(j&261930)===0?(Re=!0,t.memoizedState=i):(t=l0(),U.lanes|=t,Aa|=t,e)}function vg(t,e,i,a,l){var n=te.p;te.p=n!==0&&8>n?n:8;var s=_.T,r={};_.T=r,af(t,!1,e,i);try{var o=l(),u=_.S;if(u!==null&&u(r,o),o!==null&&typeof o=="object"&&typeof o.then=="function"){var d=pS(o,a);us(t,e,d,gt(t))}else us(t,e,a,gt(t))}catch(p){us(t,e,{then:function(){},status:"rejected",reason:p},gt())}finally{te.p=n,s!==null&&r.types!==null&&(s.types=r.types),_.T=s}}function xS(){}function id(t,e,i,a){if(t.tag!==5)throw Error(S(476));var l=bg(t).queue;vg(t,l,e,ka,i===null?xS:function(){return Mg(t),i(a)})}function bg(t){var e=t.memoizedState;if(e!==null)return e;e={memoizedState:ka,baseState:ka,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Li,lastRenderedState:ka},next:null};var i={};return e.next={memoizedState:i,baseState:i,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Li,lastRenderedState:i},next:null},t.memoizedState=e,t=t.alternate,t!==null&&(t.memoizedState=e),e}function Mg(t){var e=bg(t);e.next===null&&(e=t.alternate.memoizedState),us(t,e.next.queue,{},gt())}function tf(){return qe(Ts)}function xg(){return Ee().memoizedState}function Sg(){return Ee().memoizedState}function SS(t){for(var e=t.return;e!==null;){switch(e.tag){case 24:case 3:var i=gt();t=ba(i);var a=Ma(e,t,i);a!==null&&(it(a,e,i),ss(a,e,i)),e={cache:Yd()},t.payload=e;return}e=e.return}}function ES(t,e,i){var a=gt();i={lane:a,revertLane:0,gesture:null,action:i,hasEagerState:!1,eagerState:null,next:null},Yo(t)?Gg(e,i):(i=Hd(t,e,i,a),i!==null&&(it(i,t,a),Cg(i,e,a)))}function Eg(t,e,i){var a=gt();us(t,e,i,a)}function us(t,e,i,a){var l={lane:a,revertLane:0,gesture:null,action:i,hasEagerState:!1,eagerState:null,next:null};if(Yo(t))Gg(e,l);else{var n=t.alternate;if(t.lanes===0&&(n===null||n.lanes===0)&&(n=e.lastRenderedReducer,n!==null))try{var s=e.lastRenderedState,r=n(s,i);if(l.hasEagerState=!0,l.eagerState=r,vt(r,s))return Oo(t,e,l,0),re===null&&Do(),!1}catch{}if(i=Hd(t,e,l,a),i!==null)return it(i,t,a),Cg(i,e,a),!0}return!1}function af(t,e,i,a){if(a={lane:2,revertLane:ff(),gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null},Yo(t)){if(e)throw Error(S(479))}else e=Hd(t,i,a,2),e!==null&&it(e,t,2)}function Yo(t){var e=t.alternate;return t===U||e!==null&&e===U}function Gg(t,e){Il=ho=!0;var i=t.pending;i===null?e.next=e:(e.next=i.next,i.next=e),t.pending=e}function Cg(t,e,i){if((i&4194048)!==0){var a=e.lanes;a&=t.pendingLanes,i|=a,e.lanes=i,cy(t,i)}}var Es={readContext:qe,use:Bo,useCallback:Me,useContext:Me,useEffect:Me,useImperativeHandle:Me,useLayoutEffect:Me,useInsertionEffect:Me,useMemo:Me,useReducer:Me,useRef:Me,useState:Me,useDebugValue:Me,useDeferredValue:Me,useTransition:Me,useSyncExternalStore:Me,useId:Me,useHostTransitionStatus:Me,useFormState:Me,useActionState:Me,useOptimistic:Me,useMemoCache:Me,useCacheRefresh:Me};Es.useEffectEvent=Me;var Tg={readContext:qe,use:Bo,useCallback:function(t,e){return Je().memoizedState=[t,e===void 0?null:e],t},useContext:qe,useEffect:up,useImperativeHandle:function(t,e,i){i=i!=null?i.concat([t]):null,Zr(4194308,4,hg.bind(null,e,t),i)},useLayoutEffect:function(t,e){return Zr(4194308,4,t,e)},useInsertionEffect:function(t,e){Zr(4,2,t,e)},useMemo:function(t,e){var i=Je();e=e===void 0?null:e;var a=t();if(al){fa(!0);try{t()}finally{fa(!1)}}return i.memoizedState=[a,e],a},useReducer:function(t,e,i){var a=Je();if(i!==void 0){var l=i(e);if(al){fa(!0);try{i(e)}finally{fa(!1)}}}else l=e;return a.memoizedState=a.baseState=l,t={pending:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:l},a.queue=t,t=t.dispatch=ES.bind(null,U,t),[a.memoizedState,t]},useRef:function(t){var e=Je();return t={current:t},e.memoizedState=t},useState:function(t){t=ed(t);var e=t.queue,i=Eg.bind(null,U,e);return e.dispatch=i,[t.memoizedState,i]},useDebugValue:$d,useDeferredValue:function(t,e){var i=Je();return ef(i,t,e)},useTransition:function(){var t=ed(!1);return t=vg.bind(null,U,t.queue,!0,!1),Je().memoizedState=t,[!1,t]},useSyncExternalStore:function(t,e,i){var a=U,l=Je();if(Q){if(i===void 0)throw Error(S(407));i=i()}else{if(i=e(),re===null)throw Error(S(349));(j&127)!==0||$y(a,e,i)}l.memoizedState=i;var n={value:i,getSnapshot:e};return l.queue=n,up(tg.bind(null,a,n,t),[t]),a.flags|=2048,en(9,{destroy:void 0},eg.bind(null,a,n,i,e),null),i},useId:function(){var t=Je(),e=re.identifierPrefix;if(Q){var i=ii,a=ti;i=(a&~(1<<32-yt(a)-1)).toString(32)+i,e="_"+e+"R_"+i,i=mo++,0<i&&(e+="H"+i.toString(32)),e+="_"}else i=yS++,e="_"+e+"r_"+i.toString(32)+"_";return t.memoizedState=e},useHostTransitionStatus:tf,useFormState:sp,useActionState:sp,useOptimistic:function(t){var e=Je();e.memoizedState=e.baseState=t;var i={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return e.queue=i,e=af.bind(null,U,!0,i),i.dispatch=e,[t,e]},useMemoCache:Kd,useCacheRefresh:function(){return Je().memoizedState=SS.bind(null,U)},useEffectEvent:function(t){var e=Je(),i={impl:t};return e.memoizedState=i,function(){if((ee&2)!==0)throw Error(S(440));return i.impl.apply(void 0,arguments)}}},lf={readContext:qe,use:Bo,useCallback:pg,useContext:qe,useEffect:Wd,useImperativeHandle:mg,useInsertionEffect:dg,useLayoutEffect:fg,useMemo:yg,useReducer:Vr,useRef:ug,useState:function(){return Vr(Li)},useDebugValue:$d,useDeferredValue:function(t,e){var i=Ee();return gg(i,se.memoizedState,t,e)},useTransition:function(){var t=Vr(Li)[0],e=Ee().memoizedState;return[typeof t=="boolean"?t:Hs(t),e]},useSyncExternalStore:Wy,useId:xg,useHostTransitionStatus:tf,useFormState:rp,useActionState:rp,useOptimistic:function(t,e){var i=Ee();return lg(i,se,t,e)},useMemoCache:Kd,useCacheRefresh:Sg};lf.useEffectEvent=cg;var wg={readContext:qe,use:Bo,useCallback:pg,useContext:qe,useEffect:Wd,useImperativeHandle:mg,useInsertionEffect:dg,useLayoutEffect:fg,useMemo:yg,useReducer:cc,useRef:ug,useState:function(){return cc(Li)},useDebugValue:$d,useDeferredValue:function(t,e){var i=Ee();return se===null?ef(i,t,e):gg(i,se.memoizedState,t,e)},useTransition:function(){var t=cc(Li)[0],e=Ee().memoizedState;return[typeof t=="boolean"?t:Hs(t),e]},useSyncExternalStore:Wy,useId:xg,useHostTransitionStatus:tf,useFormState:op,useActionState:op,useOptimistic:function(t,e){var i=Ee();return se!==null?lg(i,se,t,e):(i.baseState=t,[t,i.queue.dispatch])},useMemoCache:Kd,useCacheRefresh:Sg};wg.useEffectEvent=cg;function dc(t,e,i,a){e=t.memoizedState,i=i(a,e),i=i==null?e:he({},e,i),t.memoizedState=i,t.lanes===0&&(t.updateQueue.baseState=i)}var ad={enqueueSetState:function(t,e,i){t=t._reactInternals;var a=gt(),l=ba(a);l.payload=e,i!=null&&(l.callback=i),e=Ma(t,l,a),e!==null&&(it(e,t,a),ss(e,t,a))},enqueueReplaceState:function(t,e,i){t=t._reactInternals;var a=gt(),l=ba(a);l.tag=1,l.payload=e,i!=null&&(l.callback=i),e=Ma(t,l,a),e!==null&&(it(e,t,a),ss(e,t,a))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var i=gt(),a=ba(i);a.tag=2,e!=null&&(a.callback=e),e=Ma(t,a,i),e!==null&&(it(e,t,i),ss(e,t,i))}};function cp(t,e,i,a,l,n,s){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(a,n,s):e.prototype&&e.prototype.isPureReactComponent?!vs(i,a)||!vs(l,n):!0}function dp(t,e,i,a){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(i,a),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(i,a),e.state!==t&&ad.enqueueReplaceState(e,e.state,null)}function ll(t,e){var i=e;if("ref"in e){i={};for(var a in e)a!=="ref"&&(i[a]=e[a])}if(t=t.defaultProps){i===e&&(i=he({},i));for(var l in t)i[l]===void 0&&(i[l]=t[l])}return i}function Rg(t){no(t)}function Ag(t){console.error(t)}function zg(t){no(t)}function po(t,e){try{var i=t.onUncaughtError;i(e.value,{componentStack:e.stack})}catch(a){setTimeout(function(){throw a})}}function fp(t,e,i){try{var a=t.onCaughtError;a(i.value,{componentStack:i.stack,errorBoundary:e.tag===1?e.stateNode:null})}catch(l){setTimeout(function(){throw l})}}function ld(t,e,i){return i=ba(i),i.tag=3,i.payload={element:null},i.callback=function(){po(t,e)},i}function Pg(t){return t=ba(t),t.tag=3,t}function _g(t,e,i,a){var l=i.type.getDerivedStateFromError;if(typeof l=="function"){var n=a.value;t.payload=function(){return l(n)},t.callback=function(){fp(e,i,a)}}var s=i.stateNode;s!==null&&typeof s.componentDidCatch=="function"&&(t.callback=function(){fp(e,i,a),typeof l!="function"&&(xa===null?xa=new Set([this]):xa.add(this));var r=a.stack;this.componentDidCatch(a.value,{componentStack:r!==null?r:""})})}function GS(t,e,i,a,l){if(i.flags|=32768,a!==null&&typeof a=="object"&&typeof a.then=="function"){if(e=i.alternate,e!==null&&un(e,i,l,!0),i=bt.current,i!==null){switch(i.tag){case 31:case 13:return Lt===null?Mo():i.alternate===null&&xe===0&&(xe=3),i.flags&=-257,i.flags|=65536,i.lanes=l,a===uo?i.flags|=16384:(e=i.updateQueue,e===null?i.updateQueue=new Set([a]):e.add(a),Sc(t,a,l)),!1;case 22:return i.flags|=65536,a===uo?i.flags|=16384:(e=i.updateQueue,e===null?(e={transitions:null,markerInstances:null,retryQueue:new Set([a])},i.updateQueue=e):(i=e.retryQueue,i===null?e.retryQueue=new Set([a]):i.add(a)),Sc(t,a,l)),!1}throw Error(S(435,i.tag))}return Sc(t,a,l),Mo(),!1}if(Q)return e=bt.current,e!==null?((e.flags&65536)===0&&(e.flags|=256),e.flags|=65536,e.lanes=l,a!==Vc&&(t=Error(S(422),{cause:a}),Ms(Ot(t,i)))):(a!==Vc&&(e=Error(S(423),{cause:a}),Ms(Ot(e,i))),t=t.current.alternate,t.flags|=65536,l&=-l,t.lanes|=l,a=Ot(a,i),l=ld(t.stateNode,a,l),uc(t,l),xe!==4&&(xe=2)),!1;var n=Error(S(520),{cause:a});if(n=Ot(n,i),fs===null?fs=[n]:fs.push(n),xe!==4&&(xe=2),e===null)return!0;a=Ot(a,i),i=e;do{switch(i.tag){case 3:return i.flags|=65536,t=l&-l,i.lanes|=t,t=ld(i.stateNode,a,t),uc(i,t),!1;case 1:if(e=i.type,n=i.stateNode,(i.flags&128)===0&&(typeof e.getDerivedStateFromError=="function"||n!==null&&typeof n.componentDidCatch=="function"&&(xa===null||!xa.has(n))))return i.flags|=65536,l&=-l,i.lanes|=l,l=Pg(l),_g(l,t,i,a),uc(i,l),!1}i=i.return}while(i!==null);return!1}var nf=Error(S(461)),Re=!1;function Ye(t,e,i,a){e.child=t===null?Zy(e,null,i,a):il(e,t.child,i,a)}function hp(t,e,i,a,l){i=i.render;var n=e.ref;if("ref"in a){var s={};for(var r in a)r!=="ref"&&(s[r]=a[r])}else s=a;return tl(e),a=Zd(t,e,i,s,n,l),r=Id(),t!==null&&!Re?(Qd(t,e,l),Bi(t,e,l)):(Q&&r&&Bd(e),e.flags|=1,Ye(t,e,a,l),e.child)}function mp(t,e,i,a,l){if(t===null){var n=i.type;return typeof n=="function"&&!Ld(n)&&n.defaultProps===void 0&&i.compare===null?(e.tag=15,e.type=n,Ng(t,e,n,a,l)):(t=qr(i.type,null,a,e,e.mode,l),t.ref=e.ref,t.return=e,e.child=t)}if(n=t.child,!sf(t,l)){var s=n.memoizedProps;if(i=i.compare,i=i!==null?i:vs,i(s,a)&&t.ref===e.ref)return Bi(t,e,l)}return e.flags|=1,t=_i(n,a),t.ref=e.ref,t.return=e,e.child=t}function Ng(t,e,i,a,l){if(t!==null){var n=t.memoizedProps;if(vs(n,a)&&t.ref===e.ref)if(Re=!1,e.pendingProps=a=n,sf(t,l))(t.flags&131072)!==0&&(Re=!0);else return e.lanes=t.lanes,Bi(t,e,l)}return nd(t,e,i,a,l)}function Dg(t,e,i,a){var l=a.children,n=t!==null?t.memoizedState:null;if(t===null&&e.stateNode===null&&(e.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),a.mode==="hidden"){if((e.flags&128)!==0){if(n=n!==null?n.baseLanes|i:i,t!==null){for(a=e.child=t.child,l=0;a!==null;)l=l|a.lanes|a.childLanes,a=a.sibling;a=l&~n}else a=0,e.child=null;return pp(t,e,n,i,a)}if((i&536870912)!==0)e.memoizedState={baseLanes:0,cachePool:null},t!==null&&jr(e,n!==null?n.cachePool:null),n!==null?ap(e,n):Wc(),ky(e);else return a=e.lanes=536870912,pp(t,e,n!==null?n.baseLanes|i:i,i,a)}else n!==null?(jr(e,n.cachePool),ap(e,n),ca(e),e.memoizedState=null):(t!==null&&jr(e,null),Wc(),ca(e));return Ye(t,e,l,i),e.child}function es(t,e){return t!==null&&t.tag===22||e.stateNode!==null||(e.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),e.sibling}function pp(t,e,i,a,l){var n=Fd();return n=n===null?null:{parent:we._currentValue,pool:n},e.memoizedState={baseLanes:i,cachePool:n},t!==null&&jr(e,null),Wc(),ky(e),t!==null&&un(t,e,a,!0),e.childLanes=l,null}function Ir(t,e){return e=yo({mode:e.mode,children:e.children},t.mode),e.ref=t.ref,t.child=e,e.return=t,e}function yp(t,e,i){return il(e,t.child,null,i),t=Ir(e,e.pendingProps),t.flags|=2,dt(e),e.memoizedState=null,t}function CS(t,e,i){var a=e.pendingProps,l=(e.flags&128)!==0;if(e.flags&=-129,t===null){if(Q){if(a.mode==="hidden")return t=Ir(e,a),e.lanes=536870912,es(null,t);if($c(e),(t=fe)?(t=T0(t,Ht),t=t!==null&&t.data==="&"?t:null,t!==null&&(e.memoizedState={dehydrated:t,treeContext:Ta!==null?{id:ti,overflow:ii}:null,retryLane:536870912,hydrationErrors:null},i=Uy(t),i.return=e,e.child=i,Xe=e,fe=null)):t=null,t===null)throw wa(e);return e.lanes=536870912,null}return Ir(e,a)}var n=t.memoizedState;if(n!==null){var s=n.dehydrated;if($c(e),l)if(e.flags&256)e.flags&=-257,e=yp(t,e,i);else if(e.memoizedState!==null)e.child=t.child,e.flags|=128,e=null;else throw Error(S(558));else if(Re||un(t,e,i,!1),l=(i&t.childLanes)!==0,Re||l){if(a=re,a!==null&&(s=dy(a,i),s!==0&&s!==n.retryLane))throw n.retryLane=s,ol(t,s),it(a,t,s),nf;Mo(),e=yp(t,e,i)}else t=n.treeContext,fe=Bt(s.nextSibling),Xe=e,Q=!0,va=null,Ht=!1,t!==null&&Fy(e,t),e=Ir(e,a),e.flags|=4096;return e}return t=_i(t.child,{mode:a.mode,children:a.children}),t.ref=e.ref,e.child=t,t.return=e,t}function Qr(t,e){var i=e.ref;if(i===null)t!==null&&t.ref!==null&&(e.flags|=4194816);else{if(typeof i!="function"&&typeof i!="object")throw Error(S(284));(t===null||t.ref!==i)&&(e.flags|=4194816)}}function nd(t,e,i,a,l){return tl(e),i=Zd(t,e,i,a,void 0,l),a=Id(),t!==null&&!Re?(Qd(t,e,l),Bi(t,e,l)):(Q&&a&&Bd(e),e.flags|=1,Ye(t,e,i,l),e.child)}function gp(t,e,i,a,l,n){return tl(e),e.updateQueue=null,i=Jy(e,a,i,l),Ky(t),a=Id(),t!==null&&!Re?(Qd(t,e,n),Bi(t,e,n)):(Q&&a&&Bd(e),e.flags|=1,Ye(t,e,i,n),e.child)}function vp(t,e,i,a,l){if(tl(e),e.stateNode===null){var n=Bl,s=i.contextType;typeof s=="object"&&s!==null&&(n=qe(s)),n=new i(a,n),e.memoizedState=n.state!==null&&n.state!==void 0?n.state:null,n.updater=ad,e.stateNode=n,n._reactInternals=e,n=e.stateNode,n.props=a,n.state=e.memoizedState,n.refs={},qd(e),s=i.contextType,n.context=typeof s=="object"&&s!==null?qe(s):Bl,n.state=e.memoizedState,s=i.getDerivedStateFromProps,typeof s=="function"&&(dc(e,i,s,a),n.state=e.memoizedState),typeof i.getDerivedStateFromProps=="function"||typeof n.getSnapshotBeforeUpdate=="function"||typeof n.UNSAFE_componentWillMount!="function"&&typeof n.componentWillMount!="function"||(s=n.state,typeof n.componentWillMount=="function"&&n.componentWillMount(),typeof n.UNSAFE_componentWillMount=="function"&&n.UNSAFE_componentWillMount(),s!==n.state&&ad.enqueueReplaceState(n,n.state,null),os(e,a,n,l),rs(),n.state=e.memoizedState),typeof n.componentDidMount=="function"&&(e.flags|=4194308),a=!0}else if(t===null){n=e.stateNode;var r=e.memoizedProps,o=ll(i,r);n.props=o;var u=n.context,d=i.contextType;s=Bl,typeof d=="object"&&d!==null&&(s=qe(d));var p=i.getDerivedStateFromProps;d=typeof p=="function"||typeof n.getSnapshotBeforeUpdate=="function",r=e.pendingProps!==r,d||typeof n.UNSAFE_componentWillReceiveProps!="function"&&typeof n.componentWillReceiveProps!="function"||(r||u!==s)&&dp(e,n,a,s),ra=!1;var f=e.memoizedState;n.state=f,os(e,a,n,l),rs(),u=e.memoizedState,r||f!==u||ra?(typeof p=="function"&&(dc(e,i,p,a),u=e.memoizedState),(o=ra||cp(e,i,o,a,f,u,s))?(d||typeof n.UNSAFE_componentWillMount!="function"&&typeof n.componentWillMount!="function"||(typeof n.componentWillMount=="function"&&n.componentWillMount(),typeof n.UNSAFE_componentWillMount=="function"&&n.UNSAFE_componentWillMount()),typeof n.componentDidMount=="function"&&(e.flags|=4194308)):(typeof n.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=a,e.memoizedState=u),n.props=a,n.state=u,n.context=s,a=o):(typeof n.componentDidMount=="function"&&(e.flags|=4194308),a=!1)}else{n=e.stateNode,Kc(t,e),s=e.memoizedProps,d=ll(i,s),n.props=d,p=e.pendingProps,f=n.context,u=i.contextType,o=Bl,typeof u=="object"&&u!==null&&(o=qe(u)),r=i.getDerivedStateFromProps,(u=typeof r=="function"||typeof n.getSnapshotBeforeUpdate=="function")||typeof n.UNSAFE_componentWillReceiveProps!="function"&&typeof n.componentWillReceiveProps!="function"||(s!==p||f!==o)&&dp(e,n,a,o),ra=!1,f=e.memoizedState,n.state=f,os(e,a,n,l),rs();var y=e.memoizedState;s!==p||f!==y||ra||t!==null&&t.dependencies!==null&&oo(t.dependencies)?(typeof r=="function"&&(dc(e,i,r,a),y=e.memoizedState),(d=ra||cp(e,i,d,a,f,y,o)||t!==null&&t.dependencies!==null&&oo(t.dependencies))?(u||typeof n.UNSAFE_componentWillUpdate!="function"&&typeof n.componentWillUpdate!="function"||(typeof n.componentWillUpdate=="function"&&n.componentWillUpdate(a,y,o),typeof n.UNSAFE_componentWillUpdate=="function"&&n.UNSAFE_componentWillUpdate(a,y,o)),typeof n.componentDidUpdate=="function"&&(e.flags|=4),typeof n.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof n.componentDidUpdate!="function"||s===t.memoizedProps&&f===t.memoizedState||(e.flags|=4),typeof n.getSnapshotBeforeUpdate!="function"||s===t.memoizedProps&&f===t.memoizedState||(e.flags|=1024),e.memoizedProps=a,e.memoizedState=y),n.props=a,n.state=y,n.context=o,a=d):(typeof n.componentDidUpdate!="function"||s===t.memoizedProps&&f===t.memoizedState||(e.flags|=4),typeof n.getSnapshotBeforeUpdate!="function"||s===t.memoizedProps&&f===t.memoizedState||(e.flags|=1024),a=!1)}return n=a,Qr(t,e),a=(e.flags&128)!==0,n||a?(n=e.stateNode,i=a&&typeof i.getDerivedStateFromError!="function"?null:n.render(),e.flags|=1,t!==null&&a?(e.child=il(e,t.child,null,l),e.child=il(e,null,i,l)):Ye(t,e,i,l),e.memoizedState=n.state,t=e.child):t=Bi(t,e,l),t}function bp(t,e,i,a){return el(),e.flags|=256,Ye(t,e,i,a),e.child}var fc={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function hc(t){return{baseLanes:t,cachePool:qy()}}function mc(t,e,i){return t=t!==null?t.childLanes&~i:0,e&&(t|=ht),t}function Og(t,e,i){var a=e.pendingProps,l=!1,n=(e.flags&128)!==0,s;if((s=n)||(s=t!==null&&t.memoizedState===null?!1:(Se.current&2)!==0),s&&(l=!0,e.flags&=-129),s=(e.flags&32)!==0,e.flags&=-33,t===null){if(Q){if(l?ua(e):ca(e),(t=fe)?(t=T0(t,Ht),t=t!==null&&t.data!=="&"?t:null,t!==null&&(e.memoizedState={dehydrated:t,treeContext:Ta!==null?{id:ti,overflow:ii}:null,retryLane:536870912,hydrationErrors:null},i=Uy(t),i.return=e,e.child=i,Xe=e,fe=null)):t=null,t===null)throw wa(e);return bd(t)?e.lanes=32:e.lanes=536870912,null}var r=a.children;return a=a.fallback,l?(ca(e),l=e.mode,r=yo({mode:"hidden",children:r},l),a=Ka(a,l,i,null),r.return=e,a.return=e,r.sibling=a,e.child=r,a=e.child,a.memoizedState=hc(i),a.childLanes=mc(t,s,i),e.memoizedState=fc,es(null,a)):(ua(e),sd(e,r))}var o=t.memoizedState;if(o!==null&&(r=o.dehydrated,r!==null)){if(n)e.flags&256?(ua(e),e.flags&=-257,e=pc(t,e,i)):e.memoizedState!==null?(ca(e),e.child=t.child,e.flags|=128,e=null):(ca(e),r=a.fallback,l=e.mode,a=yo({mode:"visible",children:a.children},l),r=Ka(r,l,i,null),r.flags|=2,a.return=e,r.return=e,a.sibling=r,e.child=a,il(e,t.child,null,i),a=e.child,a.memoizedState=hc(i),a.childLanes=mc(t,s,i),e.memoizedState=fc,e=es(null,a));else if(ua(e),bd(r)){if(s=r.nextSibling&&r.nextSibling.dataset,s)var u=s.dgst;s=u,a=Error(S(419)),a.stack="",a.digest=s,Ms({value:a,source:null,stack:null}),e=pc(t,e,i)}else if(Re||un(t,e,i,!1),s=(i&t.childLanes)!==0,Re||s){if(s=re,s!==null&&(a=dy(s,i),a!==0&&a!==o.retryLane))throw o.retryLane=a,ol(t,a),it(s,t,a),nf;vd(r)||Mo(),e=pc(t,e,i)}else vd(r)?(e.flags|=192,e.child=t.child,e=null):(t=o.treeContext,fe=Bt(r.nextSibling),Xe=e,Q=!0,va=null,Ht=!1,t!==null&&Fy(e,t),e=sd(e,a.children),e.flags|=4096);return e}return l?(ca(e),r=a.fallback,l=e.mode,o=t.child,u=o.sibling,a=_i(o,{mode:"hidden",children:a.children}),a.subtreeFlags=o.subtreeFlags&65011712,u!==null?r=_i(u,r):(r=Ka(r,l,i,null),r.flags|=2),r.return=e,a.return=e,a.sibling=r,e.child=a,es(null,a),a=e.child,r=t.child.memoizedState,r===null?r=hc(i):(l=r.cachePool,l!==null?(o=we._currentValue,l=l.parent!==o?{parent:o,pool:o}:l):l=qy(),r={baseLanes:r.baseLanes|i,cachePool:l}),a.memoizedState=r,a.childLanes=mc(t,s,i),e.memoizedState=fc,es(t.child,a)):(ua(e),i=t.child,t=i.sibling,i=_i(i,{mode:"visible",children:a.children}),i.return=e,i.sibling=null,t!==null&&(s=e.deletions,s===null?(e.deletions=[t],e.flags|=16):s.push(t)),e.child=i,e.memoizedState=null,i)}function sd(t,e){return e=yo({mode:"visible",children:e},t.mode),e.return=t,t.child=e}function yo(t,e){return t=ft(22,t,null,e),t.lanes=0,t}function pc(t,e,i){return il(e,t.child,null,i),t=sd(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function Mp(t,e,i){t.lanes|=e;var a=t.alternate;a!==null&&(a.lanes|=e),Ic(t.return,e,i)}function yc(t,e,i,a,l,n){var s=t.memoizedState;s===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:a,tail:i,tailMode:l,treeForkCount:n}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=a,s.tail=i,s.tailMode=l,s.treeForkCount=n)}function Hg(t,e,i){var a=e.pendingProps,l=a.revealOrder,n=a.tail;a=a.children;var s=Se.current,r=(s&2)!==0;if(r?(s=s&1|2,e.flags|=128):s&=1,ue(Se,s),Ye(t,e,a,i),a=Q?bs:0,!r&&t!==null&&(t.flags&128)!==0)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&Mp(t,i,e);else if(t.tag===19)Mp(t,i,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}switch(l){case"forwards":for(i=e.child,l=null;i!==null;)t=i.alternate,t!==null&&fo(t)===null&&(l=i),i=i.sibling;i=l,i===null?(l=e.child,e.child=null):(l=i.sibling,i.sibling=null),yc(e,!1,l,i,n,a);break;case"backwards":case"unstable_legacy-backwards":for(i=null,l=e.child,e.child=null;l!==null;){if(t=l.alternate,t!==null&&fo(t)===null){e.child=l;break}t=l.sibling,l.sibling=i,i=l,l=t}yc(e,!0,i,null,n,a);break;case"together":yc(e,!1,null,null,void 0,a);break;default:e.memoizedState=null}return e.child}function Bi(t,e,i){if(t!==null&&(e.dependencies=t.dependencies),Aa|=e.lanes,(i&e.childLanes)===0)if(t!==null){if(un(t,e,i,!1),(i&e.childLanes)===0)return null}else return null;if(t!==null&&e.child!==t.child)throw Error(S(153));if(e.child!==null){for(t=e.child,i=_i(t,t.pendingProps),e.child=i,i.return=e;t.sibling!==null;)t=t.sibling,i=i.sibling=_i(t,t.pendingProps),i.return=e;i.sibling=null}return e.child}function sf(t,e){return(t.lanes&e)!==0?!0:(t=t.dependencies,!!(t!==null&&oo(t)))}function TS(t,e,i){switch(e.tag){case 3:to(e,e.stateNode.containerInfo),oa(e,we,t.memoizedState.cache),el();break;case 27:case 5:Dc(e);break;case 4:to(e,e.stateNode.containerInfo);break;case 10:oa(e,e.type,e.memoizedProps.value);break;case 31:if(e.memoizedState!==null)return e.flags|=128,$c(e),null;break;case 13:var a=e.memoizedState;if(a!==null)return a.dehydrated!==null?(ua(e),e.flags|=128,null):(i&e.child.childLanes)!==0?Og(t,e,i):(ua(e),t=Bi(t,e,i),t!==null?t.sibling:null);ua(e);break;case 19:var l=(t.flags&128)!==0;if(a=(i&e.childLanes)!==0,a||(un(t,e,i,!1),a=(i&e.childLanes)!==0),l){if(a)return Hg(t,e,i);e.flags|=128}if(l=e.memoizedState,l!==null&&(l.rendering=null,l.tail=null,l.lastEffect=null),ue(Se,Se.current),a)break;return null;case 22:return e.lanes=0,Dg(t,e,i,e.pendingProps);case 24:oa(e,we,t.memoizedState.cache)}return Bi(t,e,i)}function Lg(t,e,i){if(t!==null)if(t.memoizedProps!==e.pendingProps)Re=!0;else{if(!sf(t,i)&&(e.flags&128)===0)return Re=!1,TS(t,e,i);Re=(t.flags&131072)!==0}else Re=!1,Q&&(e.flags&1048576)!==0&&Yy(e,bs,e.index);switch(e.lanes=0,e.tag){case 16:e:{var a=e.pendingProps;if(t=Ia(e.elementType),e.type=t,typeof t=="function")Ld(t)?(a=ll(t,a),e.tag=1,e=vp(null,e,t,a,i)):(e.tag=0,e=nd(null,e,t,a,i));else{if(t!=null){var l=t.$$typeof;if(l===Ed){e.tag=11,e=hp(null,e,t,a,i);break e}else if(l===Gd){e.tag=14,e=mp(null,e,t,a,i);break e}}throw e=_c(t)||t,Error(S(306,e,""))}}return e;case 0:return nd(t,e,e.type,e.pendingProps,i);case 1:return a=e.type,l=ll(a,e.pendingProps),vp(t,e,a,l,i);case 3:e:{if(to(e,e.stateNode.containerInfo),t===null)throw Error(S(387));a=e.pendingProps;var n=e.memoizedState;l=n.element,Kc(t,e),os(e,a,null,i);var s=e.memoizedState;if(a=s.cache,oa(e,we,a),a!==n.cache&&Qc(e,[we],i,!0),rs(),a=s.element,n.isDehydrated)if(n={element:a,isDehydrated:!1,cache:s.cache},e.updateQueue.baseState=n,e.memoizedState=n,e.flags&256){e=bp(t,e,a,i);break e}else if(a!==l){l=Ot(Error(S(424)),e),Ms(l),e=bp(t,e,a,i);break e}else for(t=e.stateNode.containerInfo,t.nodeType===9?t=t.body:t=t.nodeName==="HTML"?t.ownerDocument.body:t,fe=Bt(t.firstChild),Xe=e,Q=!0,va=null,Ht=!0,i=Zy(e,null,a,i),e.child=i;i;)i.flags=i.flags&-3|4096,i=i.sibling;else{if(el(),a===l){e=Bi(t,e,i);break e}Ye(t,e,a,i)}e=e.child}return e;case 26:return Qr(t,e),t===null?(i=Xp(e.type,null,e.pendingProps,null))?e.memoizedState=i:Q||(i=e.type,t=e.pendingProps,a=Go(ga.current).createElement(i),a[Fe]=e,a[at]=t,je(a,i,t),Le(a),e.stateNode=a):e.memoizedState=Xp(e.type,t.memoizedProps,e.pendingProps,t.memoizedState),null;case 27:return Dc(e),t===null&&Q&&(a=e.stateNode=w0(e.type,e.pendingProps,ga.current),Xe=e,Ht=!0,l=fe,Pa(e.type)?(Md=l,fe=Bt(a.firstChild)):fe=l),Ye(t,e,e.pendingProps.children,i),Qr(t,e),t===null&&(e.flags|=4194304),e.child;case 5:return t===null&&Q&&((l=a=fe)&&(a=e2(a,e.type,e.pendingProps,Ht),a!==null?(e.stateNode=a,Xe=e,fe=Bt(a.firstChild),Ht=!1,l=!0):l=!1),l||wa(e)),Dc(e),l=e.type,n=e.pendingProps,s=t!==null?t.memoizedProps:null,a=n.children,yd(l,n)?a=null:s!==null&&yd(l,s)&&(e.flags|=32),e.memoizedState!==null&&(l=Zd(t,e,gS,null,null,i),Ts._currentValue=l),Qr(t,e),Ye(t,e,a,i),e.child;case 6:return t===null&&Q&&((t=i=fe)&&(i=t2(i,e.pendingProps,Ht),i!==null?(e.stateNode=i,Xe=e,fe=null,t=!0):t=!1),t||wa(e)),null;case 13:return Og(t,e,i);case 4:return to(e,e.stateNode.containerInfo),a=e.pendingProps,t===null?e.child=il(e,null,a,i):Ye(t,e,a,i),e.child;case 11:return hp(t,e,e.type,e.pendingProps,i);case 7:return Ye(t,e,e.pendingProps,i),e.child;case 8:return Ye(t,e,e.pendingProps.children,i),e.child;case 12:return Ye(t,e,e.pendingProps.children,i),e.child;case 10:return a=e.pendingProps,oa(e,e.type,a.value),Ye(t,e,a.children,i),e.child;case 9:return l=e.type._context,a=e.pendingProps.children,tl(e),l=qe(l),a=a(l),e.flags|=1,Ye(t,e,a,i),e.child;case 14:return mp(t,e,e.type,e.pendingProps,i);case 15:return Ng(t,e,e.type,e.pendingProps,i);case 19:return Hg(t,e,i);case 31:return CS(t,e,i);case 22:return Dg(t,e,i,e.pendingProps);case 24:return tl(e),a=qe(we),t===null?(l=Fd(),l===null&&(l=re,n=Yd(),l.pooledCache=n,n.refCount++,n!==null&&(l.pooledCacheLanes|=i),l=n),e.memoizedState={parent:a,cache:l},qd(e),oa(e,we,l)):((t.lanes&i)!==0&&(Kc(t,e),os(e,null,null,i),rs()),l=t.memoizedState,n=e.memoizedState,l.parent!==a?(l={parent:a,cache:a},e.memoizedState=l,e.lanes===0&&(e.memoizedState=e.updateQueue.baseState=l),oa(e,we,a)):(a=n.cache,oa(e,we,a),a!==l.cache&&Qc(e,[we],i,!0))),Ye(t,e,e.pendingProps.children,i),e.child;case 29:throw e.pendingProps}throw Error(S(156,e.tag))}function Ei(t){t.flags|=4}function gc(t,e,i,a,l){if((e=(t.mode&32)!==0)&&(e=!1),e){if(t.flags|=16777216,(l&335544128)===l)if(t.stateNode.complete)t.flags|=8192;else if(r0())t.flags|=8192;else throw Wa=uo,Xd}else t.flags&=-16777217}function xp(t,e){if(e.type!=="stylesheet"||(e.state.loading&4)!==0)t.flags&=-16777217;else if(t.flags|=16777216,!z0(e))if(r0())t.flags|=8192;else throw Wa=uo,Xd}function _r(t,e){e!==null&&(t.flags|=4),t.flags&16384&&(e=t.tag!==22?oy():536870912,t.lanes|=e,tn|=e)}function In(t,e){if(!Q)switch(t.tailMode){case"hidden":e=t.tail;for(var i=null;e!==null;)e.alternate!==null&&(i=e),e=e.sibling;i===null?t.tail=null:i.sibling=null;break;case"collapsed":i=t.tail;for(var a=null;i!==null;)i.alternate!==null&&(a=i),i=i.sibling;a===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:a.sibling=null}}function de(t){var e=t.alternate!==null&&t.alternate.child===t.child,i=0,a=0;if(e)for(var l=t.child;l!==null;)i|=l.lanes|l.childLanes,a|=l.subtreeFlags&65011712,a|=l.flags&65011712,l.return=t,l=l.sibling;else for(l=t.child;l!==null;)i|=l.lanes|l.childLanes,a|=l.subtreeFlags,a|=l.flags,l.return=t,l=l.sibling;return t.subtreeFlags|=a,t.childLanes=i,e}function wS(t,e,i){var a=e.pendingProps;switch(Ud(e),e.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return de(e),null;case 1:return de(e),null;case 3:return i=e.stateNode,a=null,t!==null&&(a=t.memoizedState.cache),e.memoizedState.cache!==a&&(e.flags|=2048),Ni(we),kl(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(t===null||t.child===null)&&(Tl(e)?Ei(e):t===null||t.memoizedState.isDehydrated&&(e.flags&256)===0||(e.flags|=1024,oc())),de(e),null;case 26:var l=e.type,n=e.memoizedState;return t===null?(Ei(e),n!==null?(de(e),xp(e,n)):(de(e),gc(e,l,null,a,i))):n?n!==t.memoizedState?(Ei(e),de(e),xp(e,n)):(de(e),e.flags&=-16777217):(t=t.memoizedProps,t!==a&&Ei(e),de(e),gc(e,l,t,a,i)),null;case 27:if(io(e),i=ga.current,l=e.type,t!==null&&e.stateNode!=null)t.memoizedProps!==a&&Ei(e);else{if(!a){if(e.stateNode===null)throw Error(S(166));return de(e),null}t=li.current,Tl(e)?Km(e,t):(t=w0(l,a,i),e.stateNode=t,Ei(e))}return de(e),null;case 5:if(io(e),l=e.type,t!==null&&e.stateNode!=null)t.memoizedProps!==a&&Ei(e);else{if(!a){if(e.stateNode===null)throw Error(S(166));return de(e),null}if(n=li.current,Tl(e))Km(e,n);else{var s=Go(ga.current);switch(n){case 1:n=s.createElementNS("http://www.w3.org/2000/svg",l);break;case 2:n=s.createElementNS("http://www.w3.org/1998/Math/MathML",l);break;default:switch(l){case"svg":n=s.createElementNS("http://www.w3.org/2000/svg",l);break;case"math":n=s.createElementNS("http://www.w3.org/1998/Math/MathML",l);break;case"script":n=s.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild);break;case"select":n=typeof a.is=="string"?s.createElement("select",{is:a.is}):s.createElement("select"),a.multiple?n.multiple=!0:a.size&&(n.size=a.size);break;default:n=typeof a.is=="string"?s.createElement(l,{is:a.is}):s.createElement(l)}}n[Fe]=e,n[at]=a;e:for(s=e.child;s!==null;){if(s.tag===5||s.tag===6)n.appendChild(s.stateNode);else if(s.tag!==4&&s.tag!==27&&s.child!==null){s.child.return=s,s=s.child;continue}if(s===e)break e;for(;s.sibling===null;){if(s.return===null||s.return===e)break e;s=s.return}s.sibling.return=s.return,s=s.sibling}e.stateNode=n;e:switch(je(n,l,a),l){case"button":case"input":case"select":case"textarea":a=!!a.autoFocus;break e;case"img":a=!0;break e;default:a=!1}a&&Ei(e)}}return de(e),gc(e,e.type,t===null?null:t.memoizedProps,e.pendingProps,i),null;case 6:if(t&&e.stateNode!=null)t.memoizedProps!==a&&Ei(e);else{if(typeof a!="string"&&e.stateNode===null)throw Error(S(166));if(t=ga.current,Tl(e)){if(t=e.stateNode,i=e.memoizedProps,a=null,l=Xe,l!==null)switch(l.tag){case 27:case 5:a=l.memoizedProps}t[Fe]=e,t=!!(t.nodeValue===i||a!==null&&a.suppressHydrationWarning===!0||E0(t.nodeValue,i)),t||wa(e,!0)}else t=Go(t).createTextNode(a),t[Fe]=e,e.stateNode=t}return de(e),null;case 31:if(i=e.memoizedState,t===null||t.memoizedState!==null){if(a=Tl(e),i!==null){if(t===null){if(!a)throw Error(S(318));if(t=e.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(S(557));t[Fe]=e}else el(),(e.flags&128)===0&&(e.memoizedState=null),e.flags|=4;de(e),t=!1}else i=oc(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=i),t=!0;if(!t)return e.flags&256?(dt(e),e):(dt(e),null);if((e.flags&128)!==0)throw Error(S(558))}return de(e),null;case 13:if(a=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(l=Tl(e),a!==null&&a.dehydrated!==null){if(t===null){if(!l)throw Error(S(318));if(l=e.memoizedState,l=l!==null?l.dehydrated:null,!l)throw Error(S(317));l[Fe]=e}else el(),(e.flags&128)===0&&(e.memoizedState=null),e.flags|=4;de(e),l=!1}else l=oc(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=l),l=!0;if(!l)return e.flags&256?(dt(e),e):(dt(e),null)}return dt(e),(e.flags&128)!==0?(e.lanes=i,e):(i=a!==null,t=t!==null&&t.memoizedState!==null,i&&(a=e.child,l=null,a.alternate!==null&&a.alternate.memoizedState!==null&&a.alternate.memoizedState.cachePool!==null&&(l=a.alternate.memoizedState.cachePool.pool),n=null,a.memoizedState!==null&&a.memoizedState.cachePool!==null&&(n=a.memoizedState.cachePool.pool),n!==l&&(a.flags|=2048)),i!==t&&i&&(e.child.flags|=8192),_r(e,e.updateQueue),de(e),null);case 4:return kl(),t===null&&hf(e.stateNode.containerInfo),de(e),null;case 10:return Ni(e.type),de(e),null;case 19:if(Be(Se),a=e.memoizedState,a===null)return de(e),null;if(l=(e.flags&128)!==0,n=a.rendering,n===null)if(l)In(a,!1);else{if(xe!==0||t!==null&&(t.flags&128)!==0)for(t=e.child;t!==null;){if(n=fo(t),n!==null){for(e.flags|=128,In(a,!1),t=n.updateQueue,e.updateQueue=t,_r(e,t),e.subtreeFlags=0,t=i,i=e.child;i!==null;)By(i,t),i=i.sibling;return ue(Se,Se.current&1|2),Q&&wi(e,a.treeForkCount),e.child}t=t.sibling}a.tail!==null&&mt()>vo&&(e.flags|=128,l=!0,In(a,!1),e.lanes=4194304)}else{if(!l)if(t=fo(n),t!==null){if(e.flags|=128,l=!0,t=t.updateQueue,e.updateQueue=t,_r(e,t),In(a,!0),a.tail===null&&a.tailMode==="hidden"&&!n.alternate&&!Q)return de(e),null}else 2*mt()-a.renderingStartTime>vo&&i!==536870912&&(e.flags|=128,l=!0,In(a,!1),e.lanes=4194304);a.isBackwards?(n.sibling=e.child,e.child=n):(t=a.last,t!==null?t.sibling=n:e.child=n,a.last=n)}return a.tail!==null?(t=a.tail,a.rendering=t,a.tail=t.sibling,a.renderingStartTime=mt(),t.sibling=null,i=Se.current,ue(Se,l?i&1|2:i&1),Q&&wi(e,a.treeForkCount),t):(de(e),null);case 22:case 23:return dt(e),jd(),a=e.memoizedState!==null,t!==null?t.memoizedState!==null!==a&&(e.flags|=8192):a&&(e.flags|=8192),a?(i&536870912)!==0&&(e.flags&128)===0&&(de(e),e.subtreeFlags&6&&(e.flags|=8192)):de(e),i=e.updateQueue,i!==null&&_r(e,i.retryQueue),i=null,t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(i=t.memoizedState.cachePool.pool),a=null,e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),a!==i&&(e.flags|=2048),t!==null&&Be(Ja),null;case 24:return i=null,t!==null&&(i=t.memoizedState.cache),e.memoizedState.cache!==i&&(e.flags|=2048),Ni(we),de(e),null;case 25:return null;case 30:return null}throw Error(S(156,e.tag))}function RS(t,e){switch(Ud(e),e.tag){case 1:return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return Ni(we),kl(),t=e.flags,(t&65536)!==0&&(t&128)===0?(e.flags=t&-65537|128,e):null;case 26:case 27:case 5:return io(e),null;case 31:if(e.memoizedState!==null){if(dt(e),e.alternate===null)throw Error(S(340));el()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 13:if(dt(e),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(S(340));el()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return Be(Se),null;case 4:return kl(),null;case 10:return Ni(e.type),null;case 22:case 23:return dt(e),jd(),t!==null&&Be(Ja),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 24:return Ni(we),null;case 25:return null;default:return null}}function Bg(t,e){switch(Ud(e),e.tag){case 3:Ni(we),kl();break;case 26:case 27:case 5:io(e);break;case 4:kl();break;case 31:e.memoizedState!==null&&dt(e);break;case 13:dt(e);break;case 19:Be(Se);break;case 10:Ni(e.type);break;case 22:case 23:dt(e),jd(),t!==null&&Be(Ja);break;case 24:Ni(we)}}function Ls(t,e){try{var i=e.updateQueue,a=i!==null?i.lastEffect:null;if(a!==null){var l=a.next;i=l;do{if((i.tag&t)===t){a=void 0;var n=i.create,s=i.inst;a=n(),s.destroy=a}i=i.next}while(i!==l)}}catch(r){le(e,e.return,r)}}function Ra(t,e,i){try{var a=e.updateQueue,l=a!==null?a.lastEffect:null;if(l!==null){var n=l.next;a=n;do{if((a.tag&t)===t){var s=a.inst,r=s.destroy;if(r!==void 0){s.destroy=void 0,l=e;var o=i,u=r;try{u()}catch(d){le(l,o,d)}}}a=a.next}while(a!==n)}}catch(d){le(e,e.return,d)}}function Ug(t){var e=t.updateQueue;if(e!==null){var i=t.stateNode;try{Qy(e,i)}catch(a){le(t,t.return,a)}}}function Yg(t,e,i){i.props=ll(t.type,t.memoizedProps),i.state=t.memoizedState;try{i.componentWillUnmount()}catch(a){le(t,e,a)}}function cs(t,e){try{var i=t.ref;if(i!==null){switch(t.tag){case 26:case 27:case 5:var a=t.stateNode;break;case 30:a=t.stateNode;break;default:a=t.stateNode}typeof i=="function"?t.refCleanup=i(a):i.current=a}}catch(l){le(t,e,l)}}function ai(t,e){var i=t.ref,a=t.refCleanup;if(i!==null)if(typeof a=="function")try{a()}catch(l){le(t,e,l)}finally{t.refCleanup=null,t=t.alternate,t!=null&&(t.refCleanup=null)}else if(typeof i=="function")try{i(null)}catch(l){le(t,e,l)}else i.current=null}function Fg(t){var e=t.type,i=t.memoizedProps,a=t.stateNode;try{e:switch(e){case"button":case"input":case"select":case"textarea":i.autoFocus&&a.focus();break e;case"img":i.src?a.src=i.src:i.srcSet&&(a.srcset=i.srcSet)}}catch(l){le(t,t.return,l)}}function vc(t,e,i){try{var a=t.stateNode;QS(a,t.type,i,e),a[at]=e}catch(l){le(t,t.return,l)}}function Xg(t){return t.tag===5||t.tag===3||t.tag===26||t.tag===27&&Pa(t.type)||t.tag===4}function bc(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||Xg(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.tag===27&&Pa(t.type)||t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function rd(t,e,i){var a=t.tag;if(a===5||a===6)t=t.stateNode,e?(i.nodeType===9?i.body:i.nodeName==="HTML"?i.ownerDocument.body:i).insertBefore(t,e):(e=i.nodeType===9?i.body:i.nodeName==="HTML"?i.ownerDocument.body:i,e.appendChild(t),i=i._reactRootContainer,i!=null||e.onclick!==null||(e.onclick=zi));else if(a!==4&&(a===27&&Pa(t.type)&&(i=t.stateNode,e=null),t=t.child,t!==null))for(rd(t,e,i),t=t.sibling;t!==null;)rd(t,e,i),t=t.sibling}function go(t,e,i){var a=t.tag;if(a===5||a===6)t=t.stateNode,e?i.insertBefore(t,e):i.appendChild(t);else if(a!==4&&(a===27&&Pa(t.type)&&(i=t.stateNode),t=t.child,t!==null))for(go(t,e,i),t=t.sibling;t!==null;)go(t,e,i),t=t.sibling}function qg(t){var e=t.stateNode,i=t.memoizedProps;try{for(var a=t.type,l=e.attributes;l.length;)e.removeAttributeNode(l[0]);je(e,a,i),e[Fe]=t,e[at]=i}catch(n){le(t,t.return,n)}}var Ri=!1,Te=!1,Mc=!1,Sp=typeof WeakSet=="function"?WeakSet:Set,He=null;function AS(t,e){if(t=t.containerInfo,md=Ro,t=zy(t),Dd(t)){if("selectionStart"in t)var i={start:t.selectionStart,end:t.selectionEnd};else e:{i=(i=t.ownerDocument)&&i.defaultView||window;var a=i.getSelection&&i.getSelection();if(a&&a.rangeCount!==0){i=a.anchorNode;var l=a.anchorOffset,n=a.focusNode;a=a.focusOffset;try{i.nodeType,n.nodeType}catch{i=null;break e}var s=0,r=-1,o=-1,u=0,d=0,p=t,f=null;t:for(;;){for(var y;p!==i||l!==0&&p.nodeType!==3||(r=s+l),p!==n||a!==0&&p.nodeType!==3||(o=s+a),p.nodeType===3&&(s+=p.nodeValue.length),(y=p.firstChild)!==null;)f=p,p=y;for(;;){if(p===t)break t;if(f===i&&++u===l&&(r=s),f===n&&++d===a&&(o=s),(y=p.nextSibling)!==null)break;p=f,f=p.parentNode}p=y}i=r===-1||o===-1?null:{start:r,end:o}}else i=null}i=i||{start:0,end:0}}else i=null;for(pd={focusedElem:t,selectionRange:i},Ro=!1,He=e;He!==null;)if(e=He,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,He=t;else for(;He!==null;){switch(e=He,n=e.alternate,t=e.flags,e.tag){case 0:if((t&4)!==0&&(t=e.updateQueue,t=t!==null?t.events:null,t!==null))for(i=0;i<t.length;i++)l=t[i],l.ref.impl=l.nextImpl;break;case 11:case 15:break;case 1:if((t&1024)!==0&&n!==null){t=void 0,i=e,l=n.memoizedProps,n=n.memoizedState,a=i.stateNode;try{var G=ll(i.type,l);t=a.getSnapshotBeforeUpdate(G,n),a.__reactInternalSnapshotBeforeUpdate=t}catch(C){le(i,i.return,C)}}break;case 3:if((t&1024)!==0){if(t=e.stateNode.containerInfo,i=t.nodeType,i===9)gd(t);else if(i===1)switch(t.nodeName){case"HEAD":case"HTML":case"BODY":gd(t);break;default:t.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((t&1024)!==0)throw Error(S(163))}if(t=e.sibling,t!==null){t.return=e.return,He=t;break}He=e.return}}function jg(t,e,i){var a=i.flags;switch(i.tag){case 0:case 11:case 15:Ci(t,i),a&4&&Ls(5,i);break;case 1:if(Ci(t,i),a&4)if(t=i.stateNode,e===null)try{t.componentDidMount()}catch(s){le(i,i.return,s)}else{var l=ll(i.type,e.memoizedProps);e=e.memoizedState;try{t.componentDidUpdate(l,e,t.__reactInternalSnapshotBeforeUpdate)}catch(s){le(i,i.return,s)}}a&64&&Ug(i),a&512&&cs(i,i.return);break;case 3:if(Ci(t,i),a&64&&(t=i.updateQueue,t!==null)){if(e=null,i.child!==null)switch(i.child.tag){case 27:case 5:e=i.child.stateNode;break;case 1:e=i.child.stateNode}try{Qy(t,e)}catch(s){le(i,i.return,s)}}break;case 27:e===null&&a&4&&qg(i);case 26:case 5:Ci(t,i),e===null&&a&4&&Fg(i),a&512&&cs(i,i.return);break;case 12:Ci(t,i);break;case 31:Ci(t,i),a&4&&Ig(t,i);break;case 13:Ci(t,i),a&4&&Qg(t,i),a&64&&(t=i.memoizedState,t!==null&&(t=t.dehydrated,t!==null&&(i=BS.bind(null,i),i2(t,i))));break;case 22:if(a=i.memoizedState!==null||Ri,!a){e=e!==null&&e.memoizedState!==null||Te,l=Ri;var n=Te;Ri=a,(Te=e)&&!n?Ti(t,i,(i.subtreeFlags&8772)!==0):Ci(t,i),Ri=l,Te=n}break;case 30:break;default:Ci(t,i)}}function Vg(t){var e=t.alternate;e!==null&&(t.alternate=null,Vg(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&Rd(e)),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}var pe=null,et=!1;function Gi(t,e,i){for(i=i.child;i!==null;)Zg(t,e,i),i=i.sibling}function Zg(t,e,i){if(pt&&typeof pt.onCommitFiberUnmount=="function")try{pt.onCommitFiberUnmount(zs,i)}catch{}switch(i.tag){case 26:Te||ai(i,e),Gi(t,e,i),i.memoizedState?i.memoizedState.count--:i.stateNode&&(i=i.stateNode,i.parentNode.removeChild(i));break;case 27:Te||ai(i,e);var a=pe,l=et;Pa(i.type)&&(pe=i.stateNode,et=!1),Gi(t,e,i),ms(i.stateNode),pe=a,et=l;break;case 5:Te||ai(i,e);case 6:if(a=pe,l=et,pe=null,Gi(t,e,i),pe=a,et=l,pe!==null)if(et)try{(pe.nodeType===9?pe.body:pe.nodeName==="HTML"?pe.ownerDocument.body:pe).removeChild(i.stateNode)}catch(n){le(i,e,n)}else try{pe.removeChild(i.stateNode)}catch(n){le(i,e,n)}break;case 18:pe!==null&&(et?(t=pe,Lp(t.nodeType===9?t.body:t.nodeName==="HTML"?t.ownerDocument.body:t,i.stateNode),sn(t)):Lp(pe,i.stateNode));break;case 4:a=pe,l=et,pe=i.stateNode.containerInfo,et=!0,Gi(t,e,i),pe=a,et=l;break;case 0:case 11:case 14:case 15:Ra(2,i,e),Te||Ra(4,i,e),Gi(t,e,i);break;case 1:Te||(ai(i,e),a=i.stateNode,typeof a.componentWillUnmount=="function"&&Yg(i,e,a)),Gi(t,e,i);break;case 21:Gi(t,e,i);break;case 22:Te=(a=Te)||i.memoizedState!==null,Gi(t,e,i),Te=a;break;default:Gi(t,e,i)}}function Ig(t,e){if(e.memoizedState===null&&(t=e.alternate,t!==null&&(t=t.memoizedState,t!==null))){t=t.dehydrated;try{sn(t)}catch(i){le(e,e.return,i)}}}function Qg(t,e){if(e.memoizedState===null&&(t=e.alternate,t!==null&&(t=t.memoizedState,t!==null&&(t=t.dehydrated,t!==null))))try{sn(t)}catch(i){le(e,e.return,i)}}function zS(t){switch(t.tag){case 31:case 13:case 19:var e=t.stateNode;return e===null&&(e=t.stateNode=new Sp),e;case 22:return t=t.stateNode,e=t._retryCache,e===null&&(e=t._retryCache=new Sp),e;default:throw Error(S(435,t.tag))}}function Nr(t,e){var i=zS(t);e.forEach(function(a){if(!i.has(a)){i.add(a);var l=US.bind(null,t,a);a.then(l,l)}})}function We(t,e){var i=e.deletions;if(i!==null)for(var a=0;a<i.length;a++){var l=i[a],n=t,s=e,r=s;e:for(;r!==null;){switch(r.tag){case 27:if(Pa(r.type)){pe=r.stateNode,et=!1;break e}break;case 5:pe=r.stateNode,et=!1;break e;case 3:case 4:pe=r.stateNode.containerInfo,et=!0;break e}r=r.return}if(pe===null)throw Error(S(160));Zg(n,s,l),pe=null,et=!1,n=l.alternate,n!==null&&(n.return=null),l.return=null}if(e.subtreeFlags&13886)for(e=e.child;e!==null;)kg(e,t),e=e.sibling}var jt=null;function kg(t,e){var i=t.alternate,a=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:We(e,t),$e(t),a&4&&(Ra(3,t,t.return),Ls(3,t),Ra(5,t,t.return));break;case 1:We(e,t),$e(t),a&512&&(Te||i===null||ai(i,i.return)),a&64&&Ri&&(t=t.updateQueue,t!==null&&(a=t.callbacks,a!==null&&(i=t.shared.hiddenCallbacks,t.shared.hiddenCallbacks=i===null?a:i.concat(a))));break;case 26:var l=jt;if(We(e,t),$e(t),a&512&&(Te||i===null||ai(i,i.return)),a&4){var n=i!==null?i.memoizedState:null;if(a=t.memoizedState,i===null)if(a===null)if(t.stateNode===null){e:{a=t.type,i=t.memoizedProps,l=l.ownerDocument||l;t:switch(a){case"title":n=l.getElementsByTagName("title")[0],(!n||n[Ns]||n[Fe]||n.namespaceURI==="http://www.w3.org/2000/svg"||n.hasAttribute("itemprop"))&&(n=l.createElement(a),l.head.insertBefore(n,l.querySelector("head > title"))),je(n,a,i),n[Fe]=t,Le(n),a=n;break e;case"link":var s=jp("link","href",l).get(a+(i.href||""));if(s){for(var r=0;r<s.length;r++)if(n=s[r],n.getAttribute("href")===(i.href==null||i.href===""?null:i.href)&&n.getAttribute("rel")===(i.rel==null?null:i.rel)&&n.getAttribute("title")===(i.title==null?null:i.title)&&n.getAttribute("crossorigin")===(i.crossOrigin==null?null:i.crossOrigin)){s.splice(r,1);break t}}n=l.createElement(a),je(n,a,i),l.head.appendChild(n);break;case"meta":if(s=jp("meta","content",l).get(a+(i.content||""))){for(r=0;r<s.length;r++)if(n=s[r],n.getAttribute("content")===(i.content==null?null:""+i.content)&&n.getAttribute("name")===(i.name==null?null:i.name)&&n.getAttribute("property")===(i.property==null?null:i.property)&&n.getAttribute("http-equiv")===(i.httpEquiv==null?null:i.httpEquiv)&&n.getAttribute("charset")===(i.charSet==null?null:i.charSet)){s.splice(r,1);break t}}n=l.createElement(a),je(n,a,i),l.head.appendChild(n);break;default:throw Error(S(468,a))}n[Fe]=t,Le(n),a=n}t.stateNode=a}else Vp(l,t.type,t.stateNode);else t.stateNode=qp(l,a,t.memoizedProps);else n!==a?(n===null?i.stateNode!==null&&(i=i.stateNode,i.parentNode.removeChild(i)):n.count--,a===null?Vp(l,t.type,t.stateNode):qp(l,a,t.memoizedProps)):a===null&&t.stateNode!==null&&vc(t,t.memoizedProps,i.memoizedProps)}break;case 27:We(e,t),$e(t),a&512&&(Te||i===null||ai(i,i.return)),i!==null&&a&4&&vc(t,t.memoizedProps,i.memoizedProps);break;case 5:if(We(e,t),$e(t),a&512&&(Te||i===null||ai(i,i.return)),t.flags&32){l=t.stateNode;try{Jl(l,"")}catch(G){le(t,t.return,G)}}a&4&&t.stateNode!=null&&(l=t.memoizedProps,vc(t,l,i!==null?i.memoizedProps:l)),a&1024&&(Mc=!0);break;case 6:if(We(e,t),$e(t),a&4){if(t.stateNode===null)throw Error(S(162));a=t.memoizedProps,i=t.stateNode;try{i.nodeValue=a}catch(G){le(t,t.return,G)}}break;case 3:if(Jr=null,l=jt,jt=Co(e.containerInfo),We(e,t),jt=l,$e(t),a&4&&i!==null&&i.memoizedState.isDehydrated)try{sn(e.containerInfo)}catch(G){le(t,t.return,G)}Mc&&(Mc=!1,Kg(t));break;case 4:a=jt,jt=Co(t.stateNode.containerInfo),We(e,t),$e(t),jt=a;break;case 12:We(e,t),$e(t);break;case 31:We(e,t),$e(t),a&4&&(a=t.updateQueue,a!==null&&(t.updateQueue=null,Nr(t,a)));break;case 13:We(e,t),$e(t),t.child.flags&8192&&t.memoizedState!==null!=(i!==null&&i.memoizedState!==null)&&(Fo=mt()),a&4&&(a=t.updateQueue,a!==null&&(t.updateQueue=null,Nr(t,a)));break;case 22:l=t.memoizedState!==null;var o=i!==null&&i.memoizedState!==null,u=Ri,d=Te;if(Ri=u||l,Te=d||o,We(e,t),Te=d,Ri=u,$e(t),a&8192)e:for(e=t.stateNode,e._visibility=l?e._visibility&-2:e._visibility|1,l&&(i===null||o||Ri||Te||Qa(t)),i=null,e=t;;){if(e.tag===5||e.tag===26){if(i===null){o=i=e;try{if(n=o.stateNode,l)s=n.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none";else{r=o.stateNode;var p=o.memoizedProps.style,f=p!=null&&p.hasOwnProperty("display")?p.display:null;r.style.display=f==null||typeof f=="boolean"?"":(""+f).trim()}}catch(G){le(o,o.return,G)}}}else if(e.tag===6){if(i===null){o=e;try{o.stateNode.nodeValue=l?"":o.memoizedProps}catch(G){le(o,o.return,G)}}}else if(e.tag===18){if(i===null){o=e;try{var y=o.stateNode;l?Bp(y,!0):Bp(o.stateNode,!1)}catch(G){le(o,o.return,G)}}}else if((e.tag!==22&&e.tag!==23||e.memoizedState===null||e===t)&&e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;i===e&&(i=null),e=e.return}i===e&&(i=null),e.sibling.return=e.return,e=e.sibling}a&4&&(a=t.updateQueue,a!==null&&(i=a.retryQueue,i!==null&&(a.retryQueue=null,Nr(t,i))));break;case 19:We(e,t),$e(t),a&4&&(a=t.updateQueue,a!==null&&(t.updateQueue=null,Nr(t,a)));break;case 30:break;case 21:break;default:We(e,t),$e(t)}}function $e(t){var e=t.flags;if(e&2){try{for(var i,a=t.return;a!==null;){if(Xg(a)){i=a;break}a=a.return}if(i==null)throw Error(S(160));switch(i.tag){case 27:var l=i.stateNode,n=bc(t);go(t,n,l);break;case 5:var s=i.stateNode;i.flags&32&&(Jl(s,""),i.flags&=-33);var r=bc(t);go(t,r,s);break;case 3:case 4:var o=i.stateNode.containerInfo,u=bc(t);rd(t,u,o);break;default:throw Error(S(161))}}catch(d){le(t,t.return,d)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function Kg(t){if(t.subtreeFlags&1024)for(t=t.child;t!==null;){var e=t;Kg(e),e.tag===5&&e.flags&1024&&e.stateNode.reset(),t=t.sibling}}function Ci(t,e){if(e.subtreeFlags&8772)for(e=e.child;e!==null;)jg(t,e.alternate,e),e=e.sibling}function Qa(t){for(t=t.child;t!==null;){var e=t;switch(e.tag){case 0:case 11:case 14:case 15:Ra(4,e,e.return),Qa(e);break;case 1:ai(e,e.return);var i=e.stateNode;typeof i.componentWillUnmount=="function"&&Yg(e,e.return,i),Qa(e);break;case 27:ms(e.stateNode);case 26:case 5:ai(e,e.return),Qa(e);break;case 22:e.memoizedState===null&&Qa(e);break;case 30:Qa(e);break;default:Qa(e)}t=t.sibling}}function Ti(t,e,i){for(i=i&&(e.subtreeFlags&8772)!==0,e=e.child;e!==null;){var a=e.alternate,l=t,n=e,s=n.flags;switch(n.tag){case 0:case 11:case 15:Ti(l,n,i),Ls(4,n);break;case 1:if(Ti(l,n,i),a=n,l=a.stateNode,typeof l.componentDidMount=="function")try{l.componentDidMount()}catch(u){le(a,a.return,u)}if(a=n,l=a.updateQueue,l!==null){var r=a.stateNode;try{var o=l.shared.hiddenCallbacks;if(o!==null)for(l.shared.hiddenCallbacks=null,l=0;l<o.length;l++)Iy(o[l],r)}catch(u){le(a,a.return,u)}}i&&s&64&&Ug(n),cs(n,n.return);break;case 27:qg(n);case 26:case 5:Ti(l,n,i),i&&a===null&&s&4&&Fg(n),cs(n,n.return);break;case 12:Ti(l,n,i);break;case 31:Ti(l,n,i),i&&s&4&&Ig(l,n);break;case 13:Ti(l,n,i),i&&s&4&&Qg(l,n);break;case 22:n.memoizedState===null&&Ti(l,n,i),cs(n,n.return);break;case 30:break;default:Ti(l,n,i)}e=e.sibling}}function rf(t,e){var i=null;t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(i=t.memoizedState.cachePool.pool),t=null,e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(t=e.memoizedState.cachePool.pool),t!==i&&(t!=null&&t.refCount++,i!=null&&Os(i))}function of(t,e){t=null,e.alternate!==null&&(t=e.alternate.memoizedState.cache),e=e.memoizedState.cache,e!==t&&(e.refCount++,t!=null&&Os(t))}function qt(t,e,i,a){if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Jg(t,e,i,a),e=e.sibling}function Jg(t,e,i,a){var l=e.flags;switch(e.tag){case 0:case 11:case 15:qt(t,e,i,a),l&2048&&Ls(9,e);break;case 1:qt(t,e,i,a);break;case 3:qt(t,e,i,a),l&2048&&(t=null,e.alternate!==null&&(t=e.alternate.memoizedState.cache),e=e.memoizedState.cache,e!==t&&(e.refCount++,t!=null&&Os(t)));break;case 12:if(l&2048){qt(t,e,i,a),t=e.stateNode;try{var n=e.memoizedProps,s=n.id,r=n.onPostCommit;typeof r=="function"&&r(s,e.alternate===null?"mount":"update",t.passiveEffectDuration,-0)}catch(o){le(e,e.return,o)}}else qt(t,e,i,a);break;case 31:qt(t,e,i,a);break;case 13:qt(t,e,i,a);break;case 23:break;case 22:n=e.stateNode,s=e.alternate,e.memoizedState!==null?n._visibility&2?qt(t,e,i,a):ds(t,e):n._visibility&2?qt(t,e,i,a):(n._visibility|=2,Rl(t,e,i,a,(e.subtreeFlags&10256)!==0||!1)),l&2048&&rf(s,e);break;case 24:qt(t,e,i,a),l&2048&&of(e.alternate,e);break;default:qt(t,e,i,a)}}function Rl(t,e,i,a,l){for(l=l&&((e.subtreeFlags&10256)!==0||!1),e=e.child;e!==null;){var n=t,s=e,r=i,o=a,u=s.flags;switch(s.tag){case 0:case 11:case 15:Rl(n,s,r,o,l),Ls(8,s);break;case 23:break;case 22:var d=s.stateNode;s.memoizedState!==null?d._visibility&2?Rl(n,s,r,o,l):ds(n,s):(d._visibility|=2,Rl(n,s,r,o,l)),l&&u&2048&&rf(s.alternate,s);break;case 24:Rl(n,s,r,o,l),l&&u&2048&&of(s.alternate,s);break;default:Rl(n,s,r,o,l)}e=e.sibling}}function ds(t,e){if(e.subtreeFlags&10256)for(e=e.child;e!==null;){var i=t,a=e,l=a.flags;switch(a.tag){case 22:ds(i,a),l&2048&&rf(a.alternate,a);break;case 24:ds(i,a),l&2048&&of(a.alternate,a);break;default:ds(i,a)}e=e.sibling}}var ts=8192;function wl(t,e,i){if(t.subtreeFlags&ts)for(t=t.child;t!==null;)Wg(t,e,i),t=t.sibling}function Wg(t,e,i){switch(t.tag){case 26:wl(t,e,i),t.flags&ts&&t.memoizedState!==null&&m2(i,jt,t.memoizedState,t.memoizedProps);break;case 5:wl(t,e,i);break;case 3:case 4:var a=jt;jt=Co(t.stateNode.containerInfo),wl(t,e,i),jt=a;break;case 22:t.memoizedState===null&&(a=t.alternate,a!==null&&a.memoizedState!==null?(a=ts,ts=16777216,wl(t,e,i),ts=a):wl(t,e,i));break;default:wl(t,e,i)}}function $g(t){var e=t.alternate;if(e!==null&&(t=e.child,t!==null)){e.child=null;do e=t.sibling,t.sibling=null,t=e;while(t!==null)}}function Qn(t){var e=t.deletions;if((t.flags&16)!==0){if(e!==null)for(var i=0;i<e.length;i++){var a=e[i];He=a,t0(a,t)}$g(t)}if(t.subtreeFlags&10256)for(t=t.child;t!==null;)e0(t),t=t.sibling}function e0(t){switch(t.tag){case 0:case 11:case 15:Qn(t),t.flags&2048&&Ra(9,t,t.return);break;case 3:Qn(t);break;case 12:Qn(t);break;case 22:var e=t.stateNode;t.memoizedState!==null&&e._visibility&2&&(t.return===null||t.return.tag!==13)?(e._visibility&=-3,kr(t)):Qn(t);break;default:Qn(t)}}function kr(t){var e=t.deletions;if((t.flags&16)!==0){if(e!==null)for(var i=0;i<e.length;i++){var a=e[i];He=a,t0(a,t)}$g(t)}for(t=t.child;t!==null;){switch(e=t,e.tag){case 0:case 11:case 15:Ra(8,e,e.return),kr(e);break;case 22:i=e.stateNode,i._visibility&2&&(i._visibility&=-3,kr(e));break;default:kr(e)}t=t.sibling}}function t0(t,e){for(;He!==null;){var i=He;switch(i.tag){case 0:case 11:case 15:Ra(8,i,e);break;case 23:case 22:if(i.memoizedState!==null&&i.memoizedState.cachePool!==null){var a=i.memoizedState.cachePool.pool;a!=null&&a.refCount++}break;case 24:Os(i.memoizedState.cache)}if(a=i.child,a!==null)a.return=i,He=a;else e:for(i=t;He!==null;){a=He;var l=a.sibling,n=a.return;if(Vg(a),a===i){He=null;break e}if(l!==null){l.return=n,He=l;break e}He=n}}}var PS={getCacheForType:function(t){var e=qe(we),i=e.data.get(t);return i===void 0&&(i=t(),e.data.set(t,i)),i},cacheSignal:function(){return qe(we).controller.signal}},_S=typeof WeakMap=="function"?WeakMap:Map,ee=0,re=null,X=null,j=0,ae=0,ct=null,ma=!1,dn=!1,uf=!1,Ui=0,xe=0,Aa=0,$a=0,cf=0,ht=0,tn=0,fs=null,tt=null,od=!1,Fo=0,i0=0,vo=1/0,bo=null,xa=null,Ne=0,Sa=null,an=null,Di=0,ud=0,cd=null,a0=null,hs=0,dd=null;function gt(){return(ee&2)!==0&&j!==0?j&-j:_.T!==null?ff():fy()}function l0(){if(ht===0)if((j&536870912)===0||Q){var t=Er;Er<<=1,(Er&3932160)===0&&(Er=262144),ht=t}else ht=536870912;return t=bt.current,t!==null&&(t.flags|=32),ht}function it(t,e,i){(t===re&&(ae===2||ae===9)||t.cancelPendingCommit!==null)&&(ln(t,0),pa(t,j,ht,!1)),_s(t,i),((ee&2)===0||t!==re)&&(t===re&&((ee&2)===0&&($a|=i),xe===4&&pa(t,j,ht,!1)),si(t))}function n0(t,e,i){if((ee&6)!==0)throw Error(S(327));var a=!i&&(e&127)===0&&(e&t.expiredLanes)===0||Ps(t,e),l=a?OS(t,e):xc(t,e,!0),n=a;do{if(l===0){dn&&!a&&pa(t,e,0,!1);break}else{if(i=t.current.alternate,n&&!NS(i)){l=xc(t,e,!1),n=!1;continue}if(l===2){if(n=e,t.errorRecoveryDisabledLanes&n)var s=0;else s=t.pendingLanes&-536870913,s=s!==0?s:s&536870912?536870912:0;if(s!==0){e=s;e:{var r=t;l=fs;var o=r.current.memoizedState.isDehydrated;if(o&&(ln(r,s).flags|=256),s=xc(r,s,!1),s!==2){if(uf&&!o){r.errorRecoveryDisabledLanes|=n,$a|=n,l=4;break e}n=tt,tt=l,n!==null&&(tt===null?tt=n:tt.push.apply(tt,n))}l=s}if(n=!1,l!==2)continue}}if(l===1){ln(t,0),pa(t,e,0,!0);break}e:{switch(a=t,n=l,n){case 0:case 1:throw Error(S(345));case 4:if((e&4194048)!==e)break;case 6:pa(a,e,ht,!ma);break e;case 2:tt=null;break;case 3:case 5:break;default:throw Error(S(329))}if((e&62914560)===e&&(l=Fo+300-mt(),10<l)){if(pa(a,e,ht,!ma),zo(a,0,!0)!==0)break e;Di=e,a.timeoutHandle=C0(Ep.bind(null,a,i,tt,bo,od,e,ht,$a,tn,ma,n,"Throttled",-0,0),l);break e}Ep(a,i,tt,bo,od,e,ht,$a,tn,ma,n,null,-0,0)}}break}while(!0);si(t)}function Ep(t,e,i,a,l,n,s,r,o,u,d,p,f,y){if(t.timeoutHandle=-1,p=e.subtreeFlags,p&8192||(p&16785408)===16785408){p={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:zi},Wg(e,n,p);var G=(n&62914560)===n?Fo-mt():(n&4194048)===n?i0-mt():0;if(G=p2(p,G),G!==null){Di=n,t.cancelPendingCommit=G(Cp.bind(null,t,e,n,i,a,l,s,r,o,d,p,null,f,y)),pa(t,n,s,!u);return}}Cp(t,e,n,i,a,l,s,r,o)}function NS(t){for(var e=t;;){var i=e.tag;if((i===0||i===11||i===15)&&e.flags&16384&&(i=e.updateQueue,i!==null&&(i=i.stores,i!==null)))for(var a=0;a<i.length;a++){var l=i[a],n=l.getSnapshot;l=l.value;try{if(!vt(n(),l))return!1}catch{return!1}}if(i=e.child,e.subtreeFlags&16384&&i!==null)i.return=e,e=i;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function pa(t,e,i,a){e&=~cf,e&=~$a,t.suspendedLanes|=e,t.pingedLanes&=~e,a&&(t.warmLanes|=e),a=t.expirationTimes;for(var l=e;0<l;){var n=31-yt(l),s=1<<n;a[n]=-1,l&=~s}i!==0&&uy(t,i,e)}function Xo(){return(ee&6)===0?(Bs(0,!1),!1):!0}function df(){if(X!==null){if(ae===0)var t=X.return;else t=X,Pi=ul=null,kd(t),Zl=null,xs=0,t=X;for(;t!==null;)Bg(t.alternate,t),t=t.return;X=null}}function ln(t,e){var i=t.timeoutHandle;i!==-1&&(t.timeoutHandle=-1,JS(i)),i=t.cancelPendingCommit,i!==null&&(t.cancelPendingCommit=null,i()),Di=0,df(),re=t,X=i=_i(t.current,null),j=e,ae=0,ct=null,ma=!1,dn=Ps(t,e),uf=!1,tn=ht=cf=$a=Aa=xe=0,tt=fs=null,od=!1,(e&8)!==0&&(e|=e&32);var a=t.entangledLanes;if(a!==0)for(t=t.entanglements,a&=e;0<a;){var l=31-yt(a),n=1<<l;e|=t[l],a&=~n}return Ui=e,Do(),i}function s0(t,e){U=null,_.H=Es,e===cn||e===Ho?(e=tp(),ae=3):e===Xd?(e=tp(),ae=4):ae=e===nf?8:e!==null&&typeof e=="object"&&typeof e.then=="function"?6:1,ct=e,X===null&&(xe=1,po(t,Ot(e,t.current)))}function r0(){var t=bt.current;return t===null?!0:(j&4194048)===j?Lt===null:(j&62914560)===j||(j&536870912)!==0?t===Lt:!1}function o0(){var t=_.H;return _.H=Es,t===null?Es:t}function u0(){var t=_.A;return _.A=PS,t}function Mo(){xe=4,ma||(j&4194048)!==j&&bt.current!==null||(dn=!0),(Aa&134217727)===0&&($a&134217727)===0||re===null||pa(re,j,ht,!1)}function xc(t,e,i){var a=ee;ee|=2;var l=o0(),n=u0();(re!==t||j!==e)&&(bo=null,ln(t,e)),e=!1;var s=xe;e:do try{if(ae!==0&&X!==null){var r=X,o=ct;switch(ae){case 8:df(),s=6;break e;case 3:case 2:case 9:case 6:bt.current===null&&(e=!0);var u=ae;if(ae=0,ct=null,Fl(t,r,o,u),i&&dn){s=0;break e}break;default:u=ae,ae=0,ct=null,Fl(t,r,o,u)}}DS(),s=xe;break}catch(d){s0(t,d)}while(!0);return e&&t.shellSuspendCounter++,Pi=ul=null,ee=a,_.H=l,_.A=n,X===null&&(re=null,j=0,Do()),s}function DS(){for(;X!==null;)c0(X)}function OS(t,e){var i=ee;ee|=2;var a=o0(),l=u0();re!==t||j!==e?(bo=null,vo=mt()+500,ln(t,e)):dn=Ps(t,e);e:do try{if(ae!==0&&X!==null){e=X;var n=ct;t:switch(ae){case 1:ae=0,ct=null,Fl(t,e,n,1);break;case 2:case 9:if(ep(n)){ae=0,ct=null,Gp(e);break}e=function(){ae!==2&&ae!==9||re!==t||(ae=7),si(t)},n.then(e,e);break e;case 3:ae=7;break e;case 4:ae=5;break e;case 7:ep(n)?(ae=0,ct=null,Gp(e)):(ae=0,ct=null,Fl(t,e,n,7));break;case 5:var s=null;switch(X.tag){case 26:s=X.memoizedState;case 5:case 27:var r=X;if(s?z0(s):r.stateNode.complete){ae=0,ct=null;var o=r.sibling;if(o!==null)X=o;else{var u=r.return;u!==null?(X=u,qo(u)):X=null}break t}}ae=0,ct=null,Fl(t,e,n,5);break;case 6:ae=0,ct=null,Fl(t,e,n,6);break;case 8:df(),xe=6;break e;default:throw Error(S(462))}}HS();break}catch(d){s0(t,d)}while(!0);return Pi=ul=null,_.H=a,_.A=l,ee=i,X!==null?0:(re=null,j=0,Do(),xe)}function HS(){for(;X!==null&&!nx();)c0(X)}function c0(t){var e=Lg(t.alternate,t,Ui);t.memoizedProps=t.pendingProps,e===null?qo(t):X=e}function Gp(t){var e=t,i=e.alternate;switch(e.tag){case 15:case 0:e=gp(i,e,e.pendingProps,e.type,void 0,j);break;case 11:e=gp(i,e,e.pendingProps,e.type.render,e.ref,j);break;case 5:kd(e);default:Bg(i,e),e=X=By(e,Ui),e=Lg(i,e,Ui)}t.memoizedProps=t.pendingProps,e===null?qo(t):X=e}function Fl(t,e,i,a){Pi=ul=null,kd(e),Zl=null,xs=0;var l=e.return;try{if(GS(t,l,e,i,j)){xe=1,po(t,Ot(i,t.current)),X=null;return}}catch(n){if(l!==null)throw X=l,n;xe=1,po(t,Ot(i,t.current)),X=null;return}e.flags&32768?(Q||a===1?t=!0:dn||(j&536870912)!==0?t=!1:(ma=t=!0,(a===2||a===9||a===3||a===6)&&(a=bt.current,a!==null&&a.tag===13&&(a.flags|=16384))),d0(e,t)):qo(e)}function qo(t){var e=t;do{if((e.flags&32768)!==0){d0(e,ma);return}t=e.return;var i=wS(e.alternate,e,Ui);if(i!==null){X=i;return}if(e=e.sibling,e!==null){X=e;return}X=e=t}while(e!==null);xe===0&&(xe=5)}function d0(t,e){do{var i=RS(t.alternate,t);if(i!==null){i.flags&=32767,X=i;return}if(i=t.return,i!==null&&(i.flags|=32768,i.subtreeFlags=0,i.deletions=null),!e&&(t=t.sibling,t!==null)){X=t;return}X=t=i}while(t!==null);xe=6,X=null}function Cp(t,e,i,a,l,n,s,r,o){t.cancelPendingCommit=null;do jo();while(Ne!==0);if((ee&6)!==0)throw Error(S(327));if(e!==null){if(e===t.current)throw Error(S(177));if(n=e.lanes|e.childLanes,n|=Od,px(t,i,n,s,r,o),t===re&&(X=re=null,j=0),an=e,Sa=t,Di=i,ud=n,cd=l,a0=a,(e.subtreeFlags&10256)!==0||(e.flags&10256)!==0?(t.callbackNode=null,t.callbackPriority=0,YS(ao,function(){return y0(),null})):(t.callbackNode=null,t.callbackPriority=0),a=(e.flags&13878)!==0,(e.subtreeFlags&13878)!==0||a){a=_.T,_.T=null,l=te.p,te.p=2,s=ee,ee|=4;try{AS(t,e,i)}finally{ee=s,te.p=l,_.T=a}}Ne=1,f0(),h0(),m0()}}function f0(){if(Ne===1){Ne=0;var t=Sa,e=an,i=(e.flags&13878)!==0;if((e.subtreeFlags&13878)!==0||i){i=_.T,_.T=null;var a=te.p;te.p=2;var l=ee;ee|=4;try{kg(e,t);var n=pd,s=zy(t.containerInfo),r=n.focusedElem,o=n.selectionRange;if(s!==r&&r&&r.ownerDocument&&Ay(r.ownerDocument.documentElement,r)){if(o!==null&&Dd(r)){var u=o.start,d=o.end;if(d===void 0&&(d=u),"selectionStart"in r)r.selectionStart=u,r.selectionEnd=Math.min(d,r.value.length);else{var p=r.ownerDocument||document,f=p&&p.defaultView||window;if(f.getSelection){var y=f.getSelection(),G=r.textContent.length,C=Math.min(o.start,G),O=o.end===void 0?C:Math.min(o.end,G);!y.extend&&C>O&&(s=O,O=C,C=s);var h=Im(r,C),c=Im(r,O);if(h&&c&&(y.rangeCount!==1||y.anchorNode!==h.node||y.anchorOffset!==h.offset||y.focusNode!==c.node||y.focusOffset!==c.offset)){var m=p.createRange();m.setStart(h.node,h.offset),y.removeAllRanges(),C>O?(y.addRange(m),y.extend(c.node,c.offset)):(m.setEnd(c.node,c.offset),y.addRange(m))}}}}for(p=[],y=r;y=y.parentNode;)y.nodeType===1&&p.push({element:y,left:y.scrollLeft,top:y.scrollTop});for(typeof r.focus=="function"&&r.focus(),r=0;r<p.length;r++){var v=p[r];v.element.scrollLeft=v.left,v.element.scrollTop=v.top}}Ro=!!md,pd=md=null}finally{ee=l,te.p=a,_.T=i}}t.current=e,Ne=2}}function h0(){if(Ne===2){Ne=0;var t=Sa,e=an,i=(e.flags&8772)!==0;if((e.subtreeFlags&8772)!==0||i){i=_.T,_.T=null;var a=te.p;te.p=2;var l=ee;ee|=4;try{jg(t,e.alternate,e)}finally{ee=l,te.p=a,_.T=i}}Ne=3}}function m0(){if(Ne===4||Ne===3){Ne=0,sx();var t=Sa,e=an,i=Di,a=a0;(e.subtreeFlags&10256)!==0||(e.flags&10256)!==0?Ne=5:(Ne=0,an=Sa=null,p0(t,t.pendingLanes));var l=t.pendingLanes;if(l===0&&(xa=null),wd(i),e=e.stateNode,pt&&typeof pt.onCommitFiberRoot=="function")try{pt.onCommitFiberRoot(zs,e,void 0,(e.current.flags&128)===128)}catch{}if(a!==null){e=_.T,l=te.p,te.p=2,_.T=null;try{for(var n=t.onRecoverableError,s=0;s<a.length;s++){var r=a[s];n(r.value,{componentStack:r.stack})}}finally{_.T=e,te.p=l}}(Di&3)!==0&&jo(),si(t),l=t.pendingLanes,(i&261930)!==0&&(l&42)!==0?t===dd?hs++:(hs=0,dd=t):hs=0,Bs(0,!1)}}function p0(t,e){(t.pooledCacheLanes&=e)===0&&(e=t.pooledCache,e!=null&&(t.pooledCache=null,Os(e)))}function jo(){return f0(),h0(),m0(),y0()}function y0(){if(Ne!==5)return!1;var t=Sa,e=ud;ud=0;var i=wd(Di),a=_.T,l=te.p;try{te.p=32>i?32:i,_.T=null,i=cd,cd=null;var n=Sa,s=Di;if(Ne=0,an=Sa=null,Di=0,(ee&6)!==0)throw Error(S(331));var r=ee;if(ee|=4,e0(n.current),Jg(n,n.current,s,i),ee=r,Bs(0,!1),pt&&typeof pt.onPostCommitFiberRoot=="function")try{pt.onPostCommitFiberRoot(zs,n)}catch{}return!0}finally{te.p=l,_.T=a,p0(t,e)}}function Tp(t,e,i){e=Ot(i,e),e=ld(t.stateNode,e,2),t=Ma(t,e,2),t!==null&&(_s(t,2),si(t))}function le(t,e,i){if(t.tag===3)Tp(t,t,i);else for(;e!==null;){if(e.tag===3){Tp(e,t,i);break}else if(e.tag===1){var a=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof a.componentDidCatch=="function"&&(xa===null||!xa.has(a))){t=Ot(i,t),i=Pg(2),a=Ma(e,i,2),a!==null&&(_g(i,a,e,t),_s(a,2),si(a));break}}e=e.return}}function Sc(t,e,i){var a=t.pingCache;if(a===null){a=t.pingCache=new _S;var l=new Set;a.set(e,l)}else l=a.get(e),l===void 0&&(l=new Set,a.set(e,l));l.has(i)||(uf=!0,l.add(i),t=LS.bind(null,t,e,i),e.then(t,t))}function LS(t,e,i){var a=t.pingCache;a!==null&&a.delete(e),t.pingedLanes|=t.suspendedLanes&i,t.warmLanes&=~i,re===t&&(j&i)===i&&(xe===4||xe===3&&(j&62914560)===j&&300>mt()-Fo?(ee&2)===0&&ln(t,0):cf|=i,tn===j&&(tn=0)),si(t)}function g0(t,e){e===0&&(e=oy()),t=ol(t,e),t!==null&&(_s(t,e),si(t))}function BS(t){var e=t.memoizedState,i=0;e!==null&&(i=e.retryLane),g0(t,i)}function US(t,e){var i=0;switch(t.tag){case 31:case 13:var a=t.stateNode,l=t.memoizedState;l!==null&&(i=l.retryLane);break;case 19:a=t.stateNode;break;case 22:a=t.stateNode._retryCache;break;default:throw Error(S(314))}a!==null&&a.delete(e),g0(t,i)}function YS(t,e){return Cd(t,e)}var xo=null,Al=null,fd=!1,So=!1,Ec=!1,ya=0;function si(t){t!==Al&&t.next===null&&(Al===null?xo=Al=t:Al=Al.next=t),So=!0,fd||(fd=!0,XS())}function Bs(t,e){if(!Ec&&So){Ec=!0;do for(var i=!1,a=xo;a!==null;){if(!e)if(t!==0){var l=a.pendingLanes;if(l===0)var n=0;else{var s=a.suspendedLanes,r=a.pingedLanes;n=(1<<31-yt(42|t)+1)-1,n&=l&~(s&~r),n=n&201326741?n&201326741|1:n?n|2:0}n!==0&&(i=!0,wp(a,n))}else n=j,n=zo(a,a===re?n:0,a.cancelPendingCommit!==null||a.timeoutHandle!==-1),(n&3)===0||Ps(a,n)||(i=!0,wp(a,n));a=a.next}while(i);Ec=!1}}function FS(){v0()}function v0(){So=fd=!1;var t=0;ya!==0&&KS()&&(t=ya);for(var e=mt(),i=null,a=xo;a!==null;){var l=a.next,n=b0(a,e);n===0?(a.next=null,i===null?xo=l:i.next=l,l===null&&(Al=i)):(i=a,(t!==0||(n&3)!==0)&&(So=!0)),a=l}Ne!==0&&Ne!==5||Bs(t,!1),ya!==0&&(ya=0)}function b0(t,e){for(var i=t.suspendedLanes,a=t.pingedLanes,l=t.expirationTimes,n=t.pendingLanes&-62914561;0<n;){var s=31-yt(n),r=1<<s,o=l[s];o===-1?((r&i)===0||(r&a)!==0)&&(l[s]=mx(r,e)):o<=e&&(t.expiredLanes|=r),n&=~r}if(e=re,i=j,i=zo(t,t===e?i:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),a=t.callbackNode,i===0||t===e&&(ae===2||ae===9)||t.cancelPendingCommit!==null)return a!==null&&a!==null&&Wu(a),t.callbackNode=null,t.callbackPriority=0;if((i&3)===0||Ps(t,i)){if(e=i&-i,e===t.callbackPriority)return e;switch(a!==null&&Wu(a),wd(i)){case 2:case 8:i=sy;break;case 32:i=ao;break;case 268435456:i=ry;break;default:i=ao}return a=M0.bind(null,t),i=Cd(i,a),t.callbackPriority=e,t.callbackNode=i,e}return a!==null&&a!==null&&Wu(a),t.callbackPriority=2,t.callbackNode=null,2}function M0(t,e){if(Ne!==0&&Ne!==5)return t.callbackNode=null,t.callbackPriority=0,null;var i=t.callbackNode;if(jo()&&t.callbackNode!==i)return null;var a=j;return a=zo(t,t===re?a:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),a===0?null:(n0(t,a,e),b0(t,mt()),t.callbackNode!=null&&t.callbackNode===i?M0.bind(null,t):null)}function wp(t,e){if(jo())return null;n0(t,e,!0)}function XS(){WS(function(){(ee&6)!==0?Cd(ny,FS):v0()})}function ff(){if(ya===0){var t=Wl;t===0&&(t=Sr,Sr<<=1,(Sr&261888)===0&&(Sr=256)),ya=t}return ya}function Rp(t){return t==null||typeof t=="symbol"||typeof t=="boolean"?null:typeof t=="function"?t:Yr(""+t)}function Ap(t,e){var i=e.ownerDocument.createElement("input");return i.name=e.name,i.value=e.value,t.id&&i.setAttribute("form",t.id),e.parentNode.insertBefore(i,e),t=new FormData(t),i.parentNode.removeChild(i),t}function qS(t,e,i,a,l){if(e==="submit"&&i&&i.stateNode===l){var n=Rp((l[at]||null).action),s=a.submitter;s&&(e=(e=s[at]||null)?Rp(e.formAction):s.getAttribute("formAction"),e!==null&&(n=e,s=null));var r=new Po("action","action",null,a,l);t.push({event:r,listeners:[{instance:null,listener:function(){if(a.defaultPrevented){if(ya!==0){var o=s?Ap(l,s):new FormData(l);id(i,{pending:!0,data:o,method:l.method,action:n},null,o)}}else typeof n=="function"&&(r.preventDefault(),o=s?Ap(l,s):new FormData(l),id(i,{pending:!0,data:o,method:l.method,action:n},n,o))},currentTarget:l}]})}}for(Dr=0;Dr<jc.length;Dr++)Or=jc[Dr],zp=Or.toLowerCase(),Pp=Or[0].toUpperCase()+Or.slice(1),Vt(zp,"on"+Pp);var Or,zp,Pp,Dr;Vt(_y,"onAnimationEnd");Vt(Ny,"onAnimationIteration");Vt(Dy,"onAnimationStart");Vt("dblclick","onDoubleClick");Vt("focusin","onFocus");Vt("focusout","onBlur");Vt(rS,"onTransitionRun");Vt(oS,"onTransitionStart");Vt(uS,"onTransitionCancel");Vt(Oy,"onTransitionEnd");Kl("onMouseEnter",["mouseout","mouseover"]);Kl("onMouseLeave",["mouseout","mouseover"]);Kl("onPointerEnter",["pointerout","pointerover"]);Kl("onPointerLeave",["pointerout","pointerover"]);nl("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));nl("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));nl("onBeforeInput",["compositionend","keypress","textInput","paste"]);nl("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));nl("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));nl("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Gs="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),jS=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Gs));function x0(t,e){e=(e&4)!==0;for(var i=0;i<t.length;i++){var a=t[i],l=a.event;a=a.listeners;e:{var n=void 0;if(e)for(var s=a.length-1;0<=s;s--){var r=a[s],o=r.instance,u=r.currentTarget;if(r=r.listener,o!==n&&l.isPropagationStopped())break e;n=r,l.currentTarget=u;try{n(l)}catch(d){no(d)}l.currentTarget=null,n=o}else for(s=0;s<a.length;s++){if(r=a[s],o=r.instance,u=r.currentTarget,r=r.listener,o!==n&&l.isPropagationStopped())break e;n=r,l.currentTarget=u;try{n(l)}catch(d){no(d)}l.currentTarget=null,n=o}}}}function F(t,e){var i=e[Hc];i===void 0&&(i=e[Hc]=new Set);var a=t+"__bubble";i.has(a)||(S0(e,t,2,!1),i.add(a))}function Gc(t,e,i){var a=0;e&&(a|=4),S0(i,t,a,e)}var Hr="_reactListening"+Math.random().toString(36).slice(2);function hf(t){if(!t[Hr]){t[Hr]=!0,hy.forEach(function(i){i!=="selectionchange"&&(jS.has(i)||Gc(i,!1,t),Gc(i,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[Hr]||(e[Hr]=!0,Gc("selectionchange",!1,e))}}function S0(t,e,i,a){switch(O0(e)){case 2:var l=v2;break;case 8:l=b2;break;default:l=gf}i=l.bind(null,e,i,t),l=void 0,!Fc||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(l=!0),a?l!==void 0?t.addEventListener(e,i,{capture:!0,passive:l}):t.addEventListener(e,i,!0):l!==void 0?t.addEventListener(e,i,{passive:l}):t.addEventListener(e,i,!1)}function Cc(t,e,i,a,l){var n=a;if((e&1)===0&&(e&2)===0&&a!==null)e:for(;;){if(a===null)return;var s=a.tag;if(s===3||s===4){var r=a.stateNode.containerInfo;if(r===l)break;if(s===4)for(s=a.return;s!==null;){var o=s.tag;if((o===3||o===4)&&s.stateNode.containerInfo===l)return;s=s.return}for(;r!==null;){if(s=_l(r),s===null)return;if(o=s.tag,o===5||o===6||o===26||o===27){a=n=s;continue e}r=r.parentNode}}a=a.return}xy(function(){var u=n,d=zd(i),p=[];e:{var f=Hy.get(t);if(f!==void 0){var y=Po,G=t;switch(t){case"keypress":if(Xr(i)===0)break e;case"keydown":case"keyup":y=Ux;break;case"focusin":G="focus",y=ac;break;case"focusout":G="blur",y=ac;break;case"beforeblur":case"afterblur":y=ac;break;case"click":if(i.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":y=Bm;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":y=wx;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":y=Xx;break;case _y:case Ny:case Dy:y=zx;break;case Oy:y=jx;break;case"scroll":case"scrollend":y=Cx;break;case"wheel":y=Zx;break;case"copy":case"cut":case"paste":y=_x;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":y=Ym;break;case"toggle":case"beforetoggle":y=Qx}var C=(e&4)!==0,O=!C&&(t==="scroll"||t==="scrollend"),h=C?f!==null?f+"Capture":null:f;C=[];for(var c=u,m;c!==null;){var v=c;if(m=v.stateNode,v=v.tag,v!==5&&v!==26&&v!==27||m===null||h===null||(v=ys(c,h),v!=null&&C.push(Cs(c,v,m))),O)break;c=c.return}0<C.length&&(f=new y(f,G,null,i,d),p.push({event:f,listeners:C}))}}if((e&7)===0){e:{if(f=t==="mouseover"||t==="pointerover",y=t==="mouseout"||t==="pointerout",f&&i!==Yc&&(G=i.relatedTarget||i.fromElement)&&(_l(G)||G[rn]))break e;if((y||f)&&(f=d.window===d?d:(f=d.ownerDocument)?f.defaultView||f.parentWindow:window,y?(G=i.relatedTarget||i.toElement,y=u,G=G?_l(G):null,G!==null&&(O=As(G),C=G.tag,G!==O||C!==5&&C!==27&&C!==6)&&(G=null)):(y=null,G=u),y!==G)){if(C=Bm,v="onMouseLeave",h="onMouseEnter",c="mouse",(t==="pointerout"||t==="pointerover")&&(C=Ym,v="onPointerLeave",h="onPointerEnter",c="pointer"),O=y==null?f:$n(y),m=G==null?f:$n(G),f=new C(v,c+"leave",y,i,d),f.target=O,f.relatedTarget=m,v=null,_l(d)===u&&(C=new C(h,c+"enter",G,i,d),C.target=m,C.relatedTarget=O,v=C),O=v,y&&G)t:{for(C=VS,h=y,c=G,m=0,v=h;v;v=C(v))m++;v=0;for(var w=c;w;w=C(w))v++;for(;0<m-v;)h=C(h),m--;for(;0<v-m;)c=C(c),v--;for(;m--;){if(h===c||c!==null&&h===c.alternate){C=h;break t}h=C(h),c=C(c)}C=null}else C=null;y!==null&&_p(p,f,y,C,!1),G!==null&&O!==null&&_p(p,O,G,C,!0)}}e:{if(f=u?$n(u):window,y=f.nodeName&&f.nodeName.toLowerCase(),y==="select"||y==="input"&&f.type==="file")var B=jm;else if(qm(f))if(wy)B=lS;else{B=iS;var T=tS}else y=f.nodeName,!y||y.toLowerCase()!=="input"||f.type!=="checkbox"&&f.type!=="radio"?u&&Ad(u.elementType)&&(B=jm):B=aS;if(B&&(B=B(t,u))){Ty(p,B,i,d);break e}T&&T(t,f,u),t==="focusout"&&u&&f.type==="number"&&u.memoizedProps.value!=null&&Uc(f,"number",f.value)}switch(T=u?$n(u):window,t){case"focusin":(qm(T)||T.contentEditable==="true")&&(Ol=T,Xc=u,ls=null);break;case"focusout":ls=Xc=Ol=null;break;case"mousedown":qc=!0;break;case"contextmenu":case"mouseup":case"dragend":qc=!1,Qm(p,i,d);break;case"selectionchange":if(sS)break;case"keydown":case"keyup":Qm(p,i,d)}var N;if(Nd)e:{switch(t){case"compositionstart":var E="onCompositionStart";break e;case"compositionend":E="onCompositionEnd";break e;case"compositionupdate":E="onCompositionUpdate";break e}E=void 0}else Dl?Gy(t,i)&&(E="onCompositionEnd"):t==="keydown"&&i.keyCode===229&&(E="onCompositionStart");E&&(Ey&&i.locale!=="ko"&&(Dl||E!=="onCompositionStart"?E==="onCompositionEnd"&&Dl&&(N=Sy()):(ha=d,Pd="value"in ha?ha.value:ha.textContent,Dl=!0)),T=Eo(u,E),0<T.length&&(E=new Um(E,t,null,i,d),p.push({event:E,listeners:T}),N?E.data=N:(N=Cy(i),N!==null&&(E.data=N)))),(N=Kx?Jx(t,i):Wx(t,i))&&(E=Eo(u,"onBeforeInput"),0<E.length&&(T=new Um("onBeforeInput","beforeinput",null,i,d),p.push({event:T,listeners:E}),T.data=N)),qS(p,t,u,i,d)}x0(p,e)})}function Cs(t,e,i){return{instance:t,listener:e,currentTarget:i}}function Eo(t,e){for(var i=e+"Capture",a=[];t!==null;){var l=t,n=l.stateNode;if(l=l.tag,l!==5&&l!==26&&l!==27||n===null||(l=ys(t,i),l!=null&&a.unshift(Cs(t,l,n)),l=ys(t,e),l!=null&&a.push(Cs(t,l,n))),t.tag===3)return a;t=t.return}return[]}function VS(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5&&t.tag!==27);return t||null}function _p(t,e,i,a,l){for(var n=e._reactName,s=[];i!==null&&i!==a;){var r=i,o=r.alternate,u=r.stateNode;if(r=r.tag,o!==null&&o===a)break;r!==5&&r!==26&&r!==27||u===null||(o=u,l?(u=ys(i,n),u!=null&&s.unshift(Cs(i,u,o))):l||(u=ys(i,n),u!=null&&s.push(Cs(i,u,o)))),i=i.return}s.length!==0&&t.push({event:e,listeners:s})}var ZS=/\r\n?/g,IS=/\u0000|\uFFFD/g;function Np(t){return(typeof t=="string"?t:""+t).replace(ZS,`
`).replace(IS,"")}function E0(t,e){return e=Np(e),Np(t)===e}function ne(t,e,i,a,l,n){switch(i){case"children":typeof a=="string"?e==="body"||e==="textarea"&&a===""||Jl(t,a):(typeof a=="number"||typeof a=="bigint")&&e!=="body"&&Jl(t,""+a);break;case"className":Cr(t,"class",a);break;case"tabIndex":Cr(t,"tabindex",a);break;case"dir":case"role":case"viewBox":case"width":case"height":Cr(t,i,a);break;case"style":My(t,a,n);break;case"data":if(e!=="object"){Cr(t,"data",a);break}case"src":case"href":if(a===""&&(e!=="a"||i!=="href")){t.removeAttribute(i);break}if(a==null||typeof a=="function"||typeof a=="symbol"||typeof a=="boolean"){t.removeAttribute(i);break}a=Yr(""+a),t.setAttribute(i,a);break;case"action":case"formAction":if(typeof a=="function"){t.setAttribute(i,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof n=="function"&&(i==="formAction"?(e!=="input"&&ne(t,e,"name",l.name,l,null),ne(t,e,"formEncType",l.formEncType,l,null),ne(t,e,"formMethod",l.formMethod,l,null),ne(t,e,"formTarget",l.formTarget,l,null)):(ne(t,e,"encType",l.encType,l,null),ne(t,e,"method",l.method,l,null),ne(t,e,"target",l.target,l,null)));if(a==null||typeof a=="symbol"||typeof a=="boolean"){t.removeAttribute(i);break}a=Yr(""+a),t.setAttribute(i,a);break;case"onClick":a!=null&&(t.onclick=zi);break;case"onScroll":a!=null&&F("scroll",t);break;case"onScrollEnd":a!=null&&F("scrollend",t);break;case"dangerouslySetInnerHTML":if(a!=null){if(typeof a!="object"||!("__html"in a))throw Error(S(61));if(i=a.__html,i!=null){if(l.children!=null)throw Error(S(60));t.innerHTML=i}}break;case"multiple":t.multiple=a&&typeof a!="function"&&typeof a!="symbol";break;case"muted":t.muted=a&&typeof a!="function"&&typeof a!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(a==null||typeof a=="function"||typeof a=="boolean"||typeof a=="symbol"){t.removeAttribute("xlink:href");break}i=Yr(""+a),t.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",i);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":a!=null&&typeof a!="function"&&typeof a!="symbol"?t.setAttribute(i,""+a):t.removeAttribute(i);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":a&&typeof a!="function"&&typeof a!="symbol"?t.setAttribute(i,""):t.removeAttribute(i);break;case"capture":case"download":a===!0?t.setAttribute(i,""):a!==!1&&a!=null&&typeof a!="function"&&typeof a!="symbol"?t.setAttribute(i,a):t.removeAttribute(i);break;case"cols":case"rows":case"size":case"span":a!=null&&typeof a!="function"&&typeof a!="symbol"&&!isNaN(a)&&1<=a?t.setAttribute(i,a):t.removeAttribute(i);break;case"rowSpan":case"start":a==null||typeof a=="function"||typeof a=="symbol"||isNaN(a)?t.removeAttribute(i):t.setAttribute(i,a);break;case"popover":F("beforetoggle",t),F("toggle",t),Ur(t,"popover",a);break;case"xlinkActuate":Si(t,"http://www.w3.org/1999/xlink","xlink:actuate",a);break;case"xlinkArcrole":Si(t,"http://www.w3.org/1999/xlink","xlink:arcrole",a);break;case"xlinkRole":Si(t,"http://www.w3.org/1999/xlink","xlink:role",a);break;case"xlinkShow":Si(t,"http://www.w3.org/1999/xlink","xlink:show",a);break;case"xlinkTitle":Si(t,"http://www.w3.org/1999/xlink","xlink:title",a);break;case"xlinkType":Si(t,"http://www.w3.org/1999/xlink","xlink:type",a);break;case"xmlBase":Si(t,"http://www.w3.org/XML/1998/namespace","xml:base",a);break;case"xmlLang":Si(t,"http://www.w3.org/XML/1998/namespace","xml:lang",a);break;case"xmlSpace":Si(t,"http://www.w3.org/XML/1998/namespace","xml:space",a);break;case"is":Ur(t,"is",a);break;case"innerText":case"textContent":break;default:(!(2<i.length)||i[0]!=="o"&&i[0]!=="O"||i[1]!=="n"&&i[1]!=="N")&&(i=Ex.get(i)||i,Ur(t,i,a))}}function hd(t,e,i,a,l,n){switch(i){case"style":My(t,a,n);break;case"dangerouslySetInnerHTML":if(a!=null){if(typeof a!="object"||!("__html"in a))throw Error(S(61));if(i=a.__html,i!=null){if(l.children!=null)throw Error(S(60));t.innerHTML=i}}break;case"children":typeof a=="string"?Jl(t,a):(typeof a=="number"||typeof a=="bigint")&&Jl(t,""+a);break;case"onScroll":a!=null&&F("scroll",t);break;case"onScrollEnd":a!=null&&F("scrollend",t);break;case"onClick":a!=null&&(t.onclick=zi);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!my.hasOwnProperty(i))e:{if(i[0]==="o"&&i[1]==="n"&&(l=i.endsWith("Capture"),e=i.slice(2,l?i.length-7:void 0),n=t[at]||null,n=n!=null?n[i]:null,typeof n=="function"&&t.removeEventListener(e,n,l),typeof a=="function")){typeof n!="function"&&n!==null&&(i in t?t[i]=null:t.hasAttribute(i)&&t.removeAttribute(i)),t.addEventListener(e,a,l);break e}i in t?t[i]=a:a===!0?t.setAttribute(i,""):Ur(t,i,a)}}}function je(t,e,i){switch(e){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":F("error",t),F("load",t);var a=!1,l=!1,n;for(n in i)if(i.hasOwnProperty(n)){var s=i[n];if(s!=null)switch(n){case"src":a=!0;break;case"srcSet":l=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(S(137,e));default:ne(t,e,n,s,i,null)}}l&&ne(t,e,"srcSet",i.srcSet,i,null),a&&ne(t,e,"src",i.src,i,null);return;case"input":F("invalid",t);var r=n=s=l=null,o=null,u=null;for(a in i)if(i.hasOwnProperty(a)){var d=i[a];if(d!=null)switch(a){case"name":l=d;break;case"type":s=d;break;case"checked":o=d;break;case"defaultChecked":u=d;break;case"value":n=d;break;case"defaultValue":r=d;break;case"children":case"dangerouslySetInnerHTML":if(d!=null)throw Error(S(137,e));break;default:ne(t,e,a,d,i,null)}}gy(t,n,r,o,u,s,l,!1);return;case"select":F("invalid",t),a=s=n=null;for(l in i)if(i.hasOwnProperty(l)&&(r=i[l],r!=null))switch(l){case"value":n=r;break;case"defaultValue":s=r;break;case"multiple":a=r;default:ne(t,e,l,r,i,null)}e=n,i=s,t.multiple=!!a,e!=null?ql(t,!!a,e,!1):i!=null&&ql(t,!!a,i,!0);return;case"textarea":F("invalid",t),n=l=a=null;for(s in i)if(i.hasOwnProperty(s)&&(r=i[s],r!=null))switch(s){case"value":a=r;break;case"defaultValue":l=r;break;case"children":n=r;break;case"dangerouslySetInnerHTML":if(r!=null)throw Error(S(91));break;default:ne(t,e,s,r,i,null)}by(t,a,l,n);return;case"option":for(o in i)i.hasOwnProperty(o)&&(a=i[o],a!=null)&&(o==="selected"?t.selected=a&&typeof a!="function"&&typeof a!="symbol":ne(t,e,o,a,i,null));return;case"dialog":F("beforetoggle",t),F("toggle",t),F("cancel",t),F("close",t);break;case"iframe":case"object":F("load",t);break;case"video":case"audio":for(a=0;a<Gs.length;a++)F(Gs[a],t);break;case"image":F("error",t),F("load",t);break;case"details":F("toggle",t);break;case"embed":case"source":case"link":F("error",t),F("load",t);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(u in i)if(i.hasOwnProperty(u)&&(a=i[u],a!=null))switch(u){case"children":case"dangerouslySetInnerHTML":throw Error(S(137,e));default:ne(t,e,u,a,i,null)}return;default:if(Ad(e)){for(d in i)i.hasOwnProperty(d)&&(a=i[d],a!==void 0&&hd(t,e,d,a,i,void 0));return}}for(r in i)i.hasOwnProperty(r)&&(a=i[r],a!=null&&ne(t,e,r,a,i,null))}function QS(t,e,i,a){switch(e){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var l=null,n=null,s=null,r=null,o=null,u=null,d=null;for(y in i){var p=i[y];if(i.hasOwnProperty(y)&&p!=null)switch(y){case"checked":break;case"value":break;case"defaultValue":o=p;default:a.hasOwnProperty(y)||ne(t,e,y,null,a,p)}}for(var f in a){var y=a[f];if(p=i[f],a.hasOwnProperty(f)&&(y!=null||p!=null))switch(f){case"type":n=y;break;case"name":l=y;break;case"checked":u=y;break;case"defaultChecked":d=y;break;case"value":s=y;break;case"defaultValue":r=y;break;case"children":case"dangerouslySetInnerHTML":if(y!=null)throw Error(S(137,e));break;default:y!==p&&ne(t,e,f,y,a,p)}}Bc(t,s,r,o,u,d,n,l);return;case"select":y=s=r=f=null;for(n in i)if(o=i[n],i.hasOwnProperty(n)&&o!=null)switch(n){case"value":break;case"multiple":y=o;default:a.hasOwnProperty(n)||ne(t,e,n,null,a,o)}for(l in a)if(n=a[l],o=i[l],a.hasOwnProperty(l)&&(n!=null||o!=null))switch(l){case"value":f=n;break;case"defaultValue":r=n;break;case"multiple":s=n;default:n!==o&&ne(t,e,l,n,a,o)}e=r,i=s,a=y,f!=null?ql(t,!!i,f,!1):!!a!=!!i&&(e!=null?ql(t,!!i,e,!0):ql(t,!!i,i?[]:"",!1));return;case"textarea":y=f=null;for(r in i)if(l=i[r],i.hasOwnProperty(r)&&l!=null&&!a.hasOwnProperty(r))switch(r){case"value":break;case"children":break;default:ne(t,e,r,null,a,l)}for(s in a)if(l=a[s],n=i[s],a.hasOwnProperty(s)&&(l!=null||n!=null))switch(s){case"value":f=l;break;case"defaultValue":y=l;break;case"children":break;case"dangerouslySetInnerHTML":if(l!=null)throw Error(S(91));break;default:l!==n&&ne(t,e,s,l,a,n)}vy(t,f,y);return;case"option":for(var G in i)f=i[G],i.hasOwnProperty(G)&&f!=null&&!a.hasOwnProperty(G)&&(G==="selected"?t.selected=!1:ne(t,e,G,null,a,f));for(o in a)f=a[o],y=i[o],a.hasOwnProperty(o)&&f!==y&&(f!=null||y!=null)&&(o==="selected"?t.selected=f&&typeof f!="function"&&typeof f!="symbol":ne(t,e,o,f,a,y));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var C in i)f=i[C],i.hasOwnProperty(C)&&f!=null&&!a.hasOwnProperty(C)&&ne(t,e,C,null,a,f);for(u in a)if(f=a[u],y=i[u],a.hasOwnProperty(u)&&f!==y&&(f!=null||y!=null))switch(u){case"children":case"dangerouslySetInnerHTML":if(f!=null)throw Error(S(137,e));break;default:ne(t,e,u,f,a,y)}return;default:if(Ad(e)){for(var O in i)f=i[O],i.hasOwnProperty(O)&&f!==void 0&&!a.hasOwnProperty(O)&&hd(t,e,O,void 0,a,f);for(d in a)f=a[d],y=i[d],!a.hasOwnProperty(d)||f===y||f===void 0&&y===void 0||hd(t,e,d,f,a,y);return}}for(var h in i)f=i[h],i.hasOwnProperty(h)&&f!=null&&!a.hasOwnProperty(h)&&ne(t,e,h,null,a,f);for(p in a)f=a[p],y=i[p],!a.hasOwnProperty(p)||f===y||f==null&&y==null||ne(t,e,p,f,a,y)}function Dp(t){switch(t){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function kS(){if(typeof performance.getEntriesByType=="function"){for(var t=0,e=0,i=performance.getEntriesByType("resource"),a=0;a<i.length;a++){var l=i[a],n=l.transferSize,s=l.initiatorType,r=l.duration;if(n&&r&&Dp(s)){for(s=0,r=l.responseEnd,a+=1;a<i.length;a++){var o=i[a],u=o.startTime;if(u>r)break;var d=o.transferSize,p=o.initiatorType;d&&Dp(p)&&(o=o.responseEnd,s+=d*(o<r?1:(r-u)/(o-u)))}if(--a,e+=8*(n+s)/(l.duration/1e3),t++,10<t)break}}if(0<t)return e/t/1e6}return navigator.connection&&(t=navigator.connection.downlink,typeof t=="number")?t:5}var md=null,pd=null;function Go(t){return t.nodeType===9?t:t.ownerDocument}function Op(t){switch(t){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function G0(t,e){if(t===0)switch(e){case"svg":return 1;case"math":return 2;default:return 0}return t===1&&e==="foreignObject"?0:t}function yd(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.children=="bigint"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var Tc=null;function KS(){var t=window.event;return t&&t.type==="popstate"?t===Tc?!1:(Tc=t,!0):(Tc=null,!1)}var C0=typeof setTimeout=="function"?setTimeout:void 0,JS=typeof clearTimeout=="function"?clearTimeout:void 0,Hp=typeof Promise=="function"?Promise:void 0,WS=typeof queueMicrotask=="function"?queueMicrotask:typeof Hp<"u"?function(t){return Hp.resolve(null).then(t).catch($S)}:C0;function $S(t){setTimeout(function(){throw t})}function Pa(t){return t==="head"}function Lp(t,e){var i=e,a=0;do{var l=i.nextSibling;if(t.removeChild(i),l&&l.nodeType===8)if(i=l.data,i==="/$"||i==="/&"){if(a===0){t.removeChild(l),sn(e);return}a--}else if(i==="$"||i==="$?"||i==="$~"||i==="$!"||i==="&")a++;else if(i==="html")ms(t.ownerDocument.documentElement);else if(i==="head"){i=t.ownerDocument.head,ms(i);for(var n=i.firstChild;n;){var s=n.nextSibling,r=n.nodeName;n[Ns]||r==="SCRIPT"||r==="STYLE"||r==="LINK"&&n.rel.toLowerCase()==="stylesheet"||i.removeChild(n),n=s}}else i==="body"&&ms(t.ownerDocument.body);i=l}while(i);sn(e)}function Bp(t,e){var i=t;t=0;do{var a=i.nextSibling;if(i.nodeType===1?e?(i._stashedDisplay=i.style.display,i.style.display="none"):(i.style.display=i._stashedDisplay||"",i.getAttribute("style")===""&&i.removeAttribute("style")):i.nodeType===3&&(e?(i._stashedText=i.nodeValue,i.nodeValue=""):i.nodeValue=i._stashedText||""),a&&a.nodeType===8)if(i=a.data,i==="/$"){if(t===0)break;t--}else i!=="$"&&i!=="$?"&&i!=="$~"&&i!=="$!"||t++;i=a}while(i)}function gd(t){var e=t.firstChild;for(e&&e.nodeType===10&&(e=e.nextSibling);e;){var i=e;switch(e=e.nextSibling,i.nodeName){case"HTML":case"HEAD":case"BODY":gd(i),Rd(i);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(i.rel.toLowerCase()==="stylesheet")continue}t.removeChild(i)}}function e2(t,e,i,a){for(;t.nodeType===1;){var l=i;if(t.nodeName.toLowerCase()!==e.toLowerCase()){if(!a&&(t.nodeName!=="INPUT"||t.type!=="hidden"))break}else if(a){if(!t[Ns])switch(e){case"meta":if(!t.hasAttribute("itemprop"))break;return t;case"link":if(n=t.getAttribute("rel"),n==="stylesheet"&&t.hasAttribute("data-precedence"))break;if(n!==l.rel||t.getAttribute("href")!==(l.href==null||l.href===""?null:l.href)||t.getAttribute("crossorigin")!==(l.crossOrigin==null?null:l.crossOrigin)||t.getAttribute("title")!==(l.title==null?null:l.title))break;return t;case"style":if(t.hasAttribute("data-precedence"))break;return t;case"script":if(n=t.getAttribute("src"),(n!==(l.src==null?null:l.src)||t.getAttribute("type")!==(l.type==null?null:l.type)||t.getAttribute("crossorigin")!==(l.crossOrigin==null?null:l.crossOrigin))&&n&&t.hasAttribute("async")&&!t.hasAttribute("itemprop"))break;return t;default:return t}}else if(e==="input"&&t.type==="hidden"){var n=l.name==null?null:""+l.name;if(l.type==="hidden"&&t.getAttribute("name")===n)return t}else return t;if(t=Bt(t.nextSibling),t===null)break}return null}function t2(t,e,i){if(e==="")return null;for(;t.nodeType!==3;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!i||(t=Bt(t.nextSibling),t===null))return null;return t}function T0(t,e){for(;t.nodeType!==8;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!e||(t=Bt(t.nextSibling),t===null))return null;return t}function vd(t){return t.data==="$?"||t.data==="$~"}function bd(t){return t.data==="$!"||t.data==="$?"&&t.ownerDocument.readyState!=="loading"}function i2(t,e){var i=t.ownerDocument;if(t.data==="$~")t._reactRetry=e;else if(t.data!=="$?"||i.readyState!=="loading")e();else{var a=function(){e(),i.removeEventListener("DOMContentLoaded",a)};i.addEventListener("DOMContentLoaded",a),t._reactRetry=a}}function Bt(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?"||e==="$~"||e==="&"||e==="F!"||e==="F")break;if(e==="/$"||e==="/&")return null}}return t}var Md=null;function Up(t){t=t.nextSibling;for(var e=0;t;){if(t.nodeType===8){var i=t.data;if(i==="/$"||i==="/&"){if(e===0)return Bt(t.nextSibling);e--}else i!=="$"&&i!=="$!"&&i!=="$?"&&i!=="$~"&&i!=="&"||e++}t=t.nextSibling}return null}function Yp(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var i=t.data;if(i==="$"||i==="$!"||i==="$?"||i==="$~"||i==="&"){if(e===0)return t;e--}else i!=="/$"&&i!=="/&"||e++}t=t.previousSibling}return null}function w0(t,e,i){switch(e=Go(i),t){case"html":if(t=e.documentElement,!t)throw Error(S(452));return t;case"head":if(t=e.head,!t)throw Error(S(453));return t;case"body":if(t=e.body,!t)throw Error(S(454));return t;default:throw Error(S(451))}}function ms(t){for(var e=t.attributes;e.length;)t.removeAttributeNode(e[0]);Rd(t)}var Ut=new Map,Fp=new Set;function Co(t){return typeof t.getRootNode=="function"?t.getRootNode():t.nodeType===9?t:t.ownerDocument}var Yi=te.d;te.d={f:a2,r:l2,D:n2,C:s2,L:r2,m:o2,X:c2,S:u2,M:d2};function a2(){var t=Yi.f(),e=Xo();return t||e}function l2(t){var e=on(t);e!==null&&e.tag===5&&e.type==="form"?Mg(e):Yi.r(t)}var fn=typeof document>"u"?null:document;function R0(t,e,i){var a=fn;if(a&&typeof e=="string"&&e){var l=Dt(e);l='link[rel="'+t+'"][href="'+l+'"]',typeof i=="string"&&(l+='[crossorigin="'+i+'"]'),Fp.has(l)||(Fp.add(l),t={rel:t,crossOrigin:i,href:e},a.querySelector(l)===null&&(e=a.createElement("link"),je(e,"link",t),Le(e),a.head.appendChild(e)))}}function n2(t){Yi.D(t),R0("dns-prefetch",t,null)}function s2(t,e){Yi.C(t,e),R0("preconnect",t,e)}function r2(t,e,i){Yi.L(t,e,i);var a=fn;if(a&&t&&e){var l='link[rel="preload"][as="'+Dt(e)+'"]';e==="image"&&i&&i.imageSrcSet?(l+='[imagesrcset="'+Dt(i.imageSrcSet)+'"]',typeof i.imageSizes=="string"&&(l+='[imagesizes="'+Dt(i.imageSizes)+'"]')):l+='[href="'+Dt(t)+'"]';var n=l;switch(e){case"style":n=nn(t);break;case"script":n=hn(t)}Ut.has(n)||(t=he({rel:"preload",href:e==="image"&&i&&i.imageSrcSet?void 0:t,as:e},i),Ut.set(n,t),a.querySelector(l)!==null||e==="style"&&a.querySelector(Us(n))||e==="script"&&a.querySelector(Ys(n))||(e=a.createElement("link"),je(e,"link",t),Le(e),a.head.appendChild(e)))}}function o2(t,e){Yi.m(t,e);var i=fn;if(i&&t){var a=e&&typeof e.as=="string"?e.as:"script",l='link[rel="modulepreload"][as="'+Dt(a)+'"][href="'+Dt(t)+'"]',n=l;switch(a){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":n=hn(t)}if(!Ut.has(n)&&(t=he({rel:"modulepreload",href:t},e),Ut.set(n,t),i.querySelector(l)===null)){switch(a){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(i.querySelector(Ys(n)))return}a=i.createElement("link"),je(a,"link",t),Le(a),i.head.appendChild(a)}}}function u2(t,e,i){Yi.S(t,e,i);var a=fn;if(a&&t){var l=Xl(a).hoistableStyles,n=nn(t);e=e||"default";var s=l.get(n);if(!s){var r={loading:0,preload:null};if(s=a.querySelector(Us(n)))r.loading=5;else{t=he({rel:"stylesheet",href:t,"data-precedence":e},i),(i=Ut.get(n))&&mf(t,i);var o=s=a.createElement("link");Le(o),je(o,"link",t),o._p=new Promise(function(u,d){o.onload=u,o.onerror=d}),o.addEventListener("load",function(){r.loading|=1}),o.addEventListener("error",function(){r.loading|=2}),r.loading|=4,Kr(s,e,a)}s={type:"stylesheet",instance:s,count:1,state:r},l.set(n,s)}}}function c2(t,e){Yi.X(t,e);var i=fn;if(i&&t){var a=Xl(i).hoistableScripts,l=hn(t),n=a.get(l);n||(n=i.querySelector(Ys(l)),n||(t=he({src:t,async:!0},e),(e=Ut.get(l))&&pf(t,e),n=i.createElement("script"),Le(n),je(n,"link",t),i.head.appendChild(n)),n={type:"script",instance:n,count:1,state:null},a.set(l,n))}}function d2(t,e){Yi.M(t,e);var i=fn;if(i&&t){var a=Xl(i).hoistableScripts,l=hn(t),n=a.get(l);n||(n=i.querySelector(Ys(l)),n||(t=he({src:t,async:!0,type:"module"},e),(e=Ut.get(l))&&pf(t,e),n=i.createElement("script"),Le(n),je(n,"link",t),i.head.appendChild(n)),n={type:"script",instance:n,count:1,state:null},a.set(l,n))}}function Xp(t,e,i,a){var l=(l=ga.current)?Co(l):null;if(!l)throw Error(S(446));switch(t){case"meta":case"title":return null;case"style":return typeof i.precedence=="string"&&typeof i.href=="string"?(e=nn(i.href),i=Xl(l).hoistableStyles,a=i.get(e),a||(a={type:"style",instance:null,count:0,state:null},i.set(e,a)),a):{type:"void",instance:null,count:0,state:null};case"link":if(i.rel==="stylesheet"&&typeof i.href=="string"&&typeof i.precedence=="string"){t=nn(i.href);var n=Xl(l).hoistableStyles,s=n.get(t);if(s||(l=l.ownerDocument||l,s={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},n.set(t,s),(n=l.querySelector(Us(t)))&&!n._p&&(s.instance=n,s.state.loading=5),Ut.has(t)||(i={rel:"preload",as:"style",href:i.href,crossOrigin:i.crossOrigin,integrity:i.integrity,media:i.media,hrefLang:i.hrefLang,referrerPolicy:i.referrerPolicy},Ut.set(t,i),n||f2(l,t,i,s.state))),e&&a===null)throw Error(S(528,""));return s}if(e&&a!==null)throw Error(S(529,""));return null;case"script":return e=i.async,i=i.src,typeof i=="string"&&e&&typeof e!="function"&&typeof e!="symbol"?(e=hn(i),i=Xl(l).hoistableScripts,a=i.get(e),a||(a={type:"script",instance:null,count:0,state:null},i.set(e,a)),a):{type:"void",instance:null,count:0,state:null};default:throw Error(S(444,t))}}function nn(t){return'href="'+Dt(t)+'"'}function Us(t){return'link[rel="stylesheet"]['+t+"]"}function A0(t){return he({},t,{"data-precedence":t.precedence,precedence:null})}function f2(t,e,i,a){t.querySelector('link[rel="preload"][as="style"]['+e+"]")?a.loading=1:(e=t.createElement("link"),a.preload=e,e.addEventListener("load",function(){return a.loading|=1}),e.addEventListener("error",function(){return a.loading|=2}),je(e,"link",i),Le(e),t.head.appendChild(e))}function hn(t){return'[src="'+Dt(t)+'"]'}function Ys(t){return"script[async]"+t}function qp(t,e,i){if(e.count++,e.instance===null)switch(e.type){case"style":var a=t.querySelector('style[data-href~="'+Dt(i.href)+'"]');if(a)return e.instance=a,Le(a),a;var l=he({},i,{"data-href":i.href,"data-precedence":i.precedence,href:null,precedence:null});return a=(t.ownerDocument||t).createElement("style"),Le(a),je(a,"style",l),Kr(a,i.precedence,t),e.instance=a;case"stylesheet":l=nn(i.href);var n=t.querySelector(Us(l));if(n)return e.state.loading|=4,e.instance=n,Le(n),n;a=A0(i),(l=Ut.get(l))&&mf(a,l),n=(t.ownerDocument||t).createElement("link"),Le(n);var s=n;return s._p=new Promise(function(r,o){s.onload=r,s.onerror=o}),je(n,"link",a),e.state.loading|=4,Kr(n,i.precedence,t),e.instance=n;case"script":return n=hn(i.src),(l=t.querySelector(Ys(n)))?(e.instance=l,Le(l),l):(a=i,(l=Ut.get(n))&&(a=he({},i),pf(a,l)),t=t.ownerDocument||t,l=t.createElement("script"),Le(l),je(l,"link",a),t.head.appendChild(l),e.instance=l);case"void":return null;default:throw Error(S(443,e.type))}else e.type==="stylesheet"&&(e.state.loading&4)===0&&(a=e.instance,e.state.loading|=4,Kr(a,i.precedence,t));return e.instance}function Kr(t,e,i){for(var a=i.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),l=a.length?a[a.length-1]:null,n=l,s=0;s<a.length;s++){var r=a[s];if(r.dataset.precedence===e)n=r;else if(n!==l)break}n?n.parentNode.insertBefore(t,n.nextSibling):(e=i.nodeType===9?i.head:i,e.insertBefore(t,e.firstChild))}function mf(t,e){t.crossOrigin==null&&(t.crossOrigin=e.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=e.referrerPolicy),t.title==null&&(t.title=e.title)}function pf(t,e){t.crossOrigin==null&&(t.crossOrigin=e.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=e.referrerPolicy),t.integrity==null&&(t.integrity=e.integrity)}var Jr=null;function jp(t,e,i){if(Jr===null){var a=new Map,l=Jr=new Map;l.set(i,a)}else l=Jr,a=l.get(i),a||(a=new Map,l.set(i,a));if(a.has(t))return a;for(a.set(t,null),i=i.getElementsByTagName(t),l=0;l<i.length;l++){var n=i[l];if(!(n[Ns]||n[Fe]||t==="link"&&n.getAttribute("rel")==="stylesheet")&&n.namespaceURI!=="http://www.w3.org/2000/svg"){var s=n.getAttribute(e)||"";s=t+s;var r=a.get(s);r?r.push(n):a.set(s,[n])}}return a}function Vp(t,e,i){t=t.ownerDocument||t,t.head.insertBefore(i,e==="title"?t.querySelector("head > title"):null)}function h2(t,e,i){if(i===1||e.itemProp!=null)return!1;switch(t){case"meta":case"title":return!0;case"style":if(typeof e.precedence!="string"||typeof e.href!="string"||e.href==="")break;return!0;case"link":if(typeof e.rel!="string"||typeof e.href!="string"||e.href===""||e.onLoad||e.onError)break;return e.rel==="stylesheet"?(t=e.disabled,typeof e.precedence=="string"&&t==null):!0;case"script":if(e.async&&typeof e.async!="function"&&typeof e.async!="symbol"&&!e.onLoad&&!e.onError&&e.src&&typeof e.src=="string")return!0}return!1}function z0(t){return!(t.type==="stylesheet"&&(t.state.loading&3)===0)}function m2(t,e,i,a){if(i.type==="stylesheet"&&(typeof a.media!="string"||matchMedia(a.media).matches!==!1)&&(i.state.loading&4)===0){if(i.instance===null){var l=nn(a.href),n=e.querySelector(Us(l));if(n){e=n._p,e!==null&&typeof e=="object"&&typeof e.then=="function"&&(t.count++,t=To.bind(t),e.then(t,t)),i.state.loading|=4,i.instance=n,Le(n);return}n=e.ownerDocument||e,a=A0(a),(l=Ut.get(l))&&mf(a,l),n=n.createElement("link"),Le(n);var s=n;s._p=new Promise(function(r,o){s.onload=r,s.onerror=o}),je(n,"link",a),i.instance=n}t.stylesheets===null&&(t.stylesheets=new Map),t.stylesheets.set(i,e),(e=i.state.preload)&&(i.state.loading&3)===0&&(t.count++,i=To.bind(t),e.addEventListener("load",i),e.addEventListener("error",i))}}var wc=0;function p2(t,e){return t.stylesheets&&t.count===0&&Wr(t,t.stylesheets),0<t.count||0<t.imgCount?function(i){var a=setTimeout(function(){if(t.stylesheets&&Wr(t,t.stylesheets),t.unsuspend){var n=t.unsuspend;t.unsuspend=null,n()}},6e4+e);0<t.imgBytes&&wc===0&&(wc=62500*kS());var l=setTimeout(function(){if(t.waitingForImages=!1,t.count===0&&(t.stylesheets&&Wr(t,t.stylesheets),t.unsuspend)){var n=t.unsuspend;t.unsuspend=null,n()}},(t.imgBytes>wc?50:800)+e);return t.unsuspend=i,function(){t.unsuspend=null,clearTimeout(a),clearTimeout(l)}}:null}function To(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)Wr(this,this.stylesheets);else if(this.unsuspend){var t=this.unsuspend;this.unsuspend=null,t()}}}var wo=null;function Wr(t,e){t.stylesheets=null,t.unsuspend!==null&&(t.count++,wo=new Map,e.forEach(y2,t),wo=null,To.call(t))}function y2(t,e){if(!(e.state.loading&4)){var i=wo.get(t);if(i)var a=i.get(null);else{i=new Map,wo.set(t,i);for(var l=t.querySelectorAll("link[data-precedence],style[data-precedence]"),n=0;n<l.length;n++){var s=l[n];(s.nodeName==="LINK"||s.getAttribute("media")!=="not all")&&(i.set(s.dataset.precedence,s),a=s)}a&&i.set(null,a)}l=e.instance,s=l.getAttribute("data-precedence"),n=i.get(s)||a,n===a&&i.set(null,l),i.set(s,l),this.count++,a=To.bind(this),l.addEventListener("load",a),l.addEventListener("error",a),n?n.parentNode.insertBefore(l,n.nextSibling):(t=t.nodeType===9?t.head:t,t.insertBefore(l,t.firstChild)),e.state.loading|=4}}var Ts={$$typeof:Ai,Provider:null,Consumer:null,_currentValue:ka,_currentValue2:ka,_threadCount:0};function g2(t,e,i,a,l,n,s,r,o){this.tag=1,this.containerInfo=t,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=$u(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=$u(0),this.hiddenUpdates=$u(null),this.identifierPrefix=a,this.onUncaughtError=l,this.onCaughtError=n,this.onRecoverableError=s,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=o,this.incompleteTransitions=new Map}function P0(t,e,i,a,l,n,s,r,o,u,d,p){return t=new g2(t,e,i,s,o,u,d,p,r),e=1,n===!0&&(e|=24),n=ft(3,null,null,e),t.current=n,n.stateNode=t,e=Yd(),e.refCount++,t.pooledCache=e,e.refCount++,n.memoizedState={element:a,isDehydrated:i,cache:e},qd(n),t}function _0(t){return t?(t=Bl,t):Bl}function N0(t,e,i,a,l,n){l=_0(l),a.context===null?a.context=l:a.pendingContext=l,a=ba(e),a.payload={element:i},n=n===void 0?null:n,n!==null&&(a.callback=n),i=Ma(t,a,e),i!==null&&(it(i,t,e),ss(i,t,e))}function Zp(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var i=t.retryLane;t.retryLane=i!==0&&i<e?i:e}}function yf(t,e){Zp(t,e),(t=t.alternate)&&Zp(t,e)}function D0(t){if(t.tag===13||t.tag===31){var e=ol(t,67108864);e!==null&&it(e,t,67108864),yf(t,67108864)}}function Ip(t){if(t.tag===13||t.tag===31){var e=gt();e=Td(e);var i=ol(t,e);i!==null&&it(i,t,e),yf(t,e)}}var Ro=!0;function v2(t,e,i,a){var l=_.T;_.T=null;var n=te.p;try{te.p=2,gf(t,e,i,a)}finally{te.p=n,_.T=l}}function b2(t,e,i,a){var l=_.T;_.T=null;var n=te.p;try{te.p=8,gf(t,e,i,a)}finally{te.p=n,_.T=l}}function gf(t,e,i,a){if(Ro){var l=xd(a);if(l===null)Cc(t,e,a,Ao,i),Qp(t,a);else if(x2(l,t,e,i,a))a.stopPropagation();else if(Qp(t,a),e&4&&-1<M2.indexOf(t)){for(;l!==null;){var n=on(l);if(n!==null)switch(n.tag){case 3:if(n=n.stateNode,n.current.memoizedState.isDehydrated){var s=Za(n.pendingLanes);if(s!==0){var r=n;for(r.pendingLanes|=2,r.entangledLanes|=2;s;){var o=1<<31-yt(s);r.entanglements[1]|=o,s&=~o}si(n),(ee&6)===0&&(vo=mt()+500,Bs(0,!1))}}break;case 31:case 13:r=ol(n,2),r!==null&&it(r,n,2),Xo(),yf(n,2)}if(n=xd(a),n===null&&Cc(t,e,a,Ao,i),n===l)break;l=n}l!==null&&a.stopPropagation()}else Cc(t,e,a,null,i)}}function xd(t){return t=zd(t),vf(t)}var Ao=null;function vf(t){if(Ao=null,t=_l(t),t!==null){var e=As(t);if(e===null)t=null;else{var i=e.tag;if(i===13){if(t=ey(e),t!==null)return t;t=null}else if(i===31){if(t=ty(e),t!==null)return t;t=null}else if(i===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null)}}return Ao=t,null}function O0(t){switch(t){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(rx()){case ny:return 2;case sy:return 8;case ao:case ox:return 32;case ry:return 268435456;default:return 32}default:return 32}}var Sd=!1,Ea=null,Ga=null,Ca=null,ws=new Map,Rs=new Map,da=[],M2="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function Qp(t,e){switch(t){case"focusin":case"focusout":Ea=null;break;case"dragenter":case"dragleave":Ga=null;break;case"mouseover":case"mouseout":Ca=null;break;case"pointerover":case"pointerout":ws.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":Rs.delete(e.pointerId)}}function kn(t,e,i,a,l,n){return t===null||t.nativeEvent!==n?(t={blockedOn:e,domEventName:i,eventSystemFlags:a,nativeEvent:n,targetContainers:[l]},e!==null&&(e=on(e),e!==null&&D0(e)),t):(t.eventSystemFlags|=a,e=t.targetContainers,l!==null&&e.indexOf(l)===-1&&e.push(l),t)}function x2(t,e,i,a,l){switch(e){case"focusin":return Ea=kn(Ea,t,e,i,a,l),!0;case"dragenter":return Ga=kn(Ga,t,e,i,a,l),!0;case"mouseover":return Ca=kn(Ca,t,e,i,a,l),!0;case"pointerover":var n=l.pointerId;return ws.set(n,kn(ws.get(n)||null,t,e,i,a,l)),!0;case"gotpointercapture":return n=l.pointerId,Rs.set(n,kn(Rs.get(n)||null,t,e,i,a,l)),!0}return!1}function H0(t){var e=_l(t.target);if(e!==null){var i=As(e);if(i!==null){if(e=i.tag,e===13){if(e=ey(i),e!==null){t.blockedOn=e,Pm(t.priority,function(){Ip(i)});return}}else if(e===31){if(e=ty(i),e!==null){t.blockedOn=e,Pm(t.priority,function(){Ip(i)});return}}else if(e===3&&i.stateNode.current.memoizedState.isDehydrated){t.blockedOn=i.tag===3?i.stateNode.containerInfo:null;return}}}t.blockedOn=null}function $r(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var i=xd(t.nativeEvent);if(i===null){i=t.nativeEvent;var a=new i.constructor(i.type,i);Yc=a,i.target.dispatchEvent(a),Yc=null}else return e=on(i),e!==null&&D0(e),t.blockedOn=i,!1;e.shift()}return!0}function kp(t,e,i){$r(t)&&i.delete(e)}function S2(){Sd=!1,Ea!==null&&$r(Ea)&&(Ea=null),Ga!==null&&$r(Ga)&&(Ga=null),Ca!==null&&$r(Ca)&&(Ca=null),ws.forEach(kp),Rs.forEach(kp)}function Lr(t,e){t.blockedOn===e&&(t.blockedOn=null,Sd||(Sd=!0,De.unstable_scheduleCallback(De.unstable_NormalPriority,S2)))}var Br=null;function Kp(t){Br!==t&&(Br=t,De.unstable_scheduleCallback(De.unstable_NormalPriority,function(){Br===t&&(Br=null);for(var e=0;e<t.length;e+=3){var i=t[e],a=t[e+1],l=t[e+2];if(typeof a!="function"){if(vf(a||i)===null)continue;break}var n=on(i);n!==null&&(t.splice(e,3),e-=3,id(n,{pending:!0,data:l,method:i.method,action:a},a,l))}}))}function sn(t){function e(o){return Lr(o,t)}Ea!==null&&Lr(Ea,t),Ga!==null&&Lr(Ga,t),Ca!==null&&Lr(Ca,t),ws.forEach(e),Rs.forEach(e);for(var i=0;i<da.length;i++){var a=da[i];a.blockedOn===t&&(a.blockedOn=null)}for(;0<da.length&&(i=da[0],i.blockedOn===null);)H0(i),i.blockedOn===null&&da.shift();if(i=(t.ownerDocument||t).$$reactFormReplay,i!=null)for(a=0;a<i.length;a+=3){var l=i[a],n=i[a+1],s=l[at]||null;if(typeof n=="function")s||Kp(i);else if(s){var r=null;if(n&&n.hasAttribute("formAction")){if(l=n,s=n[at]||null)r=s.formAction;else if(vf(l)!==null)continue}else r=s.action;typeof r=="function"?i[a+1]=r:(i.splice(a,3),a-=3),Kp(i)}}}function L0(){function t(n){n.canIntercept&&n.info==="react-transition"&&n.intercept({handler:function(){return new Promise(function(s){return l=s})},focusReset:"manual",scroll:"manual"})}function e(){l!==null&&(l(),l=null),a||setTimeout(i,20)}function i(){if(!a&&!navigation.transition){var n=navigation.currentEntry;n&&n.url!=null&&navigation.navigate(n.url,{state:n.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var a=!1,l=null;return navigation.addEventListener("navigate",t),navigation.addEventListener("navigatesuccess",e),navigation.addEventListener("navigateerror",e),setTimeout(i,100),function(){a=!0,navigation.removeEventListener("navigate",t),navigation.removeEventListener("navigatesuccess",e),navigation.removeEventListener("navigateerror",e),l!==null&&(l(),l=null)}}}function bf(t){this._internalRoot=t}Vo.prototype.render=bf.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(S(409));var i=e.current,a=gt();N0(i,a,t,e,null,null)};Vo.prototype.unmount=bf.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;N0(t.current,2,null,t,null,null),Xo(),e[rn]=null}};function Vo(t){this._internalRoot=t}Vo.prototype.unstable_scheduleHydration=function(t){if(t){var e=fy();t={blockedOn:null,target:t,priority:e};for(var i=0;i<da.length&&e!==0&&e<da[i].priority;i++);da.splice(i,0,t),i===0&&H0(t)}};var Jp=Wp.version;if(Jp!=="19.2.7")throw Error(S(527,Jp,"19.2.7"));te.findDOMNode=function(t){var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(S(188)):(t=Object.keys(t).join(","),Error(S(268,t)));return t=ex(e),t=t!==null?iy(t):null,t=t===null?null:t.stateNode,t};var E2={bundleType:0,version:"19.2.7",rendererPackageName:"react-dom",currentDispatcherRef:_,reconcilerVersion:"19.2.7"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&(Kn=__REACT_DEVTOOLS_GLOBAL_HOOK__,!Kn.isDisabled&&Kn.supportsFiber))try{zs=Kn.inject(E2),pt=Kn}catch{}var Kn;Zo.createRoot=function(t,e){if(!$p(t))throw Error(S(299));var i=!1,a="",l=Rg,n=Ag,s=zg;return e!=null&&(e.unstable_strictMode===!0&&(i=!0),e.identifierPrefix!==void 0&&(a=e.identifierPrefix),e.onUncaughtError!==void 0&&(l=e.onUncaughtError),e.onCaughtError!==void 0&&(n=e.onCaughtError),e.onRecoverableError!==void 0&&(s=e.onRecoverableError)),e=P0(t,1,!1,null,null,i,a,null,l,n,s,L0),t[rn]=e.current,hf(t),new bf(e)};Zo.hydrateRoot=function(t,e,i){if(!$p(t))throw Error(S(299));var a=!1,l="",n=Rg,s=Ag,r=zg,o=null;return i!=null&&(i.unstable_strictMode===!0&&(a=!0),i.identifierPrefix!==void 0&&(l=i.identifierPrefix),i.onUncaughtError!==void 0&&(n=i.onUncaughtError),i.onCaughtError!==void 0&&(s=i.onCaughtError),i.onRecoverableError!==void 0&&(r=i.onRecoverableError),i.formState!==void 0&&(o=i.formState)),e=P0(t,1,!0,e,i??null,a,l,o,n,s,r,L0),e.context=_0(null),i=e.current,a=gt(),a=Td(a),l=ba(a),l.callback=null,Ma(i,l,a),i=a,e.current.lanes=i,_s(e,i),si(e),t[rn]=e.current,hf(t),new Vo(e)};Zo.version="19.2.7"});var F0=$t((xG,Y0)=>{"use strict";function U0(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(U0)}catch(t){console.error(t)}}U0(),Y0.exports=B0()});var V0=$t(Qo=>{"use strict";var C2=Symbol.for("react.transitional.element"),T2=Symbol.for("react.fragment");function j0(t,e,i){var a=null;if(i!==void 0&&(a=""+i),e.key!==void 0&&(a=""+e.key),"key"in e){i={};for(var l in e)l!=="key"&&(i[l]=e[l])}else i=e;return e=i.ref,{$$typeof:C2,type:t,key:a,ref:e!==void 0?e:null,props:i}}Qo.Fragment=T2;Qo.jsx=j0;Qo.jsxs=j0});var q=$t((GG,Z0)=>{"use strict";Z0.exports=V0()});var CM=Y(F0(),1);var Zt=Y(qa(),1);var ge=Y(qa(),1);function X0(t){return`${t.x}:${t.y}`}function q0(t,e,i,a,l){return a<1||l<1||i.width<=0||i.height<=0||t<i.left||e<i.top||t>=i.left+i.width||e>=i.top+i.height?null:{x:Math.min(a-1,Math.floor((t-i.left)/i.width*a)),y:Math.min(l-1,Math.floor((e-i.top)/i.height*l))}}var Io=class{activeTiles=new Map;visitedTiles=new Set;lastTile=null;paintMode=null;begin(e){return this.visitedTiles.clear(),this.paintMode=this.activeTiles.has(X0(e))?"release":"press",this.lastTile=e,this.apply(e)}move(e){if(!this.paintMode)return[];let i=G2(this.lastTile??e,e).flatMap(a=>this.apply(a));return this.lastTile=e,i}end(){this.lastTile=null,this.paintMode=null,this.visitedTiles.clear()}reset(){this.end(),this.activeTiles.clear()}keys(){return[...this.activeTiles.keys()]}apply(e){let i=X0(e);if(!this.paintMode||this.visitedTiles.has(i))return[];this.visitedTiles.add(i);let a=this.paintMode==="press";return a?this.activeTiles.set(i,e):this.activeTiles.delete(i),[{...e,pressed:a}]}};function G2(t,e){let i=[],a=t.x,l=t.y,n=Math.abs(e.x-t.x),s=t.x<e.x?1:-1,r=-Math.abs(e.y-t.y),o=t.y<e.y?1:-1,u=n+r;for(;;){if(i.push({x:a,y:l}),a===e.x&&l===e.y)return i;let d=u*2;d>=r&&(u+=r,a+=s),d<=n&&(u+=n,l+=o)}}var mn=Y(q(),1),Mf=Y(qa(),1);function Oe({frame:t,label:e="Vista del suelo",className:i=""}){return(0,mn.jsxs)("section",{className:`ml-frame-preview-panel ${i}`.trim(),children:[(0,mn.jsx)("span",{children:e}),(0,mn.jsx)(I0,{frame:t})]})}function I0({frame:t,interactive:e=!1,inputResetKey:i,onTilePress:a,onTileRelease:l,className:n=""}){let s=(0,ge.useRef)(null),r=(0,ge.useRef)(null),o=(0,ge.useRef)(new Io),u=(0,ge.useRef)(i),[d,p]=(0,ge.useState)(()=>new Set),f={"--ml-floor-cols":t.width,"--ml-floor-rows":t.height},y=`ml-floor-preview ${e?"ml-floor-interactive":""} ${n}`.trim(),G=(0,ge.useCallback)(()=>{let E=document.activeElement;E instanceof HTMLElement&&s.current?.contains(E)&&E.blur()},[]),C=(0,ge.useCallback)((E,P)=>{let be=s.current;return be?q0(E,P,be.getBoundingClientRect(),t.width,t.height):null},[t.height,t.width]),O=(0,ge.useCallback)(E=>{if(E.length!==0){for(let P of E)P.pressed?a?.(P.x,P.y):l?.(P.x,P.y);p(new Set(o.current.keys()))}},[a,l]),h=(0,ge.useCallback)(E=>{!E||Number.isNaN(E.x)||Number.isNaN(E.y)||O(o.current.begin(E))},[O]),c=(0,ge.useCallback)(E=>{!E||Number.isNaN(E.x)||Number.isNaN(E.y)||O(o.current.move(E))},[O]),m=(0,ge.useCallback)(()=>{o.current.reset(),p(new Set)},[]);(0,ge.useEffect)(()=>{Object.is(u.current,i)||(u.current=i,m())},[m,i]),(0,ge.useEffect)(()=>{e||m()},[m,e]),(0,ge.useEffect)(()=>{if(!e)return;let E=()=>{r.current=null,o.current.end()},P=()=>{document.hidden&&E()};return window.addEventListener("blur",E),window.addEventListener("pointercancel",E),window.addEventListener("pointerup",E),document.addEventListener("visibilitychange",P),()=>{window.removeEventListener("blur",E),window.removeEventListener("pointercancel",E),window.removeEventListener("pointerup",E),document.removeEventListener("visibilitychange",P)}},[e]);let v=(0,ge.useCallback)(E=>{!e||E.button!==0||(E.preventDefault(),G(),r.current=E.pointerId,s.current?.setPointerCapture(E.pointerId),h(C(E.clientX,E.clientY)))},[h,G,e,C]),w=(0,ge.useCallback)(E=>{!e||r.current!==E.pointerId||(E.preventDefault(),c(C(E.clientX,E.clientY)))},[c,e,C]),B=(0,ge.useCallback)(E=>{!e||r.current!==E.pointerId||(c(C(E.clientX,E.clientY)),r.current=null,o.current.end(),G(),s.current?.hasPointerCapture(E.pointerId)&&s.current.releasePointerCapture(E.pointerId))},[G,c,e,C]),T=(0,ge.useCallback)(()=>{r.current=null,o.current.end(),G()},[G]),N=(0,ge.useCallback)(E=>{O(o.current.begin(E)),o.current.end()},[O]);return(0,mn.jsx)("div",{className:y,onLostPointerCapture:T,onPointerCancel:B,onPointerDown:v,onPointerMove:w,onPointerUp:B,ref:s,style:f,role:"grid","aria-label":"Vista del suelo",children:t.cells.map(E=>{let P={backgroundColor:E.color,gridColumnStart:E.x+1,gridRowStart:E.y+1},be=`${E.x}-${E.y}`,Mi=d.has(`${E.x}:${E.y}`),Jh={className:"ml-floor-tile",style:P,"data-tile-x":E.x,"data-tile-y":E.y,"data-color":E.color};return e?(0,Mf.createElement)("button",{...Jh,"aria-label":`Baldosa ${E.x}, ${E.y}`,"aria-pressed":Mi,key:be,onClick:TM=>{TM.detail===0&&N(E)},type:"button"}):(0,Mf.createElement)("span",{...Jh,"aria-hidden":"true",key:be})})})}var R=Y(q(),1),w2={ready:"Listo",waiting:"En espera",starting:"Preparados",running:"En juego",paused:"En pausa",finished:"Terminado"};function R2(t){return w2[t]??t}var k0=(0,Zt.createContext)({paused:!1});function K0({paused:t,children:e}){return(0,R.jsx)(k0.Provider,{value:{paused:t},children:e})}function ie({title:t,phase:e,variant:i="default",children:a}){let n=(0,Zt.useContext)(k0).paused,s=n?"paused":e;return(0,R.jsxs)("section",{className:`ml-display-shell ml-tv-display ml-tv-display-${i}${n?" is-paused":""}`,"aria-label":`Pantalla de ${t}`,"data-paused":n||void 0,children:[(0,R.jsxs)("header",{className:"ml-display-header ml-tv-header",children:[(0,R.jsxs)("div",{className:"ml-tv-brand","aria-hidden":"true",children:[(0,R.jsx)("span",{className:"ml-tv-brand-mark"}),(0,R.jsxs)("span",{className:"ml-tv-brand-name",children:[(0,R.jsx)("b",{children:"Motion"}),(0,R.jsx)("b",{children:"Levels"})]})]}),(0,R.jsxs)("div",{className:"ml-tv-title",children:[(0,R.jsx)("span",{className:"ml-display-label",children:"Juego"}),(0,R.jsx)("h1",{children:t})]}),(0,R.jsx)("span",{className:`ml-status-pill ml-status-${s}`,children:R2(s)})]}),(0,R.jsx)("div",{className:"ml-display-content",children:a})]})}function Ae({snapshot:t}){if(t.phase!=="waiting"&&t.phase!=="starting")return null;let e=t.readyPlayers??0,i=Math.max(t.requiredPlayers??t.playerCount,1),a=t.phase==="starting",l=Math.max(1,Math.ceil((t.countdownMillis??0)/1e3));return(0,R.jsxs)("section",{"aria-label":a?"El juego est\xE1 a punto de empezar":"Esperando jugadores",className:`ml-player-ready-overlay is-${t.phase}`,children:[(0,R.jsxs)("div",{className:"ml-player-ready-pulse","aria-hidden":"true",children:[(0,R.jsx)("i",{}),(0,R.jsx)("i",{}),(0,R.jsx)("i",{})]}),(0,R.jsx)("span",{children:a?"Todos listos":"Esperando jugadores"}),(0,R.jsx)("strong",{children:a?l:`${e}/${i}`}),(0,R.jsx)("b",{children:a?"El juego est\xE1 a punto de empezar":"Entra y permanece en la zona iluminada"})]})}function A({label:t,value:e,tone:i="cyan",className:a=""}){return(0,R.jsxs)("article",{className:`ml-metric ml-metric-${i} ${a}`.trim(),children:[(0,R.jsx)("span",{className:"ml-metric-label",children:t}),(0,R.jsx)("strong",{className:"ml-metric-value",children:e})]})}function nt({className:t="",lives:e,maxLives:i}){let a=Math.max(0,Math.trunc(i)),l=Math.min(a,Math.max(0,Math.trunc(e))),n=(0,Zt.useRef)(l),s=(0,Zt.useRef)(0),[r,o]=(0,Zt.useState)(null);return(0,Zt.useEffect)(()=>{let u=n.current;if(n.current=l,u===l)return;s.current+=1;let d={from:u,id:s.current,to:l};o(d);let p=window.setTimeout(()=>{o(f=>f?.id===d.id?null:f)},1100);return()=>window.clearTimeout(p)},[l]),(0,R.jsx)("div",{"aria-label":`${l} de ${a} vidas restantes`,className:`ml-lives-meter ${t}`.trim(),role:"img",children:Array.from({length:a},(u,d)=>{let p=d<l,y=r&&d>=Math.min(r.from,r.to)&&d<Math.max(r.from,r.to)?r.to>r.from?"is-regained":"is-losing":"";return(0,R.jsx)("span",{"aria-hidden":"true",className:`ml-life-heart ${p?"is-remaining":"is-lost"} ${y}`.trim(),"data-life-change":y||void 0,"data-life-state":p?"remaining":"lost",style:{"--ml-heart-index":d},children:(0,R.jsx)("span",{className:"ml-life-heart-glyph",children:"\u2665"})},d)})})}function ye({children:t,columns:e=3,className:i=""}){return(0,R.jsx)("section",{className:`ml-metric-row ${i}`.trim(),style:{"--ml-metric-columns":e},children:t})}function pn({left:t,right:e,target:i,centerLabel:a,centerValue:l,centerCaption:n="",className:s=""}){return(0,R.jsxs)("section",{className:`ml-versus-scoreboard ${s}`.trim(),"aria-label":"Marcador",children:[(0,R.jsx)(Q0,{player:t,side:"red",target:i}),(0,R.jsxs)("article",{className:"ml-versus-center",children:[(0,R.jsx)("span",{children:a}),(0,R.jsx)("strong",{children:l}),n?(0,R.jsx)("b",{children:n}):null]}),(0,R.jsx)(Q0,{player:e,side:"blue",target:i})]})}function Q0({player:t,side:e,target:i}){let a=Math.max(0,Math.min(1,t.score/Math.max(i,1)));return(0,R.jsxs)("article",{className:`ml-player-score-panel ml-player-score-${e}`,style:{"--ml-player":t.color,"--ml-player-rgb":A2(t.color),"--ml-score-progress":a},children:[(0,R.jsxs)("div",{className:"ml-player-score-head",children:[(0,R.jsx)("span",{children:t.label}),(0,R.jsxs)("b",{children:[t.score,"/",i]})]}),(0,R.jsx)("strong",{children:t.score}),(0,R.jsx)("div",{className:"ml-player-score-track","aria-hidden":"true",children:(0,R.jsx)("i",{})})]})}function yn({rounds:t,totalRounds:e,activeRound:i,activeLabel:a="Ronda actual",activeCaption:l="Punto en curso",fallbackLabel:n="Pendiente",className:s=""}){let r=Math.max(t.length,e??0,1),o=new Map(t.map(c=>[c.index,c])),u=Array.from({length:r},(c,m)=>{let v=m+1;return o.get(v)??{index:v,winnerLabel:n,hits:0}}),d=t.length<r?t.length+1:null,p=i===void 0?d:i,f=p??Math.max(t.length,1),y=12,G=Math.min(Math.max(0,f-Math.ceil(y/2)),Math.max(0,r-y)),C=u.slice(G,G+y),O=r>C.length?`Rondas ${C[0]?.index}-${C.at(-1)?.index} de ${r}`:"Historial del partido",h={"--ml-round-count":C.length,"--ml-round-progress":`${Math.min(1,t.length/r)*100}%`};return(0,R.jsxs)("section",{className:`ml-round-strip ${s}`.trim(),"aria-label":"Rondas",style:h,children:[(0,R.jsxs)("div",{className:"ml-round-strip-head",children:[(0,R.jsxs)("div",{className:"ml-round-strip-title",children:[(0,R.jsx)("span",{children:"Rondas"}),(0,R.jsx)("small",{children:O})]}),(0,R.jsxs)("div",{className:"ml-round-strip-count","aria-label":`${t.length} de ${r} rondas jugadas`,children:[(0,R.jsx)("strong",{children:t.length}),(0,R.jsxs)("span",{children:["de ",r]})]})]}),(0,R.jsx)("div",{className:"ml-round-progress","aria-hidden":"true",children:(0,R.jsx)("i",{})}),(0,R.jsx)("div",{className:"ml-round-list",children:C.map(c=>{let m=c.winnerIndex===0||c.winnerIndex===1,v=!m&&c.index===p,w=c.winnerIndex===0?"is-red":c.winnerIndex===1?"is-blue":v?"is-current":"is-pending",B=c.hits??0;return(0,R.jsxs)("article",{className:`ml-round-card ${w}`,children:[(0,R.jsxs)("div",{className:"ml-round-card-head",children:[(0,R.jsxs)("span",{children:["R",c.index]}),(0,R.jsx)("i",{"aria-hidden":"true"})]}),(0,R.jsx)("strong",{children:m?c.winnerLabel||n:v?a:n}),m?(0,R.jsxs)("b",{children:[B," ",B===1?"golpe":"golpes"]}):null,v?(0,R.jsx)("b",{children:l}):null]},c.index)})})]})}function A2(t){let e=t.replace("#","").trim(),i=e.length===3?e.split("").map(l=>l+l).join(""):e.padEnd(6,"0").slice(0,6),a=Number.parseInt(i,16);return Number.isFinite(a)?`${a>>16&255}, ${a>>8&255}, ${a&255}`:"255, 255, 255"}var Rf={};Qe(Rf,{PlayerDisplay:()=>iv,arkanoidConfigVars:()=>qs,ballColor:()=>Cf,brickColors:()=>wf,createGame:()=>js,finishedFrame:()=>uv,finishedSnapshot:()=>cv,initEvents:()=>sv,manifest:()=>ui,paddleColor:()=>Tf,runningFrame:()=>rv,runningSnapshot:()=>ov});function Ue(t,e){let i=e.centerX??(t.width-1)/2,a=e.centerY??(t.height-1)/2,l=Math.max(0,e.radius),n=Math.max(0,e.thickness??1);J0(t,e.color,(s,r)=>{let o=W0(s,r,i,a);return{distance:o,phase:Math.abs(o-l),selected:Math.abs(o-l)<=n}},0)}function Ge(t,e){let i=e.centerX??(t.width-1)/2,a=e.centerY??(t.height-1)/2,l=Math.max(1,Math.floor(e.period??7)),n=Math.min(l,Math.max(1,Math.floor(e.bandWidth??2))),s=Math.floor(e.step);J0(t,e.color,(r,o)=>{let u=Math.floor(W0(r,o,i,a)),d=z2(u+s,l);return{distance:u,phase:d,selected:d<n}},s)}function J0(t,e,i,a){for(let l=0;l<t.height;l+=1)for(let n=0;n<t.width;n+=1){let s=i(n,l);if(!s.selected)continue;let r=typeof e=="function"?e({distance:s.distance,phase:s.phase,step:a,x:n,y:l}):e;r&&(t.cells[l*t.width+n]={x:n,y:l,color:r})}}function W0(t,e,i,a){return Math.abs(t-i)+Math.abs(e-a)}function z2(t,e){return(t%e+e)%e}var M=16,x=32,P2=137,_2=0,N2=4294967295,It=M*x,D2=2e3,O2=650,H2=["easy","medium","hard","expert"],L2=50,PG=1e3/L2;function ri(t,e){return Number.isInteger(t)&&Number.isInteger(e)&&t>=0&&t<M&&e>=0&&e<x}function D(t,e){return{seed:B2(t.seed),playerCount:U2(t.playerCount,e),players:Array.isArray(t.players)?t.players:[],durationMillis:$0(t.durationMillis,e.defaultDurationMillis),nowMillis:$0(t.nowMillis,0),difficulty:X2(t.difficulty,e),options:q2(t.options,e)}}function B2(t){let e=typeof t=="number"&&Number.isFinite(t)?Math.trunc(t):P2;return L(e,_2,N2)}function U2(t,e){let i=typeof t=="number"&&Number.isFinite(t)?Math.round(t):Y2(e);return e.players.allowAny===!0&&i===0?0:L(i,e.players.min,e.players.max)}function Y2(t){return t.players.allowAny?0:t.players.min}function $0(t,e){return typeof t=="number"&&Number.isFinite(t)?Math.max(0,t):e}function F2(t){let e=t.config?.difficulty?.options;return e?.length?[...e]:[...H2]}function X2(t,e){let i=F2(e),a=e.config?.difficulty?.default,l=a&&i.includes(a)?a:i.includes("medium")?"medium":i[0]??"medium";return t&&i.includes(t)?t:l}function q2(t,e){let i=t??{};return Object.fromEntries((e.config?.vars??[]).map(a=>[a.key,ev(a,i[a.key])]))}function ev(t,e){if(t.type==="bool")return e===!0||e==="true"?!0:e===!1||e==="false"?!1:t.default;if(t.type==="enum"){let s=String(e??t.default);return t.options.some(o=>o.value===s)?s:t.default}let i=typeof e=="number"&&Number.isFinite(e)?e:typeof e=="string"&&e.trim()!==""?Number(e):Number.NaN,a=Number.isFinite(i)?i:t.default,l=t.type==="int"?Math.round(a):a;return L(l,t.min??-1/0,t.max??1/0)}function Ve(t,e){return ev(e,t[e.key])}function k(t="#05070a"){let e=[];for(let i=0;i<x;i+=1)for(let a=0;a<M;a+=1)e.push({x:a,y:i,color:t});return{width:M,height:x,cells:e}}function b(t,e,i,a){ri(e,i)&&(t.cells[i*t.width+e]={x:e,y:i,color:a})}function z(t,e,i,a,l,n){for(let s=i;s<i+l;s+=1)for(let r=e;r<e+a;r+=1)b(t,r,s,n)}function g(t,e,i){return{cue:t,message:e.trimEnd().replace(/\.+$/u,""),atMillis:i}}function V(t){let e=t>>>0;return e===0&&(e=1),{next(){return e=Math.imul(e,1664525)+1013904223>>>0,e/4294967296},int(i){if(!Number.isFinite(i)||i<=0)throw new Error("maxExclusive must be greater than zero");return Math.floor(this.next()*i)},range(i,a){if(a<i)throw new Error("maxInclusive must be greater than or equal to minInclusive");return i+this.int(a-i+1)}}}function ve(t,e=[]){let i=["#35d7ff","#ff3bd7","#ffe176","#5fff9e"];return Array.from({length:t},(a,l)=>({index:l,label:e[l]?.label||e[l]?.name||`Player ${l+1}`,color:e[l]?.color||i[l%i.length]||i[0],score:0,lives:-1}))}function L(t,e,i){return Math.min(i,Math.max(e,t))}function gn(t,e={}){if(!Number.isInteger(t)||t<1)throw new Error("player ready zone count must be a positive integer");let i=L(Math.round(e.minX??0),0,M-1),a=L(Math.round(e.maxX??M-1),i,M-1),l=L(Math.round(e.minY??0),0,x-1),s=L(Math.round(e.maxY??x-1),l,x-1)-l+1;if(t>s)throw new Error("player ready zone count cannot exceed the available floor rows");return Array.from({length:t},(r,o)=>({minX:i,maxX:a,minY:l+Math.floor(s*o/t),maxY:l+Math.floor(s*(o+1)/t)-1}))}function K(t,e,i=0){return new Sf(t,e,i)}function Xs(t){return tv(t.mode==="player-ready"?t.countdownMillis:void 0,D2)}function Fs(t){return Number.isFinite(t)?Math.max(0,t):0}var Sf=class{constructor(e,i,a){this.policy=e;this.zones=i;if(e.mode==="player-ready"&&i.length===0)throw new Error("player-ready games require at least one presence zone");this.countdownDuration=Xs(e),this.releaseGraceMillis=tv(e.mode==="player-ready"?e.releaseGraceMillis:void 0,O2),this.zoneHeld=Array.from({length:i.length},()=>0),this.zoneGraceUntil=Array.from({length:i.length},()=>0),this.phase=e.mode==="immediate"?"running":"waiting";for(let l=0;l<x;l+=1)for(let n=0;n<M;n+=1)this.tileZones[l*M+n]=i.findIndex(s=>j2(n,l,s));this.reset(a)}policy;zones;countdownDuration;releaseGraceMillis;tileZones=new Int16Array(It).fill(-1);tileHeld=new Uint8Array(It);zoneHeld;zoneGraceUntil;phase;startAtMillis=0;reset(e=0){return this.tileHeld.fill(0),this.zoneHeld.fill(0),this.zoneGraceUntil.fill(0),this.phase=this.policy.mode==="immediate"?"running":"waiting",this.startAtMillis=Fs(e),this.state(e)}update(e){if(!ri(e.x,e.y))return this.tick(e.atMillis);let i=e.y*M+e.x,a=this.tileZones[i]??-1,l=this.tileHeld[i]===1;return a>=0&&l!==e.pressed&&(this.tileHeld[i]=e.pressed?1:0,e.pressed?(this.zoneHeld[a]=(this.zoneHeld[a]??0)+1,this.zoneGraceUntil[a]=0):(this.zoneHeld[a]=Math.max(0,(this.zoneHeld[a]??0)-1),this.zoneHeld[a]===0&&(this.zoneGraceUntil[a]=Fs(e.atMillis)+this.releaseGraceMillis))),this.tick(e.atMillis)}tick(e){if(this.policy.mode==="immediate"||this.phase==="running")return"none";let i=Fs(e),a=this.readyPlayerCount(i)===this.zones.length;return this.phase==="waiting"&&a?(this.phase="starting",this.startAtMillis=i+this.countdownDuration,"players-ready"):this.phase==="starting"&&!a?(this.phase="waiting",this.startAtMillis=0,"players-left"):this.phase==="starting"&&i>=this.startAtMillis?(this.phase="running","started"):"none"}state(e){let i=Fs(e);return{phase:this.phase,readyPlayers:this.readyPlayerCount(i),requiredPlayers:this.zones.length,countdownMillis:this.phase==="starting"?Math.max(0,this.startAtMillis-i):0}}zoneReady(e,i){let a=this.zoneGraceUntil[e]??0;return(this.zoneHeld[e]??0)>0||a>0&&a>=Fs(i)}readyPlayerCount(e){return this.zones.reduce((i,a,l)=>i+Number(this.zoneReady(l,e)),0)}};function tv(t,e){return t!==void 0&&Number.isFinite(t)&&t>0?t:e}function j2(t,e,i){return t>=i.minX&&t<=i.maxX&&e>=i.minY&&e<=i.maxY}function oi(t){return`#${xf(t.r)}${xf(t.g)}${xf(t.b)}`}function st(t,e){return{r:L(Math.round(t.r*e/100),0,255),g:L(Math.round(t.g*e/100),0,255),b:L(Math.round(t.b*e/100),0,255)}}function cl(t,e){return{r:L(t.r+e.r,0,255),g:L(t.g+e.g,0,255),b:L(t.b+e.b,0,255)}}function xf(t){return L(Math.round(t),0,255).toString(16).padStart(2,"0")}function J(t){let e=Math.max(0,Math.ceil(t)),i=Math.ceil(e/1e3),a=Math.floor(i/60),l=i%60;return`${a}:${l.toString().padStart(2,"0")}`}var Mt=Y(q(),1);function iv({snapshot:t,frame:e}){let i=t.phase==="ready"?"Pisa abajo para mover y lanzar":t.lastEventMessage||"Rompe todos los bloques",a=t.success?"green":t.phase==="finished"?"red":t.phase==="ready"?"yellow":"cyan";return(0,Mt.jsx)(ie,{title:t.label,phase:t.phase,children:(0,Mt.jsxs)("div",{className:"ml-solo-display arkanoid-display",children:[(0,Mt.jsx)(Ae,{snapshot:t}),(0,Mt.jsxs)("div",{className:"ml-solo-summary",children:[(0,Mt.jsxs)(ye,{columns:3,className:"ml-solo-number-row",children:[(0,Mt.jsx)(A,{label:"Bloques",tone:"pink",value:`${t.score}/${t.totalBricks}`}),(0,Mt.jsx)(A,{label:"Vidas",tone:"neutral",value:(0,Mt.jsx)(nt,{lives:t.lives,maxLives:t.maxLives})}),(0,Mt.jsx)(A,{label:"Tiempo",tone:"yellow",value:J(t.elapsedMillis)})]}),(0,Mt.jsx)(A,{className:"ml-solo-message",label:"Estado",tone:a,value:i})]}),e?(0,Mt.jsx)(Oe,{className:"ml-solo-floor",frame:e,label:"Juego en el suelo"}):null]})})}var qs={ballSpeed:{key:"ball_speed",label:"Ball speed (tiles/s)",playerFacing:!0,description:"Base ball speed on Easy. Higher difficulties multiply this value.",type:"float",default:4.25,min:2,max:8,step:.25}},ui={id:"arkanoid",label:"Arkanoid",description:"Single-player floor Arkanoid with step-controlled paddle movement and deterministic brick physics.",availability:{development:!0,production:!0},catalog:{category:"individual",color:"#ff9f45",durationLabel:"Sin l\xEDmite",modeLabel:"Arkanoid",audioLabel:"Efectos",rules:["Pisa la zona inferior para mover la pala","Rompe todos los bloques sin perder la pelota"]},players:{allowAny:!0,min:1,max:1},start:{mode:"player-ready"},config:{difficulty:{default:"medium",options:["easy","medium","hard","expert"]},vars:Object.values(qs)},defaultDurationMillis:0,display:{entry:"./display"},preview:{seed:137,playerCount:1,difficulty:"medium",actions:[{atMillis:100,type:"press",x:7,y:30},{atMillis:2150,type:"release",x:7,y:30},{atMillis:2250,type:"press",x:9,y:30},{atMillis:2450,type:"release",x:9,y:30}],captureStartMillis:2200,frameCount:18,frameIntervalMillis:120},tags:["arcade","single-player","typescript"]};var Cf="#ffffff",Tf="#35d7ff",wf=["#ff3151","#ff8a2a","#ffd45f","#74e58d"],V2="#ff3151",Z2="#03070c",I2="#06101d",Q2="#145cff",k2="#37101a",K2="#ff3151",ci="#74e58d",av=["#9ddfff","#4b91b8","#21445b"],J2=4,lv=2,W2=3,dl=5,_a=29,Na=24,Ef=3,$2=12;function js(t){return new Gf(t)}var Gf=class{ball={x:7,y:_a-1,dx:1,dy:-1};ballMoves=0;ballTrail=[];bricks=[];config;lastControlX=7;lastEvent=g("none","Listo",0);lastMoveMillis=0;lives=Ef;nowMillis=0;paddleX=Math.floor((M-dl)/2);phase="ready";players=[];rng;readyGate;score=0;startedAtMillis=0;constructor(e){this.config=D(e,ui),this.rng=V(this.config.seed),this.readyGate=K(ui.start,[{minX:0,maxX:M-1,minY:Na,maxY:x-1}],this.config.nowMillis),this.resetState(this.config.nowMillis)}init(e){return this.nowMillis=e,this.readyGate.reset(e),this.phase="waiting",this.attachBall(),this.lastEvent=g("ready","Esperando jugador abajo",e),[this.lastEvent]}press(e){return this.nowMillis=e.atMillis,e.y<Na||e.y>=x?[]:(e.pressed&&this.movePaddle(e.x),this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update(e),e.atMillis):this.phase==="ready"&&e.pressed?this.launchBall(e.atMillis):[])}release(e){return this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update({...e,pressed:!1}),e.atMillis):[]}tick(e){if(this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting")return this.applyReadyTransition(this.readyGate.tick(e.atMillis),e.atMillis);if(this.phase!=="running")return[];let i=[],a=1e3/nv(this.config);for(let l=0;l<$2&&!(e.atMillis-this.lastMoveMillis<a);l+=1){this.lastMoveMillis+=a;let n=this.moveBall(this.lastMoveMillis);if(n&&i.push(n),this.phase!=="running")break}return this.recordEvents(i)}render(){let e=k(Z2);z(e,0,Na,M,x-Na,I2),z(e,0,x-1,M,1,k2);for(let i of this.bricks)i.alive&&z(e,i.x,i.y,i.width,1,i.color);return(this.phase==="waiting"||this.phase==="starting")&&this.drawPlayerStart(e),this.phase==="finished"&&this.score===this.bricks.length&&tE(e),this.ballTrail.forEach((i,a)=>{let l=av[a];l&&b(e,i.x,i.y,l)}),(this.phase!=="finished"||this.lives>0)&&b(e,this.ball.x,this.ball.y,Cf),z(e,this.paddleX,_a,dl,1,this.phase==="finished"&&this.lives===0?K2:Tf),b(e,this.lastControlX,x-1,Q2),e}snapshot(){let e=this.bricksRemaining(),i=this.readyGate.state(this.nowMillis);return{currentGame:ui.id,label:ui.label,phase:this.phase,playerCount:this.config.playerCount,players:this.players,score:this.score,lives:this.lives,maxLives:Ef,elapsedMillis:Math.max(0,this.nowMillis-this.startedAtMillis),remainingMillis:0,activeTargets:e,success:e===0,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?i.countdownMillis:0,readyPlayers:i.readyPlayers,requiredPlayers:i.requiredPlayers,matchTarget:this.bricks.length,ball:{...this.ball},ballMoves:this.ballMoves,ballSpeed:nv(this.config),bricksRemaining:e,launched:this.phase==="running",paddleWidth:dl,paddleX:this.paddleX,totalBricks:this.bricks.length}}reset(e={}){this.config=D({...this.config,...e},ui),this.rng=V(this.config.seed),this.resetState(this.config.nowMillis)}applyReadyTransition(e,i){return e==="players-ready"?(this.phase="starting",this.lastEvent=g("ready","Jugador listo",i),[this.lastEvent]):e==="players-left"?(this.phase="waiting",this.lastEvent=g("ready","Vuelve a la zona iluminada",i),[this.lastEvent]):e==="started"?this.launchBall(i):[]}launchBall(e){let i=this.phase==="waiting"||this.phase==="starting";return this.phase="running",i&&(this.startedAtMillis=e),this.ball={x:this.paddleCenter(),y:_a-1,dx:this.rng.next()<.5?-1:1,dy:-1},this.ballTrail=[],this.lastMoveMillis=e,this.lastEvent=g("start","Pelota en juego",e),[this.lastEvent]}attachBall(){this.ball={x:this.paddleCenter(),y:_a-1,dx:this.ball.dx,dy:-1},this.ballTrail=[]}brickAt(e,i){return this.bricks.find(a=>a.alive&&a.y===i&&e>=a.x&&e<a.x+a.width)}bricksRemaining(){return this.bricks.reduce((e,i)=>e+Number(i.alive),0)}commitBall(e){this.ballTrail=[{x:this.ball.x,y:this.ball.y},...this.ballTrail].slice(0,av.length),this.ball=e,this.ballMoves+=1}loseLife(e){return this.lives-=1,this.players=this.scoredPlayers(),this.ballTrail=[],this.lives<=0?(this.phase="finished",g("fail","Sin vidas",e)):(this.phase="ready",this.attachBall(),g("fail","Vida perdida, pisa abajo para lanzar",e))}moveBall(e){let i=this.ball.dx,a=this.ball.dy,l=this.ball.x+i,n=this.ball.y+a;(l<0||l>=M)&&(i=i===1?-1:1,l=this.ball.x+i),n<1&&(a=1,n=this.ball.y+a);let s=this.brickAt(l,n);if(s)return s.alive=!1,this.score+=1,this.players=this.scoredPlayers(),this.ball={...this.ball,dx:i,dy:a===1?-1:1},this.ballMoves+=1,this.bricksRemaining()===0?(this.phase="finished",g("win","Muro completado",e)):g("hit",`Bloque ${this.score} de ${this.bricks.length}`,e);if(a>0&&n===_a&&l>=this.paddleX&&l<this.paddleX+dl){let r=l-this.paddleCenter();return r<0?i=-1:r>0?i=1:i=this.rng.next()<.5?-1:1,Math.abs(r)===1&&this.rng.next()<.35&&(i=i===1?-1:1),this.commitBall({x:l,y:_a-1,dx:i,dy:-1}),g("coin","Rebote",e)}if(n>=x)return this.loseLife(e);this.commitBall({x:l,y:n,dx:i,dy:a})}movePaddle(e){let i=Math.floor(dl/2),a=L(Math.round(e),i,M-1-i);this.paddleX=a-i,this.lastControlX=L(Math.round(e),0,M-1),(this.phase==="ready"||this.phase==="waiting"||this.phase==="starting")&&this.attachBall()}drawPlayerStart(e){if(this.phase==="waiting"){let a=Na+Math.floor(this.nowMillis/150)%(x-Na);for(let l=Na;l<x;l+=1)for(let n=0;n<M;n+=1)(l===a||n===0||n===M-1)&&b(e,n,l,l===a?"#35d7ff":"#0b4260");return}let i=Math.floor(this.nowMillis/125)%4;for(let a=0;a<x;a+=1)for(let l=0;l<M;l+=1)(Math.abs(l-this.paddleCenter())+Math.abs(a-_a)+i)%6===0&&b(e,l,a,a>=Na?"#ffe176":"#176783")}paddleCenter(){return this.paddleX+Math.floor(dl/2)}recordEvents(e){let i=e.at(-1);return i&&(this.lastEvent=i),e}resetState(e){this.bricks=eE(),this.lives=Ef,this.nowMillis=e,this.startedAtMillis=e,this.lastMoveMillis=e,this.paddleX=Math.floor((M-dl)/2),this.lastControlX=this.paddleCenter(),this.readyGate.reset(e),this.phase="waiting",this.score=0,this.ballMoves=0,this.ball={x:this.paddleCenter(),y:_a-1,dx:1,dy:-1},this.ballTrail=[],this.players=this.scoredPlayers(),this.lastEvent=g("ready","Esperando jugador abajo",e)}scoredPlayers(){return ve(this.config.playerCount,this.config.players).map(e=>({...e,lives:this.lives,score:this.score}))}};function eE(){let t=[],e=0;for(let i=0;i<J2;i+=1)for(let a=0;a<M;a+=lv)t.push({alive:!0,color:wf[i]??V2,id:e,width:lv,x:a,y:W2+i}),e+=1;return t}function tE(t){z(t,2,13,M-4,1,ci),z(t,2,19,M-4,1,ci),z(t,2,13,1,7,ci),z(t,M-3,13,1,7,ci),b(t,5,16,ci),b(t,6,17,ci),b(t,7,18,ci),b(t,8,17,ci),b(t,9,16,ci),b(t,10,15,ci)}function nv(t){return Ve(t.options,qs.ballSpeed)*iE(t.difficulty)}function iE(t){switch(t){case"medium":return 1.25;case"hard":return 1.6;case"expert":return 2;default:return 1}}var vn=js({playerCount:1,difficulty:"medium"}),sv=vn.init(0);vn.press({x:7,y:30,pressed:!0,atMillis:100});vn.tick({atMillis:2100});vn.tick({atMillis:3300});var rv=vn.render(),ov=vn.snapshot(),ko=js({playerCount:1,difficulty:"easy"});ko.init(0);aE(ko);var uv=ko.render(),cv=ko.snapshot();function aE(t){t.press({x:7,y:30,pressed:!0,atMillis:50}),t.tick({atMillis:2050});let e=2100;for(let i=0;i<24e3&&t.snapshot().phase!=="finished";i+=1){let a=t.snapshot();t.press({x:a.ball.x,y:30,pressed:!0,atMillis:e}),t.tick({atMillis:e}),e+=50}}var Nf={};Qe(Nf,{PlayerDisplay:()=>dv,checkpointTarget:()=>Zs,createGame:()=>bn,damageImmunityMillis:()=>Pf,damagedSnapshot:()=>xv,finishedFrame:()=>Sv,finishedSnapshot:()=>Ev,gameWinAnimationMillis:()=>Ko,initEvents:()=>vv,manifest:()=>di,runningFrame:()=>bv,runningSnapshot:()=>Mv,startingLives:()=>Vs});var xt=Y(q(),1);function dv({snapshot:t,frame:e}){let i=t.phase==="finished"?t.success?"\xA1Portal alcanzado!":"La misi\xF3n ha terminado":t.lastEventMessage||"Avanza hacia el control verde";return(0,xt.jsx)(ie,{title:t.label,phase:t.phase,children:(0,xt.jsxs)("div",{className:`ml-solo-display cruce-galactico-display${t.celebrating?" is-celebrating":""}`,children:[(0,xt.jsx)(Ae,{snapshot:t}),(0,xt.jsxs)("div",{className:"ml-solo-summary",children:[(0,xt.jsxs)(ye,{columns:3,className:"ml-solo-number-row",children:[(0,xt.jsx)(A,{label:"Controles",tone:"green",value:`${t.checkpoint}/${t.checkpointTarget}`}),(0,xt.jsx)(A,{label:"Vidas",tone:"neutral",value:(0,xt.jsx)(nt,{lives:t.lives,maxLives:t.maxLives})}),(0,xt.jsx)(A,{label:"Tiempo",tone:"cyan",value:J(t.remainingMillis)})]}),(0,xt.jsx)(A,{className:"ml-solo-message",label:"Misi\xF3n",tone:t.success?"green":t.lives===0?"red":"blue",value:i})]}),e?(0,xt.jsx)(Oe,{className:"ml-solo-floor",frame:e,label:"Corredores en el suelo"}):null]})})}var di={id:"cruce-galactico",label:"Cruce Gal\xE1ctico",description:"Cruza cuatro corredores c\xF3smicos, esquiva el tr\xE1fico espacial y alcanza el portal de salida.",availability:{development:!0,production:!0},catalog:{category:"individual",color:"#7c5cff",durationLabel:"75 s",modeLabel:"Cruce espacial",audioLabel:"M\xFAsica + efectos",rules:["Empieza en la plataforma azul","Cruza cada corredor evitando los obst\xE1culos rojos","Alcanza los cuatro controles antes de que termine el tiempo"]},players:{allowAny:!0,min:1,max:4},start:{mode:"player-ready",releaseGraceMillis:1500},config:{difficulty:{default:"medium",options:["easy","medium","hard","expert"]}},defaultDurationMillis:75e3,display:{entry:"./display"},preview:{seed:137,playerCount:0,difficulty:"medium",actions:[{atMillis:100,type:"press",x:8,y:30},{atMillis:2150,type:"release",x:8,y:30},{atMillis:2500,type:"press",x:8,y:22}],captureStartMillis:2300,frameCount:24,frameIntervalMillis:120},tags:["arcade","crossing","survival","typescript"]};var Vs=3,Zs=4,Ko=3e3,Pf=1500,lE="#02030b",nE="#090d20",fv="#26d9ff",sE="#66ff9a",rE="#ff365c",oE="#fff0a6",uE="#ffffff",Af=["#7c5cff","#26d9ff","#66ff9a","#ffffff"],cE={minX:4,maxX:11,minY:29,maxY:31},hv=[{minY:22,maxY:23},{minY:15,maxY:16},{minY:8,maxY:9},{minY:0,maxY:2}],mv=[{minY:24,maxY:28,direction:1,offset:0},{minY:17,maxY:21,direction:-1,offset:4},{minY:10,maxY:14,direction:1,offset:8},{minY:3,maxY:7,direction:-1,offset:2}],pv={easy:620,medium:480,hard:360,expert:270};function bn(t){return new zf(t)}var zf=class{checkpoint=0;config;finishedAtMillis;lastDamageAtMillis=Number.NEGATIVE_INFINITY;lastEvent=g("none","Listo para despegar",0);lives=Vs;nowMillis=0;occupiedTiles=new Set;phase="ready";players=[];readyGate;startedAtMillis=0;success=!1;constructor(e){this.config=D(e,di),this.readyGate=K(di.start,[cE],this.config.nowMillis),this.resetState(this.config.nowMillis)}init(e){return this.resetState(e),[this.lastEvent]}press(e){if(this.nowMillis=e.atMillis,this.updateOccupied(e.x,e.y,e.pressed),this.phase==="waiting"||this.phase==="starting")return this.applyReadyTransition(this.readyGate.update(e),e.atMillis);if(this.phase!=="running"||!e.pressed)return[];let i=hv[this.checkpoint];return!i||e.y<i.minY||e.y>i.maxY?[]:(this.checkpoint+=1,this.players=this.scoredPlayers(),this.checkpoint===Zs?[this.finish(!0,"Portal alcanzado",e.atMillis)]:(this.lastEvent=g("hit",`Control ${this.checkpoint} activado`,e.atMillis),[this.lastEvent]))}release(e){return this.nowMillis=e.atMillis,this.updateOccupied(e.x,e.y,!1),this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update({...e,pressed:!1}),e.atMillis):[]}tick(e){return this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.tick(e.atMillis),e.atMillis):this.phase!=="running"?[]:this.remainingMillis()===0?[this.finish(!1,"Tiempo agotado",e.atMillis)]:e.atMillis-this.lastDamageAtMillis<Pf||!this.playerTouchesHazard()?[]:(this.lastDamageAtMillis=e.atMillis,this.lives=Math.max(0,this.lives-1),this.players=this.scoredPlayers(),this.lives===0?[this.finish(!1,"Nave destruida",e.atMillis)]:(this.lastEvent=g("miss",`Impacto: quedan ${this.lives} vidas`,e.atMillis),[this.lastEvent]))}render(){let e=k(lE);for(let i of mv)z(e,0,i.minY,M,i.maxY-i.minY+1,nE);if(this.phase==="waiting"||this.phase==="starting"){let i=Math.floor(this.nowMillis/(this.phase==="starting"?100:180));return Ue(e,{centerX:8,centerY:30,radius:1+i%6,color:this.phase==="starting"?"#ffe176":fv}),e}if(this.phase==="finished"){if(this.success){let i=Math.floor((this.nowMillis-(this.finishedAtMillis??this.nowMillis))/120);Ge(e,{color:({distance:a})=>Af[(a+i)%Af.length]??Af[0],step:i})}else{let i=Math.floor((this.nowMillis-(this.finishedAtMillis??this.nowMillis))/180)%2;z(e,0,0,M,x,i===0?"#5b0717":"#18030a")}return e}hv.forEach((i,a)=>{let l=a<this.checkpoint?fv:a===this.checkpoint?sE:"#15233d";z(e,0,i.minY,M,i.maxY-i.minY+1,l)});for(let i of this.currentHazards())z(e,i.x,i.y,i.width,i.height,rE),b(e,i.x+1,i.y+1,oE);for(let i of this.occupiedTiles){let[a,l]=yv(i);b(e,a,l,uE)}return e}snapshot(){let e=this.readyGate.state(this.nowMillis),i=this.phase==="finished"&&this.success?Math.min(Ko,Math.max(0,this.nowMillis-(this.finishedAtMillis??this.nowMillis))):0;return{currentGame:di.id,label:di.label,phase:this.phase,playerCount:this.config.playerCount,players:this.players,score:this.checkpoint,lives:this.lives,maxLives:Vs,elapsedMillis:this.elapsedMillis(),remainingMillis:this.remainingMillis(),activeTargets:this.phase==="running"?1:0,success:this.success,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?e.countdownMillis:0,readyPlayers:e.readyPlayers,requiredPlayers:e.requiredPlayers,matchTarget:Zs,checkpoint:this.checkpoint,checkpointTarget:Zs,hazards:this.phase==="running"?this.currentHazards():[],celebrating:this.success&&i<Ko,celebrationMillis:i}}reset(e={}){this.config=D({...this.config,...e},di),this.resetState(this.config.nowMillis)}applyReadyTransition(e,i){if(e==="players-ready")this.phase="starting",this.lastEvent=g("ready","Tripulaci\xF3n lista",i);else if(e==="players-left")this.phase="waiting",this.lastEvent=g("ready","Vuelve a la plataforma azul",i);else if(e==="started")this.phase="running",this.startedAtMillis=i,this.lastEvent=g("start","Avanza hacia el control verde",i);else return[];return[this.lastEvent]}currentHazards(){let e=pv[this.config.difficulty]??pv.medium,i=Math.floor(Math.max(0,this.nowMillis-this.startedAtMillis)/e);return mv.flatMap((a,l)=>[0,7,14].map(n=>({x:((a.offset+n+i*a.direction)%20+20)%20-3,y:a.minY+l%2,width:3,height:3}))).filter(a=>a.x<M&&a.x+a.width>0)}elapsedMillis(){return this.phase==="waiting"||this.phase==="starting"||this.phase==="ready"?0:Math.max(0,(this.finishedAtMillis??this.nowMillis)-this.startedAtMillis)}finish(e,i,a){return this.phase="finished",this.success=e,this.finishedAtMillis=a,this.lastEvent=g(e?"win":"fail",i,a),this.lastEvent}playerTouchesHazard(){let e=this.currentHazards();for(let i of this.occupiedTiles){let[a,l]=yv(i);if(e.some(n=>a>=n.x&&a<n.x+n.width&&l>=n.y&&l<n.y+n.height))return!0}return!1}remainingMillis(){return Math.max(0,this.config.durationMillis-this.elapsedMillis())}resetState(e){this.readyGate.reset(e),this.checkpoint=0,this.finishedAtMillis=void 0,this.lastDamageAtMillis=Number.NEGATIVE_INFINITY,this.lastEvent=g("ready","Espera en la plataforma azul",e),this.lives=Vs,this.nowMillis=e,this.occupiedTiles.clear(),this.phase="waiting",this.players=this.scoredPlayers(),this.startedAtMillis=e,this.success=!1}scoredPlayers(){return ve(this.config.playerCount,this.config.players).map(e=>({...e,score:this.checkpoint,lives:this.lives}))}updateOccupied(e,i,a){if(e<0||e>=M||i<0||i>=x)return;let l=`${e},${i}`;a?this.occupiedTiles.add(l):this.occupiedTiles.delete(l)}};function yv(t){let[e="0",i="0"]=t.split(",");return[Number(e),Number(i)]}var Mn=bn({playerCount:1,difficulty:"medium",seed:137}),vv=Mn.init(0);_f(Mn);Mn.release({x:8,y:30,pressed:!1,atMillis:2150});Mn.tick({atMillis:3e3});var bv=Mn.render(),Mv=Mn.snapshot(),Da=bn({playerCount:1,difficulty:"medium",seed:137});Da.init(0);_f(Da);Da.release({x:8,y:30,pressed:!1,atMillis:2150});Da.tick({atMillis:3e3});var gv=Da.snapshot().hazards[0];Da.press({x:Math.max(0,gv.x),y:gv.y,pressed:!0,atMillis:3001});Da.tick({atMillis:3002});var xv=Da.snapshot(),xn=bn({playerCount:1,difficulty:"medium",seed:137});xn.init(0);_f(xn);for(let t of[22,15,8,1])xn.press({x:8,y:t,pressed:!0,atMillis:2200+(22-t)*10});xn.tick({atMillis:3100});var Sv=xn.render(),Ev=xn.snapshot();function _f(t){t.press({x:8,y:30,pressed:!0,atMillis:100}),t.tick({atMillis:2100})}var Yf={};Qe(Yf,{PlayerDisplay:()=>Gv,createGame:()=>Oa,crowdedRunningFrame:()=>Hv,crowdedRunningSnapshot:()=>Lv,dueloConfigVars:()=>Sn,dueloPlayerPalette:()=>Fi,dueloReadyZones:()=>$o,finishedFrame:()=>Bv,finishedSnapshot:()=>Uv,manifest:()=>St,runningFrame:()=>Dv,runningSnapshot:()=>Ov,startingFrame:()=>_v,startingSnapshot:()=>Nv,waitingFrame:()=>zv,waitingSnapshot:()=>Pv,winAnimationMillis:()=>Wo});var Z=Y(q(),1);function Gv({snapshot:t}){let e=t.playerCount<=4?2:t.playerCount<=6?3:4,i=Math.max(1,Math.ceil(t.countdownMillis/1e3)),a=Math.max(1,Math.ceil(t.remainingMillis/1e3)),l=new Set(t.readyPlayerIndices),n=fE(t,i,a),s={"--duelo-grid-columns":e,"--duelo-player-count":t.playerCount,"--duelo-winner":t.winnerIndex>=0?t.playerProgress[t.winnerIndex]?.color??"#ffffff":"#ffffff","--duelo-winner-rgb":t.winnerIndex>=0?Cv(t.playerProgress[t.winnerIndex]?.color??"#ffffff"):"255, 255, 255"};return(0,Z.jsx)(ie,{title:t.label,phase:t.phase,children:(0,Z.jsxs)("div",{className:`duelo-display is-phase-${t.phase} is-player-count-${t.playerCount}`,style:s,children:[(0,Z.jsxs)("section",{className:"duelo-hero","aria-label":n.title,children:[(0,Z.jsxs)("div",{className:"duelo-hero-copy",children:[(0,Z.jsx)("span",{children:n.eyebrow}),(0,Z.jsx)("strong",{children:n.title}),(0,Z.jsx)("b",{children:n.caption})]}),(0,Z.jsxs)("div",{className:"duelo-hero-metrics",children:[(0,Z.jsx)(Df,{label:"Tiempo",value:J(t.elapsedMillis)}),(0,Z.jsx)(Df,{label:"Restantes",value:t.remainingTargets}),(0,Z.jsx)(Df,{label:"Densidad",value:`${t.fillPercent}%`})]})]}),(0,Z.jsx)("section",{className:"duelo-player-grid","aria-label":"Progreso de jugadores",children:t.playerProgress.map(r=>(0,Z.jsx)(dE,{leader:t.leaderIndex===r.index,phase:t.phase,player:r,ready:l.has(r.index),recent:t.recentClaim?.playerIndex===r.index,winner:t.winnerIndex===r.index},r.index))}),(0,Z.jsxs)("footer",{className:"duelo-event-rail",children:[(0,Z.jsx)("span",{children:t.phase==="waiting"?"Preparaci\xF3n":t.phase==="finished"?"Resultado":"\xDAltimo evento"}),(0,Z.jsx)("strong",{children:t.lastEventMessage||"Listo"},t.motionEventId),(0,Z.jsx)("b",{children:t.phase==="finished"?`Nueva partida en ${a}`:`${t.claimedTargets}/${t.totalTargets} reclamadas`})]})]})})}function dE({leader:t,phase:e,player:i,ready:a,recent:l,winner:n}){let s=e==="waiting"?a?"Listo":"Entra en tu zona":e==="starting"?"Preparado":n?"Ganador":t?"L\xEDder":"En carrera",r={"--duelo-player":i.color,"--duelo-player-rgb":Cv(i.color),"--duelo-progress":i.progress},o=i.label.length>28?" is-extra-long":i.label.length>18?" is-long":"";return(0,Z.jsxs)("article",{className:["duelo-player-card",a?"is-ready":"",t?"is-leader":"",l?"is-recent":"",n?"is-winner":""].filter(Boolean).join(" "),style:r,children:[(0,Z.jsxs)("header",{children:[(0,Z.jsx)("i",{"aria-hidden":"true"}),(0,Z.jsx)("span",{className:`duelo-player-name${o}`,children:i.label}),(0,Z.jsx)("b",{children:s})]}),(0,Z.jsxs)("div",{className:"duelo-player-score",children:[(0,Z.jsx)("strong",{children:i.remaining}),(0,Z.jsx)("span",{children:"baldosas restantes"}),l?(0,Z.jsx)("em",{children:"+1"},`${i.index}-${i.claimed}`):null]}),(0,Z.jsx)("div",{className:"duelo-player-track","aria-hidden":"true",children:(0,Z.jsx)("i",{})}),(0,Z.jsxs)("footer",{children:[(0,Z.jsx)("span",{children:"Reclamadas"}),(0,Z.jsxs)("strong",{children:[i.claimed,"/",i.target]})]})]})}function Df({label:t,value:e}){return(0,Z.jsxs)("article",{className:"duelo-hero-metric",children:[(0,Z.jsx)("span",{children:t}),(0,Z.jsx)("strong",{children:e})]})}function fE(t,e,i){return t.phase==="waiting"?{eyebrow:`Listos ${t.readyPlayers}/${t.requiredPlayers}`,title:"Busca tu color",caption:"Cada jugador entra y permanece en su zona iluminada"}:t.phase==="starting"?{eyebrow:"Todos listos",title:String(e),caption:"El duelo est\xE1 a punto de empezar"}:t.phase==="finished"?{eyebrow:"Victoria",title:`\xA1Gana ${t.winnerLabel}!`,caption:`Nueva partida en ${i}`}:{eyebrow:t.leaderIndex>=0?`Lidera ${t.leaderLabel}`:"Empate",title:"Reclama tu color",caption:"Pisa todas tus baldosas antes que los dem\xE1s"}}function Cv(t){return/^#[0-9a-f]{6}$/i.test(t)?[1,3,5].map(e=>Number.parseInt(t.slice(e,e+2),16)).join(", "):"255, 255, 255"}var Sn={baseFillPercent:{key:"base_fill_percent",label:"Base floor coverage (%)",playerFacing:!1,description:"The percentage of floor tiles assigned as targets on Medium difficulty.",type:"int",default:60,min:30,max:75,step:5},hardFillMultiplier:{key:"hard_fill_multiplier",label:"Hard coverage multiplier",playerFacing:!1,description:"Hard difficulty multiplies the base floor coverage by this value, capped at the full floor.",type:"float",default:1.5,min:1,max:1.8,step:.05}},St={id:"duelo",label:"Duelo",description:"A fast 2\u20138 player race to claim every tile of your color before anyone else.",availability:{development:!0,production:!0},catalog:{category:"versus",color:"#ff5268",durationLabel:"Sin l\xEDmite",modeLabel:"Carrera de colores",audioLabel:"M\xFAsica + efectos",rules:["Cada jugador ocupa la zona de inicio de su color","Pisa todas las baldosas de tu color antes que los dem\xE1s"]},players:{allowAny:!1,min:2,max:8},start:{mode:"player-ready",countdownMillis:3e3,releaseGraceMillis:2e3},config:{difficulty:{default:"medium",options:["medium","hard"]},vars:Object.values(Sn)},defaultDurationMillis:0,display:{entry:"./display"},preview:{seed:137,playerCount:4,difficulty:"medium",actions:[{atMillis:100,type:"press",x:1,y:1},{atMillis:100,type:"press",x:14,y:30},{atMillis:100,type:"press",x:1,y:30},{atMillis:100,type:"press",x:14,y:1}],captureStartMillis:3200,frameCount:18,frameIntervalMillis:120},tags:["competitive","multiplayer","color-race","typescript"]};var En=4,hE=18,Tv=420,wv=700,Wo=5e3,mE="#03060b",Hf={r:255,g:255,b:255},Fi=["#ff3048","#24d9ff","#42e879","#ff4fd8","#376bff","#ffd84d","#a66cff","#ff8a3d"];function Oa(t){return new Of(t)}function $o(t){let e=L(Math.round(t),St.players.min,St.players.max),i=M-En,a=x-En,l=Math.floor((M-En)/2),n=Math.floor((x-En)/2);return(e===2?[[0,n],[i,n]]:e===3?[[0,0],[i,0],[l,a]]:[[0,0],[i,a],[0,a],[i,0],[0,n],[i,n],[l,0],[l,a]].slice(0,e)).map(([r=0,o=0])=>({minX:r,maxX:r+En-1,minY:o,maxY:o+En-1}))}var Of=class{claimed=new Uint8Array(It);claimedAt=new Float64Array(It);claims=[];config;fillPercent=60;finishAtMillis=0;lastEvent=g("none","Listo",0);motionEventId=0;nowMillis=0;owners=new Int16Array(It).fill(-1);phase="waiting";players=[];readyGate;readyZones=[];recentClaim=null;rng;startedAtMillis=0;targets=[];winnerIndex=-1;constructor(e){this.config=D(e,St),this.rng=V(this.config.seed),this.readyZones=$o(this.config.playerCount),this.readyGate=K(St.start,this.readyZones,this.config.nowMillis),this.resetGame(this.config.nowMillis)}init(e){return this.resetGame(e),this.lastEvent=g("ready",this.waitingMessage(),e),[this.lastEvent]}press(e){if(this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting")return this.recordEvents(this.applyReadyTransition(this.readyGate.update(e),e.atMillis));if(this.phase!=="running"||!e.pressed||!ri(e.x,e.y))return[];let i=this.claimTile(e.x,e.y,e.atMillis);return this.recordEvents(i?[i]:[])}release(e){return this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting"?this.recordEvents(this.applyReadyTransition(this.readyGate.update({...e,pressed:!1}),e.atMillis)):[]}tick(e){return this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting"?this.recordEvents(this.applyReadyTransition(this.readyGate.tick(e.atMillis),e.atMillis)):this.phase==="finished"&&e.atMillis-this.finishAtMillis>=Wo?(this.resetGame(e.atMillis),this.recordEvents([g("ready","Nuevo duelo",e.atMillis)])):[]}render(){let e=k(mE);return this.phase==="waiting"?this.drawWaiting(e):this.phase==="starting"?this.drawStarting(e):this.phase==="running"?this.drawBoard(e):this.drawVictory(e),e}snapshot(){let e=this.readyGate.state(this.nowMillis),i=this.playerProgress(),a=i.reduce((d,p)=>!d||p.progress>d.progress||p.progress===d.progress&&p.index<d.index?p:d,void 0),l=a&&i.filter(d=>d.progress===a.progress).length===1?a:void 0,n=this.claims.reduce((d,p)=>d+p,0),s=this.targets.reduce((d,p)=>d+p,0),r=this.players[this.winnerIndex],o=this.phase==="finished"?this.finishAtMillis:this.nowMillis,u=this.recentClaim?this.nowMillis-this.recentClaim.atMillis:Number.POSITIVE_INFINITY;return{currentGame:St.id,label:St.label,phase:this.phase,playerCount:this.config.playerCount,players:this.players.map((d,p)=>({...d,score:this.claims[p]??0})),score:Math.max(0,...this.claims),lives:-1,elapsedMillis:this.phase==="waiting"||this.phase==="starting"?0:Math.max(0,o-this.startedAtMillis),remainingMillis:this.phase==="finished"?Math.max(0,this.finishAtMillis+Wo-this.nowMillis):0,activeTargets:s-n,success:this.winnerIndex>=0,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?e.countdownMillis:0,readyPlayers:e.readyPlayers,requiredPlayers:e.requiredPlayers,matchTarget:Math.max(0,...this.targets),claimedTargets:n,fillPercent:this.fillPercent,leaderIndex:l?.index??-1,leaderLabel:l?.label??"-",motionEventId:this.motionEventId,playerProgress:i,readyPlayerIndices:this.players.filter((d,p)=>this.readyGate.zoneReady(p,this.nowMillis)).map(d=>d.index),recentClaim:this.recentClaim&&u<wv?{playerIndex:this.recentClaim.playerIndex,remainingMillis:wv-u,x:this.recentClaim.x,y:this.recentClaim.y}:null,remainingTargets:s-n,totalTargets:s,winnerIndex:this.winnerIndex,winnerLabel:r?.label??""}}reset(e={}){this.config=D({...this.config,...e},St),this.readyZones=$o(this.config.playerCount),this.readyGate=K(St.start,this.readyZones,this.config.nowMillis),this.resetGame(this.config.nowMillis),this.lastEvent=g("ready",this.waitingMessage(),this.config.nowMillis)}playerReadyZones(){return this.readyZones.map(e=>({...e}))}targetOwner(e,i){return ri(e,i)?this.owners[i*M+e]??-1:-1}resetGame(e){this.nowMillis=e,this.startedAtMillis=e,this.finishAtMillis=0,this.phase="waiting",this.winnerIndex=-1,this.motionEventId=1,this.recentClaim=null,this.claimed.fill(0),this.claimedAt.fill(0),this.readyGate.reset(e),this.players=this.createPlayers(),this.fillPercent=this.readFillPercent(),this.rng=V(this.config.seed);let i=pE(this.config.playerCount,this.fillPercent,this.rng);this.owners=i.owners,this.targets=i.targets,this.claims=Array.from({length:this.config.playerCount},()=>0),this.lastEvent=g("ready",this.waitingMessage(),e)}createPlayers(){return Array.from({length:this.config.playerCount},(e,i)=>{let a=this.config.players[i],l=Fi[i]??Fi[0],n=a?.color,s=n&&/^#[0-9a-f]{6}$/i.test(n)?n:l,r=String(a?.label||a?.name||`Jugador ${i+1}`).trim();return{index:i,label:r||`Jugador ${i+1}`,color:s,score:0,lives:-1}})}readFillPercent(){let e=Ve(this.config.options,Sn.baseFillPercent);if(this.config.difficulty!=="hard")return Math.round(e);let i=Ve(this.config.options,Sn.hardFillMultiplier);return Math.round(L(e*i,1,100))}applyReadyTransition(e,i){return e==="players-ready"?(this.phase="starting",this.motionEventId+=1,[g("start","Todos en posici\xF3n",i)]):e==="players-left"?(this.phase="waiting",this.motionEventId+=1,[g("ready","Vuelve a tu zona iluminada",i)]):e==="started"?(this.phase="running",this.startedAtMillis=i,this.motionEventId+=1,[g("start","Reclama todas las baldosas de tu color",i)]):[]}claimTile(e,i,a){let l=i*M+e,n=this.owners[l]??-1;if(n<0||n>=this.players.length||this.claimed[l]===1)return;this.claimed[l]=1,this.claimedAt[l]=a,this.claims[n]=(this.claims[n]??0)+1,this.recentClaim={atMillis:a,playerIndex:n,x:e,y:i},this.motionEventId+=1;let s=Math.max(0,(this.targets[n]??0)-(this.claims[n]??0)),r=this.players[n]?.label??`Jugador ${n+1}`;return s===0?(this.phase="finished",this.finishAtMillis=a,this.winnerIndex=n,g("win",`${r} gana el duelo`,a)):g("coin",`${r}: ${s} por reclamar`,a)}recordEvents(e){let i=e.at(-1);return i&&(this.lastEvent=i),e}waitingMessage(){return`Duelo espera a ${this.config.playerCount} jugadores`}playerProgress(){return this.players.map((e,i)=>{let a=this.targets[i]??0,l=this.claims[i]??0;return{claimed:l,color:e.color,index:i,label:e.label,progress:a>0?l/a:0,remaining:Math.max(0,a-l),target:a}})}drawWaiting(e){let i=.5+.5*Math.sin(this.nowMillis/310);this.readyZones.forEach((a,l)=>{let n=this.readyGate.zoneReady(l,this.nowMillis);this.drawReadyZone(e,a,this.players[l]?.color??Fi[0],n,i)}),Ue(e,{color:"#13263a",radius:2+Math.floor(this.nowMillis/180)%20,thickness:.35})}drawStarting(e){let i=Math.floor(this.nowMillis/110);Ge(e,{bandWidth:2,period:8,step:i,color:({distance:a})=>{let l=this.players[Math.floor(a)%this.players.length];return Jo(l?.color??Fi[0],58)}}),this.readyZones.forEach((a,l)=>{this.drawReadyZone(e,a,this.players[l]?.color??Fi[0],!0,1)})}drawReadyZone(e,i,a,l,n){for(let s=i.minY;s<=i.maxY;s+=1)for(let r=i.minX;r<=i.maxX;r+=1){let o=r===i.minX||r===i.maxX||s===i.minY||s===i.maxY,u=l?o?100:78:o?26+n*24:12+n*12;b(e,r,s,Jo(a,u))}}drawBoard(e){let i=this.playerProgress();for(let a=0;a<It;a+=1){let l=this.owners[a]??-1;if(l<0)continue;let n=a%M,s=Math.floor(a/M),r=this.players[l]?.color??Fi[0];if(this.claimed[a]===1){let d=this.nowMillis-(this.claimedAt[a]??0);if(d<Tv){let p=1-d/Tv;b(e,n,s,bE(r,35+p*65))}else b(e,n,s,Jo(r,12));continue}let o=(i[l]?.progress??0)>=.88?16:0,u=.5+.5*Math.sin(this.nowMillis/360+n*.74+s*.18+l);b(e,n,s,Jo(r,58+o+u*24))}}drawVictory(e){let i=this.players[this.winnerIndex]?.color??Fi[0],a=Lf(i),l=Math.max(0,this.nowMillis-this.finishAtMillis);for(let n=0;n<x;n+=1)for(let s=0;s<M;s+=1){let r=.5+.5*Math.sin(l/170+s*.58+n*.19),o=cl(st(a,48+r*42),st(Hf,r*16));b(e,s,n,oi(o))}Ge(e,{bandWidth:2,period:9,step:Math.floor(l/90),color:"#ffffff"})}};function pE(t,e,i){let a=Math.round(It*e/100),l=Math.max(1,Math.floor(a/t)),n=Array.from({length:t},()=>l),s=new Int16Array(It).fill(-1),r=Number.POSITIVE_INFINITY;for(let o=0;o<hE;o+=1){let u=yE(n,i),d=gE(u);d<r&&(r=d,s=u)}return{owners:s,targets:n}}function yE(t,e){let i=new Int16Array(It).fill(-1),a=Array.from({length:t.length},()=>0),l=Array.from({length:It},(n,s)=>s);for(let n=l.length-1;n>0;n-=1){let s=e.int(n+1);[l[n],l[s]]=[l[s]??0,l[n]??0]}for(let n of l){let s=n%M,r=Math.floor(n/M),o=-1,u=Number.POSITIVE_INFINITY;for(let d=0;d<t.length;d+=1){let p=t[d]??0;if((a[d]??0)>=p)continue;let f=Rv(i,s,r,d),y=vE(i,s,r,d),G=Av(f)+y*.12+(a[d]??0)/Math.max(p,1)*.2+e.next()*1.35;G<u&&(u=G,o=d)}o>=0&&(i[n]=o,a[o]=(a[o]??0)+1)}return i}function gE(t){let e=0;for(let i=0;i<x;i+=1){let a=-2,l=0;for(let n=0;n<M;n+=1){let s=t[i*M+n]??-1;if(s>=0){let r=Rv(t,n,i,s);e+=Av(r)+(r>=3?6:0)}s===a&&s>=0?l+=1:(a=s,l=1),a>=0&&l>5&&(e+=(l-5)*7)}}for(let i=0;i<M;i+=1){let a=-2,l=0;for(let n=0;n<x;n+=1){let s=t[n*M+i]??-1;s===a&&s>=0?l+=1:(a=s,l=1),a>=0&&l>5&&(e+=(l-5)*7)}}return e}function Rv(t,e,i,a){return[[e-1,i],[e+1,i],[e,i-1],[e,i+1]].filter(([l=-1,n=-1])=>ri(l,n)&&t[n*M+l]===a).length}function vE(t,e,i,a){return[[e-1,i-1],[e+1,i-1],[e-1,i+1],[e+1,i+1]].filter(([l=-1,n=-1])=>ri(l,n)&&t[n*M+l]===a).length}function Av(t){return t===0?.85:t===1?0:t===2?.45:4.5}function Lf(t){return/^#[0-9a-f]{6}$/i.test(t)?{r:Number.parseInt(t.slice(1,3),16),g:Number.parseInt(t.slice(3,5),16),b:Number.parseInt(t.slice(5,7),16)}:Hf}function Jo(t,e){return oi(st(Lf(t),e))}function bE(t,e){let i=L(e,0,100);return oi(cl(st(Lf(t),100-i),st(Hf,i)))}var eu=[{name:"Rojo",color:"#ff3048"},{name:"Cian",color:"#24d9ff"}],Bf=Oa({playerCount:2,players:eu,seed:137,difficulty:"medium"});Bf.init(0);var zv=Bf.render(),Pv=Bf.snapshot(),Is=Oa({playerCount:2,players:eu,seed:137,difficulty:"hard"});Is.init(0);Yv(Is,100);Is.tick({atMillis:1100});var _v=Is.render(),Nv=Is.snapshot(),fl=Oa({playerCount:2,players:eu,seed:137,difficulty:"hard"});fl.init(0);Uf(fl);tu(fl,0,8,3200);tu(fl,1,5,3400);fl.tick({atMillis:18700});var Dv=fl.render(),Ov=fl.snapshot(),ME=[{name:"Alejandra del Equipo Rel\xE1mpago",color:"#ff3048"},{name:"Bruno",color:"#24d9ff"},{name:"Carolina",color:"#42e879"},{name:"Diego",color:"#ff4fd8"},{name:"Elena",color:"#376bff"},{name:"Fernando",color:"#ffd84d"},{name:"Gabriela",color:"#a66cff"},{name:"Hugo",color:"#ff8a3d"}],Gn=Oa({playerCount:8,players:ME,seed:2026,difficulty:"medium"});Gn.init(0);Uf(Gn);for(let t=0;t<8;t+=1)tu(Gn,t,t+1,3200+t*50);Gn.tick({atMillis:48230});var Hv=Gn.render(),Lv=Gn.snapshot(),Cn=Oa({playerCount:2,players:eu,seed:137,difficulty:"medium",options:{base_fill_percent:30}});Cn.init(0);Uf(Cn);tu(Cn,1,Number.POSITIVE_INFINITY,3200);Cn.tick({atMillis:4200});var Bv=Cn.render(),Uv=Cn.snapshot();function Yv(t,e){t.playerReadyZones().forEach(i=>{t.press({x:i.minX,y:i.minY,pressed:!0,atMillis:e})})}function Uf(t){Yv(t,100),t.tick({atMillis:3100})}function tu(t,e,i,a){let l=0;for(let n=0;n<32&&l<i;n+=1)for(let s=0;s<16&&l<i;s+=1)t.targetOwner(s,n)===e&&(t.press({x:s,y:n,pressed:!0,atMillis:a+l}),l+=1)}var If={};Qe(If,{PlayerDisplay:()=>Fv,createGame:()=>wn,damagedFrame:()=>Wv,damagedSnapshot:()=>$v,hazardColor:()=>iu,helloWorldCelebrationMillis:()=>Ks,helloWorldHazards:()=>Js,helloWorldStartingLives:()=>ks,helloWorldTargetScore:()=>Tn,helloWorldTargets:()=>au,idleColor:()=>jf,initEvents:()=>qv,losingFrame:()=>i1,losingSnapshot:()=>a1,manifest:()=>fi,runningFrame:()=>kv,runningSnapshot:()=>Kv,startingFrame:()=>Zv,startingSnapshot:()=>Iv,targetColor:()=>Qs,trailColor:()=>qf,waitingFrame:()=>jv,waitingSnapshot:()=>Vv,winningFrame:()=>e1,winningSnapshot:()=>t1});var Ie=Y(q(),1);function Fv({snapshot:t,frame:e}){let i=t.matchTarget??5,a=t.phase==="finished",l=a?t.success?"is-result-win":"is-result-lose":"",n=t.success?"green":t.lastEventCue==="fail"?"red":"cyan",s=Math.max(1,Math.ceil(t.celebrationMillis/1e3)),r=a?(0,Ie.jsxs)("span",{className:"hello-world-result-copy",children:[(0,Ie.jsx)("span",{children:t.success?"\xA1Ganaste!":t.lastEventMessage}),(0,Ie.jsxs)("small",{children:["Reinicio en ",s]})]}):t.lastEventMessage||"Verde suma, rojo resta una vida";return(0,Ie.jsx)(ie,{title:t.label,phase:t.phase,children:(0,Ie.jsxs)("div",{className:`ml-solo-display hello-world-display ${l}`.trim(),children:[(0,Ie.jsx)(Ae,{snapshot:t}),(0,Ie.jsxs)("div",{className:"ml-solo-summary",children:[(0,Ie.jsxs)(ye,{columns:3,className:"ml-solo-number-row",children:[(0,Ie.jsx)(A,{label:"Meta",tone:"green",value:`${t.score}/${i}`}),(0,Ie.jsx)(A,{label:"Vidas",tone:"red",value:(0,Ie.jsx)(nt,{lives:t.lives,maxLives:t.maxLives})}),(0,Ie.jsx)(A,{label:"Tiempo",tone:"yellow",value:J(t.remainingMillis)})]}),(0,Ie.jsx)(A,{className:"ml-solo-message",label:a?t.success?"Victoria":"Fin de la partida":"Estado",tone:n,value:r})]}),e?(0,Ie.jsx)(Oe,{className:"ml-solo-floor",frame:e,label:"Recorrido en el suelo"}):null]})})}var fi={id:"hello-world",label:"Hola Mundo",description:"Sigue los objetivos verdes y evita las baldosas rojas.",availability:{development:!0,production:!1},catalog:{category:"individual",color:"#35d7ff",durationLabel:"30s",modeLabel:"Demostraci\xF3n",audioLabel:"Efectos",rules:["Sigue los objetivos verdes","Evita las baldosas rojas"]},players:{allowAny:!0,min:1,max:1},start:{mode:"player-ready"},defaultDurationMillis:3e4,display:{entry:"./display"},preview:{seed:2024,playerCount:1,actions:[{atMillis:100,type:"press",x:8,y:16},{atMillis:2150,type:"release",x:8,y:16},{atMillis:2300,type:"press",x:4,y:4},{atMillis:2320,type:"release",x:4,y:4}],captureStartMillis:2200,frameCount:18,frameIntervalMillis:120},tags:["example","ci","typescript"]};var Qs="#7ee787",iu="#ff2036",qf="#1f6feb",jf="#05070a",Tn=5,ks=3,Ks=5e3,Ff=[{x:3,y:5},{x:12,y:5},{x:8,y:16},{x:3,y:26},{x:12,y:26}],Xv=[{x:12,y:15},{x:4,y:15},{x:8,y:28}];function wn(t){return new Xf(t)}var Xf=class{config;finishedAtMillis;hazardsHit=0;lastEvent=g("none","Listo",0);lives=ks;nowMillis=0;phase="ready";players;readyGate;score=0;startedAtMillis=0;constructor(e){this.config=D(e,fi),this.readyGate=K(fi.start,gn(1),this.config.nowMillis),this.players=this.scoredPlayers()}init(e){return this.resetState(e),[this.lastEvent]}press(e){if(this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting")return this.applyReadyTransition(this.readyGate.update(e),e.atMillis);if(this.phase!=="running"||!e.pressed)return[];let i=this.currentHazard();if(i&&e.x===i.x&&e.y===i.y)return this.loseLife(e.atMillis);let a=this.currentTarget();return!a||e.x!==a.x||e.y!==a.y?[]:(this.score+=1,this.players=this.scoredPlayers(),this.score>=Tn?this.finishGame(!0,"\xA1Hola Mundo!",e.atMillis):(this.lastEvent=g("hit",`Hola ${this.score}`,e.atMillis),[this.lastEvent]))}release(e){return this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update({...e,pressed:!1}),e.atMillis):[]}tick(e){if(this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting")return this.applyReadyTransition(this.readyGate.tick(e.atMillis),e.atMillis);if(this.phase==="finished"){let i=this.finishedAtMillis??e.atMillis;return e.atMillis-i<Ks?[]:(this.resetState(e.atMillis),[this.lastEvent])}return this.phase!=="running"||this.remainingMillis()>0?[]:this.finishGame(!1,"Tiempo agotado",e.atMillis)}render(){let e=k(jf);if(this.phase==="waiting"||this.phase==="starting")return this.drawPlayerStart(e),e;for(let l of Ff.slice(0,this.score))b(e,l.x,l.y,qf);if(this.phase==="finished")return this.drawResultAnimation(e),e;let i=this.currentTarget();i&&(z(e,i.x-1,i.y-1,3,3,Qs),b(e,i.x,i.y,"#ffffff"));let a=this.currentHazard();return a&&b(e,a.x,a.y,iu),e}snapshot(){let e=this.readyGate.state(this.nowMillis);return{currentGame:fi.id,label:fi.label,phase:this.phase,playerCount:this.config.playerCount,players:this.players,score:this.score,lives:this.lives,maxLives:ks,elapsedMillis:this.elapsedMillis(),remainingMillis:this.remainingMillis(),activeTargets:this.phase==="running"?+!!this.currentTarget()+ +!!this.currentHazard():0,success:this.phase==="finished"&&this.score>=Tn,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?e.countdownMillis:0,readyPlayers:e.readyPlayers,requiredPlayers:e.requiredPlayers,matchTarget:Tn,celebrationDurationMillis:Ks,celebrationMillis:this.celebrationMillis(),hazard:this.phase==="running"?this.currentHazard():void 0}}reset(e={}){this.config=D({...this.config,...e},fi),this.resetState(this.config.nowMillis)}applyReadyTransition(e,i){return e==="players-ready"?(this.phase="starting",this.lastEvent=g("ready","Jugador listo",i),[this.lastEvent]):e==="players-left"?(this.phase="waiting",this.lastEvent=g("ready","Vuelve a la zona iluminada",i),[this.lastEvent]):e==="started"?(this.phase="running",this.startedAtMillis=i,this.lastEvent=g("start","Verde suma, rojo resta una vida",i),[this.lastEvent]):[]}celebrationMillis(){return this.phase!=="finished"||this.finishedAtMillis===void 0?0:Math.max(0,Ks-(this.nowMillis-this.finishedAtMillis))}currentHazard(){return Xv[this.hazardsHit]}currentTarget(){return Ff[this.score]}drawPlayerStart(e){let i=Math.floor(M/2),a=Math.floor(x/2),l=Math.floor(this.nowMillis/(this.phase==="starting"?110:180)),n=this.phase==="starting"?"#ffe176":Qs,s=this.phase==="starting"?2+l%10:3+l%4;Ue(e,{centerX:i,centerY:a,color:n,radius:s})}drawResultAnimation(e){let i=Math.floor((this.nowMillis-(this.finishedAtMillis??this.nowMillis))/140);if(this.score>=Tn){Ge(e,{color:({x:l,y:n})=>(l+n+i)%3===0?"#ffffff":Qs,step:i});return}for(let l=0;l<x;l+=1)for(let n=0;n<M;n+=1)((n+l+i)%8<=1||(n-l-i+64)%11===0)&&b(e,n,l,(n+i)%4===0?"#ff8090":iu)}elapsedMillis(){if(this.phase==="waiting"||this.phase==="starting")return 0;let e=this.phase==="finished"&&this.finishedAtMillis!==void 0?this.finishedAtMillis:this.nowMillis;return Math.max(0,e-this.startedAtMillis)}finishGame(e,i,a){return this.phase="finished",this.finishedAtMillis=a,this.lastEvent=g(e?"win":"fail",i,a),[this.lastEvent]}loseLife(e){return this.lives-=1,this.hazardsHit+=1,this.lives<=0?this.finishGame(!1,"Sin vidas",e):(this.lastEvent=g("fail",`Vida perdida, quedan ${this.lives}`,e),[this.lastEvent])}remainingMillis(){return Math.max(0,this.config.durationMillis-this.elapsedMillis())}resetState(e){this.readyGate.reset(e),this.finishedAtMillis=void 0,this.hazardsHit=0,this.lastEvent=g("ready","Esperando jugador",e),this.lives=ks,this.nowMillis=e,this.phase="waiting",this.score=0,this.startedAtMillis=e,this.players=this.scoredPlayers()}scoredPlayers(){return ve(this.config.playerCount,this.config.players).map(e=>({...e,score:this.score}))}};function Js(){return Xv.map(t=>({...t}))}function au(){return Ff.map(t=>({...t}))}var Vf=wn({seed:2024,playerCount:1,durationMillis:3e4}),qv=Vf.init(0),jv=Vf.render(),Vv=Vf.snapshot(),Ws=wn({seed:2024,playerCount:1,durationMillis:3e4});Ws.init(0);Ws.press({x:8,y:16,pressed:!0,atMillis:100});Ws.tick({atMillis:1100});var Zv=Ws.render(),Iv=Ws.snapshot(),Qv=su(),kv=Qv.render(),Kv=Qv.snapshot(),Zf=su(),Jv=Js()[0];if(!Jv)throw new Error("Hola Mundo requires at least one hazard fixture.");Zf.press({...Jv,pressed:!0,atMillis:2200});var Wv=Zf.render(),$v=Zf.snapshot(),lu=su();au().forEach((t,e)=>{lu.press({...t,pressed:!0,atMillis:2200+e*100})});lu.tick({atMillis:4100});var e1=lu.render(),t1=lu.snapshot(),nu=su();Js().forEach((t,e)=>{nu.press({...t,pressed:!0,atMillis:2200+e*100})});nu.tick({atMillis:4100});var i1=nu.render(),a1=nu.snapshot();function su(){let t=wn({seed:2024,playerCount:1,durationMillis:3e4});return t.init(0),t.press({x:8,y:16,pressed:!0,atMillis:100}),t.tick({atMillis:2100}),t}var Kf={};Qe(Kf,{PlayerDisplay:()=>l1,createGame:()=>uu,damagedFrame:()=>c1,damagedSnapshot:()=>d1,initEvents:()=>n1,lavaCelebrationMillis:()=>ou,lavaDamageImmunityMillis:()=>kf,lavaStartingLives:()=>$s,manifest:()=>hi,runningFrame:()=>o1,runningSnapshot:()=>u1,startingSnapshot:()=>r1,waitingSnapshot:()=>s1});var Et=Y(q(),1);function l1({snapshot:t,frame:e}){return(0,Et.jsx)(ie,{title:t.label,phase:t.phase,children:(0,Et.jsxs)("div",{className:"ml-solo-display",children:[(0,Et.jsx)(Ae,{snapshot:t}),(0,Et.jsxs)("div",{className:"ml-solo-summary",children:[(0,Et.jsxs)(ye,{columns:3,className:"ml-solo-number-row",children:[(0,Et.jsx)(A,{label:"Plataformas",tone:"green",value:t.score}),(0,Et.jsx)(A,{label:"Tiempo",tone:"cyan",value:J(t.remainingMillis)}),(0,Et.jsx)(A,{label:"Vidas",tone:"red",value:(0,Et.jsx)(nt,{lives:t.lives,maxLives:t.maxLives})})]}),(0,Et.jsx)(A,{className:"ml-solo-message",label:"Equipo",tone:t.success?"green":t.lives===0?"red":"yellow",value:t.lastEventMessage||"Pisa solo las plataformas verdes"})]}),e?(0,Et.jsx)(Oe,{className:"ml-solo-floor",frame:e,label:"Lava en el suelo"}):null]})})}var hi={id:"lava",label:"El suelo es lava",description:"Moveos en equipo, evitad la lava y conquistad plataformas seguras durante un minuto.",availability:{development:!0,production:!0},catalog:{category:"team",color:"#ff5268",durationLabel:"60s",modeLabel:"Plataformas",audioLabel:"M\xFAsica + efectos",rules:["Espera en la zona azul","Pisa las plataformas verdes","Evita la lava roja durante un minuto"]},players:{allowAny:!0,min:1,max:6},start:{mode:"player-ready",releaseGraceMillis:1500},defaultDurationMillis:6e4,config:{difficulty:{options:["easy","medium","hard","expert"],default:"medium"}},display:{entry:"./display"},preview:{seed:137,playerCount:0,difficulty:"medium",actions:[{atMillis:100,type:"press",x:8,y:16}],captureStartMillis:4e3,frameCount:24,frameIntervalMillis:120},tags:["lava","cooperativo","typescript"]};var $s=3,ou=5e3,kf=1e3,ru={easy:{speed:2,width:4,height:3,spawnMillis:2400},medium:{speed:2.6,width:3,height:3,spawnMillis:2e3},hard:{speed:3.2,width:3,height:2,spawnMillis:1650},expert:{speed:4,width:2,height:2,spawnMillis:1350}};function uu(t){return new Qf(t)}var Qf=class{config;finishedAtMillis;lastDamageAtMillis=Number.NEGATIVE_INFINITY;lastEvent=g("none","Listo",0);lives=$s;nextPlatformId=1;nextSpawnAtMillis=0;nowMillis=0;phase="ready";platforms=[];players;readyGate;rng;score=0;startedAtMillis=0;constructor(e){this.config=D(e,hi),this.readyGate=K(hi.start,[{minX:5,maxX:10,minY:13,maxY:18}],this.config.nowMillis),this.rng=V(this.config.seed),this.players=this.scoredPlayers()}init(e){return this.resetState(e),[this.lastEvent]}press(e){if(this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting")return this.applyReadyTransition(this.readyGate.update(e),e.atMillis);if(this.phase!=="running"||!e.pressed)return[];this.advancePlatforms(e.atMillis);let i=this.visiblePlatforms().find(a=>xE(e,a));return i?(this.platforms=this.platforms.filter(a=>a.id!==i.id),this.score+=1,this.players=this.scoredPlayers(),this.lastEvent=g("coin",`Plataforma ${this.score}`,e.atMillis),[this.lastEvent]):e.atMillis-this.lastDamageAtMillis<kf?[]:(this.lastDamageAtMillis=e.atMillis,this.lives-=1,this.players=this.scoredPlayers(),this.lives<=0?this.finish(!1,"La lava os ha alcanzado",e.atMillis):(this.lastEvent=g("damage",`Vida perdida, quedan ${this.lives}`,e.atMillis),[this.lastEvent]))}release(e){return this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update({...e,pressed:!1}),e.atMillis):[]}tick(e){return this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.tick(e.atMillis),e.atMillis):this.phase==="finished"?e.atMillis-(this.finishedAtMillis??e.atMillis)>=ou?(this.resetState(e.atMillis),[this.lastEvent]):[]:(this.advancePlatforms(e.atMillis),this.phase==="running"&&this.remainingMillis()===0?this.finish(!0,`${this.score} plataformas seguras`,e.atMillis):[])}render(){let e=k("#8e0b1d");if(this.phase==="waiting"||this.phase==="starting"){let a=Math.floor(this.nowMillis/(this.phase==="starting"?100:180));return Ue(e,{centerX:8,centerY:16,radius:2+a%8,color:this.phase==="starting"?"#ffe176":"#22d3ee"}),e}let i=Math.floor(this.nowMillis/160);for(let a=0;a<x;a+=1)for(let l=0;l<M;l+=1)b(e,l,a,(l*5+a+i)%13<3?"#ff5a1f":"#b20d21");for(let a of this.visiblePlatforms())z(e,a.x,a.y,a.width,a.height,"#39e77d");return this.phase==="finished"&&Ge(e,{color:this.lives>0?"#39e77d":"#ff334e",step:Math.floor((this.nowMillis-(this.finishedAtMillis??this.nowMillis))/140)}),e}snapshot(){let e=this.readyGate.state(this.nowMillis);return{currentGame:hi.id,label:hi.label,phase:this.phase,playerCount:this.config.playerCount,players:this.players,score:this.score,lives:this.lives,maxLives:$s,elapsedMillis:this.elapsedMillis(),remainingMillis:this.remainingMillis(),activeTargets:this.phase==="running"?this.visiblePlatforms().length:0,success:this.phase==="finished"&&this.lives>0,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?e.countdownMillis:0,readyPlayers:e.readyPlayers,requiredPlayers:e.requiredPlayers,safePlatforms:this.visiblePlatforms(),celebrationMillis:this.phase==="finished"?Math.max(0,ou-(this.nowMillis-(this.finishedAtMillis??this.nowMillis))):0}}reset(e={}){this.config=D({...this.config,...e},hi),this.resetState(this.config.nowMillis)}advancePlatforms(e){if(this.phase!=="running")return;let i=ru[this.config.difficulty]??ru.medium;for(;e>=this.nextSpawnAtMillis;)this.platforms.push({id:this.nextPlatformId++,bornMillis:this.nextSpawnAtMillis,width:i.width,height:i.height,x:this.rng.range(0,M-i.width)}),this.nextSpawnAtMillis+=i.spawnMillis;this.platforms=this.platforms.filter(a=>this.platformY(a)<x)}applyReadyTransition(e,i){if(e==="players-ready")this.phase="starting",this.lastEvent=g("ready","Equipo listo",i);else if(e==="players-left")this.phase="waiting",this.lastEvent=g("ready","Vuelve a la zona azul",i);else if(e==="started")this.phase="running",this.startedAtMillis=i,this.nextSpawnAtMillis=i,this.advancePlatforms(i),this.lastEvent=g("start","Pisa solo las plataformas verdes",i);else return[];return[this.lastEvent]}elapsedMillis(){return this.phase==="waiting"||this.phase==="starting"?0:Math.max(0,(this.finishedAtMillis??this.nowMillis)-this.startedAtMillis)}finish(e,i,a){return this.phase="finished",this.finishedAtMillis=a,this.lastEvent=g(e?"win":"fail",i,a),[this.lastEvent]}platformY(e){let i=(ru[this.config.difficulty]??ru.medium).speed;return Math.floor((this.nowMillis-e.bornMillis)*i/1e3)-e.height}remainingMillis(){return Math.max(0,this.config.durationMillis-this.elapsedMillis())}resetState(e){this.readyGate.reset(e),this.finishedAtMillis=void 0,this.lastDamageAtMillis=Number.NEGATIVE_INFINITY,this.lastEvent=g("ready","Espera en la zona azul",e),this.lives=$s,this.nextPlatformId=1,this.nextSpawnAtMillis=e,this.nowMillis=e,this.phase="waiting",this.platforms=[],this.rng=V(this.config.seed),this.score=0,this.startedAtMillis=e,this.players=this.scoredPlayers()}scoredPlayers(){return ve(this.config.playerCount,this.config.players).map(e=>({...e,score:this.score,lives:this.lives}))}visiblePlatforms(){return this.platforms.map(e=>({id:e.id,x:e.x,y:this.platformY(e),width:e.width,height:e.height})).filter(e=>e.y+e.height>0&&e.y<x)}};function xE(t,e){return t.x>=e.x&&t.x<e.x+e.width&&t.y>=e.y&&t.y<e.y+e.height}var Qt=uu({playerCount:0,seed:137,difficulty:"medium"}),n1=Qt.init(0),s1=Qt.snapshot();Qt.press({x:8,y:16,pressed:!0,atMillis:100});var r1=Qt.snapshot();Qt.tick({atMillis:2100});Qt.tick({atMillis:4e3});var o1=Qt.render(),u1=Qt.snapshot();Qt.press({x:0,y:31,pressed:!0,atMillis:4100});var c1=Qt.render(),d1=Qt.snapshot();var ih={};Qe(ih,{PlayerDisplay:()=>f1,createGame:()=>cu,failedFrame:()=>R1,failedSnapshot:()=>A1,finishedFrame:()=>z1,finishedSnapshot:()=>P1,laneLayout:()=>Wf,manifest:()=>kt,memorizingFrame:()=>G1,memorizingSnapshot:()=>C1,recallingFrame:()=>T1,recallingSnapshot:()=>w1,startingFrame:()=>x1,startingSnapshot:()=>S1,waitingFrame:()=>v1,waitingSnapshot:()=>b1});var W=Y(q(),1);function f1({snapshot:t}){let e=Math.max(1,Math.ceil((t.countdownMillis??0)/1e3)),i=EE(t,e);return(0,W.jsx)(ie,{title:t.label,phase:t.phase,children:(0,W.jsxs)("div",{className:`memory-challenge-display is-phase-${t.phase} is-stage-${t.memoryStage}`,children:[(0,W.jsxs)("section",{className:"memory-challenge-hero",children:[(0,W.jsxs)("div",{children:[(0,W.jsx)("span",{children:i.eyebrow}),(0,W.jsx)("strong",{children:i.title}),(0,W.jsx)("b",{children:i.caption})]}),(0,W.jsxs)("article",{children:[(0,W.jsx)("span",{children:"Tiempo"}),(0,W.jsx)("strong",{children:J(t.remainingMillis)})]}),(0,W.jsxs)("article",{children:[(0,W.jsx)("span",{children:"Mejor camino"}),(0,W.jsx)("strong",{children:t.score})]})]}),(0,W.jsx)("section",{className:"memory-challenge-players",style:{"--memory-columns":t.playerCount},children:t.playerProgress.map(a=>(0,W.jsx)(SE,{player:a,ready:t.readyPlayerIndices.includes(a.index),winner:t.winnerIndex===a.index},a.index))}),(0,W.jsxs)("footer",{className:"memory-challenge-event",children:[(0,W.jsx)("span",{children:t.phase==="finished"?"Resultado":"\xDAltimo evento"}),(0,W.jsx)("strong",{children:t.lastEventMessage},t.motionEventId),(0,W.jsx)("b",{children:t.phase==="running"?GE(t):`${t.readyPlayers}/${t.requiredPlayers} listos`})]})]})})}function SE({player:t,ready:e,winner:i}){let a=t.pathLength===0?0:t.bestProgress/t.pathLength,l={"--memory-player":t.color,"--memory-player-rgb":CE(t.color),"--memory-progress":a},n=i?"Ganador":t.status==="failed"?"Vuelve al inicio":t.status==="memorizing"?"Memoriza":e?"Listo":"En carrera";return(0,W.jsxs)("article",{className:`memory-challenge-player is-${t.status}${i?" is-winner":""}`,style:l,children:[(0,W.jsxs)("header",{children:[(0,W.jsx)("i",{}),(0,W.jsx)("strong",{children:t.label}),(0,W.jsx)("b",{children:n})]}),(0,W.jsxs)("div",{className:"memory-challenge-score",children:[(0,W.jsx)("strong",{children:t.bestProgress}),(0,W.jsxs)("span",{children:["de ",t.pathLength," baldosas"]})]}),(0,W.jsx)("div",{className:"memory-challenge-track",children:(0,W.jsx)("i",{})}),(0,W.jsxs)("footer",{children:[(0,W.jsx)("span",{children:"Avance actual"}),(0,W.jsxs)("strong",{children:[Math.round(a*100),"%"]})]})]})}function EE(t,e){return t.phase==="waiting"?{eyebrow:`Listos ${t.readyPlayers}/${t.requiredPlayers}`,title:"Busca tu salida",caption:"Cada jugador ocupa la zona iluminada de su calle"}:t.phase==="starting"?{eyebrow:"Todos listos",title:String(e),caption:"Mira bien: tu camino aparecer\xE1 enseguida"}:t.phase==="finished"?t.winnerIndex>=0?{eyebrow:"Camino completado",title:`\xA1Gana ${t.winnerLabel}!`,caption:"La ruta vencedora vuelve a iluminarse"}:{eyebrow:"Tiempo agotado",title:"La lava gana",caption:"Nueva carrera en unos segundos"}:t.memoryStage==="memorize"?{eyebrow:`Oculto en ${J(t.stageMillis)}`,title:"Memoriza tu camino",caption:"Sigue el color desde tu salida hasta el final"}:{eyebrow:"Camino oculto",title:"Avanza de memoria",caption:"Si fallas, vuelve a tu salida para ver la ruta otra vez"}}function GE(t){return t.memoryStage==="memorize"?`Se oculta en ${J(t.stageMillis)}`:"Camino oculto"}function CE(t){return/^#[0-9a-f]{6}$/i.test(t)?[1,3,5].map(e=>Number.parseInt(t.slice(e,e+2),16)).join(", "):"255, 255, 255"}var kt={id:"memory-challenge",label:"Reto de memoria",description:"Memoriza un camino oculto en tu calle y rec\xF3rrelo antes que los dem\xE1s sin pisar la lava.",availability:{development:!0,production:!0},catalog:{category:"team",color:"#005af8",durationLabel:"90 s",modeLabel:"Camino oculto",audioLabel:"M\xFAsica + efectos",rules:["Cada jugador ocupa la salida de su calle","Memoriza el camino iluminado antes de que desaparezca","Si pisas la lava, vuelve a tu salida para intentarlo otra vez"]},players:{allowAny:!1,min:1,max:4},start:{mode:"player-ready",releaseGraceMillis:1200},defaultDurationMillis:9e4,display:{entry:"./display"},preview:{seed:137,playerCount:2,actions:[{atMillis:100,type:"press",x:3,y:0},{atMillis:100,type:"press",x:11,y:0}],captureStartMillis:2200,frameCount:18,frameIntervalMillis:120},tags:["memory","race","multiplayer","typescript"]};var TE=2800,wE=1500,h1=4e3,y1=2,RE="#120301",AE="#8f1a08",m1="#ff6b22",p1="#ffffff";function cu(t){return new Jf(t)}var Jf=class{config;rng;lanes=[];readyZones=[];readyGate;players=[];phase="waiting";memoryStage="memorize";nowMillis=0;startedAtMillis=0;stageEndsAtMillis=0;finishAtMillis=0;winnerIndex=-1;motionEventId=0;lastEvent=g("none","Listo",0);constructor(e){this.config=D(e,kt),this.rng=V(this.config.seed),this.rebuildBoard(),this.readyGate=K(kt.start,this.readyZones,this.config.nowMillis),this.resetState(this.config.nowMillis)}init(e){return this.resetState(e),this.lastEvent=g("ready","Busca tu salida iluminada",e),[this.lastEvent]}press(e){if(this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting")return this.record(this.applyReadyTransition(this.readyGate.update(e),e.atMillis));if(this.phase!=="running"||!e.pressed)return[];let i=this.playerForPoint(e.x,e.y);if(i<0)return[];let a=this.players[i];if(!a)return[];if(a.status==="failed")return this.contains(this.readyZones[i],e.x,e.y)?(a.status="memorizing",a.progress=0,a.revealUntilMillis=e.atMillis+wE,this.motionEventId+=1,this.record([g("start",`${a.label} vuelve a memorizar`,e.atMillis)])):[];if(a.status==="finished"||this.memoryStage==="memorize")return[];let l=a.path[a.progress];if(l?.x===e.x&&l.y===e.y){if(a.progress+=1,a.bestProgress=Math.max(a.bestProgress,a.progress),a.status="recalling",this.motionEventId+=1,a.progress>=a.pathLength)return this.finishWin(i,e.atMillis);let n=a.progress===1||a.progress%5===0?"coin":"hit";return this.record([g(n,`${a.label}: ${a.progress} de ${a.pathLength}`,e.atMillis)])}return a.path.slice(0,a.progress).some(n=>n.x===e.x&&n.y===e.y)?[]:(a.status="failed",a.progress=0,a.revealUntilMillis=0,this.motionEventId+=1,this.record([g("damage",`${a.label} pis\xF3 la lava`,e.atMillis)]))}release(e){return this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting"?this.record(this.applyReadyTransition(this.readyGate.update({...e,pressed:!1}),e.atMillis)):[]}tick(e){if(this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting")return this.record(this.applyReadyTransition(this.readyGate.tick(e.atMillis),e.atMillis));if(this.phase==="finished")return e.atMillis-this.finishAtMillis>=h1?(this.resetState(e.atMillis),this.record([g("ready","Nueva carrera de memoria",e.atMillis)])):[];if(this.memoryStage==="memorize"&&e.atMillis>=this.stageEndsAtMillis){this.memoryStage="recall";for(let i of this.players)i.status="recalling";return this.motionEventId+=1,this.record([g("start","Los caminos se han ocultado",e.atMillis)])}return this.remainingMillis()<=0?this.finishLoss(e.atMillis):[]}render(){let e=k("#05070a");if(this.drawLava(e),this.drawLaneBorders(e),this.phase==="waiting"||this.phase==="starting")return this.drawReadiness(e),e;if(this.phase==="finished")return this.drawFinished(e),e;for(let i of this.players){this.drawStart(e,i);let a=this.memoryStage==="memorize"||i.status==="failed"||this.nowMillis<i.revealUntilMillis;i.path.forEach((n,s)=>{(s<i.progress||a)&&b(e,n.x,n.y,i.status==="failed"?m1:i.color)});let l=i.path[i.progress];l&&i.status==="recalling"&&!a&&Math.floor(this.nowMillis/220)%2===0&&b(e,l.x,l.y,"#211008")}return e}snapshot(){let e=this.readyGate.state(this.nowMillis),i=this.readyZones.flatMap((l,n)=>this.readyGate.zoneReady(n,this.nowMillis)?[n]:[]),a=Math.max(0,...this.players.map(l=>l.bestProgress));return{currentGame:kt.id,label:kt.label,phase:this.phase,playerCount:this.config.playerCount,players:this.players.map(l=>({index:l.index,label:l.label,color:l.color,score:l.bestProgress,lives:-1})),score:a,lives:-1,elapsedMillis:this.elapsedMillis(),remainingMillis:this.phase==="finished"?Math.max(0,this.finishAtMillis+h1-this.nowMillis):this.remainingMillis(),activeTargets:this.phase==="running"?this.players.filter(l=>l.status!=="finished").length:0,success:this.winnerIndex>=0,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?e.countdownMillis:0,readyPlayers:e.readyPlayers,requiredPlayers:e.requiredPlayers,matchTarget:Math.max(0,...this.players.map(l=>l.pathLength)),memoryStage:this.memoryStage,stageMillis:this.memoryStage==="memorize"?Math.max(0,this.stageEndsAtMillis-this.nowMillis):0,winnerIndex:this.winnerIndex,winnerLabel:this.players[this.winnerIndex]?.label??"",playerProgress:this.players.map(({revealUntilMillis:l,path:n,...s})=>({...s})),paths:this.players.map(l=>l.path.map(n=>({...n}))),readyPlayerIndices:i,motionEventId:this.motionEventId}}reset(e={}){this.config=D({...this.config,...e},kt),this.rng=V(this.config.seed),this.rebuildBoard(),this.readyGate=K(kt.start,this.readyZones,this.config.nowMillis),this.resetState(this.config.nowMillis)}pathForPlayer(e){return this.players[e]?.path.map(i=>({...i}))??[]}playerReadyZones(){return this.readyZones.map(e=>({...e}))}rebuildBoard(){this.lanes=Wf(this.config.playerCount),this.readyZones=this.lanes.map(i=>{let a=Math.min(4,i.width),l=i.x+Math.floor((i.width-a)/2);return{minX:l,maxX:l+a-1,minY:0,maxY:y1-1}});let e=ve(this.config.playerCount,this.config.players);this.players=e.map((i,a)=>{let l=zE(this.rng,this.lanes[a],this.readyZones[a]),n=i.label===`Player ${a+1}`?`Jugador ${a+1}`:i.label;return{index:a,label:n,color:i.color,progress:0,bestProgress:0,pathLength:l.length,status:"memorizing",path:l,revealUntilMillis:0}})}resetState(e){this.rng=V(this.config.seed),this.rebuildBoard(),this.readyGate.reset(e),this.phase="waiting",this.memoryStage="memorize",this.nowMillis=e,this.startedAtMillis=e,this.stageEndsAtMillis=0,this.finishAtMillis=0,this.winnerIndex=-1,this.motionEventId=0,this.lastEvent=g("ready","Busca tu salida iluminada",e)}applyReadyTransition(e,i){return e==="players-ready"?(this.phase="starting",this.motionEventId+=1,[g("ready","Todos los jugadores listos",i)]):e==="players-left"?(this.phase="waiting",this.motionEventId+=1,[g("ready","Vuelve a tu salida",i)]):e==="started"?(this.phase="running",this.memoryStage="memorize",this.startedAtMillis=i,this.stageEndsAtMillis=i+TE,this.players.forEach(a=>{a.status="memorizing"}),this.motionEventId+=1,[g("start","Memoriza tu camino",i)]):[]}finishWin(e,i){let a=this.players[e];return a.status="finished",this.phase="finished",this.memoryStage="game-win",this.winnerIndex=e,this.finishAtMillis=i,this.motionEventId+=1,this.record([g("win",`\xA1${a.label} completa el camino!`,i)])}finishLoss(e){return this.phase="finished",this.memoryStage="game-loss",this.finishAtMillis=e,this.motionEventId+=1,this.record([g("fail","Se acab\xF3 el tiempo",e)])}elapsedMillis(){return this.phase==="waiting"||this.phase==="starting"?0:Math.max(0,this.nowMillis-this.startedAtMillis)}remainingMillis(){return Math.max(0,this.config.durationMillis-this.elapsedMillis())}playerForPoint(e,i){return this.lanes.findIndex(a=>e>=a.x&&e<a.x+a.width&&i>=0&&i<x)}contains(e,i,a){return!!(e&&i>=e.minX&&i<=e.maxX&&a>=e.minY&&a<=e.maxY)}record(e){let i=e.at(-1);return i&&(this.lastEvent=i),e}drawLava(e){let i=Math.floor(this.nowMillis/140);for(let a=0;a<x;a+=1)for(let l=0;l<M;l+=1)(l*5+a*3+i)%13<2?b(e,l,a,AE):(l+a+i)%4===0&&b(e,l,a,RE)}drawLaneBorders(e){for(let i of this.lanes.slice(1))for(let a=0;a<x;a+=1)b(e,i.x-1,a,"#2b2f3a")}drawReadiness(e){this.players.forEach((i,a)=>{let l=this.readyGate.zoneReady(a,this.nowMillis),n=this.readyZones[a];for(let s=n.minY;s<=n.maxY;s+=1)for(let r=n.minX;r<=n.maxX;r+=1){let o=(r+s+Math.floor(this.nowMillis/130))%4;(l||o<2)&&b(e,r,s,l?p1:i.color)}this.phase==="starting"&&i.path.forEach((s,r)=>{(r+Math.floor(this.nowMillis/90))%5<3&&b(e,s.x,s.y,i.color)})})}drawStart(e,i){let a=this.readyZones[i.index];for(let l=a.minY;l<=a.maxY;l+=1)for(let n=a.minX;n<=a.maxX;n+=1)b(e,n,l,i.color)}drawFinished(e){let i=Math.floor((this.nowMillis-this.finishAtMillis)/90);if(this.winnerIndex<0){for(let l=0;l<x;l+=1)for(let n=0;n<M;n+=1)(n+l+i)%5<2&&b(e,n,l,m1);return}let a=this.players[this.winnerIndex];for(let l=0;l<x;l+=1)for(let n=0;n<M;n+=1){let s=this.lanes[this.winnerIndex];n>=s.x&&n<s.x+s.width&&(n+l+i)%4<3&&b(e,n,l,a.color)}a.path.forEach((l,n)=>b(e,l.x,l.y,(n+i)%a.pathLength===0?p1:a.color))}};function Wf(t){let e=L(Math.trunc(t),1,4);return e===1?[{x:0,width:M}]:e===2?[{x:0,width:8},{x:8,width:8}]:e===3?[{x:0,width:4},{x:6,width:4},{x:12,width:4}]:Array.from({length:4},(i,a)=>({x:a*4,width:4}))}function zE(t,e,i){let a=[],l=i.minX+t.int(i.maxX-i.minX+1),n=3+t.int(4);for(let s=y1;s<x;s+=1){if(a.push({x:l,y:s}),n-=1,n>0||s>=x-2)continue;let r=t.int(2)===0?-1:1,o=L(l+r,e.x,e.x+e.width-1);o!==l&&(l=o,a.push({x:l,y:s})),n=3+t.int(5)}return a}var PE=[{name:"Verde",color:"#42e879"},{name:"Cian",color:"#24d9ff"}];function Rn(t){let e=cu({playerCount:2,players:PE,seed:137});return e.init(0),t!=="waiting"&&_E(e,100),(t==="memorize"||t==="recall")&&e.tick({atMillis:2200}),t==="recall"&&e.tick({atMillis:5100}),e}var g1=Rn("waiting"),v1=g1.render(),b1=g1.snapshot(),M1=Rn("starting"),x1=M1.render(),S1=M1.snapshot(),E1=Rn("memorize"),G1=E1.render(),C1=E1.snapshot(),$f=Rn("recall");_1($f,0,7,5200);var T1=$f.render(),w1=$f.snapshot(),eh=Rn("recall");eh.press({x:7,y:31,pressed:!0,atMillis:5200});var R1=eh.render(),A1=eh.snapshot(),th=Rn("recall");_1(th,0,Number.POSITIVE_INFINITY,5200);var z1=th.render(),P1=th.snapshot();function _E(t,e){for(let i of t.playerReadyZones())t.press({x:i.minX,y:i.minY,pressed:!0,atMillis:e})}function _1(t,e,i,a){t.pathForPlayer(e).slice(0,i).forEach((l,n)=>t.press({...l,pressed:!0,atMillis:a+n}))}var sh={};Qe(sh,{PlayerDisplay:()=>N1,createGame:()=>hu,initEvents:()=>D1,manifest:()=>mi,memoriaV2GameWinMillis:()=>nh,memoriaV2MemorizeMillis:()=>fu,memoriaV2RoundWinMillis:()=>lh,memoriaV2StartingLives:()=>An,memoriaV2TotalLevels:()=>du,memorizeFrame:()=>L1,memorizeSnapshot:()=>B1,memoryTargetsForLevel:()=>er,roundWinFrame:()=>F1,roundWinSnapshot:()=>X1,runningFrame:()=>U1,runningSnapshot:()=>Y1,startingSnapshot:()=>H1,waitingSnapshot:()=>O1});var Gt=Y(q(),1);function N1({snapshot:t,frame:e}){let i=t.memoryStage==="memorize"?`Memoriza \xB7 ${J(t.stageMillis)}`:t.lastEventMessage;return(0,Gt.jsx)(ie,{title:t.label,phase:t.phase,children:(0,Gt.jsxs)("div",{className:"ml-solo-display",children:[(0,Gt.jsx)(Ae,{snapshot:t}),(0,Gt.jsxs)("div",{className:"ml-solo-summary",children:[(0,Gt.jsxs)(ye,{columns:3,className:"ml-solo-number-row",children:[(0,Gt.jsx)(A,{label:"Nivel",tone:"blue",value:`${t.level}/${t.totalLevels}`}),(0,Gt.jsx)(A,{label:"Aciertos",tone:"green",value:`${t.claimedTargets}/${t.totalTargets}`}),(0,Gt.jsx)(A,{label:"Vidas",tone:"red",value:(0,Gt.jsx)(nt,{lives:t.lives,maxLives:t.maxLives})})]}),(0,Gt.jsx)(A,{className:"ml-solo-message",label:"Memoria",tone:t.success?"green":t.memoryStage==="game-loss"?"red":"yellow",value:i})]}),e?(0,Gt.jsx)(Oe,{className:"ml-solo-floor",frame:e,label:"Figura en el suelo"}):null]})})}var mi={id:"memoria-v2",label:"Memoria v2",description:"Memoriza y reconstruye figuras cada vez m\xE1s complejas durante veinte niveles.",availability:{development:!0,production:!0},catalog:{category:"team",color:"#22d3ee",durationLabel:"20 niveles",modeLabel:"Memoria progresiva",audioLabel:"M\xFAsica + efectos",rules:["Memoriza la figura azul","Reconstr\xFAyela cuando desaparezca","Cada nivel permite tres errores"]},players:{allowAny:!0,min:1,max:8},start:{mode:"player-ready",releaseGraceMillis:1500},defaultDurationMillis:36e4,display:{entry:"./display"},preview:{seed:137,playerCount:0,actions:[{atMillis:100,type:"press",x:8,y:16}],captureStartMillis:2300,frameCount:24,frameIntervalMillis:120},tags:["memoria","cooperativo","typescript"]};var du=20,An=3,fu=5e3,lh=2200,nh=5e3;function hu(t){return new ah(t)}function er(t,e){let i=V(t+e*2654435769>>>0),a=Math.min(20,4+Math.floor((e-1)/2)),l=[],n=new Set;for(;l.length<a;){let s={x:i.int(16),y:4+i.int(24)},r=`${s.x},${s.y}`;n.has(r)||(n.add(r),l.push(s))}return l}var ah=class{claimed=new Set;config;lastEvent=g("none","Listo",0);level=1;lives=An;nowMillis=0;phase="ready";players;readyGate;stage="memorize";stageEndsAtMillis=0;startedAtMillis=0;targets=[];constructor(e){this.config=D(e,mi),this.readyGate=K(mi.start,[{minX:5,maxX:10,minY:13,maxY:18}],this.config.nowMillis),this.targets=er(this.config.seed,this.level),this.players=this.scoredPlayers()}init(e){return this.resetState(e),[this.lastEvent]}press(e){if(this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting")return this.applyReadyTransition(this.readyGate.update(e),e.atMillis);if(this.phase!=="running"||this.stage!=="recall"||!e.pressed)return[];let i=`${e.x},${e.y}`;return this.targets.some(a=>a.x===e.x&&a.y===e.y)?this.claimed.has(i)?[]:(this.claimed.add(i),this.players=this.scoredPlayers(),this.claimed.size===this.targets.length?this.completeLevel(e.atMillis):(this.lastEvent=g("hit",`Acierto ${this.claimed.size} de ${this.targets.length}`,e.atMillis),[this.lastEvent])):(this.lives-=1,this.players=this.scoredPlayers(),this.lives<=0?this.finish(!1,"Sin vidas",e.atMillis):(this.lastEvent=g("damage",`Error, quedan ${this.lives} vidas`,e.atMillis),[this.lastEvent]))}release(e){return this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update({...e,pressed:!1}),e.atMillis):[]}tick(e){return this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.tick(e.atMillis),e.atMillis):this.phase==="finished"?e.atMillis>=this.stageEndsAtMillis?(this.resetState(e.atMillis),[this.lastEvent]):[]:this.stage==="memorize"&&e.atMillis>=this.stageEndsAtMillis?(this.stage="recall",this.lastEvent=g("start","Reconstruye la figura",e.atMillis),[this.lastEvent]):this.stage==="round-win"&&e.atMillis>=this.stageEndsAtMillis?(this.level+=1,this.lives=An,this.claimed.clear(),this.targets=er(this.config.seed,this.level),this.stage="memorize",this.stageEndsAtMillis=e.atMillis+fu,this.lastEvent=g("ready",`Memoriza el nivel ${this.level}`,e.atMillis),this.players=this.scoredPlayers(),[this.lastEvent]):[]}render(){let e=k("#020712");if(this.phase==="waiting"||this.phase==="starting"){let i=Math.floor(this.nowMillis/(this.phase==="starting"?100:180));return Ue(e,{centerX:8,centerY:16,radius:2+i%8,color:this.phase==="starting"?"#ffe176":"#22d3ee"}),e}if(this.stage==="memorize")for(let i of this.targets)b(e,i.x,i.y,"#22d3ee");else if(this.stage==="recall")for(let i of this.targets)this.claimed.has(`${i.x},${i.y}`)&&b(e,i.x,i.y,"#35e77a");else{let i=this.stage==="game-loss"?"#ff334e":this.stage==="round-win"?"#ffe176":"#35e77a";Ge(e,{color:i,step:Math.floor((this.stageEndsAtMillis-this.nowMillis)/140)})}return e}snapshot(){let e=this.readyGate.state(this.nowMillis);return{currentGame:mi.id,label:mi.label,phase:this.phase,playerCount:this.config.playerCount,players:this.players,score:this.claimed.size,lives:this.lives,maxLives:An,elapsedMillis:this.elapsedMillis(),remainingMillis:this.stage==="memorize"?Math.max(0,this.stageEndsAtMillis-this.nowMillis):0,activeTargets:this.stage==="recall"?this.targets.length-this.claimed.size:0,success:this.phase==="finished"&&this.stage==="game-win",lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?e.countdownMillis:0,readyPlayers:e.readyPlayers,requiredPlayers:e.requiredPlayers,matchTarget:this.targets.length,level:this.level,totalLevels:du,memoryStage:this.stage,claimedTargets:this.claimed.size,totalTargets:this.targets.length,targets:this.targets.map(i=>({...i})),stageMillis:Math.max(0,this.stageEndsAtMillis-this.nowMillis)}}reset(e={}){this.config=D({...this.config,...e},mi),this.resetState(this.config.nowMillis)}applyReadyTransition(e,i){if(e==="players-ready")this.phase="starting",this.lastEvent=g("ready","Jugador listo",i);else if(e==="players-left")this.phase="waiting",this.lastEvent=g("ready","Vuelve al centro",i);else if(e==="started")this.phase="running",this.stage="memorize",this.stageEndsAtMillis=i+fu,this.startedAtMillis=i,this.lastEvent=g("start","Memoriza la figura azul",i);else return[];return[this.lastEvent]}completeLevel(e){return this.level>=du?this.finish(!0,"Memoria completada",e):(this.stage="round-win",this.stageEndsAtMillis=e+lh,this.lastEvent=g("win",`Nivel ${this.level} completado`,e),[this.lastEvent])}elapsedMillis(){return this.phase==="waiting"||this.phase==="starting"?0:Math.max(0,this.nowMillis-this.startedAtMillis)}finish(e,i,a){return this.phase="finished",this.stage=e?"game-win":"game-loss",this.stageEndsAtMillis=a+nh,this.lastEvent=g(e?"win":"fail",i,a),[this.lastEvent]}resetState(e){this.readyGate.reset(e),this.claimed.clear(),this.level=1,this.lives=An,this.nowMillis=e,this.phase="waiting",this.stage="memorize",this.stageEndsAtMillis=0,this.startedAtMillis=e,this.targets=er(this.config.seed,this.level),this.lastEvent=g("ready","Espera en la zona central",e),this.players=this.scoredPlayers()}scoredPlayers(){return ve(this.config.playerCount,this.config.players).map(e=>({...e,score:this.level-1,lives:this.lives}))}};var rt=hu({playerCount:0,seed:137}),D1=rt.init(0),O1=rt.snapshot();rt.press({x:8,y:16,pressed:!0,atMillis:100});var H1=rt.snapshot();rt.tick({atMillis:2100});var L1=rt.render(),B1=rt.snapshot();rt.tick({atMillis:7100});var U1=rt.render(),Y1=rt.snapshot();for(let t of rt.snapshot().targets)rt.press({...t,pressed:!0,atMillis:7200});var F1=rt.render(),X1=rt.snapshot();var yh={};Qe(yh,{PlayerDisplay:()=>q1,createGame:()=>ml,damagedFrame:()=>J1,damagedSnapshot:()=>W1,failedFrame:()=>tb,failedSnapshot:()=>ib,finishedFrame:()=>$1,finishedSnapshot:()=>eb,gameWinAnimationMillis:()=>mu,initEvents:()=>Q1,manifest:()=>pi,meteorCoreColor:()=>hh,meteorDifficultyProfile:()=>Z1,meteorImpactColor:()=>pu,meteorImpactVisibleMillis:()=>dh,meteorWarningColor:()=>fh,playerFootprintColor:()=>mh,runningFrame:()=>k1,runningSnapshot:()=>K1,startingLives:()=>tr});var Ct=Y(q(),1);function q1({snapshot:t,frame:e}){let i=t.phase==="finished"?t.success?"\xA1Tormenta superada!":"La tormenta te alcanz\xF3":t.lastEventMessage||"Esquiva las zonas rojas",a=t.success?"green":t.lives===0?"red":"cyan";return(0,Ct.jsx)(ie,{title:t.label,phase:t.phase,children:(0,Ct.jsxs)("div",{className:"ml-solo-display meteor-dodge-display",children:[(0,Ct.jsx)(Ae,{snapshot:t}),(0,Ct.jsxs)("div",{className:"ml-solo-summary",children:[(0,Ct.jsxs)(ye,{columns:3,className:"ml-solo-number-row",children:[(0,Ct.jsx)(A,{label:"Esquivados",tone:"cyan",value:t.dodgedMeteors}),(0,Ct.jsx)(A,{label:"Vidas",tone:"neutral",value:(0,Ct.jsx)(nt,{lives:t.lives,maxLives:t.maxLives})}),(0,Ct.jsx)(A,{label:"Tiempo",tone:"yellow",value:J(t.remainingMillis)})]}),(0,Ct.jsx)(A,{className:"ml-solo-message",label:"Estado",tone:a,value:i})]}),e?(0,Ct.jsx)(Oe,{className:"ml-solo-floor",frame:e,label:"Tormenta en el suelo"}):null]})})}var pi={id:"meteor-dodge",label:"Lluvia de meteoritos",description:"Cooperative survival game: dodge telegraphed meteor impacts until the storm passes.",availability:{development:!0,production:!1},catalog:{category:"team",color:"#b987ff",durationLabel:"45s",modeLabel:"Supervivencia",audioLabel:"Efectos",rules:["Esquiva las zonas marcadas","Sobrevive hasta que termine la tormenta"]},players:{allowAny:!0,min:1,max:1},start:{mode:"player-ready",releaseGraceMillis:750},config:{difficulty:{default:"medium",options:["easy","medium","hard","expert"]}},defaultDurationMillis:45e3,display:{entry:"./display"},preview:{seed:137,playerCount:1,difficulty:"medium",actions:[{atMillis:100,type:"press",x:8,y:16},{atMillis:2150,type:"release",x:8,y:16}],captureStartMillis:2200,frameCount:18,frameIntervalMillis:120},tags:["arcade","cooperative","survival","typescript"]};var tr=3,mu=3e3,dh=450,fh="#ff5a36",hh="#ffe176",pu="#ffffff",mh="#35d7ff",rh="#02050b",NE="#050d19",DE="#145cff",OE="#35d7ff",HE="#ffe176",oh=["#35d7ff","#5fff9e","#ffe176","#ff3bd7","#ffffff"],uh=["#ff3151","#7b1428","#2a0710"],LE=1e3,BE=350,UE=64,hl={minX:4,maxX:11,minY:12,maxY:19},ph={intervalMillis:1550,largeMeteorEvery:5,radius:1,warningMillis:1350},V1={easy:{intervalMillis:1900,largeMeteorEvery:0,radius:1,warningMillis:1650},medium:ph,hard:{intervalMillis:1200,largeMeteorEvery:3,radius:1,warningMillis:1050},expert:{intervalMillis:900,largeMeteorEvery:1,radius:2,warningMillis:800}};function ml(t){return new ch(t)}var ch=class{config;dodgedMeteors=0;finishedAtMillis=0;lastDamageMillis=Number.NEGATIVE_INFINITY;lastEvent=g("none","Listos para la tormenta",0);lives=tr;meteors=[];nextMeteorId=1;nextMeteorMillis=0;nowMillis=0;occupiedTiles=new Set;phase="ready";players=[];readyGate;rng;startedAtMillis=0;success=!1;constructor(e){this.config=D(e,pi),this.rng=V(this.config.seed),this.readyGate=K(pi.start,[hl],this.config.nowMillis),this.resetState(this.config.nowMillis)}init(e){return this.resetState(e),this.phase="waiting",this.lastEvent=g("ready","Entra en la zona azul",e),[this.lastEvent]}press(e){return this.nowMillis=e.atMillis,this.updateOccupiedTile(e.x,e.y,e.pressed),this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update(e),e.atMillis):[]}release(e){return this.nowMillis=e.atMillis,this.updateOccupiedTile(e.x,e.y,!1),this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update({...e,pressed:!1}),e.atMillis):[]}tick(e){if(this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting")return this.applyReadyTransition(this.readyGate.tick(e.atMillis),e.atMillis);if(this.phase!=="running")return[];let i=[];this.spawnDueMeteors(e.atMillis);for(let a of this.meteors){if(a.result!=="pending"||e.atMillis<a.impactAtMillis)continue;if(!this.meteorContainsOccupiedTile(a)){a.result="dodged",this.dodgedMeteors+=1;continue}if(a.impactAtMillis-this.lastDamageMillis<LE){a.result="protected";continue}if(a.result="hit",this.lastDamageMillis=a.impactAtMillis,this.lives=Math.max(0,this.lives-1),this.lives===0){i.push(this.finish(!1,a.impactAtMillis));break}i.push(g("miss","\xA1Impacto! Mu\xE9vete",a.impactAtMillis))}return this.meteors=this.meteors.filter(a=>a.clearAtMillis>e.atMillis),this.phase==="running"&&this.remainingMillis()===0&&i.push(this.finish(!0,e.atMillis)),this.recordEvents(i)}render(){let e=k(rh);if(this.drawBackground(e),this.phase==="waiting"||this.phase==="starting")return this.drawPlayerStart(e),e;if(this.phase==="finished")return this.success?this.drawWinAnimation(e):this.drawFailAnimation(e),e;for(let i of this.occupiedTiles){let[a,l]=j1(i);b(e,a,l,mh)}for(let i of this.meteors)this.drawMeteor(e,i);return e}snapshot(){let e=this.readyGate.state(this.nowMillis),i=this.success&&this.phase==="finished"?Math.max(0,Math.min(mu,this.nowMillis-this.finishedAtMillis)):0;return{currentGame:pi.id,label:pi.label,phase:this.phase,playerCount:this.config.playerCount,players:this.players.map(a=>({...a,lives:this.lives,score:this.dodgedMeteors})),score:this.dodgedMeteors,lives:this.lives,maxLives:tr,elapsedMillis:this.elapsedMillis(),remainingMillis:this.remainingMillis(),activeTargets:this.meteors.filter(a=>a.result==="pending").length,success:this.success,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?e.countdownMillis:0,readyPlayers:e.readyPlayers,requiredPlayers:e.requiredPlayers,celebrating:this.success&&this.phase==="finished"&&i<mu,celebrationMillis:i,dodgedMeteors:this.dodgedMeteors,meteors:this.meteors.map(a=>({...a})),stormDurationMillis:this.config.durationMillis}}reset(e={}){this.config=D({...this.config,...e},pi),this.rng=V(this.config.seed),this.resetState(this.config.nowMillis),this.phase="waiting"}applyReadyTransition(e,i){return e==="players-ready"?(this.phase="starting",this.lastEvent=g("ready","Zona lista",i),[this.lastEvent]):e==="players-left"?(this.phase="waiting",this.lastEvent=g("ready","Vuelve a la zona azul",i),[this.lastEvent]):e==="started"?(this.phase="running",this.startedAtMillis=i,this.nextMeteorMillis=i+BE,this.lastEvent=g("start","Esquiva las zonas rojas",i),[this.lastEvent]):[]}difficultyProfile(){return V1[this.config.difficulty]??ph}drawBackground(e){for(let i=3;i<x;i+=4)z(e,0,i,M,1,NE)}drawFailAnimation(e){let i=Math.floor((this.nowMillis-this.finishedAtMillis)/180)%uh.length,a=uh[i]??uh[0];for(let l=0;l<x;l+=1){let n=Math.floor(l*M/x);z(e,n-1,l,3,1,a),z(e,M-n-2,l,3,1,a)}}drawMeteor(e,i){if(i.result==="pending"){let r=Math.floor((this.nowMillis-i.spawnedAtMillis)/160)%2===0,o=i.radius*2+1,u=r?fh:"#6c1b19";z(e,i.x-i.radius,i.y-i.radius,o,o,u),i.radius>0&&z(e,i.x-i.radius+1,i.y-i.radius+1,o-2,o-2,rh),b(e,i.x,i.y,hh);return}let a=Math.max(0,this.nowMillis-i.impactAtMillis),l=Math.min(2,Math.floor(a/130)),n=i.radius+l,s=a<140?pu:i.result==="hit"?"#ff3151":"#ff8a2a";z(e,i.x-n,i.y-n,n*2+1,n*2+1,s),b(e,i.x,i.y,pu)}drawPlayerStart(e){let i=Math.floor(this.nowMillis/(this.phase==="starting"?100:190)),a=this.phase==="starting"?HE:i%2===0?OE:DE,l=this.phase==="starting"?i%3:i%2,n=hl.minX+l,s=hl.minY+l,r=hl.maxX-hl.minX+1-l*2,o=hl.maxY-hl.minY+1-l*2;z(e,n,s,r,o,a),r>2&&o>2&&z(e,n+1,s+1,r-2,o-2,rh),b(e,7,15,"#ffffff"),b(e,8,16,"#ffffff")}drawWinAnimation(e){let i=Math.floor(Math.max(0,this.nowMillis-this.finishedAtMillis)/120);Ge(e,{color:({distance:a})=>oh[(a+i)%oh.length]??oh[0],step:i})}elapsedMillis(){if(this.phase==="waiting"||this.phase==="starting"||this.phase==="ready")return 0;let e=this.phase==="finished"?this.finishedAtMillis:this.nowMillis;return Math.max(0,e-this.startedAtMillis)}finish(e,i){this.phase="finished",this.success=e,this.finishedAtMillis=i;let a=g(e?"win":"fail",e?"Tormenta superada":"Sin vidas",i);return this.lastEvent=a,a}meteorContainsOccupiedTile(e){for(let i of this.occupiedTiles){let[a,l]=j1(i);if(Math.abs(a-e.x)<=e.radius&&Math.abs(l-e.y)<=e.radius)return!0}return!1}recordEvents(e){let i=e.at(-1);return i&&(this.lastEvent=i),e}remainingMillis(){return Math.max(0,this.config.durationMillis-this.elapsedMillis())}resetState(e){this.readyGate.reset(e),this.rng=V(this.config.seed),this.dodgedMeteors=0,this.finishedAtMillis=0,this.lastDamageMillis=Number.NEGATIVE_INFINITY,this.lives=tr,this.meteors=[],this.nextMeteorId=1,this.nextMeteorMillis=0,this.nowMillis=e,this.occupiedTiles.clear(),this.players=ve(this.config.playerCount,this.config.players),this.startedAtMillis=e,this.success=!1}spawnDueMeteors(e){let i=this.difficultyProfile(),a=0;for(;this.nextMeteorMillis>0&&this.nextMeteorMillis<=e&&a<UE;){let l=this.nextMeteorId,s=i.largeMeteorEvery>0&&l%i.largeMeteorEvery===0?Math.min(2,i.radius+1):i.radius,r=this.nextMeteorMillis+i.warningMillis;this.meteors.push({clearAtMillis:r+dh,id:l,impactAtMillis:r,radius:s,result:"pending",spawnedAtMillis:this.nextMeteorMillis,x:this.rng.range(s,M-s-1),y:this.rng.range(s,x-s-1)}),this.nextMeteorId+=1,this.nextMeteorMillis+=i.intervalMillis,a+=1}}updateOccupiedTile(e,i,a){if(e<0||e>=M||i<0||i>=x)return;let l=`${e},${i}`;a?this.occupiedTiles.add(l):this.occupiedTiles.delete(l)}};function Z1(t){return{...V1[t]??ph}}function j1(t){let[e="0",i="0"]=t.split(",");return[Number(e),Number(i)]}var zn=ml({playerCount:1,difficulty:"medium",seed:137}),Q1=zn.init(0);yu(zn);zn.release({x:8,y:16,pressed:!1,atMillis:2150});zn.tick({atMillis:4e3});var k1=zn.render(),K1=zn.snapshot(),ir=ml({playerCount:1,difficulty:"easy",seed:137});ir.init(0);yu(ir);ab(ir,2450);var J1=ir.render(),W1=ir.snapshot(),pl=ml({playerCount:1,difficulty:"medium",durationMillis:4e3,seed:137});pl.init(0);yu(pl);pl.release({x:8,y:16,pressed:!1,atMillis:2150});pl.tick({atMillis:6100});pl.tick({atMillis:7e3});var $1=pl.render(),eb=pl.snapshot(),ar=ml({playerCount:1,difficulty:"easy",seed:137});ar.init(0);yu(ar);var I1=2450;for(let t=0;t<3;t+=1)I1=ab(ar,I1)+1050;var tb=ar.render(),ib=ar.snapshot();function yu(t){t.press({x:8,y:16,pressed:!0,atMillis:100}),t.tick({atMillis:2100})}function ab(t,e){t.release({x:8,y:16,pressed:!1,atMillis:e}),t.tick({atMillis:e});let i=t.snapshot().meteors.find(a=>a.result==="pending");return i?(t.press({x:i.x,y:i.y,pressed:!0,atMillis:i.impactAtMillis-1}),t.tick({atMillis:i.impactAtMillis}),t.release({x:i.x,y:i.y,pressed:!1,atMillis:i.impactAtMillis+1}),i.impactAtMillis+1):e}var vh={};Qe(vh,{PlayerDisplay:()=>lb,createGame:()=>vu,finishedFrame:()=>db,finishedSnapshot:()=>fb,initEvents:()=>sb,manifest:()=>Ft,patronesCelebrationMillis:()=>gu,patternTargets:()=>Pn,runningFrame:()=>ub,runningSnapshot:()=>cb,startingSnapshot:()=>ob,waitingSnapshot:()=>rb});var Yt=Y(q(),1);function lb({snapshot:t,frame:e}){return(0,Yt.jsx)(ie,{title:t.label,phase:t.phase,children:(0,Yt.jsxs)("div",{className:"ml-solo-display",children:[(0,Yt.jsx)(Ae,{snapshot:t}),(0,Yt.jsxs)("div",{className:"ml-solo-summary",children:[(0,Yt.jsxs)(ye,{columns:3,className:"ml-solo-number-row",children:[(0,Yt.jsx)(A,{label:"Aciertos",tone:"green",value:t.claimedTargets}),(0,Yt.jsx)(A,{label:"Objetivos",tone:"blue",value:t.totalTargets}),(0,Yt.jsx)(A,{label:"Tiempo",tone:"cyan",value:J(t.remainingMillis)})]}),(0,Yt.jsx)(A,{className:"ml-solo-message",label:"Patr\xF3n",tone:t.success?"green":"yellow",value:t.lastEventMessage||"Reconstruye el patr\xF3n azul"})]}),e?(0,Yt.jsx)(Oe,{className:"ml-solo-floor",frame:e,label:"Patr\xF3n en el suelo"}):null]})})}var Ft={id:"patrones",label:"Patrones",description:"Reconstruye patrones azules sin pisar baldosas incorrectas.",availability:{development:!0,production:!0},catalog:{category:"team",color:"#176bff",durationLabel:"45s",modeLabel:"Reconstrucci\xF3n",audioLabel:"M\xFAsica + efectos",rules:["Memoriza el patr\xF3n azul","Pisa cada objetivo una vez","Evita las dem\xE1s baldosas"]},players:{allowAny:!0,min:1,max:1},start:{mode:"player-ready"},defaultDurationMillis:45e3,config:{difficulty:{options:["easy","medium","hard"],default:"medium"}},display:{entry:"./display"},preview:{seed:137,playerCount:0,difficulty:"medium",actions:[{atMillis:100,type:"press",x:8,y:16}],captureStartMillis:2300,frameCount:24,frameIntervalMillis:120},tags:["patrones","memoria","typescript"]};var gu=5e3,nb={easy:[{x:7,y:11},{x:8,y:11},{x:6,y:12},{x:9,y:12},{x:5,y:13},{x:10,y:13},{x:7,y:14},{x:8,y:14}],medium:[{x:7,y:8},{x:8,y:8},{x:6,y:10},{x:9,y:10},{x:5,y:12},{x:10,y:12},{x:6,y:14},{x:9,y:14},{x:7,y:16},{x:8,y:16},{x:7,y:18},{x:8,y:18}],hard:[{x:7,y:7},{x:8,y:7},{x:5,y:9},{x:10,y:9},{x:4,y:12},{x:11,y:12},{x:6,y:13},{x:9,y:13},{x:5,y:16},{x:10,y:16},{x:7,y:17},{x:8,y:17},{x:6,y:20},{x:9,y:20},{x:7,y:22},{x:8,y:22}]};function Pn(t="medium"){return(nb[t]??nb.medium??[]).map(e=>({...e}))}function vu(t){return new gh(t)}var gh=class{claimed=new Set;config;finishedAtMillis;lastEvent=g("none","Listo",0);nowMillis=0;phase="ready";players;readyGate;startedAtMillis=0;success=!1;targets;constructor(e){this.config=D(e,Ft),this.readyGate=K(Ft.start,[{minX:5,maxX:10,minY:13,maxY:18}],this.config.nowMillis),this.targets=Pn(this.config.difficulty),this.players=this.scoredPlayers()}init(e){return this.resetState(e),[this.lastEvent]}press(e){if(this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting")return this.applyReadyTransition(this.readyGate.update(e),e.atMillis);if(this.phase!=="running"||!e.pressed)return[];let i=`${e.x},${e.y}`;return this.targets.some(a=>a.x===e.x&&a.y===e.y)?this.claimed.has(i)?[]:(this.claimed.add(i),this.players=this.scoredPlayers(),this.claimed.size===this.targets.length?this.finish(!0,"Patr\xF3n completado",e.atMillis):(this.lastEvent=g("hit",`Acierto ${this.claimed.size} de ${this.targets.length}`,e.atMillis),[this.lastEvent])):this.finish(!1,"Baldosa incorrecta",e.atMillis)}release(e){return this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update({...e,pressed:!1}),e.atMillis):[]}tick(e){return this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.tick(e.atMillis),e.atMillis):this.phase==="finished"?e.atMillis-(this.finishedAtMillis??e.atMillis)>=gu?(this.resetState(e.atMillis),[this.lastEvent]):[]:this.phase==="running"&&this.remainingMillis()===0?this.finish(!1,"Tiempo agotado",e.atMillis):[]}render(){let e=k("#030712");if(this.phase==="waiting"||this.phase==="starting"){let i=Math.floor(this.nowMillis/(this.phase==="starting"?100:180));return Ue(e,{centerX:8,centerY:16,radius:2+i%8,color:this.phase==="starting"?"#ffe176":"#176bff"}),e}for(let i of this.targets)b(e,i.x,i.y,this.claimed.has(`${i.x},${i.y}`)?"#35e77a":"#176bff");return this.phase==="finished"&&Ge(e,{color:this.success?"#35e77a":"#ff334e",step:Math.floor((this.nowMillis-(this.finishedAtMillis??this.nowMillis))/140)}),e}snapshot(){let e=this.readyGate.state(this.nowMillis);return{currentGame:Ft.id,label:Ft.label,phase:this.phase,playerCount:this.config.playerCount,players:this.players,score:this.claimed.size,lives:-1,elapsedMillis:this.elapsedMillis(),remainingMillis:this.remainingMillis(),activeTargets:this.phase==="running"?this.targets.length-this.claimed.size:0,success:this.phase==="finished"&&this.success,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?e.countdownMillis:0,readyPlayers:e.readyPlayers,requiredPlayers:e.requiredPlayers,matchTarget:this.targets.length,claimedTargets:this.claimed.size,totalTargets:this.targets.length,celebrationMillis:this.phase==="finished"?Math.max(0,gu-(this.nowMillis-(this.finishedAtMillis??this.nowMillis))):0}}reset(e={}){this.config=D({...this.config,...e},Ft),this.targets=Pn(this.config.difficulty),this.resetState(this.config.nowMillis)}applyReadyTransition(e,i){if(e==="players-ready")this.phase="starting",this.lastEvent=g("ready","Jugador listo",i);else if(e==="players-left")this.phase="waiting",this.lastEvent=g("ready","Vuelve al centro",i);else if(e==="started")this.phase="running",this.startedAtMillis=i,this.lastEvent=g("start","Reconstruye el patr\xF3n azul",i);else return[];return[this.lastEvent]}elapsedMillis(){return this.phase==="waiting"||this.phase==="starting"?0:Math.max(0,(this.finishedAtMillis??this.nowMillis)-this.startedAtMillis)}finish(e,i,a){return this.phase="finished",this.success=e,this.finishedAtMillis=a,this.lastEvent=g(e?"win":"fail",i,a),[this.lastEvent]}remainingMillis(){return Math.max(0,this.config.durationMillis-this.elapsedMillis())}resetState(e){this.readyGate.reset(e),this.claimed.clear(),this.finishedAtMillis=void 0,this.lastEvent=g("ready","Espera en la zona central",e),this.nowMillis=e,this.phase="waiting",this.startedAtMillis=e,this.success=!1,this.players=this.scoredPlayers()}scoredPlayers(){return ve(this.config.playerCount,this.config.players).map(e=>({...e,score:this.claimed.size}))}};var yi=vu({playerCount:0,difficulty:"medium",durationMillis:Ft.defaultDurationMillis}),sb=yi.init(0),rb=yi.snapshot();yi.press({x:8,y:16,pressed:!0,atMillis:100});var ob=yi.snapshot();yi.tick({atMillis:2100});var ub=yi.render(),cb=yi.snapshot();Pn("medium").forEach((t,e)=>yi.press({...t,pressed:!0,atMillis:2200+e*10}));var db=yi.render(),fb=yi.snapshot();var Gh={};Qe(Gh,{PlayerDisplay:()=>hb,ballColor:()=>yl,blueColor:()=>Qi,createGame:()=>yb,finishedSnapshot:()=>vb,manifest:()=>ot,pingPongConfigVars:()=>Ha,redColor:()=>Ii,runningFrame:()=>gb,runningSnapshot:()=>Eh,waitingSnapshot:()=>Sh});var ze=Y(q(),1);function bh(t){return{"--ping-pong-ball-x":`${3.5+t.y/31*93}%`,"--ping-pong-ball-y":`${18+t.x/15*64}%`}}function hb({snapshot:t}){let[e,i]=t.players,a=e??{label:"Rojo",score:0,color:"#ff1c28"},l=i??{label:"Azul",score:0,color:"#145cff"},n=Math.max(t.matchTarget,1),s=n*2-1,r=t.phase==="starting"?"Empieza en":"Objetivo",o=t.phase==="starting"?J(t.countdownMillis):n,u=t.phase==="starting"?"preparados":"puntos para ganar",d=t.phase==="finished"?"\xDAltimo peloteo":"Peloteo",p=t.phase==="finished"&&t.lastRoundHits>0?t.lastRoundHits:t.roundHits,f=t.lastRoundWinner||"-",y=f===a.label?"red":f===l.label?"blue":"neutral",G=t.phase==="waiting"||t.phase==="starting",C=Math.min(s,t.rounds.length+(t.phase==="running"||t.phase==="starting"?1:0)),O=G?"Listos":"Ronda",h=G?`${t.activeTargets}/2`:`${C}/${s}`,c=t.phase==="running",m=t.phase==="finished"?null:Math.min(s,t.rounds.length+1),v=t.pointScorer===0?"red":t.pointScorer===1?"blue":"none",w=t.winnerIndex===0?"red":t.winnerIndex===1?"blue":"none",B=["ping-pong-display","ml-versus-display",`is-phase-${t.phase}`,t.pointFlashMillis>0?`is-scoring-${v}`:"",t.phase==="finished"?`is-winner-${w}`:""].filter(Boolean).join(" "),T=t.pointScorer===0?a.label:l.label,N=t.winnerIndex===0?a.label:l.label,E=t.phase==="waiting"?`${t.activeTargets}/2 en posici\xF3n`:t.phase==="starting"?"Preparados":t.phase==="finished"?`Victoria ${N}`:t.pointFlashMillis>0?`Punto ${T}`:t.roundHits>0?`${t.roundHits} ${t.roundHits===1?"golpe":"golpes"}`:"Saque",P=t.impact?bh(t.impact):void 0;return(0,ze.jsx)(ie,{title:t.label,phase:t.phase,variant:"versus",children:(0,ze.jsxs)("div",{className:B,style:{"--ping-pong-rally-pace":t.rallyPace},children:[(0,ze.jsx)(pn,{className:"ping-pong-scoreboard",left:a,right:l,target:n,centerLabel:r,centerValue:o,centerCaption:u}),(0,ze.jsxs)("section",{"aria-label":`Trayectoria de la pelota: ${E}`,className:"ping-pong-rally-lane",children:[(0,ze.jsx)("span",{className:"ping-pong-rally-team is-red",children:"Rojo"}),(0,ze.jsx)("span",{className:"ping-pong-rally-team is-blue",children:"Azul"}),(0,ze.jsx)("span",{className:"ping-pong-rally-net","aria-hidden":"true"}),(0,ze.jsx)("span",{className:"ping-pong-rally-scan","aria-hidden":"true"}),t.ballTrail.map((be,Mi)=>(0,ze.jsx)("i",{"aria-hidden":"true",className:"ping-pong-ball-trail",style:{...bh(be),"--ping-pong-trail-index":Mi}},`${Mi}-${be.x}-${be.y}`)),(0,ze.jsx)("i",{"aria-hidden":"true",className:"ping-pong-ball",style:bh(t.ball)}),t.impact?(0,ze.jsx)("i",{"aria-hidden":"true",className:`ping-pong-impact is-${t.impact.team===0?"red":"blue"}`,style:P},t.motionEventId):null,(0,ze.jsx)("strong",{className:"ping-pong-rally-caption",children:E},`caption-${t.motionEventId}`)]}),(0,ze.jsxs)(ye,{columns:4,className:"ping-pong-metrics",children:[(0,ze.jsx)(A,{className:"ping-pong-rally-metric",label:d,tone:"cyan",value:p}),(0,ze.jsx)(A,{className:"ping-pong-progress-metric",label:O,tone:G?"green":"yellow",value:h}),(0,ze.jsx)(A,{className:"ping-pong-last-metric",label:"\xDAltimo",tone:y,value:f}),(0,ze.jsx)(A,{className:"ping-pong-time-metric",label:"Tiempo",tone:"amber",value:J(t.elapsedMillis)})]}),(0,ze.jsx)(yn,{className:"ping-pong-rounds",activeCaption:c?"Punto en curso":"Por comenzar",activeLabel:c?"En juego":"Siguiente",activeRound:m,rounds:t.rounds,totalRounds:s})]})})}var Ha={pointsToWin:{key:"points_to_win",label:"Points to win",playerFacing:!0,description:"The first team to reach this score wins. A match can last up to twice this value minus one rounds.",type:"int",default:5,min:1,max:21,step:1},initialBallSpeed:{key:"initial_ball_speed",label:"Initial ball speed (tiles/s)",playerFacing:!1,description:"The ball's starting speed in floor tiles per second on Easy. Medium, Hard, and Expert apply the difficulty multiplier curve to this value.",type:"float",default:5.75,min:3,max:10,step:.25},returnSpeedMultiplier:{key:"return_speed_multiplier",label:"Speed multiplier per return",playerFacing:!1,description:"The ball accelerates after every successful paddle return. Difficulty scales the increase above 1x, with a safety cap at 2.5 times the starting speed.",type:"float",default:1.035,min:1,max:1.1,step:.005},difficultyMultiplier:{key:"difficulty_multiplier",label:"Difficulty multiplier step",playerFacing:!1,description:"Easy uses 1x, Medium uses one step, Hard uses the step squared, and Expert uses the step cubed. It affects both starting speed and return acceleration.",type:"float",default:1.2,min:1,max:1.35,step:.05}},ot={id:"ping-pong",label:"Ping Pong",description:"Two-player arcade ping pong for red and blue halves of the Motion Levels floor.",availability:{development:!0,production:!0},catalog:{category:"versus",color:"#145cff",durationLabel:"A 5 puntos",modeLabel:"Rojo contra azul",audioLabel:"M\xFAsica + efectos",rules:["Un equipo ocupa la mitad roja y otro la azul","Devuelve la pelota pisando la zona iluminada"]},players:{allowAny:!0,min:2,max:2},start:{mode:"player-ready",releaseGraceMillis:1e3},config:{difficulty:{default:"medium",options:["easy","medium","hard","expert"]},vars:Object.values(Ha)},defaultDurationMillis:0,display:{entry:"./display"},preview:{seed:137,playerCount:2,difficulty:"medium",options:{points_to_win:5},actions:[{atMillis:100,type:"press",x:7,y:3},{atMillis:100,type:"press",x:7,y:28}],captureStartMillis:2200,frameCount:18,frameIntervalMillis:120},tags:["arcade","two-player","typescript"]};var Ii="#ff1c28",Qi="#145cff",yl="#ffffff",YE="#05070a",Xi={r:255,g:28,b:40},qi={r:20,g:92,b:255},_n={r:255,g:255,b:255},mb=900,Mh=3e3,bu=2,Mu=29,ji=5,La=Math.floor(M/2),Vi=Math.floor(x/2),FE=2.5;function yb(t){return new xh(t)}var xh=class{config;rng;players;winningScore;speed;startedAtMillis=0;nowMillis=0;readyGate;lastStepMillis=0;pauseUntilMillis=0;finishAtMillis=0;currentIntervalMillis=140;hitCount=0;redPaddleX=0;bluePaddleX=0;ball={x:La,y:Vi,dx:1,dy:1};ballTrail=[];teamScore=[0,0];rounds=[];lastRoundHits=0;lastRoundWinner="";phase="waiting";success=!1;scorer=-1;winner=-1;pointAtMillis=0;lastImpactAtMillis=0;lastImpact=null;motionEventId=0;lastEvent=g("none","Listo",0);constructor(e){this.config=D(e,ot),this.rng=V(this.config.seed),this.readyGate=K(ot.start,gn(2),this.config.nowMillis),this.winningScore=this.readWinningScore(),this.players=this.createPlayers(),this.speed=pb(this.config),this.resetGame(this.config.nowMillis)}init(e){return this.startedAtMillis=e,this.nowMillis=e,this.resetGame(e),this.lastEvent=g("ready","Ping Pong espera rojo y azul",e),[this.lastEvent]}press(e){this.nowMillis=e.atMillis;let i=this.readyGate.update(e);return e.pressed&&this.movePaddle(e.x,e.y),this.recordEvents(this.updatePhase(e.atMillis,i))}release(e){this.nowMillis=e.atMillis;let i=this.readyGate.update({...e,pressed:!1});return this.recordEvents(this.updatePhase(e.atMillis,i))}tick(e){this.nowMillis=e.atMillis;let i=this.updatePhase(e.atMillis,this.readyGate.tick(e.atMillis));if(this.phase!=="running"||e.atMillis<this.pauseUntilMillis)return this.recordEvents(i);for(let a=0;a<8&&!(e.atMillis-this.lastStepMillis<this.currentIntervalMillis);a+=1){this.lastStepMillis+=this.currentIntervalMillis;let l=this.moveBall(this.lastStepMillis);if(l&&i.push(l),this.phase!=="running"||this.lastStepMillis<this.pauseUntilMillis)break}return this.recordEvents(i)}render(){let e=k(YE);return this.phase==="waiting"?(this.drawWaiting(e),e):this.phase==="starting"?(this.drawReady(e),e):this.phase==="finished"?(this.drawWin(e),e):(this.drawArena(e),this.drawScore(e),this.nowMillis<this.pauseUntilMillis?this.drawScoreFlash(e):(this.drawBallTrail(e),this.drawImpact(e),this.drawPaddles(e),this.drawBallGlow(e),b(e,this.ball.x,this.ball.y,yl)),e)}snapshot(){this.recordEvents(this.updatePhase(this.nowMillis));let e=this.readyGate.state(this.nowMillis),i=this.phase==="starting"?e.countdownMillis:0,a=this.phase==="finished"&&this.nowMillis<this.finishAtMillis+Mh?this.finishAtMillis+Mh-this.nowMillis:0;return{currentGame:ot.id,label:ot.label,phase:this.phase,playerCount:this.config.playerCount,players:[{index:0,label:this.labelForTeam(0),color:Ii,score:this.teamScore[0],lives:-1},{index:1,label:this.labelForTeam(1),color:Qi,score:this.teamScore[1],lives:-1}],score:this.teamScore[0]+this.teamScore[1],lives:-1,elapsedMillis:Math.max(0,this.nowMillis-this.startedAtMillis),remainingMillis:a,activeTargets:this.activeHalves(this.nowMillis),success:this.success,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:i,readyPlayers:e.readyPlayers,requiredPlayers:e.requiredPlayers,matchTarget:this.winningScore,roundHits:this.hitCount,lastRoundHits:this.lastRoundHits,lastRoundWinner:this.lastRoundWinner,rounds:this.rounds,ball:{...this.ball},ballTrail:this.ballTrail.map(l=>({...l})),rallyPace:this.speed.initialMillis===this.speed.minimumMillis?1:L((this.speed.initialMillis-this.currentIntervalMillis)/(this.speed.initialMillis-this.speed.minimumMillis),0,1),pointScorer:this.scorer,pointFlashMillis:Math.max(0,this.pauseUntilMillis-this.nowMillis),winnerIndex:this.winner,impact:this.lastImpact&&this.nowMillis-this.lastImpactAtMillis<480?{...this.lastImpact,remainingMillis:480-(this.nowMillis-this.lastImpactAtMillis)}:null,motionEventId:this.motionEventId,initialBallSpeed:this.speed.initialTilesPerSecond,ballSpeed:1e3/this.currentIntervalMillis,returnSpeedMultiplier:this.speed.hitMultiplier,difficultySpeedFactor:this.speed.difficultyFactor}}reset(e={}){this.config=D({...this.config,...e},ot),this.rng=V(this.config.seed),this.winningScore=this.readWinningScore(),this.players=this.createPlayers(),this.speed=pb(this.config),this.motionEventId=0,this.resetGame(this.config.nowMillis),this.lastEvent=g("none","Listo",this.config.nowMillis)}createPlayers(){return[{index:0,label:"Rojo",color:Ii,score:0,lives:-1},{index:1,label:"Azul",color:Qi,score:0,lives:-1}]}readWinningScore(){return Ve(this.config.options,Ha.pointsToWin)}resetGame(e){this.readyGate.reset(e),this.teamScore=[0,0],this.rounds=[],this.lastRoundHits=0,this.lastRoundWinner="",this.redPaddleX=Math.floor((M-ji)/2),this.bluePaddleX=this.redPaddleX,this.phase="waiting",this.success=!1,this.scorer=-1,this.winner=-1,this.pointAtMillis=0,this.lastImpactAtMillis=0,this.lastImpact=null,this.motionEventId+=1,this.startedAtMillis=e,this.finishAtMillis=0,this.resetBall(),this.lastEvent=g("none","Esperando a rojo arriba y azul abajo",e)}updatePhase(e,i=this.readyGate.tick(e)){return this.phase==="finished"?e-this.finishAtMillis>=Mh?(this.resetGame(e),[g("ready","Nueva partida",e)]):[]:i==="players-ready"?(this.phase="starting",this.motionEventId+=1,[g("start","Rojo y azul listos",e)]):i==="players-left"?(this.phase="waiting",this.motionEventId+=1,[g("ready","Vuelve a las zonas roja y azul",e)]):i==="started"?(this.phase="running",this.startedAtMillis=e,this.lastStepMillis=e,this.serve(),this.motionEventId+=1,[g("start","La pelota esta en juego",e)]):[]}movePaddle(e,i){let l=L(Math.round(e),Math.floor(ji/2),M-1-Math.floor(ji/2))-Math.floor(ji/2);i<x/2?this.redPaddleX=l:this.bluePaddleX=l}moveBall(e){let i=this.ball.x+this.ball.dx,a=this.ball.y+this.ball.dy;if(i<0&&(i=0,this.ball.dx=1),i>=M&&(i=M-1,this.ball.dx=-1),this.ball.dy<0&&a===bu&&i>=this.redPaddleX&&i<this.redPaddleX+ji)return this.reflectFromPaddle(i,this.redPaddleX),this.commitBall({...this.ball,x:i,y:bu+1,dy:1}),this.recordImpact(0,i,bu),this.accelerate(),g("coin","Rojo devuelve",e);if(this.ball.dy>0&&a===Mu&&i>=this.bluePaddleX&&i<this.bluePaddleX+ji)return this.reflectFromPaddle(i,this.bluePaddleX),this.commitBall({...this.ball,x:i,y:Mu-1,dy:-1}),this.recordImpact(1,i,Mu),this.accelerate(),g("coin","Azul devuelve",e);if(a<0)return this.scorePoint(1,e),g("score","Punto para azul",e);if(a>=x)return this.scorePoint(0,e),g("score","Punto para rojo",e);this.commitBall({...this.ball,x:i,y:a})}scorePoint(e,i){if(this.teamScore[e]+=1,this.scorer=e,this.pointAtMillis=i,this.motionEventId+=1,this.recordRound(e),this.teamScore[e]>=this.winningScore){this.phase="finished",this.success=e===1,this.winner=e,this.finishAtMillis=i;return}this.resetBall(),this.pauseUntilMillis=i+mb,this.lastStepMillis=this.pauseUntilMillis}recordRound(e){this.lastRoundHits=this.hitCount,this.lastRoundWinner=this.labelForTeam(e),this.rounds=[...this.rounds,{index:this.rounds.length+1,winnerIndex:e,winnerLabel:this.lastRoundWinner,hits:this.lastRoundHits}]}resetBall(){this.ball={...this.ball,x:La,y:Vi},this.ballTrail=[],this.currentIntervalMillis=this.speed.initialMillis,this.hitCount=0,this.pauseUntilMillis=0,this.serve()}serve(){this.ball={x:La,y:Vi,dy:this.rng.int(2)===0?-1:1,dx:this.rng.int(2)===0?-1:1}}reflectFromPaddle(e,i){let a=i+Math.floor(ji/2);e<a?this.ball.dx=-1:e>a?this.ball.dx=1:this.ball.dx=this.rng.int(2)===0?-1:1}accelerate(){this.hitCount+=1,this.currentIntervalMillis=Math.max(this.speed.minimumMillis,this.currentIntervalMillis/this.speed.hitMultiplier)}commitBall(e){this.ballTrail=[{x:this.ball.x,y:this.ball.y},...this.ballTrail.filter(i=>i.x!==this.ball.x||i.y!==this.ball.y)].slice(0,5),this.ball=e}recordImpact(e,i,a){this.lastImpact={team:e,x:i,y:a},this.lastImpactAtMillis=this.nowMillis,this.motionEventId+=1}drawWaiting(e){let i=this.halfReady(0,this.nowMillis),a=this.halfReady(1,this.nowMillis);this.drawWaitingHalf(e,0,i),this.drawWaitingHalf(e,1,a),i?this.drawSoftBar(e,3,5,10,Xi):this.drawBreathingOutline(e,0,Xi),a?this.drawSoftBar(e,3,24,10,qi):this.drawBreathingOutline(e,1,qi)}drawReady(e){let i=Xs(ot.start),a=Math.max(0,i-this.readyGate.state(this.nowMillis).countdownMillis),n=L(a/i,0,1)*(x*.7),s=.5+Math.sin(a/86)*.5;for(let r=0;r<x;r+=1)for(let o=0;o<M;o+=1){let u=Math.abs(o-La)+Math.abs(r-Vi),d=r>=x/2?qi:Xi,p=Math.abs(u-n),f=Math.max(0,1-p/3.2),y=7+(Math.sin(o*.82+r*.38-a/120)+1)*4;f>0?b(e,o,r,gi(d,28+f*74,f*24)):u<n&&b(e,o,r,Zi(d,y+s*10))}this.drawCenterLine(e,18+s*20),this.drawBallGlow(e),b(e,La,Vi,yl)}drawScoreFlash(e){let i=this.scorer===1?qi:Xi,a=Math.max(0,this.nowMillis-this.pointAtMillis),l=L(a/mb,0,1),n=this.scorer===0?x-1:0,s=l*(x+8);for(let r=0;r<x;r+=1)for(let o=0;o<M;o+=1){let u=Math.hypot((o-La)*1.35,r-n),d=Math.max(0,1-Math.abs(u-s)/3.4),p=Math.sin(o*12.13+r*7.71+a/38)>.9?1:0,f=1-l;d>0?b(e,o,r,gi(i,28+d*82,d*34)):p>0&&f>.18&&b(e,o,r,gi(i,22+f*44,f*12))}this.drawCenterLine(e,12+(1-l)*24),this.drawPaddles(e)}drawWin(e){let i=this.winner===1?qi:Xi,a=Math.max(0,this.nowMillis-this.finishAtMillis),l=a/92,n=.5+Math.sin(a/110)*.5;for(let r=0;r<x;r+=1)for(let o=0;o<M;o+=1){let d=((this.winner===0?x-1-r:r)+o*.72-l+x*4)%11,p=Math.sin(o*17.17+r*11.31+a/55);d<3.8?b(e,o,r,gi(i,38+(3.8-d)*15+n*12,12+n*18)):p>.91&&b(e,o,r,gi(i,48,32))}let s=64+n*26;z(e,La-1,Vi-1,3,3,Zi(_n,s)),b(e,La,Vi,yl)}drawArena(e){let i=this.nowMillis/185;for(let a=1;a<x-1;a+=1){let l=a<x/2?Xi:qi;for(let n=0;n<M;n+=1){let s=(Math.sin(n*.78+a*.31-i)+1)*.5,r=(n+a)%3===0?4:0;b(e,n,a,Zi(l,4+s*7+r))}}this.drawCenterLine(e,18+(Math.sin(this.nowMillis/140)+1)*5)}drawCenterLine(e,i){for(let a=0;a<M;a+=1)(a+Math.floor(this.nowMillis/120))%3===0&&(b(e,a,Vi-1,gi(_n,i,0)),b(e,a,Vi,gi(_n,i*.72,0)))}drawBallTrail(e){this.ballTrail.forEach((i,a)=>{let l=Math.max(10,46-a*8);b(e,i.x,i.y,Zi(_n,l))})}drawBallGlow(e){let i=20+(Math.sin(this.nowMillis/70)+1)*7;for(let[a,l]of[[-1,0],[1,0],[0,-1],[0,1]])b(e,this.ball.x+a,this.ball.y+l,Zi(_n,i))}drawImpact(e){if(!this.lastImpact)return;let i=this.nowMillis-this.lastImpactAtMillis;if(i<0||i>=480)return;let a=i/480,l=1+a*5.5,n=this.lastImpact.team===0?Xi:qi;for(let s=Math.max(0,this.lastImpact.y-7);s<=Math.min(x-1,this.lastImpact.y+7);s+=1)for(let r=Math.max(0,this.lastImpact.x-7);r<=Math.min(M-1,this.lastImpact.x+7);r+=1){let o=Math.hypot(r-this.lastImpact.x,s-this.lastImpact.y),u=Math.max(0,1-Math.abs(o-l)/1.45);u>0&&b(e,r,s,gi(n,30+u*52,u*28*(1-a)))}}drawBreathingOutline(e,i,a){let l=(this.nowMillis/900+i*.5)%1,n=.5-Math.cos(l*Math.PI*2)*.5,s=Math.round(1+n*2),r=i===0?3+s:21-s,o=48+n*48;this.drawOutline(e,s,r,M-s*2,8,Zi(a,o))}drawScore(e){for(let i=0;i<this.teamScore[0]&&i<M;i+=1)b(e,i,0,Ii);for(let i=0;i<this.teamScore[1]&&i<M;i+=1)b(e,i,x-1,Qi)}drawPaddles(e){this.drawPaddle(e,this.redPaddleX,bu,Xi),this.drawPaddle(e,this.bluePaddleX,Mu,qi)}drawWaitingHalf(e,i,a){let l=i===1?x/2:0,n=i===1?qi:Xi,s=Math.floor(this.nowMillis/120)%10;for(let r=l;r<l+x/2;r+=1)for(let o=0;o<M;o+=1){let u=0;a?u=18+(o+r+s)%6*6:(o+r+s)%7===0&&(u=22),u>0&&b(e,o,r,Zi(n,u))}}drawSoftBar(e,i,a,l,n){let s=Math.floor(this.nowMillis/100)%6;for(let r=0;r<l;r+=1){let o=r===s||r===l-1-s?112:58+r*4;b(e,i+r,a,Zi(n,o)),b(e,i+r,a+1,gi(n,o-8,10)),b(e,i+r,a+2,Zi(n,Math.max(18,o-28)))}}drawPaddle(e,i,a,l){for(let n=0;n<ji;n+=1){let s=n===Math.floor(ji/2)?118:74;b(e,i+n,a,gi(l,s,18))}}drawOutline(e,i,a,l,n,s){let r=Math.max(2,Math.round(l)),o=Math.max(2,Math.round(n));z(e,i,a,r,1,s),z(e,i,a+o-1,r,1,s),z(e,i,a,1,o,s),z(e,i+r-1,a,1,o,s)}halfReady(e,i){return this.readyGate.zoneReady(e,i)}activeHalves(e){return this.readyGate.state(e).readyPlayers}labelForTeam(e){return this.players[e]?.label||(e===0?"Rojo":"Azul")}recordEvents(e){let i=e.at(-1);return i&&(this.lastEvent=i),e}};function pb(t){let e=Ve(t.options,Ha.initialBallSpeed),i=Ve(t.options,Ha.returnSpeedMultiplier),l=Ve(t.options,Ha.difficultyMultiplier)**XE(t.difficulty),n=e*l,s=1+(i-1)*l,r=n*FE;return{difficultyFactor:l,hitMultiplier:s,initialTilesPerSecond:n,initialMillis:1e3/n,minimumMillis:1e3/r}}function XE(t){switch(t){case"medium":return 1;case"hard":return 2;case"expert":return 3;default:return 0}}function Zi(t,e){return oi(st(t,e))}function gi(t,e,i){return oi(cl(st(t,e),st(_n,i)))}var gb=(()=>{let t=k("#05070a");return z(t,5,2,5,1,Ii),z(t,6,29,5,1,Qi),b(t,8,16,yl),t})(),Sh={currentGame:ot.id,label:ot.label,phase:"waiting",playerCount:2,players:[{index:0,label:"Rojo",color:Ii,score:0,lives:-1},{index:1,label:"Azul",color:Qi,score:0,lives:-1}],score:0,lives:-1,elapsedMillis:0,remainingMillis:0,activeTargets:0,success:!1,lastEventCue:"ready",lastEventMessage:"Ping Pong espera rojo y azul",countdownMillis:0,readyPlayers:0,requiredPlayers:2,matchTarget:5,roundHits:0,lastRoundHits:0,lastRoundWinner:"",rounds:[],ball:{x:8,y:16,dx:1,dy:1},ballTrail:[],rallyPace:0,pointScorer:-1,pointFlashMillis:0,winnerIndex:-1,impact:null,motionEventId:1,initialBallSpeed:6.9,ballSpeed:6.9,returnSpeedMultiplier:1.042,difficultySpeedFactor:1.2},Eh={...Sh,phase:"running",readyPlayers:2,elapsedMillis:8200,activeTargets:2,lastEventCue:"coin",lastEventMessage:"Azul devuelve",roundHits:3,ball:{x:11,y:21,dx:1,dy:1},ballTrail:[{x:10,y:20},{x:9,y:19},{x:8,y:18}],rallyPace:.1935,ballSpeed:7.8064,impact:{team:1,x:10,y:29,remainingMillis:180},motionEventId:4},vb={...Eh,phase:"finished",score:5,remainingMillis:2400,success:!0,lastEventCue:"score",lastEventMessage:"Punto para azul",players:[{index:0,label:"Rojo",color:Ii,score:2,lives:-1},{index:1,label:"Azul",color:Qi,score:3,lives:-1}],lastRoundHits:2,lastRoundWinner:"Azul",pointScorer:1,winnerIndex:1,motionEventId:8,rounds:[{index:1,winnerIndex:0,winnerLabel:"Rojo",hits:1},{index:2,winnerIndex:1,winnerLabel:"Azul",hits:2}]};var zh={};Qe(zh,{PlayerDisplay:()=>bb,ballColor:()=>gl,blueColor:()=>ta,createGame:()=>Sb,finishedSnapshot:()=>Gb,manifest:()=>ut,pingPongV2ConfigVars:()=>Ba,redColor:()=>ea,runningFrame:()=>Eb,runningSnapshot:()=>Ah,waitingSnapshot:()=>Rh});var Pe=Y(q(),1);function Ch(t){return{"--ping-pong-ball-x":`${3.5+t.y/31*93}%`,"--ping-pong-ball-y":`${18+t.x/15*64}%`}}function bb({snapshot:t}){let[e,i]=t.players,a=e??{label:"Rojo",score:0,color:"#ff1c28"},l=i??{label:"Azul",score:0,color:"#145cff"},n=Math.max(t.matchTarget,1),s=n*2-1,r=t.phase==="starting"?"Empieza en":"Objetivo",o=t.phase==="starting"?J(t.countdownMillis):n,u=t.phase==="starting"?"preparados":"puntos para ganar",d=t.phase==="finished"?"\xDAltimo peloteo":"Peloteo",p=t.phase==="finished"&&t.lastRoundHits>0?t.lastRoundHits:t.roundHits,f=t.lastRoundWinner||"-",y=f===a.label?"red":f===l.label?"blue":"neutral",G=t.phase==="waiting"||t.phase==="starting",C=Math.min(s,t.rounds.length+(t.phase==="running"||t.phase==="starting"?1:0)),O=G?"Listos":"Ronda",h=G?`${t.activeTargets}/2`:`${C}/${s}`,c=t.phase==="running",m=t.phase==="finished"?null:Math.min(s,t.rounds.length+1),v=t.pointScorer===0?"red":t.pointScorer===1?"blue":"none",w=t.winnerIndex===0?"red":t.winnerIndex===1?"blue":"none",B=["ping-pong-display","ml-versus-display",`is-phase-${t.phase}`,t.pointFlashMillis>0?`is-scoring-${v}`:"",t.phase==="finished"?`is-winner-${w}`:""].filter(Boolean).join(" "),T=t.pointScorer===0?a.label:l.label,N=t.winnerIndex===0?a.label:l.label,E=t.phase==="waiting"?`${t.activeTargets}/2 en posici\xF3n`:t.phase==="starting"?"Preparados":t.phase==="finished"?`Victoria ${N}`:t.pointFlashMillis>0?`Punto ${T}`:t.roundHits>0?`${t.roundHits} ${t.roundHits===1?"golpe":"golpes"}`:"Saque",P=t.impact?Ch(t.impact):void 0;return(0,Pe.jsx)(ie,{title:t.label,phase:t.phase,variant:"versus",children:(0,Pe.jsxs)("div",{className:B,style:{"--ping-pong-rally-pace":t.rallyPace},children:[(0,Pe.jsx)(pn,{className:"ping-pong-scoreboard",left:a,right:l,target:n,centerLabel:r,centerValue:o,centerCaption:u}),(0,Pe.jsxs)("section",{"aria-label":`Trayectoria de la pelota: ${E}`,className:"ping-pong-rally-lane",children:[(0,Pe.jsx)("span",{className:"ping-pong-rally-team is-red",children:"Rojo"}),(0,Pe.jsx)("span",{className:"ping-pong-rally-team is-blue",children:"Azul"}),(0,Pe.jsx)("span",{className:"ping-pong-rally-net","aria-hidden":"true"}),(0,Pe.jsx)("span",{className:"ping-pong-rally-scan","aria-hidden":"true"}),t.ballTrail.map((be,Mi)=>(0,Pe.jsx)("i",{"aria-hidden":"true",className:"ping-pong-ball-trail",style:{...Ch(be),"--ping-pong-trail-index":Mi}},`${Mi}-${be.x}-${be.y}`)),(0,Pe.jsx)("i",{"aria-hidden":"true",className:"ping-pong-ball",style:Ch(t.ball)}),t.impact?(0,Pe.jsx)("i",{"aria-hidden":"true",className:`ping-pong-impact is-${t.impact.team===0?"red":"blue"}`,style:P},t.motionEventId):null,(0,Pe.jsx)("strong",{className:"ping-pong-rally-caption",children:E},`caption-${t.motionEventId}`)]}),(0,Pe.jsxs)(ye,{columns:4,className:"ping-pong-metrics",children:[(0,Pe.jsx)(A,{className:"ping-pong-rally-metric",label:d,tone:"cyan",value:p}),(0,Pe.jsx)(A,{className:"ping-pong-progress-metric",label:O,tone:G?"green":"yellow",value:h}),(0,Pe.jsx)(A,{className:"ping-pong-last-metric",label:"\xDAltimo",tone:y,value:f}),(0,Pe.jsx)(A,{className:"ping-pong-time-metric",label:"Tiempo",tone:"amber",value:J(t.elapsedMillis)})]}),(0,Pe.jsx)(yn,{className:"ping-pong-rounds",activeCaption:c?"Punto en curso":"Por comenzar",activeLabel:c?"En juego":"Siguiente",activeRound:m,rounds:t.rounds,totalRounds:s})]})})}var Ba={pointsToWin:{key:"points_to_win",label:"Points to win",playerFacing:!0,description:"The first team to reach this score wins.",type:"int",default:5,min:1,max:21,step:1},initialBallSpeed:{key:"initial_ball_speed",label:"Initial ball speed (tiles/s)",playerFacing:!1,description:"Starting ball speed on Easy before applying the difficulty curve.",type:"float",default:5.75,min:3,max:10,step:.25},returnSpeedMultiplier:{key:"return_speed_multiplier",label:"Speed multiplier per return",playerFacing:!1,description:"Rally acceleration after each successful paddle return.",type:"float",default:1.035,min:1,max:1.1,step:.005},difficultyMultiplier:{key:"difficulty_multiplier",label:"Difficulty multiplier step",playerFacing:!1,description:"Per-level multiplier for starting speed and return acceleration.",type:"float",default:1.2,min:1,max:1.35,step:.05}},ut={id:"ping-pong-v2",label:"Ping Pong v2",description:"La versi\xF3n competitiva de Ping Pong: peloteos acelerados y partidas al mejor de cinco puntos.",availability:{development:!0,production:!0},catalog:{category:"versus",color:"#145cff",durationLabel:"A 5 puntos",modeLabel:"Rojo contra azul",audioLabel:"M\xFAsica + efectos",rules:["Un equipo ocupa la mitad roja y otro la azul","Mueve la pala pisando tu mitad","Cada devoluci\xF3n acelera la pelota"]},players:{allowAny:!0,min:2,max:2},start:{mode:"player-ready",releaseGraceMillis:1e3},config:{difficulty:{default:"medium",options:["easy","medium","hard","expert"]},vars:Object.values(Ba)},defaultDurationMillis:0,display:{entry:"./display"},preview:{seed:202,playerCount:2,difficulty:"medium",options:{points_to_win:5},actions:[{atMillis:100,type:"press",x:7,y:3},{atMillis:100,type:"press",x:7,y:28}],captureStartMillis:2200,frameCount:18,frameIntervalMillis:120},tags:["arcade","versus","typescript","v2"]};var ea="#ff1c28",ta="#145cff",gl="#ffffff",qE="#05070a",ki={r:255,g:28,b:40},Ki={r:20,g:92,b:255},Nn={r:255,g:255,b:255},Mb=900,Th=3e3,xu=2,Su=29,Ji=5,Ua=Math.floor(M/2),Wi=Math.floor(x/2),jE=2.5;function Sb(t){return new wh(t)}var wh=class{config;rng;players;winningScore;speed;startedAtMillis=0;nowMillis=0;readyGate;lastStepMillis=0;pauseUntilMillis=0;finishAtMillis=0;currentIntervalMillis=140;hitCount=0;redPaddleX=0;bluePaddleX=0;ball={x:Ua,y:Wi,dx:1,dy:1};ballTrail=[];teamScore=[0,0];rounds=[];lastRoundHits=0;lastRoundWinner="";phase="waiting";success=!1;scorer=-1;winner=-1;pointAtMillis=0;lastImpactAtMillis=0;lastImpact=null;motionEventId=0;lastEvent=g("none","Listo",0);constructor(e){this.config=D(e,ut),this.rng=V(this.config.seed),this.readyGate=K(ut.start,gn(2),this.config.nowMillis),this.winningScore=this.readWinningScore(),this.players=this.createPlayers(),this.speed=xb(this.config),this.resetGame(this.config.nowMillis)}init(e){return this.startedAtMillis=e,this.nowMillis=e,this.resetGame(e),this.lastEvent=g("ready","Ping Pong espera rojo y azul",e),[this.lastEvent]}press(e){this.nowMillis=e.atMillis;let i=this.readyGate.update(e);return e.pressed&&this.movePaddle(e.x,e.y),this.recordEvents(this.updatePhase(e.atMillis,i))}release(e){this.nowMillis=e.atMillis;let i=this.readyGate.update({...e,pressed:!1});return this.recordEvents(this.updatePhase(e.atMillis,i))}tick(e){this.nowMillis=e.atMillis;let i=this.updatePhase(e.atMillis,this.readyGate.tick(e.atMillis));if(this.phase!=="running"||e.atMillis<this.pauseUntilMillis)return this.recordEvents(i);for(let a=0;a<8&&!(e.atMillis-this.lastStepMillis<this.currentIntervalMillis);a+=1){this.lastStepMillis+=this.currentIntervalMillis;let l=this.moveBall(this.lastStepMillis);if(l&&i.push(l),this.phase!=="running"||this.lastStepMillis<this.pauseUntilMillis)break}return this.recordEvents(i)}render(){let e=k(qE);return this.phase==="waiting"?(this.drawWaiting(e),e):this.phase==="starting"?(this.drawReady(e),e):this.phase==="finished"?(this.drawWin(e),e):(this.drawArena(e),this.drawScore(e),this.nowMillis<this.pauseUntilMillis?this.drawScoreFlash(e):(this.drawBallTrail(e),this.drawImpact(e),this.drawPaddles(e),this.drawBallGlow(e),b(e,this.ball.x,this.ball.y,gl)),e)}snapshot(){this.recordEvents(this.updatePhase(this.nowMillis));let e=this.readyGate.state(this.nowMillis),i=this.phase==="starting"?e.countdownMillis:0,a=this.phase==="finished"&&this.nowMillis<this.finishAtMillis+Th?this.finishAtMillis+Th-this.nowMillis:0;return{currentGame:ut.id,label:ut.label,phase:this.phase,playerCount:this.config.playerCount,players:[{index:0,label:this.labelForTeam(0),color:ea,score:this.teamScore[0],lives:-1},{index:1,label:this.labelForTeam(1),color:ta,score:this.teamScore[1],lives:-1}],score:this.teamScore[0]+this.teamScore[1],lives:-1,elapsedMillis:Math.max(0,this.nowMillis-this.startedAtMillis),remainingMillis:a,activeTargets:this.activeHalves(this.nowMillis),success:this.success,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:i,readyPlayers:e.readyPlayers,requiredPlayers:e.requiredPlayers,matchTarget:this.winningScore,roundHits:this.hitCount,lastRoundHits:this.lastRoundHits,lastRoundWinner:this.lastRoundWinner,rounds:this.rounds,ball:{...this.ball},ballTrail:this.ballTrail.map(l=>({...l})),rallyPace:this.speed.initialMillis===this.speed.minimumMillis?1:L((this.speed.initialMillis-this.currentIntervalMillis)/(this.speed.initialMillis-this.speed.minimumMillis),0,1),pointScorer:this.scorer,pointFlashMillis:Math.max(0,this.pauseUntilMillis-this.nowMillis),winnerIndex:this.winner,impact:this.lastImpact&&this.nowMillis-this.lastImpactAtMillis<480?{...this.lastImpact,remainingMillis:480-(this.nowMillis-this.lastImpactAtMillis)}:null,motionEventId:this.motionEventId,initialBallSpeed:this.speed.initialTilesPerSecond,ballSpeed:1e3/this.currentIntervalMillis,returnSpeedMultiplier:this.speed.hitMultiplier,difficultySpeedFactor:this.speed.difficultyFactor}}reset(e={}){this.config=D({...this.config,...e},ut),this.rng=V(this.config.seed),this.winningScore=this.readWinningScore(),this.players=this.createPlayers(),this.speed=xb(this.config),this.motionEventId=0,this.resetGame(this.config.nowMillis),this.lastEvent=g("none","Listo",this.config.nowMillis)}createPlayers(){return[{index:0,label:"Rojo",color:ea,score:0,lives:-1},{index:1,label:"Azul",color:ta,score:0,lives:-1}]}readWinningScore(){return Ve(this.config.options,Ba.pointsToWin)}resetGame(e){this.readyGate.reset(e),this.teamScore=[0,0],this.rounds=[],this.lastRoundHits=0,this.lastRoundWinner="",this.redPaddleX=Math.floor((M-Ji)/2),this.bluePaddleX=this.redPaddleX,this.phase="waiting",this.success=!1,this.scorer=-1,this.winner=-1,this.pointAtMillis=0,this.lastImpactAtMillis=0,this.lastImpact=null,this.motionEventId+=1,this.startedAtMillis=e,this.finishAtMillis=0,this.resetBall(),this.lastEvent=g("none","Esperando a rojo arriba y azul abajo",e)}updatePhase(e,i=this.readyGate.tick(e)){return this.phase==="finished"?e-this.finishAtMillis>=Th?(this.resetGame(e),[g("ready","Nueva partida",e)]):[]:i==="players-ready"?(this.phase="starting",this.motionEventId+=1,[g("start","Rojo y azul listos",e)]):i==="players-left"?(this.phase="waiting",this.motionEventId+=1,[g("ready","Vuelve a las zonas roja y azul",e)]):i==="started"?(this.phase="running",this.startedAtMillis=e,this.lastStepMillis=e,this.serve(),this.motionEventId+=1,[g("start","La pelota esta en juego",e)]):[]}movePaddle(e,i){let l=L(Math.round(e),Math.floor(Ji/2),M-1-Math.floor(Ji/2))-Math.floor(Ji/2);i<x/2?this.redPaddleX=l:this.bluePaddleX=l}moveBall(e){let i=this.ball.x+this.ball.dx,a=this.ball.y+this.ball.dy;if(i<0&&(i=0,this.ball.dx=1),i>=M&&(i=M-1,this.ball.dx=-1),this.ball.dy<0&&a===xu&&i>=this.redPaddleX&&i<this.redPaddleX+Ji)return this.reflectFromPaddle(i,this.redPaddleX),this.commitBall({...this.ball,x:i,y:xu+1,dy:1}),this.recordImpact(0,i,xu),this.accelerate(),g("coin","Rojo devuelve",e);if(this.ball.dy>0&&a===Su&&i>=this.bluePaddleX&&i<this.bluePaddleX+Ji)return this.reflectFromPaddle(i,this.bluePaddleX),this.commitBall({...this.ball,x:i,y:Su-1,dy:-1}),this.recordImpact(1,i,Su),this.accelerate(),g("coin","Azul devuelve",e);if(a<0)return this.scorePoint(1,e),g("score","Punto para azul",e);if(a>=x)return this.scorePoint(0,e),g("score","Punto para rojo",e);this.commitBall({...this.ball,x:i,y:a})}scorePoint(e,i){if(this.teamScore[e]+=1,this.scorer=e,this.pointAtMillis=i,this.motionEventId+=1,this.recordRound(e),this.teamScore[e]>=this.winningScore){this.phase="finished",this.success=e===1,this.winner=e,this.finishAtMillis=i;return}this.resetBall(),this.pauseUntilMillis=i+Mb,this.lastStepMillis=this.pauseUntilMillis}recordRound(e){this.lastRoundHits=this.hitCount,this.lastRoundWinner=this.labelForTeam(e),this.rounds=[...this.rounds,{index:this.rounds.length+1,winnerIndex:e,winnerLabel:this.lastRoundWinner,hits:this.lastRoundHits}]}resetBall(){this.ball={...this.ball,x:Ua,y:Wi},this.ballTrail=[],this.currentIntervalMillis=this.speed.initialMillis,this.hitCount=0,this.pauseUntilMillis=0,this.serve()}serve(){this.ball={x:Ua,y:Wi,dy:this.rng.int(2)===0?-1:1,dx:this.rng.int(2)===0?-1:1}}reflectFromPaddle(e,i){let a=i+Math.floor(Ji/2);e<a?this.ball.dx=-1:e>a?this.ball.dx=1:this.ball.dx=this.rng.int(2)===0?-1:1}accelerate(){this.hitCount+=1,this.currentIntervalMillis=Math.max(this.speed.minimumMillis,this.currentIntervalMillis/this.speed.hitMultiplier)}commitBall(e){this.ballTrail=[{x:this.ball.x,y:this.ball.y},...this.ballTrail.filter(i=>i.x!==this.ball.x||i.y!==this.ball.y)].slice(0,5),this.ball=e}recordImpact(e,i,a){this.lastImpact={team:e,x:i,y:a},this.lastImpactAtMillis=this.nowMillis,this.motionEventId+=1}drawWaiting(e){let i=this.halfReady(0,this.nowMillis),a=this.halfReady(1,this.nowMillis);this.drawWaitingHalf(e,0,i),this.drawWaitingHalf(e,1,a),i?this.drawSoftBar(e,3,5,10,ki):this.drawBreathingOutline(e,0,ki),a?this.drawSoftBar(e,3,24,10,Ki):this.drawBreathingOutline(e,1,Ki)}drawReady(e){let i=Xs(ut.start),a=Math.max(0,i-this.readyGate.state(this.nowMillis).countdownMillis),n=L(a/i,0,1)*(x*.7),s=.5+Math.sin(a/86)*.5;for(let r=0;r<x;r+=1)for(let o=0;o<M;o+=1){let u=Math.abs(o-Ua)+Math.abs(r-Wi),d=r>=x/2?Ki:ki,p=Math.abs(u-n),f=Math.max(0,1-p/3.2),y=7+(Math.sin(o*.82+r*.38-a/120)+1)*4;f>0?b(e,o,r,vi(d,28+f*74,f*24)):u<n&&b(e,o,r,$i(d,y+s*10))}this.drawCenterLine(e,18+s*20),this.drawBallGlow(e),b(e,Ua,Wi,gl)}drawScoreFlash(e){let i=this.scorer===1?Ki:ki,a=Math.max(0,this.nowMillis-this.pointAtMillis),l=L(a/Mb,0,1),n=this.scorer===0?x-1:0,s=l*(x+8);for(let r=0;r<x;r+=1)for(let o=0;o<M;o+=1){let u=Math.hypot((o-Ua)*1.35,r-n),d=Math.max(0,1-Math.abs(u-s)/3.4),p=Math.sin(o*12.13+r*7.71+a/38)>.9?1:0,f=1-l;d>0?b(e,o,r,vi(i,28+d*82,d*34)):p>0&&f>.18&&b(e,o,r,vi(i,22+f*44,f*12))}this.drawCenterLine(e,12+(1-l)*24),this.drawPaddles(e)}drawWin(e){let i=this.winner===1?Ki:ki,a=Math.max(0,this.nowMillis-this.finishAtMillis),l=a/92,n=.5+Math.sin(a/110)*.5;for(let r=0;r<x;r+=1)for(let o=0;o<M;o+=1){let d=((this.winner===0?x-1-r:r)+o*.72-l+x*4)%11,p=Math.sin(o*17.17+r*11.31+a/55);d<3.8?b(e,o,r,vi(i,38+(3.8-d)*15+n*12,12+n*18)):p>.91&&b(e,o,r,vi(i,48,32))}let s=64+n*26;z(e,Ua-1,Wi-1,3,3,$i(Nn,s)),b(e,Ua,Wi,gl)}drawArena(e){let i=this.nowMillis/185;for(let a=1;a<x-1;a+=1){let l=a<x/2?ki:Ki;for(let n=0;n<M;n+=1){let s=(Math.sin(n*.78+a*.31-i)+1)*.5,r=(n+a)%3===0?4:0;b(e,n,a,$i(l,4+s*7+r))}}this.drawCenterLine(e,18+(Math.sin(this.nowMillis/140)+1)*5)}drawCenterLine(e,i){for(let a=0;a<M;a+=1)(a+Math.floor(this.nowMillis/120))%3===0&&(b(e,a,Wi-1,vi(Nn,i,0)),b(e,a,Wi,vi(Nn,i*.72,0)))}drawBallTrail(e){this.ballTrail.forEach((i,a)=>{let l=Math.max(10,46-a*8);b(e,i.x,i.y,$i(Nn,l))})}drawBallGlow(e){let i=20+(Math.sin(this.nowMillis/70)+1)*7;for(let[a,l]of[[-1,0],[1,0],[0,-1],[0,1]])b(e,this.ball.x+a,this.ball.y+l,$i(Nn,i))}drawImpact(e){if(!this.lastImpact)return;let i=this.nowMillis-this.lastImpactAtMillis;if(i<0||i>=480)return;let a=i/480,l=1+a*5.5,n=this.lastImpact.team===0?ki:Ki;for(let s=Math.max(0,this.lastImpact.y-7);s<=Math.min(x-1,this.lastImpact.y+7);s+=1)for(let r=Math.max(0,this.lastImpact.x-7);r<=Math.min(M-1,this.lastImpact.x+7);r+=1){let o=Math.hypot(r-this.lastImpact.x,s-this.lastImpact.y),u=Math.max(0,1-Math.abs(o-l)/1.45);u>0&&b(e,r,s,vi(n,30+u*52,u*28*(1-a)))}}drawBreathingOutline(e,i,a){let l=(this.nowMillis/900+i*.5)%1,n=.5-Math.cos(l*Math.PI*2)*.5,s=Math.round(1+n*2),r=i===0?3+s:21-s,o=48+n*48;this.drawOutline(e,s,r,M-s*2,8,$i(a,o))}drawScore(e){for(let i=0;i<this.teamScore[0]&&i<M;i+=1)b(e,i,0,ea);for(let i=0;i<this.teamScore[1]&&i<M;i+=1)b(e,i,x-1,ta)}drawPaddles(e){this.drawPaddle(e,this.redPaddleX,xu,ki),this.drawPaddle(e,this.bluePaddleX,Su,Ki)}drawWaitingHalf(e,i,a){let l=i===1?x/2:0,n=i===1?Ki:ki,s=Math.floor(this.nowMillis/120)%10;for(let r=l;r<l+x/2;r+=1)for(let o=0;o<M;o+=1){let u=0;a?u=18+(o+r+s)%6*6:(o+r+s)%7===0&&(u=22),u>0&&b(e,o,r,$i(n,u))}}drawSoftBar(e,i,a,l,n){let s=Math.floor(this.nowMillis/100)%6;for(let r=0;r<l;r+=1){let o=r===s||r===l-1-s?112:58+r*4;b(e,i+r,a,$i(n,o)),b(e,i+r,a+1,vi(n,o-8,10)),b(e,i+r,a+2,$i(n,Math.max(18,o-28)))}}drawPaddle(e,i,a,l){for(let n=0;n<Ji;n+=1){let s=n===Math.floor(Ji/2)?118:74;b(e,i+n,a,vi(l,s,18))}}drawOutline(e,i,a,l,n,s){let r=Math.max(2,Math.round(l)),o=Math.max(2,Math.round(n));z(e,i,a,r,1,s),z(e,i,a+o-1,r,1,s),z(e,i,a,1,o,s),z(e,i+r-1,a,1,o,s)}halfReady(e,i){return this.readyGate.zoneReady(e,i)}activeHalves(e){return this.readyGate.state(e).readyPlayers}labelForTeam(e){return this.players[e]?.label||(e===0?"Rojo":"Azul")}recordEvents(e){let i=e.at(-1);return i&&(this.lastEvent=i),e}};function xb(t){let e=Ve(t.options,Ba.initialBallSpeed),i=Ve(t.options,Ba.returnSpeedMultiplier),l=Ve(t.options,Ba.difficultyMultiplier)**VE(t.difficulty),n=e*l,s=1+(i-1)*l,r=n*jE;return{difficultyFactor:l,hitMultiplier:s,initialTilesPerSecond:n,initialMillis:1e3/n,minimumMillis:1e3/r}}function VE(t){switch(t){case"medium":return 1;case"hard":return 2;case"expert":return 3;default:return 0}}function $i(t,e){return oi(st(t,e))}function vi(t,e,i){return oi(cl(st(t,e),st(Nn,i)))}var Eb=(()=>{let t=k("#05070a");return z(t,5,2,5,1,ea),z(t,6,29,5,1,ta),b(t,8,16,gl),t})(),Rh={currentGame:ut.id,label:ut.label,phase:"waiting",playerCount:2,players:[{index:0,label:"Rojo",color:ea,score:0,lives:-1},{index:1,label:"Azul",color:ta,score:0,lives:-1}],score:0,lives:-1,elapsedMillis:0,remainingMillis:0,activeTargets:0,success:!1,lastEventCue:"ready",lastEventMessage:"Ping Pong espera rojo y azul",countdownMillis:0,readyPlayers:0,requiredPlayers:2,matchTarget:5,roundHits:0,lastRoundHits:0,lastRoundWinner:"",rounds:[],ball:{x:8,y:16,dx:1,dy:1},ballTrail:[],rallyPace:0,pointScorer:-1,pointFlashMillis:0,winnerIndex:-1,impact:null,motionEventId:1,initialBallSpeed:6.9,ballSpeed:6.9,returnSpeedMultiplier:1.042,difficultySpeedFactor:1.2},Ah={...Rh,phase:"running",readyPlayers:2,elapsedMillis:8200,activeTargets:2,lastEventCue:"coin",lastEventMessage:"Azul devuelve",roundHits:3,ball:{x:11,y:21,dx:1,dy:1},ballTrail:[{x:10,y:20},{x:9,y:19},{x:8,y:18}],rallyPace:.1935,ballSpeed:7.8064,impact:{team:1,x:10,y:29,remainingMillis:180},motionEventId:4},Gb={...Ah,phase:"finished",score:5,remainingMillis:2400,success:!0,lastEventCue:"score",lastEventMessage:"Punto para azul",players:[{index:0,label:"Rojo",color:ea,score:2,lives:-1},{index:1,label:"Azul",color:ta,score:3,lives:-1}],lastRoundHits:2,lastRoundWinner:"Azul",pointScorer:1,winnerIndex:1,motionEventId:8,rounds:[{index:1,winnerIndex:0,winnerLabel:"Rojo",hits:1},{index:2,winnerIndex:1,winnerLabel:"Azul",hits:2}]};var Nh={};Qe(Nh,{PlayerDisplay:()=>Cb,createGame:()=>Gu,finishedFrame:()=>Db,finishedSnapshot:()=>Ob,initEvents:()=>Rb,manifest:()=>Xt,runningFrame:()=>_b,runningSnapshot:()=>Nb,saltosCelebrationMillis:()=>Eu,saltosStartingLives:()=>lr,startingSnapshot:()=>Pb,waitingFrame:()=>Ab,waitingSnapshot:()=>zb});var Tt=Y(q(),1);function Cb({snapshot:t,frame:e}){return(0,Tt.jsx)(ie,{title:t.label,phase:t.phase,children:(0,Tt.jsxs)("div",{className:"ml-solo-display",children:[(0,Tt.jsx)(Ae,{snapshot:t}),(0,Tt.jsxs)("div",{className:"ml-solo-summary",children:[(0,Tt.jsxs)(ye,{columns:3,className:"ml-solo-number-row",children:[(0,Tt.jsx)(A,{label:"Saltos",tone:"green",value:t.score}),(0,Tt.jsx)(A,{label:"Tiempo",tone:"cyan",value:J(t.remainingMillis)}),(0,Tt.jsx)(A,{label:"Vida",tone:"red",value:(0,Tt.jsx)(nt,{lives:t.lives,maxLives:t.maxLives})})]}),(0,Tt.jsx)(A,{className:"ml-solo-message",label:"Objetivo",tone:t.success?"green":"yellow",value:t.lastEventMessage||"Salta del azul al verde"})]}),e?(0,Tt.jsx)(Oe,{className:"ml-solo-floor",frame:e,label:"Juego en el suelo"}):null]})})}var Xt={id:"saltos",label:"Saltos",description:"Salta entre plataformas seguras sin tocar la lava durante un minuto.",availability:{development:!0,production:!0},catalog:{category:"individual",color:"#ff9f45",durationLabel:"60s",modeLabel:"Saltos",audioLabel:"M\xFAsica + efectos",rules:["Espera en la plataforma azul","Salta a la plataforma verde","No pises la lava"]},players:{allowAny:!0,min:1,max:1},start:{mode:"player-ready"},defaultDurationMillis:6e4,config:{difficulty:{options:["easy","medium","hard"],default:"medium"}},display:{entry:"./display"},preview:{seed:137,playerCount:0,actions:[{atMillis:100,type:"press",x:8,y:4}],captureStartMillis:2300,frameCount:24,frameIntervalMillis:120},tags:["saltos","lava","typescript"]};var Eu=5e3,lr=1,Ph={x:7,y:3},Ya=3;function Gu(t){return new _h(t)}var _h=class{config;current=Ph;finishedAtMillis;lastEvent=g("none","Listo",0);lives=lr;nowMillis=0;phase="ready";players;readyGate;rng;score=0;startedAtMillis=0;target=Ph;constructor(e){this.config=D(e,Xt),this.readyGate=K(Xt.start,[{minX:5,maxX:10,minY:0,maxY:7}],this.config.nowMillis),this.rng=V(this.config.seed),this.players=this.scoredPlayers(),this.target=this.nextTarget(this.current)}init(e){return this.resetState(e),[this.lastEvent]}press(e){return this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update(e),e.atMillis):this.phase!=="running"||!e.pressed?[]:Tb(e,this.current)?[]:Tb(e,this.target)?(this.current=this.target,this.score+=1,this.players=this.scoredPlayers(),this.target=this.nextTarget(this.current),this.lastEvent=g("coin",`Salto ${this.score}`,e.atMillis),[this.lastEvent]):(this.lives=0,this.finish(!1,"Has pisado lava",e.atMillis))}release(e){return this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update({...e,pressed:!1}),e.atMillis):[]}tick(e){return this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.tick(e.atMillis),e.atMillis):this.phase==="finished"?e.atMillis-(this.finishedAtMillis??e.atMillis)>=Eu?(this.resetState(e.atMillis),[this.lastEvent]):[]:this.phase==="running"&&this.remainingMillis()===0?this.finish(!0,`${this.score} saltos completados`,e.atMillis):[]}render(){let e=k("#170408");if(this.phase==="waiting"||this.phase==="starting"){let i=Math.floor(this.nowMillis/(this.phase==="starting"?100:180));return Ue(e,{centerX:8,centerY:4,radius:2+i%5,color:this.phase==="starting"?"#ffe176":"#1677ff"}),e}return this.paintLava(e),z(e,this.current.x,this.current.y,Ya,Ya,"#1677ff"),this.phase==="running"?(z(e,this.target.x,this.target.y,Ya,Ya,"#38e86b"),b(e,this.target.x+1,this.target.y+1,"#ffffff")):Ge(e,{color:this.lives>0?"#38e86b":"#ff263d",step:Math.floor((this.nowMillis-(this.finishedAtMillis??this.nowMillis))/140)}),e}snapshot(){let e=this.readyGate.state(this.nowMillis);return{currentGame:Xt.id,label:Xt.label,phase:this.phase,playerCount:this.config.playerCount,players:this.players,score:this.score,lives:this.lives,maxLives:lr,elapsedMillis:this.elapsedMillis(),remainingMillis:this.remainingMillis(),activeTargets:this.phase==="running"?1:0,success:this.phase==="finished"&&this.lives>0,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?e.countdownMillis:0,readyPlayers:e.readyPlayers,requiredPlayers:e.requiredPlayers,currentPlatform:{...this.current},targetPlatform:this.phase==="running"?{...this.target}:void 0,celebrationMillis:this.phase==="finished"?Math.max(0,Eu-(this.nowMillis-(this.finishedAtMillis??this.nowMillis))):0}}reset(e={}){this.config=D({...this.config,...e},Xt),this.resetState(this.config.nowMillis)}applyReadyTransition(e,i){if(e==="players-ready")this.phase="starting",this.lastEvent=g("ready","Jugador listo",i);else if(e==="players-left")this.phase="waiting",this.lastEvent=g("ready","Vuelve a la plataforma azul",i);else if(e==="started")this.phase="running",this.startedAtMillis=i,this.lastEvent=g("start","Salta del azul al verde",i);else return[];return[this.lastEvent]}elapsedMillis(){if(this.phase==="waiting"||this.phase==="starting")return 0;let e=this.finishedAtMillis??this.nowMillis;return Math.max(0,e-this.startedAtMillis)}finish(e,i,a){return this.phase="finished",this.finishedAtMillis=a,this.lastEvent=g(e?"win":"damage",i,a),[this.lastEvent]}nextTarget(e){for(let i=0;i<20;i+=1){let a={x:this.rng.range(0,M-Ya),y:this.rng.range(0,x-Ya)};if(Math.abs(a.x-e.x)+Math.abs(a.y-e.y)>=7)return a}return{x:e.x<8?12:1,y:e.y<16?25:3}}paintLava(e){let i=Math.floor(this.nowMillis/180);for(let a=0;a<x;a+=1)for(let l=0;l<M;l+=1)b(e,l,a,(l*3+a+i)%11<2?"#ff5a1f":"#b20d21")}resetState(e){this.readyGate.reset(e),this.rng=V(this.config.seed),this.current={...Ph},this.target=this.nextTarget(this.current),this.finishedAtMillis=void 0,this.lastEvent=g("ready","Espera en la plataforma azul",e),this.lives=lr,this.nowMillis=e,this.phase="waiting",this.score=0,this.startedAtMillis=e,this.players=this.scoredPlayers()}remainingMillis(){return Math.max(0,this.config.durationMillis-this.elapsedMillis())}scoredPlayers(){return ve(this.config.playerCount,this.config.players).map(e=>({...e,score:this.score,lives:this.lives}))}};function Tb(t,e){return t.x>=e.x&&t.x<e.x+Ya&&t.y>=e.y&&t.y<e.y+Ya}var wt=Gu({playerCount:0,durationMillis:Xt.defaultDurationMillis,seed:137}),Rb=wt.init(0),Ab=wt.render(),zb=wt.snapshot();wt.press({x:8,y:4,pressed:!0,atMillis:100});var Pb=wt.snapshot();wt.tick({atMillis:2100});var _b=wt.render(),Nb=wt.snapshot(),wb=wt.snapshot().targetPlatform;wb&&wt.press({...wb,pressed:!0,atMillis:2200});wt.tick({atMillis:62100});var Db=wt.render(),Ob=wt.snapshot();var Yh={};Qe(Yh,{PlayerDisplay:()=>Hb,blueColor:()=>sr,blueFieldColor:()=>or,blueFieldFirstRow:()=>On,centerLineColor:()=>ur,createGame:()=>Fa,finishedFrame:()=>Ib,finishedSnapshot:()=>Qb,gameWinAnimationMillis:()=>Dn,initEvents:()=>Bb,knotColor:()=>vl,manifest:()=>Kt,onBlueTilePressed:()=>aa,onRedTilePressed:()=>Ml,redColor:()=>nr,redFieldColor:()=>rr,redFieldLastRow:()=>fr,ropeColor:()=>Oh,ropeLimit:()=>ia,roundTransitionMillis:()=>Lb,roundWinAnimationMillis:()=>Hn,roundWinFrame:()=>Vb,roundWinSnapshot:()=>Zb,roundsToWin:()=>Hh,runningFrame:()=>qb,runningSnapshot:()=>jb,startingFrame:()=>Fb,startingSnapshot:()=>Xb,teamForTile:()=>dr,teamLabel:()=>bl,tiraSogaReadyZones:()=>Cu,totalRounds:()=>cr,waitingFrame:()=>Ub,waitingSnapshot:()=>Yb});var oe=Y(q(),1),ZE=`
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
`;function Hb({snapshot:t}){let[e,i]=t.players,a=e??{label:"Rojo",score:0,color:"#ff1c28"},l=i??{label:"Azul",score:0,color:"#145cff"},n=t.currentRound??1,s=t.totalRounds??5,r=t.pressesPerAdvance??1,o=t.ropePosition??0,u=t.ropeLimit??6,d=t.rounds??[],p=50+o/Math.max(u,1)*43,f=t.winnerIndex===0?"Rojo":"Azul",y=t.roundWinnerIndex===0?"Rojo":"Azul",G=t.phase!=="finished"&&t.roundWinnerIndex!==-1,C=t.phase==="waiting"||t.phase==="starting",O=t.phase==="waiting"?"Listos":t.phase==="starting"?"Empieza en":"Ronda",h=t.phase==="waiting"?`${t.readyPlayers??0}/${t.requiredPlayers??2}`:t.phase==="starting"?J(t.countdownMillis??0):`${n}/${s}`,c=C?t.phase==="waiting"?"en posici\xF3n":"preparados":`${t.difficultyLabel??"Medio"} \xB7 ${r} ${r===1?"pisada":"pisadas"} por avance`,m=t.phase==="finished"?`Victoria ${f}`:G?`Ronda para ${y.toLowerCase()}`:o===0?"\xA1Pisad vuestro campo para tirar!":o<0?"Rojo toma ventaja":"Azul toma ventaja";return(0,oe.jsx)(ie,{title:t.label,phase:t.phase,variant:"versus",children:(0,oe.jsxs)("div",{className:`tira-soga-display is-phase-${t.phase}`,style:{"--tira-soga-rope-x":`${p}%`},children:[(0,oe.jsx)("style",{children:ZE}),(0,oe.jsx)(Ae,{snapshot:t}),(0,oe.jsx)(pn,{className:"tira-soga-scoreboard",left:a,right:l,target:t.matchTarget??3,centerLabel:O,centerValue:h,centerCaption:c}),(0,oe.jsxs)("section",{className:"tira-soga-arena","aria-label":`Posici\xF3n de la soga: ${o}`,children:[(0,oe.jsx)("span",{className:"tira-soga-team is-red",children:"Rojo"}),(0,oe.jsxs)("div",{className:"tira-soga-track","aria-hidden":"true",children:[(0,oe.jsx)("i",{className:"tira-soga-rope"}),(0,oe.jsx)("i",{className:"tira-soga-center"}),(0,oe.jsx)("i",{className:"tira-soga-knot"})]}),(0,oe.jsx)("span",{className:"tira-soga-team is-blue",children:"Azul"}),(0,oe.jsx)("strong",{className:"tira-soga-caption",children:m}),t.phase==="finished"?(0,oe.jsxs)("div",{className:"tira-soga-result is-game-win",children:[(0,oe.jsxs)("strong",{children:["\xA1Gana ",f,"!"]}),(0,oe.jsxs)("span",{children:["Resultado final ",a.score," \u2013 ",l.score]})]}):G?(0,oe.jsxs)("div",{className:"tira-soga-result is-round-win",children:[(0,oe.jsxs)("strong",{children:["Ronda para ",y]}),(0,oe.jsx)("span",{children:"Siguiente ronda en breve"})]}):null]}),(0,oe.jsxs)(ye,{columns:4,className:"tira-soga-metrics",children:[(0,oe.jsx)(A,{label:"Pisadas rojas",tone:"red",value:t.redPresses??0}),(0,oe.jsx)(A,{label:"Avance rojo",tone:"amber",value:`${t.redProgress??0}/${r}`}),(0,oe.jsx)(A,{label:"Avance azul",tone:"cyan",value:`${t.blueProgress??0}/${r}`}),(0,oe.jsx)(A,{label:"Pisadas azules",tone:"blue",value:t.bluePresses??0})]}),(0,oe.jsx)(yn,{className:"tira-soga-rounds",activeCaption:"Soga en juego",activeLabel:"En juego",activeRound:t.phase==="finished"?null:n,rounds:d,totalRounds:s})]})})}var Kt={id:"tira-soga",label:"Tira-Soga",description:"Five-round team tug of war driven by rapid presses on the red and blue floor halves.",availability:{development:!0,production:!1},catalog:{category:"versus",color:"#ff9f1c",durationLabel:"Sin l\xEDmite",modeLabel:"Tira y afloja",audioLabel:"Efectos",rules:["Rojo ocupa la mitad superior y azul la inferior","Pisa r\xE1pidamente tu campo para arrastrar la soga","Gana tres de las cinco rondas"]},players:{allowAny:!0,min:2,max:2},start:{mode:"player-ready",countdownMillis:3e3,releaseGraceMillis:2e3},config:{difficulty:{default:"medium",options:["easy","medium","hard"]}},defaultDurationMillis:0,display:{entry:"./display"},preview:{seed:137,playerCount:2,difficulty:"medium",actions:[{atMillis:100,type:"press",x:4,y:8},{atMillis:100,type:"press",x:11,y:24}],captureStartMillis:3200,frameCount:18,frameIntervalMillis:120},tags:["competitive","teams","two-player","typescript"]};var nr="#ff1c28",sr="#145cff",rr="#720c17",or="#0b3189",ur="#ff9f1c",Oh="#f4c56a",vl="#fff7d6",cr=5,Hh=3,ia=6,Hn=1800,Dn=5e3,Lb=Hn,fr=14,On=17,IE={easy:1,medium:2,hard:3},QE={easy:"F\xE1cil",medium:"Medio",hard:"Dif\xEDcil"};function Fa(t){return new Dh(t)}function Cu(){return[{minX:0,maxX:M-1,minY:0,maxY:fr},{minX:0,maxX:M-1,minY:On,maxY:x-1}]}var Dh=class{config;phase="waiting";startedAtMillis=0;nowMillis=0;ropePosition=0;teamScore=[0,0];teamPresses=[0,0];teamProgress=[0,0];rounds=[];roundWinnerIndex=-1;winnerIndex=-1;roundWonAtMillis=0;roundPauseUntilMillis=0;finishAtMillis=0;motionEventId=0;readyZones=Cu();readyGate;heldTiles=Array.from({length:M*x},()=>!1);flashUntil=Array.from({length:M*x},()=>0);lastEvent=g("none","Listos para tirar",0);constructor(e){this.config=D(e,Kt),this.readyGate=K(Kt.start,this.readyZones,this.config.nowMillis),this.resetMatch(this.config.nowMillis)}init(e){return this.resetMatch(e),this.lastEvent=g("ready","Tira-Soga espera a rojo y azul",e),[this.lastEvent]}press(e){this.nowMillis=e.atMillis;let i=this.readyGate.update(e);if(this.phase==="waiting"||this.phase==="starting")return this.recordEvents(this.applyReadyTransition(i,e.atMillis));if(!e.pressed||this.phase!=="running"||this.roundWinnerIndex!==-1)return[];let a=this.tileIndex(e.x,e.y),l=dr(e.x,e.y);if(a===-1||l===-1||this.heldTiles[a])return[];this.heldTiles[a]=!0,this.flashUntil[a]=e.atMillis+220,this.teamPresses[l]+=1,this.teamProgress[l]+=1;let n=this.pressesPerAdvance();return this.teamProgress[l]<n?this.recordEvents([g("hit",`${bl(l)} suma ${this.teamProgress[l]} de ${n}`,e.atMillis)]):(this.teamProgress[l]=0,this.ropePosition+=l===0?-1:1,Math.abs(this.ropePosition)>=ia?this.recordEvents([this.finishRound(l,e.atMillis)]):this.recordEvents([g("hit",`${bl(l)} tira de la soga`,e.atMillis)]))}release(e){this.nowMillis=e.atMillis;let i=this.tileIndex(e.x,e.y);i!==-1&&(this.heldTiles[i]=!1);let a=this.readyGate.update({...e,pressed:!1});return this.phase==="waiting"||this.phase==="starting"?this.recordEvents(this.applyReadyTransition(a,e.atMillis)):[]}tick(e){this.nowMillis=e.atMillis;let i=this.updateLifecycle(e.atMillis,this.readyGate.tick(e.atMillis));return this.phase==="running"&&this.roundWinnerIndex!==-1&&e.atMillis>=this.roundPauseUntilMillis&&(this.startNextRound(),i.push(g("start",`Ronda ${this.currentRound()}: \xA1a tirar!`,e.atMillis))),this.recordEvents(i)}render(){let e=k("#05070a");return this.phase==="waiting"?(this.drawWaiting(e),e):this.phase==="starting"?(this.drawStarting(e),e):this.phase==="finished"?(this.drawGameWin(e),e):(this.drawArena(e),this.roundWinnerIndex!==-1&&this.drawRoundWin(e),e)}snapshot(){let e=this.readyGate.state(this.nowMillis),i=this.scoredPlayers(),a=Math.max(0,this.roundPauseUntilMillis-this.nowMillis),l=this.phase==="finished"?Math.max(0,this.finishAtMillis+Dn-this.nowMillis):0;return{currentGame:Kt.id,label:Kt.label,phase:this.phase,playerCount:this.config.playerCount,players:i,score:Math.max(...this.teamScore),lives:-1,elapsedMillis:this.phase==="waiting"||this.phase==="starting"?0:Math.max(0,(this.phase==="finished"?this.finishAtMillis:this.nowMillis)-this.startedAtMillis),remainingMillis:l||a,activeTargets:this.phase==="running"&&this.roundWinnerIndex===-1?2:0,success:this.phase==="finished",lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?e.countdownMillis:0,readyPlayers:e.readyPlayers,requiredPlayers:e.requiredPlayers,matchTarget:Hh,roundHits:this.teamPresses[0]+this.teamPresses[1],lastRoundHits:this.rounds.at(-1)?.hits??0,lastRoundWinner:this.rounds.at(-1)?.winnerLabel??"",difficulty:this.config.difficulty,difficultyLabel:QE[this.config.difficulty]??"Medio",pressesPerAdvance:this.pressesPerAdvance(),ropePosition:this.ropePosition,ropeLimit:ia,redPresses:this.teamPresses[0],bluePresses:this.teamPresses[1],redProgress:this.teamProgress[0],blueProgress:this.teamProgress[1],currentRound:this.currentRound(),totalRounds:cr,rounds:this.rounds.map(n=>({...n})),roundWinnerIndex:this.roundWinnerIndex,roundTransitionMillis:a,winnerIndex:this.winnerIndex,motionEventId:this.motionEventId}}reset(e={}){this.config=D({...this.config,...e,options:{...this.config.options,...e.options}},Kt),this.readyZones=Cu(),this.readyGate=K(Kt.start,this.readyZones,this.config.nowMillis),this.resetMatch(this.config.nowMillis),this.lastEvent=g("ready","Tira-Soga espera a rojo y azul",this.config.nowMillis)}playerReadyZones(){return this.readyZones.map(e=>({...e}))}updateLifecycle(e,i){return this.phase==="finished"?e-this.finishAtMillis>=Dn?(this.resetMatch(e),[g("ready","Nueva partida",e)]):[]:this.applyReadyTransition(i,e)}applyReadyTransition(e,i){return e==="players-ready"?(this.phase="starting",this.motionEventId+=1,[g("start","Rojo y azul listos",i)]):e==="players-left"?(this.phase="waiting",this.motionEventId+=1,[g("ready","Vuelve a tu campo iluminado",i)]):e==="started"?(this.phase="running",this.startedAtMillis=i,this.motionEventId+=1,[g("start","Ronda 1: \xA1a tirar!",i)]):[]}finishRound(e,i){let a=this.currentRound(),l=this.teamPresses[0]+this.teamPresses[1];return this.teamScore[e]+=1,this.roundWinnerIndex=e,this.roundWonAtMillis=i,this.rounds.push({index:a,winnerIndex:e,winnerLabel:bl(e),hits:l}),this.motionEventId+=1,this.rounds.length>=cr?(this.phase="finished",this.finishAtMillis=i,this.winnerIndex=this.teamScore[0]>this.teamScore[1]?0:1,g("win",`${bl(this.winnerIndex)} gana Tira-Soga`,i)):(this.roundPauseUntilMillis=i+Hn,g("hit",`Ronda ${a} para ${bl(e).toLowerCase()}`,i))}startNextRound(){this.ropePosition=0,this.teamPresses=[0,0],this.teamProgress=[0,0],this.roundWinnerIndex=-1,this.roundWonAtMillis=0,this.roundPauseUntilMillis=0,this.heldTiles.fill(!1),this.flashUntil.fill(0),this.motionEventId+=1}resetMatch(e){this.readyGate.reset(e),this.phase="waiting",this.startedAtMillis=e,this.nowMillis=e,this.ropePosition=0,this.teamScore=[0,0],this.teamPresses=[0,0],this.teamProgress=[0,0],this.rounds=[],this.roundWinnerIndex=-1,this.winnerIndex=-1,this.roundWonAtMillis=0,this.roundPauseUntilMillis=0,this.finishAtMillis=0,this.heldTiles.fill(!1),this.flashUntil.fill(0),this.motionEventId=0,this.motionEventId+=1}currentRound(){return Math.min(cr,this.rounds.length+(this.roundWinnerIndex===-1?1:0))}pressesPerAdvance(){return IE[this.config.difficulty]??2}ropeTileY(e=this.ropePosition){let i=(e+ia)/(ia*2);return Math.round(i*(x-1))}scoredPlayers(){return[{index:0,label:"Rojo",color:nr,score:this.teamScore[0],lives:-1},{index:1,label:"Azul",color:sr,score:this.teamScore[1],lives:-1}]}tileIndex(e,i){return!Number.isInteger(e)||!Number.isInteger(i)||!ri(e,i)?-1:i*M+e}recordEvents(e){let i=e.at(-1);return i&&(this.lastEvent=i),e}drawWaiting(e){this.drawBaseFields(e,"#410912","#071f5a");let i=Math.floor(this.nowMillis/180);for(let a=0;a<x;a+=1){let l=dr(0,a);l===-1||(a+i)%5!==0||z(e,0,a,M,1,l===0?rr:or)}this.drawRope(e,0)}drawStarting(e){this.drawBaseFields(e,rr,or),Ge(e,{bandWidth:2,period:7,step:Math.floor(this.nowMillis/90),color:({y:i})=>i<x/2?"#ff7b84":"#79a0ff"}),this.drawRope(e,0)}drawArena(e){let i=this.roundWinnerIndex;this.drawBaseFields(e,i===0?nr:rr,i===1?sr:or),this.drawRope(e,this.ropePosition);for(let a=0;a<this.flashUntil.length;a+=1){if((this.flashUntil[a]??0)<=this.nowMillis)continue;let l=a%M,n=Math.floor(a/M),s=dr(l,n);s!==-1&&b(e,l,n,s===0?"#ff8a92":"#73a0ff")}}drawRoundWin(e){let i=this.roundWinnerIndex;if(i===-1)return;let a=Math.max(0,this.nowMillis-this.roundWonAtMillis),l=i===0?0:x-1;Ue(e,{centerX:(M-1)/2,centerY:l,color:vl,radius:a/80%24,thickness:1.4}),Ue(e,{centerX:(M-1)/2,centerY:l,color:ur,radius:(a/80+7)%24,thickness:1})}drawGameWin(e){let i=this.winnerIndex===0?nr:sr;z(e,0,0,M,x,i);let a=Math.max(0,this.nowMillis-this.finishAtMillis);Ge(e,{bandWidth:2,period:9,step:Math.floor(a/80),color:ur});for(let l=0;l<x;l+=1)for(let n=0;n<M;n+=1)(n*17+l*11+Math.floor(a/120))%37===0&&b(e,n,l,vl)}drawBaseFields(e,i,a){z(e,0,0,M,fr+1,i),z(e,0,On,M,x-On,a),z(e,0,15,M,2,ur)}drawRope(e,i){z(e,7,0,2,x,Oh);let a=this.ropeTileY(i);z(e,5,a,6,1,vl),a>0&&z(e,7,a-1,2,1,vl),a<x-1&&z(e,7,a+1,2,1,vl)}};function dr(t,e){return!Number.isInteger(t)||!Number.isInteger(e)||!ri(t,e)?-1:e<=fr?0:e>=On?1:-1}function bl(t){return t===0?"Rojo":"Azul"}function Ml(t,e,i=4,a=8){let l=t.press({x:i,y:a,pressed:!0,atMillis:e});return t.release({x:i,y:a,pressed:!1,atMillis:e+1}),l}function aa(t,e,i=11,a=24){let l=t.press({x:i,y:a,pressed:!0,atMillis:e});return t.release({x:i,y:a,pressed:!1,atMillis:e+1}),l}var Bh=Fa({playerCount:2,difficulty:"medium"}),Bb=Bh.init(0),Ub=Bh.render(),Yb=Bh.snapshot(),hr=Fa({playerCount:2,difficulty:"hard"});hr.init(0);kb(hr,100);hr.tick({atMillis:1100});var Fb=hr.render(),Xb=hr.snapshot(),Jt=Fa({playerCount:2,difficulty:"medium"});Jt.init(0);Uh(Jt);Ml(Jt,3200);Ml(Jt,3300);aa(Jt,3400);aa(Jt,3500);aa(Jt,3600);aa(Jt,3700);aa(Jt,3800);var qb=Jt.render(),jb=Jt.snapshot(),Bn=Fa({playerCount:2,difficulty:"easy"});Bn.init(0);Uh(Bn);var Lh=3200;for(let t=0;t<ia;t+=1)Ml(Bn,Lh),Lh+=30;Bn.tick({atMillis:Lh+500});var Vb=Bn.render(),Zb=Bn.snapshot(),Un=Fa({playerCount:2,difficulty:"easy"});Un.init(0);Uh(Un);var Ln=3200;function kE(t,e){for(let i=0;i<ia;i+=1)e===0?Ml(t,Ln):aa(t,Ln),Ln+=30;t.snapshot().phase!=="finished"&&(Ln+=Hn,t.tick({atMillis:Ln}))}for(let t of[0,1,0,1,0])kE(Un,t);Un.tick({atMillis:Ln+Math.floor(Dn/3)});var Ib=Un.render(),Qb=Un.snapshot();function kb(t,e){for(let i of t.playerReadyZones())t.press({x:i.minX+2,y:i.minY+2,pressed:!0,atMillis:e})}function Uh(t){kb(t,100),t.tick({atMillis:3100});for(let e of t.playerReadyZones())t.release({x:e.minX+2,y:e.minY+2,pressed:!1,atMillis:3101})}var Vh={};Qe(Vh,{PlayerDisplay:()=>Jb,createGame:()=>wu,manifest:()=>bi,runningFrame:()=>rM,runningSnapshot:()=>oM,startingFrame:()=>nM,startingSnapshot:()=>sM,tetrisConfigVars:()=>mr,waitingFrame:()=>iM,waitingSnapshot:()=>aM});var $=Y(q(),1);function Jb({snapshot:t,frame:e}){let i=JE(t);return(0,$.jsx)(ie,{title:t.label,phase:t.phase,children:(0,$.jsxs)("div",{className:`tetris-display is-${t.result}`,children:[(0,$.jsx)(Ae,{snapshot:t}),(0,$.jsxs)("section",{className:"tetris-summary",children:[(0,$.jsxs)("div",{className:"tetris-callout",children:[(0,$.jsx)("span",{children:i.eyebrow}),(0,$.jsx)("strong",{children:i.title}),(0,$.jsx)("b",{children:i.caption})]}),(0,$.jsxs)(ye,{columns:4,className:"tetris-metrics",children:[(0,$.jsx)(A,{label:"Puntos",tone:"cyan",value:t.score}),(0,$.jsx)(A,{label:"L\xEDneas",tone:"yellow",value:`${t.lines}/${t.linesTarget}`}),(0,$.jsx)(A,{label:"Nivel",tone:"magenta",value:t.level}),(0,$.jsx)(A,{label:"Tiempo",tone:"amber",value:J(t.elapsedMillis)})]})]}),(0,$.jsxs)("section",{className:"tetris-main",children:[e?(0,$.jsx)(Oe,{className:"tetris-floor",frame:e,label:"Pista de Tetris"}):null,(0,$.jsxs)("aside",{className:"tetris-side",children:[(0,$.jsx)(Kb,{label:"Pieza activa",piece:t.activePiece}),(0,$.jsx)(Kb,{label:"Siguiente",piece:t.nextPiece}),(0,$.jsxs)("article",{className:"tetris-controls",children:[(0,$.jsx)("span",{children:"Control f\xEDsico"}),(0,$.jsx)("strong",{children:"\u2190 Rotar \xB7 Guiar \xB7 Rotar \u2192"}),(0,$.jsx)("b",{children:"Baja al fondo para soltar"})]})]})]}),(0,$.jsxs)("footer",{className:"tetris-event",children:[(0,$.jsx)("span",{children:t.result==="line-clear"?"\xA1L\xEDnea!":"\xDAltimo evento"}),(0,$.jsx)("strong",{children:t.lastEventMessage},t.motionEventId),(0,$.jsx)("b",{children:WE(t)})]})]})})}function Kb({label:t,piece:e}){return(0,$.jsxs)("article",{className:"tetris-piece-card",style:{"--tetris-piece":e.color},children:[(0,$.jsx)("span",{children:t}),(0,$.jsx)("div",{children:e.cells.map(([i,a],l)=>(0,$.jsx)("i",{style:{gridColumn:i+1,gridRow:a+1}},l))}),(0,$.jsx)("strong",{children:KE[e.shape]??"Pieza"})]})}var KE=["I","O","T","S","Z","J","L"];function JE(t){return t.result==="game-win"?{eyebrow:"Objetivo completado",title:"\xA1Tetris superado!",caption:`${t.lines} l\xEDneas y ${t.score} puntos`}:t.result==="game-loss"?{eyebrow:"Fin de partida",title:"Las piezas llegaron arriba",caption:"La pista se reinicia en unos segundos"}:t.result==="line-clear"?{eyebrow:"L\xEDnea eliminada",title:`+${t.lastClearCount===4?800:t.lastClearCount*100}`,caption:"La pista baja y el nivel contin\xFAa"}:{eyebrow:`Nivel ${t.level}`,title:"Gu\xEDa la pieza",caption:"Usa todo el suelo para mover, rotar y soltar"}}function WE(t){return t.phase==="finished"?`${t.lines} ${t.lines===1?"l\xEDnea total":"l\xEDneas totales"}`:t.lastClearCount>0?`${t.lastClearCount} ${t.lastClearCount===1?"l\xEDnea":"l\xEDneas"}`:`Objetivo ${t.linesTarget}`}var mr={linesToWin:{key:"lines_to_win",label:"L\xEDneas para ganar",playerFacing:!0,description:"L\xEDneas que hay que eliminar para activar la celebraci\xF3n final.",type:"int",default:10,min:1,max:40,step:1}},bi={id:"tetris",label:"Tetris",description:"Gu\xEDa, rota y deja caer piezas f\xEDsicas en una pista cl\xE1sica de diez columnas.",availability:{development:!0,production:!0},catalog:{category:"arcade",color:"#36d9ff",durationLabel:"Sin l\xEDmite",modeLabel:"Tetris cl\xE1sico",audioLabel:"M\xFAsica + efectos",rules:["Pisa una columna para guiar la pieza","Pisa las diagonales junto a tu gu\xEDa para rotar","Baja hasta el fondo para soltar la pieza y completa l\xEDneas"]},players:{allowAny:!0,min:1,max:4},start:{mode:"player-ready",releaseGraceMillis:1500},config:{difficulty:{default:"medium",options:["easy","medium","hard"]},vars:Object.values(mr)},defaultDurationMillis:0,display:{entry:"./display"},preview:{seed:137,playerCount:1,difficulty:"medium",options:{lines_to_win:10},actions:[{atMillis:100,type:"press",x:8,y:29}],captureStartMillis:2200,frameCount:18,frameIntervalMillis:120},tags:["arcade","puzzle","classic","typescript"]};var _e=3,Rt=10,Wb=4e3,$E=180,eG=["#36d9ff","#ffd166","#ff52c8","#34c759","#ff7a1a","#0a84ff","#ff3b30"],$b=[0,100,300,500,800],Fh=[[[[0,0],[1,0],[2,0],[3,0]],[[0,0],[0,1],[0,2],[0,3]],[[0,0],[1,0],[2,0],[3,0]],[[0,0],[0,1],[0,2],[0,3]]],[[[0,0],[1,0],[0,1],[1,1]],[[0,0],[1,0],[0,1],[1,1]],[[0,0],[1,0],[0,1],[1,1]],[[0,0],[1,0],[0,1],[1,1]]],[[[1,0],[0,1],[1,1],[2,1]],[[0,0],[0,1],[1,1],[0,2]],[[0,0],[1,0],[2,0],[1,1]],[[1,0],[0,1],[1,1],[1,2]]],[[[1,0],[2,0],[0,1],[1,1]],[[0,0],[0,1],[1,1],[1,2]],[[1,0],[2,0],[0,1],[1,1]],[[0,0],[0,1],[1,1],[1,2]]],[[[0,0],[1,0],[1,1],[2,1]],[[1,0],[0,1],[1,1],[0,2]],[[0,0],[1,0],[1,1],[2,1]],[[1,0],[0,1],[1,1],[0,2]]],[[[0,0],[0,1],[1,1],[2,1]],[[0,0],[1,0],[0,1],[0,2]],[[0,0],[1,0],[2,0],[2,1]],[[1,0],[1,1],[0,2],[1,2]]],[[[2,0],[0,1],[1,1],[2,1]],[[0,0],[0,1],[0,2],[1,2]],[[0,0],[1,0],[2,0],[0,1]],[[0,0],[1,0],[1,1],[1,2]]]];function wu(t){return new Xh(t)}var Xh=class{config;rng;readyGate;board=[];active;next;phase="waiting";result="playing";nowMillis=0;startedAtMillis=0;lastFallMillis=0;lastRotateMillis=-1e3;finishAtMillis=0;lastClearMillis=0;lastClearCount=0;score=0;lines=0;level=1;guideX=_e+5;guideY=x-1;motionEventId=0;players=ve(1);lastEvent=g("none","Listo",0);constructor(e){this.config=D(e,bi),this.rng=V(this.config.seed),this.readyGate=K(bi.start,[{minX:5,maxX:10,minY:28,maxY:31}],this.config.nowMillis),this.resetState(this.config.nowMillis)}init(e){return this.resetState(e),this.lastEvent=g("ready","Entra en la zona de control",e),[this.lastEvent]}press(e){if(this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting")return this.record(this.applyReady(this.readyGate.update(e),e.atMillis));if(this.phase!=="running"||!e.pressed)return[];if(e.y===this.guideY-1&&e.x===this.guideX-1)return this.rotate(-1,e.atMillis);if(e.y===this.guideY-1&&e.x===this.guideX+1)return this.rotate(1,e.atMillis);if(e.x<_e||e.x>=_e+Rt)return[];this.guideX=L(e.x,_e+1,_e+Rt-2),this.guideY=L(e.y,1,x-1);let i=L(e.x-Math.floor(pr(this.active)/2),_e,_e+Rt-pr(this.active));return this.collides(this.active,i,this.active.y,this.active.rotation)||(this.active.x=i),e.y>=x-2?this.hardDrop(e.atMillis):[]}release(e){return this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting"?this.record(this.applyReady(this.readyGate.update({...e,pressed:!1}),e.atMillis)):[]}tick(e){if(this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting")return this.record(this.applyReady(this.readyGate.tick(e.atMillis),e.atMillis));if(this.phase==="finished")return e.atMillis-this.finishAtMillis>=Wb?(this.resetState(e.atMillis),this.record([g("ready","Nueva partida",e.atMillis)])):[];this.result==="line-clear"&&e.atMillis-this.lastClearMillis>=550&&(this.result="playing");let i=tG(this.level,this.config.difficulty,this.guideY>this.active.y+5),a=0;for(;e.atMillis-this.lastFallMillis>=i&&a<4&&this.phase==="running";){if(this.collides(this.active,this.active.x,this.active.y+1,this.active.rotation))return this.lockPiece(e.atMillis);this.active.y+=1,this.lastFallMillis+=i,a+=1}return[]}render(){let e=k("#05070a");for(let i=0;i<x;i+=1){b(e,_e-1,i,this.phase==="finished"?"#67151f":"#06131a"),b(e,_e+Rt,i,this.phase==="finished"?"#67151f":"#06131a");for(let a=0;a<Rt;a+=1)b(e,_e+a,i,this.board[i]?.[a]??"#020609")}if(this.phase==="waiting"||this.phase==="starting")return this.drawReady(e),e;if(this.phase==="finished")return this.drawFinish(e),e;if(this.drawPiece(e,this.ghostPiece(),"#17404a"),this.drawPiece(e,this.active,this.active.color),this.board[this.guideY]?.[this.guideX-_e]===null&&b(e,this.guideX,this.guideY,"#12303a"),b(e,this.guideX-1,this.guideY-1,"#7a1f61"),b(e,this.guideX+1,this.guideY-1,"#7a5f1f"),this.lastClearCount>0&&this.nowMillis-this.lastClearMillis<350)for(let i=_e;i<_e+Rt;i+=1)b(e,i,x-1,"#ffffff");for(let i=x-Math.min(x,this.lines);i<x;i+=1)b(e,0,i,"#ffd166"),b(e,M-1,i,"#36d9ff");return e}snapshot(){let e=this.readyGate.state(this.nowMillis),i=this.players[0];return{currentGame:bi.id,label:bi.label,phase:this.phase,playerCount:this.config.playerCount,players:[{index:0,label:i.label,color:i.color,score:this.score,lives:-1}],score:this.score,lives:-1,elapsedMillis:this.phase==="waiting"||this.phase==="starting"?0:Math.max(0,this.nowMillis-this.startedAtMillis),remainingMillis:this.phase==="finished"?Math.max(0,this.finishAtMillis+Wb-this.nowMillis):0,activeTargets:this.phase==="running"?1:0,success:this.result==="game-win",lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?e.countdownMillis:0,readyPlayers:e.readyPlayers,requiredPlayers:e.requiredPlayers,result:this.result,lines:this.lines,level:this.level,linesTarget:this.linesToWin(),winnerLabel:i.label,activePiece:eM(this.active),nextPiece:eM(this.next),board:this.board.map(a=>[...a]),guideX:this.guideX,guideY:this.guideY,lastClearCount:this.lastClearCount,lineFlashMillis:Math.max(0,this.lastClearMillis+550-this.nowMillis),motionEventId:this.motionEventId}}reset(e={}){this.config=D({...this.config,...e},bi),this.rng=V(this.config.seed),this.readyGate.reset(this.config.nowMillis),this.resetState(this.config.nowMillis)}resetState(e){this.rng=V(this.config.seed),this.readyGate.reset(e),this.board=Array.from({length:x},()=>Array(Rt).fill(null)),this.active=this.randomPiece(),this.next=this.randomPiece(),this.phase="waiting",this.result="playing",this.nowMillis=e,this.startedAtMillis=e,this.lastFallMillis=e,this.finishAtMillis=0,this.lastClearMillis=0,this.lastClearCount=0,this.lastRotateMillis=-1e3,this.score=0,this.lines=0,this.level=1,this.guideX=_e+5,this.guideY=x-1,this.motionEventId=0;let a=ve(Math.max(1,this.config.playerCount),this.config.players)[0];this.players=[{...a,label:a.label==="Player 1"?"Jugador":a.label}],this.lastEvent=g("ready","Entra en la zona de control",e)}applyReady(e,i){return e==="players-ready"?(this.phase="starting",this.motionEventId+=1,[g("ready","Control preparado",i)]):e==="players-left"?(this.phase="waiting",this.motionEventId+=1,[g("ready","Vuelve a la zona de control",i)]):e==="started"?(this.phase="running",this.startedAtMillis=i,this.lastFallMillis=i,this.motionEventId+=1,[g("start","Tetris en marcha",i)]):[]}randomPiece(){let e=this.rng.int(Fh.length),i={shape:e,rotation:0,x:0,y:0,color:eG[e]};return i.x=_e+Math.floor((Rt-pr(i))/2),i}rotate(e,i){if(i-this.lastRotateMillis<$E)return[];let a=(this.active.rotation+e+4)%4;for(let l of[0,-1,1,-2,2])if(!this.collides(this.active,this.active.x+l,this.active.y,a))return this.active.x+=l,this.active.rotation=a,this.lastRotateMillis=i,this.motionEventId+=1,this.record([g("tick",e<0?"Rotaci\xF3n izquierda":"Rotaci\xF3n derecha",i)]);return[]}hardDrop(e){for(;!this.collides(this.active,this.active.x,this.active.y+1,this.active.rotation);)this.active.y+=1;return this.lockPiece(e)}lockPiece(e){for(let[a,l]of Tu(this.active)){let n=this.active.x+a-_e,s=this.active.y+l;s>=0&&s<x&&n>=0&&n<Rt&&(this.board[s][n]=this.active.color)}let i=this.clearLines();return this.lastClearCount=i,i>0&&(this.lastClearMillis=e,this.lines+=i,this.level=Math.floor(this.lines/10)+1,this.score+=($b[i]??0)*this.level,this.result="line-clear",this.motionEventId+=1,this.lines>=this.linesToWin())?this.finish(!0,e):(this.active=this.next,this.active.x=_e+Math.floor((Rt-pr(this.active))/2),this.active.y=0,this.next=this.randomPiece(),this.guideX=this.active.x+Math.floor(pr(this.active)/2),this.guideY=x-1,this.lastFallMillis=e,this.collides(this.active,this.active.x,this.active.y,this.active.rotation)?this.finish(!1,e):i>0?this.record([g("win",`${i===1?"L\xEDnea":`${i} l\xEDneas`} +${($b[i]??0)*this.level}`,e)]):[])}clearLines(){let e=0;for(let i=x-1;i>=0;i-=1)this.board[i].every(Boolean)&&(this.board.splice(i,1),this.board.unshift(Array(Rt).fill(null)),e+=1,i+=1);return e}finish(e,i){this.phase="finished",this.result=e?"game-win":"game-loss",this.finishAtMillis=i,this.motionEventId+=1;let a=this.linesToWin();return this.record([g(e?"win":"fail",e?`\xA1Objetivo de ${a} ${a===1?"l\xEDnea completado":"l\xEDneas completado"}!`:"Las piezas llegaron arriba",i)])}collides(e,i,a,l){return(Fh[e.shape]?.[l]??[]).some(([n,s])=>{let r=i+n-_e,o=a+s;return r<0||r>=Rt||o>=x||o>=0&&this.board[o]?.[r]!==null})}ghostPiece(){let e={...this.active};for(;!this.collides(e,e.x,e.y+1,e.rotation);)e.y+=1;return e}drawPiece(e,i,a){for(let[l,n]of Tu(i))b(e,i.x+l,i.y+n,a)}drawReady(e){let i=this.readyGate.zoneReady(0,this.nowMillis);for(let a=28;a<32;a+=1)for(let l=5;l<=10;l+=1)(i||(l+a+Math.floor(this.nowMillis/110))%4<2)&&b(e,l,a,i?"#ffffff":"#36d9ff")}drawFinish(e){let i=Math.floor((this.nowMillis-this.finishAtMillis)/90),a=this.result==="game-win"?"#36d9ff":"#ff3b30";for(let l=0;l<x;l+=1)for(let n=_e;n<_e+Rt;n+=1)(n+l+i)%5<2&&b(e,n,l,a)}linesToWin(){return Ve(this.config.options,mr.linesToWin)}record(e){let i=e.at(-1);return i&&(this.lastEvent=i),e}};function Tu(t){return Fh[t.shape]?.[t.rotation]??[]}function pr(t){let e=Tu(t).map(([i])=>i);return Math.max(...e)-Math.min(...e)+1}function eM(t){return{shape:t.shape,rotation:t.rotation,x:t.x,y:t.y,color:t.color,cells:Tu(t).map(e=>[...e])}}function tG(t,e,i){let a=Math.max(100,720-(t-1)*45);return Math.max(70,a*(e==="easy"?1.25:e==="hard"?.78:1)/(i?3:1))}function qh(t){let e=wu({playerCount:1,seed:137});return e.init(0),t!=="waiting"&&e.press({x:8,y:29,pressed:!0,atMillis:100}),t==="running"&&e.tick({atMillis:2200}),e}var tM=qh("waiting"),iM=tM.render(),aM=tM.snapshot(),lM=qh("starting"),nM=lM.render(),sM=lM.snapshot(),jh=qh("running");jh.press({x:5,y:31,pressed:!0,atMillis:2300});var rM=jh.render(),oM=jh.snapshot();var Qh={};Qe(Qh,{PlayerDisplay:()=>uM,createGame:()=>Au,finishedFrame:()=>SM,finishedSnapshot:()=>EM,manifest:()=>Wt,readyZonesForPlayers:()=>Ru,runningFrame:()=>bM,runningSnapshot:()=>MM,startingFrame:()=>gM,startingSnapshot:()=>vM,waitingFrame:()=>mM,waitingSnapshot:()=>pM});var I=Y(q(),1);function uM({snapshot:t}){let e=t.playerCount<=4?2:t.playerCount<=6?3:4,i=t.playerProgress.reduce((l,n)=>n.score>(t.playerProgress[l]?.score??-1)?n.index:l,0),a=aG(t);return(0,I.jsx)(ie,{title:t.label,phase:t.phase,children:(0,I.jsxs)("div",{className:`duelo-display whack-display is-phase-${t.phase}`,style:{"--duelo-grid-columns":e},children:[(0,I.jsxs)("section",{className:"duelo-hero",children:[(0,I.jsxs)("div",{className:"duelo-hero-copy",children:[(0,I.jsx)("span",{children:a.eyebrow}),(0,I.jsx)("strong",{children:a.title}),(0,I.jsx)("b",{children:a.caption})]}),(0,I.jsxs)("div",{className:"duelo-hero-metrics",children:[(0,I.jsx)(Zh,{label:"Tiempo",value:J(t.remainingMillis)}),(0,I.jsx)(Zh,{label:"Topos",value:t.activeTargets}),(0,I.jsx)(Zh,{label:"Puntos",value:t.score})]})]}),(0,I.jsx)("section",{className:"duelo-player-grid","aria-label":"Puntuaci\xF3n de jugadores",children:t.playerProgress.map(l=>(0,I.jsx)(iG,{player:l,leader:i===l.index,ready:t.readyPlayerIndices.includes(l.index),winner:t.winnerIndex===l.index},l.index))}),(0,I.jsxs)("footer",{className:"duelo-event-rail",children:[(0,I.jsx)("span",{children:t.phase==="finished"?"Resultado":"\xDAltimo evento"}),(0,I.jsx)("strong",{children:t.lastEventMessage},t.motionEventId),(0,I.jsx)("b",{children:t.phase==="running"?`${t.activeTargets} objetivos activos`:`${t.readyPlayers}/${t.requiredPlayers} listos`})]})]})})}function iG({player:t,leader:e,ready:i,winner:a}){let l={"--duelo-player":t.color,"--duelo-player-rgb":lG(t.color),"--duelo-progress":Math.min(1,t.score/100)},n=a?"Ganador":e&&t.score>0?"L\xEDder":i?"Listo":"Busca tu color";return(0,I.jsxs)("article",{className:`duelo-player-card${a?" is-winner":""}${e?" is-leader":""}`,style:l,children:[(0,I.jsxs)("header",{children:[(0,I.jsx)("i",{}),(0,I.jsx)("span",{className:"duelo-player-name",children:t.label}),(0,I.jsx)("b",{children:n})]}),(0,I.jsxs)("div",{className:"duelo-player-score",children:[(0,I.jsx)("strong",{children:t.score}),(0,I.jsx)("span",{children:"puntos"}),t.lastPoints>0?(0,I.jsxs)("em",{children:["+",t.lastPoints]},`${t.index}-${t.hits}`):null]}),(0,I.jsx)("div",{className:"duelo-player-track",children:(0,I.jsx)("i",{})}),(0,I.jsxs)("footer",{children:[(0,I.jsx)("span",{children:"Topos atrapados"}),(0,I.jsx)("strong",{children:t.hits})]})]})}function Zh({label:t,value:e}){return(0,I.jsxs)("article",{className:"duelo-hero-metric",children:[(0,I.jsx)("span",{children:t}),(0,I.jsx)("strong",{children:e})]})}function aG(t){return t.phase==="waiting"?{eyebrow:`Listos ${t.readyPlayers}/${t.requiredPlayers}`,title:"Busca tu plataforma",caption:"Cada jugador permanece sobre su color"}:t.phase==="starting"?{eyebrow:"Todos listos",title:String(Math.max(1,Math.ceil((t.countdownMillis??0)/1e3))),caption:"Los topos est\xE1n a punto de aparecer"}:t.phase==="finished"?{eyebrow:"Tiempo",title:`\xA1Gana ${t.winnerLabel}!`,caption:"M\xE1s velocidad, m\xE1s puntos"}:{eyebrow:"Todos contra todos",title:"\xA1Atrapa los topos!",caption:"Corre hacia los cuadrados de colores antes de que se apaguen"}}function lG(t){return/^#[0-9a-f]{6}$/i.test(t)?[1,3,5].map(e=>Number.parseInt(t.slice(e,e+2),16)).join(", "):"255, 255, 255"}var Wt={id:"whack-a-mole",label:"Atrapa al topo",description:"Persigue objetivos de colores por todo el suelo y atr\xE1palos antes de que se apaguen.",availability:{development:!0,production:!0},catalog:{category:"versus",color:"#36d9ff",durationLabel:"60 s",modeLabel:"Todos contra todos",audioLabel:"M\xFAsica + efectos",rules:["Cada jugador ocupa su plataforma de salida","Pisa los objetivos de tu color antes de que desaparezcan","Cuanto m\xE1s r\xE1pido llegues, m\xE1s puntos ganas"]},players:{allowAny:!1,min:1,max:8},start:{mode:"player-ready",releaseGraceMillis:1200},config:{difficulty:{default:"medium",options:["easy","medium"]}},defaultDurationMillis:6e4,display:{entry:"./display"},preview:{seed:404,playerCount:4,difficulty:"medium",actions:[{atMillis:100,type:"press",x:0,y:0},{atMillis:100,type:"press",x:12,y:28},{atMillis:100,type:"press",x:0,y:28},{atMillis:100,type:"press",x:12,y:0}],captureStartMillis:2300,frameCount:18,frameIntervalMillis:120},tags:["arcade","reaction","multiplayer","typescript"]};var Xa=2,cM=4e3,nG=500,dM=3400,sG=2300;function Au(t){return new Ih(t)}var Ih=class{config;rng;readyZones;readyGate;players=[];targets=[];lastPositions=[];catchUp=[];hitFlash=[];phase="waiting";nowMillis=0;startedAtMillis=0;finishAtMillis=0;winnerIndex=-1;motionEventId=0;lastEvent=g("none","Listo",0);constructor(e){this.config=D(e,Wt),this.rng=V(this.config.seed),this.readyZones=Ru(this.config.playerCount),this.readyGate=K(Wt.start,this.readyZones,this.config.nowMillis),this.resetState(this.config.nowMillis)}init(e){return this.resetState(e),this.lastEvent=g("ready","Busca tu plataforma de color",e),[this.lastEvent]}press(e){if(this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting")return this.record(this.applyReady(this.readyGate.update(e),e.atMillis));if(this.phase!=="running"||!e.pressed)return[];let i=this.targets.findIndex(s=>e.atMillis<s.deadlineMillis&&rG(s,e.x,e.y));if(i<0)return this.record([g("miss","No hab\xEDa ning\xFAn topo ah\xED",e.atMillis)]);let a=this.targets[i],l=this.players[a.playerIndex],n=oG(a,e.atMillis);l.score+=n,l.hits+=1,l.lastPoints=n;for(let s=0;s<Xa;s+=1)for(let r=0;r<Xa;r+=1)this.hitFlash.push({x:a.x+r,y:a.y+s,untilMillis:e.atMillis+nG,color:l.color});return this.lastPositions[a.playerIndex]={x:a.x,y:a.y},this.targets.splice(i,1),this.spawnTarget(a.playerIndex,e.atMillis),this.motionEventId+=1,this.record([g("hit",`${l.label} +${n}`,e.atMillis)])}release(e){return this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting"?this.record(this.applyReady(this.readyGate.update({...e,pressed:!1}),e.atMillis)):[]}tick(e){if(this.nowMillis=e.atMillis,this.phase==="waiting"||this.phase==="starting")return this.record(this.applyReady(this.readyGate.tick(e.atMillis),e.atMillis));if(this.phase==="finished")return e.atMillis-this.finishAtMillis>=cM?(this.resetState(e.atMillis),this.record([g("ready","Nueva caza",e.atMillis)])):[];this.hitFlash=this.hitFlash.filter(a=>a.untilMillis>e.atMillis);let i=this.targets.filter(a=>e.atMillis>=a.deadlineMillis);for(let a of i)this.catchUp[a.playerIndex]=!0,this.targets=this.targets.filter(l=>l!==a),this.spawnTarget(a.playerIndex,e.atMillis);return this.remainingMillis()<=0?this.finish(e.atMillis):[]}render(){let e=k("#05070a");if(this.phase==="waiting"||this.phase==="starting")return this.drawReadiness(e),e;if(this.phase==="finished")return this.drawFinish(e),e;for(let i of this.targets){let a=this.players[i.playerIndex],l=L((i.deadlineMillis-this.nowMillis)/Math.max(1,i.deadlineMillis-i.bornMillis),.16,1),n=uG(a.color,l);for(let s=0;s<Xa;s+=1)for(let r=0;r<Xa;r+=1)b(e,i.x+r,i.y+s,n)}for(let i of this.hitFlash)b(e,i.x,i.y,"#ffffff");return e}snapshot(){let e=this.readyGate.state(this.nowMillis);return{currentGame:Wt.id,label:Wt.label,phase:this.phase,playerCount:this.config.playerCount,players:this.players.map(i=>({index:i.index,label:i.label,color:i.color,score:i.score,lives:-1})),score:this.players.reduce((i,a)=>i+a.score,0),lives:-1,elapsedMillis:this.elapsedMillis(),remainingMillis:this.phase==="finished"?Math.max(0,this.finishAtMillis+cM-this.nowMillis):this.remainingMillis(),activeTargets:this.targets.length,success:this.phase==="finished",lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?e.countdownMillis:0,readyPlayers:e.readyPlayers,requiredPlayers:e.requiredPlayers,targets:this.targets.map(i=>({...i,remainingMillis:Math.max(0,i.deadlineMillis-this.nowMillis)})),playerProgress:this.players.map(i=>({...i})),readyPlayerIndices:this.readyZones.flatMap((i,a)=>this.readyGate.zoneReady(a,this.nowMillis)?[a]:[]),winnerIndex:this.winnerIndex,winnerLabel:this.players[this.winnerIndex]?.label??"",motionEventId:this.motionEventId}}reset(e={}){this.config=D({...this.config,...e},Wt),this.rng=V(this.config.seed),this.readyZones=Ru(this.config.playerCount),this.readyGate=K(Wt.start,this.readyZones,this.config.nowMillis),this.resetState(this.config.nowMillis)}playerReadyZones(){return this.readyZones.map(e=>({...e}))}resetState(e){this.rng=V(this.config.seed),this.readyGate.reset(e);let i=ve(this.config.playerCount,this.config.players);this.players=i.map((a,l)=>({index:l,label:a.label===`Player ${l+1}`?`Jugador ${l+1}`:a.label,color:a.color,score:0,hits:0,lastPoints:0})),this.targets=[],this.lastPositions=[],this.catchUp=[],this.hitFlash=[],this.phase="waiting",this.nowMillis=e,this.startedAtMillis=e,this.finishAtMillis=0,this.winnerIndex=-1,this.motionEventId=0,this.lastEvent=g("ready","Busca tu plataforma de color",e)}applyReady(e,i){return e==="players-ready"?(this.phase="starting",this.motionEventId+=1,[g("ready","Todos listos para cazar",i)]):e==="players-left"?(this.phase="waiting",this.motionEventId+=1,[g("ready","Vuelve a tu plataforma",i)]):e==="started"?(this.phase="running",this.startedAtMillis=i,this.targets=[],this.players.forEach((a,l)=>this.spawnTarget(l,i)),this.motionEventId+=1,[g("start","\xA1Atrapa los topos de colores!",i)]):[]}spawnTarget(e,i){let a={x:this.rng.int(M-1),y:this.rng.int(x-1)};for(let s=0;s<200;s+=1){let r={x:this.rng.int(M-Xa+1),y:this.rng.int(x-Xa+1)},o=this.lastPositions[e],u=o?(r.x-o.x)**2+(r.y-o.y)**2:64;if(this.targets.every(p=>Math.abs(r.x-p.x)>=4||Math.abs(r.y-p.y)>=4)&&u>=25&&u<=225){a=r;break}}let l=this.targetInterval(),n=this.catchUp[e]?2e3:0;this.catchUp[e]=!1,this.targets.push({playerIndex:e,...a,bornMillis:i,deadlineMillis:i+l+1e3+n})}targetInterval(){let e=L(this.elapsedMillis()/this.config.durationMillis,0,1),i=dM-1e3,a=dM-sG,l=this.config.difficulty==="easy"?1.18:1;return(i-e*a)*l}finish(e){return this.phase="finished",this.finishAtMillis=e,this.targets=[],this.winnerIndex=this.players.reduce((i,a,l)=>a.score>(this.players[i]?.score??-1)?l:i,0),this.motionEventId+=1,this.record([g("win",`\xA1Gana ${this.players[this.winnerIndex]?.label}!`,e)])}elapsedMillis(){return this.phase==="waiting"||this.phase==="starting"?0:Math.max(0,this.nowMillis-this.startedAtMillis)}remainingMillis(){return Math.max(0,this.config.durationMillis-this.elapsedMillis())}record(e){let i=e.at(-1);return i&&(this.lastEvent=i),e}drawReadiness(e){this.players.forEach((i,a)=>{let l=this.readyZones[a],n=this.readyGate.zoneReady(a,this.nowMillis);for(let s=l.minY;s<=l.maxY;s+=1)for(let r=l.minX;r<=l.maxX;r+=1)(n||(r+s+Math.floor(this.nowMillis/120))%4<2)&&b(e,r,s,n?"#ffffff":i.color)})}drawFinish(e){let i=this.players[this.winnerIndex],a=Math.floor((this.nowMillis-this.finishAtMillis)/90);for(let l=0;l<x;l+=1)for(let n=0;n<M;n+=1)(n*2+l+a)%7<3&&b(e,n,l,i?.color??"#36d9ff")}};function Ru(t){return[[0,0],[12,28],[0,28],[12,0],[0,14],[12,14],[6,0],[6,28]].slice(0,L(Math.trunc(t),1,8)).map(([i=0,a=0])=>({minX:i,maxX:i+3,minY:a,maxY:a+3}))}function rG(t,e,i){return e>=t.x&&e<t.x+Xa&&i>=t.y&&i<t.y+Xa}function oG(t,e){let i=Math.max(1,t.deadlineMillis-t.bornMillis);return 4+Math.ceil(L((t.deadlineMillis-e)/i,0,1)*8)}function uG(t,e){let i=t.replace("#","");return`#${[0,2,4].map(l=>Math.round(Number.parseInt(i.slice(l,l+2),16)*e).toString(16).padStart(2,"0")).join("")}`}function zu(t){let e=Au({playerCount:4,seed:404,durationMillis:t==="finished"?3e3:6e4});return e.init(0),t!=="waiting"&&cG(e),(t==="running"||t==="finished")&&e.tick({atMillis:2200}),t==="finished"&&e.tick({atMillis:5300}),e}var hM=zu("waiting"),mM=hM.render(),pM=hM.snapshot(),yM=zu("starting"),gM=yM.render(),vM=yM.snapshot(),Pu=zu("running"),fM=Pu.snapshot().targets[1];Pu.press({x:fM.x,y:fM.y,pressed:!0,atMillis:2300});var bM=Pu.render(),MM=Pu.snapshot(),xM=zu("finished"),SM=xM.render(),EM=xM.snapshot();function cG(t){t.playerReadyZones().forEach(e=>t.press({x:e.minX,y:e.minY,pressed:!0,atMillis:100}))}var kh=new Map([[ui.id,Rf],[di.id,Nf],[St.id,Yf],[fi.id,If],[hi.id,Kf],[kt.id,ih],[mi.id,sh],[pi.id,yh],[Ft.id,vh],[ot.id,Gh],[ut.id,zh],[Xt.id,Nh],[bi.id,Vh],[Kt.id,Yh],[Wt.id,Qh]]),R3=[...kh.values()].map(t=>t.manifest).sort((t,e)=>t.id.localeCompare(e.id));var Kh=Y(q(),1),_u=new WeakMap;function GM(t,e){let i=kh.get(e.gameId);if(!i?.PlayerDisplay)throw new Error(`no player display registered for ${e.gameId}`);let a=_u.get(t);a||(a={root:(0,CM.createRoot)(t),input:e},_u.set(t,a)),a.input=e;let l=i.PlayerDisplay;a.root.render((0,Kh.jsx)(K0,{paused:e.paused===!0,children:(0,Kh.jsx)(l,{snapshot:e.snapshot,frame:e.frame})}))}function dG(t){_u.get(t)?.root.unmount(),_u.delete(t)}function fG(){if(document.getElementById("motion-levels-games-display-styles"))return;let t=document.createElement("style");t.id="motion-levels-games-display-styles",t.textContent=`/*
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

.cruce-galactico-display.is-celebrating .ml-solo-message {
  animation: cruceGalacticoVictory 1s ease-in-out infinite alternate;
  background:
    radial-gradient(circle at 22% 50%, rgba(126, 231, 135, 0.22), transparent 42%),
    rgba(6, 20, 17, 0.9);
  border-color: rgba(126, 231, 135, 0.78);
  box-shadow: inset 0 0 70px rgba(54, 217, 255, 0.1), 0 0 46px rgba(126, 231, 135, 0.18);
}

.cruce-galactico-display.is-celebrating .ml-solo-floor {
  animation: cruceGalacticoPortal 850ms ease-in-out infinite alternate;
  border-color: rgba(54, 217, 255, 0.76);
}

@keyframes cruceGalacticoVictory {
  from { filter: brightness(1); transform: scale(1); }
  to { filter: brightness(1.12); transform: scale(1.008); }
}

@keyframes cruceGalacticoPortal {
  from { filter: brightness(1); }
  to { filter: brightness(1.2); }
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
`,document.head.append(t)}fG();window.MotionLevelsGamesDisplay={revision:"7c4731b6efc2408dfff4f0c8aa168a981db4c733",mount:GM,update:GM,unmount:dG};})();
