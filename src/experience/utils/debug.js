export default class Debug {
  constructor() {
    this.active = window.location.hash === "#debug";
  }

  async init() {
    if (this.active) {
      // only downloaded with #debug, so regular visitors never load tweakpane
      const { Pane } = await import("tweakpane");
      this.ui = new Pane({ title: "Parameters" });
    }
  }
}
