// Shared helpers for the D3 world maps on the Partners and Events pages.
// Exposed as window.IBLWorldMap; page scripts own their data and selection UI.
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

  const createZoom = ({ d3, svg, viewport, cssVariable = "--map-zoom", onZoom }) => {
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

  // Returns show(renderContent, event) / hide(); renderContent fills the empty tooltip node.
  const createTooltip = ({ tooltip, canvas }) => ({
    show(renderContent, event) {
      if (!tooltip) return;
      tooltip.replaceChildren();
      renderContent(tooltip);
      tooltip.hidden = false;
      positionTooltip({ tooltip, canvas, event });
    },
    hide() {
      if (tooltip) tooltip.hidden = true;
    },
  });

  // A hard two-colour split used for markers that mix two categories.
  const appendMixedGradient = ({ svg, id, firstStopClass, secondStopClass }) => {
    const gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", id)
      .attr("x1", "0%")
      .attr("x2", "100%");
    gradient.append("stop").attr("class", firstStopClass).attr("offset", "0%");
    gradient.append("stop").attr("class", firstStopClass).attr("offset", "50%");
    gradient.append("stop").attr("class", secondStopClass).attr("offset", "50%");
    gradient.append("stop").attr("class", secondStopClass).attr("offset", "100%");
    return gradient;
  };

  // Joins one keyboard-operable marker (hit area, dot, count) per datum onto a layer.
  const createMarkers = ({ layer, data, key, position, modifier, label, count, onSelect, onHover, onLeave }) => {
    const markers = layer
      .selectAll("g")
      .data(data, key)
      .join((enter) => {
        const marker = enter.append("g").attr("role", "button").attr("tabindex", 0);
        marker.append("circle").attr("class", "world-map__marker-hit");
        marker.append("circle").attr("class", "world-map__marker-dot");
        marker.append("text").attr("class", "world-map__marker-count").attr("text-anchor", "middle").attr("dy", "0.35em");
        return marker;
      })
      .attr("class", (datum) => `world-map__marker ${modifier(datum)}`)
      .attr("transform", (datum) => `translate(${position(datum).join(",")})`)
      .attr("aria-label", label)
      .on("pointerenter", (event, datum) => onHover(datum, event))
      .on("pointermove", (event, datum) => onHover(datum, event))
      .on("pointerleave", onLeave)
      .on("focus", (event, datum) => onHover(datum))
      .on("blur", onLeave)
      .on("click", (event, datum) => onSelect(datum))
      .on("keydown", (event, datum) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(datum);
        }
      });
    markers.select(".world-map__marker-count").text(count);
    return markers;
  };

  const setSelectedMarkers = (layer, isSelected) => {
    layer.selectAll(".world-map__marker").classed("is-selected", isSelected);
  };

  const scrollToSelection = (element) => {
    element.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "nearest" });
  };

  const observeResize = (element, render) => {
    const observer = new ResizeObserver(render);
    observer.observe(element);
    return observer;
  };

  window.IBLWorldMap = Object.freeze({
    appendMixedGradient,
    bindZoomControls,
    createMarkers,
    createTooltip,
    createZoom,
    loadFeatures,
    observeResize,
    positionTooltip,
    reducedMotion,
    renderBase,
    scrollToSelection,
    setSelectedMarkers,
  });
})();
