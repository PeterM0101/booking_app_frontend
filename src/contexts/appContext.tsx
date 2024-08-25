"use client"

import {createContext, ReactNode, useContext} from "react";
import {toast, ToastContainer} from "react-toastify";
import {useQuery} from "@tanstack/react-query";
import * as apiClient from "../api-client";

export type ToastMessage = {
    message: string,
    type: 'SUCCESS' | "ERROR"
}

type AppContextType = {
    setToast: (toastMessage: ToastMessage) => void,
    isLoggedIn: boolean
}

const initialAppContext: AppContextType = {
    setToast: ()=>{},
    isLoggedIn: false
}

const AppContext = createContext<AppContextType>(initialAppContext)

export const useAppContext = () => useContext(AppContext)

export const AppContextProvider = ({children}: { children: ReactNode }) => {

    const {isError} = useQuery({
        queryKey: ['validateToken'],
        queryFn: apiClient.validateToken,
        retry: false
    } )
    const setToast = (toastMessage: ToastMessage) => {
        if (toastMessage.type === 'SUCCESS') {
            toast.success(toastMessage.message)
        } else {
            toast.error(toastMessage.message)
        }
    }
    return (
        <AppContext.Provider value={{setToast,
            isLoggedIn: !isError
        }}>
            <ToastContainer />
            {children}
        </AppContext.Provider>
    )
}