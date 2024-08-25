"use client"
import Link from "next/link";
import {signOut, useSession} from "next-auth/react";
import { deleteCookie } from 'cookies-next';

const Header = () => {
    const session = useSession();

    console.log('Session: ', session)

    return (
        <div className='bg-blue-800 py-6'>
            <div className='container mx-auto flex justify-between'>
                <span className='text-3xl text-white tracking-tight font-bold'>
                    <Link href='/'>MernHolidays.com</Link>
                </span>
                <span className='flex space-x-2 text-white items-center'>
                {session?.data ? <>
                        <Link className='hover:bg-blue-600 px-2 py-1' href='my-booking'>My booking</Link>
                        <Link className='hover:bg-blue-600 px-2 py-1' href='my-hotels'>My hotels</Link>
                        <button onClick={() => {
                            void signOut();
                            deleteCookie('access_token')
                        }}
                                className="text-blue-600 px-3 font-bold bg-white hover:bg-gray-100 ">Sign Out
                        </button>
                    </> :

                    <Link href='/login'
                          className='flex items-center text-blue-600 px-3 font-bold hover:bg-gray-100 bg-white'>Sign
                        In</Link>
                }
                </span>
            </div>
        </div>
    );
};

export default Header;