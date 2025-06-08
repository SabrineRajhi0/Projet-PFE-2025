const mysql = require('mysql2/promise');

async function checkDatabase() {
  try {
    // Create connection
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '', // Your MySQL password
      database: 'pfedb'
    });

    console.log('Connected to MySQL database');

    // Query to check User table structure
    const [tables] = await connection.execute("SHOW TABLES");
    console.log('Tables in database:');
    tables.forEach(table => {
      console.log(` - ${Object.values(table)[0]}`);
    });

    // Find all tables that might contain user data (with table per class inheritance)
    const userTables = tables
      .map(table => Object.values(table)[0])
      .filter(tableName => 
        tableName.toLowerCase() === 'user' || 
        tableName.toLowerCase() === 'admin' || 
        tableName.toLowerCase() === 'apprenant' || 
        tableName.toLowerCase() === 'enseignant'
      );

    console.log('\nUser-related tables:', userTables);

    // Check columns for each user table
    for (const tableName of userTables) {
      const [columns] = await connection.execute(`SHOW COLUMNS FROM ${tableName}`);
      
      console.log(`\nColumns in ${tableName} table:`);
      columns.forEach(column => {
        console.log(` - ${column.Field}: ${column.Type} ${column.Null === 'YES' ? '(nullable)' : '(not null)'} ${column.Default ? `default: ${column.Default}` : ''}`);
      });

      // Check if created_at column exists
      const hasCreatedAt = columns.some(column => column.Field.toLowerCase() === 'created_at');
      
      if (hasCreatedAt) {
        // Query some sample data with created_at
        const [rows] = await connection.execute(`SELECT id, email, created_at FROM ${tableName} LIMIT 5`);
        console.log(`\nSample data from ${tableName} (with created_at):`);
        rows.forEach(row => {
          console.log(` - ID: ${row.id}, Email: ${row.email}, Created At: ${row.created_at}`);
        });
      }
    }

    await connection.end();
    console.log('\nDatabase check completed');
  } catch (error) {
    console.error('Database check failed:', error);
  }
}

checkDatabase();
