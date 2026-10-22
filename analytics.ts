/**
 * Event analytics tracker.
 * Logs structured analytics events to the developer console.
 */

export type AnalyticsEvent =
  | 'start_pressed'
  | 'zone_opened'
  | 'resume_downloaded'
  | 'project_link_clicked'
  | 'contact_submitted'
  | 'collectible_found'
  | 'achievement_unlocked'
  | 'quicknav_used'
  | 'classic_view_opened';

export function trackEvent(name: AnalyticsEvent, props?: Record<string, unknown>): void {
  try {
    const timestamp = new Date().toISOString();
    console.log(
      `%c[Analytics] %c${name}%c`,
      'color: #00f0ff; font-weight: bold; background: #07070d; padding: 2px 4px; border-radius: 3px;',
      'color: #ff2bd6; font-weight: bold;',
      'color: inherit;',
      props || {},
      `@ ${timestamp}`
    );
  } catch {
    // Fail silently
  }
}
