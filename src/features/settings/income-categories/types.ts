export interface IncomeCategory {
  id: number;
  name: string;
  description: string;
  order: number;
}

export interface ApiResponse {
  data: IncomeCategory[];
}

export type CategoryDeletePayload = {
  categoryId: number;
};
