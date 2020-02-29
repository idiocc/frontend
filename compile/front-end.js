#!/usr/bin/env node
             
const fs = require('fs');
const path = require('path');
const os = require('os');
const stream = require('stream');
const vm = require('vm');
const _crypto = require('crypto');             const aa=fs.createReadStream,ba=fs.existsSync,w=fs.lstat,ca=fs.readFileSync;var da=stream;const ea=stream.Transform,fa=stream.Writable;const x=(a,b=0,c=!1)=>{if(0===b&&!c)return a;a=a.split("\n",c?b+1:void 0);return c?a[a.length-1]:a.slice(b).join("\n")},ha=(a,b=!1)=>x(a,2+(b?1:0)),y=a=>{({callee:{caller:a}}=a);return a};const z=os.EOL,ia=os.homedir;const A=/\s+at.*(?:\(|\s)(.*)\)?/,ja=/^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/,ka=ia(),B=a=>{const {pretty:b=!1,ignoredModules:c=["pirates"]}={},d=c.join("|"),f=new RegExp(ja.source.replace("IGNORED_MODULES",d));return a.replace(/\\/g,"/").split("\n").filter(e=>{e=e.match(A);if(null===e||!e[1])return!0;e=e[1];return e.includes(".app/Contents/Resources/electron.asar")||e.includes(".app/Contents/Resources/default_app.asar")?!1:!f.test(e)}).filter(e=>
e.trim()).map(e=>b?e.replace(A,(h,g)=>h.replace(g,g.replace(ka,"~"))):e).join("\n")};function la(a,b,c=!1){return function(d){var f=y(arguments),{stack:e}=Error();const h=x(e,2,!0),g=(e=d instanceof Error)?d.message:d;f=[`Error: ${g}`,...null!==f&&a===f||c?[b]:[h,b]].join("\n");f=B(f);return Object.assign(e?d:Error(),{message:g,stack:f})}};function E(a){var {stack:b}=Error();const c=y(arguments);b=ha(b,a);return la(c,b,a)};const ma=(a,b)=>{b.once("error",c=>{a.emit("error",c)});return b};class oa extends fa{constructor(a){const {binary:b=!1,rs:c=null,...d}=a||{},{H:f=E(!0),proxyError:e}=a||{},h=(g,l)=>f(l);super(d);this.a=[];this.C=new Promise((g,l)=>{this.on("finish",()=>{let k;b?k=Buffer.concat(this.a):k=this.a.join("");g(k);this.a=[]});this.once("error",k=>{if(-1==k.stack.indexOf("\n"))h`${k}`;else{const p=B(k.stack);k.stack=p;e&&h`${k}`}l(k)});c&&ma(this,c).pipe(this)})}_write(a,b,c){this.a.push(a);c()}get j(){return this.C}}const F=async a=>{({j:a}=new oa({rs:a,H:E(!0)}));return await a};async function G(a){a=aa(a);return await F(a)};const pa=vm.Script;const qa=(a,b)=>{const [c,,d]=a.split("\n");a=parseInt(c.replace(/.+?(\d+)$/,(e,h)=>h))-1;const f=d.indexOf("^");({length:b}=b.split("\n").slice(0,a).join("\n"));return b+f+(a?1:0)};const ra=a=>{try{new pa(a)}catch(b){const c=b.stack;if(!/Unexpected token '?</.test(b.message))throw b;return qa(c,a)}return null};function sa(a){if("object"!=typeof a)return!1;const b=a.re instanceof RegExp;a=-1!=["string","function"].indexOf(typeof a.replacement);return b&&a}const H=(a,b)=>{if(!(b instanceof Error))throw b;[,,a]=a.stack.split("\n",3);a=b.stack.indexOf(a);if(-1==a)throw b;a=b.stack.substr(0,a-1);const c=a.lastIndexOf("\n");b.stack=a.substr(0,c);throw b;};function I(a,b){function c(){return b.filter(sa).reduce((d,{re:f,replacement:e})=>{if(this.b)return d;if("string"==typeof e)return d=d.replace(f,e);{let h;return d.replace(f,(g,...l)=>{h=Error();try{return this.b?g:e.call(this,g,...l)}catch(k){H(h,k)}})}},`${a}`)}c.a=()=>{c.b=!0};return c.call(c)};const ta=a=>new RegExp(`%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_(\\d+)_%%`,"g"),ua=(a,b)=>`%%_RESTREAM_${a.toUpperCase()}_REPLACEMENT_${b}_%%`,va=(a,b)=>Object.keys(a).reduce((c,d)=>{{var f=a[d];const {getReplacement:e=ua,getRegex:h=ta}=b||{},g=h(d);f={name:d,re:f,regExp:g,getReplacement:e,map:{},lastIndex:0}}return{...c,[d]:f}},{}),K=a=>{var b=[];const c=a.map;return{re:a.regExp,replacement(d,f){d=c[f];delete c[f];return I(d,Array.isArray(b)?b:[b])}}},L=a=>{const b=a.map,c=a.getReplacement,d=
a.name;return{re:a.re,replacement(f){const e=a.lastIndex;b[e]=f;a.lastIndex+=1;return c(d,e)}}};async function wa(a,b){return xa(a,b)}
class ya extends ea{constructor(a,b){super(b);this.a=(Array.isArray(a)?a:[a]).filter(sa);this.b=!1;this.j=b}async replace(a,b){const c=new ya(this.a,this.j);b&&Object.assign(c,b);a=await wa(c,a);c.b&&(this.b=!0);b&&Object.keys(b).forEach(d=>{b[d]=c[d]});return a}async reduce(a){return await this.a.reduce(async(b,{re:c,replacement:d})=>{b=await b;if(this.b)return b;if("string"==typeof d)b=b.replace(c,d);else{const f=[];let e;const h=b.replace(c,(g,...l)=>{e=Error();try{if(this.b)return f.length?f.push(Promise.resolve(g)):
g;const k=d.call(this,g,...l);k instanceof Promise&&f.push(k);return k}catch(k){H(e,k)}});if(f.length)try{const g=await Promise.all(f);b=b.replace(c,()=>g.shift())}catch(g){H(e,g)}else b=h}return b},`${a}`)}async _transform(a,b,c){try{const d=await this.reduce(a);this.push(d);c()}catch(d){a=B(d.stack),d.stack=a,c(d)}}}async function xa(a,b){b instanceof da?b.pipe(a):a.end(b);return await F(a)};const za=a=>{[,a]=/<\s*(.+?)(?:\s+[\s\S]+)?\s*\/?\s*>/.exec(a)||[];return a},N=(a,{s:b=!1,classNames:c=[],renameMap:d={}}={})=>{let f=0;const e=[];let h;I(a,[{re:/[{}]/g,replacement(n,m){n="}"==n;const r=!n;if(!f&&n)throw Error("A closing } is found without opening one.");f+=r?1:-1;1==f&&r?h={open:m}:0==f&&n&&(h.close=m,e.push(h),h={})}}]);if(f)throw Error(`Unbalanced props (level ${f}) ${a}`);const g={},l=[],k={};var p=e.reduce((n,{open:m,close:r})=>{n=a.slice(n,m);const [,u,t,C,v]=/(\s*)(\S+)(\s*)=(\s*)$/.exec(n)||
[];m=a.slice(m+1,r);if(!t&&!/\s*\.\.\./.test(m))throw Error("Could not detect prop name");t?g[t]=m:l.push(m);k[t]={before:u,v:C,u:v};m=n||"";m=m.slice(0,m.length-(t||"").length-1);const {o:J,h:D}=M(m);Object.assign(g,J);Object.assign(k,D);return r+1},0);if(e.length){p=a.slice(p);const {o:n,h:m}=M(p);Object.assign(g,n);Object.assign(k,m)}else{const {o:n,h:m}=M(a);Object.assign(g,n);Object.assign(k,m)}let q=g;if(b||Array.isArray(c)&&c.length||Object.keys(c).length){({...q}=g);const n=[];Object.keys(q).forEach(m=>
{const r=()=>{n.push(m);delete q[m]};if(Array.isArray(c)&&c.includes(m))r();else if(c[m])r();else if(b){const u=m[0];u.toUpperCase()==u&&r()}});n.length&&(p=n.map(m=>m in d?d[m]:m).join(" "),q.className?/[`"']$/.test(q.className)?q.className=q.className.replace(/([`"'])$/,` ${p}$1`):q.className+=`+' ${p}'`:q.g?/[`"']$/.test(q.g)?q.g=q.g.replace(/([`"'])$/,` ${p}$1`):q.g+=`+' ${p}'`:q.className=`'${p}'`)}return{m:q,l,h:k}},M=a=>{const b=[],c={};a.replace(/(\s*)(\S+)(\s*)=(\s*)(["'])([\s\S]*?)\5/g,
(d,f,e,h,g,l,k,p)=>{c[e]={before:f,v:h,u:g};b.push({i:p,name:e,B:`${l}${k}${l}`});return"%".repeat(d.length)}).replace(/(\s*)([^\s%]+)/g,(d,f,e,h)=>{c[e]={before:f};b.push({i:h,name:e,B:"true"})});return{o:[...b.reduce((d,{i:f,name:e,B:h})=>{d[f]=[e,h];return d},[])].filter(Boolean).reduce((d,[f,e])=>{d[f]=e;return d},{}),h:c}},Aa=(a,b=[],c=!1,d={},f="")=>{const e=Object.keys(a);return e.length||b.length?`{${e.reduce((h,g)=>{const l=a[g],k=c||-1!=g.indexOf("-")?`'${g}'`:g,{before:p="",v:q="",u:n=
""}=d[g]||{};return[...h,`${p}${k}${q}:${n}${l}`]},b).join(",")}${f}}`:"{}"},Ba=(a="")=>{[a]=a;if(!a)throw Error("No tag name is given");return a.toUpperCase()==a},O=(a,b={},c=[],d=[],f=!1,e=null,h={},g="")=>{const l=Ba(a),k=l?a:`'${a}'`;if(!Object.keys(b).length&&!c.length&&!d.length)return`h(${k})`;const p=l&&"dom"==f?!1:f;l||!d.length||f&&"dom"!=f||e&&e(`JSX: destructuring ${d.join(" ")} is used without quoted props on HTML ${a}.`);a=Aa(b,d,p,h,g);b=c.reduce((q,n,m)=>{m=c[m-1];let r="";m&&/^\/\*[\s\S]*\*\/$/.test(m)?
r="":m&&/\S/.test(m)&&(r=",");return`${q}${r}${n}`},"");return`h(${k},${a}${b?`,${b}`:""})`};const Ca=(a,b=[])=>{let c=0,d;a=I(a,[...b,{re:/[<>]/g,replacement(f,e){if(d)return f;const h="<"==f;c+=h?1:-1;0==c&&!h&&(d=e);return f}}]);if(c)throw Error(1);return{N:a,w:d}},Q=a=>{const b=za(a);let c;const {D:d}=va({D:/=>/g});try{({N:l,w:c}=Ca(a,[L(d)]))}catch(k){if(1===k)throw Error(`Could not find the matching closing > for ${b}.`);}const f=l.slice(0,c+1);var e=f.replace(/<\s*[^\s/>]+/,"");if(/\/\s*>$/.test(e))return a=e.replace(/\/\s*>$/,""),e="",new P({f:f.replace(d.regExp,"=>"),c:a.replace(d.regExp,
"=>"),content:"",tagName:b});a=e.replace(/>$/,"");e=c+1;c=!1;let h=1,g;I(l,[{re:new RegExp(`[\\s\\S](?:<\\s*${b}(\\s+|>)|/\\s*${b}\\s*>)`,"g"),replacement(k,p,q,n){if(c)return k;p=!p&&k.endsWith(">");const m=!p;if(m){n=n.slice(q);const {w:r}=Ca(n.replace(/^[\s\S]/," "));n=n.slice(0,r+1);if(/\/\s*>$/.test(n))return k}h+=m?1:-1;0==h&&p&&(c=q,g=c+k.length);return k}}]);if(h)throw Error(`Could not find the matching closing </${b}>.`);e=l.slice(e,c);var l=l.slice(0,g).replace(d.regExp,"=>");return new P({f:l,
c:a.replace(d.regExp,"=>"),content:e.replace(d.regExp,"=>"),tagName:b})};class P{constructor(a){this.f=a.f;this.c=a.c;this.content=a.content;this.tagName=a.tagName}};const R=a=>{let b="",c="";a=a.replace(/^(\r?\n\s*)([\s\S]+)?/,(d,f,e="")=>{b=f;return e}).replace(/([\s\S]+?)?(\r?\n\s*)$/,(d,f="",e="")=>{c=e;return f});return`${b}${a?`\`${a}\``:""}${c}`},Ea=a=>{const b=[];let c={},d=0,f=0;I(a,[{re:/[<{}]/g,replacement(e,h){if(!(h<f))if(/[{}]/.test(e))d+="{"==e?1:-1,1==d&&void 0==c.from?c.from=h:0==d&&(c.A=h+1,c.I=a.slice(c.from+1,h),b.push(c),c={});else{if(d)return e;e=Q(a.slice(h));f=h+e.f.length;c.J=e;c.A=f;c.from=h;b.push(c);c={}}}},{}]);return b.length?Da(a,
b):[R(a)]},Da=(a,b)=>{let c=0;b=b.reduce((d,{from:f,A:e,I:h,J:g})=>{(f=a.slice(c,f))&&d.push(R(f));c=e;h?d.push(h):g&&d.push(g);return d},[]);if(c<a.length){const d=a.slice(c,a.length);d&&b.push(R(d))}return b};const Fa=(a,b={})=>{var c=b.quoteProps,d=b.warn;const f=b.prop2class,e=b.classNames,h=b.renameMap;var g=ra(a);if(null===g)return a;var l=a.slice(g);const {c:k="",content:p,tagName:q,f:{length:n}}=Q(l);l=S(p,c,d,b);const {m,l:r,h:u}=N(k.replace(/^ */,""),{s:f,classNames:e,renameMap:h});d=O(q,m,l,r,c,d,u,/\s*$/.exec(k)||[""]);c=a.slice(0,g);a=a.slice(g+n);g=n-d.length;0<g&&(d=`${" ".repeat(g)}${d}`);a=`${c}${d}${a}`;return Fa(a,b)},S=(a,b=!1,c=null,d={})=>a?Ea(a).reduce((f,e)=>{if(e instanceof P){const {c:l=
"",content:k,tagName:p}=e,{m:q,l:n}=N(l,{s:d.prop2class,classNames:d.classNames,renameMap:d.renameMap});e=S(k,b,c,d);e=O(p,q,e,n,b,c);return[...f,e]}const h=ra(e);if(h){var g=e.slice(h);const {f:{length:l},c:k="",content:p,tagName:q}=Q(g),{m:n,l:m}=N(k,{s:d.prop2class,classNames:d.classNames,renameMap:d.renameMap});g=S(p,b,c,d);g=O(q,n,g,m,b,c);const r=e.slice(0,h);e=e.slice(h+l);return[...f,`${r}${g}${e}`]}return[...f,e]},[]):[];const Ga=(a,b={})=>{const {e:c,F:d,G:f,i:e,K:h,L:g}=va({F:/^ *export\s+default\s+{[\s\S]+?}/mg,e:/^ *export\s+(?:default\s+)?/mg,G:/^ *export\s+{[^}]+}\s+from\s+(['"])(?:.+?)\1/mg,i:/^ *import(\s+([^\s,]+)\s*,?)?(\s*{(?:[^}]+)})?\s+from\s+['"].+['"]/gm,K:/^ *import\s+(?:(.+?)\s*,\s*)?\*\s+as\s+.+?\s+from\s+['"].+['"]/gm,L:/^ *import\s+['"].+['"]/gm},{getReplacement(l,k){return`/*%%_RESTREAM_${l.toUpperCase()}_REPLACEMENT_${k}_%%*/`},getRegex(l){return new RegExp(`/\\*%%_RESTREAM_${l.toUpperCase()}_REPLACEMENT_(\\d+)_%%\\*/`,
"g")}});a=I(a,[L(f),L(d),L(c),L(e),L(h),L(g)]);b=Fa(a,b);return I(b,[K(f),K(d),K(c),K(e),K(h),K(g)])};async function Ha(a,b,c){const d=E(!0);if("function"!=typeof a)throw Error("Function must be passed.");if(!a.length)throw Error(`Function${a.name?` ${a.name}`:""} does not accept any arguments.`);return await new Promise((f,e)=>{const h=(l,k)=>l?(l=d(l),e(l)):f(c||k);let g=[h];Array.isArray(b)?g=[...b,h]:1<Array.from(arguments).length&&(g=[b,h]);a(...g)})};const T=async a=>{try{return await Ha(w,a)}catch(b){return null}};const Ia=path.basename,U=path.dirname,V=path.join,Ja=path.parse,W=path.relative,Ka=path.resolve;const La=async a=>{var b=await T(a);let c=a,d=!1;if(!b){if(c=await X(a),!c)throw Error(`${a}.js or ${a}.jsx is not found.`);}else if(b.isDirectory()){b=!1;let f;a.endsWith("/")||(f=c=await X(a),b=!0);if(!f){c=await X(V(a,"index"));if(!c)throw Error(`${b?`${a}.jsx? does not exist, and `:""}index.jsx? file is not found in ${a}`);d=!0}}return{path:a.startsWith(".")?W("",c):c,M:d}},X=async a=>{a=`${a}.js`;let b=await T(a);b||(a=`${a}x`);if(b=await T(a))return a};function Ma(a,b,c){const d=[];b.replace(a,(f,...e)=>{f=e.slice(0,e.length-2).reduce((h,g,l)=>{l=c[l];if(!l||void 0===g)return h;h[l]=g;return h},{});d.push(f)});return d};/*
 diff package https://github.com/kpdecker/jsdiff
 BSD License
 Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
*/
const Na={black:40,red:41,green:42,yellow:43,blue:44,magenta:45,cyan:46,white:47};function Oa(a,b){return(b=Na[b])?`\x1b[${b}m${a}\x1b[0m`:a};const Pa=_crypto.createHash;function Qa(a){a=JSON.stringify(a);const b=Buffer.byteLength(a),c=126>b?0:2;var d=0===c?b:126;const f=Buffer.alloc(2+c+b);f.writeUInt8(129,0);f.writeUInt8(d,1);d=2;0<c&&(f.writeUInt16BE(b,2),d+=c);f.write(a,d);return f}function Ra(a){return Pa("sha1").update(`${a}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`,"binary").digest("base64")};function Sa(a){const {onMessage:b=()=>{},onConnect:c=()=>{},log:d=!0}={},f={};a.on("upgrade",function(e,h){if("websocket"!=e.headers.upgrade)h.end("HTTP/1.1 400 Bad Request");else{var g=e.headers["sec-websocket-protocol"],l=e.headers["sec-websocket-key"];e=["HTTP/1.1 101 Web Socket Protocol Handshake","Upgrade: WebSocket","Connection: Upgrade",`Sec-WebSocket-Accept: ${Ra(l)}`];(g?g.split(",").map(k=>k.trim()):[]).includes("json")&&e.push("Sec-WebSocket-Protocol: json");h.write(e.join("\r\n")+"\r\n\r\n");
d&&console.log(Oa("Client connected.","green"));h.on("data",k=>{var p=k.readUInt8(0)&15;if(8===p)k=null;else if(1===p){var q=k.readUInt8(1),n=!!(q>>>7&1);p=2;q&=127;if(125<q)if(126===q)q=k.readUInt16BE(p),p+=2;else throw k.readUInt32BE(p),k.readUInt32BE(p+4),Error("Large payloads not currently implemented");if(n){var m=k.readUInt32BE(p);p+=4}var r=Buffer.alloc(q);if(n)for(let u=0,t=0;u<q;++u,t=u%4){n=3==t?0:3-t<<3;n=(0==n?m:m>>>n)&255;const C=k.readUInt8(p++);r.writeUInt8(n^C,u)}else k.copy(r,0,p++);
k=`${r}`}else k=void 0;k?b(l,k):null===k&&(delete f[l],d&&console.log(Oa("Client disconnected.","red")))});f[l]=(k,p)=>{h.write(Qa({event:k,message:p}))};c(l)}});return f};let Y;
const Ua=async(a,b,c={})=>{Y||({root:Y}=Ja(process.cwd()));const {fields:d,soft:f=!1}=c;var e=V(a,"node_modules",b);e=V(e,"package.json");const h=await T(e);if(h){a=await Ta(e,d);if(void 0===a)throw Error(`The package ${W("",e)} does export the module.`);if(!a.entryExists&&!f)throw Error(`The exported module ${a.main} in package ${b} does not exist.`);const {entry:g,version:l,packageName:k,main:p,entryExists:q,...n}=a;return{entry:W("",g),packageJson:W("",e),...l?{version:l}:{},packageName:k,...p?
{hasMain:!0}:{},...q?{}:{entryExists:!1},...n}}if(a==Y&&!h)throw Error(`Package.json for module ${b} not found.`);return Ua(V(Ka(a),".."),b,c)},Ta=async(a,b=[])=>{const c=await G(a);let d,f,e,h,g;try{({module:d,version:f,name:e,main:h,...g}=JSON.parse(c)),g=b.reduce((k,p)=>{k[p]=g[p];return k},{})}catch(k){throw Error(`Could not parse ${a}.`);}a=U(a);b=d||h;if(!b){if(!await T(V(a,"index.js")))return;b=h="index.js"}a=V(a,b);let l;try{({path:l}=await La(a)),a=l}catch(k){}return{entry:a,version:f,packageName:e,
main:!d&&h,entryExists:!!l,...g}};const Va=async(a,b,{mount:c,override:d={}})=>{var f=async(e,h,g)=>{var l=U(a);if(/^[/.]/.test(g))return e;{let [q,n,...m]=g.split("/");!q.startsWith("@")&&n?(m=[n,...m],n=q):n=q.startsWith("@")?`${q}/${n}`:q;e={name:n,paths:m.join("/")}}const {name:k,paths:p}=e;if(d[k])return`${h}'${d[k]}'`;({packageJson:l}=await Ua(l,k));e=Ka(l);l=U(e);if(p)return Z(l,p,h,c);({module:e}=require(e));return e?Z(l,e,h,c):(console.warn("[\u219b] Package %s does not specify module in package.json, trying src",l),Z(l,
"src",h))};f=new ya([{re:/^( *import(?:\s+[^\s,]+\s*,?)?(?:\s*{(?:[^}]+)})?\s+from\s+)['"](.+)['"]/gm,replacement:f},{re:/^( *import\s+)['"](.+)['"]/gm,replacement:f}]);f.end(b);return await F(f)},Z=(a,b,c,d)=>{a=V(a,b);b=W("",a);d&&(b=W(d,b));return`${c}'/${b}${a.endsWith("/")?"/":""}'`.replace(/\\/g,"/")};function Wa(a=""){const b=document.head,c=document.createElement("style");c.type="text/css";c.styleSheet?c.styleSheet.cssText=a:c.appendChild(document.createTextNode(a));b.appendChild(c)};const Xa=a=>Ma(/export\s+(default\s+)?class\s+([^\s{]+)/g,a,["def","name"]).reduce((b,{def:c,name:d})=>{b[c?"default":d]=d;return b},{}),Ya=(a,b)=>{b=Object.entries(b).map(([c,d])=>`'${c}': ${d},`);return`/* IDIO HOT RELOAD */
if (window.idioHotReload) {
  let i = 0
  idioHotReload('${a}', async () => {
    i++
    const module = await import(\`./${Ia(a).replace(/\.jsx?$/,"")}?ihr=\${i}\`)
    return {
      module,
      classes: {
${b.map(c=>`        ${c}`).join(z)}
      },
    }
  })
}`};const Za=require("node-watch"),$a=ca(V(__dirname,"listener.js")),bb=async(a,b,c,d)=>{const f=d.jsxOptions,e=d.exportClasses;/\.jsx$/.test(a)&&(b=Ga(b,f),c&&(b=`${c}${z}${b}`));return b=/\.css$/.test(a)?ab(b,e):await Va(a,b,d)},ab=(a,b=!0)=>{let c=[];b&&(b=a.split(/\r?\n/).filter(d=>/^\S/.test(d)).join(z),c=Ma(/\.([\w\d_-]+)/g,b,["className"]).map(({className:d})=>d).filter((d,f,e)=>e.indexOf(d)==f));return`(${Wa.toString()})(\`${a}\`)
${c.map(d=>`export const $${d} = '${d}'`).join(z)}`.trim()};module.exports=function(a={}){const {directory:b="frontend",pragma:c="import { h } from 'preact'",mount:d=".",override:f={},jsxOptions:e,exportClasses:h=!0,hotReload:g}=a;let {log:l}=a;!0===l&&(l=console.log);const k=Array.isArray(b)?b:[b];k.forEach(m=>{const r=V(d,m);if(!ba(r))throw Error(`Frontend directory ${m} does not exist.`);});let p={},q;g&&({watchers:q={}}=g);let n=!1;return async(m,r)=>{if(g&&m.path==(g.path||"/hot-reload.js"))m.type="js",m.body=$a,n||(m=g.getServer(),p=Sa(m),n=!0);else{var u=
m.path.replace("/","");if(!(k.includes(u)||k.some(D=>u.startsWith(`${D}/`))||m.path.startsWith("/node_modules/")))return r();u=V(d,u).replace(/\\/g,"/");var {path:t,M:C}=await La(u);if(C&&!u.endsWith("/"))r=d?W(d,t).replace(/\\/g,"/"):t,m.redirect(`/${r}`);else{try{var v=await Ha(w,t)}catch(D){m.status=404;return}m.status=200;m.etag=`${v.mtime.getTime()}`;if(m.fresh)return m.status=304,await r();r=await G(t);v=(new Date).getTime();r=await bb(t,r,c,{mount:d,override:f,jsxOptions:e,exportClasses:h});
var J=(new Date).getTime();l&&l("%s patched in %sms",t,J-v);m.type="application/javascript";!g||m.query.O||t.startsWith("node_modules")&&g.ignoreNodeModules||(t in q||(v=Za(t,(D,na)=>{console.log("File %s changed",na);Object.values(p).forEach(cb=>{cb("update",{filename:na})})}),q[t]=v),t.endsWith("jsx")&&(v=Xa(r),v=Ya(t,v),r+=`${z}${z}${v}`));m.body=r}}}};

//# sourceMappingURL=front-end.js.map