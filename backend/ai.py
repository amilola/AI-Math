from typing import List, Tuple

from openai import OpenAI
from dotenv import load_dotenv
from langchain.output_parsers import PydanticOutputParser

from pydantic import BaseModel, Field

load_dotenv()


client = OpenAI()


class SearchWords(BaseModel):
    search_words: List[Tuple[str, str]]= Field(
        description="A list of tuples containing all the words as strings that were generated and their definitions"
    )


parser = PydanticOutputParser(pydantic_object=SearchWords)


def ai(query: str, student_class: str):
    tools = [
        {
            "type": "function",
            "function": {
                "name": "get_search_words",
                "description": f"Extracts the list of words generated to enhance a {student_class} student's vocabulary",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "search_words": {
                            "type": "array",
                            "items": {
                                "type": "array",
                                "items": {
                                    "search_word": {
                                        "type": "string",
                                        "description": "A word that was generated.",
                                    },
                                    "definition": {
                                        "type": "string",
                                        "description": "A very short definition of the word that was generated."
                                    }
                                },
                                "description": "A word that was generated",
                            },
                            "description": "A list of all the words as strings that were generated",
                        }
                    },
                    "required": ["search_words"],
                },
            },
        }
    ]

    response = client.chat.completions.create(
        model="gpt-4",
        temperature=1.0,
        messages=[{"role": "user", "content": query}],
        tools=tools,
        tool_choice={"type": "function", "function": {"name": "get_search_words"}},
    )
    try:
        data = parser.invoke(
            response.model_dump()["choices"][0]["message"]["tool_calls"][0]["function"][
                "arguments"
            ]
        ).model_dump()

        return data["search_words"]
    except TypeError as error:
        return None
    except Exception as error:
         data = parser.invoke(
            response.model_dump()["choices"][0]["message"]["tool_calls"][0]["function"][
                "arguments"
            ]
        ).json()

         return data["search_words"]

if __name__ == "__main__":
    mode = "hard"
    difficulty = {
        "very-easy": "kindergarten and elementary school",
        "easy": "middle school",
        "hard": "high school",
        "complex": "college",
    }

    prompt = f"""
        Generate a list of words and a 5 word hint about the word to enhance the vocabulary of a {difficulty[mode]} student.
        Any english word sufficiently sophisticated enough AND within the knowledge range for the specified student class is valid.
        Think carefully,
        If you think a {difficulty[mode]} student will not know a particular word, DO NOT generate it.
        """

    print(prompt)
    result = ai(prompt, student_class=difficulty[mode])

    print(result)
     # print(max([len(word) for word in result]))
     # print([word for word in result if len(word) <= 10])
     # print(max([len(word) for word in result if len(word) <= 10]))
