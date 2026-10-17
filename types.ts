export type GroupBuy = {
  id: string; title: string; description: string; category: string; unit: string;
  image: string; committed: number; target: number; unitPricePaise: number;
  individualPricePaise: number | null; deadline: string; supplierConfirmed: boolean;
};
