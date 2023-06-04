

// Parse.Cloud.define('createTables', async (request) => {
//     const Employee = Parse.Object.extend('employee');
//     const WorkData = Parse.Object.extend('workdata');
  
//     const employeeSchema = {
//       id: { type: 'String' },
//       name: { type: 'String' },
//       gender: { type: 'String' },
//       age: { type: 'String' },
//       workData: { type: 'Pointer', targetClass: 'workdata' },
//     };
  
//     const workDataSchema = {
//       salary: { type: 'Number' },
//       joiningDate: { type: 'Date' },
//     };
  
//     try {
//       await createTableIfNotExists('employee', employeeSchema);
//       await createTableIfNotExists('workdata', workDataSchema);
  
//       return 'Tables created successfully.';
//     } catch (error) {
//       console.error('Error creating tables:', error);
//       throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Failed to create tables.');
//     }
//   });
  
//   async function createTableIfNotExists(tableName, schema) {
//     return new Promise((resolve, reject) => {
//       connection.query(`CREATE TABLE IF NOT EXISTS ${tableName} ${generateSchemaQuery(schema)}`, function (error) {
//         if (error) {
//           console.error(`Error creating table '${tableName}':`, error);
//           reject(error);
//         } else {
//           resolve();
//         }
//       });
//     });
//   }
  
//   function generateSchemaQuery(schema) {
//     const fieldDefinitions = Object.entries(schema)
//       .map(([fieldName, fieldType]) => `${fieldName} ${getFieldTypeString(fieldType)}`)
//       .join(', ');
  
//     return `(${fieldDefinitions})`;
//   }
  
//   function getFieldTypeString(fieldType) {
//     switch (fieldType.type) {
//       case 'String':
//         return 'VARCHAR(255)';
//       case 'Number':
//         return 'DOUBLE';
//       case 'Date':
//         return 'DATE';
//       case 'Pointer':
//         return `VARCHAR(255) REFERENCES ${fieldType.targetClass}(id)`;
//       default:
//         throw new Error(`Invalid field type: ${fieldType.type}`);
//     }
//   }
  
  