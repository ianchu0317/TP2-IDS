import psycopg
from schemas import User
from auth_controller import hash_password


# Funciones principales
async def create_user(user_data: User):
    hashed_password = hash_password(user_data.password) # Hash antes de almacenar
    
    aconn = await psycopg.AsyncConnection.connect(
        "dbname=tp2 user=fobias password=fobias")
    
    with await aconn:
        async with aconn.cursor() as acur:
            await acur.execute(
                "INSERT INTO users (username, email, phone, hashed_password, register_date) " 
                "VALUES (%s, %s, %s, %s, CURRENT_TIMESTAMP)",
                (user_data.username,
                 user_data.email,
                 user_data.phone,
                 hashed_password))
                
    aconn.close()

