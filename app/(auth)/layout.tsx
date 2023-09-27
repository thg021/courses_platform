import React, { ReactNode } from 'react'

interface AuthLayout {
    children: ReactNode
}

export default function AuthLayout({ children }: AuthLayout) {
    return (
        <div className='h-full flex items-center justify-center'>{children}</div>
    )
}
