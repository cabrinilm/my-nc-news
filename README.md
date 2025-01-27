# Northcoders News API

To run this project, you’ll need Node.js (v16.0.0 or higher) and PostgreSQL (v14.0.0 or higher).

Start by cloning the repository locally. In your terminal, type:
git clone https://github.com/cabrinilm/my-nc-news.git

Next, install the dependencies listed in the package.json file by running:
npm install

To connect to the databases, create two .env files in the root directory:

.env.development → Add: PGDATABASE=nc_news
.env.test → Add: PGDATABASE=nc_news_test
These files are automatically gitignored.

Once set up, initialise and seed the databases:

Run npm run setup-dbs to create the databases.
Run npm run seed to populate them with data.
You can now test the functionality with:
npm test

The test suite covers endpoints, validation, and error handling.



--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
