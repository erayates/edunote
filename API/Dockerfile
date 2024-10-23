FROM python:3.10-slim

WORKDIR /code

ENV HOST=0.0.0.0

COPY ./requirements.txt /code/requirements.txt
COPY ./KEY.py /code/KEY.py
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./app /code/app/

EXPOSE 8080

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
# uvicorn app.main:app --host 0.0.0.0 --port 8080