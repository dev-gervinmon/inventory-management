export interface CategoryWithSubcategories {
  id: string;
  name: string;
  subcategories: Array<{
    id: string;
    name: string;
  }>;
}
