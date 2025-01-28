"use strict";(self.webpackChunkairspeak=self.webpackChunkairspeak||[]).push([[403],{7403:(e,t,r)=>{r.r(t),r.d(t,{default:()=>K});var o=r(2555),a=r(5043),n=r(3336),l=r(6672),s=r(4150),i=r(5865),c=r(8587),d=r(8168),p=r(8387),m=r(8610),u=r(7266),A=r(4535),h=r(8206),g=r(3462),v=r(5006),x=r(6004),f=r(9523);const y=["className","elementType","ownerState","externalForwardedProps","getSlotOwnerState","internalForwardedProps"],j=["component","slots","slotProps"],b=["component"];function S(e,t){const{className:r,elementType:o,ownerState:a,externalForwardedProps:n,getSlotOwnerState:l,internalForwardedProps:s}=t,i=(0,c.A)(t,y),{component:p,slots:m={[e]:void 0},slotProps:u={[e]:void 0}}=n,A=(0,c.A)(n,j),h=m[e]||o,S=(0,x.A)(u[e],a),C=(0,f.A)((0,d.A)({className:r},i,{externalForwardedProps:"root"===e?A:void 0,externalSlotProps:S})),{props:{component:M},internalRef:w}=C,k=(0,c.A)(C.props,b),P=(0,g.A)(w,null==S?void 0:S.ref,t.ref),z=l?l(k):{},W=(0,d.A)({},a,z),I="root"===e?M||p:M,L=(0,v.A)(h,(0,d.A)({},"root"===e&&!p&&!m[e]&&s,"root"!==e&&!m[e]&&s,k,I&&{as:I},{ref:P}),W);return Object.keys(z).forEach((e=>{delete L[e]})),[h,L]}var C=r(6803),M=r(2532),w=r(2372);function k(e){return(0,w.Ay)("MuiAlert",e)}const P=(0,M.A)("MuiAlert",["root","action","icon","message","filled","colorSuccess","colorInfo","colorWarning","colorError","filledSuccess","filledInfo","filledWarning","filledError","outlined","outlinedSuccess","outlinedInfo","outlinedWarning","outlinedError","standard","standardSuccess","standardInfo","standardWarning","standardError"]);var z=r(7392),W=r(9662),I=r(579);const L=(0,W.A)((0,I.jsx)("path",{d:"M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.76,4 13.5,4.11 14.2, 4.31L15.77,2.74C14.61,2.26 13.34,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0, 0 22,12M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z"}),"SuccessOutlined"),O=(0,W.A)((0,I.jsx)("path",{d:"M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"}),"ReportProblemOutlined"),F=(0,W.A)((0,I.jsx)("path",{d:"M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"}),"ErrorOutline"),N=(0,W.A)((0,I.jsx)("path",{d:"M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20, 12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10, 10 0 0,0 12,2M11,17H13V11H11V17Z"}),"InfoOutlined"),R=(0,W.A)((0,I.jsx)("path",{d:"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"}),"Close"),T=["action","children","className","closeText","color","components","componentsProps","icon","iconMapping","onClose","role","severity","slotProps","slots","variant"],E=(0,A.Ay)(n.A,{name:"MuiAlert",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:r}=e;return[t.root,t[r.variant],t["".concat(r.variant).concat((0,C.A)(r.color||r.severity))]]}})((e=>{let{theme:t}=e;const r="light"===t.palette.mode?u.e$:u.a,o="light"===t.palette.mode?u.a:u.e$;return(0,d.A)({},t.typography.body2,{backgroundColor:"transparent",display:"flex",padding:"6px 16px",variants:[...Object.entries(t.palette).filter((e=>{let[,t]=e;return t.main&&t.light})).map((e=>{let[a]=e;return{props:{colorSeverity:a,variant:"standard"},style:{color:t.vars?t.vars.palette.Alert["".concat(a,"Color")]:r(t.palette[a].light,.6),backgroundColor:t.vars?t.vars.palette.Alert["".concat(a,"StandardBg")]:o(t.palette[a].light,.9),["& .".concat(P.icon)]:t.vars?{color:t.vars.palette.Alert["".concat(a,"IconColor")]}:{color:t.palette[a].main}}}})),...Object.entries(t.palette).filter((e=>{let[,t]=e;return t.main&&t.light})).map((e=>{let[o]=e;return{props:{colorSeverity:o,variant:"outlined"},style:{color:t.vars?t.vars.palette.Alert["".concat(o,"Color")]:r(t.palette[o].light,.6),border:"1px solid ".concat((t.vars||t).palette[o].light),["& .".concat(P.icon)]:t.vars?{color:t.vars.palette.Alert["".concat(o,"IconColor")]}:{color:t.palette[o].main}}}})),...Object.entries(t.palette).filter((e=>{let[,t]=e;return t.main&&t.dark})).map((e=>{let[r]=e;return{props:{colorSeverity:r,variant:"filled"},style:(0,d.A)({fontWeight:t.typography.fontWeightMedium},t.vars?{color:t.vars.palette.Alert["".concat(r,"FilledColor")],backgroundColor:t.vars.palette.Alert["".concat(r,"FilledBg")]}:{backgroundColor:"dark"===t.palette.mode?t.palette[r].dark:t.palette[r].main,color:t.palette.getContrastText(t.palette[r].main)})}}))]})})),B=(0,A.Ay)("div",{name:"MuiAlert",slot:"Icon",overridesResolver:(e,t)=>t.icon})({marginRight:12,padding:"7px 0",display:"flex",fontSize:22,opacity:.9}),H=(0,A.Ay)("div",{name:"MuiAlert",slot:"Message",overridesResolver:(e,t)=>t.message})({padding:"8px 0",minWidth:0,overflow:"auto"}),q=(0,A.Ay)("div",{name:"MuiAlert",slot:"Action",overridesResolver:(e,t)=>t.action})({display:"flex",alignItems:"flex-start",padding:"4px 0 0 16px",marginLeft:"auto",marginRight:-8}),V={success:(0,I.jsx)(L,{fontSize:"inherit"}),warning:(0,I.jsx)(O,{fontSize:"inherit"}),error:(0,I.jsx)(F,{fontSize:"inherit"}),info:(0,I.jsx)(N,{fontSize:"inherit"})},U=a.forwardRef((function(e,t){const r=(0,h.b)({props:e,name:"MuiAlert"}),{action:o,children:a,className:n,closeText:l="Close",color:s,components:i={},componentsProps:u={},icon:A,iconMapping:g=V,onClose:v,role:x="alert",severity:f="success",slotProps:y={},slots:j={},variant:b="standard"}=r,M=(0,c.A)(r,T),w=(0,d.A)({},r,{color:s,severity:f,variant:b,colorSeverity:s||f}),P=(e=>{const{variant:t,color:r,severity:o,classes:a}=e,n={root:["root","color".concat((0,C.A)(r||o)),"".concat(t).concat((0,C.A)(r||o)),"".concat(t)],icon:["icon"],message:["message"],action:["action"]};return(0,m.A)(n,k,a)})(w),W={slots:(0,d.A)({closeButton:i.CloseButton,closeIcon:i.CloseIcon},j),slotProps:(0,d.A)({},u,y)},[L,O]=S("closeButton",{elementType:z.A,externalForwardedProps:W,ownerState:w}),[F,N]=S("closeIcon",{elementType:R,externalForwardedProps:W,ownerState:w});return(0,I.jsxs)(E,(0,d.A)({role:x,elevation:0,ownerState:w,className:(0,p.A)(P.root,n),ref:t},M,{children:[!1!==A?(0,I.jsx)(B,{ownerState:w,className:P.icon,children:A||g[f]||V[f]}):null,(0,I.jsx)(H,{ownerState:w,className:P.message,children:a}),null!=o?(0,I.jsx)(q,{ownerState:w,className:P.action,children:o}):null,null==o&&v?(0,I.jsx)(q,{ownerState:w,className:P.action,children:(0,I.jsx)(L,(0,d.A)({size:"small","aria-label":l,title:l,color:"inherit",onClick:v},O,{children:(0,I.jsx)(F,(0,d.A)({fontSize:"small"},N))}))}):null]}))}));var Z=r(8903),$=r(1906),D=r(6446);const G=(0,A.Ay)(n.A)((e=>{let{theme:t}=e;return{padding:t.spacing(4),backgroundColor:"rgba(36, 36, 68, 0.95)",backdropFilter:"blur(10px)",marginTop:t.spacing(4)}})),J=(0,A.Ay)(l.A)((e=>{let{theme:t}=e;return{"& .MuiOutlinedInput-root":{"& fieldset":{borderColor:"rgba(255, 255, 255, 0.23)"},"&:hover fieldset":{borderColor:t.palette.primary.main}}}})),K=()=>{const[e,t]=(0,a.useState)({name:"",email:"",subject:"",message:""}),[r,n]=(0,a.useState)(null),l=r=>{t((0,o.A)((0,o.A)({},e),{},{[r.target.name]:r.target.value}))};return(0,I.jsx)(s.A,{children:(0,I.jsxs)(G,{children:[(0,I.jsx)(i.A,{variant:"h4",gutterBottom:!0,align:"center",sx:{mb:4},children:"Contact Us"}),"success"===r&&(0,I.jsx)(U,{severity:"success",sx:{mb:3},children:"Thank you for your message! We'll get back to you soon."}),(0,I.jsx)("form",{onSubmit:e=>{e.preventDefault(),n("success"),t({name:"",email:"",subject:"",message:""})},children:(0,I.jsxs)(Z.Ay,{container:!0,spacing:3,children:[(0,I.jsx)(Z.Ay,{item:!0,xs:12,sm:6,children:(0,I.jsx)(J,{fullWidth:!0,label:"Name",name:"name",value:e.name,onChange:l,required:!0})}),(0,I.jsx)(Z.Ay,{item:!0,xs:12,sm:6,children:(0,I.jsx)(J,{fullWidth:!0,label:"Email",name:"email",type:"email",value:e.email,onChange:l,required:!0})}),(0,I.jsx)(Z.Ay,{item:!0,xs:12,children:(0,I.jsx)(J,{fullWidth:!0,label:"Subject",name:"subject",value:e.subject,onChange:l,required:!0})}),(0,I.jsx)(Z.Ay,{item:!0,xs:12,children:(0,I.jsx)(J,{fullWidth:!0,label:"Message",name:"message",multiline:!0,rows:4,value:e.message,onChange:l,required:!0})}),(0,I.jsx)(Z.Ay,{item:!0,xs:12,children:(0,I.jsx)($.A,{type:"submit",variant:"contained",color:"primary",size:"large",fullWidth:!0,children:"Send Message"})})]})}),(0,I.jsxs)(D.A,{mt:4,children:[(0,I.jsx)(i.A,{variant:"h6",gutterBottom:!0,children:"Other Ways to Reach Us"}),(0,I.jsxs)(i.A,{variant:"body1",paragraph:!0,children:["Email: airspeak@gmail.com",(0,I.jsx)("br",{}),"Hours: Monday - Friday, 9:00 AM - 5:00 PM (GMT)"]})]})]})})}}}]);
//# sourceMappingURL=403.8d1b0262.chunk.js.map