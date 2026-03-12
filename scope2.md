codex "
Refactor the entire Visual stimulation module to use a high-performance HTML5 Canvas animation engine instead of CSS animations.

Goal:
The current animations are bland (center zoom only). Replace them with dynamic hypnotic motion similar to patterns seen in movie hypnosis scenes. Animations must move across the screen, rotate, pulse, and feel alive.

Technical requirements:
- Use React + HTML5 Canvas
- Use requestAnimationFrame for the render loop
- 60fps smooth animation
- Full screen canvas
- Mobile first performance
- High contrast visuals (black background, white shapes)
- Each animation must run continuously and fill the screen
- Tap anywhere to exit back to menu

Architecture:

src/
  visual/
    CanvasEngine.ts
    patterns/
      SpiralPattern.ts
      CirclePattern.ts
      TrianglePattern.ts
      RingsPattern.ts
      SunburstPattern.ts
      DiamondPattern.ts
      StarPattern.ts
      DiamondGridPattern.ts
      PawPattern.ts
      CrossPattern.ts

Create a reusable CanvasEngine that:
- initializes canvas
- runs requestAnimationFrame loop
- calls update(time) and draw(ctx)
- resizes for mobile screens

Pattern interface:

init(width, height)
update(time)
draw(ctx)

Each pattern must have unique motion:

Spiral
- hypnotic spiral rotating slowly
- spiral arms expanding outward
- subtle breathing pulse

Circle
- multiple circles floating across screen
- bounce on screen edges
- random speeds

Triangle
- triangle grid drifting diagonally
- slow rotation
- gentle zoom wave

Rings
- ripple waves expanding from center
- fading rings like water drops

Sunburst
- rotating radial rays
- brightness pulse
- slight zoom

Diamond
- diamonds falling from top to bottom
- gentle rotation

Star
- stars orbit around center
- twinkle brightness effect

Diamond Grid
- scrolling diamond grid moving horizontally
- parallax layers

Paw
- paw icons bouncing randomly around screen
- toy-like playful motion

Cross
- crosses drifting downward like snow
- rotation and fade

Add shared motion utilities:

rotate(angle, speed)
bounce(position, velocity, bounds)
orbit(center, radius, speed)
pulse(base, amplitude, time)
wave(offset, amplitude, frequency)
ripple(radius, speed)
drift(xSpeed, ySpeed)

Ensure:
- animations loop forever
- shapes remain large and visible for babies
- no heavy libraries
- optimized for Android mobile browsers
- code is modular so new patterns can be added easily

Return full implementation code for CanvasEngine and all pattern classes.
"