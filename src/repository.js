import { db } from './db.js';
import { scoreAccount } from './score.js';

const upsertStmt = db.prepare(`
  INSERT INTO accounts (
    external_id, name, mrr, renewal_at, usage_7d, usage_prev_7d,
    last_seen_at, payment_status, health_score, health_band, health_reasons, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(external_id) DO UPDATE SET
    name=excluded.name,
    mrr=excluded.mrr,
    renewal_at=excluded.renewal_at,
    usage_7d=excluded.usage_7d,
    usage_prev_7d=excluded.usage_prev_7d,
    last_seen_at=excluded.last_seen_at,
    payment_status=excluded.payment_status,
    health_score=excluded.health_score,
    health_band=excluded.health_band,
    health_reasons=excluded.health_reasons,
    updated_at=excluded.updated_at
`);

export function upsertAccount(account, now = new Date()) {
  if (!account.externalId || !account.name) {
    throw new Error('externalId and name are required');
  }
  const health = scoreAccount(account, now);
  upsertStmt.run(
    account.externalId,
    account.name,
    Number(account.mrr ?? 0),
    account.renewalAt ?? null,
    Number(account.usage7d ?? 0),
    Number(account.usagePrev7d ?? 0),
    account.lastSeenAt ?? null,
    account.paymentStatus ?? 'ok',
    health.score,
    health.band,
    JSON.stringify(health.reasons),
    now.toISOString()
  );
  return getAccountByExternalId(account.externalId);
}

export function getAccountByExternalId(externalId) {
  return hydrate(db.prepare('SELECT * FROM accounts WHERE external_id = ?').get(externalId));
}

export function listAccounts() {
  return db.prepare('SELECT * FROM accounts ORDER BY health_score ASC, mrr DESC').all().map(hydrate);
}

export function riskInbox() {
  return db.prepare(`
    SELECT * FROM accounts
    WHERE health_band != 'green'
    ORDER BY (mrr * (100 - health_score)) DESC, health_score ASC
  `).all().map(hydrate);
}

export function summary() {
  const row = db.prepare(`
    SELECT
      COUNT(*) AS accounts,
      COALESCE(SUM(mrr), 0) AS mrr,
      COALESCE(SUM(CASE WHEN health_band != 'green' THEN mrr ELSE 0 END), 0) AS at_risk_mrr,
      SUM(CASE WHEN health_band = 'red' THEN 1 ELSE 0 END) AS red_accounts,
      SUM(CASE WHEN health_band = 'amber' THEN 1 ELSE 0 END) AS amber_accounts
    FROM accounts
  `).get();
  return {
    accounts: Number(row.accounts),
    mrr: Number(row.mrr),
    arr: Number(row.mrr) * 12,
    atRiskMrr: Number(row.at_risk_mrr),
    atRiskArr: Number(row.at_risk_mrr) * 12,
    redAccounts: Number(row.red_accounts),
    amberAccounts: Number(row.amber_accounts)
  };
}

function hydrate(row) {
  if (!row) return null;
  return {
    id: row.id,
    externalId: row.external_id,
    name: row.name,
    mrr: Number(row.mrr),
    renewalAt: row.renewal_at,
    usage7d: Number(row.usage_7d),
    usagePrev7d: Number(row.usage_prev_7d),
    lastSeenAt: row.last_seen_at,
    paymentStatus: row.payment_status,
    healthScore: Number(row.health_score),
    healthBand: row.health_band,
    healthReasons: JSON.parse(row.health_reasons || '[]'),
    updatedAt: row.updated_at
  };
}
