import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  "aria-label"?: string;
}

const SwitchButton = styled.button`
  width: 44px;
  height: 24px;
  background-color: #d1d5db;
  border-radius: 9999px;
  border: none;
  padding: 2px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  position: relative;

  &[aria-checked="true"] {
    background-color: #2563eb;
  }
`;

const Thumb = styled.span`
  display: block;
  width: 16px;
  height: 16px;
  background-color: white;
  border-radius: 9999px;
  transition: transform 0.25s ease;
  transform: translateX(0);

  &.checked {
    transform: translateX(20px);
  }
`;

export const Toggle = ({ checked, onChange, ...props }: ToggleProps) => {
  const [isOn, setIsOn] = useState(checked);

  useEffect(() => {
    setIsOn(checked);
  }, [checked]);

  return (
    <SwitchButton
      role="switch"
      aria-checked={isOn}
      onClick={onChange}
      tabIndex={0}
      {...props}
    >
      <Thumb className={isOn ? "checked" : ""} />
    </SwitchButton>
  );
};
