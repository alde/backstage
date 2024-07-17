/*! For license information please see 334af791.9fafcb3c.js.LICENSE.txt */
"use strict";(self.webpackChunkbackstage_microsite=self.webpackChunkbackstage_microsite||[]).push([[478638],{114865:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>a,default:()=>d,frontMatter:()=>o,metadata:()=>s,toc:()=>c});var r=n(824246),i=n(511151);const o={id:"discovery",title:"GitLab Discovery",sidebar_label:"Discovery",description:"Automatically discovering catalog entities from repositories in GitLab"},a=void 0,s={id:"integrations/gitlab/discovery",title:"GitLab Discovery",description:"Automatically discovering catalog entities from repositories in GitLab",source:"@site/../docs/integrations/gitlab/discovery.md",sourceDirName:"integrations/gitlab",slug:"/integrations/gitlab/discovery",permalink:"/docs/integrations/gitlab/discovery",draft:!1,unlisted:!1,editUrl:"https://github.com/backstage/backstage/edit/master/docs/../docs/integrations/gitlab/discovery.md",tags:[],version:"current",frontMatter:{id:"discovery",title:"GitLab Discovery",sidebar_label:"Discovery",description:"Automatically discovering catalog entities from repositories in GitLab"},sidebar:"docs",previous:{title:"Locations",permalink:"/docs/integrations/gitlab/locations"},next:{title:"Org Data",permalink:"/docs/integrations/gitlab/org"}},l={},c=[{value:"Installation",id:"installation",level:2},{value:"Installation with New Backend System",id:"installation-with-new-backend-system",level:3},{value:"Installation with Legacy Backend System",id:"installation-with-legacy-backend-system",level:3},{value:"Installation without Events Support",id:"installation-without-events-support",level:4},{value:"Installation with Events Support",id:"installation-with-events-support",level:4},{value:"Configuration",id:"configuration",level:2},{value:"Alternative processor",id:"alternative-processor",level:2}];function u(e){const t={a:"a",admonition:"admonition",code:"code",h2:"h2",h3:"h3",h4:"h4",li:"li",p:"p",pre:"pre",ul:"ul",...(0,i.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.p,{children:"The GitLab integration has a special entity provider for discovering catalog\nentities from GitLab. The entity provider will crawl the GitLab instance and register\nentities matching the configured paths. This can be useful as an alternative to\nstatic locations or manually adding things to the catalog."}),"\n",(0,r.jsxs)(t.p,{children:["This provider can also be configured to ingest GitLab data based on ",(0,r.jsx)(t.a,{href:"https://docs.gitlab.com/ee/user/project/integrations/webhooks.html#configure-a-webhook-in-gitlab",children:"GitLab Webhooks"}),". The events currently accepted are:"]}),"\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsxs)(t.li,{children:[(0,r.jsx)(t.a,{href:"https://docs.gitlab.com/ee/user/project/integrations/webhook_events.html#push-events",children:(0,r.jsx)(t.code,{children:"push"})}),"."]}),"\n"]}),"\n",(0,r.jsx)(t.h2,{id:"installation",children:"Installation"}),"\n",(0,r.jsx)(t.p,{children:"As this provider is not one of the default providers, you will first need to install\nthe gitlab catalog plugin:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-bash",metastring:'title="From your Backstage root directory"',children:"yarn --cwd packages/backend add @backstage/plugin-catalog-backend-module-gitlab\n"})}),"\n",(0,r.jsx)(t.h3,{id:"installation-with-new-backend-system",children:"Installation with New Backend System"}),"\n",(0,r.jsx)(t.p,{children:"Then add the following to your backend initialization:"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",metastring:'title="packages/backend/src/index.ts',children:"// optional if you want HTTP endpoints to receive external events\n// backend.add(import('@backstage/plugin-events-backend/alpha'));\n// optional if you want to use AWS SQS instead of HTTP endpoints to receive external events\n// backend.add(import('@backstage/plugin-events-backend-module-aws-sqs/alpha'));\n// optional - event router for gitlab. See.: https://github.com/backstage/backstage/blob/master/plugins/events-backend-module-gitlab/README.md\n// backend.add(eventsModuleGitlabEventRouter());\n// optional - token validator for the gitlab topic\n// backend.add(eventsModuleGitlabWebhook());\nbackend.add(import('@backstage/plugin-catalog-backend-module-gitlab/alpha'));\n"})}),"\n",(0,r.jsx)(t.p,{children:"You need to decide how you want to receive events from external sources like"}),"\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsx)(t.li,{children:(0,r.jsx)(t.a,{href:"https://github.com/backstage/backstage/blob/master/plugins/events-backend/README.md#configuration",children:"via HTTP endpoint"})}),"\n",(0,r.jsx)(t.li,{children:(0,r.jsx)(t.a,{href:"https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-aws-sqs/README.md",children:"via an AWS SQS queue"})}),"\n"]}),"\n",(0,r.jsx)(t.p,{children:"Further documentation:"}),"\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsx)(t.li,{children:(0,r.jsx)(t.a,{href:"https://github.com/backstage/backstage/tree/master/plugins/events-backend/README.md",children:"Events Plugin"})}),"\n",(0,r.jsx)(t.li,{children:(0,r.jsx)(t.a,{href:"https://github.com/backstage/backstage/blob/master/plugins/events-backend-module-gitlab/README.md",children:"GitLab Module for the Events Plugin"})}),"\n"]}),"\n",(0,r.jsx)(t.h3,{id:"installation-with-legacy-backend-system",children:"Installation with Legacy Backend System"}),"\n",(0,r.jsx)(t.h4,{id:"installation-without-events-support",children:"Installation without Events Support"}),"\n",(0,r.jsxs)(t.p,{children:["Add the segment below to ",(0,r.jsx)(t.code,{children:"packages/backend/src/plugins/catalog.ts"}),":"]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",metastring:'title="packages/backend/src/plugins/catalog.ts"',children:"/* highlight-add-next-line */\nimport { GitlabDiscoveryEntityProvider } from '@backstage/plugin-catalog-backend-module-gitlab';\n\nexport default async function createPlugin(\n  env: PluginEnvironment,\n): Promise<Router> {\n  const builder = await CatalogBuilder.create(env);\n  /* highlight-add-start */\n  builder.addEntityProvider(\n    ...GitlabDiscoveryEntityProvider.fromConfig(env.config, {\n      logger: env.logger,\n      // optional: alternatively, use scheduler with schedule defined in app-config.yaml\n      schedule: env.scheduler.createScheduledTaskRunner({\n        frequency: { minutes: 30 },\n        timeout: { minutes: 3 },\n      }),\n      // optional: alternatively, use schedule\n      scheduler: env.scheduler,\n    }),\n  );\n  /* highlight-add-end */\n  // ..\n}\n"})}),"\n",(0,r.jsx)(t.h4,{id:"installation-with-events-support",children:"Installation with Events Support"}),"\n",(0,r.jsx)(t.p,{children:"Please follow the installation instructions at"}),"\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsx)(t.li,{children:(0,r.jsx)(t.a,{href:"https://github.com/backstage/backstage/tree/master/plugins/events-backend/README.md",children:"Events Plugin"})}),"\n",(0,r.jsx)(t.li,{children:(0,r.jsx)(t.a,{href:"https://github.com/backstage/backstage/blob/master/plugins/events-backend-module-gitlab/README.md",children:"GitLab Module for the Events Plugin"})}),"\n"]}),"\n",(0,r.jsx)(t.p,{children:"Additionally, you need to decide how you want to receive events from external sources like"}),"\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsx)(t.li,{children:(0,r.jsx)(t.a,{href:"https://github.com/backstage/backstage/tree/master/plugins/events-backend/README.md",children:"via HTTP endpoint"})}),"\n",(0,r.jsx)(t.li,{children:(0,r.jsx)(t.a,{href:"https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-aws-sqs/README.md",children:"via an AWS SQS queue"})}),"\n"]}),"\n",(0,r.jsx)(t.p,{children:"Set up your provider"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",metastring:'title="packages/backend/src/plugins/catalog.ts"',children:"import { CatalogBuilder } from '@backstage/plugin-catalog-backend';\n/* highlight-add-next-line */\nimport { GitlabDiscoveryEntityProvider } from '@backstage/plugin-catalog-backend-module-gitlab';\nimport { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';\nimport { Router } from 'express';\nimport { PluginEnvironment } from '../types';\n\nexport default async function createPlugin(\n  env: PluginEnvironment,\n): Promise<Router> {\n  const builder = await CatalogBuilder.create(env);\n  builder.addProcessor(new ScaffolderEntitiesProcessor());\n  /* highlight-add-start */\n  const gitlabProvider = GitlabDiscoveryEntityProvider.fromConfig(env.config, {\n    logger: env.logger,\n    // optional: alternatively, use scheduler with schedule defined in app-config.yaml\n    schedule: env.scheduler.createScheduledTaskRunner({\n      frequency: { minutes: 30 },\n      timeout: { minutes: 3 },\n    }),\n    // optional: alternatively, use schedule\n    scheduler: env.scheduler,\n    events: env.events,\n  });\n  builder.addEntityProvider(gitlabProvider);\n  /* highlight-add-end */\n  const { processingEngine, router } = await builder.build();\n  await processingEngine.start();\n  return router;\n}\n"})}),"\n",(0,r.jsx)(t.h2,{id:"configuration",children:"Configuration"}),"\n",(0,r.jsxs)(t.p,{children:["To use the discovery provider, you'll need a GitLab integration\n",(0,r.jsx)(t.a,{href:"/docs/integrations/gitlab/locations",children:"set up"})," with a ",(0,r.jsx)(t.code,{children:"token"}),". Then you can add a provider config per group\nto the catalog configuration."]}),"\n",(0,r.jsx)(t.admonition,{title:"Note",type:"note",children:(0,r.jsxs)(t.p,{children:["If you are using the New Backend System, the ",(0,r.jsx)(t.code,{children:"schedule"})," has to be setup in the config, as shown below."]})}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-yaml",metastring:'title="app-config.yaml"',children:'catalog:\n  providers:\n    gitlab:\n      yourProviderId:\n        host: gitlab-host # Identifies one of the hosts set up in the integrations\n        branch: main # Optional. Used to discover on a specific branch\n        fallbackBranch: master # Optional. Fallback to be used if there is no default branch configured at the Gitlab repository. It is only used, if `branch` is undefined. Uses `master` as default\n        skipForkedRepos: false # Optional. If the project is a fork, skip repository\n        group: example-group # Optional. Group and subgroup (if needed) to look for repositories. If not present the whole instance will be scanned\n        entityFilename: catalog-info.yaml # Optional. Defaults to `catalog-info.yaml`\n        projectPattern: \'[\\s\\S]*\' # Optional. Filters found projects based on provided patter. Defaults to `[\\s\\S]*`, which means to not filter anything\n        schedule: # Same options as in TaskScheduleDefinition. Optional for the Legacy Backend System\n          # supports cron, ISO duration, "human duration" as used in code\n          frequency: { minutes: 30 }\n          # supports ISO duration, "human duration" as used in code\n          timeout: { minutes: 3 }\n'})}),"\n",(0,r.jsx)(t.h2,{id:"alternative-processor",children:"Alternative processor"}),"\n",(0,r.jsxs)(t.p,{children:["As alternative to the entity provider ",(0,r.jsx)(t.code,{children:"GitlabDiscoveryEntityProvider"}),"\nyou can still use the ",(0,r.jsx)(t.code,{children:"GitLabDiscoveryProcessor"}),"."]}),"\n",(0,r.jsxs)(t.p,{children:["Note the ",(0,r.jsx)(t.code,{children:"gitlab-discovery"})," type, as this is not a regular ",(0,r.jsx)(t.code,{children:"url"})," processor."]}),"\n",(0,r.jsx)(t.p,{children:"The target is composed of three parts:"}),"\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsxs)(t.li,{children:["The base URL, ",(0,r.jsx)(t.code,{children:"https://gitlab.com"})," in this case"]}),"\n",(0,r.jsxs)(t.li,{children:["The group path, ",(0,r.jsx)(t.code,{children:"group/subgroup"})," in this case. This is optional: If you omit\nthis path the processor will scan the entire GitLab instance instead."]}),"\n",(0,r.jsxs)(t.li,{children:["The path within each repository to find the catalog YAML file. This will\nusually be ",(0,r.jsx)(t.code,{children:"/blob/main/catalog-info.yaml"}),", ",(0,r.jsx)(t.code,{children:"/blob/master/catalog-info.yaml"})," or\na similar variation for catalog files stored in the root directory of each\nrepository. If you want to use the repository's default branch use the ",(0,r.jsx)(t.code,{children:"*"}),"\nwildcard, e.g.: ",(0,r.jsx)(t.code,{children:"/blob/*/catalog-info.yaml"})]}),"\n"]}),"\n",(0,r.jsx)(t.p,{children:"Finally, you will have to add the processor in the catalog initialization code\nof your backend."}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-ts",metastring:'title="packages/backend/src/plugins/catalog.ts"',children:"/* highlight-add-next-line */\nimport { GitLabDiscoveryProcessor } from '@backstage/plugin-catalog-backend-module-gitlab';\n\nexport default async function createPlugin(\n  env: PluginEnvironment,\n): Promise<Router> {\n  const builder = await CatalogBuilder.create(env);\n  /* highlight-add-start */\n  builder.addProcessor(\n    GitLabDiscoveryProcessor.fromConfig(env.config, { logger: env.logger }),\n  );\n  /* highlight-add-end */\n\n  // ..\n}\n"})}),"\n",(0,r.jsx)(t.p,{children:"And add the following to your app-config.yaml"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-yaml",children:"catalog:\n  locations:\n    - type: gitlab-discovery\n      target: https://gitlab.com/group/subgroup/blob/main/catalog-info.yaml\n"})}),"\n",(0,r.jsxs)(t.p,{children:["If you don't want create location object if file with component definition do not exists in project, you can set the ",(0,r.jsx)(t.code,{children:"skipReposWithoutExactFileMatch"})," option. That can reduce count of request to gitlab with 404 status code."]}),"\n",(0,r.jsxs)(t.p,{children:["If you don't want to create location object if the project is a fork, you can set the ",(0,r.jsx)(t.code,{children:"skipForkedRepos"})," option."]})]})}function d(e={}){const{wrapper:t}={...(0,i.a)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(u,{...e})}):u(e)}},371426:(e,t,n)=>{var r=n(827378),i=Symbol.for("react.element"),o=Symbol.for("react.fragment"),a=Object.prototype.hasOwnProperty,s=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,l={key:!0,ref:!0,__self:!0,__source:!0};function c(e,t,n){var r,o={},c=null,u=null;for(r in void 0!==n&&(c=""+n),void 0!==t.key&&(c=""+t.key),void 0!==t.ref&&(u=t.ref),t)a.call(t,r)&&!l.hasOwnProperty(r)&&(o[r]=t[r]);if(e&&e.defaultProps)for(r in t=e.defaultProps)void 0===o[r]&&(o[r]=t[r]);return{$$typeof:i,type:e,key:c,ref:u,props:o,_owner:s.current}}t.Fragment=o,t.jsx=c,t.jsxs=c},541535:(e,t)=>{var n=Symbol.for("react.element"),r=Symbol.for("react.portal"),i=Symbol.for("react.fragment"),o=Symbol.for("react.strict_mode"),a=Symbol.for("react.profiler"),s=Symbol.for("react.provider"),l=Symbol.for("react.context"),c=Symbol.for("react.forward_ref"),u=Symbol.for("react.suspense"),d=Symbol.for("react.memo"),h=Symbol.for("react.lazy"),p=Symbol.iterator;var f={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},g=Object.assign,b={};function y(e,t,n){this.props=e,this.context=t,this.refs=b,this.updater=n||f}function m(){}function v(e,t,n){this.props=e,this.context=t,this.refs=b,this.updater=n||f}y.prototype.isReactComponent={},y.prototype.setState=function(e,t){if("object"!=typeof e&&"function"!=typeof e&&null!=e)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")},y.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")},m.prototype=y.prototype;var k=v.prototype=new m;k.constructor=v,g(k,y.prototype),k.isPureReactComponent=!0;var x=Array.isArray,j=Object.prototype.hasOwnProperty,w={current:null},E={key:!0,ref:!0,__self:!0,__source:!0};function _(e,t,r){var i,o={},a=null,s=null;if(null!=t)for(i in void 0!==t.ref&&(s=t.ref),void 0!==t.key&&(a=""+t.key),t)j.call(t,i)&&!E.hasOwnProperty(i)&&(o[i]=t[i]);var l=arguments.length-2;if(1===l)o.children=r;else if(1<l){for(var c=Array(l),u=0;u<l;u++)c[u]=arguments[u+2];o.children=c}if(e&&e.defaultProps)for(i in l=e.defaultProps)void 0===o[i]&&(o[i]=l[i]);return{$$typeof:n,type:e,key:a,ref:s,props:o,_owner:w.current}}function S(e){return"object"==typeof e&&null!==e&&e.$$typeof===n}var P=/\/+/g;function R(e,t){return"object"==typeof e&&null!==e&&null!=e.key?function(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,(function(e){return t[e]}))}(""+e.key):t.toString(36)}function T(e,t,i,o,a){var s=typeof e;"undefined"!==s&&"boolean"!==s||(e=null);var l=!1;if(null===e)l=!0;else switch(s){case"string":case"number":l=!0;break;case"object":switch(e.$$typeof){case n:case r:l=!0}}if(l)return a=a(l=e),e=""===o?"."+R(l,0):o,x(a)?(i="",null!=e&&(i=e.replace(P,"$&/")+"/"),T(a,t,i,"",(function(e){return e}))):null!=a&&(S(a)&&(a=function(e,t){return{$$typeof:n,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}(a,i+(!a.key||l&&l.key===a.key?"":(""+a.key).replace(P,"$&/")+"/")+e)),t.push(a)),1;if(l=0,o=""===o?".":o+":",x(e))for(var c=0;c<e.length;c++){var u=o+R(s=e[c],c);l+=T(s,t,i,u,a)}else if(u=function(e){return null===e||"object"!=typeof e?null:"function"==typeof(e=p&&e[p]||e["@@iterator"])?e:null}(e),"function"==typeof u)for(e=u.call(e),c=0;!(s=e.next()).done;)l+=T(s=s.value,t,i,u=o+R(s,c++),a);else if("object"===s)throw t=String(e),Error("Objects are not valid as a React child (found: "+("[object Object]"===t?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return l}function C(e,t,n){if(null==e)return e;var r=[],i=0;return T(e,r,"","",(function(e){return t.call(n,e,i++)})),r}function D(e){if(-1===e._status){var t=e._result;(t=t()).then((function(t){0!==e._status&&-1!==e._status||(e._status=1,e._result=t)}),(function(t){0!==e._status&&-1!==e._status||(e._status=2,e._result=t)})),-1===e._status&&(e._status=0,e._result=t)}if(1===e._status)return e._result.default;throw e._result}var I={current:null},L={transition:null},O={ReactCurrentDispatcher:I,ReactCurrentBatchConfig:L,ReactCurrentOwner:w};t.Children={map:C,forEach:function(e,t,n){C(e,(function(){t.apply(this,arguments)}),n)},count:function(e){var t=0;return C(e,(function(){t++})),t},toArray:function(e){return C(e,(function(e){return e}))||[]},only:function(e){if(!S(e))throw Error("React.Children.only expected to receive a single React element child.");return e}},t.Component=y,t.Fragment=i,t.Profiler=a,t.PureComponent=v,t.StrictMode=o,t.Suspense=u,t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=O,t.cloneElement=function(e,t,r){if(null==e)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var i=g({},e.props),o=e.key,a=e.ref,s=e._owner;if(null!=t){if(void 0!==t.ref&&(a=t.ref,s=w.current),void 0!==t.key&&(o=""+t.key),e.type&&e.type.defaultProps)var l=e.type.defaultProps;for(c in t)j.call(t,c)&&!E.hasOwnProperty(c)&&(i[c]=void 0===t[c]&&void 0!==l?l[c]:t[c])}var c=arguments.length-2;if(1===c)i.children=r;else if(1<c){l=Array(c);for(var u=0;u<c;u++)l[u]=arguments[u+2];i.children=l}return{$$typeof:n,type:e.type,key:o,ref:a,props:i,_owner:s}},t.createContext=function(e){return(e={$$typeof:l,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null}).Provider={$$typeof:s,_context:e},e.Consumer=e},t.createElement=_,t.createFactory=function(e){var t=_.bind(null,e);return t.type=e,t},t.createRef=function(){return{current:null}},t.forwardRef=function(e){return{$$typeof:c,render:e}},t.isValidElement=S,t.lazy=function(e){return{$$typeof:h,_payload:{_status:-1,_result:e},_init:D}},t.memo=function(e,t){return{$$typeof:d,type:e,compare:void 0===t?null:t}},t.startTransition=function(e){var t=L.transition;L.transition={};try{e()}finally{L.transition=t}},t.unstable_act=function(){throw Error("act(...) is not supported in production builds of React.")},t.useCallback=function(e,t){return I.current.useCallback(e,t)},t.useContext=function(e){return I.current.useContext(e)},t.useDebugValue=function(){},t.useDeferredValue=function(e){return I.current.useDeferredValue(e)},t.useEffect=function(e,t){return I.current.useEffect(e,t)},t.useId=function(){return I.current.useId()},t.useImperativeHandle=function(e,t,n){return I.current.useImperativeHandle(e,t,n)},t.useInsertionEffect=function(e,t){return I.current.useInsertionEffect(e,t)},t.useLayoutEffect=function(e,t){return I.current.useLayoutEffect(e,t)},t.useMemo=function(e,t){return I.current.useMemo(e,t)},t.useReducer=function(e,t,n){return I.current.useReducer(e,t,n)},t.useRef=function(e){return I.current.useRef(e)},t.useState=function(e){return I.current.useState(e)},t.useSyncExternalStore=function(e,t,n){return I.current.useSyncExternalStore(e,t,n)},t.useTransition=function(){return I.current.useTransition()},t.version="18.2.0"},827378:(e,t,n)=>{e.exports=n(541535)},824246:(e,t,n)=>{e.exports=n(371426)},511151:(e,t,n)=>{n.d(t,{Z:()=>s,a:()=>a});var r=n(667294);const i={},o=r.createContext(i);function a(e){const t=r.useContext(o);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function s(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:a(e.components),r.createElement(o.Provider,{value:t},e.children)}}}]);