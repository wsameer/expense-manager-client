export interface Subcategory {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  is_default: boolean;
  subcategories: Subcategory[];
}

export interface ApiResponse {
  data: Category[];
}

export type CategoryDeletePayload = {
  categoryId: number;
  subcategoryId?: number;
};
