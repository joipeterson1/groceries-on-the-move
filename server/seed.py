#!/usr/bin/env python3

import datetime
from random import randint, choice as rc
from faker import Faker
from app import app
from models import db, Customer, Product, Order, order_product_table

if __name__ == '__main__':
    fake = Faker()

    with app.app_context():
        print("Starting seed...")
        Customer.query.delete()
        Product.query.delete()
        Order.query.delete()
        db.session.commit()

        print("Creating Customers...")

        # Create customers
        c1 = Customer(
            name="Jane Doe", 
            phone_number="8504463222",
            email="janedoe@gmail.com",
            address="112 Love Dr Atlanta, GA 33234")
        c2 = Customer(
            name="Austin Powers", 
            phone_number="8502232222",
            email="austinnn@gmail.com",
            address="999 Powers Lane Atlanta, GA 33204")
        c3 = Customer(
            name="Ashton Davis", 
            phone_number="8501234567",
            email="davisa@gmail.com",
            address="89 Cookie Lane Tallahassee, FL 33234")
        c4 = Customer(
            name="Ashley Carter", 
            phone_number="2230098877",
            email="carterashley@yahoo.com",
            address="999 Warner Way Jacksonville, FL 33344")
        db.session.add_all([c1, c2, c3, c4])
        db.session.commit()
            
        print("Creating Products...")

        # Create products
        p1 = Product(product_name="1 Gallon of Whole Milk", price=3.99)
        p2 = Product(product_name="Bread Loaf", price=1.59)
        p3 = Product(product_name="Orange Juice", price=3.00)
        p4 = Product(product_name="Tissue", price=10.99)
        p5 = Product(product_name="Toothpaste", price=1.50)
        p6 = Product(product_name="Mouthwash", price=2.99)
        db.session.add_all([p1, p2, p3, p4, p5, p6])
        db.session.commit()

        print("Placing Orders....")

        # Helper function to calculate order totals
        def order_totals(product_array):
            order_total = 0
            for product, quantity in product_array:
                order_total += product.price * quantity
            return order_total

        # Create orders
        o1 = Order(order_date=datetime.datetime(2024, 11, 20),
                   order_total=order_totals([(p1, 1), (p2, 1)]), customer_id=c1.id)
        o2 = Order(order_date=datetime.datetime(2024, 11, 15),
                   order_total=order_totals([(p1, 2), (p6, 1)]), customer_id=c3.id)
        
        # Add products to orders (but not to order_products yet)
        o1.products.append(p1)
        o1.products.append(p2)
        o2.products.append(p1)
        o2.products.append(p6)

        # Add orders to session and commit
        db.session.add(o1)
        db.session.add(o2)
        db.session.commit()

        # Insert or update the order_products table
        def insert_or_update_order_product(order_id, product_id, quantity):
            # Check if the combination of order_id and product_id already exists
            existing_item = db.session.query(order_product_table).filter_by(order_id=order_id, product_id=product_id).first()
            if existing_item:
                # If exists, update the quantity
                existing_item.quantity += quantity  # Update the quantity by adding the new quantity
            else:
                # If doesn't exist, insert a new record
                db.session.execute(
                    order_product_table.insert().values(order_id=order_id, product_id=product_id, quantity=quantity)
                )

        # Insert or update products for order 1
        insert_or_update_order_product(o1.id, p1.id, 1)
        insert_or_update_order_product(o1.id, p2.id, 1)

        # Insert or update products for order 2
        insert_or_update_order_product(o2.id, p1.id, 2)
        insert_or_update_order_product(o2.id, p6.id, 1)

        # Commit all changes
        db.session.commit()

        print("Complete!")
