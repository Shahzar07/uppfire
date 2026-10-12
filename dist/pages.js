import './scrollcraft.js';
window.ScrollCraft.mount(document);
const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const menu=$('.menu-button'), nav=$('#navigation');
function closeMenu(){nav.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation')}
menu.addEventListener('click',()=>{const opening=nav.hidden;nav.hidden=!opening;menu.setAttribute('aria-expanded',String(opening));menu.setAttribute('aria-label',opening?'Close navigation':'Open navigation')});
document.addEventListener('click',e=>{if(!e.target.closest('.nav-block'))closeMenu()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
const bar=$('.scroll-progress');let frame=false;
function onScroll(){frame=false;const y=scrollY;document.body.classList.toggle('scrolled',y>30);document.body.classList.toggle('past-hero',y>innerHeight*.5);bar.style.setProperty('--read',(y/Math.max(1,document.documentElement.scrollHeight-innerHeight)).toFixed(4))}
addEventListener('scroll',()=>{if(!frame){frame=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();
// Headlines rise line by line, once. Without script they are simply visible.
$$('[data-rise]').forEach(el=>{el.innerHTML=el.innerHTML.split(/<br\s*\/?>/i).map((line,i)=>`<span class="rise-line"><span class="rise-inner" style="--i:${i}">${line}</span></span>`).join('')});
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-risen');io.unobserve(e.target)}}),{rootMargin:'0px 0px -10% 0px',threshold:.2});
$$('[data-rise]').forEach(el=>reduced?el.classList.add('is-risen'):io.observe(el));
// One film plays at a time.
$$('video').forEach(v=>v.addEventListener('play',()=>$$('video').forEach(o=>{if(o!==v)o.pause()})));
$$('.faq details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)$$('.faq details').forEach(o=>{if(o!==d)o.open=false})}));
new IntersectionObserver(entries=>document.body.classList.toggle('near-footer',entries[0].isIntersecting),{threshold:.25}).observe($('.footer-invite'));
