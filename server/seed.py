#!/usr/bin/env python3

import datetime
from random import randint, choice as rc
from faker import Faker
from app import app
from models import db, Customer, Product, Order, OrderProduct
from sqlalchemy import text
from werkzeug.security import generate_password_hash

# Helper function to insert or update order product (insert or merge)
def insert_order_product(order_id, product_id, quantity):
    existing_order_product = db.session.query(OrderProduct).filter_by(
        order_id=order_id, product_id=product_id).first()
    
    if existing_order_product:
        # Update quantity if the product already exists in the order
        existing_order_product.quantity += quantity
    else:
        # Otherwise, insert a new record
        new_order_product = OrderProduct(order_id=order_id, product_id=product_id, quantity=quantity)
        db.session.add(new_order_product)

# Alternative helper function using db.session.merge
def add_products_to_order(order, products_quantities):
    for product, quantity in products_quantities:
        # Merge logic will update the quantity if the product already exists in the order
        db.session.merge(OrderProduct(
            order_id=order.id,
            product_id=product.id,
            quantity=quantity
        ))

if __name__ == '__main__':
    fake = Faker()

    with app.app_context():
        print("Starting seed...")
        db.session.execute(text('DELETE FROM order_products'))
        db.session.commit()

        Customer.query.delete()
        Product.query.delete()
        Order.query.delete()
        db.session.commit()

        print("Creating Customers...")

        # Create customers
        password_hash = generate_password_hash("mynameisjane")
        c1 = Customer(
            name="Jane Doe", 
            username="janedoe1234",
            password_hash="mynameisjane",
            phone_number="8504463222",
            email="janedoe@gmail.com",
            address="112 Love Dr Atlanta, GA 33234")
        
        password_hash = generate_password_hash("austin100")
        c2 = Customer(
            name="Austin Powers",
            username="austin100",
            password_hash="mynameisaustin",
            phone_number="8502232222",
            email="austinnn@gmail.com",
            address="999 Powers Lane Atlanta, GA 33204")
        
        password_hash = generate_password_hash("davisa12")
        c3 = Customer(
            name="Ashton Davis",
            username="davisa12",
            password_hash="mynameisashton", 
            phone_number="8501234567",
            email="davisa@gmail.com",
            address="89 Cookie Lane Tallahassee, FL 33234")
        
        password_hash = generate_password_hash("carter55")
        c4 = Customer(
            name="Ashley Carter",
            username="carter55",
            password_hash="mynameisash", 
            phone_number="2230098877",
            email="carterashley@yahoo.com",
            address="999 Warner Way Jacksonville, FL 33344")
        
        password_hash = generate_password_hash("petersonjoi")
        c5 = Customer(
            name="Dalecia Peterson",
            username="petersonjoi",
            password_hash="joipeterson1", 
            phone_number="2231124423",
            email="petersonjoi@yahoo.com",
            address="999 Jackson St Jacksonville, FL 33344")
        db.session.add_all([c1, c2, c3, c4, c5])
        db.session.commit()
            
        print("Creating Products...")

        # Create products
        p1 = Product(product_name="Whole Milk", price=3.99, product_img="https://i5.walmartimages.com/seo/Great-Value-Milk-Whole-Vitamin-D-Gallon-Plastic-Jug_6a7b09b4-f51d-4bea-a01c-85767f1b481a.86876244397d83ce6cdedb030abe6e4a.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF")
        p2 = Product(product_name="Bread Loaf", price=1.59, product_img="https://growingdawn.com/wp-content/uploads/2023/08/homemadevsstorebought-5.jpg")
        p3 = Product(product_name="Orange Juice", price=3.00, product_img="https://www.kroger.com/product/images/large/front/0001111091102")
        p4 = Product(product_name="Tissue", price=10.99, product_img="https://www.chefstore.com/images/usf_items/3950614/3950614.jpg")
        p5 = Product(product_name="Toothpaste", price=1.50, product_img="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTR7M0icUqqbf0aK-zFYD_PnGBxggq9p0zJSw&s")
        p6 = Product(product_name="Mouthwash", price=2.99, product_img="https://i5.peapod.com/c/Y3/Y3G1A.png")
        db.session.add_all([p1, p2, p3, p4, p5, p6])
        db.session.commit()

        print("Placing Orders....")

        # Helper function to calculate order totals
        def order_totals(product_array):
            order_total = 0
            for product in product_array:
                order_total += product.price
            return order_total

        # Create orders and add products directly to the orders
        o1 = Order(order_date=datetime.datetime(2024, 11, 20),
        order_total=order_totals([p1, p2]), customer_id=c1.id)
        o2 = Order(order_date=datetime.datetime(2024, 11, 15),
        order_total=order_totals([p1, p6]), customer_id=c3.id)
        o3 = Order(order_date=datetime.datetime(2024, 11, 25),
        order_total=order_totals([p2, p6]), customer_id=c5.id)

        db.session.add_all([o1, o2, o3])
        db.session.commit()

       # Insert products into orders using the helper function
        add_products_to_order(o1, [(p1, 2), (p2, 3)])
        add_products_to_order(o2, [(p1, 1), (p6, 2)])
        add_products_to_order(o3, [(p2, 3), (p6, 1)])

        # Commit the session after adding products
        db.session.commit()

        print("Complete!")

