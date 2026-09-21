const money = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
const date = s => s ? new Date(s).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'}) : '—';
const score = a => `<span class="score ${a.healthBand}">${a.healthScore}</span>`;

const [summary, risk, accounts] = await Promise.all([
  fetch('/api/summary').then(r=>r.json()),
  fetch('/api/risk-inbox').then(r=>r.json()),
  fetch('/api/accounts').then(r=>r.json())
]);

document.querySelector('#metrics').innerHTML = [
  ['ARR', money(summary.arr), ''],
  ['At-risk ARR', money(summary.atRiskArr), 'risk'],
  ['Red accounts', summary.redAccounts, 'risk'],
  ['Amber accounts', summary.amberAccounts, '']
].map(([l,v,c])=>`<div class="card"><div class="label">${l}</div><div class="metric ${c}">${v}</div></div>`).join('');

document.querySelector('#risk').innerHTML = risk.map(a=>`<tr>
  <td><strong>${a.name}</strong></td><td>${money(a.mrr)}</td><td>${score(a)}</td><td>${date(a.renewalAt)}</td>
  <td class="reason">${a.healthReasons.map(r=>r.message).join(' · ') || 'No active risk signals'}</td>
</tr>`).join('') || '<tr><td colspan="5">No at-risk accounts.</td></tr>';

document.querySelector('#accounts').innerHTML = accounts.map(a=>`<tr>
  <td><strong>${a.name}</strong></td><td>${money(a.mrr)}</td><td>${a.usage7d}</td><td>${a.usagePrev7d}</td><td>${score(a)}</td>
</tr>`).join('');
