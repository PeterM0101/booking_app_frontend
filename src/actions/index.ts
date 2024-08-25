"use server"

import {schema} from "@/app/register/schema";
import * as apiClient from "../api-client";
import {RegisterFormData} from "@/app/register/page";

export type FormState = {
    message?: string;
    error?: string;
    fields?: Record<string, string>;
    issues?: string[];
};
function getErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message
    return String(error)
}

export async function registerAction(prevState: FormState, data: FormData): Promise<FormState> {
    const formData = Object.fromEntries(data) as RegisterFormData;
    const parsed = schema.safeParse(formData);
    if (!parsed.success) {
        const fields: Record<string, string> = {};
        for (const key of Object.keys(formData)) {
            fields[key] = key.toString();
        }
        return {
            error: "Invalid form data",
            fields,
            issues: parsed.error.issues.map((issue) => issue.message),
        };
    }

    try {
        const res = await apiClient.register(formData);
        return { message: "User registered", fields: {"userId": res.userId} };
    } catch (error) {
        return {error: getErrorMessage(error)}
    }
}