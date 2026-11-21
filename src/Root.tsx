import React from "react";
import { Composition } from "remotion";
import { Babak1 } from "./Babak1";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PriaKapak"
        component={Babak1}
        durationInFrames={5910}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
