import React, { Component } from 'react';
import { Text, View, Alert, SafeAreaView, ImageBackground, StyleSheet,StatusBar,Dimensions ,Image} from 'react-native';
import axios from "axios";
import { FlatList } from 'react-native-gesture-handler';

export default class MeteorScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            meteors: {},
        };
    }

    componentDidMount() {
        this.getMeteors()
    }

    getMeteors = () => {
        axios
            .get("https://api.nasa.gov/neo/rest/v1/feed?api_key=mau15mDdIodXVvd7bRfOMUX4P3rrIIzaixU84a2I")
            .then(response => {
                this.setState({ meteors: response.data.near_earth_objects })
            })
            .catch(error => {
                Alert.alert(error.message)
            })
    }
    renderItem = ({item})=>{
        let meteor  = item
        let bg_img, speed, size
       if(meteor.threat_score<=30){
           bg_img = require("../assets/meteor_bg1.png")
           speed = require("../assets/meteor_speed3.gif")
           size = 100
       }
       else if(meteor.threat_score<=75){
        bg_img = require("../assets/meteor_bg2.png")
        speed = require("../assets/meteor_speed3.gif")
        size = 50
       }
       else {
        bg_img = require("../assets/meteor_bg3.png")
        speed = require("../assets/meteor_speed3.gif")
        size = 50
       }
       return(
           <View>
          <ImageBackground source={bg_img}
          style = {styles.backgroundImage}>
          <View style={styles.gifContainer}>
          <Image source = {speed} styles={{width:50, height:50, alignSelf:"center"}}></Image>
          <View>
          <Text style = {[styles.cardTitle, {marginTop:400, marginLeft:50}]}>{item.mane}</Text>
          <Text style = {[styles.cardText, {marginTop:20, marginLeft:50}]}>Closest to Earth-{item.close_approach_data[0].close_approach_data_full}</Text>
          <Text style = {[styles.cardText, {marginTop:5, marginLeft:50}]}>Minimum Diameter(km)-{item.estimated_diameter.kilometers.estimated_diameter_min}</Text>
          <Text style = {[styles.cardText, {marginTop:5, marginLeft:50}]}>Maximum Diameter(km)-{item.estimated_diameter.kilometers.estimated_diameter_max}</Text>
          <Text style = {[styles.cardText, {marginTop:5, marginLeft:50}]}>Velocity[km/h]-{item.close_approach_data[0].relative_velocity.kilometers_per_hour}</Text>
          <Text style = {[styles.cardText, {marginTop:20, marginLeft:50}]}>Missing Earth By(km)-{item.close_approach_data[0].miss_distance_kilometers}</Text>

          </View>
          </View>
              </ImageBackground>     
           </View>
       )
    }
    keyExtractor=(item,index)=>index.toString();
    render() {
        if (Object.keys(this.state.meteors).length === 0) {
            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                    <Text>Loading</Text>
                </View>
            )
        } else {
            let meteor_arr = Object.keys(this.state.meteors).map(meteor_date => {
                return this.state.meteors[meteor_date]
            })
            let meteors = [].concat.apply([], meteor_arr);

            meteors.forEach(function (element) {
                let diameter = (element.estimated_diameter.kilometers.estimated_diameter_min + element.estimated_diameter.kilometers.estimated_diameter_max) / 2
                let threatScore = (diameter / element.close_approach_data[0].miss_distance.kilometers) * 1000000000
                element.threat_score = threatScore;
            });
meteors.sort(function(a,b){
    return b.threat_score-a.threat_score
})
meteors=meteors.slice(0,5)
            return (
                <View
                    style={styles.container}>
                    <SafeAreaView style={styles.AndroidSafeArea}/>
                    <FlatList 
                    keyExtractor = {this.keyExtractor} 
                    data={meteors}
                    renderItem = {this.renderItem}
                    horizontal = {true}/>
                    <Text>Meteor Screen!</Text>
                </View>
            )
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    AndroidSafeArea: {
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
    titleBar: {
        flex: 0.15,
        justifyContent: "center",
        alignItems: "center"
    },
    titleText: {
        fontSize: 30,
        fontWeight: "bold",
        color: "white"
    },
    meteorContainer: {
        flex: 0.85
    },
    listContainer: {
        backgroundColor: 'rgba(52, 52, 52, 0.5)',
        justifyContent: "center",
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5,
        borderRadius: 10,
        padding: 10
    },
    cardTitle: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: "bold",
        color: "white"
    },
    cardText: {
        color: "white"
    },
    threatDetector: {
        height: 10,
        marginBottom: 10
    },
    gifContainer: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1 
    },
    meteorDataContainer: {
        justifyContent: "center",
        alignItems: "center",

    }
});