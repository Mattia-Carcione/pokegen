export const BANNER_KEY = 'pokegen.legal.banner.dismissed';

export const isBannerDismissed = () => {
  try {
    return localStorage.getItem(BANNER_KEY) === 'true';
  } catch {
    return false;
  }
};

export const dismissBanner = () => {
  try {
    localStorage.setItem(BANNER_KEY, 'true');
  } catch {}
};
