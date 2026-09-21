const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderAccountingDiagram(e){
 const d=e.diagram;
 let body='';
 const blocks=(columns,cls)=>`<div class="diagram-columns ${cls}">${columns.map(col=>`<div>${col.map((s,i)=>i?`<strong>${esc(s)}</strong>`:`<span>${esc(s)}</span>`).join('')}</div>`).join('')}</div>`;
 if(d.kind==='balance')body=`<div class="balance-comparison">${d.companies.map(c=>`<section class="balance-company" aria-label="${esc(c.name)}の貸借対照表"><h3>${esc(c.name)}</h3><div class="balance-labels"><span>資産</span><span>負債・純資産</span></div><div class="balance-chart"><div class="asset-box"><span>資産</span><strong>${c.assets}<small>万円</small></strong></div><div class="funding"><div class="liability-box" style="flex:${c.liabilities}"><span>負債</span><strong>${c.liabilities}<small>万円</small></strong></div><div class="equity-box" style="flex:${c.equity}"><span>純資産</span><strong>${c.equity}<small>万円</small></strong></div></div></div><p class="balance-total">${c.assets} ＝ ${c.liabilities} ＋ ${c.equity}</p></section>`).join('')}</div>`;
 else if(['journal','timeline','change','split'].includes(d.kind))body=blocks(d.columns,d.kind);
 else if(d.kind==='equations')body='<div class="equations"><div><span class="asset-box">資産</span><b>−</b><span class="liability-box">負債</span><b>＝</b><span class="equity-box">純資産</span></div><div><span>収益</span><b>−</b><span>費用</span><b>＝</b><span>利益</span></div></div>';
 else if(d.kind==='words')body=blocks(e.terms,'word-pairs');
 else if(d.kind==='cost')body=`<div class="cost-legend"><span>青：家賃（固定費）</span><span>橙：包装材（変動費）</span></div><div class="cost-chart">${[[100,10000],[300,30000]].map(([count,cost])=>`<div class="cost-row"><span>${count}個販売</span><div class="cost-bar"><div class="rent" style="width:50%">3万円</div><div class="package" style="width:${cost/60000*100}%">${cost/10000}万円</div></div><strong>計${(cost+30000)/10000}万円</strong></div>`).join('')}</div>`;
 else if(d.kind==='bars')body=`<div class="sales-comparison">${[['A店',[10,10,10]],['B店',[2,2,26]]].map(([name,values])=>`<section><h3>${name}<small>平均 10万円</small></h3><div class="sales-chart">${values.map((v,i)=>`<div class="sales-day"><span>${v}</span><div class="sales-bar" style="height:${v*6}px"></div><small>${i+1}日目</small></div>`).join('')}</div></section>`).join('')}</div>`;
 else body=`<ol class="diagram-flow">${e.visual.map(v=>`<li>${esc(v)}</li>`).join('')}</ol>`;
 return `<figure class="accounting-diagram"><figcaption><span>VISUAL NOTE</span><strong>${esc(d.title)}</strong></figcaption>${body}<p class="diagram-caption">${esc(d.note)}</p></figure>`;
}
