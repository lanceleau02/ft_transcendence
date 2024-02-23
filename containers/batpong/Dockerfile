FROM python:3.11.4-slim-bullseye

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

WORKDIR /app

COPY . .

RUN apt-get update

COPY ./requirements.txt .

RUN pip install -r requirements.txt

COPY ./start.sh /app/start.sh

RUN chmod +x /app/start.sh

CMD ["./containers/batpong/start.sh"]