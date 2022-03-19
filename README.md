# iNoteBook
your notes on the cloud
## Features
* CRUD operations
* Notes gets saved on MongoDB database
* User signup/login functionality
* Secure authentication so that user cannot access other's notes
* Every field validation
* E-mail validation
* Password min length 12 so that user can generate strong password

## Live Preview
#### [inotebook-backend](https://notesoncloud.herokuapp.com/)

## API Reference
### To check if API is responding
```http
GET /
```

OUTPUT
```bash
API is sending response
```
Everything works fine

### Authentication functionality

#### Create new user

```http
  POST /api/auth/createuser
```
Adds a new user to the database

#### Login user

```http
  POST /api/auth/Login
```
Logins the user and adds the jwt token to localStorage 
#### Fetch user details excluding password

```http
  POST /api/auth/fetchuser
```
Fetches the user details like `User id`, `Name`, `E-mail`, `SignUp Date`
### Notes functionality

#### Add a new note

```http
  POST /api/notes/addnote
```

Adds a new note to the database and check if the same title is not being used again, if used again then fails to add that note
#### Fetch all user notes

```http
  GET /api/notes/fetchallnotes
```

Fetches all notes of the logged in user
#### Update a specific user note

```http
  PUT /api/notees/updatenote/${id}
```

| Parameter | Type     | Description                            |
| :-------- | :------- | :------------------------------------- |
| `id`      | `string` | **Required**. Id of the note to update |

#### Delete a specific user note

```http
  DELETE /api/notes/deletenote/${id}
```

| Parameter | Type     | Description                            |
| :-------- | :------- | :------------------------------------- |
| `id`      | `string` | **Required**. Id of the note to Delete |
