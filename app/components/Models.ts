import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";
import { star } from "@jscad/modeling/src/primitives";

export interface TrophyParameters {
  name?: string;
  vertices: number;
  height: number;
}

const getSimpleModel = (
  { vertices, height }: TrophyParameters = { vertices: 0, height: 10 }
) => {
  const models = [];

  // models.push(cube({ size: 12, center: [0, 0, 6] }));
  // models.push(colorize([1, 0, 0], sphere({ radius: 6 })));
  // models.push(extrudeLinear({ height: 10 }, circle({ radius: 10 })));
  models.push(
    extrudeLinear({ height }, star({ vertices, outerRadius: 10 }))
  );
  return models;
};
export { getSimpleModel };
