create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

create table "user" (
    "user_id" uuid primary key not null default uuid_generate_v4(),
    "login" character varying(256) unique not null,
    "salt" character varying(256) not null,
    "digest" character varying(256) not null
);

create table session
(
    sid varchar not null,
    user_id uuid not null,
    ex timestamp not null
);

create unique index session_sid_uindex
    on session (sid);

create unique index session_user_id_uindex
    on session (user_id);

alter table session
    add constraint session_pk
        primary key (sid);

alter table session
    add constraint session_user_user_id_fk
        foreign key (user_id) references "user"
            on delete cascade;

alter table "user"
    add confirmed boolean default false not null;

create table events
(
    service varchar not null,
    id uuid default uuid_generate_v4() not null,
    data json
);

create table account_confirmation
(
    user_id uuid not null,
    event_id varchar not null,
    timestamp timestamp not null
);

create unique index account_confirmation_event_id_uindex
    on account_confirmation (event_id);

create unique index account_confirmation_user_id_uindex
    on account_confirmation (user_id);

alter table account_confirmation
    add constraint account_confirmation_pk
        primary key (user_id);

CREATE FUNCTION delete_old_rows() RETURNS trigger
    LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM account_confirmation WHERE timestamp < NOW() - INTERVAL '2 days';
    RETURN NULL;
END;
$$;

CREATE TRIGGER trigger_delete_old_rows
    AFTER INSERT ON account_confirmation
EXECUTE PROCEDURE delete_old_rows();

alter table account_confirmation
    add constraint account_confirmation_user_user_id_fk
        foreign key (user_id) references "user"
            on delete cascade;

alter table account_confirmation alter column timestamp set default now();
