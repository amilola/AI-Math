from fastapi import FastAPI
from fastapi import FastAPI, UploadFile, File, status, Response, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from ai import ai
from generate_grid import PuzzleGrid

app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=origins,
)


@app.get('/', status_code=status.HTTP_200_OK)
def index():
    return "Word Search Bot API!"


@app.get("/new-game", status_code=status.HTTP_200_OK)
def new_game(mode: str):
    # Mode is one of "very-easy", "easy", "hard", "complex"
    # Very Easy -> Kindergarten and Elementary
    # Easy -> Middle School
    # Hard -> High School
    # Complex -> College

    # size = (10, 10)

    difficulty = {
        "very-easy": "kindergarten and elementary school",
        "easy": "middle school",
        "hard": "high school",
        "complex": "college",
    }

    grid_size = {
        "very-easy": 10,
        "easy": 10,
        "hard": 12,
        "complex": 12,
    }

    max_word_length = {
        "very-easy": 5,
        "easy": 9,
        "hard": 10,
        "complex": 12,
    }

    prompt = f"""
        Generate a list of words and and a 5 word hint about the word to enhance the vocabulary of a {difficulty[mode]} student.
        Any english word sufficiently sophisticated enough AND within the knowledge range for the specified student class is valid.
        Think carefully,
        If you think a {difficulty[mode]} student will not know a particular word, DO NOT generate it.
        """

    try:
        result = ai(prompt, student_class=difficulty[mode])
        print(len(result))
        search_words = [(word[0].capitalize(), word[1]) for word in result]

        size = (grid_size[mode], grid_size[mode])
        grid = PuzzleGrid(size, search_words, max_word_length[mode])
        grid.place_words()
        return JSONResponse(
            content={
                "search_words": grid.search_words,
                "grid": grid.grid,
                "answers": grid.answers,
            }
        )
    except AssertionError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Generated search words longer than grid. Please retry",
        )
    except Exception as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error))


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
