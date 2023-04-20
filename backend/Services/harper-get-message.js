import axios from "axios";

function harperGetMessage(room){
    const dbURL = process.env.HARPERDB_URL;
  const dbPW = process.env.HARPERDB_PASSWORD;
  if(!dbURL || !dbPW)return null;

  let data=JSON.stringify({
    operation:'sql',
    sql:`SELECT * FROM RealTime_Chat_App.message WHERE room='${room}' LIMIT 100`,
  })
  
  let config={
      method:'post',
      url:dbURL,
      headers:{
          'Content-Type':'application/json',
          Authorization:dbPW,
        },
        data:data
    }
    
    return new Promise((resolve,reject)=>{
        axios(config)
        .then(function (response){
            resolve(JSON.stringify(response.data));
        })
        .catch(function(err){
            reject(err)
        });
    });
}

export default harperGetMessage;