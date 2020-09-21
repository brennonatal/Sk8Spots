import React from 'react'



export default class Home extends React.Component {
  public componentDidMount() {
    let script = document.createElement("script");
    script.setAttribute("src", "map.js");
    script.setAttribute("type", "text/javascript");
    document.body.appendChild(script);

    script = document.createElement("script");
    script.setAttribute("src", "https://maps.googleapis.com/maps/api/js?key=AIzaSyD4spozWoDTZNUj28vTTDSpK1cVgLRRMyE&callback=initMap");
    script.setAttribute("type", "text/javascript");
    document.body.appendChild(script);
  }

  public render() {
    return (
      <div id="map"></div>
    );
  }
}
