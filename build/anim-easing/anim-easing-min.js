/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.6.0pr1
build: nightly
*/
YUI.add("anim-easing",function(b){var a={easeNone:function(f,e,h,g){return h*f/g+e;},easeIn:function(f,e,h,g){return h*(f/=g)*f+e;},easeOut:function(f,e,h,g){return -h*(f/=g)*(f-2)+e;},easeBoth:function(f,e,h,g){if((f/=g/2)<1){return h/2*f*f+e;}return -h/2*((--f)*(f-2)-1)+e;},easeInStrong:function(f,e,h,g){return h*(f/=g)*f*f*f+e;},easeOutStrong:function(f,e,h,g){return -h*((f=f/g-1)*f*f*f-1)+e;},easeBothStrong:function(f,e,h,g){if((f/=g/2)<1){return h/2*f*f*f*f+e;}return -h/2*((f-=2)*f*f*f-2)+e;},elasticIn:function(g,e,k,j,f,i){var h;if(g===0){return e;}if((g/=j)===1){return e+k;}if(!i){i=j*0.3;}if(!f||f<Math.abs(k)){f=k;h=i/4;}else{h=i/(2*Math.PI)*Math.asin(k/f);}return -(f*Math.pow(2,10*(g-=1))*Math.sin((g*j-h)*(2*Math.PI)/i))+e;},elasticOut:function(g,e,k,j,f,i){var h;if(g===0){return e;}if((g/=j)===1){return e+k;}if(!i){i=j*0.3;}if(!f||f<Math.abs(k)){f=k;h=i/4;}else{h=i/(2*Math.PI)*Math.asin(k/f);}return f*Math.pow(2,-10*g)*Math.sin((g*j-h)*(2*Math.PI)/i)+k+e;},elasticBoth:function(g,e,k,j,f,i){var h;if(g===0){return e;}if((g/=j/2)===2){return e+k;}if(!i){i=j*(0.3*1.5);}if(!f||f<Math.abs(k)){f=k;h=i/4;}else{h=i/(2*Math.PI)*Math.asin(k/f);}if(g<1){return -0.5*(f*Math.pow(2,10*(g-=1))*Math.sin((g*j-h)*(2*Math.PI)/i))+e;}return f*Math.pow(2,-10*(g-=1))*Math.sin((g*j-h)*(2*Math.PI)/i)*0.5+k+e;},backIn:function(f,e,i,h,g){if(g===undefined){g=1.70158;}if(f===h){f-=0.001;}return i*(f/=h)*f*((g+1)*f-g)+e;},backOut:function(f,e,i,h,g){if(typeof g==="undefined"){g=1.70158;}return i*((f=f/h-1)*f*((g+1)*f+g)+1)+e;},backBoth:function(f,e,i,h,g){if(typeof g==="undefined"){g=1.70158;}if((f/=h/2)<1){return i/2*(f*f*(((g*=(1.525))+1)*f-g))+e;}return i/2*((f-=2)*f*(((g*=(1.525))+1)*f+g)+2)+e;},bounceIn:function(f,e,h,g){return h-b.Easing.bounceOut(g-f,0,h,g)+e;},bounceOut:function(f,e,h,g){if((f/=g)<(1/2.75)){return h*(7.5625*f*f)+e;}else{if(f<(2/2.75)){return h*(7.5625*(f-=(1.5/2.75))*f+0.75)+e;}else{if(f<(2.5/2.75)){return h*(7.5625*(f-=(2.25/2.75))*f+0.9375)+e;}}}return h*(7.5625*(f-=(2.625/2.75))*f+0.984375)+e;},bounceBoth:function(f,e,h,g){if(f<g/2){return b.Easing.bounceIn(f*2,0,h,g)*0.5+e;}return b.Easing.bounceOut(f*2-g,0,h,g)*0.5+h*0.5+e;}};b.Easing=a;},"3.6.0pr1",{requires:["anim-base"]});