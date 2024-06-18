import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const apiKey = process.env.DUNE_API_KEY;
const queryId = process.env.DUNE_QUERY_TIPS_RECEIVED_ID;
const fid = 397668;
const username = "0x94t3z.eth";

//schedule the query on a 6 hour interval, and then fetch by filtering for the user fid within the query results
//dune query where each row is a unique fid and each column is a recommended set of users: https://dune.com/queries/3509966
const meta = {
    "x-dune-api-key": apiKey
};
const header = new Headers(meta);

const latest_response = await fetch(`https://api.dune.com/api/v1/query/${queryId}/results?&filters=rx_fid=${fid}` //filter for single fid
, {
    method: 'GET',
    headers: header,
});

const body = await latest_response.text();
const responseJson = JSON.parse(body);

const recs = responseJson.result.rows[0];

const total_tips = recs ? recs.total_tips : 0;

console.log(`Total tips received for ${username}: ${total_tips}`);



// Get the current month and year
// const now = new Date();
// const currentMonth = now.getUTCMonth(); // 0-based (January is 0, December is 11)
// const currentYear = now.getUTCFullYear();

// // Filter records for the current month and year where is_valid is '✅ '
// const validRecs = recs.filter(rec => {
//     const recDate = new Date(rec.tip_datetime);
//     return rec.is_valid === '✅ ' && recDate.getUTCFullYear() === currentYear && recDate.getUTCMonth() === currentMonth;
// });

// // Sum the tip_amount for valid tips within the current month
// const points = validRecs.reduce((sum, rec) => sum + rec.tip_amount, 0);

// console.log(`Total points for the current month: ${points}`);
// console.log('Filtered records:', validRecs);


// // Define the date to filter by (today's date)
// const filterDate = new Date();
// filterDate.setHours(0, 0, 0, 0);

// // Filter and sum the tip_amount for valid tips with tip_datetime matching filterDate
// const filteredRecs = recs.filter(rec => {
//     const recDate = new Date(rec.tip_datetime);
//     recDate.setHours(0, 0, 0, 0);
//     return rec.is_valid === '✅ ' && recDate.getTime() === filterDate.getTime();
// });

// const daillyTipped = filteredRecs.reduce((sum, rec) => sum + rec.tip_amount, 0);
// const dailyAllowance = 42000;
// const remaining = dailyAllowance - daillyTipped;

// console.log(`Total daily tipped for ${filterDate.toDateString()}: ${daillyTipped}`);
// console.log(`Remaining allowance: ${remaining}`);



// if (responseJson.result && responseJson.result.rows.length > 0) {
//     const recs = responseJson.result.rows[0]; // Assuming there's only one row as per your initial example
    
//     // Log individual properties of recs
//     console.log("allowance:", recs.allowance);
//     console.log("display_name:", recs.display_name);
//     console.log("fid:", recs.fid);
//     console.log("fname:", recs.fname);
    
// } else {
//     console.log("No rows found in the response.");
// }