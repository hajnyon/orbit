import * as React from "react";
import { select, text } from "@storybook/addon-knobs";

import { NAMES } from "./consts.mts";
import { SIZE_OPTIONS } from "../primitives/IllustrationPrimitive";
import IllustrationPrimitiveList from "../primitives/IllustrationPrimitive/IllustrationPrimitiveList";
import type { Name } from "./types";

import Illustration from ".";

export default {
  title: "Illustration",
};

export const Playground = () => {
  const size = select("Size", Object.values(SIZE_OPTIONS), SIZE_OPTIONS.MEDIUM);
  const name = select("Name", Object.values(NAMES), "Accommodation") as Name;
  const dataTest = text("dataTest", "test");
  const alt = text("alt", "");
  return (
    <Illustration size={size} name={name} dataTest={dataTest} margin={{ bottom: 12 }} alt={alt} />
  );
};

Playground.story = {
  parameters: {
    info: "Explore our new set of illustrations for Kiwi.com.",
  },
};

export const ListOfAllIllustrations = () => {
  return <IllustrationPrimitiveList nameOfComponent="Illustration" images={NAMES} />;
};

ListOfAllIllustrations.story = {
  name: "List of all Illustrations",

  parameters: {
    info: "Explore our new set of illustrations for Kiwi.com.",
  },
};

export const VisualTest = () => {
  return (
    <div className="space-y-xs">
      <div className="space-x-xs flex">
        {Object.values(SIZE_OPTIONS).map(size => (
          <Illustration name="Accommodation" size={size} />
        ))}
      </div>

      {NAMES.map(name => (
        <Illustration name={name} />
      ))}
    </div>
  );
};

VisualTest.story = {
  parameters: {
    chromatic: { disableSnapshot: false },
  },
};
