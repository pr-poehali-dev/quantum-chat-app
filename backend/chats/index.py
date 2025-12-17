import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Чаты: Получение, создание, удаление чатов
    Args: GET - получить чаты юзера, POST - создать, DELETE - удалить
    Returns: Список чатов или результат операции
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers_dict = event.get('headers', {})
    user_id = headers_dict.get('x-user-id') or headers_dict.get('X-User-Id')
    
    if not user_id:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Unauthorized'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    if method == 'GET':
        cur.execute('''
            SELECT c.id, c.name, c.avatar_url, c.chat_type, c.created_at,
                   (SELECT text FROM messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
                   (SELECT created_at FROM messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_time
            FROM chats c
            JOIN chat_members cm ON c.id = cm.chat_id
            WHERE cm.user_id = %s
            ORDER BY last_message_time DESC NULLS LAST
        ''', (user_id,))
        
        chats = [dict(row) for row in cur.fetchall()]
        
        for chat in chats:
            if chat['created_at']:
                chat['created_at'] = chat['created_at'].isoformat()
            if chat['last_message_time']:
                chat['last_message_time'] = chat['last_message_time'].isoformat()
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(chats),
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        body = json.loads(event.get('body', '{}'))
        name = body.get('name', '')
        chat_type = body.get('chat_type', 'group')
        avatar_url = body.get('avatar_url', '')
        member_ids = body.get('member_ids', [])
        
        cur.execute('''
            INSERT INTO chats (name, avatar_url, chat_type)
            VALUES (%s, %s, %s)
            RETURNING id, name, avatar_url, chat_type, created_at
        ''', (name, avatar_url, chat_type))
        
        chat = dict(cur.fetchone())
        chat_id = chat['id']
        
        all_members = [int(user_id)] + [int(mid) for mid in member_ids if mid]
        for member_id in all_members:
            cur.execute('''
                INSERT INTO chat_members (chat_id, user_id, role)
                VALUES (%s, %s, %s)
                ON CONFLICT (chat_id, user_id) DO NOTHING
            ''', (chat_id, member_id, 'admin' if member_id == int(user_id) else 'member'))
        
        conn.commit()
        cur.close()
        conn.close()
        
        chat['created_at'] = chat['created_at'].isoformat() if chat.get('created_at') else None
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(chat),
            'isBase64Encoded': False
        }
    
    if method == 'DELETE':
        query_params = event.get('queryStringParameters') or {}
        chat_id = query_params.get('chat_id')
        
        if not chat_id:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Missing chat_id'}),
                'isBase64Encoded': False
            }
        
        cur.execute('UPDATE chats SET updated_at = CURRENT_TIMESTAMP WHERE id = %s', (chat_id,))
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True}),
            'isBase64Encoded': False
        }
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }