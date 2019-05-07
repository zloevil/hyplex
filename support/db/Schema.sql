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

