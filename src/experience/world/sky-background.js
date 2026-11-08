import gsap from "gsap";
import {
  Fn,
  array,
  clamp,
  cos,
  distance,
  float,
  floor,
  fract,
  min,
  mix,
  sRGBTransferEOTF,
  sin,
  smoothstep,
  screenUV,
  time,
  uniform,
  vec2,
  vec3,
  vec4,
  viewportSize,
} from "three/tsl";

import Experience from "../experience.js";
import getCssColors, { toRawColor } from "../utils/css-colors.js";
import { filmGrain, hasImpreciseSin } from "../utils/film-grain.js";

const LIGHT_SKY_PROPERTIES = [
  "--sky-0",
  "--sky-1",
  "--sky-2",
  "--sky-3",
  "--sky-4",
  "--sky-5",
];
const LAST_LIGHT_STAGE = LIGHT_SKY_PROPERTIES.length - 1;

// one colour per light stage for each blob
const BLOB_ONE_HEXES = [
  "#E8B888",
  "#E4CFD1",
  "#EFE3D3",
  "#D7AA84",
  "#5E85A2",
  "#F5B595",
];
const BLOB_TWO_HEXES = [
  "#B6B4C2",
  "#FED4C5",
  "#CFC4C2",
  "#E5A898",
  "#FDB368",
  "#E7A4AB",
];
const HERO_STAGE = 6;

export default class SkyBackground {
  constructor() {
    this.experience = new Experience();
    this.debug = this.experience.debug;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;

    // Windows and phone/tablet GPUs make a moiré pattern with the sin grain, so they get the hash grain
    const useSinGrain = !hasImpreciseSin();

    // Options
    this.options = {
      grainStrength: 0.1,
      uGrainStrength: uniform(0.1),
      useSinGrain: useSinGrain,
      uUseSinGrain: uniform(useSinGrain ? 1 : 0),
      uStage: uniform(HERO_STAGE),
    };

    // Setup
    this.setBackground();
    this.fadeIn();

    // Debug
    this.setDebug();
  }

  setBackground() {
    const cssColors = getCssColors(
      LIGHT_SKY_PROPERTIES.concat([
        "--sky-8",
        "--sky-7",
        "--sky-6",
        "--blob-night-1",
        "--blob-night-2",
      ]),
    ).map((cssColor) => vec3(cssColor.r, cssColor.g, cssColor.b));

    // one flat colour per light stage, same as the CSS body gradient
    const skyColors = array(cssColors.slice(0, LAST_LIGHT_STAGE + 1));
    const [
      heroTop,
      heroMiddle,
      heroBottom,
      nightBlobOneColor,
      nightBlobTwoColor,
    ] = cssColors.slice(LAST_LIGHT_STAGE + 1);

    const toShaderColor = (hex) => {
      const rawColor = toRawColor(hex);
      return vec3(rawColor.r, rawColor.g, rawColor.b);
    };
    const blobOneColors = array(BLOB_ONE_HEXES.map(toShaderColor));
    const blobTwoColors = array(BLOB_TWO_HEXES.map(toShaderColor));

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

      // the blobs drift along slow looping curves
      // frozen at 0 when motion is reduced, so the blobs stay still
      const elapsed = this.experience.prefersReducedMotion ? float(0) : time;
      const blobOneCenter = vec2(
        sin(elapsed.mul(0.4)).mul(0.3).add(0.5),
        cos(elapsed.mul(0.3)).mul(0.45).add(0.5),
      );
      const blobTwoCenter = vec2(
        cos(elapsed.mul(0.6)).mul(0.2).add(aspect.mul(0.5)),
        sin(elapsed.mul(0.5)).mul(0.35).add(0.5),
      );

      // 1 at the centre, fading to 0 at 0.75 away
      const blobOne = smoothstep(
        0.0,
        0.75,
        distance(roundUv, blobOneCenter),
      ).oneMinus();
      const blobTwo = smoothstep(
        0.0,
        0.75,
        distance(roundUv, blobTwoCenter),
      ).oneMinus();

      const skyWithBlobOne = mix(
        skyColor,
        blobOneColor,
        smoothstep(0.0, 1.0, blobOne),
      );
      const skyWithBlobs = mix(
        skyWithBlobOne,
        blobTwoColor,
        smoothstep(0.0, 1.0, blobTwo),
      );

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
    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress =
      scrollableHeight > 0
        ? Math.min(Math.max(window.scrollY / scrollableHeight, 0), 1)
        : 0;

    // top of the page is the hero stage (night), bottom is stage 0 (dawn)
    this.options.uStage.value = HERO_STAGE * (1 - progress);
  }

  destroy() {
    gsap.killTweensOf(this.canvas);
    this.scene.backgroundNode = null;
  }
}
