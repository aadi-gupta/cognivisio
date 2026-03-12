"Baby Stimulator" designed for infants and easy for parents (especially mothers) to use.

The app should focus on visual stimulation, auditory stimulation, and simple interactive toys for babies aged 0–12 months.

The UI should be minimal, colorful, safe, and baby-friendly.

Design Principles

Mobile-first layout (optimized for Android phones)

Very large buttons

Rounded corners

Soft pastel color palette

Smooth animations

Minimal text

One-hand usage for parents

Fast loading

Use a theme with colors such as:

soft blue

pastel yellow

mint green

coral orange

lavender

Use playful but calm design.

Main Screen

Display 3 large cards/buttons centered on the screen:

👁 Visual

👂 Auditory

🧸 Toys

Requirements:

Each button should have an icon and label

Buttons should have subtle bounce animation when tapped

Rounded cards with soft shadows

Friendly baby-style font

Navigation should be very simple.

Visual Screen

Show a grid of visual stimulation patterns similar to the screenshot.

Patterns include:

Spiral

Radial sunburst

Concentric circles

Dot grid

Diamond grid

Triangle pattern

Snowflake pattern

Diagonal stripes

High contrast shapes

Each tile should:

Open full screen animation

Use black and white high contrast

Slowly animate (rotate, zoom, pulse)

Animations should use:

CSS animations or Canvas

smooth 60fps movement

tap anywhere to exit

Auditory Screen

Show simple sound tiles:

Examples:

White noise

Heartbeat

Rain

Soft chimes

Lullaby

Ocean waves

Behavior:

Tap tile → start sound

Tap again → stop sound

Show animated wave icon while playing

Use Web Audio API.

Toys Screen

Interactive touch toys for babies:

Examples:

Bubble popping

Rattle toy

Floating balls

Touch ripple animation

Color changing shapes

Behavior:

Tap anywhere → animation appears

Gentle sound effects

Random movement for engagement

UX Requirements

Mobile first

Full screen experience

Large touch targets

Back button on every screen

Smooth transitions

No complex menus

Technical Stack

Use:

React

Functional components

CSS animations

Canvas for visual patterns

Simple router navigation

Structure:

App
HomeScreen
VisualScreen
VisualPlayer
AuditoryScreen
SoundPlayer
ToysScreen
ToyCanvas
Extra Features

Add optional enhancements:

Dark mode 🌙

Fullscreen toggle

Gentle vibration feedback

PWA install support

Offline capability

Goal

The final result should feel like a calming baby stimulation app that parents can quickly open and show to their baby.

It should be:

visually engaging

simple to use

calming

responsive

lightweight
