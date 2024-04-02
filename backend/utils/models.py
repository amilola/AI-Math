from typing import Optional, List, Tuple

from pydantic import BaseModel


class UserQuestion(BaseModel):
    question: str
    image_links: Optional[List[str]] = None


class AIAnswer(BaseModel):
    question_content: str
    answer_content: str


class ImageUpload(BaseModel):
    image_data: Tuple[str, bytes]
