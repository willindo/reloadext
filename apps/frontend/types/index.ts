export type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  userId: string; // add this
};

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
};
