import { useEffect, useState } from "react";
import { ATTACHMENT_TABLE, AttachmentState } from "@powersync/attachments";
import { useQuery } from "@powersync/react-native";
import { File } from "expo-file-system";
import { useDatabase } from "../../contexts/database/DatabaseContext.ts";

type UseFileOptions = {
    uri?: string | null
    attachment?: boolean
}

export function useFile({ uri, attachment = true }: UseFileOptions) {
    const { attachmentQueue } = useDatabase();

    const query = (attachment && uri)
                  ? `SELECT state
                     FROM ${ ATTACHMENT_TABLE }
                     WHERE id = ?`
                  : "";
    const { data: fileAttachments } = useQuery<{ state: AttachmentState }>(query, [uri]);

    const [source, setSource] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        if(!uri) {
            setError(true);
            setLoading(false);
            return;
        }

        const load = async () => {
            if(!attachment) {
                const file = new File(uri);
                if(file.exists && file.size > 0) {
                    setSource(file.uri);
                    setError(false);
                } else {
                    setError(true);
                }
                setLoading(false);
            } else {
                if(!attachmentQueue) {
                    setError(true);
                    setLoading(false);
                    return;
                }

                const fileURI = await attachmentQueue.getFile(uri);
                if(fileURI) {
                    setSource(fileURI);
                    setError(false);
                    setLoading(false);
                }
            }
        };

        load();
    }, [uri, attachment]);

    useEffect(() => {
        if(!attachment || !attachmentQueue || fileAttachments?.[0]?.state !== AttachmentState.SYNCED) return;

        setSource(`${ attachmentQueue.storageDirectory }/${ uri }`);
        setLoading(false);
        setError(false);
    }, [fileAttachments, attachment, attachmentQueue]);

    return { source, loading, error };
}