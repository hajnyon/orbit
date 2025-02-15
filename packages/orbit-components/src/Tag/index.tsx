"use client";

import * as React from "react";
import styled, { css } from "styled-components";

import type * as Common from "../common/types";
import type { Theme } from "../defaultTheme";
import defaultTheme from "../defaultTheme";
import { left } from "../utils/rtl";
import CloseCircle from "../icons/CloseCircle";
import { SIZES, STATES, TYPES } from "./consts";
import KEY_CODE_MAP from "../common/keyMaps";
import resolveColor from "./helpers/resolveColor";
import resolveCircleColor from "./helpers/resolveCircleColor";
import mq from "../utils/mediaQuery";
import type { Props, Type } from "./types";

const getFontSize = ({ theme, size }: { theme: Theme; size: Props["size"] }): string | null => {
  const tokens = {
    [SIZES.SMALL]: theme.orbit.fontSizeTextSmall,
    [SIZES.NORMAL]: theme.orbit.fontSizeTextNormal,
  };

  if (!size) return null;

  return tokens[size];
};

const getBackgroundColor =
  (state: string) =>
  ({ type, dateTag }: { type: Type; size: Props["size"]; dateTag?: boolean }): string => {
    const states = {
      [TYPES.COLORED]: {
        [STATES.DEFAULT]: resolveColor({
          selected: dateTag ? "paletteInkLightHover" : "paletteBlueNormal",
          removable: "paletteBlueLight",
          normal: "paletteBlueLight",
        }),
        [STATES.HOVER]: resolveColor({
          selected: dateTag ? "paletteInkLightActive" : "paletteBlueNormalHover",
          removable: "paletteBlueLightHover",
          normal: "paletteBlueLightHover",
        }),
        [STATES.ACTIVE]: resolveColor({
          selected: dateTag ? "paletteInkLightHover" : "paletteBlueNormalActive",
          removable: "paletteBlueLightActive",
          normal: "paletteBlueLightActive",
        }),
      },
      [TYPES.NEUTRAL]: {
        [STATES.DEFAULT]: resolveColor({
          selected: dateTag ? "paletteInkLightHover" : "paletteBlueNormal",
          removable: "paletteCloudNormal",
          normal: "paletteCloudNormal",
        }),
        [STATES.HOVER]: resolveColor({
          selected: dateTag ? "paletteInkLightActive" : "paletteBlueNormalHover",
          removable: "paletteCloudNormalHover",
          normal: "paletteCloudNormalHover",
        }),
        [STATES.ACTIVE]: resolveColor({
          selected: dateTag ? "paletteInkLightHover" : "paletteBlueNormalActive",
          removable: "paletteCloudNormalActive",
          normal: "paletteCloudNormalActive",
        }),
      },
    };
    return states[type][state];
  };

const getLineHeight = ({ theme, size }: { theme: Theme; size: Props["size"] }): string | null => {
  const tokens = {
    [SIZES.SMALL]: theme.orbit.lineHeightTextSmall,
    [SIZES.NORMAL]: theme.orbit.lineHeightTextNormal,
  };

  if (!size) return null;

  return tokens[size];
};

const CloseContainer = styled.div<{
  actionable?: boolean;
  type: Type;
  selected?: boolean;
  removable?: boolean;
}>`
  ${({ theme, actionable, type, selected }) => css`
    display: flex;
    margin-${left}: ${theme.orbit.spaceXSmall};
    opacity: ${selected ? "1" : "0.5"};
    color: ${resolveColor({
      selected: "paletteWhite",
      removable: type === TYPES.NEUTRAL ? "paletteInkNormal" : "paletteBlueDarker",
      normal: "paletteInkLink",
    })};
    cursor: ${actionable && `pointer`};
    transition: all ${theme.orbit.durationFast} ease-in-out;

    &:active {
      color: ${resolveCircleColor};
    }
  `};
`;

CloseContainer.defaultProps = {
  theme: defaultTheme,
};

export const StyledTag = styled.div<{
  selected?: boolean;
  actionable?: boolean;
  type: Type;
  size: Props["size"];
  dateTag?: boolean;
  removable?: boolean;
}>`
  ${({ theme, actionable, type }) => css`
    font-family: ${theme.orbit.fontFamily};
    color: ${resolveColor({
      selected: "paletteWhite",
      removable: type === TYPES.NEUTRAL ? "paletteInkDark" : "paletteBlueDarker",
      normal: type === TYPES.NEUTRAL ? "paletteInkDark" : "paletteBlueDarker",
    })};
    background: ${getBackgroundColor(STATES.DEFAULT)};
    display: inline-flex;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    line-height: ${getLineHeight};
    font-size: ${getFontSize};
    font-weight: ${theme.orbit.fontWeightMedium};
    border-radius: ${theme.orbit.borderRadiusLarge};
    padding: ${theme.orbit.spaceXSmall};
    transition: color ${theme.orbit.durationFast} ease-in-out,
      box-shadow ${theme.orbit.durationFast} ease-in-out,
      background ${theme.orbit.durationFast} ease-in-out;

    ${mq.tablet(css`
      border-radius: ${theme.orbit.borderRadiusNormal};
    `)}

    ${actionable &&
    css`
      cursor: pointer;

      &:hover,
      &:focus-visible {
        background: ${getBackgroundColor(STATES.HOVER)};
        box-shadow: none;
      }

      &:focus {
        background: ${getBackgroundColor(STATES.HOVER)};
      }

      &:active {
        ${CloseContainer} {
          opacity: 1;
        }
        background: ${getBackgroundColor(STATES.ACTIVE)};
      }

      &:focus:not(:focus-visible):not(:active) {
        background: ${getBackgroundColor(STATES.HOVER)};
      }
    `};
  `}
`;

StyledTag.defaultProps = {
  theme: defaultTheme,
};

const StyledClose = styled.div`
  display: flex;
  border-radius: 100%;

  &:focus {
    ${CloseContainer} {
      opacity: 1;
    }
  }
`;

StyledClose.defaultProps = {
  theme: defaultTheme,
};

const StyledIconContainer = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding-right: ${theme.orbit.spaceXSmall};

    svg {
      width: ${theme.orbit.widthIconSmall};
      height: ${theme.orbit.heightIconSmall};
    }
  `}
`;

StyledIconContainer.defaultProps = {
  theme: defaultTheme,
};

const buttonClickEmulation =
  (callback?: Common.Callback) => (ev?: React.KeyboardEvent<HTMLDivElement>) => {
    if (ev && ev.keyCode === KEY_CODE_MAP.SPACE) {
      ev.preventDefault();
      if (callback) callback();
    } else if (ev && ev.keyCode === KEY_CODE_MAP.ENTER) {
      if (callback) callback();
    }
  };

const Tag = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      selected,
      children,
      iconLeft,
      size = SIZES.NORMAL,
      onClick,
      onRemove,
      id,
      dataTest,
      type = TYPES.NEUTRAL,
      dateTag,
    },
    ref,
  ) => {
    return (
      <StyledTag
        className="orbit-tag"
        actionable={!!(onClick || onRemove)}
        data-test={dataTest}
        id={id}
        dateTag={dateTag}
        size={size}
        ref={ref}
        type={type}
        onClick={onClick}
        removable={!!onRemove}
        selected={selected}
        tabIndex={(onClick || onRemove) && 0}
        role="button"
        onKeyDown={buttonClickEmulation(onClick)}
      >
        {iconLeft && <StyledIconContainer>{iconLeft}</StyledIconContainer>}
        {children}
        {onRemove && (
          <CloseContainer
            selected={selected}
            removable={!!onRemove}
            type={type}
            onClick={ev => {
              ev.stopPropagation();
              if (onRemove) onRemove();
            }}
          >
            <StyledClose
              tabIndex={0}
              aria-label="close"
              role="button"
              onKeyDown={ev => {
                ev.stopPropagation();
                buttonClickEmulation(onRemove);
              }}
            >
              <CloseCircle size="small" />
            </StyledClose>
          </CloseContainer>
        )}
      </StyledTag>
    );
  },
);

export default Tag;
