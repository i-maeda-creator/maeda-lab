const form=document.querySelector('.filters');
const search=document.querySelector('#search'),status=document.querySelector('#status'),category=document.querySelector('#category');
const entries=[...document.querySelectorAll('.ai-entry')];
const normalize=s=>s.normalize('NFKC').toLowerCase();
function filter(){
  const words=normalize(search.value).trim().split(/\s+/).filter(Boolean);
  let count=0;
  for(const entry of entries){
    const text=[entry.querySelector('h3').textContent,...[...entry.children].filter(e=>e.tagName==='P'&&!e.classList.contains('checked')).map(e=>e.textContent)].join(' ');
    const show=words.every(w=>normalize(text).includes(w))&&(status.value==='all'||entry.dataset.status===status.value)&&(category.value==='all'||entry.dataset.category===category.value);
    entry.hidden=!show;if(show)count++;
  }
  document.querySelector('#result-count').textContent=`${count}件を表示 / 全${entries.length}件`;
  document.querySelector('#empty').hidden=count!==0;
}
form.addEventListener('submit',e=>e.preventDefault());
form.addEventListener('input',filter);
form.addEventListener('change',filter);
form.addEventListener('reset',()=>setTimeout(filter,0));
function revealAnchor(){
  const id=location.hash.slice(1),entry=entries.find(e=>e.id===id);
  if(entry){form.reset();entries.forEach(e=>e.hidden=false);filter();entry.scrollIntoView();}
}
window.addEventListener('hashchange',revealAnchor);
revealAnchor();
