import { Cormorant_Garamond, Jost } from "next/font/google";

/**
 * The two faces concept 01 is designed around. Kept in one module so both the
 * English and Albanian routes apply the exact same variables to `.erina`.
 */

export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

export const homeFontVariables = `${cormorant.variable} ${jost.variable}`;
