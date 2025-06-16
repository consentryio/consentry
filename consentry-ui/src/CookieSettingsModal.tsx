import React from "react";
import {
  CookieCategory,
  CookiePrefs,
  ModalLabels,
  ModalClassNames,
  Theme,
  ColorSettings,
} from "./types";
import {
  Overlay,
  ModalContainer,
  Title,
  Section,
  Row,
  RowText,
  RowTitle,
  RowDescription,
  ButtonRow,
  SecondaryButton,
  ActionButton,
  StyledSwitch,
  SwitchThumb,
} from "./StyledComponents";

interface CookieSettingsModalProps {
  localPrefs: CookiePrefs;
  setLocalPrefs: React.Dispatch<React.SetStateAction<CookiePrefs>>;
  categories: CookieCategory[];
  onSave: () => void;
  onClose: () => void;
  dark?: boolean;
  labels?: ModalLabels;
  classNames?: ModalClassNames;
  colors?: ColorSettings;
  theme?: Theme;
}

export const CookieSettingsModal = ({
  localPrefs,
  setLocalPrefs,
  categories,
  onSave,
  onClose,
  dark = false,
  labels,
  classNames,
  colors,
  theme = "light",
}: CookieSettingsModalProps) => {
  const handleToggle = (key: keyof CookiePrefs) => {
    setLocalPrefs(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <Overlay
      className={classNames?.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <ModalContainer
        dark={dark}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={classNames?.container}
      >
        <Title large dark={dark} className={classNames?.title}>
          {labels?.title}
        </Title>

        <Section className={classNames?.section}>
          {categories.map(({ key, title, description, mandatory }) => (
            <Row key={key} className={classNames?.row}>
              <RowText className={classNames?.rowText}>
                <RowTitle dark={dark} className={classNames?.rowTitle}>
                  {title}
                </RowTitle>
                <RowDescription dark={dark} className={classNames?.rowDescription}>
                  {description}
                </RowDescription>
              </RowText>

              <StyledSwitch
                checked={mandatory ? true : localPrefs[key]}
                onChange={() => (mandatory ? null : handleToggle(key))}
                className={classNames?.toggleSwitch}
                colors={colors}
                theme={theme}
              >
                <SwitchThumb
                  animate={{ x: localPrefs[key] ? 20 : 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className={classNames?.toggleThumb}
                />
              </StyledSwitch>
            </Row>
          ))}
        </Section>

        <ButtonRow className={classNames?.buttonRow}>
          <SecondaryButton
            style={{ marginRight: "0.5rem" }}
            onClick={onClose}
            className={classNames?.cancelButton}
          >
            {labels?.cancel}
          </SecondaryButton>
          <ActionButton
            dark={dark}
            onClick={onSave}
            className={classNames?.saveButton}
            colors={colors}
            theme={theme}
          >
            {labels?.save}
          </ActionButton>
        </ButtonRow>
      </ModalContainer>
    </Overlay>
  );
};
