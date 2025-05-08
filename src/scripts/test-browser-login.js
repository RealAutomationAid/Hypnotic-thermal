<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appwrite Login Test</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 500px;
      margin: 0 auto;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
      margin-top: 0;
      color: #333;
    }
    .form-group {
      margin-bottom: 15px;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
    }
    button {
      background-color: #4CAF50;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background-color: #45a049;
    }
    #result {
      margin-top: 20px;
      padding: 10px;
      border-radius: 4px;
      display: none;
    }
    .success {
      background-color: #dff0d8;
      color: #3c763d;
    }
    .error {
      background-color: #f2dede;
      color: #a94442;
    }
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Appwrite Login Test</h1>
    <p>Testing login with hardcoded credentials for admin@admin.com / admin123.</p>
    
    <div class="form-group">
      <label for="endpoint">Endpoint:</label>
      <input type="text" id="endpoint" value="https://fra.cloud.appwrite.io/v1" readonly>
    </div>
    
    <div class="form-group">
      <label for="project">Project ID:</label>
      <input type="text" id="project" value="681bae9700045d80a790" readonly>
    </div>
    
    <div class="form-group">
      <label for="email">Email:</label>
      <input type="text" id="email" value="admin@admin.com">
    </div>
    
    <div class="form-group">
      <label for="password">Password:</label>
      <input type="password" id="password" value="admin123">
    </div>
    
    <button id="login-btn">Test Login</button>
    
    <div id="result"></div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/appwrite@11.0.0"></script>
  <script>
    document.getElementById('login-btn').addEventListener('click', async () => {
      const resultDiv = document.getElementById('result');
      resultDiv.style.display = 'block';
      resultDiv.innerHTML = 'Attempting login...';
      resultDiv.className = '';
      
      const endpoint = document.getElementById('endpoint').value;
      const project = document.getElementById('project').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      try {
        // Initialize Appwrite client
        const client = new Appwrite.Client();
        client
          .setEndpoint(endpoint)
          .setProject(project);
        
        const account = new Appwrite.Account(client);
        
        // First try to log out just in case
        try {
          await account.deleteSessions();
        } catch (e) {
          console.log('No active sessions to delete or error deleting sessions');
        }
        
        // Try to login using both methods for compatibility
        let user = null;
        try {
          console.log('Trying with createEmailSession...');
          const session = await account.createEmailSession(email, password);
          console.log('Session created:', session);
          
          user = await account.get();
          console.log('User details:', user);
        } catch (methodError) {
          console.error('Error with createEmailSession:', methodError);
          
          // Try fallback method
          try {
            console.log('Trying with createSession...');
            const session = await account.createSession(email, password);
            console.log('Session created with fallback method:', session);
            
            user = await account.get();
            console.log('User details:', user);
          } catch (fallbackError) {
            console.error('Error with fallback method:', fallbackError);
            throw fallbackError;
          }
        }
        
        // If we got here, login was successful
        resultDiv.className = 'success';
        resultDiv.innerHTML = `
          <h3>✅ Login Successful!</h3>
          <p><strong>User ID:</strong> ${user.$id}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Name:</strong> ${user.name}</p>
          <p>You can now use these credentials in your React app.</p>
        `;
      } catch (error) {
        console.error('Login error:', error);
        
        resultDiv.className = 'error';
        resultDiv.innerHTML = `
          <h3>❌ Login Failed</h3>
          <p><strong>Error:</strong> ${error.message || 'Unknown error'}</p>
          <pre>${JSON.stringify(error, null, 2)}</pre>
        `;
      }
    });
  </script>
</body>
</html> 