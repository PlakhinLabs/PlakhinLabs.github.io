(function(){
var root=document.documentElement,reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
/* 1. dot grid glow under the pointer */
if(!reduce){var px=0,py=0,pend=false,hide=0;
function upd(){pend=false;root.style.setProperty("--mx",px+"px");root.style.setProperty("--my",py+"px");root.style.setProperty("--gl",1)}
addEventListener("pointermove",function(e){px=e.clientX;py=e.clientY;clearTimeout(hide);if(e.pointerType==="touch"){hide=setTimeout(function(){root.style.setProperty("--gl",0)},700)}if(!pend){pend=true;requestAnimationFrame(upd)}},{passive:true});
root.addEventListener("pointerleave",function(){root.style.setProperty("--gl",0)});
addEventListener("pointerup",function(e){if(e.pointerType==="touch"){hide=setTimeout(function(){root.style.setProperty("--gl",0)},700)}},{passive:true})}

/* Smooth continuous glow moving at a constant distance per second. */
if(!reduce&&matchMedia("(hover: hover)").matches){
 document.querySelectorAll(".card,.net").forEach(function(card){
  var cv=document.createElement("canvas"),cx=cv.getContext("2d");if(!cx)return;
  cv.className="edge-fx";cv.setAttribute("aria-hidden","true");card.appendChild(cv);
  var path=document.createElementNS("http://www.w3.org/2000/svg","path"),pts=[],L=0,w=0,h=0,dpr=1,active=false,raf=0,last=0,pos=0;
  function size(){
   w=card.offsetWidth;h=card.offsetHeight;dpr=Math.min(devicePixelRatio||1,2);
   cv.width=(w+2)*dpr;cv.height=(h+2)*dpr;
   var r=11.5,x=1.75,y=1.75,X=w+.25,Y=h+.25;
   var d="M "+(x+r)+" "+y+" H "+(X-r)+" A "+r+" "+r+" 0 0 1 "+X+" "+(y+r)+" V "+(Y-r)+" A "+r+" "+r+" 0 0 1 "+(X-r)+" "+Y+" H "+(x+r)+" A "+r+" "+r+" 0 0 1 "+x+" "+(Y-r)+" V "+(y+r)+" A "+r+" "+r+" 0 0 1 "+(x+r)+" "+y+" Z";
   path.setAttribute("d",d);L=path.getTotalLength();pts=[];
   var N=Math.ceil(L/1.5);for(var i=0;i<=N;i++){var p=path.getPointAtLength(i*L/N);pts.push([p.x,p.y])}
   render();
  }
  function at(s){var n=pts.length-1,u=((s%L+L)%L)/L*n,i=Math.floor(u),f=u-i,a=pts[i],b=pts[(i+1)%n];return[a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f]}
  function render(){
   if(!pts.length)return;
   cx.setTransform(dpr,0,0,dpr,0,0);cx.clearRect(0,0,w+2,h+2);
   var tail=Math.min(210,L*.32),N=Math.ceil(tail/1.5),a=at(pos-tail);
   cx.lineCap="round";cx.lineJoin="round";
   for(var i=1;i<=N;i++){
    var t=i/N,b=at(pos-tail+tail*t),v=Math.sin(Math.PI*t),alpha=Math.pow(v,1.4)*.95;
    var white=Math.pow(v,7)*.45,rr=Math.round(66+(220-66)*white),gg=Math.round(131+(235-131)*white),bb=235;
    cx.lineWidth=1.6;cx.strokeStyle="rgba("+rr+","+gg+","+bb+","+alpha+")";
    cx.beginPath();cx.moveTo(a[0],a[1]);cx.lineTo(b[0],b[1]);cx.stroke();a=b;
   }
  }
  function frame(t){if(!active)return;var dt=Math.min((t-last)/1000,.05);last=t;pos=(pos+75*dt)%L;render();raf=requestAnimationFrame(frame)}
  function start(){if(active||document.hidden)return;active=true;last=performance.now();raf=requestAnimationFrame(frame)}
  function stop(){active=false;cancelAnimationFrame(raf)}
  size();if("ResizeObserver" in window)new ResizeObserver(size).observe(card);
  card.addEventListener("pointerenter",start);card.addEventListener("pointerleave",stop);
  document.addEventListener("visibilitychange",function(){if(document.hidden)stop();else if(card.matches(":hover"))start()});
 });
}

/* 2. matrix rain logo */
var cv=document.getElementById("mx");if(!cv||!cv.getContext)return;
var wrap=cv.parentNode,hero=wrap.parentNode,ctx=cv.getContext("2d");
var CW=4,CH=6,W=0,H=0,cols=0,rows=0,dpr=1,mk=null,on=null,lit=null,list=null,ch=null,drops=null,tStart=0,last=0,running=false,visible=true,raf=0;
var ink="#fff",blue="#4283EB",SET1="01:;+*/<>=-",SET2="PLAKHINLABS";
var P=new Path2D("M22 30H160A46 46 0 0 1 160 122H100"),L=new Path2D("M37 85V215H190");
var ptr={x:-999,y:-999,tx:-999,ty:-999,r:0,active:false,R:56},to=0;
function colors(){var s=getComputedStyle(root);ink=s.getPropertyValue("--lp").trim()||"#fff";blue=s.getPropertyValue("--bl").trim()||"#4283EB"}
function rc(s){return s.charAt(Math.random()*s.length|0)}
function build(){
 var r=wrap.getBoundingClientRect();W=Math.floor(r.width);H=Math.floor(r.height);if(!W||!H)return false;
 dpr=Math.min(window.devicePixelRatio||1,2);cv.width=W*dpr;cv.height=H*dpr;
 cols=Math.floor(W/CW);rows=Math.floor(H/CH);
 var oc=document.createElement("canvas");oc.width=cols;oc.height=rows;var o=oc.getContext("2d",{willReadFrequently:true});
 var S=Math.min(H-95,210),ox=(cols*CW-S)/2,oy=6;
 o.save();o.translate(ox/CW,oy/CH);o.scale(S/256/CW,S/256/CH);o.lineWidth=30;
 o.strokeStyle="#f00";o.stroke(P);o.strokeStyle="#00f";o.stroke(L);o.restore();
 o.save();o.scale(1/CW,1/CH);
 var fontSize=Math.min(48,(W-34)/6.5);o.font="600 "+fontSize+"px system-ui, sans-serif";
 var tw=o.measureText("PlakhinLabs").width;
 if(tw>W-30){fontSize*= (W-30)/tw;o.font="600 "+fontSize+"px system-ui, sans-serif";tw=o.measureText("PlakhinLabs").width}
 var tx=(W-tw)/2,ty=S+20;
 o.textBaseline="top";o.fillStyle="#f00";o.fillText("Plakhin",tx,ty);
 o.fillStyle="#00f";o.fillText("Labs",tx+o.measureText("Plakhin").width,ty);o.restore();
 var d=o.getImageData(0,0,cols,rows).data;
 mk=new Uint8Array(cols*rows);list=[];
 for(var i=0;i<cols*rows;i++){var a=d[i*4+3];if(a>110){mk[i]=d[i*4]>d[i*4+2]?1:2;list.push(i)}}
 on=new Uint8Array(cols*rows);lit=new Float32Array(cols*rows);ch=new Array(cols*rows);
 for(i=0;i<ch.length;i++)ch[i]=rc(mk[i]?SET2:SET1);
 drops=[];for(var c=0;c<cols;c++)drops.push(newDrop(true));
 tStart=performance.now();
 if(reduce){for(i=0;i<list.length;i++){on[list[i]]=1;lit[list[i]]=1}}
 return true}
function newDrop(init){return{y:init?-Math.random()*rows*1.6:-Math.random()*rows*.6,v:9+Math.random()*14,len:6+(Math.random()*12|0)}}
function disp(x,y){
 if(ptr.r<2)return [x,y];
 var dx=x-ptr.x,dy=y-ptr.y,d2=dx*dx+dy*dy,R=ptr.r;
 if(d2>=R*R)return [x,y];
 var d=Math.sqrt(d2),r0=R*.55,nd=r0+(R-r0)*d/R;
 if(d<.01){dx=0;dy=-1;d=1}
 return [ptr.x+dx/d*nd,ptr.y+dy/d*nd]}
function put(c,r,chr,col,al){
 var p=disp(c*CW+CW/2,r*CH+CH/2);ctx.globalAlpha=al;ctx.fillStyle=col;ctx.fillText(chr,p[0],p[1])}
function draw(t,dt){
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);ctx.font="6px ui-monospace,Menlo,Consolas,monospace";ctx.textAlign="center";ctx.textBaseline="middle";
 ptr.x+=(ptr.tx-ptr.x)*.4;ptr.y+=(ptr.ty-ptr.y)*.4;ptr.r+=((ptr.active?ptr.R:0)-ptr.r)*.18;
 var el=t-tStart,i,c,k;
 if(!reduce){
  for(c=0;c<cols;c++){var dr=drops[c];dr.y+=dr.v*dt;var head=Math.floor(dr.y);
   if(head-dr.len>rows){drops[c]=newDrop(false);continue}
   if(head>=0&&head<rows){k=head*cols+c;if(mk[k])on[k]=1}
   for(i=0;i<dr.len;i++){var rw=head-i;if(rw<0||rw>=rows)continue;k=rw*cols+c;
    if(Math.random()<.04)ch[k]=rc(mk[k]?SET2:SET1);
    var f=1-i/dr.len;
    if(i===0)put(c,rw,ch[k],ink,.9);else put(c,rw,ch[k],blue,f*.5)}}
  if(el>6000){for(i=0;i<8;i++){k=list[Math.random()*list.length|0];on[k]=1}}
 }
 for(i=0;i<list.length;i++){k=list[i];
  if(on[k]&&lit[k]<1)lit[k]=Math.min(1,lit[k]+dt*3);
  if(lit[k]<=0)continue;
  if(!reduce&&Math.random()<.01)ch[k]=rc(SET2);
  var cc=k%cols,rr=(k-cc)/cols;
  put(cc,rr,ch[k],mk[k]===1?ink:blue,.35+.65*lit[k])}
 ctx.globalAlpha=1}
function loop(t){
 if(!running)return;raf=requestAnimationFrame(loop);
 if(t-last<32)return;var dt=Math.min((t-last)/1000,.06);last=t;draw(t,dt)}
function start(){if(reduce||running||!visible||document.hidden)return;running=true;last=performance.now();raf=requestAnimationFrame(loop)}
function stop(){running=false;cancelAnimationFrame(raf)}
function init(){colors();if(!build())return;hero.classList.add("js-mx");
 if(reduce){draw(performance.now(),0)}else start()}
function pos(e){var r=cv.getBoundingClientRect();ptr.tx=e.clientX-r.left;ptr.ty=e.clientY-r.top;ptr.R=e.pointerType==="touch"?72:56}
if(!reduce){
 cv.addEventListener("pointerenter",function(e){pos(e);ptr.x=ptr.tx;ptr.y=ptr.ty;clearTimeout(to);ptr.active=true});
 cv.addEventListener("pointermove",function(e){pos(e);clearTimeout(to);ptr.active=true});
 cv.addEventListener("pointerdown",function(e){pos(e);ptr.x=ptr.tx;ptr.y=ptr.ty;clearTimeout(to);ptr.active=true});
 cv.addEventListener("pointerleave",function(){ptr.active=false});
 cv.addEventListener("pointercancel",function(){ptr.active=false});
 cv.addEventListener("pointerup",function(e){if(e.pointerType==="touch"){clearTimeout(to);to=setTimeout(function(){ptr.active=false},650)}});
 document.addEventListener("visibilitychange",function(){document.hidden?stop():start()});
 if("IntersectionObserver" in window)new IntersectionObserver(function(en){visible=en[0].isIntersecting;visible?start():stop()}).observe(wrap)}
var rt,lw=0;addEventListener("resize",function(){clearTimeout(rt);rt=setTimeout(function(){var w=wrap.getBoundingClientRect().width|0;if(w===lw)return;lw=w;stop();if(build()){reduce?draw(performance.now(),0):start()}},150)});
new MutationObserver(function(){colors();if(reduce&&mk)draw(performance.now(),0)}).observe(root,{attributes:true,attributeFilter:["data-theme"]});
lw=wrap.getBoundingClientRect().width|0;init();
})();
