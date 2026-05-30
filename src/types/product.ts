export type product = {
  id?: number;
  ptitle?: string;
  pdesc?: string;
  price?: string;
  discount?: string;
  priceafterdiscount?: string;
  category?: string;
  subcategory?: string[];
  brand?: string;
  colors?: string[];
  images?: string[];
  imagesData?: string[];
  coverimage: string;
  imageCoverData?: string[] | string;
  rate?: number;
};
export type prodComment = {
  prodid?: number;
  id?: number;
  username?: string;
  text?: string;
  stars?: string;
  sumstar?: number;
  numstar?: number;
};
