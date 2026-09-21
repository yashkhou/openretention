export function scoreAccount(input, now = new Date()) {
  let score = 100;
  const reasons = [];

  const usage7d = Number(input.usage7d ?? 0);
  const usagePrev7d = Number(input.usagePrev7d ?? 0);
  const paymentStatus = input.paymentStatus ?? 'ok';

  if (paymentStatus === 'failed') {
    score -= 35;
    reasons.push({ code: 'PAYMENT_FAILED', impact: -35, message: 'Recent payment failure' });
  } else if (paymentStatus === 'past_due') {
    score -= 20;
    reasons.push({ code: 'PAYMENT_PAST_DUE', impact: -20, message: 'Subscription is past due' });
  }

  if (usagePrev7d > 0) {
    const ratio = usage7d / usagePrev7d;
    if (ratio < 0.2) {
      score -= 30;
      reasons.push({ code: 'USAGE_COLLAPSE', impact: -30, message: 'Usage dropped by more than 80% week-over-week' });
    } else if (ratio < 0.5) {
      score -= 15;
      reasons.push({ code: 'USAGE_DROP', impact: -15, message: 'Usage dropped by more than 50% week-over-week' });
    }
  } else if (usage7d === 0) {
    score -= 15;
    reasons.push({ code: 'NO_USAGE', impact: -15, message: 'No usage recorded in the last 7 days' });
  }

  if (input.lastSeenAt) {
    const days = Math.max(0, (now - new Date(input.lastSeenAt)) / 86400000);
    if (days > 21) {
      score -= 25;
      reasons.push({ code: 'INACTIVE_21D', impact: -25, message: 'No activity for more than 21 days' });
    } else if (days > 14) {
      score -= 15;
      reasons.push({ code: 'INACTIVE_14D', impact: -15, message: 'No activity for more than 14 days' });
    } else if (days > 7) {
      score -= 8;
      reasons.push({ code: 'INACTIVE_7D', impact: -8, message: 'No activity for more than 7 days' });
    }
  }

  if (input.renewalAt) {
    const daysToRenewal = (new Date(input.renewalAt) - now) / 86400000;
    if (daysToRenewal >= 0 && daysToRenewal <= 30) {
      score -= 10;
      reasons.push({ code: 'RENEWAL_SOON', impact: -10, message: 'Renewal is within 30 days' });
    }
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  const band = score < 50 ? 'red' : score < 75 ? 'amber' : 'green';

  return { score, band, reasons };
}
