# Supabase + Vercel + Stripe Deployment Guide

## 🚀 Quick Setup (30 minutes)

### Step 1: Set up Supabase (10 min)

1. **Create Supabase Project**

   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose a name (e.g., "chapter-analysis")
   - Create a strong database password
   - Select a region close to your users

2. **Run Database Schema**

   - In Supabase dashboard, go to "SQL Editor"
   - Click "New Query"
   - Copy and paste content from `supabase_schema.sql`
   - Click "Run" to create all tables and policies

3. **Configure Authentication**

   - Go to "Authentication" → "Providers"
   - Enable "Email" provider
   - Optional: Enable Google/GitHub for social login
   - Go to "URL Configuration"
   - Add your site URL: `https://your-app.vercel.app`

4. **Get API Keys**
   - Go to "Settings" → "API"
   - Copy:
     - Project URL (e.g., `https://abc123.supabase.co`)
     - `anon/public` key (starts with `eyJ...`)

### Step 2: Configure Stripe (5 min)

1. **Get Stripe Keys**

   - Log into your [Stripe Dashboard](https://dashboard.stripe.com)
   - Go to "Developers" → "API keys"
   - Copy your **Publishable key** (starts with `pk_test_...`)
   - Note: We'll add webhook handling in Step 4

2. **Create Products** (Optional - can do later)
   - Go to "Products" → "Add Product"
   - Create two products:
     - **Standard**: $9.99/month
     - **Professional**: $19.99/month
   - Save the Price IDs for later

### Step 3: Deploy to Vercel (10 min)

1. **Connect GitHub to Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Add New" → "Project"
   - Import your `Chapter-Analysis` repository

2. **Configure Environment Variables**

   - In Vercel project settings, go to "Environment Variables"
   - Add these variables:
     ```
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key-from-supabase
     VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key
     ```

3. **Deploy**

   - Click "Deploy"
   - Wait 2-3 minutes for build
   - Your app will be live at `https://chapter-analysis.vercel.app`

4. **Set Custom Domain** (Optional)
   - Go to "Settings" → "Domains"
   - Add your custom domain
   - Follow DNS configuration instructions

### Step 4: Set up Stripe Webhooks (5 min)

1. **Create Webhook Endpoint**

   - In Stripe Dashboard, go to "Developers" → "Webhooks"
   - Click "Add endpoint"
   - URL: `https://your-app.vercel.app/api/stripe-webhook`
   - Select events:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

2. **Get Webhook Secret**
   - After creating webhook, click "Reveal" under "Signing secret"
   - Copy the webhook secret (starts with `whsec_...`)
   - Add to Vercel environment variables:
     ```
     STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
     ```

### Step 5: Update Supabase URL Configuration

1. Go back to Supabase dashboard
2. Navigate to "Authentication" → "URL Configuration"
3. Update:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/**`

---

## 🧪 Testing Your Deployment

### Test Authentication

1. Visit your deployed site
2. Click "Sign Up" or "Login"
3. Create a test account
4. Verify email confirmation works

### Test Free Tier

1. Use app without purchasing
2. Verify free tier features work
3. Try to access locked features (should show upgrade prompt)

### Test Stripe Integration

1. Use Stripe test mode
2. Test card: `4242 4242 4242 4242`
3. Expiry: Any future date (e.g., `12/34`)
4. CVC: Any 3 digits (e.g., `123`)
5. Verify subscription activates in Supabase

---

## 📊 Monitoring & Analytics

### Vercel Analytics

- Automatically enabled
- View in Vercel dashboard under "Analytics"

### Supabase Monitoring

- Database usage: Supabase → "Database" → "Usage"
- Auth users: "Authentication" → "Users"
- API requests: "Settings" → "Usage"

### Stripe Dashboard

- View subscriptions: "Customers"
- Track revenue: "Payments"
- Monitor webhooks: "Developers" → "Webhooks" → "Events"

---

## 🔒 Security Checklist

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Environment variables stored securely in Vercel
- ✅ API keys use `anon` key (not `service_role` key)
- ✅ Stripe webhook signatures verified
- ✅ HTTPS enforced by Vercel
- ✅ Email verification enabled in Supabase

---

## 💰 Cost Breakdown (Starting)

**Free Tier Limits:**

- Vercel: 100GB bandwidth/month
- Supabase: 500MB database, 2GB bandwidth
- Stripe: $0 monthly, 2.9% + 30¢ per transaction

**When you'll need to upgrade:**

- Supabase: ~1,000 active users or 500MB+ data
- Vercel: Heavy traffic (>100GB/month)
- Cost at scale: $10-50/month for 1,000-5,000 users

---

## 🛠️ Next Steps After Deployment

1. **Create Auth Components** (Need help? Let me know!)

   - Login/Signup forms
   - Password reset flow
   - User profile page

2. **Integrate Supabase Auth**

   - Replace localStorage `accessLevel` with Supabase user data
   - Add authentication checks
   - Sync subscription status

3. **Add Stripe Checkout**

   - Create checkout session
   - Handle success/cancel callbacks
   - Display subscription status

4. **Test Everything**
   - Sign up flow
   - Payment flow
   - Feature access control
   - Data persistence

---

## 🆘 Troubleshooting

**Build Fails**

- Check Node version (should be 18+)
- Verify all dependencies installed
- Check build logs in Vercel

**Auth Not Working**

- Verify environment variables set correctly
- Check Site URL in Supabase matches deployment
- Clear browser cache

**Stripe Issues**

- Ensure using test keys in development
- Verify webhook endpoint is correct
- Check webhook signing secret

---

## 📞 Need Help?

Let me know which step you'd like help with:

1. Creating authentication components
2. Integrating Supabase auth with your existing code
3. Setting up Stripe checkout flow
4. Testing the deployment
