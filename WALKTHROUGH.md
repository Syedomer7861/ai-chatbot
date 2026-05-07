# AI Chatbot Assistant - Launch Walkthrough

Congratulations! Your production-ready Shopify AI Chatbot is built and ready for the App Store. Follow these steps to test and launch.

## 1. Local Development Setup
1. Ensure your `.env` has all required keys:
   - `SHOPIFY_API_KEY`
   - `SHOPIFY_API_SECRET`
   - `GEMINI_API_KEY` (Already set)
2. Run the app:
   ```bash
   npm run dev
   ```

## 2. Admin Configuration
1. Open the app in your Shopify Admin.
2. **Billing Approval**: You will be prompted to approve the $9.99/mo test charge. Approve it to access the dashboard.
3. **Set Persona**: In the dashboard, set your Bot Name (e.g., "Luna") and Persona (e.g., "Helpful skincare expert").
4. **Initial Sync**: Click **"Sync Now"** to re-index your products and store policies into the AI brain.

## 3. Storefront Integration
1. Go to **Online Store > Themes > Customize**.
2. Click **App Embeds** (left sidebar).
3. Enable the **AI Chatbot** widget.
4. Customize the **Primary Color** to match your brand.
5. Save the theme.

## 4. Testing the Bot
1. Open your storefront.
2. Click the chat bubble.
3. Ask a question about a product or your refund policy.
4. Verify that the bot provides a grounded answer based on your synced data.

## 5. App Store Compliance
- **GDPR**: The app has mandatory endpoints at `/webhooks/gdpr`. These are verified by Shopify during review.
- **Support**: A support placeholder is listed in the dashboard. Update this in `app/routes/app._index.tsx` before final submission.

## 6. Deployment
When ready for production:
1. Deploy your code to a hosting provider (Heroku, Fly.io, etc.).
2. Update the **App URL** and **Redirection URLs** in your Shopify Partner Dashboard.
3. Submit for review!

