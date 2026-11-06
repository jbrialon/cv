import * as THREE from "three/webgpu";
import {
  color,
  dot,
  fract,
  positionLocal,
  screenCoordinate,
  sin,
  time,
  uniform,
  vec2,
  vec4,
} from "three/tsl";

import Experience from "../experience.js";

export default class HeroPlane {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.sizes = this.experience.sizes;
    this.debug = this.experience.debug;

    // Options
    this.options = {
      color: 0x607161,
      uColor: uniform(color(0x607161)),
      uScrollOffset: uniform(0),
      uGrainStrength: uniform(0.1),
    };

    // Setup
    this.setGeometry();
    this.setMaterial();
    this.setMesh();

    // Debug
    this.setDebug();
  }

  setGeometry() {
    // the screen goes from -1 to 1 on both axes, so a 2 by 2 plane covers it entirely
    this.geometry = new THREE.PlaneGeometry(2, 2, 1, 1);
  }

  setMaterial() {
    this.material = new THREE.MeshBasicNodeMaterial();
    this.material.depthTest = false;
    this.material.depthWrite = false;

    // skip the camera and place the plane straight on the screen, pushed up by the scroll
    this.material.vertexNode = vec4(
      positionLocal.x,
      positionLocal.y.add(this.options.uScrollOffset),
      0,
      1,
    );

    // film grain: a new random value per pixel, moving with time
    // TODO: sin() is not precise enough on Windows and phones/tablets (moiré pattern), use the hash grain there
    const pixelPosition = screenCoordinate.xy;
    const grain = fract(
      sin(dot(pixelPosition.add(time.mul(0.0002)), vec2(12.9898, 78.233))).mul(
        43758.5453,
      ),
    );
    const grainOffset = grain.sub(0.5).mul(this.options.uGrainStrength);

    this.material.colorNode = this.options.uColor.add(grainOffset);
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    // the camera doesn't see where the plane really is, so it must never be culled
    this.mesh.frustumCulled = false;
    this.scene.add(this.mesh);
  }

  setDebug() {
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder({
        title: "Hero plane",
      });

      this.debugFolder
        .addBinding(this.options, "color", {
          view: "color",
        })
        .on("change", () => {
          this.options.uColor.value.set(this.options.color);
        });

      this.debugFolder.addBinding(this.options.uGrainStrength, "value", {
        label: "grainStrength",
        min: 0,
        max: 0.5,
        step: 0.005,
      });
    }
  }

  update() {
    // the screen is 2 units tall, so scrolling one viewport moves the plane by 2
    this.options.uScrollOffset.value = (window.scrollY / this.sizes.height) * 2;
  }

  destroy() {
    this.geometry.dispose();
    this.material.dispose();
    this.scene.remove(this.mesh);
  }
}
