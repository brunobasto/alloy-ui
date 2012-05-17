/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.6.0pr1
build: nightly
*/
YUI.add("console-filters",function(c){var p=c.ClassNameManager.getClassName,g="console",b="filters",k="filter",f="category",d="source",e="category.",l="source.",o="host",q="checked",n="defaultVisibility",m=".",s="",r=m+c.Console.CHROME_CLASSES.console_bd_class,h=m+c.Console.CHROME_CLASSES.console_ft_class,a="input[type=checkbox].",i=c.Lang.isString;function j(){j.superclass.constructor.apply(this,arguments);}c.namespace("Plugin").ConsoleFilters=c.extend(j,c.Plugin.Base,{_entries:null,_cacheLimit:Number.POSITIVE_INFINITY,_categories:null,_sources:null,initializer:function(){this._entries=[];this.get(o).on("entry",this._onEntry,this);this.doAfter("renderUI",this.renderUI);this.doAfter("syncUI",this.syncUI);this.doAfter("bindUI",this.bindUI);this.doAfter("clearConsole",this._afterClearConsole);if(this.get(o).get("rendered")){this.renderUI();this.syncUI();this.bindUI();}this.after("cacheLimitChange",this._afterCacheLimitChange);},destructor:function(){this._entries=[];if(this._categories){this._categories.remove();}if(this._sources){this._sources.remove();}},renderUI:function(){var u=this.get(o).get("contentBox").one(h),t;if(u){t=c.substitute(j.CATEGORIES_TEMPLATE,j.CHROME_CLASSES);this._categories=u.appendChild(c.Node.create(t));t=c.substitute(j.SOURCES_TEMPLATE,j.CHROME_CLASSES);this._sources=u.appendChild(c.Node.create(t));}},bindUI:function(){this._categories.on("click",c.bind(this._onCategoryCheckboxClick,this));this._sources.on("click",c.bind(this._onSourceCheckboxClick,this));this.after("categoryChange",this._afterCategoryChange);this.after("sourceChange",this._afterSourceChange);},syncUI:function(){c.each(this.get(f),function(u,t){this._uiSetCheckbox(f,t,u);},this);c.each(this.get(d),function(u,t){this._uiSetCheckbox(d,t,u);},this);this.refreshConsole();},_onEntry:function(w){this._entries.push(w.message);var t=e+w.message.category,y=l+w.message.source,u=this.get(t),z=this.get(y),v=this._entries.length-this._cacheLimit,x;if(v>0){this._entries.splice(0,v);}if(u===undefined){x=this.get(n);this.set(t,x);u=x;}if(z===undefined){x=this.get(n);this.set(y,x);z=x;}if(!u||!z){w.preventDefault();}},_afterClearConsole:function(){this._entries=[];},_afterCategoryChange:function(v){var t=v.subAttrName.replace(/category\./,s),u=v.prevVal,w=v.newVal;if(!t||u[t]!==undefined){this.refreshConsole();this._filterBuffer();}if(t&&!v.fromUI){this._uiSetCheckbox(f,t,w[t]);}},_afterSourceChange:function(u){var w=u.subAttrName.replace(/source\./,s),t=u.prevVal,v=u.newVal;if(!w||t[w]!==undefined){this.refreshConsole();this._filterBuffer();}if(w&&!u.fromUI){this._uiSetCheckbox(d,w,v[w]);}},_filterBuffer:function(){var u=this.get(f),w=this.get(d),t=this.get(o).buffer,x=null,v;for(v=t.length-1;v>=0;--v){if(!u[t[v].category]||!w[t[v].source]){x=x||v;}else{if(x){t.splice(v,(x-v));x=null;}}}if(x){t.splice(0,x+1);}},_afterCacheLimitChange:function(t){if(isFinite(t.newVal)){var u=this._entries.length-t.newVal;if(u>0){this._entries.splice(0,u);}}},refreshConsole:function(){var x=this._entries,B=this.get(o),y=B.get("contentBox").one(r),u=B.get("consoleLimit"),A=this.get(f),t=this.get(d),v=[],w,z;if(y){B._cancelPrintLoop();for(w=x.length-1;w>=0&&u>=0;--w){z=x[w];if(A[z.category]&&t[z.source]){v.unshift(z);--u;}}y.setContent(s);B.buffer=v;B.printBuffer();}},_uiSetCheckbox:function(u,x,w){if(u&&x){var t=u===f?this._categories:this._sources,z=a+p(g,k,x),y=t.one(z),v;if(!y){v=this.get(o);this._createCheckbox(t,x);y=t.one(z);v._uiSetHeight(v.get("height"));}y.set(q,w);}},_onCategoryCheckboxClick:function(w){var v=w.target,u;if(v.hasClass(j.CHROME_CLASSES.filter)){u=v.get("value");if(u&&u in this.get(f)){this.set(e+u,v.get(q),{fromUI:true});}}},_onSourceCheckboxClick:function(v){var u=v.target,w;if(u.hasClass(j.CHROME_CLASSES.filter)){w=u.get("value");if(w&&w in this.get(d)){this.set(l+w,u.get(q),{fromUI:true});}}},hideCategory:function(u,t){if(i(t)){c.Array.each(arguments,this.hideCategory,this);}else{this.set(e+u,false);}},showCategory:function(u,t){if(i(t)){c.Array.each(arguments,this.showCategory,this);}else{this.set(e+u,true);}},hideSource:function(u,t){if(i(t)){c.Array.each(arguments,this.hideSource,this);}else{this.set(l+u,false);}},showSource:function(u,t){if(i(t)){c.Array.each(arguments,this.showSource,this);}else{this.set(l+u,true);}},_createCheckbox:function(t,u){var w=c.merge(j.CHROME_CLASSES,{filter_name:u,filter_class:p(g,k,u)}),v=c.Node.create(c.substitute(j.FILTER_TEMPLATE,w));t.appendChild(v);},_validateCategory:function(t,u){return c.Lang.isObject(u,true)&&t.split(/\./).length<3;},_validateSource:function(u,t){return c.Lang.isObject(t,true)&&u.split(/\./).length<3;},_setCacheLimit:function(t){if(c.Lang.isNumber(t)){this._cacheLimit=t;return t;}else{return c.Attribute.INVALID_VALUE;}}},{NAME:"consoleFilters",NS:k,CATEGORIES_TEMPLATE:'<div class="{categories}"></div>',SOURCES_TEMPLATE:'<div class="{sources}"></div>',FILTER_TEMPLATE:'<label class="{filter_label}">'+'<input type="checkbox" value="{filter_name}" '+'class="{filter} {filter_class}"> {filter_name}'+"</label>&#8201;",CHROME_CLASSES:{categories:p(g,b,"categories"),sources:p(g,b,"sources"),category:p(g,k,f),source:p(g,k,d),filter:p(g,k),filter_label:p(g,k,"label")},ATTRS:{defaultVisibility:{value:true,validator:c.Lang.isBoolean},category:{value:{},validator:function(u,t){return this._validateCategory(t,u);}},source:{value:{},validator:function(u,t){return this._validateSource(t,u);}},cacheLimit:{value:Number.POSITIVE_INFINITY,setter:function(t){return this._setCacheLimit(t);}}}});},"3.6.0pr1",{requires:["console","plugin"]});