#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session, jsonify, make_response
from flask_restful import Resource
from datetime import datetime, timezone

# Local imports
from config import app, db, api

from models import Customer, Product, Order, order_product_table

class Home(Resource):
    def get(self):
        return 'Welcome to Groceries on the Move!'
   
class Products(Resource):
    def get(self):
        products =[product.to_dict() for product in Product.query.all()]
        return make_response(jsonify(products), 200)

class ProductByID(Resource):
    def get(self, id):
       product = Product.query.filter(Product.id == id).first()
       product_dict = product.to_dict()
       return make_response(jsonify(product_dict), 200)
    
class Orders(Resource):
    def get(self):
        customer_id = session.get('customer_id')
        if customer_id:
            orders = Orders.query.filter(Order.customer_id == session.get['customer_id'])
            return [order.to_dict() for order in orders], 200
        return {'error': 'Unauthorized'}, 401

    def post(self):
        customer_id = session.get('customer_id')
        if not customer_id:
            return {'error': 'Customer not logged in'}, 401
        
        customer = Customer.query.get(customer_id)
        if not customer:
            return {'error': 'Customer not found'}, 404
        
        data = request.get_json()
        product_ids = data.get('product_id', [])
        products = Product.query.filter(Product.id.in_(product_ids)).all()
        
        if len(products) != len(product_ids):
            return {'error': 'One or more products not found'}, 404

        order_total = sum([product.price for product in products])

        new_order = Order(
            order_date=datetime.now(timezone.utc),
            order_total=order_total,
            customer_id=customer_id
        )
        
        new_order.products = products
        
        db.session.add(new_order)
        db.session.commit()

        return make_response(jsonify(new_order.to_dict()), 201)

class OrderByID(Resource):
    def patch(self, id):
        customer_id = session.get('customer_id')
        if not customer_id:
            return {'error': 'Customer not logged in'}, 401
        order = Order.query.filter_by(id=id, customer_id=customer_id).first()
        if order:
                for attr in request.form:
                    setattr(order, attr, request.form[attr])
        
                db.session.add(order)
                db.session.commit() 

                response_dict = order.to_dict()
                response = make_response(jsonify(response_dict, 200))

                return response
        
        return {'error': 'Order not found'}, 404
    
    def delete(self, id):
        customer_id = session.get('customer_id')
        if not customer_id:
            return {'error': 'Customer not logged in'}, 401
        
        order = Order.query.filter_by(id=id, customer_id=customer_id).first()
        
        if order:
            db.session.delete(order)
            db.session.commit()
            
            return jsonify({'message': 'Order successfully deleted'}), 200
        
        return {'error': 'Order not found'}, 404
    
class Cart(Resource):
    def get(self):
        cart = []
        
        if cart:
            response_dict = cart.to_dict()
            response = make_response(jsonify(response_dict, 200))
    
class ClearSession(Resource):
    def delete(self):
        session['page_views'] = None
        session['customer_id'] = None
        return {}, 204

class SignUp(Resource):
    def post(self):
        json = request.json()
        customer = Customer(
            username=json['username']
        )
        customer.password_hash = json['password']
        customer.name = json['name']
        customer.phone_number = json['phone_number']
        customer.email = json['email']
        customer.address = json['address']
        db.session.add(customer)
        db.session.commit()
        return make_response(jsonify(customer.to_dict(), 201))

class CheckSession(Resource):
    def get(self):
        customer = Customer.query.filter(Customer.id == session.get('customer_id')).first()
        if customer:
            return make_response(jsonify(customer.to_dict(), 200))
        return {}, 204

class Login(Resource):
    def post(self):
        username = request.get_json()['username']
        customer = Customer.query.filter(Customer.username == username).first()
        password = request.get_json()['password']
        if customer.authenticate(password):
            session['customer_id'] = customer.id
            return make_response(jsonify(customer.to_dict(), 200))
        return {'error': 'Invalid username or password'}, 401

class Logout(Resource):
    def delete(self):
        session['customer_id'] = None
        return {'message': '204: Non Content'}, 204
    
api.add_resource(Home, '/')
api.add_resource(Products, '/products')
api.add_resource(ProductByID, '/products/<int:id>')
api.add_resource(OrderByID, '/orders/<int:id>')
api.add_resource(Orders, '/orders')
api.add_resource(Cart, '/cart')
api.add_resource(ClearSession, '/clear', endpoint="clear")
api.add_resource(SignUp, '/signup', endpoint="signup")
api.add_resource(CheckSession, '/check_session', endpoint="check_session")
api.add_resource(Login, '/login', endpoint="login")
api.add_resource(Logout, '/logout', endpoint="logout")

if __name__ == '__main__':
    app.run(port=5555, debug=True)

