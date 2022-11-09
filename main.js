
const print = console.log;
const seconds = ( year, month, day ) => (Date.UTC( year, month -1, day )/1000)>>0;

const fs        = require('fs');
const FTXClient = require( "ftx-api" ).RestClient;


// Create this file 
const Account   = require('./key.json');
// ... or just paste your key here:
const API_KEY = Account.API_KEY;
const API_SECRET = Account.API_SECRET;


const client = new FTXClient( API_KEY, API_SECRET );


const START_DATE = seconds( 2020, 1, 1); // year, month, day
const END_DATE = seconds( 2022, 12, 1 );

// save addresses
const COINS = ['BTC', 'ETH', 'USDT']

const delay = ms => new Promise( ( resolve, _ ) => setTimeout( () => resolve(), ms ) );

const output = {};

(async()=>{ 

    let res;

    // undocumented endpoint
    print('Getting USD snapshots')
    res = await client.getUsdValueSnapshots( 100000 )
    output.usd_value_snapshots = res.result.records;

    await delay( 1000 );
    
    print('Getting account snapshots=')
    res = await client.getAccount();
    output.account_snapshot = res.result;

    await delay( 1000 );

    print('Getting deposit history')
    res = await client.getDepositHistory({ start_time: START_DATE });
    output.deposits = res.result;
    
    await delay( 1000 );

    print('Getting withdrawal history')
    res = await client.getWithdrawalHistory({ start_time: START_DATE });
    output.withdraws = res.result;

    await delay( 1000 );

    print('Getting rebate history')
    res = await client.getRebateHistory();
    output.rebates = res.result;

    print('Getting saved addresses')
    const saved_addresses = [];

    for ( const coin of COINS ) {
        res = await client.getSavedAddresses( coin );
        saved_addresses.push({ coin, data: res.result })
        await delay( 500 );
    }

    output.saved_addresses = saved_addresses;

    fs.writeFileSync('./output.json', JSON.stringify( output ));


})();