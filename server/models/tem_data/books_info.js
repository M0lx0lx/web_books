module.exports= { //暂存的图书信息
    names: {},
    changing: [],
    datas: {},
    push_book: function(name,originalname,data){
        if(name in this.names){
            return console.log(name+'已存在');
        }
        this.names[name]= originalname;
        this.datas[name]= data;
        var tem= this.changing.indexOf(name)
        if( tem!== -1){
            this.changing.splice(tem,1)
        }
        return this;
    },
    search_key: function(originalname){  //根据原名找到当前名
        for(var i in this.names){
            if(this.names[i]=== originalname){
                return i;
            }
        }
        return null;
    },
    push_changing: function(name){
        if(name in this.names){
            delete this.names[name]
            delete this.datas[name]
        }
        var tem= this.changing.indexOf(name)
        if( tem === -1){
            this.changing.push(name)
        }
        return this;
    }
}