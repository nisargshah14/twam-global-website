# TWAM Global Website

Static website for TWAM Global built with vanilla HTML, CSS, and JavaScript. Content is managed via [Decap CMS](https://decapcms.org/) and hosted on Netlify.

---

## Running Locally

This is a static site with no build step. Any local HTTP server will work.

### Option 1 — VS Code Live Server (recommended)

1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension in VS Code.
2. Right-click `index.html` → **Open with Live Server**.
3. The site opens at `http://127.0.0.1:5500`.

### Option 2 — Python

```bash
python -m http.server 8080
```

Visit `http://localhost:8080`.

### Option 3 — Node (npx, no install needed)

```bash
npx serve .
```

Visit the URL shown in the terminal (usually `http://localhost:3000`).

> **Note:** The CMS admin panel (`/admin`) requires Netlify Identity and Git Gateway, so it only works on a deployed Netlify site — not locally.

---

## Deploying to Netlify

### Prerequisites

- A [GitHub](https://github.com) account with this repository pushed to it.
- A [Netlify](https://netlify.com) account (free tier is sufficient).

### 1. Connect the Repository

1. Log in to [app.netlify.com](https://app.netlify.com).
2. Click **Add new site** → **Import an existing project** → **GitHub**.
3. Authorize Netlify and select the `twam-global-website` repository.
4. Leave all build settings as defaults — they are already configured in `netlify.toml`:
   - **Build command:** `echo 'Static site — no build step required.'`
   - **Publish directory:** `.` (root)
5. Click **Deploy site**.

Your site will be live in about 1–2 minutes at a URL like `amazing-fox-123.netlify.app`.

### 2. (Optional) Rename the Site

In Netlify dashboard → **Site settings** → **Change site name** → enter `twamglobal`.

The site will now be available at `twamglobal.netlify.app`.

### 3. Enable the CMS (Decap CMS)

The admin panel at `/admin` requires Netlify Identity and Git Gateway.

1. In your Netlify dashboard, open the **Identity** tab.
2. Click **Enable Identity**.
3. Under **Registration preferences**, select **Invite only**.
4. Scroll to **Services** → click **Enable Git Gateway**.
5. Click **Invite users**, enter your email, and set your password via the invite email.

Access the admin panel at `https://your-site.netlify.app/admin`.

### 4. (Optional) Add a Custom Domain

1. In Netlify → **Domain management** → **Add custom domain**.
2. Enter your domain (e.g. `twamglobal.com`).
3. Update your domain registrar's nameservers to the values Netlify provides.
4. DNS propagation takes up to 24 hours. Netlify provisions a free SSL certificate automatically.

---

## Continuous Deployment

Once connected, every push to the `main` branch automatically triggers a new deploy on Netlify. No manual steps required.

---

## Project Structure

```
twam-global-website/
├── index.html          # Home page
├── about.html          # About page
├── products.html       # Products page
├── contact.html        # Contact page
├── styles.css          # Global styles
├── main.js             # Navigation, filtering, form handling
├── cms-data.js         # CMS content loader
├── netlify.toml        # Netlify build & redirect config
├── admin/
│   ├── index.html      # Decap CMS interface
│   └── config.yml      # CMS collections config
├── content/
│   ├── pages/          # Home & About page content (JSON/Markdown)
│   └── products/       # Product category data (JSON)
└── images/
    └── uploads/        # CMS-managed image uploads
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| CMS | Decap CMS (formerly Netlify CMS) |
| Auth | Netlify Identity |
| Hosting | Netlify |
| CI/CD | Netlify (auto-deploy on git push) |
