import Experience from "../experience.js";
import EventEmitter from "./event-emitter.js";

export default class Sizes extends EventEmitter {
  constructor() {
    super();
    this.experience = new Experience();
    this.debug = this.experience.debug;
    this.targetElement = this.experience.targetElement;

    // Resize event
    this.resize = this.resize.bind(this);
    window.addEventListener("resize", this.resize);

    this.resize();
  }
  /**
   * Resize
   */
  resize() {
    const containerBounds = this.targetElement.getBoundingClientRect();
    const width = Math.floor(containerBounds.width);
    const height = Math.floor(containerBounds.height);
    const pixelRatio = Math.min(window.devicePixelRatio, 2);

    // Safari fires resize when its toolbar hides, but the 100lvh canvas keeps its size, so skip the costly resize
    if (
      width === this.width &&
      height === this.height &&
      pixelRatio === this.pixelRatio
    ) {
      return;
    }

    this.width = width;
    this.height = height;
    this.pixelRatio = pixelRatio;

    this.trigger("resize");
  }
}
