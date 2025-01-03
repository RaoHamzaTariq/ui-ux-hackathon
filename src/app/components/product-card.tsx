import React from 'react'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

const ProductCard = (props:{image:SanityImageSource,name:string,tag:string,category:string,color:number,price:number}) => {
  return (
    
    <div className='flex flex-col gap-5 max-w-[348px]'>
        <div className=''>
      <Image src={
                      props.image
                        ? urlFor( props.image).url()
                        : "/default-image.png"
                    } alt={`${props.name} Image`} width={348} height={348}/>
        </div>
        <div className='flex flex-col justify-between gap-3'>
                <ul className=' font-medium text-base'>
                    <p className='text-[#9E3500]'>{props.tag}</p>
                    <p className='text-[#111111]'>{props.name}</p>
                    <p className='text-[#757575] font-normal'>{props.category}</p>
                </ul>
                <p className='text-[#757575]'>{props.color} Colour</p>
                <p className='text-[#111111] font-medium'>{`MRP : ₹ ${props.price}.00`}</p> 
        </div>
    </div>
  )
}


export default ProductCard