/* ============================================================
   DGFX — DiGrocer particle engine for the iOS-27 concept.
   Modes:
     logo   — motes assemble into the Kente-D mark and breathe
     check  — motes spiral into a ✓ with a ring pulse
     drift  — ambient falling leaves
     pollen — glowing motes (dark surfaces)
   Plus DGFX.burstAt(canvas,x,y,colors) — one-shot leaf burst
   at a point (add-to-cart, order placed, delivery complete).
   Honors prefers-reduced-motion; pauses off-screen canvases.
============================================================ */
(function(){
'use strict';
var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function rnd(a,b){return a+Math.random()*(b-a);}
function pick(a){return a[(Math.random()*a.length)|0];}

function leaf(ctx,x,y,rot,s,col,a){
  ctx.save();ctx.translate(x,y);ctx.rotate(rot);
  ctx.globalAlpha=Math.max(0,Math.min(1,a));
  ctx.fillStyle=col;ctx.beginPath();
  ctx.moveTo(-s,s);
  ctx.quadraticCurveTo(-s*.8,-s*.6,s,-s);
  ctx.quadraticCurveTo(s*.6,s*.8,-s,s);
  ctx.closePath();ctx.fill();ctx.restore();
}

/* ---- shape drawers (sampled to particle targets) ---- */
var KENTE_D='M12 6 L12 112 L50 112 C78 112 92 91 92 59 C92 27 78 6 50 6 Z';
var SHAPES={
  logo:function(o,W,H,opt){
    var S=Math.min(W,H)*(opt.scale||.74),sc=S/118,ox=(W-S*100/118)/2,oy=(H-S)/2;
    var d=new Path2D(KENTE_D);
    o.save();o.translate(ox,oy);o.scale(sc,sc);
    o.fillStyle=opt.main||'#2DA94F';o.fill(d);
    o.save();o.clip(d);o.fillStyle=opt.spine||'#1B7A38';o.fillRect(12,6,18,106);o.restore();
    o.restore();
  },
  check:function(o,W,H,opt){
    o.strokeStyle=opt.main||'#2DA94F';o.lineWidth=Math.min(W,H)*.13;
    o.lineCap='round';o.lineJoin='round';
    o.beginPath();o.moveTo(W*.30,H*.52);o.lineTo(W*.45,H*.68);o.lineTo(W*.70,H*.32);o.stroke();
  }
};

var systems=[];
var byCanvas=new Map();

function makeSys(canvas,mode,opt){
  opt=opt||{};
  var ctx=canvas.getContext('2d');
  var W=0,H=0,t=0,P=[],R=[],phase='fly',pt=0;
  function resize(){
    var dpr=Math.min(2,window.devicePixelRatio||1);
    W=canvas.clientWidth;H=canvas.clientHeight;
    canvas.width=Math.max(1,W*dpr);canvas.height=Math.max(1,H*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function cols(){return opt.colors||['#2DA94F','#1B7A38','#F5A623'];}

  /* ambient spawners */
  function seedDrift(){
    P=[];for(var i=0;i<(opt.count||14);i++)P.push(dp(true));
  }
  function dp(anyY){
    return {x:rnd(0,W),y:anyY?rnd(-20,H):rnd(-30,-12),vy:rnd(.25,.7),
      rot:rnd(0,6.28),rs:rnd(-.016,.016),s:rnd(4,8.5),col:pick(cols()),
      ph:rnd(0,6.28),f:rnd(.012,.026),amp:rnd(.4,1)};
  }
  function seedPollen(){
    P=[];for(var i=0;i<(opt.count||24);i++){
      P.push({bx:rnd(8,W-8),by:rnd(8,H-8),s:rnd(1.2,2.7),
        a:rnd(.01,.022),b:rnd(.008,.018),c2:rnd(.02,.05),
        p1:rnd(0,6.28),p2:rnd(0,6.28),p3:rnd(0,6.28),tw:0,
        col:Math.random()<.75?(opt.glow||'#F5A623'):(opt.glow2||'#7ED99A')});
    }
  }
  /* formation spawner */
  function spawnForm(){
    var ow=Math.max(1,W|0),oh=Math.max(1,H|0);
    var oc=document.createElement('canvas');oc.width=ow;oc.height=oh;
    var o=oc.getContext('2d',{willReadFrequently:true});
    SHAPES[mode](o,ow,oh,opt);
    var d;try{d=o.getImageData(0,0,ow,oh).data;}catch(e){d=null;}
    var pts=[],st=opt.step||3;
    if(d)for(var y=1;y<oh;y+=st)for(var x=1;x<ow;x+=st){
      var i=(y*ow+x)*4;
      if(d[i+3]>150)pts.push({tx:x+rnd(-1,1),ty:y+rnd(-1,1),col:'rgb('+d[i]+','+d[i+1]+','+d[i+2]+')'});
    }
    var MAX=opt.max||650;
    if(pts.length>MAX){var k=MAX/pts.length;pts=pts.filter(function(){return Math.random()<k;});}
    P=[];R=[];t=0;pt=0;phase='fly';
    var big=Math.max(W,H);
    for(var j=0;j<pts.length;j++){
      var q=pts[j],a=rnd(0,6.2832),rr=big*rnd(.5,.85);
      P.push({x:W/2+Math.cos(a)*rr,y:H/2+Math.sin(a)*rr,vx:0,vy:0,
        tx:q.tx,ty:q.ty,col:q.col,sz:rnd(1.1,2.2),
        k:rnd(.014,.032),dmp:rnd(.84,.9),delay:rnd(0,mode==='check'?16:40),
        ph:rnd(0,6.2832),a:0,tw:0});
    }
  }
  function replay(){
    resize();
    if(mode==='drift')seedDrift();
    else if(mode==='pollen')seedPollen();
    else spawnForm();
    if(reduced){
      if(mode==='logo'||mode==='check'){
        for(var i=0;i<P.length;i++){P[i].x=P[i].tx;P[i].y=P[i].ty;P[i].a=1;P[i].delay=0;}
        phase='hold';pt=1;
      }
      step();draw();
    }
  }
  function step(){
    t++;var i,p;
    if(mode==='drift'){
      for(i=P.length-1;i>=0;i--){p=P[i];
        p.y+=p.vy;p.x+=Math.sin(t*p.f+p.ph)*p.amp;p.rot+=p.rs;
        if(p.y>H+18)P.splice(i,1);
      }
      if(P.length<(opt.count||14)&&Math.random()<.12)P.push(dp(false));
      return;
    }
    if(mode==='pollen'){
      for(i=0;i<P.length;i++){p=P[i];if(Math.random()<.004)p.tw=1;p.tw*=.9;}
      return;
    }
    /* formation */
    if(phase==='fly'){
      var ok=true;
      for(i=0;i<P.length;i++){p=P[i];
        if(p.delay>0){p.delay--;ok=false;continue;}
        p.a=Math.min(1,p.a+.09);
        var dx=p.tx-p.x,dy=p.ty-p.y;
        p.vx=(p.vx+dx*p.k)*p.dmp;p.vy=(p.vy+dy*p.k)*p.dmp;
        p.x+=p.vx;p.y+=p.vy;
        if(Math.abs(dx)>.6||Math.abs(dy)>.6||Math.abs(p.vx)+Math.abs(p.vy)>.3)ok=false;
        if(Math.random()<.004)p.tw=1;p.tw*=.9;
      }
      if(t>220){for(i=0;i<P.length;i++){p=P[i];p.x=p.tx;p.y=p.ty;p.a=1;p.delay=0;}ok=true;}
      if(ok){phase='hold';pt=0;if(mode==='check')R.push({r:8,al:.65});}
    }else if(phase==='hold'){
      pt++;
      for(i=0;i<P.length;i++){p=P[i];if(Math.random()<.005)p.tw=1;p.tw*=.9;}
    }
    for(i=R.length-1;i>=0;i--){R[i].r+=2.6;R[i].al-=.022;if(R[i].al<=0)R.splice(i,1);}
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    var i,p;
    if(mode==='drift'){
      for(i=0;i<P.length;i++){p=P[i];
        var fade=p.y<14?p.y/14:(p.y>H-22?Math.max(0,(H-p.y)/22):1);
        leaf(ctx,p.x,p.y,p.rot,p.s,p.col,(opt.alpha||.85)*fade);}
      return;
    }
    if(mode==='pollen'){
      for(i=0;i<P.length;i++){p=P[i];
        var x=p.bx+Math.sin(t*p.a+p.p1)*13,y=p.by+Math.cos(t*p.b+p.p2)*10;
        var al=.25+.5*(.5+.5*Math.sin(t*p.c2+p.p3));
        ctx.save();ctx.globalAlpha=Math.min(1,al+p.tw*.5);
        ctx.shadowColor=p.col;ctx.shadowBlur=8;ctx.fillStyle=p.col;
        ctx.beginPath();ctx.arc(x,y,p.s*(1+p.tw*1.5),0,6.29);ctx.fill();ctx.restore();}
      return;
    }
    for(i=0;i<P.length;i++){p=P[i];
      if(p.a<=0)continue;
      var px=p.x,py=p.y;
      if(phase==='hold'){
        px=p.tx+Math.sin(t*.045+p.ph)*.5;py=p.ty+Math.cos(t*.04+p.ph)*.5;
      }
      ctx.globalAlpha=Math.max(0,Math.min(1,p.a+p.tw*.6));
      ctx.fillStyle=p.col;
      ctx.beginPath();ctx.arc(px,py,p.sz*(1+p.tw*1.3),0,6.2832);ctx.fill();
    }
    ctx.globalAlpha=1;
    if(R.length){
      ctx.lineWidth=3;
      for(i=0;i<R.length;i++){
        ctx.globalAlpha=Math.max(0,R[i].al);ctx.strokeStyle=opt.ring||opt.main||'#2DA94F';
        ctx.beginPath();ctx.arc(W/2,H/2,R[i].r,0,6.2832);ctx.stroke();}
      ctx.globalAlpha=1;
    }
  }
  replay();
  var sys={canvas:canvas,replay:replay,step:step,draw:draw,active:true};
  return sys;
}

/* ---- one-shot bursts on a shared overlay canvas ---- */
function makeBurstLayer(canvas){
  var ctx=canvas.getContext('2d');
  var W=0,H=0,P=[];
  function resize(){
    var dpr=Math.min(2,window.devicePixelRatio||1);
    W=canvas.clientWidth;H=canvas.clientHeight;
    canvas.width=Math.max(1,W*dpr);canvas.height=Math.max(1,H*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  resize();
  var sys={canvas:canvas,active:true,
    step:function(){
      for(var i=P.length-1;i>=0;i--){var p=P[i];
        p.vy+=.11;p.vx*=.985;p.vy*=.99;
        p.x+=p.vx+(p.life>20?Math.sin(p.life*.18+p.ph)*.6:0);
        p.y+=p.vy;p.rot+=p.rs;p.life++;
        if(p.life>p.max||p.y>H+20)P.splice(i,1);
      }
    },
    draw:function(){
      ctx.clearRect(0,0,W,H);
      for(var i=0;i<P.length;i++){var p=P[i];
        leaf(ctx,p.x,p.y,p.rot,p.s,p.col,1-p.life/p.max);}
    },
    fire:function(x,y,colors,n){
      if(reduced)return;
      resize();
      colors=colors||['#2DA94F','#1B7A38','#F5A623'];
      n=n||14;
      for(var i=0;i<n;i++){
        var a=rnd(0,Math.PI*2),sp=rnd(1.6,4.6);
        P.push({x:x,y:y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-1.8,
          rot:rnd(0,6.28),rs:rnd(-.15,.15),s:rnd(3.5,7),col:pick(colors),
          life:0,max:rnd(55,90),ph:rnd(0,6.28)});
      }
    }};
  return sys;
}

/* ---- public API ---- */
var io=('IntersectionObserver' in window)?new IntersectionObserver(function(es){
  es.forEach(function(e){var s=byCanvas.get(e.target);if(s)s.active=e.isIntersecting;});
},{rootMargin:'60px'}):null;

window.DGFX={
  mount:function(canvas,mode,opt){
    var s=mode==='burstlayer'?makeBurstLayer(canvas):makeSys(canvas,mode,opt);
    systems.push(s);byCanvas.set(canvas,s);
    if(io)io.observe(canvas);
    return s;
  },
  replay:function(canvas){var s=byCanvas.get(canvas);if(s&&s.replay)s.replay();},
  burstAt:function(canvas,x,y,colors,n){var s=byCanvas.get(canvas);if(s&&s.fire)s.fire(x,y,colors,n);}
};

if(!reduced){
  (function loop(){
    for(var i=0;i<systems.length;i++){
      if(systems[i].active){systems[i].step();systems[i].draw();}
    }
    requestAnimationFrame(loop);
  })();
}
var rt;window.addEventListener('resize',function(){
  clearTimeout(rt);rt=setTimeout(function(){
    systems.forEach(function(s){if(s.replay)s.replay();});
  },180);
});
})();
