const express = require('express');
const Place = require('./../models/place');

const placeRouter = new express.Router();

placeRouter.get('/list', (req, res, next) => {
  Place.find()
    .then((places) => {
      res.render('places/list', { places });
    })
    .catch((error) => {
      next(error);
    });
});

placeRouter.get('/view/:id', (req, res, next) => {
  const placeId = req.params.id;
  Place.findById(placeId)
    .then((place) => {
      res.render('places/single', { place });
    })
    .catch((error) => {
      next(error);
    });
});

placeRouter.get('/search', (req, res, next) => {
  const searchQueries = {
    latitude: req.query.latitude,
    longitude: req.query.longitude,
    distance: req.query.distance,
  };
  Place.find()
    .where('location')
    .within()
    .circle({
      center: [searchQueries.longitude, searchQueries.latitude],
      radius: searchQueries.distance,
    })
    .then((places) => {
      res.render('places/list', { places });
    })
    .catch((error) => {
      next(error);
    });
});

placeRouter.get('/create', (req, res, next) => {
  res.render('places/create');
});

placeRouter.post('/create', (req, res, next) => {
  const placeDetails = {
    name: req.body.name,
    type: req.body.type,
    location: {
      coordinates: [Number(req.body.lat), Number(req.body.lng)],
    },
  };
  Place.create({ ...placeDetails })
    .then(() => {
      res.redirect('/place/list');
    })
    .catch((error) => {
      next(error);
    });
});

placeRouter.get('/edit/:id', (req, res, next) => {
  const placeId = req.params.id;
  Place.findById(placeId)
    .then((place) => {
      res.render('places/edit', { place });
    })
    .catch((error) => {
      next(error);
    });
});

placeRouter.post('/edit/:id', (req, res, next) => {
  const placeId = req.params.id;
  const newPlaceDetails = {
    name: req.body.name,
    type: req.body.type,
    location: {
      coordinates: [Number(req.body.lat), Number(req.body.lng)],
    },
  };
  Place.findByIdAndUpdate(placeId, { ...newPlaceDetails })
    .then(() => {
      res.redirect('/place/list');
    })
    .catch((error) => {
      next(error);
    });
});

placeRouter.post('/delete/:id', (req, res, next) => {
  const placeId = req.params.id;
  Place.findByIdAndDelete(placeId)
    .then(() => {
      res.redirect('/place/list');
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = placeRouter;
