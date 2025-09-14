from extensiones import db, enum

class user(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100))
    cc = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(200))
