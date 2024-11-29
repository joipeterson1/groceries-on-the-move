from sqlalchemy import Table, Column, Integer, ForeignKey
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
# from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates, relationship

from config import db, bcrypt

order_product_table = db.Table(
    'order_products',
    db.Column('order_id', db.Integer, db.ForeignKey('orders.id'), primary_key=True),
    db.Column('product_id', db.Integer, db.ForeignKey('products.id'), primary_key=True),
    db.UniqueConstraint('order_id', 'product_id', name='uix_order_product')
)


class Customer(db.Model, SerializerMixin):
    __tablename__ = 'customers'

    serialize_rules = ('-orders.customer', '-orders.products') 

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    _password_hash = db.Column(db.String, nullable=False)
    name = db.Column(db.String, nullable=False)
    phone_number = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False)
    address = db.Column(db.String, nullable=False)

    orders = db.relationship("Order", back_populates="customer", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "_password_hash": self._password_hash,
            "name": self.name,
            "phone_number": self.phone_number,
            "email": self.email,
            "address": self.address
            }

    @validates('username')
    def validate_username(self, key, username):
        existing_username = db.session.query(Customer).filter(Customer.username == username).first()
        if existing_username:
            raise ValueError ("Username already in use.")
        if len(username) == 0:
            raise ValueError ("Username must be a non empty string.")
        return username
    
    @hybrid_property
    def password_hash(self):
        raise AttributeError ("Password hashes may not be viewed.")
    
    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8'))

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
    
    def __repr__(self):
        return f'{self.name}, Customer ID: {self.id}'

class Product(db.Model, SerializerMixin):
    __tablename__ = 'products'

    serialize_rules = ('-orders.product',)

    id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String, nullable=False)
    price = db.Column(db.Float, nullable=False)
    product_img = db.Column(db.String, nullable=False)

    orders = db.relationship('Order', secondary=order_product_table, back_populates='products')

    def to_dict(self):
        return {
            "id": self.id,
            "product_name": self.product_name,
            "price": self.price,
            "product_img": self.product_img
            }

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

    serialize_rules = ('-customer.orders', '-products.orders') 

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



