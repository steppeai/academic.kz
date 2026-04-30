--
-- PostgreSQL database dump
--

\restrict rVMPLTLmsEvcYzHzWgbMx8KtU1VFUhGFaXWAlfnr5Ebj08laDsfyuRbTKgP2pCm

-- Dumped from database version 18.2 (Postgres.app)
-- Dumped by pg_dump version 18.2 (Postgres.app)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: applications; Type: TABLE; Schema: public; Owner: abdugaffaromerbek
--

CREATE TABLE public.applications (
    id integer NOT NULL,
    user_id integer NOT NULL,
    program_id integer NOT NULL,
    status text DEFAULT 'draft'::text,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.applications OWNER TO abdugaffaromerbek;

--
-- Name: applications_id_seq; Type: SEQUENCE; Schema: public; Owner: abdugaffaromerbek
--

CREATE SEQUENCE public.applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.applications_id_seq OWNER TO abdugaffaromerbek;

--
-- Name: applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: abdugaffaromerbek
--

ALTER SEQUENCE public.applications_id_seq OWNED BY public.applications.id;


--
-- Name: checklist_items; Type: TABLE; Schema: public; Owner: abdugaffaromerbek
--

CREATE TABLE public.checklist_items (
    id integer NOT NULL,
    user_id integer NOT NULL,
    program_id integer,
    doc_name text NOT NULL,
    is_done boolean DEFAULT false NOT NULL,
    category text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.checklist_items OWNER TO abdugaffaromerbek;

--
-- Name: checklist_items_id_seq; Type: SEQUENCE; Schema: public; Owner: abdugaffaromerbek
--

CREATE SEQUENCE public.checklist_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.checklist_items_id_seq OWNER TO abdugaffaromerbek;

--
-- Name: checklist_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: abdugaffaromerbek
--

ALTER SEQUENCE public.checklist_items_id_seq OWNED BY public.checklist_items.id;


--
-- Name: favorites; Type: TABLE; Schema: public; Owner: abdugaffaromerbek
--

CREATE TABLE public.favorites (
    id integer NOT NULL,
    user_id integer NOT NULL,
    program_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.favorites OWNER TO abdugaffaromerbek;

--
-- Name: favorites_id_seq; Type: SEQUENCE; Schema: public; Owner: abdugaffaromerbek
--

CREATE SEQUENCE public.favorites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.favorites_id_seq OWNER TO abdugaffaromerbek;

--
-- Name: favorites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: abdugaffaromerbek
--

ALTER SEQUENCE public.favorites_id_seq OWNED BY public.favorites.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: abdugaffaromerbek
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    user_id integer NOT NULL,
    program_id integer NOT NULL,
    send_at timestamp without time zone NOT NULL,
    type text DEFAULT 'deadline'::text,
    sent boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.notifications OWNER TO abdugaffaromerbek;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: abdugaffaromerbek
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO abdugaffaromerbek;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: abdugaffaromerbek
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: programs; Type: TABLE; Schema: public; Owner: abdugaffaromerbek
--

CREATE TABLE public.programs (
    id integer NOT NULL,
    title text NOT NULL,
    title_ru text,
    university_id integer NOT NULL,
    field text NOT NULL,
    language text[] NOT NULL,
    cost integer NOT NULL,
    cost_usd integer,
    duration text DEFAULT '2 года'::text,
    deadline text,
    bolashak boolean DEFAULT false NOT NULL,
    tags text[] DEFAULT '{}'::text[],
    description text,
    requirements text[] DEFAULT '{}'::text[],
    documents text[] DEFAULT '{}'::text[],
    rating real DEFAULT 4,
    students integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.programs OWNER TO abdugaffaromerbek;

--
-- Name: programs_id_seq; Type: SEQUENCE; Schema: public; Owner: abdugaffaromerbek
--

CREATE SEQUENCE public.programs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.programs_id_seq OWNER TO abdugaffaromerbek;

--
-- Name: programs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: abdugaffaromerbek
--

ALTER SEQUENCE public.programs_id_seq OWNED BY public.programs.id;


--
-- Name: universities; Type: TABLE; Schema: public; Owner: abdugaffaromerbek
--

CREATE TABLE public.universities (
    id integer NOT NULL,
    name text NOT NULL,
    name_ru text NOT NULL,
    city text NOT NULL,
    country text NOT NULL,
    website text,
    is_kazakh boolean DEFAULT false NOT NULL,
    ranking integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.universities OWNER TO abdugaffaromerbek;

--
-- Name: universities_id_seq; Type: SEQUENCE; Schema: public; Owner: abdugaffaromerbek
--

CREATE SEQUENCE public.universities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.universities_id_seq OWNER TO abdugaffaromerbek;

--
-- Name: universities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: abdugaffaromerbek
--

ALTER SEQUENCE public.universities_id_seq OWNED BY public.universities.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: abdugaffaromerbek
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    name text,
    password text,
    role text DEFAULT 'user'::text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO abdugaffaromerbek;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: abdugaffaromerbek
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO abdugaffaromerbek;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: abdugaffaromerbek
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: applications id; Type: DEFAULT; Schema: public; Owner: abdugaffaromerbek
--

ALTER TABLE ONLY public.applications ALTER COLUMN id SET DEFAULT nextval('public.applications_id_seq'::regclass);


--
-- Name: checklist_items id; Type: DEFAULT; Schema: public; Owner: abdugaffaromerbek
--

ALTER TABLE ONLY public.checklist_items ALTER COLUMN id SET DEFAULT nextval('public.checklist_items_id_seq'::regclass);


--
-- Name: favorites id; Type: DEFAULT; Schema: public; Owner: abdugaffaromerbek
--

ALTER TABLE ONLY public.favorites ALTER COLUMN id SET DEFAULT nextval('public.favorites_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: abdugaffaromerbek
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: programs id; Type: DEFAULT; Schema: public; Owner: abdugaffaromerbek
--

ALTER TABLE ONLY public.programs ALTER COLUMN id SET DEFAULT nextval('public.programs_id_seq'::regclass);


--
-- Name: universities id; Type: DEFAULT; Schema: public; Owner: abdugaffaromerbek
--

ALTER TABLE ONLY public.universities ALTER COLUMN id SET DEFAULT nextval('public.universities_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: abdugaffaromerbek
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: abdugaffaromerbek
--

COPY public.applications (id, user_id, program_id, status, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: checklist_items; Type: TABLE DATA; Schema: public; Owner: abdugaffaromerbek
--

COPY public.checklist_items (id, user_id, program_id, doc_name, is_done, category, created_at) FROM stdin;
\.


--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: abdugaffaromerbek
--

COPY public.favorites (id, user_id, program_id, created_at) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: abdugaffaromerbek
--

COPY public.notifications (id, user_id, program_id, send_at, type, sent, created_at) FROM stdin;
\.


--
-- Data for Name: programs; Type: TABLE DATA; Schema: public; Owner: abdugaffaromerbek
--

COPY public.programs (id, title, title_ru, university_id, field, language, cost, cost_usd, duration, deadline, bolashak, tags, description, requirements, documents, rating, students, created_at, updated_at) FROM stdin;
46	MSc Computer Science & AI	Компьютерные науки и ИИ	1	IT	{English}	2100	\N	2 года	2026-03-15	t	{}	Элитная программа CS с фокусом на AI/ML. Преподаватели — выпускники MIT, Stanford, CMU. QS #229.	{"GPA 3.0+/4.0","IELTS 6.5+ / TOEFL 80+","2 рекомендательных письма","Мотивационное письмо"}	{"Диплом бакалавра IT/Math",Транскрипт,IELTS/TOEFL,"2 рекомендации","Мотивационное письмо",CV,Удостоверение}	4.9	800	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
47	MBA — Business Administration	MBA — Управление бизнесом	1	Business	{English}	2400	\N	2 года	2026-04-01	t	{}	Единственная аккредитованная MBA в Казахстане. Кейс-метод, профессора из ведущих бизнес-школ мира.	{"GPA 3.0+/4.0","IELTS 6.5+ / TOEFL 80+","GMAT 550+ желательно","2+ лет опыта","2 рекомендации","Эссе о карьерных целях"}	{"Диплом бакалавра",Транскрипт,IELTS/TOEFL,GMAT,"2 рекомендации",Эссе,CV,"Справка с работы",Удостоверение}	4.8	600	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
48	MSc Data Science	Магистр Data Science	1	IT	{English}	1950	\N	2 года	2026-03-15	t	{}	Программа Data Science в партнёрстве с tech-компаниями Казахстана. Python, ML, Big Data на реальных данных.	{"GPA 3.0+/4.0","Python/R базовые знания","IELTS 6.5+ / TOEFL 80+","2 рекомендации"}	{"Диплом IT/Math/Statistics",Транскрипт,IELTS/TOEFL,"2 рекомендации",CV,Portfolio,Удостоверение}	4.8	400	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
49	MSc Public Policy	Магистр государственной политики	1	Public Policy	{English}	1800	\N	2 года	2026-04-01	t	{}	Программа подготовки госменеджеров. Партнёрство с Harvard Kennedy School.	{"GPA 3.0+/4.0","IELTS 6.5+","2+ лет опыта в госорганах","2 рекомендации","Personal Statement"}	{"Диплом бакалавра",Транскрипт,IELTS/TOEFL,"2 рекомендации","Personal Statement",CV,"Справка о работе",Удостоверение}	4.7	300	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
50	MSc International Business & Management	Международный бизнес и менеджмент	2	Business	{English,Kazakh}	1800	\N	2 года	2026-05-01	t	{}	Двойной диплом с De Montfort University (UK). Обучение в Алматы + стажировка в Великобритании.	{"GPA 3.0+/4.0","IELTS 6.0+ / TOEFL 75+","Мотивационное письмо","2 рекомендации"}	{"Диплом бакалавра",Транскрипт,IELTS/TOEFL,"Мотивационное письмо","2 рекомендации",Удостоверение,"Фото 3x4"}	4.8	1200	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
51	MSc Oil & Gas Engineering	Нефтегазовая инженерия	2	Engineering	{English}	2000	\N	2 года	2026-05-01	t	{}	Разработана с Shell и KazMunaiGas. Лабораторная база мирового уровня. Высокий спрос на рынке труда РК.	{"GPA 3.0+/4.0","Диплом инженера","IELTS 6.0+ / TOEFL 75+","Мотивационное письмо","2 рекомендации"}	{"Диплом инженера",Транскрипт,IELTS/TOEFL,"Мотивационное письмо","2 рекомендации",Удостоверение}	4.7	400	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
52	MSc Computer Science	Компьютерные науки	2	IT	{English}	1900	\N	2 года	2026-05-01	t	{}	Практическая CS программа. Акцент на software engineering, cybersecurity, cloud. Партнёрство с Microsoft Kazakhstan.	{"GPA 3.0+/4.0","IELTS 6.0+","Portfolio проектов","2 рекомендации"}	{"Диплом IT/CS/Math",Транскрипт,IELTS/TOEFL,"Portfolio GitHub","2 рекомендации",Удостоверение}	4.7	500	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
53	MSc International Law	Юриспруденция — Международное право	3	Law	{Kazakh,Russian}	900	\N	2 года	2026-07-01	f	{}	Старейший юридический факультет Казахстана. Международное публичное право, право ВТО, арбитраж.	{"Диплом юриста","IELTS 5.5+ (опционально)","Мотивационное письмо","2 рекомендации"}	{"Диплом юриспруденции",Транскрипт,Удостоверение,"Мотивационное письмо","2 рекомендации","Медсправка 086","Фото 3x4"}	4.5	2000	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
54	MSc Data Science & Analytics	Наука о данных и аналитика	3	IT	{Kazakh,Russian,English}	950	\N	2 года	2026-06-20	t	{}	Партнёрство с Яндекс Образование. Практические проекты на данных казахстанских компаний.	{"GPA 3.0+/4.0","Базовый Python или R","Мотивационное письмо"}	{"Диплом IT/Math/Statistics",Транскрипт,Удостоверение,"Мотивационное письмо",CV}	4.6	500	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
55	MSc Economics	Экономика	3	Economics	{Kazakh,Russian}	800	\N	2 года	2026-08-01	f	{}	Классическая программа: макроэкономика, эконометрика, экономика РК.	{"GPA 3.0+/4.0","Мотивационное письмо"}	{"Диплом бакалавра",Транскрипт,Удостоверение,"Мотивационное письмо",Медсправка,Фото}	4.4	1500	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
56	MSc Mining Engineering	Горное дело	4	Engineering	{Kazakh,Russian}	800	\N	2 года	2026-07-15	t	{}	Сильнейшая горная программа в ЦА. Практика на крупнейших горнодобывающих предприятиях Казахстана.	{"Диплом инженера/горного специалиста","Мотивационное письмо","2 рекомендации"}	{"Диплом бакалавра",Транскрипт,Удостоверение,"Мотивационное письмо","2 рекомендации"}	4.4	600	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
57	MSc Petroleum Engineering	Нефтяная инженерия	4	Engineering	{Kazakh,Russian,English}	850	\N	2 года	2026-07-15	t	{}	Партнёрство с Total, Chevron. Стажировки на Тенгиз и Кашаган.	{"Диплом инженера","IELTS 5.5+ (для English трека)","Мотивационное письмо"}	{"Диплом Engineering",Транскрипт,IELTS,Удостоверение,"Мотивационное письмо"}	4.5	400	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
58	MSc Finance	Финансы	5	Finance	{English}	1500	\N	2 года	2026-06-30	f	{}	CFA, международные финансовые рынки. Преподаватели с опытом Goldman Sachs, KPMG. Аккредитован AACSB и AMBA.	{"GPA 2.7+/4.0","IELTS 6.0+ / TOEFL 79+","GMAT 450+ желательно","2 рекомендации",Эссе}	{"Диплом бакалавра",Транскрипт,IELTS/TOEFL,GMAT,"2 рекомендации",Эссе,CV,Удостоверение}	4.6	800	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
59	MBA	MBA	5	Business	{English}	1800	\N	2 года	2026-06-30	f	{}	KIMEP MBA — double-accredited AACSB и AMBA. Единственная такая программа в РК.	{"GPA 2.7+/4.0","IELTS 6.5+ / TOEFL 79+","GMAT 500+ желательно","3+ лет опыта","2 рекомендации"}	{"Диплом бакалавра",Транскрипт,IELTS/TOEFL,GMAT,"2 рекомендации","3 Эссе",CV,"Справка с работы",Удостоверение}	4.6	600	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
60	MSc Artificial Intelligence & Robotics	ИИ и робототехника	15	IT	{English,Kazakh}	1200	\N	2 года	2026-05-20	t	{}	Государственный IT-университет будущего. Оборудование Cisco, IBM, Huawei. Стипендии для отличников.	{"GPA 3.0+/4.0","IELTS 6.0+ / TOEFL 79+","Portfolio проектов","Мотивационное письмо"}	{"Диплом IT/Engineering",Транскрипт,IELTS,"Мотивационное письмо","Portfolio GitHub",CV,Удостоверение}	4.7	150	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
61	MSc Cybersecurity	Кибербезопасность	15	IT	{English,Kazakh}	1200	\N	2 года	2026-05-20	t	{}	Партнёрство с Kaspersky Lab Kazakhstan и государственными органами РК.	{"GPA 3.0+/4.0","IELTS 6.0+","Знание основ сетей и безопасности",Portfolio}	{"Диплом IT/CS",Транскрипт,IELTS,"Мотивационное письмо",Portfolio,CV,Удостоверение}	4.6	100	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
62	MSc Computer Science	Компьютерные науки	6	IT	{English,Kazakh}	1300	\N	2 года	2026-06-10	t	{}	Партнёрство с турецкими и европейскими университетами. Кампус в Каскелене, Алматы.	{"GPA 3.0+/4.0","IELTS 5.5+ / TOEFL 72+","Мотивационное письмо",CV}	{"Диплом IT/Math",Транскрипт,IELTS/TOEFL,"Мотивационное письмо",CV,Удостоверение}	4.6	250	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
63	MSc Economics & Finance	Экономика и финансы	7	Finance	{Kazakh,Russian,English}	750	\N	2 года	2026-08-01	f	{}	Ведущий экономический университет Алматы. Финансовый анализ, банковское дело, страхование.	{"GPA 3.0+/4.0","Мотивационное письмо","2 рекомендации"}	{"Диплом экономиста/финансиста",Транскрипт,Удостоверение,"Мотивационное письмо","2 рекомендации",Фото}	4.3	1000	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
64	MSc Software Engineering	Программная инженерия	10	IT	{English,Kazakh}	1100	\N	2 года	2026-06-01	t	{}	Специализированный IT-университет Алматы. Партнёрства Microsoft, Oracle, Cisco.	{"GPA 3.0+/4.0","IELTS 5.5+ (опционально)","Portfolio проектов","Мотивационное письмо"}	{"Диплом IT/CS",Транскрипт,"IELTS (желательно)","Мотивационное письмо","Portfolio GitHub",CV,Удостоверение}	4.5	300	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
65	MSc Public Administration	Государственное управление	11	Public Policy	{Kazakh,Russian}	700	\N	2 года	2026-07-20	f	{}	Ведущий университет Астаны. Подготовка госменеджеров с фокусом на цифровую трансформацию.	{"GPA 3.0+/4.0","Мотивационное письмо","2 рекомендации"}	{"Диплом бакалавра",Транскрипт,Удостоверение,"Мотивационное письмо","2 рекомендации",Медсправка}	4.3	800	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
66	MSc Computer Science	Магистр компьютерных наук	21	IT	{English}	55000	55000	2 года	2025-12-15	t	{}	MIT EECS — #1 в мире. AI/ML, systems, theory. Acceptance rate ~4%. Большинство студентов имеют публикации.	{"GPA 3.7+/4.0","GRE Quant 165+ рекомендуется","TOEFL 100+ / IELTS 7.0+","3 рекомендации","Research Statement","Portfolio проектов"}	{"Диплом CS/EE/Math",Транскрипт,GRE,TOEFL/IELTS,"3 рекомендации","Statement of Purpose",CV,"Writing Sample"}	5	300	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
67	MS Artificial Intelligence	Магистр ИИ	22	IT	{English}	60000	60000	2 года	2025-12-01	t	{}	Stanford HAI — мировой лидер AI. GRE не обязателен с 2023. Acceptance rate ~2%. Профессора — создатели ImageNet, Word2Vec.	{"GPA 3.8+/4.0","TOEFL 100+ / IELTS 7.0+","3 рекомендации от профессоров","Statement of Purpose",Portfolio/публикации}	{"Диплом бакалавра",Транскрипт,TOEFL/IELTS,"3 рекомендации","Statement of Purpose",CV,Portfolio}	5	200	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
68	Master of Public Health	Магистр общественного здравоохранения	23	Medicine	{English}	52000	52000	2 года	2025-12-15	t	{}	Harvard T.H. Chan School — #1 в мире. Требует 2+ лет опыта в медицине. 7 специализаций.	{"GPA 3.5+/4.0","GRE или GMAT рекомендуется","TOEFL 100+ / IELTS 7.0+","3 рекомендации","Personal Statement","2+ лет опыта"}	{"Диплом медицины/биологии",Транскрипт,GRE/GMAT,TOEFL/IELTS,"3 рекомендации","Personal Statement",CV,"Справка об опыте"}	4.9	400	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
69	MS Financial Economics	Магистр финансовой экономики	24	Finance	{English}	62000	62000	2 года	2026-01-05	t	{}	Columbia SIPA — средний GMAT принятых 730+. Связи с Wall Street, JP Morgan, Goldman Sachs.	{"GPA 3.5+/4.0","GMAT 720+ / GRE Quant 165+","TOEFL 105+ / IELTS 7.5+","3 рекомендации","2+ лет в финансах","2 Эссе"}	{"Диплом Economics/Finance/Math",Транскрипт,GMAT/GRE,TOEFL/IELTS,"3 рекомендации","2 Эссе",CV,"Справка с работы"}	4.9	250	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
70	MSc Electrical & Computer Engineering	Магистр электроинженерии	27	Engineering	{English}	53000	53000	2 года	2025-12-01	t	{}	CMU ECE — топ-3 США. ML hardware, robotics, IoT. Большинство выпускников — Google, Apple, NVIDIA.	{"GPA 3.6+/4.0","GRE Quant 165+ сильно рекомендуется","TOEFL 100+ / IELTS 7.0+","3 рекомендации",SOP}	{"Диплом EE/ECE/CS",Транскрипт,GRE,TOEFL/IELTS,"3 рекомендации",SOP,CV}	4.9	350	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
71	Master of Laws (LLM)	Магистр права (LLM)	30	Law	{English}	68000	68000	2 года	2026-02-01	t	{}	Yale Law — #1 юридическая школа мира. ~25 человек в год. Acceptance rate <5%.	{"Диплом юриста","TOEFL 100+ / IELTS 7.5+","2 рекомендации","Personal Statement (2000 слов)","Writing Sample (20-30 стр.)","Bar admission"}	{"Диплом юриста",Транскрипт,TOEFL/IELTS,"2 рекомендации","Personal Statement","Writing Sample",CV,"Bar Certificate"}	4.9	200	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
72	MPH Global Health	Магистр глобального здоровья	32	Medicine	{English}	55000	55000	2 года	2026-01-15	t	{}	Bloomberg School — #1 Global Health. Выпускники работают в WHO, CDC, USAID.	{"GPA 3.0+/4.0","GRE рекомендуется","TOEFL 100+ / IELTS 7.0+","3 рекомендации",SOP,"2+ лет опыта"}	{"Диплом медицины/биологии",Транскрипт,GRE,TOEFL/IELTS,"3 рекомендации",SOP,CV,"Резюме с опытом"}	4.9	300	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
73	MS Data Science	Магистр Data Science	26	IT	{English}	58000	58000	2 года	2026-01-10	t	{}	Berkeley MIDS — одна из лучших DS программ мира. Партнёрства Google, Meta, Uber.	{"GPA 3.3+/4.0","GRE рекомендуется","TOEFL 90+ / IELTS 7.0+","3 рекомендации",SOP,"Python/SQL/Stats опыт"}	{"Диплом CS/Math/Statistics",Транскрипт,GRE,TOEFL/IELTS,"3 рекомендации",SOP,CV,Portfolio}	4.9	250	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
74	MS Computer Science	Магистр компьютерных наук	33	IT	{English}	56000	56000	2 года	2026-01-15	t	{}	Northwestern CS — AI, systems, HCI. Чикагский tech scene. Coursera partnership.	{"GPA 3.3+/4.0","GRE рекомендуется","TOEFL 100+ / IELTS 7.0+","3 рекомендации",SOP}	{"Диплом CS/Math/Engineering",Транскрипт,GRE,TOEFL/IELTS,"3 рекомендации",SOP,CV}	4.8	300	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
75	MSc Computer Science	Магистр компьютерных наук	41	IT	{English}	40000	40000	2 года	2026-01-10	t	{}	Oxford MSc CS — 1 год. Теория вычислений, верификация ПО, квантовые вычисления. Acceptance ~8%.	{"GPA 1st class (3.8+)","IELTS 7.5+ (каждый 7.0+)","2-3 рекомендации от профессоров","Research Proposal 1000 слов","Writing Sample"}	{"Диплом CS/Math/Engineering",Транскрипт,IELTS,"2-3 рекомендации","Research Proposal",CV}	5	150	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
76	MPhil Engineering	Магистр инженерии	42	Engineering	{English}	38000	38000	2 года	2026-01-05	t	{}	Cambridge MPhil — 1 год исследований. Обязателен научный руководитель до подачи заявки.	{"GPA 1st class (3.8+)","IELTS 7.5+ (каждый 7.0+)","3 рекомендации","Research Proposal 2000 слов","Предварительный контакт с научным руководителем"}	{"Диплом Engineering",Транскрипт,IELTS,"3 рекомендации","Research Proposal",CV,Portfolio}	5	200	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
77	MSc Artificial Intelligence	Магистр ИИ	43	IT	{English}	36000	36000	2 года	2026-01-15	t	{}	Imperial AI — 1 год. DeepMind, Google, Microsoft partnerships. Центр Лондона. QS #8.	{"GPA 2:1 (3.5+)","IELTS 7.0+ (каждый 6.5+)","2 рекомендации","Personal Statement",Portfolio}	{"Диплом CS/EE/Math",Транскрипт,IELTS,"2 рекомендации","Personal Statement",CV}	4.9	250	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
78	MSc Machine Learning	Магистр Machine Learning	44	IT	{English}	35000	35000	2 года	2026-01-15	t	{}	UCL — ведущий центр ML в Европе. Родина DeepMind. Alan Turing Institute partnership.	{"GPA 2:1 (3.5+)","IELTS 7.0+ (каждый 6.5+)","2 рекомендации","Personal Statement"}	{"Диплом CS/Math/Engineering/Physics",Транскрипт,IELTS,"2 рекомендации","Personal Statement",CV}	4.9	200	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
79	MSc Economics	Магистр экономики	45	Economics	{English}	34000	34000	2 года	2026-01-20	t	{}	LSE Economics — строгая математическая программа. Требует продвинутого анализа и эконометрики. QS #45.	{"GPA 1st class / 3.7+","GRE Quant 165+ (настоятельно рекомендуется)","IELTS 7.5+ (каждый 7.0+)","2 рекомендации","Personal Statement"}	{"Диплом Economics/Math/Statistics",Транскрипт,GRE,IELTS,"2 рекомендации","Personal Statement",CV}	4.9	400	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
80	MSc Data Science	Магистр Data Science	46	IT	{English}	26000	26000	2 года	2026-03-15	t	{}	Edinburgh DSI — ведущий центр DS в UK. Сильная стартап-экосистема. 1 год + диссертация.	{"GPA 2:1 (3.5+)","IELTS 6.5+ (каждый 6.0+)","2 рекомендации","Personal Statement",Python/R/SQL}	{"Диплом Math/CS/Statistics",Транскрипт,IELTS,"2 рекомендации","Personal Statement",CV}	4.7	200	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
81	MSc Advanced Computer Science	Магистр Advanced CS	47	IT	{English}	26000	26000	2 года	2026-03-01	t	{}	Manchester — родина компьютера (Alan Turing). AI, cybersecurity, data engineering. QS #34.	{"GPA 2:1 (3.3+)","IELTS 6.5+ (каждый 6.0+)","2 рекомендации","Personal Statement"}	{"Диплом CS/Math/Engineering",Транскрипт,IELTS,"2 рекомендации","Personal Statement",CV}	4.7	300	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
82	MSc Informatics	Магистр информатики	56	IT	{English}	600	600	2 года	2026-05-31	t	{}	TUM — лучший технический университет Европы. QS #37. ~600 EUR/семестр. AI, robotics, software engineering.	{"GPA 3.0+/4.0","IELTS 6.5+ / TOEFL 88+","Мотивационное письмо (2 страницы)",CV,"Portfolio (рекомендуется)"}	{"Диплом CS/Math/Engineering",Транскрипт,IELTS/TOEFL,"Мотивационное письмо",CV,"Portfolio (опционально)"}	4.9	500	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
83	MSc Electrical Engineering	Магистр электроинженерии	56	Engineering	{English,German}	600	600	2 года	2026-05-31	t	{}	TUM EE — power systems, embedded systems, RF engineering, medical engineering.	{"GPA 3.0+/4.0","IELTS 6.0+ / TOEFL 83+","Мотивационное письмо",CV}	{"Диплом EE/ECE/Physics",Транскрипт,IELTS/TOEFL,"Мотивационное письмо",CV}	4.8	400	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
84	MSc Computer Science	Магистр информатики	60	IT	{English}	0	0	2 года	2026-04-15	t	{}	RWTH Aachen — бесплатно (~330 EUR соц. взнос). QS #106. Embedded systems, HPC, software engineering.	{"GPA 3.0+/4.0","IELTS 6.0+ / TOEFL 83+ или немецкий B2","Мотивационное письмо",CV}	{"Диплом CS/Math",Транскрипт,"IELTS/TOEFL или немецкий","Мотивационное письмо",CV}	4.7	600	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
85	MSc Data Science	Магистр Data Science	57	IT	{English}	0	0	2 года	2026-05-15	t	{}	LMU Munich QS #63. Программа DS с TU Munich. Бесплатное обучение. Мюнхен — #1 техно-хаб Германии.	{"GPA 3.0+/4.0","IELTS 6.5+ / TOEFL 88+","Мотивационное письмо",CV,"Математическая база"}	{"Диплом Math/CS/Statistics/Physics",Транскрипт,IELTS/TOEFL,"Мотивационное письмо",CV}	4.8	400	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
86	MSc Computer Science	Магистр компьютерных наук	94	IT	{English}	1500	1500	2 года	2026-12-01	t	{}	ETH Zurich QS #7. Alma mater Эйнштейна. ~730 CHF/семестр. Acceptance <10%. Лучший в Европе по CS.	{"GPA 3.5+/4.0","IELTS 7.0+ / TOEFL 95+","Мотивационное письмо (2 стр.)",CV,"2 рекомендации (опционально)"}	{"Диплом CS/Math/Engineering",Транскрипт,IELTS/TOEFL,"Мотивационное письмо",CV}	5	300	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
87	MSc Data Science	Магистр Data Science	95	IT	{English}	1500	1500	2 года	2026-11-15	t	{}	EPFL QS #17. ML, distributed systems, CERN partnerships. ~730 CHF/семестр. Женева-Лозанна.	{"GPA 3.5+/4.0","IELTS 7.0+ / TOEFL 100+","Мотивационное письмо",CV,"2 рекомендации"}	{"Диплом Math/CS/Engineering/Physics",Транскрипт,IELTS/TOEFL,"Мотивационное письмо","2 рекомендации",CV}	4.9	250	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
88	MSc Computational Science	Магистр вычислительных наук	95	IT	{English}	1500	1500	2 года	2026-11-15	t	{}	Уникальная программа на стыке CS, математики и науки. CERN, SIX Group, Nestlé R&D.	{"GPA 3.5+/4.0","IELTS 7.0+ / TOEFL 100+","Мотивационное письмо",CV,"Знание научного программирования"}	{"Диплом Math/Physics/CS",Транскрипт,IELTS/TOEFL,"Мотивационное письмо",CV,"2 рекомендации"}	4.8	150	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
89	MS Computer Science	Магистр компьютерных наук	66	IT	{English}	14000	14000	2 года	2026-01-15	t	{}	UofT — лидер AI (birthplace of deep learning). Vector Institute. 2 трека: thesis и coursework.	{"GPA 3.3+/4.0","TOEFL 100+ / IELTS 7.0+","3 рекомендации",SOP,CV,"GRE (опционально)"}	{"Диплом CS/Math/Engineering",Транскрипт,TOEFL/IELTS,"3 рекомендации",SOP,CV}	4.9	400	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
90	MSc Computer Science	Магистр компьютерных наук	67	IT	{English}	13000	13000	2 года	2026-01-15	t	{}	UBC CS QS #38. ML, computer graphics, systems. Amazon, Microsoft, SAP офисы рядом.	{"GPA 3.3+/4.0","TOEFL 100+ / IELTS 7.0+","3 рекомендации",SOP,CV}	{"Диплом CS/Math/Engineering",Транскрипт,TOEFL/IELTS,"3 рекомендации",SOP,CV}	4.8	300	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
91	MEng Computer Engineering	Магистр компьютерной инженерии	68	Engineering	{English}	15000	15000	2 года	2026-01-10	t	{}	McGill QS #30. MEng coursework 1 год. Монреаль — AI-хаб. MILA (Montreal AI institute) рядом.	{"GPA 3.0+/4.0","TOEFL 100+ / IELTS 6.5+","2 рекомендации",SOP,CV}	{"Диплом CE/CS/EE",Транскрипт,TOEFL/IELTS,"2 рекомендации",SOP,CV}	4.8	300	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
92	Master of Data Science	Магистр Data Science	69	IT	{English}	16000	16000	2 года	2026-02-01	t	{}	Waterloo MDS — 16 месяцев с Co-op. Google, Shopify, RBC. Silicon Valley of the North.	{"GPA 3.0+/4.0","TOEFL 100+ / IELTS 7.0+","3 рекомендации",SOP,"Python/R skills",Portfolio}	{"Диплом Math/Stats/CS",Транскрипт,TOEFL/IELTS,"3 рекомендации",SOP,CV,"Programming portfolio"}	4.8	200	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
93	MSc Computer Science	Магистр компьютерных наук	74	IT	{English}	18000	18000	2 года	2026-04-01	t	{}	TU Delft QS #57. Software technology, data science, cybersecurity.	{"GPA 3.0+/4.0","IELTS 6.5+ / TOEFL 90+","Мотивационное письмо",CV}	{"Диплом CS/Math/Engineering",Транскрипт,IELTS/TOEFL,"Мотивационное письмо",CV}	4.8	400	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
94	MSc Artificial Intelligence	Магистр ИИ	75	IT	{English}	14000	14000	2 года	2026-04-15	t	{}	UvA AI — Booking.com, Qualcomm, Microsoft Research Amsterdam. Европейский AI центр.	{"GPA 3.3+/4.0 (7.5/10)","IELTS 6.5+ / TOEFL 92+","Мотивационное письмо",CV,"2 рекомендации (рекомендуется)"}	{"Диплом CS/Math/Cognitive Science",Транскрипт,IELTS/TOEFL,"Мотивационное письмо",CV}	4.7	300	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
95	MS Computer Science	Магистр компьютерных наук	84	IT	{English}	22000	22000	2 года	2026-02-28	t	{}	NUS QS #8. 2 трека: coursework (1 год) и research (2 года). AI, security, systems.	{"GPA 3.0+/4.0","TOEFL 85+ / IELTS 6.0+","2 рекомендации",SOP,"GRE (рекомендуется)"}	{"Диплом CS/EE/Math",Транскрипт,TOEFL/IELTS,"2 рекомендации",SOP,CV}	4.9	500	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
96	MSc Artificial Intelligence	Магистр ИИ	85	IT	{English}	21000	21000	2 года	2026-02-28	t	{}	NTU QS #15. AI, robotics. NVIDIA AI Technology Centre на кампусе.	{"GPA 3.0+/4.0","TOEFL 85+ / IELTS 6.0+","2 рекомендации",SOP}	{"Диплом CS/EE/Math",Транскрипт,TOEFL/IELTS,"2 рекомендации",SOP,CV}	4.8	400	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
97	MS Computer Science	Магистр компьютерных наук	88	IT	{English}	5000	5000	2 года	2026-01-31	t	{}	UTokyo QS #28. Graduate School of Information Science. Обязателен научный руководитель.	{"GPA 3.0+/4.0","TOEFL 79+ / IELTS 6.5+","2 рекомендации","Research Plan","Предварительный контакт с профессором"}	{"Диплом CS/Math/Engineering",Транскрипт,TOEFL/IELTS,"2 рекомендации","Research Plan",CV}	4.8	200	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
98	MS Computer Science	Магистр компьютерных наук	86	IT	{English}	3000	3000	2 года	2026-03-01	t	{}	SNU QS #31. Самый престижный университет Кореи. AI, systems. Лидер в полупроводниках.	{"GPA 3.0+/4.0","TOEFL 80+ / IELTS 6.0+","2 рекомендации","Research Proposal","Предварительный контакт с профессором"}	{"Диплом CS/Math/Engineering",Транскрипт,TOEFL/IELTS,"2 рекомендации","Research Proposal",CV}	4.8	300	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
99	Master of Information Technology	Магистр информационных технологий	79	IT	{English}	32000	32000	2 года	2026-05-30	f	{}	UniMelb IT QS #13. CS, distributed computing, software engineering. Post-Study Work Visa до 4 лет.	{"GPA 3.0+/4.0","IELTS 6.5+ (каждый 6.0+) / TOEFL 79+","Personal Statement",CV}	{"Диплом IT/CS/Engineering",Транскрипт,IELTS/TOEFL,"Personal Statement",CV}	4.7	600	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
100	Master of Computing	Магистр вычислительной техники	80	IT	{English}	28000	28000	2 года	2026-05-01	f	{}	ANU QS #30. Национальный университет Австралии. Cybersecurity для государственных технологий.	{"GPA 3.0+/4.0","IELTS 6.5+ / TOEFL 80+","Personal Statement",CV}	{"Диплом IT/CS/Math",Транскрипт,IELTS/TOEFL,"Personal Statement",CV}	4.7	400	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
101	MSc Accounting & Audit	Бухгалтерский учёт и аудит	8	Finance	{Kazakh,Russian}	1100	\N	2 года	2026-07-01	f	{}	AlmaU — ведущий бизнес-университет. ACCA подготовка. Партнёрство с Ernst & Young Kazakhstan.	{"GPA 3.0+/4.0","Мотивационное письмо","2 рекомендации"}	{"Диплом бакалавра",Транскрипт,Удостоверение,"Мотивационное письмо","2 рекомендации","Фото 3x4"}	4.5	700	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
102	MSc Medicine — Pediatrics	Медицина — Педиатрия	13	Medicine	{Kazakh,Russian}	1200	\N	2 года	2026-07-30	f	{}	КГМУ — ведущий медицинский университет Центрального Казахстана. Клиническая педиатрия.	{"Диплом врача","Медицинская лицензия","Мотивационное письмо"}	{"Диплом врача",Транскрипт,"Медицинская лицензия",Удостоверение,"Мотивационное письмо",Медсправка,Фото}	4.4	400	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
103	MSc Civil Engineering	Строительство и архитектура	12	Engineering	{Kazakh,Russian}	780	\N	2 года	2026-08-15	f	{}	КарТУ — ведущий технический университет Карагандинской области.	{"Строительный или технический диплом","Мотивационное письмо"}	{"Диплом бакалавра",Транскрипт,Удостоверение,"Мотивационное письмо"}	4.3	500	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
104	MSc Environmental Engineering	Экологическая инженерия	14	Engineering	{Kazakh,Russian}	650	\N	2 года	2026-08-01	f	{}	ЗКУ — охрана окружающей среды нефтегазового региона западного Казахстана.	{"Технический или биологический диплом","Мотивационное письмо"}	{"Диплом бакалавра",Транскрипт,Удостоверение,"Мотивационное письмо"}	4.2	300	2026-04-30 07:26:15.468144	2026-04-30 07:26:15.468144
\.


--
-- Data for Name: universities; Type: TABLE DATA; Schema: public; Owner: abdugaffaromerbek
--

COPY public.universities (id, name, name_ru, city, country, website, is_kazakh, ranking, created_at) FROM stdin;
1	Nazarbayev University	Назарбаев Университет	Astana	Kazakhstan	https://nu.edu.kz	t	229	2026-04-28 14:17:26.556516
2	KBTU	Казахстанско-Британский технический университет	Almaty	Kazakhstan	https://kbtu.kz	t	801	2026-04-28 14:17:26.556516
3	Al-Farabi KazNU	КазНУ им. аль-Фараби	Almaty	Kazakhstan	https://kaznu.kz	t	301	2026-04-28 14:17:26.556516
4	Satbayev University	Университет Сатпаева	Almaty	Kazakhstan	https://satbayev.university	t	701	2026-04-28 14:17:26.556516
5	KIMEP University	Университет КИМЭП	Almaty	Kazakhstan	https://kimep.kz	t	\N	2026-04-28 14:17:26.556516
6	SDU University	Университет Сулеймана Демиреля	Kaskelen	Kazakhstan	https://sdu.edu.kz	t	\N	2026-04-28 14:17:26.556516
7	Narxoz University	Университет Нархоз	Almaty	Kazakhstan	https://narxoz.kz	t	\N	2026-04-28 14:17:26.556516
8	AlmaU	Almaty Management University	Almaty	Kazakhstan	https://almau.edu.kz	t	\N	2026-04-28 14:17:26.556516
9	Turan University	Университет Туран	Almaty	Kazakhstan	https://turan-edu.kz	t	\N	2026-04-28 14:17:26.556516
10	IITU	Международный университет информационных технологий	Almaty	Kazakhstan	https://iitu.edu.kz	t	\N	2026-04-28 14:17:26.556516
11	ENU	ЕНУ им. Л.Н. Гумилёва	Astana	Kazakhstan	https://enu.kz	t	601	2026-04-28 14:17:26.556516
12	Karaganda Technical University	Карагандинский технический университет	Karaganda	Kazakhstan	https://kstu.kz	t	\N	2026-04-28 14:17:26.556516
13	KGMU	Карагандинский медицинский университет	Karaganda	Kazakhstan	https://kgmu.kz	t	\N	2026-04-28 14:17:26.556516
14	West Kazakhstan University	ЗКУ им. М. Утемисова	Uralsk	Kazakhstan	https://wku.kz	t	\N	2026-04-28 14:17:26.556516
15	Alatau IT University	Alatau IT University	Almaty	Kazakhstan	https://aitu.edu.kz	t	\N	2026-04-28 14:17:26.556516
16	KazNAI	Казахская национальная академия искусств	Almaty	Kazakhstan	https://kaznai.kz	t	\N	2026-04-28 14:17:26.556516
17	MKTU	Международный казахско-турецкий университет	Turkestan	Kazakhstan	https://mktu.edu.kz	t	\N	2026-04-28 14:17:26.556516
18	Astana Medical University	Медицинский университет Астана	Astana	Kazakhstan	https://amu.kz	t	\N	2026-04-28 14:17:26.556516
19	KazUMO	КазУМОиМЯ им. Абылай хана	Almaty	Kazakhstan	https://ablaikhan.kz	t	\N	2026-04-28 14:17:26.556516
20	KRIU	Казахско-Российский международный университет	Aktobe	Kazakhstan	https://kriu.kz	t	\N	2026-04-28 14:17:26.556516
21	MIT	Массачусетский технологический институт	Cambridge	USA	https://mit.edu	f	1	2026-04-28 14:17:26.556516
22	Stanford University	Стэнфордский университет	Stanford	USA	https://stanford.edu	f	5	2026-04-28 14:17:26.556516
23	Harvard University	Гарвардский университет	Cambridge	USA	https://harvard.edu	f	4	2026-04-28 14:17:26.556516
24	Columbia University	Колумбийский университет	New York	USA	https://columbia.edu	f	12	2026-04-28 14:17:26.556516
25	NYU	Нью-Йоркский университет	New York	USA	https://nyu.edu	f	38	2026-04-28 14:17:26.556516
26	UC Berkeley	Калифорнийский университет Беркли	Berkeley	USA	https://berkeley.edu	f	10	2026-04-28 14:17:26.556516
27	Carnegie Mellon University	Университет Карнеги-Меллон	Pittsburgh	USA	https://cmu.edu	f	52	2026-04-28 14:17:26.556516
28	UCLA	Университет Калифорнии, Лос-Анджелес	Los Angeles	USA	https://ucla.edu	f	44	2026-04-28 14:17:26.556516
29	University of Pennsylvania	Университет Пенсильвании	Philadelphia	USA	https://upenn.edu	f	13	2026-04-28 14:17:26.556516
30	Yale University	Йельский университет	New Haven	USA	https://yale.edu	f	16	2026-04-28 14:17:26.556516
31	Duke University	Университет Дьюка	Durham	USA	https://duke.edu	f	66	2026-04-28 14:17:26.556516
32	Johns Hopkins University	Университет Джонса Хопкинса	Baltimore	USA	https://jhu.edu	f	31	2026-04-28 14:17:26.556516
33	Northwestern University	Северо-Западный университет	Evanston	USA	https://northwestern.edu	f	43	2026-04-28 14:17:26.556516
34	University of Michigan	Мичиганский университет	Ann Arbor	USA	https://umich.edu	f	33	2026-04-28 14:17:26.556516
35	Purdue University	Университет Пердью	West Lafayette	USA	https://purdue.edu	f	99	2026-04-28 14:17:26.556516
36	University of Wisconsin	Университет Висконсин	Madison	USA	https://wisc.edu	f	125	2026-04-28 14:17:26.556516
37	Arizona State University	Государственный университет Аризоны	Tempe	USA	https://asu.edu	f	216	2026-04-28 14:17:26.556516
38	Georgetown University	Джорджтаунский университет	Washington D.C.	USA	https://georgetown.edu	f	284	2026-04-28 14:17:26.556516
39	Vanderbilt University	Университет Вандербильта	Nashville	USA	https://vanderbilt.edu	f	186	2026-04-28 14:17:26.556516
40	Emory University	Университет Эмори	Atlanta	USA	https://emory.edu	f	237	2026-04-28 14:17:26.556516
41	University of Oxford	Оксфордский университет	Oxford	UK	https://ox.ac.uk	f	3	2026-04-28 14:17:26.556516
42	University of Cambridge	Кембриджский университет	Cambridge	UK	https://cam.ac.uk	f	2	2026-04-28 14:17:26.556516
43	Imperial College London	Имперский колледж Лондона	London	UK	https://imperial.ac.uk	f	8	2026-04-28 14:17:26.556516
44	UCL	Университетский колледж Лондона	London	UK	https://ucl.ac.uk	f	9	2026-04-28 14:17:26.556516
45	LSE	Лондонская школа экономики	London	UK	https://lse.ac.uk	f	45	2026-04-28 14:17:26.556516
46	University of Edinburgh	Эдинбургский университет	Edinburgh	UK	https://ed.ac.uk	f	27	2026-04-28 14:17:26.556516
47	University of Manchester	Манчестерский университет	Manchester	UK	https://manchester.ac.uk	f	34	2026-04-28 14:17:26.556516
48	Kings College London	Королевский колледж Лондона	London	UK	https://kcl.ac.uk	f	40	2026-04-28 14:17:26.556516
49	University of Warwick	Уорикский университет	Coventry	UK	https://warwick.ac.uk	f	69	2026-04-28 14:17:26.556516
50	University of Bristol	Бристольский университет	Bristol	UK	https://bristol.ac.uk	f	55	2026-04-28 14:17:26.556516
51	Durham University	Даремский университет	Durham	UK	https://dur.ac.uk	f	95	2026-04-28 14:17:26.556516
52	University of Glasgow	Университет Глазго	Glasgow	UK	https://gla.ac.uk	f	77	2026-04-28 14:17:26.556516
53	University of Leeds	Университет Лидса	Leeds	UK	https://leeds.ac.uk	f	90	2026-04-28 14:17:26.556516
54	University of Nottingham	Ноттингемский университет	Nottingham	UK	https://nottingham.ac.uk	f	104	2026-04-28 14:17:26.556516
55	University of Sheffield	Шеффилдский университет	Sheffield	UK	https://sheffield.ac.uk	f	113	2026-04-28 14:17:26.556516
56	TU Munich	Технический университет Мюнхена	Munich	Germany	https://tum.de	f	37	2026-04-28 14:17:26.556516
57	LMU Munich	Университет Людвига-Максимилиана	Munich	Germany	https://lmu.de	f	63	2026-04-28 14:17:26.556516
58	Humboldt University Berlin	Университет Гумбольдта	Berlin	Germany	https://hu-berlin.de	f	120	2026-04-28 14:17:26.556516
59	Heidelberg University	Гейдельбергский университет	Heidelberg	Germany	https://uni-heidelberg.de	f	87	2026-04-28 14:17:26.556516
60	RWTH Aachen	РВТХ Аахен	Aachen	Germany	https://rwth-aachen.de	f	106	2026-04-28 14:17:26.556516
61	University of Hamburg	Гамбургский университет	Hamburg	Germany	https://uni-hamburg.de	f	179	2026-04-28 14:17:26.556516
62	Goethe University Frankfurt	Университет Гёте во Франкфурте	Frankfurt	Germany	https://uni-frankfurt.de	f	317	2026-04-28 14:17:26.556516
63	University of Stuttgart	Штутгартский университет	Stuttgart	Germany	https://uni-stuttgart.de	f	344	2026-04-28 14:17:26.556516
64	University of Cologne	Кёльнский университет	Cologne	Germany	https://uni-koeln.de	f	222	2026-04-28 14:17:26.556516
65	TU Dresden	Дрезденский технический университет	Dresden	Germany	https://tu-dresden.de	f	202	2026-04-28 14:17:26.556516
66	University of Toronto	Университет Торонто	Toronto	Canada	https://utoronto.ca	f	25	2026-04-28 14:17:26.556516
67	UBC	Университет Британской Колумбии	Vancouver	Canada	https://ubc.ca	f	38	2026-04-28 14:17:26.556516
68	McGill University	Университет Макгилла	Montreal	Canada	https://mcgill.ca	f	30	2026-04-28 14:17:26.556516
69	University of Waterloo	Университет Ватерлоо	Waterloo	Canada	https://uwaterloo.ca	f	154	2026-04-28 14:17:26.556516
70	Queens University	Королевский университет	Kingston	Canada	https://queensu.ca	f	246	2026-04-28 14:17:26.556516
71	University of Alberta	Университет Альберты	Edmonton	Canada	https://ualberta.ca	f	111	2026-04-28 14:17:26.556516
72	McMaster University	Университет Макмастера	Hamilton	Canada	https://mcmaster.ca	f	189	2026-04-28 14:17:26.556516
73	University of Calgary	Университет Калгари	Calgary	Canada	https://ucalgary.ca	f	235	2026-04-28 14:17:26.556516
74	TU Delft	Делфтский технический университет	Delft	Netherlands	https://tudelft.nl	f	57	2026-04-28 14:17:26.556516
75	University of Amsterdam	Амстердамский университет	Amsterdam	Netherlands	https://uva.nl	f	58	2026-04-28 14:17:26.556516
76	Leiden University	Лейденский университет	Leiden	Netherlands	https://leiden.edu	f	128	2026-04-28 14:17:26.556516
77	Utrecht University	Утрехтский университет	Utrecht	Netherlands	https://uu.nl	f	96	2026-04-28 14:17:26.556516
78	University of Groningen	Гронингенский университет	Groningen	Netherlands	https://rug.nl	f	186	2026-04-28 14:17:26.556516
79	University of Melbourne	Мельбурнский университет	Melbourne	Australia	https://unimelb.edu.au	f	13	2026-04-28 14:17:26.556516
80	ANU	Австралийский национальный университет	Canberra	Australia	https://anu.edu.au	f	30	2026-04-28 14:17:26.556516
81	University of Sydney	Сиднейский университет	Sydney	Australia	https://sydney.edu.au	f	18	2026-04-28 14:17:26.556516
82	University of Queensland	Квинслендский университет	Brisbane	Australia	https://uq.edu.au	f	40	2026-04-28 14:17:26.556516
83	Monash University	Университет Монаш	Melbourne	Australia	https://monash.edu	f	57	2026-04-28 14:17:26.556516
84	NUS	Национальный университет Сингапура	Singapore	Singapore	https://nus.edu.sg	f	8	2026-04-28 14:17:26.556516
85	NTU Singapore	Наньянский технологический университет	Singapore	Singapore	https://ntu.edu.sg	f	15	2026-04-28 14:17:26.556516
86	Seoul National University	Сеульский национальный университет	Seoul	South Korea	https://snu.ac.kr	f	31	2026-04-28 14:17:26.556516
87	KAIST	Корейский институт науки и технологий	Daejeon	South Korea	https://kaist.ac.kr	f	65	2026-04-28 14:17:26.556516
88	University of Tokyo	Токийский университет	Tokyo	Japan	https://u-tokyo.ac.jp	f	28	2026-04-28 14:17:26.556516
89	Kyoto University	Университет Киото	Kyoto	Japan	https://kyoto-u.ac.jp	f	46	2026-04-28 14:17:26.556516
90	Tsinghua University	Университет Цинхуа	Beijing	China	https://tsinghua.edu.cn	f	25	2026-04-28 14:17:26.556516
91	Fudan University	Университет Фудань	Shanghai	China	https://fudan.edu.cn	f	64	2026-04-28 14:17:26.556516
92	HKU	Университет Гонконга	Hong Kong	Hong Kong	https://hku.hk	f	26	2026-04-28 14:17:26.556516
93	HKUST	Университет науки и технологий Гонконга	Hong Kong	Hong Kong	https://ust.hk	f	47	2026-04-28 14:17:26.556516
94	ETH Zurich	ЕТН Цюрих	Zurich	Switzerland	https://ethz.ch	f	7	2026-04-28 14:17:26.556516
95	EPFL	Федеральная политехническая школа Лозанны	Lausanne	Switzerland	https://epfl.ch	f	17	2026-04-28 14:17:26.556516
96	KU Leuven	Католический университет Лёвена	Leuven	Belgium	https://kuleuven.be	f	75	2026-04-28 14:17:26.556516
97	University of Copenhagen	Копенгагенский университет	Copenhagen	Denmark	https://ku.dk	f	92	2026-04-28 14:17:26.556516
98	University of Helsinki	Хельсинкский университет	Helsinki	Finland	https://helsinki.fi	f	107	2026-04-28 14:17:26.556516
99	University of Vienna	Венский университет	Vienna	Austria	https://univie.ac.at	f	187	2026-04-28 14:17:26.556516
100	Aalto University	Университет Аалто	Espoo	Finland	https://aalto.fi	f	115	2026-04-28 14:17:26.556516
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: abdugaffaromerbek
--

COPY public.users (id, email, name, password, role, created_at) FROM stdin;
1	ergraxa@gmail.com	Raxa	$2b$12$BYbJ/RyBzUn6jlkxPGz6i.ka6Mc7GhUCoBfpkCajB3Vza19L6Z0nq	user	2026-04-28 18:29:38.188202
\.


--
-- Name: applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: abdugaffaromerbek
--

SELECT pg_catalog.setval('public.applications_id_seq', 1, false);


--
-- Name: checklist_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: abdugaffaromerbek
--

SELECT pg_catalog.setval('public.checklist_items_id_seq', 1, false);


--
-- Name: favorites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: abdugaffaromerbek
--

SELECT pg_catalog.setval('public.favorites_id_seq', 1, false);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: abdugaffaromerbek
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- Name: programs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: abdugaffaromerbek
--

SELECT pg_catalog.setval('public.programs_id_seq', 104, true);


--
-- Name: universities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: abdugaffaromerbek
--

SELECT pg_catalog.setval('public.universities_id_seq', 100, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: abdugaffaromerbek
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: abdugaffaromerbek
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (id);


--
-- Name: checklist_items checklist_items_pkey; Type: CONSTRAINT; Schema: public; Owner: abdugaffaromerbek
--

ALTER TABLE ONLY public.checklist_items
    ADD CONSTRAINT checklist_items_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: abdugaffaromerbek
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: abdugaffaromerbek
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: programs programs_pkey; Type: CONSTRAINT; Schema: public; Owner: abdugaffaromerbek
--

ALTER TABLE ONLY public.programs
    ADD CONSTRAINT programs_pkey PRIMARY KEY (id);


--
-- Name: universities universities_pkey; Type: CONSTRAINT; Schema: public; Owner: abdugaffaromerbek
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: abdugaffaromerbek
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: abdugaffaromerbek
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: applications applications_program_id_programs_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: abdugaffaromerbek
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_program_id_programs_id_fk FOREIGN KEY (program_id) REFERENCES public.programs(id);


--
-- Name: applications applications_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: abdugaffaromerbek
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: checklist_items checklist_items_program_id_programs_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: abdugaffaromerbek
--

ALTER TABLE ONLY public.checklist_items
    ADD CONSTRAINT checklist_items_program_id_programs_id_fk FOREIGN KEY (program_id) REFERENCES public.programs(id);


--
-- Name: checklist_items checklist_items_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: abdugaffaromerbek
--

ALTER TABLE ONLY public.checklist_items
    ADD CONSTRAINT checklist_items_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: favorites favorites_program_id_programs_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: abdugaffaromerbek
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_program_id_programs_id_fk FOREIGN KEY (program_id) REFERENCES public.programs(id);


--
-- Name: favorites favorites_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: abdugaffaromerbek
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: notifications notifications_program_id_programs_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: abdugaffaromerbek
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_program_id_programs_id_fk FOREIGN KEY (program_id) REFERENCES public.programs(id);


--
-- Name: notifications notifications_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: abdugaffaromerbek
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: programs programs_university_id_universities_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: abdugaffaromerbek
--

ALTER TABLE ONLY public.programs
    ADD CONSTRAINT programs_university_id_universities_id_fk FOREIGN KEY (university_id) REFERENCES public.universities(id);


--
-- PostgreSQL database dump complete
--

\unrestrict rVMPLTLmsEvcYzHzWgbMx8KtU1VFUhGFaXWAlfnr5Ebj08laDsfyuRbTKgP2pCm

