import os
from typing import List

from dotenv import load_dotenv
# from langchain.llms import OpenAI
from langchain.chains import ConversationChain, LLMChain
from langchain_community.chat_models import ChatOpenAI
from langchain.memory import ConversationSummaryBufferMemory
from langchain.prompts import ChatPromptTemplate
from langchain.prompts import FewShotChatMessagePromptTemplate
from langchain.prompts import PromptTemplate
from langchain.prompts.few_shot import FewShotPromptTemplate
from langchain.schema import HumanMessage, BaseMessage
from langchain.schema.runnable import RunnableSerializable
from langchain.schema.output_parser import StrOutputParser
from .utils.load_examples import load_json

load_dotenv()

examples = load_json("./ai/examples.json")


def create_ai() -> ConversationChain:
    chat_llm = ChatOpenAI(
        model=os.environ["PRETRAINED_MODEL_NAME"], temperature=0.0, max_tokens=4096)
    example_prompt = PromptTemplate(
        input_variables=["question", "answer"], template="Question: {question}\n{answer}")

    prompt = FewShotPromptTemplate(
        examples=examples,
        example_prompt=example_prompt,
        prefix="""
                Give the output in proper latex format only.\n \
                Make sure all final answers are evaluated if real values are available\n \
                All mathematics must be in latex
                {history}
                """,
        suffix="""
                Think carefully step by step when answering.\n
                Be as explicit as possible when solving the questions and give your answers in real numbers unless the question requires solution to be in terms of a variable.\n
                Question: Solve the following\n
                {input} and show steps
                """,
        input_variables=["history", "input"]
    )

    buffer_memory_fs = ConversationSummaryBufferMemory(
        llm=chat_llm,
        max_token_limit=os.environ["MAX_NUM_TOKENS"],
        return_messages=True,
    )

    ai_fs = ConversationChain(
        llm=chat_llm,
        memory=buffer_memory_fs,
        prompt=prompt
    )

    return ai_fs


def create_format_ai() -> RunnableSerializable[dict, str]:
    # prompt = PromptTemplate(input_variables=['question'],
    # template="""Format the following to latex using only '$' AND NEVER USE '$$'\n{question}""")

    prompt = PromptTemplate.from_template("""Give me back this question formatted to latex using only '$' AND NEVER USE '$$' around ONLY math expressions.\n
    DO NOT ATTEMPT THE QUESTION. ONLY FORMAT MATH EXPRESSIONS TO LATEX AND DON'T ADD ANYTHING THAT WAS NOT IN THE ORIGINAL QUESTION.\n
    {question}""")
    llm = ChatOpenAI(
        model=os.environ["PRETRAINED_MODEL_NAME"], temperature=0.0, max_tokens=500)
    # llm = OpenAI(model=os.environ["PRETRAINED_MODEL_NAME"], temperature=0.0, max_tokens=500)

    return prompt | llm | StrOutputParser()


def create_ai_with_image(image_urls: List[str]):
    messages = [
        {
            'type': 'text',
            'text': """
                        Think carefully step by step when answering.
                        Question: {input} and show steps"""
        }
    ]

    messages += [{
        'type': 'image_url',
        'image_url': {
            'url': image_url
        }
    } for image_url in image_urls]

    chat_llm = ChatOpenAI(
        model=os.environ["PRETRAINED_MODEL_NAME"], temperature=0.0, max_tokens=4096)
    ex_prompt = ChatPromptTemplate.from_messages(
        [
            ('human', '{question}'),
            ('ai', '{answer}')
        ]
    )

    few_shot_prompt = FewShotChatMessagePromptTemplate(
        example_prompt=ex_prompt,
        examples=examples,
    )

    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", """
                        What is solution to the problem in the image?
                        Give the output in proper latex format only.\n \
                        Make sure all final answers are evaluated if real values are available\n \
                        All mathematics must be in latex
                        """),
            few_shot_prompt,
            HumanMessage(
                content=messages
            )
        ]
    )

    # buffer_memory_fs = ConversationSummaryBufferMemory(
    #     llm=chat_llm,
    #     max_token_limit=os.environ["MAX_NUM_TOKENS"],
    #     return_messages=True,
    # )
    #
    # ai_vision = ConversationChain(
    #     llm=chat_llm,
    #     memory=buffer_memory_fs,
    #     prompt=prompt
    # )

    return prompt | chat_llm
