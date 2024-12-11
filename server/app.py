
from flask import request, session, jsonify
from flask_restful import Resource
from datetime import datetime, timezone


from config import app, db, api
from flask_cors import cross_origin
from models import Customer, Product, Order, order_product_table, OrderProduct

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
    
class Orders(Resource):
    @cross_origin(origins="http://localhost:3000")
    def get(self):
        customer_id = session.get('customer_id')
        if customer_id:
            orders = Order.query.filter(Order.customer_id == customer_id).all()
            
            orders_data = []
            for order in orders:
                order_data = order.to_dict() 
                products_data = []
                

                for order_product in order.order_products:
                    product = order_product.product
                    product_data = {
                        "id": product.id,
                        "price": product.price,
                        "product_img": product.product_img,
                        "product_name": product.product_name,
                        "quantity": order_product.quantity
                    }
                    products_data.append(product_data)
                
                order_data["products"] = products_data
                orders_data.append(order_data)
            
            return orders_data, 200
        
        return {'error': 'Unauthorized'}, 401

    def post(self):
        customer_id = session.get('customer_id')
        if not customer_id:
            return {'error': 'Customer not logged in'}, 401
        
        customer = Customer.query.get(customer_id)
        if not customer:
            return {'error': 'Customer not found'}, 404
        
        data = request.get_json()
        print("Received order data:", data) 
        all_products = data.get('products', [])

        order_total = 0.0
        order_product_entries = [] 

        for item in all_products:
            product_id = item['id']
            quantity = item['quantity']
            product = Product.query.get(product_id)
            
            if not product:
                return {'error': f'Product with ID {product_id} not found'}, 404


            order_total += product.price * quantity


            order_product_entries.append({
                'product_id': product.id,
                'quantity': quantity
            })


        new_order = Order(
            order_date=datetime.now(timezone.utc),
            order_total=order_total,
            customer_id=customer_id,
        )
        db.session.add(new_order)
        db.session.commit()

        for entry in order_product_entries:

            db.session.add(OrderProduct(
            order_id=new_order.id,
            product_id=entry['product_id'],
            quantity=entry['quantity']
            ))
        
        db.session.commit()


        return new_order.to_dict(), 201


class OrderByID(Resource):
    @cross_origin(origins="http://localhost:3000") 
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

    def patch(self, id):
        # Get the customer ID from the session
        customer_id = session.get('customer_id')
        if not customer_id:
            return {'error': 'Customer not logged in'}, 401

        # Fetch the order by ID for the customer
        order = Order.query.filter_by(id=id, customer_id=customer_id).first()

        if not order:
            return {'error': 'Order not found'}, 404

        # Get the updated data from the request body
        data = request.get_json()

        # Update the order fields based on the provided data
        if 'order_date' in data:
            order.order_date = data['order_date']
        
        if 'order_total' in data:
            order.order_total = data['order_total']

        # Handle updating the products associated with the order
        if 'products' in data:
            # Delete the existing OrderProduct associations
            for order_product in order.order_products:
                db.session.delete(order_product)

            # Add the new OrderProduct associations based on the provided products
            for item in data['products']:
                product = Product.query.get(item['id'])
                if product:
                    order_product = OrderProduct(
                        order_id=order.id,
                        product_id=product.id,
                        quantity=item['quantity']
                    )
                    db.session.add(order_product)

        # Commit the changes to the database
        db.session.commit()

        # Return the updated order as a response
        return order.to_dict(), 200

    

class CustomerSession(Resource):
    @cross_origin(origins="http://localhost:3000")
    def get(self):
        customer_id = session.get('customer_id')
        if not customer_id:
            return jsonify({"error": "User not logged in"}), 401

        customer = Customer.query.filter(Customer.id == customer_id).first()
        if not customer:
            return jsonify({"message": "No customer profile"}), 200

        return jsonify(customer.to_dict()), 200
    
    def patch(self, id):
        customer_id = session.get('customer_id')
        if not customer_id:
            return {'error': 'Customer not logged in'}, 401
        customer = Customer.query.filter(Customer.id == customer_id).first()
        if customer:
                for attr in request.form:
                    setattr(customer, attr, request.form[attr])
        
                db.session.add(customer)
                db.session.commit() 

                response_dict = customer.to_dict()
                response = response_dict, 200

                return response
        
        return {'error': 'Customer not found'}, 404
    
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
        try:
            customer_id = session['customer_id']
        except KeyError:
            return jsonify({'message': '401: Not Authorized'}), 401
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

