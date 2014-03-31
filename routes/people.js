var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var apiProblem = require('../api-problem');

var PeopleSchema = new Schema({
    id: {type: Number, require: true},
    name: {type: String, required: true},
    voice: {type: Number, required: true}
}, {
    collection: "people"
});
var People = mongoose.model('people', PeopleSchema);
/**
 * GET
 * If id passed get only one
 * If not get whole collection
 * 
 * id = null
 * offset = 0
 * limit = 0
 * sort (id,name,voice)
 */
exports.get = function (req, res) {
    var id, offset = 0, limit = 5, sort = 'id', sortType = 1,
        query, sortParams;
    id = req.params.id || null;
    
    if(id) {
        People.findOne({id: id}, function(err, data) {
            if(err) {
                return res.send(apiProblem.msg(500, 'db'))
            }
            if(data) {
                res.send(data);
            } else {
                res.send(apiProblem.msg(304, 'Object does not exists'));
            }
        });
    } else {
        offset = req.query.offset || offset;
        limit = req.query.limit || limit;
        sort = req.query.sort || sort;
        if(sort.charAt(0) === '-') {
            sortType = -1;
            sort = sort.substring(1);
        }
        sortParams = {};
        sortParams[sort] = sortType;
        query = People.find().skip(offset).limit(limit).sort(sortParams);
        query.exec(function (err, data) {
            if(err) {
                return res.send(apiProblem.msg(500, 'db'));
            }
            res.send(data);
        });
    }
}
/**
 * POST
 */
exports.post = function (req, res) {
    var element, data, save;
    data = req.body;
    element = new People({
        "id": data.id,
        "name": data.name,
        "voice": data.voice
    });
    save = function () {
        element.save(function (err) {
            if(err) {
                res.send(apiProblem.msg(500, 'db'));
            }
            res.send(201, element);
        });
    }.bind(this);
    /** Response with error if exists **/
    People.findOne({id: element.id}, function (err, elem) {
        if(err) {
            return res.send(apiProblem.msg(500, 'db'));
        }
        if(elem) {
            res.send(apiProblem.msg(304, 'Object exists'));
        } else {
            save();
        }
    });
}
/**
 * DELETE by id
 */
exports.delete = function (req, res) {
    var id, remove;
    id = req.params.id;
    remove = function(element) {
        element.remove(function (err) {
            if(err) {
                return res.send(apiProblem.msg(500, 'db'));
            }
            res.send(204);
        });
    }
    People.findOne({id: id}, function (err, element) {
        if(err) {
            return res.send(apiProblem.msg(500, 'db'));
        }
        if(element) {
            remove(element);
        } else {
            res.send(apiProblem.msg(304, 'Object does not exists'));
        }
    });
}
/**
 * PUT
 */
exports.update = function (req, res) {
    var element, data, id;
    id = req.params.id || 0;
    data = req.body;
    element = {
        "name": data.name,
        "voice": data.voice
    };
    People.update({id: id}, element, function (err, numberAffected) {
        if(err) {
            return res.send(apiProblem.msg(500, 'db'));
        }
        if(numberAffected === 1) {
            res.send(201, element);
        } else {
            res.send(apiProblem.msg(304, 'Object does not exists'));
        }

    });
    
}