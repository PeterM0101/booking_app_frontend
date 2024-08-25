import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import ClientProviders from "@/components/ClientProvider";
import {ReactNode} from "react";

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" className={inter.className}>
        <body className="flex flex-col min-h-screen">
        <ClientProviders>
            <Header />
            <Hero />
            <div className="container mx-auto py-10 flex-1">
                {children}
            </div>
            <Footer />
        </ClientProviders>
        </body>
        </html>
    );
}