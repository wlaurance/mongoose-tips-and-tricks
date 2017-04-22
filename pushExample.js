'use strict';

const mongoose = require('mongoose');
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

const numberOfGrades = 1000;
const restaurantId = '30075445';

function pushIteree(cb) {

}

function getSaveIteree(cb) {

}

var iteree;

if (process.env.PUSH) {
  iteree = pushIteree;
} else {
  iteree = getSaveIteree;
}

async.each(_.range(numberOfGrades), iteree, (err) => {
  console.log('Grades processed');
});

