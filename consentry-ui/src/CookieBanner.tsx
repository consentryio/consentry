import React from "react";
import { X } from "lucide-react";
import { CookieBannerProps } from "./types";
import { motion } from "framer-motion";
import {
  BannerWrapper,
  Header,
  Content,
  Title,
  Message,
  CloseButton,
  ButtonRow,
  ActionButton,
  SecondaryButton,
} from "./StyledComponents";

export const CookieBanner = ({
  onClose,
  onCustomizeClick,
  onAcceptAll,
  onRejectAll,
  mode,
  dark = false,
  labels,
  classNames,
  colors,
  theme = "light",
}: CookieBannerProps) => {
  const isModal = mode === "modal";
  return (
    <BannerWrapper
      mode={mode}
      dark={dark}
      colors={colors}
      theme={theme}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-banner-title"
      className={classNames?.container}
      initial={
        isModal
          ? {
              opacity: 0,
              scale: 0.95,
              x: "-50%",
              y: "-50%",
            }
          : {
              opacity: 0,
              y: mode === "top" ? -100 : 100,
            }
      }
      animate={
        isModal
          ? {
              opacity: 1,
              scale: 1,
              x: "-50%",
              y: "-50%",
            }
          : {
              opacity: 1,
              y: 0,
            }
      }
      exit={
        isModal
          ? {
              opacity: 0,
              scale: 0.95,
              x: "-50%",
              y: "-50%",
            }
          : {
              opacity: 0,
              y: mode === "top" ? -100 : 100,
            }
      }
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <Header className={classNames?.header}>
        <Content className={classNames?.content}>
          <Title id="cookie-banner-title" className={classNames?.title}>
            {labels?.title}
          </Title>
          <Message className={classNames?.message}>{labels?.description}</Message>
        </Content>
        <CloseButton
          onClick={onClose}
          aria-label="Close banner"
          className={classNames?.closeButton}
        >
          <X size={20} />
        </CloseButton>
      </Header>

      <ButtonRow className={classNames?.buttonRow}>
        <SecondaryButton
          style={{ marginRight: "0.5rem" }}
          dark={dark}
          onClick={onCustomizeClick}
          className={classNames?.customizeButton}
        >
          {labels?.customize}
        </SecondaryButton>
        <ActionButton
          outlined
          dark={dark}
          onClick={onRejectAll}
          className={classNames?.rejectButton}
          colors={colors}
          theme={theme}
        >
          {labels?.rejectAll}
        </ActionButton>
        <ActionButton
          dark={dark}
          onClick={onAcceptAll}
          className={classNames?.acceptButton}
          colors={colors}
          theme={theme}
        >
          {labels?.acceptAll}
        </ActionButton>
      </ButtonRow>
    </BannerWrapper>
  );
};
