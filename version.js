// Versie van de site. Verhoog met tools/bump-version.sh, dat ook de verwijzingen in alle pagina's bijwerkt.
const SITE_VERSION = '2.7';

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
