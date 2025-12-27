# Subscription Tiers - Implementation Reference

**Prepared by:** Finn (CFO)
**Date:** December 26, 2025
**Status:** Ready for implementation

---

## Pricing Summary

| Tier | Price | Billing |
|------|-------|---------|
| **Free** | $0 | - |
| **Pro Monthly** | $9.99/month | Monthly |
| **Pro Annual** | $83.88/year | Annual (30% discount) |
| **Lifetime** | $249.99 | One-time (3x annual) |

---

## Free Tier: "Yarvi Lite"

### Included Features

| Feature | Limit |
|---------|-------|
| Tasks | Unlimited |
| Projects | 3 active |
| Habits | 3 active |
| Habit streaks | Yes |
| Calendar view | Read-only (Google Cal sync) |
| Finance dashboard | Manual entry |
| Finance accounts | 3 accounts |
| Focus timer | Basic Pomodoro |
| **AI messages** | **15/day** (resets midnight) |
| Offline mode | Basic |
| Themes | 2 default |

### Cost to Serve (Free User)
- AI: ~$0.053/user/month (15 msgs/day with caching)
- Infra: ~$0.002/user/month
- **Total: ~$0.055/user/month**

---

## Pro Tier: "Yarvi Pro"

### Price
- **Monthly:** $9.99/month
- **Annual:** $83.88/year (saves $36)

### Included Features

| Feature | Limit |
|---------|-------|
| Tasks | Unlimited |
| Projects | Unlimited |
| Habits | Unlimited |
| Habit streaks | Yes |
| Calendar | Full sync (read/write) |
| Finance dashboard | Full features |
| Finance accounts | Unlimited |
| Focus timer | Full + presets |
| **AI messages** | **200/day** |
| AI vision | Yes |
| AI voice input | Yes |
| Advanced analytics | Yes |
| Custom themes | All + RGB picker |
| Data export | CSV, JSON |
| Priority support | Yes |
| Offline mode | Full |

### Revenue per User
- Monthly: $9.99/month = $119.88/year
- Annual: $83.88/year
- **Blended ARPU:** ~$105/year (assuming 60% monthly, 40% annual)

### Cost to Serve (Pro User)
- AI: ~$0.168/user/month (medium usage)
- Infra: ~$0.003/user/month
- **Total: ~$0.17/user/month**
- **Margin: 98%+**

---

## Lifetime Tier: "Yarvi Lifetime"

### Price
- **One-Time Payment:** $249.99

### Rationale

**Industry Research:**
| App | Annual Price | Lifetime Price | Multiplier |
|-----|--------------|----------------|------------|
| Calm | ~$70/year | ~$350 | 5x |
| Jumpspeak | ~$100/year | ~$360 | 3.6x |
| Typical range | - | - | 2x-5x annual |

**Our Calculation:**
- Annual price: $83.88
- Conservative multiplier: 3x = $251.64
- **Recommended: $249.99** (under $250 psychological barrier)

**Why 3x (Not Higher):**
1. **Ongoing AI costs** - Unlike static apps (Things 3), we have per-message API costs
2. **Early adopter incentive** - Reward loyal users who believe in the product
3. **Competitive positioning** - Higher than Things 3 ($80) but justified by AI
4. **Break-even analysis** - At 3x annual, payback is ~3 years vs. subscription

### What's Included

| Feature | Lifetime Tier |
|---------|---------------|
| All Pro features | Yes |
| AI messages/day | **200** (same as Pro) |
| AI vision | Yes |
| AI voice input | Yes |
| Future feature updates | Yes (perpetual) |
| Priority support | Yes |
| Exclusive badge | "Founder" badge in app |
| Early access | Beta features first |

**Note:** AI message limit remains at 200/day (not unlimited) to prevent cost explosion.

### Cost Analysis & Sustainability

**Worst-Case Scenario (Heavy User):**
- AI cost: $0.397/user/month = $4.76/year
- At $249.99 one-time payment
- Break-even: 4.7 years of heavy usage
- After 5 years: -$23.80 (small loss)
- After 10 years: -$47.60 (manageable loss)

**Expected Scenario (Medium User):**
- AI cost: $0.168/user/month = $2.02/year
- At $249.99 one-time payment
- Break-even: 10.1 years
- After 5 years: +$239.89 profit
- After 10 years: +$229.79 profit

**Mitigation Strategies:**
1. **Cap lifetime sales** - Limit to first 500-1,000 customers
2. **Early bird only** - Available during launch period only (e.g., first 6 months)
3. **No unlimited AI** - Keep 200/day cap to control costs
4. **Price increase later** - Raise to $349.99 after early bird period

### Risks & Considerations

| Risk | Severity | Mitigation |
|------|----------|------------|
| API cost increases | Medium | 200/day cap limits exposure |
| Heavy user abuse | Low | Daily limit prevents runaway costs |
| Cannibalization of monthly | Medium | Target different segment (power users) |
| Long-term sustainability | Medium | Early bird cap + price increase |
| Product sunset | Low | "Lifetime of product" clause in ToS |

**Key Insight from Research:**
> "The days of $10 unlimited AI usage are numbered... AI features must be priced high enough to cover their substantial incremental costs." - [Monetizely, 2025](https://www.getmonetizely.com/blogs/ai-pricing-how-much-does-ai-cost-in-2025)

**Why We're Offering Lifetime Despite Risks:**
1. **Early cash injection** - Lifetime purchases provide upfront capital for development
2. **Community building** - Creates invested "founders" who advocate for the product
3. **Reduced churn worry** - These users never churn (already paid)
4. **Signal of confidence** - Shows we believe in long-term product viability

### Implementation Notes

#### StoreKit/Google Play Product IDs

```
# iOS (StoreKit)
com.yarvi.pro.lifetime       # $249.99 one-time

# Android (Google Play Billing)
yarvi_pro_lifetime           # $249.99 one-time
```

#### Purchase Behavior

- **One-time purchase** (non-consumable IAP)
- **Restore purchases** on new device
- **No refund after 14 days** (matches Pro policy)
- **Family sharing:** Not supported (individual only)

#### Feature Flags

```typescript
// Subscription status check
type SubscriptionTier = 'free' | 'pro_monthly' | 'pro_annual' | 'lifetime';

// Lifetime users get Pro features + founder badge
const isLifetime = subscriptionTier === 'lifetime';
const showFounderBadge = isLifetime;
```

#### Legal/ToS Additions

Add to Terms of Service:
> "Lifetime" refers to the operational lifetime of the Yarvi application. In the event of product discontinuation, lifetime subscribers will receive at minimum 12 months advance notice and a pro-rated refund option based on purchase date.

### Launch Strategy

**Phase 1: Early Bird (Launch - Month 6)**
- Price: $249.99
- Cap: 500 units
- Marketing: "Founding Member" exclusive
- Target: Power users, early adopters, productivity enthusiasts

**Phase 2: Standard (Month 7+)**
- Price: $349.99 (40% increase)
- Cap: 1,000 total lifetime customers
- Marketing: "Limited lifetime tier - last chance"

**Phase 3: Sunset (After 1,000 sales)**
- Remove lifetime option from new purchases
- Existing lifetime users retain all benefits
- Focus on subscription revenue

### Revenue Projections

| Scenario | Units Sold | Revenue | Notes |
|----------|------------|---------|-------|
| Conservative | 200 | $49,998 | 200 early birds @ $249.99 |
| Moderate | 500 | $124,995 | Full early bird + some standard |
| Optimistic | 1,000 | $299,990 | Full cap (500 @ $249.99 + 500 @ $349.99) |

**Impact on Annual Revenue:**
- Lifetime revenue is front-loaded (one-time)
- Does not count toward MRR/ARR
- Consider separate from subscription metrics

---

## Feature Gate Matrix

| Feature | Free | Pro | Lifetime | Gate Reason |
|---------|------|-----|----------|-------------|
| Unlimited tasks | Yes | Yes | Yes | Core value, must be free |
| Projects | 3 | Unlimited | Unlimited | Power users need more |
| Habits | 3 | Unlimited | Unlimited | Serious trackers upgrade |
| Calendar read | Yes | Yes | Yes | Basic utility |
| Calendar write | No | Yes | Yes | Premium sync |
| Finance accounts | 3 | Unlimited | Unlimited | Most have 2-3 |
| AI messages/day | 15 | 200 | 200 | 15 shows value, 200 covers heavy use |
| AI vision | No | Yes | Yes | Higher API cost |
| AI voice | No | Yes | Yes | Convenience feature |
| Custom themes | No | Yes | Yes | Personalization = premium |
| RGB color picker | No | Yes | Yes | Power user feature |
| Analytics | Basic | Advanced | Advanced | Insights = premium |
| Export | No | Yes | Yes | Data portability |
| Founder badge | No | No | Yes | Lifetime exclusive |
| Beta features | No | No | Yes | Early access for founders |

---

## Implementation Notes

### StoreKit/Google Play Product IDs

```
# iOS (StoreKit)
com.yarvi.pro.monthly      # $9.99/month
com.yarvi.pro.annual       # $83.88/year
com.yarvi.pro.lifetime     # $249.99 one-time

# Android (Google Play Billing)
yarvi_pro_monthly          # $9.99/month
yarvi_pro_annual           # $83.88/year
yarvi_pro_lifetime         # $249.99 one-time
```

### Subscription Features

- 14-day free trial (no credit card required)
- Cancel anytime
- Refund policy: 14 days no-questions-asked
- Restore purchases on new device
- Family sharing: Not supported (individual only)

### Upgrade/Downgrade Behavior

- **Free → Pro:** Immediate access, billing starts
- **Pro Monthly → Annual:** Switch at next billing cycle
- **Pro → Free (cancel):** Access until period ends, then downgrade

---

## Revenue Targets

| Milestone | Paid Users | Annual Revenue |
|-----------|------------|----------------|
| Break-even | 25 | ~$2,500 |
| Sustainable | 1,000 | ~$105,000 |
| Comfortable | 3,000 | ~$315,000 |
| Scale target | 5,000 | ~$525,000 |

### Conversion Target
- Industry standard: 3-5% free-to-paid
- At 25,000 free users → 1,000 paid users (4%)

---

## Pricing Rationale

### Why $9.99/month?
- Under $10 psychological barrier
- 2x median standalone app ($4-5/month)
- 50% of ChatGPT Plus ($20/month)
- Roughly cost of TickTick + Habitify combined

### Why 30% annual discount?
- Industry standard
- Incentivizes commitment
- Under $100 psychological barrier ($83.88)
- User saves $36/year

### Comparison Value

| What you'd pay separately | Cost |
|---------------------------|------|
| Todoist Pro | $48/year |
| Habitify Premium | $30/year |
| Fantastical | $57/year |
| YNAB | $109/year |
| Forest | $4/year |
| ChatGPT Plus | $240/year |
| **Total** | **$488/year** |
| **Yarvi Pro** | **$84/year** |
| **Savings** | **$404/year** |

---

## Next Steps

1. [ ] CTO: Implement subscription logic (RevenueCat or StoreKit/Play Billing)
2. [ ] CTO: Add feature gates based on subscription status
3. [ ] CTO: Add lifetime tier handling (non-consumable IAP)
4. [ ] CTO: Implement Founder badge UI for lifetime users
5. [ ] CMO: Write pricing page copy (include lifetime tier)
6. [ ] CMO: Create "Founding Member" marketing campaign
7. [ ] Human: Set up App Store/Play Store subscription products
8. [ ] Human: Configure pricing in respective consoles
9. [ ] Human: Set up lifetime tier as non-consumable IAP
10. [ ] Legal: Update ToS with lifetime clause (product discontinuation policy)

---

*Based on monetization research in `docs/beta/MONETIZATION_STRATEGY_REPORT.md`*

*Lifetime tier added by Sterling (CFO Manager) - Dec 27, 2025*

-- Finn & Sterling
