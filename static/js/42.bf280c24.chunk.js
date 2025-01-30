"use strict";(self.webpackChunkairspeak=self.webpackChunkairspeak||[]).push([[42],{3336:(e,t,n)=>{n.d(t,{A:()=>w});var o=n(8587),r=n(8168),a=n(5043),i=n(8387),l=n(8610),c=n(7266),u=n(4535);const s=e=>{let t;return t=e<1?5.11916*e**2:4.5*Math.log(e+1)+2,(t/100).toFixed(2)};var d=n(8206),v=n(2532),f=n(2372);function m(e){return(0,f.Ay)("MuiPaper",e)}(0,v.A)("MuiPaper",["root","rounded","outlined","elevation","elevation0","elevation1","elevation2","elevation3","elevation4","elevation5","elevation6","elevation7","elevation8","elevation9","elevation10","elevation11","elevation12","elevation13","elevation14","elevation15","elevation16","elevation17","elevation18","elevation19","elevation20","elevation21","elevation22","elevation23","elevation24"]);var h=n(579);const A=["className","component","elevation","square","variant"],p=(0,u.Ay)("div",{name:"MuiPaper",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[t.root,t[n.variant],!n.square&&t.rounded,"elevation"===n.variant&&t["elevation".concat(n.elevation)]]}})((e=>{let{theme:t,ownerState:n}=e;var o;return(0,r.A)({backgroundColor:(t.vars||t).palette.background.paper,color:(t.vars||t).palette.text.primary,transition:t.transitions.create("box-shadow")},!n.square&&{borderRadius:t.shape.borderRadius},"outlined"===n.variant&&{border:"1px solid ".concat((t.vars||t).palette.divider)},"elevation"===n.variant&&(0,r.A)({boxShadow:(t.vars||t).shadows[n.elevation]},!t.vars&&"dark"===t.palette.mode&&{backgroundImage:"linear-gradient(".concat((0,c.X4)("#fff",s(n.elevation)),", ").concat((0,c.X4)("#fff",s(n.elevation)),")")},t.vars&&{backgroundImage:null==(o=t.vars.overlays)?void 0:o[n.elevation]}))})),w=a.forwardRef((function(e,t){const n=(0,d.b)({props:e,name:"MuiPaper"}),{className:a,component:c="div",elevation:u=1,square:s=!1,variant:v="elevation"}=n,f=(0,o.A)(n,A),w=(0,r.A)({},n,{component:c,elevation:u,square:s,variant:v}),y=(e=>{const{square:t,elevation:n,variant:o,classes:r}=e,a={root:["root",o,!t&&"rounded","elevation"===o&&"elevation".concat(n)]};return(0,l.A)(a,m,r)})(w);return(0,h.jsx)(p,(0,r.A)({as:c,ownerState:w,className:(0,i.A)(y.root,a),ref:t},f))}))},9662:(e,t,n)=>{n.d(t,{A:()=>y});var o=n(8168),r=n(5043),a=n(8587),i=n(8387),l=n(8610),c=n(6803),u=n(8206),s=n(4535),d=n(2532),v=n(2372);function f(e){return(0,v.Ay)("MuiSvgIcon",e)}(0,d.A)("MuiSvgIcon",["root","colorPrimary","colorSecondary","colorAction","colorError","colorDisabled","fontSizeInherit","fontSizeSmall","fontSizeMedium","fontSizeLarge"]);var m=n(579);const h=["children","className","color","component","fontSize","htmlColor","inheritViewBox","titleAccess","viewBox"],A=(0,s.Ay)("svg",{name:"MuiSvgIcon",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[t.root,"inherit"!==n.color&&t["color".concat((0,c.A)(n.color))],t["fontSize".concat((0,c.A)(n.fontSize))]]}})((e=>{let{theme:t,ownerState:n}=e;var o,r,a,i,l,c,u,s,d,v,f,m,h;return{userSelect:"none",width:"1em",height:"1em",display:"inline-block",fill:n.hasSvgAsChild?void 0:"currentColor",flexShrink:0,transition:null==(o=t.transitions)||null==(r=o.create)?void 0:r.call(o,"fill",{duration:null==(a=t.transitions)||null==(a=a.duration)?void 0:a.shorter}),fontSize:{inherit:"inherit",small:(null==(i=t.typography)||null==(l=i.pxToRem)?void 0:l.call(i,20))||"1.25rem",medium:(null==(c=t.typography)||null==(u=c.pxToRem)?void 0:u.call(c,24))||"1.5rem",large:(null==(s=t.typography)||null==(d=s.pxToRem)?void 0:d.call(s,35))||"2.1875rem"}[n.fontSize],color:null!=(v=null==(f=(t.vars||t).palette)||null==(f=f[n.color])?void 0:f.main)?v:{action:null==(m=(t.vars||t).palette)||null==(m=m.action)?void 0:m.active,disabled:null==(h=(t.vars||t).palette)||null==(h=h.action)?void 0:h.disabled,inherit:void 0}[n.color]}})),p=r.forwardRef((function(e,t){const n=(0,u.b)({props:e,name:"MuiSvgIcon"}),{children:s,className:d,color:v="inherit",component:p="svg",fontSize:w="medium",htmlColor:y,inheritViewBox:S=!1,titleAccess:g,viewBox:b="0 0 24 24"}=n,x=(0,a.A)(n,h),E=r.isValidElement(s)&&"svg"===s.type,R=(0,o.A)({},n,{color:v,component:p,fontSize:w,instanceFontSize:e.fontSize,inheritViewBox:S,viewBox:b,hasSvgAsChild:E}),k={};S||(k.viewBox=b);const I=(e=>{const{color:t,fontSize:n,classes:o}=e,r={root:["root","inherit"!==t&&"color".concat((0,c.A)(t)),"fontSize".concat((0,c.A)(n))]};return(0,l.A)(r,f,o)})(R);return(0,m.jsxs)(A,(0,o.A)({as:p,className:(0,i.A)(I.root,d),focusable:"false",color:y,"aria-hidden":!g||void 0,role:g?"img":void 0,ref:t},k,x,E&&s.props,{ownerState:R,children:[E?s.props.children:s,g?(0,m.jsx)("title",{children:g}):null]}))}));p.muiName="SvgIcon";const w=p;function y(e,t){function n(n,r){return(0,m.jsx)(w,(0,o.A)({"data-testid":"".concat(t,"Icon"),ref:r},n,{children:e}))}return n.muiName=w.muiName,r.memo(r.forwardRef(n))}},950:(e,t,n)=>{n.d(t,{A:()=>o});const o=n(3468).A},7328:(e,t,n)=>{n.d(t,{A:()=>r});var o=n(5043);const r=function(e,t){var n,r;return o.isValidElement(e)&&-1!==t.indexOf(null!=(n=e.type.muiName)?n:null==(r=e.type)||null==(r=r._payload)||null==(r=r.value)?void 0:r.muiName)}},2427:(e,t,n)=>{n.d(t,{A:()=>o});const o=n(1668).A},6078:(e,t,n)=>{n.d(t,{A:()=>o});const o=n(3940).A},5420:(e,t,n)=>{n.d(t,{A:()=>r});var o=n(5043);const r=function(e){let{controlled:t,default:n,name:r,state:a="value"}=e;const{current:i}=o.useRef(void 0!==t),[l,c]=o.useState(n);return[i?t:l,o.useCallback((e=>{i||c(e)}),[])]}},5013:(e,t,n)=>{n.d(t,{A:()=>o});const o=n(4440).A},3319:(e,t,n)=>{n.d(t,{A:()=>o});const o=n(1782).A},5849:(e,t,n)=>{n.d(t,{A:()=>o});const o=n(3462).A},3574:(e,t,n)=>{n.d(t,{A:()=>f});var o=n(5043),r=n(9303);let a=!0,i=!1;const l=new r.E,c={text:!0,search:!0,url:!0,tel:!0,email:!0,password:!0,number:!0,date:!0,month:!0,week:!0,time:!0,datetime:!0,"datetime-local":!0};function u(e){e.metaKey||e.altKey||e.ctrlKey||(a=!0)}function s(){a=!1}function d(){"hidden"===this.visibilityState&&i&&(a=!0)}function v(e){const{target:t}=e;try{return t.matches(":focus-visible")}catch(n){}return a||function(e){const{type:t,tagName:n}=e;return!("INPUT"!==n||!c[t]||e.readOnly)||"TEXTAREA"===n&&!e.readOnly||!!e.isContentEditable}(t)}const f=function(){const e=o.useCallback((e=>{var t;null!=e&&((t=e.ownerDocument).addEventListener("keydown",u,!0),t.addEventListener("mousedown",s,!0),t.addEventListener("pointerdown",s,!0),t.addEventListener("touchstart",s,!0),t.addEventListener("visibilitychange",d,!0))}),[]),t=o.useRef(!1);return{isFocusVisibleRef:t,onFocus:function(e){return!!v(e)&&(t.current=!0,!0)},onBlur:function(){return!!t.current&&(i=!0,l.start(100,(()=>{i=!1})),t.current=!1,!0)},ref:e}}},2456:(e,t,n)=>{function o(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return t.reduce(((e,t)=>null==t?e:function(){for(var n=arguments.length,o=new Array(n),r=0;r<n;r++)o[r]=arguments[r];e.apply(this,o),t.apply(this,o)}),(()=>{}))}n.d(t,{A:()=>o})},3468:(e,t,n)=>{function o(e){let t,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:166;function o(){for(var o=arguments.length,r=new Array(o),a=0;a<o;a++)r[a]=arguments[a];clearTimeout(t),t=setTimeout((()=>{e.apply(this,r)}),n)}return o.clear=()=>{clearTimeout(t)},o}n.d(t,{A:()=>o})},1668:(e,t,n)=>{function o(e){return e&&e.ownerDocument||document}n.d(t,{A:()=>o})},3940:(e,t,n)=>{n.d(t,{A:()=>r});var o=n(1668);function r(e){return(0,o.A)(e).defaultView||window}},6564:(e,t,n)=>{function o(e,t){"function"===typeof e?e(t):e&&(e.current=t)}n.d(t,{A:()=>o})},4440:(e,t,n)=>{n.d(t,{A:()=>r});var o=n(5043);const r="undefined"!==typeof window?o.useLayoutEffect:o.useEffect},1782:(e,t,n)=>{n.d(t,{A:()=>a});var o=n(5043),r=n(4440);const a=function(e){const t=o.useRef(e);return(0,r.A)((()=>{t.current=e})),o.useRef((function(){return(0,t.current)(...arguments)})).current}},3462:(e,t,n)=>{n.d(t,{A:()=>a});var o=n(5043),r=n(6564);function a(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return o.useMemo((()=>t.every((e=>null==e))?null:e=>{t.forEach((t=>{(0,r.A)(t,e)}))}),t)}},5844:(e,t,n)=>{var o;n.d(t,{A:()=>l});var r=n(5043);let a=0;const i=(o||(o=n.t(r,2)))["useId".toString()];function l(e){if(void 0!==i){const t=i();return null!=e?e:t}return function(e){const[t,n]=r.useState(e),o=e||t;return r.useEffect((()=>{null==t&&(a+=1,n("mui-".concat(a)))}),[t]),o}(e)}},9303:(e,t,n)=>{n.d(t,{E:()=>i,A:()=>l});var o=n(5043);const r={};const a=[];class i{constructor(){this.currentId=null,this.clear=()=>{null!==this.currentId&&(clearTimeout(this.currentId),this.currentId=null)},this.disposeEffect=()=>this.clear}static create(){return new i}start(e,t){this.clear(),this.currentId=setTimeout((()=>{this.currentId=null,t()}),e)}}function l(){const e=function(e,t){const n=o.useRef(r);return n.current===r&&(n.current=e(t)),n}(i.create).current;var t;return t=e.disposeEffect,o.useEffect(t,a),e}}}]);
//# sourceMappingURL=42.bf280c24.chunk.js.map