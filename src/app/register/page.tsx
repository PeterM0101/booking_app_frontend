"use client"
import {useForm} from "react-hook-form";
import {registerAction} from "@/actions";
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from "zod";
import {schema} from "./schema";
import {useFormState, useFormStatus} from "react-dom";
import 'react-toastify/dist/ReactToastify.css';
import {useEffect} from "react";
import {useAppContext} from "@/contexts/appContext";
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
import Link from "next/link";

export type RegisterFormData = z.output<typeof schema>

const Register = () => {
    const [state, dispatch] = useFormState(registerAction, {message: '', error: ''})
    const {pending} = useFormStatus()
    const router = useRouter()

    console.log('State: ', state)

    const {
        register,
        getValues,
        reset,
        formState: {
            errors,
            isValid
        }
    } = useForm<RegisterFormData>(
        {
            defaultValues: {
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: ""
            },
            mode: 'onTouched',
            resolver: zodResolver(schema),
        }
    )

    const {setToast} = useAppContext()

    useEffect(onStateChange, [state, setToast, getValues, reset, router]);

    function onStateChange() {
        if (state.error) setToast({message: state.error, type: "ERROR"});
        if (state.message) {
            void signIn("credentials", {
                email: getValues("email"),
                password: getValues("password"),
                redirect: false,
            });
            setToast({message: state.message, type: "SUCCESS"})
            reset()
            void router.push('/')
        }
    }

    return (
        <form className='flex flex-col gap-5' action={dispatch}>
            <h2 className='text-3xl font-bold'>Create an Account</h2>
            <div className='flex md:flex-row flex-col gap-5'>
                <label className='font-bold text-sm text-gray-700 flex-1 relative'>
                    First name
                    <input
                        className='w-full border rounded font-normal px-2 py-1'
                        {...register('firstName')}
                    />
                    {errors.firstName &&
                        <span
                            className='text-red-500 text-xs absolute left-0 top-12'>{errors.firstName.message}</span>}
                </label>
                <label className='font-bold text-sm text-gray-700 flex-1 relative'>
                    Last name
                    <input
                        className='w-full border rounded font-normal px-2 py-1'
                        {...register('lastName')}
                    />
                    {errors.lastName &&
                        <span
                            className='text-red-500 text-xs absolute left-0 top-12'>{errors.lastName.message}</span>}
                </label>
            </div>
            <label className='font-bold text-sm text-gray-700 flex-1 relative'>
                Email
                <input
                    className='w-full border rounded font-normal px-2 py-1'
                    {...register('email')}
                />
                {errors.email &&
                    <span className='text-red-500 text-xs absolute left-0 top-12'>{errors.email.message}</span>}
            </label>
            <label className='font-bold text-sm text-gray-700 flex-1 relative'>
                Password
                <input
                    type='password'
                    className='w-full border rounded font-normal px-2 py-1'
                    {...register('password')}
                    autoComplete="nope"
                />
                {errors.password &&
                    <span className='text-red-500 text-xs absolute left-0 top-12'>{errors.password.message}</span>}
            </label>
            <label className='font-bold text-sm text-gray-700 flex-1 relative'>
                Confirm Password
                <input
                    type='password'
                    className='w-full border rounded font-normal px-2 py-1'
                    {...register('confirmPassword')}
                    autoComplete="nope"
                />
                {errors.confirmPassword && <span
                    className='text-red-500 text-xs absolute left-0 top-12'>{errors.confirmPassword.message}</span>}
            </label>
            <div className='flex justify-between'>
                    <span>Already registered?{" "}
                        <Link className="underline" href="/login">
                            Login here
                        </Link>
                    </span>
                <button
                    className='text-white p-2 hover:bg-blue-500 bg-blue-600 font-bold text-xl disabled:bg-gray-400'
                    type='submit'
                    disabled={!isValid || pending}
                >Create Account
                </button>
            </div>
        </form>
    );
};

export default Register;