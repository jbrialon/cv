import Experience from "../experience.js";
import SkyBackground from "./sky-background.js";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.skyBackground = new SkyBackground();

    // Wait for resources to be loaded
    this.resources.on("ready", () => {
      // Setup
      // Show Experience
      // this.loader.hideLoader();
    });
  }

  update() {
    this.skyBackground.update();
  }
}
