from flask import Response, json


def custom_json_response(data, status_code):
    return Response(
        mimetype="application/json",
        response=json.dumps(data),
        status=status_code
    )


def get_req_image(request, key):
    # Needed for Postman requests as Postman submits files in request.files
    if key in request.files:
        return request.files[key]
    else:
        return request.form.to_dict().get(key)
