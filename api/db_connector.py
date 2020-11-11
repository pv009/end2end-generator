from flask import Flask, request, json, Response
from pymongo import MongoClient
from bson.json_util import dumps, loads, ObjectId


class DatabaseConnector:
    def __init__(self, data):
        self.client = MongoClient(
            "mongodb+srv://paul:37z66aih8AwZFL@generator.m40f2.mongodb.net/e2e-generator")

        database = data['database']
        collection = data['collection']
        cursor = self.client[database]
        self.collection = cursor[collection]
        self.data = data

    def read_all(self):
        documents = self.collection.find()
        output = [{item: data[item] for item in data}
                  for data in documents]
        return output

    def read_one(self, id):
        query = {"_id": ObjectId(id)}
        print(query)
        document = list(self.collection.find(query))

        return loads(dumps(document))

    def write_one(self, doc):
        new_doc = self.collection.insert_one(doc)
        query = {"_id": new_doc.inserted_id}
        document = list(self.collection.find(query))

        return loads(dumps(document))

    def update_one(self, id, doc):
        query = {"_id": ObjectId(id)}
        print(doc)
        data = doc
        print(data)
        new_values = {
            "$set": {
                "mainContext": data['mainContext'],
                "subContext": data['subContext'],
                "userRole": data['userRole'],
                "goal": data['goal'],
                "reason": data['reason'],
                "acceptenceCriteria": data['acceptenceCriteria']
            }
        }
        self.collection.update_one(query, new_values)

        updated_document = list(self.collection.find(query))

        return loads(dumps(updated_document))

    def delete_all(self):
        self.collection.delete_many({})

    def delete_one(self, id):
        query = {"_id": ObjectId(id)}
        self.collection.delete_one(query)