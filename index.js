const { response } = require('express');
const express = require('express');

const { uuid , isUuid } = require('uuidv4')

const app = express();

app.use(express.json())

/* Metodos HTTP:
*
* GET: Buscar informações do back-end
* POST: Criar uma informação no back-end
* PUT/PATCH: Alterar uma informção no back-end (Put para alterar tudo e patch 
*  para poucas coisas)
* DELETE: deleta uma informação do back-end 
*
 */

/* Tipos de parâmetros:
* 
* Query Params: filtros e paginação
* Route Params: identificar recursos (Atualizar ou deletar) 
* Request Body: Conteudo na hora de criar ou editar um recurso (JSON)
*
*/

/* Middleware: 
*
* Interceptador de requisições que interrompe totalmente 
  ou alterar dados da requisição
* 
*/

const projects = []

function logRequests(request,response, next){
  const { method, url }  = request

  const logLabel = `[${method.toUpperCase()}] ${url}`

  console.log(logLabel)

  return next()
}

function validateProjectId(request, response , next){
  const { id } = request.params

  if(!isUuid(id)){
    return response.status(400).json({erro: 'invalid project ID'});
  }

  return next()
}

app.use(logRequests)

app.get('/projects',(request, response) => {

  const { title} = request.query

  const results = title
    ? projects.filter(project => project.title.includes(title))
    : projects

  return response.json(results);
});

app.post('/projects',(request,response)=>{

  const { title, owner } = request.body

  const project = { id: uuid(), title , owner };

  projects.push(project)

  return response.json(project);
});

app.put('/projects/:id',(request,response)=>{

  const { id } = request.params 

  const { title, owner } = request.body

  const projectIndex = projects.findIndex(project => project.id === id)

  if(projectIndex < 0){
    return response.status(400).json({erro: 'Project not found.'})
  }

  const project = {
    id,
    title,
    owner
  }

  projects[projectIndex] = project

  return response.json(project);

});

app.delete('/projects/:id',validateProjectId,(request,response)=>{

  const { id } = request.params

  const projectIndex = projects.findIndex(project => project.id === id)

  if(projectIndex < 0){
    return response.status(400).json({erro: 'Project not found.'})
  }

  projects.splice(projectIndex, 1)

  return response.status(204).send();

});

app.listen(3333,() =>{
  console.log('🚀 Servidor de pé em: http://localhost:3333')
  console.log('🛸 Para derrubar o servidor: crtl + c')
});

