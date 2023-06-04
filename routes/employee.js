var express = require('express');
var router = express.Router();
const {promisify} = require('util');
var { Pool } = require('../models/dbconnection');
// Generate massive amounts of fake contextual data.
const faker = require('@faker-js/faker');



 //table is created if table not exits
router.post("/tableCreationIfNotExists", (req, res) => {
  function parseClass() {
    
    (async() =>{
        // Check if the "employee" table exists
        Pool.query("SHOW TABLES LIKE 'employee'", (err, results) => {
            if (err) {
                console.error('Error checking "employee" table:', err);
                return;
            }

            if (results.length === 0) {
                // "employee" table does not exist, create it
                const createEmployeeTableQuery = `
            CREATE TABLE employee (
              id INT PRIMARY KEY AUTO_INCREMENT,
              name VARCHAR(255),
              age VARCHAR(20),
              gender VARCHAR(20)
            )
          `;

                Pool.query(createEmployeeTableQuery, (err) => {
                    if (err) {
                        console.error('Error creating "employee" table:', err);
                    }
                    else {
                        console.log('Created "employee" table');
                    }
                });
            }
            else {
                console.log('The "employee" table already exists');
                
            }
        });

        // Check if the "workdata" table exists
        Pool.query("SHOW TABLES LIKE 'workdata'", (err, results) => {
            if (err) {
                console.error('Error checking "workdata" table:', err);
                return;
            }

            if (results.length === 0) {
                // "workdata" table does not exist, create it
                const createWorkdataTableQuery = `
            CREATE TABLE workdata (
              id INT PRIMARY KEY AUTO_INCREMENT,
              employee_id INT,
              salary DECIMAL(10, 2),
              date_of_join DATE
            )
          `;

          //FOREIGN KEY (employee_id) REFERENCES employee(id)
                Pool.query(createWorkdataTableQuery, (err) => {
                    if (err) {
                        console.error('Error creating "workdata" table:', err);
                    }
                    else {
                        console.log('Created "workdata" table');
                    }

                });
            }
            else {
                console.log('The "workdata" table already exists');
            }
        });
    })(); 

  }
  parseClass();
})

// API to generate employee details and workdata and inserted in corresponding tables.
router.post("/generateAndStoreEmployees", (req, res) => {

  // Generate a random string of specified length
  function generateRandomString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  // Generate a random integer within a specific range
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

   // Generate a random date .
  function generateRandomDate() {
    const currentDate = new Date();
    const randomTimestamp = Math.random() * currentDate.getTime();
    const randomDate = new Date(randomTimestamp);
    return randomDate;
  }

  // Generate a random gender .
  function generateRandomGender() {
    const genders = ["Male", "Female", "Other"];
    const randomIndex = Math.floor(Math.random() * genders.length);
    const randomGender = genders[randomIndex];
    return randomGender;
  }

  // Generate and store 500 random employees
  async function generateAndStoreEmployees() {

    for (let i = 0; i < 500; i++) {

      const employee = {
        name : generateRandomString(7),
        age :getRandomInt(18, 60),
        gender : generateRandomGender(),
      };
      const insertQuery = 'INSERT INTO employee SET ?';
      Pool.query(insertQuery, employee, (err,result) => {
        if (err) {
          console.error('Error inserting employee details:', err);
        }
        const workdata = {
          employee_id :result.insertId ,
          salary :getRandomInt(10000, 30000),
          date_of_join : generateRandomDate()
        };

        const secondQuery = 'INSERT INTO workdata SET ?';
          Pool.query(secondQuery, workdata, (err) => {
            if (err) {
              console.error('Error inserting workdata details:', err);
            }
          })
      });
    }
    console.log("Data inserted successfully")
  }
  generateAndStoreEmployees();
});

//API to Delete Random Employees:
router.post("/deleteRandomEmployees", (req, res) => {
  
  function deleteRandomEmployees() {
    Pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        return;
      }
  
      const selectQuery = 'SELECT * FROM employee ORDER BY RAND() LIMIT 100';
      connection.query(selectQuery, (err, employees) => {
        if (err) {
          console.error('Error selecting random employees:', err);
          connection.release();
          return;
        }
        const deleteQuery = 'DELETE FROM employee WHERE id = ?';
        employees.forEach((employee) => {
          connection.query(deleteQuery, employee.id, (err) => {
            if (err) {
              console.error('Error deleting employee:', err);
            }
          });
        });
        console.error('Data Deleted Successfully', err);
        connection.release();
      });
    });
  }
  // Call the deleteRandomEmployees function to delete random employees
  deleteRandomEmployees();
})

//API to delete random workdata
router.post("/deleteRandomWorkdata", (req, res) => {
  function deleteRandomWorkdata() {
    Pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        return;
      }
  
      const selectQuery = 'SELECT * FROM workdata ORDER BY RAND() LIMIT 100';
      connection.query(selectQuery, (err, workdata) => {
        if (err) {
          console.error('Error selecting random workdata:', err);
          connection.release();
          return;
        }
  
        const deleteQuery = 'DELETE FROM workdata WHERE id = ?';
        workdata.forEach((data) => {
          connection.query(deleteQuery, data.id, (err) => {
            if (err) {
              console.error('Error deleting workdata:', err);
            }
          });
        });
        console.log("Workdata deleted successfully")
        connection.release();
      });
    });
  }
  
  // Call the deleteRandomWorkdata function
  deleteRandomWorkdata();
  
})

//API to list employee details without workdata
router.post("/listEmployeeDetails", (req, res) => {
  function listEmployeesWithoutWorkdata() {
    Pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        return;
      }
  
      const selectQuery = 'SELECT * FROM employee';
      connection.query(selectQuery, (err, employees) => {
        if (err) {
          console.error('Error listing employees without workdata:', err);
          connection.release();
          return;
        }
  
        console.log('Employees without workdata:');
        employees.forEach((employee) => {
          console.log(employee);
        });
  
        connection.release();
      });
    });
  }
  
  // Call the listEmployeesWithoutWorkdata function
  listEmployeesWithoutWorkdata();
  
})

//API to list workdata without employee data
router.post("/listWorkdataDetails", (req, res) => {
  function listWorkdataWithoutEmployees() {
    Pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        return;
      }
  
      const selectQuery = 'SELECT * FROM workdata';
      connection.query(selectQuery, (err, workdata) => {
        if (err) {
          console.error('Error listing workdata without employees:', err);
          connection.release();
          return;
        }
  
        console.log('Workdata without employees:');
        workdata.forEach((data) => {
          console.log(data);
        });
  
        connection.release();
      });
    });
  }
  
  // Call the listWorkdataWithoutEmployees function
  listWorkdataWithoutEmployees();
  
})

module.exports = router;