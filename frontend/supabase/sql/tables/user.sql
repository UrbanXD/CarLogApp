CREATE TABLE public.user (
    id uuid NOT NULL,
    lastname character VARYING NULL,
    firstname character VARYING NULL,
    constraint users_pkey PRIMARY KEY (id),
    constraint users_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE
) TABLESPACE pg_default;