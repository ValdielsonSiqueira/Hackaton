import { carbonTokens, darkCarbonTokens, highContrastCarbonTokens, CarbonTokens } from "./carbon.js";

export function getCssVariablesFromTokens(tokens: Partial<CarbonTokens>): Record<string, string> {
  const vars: Record<string, string> = {};
  if (tokens.primary) vars["--primary"] = tokens.primary;
  if (tokens.primaryHover) vars["--primary-hover"] = tokens.primaryHover;
  if (tokens.primaryPressed) vars["--primary-pressed"] = tokens.primaryPressed;
  if (tokens.onPrimary) vars["--on-primary"] = tokens.onPrimary;
  if (tokens.ink) vars["--ink"] = tokens.ink;
  if (tokens.inkMuted) vars["--ink-muted"] = tokens.inkMuted;
  if (tokens.inkSubtle) vars["--ink-subtle"] = tokens.inkSubtle;
  if (tokens.canvas) vars["--canvas"] = tokens.canvas;
  if (tokens.surface1) vars["--surface-1"] = tokens.surface1;
  if (tokens.surface2) vars["--surface-2"] = tokens.surface2;
  if (tokens.inverseCanvas) vars["--inverse-canvas"] = tokens.inverseCanvas;
  if (tokens.inverseSurface1) vars["--inverse-surface-1"] = tokens.inverseSurface1;
  if (tokens.inverseInk) vars["--inverse-ink"] = tokens.inverseInk;
  if (tokens.inverseInkMuted) vars["--inverse-ink-muted"] = tokens.inverseInkMuted;
  if (tokens.hairline) vars["--hairline"] = tokens.hairline;
  if (tokens.hairlineStrong) vars["--hairline-strong"] = tokens.hairlineStrong;
  if (tokens.success) vars["--success"] = tokens.success;
  if (tokens.warning) vars["--warning"] = tokens.warning;
  if (tokens.error) vars["--error"] = tokens.error;
  if (tokens.rNone) vars["--r-none"] = tokens.rNone;
  if (tokens.rSm) vars["--r-sm"] = tokens.rSm;
  if (tokens.rMd) vars["--r-md"] = tokens.rMd;
  if (tokens.fontBase) vars["--font-base"] = tokens.fontBase;
  if (tokens.btnHeight) vars["--btn-height"] = tokens.btnHeight;
  return vars;
}

function formatCssBlock(selector: string, varsObj: Record<string, string>): string {
  const lines = Object.entries(varsObj)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n");
  return `${selector} {\n${lines}\n}`;
}

export function injectCssVariables(): void {
  if (typeof document === "undefined") return;
  let styleEl = document.getElementById("seniorease-core-tokens") as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "seniorease-core-tokens";
    document.head.prepend(styleEl);
  }

  const rootCss = formatCssBlock(":root", getCssVariablesFromTokens(carbonTokens));
  const highContrastCss = formatCssBlock(".high-contrast", getCssVariablesFromTokens(highContrastCarbonTokens));
  const darkCss = formatCssBlock(".dark-contrast", getCssVariablesFromTokens(darkCarbonTokens));

  styleEl.textContent = `${rootCss}\n\n${highContrastCss}\n\n${darkCss}`;
}
