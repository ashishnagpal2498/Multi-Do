const responseFunction = (message,result=null,error=false) => {
    return {
        error,
        result,
        message
    }
};


exports = module.exports = {
    responseFunction
}