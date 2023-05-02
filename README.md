## Prerequisites
- Git installed on your machine
- Node.js installed on your machine
- a PostgreSQL database server running

## Getting Started
1. Clone repository: `git clone https://github.com/alex5272372/aya-test.git`
2. Change directory: `cd aya-test`
3. Install dependencies: `npm install`
4. Create database: `psql` `CREATE DATABASE mydb;`
5. Create environment file: `copy .env.sample .env`
6. Change environment variable: `DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"`
7. Create and fill tables: `npx prisma migrate reset -f`
8. Build application: `npm run build`
9. Start application: `npm start`
10. Open application: http://localhost:3000

## Development
To change file versions, change the file `./helpers/versions.json`
Reformatted file example `./prisma/data/v1_1_example.txt`

## User guide
To return to the home page, click the logo.

## Task and questions
The system should read files from a folder, parse them, and update a database upon startup. A parser needs to be developed, and a database with relational connections needs to be designed. Additionally, multiple HTTP APIs need to be provided to return query results.

File format:
The file is a simple text format representing objects with properties and other nested objects. The hierarchy is determined by indentation (each level has 2 spaces). The type of each object is named with a capital letter, while properties are named with lowercase letters. The file represents a list of employees (Employee), each with basic properties (name, surname, ID). Each employee also belongs to a department (Department) and has a list of statements (Statement) for the year. The salary is determined by date and amount (always in $). Additionally, each employee may have records of charitable donations (Donation), where the donation amount may be in any currency. The file also contains exchange rates (Rate) for all date-currency pairs that were encountered in donations. In the database, it is sufficient to store the equivalent of donations in USD.

Queries:
- Find employees who donated more than 10% of their average monthly salary for the last 6 months to charity and sort them by their minimum average annual salary.
- Display departments in descending order of the difference between the maximum and minimum average annual salary. For each department, show up to 3 employees with the highest percentage increase in salary for the year and the size of their last salary.
- Count the number of employees who donated more than $100 to charity. As a one-time reward, each employee will receive an equivalent amount of their contribution from a pool of $10,000. (If an employee donated $200 out of a total donation of $1000, they should receive 20% of $10,000.) Donations of less than $100 are included in the total donation pool but do not entitle the employees to a reward. Additionally, add $100 to each employee in the department with the highest total donations per person.

1. How to modify the code to support different file versions?
To support different file versions, you can introduce a version field in the file format and add version-specific logic in the parser to handle the different formats.

2. How would the import system change if exchange rate data is removed from the file, and it needs to be obtained asynchronously (via API)?
If exchange rate data is removed from the file and needs to be obtained asynchronously, the parser can make an API call to retrieve the exchange rate data and store it in the database along with the other data.

3. In the future, if the client wants to import files via a web interface, how would the system need to be changed?
To allow file import via a web interface, the system needs to have a file upload feature and an interface for the user to select the file and initiate the import process. Additionally, the system should provide feedback to the user on the import process status and any errors that occur.

4. How would the queries change if imported data could be considered only for the previous month/year?
If imported data can only be considered for the previous month/year, the queries need to be modified to filter the data based on the relevant time period before performing the calculations. For example, in the first query, the average monthly salary should be calculated only for the previous 6 months.

## Learn more about Next.js
To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

### Deploy on Vercel
The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
