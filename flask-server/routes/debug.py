from flask import Blueprint, jsonify
from models.user import User
import logging

debug_bp = Blueprint('debug', __name__)

@debug_bp.route('/api/debug/users', methods=['GET'])
def get_all_users():
    """Debug endpoint to view all registered users (for development only)"""
    try:
        users = User.objects.all()
        users_data = []
        
        for user in users:
            users_data.append({
                'id': str(user.id),
                'email': user.email,
                'firstName': user.first_name,
                'lastName': user.last_name,
                'userType': user.user_type,
                'section': user.section if hasattr(user, 'section') else None,
                'department': user.department if hasattr(user, 'department') else None,
                'createdAt': user.created_at.strftime('%Y-%m-%d %H:%M:%S') if user.created_at else None,
                'lastLogin': user.last_login.strftime('%Y-%m-%d %H:%M:%S') if user.last_login else 'Never',
                'isActive': user.is_active
            })
        
        return jsonify({
            'success': True,
            'totalUsers': len(users_data),
            'users': users_data
        }), 200
        
    except Exception as e:
        logging.error(f"Error fetching users: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@debug_bp.route('/api/debug/database-status', methods=['GET'])
def get_database_status():
    """Check database connection and collections"""
    try:
        # Count documents in each collection
        user_count = User.objects.count()
        
        return jsonify({
            'success': True,
            'database': 'plagexit_db',
            'collections': {
                'users': user_count
            },
            'connection': 'Connected to MongoDB Atlas'
        }), 200
        
    except Exception as e:
        logging.error(f"Error checking database status: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500