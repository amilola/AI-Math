from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
import os


def format_response(ai_response: str) -> str:
    # if '.\n' not in ai_response or ':\n' not in ai_response:
    return ai_response.replace(". ", ".\n").replace(": ", ":\n")

    # return ai_response


def format_prompt(prompt: str) -> str:
    pass


def format_question(question: str) -> str:
    format_ai = OpenAI(
        model_name=os.environ["PRETRAINED_MODEL_NAME"], temperature=0.0)
    template = """
                    Change the math text in what I'm about to give you to latex and return the entire sentence with it.\n
                    If you're not sure whether something is math text or not, DO NOT touch it.\n
                    
                    If there is no math text in the sentence, return exactly what you were given without modification.
                    ONLY FORMAT THE MATHEMATICAL FUNCTIONS IN THE TEXT. DO NOT TOUCH ANY PURE TEXT. ALSO ADD NEW LINE CHARACTERS WHERE APPROPRIATE.
                    {question}
                    """

    prompt = PromptTemplate(input_variables=["question"], template=template)

    formatted_question = format_ai(prompt.format(question=question))

    return formatted_question
