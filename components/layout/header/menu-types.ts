export interface MenuSubItem {
  name: string;
  href: string;
}

export interface MegaColumn {
  title: string;
  items: MenuSubItem[];
}

export interface MenuItem {
  label: string;
  href: string;
  type: "mega" | "dropdown" | "link";
  columns?: MegaColumn[];
  items?: MenuSubItem[];
}
