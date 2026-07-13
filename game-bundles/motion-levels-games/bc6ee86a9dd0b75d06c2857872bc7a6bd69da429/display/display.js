"use strict";(()=>{var zg=Object.create;var mu=Object.defineProperty;var Rg=Object.getOwnPropertyDescriptor;var _g=Object.getOwnPropertyNames;var Dg=Object.getPrototypeOf,Og=Object.prototype.hasOwnProperty;var Gt=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),wl=(e,t)=>{for(var a in t)mu(e,a,{get:t[a],enumerable:!0})},wg=(e,t,a,l)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of _g(t))!Og.call(e,i)&&i!==a&&mu(e,i,{get:()=>t[i],enumerable:!(l=Rg(t,i))||l.enumerable});return e};var ne=(e,t,a)=>(a=e!=null?zg(Dg(e)):{},wg(t||!e||!e.__esModule?mu(a,"default",{value:e,enumerable:!0}):a,e));var sd=Gt(le=>{"use strict";function gu(e,t){var a=e.length;e.push(t);e:for(;0<a;){var l=a-1>>>1,i=e[l];if(0<hs(i,t))e[l]=t,e[a]=i,a=l;else break e}}function Ct(e){return e.length===0?null:e[0]}function ys(e){if(e.length===0)return null;var t=e[0],a=e.pop();if(a!==t){e[0]=a;e:for(var l=0,i=e.length,n=i>>>1;l<n;){var s=2*(l+1)-1,r=e[s],u=s+1,c=e[u];if(0>hs(r,a))u<i&&0>hs(c,r)?(e[l]=c,e[u]=a,l=u):(e[l]=r,e[s]=a,l=s);else if(u<i&&0>hs(c,a))e[l]=c,e[u]=a,l=u;else break e}}return t}function hs(e,t){var a=e.sortIndex-t.sortIndex;return a!==0?a:e.id-t.id}le.unstable_now=void 0;typeof performance=="object"&&typeof performance.now=="function"?(Wf=performance,le.unstable_now=function(){return Wf.now()}):(hu=Date,If=hu.now(),le.unstable_now=function(){return hu.now()-If});var Wf,hu,If,jt=[],va=[],Ng=1,nt=null,Re=3,vu=!1,Vi=!1,Qi=!1,bu=!1,td=typeof setTimeout=="function"?setTimeout:null,ad=typeof clearTimeout=="function"?clearTimeout:null,$f=typeof setImmediate<"u"?setImmediate:null;function ps(e){for(var t=Ct(va);t!==null;){if(t.callback===null)ys(va);else if(t.startTime<=e)ys(va),t.sortIndex=t.expirationTime,gu(jt,t);else break;t=Ct(va)}}function Mu(e){if(Qi=!1,ps(e),!Vi)if(Ct(jt)!==null)Vi=!0,Hl||(Hl=!0,Nl());else{var t=Ct(va);t!==null&&Su(Mu,t.startTime-e)}}var Hl=!1,Pi=-1,ld=5,id=-1;function nd(){return bu?!0:!(le.unstable_now()-id<ld)}function pu(){if(bu=!1,Hl){var e=le.unstable_now();id=e;var t=!0;try{e:{Vi=!1,Qi&&(Qi=!1,ad(Pi),Pi=-1),vu=!0;var a=Re;try{t:{for(ps(e),nt=Ct(jt);nt!==null&&!(nt.expirationTime>e&&nd());){var l=nt.callback;if(typeof l=="function"){nt.callback=null,Re=nt.priorityLevel;var i=l(nt.expirationTime<=e);if(e=le.unstable_now(),typeof i=="function"){nt.callback=i,ps(e),t=!0;break t}nt===Ct(jt)&&ys(jt),ps(e)}else ys(jt);nt=Ct(jt)}if(nt!==null)t=!0;else{var n=Ct(va);n!==null&&Su(Mu,n.startTime-e),t=!1}}break e}finally{nt=null,Re=a,vu=!1}t=void 0}}finally{t?Nl():Hl=!1}}}var Nl;typeof $f=="function"?Nl=function(){$f(pu)}:typeof MessageChannel<"u"?(yu=new MessageChannel,ed=yu.port2,yu.port1.onmessage=pu,Nl=function(){ed.postMessage(null)}):Nl=function(){td(pu,0)};var yu,ed;function Su(e,t){Pi=td(function(){e(le.unstable_now())},t)}le.unstable_IdlePriority=5;le.unstable_ImmediatePriority=1;le.unstable_LowPriority=4;le.unstable_NormalPriority=3;le.unstable_Profiling=null;le.unstable_UserBlockingPriority=2;le.unstable_cancelCallback=function(e){e.callback=null};le.unstable_forceFrameRate=function(e){0>e||125<e?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):ld=0<e?Math.floor(1e3/e):5};le.unstable_getCurrentPriorityLevel=function(){return Re};le.unstable_next=function(e){switch(Re){case 1:case 2:case 3:var t=3;break;default:t=Re}var a=Re;Re=t;try{return e()}finally{Re=a}};le.unstable_requestPaint=function(){bu=!0};le.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var a=Re;Re=e;try{return t()}finally{Re=a}};le.unstable_scheduleCallback=function(e,t,a){var l=le.unstable_now();switch(typeof a=="object"&&a!==null?(a=a.delay,a=typeof a=="number"&&0<a?l+a:l):a=l,e){case 1:var i=-1;break;case 2:i=250;break;case 5:i=1073741823;break;case 4:i=1e4;break;default:i=5e3}return i=a+i,e={id:Ng++,callback:t,priorityLevel:e,startTime:a,expirationTime:i,sortIndex:-1},a>l?(e.sortIndex=a,gu(va,e),Ct(jt)===null&&e===Ct(va)&&(Qi?(ad(Pi),Pi=-1):Qi=!0,Su(Mu,a-l))):(e.sortIndex=i,gu(jt,e),Vi||vu||(Vi=!0,Hl||(Hl=!0,Nl()))),e};le.unstable_shouldYield=nd;le.unstable_wrapCallback=function(e){var t=Re;return function(){var a=Re;Re=t;try{return e.apply(this,arguments)}finally{Re=a}}}});var ud=Gt((wM,rd)=>{"use strict";rd.exports=sd()});var bd=Gt(O=>{"use strict";var Tu=Symbol.for("react.transitional.element"),Hg=Symbol.for("react.portal"),Ug=Symbol.for("react.fragment"),Bg=Symbol.for("react.strict_mode"),Lg=Symbol.for("react.profiler"),Yg=Symbol.for("react.consumer"),qg=Symbol.for("react.context"),Xg=Symbol.for("react.forward_ref"),jg=Symbol.for("react.suspense"),Zg=Symbol.for("react.memo"),md=Symbol.for("react.lazy"),Vg=Symbol.for("react.activity"),od=Symbol.iterator;function Qg(e){return e===null||typeof e!="object"?null:(e=od&&e[od]||e["@@iterator"],typeof e=="function"?e:null)}var hd={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},pd=Object.assign,yd={};function Bl(e,t,a){this.props=e,this.context=t,this.refs=yd,this.updater=a||hd}Bl.prototype.isReactComponent={};Bl.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};Bl.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function gd(){}gd.prototype=Bl.prototype;function Gu(e,t,a){this.props=e,this.context=t,this.refs=yd,this.updater=a||hd}var Cu=Gu.prototype=new gd;Cu.constructor=Gu;pd(Cu,Bl.prototype);Cu.isPureReactComponent=!0;var cd=Array.isArray;function Eu(){}var I={H:null,A:null,T:null,S:null},vd=Object.prototype.hasOwnProperty;function Au(e,t,a){var l=a.ref;return{$$typeof:Tu,type:e,key:t,ref:l!==void 0?l:null,props:a}}function Pg(e,t){return Au(e.type,t,e.props)}function zu(e){return typeof e=="object"&&e!==null&&e.$$typeof===Tu}function Fg(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(a){return t[a]})}var fd=/\/+/g;function xu(e,t){return typeof e=="object"&&e!==null&&e.key!=null?Fg(""+e.key):t.toString(36)}function Kg(e){switch(e.status){case"fulfilled":return e.value;case"rejected":throw e.reason;default:switch(typeof e.status=="string"?e.then(Eu,Eu):(e.status="pending",e.then(function(t){e.status==="pending"&&(e.status="fulfilled",e.value=t)},function(t){e.status==="pending"&&(e.status="rejected",e.reason=t)})),e.status){case"fulfilled":return e.value;case"rejected":throw e.reason}}throw e}function Ul(e,t,a,l,i){var n=typeof e;(n==="undefined"||n==="boolean")&&(e=null);var s=!1;if(e===null)s=!0;else switch(n){case"bigint":case"string":case"number":s=!0;break;case"object":switch(e.$$typeof){case Tu:case Hg:s=!0;break;case md:return s=e._init,Ul(s(e._payload),t,a,l,i)}}if(s)return i=i(e),s=l===""?"."+xu(e,0):l,cd(i)?(a="",s!=null&&(a=s.replace(fd,"$&/")+"/"),Ul(i,t,a,"",function(c){return c})):i!=null&&(zu(i)&&(i=Pg(i,a+(i.key==null||e&&e.key===i.key?"":(""+i.key).replace(fd,"$&/")+"/")+s)),t.push(i)),1;s=0;var r=l===""?".":l+":";if(cd(e))for(var u=0;u<e.length;u++)l=e[u],n=r+xu(l,u),s+=Ul(l,t,a,n,i);else if(u=Qg(e),typeof u=="function")for(e=u.call(e),u=0;!(l=e.next()).done;)l=l.value,n=r+xu(l,u++),s+=Ul(l,t,a,n,i);else if(n==="object"){if(typeof e.then=="function")return Ul(Kg(e),t,a,l,i);throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.")}return s}function gs(e,t,a){if(e==null)return e;var l=[],i=0;return Ul(e,l,"","",function(n){return t.call(a,n,i++)}),l}function Jg(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(a){(e._status===0||e._status===-1)&&(e._status=1,e._result=a)},function(a){(e._status===0||e._status===-1)&&(e._status=2,e._result=a)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var dd=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},kg={map:gs,forEach:function(e,t,a){gs(e,function(){t.apply(this,arguments)},a)},count:function(e){var t=0;return gs(e,function(){t++}),t},toArray:function(e){return gs(e,function(t){return t})||[]},only:function(e){if(!zu(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};O.Activity=Vg;O.Children=kg;O.Component=Bl;O.Fragment=Ug;O.Profiler=Lg;O.PureComponent=Gu;O.StrictMode=Bg;O.Suspense=jg;O.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=I;O.__COMPILER_RUNTIME={__proto__:null,c:function(e){return I.H.useMemoCache(e)}};O.cache=function(e){return function(){return e.apply(null,arguments)}};O.cacheSignal=function(){return null};O.cloneElement=function(e,t,a){if(e==null)throw Error("The argument must be a React element, but you passed "+e+".");var l=pd({},e.props),i=e.key;if(t!=null)for(n in t.key!==void 0&&(i=""+t.key),t)!vd.call(t,n)||n==="key"||n==="__self"||n==="__source"||n==="ref"&&t.ref===void 0||(l[n]=t[n]);var n=arguments.length-2;if(n===1)l.children=a;else if(1<n){for(var s=Array(n),r=0;r<n;r++)s[r]=arguments[r+2];l.children=s}return Au(e.type,i,l)};O.createContext=function(e){return e={$$typeof:qg,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:Yg,_context:e},e};O.createElement=function(e,t,a){var l,i={},n=null;if(t!=null)for(l in t.key!==void 0&&(n=""+t.key),t)vd.call(t,l)&&l!=="key"&&l!=="__self"&&l!=="__source"&&(i[l]=t[l]);var s=arguments.length-2;if(s===1)i.children=a;else if(1<s){for(var r=Array(s),u=0;u<s;u++)r[u]=arguments[u+2];i.children=r}if(e&&e.defaultProps)for(l in s=e.defaultProps,s)i[l]===void 0&&(i[l]=s[l]);return Au(e,n,i)};O.createRef=function(){return{current:null}};O.forwardRef=function(e){return{$$typeof:Xg,render:e}};O.isValidElement=zu;O.lazy=function(e){return{$$typeof:md,_payload:{_status:-1,_result:e},_init:Jg}};O.memo=function(e,t){return{$$typeof:Zg,type:e,compare:t===void 0?null:t}};O.startTransition=function(e){var t=I.T,a={};I.T=a;try{var l=e(),i=I.S;i!==null&&i(a,l),typeof l=="object"&&l!==null&&typeof l.then=="function"&&l.then(Eu,dd)}catch(n){dd(n)}finally{t!==null&&a.types!==null&&(t.types=a.types),I.T=t}};O.unstable_useCacheRefresh=function(){return I.H.useCacheRefresh()};O.use=function(e){return I.H.use(e)};O.useActionState=function(e,t,a){return I.H.useActionState(e,t,a)};O.useCallback=function(e,t){return I.H.useCallback(e,t)};O.useContext=function(e){return I.H.useContext(e)};O.useDebugValue=function(){};O.useDeferredValue=function(e,t){return I.H.useDeferredValue(e,t)};O.useEffect=function(e,t){return I.H.useEffect(e,t)};O.useEffectEvent=function(e){return I.H.useEffectEvent(e)};O.useId=function(){return I.H.useId()};O.useImperativeHandle=function(e,t,a){return I.H.useImperativeHandle(e,t,a)};O.useInsertionEffect=function(e,t){return I.H.useInsertionEffect(e,t)};O.useLayoutEffect=function(e,t){return I.H.useLayoutEffect(e,t)};O.useMemo=function(e,t){return I.H.useMemo(e,t)};O.useOptimistic=function(e,t){return I.H.useOptimistic(e,t)};O.useReducer=function(e,t,a){return I.H.useReducer(e,t,a)};O.useRef=function(e){return I.H.useRef(e)};O.useState=function(e){return I.H.useState(e)};O.useSyncExternalStore=function(e,t,a){return I.H.useSyncExternalStore(e,t,a)};O.useTransition=function(){return I.H.useTransition()};O.version="19.2.7"});var el=Gt((HM,Md)=>{"use strict";Md.exports=bd()});var xd=Gt(Oe=>{"use strict";var Wg=el();function Sd(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)t+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function ba(){}var De={d:{f:ba,r:function(){throw Error(Sd(522))},D:ba,C:ba,L:ba,m:ba,X:ba,S:ba,M:ba},p:0,findDOMNode:null},Ig=Symbol.for("react.portal");function $g(e,t,a){var l=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Ig,key:l==null?null:""+l,children:e,containerInfo:t,implementation:a}}var Fi=Wg.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function vs(e,t){if(e==="font")return"";if(typeof t=="string")return t==="use-credentials"?t:""}Oe.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=De;Oe.createPortal=function(e,t){var a=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)throw Error(Sd(299));return $g(e,t,null,a)};Oe.flushSync=function(e){var t=Fi.T,a=De.p;try{if(Fi.T=null,De.p=2,e)return e()}finally{Fi.T=t,De.p=a,De.d.f()}};Oe.preconnect=function(e,t){typeof e=="string"&&(t?(t=t.crossOrigin,t=typeof t=="string"?t==="use-credentials"?t:"":void 0):t=null,De.d.C(e,t))};Oe.prefetchDNS=function(e){typeof e=="string"&&De.d.D(e)};Oe.preinit=function(e,t){if(typeof e=="string"&&t&&typeof t.as=="string"){var a=t.as,l=vs(a,t.crossOrigin),i=typeof t.integrity=="string"?t.integrity:void 0,n=typeof t.fetchPriority=="string"?t.fetchPriority:void 0;a==="style"?De.d.S(e,typeof t.precedence=="string"?t.precedence:void 0,{crossOrigin:l,integrity:i,fetchPriority:n}):a==="script"&&De.d.X(e,{crossOrigin:l,integrity:i,fetchPriority:n,nonce:typeof t.nonce=="string"?t.nonce:void 0})}};Oe.preinitModule=function(e,t){if(typeof e=="string")if(typeof t=="object"&&t!==null){if(t.as==null||t.as==="script"){var a=vs(t.as,t.crossOrigin);De.d.M(e,{crossOrigin:a,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0})}}else t==null&&De.d.M(e)};Oe.preload=function(e,t){if(typeof e=="string"&&typeof t=="object"&&t!==null&&typeof t.as=="string"){var a=t.as,l=vs(a,t.crossOrigin);De.d.L(e,a,{crossOrigin:l,integrity:typeof t.integrity=="string"?t.integrity:void 0,nonce:typeof t.nonce=="string"?t.nonce:void 0,type:typeof t.type=="string"?t.type:void 0,fetchPriority:typeof t.fetchPriority=="string"?t.fetchPriority:void 0,referrerPolicy:typeof t.referrerPolicy=="string"?t.referrerPolicy:void 0,imageSrcSet:typeof t.imageSrcSet=="string"?t.imageSrcSet:void 0,imageSizes:typeof t.imageSizes=="string"?t.imageSizes:void 0,media:typeof t.media=="string"?t.media:void 0})}};Oe.preloadModule=function(e,t){if(typeof e=="string")if(t){var a=vs(t.as,t.crossOrigin);De.d.m(e,{as:typeof t.as=="string"&&t.as!=="script"?t.as:void 0,crossOrigin:a,integrity:typeof t.integrity=="string"?t.integrity:void 0})}else De.d.m(e)};Oe.requestFormReset=function(e){De.d.r(e)};Oe.unstable_batchedUpdates=function(e,t){return e(t)};Oe.useFormState=function(e,t,a){return Fi.H.useFormState(e,t,a)};Oe.useFormStatus=function(){return Fi.H.useHostTransitionStatus()};Oe.version="19.2.7"});var Gd=Gt((BM,Td)=>{"use strict";function Ed(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Ed)}catch(e){console.error(e)}}Ed(),Td.exports=xd()});var By=Gt(Zr=>{"use strict";var ge=ud(),Wm=el(),e1=Gd();function v(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)t+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function Im(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Nn(e){var t=e,a=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(a=t.return),e=t.return;while(e)}return t.tag===3?a:null}function $m(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function eh(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Cd(e){if(Nn(e)!==e)throw Error(v(188))}function t1(e){var t=e.alternate;if(!t){if(t=Nn(e),t===null)throw Error(v(188));return t!==e?null:e}for(var a=e,l=t;;){var i=a.return;if(i===null)break;var n=i.alternate;if(n===null){if(l=i.return,l!==null){a=l;continue}break}if(i.child===n.child){for(n=i.child;n;){if(n===a)return Cd(i),e;if(n===l)return Cd(i),t;n=n.sibling}throw Error(v(188))}if(a.return!==l.return)a=i,l=n;else{for(var s=!1,r=i.child;r;){if(r===a){s=!0,a=i,l=n;break}if(r===l){s=!0,l=i,a=n;break}r=r.sibling}if(!s){for(r=n.child;r;){if(r===a){s=!0,a=n,l=i;break}if(r===l){s=!0,l=n,a=i;break}r=r.sibling}if(!s)throw Error(v(189))}}if(a.alternate!==l)throw Error(v(190))}if(a.tag!==3)throw Error(v(188));return a.stateNode.current===a?e:t}function th(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=th(e),t!==null)return t;e=e.sibling}return null}var te=Object.assign,a1=Symbol.for("react.element"),bs=Symbol.for("react.transitional.element"),tn=Symbol.for("react.portal"),Zl=Symbol.for("react.fragment"),ah=Symbol.for("react.strict_mode"),uo=Symbol.for("react.profiler"),lh=Symbol.for("react.consumer"),kt=Symbol.for("react.context"),ic=Symbol.for("react.forward_ref"),oo=Symbol.for("react.suspense"),co=Symbol.for("react.suspense_list"),nc=Symbol.for("react.memo"),Ma=Symbol.for("react.lazy"),fo=Symbol.for("react.activity"),l1=Symbol.for("react.memo_cache_sentinel"),Ad=Symbol.iterator;function Ki(e){return e===null||typeof e!="object"?null:(e=Ad&&e[Ad]||e["@@iterator"],typeof e=="function"?e:null)}var i1=Symbol.for("react.client.reference");function mo(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===i1?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case Zl:return"Fragment";case uo:return"Profiler";case ah:return"StrictMode";case oo:return"Suspense";case co:return"SuspenseList";case fo:return"Activity"}if(typeof e=="object")switch(e.$$typeof){case tn:return"Portal";case kt:return e.displayName||"Context";case lh:return(e._context.displayName||"Context")+".Consumer";case ic:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case nc:return t=e.displayName||null,t!==null?t:mo(e.type)||"Memo";case Ma:t=e._payload,e=e._init;try{return mo(e(t))}catch{}}return null}var an=Array.isArray,R=Wm.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,Z=e1.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,sl={pending:!1,data:null,method:null,action:null},ho=[],Vl=-1;function Dt(e){return{current:e}}function xe(e){0>Vl||(e.current=ho[Vl],ho[Vl]=null,Vl--)}function k(e,t){Vl++,ho[Vl]=e.current,e.current=t}var _t=Dt(null),Mn=Dt(null),Da=Dt(null),Is=Dt(null);function $s(e,t){switch(k(Da,t),k(Mn,e),k(_t,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?Nm(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=Nm(t),e=Ey(t,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}xe(_t),k(_t,e)}function ui(){xe(_t),xe(Mn),xe(Da)}function po(e){e.memoizedState!==null&&k(Is,e);var t=_t.current,a=Ey(t,e.type);t!==a&&(k(Mn,e),k(_t,a))}function er(e){Mn.current===e&&(xe(_t),xe(Mn)),Is.current===e&&(xe(Is),Dn._currentValue=sl)}var Ru,zd;function al(e){if(Ru===void 0)try{throw Error()}catch(a){var t=a.stack.trim().match(/\n( *(at )?)/);Ru=t&&t[1]||"",zd=-1<a.stack.indexOf(`
    at`)?" (<anonymous>)":-1<a.stack.indexOf("@")?"@unknown:0:0":""}return`
`+Ru+e+zd}var _u=!1;function Du(e,t){if(!e||_u)return"";_u=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var l={DetermineComponentFrameRoot:function(){try{if(t){var y=function(){throw Error()};if(Object.defineProperty(y.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(y,[])}catch(p){var m=p}Reflect.construct(e,[],y)}else{try{y.call()}catch(p){m=p}e.call(y.prototype)}}else{try{throw Error()}catch(p){m=p}(y=e())&&typeof y.catch=="function"&&y.catch(function(){})}}catch(p){if(p&&m&&typeof p.stack=="string")return[p.stack,m.stack]}return[null,null]}};l.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var i=Object.getOwnPropertyDescriptor(l.DetermineComponentFrameRoot,"name");i&&i.configurable&&Object.defineProperty(l.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var n=l.DetermineComponentFrameRoot(),s=n[0],r=n[1];if(s&&r){var u=s.split(`
`),c=r.split(`
`);for(i=l=0;l<u.length&&!u[l].includes("DetermineComponentFrameRoot");)l++;for(;i<c.length&&!c[i].includes("DetermineComponentFrameRoot");)i++;if(l===u.length||i===c.length)for(l=u.length-1,i=c.length-1;1<=l&&0<=i&&u[l]!==c[i];)i--;for(;1<=l&&0<=i;l--,i--)if(u[l]!==c[i]){if(l!==1||i!==1)do if(l--,i--,0>i||u[l]!==c[i]){var f=`
`+u[l].replace(" at new "," at ");return e.displayName&&f.includes("<anonymous>")&&(f=f.replace("<anonymous>",e.displayName)),f}while(1<=l&&0<=i);break}}}finally{_u=!1,Error.prepareStackTrace=a}return(a=e?e.displayName||e.name:"")?al(a):""}function n1(e,t){switch(e.tag){case 26:case 27:case 5:return al(e.type);case 16:return al("Lazy");case 13:return e.child!==t&&t!==null?al("Suspense Fallback"):al("Suspense");case 19:return al("SuspenseList");case 0:case 15:return Du(e.type,!1);case 11:return Du(e.type.render,!1);case 1:return Du(e.type,!0);case 31:return al("Activity");default:return""}}function Rd(e){try{var t="",a=null;do t+=n1(e,a),a=e,e=e.return;while(e);return t}catch(l){return`
Error generating stack: `+l.message+`
`+l.stack}}var yo=Object.prototype.hasOwnProperty,sc=ge.unstable_scheduleCallback,Ou=ge.unstable_cancelCallback,s1=ge.unstable_shouldYield,r1=ge.unstable_requestPaint,Ke=ge.unstable_now,u1=ge.unstable_getCurrentPriorityLevel,ih=ge.unstable_ImmediatePriority,nh=ge.unstable_UserBlockingPriority,tr=ge.unstable_NormalPriority,o1=ge.unstable_LowPriority,sh=ge.unstable_IdlePriority,c1=ge.log,f1=ge.unstable_setDisableYieldValue,Hn=null,Je=null;function Ca(e){if(typeof c1=="function"&&f1(e),Je&&typeof Je.setStrictMode=="function")try{Je.setStrictMode(Hn,e)}catch{}}var ke=Math.clz32?Math.clz32:h1,d1=Math.log,m1=Math.LN2;function h1(e){return e>>>=0,e===0?32:31-(d1(e)/m1|0)|0}var Ms=256,Ss=262144,xs=4194304;function ll(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function Ar(e,t,a){var l=e.pendingLanes;if(l===0)return 0;var i=0,n=e.suspendedLanes,s=e.pingedLanes;e=e.warmLanes;var r=l&134217727;return r!==0?(l=r&~n,l!==0?i=ll(l):(s&=r,s!==0?i=ll(s):a||(a=r&~e,a!==0&&(i=ll(a))))):(r=l&~n,r!==0?i=ll(r):s!==0?i=ll(s):a||(a=l&~e,a!==0&&(i=ll(a)))),i===0?0:t!==0&&t!==i&&(t&n)===0&&(n=i&-i,a=t&-t,n>=a||n===32&&(a&4194048)!==0)?t:i}function Un(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function p1(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function rh(){var e=xs;return xs<<=1,(xs&62914560)===0&&(xs=4194304),e}function wu(e){for(var t=[],a=0;31>a;a++)t.push(e);return t}function Bn(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function y1(e,t,a,l,i,n){var s=e.pendingLanes;e.pendingLanes=a,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=a,e.entangledLanes&=a,e.errorRecoveryDisabledLanes&=a,e.shellSuspendCounter=0;var r=e.entanglements,u=e.expirationTimes,c=e.hiddenUpdates;for(a=s&~a;0<a;){var f=31-ke(a),y=1<<f;r[f]=0,u[f]=-1;var m=c[f];if(m!==null)for(c[f]=null,f=0;f<m.length;f++){var p=m[f];p!==null&&(p.lane&=-536870913)}a&=~y}l!==0&&uh(e,l,0),n!==0&&i===0&&e.tag!==0&&(e.suspendedLanes|=n&~(s&~t))}function uh(e,t,a){e.pendingLanes|=t,e.suspendedLanes&=~t;var l=31-ke(t);e.entangledLanes|=t,e.entanglements[l]=e.entanglements[l]|1073741824|a&261930}function oh(e,t){var a=e.entangledLanes|=t;for(e=e.entanglements;a;){var l=31-ke(a),i=1<<l;i&t|e[l]&t&&(e[l]|=t),a&=~i}}function ch(e,t){var a=t&-t;return a=(a&42)!==0?1:rc(a),(a&(e.suspendedLanes|t))!==0?0:a}function rc(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function uc(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function fh(){var e=Z.p;return e!==0?e:(e=window.event,e===void 0?32:Ny(e.type))}function _d(e,t){var a=Z.p;try{return Z.p=e,t()}finally{Z.p=a}}var Va=Math.random().toString(36).slice(2),Ge="__reactFiber$"+Va,Ye="__reactProps$"+Va,bi="__reactContainer$"+Va,go="__reactEvents$"+Va,g1="__reactListeners$"+Va,v1="__reactHandles$"+Va,Dd="__reactResources$"+Va,Ln="__reactMarker$"+Va;function oc(e){delete e[Ge],delete e[Ye],delete e[go],delete e[g1],delete e[v1]}function Ql(e){var t=e[Ge];if(t)return t;for(var a=e.parentNode;a;){if(t=a[bi]||a[Ge]){if(a=t.alternate,t.child!==null||a!==null&&a.child!==null)for(e=Ym(e);e!==null;){if(a=e[Ge])return a;e=Ym(e)}return t}e=a,a=e.parentNode}return null}function Mi(e){if(e=e[Ge]||e[bi]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function ln(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(v(33))}function ti(e){var t=e[Dd];return t||(t=e[Dd]={hoistableStyles:new Map,hoistableScripts:new Map}),t}function Se(e){e[Ln]=!0}var dh=new Set,mh={};function yl(e,t){oi(e,t),oi(e+"Capture",t)}function oi(e,t){for(mh[e]=t,e=0;e<t.length;e++)dh.add(t[e])}var b1=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),Od={},wd={};function M1(e){return yo.call(wd,e)?!0:yo.call(Od,e)?!1:b1.test(e)?wd[e]=!0:(Od[e]=!0,!1)}function Bs(e,t,a){if(M1(t))if(a===null)e.removeAttribute(t);else{switch(typeof a){case"undefined":case"function":case"symbol":e.removeAttribute(t);return;case"boolean":var l=t.toLowerCase().slice(0,5);if(l!=="data-"&&l!=="aria-"){e.removeAttribute(t);return}}e.setAttribute(t,""+a)}}function Es(e,t,a){if(a===null)e.removeAttribute(t);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(t);return}e.setAttribute(t,""+a)}}function Zt(e,t,a,l){if(l===null)e.removeAttribute(a);else{switch(typeof l){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(a);return}e.setAttributeNS(t,a,""+l)}}function rt(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function hh(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function S1(e,t,a){var l=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&typeof l<"u"&&typeof l.get=="function"&&typeof l.set=="function"){var i=l.get,n=l.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return i.call(this)},set:function(s){a=""+s,n.call(this,s)}}),Object.defineProperty(e,t,{enumerable:l.enumerable}),{getValue:function(){return a},setValue:function(s){a=""+s},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function vo(e){if(!e._valueTracker){var t=hh(e)?"checked":"value";e._valueTracker=S1(e,t,""+e[t])}}function ph(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var a=t.getValue(),l="";return e&&(l=hh(e)?e.checked?"true":"false":e.value),e=l,e!==a?(t.setValue(e),!0):!1}function ar(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}var x1=/[\n"\\]/g;function ct(e){return e.replace(x1,function(t){return"\\"+t.charCodeAt(0).toString(16)+" "})}function bo(e,t,a,l,i,n,s,r){e.name="",s!=null&&typeof s!="function"&&typeof s!="symbol"&&typeof s!="boolean"?e.type=s:e.removeAttribute("type"),t!=null?s==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+rt(t)):e.value!==""+rt(t)&&(e.value=""+rt(t)):s!=="submit"&&s!=="reset"||e.removeAttribute("value"),t!=null?Mo(e,s,rt(t)):a!=null?Mo(e,s,rt(a)):l!=null&&e.removeAttribute("value"),i==null&&n!=null&&(e.defaultChecked=!!n),i!=null&&(e.checked=i&&typeof i!="function"&&typeof i!="symbol"),r!=null&&typeof r!="function"&&typeof r!="symbol"&&typeof r!="boolean"?e.name=""+rt(r):e.removeAttribute("name")}function yh(e,t,a,l,i,n,s,r){if(n!=null&&typeof n!="function"&&typeof n!="symbol"&&typeof n!="boolean"&&(e.type=n),t!=null||a!=null){if(!(n!=="submit"&&n!=="reset"||t!=null)){vo(e);return}a=a!=null?""+rt(a):"",t=t!=null?""+rt(t):a,r||t===e.value||(e.value=t),e.defaultValue=t}l=l??i,l=typeof l!="function"&&typeof l!="symbol"&&!!l,e.checked=r?e.checked:!!l,e.defaultChecked=!!l,s!=null&&typeof s!="function"&&typeof s!="symbol"&&typeof s!="boolean"&&(e.name=s),vo(e)}function Mo(e,t,a){t==="number"&&ar(e.ownerDocument)===e||e.defaultValue===""+a||(e.defaultValue=""+a)}function ai(e,t,a,l){if(e=e.options,t){t={};for(var i=0;i<a.length;i++)t["$"+a[i]]=!0;for(a=0;a<e.length;a++)i=t.hasOwnProperty("$"+e[a].value),e[a].selected!==i&&(e[a].selected=i),i&&l&&(e[a].defaultSelected=!0)}else{for(a=""+rt(a),t=null,i=0;i<e.length;i++){if(e[i].value===a){e[i].selected=!0,l&&(e[i].defaultSelected=!0);return}t!==null||e[i].disabled||(t=e[i])}t!==null&&(t.selected=!0)}}function gh(e,t,a){if(t!=null&&(t=""+rt(t),t!==e.value&&(e.value=t),a==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=a!=null?""+rt(a):""}function vh(e,t,a,l){if(t==null){if(l!=null){if(a!=null)throw Error(v(92));if(an(l)){if(1<l.length)throw Error(v(93));l=l[0]}a=l}a==null&&(a=""),t=a}a=rt(t),e.defaultValue=a,l=e.textContent,l===a&&l!==""&&l!==null&&(e.value=l),vo(e)}function ci(e,t){if(t){var a=e.firstChild;if(a&&a===e.lastChild&&a.nodeType===3){a.nodeValue=t;return}}e.textContent=t}var E1=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function Nd(e,t,a){var l=t.indexOf("--")===0;a==null||typeof a=="boolean"||a===""?l?e.setProperty(t,""):t==="float"?e.cssFloat="":e[t]="":l?e.setProperty(t,a):typeof a!="number"||a===0||E1.has(t)?t==="float"?e.cssFloat=a:e[t]=(""+a).trim():e[t]=a+"px"}function bh(e,t,a){if(t!=null&&typeof t!="object")throw Error(v(62));if(e=e.style,a!=null){for(var l in a)!a.hasOwnProperty(l)||t!=null&&t.hasOwnProperty(l)||(l.indexOf("--")===0?e.setProperty(l,""):l==="float"?e.cssFloat="":e[l]="");for(var i in t)l=t[i],t.hasOwnProperty(i)&&a[i]!==l&&Nd(e,i,l)}else for(var n in t)t.hasOwnProperty(n)&&Nd(e,n,t[n])}function cc(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var T1=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),G1=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Ls(e){return G1.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function Wt(){}var So=null;function fc(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Pl=null,li=null;function Hd(e){var t=Mi(e);if(t&&(e=t.stateNode)){var a=e[Ye]||null;e:switch(e=t.stateNode,t.type){case"input":if(bo(e,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name),t=a.name,a.type==="radio"&&t!=null){for(a=e;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll('input[name="'+ct(""+t)+'"][type="radio"]'),t=0;t<a.length;t++){var l=a[t];if(l!==e&&l.form===e.form){var i=l[Ye]||null;if(!i)throw Error(v(90));bo(l,i.value,i.defaultValue,i.defaultValue,i.checked,i.defaultChecked,i.type,i.name)}}for(t=0;t<a.length;t++)l=a[t],l.form===e.form&&ph(l)}break e;case"textarea":gh(e,a.value,a.defaultValue);break e;case"select":t=a.value,t!=null&&ai(e,!!a.multiple,t,!1)}}}var Nu=!1;function Mh(e,t,a){if(Nu)return e(t,a);Nu=!0;try{var l=e(t);return l}finally{if(Nu=!1,(Pl!==null||li!==null)&&(Yr(),Pl&&(t=Pl,e=li,li=Pl=null,Hd(t),e)))for(t=0;t<e.length;t++)Hd(e[t])}}function Sn(e,t){var a=e.stateNode;if(a===null)return null;var l=a[Ye]||null;if(l===null)return null;a=l[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(l=!l.disabled)||(e=e.type,l=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!l;break e;default:e=!1}if(e)return null;if(a&&typeof a!="function")throw Error(v(231,t,typeof a));return a}var aa=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),xo=!1;if(aa)try{Ll={},Object.defineProperty(Ll,"passive",{get:function(){xo=!0}}),window.addEventListener("test",Ll,Ll),window.removeEventListener("test",Ll,Ll)}catch{xo=!1}var Ll,Aa=null,dc=null,Ys=null;function Sh(){if(Ys)return Ys;var e,t=dc,a=t.length,l,i="value"in Aa?Aa.value:Aa.textContent,n=i.length;for(e=0;e<a&&t[e]===i[e];e++);var s=a-e;for(l=1;l<=s&&t[a-l]===i[n-l];l++);return Ys=i.slice(e,1<l?1-l:void 0)}function qs(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Ts(){return!0}function Ud(){return!1}function qe(e){function t(a,l,i,n,s){this._reactName=a,this._targetInst=i,this.type=l,this.nativeEvent=n,this.target=s,this.currentTarget=null;for(var r in e)e.hasOwnProperty(r)&&(a=e[r],this[r]=a?a(n):n[r]);return this.isDefaultPrevented=(n.defaultPrevented!=null?n.defaultPrevented:n.returnValue===!1)?Ts:Ud,this.isPropagationStopped=Ud,this}return te(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=Ts)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=Ts)},persist:function(){},isPersistent:Ts}),t}var gl={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},zr=qe(gl),Yn=te({},gl,{view:0,detail:0}),C1=qe(Yn),Hu,Uu,Ji,Rr=te({},Yn,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:mc,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Ji&&(Ji&&e.type==="mousemove"?(Hu=e.screenX-Ji.screenX,Uu=e.screenY-Ji.screenY):Uu=Hu=0,Ji=e),Hu)},movementY:function(e){return"movementY"in e?e.movementY:Uu}}),Bd=qe(Rr),A1=te({},Rr,{dataTransfer:0}),z1=qe(A1),R1=te({},Yn,{relatedTarget:0}),Bu=qe(R1),_1=te({},gl,{animationName:0,elapsedTime:0,pseudoElement:0}),D1=qe(_1),O1=te({},gl,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),w1=qe(O1),N1=te({},gl,{data:0}),Ld=qe(N1),H1={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},U1={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},B1={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function L1(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=B1[e])?!!t[e]:!1}function mc(){return L1}var Y1=te({},Yn,{key:function(e){if(e.key){var t=H1[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=qs(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?U1[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:mc,charCode:function(e){return e.type==="keypress"?qs(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?qs(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),q1=qe(Y1),X1=te({},Rr,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Yd=qe(X1),j1=te({},Yn,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:mc}),Z1=qe(j1),V1=te({},gl,{propertyName:0,elapsedTime:0,pseudoElement:0}),Q1=qe(V1),P1=te({},Rr,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),F1=qe(P1),K1=te({},gl,{newState:0,oldState:0}),J1=qe(K1),k1=[9,13,27,32],hc=aa&&"CompositionEvent"in window,rn=null;aa&&"documentMode"in document&&(rn=document.documentMode);var W1=aa&&"TextEvent"in window&&!rn,xh=aa&&(!hc||rn&&8<rn&&11>=rn),qd=" ",Xd=!1;function Eh(e,t){switch(e){case"keyup":return k1.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Th(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Fl=!1;function I1(e,t){switch(e){case"compositionend":return Th(t);case"keypress":return t.which!==32?null:(Xd=!0,qd);case"textInput":return e=t.data,e===qd&&Xd?null:e;default:return null}}function $1(e,t){if(Fl)return e==="compositionend"||!hc&&Eh(e,t)?(e=Sh(),Ys=dc=Aa=null,Fl=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return xh&&t.locale!=="ko"?null:t.data;default:return null}}var ev={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function jd(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!ev[e.type]:t==="textarea"}function Gh(e,t,a,l){Pl?li?li.push(l):li=[l]:Pl=l,t=Mr(t,"onChange"),0<t.length&&(a=new zr("onChange","change",null,a,l),e.push({event:a,listeners:t}))}var un=null,xn=null;function tv(e){My(e,0)}function _r(e){var t=ln(e);if(ph(t))return e}function Zd(e,t){if(e==="change")return t}var Ch=!1;aa&&(aa?(Cs="oninput"in document,Cs||(Lu=document.createElement("div"),Lu.setAttribute("oninput","return;"),Cs=typeof Lu.oninput=="function"),Gs=Cs):Gs=!1,Ch=Gs&&(!document.documentMode||9<document.documentMode));var Gs,Cs,Lu;function Vd(){un&&(un.detachEvent("onpropertychange",Ah),xn=un=null)}function Ah(e){if(e.propertyName==="value"&&_r(xn)){var t=[];Gh(t,xn,e,fc(e)),Mh(tv,t)}}function av(e,t,a){e==="focusin"?(Vd(),un=t,xn=a,un.attachEvent("onpropertychange",Ah)):e==="focusout"&&Vd()}function lv(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return _r(xn)}function iv(e,t){if(e==="click")return _r(t)}function nv(e,t){if(e==="input"||e==="change")return _r(t)}function sv(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Ie=typeof Object.is=="function"?Object.is:sv;function En(e,t){if(Ie(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var a=Object.keys(e),l=Object.keys(t);if(a.length!==l.length)return!1;for(l=0;l<a.length;l++){var i=a[l];if(!yo.call(t,i)||!Ie(e[i],t[i]))return!1}return!0}function Qd(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Pd(e,t){var a=Qd(e);e=0;for(var l;a;){if(a.nodeType===3){if(l=e+a.textContent.length,e<=t&&l>=t)return{node:a,offset:t-e};e=l}e:{for(;a;){if(a.nextSibling){a=a.nextSibling;break e}a=a.parentNode}a=void 0}a=Qd(a)}}function zh(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?zh(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Rh(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=ar(e.document);t instanceof e.HTMLIFrameElement;){try{var a=typeof t.contentWindow.location.href=="string"}catch{a=!1}if(a)e=t.contentWindow;else break;t=ar(e.document)}return t}function pc(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}var rv=aa&&"documentMode"in document&&11>=document.documentMode,Kl=null,Eo=null,on=null,To=!1;function Fd(e,t,a){var l=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;To||Kl==null||Kl!==ar(l)||(l=Kl,"selectionStart"in l&&pc(l)?l={start:l.selectionStart,end:l.selectionEnd}:(l=(l.ownerDocument&&l.ownerDocument.defaultView||window).getSelection(),l={anchorNode:l.anchorNode,anchorOffset:l.anchorOffset,focusNode:l.focusNode,focusOffset:l.focusOffset}),on&&En(on,l)||(on=l,l=Mr(Eo,"onSelect"),0<l.length&&(t=new zr("onSelect","select",null,t,a),e.push({event:t,listeners:l}),t.target=Kl)))}function tl(e,t){var a={};return a[e.toLowerCase()]=t.toLowerCase(),a["Webkit"+e]="webkit"+t,a["Moz"+e]="moz"+t,a}var Jl={animationend:tl("Animation","AnimationEnd"),animationiteration:tl("Animation","AnimationIteration"),animationstart:tl("Animation","AnimationStart"),transitionrun:tl("Transition","TransitionRun"),transitionstart:tl("Transition","TransitionStart"),transitioncancel:tl("Transition","TransitionCancel"),transitionend:tl("Transition","TransitionEnd")},Yu={},_h={};aa&&(_h=document.createElement("div").style,"AnimationEvent"in window||(delete Jl.animationend.animation,delete Jl.animationiteration.animation,delete Jl.animationstart.animation),"TransitionEvent"in window||delete Jl.transitionend.transition);function vl(e){if(Yu[e])return Yu[e];if(!Jl[e])return e;var t=Jl[e],a;for(a in t)if(t.hasOwnProperty(a)&&a in _h)return Yu[e]=t[a];return e}var Dh=vl("animationend"),Oh=vl("animationiteration"),wh=vl("animationstart"),uv=vl("transitionrun"),ov=vl("transitionstart"),cv=vl("transitioncancel"),Nh=vl("transitionend"),Hh=new Map,Go="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");Go.push("scrollEnd");function bt(e,t){Hh.set(e,t),yl(t,[e])}var lr=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},st=[],kl=0,yc=0;function Dr(){for(var e=kl,t=yc=kl=0;t<e;){var a=st[t];st[t++]=null;var l=st[t];st[t++]=null;var i=st[t];st[t++]=null;var n=st[t];if(st[t++]=null,l!==null&&i!==null){var s=l.pending;s===null?i.next=i:(i.next=s.next,s.next=i),l.pending=i}n!==0&&Uh(a,i,n)}}function Or(e,t,a,l){st[kl++]=e,st[kl++]=t,st[kl++]=a,st[kl++]=l,yc|=l,e.lanes|=l,e=e.alternate,e!==null&&(e.lanes|=l)}function gc(e,t,a,l){return Or(e,t,a,l),ir(e)}function bl(e,t){return Or(e,null,null,t),ir(e)}function Uh(e,t,a){e.lanes|=a;var l=e.alternate;l!==null&&(l.lanes|=a);for(var i=!1,n=e.return;n!==null;)n.childLanes|=a,l=n.alternate,l!==null&&(l.childLanes|=a),n.tag===22&&(e=n.stateNode,e===null||e._visibility&1||(i=!0)),e=n,n=n.return;return e.tag===3?(n=e.stateNode,i&&t!==null&&(i=31-ke(a),e=n.hiddenUpdates,l=e[i],l===null?e[i]=[t]:l.push(t),t.lane=a|536870912),n):null}function ir(e){if(50<vn)throw vn=0,Po=null,Error(v(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var Wl={};function fv(e,t,a,l){this.tag=e,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=l,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Pe(e,t,a,l){return new fv(e,t,a,l)}function vc(e){return e=e.prototype,!(!e||!e.isReactComponent)}function $t(e,t){var a=e.alternate;return a===null?(a=Pe(e.tag,t,e.key,e.mode),a.elementType=e.elementType,a.type=e.type,a.stateNode=e.stateNode,a.alternate=e,e.alternate=a):(a.pendingProps=t,a.type=e.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=e.flags&65011712,a.childLanes=e.childLanes,a.lanes=e.lanes,a.child=e.child,a.memoizedProps=e.memoizedProps,a.memoizedState=e.memoizedState,a.updateQueue=e.updateQueue,t=e.dependencies,a.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},a.sibling=e.sibling,a.index=e.index,a.ref=e.ref,a.refCleanup=e.refCleanup,a}function Bh(e,t){e.flags&=65011714;var a=e.alternate;return a===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=a.childLanes,e.lanes=a.lanes,e.child=a.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=a.memoizedProps,e.memoizedState=a.memoizedState,e.updateQueue=a.updateQueue,e.type=a.type,t=a.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function Xs(e,t,a,l,i,n){var s=0;if(l=e,typeof e=="function")vc(e)&&(s=1);else if(typeof e=="string")s=hb(e,a,_t.current)?26:e==="html"||e==="head"||e==="body"?27:5;else e:switch(e){case fo:return e=Pe(31,a,t,i),e.elementType=fo,e.lanes=n,e;case Zl:return rl(a.children,i,n,t);case ah:s=8,i|=24;break;case uo:return e=Pe(12,a,t,i|2),e.elementType=uo,e.lanes=n,e;case oo:return e=Pe(13,a,t,i),e.elementType=oo,e.lanes=n,e;case co:return e=Pe(19,a,t,i),e.elementType=co,e.lanes=n,e;default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case kt:s=10;break e;case lh:s=9;break e;case ic:s=11;break e;case nc:s=14;break e;case Ma:s=16,l=null;break e}s=29,a=Error(v(130,e===null?"null":typeof e,"")),l=null}return t=Pe(s,a,t,i),t.elementType=e,t.type=l,t.lanes=n,t}function rl(e,t,a,l){return e=Pe(7,e,l,t),e.lanes=a,e}function qu(e,t,a){return e=Pe(6,e,null,t),e.lanes=a,e}function Lh(e){var t=Pe(18,null,null,0);return t.stateNode=e,t}function Xu(e,t,a){return t=Pe(4,e.children!==null?e.children:[],e.key,t),t.lanes=a,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var Kd=new WeakMap;function ft(e,t){if(typeof e=="object"&&e!==null){var a=Kd.get(e);return a!==void 0?a:(t={value:e,source:t,stack:Rd(t)},Kd.set(e,t),t)}return{value:e,source:t,stack:Rd(t)}}var Il=[],$l=0,nr=null,Tn=0,ut=[],ot=0,qa=null,At=1,zt="";function Kt(e,t){Il[$l++]=Tn,Il[$l++]=nr,nr=e,Tn=t}function Yh(e,t,a){ut[ot++]=At,ut[ot++]=zt,ut[ot++]=qa,qa=e;var l=At;e=zt;var i=32-ke(l)-1;l&=~(1<<i),a+=1;var n=32-ke(t)+i;if(30<n){var s=i-i%5;n=(l&(1<<s)-1).toString(32),l>>=s,i-=s,At=1<<32-ke(t)+i|a<<i|l,zt=n+e}else At=1<<n|a<<i|l,zt=e}function bc(e){e.return!==null&&(Kt(e,1),Yh(e,1,0))}function Mc(e){for(;e===nr;)nr=Il[--$l],Il[$l]=null,Tn=Il[--$l],Il[$l]=null;for(;e===qa;)qa=ut[--ot],ut[ot]=null,zt=ut[--ot],ut[ot]=null,At=ut[--ot],ut[ot]=null}function qh(e,t){ut[ot++]=At,ut[ot++]=zt,ut[ot++]=qa,At=t.id,zt=t.overflow,qa=e}var Ce=null,ee=null,X=!1,Oa=null,dt=!1,Co=Error(v(519));function Xa(e){var t=Error(v(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw Gn(ft(t,e)),Co}function Jd(e){var t=e.stateNode,a=e.type,l=e.memoizedProps;switch(t[Ge]=e,t[Ye]=l,a){case"dialog":B("cancel",t),B("close",t);break;case"iframe":case"object":case"embed":B("load",t);break;case"video":case"audio":for(a=0;a<Rn.length;a++)B(Rn[a],t);break;case"source":B("error",t);break;case"img":case"image":case"link":B("error",t),B("load",t);break;case"details":B("toggle",t);break;case"input":B("invalid",t),yh(t,l.value,l.defaultValue,l.checked,l.defaultChecked,l.type,l.name,!0);break;case"select":B("invalid",t);break;case"textarea":B("invalid",t),vh(t,l.value,l.defaultValue,l.children)}a=l.children,typeof a!="string"&&typeof a!="number"&&typeof a!="bigint"||t.textContent===""+a||l.suppressHydrationWarning===!0||xy(t.textContent,a)?(l.popover!=null&&(B("beforetoggle",t),B("toggle",t)),l.onScroll!=null&&B("scroll",t),l.onScrollEnd!=null&&B("scrollend",t),l.onClick!=null&&(t.onclick=Wt),t=!0):t=!1,t||Xa(e,!0)}function kd(e){for(Ce=e.return;Ce;)switch(Ce.tag){case 5:case 31:case 13:dt=!1;return;case 27:case 3:dt=!0;return;default:Ce=Ce.return}}function Yl(e){if(e!==Ce)return!1;if(!X)return kd(e),X=!0,!1;var t=e.tag,a;if((a=t!==3&&t!==27)&&((a=t===5)&&(a=e.type,a=!(a!=="form"&&a!=="button")||Wo(e.type,e.memoizedProps)),a=!a),a&&ee&&Xa(e),kd(e),t===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(v(317));ee=Lm(e)}else if(t===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(v(317));ee=Lm(e)}else t===27?(t=ee,Qa(e.type)?(e=tc,tc=null,ee=e):ee=t):ee=Ce?ht(e.stateNode.nextSibling):null;return!0}function fl(){ee=Ce=null,X=!1}function ju(){var e=Oa;return e!==null&&(Be===null?Be=e:Be.push.apply(Be,e),Oa=null),e}function Gn(e){Oa===null?Oa=[e]:Oa.push(e)}var Ao=Dt(null),Ml=null,It=null;function xa(e,t,a){k(Ao,t._currentValue),t._currentValue=a}function ea(e){e._currentValue=Ao.current,xe(Ao)}function zo(e,t,a){for(;e!==null;){var l=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,l!==null&&(l.childLanes|=t)):l!==null&&(l.childLanes&t)!==t&&(l.childLanes|=t),e===a)break;e=e.return}}function Ro(e,t,a,l){var i=e.child;for(i!==null&&(i.return=e);i!==null;){var n=i.dependencies;if(n!==null){var s=i.child;n=n.firstContext;e:for(;n!==null;){var r=n;n=i;for(var u=0;u<t.length;u++)if(r.context===t[u]){n.lanes|=a,r=n.alternate,r!==null&&(r.lanes|=a),zo(n.return,a,e),l||(s=null);break e}n=r.next}}else if(i.tag===18){if(s=i.return,s===null)throw Error(v(341));s.lanes|=a,n=s.alternate,n!==null&&(n.lanes|=a),zo(s,a,e),s=null}else s=i.child;if(s!==null)s.return=i;else for(s=i;s!==null;){if(s===e){s=null;break}if(i=s.sibling,i!==null){i.return=s.return,s=i;break}s=s.return}i=s}}function Si(e,t,a,l){e=null;for(var i=t,n=!1;i!==null;){if(!n){if((i.flags&524288)!==0)n=!0;else if((i.flags&262144)!==0)break}if(i.tag===10){var s=i.alternate;if(s===null)throw Error(v(387));if(s=s.memoizedProps,s!==null){var r=i.type;Ie(i.pendingProps.value,s.value)||(e!==null?e.push(r):e=[r])}}else if(i===Is.current){if(s=i.alternate,s===null)throw Error(v(387));s.memoizedState.memoizedState!==i.memoizedState.memoizedState&&(e!==null?e.push(Dn):e=[Dn])}i=i.return}e!==null&&Ro(t,e,a,l),t.flags|=262144}function sr(e){for(e=e.firstContext;e!==null;){if(!Ie(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function dl(e){Ml=e,It=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function Ae(e){return Xh(Ml,e)}function As(e,t){return Ml===null&&dl(e),Xh(e,t)}function Xh(e,t){var a=t._currentValue;if(t={context:t,memoizedValue:a,next:null},It===null){if(e===null)throw Error(v(308));It=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else It=It.next=t;return a}var dv=typeof AbortController<"u"?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(a,l){e.push(l)}};this.abort=function(){t.aborted=!0,e.forEach(function(a){return a()})}},mv=ge.unstable_scheduleCallback,hv=ge.unstable_NormalPriority,me={$$typeof:kt,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Sc(){return{controller:new dv,data:new Map,refCount:0}}function qn(e){e.refCount--,e.refCount===0&&mv(hv,function(){e.controller.abort()})}var cn=null,_o=0,fi=0,ii=null;function pv(e,t){if(cn===null){var a=cn=[];_o=0,fi=Pc(),ii={status:"pending",value:void 0,then:function(l){a.push(l)}}}return _o++,t.then(Wd,Wd),t}function Wd(){if(--_o===0&&cn!==null){ii!==null&&(ii.status="fulfilled");var e=cn;cn=null,fi=0,ii=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function yv(e,t){var a=[],l={status:"pending",value:null,reason:null,then:function(i){a.push(i)}};return e.then(function(){l.status="fulfilled",l.value=t;for(var i=0;i<a.length;i++)(0,a[i])(t)},function(i){for(l.status="rejected",l.reason=i,i=0;i<a.length;i++)(0,a[i])(void 0)}),l}var Id=R.S;R.S=function(e,t){ty=Ke(),typeof t=="object"&&t!==null&&typeof t.then=="function"&&pv(e,t),Id!==null&&Id(e,t)};var ul=Dt(null);function xc(){var e=ul.current;return e!==null?e:K.pooledCache}function js(e,t){t===null?k(ul,ul.current):k(ul,t.pool)}function jh(){var e=xc();return e===null?null:{parent:me._currentValue,pool:e}}var xi=Error(v(460)),Ec=Error(v(474)),wr=Error(v(542)),rr={then:function(){}};function $d(e){return e=e.status,e==="fulfilled"||e==="rejected"}function Zh(e,t,a){switch(a=e[a],a===void 0?e.push(t):a!==t&&(t.then(Wt,Wt),t=a),t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,tm(e),e;default:if(typeof t.status=="string")t.then(Wt,Wt);else{if(e=K,e!==null&&100<e.shellSuspendCounter)throw Error(v(482));e=t,e.status="pending",e.then(function(l){if(t.status==="pending"){var i=t;i.status="fulfilled",i.value=l}},function(l){if(t.status==="pending"){var i=t;i.status="rejected",i.reason=l}})}switch(t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,tm(e),e}throw ol=t,xi}}function il(e){try{var t=e._init;return t(e._payload)}catch(a){throw a!==null&&typeof a=="object"&&typeof a.then=="function"?(ol=a,xi):a}}var ol=null;function em(){if(ol===null)throw Error(v(459));var e=ol;return ol=null,e}function tm(e){if(e===xi||e===wr)throw Error(v(483))}var ni=null,Cn=0;function zs(e){var t=Cn;return Cn+=1,ni===null&&(ni=[]),Zh(ni,e,t)}function ki(e,t){t=t.props.ref,e.ref=t!==void 0?t:null}function Rs(e,t){throw t.$$typeof===a1?Error(v(525)):(e=Object.prototype.toString.call(t),Error(v(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)))}function Vh(e){function t(d,o){if(e){var h=d.deletions;h===null?(d.deletions=[o],d.flags|=16):h.push(o)}}function a(d,o){if(!e)return null;for(;o!==null;)t(d,o),o=o.sibling;return null}function l(d){for(var o=new Map;d!==null;)d.key!==null?o.set(d.key,d):o.set(d.index,d),d=d.sibling;return o}function i(d,o){return d=$t(d,o),d.index=0,d.sibling=null,d}function n(d,o,h){return d.index=h,e?(h=d.alternate,h!==null?(h=h.index,h<o?(d.flags|=67108866,o):h):(d.flags|=67108866,o)):(d.flags|=1048576,o)}function s(d){return e&&d.alternate===null&&(d.flags|=67108866),d}function r(d,o,h,g){return o===null||o.tag!==6?(o=qu(h,d.mode,g),o.return=d,o):(o=i(o,h),o.return=d,o)}function u(d,o,h,g){var A=h.type;return A===Zl?f(d,o,h.props.children,g,h.key):o!==null&&(o.elementType===A||typeof A=="object"&&A!==null&&A.$$typeof===Ma&&il(A)===o.type)?(o=i(o,h.props),ki(o,h),o.return=d,o):(o=Xs(h.type,h.key,h.props,null,d.mode,g),ki(o,h),o.return=d,o)}function c(d,o,h,g){return o===null||o.tag!==4||o.stateNode.containerInfo!==h.containerInfo||o.stateNode.implementation!==h.implementation?(o=Xu(h,d.mode,g),o.return=d,o):(o=i(o,h.children||[]),o.return=d,o)}function f(d,o,h,g,A){return o===null||o.tag!==7?(o=rl(h,d.mode,g,A),o.return=d,o):(o=i(o,h),o.return=d,o)}function y(d,o,h){if(typeof o=="string"&&o!==""||typeof o=="number"||typeof o=="bigint")return o=qu(""+o,d.mode,h),o.return=d,o;if(typeof o=="object"&&o!==null){switch(o.$$typeof){case bs:return h=Xs(o.type,o.key,o.props,null,d.mode,h),ki(h,o),h.return=d,h;case tn:return o=Xu(o,d.mode,h),o.return=d,o;case Ma:return o=il(o),y(d,o,h)}if(an(o)||Ki(o))return o=rl(o,d.mode,h,null),o.return=d,o;if(typeof o.then=="function")return y(d,zs(o),h);if(o.$$typeof===kt)return y(d,As(d,o),h);Rs(d,o)}return null}function m(d,o,h,g){var A=o!==null?o.key:null;if(typeof h=="string"&&h!==""||typeof h=="number"||typeof h=="bigint")return A!==null?null:r(d,o,""+h,g);if(typeof h=="object"&&h!==null){switch(h.$$typeof){case bs:return h.key===A?u(d,o,h,g):null;case tn:return h.key===A?c(d,o,h,g):null;case Ma:return h=il(h),m(d,o,h,g)}if(an(h)||Ki(h))return A!==null?null:f(d,o,h,g,null);if(typeof h.then=="function")return m(d,o,zs(h),g);if(h.$$typeof===kt)return m(d,o,As(d,h),g);Rs(d,h)}return null}function p(d,o,h,g,A){if(typeof g=="string"&&g!==""||typeof g=="number"||typeof g=="bigint")return d=d.get(h)||null,r(o,d,""+g,A);if(typeof g=="object"&&g!==null){switch(g.$$typeof){case bs:return d=d.get(g.key===null?h:g.key)||null,u(o,d,g,A);case tn:return d=d.get(g.key===null?h:g.key)||null,c(o,d,g,A);case Ma:return g=il(g),p(d,o,h,g,A)}if(an(g)||Ki(g))return d=d.get(h)||null,f(o,d,g,A,null);if(typeof g.then=="function")return p(d,o,h,zs(g),A);if(g.$$typeof===kt)return p(d,o,h,As(o,g),A);Rs(o,g)}return null}function M(d,o,h,g){for(var A=null,H=null,T=o,D=o=0,b=null;T!==null&&D<h.length;D++){T.index>D?(b=T,T=null):b=T.sibling;var _=m(d,T,h[D],g);if(_===null){T===null&&(T=b);break}e&&T&&_.alternate===null&&t(d,T),o=n(_,o,D),H===null?A=_:H.sibling=_,H=_,T=b}if(D===h.length)return a(d,T),X&&Kt(d,D),A;if(T===null){for(;D<h.length;D++)T=y(d,h[D],g),T!==null&&(o=n(T,o,D),H===null?A=T:H.sibling=T,H=T);return X&&Kt(d,D),A}for(T=l(T);D<h.length;D++)b=p(T,d,D,h[D],g),b!==null&&(e&&b.alternate!==null&&T.delete(b.key===null?D:b.key),o=n(b,o,D),H===null?A=b:H.sibling=b,H=b);return e&&T.forEach(function(be){return t(d,be)}),X&&Kt(d,D),A}function x(d,o,h,g){if(h==null)throw Error(v(151));for(var A=null,H=null,T=o,D=o=0,b=null,_=h.next();T!==null&&!_.done;D++,_=h.next()){T.index>D?(b=T,T=null):b=T.sibling;var be=m(d,T,_.value,g);if(be===null){T===null&&(T=b);break}e&&T&&be.alternate===null&&t(d,T),o=n(be,o,D),H===null?A=be:H.sibling=be,H=be,T=b}if(_.done)return a(d,T),X&&Kt(d,D),A;if(T===null){for(;!_.done;D++,_=h.next())_=y(d,_.value,g),_!==null&&(o=n(_,o,D),H===null?A=_:H.sibling=_,H=_);return X&&Kt(d,D),A}for(T=l(T);!_.done;D++,_=h.next())_=p(T,d,D,_.value,g),_!==null&&(e&&_.alternate!==null&&T.delete(_.key===null?D:_.key),o=n(_,o,D),H===null?A=_:H.sibling=_,H=_);return e&&T.forEach(function(Ol){return t(d,Ol)}),X&&Kt(d,D),A}function N(d,o,h,g){if(typeof h=="object"&&h!==null&&h.type===Zl&&h.key===null&&(h=h.props.children),typeof h=="object"&&h!==null){switch(h.$$typeof){case bs:e:{for(var A=h.key;o!==null;){if(o.key===A){if(A=h.type,A===Zl){if(o.tag===7){a(d,o.sibling),g=i(o,h.props.children),g.return=d,d=g;break e}}else if(o.elementType===A||typeof A=="object"&&A!==null&&A.$$typeof===Ma&&il(A)===o.type){a(d,o.sibling),g=i(o,h.props),ki(g,h),g.return=d,d=g;break e}a(d,o);break}else t(d,o);o=o.sibling}h.type===Zl?(g=rl(h.props.children,d.mode,g,h.key),g.return=d,d=g):(g=Xs(h.type,h.key,h.props,null,d.mode,g),ki(g,h),g.return=d,d=g)}return s(d);case tn:e:{for(A=h.key;o!==null;){if(o.key===A)if(o.tag===4&&o.stateNode.containerInfo===h.containerInfo&&o.stateNode.implementation===h.implementation){a(d,o.sibling),g=i(o,h.children||[]),g.return=d,d=g;break e}else{a(d,o);break}else t(d,o);o=o.sibling}g=Xu(h,d.mode,g),g.return=d,d=g}return s(d);case Ma:return h=il(h),N(d,o,h,g)}if(an(h))return M(d,o,h,g);if(Ki(h)){if(A=Ki(h),typeof A!="function")throw Error(v(150));return h=A.call(h),x(d,o,h,g)}if(typeof h.then=="function")return N(d,o,zs(h),g);if(h.$$typeof===kt)return N(d,o,As(d,h),g);Rs(d,h)}return typeof h=="string"&&h!==""||typeof h=="number"||typeof h=="bigint"?(h=""+h,o!==null&&o.tag===6?(a(d,o.sibling),g=i(o,h),g.return=d,d=g):(a(d,o),g=qu(h,d.mode,g),g.return=d,d=g),s(d)):a(d,o)}return function(d,o,h,g){try{Cn=0;var A=N(d,o,h,g);return ni=null,A}catch(T){if(T===xi||T===wr)throw T;var H=Pe(29,T,null,d.mode);return H.lanes=g,H.return=d,H}}}var ml=Vh(!0),Qh=Vh(!1),Sa=!1;function Tc(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Do(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function wa(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function Na(e,t,a){var l=e.updateQueue;if(l===null)return null;if(l=l.shared,(j&2)!==0){var i=l.pending;return i===null?t.next=t:(t.next=i.next,i.next=t),l.pending=t,t=ir(e),Uh(e,null,a),t}return Or(e,l,t,a),ir(e)}function fn(e,t,a){if(t=t.updateQueue,t!==null&&(t=t.shared,(a&4194048)!==0)){var l=t.lanes;l&=e.pendingLanes,a|=l,t.lanes=a,oh(e,a)}}function Zu(e,t){var a=e.updateQueue,l=e.alternate;if(l!==null&&(l=l.updateQueue,a===l)){var i=null,n=null;if(a=a.firstBaseUpdate,a!==null){do{var s={lane:a.lane,tag:a.tag,payload:a.payload,callback:null,next:null};n===null?i=n=s:n=n.next=s,a=a.next}while(a!==null);n===null?i=n=t:n=n.next=t}else i=n=t;a={baseState:l.baseState,firstBaseUpdate:i,lastBaseUpdate:n,shared:l.shared,callbacks:l.callbacks},e.updateQueue=a;return}e=a.lastBaseUpdate,e===null?a.firstBaseUpdate=t:e.next=t,a.lastBaseUpdate=t}var Oo=!1;function dn(){if(Oo){var e=ii;if(e!==null)throw e}}function mn(e,t,a,l){Oo=!1;var i=e.updateQueue;Sa=!1;var n=i.firstBaseUpdate,s=i.lastBaseUpdate,r=i.shared.pending;if(r!==null){i.shared.pending=null;var u=r,c=u.next;u.next=null,s===null?n=c:s.next=c,s=u;var f=e.alternate;f!==null&&(f=f.updateQueue,r=f.lastBaseUpdate,r!==s&&(r===null?f.firstBaseUpdate=c:r.next=c,f.lastBaseUpdate=u))}if(n!==null){var y=i.baseState;s=0,f=c=u=null,r=n;do{var m=r.lane&-536870913,p=m!==r.lane;if(p?(Y&m)===m:(l&m)===m){m!==0&&m===fi&&(Oo=!0),f!==null&&(f=f.next={lane:0,tag:r.tag,payload:r.payload,callback:null,next:null});e:{var M=e,x=r;m=t;var N=a;switch(x.tag){case 1:if(M=x.payload,typeof M=="function"){y=M.call(N,y,m);break e}y=M;break e;case 3:M.flags=M.flags&-65537|128;case 0:if(M=x.payload,m=typeof M=="function"?M.call(N,y,m):M,m==null)break e;y=te({},y,m);break e;case 2:Sa=!0}}m=r.callback,m!==null&&(e.flags|=64,p&&(e.flags|=8192),p=i.callbacks,p===null?i.callbacks=[m]:p.push(m))}else p={lane:m,tag:r.tag,payload:r.payload,callback:r.callback,next:null},f===null?(c=f=p,u=y):f=f.next=p,s|=m;if(r=r.next,r===null){if(r=i.shared.pending,r===null)break;p=r,r=p.next,p.next=null,i.lastBaseUpdate=p,i.shared.pending=null}}while(!0);f===null&&(u=y),i.baseState=u,i.firstBaseUpdate=c,i.lastBaseUpdate=f,n===null&&(i.shared.lanes=0),Za|=s,e.lanes=s,e.memoizedState=y}}function Ph(e,t){if(typeof e!="function")throw Error(v(191,e));e.call(t)}function Fh(e,t){var a=e.callbacks;if(a!==null)for(e.callbacks=null,e=0;e<a.length;e++)Ph(a[e],t)}var di=Dt(null),ur=Dt(0);function am(e,t){e=sa,k(ur,e),k(di,t),sa=e|t.baseLanes}function wo(){k(ur,sa),k(di,di.current)}function Gc(){sa=ur.current,xe(di),xe(ur)}var $e=Dt(null),mt=null;function Ea(e){var t=e.alternate;k(oe,oe.current&1),k($e,e),mt===null&&(t===null||di.current!==null||t.memoizedState!==null)&&(mt=e)}function No(e){k(oe,oe.current),k($e,e),mt===null&&(mt=e)}function Kh(e){e.tag===22?(k(oe,oe.current),k($e,e),mt===null&&(mt=e)):Ta(e)}function Ta(){k(oe,oe.current),k($e,$e.current)}function Qe(e){xe($e),mt===e&&(mt=null),xe(oe)}var oe=Dt(0);function or(e){for(var t=e;t!==null;){if(t.tag===13){var a=t.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||$o(a)||ec(a)))return t}else if(t.tag===19&&(t.memoizedProps.revealOrder==="forwards"||t.memoizedProps.revealOrder==="backwards"||t.memoizedProps.revealOrder==="unstable_legacy-backwards"||t.memoizedProps.revealOrder==="together")){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var la=0,w=null,F=null,fe=null,cr=!1,si=!1,hl=!1,fr=0,An=0,ri=null,gv=0;function re(){throw Error(v(321))}function Cc(e,t){if(t===null)return!1;for(var a=0;a<t.length&&a<e.length;a++)if(!Ie(e[a],t[a]))return!1;return!0}function Ac(e,t,a,l,i,n){return la=n,w=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,R.H=e===null||e.memoizedState===null?Gp:Lc,hl=!1,n=a(l,i),hl=!1,si&&(n=kh(t,a,l,i)),Jh(e),n}function Jh(e){R.H=zn;var t=F!==null&&F.next!==null;if(la=0,fe=F=w=null,cr=!1,An=0,ri=null,t)throw Error(v(300));e===null||he||(e=e.dependencies,e!==null&&sr(e)&&(he=!0))}function kh(e,t,a,l){w=e;var i=0;do{if(si&&(ri=null),An=0,si=!1,25<=i)throw Error(v(301));if(i+=1,fe=F=null,e.updateQueue!=null){var n=e.updateQueue;n.lastEffect=null,n.events=null,n.stores=null,n.memoCache!=null&&(n.memoCache.index=0)}R.H=Cp,n=t(a,l)}while(si);return n}function vv(){var e=R.H,t=e.useState()[0];return t=typeof t.then=="function"?Xn(t):t,e=e.useState()[0],(F!==null?F.memoizedState:null)!==e&&(w.flags|=1024),t}function zc(){var e=fr!==0;return fr=0,e}function Rc(e,t,a){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~a}function _c(e){if(cr){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}cr=!1}la=0,fe=F=w=null,si=!1,An=fr=0,ri=null}function we(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return fe===null?w.memoizedState=fe=e:fe=fe.next=e,fe}function ce(){if(F===null){var e=w.alternate;e=e!==null?e.memoizedState:null}else e=F.next;var t=fe===null?w.memoizedState:fe.next;if(t!==null)fe=t,F=e;else{if(e===null)throw w.alternate===null?Error(v(467)):Error(v(310));F=e,e={memoizedState:F.memoizedState,baseState:F.baseState,baseQueue:F.baseQueue,queue:F.queue,next:null},fe===null?w.memoizedState=fe=e:fe=fe.next=e}return fe}function Nr(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Xn(e){var t=An;return An+=1,ri===null&&(ri=[]),e=Zh(ri,e,t),t=w,(fe===null?t.memoizedState:fe.next)===null&&(t=t.alternate,R.H=t===null||t.memoizedState===null?Gp:Lc),e}function Hr(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return Xn(e);if(e.$$typeof===kt)return Ae(e)}throw Error(v(438,String(e)))}function Dc(e){var t=null,a=w.updateQueue;if(a!==null&&(t=a.memoCache),t==null){var l=w.alternate;l!==null&&(l=l.updateQueue,l!==null&&(l=l.memoCache,l!=null&&(t={data:l.data.map(function(i){return i.slice()}),index:0})))}if(t==null&&(t={data:[],index:0}),a===null&&(a=Nr(),w.updateQueue=a),a.memoCache=t,a=t.data[t.index],a===void 0)for(a=t.data[t.index]=Array(e),l=0;l<e;l++)a[l]=l1;return t.index++,a}function ia(e,t){return typeof t=="function"?t(e):t}function Zs(e){var t=ce();return Oc(t,F,e)}function Oc(e,t,a){var l=e.queue;if(l===null)throw Error(v(311));l.lastRenderedReducer=a;var i=e.baseQueue,n=l.pending;if(n!==null){if(i!==null){var s=i.next;i.next=n.next,n.next=s}t.baseQueue=i=n,l.pending=null}if(n=e.baseState,i===null)e.memoizedState=n;else{t=i.next;var r=s=null,u=null,c=t,f=!1;do{var y=c.lane&-536870913;if(y!==c.lane?(Y&y)===y:(la&y)===y){var m=c.revertLane;if(m===0)u!==null&&(u=u.next={lane:0,revertLane:0,gesture:null,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),y===fi&&(f=!0);else if((la&m)===m){c=c.next,m===fi&&(f=!0);continue}else y={lane:0,revertLane:c.revertLane,gesture:null,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null},u===null?(r=u=y,s=n):u=u.next=y,w.lanes|=m,Za|=m;y=c.action,hl&&a(n,y),n=c.hasEagerState?c.eagerState:a(n,y)}else m={lane:y,revertLane:c.revertLane,gesture:c.gesture,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null},u===null?(r=u=m,s=n):u=u.next=m,w.lanes|=y,Za|=y;c=c.next}while(c!==null&&c!==t);if(u===null?s=n:u.next=r,!Ie(n,e.memoizedState)&&(he=!0,f&&(a=ii,a!==null)))throw a;e.memoizedState=n,e.baseState=s,e.baseQueue=u,l.lastRenderedState=n}return i===null&&(l.lanes=0),[e.memoizedState,l.dispatch]}function Vu(e){var t=ce(),a=t.queue;if(a===null)throw Error(v(311));a.lastRenderedReducer=e;var l=a.dispatch,i=a.pending,n=t.memoizedState;if(i!==null){a.pending=null;var s=i=i.next;do n=e(n,s.action),s=s.next;while(s!==i);Ie(n,t.memoizedState)||(he=!0),t.memoizedState=n,t.baseQueue===null&&(t.baseState=n),a.lastRenderedState=n}return[n,l]}function Wh(e,t,a){var l=w,i=ce(),n=X;if(n){if(a===void 0)throw Error(v(407));a=a()}else a=t();var s=!Ie((F||i).memoizedState,a);if(s&&(i.memoizedState=a,he=!0),i=i.queue,wc(ep.bind(null,l,i,e),[e]),i.getSnapshot!==t||s||fe!==null&&fe.memoizedState.tag&1){if(l.flags|=2048,mi(9,{destroy:void 0},$h.bind(null,l,i,a,t),null),K===null)throw Error(v(349));n||(la&127)!==0||Ih(l,t,a)}return a}function Ih(e,t,a){e.flags|=16384,e={getSnapshot:t,value:a},t=w.updateQueue,t===null?(t=Nr(),w.updateQueue=t,t.stores=[e]):(a=t.stores,a===null?t.stores=[e]:a.push(e))}function $h(e,t,a,l){t.value=a,t.getSnapshot=l,tp(t)&&ap(e)}function ep(e,t,a){return a(function(){tp(t)&&ap(e)})}function tp(e){var t=e.getSnapshot;e=e.value;try{var a=t();return!Ie(e,a)}catch{return!0}}function ap(e){var t=bl(e,2);t!==null&&Le(t,e,2)}function Ho(e){var t=we();if(typeof e=="function"){var a=e;if(e=a(),hl){Ca(!0);try{a()}finally{Ca(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:ia,lastRenderedState:e},t}function lp(e,t,a,l){return e.baseState=a,Oc(e,F,typeof l=="function"?l:ia)}function bv(e,t,a,l,i){if(Br(e))throw Error(v(485));if(e=t.action,e!==null){var n={payload:i,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(s){n.listeners.push(s)}};R.T!==null?a(!0):n.isTransition=!1,l(n),a=t.pending,a===null?(n.next=t.pending=n,ip(t,n)):(n.next=a.next,t.pending=a.next=n)}}function ip(e,t){var a=t.action,l=t.payload,i=e.state;if(t.isTransition){var n=R.T,s={};R.T=s;try{var r=a(i,l),u=R.S;u!==null&&u(s,r),lm(e,t,r)}catch(c){Uo(e,t,c)}finally{n!==null&&s.types!==null&&(n.types=s.types),R.T=n}}else try{n=a(i,l),lm(e,t,n)}catch(c){Uo(e,t,c)}}function lm(e,t,a){a!==null&&typeof a=="object"&&typeof a.then=="function"?a.then(function(l){im(e,t,l)},function(l){return Uo(e,t,l)}):im(e,t,a)}function im(e,t,a){t.status="fulfilled",t.value=a,np(t),e.state=a,t=e.pending,t!==null&&(a=t.next,a===t?e.pending=null:(a=a.next,t.next=a,ip(e,a)))}function Uo(e,t,a){var l=e.pending;if(e.pending=null,l!==null){l=l.next;do t.status="rejected",t.reason=a,np(t),t=t.next;while(t!==l)}e.action=null}function np(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function sp(e,t){return t}function nm(e,t){if(X){var a=K.formState;if(a!==null){e:{var l=w;if(X){if(ee){t:{for(var i=ee,n=dt;i.nodeType!==8;){if(!n){i=null;break t}if(i=ht(i.nextSibling),i===null){i=null;break t}}n=i.data,i=n==="F!"||n==="F"?i:null}if(i){ee=ht(i.nextSibling),l=i.data==="F!";break e}}Xa(l)}l=!1}l&&(t=a[0])}}return a=we(),a.memoizedState=a.baseState=t,l={pending:null,lanes:0,dispatch:null,lastRenderedReducer:sp,lastRenderedState:t},a.queue=l,a=xp.bind(null,w,l),l.dispatch=a,l=Ho(!1),n=Bc.bind(null,w,!1,l.queue),l=we(),i={state:t,dispatch:null,action:e,pending:null},l.queue=i,a=bv.bind(null,w,i,n,a),i.dispatch=a,l.memoizedState=e,[t,a,!1]}function sm(e){var t=ce();return rp(t,F,e)}function rp(e,t,a){if(t=Oc(e,t,sp)[0],e=Zs(ia)[0],typeof t=="object"&&t!==null&&typeof t.then=="function")try{var l=Xn(t)}catch(s){throw s===xi?wr:s}else l=t;t=ce();var i=t.queue,n=i.dispatch;return a!==t.memoizedState&&(w.flags|=2048,mi(9,{destroy:void 0},Mv.bind(null,i,a),null)),[l,n,e]}function Mv(e,t){e.action=t}function rm(e){var t=ce(),a=F;if(a!==null)return rp(t,a,e);ce(),t=t.memoizedState,a=ce();var l=a.queue.dispatch;return a.memoizedState=e,[t,l,!1]}function mi(e,t,a,l){return e={tag:e,create:a,deps:l,inst:t,next:null},t=w.updateQueue,t===null&&(t=Nr(),w.updateQueue=t),a=t.lastEffect,a===null?t.lastEffect=e.next=e:(l=a.next,a.next=e,e.next=l,t.lastEffect=e),e}function up(){return ce().memoizedState}function Vs(e,t,a,l){var i=we();w.flags|=e,i.memoizedState=mi(1|t,{destroy:void 0},a,l===void 0?null:l)}function Ur(e,t,a,l){var i=ce();l=l===void 0?null:l;var n=i.memoizedState.inst;F!==null&&l!==null&&Cc(l,F.memoizedState.deps)?i.memoizedState=mi(t,n,a,l):(w.flags|=e,i.memoizedState=mi(1|t,n,a,l))}function um(e,t){Vs(8390656,8,e,t)}function wc(e,t){Ur(2048,8,e,t)}function Sv(e){w.flags|=4;var t=w.updateQueue;if(t===null)t=Nr(),w.updateQueue=t,t.events=[e];else{var a=t.events;a===null?t.events=[e]:a.push(e)}}function op(e){var t=ce().memoizedState;return Sv({ref:t,nextImpl:e}),function(){if((j&2)!==0)throw Error(v(440));return t.impl.apply(void 0,arguments)}}function cp(e,t){return Ur(4,2,e,t)}function fp(e,t){return Ur(4,4,e,t)}function dp(e,t){if(typeof t=="function"){e=e();var a=t(e);return function(){typeof a=="function"?a():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function mp(e,t,a){a=a!=null?a.concat([e]):null,Ur(4,4,dp.bind(null,t,e),a)}function Nc(){}function hp(e,t){var a=ce();t=t===void 0?null:t;var l=a.memoizedState;return t!==null&&Cc(t,l[1])?l[0]:(a.memoizedState=[e,t],e)}function pp(e,t){var a=ce();t=t===void 0?null:t;var l=a.memoizedState;if(t!==null&&Cc(t,l[1]))return l[0];if(l=e(),hl){Ca(!0);try{e()}finally{Ca(!1)}}return a.memoizedState=[l,t],l}function Hc(e,t,a){return a===void 0||(la&1073741824)!==0&&(Y&261930)===0?e.memoizedState=t:(e.memoizedState=a,e=ly(),w.lanes|=e,Za|=e,a)}function yp(e,t,a,l){return Ie(a,t)?a:di.current!==null?(e=Hc(e,a,l),Ie(e,t)||(he=!0),e):(la&42)===0||(la&1073741824)!==0&&(Y&261930)===0?(he=!0,e.memoizedState=a):(e=ly(),w.lanes|=e,Za|=e,t)}function gp(e,t,a,l,i){var n=Z.p;Z.p=n!==0&&8>n?n:8;var s=R.T,r={};R.T=r,Bc(e,!1,t,a);try{var u=i(),c=R.S;if(c!==null&&c(r,u),u!==null&&typeof u=="object"&&typeof u.then=="function"){var f=yv(u,l);hn(e,t,f,We(e))}else hn(e,t,l,We(e))}catch(y){hn(e,t,{then:function(){},status:"rejected",reason:y},We())}finally{Z.p=n,s!==null&&r.types!==null&&(s.types=r.types),R.T=s}}function xv(){}function Bo(e,t,a,l){if(e.tag!==5)throw Error(v(476));var i=vp(e).queue;gp(e,i,t,sl,a===null?xv:function(){return bp(e),a(l)})}function vp(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:sl,baseState:sl,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:ia,lastRenderedState:sl},next:null};var a={};return t.next={memoizedState:a,baseState:a,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:ia,lastRenderedState:a},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function bp(e){var t=vp(e);t.next===null&&(t=e.alternate.memoizedState),hn(e,t.next.queue,{},We())}function Uc(){return Ae(Dn)}function Mp(){return ce().memoizedState}function Sp(){return ce().memoizedState}function Ev(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var a=We();e=wa(a);var l=Na(t,e,a);l!==null&&(Le(l,t,a),fn(l,t,a)),t={cache:Sc()},e.payload=t;return}t=t.return}}function Tv(e,t,a){var l=We();a={lane:l,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null},Br(e)?Ep(t,a):(a=gc(e,t,a,l),a!==null&&(Le(a,e,l),Tp(a,t,l)))}function xp(e,t,a){var l=We();hn(e,t,a,l)}function hn(e,t,a,l){var i={lane:l,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null};if(Br(e))Ep(t,i);else{var n=e.alternate;if(e.lanes===0&&(n===null||n.lanes===0)&&(n=t.lastRenderedReducer,n!==null))try{var s=t.lastRenderedState,r=n(s,a);if(i.hasEagerState=!0,i.eagerState=r,Ie(r,s))return Or(e,t,i,0),K===null&&Dr(),!1}catch{}if(a=gc(e,t,i,l),a!==null)return Le(a,e,l),Tp(a,t,l),!0}return!1}function Bc(e,t,a,l){if(l={lane:2,revertLane:Pc(),gesture:null,action:l,hasEagerState:!1,eagerState:null,next:null},Br(e)){if(t)throw Error(v(479))}else t=gc(e,a,l,2),t!==null&&Le(t,e,2)}function Br(e){var t=e.alternate;return e===w||t!==null&&t===w}function Ep(e,t){si=cr=!0;var a=e.pending;a===null?t.next=t:(t.next=a.next,a.next=t),e.pending=t}function Tp(e,t,a){if((a&4194048)!==0){var l=t.lanes;l&=e.pendingLanes,a|=l,t.lanes=a,oh(e,a)}}var zn={readContext:Ae,use:Hr,useCallback:re,useContext:re,useEffect:re,useImperativeHandle:re,useLayoutEffect:re,useInsertionEffect:re,useMemo:re,useReducer:re,useRef:re,useState:re,useDebugValue:re,useDeferredValue:re,useTransition:re,useSyncExternalStore:re,useId:re,useHostTransitionStatus:re,useFormState:re,useActionState:re,useOptimistic:re,useMemoCache:re,useCacheRefresh:re};zn.useEffectEvent=re;var Gp={readContext:Ae,use:Hr,useCallback:function(e,t){return we().memoizedState=[e,t===void 0?null:t],e},useContext:Ae,useEffect:um,useImperativeHandle:function(e,t,a){a=a!=null?a.concat([e]):null,Vs(4194308,4,dp.bind(null,t,e),a)},useLayoutEffect:function(e,t){return Vs(4194308,4,e,t)},useInsertionEffect:function(e,t){Vs(4,2,e,t)},useMemo:function(e,t){var a=we();t=t===void 0?null:t;var l=e();if(hl){Ca(!0);try{e()}finally{Ca(!1)}}return a.memoizedState=[l,t],l},useReducer:function(e,t,a){var l=we();if(a!==void 0){var i=a(t);if(hl){Ca(!0);try{a(t)}finally{Ca(!1)}}}else i=t;return l.memoizedState=l.baseState=i,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:i},l.queue=e,e=e.dispatch=Tv.bind(null,w,e),[l.memoizedState,e]},useRef:function(e){var t=we();return e={current:e},t.memoizedState=e},useState:function(e){e=Ho(e);var t=e.queue,a=xp.bind(null,w,t);return t.dispatch=a,[e.memoizedState,a]},useDebugValue:Nc,useDeferredValue:function(e,t){var a=we();return Hc(a,e,t)},useTransition:function(){var e=Ho(!1);return e=gp.bind(null,w,e.queue,!0,!1),we().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,a){var l=w,i=we();if(X){if(a===void 0)throw Error(v(407));a=a()}else{if(a=t(),K===null)throw Error(v(349));(Y&127)!==0||Ih(l,t,a)}i.memoizedState=a;var n={value:a,getSnapshot:t};return i.queue=n,um(ep.bind(null,l,n,e),[e]),l.flags|=2048,mi(9,{destroy:void 0},$h.bind(null,l,n,a,t),null),a},useId:function(){var e=we(),t=K.identifierPrefix;if(X){var a=zt,l=At;a=(l&~(1<<32-ke(l)-1)).toString(32)+a,t="_"+t+"R_"+a,a=fr++,0<a&&(t+="H"+a.toString(32)),t+="_"}else a=gv++,t="_"+t+"r_"+a.toString(32)+"_";return e.memoizedState=t},useHostTransitionStatus:Uc,useFormState:nm,useActionState:nm,useOptimistic:function(e){var t=we();t.memoizedState=t.baseState=e;var a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=a,t=Bc.bind(null,w,!0,a),a.dispatch=t,[e,t]},useMemoCache:Dc,useCacheRefresh:function(){return we().memoizedState=Ev.bind(null,w)},useEffectEvent:function(e){var t=we(),a={impl:e};return t.memoizedState=a,function(){if((j&2)!==0)throw Error(v(440));return a.impl.apply(void 0,arguments)}}},Lc={readContext:Ae,use:Hr,useCallback:hp,useContext:Ae,useEffect:wc,useImperativeHandle:mp,useInsertionEffect:cp,useLayoutEffect:fp,useMemo:pp,useReducer:Zs,useRef:up,useState:function(){return Zs(ia)},useDebugValue:Nc,useDeferredValue:function(e,t){var a=ce();return yp(a,F.memoizedState,e,t)},useTransition:function(){var e=Zs(ia)[0],t=ce().memoizedState;return[typeof e=="boolean"?e:Xn(e),t]},useSyncExternalStore:Wh,useId:Mp,useHostTransitionStatus:Uc,useFormState:sm,useActionState:sm,useOptimistic:function(e,t){var a=ce();return lp(a,F,e,t)},useMemoCache:Dc,useCacheRefresh:Sp};Lc.useEffectEvent=op;var Cp={readContext:Ae,use:Hr,useCallback:hp,useContext:Ae,useEffect:wc,useImperativeHandle:mp,useInsertionEffect:cp,useLayoutEffect:fp,useMemo:pp,useReducer:Vu,useRef:up,useState:function(){return Vu(ia)},useDebugValue:Nc,useDeferredValue:function(e,t){var a=ce();return F===null?Hc(a,e,t):yp(a,F.memoizedState,e,t)},useTransition:function(){var e=Vu(ia)[0],t=ce().memoizedState;return[typeof e=="boolean"?e:Xn(e),t]},useSyncExternalStore:Wh,useId:Mp,useHostTransitionStatus:Uc,useFormState:rm,useActionState:rm,useOptimistic:function(e,t){var a=ce();return F!==null?lp(a,F,e,t):(a.baseState=e,[e,a.queue.dispatch])},useMemoCache:Dc,useCacheRefresh:Sp};Cp.useEffectEvent=op;function Qu(e,t,a,l){t=e.memoizedState,a=a(l,t),a=a==null?t:te({},t,a),e.memoizedState=a,e.lanes===0&&(e.updateQueue.baseState=a)}var Lo={enqueueSetState:function(e,t,a){e=e._reactInternals;var l=We(),i=wa(l);i.payload=t,a!=null&&(i.callback=a),t=Na(e,i,l),t!==null&&(Le(t,e,l),fn(t,e,l))},enqueueReplaceState:function(e,t,a){e=e._reactInternals;var l=We(),i=wa(l);i.tag=1,i.payload=t,a!=null&&(i.callback=a),t=Na(e,i,l),t!==null&&(Le(t,e,l),fn(t,e,l))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var a=We(),l=wa(a);l.tag=2,t!=null&&(l.callback=t),t=Na(e,l,a),t!==null&&(Le(t,e,a),fn(t,e,a))}};function om(e,t,a,l,i,n,s){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(l,n,s):t.prototype&&t.prototype.isPureReactComponent?!En(a,l)||!En(i,n):!0}function cm(e,t,a,l){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(a,l),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(a,l),t.state!==e&&Lo.enqueueReplaceState(t,t.state,null)}function pl(e,t){var a=t;if("ref"in t){a={};for(var l in t)l!=="ref"&&(a[l]=t[l])}if(e=e.defaultProps){a===t&&(a=te({},a));for(var i in e)a[i]===void 0&&(a[i]=e[i])}return a}function Ap(e){lr(e)}function zp(e){console.error(e)}function Rp(e){lr(e)}function dr(e,t){try{var a=e.onUncaughtError;a(t.value,{componentStack:t.stack})}catch(l){setTimeout(function(){throw l})}}function fm(e,t,a){try{var l=e.onCaughtError;l(a.value,{componentStack:a.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(i){setTimeout(function(){throw i})}}function Yo(e,t,a){return a=wa(a),a.tag=3,a.payload={element:null},a.callback=function(){dr(e,t)},a}function _p(e){return e=wa(e),e.tag=3,e}function Dp(e,t,a,l){var i=a.type.getDerivedStateFromError;if(typeof i=="function"){var n=l.value;e.payload=function(){return i(n)},e.callback=function(){fm(t,a,l)}}var s=a.stateNode;s!==null&&typeof s.componentDidCatch=="function"&&(e.callback=function(){fm(t,a,l),typeof i!="function"&&(Ha===null?Ha=new Set([this]):Ha.add(this));var r=l.stack;this.componentDidCatch(l.value,{componentStack:r!==null?r:""})})}function Gv(e,t,a,l,i){if(a.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){if(t=a.alternate,t!==null&&Si(t,a,i,!0),a=$e.current,a!==null){switch(a.tag){case 31:case 13:return mt===null?gr():a.alternate===null&&ue===0&&(ue=3),a.flags&=-257,a.flags|=65536,a.lanes=i,l===rr?a.flags|=16384:(t=a.updateQueue,t===null?a.updateQueue=new Set([l]):t.add(l),ao(e,l,i)),!1;case 22:return a.flags|=65536,l===rr?a.flags|=16384:(t=a.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([l])},a.updateQueue=t):(a=t.retryQueue,a===null?t.retryQueue=new Set([l]):a.add(l)),ao(e,l,i)),!1}throw Error(v(435,a.tag))}return ao(e,l,i),gr(),!1}if(X)return t=$e.current,t!==null?((t.flags&65536)===0&&(t.flags|=256),t.flags|=65536,t.lanes=i,l!==Co&&(e=Error(v(422),{cause:l}),Gn(ft(e,a)))):(l!==Co&&(t=Error(v(423),{cause:l}),Gn(ft(t,a))),e=e.current.alternate,e.flags|=65536,i&=-i,e.lanes|=i,l=ft(l,a),i=Yo(e.stateNode,l,i),Zu(e,i),ue!==4&&(ue=2)),!1;var n=Error(v(520),{cause:l});if(n=ft(n,a),gn===null?gn=[n]:gn.push(n),ue!==4&&(ue=2),t===null)return!0;l=ft(l,a),a=t;do{switch(a.tag){case 3:return a.flags|=65536,e=i&-i,a.lanes|=e,e=Yo(a.stateNode,l,e),Zu(a,e),!1;case 1:if(t=a.type,n=a.stateNode,(a.flags&128)===0&&(typeof t.getDerivedStateFromError=="function"||n!==null&&typeof n.componentDidCatch=="function"&&(Ha===null||!Ha.has(n))))return a.flags|=65536,i&=-i,a.lanes|=i,i=_p(i),Dp(i,e,a,l),Zu(a,i),!1}a=a.return}while(a!==null);return!1}var Yc=Error(v(461)),he=!1;function Te(e,t,a,l){t.child=e===null?Qh(t,null,a,l):ml(t,e.child,a,l)}function dm(e,t,a,l,i){a=a.render;var n=t.ref;if("ref"in l){var s={};for(var r in l)r!=="ref"&&(s[r]=l[r])}else s=l;return dl(t),l=Ac(e,t,a,s,n,i),r=zc(),e!==null&&!he?(Rc(e,t,i),na(e,t,i)):(X&&r&&bc(t),t.flags|=1,Te(e,t,l,i),t.child)}function mm(e,t,a,l,i){if(e===null){var n=a.type;return typeof n=="function"&&!vc(n)&&n.defaultProps===void 0&&a.compare===null?(t.tag=15,t.type=n,Op(e,t,n,l,i)):(e=Xs(a.type,null,l,t,t.mode,i),e.ref=t.ref,e.return=t,t.child=e)}if(n=e.child,!qc(e,i)){var s=n.memoizedProps;if(a=a.compare,a=a!==null?a:En,a(s,l)&&e.ref===t.ref)return na(e,t,i)}return t.flags|=1,e=$t(n,l),e.ref=t.ref,e.return=t,t.child=e}function Op(e,t,a,l,i){if(e!==null){var n=e.memoizedProps;if(En(n,l)&&e.ref===t.ref)if(he=!1,t.pendingProps=l=n,qc(e,i))(e.flags&131072)!==0&&(he=!0);else return t.lanes=e.lanes,na(e,t,i)}return qo(e,t,a,l,i)}function wp(e,t,a,l){var i=l.children,n=e!==null?e.memoizedState:null;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),l.mode==="hidden"){if((t.flags&128)!==0){if(n=n!==null?n.baseLanes|a:a,e!==null){for(l=t.child=e.child,i=0;l!==null;)i=i|l.lanes|l.childLanes,l=l.sibling;l=i&~n}else l=0,t.child=null;return hm(e,t,n,a,l)}if((a&536870912)!==0)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&js(t,n!==null?n.cachePool:null),n!==null?am(t,n):wo(),Kh(t);else return l=t.lanes=536870912,hm(e,t,n!==null?n.baseLanes|a:a,a,l)}else n!==null?(js(t,n.cachePool),am(t,n),Ta(t),t.memoizedState=null):(e!==null&&js(t,null),wo(),Ta(t));return Te(e,t,i,a),t.child}function nn(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function hm(e,t,a,l,i){var n=xc();return n=n===null?null:{parent:me._currentValue,pool:n},t.memoizedState={baseLanes:a,cachePool:n},e!==null&&js(t,null),wo(),Kh(t),e!==null&&Si(e,t,l,!0),t.childLanes=i,null}function Qs(e,t){return t=mr({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function pm(e,t,a){return ml(t,e.child,null,a),e=Qs(t,t.pendingProps),e.flags|=2,Qe(t),t.memoizedState=null,e}function Cv(e,t,a){var l=t.pendingProps,i=(t.flags&128)!==0;if(t.flags&=-129,e===null){if(X){if(l.mode==="hidden")return e=Qs(t,l),t.lanes=536870912,nn(null,e);if(No(t),(e=ee)?(e=Gy(e,dt),e=e!==null&&e.data==="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:qa!==null?{id:At,overflow:zt}:null,retryLane:536870912,hydrationErrors:null},a=Lh(e),a.return=t,t.child=a,Ce=t,ee=null)):e=null,e===null)throw Xa(t);return t.lanes=536870912,null}return Qs(t,l)}var n=e.memoizedState;if(n!==null){var s=n.dehydrated;if(No(t),i)if(t.flags&256)t.flags&=-257,t=pm(e,t,a);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(v(558));else if(he||Si(e,t,a,!1),i=(a&e.childLanes)!==0,he||i){if(l=K,l!==null&&(s=ch(l,a),s!==0&&s!==n.retryLane))throw n.retryLane=s,bl(e,s),Le(l,e,s),Yc;gr(),t=pm(e,t,a)}else e=n.treeContext,ee=ht(s.nextSibling),Ce=t,X=!0,Oa=null,dt=!1,e!==null&&qh(t,e),t=Qs(t,l),t.flags|=4096;return t}return e=$t(e.child,{mode:l.mode,children:l.children}),e.ref=t.ref,t.child=e,e.return=t,e}function Ps(e,t){var a=t.ref;if(a===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof a!="function"&&typeof a!="object")throw Error(v(284));(e===null||e.ref!==a)&&(t.flags|=4194816)}}function qo(e,t,a,l,i){return dl(t),a=Ac(e,t,a,l,void 0,i),l=zc(),e!==null&&!he?(Rc(e,t,i),na(e,t,i)):(X&&l&&bc(t),t.flags|=1,Te(e,t,a,i),t.child)}function ym(e,t,a,l,i,n){return dl(t),t.updateQueue=null,a=kh(t,l,a,i),Jh(e),l=zc(),e!==null&&!he?(Rc(e,t,n),na(e,t,n)):(X&&l&&bc(t),t.flags|=1,Te(e,t,a,n),t.child)}function gm(e,t,a,l,i){if(dl(t),t.stateNode===null){var n=Wl,s=a.contextType;typeof s=="object"&&s!==null&&(n=Ae(s)),n=new a(l,n),t.memoizedState=n.state!==null&&n.state!==void 0?n.state:null,n.updater=Lo,t.stateNode=n,n._reactInternals=t,n=t.stateNode,n.props=l,n.state=t.memoizedState,n.refs={},Tc(t),s=a.contextType,n.context=typeof s=="object"&&s!==null?Ae(s):Wl,n.state=t.memoizedState,s=a.getDerivedStateFromProps,typeof s=="function"&&(Qu(t,a,s,l),n.state=t.memoizedState),typeof a.getDerivedStateFromProps=="function"||typeof n.getSnapshotBeforeUpdate=="function"||typeof n.UNSAFE_componentWillMount!="function"&&typeof n.componentWillMount!="function"||(s=n.state,typeof n.componentWillMount=="function"&&n.componentWillMount(),typeof n.UNSAFE_componentWillMount=="function"&&n.UNSAFE_componentWillMount(),s!==n.state&&Lo.enqueueReplaceState(n,n.state,null),mn(t,l,n,i),dn(),n.state=t.memoizedState),typeof n.componentDidMount=="function"&&(t.flags|=4194308),l=!0}else if(e===null){n=t.stateNode;var r=t.memoizedProps,u=pl(a,r);n.props=u;var c=n.context,f=a.contextType;s=Wl,typeof f=="object"&&f!==null&&(s=Ae(f));var y=a.getDerivedStateFromProps;f=typeof y=="function"||typeof n.getSnapshotBeforeUpdate=="function",r=t.pendingProps!==r,f||typeof n.UNSAFE_componentWillReceiveProps!="function"&&typeof n.componentWillReceiveProps!="function"||(r||c!==s)&&cm(t,n,l,s),Sa=!1;var m=t.memoizedState;n.state=m,mn(t,l,n,i),dn(),c=t.memoizedState,r||m!==c||Sa?(typeof y=="function"&&(Qu(t,a,y,l),c=t.memoizedState),(u=Sa||om(t,a,u,l,m,c,s))?(f||typeof n.UNSAFE_componentWillMount!="function"&&typeof n.componentWillMount!="function"||(typeof n.componentWillMount=="function"&&n.componentWillMount(),typeof n.UNSAFE_componentWillMount=="function"&&n.UNSAFE_componentWillMount()),typeof n.componentDidMount=="function"&&(t.flags|=4194308)):(typeof n.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=l,t.memoizedState=c),n.props=l,n.state=c,n.context=s,l=u):(typeof n.componentDidMount=="function"&&(t.flags|=4194308),l=!1)}else{n=t.stateNode,Do(e,t),s=t.memoizedProps,f=pl(a,s),n.props=f,y=t.pendingProps,m=n.context,c=a.contextType,u=Wl,typeof c=="object"&&c!==null&&(u=Ae(c)),r=a.getDerivedStateFromProps,(c=typeof r=="function"||typeof n.getSnapshotBeforeUpdate=="function")||typeof n.UNSAFE_componentWillReceiveProps!="function"&&typeof n.componentWillReceiveProps!="function"||(s!==y||m!==u)&&cm(t,n,l,u),Sa=!1,m=t.memoizedState,n.state=m,mn(t,l,n,i),dn();var p=t.memoizedState;s!==y||m!==p||Sa||e!==null&&e.dependencies!==null&&sr(e.dependencies)?(typeof r=="function"&&(Qu(t,a,r,l),p=t.memoizedState),(f=Sa||om(t,a,f,l,m,p,u)||e!==null&&e.dependencies!==null&&sr(e.dependencies))?(c||typeof n.UNSAFE_componentWillUpdate!="function"&&typeof n.componentWillUpdate!="function"||(typeof n.componentWillUpdate=="function"&&n.componentWillUpdate(l,p,u),typeof n.UNSAFE_componentWillUpdate=="function"&&n.UNSAFE_componentWillUpdate(l,p,u)),typeof n.componentDidUpdate=="function"&&(t.flags|=4),typeof n.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof n.componentDidUpdate!="function"||s===e.memoizedProps&&m===e.memoizedState||(t.flags|=4),typeof n.getSnapshotBeforeUpdate!="function"||s===e.memoizedProps&&m===e.memoizedState||(t.flags|=1024),t.memoizedProps=l,t.memoizedState=p),n.props=l,n.state=p,n.context=u,l=f):(typeof n.componentDidUpdate!="function"||s===e.memoizedProps&&m===e.memoizedState||(t.flags|=4),typeof n.getSnapshotBeforeUpdate!="function"||s===e.memoizedProps&&m===e.memoizedState||(t.flags|=1024),l=!1)}return n=l,Ps(e,t),l=(t.flags&128)!==0,n||l?(n=t.stateNode,a=l&&typeof a.getDerivedStateFromError!="function"?null:n.render(),t.flags|=1,e!==null&&l?(t.child=ml(t,e.child,null,i),t.child=ml(t,null,a,i)):Te(e,t,a,i),t.memoizedState=n.state,e=t.child):e=na(e,t,i),e}function vm(e,t,a,l){return fl(),t.flags|=256,Te(e,t,a,l),t.child}var Pu={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Fu(e){return{baseLanes:e,cachePool:jh()}}function Ku(e,t,a){return e=e!==null?e.childLanes&~a:0,t&&(e|=Fe),e}function Np(e,t,a){var l=t.pendingProps,i=!1,n=(t.flags&128)!==0,s;if((s=n)||(s=e!==null&&e.memoizedState===null?!1:(oe.current&2)!==0),s&&(i=!0,t.flags&=-129),s=(t.flags&32)!==0,t.flags&=-33,e===null){if(X){if(i?Ea(t):Ta(t),(e=ee)?(e=Gy(e,dt),e=e!==null&&e.data!=="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:qa!==null?{id:At,overflow:zt}:null,retryLane:536870912,hydrationErrors:null},a=Lh(e),a.return=t,t.child=a,Ce=t,ee=null)):e=null,e===null)throw Xa(t);return ec(e)?t.lanes=32:t.lanes=536870912,null}var r=l.children;return l=l.fallback,i?(Ta(t),i=t.mode,r=mr({mode:"hidden",children:r},i),l=rl(l,i,a,null),r.return=t,l.return=t,r.sibling=l,t.child=r,l=t.child,l.memoizedState=Fu(a),l.childLanes=Ku(e,s,a),t.memoizedState=Pu,nn(null,l)):(Ea(t),Xo(t,r))}var u=e.memoizedState;if(u!==null&&(r=u.dehydrated,r!==null)){if(n)t.flags&256?(Ea(t),t.flags&=-257,t=Ju(e,t,a)):t.memoizedState!==null?(Ta(t),t.child=e.child,t.flags|=128,t=null):(Ta(t),r=l.fallback,i=t.mode,l=mr({mode:"visible",children:l.children},i),r=rl(r,i,a,null),r.flags|=2,l.return=t,r.return=t,l.sibling=r,t.child=l,ml(t,e.child,null,a),l=t.child,l.memoizedState=Fu(a),l.childLanes=Ku(e,s,a),t.memoizedState=Pu,t=nn(null,l));else if(Ea(t),ec(r)){if(s=r.nextSibling&&r.nextSibling.dataset,s)var c=s.dgst;s=c,l=Error(v(419)),l.stack="",l.digest=s,Gn({value:l,source:null,stack:null}),t=Ju(e,t,a)}else if(he||Si(e,t,a,!1),s=(a&e.childLanes)!==0,he||s){if(s=K,s!==null&&(l=ch(s,a),l!==0&&l!==u.retryLane))throw u.retryLane=l,bl(e,l),Le(s,e,l),Yc;$o(r)||gr(),t=Ju(e,t,a)}else $o(r)?(t.flags|=192,t.child=e.child,t=null):(e=u.treeContext,ee=ht(r.nextSibling),Ce=t,X=!0,Oa=null,dt=!1,e!==null&&qh(t,e),t=Xo(t,l.children),t.flags|=4096);return t}return i?(Ta(t),r=l.fallback,i=t.mode,u=e.child,c=u.sibling,l=$t(u,{mode:"hidden",children:l.children}),l.subtreeFlags=u.subtreeFlags&65011712,c!==null?r=$t(c,r):(r=rl(r,i,a,null),r.flags|=2),r.return=t,l.return=t,l.sibling=r,t.child=l,nn(null,l),l=t.child,r=e.child.memoizedState,r===null?r=Fu(a):(i=r.cachePool,i!==null?(u=me._currentValue,i=i.parent!==u?{parent:u,pool:u}:i):i=jh(),r={baseLanes:r.baseLanes|a,cachePool:i}),l.memoizedState=r,l.childLanes=Ku(e,s,a),t.memoizedState=Pu,nn(e.child,l)):(Ea(t),a=e.child,e=a.sibling,a=$t(a,{mode:"visible",children:l.children}),a.return=t,a.sibling=null,e!==null&&(s=t.deletions,s===null?(t.deletions=[e],t.flags|=16):s.push(e)),t.child=a,t.memoizedState=null,a)}function Xo(e,t){return t=mr({mode:"visible",children:t},e.mode),t.return=e,e.child=t}function mr(e,t){return e=Pe(22,e,null,t),e.lanes=0,e}function Ju(e,t,a){return ml(t,e.child,null,a),e=Xo(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function bm(e,t,a){e.lanes|=t;var l=e.alternate;l!==null&&(l.lanes|=t),zo(e.return,t,a)}function ku(e,t,a,l,i,n){var s=e.memoizedState;s===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:l,tail:a,tailMode:i,treeForkCount:n}:(s.isBackwards=t,s.rendering=null,s.renderingStartTime=0,s.last=l,s.tail=a,s.tailMode=i,s.treeForkCount=n)}function Hp(e,t,a){var l=t.pendingProps,i=l.revealOrder,n=l.tail;l=l.children;var s=oe.current,r=(s&2)!==0;if(r?(s=s&1|2,t.flags|=128):s&=1,k(oe,s),Te(e,t,l,a),l=X?Tn:0,!r&&e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&bm(e,a,t);else if(e.tag===19)bm(e,a,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(i){case"forwards":for(a=t.child,i=null;a!==null;)e=a.alternate,e!==null&&or(e)===null&&(i=a),a=a.sibling;a=i,a===null?(i=t.child,t.child=null):(i=a.sibling,a.sibling=null),ku(t,!1,i,a,n,l);break;case"backwards":case"unstable_legacy-backwards":for(a=null,i=t.child,t.child=null;i!==null;){if(e=i.alternate,e!==null&&or(e)===null){t.child=i;break}e=i.sibling,i.sibling=a,a=i,i=e}ku(t,!0,a,null,n,l);break;case"together":ku(t,!1,null,null,void 0,l);break;default:t.memoizedState=null}return t.child}function na(e,t,a){if(e!==null&&(t.dependencies=e.dependencies),Za|=t.lanes,(a&t.childLanes)===0)if(e!==null){if(Si(e,t,a,!1),(a&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error(v(153));if(t.child!==null){for(e=t.child,a=$t(e,e.pendingProps),t.child=a,a.return=t;e.sibling!==null;)e=e.sibling,a=a.sibling=$t(e,e.pendingProps),a.return=t;a.sibling=null}return t.child}function qc(e,t){return(e.lanes&t)!==0?!0:(e=e.dependencies,!!(e!==null&&sr(e)))}function Av(e,t,a){switch(t.tag){case 3:$s(t,t.stateNode.containerInfo),xa(t,me,e.memoizedState.cache),fl();break;case 27:case 5:po(t);break;case 4:$s(t,t.stateNode.containerInfo);break;case 10:xa(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,No(t),null;break;case 13:var l=t.memoizedState;if(l!==null)return l.dehydrated!==null?(Ea(t),t.flags|=128,null):(a&t.child.childLanes)!==0?Np(e,t,a):(Ea(t),e=na(e,t,a),e!==null?e.sibling:null);Ea(t);break;case 19:var i=(e.flags&128)!==0;if(l=(a&t.childLanes)!==0,l||(Si(e,t,a,!1),l=(a&t.childLanes)!==0),i){if(l)return Hp(e,t,a);t.flags|=128}if(i=t.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),k(oe,oe.current),l)break;return null;case 22:return t.lanes=0,wp(e,t,a,t.pendingProps);case 24:xa(t,me,e.memoizedState.cache)}return na(e,t,a)}function Up(e,t,a){if(e!==null)if(e.memoizedProps!==t.pendingProps)he=!0;else{if(!qc(e,a)&&(t.flags&128)===0)return he=!1,Av(e,t,a);he=(e.flags&131072)!==0}else he=!1,X&&(t.flags&1048576)!==0&&Yh(t,Tn,t.index);switch(t.lanes=0,t.tag){case 16:e:{var l=t.pendingProps;if(e=il(t.elementType),t.type=e,typeof e=="function")vc(e)?(l=pl(e,l),t.tag=1,t=gm(null,t,e,l,a)):(t.tag=0,t=qo(null,t,e,l,a));else{if(e!=null){var i=e.$$typeof;if(i===ic){t.tag=11,t=dm(null,t,e,l,a);break e}else if(i===nc){t.tag=14,t=mm(null,t,e,l,a);break e}}throw t=mo(e)||e,Error(v(306,t,""))}}return t;case 0:return qo(e,t,t.type,t.pendingProps,a);case 1:return l=t.type,i=pl(l,t.pendingProps),gm(e,t,l,i,a);case 3:e:{if($s(t,t.stateNode.containerInfo),e===null)throw Error(v(387));l=t.pendingProps;var n=t.memoizedState;i=n.element,Do(e,t),mn(t,l,null,a);var s=t.memoizedState;if(l=s.cache,xa(t,me,l),l!==n.cache&&Ro(t,[me],a,!0),dn(),l=s.element,n.isDehydrated)if(n={element:l,isDehydrated:!1,cache:s.cache},t.updateQueue.baseState=n,t.memoizedState=n,t.flags&256){t=vm(e,t,l,a);break e}else if(l!==i){i=ft(Error(v(424)),t),Gn(i),t=vm(e,t,l,a);break e}else for(e=t.stateNode.containerInfo,e.nodeType===9?e=e.body:e=e.nodeName==="HTML"?e.ownerDocument.body:e,ee=ht(e.firstChild),Ce=t,X=!0,Oa=null,dt=!0,a=Qh(t,null,l,a),t.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling;else{if(fl(),l===i){t=na(e,t,a);break e}Te(e,t,l,a)}t=t.child}return t;case 26:return Ps(e,t),e===null?(a=Xm(t.type,null,t.pendingProps,null))?t.memoizedState=a:X||(a=t.type,e=t.pendingProps,l=Sr(Da.current).createElement(a),l[Ge]=t,l[Ye]=e,ze(l,a,e),Se(l),t.stateNode=l):t.memoizedState=Xm(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return po(t),e===null&&X&&(l=t.stateNode=Cy(t.type,t.pendingProps,Da.current),Ce=t,dt=!0,i=ee,Qa(t.type)?(tc=i,ee=ht(l.firstChild)):ee=i),Te(e,t,t.pendingProps.children,a),Ps(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&X&&((i=l=ee)&&(l=tb(l,t.type,t.pendingProps,dt),l!==null?(t.stateNode=l,Ce=t,ee=ht(l.firstChild),dt=!1,i=!0):i=!1),i||Xa(t)),po(t),i=t.type,n=t.pendingProps,s=e!==null?e.memoizedProps:null,l=n.children,Wo(i,n)?l=null:s!==null&&Wo(i,s)&&(t.flags|=32),t.memoizedState!==null&&(i=Ac(e,t,vv,null,null,a),Dn._currentValue=i),Ps(e,t),Te(e,t,l,a),t.child;case 6:return e===null&&X&&((e=a=ee)&&(a=ab(a,t.pendingProps,dt),a!==null?(t.stateNode=a,Ce=t,ee=null,e=!0):e=!1),e||Xa(t)),null;case 13:return Np(e,t,a);case 4:return $s(t,t.stateNode.containerInfo),l=t.pendingProps,e===null?t.child=ml(t,null,l,a):Te(e,t,l,a),t.child;case 11:return dm(e,t,t.type,t.pendingProps,a);case 7:return Te(e,t,t.pendingProps,a),t.child;case 8:return Te(e,t,t.pendingProps.children,a),t.child;case 12:return Te(e,t,t.pendingProps.children,a),t.child;case 10:return l=t.pendingProps,xa(t,t.type,l.value),Te(e,t,l.children,a),t.child;case 9:return i=t.type._context,l=t.pendingProps.children,dl(t),i=Ae(i),l=l(i),t.flags|=1,Te(e,t,l,a),t.child;case 14:return mm(e,t,t.type,t.pendingProps,a);case 15:return Op(e,t,t.type,t.pendingProps,a);case 19:return Hp(e,t,a);case 31:return Cv(e,t,a);case 22:return wp(e,t,a,t.pendingProps);case 24:return dl(t),l=Ae(me),e===null?(i=xc(),i===null&&(i=K,n=Sc(),i.pooledCache=n,n.refCount++,n!==null&&(i.pooledCacheLanes|=a),i=n),t.memoizedState={parent:l,cache:i},Tc(t),xa(t,me,i)):((e.lanes&a)!==0&&(Do(e,t),mn(t,null,null,a),dn()),i=e.memoizedState,n=t.memoizedState,i.parent!==l?(i={parent:l,cache:l},t.memoizedState=i,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=i),xa(t,me,l)):(l=n.cache,xa(t,me,l),l!==i.cache&&Ro(t,[me],a,!0))),Te(e,t,t.pendingProps.children,a),t.child;case 29:throw t.pendingProps}throw Error(v(156,t.tag))}function Vt(e){e.flags|=4}function Wu(e,t,a,l,i){if((t=(e.mode&32)!==0)&&(t=!1),t){if(e.flags|=16777216,(i&335544128)===i)if(e.stateNode.complete)e.flags|=8192;else if(sy())e.flags|=8192;else throw ol=rr,Ec}else e.flags&=-16777217}function Mm(e,t){if(t.type!=="stylesheet"||(t.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!Ry(t))if(sy())e.flags|=8192;else throw ol=rr,Ec}function _s(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag!==22?rh():536870912,e.lanes|=t,hi|=t)}function Wi(e,t){if(!X)switch(e.tailMode){case"hidden":t=e.tail;for(var a=null;t!==null;)t.alternate!==null&&(a=t),t=t.sibling;a===null?e.tail=null:a.sibling=null;break;case"collapsed":a=e.tail;for(var l=null;a!==null;)a.alternate!==null&&(l=a),a=a.sibling;l===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:l.sibling=null}}function $(e){var t=e.alternate!==null&&e.alternate.child===e.child,a=0,l=0;if(t)for(var i=e.child;i!==null;)a|=i.lanes|i.childLanes,l|=i.subtreeFlags&65011712,l|=i.flags&65011712,i.return=e,i=i.sibling;else for(i=e.child;i!==null;)a|=i.lanes|i.childLanes,l|=i.subtreeFlags,l|=i.flags,i.return=e,i=i.sibling;return e.subtreeFlags|=l,e.childLanes=a,t}function zv(e,t,a){var l=t.pendingProps;switch(Mc(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return $(t),null;case 1:return $(t),null;case 3:return a=t.stateNode,l=null,e!==null&&(l=e.memoizedState.cache),t.memoizedState.cache!==l&&(t.flags|=2048),ea(me),ui(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(e===null||e.child===null)&&(Yl(t)?Vt(t):e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,ju())),$(t),null;case 26:var i=t.type,n=t.memoizedState;return e===null?(Vt(t),n!==null?($(t),Mm(t,n)):($(t),Wu(t,i,null,l,a))):n?n!==e.memoizedState?(Vt(t),$(t),Mm(t,n)):($(t),t.flags&=-16777217):(e=e.memoizedProps,e!==l&&Vt(t),$(t),Wu(t,i,e,l,a)),null;case 27:if(er(t),a=Da.current,i=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==l&&Vt(t);else{if(!l){if(t.stateNode===null)throw Error(v(166));return $(t),null}e=_t.current,Yl(t)?Jd(t,e):(e=Cy(i,l,a),t.stateNode=e,Vt(t))}return $(t),null;case 5:if(er(t),i=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==l&&Vt(t);else{if(!l){if(t.stateNode===null)throw Error(v(166));return $(t),null}if(n=_t.current,Yl(t))Jd(t,n);else{var s=Sr(Da.current);switch(n){case 1:n=s.createElementNS("http://www.w3.org/2000/svg",i);break;case 2:n=s.createElementNS("http://www.w3.org/1998/Math/MathML",i);break;default:switch(i){case"svg":n=s.createElementNS("http://www.w3.org/2000/svg",i);break;case"math":n=s.createElementNS("http://www.w3.org/1998/Math/MathML",i);break;case"script":n=s.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild);break;case"select":n=typeof l.is=="string"?s.createElement("select",{is:l.is}):s.createElement("select"),l.multiple?n.multiple=!0:l.size&&(n.size=l.size);break;default:n=typeof l.is=="string"?s.createElement(i,{is:l.is}):s.createElement(i)}}n[Ge]=t,n[Ye]=l;e:for(s=t.child;s!==null;){if(s.tag===5||s.tag===6)n.appendChild(s.stateNode);else if(s.tag!==4&&s.tag!==27&&s.child!==null){s.child.return=s,s=s.child;continue}if(s===t)break e;for(;s.sibling===null;){if(s.return===null||s.return===t)break e;s=s.return}s.sibling.return=s.return,s=s.sibling}t.stateNode=n;e:switch(ze(n,i,l),i){case"button":case"input":case"select":case"textarea":l=!!l.autoFocus;break e;case"img":l=!0;break e;default:l=!1}l&&Vt(t)}}return $(t),Wu(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,a),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==l&&Vt(t);else{if(typeof l!="string"&&t.stateNode===null)throw Error(v(166));if(e=Da.current,Yl(t)){if(e=t.stateNode,a=t.memoizedProps,l=null,i=Ce,i!==null)switch(i.tag){case 27:case 5:l=i.memoizedProps}e[Ge]=t,e=!!(e.nodeValue===a||l!==null&&l.suppressHydrationWarning===!0||xy(e.nodeValue,a)),e||Xa(t,!0)}else e=Sr(e).createTextNode(l),e[Ge]=t,t.stateNode=e}return $(t),null;case 31:if(a=t.memoizedState,e===null||e.memoizedState!==null){if(l=Yl(t),a!==null){if(e===null){if(!l)throw Error(v(318));if(e=t.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(v(557));e[Ge]=t}else fl(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;$(t),e=!1}else a=ju(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),e=!0;if(!e)return t.flags&256?(Qe(t),t):(Qe(t),null);if((t.flags&128)!==0)throw Error(v(558))}return $(t),null;case 13:if(l=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(i=Yl(t),l!==null&&l.dehydrated!==null){if(e===null){if(!i)throw Error(v(318));if(i=t.memoizedState,i=i!==null?i.dehydrated:null,!i)throw Error(v(317));i[Ge]=t}else fl(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;$(t),i=!1}else i=ju(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=i),i=!0;if(!i)return t.flags&256?(Qe(t),t):(Qe(t),null)}return Qe(t),(t.flags&128)!==0?(t.lanes=a,t):(a=l!==null,e=e!==null&&e.memoizedState!==null,a&&(l=t.child,i=null,l.alternate!==null&&l.alternate.memoizedState!==null&&l.alternate.memoizedState.cachePool!==null&&(i=l.alternate.memoizedState.cachePool.pool),n=null,l.memoizedState!==null&&l.memoizedState.cachePool!==null&&(n=l.memoizedState.cachePool.pool),n!==i&&(l.flags|=2048)),a!==e&&a&&(t.child.flags|=8192),_s(t,t.updateQueue),$(t),null);case 4:return ui(),e===null&&Fc(t.stateNode.containerInfo),$(t),null;case 10:return ea(t.type),$(t),null;case 19:if(xe(oe),l=t.memoizedState,l===null)return $(t),null;if(i=(t.flags&128)!==0,n=l.rendering,n===null)if(i)Wi(l,!1);else{if(ue!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(n=or(e),n!==null){for(t.flags|=128,Wi(l,!1),e=n.updateQueue,t.updateQueue=e,_s(t,e),t.subtreeFlags=0,e=a,a=t.child;a!==null;)Bh(a,e),a=a.sibling;return k(oe,oe.current&1|2),X&&Kt(t,l.treeForkCount),t.child}e=e.sibling}l.tail!==null&&Ke()>pr&&(t.flags|=128,i=!0,Wi(l,!1),t.lanes=4194304)}else{if(!i)if(e=or(n),e!==null){if(t.flags|=128,i=!0,e=e.updateQueue,t.updateQueue=e,_s(t,e),Wi(l,!0),l.tail===null&&l.tailMode==="hidden"&&!n.alternate&&!X)return $(t),null}else 2*Ke()-l.renderingStartTime>pr&&a!==536870912&&(t.flags|=128,i=!0,Wi(l,!1),t.lanes=4194304);l.isBackwards?(n.sibling=t.child,t.child=n):(e=l.last,e!==null?e.sibling=n:t.child=n,l.last=n)}return l.tail!==null?(e=l.tail,l.rendering=e,l.tail=e.sibling,l.renderingStartTime=Ke(),e.sibling=null,a=oe.current,k(oe,i?a&1|2:a&1),X&&Kt(t,l.treeForkCount),e):($(t),null);case 22:case 23:return Qe(t),Gc(),l=t.memoizedState!==null,e!==null?e.memoizedState!==null!==l&&(t.flags|=8192):l&&(t.flags|=8192),l?(a&536870912)!==0&&(t.flags&128)===0&&($(t),t.subtreeFlags&6&&(t.flags|=8192)):$(t),a=t.updateQueue,a!==null&&_s(t,a.retryQueue),a=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),l=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(l=t.memoizedState.cachePool.pool),l!==a&&(t.flags|=2048),e!==null&&xe(ul),null;case 24:return a=null,e!==null&&(a=e.memoizedState.cache),t.memoizedState.cache!==a&&(t.flags|=2048),ea(me),$(t),null;case 25:return null;case 30:return null}throw Error(v(156,t.tag))}function Rv(e,t){switch(Mc(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return ea(me),ui(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return er(t),null;case 31:if(t.memoizedState!==null){if(Qe(t),t.alternate===null)throw Error(v(340));fl()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(Qe(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(v(340));fl()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return xe(oe),null;case 4:return ui(),null;case 10:return ea(t.type),null;case 22:case 23:return Qe(t),Gc(),e!==null&&xe(ul),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return ea(me),null;case 25:return null;default:return null}}function Bp(e,t){switch(Mc(t),t.tag){case 3:ea(me),ui();break;case 26:case 27:case 5:er(t);break;case 4:ui();break;case 31:t.memoizedState!==null&&Qe(t);break;case 13:Qe(t);break;case 19:xe(oe);break;case 10:ea(t.type);break;case 22:case 23:Qe(t),Gc(),e!==null&&xe(ul);break;case 24:ea(me)}}function jn(e,t){try{var a=t.updateQueue,l=a!==null?a.lastEffect:null;if(l!==null){var i=l.next;a=i;do{if((a.tag&e)===e){l=void 0;var n=a.create,s=a.inst;l=n(),s.destroy=l}a=a.next}while(a!==i)}}catch(r){Q(t,t.return,r)}}function ja(e,t,a){try{var l=t.updateQueue,i=l!==null?l.lastEffect:null;if(i!==null){var n=i.next;l=n;do{if((l.tag&e)===e){var s=l.inst,r=s.destroy;if(r!==void 0){s.destroy=void 0,i=t;var u=a,c=r;try{c()}catch(f){Q(i,u,f)}}}l=l.next}while(l!==n)}}catch(f){Q(t,t.return,f)}}function Lp(e){var t=e.updateQueue;if(t!==null){var a=e.stateNode;try{Fh(t,a)}catch(l){Q(e,e.return,l)}}}function Yp(e,t,a){a.props=pl(e.type,e.memoizedProps),a.state=e.memoizedState;try{a.componentWillUnmount()}catch(l){Q(e,t,l)}}function pn(e,t){try{var a=e.ref;if(a!==null){switch(e.tag){case 26:case 27:case 5:var l=e.stateNode;break;case 30:l=e.stateNode;break;default:l=e.stateNode}typeof a=="function"?e.refCleanup=a(l):a.current=l}}catch(i){Q(e,t,i)}}function Rt(e,t){var a=e.ref,l=e.refCleanup;if(a!==null)if(typeof l=="function")try{l()}catch(i){Q(e,t,i)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof a=="function")try{a(null)}catch(i){Q(e,t,i)}else a.current=null}function qp(e){var t=e.type,a=e.memoizedProps,l=e.stateNode;try{e:switch(t){case"button":case"input":case"select":case"textarea":a.autoFocus&&l.focus();break e;case"img":a.src?l.src=a.src:a.srcSet&&(l.srcset=a.srcSet)}}catch(i){Q(e,e.return,i)}}function Iu(e,t,a){try{var l=e.stateNode;Jv(l,e.type,a,t),l[Ye]=t}catch(i){Q(e,e.return,i)}}function Xp(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Qa(e.type)||e.tag===4}function $u(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Xp(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Qa(e.type)||e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function jo(e,t,a){var l=e.tag;if(l===5||l===6)e=e.stateNode,t?(a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a).insertBefore(e,t):(t=a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a,t.appendChild(e),a=a._reactRootContainer,a!=null||t.onclick!==null||(t.onclick=Wt));else if(l!==4&&(l===27&&Qa(e.type)&&(a=e.stateNode,t=null),e=e.child,e!==null))for(jo(e,t,a),e=e.sibling;e!==null;)jo(e,t,a),e=e.sibling}function hr(e,t,a){var l=e.tag;if(l===5||l===6)e=e.stateNode,t?a.insertBefore(e,t):a.appendChild(e);else if(l!==4&&(l===27&&Qa(e.type)&&(a=e.stateNode),e=e.child,e!==null))for(hr(e,t,a),e=e.sibling;e!==null;)hr(e,t,a),e=e.sibling}function jp(e){var t=e.stateNode,a=e.memoizedProps;try{for(var l=e.type,i=t.attributes;i.length;)t.removeAttributeNode(i[0]);ze(t,l,a),t[Ge]=e,t[Ye]=a}catch(n){Q(e,e.return,n)}}var Jt=!1,de=!1,eo=!1,Sm=typeof WeakSet=="function"?WeakSet:Set,Me=null;function _v(e,t){if(e=e.containerInfo,Jo=Gr,e=Rh(e),pc(e)){if("selectionStart"in e)var a={start:e.selectionStart,end:e.selectionEnd};else e:{a=(a=e.ownerDocument)&&a.defaultView||window;var l=a.getSelection&&a.getSelection();if(l&&l.rangeCount!==0){a=l.anchorNode;var i=l.anchorOffset,n=l.focusNode;l=l.focusOffset;try{a.nodeType,n.nodeType}catch{a=null;break e}var s=0,r=-1,u=-1,c=0,f=0,y=e,m=null;t:for(;;){for(var p;y!==a||i!==0&&y.nodeType!==3||(r=s+i),y!==n||l!==0&&y.nodeType!==3||(u=s+l),y.nodeType===3&&(s+=y.nodeValue.length),(p=y.firstChild)!==null;)m=y,y=p;for(;;){if(y===e)break t;if(m===a&&++c===i&&(r=s),m===n&&++f===l&&(u=s),(p=y.nextSibling)!==null)break;y=m,m=y.parentNode}y=p}a=r===-1||u===-1?null:{start:r,end:u}}else a=null}a=a||{start:0,end:0}}else a=null;for(ko={focusedElem:e,selectionRange:a},Gr=!1,Me=t;Me!==null;)if(t=Me,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,Me=e;else for(;Me!==null;){switch(t=Me,n=t.alternate,e=t.flags,t.tag){case 0:if((e&4)!==0&&(e=t.updateQueue,e=e!==null?e.events:null,e!==null))for(a=0;a<e.length;a++)i=e[a],i.ref.impl=i.nextImpl;break;case 11:case 15:break;case 1:if((e&1024)!==0&&n!==null){e=void 0,a=t,i=n.memoizedProps,n=n.memoizedState,l=a.stateNode;try{var M=pl(a.type,i);e=l.getSnapshotBeforeUpdate(M,n),l.__reactInternalSnapshotBeforeUpdate=e}catch(x){Q(a,a.return,x)}}break;case 3:if((e&1024)!==0){if(e=t.stateNode.containerInfo,a=e.nodeType,a===9)Io(e);else if(a===1)switch(e.nodeName){case"HEAD":case"HTML":case"BODY":Io(e);break;default:e.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((e&1024)!==0)throw Error(v(163))}if(e=t.sibling,e!==null){e.return=t.return,Me=e;break}Me=t.return}}function Zp(e,t,a){var l=a.flags;switch(a.tag){case 0:case 11:case 15:Pt(e,a),l&4&&jn(5,a);break;case 1:if(Pt(e,a),l&4)if(e=a.stateNode,t===null)try{e.componentDidMount()}catch(s){Q(a,a.return,s)}else{var i=pl(a.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(i,t,e.__reactInternalSnapshotBeforeUpdate)}catch(s){Q(a,a.return,s)}}l&64&&Lp(a),l&512&&pn(a,a.return);break;case 3:if(Pt(e,a),l&64&&(e=a.updateQueue,e!==null)){if(t=null,a.child!==null)switch(a.child.tag){case 27:case 5:t=a.child.stateNode;break;case 1:t=a.child.stateNode}try{Fh(e,t)}catch(s){Q(a,a.return,s)}}break;case 27:t===null&&l&4&&jp(a);case 26:case 5:Pt(e,a),t===null&&l&4&&qp(a),l&512&&pn(a,a.return);break;case 12:Pt(e,a);break;case 31:Pt(e,a),l&4&&Pp(e,a);break;case 13:Pt(e,a),l&4&&Fp(e,a),l&64&&(e=a.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(a=Yv.bind(null,a),lb(e,a))));break;case 22:if(l=a.memoizedState!==null||Jt,!l){t=t!==null&&t.memoizedState!==null||de,i=Jt;var n=de;Jt=l,(de=t)&&!n?Ft(e,a,(a.subtreeFlags&8772)!==0):Pt(e,a),Jt=i,de=n}break;case 30:break;default:Pt(e,a)}}function Vp(e){var t=e.alternate;t!==null&&(e.alternate=null,Vp(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&oc(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var ie=null,Ue=!1;function Qt(e,t,a){for(a=a.child;a!==null;)Qp(e,t,a),a=a.sibling}function Qp(e,t,a){if(Je&&typeof Je.onCommitFiberUnmount=="function")try{Je.onCommitFiberUnmount(Hn,a)}catch{}switch(a.tag){case 26:de||Rt(a,t),Qt(e,t,a),a.memoizedState?a.memoizedState.count--:a.stateNode&&(a=a.stateNode,a.parentNode.removeChild(a));break;case 27:de||Rt(a,t);var l=ie,i=Ue;Qa(a.type)&&(ie=a.stateNode,Ue=!1),Qt(e,t,a),bn(a.stateNode),ie=l,Ue=i;break;case 5:de||Rt(a,t);case 6:if(l=ie,i=Ue,ie=null,Qt(e,t,a),ie=l,Ue=i,ie!==null)if(Ue)try{(ie.nodeType===9?ie.body:ie.nodeName==="HTML"?ie.ownerDocument.body:ie).removeChild(a.stateNode)}catch(n){Q(a,t,n)}else try{ie.removeChild(a.stateNode)}catch(n){Q(a,t,n)}break;case 18:ie!==null&&(Ue?(e=ie,Um(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,a.stateNode),vi(e)):Um(ie,a.stateNode));break;case 4:l=ie,i=Ue,ie=a.stateNode.containerInfo,Ue=!0,Qt(e,t,a),ie=l,Ue=i;break;case 0:case 11:case 14:case 15:ja(2,a,t),de||ja(4,a,t),Qt(e,t,a);break;case 1:de||(Rt(a,t),l=a.stateNode,typeof l.componentWillUnmount=="function"&&Yp(a,t,l)),Qt(e,t,a);break;case 21:Qt(e,t,a);break;case 22:de=(l=de)||a.memoizedState!==null,Qt(e,t,a),de=l;break;default:Qt(e,t,a)}}function Pp(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{vi(e)}catch(a){Q(t,t.return,a)}}}function Fp(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{vi(e)}catch(a){Q(t,t.return,a)}}function Dv(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new Sm),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new Sm),t;default:throw Error(v(435,e.tag))}}function Ds(e,t){var a=Dv(e);t.forEach(function(l){if(!a.has(l)){a.add(l);var i=qv.bind(null,e,l);l.then(i,i)}})}function Ne(e,t){var a=t.deletions;if(a!==null)for(var l=0;l<a.length;l++){var i=a[l],n=e,s=t,r=s;e:for(;r!==null;){switch(r.tag){case 27:if(Qa(r.type)){ie=r.stateNode,Ue=!1;break e}break;case 5:ie=r.stateNode,Ue=!1;break e;case 3:case 4:ie=r.stateNode.containerInfo,Ue=!0;break e}r=r.return}if(ie===null)throw Error(v(160));Qp(n,s,i),ie=null,Ue=!1,n=i.alternate,n!==null&&(n.return=null),i.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)Kp(t,e),t=t.sibling}var vt=null;function Kp(e,t){var a=e.alternate,l=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:Ne(t,e),He(e),l&4&&(ja(3,e,e.return),jn(3,e),ja(5,e,e.return));break;case 1:Ne(t,e),He(e),l&512&&(de||a===null||Rt(a,a.return)),l&64&&Jt&&(e=e.updateQueue,e!==null&&(l=e.callbacks,l!==null&&(a=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=a===null?l:a.concat(l))));break;case 26:var i=vt;if(Ne(t,e),He(e),l&512&&(de||a===null||Rt(a,a.return)),l&4){var n=a!==null?a.memoizedState:null;if(l=e.memoizedState,a===null)if(l===null)if(e.stateNode===null){e:{l=e.type,a=e.memoizedProps,i=i.ownerDocument||i;t:switch(l){case"title":n=i.getElementsByTagName("title")[0],(!n||n[Ln]||n[Ge]||n.namespaceURI==="http://www.w3.org/2000/svg"||n.hasAttribute("itemprop"))&&(n=i.createElement(l),i.head.insertBefore(n,i.querySelector("head > title"))),ze(n,l,a),n[Ge]=e,Se(n),l=n;break e;case"link":var s=Zm("link","href",i).get(l+(a.href||""));if(s){for(var r=0;r<s.length;r++)if(n=s[r],n.getAttribute("href")===(a.href==null||a.href===""?null:a.href)&&n.getAttribute("rel")===(a.rel==null?null:a.rel)&&n.getAttribute("title")===(a.title==null?null:a.title)&&n.getAttribute("crossorigin")===(a.crossOrigin==null?null:a.crossOrigin)){s.splice(r,1);break t}}n=i.createElement(l),ze(n,l,a),i.head.appendChild(n);break;case"meta":if(s=Zm("meta","content",i).get(l+(a.content||""))){for(r=0;r<s.length;r++)if(n=s[r],n.getAttribute("content")===(a.content==null?null:""+a.content)&&n.getAttribute("name")===(a.name==null?null:a.name)&&n.getAttribute("property")===(a.property==null?null:a.property)&&n.getAttribute("http-equiv")===(a.httpEquiv==null?null:a.httpEquiv)&&n.getAttribute("charset")===(a.charSet==null?null:a.charSet)){s.splice(r,1);break t}}n=i.createElement(l),ze(n,l,a),i.head.appendChild(n);break;default:throw Error(v(468,l))}n[Ge]=e,Se(n),l=n}e.stateNode=l}else Vm(i,e.type,e.stateNode);else e.stateNode=jm(i,l,e.memoizedProps);else n!==l?(n===null?a.stateNode!==null&&(a=a.stateNode,a.parentNode.removeChild(a)):n.count--,l===null?Vm(i,e.type,e.stateNode):jm(i,l,e.memoizedProps)):l===null&&e.stateNode!==null&&Iu(e,e.memoizedProps,a.memoizedProps)}break;case 27:Ne(t,e),He(e),l&512&&(de||a===null||Rt(a,a.return)),a!==null&&l&4&&Iu(e,e.memoizedProps,a.memoizedProps);break;case 5:if(Ne(t,e),He(e),l&512&&(de||a===null||Rt(a,a.return)),e.flags&32){i=e.stateNode;try{ci(i,"")}catch(M){Q(e,e.return,M)}}l&4&&e.stateNode!=null&&(i=e.memoizedProps,Iu(e,i,a!==null?a.memoizedProps:i)),l&1024&&(eo=!0);break;case 6:if(Ne(t,e),He(e),l&4){if(e.stateNode===null)throw Error(v(162));l=e.memoizedProps,a=e.stateNode;try{a.nodeValue=l}catch(M){Q(e,e.return,M)}}break;case 3:if(Js=null,i=vt,vt=xr(t.containerInfo),Ne(t,e),vt=i,He(e),l&4&&a!==null&&a.memoizedState.isDehydrated)try{vi(t.containerInfo)}catch(M){Q(e,e.return,M)}eo&&(eo=!1,Jp(e));break;case 4:l=vt,vt=xr(e.stateNode.containerInfo),Ne(t,e),He(e),vt=l;break;case 12:Ne(t,e),He(e);break;case 31:Ne(t,e),He(e),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,Ds(e,l)));break;case 13:Ne(t,e),He(e),e.child.flags&8192&&e.memoizedState!==null!=(a!==null&&a.memoizedState!==null)&&(Lr=Ke()),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,Ds(e,l)));break;case 22:i=e.memoizedState!==null;var u=a!==null&&a.memoizedState!==null,c=Jt,f=de;if(Jt=c||i,de=f||u,Ne(t,e),de=f,Jt=c,He(e),l&8192)e:for(t=e.stateNode,t._visibility=i?t._visibility&-2:t._visibility|1,i&&(a===null||u||Jt||de||nl(e)),a=null,t=e;;){if(t.tag===5||t.tag===26){if(a===null){u=a=t;try{if(n=u.stateNode,i)s=n.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none";else{r=u.stateNode;var y=u.memoizedProps.style,m=y!=null&&y.hasOwnProperty("display")?y.display:null;r.style.display=m==null||typeof m=="boolean"?"":(""+m).trim()}}catch(M){Q(u,u.return,M)}}}else if(t.tag===6){if(a===null){u=t;try{u.stateNode.nodeValue=i?"":u.memoizedProps}catch(M){Q(u,u.return,M)}}}else if(t.tag===18){if(a===null){u=t;try{var p=u.stateNode;i?Bm(p,!0):Bm(u.stateNode,!1)}catch(M){Q(u,u.return,M)}}}else if((t.tag!==22&&t.tag!==23||t.memoizedState===null||t===e)&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;a===t&&(a=null),t=t.return}a===t&&(a=null),t.sibling.return=t.return,t=t.sibling}l&4&&(l=e.updateQueue,l!==null&&(a=l.retryQueue,a!==null&&(l.retryQueue=null,Ds(e,a))));break;case 19:Ne(t,e),He(e),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,Ds(e,l)));break;case 30:break;case 21:break;default:Ne(t,e),He(e)}}function He(e){var t=e.flags;if(t&2){try{for(var a,l=e.return;l!==null;){if(Xp(l)){a=l;break}l=l.return}if(a==null)throw Error(v(160));switch(a.tag){case 27:var i=a.stateNode,n=$u(e);hr(e,n,i);break;case 5:var s=a.stateNode;a.flags&32&&(ci(s,""),a.flags&=-33);var r=$u(e);hr(e,r,s);break;case 3:case 4:var u=a.stateNode.containerInfo,c=$u(e);jo(e,c,u);break;default:throw Error(v(161))}}catch(f){Q(e,e.return,f)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Jp(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;Jp(t),t.tag===5&&t.flags&1024&&t.stateNode.reset(),e=e.sibling}}function Pt(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)Zp(e,t.alternate,t),t=t.sibling}function nl(e){for(e=e.child;e!==null;){var t=e;switch(t.tag){case 0:case 11:case 14:case 15:ja(4,t,t.return),nl(t);break;case 1:Rt(t,t.return);var a=t.stateNode;typeof a.componentWillUnmount=="function"&&Yp(t,t.return,a),nl(t);break;case 27:bn(t.stateNode);case 26:case 5:Rt(t,t.return),nl(t);break;case 22:t.memoizedState===null&&nl(t);break;case 30:nl(t);break;default:nl(t)}e=e.sibling}}function Ft(e,t,a){for(a=a&&(t.subtreeFlags&8772)!==0,t=t.child;t!==null;){var l=t.alternate,i=e,n=t,s=n.flags;switch(n.tag){case 0:case 11:case 15:Ft(i,n,a),jn(4,n);break;case 1:if(Ft(i,n,a),l=n,i=l.stateNode,typeof i.componentDidMount=="function")try{i.componentDidMount()}catch(c){Q(l,l.return,c)}if(l=n,i=l.updateQueue,i!==null){var r=l.stateNode;try{var u=i.shared.hiddenCallbacks;if(u!==null)for(i.shared.hiddenCallbacks=null,i=0;i<u.length;i++)Ph(u[i],r)}catch(c){Q(l,l.return,c)}}a&&s&64&&Lp(n),pn(n,n.return);break;case 27:jp(n);case 26:case 5:Ft(i,n,a),a&&l===null&&s&4&&qp(n),pn(n,n.return);break;case 12:Ft(i,n,a);break;case 31:Ft(i,n,a),a&&s&4&&Pp(i,n);break;case 13:Ft(i,n,a),a&&s&4&&Fp(i,n);break;case 22:n.memoizedState===null&&Ft(i,n,a),pn(n,n.return);break;case 30:break;default:Ft(i,n,a)}t=t.sibling}}function Xc(e,t){var a=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(a=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==a&&(e!=null&&e.refCount++,a!=null&&qn(a))}function jc(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&qn(e))}function gt(e,t,a,l){if(t.subtreeFlags&10256)for(t=t.child;t!==null;)kp(e,t,a,l),t=t.sibling}function kp(e,t,a,l){var i=t.flags;switch(t.tag){case 0:case 11:case 15:gt(e,t,a,l),i&2048&&jn(9,t);break;case 1:gt(e,t,a,l);break;case 3:gt(e,t,a,l),i&2048&&(e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&qn(e)));break;case 12:if(i&2048){gt(e,t,a,l),e=t.stateNode;try{var n=t.memoizedProps,s=n.id,r=n.onPostCommit;typeof r=="function"&&r(s,t.alternate===null?"mount":"update",e.passiveEffectDuration,-0)}catch(u){Q(t,t.return,u)}}else gt(e,t,a,l);break;case 31:gt(e,t,a,l);break;case 13:gt(e,t,a,l);break;case 23:break;case 22:n=t.stateNode,s=t.alternate,t.memoizedState!==null?n._visibility&2?gt(e,t,a,l):yn(e,t):n._visibility&2?gt(e,t,a,l):(n._visibility|=2,Xl(e,t,a,l,(t.subtreeFlags&10256)!==0||!1)),i&2048&&Xc(s,t);break;case 24:gt(e,t,a,l),i&2048&&jc(t.alternate,t);break;default:gt(e,t,a,l)}}function Xl(e,t,a,l,i){for(i=i&&((t.subtreeFlags&10256)!==0||!1),t=t.child;t!==null;){var n=e,s=t,r=a,u=l,c=s.flags;switch(s.tag){case 0:case 11:case 15:Xl(n,s,r,u,i),jn(8,s);break;case 23:break;case 22:var f=s.stateNode;s.memoizedState!==null?f._visibility&2?Xl(n,s,r,u,i):yn(n,s):(f._visibility|=2,Xl(n,s,r,u,i)),i&&c&2048&&Xc(s.alternate,s);break;case 24:Xl(n,s,r,u,i),i&&c&2048&&jc(s.alternate,s);break;default:Xl(n,s,r,u,i)}t=t.sibling}}function yn(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var a=e,l=t,i=l.flags;switch(l.tag){case 22:yn(a,l),i&2048&&Xc(l.alternate,l);break;case 24:yn(a,l),i&2048&&jc(l.alternate,l);break;default:yn(a,l)}t=t.sibling}}var sn=8192;function ql(e,t,a){if(e.subtreeFlags&sn)for(e=e.child;e!==null;)Wp(e,t,a),e=e.sibling}function Wp(e,t,a){switch(e.tag){case 26:ql(e,t,a),e.flags&sn&&e.memoizedState!==null&&pb(a,vt,e.memoizedState,e.memoizedProps);break;case 5:ql(e,t,a);break;case 3:case 4:var l=vt;vt=xr(e.stateNode.containerInfo),ql(e,t,a),vt=l;break;case 22:e.memoizedState===null&&(l=e.alternate,l!==null&&l.memoizedState!==null?(l=sn,sn=16777216,ql(e,t,a),sn=l):ql(e,t,a));break;default:ql(e,t,a)}}function Ip(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function Ii(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var a=0;a<t.length;a++){var l=t[a];Me=l,ey(l,e)}Ip(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)$p(e),e=e.sibling}function $p(e){switch(e.tag){case 0:case 11:case 15:Ii(e),e.flags&2048&&ja(9,e,e.return);break;case 3:Ii(e);break;case 12:Ii(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,Fs(e)):Ii(e);break;default:Ii(e)}}function Fs(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var a=0;a<t.length;a++){var l=t[a];Me=l,ey(l,e)}Ip(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:ja(8,t,t.return),Fs(t);break;case 22:a=t.stateNode,a._visibility&2&&(a._visibility&=-3,Fs(t));break;default:Fs(t)}e=e.sibling}}function ey(e,t){for(;Me!==null;){var a=Me;switch(a.tag){case 0:case 11:case 15:ja(8,a,t);break;case 23:case 22:if(a.memoizedState!==null&&a.memoizedState.cachePool!==null){var l=a.memoizedState.cachePool.pool;l!=null&&l.refCount++}break;case 24:qn(a.memoizedState.cache)}if(l=a.child,l!==null)l.return=a,Me=l;else e:for(a=e;Me!==null;){l=Me;var i=l.sibling,n=l.return;if(Vp(l),l===a){Me=null;break e}if(i!==null){i.return=n,Me=i;break e}Me=n}}}var Ov={getCacheForType:function(e){var t=Ae(me),a=t.data.get(e);return a===void 0&&(a=e(),t.data.set(e,a)),a},cacheSignal:function(){return Ae(me).controller.signal}},wv=typeof WeakMap=="function"?WeakMap:Map,j=0,K=null,L=null,Y=0,V=0,Ve=null,za=!1,Ei=!1,Zc=!1,sa=0,ue=0,Za=0,cl=0,Vc=0,Fe=0,hi=0,gn=null,Be=null,Zo=!1,Lr=0,ty=0,pr=1/0,yr=null,Ha=null,ye=0,Ua=null,pi=null,ta=0,Vo=0,Qo=null,ay=null,vn=0,Po=null;function We(){return(j&2)!==0&&Y!==0?Y&-Y:R.T!==null?Pc():fh()}function ly(){if(Fe===0)if((Y&536870912)===0||X){var e=Ss;Ss<<=1,(Ss&3932160)===0&&(Ss=262144),Fe=e}else Fe=536870912;return e=$e.current,e!==null&&(e.flags|=32),Fe}function Le(e,t,a){(e===K&&(V===2||V===9)||e.cancelPendingCommit!==null)&&(yi(e,0),Ra(e,Y,Fe,!1)),Bn(e,a),((j&2)===0||e!==K)&&(e===K&&((j&2)===0&&(cl|=a),ue===4&&Ra(e,Y,Fe,!1)),Ot(e))}function iy(e,t,a){if((j&6)!==0)throw Error(v(327));var l=!a&&(t&127)===0&&(t&e.expiredLanes)===0||Un(e,t),i=l?Uv(e,t):to(e,t,!0),n=l;do{if(i===0){Ei&&!l&&Ra(e,t,0,!1);break}else{if(a=e.current.alternate,n&&!Nv(a)){i=to(e,t,!1),n=!1;continue}if(i===2){if(n=t,e.errorRecoveryDisabledLanes&n)var s=0;else s=e.pendingLanes&-536870913,s=s!==0?s:s&536870912?536870912:0;if(s!==0){t=s;e:{var r=e;i=gn;var u=r.current.memoizedState.isDehydrated;if(u&&(yi(r,s).flags|=256),s=to(r,s,!1),s!==2){if(Zc&&!u){r.errorRecoveryDisabledLanes|=n,cl|=n,i=4;break e}n=Be,Be=i,n!==null&&(Be===null?Be=n:Be.push.apply(Be,n))}i=s}if(n=!1,i!==2)continue}}if(i===1){yi(e,0),Ra(e,t,0,!0);break}e:{switch(l=e,n=i,n){case 0:case 1:throw Error(v(345));case 4:if((t&4194048)!==t)break;case 6:Ra(l,t,Fe,!za);break e;case 2:Be=null;break;case 3:case 5:break;default:throw Error(v(329))}if((t&62914560)===t&&(i=Lr+300-Ke(),10<i)){if(Ra(l,t,Fe,!za),Ar(l,0,!0)!==0)break e;ta=t,l.timeoutHandle=Ty(xm.bind(null,l,a,Be,yr,Zo,t,Fe,cl,hi,za,n,"Throttled",-0,0),i);break e}xm(l,a,Be,yr,Zo,t,Fe,cl,hi,za,n,null,-0,0)}}break}while(!0);Ot(e)}function xm(e,t,a,l,i,n,s,r,u,c,f,y,m,p){if(e.timeoutHandle=-1,y=t.subtreeFlags,y&8192||(y&16785408)===16785408){y={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:Wt},Wp(t,n,y);var M=(n&62914560)===n?Lr-Ke():(n&4194048)===n?ty-Ke():0;if(M=yb(y,M),M!==null){ta=n,e.cancelPendingCommit=M(Tm.bind(null,e,t,n,a,l,i,s,r,u,f,y,null,m,p)),Ra(e,n,s,!c);return}}Tm(e,t,n,a,l,i,s,r,u)}function Nv(e){for(var t=e;;){var a=t.tag;if((a===0||a===11||a===15)&&t.flags&16384&&(a=t.updateQueue,a!==null&&(a=a.stores,a!==null)))for(var l=0;l<a.length;l++){var i=a[l],n=i.getSnapshot;i=i.value;try{if(!Ie(n(),i))return!1}catch{return!1}}if(a=t.child,t.subtreeFlags&16384&&a!==null)a.return=t,t=a;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Ra(e,t,a,l){t&=~Vc,t&=~cl,e.suspendedLanes|=t,e.pingedLanes&=~t,l&&(e.warmLanes|=t),l=e.expirationTimes;for(var i=t;0<i;){var n=31-ke(i),s=1<<n;l[n]=-1,i&=~s}a!==0&&uh(e,a,t)}function Yr(){return(j&6)===0?(Zn(0,!1),!1):!0}function Qc(){if(L!==null){if(V===0)var e=L.return;else e=L,It=Ml=null,_c(e),ni=null,Cn=0,e=L;for(;e!==null;)Bp(e.alternate,e),e=e.return;L=null}}function yi(e,t){var a=e.timeoutHandle;a!==-1&&(e.timeoutHandle=-1,Iv(a)),a=e.cancelPendingCommit,a!==null&&(e.cancelPendingCommit=null,a()),ta=0,Qc(),K=e,L=a=$t(e.current,null),Y=t,V=0,Ve=null,za=!1,Ei=Un(e,t),Zc=!1,hi=Fe=Vc=cl=Za=ue=0,Be=gn=null,Zo=!1,(t&8)!==0&&(t|=t&32);var l=e.entangledLanes;if(l!==0)for(e=e.entanglements,l&=t;0<l;){var i=31-ke(l),n=1<<i;t|=e[i],l&=~n}return sa=t,Dr(),a}function ny(e,t){w=null,R.H=zn,t===xi||t===wr?(t=em(),V=3):t===Ec?(t=em(),V=4):V=t===Yc?8:t!==null&&typeof t=="object"&&typeof t.then=="function"?6:1,Ve=t,L===null&&(ue=1,dr(e,ft(t,e.current)))}function sy(){var e=$e.current;return e===null?!0:(Y&4194048)===Y?mt===null:(Y&62914560)===Y||(Y&536870912)!==0?e===mt:!1}function ry(){var e=R.H;return R.H=zn,e===null?zn:e}function uy(){var e=R.A;return R.A=Ov,e}function gr(){ue=4,za||(Y&4194048)!==Y&&$e.current!==null||(Ei=!0),(Za&134217727)===0&&(cl&134217727)===0||K===null||Ra(K,Y,Fe,!1)}function to(e,t,a){var l=j;j|=2;var i=ry(),n=uy();(K!==e||Y!==t)&&(yr=null,yi(e,t)),t=!1;var s=ue;e:do try{if(V!==0&&L!==null){var r=L,u=Ve;switch(V){case 8:Qc(),s=6;break e;case 3:case 2:case 9:case 6:$e.current===null&&(t=!0);var c=V;if(V=0,Ve=null,ei(e,r,u,c),a&&Ei){s=0;break e}break;default:c=V,V=0,Ve=null,ei(e,r,u,c)}}Hv(),s=ue;break}catch(f){ny(e,f)}while(!0);return t&&e.shellSuspendCounter++,It=Ml=null,j=l,R.H=i,R.A=n,L===null&&(K=null,Y=0,Dr()),s}function Hv(){for(;L!==null;)oy(L)}function Uv(e,t){var a=j;j|=2;var l=ry(),i=uy();K!==e||Y!==t?(yr=null,pr=Ke()+500,yi(e,t)):Ei=Un(e,t);e:do try{if(V!==0&&L!==null){t=L;var n=Ve;t:switch(V){case 1:V=0,Ve=null,ei(e,t,n,1);break;case 2:case 9:if($d(n)){V=0,Ve=null,Em(t);break}t=function(){V!==2&&V!==9||K!==e||(V=7),Ot(e)},n.then(t,t);break e;case 3:V=7;break e;case 4:V=5;break e;case 7:$d(n)?(V=0,Ve=null,Em(t)):(V=0,Ve=null,ei(e,t,n,7));break;case 5:var s=null;switch(L.tag){case 26:s=L.memoizedState;case 5:case 27:var r=L;if(s?Ry(s):r.stateNode.complete){V=0,Ve=null;var u=r.sibling;if(u!==null)L=u;else{var c=r.return;c!==null?(L=c,qr(c)):L=null}break t}}V=0,Ve=null,ei(e,t,n,5);break;case 6:V=0,Ve=null,ei(e,t,n,6);break;case 8:Qc(),ue=6;break e;default:throw Error(v(462))}}Bv();break}catch(f){ny(e,f)}while(!0);return It=Ml=null,R.H=l,R.A=i,j=a,L!==null?0:(K=null,Y=0,Dr(),ue)}function Bv(){for(;L!==null&&!s1();)oy(L)}function oy(e){var t=Up(e.alternate,e,sa);e.memoizedProps=e.pendingProps,t===null?qr(e):L=t}function Em(e){var t=e,a=t.alternate;switch(t.tag){case 15:case 0:t=ym(a,t,t.pendingProps,t.type,void 0,Y);break;case 11:t=ym(a,t,t.pendingProps,t.type.render,t.ref,Y);break;case 5:_c(t);default:Bp(a,t),t=L=Bh(t,sa),t=Up(a,t,sa)}e.memoizedProps=e.pendingProps,t===null?qr(e):L=t}function ei(e,t,a,l){It=Ml=null,_c(t),ni=null,Cn=0;var i=t.return;try{if(Gv(e,i,t,a,Y)){ue=1,dr(e,ft(a,e.current)),L=null;return}}catch(n){if(i!==null)throw L=i,n;ue=1,dr(e,ft(a,e.current)),L=null;return}t.flags&32768?(X||l===1?e=!0:Ei||(Y&536870912)!==0?e=!1:(za=e=!0,(l===2||l===9||l===3||l===6)&&(l=$e.current,l!==null&&l.tag===13&&(l.flags|=16384))),cy(t,e)):qr(t)}function qr(e){var t=e;do{if((t.flags&32768)!==0){cy(t,za);return}e=t.return;var a=zv(t.alternate,t,sa);if(a!==null){L=a;return}if(t=t.sibling,t!==null){L=t;return}L=t=e}while(t!==null);ue===0&&(ue=5)}function cy(e,t){do{var a=Rv(e.alternate,e);if(a!==null){a.flags&=32767,L=a;return}if(a=e.return,a!==null&&(a.flags|=32768,a.subtreeFlags=0,a.deletions=null),!t&&(e=e.sibling,e!==null)){L=e;return}L=e=a}while(e!==null);ue=6,L=null}function Tm(e,t,a,l,i,n,s,r,u){e.cancelPendingCommit=null;do Xr();while(ye!==0);if((j&6)!==0)throw Error(v(327));if(t!==null){if(t===e.current)throw Error(v(177));if(n=t.lanes|t.childLanes,n|=yc,y1(e,a,n,s,r,u),e===K&&(L=K=null,Y=0),pi=t,Ua=e,ta=a,Vo=n,Qo=i,ay=l,(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?(e.callbackNode=null,e.callbackPriority=0,Xv(tr,function(){return py(),null})):(e.callbackNode=null,e.callbackPriority=0),l=(t.flags&13878)!==0,(t.subtreeFlags&13878)!==0||l){l=R.T,R.T=null,i=Z.p,Z.p=2,s=j,j|=4;try{_v(e,t,a)}finally{j=s,Z.p=i,R.T=l}}ye=1,fy(),dy(),my()}}function fy(){if(ye===1){ye=0;var e=Ua,t=pi,a=(t.flags&13878)!==0;if((t.subtreeFlags&13878)!==0||a){a=R.T,R.T=null;var l=Z.p;Z.p=2;var i=j;j|=4;try{Kp(t,e);var n=ko,s=Rh(e.containerInfo),r=n.focusedElem,u=n.selectionRange;if(s!==r&&r&&r.ownerDocument&&zh(r.ownerDocument.documentElement,r)){if(u!==null&&pc(r)){var c=u.start,f=u.end;if(f===void 0&&(f=c),"selectionStart"in r)r.selectionStart=c,r.selectionEnd=Math.min(f,r.value.length);else{var y=r.ownerDocument||document,m=y&&y.defaultView||window;if(m.getSelection){var p=m.getSelection(),M=r.textContent.length,x=Math.min(u.start,M),N=u.end===void 0?x:Math.min(u.end,M);!p.extend&&x>N&&(s=N,N=x,x=s);var d=Pd(r,x),o=Pd(r,N);if(d&&o&&(p.rangeCount!==1||p.anchorNode!==d.node||p.anchorOffset!==d.offset||p.focusNode!==o.node||p.focusOffset!==o.offset)){var h=y.createRange();h.setStart(d.node,d.offset),p.removeAllRanges(),x>N?(p.addRange(h),p.extend(o.node,o.offset)):(h.setEnd(o.node,o.offset),p.addRange(h))}}}}for(y=[],p=r;p=p.parentNode;)p.nodeType===1&&y.push({element:p,left:p.scrollLeft,top:p.scrollTop});for(typeof r.focus=="function"&&r.focus(),r=0;r<y.length;r++){var g=y[r];g.element.scrollLeft=g.left,g.element.scrollTop=g.top}}Gr=!!Jo,ko=Jo=null}finally{j=i,Z.p=l,R.T=a}}e.current=t,ye=2}}function dy(){if(ye===2){ye=0;var e=Ua,t=pi,a=(t.flags&8772)!==0;if((t.subtreeFlags&8772)!==0||a){a=R.T,R.T=null;var l=Z.p;Z.p=2;var i=j;j|=4;try{Zp(e,t.alternate,t)}finally{j=i,Z.p=l,R.T=a}}ye=3}}function my(){if(ye===4||ye===3){ye=0,r1();var e=Ua,t=pi,a=ta,l=ay;(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?ye=5:(ye=0,pi=Ua=null,hy(e,e.pendingLanes));var i=e.pendingLanes;if(i===0&&(Ha=null),uc(a),t=t.stateNode,Je&&typeof Je.onCommitFiberRoot=="function")try{Je.onCommitFiberRoot(Hn,t,void 0,(t.current.flags&128)===128)}catch{}if(l!==null){t=R.T,i=Z.p,Z.p=2,R.T=null;try{for(var n=e.onRecoverableError,s=0;s<l.length;s++){var r=l[s];n(r.value,{componentStack:r.stack})}}finally{R.T=t,Z.p=i}}(ta&3)!==0&&Xr(),Ot(e),i=e.pendingLanes,(a&261930)!==0&&(i&42)!==0?e===Po?vn++:(vn=0,Po=e):vn=0,Zn(0,!1)}}function hy(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,qn(t)))}function Xr(){return fy(),dy(),my(),py()}function py(){if(ye!==5)return!1;var e=Ua,t=Vo;Vo=0;var a=uc(ta),l=R.T,i=Z.p;try{Z.p=32>a?32:a,R.T=null,a=Qo,Qo=null;var n=Ua,s=ta;if(ye=0,pi=Ua=null,ta=0,(j&6)!==0)throw Error(v(331));var r=j;if(j|=4,$p(n.current),kp(n,n.current,s,a),j=r,Zn(0,!1),Je&&typeof Je.onPostCommitFiberRoot=="function")try{Je.onPostCommitFiberRoot(Hn,n)}catch{}return!0}finally{Z.p=i,R.T=l,hy(e,t)}}function Gm(e,t,a){t=ft(a,t),t=Yo(e.stateNode,t,2),e=Na(e,t,2),e!==null&&(Bn(e,2),Ot(e))}function Q(e,t,a){if(e.tag===3)Gm(e,e,a);else for(;t!==null;){if(t.tag===3){Gm(t,e,a);break}else if(t.tag===1){var l=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof l.componentDidCatch=="function"&&(Ha===null||!Ha.has(l))){e=ft(a,e),a=_p(2),l=Na(t,a,2),l!==null&&(Dp(a,l,t,e),Bn(l,2),Ot(l));break}}t=t.return}}function ao(e,t,a){var l=e.pingCache;if(l===null){l=e.pingCache=new wv;var i=new Set;l.set(t,i)}else i=l.get(t),i===void 0&&(i=new Set,l.set(t,i));i.has(a)||(Zc=!0,i.add(a),e=Lv.bind(null,e,t,a),t.then(e,e))}function Lv(e,t,a){var l=e.pingCache;l!==null&&l.delete(t),e.pingedLanes|=e.suspendedLanes&a,e.warmLanes&=~a,K===e&&(Y&a)===a&&(ue===4||ue===3&&(Y&62914560)===Y&&300>Ke()-Lr?(j&2)===0&&yi(e,0):Vc|=a,hi===Y&&(hi=0)),Ot(e)}function yy(e,t){t===0&&(t=rh()),e=bl(e,t),e!==null&&(Bn(e,t),Ot(e))}function Yv(e){var t=e.memoizedState,a=0;t!==null&&(a=t.retryLane),yy(e,a)}function qv(e,t){var a=0;switch(e.tag){case 31:case 13:var l=e.stateNode,i=e.memoizedState;i!==null&&(a=i.retryLane);break;case 19:l=e.stateNode;break;case 22:l=e.stateNode._retryCache;break;default:throw Error(v(314))}l!==null&&l.delete(t),yy(e,a)}function Xv(e,t){return sc(e,t)}var vr=null,jl=null,Fo=!1,br=!1,lo=!1,_a=0;function Ot(e){e!==jl&&e.next===null&&(jl===null?vr=jl=e:jl=jl.next=e),br=!0,Fo||(Fo=!0,Zv())}function Zn(e,t){if(!lo&&br){lo=!0;do for(var a=!1,l=vr;l!==null;){if(!t)if(e!==0){var i=l.pendingLanes;if(i===0)var n=0;else{var s=l.suspendedLanes,r=l.pingedLanes;n=(1<<31-ke(42|e)+1)-1,n&=i&~(s&~r),n=n&201326741?n&201326741|1:n?n|2:0}n!==0&&(a=!0,Cm(l,n))}else n=Y,n=Ar(l,l===K?n:0,l.cancelPendingCommit!==null||l.timeoutHandle!==-1),(n&3)===0||Un(l,n)||(a=!0,Cm(l,n));l=l.next}while(a);lo=!1}}function jv(){gy()}function gy(){br=Fo=!1;var e=0;_a!==0&&Wv()&&(e=_a);for(var t=Ke(),a=null,l=vr;l!==null;){var i=l.next,n=vy(l,t);n===0?(l.next=null,a===null?vr=i:a.next=i,i===null&&(jl=a)):(a=l,(e!==0||(n&3)!==0)&&(br=!0)),l=i}ye!==0&&ye!==5||Zn(e,!1),_a!==0&&(_a=0)}function vy(e,t){for(var a=e.suspendedLanes,l=e.pingedLanes,i=e.expirationTimes,n=e.pendingLanes&-62914561;0<n;){var s=31-ke(n),r=1<<s,u=i[s];u===-1?((r&a)===0||(r&l)!==0)&&(i[s]=p1(r,t)):u<=t&&(e.expiredLanes|=r),n&=~r}if(t=K,a=Y,a=Ar(e,e===t?a:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l=e.callbackNode,a===0||e===t&&(V===2||V===9)||e.cancelPendingCommit!==null)return l!==null&&l!==null&&Ou(l),e.callbackNode=null,e.callbackPriority=0;if((a&3)===0||Un(e,a)){if(t=a&-a,t===e.callbackPriority)return t;switch(l!==null&&Ou(l),uc(a)){case 2:case 8:a=nh;break;case 32:a=tr;break;case 268435456:a=sh;break;default:a=tr}return l=by.bind(null,e),a=sc(a,l),e.callbackPriority=t,e.callbackNode=a,t}return l!==null&&l!==null&&Ou(l),e.callbackPriority=2,e.callbackNode=null,2}function by(e,t){if(ye!==0&&ye!==5)return e.callbackNode=null,e.callbackPriority=0,null;var a=e.callbackNode;if(Xr()&&e.callbackNode!==a)return null;var l=Y;return l=Ar(e,e===K?l:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l===0?null:(iy(e,l,t),vy(e,Ke()),e.callbackNode!=null&&e.callbackNode===a?by.bind(null,e):null)}function Cm(e,t){if(Xr())return null;iy(e,t,!0)}function Zv(){$v(function(){(j&6)!==0?sc(ih,jv):gy()})}function Pc(){if(_a===0){var e=fi;e===0&&(e=Ms,Ms<<=1,(Ms&261888)===0&&(Ms=256)),_a=e}return _a}function Am(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:Ls(""+e)}function zm(e,t){var a=t.ownerDocument.createElement("input");return a.name=t.name,a.value=t.value,e.id&&a.setAttribute("form",e.id),t.parentNode.insertBefore(a,t),e=new FormData(e),a.parentNode.removeChild(a),e}function Vv(e,t,a,l,i){if(t==="submit"&&a&&a.stateNode===i){var n=Am((i[Ye]||null).action),s=l.submitter;s&&(t=(t=s[Ye]||null)?Am(t.formAction):s.getAttribute("formAction"),t!==null&&(n=t,s=null));var r=new zr("action","action",null,l,i);e.push({event:r,listeners:[{instance:null,listener:function(){if(l.defaultPrevented){if(_a!==0){var u=s?zm(i,s):new FormData(i);Bo(a,{pending:!0,data:u,method:i.method,action:n},null,u)}}else typeof n=="function"&&(r.preventDefault(),u=s?zm(i,s):new FormData(i),Bo(a,{pending:!0,data:u,method:i.method,action:n},n,u))},currentTarget:i}]})}}for(Os=0;Os<Go.length;Os++)ws=Go[Os],Rm=ws.toLowerCase(),_m=ws[0].toUpperCase()+ws.slice(1),bt(Rm,"on"+_m);var ws,Rm,_m,Os;bt(Dh,"onAnimationEnd");bt(Oh,"onAnimationIteration");bt(wh,"onAnimationStart");bt("dblclick","onDoubleClick");bt("focusin","onFocus");bt("focusout","onBlur");bt(uv,"onTransitionRun");bt(ov,"onTransitionStart");bt(cv,"onTransitionCancel");bt(Nh,"onTransitionEnd");oi("onMouseEnter",["mouseout","mouseover"]);oi("onMouseLeave",["mouseout","mouseover"]);oi("onPointerEnter",["pointerout","pointerover"]);oi("onPointerLeave",["pointerout","pointerover"]);yl("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));yl("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));yl("onBeforeInput",["compositionend","keypress","textInput","paste"]);yl("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));yl("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));yl("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Rn="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Qv=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Rn));function My(e,t){t=(t&4)!==0;for(var a=0;a<e.length;a++){var l=e[a],i=l.event;l=l.listeners;e:{var n=void 0;if(t)for(var s=l.length-1;0<=s;s--){var r=l[s],u=r.instance,c=r.currentTarget;if(r=r.listener,u!==n&&i.isPropagationStopped())break e;n=r,i.currentTarget=c;try{n(i)}catch(f){lr(f)}i.currentTarget=null,n=u}else for(s=0;s<l.length;s++){if(r=l[s],u=r.instance,c=r.currentTarget,r=r.listener,u!==n&&i.isPropagationStopped())break e;n=r,i.currentTarget=c;try{n(i)}catch(f){lr(f)}i.currentTarget=null,n=u}}}}function B(e,t){var a=t[go];a===void 0&&(a=t[go]=new Set);var l=e+"__bubble";a.has(l)||(Sy(t,e,2,!1),a.add(l))}function io(e,t,a){var l=0;t&&(l|=4),Sy(a,e,l,t)}var Ns="_reactListening"+Math.random().toString(36).slice(2);function Fc(e){if(!e[Ns]){e[Ns]=!0,dh.forEach(function(a){a!=="selectionchange"&&(Qv.has(a)||io(a,!1,e),io(a,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Ns]||(t[Ns]=!0,io("selectionchange",!1,t))}}function Sy(e,t,a,l){switch(Ny(t)){case 2:var i=bb;break;case 8:i=Mb;break;default:i=Wc}a=i.bind(null,t,a,e),i=void 0,!xo||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(i=!0),l?i!==void 0?e.addEventListener(t,a,{capture:!0,passive:i}):e.addEventListener(t,a,!0):i!==void 0?e.addEventListener(t,a,{passive:i}):e.addEventListener(t,a,!1)}function no(e,t,a,l,i){var n=l;if((t&1)===0&&(t&2)===0&&l!==null)e:for(;;){if(l===null)return;var s=l.tag;if(s===3||s===4){var r=l.stateNode.containerInfo;if(r===i)break;if(s===4)for(s=l.return;s!==null;){var u=s.tag;if((u===3||u===4)&&s.stateNode.containerInfo===i)return;s=s.return}for(;r!==null;){if(s=Ql(r),s===null)return;if(u=s.tag,u===5||u===6||u===26||u===27){l=n=s;continue e}r=r.parentNode}}l=l.return}Mh(function(){var c=n,f=fc(a),y=[];e:{var m=Hh.get(e);if(m!==void 0){var p=zr,M=e;switch(e){case"keypress":if(qs(a)===0)break e;case"keydown":case"keyup":p=q1;break;case"focusin":M="focus",p=Bu;break;case"focusout":M="blur",p=Bu;break;case"beforeblur":case"afterblur":p=Bu;break;case"click":if(a.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":p=Bd;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":p=z1;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":p=Z1;break;case Dh:case Oh:case wh:p=D1;break;case Nh:p=Q1;break;case"scroll":case"scrollend":p=C1;break;case"wheel":p=F1;break;case"copy":case"cut":case"paste":p=w1;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":p=Yd;break;case"toggle":case"beforetoggle":p=J1}var x=(t&4)!==0,N=!x&&(e==="scroll"||e==="scrollend"),d=x?m!==null?m+"Capture":null:m;x=[];for(var o=c,h;o!==null;){var g=o;if(h=g.stateNode,g=g.tag,g!==5&&g!==26&&g!==27||h===null||d===null||(g=Sn(o,d),g!=null&&x.push(_n(o,g,h))),N)break;o=o.return}0<x.length&&(m=new p(m,M,null,a,f),y.push({event:m,listeners:x}))}}if((t&7)===0){e:{if(m=e==="mouseover"||e==="pointerover",p=e==="mouseout"||e==="pointerout",m&&a!==So&&(M=a.relatedTarget||a.fromElement)&&(Ql(M)||M[bi]))break e;if((p||m)&&(m=f.window===f?f:(m=f.ownerDocument)?m.defaultView||m.parentWindow:window,p?(M=a.relatedTarget||a.toElement,p=c,M=M?Ql(M):null,M!==null&&(N=Nn(M),x=M.tag,M!==N||x!==5&&x!==27&&x!==6)&&(M=null)):(p=null,M=c),p!==M)){if(x=Bd,g="onMouseLeave",d="onMouseEnter",o="mouse",(e==="pointerout"||e==="pointerover")&&(x=Yd,g="onPointerLeave",d="onPointerEnter",o="pointer"),N=p==null?m:ln(p),h=M==null?m:ln(M),m=new x(g,o+"leave",p,a,f),m.target=N,m.relatedTarget=h,g=null,Ql(f)===c&&(x=new x(d,o+"enter",M,a,f),x.target=h,x.relatedTarget=N,g=x),N=g,p&&M)t:{for(x=Pv,d=p,o=M,h=0,g=d;g;g=x(g))h++;g=0;for(var A=o;A;A=x(A))g++;for(;0<h-g;)d=x(d),h--;for(;0<g-h;)o=x(o),g--;for(;h--;){if(d===o||o!==null&&d===o.alternate){x=d;break t}d=x(d),o=x(o)}x=null}else x=null;p!==null&&Dm(y,m,p,x,!1),M!==null&&N!==null&&Dm(y,N,M,x,!0)}}e:{if(m=c?ln(c):window,p=m.nodeName&&m.nodeName.toLowerCase(),p==="select"||p==="input"&&m.type==="file")var H=Zd;else if(jd(m))if(Ch)H=nv;else{H=lv;var T=av}else p=m.nodeName,!p||p.toLowerCase()!=="input"||m.type!=="checkbox"&&m.type!=="radio"?c&&cc(c.elementType)&&(H=Zd):H=iv;if(H&&(H=H(e,c))){Gh(y,H,a,f);break e}T&&T(e,m,c),e==="focusout"&&c&&m.type==="number"&&c.memoizedProps.value!=null&&Mo(m,"number",m.value)}switch(T=c?ln(c):window,e){case"focusin":(jd(T)||T.contentEditable==="true")&&(Kl=T,Eo=c,on=null);break;case"focusout":on=Eo=Kl=null;break;case"mousedown":To=!0;break;case"contextmenu":case"mouseup":case"dragend":To=!1,Fd(y,a,f);break;case"selectionchange":if(rv)break;case"keydown":case"keyup":Fd(y,a,f)}var D;if(hc)e:{switch(e){case"compositionstart":var b="onCompositionStart";break e;case"compositionend":b="onCompositionEnd";break e;case"compositionupdate":b="onCompositionUpdate";break e}b=void 0}else Fl?Eh(e,a)&&(b="onCompositionEnd"):e==="keydown"&&a.keyCode===229&&(b="onCompositionStart");b&&(xh&&a.locale!=="ko"&&(Fl||b!=="onCompositionStart"?b==="onCompositionEnd"&&Fl&&(D=Sh()):(Aa=f,dc="value"in Aa?Aa.value:Aa.textContent,Fl=!0)),T=Mr(c,b),0<T.length&&(b=new Ld(b,e,null,a,f),y.push({event:b,listeners:T}),D?b.data=D:(D=Th(a),D!==null&&(b.data=D)))),(D=W1?I1(e,a):$1(e,a))&&(b=Mr(c,"onBeforeInput"),0<b.length&&(T=new Ld("onBeforeInput","beforeinput",null,a,f),y.push({event:T,listeners:b}),T.data=D)),Vv(y,e,c,a,f)}My(y,t)})}function _n(e,t,a){return{instance:e,listener:t,currentTarget:a}}function Mr(e,t){for(var a=t+"Capture",l=[];e!==null;){var i=e,n=i.stateNode;if(i=i.tag,i!==5&&i!==26&&i!==27||n===null||(i=Sn(e,a),i!=null&&l.unshift(_n(e,i,n)),i=Sn(e,t),i!=null&&l.push(_n(e,i,n))),e.tag===3)return l;e=e.return}return[]}function Pv(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function Dm(e,t,a,l,i){for(var n=t._reactName,s=[];a!==null&&a!==l;){var r=a,u=r.alternate,c=r.stateNode;if(r=r.tag,u!==null&&u===l)break;r!==5&&r!==26&&r!==27||c===null||(u=c,i?(c=Sn(a,n),c!=null&&s.unshift(_n(a,c,u))):i||(c=Sn(a,n),c!=null&&s.push(_n(a,c,u)))),a=a.return}s.length!==0&&e.push({event:t,listeners:s})}var Fv=/\r\n?/g,Kv=/\u0000|\uFFFD/g;function Om(e){return(typeof e=="string"?e:""+e).replace(Fv,`
`).replace(Kv,"")}function xy(e,t){return t=Om(t),Om(e)===t}function P(e,t,a,l,i,n){switch(a){case"children":typeof l=="string"?t==="body"||t==="textarea"&&l===""||ci(e,l):(typeof l=="number"||typeof l=="bigint")&&t!=="body"&&ci(e,""+l);break;case"className":Es(e,"class",l);break;case"tabIndex":Es(e,"tabindex",l);break;case"dir":case"role":case"viewBox":case"width":case"height":Es(e,a,l);break;case"style":bh(e,l,n);break;case"data":if(t!=="object"){Es(e,"data",l);break}case"src":case"href":if(l===""&&(t!=="a"||a!=="href")){e.removeAttribute(a);break}if(l==null||typeof l=="function"||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(a);break}l=Ls(""+l),e.setAttribute(a,l);break;case"action":case"formAction":if(typeof l=="function"){e.setAttribute(a,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof n=="function"&&(a==="formAction"?(t!=="input"&&P(e,t,"name",i.name,i,null),P(e,t,"formEncType",i.formEncType,i,null),P(e,t,"formMethod",i.formMethod,i,null),P(e,t,"formTarget",i.formTarget,i,null)):(P(e,t,"encType",i.encType,i,null),P(e,t,"method",i.method,i,null),P(e,t,"target",i.target,i,null)));if(l==null||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(a);break}l=Ls(""+l),e.setAttribute(a,l);break;case"onClick":l!=null&&(e.onclick=Wt);break;case"onScroll":l!=null&&B("scroll",e);break;case"onScrollEnd":l!=null&&B("scrollend",e);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(v(61));if(a=l.__html,a!=null){if(i.children!=null)throw Error(v(60));e.innerHTML=a}}break;case"multiple":e.multiple=l&&typeof l!="function"&&typeof l!="symbol";break;case"muted":e.muted=l&&typeof l!="function"&&typeof l!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(l==null||typeof l=="function"||typeof l=="boolean"||typeof l=="symbol"){e.removeAttribute("xlink:href");break}a=Ls(""+l),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",a);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(a,""+l):e.removeAttribute(a);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":l&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(a,""):e.removeAttribute(a);break;case"capture":case"download":l===!0?e.setAttribute(a,""):l!==!1&&l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(a,l):e.removeAttribute(a);break;case"cols":case"rows":case"size":case"span":l!=null&&typeof l!="function"&&typeof l!="symbol"&&!isNaN(l)&&1<=l?e.setAttribute(a,l):e.removeAttribute(a);break;case"rowSpan":case"start":l==null||typeof l=="function"||typeof l=="symbol"||isNaN(l)?e.removeAttribute(a):e.setAttribute(a,l);break;case"popover":B("beforetoggle",e),B("toggle",e),Bs(e,"popover",l);break;case"xlinkActuate":Zt(e,"http://www.w3.org/1999/xlink","xlink:actuate",l);break;case"xlinkArcrole":Zt(e,"http://www.w3.org/1999/xlink","xlink:arcrole",l);break;case"xlinkRole":Zt(e,"http://www.w3.org/1999/xlink","xlink:role",l);break;case"xlinkShow":Zt(e,"http://www.w3.org/1999/xlink","xlink:show",l);break;case"xlinkTitle":Zt(e,"http://www.w3.org/1999/xlink","xlink:title",l);break;case"xlinkType":Zt(e,"http://www.w3.org/1999/xlink","xlink:type",l);break;case"xmlBase":Zt(e,"http://www.w3.org/XML/1998/namespace","xml:base",l);break;case"xmlLang":Zt(e,"http://www.w3.org/XML/1998/namespace","xml:lang",l);break;case"xmlSpace":Zt(e,"http://www.w3.org/XML/1998/namespace","xml:space",l);break;case"is":Bs(e,"is",l);break;case"innerText":case"textContent":break;default:(!(2<a.length)||a[0]!=="o"&&a[0]!=="O"||a[1]!=="n"&&a[1]!=="N")&&(a=T1.get(a)||a,Bs(e,a,l))}}function Ko(e,t,a,l,i,n){switch(a){case"style":bh(e,l,n);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(v(61));if(a=l.__html,a!=null){if(i.children!=null)throw Error(v(60));e.innerHTML=a}}break;case"children":typeof l=="string"?ci(e,l):(typeof l=="number"||typeof l=="bigint")&&ci(e,""+l);break;case"onScroll":l!=null&&B("scroll",e);break;case"onScrollEnd":l!=null&&B("scrollend",e);break;case"onClick":l!=null&&(e.onclick=Wt);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!mh.hasOwnProperty(a))e:{if(a[0]==="o"&&a[1]==="n"&&(i=a.endsWith("Capture"),t=a.slice(2,i?a.length-7:void 0),n=e[Ye]||null,n=n!=null?n[a]:null,typeof n=="function"&&e.removeEventListener(t,n,i),typeof l=="function")){typeof n!="function"&&n!==null&&(a in e?e[a]=null:e.hasAttribute(a)&&e.removeAttribute(a)),e.addEventListener(t,l,i);break e}a in e?e[a]=l:l===!0?e.setAttribute(a,""):Bs(e,a,l)}}}function ze(e,t,a){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":B("error",e),B("load",e);var l=!1,i=!1,n;for(n in a)if(a.hasOwnProperty(n)){var s=a[n];if(s!=null)switch(n){case"src":l=!0;break;case"srcSet":i=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(v(137,t));default:P(e,t,n,s,a,null)}}i&&P(e,t,"srcSet",a.srcSet,a,null),l&&P(e,t,"src",a.src,a,null);return;case"input":B("invalid",e);var r=n=s=i=null,u=null,c=null;for(l in a)if(a.hasOwnProperty(l)){var f=a[l];if(f!=null)switch(l){case"name":i=f;break;case"type":s=f;break;case"checked":u=f;break;case"defaultChecked":c=f;break;case"value":n=f;break;case"defaultValue":r=f;break;case"children":case"dangerouslySetInnerHTML":if(f!=null)throw Error(v(137,t));break;default:P(e,t,l,f,a,null)}}yh(e,n,r,u,c,s,i,!1);return;case"select":B("invalid",e),l=s=n=null;for(i in a)if(a.hasOwnProperty(i)&&(r=a[i],r!=null))switch(i){case"value":n=r;break;case"defaultValue":s=r;break;case"multiple":l=r;default:P(e,t,i,r,a,null)}t=n,a=s,e.multiple=!!l,t!=null?ai(e,!!l,t,!1):a!=null&&ai(e,!!l,a,!0);return;case"textarea":B("invalid",e),n=i=l=null;for(s in a)if(a.hasOwnProperty(s)&&(r=a[s],r!=null))switch(s){case"value":l=r;break;case"defaultValue":i=r;break;case"children":n=r;break;case"dangerouslySetInnerHTML":if(r!=null)throw Error(v(91));break;default:P(e,t,s,r,a,null)}vh(e,l,i,n);return;case"option":for(u in a)a.hasOwnProperty(u)&&(l=a[u],l!=null)&&(u==="selected"?e.selected=l&&typeof l!="function"&&typeof l!="symbol":P(e,t,u,l,a,null));return;case"dialog":B("beforetoggle",e),B("toggle",e),B("cancel",e),B("close",e);break;case"iframe":case"object":B("load",e);break;case"video":case"audio":for(l=0;l<Rn.length;l++)B(Rn[l],e);break;case"image":B("error",e),B("load",e);break;case"details":B("toggle",e);break;case"embed":case"source":case"link":B("error",e),B("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(c in a)if(a.hasOwnProperty(c)&&(l=a[c],l!=null))switch(c){case"children":case"dangerouslySetInnerHTML":throw Error(v(137,t));default:P(e,t,c,l,a,null)}return;default:if(cc(t)){for(f in a)a.hasOwnProperty(f)&&(l=a[f],l!==void 0&&Ko(e,t,f,l,a,void 0));return}}for(r in a)a.hasOwnProperty(r)&&(l=a[r],l!=null&&P(e,t,r,l,a,null))}function Jv(e,t,a,l){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var i=null,n=null,s=null,r=null,u=null,c=null,f=null;for(p in a){var y=a[p];if(a.hasOwnProperty(p)&&y!=null)switch(p){case"checked":break;case"value":break;case"defaultValue":u=y;default:l.hasOwnProperty(p)||P(e,t,p,null,l,y)}}for(var m in l){var p=l[m];if(y=a[m],l.hasOwnProperty(m)&&(p!=null||y!=null))switch(m){case"type":n=p;break;case"name":i=p;break;case"checked":c=p;break;case"defaultChecked":f=p;break;case"value":s=p;break;case"defaultValue":r=p;break;case"children":case"dangerouslySetInnerHTML":if(p!=null)throw Error(v(137,t));break;default:p!==y&&P(e,t,m,p,l,y)}}bo(e,s,r,u,c,f,n,i);return;case"select":p=s=r=m=null;for(n in a)if(u=a[n],a.hasOwnProperty(n)&&u!=null)switch(n){case"value":break;case"multiple":p=u;default:l.hasOwnProperty(n)||P(e,t,n,null,l,u)}for(i in l)if(n=l[i],u=a[i],l.hasOwnProperty(i)&&(n!=null||u!=null))switch(i){case"value":m=n;break;case"defaultValue":r=n;break;case"multiple":s=n;default:n!==u&&P(e,t,i,n,l,u)}t=r,a=s,l=p,m!=null?ai(e,!!a,m,!1):!!l!=!!a&&(t!=null?ai(e,!!a,t,!0):ai(e,!!a,a?[]:"",!1));return;case"textarea":p=m=null;for(r in a)if(i=a[r],a.hasOwnProperty(r)&&i!=null&&!l.hasOwnProperty(r))switch(r){case"value":break;case"children":break;default:P(e,t,r,null,l,i)}for(s in l)if(i=l[s],n=a[s],l.hasOwnProperty(s)&&(i!=null||n!=null))switch(s){case"value":m=i;break;case"defaultValue":p=i;break;case"children":break;case"dangerouslySetInnerHTML":if(i!=null)throw Error(v(91));break;default:i!==n&&P(e,t,s,i,l,n)}gh(e,m,p);return;case"option":for(var M in a)m=a[M],a.hasOwnProperty(M)&&m!=null&&!l.hasOwnProperty(M)&&(M==="selected"?e.selected=!1:P(e,t,M,null,l,m));for(u in l)m=l[u],p=a[u],l.hasOwnProperty(u)&&m!==p&&(m!=null||p!=null)&&(u==="selected"?e.selected=m&&typeof m!="function"&&typeof m!="symbol":P(e,t,u,m,l,p));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var x in a)m=a[x],a.hasOwnProperty(x)&&m!=null&&!l.hasOwnProperty(x)&&P(e,t,x,null,l,m);for(c in l)if(m=l[c],p=a[c],l.hasOwnProperty(c)&&m!==p&&(m!=null||p!=null))switch(c){case"children":case"dangerouslySetInnerHTML":if(m!=null)throw Error(v(137,t));break;default:P(e,t,c,m,l,p)}return;default:if(cc(t)){for(var N in a)m=a[N],a.hasOwnProperty(N)&&m!==void 0&&!l.hasOwnProperty(N)&&Ko(e,t,N,void 0,l,m);for(f in l)m=l[f],p=a[f],!l.hasOwnProperty(f)||m===p||m===void 0&&p===void 0||Ko(e,t,f,m,l,p);return}}for(var d in a)m=a[d],a.hasOwnProperty(d)&&m!=null&&!l.hasOwnProperty(d)&&P(e,t,d,null,l,m);for(y in l)m=l[y],p=a[y],!l.hasOwnProperty(y)||m===p||m==null&&p==null||P(e,t,y,m,l,p)}function wm(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function kv(){if(typeof performance.getEntriesByType=="function"){for(var e=0,t=0,a=performance.getEntriesByType("resource"),l=0;l<a.length;l++){var i=a[l],n=i.transferSize,s=i.initiatorType,r=i.duration;if(n&&r&&wm(s)){for(s=0,r=i.responseEnd,l+=1;l<a.length;l++){var u=a[l],c=u.startTime;if(c>r)break;var f=u.transferSize,y=u.initiatorType;f&&wm(y)&&(u=u.responseEnd,s+=f*(u<r?1:(r-c)/(u-c)))}if(--l,t+=8*(n+s)/(i.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var Jo=null,ko=null;function Sr(e){return e.nodeType===9?e:e.ownerDocument}function Nm(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function Ey(e,t){if(e===0)switch(t){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&t==="foreignObject"?0:e}function Wo(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.children=="bigint"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var so=null;function Wv(){var e=window.event;return e&&e.type==="popstate"?e===so?!1:(so=e,!0):(so=null,!1)}var Ty=typeof setTimeout=="function"?setTimeout:void 0,Iv=typeof clearTimeout=="function"?clearTimeout:void 0,Hm=typeof Promise=="function"?Promise:void 0,$v=typeof queueMicrotask=="function"?queueMicrotask:typeof Hm<"u"?function(e){return Hm.resolve(null).then(e).catch(eb)}:Ty;function eb(e){setTimeout(function(){throw e})}function Qa(e){return e==="head"}function Um(e,t){var a=t,l=0;do{var i=a.nextSibling;if(e.removeChild(a),i&&i.nodeType===8)if(a=i.data,a==="/$"||a==="/&"){if(l===0){e.removeChild(i),vi(t);return}l--}else if(a==="$"||a==="$?"||a==="$~"||a==="$!"||a==="&")l++;else if(a==="html")bn(e.ownerDocument.documentElement);else if(a==="head"){a=e.ownerDocument.head,bn(a);for(var n=a.firstChild;n;){var s=n.nextSibling,r=n.nodeName;n[Ln]||r==="SCRIPT"||r==="STYLE"||r==="LINK"&&n.rel.toLowerCase()==="stylesheet"||a.removeChild(n),n=s}}else a==="body"&&bn(e.ownerDocument.body);a=i}while(a);vi(t)}function Bm(e,t){var a=e;e=0;do{var l=a.nextSibling;if(a.nodeType===1?t?(a._stashedDisplay=a.style.display,a.style.display="none"):(a.style.display=a._stashedDisplay||"",a.getAttribute("style")===""&&a.removeAttribute("style")):a.nodeType===3&&(t?(a._stashedText=a.nodeValue,a.nodeValue=""):a.nodeValue=a._stashedText||""),l&&l.nodeType===8)if(a=l.data,a==="/$"){if(e===0)break;e--}else a!=="$"&&a!=="$?"&&a!=="$~"&&a!=="$!"||e++;a=l}while(a)}function Io(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var a=t;switch(t=t.nextSibling,a.nodeName){case"HTML":case"HEAD":case"BODY":Io(a),oc(a);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(a.rel.toLowerCase()==="stylesheet")continue}e.removeChild(a)}}function tb(e,t,a,l){for(;e.nodeType===1;){var i=a;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!l&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(l){if(!e[Ln])switch(t){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(n=e.getAttribute("rel"),n==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(n!==i.rel||e.getAttribute("href")!==(i.href==null||i.href===""?null:i.href)||e.getAttribute("crossorigin")!==(i.crossOrigin==null?null:i.crossOrigin)||e.getAttribute("title")!==(i.title==null?null:i.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(n=e.getAttribute("src"),(n!==(i.src==null?null:i.src)||e.getAttribute("type")!==(i.type==null?null:i.type)||e.getAttribute("crossorigin")!==(i.crossOrigin==null?null:i.crossOrigin))&&n&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(t==="input"&&e.type==="hidden"){var n=i.name==null?null:""+i.name;if(i.type==="hidden"&&e.getAttribute("name")===n)return e}else return e;if(e=ht(e.nextSibling),e===null)break}return null}function ab(e,t,a){if(t==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!a||(e=ht(e.nextSibling),e===null))return null;return e}function Gy(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!t||(e=ht(e.nextSibling),e===null))return null;return e}function $o(e){return e.data==="$?"||e.data==="$~"}function ec(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function lb(e,t){var a=e.ownerDocument;if(e.data==="$~")e._reactRetry=t;else if(e.data!=="$?"||a.readyState!=="loading")t();else{var l=function(){t(),a.removeEventListener("DOMContentLoaded",l)};a.addEventListener("DOMContentLoaded",l),e._reactRetry=l}}function ht(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?"||t==="$~"||t==="&"||t==="F!"||t==="F")break;if(t==="/$"||t==="/&")return null}}return e}var tc=null;function Lm(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var a=e.data;if(a==="/$"||a==="/&"){if(t===0)return ht(e.nextSibling);t--}else a!=="$"&&a!=="$!"&&a!=="$?"&&a!=="$~"&&a!=="&"||t++}e=e.nextSibling}return null}function Ym(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var a=e.data;if(a==="$"||a==="$!"||a==="$?"||a==="$~"||a==="&"){if(t===0)return e;t--}else a!=="/$"&&a!=="/&"||t++}e=e.previousSibling}return null}function Cy(e,t,a){switch(t=Sr(a),e){case"html":if(e=t.documentElement,!e)throw Error(v(452));return e;case"head":if(e=t.head,!e)throw Error(v(453));return e;case"body":if(e=t.body,!e)throw Error(v(454));return e;default:throw Error(v(451))}}function bn(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);oc(e)}var pt=new Map,qm=new Set;function xr(e){return typeof e.getRootNode=="function"?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var ra=Z.d;Z.d={f:ib,r:nb,D:sb,C:rb,L:ub,m:ob,X:fb,S:cb,M:db};function ib(){var e=ra.f(),t=Yr();return e||t}function nb(e){var t=Mi(e);t!==null&&t.tag===5&&t.type==="form"?bp(t):ra.r(e)}var Ti=typeof document>"u"?null:document;function Ay(e,t,a){var l=Ti;if(l&&typeof t=="string"&&t){var i=ct(t);i='link[rel="'+e+'"][href="'+i+'"]',typeof a=="string"&&(i+='[crossorigin="'+a+'"]'),qm.has(i)||(qm.add(i),e={rel:e,crossOrigin:a,href:t},l.querySelector(i)===null&&(t=l.createElement("link"),ze(t,"link",e),Se(t),l.head.appendChild(t)))}}function sb(e){ra.D(e),Ay("dns-prefetch",e,null)}function rb(e,t){ra.C(e,t),Ay("preconnect",e,t)}function ub(e,t,a){ra.L(e,t,a);var l=Ti;if(l&&e&&t){var i='link[rel="preload"][as="'+ct(t)+'"]';t==="image"&&a&&a.imageSrcSet?(i+='[imagesrcset="'+ct(a.imageSrcSet)+'"]',typeof a.imageSizes=="string"&&(i+='[imagesizes="'+ct(a.imageSizes)+'"]')):i+='[href="'+ct(e)+'"]';var n=i;switch(t){case"style":n=gi(e);break;case"script":n=Gi(e)}pt.has(n)||(e=te({rel:"preload",href:t==="image"&&a&&a.imageSrcSet?void 0:e,as:t},a),pt.set(n,e),l.querySelector(i)!==null||t==="style"&&l.querySelector(Vn(n))||t==="script"&&l.querySelector(Qn(n))||(t=l.createElement("link"),ze(t,"link",e),Se(t),l.head.appendChild(t)))}}function ob(e,t){ra.m(e,t);var a=Ti;if(a&&e){var l=t&&typeof t.as=="string"?t.as:"script",i='link[rel="modulepreload"][as="'+ct(l)+'"][href="'+ct(e)+'"]',n=i;switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":n=Gi(e)}if(!pt.has(n)&&(e=te({rel:"modulepreload",href:e},t),pt.set(n,e),a.querySelector(i)===null)){switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(a.querySelector(Qn(n)))return}l=a.createElement("link"),ze(l,"link",e),Se(l),a.head.appendChild(l)}}}function cb(e,t,a){ra.S(e,t,a);var l=Ti;if(l&&e){var i=ti(l).hoistableStyles,n=gi(e);t=t||"default";var s=i.get(n);if(!s){var r={loading:0,preload:null};if(s=l.querySelector(Vn(n)))r.loading=5;else{e=te({rel:"stylesheet",href:e,"data-precedence":t},a),(a=pt.get(n))&&Kc(e,a);var u=s=l.createElement("link");Se(u),ze(u,"link",e),u._p=new Promise(function(c,f){u.onload=c,u.onerror=f}),u.addEventListener("load",function(){r.loading|=1}),u.addEventListener("error",function(){r.loading|=2}),r.loading|=4,Ks(s,t,l)}s={type:"stylesheet",instance:s,count:1,state:r},i.set(n,s)}}}function fb(e,t){ra.X(e,t);var a=Ti;if(a&&e){var l=ti(a).hoistableScripts,i=Gi(e),n=l.get(i);n||(n=a.querySelector(Qn(i)),n||(e=te({src:e,async:!0},t),(t=pt.get(i))&&Jc(e,t),n=a.createElement("script"),Se(n),ze(n,"link",e),a.head.appendChild(n)),n={type:"script",instance:n,count:1,state:null},l.set(i,n))}}function db(e,t){ra.M(e,t);var a=Ti;if(a&&e){var l=ti(a).hoistableScripts,i=Gi(e),n=l.get(i);n||(n=a.querySelector(Qn(i)),n||(e=te({src:e,async:!0,type:"module"},t),(t=pt.get(i))&&Jc(e,t),n=a.createElement("script"),Se(n),ze(n,"link",e),a.head.appendChild(n)),n={type:"script",instance:n,count:1,state:null},l.set(i,n))}}function Xm(e,t,a,l){var i=(i=Da.current)?xr(i):null;if(!i)throw Error(v(446));switch(e){case"meta":case"title":return null;case"style":return typeof a.precedence=="string"&&typeof a.href=="string"?(t=gi(a.href),a=ti(i).hoistableStyles,l=a.get(t),l||(l={type:"style",instance:null,count:0,state:null},a.set(t,l)),l):{type:"void",instance:null,count:0,state:null};case"link":if(a.rel==="stylesheet"&&typeof a.href=="string"&&typeof a.precedence=="string"){e=gi(a.href);var n=ti(i).hoistableStyles,s=n.get(e);if(s||(i=i.ownerDocument||i,s={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},n.set(e,s),(n=i.querySelector(Vn(e)))&&!n._p&&(s.instance=n,s.state.loading=5),pt.has(e)||(a={rel:"preload",as:"style",href:a.href,crossOrigin:a.crossOrigin,integrity:a.integrity,media:a.media,hrefLang:a.hrefLang,referrerPolicy:a.referrerPolicy},pt.set(e,a),n||mb(i,e,a,s.state))),t&&l===null)throw Error(v(528,""));return s}if(t&&l!==null)throw Error(v(529,""));return null;case"script":return t=a.async,a=a.src,typeof a=="string"&&t&&typeof t!="function"&&typeof t!="symbol"?(t=Gi(a),a=ti(i).hoistableScripts,l=a.get(t),l||(l={type:"script",instance:null,count:0,state:null},a.set(t,l)),l):{type:"void",instance:null,count:0,state:null};default:throw Error(v(444,e))}}function gi(e){return'href="'+ct(e)+'"'}function Vn(e){return'link[rel="stylesheet"]['+e+"]"}function zy(e){return te({},e,{"data-precedence":e.precedence,precedence:null})}function mb(e,t,a,l){e.querySelector('link[rel="preload"][as="style"]['+t+"]")?l.loading=1:(t=e.createElement("link"),l.preload=t,t.addEventListener("load",function(){return l.loading|=1}),t.addEventListener("error",function(){return l.loading|=2}),ze(t,"link",a),Se(t),e.head.appendChild(t))}function Gi(e){return'[src="'+ct(e)+'"]'}function Qn(e){return"script[async]"+e}function jm(e,t,a){if(t.count++,t.instance===null)switch(t.type){case"style":var l=e.querySelector('style[data-href~="'+ct(a.href)+'"]');if(l)return t.instance=l,Se(l),l;var i=te({},a,{"data-href":a.href,"data-precedence":a.precedence,href:null,precedence:null});return l=(e.ownerDocument||e).createElement("style"),Se(l),ze(l,"style",i),Ks(l,a.precedence,e),t.instance=l;case"stylesheet":i=gi(a.href);var n=e.querySelector(Vn(i));if(n)return t.state.loading|=4,t.instance=n,Se(n),n;l=zy(a),(i=pt.get(i))&&Kc(l,i),n=(e.ownerDocument||e).createElement("link"),Se(n);var s=n;return s._p=new Promise(function(r,u){s.onload=r,s.onerror=u}),ze(n,"link",l),t.state.loading|=4,Ks(n,a.precedence,e),t.instance=n;case"script":return n=Gi(a.src),(i=e.querySelector(Qn(n)))?(t.instance=i,Se(i),i):(l=a,(i=pt.get(n))&&(l=te({},a),Jc(l,i)),e=e.ownerDocument||e,i=e.createElement("script"),Se(i),ze(i,"link",l),e.head.appendChild(i),t.instance=i);case"void":return null;default:throw Error(v(443,t.type))}else t.type==="stylesheet"&&(t.state.loading&4)===0&&(l=t.instance,t.state.loading|=4,Ks(l,a.precedence,e));return t.instance}function Ks(e,t,a){for(var l=a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),i=l.length?l[l.length-1]:null,n=i,s=0;s<l.length;s++){var r=l[s];if(r.dataset.precedence===t)n=r;else if(n!==i)break}n?n.parentNode.insertBefore(e,n.nextSibling):(t=a.nodeType===9?a.head:a,t.insertBefore(e,t.firstChild))}function Kc(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.title==null&&(e.title=t.title)}function Jc(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.integrity==null&&(e.integrity=t.integrity)}var Js=null;function Zm(e,t,a){if(Js===null){var l=new Map,i=Js=new Map;i.set(a,l)}else i=Js,l=i.get(a),l||(l=new Map,i.set(a,l));if(l.has(e))return l;for(l.set(e,null),a=a.getElementsByTagName(e),i=0;i<a.length;i++){var n=a[i];if(!(n[Ln]||n[Ge]||e==="link"&&n.getAttribute("rel")==="stylesheet")&&n.namespaceURI!=="http://www.w3.org/2000/svg"){var s=n.getAttribute(t)||"";s=e+s;var r=l.get(s);r?r.push(n):l.set(s,[n])}}return l}function Vm(e,t,a){e=e.ownerDocument||e,e.head.insertBefore(a,t==="title"?e.querySelector("head > title"):null)}function hb(e,t,a){if(a===1||t.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof t.precedence!="string"||typeof t.href!="string"||t.href==="")break;return!0;case"link":if(typeof t.rel!="string"||typeof t.href!="string"||t.href===""||t.onLoad||t.onError)break;return t.rel==="stylesheet"?(e=t.disabled,typeof t.precedence=="string"&&e==null):!0;case"script":if(t.async&&typeof t.async!="function"&&typeof t.async!="symbol"&&!t.onLoad&&!t.onError&&t.src&&typeof t.src=="string")return!0}return!1}function Ry(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function pb(e,t,a,l){if(a.type==="stylesheet"&&(typeof l.media!="string"||matchMedia(l.media).matches!==!1)&&(a.state.loading&4)===0){if(a.instance===null){var i=gi(l.href),n=t.querySelector(Vn(i));if(n){t=n._p,t!==null&&typeof t=="object"&&typeof t.then=="function"&&(e.count++,e=Er.bind(e),t.then(e,e)),a.state.loading|=4,a.instance=n,Se(n);return}n=t.ownerDocument||t,l=zy(l),(i=pt.get(i))&&Kc(l,i),n=n.createElement("link"),Se(n);var s=n;s._p=new Promise(function(r,u){s.onload=r,s.onerror=u}),ze(n,"link",l),a.instance=n}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(a,t),(t=a.state.preload)&&(a.state.loading&3)===0&&(e.count++,a=Er.bind(e),t.addEventListener("load",a),t.addEventListener("error",a))}}var ro=0;function yb(e,t){return e.stylesheets&&e.count===0&&ks(e,e.stylesheets),0<e.count||0<e.imgCount?function(a){var l=setTimeout(function(){if(e.stylesheets&&ks(e,e.stylesheets),e.unsuspend){var n=e.unsuspend;e.unsuspend=null,n()}},6e4+t);0<e.imgBytes&&ro===0&&(ro=62500*kv());var i=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&ks(e,e.stylesheets),e.unsuspend)){var n=e.unsuspend;e.unsuspend=null,n()}},(e.imgBytes>ro?50:800)+t);return e.unsuspend=a,function(){e.unsuspend=null,clearTimeout(l),clearTimeout(i)}}:null}function Er(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)ks(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var Tr=null;function ks(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,Tr=new Map,t.forEach(gb,e),Tr=null,Er.call(e))}function gb(e,t){if(!(t.state.loading&4)){var a=Tr.get(e);if(a)var l=a.get(null);else{a=new Map,Tr.set(e,a);for(var i=e.querySelectorAll("link[data-precedence],style[data-precedence]"),n=0;n<i.length;n++){var s=i[n];(s.nodeName==="LINK"||s.getAttribute("media")!=="not all")&&(a.set(s.dataset.precedence,s),l=s)}l&&a.set(null,l)}i=t.instance,s=i.getAttribute("data-precedence"),n=a.get(s)||l,n===l&&a.set(null,i),a.set(s,i),this.count++,l=Er.bind(this),i.addEventListener("load",l),i.addEventListener("error",l),n?n.parentNode.insertBefore(i,n.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(i,e.firstChild)),t.state.loading|=4}}var Dn={$$typeof:kt,Provider:null,Consumer:null,_currentValue:sl,_currentValue2:sl,_threadCount:0};function vb(e,t,a,l,i,n,s,r,u){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=wu(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=wu(0),this.hiddenUpdates=wu(null),this.identifierPrefix=l,this.onUncaughtError=i,this.onCaughtError=n,this.onRecoverableError=s,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=u,this.incompleteTransitions=new Map}function _y(e,t,a,l,i,n,s,r,u,c,f,y){return e=new vb(e,t,a,s,u,c,f,y,r),t=1,n===!0&&(t|=24),n=Pe(3,null,null,t),e.current=n,n.stateNode=e,t=Sc(),t.refCount++,e.pooledCache=t,t.refCount++,n.memoizedState={element:l,isDehydrated:a,cache:t},Tc(n),e}function Dy(e){return e?(e=Wl,e):Wl}function Oy(e,t,a,l,i,n){i=Dy(i),l.context===null?l.context=i:l.pendingContext=i,l=wa(t),l.payload={element:a},n=n===void 0?null:n,n!==null&&(l.callback=n),a=Na(e,l,t),a!==null&&(Le(a,e,t),fn(a,e,t))}function Qm(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var a=e.retryLane;e.retryLane=a!==0&&a<t?a:t}}function kc(e,t){Qm(e,t),(e=e.alternate)&&Qm(e,t)}function wy(e){if(e.tag===13||e.tag===31){var t=bl(e,67108864);t!==null&&Le(t,e,67108864),kc(e,67108864)}}function Pm(e){if(e.tag===13||e.tag===31){var t=We();t=rc(t);var a=bl(e,t);a!==null&&Le(a,e,t),kc(e,t)}}var Gr=!0;function bb(e,t,a,l){var i=R.T;R.T=null;var n=Z.p;try{Z.p=2,Wc(e,t,a,l)}finally{Z.p=n,R.T=i}}function Mb(e,t,a,l){var i=R.T;R.T=null;var n=Z.p;try{Z.p=8,Wc(e,t,a,l)}finally{Z.p=n,R.T=i}}function Wc(e,t,a,l){if(Gr){var i=ac(l);if(i===null)no(e,t,l,Cr,a),Fm(e,l);else if(xb(i,e,t,a,l))l.stopPropagation();else if(Fm(e,l),t&4&&-1<Sb.indexOf(e)){for(;i!==null;){var n=Mi(i);if(n!==null)switch(n.tag){case 3:if(n=n.stateNode,n.current.memoizedState.isDehydrated){var s=ll(n.pendingLanes);if(s!==0){var r=n;for(r.pendingLanes|=2,r.entangledLanes|=2;s;){var u=1<<31-ke(s);r.entanglements[1]|=u,s&=~u}Ot(n),(j&6)===0&&(pr=Ke()+500,Zn(0,!1))}}break;case 31:case 13:r=bl(n,2),r!==null&&Le(r,n,2),Yr(),kc(n,2)}if(n=ac(l),n===null&&no(e,t,l,Cr,a),n===i)break;i=n}i!==null&&l.stopPropagation()}else no(e,t,l,null,a)}}function ac(e){return e=fc(e),Ic(e)}var Cr=null;function Ic(e){if(Cr=null,e=Ql(e),e!==null){var t=Nn(e);if(t===null)e=null;else{var a=t.tag;if(a===13){if(e=$m(t),e!==null)return e;e=null}else if(a===31){if(e=eh(t),e!==null)return e;e=null}else if(a===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return Cr=e,null}function Ny(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(u1()){case ih:return 2;case nh:return 8;case tr:case o1:return 32;case sh:return 268435456;default:return 32}default:return 32}}var lc=!1,Ba=null,La=null,Ya=null,On=new Map,wn=new Map,Ga=[],Sb="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function Fm(e,t){switch(e){case"focusin":case"focusout":Ba=null;break;case"dragenter":case"dragleave":La=null;break;case"mouseover":case"mouseout":Ya=null;break;case"pointerover":case"pointerout":On.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":wn.delete(t.pointerId)}}function $i(e,t,a,l,i,n){return e===null||e.nativeEvent!==n?(e={blockedOn:t,domEventName:a,eventSystemFlags:l,nativeEvent:n,targetContainers:[i]},t!==null&&(t=Mi(t),t!==null&&wy(t)),e):(e.eventSystemFlags|=l,t=e.targetContainers,i!==null&&t.indexOf(i)===-1&&t.push(i),e)}function xb(e,t,a,l,i){switch(t){case"focusin":return Ba=$i(Ba,e,t,a,l,i),!0;case"dragenter":return La=$i(La,e,t,a,l,i),!0;case"mouseover":return Ya=$i(Ya,e,t,a,l,i),!0;case"pointerover":var n=i.pointerId;return On.set(n,$i(On.get(n)||null,e,t,a,l,i)),!0;case"gotpointercapture":return n=i.pointerId,wn.set(n,$i(wn.get(n)||null,e,t,a,l,i)),!0}return!1}function Hy(e){var t=Ql(e.target);if(t!==null){var a=Nn(t);if(a!==null){if(t=a.tag,t===13){if(t=$m(a),t!==null){e.blockedOn=t,_d(e.priority,function(){Pm(a)});return}}else if(t===31){if(t=eh(a),t!==null){e.blockedOn=t,_d(e.priority,function(){Pm(a)});return}}else if(t===3&&a.stateNode.current.memoizedState.isDehydrated){e.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Ws(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var a=ac(e.nativeEvent);if(a===null){a=e.nativeEvent;var l=new a.constructor(a.type,a);So=l,a.target.dispatchEvent(l),So=null}else return t=Mi(a),t!==null&&wy(t),e.blockedOn=a,!1;t.shift()}return!0}function Km(e,t,a){Ws(e)&&a.delete(t)}function Eb(){lc=!1,Ba!==null&&Ws(Ba)&&(Ba=null),La!==null&&Ws(La)&&(La=null),Ya!==null&&Ws(Ya)&&(Ya=null),On.forEach(Km),wn.forEach(Km)}function Hs(e,t){e.blockedOn===t&&(e.blockedOn=null,lc||(lc=!0,ge.unstable_scheduleCallback(ge.unstable_NormalPriority,Eb)))}var Us=null;function Jm(e){Us!==e&&(Us=e,ge.unstable_scheduleCallback(ge.unstable_NormalPriority,function(){Us===e&&(Us=null);for(var t=0;t<e.length;t+=3){var a=e[t],l=e[t+1],i=e[t+2];if(typeof l!="function"){if(Ic(l||a)===null)continue;break}var n=Mi(a);n!==null&&(e.splice(t,3),t-=3,Bo(n,{pending:!0,data:i,method:a.method,action:l},l,i))}}))}function vi(e){function t(u){return Hs(u,e)}Ba!==null&&Hs(Ba,e),La!==null&&Hs(La,e),Ya!==null&&Hs(Ya,e),On.forEach(t),wn.forEach(t);for(var a=0;a<Ga.length;a++){var l=Ga[a];l.blockedOn===e&&(l.blockedOn=null)}for(;0<Ga.length&&(a=Ga[0],a.blockedOn===null);)Hy(a),a.blockedOn===null&&Ga.shift();if(a=(e.ownerDocument||e).$$reactFormReplay,a!=null)for(l=0;l<a.length;l+=3){var i=a[l],n=a[l+1],s=i[Ye]||null;if(typeof n=="function")s||Jm(a);else if(s){var r=null;if(n&&n.hasAttribute("formAction")){if(i=n,s=n[Ye]||null)r=s.formAction;else if(Ic(i)!==null)continue}else r=s.action;typeof r=="function"?a[l+1]=r:(a.splice(l,3),l-=3),Jm(a)}}}function Uy(){function e(n){n.canIntercept&&n.info==="react-transition"&&n.intercept({handler:function(){return new Promise(function(s){return i=s})},focusReset:"manual",scroll:"manual"})}function t(){i!==null&&(i(),i=null),l||setTimeout(a,20)}function a(){if(!l&&!navigation.transition){var n=navigation.currentEntry;n&&n.url!=null&&navigation.navigate(n.url,{state:n.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var l=!1,i=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",t),navigation.addEventListener("navigateerror",t),setTimeout(a,100),function(){l=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",t),navigation.removeEventListener("navigateerror",t),i!==null&&(i(),i=null)}}}function $c(e){this._internalRoot=e}jr.prototype.render=$c.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(v(409));var a=t.current,l=We();Oy(a,l,e,t,null,null)};jr.prototype.unmount=$c.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Oy(e.current,2,null,e,null,null),Yr(),t[bi]=null}};function jr(e){this._internalRoot=e}jr.prototype.unstable_scheduleHydration=function(e){if(e){var t=fh();e={blockedOn:null,target:e,priority:t};for(var a=0;a<Ga.length&&t!==0&&t<Ga[a].priority;a++);Ga.splice(a,0,e),a===0&&Hy(e)}};var km=Wm.version;if(km!=="19.2.7")throw Error(v(527,km,"19.2.7"));Z.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(v(188)):(e=Object.keys(e).join(","),Error(v(268,e)));return e=t1(t),e=e!==null?th(e):null,e=e===null?null:e.stateNode,e};var Tb={bundleType:0,version:"19.2.7",rendererPackageName:"react-dom",currentDispatcherRef:R,reconcilerVersion:"19.2.7"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&(en=__REACT_DEVTOOLS_GLOBAL_HOOK__,!en.isDisabled&&en.supportsFiber))try{Hn=en.inject(Tb),Je=en}catch{}var en;Zr.createRoot=function(e,t){if(!Im(e))throw Error(v(299));var a=!1,l="",i=Ap,n=zp,s=Rp;return t!=null&&(t.unstable_strictMode===!0&&(a=!0),t.identifierPrefix!==void 0&&(l=t.identifierPrefix),t.onUncaughtError!==void 0&&(i=t.onUncaughtError),t.onCaughtError!==void 0&&(n=t.onCaughtError),t.onRecoverableError!==void 0&&(s=t.onRecoverableError)),t=_y(e,1,!1,null,null,a,l,null,i,n,s,Uy),e[bi]=t.current,Fc(e),new $c(t)};Zr.hydrateRoot=function(e,t,a){if(!Im(e))throw Error(v(299));var l=!1,i="",n=Ap,s=zp,r=Rp,u=null;return a!=null&&(a.unstable_strictMode===!0&&(l=!0),a.identifierPrefix!==void 0&&(i=a.identifierPrefix),a.onUncaughtError!==void 0&&(n=a.onUncaughtError),a.onCaughtError!==void 0&&(s=a.onCaughtError),a.onRecoverableError!==void 0&&(r=a.onRecoverableError),a.formState!==void 0&&(u=a.formState)),t=_y(e,1,!0,t,a??null,l,i,u,n,s,r,Uy),t.context=Dy(null),a=t.current,l=We(),l=rc(l),i=wa(l),i.callback=null,Na(a,i,l),a=l,t.current.lanes=a,Bn(t,a),Ot(t),e[bi]=t.current,Fc(e),new jr(t)};Zr.version="19.2.7"});var qy=Gt((YM,Yy)=>{"use strict";function Ly(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Ly)}catch(e){console.error(e)}}Ly(),Yy.exports=By()});var Vy=Gt(Qr=>{"use strict";var Cb=Symbol.for("react.transitional.element"),Ab=Symbol.for("react.fragment");function Zy(e,t,a){var l=null;if(a!==void 0&&(l=""+a),t.key!==void 0&&(l=""+t.key),"key"in t){a={};for(var i in t)i!=="key"&&(a[i]=t[i])}else a=t;return t=a.ref,{$$typeof:Cb,type:e,key:l,ref:t!==void 0?t:null,props:a}}Qr.Fragment=Ab;Qr.jsx=Zy;Qr.jsxs=Zy});var ve=Gt((jM,Qy)=>{"use strict";Qy.exports=Vy()});var Cg=ne(qy(),1);var Mt=ne(el(),1);var se=ne(el(),1);function Xy(e){return`${e.x}:${e.y}`}function jy(e,t,a,l,i){return l<1||i<1||a.width<=0||a.height<=0||e<a.left||t<a.top||e>=a.left+a.width||t>=a.top+a.height?null:{x:Math.min(l-1,Math.floor((e-a.left)/a.width*l)),y:Math.min(i-1,Math.floor((t-a.top)/a.height*i))}}var Vr=class{activeTiles=new Map;visitedTiles=new Set;lastTile=null;paintMode=null;begin(t){return this.visitedTiles.clear(),this.paintMode=this.activeTiles.has(Xy(t))?"release":"press",this.lastTile=t,this.apply(t)}move(t){if(!this.paintMode)return[];let a=Gb(this.lastTile??t,t).flatMap(l=>this.apply(l));return this.lastTile=t,a}end(){this.lastTile=null,this.paintMode=null,this.visitedTiles.clear()}reset(){this.end(),this.activeTiles.clear()}keys(){return[...this.activeTiles.keys()]}apply(t){let a=Xy(t);if(!this.paintMode||this.visitedTiles.has(a))return[];this.visitedTiles.add(a);let l=this.paintMode==="press";return l?this.activeTiles.set(a,t):this.activeTiles.delete(a),[{...t,pressed:l}]}};function Gb(e,t){let a=[],l=e.x,i=e.y,n=Math.abs(t.x-e.x),s=e.x<t.x?1:-1,r=-Math.abs(t.y-e.y),u=e.y<t.y?1:-1,c=n+r;for(;;){if(a.push({x:l,y:i}),l===t.x&&i===t.y)return a;let f=c*2;f>=r&&(c+=r,l+=s),f<=n&&(c+=n,i+=u)}}var Ci=ne(ve(),1),ef=ne(el(),1);function Sl({frame:e,label:t="Vista del suelo",className:a=""}){return(0,Ci.jsxs)("section",{className:`ml-frame-preview-panel ${a}`.trim(),children:[(0,Ci.jsx)("span",{children:t}),(0,Ci.jsx)(Py,{frame:e})]})}function Py({frame:e,interactive:t=!1,inputResetKey:a,onTilePress:l,onTileRelease:i,className:n=""}){let s=(0,se.useRef)(null),r=(0,se.useRef)(null),u=(0,se.useRef)(new Vr),c=(0,se.useRef)(a),[f,y]=(0,se.useState)(()=>new Set),m={"--ml-floor-cols":e.width,"--ml-floor-rows":e.height},p=`ml-floor-preview ${t?"ml-floor-interactive":""} ${n}`.trim(),M=(0,se.useCallback)(()=>{let b=document.activeElement;b instanceof HTMLElement&&s.current?.contains(b)&&b.blur()},[]),x=(0,se.useCallback)((b,_)=>{let be=s.current;return be?jy(b,_,be.getBoundingClientRect(),e.width,e.height):null},[e.height,e.width]),N=(0,se.useCallback)(b=>{if(b.length!==0){for(let _ of b)_.pressed?l?.(_.x,_.y):i?.(_.x,_.y);y(new Set(u.current.keys()))}},[l,i]),d=(0,se.useCallback)(b=>{!b||Number.isNaN(b.x)||Number.isNaN(b.y)||N(u.current.begin(b))},[N]),o=(0,se.useCallback)(b=>{!b||Number.isNaN(b.x)||Number.isNaN(b.y)||N(u.current.move(b))},[N]),h=(0,se.useCallback)(()=>{u.current.reset(),y(new Set)},[]);(0,se.useEffect)(()=>{Object.is(c.current,a)||(c.current=a,h())},[h,a]),(0,se.useEffect)(()=>{t||h()},[h,t]),(0,se.useEffect)(()=>{if(!t)return;let b=()=>{r.current=null,u.current.end()},_=()=>{document.hidden&&b()};return window.addEventListener("blur",b),window.addEventListener("pointercancel",b),window.addEventListener("pointerup",b),document.addEventListener("visibilitychange",_),()=>{window.removeEventListener("blur",b),window.removeEventListener("pointercancel",b),window.removeEventListener("pointerup",b),document.removeEventListener("visibilitychange",_)}},[t]);let g=(0,se.useCallback)(b=>{!t||b.button!==0||(b.preventDefault(),M(),r.current=b.pointerId,s.current?.setPointerCapture(b.pointerId),d(x(b.clientX,b.clientY)))},[d,M,t,x]),A=(0,se.useCallback)(b=>{!t||r.current!==b.pointerId||(b.preventDefault(),o(x(b.clientX,b.clientY)))},[o,t,x]),H=(0,se.useCallback)(b=>{!t||r.current!==b.pointerId||(o(x(b.clientX,b.clientY)),r.current=null,u.current.end(),M(),s.current?.hasPointerCapture(b.pointerId)&&s.current.releasePointerCapture(b.pointerId))},[M,o,t,x]),T=(0,se.useCallback)(()=>{r.current=null,u.current.end(),M()},[M]),D=(0,se.useCallback)(b=>{N(u.current.begin(b)),u.current.end()},[N]);return(0,Ci.jsx)("div",{className:p,onLostPointerCapture:T,onPointerCancel:H,onPointerDown:g,onPointerMove:A,onPointerUp:H,ref:s,style:m,role:"grid","aria-label":"Vista del suelo",children:e.cells.map(b=>{let _={backgroundColor:b.color,gridColumnStart:b.x+1,gridRowStart:b.y+1},be=`${b.x}-${b.y}`,Ol=f.has(`${b.x}:${b.y}`),kf={className:"ml-floor-tile",style:_,"data-tile-x":b.x,"data-tile-y":b.y,"data-color":b.color};return t?(0,ef.createElement)("button",{...kf,"aria-label":`Baldosa ${b.x}, ${b.y}`,"aria-pressed":Ol,key:be,onClick:Ag=>{Ag.detail===0&&D(b)},type:"button"}):(0,ef.createElement)("span",{...kf,"aria-hidden":"true",key:be})})})}var C=ne(ve(),1),zb={ready:"Listo",waiting:"En espera",starting:"Preparados",running:"En juego",paused:"En pausa",finished:"Terminado"};function Rb(e){return zb[e]??e}var Ky=(0,Mt.createContext)({paused:!1});function Jy({paused:e,children:t}){return(0,C.jsx)(Ky.Provider,{value:{paused:e},children:t})}function yt({title:e,phase:t,variant:a="default",children:l}){let n=(0,Mt.useContext)(Ky).paused,s=n?"paused":t;return(0,C.jsxs)("section",{className:`ml-display-shell ml-tv-display ml-tv-display-${a}${n?" is-paused":""}`,"aria-label":`Pantalla de ${e}`,"data-paused":n||void 0,children:[(0,C.jsxs)("header",{className:"ml-display-header ml-tv-header",children:[(0,C.jsxs)("div",{className:"ml-tv-brand","aria-hidden":"true",children:[(0,C.jsx)("span",{className:"ml-tv-brand-mark"}),(0,C.jsxs)("span",{className:"ml-tv-brand-name",children:[(0,C.jsx)("b",{children:"Motion"}),(0,C.jsx)("b",{children:"Levels"})]})]}),(0,C.jsxs)("div",{className:"ml-tv-title",children:[(0,C.jsx)("span",{className:"ml-display-label",children:"Juego"}),(0,C.jsx)("h1",{children:e})]}),(0,C.jsx)("span",{className:`ml-status-pill ml-status-${s}`,children:Rb(s)})]}),(0,C.jsx)("div",{className:"ml-display-content",children:l})]})}function Pa({snapshot:e}){if(e.phase!=="waiting"&&e.phase!=="starting")return null;let t=e.readyPlayers??0,a=Math.max(e.requiredPlayers??e.playerCount,1),l=e.phase==="starting",i=Math.max(1,Math.ceil((e.countdownMillis??0)/1e3));return(0,C.jsxs)("section",{"aria-label":l?"El juego est\xE1 a punto de empezar":"Esperando jugadores",className:`ml-player-ready-overlay is-${e.phase}`,children:[(0,C.jsxs)("div",{className:"ml-player-ready-pulse","aria-hidden":"true",children:[(0,C.jsx)("i",{}),(0,C.jsx)("i",{}),(0,C.jsx)("i",{})]}),(0,C.jsx)("span",{children:l?"Todos listos":"Esperando jugadores"}),(0,C.jsx)("strong",{children:l?i:`${t}/${a}`}),(0,C.jsx)("b",{children:l?"El juego est\xE1 a punto de empezar":"Entra y permanece en la zona iluminada"})]})}function ae({label:e,value:t,tone:a="cyan",className:l=""}){return(0,C.jsxs)("article",{className:`ml-metric ml-metric-${a} ${l}`.trim(),children:[(0,C.jsx)("span",{className:"ml-metric-label",children:e}),(0,C.jsx)("strong",{className:"ml-metric-value",children:t})]})}function Ai({className:e="",lives:t,maxLives:a}){let l=Math.max(0,Math.trunc(a)),i=Math.min(l,Math.max(0,Math.trunc(t))),n=(0,Mt.useRef)(i),s=(0,Mt.useRef)(0),[r,u]=(0,Mt.useState)(null);return(0,Mt.useEffect)(()=>{let c=n.current;if(n.current=i,c===i)return;s.current+=1;let f={from:c,id:s.current,to:i};u(f);let y=window.setTimeout(()=>{u(m=>m?.id===f.id?null:m)},1100);return()=>window.clearTimeout(y)},[i]),(0,C.jsx)("div",{"aria-label":`${i} de ${l} vidas restantes`,className:`ml-lives-meter ${e}`.trim(),role:"img",children:Array.from({length:l},(c,f)=>{let y=f<i,p=r&&f>=Math.min(r.from,r.to)&&f<Math.max(r.from,r.to)?r.to>r.from?"is-regained":"is-losing":"";return(0,C.jsx)("span",{"aria-hidden":"true",className:`ml-life-heart ${y?"is-remaining":"is-lost"} ${p}`.trim(),"data-life-change":p||void 0,"data-life-state":y?"remaining":"lost",style:{"--ml-heart-index":f},children:(0,C.jsx)("span",{className:"ml-life-heart-glyph",children:"\u2665"})},f)})})}function wt({children:e,columns:t=3,className:a=""}){return(0,C.jsx)("section",{className:`ml-metric-row ${a}`.trim(),style:{"--ml-metric-columns":t},children:e})}function Pr({left:e,right:t,target:a,centerLabel:l,centerValue:i,centerCaption:n="",className:s=""}){return(0,C.jsxs)("section",{className:`ml-versus-scoreboard ${s}`.trim(),"aria-label":"Marcador",children:[(0,C.jsx)(Fy,{player:e,side:"red",target:a}),(0,C.jsxs)("article",{className:"ml-versus-center",children:[(0,C.jsx)("span",{children:l}),(0,C.jsx)("strong",{children:i}),n?(0,C.jsx)("b",{children:n}):null]}),(0,C.jsx)(Fy,{player:t,side:"blue",target:a})]})}function Fy({player:e,side:t,target:a}){let l=Math.max(0,Math.min(1,e.score/Math.max(a,1)));return(0,C.jsxs)("article",{className:`ml-player-score-panel ml-player-score-${t}`,style:{"--ml-player":e.color,"--ml-player-rgb":_b(e.color),"--ml-score-progress":l},children:[(0,C.jsxs)("div",{className:"ml-player-score-head",children:[(0,C.jsx)("span",{children:e.label}),(0,C.jsxs)("b",{children:[e.score,"/",a]})]}),(0,C.jsx)("strong",{children:e.score}),(0,C.jsx)("div",{className:"ml-player-score-track","aria-hidden":"true",children:(0,C.jsx)("i",{})})]})}function Fr({rounds:e,totalRounds:t,activeRound:a,activeLabel:l="Ronda actual",activeCaption:i="Punto en curso",fallbackLabel:n="Pendiente",className:s=""}){let r=Math.max(e.length,t??0,1),u=new Map(e.map(o=>[o.index,o])),c=Array.from({length:r},(o,h)=>{let g=h+1;return u.get(g)??{index:g,winnerLabel:n,hits:0}}),f=e.length<r?e.length+1:null,y=a===void 0?f:a,m=y??Math.max(e.length,1),p=12,M=Math.min(Math.max(0,m-Math.ceil(p/2)),Math.max(0,r-p)),x=c.slice(M,M+p),N=r>x.length?`Rondas ${x[0]?.index}-${x.at(-1)?.index} de ${r}`:"Historial del partido",d={"--ml-round-count":x.length,"--ml-round-progress":`${Math.min(1,e.length/r)*100}%`};return(0,C.jsxs)("section",{className:`ml-round-strip ${s}`.trim(),"aria-label":"Rondas",style:d,children:[(0,C.jsxs)("div",{className:"ml-round-strip-head",children:[(0,C.jsxs)("div",{className:"ml-round-strip-title",children:[(0,C.jsx)("span",{children:"Rondas"}),(0,C.jsx)("small",{children:N})]}),(0,C.jsxs)("div",{className:"ml-round-strip-count","aria-label":`${e.length} de ${r} rondas jugadas`,children:[(0,C.jsx)("strong",{children:e.length}),(0,C.jsxs)("span",{children:["de ",r]})]})]}),(0,C.jsx)("div",{className:"ml-round-progress","aria-hidden":"true",children:(0,C.jsx)("i",{})}),(0,C.jsx)("div",{className:"ml-round-list",children:x.map(o=>{let h=o.winnerIndex===0||o.winnerIndex===1,g=!h&&o.index===y,A=o.winnerIndex===0?"is-red":o.winnerIndex===1?"is-blue":g?"is-current":"is-pending",H=o.hits??0;return(0,C.jsxs)("article",{className:`ml-round-card ${A}`,children:[(0,C.jsxs)("div",{className:"ml-round-card-head",children:[(0,C.jsxs)("span",{children:["R",o.index]}),(0,C.jsx)("i",{"aria-hidden":"true"})]}),(0,C.jsx)("strong",{children:h?o.winnerLabel||n:g?l:n}),h?(0,C.jsxs)("b",{children:[H," ",H===1?"golpe":"golpes"]}):null,g?(0,C.jsx)("b",{children:i}):null]},o.index)})})]})}function _b(e){let t=e.replace("#","").trim(),a=t.length===3?t.split("").map(i=>i+i).join(""):t.padEnd(6,"0").slice(0,6),l=Number.parseInt(a,16);return Number.isFinite(l)?`${l>>16&255}, ${l>>8&255}, ${l&255}`:"255, 255, 255"}var cf={};wl(cf,{PlayerDisplay:()=>t0,arkanoidConfigVars:()=>Kn,ballColor:()=>rf,brickColors:()=>of,createGame:()=>Jn,finishedFrame:()=>u0,finishedSnapshot:()=>o0,initEvents:()=>n0,manifest:()=>Bt,paddleColor:()=>uf,runningFrame:()=>s0,runningSnapshot:()=>r0});function Fa(e,t){let a=t.centerX??(e.width-1)/2,l=t.centerY??(e.height-1)/2,i=Math.max(0,t.radius),n=Math.max(0,t.thickness??1);ky(e,t.color,(s,r)=>{let u=Wy(s,r,a,l);return{distance:u,phase:Math.abs(u-i),selected:Math.abs(u-i)<=n}},0)}function St(e,t){let a=t.centerX??(e.width-1)/2,l=t.centerY??(e.height-1)/2,i=Math.max(1,Math.floor(t.period??7)),n=Math.min(i,Math.max(1,Math.floor(t.bandWidth??2))),s=Math.floor(t.step);ky(e,t.color,(r,u)=>{let c=Math.floor(Wy(r,u,a,l)),f=Db(c+s,i);return{distance:c,phase:f,selected:f<n}},s)}function ky(e,t,a,l){for(let i=0;i<e.height;i+=1)for(let n=0;n<e.width;n+=1){let s=a(n,i);if(!s.selected)continue;let r=typeof t=="function"?t({distance:s.distance,phase:s.phase,step:l,x:n,y:i}):t;r&&(e.cells[i*e.width+n]={x:n,y:i,color:r})}}function Wy(e,t,a,l){return Math.abs(e-a)+Math.abs(t-l)}function Db(e,t){return(e%t+t)%t}var S=16,G=32,Ob=137,wb=0,Nb=4294967295,xt=S*G,Hb=2e3,Ub=650,Bb=["easy","medium","hard","expert"],Lb=50,JM=1e3/Lb;function Nt(e,t){return Number.isInteger(e)&&Number.isInteger(t)&&e>=0&&e<S&&t>=0&&t<G}function Ee(e,t){return{seed:Yb(e.seed),playerCount:qb(e.playerCount,t),players:Array.isArray(e.players)?e.players:[],durationMillis:Iy(e.durationMillis,t.defaultDurationMillis),nowMillis:Iy(e.nowMillis,0),difficulty:Zb(e.difficulty,t),options:Vb(e.options,t)}}function Yb(e){let t=typeof e=="number"&&Number.isFinite(e)?Math.trunc(e):Ob;return W(t,wb,Nb)}function qb(e,t){let a=typeof e=="number"&&Number.isFinite(e)?Math.round(e):Xb(t);return t.players.allowAny===!0&&a===0?0:W(a,t.players.min,t.players.max)}function Xb(e){return e.players.allowAny?0:e.players.min}function Iy(e,t){return typeof e=="number"&&Number.isFinite(e)?Math.max(0,e):t}function jb(e){let t=e.config?.difficulty?.options;return t?.length?[...t]:[...Bb]}function Zb(e,t){let a=jb(t),l=t.config?.difficulty?.default,i=l&&a.includes(l)?l:a.includes("medium")?"medium":a[0]??"medium";return e&&a.includes(e)?e:i}function Vb(e,t){let a=e??{};return Object.fromEntries((t.config?.vars??[]).map(l=>[l.key,$y(l,a[l.key])]))}function $y(e,t){if(e.type==="bool")return t===!0||t==="true"?!0:t===!1||t==="false"?!1:e.default;if(e.type==="enum"){let s=String(t??e.default);return e.options.some(u=>u.value===s)?s:e.default}let a=typeof t=="number"&&Number.isFinite(t)?t:typeof t=="string"&&t.trim()!==""?Number(t):Number.NaN,l=Number.isFinite(a)?a:e.default,i=e.type==="int"?Math.round(l):l;return W(i,e.min??-1/0,e.max??1/0)}function Ht(e,t){return $y(t,e[t.key])}function Xe(e="#05070a"){let t=[];for(let a=0;a<G;a+=1)for(let l=0;l<S;l+=1)t.push({x:l,y:a,color:e});return{width:S,height:G,cells:t}}function z(e,t,a,l){Nt(t,a)&&(e.cells[a*e.width+t]={x:t,y:a,color:l})}function U(e,t,a,l,i,n){for(let s=a;s<a+i;s+=1)for(let r=t;r<t+l;r+=1)z(e,r,s,n)}function E(e,t,a){return{cue:e,message:t.trimEnd().replace(/\.+$/u,""),atMillis:a}}function et(e){let t=e>>>0;return t===0&&(t=1),{next(){return t=Math.imul(t,1664525)+1013904223>>>0,t/4294967296},int(a){if(!Number.isFinite(a)||a<=0)throw new Error("maxExclusive must be greater than zero");return Math.floor(this.next()*a)},range(a,l){if(l<a)throw new Error("maxInclusive must be greater than or equal to minInclusive");return a+this.int(l-a+1)}}}function zi(e,t=[]){let a=["#35d7ff","#ff3bd7","#ffe176","#5fff9e"];return Array.from({length:e},(l,i)=>({index:i,label:t[i]?.label||t[i]?.name||`Player ${i+1}`,color:t[i]?.color||a[i%a.length]||a[0],score:0,lives:-1}))}function W(e,t,a){return Math.min(a,Math.max(t,e))}function Kr(e,t={}){if(!Number.isInteger(e)||e<1)throw new Error("player ready zone count must be a positive integer");let a=W(Math.round(t.minX??0),0,S-1),l=W(Math.round(t.maxX??S-1),a,S-1),i=W(Math.round(t.minY??0),0,G-1),s=W(Math.round(t.maxY??G-1),i,G-1)-i+1;if(e>s)throw new Error("player ready zone count cannot exceed the available floor rows");return Array.from({length:e},(r,u)=>({minX:a,maxX:l,minY:i+Math.floor(s*u/e),maxY:i+Math.floor(s*(u+1)/e)-1}))}function je(e,t,a=0){return new af(e,t,a)}function lf(e){return e0(e.mode==="player-ready"?e.countdownMillis:void 0,Hb)}function Pn(e){return Number.isFinite(e)?Math.max(0,e):0}var af=class{constructor(t,a,l){this.policy=t;this.zones=a;if(t.mode==="player-ready"&&a.length===0)throw new Error("player-ready games require at least one presence zone");this.countdownDuration=lf(t),this.releaseGraceMillis=e0(t.mode==="player-ready"?t.releaseGraceMillis:void 0,Ub),this.zoneHeld=Array.from({length:a.length},()=>0),this.zoneGraceUntil=Array.from({length:a.length},()=>0),this.phase=t.mode==="immediate"?"running":"waiting";for(let i=0;i<G;i+=1)for(let n=0;n<S;n+=1)this.tileZones[i*S+n]=a.findIndex(s=>Qb(n,i,s));this.reset(l)}policy;zones;countdownDuration;releaseGraceMillis;tileZones=new Int16Array(xt).fill(-1);tileHeld=new Uint8Array(xt);zoneHeld;zoneGraceUntil;phase;startAtMillis=0;reset(t=0){return this.tileHeld.fill(0),this.zoneHeld.fill(0),this.zoneGraceUntil.fill(0),this.phase=this.policy.mode==="immediate"?"running":"waiting",this.startAtMillis=Pn(t),this.state(t)}update(t){if(!Nt(t.x,t.y))return this.tick(t.atMillis);let a=t.y*S+t.x,l=this.tileZones[a]??-1,i=this.tileHeld[a]===1;return l>=0&&i!==t.pressed&&(this.tileHeld[a]=t.pressed?1:0,t.pressed?(this.zoneHeld[l]=(this.zoneHeld[l]??0)+1,this.zoneGraceUntil[l]=0):(this.zoneHeld[l]=Math.max(0,(this.zoneHeld[l]??0)-1),this.zoneHeld[l]===0&&(this.zoneGraceUntil[l]=Pn(t.atMillis)+this.releaseGraceMillis))),this.tick(t.atMillis)}tick(t){if(this.policy.mode==="immediate"||this.phase==="running")return"none";let a=Pn(t),l=this.readyPlayerCount(a)===this.zones.length;return this.phase==="waiting"&&l?(this.phase="starting",this.startAtMillis=a+this.countdownDuration,"players-ready"):this.phase==="starting"&&!l?(this.phase="waiting",this.startAtMillis=0,"players-left"):this.phase==="starting"&&a>=this.startAtMillis?(this.phase="running","started"):"none"}state(t){let a=Pn(t);return{phase:this.phase,readyPlayers:this.readyPlayerCount(a),requiredPlayers:this.zones.length,countdownMillis:this.phase==="starting"?Math.max(0,this.startAtMillis-a):0}}zoneReady(t,a){let l=this.zoneGraceUntil[t]??0;return(this.zoneHeld[t]??0)>0||l>0&&l>=Pn(a)}readyPlayerCount(t){return this.zones.reduce((a,l,i)=>a+Number(this.zoneReady(i,t)),0)}};function e0(e,t){return e!==void 0&&Number.isFinite(e)&&e>0?e:t}function Qb(e,t,a){return e>=a.minX&&e<=a.maxX&&t>=a.minY&&t<=a.maxY}function xl(e){return`#${tf(e.r)}${tf(e.g)}${tf(e.b)}`}function Ut(e,t){return{r:W(Math.round(e.r*t/100),0,255),g:W(Math.round(e.g*t/100),0,255),b:W(Math.round(e.b*t/100),0,255)}}function Fn(e,t){return{r:W(e.r+t.r,0,255),g:W(e.g+t.g,0,255),b:W(e.b+t.b,0,255)}}function tf(e){return W(Math.round(e),0,255).toString(16).padStart(2,"0")}function tt(e){let t=Math.max(0,Math.ceil(e)),a=Math.ceil(t/1e3),l=Math.floor(a/60),i=a%60;return`${l}:${i.toString().padStart(2,"0")}`}var at=ne(ve(),1);function t0({snapshot:e,frame:t}){let a=e.phase==="ready"?"Pisa abajo para mover y lanzar":e.lastEventMessage||"Rompe todos los bloques",l=e.success?"green":e.phase==="finished"?"red":e.phase==="ready"?"yellow":"cyan";return(0,at.jsx)(yt,{title:e.label,phase:e.phase,children:(0,at.jsxs)("div",{className:"ml-solo-display arkanoid-display",children:[(0,at.jsx)(Pa,{snapshot:e}),(0,at.jsxs)("div",{className:"ml-solo-summary",children:[(0,at.jsxs)(wt,{columns:3,className:"ml-solo-number-row",children:[(0,at.jsx)(ae,{label:"Bloques",tone:"pink",value:`${e.score}/${e.totalBricks}`}),(0,at.jsx)(ae,{label:"Vidas",tone:"neutral",value:(0,at.jsx)(Ai,{lives:e.lives,maxLives:e.maxLives})}),(0,at.jsx)(ae,{label:"Tiempo",tone:"yellow",value:tt(e.elapsedMillis)})]}),(0,at.jsx)(ae,{className:"ml-solo-message",label:"Estado",tone:l,value:a})]}),t?(0,at.jsx)(Sl,{className:"ml-solo-floor",frame:t,label:"Juego en el suelo"}):null]})})}var Kn={ballSpeed:{key:"ball_speed",label:"Ball speed (tiles/s)",playerFacing:!0,description:"Base ball speed on Easy. Higher difficulties multiply this value.",type:"float",default:4.25,min:2,max:8,step:.25}},Bt={id:"arkanoid",label:"Arkanoid",description:"Single-player floor Arkanoid with step-controlled paddle movement and deterministic brick physics.",availability:{development:!0,production:!0},catalog:{category:"individual",color:"#ff9f45",durationLabel:"Sin l\xEDmite",modeLabel:"Arkanoid",audioLabel:"Efectos",rules:["Pisa la zona inferior para mover la pala","Rompe todos los bloques sin perder la pelota"]},players:{allowAny:!0,min:1,max:1},start:{mode:"player-ready"},config:{difficulty:{default:"medium",options:["easy","medium","hard","expert"]},vars:Object.values(Kn)},defaultDurationMillis:0,display:{entry:"./display"},preview:{seed:137,playerCount:1,difficulty:"medium",actions:[{atMillis:100,type:"press",x:7,y:30},{atMillis:2150,type:"release",x:7,y:30},{atMillis:2250,type:"press",x:9,y:30},{atMillis:2450,type:"release",x:9,y:30}],captureStartMillis:2200,frameCount:18,frameIntervalMillis:120},tags:["arcade","single-player","typescript"]};var rf="#ffffff",uf="#35d7ff",of=["#ff3151","#ff8a2a","#ffd45f","#74e58d"],Pb="#ff3151",Fb="#03070c",Kb="#06101d",Jb="#145cff",kb="#37101a",Wb="#ff3151",Lt="#74e58d",a0=["#9ddfff","#4b91b8","#21445b"],Ib=4,l0=2,$b=3,El=5,Ka=29,Ja=24,nf=3,eM=12;function Jn(e){return new sf(e)}var sf=class{ball={x:7,y:Ka-1,dx:1,dy:-1};ballMoves=0;ballTrail=[];bricks=[];config;lastControlX=7;lastEvent=E("none","Listo",0);lastMoveMillis=0;lives=nf;nowMillis=0;paddleX=Math.floor((S-El)/2);phase="ready";players=[];rng;readyGate;score=0;startedAtMillis=0;constructor(t){this.config=Ee(t,Bt),this.rng=et(this.config.seed),this.readyGate=je(Bt.start,[{minX:0,maxX:S-1,minY:Ja,maxY:G-1}],this.config.nowMillis),this.resetState(this.config.nowMillis)}init(t){return this.nowMillis=t,this.readyGate.reset(t),this.phase="waiting",this.attachBall(),this.lastEvent=E("ready","Esperando jugador abajo",t),[this.lastEvent]}press(t){return this.nowMillis=t.atMillis,t.y<Ja||t.y>=G?[]:(t.pressed&&this.movePaddle(t.x),this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update(t),t.atMillis):this.phase==="ready"&&t.pressed?this.launchBall(t.atMillis):[])}release(t){return this.nowMillis=t.atMillis,this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update({...t,pressed:!1}),t.atMillis):[]}tick(t){if(this.nowMillis=t.atMillis,this.phase==="waiting"||this.phase==="starting")return this.applyReadyTransition(this.readyGate.tick(t.atMillis),t.atMillis);if(this.phase!=="running")return[];let a=[],l=1e3/i0(this.config);for(let i=0;i<eM&&!(t.atMillis-this.lastMoveMillis<l);i+=1){this.lastMoveMillis+=l;let n=this.moveBall(this.lastMoveMillis);if(n&&a.push(n),this.phase!=="running")break}return this.recordEvents(a)}render(){let t=Xe(Fb);U(t,0,Ja,S,G-Ja,Kb),U(t,0,G-1,S,1,kb);for(let a of this.bricks)a.alive&&U(t,a.x,a.y,a.width,1,a.color);return(this.phase==="waiting"||this.phase==="starting")&&this.drawPlayerStart(t),this.phase==="finished"&&this.score===this.bricks.length&&aM(t),this.ballTrail.forEach((a,l)=>{let i=a0[l];i&&z(t,a.x,a.y,i)}),(this.phase!=="finished"||this.lives>0)&&z(t,this.ball.x,this.ball.y,rf),U(t,this.paddleX,Ka,El,1,this.phase==="finished"&&this.lives===0?Wb:uf),z(t,this.lastControlX,G-1,Jb),t}snapshot(){let t=this.bricksRemaining(),a=this.readyGate.state(this.nowMillis);return{currentGame:Bt.id,label:Bt.label,phase:this.phase,playerCount:this.config.playerCount,players:this.players,score:this.score,lives:this.lives,maxLives:nf,elapsedMillis:Math.max(0,this.nowMillis-this.startedAtMillis),remainingMillis:0,activeTargets:t,success:t===0,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?a.countdownMillis:0,readyPlayers:a.readyPlayers,requiredPlayers:a.requiredPlayers,matchTarget:this.bricks.length,ball:{...this.ball},ballMoves:this.ballMoves,ballSpeed:i0(this.config),bricksRemaining:t,launched:this.phase==="running",paddleWidth:El,paddleX:this.paddleX,totalBricks:this.bricks.length}}reset(t={}){this.config=Ee({...this.config,...t},Bt),this.rng=et(this.config.seed),this.resetState(this.config.nowMillis)}applyReadyTransition(t,a){return t==="players-ready"?(this.phase="starting",this.lastEvent=E("ready","Jugador listo",a),[this.lastEvent]):t==="players-left"?(this.phase="waiting",this.lastEvent=E("ready","Vuelve a la zona iluminada",a),[this.lastEvent]):t==="started"?this.launchBall(a):[]}launchBall(t){let a=this.phase==="waiting"||this.phase==="starting";return this.phase="running",a&&(this.startedAtMillis=t),this.ball={x:this.paddleCenter(),y:Ka-1,dx:this.rng.next()<.5?-1:1,dy:-1},this.ballTrail=[],this.lastMoveMillis=t,this.lastEvent=E("start","Pelota en juego",t),[this.lastEvent]}attachBall(){this.ball={x:this.paddleCenter(),y:Ka-1,dx:this.ball.dx,dy:-1},this.ballTrail=[]}brickAt(t,a){return this.bricks.find(l=>l.alive&&l.y===a&&t>=l.x&&t<l.x+l.width)}bricksRemaining(){return this.bricks.reduce((t,a)=>t+Number(a.alive),0)}commitBall(t){this.ballTrail=[{x:this.ball.x,y:this.ball.y},...this.ballTrail].slice(0,a0.length),this.ball=t,this.ballMoves+=1}loseLife(t){return this.lives-=1,this.players=this.scoredPlayers(),this.ballTrail=[],this.lives<=0?(this.phase="finished",E("fail","Sin vidas",t)):(this.phase="ready",this.attachBall(),E("fail","Vida perdida, pisa abajo para lanzar",t))}moveBall(t){let a=this.ball.dx,l=this.ball.dy,i=this.ball.x+a,n=this.ball.y+l;(i<0||i>=S)&&(a=a===1?-1:1,i=this.ball.x+a),n<1&&(l=1,n=this.ball.y+l);let s=this.brickAt(i,n);if(s)return s.alive=!1,this.score+=1,this.players=this.scoredPlayers(),this.ball={...this.ball,dx:a,dy:l===1?-1:1},this.ballMoves+=1,this.bricksRemaining()===0?(this.phase="finished",E("win","Muro completado",t)):E("hit",`Bloque ${this.score} de ${this.bricks.length}`,t);if(l>0&&n===Ka&&i>=this.paddleX&&i<this.paddleX+El){let r=i-this.paddleCenter();return r<0?a=-1:r>0?a=1:a=this.rng.next()<.5?-1:1,Math.abs(r)===1&&this.rng.next()<.35&&(a=a===1?-1:1),this.commitBall({x:i,y:Ka-1,dx:a,dy:-1}),E("coin","Rebote",t)}if(n>=G)return this.loseLife(t);this.commitBall({x:i,y:n,dx:a,dy:l})}movePaddle(t){let a=Math.floor(El/2),l=W(Math.round(t),a,S-1-a);this.paddleX=l-a,this.lastControlX=W(Math.round(t),0,S-1),(this.phase==="ready"||this.phase==="waiting"||this.phase==="starting")&&this.attachBall()}drawPlayerStart(t){if(this.phase==="waiting"){let l=Ja+Math.floor(this.nowMillis/150)%(G-Ja);for(let i=Ja;i<G;i+=1)for(let n=0;n<S;n+=1)(i===l||n===0||n===S-1)&&z(t,n,i,i===l?"#35d7ff":"#0b4260");return}let a=Math.floor(this.nowMillis/125)%4;for(let l=0;l<G;l+=1)for(let i=0;i<S;i+=1)(Math.abs(i-this.paddleCenter())+Math.abs(l-Ka)+a)%6===0&&z(t,i,l,l>=Ja?"#ffe176":"#176783")}paddleCenter(){return this.paddleX+Math.floor(El/2)}recordEvents(t){let a=t.at(-1);return a&&(this.lastEvent=a),t}resetState(t){this.bricks=tM(),this.lives=nf,this.nowMillis=t,this.startedAtMillis=t,this.lastMoveMillis=t,this.paddleX=Math.floor((S-El)/2),this.lastControlX=this.paddleCenter(),this.readyGate.reset(t),this.phase="waiting",this.score=0,this.ballMoves=0,this.ball={x:this.paddleCenter(),y:Ka-1,dx:1,dy:-1},this.ballTrail=[],this.players=this.scoredPlayers(),this.lastEvent=E("ready","Esperando jugador abajo",t)}scoredPlayers(){return zi(this.config.playerCount,this.config.players).map(t=>({...t,lives:this.lives,score:this.score}))}};function tM(){let e=[],t=0;for(let a=0;a<Ib;a+=1)for(let l=0;l<S;l+=l0)e.push({alive:!0,color:of[a]??Pb,id:t,width:l0,x:l,y:$b+a}),t+=1;return e}function aM(e){U(e,2,13,S-4,1,Lt),U(e,2,19,S-4,1,Lt),U(e,2,13,1,7,Lt),U(e,S-3,13,1,7,Lt),z(e,5,16,Lt),z(e,6,17,Lt),z(e,7,18,Lt),z(e,8,17,Lt),z(e,9,16,Lt),z(e,10,15,Lt)}function i0(e){return Ht(e.options,Kn.ballSpeed)*lM(e.difficulty)}function lM(e){switch(e){case"medium":return 1.25;case"hard":return 1.6;case"expert":return 2;default:return 1}}var Ri=Jn({playerCount:1,difficulty:"medium"}),n0=Ri.init(0);Ri.press({x:7,y:30,pressed:!0,atMillis:100});Ri.tick({atMillis:2100});Ri.tick({atMillis:3300});var s0=Ri.render(),r0=Ri.snapshot(),Jr=Jn({playerCount:1,difficulty:"easy"});Jr.init(0);iM(Jr);var u0=Jr.render(),o0=Jr.snapshot();function iM(e){e.press({x:7,y:30,pressed:!0,atMillis:50}),e.tick({atMillis:2050});let t=2100;for(let a=0;a<24e3&&e.snapshot().phase!=="finished";a+=1){let l=e.snapshot();e.press({x:l.ball.x,y:30,pressed:!0,atMillis:t}),e.tick({atMillis:t}),t+=50}}var gf={};wl(gf,{PlayerDisplay:()=>c0,createGame:()=>ka,crowdedRunningFrame:()=>x0,crowdedRunningSnapshot:()=>E0,dueloConfigVars:()=>_i,dueloPlayerPalette:()=>ua,dueloReadyZones:()=>Ir,finishedFrame:()=>T0,finishedSnapshot:()=>G0,manifest:()=>lt,runningFrame:()=>M0,runningSnapshot:()=>S0,startingFrame:()=>v0,startingSnapshot:()=>b0,waitingFrame:()=>y0,waitingSnapshot:()=>g0,winAnimationMillis:()=>Wr});var q=ne(ve(),1);function c0({snapshot:e}){let t=e.playerCount<=4?2:e.playerCount<=6?3:4,a=Math.max(1,Math.ceil(e.countdownMillis/1e3)),l=Math.max(1,Math.ceil(e.remainingMillis/1e3)),i=new Set(e.readyPlayerIndices),n=sM(e,a,l),s={"--duelo-grid-columns":t,"--duelo-player-count":e.playerCount,"--duelo-winner":e.winnerIndex>=0?e.playerProgress[e.winnerIndex]?.color??"#ffffff":"#ffffff","--duelo-winner-rgb":e.winnerIndex>=0?f0(e.playerProgress[e.winnerIndex]?.color??"#ffffff"):"255, 255, 255"};return(0,q.jsx)(yt,{title:e.label,phase:e.phase,children:(0,q.jsxs)("div",{className:`duelo-display is-phase-${e.phase} is-player-count-${e.playerCount}`,style:s,children:[(0,q.jsxs)("section",{className:"duelo-hero","aria-label":n.title,children:[(0,q.jsxs)("div",{className:"duelo-hero-copy",children:[(0,q.jsx)("span",{children:n.eyebrow}),(0,q.jsx)("strong",{children:n.title}),(0,q.jsx)("b",{children:n.caption})]}),(0,q.jsxs)("div",{className:"duelo-hero-metrics",children:[(0,q.jsx)(ff,{label:"Tiempo",value:tt(e.elapsedMillis)}),(0,q.jsx)(ff,{label:"Restantes",value:e.remainingTargets}),(0,q.jsx)(ff,{label:"Densidad",value:`${e.fillPercent}%`})]})]}),(0,q.jsx)("section",{className:"duelo-player-grid","aria-label":"Progreso de jugadores",children:e.playerProgress.map(r=>(0,q.jsx)(nM,{leader:e.leaderIndex===r.index,phase:e.phase,player:r,ready:i.has(r.index),recent:e.recentClaim?.playerIndex===r.index,winner:e.winnerIndex===r.index},r.index))}),(0,q.jsxs)("footer",{className:"duelo-event-rail",children:[(0,q.jsx)("span",{children:e.phase==="waiting"?"Preparaci\xF3n":e.phase==="finished"?"Resultado":"\xDAltimo evento"}),(0,q.jsx)("strong",{children:e.lastEventMessage||"Listo"},e.motionEventId),(0,q.jsx)("b",{children:e.phase==="finished"?`Nueva partida en ${l}`:`${e.claimedTargets}/${e.totalTargets} reclamadas`})]})]})})}function nM({leader:e,phase:t,player:a,ready:l,recent:i,winner:n}){let s=t==="waiting"?l?"Listo":"Entra en tu zona":t==="starting"?"Preparado":n?"Ganador":e?"L\xEDder":"En carrera",r={"--duelo-player":a.color,"--duelo-player-rgb":f0(a.color),"--duelo-progress":a.progress},u=a.label.length>28?" is-extra-long":a.label.length>18?" is-long":"";return(0,q.jsxs)("article",{className:["duelo-player-card",l?"is-ready":"",e?"is-leader":"",i?"is-recent":"",n?"is-winner":""].filter(Boolean).join(" "),style:r,children:[(0,q.jsxs)("header",{children:[(0,q.jsx)("i",{"aria-hidden":"true"}),(0,q.jsx)("span",{className:`duelo-player-name${u}`,children:a.label}),(0,q.jsx)("b",{children:s})]}),(0,q.jsxs)("div",{className:"duelo-player-score",children:[(0,q.jsx)("strong",{children:a.remaining}),(0,q.jsx)("span",{children:"baldosas restantes"}),i?(0,q.jsx)("em",{children:"+1"},`${a.index}-${a.claimed}`):null]}),(0,q.jsx)("div",{className:"duelo-player-track","aria-hidden":"true",children:(0,q.jsx)("i",{})}),(0,q.jsxs)("footer",{children:[(0,q.jsx)("span",{children:"Reclamadas"}),(0,q.jsxs)("strong",{children:[a.claimed,"/",a.target]})]})]})}function ff({label:e,value:t}){return(0,q.jsxs)("article",{className:"duelo-hero-metric",children:[(0,q.jsx)("span",{children:e}),(0,q.jsx)("strong",{children:t})]})}function sM(e,t,a){return e.phase==="waiting"?{eyebrow:`Listos ${e.readyPlayers}/${e.requiredPlayers}`,title:"Busca tu color",caption:"Cada jugador entra y permanece en su zona iluminada"}:e.phase==="starting"?{eyebrow:"Todos listos",title:String(t),caption:"El duelo est\xE1 a punto de empezar"}:e.phase==="finished"?{eyebrow:"Victoria",title:`\xA1Gana ${e.winnerLabel}!`,caption:`Nueva partida en ${a}`}:{eyebrow:e.leaderIndex>=0?`Lidera ${e.leaderLabel}`:"Empate",title:"Reclama tu color",caption:"Pisa todas tus baldosas antes que los dem\xE1s"}}function f0(e){return/^#[0-9a-f]{6}$/i.test(e)?[1,3,5].map(t=>Number.parseInt(e.slice(t,t+2),16)).join(", "):"255, 255, 255"}var _i={baseFillPercent:{key:"base_fill_percent",label:"Base floor coverage (%)",playerFacing:!1,description:"The percentage of floor tiles assigned as targets on Medium difficulty.",type:"int",default:60,min:30,max:75,step:5},hardFillMultiplier:{key:"hard_fill_multiplier",label:"Hard coverage multiplier",playerFacing:!1,description:"Hard difficulty multiplies the base floor coverage by this value, capped at the full floor.",type:"float",default:1.5,min:1,max:1.8,step:.05}},lt={id:"duelo",label:"Duelo",description:"A fast 2\u20138 player race to claim every tile of your color before anyone else.",availability:{development:!0,production:!0},catalog:{category:"versus",color:"#ff5268",durationLabel:"Sin l\xEDmite",modeLabel:"Carrera de colores",audioLabel:"M\xFAsica + efectos",rules:["Cada jugador ocupa la zona de inicio de su color","Pisa todas las baldosas de tu color antes que los dem\xE1s"]},players:{allowAny:!1,min:2,max:8},start:{mode:"player-ready",countdownMillis:3e3,releaseGraceMillis:2e3},config:{difficulty:{default:"medium",options:["medium","hard"]},vars:Object.values(_i)},defaultDurationMillis:0,display:{entry:"./display"},preview:{seed:137,playerCount:4,difficulty:"medium",actions:[{atMillis:100,type:"press",x:1,y:1},{atMillis:100,type:"press",x:14,y:30},{atMillis:100,type:"press",x:1,y:30},{atMillis:100,type:"press",x:14,y:1}],captureStartMillis:3200,frameCount:18,frameIntervalMillis:120},tags:["competitive","multiplayer","color-race","typescript"]};var Di=4,rM=18,d0=420,m0=700,Wr=5e3,uM="#03060b",mf={r:255,g:255,b:255},ua=["#ff3048","#24d9ff","#42e879","#ff4fd8","#376bff","#ffd84d","#a66cff","#ff8a3d"];function ka(e){return new df(e)}function Ir(e){let t=W(Math.round(e),lt.players.min,lt.players.max),a=S-Di,l=G-Di,i=Math.floor((S-Di)/2),n=Math.floor((G-Di)/2);return(t===2?[[0,n],[a,n]]:t===3?[[0,0],[a,0],[i,l]]:[[0,0],[a,l],[0,l],[a,0],[0,n],[a,n],[i,0],[i,l]].slice(0,t)).map(([r=0,u=0])=>({minX:r,maxX:r+Di-1,minY:u,maxY:u+Di-1}))}var df=class{claimed=new Uint8Array(xt);claimedAt=new Float64Array(xt);claims=[];config;fillPercent=60;finishAtMillis=0;lastEvent=E("none","Listo",0);motionEventId=0;nowMillis=0;owners=new Int16Array(xt).fill(-1);phase="waiting";players=[];readyGate;readyZones=[];recentClaim=null;rng;startedAtMillis=0;targets=[];winnerIndex=-1;constructor(t){this.config=Ee(t,lt),this.rng=et(this.config.seed),this.readyZones=Ir(this.config.playerCount),this.readyGate=je(lt.start,this.readyZones,this.config.nowMillis),this.resetGame(this.config.nowMillis)}init(t){return this.resetGame(t),this.lastEvent=E("ready",this.waitingMessage(),t),[this.lastEvent]}press(t){if(this.nowMillis=t.atMillis,this.phase==="waiting"||this.phase==="starting")return this.recordEvents(this.applyReadyTransition(this.readyGate.update(t),t.atMillis));if(this.phase!=="running"||!t.pressed||!Nt(t.x,t.y))return[];let a=this.claimTile(t.x,t.y,t.atMillis);return this.recordEvents(a?[a]:[])}release(t){return this.nowMillis=t.atMillis,this.phase==="waiting"||this.phase==="starting"?this.recordEvents(this.applyReadyTransition(this.readyGate.update({...t,pressed:!1}),t.atMillis)):[]}tick(t){return this.nowMillis=t.atMillis,this.phase==="waiting"||this.phase==="starting"?this.recordEvents(this.applyReadyTransition(this.readyGate.tick(t.atMillis),t.atMillis)):this.phase==="finished"&&t.atMillis-this.finishAtMillis>=Wr?(this.resetGame(t.atMillis),this.recordEvents([E("ready","Nuevo duelo",t.atMillis)])):[]}render(){let t=Xe(uM);return this.phase==="waiting"?this.drawWaiting(t):this.phase==="starting"?this.drawStarting(t):this.phase==="running"?this.drawBoard(t):this.drawVictory(t),t}snapshot(){let t=this.readyGate.state(this.nowMillis),a=this.playerProgress(),l=a.reduce((f,y)=>!f||y.progress>f.progress||y.progress===f.progress&&y.index<f.index?y:f,void 0),i=l&&a.filter(f=>f.progress===l.progress).length===1?l:void 0,n=this.claims.reduce((f,y)=>f+y,0),s=this.targets.reduce((f,y)=>f+y,0),r=this.players[this.winnerIndex],u=this.phase==="finished"?this.finishAtMillis:this.nowMillis,c=this.recentClaim?this.nowMillis-this.recentClaim.atMillis:Number.POSITIVE_INFINITY;return{currentGame:lt.id,label:lt.label,phase:this.phase,playerCount:this.config.playerCount,players:this.players.map((f,y)=>({...f,score:this.claims[y]??0})),score:Math.max(0,...this.claims),lives:-1,elapsedMillis:this.phase==="waiting"||this.phase==="starting"?0:Math.max(0,u-this.startedAtMillis),remainingMillis:this.phase==="finished"?Math.max(0,this.finishAtMillis+Wr-this.nowMillis):0,activeTargets:s-n,success:this.winnerIndex>=0,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?t.countdownMillis:0,readyPlayers:t.readyPlayers,requiredPlayers:t.requiredPlayers,matchTarget:Math.max(0,...this.targets),claimedTargets:n,fillPercent:this.fillPercent,leaderIndex:i?.index??-1,leaderLabel:i?.label??"-",motionEventId:this.motionEventId,playerProgress:a,readyPlayerIndices:this.players.filter((f,y)=>this.readyGate.zoneReady(y,this.nowMillis)).map(f=>f.index),recentClaim:this.recentClaim&&c<m0?{playerIndex:this.recentClaim.playerIndex,remainingMillis:m0-c,x:this.recentClaim.x,y:this.recentClaim.y}:null,remainingTargets:s-n,totalTargets:s,winnerIndex:this.winnerIndex,winnerLabel:r?.label??""}}reset(t={}){this.config=Ee({...this.config,...t},lt),this.readyZones=Ir(this.config.playerCount),this.readyGate=je(lt.start,this.readyZones,this.config.nowMillis),this.resetGame(this.config.nowMillis),this.lastEvent=E("ready",this.waitingMessage(),this.config.nowMillis)}playerReadyZones(){return this.readyZones.map(t=>({...t}))}targetOwner(t,a){return Nt(t,a)?this.owners[a*S+t]??-1:-1}resetGame(t){this.nowMillis=t,this.startedAtMillis=t,this.finishAtMillis=0,this.phase="waiting",this.winnerIndex=-1,this.motionEventId=1,this.recentClaim=null,this.claimed.fill(0),this.claimedAt.fill(0),this.readyGate.reset(t),this.players=this.createPlayers(),this.fillPercent=this.readFillPercent(),this.rng=et(this.config.seed);let a=oM(this.config.playerCount,this.fillPercent,this.rng);this.owners=a.owners,this.targets=a.targets,this.claims=Array.from({length:this.config.playerCount},()=>0),this.lastEvent=E("ready",this.waitingMessage(),t)}createPlayers(){return Array.from({length:this.config.playerCount},(t,a)=>{let l=this.config.players[a],i=ua[a]??ua[0],n=l?.color,s=n&&/^#[0-9a-f]{6}$/i.test(n)?n:i,r=String(l?.label||l?.name||`Jugador ${a+1}`).trim();return{index:a,label:r||`Jugador ${a+1}`,color:s,score:0,lives:-1}})}readFillPercent(){let t=Ht(this.config.options,_i.baseFillPercent);if(this.config.difficulty!=="hard")return Math.round(t);let a=Ht(this.config.options,_i.hardFillMultiplier);return Math.round(W(t*a,1,100))}applyReadyTransition(t,a){return t==="players-ready"?(this.phase="starting",this.motionEventId+=1,[E("start","Todos en posici\xF3n",a)]):t==="players-left"?(this.phase="waiting",this.motionEventId+=1,[E("ready","Vuelve a tu zona iluminada",a)]):t==="started"?(this.phase="running",this.startedAtMillis=a,this.motionEventId+=1,[E("start","Reclama todas las baldosas de tu color",a)]):[]}claimTile(t,a,l){let i=a*S+t,n=this.owners[i]??-1;if(n<0||n>=this.players.length||this.claimed[i]===1)return;this.claimed[i]=1,this.claimedAt[i]=l,this.claims[n]=(this.claims[n]??0)+1,this.recentClaim={atMillis:l,playerIndex:n,x:t,y:a},this.motionEventId+=1;let s=Math.max(0,(this.targets[n]??0)-(this.claims[n]??0)),r=this.players[n]?.label??`Jugador ${n+1}`;return s===0?(this.phase="finished",this.finishAtMillis=l,this.winnerIndex=n,E("win",`${r} gana el duelo`,l)):E("coin",`${r}: ${s} por reclamar`,l)}recordEvents(t){let a=t.at(-1);return a&&(this.lastEvent=a),t}waitingMessage(){return`Duelo espera a ${this.config.playerCount} jugadores`}playerProgress(){return this.players.map((t,a)=>{let l=this.targets[a]??0,i=this.claims[a]??0;return{claimed:i,color:t.color,index:a,label:t.label,progress:l>0?i/l:0,remaining:Math.max(0,l-i),target:l}})}drawWaiting(t){let a=.5+.5*Math.sin(this.nowMillis/310);this.readyZones.forEach((l,i)=>{let n=this.readyGate.zoneReady(i,this.nowMillis);this.drawReadyZone(t,l,this.players[i]?.color??ua[0],n,a)}),Fa(t,{color:"#13263a",radius:2+Math.floor(this.nowMillis/180)%20,thickness:.35})}drawStarting(t){let a=Math.floor(this.nowMillis/110);St(t,{bandWidth:2,period:8,step:a,color:({distance:l})=>{let i=this.players[Math.floor(l)%this.players.length];return kr(i?.color??ua[0],58)}}),this.readyZones.forEach((l,i)=>{this.drawReadyZone(t,l,this.players[i]?.color??ua[0],!0,1)})}drawReadyZone(t,a,l,i,n){for(let s=a.minY;s<=a.maxY;s+=1)for(let r=a.minX;r<=a.maxX;r+=1){let u=r===a.minX||r===a.maxX||s===a.minY||s===a.maxY,c=i?u?100:78:u?26+n*24:12+n*12;z(t,r,s,kr(l,c))}}drawBoard(t){let a=this.playerProgress();for(let l=0;l<xt;l+=1){let i=this.owners[l]??-1;if(i<0)continue;let n=l%S,s=Math.floor(l/S),r=this.players[i]?.color??ua[0];if(this.claimed[l]===1){let f=this.nowMillis-(this.claimedAt[l]??0);if(f<d0){let y=1-f/d0;z(t,n,s,mM(r,35+y*65))}else z(t,n,s,kr(r,12));continue}let u=(a[i]?.progress??0)>=.88?16:0,c=.5+.5*Math.sin(this.nowMillis/360+n*.74+s*.18+i);z(t,n,s,kr(r,58+u+c*24))}}drawVictory(t){let a=this.players[this.winnerIndex]?.color??ua[0],l=hf(a),i=Math.max(0,this.nowMillis-this.finishAtMillis);for(let n=0;n<G;n+=1)for(let s=0;s<S;s+=1){let r=.5+.5*Math.sin(i/170+s*.58+n*.19),u=Fn(Ut(l,48+r*42),Ut(mf,r*16));z(t,s,n,xl(u))}St(t,{bandWidth:2,period:9,step:Math.floor(i/90),color:"#ffffff"})}};function oM(e,t,a){let l=Math.round(xt*t/100),i=Math.max(1,Math.floor(l/e)),n=Array.from({length:e},()=>i),s=new Int16Array(xt).fill(-1),r=Number.POSITIVE_INFINITY;for(let u=0;u<rM;u+=1){let c=cM(n,a),f=fM(c);f<r&&(r=f,s=c)}return{owners:s,targets:n}}function cM(e,t){let a=new Int16Array(xt).fill(-1),l=Array.from({length:e.length},()=>0),i=Array.from({length:xt},(n,s)=>s);for(let n=i.length-1;n>0;n-=1){let s=t.int(n+1);[i[n],i[s]]=[i[s]??0,i[n]??0]}for(let n of i){let s=n%S,r=Math.floor(n/S),u=-1,c=Number.POSITIVE_INFINITY;for(let f=0;f<e.length;f+=1){let y=e[f]??0;if((l[f]??0)>=y)continue;let m=h0(a,s,r,f),p=dM(a,s,r,f),M=p0(m)+p*.12+(l[f]??0)/Math.max(y,1)*.2+t.next()*1.35;M<c&&(c=M,u=f)}u>=0&&(a[n]=u,l[u]=(l[u]??0)+1)}return a}function fM(e){let t=0;for(let a=0;a<G;a+=1){let l=-2,i=0;for(let n=0;n<S;n+=1){let s=e[a*S+n]??-1;if(s>=0){let r=h0(e,n,a,s);t+=p0(r)+(r>=3?6:0)}s===l&&s>=0?i+=1:(l=s,i=1),l>=0&&i>5&&(t+=(i-5)*7)}}for(let a=0;a<S;a+=1){let l=-2,i=0;for(let n=0;n<G;n+=1){let s=e[n*S+a]??-1;s===l&&s>=0?i+=1:(l=s,i=1),l>=0&&i>5&&(t+=(i-5)*7)}}return t}function h0(e,t,a,l){return[[t-1,a],[t+1,a],[t,a-1],[t,a+1]].filter(([i=-1,n=-1])=>Nt(i,n)&&e[n*S+i]===l).length}function dM(e,t,a,l){return[[t-1,a-1],[t+1,a-1],[t-1,a+1],[t+1,a+1]].filter(([i=-1,n=-1])=>Nt(i,n)&&e[n*S+i]===l).length}function p0(e){return e===0?.85:e===1?0:e===2?.45:4.5}function hf(e){return/^#[0-9a-f]{6}$/i.test(e)?{r:Number.parseInt(e.slice(1,3),16),g:Number.parseInt(e.slice(3,5),16),b:Number.parseInt(e.slice(5,7),16)}:mf}function kr(e,t){return xl(Ut(hf(e),t))}function mM(e,t){let a=W(t,0,100);return xl(Fn(Ut(hf(e),100-a),Ut(mf,a)))}var $r=[{name:"Rojo",color:"#ff3048"},{name:"Cian",color:"#24d9ff"}],pf=ka({playerCount:2,players:$r,seed:137,difficulty:"medium"});pf.init(0);var y0=pf.render(),g0=pf.snapshot(),kn=ka({playerCount:2,players:$r,seed:137,difficulty:"hard"});kn.init(0);C0(kn,100);kn.tick({atMillis:1100});var v0=kn.render(),b0=kn.snapshot(),Tl=ka({playerCount:2,players:$r,seed:137,difficulty:"hard"});Tl.init(0);yf(Tl);eu(Tl,0,8,3200);eu(Tl,1,5,3400);Tl.tick({atMillis:18700});var M0=Tl.render(),S0=Tl.snapshot(),hM=[{name:"Alejandra del Equipo Rel\xE1mpago",color:"#ff3048"},{name:"Bruno",color:"#24d9ff"},{name:"Carolina",color:"#42e879"},{name:"Diego",color:"#ff4fd8"},{name:"Elena",color:"#376bff"},{name:"Fernando",color:"#ffd84d"},{name:"Gabriela",color:"#a66cff"},{name:"Hugo",color:"#ff8a3d"}],Oi=ka({playerCount:8,players:hM,seed:2026,difficulty:"medium"});Oi.init(0);yf(Oi);for(let e=0;e<8;e+=1)eu(Oi,e,e+1,3200+e*50);Oi.tick({atMillis:48230});var x0=Oi.render(),E0=Oi.snapshot(),wi=ka({playerCount:2,players:$r,seed:137,difficulty:"medium",options:{base_fill_percent:30}});wi.init(0);yf(wi);eu(wi,1,Number.POSITIVE_INFINITY,3200);wi.tick({atMillis:4200});var T0=wi.render(),G0=wi.snapshot();function C0(e,t){e.playerReadyZones().forEach(a=>{e.press({x:a.minX,y:a.minY,pressed:!0,atMillis:t})})}function yf(e){C0(e,100),e.tick({atMillis:3100})}function eu(e,t,a,l){let i=0;for(let n=0;n<32&&i<a;n+=1)for(let s=0;s<16&&i<a;s+=1)e.targetOwner(s,n)===t&&(e.press({x:s,y:n,pressed:!0,atMillis:l+i}),i+=1)}var Tf={};wl(Tf,{PlayerDisplay:()=>A0,createGame:()=>Hi,damagedFrame:()=>L0,damagedSnapshot:()=>Y0,hazardColor:()=>tu,helloWorldCelebrationMillis:()=>$n,helloWorldHazards:()=>es,helloWorldStartingLives:()=>In,helloWorldTargetScore:()=>Ni,helloWorldTargets:()=>au,idleColor:()=>Sf,initEvents:()=>R0,losingFrame:()=>j0,losingSnapshot:()=>Z0,manifest:()=>Yt,runningFrame:()=>H0,runningSnapshot:()=>U0,startingFrame:()=>O0,startingSnapshot:()=>w0,targetColor:()=>Wn,trailColor:()=>Mf,waitingFrame:()=>_0,waitingSnapshot:()=>D0,winningFrame:()=>q0,winningSnapshot:()=>X0});var _e=ne(ve(),1);function A0({snapshot:e,frame:t}){let a=e.matchTarget??5,l=e.phase==="finished",i=l?e.success?"is-result-win":"is-result-lose":"",n=e.success?"green":e.lastEventCue==="fail"?"red":"cyan",s=Math.max(1,Math.ceil(e.celebrationMillis/1e3)),r=l?(0,_e.jsxs)("span",{className:"hello-world-result-copy",children:[(0,_e.jsx)("span",{children:e.success?"\xA1Ganaste!":e.lastEventMessage}),(0,_e.jsxs)("small",{children:["Reinicio en ",s]})]}):e.lastEventMessage||"Verde suma, rojo resta una vida";return(0,_e.jsx)(yt,{title:e.label,phase:e.phase,children:(0,_e.jsxs)("div",{className:`ml-solo-display hello-world-display ${i}`.trim(),children:[(0,_e.jsx)(Pa,{snapshot:e}),(0,_e.jsxs)("div",{className:"ml-solo-summary",children:[(0,_e.jsxs)(wt,{columns:3,className:"ml-solo-number-row",children:[(0,_e.jsx)(ae,{label:"Meta",tone:"green",value:`${e.score}/${a}`}),(0,_e.jsx)(ae,{label:"Vidas",tone:"red",value:(0,_e.jsx)(Ai,{lives:e.lives,maxLives:e.maxLives})}),(0,_e.jsx)(ae,{label:"Tiempo",tone:"yellow",value:tt(e.remainingMillis)})]}),(0,_e.jsx)(ae,{className:"ml-solo-message",label:l?e.success?"Victoria":"Fin de la partida":"Estado",tone:n,value:r})]}),t?(0,_e.jsx)(Sl,{className:"ml-solo-floor",frame:t,label:"Recorrido en el suelo"}):null]})})}var Yt={id:"hello-world",label:"Hola Mundo",description:"Sigue los objetivos verdes y evita las baldosas rojas.",availability:{development:!0,production:!1},catalog:{category:"individual",color:"#35d7ff",durationLabel:"30s",modeLabel:"Demostraci\xF3n",audioLabel:"Efectos",rules:["Sigue los objetivos verdes","Evita las baldosas rojas"]},players:{allowAny:!0,min:1,max:1},start:{mode:"player-ready"},defaultDurationMillis:3e4,display:{entry:"./display"},preview:{seed:2024,playerCount:1,actions:[{atMillis:100,type:"press",x:8,y:16},{atMillis:2150,type:"release",x:8,y:16},{atMillis:2300,type:"press",x:4,y:4},{atMillis:2320,type:"release",x:4,y:4}],captureStartMillis:2200,frameCount:18,frameIntervalMillis:120},tags:["example","ci","typescript"]};var Wn="#7ee787",tu="#ff2036",Mf="#1f6feb",Sf="#05070a",Ni=5,In=3,$n=5e3,vf=[{x:3,y:5},{x:12,y:5},{x:8,y:16},{x:3,y:26},{x:12,y:26}],z0=[{x:12,y:15},{x:4,y:15},{x:8,y:28}];function Hi(e){return new bf(e)}var bf=class{config;finishedAtMillis;hazardsHit=0;lastEvent=E("none","Listo",0);lives=In;nowMillis=0;phase="ready";players;readyGate;score=0;startedAtMillis=0;constructor(t){this.config=Ee(t,Yt),this.readyGate=je(Yt.start,Kr(1),this.config.nowMillis),this.players=this.scoredPlayers()}init(t){return this.resetState(t),[this.lastEvent]}press(t){if(this.nowMillis=t.atMillis,this.phase==="waiting"||this.phase==="starting")return this.applyReadyTransition(this.readyGate.update(t),t.atMillis);if(this.phase!=="running"||!t.pressed)return[];let a=this.currentHazard();if(a&&t.x===a.x&&t.y===a.y)return this.loseLife(t.atMillis);let l=this.currentTarget();return!l||t.x!==l.x||t.y!==l.y?[]:(this.score+=1,this.players=this.scoredPlayers(),this.score>=Ni?this.finishGame(!0,"\xA1Hola Mundo!",t.atMillis):(this.lastEvent=E("hit",`Hola ${this.score}`,t.atMillis),[this.lastEvent]))}release(t){return this.nowMillis=t.atMillis,this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update({...t,pressed:!1}),t.atMillis):[]}tick(t){if(this.nowMillis=t.atMillis,this.phase==="waiting"||this.phase==="starting")return this.applyReadyTransition(this.readyGate.tick(t.atMillis),t.atMillis);if(this.phase==="finished"){let a=this.finishedAtMillis??t.atMillis;return t.atMillis-a<$n?[]:(this.resetState(t.atMillis),[this.lastEvent])}return this.phase!=="running"||this.remainingMillis()>0?[]:this.finishGame(!1,"Tiempo agotado",t.atMillis)}render(){let t=Xe(Sf);if(this.phase==="waiting"||this.phase==="starting")return this.drawPlayerStart(t),t;for(let i of vf.slice(0,this.score))z(t,i.x,i.y,Mf);if(this.phase==="finished")return this.drawResultAnimation(t),t;let a=this.currentTarget();a&&(U(t,a.x-1,a.y-1,3,3,Wn),z(t,a.x,a.y,"#ffffff"));let l=this.currentHazard();return l&&z(t,l.x,l.y,tu),t}snapshot(){let t=this.readyGate.state(this.nowMillis);return{currentGame:Yt.id,label:Yt.label,phase:this.phase,playerCount:this.config.playerCount,players:this.players,score:this.score,lives:this.lives,maxLives:In,elapsedMillis:this.elapsedMillis(),remainingMillis:this.remainingMillis(),activeTargets:this.phase==="running"?+!!this.currentTarget()+ +!!this.currentHazard():0,success:this.phase==="finished"&&this.score>=Ni,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?t.countdownMillis:0,readyPlayers:t.readyPlayers,requiredPlayers:t.requiredPlayers,matchTarget:Ni,celebrationDurationMillis:$n,celebrationMillis:this.celebrationMillis(),hazard:this.phase==="running"?this.currentHazard():void 0}}reset(t={}){this.config=Ee({...this.config,...t},Yt),this.resetState(this.config.nowMillis)}applyReadyTransition(t,a){return t==="players-ready"?(this.phase="starting",this.lastEvent=E("ready","Jugador listo",a),[this.lastEvent]):t==="players-left"?(this.phase="waiting",this.lastEvent=E("ready","Vuelve a la zona iluminada",a),[this.lastEvent]):t==="started"?(this.phase="running",this.startedAtMillis=a,this.lastEvent=E("start","Verde suma, rojo resta una vida",a),[this.lastEvent]):[]}celebrationMillis(){return this.phase!=="finished"||this.finishedAtMillis===void 0?0:Math.max(0,$n-(this.nowMillis-this.finishedAtMillis))}currentHazard(){return z0[this.hazardsHit]}currentTarget(){return vf[this.score]}drawPlayerStart(t){let a=Math.floor(S/2),l=Math.floor(G/2),i=Math.floor(this.nowMillis/(this.phase==="starting"?110:180)),n=this.phase==="starting"?"#ffe176":Wn,s=this.phase==="starting"?2+i%10:3+i%4;Fa(t,{centerX:a,centerY:l,color:n,radius:s})}drawResultAnimation(t){let a=Math.floor((this.nowMillis-(this.finishedAtMillis??this.nowMillis))/140);if(this.score>=Ni){St(t,{color:({x:i,y:n})=>(i+n+a)%3===0?"#ffffff":Wn,step:a});return}for(let i=0;i<G;i+=1)for(let n=0;n<S;n+=1)((n+i+a)%8<=1||(n-i-a+64)%11===0)&&z(t,n,i,(n+a)%4===0?"#ff8090":tu)}elapsedMillis(){if(this.phase==="waiting"||this.phase==="starting")return 0;let t=this.phase==="finished"&&this.finishedAtMillis!==void 0?this.finishedAtMillis:this.nowMillis;return Math.max(0,t-this.startedAtMillis)}finishGame(t,a,l){return this.phase="finished",this.finishedAtMillis=l,this.lastEvent=E(t?"win":"fail",a,l),[this.lastEvent]}loseLife(t){return this.lives-=1,this.hazardsHit+=1,this.lives<=0?this.finishGame(!1,"Sin vidas",t):(this.lastEvent=E("fail",`Vida perdida, quedan ${this.lives}`,t),[this.lastEvent])}remainingMillis(){return Math.max(0,this.config.durationMillis-this.elapsedMillis())}resetState(t){this.readyGate.reset(t),this.finishedAtMillis=void 0,this.hazardsHit=0,this.lastEvent=E("ready","Esperando jugador",t),this.lives=In,this.nowMillis=t,this.phase="waiting",this.score=0,this.startedAtMillis=t,this.players=this.scoredPlayers()}scoredPlayers(){return zi(this.config.playerCount,this.config.players).map(t=>({...t,score:this.score}))}};function es(){return z0.map(e=>({...e}))}function au(){return vf.map(e=>({...e}))}var xf=Hi({seed:2024,playerCount:1,durationMillis:3e4}),R0=xf.init(0),_0=xf.render(),D0=xf.snapshot(),ts=Hi({seed:2024,playerCount:1,durationMillis:3e4});ts.init(0);ts.press({x:8,y:16,pressed:!0,atMillis:100});ts.tick({atMillis:1100});var O0=ts.render(),w0=ts.snapshot(),N0=nu(),H0=N0.render(),U0=N0.snapshot(),Ef=nu(),B0=es()[0];if(!B0)throw new Error("Hola Mundo requires at least one hazard fixture.");Ef.press({...B0,pressed:!0,atMillis:2200});var L0=Ef.render(),Y0=Ef.snapshot(),lu=nu();au().forEach((e,t)=>{lu.press({...e,pressed:!0,atMillis:2200+t*100})});lu.tick({atMillis:4100});var q0=lu.render(),X0=lu.snapshot(),iu=nu();es().forEach((e,t)=>{iu.press({...e,pressed:!0,atMillis:2200+t*100})});iu.tick({atMillis:4100});var j0=iu.render(),Z0=iu.snapshot();function nu(){let e=Hi({seed:2024,playerCount:1,durationMillis:3e4});return e.init(0),e.press({x:8,y:16,pressed:!0,atMillis:100}),e.tick({atMillis:2100}),e}var Nf={};wl(Nf,{PlayerDisplay:()=>V0,createGame:()=>Cl,damagedFrame:()=>I0,damagedSnapshot:()=>$0,failedFrame:()=>ag,failedSnapshot:()=>lg,finishedFrame:()=>eg,finishedSnapshot:()=>tg,gameWinAnimationMillis:()=>su,initEvents:()=>J0,manifest:()=>qt,meteorCoreColor:()=>Df,meteorDifficultyProfile:()=>F0,meteorImpactColor:()=>ru,meteorImpactVisibleMillis:()=>Rf,meteorWarningColor:()=>_f,playerFootprintColor:()=>Of,runningFrame:()=>k0,runningSnapshot:()=>W0,startingLives:()=>as});var it=ne(ve(),1);function V0({snapshot:e,frame:t}){let a=e.phase==="finished"?e.success?"\xA1Tormenta superada!":"La tormenta te alcanz\xF3":e.lastEventMessage||"Esquiva las zonas rojas",l=e.success?"green":e.lives===0?"red":"cyan";return(0,it.jsx)(yt,{title:e.label,phase:e.phase,children:(0,it.jsxs)("div",{className:"ml-solo-display meteor-dodge-display",children:[(0,it.jsx)(Pa,{snapshot:e}),(0,it.jsxs)("div",{className:"ml-solo-summary",children:[(0,it.jsxs)(wt,{columns:3,className:"ml-solo-number-row",children:[(0,it.jsx)(ae,{label:"Esquivados",tone:"cyan",value:e.dodgedMeteors}),(0,it.jsx)(ae,{label:"Vidas",tone:"neutral",value:(0,it.jsx)(Ai,{lives:e.lives,maxLives:e.maxLives})}),(0,it.jsx)(ae,{label:"Tiempo",tone:"yellow",value:tt(e.remainingMillis)})]}),(0,it.jsx)(ae,{className:"ml-solo-message",label:"Estado",tone:l,value:a})]}),t?(0,it.jsx)(Sl,{className:"ml-solo-floor",frame:t,label:"Tormenta en el suelo"}):null]})})}var qt={id:"meteor-dodge",label:"Lluvia de meteoritos",description:"Cooperative survival game: dodge telegraphed meteor impacts until the storm passes.",availability:{development:!0,production:!1},catalog:{category:"team",color:"#b987ff",durationLabel:"45s",modeLabel:"Supervivencia",audioLabel:"Efectos",rules:["Esquiva las zonas marcadas","Sobrevive hasta que termine la tormenta"]},players:{allowAny:!0,min:1,max:1},start:{mode:"player-ready",releaseGraceMillis:750},config:{difficulty:{default:"medium",options:["easy","medium","hard","expert"]}},defaultDurationMillis:45e3,display:{entry:"./display"},preview:{seed:137,playerCount:1,difficulty:"medium",actions:[{atMillis:100,type:"press",x:8,y:16},{atMillis:2150,type:"release",x:8,y:16}],captureStartMillis:2200,frameCount:18,frameIntervalMillis:120},tags:["arcade","cooperative","survival","typescript"]};var as=3,su=3e3,Rf=450,_f="#ff5a36",Df="#ffe176",ru="#ffffff",Of="#35d7ff",Gf="#02050b",pM="#050d19",yM="#145cff",gM="#35d7ff",vM="#ffe176",Cf=["#35d7ff","#5fff9e","#ffe176","#ff3bd7","#ffffff"],Af=["#ff3151","#7b1428","#2a0710"],bM=1e3,MM=350,SM=64,Gl={minX:4,maxX:11,minY:12,maxY:19},wf={intervalMillis:1550,largeMeteorEvery:5,radius:1,warningMillis:1350},P0={easy:{intervalMillis:1900,largeMeteorEvery:0,radius:1,warningMillis:1650},medium:wf,hard:{intervalMillis:1200,largeMeteorEvery:3,radius:1,warningMillis:1050},expert:{intervalMillis:900,largeMeteorEvery:1,radius:2,warningMillis:800}};function Cl(e){return new zf(e)}var zf=class{config;dodgedMeteors=0;finishedAtMillis=0;lastDamageMillis=Number.NEGATIVE_INFINITY;lastEvent=E("none","Listos para la tormenta",0);lives=as;meteors=[];nextMeteorId=1;nextMeteorMillis=0;nowMillis=0;occupiedTiles=new Set;phase="ready";players=[];readyGate;rng;startedAtMillis=0;success=!1;constructor(t){this.config=Ee(t,qt),this.rng=et(this.config.seed),this.readyGate=je(qt.start,[Gl],this.config.nowMillis),this.resetState(this.config.nowMillis)}init(t){return this.resetState(t),this.phase="waiting",this.lastEvent=E("ready","Entra en la zona azul",t),[this.lastEvent]}press(t){return this.nowMillis=t.atMillis,this.updateOccupiedTile(t.x,t.y,t.pressed),this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update(t),t.atMillis):[]}release(t){return this.nowMillis=t.atMillis,this.updateOccupiedTile(t.x,t.y,!1),this.phase==="waiting"||this.phase==="starting"?this.applyReadyTransition(this.readyGate.update({...t,pressed:!1}),t.atMillis):[]}tick(t){if(this.nowMillis=t.atMillis,this.phase==="waiting"||this.phase==="starting")return this.applyReadyTransition(this.readyGate.tick(t.atMillis),t.atMillis);if(this.phase!=="running")return[];let a=[];this.spawnDueMeteors(t.atMillis);for(let l of this.meteors){if(l.result!=="pending"||t.atMillis<l.impactAtMillis)continue;if(!this.meteorContainsOccupiedTile(l)){l.result="dodged",this.dodgedMeteors+=1;continue}if(l.impactAtMillis-this.lastDamageMillis<bM){l.result="protected";continue}if(l.result="hit",this.lastDamageMillis=l.impactAtMillis,this.lives=Math.max(0,this.lives-1),this.lives===0){a.push(this.finish(!1,l.impactAtMillis));break}a.push(E("miss","\xA1Impacto! Mu\xE9vete",l.impactAtMillis))}return this.meteors=this.meteors.filter(l=>l.clearAtMillis>t.atMillis),this.phase==="running"&&this.remainingMillis()===0&&a.push(this.finish(!0,t.atMillis)),this.recordEvents(a)}render(){let t=Xe(Gf);if(this.drawBackground(t),this.phase==="waiting"||this.phase==="starting")return this.drawPlayerStart(t),t;if(this.phase==="finished")return this.success?this.drawWinAnimation(t):this.drawFailAnimation(t),t;for(let a of this.occupiedTiles){let[l,i]=Q0(a);z(t,l,i,Of)}for(let a of this.meteors)this.drawMeteor(t,a);return t}snapshot(){let t=this.readyGate.state(this.nowMillis),a=this.success&&this.phase==="finished"?Math.max(0,Math.min(su,this.nowMillis-this.finishedAtMillis)):0;return{currentGame:qt.id,label:qt.label,phase:this.phase,playerCount:this.config.playerCount,players:this.players.map(l=>({...l,lives:this.lives,score:this.dodgedMeteors})),score:this.dodgedMeteors,lives:this.lives,maxLives:as,elapsedMillis:this.elapsedMillis(),remainingMillis:this.remainingMillis(),activeTargets:this.meteors.filter(l=>l.result==="pending").length,success:this.success,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?t.countdownMillis:0,readyPlayers:t.readyPlayers,requiredPlayers:t.requiredPlayers,celebrating:this.success&&this.phase==="finished"&&a<su,celebrationMillis:a,dodgedMeteors:this.dodgedMeteors,meteors:this.meteors.map(l=>({...l})),stormDurationMillis:this.config.durationMillis}}reset(t={}){this.config=Ee({...this.config,...t},qt),this.rng=et(this.config.seed),this.resetState(this.config.nowMillis),this.phase="waiting"}applyReadyTransition(t,a){return t==="players-ready"?(this.phase="starting",this.lastEvent=E("ready","Zona lista",a),[this.lastEvent]):t==="players-left"?(this.phase="waiting",this.lastEvent=E("ready","Vuelve a la zona azul",a),[this.lastEvent]):t==="started"?(this.phase="running",this.startedAtMillis=a,this.nextMeteorMillis=a+MM,this.lastEvent=E("start","Esquiva las zonas rojas",a),[this.lastEvent]):[]}difficultyProfile(){return P0[this.config.difficulty]??wf}drawBackground(t){for(let a=3;a<G;a+=4)U(t,0,a,S,1,pM)}drawFailAnimation(t){let a=Math.floor((this.nowMillis-this.finishedAtMillis)/180)%Af.length,l=Af[a]??Af[0];for(let i=0;i<G;i+=1){let n=Math.floor(i*S/G);U(t,n-1,i,3,1,l),U(t,S-n-2,i,3,1,l)}}drawMeteor(t,a){if(a.result==="pending"){let r=Math.floor((this.nowMillis-a.spawnedAtMillis)/160)%2===0,u=a.radius*2+1,c=r?_f:"#6c1b19";U(t,a.x-a.radius,a.y-a.radius,u,u,c),a.radius>0&&U(t,a.x-a.radius+1,a.y-a.radius+1,u-2,u-2,Gf),z(t,a.x,a.y,Df);return}let l=Math.max(0,this.nowMillis-a.impactAtMillis),i=Math.min(2,Math.floor(l/130)),n=a.radius+i,s=l<140?ru:a.result==="hit"?"#ff3151":"#ff8a2a";U(t,a.x-n,a.y-n,n*2+1,n*2+1,s),z(t,a.x,a.y,ru)}drawPlayerStart(t){let a=Math.floor(this.nowMillis/(this.phase==="starting"?100:190)),l=this.phase==="starting"?vM:a%2===0?gM:yM,i=this.phase==="starting"?a%3:a%2,n=Gl.minX+i,s=Gl.minY+i,r=Gl.maxX-Gl.minX+1-i*2,u=Gl.maxY-Gl.minY+1-i*2;U(t,n,s,r,u,l),r>2&&u>2&&U(t,n+1,s+1,r-2,u-2,Gf),z(t,7,15,"#ffffff"),z(t,8,16,"#ffffff")}drawWinAnimation(t){let a=Math.floor(Math.max(0,this.nowMillis-this.finishedAtMillis)/120);St(t,{color:({distance:l})=>Cf[(l+a)%Cf.length]??Cf[0],step:a})}elapsedMillis(){if(this.phase==="waiting"||this.phase==="starting"||this.phase==="ready")return 0;let t=this.phase==="finished"?this.finishedAtMillis:this.nowMillis;return Math.max(0,t-this.startedAtMillis)}finish(t,a){this.phase="finished",this.success=t,this.finishedAtMillis=a;let l=E(t?"win":"fail",t?"Tormenta superada":"Sin vidas",a);return this.lastEvent=l,l}meteorContainsOccupiedTile(t){for(let a of this.occupiedTiles){let[l,i]=Q0(a);if(Math.abs(l-t.x)<=t.radius&&Math.abs(i-t.y)<=t.radius)return!0}return!1}recordEvents(t){let a=t.at(-1);return a&&(this.lastEvent=a),t}remainingMillis(){return Math.max(0,this.config.durationMillis-this.elapsedMillis())}resetState(t){this.readyGate.reset(t),this.rng=et(this.config.seed),this.dodgedMeteors=0,this.finishedAtMillis=0,this.lastDamageMillis=Number.NEGATIVE_INFINITY,this.lives=as,this.meteors=[],this.nextMeteorId=1,this.nextMeteorMillis=0,this.nowMillis=t,this.occupiedTiles.clear(),this.players=zi(this.config.playerCount,this.config.players),this.startedAtMillis=t,this.success=!1}spawnDueMeteors(t){let a=this.difficultyProfile(),l=0;for(;this.nextMeteorMillis>0&&this.nextMeteorMillis<=t&&l<SM;){let i=this.nextMeteorId,s=a.largeMeteorEvery>0&&i%a.largeMeteorEvery===0?Math.min(2,a.radius+1):a.radius,r=this.nextMeteorMillis+a.warningMillis;this.meteors.push({clearAtMillis:r+Rf,id:i,impactAtMillis:r,radius:s,result:"pending",spawnedAtMillis:this.nextMeteorMillis,x:this.rng.range(s,S-s-1),y:this.rng.range(s,G-s-1)}),this.nextMeteorId+=1,this.nextMeteorMillis+=a.intervalMillis,l+=1}}updateOccupiedTile(t,a,l){if(t<0||t>=S||a<0||a>=G)return;let i=`${t},${a}`;l?this.occupiedTiles.add(i):this.occupiedTiles.delete(i)}};function F0(e){return{...P0[e]??wf}}function Q0(e){let[t="0",a="0"]=e.split(",");return[Number(t),Number(a)]}var Ui=Cl({playerCount:1,difficulty:"medium",seed:137}),J0=Ui.init(0);uu(Ui);Ui.release({x:8,y:16,pressed:!1,atMillis:2150});Ui.tick({atMillis:4e3});var k0=Ui.render(),W0=Ui.snapshot(),ls=Cl({playerCount:1,difficulty:"easy",seed:137});ls.init(0);uu(ls);ig(ls,2450);var I0=ls.render(),$0=ls.snapshot(),Al=Cl({playerCount:1,difficulty:"medium",durationMillis:4e3,seed:137});Al.init(0);uu(Al);Al.release({x:8,y:16,pressed:!1,atMillis:2150});Al.tick({atMillis:6100});Al.tick({atMillis:7e3});var eg=Al.render(),tg=Al.snapshot(),is=Cl({playerCount:1,difficulty:"easy",seed:137});is.init(0);uu(is);var K0=2450;for(let e=0;e<3;e+=1)K0=ig(is,K0)+1050;var ag=is.render(),lg=is.snapshot();function uu(e){e.press({x:8,y:16,pressed:!0,atMillis:100}),e.tick({atMillis:2100})}function ig(e,t){e.release({x:8,y:16,pressed:!1,atMillis:t}),e.tick({atMillis:t});let a=e.snapshot().meteors.find(l=>l.result==="pending");return a?(e.press({x:a.x,y:a.y,pressed:!0,atMillis:a.impactAtMillis-1}),e.tick({atMillis:a.impactAtMillis}),e.release({x:a.x,y:a.y,pressed:!1,atMillis:a.impactAtMillis+1}),a.impactAtMillis+1):t}var qf={};wl(qf,{PlayerDisplay:()=>ng,ballColor:()=>zl,blueColor:()=>pa,createGame:()=>ug,finishedSnapshot:()=>cg,manifest:()=>Ze,pingPongConfigVars:()=>Wa,redColor:()=>ha,runningFrame:()=>og,runningSnapshot:()=>Yf,waitingSnapshot:()=>Lf});var pe=ne(ve(),1);function Hf(e){return{"--ping-pong-ball-x":`${3.5+e.y/31*93}%`,"--ping-pong-ball-y":`${18+e.x/15*64}%`}}function ng({snapshot:e}){let[t,a]=e.players,l=t??{label:"Rojo",score:0,color:"#ff1c28"},i=a??{label:"Azul",score:0,color:"#145cff"},n=Math.max(e.matchTarget,1),s=n*2-1,r=e.phase==="starting"?"Empieza en":"Objetivo",u=e.phase==="starting"?tt(e.countdownMillis):n,c=e.phase==="starting"?"preparados":"puntos para ganar",f=e.phase==="finished"?"\xDAltimo peloteo":"Peloteo",y=e.phase==="finished"&&e.lastRoundHits>0?e.lastRoundHits:e.roundHits,m=e.lastRoundWinner||"-",p=m===l.label?"red":m===i.label?"blue":"neutral",M=e.phase==="waiting"||e.phase==="starting",x=Math.min(s,e.rounds.length+(e.phase==="running"||e.phase==="starting"?1:0)),N=M?"Listos":"Ronda",d=M?`${e.activeTargets}/2`:`${x}/${s}`,o=e.phase==="running",h=e.phase==="finished"?null:Math.min(s,e.rounds.length+1),g=e.pointScorer===0?"red":e.pointScorer===1?"blue":"none",A=e.winnerIndex===0?"red":e.winnerIndex===1?"blue":"none",H=["ping-pong-display","ml-versus-display",`is-phase-${e.phase}`,e.pointFlashMillis>0?`is-scoring-${g}`:"",e.phase==="finished"?`is-winner-${A}`:""].filter(Boolean).join(" "),T=e.pointScorer===0?l.label:i.label,D=e.winnerIndex===0?l.label:i.label,b=e.phase==="waiting"?`${e.activeTargets}/2 en posici\xF3n`:e.phase==="starting"?"Preparados":e.phase==="finished"?`Victoria ${D}`:e.pointFlashMillis>0?`Punto ${T}`:e.roundHits>0?`${e.roundHits} ${e.roundHits===1?"golpe":"golpes"}`:"Saque",_=e.impact?Hf(e.impact):void 0;return(0,pe.jsx)(yt,{title:e.label,phase:e.phase,variant:"versus",children:(0,pe.jsxs)("div",{className:H,style:{"--ping-pong-rally-pace":e.rallyPace},children:[(0,pe.jsx)(Pr,{className:"ping-pong-scoreboard",left:l,right:i,target:n,centerLabel:r,centerValue:u,centerCaption:c}),(0,pe.jsxs)("section",{"aria-label":`Trayectoria de la pelota: ${b}`,className:"ping-pong-rally-lane",children:[(0,pe.jsx)("span",{className:"ping-pong-rally-team is-red",children:"Rojo"}),(0,pe.jsx)("span",{className:"ping-pong-rally-team is-blue",children:"Azul"}),(0,pe.jsx)("span",{className:"ping-pong-rally-net","aria-hidden":"true"}),(0,pe.jsx)("span",{className:"ping-pong-rally-scan","aria-hidden":"true"}),e.ballTrail.map((be,Ol)=>(0,pe.jsx)("i",{"aria-hidden":"true",className:"ping-pong-ball-trail",style:{...Hf(be),"--ping-pong-trail-index":Ol}},`${Ol}-${be.x}-${be.y}`)),(0,pe.jsx)("i",{"aria-hidden":"true",className:"ping-pong-ball",style:Hf(e.ball)}),e.impact?(0,pe.jsx)("i",{"aria-hidden":"true",className:`ping-pong-impact is-${e.impact.team===0?"red":"blue"}`,style:_},e.motionEventId):null,(0,pe.jsx)("strong",{className:"ping-pong-rally-caption",children:b},`caption-${e.motionEventId}`)]}),(0,pe.jsxs)(wt,{columns:4,className:"ping-pong-metrics",children:[(0,pe.jsx)(ae,{className:"ping-pong-rally-metric",label:f,tone:"cyan",value:y}),(0,pe.jsx)(ae,{className:"ping-pong-progress-metric",label:N,tone:M?"green":"yellow",value:d}),(0,pe.jsx)(ae,{className:"ping-pong-last-metric",label:"\xDAltimo",tone:p,value:m}),(0,pe.jsx)(ae,{className:"ping-pong-time-metric",label:"Tiempo",tone:"amber",value:tt(e.elapsedMillis)})]}),(0,pe.jsx)(Fr,{className:"ping-pong-rounds",activeCaption:o?"Punto en curso":"Por comenzar",activeLabel:o?"En juego":"Siguiente",activeRound:h,rounds:e.rounds,totalRounds:s})]})})}var Wa={pointsToWin:{key:"points_to_win",label:"Points to win",playerFacing:!0,description:"The first team to reach this score wins. A match can last up to twice this value minus one rounds.",type:"int",default:5,min:1,max:21,step:1},initialBallSpeed:{key:"initial_ball_speed",label:"Initial ball speed (tiles/s)",playerFacing:!1,description:"The ball's starting speed in floor tiles per second on Easy. Medium, Hard, and Expert apply the difficulty multiplier curve to this value.",type:"float",default:5.75,min:3,max:10,step:.25},returnSpeedMultiplier:{key:"return_speed_multiplier",label:"Speed multiplier per return",playerFacing:!1,description:"The ball accelerates after every successful paddle return. Difficulty scales the increase above 1x, with a safety cap at 2.5 times the starting speed.",type:"float",default:1.035,min:1,max:1.1,step:.005},difficultyMultiplier:{key:"difficulty_multiplier",label:"Difficulty multiplier step",playerFacing:!1,description:"Easy uses 1x, Medium uses one step, Hard uses the step squared, and Expert uses the step cubed. It affects both starting speed and return acceleration.",type:"float",default:1.2,min:1,max:1.35,step:.05}},Ze={id:"ping-pong",label:"Ping Pong",description:"Two-player arcade ping pong for red and blue halves of the Motion Levels floor.",availability:{development:!0,production:!0},catalog:{category:"versus",color:"#145cff",durationLabel:"A 5 puntos",modeLabel:"Rojo contra azul",audioLabel:"M\xFAsica + efectos",rules:["Un equipo ocupa la mitad roja y otro la azul","Devuelve la pelota pisando la zona iluminada"]},players:{allowAny:!0,min:2,max:2},start:{mode:"player-ready",releaseGraceMillis:1e3},config:{difficulty:{default:"medium",options:["easy","medium","hard","expert"]},vars:Object.values(Wa)},defaultDurationMillis:0,display:{entry:"./display"},preview:{seed:137,playerCount:2,difficulty:"medium",options:{points_to_win:5},actions:[{atMillis:100,type:"press",x:7,y:3},{atMillis:100,type:"press",x:7,y:28}],captureStartMillis:2200,frameCount:18,frameIntervalMillis:120},tags:["arcade","two-player","typescript"]};var ha="#ff1c28",pa="#145cff",zl="#ffffff",xM="#05070a",oa={r:255,g:28,b:40},ca={r:20,g:92,b:255},Bi={r:255,g:255,b:255},sg=900,Uf=3e3,ou=2,cu=29,fa=5,Ia=Math.floor(S/2),da=Math.floor(G/2),EM=2.5;function ug(e){return new Bf(e)}var Bf=class{config;rng;players;winningScore;speed;startedAtMillis=0;nowMillis=0;readyGate;lastStepMillis=0;pauseUntilMillis=0;finishAtMillis=0;currentIntervalMillis=140;hitCount=0;redPaddleX=0;bluePaddleX=0;ball={x:Ia,y:da,dx:1,dy:1};ballTrail=[];teamScore=[0,0];rounds=[];lastRoundHits=0;lastRoundWinner="";phase="waiting";success=!1;scorer=-1;winner=-1;pointAtMillis=0;lastImpactAtMillis=0;lastImpact=null;motionEventId=0;lastEvent=E("none","Listo",0);constructor(t){this.config=Ee(t,Ze),this.rng=et(this.config.seed),this.readyGate=je(Ze.start,Kr(2),this.config.nowMillis),this.winningScore=this.readWinningScore(),this.players=this.createPlayers(),this.speed=rg(this.config),this.resetGame(this.config.nowMillis)}init(t){return this.startedAtMillis=t,this.nowMillis=t,this.resetGame(t),this.lastEvent=E("ready","Ping Pong espera rojo y azul",t),[this.lastEvent]}press(t){this.nowMillis=t.atMillis;let a=this.readyGate.update(t);return t.pressed&&this.movePaddle(t.x,t.y),this.recordEvents(this.updatePhase(t.atMillis,a))}release(t){this.nowMillis=t.atMillis;let a=this.readyGate.update({...t,pressed:!1});return this.recordEvents(this.updatePhase(t.atMillis,a))}tick(t){this.nowMillis=t.atMillis;let a=this.updatePhase(t.atMillis,this.readyGate.tick(t.atMillis));if(this.phase!=="running"||t.atMillis<this.pauseUntilMillis)return this.recordEvents(a);for(let l=0;l<8&&!(t.atMillis-this.lastStepMillis<this.currentIntervalMillis);l+=1){this.lastStepMillis+=this.currentIntervalMillis;let i=this.moveBall(this.lastStepMillis);if(i&&a.push(i),this.phase!=="running"||this.lastStepMillis<this.pauseUntilMillis)break}return this.recordEvents(a)}render(){let t=Xe(xM);return this.phase==="waiting"?(this.drawWaiting(t),t):this.phase==="starting"?(this.drawReady(t),t):this.phase==="finished"?(this.drawWin(t),t):(this.drawArena(t),this.drawScore(t),this.nowMillis<this.pauseUntilMillis?this.drawScoreFlash(t):(this.drawBallTrail(t),this.drawImpact(t),this.drawPaddles(t),this.drawBallGlow(t),z(t,this.ball.x,this.ball.y,zl)),t)}snapshot(){this.recordEvents(this.updatePhase(this.nowMillis));let t=this.readyGate.state(this.nowMillis),a=this.phase==="starting"?t.countdownMillis:0,l=this.phase==="finished"&&this.nowMillis<this.finishAtMillis+Uf?this.finishAtMillis+Uf-this.nowMillis:0;return{currentGame:Ze.id,label:Ze.label,phase:this.phase,playerCount:this.config.playerCount,players:[{index:0,label:this.labelForTeam(0),color:ha,score:this.teamScore[0],lives:-1},{index:1,label:this.labelForTeam(1),color:pa,score:this.teamScore[1],lives:-1}],score:this.teamScore[0]+this.teamScore[1],lives:-1,elapsedMillis:Math.max(0,this.nowMillis-this.startedAtMillis),remainingMillis:l,activeTargets:this.activeHalves(this.nowMillis),success:this.success,lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:a,readyPlayers:t.readyPlayers,requiredPlayers:t.requiredPlayers,matchTarget:this.winningScore,roundHits:this.hitCount,lastRoundHits:this.lastRoundHits,lastRoundWinner:this.lastRoundWinner,rounds:this.rounds,ball:{...this.ball},ballTrail:this.ballTrail.map(i=>({...i})),rallyPace:this.speed.initialMillis===this.speed.minimumMillis?1:W((this.speed.initialMillis-this.currentIntervalMillis)/(this.speed.initialMillis-this.speed.minimumMillis),0,1),pointScorer:this.scorer,pointFlashMillis:Math.max(0,this.pauseUntilMillis-this.nowMillis),winnerIndex:this.winner,impact:this.lastImpact&&this.nowMillis-this.lastImpactAtMillis<480?{...this.lastImpact,remainingMillis:480-(this.nowMillis-this.lastImpactAtMillis)}:null,motionEventId:this.motionEventId,initialBallSpeed:this.speed.initialTilesPerSecond,ballSpeed:1e3/this.currentIntervalMillis,returnSpeedMultiplier:this.speed.hitMultiplier,difficultySpeedFactor:this.speed.difficultyFactor}}reset(t={}){this.config=Ee({...this.config,...t},Ze),this.rng=et(this.config.seed),this.winningScore=this.readWinningScore(),this.players=this.createPlayers(),this.speed=rg(this.config),this.motionEventId=0,this.resetGame(this.config.nowMillis),this.lastEvent=E("none","Listo",this.config.nowMillis)}createPlayers(){return[{index:0,label:"Rojo",color:ha,score:0,lives:-1},{index:1,label:"Azul",color:pa,score:0,lives:-1}]}readWinningScore(){return Ht(this.config.options,Wa.pointsToWin)}resetGame(t){this.readyGate.reset(t),this.teamScore=[0,0],this.rounds=[],this.lastRoundHits=0,this.lastRoundWinner="",this.redPaddleX=Math.floor((S-fa)/2),this.bluePaddleX=this.redPaddleX,this.phase="waiting",this.success=!1,this.scorer=-1,this.winner=-1,this.pointAtMillis=0,this.lastImpactAtMillis=0,this.lastImpact=null,this.motionEventId+=1,this.startedAtMillis=t,this.finishAtMillis=0,this.resetBall(),this.lastEvent=E("none","Esperando a rojo arriba y azul abajo",t)}updatePhase(t,a=this.readyGate.tick(t)){return this.phase==="finished"?t-this.finishAtMillis>=Uf?(this.resetGame(t),[E("ready","Nueva partida",t)]):[]:a==="players-ready"?(this.phase="starting",this.motionEventId+=1,[E("start","Rojo y azul listos",t)]):a==="players-left"?(this.phase="waiting",this.motionEventId+=1,[E("ready","Vuelve a las zonas roja y azul",t)]):a==="started"?(this.phase="running",this.startedAtMillis=t,this.lastStepMillis=t,this.serve(),this.motionEventId+=1,[E("start","La pelota esta en juego",t)]):[]}movePaddle(t,a){let i=W(Math.round(t),Math.floor(fa/2),S-1-Math.floor(fa/2))-Math.floor(fa/2);a<G/2?this.redPaddleX=i:this.bluePaddleX=i}moveBall(t){let a=this.ball.x+this.ball.dx,l=this.ball.y+this.ball.dy;if(a<0&&(a=0,this.ball.dx=1),a>=S&&(a=S-1,this.ball.dx=-1),this.ball.dy<0&&l===ou&&a>=this.redPaddleX&&a<this.redPaddleX+fa)return this.reflectFromPaddle(a,this.redPaddleX),this.commitBall({...this.ball,x:a,y:ou+1,dy:1}),this.recordImpact(0,a,ou),this.accelerate(),E("coin","Rojo devuelve",t);if(this.ball.dy>0&&l===cu&&a>=this.bluePaddleX&&a<this.bluePaddleX+fa)return this.reflectFromPaddle(a,this.bluePaddleX),this.commitBall({...this.ball,x:a,y:cu-1,dy:-1}),this.recordImpact(1,a,cu),this.accelerate(),E("coin","Azul devuelve",t);if(l<0)return this.scorePoint(1,t),E("score","Punto para azul",t);if(l>=G)return this.scorePoint(0,t),E("score","Punto para rojo",t);this.commitBall({...this.ball,x:a,y:l})}scorePoint(t,a){if(this.teamScore[t]+=1,this.scorer=t,this.pointAtMillis=a,this.motionEventId+=1,this.recordRound(t),this.teamScore[t]>=this.winningScore){this.phase="finished",this.success=t===1,this.winner=t,this.finishAtMillis=a;return}this.resetBall(),this.pauseUntilMillis=a+sg,this.lastStepMillis=this.pauseUntilMillis}recordRound(t){this.lastRoundHits=this.hitCount,this.lastRoundWinner=this.labelForTeam(t),this.rounds=[...this.rounds,{index:this.rounds.length+1,winnerIndex:t,winnerLabel:this.lastRoundWinner,hits:this.lastRoundHits}]}resetBall(){this.ball={...this.ball,x:Ia,y:da},this.ballTrail=[],this.currentIntervalMillis=this.speed.initialMillis,this.hitCount=0,this.pauseUntilMillis=0,this.serve()}serve(){this.ball={x:Ia,y:da,dy:this.rng.int(2)===0?-1:1,dx:this.rng.int(2)===0?-1:1}}reflectFromPaddle(t,a){let l=a+Math.floor(fa/2);t<l?this.ball.dx=-1:t>l?this.ball.dx=1:this.ball.dx=this.rng.int(2)===0?-1:1}accelerate(){this.hitCount+=1,this.currentIntervalMillis=Math.max(this.speed.minimumMillis,this.currentIntervalMillis/this.speed.hitMultiplier)}commitBall(t){this.ballTrail=[{x:this.ball.x,y:this.ball.y},...this.ballTrail.filter(a=>a.x!==this.ball.x||a.y!==this.ball.y)].slice(0,5),this.ball=t}recordImpact(t,a,l){this.lastImpact={team:t,x:a,y:l},this.lastImpactAtMillis=this.nowMillis,this.motionEventId+=1}drawWaiting(t){let a=this.halfReady(0,this.nowMillis),l=this.halfReady(1,this.nowMillis);this.drawWaitingHalf(t,0,a),this.drawWaitingHalf(t,1,l),a?this.drawSoftBar(t,3,5,10,oa):this.drawBreathingOutline(t,0,oa),l?this.drawSoftBar(t,3,24,10,ca):this.drawBreathingOutline(t,1,ca)}drawReady(t){let a=lf(Ze.start),l=Math.max(0,a-this.readyGate.state(this.nowMillis).countdownMillis),n=W(l/a,0,1)*(G*.7),s=.5+Math.sin(l/86)*.5;for(let r=0;r<G;r+=1)for(let u=0;u<S;u+=1){let c=Math.abs(u-Ia)+Math.abs(r-da),f=r>=G/2?ca:oa,y=Math.abs(c-n),m=Math.max(0,1-y/3.2),p=7+(Math.sin(u*.82+r*.38-l/120)+1)*4;m>0?z(t,u,r,Xt(f,28+m*74,m*24)):c<n&&z(t,u,r,ma(f,p+s*10))}this.drawCenterLine(t,18+s*20),this.drawBallGlow(t),z(t,Ia,da,zl)}drawScoreFlash(t){let a=this.scorer===1?ca:oa,l=Math.max(0,this.nowMillis-this.pointAtMillis),i=W(l/sg,0,1),n=this.scorer===0?G-1:0,s=i*(G+8);for(let r=0;r<G;r+=1)for(let u=0;u<S;u+=1){let c=Math.hypot((u-Ia)*1.35,r-n),f=Math.max(0,1-Math.abs(c-s)/3.4),y=Math.sin(u*12.13+r*7.71+l/38)>.9?1:0,m=1-i;f>0?z(t,u,r,Xt(a,28+f*82,f*34)):y>0&&m>.18&&z(t,u,r,Xt(a,22+m*44,m*12))}this.drawCenterLine(t,12+(1-i)*24),this.drawPaddles(t)}drawWin(t){let a=this.winner===1?ca:oa,l=Math.max(0,this.nowMillis-this.finishAtMillis),i=l/92,n=.5+Math.sin(l/110)*.5;for(let r=0;r<G;r+=1)for(let u=0;u<S;u+=1){let f=((this.winner===0?G-1-r:r)+u*.72-i+G*4)%11,y=Math.sin(u*17.17+r*11.31+l/55);f<3.8?z(t,u,r,Xt(a,38+(3.8-f)*15+n*12,12+n*18)):y>.91&&z(t,u,r,Xt(a,48,32))}let s=64+n*26;U(t,Ia-1,da-1,3,3,ma(Bi,s)),z(t,Ia,da,zl)}drawArena(t){let a=this.nowMillis/185;for(let l=1;l<G-1;l+=1){let i=l<G/2?oa:ca;for(let n=0;n<S;n+=1){let s=(Math.sin(n*.78+l*.31-a)+1)*.5,r=(n+l)%3===0?4:0;z(t,n,l,ma(i,4+s*7+r))}}this.drawCenterLine(t,18+(Math.sin(this.nowMillis/140)+1)*5)}drawCenterLine(t,a){for(let l=0;l<S;l+=1)(l+Math.floor(this.nowMillis/120))%3===0&&(z(t,l,da-1,Xt(Bi,a,0)),z(t,l,da,Xt(Bi,a*.72,0)))}drawBallTrail(t){this.ballTrail.forEach((a,l)=>{let i=Math.max(10,46-l*8);z(t,a.x,a.y,ma(Bi,i))})}drawBallGlow(t){let a=20+(Math.sin(this.nowMillis/70)+1)*7;for(let[l,i]of[[-1,0],[1,0],[0,-1],[0,1]])z(t,this.ball.x+l,this.ball.y+i,ma(Bi,a))}drawImpact(t){if(!this.lastImpact)return;let a=this.nowMillis-this.lastImpactAtMillis;if(a<0||a>=480)return;let l=a/480,i=1+l*5.5,n=this.lastImpact.team===0?oa:ca;for(let s=Math.max(0,this.lastImpact.y-7);s<=Math.min(G-1,this.lastImpact.y+7);s+=1)for(let r=Math.max(0,this.lastImpact.x-7);r<=Math.min(S-1,this.lastImpact.x+7);r+=1){let u=Math.hypot(r-this.lastImpact.x,s-this.lastImpact.y),c=Math.max(0,1-Math.abs(u-i)/1.45);c>0&&z(t,r,s,Xt(n,30+c*52,c*28*(1-l)))}}drawBreathingOutline(t,a,l){let i=(this.nowMillis/900+a*.5)%1,n=.5-Math.cos(i*Math.PI*2)*.5,s=Math.round(1+n*2),r=a===0?3+s:21-s,u=48+n*48;this.drawOutline(t,s,r,S-s*2,8,ma(l,u))}drawScore(t){for(let a=0;a<this.teamScore[0]&&a<S;a+=1)z(t,a,0,ha);for(let a=0;a<this.teamScore[1]&&a<S;a+=1)z(t,a,G-1,pa)}drawPaddles(t){this.drawPaddle(t,this.redPaddleX,ou,oa),this.drawPaddle(t,this.bluePaddleX,cu,ca)}drawWaitingHalf(t,a,l){let i=a===1?G/2:0,n=a===1?ca:oa,s=Math.floor(this.nowMillis/120)%10;for(let r=i;r<i+G/2;r+=1)for(let u=0;u<S;u+=1){let c=0;l?c=18+(u+r+s)%6*6:(u+r+s)%7===0&&(c=22),c>0&&z(t,u,r,ma(n,c))}}drawSoftBar(t,a,l,i,n){let s=Math.floor(this.nowMillis/100)%6;for(let r=0;r<i;r+=1){let u=r===s||r===i-1-s?112:58+r*4;z(t,a+r,l,ma(n,u)),z(t,a+r,l+1,Xt(n,u-8,10)),z(t,a+r,l+2,ma(n,Math.max(18,u-28)))}}drawPaddle(t,a,l,i){for(let n=0;n<fa;n+=1){let s=n===Math.floor(fa/2)?118:74;z(t,a+n,l,Xt(i,s,18))}}drawOutline(t,a,l,i,n,s){let r=Math.max(2,Math.round(i)),u=Math.max(2,Math.round(n));U(t,a,l,r,1,s),U(t,a,l+u-1,r,1,s),U(t,a,l,1,u,s),U(t,a+r-1,l,1,u,s)}halfReady(t,a){return this.readyGate.zoneReady(t,a)}activeHalves(t){return this.readyGate.state(t).readyPlayers}labelForTeam(t){return this.players[t]?.label||(t===0?"Rojo":"Azul")}recordEvents(t){let a=t.at(-1);return a&&(this.lastEvent=a),t}};function rg(e){let t=Ht(e.options,Wa.initialBallSpeed),a=Ht(e.options,Wa.returnSpeedMultiplier),i=Ht(e.options,Wa.difficultyMultiplier)**TM(e.difficulty),n=t*i,s=1+(a-1)*i,r=n*EM;return{difficultyFactor:i,hitMultiplier:s,initialTilesPerSecond:n,initialMillis:1e3/n,minimumMillis:1e3/r}}function TM(e){switch(e){case"medium":return 1;case"hard":return 2;case"expert":return 3;default:return 0}}function ma(e,t){return xl(Ut(e,t))}function Xt(e,t,a){return xl(Fn(Ut(e,t),Ut(Bi,a)))}var og=(()=>{let e=Xe("#05070a");return U(e,5,2,5,1,ha),U(e,6,29,5,1,pa),z(e,8,16,zl),e})(),Lf={currentGame:Ze.id,label:Ze.label,phase:"waiting",playerCount:2,players:[{index:0,label:"Rojo",color:ha,score:0,lives:-1},{index:1,label:"Azul",color:pa,score:0,lives:-1}],score:0,lives:-1,elapsedMillis:0,remainingMillis:0,activeTargets:0,success:!1,lastEventCue:"ready",lastEventMessage:"Ping Pong espera rojo y azul",countdownMillis:0,readyPlayers:0,requiredPlayers:2,matchTarget:5,roundHits:0,lastRoundHits:0,lastRoundWinner:"",rounds:[],ball:{x:8,y:16,dx:1,dy:1},ballTrail:[],rallyPace:0,pointScorer:-1,pointFlashMillis:0,winnerIndex:-1,impact:null,motionEventId:1,initialBallSpeed:6.9,ballSpeed:6.9,returnSpeedMultiplier:1.042,difficultySpeedFactor:1.2},Yf={...Lf,phase:"running",readyPlayers:2,elapsedMillis:8200,activeTargets:2,lastEventCue:"coin",lastEventMessage:"Azul devuelve",roundHits:3,ball:{x:11,y:21,dx:1,dy:1},ballTrail:[{x:10,y:20},{x:9,y:19},{x:8,y:18}],rallyPace:.1935,ballSpeed:7.8064,impact:{team:1,x:10,y:29,remainingMillis:180},motionEventId:4},cg={...Yf,phase:"finished",score:5,remainingMillis:2400,success:!0,lastEventCue:"score",lastEventMessage:"Punto para azul",players:[{index:0,label:"Rojo",color:ha,score:2,lives:-1},{index:1,label:"Azul",color:pa,score:3,lives:-1}],lastRoundHits:2,lastRoundWinner:"Azul",pointScorer:1,winnerIndex:1,motionEventId:8,rounds:[{index:1,winnerIndex:0,winnerLabel:"Rojo",hits:1},{index:2,winnerIndex:1,winnerLabel:"Azul",hits:2}]};var Ff={};wl(Ff,{PlayerDisplay:()=>fg,blueColor:()=>ss,blueFieldColor:()=>us,blueFieldFirstRow:()=>Yi,centerLineColor:()=>os,createGame:()=>$a,finishedFrame:()=>xg,finishedSnapshot:()=>Eg,gameWinAnimationMillis:()=>Li,initEvents:()=>mg,knotColor:()=>Rl,manifest:()=>Et,onBlueTilePressed:()=>ga,onRedTilePressed:()=>Dl,redColor:()=>ns,redFieldColor:()=>rs,redFieldLastRow:()=>ds,ropeColor:()=>jf,ropeLimit:()=>ya,roundTransitionMillis:()=>dg,roundWinAnimationMillis:()=>qi,roundWinFrame:()=>Mg,roundWinSnapshot:()=>Sg,roundsToWin:()=>Zf,runningFrame:()=>vg,runningSnapshot:()=>bg,startingFrame:()=>yg,startingSnapshot:()=>gg,teamForTile:()=>fs,teamLabel:()=>_l,tiraSogaReadyZones:()=>fu,totalRounds:()=>cs,waitingFrame:()=>hg,waitingSnapshot:()=>pg});var J=ne(ve(),1),GM=`
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
`;function fg({snapshot:e}){let[t,a]=e.players,l=t??{label:"Rojo",score:0,color:"#ff1c28"},i=a??{label:"Azul",score:0,color:"#145cff"},n=e.currentRound??1,s=e.totalRounds??5,r=e.pressesPerAdvance??1,u=e.ropePosition??0,c=e.ropeLimit??6,f=e.rounds??[],y=50+u/Math.max(c,1)*43,m=e.winnerIndex===0?"Rojo":"Azul",p=e.roundWinnerIndex===0?"Rojo":"Azul",M=e.phase!=="finished"&&e.roundWinnerIndex!==-1,x=e.phase==="waiting"||e.phase==="starting",N=e.phase==="waiting"?"Listos":e.phase==="starting"?"Empieza en":"Ronda",d=e.phase==="waiting"?`${e.readyPlayers??0}/${e.requiredPlayers??2}`:e.phase==="starting"?tt(e.countdownMillis??0):`${n}/${s}`,o=x?e.phase==="waiting"?"en posici\xF3n":"preparados":`${e.difficultyLabel??"Medio"} \xB7 ${r} ${r===1?"pisada":"pisadas"} por avance`,h=e.phase==="finished"?`Victoria ${m}`:M?`Ronda para ${p.toLowerCase()}`:u===0?"\xA1Pisad vuestro campo para tirar!":u<0?"Rojo toma ventaja":"Azul toma ventaja";return(0,J.jsx)(yt,{title:e.label,phase:e.phase,variant:"versus",children:(0,J.jsxs)("div",{className:`tira-soga-display is-phase-${e.phase}`,style:{"--tira-soga-rope-x":`${y}%`},children:[(0,J.jsx)("style",{children:GM}),(0,J.jsx)(Pa,{snapshot:e}),(0,J.jsx)(Pr,{className:"tira-soga-scoreboard",left:l,right:i,target:e.matchTarget??3,centerLabel:N,centerValue:d,centerCaption:o}),(0,J.jsxs)("section",{className:"tira-soga-arena","aria-label":`Posici\xF3n de la soga: ${u}`,children:[(0,J.jsx)("span",{className:"tira-soga-team is-red",children:"Rojo"}),(0,J.jsxs)("div",{className:"tira-soga-track","aria-hidden":"true",children:[(0,J.jsx)("i",{className:"tira-soga-rope"}),(0,J.jsx)("i",{className:"tira-soga-center"}),(0,J.jsx)("i",{className:"tira-soga-knot"})]}),(0,J.jsx)("span",{className:"tira-soga-team is-blue",children:"Azul"}),(0,J.jsx)("strong",{className:"tira-soga-caption",children:h}),e.phase==="finished"?(0,J.jsxs)("div",{className:"tira-soga-result is-game-win",children:[(0,J.jsxs)("strong",{children:["\xA1Gana ",m,"!"]}),(0,J.jsxs)("span",{children:["Resultado final ",l.score," \u2013 ",i.score]})]}):M?(0,J.jsxs)("div",{className:"tira-soga-result is-round-win",children:[(0,J.jsxs)("strong",{children:["Ronda para ",p]}),(0,J.jsx)("span",{children:"Siguiente ronda en breve"})]}):null]}),(0,J.jsxs)(wt,{columns:4,className:"tira-soga-metrics",children:[(0,J.jsx)(ae,{label:"Pisadas rojas",tone:"red",value:e.redPresses??0}),(0,J.jsx)(ae,{label:"Avance rojo",tone:"amber",value:`${e.redProgress??0}/${r}`}),(0,J.jsx)(ae,{label:"Avance azul",tone:"cyan",value:`${e.blueProgress??0}/${r}`}),(0,J.jsx)(ae,{label:"Pisadas azules",tone:"blue",value:e.bluePresses??0})]}),(0,J.jsx)(Fr,{className:"tira-soga-rounds",activeCaption:"Soga en juego",activeLabel:"En juego",activeRound:e.phase==="finished"?null:n,rounds:f,totalRounds:s})]})})}var Et={id:"tira-soga",label:"Tira-Soga",description:"Five-round team tug of war driven by rapid presses on the red and blue floor halves.",availability:{development:!0,production:!1},catalog:{category:"versus",color:"#ff9f1c",durationLabel:"Sin l\xEDmite",modeLabel:"Tira y afloja",audioLabel:"Efectos",rules:["Rojo ocupa la mitad superior y azul la inferior","Pisa r\xE1pidamente tu campo para arrastrar la soga","Gana tres de las cinco rondas"]},players:{allowAny:!0,min:2,max:2},start:{mode:"player-ready",countdownMillis:3e3,releaseGraceMillis:2e3},config:{difficulty:{default:"medium",options:["easy","medium","hard"]}},defaultDurationMillis:0,display:{entry:"./display"},preview:{seed:137,playerCount:2,difficulty:"medium",actions:[{atMillis:100,type:"press",x:4,y:8},{atMillis:100,type:"press",x:11,y:24}],captureStartMillis:3200,frameCount:18,frameIntervalMillis:120},tags:["competitive","teams","two-player","typescript"]};var ns="#ff1c28",ss="#145cff",rs="#720c17",us="#0b3189",os="#ff9f1c",jf="#f4c56a",Rl="#fff7d6",cs=5,Zf=3,ya=6,qi=1800,Li=5e3,dg=qi,ds=14,Yi=17,CM={easy:1,medium:2,hard:3},AM={easy:"F\xE1cil",medium:"Medio",hard:"Dif\xEDcil"};function $a(e){return new Xf(e)}function fu(){return[{minX:0,maxX:S-1,minY:0,maxY:ds},{minX:0,maxX:S-1,minY:Yi,maxY:G-1}]}var Xf=class{config;phase="waiting";startedAtMillis=0;nowMillis=0;ropePosition=0;teamScore=[0,0];teamPresses=[0,0];teamProgress=[0,0];rounds=[];roundWinnerIndex=-1;winnerIndex=-1;roundWonAtMillis=0;roundPauseUntilMillis=0;finishAtMillis=0;motionEventId=0;readyZones=fu();readyGate;heldTiles=Array.from({length:S*G},()=>!1);flashUntil=Array.from({length:S*G},()=>0);lastEvent=E("none","Listos para tirar",0);constructor(t){this.config=Ee(t,Et),this.readyGate=je(Et.start,this.readyZones,this.config.nowMillis),this.resetMatch(this.config.nowMillis)}init(t){return this.resetMatch(t),this.lastEvent=E("ready","Tira-Soga espera a rojo y azul",t),[this.lastEvent]}press(t){this.nowMillis=t.atMillis;let a=this.readyGate.update(t);if(this.phase==="waiting"||this.phase==="starting")return this.recordEvents(this.applyReadyTransition(a,t.atMillis));if(!t.pressed||this.phase!=="running"||this.roundWinnerIndex!==-1)return[];let l=this.tileIndex(t.x,t.y),i=fs(t.x,t.y);if(l===-1||i===-1||this.heldTiles[l])return[];this.heldTiles[l]=!0,this.flashUntil[l]=t.atMillis+220,this.teamPresses[i]+=1,this.teamProgress[i]+=1;let n=this.pressesPerAdvance();return this.teamProgress[i]<n?this.recordEvents([E("hit",`${_l(i)} suma ${this.teamProgress[i]} de ${n}`,t.atMillis)]):(this.teamProgress[i]=0,this.ropePosition+=i===0?-1:1,Math.abs(this.ropePosition)>=ya?this.recordEvents([this.finishRound(i,t.atMillis)]):this.recordEvents([E("hit",`${_l(i)} tira de la soga`,t.atMillis)]))}release(t){this.nowMillis=t.atMillis;let a=this.tileIndex(t.x,t.y);a!==-1&&(this.heldTiles[a]=!1);let l=this.readyGate.update({...t,pressed:!1});return this.phase==="waiting"||this.phase==="starting"?this.recordEvents(this.applyReadyTransition(l,t.atMillis)):[]}tick(t){this.nowMillis=t.atMillis;let a=this.updateLifecycle(t.atMillis,this.readyGate.tick(t.atMillis));return this.phase==="running"&&this.roundWinnerIndex!==-1&&t.atMillis>=this.roundPauseUntilMillis&&(this.startNextRound(),a.push(E("start",`Ronda ${this.currentRound()}: \xA1a tirar!`,t.atMillis))),this.recordEvents(a)}render(){let t=Xe("#05070a");return this.phase==="waiting"?(this.drawWaiting(t),t):this.phase==="starting"?(this.drawStarting(t),t):this.phase==="finished"?(this.drawGameWin(t),t):(this.drawArena(t),this.roundWinnerIndex!==-1&&this.drawRoundWin(t),t)}snapshot(){let t=this.readyGate.state(this.nowMillis),a=this.scoredPlayers(),l=Math.max(0,this.roundPauseUntilMillis-this.nowMillis),i=this.phase==="finished"?Math.max(0,this.finishAtMillis+Li-this.nowMillis):0;return{currentGame:Et.id,label:Et.label,phase:this.phase,playerCount:this.config.playerCount,players:a,score:Math.max(...this.teamScore),lives:-1,elapsedMillis:this.phase==="waiting"||this.phase==="starting"?0:Math.max(0,(this.phase==="finished"?this.finishAtMillis:this.nowMillis)-this.startedAtMillis),remainingMillis:i||l,activeTargets:this.phase==="running"&&this.roundWinnerIndex===-1?2:0,success:this.phase==="finished",lastEventCue:this.lastEvent.cue,lastEventMessage:this.lastEvent.message,countdownMillis:this.phase==="starting"?t.countdownMillis:0,readyPlayers:t.readyPlayers,requiredPlayers:t.requiredPlayers,matchTarget:Zf,roundHits:this.teamPresses[0]+this.teamPresses[1],lastRoundHits:this.rounds.at(-1)?.hits??0,lastRoundWinner:this.rounds.at(-1)?.winnerLabel??"",difficulty:this.config.difficulty,difficultyLabel:AM[this.config.difficulty]??"Medio",pressesPerAdvance:this.pressesPerAdvance(),ropePosition:this.ropePosition,ropeLimit:ya,redPresses:this.teamPresses[0],bluePresses:this.teamPresses[1],redProgress:this.teamProgress[0],blueProgress:this.teamProgress[1],currentRound:this.currentRound(),totalRounds:cs,rounds:this.rounds.map(n=>({...n})),roundWinnerIndex:this.roundWinnerIndex,roundTransitionMillis:l,winnerIndex:this.winnerIndex,motionEventId:this.motionEventId}}reset(t={}){this.config=Ee({...this.config,...t,options:{...this.config.options,...t.options}},Et),this.readyZones=fu(),this.readyGate=je(Et.start,this.readyZones,this.config.nowMillis),this.resetMatch(this.config.nowMillis),this.lastEvent=E("ready","Tira-Soga espera a rojo y azul",this.config.nowMillis)}playerReadyZones(){return this.readyZones.map(t=>({...t}))}updateLifecycle(t,a){return this.phase==="finished"?t-this.finishAtMillis>=Li?(this.resetMatch(t),[E("ready","Nueva partida",t)]):[]:this.applyReadyTransition(a,t)}applyReadyTransition(t,a){return t==="players-ready"?(this.phase="starting",this.motionEventId+=1,[E("start","Rojo y azul listos",a)]):t==="players-left"?(this.phase="waiting",this.motionEventId+=1,[E("ready","Vuelve a tu campo iluminado",a)]):t==="started"?(this.phase="running",this.startedAtMillis=a,this.motionEventId+=1,[E("start","Ronda 1: \xA1a tirar!",a)]):[]}finishRound(t,a){let l=this.currentRound(),i=this.teamPresses[0]+this.teamPresses[1];return this.teamScore[t]+=1,this.roundWinnerIndex=t,this.roundWonAtMillis=a,this.rounds.push({index:l,winnerIndex:t,winnerLabel:_l(t),hits:i}),this.motionEventId+=1,this.rounds.length>=cs?(this.phase="finished",this.finishAtMillis=a,this.winnerIndex=this.teamScore[0]>this.teamScore[1]?0:1,E("win",`${_l(this.winnerIndex)} gana Tira-Soga`,a)):(this.roundPauseUntilMillis=a+qi,E("hit",`Ronda ${l} para ${_l(t).toLowerCase()}`,a))}startNextRound(){this.ropePosition=0,this.teamPresses=[0,0],this.teamProgress=[0,0],this.roundWinnerIndex=-1,this.roundWonAtMillis=0,this.roundPauseUntilMillis=0,this.heldTiles.fill(!1),this.flashUntil.fill(0),this.motionEventId+=1}resetMatch(t){this.readyGate.reset(t),this.phase="waiting",this.startedAtMillis=t,this.nowMillis=t,this.ropePosition=0,this.teamScore=[0,0],this.teamPresses=[0,0],this.teamProgress=[0,0],this.rounds=[],this.roundWinnerIndex=-1,this.winnerIndex=-1,this.roundWonAtMillis=0,this.roundPauseUntilMillis=0,this.finishAtMillis=0,this.heldTiles.fill(!1),this.flashUntil.fill(0),this.motionEventId=0,this.motionEventId+=1}currentRound(){return Math.min(cs,this.rounds.length+(this.roundWinnerIndex===-1?1:0))}pressesPerAdvance(){return CM[this.config.difficulty]??2}ropeTileY(t=this.ropePosition){let a=(t+ya)/(ya*2);return Math.round(a*(G-1))}scoredPlayers(){return[{index:0,label:"Rojo",color:ns,score:this.teamScore[0],lives:-1},{index:1,label:"Azul",color:ss,score:this.teamScore[1],lives:-1}]}tileIndex(t,a){return!Number.isInteger(t)||!Number.isInteger(a)||!Nt(t,a)?-1:a*S+t}recordEvents(t){let a=t.at(-1);return a&&(this.lastEvent=a),t}drawWaiting(t){this.drawBaseFields(t,"#410912","#071f5a");let a=Math.floor(this.nowMillis/180);for(let l=0;l<G;l+=1){let i=fs(0,l);i===-1||(l+a)%5!==0||U(t,0,l,S,1,i===0?rs:us)}this.drawRope(t,0)}drawStarting(t){this.drawBaseFields(t,rs,us),St(t,{bandWidth:2,period:7,step:Math.floor(this.nowMillis/90),color:({y:a})=>a<G/2?"#ff7b84":"#79a0ff"}),this.drawRope(t,0)}drawArena(t){let a=this.roundWinnerIndex;this.drawBaseFields(t,a===0?ns:rs,a===1?ss:us),this.drawRope(t,this.ropePosition);for(let l=0;l<this.flashUntil.length;l+=1){if((this.flashUntil[l]??0)<=this.nowMillis)continue;let i=l%S,n=Math.floor(l/S),s=fs(i,n);s!==-1&&z(t,i,n,s===0?"#ff8a92":"#73a0ff")}}drawRoundWin(t){let a=this.roundWinnerIndex;if(a===-1)return;let l=Math.max(0,this.nowMillis-this.roundWonAtMillis),i=a===0?0:G-1;Fa(t,{centerX:(S-1)/2,centerY:i,color:Rl,radius:l/80%24,thickness:1.4}),Fa(t,{centerX:(S-1)/2,centerY:i,color:os,radius:(l/80+7)%24,thickness:1})}drawGameWin(t){let a=this.winnerIndex===0?ns:ss;U(t,0,0,S,G,a);let l=Math.max(0,this.nowMillis-this.finishAtMillis);St(t,{bandWidth:2,period:9,step:Math.floor(l/80),color:os});for(let i=0;i<G;i+=1)for(let n=0;n<S;n+=1)(n*17+i*11+Math.floor(l/120))%37===0&&z(t,n,i,Rl)}drawBaseFields(t,a,l){U(t,0,0,S,ds+1,a),U(t,0,Yi,S,G-Yi,l),U(t,0,15,S,2,os)}drawRope(t,a){U(t,7,0,2,G,jf);let l=this.ropeTileY(a);U(t,5,l,6,1,Rl),l>0&&U(t,7,l-1,2,1,Rl),l<G-1&&U(t,7,l+1,2,1,Rl)}};function fs(e,t){return!Number.isInteger(e)||!Number.isInteger(t)||!Nt(e,t)?-1:t<=ds?0:t>=Yi?1:-1}function _l(e){return e===0?"Rojo":"Azul"}function Dl(e,t,a=4,l=8){let i=e.press({x:a,y:l,pressed:!0,atMillis:t});return e.release({x:a,y:l,pressed:!1,atMillis:t+1}),i}function ga(e,t,a=11,l=24){let i=e.press({x:a,y:l,pressed:!0,atMillis:t});return e.release({x:a,y:l,pressed:!1,atMillis:t+1}),i}var Qf=$a({playerCount:2,difficulty:"medium"}),mg=Qf.init(0),hg=Qf.render(),pg=Qf.snapshot(),ms=$a({playerCount:2,difficulty:"hard"});ms.init(0);Tg(ms,100);ms.tick({atMillis:1100});var yg=ms.render(),gg=ms.snapshot(),Tt=$a({playerCount:2,difficulty:"medium"});Tt.init(0);Pf(Tt);Dl(Tt,3200);Dl(Tt,3300);ga(Tt,3400);ga(Tt,3500);ga(Tt,3600);ga(Tt,3700);ga(Tt,3800);var vg=Tt.render(),bg=Tt.snapshot(),ji=$a({playerCount:2,difficulty:"easy"});ji.init(0);Pf(ji);var Vf=3200;for(let e=0;e<ya;e+=1)Dl(ji,Vf),Vf+=30;ji.tick({atMillis:Vf+500});var Mg=ji.render(),Sg=ji.snapshot(),Zi=$a({playerCount:2,difficulty:"easy"});Zi.init(0);Pf(Zi);var Xi=3200;function zM(e,t){for(let a=0;a<ya;a+=1)t===0?Dl(e,Xi):ga(e,Xi),Xi+=30;e.snapshot().phase!=="finished"&&(Xi+=qi,e.tick({atMillis:Xi}))}for(let e of[0,1,0,1,0])zM(Zi,e);Zi.tick({atMillis:Xi+Math.floor(Li/3)});var xg=Zi.render(),Eg=Zi.snapshot();function Tg(e,t){for(let a of e.playerReadyZones())e.press({x:a.minX+2,y:a.minY+2,pressed:!0,atMillis:t})}function Pf(e){Tg(e,100),e.tick({atMillis:3100});for(let t of e.playerReadyZones())e.release({x:t.minX+2,y:t.minY+2,pressed:!1,atMillis:3101})}var Kf=new Map([[Bt.id,cf],[lt.id,gf],[Yt.id,Tf],[qt.id,Nf],[Ze.id,qf],[Et.id,Ff]]),z2=[...Kf.values()].map(e=>e.manifest).sort((e,t)=>e.id.localeCompare(t.id));var Jf=ne(ve(),1),du=new WeakMap;function Gg(e,t){let a=Kf.get(t.gameId);if(!a?.PlayerDisplay)throw new Error(`no player display registered for ${t.gameId}`);let l=du.get(e);l||(l={root:(0,Cg.createRoot)(e),input:t},du.set(e,l)),l.input=t;let i=a.PlayerDisplay;l.root.render((0,Jf.jsx)(Jy,{paused:t.paused===!0,children:(0,Jf.jsx)(i,{snapshot:t.snapshot,frame:t.frame})}))}function RM(e){du.get(e)?.root.unmount(),du.delete(e)}function _M(){if(document.getElementById("motion-levels-games-display-styles"))return;let e=document.createElement("style");e.id="motion-levels-games-display-styles",e.textContent=`/*
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
`,document.head.append(e)}_M();window.MotionLevelsGamesDisplay={revision:"bc6ee86a9dd0b75d06c2857872bc7a6bd69da429",mount:Gg,update:Gg,unmount:RM};})();
