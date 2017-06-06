# FEND Neighborhood map

# Project Requirments
---
Develop a single-page application featuring a map of your neighborhood or a neighborhood you would like to visit. You will then add additional functionality to this application, including: map markers to identify popular locations or places you’d like to visit, a search function to easily discover these locations, and a listview to support simple browsing of all locations. You will then research and implement third-party APIs that provide additional information about each of these locations (such as StreetView images, Wikipedia articles, Yelp reviews, etc).

# Installation

Clone the GitHub repo and install the dependicies

    $ git clone https://github.com/rsdobbins/FEND_Neighborhood_map
    $ cd FEND_Neighborhod_map
    $ bundle install

# Gulp commands

    $ gulp - to run locally
    $ gulp build - to build to dist/
    
## Interface

Responsiveness - built on bootstrap frameowrk to scale accross devices

## App Functionality

Filter Locations - Includes text input filed to fliter list items and map markers.
List View - List view is displayed to navigate the map markers. 
Map and Markers - Map displays all location markers by default, and displays the filtered subset of location markers when a filter is applied.
Clicking a marker displays unique information about a location in an infoWindow.
Markers should animate when clicked (e.g. bouncing, color change.

## Location Details

Additional Location Data - Functionality providing additional data about a location is provided and sourced from the Wikipedia API. Information is provided in the marker’s infoWindow.
