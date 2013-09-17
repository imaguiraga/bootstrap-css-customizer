/*
 * GET home page.
 */
 
var data = [], totalPoints = 300;
    function getRandomData() {
        if (data.length > 0) {
            data = data.slice(1);
        }

        // do a random walk
        while (data.length < totalPoints) {
            var prev = data.length > 0 ? data[data.length - 1] : 50;
            var y = prev + Math.random() * 10 - 5;
            if (y < 0) {
                y = 0;
            }
            if (y > 100) {
                y = 100;
            }
            data.push(y);
        }

        // zip the generated y values with the x values
        var res = [];
        for (var i = 0; i < data.length; ++i) {
            res.push([(new Date()).getTime(), data[i]])
            // res.push([i, data[i]])
        }
        return [res];
    };

var stats_month = function(req, res) {
	console.log('HEADERS: ' + JSON.stringify(req.headers));
	function randNum() {
		return ((Math.floor(Math.random() * (1 + 40 - 20))) + 20) * 1200;
	}
	function randNum2() {
		return ((Math.floor(Math.random() * (1 + 40 - 20))) + 20) * 500;
	}
	var pageviews = [];
	var x0 = 1;
	var y0 = 1;
	for ( var i = 0; i <= 60; i += 1) {

		var x = x0 + i * 0.5;
		var y = i * 5 + randNum();
		pageviews.push([ x, y ]);

	}
	
	var visits = [];
	for ( var i = 0; i <= 30; i += 1) {

		var x = x0;
		var y = i + randNum2();
		visits.push([ x, y ]);

	}
	var result = {
			"pageviews" : pageviews,
			"visits" : visits
		};
	
	console.log('visits: ' +result.length);
	// return "respond with a resource type = "+req.params.type;
	return JSON.stringify([pageviews,visits]);
};

exports.index = function(req, res) {
    res.set('Content-Type', 'text/javascript');
    console.log('callback = ' +req.query.callback);
    //JSON
    res.send(JSON.stringify(getRandomData()));
    //JSONP
	//res.send(req.query.callback+'('+JSON.stringify(getRandomData())+')');
};