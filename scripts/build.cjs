const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {publicData} = require('../content-model.js');
function build(root = path.resolve(__dirname, '..'), out = path.join(root, '_site')) {
  const data = JSON.parse(fs.readFileSync(path.join(root, 'content/data.json'), 'utf8'));
  const published = publicData(data);
  for (const item of [...published.authors, ...published.posts]) {
    if (item.image && !fs.existsSync(path.join(root, item.image))) throw new Error(`Chybí obrázek: ${item.image}`);
  }
  const revision = crypto.createHash('sha256').update(JSON.stringify(published)).digest('hex').slice(0, 12);
  fs.rmSync(out, {recursive: true, force: true}); fs.mkdirSync(out, {recursive: true});
  for (const item of fs.readdirSync(root, {withFileTypes: true})) {
    if (item.isFile() && /\.(?:html|css|js|png|webp|jpe?g|gif|ico)$/.test(item.name) && item.name !== 'data.js') {
      const source = path.join(root, item.name), dest = path.join(out, item.name);
      if (item.name.endsWith('.html')) fs.writeFileSync(dest, fs.readFileSync(source, 'utf8').replace(/data\.js(?:\?[^"']*)?/g, `data.js?v=${revision}`));
      else fs.copyFileSync(source, dest);
    }
  }
  for (const dir of ['admin','assets','image','partials']) if (fs.existsSync(path.join(root,dir))) fs.cpSync(path.join(root,dir),path.join(out,dir),{recursive:true});
  fs.writeFileSync(path.join(out,'data.js'), `// Generated from content/data.json; edit in /admin/.\nwindow.DATA = ${JSON.stringify(published)};\n`);
  fs.writeFileSync(path.join(out,'publication.json'),JSON.stringify({revision,publishedAt:new Date().toISOString(),commit:process.env.GITHUB_SHA || null}));
  fs.writeFileSync(path.join(out,'.nojekyll'),'');
  return published;
}
if (require.main === module) { const data=build(); console.log(`Publikováno: ${data.authors.length} autorů, ${data.posts.length} textů.`); }
module.exports = {build};
