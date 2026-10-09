// Versie van de site. Verhoog met tools/bump-version.sh, dat ook de verwijzingen in alle pagina's bijwerkt.
const SITE_VERSION = '7.1';

// Staat er online al een nieuwere versie? Dan meteen de verse pagina laden, één keer per versie.
(function(){
  try{
    const me=new URL(document.currentScript.src);
    me.search='?t='+Date.now();
    fetch(me,{cache:'no-store'}).then(r=>r.ok?r.text():'').then(t=>{
      const live=(t.match(/SITE_VERSION\s*=\s*'([^']+)'/)||[])[1];
      const url=new URL(location.href);
      if(!live||live===SITE_VERSION||url.searchParams.get('v')===live)return;
      url.searchParams.set('v',live);
      location.replace(url);
    }).catch(()=>{});
  }catch(e){}
})();

// Geen zoom bij dubbel tikken. iPhones negeren user-scalable=no, en touch-action: manipulation is niet altijd genoeg.
// Daarom: komt er snel een tweede korte tik, dan annuleren we Safari's zoom en sturen we zelf de klik door,
// zodat de tik gewoon blijft tellen. Vegen en scrollen tellen niet als tik.
// In de games gaan we verder: daar houden we elke aanraking tegen, zodat Safari nooit een vergrootglas, selectie,
// menu of zoom toont bij lang drukken of snel tikken. Pointer-events (waar de games op spelen) komen gewoon door;
// alleen de klik zou wegvallen, dus die sturen we na een korte tik zelf door. Formuliervelden blijven zoals ze zijn.
(function(){
  try{
    const inGame=/\/games\//.test(location.pathname);
    const st=document.createElement('style');
    st.textContent='html,body,*{touch-action:manipulation}'+
      (inGame?'*{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}':'');
    document.head.prepend(st);
    let lastTap=0, start=null;
    const isTap=(t,e)=>Math.hypot(t.clientX-start.x,t.clientY-start.y)<12&&e.timeStamp-start.time<(inGame?1500:500);
    if(inGame){
      const native=el=>el.closest&&el.closest('input,select,textarea,label');
      document.addEventListener('touchstart',e=>{
        const t=e.touches[0];
        start=e.touches.length===1&&!native(e.target)?{x:t.clientX,y:t.clientY,time:e.timeStamp,el:e.target}:null;
        if(!native(e.target)&&e.cancelable)e.preventDefault();
      },{passive:false});
      document.addEventListener('touchend',e=>{
        if(!start||e.touches.length)return;
        const t=e.changedTouches[0], el=start.el;
        if(isTap(t,e)&&el.isConnected)el.click();
        start=null;
      },{passive:false});
      document.addEventListener('touchcancel',()=>{start=null;});
      // knijpen om te zoomen tegenhouden (Safari)
      for(const ev of['gesturestart','gesturechange'])document.addEventListener(ev,e=>e.preventDefault(),{passive:false});
      // geen menu bij lang drukken (Android toont dat soms toch)
      document.addEventListener('contextmenu',e=>{if(!native(e.target))e.preventDefault();});
      return;
    }
    document.addEventListener('touchstart',e=>{
      const t=e.touches[0];start=e.touches.length===1?{x:t.clientX,y:t.clientY,time:e.timeStamp}:null;
    },{passive:true});
    document.addEventListener('touchend',e=>{
      if(!start||e.touches.length)return;
      const t=e.changedTouches[0];
      if(!isTap(t,e)){start=null;return;}
      if(e.timeStamp-lastTap<350&&e.cancelable){
        e.preventDefault();
        const el=document.elementFromPoint(t.clientX,t.clientY);
        if(el)el.click();
      }
      lastTap=e.timeStamp;start=null;
    },{passive:false});
  }catch(e){}
})();

// Geluid aan/uit, gedeeld door alle games. Elke game vraagt SITE_SOUND.on voor hij een geluid maakt.
// Op het start- en eindscherm van elke game komt een knop, en een luidsprekertje (.sndbtn) bovenaan werkt ook
// tijdens het spelen. Op de computer werkt ook de toets M.
window.SITE_SOUND=(function(){
  let on=true;try{on=localStorage.getItem('geluid')!=='uit'}catch(e){}
  const api={get on(){return on},set(v){on=v;try{localStorage.setItem('geluid',v?'aan':'uit')}catch(e){}refresh();}};
  const label=()=>on?'\u{1F50A} Geluid aan':'\u{1F507} Geluid uit';
  function refresh(){
    document.querySelectorAll('.snd').forEach(b=>{b.textContent=label();b.setAttribute('aria-pressed',on);});
    document.querySelectorAll('.sndbtn').forEach(b=>{b.textContent=on?'\u{1F50A}':'\u{1F507}';b.setAttribute('aria-pressed',on);b.title=on?'Geluid uitzetten':'Geluid aanzetten';});
  }
  if(/\/games\//.test(location.pathname)){
    const add=()=>{
      const st=document.createElement('style');
      st.textContent='.panel .snd{font-family:inherit;font-size:14px;font-weight:600;color:#9097b5;background:transparent;border:2px solid #2f3860;'+
        'border-radius:4px;padding:8px 12px;box-shadow:none;align-self:center;cursor:pointer}.panel .snd:active{transform:none;box-shadow:none}'+
        '.sndbtn{pointer-events:auto;width:40px;height:40px;display:grid;place-items:center;border-radius:4px;background:rgba(29,36,64,.7);'+
        'border:0;padding:0;font-size:17px;line-height:1;cursor:pointer;z-index:5;box-shadow:none;color:#f4f0e6}'+
        '.sndbtn:active{transform:none;box-shadow:none}.sndbtn:focus-visible{outline:3px solid #f4f0e6;outline-offset:2px}';
      document.head.appendChild(st);
      document.querySelectorAll('.sndbtn').forEach(b=>{b.type='button';b.addEventListener('click',e=>{e.stopPropagation();api.set(!on);b.blur();});});
      document.querySelectorAll('.overlay .panel').forEach(p=>{
        const b=document.createElement('button');b.type='button';b.className='snd';
        b.addEventListener('click',()=>api.set(!on));
        const ver=p.querySelector('.ver');ver?p.insertBefore(b,ver):p.appendChild(b);
      });
      refresh();
    };
    document.readyState==='loading'?document.addEventListener('DOMContentLoaded',add):add();
    addEventListener('keydown',e=>{if(e.code==='KeyM'&&!e.ctrlKey&&!e.metaKey&&!e.altKey)api.set(!on);});
  }
  return api;
})();
