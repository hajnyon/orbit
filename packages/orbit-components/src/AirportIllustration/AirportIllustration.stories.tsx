import React from "react";
import { select, text } from "@storybook/addon-knobs";

import { NAMES } from "./consts.mts";
import { allModes } from "../../.storybook/modes";
import { SIZE_OPTIONS } from "../primitives/IllustrationPrimitive";
import SPACINGS_AFTER from "../common/getSpacingToken/consts";
import IllustrationPrimitiveList from "../primitives/IllustrationPrimitive/IllustrationPrimitiveList";
import type { Name } from "./types";

import AirportIllustration from ".";

export default {
  title: "AirportIllustration",
};

export const Playground = () => {
  const size = select("Size", Object.values(SIZE_OPTIONS), SIZE_OPTIONS.MEDIUM);
  const name = select("Name", NAMES, "BGYFastTrack") as Name;
  const dataTest = text("dataTest", "test");
  const alt = text("alt", "null");
  const spaceAfter = select("spaceAfter", Object.values(SPACINGS_AFTER), SPACINGS_AFTER.SMALL);
  return (
    <AirportIllustration
      size={size}
      name={name}
      dataTest={dataTest}
      spaceAfter={spaceAfter}
      alt={alt}
    />
  );
};

Playground.story = {
  parameters: {
    info: "Explore our new set of Airportillustrations for Kiwi.com.",
  },
};

export const AirportIllustrationVisualTest = () => {
  return <IllustrationPrimitiveList nameOfComponent="AirportIllustration" images={NAMES} />;
};

AirportIllustrationVisualTest.story = {
  name: "List of all AirportIllustrations",

  parameters: {
    info: "Explore our new set of Airportillustrations for Kiwi.com.",
    chromatic: {
      disableSnapshot: false,
      modes: {
        largeDesktop: allModes.largeDesktop,
      },
    },
  },
};
