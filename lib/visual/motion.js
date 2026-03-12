export function rotate(angle, speed, delta) {
  return angle + speed * delta;
}

export function bounce(position, velocity, min, max, radius = 0) {
  let nextPosition = position + velocity;
  let nextVelocity = velocity;

  if (nextPosition - radius < min || nextPosition + radius > max) {
    nextVelocity *= -1;
    nextPosition = Math.max(min + radius, Math.min(max - radius, nextPosition));
  }

  return { position: nextPosition, velocity: nextVelocity };
}

export function orbit(center, radius, speed, time, offset = 0) {
  return {
    x: center.x + Math.cos(time * speed + offset) * radius,
    y: center.y + Math.sin(time * speed + offset) * radius,
  };
}

export function pulse(base, amplitude, time, frequency = 1) {
  return base + Math.sin(time * frequency) * amplitude;
}

export function wave(offset, amplitude, frequency, time) {
  return Math.sin(time * frequency + offset) * amplitude;
}

export function ripple(radius, speed, time, spacing) {
  return (radius + time * speed) % spacing;
}

export function drift(value, speed, delta, max) {
  let next = value + speed * delta;

  if (next > max) {
    next -= max;
  }

  return next;
}

