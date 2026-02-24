# Stripe Payment Integration Setup Guide

## ✅ What Has Been Implemented

### Frontend Components
1. **Hook**: `useStripeCheckout.ts` - Handles Stripe checkout session creation
2. **Pages**:
   - Updated [feasibility-studies/[id]/page.tsx](../app/(default)/feasibility-studies/%5Bid%5D/page.tsx) - Added "اشتري الآن" button functionality
   - [success/page.tsx](../app/(default)/success/page.tsx) - Success page after payment
   - [canceled/page.tsx](../app/(default)/canceled/page.tsx) - Canceled payment page
   - [my-orders/page.tsx](../app/(default)/my-orders/page.tsx) - User orders history

### Backend Components
1. **Controller**: Added `handleGetUserOrders` function
2. **Utility**: Added `getUserOrders` function for fetching user payments
3. **Routes**: Added GET `/api/stripe/my-orders` endpoint with Swagger docs
4. **Webhook**: Updated to use correct status ("paid" instead of "completed")

## 🚀 What You Need to Do Now

### Step 1: Environment Configuration
Make sure your `.env` files have these variables:

**api/.env** (or api/.env.local):
```env
STRIPE_PUBLIC_KEY=pk_test_xxxxx  # From Stripe Dashboard
STRIPE_SECRET_KEY=sk_test_xxxxx   # From Stripe Dashboard
STRIPE_WEBHOOK_SECRET=whsec_xxxxx # From Stripe Dashboard Webhook Endpoint
```

### Step 2: Update Stripe Webhook Endpoint
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **Webhooks**
3. Click **Add Endpoint**
4. Set endpoint URL to: `https://yourdomain.com/api/stripe/stripe/webhook`
5. Select events:
   - `checkout.session.completed`
   - `checkout.session.async_payment_failed`
   - `customer.subscription.deleted` (optional)
6. Copy the signing secret and add to `STRIPE_WEBHOOK_SECRET` in `.env`

### Step 3: Verify Payment Model
Your payment model should have this status field:
```typescript
status: { 
  type: String, 
  enum: ["pending", "paid", "failed", "cancelled"], 
  default: "pending" 
}
```

### Step 4: Test the Integration

#### Test Payment Flow (Localhost):
1. Start the API server:
   ```bash
   cd api
   bun dev
   ```

2. Start the Next.js app:
   ```bash
   cd app
   npm run dev
   ```

3. Navigate to a feasibility study detail page
4. Click "اشتري الآن" button
5. Use Stripe test card: `4242 4242 4242 4242`
6. Enter any future date and CVC
7. You should be redirected to success page

#### Test Cards for Different Scenarios:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure Required**: `4000 0025 0000 3155`
- **Insufficient Funds**: `4000 0000 0000 0341`

### Step 5: Add Profile/Dashboard Link
Update your navbar to include a link to orders:

```jsx
<Link href="/my-orders">
  <Button size="sm">
    طلباتي
  </Button>
</Link>
```

### Step 6: Checkout Session URLs
The URLs are automatically set from the request origin:
- Success URL: `{origin}/success?session_id=...`
- Cancel URL: `{origin}/canceled`

This works for both localhost and production domains.

## 📊 Order Status Flow

```
User clicks "اشتري الآن"
        ↓
Create checkout session (status: "pending")
        ↓
User completes payment on Stripe
        ↓
Stripe webhook fires "checkout.session.completed"
        ↓
Payment status updated to "paid"
        ↓
User sees success page
```

## 🔗 API Endpoints

### Create Checkout Session
```http
POST /api/stripe/create-subscription-checkout-session
Authorization: Bearer {token}
Content-Type: application/json

{
  "serviceId": "507f1f77bcf86cd799439011",
  "serviceType": "FeasibilityStudy",
  "name": "دراسة الجدوى",
  "description": "وصف دراسة الجدوى",
  "image": "https://...",
  "price": 100,
  "category": "Technology"
}
```

### Get User Orders
```http
GET /api/stripe/my-orders
Authorization: Bearer {token}
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "payNumber": "USR123-SVC456",
      "amount": 100,
      "status": "paid",
      "serviceType": "FeasibilityStudy",
      "createdAt": "2024-02-14T10:00:00Z"
    }
  ],
  "count": 1
}
```

## 🚨 Common Issues & Solutions

### Issue: Real Domain Shows Localhost URLs
**Solution**: The hook uses `req.headers.origin` which automatically uses the correct domain in production.

### Issue: Webhook Not Firing
**Solution**:
1. Check STRIPE_WEBHOOK_SECRET is correct
2. Use Stripe CLI for local testing:
   ```bash
   stripe listen --forward-to localhost:5000/api/stripe/stripe/webhook
   ```
3. Verify webhook is enabled in Stripe Dashboard

### Issue: User Authentication Failing on Orders Endpoint
**Solution**: 
- Make sure token is being sent in Authorization header
- Check that `authenticate` middleware is properly configured
- Token should be: `Authorization: Bearer {token}`

### Issue: Payment Status Not Updating
**Solution**:
- Check MongoDB connection and payment model
- Verify webhook secret matches exactly
- Check API logs for webhook errors

## 📱 Next Steps (Optional Enhancements)

1. **Email Notifications**
   - Send confirmation email after payment
   - Add email template in backend

2. **Invoice Generation**
   - Generate PDF invoice after payment
   - Store invoice URL in payment model

3. **Subscription Management**
   - Allow users to manage subscriptions
   - Handle subscription renewals

4. **analytics**
   - Track payment metrics
   - Create sales dashboard

5. **Refunds**
   - Implement refund functionality
   - Update order status

## 📚 References

- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Test Cards](https://stripe.com/docs/testing)
- [Stripe CLI for Local Testing](https://stripe.com/docs/stripe-cli)
