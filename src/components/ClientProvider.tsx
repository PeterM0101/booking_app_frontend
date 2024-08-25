"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { AppContextProvider } from '@/contexts/appContext';
import { ReactNode } from 'react';

// Initialize QueryClient in the client component
const queryClient = new QueryClient();

export default function ClientProviders({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                <AppContextProvider>
                    {children}
                </AppContextProvider>
            </SessionProvider>
        </QueryClientProvider>
    );
}