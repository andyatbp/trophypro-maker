import React, { lazy, Suspense } from "react";
import { getSimpleModel } from "./Models";

// lazy load to reduce the loading time
const Renderer = lazy(() =>
  import("jscad-react").then((lib) => {
    return { default: lib.default.Renderer };
  })
);

interface PreviewProp {
  models: any[];
}

let isHydrating = true;

export default function ModelPreview({ models }: PreviewProp) {
  const [isHydrated, setIsHydrated] = React.useState(!isHydrating);

  React.useEffect(() => {
    isHydrating = false;
    setIsHydrated(true);
  }, []);

  const renderLoader = () => <div>loading...</div>;

  // Make sure is in client side
  if (isHydrated) {
    return (
      <div title="JSCad Rendering Test">
        {/* https://web.dev/code-splitting-suspense/ */}
        <Suspense fallback={renderLoader()}>
          <Renderer solids={models} height={500} width={800} />
        </Suspense>
      </div>
    );
  } else {
    return <h1>loading</h1>;
  }
}
