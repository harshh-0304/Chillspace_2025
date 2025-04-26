const Place = require("../models/Place");

// Adds a place in the DB
exports.addPlace = async (req, res) => {
  try {
    const userData = req.user;

    // Check if user is host or admin
    if (userData.role !== "host" && userData.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access Denied: Only hosts and admins can add places",
      });
    }

    const {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      maxGuests,
      price,
    } = req.body;

    const place = await Place.create({
      owner: userData.id,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      maxGuests,
      price,
    });

    res.status(200).json({
      success: true,
      place,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err,
    });
  }
};

// Returns user specific places
exports.userPlaces = async (req, res) => {
  try {
    const userData = req.user;
    const id = userData.id;
    res.status(200).json(await Place.find({ owner: id }));
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Updates a place
exports.updatePlace = async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData.id;
    const {
      id,
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      maxGuests,
      price,
    } = req.body;

    const place = await Place.findById(id);

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Place not found",
      });
    }

    // Allow update if user is the owner OR if user is an admin
    if (userId === place.owner.toString() || userData.role === "admin") {
      place.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        maxGuests,
        price,
      });
      await place.save();
      res.status(200).json({
        success: true,
        message: "Place updated successfully",
      });
    } else {
      res.status(403).json({
        success: false,
        message: "You are not authorized to update this place",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err,
    });
  }
};

// Returns all the places in DB
exports.getPlaces = async (req, res) => {
  try {
    const places = await Place.find();
    res.status(200).json({
      success: true,
      places,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Returns single place, based on passed place id
exports.singlePlace = async (req, res) => {
  try {
    const { id } = req.params;
    const place = await Place.findById(id);

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Place not found",
      });
    }

    res.status(200).json({
      success: true,
      place,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Search Places in the DB
exports.searchPlaces = async (req, res) => {
  try {
    const searchword = req.params.key;

    if (searchword === "") return res.status(200).json(await Place.find());

    const searchMatches = await Place.find({
      address: { $regex: searchword, $options: "i" },
    });

    res.status(200).json(searchMatches);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Deletes a place from the DB
exports.deletePlace = async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData.id;
    const { id } = req.params;

    // Find the place by ID
    const place = await Place.findById(id);

    // Check if place exists
    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Place not found",
      });
    }

    // Verify user is authorized to delete:
    // Either the user is the owner (and a host) OR the user is an admin
    if (
      (userId === place.owner.toString() && userData.role === "host") ||
      userData.role === "admin"
    ) {
      // Delete the place
      await Place.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: "Place deleted successfully",
      });
    } else {
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized - only hosts can delete their own places or admins can delete any place",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err,
    });
  }
};
