const mysql = require('mysql2/promise');
const fs = require('fs');

async function executeSQL() {
  try {
    // Create connection
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '', // Your MySQL password
      database: 'pfedb'
    });

    console.log('Connected to MySQL database');

    // Read SQL script
    const sql = fs.readFileSync('add-created-at.sql', 'utf8');
    
    // Split script into individual statements
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    // Execute each statement
    for (const statement of statements) {
      console.log(`Executing: ${statement}`);
      await connection.execute(statement);
      console.log('Statement executed successfully');
    }

    // Verify the column was added
    const tables = ['admin', 'apprenant', 'enseignant'];
    
    for (const table of tables) {
      const [columns] = await connection.execute(`SHOW COLUMNS FROM ${table} LIKE 'created_at'`);
      console.log(`\n${table} has created_at column: ${columns.length > 0 ? 'Yes' : 'No'}`);
      
      if (columns.length > 0) {
        const [rows] = await connection.execute(`SELECT id, email, created_at FROM ${table} LIMIT 3`);
        console.log(`Sample data from ${table}:`);
        rows.forEach(row => {
          console.log(` - ID: ${row.id}, Email: ${row.email}, Created At: ${row.created_at}`);
        });
      }
    }

    await connection.end();
    console.log('\nSQL execution completed');
  } catch (error) {
    console.error('SQL execution failed:', error);
  }
}

executeSQL();
