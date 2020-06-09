import boto3
from config import AWS_ACCESS_KEY, AWS_SECRET_KEY


def upload_picture(file, s3_file_path):
    if not is_image_file(file.filename):
        return False

    bucket = 'team-bluejay'

    s3 = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY,
                      aws_secret_access_key=AWS_SECRET_KEY)

    try:
        s3.upload_fileobj(file, bucket, s3_file_path,
                          ExtraArgs={'ACL': 'public-read', "ContentType": file.content_type})
    except Exception as e:
        print(e)
        return False

    imageUrl = f'https://team-bluejay.s3.amazonaws.com/{s3_file_path}'
    return imageUrl


def is_image_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
