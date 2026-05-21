import { getSiteConfig } from "./site-actions";

/**
 * Resolves the branding theme based on the 4-level hierarchy (0-3).
 * Level 0: System Default (Neutral) - Handled by UI fallback
 * Level 1: Workspace / Organization Theme
 * Level 2: App / Site Theme
 * Level 3: Specific Entity Theme (e.g., Landing Page) - Passed via options
 * 
 * @param workspaceId The organization/workspace ID
 * @param appId The specific application ID (e.g., 'website', 'posnstok')
 * @param entityTheme Optional theme from the most specific level (Level 3)
 * @returns The most specific theme found, or null to fallback to Level 0
 */
export async function resolveBranding(
  workspaceId: string, 
  appId?: string | null, 
  entityTheme?: any
) {
  // Level 3: Specific Entity (e.g., Landing Page)
  if (entityTheme && Object.keys(entityTheme).length > 0) {
    return entityTheme;
  }

  // Level 2: App / Site Theme (Workspace + Specific App)
  if (appId) {
    const appConfig = await getSiteConfig(workspaceId, appId);
    if (appConfig?.theme) {
      return appConfig.theme;
    }
  }

  // Level 1: Workspace / Organization Theme (Workspace + All Apps)
  const workspaceConfig = await getSiteConfig(workspaceId, null);
  if (workspaceConfig?.theme) {
    return workspaceConfig.theme;
  }

  return null; // Level 0: Fallback to System Default (Neutral)
}
