import { colors } from "./colors.js";
import { fontSizes } from "./fontSizes.js";
import { spacing } from "./spacing.js";
import { radii } from "./radii.js";
import { carbonTokens, darkCarbonTokens, highContrastCarbonTokens } from "./carbon.js";

export const tokens = {
  colors,
  fontSizes,
  spacing,
  radii,
  carbonTokens,
  darkCarbonTokens,
  highContrastCarbonTokens
};

export type { ColorTheme } from "./colors.js";
export type { FontSizeTheme } from "./fontSizes.js";
export type { SpacingTheme } from "./spacing.js";
export type { RadiiTheme } from "./radii.js";
export type { CarbonTokens } from "./carbon.js";
export { carbonTokens, darkCarbonTokens, highContrastCarbonTokens } from "./carbon.js";
export { getCssVariablesFromTokens, injectCssVariables } from "./injectCssVariables.js";
