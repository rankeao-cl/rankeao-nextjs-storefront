import { StorefrontLayout as DefaultStorefrontLayout } from "./default/layouts/StorefrontLayout";
import { HomePage as DefaultHomePage } from "./default/pages/HomePage";

import { StorefrontLayout as BluecardStorefrontLayout } from "./bluecard/layouts/StorefrontLayout";
import { HomePage as BluecardHomePage } from "./bluecard/pages/HomePage";

import { StorefrontLayout as CalabozoStorefrontLayout } from "./calabozo/layouts/StorefrontLayout";
import { HomePage as CalabozoHomePage } from "./calabozo/pages/HomePage";
import { NosotrosPage as CalabozoNosotrosPage } from "./calabozo/pages/NosotrosPage";

import React from "react";

// A fallback component for themes that haven't implemented NosotrosPage yet
function DefaultNosotrosPage() {
  return React.createElement("div", { className: "p-8 text-center text-gray-500" }, "Página de Nosotros en construcción...");
}

export interface ThemeComponents {
  layouts: {
    StorefrontLayout: React.ComponentType<{ children: React.ReactNode, tenant?: any }>;
  };
  pages: {
    HomePage: React.ComponentType<{ tenant?: any }>;
    NosotrosPage: React.ComponentType<{ tenant?: any }>;
  };
}

export const themeRegistry: Record<string, ThemeComponents> = {
  "default": {
    layouts: {
      StorefrontLayout: DefaultStorefrontLayout,
    },
    pages: {
      HomePage: DefaultHomePage,
      NosotrosPage: DefaultNosotrosPage,
    }
  },
  "bluecard": {
    layouts: {
      StorefrontLayout: BluecardStorefrontLayout,
    },
    pages: {
      HomePage: BluecardHomePage,
      NosotrosPage: DefaultNosotrosPage,
    }
  },
  "calabozo": {
    layouts: {
      StorefrontLayout: CalabozoStorefrontLayout,
    },
    pages: {
      HomePage: CalabozoHomePage,
      NosotrosPage: CalabozoNosotrosPage,
    }
  }
};

export function getThemeConfig(themeName: string) {
  // Return the specified theme or fallback to default
  const themeKey = (themeRegistry as any)[themeName] ? themeName : "default";
  return themeRegistry[themeKey as keyof typeof themeRegistry];
}
