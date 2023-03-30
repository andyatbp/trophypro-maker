import { colorize } from "@jscad/modeling/src/colors";
import { path2 } from "@jscad/modeling/src/geometries";
import { union } from "@jscad/modeling/src/operations/booleans";
import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";
import { cncVectorFont } from "~/fonts/cncVector";

import {
  cube,
  cuboid,
  cylinder,
  cylinderElliptic,
  ellipsoid,
  square,
  star,
} from "@jscad/modeling/src/primitives";
import { vectorText } from "@jscad/modeling/src/text";
import { Vec3 } from "@jscad/modeling/src/maths/vec3";
import { translateZ } from "@jscad/modeling/src/operations/transforms";

export interface TrophyParameters {
  name?: string;
  vertices: number;
  height: number;
}

export const paramConfiguration = {
  scale: {
    value: 0.5,
    min: 0.2,
    max: 2,
    step: 0.1,
  },
  baseWidth: {
    value: 50,
    min: 30,
    max: 70,
    step: 5,
  },
  baseLength: {
    value: 70,
    min: 50,
    max: 90,
    step: 5,
  },
  baseHeight: {
    value: 20,
    min: 10,
    max: 30,
    step: 5,
  },
  neckHeight: {
    value: 30,
    min: 10,
    max: 50,
    step: 5,
  },
  neckSize: {
    value: 10,
    min: 2,
    max: 20,
    step: 2,
  },
  bodyTopRadius: {
    value: 70,
    min: 50,
    max: 90,
    step: 5,
  },
  bodyBottomRadius: {
    value: 30,
    min: 10,
    max: 50,
    step: 5,
  },
  bodyHeight: {
    value: 50,
    min: 30,
    max: 70,
    step: 5,
  },

  name: "World",
  vertices: {
    value: 6,
    min: 5,
    max: 10,
    step: 1,
  },
  height: {
    value: 10,
    max: 20,
    min: 3,
    step: 1,
  },
};

// interface BaseProps {

// }

interface TrophyProps {
  scale: number;
  baseWidth: number;
  baseLength: number;
  baseHeight: number;
  neckSize: number;
  neckHeight: number;
  bodyTopRadius: number;
  bodyBottomRadius: number;
  bodyHeight: number;
}

const getBase = ({ w, l, h, padding, bottomLayerHeight }: any) => {
  // const padding = 2 * s;
  // const bottomHeight = 2 * s;
  const c: Vec3 = [0, 0, 0];
  return union(
    translateZ(
      h / 2 + bottomLayerHeight,
      cuboid({ size: [w - padding, l - padding, h], center: c })
    ), //top
    translateZ(
      bottomLayerHeight / 2,
      cuboid({ size: [w, l, bottomLayerHeight], center: c })
    )
  );
};

const getNeck = ({ size, height }: any) => {
  return cylinder({ height: height, radius: size });
};

const getBody = ({ bottomRadius, topRadius, height }: any) => {
  return [
    translateZ(
      height / 2,
      union(
        //endRadius is on the top
        cylinderElliptic({
          height,
          startRadius: [bottomRadius, bottomRadius],
          endRadius: [topRadius, topRadius],
        })
      )
    ),
  ];
};

const segmentToPath = (segment: any) => {
  return path2.fromPoints({ closed: true }, segment);
};

const getWinnerName = (name: string) => {
  // let textSegments = vectorText("ABCD");
  // const outlines = vectorText({height: 42, align: 'right', font: myfont}, 'JSCAD\nROCKS!!')

  const outlines = vectorText(
    { yOffset: 0, height: 10, extrudeOffset: 5 },
    "0"
  );
  const paths = outlines.map((segment) => {
    return segmentToPath(segment);
  });
  console.log("paths", paths);
  return [extrudeLinear({ height: 10 }, paths)];
};

const getTrophy = (params: TrophyProps) => {
  const models = [];

  // models.push(cube({ size: 12, center: [0, 0, 6] }));
  // models.push(colorize([1, 0, 0], sphere({ radius: 6 })));
  // models.push(extrudeLinear({ height: 10 }, circle({ radius: 10 })));

  const scale = params.scale;

  const base = getBase({
    w: params.baseWidth * scale,
    l: params.baseLength * scale,
    h: params.baseHeight * scale,
    padding: 2 * scale,
    bottomLayerHeight: 2 * scale,
  });

  const neck = translateZ(
    (params.baseHeight + params.neckHeight / 2) * scale,
    getNeck({
      size: params.neckSize * scale,
      height: params.neckHeight * scale,
    })
  );

  const body = translateZ(
    (params.baseHeight + params.neckHeight) * scale,
    getBody({
      bottomRadius: params.bodyBottomRadius * scale,
      topRadius: params.bodyTopRadius * scale,
      height: params.bodyHeight * scale,
    })
  );
  // translateZ(params.baseHeight + params.neckHeight / 2, neck);

  models.push(
    // extrudeLinear({ height }, star({ vertices, outerRadius: 10 })),
    ellipsoid({ radius: [5, 10, 20] })
  );
  return [
    base,
    neck,
    body,
    // ...getBody({ bottomSize: 1, topSize: 1, size: 1 }),
    // getWinnerName("Hello"),
    // models,
    // extrudeLinear(
    //   { height: 10 },
    //   colorize(
    //     [0, 0, 0, 1],
    //     path2.fromPoints({ closed: true }, [
    //       [0, 0],
    //       [4, 0],
    //       [4, 3],
    //     ])
    //   )
    // ),
  ];
};

export { getTrophy };
