import { client } from '@/sanity/lib/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const data = await req.json();
 
  const { email, firstName, lastName, dateOfBirth, country, gender } = data;
 

  try {
    // Validate user input (e.g., email format, password strength)
    if (!email || !firstName || !lastName) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Check if the email is already in use
    const existingUser = await client.fetch(`*[_type == "user" && email == $email][0]`, { email });
    
    if (existingUser) {
      return NextResponse.json({ message: 'Email already in use' }, { status: 409 }); // Conflict status
    }


    // Create a new user document in Sanity
    const newUser = await client.create({
      _type: 'user',
      email,
      firstName,
      lastName,
      dateOfBirth,
      country,
      gender,
    });

    return NextResponse.json({ message: 'Registration successful', newUser }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Return a more detailed error message if available
    return NextResponse.json({ message: 'Registration failed', error }, { status: 500 });
  }
}



export async function GET(req:NextRequest) {

  const searchParams = req.nextUrl.searchParams;
  const email = searchParams.get('email');

  if(email){
    try {
      const data = await client.fetch(`*[_type == "user" && email == "${email}"][0]`);
      
      return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
      console.error('Error fetching user:', error); // Log the error for debugging
      return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 }); // Return specific error message
    }
  }

  try {
    const data = await client.fetch(`*[_type == "user"]`);
    
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error); // Log the error for debugging
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 }); // Return specific error message
  }
}

export async function PUT(req: NextRequest) {
  const { productId, userId } = await req.json();

  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('query');

    // Validate input
    if (!productId || !userId) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    if (query === "wishlist") {
      try {
        // Fetch the current user data
        const userData = await client.getDocument(userId);

        // Check if userData is defined
        if (!userData) {
          console.error('User data not found for ID:', userId);
          return NextResponse.json({ 
            error: 'User data not found' 
          }, { status: 404 });
        }

        // Check if the wishList already exists
        const existingWishlist = userData.wishList || [];

        // Append the product ID to the wishlist as a reference
        const newWishlist = [...existingWishlist, { _ref: productId, _type: 'reference' }];

        // Update the user document with the new wishlist
        const data = await client.patch(userId)
          .set({ wishList: newWishlist })
          .commit({ autoGenerateArrayKeys: true });

        return NextResponse.json({ 
          message: "Successfully added product to Wishlist", 
          data 
        }, { status: 200 });
      } catch (patchError) {
        console.error('Sanity Patch Error:', patchError);
        return NextResponse.json({ 
          error: 'Failed to add product',
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({ 
      error: 'Invalid query parameter' 
    }, { status: 400 });
    
  } catch (error) {
    console.error('Unexpected Error:', error);
    return NextResponse.json({ 
      error: 'Unexpected server error',
    }, { status: 500 });
  }
}




export async function DELETE(req: NextRequest) {
  const { productId, userId } = await req.json();

  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('query');

    // Validate input
    if (!productId || !userId) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    if (query === "wishlist") {
      try {
        // Fetch the current user data
        const userData = await client.getDocument(userId);

        // Check if userData is defined
        if (!userData) {
          console.error('User data not found for ID:', userId);
          return NextResponse.json({ 
            error: 'User data not found' 
          }, { status: 404 });
        }

        // Check if the wishList already exists
        const existingWishlist = userData.wishList || [];

        // Find the index of the product ID in the wishlist
        const index = existingWishlist.findIndex((item: { _ref: string; }) => item._ref === productId);

        // Check if the product ID exists in the wishlist
        if (index === -1) {
          return NextResponse.json({ 
            error: 'Product not found in wishlist' 
          }, { status: 404 });
        }

        // Remove the product ID from the wishlist
        const newWishlist = existingWishlist.filter((item: { _ref: string; }) => item._ref !== productId);

        // Update the user document with the new wishlist
        const data = await client.patch(userId)
          .set({ wishList: newWishlist })
          .commit({ autoGenerateArrayKeys: true });

        return NextResponse.json({ 
          message: "Successfully removed product from Wishlist", 
          data 
        }, { status: 200 });
      } catch (patchError) {
        console.error('Sanity Patch Error:', patchError);
        return NextResponse.json({ 
          error: 'Failed to remove product',
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({ 
      error: 'Invalid query parameter' 
    }, { status: 400 });
    
  } catch (error) {
    console.error('Unexpected Error:', error);
    return NextResponse.json({ 
      error: 'Unexpected server error',
    }, { status: 500 });
  }
}
