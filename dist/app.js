import './scrollcraft.js';
window.ScrollCraft.mount(document);
const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const finePointer=matchMedia('(hover:hover) and (pointer:fine)');
const WHATSAPP='923305078441';
let paused=reduced.matches, framePending=false, selectedService='Not sure yet';
const quiet=()=>paused||reduced.matches;
// Centre a child inside its own horizontal scroller without moving the page.
function centerIn(row,child){if(!row||!child||row.scrollWidth<=row.clientWidth)return;row.scrollTo({left:child.offsetLeft-(row.clientWidth-child.offsetWidth)/2,behavior:quiet()?'auto':'smooth'})}
const hero=$('.hero');
const menu=$('.menu-button'), nav=$('#navigation');
function closeMenu(){nav.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation')}
menu.addEventListener('click',()=>{const opening=nav.hidden;nav.hidden=!opening;menu.setAttribute('aria-expanded',String(opening));menu.setAttribute('aria-label',opening?'Close navigation':'Open navigation')});
$$('a',nav).forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('click',e=>{if(!e.target.closest('.nav-block'))closeMenu()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
// The intro curtain is CSS-only; once it has lifted it leaves the tree.
setTimeout(()=>$('.intro')?.remove(),2200);
const readBar=$('.scroll-progress');
function updateMotion(){framePending=false;const y=window.scrollY;document.body.classList.toggle('scrolled',y>30);document.body.classList.toggle('past-hero',y>hero.offsetHeight*.6);
 readBar.style.setProperty('--read',(y/Math.max(1,document.documentElement.scrollHeight-innerHeight)).toFixed(4));
 if(!paused&&innerWidth>700&&y<hero.offsetHeight){$('.hero-symbol').style.transform=`translateX(-50%) translateY(${y*.13}px)`;$('.hero-grid').style.transform=`translateY(${y*.05}px)`}else{$('.hero-symbol').style.transform='';$('.hero-grid').style.transform=''}}
function requestUpdate(){if(!framePending){framePending=true;requestAnimationFrame(updateMotion)}}
addEventListener('scroll',requestUpdate,{passive:true});addEventListener('resize',requestUpdate,{passive:true});updateMotion();
const motionButton=$('#motion-toggle'),footerMotion=$('#footer-motion');
function setMotion(value){paused=value;document.body.classList.toggle('motion-paused',paused);motionButton.setAttribute('aria-pressed',String(paused));motionButton.textContent=paused?'Enable motion ▷':'Pause motion Ⅱ';footerMotion.setAttribute('aria-pressed',String(paused));footerMotion.textContent=paused?'Motion off ▷':'Motion on Ⅱ';requestUpdate();document.dispatchEvent(new CustomEvent('uppfire:motion'))}
motionButton.addEventListener('click',()=>setMotion(!paused));footerMotion.addEventListener('click',()=>setMotion(!paused));reduced.addEventListener('change',e=>setMotion(e.matches));setMotion(paused);

// Headlines rise line by line, once, as they enter. Without script they are simply visible.
$$('[data-rise]').forEach(el=>{el.innerHTML=el.innerHTML.split(/<br\s*\/?>/i).map((line,i)=>`<span class="rise-line"><span class="rise-inner" style="--i:${i}">${line}</span></span>`).join('')});
const riseObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-risen');riseObserver.unobserve(e.target)}}),{rootMargin:'0px 0px -12% 0px',threshold:.2});
$$('[data-rise]').forEach(el=>quiet()?el.classList.add('is-risen'):riseObserver.observe(el));

// Goals stay attached to their own CTA so exploring another section cannot lose them.
const goals={wedding:{service:'Wedding business: video editing + social media',brief:'Industry: Wedding business.\nServices: Wedding video editing + social media management.\n\nOur business, the footage we have, and what we need: '},estate:{service:'Real estate business: Meta Ads, video, social & design',brief:'Industry: Real estate.\nServices: Meta Ads, video editing, social media management, graphic design.\n\nOur listings, market, and lead goals: '}};
let selectedGoal='wedding';
const goalLabels={wedding:'Wedding business',estate:'Real estate business'};
$$('[data-goal]').forEach(button=>button.addEventListener('click',()=>{
 selectedGoal=button.dataset.goal;
 $$('[data-goal]').forEach(b=>{const chosen=b===button;b.setAttribute('aria-pressed',String(chosen));b.replaceChildren(document.createTextNode(chosen?'Industry selected ':'Choose this industry '),Object.assign(document.createElement('span'),{textContent:chosen?'✓':'↗'}));b.lastElementChild.setAttribute('aria-hidden','true')});
 $$('[data-goal-card]').forEach(card=>card.classList.toggle('is-selected',card.dataset.goalCard===selectedGoal));
 $('#goal-selection-label').textContent=goalLabels[selectedGoal];
 $('[data-goal-project]').dataset.interest=goals[selectedGoal].service;
}));
// Mouse position warms the lettering from within. No cursor replacement or capture.
const ignition=$('.hero-symbol');let heatX=52,heatY=55,heatFrame=false;
function paintHeat(){heatFrame=false;ignition.style.setProperty('--heat-x',heatX+'%');ignition.style.setProperty('--heat-y',heatY+'%')}
hero.addEventListener('pointermove',e=>{if(paused||reduced.matches||e.pointerType!=='mouse'||!finePointer.matches)return;const r=ignition.getBoundingClientRect();heatX=Math.max(12,Math.min(88,(e.clientX-r.left)/r.width*100));heatY=Math.max(20,Math.min(80,(e.clientY-r.top)/r.height*100));if(!heatFrame){heatFrame=true;requestAnimationFrame(paintHeat)}});
hero.addEventListener('pointerleave',()=>{heatX=52;heatY=55;paintHeat()});
// Arrow keys select tabs and preserve natural Tab navigation.
$$('[role=tablist]').forEach(list=>{const tabs=$$('[role=tab]',list);function syncTabs(){tabs.forEach(t=>t.tabIndex=t.getAttribute('aria-selected')==='true'?0:-1)}syncTabs();tabs.forEach(t=>t.addEventListener('click',syncTabs));list.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key))return;e.preventDefault();let index=tabs.indexOf(document.activeElement);if(e.key==='Home')index=0;else if(e.key==='End')index=tabs.length-1;else index=(index+(['ArrowRight','ArrowDown'].includes(e.key)?1:-1)+tabs.length)%tabs.length;tabs[index].click();tabs[index].focus()})});

// Project brief: composed here, sent by the visitor from their own WhatsApp, or downloaded.
const dialog=$('#project-dialog'),form=$('#brief-form');let dialogTrigger;
$$('[data-project]').forEach(b=>b.addEventListener('click',()=>{dialogTrigger=b;closeMenu();form.elements.service.value=b.dataset.interest||selectedService;if(b.hasAttribute('data-goal-project')){form.elements.idea.value=goals[selectedGoal].brief;}$('#brief-status').textContent='';dialog.showModal();document.body.style.overflow='hidden'}));
$('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});dialog.addEventListener('close',()=>{document.body.style.overflow='';dialogTrigger?.focus()});
function openExternal(url){const a=Object.assign(document.createElement('a'),{href:url,target:'_blank',rel:'noopener'});document.body.append(a);a.click();a.remove()}
form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const d=new FormData(form);const brand=d.get('brand').trim(),service=d.get('service'),timing=d.get('timing').trim()||'To be discussed',idea=d.get('idea').trim();
 if(e.submitter?.value==='download'){const text=`UPPFIRE / PROJECT BRIEF\n\nBrand: ${brand}\nService: ${service}\nTiming: ${timing}\n\nThe idea\n${idea}\n\nNext steps\nShare this brief with Uppfire on WhatsApp (+92 330 5078441) to agree deliverables, scope, budget, and timeline.\n`;const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='uppfire-project-brief.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);$('#brief-status').textContent='Your brief is ready. Check your downloads to open and share it.';return}
 const message=`Hi Uppfire! I'd like to start a project.\n\nBrand: ${brand}\nService: ${service}\nTiming: ${timing}\n\nThe idea:\n${idea}`;
 openExternal(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`);
 $('#brief-status').textContent='WhatsApp is open in a new tab with your brief. Press send there and we’ll take it from here.'});
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
 for(const item of arrivals){
  const rect=item.wrap.getBoundingClientRect();
  const incoming=Math.max(0,Math.min(1,(viewport*.96-rect.top)/(viewport*.35)));
  item.progress=quiet()?1:Math.max(item.progress,incoming);
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

// The signal wall depicts the real service mix: six disciplines, three creative and three media.
const signalWall=$('.signal-wall'),signalButtons=$$('[data-signal]'),signalRows=$$('.signal-row'),footerStudio=$('.footer-studio');
const signalViews={
 all:{count:2,unit:'industries.',statement:'One creative direction.',description:'We create focused digital solutions for wedding and real estate businesses — from scroll-stopping videos to social media and lead-generating campaigns.',detail:'Two industries. Four core services.',service:'Not sure yet'},
 wedding:{count:2,unit:'services.',statement:'Capture the moment.',description:'Wedding video editing and social media management. Cinematic highlights, reels and teasers, posted and managed so your work keeps being seen.',detail:'Video editing + social media management.',service:'Wedding business: video editing + social media'},
 estate:{count:4,unit:'services.',statement:'Sell the possibility.',description:'Meta Ads, video editing, social media management and graphic design. Property tours, listings and campaigns built to generate real estate leads.',detail:'Meta Ads + video editing + social media + graphic design.',service:'Real estate business: Meta Ads, video, social & design'}
};
let signalView='all',signalFrame=false,signalCountSettled=false,signalTimer;
function renderSignalMotion(){
 signalFrame=false;const vh=innerHeight,rect=signalWall.getBoundingClientRect();
 const p=Math.max(0,Math.min(1,-rect.top/Math.max(1,signalWall.offsetHeight-vh)));
 const entrance=Math.max(0,Math.min(1,(vh*.72-rect.top)/(vh*.86)));
 signalWall.style.setProperty('--signal-p',quiet()?0:p.toFixed(4));
 signalWall.classList.toggle('signal-visible',rect.bottom>0&&rect.top<vh);
 if(!signalCountSettled){signalWall.style.setProperty('--digit',quiet()?signalViews.all.count:(signalViews.all.count*(1-Math.pow(1-entrance,3))).toFixed(4));if(quiet()||entrance>=1)signalCountSettled=true}
 const signature=$('.footer-signature').getBoundingClientRect();
 const reveal=Math.max(0,Math.min(1,(vh-signature.top)/(Math.max(1,signature.height)*.9)));
 footerStudio.style.setProperty('--footer-reveal',quiet()?1:reveal.toFixed(4));
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

// ---------------------------------------------------------------------------
// The real portfolio. Every piece below is client work supplied by the studio.
const W='/assets/work/',F='/assets/films/',R='/assets/reels/';
const img=(name,cap)=>({type:'image',src:`${W}${name}.webp`,thumb:`${W}${name}-sm.webp`,cap});
const films=[['rob-jade','Manor in bloom'],['hillside','Golden hour on the hill'],['vineyard','Under the arch'],['lauren-ben','Old beams, new beginnings'],['garden-vows','Garden vows'],['rena-birthday','A little rodeo']].map(([s,t],i)=>({type:'video',src:`${F}${s}.mp4`,thumb:`${F}${s}.webp`,cap:`${i===5?'Celebration film':'Wedding film'} — ${t}. A 45-second excerpt.`}));
const reels=['The first walkthrough','An island property story','The agent, on camera','Harbour-front tour','Waterfront living','Built above the tide','Room by room'].map((t,i)=>({type:'video',vertical:true,src:`${R}estate-0${i+1}.mp4`,thumb:`${R}estate-0${i+1}.webp`,cap:`Property reel — ${t}.`}));
const portfolio={
 design:{kind:'Graphic design',title:'Say it in one glance',items:[img('design-bakistry-lotus','Bakistry — Lotus cheesecake jar.'),img('design-bakistry-crumbly','Bakistry — Crumbly cheesecake delight.'),img('design-manso-summer','Manso — the new summer collection.'),img('design-manso-arrival-ar','Manso — “Just arrived”, Arabic edition.'),img('design-manso-arrival','Manso — New arrival.'),img('design-dainely-belt','Dainely — let your belt handle it.'),img('design-dainely-back','Dainely — your lower back is the engine.'),img('design-edvana','Edvana Online Institute — subjects and enrolment.'),img('design-carousel','Interior studio — Instagram carousel.')]},
 brand:{kind:'Branding',title:'A name, remembered',items:[img('brand-bunboy-scene','Bun Boy — the full identity, in one scene.'),img('brand-bunboy-hero','Bun Boy — “Big. Juicy. Unstoppable.”'),img('brand-bunboy-bags','Bun Boy — takeaway bags.'),img('brand-bunboy-box','Bun Boy — premium burger box and dieline.'),img('brand-bunboy-apron','Bun Boy — staff aprons.'),img('brand-bunboy-menu','Bun Boy — menu, front and back.'),img('brand-bunboy-poster','Bun Boy — “Not your average burger.”'),img('brand-bunboy-guide-red','Bun Boy — brand guidelines: logo, palette, type.'),img('brand-bunboy-guide','Bun Boy — brand guidelines, black and yellow edition.')]},
 calendar:{kind:'Content calendar',title:'The quiet groundwork',items:[{type:'calendar',cap:'A sample month, laid out with real client posts. Three posts a week, each with a job.'}]},
 video:{kind:'Video editing',title:'Frame by frame, better',items:[...films,...reels]},
 logo:{kind:'Logos',title:'Seen once, known forever',items:[img('logo-uppfire-wall','Uppfire — the studio’s own mark.'),img('logo-bunboy-logo','Bun Boy — primary logo.'),img('logo-bunboy-variations','Bun Boy — primary, black, white, yellow and icon versions.'),img('logo-bunboy-lockups','Bun Boy — horizontal lockup and single-colour versions.')]},
 paid:{kind:'Paid social creative',title:'Built to be clicked',items:[img('paid-reddish-winter','Reddish — winter collection, in just Rs 4,199.'),img('paid-reddish-collection','Reddish — winter collection, just Rs 3,799.'),img('paid-reddish-floral','Reddish — new floral, in just Rs 1,499.'),img('paid-freshtaa-sale','Freshtaa Wear — mid-summer sale, up to 50% off.'),img('paid-falcon-christmas','Falcon Edge — Christmas Day sale, flat 30% off.')]},
 results:{kind:'Performance / ads result',title:'The numbers don’t lie',items:[img('results-views-106k','Instagram — 106,774 views in 30 days, 99.1% from ads.'),img('results-reach-111k','Meta Ads — 111,568 reach at Rs 11.62 per result.'),img('results-sales-shopify','Online store — Rs 2,292,296 gross sales from 962 orders in 12 months.'),img('results-demographics','Meta Ads — 4,286 people reached, 75 messaging conversations.'),img('results-messaging','Meta Ads — 22 conversations started at Rs 49.19 each.'),img('results-campaigns','Meta Ads Manager — 874 purchases at a 4.21 average ROAS.')]},
 social:{kind:'Social media management',title:'Same time, every time',items:[img('social-insights-7d','Instagram — 2,460 views in 7 days; accounts reached up 495.7%.'),img('social-insights-30d','Instagram — 8,811 views in 30 days; 6,063 accounts reached, up 15,057.5%.'),img('social-insights-reach','Instagram — 6,297 accounts reached, up 17,891.4%.')]}
};
// A sample month built from the studio's real posts.
function calendarBoard(){
 const posts=[['design-bakistry-lotus','Product'],['paid-reddish-winter','Offer'],['design-manso-arrival','Launch'],['design-dainely-back','Story'],['brand-bunboy-hero','Campaign'],['paid-freshtaa-sale','Offer'],['design-edvana','Enrolment'],['design-bakistry-crumbly','Product'],['paid-reddish-floral','Offer'],['design-dainely-belt','Story'],['design-manso-summer','Collection'],['paid-falcon-christmas','Seasonal']];
 const board=document.createElement('div');board.className='cal-board';
 board.innerHTML='<div class="cal-board-head"><strong>Month one, planned.</strong><span>12 posts · Mon / Wed / Fri · captions, hashtags & replies included</span></div>';
 const grid=document.createElement('div');grid.className='cal-board-grid';
 ['MON','TUE','WED','THU','FRI','SAT','SUN'].forEach(d=>grid.append(Object.assign(document.createElement('b'),{textContent:d})));
 let p=0;for(let day=1;day<=28;day++){const cell=document.createElement('div');cell.className='cal-day';cell.append(Object.assign(document.createElement('span'),{textContent:String(day)}));const dow=(day-1)%7;if([0,2,4].includes(dow)&&p<posts.length){const [name,label]=posts[p++];cell.classList.add('has-post');cell.style.setProperty('--img',`url(${W}${name}-sm.webp)`);cell.append(Object.assign(document.createElement('em'),{textContent:label}))}grid.append(cell)}
 board.append(grid);
 board.insertAdjacentHTML('beforeend','<div class="cal-legend"><span>● Product & offer posts</span><span>● Story & campaign posts</span><span>● Weekly community replies</span><span>● Monthly recap</span></div>');
 return board;
}

// Viewer: a full-screen modal with keyboard, swipe and thumbnail navigation.
const viewer=$('#work-viewer'),figure=$('#viewer-figure'),thumbs=$('#viewer-thumbs');
let viewerCat='design',viewerIndex=0,viewerTrigger=null;
function renderViewer(){
 const set=portfolio[viewerCat],item=set.items[viewerIndex],n=set.items.length;
 $('#viewer-kind').textContent=set.kind;$('#viewer-title').textContent=set.title;
 $('#viewer-count').textContent=`${String(viewerIndex+1).padStart(2,'0')} / ${String(n).padStart(2,'0')}`;
 $('#viewer-caption').textContent=item.cap;
 figure.querySelectorAll('video').forEach(v=>v.pause());
 let el;
 if(item.type==='calendar')el=calendarBoard();
 else if(item.type==='video'){el=Object.assign(document.createElement('video'),{src:item.src,poster:item.thumb,controls:true,playsInline:true,preload:'metadata'});if(item.vertical)el.classList.add('is-vertical');el.setAttribute('aria-label',item.cap);el.play().catch(()=>{})}
 else{el=Object.assign(document.createElement('img'),{src:item.src,alt:item.cap,decoding:'async'})}
 figure.replaceChildren(el);
 $$('button',thumbs).forEach((b,i)=>b.setAttribute('aria-current',String(i===viewerIndex)));
 centerIn(thumbs,thumbs.children[viewerIndex]);
 $('.viewer-prev').hidden=$('.viewer-next').hidden=n<2;
 const next=set.items[(viewerIndex+1)%n];if(next.type==='image')new Image().src=next.src;
}
function openViewer(cat,index=0,trigger=document.activeElement){
 viewerCat=cat;viewerIndex=index;viewerTrigger=trigger;
 thumbs.replaceChildren(...portfolio[cat].items.map((item,i)=>{const b=document.createElement('button');b.setAttribute('aria-label',`Show piece ${i+1}: ${item.cap}`);if(item.thumb)b.append(Object.assign(document.createElement('img'),{src:item.thumb,alt:'',loading:'lazy'}));else{b.classList.add('thumb-text');b.textContent='Month'}b.addEventListener('click',()=>{viewerIndex=i;renderViewer()});return b}));
 renderViewer();
 if(!viewer.open)viewer.showModal();document.body.style.overflow='hidden';
 $('.viewer-close').focus({preventScroll:true});
}
function stepViewer(d){const n=portfolio[viewerCat].items.length;viewerIndex=(viewerIndex+d+n)%n;renderViewer()}
$('.viewer-prev').addEventListener('click',()=>stepViewer(-1));$('.viewer-next').addEventListener('click',()=>stepViewer(1));
$('.viewer-close').addEventListener('click',()=>viewer.close());
viewer.addEventListener('keydown',e=>{if(e.target.closest('video'))return;if(e.key==='ArrowRight'){e.preventDefault();stepViewer(1)}if(e.key==='ArrowLeft'){e.preventDefault();stepViewer(-1)}});
viewer.addEventListener('close',()=>{figure.querySelectorAll('video').forEach(v=>v.pause());figure.replaceChildren();document.body.style.overflow='';viewerTrigger?.focus?.({preventScroll:true})});
let swipe;figure.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')swipe={x:e.clientX,y:e.clientY}});
figure.addEventListener('pointerup',e=>{if(!swipe)return;const dx=e.clientX-swipe.x,dy=e.clientY-swipe.y;swipe=null;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.3)stepViewer(dx<0?1:-1)});
$$('[data-open-cat]').forEach(b=>b.addEventListener('click',()=>openViewer(b.dataset.openCat,0,b)));
$$('[data-proof]').forEach(b=>b.addEventListener('click',()=>{const [cat,i]=b.dataset.proof.split(':');openViewer(cat,+i,b)}));

// The portfolio follows a real ellipse: every step moves all cards around the ring.
const orbitStage=$('.orbit-stage'),orbitTrack=$('.orbit-track'),orbitCards=$$('[data-orbit-card]'),orbitChips=$$('[data-orbit-go]');
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
  card.style.pointerEvents=opacity>.4?'auto':'none';
 });
}
function orbitTick(time){
 const delta=orbitLast?Math.min(40,time-orbitLast):16;orbitLast=time;
 orbitRotation+=(orbitTarget-orbitRotation)*(1-Math.exp(-delta/135));
 if(Math.abs(orbitTarget-orbitRotation)<.0005){orbitRotation=orbitTarget;orbitFrame=0;orbitLast=0;paintOrbit();return}
 paintOrbit();orbitFrame=requestAnimationFrame(orbitTick);
}
function syncOrbitFilm(){
 orbitCards.forEach((card,i)=>{const film=$('.orbit-film',card);if(!film)return;if(!quiet()&&orbitVisible&&!document.hidden&&i===orbitIndex){film.preload='auto';film.play().then(()=>card.classList.add('is-playing')).catch(()=>{})}else film.pause()});
}
function rotateBy(steps){
 orbitIndex=((orbitIndex+steps)%orbitCards.length+orbitCards.length)%orbitCards.length;orbitTarget-=steps*orbitStep;
 orbitCards.forEach((card,i)=>{card.classList.toggle('is-active',i===orbitIndex);card.setAttribute('aria-hidden',String(i!==orbitIndex))});
 orbitChips.forEach((chip,i)=>chip.setAttribute('aria-pressed',String(i===orbitIndex)));
 centerIn($('.orbit-index'),orbitChips[orbitIndex]);
 const selected=orbitCards[orbitIndex].dataset,set=portfolio[selected.cat];
 $('#orbit-title').textContent=selected.title;$('#orbit-kind').textContent=selected.kind;$('#orbit-description').textContent=selected.description;
 $('#orbit-count').textContent=set.items.length>1?`(${String(set.items.length).padStart(2,'0')})`:'';
 $('#orbit-view').setAttribute('aria-label',`View the ${selected.kind.toLowerCase()} work`);
 $('#orbit-index').textContent=String(orbitIndex+1).padStart(2,'0');$('.orbit-progress i').style.transform=`translateX(${orbitIndex*100}%)`;
 if(quiet()){cancelAnimationFrame(orbitFrame);orbitFrame=0;orbitLast=0;orbitRotation=orbitTarget;paintOrbit()}else if(!orbitFrame){orbitFrame=requestAnimationFrame(orbitTick)}
 syncOrbitFilm();
}
function goTo(i){const n=orbitCards.length;let d=((i-orbitIndex)%n+n)%n;if(d>n/2)d-=n;if(d)rotateBy(d)}
const openActive=()=>openViewer(orbitCards[orbitIndex].dataset.cat,0,$('#orbit-view'));
$('#orbit-prev').addEventListener('click',()=>rotateBy(-1));$('#orbit-next').addEventListener('click',()=>rotateBy(1));
$('#orbit-view').addEventListener('click',openActive);
orbitChips.forEach(chip=>chip.addEventListener('click',()=>goTo(+chip.dataset.orbitGo)));
// A swipe also ends in a click on the card under the finger; only a tap should open it.
orbitCards.forEach((card,i)=>$('.orbit-open',card).addEventListener('click',()=>{if(orbitSwiped)return;if(i===orbitIndex)openActive();else goTo(i)}));
orbitStage.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();rotateBy(e.key==='ArrowLeft'?-1:1)}if((e.key==='Enter'||e.key===' ')&&e.target===orbitStage){e.preventDefault();openActive()}});
let orbitTouch;
orbitStage.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')orbitTouch={x:e.clientX,y:e.clientY,id:e.pointerId}});
let orbitSwiped=false;
orbitStage.addEventListener('pointerup',e=>{if(!orbitTouch||e.pointerId!==orbitTouch.id)return;const dx=e.clientX-orbitTouch.x,dy=e.clientY-orbitTouch.y;orbitTouch=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.3){orbitSwiped=true;setTimeout(()=>orbitSwiped=false,350);rotateBy(dx<0?1:-1)}});
orbitStage.addEventListener('pointercancel',()=>{orbitTouch=null});
addEventListener('resize',paintOrbit,{passive:true});
document.addEventListener('uppfire:motion',()=>{if(paused){cancelAnimationFrame(orbitFrame);orbitFrame=0;orbitLast=0;orbitRotation=orbitTarget;paintOrbit()}syncOrbitFilm()});
document.addEventListener('visibilitychange',syncOrbitFilm);
new IntersectionObserver(entries=>{orbitVisible=entries[0].isIntersecting;syncOrbitFilm()},{threshold:.15}).observe(orbitStage);
new IntersectionObserver(entries=>{document.body.classList.toggle('hero-out-of-view',!entries[0].isIntersecting)},{threshold:0}).observe(hero);
new IntersectionObserver(entries=>{document.body.classList.toggle('near-footer',entries[0].isIntersecting)},{threshold:.25}).observe($('.footer-invite'));
orbitTrack.classList.add('is-ready');rotateBy(0);paintOrbit();

// Films & reels: silent loops wake on hover or when on screen; a click opens the full excerpt with sound.
function wake(card,on){const v=$('video',card);if(!v)return;if(on&&!quiet()){if(!v.src)v.src=v.dataset.loop;v.play().then(()=>card.classList.add('is-playing')).catch(()=>{})}else{v.pause();card.classList.remove('is-playing')}}
const loopCards=$$('.film-card,.reel-card');
const autoplay=card=>card.classList.contains('film-feature')||card.classList.contains('reel-card')||!finePointer.matches;
const loopObserver=new IntersectionObserver(entries=>entries.forEach(e=>{e.target.inView=e.isIntersecting;if(autoplay(e.target))wake(e.target,e.isIntersecting&&!e.target.closest('[hidden]'))}),{threshold:.6});
loopCards.forEach(card=>{loopObserver.observe(card);
 card.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')wake(card,true)});
 card.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'&&!(autoplay(card)&&card.inView))wake(card,false)});
 card.addEventListener('click',()=>{if(card.dataset.film)openViewer('video',+card.dataset.film,card);else openViewer('video',films.length+(+card.dataset.reel),card)});
});
document.addEventListener('uppfire:motion',()=>loopCards.forEach(card=>wake(card,!quiet()&&card.inView&&autoplay(card))));
const filmTabs=$$('.films-tabs [role=tab]');
filmTabs.forEach(tab=>tab.addEventListener('click',()=>{filmTabs.forEach(t=>{const on=t===tab;t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1;$('#'+t.getAttribute('aria-controls')).hidden=!on});
 loopCards.forEach(card=>{const visible=!card.closest('[hidden]');if(!visible)wake(card,false);else if(card.inView&&autoplay(card))wake(card,true)});updateRail()}));
const rail=$('.reel-rail'),railBar=$('.reel-progress');
function updateRail(){railBar.style.setProperty('--rail',Math.min(1,(rail.scrollLeft+rail.clientWidth)/Math.max(1,rail.scrollWidth)).toFixed(3))}
rail.addEventListener('scroll',updateRail,{passive:true});addEventListener('resize',updateRail,{passive:true});updateRail();
$$('[data-reel-step]').forEach(b=>b.addEventListener('click',()=>rail.scrollBy({left:+b.dataset.reelStep*rail.clientWidth*.8,behavior:quiet()?'auto':'smooth'})));
let drag=null;
rail.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;drag={x:e.clientX,left:rail.scrollLeft,moved:false}});
addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x;if(Math.abs(dx)>5){drag.moved=true;rail.classList.add('is-dragging')}if(drag.moved)rail.scrollLeft=drag.left-dx});
addEventListener('pointerup',()=>{if(!drag)return;const moved=drag.moved;drag=null;rail.classList.remove('is-dragging');if(moved){const stop=e=>{e.stopPropagation();e.preventDefault()};rail.addEventListener('click',stop,{capture:true,once:true});setTimeout(()=>rail.removeEventListener('click',stop,{capture:true}),50)}});

// A small badge follows fine pointers over things that open or play. Touch never sees it.
const badge=$('.cursor-badge'),badgeText=$('span',badge);
if(finePointer.matches&&!reduced.matches){
 addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;badge.style.setProperty('--cx',e.clientX+'px');badge.style.setProperty('--cy',e.clientY+'px');
  const target=e.target.closest('[data-cursor], .orbit-card.is-active');const label=target?(target.dataset.cursor||'Open'):'';
  if(label&&!viewer.open&&!dialog.open){badgeText.textContent=label;badge.classList.add('is-on')}else badge.classList.remove('is-on')},{passive:true});
 document.addEventListener('pointerleave',()=>badge.classList.remove('is-on'));
}
