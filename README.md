<div align="center">

  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/Aura%20AI-Warmth%20in%20Intelligence-7A5C6B">
    <img alt="Aura AI" src="https://img.shields.io/badge/Aura%20AI-Warmth%20in%20Intelligence-7A5C6B">
  </picture>

  <h1 align="center">Translater_app</h1>

  <p align="center">
    <strong>Aura AI</strong> — a warm, human-centered AI voice translator built with Next.js that speaks your language — literally.
    <br />
    Hindi · Tamil · Malayalam · Kannada
  </p>

  <p align="center">
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js%2016-black?logo=next.js&logoColor=white">
    <img alt="React" src="https://img.shields.io/badge/React%2019-149ECA?logo=react&logoColor=white">
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white">
    <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind%20CSS%204-38BDF8?logo=tailwindcss&logoColor=white">
    <img alt="GSAP" src="https://img.shields.io/badge/GSAP-88CE02?logo=greensock&logoColor=black">
    <img alt="Sarvam AI" src="https://img.shields.io/badge/Sarvam%20AI%20TTS-7A5C6B?logo=buymeacoffee&logoColor=white">
    <img alt="MUI" src="https://img.shields.io/badge/MUI-007FFF?logo=mui&logoColor=white">
  </p>

  <br />

</div>

---

## ✨ Overview

**Aura AI** is a brand website for a fictional AI voice assistant — designed around the idea of *"warm minimalism"*: soft cream backgrounds, muted mauve accents, and rounded, human UI elements.

The flagship **Voices** page is fully functional: type something in English, pick a language, and Aura translates your words and speaks them back using **Sarvam AI's** text-to-speech engine with a warm female voice (`ritu`).

| | |
|---|---|
| 🏠 **Home** | Hero, latest journal, pricing — `asserts/Home-asserts` |
| ✨ **Features** | Mission, cinematic hero, pillars grid — `asserts/Feature-asserts` |
| 🎙️ **Voices** | Live TTS playground — English input → Hindi/Tamil/Malayalam/Kannada |
| ⚙️ **API** | `POST /api/tts` — translate + synthesize in one call |

## 🧱 Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | **Next.js 16** (App Router, Turbopack) + **React 19** |
| Language | TypeScript |
| Styling | Tailwind CSS v4, design tokens in `app/globals.css` |
| Components | MUI 9 + shadcn/ui (base-nova), `lucide-react` icons |
| Motion | **GSAP 3** (`ScrollTrigger` + `SplitText`), `motion` |
| Voice AI | **Sarvam AI SDK** (`sarvamai@1.1.8`) — `mayura:v1` translate + `bulbul:v3` TTS |
| State / data | zustand, zod, `@tanstack/react-query` |

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and npm
- A [Sarvam AI API key](https://docs.sarvam.ai) (free tier available)

### 1. Install

```bash
cd my-app
npm install
```

> **Install order note:** if you install Sarvam manually, run `npm i dotenv` *before* `npm install sarvamai`.

### 2. Configure the environment

Create a `.env` file in the project root (it is gitignored — never commit it):

```env
SARVAM_API=sk_your_sarvam_key_here
```

### 3. Run

```bash
npm run dev       # development server → http://localhost:3000
npm run build     # production build (Turbopack)
npm start         # serve the production build
npm run lint      # ESLint (flat config)
```

> ⚠️ Next.js 16 removed `next lint` — use the `lint` script above.

## 🎙️ How the Voice Flow Works

```
User types English text  →  POST /api/tts  →  Sarvam translate (en-IN → language)
                                             →  Sarvam TTS (speaker "ritu", bulbul:v3)
                                             →  base64 mp3 + translated text  →  <audio>
```

`app/api/tts/route.ts` is the only place the Sarvam client lives:

- `client.text.translate({ input, source_language_code: "en-IN", target_language_code })`
- `client.textToSpeech.convert({ text, language_code, speaker: "ritu", model: "bulbul:v3", output_audio_codec: "mp3" })`

**Supported languages:** `hi-IN` · `ta-IN` · `ml-IN` · `kn-IN`

> **Gotcha:** the SDK's TTS field is `language_code` (not `target_language_code`), and `bulbul:v3` rejects `pitch`/`loudness`. The docs in `Context/sarvam-model-setup.md` are older than `sarvamai@1.1.8` — `AGENTS.md` has the verified API.

## 📁 Project Structure

```
my-app/
├── app/
│   ├── api/tts/route.ts      # Sarvam translate + TTS proxy (server-only)
│   ├── features/page.tsx     # Features page
│   ├── voice/page.tsx        # Voices page — live TTS playground
│   ├── page.tsx              # Homepage
│   ├── layout.tsx            # Root layout (Inter, smooth scroll)
│   └── globals.css           # Tailwind v4 theme + design tokens + keyframes
├── components/
│   ├── Navbar.tsx            # Sticky nav (transparent → blur on scroll)
│   └── Footer.tsx            # Shared footer
├── lib/
│   ├── utils.ts              # cn() helper
│   └── reveal.ts             # GSAP entrance / scroll / stagger / split-text
├── asserts/
│   ├── Home-asserts/         # Homepage images
│   └── Feature-asserts/      # Feature page image
├── Context/                  # Design + build specs (source of truth)
├── UIDesign/                 # Reference screenshots
├── .env                      # SARVAM_API (gitignored)
└── next.config.ts            # serverExternalPackages: ["sarvamai"]
```

## 🎨 Design System

Warm minimalism — clean, cozy, human.

| Token | Value | Usage |
| --- | --- | --- |
| `--color-cream` | `#FDFBF7` | Page background |
| `--color-accent-mauve` | `#7A5C6B` | Accent, headings, buttons |
| `--color-dusty-mauve` | `#9B7A8A` | Muted status text |
| `--color-warm-text` | `#5C5C5C` | Body copy |
| `--color-soft-pink` | `#FCE8F0` | Icon circles, pink CTA |
| `--color-soft-beige` | `#F5E6C8` | Privacy card |
| `--color-warm-edge` | `#F0DEC0` | Voice page gradient edge |

- Typeface: **Inter**
- Corners: generous `rounded-2xl` / `rounded-3xl`
- Voice page background: `radial-gradient(ellipse at center, #FDF6ED 0%, #F5E6C8 60%, #F0DEC0 100%)`

## 🎬 Motion

`lib/reveal.ts` wires up GSAP with `ScrollTrigger` + `SplitText` across all pages via data attributes — zero per-component animation code:

- `data-hero-fade` — staggered load-in for hero content
- `data-reveal` — fade-up on scroll into view
- `data-stagger` / `data-stagger-item` — sequential grid reveals
- `data-split-text` — word-by-word headline reveal
- Respects `prefers-reduced-motion`

Pure-CSS motion powers the voice page's breathing sound-wave bars, morphing liquid blob, and sonar ripple rings.

## ♿ Accessibility

- Semantic landmarks (`header`, `nav`, `main`, `section`, `footer`)
- Focus-visible rings on all interactive elements
- Descriptive `alt` text on every image
- WCAG-AA-checked color contrast
- Reduced-motion fallbacks

## 🗺️ Roadmap

- [ ] Real speech-to-text (mic) input via Sarvam STT
- [ ] Live streaming TTS (`convertStream`) for near-instant playback
- [ ] Speaker picker (choose from `bulbul:v3` voices)
- [ ] i18n copy for the whole UI, not just the TTS output
- [ ] Unit + e2e tests

## 📄 License

© 2024 Aura AI. Crafted with love. Built as a design + engineering showcase.
