import {z} from "zod";

const notEmpty = z.string().trim().min(1, { message: "Required" });
const password = z.string().min(6, {message: 'Must be at least 6 characters long.'});
export const schema = z.object({
    firstName: z.string().pipe(notEmpty),
    lastName: z.string().pipe(notEmpty),
    email: z.string().email({ message: "Invalid email" }).pipe(notEmpty),
    password,
    confirmPassword: password
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
});