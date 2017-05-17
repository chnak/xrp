exports.install = function() {
	F.route('/', view_index);
	F.route('/ticker',view_ticker,['POST']);
};

function view_index(){
	var self=this;
	self.view('index');
}

function view_ticker() {
	var self = this;
	self.async=new U.Async();
	var symble=self.req.body.type.split('/');
	var json={};
	self.async.await(function(next) {
		U.request('http://api.btc38.com/v1/ticker.php?c='+symble[1]+'&mk_type='+symble[0], ['get'], function(error, data) {
			//console.log(error);
			if (error)
				self.error(error);

			json.btc = JSON.parse(data);
			next();
		});
	});
	self.async.await(function(next) {
		U.request('https://www.jubi.com/api/v1/ticker/?coin='+symble[1], ['get'], function(error, data) {

			if (error)
				self.error(error);

			json.jubi = JSON.parse(data);
			next();
		});
	});
	self.async.run(function(){
		self.json(json);
	});
}