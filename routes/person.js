var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var apiProblem = require('../api-problem');

var PersonSchema = new Schema({
    id: {type: Number, require: true},
    name: {type: String, required: true},
    voice: {type: Number, required: true}
});
var Person = mongoose.model('person', PersonSchema, 'person');
/**
 * GET
 */
exports.get = function (req, res) {
    return Person.find(function (err, data) {
        if(err) {
            console.log('get err');
        } else {
            console.log('found');
            return res.send(data);
        }
    });
}
/**
 * POST
 */
exports.post = function (req, res) {
    var element, data, save;
    data = req.body;
    element = new Person({
        "id": data.id,
        "name": data.name,
        "voice": data.voice
    });
    save = function () {
        element.save(function (err) {
            if(err) {
                res.send(apiProblem.msg(500, 'Database operation error'));
            }
            res.send(201, element);
        });
    }.bind(this);
    /** Update if exists **/
    Person.findOne({id: element.id}, function (err, elem) {
        if(err) {
            res.send(apiProblem.msg(500, 'Database operation error'));
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
                res.send(apiProblem.msg(500, 'Database operation error'));
            }
            res.send(204, {"message": 'Element with id: '+ id +' removed'});
        });
    }
    Person.findOne({id: id}, function (err, element) {
        if(err) {
            res.send(apiProblem.msg(500, 'Database operation error'));
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
    Person.update({id: id}, element, function (err, numberAffected) {
        if(err) {
            res.send(apiProblem.msg(500, 'Database operation error'));
        }
        if(numberAffected === 1) {
            res.send(201, element);
        } else {
            res.send(apiProblem.msg(304, 'Object does not exists'));
        }

    });
    
}