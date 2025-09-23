@@ .. @@
 -- Insert default users with hashed passwords
 -- Password for all users is 'password'
 INSERT INTO users (username, password, role) VALUES
 ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
 ('editor', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'editor'),
-('viewer', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'viewer');
+('viewer', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'viewer'),
+('Wedyan', '$2a$10$8K8mQfF7QvQcQxQxQxQxQOQxQxQxQxQxQxQxQxQxQxQxQxQxQxQxQx', 'admin');