#!/usr/bin/env python3
"""Обновлённый seed с реальными требованиями"""
import os, sys
try:
    import psycopg2
except:
    os.system(f"{sys.executable} -m pip install psycopg2-binary -q")
    import psycopg2

DB = os.environ.get("DATABASE_URL","postgresql://abdugaffaromerbek@localhost:5432/academik")
conn = psycopg2.connect(DB)
cur = conn.cursor()

# Обновляем программы с реальными требованиями и документами
UPDATES = [
    # MIT CS
    ("MIT", "Master of Science in Computer Science",
     ["GPA 3.7+/4.0", "GRE General (Quant 165+)", "TOEFL 100+ / IELTS 7.0+", "3 рекомендательных письма", "Research Statement", "CV"],
     ["Диплом бакалавра", "Транскрипт оценок", "GRE Score Report", "TOEFL/IELTS", "3 рекомендательных письма", "Statement of Purpose", "CV", "Writing Sample"],
     4.9, "Одна из сильнейших CS программ мира. Акцент на исследования, AI/ML, systems. Большинство студентов имеют публикации до поступления."),

    # Stanford AI
    ("Stanford University", "MS Artificial Intelligence",
     ["GPA 3.8+/4.0", "GRE General (рекомендуется, не обязателен с 2023)", "TOEFL 100+ / IELTS 7.0+", "3 рекомендательных письма", "Statement of Purpose"],
     ["Диплом бакалавра", "Транскрипт", "TOEFL/IELTS", "3 рекомендательных письма", "Statement of Purpose", "CV", "Portfolio проектов"],
     5.0, "Stanford HAI — мировой центр AI-исследований. Студенты работают с профессорами Fei-Fei Li, Andrew Ng. Конкурс ~2%."),

    # Harvard MPH
    ("Harvard University", "Master of Public Health",
     ["GPA 3.5+/4.0", "GRE или GMAT", "TOEFL 100+ / IELTS 7.0+", "3 рекомендательных письма", "2+ года опыта в здравоохранении", "Personal Statement"],
     ["Диплом бакалавра", "Транскрипт", "GRE/GMAT", "TOEFL/IELTS", "3 рекомендательных письма", "Personal Statement", "CV", "Справка об опыте работы"],
     4.9, "Harvard T.H. Chan School — #1 в мире по Public Health. Требует реального опыта в медицине или NGO."),

    # Columbia Finance
    ("Columbia University", "MS Financial Economics",
     ["GPA 3.5+/4.0", "GMAT 720+ или GRE Quant 165+", "TOEFL 105+ / IELTS 7.5+", "3 рекомендательных письма", "2+ года работы в финансах"],
     ["Диплом бакалавра", "Транскрипт", "GMAT/GRE", "TOEFL/IELTS", "3 рекомендательных письма", "Essays (2 штуки)", "CV", "Справка с места работы"],
     4.9, "Columbia SIPA финансовая программа. Сильные связи с Wall Street. Средний GMAT принятых — 730+."),

    # CMU EE
    ("Carnegie Mellon University", "Master of Science in Electrical Engineering",
     ["GPA 3.6+/4.0", "GRE General (Quant 165+, Verbal 155+)", "TOEFL 100+ / IELTS 7.0+", "3 рекомендательных письма", "Statement of Purpose"],
     ["Диплом бакалавра (EE/ECE/Physics)", "Транскрипт", "GRE", "TOEFL/IELTS", "3 рекомендательных письма", "SOP", "CV"],
     4.9, "CMU ECE — топ-3 в США. Сильны в robotics, ML hardware, IoT. Многие студенты работают в Google, Apple, NVIDIA."),

    # Yale LLM
    ("Yale University", "Master of Laws (LLM)",
     ["Диплом юриста (JD или эквивалент)", "TOEFL 100+ / IELTS 7.5+", "2 рекомендательных письма", "Personal Statement (2000 слов)", "Writing Sample (20-30 страниц)", "Bar admission или эквивалент"],
     ["Диплом юриста", "Транскрипт", "TOEFL/IELTS", "2 рекомендательных письма", "Personal Statement", "Writing Sample", "CV", "Bar Certificate"],
     4.9, "Yale Law — #1 юридическая школа США. LLM программа для иностранных юристов. Принимают ~25 человек в год."),

    # JHU Global Health
    ("Johns Hopkins University", "MPH — Global Health",
     ["GPA 3.0+/4.0", "GRE (рекомендуется)", "TOEFL 100+ / IELTS 7.0+", "3 рекомендательных письма", "Statement of Purpose", "2+ лет опыта"],
     ["Диплом бакалавра", "Транскрипт", "GRE (если есть)", "TOEFL/IELTS", "3 рекомендательных письма", "SOP", "CV", "Резюме с опытом"],
     4.9, "Bloomberg School — #1 в Global Health. Сильные программы по эпидемиологии, биостатистике, международному здравоохранению."),

    # Oxford CS
    ("University of Oxford", "MSc Computer Science",
     ["GPA эквивалент 1st class Honours (3.8+)", "IELTS 7.5+ (каждый компонент 7.0+)", "2-3 рекомендательных письма от профессоров", "Research Proposal (1000 слов)", "Writing Sample"],
     ["Диплом бакалавра CS/Math/Engineering", "Транскрипт", "IELTS (обязательно)", "2-3 рекомендательных письма", "Research Proposal", "CV", "Writing Sample"],
     5.0, "Oxford MSc CS — 1 год интенсивного обучения. Фокус на теорию вычислений, верификацию ПО, квантовые вычисления."),

    # Cambridge Engineering
    ("University of Cambridge", "MPhil Engineering",
     ["GPA эквивалент 1st class Honours", "IELTS 7.5+ (каждый компонент 7.0+)", "3 рекомендательных письма", "Research Proposal (2000 слов)", "Предварительный контакт с научным руководителем"],
     ["Диплом бакалавра Engineering", "Транскрипт", "IELTS", "3 рекомендательных письма", "Research Proposal", "CV", "Portfolio проектов"],
     5.0, "Cambridge MPhil — исследовательская программа 1 год. Обязателен научный руководитель до поступления. Отдел: механика, аэро, биоинженерия."),

    # Imperial AI
    ("Imperial College London", "MSc Artificial Intelligence",
     ["GPA эквивалент 2:1 или выше (3.5+)", "IELTS 7.0+ (каждый 6.5+)", "2 рекомендательных письма", "Personal Statement", "Portfolio проектов (желательно)"],
     ["Диплом бакалавра CS/EE/Math", "Транскрипт", "IELTS", "2 рекомендательных письма", "Personal Statement", "CV"],
     4.9, "Imperial AI — практическая программа в центре Лондона. Партнёрства с DeepMind, Google, Microsoft. 1 год."),

    # LSE Economics
    ("LSE", "MSc Economics",
     ["GPA эквивалент 1st class или high 2:1 (3.7+)", "GRE Quant 165+ (настоятельно рекомендуется)", "IELTS 7.5+ (каждый 7.0+)", "2 рекомендательных письма", "Personal Statement"],
     ["Диплом бакалавра Economics/Math/Statistics", "Транскрипт", "GRE", "IELTS", "2 рекомендательных письма", "Personal Statement", "CV"],
     4.9, "LSE Economics — один из лучших в мире. Строгая математическая программа. Требует продвинутого анализа и эконометрики."),

    # Edinburgh Data Science
    ("University of Edinburgh", "MSc Data Science",
     ["GPA 3.5+/4.0 или 2:1 UK", "IELTS 6.5+ (каждый 6.0+)", "2 рекомендательных письма", "Personal Statement", "Знание Python/R/SQL"],
     ["Диплом бакалавра Math/CS/Statistics/Engineering", "Транскрипт", "IELTS", "2 рекомендательных письма", "Personal Statement", "CV"],
     4.7, "Edinburgh DSI — ведущий центр Data Science в UK. 1 год + диссертация. Сильная экосистема стартапов."),

    # TU Munich CS
    ("TU Munich", "MSc Informatics",
     ["GPA 3.0+/4.0", "IELTS 6.5+ / TOEFL 88+", "Мотивационное письмо", "CV", "Портфолио проектов (рекомендуется)", "Немецкий язык не обязателен"],
     ["Диплом бакалавра CS/Math/Engineering", "Транскрипт", "IELTS/TOEFL", "Мотивационное письмо", "CV", "Портфолио (опционально)"],
     4.9, "TUM — лучший технический университет Европы. Стоимость ~600 евро/семестр. Сильные программы по AI, robotics, distributed systems."),

    # TU Munich EE
    ("TU Munich", "MSc Electrical Engineering",
     ["GPA 3.0+/4.0", "IELTS 6.0+ / TOEFL 83+", "Мотивационное письмо", "CV"],
     ["Диплом бакалавра EE/ECE/Physics", "Транскрипт", "IELTS/TOEFL", "Мотивационное письмо", "CV"],
     4.8, "TUM EE — топ программа в Европе. Специализации: power systems, embedded systems, RF engineering."),

    # RWTH CS — бесплатно
    ("RWTH Aachen", "MSc Computer Science",
     ["GPA 3.0+/4.0", "IELTS 6.0+ / TOEFL 83+ (или немецкий B2)", "Мотивационное письмо", "CV"],
     ["Диплом бакалавра CS/Math", "Транскрипт", "IELTS/TOEFL или немецкий", "Мотивационное письмо", "CV"],
     4.7, "RWTH Aachen — бесплатное образование (~250 евро/семестр). Сильный в embedded systems, HPC, software engineering."),

    # Toronto CS
    ("University of Toronto", "MS Computer Science",
     ["GPA 3.3+/4.0", "TOEFL 100+ / IELTS 7.0+", "3 рекомендательных письма", "Statement of Purpose", "CV", "GRE (опционально)"],
     ["Диплом бакалавра CS/Math/Engineering", "Транскрипт", "TOEFL/IELTS", "3 рекомендательных письма", "SOP", "CV"],
     4.9, "UofT — лидер AI-исследований. Birthplace of deep learning (Hinton). Vector Institute partnership. 2 трека: thesis и course-based."),

    # McGill Engineering
    ("McGill University", "MEng Computer Engineering",
     ["GPA 3.0+/4.0", "TOEFL 100+ / IELTS 6.5+", "2 рекомендательных письма", "Statement of Purpose"],
     ["Диплом бакалавра CE/CS/EE", "Транскрипт", "TOEFL/IELTS", "2 рекомендательных письма", "SOP", "CV"],
     4.8, "McGill — топ канадский университет. MEng course-based, 1 год. Возможность остаться в Канаде по PGWP."),

    # Waterloo Data Science
    ("University of Waterloo", "Master of Data Science",
     ["GPA 3.0+/4.0", "TOEFL 100+ / IELTS 7.0+", "3 рекомендательных письма", "Statement of Purpose", "Python/R skills"],
     ["Диплом бакалавра Math/Stats/CS", "Транскрипт", "TOEFL/IELTS", "3 рекомендательных письма", "SOP", "CV", "Programming portfolio"],
     4.8, "Waterloo MDS — профессиональная программа с Co-op. Партнёрства с Google, Shopify, RBC. 16 месяцев."),

    # NUS CS
    ("NUS", "MS Computer Science",
     ["GPA 3.0+/4.0", "TOEFL 85+ / IELTS 6.0+", "2 рекомендательных письма", "Statement of Purpose", "GRE (рекомендуется)"],
     ["Диплом бакалавра CS/EE/Math", "Транскрипт", "TOEFL/IELTS", "2 рекомендательных письма", "SOP", "CV"],
     4.9, "NUS — #1 в Азии. Два трека: coursework (1 год) и research (2 года). Сильный в AI, security, systems."),

    # Tokyo EE
    ("University of Tokyo", "MS Electrical Engineering",
     ["GPA 3.0+/4.0", "TOEFL 79+ / IELTS 6.5+", "2 рекомендательных письма", "Research Plan", "Предварительный контакт с профессором"],
     ["Диплом бакалавра EE/ECE", "Транскрипт", "TOEFL/IELTS", "2 рекомендательных письма", "Research Plan", "CV"],
     4.8, "UTokyo — #1 в Японии и Азии по инженерии. Обязателен научный руководитель. Обучение частично на японском."),

    # Tsinghua CS
    ("Tsinghua University", "MSc Computer Science",
     ["GPA 3.2+/4.0", "TOEFL 90+ / IELTS 6.5+", "2 рекомендательных письма", "Research Proposal", "HSK 4+ желательно"],
     ["Диплом бакалавра CS/Math", "Транскрипт", "TOEFL/IELTS", "2 рекомендательных письма", "Research Proposal", "CV"],
     4.8, "Tsinghua — #1 в Китае, топ-25 в мире. Огромные инвестиции в AI и quantum computing. Обучение на английском доступно."),

    # ETH Zurich CS
    ("ETH Zurich", "MSc Computer Science",
     ["GPA 3.5+/4.0 (или немецкий эквивалент 5.0+/6.0)", "IELTS 7.0+ / TOEFL 95+", "Мотивационное письмо", "CV", "2 рекомендательных письма (опционально)"],
     ["Диплом бакалавра CS/Math/Engineering", "Транскрипт", "IELTS/TOEFL", "Мотивационное письмо", "CV"],
     5.0, "ETH Zurich — #7 в мире (QS). Alma mater Эйнштейна. Стоимость ~730 CHF/семестр. Очень конкурентный отбор — <10% acceptance rate."),

    # EPFL Data Science
    ("EPFL", "MSc Data Science",
     ["GPA 3.5+/4.0", "IELTS 7.0+ / TOEFL 100+", "Мотивационное письмо", "CV", "2 рекомендательных письма"],
     ["Диплом бакалавра Math/CS/Engineering/Physics", "Транскрипт", "IELTS/TOEFL", "Мотивационное письмо", "2 рекомендательных письма", "CV"],
     4.9, "EPFL — лидер в Data Science, ML, distributed systems. Тесное партнёрство с CERN, Nestlé, Logitech. Обучение на английском."),

    # TU Delft CS
    ("TU Delft", "MSc Computer Science",
     ["GPA 3.0+/4.0", "IELTS 6.5+ / TOEFL 90+", "Мотивационное письмо", "CV"],
     ["Диплом бакалавра CS/Math/Engineering", "Транскрипт", "IELTS/TOEFL", "Мотивационное письмо", "CV"],
     4.8, "TU Delft — #57 QS. Сильные программы по software engineering, cybersecurity, data systems. Стоимость ~18,000 EUR/год."),

    # Amsterdam AI
    ("University of Amsterdam", "MSc Artificial Intelligence",
     ["GPA 3.3+/4.0 или 7.5/10", "IELTS 6.5+ / TOEFL 92+", "Мотивационное письмо", "CV", "2 рекомендательных письма (рекомендуется)"],
     ["Диплом бакалавра CS/Math/Cognitive Science", "Транскрипт", "IELTS/TOEFL", "Мотивационное письмо", "CV"],
     4.7, "UvA AI — ведущий европейский центр AI. Партнёрства с Booking.com, Qualcomm, Microsoft Research Amsterdam."),

    # Melbourne IT
    ("University of Melbourne", "Master of Information Technology",
     ["GPA 3.0+/4.0", "IELTS 6.5+ (каждый 6.0+) / TOEFL 79+", "Personal Statement", "CV"],
     ["Диплом бакалавра IT/CS/Engineering", "Транскрипт", "IELTS/TOEFL", "Personal Statement", "CV"],
     4.7, "UniMelb IT — #1 в Австралии. 3 специализации: CS, distributed computing, software engineering. Возможность PR в Австралии."),

    # NU CS&AI
    ("Nazarbayev University", "Computer Science & AI",
     ["GPA 3.0+/4.0", "IELTS 6.5+ / TOEFL 80+", "Мотивационное письмо", "CV", "2 рекомендательных письма", "Удостоверение личности РК"],
     ["Диплом бакалавра IT/Math/Engineering", "Транскрипт оценок", "IELTS/TOEFL", "Мотивационное письмо", "CV", "2 рекомендательных письма", "Удостоверение личности"],
     4.9, "Лучший университет Казахстана (QS #229). Программа аккредитована ABET. Преподаватели — выпускники MIT, Stanford, CMU. Стипендии до 100%."),

    # NU MBA
    ("Nazarbayev University", "MBA — Business Administration",
     ["GPA 3.0+/4.0", "IELTS 6.5+ / TOEFL 80+", "GMAT 550+ (рекомендуется)", "2+ года опыта работы", "2 рекомендательных письма", "Эссе о карьерных целях"],
     ["Диплом бакалавра", "Транскрипт", "IELTS/TOEFL", "GMAT (если есть)", "2 рекомендательных письма", "Эссе (500 слов)", "CV", "Справка с места работы"],
     4.8, "NU Graduate School of Business. Единственная программа MBA в Казахстане с международной аккредитацией AACSB (в процессе)."),

    # KBTU International Business
    ("KBTU", "International Business and Management",
     ["GPA 3.0+/4.0", "IELTS 6.0+ / TOEFL 75+ (или казахский/русский)", "Мотивационное письмо", "2 рекомендательных письма", "Удостоверение личности"],
     ["Диплом бакалавра", "Транскрипт", "IELTS/TOEFL", "Мотивационное письмо", "2 рекомендательных письма", "Удостоверение", "Фото 3x4"],
     4.8, "КБТУ — лучший частный университет Казахстана. Программа в партнёрстве с De Montfort University (UK). Диплом двойного образца."),

    # KBTU Oil & Gas
    ("KBTU", "Oil and Gas Engineering",
     ["GPA 3.0+/4.0", "IELTS 6.0+ / TOEFL 75+", "Мотивационное письмо", "2 рекомендательных письма"],
     ["Диплом инженера", "Транскрипт", "IELTS/TOEFL", "Мотивационное письмо", "2 рекомендательных письма", "Удостоверение"],
     4.7, "КБТУ Oil & Gas — программа разработана с Shell и KazMunaiGas. Лабораторная база мирового уровня. Высокий спрос на рынке труда РК."),

    # KazNU Law
    ("Al-Farabi KazNU", "Law — International Law",
     ["Диплом юриста или смежный", "IELTS 5.5+ (или казахский/русский)", "Мотивационное письмо", "2 рекомендательных письма"],
     ["Диплом бакалавра юриспруденции", "Транскрипт", "Удостоверение", "Мотивационное письмо", "2 рекомендательных письма", "Медицинская справка 086", "Фото"],
     4.5, "КазНУ — старейший и крупнейший университет Казахстана. Государственные гранты доступны. QS #301."),

    # KazNU Data Science
    ("Al-Farabi KazNU", "Data Science and Analytics",
     ["GPA 3.0+/4.0", "Базовый Python или R", "IELTS 5.5+ (опционально)", "Мотивационное письмо"],
     ["Диплом бакалавра IT/Math/Statistics", "Транскрипт", "Удостоверение", "Мотивационное письмо", "CV"],
     4.6, "Новая программа КазНУ в партнёрстве с Яндекс Образование. Практические проекты на реальных данных казахстанских компаний."),

    # KIMEP Finance
    ("KIMEP University", "Finance",
     ["GPA 2.7+/4.0", "IELTS 6.0+ / TOEFL 79+", "GMAT 450+ (желательно)", "2 рекомендательных письма", "Эссе о карьерных целях"],
     ["Диплом бакалавра", "Транскрипт", "IELTS/TOEFL", "GMAT (если есть)", "2 рекомендательных письма", "Эссе", "CV", "Удостоверение"],
     4.6, "KIMEP — первый частный международный университет РК. Преподавание на английском с 1992 года. Аккредитован AACSB и AMBA."),

    # IITU Software
    ("IITU", "Software Engineering",
     ["GPA 3.0+/4.0", "IELTS 5.5+ или казахский/русский", "Мотивационное письмо", "Portfolio проектов (рекомендуется)"],
     ["Диплом бакалавра IT/CS", "Транскрипт", "IELTS (если есть)", "Мотивационное письмо", "Удостоверение", "Портфолио GitHub"],
     4.5, "IITU — специализированный IT университет Алматы. Партнёрства с Microsoft, Oracle, Cisco. Практические проекты с IT-компаниями РК."),

    # Alatau IT AI
    ("Alatau IT University", "AI & Robotics",
     ["GPA 3.0+/4.0", "IELTS 6.0+ или казахский", "Мотивационное письмо", "Portfolio проектов"],
     ["Диплом бакалавра IT/Engineering", "Транскрипт", "IELTS", "Мотивационное письмо", "Portfolio", "Удостоверение"],
     4.7, "AITU — новый технологический университет при поддержке государства. Оборудование от Cisco, IBM, Huawei. Обучение полностью на английском."),
]

print("Updating programs with real requirements...")
updated = 0
for uni_name, prog_title, requirements, documents, rating, description in UPDATES:
    cur.execute("""
        UPDATE programs p SET
            requirements = %s,
            documents = %s,
            rating = %s,
            description = %s
        FROM universities u
        WHERE p.university_id = u.id
        AND u.name = %s
        AND (p.title = %s OR p.title_ru ILIKE %s)
    """, (requirements, documents, rating, description, uni_name, prog_title, f"%{prog_title[:15]}%"))
    if cur.rowcount > 0:
        updated += cur.rowcount
        print(f"  ✅ {uni_name} — {prog_title[:40]}")
    else:
        print(f"  ⚠️  Not found: {uni_name} — {prog_title[:40]}")

conn.commit()
print(f"\n✅ Updated {updated} programs")
cur.close()
conn.close()
