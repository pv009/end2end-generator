from types import SimpleNamespace
import json
from flask import Flask, request, json, Response
from flask_cors import CORS
from pymongo import MongoClient
from db_connector import DatabaseConnector
from keys import ApiKeys
from bson import json_util
import os

app = Flask(__name__)
CORS(app)

accepted_keys = ApiKeys().getKeys()

notAuthError = 'Youre not authenticated'

data = {
    "database": "e2e-generator",
    "collection": "stories",
}

db = DatabaseConnector(data)


def check_auth(apiKey):
    if not(apiKey is None):
        if apiKey in accepted_keys:
            return True
        else:
            return False
    else: return False


@app.route('/stories', methods=['GET'])
def all_stories():
    if check_auth(request.headers.get('apiKey')):
        response = db.read_all()
        return Response(response=json_util.dumps(response),
                        status=200,
                        mimetype='application/json')
    else:
        return notAuthError


@app.route('/stories/<id>', methods=['GET'])
def single_entry(id):
    if check_auth(request.headers.get('apiKey')):
        response = db.read_one(id)
        return Response(response=json_util.dumps(response),
                        status=200,
                        mimetype='application/json')
    else:
        return notAuthError


@app.route('/stories', methods=['POST'])
def add_story():
    if check_auth(request.headers.get('apiKey')):
        story_to_add = request.get_json()
        result = db.write_one(story_to_add)
        return Response(response=json_util.dumps(result),
                        status=200,
                        mimetype='application/json')
    else:
        return notAuthError


@app.route('/stories/<id>', methods=['PUT'])
def update_story(id):
    if check_auth(request.headers.get('apiKey')):
        story_to_update = request.get_json()
        result = db.update_one(id, story_to_update)
        return Response(response=json_util.dumps(story_to_update),
                        status=200,
                        mimetype='application/json')
    else:
        return notAuthError


@app.route('/stories/<id>', methods=['DELETE'])
def delete_story(id):
    if check_auth(request.headers.get('apiKey')):
        db.delete_one(id)
        return Response(response='{"status": "success"}',
                        status=200,
                        mimetype='application/json')
    else:
        return notAuthError


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)