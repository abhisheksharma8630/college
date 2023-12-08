class ExpressError extends Error{
    constructor(stscode,msg){
        super();
        this.statuscode = stscode;
        this.message = msg;
    }
}

module.exports = ExpressError;