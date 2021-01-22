import datapoints from './data/datapoints.js';

mapboxgl.accessToken = 'pk.eyJ1IjoibXN0cmxhdyIsImEiOiJja2p4ODQ2cW4wcHoyMndzZGdkZGthamVmIn0.mM90iuWzsHPeGZ4TkXoNIw';

const capitolPos = [ -77.01071398310138, 38.889831323686515 ];
const rightPanel = document.getElementById('rightPanel');
const leftPanel = document.getElementById('leftPanel');
const aboutPanel = document.getElementById('aboutPanel');
const panelBody = document.getElementById('panelBody');
const videoWrapper = document.getElementById('videoWrapper');
const videoPlayer = document.getElementById('videoPlayer');
const facesWrapper = document.getElementById('faces');
const closePlayerTrigger = document.getElementById('closePlayer');
const selectedFilters = [];
const map = new mapboxgl.Map({
  container: 'map',
  center: capitolPos,
  style: 'mapbox://styles/mstrlaw/ckjx89ck51jah17ph25qtcqus',
  zoom: 13,
});

window.onload = function() {
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = urlParams.get('video')
  if (videoId !== null) {
    const video = datapoints.find(data => {
      return data.properties.id === videoId;
    });
    if (video) {
      setTimeout(() => {
        map.flyTo({
          center: video.geometry.coordinates,
          zoom: 19
        });
        rightPanel.classList.add('is-visible');
        renderVideoList([video]);
        activateVideoTriggers();
      }, 1000);
    }
  }

};

const filterData = (filters) => {
  const matches = datapoints.filter(data => {
    const tags = data.properties.tags;
    if (tags.length > 0) {
      if (tags.some((tag) => filters.indexOf(tag) !== -1)) {
        return data;
      }
    }
  });
  return matches;
}

/*
  Left panel
*/
document.getElementById('leftPanelToggle').addEventListener('click', e => {
  e.preventDefault();
  leftPanel.classList.add('is-visible');
});

document.getElementById('closePanelLeft').addEventListener('click', e => {
  e.preventDefault();
  leftPanel.classList.remove('is-visible');
});

document.querySelectorAll('input[type="checkbox"]').forEach(filter => {
  filter.addEventListener('change', e => {
    if (e.target.checked) {
      selectedFilters.push(e.target.value)
    } else {
      const i = selectedFilters.indexOf(e.target.value);
      selectedFilters.splice(i, 1);
    }

    closeRightPanel();
    clearMapData();

    if (selectedFilters.length > 0) {
      // Redrwa with filter datapoints
      const filteredData = filterData(selectedFilters);
      drawMapData(filteredData);
    } else {
      // Redraw whole map
      drawMapData(datapoints);
    }

    map.flyTo({
      center: capitolPos,
      zoom: 13
    });
  })
});

/*
  Right panel
*/
const closeRightPanel = () => {
  rightPanel.classList.remove('is-visible');
  deactivateVideoTriggers();
  closePlayer();
  panelBody.innerHTML = ''
}

document.getElementById('closePanelRight').addEventListener('click', e => {
  e.preventDefault();
  closeRightPanel();
});

/*
  About panel
*/
const collapsePanel = () => {
  document.getElementById('expandAbout').innerText = '+ more';
  aboutPanel.classList.remove('is-expanded');
}

document.getElementById('expandAbout').addEventListener('click', e => {
  e.preventDefault();
  if (!aboutPanel.matches('.is-expanded')) {
    e.target.innerText = '- less';
    aboutPanel.classList.add('is-expanded');
  } else {
    collapsePanel();
  }
});

/*
  Video triggers
*/
const openPlayer = (mediaID) => {
  videoWrapper.classList.add('is-visible');
  videoPlayer.innerHTML = '';
  videoPlayer.innerHTML = `
    <source src="https://jan06.nyc3.cdn.digitaloceanspaces.com/webm/${mediaID}.webm" type="video/webm">
    <source src="https://jan06.nyc3.cdn.digitaloceanspaces.com/${mediaID}.mp4" type="video/mp4">
  `
  videoPlayer.load();
}

const closePlayer = () => {
  videoPlayer.pause();
  videoPlayer.removeAttribute('src');
  videoWrapper.classList.remove('is-visible');
  videoWrapper.classList.remove('has-faces');
  facesWrapper.innerHTML = '';
}

const activateVideoTriggers = () => {
  const videoTriggers = document.querySelectorAll('[data-trigger]')
  videoTriggers.forEach(trigger => {
    trigger.addEventListener('click', e => {
      e.preventDefault();
      const vidId = e.target.parentElement.getAttribute('data-id')
      openPlayer(vidId);
      const video = datapoints.find(data => data.properties.id === vidId);
      facesWrapper.innerHTML = '';
      renderFacesList(video.properties);
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

const renderFacesList = (props) => {
  let { faces } = props;
  faces = typeof faces === 'string'
      ? JSON.parse("[" + faces + "]")[0]
      : faces;
  let images = '';


  if (faces.length > 0) {
    videoWrapper.classList.add('has-faces');
    faces.forEach(face => {
      images += `
      <img class="c-Player__face" src="https://jan06.nyc3.cdn.digitaloceanspaces.com/faces/${face}" />
      `
    })
    facesWrapper.innerHTML = images;
  } else {
    videoWrapper.classList.remove('has-faces');
    facesWrapper.innerHTML = '';
  }
}

/*
Renders video list in the side panel
*/
const renderVideoList = (listItems) => {
  let list = '';
  panelBody.innerHTML = '';
  listItems.forEach(item => {
    const { properties: props } = item;
    renderFacesList(props);

    list += `
    <div class="c-Video">
      <div class="c-Video__meta">
        <small><b>${props.id}</b> (link <a id="${props.id}" href="?video=${props.id}" >${props.id}</a>)</small>
        <small class="c-Video__time">${props.time} | ${props.duration}s | ${props.platform}</small>
        <small>${props.description}</small>
      </div>
      <a href="#" data-trigger data-id="${props.id}">
        <img src="https://jan06.nyc3.cdn.digitaloceanspaces.com/${props.image}" alt="Image ${props.image}">
      </a>
    </div>
    `
    panelBody.innerHTML = list;
  })
}

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

map.on('load', function () {
  // Add a new source from our GeoJSON data and
  // set the 'cluster' option to true. GL-JS will
  // add the point_count property to your source data.

  drawMapData(datapoints);

  // inspect a cluster on click
  map.on('click', 'clusters', function (e) {
    collapsePanel();

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
      if (aFeatures.length <= 100) {
        deactivateVideoTriggers();
        rightPanel.classList.add('is-visible');
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
    collapsePanel();
    map.flyTo({
      center: coordinates
    });
    deactivateVideoTriggers();
    rightPanel.classList.add('is-visible');
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
