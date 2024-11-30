#!/usr/bin/env python3

import datetime
from random import randint, choice as rc
from faker import Faker
from app import app
from models import db, Customer, Product, Order, Cart, CartItem, order_product_table
from sqlalchemy import text
from werkzeug.security import generate_password_hash

if __name__ == '__main__':
    fake = Faker()

    with app.app_context():
        print("Starting seed...")
        
        # Clear the `order_products` table using raw SQL
        db.session.execute(text('DELETE FROM cart_items'))
        db.session.execute(text('DELETE FROM carts'))
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
            _password_hash="mynameisjane",
            phone_number="8504463222",
            email="janedoe@gmail.com",
            address="112 Love Dr Atlanta, GA 33234")
        
        password_hash = generate_password_hash("austin100")
        c2 = Customer(
            name="Austin Powers",
            username="austin100",
            _password_hash="mynameisaustin",
            phone_number="8502232222",
            email="austinnn@gmail.com",
            address="999 Powers Lane Atlanta, GA 33204")
        
        password_hash = generate_password_hash("davisa12")
        c3 = Customer(
            name="Ashton Davis",
            username="davisa12",
            _password_hash="mynameisashton", 
            phone_number="8501234567",
            email="davisa@gmail.com",
            address="89 Cookie Lane Tallahassee, FL 33234")
        
        password_hash = generate_password_hash("carter55")
        c4 = Customer(
            name="Ashley Carter",
            username="carter55",
            _password_hash="mynameisash", 
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

        print("Adding items to the carts...")

        # Create carts for customers and add items to the cart
        c1_cart = Cart(customer_id=c1.id)  # Create a cart for customer 1
        c2_cart = Cart(customer_id=c2.id)  # Create a cart for customer 2
        c3_cart = Cart(customer_id=c3.id)  # Create a cart for customer 3
        c4_cart = Cart(customer_id=c4.id)  # Create a cart for customer 4
        db.session.add_all([c1_cart, c2_cart, c3_cart, c4_cart])
        db.session.commit()

        # Add items to customer 1's cart
        cart_item1 = CartItem(cart_id=c1_cart.id, product_id=p1.id, quantity=2)  # 2 Whole Milk
        cart_item2 = CartItem(cart_id=c1_cart.id, product_id=p2.id, quantity=1)  # 1 Bread Loaf
        db.session.add_all([cart_item1, cart_item2])
        
        # Add items to customer 2's cart
        cart_item3 = CartItem(cart_id=c2_cart.id, product_id=p3.id, quantity=3)  # 3 Orange Juices
        cart_item4 = CartItem(cart_id=c2_cart.id, product_id=p5.id, quantity=1)  # 1 Toothpaste
        db.session.add_all([cart_item3, cart_item4])

        # Add items to customer 3's cart
        cart_item5 = CartItem(cart_id=c3_cart.id, product_id=p6.id, quantity=4)  # 4 Mouthwashes
        cart_item6 = CartItem(cart_id=c3_cart.id, product_id=p4.id, quantity=1)  # 1 Tissue
        db.session.add_all([cart_item5, cart_item6])

        # Add items to customer 4's cart
        cart_item7 = CartItem(cart_id=c4_cart.id, product_id=p1.id, quantity=1)  # 1 Whole Milk
        cart_item8 = CartItem(cart_id=c4_cart.id, product_id=p2.id, quantity=2)  # 2 Bread Loafs
        db.session.add_all([cart_item7, cart_item8])

        print("Complete!")
