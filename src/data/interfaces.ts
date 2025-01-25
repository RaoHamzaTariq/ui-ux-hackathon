import { SanityImageSource } from "@sanity/image-url/lib/types/types";


export interface Product {
    _id: string;
    productName: string;
    price: number;
    inventory: number;
    category: string;
    colors: string[];
    status: string;
    createdAt: Date;
    updatedAt: Date;
    image: SanityImageSource;
    description: string;
    reviews:Comment[]
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
    productName: string;
    color:string[]
    image: SanityImageSource;
    category: string;
    subTotal:number,
    slug:string,
  }

  export interface Comment { 
    rating: number;             
    customerName: string;   
    comment: string;
  }