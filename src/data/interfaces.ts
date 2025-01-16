import { SanityImageSource } from "@sanity/image-url/lib/types/types";


export interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    category: string;
    colors: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    mainImage: {
        alt: string;
        asset: {
            ref: string;
            type: string;
        };
    };
    shortDesc: string;
    slug: {
        current: string;
        type: string;
    };
}

export interface User {
    _updatedAt: string;
    firstName: string;
    password: string;
    gender: 'Male' | 'Female';
    _createdAt: string;
    _type: 'user';
    dateOfBirth: string;
    _id: string;
    email: string;
    country: string;
    lastName: string;
    _rev: string;
  }
  

  export interface CartProducts {
    id: string;
    quantity: number;
    price: number;
    name: string;
    color:number
    image: SanityImageSource;
    category: string;
    subTotal:number,
    slug:string
  }