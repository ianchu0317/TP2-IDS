import psycopg
from schemas import User, UserLogin, UserInDB
from auth_controller import hash_password

# Funciones auxiliares



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


async def get_user(user_data: UserLogin):

    
    aconn = await psycopg.AsyncConnection.connect(
        "host=db dbname=tp2 user=fobias password=fobias")
    
    async with aconn:
        async with aconn.cursor() as acur:
            await acur.execute(
                "SELECT * FROM users " 
                f"WHERE email='{user_data.email}'")
            
            # devolver todos los datos que coinciden con busqueda
            user_db_data = await acur.fetchone() 
    aconn.close()

    return UserInDB(
        id=user_db_data[0],
        username=user_db_data[1],
        email=user_db_data[2],
        phone=user_db_data[3],
        hashed_password=user_db_data[4],
        date=user_db_data[5]
    )
