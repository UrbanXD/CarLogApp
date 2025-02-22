CREATE OR REPLACE FUNCTION public.delete_car_image()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public, extensions, vault
AS $$
DECLARE
    supabase_url VARCHAR;
    service_role_key VARCHAR;
    bucket_name TEXT := 'carlog';
    file_path TEXT;
BEGIN
    file_path := OLD.image;
    IF file_path IS NULL OR file_path = '' THEN
       RETURN OLD;
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

    RETURN OLD;
END;
$$;

REVOKE ALL ON FUNCTION public.delete_car_image() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.delete_car_image() FROM AUTHENTICATED;
REVOKE ALL ON FUNCTION public.delete_car_image() FROM ANON;