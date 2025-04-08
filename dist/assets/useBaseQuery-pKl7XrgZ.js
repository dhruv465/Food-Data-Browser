var ut=e=>{throw TypeError(e)};var G=(e,t,s)=>t.has(e)||ut("Cannot "+s);var i=(e,t,s)=>(G(e,t,"read from private field"),s?s.call(e):t.get(e)),p=(e,t,s)=>t.has(e)?ut("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,s),o=(e,t,s,r)=>(G(e,t,"write to private field"),r?r.call(e,s):t.set(e,s),s),d=(e,t,s)=>(G(e,t,"access private method"),s);import{S as Ot,p as lt,l as S,s as J,m as K,n as St,o as X,q as dt,t as Et,v as xt,w as It,x as ft,y as Rt,r as E,z as Qt}from"./index-DrtFgdp2.js";var v,a,V,g,w,M,x,O,W,P,_,T,F,I,L,n,z,Y,Z,tt,et,st,it,rt,mt,vt,Wt=(vt=class extends Ot{constructor(t,s){super();p(this,n);p(this,v);p(this,a);p(this,V);p(this,g);p(this,w);p(this,M);p(this,x);p(this,O);p(this,W);p(this,P);p(this,_);p(this,T);p(this,F);p(this,I);p(this,L,new Set);this.options=s,o(this,v,t),o(this,O,null),o(this,x,lt()),this.options.experimental_prefetchInRender||i(this,x).reject(new Error("experimental_prefetchInRender feature flag is not enabled")),this.bindMethods(),this.setOptions(s)}bindMethods(){this.refetch=this.refetch.bind(this)}onSubscribe(){this.listeners.size===1&&(i(this,a).addObserver(this),pt(i(this,a),this.options)?d(this,n,z).call(this):this.updateResult(),d(this,n,et).call(this))}onUnsubscribe(){this.hasListeners()||this.destroy()}shouldFetchOnReconnect(){return at(i(this,a),this.options,this.options.refetchOnReconnect)}shouldFetchOnWindowFocus(){return at(i(this,a),this.options,this.options.refetchOnWindowFocus)}destroy(){this.listeners=new Set,d(this,n,st).call(this),d(this,n,it).call(this),i(this,a).removeObserver(this)}setOptions(t){const s=this.options,r=i(this,a);if(this.options=i(this,v).defaultQueryOptions(t),this.options.enabled!==void 0&&typeof this.options.enabled!="boolean"&&typeof this.options.enabled!="function"&&typeof S(this.options.enabled,i(this,a))!="boolean")throw new Error("Expected enabled to be a boolean or a callback that returns a boolean");d(this,n,rt).call(this),i(this,a).setOptions(this.options),s._defaulted&&!J(this.options,s)&&i(this,v).getQueryCache().notify({type:"observerOptionsUpdated",query:i(this,a),observer:this});const l=this.hasListeners();l&&bt(i(this,a),r,this.options,s)&&d(this,n,z).call(this),this.updateResult(),l&&(i(this,a)!==r||S(this.options.enabled,i(this,a))!==S(s.enabled,i(this,a))||K(this.options.staleTime,i(this,a))!==K(s.staleTime,i(this,a)))&&d(this,n,Y).call(this);const c=d(this,n,Z).call(this);l&&(i(this,a)!==r||S(this.options.enabled,i(this,a))!==S(s.enabled,i(this,a))||c!==i(this,I))&&d(this,n,tt).call(this,c)}getOptimisticResult(t){const s=i(this,v).getQueryCache().build(i(this,v),t),r=this.createResult(s,t);return Tt(this,r)&&(o(this,g,r),o(this,M,this.options),o(this,w,i(this,a).state)),r}getCurrentResult(){return i(this,g)}trackResult(t,s){const r={};return Object.keys(t).forEach(l=>{Object.defineProperty(r,l,{configurable:!1,enumerable:!0,get:()=>(this.trackProp(l),s==null||s(l),t[l])})}),r}trackProp(t){i(this,L).add(t)}getCurrentQuery(){return i(this,a)}refetch({...t}={}){return this.fetch({...t})}fetchOptimistic(t){const s=i(this,v).defaultQueryOptions(t),r=i(this,v).getQueryCache().build(i(this,v),s);return r.fetch().then(()=>this.createResult(r,s))}fetch(t){return d(this,n,z).call(this,{...t,cancelRefetch:t.cancelRefetch??!0}).then(()=>(this.updateResult(),i(this,g)))}createResult(t,s){var ct;const r=i(this,a),l=this.options,c=i(this,g),h=i(this,w),Q=i(this,M),m=t!==r?t.state:i(this,V),{state:j}=t;let u={...j},k=!1,b;if(s._optimisticResults){const y=this.hasListeners(),U=!y&&pt(t,s),D=y&&bt(t,r,s,l);(U||D)&&(u={...u,...It(j.data,t.options)}),s._optimisticResults==="isRestoring"&&(u.fetchStatus="idle")}let{error:B,errorUpdatedAt:A,status:R}=u;if(s.select&&u.data!==void 0)if(c&&u.data===(h==null?void 0:h.data)&&s.select===i(this,W))b=i(this,P);else try{o(this,W,s.select),b=s.select(u.data),b=ft(c==null?void 0:c.data,b,s),o(this,P,b),o(this,O,null)}catch(y){o(this,O,y)}else b=u.data;if(s.placeholderData!==void 0&&b===void 0&&R==="pending"){let y;if(c!=null&&c.isPlaceholderData&&s.placeholderData===(Q==null?void 0:Q.placeholderData))y=c.data;else if(y=typeof s.placeholderData=="function"?s.placeholderData((ct=i(this,_))==null?void 0:ct.state.data,i(this,_)):s.placeholderData,s.select&&y!==void 0)try{y=s.select(y),o(this,O,null)}catch(U){o(this,O,U)}y!==void 0&&(R="success",b=ft(c==null?void 0:c.data,y,s),k=!0)}i(this,O)&&(B=i(this,O),b=i(this,P),A=Date.now(),R="error");const H=u.fetchStatus==="fetching",$=R==="pending",q=R==="error",ht=$&&H,ot=b!==void 0,C={status:R,fetchStatus:u.fetchStatus,isPending:$,isSuccess:R==="success",isError:q,isInitialLoading:ht,isLoading:ht,data:b,dataUpdatedAt:u.dataUpdatedAt,error:B,errorUpdatedAt:A,failureCount:u.fetchFailureCount,failureReason:u.fetchFailureReason,errorUpdateCount:u.errorUpdateCount,isFetched:u.dataUpdateCount>0||u.errorUpdateCount>0,isFetchedAfterMount:u.dataUpdateCount>m.dataUpdateCount||u.errorUpdateCount>m.errorUpdateCount,isFetching:H,isRefetching:H&&!$,isLoadingError:q&&!ot,isPaused:u.fetchStatus==="paused",isPlaceholderData:k,isRefetchError:q&&ot,isStale:nt(t,s),refetch:this.refetch,promise:i(this,x)};if(this.options.experimental_prefetchInRender){const y=N=>{C.status==="error"?N.reject(C.error):C.data!==void 0&&N.resolve(C.data)},U=()=>{const N=o(this,x,C.promise=lt());y(N)},D=i(this,x);switch(D.status){case"pending":t.queryHash===r.queryHash&&y(D);break;case"fulfilled":(C.status==="error"||C.data!==D.value)&&U();break;case"rejected":(C.status!=="error"||C.error!==D.reason)&&U();break}}return C}updateResult(){const t=i(this,g),s=this.createResult(i(this,a),this.options);if(o(this,w,i(this,a).state),o(this,M,this.options),i(this,w).data!==void 0&&o(this,_,i(this,a)),J(s,t))return;o(this,g,s);const r=()=>{if(!t)return!0;const{notifyOnChangeProps:l}=this.options,c=typeof l=="function"?l():l;if(c==="all"||!c&&!i(this,L).size)return!0;const h=new Set(c??i(this,L));return this.options.throwOnError&&h.add("error"),Object.keys(i(this,g)).some(Q=>{const f=Q;return i(this,g)[f]!==t[f]&&h.has(f)})};d(this,n,mt).call(this,{listeners:r()})}onQueryUpdate(){this.updateResult(),this.hasListeners()&&d(this,n,et).call(this)}},v=new WeakMap,a=new WeakMap,V=new WeakMap,g=new WeakMap,w=new WeakMap,M=new WeakMap,x=new WeakMap,O=new WeakMap,W=new WeakMap,P=new WeakMap,_=new WeakMap,T=new WeakMap,F=new WeakMap,I=new WeakMap,L=new WeakMap,n=new WeakSet,z=function(t){d(this,n,rt).call(this);let s=i(this,a).fetch(this.options,t);return t!=null&&t.throwOnError||(s=s.catch(St)),s},Y=function(){d(this,n,st).call(this);const t=K(this.options.staleTime,i(this,a));if(X||i(this,g).isStale||!dt(t))return;const r=Et(i(this,g).dataUpdatedAt,t)+1;o(this,T,setTimeout(()=>{i(this,g).isStale||this.updateResult()},r))},Z=function(){return(typeof this.options.refetchInterval=="function"?this.options.refetchInterval(i(this,a)):this.options.refetchInterval)??!1},tt=function(t){d(this,n,it).call(this),o(this,I,t),!(X||S(this.options.enabled,i(this,a))===!1||!dt(i(this,I))||i(this,I)===0)&&o(this,F,setInterval(()=>{(this.options.refetchIntervalInBackground||xt.isFocused())&&d(this,n,z).call(this)},i(this,I)))},et=function(){d(this,n,Y).call(this),d(this,n,tt).call(this,d(this,n,Z).call(this))},st=function(){i(this,T)&&(clearTimeout(i(this,T)),o(this,T,void 0))},it=function(){i(this,F)&&(clearInterval(i(this,F)),o(this,F,void 0))},rt=function(){const t=i(this,v).getQueryCache().build(i(this,v),this.options);if(t===i(this,a))return;const s=i(this,a);o(this,a,t),o(this,V,t.state),this.hasListeners()&&(s==null||s.removeObserver(this),t.addObserver(this))},mt=function(t){Rt.batch(()=>{t.listeners&&this.listeners.forEach(s=>{s(i(this,g))}),i(this,v).getQueryCache().notify({query:i(this,a),type:"observerResultsUpdated"})})},vt);function wt(e,t){return S(t.enabled,e)!==!1&&e.state.data===void 0&&!(e.state.status==="error"&&t.retryOnMount===!1)}function pt(e,t){return wt(e,t)||e.state.data!==void 0&&at(e,t,t.refetchOnMount)}function at(e,t,s){if(S(t.enabled,e)!==!1){const r=typeof s=="function"?s(e):s;return r==="always"||r!==!1&&nt(e,t)}return!1}function bt(e,t,s,r){return(e!==t||S(r.enabled,e)===!1)&&(!s.suspense||e.state.status!=="error")&&nt(e,s)}function nt(e,t){return S(t.enabled,e)!==!1&&e.isStaleByTime(K(t.staleTime,e))}function Tt(e,t){return!J(e.getCurrentResult(),t)}var Ct=E.createContext(!1),Ft=()=>E.useContext(Ct);Ct.Provider;function Ut(){let e=!1;return{clearReset:()=>{e=!1},reset:()=>{e=!0},isReset:()=>e}}var Dt=E.createContext(Ut()),Mt=()=>E.useContext(Dt);function Pt(e,t){return typeof e=="function"?e(...t):!!e}function yt(){}var _t=(e,t)=>{(e.suspense||e.throwOnError||e.experimental_prefetchInRender)&&(t.isReset()||(e.retryOnMount=!1))},Lt=e=>{E.useEffect(()=>{e.clearReset()},[e])},jt=({result:e,errorResetBoundary:t,throwOnError:s,query:r,suspense:l})=>e.isError&&!t.isReset()&&!e.isFetching&&r&&(l&&e.data===void 0||Pt(s,[e.error,r])),kt=e=>{const t=e.staleTime;e.suspense&&(e.staleTime=typeof t=="function"?(...s)=>Math.max(t(...s),1e3):Math.max(t??1e3,1e3),typeof e.gcTime=="number"&&(e.gcTime=Math.max(e.gcTime,1e3)))},Bt=(e,t)=>e.isLoading&&e.isFetching&&!t,At=(e,t)=>(e==null?void 0:e.suspense)&&t.isPending,gt=(e,t,s)=>t.fetchOptimistic(e).catch(()=>{s.clearReset()});function Nt(e,t,s){var u,k,b,B,A;const r=Qt(),l=Ft(),c=Mt(),h=r.defaultQueryOptions(e);(k=(u=r.getDefaultOptions().queries)==null?void 0:u._experimental_beforeQuery)==null||k.call(u,h),h._optimisticResults=l?"isRestoring":"optimistic",kt(h),_t(h,c),Lt(c);const Q=!r.getQueryCache().get(h.queryHash),[f]=E.useState(()=>new t(r,h)),m=f.getOptimisticResult(h),j=!l&&e.subscribed!==!1;if(E.useSyncExternalStore(E.useCallback(R=>{const H=j?f.subscribe(Rt.batchCalls(R)):yt;return f.updateResult(),H},[f,j]),()=>f.getCurrentResult(),()=>f.getCurrentResult()),E.useEffect(()=>{f.setOptions(h)},[h,f]),At(h,m))throw gt(h,f,c);if(jt({result:m,errorResetBoundary:c,throwOnError:h.throwOnError,query:r.getQueryCache().get(h.queryHash),suspense:h.suspense}))throw m.error;if((B=(b=r.getDefaultOptions().queries)==null?void 0:b._experimental_afterQuery)==null||B.call(b,h,m),h.experimental_prefetchInRender&&!X&&Bt(m,l)){const R=Q?gt(h,f,c):(A=r.getQueryCache().get(h.queryHash))==null?void 0:A.promise;R==null||R.catch(yt).finally(()=>{f.updateResult()})}return h.notifyOnChangeProps?m:f.trackResult(m)}export{Wt as Q,Nt as u};
