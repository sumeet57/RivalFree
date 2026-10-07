export const CONTACT_EMAIL = "rivalfree@sumeet.app";

// Starting limits for every account (mirrors the backend defaults).
export const DEFAULT_LIMITS = { projectLimit: 3, featureLimit: 10, aiLimit: 100 };

export const mailto = (subject) => `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
