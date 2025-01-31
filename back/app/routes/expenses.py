from flask import Blueprint

expenses_bp = Blueprint('expenses', __name__)


@expenses_bp.route('/create', methods=['POST'])
def create_expense():
    pass