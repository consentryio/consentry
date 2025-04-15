/** @jsxImportSource @emotion/react */
import { HTMLAttributes } from "react";
import styled from "@emotion/styled";
import { Switch } from "@headlessui/react";
import { motion } from "framer-motion";
import { Cookie } from "lucide-react";

// ──────────────────────────────────────────
// Layout
// ──────────────────────────────────────────

export const Wrapper = styled.div`
  position: relative;
  z-index: 9999;
`;

interface OverlayProps extends HTMLAttributes<HTMLDivElement> {}

export const Overlay = styled(motion.div)<OverlayProps>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  padding: 1rem;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface ModalContainerProps extends HTMLAttributes<HTMLDivElement> {
  dark?: boolean;
}

export const ModalContainer = styled(motion.div, {
  shouldForwardProp: prop => prop !== "dark",
})<ModalContainerProps>`
  background: ${({ dark }) => (dark ? "#111827" : "white")};
  color: ${({ dark }) => (dark ? "white" : "#111827")};
  border-radius: 0.75rem;
  padding: 1.5rem;
  width: 100%;
  max-width: 32rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
`;

// ──────────────────────────────────────────
// Banner Wrapper
// ──────────────────────────────────────────

// Define custom props
interface BannerWrapperProps extends HTMLAttributes<HTMLDivElement> {
  mode: "top" | "bottom" | "modal";
  dark: boolean;
}

// Styled motion.div with prop filtering
export const BannerWrapper = styled(motion.div, {
  shouldForwardProp: prop => !["dark", "mode"].includes(prop),
})<BannerWrapperProps>`
  position: fixed;
  z-index: 50;
  padding: 1.5rem;
  background-color: ${({ dark }) => (dark ? "#111827" : "#ffffff")};
  color: ${({ dark }) => (dark ? "#ffffff" : "#111827")};
  font-size: 0.875rem;
  border: 1px solid ${({ dark }) => (dark ? "#374151" : "#e5e7eb")};
  box-shadow:
    rgba(50, 50, 93, 0.1) 0px 8px 24px,
    rgba(0, 0, 0, 0.06) 0px 4px 12px;

  ${({ mode }) =>
    mode === "top" &&
    `
      top: 0;
      left: 0;
      width: 100vw;
      border-radius: 0 0 0.75rem 0.75rem;
      padding: 1.5rem 2.5rem 1.5rem 2rem;
    `}

  ${({ mode }) =>
    mode === "bottom" &&
    `
      bottom: 0;
      left: 0;
      width: 100vw;
      border-radius: 0.75rem 0.75rem 0 0;
      padding: 1.5rem 2.5rem 1.5rem 2rem;
    `}

  ${({ mode }) =>
    mode === "modal" &&
    `
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      max-width: 42rem;
      border-radius: 1rem;
    `}
`;

// ──────────────────────────────────────────
// Content Structure
// ──────────────────────────────────────────

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
`;

export const Content = styled.div`
  flex: 1;
`;

export const Title = styled.h2<{ large?: boolean; dark?: boolean }>`
  font-size: ${({ large }) => (large ? "1.25rem" : "1.125rem")};
  font-weight: 600;
  margin-bottom: ${({ large }) => (large ? "0.5rem" : "0.25rem")};
  color: ${({ dark }) => (dark ? "white" : "inherit")};
`;

export const Message = styled.p`
  font-size: 0.875rem;
  line-height: 1.5;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const RowText = styled.div`
  padding-right: 1rem;
`;

export const RowTitle = styled.p<{ dark?: boolean }>`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ dark }) => (dark ? "#ffffff" : "#111827")};
`;

export const RowDescription = styled.p<{ dark?: boolean }>`
  font-size: 0.75rem;
  color: ${({ dark }) => (dark ? "#9ca3af" : "#6b7280")};
`;

// ──────────────────────────────────────────
// Buttons
// ──────────────────────────────────────────

export const ButtonRow = styled.div<{ align?: "end" | "center" }>`
  display: flex;
  justify-content: ${({ align = "end" }) => (align === "center" ? "center" : "flex-end")};
  gap: 0.75rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
`;

export const ActionButton = styled.button<{
  dark: boolean;
  outlined?: boolean;
}>`
  color: ${({ dark, outlined }) => (outlined || dark ? (dark ? "#ffffff" : "#1d4ed8") : "#ffffff")};
  font-weight: 500;
  font-size: 0.875rem;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  background-color: ${({ dark, outlined }) =>
    outlined ? "transparent" : dark ? "#2563eb" : "#1d4ed8"};
  border: ${({ dark, outlined }) =>
    outlined ? `2px solid ${dark ? "#2563eb" : "#1d4ed8"}` : "none"};
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: ${({ dark, outlined }) =>
      outlined ? "transparent" : dark ? "#1e40af" : "#1e3a8a"};
    border-color: ${({ dark, outlined }) => (outlined ? (dark ? "#1e40af" : "#1e3a8a") : "none")};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
  }
`;

export const SecondaryButton = styled.button<{ dark?: boolean }>`
  font-size: 0.875rem;
  color: ${({ dark }) => (dark ? "#ffffff" : "#6b7280")};
  background: transparent;
  border: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export const CloseButton = styled.button`
  color: #9ca3af;
  background: transparent;
  border: none;
  padding: 0.25rem;
  cursor: pointer;

  &:hover {
    color: #6b7280;
  }

  &:focus {
    outline: none;
  }
`;

// ──────────────────────────────────────────
// Toggle
// ──────────────────────────────────────────

export const StyledSwitch = styled(Switch)<{ checked: boolean }>`
  margin-top: 1px;
  flex-shrink: 0;
  width: 44px;
  height: 24px;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-radius: 9999px;
  background-color: ${({ checked }) => (checked ? "#2563eb" : "#d1d5db")};
  transition: background-color 0.2s ease;
  cursor: pointer;
  border: none;

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
  }
`;

interface SwitchThumbProps extends HTMLAttributes<HTMLSpanElement> {}

export const SwitchThumb = styled(motion.span)<SwitchThumbProps>`
  width: 16px;
  height: 16px;
  background-color: white;
  border-radius: 9999px;
`;

export const FloatingButton = styled.button`
  position: fixed;
  bottom: 4rem;
  left: 1rem;
  z-index: 40;
  padding: 0.5rem;
  background-color: #1d4ed8; /* blue-700 */
  color: white;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 2.5rem;
  height: 2.5rem;

  &:hover {
    background-color: #1e40af; /* blue-800 */
  }
`;

export const StyledCookieIcon = styled(Cookie)`
  width: 1.5rem;
  height: 1.5rem;
`;
