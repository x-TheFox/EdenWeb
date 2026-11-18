import { Composition } from "remotion";
import { BuildUpdates } from "./BuildUpdates";

export const Root = () => (
  <Composition id="BuildUpdates" component={BuildUpdates} durationInFrames={420} fps={30} width={1280} height={800} />
);
