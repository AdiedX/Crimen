

var node_xj = require("xls-to-json");
node_xj({input: "nyc-crime-weekly.xls", output: "nyc-crime-weekly.json"}, function(err, result)
{
    if(err)
    {
        console.error(err);
    }
    else
    {
        console.log(result);
    }
});