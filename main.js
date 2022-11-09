
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

const PAGE_LIMIT = 5000;

const START_DATE = seconds( 2022, 11, 1 ); // year, month, day
const END_DATE = seconds( 2022, 12, 1 );

// save addresses
const COINS_SAVED_ADDRESS = ['BTC', 'ETH', 'USDT']
// const MARKETS_ORDER_HISTORY = ['BTC-PERP', 'ETH-PERP'];

const delay = ms => new Promise( ( resolve, _ ) => setTimeout( () => resolve(), ms ) );

const output = {};

(async()=>{ 

    let res;

    print('Get all historical balances and positions snapshots')
    // Might work
    try { 
        res = await client.requestWrapper.get('historical_balances/requests');
        output.historial_balances_snapshots = res.result;
    } catch ( e ) { print( e ) }
    

    // undocumented endpoint
    print('Getting USD snapshots')
    res = await client.getUsdValueSnapshots( 100000 )
    output.usd_value_snapshots = res.result.records;

    await delay( 1000 );
    
    print('Getting account snapshot')
    res = await client.getAccount();
    output.account_snapshot = res.result;

    await delay( 1000 );
    
    output.deposit_history = await batch_deposit_history();
    
    await delay( 1000 );

    print('Getting withdrawal history')
    output.withdrawals = await batch_withdrawal_history();

    await delay( 1000 );

    print('Getting rebate history')
    res = await client.getRebateHistory();
    output.rebates = res.result;

    print('Getting saved addresses')
    const saved_addresses = [];

    for ( const coin of COINS_SAVED_ADDRESS ) {
        res = await client.getSavedAddresses( coin );
        saved_addresses.push({ coin, data: res.result })
        await delay( 500 );
    }

    output.saved_addresses = saved_addresses;

    await delay( 1000 );

    print('Getting order history...')
    output.order_history = await batch_order_history();

    print('Getting trigger history...')
    output.trigger_history = await batch_trigger_history();

    // if ( GET_LEND_BORROW_HISTORY ) {
    //     print('Getting lending history [takes a while!]...')
    //     output.lending_history = await batch_lending_history();
    //     // print( output.lending_history )

    //     // print('Getting borrow history [takes a while!]...')
    //     // output.borrow_history = await batch_borrow_history();
    // }

    fs.writeFileSync('./output.json', JSON.stringify( output ));

    print('wrote output.json');
    process.exit(1);


})();



// def get_all_trades(self, market: str, start_time: float = None, end_time: float = None) -> List:

async function batch_deposit_history() {

    let d_start = START_DATE, d_end = END_DATE;

    let deposit_history = [];

    while( true ) {

        res = await client.getDepositHistory({ start_time: d_start, end_time: d_end, limit: PAGE_LIMIT });
        const data = res?.result || [];

        if ( !data.length )
            break;

        deposit_history = deposit_history.concat( data );

        d_end = ( Date.parse( data[ data.length -1 ].time ) / 1000)>>0;
        
        await delay( 500 );
    }

    return deposit_history;

}

async function batch_withdrawal_history() {

    let d_start = START_DATE, d_end = END_DATE;

    let widthdrawal_history = [];

    while( true ) {
        res = await client.getWithdrawalHistory({ start_time: d_start, end_time: d_end, limit: PAGE_LIMIT });
        const data = res?.result || [];

        if ( !data.length )
            break;

            widthdrawal_history = widthdrawal_history.concat( data );

        d_end = ( Date.parse( data[ data.length -1 ].time ) / 1000)>>0;
        
        await delay( 500 );
    }

    return widthdrawal_history;

}

async function batch_order_history(  ) {

    let d_start = START_DATE, d_end = END_DATE;

    let order_history = [];

    while( true ) {
        res = await client.getOrderHistory({ start_time: d_start, end_time: d_end, limit: PAGE_LIMIT });

        const data = res?.result || [];

        if ( !data.length )
            break;

        order_history = order_history.concat( data );

        d_end = ( Date.parse( data[ data.length -1 ].createdAt ) / 1000)>>0;
        
        await delay( 500 );
    }

    return order_history;

}


async function batch_trigger_history(  ) {

    let d_start = START_DATE, d_end = END_DATE;

    let order_history = [];

    while( true ) {
        res = await client.getTriggerOrderHistory({ start_time: d_start, end_time: d_end, limit: PAGE_LIMIT });

        const data = res?.result || [];

        if ( !data.length )
            break;

        order_history = order_history.concat( data );

        d_end = ( Date.parse( data[ data.length -1 ].createdAt ) / 1000)>>0;
        
        await delay( 500 );
    }

    return order_history;

}

// async function batch_lending_history(  ) {

//     let d_start = START_DATE, d_end = END_DATE;

//     let lend_history = [];

//     while( true ) {

//         // res = await client.getLendingHistory({ start_time: d_start, end_time: d_end, limit: PAGE_LIMIT });
//         res = await client.requestWrapper.get('spot_margin/lending_history', { start_time: d_start, end_time: d_end, limit: PAGE_LIMIT  });

//         const data = res?.result || [];

//         if ( !data.length )
//             break;

//         lend_history = lend_history.concat( data );

//         d_end = ( Date.parse( data[0  ].time ) / 1000 );

//         console.log( data[ 0 ].time );
        
//         await delay( 500 );
        
//     }

//     return lend_history;

// }

// async function batch_borrow_history(  ) {

//     let d_start = START_DATE, d_end = END_DATE;

//     let lend_history = [];

//     while( true ) {
//         res = await client.get({ start_time: d_start, end_time: d_end, limit: PAGE_LIMIT });

//         const data = res?.result || [];

//         if ( !data.length )
//             break;

//             lend_history = lend_history.concat( data );

//         d_end = ( Date.parse( data[ data.length -1 ].time ) / 1000)>>0;
        
//         await delay( 500 );
//     }

//     return lend_history;

// }