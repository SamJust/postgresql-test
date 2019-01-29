const { client } = global;

void async function () {
  try {
    await client.query('CREATE OR REPLACE FUNCTION find_post(a_id INT)\
      RETURNS TABLE (post_id INT, title CHAR(50), body CHAR(255), author INT, login VARCHAR) AS $$\
      BEGIN\
        RETURN QUERY SELECT posts.*, users.login FROM posts INNER JOIN users ON posts.author = users.id WHERE posts.post_id = a_id;\
      END; $$\
      LANGUAGE \'plpgsql\';\
    ');

    await client.query('CREATE OR REPLACE FUNCTION find_post()\
      RETURNS TABLE (post_id INT, title char(50), body char(255), author INT, login VARCHAR) AS $$\
      BEGIN\
        RETURN QUERY SELECT posts.*, users.login FROM posts INNER JOIN users ON posts.author = users.id;\
      END; $$\
      LANGUAGE \'plpgsql\';\
    ');

    await client.query('CREATE OR REPLACE FUNCTION create_post(a_title CHAR(50), a_body CHAR(255), a_author INT)\
      RETURNS TABLE (post_id INT, title CHAR(50), body CHAR(255), author INT, login VARCHAR) AS $$\
      DECLARE n_id INT;\
      BEGIN\
        INSERT INTO posts(title, body, author) VALUES(a_title, a_body, a_author) RETURNING posts.post_id INTO n_id;\
        RETURN QUERY SELECT * FROM find_post(n_id);\
      END; $$\
      LANGUAGE \'plpgsql\';\
    ');

    await client.query('CREATE OR REPLACE FUNCTION update_post(a_title CHAR(50), a_body CHAR(255), a_id INT)\
      RETURNS TABLE (post_id INT, title CHAR(50), body CHAR(255), author INT, login VARCHAR) AS $$\
      BEGIN\
        UPDATE posts SET title = COALESCE(a_title, posts.title), body = COALESCE(a_body, posts.body) WHERE posts.post_id = a_id;\
        RETURN QUERY SELECT * FROM find_post(a_id);\
      END; $$\
      LANGUAGE \'plpgsql\';\
    ');

    console.log('Functions created');
  } catch (error) {
    console.log('Could not create DB functions');
    console.error(error);
  }
}()

module.exports = {
  GetAllPosts: () => client.query('SELECT * FROM find_post();'),

  GetPostById: (id) => client.query(
    'SELECT * FROM find_post($1);',
    [id]
  ),

  CreatePost: ({ author, title, body }) => client.query(
    'SELECT * FROM create_post($1, $2, $3);', 
    [title, body, author]
  ),

  DeletePost: (id) => client.query(
    'DELETE FROM posts WHERE post_id = $1;',
    [id]
  ),

  UpdatePost: (id, { title, body }) => client.query(
    'SELECT * FROM update_post($1, $2, $3);',
    [title, body, id]
  )
};