# University Programs Parser (Draft)

## Goal
Collect structured data about university programs for Academi.kz.

## Target entities (MVP)
Each program should have:
- university_name
- program_name
- degree_level (Bachelor/Master/PhD)
- city
- language
- duration
- tuition_fee (if available)
- requirements (list)
- deadlines (list)
- source_url
- last_updated

## Output format
- JSON (initial)
- Later: store in database (PostgreSQL)

## Data quality rules
- Keep source_url for every record
- Normalize degree levels to: Bachelor / Master / PhD
- Store missing fields as null

## Next steps
- Pick 2–3 universities as initial targets
- Implement scraper/parser skeleton
- Save output into `data/raw/` and `data/processed/`
