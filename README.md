# Veloura Scents — MVP App

A complete mobile-first web app for velourascents.pk, ready to wrap into a native Android/iOS app.

---

## 📱 Features

- **Splash screen** with animated logo
- **Home** — hero banner, featured products, sale items, promo section
- **Shop** — full catalogue with category filters (Men / Women / Unisex / Sale)
- **Search** — live search by name, category, and fragrance notes
- **Product Detail** — notes, description, meta info, quantity selector, wishlist toggle
- **Cart** — add/remove/adjust qty, subtotal + shipping, free shipping threshold
- **WhatsApp Checkout** — pre-filled order message sent to your WhatsApp
- **Wishlist** — heart any product, view saved items
- **User Profile** — sign in / guest mode / sign out
- **Order Tracking** — visual step-by-step tracker with delivery info
- **Toast notifications** throughout

---

## 🗂 File Structure

```
veloura-app/
├── index.html              ← App shell & all pages
├── src/
│   ├── data/
│   │   └── products.js     ← Product catalogue (edit to update products)
│   ├── styles/
│   │   └── main.css        ← All styling
│   └── app.js              ← All logic (cart, wishlist, routing, etc.)
└── README.md
```

---

## 🛒 Adding / Editing Products

Open `src/data/products.js` and add to the `PRODUCTS` array:

```js
{
  id: 11,                         // unique number
  name: 'Your Perfume Name',
  cat: 'Men',                     // Men | Women | Unisex
  emoji: '🌸',                    // display emoji
  bgColor: '#fdf0f5',             // card background color
  price: 2500,                    // price in PKR
  oldPrice: 3000,                 // null if no sale
  sale: true,                     // true shows "Sale" badge
  notes: ['Rose', 'Oud', 'Musk'],
  desc: 'Your product description here.',
}
```

---

## 🚀 Run Locally

Just open `index.html` in a browser — no build step needed.

For a local server:
```bash
npx serve .
# or
python3 -m http.server 8080
```

---

## 📦 Wrap into a Native App (Google Play / App Store)

Uses **Capacitor** by Ionic — free and takes about 30–60 minutes.

### Prerequisites
- Node.js 18+
- Android Studio (for Android)
- Xcode (for iOS, Mac only)

### Steps

```bash
# 1. Install Capacitor
npm init -y
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios

# 2. Init Capacitor (run inside this folder)
npx cap init "Veloura Scents" "pk.velourascents.app" --web-dir .

# 3. Add platforms
npx cap add android
npx cap add ios

# 4. Sync
npx cap sync

# 5a. Open in Android Studio → build APK → upload to Google Play
npx cap open android

# 5b. Open in Xcode → archive → upload to App Store
npx cap open ios
```

### Update after changes
```bash
npx cap sync
```

---

## 💚 WhatsApp Integration

Orders go to: **+92 312 4279 368**

To change the number, update this line in `src/app.js`:
```js
window.open('https://wa.me/923124279368?text=...')
```
Replace `923124279368` with your number in international format (no `+` or spaces).

---

## 🎨 Branding

Colours used:
- Dark navy: `#0f0f1a`
- Gold: `#d4af37`
- Background: `#f8f6f2`

To update, search/replace these hex values in `main.css`.

---

## 📍 Store Info

K Block, DHA Rahbar, Lahore
Phone: +92 312 4279 368
Email: info@velourascents.pk

---

*Built for Veloura Scents — velourascents.pk*
