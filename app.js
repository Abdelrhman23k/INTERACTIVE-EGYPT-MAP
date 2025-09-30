class EgyptExplorer {


  
  constructor() {
    this.map = null;
    this.markers = [];
    this.isSnappingBack = false; // ADDED: State flag for the snap-back function
    this.currentFilter = 'all';
    this.currentStyle = 'dark';
    this.currentColorScheme = 'default';
    this.isLoading = true;
    this.activePopup = null;
    this.hoverTimeout = null;
    this.popupElement = null;
    this.animationComplete = false;

    

    // Application data from provided JSON
    this.config = {
      bounds: [[24.70, 21.73], [36.87, 31.67]],
      center: [30.5, 26.0],
      initialZoom: 6.5,
      minZoom: 1,
      maxZoom: 120,
      globeCenter: [0, 20],
      globeZoom: 0.2
    };

                
    // Categories from provided data
    this.categories = {
      universities: { name: "Universities", color: "#1e40af", icon: "🎓" },
      techparks: { name: "Tech Parks", color: "#059669", icon: "🏢" },
      innovation: { name: "Innovation Hubs", color: "#dc2626", icon: "💡" }
    };


    // Locations from provided JSON data
    this.locations = [
      {
        id: "cairo-university",
        category: "universities",
        name: "Cairo University",
        coords: [31.2001, 30.0277],
        description: "Founded in 1908, Cairo University is Egypt's premier public university and a leading institution in the Middle East.",
        image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=280&h=120&fit=crop"
      },
      {
        id: "american-university-cairo",
        category: "universities",
        name: "American University in Cairo",
        coords: [31.4015, 30.0131],
        description: "A leading private research university providing American-style liberal arts education in the heart of Cairo.",
        image: "https://images.unsplash.com/photo-1562774053-701939374585?w=280&h=120&fit=crop"
      },
      {
        id: "alexandria-university",
        category: "universities",
        name: "Alexandria University",
        coords: [29.9097, 31.2156],
        description: "A major public university serving Egypt's Mediterranean coast, known for engineering and medical programs.",
        image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=280&h=120&fit=crop"
      },
      {
        id: "ain-shams-university",
        category: "universities",
        name: "Ain Shams University",
        coords: [31.2859, 30.0711],
        description: "One of Egypt's largest public universities, established in 1950, serving over 180,000 students.",
        image: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=280&h=120&fit=crop"
      },
      {
        id: "smart-village",
        category: "techparks",
        name: "Smart Village",
        coords: [31.0117, 30.0690],
        description: "Egypt's first and largest technology park, housing over 150 companies and serving as a major IT hub.",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=280&h=120&fit=crop"
      },
      {
        id: "greek-campus",
        category: "techparks",
        name: "Greek Campus",
        coords: [31.7314, 30.0059],
        description: "Modern tech hub in New Administrative Capital designed to attract international technology companies.",
        image: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=280&h=120&fit=crop"
      },
      {
        id: "knowledge-city",
        category: "techparks",
        name: "Knowledge City",
        coords: [31.3260, 30.0618],
        description: "Planned smart city project focusing on knowledge economy, research centers, and technology innovation.",
        image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=280&h=120&fit=crop"
      },
      {
        id: "cairo-innovation-hub",
        category: "innovation",
        name: "Cairo Innovation Hub",
        coords: [31.2357, 30.0444],
        description: "Leading startup incubator and innovation center supporting Egyptian entrepreneurs and tech startups.",
        image: "https://images.unsplash.com/photo-1553484771-371a605b060b?w=280&h=120&fit=crop"
      },
      {
        id: "alexandria-innovation-center",
        category: "innovation",
        name: "Alexandria Innovation Center",
        coords: [29.9245, 31.2001],
        description: "Mediterranean tech center promoting innovation and entrepreneurship in northern Egypt.",
        image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=280&h=120&fit=crop"
      },
      {
        id: "aswan-innovation-hub",
        category: "innovation",
        name: "Aswan Innovation Hub",
        coords: [32.8998, 24.0889],
        description: "Southern Egypt's technology development center focusing on sustainable innovation and renewable energy.",
        image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=280&h=120&fit=crop"
      }
    ];


    this.mapStyles = {
      positron: {
        name: "Positron",
        colors: {
          default: { name: "Default", url: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" },
          oceanic: { name: "Oceanic Blues", url: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" }
        }
      },
      dark: {
        name: "Dark Matter",
        colors: {
          default: { name: "Default", url: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json" },
          oceanic: { name: "Oceanic Blues", url: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json" }
        }
      },
      voyager: {
        name: "Voyager",
        colors: {
          default: { name: "Default", url: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json" },
          oceanic: { name: "Oceanic Blues", url: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json" }
        }
      }
    };


    this.oceanicTheme = {
      navyBackground: "#012D47",
      tealWater: "#027C91",
      mutedBlueGray: "#044E66",
      accentTeal: "#0590A1",
      deepTeal: "#01556B"
    };


    this.init();
  }


  init() {
    this.setupPopupSystem();
    this.showLoading();
    this.initializeMap();
    this.setupEventListeners();
    this.updateFilterCounts();
  }


  showLoading() {
    const loadingEl = document.getElementById('map-loading');
    if (loadingEl) {
      loadingEl.classList.remove('hidden');
      loadingEl.style.display = 'flex';
    }
    this.isLoading = true;
  }


  setupPopupSystem() {
    this.popupElement = document.getElementById('hover-popup');
    this.popupImage = document.getElementById('popup-image');
    this.popupTitle = document.getElementById('popup-title');
    this.popupDescription = document.getElementById('popup-description');
    this.popupClose = document.getElementById('popup-close');


    if (!this.popupElement) {
      console.error('Popup element not found');
      return;
    }


    // Close button handler
    if (this.popupClose) {
      this.popupClose.addEventListener('click', (e) => {
        e.stopPropagation();
        this.hidePopup();
      });
    }


    // Handle popup hover to keep it open
    this.popupElement.addEventListener('mouseenter', () => {
      clearTimeout(this.hoverTimeout);
    });


    this.popupElement.addEventListener('mouseleave', () => {
      this.hoverTimeout = setTimeout(() => {
        this.hidePopup();
      }, 200);
    });


    // Click outside to close (mobile)
    document.addEventListener('click', (e) => {
      if (this.activePopup && 
          !this.popupElement.contains(e.target) && 
          !e.target.closest('.stylized-pin')) {
        this.hidePopup();
      }
    });


    // Preload images
    this.preloadImages();
  }


  preloadImages() {
    this.locations.forEach(location => {
      const img = new Image();
      img.src = location.image;
    });
  }


  initializeMap() {
    const styleUrl = this.mapStyles[this.currentStyle].colors[this.currentColorScheme].url;


    // Initialize map with globe view for dramatic entry
    this.map = new maplibregl.Map({
      container: 'map',
      style: styleUrl,
      center: this.config.globeCenter,
      zoom: this.config.globeZoom,
      pitch: 0,
      bearing: 0,
      attributionControl: true,
      // --- CORRECTION HERE --- 
      // Changed 'name' back to 'type' to correctly initialize the globe.
      projection: { type: 'globe' } 
    });


    // Handle any map errors
    this.map.on('error', (e) => {
      console.warn('Map error (continuing with fallback):', e);
      // Continue with animation even if there are style errors
      if (this.isLoading) {
        setTimeout(() => {
          this.animateToEgypt();
        }, 1000);
      }
    });


    this.map.on('load', () => {
  console.log('Map loaded with globe projection, starting animation sequence...');

  // Find the first layer with text/icons to ensure our layer is visible.
  const layers = this.map.getStyle().layers;
  let firstSymbolId;
  for (const layer of layers) {
    if (layer.type === 'symbol') {
      firstSymbolId = layer.id;
      break;
    }
  }

  // Add the night lights source using the new jsDelivr URL.
  this.map.addSource('night-lights-source', {
    'type': 'raster',
    'tiles': [
      // --- The new, simpler URL ---
      'https://cdn.jsdelivr.net/gh/freetiler/nasa-blackmarble/tiles/{z}/{x}/{y}.jpeg'
    ],
    'tileSize': 256,
    // We no longer need 'scheme': 'tms'
    'attribution': '<a href="https://github.com/freetiler/nasa-blackmarble">freetiler/nasa-blackmarble</a>'
  });

  // Add the layer to the map.
  this.map.addLayer(
    {
      'id': 'night-lights-layer',
      'type': 'raster',
      'source': 'night-lights-source',
      'paint': {
        'raster-opacity': 0.5
      }
    },
    firstSymbolId // Place it below labels to keep them readable
  );

  // Apply other settings...
  this.applyIsraelFilter();
  // this.applyCurrentTheme(); // Keep commented out for now

  // Start the animation.
  setTimeout(() => {
    this.animateToEgypt();
  }, 1500);
});


    // Additional fallback handlers
    this.map.on('style.load', () => {
      console.log('Style loaded, reinforcing globe projection...');
      try {
        // --- CORRECTION HERE ---
        // Changed 'name' back to 'type'.
        this.map.setProjection({ type: 'globe' });
      } catch (error) {
        console.warn('Style load globe projection failed:', error);
      }
    });


    // Ultimate fallback in case load event doesn't fire
    setTimeout(() => {
      if (this.isLoading) {
        console.log('Fallback animation trigger activated...');
        this.animateToEgypt();
      }
    }, 4000);
  }


  animateToEgypt() {
    console.log('Starting globe-to-Egypt animation...');

    // First, ensure we're starting from the globe view
    this.map.jumpTo({
      center: this.config.globeCenter,
      zoom: this.config.globeZoom,
      pitch: 0,
      bearing: 0
    });


    // Small delay to ensure globe is visible, then start dramatic animation
    setTimeout(() => {
      // Dramatic fly-to animation from globe to Egypt
      this.map.flyTo({
        center: this.config.center,
        zoom: this.config.initialZoom,
        pitch: 45,
        bearing: 0,
        speed: 0.3,
        curve: 1.8,
        duration: 20000
      });
    }, 200);

    // Create markers after animation completes
    setTimeout(() => {
      console.log('Animation complete, creating markers...');
      this.hideLoading();
      this.createStylizedMarkers();
      this.animationComplete = true;

      setTimeout(() => {
        console.log('Staying in Globe projection for interaction.');

        // Setting bounds is not applicable for globe view, so it is removed.

        // We can still set min/max zoom levels for the globe.
        this.map.setMinZoom(this.config.minZoom);
        this.map.setMaxZoom(this.config.maxZoom);

        // ADDED: Setup snap-back functionality after animation is complete
        this._setupBoundsCheck();
      }, 12000);

    }, 6000); // Slightly after animation ends
  }

  // ADDED: Enhanced snap-back function with debugging and improved bounds checking
  _setupBoundsCheck() {
    // Define Egypt's boundaries with a small buffer
    const bounds = { 
      west: 24.0, 
      south: 21.0, 
      east: 37.0, 
      north: 32.0 
    };

    console.log('Snap-back bounds check initialized:', bounds);

    this.map.on('moveend', () => {
      // Skip if we're already in a snap-back animation
      if (this.isSnappingBack) {
        console.log('Already snapping back, skipping...');
        return;
      }

      // Skip during the initial loading animation
      if (this.isLoading) {
        console.log('Map still loading, skipping bounds check...');
        return;
      }

      const center = this.map.getCenter();
      const zoom = this.map.getZoom();

      // Log current position for debugging
      console.log('Current position:', {
        lng: center.lng.toFixed(4),
        lat: center.lat.toFixed(4),
        zoom: zoom.toFixed(2)
      });

      // Check if the map center is within Egypt's boundaries
      const isWithinBounds = (
        center.lng >= bounds.west && 
        center.lng <= bounds.east && 
        center.lat >= bounds.south && 
        center.lat <= bounds.north
      );

      if (isWithinBounds) {
        console.log('Within bounds, no action needed');
        return;
      }

      // User has moved outside Egypt - trigger snap back
      console.log('Outside bounds! Snapping back to Egypt...');
      console.log('Bounds violation:', {
        west: center.lng < bounds.west,
        east: center.lng > bounds.east,
        south: center.lat < bounds.south,
        north: center.lat > bounds.north
      });

      // Set the flag and start the snap-back animation
      this.isSnappingBack = true;

      // Hide any open popups during snap-back
      this.hidePopup();

      // Smooth animation back to Egypt's center
      this.map.flyTo({
        center: this.config.center,
        zoom: zoom,
        duration: 1500,
        curve: 1.2, // Smooth curve
        essential: true // Ensures the animation can't be interrupted
      }).once('moveend', () => {
        // After the animation finishes, reset the flag
        console.log('Snap-back animation completed');
        this.isSnappingBack = false;
      });
    });

    // Also add drag and zoom event listeners for more responsive checking
    let boundsCheckTimeout;

    const checkBoundsDelayed = () => {
      clearTimeout(boundsCheckTimeout);
      boundsCheckTimeout = setTimeout(() => {
        if (!this.isSnappingBack && !this.isLoading) {
          const center = this.map.getCenter();
          const isWithinBounds = (
            center.lng >= bounds.west && 
            center.lng <= bounds.east && 
            center.lat >= bounds.south && 
            center.lat <= bounds.north
          );

          if (!isWithinBounds) {
            console.log('Bounds check triggered during interaction');
            this.map.fire('moveend');
          }
        }
      }, 500); // Check after 500ms of inactivity
    };

    this.map.on('drag', checkBoundsDelayed);
    this.map.on('zoom', checkBoundsDelayed);

    console.log('Enhanced snap-back functionality activated');
  }


  applyIsraelFilter() {
    try {
      const style = this.map.getStyle();
      if (!style || !style.layers) return;

      const namesToHide = [
        'israel', 'ישראל', 'jerusalem', 'tel aviv', 'haifa', 
        'beer sheva', 'eilat', 'nazareth', 'netanya', 'ashdod',
        'rishon lezion', 'petah tikva'
      ];

      style.layers.forEach(layer => {
        if (layer.type === 'symbol' && layer.layout?.['text-field']) {
          
          const nameFilterCondition = [
            '!',
            ['in',
              ['downcase', ['coalesce', ['get', 'name:en'], ['get', 'name_en'], ['get', 'name_int'], ['get', 'name:latin'], ['get', 'name']]],
              ['literal', namesToHide]
            ]
          ];
          
          // --- THIS IS THE CORRECTED MERGING LOGIC ---
          const existingFilter = layer.filter;
          let combinedFilter;

          if (!existingFilter) {
            // If no filter exists, create a new 'all' filter with our condition.
            combinedFilter = ['all', nameFilterCondition];
          } else if (existingFilter[0] === 'all') {
            // If an 'all' filter already exists, add our condition to it.
            combinedFilter = [...existingFilter, nameFilterCondition];
          } else {
            // If a simple filter exists, wrap both in a new 'all' filter.
            combinedFilter = ['all', existingFilter, nameFilterCondition];
          }
          
          try {
            this.map.setFilter(layer.id, combinedFilter);
          } catch (layerError) {
            console.warn(`Could not apply filter to layer '${layer.id}':`, layerError.message);
          }
        }
      });
      console.log('Final Israel filter applied successfully.');
    } catch (error) {
      console.error('Error applying the final Israel filter:', error);
    }
  }


  hideLoading() {
    const loadingEl = document.getElementById('map-loading');
    if (loadingEl) {
      loadingEl.classList.add('hidden');
      loadingEl.style.display = 'none';
    }
    this.isLoading = false;
    console.log('Loading screen hidden');
  }


  createStylizedMarkers() {
    console.log('Creating stylized markers...');
    // Clear existing markers
    this.clearMarkers();


    this.locations.forEach((location) => {
      const markerElement = document.createElement('div');
      markerElement.className = `stylized-pin pin-${location.category}`;
      markerElement.setAttribute('data-category', location.category);
      markerElement.setAttribute('data-location-id', location.id);
      markerElement.setAttribute('tabindex', '0');
      markerElement.setAttribute('role', 'button');
      markerElement.setAttribute('aria-label', `${location.name} - ${location.description}`);


      const marker = new maplibregl.Marker({
        element: markerElement,
        anchor: 'center',
        offset: [0, 0]
      })
      .setLngLat(location.coords)
      .addTo(this.map);


      // Mouse events for desktop hover
      markerElement.addEventListener('mouseenter', (e) => {
        clearTimeout(this.hoverTimeout);
        this.showPopup(location, e);
      });


      markerElement.addEventListener('mouseleave', () => {
        this.hoverTimeout = setTimeout(() => {
          this.hidePopup();
        }, 200);
      });


      // Click events for mobile and desktop
      markerElement.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Marker clicked:', location.name);

        if (this.activePopup === location.id) {
          this.hidePopup();
        } else {
          this.showPopup(location, e);
        }
      });


      // Touch events for mobile
      markerElement.addEventListener('touchstart', (e) => {
        e.preventDefault();
        console.log('Marker touched:', location.name);
        if (this.activePopup === location.id) {
          this.hidePopup();
        } else {
          this.showPopup(location, e);
        }
      }, { passive: false });


      // Keyboard navigation
      markerElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.showPopup(location, e);
        } else if (e.key === 'Escape') {
          this.hidePopup();
        }
      });


      this.markers.push({ marker, location, element: markerElement });
    });


    console.log(`Created ${this.markers.length} markers`);
    this.applyCurrentFilter();
  }


  showPopup(location, event) {
    console.log('Showing popup for:', location.name);

    if (!this.popupElement || !this.popupImage || !this.popupTitle || !this.popupDescription) {
      console.error('Popup elements not found');
      return;
    }


    clearTimeout(this.hoverTimeout);

    this.activePopup = location.id;

    // Update popup content
    this.popupImage.src = location.image;
    this.popupImage.alt = location.name;
    this.popupTitle.textContent = location.name;
    this.popupDescription.textContent = location.description;


    // Position popup
    this.positionPopup(event);


    // Show popup with animation
    this.popupElement.classList.remove('hidden');
    this.popupElement.offsetHeight;
    this.popupElement.classList.add('visible');

    console.log('Popup should now be visible');
  }


  positionPopup(event) {
    if (!this.popupElement) return;


    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;


    const mapRect = mapContainer.getBoundingClientRect();
    const popupWidth = 300;
    const popupHeight = 220;
    const margin = 15;


    let x, y;


    // Get position based on event type
    if (event.type === 'mouseenter' && event.clientX && event.clientY) {
      x = event.clientX - mapRect.left;
      y = event.clientY - mapRect.top;
    } else {
      // For touch/click events or fallback, position relative to pin
      const pinRect = event.target.getBoundingClientRect();
      x = pinRect.left - mapRect.left + (pinRect.width / 2);
      y = pinRect.top - mapRect.top;
    }


    // Horizontal positioning - prefer right side, fall back to left
    if (x + popupWidth + margin > mapRect.width) {
      x = x - popupWidth - margin;
      if (x < margin) {
        x = mapRect.width - popupWidth - margin;
      }
    }

    // Ensure minimum left margin
    if (x < margin) {
      x = margin;
    }


    // Vertical positioning - prefer above, fall back to below
    if (y - popupHeight - margin < 0) {
      y = y + 35;
    } else {
      y = y - popupHeight - margin;
    }


    // Ensure popup stays within vertical bounds
    if (y + popupHeight + margin > mapRect.height) {
      y = mapRect.height - popupHeight - margin;
    }
    if (y < margin) {
      y = margin;
    }


    // Apply positioning
    this.popupElement.style.left = `${x}px`;
    this.popupElement.style.top = `${y}px`;
  }


  hidePopup() {
    if (!this.popupElement) return;


    this.popupElement.classList.remove('visible');
    this.popupElement.classList.add('hidden');
    this.activePopup = null;
    clearTimeout(this.hoverTimeout);
    console.log('Popup hidden');
  }


  clearMarkers() {
    this.markers.forEach(({ marker }) => {
      marker.remove();
    });
    this.markers = [];
    this.hidePopup();
  }


  applyCurrentFilter() {
    this.markers.forEach(({ marker, location, element }) => {
      const shouldShow = this.currentFilter === 'all' || location.category === this.currentFilter;

      if (shouldShow) {
        element.style.display = 'block';
        element.style.opacity = '1';
        element.classList.remove('marker-fade-out');
        element.classList.add('marker-fade-in');
      } else {
        element.style.opacity = '0';
        element.classList.remove('marker-fade-in');
        element.classList.add('marker-fade-out');
        setTimeout(() => {
          if (element.classList.contains('marker-fade-out')) {
            element.style.display = 'none';
          }
        }, 400);
      }
    });


    // Hide popup if filtered location is no longer visible
    if (this.activePopup) {
      const activeLocation = this.locations.find(loc => loc.id === this.activePopup);
      if (activeLocation && this.currentFilter !== 'all' && activeLocation.category !== this.currentFilter) {
        this.hidePopup();
      }
    }
  }


  setFilter(filterType) {
    if (this.currentFilter === filterType) return;

    this.currentFilter = filterType;
    this.updateFilterUI();
    this.applyCurrentFilter();
  }


  updateFilterUI() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    const activeBtn = document.querySelector(`[data-filter="${this.currentFilter}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }
  }


  updateFilterCounts() {
    const counts = {
      all: this.locations.length,
      universities: this.locations.filter(p => p.category === 'universities').length,
      techparks: this.locations.filter(p => p.category === 'techparks').length,
      innovation: this.locations.filter(p => p.category === 'innovation').length
    };


    Object.entries(counts).forEach(([category, count]) => {
      const countEl = document.getElementById(`count-${category}`);
      if (countEl) {
        countEl.textContent = count;
      }
    });
  }


  changeMapStyle(style, colorScheme = 'default') {
    const newStyleUrl = this.mapStyles[style].colors[colorScheme].url;

    this.currentStyle = style;
    this.currentColorScheme = colorScheme;

    this.map.setStyle(newStyleUrl);
    this.hidePopup();

    this.map.once('styledata', () => {
      try {
        // --- CORRECTION HERE ---
        // Changed 'name' back to 'type' to ensure globe is kept on style change.
        this.map.setProjection({ type: 'globe' });
        console.log('Globe projection maintained after style change.');
      } catch (error) {
        console.warn('Globe projection not supported after style change:', error);
      }
      this.map.on('load', () => {
  console.log('Map loaded with globe projection, starting animation sequence...');

  // --- ADD THIS LINE HERE ---
  this.map.setPaintProperty('background', 'background-color', '#0B1026');
  // -------------------------

  // Find the first layer with text/icons...
  // ... the rest of your function
});

      if (this.animationComplete) {
        this.createStylizedMarkers();
      }
      setTimeout(() => {
        this.applyCurrentTheme();
        this.applyIsraelFilter();
      }, 100);
    });
  }


  applyCurrentTheme() {
    if (this.currentColorScheme === 'oceanic') {
      this.applyOceanicTheme();
    }
  }


  applyOceanicTheme() {
    try {
      setTimeout(() => {
        const style = this.map.getStyle();
        if (!style || !style.layers) return;


        style.layers.forEach(layer => {
          try {
            if (layer.type === 'background') {
              this.map.setPaintProperty(layer.id, 'background-color', this.oceanicTheme.navyBackground);
            } else if (layer.type === 'fill') {
              if (layer.id.includes('water') || layer.id.includes('ocean') || layer.id.includes('sea')) {
                this.map.setPaintProperty(layer.id, 'fill-color', this.oceanicTheme.tealWater);
              } else if (layer.id.includes('land') || layer.id.includes('country') || layer.id.includes('admin')) {
                this.map.setPaintProperty(layer.id, 'fill-color', this.oceanicTheme.mutedBlueGray);
              }
            } else if (layer.type === 'line') {
              if (layer.id.includes('road') || layer.id.includes('highway') || layer.id.includes('street')) {
                const roadColor = this.currentStyle === 'dark' ? this.oceanicTheme.deepTeal : this.oceanicTheme.accentTeal;
                this.map.setPaintProperty(layer.id, 'line-color', '#ffffffff')
                this.map.setPaintProperty(layer.id, 'line-width', 1);
                this.map.setPaintProperty(layer.id, 'line-blur', 0);
              }
            }
          } catch (layerError) {
            // Ignore individual layer errors
          }
        });
      }, 200);
    } catch (error) {
      console.warn('Could not apply oceanic theme:', error);
    }
  }


  setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const filter = btn.getAttribute('data-filter');
        this.setFilter(filter);
      });
    });


    // Style selector
    const styleSelector = document.getElementById('style-selector');
    if (styleSelector) {
      styleSelector.addEventListener('change', (e) => {
        this.changeMapStyle(e.target.value, this.currentColorScheme);
      });
    }


    // Color selector
    const colorSelector = document.getElementById('color-selector');
    if (colorSelector) {
      colorSelector.addEventListener('change', (e) => {
        this.changeMapStyle(this.currentStyle, e.target.value);
      });
    }


    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hidePopup();
      }

      if (e.target.classList.contains('filter-btn')) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.target.click();
        }
      }
    });


    // Window resize handler for popup positioning
    window.addEventListener('resize', () => {
      if (this.activePopup) {
        this.hidePopup();
      }
    });


    // Touch optimization for mobile
    if ('ontouchstart' in window) {
      document.querySelectorAll('.filter-btn').forEach(el => {
        el.style.cursor = 'pointer';
      });
    }
  }


  // Public API methods
  focusOnLocation(locationName) {
    const location = this.locations.find(p => p.name === locationName);
    if (location) {
      this.map.flyTo({
        center: location.coords,
        zoom: 10,
        duration: 1000
      });

      setTimeout(() => {
        const markerData = this.markers.find(m => m.location.name === locationName);
        if (markerData) {
          const mockEvent = {
            type: 'programmatic',
            target: markerData.element,
            clientX: window.innerWidth / 2,
            clientY: window.innerHeight / 2
          };
          this.showPopup(location, mockEvent);
        }
      }, 1000);
    }
  }


  resetView() {
    // Hide any open popups before animating
    this.hidePopup();
    
    // Animate the camera back to the initial globe view
    this.map.flyTo({
      center: this.config.globeCenter, // Fly back to the globe's center point
      zoom: this.config.globeZoom,     // Zoom out to the far-away view
      pitch: 0,                        // Reset the camera angle
      bearing: 0,                      // Reset the camera rotation
      duration: 3000                   // A smooth 3-second animation
    });
  }


  getVisibleMarkers() {
    return this.markers.filter(({ location }) => 
      this.currentFilter === 'all' || location.category === this.currentFilter
    );
  }
}


// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check if MapLibre GL is loaded
  if (typeof maplibregl === 'undefined') {
    console.error('MapLibre GL JS is not loaded');
    const loadingEl = document.getElementById('map-loading');
    if (loadingEl) {
      loadingEl.innerHTML = `
        <div style="text-align: center; color: var(--color-error);">
          <h3>Error Loading Map</h3>
          <p>Could not load mapping library. Please refresh the page.</p>
        </div>
      `;
    }
    return;
  }


  console.log('Initializing Egypt Explorer with MapLibre GL v5.7.3 and enhanced globe projection...');

  // Initialize the Egypt Explorer application
  window.egyptExplorer = new EgyptExplorer();


  // Add some development helpers
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('Egypt Explorer initialized with true 3D globe projection and dramatic animation');
    console.log('Available commands:', {
      'egyptExplorer.focusOnLocation("Cairo University")': 'Focus on a specific location',
      'egyptExplorer.resetView()': 'Reset to default view',
      'egyptExplorer.setFilter("universities")': 'Filter by category',
      'egyptExplorer.getVisibleMarkers()': 'Get currently visible markers'
    });
  }
});


// Handle potential errors
window.addEventListener('error', (e) => {
  console.error('Application error:', e.error);
  const loadingEl = document.getElementById('map-loading');
  if (loadingEl && !loadingEl.classList.contains('hidden')) {
    loadingEl.innerHTML = `
      <div style="text-align: center; color: var(--color-error);">
        <h3>Error Loading Application</h3>
        <p>Please refresh the page to try again.</p>
      </div>
    `;
  }
});


// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EgyptExplorer;
}
