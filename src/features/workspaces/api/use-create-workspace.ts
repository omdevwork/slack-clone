import { useMutation } from "convex/react";
import { useCallback, useMemo, useState } from "react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

type RequestType = {
    name: string
};
type ResponseType = Id<"workspaces"> | null;

type Options = {
    onSuccess?: (data: ResponseType) => void;
    onError?: (error: Error) => void;
    onSettled?: () => void;
    throwError?: boolean;
}

export const useCreateWorkSpace = () => {
    const muation = useMutation(api.workspaces.create);

    const [data, setData] = useState<ResponseType>(null);
    const [error, setError] = useState<Error | null>(null);

    const [status, setStatus] = useState<"success" | "error" | "settled" | "pending" | null>(null)

    const isPending = useMemo(() => status === "pending",[status]);
    const isSuccess = useMemo(() => status === "success",[status]);
    const isError = useMemo(() => status === "error",[status]);
    const isSettled = useMemo(() => status === "settled",[status]);

    const mutate = useCallback(async (values: RequestType, options?: Options) => {

        try {
            setData(null);
            setError(null);
            setStatus("pending");
            const response = await muation(values);
            options?.onSuccess?.(response);
            return response;
        } catch (error) {
            options?.onError?.(error as Error);
            if (options?.throwError) {
                throw error;
            }
        } finally {
            setStatus("settled");
            options?.onSettled?.();
        }

    }, [muation]);

    return {
        mutate,
        data,
        error,
        isError,
        isPending,
        isSettled,
        isSuccess
    };
}