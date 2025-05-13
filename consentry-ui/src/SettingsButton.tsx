"use client";
import { Cookie } from "lucide-react";
import { FloatingButton } from "./StyledComponents";
import { SettingsButtonProps } from "./types";

export const SettingsButton = ({ setVisible, open, className, icon }: SettingsButtonProps) => {
  if (!open) return null;

  return (
    <FloatingButton
      onClick={() => setVisible(true)}
      aria-label="Reopen preferences"
      className={className}
    >
      {icon ?? <Cookie aria-hidden="true" focusable="false" />}
    </FloatingButton>
  );
};
