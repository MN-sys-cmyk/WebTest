(function(root,factory){ if(typeof module==='object'&&module.exports)module.exports=factory();else root.AdminGitHub=factory(); })(typeof window==='undefined'?globalThis:window,function(){
  function encode(text) { const bytes=new TextEncoder().encode(text);let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(binary); }
  function decode(text) { return new TextDecoder().decode(Uint8Array.from(atob(text.replace(/\s/g,'')),c=>c.charCodeAt(0))); }
  class Store {
    constructor(token, request=fetch) { this.token=token;this.request=request;this.repo='MN-sys-cmyk/WebTest';this.branch='main'; }
    async api(path, options={}) {
      const response=await this.request(`https://api.github.com/repos/${this.repo}/${path}`,{...options,cache:'no-store',headers:{Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',Authorization:`Bearer ${this.token}`,...options.headers}});
      if(!response.ok) {
        const messages={401:'Přihlášení vypršelo nebo je token neplatný.',403:'GitHub odmítl přístup. Zkontrolujte oprávnění tokenu (Contents: Read and write) nebo limit požadavků.',404:'Soubor nebo repozitář není dostupný. Administrace musí být nejdříve sloučena do main.',409:'Obsah mezitím změnil jiný editor. Vaše změny zůstávají otevřené. Zkopírujte je, načtěte aktuální data a úpravu zopakujte.',422:'GitHub odmítl zápis. Zkontrolujte oprávnění a ochranu větve main.'};
        const error=new Error(messages[response.status]||`GitHub je nedostupný (${response.status}). Zkuste to znovu.`);error.status=response.status;throw error;
      }
      return response.json();
    }
    async load() {
      const repo=await this.api('');
      if(repo.permissions && !repo.permissions.push)throw new Error('Tento účet nemá oprávnění upravovat repozitář.');
      const entry=await this.api(`contents/content/data.json?ref=${this.branch}`);
      const blob=entry.content?entry:await this.api(`git/blobs/${entry.sha}`);
      return {data:JSON.parse(decode(blob.content)),sha:entry.sha};
    }
    async save(data,sha) {
      if(!sha)throw new Error('Chybí verze obsahu. Nejprve jej znovu načtěte.');
      return this.api('contents/content/data.json',{method:'PUT',body:JSON.stringify({message:'Update content from administration',branch:this.branch,sha,content:encode(JSON.stringify(data,null,2)+'\n')})});
    }
    async upload(path,base64) { return this.api(`contents/${path}`,{method:'PUT',body:JSON.stringify({message:'Upload editorial image',branch:this.branch,content:base64})}); }
    logout(){this.token='';}
  }
  return {Store,encode,decode};
});
