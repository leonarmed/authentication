"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/user', methods=['POST'])
def handle_user():
    body = request.json
    new_user=User.create(body)
    if not isinstance(new_user, User):
        return jsonify({
            "message": new_user["message"],
            "success": False
        }), new_user["status"]
    user = User.query.filter_by(email=new_user.email).one_or_none()
    return jsonify({
        "success": True,
        "message": "User was created successfully",
        "data": user.serialize()
    }), 201

@api.route("/user", methods=['GET'])
@jwt_required()
def get_user_info():
    user_id = get_jwt_identity()
    return jsonify({
        "message": "accede",
        "user_id": user_id
    })

@api.route('/login', methods=['POST'])
def login():
    body = request.json
    valid_credentials = User.verify_credentials(email=body["email"], password=body["password"])
    if not isinstance(valid_credentials, User):
        return jsonify({
            "message": valid_credentials["message"],
            "success": False
        }), valid_credentials["status"]
    access_token = create_access_token(identity=valid_credentials.id)
    print(access_token)
    return jsonify({
        "message": "Success verification",
        "success": True,
        "token": access_token
    }), 200