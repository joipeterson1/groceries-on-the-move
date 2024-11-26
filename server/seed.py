#!/usr/bin/env python3

import datetime
from random import randint, choice as rc
from faker import Faker
from app import app
from models import db, Customer, Product, Order, order_product_table
from sqlalchemy import text

if __name__ == '__main__':
    fake = Faker()

    with app.app_context():
        print("Starting seed...")
        
        # Clear the `order_products` table using raw SQL
        db.session.execute(text('DELETE FROM order_products'))
        db.session.commit()

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

        # Add products to orders
        o1.products.append(p1)
        o1.products.append(p2)
        o2.products.append(p1)
        o2.products.append(p6)

        # Add orders to session
        db.session.add(o1)
        db.session.add(o2)

        db.session.commit()

        print("Complete!")
