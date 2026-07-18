export interface NavItem {
  label: string;
  href: string;
  blurb: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const nav: NavGroup[] = [
  {
    title: "Foundations",
    items: [
      { label: "Colors", href: "/foundations/colors", blurb: "The neutral palette" },
      { label: "Typography", href: "/foundations/typography", blurb: "Fonts and text styles" },
    ],
  },
  {
    title: "Components",
    items: [
      { label: "Buttons", href: "/components/buttons", blurb: "Button, ButtonLinkout" },
      { label: "Tabs", href: "/components/tabs", blurb: "Switch between views" },
      { label: "Navigation", href: "/components/navigation", blurb: "Desktop & mobile header" },
      { label: "Products Menu", href: "/components/products-menu", blurb: "Hover dropdown" },
      { label: "Table Item", href: "/components/table-item", blurb: "Checklist row" },
      { label: "Product Features", href: "/components/product-features", blurb: "Tabbed showcase" },
      { label: "Features", href: "/components/features", blurb: "Auto-advancing carousel" },
      { label: "Icons", href: "/components/icons", blurb: "The icon set" },
      { label: "Logo", href: "/components/logo", blurb: "Wordmark placeholder" },
    ],
  },
];
