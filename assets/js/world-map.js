(() => {
  const featureRequests = new Map();
  const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const loadFeatures = ({ url, topojson }) => {
    if (!featureRequests.has(url)) {
      featureRequests.set(url, fetch(url)
        .then((response) => {
          if (!response.ok) throw new Error(`Map data request failed: ${response.status}`);
          return response.json();
        })
        .then((world) => {
          if (!world?.objects?.countries) throw new Error("Map data does not contain country geometry.");
          return topojson.feature(world, world.objects.countries);
        }));
    }
    return featureRequests.get(url);
  };

  const renderBase = ({ d3, svg, countryLayer, features, canvas, heightForWidth, padding = 20 }) => {
    const width = canvas.clientWidth;
    if (!features || width < 1) return null;
    const height = heightForWidth(width);
    svg.attr("viewBox", `0 0 ${width} ${height}`);
    const projection = d3.geoNaturalEarth1().fitExtent(
      [[padding, padding], [width - padding, height - padding]],
      features,
    );
    const path = d3.geoPath(projection);
    countryLayer.selectAll("path").data(features.features).join("path").attr("d", path);
    return { height, path, projection, width };
  };

  const createZoom = ({ d3, svg, viewport, cssVariable, onZoom }) => {
    const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", (event) => {
      viewport.attr("transform", event.transform);
      viewport.style(cssVariable, event.transform.k);
      onZoom?.(event);
    });
    svg.call(zoom);
    return zoom;
  };

  const bindZoomControls = ({ root, selector, dataAttribute, d3, svg, zoom }) => {
    root.querySelectorAll(selector).forEach((control) => {
      control.addEventListener("click", () => {
        const action = control.dataset[dataAttribute];
        const transition = svg.transition().duration(reducedMotion() ? 0 : 250);
        if (action === "in") transition.call(zoom.scaleBy, 1.5);
        if (action === "out") transition.call(zoom.scaleBy, 1 / 1.5);
        if (action === "reset") transition.call(zoom.transform, d3.zoomIdentity);
      });
    });
  };

  const positionTooltip = ({ tooltip, canvas, event }) => {
    const bounds = canvas.getBoundingClientRect();
    const left = event?.clientX ? event.clientX - bounds.left : bounds.width / 2;
    const top = event?.clientY ? event.clientY - bounds.top : bounds.height / 2;
    tooltip.style.left = `${Math.max(12, Math.min(left, bounds.width - 12))}px`;
    tooltip.style.top = `${Math.max(12, top)}px`;
  };

  const observeResize = (element, render) => {
    const observer = new ResizeObserver(render);
    observer.observe(element);
    return observer;
  };

  window.IBLWorldMap = Object.freeze({
    bindZoomControls,
    createZoom,
    loadFeatures,
    observeResize,
    positionTooltip,
    renderBase,
  });
})();
