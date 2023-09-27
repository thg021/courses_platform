import React, { ReactNode } from 'react'

interface LayoutDashboardProps {
    children: ReactNode
}

export default function LayoutDashboard({ children }: LayoutDashboardProps) {
    return (
        <div>{children}</div>
    )
}
