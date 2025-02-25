import React, {Component} from 'react';
import ReactGA from 'react-ga';
import $ from 'jquery';
import './App.css';
import Header from './Components/Header';
import Footer from './Components/Footer';
import About from './Components/About';
import Resume from './Components/Resume';
import Contact from './Components/Contact';
import Testimonials from './Components/Testimonials';
import Portfolio from './Components/Portfolio';
import {initializeApp} from 'firebase/app';
import {getAnalytics, logEvent} from "firebase/analytics";
import {getFirestore, collection, getDocs} from "firebase/firestore";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            foo: 'bar',
            resumeData: {},
            certificationData: [],
        };

        ReactGA.initialize('UA-110570651-1');
        ReactGA.pageview(window.location.pathname);

    }


    getResumeData() {
        $.ajax({
            url: '/resumeData.json',
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({resumeData: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.log(err);
                alert(err);
            }
        });
    }

    async createFireabaseApp() {
        const firebaseConfig = {
            apiKey: "AIzaSyAD3GE33F0fzItUglnYDXPCk0OoXxpqX4M",
            authDomain: "hayridurmaz.firebaseapp.com",
            projectId: "hayridurmaz",
            storageBucket: "hayridurmaz.firebasestorage.app",
            messagingSenderId: "648897014275",
            appId: "1:648897014275:web:318254dc4ff46fc1133c36",
            measurementId: "G-1E3FK6HQ2V"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
        const response = await fetch('https://geolocation-db.com/json/');
        const data = await response.json();
        logEvent(analytics, 'screen_view', {
            firebase_screen: "MAIN_SCREEN",
            firebase_screen_class: data?.country_name,
        });
        const db = getFirestore(app);
        const querySnapshot = await getDocs(collection(db, "certificates"));
        let certs = []
        querySnapshot.forEach((doc) => {
            certs.push(doc.data());
        });
        certs.sort((a, b) => {
            return a.title.localeCompare(b.title);
        });
        this.setState({certificationData: certs});
    }

    componentDidMount() {
        this.getResumeData();
        this.createFireabaseApp();
    }

    render() {
        return (
            <div className="App">
                <Header data={this.state.resumeData.main}/>
                <About data={this.state.resumeData.main}/>
                <Resume certificates={this.state.certificationData} data={this.state.resumeData.resume}/>
                <Portfolio data={this.state.resumeData.portfolio}/>
                <Testimonials data={this.state.resumeData.testimonials}/>
                <Contact data={this.state.resumeData.main}/>
                <Footer data={this.state.resumeData.main}/>
            </div>
        );
    }
}

export default App;
