export type CookiePrefs = {
  functional: boolean;
  performance: boolean;
  advertising: boolean;
  social: boolean;
};

export interface CookieCategory {
  key: keyof CookiePrefs;
  title?: string;
  description?: string;
  mandatory?: boolean;
}

export type Theme = "light" | "dark";

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  primaryText: string;
  settingsButton: string;
  settingsButtonHover: string;
  settingsButtonText: string;
  background: string;
  text: string;
  border: string;
}

export type ColorSettings = Record<Theme, ThemeColors>;

export type CookieBannerProps = {
  onClose: () => void;
  onCustomizeClick: () => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  mode: "top" | "bottom" | "modal";
  dark?: boolean;
  labels?: BannerLabels;
  classNames?: BannerClassNames;
  colors?: ColorSettings;
  theme?: Theme;
};

export interface BannerLabels {
  title?: string;
  description?: string | React.ReactNode;
  acceptAll?: string;
  rejectAll?: string;
  customize?: string;
}

export interface ModalLabels {
  title?: string;
  save?: string;
  cancel?: string;
}

export interface ConsentManagerLabels {
  banner?: BannerLabels;
  modal?: ModalLabels;
  settingsButton?: string;
}

export interface ConsentManagerProps {
  mode: "modal" | "top" | "bottom";
  categories?: CookieCategory[];
  dark?: boolean;
  hideSettingsButton?: boolean;
  labels?: ConsentManagerLabels;
  classNames?: ConsentManagerClassNames;
  settingsButtonIcon?: React.ReactNode;
  colors?: ColorSettings;
  theme?: Theme;
}

export interface SettingsButtonProps {
  setVisible: (visible: boolean) => void;
  open: boolean;
  icon?: React.ReactNode;
  className?: ConsentManagerClassNames["settingsButton"];
  colors?: ColorSettings;
  theme?: Theme;
}

export interface BannerClassNames {
  container?: string;
  header?: string;
  title?: string;
  message?: string;
  closeButton?: string;
  buttonRow?: string;
  acceptButton?: string;
  rejectButton?: string;
  customizeButton?: string;
  content?: string;
}

export interface ModalClassNames {
  overlay?: string;
  container?: string;
  title?: string;
  section?: string;
  row?: string;
  rowText?: string;
  rowTitle?: string;
  rowDescription?: string;
  toggleSwitch?: string;
  toggleThumb?: string;
  saveButton?: string;
  cancelButton?: string;
  buttonRow?: string;
}

export interface ConsentManagerClassNames {
  wrapper?: string;
  banner?: BannerClassNames;
  modal?: ModalClassNames;
  settingsButton?: string;
}

export interface CookieSettingsModalProps {
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
