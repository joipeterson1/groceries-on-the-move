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

class ProductPage(Resource):
    def get_product_by_id(id):
        return f'<h1></h1>'

class MyOrders(Resource):
    def get_order_by_id(id):
        return '<h1>Project Server</h1>'

    def confirm_order_by_id(id):
        return '<h1>Project Server</h1>'
    
    def patch_order_by_id(id):
        return '<h1>Project Server</h1>'
    
    def delete_order_by_id(id):
        return '<h1>Project Server</h1>'
    
class OrderForm(Resource):
    def post_orders():
        return '<h1>Project Server</h1>'
    
api.add_resource(Home, '/')
api.add_resource(ProductPage, '/products/<int:id>')
api.add_resource(MyOrders, '/orders/<int:id>')
api.add_resource(OrderForm, '/orders')


if __name__ == '__main__':
    app.run(port=5555, debug=True)

