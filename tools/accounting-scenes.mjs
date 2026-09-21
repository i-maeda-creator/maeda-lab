const rooms={bank:'銀行の相談窓口',study:'夜の学習デスク',warehouse:'商品の保管棚',delivery:'出荷カウンター',shop:'店頭とレジ',archive:'資料室',meeting:'決算ミーティング',dashboard:'店舗の分析会議'};
function scenery(setting,n){
 const grid='<path d="M0 188H520 M60 188L0 220 M240 188L220 220 M420 188L470 220" stroke="#d1c8b7"/>';
 const office='<path d="M350 50H495V165H350Z M420 50V165 M350 105H495" fill="#dae8e8" stroke="#77939a" stroke-width="3"/>';
 const shelf='<path d="M24 45H220V170H24Z M24 105H220 M24 165H220" fill="#e1d5bf" stroke="#8a7660" stroke-width="5"/><g fill="#c19368" stroke="#6f604e" stroke-width="2"><rect x="35" y="62" width="48" height="40"/><rect x="93" y="53" width="55" height="49"/><rect x="158" y="70" width="49" height="32"/><rect x="40" y="123" width="74" height="39"/><rect x="129" y="116" width="64" height="46"/></g>';
 const board='<rect x="285" y="30" width="205" height="125" rx="4" fill="#fcfcf3" stroke="#7c8c80" stroke-width="5"/><path d="M304 60H466 M304 90H410 M304 120H450" stroke="#c0cabd" stroke-width="5"/>';
 const props={
 bank:`${office}<rect x="20" y="33" width="220" height="65" rx="8" fill="#344f60"/><text x="130" y="75" fill="#fff" text-anchor="middle" font-size="23">BANK</text><path d="M0 160H520V220H0" fill="#c3b29a" stroke="#786b58" stroke-width="3"/><rect x="255" y="135" width="72" height="34" rx="5" fill="#738e94"/>`,
 study:`<rect width="520" height="220" fill="#394957"/><path d="M345 25H495V153H345Z" fill="#152737" stroke="#7d939f" stroke-width="3"/><circle cx="470" cy="55" r="17" fill="#e9d891"/><path d="M40 172L82 80H140 M85 72L62 105H152L130 72Z" fill="#d8a867" stroke="#b89059" stroke-width="5"/><path d="M0 191H520" stroke="#9c7c57" stroke-width="20"/>`,
 warehouse:`${shelf}<path d="M305 70H465V169H305Z" fill="#d5c6ae" stroke="#83715b" stroke-width="4"/><path d="M320 86H450 M320 107H450 M320 128H450" stroke="#b3a287" stroke-width="6"/>`,
 delivery:`${shelf}<rect x="280" y="42" width="214" height="114" fill="#dce4d9" stroke="#84947c" stroke-width="4"/><path d="M299 70H475 M300 102H420" stroke="#aec2a5" stroke-width="8"/><path d="M270 183H520" stroke="#9d896f" stroke-width="15"/>`,
 shop:`<path d="M0 25H520V55H0" fill="#bd7755"/><path d="M0 27H65V55H0 M130 27H195V55H130 M260 27H325V55H260 M390 27H455V55H390" fill="#f5e4c7"/><rect x="323" y="115" width="125" height="72" fill="#94a9a4" stroke="#5d726e" stroke-width="3"/><rect x="335" y="128" width="90" height="25" fill="#344943"/><path d="M290 190H520" stroke="#947758" stroke-width="22"/>`,
 archive:`${shelf}<rect x="300" y="38" width="190" height="135" fill="#c5d2cc" stroke="#71837b" stroke-width="3"/>${[0,1,2].map(i=>`<rect x="311" y="${48+i*39}" width="167" height="30" fill="#e3e9df"/><path d="M380 ${63+i*39}H412" stroke="#7c9185" stroke-width="4"/>`).join('')}`,
 meeting:`${board}<ellipse cx="270" cy="206" rx="230" ry="42" fill="#b39d7c" stroke="#7b6d57" stroke-width="3"/>`,
 dashboard:`${board}<g fill="#76a6bc"><rect x="314" y="99" width="30" height="40"/><rect x="358" y="82" width="30" height="57"/><rect x="402" y="53" width="30" height="86"/></g><path d="M0 198H520" stroke="#b3a185" stroke-width="12"/>`
 };
 const desk=n===1?'<path d="M0 200H520V220H0" fill="#a68e70"/><path d="M210 186L285 177L309 199L228 206Z" fill="#fff9e9" stroke="#8b7e67"/>':'';
 return `<svg class="scenery" viewBox="0 0 520 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="520" height="220" fill="#eee8dc"/>${grid}${props[setting]||office}${desk}</svg>`;
}
function closeup(setting){
 const labels={bank:['預金 +10万','借入金 +10万'],study:['借方　｜　貸方','100,000　100,000'],warehouse:['まだ売れていない','在庫 → 資産'],delivery:['今月：仕事を完了','来月：入金'],shop:['家賃：一定','包装材：個数で増える'],archive:['売上記録','納品・検収の証拠'],meeting:['会計の利益','税務上の調整'],dashboard:['A：10・10・10','B：2・2・26']};
 return `<div class="scene-prop"><span>${labels[setting][0]}</span><strong>${labels[setting][1]}</strong></div>`;
}
export function scene(setting,n,p,portrait){
 const other=p.speaker==='hoshino'?'horiuchi':'hoshino';
 return `<div class="stage stage-rich shot-${n}">${scenery(setting,n)}<span class="scene-location">${rooms[setting]}</span><div class="actor main-actor">${portrait(p.speaker,p.mood,n)}</div>${n===0||n===3?`<div class="actor partner">${portrait(other,n===3?'smile':'think',n)}</div>`:''}${n===2?closeup(setting):''}</div>`;
}
