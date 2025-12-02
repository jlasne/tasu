# Tasu Analytics Platform

A lightweight, multi-tenant analytics platform for tracking button clicks and user interactions.

## 📁 Project Structure

```
tasu/
├── app/                    # Frontend application
│   ├── index.html         # Main dashboard
│   ├── login/             # Login page
│   ├── integration/       # SDK integration guide
│   └── settings/          # User settings
│
├── api/                    # Backend PHP API
│   ├── analytics.php      # Analytics data endpoints
│   ├── auth.php           # Firebase authentication
│   ├── config.example.php # Configuration template
│   ├── db.php             # Database connection
│   ├── ingest.php         # Event ingestion
│   └── register.php       # User registration
│
├── sdk/                    # Client tracking SDK
│   └── tasu-sdk.js        # JavaScript tracking library
│
├── config/                 # Configuration files
│   ├── firebase-config.example.js  # Firebase config template
│   └── firebase-config.js          # Actual config (gitignored)
│
├── database/               # Database schemas
│   └── schema.sql         # MySQL schema
│
├── tinybird/               # Tinybird configuration
│   ├── datasources/       # Data source definitions
│   ├── pipes/             # Query pipes
│   └── README.md          # Tinybird deployment guide
│
└── assets/                 # Static assets
    └── logo.png
```

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/jlasne/tasu.git
cd tasu
```

### 2. Configure Credentials

#### Firebase Configuration
```bash
cp config/firebase-config.example.js config/firebase-config.js
# Edit config/firebase-config.js with your Firebase credentials
```

#### Backend Configuration
```bash
cp api/config.example.php api/config.php
# Edit api/config.php with your database and API credentials
```

### 3. Database Setup

```bash
# Import the schema into your MySQL database
mysql -u your_user -p your_database < database/schema.sql
```

### 4. Deploy to Hostinger

Upload the following to your `public_html/` directory:
- `/app` → `public_html/app/`
- `/api` → `public_html/api/`
- `/sdk` → `public_html/sdk/`
- `/assets` → `public_html/assets/`
- `/config/firebase-config.js` → `public_html/config/firebase-config.js`

## 🔧 Configuration

### Required Credentials

1. **Firebase** (Authentication)
   - Get from: Firebase Console → Project Settings
   - Add to: `config/firebase-config.js`

2. **MySQL Database** (User data)
   - Host, database name, username, password
   - Add to: `api/config.php`

3. **Tinybird** (Analytics storage)
   - Admin token & Ingest token
   - Add to: `api/config.php` and `sdk/tasu-sdk.js`

4. **Stripe** (Optional - for billing)
   - Secret & publishable keys
   - Add to: `api/config.php`

## 📊 Tinybird Setup

Deploy the analytics infrastructure:

```bash
cd tinybird
tb auth login
tb deploy --force
```

See [`tinybird/README.md`](tinybird/README.md) for detailed instructions.

## 🔒 Security

- Never commit `api/config.php` or `config/firebase-config.js` to Git
- These files are in `.gitignore` for protection
- Use the `.example` files as templates

## 📖 Features

- **Multi-tenant**: Each user gets their own project_id
- **Real-time tracking**: Button click analytics
- **Dashboard**: View top/bottom performing buttons
- **Firebase Auth**: Email/password and Google Sign-In
- **Tinybird**: Scalable analytics backend

## 🛠️ Development

The repository is organized for easy development:
- Edit frontend: `/app/*.html`
- Edit backend: `/api/*.php`
- Edit SDK: `/sdk/tasu-sdk.js`

## 📝 License

Private project - All rights reserved

## 👤 Author

Jeremy Lasne - [@jeremylasne](https://x.com/jeremylasne)
