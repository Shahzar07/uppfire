import './scrollcraft.js';
window.ScrollCraft.mount(document);
const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let paused=reduced.matches, framePending=false, selectedService='Motion design';
const hero=$('.hero');
const menu=$('.menu-button'), nav=$('#navigation');
function closeMenu(){nav.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation')}
menu.addEventListener('click',()=>{const opening=nav.hidden;nav.hidden=!opening;menu.setAttribute('aria-expanded',String(opening));menu.setAttribute('aria-label',opening?'Close navigation':'Open navigation')});
$$('a',nav).forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('click',e=>{if(!e.target.closest('.nav-block'))closeMenu()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
function updateMotion(){framePending=false;const y=window.scrollY;document.body.classList.toggle('scrolled',y>30);if(!paused&&innerWidth>700&&y<hero.offsetHeight){$('.hero-symbol').style.transform=`translateX(-50%) translateY(${y*.13}px)`;$('.hero-grid').style.transform=`translateY(${y*.05}px)`}else{$('.hero-symbol').style.transform='';$('.hero-grid').style.transform=''}}
function requestUpdate(){if(!framePending){framePending=true;requestAnimationFrame(updateMotion)}}
addEventListener('scroll',requestUpdate,{passive:true});addEventListener('resize',requestUpdate,{passive:true});updateMotion();
const motionButton=$('#motion-toggle'),footerMotion=$('#footer-motion');
function setMotion(value){paused=value;document.body.classList.toggle('motion-paused',paused);motionButton.setAttribute('aria-pressed',String(paused));motionButton.textContent=paused?'Enable motion ▷':'Pause motion Ⅱ';footerMotion.setAttribute('aria-pressed',String(paused));footerMotion.textContent=paused?'Motion off ▷':'Motion on Ⅱ';requestUpdate();document.dispatchEvent(new CustomEvent('uppfire:motion'))}
motionButton.addEventListener('click',()=>setMotion(!paused));footerMotion.addEventListener('click',()=>setMotion(!paused));reduced.addEventListener('change',e=>setMotion(e.matches));setMotion(paused);
// Goals stay attached to their own CTA so exploring another section cannot lose them.
const goals={launch:{title:'Make an entrance.',description:'Give your launch a clear story, a distinctive look, and a plan to reach the right people.',steps:[['Define the story','Creative strategy'],['Build the world','Brand creative + motion'],['Put it in front of people','Paid social + search']],service:'Creative + performance',brief:'Goal: Launch something new.\nFocus: A clear story, campaign creative, and a launch plan.\n\nMy brand, audience, and launch idea: '},scale:{title:'Find the next gear.',description:'Build on what is already resonating. Identify the next creative opportunity and give it a focused testing and distribution plan.',steps:[['Find the opportunity','Campaign & creative review'],['Test the next idea','Ad variants + message testing'],['Build on the learning','Paid media + iteration']],service:'Performance marketing',brief:'Goal: Grow what is working.\nFocus: Creative testing and paid campaign improvement.\n\nCurrent campaigns, audience, and growth goal: '},refresh:{title:'Bring a fresh perspective.',description:'Give your brand a new creative pulse while keeping what makes it recognisable. Start with a direction and build a useful family of assets.',steps:[['Sharpen the direction','Creative strategy'],['Make a visual statement','Brand creative + motion'],['Build the asset family','Campaign formats + variations']],service:'Brand creative',brief:'Goal: Refresh the creative.\nFocus: Creative direction, motion, and a coherent asset family.\n\nExisting brand, audience, and creative challenge: '}};
let selectedGoal='launch';
const goalLabels={launch:'Launch something new',scale:'Grow what’s working',refresh:'Refresh the creative'};
$$('[data-goal]').forEach(button=>button.addEventListener('click',()=>{
 selectedGoal=button.dataset.goal;
 $$('[data-goal]').forEach(b=>{const chosen=b===button;b.setAttribute('aria-pressed',String(chosen));b.replaceChildren(document.createTextNode(chosen?'Direction selected ':'Choose this direction '),Object.assign(document.createElement('span'),{textContent:chosen?'✓':'↗'}));b.lastElementChild.setAttribute('aria-hidden','true')});
 $$('[data-goal-card]').forEach(card=>card.classList.toggle('is-selected',card.dataset.goalCard===selectedGoal));
 $('#goal-selection-label').textContent=goalLabels[selectedGoal];
 $('[data-goal-project]').dataset.interest=goals[selectedGoal].service;
}));
// Mouse position warms the lettering from within. No cursor replacement or capture.
const ignition=$('.hero-symbol');let heatX=52,heatY=55,heatFrame=false;
function paintHeat(){heatFrame=false;ignition.style.setProperty('--heat-x',heatX+'%');ignition.style.setProperty('--heat-y',heatY+'%')}
hero.addEventListener('pointermove',e=>{if(paused||reduced.matches||e.pointerType!=='mouse'||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;const r=ignition.getBoundingClientRect();heatX=Math.max(12,Math.min(88,(e.clientX-r.left)/r.width*100));heatY=Math.max(20,Math.min(80,(e.clientY-r.top)/r.height*100));if(!heatFrame){heatFrame=true;requestAnimationFrame(paintHeat)}});
hero.addEventListener('pointerleave',()=>{heatX=52;heatY=55;paintHeat()});
// Arrow keys select tabs and preserve natural Tab navigation.
$$('[role=tablist]').forEach(list=>{const tabs=$$('[role=tab]',list);function syncTabs(){tabs.forEach(t=>t.tabIndex=t.getAttribute('aria-selected')==='true'?0:-1)}syncTabs();tabs.forEach(t=>t.addEventListener('click',syncTabs));list.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key))return;e.preventDefault();let index=tabs.indexOf(document.activeElement);if(e.key==='Home')index=0;else if(e.key==='End')index=tabs.length-1;else index=(index+(['ArrowRight','ArrowDown'].includes(e.key)?1:-1)+tabs.length)%tabs.length;tabs[index].click();tabs[index].focus()})});
const dialog=$('#project-dialog'),form=$('#brief-form');let dialogTrigger;
$$('[data-project]').forEach(b=>b.addEventListener('click',()=>{dialogTrigger=b;closeMenu();form.elements.service.value=b.dataset.interest||selectedService;if(b.hasAttribute('data-goal-project')){form.elements.idea.value=goals[selectedGoal].brief;}$('#brief-status').textContent='';dialog.showModal();document.body.style.overflow='hidden'}));
$('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});dialog.addEventListener('close',()=>{document.body.style.overflow='';dialogTrigger?.focus()});
form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const d=new FormData(form);const text=`UPPFIRE / PROJECT BRIEF\n\nBrand: ${d.get('brand').trim()}\nService: ${d.get('service')}\nTiming: ${d.get('timing').trim()||'To be discussed'}\n\nThe idea\n${d.get('idea').trim()}\n\nNext steps\nDefine deliverables, scope, budget, and timeline with your creative partner.\n\nThis brief was prepared locally. No inquiry has been sent.\n`;const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='uppfire-project-brief.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);$('#brief-status').textContent='Your brief is ready. Check your downloads to open and share it.'});
// Native details remain readable without script; opening one keeps the list concise.
$$('.faq details').forEach(detail=>detail.addEventListener('toggle',()=>{if(detail.open)$$('.faq details').forEach(other=>{if(other!==detail)other.open=false})}));

// Card entrances follow actual scroll distance and stay settled once revealed.
const arrivals=$$('[data-flight]').map(wrap=>({wrap,progress:0}));
const processCards=$$('[data-process-stage]');
const processLinks=$$('.delivery-nav a');
let cardFrame=false;
function renderCardMotion(){
 cardFrame=false;
 const viewport=innerHeight;
 const quiet=paused||reduced.matches;
 for(const item of arrivals){
  const rect=item.wrap.getBoundingClientRect();
  const incoming=Math.max(0,Math.min(1,(viewport*.96-rect.top)/(viewport*.35)));
  item.progress=quiet?1:Math.max(item.progress,incoming);
  item.wrap.style.setProperty('--arrival',item.progress.toFixed(4));
  item.wrap.classList.toggle('has-arrived',item.progress>=1);
  item.wrap.classList.toggle('is-visible',rect.bottom>0&&rect.top<viewport);
 }
 let current=processCards[0];
 for(const card of processCards){if(card.getBoundingClientRect().top<viewport*.57)current=card}
 processLinks.forEach(link=>{const active=link.getAttribute('href')==='#'+current.id;link.classList.toggle('is-current',active);if(active)link.setAttribute('aria-current','step');else link.removeAttribute('aria-current')});
}
function requestCardMotion(){if(!cardFrame){cardFrame=true;requestAnimationFrame(renderCardMotion)}}
$$('.card-world').forEach(section=>section.classList.add('flight-ready'));
renderCardMotion();
addEventListener('scroll',requestCardMotion,{passive:true});addEventListener('resize',requestCardMotion,{passive:true});
document.addEventListener('uppfire:motion',requestCardMotion);reduced.addEventListener('change',requestCardMotion);
document.addEventListener('visibilitychange',()=>document.body.classList.toggle('document-hidden',document.hidden));
document.addEventListener('focusin',e=>{const wrap=e.target.closest('[data-flight]');if(!wrap)return;const item=arrivals.find(item=>item.wrap===wrap);if(item){item.progress=1;wrap.style.setProperty('--arrival','1');wrap.classList.add('has-arrived')}});

// The signal wall depicts the real service mix, not client performance figures.
const signalWall=$('.signal-wall'),signalButtons=$$('[data-signal]'),signalRows=$$('.signal-row'),footerStudio=$('.footer-studio');
const signalViews={
 all:{count:6,unit:'disciplines.',statement:'One direction. Forward.',description:'Motion, brand, paid social, paid search, strategy, and conversion. Connected around what your business needs next.',detail:'Six services. One connected team.',service:'Creative + performance'},
 creative:{count:2,unit:'disciplines.',statement:'Make the first impression count.',description:'Motion & animation. Brand & ad creative. The craft that makes your story feel unmistakably yours.',detail:'Motion & animation + brand & ad creative.',service:'Brand creative'},
 media:{count:2,unit:'disciplines.',statement:'Reach the people who matter.',description:'Paid social and paid search. Creative thinking meets audience intent and a focused distribution plan.',detail:'Paid social + paid search.',service:'Performance marketing'},
 strategy:{count:2,unit:'disciplines.',statement:'Give every idea a purpose.',description:'Creative strategy and conversion creative. A clear brief, a coherent offer, and a considered next step.',detail:'Creative strategy + conversion creative.',service:'Creative strategy'}
};
let signalView='all',signalFrame=false,signalCountSettled=false,signalTimer;
function renderSignalMotion(){
 signalFrame=false;const vh=innerHeight,rect=signalWall.getBoundingClientRect();const quiet=paused||reduced.matches;
 const p=Math.max(0,Math.min(1,-rect.top/Math.max(1,signalWall.offsetHeight-vh)));
 const entrance=Math.max(0,Math.min(1,(vh*.72-rect.top)/(vh*.86)));
 signalWall.style.setProperty('--signal-p',quiet?0:p.toFixed(4));
 signalWall.classList.toggle('signal-visible',rect.bottom>0&&rect.top<vh);
 if(!signalCountSettled){signalWall.style.setProperty('--digit',quiet?6:(6*(1-Math.pow(1-entrance,3))).toFixed(4));if(quiet||entrance>=1)signalCountSettled=true}
 const footerRect=footerStudio.getBoundingClientRect();const signature=$('.footer-signature').getBoundingClientRect();
 const reveal=Math.max(0,Math.min(1,(vh-signature.top)/(Math.max(1,signature.height)*.9)));
 footerStudio.style.setProperty('--footer-reveal',quiet?1:reveal.toFixed(4));
}
function requestSignalMotion(){if(!signalFrame){signalFrame=true;requestAnimationFrame(renderSignalMotion)}}
signalButtons.forEach(button=>button.addEventListener('click',()=>{
 signalView=button.dataset.signal;const view=signalViews[signalView];signalCountSettled=true;
 signalButtons.forEach(b=>{const selected=b===button;b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1});
 signalRows.forEach(row=>{const focused=signalView==='all'||row.dataset.family===signalView;row.classList.toggle('is-muted',!focused);row.classList.toggle('is-focused',focused&&signalView!=='all')});
 signalWall.classList.add('filter-changing');signalWall.style.setProperty('--digit',String(view.count));clearTimeout(signalTimer);signalTimer=setTimeout(()=>signalWall.classList.remove('filter-changing'),800);
 $('#signal-accessible-number').textContent=String(view.count);$('#signal-unit').textContent=view.unit;$('#signal-statement').textContent=view.statement;$('#signal-explanation').textContent=view.description;
 $('#signal-details').setAttribute('aria-labelledby',button.id);$('#signal-details>span').textContent=view.detail;selectedService=view.service;
}));
renderSignalMotion();addEventListener('scroll',requestSignalMotion,{passive:true});addEventListener('resize',requestSignalMotion,{passive:true});document.addEventListener('uppfire:motion',requestSignalMotion);reduced.addEventListener('change',requestSignalMotion);

// The portfolio follows a real ellipse: every step moves all cards around the ring.
const orbitStage=$('.orbit-stage'),orbitTrack=$('.orbit-track'),orbitCards=$$('[data-orbit-card]');
const orbitFilm=$('.orbit-film');
let orbitIndex=0,orbitRotation=0,orbitTarget=0,orbitFrame=0,orbitLast=0,orbitVisible=false;
const orbitStep=2*Math.PI/orbitCards.length;
function paintOrbit(){
 const radius=innerWidth<=700?Math.max(260,orbitStage.clientWidth*.8):Math.max(580,orbitStage.clientWidth*.53);
 orbitCards.forEach((card,i)=>{
  const angle=i*orbitStep+orbitRotation,depth=Math.cos(angle),side=Math.sin(angle);
  const scale=.7+.3*(depth+1)/2;
  const opacity=Math.max(0,Math.min(1,(depth+.25)/.65));
  card.style.transform=`translate(-50%,0) translate(${(side*radius).toFixed(2)}px,${(-65*(1-depth)).toFixed(2)}px) scale(${scale.toFixed(4)}) perspective(1000px) rotateY(${(-side*30).toFixed(2)}deg) rotateZ(${(side*3).toFixed(2)}deg)`;
  card.style.opacity=opacity.toFixed(3);card.style.zIndex=String(Math.round((depth+1)*50));
 });
}
function orbitTick(time){
 const delta=orbitLast?Math.min(40,time-orbitLast):16;orbitLast=time;
 orbitRotation+=(orbitTarget-orbitRotation)*(1-Math.exp(-delta/135));
 if(Math.abs(orbitTarget-orbitRotation)<.0005){orbitRotation=orbitTarget;orbitFrame=0;orbitLast=0;paintOrbit();return}
 paintOrbit();orbitFrame=requestAnimationFrame(orbitTick);
}
function syncOrbitFilm(){
 if(!paused&&!reduced.matches&&orbitVisible&&!document.hidden&&orbitIndex===0){orbitFilm.play().catch(()=>{});}else orbitFilm.pause();
}
function setOrbit(direction){
 orbitIndex=(orbitIndex+direction+orbitCards.length)%orbitCards.length;orbitTarget-=direction*orbitStep;
 orbitCards.forEach((card,i)=>{card.classList.toggle('is-active',i===orbitIndex);card.setAttribute('aria-hidden',String(i!==orbitIndex))});
 const selected=orbitCards[orbitIndex].dataset;
 $('#orbit-title').textContent=selected.title;$('#orbit-kind').textContent=selected.kind;$('#orbit-description').textContent=selected.description;
 $('#orbit-index').textContent=String(orbitIndex+1).padStart(2,'0');$('.orbit-progress i').style.transform=`translateX(${orbitIndex*100}%)`;
 if(paused||reduced.matches){cancelAnimationFrame(orbitFrame);orbitFrame=0;orbitLast=0;orbitRotation=orbitTarget;paintOrbit()}else if(!orbitFrame){orbitFrame=requestAnimationFrame(orbitTick)}
 syncOrbitFilm();
}
$('#orbit-prev').addEventListener('click',()=>setOrbit(-1));$('#orbit-next').addEventListener('click',()=>setOrbit(1));
orbitStage.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();setOrbit(e.key==='ArrowLeft'?-1:1)}});
let orbitTouch;
orbitStage.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')orbitTouch={x:e.clientX,y:e.clientY,id:e.pointerId}});
orbitStage.addEventListener('pointerup',e=>{if(!orbitTouch||e.pointerId!==orbitTouch.id)return;const dx=e.clientX-orbitTouch.x,dy=e.clientY-orbitTouch.y;orbitTouch=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3)setOrbit(dx<0?1:-1)});
orbitStage.addEventListener('pointercancel',()=>{orbitTouch=null});
addEventListener('resize',paintOrbit,{passive:true});
document.addEventListener('uppfire:motion',()=>{if(paused){cancelAnimationFrame(orbitFrame);orbitFrame=0;orbitLast=0;orbitRotation=orbitTarget;paintOrbit()}syncOrbitFilm()});
document.addEventListener('visibilitychange',syncOrbitFilm);
new IntersectionObserver(entries=>{orbitVisible=entries[0].isIntersecting;syncOrbitFilm()},{threshold:.15}).observe(orbitStage);
new IntersectionObserver(entries=>{document.body.classList.toggle('hero-out-of-view',!entries[0].isIntersecting)},{threshold:0}).observe(hero);
orbitTrack.classList.add('is-ready');setOrbit(0);paintOrbit();
