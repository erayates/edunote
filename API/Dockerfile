FROM python:3.10-slim

WORKDIR /code

ENV HOST=0.0.0.0

COPY ./requirements.txt /code/requirements.txt
COPY ./LICENSE /code/LICENSE
COPY ./README.md /code/README.md
COPY ./Secrets /code/Secrets

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
RUN pip install --upgrade google-cloud-storage

COPY ./app /code/app/

EXPOSE 8080

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
# uvicorn app.main:app --host 0.0.0.0 --port 8080