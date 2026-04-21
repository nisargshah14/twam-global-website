# 🚀 TWAM GLOBAL — Website Deployment & Admin Guide
## Complete Setup in ~15 Minutes (No Coding Required)

---

## WHAT YOU'LL GET

After following this guide:
- ✅ Your website live at **yourname.netlify.app** (free) or your own domain
- ✅ Admin panel at **yourname.netlify.app/admin**
- ✅ Login with email & password to edit anything
- ✅ Changes go live on your website within ~30 seconds

---

## STEP 1 — Create a Free GitHub Account

GitHub is where your website files are stored (like Google Drive, but for websites).

1. Go to **https://github.com**
2. Click **"Sign up"** — use any email
3. Choose the **Free plan**
4. Verify your email

---

## STEP 2 — Upload Your Website to GitHub

1. Once logged in, click the **"+"** button (top right) → **"New repository"**
2. Repository name: `twam-global-website`
3. Make sure it's set to **Public**
4. Click **"Create repository"**
5. On the next page, click **"uploading an existing file"** link
6. **Drag and drop ALL the files** from the website folder you received:
   - index.html
   - about.html
   - products.html
   - contact.html
   - styles.css
   - main.js
   - cms-loader.js
   - netlify.toml
   - admin/ (folder)
   - content/ (folder)
   - images/ (folder)
7. Scroll down, click **"Commit changes"** (green button)

✅ Your files are now on GitHub!

---

## STEP 3 — Create a Free Netlify Account & Connect GitHub

Netlify hosts your website for free and publishes it automatically.

1. Go to **https://netlify.com**
2. Click **"Sign up"** → choose **"Sign up with GitHub"**
3. Authorize Netlify to access your GitHub
4. On your Netlify dashboard, click **"Add new site"** → **"Import an existing project"**
5. Click **"GitHub"**
6. Find and click **"twam-global-website"**
7. Leave all settings as default
8. Click **"Deploy site"**

⏳ Wait about 1-2 minutes. Your site will be live at something like `amazing-fox-123.netlify.app`

---

## STEP 4 — Rename Your Site (Optional)

1. In Netlify dashboard → click **"Site settings"**
2. Under **"Site details"** → click **"Change site name"**
3. Change it to `twamglobal` → now it'll be **twamglobal.netlify.app**

---

## STEP 5 — Enable the Admin Login System

This is the most important step — it activates your admin panel.

1. In Netlify dashboard, go to **"Identity"** tab (left sidebar)
2. Click **"Enable Identity"**
3. Under **"Registration"**, select **"Invite only"** (so only you can log in)
4. Scroll down to **"Services"** → click **"Enable Git Gateway"**

Now invite yourself:
5. Click **"Invite users"**
6. Enter **your email address**
7. Check your email — you'll get an invite link
8. Click the link in the email → set your password

---

## STEP 6 — Access Your Admin Panel

1. Go to **https://yoursite.netlify.app/admin**
2. Log in with your email and password
3. You'll see the **TWAM GLOBAL Admin Dashboard**!

---

## HOW TO EDIT YOUR WEBSITE (Admin Panel Guide)

### 🏠 Edit Home Page
- Click **"🏠 Home Page"** in the left sidebar
- Click **"Home Page Content"**
- Edit the **Hero Headline**, **Sub Headline**, hero image, stats etc.
- Click **"Save"** when done
- Your website updates in ~30 seconds!

### 📦 Edit Products
- Click **"📦 Product Categories"** in sidebar
- Choose a category (e.g. "🌶 Spices")
- You can:
  - **Change the category name or description**
  - **Add a new product**: scroll to "Products" list → click "Add"
  - **Remove a product**: click the trash icon next to it
  - **Change a product image**: click the image field → upload from your computer
- Click **"Save"**

### ⚙️ Edit Contact Info & Company Details
- Click **"⚙️ Company Settings"** → **"Contact & Company Info"**
- Change your email, phone, address, hours, certifications
- Click **"Save"**

### 🏢 Edit About Page
- Click **"🏢 About Page"**
- Edit company story, vision, mission, stats
- Click **"Save"**

---

## HOW TO CHANGE IMAGES

### Option A — Upload from your computer
1. In the admin panel, click any image field
2. Click **"Choose an image"** → **"Upload"**
3. Select an image from your computer
4. Done — it saves automatically!

### Option B — Use a URL (from Google, WhatsApp, etc.)
1. Click the image field
2. Paste a direct image URL (right-click any image online → "Copy image address")

**Best image sizes:**
- Hero background: 1800×1000px
- Product images: 600×600px (square)
- Category covers: 800×600px

---

## HOW TO ADD YOUR OWN DOMAIN (Optional)

If you have a domain like `twamglobal.com`:

1. In Netlify → **"Domain management"** → **"Add custom domain"**
2. Enter your domain name
3. Go to your domain registrar (GoDaddy / BigRock / Namecheap)
4. Update the DNS nameservers to Netlify's (shown on screen)
5. Wait 24 hours — your site will be live on your domain, with free SSL (https://)

---

## TROUBLESHOOTING

**Admin panel shows blank / won't load?**
→ Make sure you completed Step 5 (Enable Identity + Git Gateway)

**I saved changes but website didn't update?**
→ Wait 1-2 minutes. If still not updated, go to Netlify dashboard → "Deploys" → check the latest deploy status.

**I forgot my admin password?**
→ Go to yoursite.netlify.app/admin → click "Forgot password" → reset via email.

**Images not showing?**
→ Make sure the image URL starts with `https://` — `http://` images may not load.

---

## QUICK REFERENCE

| What to do | Where to go |
|---|---|
| Edit website content | yoursite.netlify.app/admin |
| View your live website | yoursite.netlify.app |
| Check deploy status | app.netlify.com → Deploys |
| Add team member | Netlify → Identity → Invite users |
| Connect custom domain | Netlify → Domain management |

---

## SUPPORT

If you get stuck at any step, feel free to ask for help. Just mention which step number you're on and what you see on screen.

---

*TWAM GLOBAL Website — Powered by Decap CMS + Netlify + GitHub*
*All free. No monthly costs. No coding required.*
