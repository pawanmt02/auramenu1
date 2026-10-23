# AuraMenu – Culinary Reality, Reimagined 🍽️✨

A next-generation, mobile-first Progressive Web Application (PWA) demonstrating spatial computing and WebXR capabilities for dining. Built with **React.js**, **Tailwind CSS**, **Framer Motion**, **React Three Fiber (Three.js)**, and a **FastAPI** backend.

---

## 🌟 Application Architecture & Key Pages

### 1. Global Navigation Shell & The Melting Meniscus
- **Visual Design**: Dark-mode, floating pill-shaped container with frosted glass styling (`bg-zinc-950/85 backdrop-blur-2xl border border-white/10`).
- **The Melting Meniscus Animation**: The active tab uses a glowing bead that visually "melts" and warps the navigation bar around the selected icon.
- **Technical Engine**: Powered by an inline SVG filter containing `<feGaussianBlur>` and `<feColorMatrix>` overlaid on Framer Motion's `layoutId="active-meniscus-bead"` component, creating a fluid meniscus surface tension.

### 2. Page 1: Authentication & Onboarding (The Transition Portal)
- **Visual Style**: Soft Neumorphism on a clean `#e0e5ec` background, contrasting with the dark-mode AR environments.
- **Physical Micro-Interactions**:
  - Inset drop-shadows on input fields.
  - Dual-directional soft drop shadows on container and action cards.
  - The **"SIGN IN"** button micro-interaction physically shifts from extruded to inset shadow upon click.
- **Staggered Reveal**: Container fades in, followed by inputs and buttons rising sequentially with Framer Motion `staggerChildren: 0.1s`.
- **JWT Handoff**: Connects to the simulated/live FastAPI backend to issue session JWT bearer tokens.

### 3. Page 2: The Culinary Library (Spatial Bento Grid)
- **Visual Style**: Dark spatial aesthetic with translucent glassmorphic cards (`bg-white/10 backdrop-blur-lg`).
- **Authentic Dishes**: Mysore Bonda, Maddur Vada, Paneer Pakoda, Royal Dakshin Thali (9 katoris + brass platter), Hyderabadi Dum Biryani (Clay Handi), Tandoori Sizzler, Saffron Gulab Jamun Sundae, and Benne Dosa.
- **Gyroscopic 3D Parallax Tilt**: Uses `useMotionValue` and smooth physics springs to map mouse / device orientation coordinates to `rotateX` and `rotateY` with dynamic specular glare highlights.
- **Word-by-Word Cascading Text**: Metadata, origins, spice gauges, calorie meters, and story descriptions cascade smoothly when cards are focused.
- **Direct AR Actions**: Launch immediately into WebXR or save customized plates into your journal.

### 4. Page 3: The WebXR Canvas (Immersive Projection)
- **Visual Style**: Minimalist glassmorphism HUD over real-time camera passthrough feed (`navigator.mediaDevices.getUserMedia`) with fallback to spatial studio passthrough.
- **Spatial Plane Reticle**: Holographic scanning reticle with active sonar ripple searching for horizontal tables.
- **Elastic Scale-Up Animation**: When the user taps **"Place on Table"**, the 3D food asset rapidly scales from `0 -> 1.2` and elastically springs to `1.0` with physical weight and mass.
- **Attention Pulse**: The primary AR trigger button continually pulses with an animated neon aura.
- **Real-Time Spatial Controls**: 360° rotation, scale slider (0.6x to 1.8x), dynamic lighting shaders (Warm Candlelight, Daylight, Modern Bistro, Cyber Lounge), and steam particle effects.

### 5. Page 4: Saved Experiences & Customizer (Fluid Morphing)
- **Shared Element Layout Morphing**: Clicking any small thumbnail in the saved plates list detaches the element and smoothly flies across the screen via Framer Motion `layoutId` into the large hero turntable view without page reloads.
- **Interactive Dish Customizer**: Real-time spice adjustment (-1 Mild to +2 Fiery), portion multipliers (0.75x Tasting to 1.5x Feast), and artisan dips (+₹40 each) with live dynamic price & calorie calculation.
- **Settings System**: Smooth 60fps directional slide transition across Account Profile, AR Spatial Calibration, and Dietary & Allergen filter badges.

---

## 🚀 How to Run AuraMenu

### 1. Prerequisites
- **Node.js** (v18 or higher) & **npm**
- **Python 3.10+** (Optional, for running the live FastAPI backend)

---

### 2. Frontend Development Server (React + Vite + Tailwind + WebXR)

1. Open your terminal in the project directory:
   ```bash
   cd c:\Users\Pawan\AuraMenu
   ```

2. Install dependencies (already prepared):
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open the displayed URL in your browser:
   ```
   http://localhost:5173
   ```
   *Tip: On mobile devices connected to the same Wi-Fi, open `http://<your-local-ip>:5173` to test live device gyroscope parallax and camera passthrough!*

---

### 3. FastAPI Backend (Optional Live Server)

AuraMenu features a built-in mock fallback with JWT token simulation out of the box. To run the dedicated Python FastAPI backend as well:

1. Install Python dependencies:
   ```bash
   pip install fastapi uvicorn pydantic
   ```
   *(or `pip install -r backend/requirements.txt`)*

2. Start the FastAPI server:
   ```bash
   python backend/main.py
   ```
   *(or `npm run server`)*

3. The API will start on:
   ```
   http://localhost:8000
   ```
   - Interactive API Swagger Docs: `http://localhost:8000/docs`

---

## 🛠️ UI/UX Technical Stack Execution Matrix

| Page / Component | Primary Rendering Paradigm | Core Animation Library | Functional Output |
| :--- | :--- | :--- | :--- |
| **Authentication & Portal** | CSS Box-Shadow Manipulation & Neumorphism | Framer Motion (Staggered Springs) | User credential validation & JWT handoff |
| **Culinary Bento Library** | CSS Grid + Backdrop Glassmorphism | Framer Motion (3D Transforms & Gyro) | Asynchronous metadata mapping, parallax tilt |
| **WebXR Spatial Canvas** | WebGL Canvas + WebXR Camera Passthrough | React Three Fiber (Spring Physics & Shaders) | Plane surface detection, elastic mesh bounce |
| **Saved Experiences & Customizer** | Shared Element DOM Morphing | Framer Motion (`layoutId` & Slide Variants) | Live plate customization, portion & spice recalculation |
| **Global Meniscus Shell** | SVG Filter (`feGaussianBlur` + `feColorMatrix`) | Framer Motion (`layoutId="active-meniscus-bead"`) | Fluid gooey surface tension navigation |

---

Enjoy experiencing culinary reality reimagined with **AuraMenu**! 🍛🥂
