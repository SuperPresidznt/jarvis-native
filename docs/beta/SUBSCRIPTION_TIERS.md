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

## Feature Gate Matrix

| Feature | Free | Pro | Gate Reason |
|---------|------|-----|-------------|
| Unlimited tasks | Yes | Yes | Core value, must be free |
| Projects | 3 | Unlimited | Power users need more |
| Habits | 3 | Unlimited | Serious trackers upgrade |
| Calendar read | Yes | Yes | Basic utility |
| Calendar write | No | Yes | Premium sync |
| Finance accounts | 3 | Unlimited | Most have 2-3 |
| AI messages/day | 15 | 200 | 15 shows value, 200 covers heavy use |
| AI vision | No | Yes | Higher API cost |
| AI voice | No | Yes | Convenience feature |
| Custom themes | No | Yes | Personalization = premium |
| RGB color picker | No | Yes | Power user feature |
| Analytics | Basic | Advanced | Insights = premium |
| Export | No | Yes | Data portability |

---

## Implementation Notes

### StoreKit/Google Play Product IDs

```
# iOS (StoreKit)
com.yarvi.pro.monthly      # $9.99/month
com.yarvi.pro.annual       # $83.88/year

# Android (Google Play Billing)
yarvi_pro_monthly          # $9.99/month
yarvi_pro_annual           # $83.88/year
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
3. [ ] CMO: Write pricing page copy
4. [ ] Human: Set up App Store/Play Store subscription products
5. [ ] Human: Configure pricing in respective consoles

---

*Based on monetization research in `docs/beta/MONETIZATION_STRATEGY_REPORT.md`*

-- Finn
