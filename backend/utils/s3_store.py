import os, boto3, dotenv, random
from typing import Union
import logging

dotenv.load_dotenv()

s3 = boto3.resource('s3')
s3_client = boto3.client('s3', aws_access_key_id=os.getenv('ACCESS_KEY'),
                         aws_secret_access_key=os.getenv('SECRET_ACCESS_KEY'))


#
# BUCKET_NAME = 'web-avatar'

def upload_image(image: Union[bytes, str], key: str) -> str:
    BUCKET_NAME = os.getenv("BUCKET_NAME")
    # KEY = f"user_{random.randint(a=1, b=100)}.jpg"
    try:
        response = s3_client.put_object(
            # ACL='public-read',
            Body=image,
            Bucket=BUCKET_NAME,
            Key=key
        )

        # print(response)
        return f"https://{BUCKET_NAME}.s3.amazonaws.com/{key}"
    except Exception as err:
        logging.error(err)
        raise err


def delete_image(key: str) -> None:
    BUCKET_NAME = os.getenv("BUCKET_NAME")
    try:
        response = s3_client.delete_object(
            # ACL='public-read',
            Bucket=BUCKET_NAME,
            Key=key
        )
    except Exception as err:
        logging.error(err)
        raise err
