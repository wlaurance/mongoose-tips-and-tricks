'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('lodash');
const async = require('async');

mongoose.connect('mongodb://localhost/test');

const Restaurant = mongoose.model('Restaurant', {
  address: {
    building: String,
    coord: [Number],
    street: String,
    zipcode: String
  },
  borough: String,
  cuisine: String,
  grades: [{
    date: Date,
    grade: String,
    score: Number
  }],
  name: String,
  restaurant_id: String
});

function makeNewGrade() {
  return {
    date: new Date(),
    grade: _.sample(['A','B','C', 'D']),
    score: _.sample(['1', '2', '3', '4', '5'])
  };
}

const numberOfGrades = process.env.NUM_GRADES || 10;
const restaurantId = '30075445';

function pushIteree(num, cb) {
  let newGrade = makeNewGrade();
  Restaurant.updateOne({
    restaurant_id: restaurantId
  }, {
    $push: {
      grades: newGrade
    }
  }).exec(cb);
}

function getSaveIteree(num, cb) {
  Restaurant.findOne({
    restaurant_id: restaurantId
  }).exec((err, restaurant) => {
    if (err) {
      return cb(err);
    }
    if (!restaurant) {
      return cb(new Error('Restaurant not found'));
    }
    restaurant.grades.push(makeNewGrade());
    restaurant.save(cb);
  });
}

var iteree;

if (process.env.PUSH) {
  console.log('running with $push');
  iteree = pushIteree;
} else {
  console.log('running with get/save technique');
  iteree = getSaveIteree;
}

async.each(_.range(numberOfGrades), iteree, (err) => {
  console.log('Grades processed');
  process.exit();
});

