import psycopg
from schemas import User, UserLogin
from auth_controller import hash_password

# Funciones auxiliares
async def is_user_in_db(user_data: UserLogin):

    hashed_password = hash_password(user_data.password) 
    print(user_data.email,",", hashed_password)
    
    aconn = await psycopg.AsyncConnection.connect(
        "host=db dbname=tp2 user=fobias password=fobias")
    async with aconn:
        async with aconn.cursor() as acur:
            await acur.execute(
                "SELECT * FROM users " 
                f"WHERE email='{user_data.email}'")
            
            # devolver todos los datos que coinciden con busqueda
            user_data_in_db = await acur.fetchall() 
    aconn.close()

    return user_data_in_db


# Funciones principales
async def create_user(user_data: User):
    hashed_password = hash_password(user_data.password) # Hash antes de almacenar
    
    aconn = await psycopg.AsyncConnection.connect(
        "host=db dbname=tp2 user=fobias password=fobias")
    
    async with aconn:
        async with aconn.cursor() as acur:
            await acur.execute(
                "INSERT INTO users (username, email, phone, hashed_password, register_date) " 
                "VALUES (%s, %s, %s, %s, CURRENT_TIMESTAMP)",
                (user_data.username,
                 user_data.email,
                 user_data.phone,
                 hashed_password))
                
    aconn.close()

