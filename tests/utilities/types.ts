import { type Locator } from "@playwright/test";

export type Product = {
  name: string;
  price: number;
  addButton?: Locator;
};
