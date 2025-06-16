"use client";

/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import merge from "lodash-es/merge";
import { useConsentManager } from "@consentry/next";
import { setConsentOpener } from "./consentUI";

import { CookieSettingsModal } from "./CookieSettingsModal";
import { CookieBanner } from "./CookieBanner";
import { SettingsButton } from "./SettingsButton";
import { CookieCategory, ConsentManagerProps, CookiePrefs } from "./types";
import { Wrapper } from "./StyledComponents";
import { defaultClassNames } from "./defaultClassNames";
import { defaultColors } from "./defaultColors";

const DEFAULT_CATEGORIES: CookieCategory[] = [
  {
    key: "functional",
    title: "Essential Cookies",
    description:
      "These cookies are necessary for the website to function and cannot be disabled. They ensure core features like security, accessibility, and network management work properly.",
    mandatory: true,
  },
  {
    key: "performance",
    title: "Performance Cookies",
    description:
      "These cookies help us understand how visitors interact with the website by collecting and reporting information anonymously. This allows us to improve performance and user experience.",
  },
  {
    key: "advertising",
    title: "Advertising Cookies",
    description:
      "These cookies are used to deliver relevant advertisements and measure the effectiveness of our marketing campaigns across platforms.",
  },
  {
    key: "social",
    title: "Social Media Cookies",
    description:
      "These cookies enable you to share content through social media platforms and allow us to integrate social features like comment sections and media embeds.",
  },
];

const DEFAULT_LABELS = {
  banner: {
    title: "Manage your cookie preferences",
    description:
      "We use cookies to enhance site navigation, analyze usage, and assist in our marketing efforts. You can choose which types of cookies to allow. Essential cookies are always active to ensure core functionality.",
    acceptAll: "Accept all",
    rejectAll: "Reject all",
    customize: "Customize",
  },
  modal: {
    title: "Customize Cookie Preferences",
    save: "Save Preferences",
    cancel: "Cancel",
  },
};

export const ConsentManager = ({
  mode,
  dark = false,
  hideSettingsButton = false,
  categories,
  labels,
  classNames,
  settingsButtonIcon,
  colors,
  theme = "light",
}: ConsentManagerProps) => {
  const { cookiePreferences, setCookiePreferences, isConsentKnown, showConsentBanner } =
    useConsentManager();

  const mergedLabels = merge({}, DEFAULT_LABELS, labels ?? {});
  const mergedClassNames = merge({}, defaultClassNames, classNames ?? {});
  const mergedCategories = categories ?? DEFAULT_CATEGORIES;
  const mergedColors = merge({}, defaultColors, colors ?? {});

  useEffect(() => {
    setConsentOpener(() => {
      setLocalPrefs({ ...cookiePreferences });
      setShowSettings(true);
      setShowBanner(false);
    });

    return () => {
      setConsentOpener(() => {
        console.warn("[consentry] ConsentManager was unmounted.");
      });
    };
  }, [cookiePreferences]);

  const [localPrefs, setLocalPrefs] = useState({ ...cookiePreferences });
  const [showSettings, setShowSettings] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (isConsentKnown && showConsentBanner) {
      setShowBanner(true);
    } else {
      setShowBanner(false);
    }
  }, [isConsentKnown, showConsentBanner]);

  const handleSaveSettings = () => {
    setCookiePreferences(localPrefs);
    setShowSettings(false);
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    setCookiePreferences({
      functional: true,
      performance: false,
      advertising: false,
      social: false,
    });
    setShowBanner(false);
  };

  const handleAcceptAll = () => {
    setCookiePreferences({
      functional: true,
      performance: true,
      advertising: true,
      social: true,
    });
    setShowBanner(false);
  };

  const handleOpenSettings = () => {
    setLocalPrefs({ ...cookiePreferences });
    setShowSettings(true);
    setShowBanner(false);
  };

  const handleCloseSettings = () => {
    if (showConsentBanner) {
      setShowBanner(true);
    }
    setShowSettings(false);
  };

  return (
    <Wrapper className={mergedClassNames.wrapper}>
      {showBanner && (
        <CookieBanner
          onClose={() => setShowBanner(false)}
          onCustomizeClick={() => {
            setShowBanner(false);
            setShowSettings(true);
          }}
          onAcceptAll={() => {
            const newPrefs = Object.fromEntries(
              mergedCategories.map(({ key, mandatory }) => [key, mandatory ?? true])
            ) as CookiePrefs;
            setCookiePreferences(newPrefs);
            setShowBanner(false);
          }}
          onRejectAll={() => {
            const newPrefs = Object.fromEntries(
              mergedCategories.map(({ key, mandatory }) => [key, mandatory ?? false])
            ) as CookiePrefs;
            setCookiePreferences(newPrefs);
            setShowBanner(false);
          }}
          mode={mode}
          dark={dark}
          labels={mergedLabels.banner}
          classNames={mergedClassNames.banner}
          colors={mergedColors}
          theme={theme}
        />
      )}

      {showSettings && (
        <CookieSettingsModal
          localPrefs={localPrefs}
          setLocalPrefs={setLocalPrefs}
          categories={mergedCategories}
          onSave={handleSaveSettings}
          onClose={() => setShowSettings(false)}
          dark={dark}
          labels={mergedLabels.modal}
          classNames={mergedClassNames.modal}
          colors={mergedColors}
          theme={theme}
        />
      )}

      {!hideSettingsButton && (
        <SettingsButton
          setVisible={setShowSettings}
          open={!showSettings && !showBanner}
          className={mergedClassNames.settingsButton}
          icon={settingsButtonIcon}
          colors={mergedColors}
          theme={theme}
        />
      )}
    </Wrapper>
  );
};
