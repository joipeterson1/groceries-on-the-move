#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session, jsonify
from flask_restful import Resource
from datetime import datetime, timezone

# Local imports
from config import app, db, api
from flask_cors import cross_origin
from models import Customer, Product, Order

class Home(Resource):
    @cross_origin(origins="http://localhost:3000")
    def get(self):
        return 'Welcome to Groceries on the Move!'
   
class Products(Resource):
    @cross_origin(origins="http://localhost:3000")
    def get(self):
        products =[product.to_dict() for product in Product.query.all()]
        print(products)
        return products, 200

class ProductByID(Resource):
    @cross_origin(origins="http://localhost:3000")
    def get(self, id):
       product = Product.query.filter(Product.id == id).first()
       product_dict = product.to_dict()
       return jsonify(product_dict), 200
    
class Orders(Resource):
    @cross_origin(origins="http://localhost:3000")
    def get(self):
        customer_id = session.get('customer_id')
        # customer_id = 1
        if customer_id:
            orders = Order.query.filter(Order.customer_id == customer_id)
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

        return new_order.to_dict(), 201

class OrderByID(Resource):
    @cross_origin(origins="http://localhost:3000")
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
                response = response_dict, 200

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
            
            return {'message': 'Order successfully deleted'}, 200
        
        return {'error': 'Order not found'}, 404
    

class CustomerSession(Resource):
    @cross_origin(origins="http://localhost:3000")
    def get(self):
        customer_id = session.get('customer_id')  # Retrieve customer ID from session or token
        if not customer_id:
            return jsonify({"error": "User not logged in"}), 401

        customer = Customer.query.filter(Customer.id == customer_id).first()
        if not customer:
            return jsonify({"message": "No customer profile"}), 200

        return jsonify(customer.to_dict()), 200

    
class ClearSession(Resource):
    @cross_origin(origins="http://localhost:3000")
    def delete(self):
        session['page_views'] = None
        session['customer_id'] = None
        return jsonify({}), 204
    
@app.before_request
def check_if_logged_in():
    open_access_list = [
        'signup',
        'login',
        'check-session',
        'products'
    ]

    if (request.endpoint) not in open_access_list and (not session.get('customer_id')):
        return {'error': '401 Unauthorized'}, 401

class SignUp(Resource):
    @cross_origin(origins="http://localhost:3000")
    def post(self):
        json = request.json
        customer = Customer(
            username=json.get('username')
        )
        customer.password_hash = json['password']
        customer.name = json['name']
        customer.phone_number = json['phone_number']
        customer.email = json['email']
        customer.address = json['address']
        db.session.add(customer)
        db.session.commit()
        session['customer_id'] = customer.id
        return jsonify(customer.to_dict()), 201

class CheckSession(Resource):
    @cross_origin(origins="http://localhost:3000")
    def get(self):
        print("Before session check, customer_id:", session.get('customer_id'))  # Debug print

        try:
            customer_id = session['customer_id']  # This can raise KeyError if session doesn't have 'customer_id'
        except KeyError:
            return jsonify({'message': '401: Not Authorized'}), 401

        print("After session check, customer_id:", customer_id)  # Debug print
        customer = Customer.query.filter(Customer.id == customer_id).first()
        if customer:
            return jsonify(customer.to_dict()), 200
        return jsonify({'message': '401: Not Authorized'}), 401



class Login(Resource):
    @cross_origin(origins="http://localhost:3000")
    def post(self):
        data = request.get_json()
        username = data['username']
        password = data['password']
        customer = Customer.query.filter(Customer.username == username).first()
        if customer and customer.authenticate(password):
            print("Before session assignment:", session.get('customer_id'))
            session['customer_id'] = customer.id
            db.session.commit()
            print("After session assignment:", session.get('customer_id'))
            return jsonify(customer.to_dict()), 200
        return jsonify({'error': 'Invalid username or password'}), 401

        

class Logout(Resource):
    @cross_origin(origins="http://localhost:3000")
    def delete(self):
        session['customer_id'] = None
        return jsonify({'message': '204: Non Content'}), 204
    
api.add_resource(Home, '/')
api.add_resource(Products, '/products')
api.add_resource(ProductByID, '/products/<int:id>')
api.add_resource(OrderByID, '/orders/<int:id>')
api.add_resource(Orders, '/orders')
api.add_resource(CustomerSession, '/customer')
api.add_resource(ClearSession, '/clear', endpoint="clear")
api.add_resource(SignUp, '/signup', endpoint="signup")
api.add_resource(CheckSession, '/check-session', endpoint="check-session")
api.add_resource(Login, '/login', endpoint="login")
api.add_resource(Logout, '/logout', endpoint="logout")
if __name__ == '__main__':
    app.run(port=5555, debug=True)

