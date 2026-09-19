import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { root, topics, catalog, scenarios } from './build-cloud.mjs';

const ids = new Set();
const order = new Map(topics.map((t,i)=>[t.id,i]));
for (const t of topics) {
  assert.match(t.id,/^[a-z][a-z0-9-]*$/);
  assert(!ids.has(t.id),`Duplicate topic ${t.id}`); ids.add(t.id);
  assert(catalog.levels[t.level],`Unknown level ${t.id}`);
  for (const k of ['title','summary','why','analogy','position','example','tradeoff','practice','mistake','takeaway']) assert.equal(typeof t[k],'string',`${t.id}.${k}`);
  assert(t.mechanism.length>=2 && t.sources.length>0 && t.flow.length>=2,`Incomplete topic ${t.id}`);
  for (const id of [...t.requires,...t.related]) assert(order.has(id),`${t.id}: unknown ${id}`);
  for (const id of t.requires) assert(order.get(id)<order.get(t.id),`${t.id}: prerequisite ${id} must appear earlier`);
  for (const s of t.sources) assert.equal(new URL(s.url).protocol,'https:');
}
assert.equal(new Set(scenarios.map(s=>s.id)).size,scenarios.length);
for (const company of scenarios) {
  assert(company.stages.length>=3);
  for (const stage of company.stages) {
    assert(stage.choices.length>=2);
    for (const choice of stage.choices) {
      assert(ids.has(choice.topic));
      for (const k of ['label','result','reason','benefit','risk','comparison','criterion']) assert(choice[k]?.length,`${company.id}: missing ${k}`);
    }
  }
}
const files = ['it/cloud.html',...fs.readdirSync(path.join(root,'it/cloud')).filter(f=>f.endsWith('.html')).map(f=>'it/cloud/'+f)];
let links=0;
for (const file of files) {
  const full=path.join(root,file), html=fs.readFileSync(full,'utf8');
  assert(!html.includes('\uFFFD'),`${file}: encoding corruption`);
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`${file}: h1`);
  const anchors=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(anchors).size,anchors.length,`${file}: duplicate IDs`);
  for (const [,url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^https?:/.test(url)) continue;
    const [part,hash]=url.split('#');
    const target=part?path.resolve(path.dirname(full),part.split('?')[0]):full;
    assert(fs.existsSync(target),`${file}: missing ${url}`);
    if(hash) assert(fs.readFileSync(target,'utf8').includes(`id="${hash}"`),`${file}: missing anchor ${url}`);
    links++;
  }
}
console.log(`PASS: ${topics.length} topics, ${catalog.levels.length} levels, ${files.length} pages, ${links} internal links, ${scenarios.length} complete company paths.`);
