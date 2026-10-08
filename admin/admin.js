(() => {
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let store, data, sha, tab='authors', editing=null, dirty=false, busy=false, pendingImage=null, imageURL=null;
  const notice = (text,error=false) => { $('notice').textContent=text; $('notice').classList.toggle('error',error); };
  const safeImage = path => path ? '../'+path : '';
  const normalize = text => String(text).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  function setBusy(value) { busy=value; document.querySelectorAll('button').forEach(b=>{b.disabled=value;}); $('fields').disabled=value; }
  async function load() {
    const result=await store.load(); const errors=ContentModel.validate(result.data); if(errors.length)throw new Error(errors.join(' '));
    data=result.data; sha=result.sha; render();
  }
  $('login-form').addEventListener('submit',async event=>{
    event.preventDefault();store=new AdminGitHub.Store($('token').value.trim());$('token').value='';setBusy(true);notice('Připojuji GitHub…');
    try{await load();$('login').hidden=true;$('workspace').hidden=false;notice('Připojeno. Změny můžete ukládat do repozitáře WebTest.');}
    catch(error){store.logout();store=null;notice(error.message,true);}finally{setBusy(false);}
  });
  $('logout').addEventListener('click',()=>{store?.logout();store=null;data=null;sha=null;$('workspace').hidden=true;$('login').hidden=false;$('list').replaceChildren();notice('Odhlášeno.');});
  $('refresh').addEventListener('click',async()=>{setBusy(true);try{await load();notice('Načten aktuální obsah.');}catch(e){notice(e.message,true);}finally{setBusy(false);}});
  document.querySelectorAll('[data-tab]').forEach(button=>button.addEventListener('click',()=>{tab=button.dataset.tab;$('search').value='';render();}));
  $('search').addEventListener('input',render);
  function render(){
    $('stats').innerHTML=`<div><strong>${data.authors.length}</strong>autorů</div><div><strong>${data.posts.filter(p=>p.status==='published').length}</strong>publikovaných textů</div><div><strong>${data.posts.filter(p=>p.status==='draft').length}</strong>konceptů</div>`;
    document.querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tab===tab)));
    $('add').textContent=tab==='authors'?'Přidat autora':tab==='posts'?'Přidat text':'Přidat štítek';
    const q=normalize($('search').value);
    const items=data[tab].filter(item=>normalize(typeof item==='string'?item:`${item.name||item.title} ${data.authors.find(a=>a.id===item.authorId)?.name||''}`).includes(q));
    $('list').innerHTML=items.length?items.map(item=>{
      if(tab==='tags')return `<div class="entry"><div class="entry-info"><h3>${esc(item)}</h3><p>${data.posts.filter(p=>p.tags.includes(item)).length} textů</p></div><button data-edit="${esc(item)}">Upravit</button></div>`;
      const published=tab==='authors'?item.published:item.status==='published';
      const subtitle=tab==='authors'?`${item.genre} · ${data.posts.filter(p=>p.authorId===item.id).length} textů`:`${data.authors.find(a=>a.id===item.authorId)?.name||''} · ${item.date}`;
      return `<div class="entry">${item.image?`<img src="${esc(safeImage(item.image))}" alt="">`:`<div class="avatar" aria-hidden="true">${esc((item.name||item.title).slice(0,1))}</div>`}<div class="entry-info"><h3>${esc(item.name||item.title)}</h3><p>${esc(subtitle)}</p></div><span class="badge ${published?'published':''}">${published?'Zveřejněno':tab==='authors'?'Skrytý autor':'Koncept'}</span><button data-edit="${esc(item.id)}">Upravit</button></div>`;
    }).join(''):'<p class="panel">Žádné položky. Přidejte novou nebo změňte hledání.</p>';
    $('list').querySelectorAll('[data-edit]').forEach(b=>b.addEventListener('click',()=>open(b.dataset.edit)));
  }
  const field=(name,label,value='',type='text',required=false)=>`<label for="f-${name}">${label}</label><input id="f-${name}" name="${name}" type="${type}" value="${esc(value)}" ${required?'required':''}>`;
  const area=(name,label,value='',required=false,cls='')=>`<label for="f-${name}">${label}</label><textarea id="f-${name}" name="${name}" class="${cls}" ${required?'required':''}>${esc(value)}</textarea>`;
  const check=(name,label,checked)=>`<label class="check"><input name="${name}" type="checkbox" ${checked?'checked':''}>${label}</label>`;
  function imageFields(item){return `<label for="f-upload">${tab==='authors'?'Fotografie autora':'Obrázek textu'}</label><input id="f-upload" type="file" accept="image/jpeg,image/png,image/webp"><p class="hint">JPG, PNG nebo WebP, maximálně 10 MB. Fotografie se zmenší pro web.</p><img id="image-preview" class="photo" ${item.image?`src="${esc(safeImage(item.image))}"`:'hidden'} alt="Náhled obrázku">${check('removeImage','Odstranit obrázek',false)}`;}
  function open(id){
    if(tab==='posts'&&!data.authors.length){notice('Nejdříve přidejte autora.',true);return;}
    editing={type:tab,id:id||null};pendingImage=null;dirty=false;$('form-error').textContent='';$('delete').hidden=!id;$('preview-button').hidden=tab==='tags';
    let item=tab==='tags'?id:data[tab].find(v=>v.id===id);
    $('editor-title').textContent=(id?'Upravit ':'Přidat ')+(tab==='authors'?'autora':tab==='posts'?'text':'štítek');
    if(tab==='tags')$('fields').innerHTML=field('tag','Název štítku',item||'','text',true);
    else if(tab==='authors'){
      item=item||{name:'',genre:'',bio:'',image:'',published:true};
      $('fields').innerHTML=field('name','Jméno',item.name,'text',true)+field('genre','Žánry',item.genre)+area('bio','O autorovi',item.bio)+imageFields(item)+check('published','Zobrazit autora na webu',item.published)+'<p class="hint">Skrytím autora se z veřejného webu stáhnou i jeho texty. V administraci zůstanou uložené.</p>';
    }else{
      item=item||{title:'',authorId:data.authors[0].id,date:new Date().toLocaleDateString('sv-SE'),categories:['Povídka'],tags:[],excerpt:'',authorWord:'',content:'',image:'',alt:'',status:'draft'};
      $('fields').innerHTML=field('title','Název textu',item.title,'text',true)+`<div class="two-col"><div><label for="f-author">Autor</label><select id="f-author" name="authorId">${data.authors.map(a=>`<option value="${esc(a.id)}" ${a.id===item.authorId?'selected':''}>${esc(a.name)}${a.published?'':' (skrytý)'}</option>`).join('')}</select></div><div>${field('date','Datum vydání',item.date,'date',true)}</div></div>`+field('categories','Žánry (oddělte čárkou)',item.categories.join(', '),'text',true)+`<label>Štítky</label><div class="tag-options">${data.tags.length?data.tags.map(t=>`<label class="check"><input type="checkbox" name="tag" value="${esc(t)}" ${item.tags.includes(t)?'checked':''}>${esc(t)}</label>`).join(''):'<p class="hint">Štítky můžete vytvořit v záložce Štítky.</p>'}</div>`+area('excerpt','Anotace — upoutávka na kartě',item.excerpt)+area('authorWord','Slovo autora — samostatná poznámka (volitelné)',item.authorWord)+area('content','Celý text — odstavce a verše zůstávají zachovány',item.content,false,'full-text')+imageFields(item)+field('alt','Popis obrázku',item.alt)+`<label for="f-status">Zveřejnění</label><select id="f-status" name="status"><option value="draft" ${item.status==='draft'?'selected':''}>Koncept — pouze v administraci</option><option value="published" ${item.status==='published'?'selected':''}>Publikováno — zobrazit na webu</option></select><p class="hint">Publikovaný text se po aktualizaci webu objeví v katalogu a u autora. Šest nejnovějších podle data vydání také na úvodu. Změna textu sama datum neposouvá; budoucí datum neznamená odložené publikování.</p>`;
    }
    if($('f-upload'))$('f-upload').addEventListener('change',chooseImage);
    $('editor').showModal();$('editor').scrollTop=0;$('fields').scrollTop=0;
  }
  $('add').addEventListener('click',()=>open(null));
  $('edit-form').addEventListener('input',()=>{dirty=true;});
  function close(){if(busy)return;if(dirty&&!confirm('Zahodit neuložené změny?'))return;$('editor').close();}
  $('close').addEventListener('click',close);$('editor').addEventListener('cancel',e=>{e.preventDefault();close();});
  $('editor').addEventListener('close',()=>{dirty=false;pendingImage=null;if(imageURL)URL.revokeObjectURL(imageURL);imageURL=null;});
  window.addEventListener('beforeunload',e=>{if(dirty||busy){e.preventDefault();e.returnValue='';}});
  async function chooseImage(){
    const file=$('f-upload').files[0];pendingImage=null;if(!file)return;
    try{
      if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>10*1024*1024)throw new Error('Vyberte JPG, PNG nebo WebP do 10 MB.');
      setBusy(true);const bitmap=await createImageBitmap(file);const scale=Math.min(1,1600/Math.max(bitmap.width,bitmap.height));
      const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();
      const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',0.85));if(!blob)throw new Error('Obrázek se nepodařilo převést.');
      const extension=blob.type==='image/webp'?'webp':'png';const bytes=new Uint8Array(await blob.arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));
      pendingImage={path:`assets/uploads/${crypto.randomUUID()}.${extension}`,base64:btoa(binary)};
      if(imageURL)URL.revokeObjectURL(imageURL);imageURL=URL.createObjectURL(blob);$('image-preview').src=imageURL;$('image-preview').hidden=false;$('edit-form').elements.removeImage.checked=false;$('form-error').textContent='';dirty=true;
    }catch(error){$('form-error').textContent=error.message;$('f-upload').value='';}finally{setBusy(false);}
  }
  function readItem(){
    const f=new FormData($('edit-form'));const type=editing.type;
    if(type==='tags')return f.get('tag').trim();
    const old=data[type].find(i=>i.id===editing.id)||{};
    const item={...old,id:old.id||crypto.randomUUID()};
    const image=f.has('removeImage')?'':pendingImage?.path||old.image||'';
    if(type==='authors')Object.assign(item,{name:f.get('name').trim(),genre:f.get('genre').trim(),bio:f.get('bio'),image,published:f.has('published')});
    else Object.assign(item,{title:f.get('title').trim(),authorId:f.get('authorId'),date:f.get('date'),categories:[...new Set(f.get('categories').split(',').map(s=>s.trim()).filter(Boolean))],tags:f.getAll('tag'),excerpt:f.get('excerpt').trim(),authorWord:f.get('authorWord').trim(),content:f.get('content'),image,alt:f.get('alt').trim(),status:f.get('status')});
    return item;
  }
  function candidate(item){
    const next=ContentModel.copy(data),type=editing.type;
    if(type==='tags'){
      if(editing.id)ContentModel.renameTag(next,editing.id,item);
      else {if(next.tags.includes(item))throw new Error('Tento štítek už existuje.');next.tags.push(item);}
    }else{const index=next[type].findIndex(v=>v.id===editing.id);if(index<0)next[type].push(item);else next[type][index]=item;}
    return next;
  }
  async function persist(next){
    const errors=ContentModel.validate(next);if(errors.length)throw new Error(errors.join(' '));
    const result=await store.save(next,sha);data=next;sha=result.content.sha;dirty=false;$('editor').close();render();
    notice('Uloženo do GitHubu. Web se nyní aktualizuje — dokončení ověřte přes Průběh publikování.');
  }
  $('edit-form').addEventListener('submit',async event=>{
    event.preventDefault();if(busy)return;
    try{const item=readItem(),next=candidate(item);const errors=ContentModel.validate(next);if(errors.length)throw new Error(errors.join(' '));setBusy(true);
      if(pendingImage&&!pendingImage.uploaded&&item.image===pendingImage.path){await store.upload(pendingImage.path,pendingImage.base64);pendingImage.uploaded=true;}
      await persist(next);
    }catch(error){$('form-error').textContent=error.message;}finally{setBusy(false);}
  });
  $('delete').addEventListener('click',async()=>{
    if(busy)return;
    try{const next=ContentModel.copy(data);if(editing.type==='authors')ContentModel.removeAuthor(next,editing.id);
      else if(editing.type==='posts')next.posts=next.posts.filter(p=>p.id!==editing.id);
      else {if(next.posts.some(p=>p.tags.includes(editing.id)))throw new Error('Štítek se používá v textech. Nejprve jej z nich odeberte.');next.tags=next.tags.filter(t=>t!==editing.id);}
      if(!confirm('Odstranit tuto položku z obsahu? Změna se uloží do GitHubu.'))return;
      setBusy(true);await persist(next);
    }catch(error){$('form-error').textContent=error.message;}finally{setBusy(false);}
  });
  $('preview-button').addEventListener('click',()=>{
    const item=readItem();const image=item.image?(imageURL&&pendingImage?imageURL:safeImage(item.image)):'';
    $('preview-content').innerHTML=editing.type==='authors'?`${image?`<img src="${esc(image)}" alt="">`:''}<h1>${esc(item.name)}</h1><p>${esc(item.genre)}</p><div class="preview-body">${esc(item.bio)}</div>`:`<p class="eyebrow">${esc(item.categories.join(' · '))} · ${esc(item.date)}</p><h1>${esc(item.title)}</h1><p>${esc(data.authors.find(a=>a.id===item.authorId)?.name)}</p><p class="preview-annotation">${esc(item.excerpt)}</p>${image?`<img src="${esc(image)}" alt="${esc(item.alt)}">`:''}<div class="preview-body">${esc(item.content)}</div>${item.authorWord?`<h2>Slovo autora</h2><div class="preview-note">${esc(item.authorWord)}</div>`:''}`;
    $('preview').showModal();
  });
  $('preview-close').addEventListener('click',()=>$('preview').close());
})();
