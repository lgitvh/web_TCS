# Idle RPG (English port of vue-idle-game)

The original idle gear-farming RPG from [Couy69/vue-idle-game](https://github.com/Couy69/vue-idle-game)
(MIT, see `LICENSE`), translated to English and packaged as an iPhone app with Capacitor.
Gameplay is unchanged from the original. The author's original Chinese README is in `README.original-zh.md`.

How to play: tap a dungeon on the map, then **Start**. Your hero fights 4 monsters and a boss,
earning gold and random gear. Beat a boss in a higher-level dungeon to level up. Equip, enhance (+1, +2, ...)
and reforge gear, buy from the shop, unlock **Endless** after Lv10, and **Rebirth** after Lv30 for permanent stat points.
The game saves automatically on the device (you can also export/import a save).

## Run in a browser

```bash
npm install
npm run serve        # http://localhost:8080
```

## Run on iPhone / Simulator (Mac with Xcode 16+)

The Xcode project is already in `ios/` with the latest game build inside, so you can open it directly:

1. Open `ios/App/App.xcodeproj` in Xcode.
2. Wait for Xcode to finish "Resolving Package Graph" (it downloads Capacitor once).
3. Choose an iPhone simulator at the top and press **Run** (▶).

To run on your own iPhone: select the **App** target → **Signing & Capabilities** → choose your Team
(a free Apple ID works), and change the Bundle Identifier if Xcode says it is taken. Then select your phone and press Run.

After changing the game code, rebuild and copy it into the Xcode project:

```bash
npm install
npm run sync         # or: npm run ios  (also opens Xcode)
```

## Changes from the original

- Text translated from Chinese to English.
- Build tooling updated to run on current Node.js (Vue CLI 5, dart-sass); game code unchanged.
- Removed the Baidu analytics script and the feedback / old-version features that called the original author's server.
- Long English item names wrap on small screens; a few dungeon labels shortened to fit.

## Credits

- Game: [Couy69/vue-idle-game](https://github.com/Couy69/vue-idle-game), MIT License.
- App icon: sword from [game-icons.net](https://game-icons.net) by Lorc, CC BY 3.0.
- Note: the in-game item artwork comes from the original repository; its source/licensing is not documented there.
  Replace it before publishing the app on the App Store.
