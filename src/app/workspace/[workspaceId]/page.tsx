"use client"

import { useWorkSpaceId } from '@/hooks/use-workspace-id';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';

const WorkspaceIdPage = () => {

    const workspaceId = useWorkSpaceId();
    const {data} = useGetWorkspace({id: workspaceId});
    return (
        <div>
            Data: {JSON.stringify(data)}
        </div>
    )
}

export default WorkspaceIdPage
