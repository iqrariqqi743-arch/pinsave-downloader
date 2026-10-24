export const trackEvent = (eventName, params = {}) => {
  if (typeof window === "undefined") return;

  if (typeof window.gtag !== "function") return;

  window.gtag("event", eventName, params);
};

export const trackImageSearch = () => {
  trackEvent("pinterest_image_search");
};

export const trackImageFound = () => {
  trackEvent("pinterest_image_found");
};

export const trackDownloadClick = () => {
  trackEvent("pinterest_download_click");
};
