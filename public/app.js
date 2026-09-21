const money = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Number(n || 0));
const date = s => s ? new Date(s).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'}) : '—';
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const paymentLabel = value => ({ok:'Current',failed:'Failed',past_due:'Past due'})[value] ?? String(value ?? 'Unknown');

let state = { summary:null, risk:[], accounts:[], selected:null, riskFilter:'all', riskSearch:'', accountSearch:'' };

const scoreCell = a => {
  const width = Math.max(0, Math.min(100, Number(a.healthScore || 0)));
  return `<div class="health ${escapeHtml(a.healthBand)}"><span class="health-bar" aria-hidden="true"><span style="width:${width}%"></span></span><span class="health-value">${width}</span></div>`;
};

function signalLines(account){
  const reasons = Array.isArray(account.healthReasons) ? account.healthReasons : [];
  if (!reasons.length) return '<span class="risk-signal">No active risk signals</span>';
  return reasons.slice(0,3).map(reason => `<span class="risk-signal">${escapeHtml(reason.message)}</span>`).join('');
}

function renderStats(target, summary){
  document.querySelector(target).innerHTML = [
    ['ARR', money(summary.arr), ''],
    ['At-risk ARR', money(summary.atRiskArr), 'stat-risk'],
    ['Critical', summary.redAccounts, 'stat-risk'],
    ['Watch', summary.amberAccounts, '']
  ].map(([label,value,className]) => `
    <div class="stat ${className}">
      <div class="stat-label">${label}</div>
      <div class="stat-value">${value}</div>
    </div>`).join('');
}

function riskRows(){
  const query = state.riskSearch.trim().toLowerCase();
  return state.risk.filter(account => {
    const bandMatch = state.riskFilter === 'all' || account.healthBand === state.riskFilter;
    const searchMatch = !query || account.name.toLowerCase().includes(query) || account.externalId.toLowerCase().includes(query);
    return bandMatch && searchMatch;
  });
}

function accountRows(){
  const query = state.accountSearch.trim().toLowerCase();
  return state.accounts.filter(account =>
    !query || account.name.toLowerCase().includes(query) || account.externalId.toLowerCase().includes(query)
  );
}

function renderRisk(){
  const rows = riskRows();
  const body = document.querySelector('#risk');
  body.innerHTML = rows.length ? rows.map(a => `
    <tr data-account-id="${escapeHtml(a.externalId)}" tabindex="0" aria-selected="${state.selected?.externalId === a.externalId ? 'true' : 'false'}" class="${state.selected?.externalId === a.externalId ? 'is-selected' : ''}">
      <td class="account-cell"><strong>${escapeHtml(a.name)}</strong><span class="account-id">${escapeHtml(a.externalId)}</span></td>
      <td class="money">${money(a.mrr)}</td>
      <td>${scoreCell(a)}</td>
      <td class="date-cell">${date(a.renewalAt)}</td>
      <td class="reason">${signalLines(a)}</td>
    </tr>`).join('') : '<tr class="empty-row"><td colspan="5">No accounts match this view.</td></tr>';
  bindRowSelection(body);
}

function renderAccounts(){
  const rows = accountRows();
  const body = document.querySelector('#accounts');
  body.innerHTML = rows.length ? rows.map(a => `
    <tr data-account-id="${escapeHtml(a.externalId)}" tabindex="0" aria-selected="${state.selected?.externalId === a.externalId ? 'true' : 'false'}" class="${state.selected?.externalId === a.externalId ? 'is-selected' : ''}">
      <td class="account-cell"><strong>${escapeHtml(a.name)}</strong><span class="account-id">${escapeHtml(a.externalId)}</span></td>
      <td class="money">${money(a.mrr)}</td>
      <td class="number">${Number(a.usage7d || 0)}</td>
      <td class="number">${Number(a.usagePrev7d || 0)}</td>
      <td>${scoreCell(a)}</td>
      <td><span class="band-label ${escapeHtml(a.healthBand)}">${a.healthBand === 'red' ? 'Critical' : a.healthBand === 'amber' ? 'Watch' : 'Healthy'}</span></td>
    </tr>`).join('') : '<tr class="empty-row"><td colspan="6">No accounts match this view.</td></tr>';
  bindRowSelection(body);
  document.querySelector('#accountSummary').textContent = `${rows.length} of ${state.accounts.length} accounts`;
}

function bindRowSelection(tbody){
  const selectRow = row => {
    const account = state.accounts.find(a => a.externalId === row.dataset.accountId);
    if (!account) return;
    state.selected = account;
    renderInspector();
    renderRisk();
    renderAccounts();
  };
  tbody.querySelectorAll('tr[data-account-id]').forEach(row => {
    row.addEventListener('click', () => selectRow(row));
    row.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      selectRow(row);
    });
  });
}

function renderInspector(){
  const a = state.selected;
  if (!a) return;
  document.querySelector('#inspectorName').textContent = a.name;
  document.querySelector('#inspectorId').textContent = a.externalId;
  document.querySelector('#inspectorMrr').textContent = money(a.mrr);
  document.querySelector('#inspectorArr').textContent = money(Number(a.mrr || 0) * 12);
  document.querySelector('#inspectorRenewal').textContent = date(a.renewalAt);
  document.querySelector('#inspectorPayment').textContent = paymentLabel(a.paymentStatus);
  document.querySelector('#inspectorUsage').textContent = Number(a.usage7d || 0).toLocaleString();
  document.querySelector('#inspectorUsagePrev').textContent = Number(a.usagePrev7d || 0).toLocaleString();
  document.querySelector('#inspectorHealth').textContent = `${a.healthScore} / 100`;
  const reasons = Array.isArray(a.healthReasons) ? a.healthReasons : [];
  document.querySelector('#inspectorSignals').innerHTML = reasons.length
    ? reasons.map(reason => `<li class="${reason.impact <= -20 ? '' : 'warning'}">${escapeHtml(reason.message)}</li>`).join('')
    : '<li>No active risk signals.</li>';
}

function switchView(view){
  document.querySelectorAll('[data-panel]').forEach(panel => panel.hidden = panel.dataset.panel !== view);
  document.querySelectorAll('.nav-button[data-view]').forEach(button => button.classList.toggle('is-active', button.dataset.view === view));
}

function bindControls(){
  document.querySelectorAll('.nav-button[data-view]').forEach(button => button.addEventListener('click', () => switchView(button.dataset.view)));
  document.querySelectorAll('[data-risk-filter]').forEach(button => button.addEventListener('click', () => {
    state.riskFilter = button.dataset.riskFilter;
    document.querySelectorAll('[data-risk-filter]').forEach(item => item.classList.toggle('is-active', item === button));
    renderRisk();
  }));
  document.querySelector('#riskSearch').addEventListener('input', event => { state.riskSearch = event.target.value; renderRisk(); });
  document.querySelector('#accountSearch').addEventListener('input', event => { state.accountSearch = event.target.value; renderAccounts(); });
  document.querySelector('#refreshButton').addEventListener('click', load);
}

async function load(){
  const button = document.querySelector('#refreshButton');
  button.disabled = true;
  button.textContent = 'Refreshing';
  try{
    const [summary, risk, accounts] = await Promise.all([
      fetch('/api/summary').then(r => { if(!r.ok) throw new Error('Summary unavailable'); return r.json(); }),
      fetch('/api/risk-inbox').then(r => { if(!r.ok) throw new Error('Risk inbox unavailable'); return r.json(); }),
      fetch('/api/accounts').then(r => { if(!r.ok) throw new Error('Accounts unavailable'); return r.json(); })
    ]);
    state.summary = summary;
    state.risk = risk;
    state.accounts = accounts;
    state.selected = state.selected ? accounts.find(a => a.externalId === state.selected.externalId) : (risk[0] || accounts[0] || null);

    renderStats('#metrics', summary);
    renderStats('#accountMetrics', summary);
    renderRisk();
    renderAccounts();
    renderInspector();

    document.querySelector('#riskCount').textContent = risk.length;
    document.querySelector('#accountCount').textContent = accounts.length;
    document.querySelector('.workspace-meta').textContent = `${accounts.length} accounts`;
    document.querySelector('#lastUpdated').textContent = `Updated ${new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}`;
  }catch(error){
    document.querySelector('#risk').innerHTML = `<tr class="empty-row"><td colspan="5">${escapeHtml(error.message)}</td></tr>`;
    document.querySelector('#accounts').innerHTML = `<tr class="empty-row"><td colspan="6">${escapeHtml(error.message)}</td></tr>`;
    document.querySelector('#lastUpdated').textContent = 'Data connection failed';
  }finally{
    button.disabled = false;
    button.textContent = 'Refresh';
  }
}

bindControls();
load();
