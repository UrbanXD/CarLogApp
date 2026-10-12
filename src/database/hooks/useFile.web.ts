import { useEffect, useState } from "react";
import { useDatabase } from "../../contexts/database/DatabaseContext";

type UseFileOptions = {
    uri?: string | null
    attachment?: boolean
}

export function useFile({ uri, attachment = true }: UseFileOptions) {
    const { attachmentQueue } = useDatabase();
    const [source, setSource] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            if(!uri) {
                if(!cancelled) {
                    setSource(null);
                    setError(true);
                    setLoading(false);
                }
                return;
            }

            if(!attachment) {
                if(!cancelled) {
                    setSource(uri);
                    setError(false);
                    setLoading(false);
                }
                return;
            }

            if(!attachmentQueue) {
                if(!cancelled) {
                    setSource(null);
                    setError(true);
                    setLoading(false);
                }
                return;
            }

            const fileURI = await attachmentQueue.getFile(uri);
            if(!cancelled) {
                setSource(fileURI ?? null);
                setError(!fileURI);
                setLoading(false);
            }
        };

        setLoading(true);
        load().catch(() => {
            if(!cancelled) {
                setSource(null);
                setError(true);
                setLoading(false);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [uri, attachment, attachmentQueue]);

    return { source, loading, error };
}
