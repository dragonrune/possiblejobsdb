'use strict';
const util= require('util');

const Hapi=require('hapi');
const mysql=require('mysql');
// const Joi=require('joi');

// MYSQL Connection Pool
const conPool=mysql.createPool({
    connectionLimit:5,
    host: 'us-cdbr-iron-east-01.cleardb.net',
    user: 'b5873c6df23f79',
    password: 'f9eb2502',
    database: 'heroku_35a840ad36de2c5',
    debug: false
})

// Create a server with a host and port
const server=Hapi.server({
    host:'localhost',
    port:9000,
    routes: { cors:true }
});

// Add the routes
//GET route
server.route({
    method:'GET',
    path:'/jobs',
    handler: (request,h) => {

        return new Promise(function(resolve, reject) {
            conPool.getConnection(function(err,connection){
                if (err) {
                    reject(err)
                }
                connection.query(`SELECT * FROM jobs`, function(error, results, fields) {
                    connection.release();
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                })
            })
        })
    }
});

server.route({
    method:'POST',
    path:'/jobs',
    handler:function(request,h) {

        console.log("Saving new job...");
        console.log(util.inspect(request.payload, {showHidden: true, depth: null} ));
        console.log("after inspect");
        return new Promise(function(resolve, reject) {
            conPool.getConnection(function(err,connection){
                if (err) {
                    console.error(err)
                    reject(err)
                }
                const post = {fname: request.payload.fname,
                        lname: request.payload.lname,
                        wsite: request.payload.wsite,
                        email: request.payload.email,
                        phone: request.payload.phone,
                        count: request.payload.count,
                        notes: request.payload.notes};
                const query = connection.query('INSERT INTO jobs SET ?', post, 
                        function(error, results, fields) {
                            connection.release();
                            if (error) {
                                console.error(error);
                                reject(error);
                            } else {
                                resolve(results);
                            }
                        }
                    )
            })
        })
    }
});

server.route({
    method:'PUT',
    path:'/jobs/{ID}',
    handler:function(request,h) {

        let userID=request.params.ID;
        return new Promise(function(resolve, reject) {
            conPool.getConnection(function(err,connection){
                if (request.body.job !== '')
                    { err='No Job data' }
                if (err) {
                    reject(err)
                }
                const job= request.body.job;
                connection.query(`UPDATE jobs
                                  SET
                                  fname = request.body.job.fname,
                                  lname = '',
                                  wsite = '',
                                  email = '',
                                  phone = '',
                                  count = 0,
                                  notes = ''
                            
                                  WHERE id=${ID}`, function(error, results, fields) {
                    connection.release();
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                })
            })
        })
    }
});

server.route({
    method:'DELETE',
    path:'/jobs/{ID}',
    handler:function(request,h) {

        let userID=request.params.ID;
        return new Promise(function(resolve, reject) {
            conPool.getConnection(function(err,connection){
                if (err) {
                    reject(err)
                }
                connection.query(`DELETE FROM jobs WHERE id=${ID}`, function(error, results, fields) {
                    connection.release();
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                })
            })
        })
    }
});

// Start the server
async function start() {
    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
    console.log('Server running at:', server.info.uri);
};

start();
