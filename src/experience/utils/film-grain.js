import {
  dot,
  fract,
  frameId,
  hash,
  screenCoordinate,
  select,
  sin,
  time,
  uint,
  vec2,
} from "three/tsl";

// true on devices where sin() of big numbers is not precise enough for the sin grain
export function hasImpreciseSin() {
  const userAgent = navigator.userAgent;
  const isWindows = /Windows/i.test(userAgent);
  const isIpad = /Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1;
  const isMobile = /Android|iPhone|iPad|iPod/i.test(userAgent) || isIpad;
  return isWindows || isMobile;
}

export function filmGrain(uUseSinGrain) {
  const pixelPosition = screenCoordinate.xy;

  const pixelIndex = uint(pixelPosition.x).add(
    uint(pixelPosition.y).mul(uint(8192)),
  );
  const hashGrain = hash(pixelIndex.add(frameId.mul(uint(2654435761))));

  // sin grain: the original look, but makes a moiré pattern on Windows and phones
  const sinGrain = fract(
    sin(dot(pixelPosition.add(time.mul(0.0002)), vec2(12.9898, 78.233))).mul(
      43758.5453,
    ),
  );

  return select(uUseSinGrain.greaterThan(0.5), sinGrain, hashGrain);
}
