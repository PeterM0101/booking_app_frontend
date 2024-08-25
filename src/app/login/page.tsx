"use client";

import {useForm} from "react-hook-form";
import {useMutation} from "@tanstack/react-query";
import 'react-toastify/dist/ReactToastify.css';
import {useAppContext} from "@/contexts/appContext";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {signIn as signInNextAuth} from "next-auth/react";


export type SignInFormData = {
    email: string;
    password?: string;
    id?: string
    name?: string
}

const SignIn = () => {
    const {setToast} = useAppContext()
    const router = useRouter()
    const mutation = useMutation(
        {
            mutationFn: async (data: SignInFormData) => {
                return await signInNextAuth('credentials', {
                    redirect: false,
                    ...data,
                })
            },
            onSuccess: async (res: any) => {
                console.log('Res: ', res)
                if (res.ok && !res.error) {
                setToast({message: 'Login is successful', type: 'SUCCESS'});
                reset();
                router.push('/');
                } else {
                    setToast({message: 'Login failure', type: 'ERROR'});
                }
            },
            onError: (error: Error) => {
                setToast({message: error.message, type: "ERROR"});
            }
        }
    );

    const {
        register,
        handleSubmit,
        reset,
        formState: {
            errors,
            isValid
        }
    } = useForm<SignInFormData>(
        {
            defaultValues: {
                email: "",
                password: ""
            },
            mode: 'onTouched'
        }
    )

    function onSubmit(data: SignInFormData) {
        console.log('Data: ', data)
        mutation.mutate(data)
    }

    return (
        <form className='flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
            <h2 className='text-3xl font-bold'>Sign In</h2>
            <label className='font-bold text-sm text-gray-700 flex-1 relative'>
                Email
                <input
                    type='email'
                    className='w-full border rounded font-normal px-2 py-1'
                    {...register('email', {required: "This field is required"})}
                />
                {errors.email &&
                    <span className='text-red-500 text-xs absolute left-0 top-12'>{errors.email.message}</span>}
            </label>
            <label className='font-bold text-sm text-gray-700 flex-1 relative'>
                Password
                <input
                    type='password'
                    className='w-full border rounded font-normal px-2 py-1'
                    autoComplete='nope'
                    {...register('password', {
                        required: "This field is required", minLength: {
                            value: 6,
                            message: 'Must be at least 6 characters long.'
                        }
                    })}
                />
                {errors.password &&
                    <span className='text-red-500 text-xs absolute left-0 top-12'>{errors.password.message}</span>}
            </label>
            <div className='flex justify-between'>
                <span className="text-sm">
                  Not Registered?{" "}
                    <Link className="underline" href="/register">
                    Create an account here
                  </Link>
                </span>
                <button
                    type="submit"
                    className='text-white p-2 hover:bg-blue-500 bg-blue-600 font-bold text-xl disabled:bg-gray-400'
                    disabled={!isValid}
                >
                    Login
                </button>
            </div>
        </form>
    );
};

export default SignIn;