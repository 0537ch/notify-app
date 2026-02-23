--
-- PostgreSQL database dump
--

\restrict aKObQX34ghZ3EzJBL3l2XpP7wVB3018sVxUgqnyAjz1V7MOQtzw5sEUHgpzRyPS

-- Dumped from database version 17.8 (6108b59)
-- Dumped by pg_dump version 18.1

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

--
-- Name: notification_status_enum; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.notification_status_enum AS ENUM (
    'not_yet',
    'success',
    'failed'
);


ALTER TYPE public.notification_status_enum OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: imports; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.imports (
    id integer NOT NULL,
    file_name text NOT NULL,
    uploaded_at timestamp with time zone DEFAULT now(),
    is_active boolean DEFAULT true
);


ALTER TABLE public.imports OWNER TO neondb_owner;

--
-- Name: imports_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.imports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.imports_id_seq OWNER TO neondb_owner;

--
-- Name: imports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.imports_id_seq OWNED BY public.imports.id;


--
-- Name: rows; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.rows (
    id integer NOT NULL,
    import_id integer NOT NULL,
    data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    notification_status public.notification_status_enum DEFAULT 'not_yet'::public.notification_status_enum,
    notification_sent_at timestamp without time zone,
    notification_error text
);


ALTER TABLE public.rows OWNER TO neondb_owner;

--
-- Name: rows_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.rows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rows_id_seq OWNER TO neondb_owner;

--
-- Name: rows_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.rows_id_seq OWNED BY public.rows.id;


--
-- Name: imports id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.imports ALTER COLUMN id SET DEFAULT nextval('public.imports_id_seq'::regclass);


--
-- Name: rows id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.rows ALTER COLUMN id SET DEFAULT nextval('public.rows_id_seq'::regclass);


--
-- Data for Name: imports; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.imports (id, file_name, uploaded_at, is_active) FROM stdin;
22      invoice-template2.csv   2026-02-20 01:29:19.146114+00   f
25      Format template email.csv       2026-02-23 03:14:57.780752+00   t
\.


--
-- Data for Name: rows; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.rows (id, import_id, data, created_at, notification_status, notification_sent_at, notification_error) FROM stdin;
386     25      {"Email": "rio.prismarendra@tps.co.id", "Nama Bank": "BANK NEGARA INDONESIA PT.", "Invoice To": "PT. SMART INTERCONTINENTAL LOGISTICS", "No Invoice": "8068352", "No Rekening": "2502507878", "No Job Order": "202512I12186", "Customer Name": "PT. SMART INTERCONTINENTAL LOGISTICS", " Nilai Diskon \\r": "594,000", " Nilai Invoice ": "990,000", "Customer Master": "18591"}        2026-02-23 03:14:57.911354+00   not_yet \N      \N
387     25      {"Email": "rio.prismarendra@tps.co.id", "Nama Bank": "BANK NEGARA INDONESIA PT.", "Invoice To": "PT. SMART INTERCONTINENTAL LOGISTICS", "No Invoice": "8068360", "No Rekening": "2502507878", "No Job Order": "202512I12190", "Customer Name": "PT. SMART INTERCONTINENTAL LOGISTICS", " Nilai Diskon \\r": "97,920", " Nilai Invoice ": "163,200", "Customer Master": "18591"} 2026-02-23 03:14:58.048992+00   not_yet \N      \N
388     25      {"Email": "rio.prismarendra@tps.co.id", "Nama Bank": "BANK CIMB NIAGA PT.", "Invoice To": "PT. MULTI PAKAN JAYA SENTOSA", "No Invoice": "8063445", "No Rekening": "800174000000", "No Job Order": "202512I10139", "Customer Name": "PT.ANUGERAH MULTI LOGISTIK", " Nilai Diskon \\r": "1,175,040", " Nilai Invoice ": "2,937,600", "Customer Master": "16581"}  2026-02-23 03:14:58.180501+00   not_yet \N      \N
389     25      {"Email": "rio.prismarendra@tps.co.id", "Nama Bank": "BANK JATIM PT.", "Invoice To": "CV. ABADI JAYA RAYA", "No Invoice": "8063376", "No Rekening": "332454145", "No Job Order": "202512I10158", "Customer Name": "PT. ARTHA BERKAT MULIA", " Nilai Diskon \\r": "396,000", " Nilai Invoice ": "990,000", "Customer Master": "15610"}   2026-02-23 03:14:58.321269+00   not_yet \N      \N
390     25      {"Email": "rio.prismarendra@tps.co.id", "Nama Bank": "BANK JATIM PT.", "Invoice To": "PT. TRADING SAKTI ASIA", "No Invoice": "8063362", "No Rekening": "332454145", "No Job Order": "202512I10160", "Customer Name": "PT. ARTHA BERKAT MULIA", " Nilai Diskon \\r": "396,000", " Nilai Invoice ": "990,000", "Customer Master": "15610"}        2026-02-23 03:14:58.468865+00   not_yet \N      \N
391     25      {"Email": "rio.prismarendra@tps.co.id", "Nama Bank": "BANK JATIM PT.", "Invoice To": "PT. DMX TRADING INDONESIA", "No Invoice": "8063196", "No Rekening": "332454145", "No Job Order": "202512I10163", "Customer Name": "PT. ARTHA BERKAT MULIA", " Nilai Diskon \\r": "1,188,000", " Nilai Invoice ": "17,820,000", "Customer Master": "15610"}        2026-02-23 03:14:58.590451+00   not_yet \N      \N
392     25      {"Email": "rio.prismarendra@tps.co.id", "Nama Bank": "BANK JATIM PT.", "Invoice To": "CV. HARMONI ALAM LESTARI", "No Invoice": "8064430", "No Rekening": "332454145", "No Job Order": "202512I10171", "Customer Name": "PT. ARTHA BERKAT MULIA", " Nilai Diskon \\r": "4,950,000", " Nilai Invoice ": "10,890,000", "Customer Master": "15610"} 2026-02-23 03:14:58.741079+00   not_yet \N      \N
393     25      {"Email": "rio.prismarendra@tps.co.id", "Nama Bank": "BANK JATIM PT.", "Invoice To": "PT. BOGA KARYA WIJAYA", "No Invoice": "8068349", "No Rekening": "332454145", "No Job Order": "202512I11198", "Customer Name": "PT. ARTHA BERKAT MULIA", " Nilai Diskon \\r": "2,970,000", " Nilai Invoice ": "5,940,000", "Customer Master": "15610"}     2026-02-23 03:14:58.878756+00   not_yet \N      \N
394     25      {"Email": "rio.prismarendra@tps.co.id", "Nama Bank": "BANK JATIM PT.", "Invoice To": "PT. BOGA KARYA WIJAYA", "No Invoice": "8068068", "No Rekening": "332454145", "No Job Order": "202512I11202", "Customer Name": "PT. ARTHA BERKAT MULIA", " Nilai Diskon \\r": "990,000", " Nilai Invoice ": "1,980,000", "Customer Master": "15610"}       2026-02-23 03:14:59.020534+00   not_yet \N      \N
395     25      {"Email": "rio.prismarendra@tps.co.id", "Nama Bank": "BANK NEGARA INDONESIA PT.", "Invoice To": "CV. CITRA SAMUDERA JAYA", "No Invoice": "8063343", "No Rekening": "2020419999", "No Job Order": "202512I09963", "Customer Name": "RAJAWALI SATU NUSA PT.", " Nilai Diskon \\r": "195,840", " Nilai Invoice ": "489,600", "Customer Master": "15464"}   2026-02-23 03:14:59.171214+00   not_yet \N      \N
396     25      {"Email": "rio.prismarendra@tps.co.id", "Nama Bank": "BANK JATIM PT.", "Invoice To": "PT. KARANA PANORAMA LOGISTIK", "No Invoice": "8068364", "No Rekening": "331014389", "No Job Order": "202512I12224", "Customer Name": "PT. KARANA PANORAMA LOGISTIK", " Nilai Diskon \\r": "783,360", " Nilai Invoice ": "1,468,800", "Customer Master": "15216"}  2026-02-23 03:14:59.308651+00   not_yet \N      \N
397     25      {"Email": "rio.prismarendra@tps.co.id", "Nama Bank": "BANK JATIM PT.", "Invoice To": "PT. KARANA PANORAMA LOGISTIK", "No Invoice": "8068358", "No Rekening": "331014389", "No Job Order": "202512I12227", "Customer Name": "PT. KARANA PANORAMA LOGISTIK", " Nilai Diskon \\r": "391,680", " Nilai Invoice ": "734,400", "Customer Master": "15216"}    2026-02-23 03:14:59.440303+00   not_yet \N      \N
398     25      {"Email": "rio.setiady@gmail.com", "Nama Bank": "BANK MANDIRI PT.", "Invoice To": "SURYA SAMUDERA GLOBAL PT.", "No Invoice": "8063398", "No Rekening": "1400020000000", "No Job Order": "202512I10209", "Customer Name": "SURYA SAMUDERA GLOBAL PT.", " Nilai Diskon \\r": "587,520", " Nilai Invoice ": "1,468,800", "Customer Master": "14866"}       2026-02-23 03:14:59.571145+00   not_yet \N      \N
399     25      {"Email": "rio.setiady@gmail.com", "Nama Bank": "BANK MANDIRI PT.", "Invoice To": "CAKRAINDO MITRA INTERNASIONAL PT.", "No Invoice": "8063284", "No Rekening": "1680080000000", "No Job Order": "202512I08116", "Customer Name": "CAKRAINDO MITRA INTERNASIONAL PT.", " Nilai Diskon \\r": "690,640", " Nilai Invoice ": "2,779,600", "Customer Master": "14747"}       2026-02-23 03:14:59.719613+00   not_yet \N      \N
400     25      {"Email": "rio.setiady@gmail.com", "Nama Bank": "BANK CIMB NIAGA PT.", "Invoice To": "CONNEXINDO INTERNATIONAL JAYA PT.", "No Invoice": "8063368", "No Rekening": "800197000000", "No Job Order": "202512I09983", "Customer Name": "CONNEXINDO INTERNATIONAL JAYA PT.", " Nilai Diskon \\r": "-", " Nilai Invoice ": "", "Customer Master": "14695"}    2026-02-23 03:14:59.870441+00   not_yet \N      \N
401     25      {"Email": "rio.setiady@gmail.com", "Nama Bank": "BANK RAKYAT INDONESIA PT.", "Invoice To": "PT. PABRIK KERTAS TJIWI KIMIA TBK", "No Invoice": "8063373", "No Rekening": "123301000000000", "No Job Order": "202512I09968", "Customer Name": "SURYA BUANA SENTOSA PT.", " Nilai Diskon \\r": "97,920", " Nilai Invoice ": "163,200", "Customer Master": "14460"} 2026-02-23 03:15:00.001179+00   not_yet \N      \N
402     25      {"Email": "rio.setiady@gmail.com", "Nama Bank": "BANK RAKYAT INDONESIA PT.", "Invoice To": "SURYA BUANA SENTOSA PT.", "No Invoice": "8063457", "No Rekening": "123301000000000", "No Job Order": "202512I10002", "Customer Name": "SURYA BUANA SENTOSA PT.", " Nilai Diskon \\r": "783,360", " Nilai Invoice ": "1,958,400", "Customer Master": "14460"}        2026-02-23 03:15:00.148766+00   not_yet \N      \N
403     25      {"Email": "rio.setiady@gmail.com", "Nama Bank": "BANK RAKYAT INDONESIA PT.", "Invoice To": "SURYA BUANA SENTOSA PT.", "No Invoice": "8063255", "No Rekening": "123301000000000", "No Job Order": "202512I10024", "Customer Name": "SURYA BUANA SENTOSA PT.", " Nilai Diskon \\r": "391,680", " Nilai Invoice ": "979,200", "Customer Master": "14460"}  2026-02-23 03:15:00.280505+00   not_yet \N      \N
404     25      {"Email": "rio.setiady@gmail.com", "Nama Bank": "BANK RAKYAT INDONESIA PT.", "Invoice To": "SURYA BUANA SENTOSA PT.", "No Invoice": "8063287", "No Rekening": "123301000000000", "No Job Order": "202512I10213", "Customer Name": "SURYA BUANA SENTOSA PT.", " Nilai Diskon \\r": "881,280", " Nilai Invoice ": "4,406,400", "Customer Master": "14460"}        2026-02-23 03:15:00.4082+00     not_yet \N      \N
405     25      {"Email": "rio.setiady@gmail.com", "Nama Bank": "BANK RAKYAT INDONESIA PT.", "Invoice To": "SURYA BUANA SENTOSA PT.", "No Invoice": "8063342", "No Rekening": "123301000000000", "No Job Order": "202512I10214", "Customer Name": "SURYA BUANA SENTOSA PT.", " Nilai Diskon \\r": "587,520", " Nilai Invoice ": "4,896,000", "Customer Master": "14460"}        2026-02-23 03:15:00.528924+00   not_yet \N      \N
406     25      {"Email": "ikhsan.efendi@tps.co.id", "Nama Bank": "BANK NEGARA INDONESIA PT.", "Invoice To": "ROYAL SUTAN AGUNG PT.", "No Invoice": "8063233", "No Rekening": "1828282817", "No Job Order": "202512I09995", "Customer Name": "ANUGRAH LAUTAN NUSANTARA PT.", " Nilai Diskon \\r": "587,520", " Nilai Invoice ": "979,200", "Customer Master": "13263"}  2026-02-23 03:15:00.66038+00    not_yet \N      \N
407     25      {"Email": "ikhsan.efendi@tps.co.id", "Nama Bank": "BANK CIMB NIAGA PT.", "Invoice To": "ADIPRIMA SURAPRINTA PT.", "No Invoice": "8063454", "No Rekening": "800163000000", "No Job Order": "202512I10181", "Customer Name": "PANCA PILAR PERKASA PT.", " Nilai Diskon \\r": "-", " Nilai Invoice ": "", "Customer Master": "13184"}      2026-02-23 03:15:00.811141+00   not_yet \N      \N
408     25      {"Email": "ikhsan.efendi@tps.co.id", "Nama Bank": "BANK CIMB NIAGA PT.", "Invoice To": "PANCA PILAR PERKASA PT.", "No Invoice": "8063185", "No Rekening": "800163000000", "No Job Order": "202512I10189", "Customer Name": "PANCA PILAR PERKASA PT.", " Nilai Diskon \\r": "198,000", " Nilai Invoice ": "495,000", "Customer Master": "13184"} 2026-02-23 03:15:00.948893+00   not_yet \N      \N
409     25      {"Email": "ikhsan.efendi@tps.co.id", "Nama Bank": "BANK CIMB NIAGA PT.", "Invoice To": "PT. ERATEX DJAJA TBK.", "No Invoice": "8068379", "No Rekening": "800124000000", "No Job Order": "202512I11418", "Customer Name": "ANUGERAH MANDIRI INTERNASIONAL TRANS. PT", " Nilai Diskon \\r": "391,680", " Nilai Invoice ": "734,400", "Customer Master": "13043"}  2026-02-23 03:15:01.082545+00   not_yet \N      \N
410     25      {"Email": "ikhsan.efendi@tps.co.id", "Nama Bank": "BANK NEGARA INDONESIA PT.", "Invoice To": "GIGAN TRANS LOGISTICS. PT", "No Invoice": "8063191", "No Rekening": "2008789999", "No Job Order": "202512I09867", "Customer Name": "GIGAN TRANS LOGISTICS. PT", " Nilai Diskon \\r": "97,920", " Nilai Invoice ": "163,200", "Customer Master": "12938"}  2026-02-23 03:15:01.221184+00   not_yet \N      \N
411     25      {"Email": "ikhsan.efendi@tps.co.id", "Nama Bank": "BANK NEGARA INDONESIA PT.", "Invoice To": "GIGAN TRANS LOGISTICS. PT", "No Invoice": "8064301", "No Rekening": "2008789999", "No Job Order": "202512I09999", "Customer Name": "GIGAN TRANS LOGISTICS. PT", " Nilai Diskon \\r": "97,920", " Nilai Invoice ": "163,200", "Customer Master": "12938"}  2026-02-23 03:15:01.379056+00   not_yet \N      \N
412     25      {"Email": "ikhsan.efendi@tps.co.id", "Nama Bank": "BANK JATIM PT.", "Invoice To": "AMAN WORLD LOGISTICS PT.", "No Invoice": "8064302", "No Rekening": "331009237", "No Job Order": "202512I09673", "Customer Name": "AMAN WORLD LOGISTICS PT.", " Nilai Diskon \\r": "195,840", " Nilai Invoice ": "326,400", "Customer Master": "12781"}       2026-02-23 03:15:01.49156+00    not_yet \N      \N
413     25      {"Email": "ikhsan.efendi@tps.co.id", "Nama Bank": "BANK CIMB NIAGA PT.", "Invoice To": "CV PARIPARI PRIMA SEGAR", "No Invoice": "8063370", "No Rekening": "800140000000", "No Job Order": "202512I10185", "Customer Name": "INDOTRANS MANDIRI PT.", " Nilai Diskon \\r": "396,000", " Nilai Invoice ": "990,000", "Customer Master": "12456"}   2026-02-23 03:15:01.631069+00   not_yet \N      \N
414     25      {"Email": "ikhsan.efendi@tps.co.id", "Nama Bank": "BANK JATIM PT.", "Invoice To": "KORMAN WAHANA TRANSINDO PT.", "No Invoice": "8063456", "No Rekening": "331012998", "No Job Order": "202512I10173", "Customer Name": "KORMAN WAHANA TRANSINDO PT.", " Nilai Diskon \\r": "979,200", " Nilai Invoice ": "1,632,000", "Customer Master": "12301"}       2026-02-23 03:15:01.7999+00     not_yet \N      \N
415     25      {"Email": "ikhsan.efendi@tps.co.id", "Nama Bank": "BANK JATIM PT.", "Invoice To": "JAPFA COMFEED INDONESIA TBK, PT", "No Invoice": "8068321", "No Rekening": "331012998", "No Job Order": "202512I11356", "Customer Name": "KORMAN WAHANA TRANSINDO PT.", " Nilai Diskon \\r": "9,987,840", " Nilai Invoice ": "24,480,000", "Customer Master": "12301"}        2026-02-23 03:15:02.000635+00   not_yet \N      \N
416     25      {"Email": "ikhsan.efendi@tps.co.id", "Nama Bank": "BANK JATIM PT.", "Invoice To": "JAPFA COMFEED INDONESIA TBK, PT", "No Invoice": "8068326", "No Rekening": "331012998", "No Job Order": "202512I11359", "Customer Name": "KORMAN WAHANA TRANSINDO PT.", " Nilai Diskon \\r": "5,385,600", " Nilai Invoice ": "11,260,800", "Customer Master": "12301"}        2026-02-23 03:15:02.13104+00    not_yet \N      \N
417     25      {"Email": "ikhsan.efendi@tps.co.id", "Nama Bank": "BANK JATIM PT.", "Invoice To": "KORMAN WAHANA TRANSINDO PT.", "No Invoice": "8068372", "No Rekening": "331012998", "No Job Order": "202512I11363", "Customer Name": "KORMAN WAHANA TRANSINDO PT.", " Nilai Diskon \\r": "587,520", " Nilai Invoice ": "979,200", "Customer Master": "12301"} 2026-02-23 03:15:02.276744+00   not_yet \N      \N
418     25      {"Email": "ikhsan.efendi@tps.co.id", "Nama Bank": "BANK CIMB NIAGA PT.", "Invoice To": "PT VINDA INTERNATIONAL INDONESIA", "No Invoice": "8068381", "No Rekening": "800116000000", "No Job Order": "202512I11625", "Customer Name": "PUSAKA LINTAS SAMUDRA PT.", " Nilai Diskon \\r": "195,840", " Nilai Invoice ": "326,400", "Customer Master": "11257"}      2026-02-23 03:15:02.410606+00   not_yet \N      \N
419     25      {"Email": "ikhsan.efendi@tps.co.id", "Nama Bank": "BANK CIMB NIAGA PT.", "Invoice To": "PUSAKA LINTAS SAMUDRA PT.", "No Invoice": "8068399", "No Rekening": "800116000000", "No Job Order": "202512I12278", "Customer Name": "PUSAKA LINTAS SAMUDRA PT.", " Nilai Diskon \\r": "-", " Nilai Invoice ": "", "Customer Master": "11257"}  2026-02-23 03:15:02.531118+00   not_yet \N      \N
420     25      {"Email": "ikhsan.efendi@tps.co.id", "Nama Bank": "BANK NEGARA INDONESIA PT.", "Invoice To": "LINTAS NIAGA JAYA PT.", "No Invoice": "8063397", "No Rekening": "98656059", "No Job Order": "202512I10121", "Customer Name": "LINTAS NIAGA JAYA PT.", " Nilai Diskon \\r": "1,175,040", " Nilai Invoice ": "2,448,000", "Customer Master": "11208"}       2026-02-23 03:15:02.658663+00   not_yet \N      \N
421     25      {"Email": "ikhsan.efendi@tps.co.id", "Nama Bank": "BANK CIMB NIAGA PT.", "Invoice To": "ALU AKSARA PRATAMA  PT.", "No Invoice": "8068382", "No Rekening": "800124000000", "No Job Order": "202512I11508", "Customer Name": "TRANSINDRA PERKASA PT.", " Nilai Diskon \\r": "1,126,080", " Nilai Invoice ": "1,876,800", "Customer Master": "10263"}      2026-02-23 03:15:02.790642+00   not_yet \N      \N
422     25      {"Email": "ikhsan.efendi@tps.co.id", "Nama Bank": "BANK CIMB NIAGA PT.", "Invoice To": "JAPFA COMFEED INDONESIA TBK, PT", "No Invoice": "8068059", "No Rekening": "800116000000", "No Job Order": "202512I11294", "Customer Name": "JAPFA COMFEED INDONESIA TBK, PT", " Nilai Diskon \\r": "1,664,640", " Nilai Invoice ": "3,427,200", "Customer Master": "10117"}     2026-02-23 03:15:02.921062+00   not_yet \N      \N
423     25      {"Email": "ikhsan.efendi@tps.co.id", "Nama Bank": "BANK CIMB NIAGA PT.", "Invoice To": "JAPFA COMFEED INDONESIA TBK, PT", "No Invoice": "8068351", "No Rekening": "800116000000", "No Job Order": "202512I11295", "Customer Name": "JAPFA COMFEED INDONESIA TBK, PT", " Nilai Diskon \\r": "5,189,760", " Nilai Invoice ": "11,260,800", "Customer Master": "10117"}    2026-02-23 03:15:03.056819+00   not_yet \N      \N
300     22      {"Email": "ikhsan.efendi@tps.co.id", "Nilai": "1000000", "Invoice": "1236", "NamaBank": "Bank Mandiri", "NoRekening": "345345345", "NilaiDiskon\\r": "100000", "NamaPerusahaan": "PT. Semoga Banyak Duit", "NamaPemegangRek": "Surya Ganm"}     2026-02-20 01:29:19.391366+00   success 2026-02-23 01:41:51.150938      \N
301     22      {"Email": "ikhsan.efendi@tps.co.id", "Nilai": "4000000", "Invoice": "1238", "NamaBank": "Bank Mandiri", "NoRekening": "345345345", "NilaiDiskon\\r": "400000", "NamaPerusahaan": "PT. Semoga Banyak Duit", "NamaPemegangRek": "Surya Ganm"}     2026-02-20 01:29:19.451216+00   success 2026-02-23 01:41:51.150938      \N
297     22      {"Email": "ikhsan.efendi@tps.co.id", "Nilai": "1000000", "Invoice": "123", "NamaBank": "Bank Mandiri", "NoRekening": "345345345", "NilaiDiskon\\r": "100000", "NamaPerusahaan": "PT. Semoga Banyak Duit", "NamaPemegangRek": "Surya Ganm"}      2026-02-20 01:29:19.203288+00   success 2026-02-23 01:41:51.150938      \N
298     22      {"Email": "ikhsan.efendi@tps.co.id", "Nilai": "1500000", "Invoice": "124", "NamaBank": "Bank Mandiri", "NoRekening": "345345345", "NilaiDiskon\\r": "150000", "NamaPerusahaan": "PT. Semoga Banyak Duit", "NamaPemegangRek": "Surya Ganm"}      2026-02-20 01:29:19.267143+00   success 2026-02-23 01:41:51.150938      \N
299     22      {"Email": "ikhsan.efendi@tps.co.id", "Nilai": "1000000", "Invoice": "125", "NamaBank": "Bank Mandiri", "NoRekening": "345345345", "NilaiDiskon\\r": "100000", "NamaPerusahaan": "PT. Semoga Banyak Duit", "NamaPemegangRek": "Surya Ganm"}      2026-02-20 01:29:19.329491+00   success 2026-02-23 01:41:51.150938      \N
302     22      {"Email": "ikhsan.efendi@tps.co.id", "Nilai": "2000000", "Invoice": "123", "NamaBank": "BNI", "NoRekening": "8034545345", "NilaiDiskon\\r": "200000", "NamaPerusahaan": "PT. Semoga Banyak Istri", "NamaPemegangRek": "Dari Mana Tuan"} 2026-02-20 01:29:19.555093+00   success 2026-02-23 01:41:51.150938     \N
303     22      {"Email": "ikhsan.efendi@tps.co.id", "Nilai": "4000000", "Invoice": "124", "NamaBank": "BNI", "NoRekening": "8034545345", "NilaiDiskon\\r": "400000", "NamaPerusahaan": "PT. Semoga Banyak Istri", "NamaPemegangRek": "Dari Mana Tuan"} 2026-02-20 01:29:19.610507+00   success 2026-02-23 01:41:51.150938     \N
304     22      {"Email": "ikhsan.efendi@tps.co.id", "Nilai": "1000000", "Invoice": "125", "NamaBank": "BNI", "NoRekening": "8034545345", "NilaiDiskon\\r": "100000", "NamaPerusahaan": "PT. Semoga Banyak Istri", "NamaPemegangRek": "Dari Mana Tuan"} 2026-02-20 01:29:19.665842+00   success 2026-02-23 01:41:51.150938     \N
305     22      {"Email": "ikhsan.efendi@tps.co.id", "Nilai": "1000000", "Invoice": "126", "NamaBank": "BNI", "NoRekening": "8034545345", "NilaiDiskon\\r": "100000", "NamaPerusahaan": "PT. Semoga Banyak Istri", "NamaPemegangRek": "Dari Mana Tuan"} 2026-02-20 01:29:19.720206+00   success 2026-02-23 01:41:51.150938     \N
306     22      {"Email": "ikhsan.efendi@tps.co.id", "Nilai": "3000000", "Invoice": "127", "NamaBank": "BNI", "NoRekening": "8034545345", "NilaiDiskon\\r": "300000", "NamaPerusahaan": "PT. Semoga Banyak Istri", "NamaPemegangRek": "Dari Mana Tuan"} 2026-02-20 01:29:19.780175+00   success 2026-02-23 01:41:51.150938     \N
307     22      {"Email": "ikhsan.efendi@tps.co.id", "Nilai": "1000000", "Invoice": "128", "NamaBank": "BNI", "NoRekening": "8034545345", "NilaiDiskon\\r": "100000", "NamaPerusahaan": "PT. Semoga Banyak Istri", "NamaPemegangRek": "Dari Mana Tuan"} 2026-02-20 01:29:19.834908+00   success 2026-02-23 01:41:51.150938     \N
308     22      {"Email": "ikhsan.efendi@tps.co.id", "Nilai": "1500000", "Invoice": "129", "NamaBank": "BNI", "NoRekening": "8034545345", "NilaiDiskon\\r": "150000", "NamaPerusahaan": "PT. Semoga Banyak Istri", "NamaPemegangRek": "Dari Mana Tuan"} 2026-02-20 01:29:19.891313+00   success 2026-02-23 01:41:51.150938     \N
309     22      {"Email": "ikhsan.efendi@tps.co.id", "Nilai": "2000000", "Invoice": "130", "NamaBank": "BNI", "NoRekening": "8034545345", "NilaiDiskon\\r": "200000", "NamaPerusahaan": "PT. Semoga Banyak Istri", "NamaPemegangRek": "Dari Mana Tuan"} 2026-02-20 01:29:19.949207+00   success 2026-02-23 01:41:51.150938     \N
\.


--
-- Name: imports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.imports_id_seq', 26, true);


--
-- Name: rows_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.rows_id_seq', 436, true);


--
-- Name: imports imports_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.imports
    ADD CONSTRAINT imports_pkey PRIMARY KEY (id);


--
-- Name: rows rows_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.rows
    ADD CONSTRAINT rows_pkey PRIMARY KEY (id);


--
-- Name: idx_imports_active; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_imports_active ON public.imports USING btree (is_active) WHERE (is_active = true);


--
-- Name: idx_rows_data_gin; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_rows_data_gin ON public.rows USING gin (data);


--
-- Name: idx_rows_import_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_rows_import_id ON public.rows USING btree (import_id);


--
-- Name: idx_rows_notification_status; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_rows_notification_status ON public.rows USING btree (notification_status);


--
-- Name: rows rows_import_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.rows
    ADD CONSTRAINT rows_import_id_fkey FOREIGN KEY (import_id) REFERENCES public.imports(id) ON DELETE CASCADE;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

\unrestrict aKObQX34ghZ3EzJBL3l2XpP7wVB3018sVxUgqnyAjz1V7MOQtzw5sEUHgpzRyPS

$





