#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session, jsonify
from flask_restful import Resource
from datetime import datetime, timezone

# Local imports
from config import app, db, api
from flask_cors import cross_origin
from models import Customer, Product, Order, Cart, CartItem

class Home(Resource):
    @cross_origin(origins="http://localhost:3000")
    def get(self):
        return 'Welcome to Groceries on the Move!'
   
class Products(Resource):
    @cross_origin(origins="http://localhost:3000")
    def get(self):
        products =[product.to_dict() for product in Product.query.all()]
        return jsonify(products), 200

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
        if customer_id:
            orders = Order.query.filter(Order.customer_id == customer_id)
            return [order.to_dict() for order in orders], 200
        return jsonify({'error': 'Unauthorized'}), 401

    def post(self):
        customer_id = session.get('customer_id')
        if not customer_id:
            return jsonify({'error': 'Customer not logged in'}), 401
        
        customer = Customer.query.get(customer_id)
        if not customer:
            return jsonify({'error': 'Customer not found'}), 404
        
        data = request.get_json()
        product_ids = data.get('product_id', [])
        products = Product.query.filter(Product.id.in_(product_ids)).all()
        
        if len(products) != len(product_ids):
            return jsonify({'error': 'One or more products not found'}), 404

        order_total = sum([product.price for product in products])

        new_order = Order(
            order_date=datetime.now(timezone.utc),
            order_total=order_total,
            customer_id=customer_id
        )
        
        new_order.products = products
        
        db.session.add(new_order)
        db.session.commit()

        return jsonify(new_order.to_dict()), 201

class OrderByID(Resource):
    @cross_origin(origins="http://localhost:3000")
    def patch(self, id):
        customer_id = session.get('customer_id')
        if not customer_id:
            return jsonify({'error': 'Customer not logged in'}), 401
        order = Order.query.filter_by(id=id, customer_id=customer_id).first()
        if order:
                for attr in request.form:
                    setattr(order, attr, request.form[attr])
        
                db.session.add(order)
                db.session.commit() 

                response_dict = order.to_dict()
                response = jsonify(response_dict, 200)

                return response
        
        return jsonify({'error': 'Order not found'}), 404
    
    def delete(self, id):
        customer_id = session.get('customer_id')
        if not customer_id:
            return jsonify({'error': 'Customer not logged in'}), 401
        
        order = Order.query.filter_by(id=id, customer_id=customer_id).first()
        
        if order:
            db.session.delete(order)
            db.session.commit()
            
            return jsonify({'message': 'Order successfully deleted'}), 200
        
        return jsonify({'error': 'Order not found'}), 404
    
class CartSession(Resource):
    @cross_origin(origins="http://localhost:3000")
    def get(self):
        customer_id = session.get('customer_id')  # Retrieve customer ID from session or token
        if not customer_id:
            return jsonify({"error": "User not logged in"}), 401

        cart = Cart.query.filter_by(customer_id=customer_id).first()
        if not cart:
            return jsonify({"message": "Cart is empty"}), 200

        return jsonify(cart.to_dict()), 200
    
    def post(self):
        data = request.get_json()
        customer_id = session.get('customer_id')  # Retrieve customer ID from session or token
        product_id = data.get('product_id')
        quantity = data.get('quantity', 1)

        if not customer_id:
            return jsonify({"error": "User not logged in"}), 401

        product = Product.query.get(product_id)
        if not product:
            return jsonify({"error": "Product not found"}), 404

        cart = Cart.query.filter_by(customer_id=customer_id).first()
        if not cart:
            cart = Cart(customer_id=customer_id)
            db.session.add(cart)
            db.session.commit()

    # Check if product already exists in the cart
        cart_item = CartItem.query.filter_by(cart_id=cart.id, product_id=product_id).first()
        if cart_item:
            cart_item.quantity += quantity  # Update quantity
        else:
            cart_item = CartItem(cart_id=cart.id, product_id=product_id, quantity=quantity)
            db.session.add(cart_item)

        db.session.commit()
        response = jsonify({"message": "Item added to cart"}), 200
        print("Response before return:", response)  # Debugging line
        return response  # Direct return of the response object
    

    def delete(self):
        data = request.get_json()
        customer_id = session.get('customer_id')  # Retrieve customer ID from session or token
        product_id = data.get('product_id')

        if not customer_id:
            return jsonify({"error": "User not logged in"}), 401

        cart = Cart.query.filter_by(customer_id=customer_id).first()
        if not cart:
            return jsonify({"error": "Cart not found"}), 404

        cart_item = CartItem.query.filter_by(cart_id=cart.id, product_id=product_id).first()
        if not cart_item:
            return jsonify({"error": "Item not in cart"}), 404

        db.session.delete(cart_item)
        db.session.commit()
        return jsonify({"message": "Item removed from cart"}), 200

    def patch(self):
        customer_id = session.get('customer_id')
        if not customer_id:
            return jsonify({'error': 'Customer not logged in'}), 401
        cart = Cart.query.filter_by(customer_id=customer_id).first()
        if cart:
                for attr in request.form:
                    setattr(cart, attr, request.form[attr])
        
                db.session.add(cart)
                db.session.commit() 

                response_dict = cart.to_dict()
                return jsonify(response_dict), 200
        
        return jsonify({'error': 'Your cart is empty.'}), 404
    
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

class SignUp(Resource):
    @cross_origin(origins="http://localhost:3000")
    def post(self):
        json = request.json
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
        return jsonify(customer.to_dict(), 201)

class CheckSession(Resource):
    @cross_origin(origins="http://localhost:3000")
    def get(self):
        print("Session customer_id:", session.get('customer_id'))  # Check if the session value is set
        customer_id = session.get('customer_id')
        if customer_id:
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
            session['customer_id'] = customer.id
            print("Session customer_id:", session.get('customer_id'))
            return jsonify(customer.to_dict(), 200)
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
api.add_resource(CartSession, '/cart')
api.add_resource(CustomerSession, '/customer')
api.add_resource(ClearSession, '/clear', endpoint="clear")
api.add_resource(SignUp, '/signup', endpoint="signup")
api.add_resource(CheckSession, '/check-session', endpoint="check-session")
api.add_resource(Login, '/login', endpoint="login")
api.add_resource(Logout, '/logout', endpoint="logout")
if __name__ == '__main__':
    app.run(port=5555, debug=True)

