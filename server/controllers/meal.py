from server.helpers.image_uploads import upload_picture
from server.helpers.api import custom_json_response
from server.models.MealItem import MealItem, MealItemSchema
meal_item_schema = MealItemSchema()
from marshmallow import ValidationError

# Todo: refactor create meal, edit meal, and become_chef to reuse duplicate code


def become_chef(meal, chef_cuisine, imageFile=None,):
    try:
        meal_data = meal_item_schema.load(meal)
    except ValidationError as err:
        return custom_json_response(err.messages, 400)

    new_meal = MealItem(**meal_data)
    new_meal.save()

    if imageFile:
        s3_file_path = f'meal/{new_meal.id}/meal_pic'
        image_url = upload_picture(imageFile, s3_file_path)

        if not image_url:
            return custom_json_response({"error": "Error with uploading image"}, 400)

        new_meal.update({'image': image_url})

    data = {
        "message": "Created",
        "meal": meal_item_schema.dump(new_meal),
        "chefCuisine": chef_cuisine
    }
    return custom_json_response(data, 200)


def create_meal(meal, imageFile=None):
    try:
        meal_data = meal_item_schema.load(meal)
    except ValidationError as err:
        return custom_json_response(err.messages, 400)

    new_meal = MealItem(**meal_data)
    new_meal.save()

    if imageFile:
        s3_file_path = f'meal/{new_meal.id}/meal_pic'
        image_url = upload_picture(imageFile, s3_file_path)

        if not image_url:
            return custom_json_response({"error": "Error with uploading image"}, 400)

        new_meal.update({'image': image_url})

    data = {
        "message": "Created",
        "meal": meal_item_schema.dump(new_meal)
    }
    return custom_json_response(data, 200)


def edit_meal(edited_meal, meal_item, imageFile=None):
    if imageFile:
        s3_file_path = f'meal/{meal_item.id}/meal_pic'
        image_url = upload_picture(imageFile, s3_file_path)

        if not image_url:
            return custom_json_response({"error": "Error with uploading image"}, 400)

        edited_meal['image'] = image_url
    try:
        valid_data = meal_item_schema.load(edited_meal, partial=True)
    except ValidationError as err:
        return custom_json_response(err.messages, 400)

    # prevent userId from being edited
    valid_data.pop("userId", None)
    meal_item.update(valid_data)
    data = {
        "meal": meal_item_schema.dump(meal_item),
        "message": "Succesfully Edited."
    }
    return custom_json_response(data, 200)
