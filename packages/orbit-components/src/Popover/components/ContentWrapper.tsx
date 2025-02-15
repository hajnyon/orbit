import * as React from "react";
import styled, { css } from "styled-components";
import { convertHexToRgba } from "@kiwicom/orbit-design-tokens";
import { usePopper } from "react-popper";
import type { Placement } from "@popperjs/core/lib/enums";

import type * as Common from "../../common/types";
import defaultTheme from "../../defaultTheme";
import mq from "../../utils/mediaQuery";
import Button from "../../Button";
import useMediaQuery from "../../hooks/useMediaQuery";
import transition from "../../utils/transition";
import useClickOutside from "../../hooks/useClickOutside";
import useLockScrolling from "../../hooks/useLockScrolling";
import { ModalContext } from "../../Modal/ModalContext";
import { PLACEMENTS } from "../../common/consts";
import boundingClientRect from "../../utils/boundingClientRect";
import type { Offset } from "../types";

const mobileTop = ({ theme }) => theme.orbit.spaceXLarge;
const popoverPadding = ({ theme }) => theme.orbit.spaceMedium;

export interface Props extends Common.Globals {
  children: React.ReactNode;
  closeText?: React.ReactNode;
  referenceElement: HTMLElement | null;
  placement: Placement;
  width?: string;
  zIndex?: number;
  maxHeight?: string;
  noFlip?: boolean;
  allowOverflow?: boolean;
  noPadding?: boolean;
  overlapped?: boolean;
  shown: boolean;
  fixed?: boolean;
  labelClose?: React.ReactNode;
  lockScrolling?: boolean;
  actions?: React.ReactNode;
  offset?: Offset;
  onClose: (ev?: MouseEvent | React.SyntheticEvent<HTMLElement>) => void;
}

const StyledContentWrapper = styled.div<{
  maxHeight?: string;
  windowHeight?: number | null;
  actionsHeight?: number | null;
}>`
  ${({ theme, windowHeight, actionsHeight, maxHeight }) => css`
    overflow: auto;
    border-top-left-radius: ${theme.orbit.spaceSmall};
    border-top-right-radius: ${theme.orbit.spaceSmall};
    position: absolute;
    left: 0;
    width: 100%;
    background-color: ${theme.orbit.paletteWhite};
    max-height: ${windowHeight && actionsHeight && windowHeight - actionsHeight - 32}px;
    bottom: ${actionsHeight || 0}px;

    ${mq.largeMobile(css`
      max-height: ${maxHeight || "100%"};
      border-radius: ${theme.orbit.borderRadiusNormal};
      bottom: auto;
      left: auto;
      position: relative;
    `)}
  `}
`;

StyledContentWrapper.defaultProps = {
  theme: defaultTheme,
};

const StyledActions = styled.div`
  ${({ theme }) => css`
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    padding: ${popoverPadding};
    padding-top: ${theme.orbit.spaceSmall};
    background-color: ${theme.orbit.paletteWhite};
    .orbit-button-primitive {
      width: 100%;
      flex: 1 1 auto;
    }
    ${mq.largeMobile(css`
      position: relative;
      bottom: auto;
      left: auto;
      border-bottom-left-radius: ${theme.orbit.borderRadiusNormal};
      border-bottom-right-radius: 3px;
      .orbit-button-primitive {
        width: auto;
        flex-grow: 0;
      }
    `)};
  `}
`;

StyledActions.defaultProps = {
  theme: defaultTheme,
};

const StyledPopoverParent = styled.div<{
  isInsideModal?: boolean;
  width?: string | number;
  shown?: boolean;
  fixed?: boolean;
  $zIndex?: number;
  transform?: string;
  overlapped?: boolean;
  noPadding?: boolean;
  top?: string | number;
  left?: string | number;
  bottom?: string | number;
  right?: string | number;
  position?: string;
}>`
  ${({
    isInsideModal,
    width,
    shown,
    theme,
    transform,
    top,
    left,
    bottom,
    right,
    position,
    $zIndex,
  }) => css`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: auto;
    width: 100%;
    z-index: 1000;
    box-sizing: border-box;
    box-shadow: ${theme.orbit.boxShadowRaisedReverse};
    background-color: ${theme.orbit.backgroundModal};
    max-height: calc(100% - ${mobileTop});
    &:focus {
      outline: 0;
    }

    ${mq.largeMobile(css`
      top: ${top};
      left: ${left};
      bottom: ${bottom};
      right: ${right};
      transform: ${transform};
      transition: ${transition(["opacity"], "fast", "ease-in-out")};
      position: ${position};
      z-index: ${isInsideModal ? "1000" : $zIndex};
      width: ${width ? `${width}` : "auto"};
      border-radius: ${theme.orbit.borderRadiusNormal};
      box-shadow: ${theme.orbit.boxShadowRaised};
      opacity: ${shown ? "1" : "0"};
      max-height: none;
    `)}
  `}
`;

StyledPopoverParent.defaultProps = {
  theme: defaultTheme,
};

const StyledPopoverPadding = styled.div<{ noPadding?: boolean }>`
  padding: ${({ noPadding }) => (noPadding ? 0 : popoverPadding)};
`;

StyledPopoverPadding.defaultProps = {
  theme: defaultTheme,
};

const StyledPopoverContent = styled.div<{ shownMobile?: boolean }>`
  ${({ shownMobile }) => css`
    transform: translateY(${shownMobile ? "0%" : "100%"});
    will-change: transform;
    transition: ${transition(["opacity, transform"], "fast", "ease-in-out")};

    ${mq.largeMobile(css`
      transform: none;
      transition: none;
    `)}
  `}
`;

StyledPopoverContent.defaultProps = {
  theme: defaultTheme,
};

const StyledOverlay = styled.div<{ shown?: boolean }>`
  ${({ theme, shown }) => css`
    display: block;
    position: fixed;
    opacity: ${shown ? "1" : "0"};
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-color: ${convertHexToRgba(theme.orbit.paletteInkDark, 60)};
    transition: ${transition(["opacity", "transform"], "normal", "ease-in-out")};
    z-index: 999;

    ${mq.largeMobile(css`
      display: none;
    `)};
  `}
`;

StyledOverlay.defaultProps = {
  theme: defaultTheme,
};

const StyledPopoverClose = styled.div`
  padding: ${popoverPadding};
  ${mq.largeMobile(css`
    display: none;
    visibility: hidden;
    padding-bottom: 0;
  `)}
`;

StyledPopoverClose.defaultProps = {
  theme: defaultTheme,
};

const PopoverContentWrapper = ({
  children,
  onClose,
  zIndex = 710,
  labelClose,
  width,
  maxHeight,
  noFlip,
  offset = { top: 4, left: 0 },
  referenceElement,
  dataTest,
  id,
  placement = PLACEMENTS.BOTTOM_START,
  noPadding,
  overlapped,
  shown,
  fixed,
  allowOverflow,
  lockScrolling = true,
  actions,
}: Props) => {
  const [actionsHeight, setActionsHeight] = React.useState<number | null>(null);
  const { isInsideModal } = React.useContext(ModalContext);
  const { isLargeMobile } = useMediaQuery();
  const actionsRef = React.useRef<HTMLDivElement | null>(null);
  const content = React.useRef<HTMLDivElement | null>(null);
  const scrollingElementRef = React.useRef<HTMLDivElement | null>(null);
  useLockScrolling(scrollingElementRef, lockScrolling && !isLargeMobile);

  const popoverRef = React.useRef<HTMLDivElement | null>(null);
  const windowHeight = typeof window !== "undefined" ? window.innerHeight : 0;

  const { styles, update } = usePopper(referenceElement, popoverRef.current, {
    placement,
    strategy: fixed ? "fixed" : "absolute",
    modifiers: [
      {
        name: "offset",
        enabled: !!offset,
        options: {
          offset: [offset.left, overlapped ? -Number(referenceElement?.offsetHeight) : offset.top],
        },
      },
      {
        name: "flip",
        enabled: !noFlip,
      },
      { name: "preventOverflow", enabled: !allowOverflow },
    ],
  });

  const { popper } = styles;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (popoverRef.current) {
        popoverRef.current.focus();
      }
    }, 100);

    if (update) update();

    if (actionsRef.current) {
      const { height } = boundingClientRect({ current: actionsRef.current });
      setActionsHeight(height);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [update, actions, setActionsHeight]);

  useClickOutside(content, ev => {
    if (isLargeMobile) onClose(ev);
  });

  const handleKeyDown = (ev: React.KeyboardEvent<HTMLDivElement>) => {
    if (ev.keyCode === 27 && onClose) onClose();
  };

  return (
    <>
      <StyledOverlay shown={shown} onClick={onClose} />
      {/* @ts-expect-error popper */}
      <StyledPopoverParent
        width={width}
        ref={popoverRef}
        $zIndex={zIndex}
        tabIndex={0}
        data-test={dataTest}
        id={id}
        noPadding={noPadding}
        overlapped={overlapped}
        role="tooltip"
        onKeyDown={handleKeyDown}
        fixed={fixed}
        shown={shown}
        isInsideModal={isInsideModal}
        {...popper}
      >
        <StyledPopoverContent ref={content} shownMobile={shown}>
          <StyledContentWrapper
            actionsHeight={actionsHeight}
            ref={scrollingElementRef}
            windowHeight={windowHeight}
            maxHeight={maxHeight}
          >
            <StyledPopoverPadding noPadding={noPadding}>{children}</StyledPopoverPadding>
          </StyledContentWrapper>

          {actions ? (
            <StyledActions ref={actionsRef}>{actions}</StyledActions>
          ) : (
            <StyledPopoverClose ref={actionsRef}>
              <Button type="secondary" fullWidth onClick={onClose}>
                {labelClose}
              </Button>
            </StyledPopoverClose>
          )}
        </StyledPopoverContent>
      </StyledPopoverParent>
    </>
  );
};

export default PopoverContentWrapper;
