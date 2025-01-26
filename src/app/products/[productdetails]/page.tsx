  'use client';
  import React, { useEffect, useState } from 'react';
  import CommentForm from "@/components/comment-section";
  import Image from 'next/image';
  import { TbShoppingCart } from 'react-icons/tb';
  import { CiHeart } from "react-icons/ci";
  import Link from 'next/link';
  import { Product } from '@/data/interfaces';
  import { urlFor } from '@/sanity/lib/image';
  import { useCart } from '@/components/context/CartContext';
  import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { addToWhishlist } from '@/components/Functions/whishlist';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';

  const ProductDetail = ({ params }: { params: { productdetails: string } }) => {
    const { productdetails } = params; 
    const [productData, setProductData] = useState<Product|null>(null)
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); 
    const [quantity, setQuantity] = useState<number>(1)
    const { addToCart } = useCart();
    const { toast } = useToast()

    useEffect(()=>{
      const fetchData = async() =>{
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?slug=${productdetails}`)
          if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status}`); 
          }
          const data = await response.json()
          setProductData(data.data);
          
        } catch (error: unknown) { 
          
          if (error instanceof Error) { 
            setError(error.message);
            console.error(error) 
          } else {
            setError('An unexpected error occurred.'); 
          }
        }finally {
          setIsLoading(false);
        }
      }
      fetchData()
    },[productdetails])

    const handleAddToCart = (product: Product) => {

      addToCart({
        id: product._id,
        productName: product.productName,
        price: product.price,
        image: product.image,
        quantity: quantity,
        category: product.category,
        subTotal: parseFloat((product.price * quantity).toFixed(0)),
        color: product.colors,
        slug: product.slug.current
      });
    };
    
    
      
    if (isLoading) {
      return (
        <p className="flex text-xl text-[#111111] justify-center items-center w-full my-40 gap-2">
          Loading product details...
        </p>
      );
    }
      
  
// Calculate average rating
const averageRating = () => {
  if (!productData || !productData.reviews || productData.reviews.length === 0) {
    return 0;
  }
  return (
    (productData.reviews.reduce((acc, review) => acc + review.rating, 0) / productData.reviews.length)
      .toFixed(1)
  );
};


    
    if (error) {
      return (
        <p className="flex text-xl text-[#111111] justify-center items-center w-full my-40 gap-2">
          Error loading product: {error}
        </p>
      );
    }

    if (!productData) {
      return (
        <p className="flex text-xl text-[#111111] justify-center items-center w-full my-40 gap-2">
          Product not found! You may have entered the wrong path.{' '}
          <Link href="/">
            <span className="underline font-medium">Back to Homepage</span>
          </Link>
        </p>
      );
    }

    return (
      <div className='flex flex-col gap-5'>
      <div className='flex flex-col md:flex-row lg:gap-[137] md:gap-10 gap-16 justify-between xl:mx-40 lg:mx-32 md:mx-20 mx-10 lg:mt-32 md:mt-24 sm:mt-16 mt-10'>
        
        {/* Dynamic image rendering */}
        <Image src={
                      productData.image
                        ? urlFor(productData.image).url()
                        : "/default-image.png"
                    } alt={productData.productName} className='md:basis-[60%]'  width={653} height={653} />
        
        <div className='font-poppins md:basis-[40%] flex flex-col items-center md:items-start gap-7'>
          <h1 className='max-w-[367px] leading-[48px] text-4xl sm:text-5xl font-medium md:text-left text-center'>
            {productData.productName}
          </h1>
          <p className='text-base md:text-left text-center'>{productData.description}</p>
          <h3 className='text-4xl font-medium md:text-left text-center'>{`₹ ${productData.price}.00`}</h3>
          
          <ToggleGroup className='flex gap-5' variant="outline" type="multiple">
            {productData.colors.map((color:string)=>(
              <ToggleGroupItem key={color} value={color} >
            {color}
              </ToggleGroupItem>
            ))}
        
      </ToggleGroup>
          <div className='flex flex-col justify-center items-center md:mt-4 gap-7 sm:gap-5 md:gap-7 lg:gap-10'>

          <div className='flex sm:justify-start justify-center  gap-5 items-center'>
          <button onClick={() => {
                        if (quantity > 1) {
                          setQuantity((prev) => prev - 1);
                        }
                      }} className={` ${quantity<=1? "bg-gray-600" : "bg-[#111111]"} -mt-4 px-5 rounded-3xl w-fit flex justify-center items-center gap-3 py-2 text-base font-medium text-white sm:text-left text-center`}>{"-"}</button>
          <h4 className='flex justify-center items-center text-center text-base font-medium '>{quantity}</h4> 
          <button onClick={() => {
                        if (quantity < productData.inventory) {
                          setQuantity((prev) => prev + 1);
                        }
                      }}  className={` ${productData.inventory<=quantity? "bg-gray-600" : "bg-[#111111]"} -mt-4 px-5 rounded-3xl w-fit flex justify-center items-center gap-3 py-2 text-base font-medium text-white sm:text-left text-center`}>{"+"}</button>
          </div>
          <div className='flex gap-5 justify-between items-center'>
            <Link href={'/cart'}><button onClick={() => {
                  toast({
                    title: "Successful",
                    description: `${quantity} ${productData.productName} added to cart`,
                    action: (
                      <ToastAction altText="Go to cart">
                        <Link href={"/cart"} className="no-underline">
                          More Details
                        </Link>
                      </ToastAction>
                    ),
                  });
                  handleAddToCart(productData);
                }} className='bg-[#111111] -mt-4 px-5 rounded-3xl w-fit flex justify-center items-center gap-3 py-2 text-base font-medium text-white sm:text-left text-center'>
            <TbShoppingCart /> Add to Cart
          </button></Link>
            <button onClick={() => {
                  toast({
                    title: "Successful",
                    description: ` ${productData.productName} added to wishlist`,
                    action: (
                      <ToastAction altText="Go to Wishlist">
                        <Link href={"/wishlist"} className="no-underline">
                          More Details
                        </Link>
                      </ToastAction>
                    ),
                  });
                  addToWhishlist(productData._id);
                }} className='bg-red-700 -mt-4 px-5 rounded-3xl w-fit flex justify-center items-center gap-3 py-2 text-base font-medium text-white sm:text-left text-center'>
            <CiHeart /> Add to Wishlist
          </button>
            </div>
          </div>
          
          
        </div>


        </div>

        <div className='px-10 flex gap-5 mt-10 sm:flex-row flex-col'>
          <div className='flex sm:basis-[60%] flex-col gap-3'>
               {/* Reviews Section */}
        <div className="mt-10 w-full">
          <h2 className="text-lg font-semibold">Average Rating: {averageRating()} ⭐</h2>
          
          {/* Display individual reviews */}
          <div className="mt-4">
            {productData.reviews ? (
              productData.reviews.map((review) => (
                <div key={review.customerName} className="border-b py-2">
                  <strong>{review.customerName}:</strong> 
                  <span> {review.comment} ({review.rating} ⭐)</span>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
       
          </div>
          </div>
          <div className='sm:basis-[40%]'>
          {
            productData._id && <CommentForm  productId={productData._id} /> 
          }
          
          </div>
        </div>
      </div>

      
    );
  };

  export default ProductDetail;
