import datetime
import psycopg
from schemas import User, UserLogin, UserInDB, UserInfo
from schemas import Phobia, PhobiaInDB, PhobiaOUT
from schemas import Comment, CommentInDB, CommentOUT
from auth_controller import hash_password
from os import getenv


# Informacion de la conexion a la base de datos
# obtener desde variables de entorno
db_conn_info = f"""host={getenv('DB_HOST')}
                dbname={getenv('DB_NAME')} 
                user={getenv('DB_USER')} 
                password={getenv('DB_PASSWORD')}"""


# **** Funciones de usuarios ****
# Crear usuario en db
async def create_user(user_data: User) -> UserInfo:
    hashed_password = hash_password(user_data.password) # Hash antes de almacenar
    
    aconn = await psycopg.AsyncConnection.connect(db_conn_info)
    async with aconn:
        async with aconn.cursor() as acur:
            await acur.execute(
                "INSERT INTO users (username, email, phone, hashed_password, register_date) " 
                "VALUES (%s, %s, %s, %s, CURRENT_TIMESTAMP)",
                (user_data.username,
                 user_data.email,
                 user_data.phone,
                 hashed_password))
    await aconn.close()
    return UserInfo(
        username=user_data.username,
        email=user_data.email,
        phone=user_data.phone,
        date=datetime.date.today()
    )


# Obtener datos de usuario por login
async def get_user(user_data: UserLogin):
    aconn = await psycopg.AsyncConnection.connect(db_conn_info)
    async with aconn:
        async with aconn.cursor() as acur:
            await acur.execute(
                "SELECT * FROM users " 
                "WHERE email=%s",
                (user_data.email,))
            # devolver datos del usuario encontrado
            user_db_data = await acur.fetchone() 
    await aconn.close()
    
    return UserInDB(
        id=user_db_data[0],
        username=user_db_data[1],
        email=user_db_data[2],
        phone=user_db_data[3],
        hashed_password=user_db_data[4],
        date=user_db_data[5]
    )


# Obtener información registrada del usuario
async def get_user_info(user_id: int) -> UserInDB:
    aconn = await psycopg.AsyncConnection.connect(db_conn_info)
    async with aconn:
        async with aconn.cursor() as acur:
            await acur.execute(
                "SELECT username, email, phone, register_date FROM users " 
                "WHERE id=%s",
                (str(user_id),))
            user_db_data = await acur.fetchone() 
    await aconn.close()
    return UserInfo(
        username=user_db_data[0],
        email=user_db_data[1],
        phone=user_db_data[2],
        date=user_db_data[3]
    )



#  **** Funciones de fobias ****
# Crear fobia en DB
async def create_phobia(phobia_data: Phobia, user_id: int) -> PhobiaInDB:
    aconn = await psycopg.AsyncConnection.connect(db_conn_info)
    async with aconn:
        async with aconn.cursor() as acur:
            await acur.execute(
                "INSERT INTO phobias (phobia_name, description, creator_id, likes, date) " 
                "VALUES (%s, %s, %s, %s, CURRENT_TIMESTAMP)",
                (phobia_data.phobia_name,
                 phobia_data.description,
                 user_id,
                 0))
    await aconn.close()
    # id y date se generan en db automaticamente
    return PhobiaInDB(
        id=None,  
        phobia_name=phobia_data.phobia_name,
        description=phobia_data.description,
        creator_id=user_id,
        likes=0,
        date=None
    )  
    

# Obtener todas las fobias de DB
async def get_phobias():
    aconn = await psycopg.AsyncConnection.connect(db_conn_info)
    phobias = []
    async with aconn:
        async with aconn.cursor() as acur:
            await acur.execute(
                "SELECT p.id, p.phobia_name, p.description, u.username, p.likes, " 
                "(SELECT COUNT(*) FROM comments c WHERE c.phobia_id=p.id) AS comments, " 
                "p.date FROM phobias p " 
                "JOIN users u ON p.creator_id=u.id ")
            # devolver todos los datos que coinciden con busqueda
            phobias_db_data = await acur.fetchall() 
            # Limpieza de datos
            for phobia in phobias_db_data:
                phobias.append(PhobiaOUT(
                    id=phobia[0],
                    phobia_name=phobia[1],
                    description=phobia[2],
                    creator=phobia[3],
                    likes=phobia[4],
                    comments=phobia[5],
                    date=phobia[6]
                ))
    await aconn.close()
    return phobias


# Get phobia por su id en db
async def get_phobia(phobia_id: int) -> PhobiaOUT | None:
    aconn = await psycopg.AsyncConnection.connect(db_conn_info)
    async with aconn:
        async with aconn.cursor() as acur:
            await acur.execute(
                "SELECT p.id, p.phobia_name, p.description, u.username, p.likes, " 
                "(SELECT COUNT(*) FROM comments c WHERE c.phobia_id=p.id) AS comments, " 
                "p.date FROM phobias p " 
                "JOIN users u ON p.creator_id=u.id " 
                "WHERE p.id=%s",
                (str(phobia_id),))
            phobia_db_data = await acur.fetchone() 
    await aconn.close()

    if not phobia_db_data:
        return None    
    
    return PhobiaOUT(
        id=phobia_db_data[0],
        phobia_name=phobia_db_data[1],
        description=phobia_db_data[2],
        creator=phobia_db_data[3],
        likes=phobia_db_data[4],
        comments=phobia_db_data[5],
        date=phobia_db_data[6]
    )

# Obtener User ID de una fobia
async def get_user_id_from_phobia(phobia_id: int) -> int | None:
    aconn = await psycopg.AsyncConnection.connect(db_conn_info)
    async with aconn:
        async with aconn.cursor() as acur:
            await acur.execute(
                "SELECT creator_id FROM phobias " 
                "WHERE id=%s",
                (str(phobia_id),))
            creator_id = await acur.fetchone() 
    await aconn.close()
    return creator_id

# Actualizar fobia (título, descripción)
async def update_phobia(phobia_id: int, phobia_data: Phobia) -> PhobiaInDB:
    aconn = await psycopg.AsyncConnection.connect(db_conn_info)
    async with aconn:
        async with aconn.cursor() as acur:
            await acur.execute(
                "UPDATE phobias SET phobia_name=%s, description=%s " 
                "WHERE id=%s",
                (phobia_data.phobia_name,
                 phobia_data.description,
                 str(phobia_id),))
    await aconn.close()
    

# Eliminar una fobia
async def delete_phobia(phobia_id: int):
    aconn = await psycopg.AsyncConnection.connect(db_conn_info)
    async with aconn:
        async with aconn.cursor() as acur:
            # eliminar post de fobia
            await acur.execute(
                "DELETE FROM phobias " 
                "WHERE id=%s",
                (str(phobia_id),))
            # eliminar comentarios del post
            await acur.execute(
                "DELETE FROM comments "
                "WHERE phobia_id=%s",
                (str(phobia_id),))
    await aconn.close()



#  **** CRUD Comentarios**** 
# Crear comentario en una fobia
async def create_comment(comment_data: Comment, user_id: int, phobia_id: int):
    aconn = await psycopg.AsyncConnection.connect(db_conn_info)
    async with aconn:
        async with aconn.cursor() as acur:
            await acur.execute(
                "INSERT INTO comments (comment, creator_id, phobia_id, date) " 
                "VALUES (%s, %s, %s, CURRENT_TIMESTAMP)",
                (comment_data.comment,
                 user_id,
                 phobia_id,))
    await aconn.close()
    return CommentInDB(
        id=None,
        comment=comment_data.comment,
        creator_id=user_id,
        phobia_id=phobia_id,
        date=None
    )


# Obtener lista de comentarios de una fobia
async def get_comments(phobia_id: int):
    aconn = await psycopg.AsyncConnection.connect(db_conn_info)
    comments = []
    async with aconn:
        async with aconn.cursor() as acur:
            await acur.execute(
                "SELECT c.comment, u.username, c.date " 
                "FROM comments c "
                "JOIN users u ON c.creator_id = u.id "
                "WHERE c.phobia_id=%s",
                (str(phobia_id),))
            comments_db_data = await acur.fetchall() 
            for comment in comments_db_data:
                comments.append(CommentOUT(
                    comment=comment[0],
                    creator=comment[1],
                    date=comment[2]
                ))
    await aconn.close()
    return comments



# **** Rankings ****
# Dar actualizar like de fobia
async def like_phobia(phobia_id: int):
    aconn = await psycopg.AsyncConnection.connect(db_conn_info)
    async with aconn:
        async with aconn.cursor() as acur:
            await acur.execute(
                "UPDATE phobias SET likes=likes+1 WHERE id=%s",
                (str(phobia_id),))    
    await aconn.close()


# Obtener lista de fobias ordenadas descendente por laiks
async def get_rankings():
    aconn = await psycopg.AsyncConnection.connect(db_conn_info)
    phobias_ranked = []
    async with aconn:
        async with aconn.cursor() as acur:
            await acur.execute(
                "SELECT p.id, p.phobia_name, p.description, u.username, p.likes, " 
                "(SELECT COUNT(*) FROM comments c WHERE c.phobia_id=p.id) AS comments, " 
                "p.date FROM phobias p " 
                "JOIN users u ON p.creator_id=u.id "
                "ORDER BY p.likes DESC LIMIT 5")

            phobias_db_data = await acur.fetchall() 
            
            for phobia in phobias_db_data:
                phobias_ranked.append(PhobiaOUT(
                    id=phobia[0],
                    phobia_name=phobia[1],
                    description=phobia[2],
                    creator=phobia[3],
                    likes=phobia[4],
                    comments=phobia[5],
                    date=phobia[6]
                ))
    await aconn.close()
    return phobias_ranked
