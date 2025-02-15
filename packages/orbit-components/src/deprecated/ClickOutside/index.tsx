"use client";

import React from "react";
import styled from "styled-components";

import type { Props } from "./types";

const InnerStyled = styled.div`
  width: 100%;
`;

/**
 * @deprecated use useClickOutside hook instead
 */

export default function ClickOutside({ children, onClickOutside }: Props) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (ev: MouseEvent) => {
      if (onClickOutside && ref.current && !ref.current.contains(ev.currentTarget as Node)) {
        onClickOutside(ev);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClickOutside]);

  return <InnerStyled ref={ref}>{children}</InnerStyled>;
}
