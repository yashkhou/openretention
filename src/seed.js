import { upsertAccount } from './repository.js';

const now = new Date();
const isoDaysFromNow = (days) => new Date(now.getTime() + days * 86400000).toISOString();

const demo = [
  { externalId:'acme', name:'Acme Analytics', mrr:4200, renewalAt:isoDaysFromNow(18), usage7d:12, usagePrev7d:110, lastSeenAt:isoDaysFromNow(-9), paymentStatus:'ok' },
  { externalId:'north', name:'Northstar Cloud', mrr:3100, renewalAt:isoDaysFromNow(75), usage7d:85, usagePrev7d:92, lastSeenAt:isoDaysFromNow(-1), paymentStatus:'ok' },
  { externalId:'orbit', name:'Orbit Labs', mrr:2750, renewalAt:isoDaysFromNow(9), usage7d:0, usagePrev7d:40, lastSeenAt:isoDaysFromNow(-23), paymentStatus:'past_due' },
  { externalId:'bright', name:'BrightDesk', mrr:1900, renewalAt:isoDaysFromNow(140), usage7d:145, usagePrev7d:151, lastSeenAt:isoDaysFromNow(-1), paymentStatus:'ok' },
  { externalId:'cobalt', name:'Cobalt Systems', mrr:1600, renewalAt:isoDaysFromNow(28), usage7d:51, usagePrev7d:120, lastSeenAt:isoDaysFromNow(-6), paymentStatus:'ok' },
  { externalId:'rivet', name:'Rivet AI', mrr:1350, renewalAt:isoDaysFromNow(45), usage7d:20, usagePrev7d:21, lastSeenAt:isoDaysFromNow(-2), paymentStatus:'failed' },
  { externalId:'terra', name:'TerraStack', mrr:980, renewalAt:isoDaysFromNow(220), usage7d:58, usagePrev7d:55, lastSeenAt:isoDaysFromNow(-2), paymentStatus:'ok' },
  { externalId:'pine', name:'Pineworks', mrr:650, renewalAt:isoDaysFromNow(16), usage7d:8, usagePrev7d:9, lastSeenAt:isoDaysFromNow(-16), paymentStatus:'ok' }
];

demo.forEach(a => upsertAccount(a, now));
console.log(`Seeded ${demo.length} demo accounts.`);
