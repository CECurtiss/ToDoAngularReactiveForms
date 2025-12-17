from flask import Flask, jsonify, request
from flask_cors import CORS
from markupsafe import escape
import sqlite3

app = Flask(__name__)
CORS(app)

DB_PATH = 'database.db'

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            priority TEXT NOT NULL,
            task TEXT NOT NULL,
            dueDate TEXT NOT NULL,
            completed INTEGER DEFAULT 0,
            dateCompleted TEXT
        )
    ''')
    conn.commit()
    conn.close()
    
init_db()

@app.route('/items', methods=['GET'])
def get_items():
    conn = get_db_connection()
    items = conn.execute('SELECT * FROM items').fetchall()
    conn.close()
    items_list = [dict(item) for item in items]
    return jsonify(items_list), 200

@app.route('/items', methods=['POST'])
def add_item():
    data = request.json
    conn= get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO items (completed, dateCompleted, dueDate, priority, task)
        VALUES (?, ?, ?, ?, ?)
    ''', (
        int(data.get('completed', 0)),
        escape(data.get('dateCompleted', None)),
        escape(data['dueDate']),
        escape(data['priority']),
        escape(data['task'])
    ))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return jsonify({'id': new_id, **data}), 201

@app.route('/items/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    print(item_id)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM items WHERE id = ?', (item_id,))
    conn.commit()
    conn.close()
    if item_id is None:
        return jsonify({'error': 'Item not found'}), 404
    return jsonify({'message': f'Item with id {item_id} deleted.'}), 200

@app.route('/items/<int:item_id>', methods=['GET'])
def get_item(item_id):
    conn = get_db_connection()
    item = conn.execute('SELECT * FROM items WHERE id = ?', (item_id,)).fetchone()
    conn.close()
    if item is None:
        return jsonify({'error': 'Item not found'}), 404
    return jsonify(dict(item)),200

@app.route('/items/<int:item_id>', methods=['PUT'])
def update_item(item_id):
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE items
        SET completed = ?, dateCompleted = ?, dueDate = ?, priority = ?, task = ?
        WHERE id = ?
    ''', (
        int(data.get('completed', 0)),
        escape(data.get('dateCompleted', None)),
        escape(data['dueDate']),
        escape(data['priority']),
        escape(data['task']),
        item_id
    ))
    conn.commit()
    conn.close()
    if item_id is None:
        return jsonify({'error': 'Item not found'}), 404
    return jsonify({'id': item_id, **data}), 200

@app.route('/items/<int:item_id>/updateCompleted', methods=['PUT'])
def update_completed(item_id):
    completed_value = 1 if request.json.get('completed', False) else 0
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE items
        SET completed = ?, dateCompleted = ?, dueDate = ?, priority = ?, task = ?
        WHERE id = ?
    ''', (
        completed_value,
        escape(data.get('dateCompleted', None)),
        escape(data['dueDate']),
        escape(data['priority']),
        escape(data['task']),
        item_id
    ))
    conn.commit()
    conn.close()
    if item_id is None:
        return jsonify({'error': 'Item not found'}), 404
    return jsonify({'id': item_id, **data}), 200