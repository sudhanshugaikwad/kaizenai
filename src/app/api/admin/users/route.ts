
import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
    const { userId, sessionClaims } = auth();

    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if the user has the 'admin' role
    if (sessionClaims?.publicMetadata?.role !== 'admin') {
         return new NextResponse("Forbidden", { status: 403 });
    }

    try {
        const users = await clerkClient.users.getUserList();
        const simplifiedUsers = users.map(user => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress || 'No primary email',
            imageUrl: user.imageUrl,
            createdAt: user.createdAt,
        }));
        
        return NextResponse.json({ users: simplifiedUsers });
    } catch (error) {
        console.error("Error fetching users:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
