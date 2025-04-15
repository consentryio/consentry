import React from "react";
import { FloatingButton, StyledCookieIcon } from "./StyledComponents";
import { SettingsButtonProps } from "./types";

export const SettingsButton = ({ setVisible, open, className, icon }: SettingsButtonProps) => {
  if (!open) return null;

  return (
    <FloatingButton
      onClick={() => setVisible(true)}
      aria-label="Reopen preferences"
      className={className}
    >
      {icon ?? <StyledCookieIcon />}
    </FloatingButton>
  );
};
