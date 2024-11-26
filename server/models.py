from sqlalchemy import Table, Column, Integer, ForeignKey
from sqlalchemy_serializer import SerializerMixin
# from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates, relationship

from config import db

order_product_table = db.Table(
    'order_products',
    db.Column('order_id', db.Integer, db.ForeignKey('orders.id'), primary_key=True),
    db.Column('product_id', db.Integer, db.ForeignKey('products.id'), primary_key=True),
    # Enforce uniqueness on the combination of order_id and product_id
    db.UniqueConstraint('order_id', 'product_id', name='uix_order_product')
)


class Customer(db.Model, SerializerMixin):
    __tablename__ = 'customers'

    serialize_rules = ('-orders.customer',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    phone_number = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False)
    address = db.Column(db.String, nullable=False)

    orders = db.relationship("Order", back_populates="customer", cascade="all, delete-orphan")

    @validates('name')
    def validate_name(self, key, name):
        if len(name) == 0:
            raise ValueError("Name cannot be empty")
        return name

    @validates('email')
    def validate_email(self, key, email):
        if '@' not in email:
            raise ValueError("Email address is invalid")
        return email

    @validates('address')
    def validate_address(self, key, address):
        if len(address) == 0:
            raise ValueError("Address cannot be empty")
        return address
    
    @validates('phone_number')
    def validate_address(self, key, phone_number):
        if len(phone_number) != 10 or not phone_number.isdigit():
            raise ValueError("Phone number must be 10 digits long and only contain numbers.")
        return phone_number

class Product(db.Model, SerializerMixin):
    __tablename__ = 'products'

    serialize_rules = ('-orders.product',)

    id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String, nullable=False)
    price = db.Column(db.Float, nullable=False)
    product_img = db.Column(db.String, nullable=False)

    orders = db.relationship('Order', secondary=order_product_table, back_populates='products')

    @validates('product_name')
    def validate_product_name(self, key, product_name):
        if len(product_name) == 0:
            raise ValueError("Product name cannot be empty")
        return product_name
    
    @validates('price')
    def validate_price(self, key, price):
        if price == 0:
            raise ValueError("Price cannot equal 0")
        return price
    
    @validates('img')
    def validate_img(self, key, img):
        if len(img) == 0:
            raise ValueError("Product image cannot be empty")
        return img

class Order(db.Model, SerializerMixin):
    __tablename__ = 'orders'

    serialize_rules = ('-customer.orders', '-product.orders',)

    id = db.Column(db.Integer, primary_key=True)
    order_date = db.Column(db.DateTime, nullable=False)
    order_total = db.Column(db.Float, nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)

    customer = db.relationship('Customer', back_populates="orders")
    products = db.relationship(
        'Product',
        secondary=order_product_table,
        back_populates='orders'
    )



