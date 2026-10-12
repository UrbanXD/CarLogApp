import { useEffect, useState } from "react";
import { BaseConfig } from "../../constants";
import { useDatabase } from "../../contexts/database/DatabaseContext";

type UseFileOptions = {
    uri?: string | null
    attachment?: boolean
}

export function useFile({ uri, attachment = true }: UseFileOptions) {
    const { supabaseConnector } = useDatabase();
    const [source, setSource] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;
        let objectUrl: string | null = null;

        const load = async () => {
            setSource(null);
            setLoading(true);
            setError(false);

            if(!uri) {
                setError(true);
                setLoading(false);
                return;
            }

            if(!attachment) {
                setSource(uri);
                setLoading(false);
                return;
            }

            if(!BaseConfig.SUPABASE_ATTACHMENT_BUCKET) {
                setError(true);
                setLoading(false);
                return;
            }

            const { data, error: downloadError } = await supabaseConnector.client.storage
            .from(BaseConfig.SUPABASE_ATTACHMENT_BUCKET)
            .download(uri);

            if(downloadError) throw downloadError;
            if(!data) throw new Error(`Could not download attachment: ${ uri }`);

            objectUrl = URL.createObjectURL(data);
            if(cancelled) {
                URL.revokeObjectURL(objectUrl);
                return;
            }

            setSource(objectUrl);
            setLoading(false);
        };

        load().catch(downloadError => {
            if(cancelled) return;
            console.warn("Could not load Supabase attachment in web:", uri, downloadError);
            setSource(null);
            setError(true);
            setLoading(false);
        });

        return () => {
            cancelled = true;
            if(objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [uri, attachment, supabaseConnector]);

    return { source, loading, error };
}
