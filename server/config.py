
from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
import secrets
import os


app = Flask(__name__)
app.config['SECRET_KEY'] = '77e5b596baea531cbd5907c232ab724bbd5aef5b4b0da7792c5899b5ceca4a1f2b735f3c78bedeb83e5ea39e7aa5ce4a23ba3b3bf07091ed8b9df9c5612b59da'
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_COOKIE_NAME'] = 'session'
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SECURE'] = False 
app.config['SESSION_PERMANENT'] = True  

app.json.compact = False


metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)


api = Api(app)


CORS(app, origins="http://localhost:3000", supports_credentials=True, methods=["GET", "POST", "PATCH", "DELETE"])

bcrypt = Bcrypt(app)