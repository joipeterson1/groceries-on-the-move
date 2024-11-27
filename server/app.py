#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response
from flask_restful import Resource

# Local imports
from config import app, db, api

from models import Customer, Product, Order, order_product_table


# Views go here!

class Home(Resource):
    def get_products():
        return '<h1>Welcome to Groceries on the Move!</h1>'

class ProductByID(Resource):
    def get_product_by_id(id):
        pass

class OrderByID(Resource):
    def get_order_by_id(id):
        pass

    def confirm_order_by_id(id):
        pass
    
    def patch_order_by_id(id):
        pass
    
    def delete_order_by_id(id):
        pass
    
class AddOrder(Resource):
    def post_orders():
        pass
    
class ClearSession(Resource):
    def clear():
        pass

class SignUp(Resource):
    def post_signup():
        pass

class CheckSession(Resource):
    def get_username():
        pass

class Login(Resource):
    def post_session():
        pass

class Logout(Resource):
    def delete_session():
        pass
    
api.add_resource(Home, '/')
api.add_resource(ProductByID, '/products/<int:id>')
api.add_resource(OrderByID, '/orders/<int:id>')
api.add_resource(AddOrder, '/orders')
api.add_resource(ClearSession, '/clear', endpoint="clear")
api.add_resource(SignUp, '/signup', endpoint="signup")
api.add_resource(CheckSession, '/check_session', endpoint="check_session")
api.add_resource(Login, '/login', endpoint="login")
api.add_resource(Logout, '/logout', endpoint="logout")

if __name__ == '__main__':
    app.run(port=5555, debug=True)

