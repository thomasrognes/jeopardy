(this.webpackJsonpjeopardy=this.webpackJsonpjeopardy||[]).push([[0],[,,,,,,,,,,,,,,,function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},,,function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){"use strict";n.r(t);var c=n(1),a=n.n(c),s=n(4),o=n.n(s),r=(n(15),n(16),n(17),n(2)),i=n(8),j=n(6),l=(n(18),n(0)),d=Object(c.createContext)();function b(e){var t=e.children,n=Object(c.useState)([]),a=Object(r.a)(n,2),s={teams:a[0],setTeams:a[1]};return Object(l.jsx)(d.Provider,{value:s,children:t})}function u(){return Object(c.useContext)(d)}var O=n(10),m=n.n(O);n(21),n(22);function x(){return Object(l.jsxs)("svg",{viewBox:"0 0 10 10",className:"cross-icon",children:[Object(l.jsx)("line",{x1:"0",y1:"10",x2:"10",y2:"0",stroke:"currentColor",strokeWidth:"2"}),Object(l.jsx)("line",{x1:"0",y1:"0",x2:"10",y2:"10",stroke:"currentColor",strokeWidth:"2"})]})}function h(e){var t=e.title,c=e.hidden,a=e.onDialogToggle,s=e.children,r=e.strict,i=void 0!==r&&r,j=e.classNameForModal,d=n(9),b=document.getElementById("modal-root");if(!b)throw Error("Could not find he DOM element to render modal in.");return o.a.createPortal(Object(l.jsx)("div",{className:d("modal",j),children:Object(l.jsxs)(m.a,{className:"modal-content",hidden:c,strict:i,backdrop:!0,onDialogToggle:a,children:[Object(l.jsx)("h3",{className:"modal-title",children:t}),s,Object(l.jsx)("button",{onClick:a,className:"modal-close-button remove-button-style",children:Object(l.jsx)(x,{})})]})}),b)}function g(e){var t=Object(c.useState)(),a=Object(r.a)(t,2),s=a[0],o=a[1],d=Object(c.useState)(!1),b=Object(r.a)(d,2),O=b[0],m=b[1],x=Object(c.useState)(!1),g=Object(r.a)(x,2),f=g[0],v=g[1],k=Object(c.useState)(""),p=Object(r.a)(k,2),N=p[0],y=p[1],C=u(),S=C.teams,T=C.setTeams,F=n(9)({"score-button":!0,"score-button-disabled":O,"score-button-not-disabled":!O}),L=e.score,D=e.categoryName;return Object(l.jsxs)(l.Fragment,{children:[Object(l.jsx)("button",{className:F,onClick:function(){m(!0),v(!0)},disabled:O,children:L}),f&&Object(l.jsxs)(h,{title:"".concat(D," ").concat(L," poeng"),hidden:!1,onDialogToggle:function(){return v(!f)},children:[Object(l.jsxs)("div",{className:"select-component",children:[Object(l.jsx)("label",{htmlFor:"teams",children:"Velg laget som gjettet korrekt:"}),Object(l.jsxs)("select",{name:"teams",id:"teams",onChange:function(e){return o(e.target.value)},children:[Object(l.jsx)("option",{value:""}),S.map((function(e,t){return Object(l.jsx)("option",{value:e.name,children:e.name},t)}))]})]}),N&&Object(l.jsx)("span",{children:N}),Object(l.jsx)("button",{type:"button",className:"add-points-button",onClick:function(){if(void 0===s)return void y("P\xe5krevd felt.");var e=S.find((function(e){return e.name===s})),t=S.indexOf(e);if(void 0===e||-1===t)return void y("Laget finnes ikke.. Be Thomas skjerpe seg og skrive bedre kode for dette skal ikke skje.");var n=Object(j.a)(S);n[t]=Object(i.a)(Object(i.a)({},e),{},{score:e.score+L}),T(n),v(!1)},children:"Legg til poeng"})]})]})}n(23);function f(e){var t=e.name,n=Object(c.useState)(t),a=Object(r.a)(n,2),s=a[0];a[1];return Object(l.jsxs)("div",{className:"category",children:[Object(l.jsx)("h2",{children:s}),Object(l.jsx)(g,{score:100,categoryName:s}),Object(l.jsx)(g,{score:200,categoryName:s}),Object(l.jsx)(g,{score:300,categoryName:s}),Object(l.jsx)(g,{score:400,categoryName:s}),Object(l.jsx)(g,{score:500,categoryName:s})]})}n(24);function v(){return Object(l.jsxs)("div",{className:"board",children:[Object(l.jsx)(f,{name:"Sted"}),Object(l.jsx)(f,{name:"Tall"}),Object(l.jsx)(f,{name:"Mat og drikke"}),Object(l.jsx)(f,{name:"Tid"})]})}n(25);function k(){var e=u(),t=e.teams,n=e.setTeams,a=Object(c.useState)(!1),s=Object(r.a)(a,2),o=s[0],i=s[1],d=Object(c.useState)(""),b=Object(r.a)(d,2),O=b[0],m=b[1],x=Object(c.useState)(""),g=Object(r.a)(x,2),f=g[0],v=g[1];return Object(l.jsxs)("header",{className:"header",children:[Object(l.jsx)("div",{}),Object(l.jsx)("h1",{children:"Jeopardy"}),Object(l.jsx)("div",{className:"header-button-content",children:Object(l.jsx)("button",{className:"btn-primary btn-lg",onClick:function(){return i(!0)},children:"Legg til nytt lag"})}),o&&Object(l.jsxs)(h,{title:"Legg til lagnavn",hidden:!1,onDialogToggle:function(){return i(!o)},children:[Object(l.jsxs)("form",{className:"add-team-form",children:[Object(l.jsx)("label",{htmlFor:"name",children:"Lagnavn"}),Object(l.jsx)("input",{type:"text",id:"name",name:"Lagnavn",required:!0,onChange:function(e){m(e.target.value),v("")}}),Object(l.jsx)("span",{className:"error",children:f})]}),Object(l.jsx)("button",{className:"complete-button",onClick:function(){if(""===O)return void v("Lagnavn kan ikke v\xe6re tomt.");n([].concat(Object(j.a)(t),[{name:O,score:0}])),i(!1)},children:"Fullf\xf8r"})]})]})}var p=function(){return Object(l.jsxs)("div",{className:"App",children:[Object(l.jsx)(k,{}),Object(l.jsx)(v,{})]})},N=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,27)).then((function(t){var n=t.getCLS,c=t.getFID,a=t.getFCP,s=t.getLCP,o=t.getTTFB;n(e),c(e),a(e),s(e),o(e)}))};o.a.render(Object(l.jsx)(a.a.StrictMode,{children:Object(l.jsx)(b,{children:Object(l.jsx)(p,{})})}),document.getElementById("root")),N()}],[[26,1,2]]]);
//# sourceMappingURL=main.371b3ef8.chunk.js.map