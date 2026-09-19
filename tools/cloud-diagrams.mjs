const esc = v => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num = n => { if (!Number.isFinite(n)) throw new Error('Diagram coordinate must be finite'); return n; };

export function renderDiagram(id, d) {
  if (!d) return '';
  const prefix = `diagram-${id}`;
  let graphic;
  if (d.kind === 'pyramid') {
    graphic = `<ol class="learning-pyramid" reversed aria-label="上が設計、下が学習の土台">${d.layers.map((l,i)=>`<li class="pyramid-tier tier-${i}"><a href="#level-${l.level}"><strong>${esc(l.label)}</strong><span>${esc(l.detail)}</span></a></li>`).join('')}</ol>`;
  } else if (d.kind === 'matrix') {
    const owner = code => code === 'user' ? '利用者' : '事業者';
    graphic = `<div class="diagram-scroll" tabindex="0" role="region" aria-label="${esc(d.title)}の比較表"><table class="responsibility-matrix"><thead><tr><th scope="col">管理するもの</th>${d.columns.map(c=>`<th scope="col">${esc(c)}</th>`).join('')}</tr></thead><tbody>${d.rows.map(row=>`<tr><th scope="row">${esc(row.label)}</th>${row.owners.map(o=>`<td><span class="owner-${esc(o)}">${owner(o)}</span></td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  } else if (d.kind === 'graph') {
    const arrowId = `${prefix}-arrow`;
    const groups = (d.groups||[]).map(g=>`<rect class="dg-group" x="${num(g.x)}" y="${num(g.y)}" width="${num(g.w)}" height="${num(g.h)}" rx="14"/><text class="dg-group-label" x="${g.x+g.w/2}" y="${g.y+26}" text-anchor="middle">${esc(g.label)}</text>`).join('');
    const guides = (d.guides||[]).map(p=>`<path class="dg-guide" d="${esc(p)}"/>`).join('');
    const edges = d.edges.map(e=>`<path class="dg-edge" d="${esc(e.path)}" marker-end="url(#${arrowId})"/>`).join('');
    const labels = d.edges.filter(e=>e.label).map(e=>`<text class="dg-edge-label" x="${num(e.x)}" y="${num(e.y)}" text-anchor="middle">${esc(e.label)}</text>`).join('');
    const nodes = d.nodes.map(n=>{
      const shape = n.shape === 'decision' ? `<polygon points="${n.x+20},${n.y} ${n.x+n.w-20},${n.y} ${n.x+n.w},${n.y+n.h/2} ${n.x+n.w-20},${n.y+n.h} ${n.x+20},${n.y+n.h} ${n.x},${n.y+n.h/2}"/>` : `<rect x="${num(n.x)}" y="${num(n.y)}" width="${num(n.w)}" height="${num(n.h)}" rx="10"/>`;
      return `<g class="dg-node ${esc(n.tone||'blue')}">${shape}<text x="${n.x+n.w/2}" y="${n.y+n.h/2-(n.lines.length-1)*12}" dominant-baseline="middle" text-anchor="middle">${n.lines.map((line,i)=>`<tspan x="${n.x+n.w/2}" dy="${i?24:0}">${esc(line)}</tspan>`).join('')}</text></g>`;
    }).join('');
    graphic = `<div class="diagram-scroll" tabindex="0" role="region" aria-label="${esc(d.title)}の図。狭い画面では横にスクロールできます"><svg class="concept-svg" viewBox="0 0 680 ${num(d.height)}" role="img" aria-labelledby="${prefix}-svg-title ${prefix}-svg-desc"><title id="${prefix}-svg-title">${esc(d.title)}</title><desc id="${prefix}-svg-desc">${esc(d.summary+' '+d.reading.join(' '))}</desc><defs><marker id="${arrowId}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#a9cff5"/></marker></defs>${groups}${guides}${edges}${nodes}${labels}</svg></div>`;
  } else throw new Error(`Unknown diagram kind: ${d.kind}`);
  return `<figure class="concept-figure" id="${prefix}"><figcaption><span class="eyebrow">VISUAL GUIDE / ${esc(d.label||'学習ピラミッド')}</span><strong>${esc(d.title)}</strong><p>${esc(d.summary)}</p></figcaption>${d.kind==='pyramid'?'':'<p class="diagram-scroll-hint">図が収まらないときは、図の中を横にスクロールできます。</p>'}${graphic}<p class="diagram-note">${esc(d.note)}</p>${d.reading?`<details class="diagram-reading"><summary>図の読み方を文章で確認する</summary><ol>${d.reading.map(line=>`<li>${esc(line)}</li>`).join('')}</ol></details>`:''}</figure>`;
}
