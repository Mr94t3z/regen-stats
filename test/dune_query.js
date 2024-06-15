import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const apiKey = process.env.DUNE_API_KEY;
const queryId = process.env.DUNE_QUERY_ALLOWANCE_ID;
const fid = 397668;

//schedule the query on a 6 hour interval, and then fetch by filtering for the user fid within the query results
//dune query where each row is a unique fid and each column is a recommended set of users: https://dune.com/queries/3509966
const meta = {
    "x-dune-api-key": apiKey
};
const header = new Headers(meta);

const latest_response = await fetch(`https://api.dune.com/api/v1/query/${queryId}/results?&filters=fid=${fid}` //filter for single fid
, {
    method: 'GET',
    headers: header,
});

const body = await latest_response.text();
const responseJson = JSON.parse(body);

if (responseJson.result && responseJson.result.rows.length > 0) {
    const recs = responseJson.result.rows[0]; // Assuming there's only one row as per your initial example
    
    // Log individual properties of recs
    console.log("allowance:", recs.allowance);
    console.log("display_name:", recs.display_name);
    console.log("fid:", recs.fid);
    console.log("fname:", recs.fname);
    
} else {
    console.log("No rows found in the response.");
}