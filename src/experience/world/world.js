import Experience from "../experience.js";
import HeroPlane from "./hero-plane.js";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.heroPlane = new HeroPlane();

    // Wait for resources to be loaded
    this.resources.on("ready", () => {
      // Setup
      // Show Experience
      // this.loader.hideLoader();
    });
  }

  update() {
    this.heroPlane.update();
  }
}
