import os
from sqlalchemy import Column, Integer, String, Float, DateTime
from app.extensions import db


class Expense(db.Model):
    __tablename__ = "expense"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    value = Column(Float, nullable=False)
    date = Column(DateTime, nullable=False)
    category = Column(String(45), nullable=False)
    description = Column(String(128), nullable=False)
    observation = Column(String(550), nullable=False)