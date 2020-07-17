# US-Millenium-Fire-Map

Ever since the destructive Camp fire of 2018 in Paradise, CA, wildland fires have been in the spotlight of public interest in a way they never have before. Where in the US do these fires occur the most? And how has fire changed throughout the millenium? 
As we enter what many believe to be a new age of wildland fire, with fires getting larger and more intense than ever, it will be important to be able to visualize and analyze fire data to monitor changing trends and predict where fires will occur next.

## About

This visualization displays an interactive map of all major wildland fires recorded by the National Interagency Fire Center from the year 2000 until 2018 (complete data is not yet availible for 2019). The map and fires are displayed via the Mapbox API and a custom vector tileset made using QGis and [this dataset](https://data-nifc.opendata.arcgis.com/datasets/us-hist-fire-perimtrs-2000-2018-dd83) from NIFC. Fires can be displayed by year using the slider, or viewed all at once. Fires can be clicked on to display more information about them, including the incident code, year, and acreage. 

## Implementation

Orginally the entire dataset would have been much too large to serve to the user at once, let alone display as a layer. In order to solve this I manually trimmed the dataset using QGis to remove all Alaskan wildfires (out of the scope of this project) as well as any unnecessary feature data that came with each fire (mostly foreign keys to other databases). Afterwards I exported the modified data to a geoJSON and used tippecanoe (a Mapbox utility) to convert it into a vector tile layer, which was then uploaded to Mapbox's file hosting. While the new tileset is extremely compact and efficient, it does not allow for querying the entire dataset at once to display aggregate data (such as the total number of fires or acres burned). 
