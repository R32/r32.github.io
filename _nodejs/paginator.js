

// global variables
var fs = require('fs');


/**
*	循环目录内所有文件,根据 pat
* @param [path='./']{String} 目录名
* @param [pat]{RegExp} 留空将匹配所有文件
* @param [exclude = ['.git','.gitignore'] ]{Array} 需要排除的文件或目录
* @return {Hash} name => filename ,dir => directory
*/
function walk(path, pat, exclude){
	var fname;
	var results = [];	
	var list = fs.readdirSync(path);
	var len =list.length
	var stat;

	!path && (path = './' );

	!exclude && (exclude = []);

	for(var i = 0; i<len; i+=1){

		fname = list[i];

		var c = fname.charAt(0);
		if(c === "_" || c === "." || exclude.indexOf(fname)!== -1) {
			continue;
		}
		
		stat = fs.statSync(path + fname);

		if(stat.isDirectory()){
		
			Array.prototype.push.apply(results ,arguments.callee(path + fname + '/', pat, exclude));		
		
		}else if(pat ? pat.test(fname) : true) { // 如果存在 pat 才检测是否符合条件,
			results.push({"name":fname,"path":path});
		}
	}
	return results;
}



var helpers = {
	/**
	*
	* @param filename{String} 不包含目录的文件名
	* @param [ext="markdown"]{String} 扩展名
	* @return {Hash}
	*/
	parseFilename: 	function(filename,ext){
		!ext && (ext = 'markdown');
		var m = filename.replace('.'+ext,'').split('-');
		var ret = null;
		if(m.length > 3){
			var ymd  = m.slice(0,3);
			var date = new Date(ymd.join(',')).getTime();
			var name = m.slice(3).join('-')
			ret = {
				"date"	: date,
				"name"	: name,
				"ymd"	: ymd	// [YYYY, MM ,DD ]
			}
			if(name === 'index'){
				throw new Error('name 不可以为 index ');
			}
		}
		//forin(ret,'parseFilename:');
		return ret;
	},

	/**
	*	简单从 jelyll 的 markdown 顶部获阳 YAML 字符串
	*@ param url(String) 带目录的的全名
	*@ return {String} 
	*/
	getYAML: function (url){
		var fstr = fs.readFileSync(url,'utf8').replace(/\r\n/g,"\n");
		var lp = fstr.indexOf('---\n') + 4;
		var rp;
		if(lp !== -1){
			rp = fstr.indexOf('\n---',lp);
		}
		return fstr.slice(lp,rp).trim();
	},

	/**
	*
	* @param str{String} YAML 字符串
	* @return {Map<String,String>}
	*/
	parseYAML: 	function(str){
		var lines = str.split('\n');
		var tmp;
		var ret = {};

		for(var i=0; i<lines.length; i+=1){
			tmp = lines[i].split(":");
			
			ret[ tmp[0].trim() ] = tmp.slice(1).join(":").trim();
		}
		//forin(ret,'\nparseYAML:');
		return ret;
	},

	/**
	* @param a{Hash} parseFilename 的返回对象
	* @param b{Hash} parseYAML 的返回对象
	*/
	mixer: function (a,b){
		var ret = {};
		var path = [];
		ret.time = new Date(b.date.replace(/\-/g,',')).getTime();
		
		if(isNaN(ret.time)){
			ret.time = a.date;
		}
		ret.title = b.title ? b.title : a.name;


		path.push('');	// 压入一个空字符串,为 join

		if('categories' in b){
			ret.cat = b.categories.replace(/\s+/g,'\x20');

			Array.prototype.push.apply(path,	ret.cat.split("\x20"));

		}else if('category' in b){
			ret.cat = b.category.split("\x20")[0];
			path.push(ret.cat);
		}

		// NOTE:  重要: 这里的 url 是以 _config.yaml 中 permalink: default 而建立的,如果改动 这里必须要调整
		// 没时间写 解析 permalink ,然后动态生成 url 的方法了

		Array.prototype.push.apply(path, a.ymd);	// 这样将会生成 yyyy/mm/dd 这样的目录
		path.push( a.name + '.html');
		
		ret.url = path.join('/');
		
		//forin(ret,'\nmixer:');
		return ret;
	},


	/**
	*
	*@param results{Hash}	walk 方法返回的值
	*/
	parse : function(results){
		var a = this.parseFilename(results.name);
		var b = this.parseYAML(this.getYAML(results.path + results.name));
		return this.mixer(a,b);
	},
	/**
	* 根据时间戳值倒序排数组
	*/
	sortByTime: function (a,b){
		return b.time - a.time;
	} 
};


// list simple object value
function forin(obj,title){
	title && console.log(title);
	var item;
	if(!(obj instanceof Array)){
		obj = [obj];
	}
	for(var i=0,len=obj.length; i< len; i+=1){
		item = obj[i];
		for(var k in item){
			console.log(k +' => '+item[k])
		}
	}
}


/**
*	
*	
*@method main
*/
function main(){

	var path = '../';

	var jsname = 'pagin_data.js';

	var item;
	
	var ret = {};
	
	var elapse;

	var ot = new Date().getTime();

	var list = walk(path + "_posts/", /markdown$/);

	for(var i = 0,len = list.length ; i < len; i+=1){

		item = helpers.parse(list[i]);

		item.cat = item.cat.split('0x20')[0];	// NOTE: 个人项目只支持 一层分类,不支持多分类

		if(!(item.cat in ret)){
			ret[item.cat] = [];	
		}

		ret[item.cat].push(item);
		
		delete item.cat;
		
		item = null;
	}

	for(var k in ret){
		Array.prototype.sort.call(ret[k],helpers.sortByTime);
	}
	
	fs.writeFileSync(path + jsname, JSON.stringify(ret, null, "  "),'utf8' );
	
	elapse = new Date().getTime() - ot;
	
	console.log('[' + path + jsname +'] 完成. 消耗: '+ elapse +' 毫秒');
}

main();