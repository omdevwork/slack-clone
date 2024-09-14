"use client"

import { ToolBar } from "./toolbar";

interface WorkspaceIdLayoutProps {
    children: React.ReactNode;
}

const WorkspaceIdLayout = ({children}: WorkspaceIdLayoutProps) => {
    return <div className="h-full">
        <ToolBar />
        {children}
    </div>
}

export default WorkspaceIdLayout