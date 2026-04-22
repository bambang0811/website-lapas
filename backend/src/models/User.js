export const UserSchema = {
  id: 'INT PRIMARY KEY AUTO_INCREMENT',
  username: 'VARCHAR(100) UNIQUE NOT NULL',
  password: 'VARCHAR(255) NOT NULL',
  role: "VARCHAR(50) DEFAULT 'admin'",
  created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
};
