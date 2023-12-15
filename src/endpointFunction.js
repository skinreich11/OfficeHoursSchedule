var URL = "http://127.0.0.1:5000";
//both function fetch2/fetch3 are the same now after testing, uses the defined URL+url to call the correct
//endpoint in the server with the different method 'GET'/'POST'/'PATCH'/'DELETE'
//json is the body of the request, uses the build in JS fetch API
//headers are for defining the format the json data is in as well as headers for CORS policy
//credentials is for session data for user login and registration
export function fetch2(url, method, json)
{
    return fetch(URL + url,
    {method: method,
    headers: {'Content-Type': 'application/json;charset=utf-8', 'Access-Control-Allow-Origin': "http://localhost:3000",
    'Access-Control-Allow-Credentials': "true", "Access-Control-Allow-Headers": "*", "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE"},
    body: JSON.stringify(json)
    ,credentials: "include"
    });
}
export function fetch3(url, method, json)
{
    return fetch(URL + url,
    {method: method,
    headers: {'Content-Type': 'application/json;charset=utf-8', 'Access-Control-Allow-Origin': "http://localhost:3000",
    'Access-Control-Allow-Credentials': "true", "Access-Control-Allow-Headers": "*", "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE"},
    body: JSON.stringify(json)
    ,credentials: "include"
    });
}