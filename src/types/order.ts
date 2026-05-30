import { product } from './product';

export enum status {
  waiting,
  cancel,
  complete
}

export type order = {
  id?: number;
  userinfo?: string;
  address?: string;
  price?: string;
  items: string[] | product[];
  user_id: number;
  order_status?: status;
};

export type orderproduct = {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
};
