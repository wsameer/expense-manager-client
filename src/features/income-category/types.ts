export interface IncomeCategory {
  id: number;
  name: string;
  description: string;
}

export interface ApiResponse {
  data: IncomeCategory[];
}

export type CategoryDeletePayload = {
  categoryId: number;
};
