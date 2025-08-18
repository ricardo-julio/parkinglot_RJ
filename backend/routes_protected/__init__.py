from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user_model import user

protected_bp = Blueprint('protected', __name__)

@protected_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    user_cc = get_jwt_identity()
    usuario = user.query.filter_by(cc=user_cc).first()
    if not usuario:
        return jsonify({'message': 'User not found'}), 404
    return jsonify({
        'id': usuario.id,
        'username': usuario.username,
        'cc': usuario.cc
    }), 200


