import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {catalog,root} from './build-ai.mjs';
const ids=new Set(catalog.tools.map(t=>t.id)),categories=new Set(catalog.categories.map(c=>c.id));
assert.equal(ids.size,catalog.tools.length);
assert.equal(new Set(catalog.editions.map(e=>e.id)).size,catalog.editions.length);
for(const t of catalog.tools){assert(/^[a-z0-9-]+$/.test(t.id));assert(categories.has(t.category));assert(t.summary&&t.name&&t.sources.length);assert(t.sources.every(s=>s.url.startsWith('https://')));assert(catalog.editions.some(e=>e.featured.includes(t.id)),`${t.id} has no history`);}
for(const e of catalog.editions){assert.equal(new Set(e.featured).size,e.featured.length);assert(e.featured.every(id=>ids.has(id)));assert(e.reason&&e.date);assert(e.featured.every(id=>e.names?.[id]),`${e.id}: preserve display names`);}
for(const file of ['index.html','ai/index.html']){
 const html=fs.readFileSync(path.join(root,file),'utf8'),anchors=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(anchors.length,new Set(anchors).size);assert(!html.includes('\uFFFD'));
 for(const [,url]of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  if(/^https?:/.test(url))continue;
  const [part,hash]=url.split('#');let target=path.resolve(root,path.dirname(file),part.split('?')[0]||path.basename(file));
  assert(fs.existsSync(target),`${file}: ${url}`);if(fs.statSync(target).isDirectory())target=path.join(target,'index.html');
  if(hash)assert(fs.readFileSync(target,'utf8').includes(`id="${hash}"`),`${file}: ${url}`);
 }
}
console.log(`PASS: ${ids.size} entries; ${catalog.editions.length} editions; all retained IDs, source links and local anchors valid.`);
