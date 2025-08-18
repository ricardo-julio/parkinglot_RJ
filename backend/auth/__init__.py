import datetime
from flask import Blueprint, request, jsonify
from extensiones import db, bcrypt
from models.user_model import user
from flask_jwt_extended import ( create_access_token, jwt_required, create_refresh_token, get_jwt_identity )

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    cc = data.get('cc')
    password = data.get('password')

    if not username or not cc or not password:
        return jsonify({'message': 'Enter all fields'}), 400

    if user.query.filter_by(cc=cc).first():
        return jsonify({'message': 'User with this cc already exists'}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = user(username=username, cc=cc, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    cc = data.get('cc')
    password = data.get('password')

    usuario = user.query.filter_by(cc=cc).first()

    if not usuario or not bcrypt.check_password_hash(usuario.password, password):
        return jsonify({'message': 'Invalid credentials'}), 401

    token = create_access_token(identity=str(usuario.cc), expires_delta=datetime.timedelta(minutes=30)) #ojo datetime
    refresh_token = create_refresh_token(identity=str(usuario.cc))
    return jsonify({'token': token, 'username': usuario.username, "refresh_token": refresh_token, "cc": usuario.cc, "message": "Login successful"}), 200


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    new_token = create_access_token(identity=current_user, expires_delta=datetime.timedelta(minutes=30))
    return jsonify({'token': new_token}), 200
