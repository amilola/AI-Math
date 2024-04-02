import logging
import os, json
from typing import Optional, List, Dict, Tuple

# from typing import Annotated
import pandas as pd
from dotenv import load_dotenv
import openai

from ai import create_ai, create_ai_with_image, create_format_ai
from ai.utils import format_response, format_question
from fastapi import FastAPI, UploadFile, File, status, Response
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from utils.encode_image import encode_image
from utils.models import ImageUpload, UserQuestion, AIAnswer
from utils.s3_store import upload_image, delete_image

app = FastAPI()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=origins,
    allow_headers=origins,
)

load_dotenv()


# openai.api_key = os.environ["OPENAI_API_KEY"]

@app.get("/")
async def get_hello():
    return "Welcome to our Educational Chatbot"


@app.post("/question", status_code=status.HTTP_200_OK)
async def post_question(question: UserQuestion):
    if question.image_links is not None:
        ai_vision = create_ai_with_image(question.image_links)
        result = await ai_vision.ainvoke({'input': question.question})

        formatted_result = format_response(result.content)
    else:
        ai = create_ai()
        result = ai.predict(input=question.question)

        formatted_result = format_response(result)

    if result != '':
        return JSONResponse(
            content=AIAnswer(**{"question_content": question.question, "answer_content": formatted_result}).dict()
        )
    else:
        return JSONResponse(
            content='No result',
            status_code=status.HTTP_204_NO_CONTENT
        )


@app.put('/image_upload', status_code=status.HTTP_201_CREATED)
async def image_upload(image_file: UploadFile):
    file_data = dict()
    file = await image_file.read()
    # print(file_name)
    # file_name, image_data = image_files.image_data
    #
    try:
        file_data["name"] = image_file.filename
        file_data["url"] = upload_image(image=file, key=image_file.filename)
    except Exception as error:
        logging.error(error)
        return JSONResponse(
            content='Error uploading the file',
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE
        )

    return JSONResponse(content=file_data)


@app.delete('/image_delete', status_code=status.HTTP_200_OK)
def image_delete(file_name: str):
    try:
        delete_image(file_name)
    except Exception as error:
        return JSONResponse(
            content='Error uploading the file',
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE
        )

    return JSONResponse(content="Deleted")


@app.post("/format")
async def question_format(question: UserQuestion):
    ai = create_format_ai()
    formatted_question = ai.invoke({"question": question.question})
    # formatted_question = create_format_ai(question=question.question)
    # formatted_question = format_question(question=question.question)

    return formatted_question


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5000, workers=1)
