CREATE OR REPLACE PROCEDURE public.delete_image(file_path IN TEXT)
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