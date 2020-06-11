from flask import Response, json


def custom_json_response(data, status_code):
    return Response(
        mimetype="application/json",
        response=json.dumps(data),
        status=status_code
    )
