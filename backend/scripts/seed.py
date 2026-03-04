"""
Seed script: Populates the database with initial data.
- Bolashak criteria, steps, and documents (official 2024 data)
- Sample universities and programs
Run: python scripts/seed.py
"""
import asyncio
import sys, os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.config import settings
from app.models.bolashak import BolashakCriteria, BolashakStep, BolashakDocument
from app.models.university import University, Faculty
from app.models.program import Program


engine = create_async_engine(settings.database_url, echo=False)
Session = async_sessionmaker(engine, expire_on_commit=False)


BOLASHAK_CRITERIA = [
    {"category": "citizenship", "title": "Казахстанское гражданство", "description": "Должны быть гражданином РК", "is_mandatory": True, "sort_order": 1},
    {"category": "age", "title": "Возраст до 35 лет (PhD до 40)", "description": "Максимальный возраст для программ магистратуры — 35 лет, для PhD — 40 лет", "is_mandatory": True, "sort_order": 2},
    {"category": "academic", "title": "GPA не ниже 3.0 из 4.0", "description": "Средний балл диплома должен соответствовать требованиям", "is_mandatory": True, "sort_order": 3},
    {"category": "language", "title": "IELTS 6.0+ или TOEFL iBT 79+", "description": "Требуется подтверждённый языковой сертификат", "is_mandatory": True, "sort_order": 4},
    {"category": "experience", "title": "Опыт работы по специальности", "description": "Приоритет кандидатам с опытом работы в стратегических отраслях", "is_mandatory": False, "sort_order": 5},
    {"category": "program", "title": "Обучение в ТОП-200 университетах мира (QS/THE)", "description": "Программа должна быть в аккредитованном зарубежном вузе", "is_mandatory": True, "sort_order": 6},
]

BOLASHAK_STEPS = [
    {"step_number": 1, "title": "Регистрация на портале", "description": "Создайте аккаунт на bolashak.edu.kz и заполните анкету", "documents_required": '["Удостоверение личности", "Фото 3x4"]'},
    {"step_number": 2, "title": "Сдача языкового теста", "description": "Пройдите IELTS/TOEFL и загрузите сертификат", "documents_required": '["Сертификат IELTS/TOEFL"]'},
    {"step_number": 3, "title": "Поступление в зарубежный вуз", "description": "Получите оффер из ТОП-200 университета (QS или THE)", "documents_required": '["Offer letter", "Acceptance letter"]'},
    {"step_number": 4, "title": "Подача документов в ЦМО", "description": "Представьте полный пакет документов в Центр международных программ", "documents_required": '["Все требуемые документы"]'},
    {"step_number": 5, "title": "Конкурсный отбор", "description": "Комиссия проводит отбор кандидатов на основании конкурса", "documents_required": '[]'},
    {"step_number": 6, "title": "Подписание договора", "description": "Победители подписывают договор с обязательством отработать 5 лет в Казахстане", "documents_required": '["Договор"]'},
]

BOLASHAK_DOCUMENTS = [
    {"name": "Удостоверение личности (копия)", "is_required": True},
    {"name": "Диплом о высшем образовании + транскрипт (нотариально заверенный перевод)", "is_required": True},
    {"name": "Сертификат IELTS / TOEFL (не старше 2 лет)", "is_required": True},
    {"name": "Письмо о зачислении (Offer Letter) от иностранного вуза", "is_required": True},
    {"name": "Рекомендательные письма (2 штуки)", "is_required": True},
    {"name": "Мотивационное письмо (SOP)", "is_required": True},
    {"name": "Медицинская справка", "is_required": True},
    {"name": "Трудовая книжка (при наличии)", "is_required": False},
    {"name": "Портфолио достижений", "is_required": False},
]


async def seed():
    async with Session() as db:
        # Bolashak
        for row in BOLASHAK_CRITERIA:
            db.add(BolashakCriteria(**row))
        for row in BOLASHAK_STEPS:
            db.add(BolashakStep(**row))
        for row in BOLASHAK_DOCUMENTS:
            db.add(BolashakDocument(**row))

        # Sample universities
        NU = University(id="nu-001", name="Назарбаев Университет", country="Казахстан", city="Астана", website_url="https://nu.edu.kz")
        KBTU = University(id="kbtu-001", name="Казахстанско-Британский Технический Университет", country="Казахстан", city="Алматы", website_url="https://kbtu.kz")
        db.add_all([NU, KBTU])
        await db.flush()

        # Sample programs
        db.add(Program(id="nu-cs-master", university_id="nu-001", name="Computer Science (MSc)", degree_level="master", language="English", city="Астана", tuition_fee=2800000, duration="2 года"))
        db.add(Program(id="kbtu-it-master", university_id="kbtu-001", name="Information Technology (MSc)", degree_level="master", language="English", city="Алматы", tuition_fee=2100000, duration="2 года"))
        db.add(Program(id="nu-phd-cs", university_id="nu-001", name="Computer Science (PhD)", degree_level="phd", language="English", city="Астана", tuition_fee=0, duration="4 года"))

        await db.commit()
        print("✅ Seed complete!")


if __name__ == "__main__":
    asyncio.run(seed())
