
'use client';
import { Protect } from '@clerk/nextjs';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Protect
            role="org:admin"
            fallback={
                <div className="flex items-center justify-center h-full">
                    <p>You do not have permission to view this page.</p>
                </div>
            }
        >
            {children}
        </Protect>
    );
}
