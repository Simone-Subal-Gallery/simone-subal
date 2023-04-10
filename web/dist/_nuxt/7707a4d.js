/*! For license information please see LICENSES */
(window.webpackJsonp=window.webpackJsonp||[]).push([[11,19,20],{353:function(t,e,r){"use strict";var n=r(11),o=r(5),l=r(92),c=r(17),d=r(13),f=r(46),h=r(215),m=r(70),y=r(7),k=r(72),v=r(71).f,x=r(33).f,w=r(16).f,_=r(358).trim,A="Number",S=o.Number,I=S.prototype,N=f(k(I))==A,z=function(t){var e,r,n,o,l,c,d,code,f=m(t,!1);if("string"==typeof f&&f.length>2)if(43===(e=(f=_(f)).charCodeAt(0))||45===e){if(88===(r=f.charCodeAt(2))||120===r)return NaN}else if(48===e){switch(f.charCodeAt(1)){case 66:case 98:n=2,o=49;break;case 79:case 111:n=8,o=55;break;default:return+f}for(c=(l=f.slice(2)).length,d=0;d<c;d++)if((code=l.charCodeAt(d))<48||code>o)return NaN;return parseInt(l,n)}return+f};if(l(A,!S(" 0o1")||!S("0b1")||S("+0x1"))){for(var E,C=function(t){var e=arguments.length<1?0:t,r=this;return r instanceof C&&(N?y((function(){I.valueOf.call(r)})):f(r)!=A)?h(new S(z(e)),r,C):z(e)},L=n?v(S):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger,fromString,range".split(","),M=0;L.length>M;M++)d(S,E=L[M])&&!d(C,E)&&w(C,E,x(S,E));C.prototype=I,I.constructor=C,c(o,A,C)}},354:function(t,e,r){var content=r(362);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(32).default)("1ea59271",content,!0,{sourceMap:!1})},355:function(t,e,r){"use strict";r.r(e);var n=r(216),o=r.n(n),l={props:{images:{type:Array},id:{type:String},type:{type:String},numbered:{type:Boolean},caption:{type:String}},data:function(){return{lightboxOptions:{fadeSpeed:0,animationSlide:!1,history:!1,focus:!0,loop:!0,captionSelector:function(element){return element.nextElementSibling},captionType:"text",heightRatio:.7}}},mounted:function(){var t="#"+this.id+" .lightbox-image";new o.a(t,this.lightboxOptions)},methods:{}},c=(r(364),r(2)),component=Object(c.a)(l,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{attrs:{id:t.id}},t._l(t.images,(function(image,i){return r("figure",{key:image._id,staticClass:"image"},[r("a",{staticClass:"lightbox-image",attrs:{href:image.asset.url}},[r("lazy-img",{attrs:{"background-color":image.asset.metadata.palette.vibrant.background,"lazy-src":t.$urlFor(image).size(1920).toString(),width:image.asset.metadata.dimensions.width,height:image.asset.metadata.dimensions.height,"lazy-srcset":"\n          "+t.$urlFor(image).size(2880).toString()+" 2880w,\n          "+t.$urlFor(image).size(1920).toString()+" 1920w,\n          "+t.$urlFor(image).size(1024).toString()+" 1024w,\n          "+t.$urlFor(image).size(960).toString()+" 960w,\n          "+t.$urlFor(image).size(720).toString()+" 720w,\n          "+t.$urlFor(image).size(480).toString()+" 480w,\n          "+t.$urlFor(image).size(270).toString()+" 270w",alt:t.caption}})],1),t._v(" "),r("figcaption",[null!=t.numbered&&1==t.numbered?r("p",{domProps:{innerHTML:t._s(i+1+".")}}):t._e(),t._v(" "),null!=t.caption?r("p",{domProps:{innerHTML:t._s(t.caption)}}):t._e(),t._v(" "),null==t.caption?r("SanityContent",{staticClass:"caption",attrs:{blocks:image.caption}}):t._e()],1)])})),0)}),[],!1,null,null,null);e.default=component.exports;installComponents(component,{LazyImg:r(356).default,SanityContent:r(214).default})},356:function(t,e,r){"use strict";r.r(e);r(353);var n=r(360),o=r.n(n),l={name:"LazyImg",props:{backgroundColor:{type:String,default:"#eee"},height:{type:Number,default:null},lazySrc:{type:String,default:null},lazySrcset:{type:String,default:null},sizes:{type:String,default:null},width:{type:Number,default:null}},data:function(){return{loading:!0}},computed:{aspectRatio:function(){return this.width&&this.height?this.height/this.width*100:null},style:function(){var style={backgroundColor:this.backgroundColor};return this.width&&(style.width="".concat(this.width,"px")),this.loading&&this.aspectRatio&&(style.height=0,style.paddingTop="".concat(this.aspectRatio,"%")),style}},mounted:function(){var t=this,e=function(){t.loading=!1};this.$el.addEventListener("load",e),this.$once("hook:destroyed",(function(){t.$el.removeEventListener("load",e)})),o()(this.$el).observe()}},c=(r(361),r(2)),component=Object(c.a)(l,(function(){var t=this,e=t.$createElement;return(t._self._c||e)("img",{staticClass:"lazy-img",style:t.style,attrs:{"data-src":t.lazySrc,"data-srcset":t.lazySrcset,sizes:t.sizes}})}),[],!1,null,null,null);e.default=component.exports},357:function(t,e,r){var content=r(365);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(32).default)("168e5d40",content,!0,{sourceMap:!1})},358:function(t,e,r){var n=r(20),o="["+r(359)+"]",l=RegExp("^"+o+o+"*"),c=RegExp(o+o+"*$"),d=function(t){return function(e){var r=String(n(e));return 1&t&&(r=r.replace(l,"")),2&t&&(r=r.replace(c,"")),r}};t.exports={start:d(1),end:d(2),trim:d(3)}},359:function(t,e){t.exports="\t\n\v\f\r                　\u2028\u2029\ufeff"},360:function(t,e,r){t.exports=function(){"use strict";var g="undefined"!=typeof document&&document.documentMode,t={rootMargin:"0px",threshold:0,load:function(t){if("picture"===t.nodeName.toLowerCase()){var e=t.querySelector("img"),r=!1;null===e&&(e=document.createElement("img"),r=!0),g&&t.getAttribute("data-iesrc")&&(e.src=t.getAttribute("data-iesrc")),t.getAttribute("data-alt")&&(e.alt=t.getAttribute("data-alt")),r&&t.append(e)}if("video"===t.nodeName.toLowerCase()&&!t.getAttribute("data-src")&&t.children){for(var a=t.children,n=void 0,i=0;i<=a.length-1;i++)(n=a[i].getAttribute("data-src"))&&(a[i].src=n);t.load()}t.getAttribute("data-poster")&&(t.poster=t.getAttribute("data-poster")),t.getAttribute("data-src")&&(t.src=t.getAttribute("data-src")),t.getAttribute("data-srcset")&&t.setAttribute("srcset",t.getAttribute("data-srcset"));var o=",";if(t.getAttribute("data-background-delimiter")&&(o=t.getAttribute("data-background-delimiter")),t.getAttribute("data-background-image"))t.style.backgroundImage="url('"+t.getAttribute("data-background-image").split(o).join("'),url('")+"')";else if(t.getAttribute("data-background-image-set")){var l=t.getAttribute("data-background-image-set").split(o),u=l[0].substr(0,l[0].indexOf(" "))||l[0];u=-1===u.indexOf("url(")?"url("+u+")":u,1===l.length?t.style.backgroundImage=u:t.setAttribute("style",(t.getAttribute("style")||"")+"background-image: "+u+"; background-image: -webkit-image-set("+l+"); background-image: image-set("+l+")")}t.getAttribute("data-toggle-class")&&t.classList.toggle(t.getAttribute("data-toggle-class"))},loaded:function(){}};function e(t){t.setAttribute("data-loaded",!0)}var r=function(t){return"true"===t.getAttribute("data-loaded")},n=function(t){var e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:document;return t instanceof Element?[t]:t instanceof NodeList?t:e.querySelectorAll(t)};return function(){var o,a,l=0<arguments.length&&void 0!==arguments[0]?arguments[0]:".lozad",c=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{},d=Object.assign({},t,c),i=d.root,f=d.rootMargin,h=d.threshold,u=d.load,g=d.loaded,s=void 0;"undefined"!=typeof window&&window.IntersectionObserver&&(s=new IntersectionObserver((o=u,a=g,function(t,n){t.forEach((function(t){(0<t.intersectionRatio||t.isIntersecting)&&(n.unobserve(t.target),r(t.target)||(o(t.target),e(t.target),a(t.target)))}))}),{root:i,rootMargin:f,threshold:h}));for(var m,y=n(l,i),b=0;b<y.length;b++)(m=y[b]).getAttribute("data-placeholder-background")&&(m.style.background=m.getAttribute("data-placeholder-background"));return{observe:function(){for(var t=n(l,i),o=0;o<t.length;o++)r(t[o])||(s?s.observe(t[o]):(u(t[o]),e(t[o]),g(t[o])))},triggerLoad:function(t){r(t)||(u(t),e(t),g(t))},observer:s}}}()},361:function(t,e,r){"use strict";r(354)},362:function(t,e,r){var n=r(31)(!1);n.push([t.i,".lazy-img{max-width:100%;max-height:100%;width:auto;height:auto;vertical-align:middle}",""]),t.exports=n},364:function(t,e,r){"use strict";r(357)},365:function(t,e,r){var n=r(31)(!1);n.push([t.i,".sl-wrapper .sl-image .sl-caption{display:block;max-height:15vh;overflow:scroll}",""]),t.exports=n},376:function(t,e,r){var content=r(398);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(32).default)("3d8d2ab2",content,!0,{sourceMap:!1})},397:function(t,e,r){"use strict";r(376)},398:function(t,e,r){var n=r(31)(!1);n.push([t.i,".exhibition-gallery{padding:3em 0}.exhibition-gallery.sticky_col{display:grid;grid-template-columns:2fr 1fr;grid-gap:1rem}.exhibition-gallery.sticky_col .install,.exhibition-gallery.sticky_col .work{position:-webkit-sticky;position:sticky;top:6rem;align-self:start}.exhibition-gallery .install figcaption{font-size:.75rem;max-width:720px;margin-bottom:1rem;margin-top:.75rem}.exhibition-gallery .work figure{display:grid;grid-template-columns:4fr 2fr;grid-gap:.75em;margin-bottom:1rem}.exhibition-gallery .work figure figcaption{font-size:.75rem;align-self:end;margin-bottom:.5rem}@media screen and (max-width:768px){.exhibition-gallery.sticky_col{grid-template-columns:1fr}.exhibition-gallery.sticky_col .install,.exhibition-gallery.sticky_col .work{position:static}}",""]),t.exports=n},402:function(t,e,r){"use strict";r.r(e);r(353);var n=r(355),o=(r(356),{props:{block:{type:Object},index:{type:Number}},components:{Lightbox:n.default},methods:{},mounted:function(){console.log(this.block)}}),l=(r(397),r(2)),component=Object(l.a)(o,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{class:["exhibition-gallery",t.block.display?t.block.display:"sticky_col"],attrs:{id:"exhibitionGallery"+t.index}},[null!=t.block.install&&t.block.install.length>0?r("div",{staticClass:"install"},[null!=t.block.install&&t.block.install.length>0?r("Lightbox",{attrs:{id:"installlightbox"+t.index,images:t.block.install}}):t._e()],1):t._e(),t._v(" "),r("div",{staticClass:"work"},[null!=t.block.work&&t.block.work.length>0?r("Lightbox",{attrs:{type:"workGallery",id:"worklightbox"+t.index,numbered:t.block.numbered,images:t.block.work}}):t._e()],1)])}),[],!1,null,null,null);e.default=component.exports;installComponents(component,{Lightbox:r(355).default})}}]);