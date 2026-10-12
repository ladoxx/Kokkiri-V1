export interface UiSettings {
  splashEnabled: boolean;
  splashFrequency: "once_per_session" | "always";
  splashDurationMs: number;
  splashTheme: "dark" | "light" | "navy";
  splashLogoUrl: string;
  splashTitle: string;
  splashSubtitle: string;
  splashTagline: string;
  splashShowPillars: boolean;
  transitionsEnabled: boolean;
  transitionStyle: "fade_blur" | "smooth_slide" | "cinematic_curtain";
  transitionSpeed: "fast" | "normal" | "slow";
  transitionScope: "brand_change_only" | "every_page";
  curtainDurationMs: number;
}

export const DEFAULT_UI_SETTINGS: UiSettings = {
  splashEnabled: true,
  splashFrequency: "once_per_session",
  splashDurationMs: 2400,
  splashTheme: "dark",
  splashLogoUrl: "/brand/kokkiri-elephant-logo.png",
  splashTitle: "KOKKIRI",
  splashSubtitle: "주식회사 코끼리",
  splashTagline: "공간의 가치를 높이는 새로운 기준",
  splashShowPillars: true,
  transitionsEnabled: true,
  transitionStyle: "cinematic_curtain",
  transitionSpeed: "normal",
  transitionScope: "brand_change_only",
  curtainDurationMs: 1300,
};
