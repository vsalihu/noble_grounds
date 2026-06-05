"use client";

import Clarity from "@microsoft/clarity";

let isClarityReady = false;

export const clarityEvents = {
  quoteStarted: "quote_started",
  quoteSubmitted: "quote_submitted",
  whatsappClick: "whatsapp_click",
  phoneClick: "phone_click",
  galleryFlip: "gallery_flip",
  galleryFullscreen: "gallery_fullscreen",
  adminLogin: "admin_login_success",
  requestQuoteClick: "request_quote_click",
  viewGalleryClick: "view_gallery_click",
  contactPageVisit: "contact_page_visit",
  servicePageVisit: "service_page_visit",
  quotePhotoUploadStarted: "quote_photo_upload_started",
  quotePhotoUploadCompleted: "quote_photo_upload_completed",
  serviceAreaPageViewed: "service_area_page_viewed",
  serviceAreaQuoteClicked: "service_area_quote_clicked",
  serviceAreaWhatsAppClicked: "service_area_whatsapp_clicked",
} as const;

export function initClarity(projectId?: string) {
  if (!projectId || isClarityReady || typeof window === "undefined") {
    return;
  }

  Clarity.init(projectId);
  isClarityReady = true;
}

function trackEvent(eventName: string) {
  if (!isClarityReady || typeof window === "undefined") {
    return;
  }

  Clarity.event(eventName);
}

export function trackQuoteStarted() {
  trackEvent(clarityEvents.quoteStarted);
}

export function trackQuoteSubmitted() {
  trackEvent(clarityEvents.quoteSubmitted);
}

export function trackWhatsAppClick() {
  trackEvent(clarityEvents.whatsappClick);
}

export function trackPhoneClick() {
  trackEvent(clarityEvents.phoneClick);
}

export function trackGalleryFlip() {
  trackEvent(clarityEvents.galleryFlip);
}

export function trackGalleryFullscreen() {
  trackEvent(clarityEvents.galleryFullscreen);
}

export function trackAdminLogin() {
  trackEvent(clarityEvents.adminLogin);
}

export function trackRequestQuoteClick() {
  trackEvent(clarityEvents.requestQuoteClick);
}

export function trackViewGalleryClick() {
  trackEvent(clarityEvents.viewGalleryClick);
}

export function trackContactPageVisit() {
  trackEvent(clarityEvents.contactPageVisit);
}

export function trackServicePageVisit() {
  trackEvent(clarityEvents.servicePageVisit);
}

export function trackQuotePhotoUploadStarted() {
  trackEvent(clarityEvents.quotePhotoUploadStarted);
}

export function trackQuotePhotoUploadCompleted() {
  trackEvent(clarityEvents.quotePhotoUploadCompleted);
}

export function trackServiceAreaPageViewed() {
  trackEvent(clarityEvents.serviceAreaPageViewed);
}

export function trackServiceAreaQuoteClicked() {
  trackEvent(clarityEvents.serviceAreaQuoteClicked);
}

export function trackServiceAreaWhatsAppClicked() {
  trackEvent(clarityEvents.serviceAreaWhatsAppClicked);
}
