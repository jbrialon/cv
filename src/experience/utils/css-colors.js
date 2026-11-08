import * as THREE from "three/webgpu";

export function toRawColor(value) {
  return new THREE.Color().setStyle(value, THREE.LinearSRGBColorSpace);
}

// reads colours from colors.css as raw sRGB values
export default function getCssColors(propertyNames) {
  const rootStyles = getComputedStyle(document.documentElement);

  return propertyNames.map((propertyName) =>
    toRawColor(rootStyles.getPropertyValue(propertyName).trim()),
  );
}
