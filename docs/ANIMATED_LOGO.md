# Animated Logo Documentation

## Overview

The TomeIQ application now features a custom animated logo component that replaces the static PNG placeholder. This creates a more dynamic and professional appearance across the application.

## Component: `AnimatedLogo`

### Location

`src/components/AnimatedLogo.tsx`

### Features

1. **Animated Book Pages**

   - Left and right pages that gently flip in 3D perspective
   - Creates a "page-turning" effect that loops continuously
   - Staggered animation timing for natural movement

2. **Intelligence Sparkles**

   - Four sparkle points around the logo
   - Fade in/out animation to emphasize the "IQ" (intelligence) theme
   - Strategically placed in corners for visual balance

3. **Hover Effects**

   - Gentle pulse animation on hover
   - Drop shadow with brand purple color
   - Checkmark overlay appears on hover (knowledge confirmation)

4. **Floating Animation**

   - Subtle up-and-down movement
   - Creates living, breathing quality
   - Smooth 3-second loop

5. **Brand Colors**
   - Purple gradient (`#9333ea` to `#7c3aed`) for book cover
   - Light gray gradient for pages
   - Golden yellow sparkles (`#fbbf24`)
   - Matches TomeIQ brand identity

### Props

```typescript
interface AnimatedLogoProps {
  size?: number; // Size in pixels (default: 96)
  animate?: boolean; // Enable/disable animations (default: true)
}
```

### Usage

```tsx
import { AnimatedLogo } from "./AnimatedLogo";

// Default size with animations
<AnimatedLogo />

// Custom size
<AnimatedLogo size={120} />

// Static version (no animations)
<AnimatedLogo animate={false} />
```

### Implementation Locations

The animated logo has been integrated in three key locations:

1. **Main Header** (`ChapterCheckerV2.tsx`)

   - Top-left corner of the application
   - Always visible for brand recognition
   - Full animation enabled

2. **Navigation Menu** (`NavigationMenu.tsx`)

   - Slide-out menu header
   - Reinforces brand identity in navigation
   - Full animation enabled

3. **Help Modal** (`HelpModal.tsx`)
   - Quick Start Guide header
   - Professional appearance for help documentation
   - Full animation enabled

### Technical Details

#### Animations

All animations are pure CSS for optimal performance:

- `pageFlip` / `pageFlipRight`: 3D perspective page turns
- `sparkle`: Fade in/out with scale
- `pulse`: Hover scale effect
- `float`: Vertical translation loop

#### Browser Support

- Modern browsers with CSS3 animation support
- Degrades gracefully (static logo) if animations unsupported
- SVG format ensures crisp rendering at any size
- No external dependencies

#### Performance

- Lightweight SVG (~2-3KB)
- GPU-accelerated CSS animations
- No JavaScript animation loops
- Minimal CPU/memory footprint

### Comparison to Previous Implementation

**Before:**

- Static PNG image (`tomeiq-logo.png`)
- Fixed appearance
- No interaction
- Generic feel

**After:**

- Dynamic SVG animation
- Interactive hover states
- Professional, modern appearance
- Reinforces learning/intelligence theme
- Matches sites like Grok, Claude, ChatGPT

### Future Enhancements

Possible improvements for future iterations:

1. **Color Themes**

   - Support for light/dark mode variants
   - Custom color schemes per domain

2. **Animation Variants**

   - Multiple animation styles (subtle, normal, energetic)
   - Celebration animations for milestones

3. **Loading States**

   - Spinning book animation during analysis
   - Progress indication through logo

4. **Accessibility**

   - `prefers-reduced-motion` support for users sensitive to animation
   - Keyboard focus states

5. **Interactive Elements**
   - Click to show version info
   - Easter egg animations

### Customization Guide

To modify the logo animations, edit these sections in `AnimatedLogo.tsx`:

**Change animation speed:**

```css
animation: pageFlip 3s ease-in-out infinite;
/* Change 3s to desired duration */
```

**Change colors:**

```tsx
<linearGradient id="bookGradient">
  <stop offset="0%" style={{ stopColor: "#9333ea" }} />
  {/* Modify color values */}
</linearGradient>
```

**Adjust hover effect:**

```tsx
filter: isHovered ? "drop-shadow(...)" : "none";
```

### Design Philosophy

The animated logo embodies TomeIQ's core values:

- **Learning**: Pages turning represents knowledge acquisition
- **Intelligence**: Sparkles symbolize "aha!" moments and insights
- **Progress**: Continuous animation suggests ongoing improvement
- **Professionalism**: Smooth, polished animations convey quality
- **Approachability**: Friendly animations make the tool feel welcoming

### Testing Checklist

When making changes to the logo, verify:

- [ ] Logo renders correctly at different sizes (48px, 96px, 144px)
- [ ] Animations are smooth (60 FPS)
- [ ] Hover states work properly
- [ ] No console errors
- [ ] Builds successfully without TypeScript errors
- [ ] Looks good in all three locations (header, nav, help)
- [ ] SVG renders clearly on retina displays
- [ ] Colors match brand guidelines

## Files Modified

1. **Created:**

   - `src/components/AnimatedLogo.tsx` (new component)

2. **Updated:**

   - `src/components/ChapterCheckerV2.tsx` (replaced static logo)
   - `src/components/NavigationMenu.tsx` (replaced static logo)
   - `src/components/HelpModal.tsx` (replaced static logo)
   - `src/components/index.tsx` (added export)

3. **Deprecated:**
   - `src/assets/tomeiq-logo.png` (still present but no longer used)

## Maintenance Notes

- The old PNG logo file remains in the assets folder for backward compatibility
- If reverting to static logo, simply import `tomeIqLogo` and replace `<AnimatedLogo />` with `<img src={tomeIqLogo} />`
- Consider removing unused PNG import from updated files for cleaner code
