
-- payload | payload_locked_documents                           | table    | postgres
-- payload | payload_locked_documents_id_seq                    | sequence | postgres
-- payload | payload_locked_documents_rels                      | table    | postgres
-- payload | payload_locked_documents_rels_id_seq               | sequence | postgres
-- payload | payload_migrations                                 | table    | postgres
-- payload | payload_migrations_id_seq                          | sequence | postgres
-- payload | payload_preferences                                | table    | postgres
-- payload | payload_preferences_id_seq                         | sequence | postgres
-- payload | payload_preferences_rels                           | table    | postgres
-- payload | payload_preferences_rels_id_seq                    | sequence | postgres

  CREATE SCHEMA "payload";
ALTER SCHEMA "payload" OWNER TO postgres;

--
-- Name: payload_migrations; Type: TABLE; Schema: payload; Owner: postgres
--

CREATE TABLE payload.payload_migrations (
    id integer NOT NULL,
    name character varying,
    batch numeric,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,

    -- Constraints
    CONSTRAINT payload_migrations_pkey PRIMARY KEY (id)
);


ALTER TABLE payload.payload_migrations OWNER TO postgres;

--
-- Name: payload_migrations_id_seq; Type: SEQUENCE; Schema: payload; Owner: postgres
--

CREATE SEQUENCE payload.payload_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE payload.payload_migrations_id_seq OWNER TO postgres;
--
-- Name: payload_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: payload; Owner: postgres
--

ALTER SEQUENCE payload.payload_migrations_id_seq OWNED BY payload.payload_migrations.id;


--
-- Name: payload_migrations id; Type: DEFAULT; Schema: payload; Owner: postgres
--

ALTER TABLE ONLY payload.payload_migrations ALTER COLUMN id SET DEFAULT nextval('payload.payload_migrations_id_seq'::regclass);
