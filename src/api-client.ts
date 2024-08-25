"use server"
import {RegisterFormData} from "@/app/register/page";
import {cookies} from "next/headers";
import {SignInFormData} from "@/app/login/page";

function parseCookies(cookieString: string) {
    if (!cookieString) return null;

    let result = cookieString.split(';').reduce((cookies: any, cookie) => {
        const [name, value] = cookie.split('=').map(c => c.trim());
        if (name.includes('HttpOnly')) {
            cookies[name] = true
        } else if (name.includes('Max-Age')) {
            cookies['maxAge'] = +value
        } else {
            cookies[name] = value;
        }
        return cookies;
    }, {});
    result.secure = process.env.NODE_ENV === 'production'
    return result;
}

export const register = async (formData: RegisterFormData): Promise<any> => {
    const response = await fetch(`${process.env.API_BASE_URL}/api/users/register`, {
        method: 'POST',
        credentials: "include",
        body: JSON.stringify(formData),
        headers: {
            "Content-Type": "application/json"
        }
    })

    const cookiesString = response.headers.get('Set-Cookie');
    let cookiesObject = null;
    if (cookiesString) {
        cookiesObject = parseCookies(cookiesString);
        if (cookiesObject) {
            const {auth_token, ...rest} = cookiesObject;
            cookies().set('auth_token', auth_token, rest)
        }
    }
    const responseBody = await response.json();

    console.log("responseBody: ", responseBody)
    if (!response.ok) {
        throw new Error(responseBody.message)
    } else {
        return responseBody
    }
}

export const signIn = async (formData: SignInFormData) => {
    try {
        const response = await fetch(`${process.env.API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            credentials: "include",
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json"
            }
        })

        const responseBody = await response.json();
        console.log("responseBody: ", responseBody)
        console.log('Response: ', response)
        if (!response.ok) {
            throw new Error(`Error: ${responseBody.message}`);
        } else {
            return responseBody;
        }
    } catch (error) {
        throw new Error(`Request failed: ${(error as Error).message}`);
    }

}

export const validateToken = async () => {
    const response = await fetch(`${process.env.API_BASE_URL}/api/auth/validate-token`, {credentials: "include"})
    if (!response.ok) {
        throw new Error('Token invalid')
    }
    return await response.json()
}