/*
* Wrap async functions
* Func pass in return a new function with  func executed
* Catch any error and passed to next;
*/

module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}