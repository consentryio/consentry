"use client";
import { FloatingButton, StyledCookieIcon } from "./StyledComponents";
import { SettingsButtonProps } from "./types";

export const SettingsButton = ({ setVisible, open, className, icon }: SettingsButtonProps) => {
  if (!open) return null;
  const isClient = typeof window !== "undefined";

  return (
    <FloatingButton
      onClick={() => setVisible(true)}
      aria-label="Reopen preferences"
      className={className}
    >
      {icon ?? (isClient ? <StyledCookieIcon /> : null)}
    </FloatingButton>
  );
};
