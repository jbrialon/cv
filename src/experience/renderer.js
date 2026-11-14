import * as THREE from "three/webgpu";
import Experience from "./experience.js";

export default class Renderer {
  constructor() {
    this.experience = new Experience();
    this.debug = this.experience.debug;
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;

    // Options
    this.options = {};
  }

  async setInstance() {
    this.instance = new THREE.WebGPURenderer({
      canvas: this.canvas,
      forceWebGL: false,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    await this.instance.init();

    // fully transparent until the first frame, so the CSS sky gradient shows through
    this.instance.setClearColor(0x000000, 0);

    THREE.ColorManagement.enabled = true;
    this.instance.outputColorSpace = THREE.SRGBColorSpace;

    this.instance.toneMapping = this.options.toneMapping;
    this.instance.toneMappingExposure = this.options.toneMappingExposure;

    // false: CSS sizes the canvas, so it keeps filling the screen when Safari's bars move
    this.instance.setSize(this.sizes.width, this.sizes.height, false);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height, false);
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
  }

  update() {
    this.instance.render(this.scene, this.camera.instance);
  }
}
