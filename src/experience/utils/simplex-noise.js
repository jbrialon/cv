import {
  Fn,
  abs,
  dot,
  float,
  floor,
  max,
  min,
  mod,
  step,
  vec3,
  vec4,
} from "three/tsl";

// 3D simplex noise by Ashima Arts / Stefan Gustavson, returns roughly -1 to 1
const permute = (value) => mod(value.mul(34.0).add(1.0).mul(value), 289.0);

const taylorInverseSquareRoot = (value) =>
  float(1.79284291400159).sub(value.mul(0.85373472095314));

export const simplexNoise3d = Fn(([position]) => {
  // which skewed cell the position falls in
  const cell = floor(position.add(dot(position, vec3(1.0 / 3.0)))).toVar();
  const toCorner0 = position.sub(cell).add(dot(cell, vec3(1.0 / 6.0)));

  // the cell is a cube cut into 6 tetrahedrons, find which one we are in
  const cornerStep = step(toCorner0.yzx, toCorner0.xyz);
  const inverseStep = cornerStep.oneMinus();
  const secondCorner = min(cornerStep.xyz, inverseStep.zxy);
  const thirdCorner = max(cornerStep.xyz, inverseStep.zxy);

  const toCorner1 = toCorner0.sub(secondCorner).add(1.0 / 6.0);
  const toCorner2 = toCorner0.sub(thirdCorner).add(2.0 / 6.0);
  const toCorner3 = toCorner0.sub(0.5);

  // pseudo random number for each corner
  cell.assign(mod(cell, 289.0));
  const hashes = permute(
    permute(
      permute(vec4(0.0, secondCorner.z, thirdCorner.z, 1.0).add(cell.z))
        .add(cell.y)
        .add(vec4(0.0, secondCorner.y, thirdCorner.y, 1.0)),
    )
      .add(cell.x)
      .add(vec4(0.0, secondCorner.x, thirdCorner.x, 1.0)),
  );

  // turn each random number into a gradient direction
  const wrappedHashes = hashes.sub(floor(hashes.div(49.0)).mul(49.0));
  const gradientColumns = floor(wrappedHashes.div(7.0));
  const gradientRows = floor(wrappedHashes.sub(gradientColumns.mul(7.0)));

  const gradientX = gradientColumns.mul(2.0 / 7.0).sub(13.0 / 14.0);
  const gradientY = gradientRows.mul(2.0 / 7.0).sub(13.0 / 14.0);
  const gradientZ = float(1.0).sub(abs(gradientX)).sub(abs(gradientY));

  const packedXY0 = vec4(gradientX.xy, gradientY.xy);
  const packedXY1 = vec4(gradientX.zw, gradientY.zw);

  const signs0 = floor(packedXY0).mul(2.0).add(1.0);
  const signs1 = floor(packedXY1).mul(2.0).add(1.0);
  const negativeZ = step(gradientZ, vec4(0.0)).negate();

  const adjusted0 = packedXY0.xzyw.add(signs0.xzyw.mul(negativeZ.xxyy));
  const adjusted1 = packedXY1.xzyw.add(signs1.xzyw.mul(negativeZ.zzww));

  const gradient0 = vec3(adjusted0.xy, gradientZ.x).toVar();
  const gradient1 = vec3(adjusted0.zw, gradientZ.y).toVar();
  const gradient2 = vec3(adjusted1.xy, gradientZ.z).toVar();
  const gradient3 = vec3(adjusted1.zw, gradientZ.w).toVar();

  const lengthFix = taylorInverseSquareRoot(
    vec4(
      dot(gradient0, gradient0),
      dot(gradient1, gradient1),
      dot(gradient2, gradient2),
      dot(gradient3, gradient3),
    ),
  );
  gradient0.mulAssign(lengthFix.x);
  gradient1.mulAssign(lengthFix.y);
  gradient2.mulAssign(lengthFix.z);
  gradient3.mulAssign(lengthFix.w);

  // each corner fades out with distance, then all 4 are added up
  const falloff = max(
    float(0.6).sub(
      vec4(
        dot(toCorner0, toCorner0),
        dot(toCorner1, toCorner1),
        dot(toCorner2, toCorner2),
        dot(toCorner3, toCorner3),
      ),
    ),
    0.0,
  );
  const squaredFalloff = falloff.mul(falloff);

  return dot(
    squaredFalloff.mul(squaredFalloff),
    vec4(
      dot(gradient0, toCorner0),
      dot(gradient1, toCorner1),
      dot(gradient2, toCorner2),
      dot(gradient3, toCorner3),
    ),
  ).mul(42.0);
}).setLayout({
  name: "simplexNoise3d",
  type: "float",
  inputs: [{ name: "position", type: "vec3" }],
});
