import NextAuth, {User} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import * as apiClient from "./api-client";
import {cookies} from 'next/headers'

export const handler = NextAuth({
    pages: {signIn: '/login', newUser: '/register'},
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async signIn({user, account}) {
            console.log(`signIn user: ${JSON.stringify(user)}`);
            console.log(`signIn account: ${JSON.stringify(account)}`);
            return true;
        },
        jwt({token, user}) {
            console.log(`JWT callback token: ${JSON.stringify(token)}, user: ${JSON.stringify(user)}`);
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.accessToken = user.accessToken;
            }
            return token;
        },
        async session({session, token}) {
            console.log(`Session callback session: ${JSON.stringify(session)}, token: ${JSON.stringify(token)}`);
            session.user.id = token.id;
            session.user.email = token.email;
            session.accessToken = token.accessToken;

            return session;
        },
    },
    events: {
        createUser: async (message: any) => {
            console.log(`User created: ${JSON.stringify(message)}`);
        }
    },
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: {label: "email", type: "email", required: true},
                password: {label: "password", type: "password", required: true}
            },
            authorize: async (credentials): Promise<User | null> => {
                if (!credentials?.email || !credentials?.password) return null;

                const userData = {
                    email: credentials?.email as string,
                    password: credentials?.password as string,
                };

                try {
                    const data = await apiClient.signIn(userData);
                    console.log('User data: ', data);

                    if (!data) {
                        return null;
                    }

                    if (data?.accessToken)
                        cookies().set('access_token', data.accessToken, {secure: true})

                    return {
                        id: data?.userId,
                        email: userData.email,
                        accessToken: data?.accessToken
                    };
                } catch (error) {
                    console.log('Error' + (error as Error).message);
                    return null;
                }
            },
        })
    ],
});

declare module "next-auth" {
    interface Session {
        user: {
            id?: string;
            email?: string;
        };
        accessToken?: string;
    }

    interface User {
        id?: string;
        email?: string;
        accessToken?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
        email?: string;
        accessToken?: string;
    }
}