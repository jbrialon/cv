import gsap from "gsap";
import { Color, Vector2 } from "three/webgpu";
import {
  Fn,
  array,
  clamp,
  dot,
  float,
  floor,
  fract,
  min,
  mix,
  pow,
  sRGBTransferEOTF,
  smoothstep,
  screenUV,
  time,
  uniform,
  uniformArray,
  vec3,
  vec4,
  viewportSize,
} from "three/tsl";

import Experience from "../experience.js";
import getCssColors, { toRawColor } from "../utils/css-colors.js";
import { filmGrain, hasImpreciseSin } from "../utils/film-grain.js";
import { simplexNoise3d } from "../utils/simplex-noise.js";
import BLOB_PALETTES, { DEFAULT_BLOB_PALETTE } from "./blob-palettes.js";

const LIGHT_SKY_PROPERTIES = [
  "--sky-0",
  "--sky-1",
  "--sky-2",
  "--sky-3",
  "--sky-4",
  "--sky-5",
];
const LAST_LIGHT_STAGE = LIGHT_SKY_PROPERTIES.length - 1;

// section marker colour per light stage, each one readable on its sky
const MARKER_HEXES = [
  "#B77635",
  "#A45850",
  "#946E4C",
  "#666A66",
  "#445D6B",
  "#526369",
];
const HERO_STAGE = 6;
const HERO_FADE_SCREENS = 0.7;
const CURSOR_HOLE_RADIUS = 0.015;

export default class SkyBackground {
  constructor() {
    this.experience = new Experience();
    this.debug = this.experience.debug;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;

    // Windows and phone/tablet GPUs make a moiré pattern with the sin grain, so they get the hash grain
    const useSinGrain = !hasImpreciseSin();

    // no mouse to follow on phones and tablets, so no hole in the blobs there
    this.isTouch = window.matchMedia(
      "(hover: none), (pointer: coarse)",
    ).matches;

    // Options
    this.options = {
      grainStrength: 0.1,
      uGrainStrength: uniform(0.1),
      useSinGrain: useSinGrain,
      uUseSinGrain: uniform(useSinGrain ? 1 : 0),
      uStage: uniform(HERO_STAGE),
      uPointer: uniform(new Vector2(0.5, 0.5)),
      uMouseInteraction: uniform(this.isTouch ? 0 : 1),
      blobPalette: DEFAULT_BLOB_PALETTE,
      uBlobOneColors: uniformArray(
        LIGHT_SKY_PROPERTIES.map(() => new Color()),
        "color",
      ),
      uBlobTwoColors: uniformArray(
        LIGHT_SKY_PROPERTIES.map(() => new Color()),
        "color",
      ),
      uNightBlobOneColor: uniform(new Color()),
      uNightBlobTwoColor: uniform(new Color()),
    };

    // where the mouse really is, the hole slowly catches up with it
    this.pointerTarget = new Vector2(0.5, 0.5);

    // the first frame jumps straight to the scroll position, the next ones ease towards it
    this.hasStage = false;

    this.markerColors = MARKER_HEXES.map(toRawColor);
    this.markerValue = null;

    this.setBlobPalette(this.options.blobPalette);

    // Setup
    this.setBackground();
    this.setPointer();
    this.fadeIn();

    // Debug
    this.setDebug();
  }

  setBackground() {
    const cssColors = getCssColors(
      LIGHT_SKY_PROPERTIES.concat(["--sky-8", "--sky-7", "--sky-6"]),
    ).map((cssColor) => vec3(cssColor.r, cssColor.g, cssColor.b));

    // one flat colour per light stage, same as the CSS body gradient
    const skyColors = array(cssColors.slice(0, LAST_LIGHT_STAGE + 1));
    const [heroTop, heroMiddle, heroBottom] = cssColors.slice(
      LAST_LIGHT_STAGE + 1,
    );

    // uniforms, so the palette can be swapped while the page runs
    const blobOneColors = this.options.uBlobOneColors;
    const blobTwoColors = this.options.uBlobTwoColors;
    const nightBlobOneColor = this.options.uNightBlobOneColor;
    const nightBlobTwoColor = this.options.uNightBlobTwoColor;

    const backgroundShader = Fn(() => {
      // stretch x so the blobs stay round on wide screens
      const aspect = viewportSize.x.div(viewportSize.y);
      const roundUv = screenUV.toVar();
      roundUv.x.assign(roundUv.x.mul(aspect));

      const stage = clamp(this.options.uStage, 0.0, HERO_STAGE);

      // the light stage and how far along it is towards the next one
      const lightStage = min(stage, LAST_LIGHT_STAGE);
      const stageIndex = floor(lightStage);
      const nextStageIndex = min(stageIndex.add(1), LAST_LIGHT_STAGE);
      const stageProgress = fract(lightStage);

      const lightSkyColor = mix(
        skyColors.element(stageIndex),
        skyColors.element(nextStageIndex),
        stageProgress,
      );
      const lightBlobOneColor = mix(
        blobOneColors.element(stageIndex),
        blobOneColors.element(nextStageIndex),
        stageProgress,
      );
      const lightBlobTwoColor = mix(
        blobTwoColors.element(stageIndex),
        blobTwoColors.element(nextStageIndex),
        stageProgress,
      );

      // hero stage: same stops as the CSS .hero::before gradient, sky-8, sky-7 at 55%, sky-6
      // screenUV starts at 0 at the top of the screen
      const distanceFromTop = screenUV.y;
      const upperHeroSky = mix(
        heroTop,
        heroMiddle,
        distanceFromTop.div(0.55).saturate(),
      );
      const heroSkyColor = mix(
        upperHeroSky,
        heroBottom,
        distanceFromTop.sub(0.55).div(0.45).saturate(),
      );

      // 0 up to the last light stage, 1 on the hero stage
      const heroAmount = stage.sub(LAST_LIGHT_STAGE).saturate();

      const skyColor = mix(lightSkyColor, heroSkyColor, heroAmount);
      const blobOneColor = mix(
        lightBlobOneColor,
        nightBlobOneColor,
        heroAmount,
      );
      const blobTwoColor = mix(
        lightBlobTwoColor,
        nightBlobTwoColor,
        heroAmount,
      );

      // the noise scrolls through time, frozen at 0 when motion is reduced so the blobs stay still
      const elapsed = this.experience.prefersReducedMotion ? float(0) : time;
      const noiseTime = elapsed.mul(0.3);

      const noise = simplexNoise3d(vec3(roundUv.mul(0.8), noiseTime));
      const blobNoise = noise.mul(0.8);

      // distance to the mouse, with y squashed so the hole stays round
      const toPointer = screenUV.sub(this.options.uPointer).toVar();
      toPointer.y.assign(toPointer.y.div(aspect));

      // 0 right under the mouse, 1 further away
      const cursorHole = smoothstep(
        0.0,
        CURSOR_HOLE_RADIUS,
        pow(dot(toPointer, toPointer), 0.6).mul(0.1),
      );
      const blobHole = mix(1.0, cursorHole, this.options.uMouseInteraction);

      // negative noise is cut off, so only the peaks show up as blobs
      const blobAmount = blobNoise.mul(blobHole).saturate();

      const blobColor = mix(
        blobTwoColor,
        blobOneColor,
        smoothstep(0.1, 1.0, noise.oneMinus()),
      );
      const skyWithBlobs = mix(skyColor, blobColor, blobAmount);

      const grainOffset = filmGrain(this.options.uUseSinGrain)
        .sub(0.5)
        .mul(this.options.uGrainStrength);

      // the colours were mixed like CSS does
      const finalColor = sRGBTransferEOTF(
        skyWithBlobs.add(grainOffset).saturate(),
      );

      return vec4(finalColor, 1.0);
    });

    this.scene.backgroundNode = backgroundShader();
  }

  setBlobPalette(paletteKey) {
    const palette = BLOB_PALETTES[paletteKey];
    if (!palette) return;

    this.options.blobPalette = paletteKey;

    palette.blobOne.forEach((hex, stageIndex) => {
      this.options.uBlobOneColors.array[stageIndex].copy(toRawColor(hex));
    });
    palette.blobTwo.forEach((hex, stageIndex) => {
      this.options.uBlobTwoColors.array[stageIndex].copy(toRawColor(hex));
    });
    this.options.uNightBlobOneColor.value.copy(toRawColor(palette.night[0]));
    this.options.uNightBlobTwoColor.value.copy(toRawColor(palette.night[1]));
  }

  setPointer() {
    if (this.isTouch) return;

    // same space as screenUV: 0 at the top left, 1 at the bottom right
    this.onMouseMove = (event) => {
      this.pointerTarget.set(
        event.clientX / window.innerWidth,
        event.clientY / window.innerHeight,
      );
    };
    window.addEventListener("mousemove", this.onMouseMove);
  }

  // the background is always opaque (sadly), so the whole canvas fades in over the CSS gradients
  fadeIn() {
    if (this.experience.prefersReducedMotion) return;

    gsap.fromTo(
      this.canvas,
      { opacity: 0 },
      { opacity: 1, duration: 1.2, ease: "power2.out" },
    );
  }

  setDebug() {
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder({
        title: "Sky background",
      });

      this.debugFolder
        .addBinding(this.options, "blobPalette", {
          options: {
            "A · current": "current",
            "B · tonal": "tonal",
            "C · neighbours": "neighbours",
            "D · sunrise": "sunrise",
          },
        })
        .on("change", (event) => {
          this.setBlobPalette(event.value);
        });

      this.debugFolder
        .addBinding(this.options, "grainStrength", {
          min: 0,
          max: 0.5,
          step: 0.005,
        })
        .on("change", () => {
          this.options.uGrainStrength.value = this.options.grainStrength;
        });

      this.debugFolder
        .addBinding(this.options, "useSinGrain")
        .on("change", () => {
          this.options.uUseSinGrain.value = this.options.useSinGrain ? 1 : 0;
        });
    }
  }

  update() {
    const screenHeight = this.experience.sizes.height;
    const scrollableHeight =
      document.documentElement.scrollHeight - screenHeight;
    const scroll = Math.min(Math.max(window.scrollY, 0), scrollableHeight);

    // the night fades over a fixed distance, so a longer page doesn't make it fade later
    const heroFadeDistance = Math.min(
      screenHeight * HERO_FADE_SCREENS,
      scrollableHeight,
    );
    const lightScrollHeight = scrollableHeight - heroFadeDistance;

    // top of the page is the hero stage (night), bottom is stage 0 (dawn)
    let targetStage;
    if (heroFadeDistance <= 0) {
      targetStage = HERO_STAGE;
    } else if (scroll < heroFadeDistance) {
      targetStage = HERO_STAGE - scroll / heroFadeDistance;
    } else if (lightScrollHeight > 0) {
      const lightProgress = (scroll - heroFadeDistance) / lightScrollHeight;
      targetStage = LAST_LIGHT_STAGE * (1 - lightProgress);
    } else {
      targetStage = LAST_LIGHT_STAGE;
    }

    // frames since the last one, counted at 60fps, so easing runs at the same speed on 120Hz screens
    const frameCount = this.experience.time.delta / (1000 / 60);

    // phones report scrollY in uneven steps, so the stage slowly catches up instead of jumping
    if (this.isTouch && this.hasStage) {
      const stageEasing = 1 - Math.pow(0.85, frameCount);
      this.options.uStage.value +=
        (targetStage - this.options.uStage.value) * stageEasing;
    } else {
      this.options.uStage.value = targetStage;
    }
    this.hasStage = true;

    this.updateMarkerColor();

    // move 10% of the way to the mouse every 60fps frame
    const pointerEasing = 1 - Math.pow(0.9, frameCount);
    this.options.uPointer.value.lerp(this.pointerTarget, pointerEasing);
  }

  // same blend between light stages as the shader, the hero stage keeps the last light colour
  updateMarkerColor() {
    const lightStage = Math.min(
      Math.max(this.options.uStage.value, 0),
      LAST_LIGHT_STAGE,
    );
    const stageIndex = Math.floor(lightStage);
    const nextStageIndex = Math.min(stageIndex + 1, LAST_LIGHT_STAGE);
    const stageProgress = lightStage - stageIndex;

    const markerColor = this.markerColors[stageIndex]
      .clone()
      .lerp(this.markerColors[nextStageIndex], stageProgress);

    const red = Math.round(markerColor.r * 255);
    const green = Math.round(markerColor.g * 255);
    const blue = Math.round(markerColor.b * 255);
    const markerValue = `rgb(${red} ${green} ${blue})`;

    if (markerValue === this.markerValue) return;

    this.markerValue = markerValue;
    document.documentElement.style.setProperty("--color-marker", markerValue);
  }

  destroy() {
    document.documentElement.style.removeProperty("--color-marker");
    gsap.killTweensOf(this.canvas);
    if (this.onMouseMove) {
      window.removeEventListener("mousemove", this.onMouseMove);
    }
    this.scene.backgroundNode = null;
  }
}
