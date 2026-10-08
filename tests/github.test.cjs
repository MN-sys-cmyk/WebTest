const test=require('node:test'),assert=require('node:assert/strict');const {Store,encode,decode}=require('../admin/github.js');
test('UTF-8 Czech text roundtrips in GitHub contents',()=>{const value='Žluťoučký kůň\nPříběh 🦊';assert.equal(decode(encode(value)),value);});
test('save carries expected SHA and writes only content file',async()=>{let called;const store=new Store('test-token',async(url,opts)=>{called={url,opts};return {ok:true,json:async()=>({content:{sha:'next'}})};});const data={title:'Nový příběh'};await store.save(data,'old');assert.ok(called.url.endsWith('/contents/content/data.json'));const body=JSON.parse(called.opts.body);assert.equal(body.sha,'old');assert.equal(body.branch,'main');assert.deepEqual(JSON.parse(decode(body.content)),data);assert.equal(called.opts.headers.Authorization,'Bearer test-token');store.logout();assert.equal(store.token,'');});
test('conflicting writes report recovery without retrying or overwriting',async()=>{let calls=0;const store=new Store('test-token',async()=>{calls++;return {ok:false,status:409};});await assert.rejects(store.save({},'old'),/mezitím změnil/);assert.equal(calls,1);});
test('load reads master data and retains its SHA',async()=>{let calls=0;const store=new Store('test-token',async()=>({ok:true,json:async()=>++calls===1?{permissions:{push:true}}:{content:encode('{"version":1}'),sha:'current'}}));assert.deepEqual(await store.load(),{data:{version:1},sha:'current'});});
test('failed credentials are a visible error',async()=>{const store=new Store('test-token',async()=>({ok:false,status:401}));await assert.rejects(store.load(),/token neplatný/);});

 test('browser fetch keeps its Window receiver for login, saves and uploads',async()=>{
 const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
 const context=vm.createContext({TextEncoder,TextDecoder,btoa,atob});
 vm.runInContext(`let calls=0; async function fetch(url,options){
 if(this!==globalThis)throw new TypeError('Can only call Window.fetch on instances of Window');
 calls++; return {ok:true,json:async()=>({content:{sha:'next'}})};
 }`,context);
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../admin/github.js'),'utf8'),context);
 await vm.runInContext(`(async()=>{const store=new AdminGitHub.Store('test'); await store.api(''); await store.save({authors:[],posts:[]},'old'); await store.upload('assets/uploads/test.webp','test');})()`,context);
 assert.equal(vm.runInContext('calls',context),3);
 });
