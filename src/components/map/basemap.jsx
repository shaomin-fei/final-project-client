import React,{Component} from "react"
import 'ol/ol.css';
import {Map, View} from 'ol';
import {fromLonLat} from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import ImageLayer from 'ol/layer/Image';

export default class BaseMap extends Component{

    
    componentDidMount(){
      
       const  map = new Map({
            target: 'map',
            layers: [
              new TileLayer({
                source: new OSM()
              })
            ],
            view: new View({
              center: fromLonLat([37.41, 8.82]),
              zoom: 4
            })
          });
    }
    render(){
        return (
            <>
             <div id="map" style={{width:200,height:400}}></div>
            </>
        );
    }
}