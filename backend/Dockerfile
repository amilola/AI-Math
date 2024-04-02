FROM python:3.11

WORKDIR /code

COPY ./requirements.txt .

RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python3", "main.py"]
