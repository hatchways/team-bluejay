import boto3
from config import AWS_ACCESS_KEY, AWS_SECRET_KEY


def upload_profile_picture(file, profile_id):
    if not is_image_file(file.filename):
        return False

    bucket = 'team-bluejay'
    bucket_folder = 'profile_pictures'
    s3_file_path = f'{bucket_folder}/UserID-{str(profile_id)}.jpg'

    s3 = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY,
                      aws_secret_access_key=AWS_SECRET_KEY)

    # Todo: put hosting location of imageUrl into config file and read from there, "S3_LOCATION"
    imageUrl = f'https://team-bluejay.s3.amazonaws.com/{s3_file_path}'
    try:
        s3.upload_fileobj(file, bucket, s3_file_path,
                          ExtraArgs={'ACL': 'public-read', "ContentType": file.content_type})
    except Exception as e:
        print(e)
        return False
    return imageUrl


def is_image_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
