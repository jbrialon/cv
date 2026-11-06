import * as THREE from "three/webgpu";

import EventEmitter from "./event-emitter.js";

export default class Resources extends EventEmitter {
  constructor(sources) {
    super();

    // Options
    this.sources = sources;

    // Setup
    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {};
    this.loaders.textureLoader = new THREE.TextureLoader();

    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
  }

  startLoading() {
    for (const source of this.sources) {
      if (source.type === "texture") {
        this.loaders.textureLoader.load(
          source.path,
          (file) => {
            this.sourceLoaded(source, file);
          },
          (progress) => this.onProgress(progress),
          (error) => this.onError(error, source),
        );
      } else if (source.type === "cubeTexture") {
        this.loaders.cubeTextureLoader.load(
          source.path,
          (file) => {
            this.sourceLoaded(source, file);
          },
          (progress) => this.onProgress(progress),
          (error) => this.onError(error, source),
        );
      } else if (source.type === "image") {
        this.loadImage(source);
      }
    }
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file;
    this.loaded++;

    if (this.loaded === this.toLoad) {
      this.trigger("ready");
    }
  }

  loadImage(source) {
    let image = new Image();

    image.onload = () => {
      this.sourceLoaded(source, image);
    };

    image.onerror = (error, source) => {
      this.onError(error, source);
    };

    image.src = source.path;
  }

  onProgress(progress) {
    // console.log(progress);
  }

  onError(error, source) {
    console.log(error, source);
  }
}
