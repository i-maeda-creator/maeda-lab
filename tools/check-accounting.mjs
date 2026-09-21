import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {root,catalog,challenges} from './build-accounting.mjs';
const subjects=new Set(catalog.subjects.map(s=>s.id));
const ids=new Set();
for(const e of catalog.episodes){
 assert(/^[a-z][a-z-]+$/.test(e.id) && !ids.has(e.id) && !subjects.has(e.id),`Invalid or duplicate episode ${e.id}`); ids.add(e.id);
 assert(subjects.has(e.subject));
 assert.equal(e.panels.length,4);
 assert.equal(typeof e.comic,'boolean');
 for(const k of ['title','exampleTitle','example','pitfall'])assert(e.lesson[k]?.trim());
 assert(e.lesson.paragraphs.length>=2);
 for(const p of e.panels){assert(['hoshino','horiuchi'].includes(p.speaker));assert(p.text.length<=125,`${e.id}: split long dialogue into another episode`);}
 for(const key of ['title','scene','takeaway','question','answer'])assert(e[key]?.trim(),`${e.id}.${key}`);
 assert.equal(e.visual.length,3); assert(e.terms.length<=3);
 assert(['balance','journal','timeline','change','split','equations','words','cost','bars','flow'].includes(e.diagram.kind));
 assert(e.diagram.title && e.diagram.note);
 for(const c of e.diagram.companies||[])assert(c.assets===c.liabilities+c.equity && c.liabilities>0 && c.equity>0,`${e.id}: balance totals`);
 for(const [label,url] of e.sources)assert(label && new URL(url).protocol==='https:');
}
for(const s of subjects)assert(catalog.episodes.some(e=>e.subject===s),`Empty subject ${s}`);
assert.equal(challenges.length,subjects.size);
assert.equal(new Set(challenges.map(q=>q.subject)).size,subjects.size);
for(const q of challenges){
 assert(subjects.has(q.subject));
 for(const k of ['title','hint','answer','pitfall'])assert(q[k]?.trim());
 for(const k of ['preparation','data','tasks','steps'])assert(q[k].length>=2 && q[k].every(t=>typeof t==='string' && t.trim()));
 assert(q.sources.length>0 && q.sources.every(s=>new URL(s[1]).protocol==='https:'));
 assert(q.prerequisites.every(id=>ids.has(id)));
}
let links=0;
const files=fs.readdirSync(path.join(root,'accounting')).filter(f=>f.endsWith('.html'));
assert.equal(files.length,1+catalog.subjects.length+catalog.episodes.length+challenges.length);
for(const file of files){
 const full=path.join(root,'accounting',file),html=fs.readFileSync(full,'utf8');
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
 assert(!html.includes('\uFFFD')); assert(!html.includes('公認会計士'),`${file}: keep qualification names out of site copy`);
 const lesson=catalog.episodes.find(e=>`${e.id}.html`===file);
 if(lesson)assert.equal((html.match(/class="comic"/g)||[]).length,lesson.comic?1:0,`${file}: optional comic`);
 if(file.endsWith('-challenge.html'))assert(html.includes('class="solution" id="solution"') && !html.includes('id="solution" open'),`${file}: answer hidden until opened`);
 const anchors=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(anchors.length,new Set(anchors).size);
 for(const [,url] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  if(/^https?:/.test(url))continue;
  const [part,hash]=url.split('#');let target=part?path.resolve(path.dirname(full),part.split('?')[0]):full;
  if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
  assert(fs.existsSync(target),`${file}: missing ${url}`);
  if(hash)assert(fs.readFileSync(target,'utf8').includes(`id="${hash}"`)); links++;
 }
}
assert(fs.readFileSync(path.join(root,'index.html'),'utf8').includes('href="accounting/"'));
console.log(`PASS: ${files.length} pages, ${catalog.episodes.length} lessons, ${catalog.episodes.filter(e=>e.comic).length} optional comics, ${challenges.length} challenges, ${links} local links.`);
