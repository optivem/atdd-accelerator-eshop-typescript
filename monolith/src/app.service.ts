import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHello(): string {
    return 'Hello World!';
  }

  getEcho(): string {
    return 'Echo response';
  }

  async getTodo(id: number): Promise<any> {
    const baseUrl = this.configService.get<string>(
      'TODOS_API_BASE_URL',
      'https://jsonplaceholder.typicode.com',
    );
    const response = await fetch(`${baseUrl}/todos/${id}`);
    return await response.json();
  }

  getTodosPageHtml(): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo Fetcher</title>
</head>
<body>
    <h1>Todo Fetcher</h1>
    <div>
        <label for="todoId">Todo ID:</label>
        <input type="text" id="todoId" placeholder="Enter todo ID">
        <button id="fetchTodo">Fetch Todo</button>
    </div>
    <div id="todoResult"></div>

    <script>
        document.getElementById('fetchTodo').addEventListener('click', async function() {
            const todoId = document.getElementById('todoId').value;
            const resultDiv = document.getElementById('todoResult');
            
            if (!todoId) {
                resultDiv.textContent = 'Please enter a todo ID';
                return;
            }
            
            try {
                const response = await fetch('/api/todos/' + todoId);
                const todo = await response.json();
                
                resultDiv.innerHTML = \`
                    <h3>Todo Details:</h3>
                    <p><strong>User ID:</strong> \${todo.userId}</p>
                    <p><strong>ID:</strong> \${todo.id}</p>
                    <p><strong>Title:</strong> \${todo.title}</p>
                    <p><strong>Completed:</strong> \${todo.completed}</p>
                \`;
            } catch (error) {
                resultDiv.textContent = 'Error fetching todo: ' + error.message;
            }
        });
    </script>
</body>
</html>
    `;
  }
}
