const { client } = global;

module.exports = async function () {
  // await client.query('DROP FUNCTION update_post;'); // just for development since I mess a lot with types;
  // await client.query('DROP FUNCTION find_post();');
  // await client.query('DROP FUNCTION find_post(id INT);');


  console.log('starting creating functions');

  await client.query('CREATE OR REPLACE FUNCTION find_post(a_id INT)\
    RETURNS TABLE (post_id INT, title char(50), body char(255), author INT, login VARCHAR) AS $$\
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

  console.log('created find')

  // await client.query('CREATE OR REPLACE FUNCTION update_post(a_title CHAR(50), a_body CHAR(255), a_author INT)\
  //   RETURNS TABLE (post_id INT, title char(50), body char(255), author INT, author) AS $$\
  //   BEGIN\
  //     RETURN QUERY INSERT INTO posts(author, title, body) VALUES(a_author, a_title, a_body) RETURNING *;\
  //   END; $$\
  //   LANGUAGE \'plpgsql\';\
  // ');

  console.log('Done creating functions');
}