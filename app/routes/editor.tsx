import { Link } from "@remix-run/react";
import { useControls } from "leva";
import React from "react";
import ModelPreview from "~/components/ModelPreview";
import { getSimpleModel, TrophyParameters } from "~/components/Models";
import ParameterPanel from "~/components/ParameterPanel";
import LevaConfig from "~/LevaConfig";

export default function Editor() {
  const params = useControls({ name: "World", vertices: 2, height: 1 });

  return (
    <div className="h-full">
      <header><Link to={'/'}>Logo</Link></header>
      <div className="flex flex-col">
        <div>
          <ModelPreview models={getSimpleModel(params)} />
        </div>
        <div>
          {/* <ParameterPanel /> */}
          <LevaConfig />
        </div>
      </div>
      <footer>copy right</footer>
    </div>
  );
}
