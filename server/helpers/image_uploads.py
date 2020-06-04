import boto3

ACCESS_KEY = 'AKIAJOFIZZ6SI5AZRWAA'
SECRET_KEY = 'z/zcq/dLRTHfZY2edDbzzV0ncxkSQwjXrXQ4W2l0'


def upload_profile_picture(profile_id):
    local_file = 'images/sample_image.png'
    bucket = 'team-bluejay'
    bucket_folder = 'profile_pictures'
    s3_file_path = f'{bucket_folder}/UserID-{str(profile_id)}.jpg'

    s3 = boto3.client('s3', aws_access_key_id=ACCESS_KEY,
                      aws_secret_access_key=SECRET_KEY)

    try:
        s3.upload_file(local_file, bucket, s3_file_path,
                       ExtraArgs={'ACL': 'public-read'})
        imageUrl = f'https://team-bluejay.s3.amazonaws.com/{s3_file_path}'
    except Exception as e:
        print(e)
        return False
    return imageUrl
