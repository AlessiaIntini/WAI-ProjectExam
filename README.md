[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/8AapHqUJ)
# Exam #1: "CSMall"
## Student: s309895 INTINI ALESSIA 

## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...

## API Server
-__GET__ `/api/pages/` -Get the list of all the pages
  - Response Status: `200` OK, `401` Unauthorized, `500` Internal Server Error
  - Response body:
  ```
    [
      {
          "title": "",
          "author": "",
          "creationDate": ,
          "publicationDate": 1,
          "blocks": [
            {
              "id":0
              "type":"header",
              "content":""
            },
            {
              "id":0,
              "type":"",
              "content":""
            }
          ]
      },
      {
          "title": "",
          "author": "",
          "creationDate": ,
          "publicationDate": 1,
          "blocks": [
            {
              "id":0,
              "type":"header",
              "content":
            },
            {
              "id":0,
              "type":"",
              "content":""
            }
          ]
      }
      ...
  ```
-__GET__ `/api/user/pages/` -Get the list of all the pages and there is button to do some operation
  - Prerequisite: User is logged in
  - Request Body: __None__
  - Response Status: `200` OK, `401` Unauthorized, `500` Internal Server Error
  - Response body:
  ```
    [
      {
          "title": "",
          "author": "",
          "creationDate": ,
          "publicationDate": 1,
          "blocks": [
            {
              "id":0
              "type":"header",
              "content":""
            },
            {
              "id":0,
              "type":"",
              "content":""
            }
          ]
      },
      {
          "title": "",
          "author": "",
          "creationDate": ,
          "publicationDate": 1,
          "blocks": [
            {
              "id":0,
              "type":"header",
              "content":
            },
            {
              "id":0,
              "type":"",
              "content":""
            }
          ]
      }
      ...
  ```
- __POST__ `/api/user/pages/` - Create a new page
  - Prerequisite: User is logged in
  - Request body: 
    ```
    {
      title :  String - title of page
      publicationDate: date - when page is publicated (empty because it is a draft, date is in the future because it is scheduled and date is in the past and it is already published)
      list: Block[] - List of block to be inserted into page
    }
    ```
  - Response Status: `201` Created, `401` Unauthorized, `422` Unprocessable entity (Bad body format), `503` Service Unavailable
  - Response Body: __None__

- __PUT__ `/api/user/pages/` - Edit the page of the current user, that is the author
  - Prerequisite: User is logged in
  - Request body: 
    ```
    {
      title :  String - title of page
      publicationDate: date - when page is publicated (empty because it is a draft, date is in the future because it is scheduled and date is in the past and it is already published)
      list: Block[] - List of block to be inserted into page
    }
    ```
  - Response Status: `200` OK, `401` Unauthorized, `422` Unprocessable Entity, `503` Service Unavailable
  - Response Body: __None__

- __DELETE__ `/api/user/pages/` - Delete the page of the current user, that is the author
  - Prerequisite: User is logged in
  - Request Body: __None__
  - Response Status: `204` No Content, `401` Unauthorized, `503` Service Unavailable

- __PUT__ `/api/admin/pages/` - Edit the pages of any author and the pages' author if the user is an admin
  - Prerequisite: User is logged in and he is an admin
  - Request body: 
    ```
    {
      title :  String - title of page
      publicationDate: date - when page is publicated (empty because it is a draft, date is in the future because it is scheduled and date is in the past and it is already published)
      list: Block[] - List of block to be inserted into page
    }
    ```
  - Response Status: `200` OK, `401` Unauthorized, `422` Unprocessable Entity, `503` Service Unavailable
  - Response Body: __None__

- __DELETE__ `/api/admin/pages/` - Delete the page of the current user, that is the author
  - Prerequisite: User is logged in
  - Request Body: __None__
  - Response Status: `204` No Content, `401` Unauthorized, `503` Service Unavailable

- __PUT__ `/api/admin/pages/title` - Edit the title of website
  - Prerequisite: User is logged in and he is an admin
  - Request body: 
    ```
    {
      title :  String - title of website
    }
    ```
  - Response Status: `200` OK, `401` Unauthorized, `422` Unprocessable Entity, `503` Service Unavailable
  - Response Body: __None__


## Database Tables

- Table `users` - contains xx yy zz
- Table `something` - contains ww qq ss
- ...

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- marco@polito.it, password (author of three pages)
-luigi@polito.it , password (author of no page)
-alessia@polito.it , password (she is an admin)
-paolo@polito.it, password (author of three pages)
-luca@polito.it, password (author of three pages)