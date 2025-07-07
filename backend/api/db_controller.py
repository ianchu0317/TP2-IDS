import psycopg
from schemas import User, UserLogin, UserInDB
from schemas import Phobia, PhobiaInDB
from schemas import Comment, CommentInDB
from auth_controller import hash_password


# Funciones auxiliares



# Funciones principales
# Funciones de usuarios
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

# Funciones de fobias
async def create_phobia(phobia_data: Phobia, user_id: int):
    aconn = await psycopg.AsyncConnection.connect(
        "host=db dbname=tp2 user=fobias password=fobias")
    
    async with aconn:
        async with aconn.cursor() as acur:
            await acur.execute(
                "INSERT INTO phobias (phobia_name, description, creator_id, likes, date) " 
                "VALUES (%s, %s, %s, %s, CURRENT_TIMESTAMP)",
                (phobia_data.phobia_name,
                 phobia_data.description,
                 user_id,
                 0))
                
    aconn.close()
    
    # id y date se generan en db automaticamente
    return PhobiaInDB(
        id=None,  
        phobia_name=phobia_data.phobia_name,
        description=phobia_data.description,
        creator_id=user_id,
        likes=0,
        date=None
    )  
    

async def get_phobias():
    aconn = await psycopg.AsyncConnection.connect(
        "host=db dbname=tp2 user=fobias password=fobias")
    phobias = []
    async with aconn:
        async with aconn.cursor() as acur:
            await acur.execute(
                "SELECT * FROM phobias")
            
            # devolver todos los datos que coinciden con busqueda
            phobias_db_data = await acur.fetchall() 
            
            for phobia in phobias_db_data:
                phobias.append(PhobiaInDB(
                    id=phobia[0],
                    phobia_name=phobia[1],
                    description=phobia[2],
                    creator_id=phobia[3],
                    likes=phobia[4],
                    date=phobia[5]
                ))
    aconn.close()
    return phobias

# Get phobia por su id en db
async def get_phobia(phobia_id: int) -> PhobiaInDB | None:
    aconn = await psycopg.AsyncConnection.connect(
        "host=db dbname=tp2 user=fobias password=fobias")
    
    async with aconn:
        async with aconn.cursor() as acur:
            await acur.execute(
                "SELECT * FROM phobias " 
                f"WHERE id={phobia_id}")
            
            phobia_db_data = await acur.fetchone() 
    aconn.close()

    if not phobia_db_data:
        return None
    
    return PhobiaInDB(
        id=phobia_db_data[0],
        phobia_name=phobia_db_data[1],
        description=phobia_db_data[2],
        creator_id=phobia_db_data[3],
        likes=phobia_db_data[4],
        date=phobia_db_data[5]
    )

async def update_phobia(phobia_id: int, phobia_data: Phobia):
    aconn = await psycopg.AsyncConnection.connect(
        "host=db dbname=tp2 user=fobias password=fobias")
    
    async with aconn:
        async with aconn.cursor() as acur:
            await acur.execute(
                "UPDATE phobias SET phobia_name=%s, description=%s " 
                f"WHERE id={phobia_id}",
                (phobia_data.phobia_name,
                 phobia_data.description))

    aconn.close()
    

async def delete_phobia(phobia_id: int):
    aconn = await psycopg.AsyncConnection.connect(
        "host=db dbname=tp2 user=fobias password=fobias")
    
    async with aconn:
        async with aconn.cursor() as acur:
            await acur.execute(
                "DELETE FROM phobias " 
                f"WHERE id={phobia_id}",)

    aconn.close()


# CRUD Comentarios
async def create_comment(comment_data: Comment, user_id: int, phobia_id: int):
    aconn = await psycopg.AsyncConnection.connect(
        "host=db dbname=tp2 user=fobias password=fobias")
    async with aconn:
        async with aconn.cursor() as acur:
            await acur.execute(
                "INSERT INTO comments (comment, creator_id, phobia_id, likes, date) " 
                "VALUES (%s, %s, %s, %s, CURRENT_TIMESTAMP)",
                (comment_data.comment,
                 user_id,
                 phobia_id,
                 0))
    aconn.close()
    return CommentInDB(
        id=None,
        comment=comment_data.comment,
        creator_id=user_id,
        phobia_id=phobia_id,
        likes=0,
        date=None
    )

async def get_comments(phobia_id: int):
    aconn = await psycopg.AsyncConnection.connect(
        "host=db dbname=tp2 user=fobias password=fobias")
    comments = []
    async with aconn:
        async with aconn.cursor() as acur:
            await acur.execute(
                "SELECT * FROM comments " 
                f"WHERE phobia_id={phobia_id}")
            
            comments_db_data = await acur.fetchall() 
            
            for comment in comments_db_data:
                comments.append(CommentInDB(
                    id=comment[0],
                    comment=comment[1],
                    creator_id=comment[2],
                    phobia_id=comment[3],
                    likes=comment[4],
                    date=comment[5]
                ))
    aconn.close()
    return comments