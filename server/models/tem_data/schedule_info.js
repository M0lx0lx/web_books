module.exports= {
    names: {},
    push_names: function(id,file_name,job){
        this.names["job_"+file_name+id]=job;
        return this.names;
    },
    search_name: function(id,file_name){
        return this.names["job_"+file_name+id] || null;
    },
    delete_name: function(id,file_name){
        var t= this.names["job_"+file_name+id];
        delete this.names["job_"+file_name+id];
        return t
    }
}