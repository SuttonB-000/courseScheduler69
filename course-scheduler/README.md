This a school project created with mongoDB and Next.JS

updates
---
0.1 -intialized the repo
0.2 - added support for the mongoDB and intitiated the project. I created the file structure with 'npx create' command, and followed up with the installation of MongoDB, and creation of:
    - ./lib/mongodb.js <-- this file contains utility helper for the mongoDB
    - ./.env.local <-- environment variables containg the connection string for the locally hosted db
    - implmeneted a test file under api named test varify function, passed
0.3
    - added navbar to layout.js
    - added 3 classes to database
    - made a container on index to dispaly the available course and changed themes for a cybpunk feel
    - full theme reset for cyberpunk feel
    - added button styling

0.4
    - added 6 users to the databse, 3 teachers and 3 students 
    - created the login page to redirect base off role of user
    - added a script to create and populate a sample mongoDB databse using the collections I have been testing with

0.5
    - added crud interface to the teacher page
    - added add/drop courses section to students

0.6
    - added sign out function to clear cookie function and gave cookies a life span

0.7
    - fixed bug in api/me, line 22 changed "users" to "school"
    - created new api route "registrations/routes.js"
    - addressed a bug in "student/page.js" to calldb items as strings, line 133
    - updated toggleCourse function in "student/page" to reflect other changes
    - found issue with the database(s). There exist two databases school and users. Moving information from users to new collection under school named users
    - hashed user passwords
    - updated ".env.local" to target specifically "school" db.  
    - added password encryption

0.8
    - adding feature to associate students with a class when clicking register