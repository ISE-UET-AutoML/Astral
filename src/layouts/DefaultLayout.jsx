import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from 'src/components/NavBar'
import LabelProjectPollingManager from 'src/components/LabelProjectPollingManager'

const DefaultLayout = () => {
    return (
        <div className="relative min-h-screen bg-white dark:bg-[#01000A]">
            {/* Full-viewport background fill */}
            <div className="fixed inset-0 bg-white dark:bg-[#01000A] -z-50" />

            <NavBar />
            <div className="min-h-[calc(100dvh-60px)]">
                <Outlet />
            </div>
            <LabelProjectPollingManager />
        </div>
    )
}

export default DefaultLayout
