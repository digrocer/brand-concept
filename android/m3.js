/* M3 ripple — Android 16 concept. Pointer-driven ink ripple on
   every tappable surface; ripple geometry mirrors Material 3. */
(function(){
'use strict';
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
var SEL='.btn,.cell,.chip,.dock button,.payopt,.ordercard,.iconbtn,.tile .ph,.catpill .em,.cartbar,.livepill,.chk,.vehopt button';
document.addEventListener('pointerdown',function(e){
  var t=e.target.closest(SEL);
  if(!t)return;
  var r=t.getBoundingClientRect();
  if(!r.width)return;
  var d=Math.max(r.width,r.height)*2.2;
  var rip=document.createElement('span');
  rip.className='m3rip';
  rip.style.width=rip.style.height=d+'px';
  rip.style.left=(e.clientX-r.left-d/2)+'px';
  rip.style.top=(e.clientY-r.top-d/2)+'px';
  var cs=getComputedStyle(t);
  if(cs.position==='static')t.style.position='relative';
  if(cs.overflow!=='hidden'&&!t.classList.contains('dock'))t.style.overflow='hidden';
  t.appendChild(rip);
  setTimeout(function(){if(rip.parentNode)rip.parentNode.removeChild(rip);},600);
},{passive:true});
})();
