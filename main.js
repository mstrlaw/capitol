import datapoints from './data/datapoints.js';

mapboxgl.accessToken = 'pk.eyJ1IjoibXN0cmxhdyIsImEiOiJja2p4ODQ2cW4wcHoyMndzZGdkZGthamVmIn0.mM90iuWzsHPeGZ4TkXoNIw';
// https://jan06.nyc3.digitaloceanspaces.com/yGh7nMgJB7m2.mp4

/*
  Panel
*/
const panelEl = document.getElementById('panel');
const panelBody = document.getElementById('panelBody');
const videoWrapper = document.getElementById('videoWrapper');
const videoPlayer = document.getElementById('videoPlayer');
const closePlayerTrigger = document.getElementById('closePlayer');

document.getElementById('closePanel').addEventListener('click', e => {
  e.preventDefault();
  panelEl.classList.remove('is-visible');
  deactivateVideoTriggers();
  closePlayer();
  panelBody.innerHTML = ''
})

/*
  Video triggers
*/
const openPlayer = (mediaID) => {
  videoWrapper.classList.add('is-visible');
  videoPlayer.setAttribute('src', `https://jan06.nyc3.digitaloceanspaces.com/${mediaID}.mp4`)
}

const closePlayer = () => {
  videoPlayer.pause();
  videoPlayer.removeAttribute('src');
  videoWrapper.classList.remove('is-visible');
}

const activateVideoTriggers = () => {
  const videoTriggers = document.querySelectorAll('[data-trigger]')
  videoTriggers.forEach(trigger => {
    trigger.addEventListener('click', e => {
      e.preventDefault();
      openPlayer(e.target.parentElement.getAttribute('data-id'));
    });
  });
}

const deactivateVideoTriggers = () => {
  const videoTriggers = document.querySelectorAll('[data-trigger]')
  videoTriggers.forEach(trigger => trigger.removeEventListener('click', openPlayer));
}

closePlayerTrigger.addEventListener('click', e => {
  e.preventDefault();
  closePlayer();
});

/*
Renders video list in the side panel
*/
const renderVideoList = (listItems) => {
  let list = '';
  panelBody.innerHTML = '';
  listItems.forEach(item => {
    const { properties: props } = item;
    let tags = props.tags
    list += `
    <div class="c-Video">
      <div class="c-Video__meta">
        <small><b>${props.id}</b></small>
        <small class="c-Video__time">${props.time} | ${props.duration}s | ${tags}</small>
        <small>${props.location}</small>
      </div>
      <a href="#" data-trigger data-id="${props.id}">
        <img src="https://jan06.nyc3.digitaloceanspaces.com/${props.image}" alt="Image ${props.image}">
      </a>
    </div>
    `
    panelBody.innerHTML = list;
  })
}

const map = new mapboxgl.Map({
  container: 'map',
  center: [ -77.01071398310138, 38.889831323686515 ],
  style: 'mapbox://styles/mstrlaw/ckjx89ck51jah17ph25qtcqus',
  zoom: 13,
});

const drawMapData = (data) => {
  map.addSource('videos', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: data,
    },
    cluster: true,
    clusterMaxZoom: 17, // Max zoom to cluster points on
    clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
  });

  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'videos',
    filter: ['has', 'point_count'],
    paint: {
      // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
      // with three steps to implement three types of circles:
      //   * Blue, 20px circles when point count is less than 100
      //   * Yellow, 30px circles when point count is between 100 and 750
      //   * Pink, 40px circles when point count is greater than or equal to 750
      'circle-color': [
        'step',
        ['get', 'point_count'],
        'red',
        100,
        'orange',
        750,
        'red'
      ],
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        20,
        100,
        30,
        750,
        40
      ]
    }
  });

  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'videos',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12
    }
  });

  map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'videos',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': 'red',
      'circle-radius': 4,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    }
  });
}

const clearMapData = () => {
  map.removeLayer('clusters');
  map.removeLayer('cluster-count');
  map.removeLayer('unclustered-point');
  map.removeSource('videos');
}

// var marker = new mapboxgl.Marker().setLngLat([-77.010050750701, 38.88982349147157]).addTo(map);
map.on('load', function () {
  // Add a new source from our GeoJSON data and
  // set the 'cluster' option to true. GL-JS will
  // add the point_count property to your source data.

  drawMapData(datapoints);

  // inspect a cluster on click
  map.on('click', 'clusters', function (e) {
    let features = map.queryRenderedFeatures(e.point, {
      layers: ['clusters']
    });

    let clusterId = features[0].properties.cluster_id;

    features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
    clusterId = features[0].properties.cluster_id;

    const point_count = features[0].properties.point_count;
    const clusterSource = map.getSource('videos');

    // Get all points under a cluster
    clusterSource.getClusterLeaves(clusterId, point_count, 0, function(err, aFeatures){

      // Only list videos for smaller clusters
      if (aFeatures.length <= 50) {
        deactivateVideoTriggers();
        panelEl.classList.add('is-visible');
        renderVideoList(aFeatures);
        activateVideoTriggers();
      }
    })



    map.getSource('videos').getClusterExpansionZoom(
      clusterId,
      function (err, zoom) {
        if (err) return;

        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom
        });
      }
    );
  });

  // Handle individual marker click
  map.on('click', 'unclustered-point', function (e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    map.flyTo({
      center: coordinates
    });
    deactivateVideoTriggers();
    panelEl.classList.add('is-visible');
    renderVideoList([e.features[0]]);
    activateVideoTriggers();
  });

  map.on('mouseenter', 'clusters', function () {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'clusters', function () {
    map.getCanvas().style.cursor = '';
  });

});
