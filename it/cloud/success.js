(() => {
  'use strict';
  const companies = window.CLOUD_SCENARIOS || [];
  const $ = selector => document.querySelector(selector);
  let company, step = 0, decisions = [], selection = null;
  const text = (tag, content, className) => {
    const el = document.createElement(tag);
    el.textContent = content;
    if (className) el.className = className;
    return el;
  };
  function render() {
    selection = null;
    const stage = company.stages[step];
    $('#game-progress').textContent = `${company.title} / STAGE ${step+1} OF ${company.stages.length}`;
    $('#stage-title').textContent = stage.title;
    $('#stage-story').textContent = stage.story;
    $('#stage-context').textContent = stage.context + (step ? ` 前の段階で選んだ方針：${decisions[step-1].choice.label}。この構成を続けるか、変更するかも考えましょう。` : '');
    $('#choices').replaceChildren();
    stage.choices.forEach((choice, index) => {
      const button = text('button', choice.label);
      button.type = 'button'; button.setAttribute('aria-pressed','false');
      button.addEventListener('click', () => choose(index));
      $('#choices').append(button);
    });
    $('#feedback').hidden = true;
    $('#next-stage').hidden = true;
    $('#stage-title').focus();
  }
  function choose(index) {
    selection = company.stages[step].choices[index];
    [...$('#choices').children].forEach((el,i)=>el.setAttribute('aria-pressed',String(i===index)));
    const box = $('#feedback');
    box.replaceChildren(text('h3',selection.label));
    const dl = document.createElement('dl');
    for (const [key,label] of [['result','何が起きる？'],['reason','なぜ？'],['benefit','メリット'],['risk','デメリット'],['comparison','他の案と比較'],['criterion','判断の基準']]) dl.append(text('dt',label),text('dd',selection[key]));
    box.append(dl);
    const a = text('a','関連する教科書を読む →');
    a.href = `${selection.topic}.html`; a.target = '_blank'; a.rel = 'noopener';
    a.setAttribute('aria-label','関連する教科書を新しいタブで読む');
    box.append(a);
    box.hidden = false;
    $('#next-stage').textContent = step+1 === company.stages.length ? '設計ノートを振り返る →' : 'この方針で次の成長段階へ →';
    $('#next-stage').hidden = false;
  }
  for (const button of document.querySelectorAll('[data-company]')) {
    const found = companies.find(c=>c.id===button.dataset.company);
    if (!found) continue;
    button.disabled = false;
    button.addEventListener('click',()=> {
      company=found; step=0; decisions=[];
      $('#company-picker').hidden=true; $('#game-summary').hidden=true; $('#game').hidden=false; render();
    });
  }
  $('#next-stage').addEventListener('click',()=> {
    if (!selection) return;
    decisions.push({title:company.stages[step].title,choice:selection});
    step++;
    if (step<company.stages.length) { render(); return; }
    $('#game').hidden=true; $('#game-summary').hidden=false; $('#decisions').replaceChildren();
    decisions.forEach((d,i)=> {
      const box=text('article','','decision');
      box.append(text('h3',`${i+1}. ${d.title}`),text('p',`選んだ方針：${d.choice.label}`),text('p',`引き受けた弱点：${d.choice.risk}`),text('p',`見直すときの視点：${d.choice.criterion}`));
      $('#decisions').append(box);
    });
    $('#summary-title').focus();
  });
  function restart() {
    step=0; decisions=[]; selection=null;
    $('#game').hidden=true; $('#game-summary').hidden=true; $('#company-picker').hidden=false;
    document.querySelector('[data-company]').focus();
  }
  $('#restart').addEventListener('click',restart);
  $('#play-again').addEventListener('click',restart);
})();
