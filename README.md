# cv

My resume, built with Astro.

The page is plain static HTML. On top of that there's a small three.js island running on WebGPU, just for looks. If the browser doesn't support WebGPU (or JS is off), you still get the full resume, only without the 3D part.

## Run it

```sh
npm install
npm run dev
```

Then open `localhost:4321`.

`npm run build` outputs the static site to `dist/`.
