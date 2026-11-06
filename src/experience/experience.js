import * as THREE from "three/webgpu";

import Sizes from "./utils/sizes.js";
import Time from "./utils/time.js";
import Resources from "./utils/resources.js";
import Debug from "./utils/debug.js";
import Stats from "./utils/stats.js";

import Camera from "./camera.js";
import Renderer from "./renderer.js";

import World from "./world/world.js";

import sources from "./sources.js";

let instance = null;

export default class Experience {
  constructor(options = {}) {
    // Singleton
    if (instance) {
      return instance;
    }
    instance = this;

    // Global access
    window.experience = this;

    // Options
    this.canvas = options.canvas || null;
    this.targetElement = options.targetElement || null;
    this.prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!this.targetElement || !this.canvas) {
      console.warn(
        `Missing properties:  ${
          !this.targetElement ? "'targetElement' " : ""
        } ${!this.canvas ? "'canvas'" : ""}`,
      );
      return;
    }

    this.init();
  }

  async init() {
    // Setup
    this.debug = new Debug();
    await this.debug.init();
    this.stats = new Stats();
    await this.stats.setup();
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.resources = new Resources(sources);
    this.camera = new Camera();
    this.renderer = new Renderer();

    await this.renderer.setInstance();

    // World
    this.stats.init(this.renderer.instance);
    this.world = new World();

    // Sizes resize event
    this.sizes.on("resize", () => {
      this.resize();
    });

    // Time tick event
    this.time.on("tick", () => {
      this.update();
    });
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.stats.begin();
    this.camera.update();
    this.world.update();
    this.renderer.update();
    this.stats.end();
    this.stats.update();
  }

  destroy() {
    this.sizes.off("resize");
    this.time.off("tick");

    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();

        for (const key in child.material) {
          const value = child.material[key];
          if (value && typeof value.dispose === "function") {
            value.dispose();
          }
        }
      }
    });

    this.renderer.instance.dispose();
    if (this.debug.active) this.debug.ui.destroy();
  }
}
