# Task Logger App
Task Logger -dev
# Tech Stack
- Typescript
- NodeJs
- Express Js
- ReactJs
- Material-Ui
- nginx

# Setup backend - Installation
0- Locate into the current file path of docker-compose.yml in your shell.

1- Start containers

- `docker-compose up` / `docker-compose up -d`

2- Sync database schema

- `docker-compose exec backend npm run typeorm schema:sync`

3- (Optional) Run test suites (Or to test with Postman collection, check the Postman folder)

- `docker-compose exec backend npm run test`

4- (Optional) Create Fixtures

- `docker-compose exec backend npm run fixtures`
# Brief describe the assignment's solution
- CRUD System: Multiple Endpoints for Labels, Tasks and Tracking are provided
- Relationship :   
Task - ManyToMany - Label  
Task - OneToMany - Tracking  
Tracking - ManyToOne - Task    
- Add and remove labels in Task by edit a task ,   endpoint `PATCH /api/task/:taskId`
- Get all Labels of one Task :     
 endpoint `GET /api/task/:taskId`  
 or endpoint `GET /api/label/filter/:taskId` for labels of this Task  
 and endpoint `GET /api/tracking/filter/:taskId` for Trackings of this Task    
- Get all Tasks of a Label:    
 endpoint `GET /api/task/filter/:labelId`    
# Extern Api - Freestyle
Holidays API:
When select a specific Task. An additional Information about this particular Month's Holidays will be sent.
So the task can be by user for those holidays optimized.  
API : [Calendarific Holidays](https://calendarific.com/api-documentation)  
Endpoint : `GET: /api/holidays`
# Test:

This backend contains automatically test suites. To run tests : 

- `docker-compose exec backend npm run test`  

The Routes are being tested according to its functions :  
The Request's Body is generated and send the to corresponding
Endpoints. The Server will answer with the created/loaded/deleted Data. Then we check if the Responses, and the generated Data are correct. 

There is also a Postman collection as the second Test options

# Structure of Routes
#### The Backend provides following endpoints:  

Create a new Task :
- Endpoint :`POST: /api/task/`  
- Request Structure : `{"name":"test task 2" ,"description" : "task 2", "labels":[{"name":"test label"
                            }]}`   
                            
Load all existing Tasks :  
- Endpoint :`GET: /api/task/`  
- Request Structure : `{}`  

Load an existing Task :  
- Endpoint :`GET: /api/task/:taskId`  
- Request Structure : `{}`

Delete an existing Task :  
- Endpoint :`DELETE: /api/task/:taskId`  
- Request Structure : `{}`

Edit a task : 
- Endpoint : `PATCH: /api/task/:taskId`
- Request Structure : `{"name":"edited Name" ,"description" : "edited task", 
                        "labels":[{"name":"To be added Label",
                        "trackings":[{"description":"to be added Trackings}]}]}`  

Filter all the tasks by an LabelId :
- Endpoint : `GET: /api/task/filter/:labelId`
- Request Structure : `{}`

Create a Label :   
- Endpoint :`POST: /api/label/`  
- Request Structure : `{
                           "name":"new Label",
                           "tasks":[{
                               "name": "Test Task"
                           }]
                       }`

Get all labels :
- Endpoint :`GET: /api/label`  
- Request Structure : `{}`

Get all labels of a task :
- Endpoint :`GET: /api/label/filter/:taskId`  
- Request Structure : `{}`

Delete a label :
- Endpoint :`DELETE: /api/label/:labelId`  
- Request Structure : `{}`  

Edit a Label:
- Endpoint :`PATCH: /api/label/:labelId`  
- Request Structure : `{"name":"edited Label",
                        "tasks":[]}`
                        
Create a Tracking:
- Endpoint :`Post: /api/tracking`  
- Request Structure : `{"description":"new Tracking"}`

Load all trackings of a task : 
- Endpoint :`GET: /api/tracking/filter/:taskId`  
- Request Structure : `{}`

Remove a Tracking :
- Endpoint :`DELETE: /api/tracking/:trackingId`  
- Request Structure : `{}` 

Get all Trackings :
- Endpoint :`GET: /api/tracking`  
- Request Structure : `{}`  

Edit a Tracking :
- Endpoint :`PATCH: /api/tracking/:trackingId`  
- Request Structure : `{"description":"edited Description",
                        endTime : Timestamp}` 
# Issue:
The current version is working on MacOs and windows 10. But there is probably to be a Problem with database connection's right in Unbuntu.
Other Version of Linux wasn't tested yet.
                          