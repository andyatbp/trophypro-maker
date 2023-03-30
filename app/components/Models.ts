import { path2 } from "@jscad/modeling/src/geometries";
import { union } from "@jscad/modeling/src/operations/booleans";
import {
  extrudeLinear,
  extrudeRectangular,
  extrudeRotate,
} from "@jscad/modeling/src/operations/extrusions";
import {
  rotate,
  scale,
  translate,
  translateX,
  translateY,
} from "@jscad/modeling/src/operations/transforms";
const { TAU } = require("@jscad/modeling").maths.constants;

import { Vec3 } from "@jscad/modeling/src/maths/vec3";
import { measureCenter } from "@jscad/modeling/src/measurements";
import { translateZ } from "@jscad/modeling/src/operations/transforms";
import {
  circle,
  cuboid,
  cylinder,
  cylinderElliptic,
  polygon,
  sphere,
  square,
} from "@jscad/modeling/src/primitives";
import { vectorText } from "@jscad/modeling/src/text";
import { BoardProLogo } from "~/assets/logo-points";

export interface TrophyParameters {
  name?: string;
  vertices: number;
  height: number;
}

export const paramConfiguration = {
  scale: {
    value: 0.5,
    min: 0.3,
    max: 2,
    step: 0.1,
  },
  baseWidth: {
    value: 50,
    min: 30,
    max: 70,
    step: 2,
  },
  baseLength: {
    value: 70,
    min: 50,
    max: 90,
    step: 2,
  },
  baseHeight: {
    value: 20,
    min: 10,
    max: 30,
    step: 2,
  },
  neckHeight: {
    value: 30,
    min: 10,
    max: 90,
    step: 2,
  },
  neckSize: {
    value: 10,
    min: 6,
    max: 20,
    step: 2,
  },
  bodyTopRadius: {
    value: 30,
    min: 10,
    max: 90,
    step: 5,
  },
  bodyBottomRadius: {
    value: 30,
    min: 10,
    max: 90,
    step: 5,
  },
  bodyHeight: {
    value: 50,
    min: 20,
    max: 90,
    step: 5,
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

const getNeck = ({ size, height, bottomHeight }: any) => {
  return union(
    translateZ(
      bottomHeight + height / 2,
      cylinder({ height: height, radius: size })
    ),
    translateZ(
      bottomHeight / 2,
      cylinder({ height: bottomHeight, radius: size + bottomHeight })
    )
  );
};

const getNeck2 = ({ size, height, bottomHeight }: any) => {
  return union(
    translateZ(
      bottomHeight,
      extrudeRectangular(
        { size: 1, height: height, twistAngle: TAU / 2 },
        square({ size: size })
      )
    ),
    translateZ(
      bottomHeight / 2,
      cylinder({ height: bottomHeight, radius: size + bottomHeight })
    )
  );
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

const getBody2 = ({ bottomRadius, topRadius, height }: any) => {
  const p = 2;
  return [
    translateZ(
      bottomRadius,
      union(
        sphere({ radius: bottomRadius }),
        translateZ(
          height / 2,
          cylinderElliptic({
            height: height,
            startRadius: [bottomRadius, bottomRadius],
            endRadius: [topRadius, topRadius],
          })
        ),
        translateZ(
          height + p / 2,
          cylinderElliptic({
            height: p,
            startRadius: [topRadius + 2, topRadius + 2],
            endRadius: [topRadius + 2, topRadius + 2],
          })
        ),
        //right hand
        translate(
          [0, bottomRadius-p, height / 2],
          rotate(
            [0, TAU / 4, 0],
            extrudeRotate(
              { segments: 32, angle: TAU / 2 },
              circle({
                radius: 4,
                center: [8, 0],
                startAngle: 0,
                endAngle: 360,
              })
            )
          )
        ),
        //right hand
        translate(
          [0, -bottomRadius+p, height / 2],
          rotate(
            [0, TAU / 4, TAU/2],
            extrudeRotate(
              { segments: 32, angle: TAU / 2 },
              circle({
                radius: 4,
                center: [8, 0],
                startAngle: 0,
                endAngle: 360,
              })
            )
          )
        )
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

const getLogo = () => {
  const logo = scale(
    [0.1, 0.1, 0.1],
    extrudeLinear({ height: 10 }, polygon({ points: BoardProLogo }))
  );

  let center = measureCenter(logo);
  return rotate(
    [-90, 0, 0],
    translate([center[0] * -1, center[1] * -1, 0], logo)
  );
};

const getTrophy = (params: TrophyProps) => {
  const scale = params.scale;

  const base = getBase({
    w: params.baseWidth * scale,
    l: params.baseLength * scale,
    h: params.baseHeight * scale,
    padding: 2 * scale,
    bottomLayerHeight: 2 * scale,
  });

  const neck = translateZ(
    params.baseHeight * scale,
    getNeck({
      size: params.neckSize * scale,
      height: params.neckHeight * scale,
      bottomHeight: 6 * scale,
    })
  );

  const body = translateZ(
    (params.baseHeight + params.neckHeight) * scale,
    getBody2({
      bottomRadius: params.bodyBottomRadius * scale,
      topRadius: params.bodyTopRadius * scale,
      height: params.bodyHeight * scale,
    })
  );

  // return [
  //   rotate(
  //     [0, TAU/4, 0],
  //     extrudeRotate(
  //       { segments: 32, angle: TAU / 2 },
  //       circle({ radius: 4, center: [8, 0], startAngle: 0, endAngle: 360 })
  //     )
  //   ),
  // ];

  return [union(base, neck, body)];
};

export { getTrophy };
