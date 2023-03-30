import { Link } from "@remix-run/react";
import { useControls } from "leva";
import ModelPreview from "~/components/ModelPreview";
import { getTrophy, paramConfiguration } from "~/components/Models";
import LevaConfig from "~/LevaConfig";
import { saveSTL } from "~/utils/jscad-utils";

export default function Editor() {
  const params = useControls(paramConfiguration);

  return (
    <div className="h-full">
      <header className="h-12 bg-slate-100">
        <div className="flex flex-row justify-between p-4">
          <Link to={"/"}>Logo</Link>
          <button
            onClick={() => {
              saveSTL("your-trophy", getTrophy(params));
            }}
          >
            Download STL
          </button>
        </div>
      </header>
      <div className="flex flex-col p-8">
        <div>
          <ModelPreview models={getTrophy(params)} />
        </div>
        <div style={{ height: "40vh", overflowY: "scroll" }}>
          <LevaConfig />
        </div>
      </div>
      <footer className="mt-4 flex justify-end">
        <span>2023 copyright</span>
      </footer>
    </div>
  );
}
