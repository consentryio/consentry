"use client";

/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import { useConsentManager } from "@consentry/next";
import { setConsentOpener } from "./consentUI";

import { CookieSettingsModal } from "./CookieSettingsModal";
import { CookieBanner } from "./CookieBanner";
import { SettingsButton } from "./SettingsButton";
import { CookieCategory, ConsentManagerProps } from "./types";
import { Wrapper } from "./StyledComponents";
import { defaultClassNames } from "./defaultClassNames";

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

export const ConsentManager = ({
  mode,
  dark = false,
  hideSettingsButton = false,
  categories = DEFAULT_CATEGORIES,
  labels = {
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
  },
  classNames = defaultClassNames,
  settingsButtonIcon,
}: ConsentManagerProps) => {
  const { cookiePreferences, setCookiePreferences, isConsentKnown, showConsentBanner } =
    useConsentManager();

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
    <Wrapper className={classNames.wrapper}>
      {!hideSettingsButton && (
        <SettingsButton
          open={true}
          setVisible={handleOpenSettings}
          className={classNames.settingsButton}
          icon={settingsButtonIcon}
        />
      )}
      {showBanner && (
        <CookieBanner
          mode={mode}
          dark={dark}
          onClose={() => setShowBanner(false)} // Consider this for handleRejectAll based on GDPR and others if needed
          onCustomizeClick={handleOpenSettings}
          onAcceptAll={handleAcceptAll}
          onRejectAll={handleRejectAll}
          labels={labels.banner}
          classNames={classNames.banner}
          aria-label="Cookie consent banner"
        />
      )}
      {showSettings && (
        <CookieSettingsModal
          dark={dark}
          localPrefs={localPrefs}
          setLocalPrefs={setLocalPrefs}
          categories={categories}
          onSave={handleSaveSettings}
          onClose={handleCloseSettings}
          labels={labels.modal}
          classNames={classNames.modal}
          aria-label="Cookie settings modal"
        />
      )}
    </Wrapper>
  );
};
