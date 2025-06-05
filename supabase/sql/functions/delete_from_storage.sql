CREATE OR REPLACE PROCEDURE public.flag_user_files_for_delete(owner_id IN UUID)
LANGUAGE plpsql
SECURITY DEFINER SET search_path = storage, pg_temp;
AS $$
BEGIN
    UPDATE storage.objects SET
        owner = null,
        owner_id = 'delete_flag'
        metadata = null
    WHERE owner = owner_id;
END;
$$;

CREATE OR REPLACE PROCEDURE public.flag_file_for_delete(file_path IN TEXT)
LANGUAGE plpsql
SECURITY DEFINER SET search_path = storage, pg_temp;
AS $$
BEGIN
    UPDATE storage.objects SET
        owner = null,
        owner_id = 'delete_flag'
        metadata = null
    WHERE owner = auth.uid() AND auth.uid() IS NOT NULL AND name = file_path;
END;
$$;

CREATE OR REPLACE PROCEDURE public.delete_from_storage(file_path IN TEXT)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public, extensions, vault
AS $$
DECLARE
    supabase_url VARCHAR;
    service_role_key VARCHAR;
    bucket_name TEXT := 'carlog';
BEGIN
    IF file_path IS NULL OR file_path = '' THEN
       RETURN;
    END IF;

    SELECT decrypted_secret INTO supabase_url
    FROM vault.decrypted_secrets
    WHERE name = 'SUPABASE_URL'
    LIMIT 1;

    SELECT decrypted_secret INTO service_role_key
    FROM vault.decrypted_secrets
    WHERE name = 'SERVICE_ROLE_KEY'
    LIMIT 1;

    PERFORM http((
        'DELETE',
        supabase_url || '/storage/v1/object/' || bucket_name || '/' || file_path,
        ARRAY[
            http_header('authorization', 'Bearer ' || service_role_key)
        ],
        NULL,
        NULL
    )::http_request);
END;
$$;

REVOKE ALL ON PROCEDURE public.delete_image() FROM PUBLIC;
REVOKE ALL ON PROCEDURE public.delete_image() FROM AUTHENTICATED;
REVOKE ALL ON PROCEDURE public.delete_image() FROM ANON;