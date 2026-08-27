import os
import shutil

from dotenv import load_dotenv

TEMPLATE_FILE = ".env.template"
ENV_FILE = ".env"
REQUIRED_KEYS = ("MONGODB_URL", "NAVER_CLIENT_ID", "NAVER_CLIENT_SECRET")

if not os.path.exists(ENV_FILE):
    shutil.copyfile(TEMPLATE_FILE, ENV_FILE)
    print(".env file created. Fill in the required values before running the app.")
else:
    print(".env file already exists.")

load_dotenv()

missing = [key for key in REQUIRED_KEYS if not os.getenv(key)]
if missing:
    print(f"Missing environment variables: {', '.join(missing)}")
else:
    print("Environment variables loaded successfully.")
