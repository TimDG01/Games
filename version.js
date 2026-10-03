// Versie van de site. Verhoog met tools/bump-version.sh, dat ook de verwijzingen in alle pagina's bijwerkt.
const SITE_VERSION = '3.5';

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
(function(){
  try{
    const st=document.createElement('style');
    st.textContent='html,body,*{touch-action:manipulation}';
    document.head.prepend(st);
    let lastTap=0, start=null;
    document.addEventListener('touchstart',e=>{
      const t=e.touches[0];start=e.touches.length===1?{x:t.clientX,y:t.clientY,time:e.timeStamp}:null;
    },{passive:true});
    document.addEventListener('touchend',e=>{
      if(!start||e.touches.length)return;
      const t=e.changedTouches[0];
      const isTap=Math.hypot(t.clientX-start.x,t.clientY-start.y)<12&&e.timeStamp-start.time<500;
      if(!isTap){start=null;return;}
      if(e.timeStamp-lastTap<350&&e.cancelable){
        e.preventDefault();
        const el=document.elementFromPoint(t.clientX,t.clientY);
        if(el)el.click();
      }
      lastTap=e.timeStamp;start=null;
    },{passive:false});
    // in de games ook knijpen om te zoomen tegenhouden (Safari)
    if(/\/games\//.test(location.pathname))
      for(const ev of['gesturestart','gesturechange'])document.addEventListener(ev,e=>e.preventDefault(),{passive:false});
  }catch(e){}
})();
