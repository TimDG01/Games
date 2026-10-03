// Versie van de site. Verhoog met tools/bump-version.sh, dat ook de verwijzingen in alle pagina's bijwerkt.
const SITE_VERSION = '3.1';

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

// Geen zoom bij dubbel tikken. iPhones negeren user-scalable=no, maar touch-action: manipulation werkt wel:
// tikken en schuiven mogen, dubbeltik-zoom niet. Elementen met touch-action: none (speelvelden) houden dat.
(function(){
  try{
    const st=document.createElement('style');
    st.textContent='html,body,*{touch-action:manipulation}';
    document.head.prepend(st);
    // in de games ook knijpen om te zoomen tegenhouden (Safari)
    if(/\/games\//.test(location.pathname))
      for(const ev of['gesturestart','gesturechange'])document.addEventListener(ev,e=>e.preventDefault(),{passive:false});
  }catch(e){}
})();
